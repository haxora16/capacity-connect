import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import { emailService } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const body = await req.json().catch(() => null);
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid email address." },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Rate limit: max 4 requests per 15 minutes
    const rateCheck = checkRateLimit(`${ip}:${email}`, "forgot-password", 4, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many password reset requests. Please wait ${rateCheck.retryAfterSeconds} seconds before requesting again.`,
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.isActive) {
      // Invalidate existing unused tokens for this user
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      }).catch(() => {});

      // Create new secure random token
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt,
        },
      });

      // Dispatch reset email
      await emailService.sendPasswordResetEmail(user.email, rawToken, user.fullName || user.name);
    }

    // Always respond with a generic success message to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an institutional account exists with that email address, password recovery instructions have been dispatched.",
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "Failed to process password recovery request. Please try again." },
      { status: 500 }
    );
  }
}
