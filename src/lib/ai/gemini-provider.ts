import { AIService } from "./ai-service";
import { MockProvider } from "./mock-provider";
import { GeneratedMCQ, DifficultyLevel } from "@/types";
import { GoogleGenAI } from "@google/genai";

export class GeminiProvider implements AIService {
  private apiKey: string;
  private mockFallback: MockProvider;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.mockFallback = new MockProvider();
  }

  async generateMCQs(params: {
    subject: string;
    courseTitle: string;
    topic: string;
    count: number;
    difficulty: DifficultyLevel;
    contentExcerpt?: string;
  }): Promise<GeneratedMCQ[]> {
    if (!this.apiKey) {
      console.info("[GeminiProvider] No API key detected. Using institutional mock provider.");
      return this.mockFallback.generateMCQs(params);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const prompt = `You are a senior institutional curriculum designer and chief examiner for an official national capacity building institute in Atmospheric Sciences and Meteorology.
Generate ${params.count} multiple-choice questions (MCQs) for the subject "${params.subject}", course "${params.courseTitle}", on the topic "${params.topic}".
Difficulty level: ${params.difficulty}.
${params.contentExcerpt ? `Reference material excerpt:\n${params.contentExcerpt}` : ""}

Return ONLY a valid JSON array of objects with the exact structure:
[
  {
    "questionText": "Clear, technically rigorous question text with domain-specific terminology",
    "options": ["Option A (Correct)", "Option B", "Option C", "Option D"],
    "correctOption": 0,
    "explanation": "Detailed scientific explanation justifying the correct answer and addressing common misconceptions",
    "topic": "${params.topic}",
    "difficulty": "${params.difficulty}"
  }
]
Do not include markdown code block formatting (e.g. no triple backticks), just the raw JSON array.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned) as GeneratedMCQ[];
      
      return parsed.map((item, idx) => ({
        ...item,
        id: `mcq-gemini-${Date.now()}-${idx}`,
        approved: true,
      }));
    } catch (err) {
      console.warn("[GeminiProvider] Gemini API error, falling back to mock provider:", err);
      return this.mockFallback.generateMCQs(params);
    }
  }

  async answerLearningQuestion(params: {
    question: string;
    courseContext?: string;
    history?: { sender: "USER" | "ASSISTANT"; content: string }[];
  }): Promise<{
    answer: string;
    sources: string[];
    recommendedTopics: string[];
  }> {
    if (!this.apiKey) {
      return this.mockFallback.answerLearningQuestion(params);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const prompt = `You are Capacity AI, an authoritative, calm, and highly knowledgeable learning assistant embedded in the national capacity building and training platform.
Domain: Operational Meteorology, Weather Forecasting, Radar & Satellite Remote Sensing, Numerical Weather Prediction.
Current Course Context: ${params.courseContext || "General Atmospheric Sciences"}

User Question: ${params.question}

Respond in structured JSON format with:
{
  "answer": "A clear, technically precise, structured explanation (2-4 paragraphs). Tone should be professional and educational.",
  "sources": ["List 2 official documents or course modules as references"],
  "recommendedTopics": ["List 3 related technical topics to explore"]
}
Do not include markdown formatting or backticks. Return valid JSON only.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn("[GeminiProvider] Gemini API error in chat, falling back:", err);
      return this.mockFallback.answerLearningQuestion(params);
    }
  }

  async generateCompetencyInsights(params: {
    traineeName: string;
    competencies: { subjectArea: string; currentScore: number; targetScore: number }[];
    recentScores: number[];
  }): Promise<{
    summary: string;
    strengths: string[];
    priorityGaps: string[];
    actionPlan: string[];
  }> {
    if (!this.apiKey) {
      return this.mockFallback.generateCompetencyInsights(params);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const prompt = `You are an institutional competency analytics engine for a national training platform.
Analyze the following trainee profile:
Trainee: ${params.traineeName}
Competencies: ${JSON.stringify(params.competencies)}
Recent Assessment Scores: ${JSON.stringify(params.recentScores)}

Provide an explainable competency diagnostic in JSON format:
{
  "summary": "1-2 sentence executive summary of overall operational readiness",
  "strengths": ["Key strength 1", "Key strength 2"],
  "priorityGaps": ["Priority gap 1", "Priority gap 2"],
  "actionPlan": ["Specific recommended course or remediation action 1", "Action 2", "Action 3"]
}
Return valid JSON only.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn("[GeminiProvider] Gemini API error in insights, falling back:", err);
      return this.mockFallback.generateCompetencyInsights(params);
    }
  }
}

export function getAIService(): AIService {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    return new GeminiProvider(apiKey);
  }
  return new MockProvider();
}
