import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSessionRecord, attachSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    const body = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid submission data." },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = parsed.data;

    // Rate limit check: max 7 attempts per 5 minutes per IP + email
    const rateCheck = checkRateLimit(`${ip}:${email}`, "login", 7, 5 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many unsuccessful sign-in attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    // Lookup user by normalized email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        traineeProfile: true,
        trainerProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      // Generic message to prevent enumeration
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password hash (Argon2id or bcrypt)
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Account status checks
    if (!user.isActive || user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "This institutional account has been deactivated. Please contact your directorate administrator." },
        { status: 403 }
      );
    }

    if (user.status === "PENDING_APPROVAL" || !user.isApproved) {
      return NextResponse.json(
        {
          error: "Your account is currently awaiting administrator review and approval.",
        },
        { status: 403 }
      );
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(() => {});

    // Create session in DB
    const { token, expiresAt } = await createSessionRecord(user.id, userAgent, ip, rememberMe);

    // Authoritative server-side role destination
    let redirectUrl = "/trainee/dashboard";
    if (user.role === "ADMIN") {
      redirectUrl = "/admin/dashboard";
    } else if (user.role === "TRAINER") {
      redirectUrl = "/trainer/dashboard";
    }

    const response = NextResponse.json({
      success: true,
      redirectUrl,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName || user.name,
        role: user.role,
        organization: user.organization,
        designation: user.designation,
        avatarUrl: user.avatarUrl,
        status: user.status,
      },
    });

    // Attach secure HTTP-only cookie
    return attachSessionCookie(response, token, expiresAt);
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
