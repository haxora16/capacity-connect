import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const riskRecords = await prisma.riskAssessment.findMany({
      include: {
        user: true,
      },
      orderBy: [
        { riskLevel: "asc" }, // HIGH, MEDIUM, LOW
        { evaluatedAt: "desc" },
      ],
    });

    const formatted = riskRecords.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name,
      userEmail: r.user.email,
      organization: r.user.organization,
      designation: r.user.designation,
      avatarUrl: r.user.avatarUrl,
      riskLevel: r.riskLevel,
      averageScore: r.averageScore,
      completionRate: r.completionRate,
      missedAssessments: r.missedAssessments,
      inactiveDays: r.inactiveDays,
      primaryReason: r.primaryReason,
      recommendedAction: r.recommendedAction,
      evaluatedAt: r.evaluatedAt.toISOString(),
    }));

    // Sort so HIGH is first, then MEDIUM, then LOW
    const order: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    formatted.sort((a, b) => (order[a.riskLevel] || 4) - (order[b.riskLevel] || 4));

    return NextResponse.json({ atRiskTrainees: formatted });
  } catch (error) {
    console.error("At-risk API error:", error);
    return NextResponse.json({ error: "Failed to fetch risk records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { riskId, actionTaken, newRiskLevel } = await req.json();

    if (!riskId) {
      return NextResponse.json({ error: "Risk record ID is required" }, { status: 400 });
    }

    const updated = await prisma.riskAssessment.update({
      where: { id: riskId },
      data: {
        riskLevel: newRiskLevel || "MEDIUM",
        recommendedAction: `[Intervention Recorded]: ${actionTaken || "Trainer assigned 1-on-1 remediation session."}`,
        evaluatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    console.error("Intervention action error:", error);
    return NextResponse.json({ error: "Failed to update risk record" }, { status: 500 });
  }
}
