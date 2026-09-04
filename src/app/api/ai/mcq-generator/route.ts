import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/gemini-provider";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      courseId,
      courseTitle,
      subject,
      topic,
      count = 4,
      difficulty = "INTERMEDIATE",
      contentExcerpt,
    } = body;

    const aiService = getAIService();
    const questions = await aiService.generateMCQs({
      subject: subject || "Operational Meteorology",
      courseTitle: courseTitle || "Atmospheric Dynamics & Remote Sensing",
      topic: topic || "Core Principles",
      count: Math.min(10, Math.max(1, count)),
      difficulty,
      contentExcerpt,
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("AI MCQ Generator API error:", error);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
