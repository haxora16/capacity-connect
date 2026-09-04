"use client";

import React from "react";
import Link from "next/link";
import { Award, Printer, Download, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface CertificateData {
  id?: string;
  certificateCode: string;
  traineeName: string;
  traineeOrg?: string;
  traineeDesignation?: string;
  courseTitle: string;
  courseCode?: string;
  courseSubject?: string;
  durationHours?: number;
  trainerName?: string;
  issuedOn: string;
  grade?: string;
}

export function CertificateCard({
  cert,
  showActions = true,
}: {
  cert: CertificateData;
  showActions?: boolean;
}) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(cert.issuedOn).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* High-Fidelity Certificate Container */}
      <div className="certificate-printable bg-white border-8 border-double border-[#174A7E] p-8 sm:p-12 rounded-lg text-center shadow-lg relative overflow-hidden max-w-4xl mx-auto">
        {/* Decorative corner borders */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#D89A2E]" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#D89A2E]" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#D89A2E]" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#D89A2E]" />

        {/* Institutional Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[#174A7E] font-bold tracking-widest text-[11px] sm:text-xs uppercase">
            <Award className="h-5 w-5 text-[#D89A2E]" />
            CAPACITY CONNECT • NATIONAL TRAINING NETWORK
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#174A7E] tracking-tight uppercase font-serif">
            Certificate of Completion
          </h1>
          <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Official Credential of Technical Competence
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-0.5 w-16 bg-[#174A7E]" />
          <div className="h-2 w-2 rotate-45 bg-[#D89A2E]" />
          <div className="h-0.5 w-16 bg-[#174A7E]" />
        </div>

        {/* Candidate Presentation */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-slate-600 italic">This is to certify that</p>
          <div className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight border-b-2 border-slate-200 inline-block px-8 pb-1">
            {cert.traineeName}
          </div>
          <p className="text-xs text-slate-600 font-medium pt-1">
            {cert.traineeDesignation ? `${cert.traineeDesignation}, ` : ""}
            {cert.traineeOrg || "Institutional Training Unit"}
          </p>
        </div>

        {/* Course Details */}
        <div className="my-6 space-y-2">
          <p className="text-xs sm:text-sm text-slate-600">
            has successfully completed all modules, practical diagnostics, and passed the official examination for
          </p>
          <div className="text-lg sm:text-xl font-bold text-[#174A7E] max-w-2xl mx-auto">
            {cert.courseTitle}
          </div>
          <div className="text-xs font-semibold text-[#087F8C]">
            Classification Grade: <span className="text-[#159A6A] font-bold">{cert.grade || "First Class with Distinction"}</span>
          </div>
        </div>

        {/* Signatures & Footer Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 mt-6 border-t border-slate-200 text-xs items-end">
          {/* Issue Date */}
          <div className="text-left space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Date of Issuance</div>
            <div className="font-mono font-bold text-slate-800">{formattedDate}</div>
          </div>

          {/* Verification Code */}
          <div className="text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Certificate ID</div>
            <div className="font-mono font-bold text-[#174A7E] text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-200">
              {cert.certificateCode}
            </div>
          </div>

          {/* Lead Trainer Signature */}
          <div className="text-right space-y-1 col-span-2 sm:col-span-1">
            <div className="font-serif italic text-sm text-slate-800 font-bold">
              {cert.trainerName || "Dr. Rajesh Sharma"}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold border-t border-slate-300 pt-0.5">
              Authorized Lead Instructor
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-3 no-print pt-2">
          <Button size="sm" variant="primary" onClick={handlePrint} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF / Print
          </Button>

          <Link href={`/verify/${cert.certificateCode}`} target="_blank">
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Public Verification Link
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
