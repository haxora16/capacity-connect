"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset link. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Forgot password request error:", err);
      setError("Network issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0c2340] text-white shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-6 w-6">
              <path d="M 50 18 L 78 34 L 78 66 L 50 82 L 22 66 L 22 34 Z" fill="none" stroke="#0f766e" strokeWidth="6"/>
              <circle cx="50" cy="50" r="10" fill="#ffffff"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0c2340]">CAPACITY CONNECT</span>
        </Link>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200 rounded-xl shadow-sm space-y-6">
          
          {submitted ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">Recovery Instructions Dispatched</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If an institutional account exists with <strong>{email}</strong>, a secure password recovery link has been transmitted.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="primary" className="w-full bg-[#0c2340] hover:bg-[#174A7E] text-white">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Forgot your password?</h2>
                <p className="text-xs text-slate-500">
                  Enter your registered institutional email address and we&apos;ll transmit a single-use password recovery link.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-900">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="name@organization.gov.in"
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#174A7E] focus:border-[#174A7E] transition-colors"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-10 bg-[#0c2340] hover:bg-[#174A7E] text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending reset link..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                <Link href="/login" className="text-[#087F8C] font-semibold hover:underline">
                  Return to Sign In
                </Link>
              </div>
            </>
          )}

          {/* Trust line */}
          <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            <span>Encrypted recovery token with single-use expiration.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
