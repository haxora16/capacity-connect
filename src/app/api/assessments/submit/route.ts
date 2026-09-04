import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateTraineeRisk } from "@/lib/scoring/risk-engine";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const { assessmentId, userId, answers, timeTakenSec = 600, isOfflineSync = false } = await req.json();

    if (!assessmentId || !answers) {
      return NextResponse.json({ error: "Assessment ID and answers are required" }, { status: 400 });
    }

    // Resolve user ID or default to trainee
    let targetUserId = userId;
    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst({ where: { role: "TRAINEE" } });
      targetUserId = defaultUser?.id;
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: true,
        course: {
          include: {
            trainer: { include: { user: true } },
          },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // 1. Grade questions
    let totalScore = 0;
    let maxScore = 0;
    const gradedAnswers: {
      questionId: string;
      selectedOption: number;
      isCorrect: boolean;
      topic: string;
      explanation: string;
    }[] = [];

    for (const q of assessment.questions) {
      maxScore += q.marks;
      const userAns = (answers as any[]).find((a) => a.questionId === q.id);
      const selected = userAns !== undefined ? userAns.selectedOption : -1;
      const isCorrect = selected === q.correctOption;

      if (isCorrect) {
        totalScore += q.marks;
      }

      gradedAnswers.push({
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
        topic: q.topic,
        explanation: q.explanation || "",
      });
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 1000) / 10 : 0;
    const isPassed = percentage >= assessment.passingScore;

    // 2. Persist Attempt
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        assessmentId,
        userId: targetUserId,
        score: totalScore,
        percentage,
        isPassed,
        timeTakenSec,
        isOfflineSync,
        answers: {
          create: gradedAnswers.map((ga) => ({
            questionId: ga.questionId,
            selectedOption: ga.selectedOption,
            isCorrect: ga.isCorrect,
          })),
        },
      },
    });

    // 3. Update or create Trainee Competency for this subject
    const traineeProfile = await prisma.traineeProfile.findUnique({
      where: { userId: targetUserId },
      include: {
        user: true,
        competencies: true,
      },
    });

    let certificateData: any = null;

    if (traineeProfile) {
      const subject = assessment.subject;
      const existingComp = traineeProfile.competencies.find((c) => c.subjectArea === subject);

      if (existingComp) {
        // Weighted blend with recent score
        const newScore = Math.round(((existingComp.currentScore * 0.6) + (percentage * 0.4)) * 10) / 10;
        await prisma.traineeCompetency.update({
          where: { id: existingComp.id },
          data: {
            currentScore: newScore,
            gapScore: Math.max(0, Math.round((existingComp.targetScore - newScore) * 10) / 10),
          },
        });
      } else {
        await prisma.traineeCompetency.create({
          data: {
            profileId: traineeProfile.id,
            subjectArea: subject,
            currentScore: percentage,
            targetScore: 85.0,
            gapScore: Math.max(0, 85.0 - percentage),
          },
        });
      }

      // 4. Update Course Enrollment progress
      let enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: targetUserId,
            courseId: assessment.courseId,
          },
        },
      });

      if (!enrollment) {
        enrollment = await prisma.enrollment.create({
          data: {
            userId: targetUserId,
            courseId: assessment.courseId,
            progressPercent: isPassed ? 100.0 : 80.0,
            completedAt: isPassed ? new Date() : null,
          },
        });
      } else {
        const newProgress = isPassed ? 100.0 : Math.max(enrollment.progressPercent, 80.0);
        enrollment = await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: {
            progressPercent: newProgress,
            completedAt: isPassed ? new Date() : enrollment.completedAt,
            lastAccessedAt: new Date(),
          },
        });
      }

      // 5. Automatic Certificate Generation on passing
      if (isPassed) {
        let cert = await prisma.certificate.findFirst({
          where: { traineeId: traineeProfile.id, courseId: assessment.courseId },
        });

        if (!cert) {
          const courseCodeSafe = (assessment.course?.code || "MET").replace(/[^A-Z0-9]/g, "");
          const certCode = `CC-NIAMS-2026-${courseCodeSafe}-${Math.floor(1000 + Math.random() * 9000)}`;
          const grade = percentage >= 90 ? "Distinction (Honors)" : percentage >= 75 ? "First Class with Merit" : "Pass (Qualified)";

          cert = await prisma.certificate.create({
            data: {
              certificateCode: certCode,
              traineeId: traineeProfile.id,
              courseId: assessment.courseId,
              grade,
            },
          });

          // Send notification to trainee
          await createNotification({
            userId: targetUserId,
            title: "Certificate available",
            message: `Your course certificate for "${assessment.course?.title || assessment.title}" is ready.`,
            type: "CERTIFICATE",
          });
        }

        certificateData = {
          id: cert.id,
          certificateCode: cert.certificateCode,
          traineeName: traineeProfile.user?.name || "Trainee",
          traineeOrg: traineeProfile.user?.organization || "Institutional Training Unit",
          traineeDesignation: traineeProfile.user?.designation || "Trainee",
          courseTitle: assessment.course?.title || assessment.title,
          courseCode: assessment.course?.code || "MET-EXP",
          courseSubject: assessment.subject,
          durationHours: assessment.course?.durationHours || 20,
          trainerName: assessment.course?.trainer?.user?.name || "Dr. Rajesh Sharma",
          issuedOn: cert.issuedOn.toISOString(),
          grade: cert.grade,
        };
      }

      // 6. Diagnostics calculation
      const allAttempts = await prisma.assessmentAttempt.findMany({
        where: { userId: targetUserId },
      });
      const avgScore = allAttempts.length > 0
        ? allAttempts.reduce((acc, att) => acc + att.percentage, 0) / allAttempts.length
        : percentage;

      const riskEval = evaluateTraineeRisk({
        averageScore: avgScore,
        completionRate: enrollment?.progressPercent || 50,
        missedAssessments: 0,
        inactiveDays: 0,
      });

      const existingRisk = await prisma.riskAssessment.findFirst({
        where: { userId: targetUserId },
      });

      if (existingRisk) {
        await prisma.riskAssessment.update({
          where: { id: existingRisk.id },
          data: {
            riskLevel: riskEval.riskLevel,
            averageScore: Math.round(avgScore * 10) / 10,
            primaryReason: riskEval.primaryReason,
            recommendedAction: riskEval.recommendedAction,
            evaluatedAt: new Date(),
          },
        });
      } else {
        await prisma.riskAssessment.create({
          data: {
            userId: targetUserId,
            riskLevel: riskEval.riskLevel,
            averageScore: Math.round(avgScore * 10) / 10,
            completionRate: 80.0,
            missedAssessments: 0,
            inactiveDays: 0,
            primaryReason: riskEval.primaryReason,
            recommendedAction: riskEval.recommendedAction,
          },
        });
      }
    }

    return NextResponse.json({
      attemptId: attempt.id,
      score: totalScore,
      maxScore,
      percentage,
      isPassed,
      passingScore: assessment.passingScore,
      gradedAnswers,
      certificate: certificateData,
    });
  } catch (error) {
    console.error("Assessment submission error:", error);
    return NextResponse.json({ error: "Failed to grade assessment" }, { status: 500 });
  }
}
