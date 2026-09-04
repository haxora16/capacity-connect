export interface TrainerMatchInput {
  trainerSpecialization: string;
  qualifications: string[];
  experienceYears: number;
  rating: number; // 0-5
  targetSubject: string;
}

export function calculateTrainerMatch(input: TrainerMatchInput): {
  skillMatch: number;      // 0-100 (40% weight)
  qualScore: number;       // 0-100 (20% weight)
  expScore: number;        // 0-100 (20% weight)
  perfScore: number;       // 0-100 (20% weight)
  overallMatch: number;    // 0-100
  formula: string;
} {
  const targetLower = input.targetSubject.toLowerCase();
  const specLower = input.trainerSpecialization.toLowerCase();

  // 1. Skill Match (40%): keyword overlap and direct relevance
  let skillMatch = 70.0;
  const keywords = targetLower.split(" ");
  let matches = 0;
  for (const kw of keywords) {
    if (kw.length > 3 && specLower.includes(kw)) {
      matches++;
    }
  }
  if (specLower.includes(targetLower)) {
    skillMatch = 96.0;
  } else if (matches > 0) {
    skillMatch = Math.min(92.0, 75.0 + matches * 8.0);
  }

  // 2. Qualification Score (20%)
  let qualScore = 80.0;
  const qualStr = input.qualifications.join(" ").toLowerCase();
  if (qualStr.includes("ph.d") || qualStr.includes("doctorate")) {
    qualScore = 95.0;
  } else if (qualStr.includes("m.tech") || qualStr.includes("m.sc")) {
    qualScore = 88.0;
  }

  // 3. Experience Score (20%): 15+ years = 95%, 10+ = 90%, 5+ = 80%
  let expScore = 75.0;
  if (input.experienceYears >= 15) {
    expScore = 95.0;
  } else if (input.experienceYears >= 10) {
    expScore = 90.0;
  } else if (input.experienceYears >= 5) {
    expScore = 82.0;
  }

  // 4. Performance / Rating Score (20%): (rating / 5.0) * 100
  const perfScore = Math.min(100, Math.max(50, (input.rating / 5.0) * 100));

  // Weighted formula: 40% + 20% + 20% + 20%
  const overall = (skillMatch * 0.40) + (qualScore * 0.20) + (expScore * 0.20) + (perfScore * 0.20);
  const roundedOverall = Math.round(overall * 10) / 10;

  return {
    skillMatch: Math.round(skillMatch * 10) / 10,
    qualScore: Math.round(qualScore * 10) / 10,
    expScore: Math.round(expScore * 10) / 10,
    perfScore: Math.round(perfScore * 10) / 10,
    overallMatch: roundedOverall,
    formula: "Score = (Skill Match × 40%) + (Qualification × 20%) + (Experience × 20%) + (Performance Rating × 20%)",
  };
}
