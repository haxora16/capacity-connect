export type UserRole = "TRAINEE" | "TRAINER" | "ADMIN";
export type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type ResourceKind = "PDF" | "PPT" | "VIDEO" | "TEXT";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  designation?: string | null;
  avatarUrl?: string | null;
  status: UserStatus;
}

export interface TraineeProfileData {
  id: string;
  userId: string;
  qualifications: string[];
  experienceYears: number;
  skills: string[];
  interests: string[];
  competencyScore: number;
}

export interface TrainerProfileData {
  id: string;
  userId: string;
  specialization: string;
  qualifications: string[];
  experienceYears: number;
  rating: number;
  matchScoreCache: number;
}

export interface CourseData {
  id: string;
  title: string;
  code: string;
  description: string;
  subject: string;
  category: string;
  difficulty: DifficultyLevel;
  durationHours: number;
  objectives: string[];
  trainerId: string;
  trainerName?: string;
  trainerOrg?: string;
  isPublished: boolean;
  createdAt: string;
  modulesCount?: number;
  enrolledCount?: number;
  userProgress?: number;
  isEnrolled?: boolean;
}

export interface CourseModuleData {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  durationMin: number;
  content?: string | null;
  resourceType: ResourceKind;
  resourceUrl?: string | null;
  isOfflineReady: boolean;
}

export interface ResourceData {
  id: string;
  trainerId: string;
  moduleId?: string | null;
  title: string;
  type: ResourceKind;
  subject: string;
  fileSizeKb: number;
  fileUrl: string;
  isPublic: boolean;
  createdAt: string;
}

export interface AssessmentData {
  id: string;
  courseId: string;
  courseTitle?: string;
  title: string;
  subject: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  passingScore: number;
  totalMarks: number;
  isAiGenerated: boolean;
  isPublished: boolean;
  deadline?: string | null;
  questionsCount?: number;
  questions?: QuestionData[];
}

export interface QuestionData {
  id: string;
  assessmentId?: string;
  questionText: string;
  options: string[];
  correctOption: number;
  explanation?: string | null;
  topic: string;
  marks: number;
  orderIndex: number;
}

export interface AssessmentAttemptData {
  id: string;
  assessmentId: string;
  assessmentTitle?: string;
  userId: string;
  userName?: string;
  score: number;
  percentage: number;
  isPassed: boolean;
  timeTakenSec: number;
  submittedAt: string;
  isOfflineSync?: boolean;
}

export interface TraineeCompetencyData {
  id: string;
  subjectArea: string;
  currentScore: number;
  targetScore: number;
  gapScore: number;
}

export interface TrainerMatchData {
  trainerId: string;
  trainerName: string;
  organization: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  subjectArea: string;
  skillMatch: number;      // 40%
  qualScore: number;       // 20%
  expScore: number;        // 20%
  perfScore: number;       // 20%
  overallMatch: number;    // Weighted sum
  avatarUrl?: string | null;
}

export interface RiskEvaluationData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  organization: string;
  designation?: string | null;
  avatarUrl?: string | null;
  riskLevel: RiskLevel;
  averageScore: number;
  completionRate: number;
  missedAssessments: number;
  inactiveDays: number;
  primaryReason: string;
  recommendedAction: string;
  evaluatedAt: string;
}

export interface CertificateData {
  id: string;
  certificateCode: string;
  traineeName: string;
  traineeOrg: string;
  courseTitle: string;
  courseCode: string;
  trainerName: string;
  issuedOn: string;
  grade: string;
  verificationUrl?: string | null;
}

export interface AnnouncementData {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  targetRole: string;
  isUrgent: boolean;
  isPublished: boolean;
  publishDate: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "DANGER";
  isRead: boolean;
  createdAt: string;
}

export interface GeneratedMCQ {
  id?: string;
  questionText: string;
  options: string[];
  correctOption: number;
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
  approved?: boolean;
}
