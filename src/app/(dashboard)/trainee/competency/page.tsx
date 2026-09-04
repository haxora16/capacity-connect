"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Compass,
  Award,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export default function TraineeCompetencyPage() {
  const { user } = useAuth();
  const [competencyData, setCompetencyData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCompetency() {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/competency?userId=${user.id}`);
        const data = await res.json();
        if (data.trainee) {
          setCompetencyData(data);
        }
      } catch (err) {
        console.error("Failed to load competency data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCompetency();
  }, [user]);

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading competency record...</div>;
  }

  const competencies: any[] = competencyData?.competencies || [
    { subjectArea: "Radar Meteorology", currentScore: 88, targetScore: 85, gapScore: 0 },
    { subjectArea: "Satellite Meteorology", currentScore: 65, targetScore: 85, gapScore: 20 },
    { subjectArea: "Numerical Weather Prediction", currentScore: 78, targetScore: 85, gapScore: 7 },
    { subjectArea: "Synoptic Analysis", currentScore: 90, targetScore: 85, gapScore: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Competencies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your current proficiency levels, required benchmarks, and recommended learning
          </p>
        </div>

        <Link href="/trainee/courses">
          <Button size="sm" variant="primary">
            <BookOpen className="h-3.5 w-3.5" />
            Explore Recommended Courses
          </Button>
        </Link>
      </div>

      {/* Competencies Table / List */}
      <Card>
        <CardHeader className="bg-slate-50/50 pb-3">
          <CardTitle className="text-sm font-bold text-slate-900">
            Competency Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Competency Subject</th>
                  <th className="px-5 py-3">Current Level</th>
                  <th className="px-5 py-3">Required Benchmark</th>
                  <th className="px-5 py-3">Status / Gap</th>
                  <th className="px-5 py-3 text-right">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {competencies.map((comp, idx) => {
                  const current = Math.round(comp.currentScore);
                  const target = Math.round(comp.targetScore || 85);
                  const gap = Math.max(0, target - current);
                  const isProficient = current >= target;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Compass className="h-4 w-4 text-teal-700" />
                          <span>{comp.subjectArea}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1 w-36">
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>{current}%</span>
                            <span className="text-slate-500 font-normal">
                              {current >= 85 ? "Proficient" : current >= 70 ? "Developing" : "Needs Support"}
                            </span>
                          </div>
                          <Progress
                            value={current}
                            variant={isProficient ? "success" : current >= 70 ? "teal" : "amber"}
                            size="sm"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-medium text-slate-700">
                        {target}%
                      </td>
                      <td className="px-5 py-4">
                        {isProficient ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                            Proficient
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            <AlertCircle className="h-3 w-3 mr-1 inline" />
                            Needs Development (-{gap}%)
                          </Badge>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href="/trainee/courses">
                          <Button size="sm" variant={isProficient ? "outline" : "primary"}>
                            {isProficient ? "Review Material" : "Start Course"}
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
