"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  Layers,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export default function TraineeCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch(
          `/api/courses?userId=${user?.id || ""}&subject=${subjectFilter}&difficulty=${difficultyFilter}&search=${search}`
        );
        const data = await res.json();
        if (data.courses) setCourses(data.courses);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, [user, subjectFilter, difficultyFilter, search]);

  const subjects = [
    "ALL",
    "Radar Meteorology",
    "Satellite Meteorology",
    "Numerical Weather Prediction",
    "Synoptic Meteorology",
    "Aviation Meteorology",
    "Climate Science",
    "Atmospheric Science",
    "Weather Forecasting",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Institutional Course Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accredited capacity-building modules and operational meteorological training
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-[8px] border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-6">
          <Input
            id="course-search"
            label="Search Curricula by Keyword"
            placeholder="e.g. Doppler, Dvorak, WRF, Synoptic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            id="subject-filter"
            label="Subject Area"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            options={subjects.map((s) => ({ value: s, label: s }))}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            id="difficulty-filter"
            label="Difficulty Level"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            options={[
              { value: "ALL", label: "All Levels" },
              { value: "BEGINNER", label: "Beginner" },
              { value: "INTERMEDIATE", label: "Intermediate" },
              { value: "ADVANCED", label: "Advanced" },
            ]}
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col justify-between hover:border-slate-300 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {course.code}
                </span>
                <Badge
                  variant={
                    course.difficulty === "ADVANCED"
                      ? "danger"
                      : course.difficulty === "INTERMEDIATE"
                      ? "warning"
                      : "success"
                  }
                >
                  {course.difficulty}
                </Badge>
              </div>

              <CardTitle className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                {course.title}
              </CardTitle>
              <div className="text-[11px] text-slate-500 font-medium">
                Subject: {course.subject}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {course.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {course.durationHours} Hours
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  {course.modulesCount || 3} Modules
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  {course.trainerName?.split(" ")[1] || "Sharma"}
                </span>
              </div>

              {course.userProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-700">
                    <span>Progress</span>
                    <span className="tabular-nums">{course.userProgress}%</span>
                  </div>
                  <Progress value={course.userProgress} size="sm" indicatorColor="bg-[#0c2340]" />
                </div>
              )}
            </CardContent>

            <div className="p-4 pt-0">
              <Link href={`/trainee/courses/${course.id}`} className="block w-full">
                <Button variant={course.userProgress > 0 ? "secondary" : "outline"} size="sm" className="w-full justify-between">
                  <span>{course.userProgress > 0 ? "Resume Course" : "Explore Curriculum"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
