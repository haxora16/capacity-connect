import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          type={type}
          className={twMerge(
            clsx(
              "flex h-9 w-full rounded-[6px] border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-2xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c2340] focus-visible:border-[#0c2340] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )
          )}
          {...props}
        />
        {hint && !error && <p className="text-[11px] text-slate-500">{hint}</p>}
        {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={twMerge(
            clsx(
              "flex h-9 w-full rounded-[6px] border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c2340] focus-visible:border-[#0c2340] disabled:cursor-not-allowed disabled:bg-slate-100",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          className={twMerge(
            clsx(
              "flex w-full rounded-[6px] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c2340] focus-visible:border-[#0c2340] disabled:cursor-not-allowed disabled:bg-slate-100",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )
          )}
          {...props}
        />
        {hint && !error && <p className="text-[11px] text-slate-500">{hint}</p>}
        {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
