import type {
  AssessmentAttemptRecord,
  CEFRLevel,
  DailyGoalMinutes,
  IELTSMockAttemptResult,
  IELTSPathway,
  LearningPurpose,
  Lesson,
  LessonProgress,
  Mistake,
  NodeState,
  ReviewSchedule,
  SkillProgress,
  SkillTag,
  Unit,
} from '@english-quest/shared';
import { isDueForReview, toLocalDateKey } from '@english-quest/shared';
import { loadAllCurriculumUnits, loadCurriculumUnitsByLevel } from '@content/index';
import { ALL_UNITS, CURRICULUM_SECTIONS } from '@/data/curriculum';

const CEFR_ORDER: Record<CEFRLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

export function getAllSections() {
  return CURRICULUM_SECTIONS;
}

export function getUnitsByCefr(level: CEFRLevel): Unit[] {
  return ALL_UNITS.filter((u) => u.cefrLevel === level);
}

/** Merges synchronous core units (A1–B1 u1–u4) with lazily loaded Milestone 3 units (u5–u8 / B2–C2 u1–u8). */
export function mergeUnitsForLevel(level: CEFRLevel, m3Units: Unit[]): Unit[] {
  const core = ALL_UNITS.filter((u) => u.cefrLevel === level);
  const byId = new Map<string, Unit>();
  for (const u of core) byId.set(u.id, u);
  for (const u of m3Units) {
    if (u.cefrLevel === level) byId.set(u.id, u);
  }
  return Array.from(byId.values()).sort((a, b) => a.orderIndex - b.orderIndex);
}

/** Lazily loads the complete unit list for a single CEFR tier (up to 8 full units per A1–C2). */
export async function loadMergedUnitsByCefr(level: CEFRLevel): Promise<Unit[]> {
  const m3 = await loadCurriculumUnitsByLevel(level);
  return mergeUnitsForLevel(level, m3);
}

/** Lazily loads all 48 cumulative A1–C2 units (12 core + 36 Milestone 3 structured units). */
export async function loadAllMergedUnits(): Promise<Unit[]> {
  const m3All = await loadAllCurriculumUnits();
  const byId = new Map<string, Unit>();
  for (const u of ALL_UNITS) byId.set(u.id, u);
  for (const u of m3All) byId.set(u.id, u);
  return Array.from(byId.values()).sort(
    (a, b) => CEFR_ORDER[a.cefrLevel] - CEFR_ORDER[b.cefrLevel] || a.orderIndex - b.orderIndex,
  );
}

export function getLessonById(lessonId: string): { unit: Unit; lesson: Lesson } | null {
  for (const unit of ALL_UNITS) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return { unit, lesson };
  }
  return null;
}

export interface UnitLockEvaluation {
  isUnlocked: boolean;
  reason: 'recommended_tier' | 'first_unit' | 'prereq_met' | 'manual_override' | 'locked';
  missingPrerequisiteUnitIds: string[];
}

/**
 * Evaluates unit availability balancing guided CEFR progression with learner autonomy:
 * - Units at or below `recommendedCefr` or explicitly unlocked via `unlockedUnitOverrides` open immediately.
 * - Higher units unlock cleanly once prerequisite units have >= 2 lessons completed or their Unit Mastery Assessment passed.
 */
export function getUnitLockState(
  unit: Unit,
  orderedTrackUnits: Unit[],
  lessonProgress: Record<string, LessonProgress>,
  recommendedCefr: CEFRLevel,
  unitAssessmentResults: Record<string, AssessmentAttemptRecord> = {},
  unlockedUnitOverrides: string[] = [],
): UnitLockEvaluation {
  if (CEFR_ORDER[unit.cefrLevel] <= CEFR_ORDER[recommendedCefr]) {
    return { isUnlocked: true, reason: 'recommended_tier', missingPrerequisiteUnitIds: [] };
  }
  if (unlockedUnitOverrides.includes(unit.id)) {
    return { isUnlocked: true, reason: 'manual_override', missingPrerequisiteUnitIds: [] };
  }

  const idx = orderedTrackUnits.findIndex((u) => u.id === unit.id);
  const prereqIds =
    unit.prerequisiteUnitIds && unit.prerequisiteUnitIds.length > 0
      ? unit.prerequisiteUnitIds
      : idx > 0
        ? [orderedTrackUnits[idx - 1].id]
        : [];

  if (prereqIds.length === 0) {
    return { isUnlocked: true, reason: 'first_unit', missingPrerequisiteUnitIds: [] };
  }

  const missing: string[] = [];
  for (const pid of prereqIds) {
    const prereqUnit = orderedTrackUnits.find((u) => u.id === pid);
    const passedPrereqAssessment = Boolean(unitAssessmentResults[pid]?.passed);
    if (passedPrereqAssessment) continue;

    if (prereqUnit) {
      const doneLessons = prereqUnit.lessons.filter((l) => Boolean(lessonProgress[l.id])).length;
      if (doneLessons >= Math.min(2, prereqUnit.lessons.length)) continue;
      missing.push(pid);
    } else {
      // If prerequisite belongs to prior CEFR tier not currently in memory list, check lesson IDs directly or assessment
      const prefixDone = Object.keys(lessonProgress).some((lid) => lid.startsWith(`${pid}-`));
      if (!prefixDone) missing.push(pid);
    }
  }

  if (missing.length === 0) {
    return { isUnlocked: true, reason: 'prereq_met', missingPrerequisiteUnitIds: [] };
  }
  return { isUnlocked: false, reason: 'locked', missingPrerequisiteUnitIds: missing };
}

/**
 * Computes interactive path node state (`locked` | `available` | `completed` | `mastered`).
 * Respects `unlockedUnitOverrides` and cross-unit sequential gating while preserving synchronous callers cleanly.
 */
export function getLessonNodeState(
  lesson: Lesson,
  unit: Unit,
  lessonProgress: Record<string, LessonProgress>,
  recommendedCefr: CEFRLevel,
  orderedTrackUnits: Unit[] = ALL_UNITS,
  unlockedUnitOverrides: string[] = [],
  unitAssessmentResults: Record<string, AssessmentAttemptRecord> = {},
): NodeState {
  const existing = lessonProgress[lesson.id];
  if (existing) {
    return existing.status === 'mastered' ? 'mastered' : 'completed';
  }

  if (lesson.orderIndex === 1) {
    const lock = getUnitLockState(
      unit,
      orderedTrackUnits,
      lessonProgress,
      recommendedCefr,
      unitAssessmentResults,
      unlockedUnitOverrides,
    );
    return lock.isUnlocked ? 'available' : 'locked';
  }

  const prevLesson = unit.lessons.find((l) => l.orderIndex === lesson.orderIndex - 1);
  if (prevLesson && lessonProgress[prevLesson.id]) {
    return 'available';
  }

  // Also allow opening directly if this specific unit was unlocked manually and prior lesson was skipped? Keep lesson-by-lesson order once unit opens, with lesson 1 available.
  return 'locked';
}

export function isUnitChestUnlocked(
  unit: Unit,
  lessonProgress: Record<string, LessonProgress>,
): boolean {
  return unit.lessons.every((l) => Boolean(lessonProgress[l.id]));
}

export interface CefrLevelMasteryStats {
  level: CEFRLevel;
  completedLessons: number;
  masteredLessons: number;
  totalLessons: number;
  passedUnitAssessments: number;
  totalUnitAssessments: number;
  levelExamPassed: boolean;
  /** Curriculum mastery percentage (0–100) computed exclusively from lesson completion and assessment passes, completely independent of XP. */
  masteryPercent: number;
}

/**
 * Computes genuine CEFR Mastery percentage from completed lessons, passed unit assessments, and comprehensive level exam,
 * strictly decoupled from accumulated XP points.
 */
export function computeCefrMasteryProgress(
  level: CEFRLevel,
  units: Unit[],
  unitAssessmentsCount: number,
  lessonProgress: Record<string, LessonProgress>,
  unitAssessmentResults: Record<string, AssessmentAttemptRecord>,
  assessmentHistory: AssessmentAttemptRecord[],
): CefrLevelMasteryStats {
  let completedLessons = 0;
  let masteredLessons = 0;
  let totalLessons = 0;

  for (const unit of units) {
    totalLessons += unit.lessons.length;
    for (const lesson of unit.lessons) {
      const lp = lessonProgress[lesson.id];
      if (lp) {
        completedLessons += 1;
        if (lp.status === 'mastered') masteredLessons += 1;
      }
    }
  }

  const passedUnitAssessments = units.filter((u) => unitAssessmentResults[u.id]?.passed).length;
  const levelExamId = `cefr-exam-${level.toLowerCase()}`;
  const levelExamPassed = assessmentHistory.some(
    (rec) => rec.assessmentId === levelExamId && rec.passed,
  );

  // Weight: 65% lesson completion, 25% unit mastery assessments (where applicable), 10% level exam
  const lessonRatio = totalLessons > 0 ? completedLessons / totalLessons : 0;
  const assessRatio = unitAssessmentsCount > 0 ? passedUnitAssessments / unitAssessmentsCount : lessonRatio;
  const examBonus = levelExamPassed ? 0.1 : 0;
  const raw =
    unitAssessmentsCount > 0
      ? Math.round((lessonRatio * 0.65 + assessRatio * 0.25 + examBonus) * 100)
      : Math.round((lessonRatio * 0.9 + examBonus) * 100);

  return {
    level,
    completedLessons,
    masteredLessons,
    totalLessons,
    passedUnitAssessments,
    totalUnitAssessments: unitAssessmentsCount,
    levelExamPassed,
    masteryPercent: Math.min(100, raw),
  };
}

export function findNextRecommendedLesson(
  lessonProgress: Record<string, LessonProgress>,
  recommendedCefr: CEFRLevel,
  unitsPool: Unit[] = ALL_UNITS,
): { unit: Unit; lesson: Lesson } {
  const preferredUnits = unitsPool.filter((u) => u.cefrLevel === recommendedCefr);
  const orderedUnits = [
    ...preferredUnits,
    ...unitsPool.filter((u) => u.cefrLevel !== recommendedCefr),
  ];

  for (const unit of orderedUnits) {
    for (const lesson of unit.lessons) {
      if (!lessonProgress[lesson.id]) {
        return { unit, lesson };
      }
    }
  }
  return { unit: orderedUnits[0] ?? ALL_UNITS[0], lesson: (orderedUnits[0] ?? ALL_UNITS[0]).lessons[0] };
}

export async function findNextRecommendedLessonAsync(
  lessonProgress: Record<string, LessonProgress>,
  recommendedCefr: CEFRLevel,
): Promise<{ unit: Unit; lesson: Lesson }> {
  const levelUnits = await loadMergedUnitsByCefr(recommendedCefr);
  const allUnfinished = levelUnits.find((u) => u.lessons.some((l) => !lessonProgress[l.id]));
  if (allUnfinished) {
    const lesson = allUnfinished.lessons.find((l) => !lessonProgress[l.id]) ?? allUnfinished.lessons[0];
    return { unit: allUnfinished, lesson };
  }
  const all = await loadAllMergedUnits();
  return findNextRecommendedLesson(lessonProgress, recommendedCefr, all);
}

export interface PersonalizedPlanItem {
  id: string;
  title: string;
  reason: string;
  route: string;
  estimatedMinutes: number;
  priority: 'high' | 'medium';
  category: 'mistake' | 'vocab' | 'ielts' | 'skill' | 'cefr_path';
}

export interface MistakeClusterSummary {
  key: string;
  skill: SkillTag;
  source: Mistake['source'];
  count: number;
  latestCefr: CEFRLevel;
}

export function clusterUnresolvedMistakes(mistakes: Mistake[]): MistakeClusterSummary[] {
  const unresolved = mistakes.filter((m) => !m.resolved);
  const map = new Map<string, MistakeClusterSummary>();
  for (const m of unresolved) {
    const key = `${m.skill}:${m.source}`;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, {
        key,
        skill: m.skill,
        source: m.source,
        count: 1,
        latestCefr: m.cefrLevel,
      });
    } else {
      prev.count += 1;
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function buildPersonalizedDailyPlan(params: {
  skillStats: Record<SkillTag, SkillProgress>;
  mistakes: Mistake[];
  vocabularySchedules: Record<string, ReviewSchedule>;
  lessonProgress: Record<string, LessonProgress>;
  recommendedCefr: CEFRLevel;
  dailyGoalMinutes: DailyGoalMinutes;
  studyMinutesToday: number;
  purpose?: LearningPurpose;
  ieltsPathway?: IELTSPathway;
  ieltsTargetBand?: number;
  ieltsMockHistory?: IELTSMockAttemptResult[];
  unitAssessmentResults?: Record<string, AssessmentAttemptRecord>;
}): PersonalizedPlanItem[] {
  const {
    skillStats,
    mistakes,
    vocabularySchedules,
    lessonProgress,
    recommendedCefr,
    dailyGoalMinutes,
    studyMinutesToday,
    purpose,
    ieltsPathway = 'academic',
    ieltsTargetBand = 6.5,
    ieltsMockHistory = [],
    unitAssessmentResults = {},
  } = params;

  const plan: PersonalizedPlanItem[] = [];
  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);
  const clusters = clusterUnresolvedMistakes(mistakes);
  if (unresolvedMistakes.length > 0) {
    const topCluster = clusters[0];
    plan.push({
      id: 'plan-mistakes',
      title: `Resolve ${unresolvedMistakes.length} active mistake${unresolvedMistakes.length > 1 ? 's' : ''}`,
      reason: topCluster
        ? `Top cluster: ${topCluster.count} in ${topCluster.skill} (${topCluster.source}). Targeted retry locks memory.`
        : 'Targeted retry turns past errors into durable mastery.',
      route: '/review',
      estimatedMinutes: 4,
      priority: 'high',
      category: 'mistake',
    });
  }

  // Pending Unit Mastery Assessment detection
  const pendingAssessmentUnit = ALL_UNITS.find((u) => {
    const allLessonsDone = u.lessons.length > 0 && u.lessons.every((l) => Boolean(lessonProgress[l.id]));
    const passedAssessment = Boolean(unitAssessmentResults[u.id]?.passed);
    return allLessonsDone && !passedAssessment;
  });
  if (pendingAssessmentUnit) {
    plan.push({
      id: `plan-unit-assess-${pendingAssessmentUnit.id}`,
      title: `Take Unit Mastery Check: ${pendingAssessmentUnit.title}`,
      reason: `All lessons in ${pendingAssessmentUnit.cefrLevel} ${pendingAssessmentUnit.title} finished—verify >=70% mastery cleanly.`,
      route: `/assessment/unit-assess-${pendingAssessmentUnit.id}`,
      estimatedMinutes: 8,
      priority: 'high',
      category: 'cefr_path',
    });
  }

  // Rule-based IELTS weakness diagnostics when learner tracks IELTS or logged mock runs
  const latestMock = ieltsMockHistory[0];
  if (latestMock) {
    const candidates: Array<{ label: string; band: number | null; rawAccuracyPct?: number }> = [
      {
        label: 'Listening',
        band: latestMock.listeningBand,
        rawAccuracyPct:
          latestMock.listeningMax > 0
            ? Math.round((latestMock.listeningRaw / latestMock.listeningMax) * 100)
            : undefined,
      },
      {
        label: 'Reading',
        band: latestMock.readingBand,
        rawAccuracyPct:
          latestMock.readingMax > 0
            ? Math.round((latestMock.readingRaw / latestMock.readingMax) * 100)
            : undefined,
      },
      { label: 'Writing', band: latestMock.writingBand },
      { label: 'Speaking', band: latestMock.speakingBand },
    ];
    const assessed = candidates.filter((c): c is { label: string; band: number; rawAccuracyPct?: number } => c.band !== null);
    assessed.sort((a, b) => a.band - b.band);
    const laggingIelts = assessed[0];
    if (laggingIelts && laggingIelts.band < ieltsTargetBand) {
      plan.push({
        id: 'plan-ielts-gap',
        title: `Target IELTS ${laggingIelts.label} Gap (Est. ${laggingIelts.band.toFixed(1)} vs ${ieltsTargetBand.toFixed(1)})`,
        reason: `${ieltsPathway === 'academic' ? 'Academic' : 'GT'} mock flagged ${laggingIelts.label} trailing target; run Strategy + Academy drills.`,
        route: '/ielts',
        estimatedMinutes: 12,
        priority: 'high',
        category: 'ielts',
      });
    } else if (assessed.length === 0) {
      const miniObjective = candidates
        .filter((c) => c.rawAccuracyPct !== undefined)
        .sort((a, b) => (a.rawAccuracyPct ?? 100) - (b.rawAccuracyPct ?? 100))[0];
      if (miniObjective && (miniObjective.rawAccuracyPct ?? 100) < 70) {
        plan.push({
          id: 'plan-ielts-gap',
          title: `Strengthen IELTS ${miniObjective.label} (${miniObjective.rawAccuracyPct}% raw check)`,
          reason: `Latest practice mini-mock showed ${miniObjective.rawAccuracyPct}% raw accuracy in ${miniObjective.label}; practice distractors or try a Full 40/40 Mock.`,
          route: '/ielts',
          estimatedMinutes: 12,
          priority: 'high',
          category: 'ielts',
        });
      }
    }
  } else if (purpose === 'ielts') {
    plan.push({
      id: 'plan-ielts-baseline',
      title: `Run ${ieltsPathway === 'academic' ? 'Academic' : 'GT'} Strategy & Mock Baseline`,
      reason: `Calibrate your starting unofficial band against Target ${ieltsTargetBand.toFixed(1)} inside IELTS Mastery Center.`,
      route: '/ielts',
      estimatedMinutes: 15,
      priority: 'high',
      category: 'ielts',
    });
  }

  const nowIso = new Date().toISOString();
  const dueVocabCount = Object.values(vocabularySchedules).filter((s) =>
    isDueForReview(s, nowIso),
  ).length;
  if (dueVocabCount > 0) {
    plan.push({
      id: 'plan-vocab',
      title: `SM-2 Flashcards (${Math.min(12, dueVocabCount)} due today)`,
      reason: 'Scheduled right before forgetting curve drop for long-term recall.',
      route: '/vocabulary',
      estimatedMinutes: 4,
      priority: 'medium',
      category: 'vocab',
    });
  }

  const skillRoutes: Record<SkillTag, string> = {
    listening: '/listening',
    speaking: '/speaking',
    reading: '/reading',
    writing: '/writing',
    vocabulary: '/vocabulary',
    grammar: '/grammar',
  };

  const sortedSkills = Object.values(skillStats).sort((a, b) => {
    const accA = a.attempts > 0 ? a.correct / a.attempts : 0;
    const accB = b.attempts > 0 ? b.correct / b.attempts : 0;
    if (a.minutesPracticed !== b.minutesPracticed) {
      return a.minutesPracticed - b.minutesPracticed;
    }
    return accA - accB;
  });

  const weakest = sortedSkills[0];
  if (weakest) {
    plan.push({
      id: `plan-weak-${weakest.skill}`,
      title: `Boost ${weakest.skill} practice`,
      reason:
        weakest.attempts === 0
          ? `Zero ${weakest.skill} sessions recorded yet—start one focused academy round.`
          : `Accuracy ${Math.round((weakest.correct / weakest.attempts) * 100)}% • ${weakest.minutesPracticed}m logged.`,
      route: skillRoutes[weakest.skill],
      estimatedMinutes: 6,
      priority: 'medium',
      category: 'skill',
    });
  }

  const nextLesson = findNextRecommendedLesson(lessonProgress, recommendedCefr);
  plan.push({
    id: 'plan-next-lesson',
    title: `CEFR Path (${recommendedCefr}): ${nextLesson.lesson.title}`,
    reason: `${nextLesson.unit.cefrLevel} • ${nextLesson.unit.title}`,
    route: CEFR_ORDER[recommendedCefr] >= 4 ? '/learn' : `/lesson/${nextLesson.lesson.id}`,
    estimatedMinutes: nextLesson.lesson.estimatedMinutes,
    priority: studyMinutesToday < dailyGoalMinutes ? 'high' : 'medium',
    category: 'cefr_path',
  });

  return plan.slice(0, 5);
}

export function getTodayMinutes(studyMinutesByDate: Record<string, number>): number {
  return studyMinutesByDate[toLocalDateKey()] ?? 0;
}
