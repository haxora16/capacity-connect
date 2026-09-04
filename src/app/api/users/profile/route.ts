import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const sessionUser = await getCurrentUser();
    const targetUserId = userId || sessionUser?.id;

    if (!targetUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        traineeProfile: {
          include: {
            competencies: true,
            certificates: {
              include: { course: true },
            },
          },
        },
        trainerProfile: {
          include: {
            courses: true,
          },
        },
        adminProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    const body = await req.json();
    const {
      userId,
      name,
      organization,
      designation,
      qualifications,
      skills,
      workExperience,
      interests,
      certifications,
      subjectExpertise,
      department,
    } = body;

    const targetUserId = userId || sessionUser?.id;
    if (!targetUserId) {
      return NextResponse.json({ error: "Unauthorized / User ID required" }, { status: 401 });
    }

    // Update base User
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(name ? { name } : {}),
        ...(organization ? { organization } : {}),
        ...(designation ? { designation } : {}),
      },
      include: {
        traineeProfile: true,
        trainerProfile: true,
      },
    });

    // Update TraineeProfile if exists
    if (updatedUser.role === "TRAINEE") {
      const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : skills;
      const qualsJson = Array.isArray(qualifications) ? JSON.stringify(qualifications) : qualifications;
      const certsJson = Array.isArray(certifications) ? JSON.stringify(certifications) : certifications;
      const expJson = Array.isArray(workExperience) ? JSON.stringify(workExperience) : workExperience;
      const interestsJson = Array.isArray(interests) ? JSON.stringify(interests) : interests;

      await prisma.traineeProfile.upsert({
        where: { userId: targetUserId },
        create: {
          userId: targetUserId,
          skills: skillsJson || "[]",
          qualifications: qualsJson || "[]",
          certifications: certsJson || "[]",
          workExperience: expJson || "[]",
          interests: interestsJson || "[]",
          department: department || organization || "Meteorology",
          designation: designation || "Trainee",
        },
        update: {
          ...(skillsJson ? { skills: skillsJson } : {}),
          ...(qualsJson ? { qualifications: qualsJson } : {}),
          ...(certsJson ? { certsJson } : {}),
          ...(expJson ? { workExperience: expJson } : {}),
          ...(interestsJson ? { interests: interestsJson } : {}),
          ...(department ? { department } : {}),
          ...(designation ? { designation } : {}),
        },
      });
    } else if (updatedUser.role === "TRAINER") {
      const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : skills;
      const qualsJson = Array.isArray(qualifications) ? JSON.stringify(qualifications) : qualifications;
      const certsJson = Array.isArray(certifications) ? JSON.stringify(certifications) : certifications;
      const expJson = Array.isArray(workExperience) ? JSON.stringify(workExperience) : workExperience;
      const expertiseJson = Array.isArray(subjectExpertise) ? JSON.stringify(subjectExpertise) : subjectExpertise;

      await prisma.trainerProfile.upsert({
        where: { userId: targetUserId },
        create: {
          userId: targetUserId,
          skills: skillsJson || "[]",
          qualifications: qualsJson || "[]",
          certifications: certsJson || "[]",
          workExperience: expJson || "[]",
          subjectExpertise: expertiseJson || "[]",
          department: department || organization || "Training Directorate",
          designation: designation || "Trainer",
        },
        update: {
          ...(skillsJson ? { skills: skillsJson } : {}),
          ...(qualsJson ? { qualifications: qualsJson } : {}),
          ...(certsJson ? { certifications: certsJson } : {}),
          ...(expJson ? { workExperience: expJson } : {}),
          ...(expertiseJson ? { subjectExpertise: expertiseJson } : {}),
          ...(department ? { department } : {}),
          ...(designation ? { designation } : {}),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully in database",
    });
  } catch (error) {
    console.error("User profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
