"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  PlusCircle,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function TrainerCoursesPage() {
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
            Manage course modules, learning objectives, and linked diagnostic assessments
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
        <div className="p-8 text-center text-xs text-slate-500">Loading courses...</div>
      ) : courses.length === 0 ? (
        <Card className="p-8 text-center space-y-3 max-w-md mx-auto">
          <div className="p-3 bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-500">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">No courses created yet</h2>
          <p className="text-xs text-slate-500">Create your first training course with structured learning modules.</p>
          <Link href="/trainer/courses/create">
            <Button size="sm" variant="primary">Create Course</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {course.code}
                  </span>
                  <Badge variant="outline" size="sm">{course.difficulty}</Badge>
                </div>

                <CardTitle className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                  {course.title}
                </CardTitle>
                <div className="text-[11px] text-slate-500">
                  Subject: <strong>{course.subject}</strong> • {course.category}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 text-xs text-slate-600">
                <p className="line-clamp-2 leading-relaxed">{course.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Duration: {course.durationHours} Hours</span>
                  <span>{course.modulesCount || 3} Modules</span>
                  <span className="font-semibold text-emerald-700">Published</span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <Link href={`/trainee/courses/${course.id}`} className="w-1/2">
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      View Course
                    </Button>
                  </Link>

                  <Link href={`/trainer/ai-mcq-generator`} className="w-1/2">
                    <Button size="sm" variant="primary" className="w-full text-xs">
                      <Sparkles className="h-3 w-3" />
                      Add MCQs
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
