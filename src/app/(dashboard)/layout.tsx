"use client";

import React, { useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 w-full min-w-0 p-4 md:p-6 lg:p-8 max-w-[1500px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
