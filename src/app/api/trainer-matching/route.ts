import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateTrainerMatch } from "@/lib/scoring/trainer-matcher";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject") || "Radar Meteorology";

    const trainers = await prisma.trainerProfile.findMany({
      include: {
        user: true,
        competencies: {
          where: { subjectArea: subject },
        },
      },
    });

    const matches = trainers.map((t) => {
      const quals = JSON.parse(t.qualifications || "[]");
      const calculation = calculateTrainerMatch({
        trainerSpecialization: t.specialization || t.subjectExpertise || "",
        qualifications: quals,
        experienceYears: t.experienceYears,
        rating: t.rating,
        targetSubject: subject,
      });

      return {
        trainerId: t.id,
        trainerName: t.user.name,
        email: t.user.email,
        organization: t.user.organization,
        specialization: t.specialization || t.subjectExpertise || "Meteorology",
        qualifications: quals,
        experienceYears: t.experienceYears,
        rating: t.rating,
        avatarUrl: t.user.avatarUrl,
        subjectArea: subject,
        skillMatch: calculation.skillMatch,
        qualScore: calculation.qualScore,
        expScore: calculation.expScore,
        perfScore: calculation.perfScore,
        overallMatch: calculation.overallMatch,
        formula: calculation.formula,
      };
    });

    matches.sort((a, b) => b.overallMatch - a.overallMatch);

    return NextResponse.json({
      subject,
      matches,
      scoringWeights: {
        skillMatch: "40%",
        qualification: "20%",
        experience: "20%",
        performanceRating: "20%",
      },
    });
  } catch (error) {
    console.error("Trainer matching API error:", error);
    return NextResponse.json({ error: "Failed to match trainers" }, { status: 500 });
  }
}
