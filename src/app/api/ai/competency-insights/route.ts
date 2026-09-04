import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/gemini-provider";

export async function POST(req: Request) {
  try {
    const { traineeName, competencies, recentScores } = await req.json();

    const aiService = getAIService();
    const insights = await aiService.generateCompetencyInsights({
      traineeName: traineeName || "Operational Trainee",
      competencies: competencies || [],
      recentScores: recentScores || [80, 75, 90],
    });

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Competency Insights API error:", error);
    return NextResponse.json({ error: "Failed to generate competency insights" }, { status: 500 });
  }
}
