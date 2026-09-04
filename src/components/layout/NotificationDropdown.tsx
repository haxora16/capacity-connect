"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  BookOpen,
  CheckSquare,
  Award,
  Megaphone,
  GraduationCap,
  Info,
  ExternalLink,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172800) return "Yesterday";
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "COURSE":
      return <BookOpen className="h-4 w-4 text-[#087F8C]" />;
    case "ASSESSMENT":
      return <CheckSquare className="h-4 w-4 text-[#174A7E]" />;
    case "CERTIFICATE":
      return <Award className="h-4 w-4 text-[#D89A2E]" />;
    case "ANNOUNCEMENT":
      return <Megaphone className="h-4 w-4 text-[#159A6A]" />;
    case "TRAINING":
      return <GraduationCap className="h-4 w-4 text-[#087F8C]" />;
    default:
      return <Info className="h-4 w-4 text-slate-500" />;
  }
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Initial fetch and 30-second refetch
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    const handleFocus = () => fetchNotifications();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    // Optimistic local update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={`relative p-2 rounded-md transition-colors cursor-pointer ${
          isOpen
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Bell className="h-4 w-4" />

        {/* Unread badge: only shown when unreadCount > 0 */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#174A7E] px-1 text-[10px] font-bold text-white leading-none shadow-2xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-96 rounded-lg border border-slate-200 bg-white shadow-lg z-50 overflow-hidden font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 text-[#174A7E] px-2 py-0.5 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-semibold text-[#174A7E] hover:text-[#0c2340] hover:underline cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-10 text-center px-4 space-y-1">
                <p className="text-xs font-semibold text-slate-800">You&apos;re all caught up.</p>
                <p className="text-[11px] text-slate-500">No new notifications at this time.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  className={`p-3.5 transition-colors flex items-start gap-3 cursor-pointer hover:bg-slate-50 ${
                    !n.isRead ? "bg-slate-50/60" : "bg-white"
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-0.5 p-1.5 rounded-md bg-white border border-slate-200 shrink-0">
                    {getNotificationIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs truncate ${
                          !n.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700"
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!n.isRead && (
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#174A7E] shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
