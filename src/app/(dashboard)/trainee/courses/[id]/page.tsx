"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  BookOpen,
  Clock,
  Layers,
  GraduationCap,
  FileText,
  Video,
  CheckCircle2,
  DownloadCloud,
  ArrowLeft,
  Check,
  Award,
  Sparkles,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<any | null>(null);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}?userId=${user?.id || ""}`);
        const data = await res.json();
        if (data.course) {
          setCourse(data.course);
          setIsEnrolled(data.course.isEnrolled);
          setProgress(data.course.userProgress || 0);
        }
      } catch (err) {
        console.error("Failed to load course detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (courseId) loadCourse();
  }, [courseId, user]);

  const handleEnroll = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, progressDelta: 25 }),
      });
      if (res.ok) {
        setIsEnrolled(true);
        setProgress(25);
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  const handleMarkModuleComplete = async () => {
    const totalModules = course?.modules?.length || 1;
    const increment = Math.round(100 / totalModules);
    const newProg = Math.min(100, progress + increment);
    setProgress(newProg);

    try {
      await fetch(`/api/courses/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, progressDelta: increment }),
      });
      if (selectedModuleIndex < totalModules - 1) {
        setSelectedModuleIndex(selectedModuleIndex + 1);
      }
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  };

  const handleTakeOrGenerateTest = async () => {
    if (!course) return;

    // If assessment already exists, navigate directly
    if (course.assessments && course.assessments.length > 0) {
      router.push(`/trainee/assessments/${course.assessments[0].id}`);
      return;
    }

    // Otherwise, generate questions on demand
    setIsGeneratingTest(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/generate-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.assessmentId) {
          router.push(`/trainee/assessments/${data.assessmentId}`);
        }
      }
    } catch (err) {
      console.error("Failed to generate test:", err);
    } finally {
      setIsGeneratingTest(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading course curriculum...</div>;
  }

  if (!course) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-slate-600">Course not found.</p>
        <Link href="/trainee/courses">
          <Button size="sm" variant="outline">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const activeModule = course.modules?.[selectedModuleIndex] || course.modules?.[0];
  const isCourseComplete = progress >= 100 || selectedModuleIndex >= (course.modules?.length || 1) - 1 && progress >= 75;

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link href="/trainee/courses" className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </Link>

        <div className="flex items-center gap-2">
          {!isEnrolled ? (
            <Button size="sm" variant="primary" onClick={handleEnroll}>
              Enroll in Course
            </Button>
          ) : (
            <Badge variant={progress >= 100 ? "success" : "secondary"}>
              {progress >= 100 ? "COMPLETED (100%)" : `PROGRESS: ${progress}%`}
            </Badge>
          )}
        </div>
      </div>

      {/* Course Header Banner */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {course.code}
            </span>
            <Badge variant="outline">{course.subject}</Badge>
            <Badge variant="outline">{course.difficulty}</Badge>
          </div>
          <div className="text-xs text-slate-500">
            Lead Instructor: <strong>{course.trainerName}</strong> ({course.trainerSpecialization || "Meteorology"})
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">{course.title}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-4xl">{course.description}</p>
        </div>

        {/* Learning Objectives */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
            Key Learning Objectives
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            {course.objectives?.map((obj: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-[#159A6A] shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 Prominent Course Completion & Assessment Card */}
      {isCourseComplete && (
        <Card className="border-teal-300 bg-linear-to-r from-teal-50/70 via-white to-white shadow-xs">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">COURSE COMPLETED</Badge>
                <span className="text-xs font-bold text-[#159A6A]">100% Modules Finished</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#0c2340]">
                Ready for Final Assessment & Certificate
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl">
                Take the official course examination now to test your knowledge, update your competency profile, and earn your verified certificate.
              </p>
            </div>

            <Button
              size="lg"
              variant="primary"
              onClick={handleTakeOrGenerateTest}
              disabled={isGeneratingTest}
              className="shrink-0 flex items-center gap-2"
            >
              {isGeneratingTest ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Test Questions...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  Take Course Test →
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Module Learning Player & Module Path */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module Content Player (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Module {selectedModuleIndex + 1} of {course.modules.length}
                </span>
                <CardTitle className="text-base font-bold text-slate-900 mt-0.5">
                  {activeModule?.title}
                </CardTitle>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{activeModule?.durationMin || 45} mins</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {/* Educational Content View */}
              <div className="p-4 rounded bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                  <FileText className="h-4 w-4 text-[#087F8C]" />
                  <span>Module Notes & Technical Material</span>
                </div>
                <p className="whitespace-pre-wrap">{activeModule?.content || "Module educational material and operational guidelines."}</p>
              </div>

              {/* Module Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Overall Course Progress: <strong className="text-slate-800">{progress}%</strong>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="primary" onClick={handleMarkModuleComplete}>
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Module Complete
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleTakeOrGenerateTest}
                    disabled={isGeneratingTest}
                  >
                    {isGeneratingTest ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Award className="h-3.5 w-3.5" />}
                    Take Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Sidebar Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Learning Modules</span>
                <span className="text-xs font-normal text-slate-500">{course.modules?.length} total</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                {course.modules?.map((m: any, idx: number) => {
                  const isCurrent = idx === selectedModuleIndex;
                  const isCompleted = idx < selectedModuleIndex || progress >= 100;

                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModuleIndex(idx)}
                      className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 cursor-pointer ${
                        isCurrent
                          ? "bg-teal-50/70 text-[#0c2340] font-bold border-l-4 border-l-[#087F8C]"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-[#159A6A]" />
                        ) : isCurrent ? (
                          <PlayCircle className="h-4 w-4 text-[#087F8C]" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="truncate">{m.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{m.durationMin || 45} mins</span>
                          <span>•</span>
                          <span>{m.resourceType || "TEXT"}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Take Test Link at bottom of sidebar */}
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  onClick={handleTakeOrGenerateTest}
                  disabled={isGeneratingTest}
                >
                  {isGeneratingTest ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Award className="h-3.5 w-3.5" />
                  )}
                  Take Course Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
