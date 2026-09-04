import { GeneratedMCQ, DifficultyLevel } from "@/types";

export interface AIService {
  generateMCQs(params: {
    subject: string;
    courseTitle: string;
    topic: string;
    count: number;
    difficulty: DifficultyLevel;
    contentExcerpt?: string;
  }): Promise<GeneratedMCQ[]>;

  answerLearningQuestion(params: {
    question: string;
    courseContext?: string;
    history?: { sender: "USER" | "ASSISTANT"; content: string }[];
  }): Promise<{
    answer: string;
    sources: string[];
    recommendedTopics: string[];
  }>;

  generateCompetencyInsights(params: {
    traineeName: string;
    competencies: { subjectArea: string; currentScore: number; targetScore: number }[];
    recentScores: number[];
  }): Promise<{
    summary: string;
    strengths: string[];
    priorityGaps: string[];
    actionPlan: string[];
  }>;
}
