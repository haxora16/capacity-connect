export interface CompetencyInput {
  skillsCount: number;
  experienceYears: number;
  completedCoursesCount: number;
  averageAssessmentScore: number;
  subjectAttemptsCount: number;
  subjectScore: number;
}

export function calculateCompetencyScore(input: CompetencyInput): {
  score: number;
  breakdown: {
    assessmentWeight: number; // 40%
    courseCompletionWeight: number; // 25%
    practicalExperienceWeight: number; // 20%
    skillsProfileWeight: number; // 15%
  };
} {
  // 1. Assessment mastery (40%)
  const assessmentComponent = Math.min(100, Math.max(0, input.subjectScore || input.averageAssessmentScore)) * 0.40;

  // 2. Course completion (25%)
  const completionRatio = Math.min(1.0, input.completedCoursesCount / 3);
  const completionComponent = (completionRatio * 100) * 0.25;

  // 3. Experience (20%) - capped at 5 years for max baseline
  const expRatio = Math.min(1.0, input.experienceYears / 5);
  const expComponent = (expRatio * 100) * 0.20;

  // 4. Skills depth (15%) - capped at 4 validated skills
  const skillsRatio = Math.min(1.0, input.skillsCount / 4);
  const skillsComponent = (skillsRatio * 100) * 0.15;

  const totalScore = Math.round((assessmentComponent + completionComponent + expComponent + skillsComponent) * 10) / 10;

  return {
    score: totalScore,
    breakdown: {
      assessmentWeight: Math.round(assessmentComponent * 10) / 10,
      courseCompletionWeight: Math.round(completionComponent * 10) / 10,
      practicalExperienceWeight: Math.round(expComponent * 10) / 10,
      skillsProfileWeight: Math.round(skillsComponent * 10) / 10,
    },
  };
}
