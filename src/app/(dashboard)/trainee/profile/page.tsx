"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  User,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Compass,
  CheckCircle2,
  Mail,
  Edit,
  Save,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function TraineeProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [designation, setDesignation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [newQual, setNewQual] = useState("");
  const [workExperience, setWorkExperience] = useState<string[]>([]);
  const [newExp, setNewExp] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/users/profile?userId=${user.id}`);
        const data = await res.json();
        if (data.user) {
          setProfileData(data.user);
          setName(data.user.name || "");
          setOrganization(data.user.organization || "");
          setDesignation(data.user.designation || "");

          const tp = data.user.traineeProfile;
          if (tp) {
            try {
              setSkills(JSON.parse(tp.skills || "[]"));
            } catch {
              setSkills(["Radar Meteorology", "Synoptic Analysis", "Weather Forecasting"]);
            }
            try {
              setQualifications(JSON.parse(tp.qualifications || "[]"));
            } catch {
              setQualifications(["M.Sc. Atmospheric Sciences"]);
            }
            try {
              setWorkExperience(JSON.parse(tp.workExperience || "[]"));
            } catch {
              setWorkExperience(["Operational Meteorologist (3 years)"]);
            }
            try {
              setInterests(JSON.parse(tp.interests || "[]"));
            } catch {
              setInterests(["Extreme Weather Modeling", "Satellite Imagery"]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          name,
          organization,
          designation,
          skills,
          qualifications,
          workExperience,
          interests,
        }),
      });

      if (res.ok) {
        setSaveMessage("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSaveMessage(null), 4000);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (idx: number) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const handleAddQual = () => {
    if (newQual.trim() && !qualifications.includes(newQual.trim())) {
      setQualifications([...qualifications, newQual.trim()]);
      setNewQual("");
    }
  };

  const handleRemoveQual = (idx: number) => {
    setQualifications(qualifications.filter((_, i) => i !== idx));
  };

  const handleAddExp = () => {
    if (newExp.trim() && !workExperience.includes(newExp.trim())) {
      setWorkExperience([...workExperience, newExp.trim()]);
      setNewExp("");
    }
  };

  const handleRemoveExp = (idx: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== idx));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (idx: number) => {
    setInterests(interests.filter((_, i) => i !== idx));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading user profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Trainee Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your details, organizational affiliations, skills, and qualifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {saveMessage}
        </div>
      )}

      {/* Main Profile Info Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
            <div className="h-16 w-16 rounded-full bg-[#0c2340] text-white flex items-center justify-center text-xl font-bold border-2 border-teal-600 shrink-0">
              {name ? name.slice(0, 2).toUpperCase() : "CC"}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{name || "Trainee"}</h2>
                <Badge variant="success" size="sm">ACTIVE TRAINEE</Badge>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {user?.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {organization || "Institutional Training Unit"}
                </span>
              </div>
            </div>
          </div>

          {/* Form / Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              {isEditing ? (
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              ) : (
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
                  {name || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Organization</label>
              {isEditing ? (
                <Input value={organization} onChange={(e) => setOrganization(e.target.value)} />
              ) : (
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
                  {organization || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Designation</label>
              {isEditing ? (
                <Input value={designation} onChange={(e) => setDesignation(e.target.value)} />
              ) : (
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
                  {designation || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="p-2.5 rounded bg-slate-100 border border-slate-200 text-xs text-slate-600 font-mono">
                {user?.email} (Authoritative)
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Qualifications & Degrees</label>
            <div className="flex flex-wrap gap-2">
              {qualifications.map((q, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-xs text-teal-900">
                  <GraduationCap className="h-3 w-3 text-teal-700" />
                  {q}
                  {isEditing && (
                    <button onClick={() => handleRemoveQual(idx)} className="text-slate-400 hover:text-red-600 cursor-pointer ml-1">
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2 max-w-sm pt-1">
                <Input placeholder="Add degree (e.g. M.Sc. Physics)" value={newQual} onChange={(e) => setNewQual(e.target.value)} />
                <Button size="sm" variant="outline" onClick={handleAddQual}>Add</Button>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Skills & Technical Competencies</label>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-800">
                  <Compass className="h-3 w-3 text-slate-500" />
                  {s}
                  {isEditing && (
                    <button onClick={() => handleRemoveSkill(idx)} className="text-slate-400 hover:text-red-600 cursor-pointer ml-1">
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2 max-w-sm pt-1">
                <Input placeholder="Add skill (e.g. Satellite Meteorology)" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                <Button size="sm" variant="outline" onClick={handleAddSkill}>Add</Button>
              </div>
            )}
          </div>

          {/* Work Experience */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Work Experience</label>
            <div className="space-y-1.5">
              {workExperience.map((exp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    {exp}
                  </span>
                  {isEditing && (
                    <button onClick={() => handleRemoveExp(idx)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2 max-w-md pt-1">
                <Input placeholder="Add experience (e.g. Aviation Forecaster, 2 years)" value={newExp} onChange={(e) => setNewExp(e.target.value)} />
                <Button size="sm" variant="outline" onClick={handleAddExp}>Add</Button>
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Areas of Interest</label>
            <div className="flex flex-wrap gap-2">
              {interests.map((int, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  {int}
                  {isEditing && (
                    <button onClick={() => handleRemoveInterest(idx)} className="text-slate-400 hover:text-red-600 cursor-pointer ml-1">
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2 max-w-sm pt-1">
                <Input placeholder="Add interest (e.g. Cyclone Dynamics)" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} />
                <Button size="sm" variant="outline" onClick={handleAddInterest}>Add</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
