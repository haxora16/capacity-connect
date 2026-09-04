"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export interface RadarDataPoint {
  subject: string;
  current: number;
  target: number;
  fullMark?: number;
}

export function CompetencyRadarChart({ data }: { data: RadarDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-slate-400">
        No competency data available
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#334155", fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
          <Radar
            name="Current Proficiency (%)"
            dataKey="current"
            stroke="#0c2340"
            fill="#0c2340"
            fillOpacity={0.45}
          />
          <Radar
            name="Target Standard (%)"
            dataKey="target"
            stroke="#0f766e"
            fill="#0f766e"
            fillOpacity={0.15}
            strokeDasharray="3 3"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
