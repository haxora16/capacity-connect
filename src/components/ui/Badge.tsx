import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "secondary";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) {
  const base = "inline-flex items-center font-medium select-none rounded-[4px]";

  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    secondary: "bg-teal-50 text-teal-800 border border-teal-200",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-50 text-amber-900 border border-amber-200",
    danger: "bg-rose-50 text-rose-800 border border-rose-200",
    info: "bg-sky-50 text-sky-800 border border-sky-200",
    outline: "bg-transparent text-slate-700 border border-slate-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], sizes[size], className))} {...props}>
      {children}
    </span>
  );
}
