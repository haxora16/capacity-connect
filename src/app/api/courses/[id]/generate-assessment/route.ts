import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAIService } from "@/lib/ai/gemini-provider";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: { orderBy: { orderIndex: "asc" } },
        assessments: {
          include: { questions: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // If course already has a published assessment with questions, return it directly
    const existingAssessment = course.assessments.find((a) => a.questions.length > 0);
    if (existingAssessment) {
      return NextResponse.json({
        assessmentId: existingAssessment.id,
        assessment: existingAssessment,
        isNew: false,
      });
    }

    // Otherwise, generate questions on the fly based on the course syllabus and modules
    const aiService = getAIService();
    const moduleSummaries = course.modules.map((m) => `${m.title}: ${m.content}`).join("\n");

    const generatedQuestions = await aiService.generateMCQs({
      courseTitle: course.title,
      subject: course.subject,
      topic: course.title,
      difficulty: (course.difficulty as any) || "INTERMEDIATE",
      count: 4,
      contentExcerpt: moduleSummaries || course.description,
    });

    // Create the new Assessment and its questions in the database
    const newAssessment = await prisma.assessment.create({
      data: {
        courseId: course.id,
        title: `Comprehensive Examination: ${course.title}`,
        subject: course.subject,
        difficulty: course.difficulty || "INTERMEDIATE",
        durationMinutes: 20,
        passingScore: 60.0,
        totalMarks: generatedQuestions.length * 10,
        isAiGenerated: true,
        isPublished: true,
        questions: {
          create: generatedQuestions.map((q, idx) => ({
            questionText: q.questionText,
            options: JSON.stringify(q.options),
            correctOption: q.correctOption,
            explanation: q.explanation || "",
            topic: q.topic || course.subject,
            marks: 10,
            orderIndex: idx + 1,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json({
      assessmentId: newAssessment.id,
      assessment: newAssessment,
      isNew: true,
    });
  } catch (error) {
    console.error("Generate course assessment error:", error);
    return NextResponse.json(
      { error: "Failed to generate course assessment" },
      { status: 500 }
    );
  }
}
