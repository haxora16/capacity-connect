"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  BookOpen,
  Users,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function AdminReportsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, uRes, aRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/users"),
          fetch("/api/assessments"),
        ]);
        const [cData, uData, aData] = await Promise.all([
          cRes.json(),
          uRes.json(),
          aRes.json(),
        ]);
        if (cData.courses) setCourses(cData.courses);
        if (uData.users) setUsers(uData.users);
        if (aData.assessments) setAssessments(aData.assessments);
      } catch (err) {
        console.error("Failed to load reports data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCSV = (reportType: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (reportType === "COURSES") {
      csvContent += "Code,Title,Subject,Difficulty,DurationHours,EnrolledTrainees\n";
      courses.forEach((c) => {
        csvContent += `"${c.code}","${c.title}","${c.subject}","${c.difficulty}",${c.durationHours},${c.enrolledCount || 0}\n`;
      });
    } else if (reportType === "USERS") {
      csvContent += "Name,Email,Role,Organization,Designation,Status\n";
      users.forEach((u) => {
        csvContent += `"${u.name}","${u.email}","${u.role}","${u.organization || ""}","${u.designation || ""}","${u.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `capacity_connect_${reportType.toLowerCase()}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Reports & Exports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Export participation data, course enrollment records, and assessment performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" />
            Print View
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Participation Report */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#087F8C]" />
              <CardTitle className="text-sm font-bold text-slate-900">
                Course Participation Report
              </CardTitle>
            </div>
            <p className="text-xs text-slate-500">
              Detailed list of active courses, total enrolled candidates, and completion status
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
              <div><strong>Active Courses:</strong> {courses.length}</div>
              <div><strong>Total Enrollments:</strong> {courses.reduce((s, c) => s + (c.enrolledCount || 0), 0)}</div>
            </div>
            <Button
              size="sm"
              variant="primary"
              className="w-full"
              onClick={() => handleExportCSV("COURSES")}
            >
              <Download className="h-3.5 w-3.5" />
              Download Course CSV
            </Button>
          </CardContent>
        </Card>

        {/* User Directory Report */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#174A7E]" />
              <CardTitle className="text-sm font-bold text-slate-900">
                User Roster & Account Status
              </CardTitle>
            </div>
            <p className="text-xs text-slate-500">
              Export complete directory of trainees, trainers, organizations, and approval statuses
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
              <div><strong>Total Users:</strong> {users.length}</div>
              <div><strong>Trainees:</strong> {users.filter((u) => u.role === "TRAINEE").length}</div>
              <div><strong>Trainers:</strong> {users.filter((u) => u.role === "TRAINER").length}</div>
            </div>
            <Button
              size="sm"
              variant="primary"
              className="w-full"
              onClick={() => handleExportCSV("USERS")}
            >
              <Download className="h-3.5 w-3.5" />
              Download Users CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
