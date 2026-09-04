"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  User,
  Clock,
  Send,
  ArrowRight,
  Info,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

export default function AdminNeedsAttentionPage() {
  const [followupList, setFollowupList] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedTrainee, setSelectedTrainee] = useState<any | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFollowupData() {
      try {
        const res = await fetch("/api/at-risk");
        const data = await res.json();
        if (data.atRiskTrainees) setFollowupList(data.atRiskTrainees);
      } catch (err) {
        console.error("Failed to load follow-up list:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFollowupData();
  }, []);

  const handleApplyAction = async () => {
    if (!selectedTrainee || !actionNote) return;

    try {
      const res = await fetch("/api/at-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riskId: selectedTrainee.id,
          actionTaken: actionNote,
          newRiskLevel: "LOW",
        }),
      });

      if (res.ok) {
        setActionSuccess(`Follow-up action logged for ${selectedTrainee.userName || "Trainee"}.`);
        setSelectedTrainee(null);
        setActionNote("");

        // Refresh list
        const refreshed = await fetch("/api/at-risk");
        const d = await refreshed.json();
        if (d.atRiskTrainees) setFollowupList(d.atRiskTrainees);

        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error("Failed to record follow-up:", err);
    }
  };

  const filtered = followupList.filter((r) => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "ATTENTION") return r.riskLevel === "HIGH" || r.riskLevel === "MEDIUM";
    if (filterStatus === "RESOLVED") return r.riskLevel === "LOW";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Trainee Follow-up & Needs Attention
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify trainees who may need additional support based on participation and assessment results
          </p>
        </div>

        <Link href="/admin/dashboard">
          <Button size="sm" variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span>Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs p-1.5 rounded border border-slate-300 bg-white"
          >
            <option value="ALL">All Trainees</option>
            <option value="ATTENTION">Needs Attention</option>
            <option value="RESOLVED">Resolved / On Track</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Showing {filtered.length} candidate record(s)
        </span>
      </div>

      {/* Trainee Follow-up Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading candidate records...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center space-y-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
          <h2 className="text-sm font-bold text-slate-900">No trainees currently need follow-up</h2>
          <p className="text-xs text-slate-500">All registered candidates are making satisfactory progress.</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Trainee</th>
                    <th className="px-5 py-3">Organization</th>
                    <th className="px-5 py-3">Status / Issue</th>
                    <th className="px-5 py-3">Suggested Action</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{item.userName}</div>
                        <div className="text-[11px] text-slate-500">{item.userEmail}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium">
                        {item.organization || "Institutional Training Core"}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={item.riskLevel === "HIGH" ? "danger" : item.riskLevel === "MEDIUM" ? "warning" : "success"}
                            size="sm"
                          >
                            {item.riskLevel === "HIGH" ? "Needs Support" : item.riskLevel === "MEDIUM" ? "Needs Follow-up" : "On Track"}
                          </Badge>
                          <span className="text-[11px] text-slate-600">
                            {item.primaryReason || "Low activity in recent modules"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {item.recommendedAction || "Check in with trainee"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTrainee(item);
                            setActionNote(item.recommendedAction || "Reach out to discuss learning path and offer mentorship.");
                          }}
                        >
                          Log Follow-up
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog Modal */}
      {selectedTrainee && (
        <Modal
          isOpen={!!selectedTrainee}
          onClose={() => setSelectedTrainee(null)}
          title={`Follow-up for ${selectedTrainee.userName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
              <div><strong>Candidate:</strong> {selectedTrainee.userName} ({selectedTrainee.userEmail})</div>
              <div><strong>Observed Issue:</strong> {selectedTrainee.primaryReason || "Low participation"}</div>
              <div><strong>Suggested Action:</strong> {selectedTrainee.recommendedAction}</div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Follow-up Action / Notes</label>
              <Textarea
                rows={3}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Details of the support provided or reminder sent..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedTrainee(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleApplyAction}>
                <Send className="h-3.5 w-3.5" />
                Record Follow-up
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
