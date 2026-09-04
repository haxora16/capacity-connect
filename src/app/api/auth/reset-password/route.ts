import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePasswordRequirements } from "@/lib/password";
import { hashToken } from "@/lib/auth";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid submission." },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    const pwdCheck = validatePasswordRequirements(password);
    if (!pwdCheck.valid) {
      return NextResponse.json(
        { error: pwdCheck.errors[0] },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt !== null || resetRecord.expiresAt <= new Date()) {
      return NextResponse.json(
        { error: "This password recovery link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash the new password with Argon2id
    const newPasswordHash = await hashPassword(password);

    // Update user password and mark token used in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newPasswordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate all existing sessions for security
      prisma.session.deleteMany({
        where: { userId: resetRecord.userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. Please sign in with your new credentials.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
