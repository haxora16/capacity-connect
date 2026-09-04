import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  indicatorColor?: string;
  variant?: "primary" | "secondary" | "success" | "teal" | "amber" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
}

export function Progress({
  value,
  max = 100,
  indicatorColor,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variantColors: Record<string, string> = {
    primary: "bg-[#174A7E]",
    secondary: "bg-[#087F8C]",
    teal: "bg-[#087F8C]",
    success: "bg-[#159A6A]",
    amber: "bg-[#D89A2E]",
    warning: "bg-[#D89A2E]",
    danger: "bg-red-600",
  };

  const colorClass = indicatorColor || variantColors[variant] || "bg-[#174A7E]";

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={twMerge(clsx("relative w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200", heights[size], className))}
      {...props}
    >
      <div
        className={twMerge(clsx("h-full transition-all duration-300 rounded-full", colorClass))}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
