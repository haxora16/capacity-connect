import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole, UserSession } from "@/types";

export const SESSION_COOKIE_NAME = "capacity_session";
export const DEFAULT_SESSION_EXPIRY_DAYS = 7;
export const EXTENDED_SESSION_EXPIRY_DAYS = 30;

/**
 * Computes a SHA-256 hash of a raw token for secure database storage.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new database session record and returns the raw token and expiration date.
 */
export async function createSessionRecord(
  userId: string,
  userAgent?: string | null,
  ipAddress?: string | null,
  rememberMe = false
): Promise<{ token: string; expiresAt: Date }> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const sessionToken = hashToken(rawToken);

  const days = rememberMe ? EXTENDED_SESSION_EXPIRY_DAYS : DEFAULT_SESSION_EXPIRY_DAYS;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  // Store hashed session in database
  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expiresAt,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    },
  });

  return { token: rawToken, expiresAt };
}

/**
 * Attaches the secure HTTP-only session cookie to an outgoing NextResponse.
 */
export function attachSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date
): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return response;
}

/**
 * Clears the session cookie from an outgoing NextResponse.
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

/**
 * Helper for Server Actions where `cookies()` is available in the request scope.
 */
export async function createSession(
  userId: string,
  userAgent?: string | null,
  ipAddress?: string | null,
  rememberMe = false
): Promise<{ token: string; expiresAt: Date }> {
  const { token, expiresAt } = await createSessionRecord(userId, userAgent, ipAddress, rememberMe);

  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });
  } catch {
    // If outside cookie store context (e.g. standard Route Handler), attachSessionCookie should be used on the NextResponse
  }

  return { token, expiresAt };
}

/**
 * Validates a session token string against the database.
 * Auto-rotates/extends session expiry if half of duration has elapsed.
 */
export async function validateSessionToken(rawToken: string) {
  if (!rawToken) return null;

  const sessionToken = hashToken(rawToken);
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        include: {
          traineeProfile: true,
          trainerProfile: true,
          adminProfile: true,
        },
      },
    },
  });

  if (!session) return null;

  const now = new Date();
  if (session.expiresAt <= now) {
    // Session expired; delete it
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  if (!session.user.isActive) {
    return null;
  }

  // Extend session if past 50% lifetime
  const sessionDuration = session.expiresAt.getTime() - session.createdAt.getTime();
  const timeRemaining = session.expiresAt.getTime() - now.getTime();
  if (timeRemaining < sessionDuration / 2) {
    const newExpiresAt = new Date(now.getTime() + DEFAULT_SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: newExpiresAt },
    });
  }

  return {
    session,
    user: session.user,
  };
}

/**
 * Retrieves the currently authenticated user from a session token or request cookie.
 */
export async function getCurrentUser(tokenOverride?: string): Promise<UserSession | null> {
  try {
    let token = tokenOverride;
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      } catch {
        token = undefined;
      }
    }
    if (!token) return null;

    const validated = await validateSessionToken(token);
    if (!validated) return null;

    const u = validated.user;
    return {
      id: u.id,
      email: u.email,
      name: u.fullName || u.name,
      role: u.role as UserRole,
      organization: u.organization,
      designation: u.designation,
      avatarUrl: u.avatarUrl,
      status: u.status as any,
    };
  } catch (err) {
    console.error("Error reading current user session:", err);
    return null;
  }
}

/**
 * Robust helper to extract authenticated user from a Route Handler's Request object.
 */
export async function getAuthenticatedUserFromRequest(req: Request): Promise<UserSession | null> {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookiesList = cookieHeader.split(";").map((c) => c.trim());
    const sessionCookie = cookiesList.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    const token = sessionCookie ? sessionCookie.split("=")[1] : undefined;
    return getCurrentUser(token);
  } catch (err) {
    console.error("Error extracting user from request:", err);
    return null;
  }
}

/**
 * Invalidates a session in the database.
 */
export async function invalidateSession(token: string): Promise<void> {
  if (!token) return;
  const sessionToken = hashToken(token);
  await prisma.session.deleteMany({
    where: { sessionToken },
  }).catch(() => {});
}

/**
 * Server Action helper to destroy session and cookie.
 */
export async function destroyCurrentSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      await invalidateSession(token);
    }
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  } catch (err) {
    console.error("Error destroying session:", err);
  }
}

/**
 * Generates a cryptographically secure random token (e.g. for password resets).
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}
