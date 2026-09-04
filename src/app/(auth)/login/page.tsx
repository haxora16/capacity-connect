"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Compass,
  TrendingUp,
  Award,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithCredentials, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const statusParam = searchParams?.get("status");
    if (statusParam === "pending_approval") {
      setSuccessMsg("Trainer registration received. Your account is pending administrative approval.");
    } else if (statusParam === "reset_success") {
      setSuccessMsg("Password updated successfully. Please sign in with your new password.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await loginWithCredentials(email.trim(), password, rememberMe);

    if (!result.success) {
      setError(result.error || "Invalid email or password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Institutional Branding & Overview */}
        <div className="lg:col-span-6 space-y-6 lg:pr-4">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0c2340] text-white shadow-sm transition-transform group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-6 w-6">
                <path d="M 50 18 L 78 34 L 78 66 L 50 82 L 22 66 L 22 34 Z" fill="none" stroke="#0f766e" strokeWidth="6"/>
                <circle cx="50" cy="50" r="10" fill="#ffffff"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#0c2340] block">CAPACITY CONNECT</span>
              <span className="text-[11px] text-slate-500 font-medium block">National Institutional Training Platform</span>
            </div>
          </Link>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight leading-tight">
              Build skills.<br />
              Measure progress.<br />
              Grow capability.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              A secure learning and capacity-building platform for trainees, trainers and administrators across national operational meteorological centers.
            </p>
          </div>

          {/* Institutional Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-blue-50 text-[#174A7E] border border-blue-100 mt-0.5">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Accredited Competency Framework</h4>
                <p className="text-[12px] text-slate-500">Track multi-dimensional operational skill metrics and gap assessments.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-teal-50 text-[#087F8C] border border-teal-100 mt-0.5">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Adaptive Learning & Interventions</h4>
                <p className="text-[12px] text-slate-500">Structured courses, automated evaluations, and early academic support.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-emerald-50 text-[#159A6A] border border-emerald-100 mt-0.5">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Verifiable Credentials</h4>
                <p className="text-[12px] text-slate-500">Tamper-evident certificates with direct cryptographic public verification.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Clean Login Form */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#172033] tracking-tight">Welcome back</h2>
              <p className="text-xs text-slate-500">
                Sign in to continue to CAPACITY CONNECT.
              </p>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-900">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
                  Email Address
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

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#087F8C] hover:text-[#065f69] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••"
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#174A7E] focus:border-[#174A7E] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-1">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#174A7E] focus:ring-[#174A7E] cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 cursor-pointer select-none">
                  Remember me on this device
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-10 bg-[#0c2340] hover:bg-[#174A7E] text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isSubmitting || authLoading}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>

            <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#087F8C] font-bold hover:underline">
                Create Account →
              </Link>
            </div>

            {/* Single Trust Line */}
            <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>Your account is protected with secure authentication and role-based access.</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center text-xs text-slate-500">Loading portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
