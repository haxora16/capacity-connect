"use client";

import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Award,
  CheckCircle2,
  Info,
  Building2,
  GraduationCap,
  Briefcase,
  Star,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export default function TrainerMatchingPage() {
  const [selectedSubject, setSelectedSubject] = useState("Radar Meteorology");
  const [matches, setMatches] = useState<any[]>([]);
  const [assignedTrainer, setAssignedTrainer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const subjects = [
    "Radar Meteorology",
    "Satellite Meteorology",
    "Numerical Weather Prediction",
    "Synoptic Meteorology",
    "Aviation Meteorology",
    "Climate Science",
    "Atmospheric Science",
    "Weather Forecasting",
  ];

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/trainer-matching?subject=${selectedSubject}`);
        const data = await res.json();
        if (data.matches) setMatches(data.matches);
      } catch (err) {
        console.error("Failed to load trainer matches:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMatches();
  }, [selectedSubject]);

  const handleAssign = (trainerName: string) => {
    setAssignedTrainer(trainerName);
    setTimeout(() => setAssignedTrainer(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Trainer Matching
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Match qualified instructors to training topics using transparent weighted competency criteria
          </p>
        </div>
      </div>

      {assignedTrainer && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            Instructor <strong>{assignedTrainer}</strong> assigned as Lead Trainer for {selectedSubject}.
          </span>
        </div>
      )}

      {/* Transparent Formula Callout */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Info className="h-4 w-4 text-[#087F8C]" />
            <span>Transparent Matching Model</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The ranking is calculated using transparent weighted parameters from instructor profiles:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#0c2340] block text-sm">40%</span>
              <span className="text-slate-600 text-[11px]">Skills & Specialization</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#087F8C] block text-sm">20%</span>
              <span className="text-slate-600 text-[11px]">Academic Qualifications</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700 block text-sm">20%</span>
              <span className="text-slate-600 text-[11px]">Years of Experience</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#159A6A] block text-sm">20%</span>
              <span className="text-slate-600 text-[11px]">Training Rating & History</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Selector Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Select
            label="Select Training Subject Area"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={subjects.map((s) => ({ value: s, label: s }))}
          />
        </div>

        <div className="text-xs text-slate-500 self-end sm:self-center">
          Matching against <strong>{matches.length}</strong> instructor profile(s)
        </div>
      </div>

      {/* Matches List */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">Calculating instructor matches...</div>
      ) : (
        <div className="space-y-4">
          {matches.map((m, idx) => {
            const isTopMatch = idx === 0;
            return (
              <Card
                key={m.trainerId}
                className={isTopMatch ? "border-teal-400 bg-teal-50/20 shadow-xs" : ""}
              >
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{m.trainerName}</span>
                      {isTopMatch ? (
                        <Badge variant="success" size="sm">BEST MATCH</Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">RECOMMENDED</Badge>
                      )}
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600 flex items-center gap-1 font-mono">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        {m.rating ? m.rating.toFixed(1) : "4.8"}/5.0
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {m.organization || "Capacity Connect"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        {m.experienceYears} Years Experience
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                        {m.qualifications.join(", ") || "M.Sc. Atmospheric Sciences"}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <strong>Why this trainer:</strong> Specializes in {m.specialization} with {m.experienceYears} years of operational experience.
                    </div>
                  </div>

                  {/* Right: Score Breakdown & Action */}
                  <div className="w-full md:w-64 space-y-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Overall Match Score</span>
                      <span className="text-lg font-bold text-[#0c2340]">{m.overallMatch}%</span>
                    </div>
                    <Progress
                      value={m.overallMatch}
                      variant={isTopMatch ? "success" : "teal"}
                      size="md"
                    />

                    <Button
                      size="sm"
                      variant={isTopMatch ? "primary" : "outline"}
                      className="w-full"
                      onClick={() => handleAssign(m.trainerName)}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Assign as Lead Trainer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
