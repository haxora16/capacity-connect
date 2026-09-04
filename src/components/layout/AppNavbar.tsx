"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  LogOut,
  User,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Menu,
} from "lucide-react";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";

export function AppNavbar({ toggleSidebar }: { toggleSidebar?: () => void }) {
  const { user, logout, isOffline } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-slate-900 text-white border-slate-700";
      case "TRAINER":
        return "bg-[#087F8C] text-white border-teal-800";
      case "TRAINEE":
        return "bg-[#174A7E] text-white border-[#174A7E]";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      {/* Offline Status Notice (Only visible when genuine offline mode is active) */}
      {isOffline && (
        <div className="bg-amber-500 text-white text-[11px] font-medium px-4 py-1 text-center shadow-xs">
          You&apos;re offline. Changes will sync when you&apos;re back online.
        </div>
      )}

      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shadow-2xs">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#174A7E] text-white shadow-xs font-bold text-xs">
              CC
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-[#174A7E]">
                  CAPACITY CONNECT
                </span>
                <span
                  className={`rounded-[3px] px-1.5 py-0.2 text-[9px] font-bold border uppercase ${getRoleBadgeColor(
                    user?.role
                  )}`}
                >
                  {user?.role || "PORTAL"}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block leading-none">
                Organizational Learning & Competency Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <>
              {/* Notification Bell Dropdown */}
              <NotificationDropdown />

              {/* User Profile Avatar Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all cursor-pointer"
                  aria-label="User Account Menu"
                >
                  <div className="h-8 w-8 rounded-full bg-[#174A7E] text-white flex items-center justify-center text-xs font-bold overflow-hidden border border-slate-200 shadow-2xs">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "CC"}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white border border-slate-200 shadow-lg py-1.5 z-50 text-xs">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <div className="font-bold text-slate-900 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {user.organization || "Capacity Connect"}
                      </div>
                      <div className="mt-1.5 inline-block">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {user.role} PORTAL
                        </span>
                      </div>
                    </div>

                    {user.role === "TRAINEE" && (
                      <Link
                        href="/trainee/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        My Profile & Competencies
                      </Link>
                    )}

                    {user.role === "TRAINER" && (
                      <Link
                        href="/trainer/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                        Trainer Console
                      </Link>
                    )}

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                        Admin Overview
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100 cursor-pointer font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#174A7E] hover:text-[#0c2340] px-2.5 py-1.5 rounded-md hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-xs font-semibold bg-[#174A7E] text-white hover:bg-[#0c2340] px-3 py-1.5 rounded-md shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
