import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/gemini-provider";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { question, courseContext, userId } = await req.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: "Question text is required" }, { status: 400 });
    }

    const aiService = getAIService();
    const result = await aiService.answerLearningQuestion({
      question,
      courseContext,
    });

    // Optionally persist chat message if userId is provided
    if (userId) {
      try {
        await prisma.chatMessage.create({
          data: {
            userId,
            sender: "USER",
            content: question,
          },
        });
        await prisma.chatMessage.create({
          data: {
            userId,
            sender: "ASSISTANT",
            content: result.answer,
            sources: JSON.stringify(result.sources),
          },
        });
      } catch (dbErr) {
        console.warn("Could not persist chat message:", dbErr);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Assistant API error:", error);
    return NextResponse.json({ error: "Assistant failed to generate response" }, { status: 500 });
  }
}
