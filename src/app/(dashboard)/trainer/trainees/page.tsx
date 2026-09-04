"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Building2,
  CheckCircle2,
  AlertCircle,
  Award,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function TrainerTraineesPage() {
  const [trainees, setTrainees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTrainees() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.users) {
          const traineeUsers = data.users.filter((u: any) => u.role === "TRAINEE");
          setTrainees(traineeUsers);
        }
      } catch (err) {
        console.error("Failed to load trainees:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTrainees();
  }, []);

  const filtered = trainees.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      (t.organization && t.organization.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Trainees
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of enrolled candidates across your operational training courses
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-8">
          <Input
            label="Search Trainees"
            placeholder="Search by candidate name, email, or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm:col-span-4">
          <Select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "ALL", label: "All Statuses" },
              { value: "ACTIVE", label: "Active" },
              { value: "PENDING_APPROVAL", label: "Pending Approval" },
            ]}
          />
        </div>
      </div>

      {/* Trainees List Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading trainee roster...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Candidate Name</th>
                    <th className="px-5 py-3">Organization & Station</th>
                    <th className="px-5 py-3">Designation</th>
                    <th className="px-5 py-3">Courses Enrolled</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-500">{t.email}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium">
                        {t.organization || "Capacity Connect"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {t.designation || "Operational Trainee"}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {t.enrollmentsCount || 1} Course(s)
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="success" size="sm">ACTIVE</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Joined {new Date(t.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
