"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  PlusCircle,
  Clock,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Courses
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor institutional training courses, assigned trainers, and enrollment activity
          </p>
        </div>

        <Link href="/trainer/courses/create">
          <Button size="sm" variant="primary">
            <PlusCircle className="h-3.5 w-3.5" />
            Create Course
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading course records...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Course Code & Title</th>
                    <th className="px-5 py-3">Subject Area</th>
                    <th className="px-5 py-3">Assigned Lead Trainer</th>
                    <th className="px-5 py-3">Duration & Modules</th>
                    <th className="px-5 py-3">Enrollments</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 mr-2">
                          {c.code}
                        </span>
                        {c.title}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">{c.subject}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{c.trainerName}</div>
                        <div className="text-[10px] text-slate-400">{c.trainerOrg}</div>
                      </td>
                      <td className="px-5 py-3.5 font-mono">
                        <div>{c.durationHours} Hours</div>
                        <div className="text-[10px] text-slate-400">{c.modulesCount || 3} Modules</div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {c.enrolledCount} Trainees
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="success" size="sm">Active</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/trainee/courses/${c.id}`}>
                          <Button size="sm" variant="outline">
                            View Course
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
      )}
    </div>
  );
}
