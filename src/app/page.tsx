"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Search,
  BookOpen,
  CheckSquare,
  TrendingUp,
  Award,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  Users,
  Compass,
  FileText,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FeaturedCourse {
  id: string;
  code: string;
  title: string;
  subject: string;
  trainerName: string;
  durationHours: number;
  difficulty: string;
  description: string;
}

const DEFAULT_COURSES: FeaturedCourse[] = [
  {
    id: "course-1",
    code: "MET-RAD-401",
    title: "Doppler Weather Radar: Operational Principles & Severe Weather Nowcasting",
    subject: "Radar Meteorology",
    trainerName: "Dr. Rajesh Sharma",
    durationHours: 32,
    difficulty: "INTERMEDIATE",
    description: "Operational analysis of reflectivity, velocity, and spectrum width for mesocyclone and convective storm tracking.",
  },
  {
    id: "course-2",
    code: "MET-SAT-302",
    title: "Satellite Meteorology & Advanced Geospatial Remote Sensing",
    subject: "Satellite Meteorology",
    trainerName: "Dr. Rajesh Sharma",
    durationHours: 28,
    difficulty: "INTERMEDIATE",
    description: "Multi-spectral INSAT-3D/3DR imagery interpretation, cloud motion vectors, and severe storm genesis identification.",
  },
  {
    id: "course-3",
    code: "MET-NWP-501",
    title: "Numerical Weather Prediction & High-Resolution Ensemble Modeling",
    subject: "Numerical Weather Prediction",
    trainerName: "Dr. Sunita Sen",
    durationHours: 40,
    difficulty: "ADVANCED",
    description: "Data assimilation techniques, WRF/GFS model configuration, and ensemble forecast post-processing for forecasters.",
  },
  {
    id: "course-4",
    code: "MET-SYN-201",
    title: "Synoptic Meteorology & Tropical Cyclone Track Diagnostics",
    subject: "Weather Forecasting",
    trainerName: "Dr. Amitav Ghosh",
    durationHours: 24,
    difficulty: "BEGINNER",
    description: "Synoptic chart analysis, vorticity dynamics, upper-air sounding interpretation, and cyclone landfall prediction.",
  },
];

const CATEGORIES = [
  "All",
  "Meteorology",
  "Weather Forecasting",
  "Climate Science",
  "Radar Meteorology",
  "Satellite Meteorology",
  "Numerical Weather Prediction",
  "Data & Analysis",
];

export default function HomePage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<FeaturedCourse[]>(DEFAULT_COURSES);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          if (data.courses && data.courses.length > 0) {
            setCourses(
              data.courses.map((c: any) => ({
                id: c.id,
                code: c.code,
                title: c.title,
                subject: c.subject,
                trainerName: c.trainerName || "Dr. Rajesh Sharma",
                durationHours: c.durationHours || 24,
                difficulty: c.difficulty || "INTERMEDIATE",
                description: c.description,
              }))
            );
          }
        }
      } catch {
        // Fallback to default courses
      }
    }
    loadCourses();
  }, []);

  const getDashboardHref = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "TRAINER") return "/trainer/dashboard";
    return "/trainee/dashboard";
  };

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" ||
      course.subject.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === "Meteorology" && course.subject.includes("Meteorology"));

    const matchesSearch =
      searchQuery.trim() === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.trainerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-[#172033] flex flex-col font-sans selection:bg-[#174A7E] selection:text-white">
      {/* ================================================== */}
      {/* 1. INSTITUTIONAL HEADER */}
      {/* ================================================== */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-[#174A7E] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              CC
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg text-[#174A7E] tracking-tight leading-none">
                CAPACITY CONNECT
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-normal mt-0.5">
                Digital Capacity Building &amp; Learning Management Platform
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <Link href="/" className="text-[#174A7E] hover:text-[#0f3460] transition-colors">
              Home
            </Link>
            <a href="#courses" className="hover:text-[#174A7E] transition-colors">
              Courses
            </a>
            <a href="#benefits" className="hover:text-[#174A7E] transition-colors">
              Learning Resources
            </a>
            <a href="#benefits" className="hover:text-[#174A7E] transition-colors">
              Assessments
            </a>
            <a href="#benefits" className="hover:text-[#174A7E] transition-colors">
              Certificates
            </a>
            <a href="#about" className="hover:text-[#174A7E] transition-colors">
              About
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link href={getDashboardHref()}>
                <Button size="sm" variant="primary" className="text-xs">
                  Go to {user.role} Portal →
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" variant="outline" className="text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" variant="primary" className="text-xs">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-slate-600 hover:text-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-semibold text-[#174A7E]"
            >
              Home
            </Link>
            <a
              href="#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-medium text-slate-700"
            >
              Courses
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-medium text-slate-700"
            >
              Learning Resources
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-medium text-slate-700"
            >
              Assessments
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-medium text-slate-700"
            >
              Certificates
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-medium text-slate-700"
            >
              About
            </a>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              {user ? (
                <Link href={getDashboardHref()} className="w-full">
                  <Button size="sm" variant="primary" className="w-full text-xs">
                    Go to Portal
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button size="sm" variant="primary" className="w-full text-xs">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ================================================== */}
      {/* 2. HERO + WHAT IS CAPACITY CONNECT (2-COLUMN) */}
      {/* ================================================== */}
      <section className="bg-[#F8FAFC] border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Hero Text & Actions */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-block px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-[11px] font-bold text-[#174A7E] uppercase tracking-wider">
                DIGITAL CAPACITY BUILDING
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#174A7E] tracking-tight leading-tight">
                Digital Capacity Building &amp;
                <br className="hidden sm:inline" /> Learning Management Platform
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                CAPACITY CONNECT brings training, learning resources, assessments,
                competency development and certification together in one platform.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a href="#courses">
                  <Button size="md" variant="primary" className="text-xs sm:text-sm font-semibold">
                    Explore Courses
                  </Button>
                </a>
                <Link href={user ? getDashboardHref() : "/login"}>
                  <Button size="md" variant="outline" className="text-xs sm:text-sm font-semibold">
                    {user ? "Go to Portal" : "Sign In"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: WHAT CAN YOU DO WITH CAPACITY CONNECT? (2x2) */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xs sm:text-sm font-bold text-[#174A7E] uppercase tracking-wider">
                    WHAT CAN YOU DO WITH CAPACITY CONNECT?
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Join Course */}
                  <div className="p-4 rounded-md bg-[#F8FAFC] border border-slate-200 space-y-1.5 hover:border-slate-300 transition-colors">
                    <div className="text-xl">📚</div>
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      JOIN A COURSE
                    </div>
                    <p className="text-xs text-slate-600 leading-normal">
                      Access structured learning
                    </p>
                  </div>

                  {/* Card 2: Take Assessment */}
                  <div className="p-4 rounded-md bg-[#F8FAFC] border border-slate-200 space-y-1.5 hover:border-slate-300 transition-colors">
                    <div className="text-xl">📝</div>
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      TAKE AN ASSESSMENT
                    </div>
                    <p className="text-xs text-slate-600 leading-normal">
                      Test your knowledge
                    </p>
                  </div>

                  {/* Card 3: Track Progress */}
                  <div className="p-4 rounded-md bg-[#F8FAFC] border border-slate-200 space-y-1.5 hover:border-slate-300 transition-colors">
                    <div className="text-xl">📈</div>
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      TRACK YOUR PROGRESS
                    </div>
                    <p className="text-xs text-slate-600 leading-normal">
                      See your learning and competency
                    </p>
                  </div>

                  {/* Card 4: Get Certified */}
                  <div className="p-4 rounded-md bg-[#F8FAFC] border border-slate-200 space-y-1.5 hover:border-slate-300 transition-colors">
                    <div className="text-xl">🏆</div>
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      GET CERTIFIED
                    </div>
                    <p className="text-xs text-slate-600 leading-normal">
                      Earn certificates after completion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 3. EXPLORE LEARNING (SWAYAM STYLE COURSE DISCOVERY) */}
      {/* ================================================== */}
      <section id="courses" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#174A7E]">
              Explore Learning
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Find courses and learning resources to build your professional skills.
            </p>
          </div>

          {/* Large Search Bar */}
          <div className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, subjects or skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#174A7E] focus:border-transparent transition-all shadow-2xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-[#174A7E] text-white border-[#174A7E] font-semibold"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Course Cards Grid */}
          {filteredCourses.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
              No courses found matching your search. Try adjusting your query or category filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredCourses.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-shadow"
                >
                  <div className="p-5 space-y-3">
                    {/* Course Code & Subject Header */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#087F8C] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {course.code}
                      </span>
                      <span className="font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        {course.difficulty}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {course.title}
                    </h3>

                    {/* Trainer & Metadata */}
                    <div className="space-y-1 pt-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{course.trainerName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{course.durationHours} Hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                    <Link
                      href={user ? `/trainee/courses/${course.id}` : "/login"}
                      className="block w-full pt-3"
                    >
                      <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
                        View Course
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================== */}
      {/* 4. FOUR CORE BENEFITS */}
      {/* ================================================== */}
      <section id="benefits" className="py-14 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#174A7E]">
              Everything You Need to Learn &amp; Grow
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Integrated capabilities designed for comprehensive professional development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Benefit 1: LEARN */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-2.5">
              <div className="h-9 w-9 rounded-md bg-blue-50 text-[#174A7E] flex items-center justify-center font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">LEARN</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Courses, videos, PDFs and study materials.
              </p>
            </div>

            {/* Benefit 2: ASSESS */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-2.5">
              <div className="h-9 w-9 rounded-md bg-teal-50 text-[#087F8C] flex items-center justify-center font-bold">
                <CheckSquare className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">ASSESS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quizzes, assignments and performance tracking.
              </p>
            </div>

            {/* Benefit 3: DEVELOP */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-2.5">
              <div className="h-9 w-9 rounded-md bg-amber-50 text-[#D89A2E] flex items-center justify-center font-bold">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">DEVELOP</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Competency tracking and targeted learning.
              </p>
            </div>

            {/* Benefit 4: CERTIFY */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-2.5">
              <div className="h-9 w-9 rounded-md bg-emerald-50 text-[#159A6A] flex items-center justify-center font-bold">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">CERTIFY</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Professional digital certificates after completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 5. SMART LEARNING SUPPORT */}
      {/* ================================================== */}
      <section id="about" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#174A7E]">
              Smart Learning Support
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Simple technology that helps trainees and trainers learn, assess and improve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Support 1: LEARNING ASSISTANT */}
            <div className="p-6 rounded-lg bg-[#F8FAFC] border border-slate-200 space-y-2.5">
              <div className="h-8 w-8 rounded-md bg-blue-100 text-[#174A7E] flex items-center justify-center">
                <GraduationCap className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                LEARNING ASSISTANT
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get help understanding course concepts and learning resources.
              </p>
            </div>

            {/* Support 2: SMART ASSESSMENT */}
            <div className="p-6 rounded-lg bg-[#F8FAFC] border border-slate-200 space-y-2.5">
              <div className="h-8 w-8 rounded-md bg-teal-100 text-[#087F8C] flex items-center justify-center">
                <CheckSquare className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                SMART ASSESSMENT
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate assessment questions from trainer-provided learning content.
              </p>
            </div>

            {/* Support 3: TRAINER MATCHING */}
            <div className="p-6 rounded-lg bg-[#F8FAFC] border border-slate-200 space-y-2.5">
              <div className="h-8 w-8 rounded-md bg-slate-200 text-slate-800 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                TRAINER MATCHING
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find suitable trainers based on skills, qualifications and experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 6. SIMPLE INSTITUTIONAL FOOTER */}
      {/* ================================================== */}
      <footer className="mt-auto bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            {/* Footer Brand */}
            <div className="space-y-1">
              <div className="font-bold text-sm text-[#174A7E] tracking-tight">
                CAPACITY CONNECT
              </div>
              <div className="text-xs text-slate-500">
                Digital Capacity Building &amp; Learning Management Platform
              </div>
            </div>

            {/* Footer Navigation Links */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-600">
              <Link href="/" className="hover:text-[#174A7E] transition-colors">
                Home
              </Link>
              <a href="#courses" className="hover:text-[#174A7E] transition-colors">
                Courses
              </a>
              <a href="#benefits" className="hover:text-[#174A7E] transition-colors">
                Resources
              </a>
              <a href="#benefits" className="hover:text-[#174A7E] transition-colors">
                Assessments
              </a>
              <a href="#benefits" className="hover:text-[#174A7E] transition-colors">
                Certificates
              </a>
              <a href="#about" className="hover:text-[#174A7E] transition-colors">
                About
              </a>
              <a href="mailto:support@capacityconnect.gov.in" className="hover:text-[#174A7E] transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Copyright & Legal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-700 cursor-pointer">Terms of Use</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} Capacity Connect
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
