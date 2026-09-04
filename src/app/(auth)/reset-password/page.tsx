"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password requirement checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Missing or invalid password reset token. Please request a new link.");
      return;
    }

    if (!isPasswordStrong) {
      setError("Please ensure your password meets all complexity requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
        setIsLoading(false);
        return;
      }

      // Redirect to login with success query parameter
      router.push("/login?status=reset_success");
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Network connection issue. Please try again.");
      setIsLoading(false);
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
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Set New Password</h2>
            <p className="text-xs text-slate-500">
              Create a secure password to access your CAPACITY CONNECT account.
            </p>
          </div>

          {!token ? (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>No valid password recovery token was detected in the URL.</span>
              </div>
              <Link href="/forgot-password">
                <Button variant="outline" className="w-full">
                  Request New Password Reset Link
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-900">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* New Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#174A7E] focus:border-[#174A7E] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Compact Complexity checklist */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 grid grid-cols-2 gap-1.5">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${hasMinLength ? "text-emerald-600" : "text-slate-300"}`} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${hasUppercase ? "text-emerald-600" : "text-slate-300"}`} />
                    <span>1 uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${hasLowercase ? "text-emerald-600" : "text-slate-300"}`} />
                    <span>1 lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${hasNumber ? "text-emerald-600" : "text-slate-300"}`} />
                    <span>1 number (0-9)</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-10 bg-[#0c2340] hover:bg-[#174A7E] text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating password..." : "Update Password"}
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
            <span>Encrypted update with automatic session invalidation.</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center text-xs text-slate-500">Loading password reset...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
