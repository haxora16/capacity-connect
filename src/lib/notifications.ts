import { prisma } from "@/lib/prisma";

export type NotificationType =
  | "COURSE"
  | "ASSESSMENT"
  | "CERTIFICATE"
  | "ANNOUNCEMENT"
  | "TRAINING"
  | "SYSTEM";

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}

/**
 * Creates a single notification for a specific user in the database.
 */
export async function createNotification({
  userId,
  title,
  message,
  type = "SYSTEM",
}: CreateNotificationParams) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        isRead: false,
      },
    });
  } catch (error) {
    console.error(`Failed to create notification for user ${userId}:`, error);
    return null;
  }
}

/**
 * Broadcasts a notification to all users matching a specific role.
 */
export async function notifyRole({
  role,
  title,
  message,
  type = "ANNOUNCEMENT",
}: {
  role: "TRAINEE" | "TRAINER" | "ADMIN" | "ALL";
  title: string;
  message: string;
  type?: NotificationType;
}) {
  try {
    const where = role === "ALL" ? { isActive: true } : { role, isActive: true };
    const users = await prisma.user.findMany({
      where,
      select: { id: true },
    });

    if (users.length === 0) return 0;

    await prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        title,
        message,
        type,
        isRead: false,
      })),
    });

    return users.length;
  } catch (error) {
    console.error(`Failed to broadcast notifications to role ${role}:`, error);
    return 0;
  }
}

/**
 * Sends a notification to all administrators.
 */
export async function notifyAdmins({
  title,
  message,
  type = "SYSTEM",
}: {
  title: string;
  message: string;
  type?: NotificationType;
}) {
  return notifyRole({ role: "ADMIN", title, message, type });
}
