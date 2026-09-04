"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  Calendar,
  Building2,
  GraduationCap,
  ArrowLeft,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CertificateCard } from "@/components/certificate/CertificateCard";

export default function CertificateVerificationPage() {
  const params = useParams();
  const code = params?.code as string;
  const [cert, setCert] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`/api/certificates?code=${code}`);
        const data = await res.json();
        if (data.certificate) setCert(data.certificate);
      } catch (err) {
        console.error("Verification failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (code) verify();
  }, [code]);

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col justify-center items-center py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1 no-print">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-[#174A7E]">
            <Award className="h-6 w-6 text-[#D89A2E]" />
            <span>CAPACITY CONNECT VERIFICATION PORTAL</span>
          </Link>
          <p className="text-xs text-slate-500">Official Repository of Technical Training Credentials</p>
        </div>

        {isLoading ? (
          <Card className="text-center p-8 text-xs text-slate-500 max-w-md mx-auto">
            Validating certificate record in central database...
          </Card>
        ) : cert ? (
          <div className="space-y-6">
            <div className="no-print max-w-md mx-auto">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  AUTHENTIC VERIFIED CREDENTIAL
                </div>
                <p className="text-xs text-slate-600">
                  This certificate has been issued and verified by Capacity Connect.
                </p>
              </div>
            </div>

            <CertificateCard cert={cert} showActions={true} />

            <div className="text-center no-print">
              <Link href="/">
                <Button size="sm" variant="outline">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Capacity Connect Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Card className="border-rose-300 max-w-md mx-auto">
            <CardHeader className="bg-rose-50 text-center pb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-700 mb-2">
                <AlertCircle className="h-7 w-7" />
              </div>
              <Badge variant="danger" size="md" className="mx-auto">
                RECORD NOT FOUND
              </Badge>
              <CardTitle className="text-base font-bold text-slate-900 mt-2">
                Invalid Certificate Identifier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs text-slate-600 text-center">
              <p>
                The certificate identifier <strong className="font-mono text-slate-800">{code}</strong> could not be authenticated against the institutional database.
              </p>
              <Link href="/">
                <Button size="sm" variant="outline" className="w-full">
                  Return to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
