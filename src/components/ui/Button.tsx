import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variants = {
      primary: "bg-[#0c2340] text-white hover:bg-[#08172c] focus-visible:ring-[#0c2340] active:bg-[#050f1d]",
      secondary: "bg-[#0f766e] text-white hover:bg-[#115e59] focus-visible:ring-[#0f766e] active:bg-[#134e4a]",
      outline:
        "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-slate-400 active:bg-slate-100",
      danger: "bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-600 active:bg-red-900",
      ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300 active:bg-slate-200",
      link: "text-[#1e3a8a] underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-0",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-[6px] gap-1.5",
      md: "h-9 px-4 text-sm rounded-[6px] gap-2",
      lg: "h-11 px-5 text-base rounded-[8px] gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
