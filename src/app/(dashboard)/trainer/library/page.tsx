"use client";

import React, { useState, useEffect } from "react";
import {
  FolderArchive,
  Upload,
  FileText,
  Video,
  Layers,
  Download,
  Trash2,
  ExternalLink,
  Plus,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

export default function TrainerLibraryPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("PDF");
  const [newSubject, setNewSubject] = useState("Radar Meteorology");
  const [selectedPreview, setSelectedPreview] = useState<any | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/resources?type=${typeFilter}&subject=${subjectFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.resources) setResources(data.resources);
      });
  }, [typeFilter, subjectFilter]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          type: newType,
          subject: newSubject,
          fileSizeKb: Math.floor(2000 + Math.random() * 8000),
        }),
      });

      if (res.ok) {
        setUploadSuccess(true);
        setIsUploadOpen(false);
        setNewTitle("");
        // Reload list
        const refetched = await fetch(`/api/resources?type=${typeFilter}&subject=${subjectFilter}`);
        const data = await refetched.json();
        if (data.resources) setResources(data.resources);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Trainer Technical Resource Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational reference manuals, WMO guideline PDFs, presentation decks, and video modules
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={() => setIsUploadOpen(true)}>
          <Upload className="h-3.5 w-3.5" />
          Upload New Resource
        </Button>
      </div>

      {uploadSuccess && (
        <div className="p-3 rounded-[6px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Resource successfully uploaded and indexed in institutional repository.</span>
        </div>
      )}

      {/* Filter Tabs / Toolbar */}
      <div className="bg-white p-3.5 rounded-[8px] border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type Filter Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {["ALL", "PDF", "PPT", "VIDEO", "TEXT"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-[5px] font-semibold transition-colors cursor-pointer ${
                typeFilter === t
                  ? "bg-[#0c2340] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t === "ALL" ? "All Resources" : `${t} Files`}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div className="w-full sm:w-64">
          <Select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            options={[
              { value: "ALL", label: "All Subjects" },
              { value: "Radar Meteorology", label: "Radar Meteorology" },
              { value: "Numerical Weather Prediction", label: "Numerical Weather Prediction" },
              { value: "Aviation Meteorology", label: "Aviation Meteorology" },
              { value: "Synoptic Meteorology", label: "Synoptic Meteorology" },
            ]}
          />
        </div>
      </div>

      {/* Resources Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Resource Document Title</th>
                  <th className="px-5 py-3">Format</th>
                  <th className="px-5 py-3">Subject Domain</th>
                  <th className="px-5 py-3">File Size</th>
                  <th className="px-5 py-3">Author / Uploaded</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        {r.type === "PDF" ? (
                          <FileText className="h-4 w-4 text-rose-600 shrink-0" />
                        ) : r.type === "VIDEO" ? (
                          <Video className="h-4 w-4 text-teal-600 shrink-0" />
                        ) : (
                          <Layers className="h-4 w-4 text-amber-600 shrink-0" />
                        )}
                        <span>{r.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline">{r.type}</Badge>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{r.subject}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">
                      {Math.round(r.fileSizeKb / 1024 * 10) / 10} MB
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      <div>{r.trainerName}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPreview(r)}
                          className="h-7 text-xs"
                        >
                          Preview
                        </Button>
                        <a
                          href={r.fileUrl || "#"}
                          download
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Downloading verified copy of "${r.title}" from institutional storage.`);
                          }}
                        >
                          <Button size="sm" variant="secondary" className="h-7 text-xs">
                            <Download className="h-3 w-3" />
                          </Button>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {isUploadOpen && (
        <Modal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          title="Upload Institutional Training Document"
          description="Upload technical SOPs, case studies, or operational presentation decks"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <Input
              label="Document Title"
              placeholder="e.g. WMO Doppler Velocity De-aliasing Handbook"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Resource Type"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                options={[
                  { value: "PDF", label: "PDF Document" },
                  { value: "PPT", label: "PowerPoint Presentation" },
                  { value: "VIDEO", label: "Video Masterclass" },
                  { value: "TEXT", label: "Study Notes" },
                ]}
              />

              <Select
                label="Domain Subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                options={[
                  { value: "Radar Meteorology", label: "Radar Meteorology" },
                  { value: "Satellite Meteorology", label: "Satellite Meteorology" },
                  { value: "Numerical Weather Prediction", label: "Numerical Weather Prediction" },
                  { value: "Synoptic Meteorology", label: "Synoptic Meteorology" },
                  { value: "Aviation Meteorology", label: "Aviation Meteorology" },
                ]}
              />
            </div>

            <div className="p-6 border-2 border-dashed border-slate-300 rounded-[8px] text-center space-y-2 bg-slate-50">
              <Upload className="h-6 w-6 text-slate-400 mx-auto" />
              <div className="text-slate-700 font-semibold">
                Click to browse or drag & drop files here
              </div>
              <p className="text-[11px] text-slate-500">Supports PDF, PPTX, MP4 up to 50MB</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" type="button" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" type="submit">
                Submit to Repository
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Preview Modal */}
      {selectedPreview && (
        <Modal
          isOpen={!!selectedPreview}
          onClose={() => setSelectedPreview(null)}
          title={`Document Preview: ${selectedPreview.title}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-[6px] bg-slate-50 border border-slate-200 font-mono text-slate-700 space-y-2 leading-relaxed">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                EXECUTIVE SUMMARY • {selectedPreview.subject}
              </div>
              <p>
                This document serves as an authorized instructional reference for operational shifts. It details standard scanning strategies, Doppler velocity folding limits, and dual-polarimetric hydrometeor classification logic.
              </p>
              <p className="text-[11px] text-slate-500">
                Document File: {selectedPreview.fileUrl} • Size: {Math.round(selectedPreview.fileSizeKb / 1024 * 10) / 10} MB
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedPreview(null)}>
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  alert("Attaching document to active course syllabus.");
                  setSelectedPreview(null);
                }}
              >
                Attach to Course Syllabus
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
