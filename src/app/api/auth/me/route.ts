import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookiesList = cookieHeader.split(";").map((c) => c.trim());
    const sessionCookie = cookiesList.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    const token = sessionCookie ? sessionCookie.split("=")[1] : undefined;

    const user = await getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("Auth me endpoint error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
