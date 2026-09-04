"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  FileText,
  Compass,
  CheckCircle2,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface ChatEntry {
  sender: "USER" | "ASSISTANT";
  content: string;
  sources?: string[];
  recommendedTopics?: string[];
  timestamp: string;
}

export default function CapacityAssistantPage() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      sender: "ASSISTANT",
      content:
        "Hello! I am the CAPACITY CONNECT Learning Assistant. I can help explain course topics, answer questions about learning materials, and help you prepare for upcoming assessments. How can I help you today?",
      sources: [
        "Atmospheric Sciences & Meteorological Curriculum",
        "Operational Standard Operating Guidelines",
      ],
      recommendedTopics: [
        "Numerical Weather Prediction principles",
        "Dual-Polarization Radar signatures",
        "Satellite Imagery interpretation",
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const handleSend = async (customQuery?: string) => {
    const q = customQuery || question;
    if (!q || q.trim().length === 0 || isSending) return;

    const userEntry: ChatEntry = {
      sender: "USER",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userEntry]);
    setQuestion("");
    setIsSending(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          courseContext: "Atmospheric Sciences & Operational Meteorology",
          userId: user?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantEntry: ChatEntry = {
          sender: "ASSISTANT",
          content: data.answer,
          sources: data.sources || [],
          recommendedTopics: data.recommendedTopics || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantEntry]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ASSISTANT",
            content: "I am currently unable to connect to the assistant service. Please review your course materials directly or try again shortly.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ASSISTANT",
          content: "Connection error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    "Explain the core principles of Numerical Weather Prediction simply.",
    "How does dual-polarization radar differentiate rain from hail?",
    "What are the key factors for tropical cyclone intensity estimation?",
    "Help me prepare for the Radar Meteorology assessment.",
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
            CAPACITY CONNECT Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask questions about course content, concepts, and assessment preparation
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-[#087F8C] border border-slate-200 text-slate-700 transition-colors text-left cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Card */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="space-y-4 min-h-[360px] max-h-[500px] overflow-y-auto pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${
                  m.sender === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "ASSISTANT" && (
                  <div className="h-8 w-8 rounded-full bg-[#0c2340] text-white flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-teal-400" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-lg p-3.5 space-y-2 ${
                    m.sender === "USER"
                      ? "bg-[#0c2340] text-white"
                      : "bg-slate-50 border border-slate-200 text-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>

                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-0.5">
                      <span className="font-semibold text-slate-700 block">References:</span>
                      {m.sources.map((s, sIdx) => (
                        <div key={sIdx}>• {s}</div>
                      ))}
                    </div>
                  )}

                  <div className={`text-[9px] ${m.sender === "USER" ? "text-slate-300" : "text-slate-400"} text-right`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3 text-xs items-center text-slate-500">
                <div className="h-8 w-8 rounded-full bg-[#0c2340] text-white flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-teal-400" />
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#087F8C]" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Input
              id="assistant-input"
              placeholder="Ask a question about your courses or topics..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isSending}
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={() => handleSend()}
              disabled={!question.trim() || isSending}
            >
              <Send className="h-3.5 w-3.5" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
