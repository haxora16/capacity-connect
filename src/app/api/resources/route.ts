import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const subject = searchParams.get("subject");

    const where: any = { isPublic: true };
    if (type && type !== "ALL") where.type = type;
    if (subject && subject !== "ALL") where.subject = subject;

    const resources = await prisma.resource.findMany({
      where,
      include: {
        trainer: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      resources: resources.map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        subject: r.subject,
        fileSizeKb: r.fileSizeKb,
        fileUrl: r.fileUrl,
        trainerName: r.trainer?.user?.name || "Lead Trainer",
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Resources API error:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, type = "PDF", subject, fileSizeKb = 2048, trainerId } = body;

    let targetTrainerId = trainerId;
    if (!targetTrainerId) {
      const defaultTrainer = await prisma.trainerProfile.findFirst();
      targetTrainerId = defaultTrainer?.id;
    }

    if (!targetTrainerId) {
      return NextResponse.json({ error: "Trainer profile required" }, { status: 400 });
    }

    const newResource = await prisma.resource.create({
      data: {
        trainerId: targetTrainerId,
        title: title || "New Technical Training Document",
        type,
        subject: subject || "Radar Meteorology",
        fileSizeKb: Number(fileSizeKb) || 2048,
        fileUrl: `/docs/${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.${type.toLowerCase()}`,
        isPublic: true,
      },
    });

    return NextResponse.json({ resource: newResource }, { status: 201 });
  } catch (error) {
    console.error("Create resource error:", error);
    return NextResponse.json({ error: "Failed to save resource" }, { status: 500 });
  }
}
