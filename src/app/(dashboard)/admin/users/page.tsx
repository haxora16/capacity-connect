"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  Shield,
  Building2,
  Mail,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [newRole, setNewRole] = useState("TRAINEE");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (userId: string, action: string, role?: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, newRole: role }),
      });

      if (res.ok) {
        setActionSuccess(`User updated successfully.`);
        setEditingUser(null);
        loadUsers();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.organization && u.organization.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Users
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage user accounts, trainer approval requests, and account status
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-6">
          <Input
            label="Search Users"
            placeholder="Search by name, email, or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            label="Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: "ALL", label: "All Roles" },
              { value: "TRAINEE", label: "Trainee" },
              { value: "TRAINER", label: "Trainer" },
              { value: "ADMIN", label: "Admin" },
            ]}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "ALL", label: "All Statuses" },
              { value: "ACTIVE", label: "Active" },
              { value: "PENDING_APPROVAL", label: "Pending Approval" },
              { value: "SUSPENDED", label: "Suspended" },
            ]}
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading user directory...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">User Name & Email</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Organization & Designation</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Joined Date</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={u.role === "ADMIN" ? "secondary" : u.role === "TRAINER" ? "info" : "outline"}
                          size="sm"
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        <div>{u.organization || "Capacity Connect"}</div>
                        <div className="text-[11px] text-slate-500">{u.designation || "-"}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={u.status === "ACTIVE" ? "success" : u.status === "PENDING_APPROVAL" ? "warning" : "danger"}
                          size="sm"
                        >
                          {u.status === "ACTIVE" ? "ACTIVE" : u.status === "PENDING_APPROVAL" ? "PENDING APPROVAL" : "SUSPENDED"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1.5">
                        {u.status === "PENDING_APPROVAL" && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAction(u.id, "APPROVE")}
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                        )}

                        {u.status === "ACTIVE" && u.role !== "ADMIN" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(u.id, "SUSPEND")}
                          >
                            Suspend
                          </Button>
                        )}

                        {u.status === "SUSPENDED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(u.id, "APPROVE")}
                          >
                            Reactivate
                          </Button>
                        )}
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
