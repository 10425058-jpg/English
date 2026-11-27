import type { CEFRLevel, Exercise, ReviewSchedule, SkillProgress, SkillTag, Streak } from '../types/domain';

/**
 * Normalizes learner text answers for forgiving comparison (case, extra spaces,
 * smart apostrophes, and trailing punctuation).
 */
export function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ');
}

export interface AnswerValidationResult {
  isCorrect: boolean;
  normalizedUserAnswer: string;
  expectedDisplay: string;
  matchedAlternative: boolean;
}

/**
 * Evaluates a learner's answer against an exercise specification, supporting
 * single strings, ordered word banks, matching pairs, and keyword-checked free writing.
 */
export function evaluateExerciseAnswer(
  exercise: Exercise,
  rawAnswer: string | string[]
): AnswerValidationResult {
  if ((exercise.type === 'word_matching' || exercise.type === 'definition_matching') && exercise.pairs) {
    const expectedSummary = exercise.pairs.map((p) => `${p.left}=${p.right}`).join('; ');
    const submitted = Array.isArray(rawAnswer) ? rawAnswer.join('; ') : rawAnswer;
    const isCorrect = normalizeAnswer(submitted) === normalizeAnswer(expectedSummary);
    return {
      isCorrect,
      normalizedUserAnswer: submitted,
      expectedDisplay: expectedSummary,
      matchedAlternative: false,
    };
  }

  if (exercise.type === 'multiple_response') {
    const expectedList = (Array.isArray(exercise.correctAnswer)
      ? exercise.correctAnswer
      : exercise.correctAnswer.split(';;')
    )
      .map((s) => normalizeAnswer(s))
      .filter(Boolean)
      .sort();
    const userList = (Array.isArray(rawAnswer) ? rawAnswer : rawAnswer.split(';;'))
      .map((s) => normalizeAnswer(s))
      .filter(Boolean)
      .sort();
    const isCorrect =
      expectedList.length === userList.length &&
      expectedList.every((val, idx) => val === userList[idx]);
    return {
      isCorrect,
      normalizedUserAnswer: userList.join('; '),
      expectedDisplay: Array.isArray(exercise.correctAnswer)
        ? exercise.correctAnswer.join('; ')
        : exercise.correctAnswer,
      matchedAlternative: false,
    };
  }

  if (exercise.type === 'free_writing') {
    const text = Array.isArray(rawAnswer) ? rawAnswer.join(' ') : rawAnswer;
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const minWords = exercise.minWords ?? 8;
    const lower = text.toLowerCase();
    const keywords = exercise.requiredKeywords ?? [];
    const matchedKeywords =
      keywords.length === 0 || keywords.some((kw) => lower.includes(kw.toLowerCase()));
    const isCorrect = words.length >= minWords && matchedKeywords;
    return {
      isCorrect,
      normalizedUserAnswer: text.trim(),
      expectedDisplay: Array.isArray(exercise.correctAnswer)
        ? exercise.correctAnswer[0] ?? ''
        : exercise.correctAnswer,
      matchedAlternative: false,
    };
  }

  const userStr = Array.isArray(rawAnswer) ? rawAnswer.join(' ') : rawAnswer;
  const normalizedUser = normalizeAnswer(userStr);
  const primaryList = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer
    : [exercise.correctAnswer];
  const primaryDisplay = primaryList.join(' ');

  if (
    primaryList.length > 1 &&
    (exercise.type === 'sentence_reconstruction' || exercise.type === 'sentence_ordering')
  ) {
    const joinedExpected = normalizeAnswer(primaryDisplay);
    if (normalizedUser === joinedExpected) {
      return {
        isCorrect: true,
        normalizedUserAnswer: normalizedUser,
        expectedDisplay: primaryDisplay,
        matchedAlternative: false,
      };
    }
  }

  for (const candidate of primaryList) {
    if (normalizeAnswer(candidate) === normalizedUser) {
      return {
        isCorrect: true,
        normalizedUserAnswer: normalizedUser,
        expectedDisplay: primaryDisplay,
        matchedAlternative: false,
      };
    }
  }

  for (const alt of exercise.acceptableAnswers ?? []) {
    if (normalizeAnswer(alt) === normalizedUser) {
      return {
        isCorrect: true,
        normalizedUserAnswer: normalizedUser,
        expectedDisplay: primaryDisplay,
        matchedAlternative: true,
      };
    }
  }

  return {
    isCorrect: false,
    normalizedUserAnswer: normalizedUser,
    expectedDisplay: primaryDisplay,
    matchedAlternative: false,
  };
}

/**
 * SM-2 Spaced Repetition Quality Rating:
 * 1 = Again (forgot), 3 = Hard, 4 = Good, 5 = Easy
 */
export type SM2Quality = 1 | 3 | 4 | 5;

export function calculateSM2Review(
  current: ReviewSchedule,
  quality: SM2Quality,
  nowIso: string
): ReviewSchedule {
  let { easeFactor, intervalDays, repetitions } = current;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  }

  const efDelta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  easeFactor = Math.max(1.3, Number((easeFactor + efDelta).toFixed(2)));

  if (quality === 3 && repetitions > 1) {
    intervalDays = Math.max(1, Math.round(intervalDays * 0.8));
  } else if (quality === 5 && repetitions > 1) {
    intervalDays = Math.round(intervalDays * 1.2);
  }

  const nextDate = new Date(nowIso);
  nextDate.setUTCDate(nextDate.getUTCDate() + intervalDays);

  let masteryLevel: ReviewSchedule['masteryLevel'] = 0;
  if (repetitions >= 5 && intervalDays >= 21) masteryLevel = 5;
  else if (repetitions >= 4) masteryLevel = 4;
  else if (repetitions >= 3) masteryLevel = 3;
  else if (repetitions >= 2) masteryLevel = 2;
  else if (repetitions >= 1) masteryLevel = 1;

  return {
    vocabularyId: current.vocabularyId,
    easeFactor,
    intervalDays,
    repetitions,
    nextReviewDate: nextDate.toISOString(),
    lastReviewedAt: nowIso,
    masteryLevel,
  };
}

export function isDueForReview(schedule: ReviewSchedule, nowIso: string): boolean {
  return new Date(schedule.nextReviewDate).getTime() <= new Date(nowIso).getTime();
}

export function computeUserLevel(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const safeXp = Math.max(0, totalXp);
  const xpPerLevel = 150;
  const level = Math.floor(safeXp / xpPerLevel) + 1;
  const currentLevelXp = safeXp % xpPerLevel;
  return {
    level,
    currentLevelXp,
    nextLevelXp: xpPerLevel,
    progressPercent: Math.round((currentLevelXp / xpPerLevel) * 100),
  };
}

export function toLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function updateStreakForActivity(streak: Streak, todayKey: string): Streak {
  if (streak.lastActiveDate === todayKey) {
    return streak;
  }

  const yesterday = new Date(`${todayKey}T00:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toLocalDateKey(yesterday);

  const nextCurrent = streak.lastActiveDate === yesterdayKey ? streak.currentDays + 1 : 1;
  const nextLongest = Math.max(streak.longestDays, nextCurrent);
  const activeDates = streak.activeDates.includes(todayKey)
    ? streak.activeDates
    : [...streak.activeDates, todayKey].slice(-90);

  return {
    currentDays: nextCurrent,
    longestDays: nextLongest,
    lastActiveDate: todayKey,
    activeDates,
  };
}

export function estimateSkillCEFR(
  attempts: number,
  correct: number,
  baseLevel: CEFRLevel = 'A1'
): CEFRLevel {
  if (attempts === 0) return baseLevel;
  const accuracy = correct / attempts;
  if (attempts >= 25 && accuracy >= 0.85) return 'B2';
  if (attempts >= 15 && accuracy >= 0.78) return 'B1';
  if (attempts >= 6 && accuracy >= 0.65) return 'A2';
  return baseLevel;
}

export function createInitialSkillProgress(
  baseLevel: CEFRLevel = 'A1'
): Record<SkillTag, SkillProgress> {
  const skills: SkillTag[] = [
    'vocabulary',
    'grammar',
    'listening',
    'speaking',
    'reading',
    'writing',
  ];
  return skills.reduce(
    (acc, skill) => {
      acc[skill] = {
        skill,
        attempts: 0,
        correct: 0,
        minutesPracticed: 0,
        estimatedCefr: baseLevel,
      };
      return acc;
    },
    {} as Record<SkillTag, SkillProgress>
  );
}
