import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const where: any = { isPublished: true };
    if (role && role !== "ADMIN") {
      where.OR = [{ targetRole: "ALL" }, { targetRole: role }];
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [{ isUrgent: "desc" }, { publishDate: "desc" }],
    });

    return NextResponse.json({
      announcements: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        summary: a.summary,
        content: a.content,
        category: a.category,
        targetRole: a.targetRole,
        isUrgent: a.isUrgent,
        isPublished: a.isPublished,
        publishDate: a.publishDate.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Announcements API error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, summary, content, category = "General", targetRole = "ALL", isUrgent = false } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        summary: summary || title,
        content,
        category,
        targetRole,
        isUrgent: !!isUrgent,
        isPublished: true,
      },
    });

    return NextResponse.json({ announcement: newAnnouncement }, { status: 201 });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ error: "Failed to publish announcement" }, { status: 500 });
  }
}
