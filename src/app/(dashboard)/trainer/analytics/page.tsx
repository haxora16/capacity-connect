"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  CheckSquare,
  Star,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function TrainerAnalyticsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, aRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/assessments"),
        ]);
        const [cData, aData] = await Promise.all([
          cRes.json(),
          aRes.json(),
        ]);
        if (cData.courses) setCourses(cData.courses);
        if (aData.assessments) setAssessments(aData.assessments);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Feedback & Course Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor candidate enrollment, pass rates, and course feedback
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Total Course Enrollments</div>
          <div className="text-2xl font-bold text-[#0c2340] font-mono">{totalEnrollments}</div>
          <div className="text-[11px] text-slate-500 font-medium">Across {courses.length} active courses</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Published Assessments</div>
          <div className="text-2xl font-bold text-[#087F8C] font-mono">{assessments.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">Examinations available</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Average Trainer Rating</div>
          <div className="text-2xl font-bold text-[#159A6A] font-mono flex items-center gap-1.5">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            4.8 / 5.0
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Based on candidate reviews</div>
        </div>
      </div>

      {/* Course Breakdown Table */}
      <Card>
        <CardHeader className="pb-3 bg-slate-50/50">
          <CardTitle className="text-sm font-bold text-slate-900">
            Course Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Course Title</th>
                  <th className="px-5 py-3">Subject Area</th>
                  <th className="px-5 py-3">Modules</th>
                  <th className="px-5 py-3">Enrolled Candidates</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{c.title}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{c.subject}</td>
                    <td className="px-5 py-3.5 font-mono">{c.modulesCount || 4}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{c.enrolledCount} Trainees</td>
                    <td className="px-5 py-3.5">
                      <Badge variant="success" size="sm">Active</Badge>
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
