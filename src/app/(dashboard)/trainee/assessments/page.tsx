"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  CheckSquare,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function TraineeAssessmentsPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAssessments() {
      try {
        const res = await fetch(`/api/assessments?userId=${user?.id || ""}`);
        const data = await res.json();
        if (data.assessments) setAssessments(data.assessments);
      } catch (err) {
        console.error("Failed to load assessments:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAssessments();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Assessments & Diagnostic Examinations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Timed technical evaluations for competency benchmarking and certification
          </p>
        </div>
      </div>

      {/* Assessment List Table */}
      <Card>
        <CardHeader className="bg-slate-50/50 pb-3">
          <CardTitle className="text-sm font-bold">Scheduled Assessments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Assessment Title</th>
                  <th className="px-5 py-3">Course / Subject</th>
                  <th className="px-5 py-3">Duration & Marks</th>
                  <th className="px-5 py-3">Passing Score</th>
                  <th className="px-5 py-3">Status / Result</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{a.title}</div>
                      {a.isAiGenerated && (
                        <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200 inline-block mt-0.5">
                          AI MCQ GENERATED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      <div>{a.courseTitle}</div>
                      <div className="text-[11px] text-slate-500">{a.subject}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {a.durationMinutes} mins
                      </div>
                      <div className="text-[10px] text-slate-400">Total: {a.totalMarks} Marks</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-medium">
                      {a.passingScore}%
                    </td>
                    <td className="px-5 py-3.5">
                      {a.userAttempt ? (
                        <Badge variant={a.userAttempt.isPassed ? "success" : "danger"}>
                          {a.userAttempt.isPassed ? "PASSED" : "FAILED"} ({a.userAttempt.percentage}%)
                        </Badge>
                      ) : (
                        <Badge variant="outline">PENDING ATTEMPT</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/trainee/assessments/${a.id}`}>
                        <Button size="sm" variant={a.userAttempt ? "outline" : "primary"}>
                          {a.userAttempt ? "Re-take Quiz" : "Start Examination"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
