"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Compass,
  Award,
  User,
  PlusCircle,
  FolderArchive,
  Sparkles,
  Users,
  MessageSquareText,
  SlidersHorizontal,
  Megaphone,
  FileText,
  HelpCircle,
  LogOut,
  AlertCircle,
  Bot,
} from "lucide-react";

export function AppSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const role = user?.role || "TRAINEE";

  const traineeLinks = [
    { label: "Dashboard", href: "/trainee/dashboard", icon: LayoutDashboard },
    { label: "Courses", href: "/trainee/courses", icon: BookOpen },
    { label: "Assessments", href: "/trainee/assessments", icon: CheckSquare },
    { label: "Competency", href: "/trainee/competency", icon: Compass },
    { label: "Certificates", href: "/trainee/certificates", icon: Award },
    { label: "Learning Assistant", href: "/trainee/ai-assistant", icon: Bot },
    { label: "Profile", href: "/trainee/profile", icon: User },
  ];

  const trainerLinks = [
    { label: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
    { label: "Courses", href: "/trainer/courses", icon: BookOpen },
    { label: "Create Course", href: "/trainer/courses/create", icon: PlusCircle },
    { label: "Assessments", href: "/trainer/assessments", icon: CheckSquare },
    { label: "AI MCQ Generator", href: "/trainer/ai-mcq-generator", icon: Sparkles },
    { label: "Resources", href: "/trainer/library", icon: FolderArchive },
    { label: "Trainees", href: "/trainer/trainees", icon: Users },
    { label: "Feedback & Analytics", href: "/trainer/analytics", icon: MessageSquareText },
  ];

  const adminLinks = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Needs Attention", href: "/admin/at-risk", icon: AlertCircle },
    { label: "Trainer Matching", href: "/admin/trainer-matching", icon: SlidersHorizontal },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { label: "Reports", href: "/admin/reports", icon: FileText },
  ];

  let links = traineeLinks;
  if (role === "TRAINER") links = trainerLinks;
  else if (role === "ADMIN") links = adminLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky top-14 z-40 h-[calc(100vh-3.5rem)] w-56 border-r border-slate-200 bg-white flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top: Section Title & Navigation Links */}
        <div className="p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {role} PORTAL
          </div>

          <nav className="space-y-0.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== `/${role.toLowerCase()}/dashboard` && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#0c2340] text-white font-semibold shadow-2xs"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Organization Badge & Institutional Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="rounded-md bg-white p-2.5 border border-slate-200 text-[11px] space-y-0.5 shadow-2xs">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              CAPACITY CONNECT
            </div>
            <div className="text-slate-500 text-[10px] leading-tight">
              Institutional Training Platform
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              Public Home
            </Link>
            <button
              onClick={logout}
              className="hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
