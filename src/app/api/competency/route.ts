import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let profile;
    if (userId) {
      profile = await prisma.traineeProfile.findUnique({
        where: { userId },
        include: {
          user: true,
          competencies: true,
          certificates: { include: { course: true } },
        },
      });
    }

    if (!profile) {
      profile = await prisma.traineeProfile.findFirst({
        include: {
          user: true,
          competencies: true,
          certificates: { include: { course: true } },
        },
      });
    }

    if (!profile) {
      return NextResponse.json({ error: "Trainee profile not found" }, { status: 404 });
    }

    const radarData = profile.competencies.map((c) => ({
      subject: c.subjectArea,
      current: c.currentScore,
      target: c.targetScore,
      fullMark: 100,
    }));

    return NextResponse.json({
      trainee: {
        id: profile.id,
        name: profile.user.name,
        email: profile.user.email,
        organization: profile.user.organization,
        designation: profile.user.designation,
        qualifications: JSON.parse(profile.qualifications || "[]"),
        experienceYears: profile.experienceYears,
        skills: JSON.parse(profile.skills || "[]"),
        interests: JSON.parse(profile.interests || "[]"),
        competencyScore: profile.competencyScore,
      },
      competencies: profile.competencies,
      radarData,
      certificatesCount: profile.certificates.length,
    });
  } catch (error) {
    console.error("Competency API error:", error);
    return NextResponse.json({ error: "Failed to fetch competency data" }, { status: 500 });
  }
}
