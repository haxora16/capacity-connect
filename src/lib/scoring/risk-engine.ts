import { RiskLevel } from "@/types";

export interface TraineeRiskFactors {
  averageScore: number;
  completionRate: number;
  missedAssessments: number;
  inactiveDays: number;
}

export function evaluateTraineeRisk(factors: TraineeRiskFactors): {
  riskLevel: RiskLevel;
  primaryReason: string;
  recommendedAction: string;
} {
  const { averageScore, completionRate, missedAssessments, inactiveDays } = factors;

  // HIGH RISK: score < 50 OR missed >= 2 OR inactive > 14 days
  if (averageScore < 50 || missedAssessments >= 2 || inactiveDays > 14) {
    const reasons: string[] = [];
    if (averageScore < 50) reasons.push(`Low average score (${averageScore.toFixed(1)}% < 50% threshold)`);
    if (missedAssessments >= 2) reasons.push(`${missedAssessments} missed assessment deadlines`);
    if (inactiveDays > 14) reasons.push(`Inactive for ${inactiveDays} consecutive days (>14 days threshold)`);

    return {
      riskLevel: "HIGH",
      primaryReason: reasons.join(", ") + ".",
      recommendedAction: "Immediate trainer intervention required. Assign dedicated 1-on-1 remediation session and extend assessment window.",
    };
  }

  // MEDIUM RISK: score 50-65 OR inactive 7-14 days OR completion < 50%
  if ((averageScore >= 50 && averageScore <= 65) || (inactiveDays >= 7 && inactiveDays <= 14) || completionRate < 40) {
    const reasons: string[] = [];
    if (averageScore >= 50 && averageScore <= 65) reasons.push(`Score in intermediate risk band (${averageScore.toFixed(1)}%)`);
    if (inactiveDays >= 7) reasons.push(`Platform inactivity of ${inactiveDays} days`);
    if (completionRate < 40) reasons.push(`Course completion rate below pace (${completionRate.toFixed(0)}%)`);

    return {
      riskLevel: "MEDIUM",
      primaryReason: (reasons.length > 0 ? reasons.join(", ") : "Moderate performance indicators") + ".",
      recommendedAction: "Send automated learning prompts and recommend supplementary video explanations for difficult modules.",
    };
  }

  // LOW RISK: score > 65 and active
  return {
    riskLevel: "LOW",
    primaryReason: `Satisfactory score (${averageScore.toFixed(1)}%), active within ${inactiveDays} days, ${completionRate.toFixed(0)}% completion.`,
    recommendedAction: "No intervention needed. Progressing on track for institutional certification.",
  };
}
