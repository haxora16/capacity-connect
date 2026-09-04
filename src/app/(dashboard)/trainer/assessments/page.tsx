"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Sparkles,
  Clock,
  Award,
  Users,
  PlusCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function TrainerAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assessments")
      .then((res) => res.json())
      .then((data) => {
        if (data.assessments) setAssessments(data.assessments);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Assessments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, manage, and review examination questions and passing benchmarks
          </p>
        </div>

        <Link href="/trainer/ai-mcq-generator">
          <Button size="sm" variant="primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI MCQ Generator
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading assessments...</div>
      ) : assessments.length === 0 ? (
        <Card className="p-8 text-center space-y-3 max-w-md mx-auto">
          <div className="p-3 bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-500">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">No assessments created yet</h2>
          <p className="text-xs text-slate-500">
            Use the AI MCQ Generator to generate and publish questions for your courses.
          </p>
          <Link href="/trainer/ai-mcq-generator">
            <Button size="sm" variant="primary">Generate Assessment Questions</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assessments.map((ass) => (
            <Card key={ass.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {ass.courseCode || "MET-EVAL"}
                  </span>
                  {ass.isAiGenerated ? (
                    <Badge variant="secondary" size="sm">AI ASSISTED</Badge>
                  ) : (
                    <Badge variant="outline" size="sm">STANDARD</Badge>
                  )}
                </div>

                <CardTitle className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                  {ass.title}
                </CardTitle>
                <div className="text-[11px] text-slate-500">
                  Course: {ass.courseTitle} • {ass.subject}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 text-xs text-slate-600">
                <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 p-2.5 rounded-md border border-slate-200 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">Duration</div>
                    <div className="font-bold text-slate-800 font-mono mt-0.5">{ass.durationMinutes} mins</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Passing Grade</div>
                    <div className="font-bold text-teal-800 font-mono mt-0.5">{ass.passingScore}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Total Marks</div>
                    <div className="font-bold text-slate-800 font-mono mt-0.5">{ass.totalMarks} pts</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Status: <strong className="text-emerald-700">Published</strong></span>
                  <Link href={`/trainee/assessments/${ass.id}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      Preview Assessment →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
