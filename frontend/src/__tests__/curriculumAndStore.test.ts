import { beforeEach, describe, expect, it } from 'vitest';
import {
  convertListeningRawToBand,
  convertReadingRawToBand,
  evaluateExerciseAnswer,
  roundIeltsOverallBand,
  type CEFRLevel,
} from '@english-quest/shared';
import { loadMergedUnitsByCefr, loadAllMergedUnits, getUnitLockState, computeCefrMasteryProgress, getLessonNodeState, isUnitChestUnlocked } from '@/services/curriculumService';
import { ALL_UNITS, CURRICULUM_SECTIONS } from '@/data/curriculum';
import { evaluatePlacementLevel, PLACEMENT_QUESTIONS } from '@/data/placementTest';
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

  it('activates A1–C2 structured learning progression, assessment recording, and XP-vs-mastery separation', async () => {
    const activeStatuses = CURRICULUM_SECTIONS.map((s) => s.status);
    expect(activeStatuses.every((st) => st === 'active')).toBe(true);

    const allMerged = await loadAllMergedUnits();
    expect(allMerged.length).toBe(48);
    const totalLessons = allMerged.reduce((sum, u) => sum + u.lessons.length, 0);
    expect(totalLessons).toBe(264);

    const b2Units = await loadMergedUnitsByCefr('B2');
    expect(b2Units.length).toBe(8);

    // Placement test extends cleanly through C2
    expect(PLACEMENT_QUESTIONS.length).toBe(14);
    expect(evaluatePlacementLevel(14, 14).recommendedCefr).toBe('C2');
    expect(evaluatePlacementLevel(11, 14).recommendedCefr).toBe('C1');
    expect(evaluatePlacementLevel(9, 14).recommendedCefr).toBe('B2');

    // Earning high XP without finishing lessons or passing assessments NEVER fakes CEFR Mastery
    useQuestStore.getState().awardActivityXp({
      idempotencyKey: 'xp-grind-test',
      amount: 5000,
      source: 'vocabulary',
      referenceId: 'vocab-practice',
    });
    expect(useQuestStore.getState().xp).toBe(5000);
    const beforeMastery = computeCefrMasteryProgress(
      'B2',
      b2Units,
      b2Units.length,
      useQuestStore.getState().lessonProgress,
      useQuestStore.getState().unitAssessmentResults,
      useQuestStore.getState().assessmentHistory,
    );
    expect(beforeMastery.masteryPercent).toBe(0);

    // Passing Unit Assessment & unlocking units independently works cleanly
    useQuestStore.getState().unlockUnitForIndependentPractice('b2-u4');
    const lockU4 = getUnitLockState(
      b2Units[3],
      b2Units,
      useQuestStore.getState().lessonProgress,
      'B2',
      useQuestStore.getState().unitAssessmentResults,
      useQuestStore.getState().unlockedUnitOverrides,
    );
    expect(lockU4.isUnlocked).toBe(true);
    expect(lockU4.reason).toBe('recommended_tier');

    const { awardedXp, record } = useQuestStore.getState().recordAssessmentAttempt({
      assessmentId: 'cefr-exam-b2',
      kind: 'level_completion',
      cefrLevel: 'B2' as CEFRLevel,
      title: 'Comprehensive B2 Level Completion Assessment',
      correctCount: 7,
      totalObjectiveCount: 8,
      accuracyPercent: 88,
      passed: true,
      skillBreakdown: { grammar: { correct: 2, total: 2 } },
      durationSeconds: 300,
    });
    expect(record.passed).toBe(true);
    expect(awardedXp).toBe(80);
    // Passing B2 exam promotes recommendedCefr cleanly to C1
    expect(useQuestStore.getState().recommendedCefr).toBe('C1');

    const afterMastery = computeCefrMasteryProgress(
      'B2',
      b2Units,
      b2Units.length,
      useQuestStore.getState().lessonProgress,
      useQuestStore.getState().unitAssessmentResults,
      useQuestStore.getState().assessmentHistory,
    );
    expect(afterMastery.levelExamPassed).toBe(true);
    expect(afterMastery.masteryPercent).toBeGreaterThan(beforeMastery.masteryPercent);
  });

  it('computes official IELTS 40-mark Academic vs General Training scales and .25/.75 half-band rounding', () => {
    expect(convertListeningRawToBand(30, 40)).toBe(7.0);
    expect(convertListeningRawToBand(35, 40)).toBe(8.0);
    // General Training Reading requires stricter raw hits than Academic at equivalent band
    expect(convertReadingRawToBand(30, 'academic', 40)).toBe(7.0);
    expect(convertReadingRawToBand(30, 'general_training', 40)).toBe(6.0);
    expect(convertReadingRawToBand(34, 'general_training', 40)).toBe(7.0);

    // Official IELTS overall averaging (.25 -> .5, .75 -> next whole band)
    expect(roundIeltsOverallBand([6.5, 6.5, 6.0, 6.0])).toBe(6.5); // 6.25 -> 6.5
    expect(roundIeltsOverallBand([7.0, 7.0, 6.5, 6.5])).toBe(7.0); // 6.75 -> 7.0
    expect(roundIeltsOverallBand([6.5, 6.0, 6.0, 6.0])).toBe(6.0); // 6.125 -> 6.0
  });

  it('generates rule-based adaptive study plan highlighting mistake clusters, IELTS mock gaps, and mock autosave recovery', async () => {
    const { buildPersonalizedDailyPlan, clusterUnresolvedMistakes } = await import('@/services/curriculumService');

    useQuestStore.getState().recordMistake({
      source: 'reading',
      skill: 'reading',
      cefrLevel: 'B2',
      prompt: 'True or False test prompt',
      userAnswer: 'TRUE',
      expectedAnswer: 'FALSE',
      explanation: 'Direct contradiction.',
    });
    useQuestStore.getState().recordMistake({
      source: 'reading',
      skill: 'reading',
      cefrLevel: 'B2',
      prompt: 'Heading check prompt',
      userAnswer: 'A',
      expectedAnswer: 'B',
      explanation: 'Check paragraph thesis.',
    });

    const clusters = clusterUnresolvedMistakes(useQuestStore.getState().mistakes);
    expect(clusters[0]).toMatchObject({ skill: 'reading', source: 'reading', count: 2 });

    // Save & record mock exam progression
    const draft = {
      mockId: 'ielts-mock-ac-01',
      pathway: 'academic' as const,
      currentSection: 'reading' as const,
      sectionRemainingSeconds: 2400,
      listeningAnswers: {},
      readingAnswers: {},
      writingTask1Draft: 'Overall chart trends.',
      writingTask2Draft: 'Essay body.',
      speakingSelfBand: 6.5,
      speakingNotes: '',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    useQuestStore.getState().saveInProgressMockExam(draft);
    expect(useQuestStore.getState().inProgressMockExam?.mockId).toBe('ielts-mock-ac-01');

    const { awardedXp } = useQuestStore.getState().recordMockExamCompletion({
      mockId: 'ielts-mock-ac-01',
      title: 'Mock Exam 1',
      pathway: 'academic',
      listeningRaw: 7,
      listeningMax: 8,
      listeningBand: 8.0,
      readingRaw: 8,
      readingMax: 15,
      readingBand: 5.5,
      writingBand: 6.5,
      writingTask1Words: 165,
      writingTask2Words: 270,
      speakingBand: 6.5,
      overallBand: 6.5,
      durationSeconds: 1800,
      isUnofficialEstimate: true,
    });
    expect(awardedXp).toBe(120);
    expect(useQuestStore.getState().inProgressMockExam).toBeNull();
    expect(useQuestStore.getState().ieltsMockHistory).toHaveLength(1);

    const plan = buildPersonalizedDailyPlan({
      skillStats: useQuestStore.getState().skillStats,
      mistakes: useQuestStore.getState().mistakes,
      vocabularySchedules: useQuestStore.getState().vocabularySchedules,
      lessonProgress: useQuestStore.getState().lessonProgress,
      recommendedCefr: useQuestStore.getState().recommendedCefr,
      dailyGoalMinutes: 30,
      studyMinutesToday: 0,
      purpose: 'ielts',
      ieltsPathway: 'academic',
      ieltsTargetBand: 7.5,
      ieltsMockHistory: useQuestStore.getState().ieltsMockHistory,
      unitAssessmentResults: useQuestStore.getState().unitAssessmentResults,
    });

    expect(plan.some((p) => p.category === 'mistake' && p.title.includes('2 active'))).toBe(true);
    expect(plan.some((p) => p.category === 'ielts' && p.title.includes('Reading Gap'))).toBe(true);
  });
});
