"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  BookOpen,
  Users,
  CheckSquare,
  Sparkles,
  PlusCircle,
  FolderArchive,
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function TrainerDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTrainerData() {
      try {
        const [cRes, aRes, rRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/assessments"),
          fetch("/api/resources"),
        ]);
        const [cData, aData, rData] = await Promise.all([
          cRes.json(),
          aRes.json(),
          rRes.json(),
        ]);
        if (cData.courses) setCourses(cData.courses);
        if (aData.assessments) setAssessments(aData.assessments);
        if (rData.resources) setResources(rData.resources);
      } catch (err) {
        console.error("Failed to load trainer data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTrainerData();
  }, []);

  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading trainer overview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Trainer Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {user?.name || "Trainer"} • {user?.organization || "Institutional Training Division"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/trainer/courses/create">
            <Button size="sm" variant="primary">
              <PlusCircle className="h-3.5 w-3.5" />
              Create Course
            </Button>
          </Link>
          <Link href="/trainer/ai-mcq-generator">
            <Button size="sm" variant="outline">
              <Sparkles className="h-3.5 w-3.5" />
              AI MCQ Generator
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">My Courses</div>
          <div className="text-2xl font-bold text-[#0c2340] tabular-nums mt-1">
            {courses.length}
          </div>
          <div className="text-[11px] text-[#087F8C] font-medium mt-0.5">Active curriculum</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Total Enrolled Trainees</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
            {totalEnrollments}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all courses</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Assessments Created</div>
          <div className="text-2xl font-bold text-[#159A6A] tabular-nums mt-1">
            {assessments.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Examinations active</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Learning Resources</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
            {resources.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">PDFs, Videos & Docs</div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Course Management List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#087F8C]" />
              My Courses ({courses.length})
            </h3>
            <Link href="/trainer/courses" className="text-xs font-semibold text-[#087F8C] hover:underline">
              Manage All Courses →
            </Link>
          </div>

          {courses.length === 0 ? (
            <Card className="p-6 text-center space-y-3">
              <p className="text-xs text-slate-500">No courses created yet.</p>
              <Link href="/trainer/courses/create">
                <Button size="sm" variant="primary">Create First Course</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 4).map((c) => (
                <Card key={c.id} className="hover:border-slate-300 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#087F8C] uppercase">{c.subject}</span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500">{c.modulesCount} modules</span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] font-medium text-emerald-700">{c.enrolledCount} enrolled</span>
                      </div>
                      <div className="font-bold text-sm text-[#0c2340] truncate">
                        {c.title}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/trainee/courses/${c.id}`}>
                        <Button size="sm" variant="outline">Preview</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Actions & Assessments */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#174A7E]" />
              Assessments & Quizzes
            </h3>
            <Link href="/trainer/assessments" className="text-xs font-semibold text-[#087F8C] hover:underline">
              View All →
            </Link>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              {assessments.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2">
                  No assessments created yet. Use the assessment manager or AI MCQ generator to create questions.
                </p>
              ) : (
                assessments.slice(0, 3).map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{a.title}</div>
                      <div className="text-[11px] text-slate-500">
                        {a.durationMinutes} mins • Passing: {a.passingScore}%
                      </div>
                    </div>
                    <Badge variant="secondary" size="sm">
                      {a.courseTitle || a.subject}
                    </Badge>
                  </div>
                ))
              )}

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <Link href="/trainer/ai-mcq-generator" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI MCQ Generator
                  </Button>
                </Link>
                <Link href="/trainer/library" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">
                    <FolderArchive className="h-3.5 w-3.5" />
                    Resources
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
