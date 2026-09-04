"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  PlusCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Send,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [targetRole, setTargetRole] = useState("ALL");
  const [isUrgent, setIsUrgent] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (data.announcements) setAnnouncements(data.announcements);
    } catch (err) {
      console.error("Failed to load announcements:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          content,
          category,
          targetRole,
          isUrgent,
        }),
      });

      if (res.ok) {
        setSuccessMsg("Announcement published successfully.");
        setIsModalOpen(false);
        setTitle("");
        setSummary("");
        setContent("");
        loadAnnouncements();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Publish error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Announcements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast official notices, training schedules, and updates to trainees and trainers
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="h-3.5 w-3.5" />
          Create Announcement
        </Button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} className={a.isUrgent ? "border-amber-300 bg-amber-50/20" : ""}>
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={a.isUrgent ? "warning" : "outline"} size="sm">
                    {a.category}
                  </Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-700">Audience: {a.targetRole}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Published on {new Date(a.publishDate).toLocaleDateString("en-IN")}
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-[#0c2340]">{a.title}</h2>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">
                  {a.content}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Announcement"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <Input
                label="Announcement Title *"
                placeholder="e.g. Schedule for Monsoonal Radar Training Course"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={[
                    { value: "General", label: "General Notice" },
                    { value: "Training", label: "Training Schedule" },
                    { value: "Assessment", label: "Assessment Notice" },
                    { value: "System", label: "System Maintenance" },
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Target Audience"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  options={[
                    { value: "ALL", label: "Everyone (All Users)" },
                    { value: "TRAINEE", label: "Trainees Only" },
                    { value: "TRAINER", label: "Trainers Only" },
                  ]}
                />
              </div>
            </div>

            <div>
              <Textarea
                label="Announcement Content *"
                rows={4}
                placeholder="Full details of the announcement..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isUrgentCheck"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded text-teal-700"
              />
              <label htmlFor="isUrgentCheck" className="text-slate-700 font-medium">
                Mark as High Priority / Urgent
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" size="sm" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="primary">
                <Send className="h-3.5 w-3.5" />
                Publish Announcement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
