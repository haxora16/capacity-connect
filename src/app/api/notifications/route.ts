import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.notification.count({
        where: { userId: user.id, isRead: false },
      }),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getAuthenticatedUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { id, markAllRead } = body;

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true },
      });
    } else if (id) {
      await prisma.notification.updateMany({
        where: { id, userId: user.id },
        data: { isRead: true },
      });
    } else {
      return NextResponse.json(
        { error: "Notification ID or markAllRead required" },
        { status: 400 }
      );
    }

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return NextResponse.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Notification mark-as-read error:", error);
    return NextResponse.json(
      { error: "Failed to update notification status" },
      { status: 500 }
    );
  }
}
