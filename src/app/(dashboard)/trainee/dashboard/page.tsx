"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  BookOpen,
  Award,
  CheckSquare,
  ArrowRight,
  Clock,
  Compass,
  Megaphone,
  CheckCircle2,
  FileText,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export default function TraineeDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        const [cRes, aRes, certRes, annRes] = await Promise.all([
          fetch(`/api/courses?userId=${user.id}`),
          fetch(`/api/assessments?userId=${user.id}`),
          fetch(`/api/certificates?userId=${user.id}`),
          fetch("/api/announcements?role=TRAINEE"),
        ]);

        const [cData, aData, certData, annData] = await Promise.all([
          cRes.json(),
          aRes.json(),
          certRes.json(),
          annRes.json(),
        ]);

        if (cData.courses) setCourses(cData.courses);
        if (aData.assessments) setAssessments(aData.assessments);
        if (certData.certificates) setCertificates(certData.certificates);
        if (annData.announcements) setAnnouncements(annData.announcements.slice(0, 3));
      } catch (err) {
        console.error("Failed to load trainee dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const enrolledCourses = courses.filter((c) => c.isEnrolled || c.userProgress > 0);
  const activeCourse = enrolledCourses.find((c) => c.userProgress < 100) || enrolledCourses[0] || courses[0];
  const completedCourses = enrolledCourses.filter((c) => c.userProgress >= 100);
  const recentAttempts = assessments
    .filter((a) => a.userAttempt)
    .sort((a, b) => new Date(b.userAttempt.submittedAt).getTime() - new Date(a.userAttempt.submittedAt).getTime());

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Loading learning overview...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            {greeting}, {user?.name || "Trainee"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {user?.designation || "Trainee"} • {user?.organization || "Institutional Training Unit"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/trainee/courses">
            <Button size="sm" variant="primary">
              <BookOpen className="h-3.5 w-3.5" />
              Browse Courses
            </Button>
          </Link>
          <Link href="/trainee/ai-assistant">
            <Button size="sm" variant="outline">
              Ask Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Announcements Banner (if any) */}
      {announcements.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3.5 space-y-1 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Megaphone className="h-4 w-4 text-amber-700 shrink-0" />
            <span>Institutional Announcement: {announcements[0].title}</span>
          </div>
          <p className="text-slate-700 pl-6">{announcements[0].summary || announcements[0].content}</p>
        </div>
      )}

      {/* 3. Continue Learning Spotlight */}
      {activeCourse && (
        <Card className="border-teal-200 bg-linear-to-r from-teal-50/50 via-white to-white">
          <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  {activeCourse.isEnrolled ? "IN PROGRESS" : "FEATURED COURSE"}
                </Badge>
                <span className="text-xs text-slate-500">{activeCourse.subject}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#0c2340]">
                {activeCourse.title}
              </h2>
              <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">
                {activeCourse.description}
              </p>

              <div className="space-y-1 pt-1 max-w-md">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Course Progress</span>
                  <span>{activeCourse.userProgress || 0}%</span>
                </div>
                <Progress value={activeCourse.userProgress || 0} variant="teal" size="sm" />
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              <Link href={`/trainee/courses/${activeCourse.id}`}>
                <Button variant="primary" className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  {activeCourse.userProgress > 0 ? "Continue Course" : "Start Course"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Two Column Layout: My Courses & Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: My Enrolled Courses */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#087F8C]" />
              My Courses ({enrolledCourses.length})
            </h3>
            <Link href="/trainee/courses" className="text-xs font-semibold text-[#087F8C] hover:underline">
              View All Courses →
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <Card className="text-center p-6 space-y-3">
              <div className="p-3 bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-500">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="text-xs text-slate-600 font-medium">You have not enrolled in any courses yet.</p>
              <Link href="/trainee/courses">
                <Button size="sm" variant="outline">Browse Catalog & Enroll</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {enrolledCourses.map((c) => (
                <Card key={c.id} className="hover:border-slate-300 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#087F8C] uppercase">{c.subject}</span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500">{c.modulesCount || 4} modules</span>
                      </div>
                      <Link href={`/trainee/courses/${c.id}`} className="font-bold text-sm text-[#0c2340] hover:underline truncate block">
                        {c.title}
                      </Link>
                      <div className="w-full max-w-xs pt-1">
                        <Progress value={c.userProgress || 0} variant="teal" size="sm" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-slate-700">{c.userProgress || 0}%</span>
                      <Link href={`/trainee/courses/${c.id}`}>
                        <Button size="sm" variant="outline">Open</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right: Upcoming Assessments & Recent Results */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#174A7E]" />
              Assessments & Results
            </h3>
            <Link href="/trainee/assessments" className="text-xs font-semibold text-[#087F8C] hover:underline">
              All Assessments →
            </Link>
          </div>

          <div className="space-y-3">
            {/* Recent Results */}
            {recentAttempts.length > 0 ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Recent Assessment Attempt
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {recentAttempts.slice(0, 2).map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{a.title}</div>
                        <div className="text-[11px] text-slate-500">
                          Score: {a.userAttempt.score}/{a.totalMarks} ({a.userAttempt.percentage}%)
                        </div>
                      </div>
                      <Badge variant={a.userAttempt.isPassed ? "success" : "danger"} size="sm">
                        {a.userAttempt.isPassed ? "Passed" : "Needs Review"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="p-4 text-center text-xs text-slate-500">
                No assessments taken yet. Complete course modules to unlock assessments.
              </Card>
            )}

            {/* Certificates Earned */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Earned Certificates ({certificates.length})</span>
                  <Link href="/trainee/certificates" className="text-[11px] text-[#087F8C] font-semibold hover:underline">
                    View
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {certificates.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Certificates are automatically awarded upon successfully passing course examinations.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {certificates.slice(0, 2).map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-2 rounded bg-emerald-50/60 border border-emerald-200 text-xs">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-emerald-700" />
                          <div>
                            <span className="font-bold text-slate-900 block">{cert.courseTitle}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{cert.certificateCode}</span>
                          </div>
                        </div>
                        <Link href={`/verify/${cert.certificateCode}`} className="text-[#087F8C] font-bold text-xs hover:underline">
                          Verify
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
