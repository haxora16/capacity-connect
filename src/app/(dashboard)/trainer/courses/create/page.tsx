"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  PlusCircle,
  Trash2,
  FileText,
  Video,
  Layers,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DifficultyLevel, ResourceKind } from "@/types";

interface ModuleInput {
  title: string;
  durationMin: number;
  resourceType: ResourceKind;
  content: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [subject, setSubject] = useState("Radar Meteorology");
  const [category, setCategory] = useState("Operational Remote Sensing");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("INTERMEDIATE");
  const [durationHours, setDurationHours] = useState(20);
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState<string[]>([
    "Understand operational observational principles",
    "Interpret diagnostic radar and satellite data",
  ]);
  const [newObjective, setNewObjective] = useState("");

  const [modules, setModules] = useState<ModuleInput[]>([
    {
      title: "Module 1: Fundamental Concepts & Observational Principles",
      durationMin: 60,
      resourceType: "TEXT",
      content: "Foundational theory, governing equations, and observational datasets.",
    },
    {
      title: "Module 2: Practical Data Interpretation & Diagnostic Analysis",
      durationMin: 75,
      resourceType: "PDF",
      content: "Case studies and operational diagnostics.",
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const handleRemoveObjective = (idx: number) => {
    setObjectives(objectives.filter((_, i) => i !== idx));
  };

  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        title: `Module ${modules.length + 1}: Diagnostic Exercise`,
        durationMin: 45,
        resourceType: "TEXT",
        content: "Module educational notes and operational guidelines.",
      },
    ]);
  };

  const handleRemoveModule = (idx: number) => {
    setModules(modules.filter((_, i) => i !== idx));
  };

  const handleModuleChange = (idx: number, field: keyof ModuleInput, val: any) => {
    const updated = [...modules];
    updated[idx] = { ...updated[idx], [field]: val };
    setModules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || modules.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          code: code || `MET-EXP-${Math.floor(100 + Math.random() * 900)}`,
          description,
          subject,
          category,
          difficulty,
          durationHours,
          objectives,
          modules,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/trainer/courses");
        }, 1500);
      }
    } catch (err) {
      console.error("Course creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Course Created Successfully!</h2>
        <p className="text-xs text-slate-600">
          The course and learning modules have been published to the catalog.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Create Course
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add curriculum details, learning objectives, and structured modules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/trainer/courses">
            <Button type="button" size="sm" variant="outline">
              <ArrowLeft className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="sm" variant="primary" disabled={isSubmitting || !title}>
            {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BookOpen className="h-3.5 w-3.5" />}
            Publish Course
          </Button>
        </div>
      </div>

      {/* Course Details Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-900">Course Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                id="course-title"
                label="Course Title *"
                placeholder="e.g. Advanced Doppler Weather Radar Interpretation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                id="course-code"
                label="Course Code"
                placeholder="e.g. MET-RAD-402"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div>
              <Select
                id="course-subject"
                label="Subject Area"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                options={[
                  { value: "Radar Meteorology", label: "Radar Meteorology" },
                  { value: "Satellite Meteorology", label: "Satellite Meteorology" },
                  { value: "Numerical Weather Prediction", label: "Numerical Weather Prediction" },
                  { value: "Synoptic Meteorology", label: "Synoptic Meteorology" },
                  { value: "Weather Forecasting", label: "Weather Forecasting" },
                  { value: "Climate Science", label: "Climate Science" },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Select
                  id="course-difficulty"
                  label="Difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  options={[
                    { value: "BEGINNER", label: "Beginner" },
                    { value: "INTERMEDIATE", label: "Intermediate" },
                    { value: "ADVANCED", label: "Advanced" },
                  ]}
                />
              </div>
              <div>
                <Input
                  id="course-duration"
                  type="number"
                  label="Duration (Hours)"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div>
            <Textarea
              id="course-description"
              label="Course Description"
              placeholder="Detailed syllabus and operational focus of this training program..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Objectives */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">Learning Objectives</label>
            <div className="space-y-1.5">
              {objectives.map((obj, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                  <span>• {obj}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(idx)}
                    className="text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 max-w-md pt-1">
              <Input
                placeholder="Add objective (e.g. Master velocity de-aliasing)"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
              />
              <Button type="button" size="sm" variant="outline" onClick={handleAddObjective}>
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Builder Card */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-900">
            Learning Modules ({modules.length})
          </CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={handleAddModule}>
            <PlusCircle className="h-3.5 w-3.5" />
            Add Module
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {modules.map((m, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0c2340]">Module {idx + 1}</span>
                {modules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(idx)}
                    className="text-slate-400 hover:text-red-600 cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <Input
                    label="Module Title"
                    value={m.title}
                    onChange={(e) => handleModuleChange(idx, "title", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Select
                    label="Resource Format"
                    value={m.resourceType}
                    onChange={(e) => handleModuleChange(idx, "resourceType", e.target.value)}
                    options={[
                      { value: "TEXT", label: "Text / Notes" },
                      { value: "PDF", label: "PDF Document" },
                      { value: "VIDEO", label: "Video" },
                      { value: "DOCUMENT", label: "Document / PPT" },
                    ]}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    label="Duration (Mins)"
                    value={m.durationMin}
                    onChange={(e) => handleModuleChange(idx, "durationMin", Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Textarea
                  label="Module Content / Summary"
                  rows={2}
                  value={m.content}
                  onChange={(e) => handleModuleChange(idx, "content", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </form>
  );
}
