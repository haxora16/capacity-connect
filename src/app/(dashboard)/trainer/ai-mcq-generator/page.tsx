"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit2,
  RefreshCw,
  Send,
  BookOpen,
  Sliders,
  Check,
  ArrowRight,
  ArrowLeft,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { GeneratedMCQ, DifficultyLevel } from "@/types";

export default function AiMcqGeneratorPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [courses, setCourses] = useState<any[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [subject, setSubject] = useState("Radar Meteorology");
  const [topic, setTopic] = useState("Dual-Polarization Hydrometeor Classification & Z_DR Analysis");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("ADVANCED");
  const [questionCount, setQuestionCount] = useState(4);
  const [referenceExcerpt, setReferenceExcerpt] = useState("");

  // Generation & Review State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedMCQ[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editBuffer, setEditBuffer] = useState<GeneratedMCQ | null>(null);

  // Publish State
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [passingScore, setPassingScore] = useState(65);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses);
          setSelectedCourseId(data.courses[0].id);
          setSelectedCourseTitle(data.courses[0].title);
          setSubject(data.courses[0].subject);
          setAssessmentTitle(`Diagnostic Exam: ${data.courses[0].subject} Mastery`);
        }
      });
  }, []);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    const found = courses.find((c) => c.id === courseId);
    if (found) {
      setSelectedCourseTitle(found.title);
      setSubject(found.subject);
      setAssessmentTitle(`Diagnostic Exam: ${found.subject} Advanced Evaluation`);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep(3); // Progress indicator
    try {
      const res = await fetch("/api/ai/mcq-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseId,
          courseTitle: selectedCourseTitle,
          subject,
          topic,
          count: questionCount,
          difficulty,
          contentExcerpt: referenceExcerpt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedQuestions(data.questions || []);
        setStep(4); // Review step
      }
    } catch (err) {
      console.error("MCQ generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    setGeneratedQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditBuffer({ ...generatedQuestions[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editBuffer) {
      const updated = [...generatedQuestions];
      updated[editingIndex] = editBuffer;
      setGeneratedQuestions(updated);
      setEditingIndex(null);
      setEditBuffer(null);
    }
  };

  const handlePublish = async () => {
    if (generatedQuestions.length === 0 || isPublishing) return;
    setIsPublishing(true);

    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseId,
          title: assessmentTitle,
          subject,
          difficulty,
          durationMinutes,
          passingScore,
          questions: generatedQuestions,
        }),
      });

      if (res.ok) {
        setPublishedSuccess(true);
        setStep(5);
      }
    } catch (err) {
      console.error("Failed to publish assessment:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[6px] bg-[#0c2340] text-white">
              <Sparkles className="h-5 w-5 text-teal-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
              AI Question & Assessment Generator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            5-Step automated examination pipeline powered by Gemini API & National Meteorological Standards
          </p>
        </div>

        <Badge variant="secondary">WMO DOC 258 COMPLIANT</Badge>
      </div>

      {/* Step Progress Indicator */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
        {[
          { num: 1, label: "1. Select Course" },
          { num: 2, label: "2. Parameters" },
          { num: 3, label: "3. Generation" },
          { num: 4, label: "4. Review & Edit" },
          { num: 5, label: "5. Publish" },
        ].map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div
              key={s.num}
              className={`p-2 rounded-[6px] border transition-colors ${
                isActive
                  ? "bg-[#0c2340] text-white border-[#0c2340] shadow-xs"
                  : isDone
                  ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                  : "bg-white text-slate-400 border-slate-200"
              }`}
            >
              <div className="text-[11px] truncate">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: SELECT COURSE & TOPIC */}
      {/* ------------------------------------------------------------- */}
      {step === 1 && (
        <Card>
          <CardHeader className="bg-slate-50/50 pb-3">
            <CardTitle className="text-sm font-bold">Step 1: Select Target Course & Curriculum Context</CardTitle>
            <p className="text-xs text-slate-500">Choose the active course module to anchor the questions</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select Accredited Course:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courses.map((c) => {
                  const isSelected = selectedCourseId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCourseSelect(c.id)}
                      className={`text-left p-3.5 rounded-[6px] border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 border-[#0c2340] ring-1 ring-[#0c2340]"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                          {c.code}
                        </span>
                        <Badge variant="outline" size="sm">{c.difficulty}</Badge>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1">{c.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Subject: {c.subject}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setStep(2)}>
                Continue to Parameters
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: CONFIGURE MCQ PARAMETERS */}
      {/* ------------------------------------------------------------- */}
      {step === 2 && (
        <Card>
          <CardHeader className="bg-slate-50/50 pb-3">
            <CardTitle className="text-sm font-bold">Step 2: Configure Generation Parameters</CardTitle>
            <p className="text-xs text-slate-500">Refine Bloom taxonomy difficulty and specific operational topics</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                id="topic-param"
                label="Specific Technical Focus / Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                hint="e.g. Dual-Pol Z_DR signatures, Dvorak Eye Pattern"
                className="sm:col-span-2"
              />

              <Select
                id="diff-param"
                label="Taxonomy Difficulty Level"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                options={[
                  { value: "BEGINNER", label: "Beginner (Fundamental Recall)" },
                  { value: "INTERMEDIATE", label: "Intermediate (Diagnostic Interpretation)" },
                  { value: "ADVANCED", label: "Advanced (Operational Synthesis & Warnings)" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="count-param"
                label="Number of Questions to Generate"
                value={questionCount.toString()}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                options={[
                  { value: "3", label: "3 Diagnostic Questions" },
                  { value: "4", label: "4 Standard Questions" },
                  { value: "6", label: "6 In-Depth Examination Questions" },
                ]}
              />

              <Input
                id="subj-param"
                label="Curriculum Domain"
                value={subject}
                disabled
              />
            </div>

            <Textarea
              id="excerpt-param"
              label="Optional Reference Excerpt or SOP Section"
              placeholder="Paste specific paragraphs from WMO guidelines or radar manuals to ground the generated questions directly on specific source material..."
              value={referenceExcerpt}
              onChange={(e) => setReferenceExcerpt(e.target.value)}
              rows={3}
            />

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
              <Button size="sm" variant="secondary" onClick={handleGenerate}>
                <Sparkles className="h-3.5 w-3.5" />
                Generate Questions via Gemini AI
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: GENERATION IN PROGRESS */}
      {/* ------------------------------------------------------------- */}
      {step === 3 && (
        <Card className="text-center p-12 space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-teal-50 border border-teal-200">
              <RefreshCw className="h-8 w-8 text-teal-700 animate-spin" />
            </div>
          </div>
          <CardTitle className="text-base font-bold text-slate-900">
            Consulting Gemini AI & Meteorological Knowledge Base...
          </CardTitle>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Formulating {questionCount} technically validated multiple-choice questions with scientific explanations and bloom-taxonomy difficulty tagging for <strong>{subject}</strong>.
          </p>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 4: REVIEW, EDIT & APPROVE */}
      {/* ------------------------------------------------------------- */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-[8px] border border-slate-200 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                Step 4: Instructor Review & Approval
              </span>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                Review Generated Questions ({generatedQuestions.length} Questions)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleGenerate}>
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate Set
              </Button>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {generatedQuestions.map((q, idx) => (
              <Card key={idx} className="border-slate-300 shadow-2xs">
                <CardHeader className="bg-slate-50/50 pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0c2340]">Question {idx + 1}</span>
                    <Badge variant="outline">{q.difficulty}</Badge>
                    <span className="text-[11px] text-slate-500">Topic: {q.topic}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(idx)}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                      title="Edit question text and options"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-3 text-xs">
                  {editingIndex === idx && editBuffer ? (
                    <div className="space-y-3 p-3 rounded-[6px] bg-slate-50 border border-slate-200">
                      <Textarea
                        label="Question Text"
                        value={editBuffer.questionText}
                        onChange={(e) => setEditBuffer({ ...editBuffer, questionText: e.target.value })}
                        rows={2}
                      />

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-slate-700">Options (Select Correct)</label>
                        {editBuffer.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${idx}`}
                              checked={editBuffer.correctOption === oi}
                              onChange={() => setEditBuffer({ ...editBuffer, correctOption: oi })}
                            />
                            <Input
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...editBuffer.options];
                                newOpts[oi] = e.target.value;
                                setEditBuffer({ ...editBuffer, options: newOpts });
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <Textarea
                        label="Scientific Explanation"
                        value={editBuffer.explanation}
                        onChange={(e) => setEditBuffer({ ...editBuffer, explanation: e.target.value })}
                        rows={2}
                      />

                      <div className="flex justify-end gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" variant="primary" onClick={handleSaveEdit}>
                          Save Edits
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-bold text-slate-900 leading-snug">{q.questionText}</p>

                      <div className="space-y-1 pl-2">
                        {q.options.map((opt, oi) => (
                          <div
                            key={oi}
                            className={`p-2 rounded text-xs flex items-center justify-between ${
                              q.correctOption === oi
                                ? "bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold"
                                : "text-slate-700 bg-slate-50/50"
                            }`}
                          >
                            <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                            {q.correctOption === oi && (
                              <span className="text-[10px] font-bold text-emerald-700">Correct Option</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                          <strong className="text-slate-900 block font-semibold mb-0.5">Scientific Rationale:</strong>
                          {q.explanation}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Publishing Settings Card */}
          <Card className="bg-slate-50/70 border-slate-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Step 5: Finalize & Publish Assessment to Trainee Cohorts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  id="ass-title"
                  label="Assessment Title"
                  value={assessmentTitle}
                  onChange={(e) => setAssessmentTitle(e.target.value)}
                  className="sm:col-span-1"
                />

                <Input
                  id="ass-dur"
                  type="number"
                  label="Time Limit (Minutes)"
                  value={durationMinutes.toString()}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                />

                <Input
                  id="ass-pass"
                  type="number"
                  label="Passing Threshold (%)"
                  value={passingScore.toString()}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <Button size="sm" variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Adjust Parameters
                </Button>

                <Button
                  size="md"
                  variant="primary"
                  onClick={handlePublish}
                  isLoading={isPublishing}
                  disabled={generatedQuestions.length === 0}
                >
                  <Send className="h-4 w-4" />
                  Publish Assessment Live
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 5: SUCCESSFUL PUBLICATION */}
      {/* ------------------------------------------------------------- */}
      {step === 5 && (
        <Card className="text-center p-10 space-y-4 border-emerald-300 bg-emerald-50/40">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <CardTitle className="text-lg font-bold text-slate-900">
            Assessment Officially Published!
          </CardTitle>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            The diagnostic examination <strong>{assessmentTitle}</strong> is now live and available to all enrolled trainees in <strong>{subject}</strong>.
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <Button size="sm" variant="outline" onClick={() => setStep(1)}>
              Create Another Assessment
            </Button>
            <Link href="/trainee/assessments">
              <Button size="sm" variant="primary">
                Test As Trainee →
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
