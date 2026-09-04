"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export function EnrollmentTrendChart({
  data,
}: {
  data: { month: string; enrollments: number; completions: number }[];
}) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0c2340" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0c2340" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="enrollments"
            name="Enrollments"
            stroke="#0c2340"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#enrollmentGrad)"
          />
          <Area
            type="monotone"
            dataKey="completions"
            name="Completions"
            stroke="#0f766e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#completionGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScoreDistributionChart({
  data,
}: {
  data: { range: string; count: number; category: string }[];
}) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="range" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" name="Trainees" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
