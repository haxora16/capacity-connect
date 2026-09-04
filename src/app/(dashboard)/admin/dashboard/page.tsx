"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  BookOpen,
  CheckSquare,
  Award,
  SlidersHorizontal,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [atRisk, setAtRisk] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [uRes, cRes, aRes, rRes, annRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/courses"),
          fetch("/api/assessments"),
          fetch("/api/at-risk"),
          fetch("/api/announcements"),
        ]);
        const [uData, cData, aData, rData, annData] = await Promise.all([
          uRes.json(),
          cRes.json(),
          aRes.json(),
          rRes.json(),
          annRes.json(),
        ]);
        if (uData.users) setUsers(uData.users);
        if (cData.courses) setCourses(cData.courses);
        if (aData.assessments) setAssessments(aData.assessments);
        if (rData.atRiskTrainees) setAtRisk(rData.atRiskTrainees);
        if (annData.announcements) setAnnouncements(annData.announcements);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const traineesCount = users.filter((u) => u.role === "TRAINEE").length;
  const trainersCount = users.filter((u) => u.role === "TRAINER").length;
  const pendingTrainers = users.filter((u) => u.role === "TRAINER" && u.status === "PENDING_APPROVAL");
  const traineesNeedingAttention = atRisk.filter((r) => r.riskLevel === "HIGH" || r.riskLevel === "MEDIUM");

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading admin overview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Admin Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Platform management, user approvals, course oversight, and follow-up alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button size="sm" variant="outline">
              <Users className="h-3.5 w-3.5" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/trainer-matching">
            <Button size="sm" variant="primary">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Trainer Matching
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Simple Counts Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Trainees</div>
          <div className="text-2xl font-bold text-[#0c2340] tabular-nums mt-1">
            {traineesCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Registered accounts</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Trainers</div>
          <div className="text-2xl font-bold text-[#087F8C] tabular-nums mt-1">
            {trainersCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {pendingTrainers.length > 0 ? `${pendingTrainers.length} pending approval` : "All approved"}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Courses</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
            {courses.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active curriculum</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Assessments</div>
          <div className="text-2xl font-bold text-[#159A6A] tabular-nums mt-1">
            {assessments.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Examinations</div>
        </div>
      </div>

      {/* 3. Needs Attention Section */}
      <Card className="border-amber-300">
        <CardHeader className="bg-amber-50/70 pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            <CardTitle className="text-sm font-bold text-amber-950">
              Needs Attention
            </CardTitle>
          </div>
          <Link href="/admin/at-risk" className="text-xs font-semibold text-amber-900 hover:underline">
            View All Follow-ups →
          </Link>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {pendingTrainers.length === 0 && traineesNeedingAttention.length === 0 ? (
            <p className="text-xs text-slate-600 py-2">
              Everything is in order. No pending approvals or urgent trainee follow-ups at this time.
            </p>
          ) : (
            <div className="space-y-2">
              {/* Pending Trainer Approvals */}
              {pendingTrainers.map((pt) => (
                <div key={pt.id} className="flex items-center justify-between p-2.5 rounded bg-amber-50/50 border border-amber-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{pt.name}</span>
                    <span className="text-slate-500 ml-2">({pt.email})</span>
                    <div className="text-[11px] text-amber-800 font-medium mt-0.5">
                      New trainer registration awaiting admin verification
                    </div>
                  </div>
                  <Link href="/admin/users">
                    <Button size="sm" variant="primary">Review & Approve</Button>
                  </Link>
                </div>
              ))}

              {/* Trainees Needing Follow-up */}
              {traineesNeedingAttention.slice(0, 3).map((t) => (
                <div key={t.traineeId} className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{t.traineeName}</span>
                    <span className="text-slate-500 ml-2">({t.organization})</span>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Issue: {t.primaryReason || "Low participation in recent course modules"}
                    </div>
                  </div>
                  <Link href="/admin/at-risk">
                    <Button size="sm" variant="outline">
                      {t.recommendedAction || "Check In"}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Two Column Layout: Recent Activity & Quick Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Activity Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#174A7E]" />
              Recent Activity
            </h3>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="divide-y divide-slate-100 text-xs">
                {users.slice(0, 3).map((u) => (
                  <div key={u.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                      <span className="text-slate-500"> registered as </span>
                      <Badge variant="outline" size="sm">{u.role}</Badge>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                ))}

                {courses.slice(0, 2).map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">Course published: </span>
                      <span className="font-bold text-slate-900">{c.title}</span>
                    </div>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Announcements & Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-[#087F8C]" />
              Announcements
            </h3>
            <Link href="/admin/announcements" className="text-xs font-semibold text-[#087F8C] hover:underline">
              Create →
            </Link>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2">
                  No announcements broadcasted yet.
                </p>
              ) : (
                announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-2.5 rounded bg-slate-50 border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{a.title}</span>
                      <Badge variant="outline" size="sm">{a.targetRole || "EVERYONE"}</Badge>
                    </div>
                    <p className="text-slate-600 line-clamp-2">{a.content || a.summary}</p>
                  </div>
                ))
              )}

              <Link href="/admin/announcements" className="block pt-2">
                <Button size="sm" variant="outline" className="w-full">
                  <Megaphone className="h-3.5 w-3.5" />
                  Post New Announcement
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
