import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        traineeProfile: true,
        trainerProfile: true,
        enrollments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        organization: u.organization,
        designation: u.designation,
        avatarUrl: u.avatarUrl,
        enrollmentsCount: u.enrollments.length,
        createdAt: u.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, action, newRole, newStatus } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const data: any = {};
    if (newRole) data.role = newRole;
    if (newStatus) data.status = newStatus;
    if (action === "APPROVE") {
      data.status = "ACTIVE";
      data.isApproved = true;
    }
    if (action === "SUSPEND") data.status = "SUSPENDED";

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    if (action === "APPROVE") {
      await createNotification({
        userId,
        title: "Account approved",
        message: "Your trainer account has been verified and approved by the administrator.",
        type: "TRAINING",
      });
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
