import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePasswordRequirements } from "@/lib/password";
import { createSessionRecord, attachSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { notifyAdmins } from "@/lib/notifications";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
    organization: z.string().min(2, "Organization name is required."),
    designation: z.string().optional().default(""),
    role: z.enum(["TRAINEE", "TRAINER"], {
      message: "Please select a valid role (Trainee or Trainer).",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    const rateCheck = checkRateLimit(ip, "signup", 10, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many accounts created recently. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid submission data." },
        { status: 400 }
      );
    }

    const { fullName, email, password, organization, designation, role } = parsed.data;

    // Validate password complexity
    const pwdValidation = validatePasswordRequirements(password);
    if (!pwdValidation.valid) {
      return NextResponse.json(
        { error: pwdValidation.errors[0] },
        { status: 400 }
      );
    }

    // Check unique email
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password with Argon2id
    const passwordHash = await hashPassword(password);

    // Trainer accounts marked PENDING_APPROVAL
    const isTrainer = role === "TRAINER";
    const status = isTrainer ? "PENDING_APPROVAL" : "ACTIVE";
    const isApproved = !isTrainer;

    // Create User record
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        fullName,
        passwordHash,
        role,
        organization,
        designation: designation || (isTrainer ? "Trainer" : "Trainee"),
        status,
        isActive: true,
        isApproved,
      },
    });

    // Create Role-Specific Profile
    if (role === "TRAINEE") {
      const profile = await prisma.traineeProfile.create({
        data: {
          userId: user.id,
          qualifications: JSON.stringify(["Atmospheric Science / Meteorology"]),
          skills: JSON.stringify(["Operational Forecasting", "Data Analysis"]),
          experienceYears: 1,
          interests: JSON.stringify(["Radar Meteorology", "Numerical Weather Prediction"]),
          competencyScore: 60.0,
          designation: designation || "Operational Trainee",
          department: organization,
        },
      });

      // Initialize baseline competency profile
      const defaultSubjects = [
        "Radar Meteorology",
        "Satellite Meteorology",
        "Numerical Weather Prediction",
        "Synoptic Meteorology",
        "Aviation Meteorology",
      ];

      for (const subj of defaultSubjects) {
        await prisma.traineeCompetency.create({
          data: {
            profileId: profile.id,
            subjectArea: subj,
            currentScore: 50,
            targetScore: 85,
            gapScore: 35,
          },
        }).catch(() => {});
      }

      // Automatically sign in the trainee
      const { token, expiresAt } = await createSessionRecord(user.id, userAgent, ip, false);

      const response = NextResponse.json({
        success: true,
        redirectUrl: "/trainee/dashboard",
        message: "Account created successfully.",
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName || user.name,
          role: user.role,
          organization: user.organization,
          designation: user.designation,
          status: user.status,
        },
      });

      return attachSessionCookie(response, token, expiresAt);
    } else {
      // Trainer Profile
      await prisma.trainerProfile.create({
        data: {
          userId: user.id,
          specialization: "General Meteorology & Technical Training",
          subjectExpertise: "Atmospheric Physics",
          qualifications: JSON.stringify(["Master / Doctorate in Atmospheric Sciences"]),
          skills: JSON.stringify(["Curriculum Development", "Technical Instruction"]),
          experienceYears: 3,
          rating: 5.0,
          matchScoreCache: 80.0,
          designation: designation || "Instructor",
          department: organization,
        },
      });

      // Send notification to Administrators
      await notifyAdmins({
        title: "New trainer registration",
        message: `${fullName} has registered as a trainer and is awaiting verification.`,
        type: "SYSTEM",
      });

      return NextResponse.json({
        success: true,
        pendingApproval: true,
        redirectUrl: "/login?status=pending_approval",
        message: "Trainer account registered and submitted for administrator review.",
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName || user.name,
          role: user.role,
          organization: user.organization,
          status: user.status,
        },
      });
    }
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
