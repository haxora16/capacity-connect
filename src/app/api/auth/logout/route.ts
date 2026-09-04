import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, invalidateSession, clearSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Read raw cookie header or cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const cookiesList = cookieHeader.split(";").map((c) => c.trim());
    const sessionCookie = cookiesList.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    const token = sessionCookie ? sessionCookie.split("=")[1] : undefined;

    if (token) {
      await invalidateSession(token);
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    return clearSessionCookie(response);
  } catch (error) {
    console.error("Logout error:", error);
    const response = NextResponse.json({ error: "Failed to logout" }, { status: 500 });
    return clearSessionCookie(response);
  }
}
