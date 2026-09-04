"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Lock,
  Mail,
  User,
  Building2,
  Briefcase,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Users,
} from "lucide-react";

function SignupFormContent() {
  const router = useRouter();

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState<"TRAINEE" | "TRAINER">("TRAINEE");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ isTrainerPending?: boolean } | null>(null);

  // Password requirement checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password || !organization.trim()) {
      setError("Please fill in all required institutional fields.");
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

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          organization: organization.trim(),
          designation: designation.trim() || undefined,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please check your information.");
        setIsLoading(false);
        return;
      }

      if (data.pendingApproval) {
        setSuccessInfo({ isTrainerPending: true });
        setIsLoading(false);
      } else {
        // Trainee: session created and redirect to trainee dashboard
        router.push(data.redirectUrl || "/trainee/dashboard");
      }
    } catch (err) {
      console.error("Signup request failed:", err);
      setError("Network connection issue. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Institutional Branding */}
        <div className="lg:col-span-5 space-y-6 lg:pr-4">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0c2340] text-white shadow-sm transition-transform group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-6 w-6">
                <path d="M 50 18 L 78 34 L 78 66 L 50 82 L 22 66 L 22 34 Z" fill="none" stroke="#0f766e" strokeWidth="6"/>
                <circle cx="50" cy="50" r="10" fill="#ffffff"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#0c2340] block">CAPACITY CONNECT</span>
              <span className="text-[11px] text-slate-500 font-medium block">Institutional Capacity Building</span>
            </div>
          </Link>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight leading-tight">
              Start your learning journey.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Create an official institutional account to access accredited meteorological training modules, timed evaluations, and automated skill-gap analysis.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Users className="h-4 w-4 text-[#087F8C]" />
              <span>Available Registration Roles</span>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5">
              <p>• <strong>Trainee:</strong> Immediate access to courses, examinations, and competency profiling.</p>
              <p>• <strong>Trainer:</strong> Course authoring, question generation, and cohort management (subject to verification).</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Clean Signup Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-5">
            
            {successInfo?.isTrainerPending ? (
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-[#087F8C] border border-teal-200">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900">Trainer Registration Received</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your institutional trainer account has been created and submitted for administrative authorization. You will be able to access the Trainer Console upon review.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/login">
                    <Button variant="primary" className="bg-[#0c2340] hover:bg-[#174A7E] text-white">
                      Return to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-[#172033] tracking-tight">Create your account</h2>
                  <p className="text-xs text-slate-500">
                    Join CAPACITY CONNECT and manage your learning journey.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-900">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  
                  {/* Role Selector: Trainee vs Trainer */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      I am joining as:
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setRole("TRAINEE")}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          role === "TRAINEE"
                            ? "bg-[#0c2340] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                        }`}
                      >
                        <User className="h-3.5 w-3.5" />
                        <span>Trainee</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole("TRAINER")}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          role === "TRAINER"
                            ? "bg-[#087F8C] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                        }`}
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>Trainer</span>
                      </button>
                    </div>
                  </div>

                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ananya Verma"
                          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#174A7E] focus:border-[#174A7E] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
                        Email Address <span className="text-red-500">*</span>
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
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@organization.gov.in"
                          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#174A7E] focus:border-[#174A7E] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Organization & Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="organization" className="block text-xs font-semibold text-slate-700">
                        Organization <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <input
                          id="organization"
                          name="organization"
                          type="text"
                          autoComplete="organization"
                          required
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="e.g. NIAMS Delhi / IMD"
                          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#174A7E] focus:border-[#174A7E] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="designation" className="block text-xs font-semibold text-slate-700">
                        Designation
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <input
                          id="designation"
                          name="designation"
                          type="text"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="e.g. Operational Forecaster"
                          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#174A7E] focus:border-[#174A7E] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                        Password <span className="text-red-500">*</span>
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

                    <div className="space-y-1.5">
                      <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700">
                        Confirm Password <span className="text-red-500">*</span>
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
                  </div>

                  {/* Compact Password Requirements Checklist */}
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

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full h-10 bg-[#0c2340] hover:bg-[#174A7E] text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </div>
                </form>

                <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#087F8C] font-bold hover:underline">
                    Sign in →
                  </Link>
                </div>

                {/* Single Trust Line */}
                <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Your account is protected with secure authentication and role-based access.</span>
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center text-xs text-slate-500">Loading registration...</div>}>
      <SignupFormContent />
    </Suspense>
  );
}
