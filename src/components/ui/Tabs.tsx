"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <TabsContext.Provider value={{ activeTab: value, setActiveTab: onValueChange }}>
      <div className={twMerge(clsx("w-full", className))}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        clsx(
          "inline-flex h-9 items-center justify-start rounded-[6px] bg-slate-100 p-1 text-slate-500 border border-slate-200",
          className
        )
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be within Tabs");

  const isActive = context.activeTab === value;

  return (
    <button
      type="button"
      onClick={() => context.setActiveTab(value)}
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] px-3 py-1 text-xs font-medium ring-offset-white transition-all focus-visible:outline-none cursor-pointer",
          isActive
            ? "bg-white text-[#0c2340] font-semibold shadow-xs border border-slate-200"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50",
          className
        )
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be within Tabs");

  if (context.activeTab !== value) return null;

  return <div className={twMerge(clsx("mt-3", className))}>{children}</div>;
}
