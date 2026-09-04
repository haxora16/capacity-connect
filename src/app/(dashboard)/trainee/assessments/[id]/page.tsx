"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  Flag,
  RotateCcw,
  Compass,
  Award,
  Download,
  ExternalLink,
  Printer,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { CertificateCard, CertificateData } from "@/components/certificate/CertificateCard";

export default function AssessmentRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const assessmentId = params?.id as string;

  const [assessment, setAssessment] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeftSec, setTimeLeftSec] = useState<number>(1800);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load Assessment Definition
  useEffect(() => {
    async function loadAssessment() {
      try {
        const res = await fetch(`/api/assessments/${assessmentId}`);
        const data = await res.json();
        if (data.assessment) {
          const parsedQuestions = data.assessment.questions.map((q: any) => ({
            ...q,
            options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
          }));
          setAssessment({ ...data.assessment, questions: parsedQuestions });
          setTimeLeftSec(data.assessment.durationMinutes * 60);
        }
      } catch (err) {
        console.error("Failed to load assessment:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (assessmentId) loadAssessment();
  }, [assessmentId]);

  // Countdown Timer
  useEffect(() => {
    if (!assessment || quizResult) return;

    const interval = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [assessment, quizResult]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmitAssessment = async () => {
    if (!assessment || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const answersPayload = assessment.questions.map((q: any) => ({
        questionId: q.id,
        selectedOption: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1,
      }));

      const res = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: assessment.id,
          userId: user?.id,
          answers: answersPayload,
          timeTakenSec: (assessment.durationMinutes * 60) - timeLeftSec,
        }),
      });

      if (res.ok) {
        const resultData = await res.json();
        setQuizResult(resultData);
      }
    } catch (err) {
      console.error("Assessment submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading examination environment...</div>;
  }

  if (!assessment) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-slate-600">Assessment not found.</p>
        <Link href="/trainee/assessments">
          <Button size="sm" variant="outline">Back to Assessments</Button>
        </Link>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestionIndex];
  const totalQuestions = assessment.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // -------------------------------------------------------------
  // POST-SUBMISSION RESULTS & CERTIFICATE VIEW
  // -------------------------------------------------------------
  if (quizResult) {
    const certificate: CertificateData | null = quizResult.certificate || (quizResult.isPassed ? {
      certificateCode: `CC-NIAMS-2026-${assessment.title.substring(0, 3).toUpperCase()}-9481`,
      traineeName: user?.name || "Trainee Candidate",
      traineeOrg: user?.organization || "Institutional Training Unit",
      traineeDesignation: user?.designation || "Trainee",
      courseTitle: assessment.course?.title || assessment.title,
      courseSubject: assessment.subject,
      issuedOn: new Date().toISOString(),
      grade: quizResult.percentage >= 90 ? "Distinction (Honors)" : "First Class with Merit",
    } : null);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Certificate Modal */}
        {showCertificateModal && certificate && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between no-print">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#D89A2E]" />
                  Official Certificate Preview
                </h3>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <CertificateCard cert={certificate} showActions={true} />
            </div>
          </div>
        )}

        {/* 🌟 Celebratory Certificate Award Card if Passed */}
        {quizResult.isPassed && certificate && (
          <Card className="border-[#159A6A] bg-linear-to-r from-emerald-50/80 via-white to-teal-50/50 shadow-sm no-print">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#159A6A] text-white rounded-md">
                    <Award className="h-5 w-5" />
                  </span>
                  <div>
                    <Badge variant="success" size="sm">CERTIFICATION EARNED</Badge>
                    <span className="text-xs font-mono font-bold text-slate-700 ml-2">
                      Code: {certificate.certificateCode}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-extrabold text-[#174A7E] tracking-tight">
                  Congratulations! You Have Passed with {certificate.grade || "Merit"}
                </h2>
                <p className="text-xs text-slate-600 max-w-2xl">
                  Your official certificate has been issued and logged to the central institutional repository. You can view, verify online, or download it as a PDF.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => window.print()}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCertificateModal(true)}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  View Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Score Breakdown Card */}
        <Card className={quizResult.isPassed ? "border-emerald-300" : "border-rose-300"}>
          <CardHeader className={quizResult.isPassed ? "bg-emerald-50/70" : "bg-rose-50/70"}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Examination Result
                </span>
                <CardTitle className="text-lg font-bold text-slate-900 mt-0.5">
                  {assessment.title}
                </CardTitle>
                <div className="text-xs text-slate-500 mt-0.5">Subject: {assessment.subject}</div>
              </div>

              <Badge
                variant={quizResult.isPassed ? "success" : "danger"}
                size="md"
                className="text-sm px-3 py-1"
              >
                {quizResult.isPassed ? "PASSED EXAMINATION" : "REMEDIATION REQUIRED"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-5">
            {/* Numerical Score Overview */}
            <div className="grid grid-cols-3 divide-x divide-slate-200 text-center bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <div className="text-xs text-slate-500">Score Achieved</div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                  {quizResult.score} / {quizResult.maxScore}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Percentage</div>
                <div className={`text-2xl font-bold tabular-nums mt-1 ${quizResult.isPassed ? "text-emerald-700" : "text-rose-700"}`}>
                  {quizResult.percentage}%
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Passing Grade</div>
                <div className="text-2xl font-bold text-slate-700 tabular-nums mt-1">
                  {assessment.passingScore}%
                </div>
              </div>
            </div>

            {/* Competency Impact Note */}
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-slate-900">
                <Compass className="h-4 w-4 text-[#087F8C]" />
                Competency Profile Updated
              </div>
              <p className="text-[11px] text-slate-600">
                Your examination score has updated your <strong>{assessment.subject}</strong> operational competency profile.
              </p>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                Detailed Review & Explanations
              </h3>

              <div className="space-y-4 text-xs">
                {assessment.questions.map((q: any, idx: number) => {
                  const graded = quizResult.gradedAnswers.find((ga: any) => ga.questionId === q.id);
                  const isCorrect = graded?.isCorrect;
                  const selected = graded?.selectedOption;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border space-y-2.5 ${
                        isCorrect ? "bg-emerald-50/40 border-emerald-200" : "bg-rose-50/40 border-rose-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-slate-900">
                          Q{idx + 1}. {q.questionText}
                        </div>
                        {isCorrect ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold shrink-0">
                            <CheckCircle2 className="h-4 w-4" /> Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-700 font-bold shrink-0">
                            <XCircle className="h-4 w-4" /> Incorrect
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="space-y-1 pl-2">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isChosen = selected === optIdx;
                          const isTheCorrectOne = q.correctOption === optIdx;

                          return (
                            <div
                              key={optIdx}
                              className={`p-2 rounded text-xs flex items-center justify-between ${
                                isTheCorrectOne
                                  ? "bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300"
                                  : isChosen
                                  ? "bg-rose-100 text-rose-900 line-through border border-rose-300"
                                  : "text-slate-600"
                              }`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                              {isTheCorrectOne && <span className="text-[10px] font-bold text-emerald-800">Correct Answer</span>}
                              {isChosen && !isTheCorrectOne && (
                                <span className="text-[10px] font-bold text-rose-800">Your Selection</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-2.5 rounded bg-white border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                          <strong className="text-slate-900 block font-semibold mb-0.5">Explanation:</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <Link href="/trainee/assessments">
                <Button size="sm" variant="outline">
                  Back to Assessments
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Link href="/trainee/certificates">
                  <Button size="sm" variant="outline">
                    <Award className="h-3.5 w-3.5" />
                    My Certificates
                  </Button>
                </Link>
                <Link href="/trainee/competency">
                  <Button size="sm" variant="primary">
                    View Competency Profile
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE EXAMINATION RUNNER
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Control Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#087F8C]">
            {assessment.subject} • Examination Mode
          </div>
          <h1 className="text-base font-bold text-slate-900 mt-0.5">{assessment.title}</h1>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-mono font-bold text-xs ${
            timeLeftSec < 300 ? "bg-rose-50 text-rose-800 border-rose-200 animate-pulse" : "bg-slate-50 text-slate-800 border-slate-200"
          }`}>
            <Clock className="h-4 w-4 text-slate-500" />
            <span>Time Left: {formatTimer(timeLeftSec)}</span>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={handleSubmitAssessment}
            disabled={isSubmitting}
            className="flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            {isSubmitting ? "Scoring..." : "Submit Test"}
          </Button>
        </div>
      </div>

      {/* Main Examination Grid (Question + Nav Palette) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Question View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono px-2 py-0.5 bg-slate-200 rounded text-slate-800">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <Badge variant="outline" size="sm">{currentQ?.topic || "Technical"}</Badge>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleToggleFlag(currentQ?.id)}
                className={flaggedQuestions[currentQ?.id] ? "text-amber-700 bg-amber-50 border-amber-300" : ""}
              >
                <Flag className="h-3.5 w-3.5" />
                {flaggedQuestions[currentQ?.id] ? "Flagged for Review" : "Flag"}
              </Button>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                {currentQ?.questionText}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ?.options?.map((option: string, optIndex: number) => {
                  const isSelected = selectedAnswers[currentQ?.id] === optIndex;
                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(currentQ?.id, optIndex)}
                      className={`w-full text-left p-3.5 rounded border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-teal-50 border-[#087F8C] text-[#0c2340] font-bold shadow-xs"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                          isSelected ? "bg-[#087F8C] text-white border-[#087F8C]" : "bg-slate-100 text-slate-600 border-slate-300"
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isSelected && <CheckCircle2 className="h-4 w-4 text-[#087F8C]" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </Button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  >
                    Next Question <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSubmitAssessment}
                    disabled={isSubmitting}
                  >
                    <Send className="h-3.5 w-3.5" /> Complete & Submit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Palette Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Question Navigator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {assessment.questions.map((q: any, idx: number) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];
                  const isCurrent = idx === currentQuestionIndex;

                  let btnStyle = "bg-slate-100 text-slate-700 border-slate-200";
                  if (isAnswered) btnStyle = "bg-[#159A6A] text-white border-[#159A6A]";
                  if (isFlagged) btnStyle = "bg-amber-500 text-white border-amber-600";
                  if (isCurrent) btnStyle += " ring-2 ring-[#087F8C] ring-offset-1 font-bold";

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded text-xs font-mono font-semibold transition-all border cursor-pointer ${btnStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Status Summary */}
              <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <strong className="text-slate-800">{answeredCount} / {totalQuestions}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <strong className="text-slate-800">{totalQuestions - answeredCount}</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
