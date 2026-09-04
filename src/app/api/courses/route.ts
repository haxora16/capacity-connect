import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyRole } from "@/lib/notifications";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");
    const userId = searchParams.get("userId");

    const where: any = { isPublished: true };
    if (subject && subject !== "ALL") where.subject = subject;
    if (difficulty && difficulty !== "ALL") where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { subject: { contains: search } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        trainer: {
          include: { user: true },
        },
        modules: {
          select: { id: true, title: true, durationMin: true, resourceType: true },
        },
        enrollments: userId ? { where: { userId } } : true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = courses.map((c) => {
      const userEnrollment = userId ? c.enrollments.find((e) => e.userId === userId) : null;
      return {
        id: c.id,
        code: c.code,
        title: c.title,
        description: c.description,
        subject: c.subject,
        category: c.category,
        difficulty: c.difficulty,
        durationHours: c.durationHours,
        objectives: JSON.parse(c.objectives || "[]"),
        trainerId: c.trainerId,
        trainerName: c.trainer?.user?.name || "Dr. Rajesh Sharma",
        trainerOrg: c.trainer?.user?.organization || "NIAMS Training Division",
        modulesCount: c.modules.length,
        enrolledCount: c.enrollments.length,
        userProgress: userEnrollment ? userEnrollment.progressPercent : 0,
        isEnrolled: !!userEnrollment,
        createdAt: c.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ courses: formatted });
  } catch (error) {
    console.error("Courses API error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      code,
      description,
      subject,
      category,
      difficulty,
      durationHours,
      objectives,
      trainerId,
      modules,
    } = body;

    // Find valid trainer profile or fallback to first trainer
    let targetTrainerId = trainerId;
    if (!targetTrainerId) {
      const defaultTrainer = await prisma.trainerProfile.findFirst();
      targetTrainerId = defaultTrainer?.id;
    }

    if (!targetTrainerId) {
      return NextResponse.json({ error: "No trainer profile found" }, { status: 400 });
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        code: code || `MET-EXP-${Math.floor(100 + Math.random() * 900)}`,
        description,
        subject,
        category: category || "Operational Meteorology",
        difficulty: difficulty || "INTERMEDIATE",
        durationHours: Number(durationHours) || 20,
        objectives: JSON.stringify(objectives || ["Understand core operational concepts"]),
        trainerId: targetTrainerId,
        isPublished: true,
        modules: {
          create: (modules || []).map((m: any, idx: number) => ({
            title: m.title || `Module ${idx + 1}`,
            description: m.description || "",
            orderIndex: idx + 1,
            durationMin: Number(m.durationMin) || 45,
            resourceType: m.resourceType || "TEXT",
            content: m.content || "Module educational material and operational guidelines.",
            isOfflineReady: true,
          })),
        },
      },
      include: { modules: true },
    });

    // Notify trainees about the new course
    await notifyRole({
      role: "TRAINEE",
      title: "New course available",
      message: `${title} is now available for enrollment.`,
      type: "COURSE",
    });

    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (error) {
    console.error("Course creation error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
