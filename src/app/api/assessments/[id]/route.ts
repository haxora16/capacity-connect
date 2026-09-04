import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true, code: true, subject: true } },
        questions: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        courseId: assessment.courseId,
        courseTitle: assessment.course.title,
        courseCode: assessment.course.code,
        title: assessment.title,
        subject: assessment.subject,
        difficulty: assessment.difficulty,
        durationMinutes: assessment.durationMinutes,
        passingScore: assessment.passingScore,
        totalMarks: assessment.totalMarks,
        questions: assessment.questions.map((q) => ({
          id: q.id,
          orderIndex: q.orderIndex,
          marks: q.marks,
          topic: q.topic,
          questionText: q.questionText,
          options: JSON.parse(q.options || "[]"),
          correctOption: q.correctOption,
          explanation: q.explanation,
        })),
      },
    });
  } catch (error) {
    console.error("Assessment questions error:", error);
    return NextResponse.json({ error: "Failed to load assessment" }, { status: 500 });
  }
}
