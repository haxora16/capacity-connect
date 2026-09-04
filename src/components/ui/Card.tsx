import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx("rounded-[8px] border border-slate-200 bg-white shadow-xs transition-shadow", className)
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx("flex flex-col space-y-1.5 p-5 border-b border-slate-100", className))} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge(clsx("text-base font-semibold text-slate-900 tracking-tight", className))}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={twMerge(clsx("text-xs text-slate-500", className))} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx("p-5", className))} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx("flex items-center p-5 pt-0 border-t border-slate-100 mt-4", className))} {...props}>
      {children}
    </div>
  );
}
