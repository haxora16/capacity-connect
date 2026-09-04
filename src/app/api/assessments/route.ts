import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const userId = searchParams.get("userId");

    const where: any = { isPublished: true };
    if (courseId) where.courseId = courseId;

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, code: true, subject: true } },
        questions: { select: { id: true, topic: true, marks: true } },
        attempts: userId ? { where: { userId } } : true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = assessments.map((a) => {
      const userAttempt = userId ? a.attempts.find((att) => att.userId === userId) : null;
      return {
        id: a.id,
        courseId: a.courseId,
        courseTitle: a.course.title,
        courseCode: a.course.code,
        title: a.title,
        subject: a.subject,
        difficulty: a.difficulty,
        durationMinutes: a.durationMinutes,
        passingScore: a.passingScore,
        totalMarks: a.totalMarks,
        isAiGenerated: a.isAiGenerated,
        questionsCount: a.questions.length,
        userAttempt: userAttempt
          ? {
              score: userAttempt.score,
              percentage: userAttempt.percentage,
              isPassed: userAttempt.isPassed,
              submittedAt: userAttempt.submittedAt.toISOString(),
            }
          : null,
      };
    });

    return NextResponse.json({ assessments: formatted });
  } catch (error) {
    console.error("Assessments API error:", error);
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      courseId,
      title,
      subject,
      difficulty = "INTERMEDIATE",
      durationMinutes = 25,
      passingScore = 60.0,
      questions = [],
    } = body;

    let targetCourseId = courseId;
    if (!targetCourseId) {
      const firstCourse = await prisma.course.findFirst();
      targetCourseId = firstCourse?.id;
    }

    if (!targetCourseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const totalMarks = questions.reduce((sum: number, q: any) => sum + (q.marks || 10), 0) || 50;

    const newAssessment = await prisma.assessment.create({
      data: {
        courseId: targetCourseId,
        title: title || `Assessment: ${subject || "Operational Evaluation"}`,
        subject: subject || "Atmospheric Sciences",
        difficulty,
        durationMinutes: Number(durationMinutes) || 25,
        passingScore: Number(passingScore) || 60.0,
        totalMarks,
        isAiGenerated: true,
        isPublished: true,
        questions: {
          create: questions.map((q: any, idx: number) => ({
            orderIndex: idx + 1,
            marks: q.marks || 10,
            topic: q.topic || "Core Evaluation",
            questionText: q.questionText,
            options: JSON.stringify(q.options),
            correctOption: Number(q.correctOption) || 0,
            explanation: q.explanation || "Standard scientific evaluation criteria.",
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json({ assessment: newAssessment }, { status: 201 });
  } catch (error) {
    console.error("Create assessment error:", error);
    return NextResponse.json({ error: "Failed to publish assessment" }, { status: 500 });
  }
}
