import type {
  CEFRLevel,
  ExerciseAttempt,
  IELTSPracticeSession,
  LessonProgress,
  Mistake,
  ReviewSchedule,
  SpeakingSession,
  Streak,
  User,
  UserPreferences,
  WritingSubmission,
  XPTransaction,
} from './domain';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface CompleteLessonRequest {
  idempotencyKey: string;
  lessonId: string;
  unitId: string;
  accuracy: number;
  durationSeconds: number;
  attempts: Omit<ExerciseAttempt, 'id' | 'userId'>[];
}

export interface CompleteLessonResponse {
  lessonProgress: LessonProgress;
  awardedXp: number;
  duplicateIgnored: boolean;
  streak: Streak;
}

export interface GuestMigrationPayload {
  clientVersion: string;
  exportedAt: string;
  preferences: UserPreferences;
  lessonProgress: Record<string, LessonProgress>;
  xpTransactions: XPTransaction[];
  streak: Streak;
  vocabularySchedules: Record<string, ReviewSchedule>;
  mistakes: Mistake[];
  speakingSessions: SpeakingSession[];
  writingSubmissions: WritingSubmission[];
  ieltsSessions: IELTSPracticeSession[];
}

export interface AuthSessionResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AITutorRequest {
  conversationId: string;
  mode: string;
  bilingual: boolean;
  learnerLevel: CEFRLevel;
  message: string;
}
