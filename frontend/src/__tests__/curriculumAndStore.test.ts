import { beforeEach, describe, expect, it } from 'vitest';
import { evaluateExerciseAnswer } from '@english-quest/shared';
import { ALL_UNITS } from '@/data/curriculum';
import { getLessonNodeState, isUnitChestUnlocked } from '@/services/curriculumService';
import { useQuestStore } from '@/stores/useQuestStore';

describe('CEFR Curriculum Integrity', () => {
  it('provides at least 12 complete units across A1, A2, and B1 with >= 4 lessons each', () => {
    expect(ALL_UNITS.length).toBeGreaterThanOrEqual(12);
    const levels = new Set(ALL_UNITS.map((u) => u.cefrLevel));
    expect(levels).toEqual(new Set(['A1', 'A2', 'B1']));

    const unitIds = new Set<string>();
    const lessonIds = new Set<string>();
    const exerciseIds = new Set<string>();

    for (const unit of ALL_UNITS) {
      expect(unitIds.has(unit.id)).toBe(false);
      unitIds.add(unit.id);
      expect(unit.lessons.length).toBeGreaterThanOrEqual(4);

      for (const lesson of unit.lessons) {
        expect(lessonIds.has(lesson.id)).toBe(false);
        lessonIds.add(lesson.id);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(4);

        for (const ex of lesson.exercises) {
          expect(exerciseIds.has(ex.id)).toBe(false);
          exerciseIds.add(ex.id);
          expect(ex.explanation.trim().length).toBeGreaterThan(5);
          // Every exercise must validate its own correctAnswer cleanly
          const evalResult = evaluateExerciseAnswer(ex, ex.correctAnswer);
          expect(evalResult.isCorrect).toBe(true);
        }
      }
    }
  });
});

describe('Quest Store Progression & Idempotency', () => {
  beforeEach(() => {
    localStorage.clear();
    useQuestStore.getState().resetAllProgress();
  });

  it('prevents duplicate XP rewards when the same idempotencyKey is submitted twice', () => {
    const store = useQuestStore.getState();
    const first = store.completeLessonAttempt({
      idempotencyKey: 'attempt-unique-1',
      lessonId: 'a1-u1-l1',
      unitId: 'a1-u1',
      accuracy: 100,
      xpReward: 25,
      durationSeconds: 120,
      skills: ['vocabulary', 'grammar'],
      cefrLevel: 'A1',
      correctExercises: 4,
      totalExercises: 4,
    });

    expect(first.duplicateIgnored).toBe(false);
    expect(first.awardedXp).toBe(25);
    expect(useQuestStore.getState().xp).toBe(25);
    expect(useQuestStore.getState().streak.currentDays).toBe(1);

    const second = useQuestStore.getState().completeLessonAttempt({
      idempotencyKey: 'attempt-unique-1',
      lessonId: 'a1-u1-l1',
      unitId: 'a1-u1',
      accuracy: 100,
      xpReward: 25,
      durationSeconds: 120,
      skills: ['vocabulary', 'grammar'],
      cefrLevel: 'A1',
      correctExercises: 4,
      totalExercises: 4,
    });

    expect(second.duplicateIgnored).toBe(true);
    expect(second.awardedXp).toBe(0);
    expect(useQuestStore.getState().xp).toBe(25);
  });

  it('unlocks sequential lessons and unit treasure chest only after unit lessons finish', () => {
    const unit = ALL_UNITS[0];
    expect(getLessonNodeState(unit.lessons[0], unit, {}, 'A1')).toBe('available');
    expect(getLessonNodeState(unit.lessons[1], unit, {}, 'A1')).toBe('locked');
    expect(isUnitChestUnlocked(unit, {})).toBe(false);

    for (let i = 0; i < unit.lessons.length; i++) {
      useQuestStore.getState().completeLessonAttempt({
        idempotencyKey: `unit-finish-${i}`,
        lessonId: unit.lessons[i].id,
        unitId: unit.id,
        accuracy: 95,
        xpReward: unit.lessons[i].xpReward,
        durationSeconds: 90,
        skills: unit.lessons[i].skills,
        cefrLevel: unit.cefrLevel,
        correctExercises: 4,
        totalExercises: 4,
      });
    }

    const progress = useQuestStore.getState().lessonProgress;
    expect(isUnitChestUnlocked(unit, progress)).toBe(true);
    expect(
      useQuestStore.getState().claimTreasureChest(unit.id, unit.chestRewardGems, unit.chestRewardXp)
    ).toBe(true);
    // Second chest claim must be rejected
    expect(
      useQuestStore.getState().claimTreasureChest(unit.id, unit.chestRewardGems, unit.chestRewardXp)
    ).toBe(false);
  });

  it('records and resolves mistakes and saves/reviews SM-2 vocabulary', () => {
    const store = useQuestStore.getState();
    store.recordMistake({
      source: 'lesson',
      skill: 'grammar',
      cefrLevel: 'A1',
      prompt: 'She ___ coffee.',
      userAnswer: 'drink',
      expectedAnswer: 'drinks',
      explanation: 'Add -s for she.',
    });

    const added = useQuestStore.getState().mistakes[0];
    expect(added.resolved).toBe(false);
    useQuestStore.getState().resolveMistake(added.id);
    expect(useQuestStore.getState().mistakes[0].resolved).toBe(true);

    const newWordId = useQuestStore.getState().saveWordToVocabulary({
      word: 'persistence',
      partOfSpeech: 'noun',
      ipa: '/pərˈsɪstəns/',
      definition: 'Continuing steadily despite difficulty.',
      vietnameseTranslation: 'sự kiên trì',
      exampleSentence: 'Persistence leads to fluency.',
      synonyms: [],
      antonyms: [],
      collocations: [],
      wordFamily: [],
      cefrLevel: 'B1',
      category: 'Mindset',
    });
    useQuestStore.getState().reviewVocabularySM2(newWordId, 4);
    expect(useQuestStore.getState().vocabularySchedules[newWordId].repetitions).toBe(1);
  });
});
