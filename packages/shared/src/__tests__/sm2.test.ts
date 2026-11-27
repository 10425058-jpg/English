import { describe, expect, it } from 'vitest';
import {
  calculateSM2Review,
  computeUserLevel,
  evaluateExerciseAnswer,
  normalizeAnswer,
  updateStreakForActivity,
} from '../utils/sm2';
import type { Exercise, ReviewSchedule, Streak } from '../types/domain';

describe('normalizeAnswer', () => {
  it('normalizes casing, smart apostrophes, spaces, and trailing punctuation', () => {
    expect(normalizeAnswer('  I’m   fine,   thank you! ')).toBe("i'm fine, thank you");
  });
});

describe('evaluateExerciseAnswer', () => {
  it('accepts primary and alternative answers', () => {
    const ex: Exercise = {
      id: 'ex-1',
      lessonId: 'l-1',
      type: 'translation',
      instruction: 'Translate to English',
      prompt: 'Xin chào, tôi tên là Minh.',
      correctAnswer: 'Hello, my name is Minh.',
      acceptableAnswers: ['Hi, my name is Minh.', "Hello, I'm Minh."],
      explanation: 'Both Hello and Hi are natural greetings.',
      difficulty: 1,
      skills: ['vocabulary'],
      xpReward: 10,
    };

    expect(evaluateExerciseAnswer(ex, 'hello, my name is minh').isCorrect).toBe(true);
    const altResult = evaluateExerciseAnswer(ex, "Hi, my name is Minh!");
    expect(altResult.isCorrect).toBe(true);
    expect(altResult.matchedAlternative).toBe(true);
    expect(evaluateExerciseAnswer(ex, 'Goodbye').isCorrect).toBe(false);
  });

  it('evaluates sentence reconstruction word banks', () => {
    const ex: Exercise = {
      id: 'ex-2',
      lessonId: 'l-1',
      type: 'sentence_reconstruction',
      instruction: 'Put the words in order',
      prompt: 'Tôi uống cà phê mỗi sáng.',
      wordBank: ['I', 'drink', 'coffee', 'every', 'morning'],
      correctAnswer: ['I', 'drink', 'coffee', 'every', 'morning'],
      explanation: 'Present simple subject + verb + object + time phrase.',
      difficulty: 1,
      skills: ['grammar'],
      xpReward: 10,
    };

    expect(evaluateExerciseAnswer(ex, ['I', 'drink', 'coffee', 'every', 'morning']).isCorrect).toBe(
      true
    );
    expect(evaluateExerciseAnswer(ex, ['drink', 'I', 'coffee', 'every', 'morning']).isCorrect).toBe(
      false
    );
  });

  it('evaluates multiple_response order-independently and validates extended exercise types', () => {
    const multi: Exercise = {
      id: 'ex-multi',
      lessonId: 'l-m',
      type: 'multiple_response',
      instruction: 'Select both cold seasons',
      prompt: 'Pick TWO cool/cold seasons:',
      options: ['summer', 'autumn', 'winter', 'morning'],
      correctAnswer: ['autumn', 'winter'],
      explanation: 'Autumn and winter bring cool air.',
      difficulty: 1,
      skills: ['vocabulary'],
      xpReward: 12,
    };

    expect(evaluateExerciseAnswer(multi, ['winter', 'autumn']).isCorrect).toBe(true);
    expect(evaluateExerciseAnswer(multi, ['autumn']).isCorrect).toBe(false);
    expect(evaluateExerciseAnswer(multi, ['autumn', 'winter', 'summer']).isCorrect).toBe(false);

    const matchEx: Exercise = {
      id: 'ex-match',
      lessonId: 'l-m',
      type: 'definition_matching',
      instruction: 'Match terms',
      prompt: 'Match pairs',
      pairs: [
        { id: 'p1', left: 'early', right: 'sớm' },
        { id: 'p2', left: 'late', right: 'muộn' },
      ],
      correctAnswer: 'early=sớm; late=muộn',
      explanation: 'Pairs',
      difficulty: 1,
      skills: ['vocabulary'],
      xpReward: 12,
    };
    expect(evaluateExerciseAnswer(matchEx, 'early=sớm; late=muộn').isCorrect).toBe(true);

    const recallEx: Exercise = {
      id: 'ex-recall',
      lessonId: 'l-r',
      type: 'vocabulary_recall',
      instruction: 'Recall noun',
      prompt: 'Morning meal',
      correctAnswer: 'breakfast',
      explanation: 'Breakfast starts the day.',
      difficulty: 1,
      skills: ['vocabulary'],
      xpReward: 10,
    };
    expect(evaluateExerciseAnswer(recallEx, 'Breakfast.').isCorrect).toBe(true);
  });
});

describe('SM-2 Spaced Repetition', () => {
  it('progresses intervals on Good reviews and resets on Again', () => {
    const base: ReviewSchedule = {
      vocabularyId: 'v-1',
      easeFactor: 2.5,
      intervalDays: 0,
      repetitions: 0,
      nextReviewDate: '2026-11-27T00:00:00.000Z',
      masteryLevel: 0,
    };

    const r1 = calculateSM2Review(base, 4, '2026-11-27T08:00:00.000Z');
    expect(r1.repetitions).toBe(1);
    expect(r1.intervalDays).toBe(1);

    const r2 = calculateSM2Review(r1, 4, '2026-11-28T08:00:00.000Z');
    expect(r2.repetitions).toBe(2);
    expect(r2.intervalDays).toBe(6);

    const reset = calculateSM2Review(r2, 1, '2026-12-04T08:00:00.000Z');
    expect(reset.repetitions).toBe(0);
    expect(reset.intervalDays).toBe(1);
    expect(reset.masteryLevel).toBe(0);
  });
});

describe('Gamification progression & streaks', () => {
  it('calculates levels monotonically from XP', () => {
    expect(computeUserLevel(0).level).toBe(1);
    expect(computeUserLevel(149).level).toBe(1);
    expect(computeUserLevel(150).level).toBe(2);
    expect(computeUserLevel(320)).toEqual({
      level: 3,
      currentLevelXp: 20,
      nextLevelXp: 150,
      progressPercent: 13,
    });
  });

  it('increments streak only once per day and resets after missed day', () => {
    const start: Streak = { currentDays: 0, longestDays: 0, lastActiveDate: null, activeDates: [] };
    const day1 = updateStreakForActivity(start, '2026-11-25');
    expect(day1.currentDays).toBe(1);

    const sameDay = updateStreakForActivity(day1, '2026-11-25');
    expect(sameDay.currentDays).toBe(1);

    const day2 = updateStreakForActivity(sameDay, '2026-11-26');
    expect(day2.currentDays).toBe(2);
    expect(day2.longestDays).toBe(2);

    const afterGap = updateStreakForActivity(day2, '2026-11-29');
    expect(afterGap.currentDays).toBe(1);
    expect(afterGap.longestDays).toBe(2);
  });
});
