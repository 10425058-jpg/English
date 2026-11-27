import type { CompleteLessonRequest, GuestMigrationPayload } from '@english-quest/shared';

export interface BackendModuleBlueprint {
  name: string;
  phase: 'Phase 2' | 'Phase 3';
  baseRoute: string;
  responsibilities: string[];
}

export const ENGLISH_QUEST_BACKEND_MODULES: BackendModuleBlueprint[] = [
  {
    name: 'AuthModule',
    phase: 'Phase 2',
    baseRoute: '/api/v1/auth',
    responsibilities: [
      'Argon2id/bcrypt password hashing',
      'Short-lived JWT access & rotating refresh tokens',
      'Guest-to-account progress migration validation',
    ],
  },
  {
    name: 'CurriculumModule',
    phase: 'Phase 2',
    baseRoute: '/api/v1/curriculum',
    responsibilities: [
      'CEFR A1-C2 section/unit/lesson delivery',
      'Reading passages and listening scripts',
    ],
  },
  {
    name: 'ProgressModule',
    phase: 'Phase 2',
    baseRoute: '/api/v1/progress',
    responsibilities: [
      'Idempotent lesson completion & XP ledger',
      'SM-2 vocabulary scheduling & mistake notebook sync',
    ],
  },
  {
    name: 'AITutorModule',
    phase: 'Phase 3',
    baseRoute: '/api/v1/ai',
    responsibilities: [
      'OpenAI-compatible server-side proxy (never exposing keys to client)',
      'Structured JSON schema validation, rate limiting & daily token budgets',
      'Server-side STT/TTS and dedicated pronunciation assessment adapter',
    ],
  },
];

export function validateLessonRequestShape(req: CompleteLessonRequest): boolean {
  return (
    Boolean(req.idempotencyKey.trim()) &&
    Boolean(req.lessonId.trim()) &&
    req.accuracy >= 0 &&
    req.accuracy <= 100
  );
}

export function summarizeMigrationPayload(payload: GuestMigrationPayload): {
  lessons: number;
  transactions: number;
  mistakes: number;
} {
  return {
    lessons: Object.keys(payload.lessonProgress).length,
    transactions: payload.xpTransactions.length,
    mistakes: payload.mistakes.length,
  };
}
