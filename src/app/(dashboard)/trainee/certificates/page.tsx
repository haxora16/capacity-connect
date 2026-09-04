"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Award,
  Download,
  Printer,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  BookOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CertificateCard } from "@/components/certificate/CertificateCard";

export default function TraineeCertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCertificates() {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/certificates?userId=${user.id}`);
        const data = await res.json();
        if (data.certificates) setCertificates(data.certificates);
      } catch (err) {
        console.error("Failed to load certificates:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCertificates();
  }, [user]);

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading certificates...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official verifiable credentials awarded upon course completion and passed examinations
          </p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <Card className="p-8 text-center space-y-3 max-w-md mx-auto">
          <div className="p-3 bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-500">
            <Award className="h-6 w-6" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">No certificates earned yet</h2>
          <p className="text-xs text-slate-500">
            Complete your enrolled courses and achieve passing marks in official assessments to receive verified certificates.
          </p>
          <Link href="/trainee/courses">
            <Button size="sm" variant="primary">Browse Courses</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-t-4 border-t-[#174A7E] flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {cert.certificateCode}
                  </span>
                  <Badge variant="success" size="sm">VERIFIED</Badge>
                </div>

                <CardTitle className="text-sm font-bold text-slate-900 mt-2">
                  {cert.courseTitle}
                </CardTitle>
                <div className="text-[11px] text-slate-500 font-mono">
                  Code: {cert.courseCode}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Candidate:</span>
                    <span className="font-semibold text-slate-900">{cert.traineeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Classification:</span>
                    <span className="font-bold text-emerald-700">{cert.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issued Date:</span>
                    <span className="font-mono">{new Date(cert.issuedOn).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full flex items-center gap-1.5"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <Award className="h-3.5 w-3.5" />
                    View & Download
                  </Button>

                  <Link href={`/verify/${cert.certificateCode}`} target="_blank">
                    <Button size="sm" variant="outline" title="Verify Online">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal View for High-Fidelity Certificate */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between no-print">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-[#D89A2E]" />
                Official Certificate
              </h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <CertificateCard
              cert={{
                ...selectedCert,
                traineeOrg: selectedCert.traineeOrg || user?.organization,
                traineeDesignation: selectedCert.traineeDesignation || user?.designation,
              }}
              showActions={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
