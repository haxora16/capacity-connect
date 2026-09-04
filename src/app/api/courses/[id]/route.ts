import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        trainer: {
          include: { user: true },
        },
        modules: {
          orderBy: { orderIndex: "asc" },
        },
        assessments: {
          select: {
            id: true,
            title: true,
            durationMinutes: true,
            passingScore: true,
            totalMarks: true,
            isAiGenerated: true,
          },
        },
        enrollments: userId ? { where: { userId } } : true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const userEnrollment = userId ? course.enrollments.find((e) => e.userId === userId) : null;

    return NextResponse.json({
      course: {
        id: course.id,
        code: course.code,
        title: course.title,
        description: course.description,
        subject: course.subject,
        category: course.category,
        difficulty: course.difficulty,
        durationHours: course.durationHours,
        objectives: JSON.parse(course.objectives || "[]"),
        trainerId: course.trainerId,
        trainerName: course.trainer?.user?.name || "Senior Master Trainer",
        trainerOrg: course.trainer?.user?.organization || "NIAMS",
        trainerSpecialization: course.trainer?.specialization || "Atmospheric Physics",
        modules: course.modules.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          orderIndex: m.orderIndex,
          durationMin: m.durationMin,
          content: m.content,
          resourceType: m.resourceType,
          isOfflineReady: m.isOfflineReady,
        })),
        assessments: course.assessments,
        isEnrolled: !!userEnrollment,
        userProgress: userEnrollment ? userEnrollment.progressPercent : 0,
        createdAt: course.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Course detail error:", error);
    return NextResponse.json({ error: "Failed to fetch course details" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId, progressDelta } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: id,
        },
      },
    });

    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: {
          userId,
          courseId: id,
          progressPercent: progressDelta || 10.0,
        },
      });
    } else if (progressDelta !== undefined) {
      const newProgress = Math.min(100, enrollment.progressPercent + progressDelta);
      enrollment = await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progressPercent: newProgress,
          completedAt: newProgress >= 100 ? new Date() : enrollment.completedAt,
          lastAccessedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}
