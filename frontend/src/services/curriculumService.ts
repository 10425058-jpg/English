import type {
  CEFRLevel,
  DailyGoalMinutes,
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
import { ALL_UNITS, CURRICULUM_SECTIONS } from '@/data/curriculum';

export function getAllSections() {
  return CURRICULUM_SECTIONS;
}

export function getUnitsByCefr(level: CEFRLevel): Unit[] {
  return ALL_UNITS.filter((u) => u.cefrLevel === level);
}

export function getLessonById(lessonId: string): { unit: Unit; lesson: Lesson } | null {
  for (const unit of ALL_UNITS) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return { unit, lesson };
  }
  return null;
}

/**
 * Computes interactive path node state (`locked` | `available` | `completed` | `mastered`).
 * Learners placed at A2/B1 automatically unlock earlier levels while keeping sequential pacing inside their tier.
 */
export function getLessonNodeState(
  lesson: Lesson,
  unit: Unit,
  lessonProgress: Record<string, LessonProgress>,
  recommendedCefr: CEFRLevel
): NodeState {
  const existing = lessonProgress[lesson.id];
  if (existing) {
    return existing.status === 'mastered' ? 'mastered' : 'completed';
  }

  // First lesson of any unit at or below recommended CEFR is immediately available
  const levelRank: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  if (lesson.orderIndex === 1 && levelRank[unit.cefrLevel] <= levelRank[recommendedCefr]) {
    return 'available';
  }

  // First lesson of a unit unlocks once previous unit has at least 2 lessons completed, OR allow unit preview
  const unitIdx = ALL_UNITS.findIndex((u) => u.id === unit.id);
  if (lesson.orderIndex === 1) {
    if (unitIdx <= 0) return 'available';
    const prevUnit = ALL_UNITS[unitIdx - 1];
    const prevCompleted = prevUnit.lessons.filter((l) => Boolean(lessonProgress[l.id])).length;
    return prevCompleted >= 2 ? 'available' : 'locked';
  }

  const prevLesson = unit.lessons.find((l) => l.orderIndex === lesson.orderIndex - 1);
  if (prevLesson && lessonProgress[prevLesson.id]) {
    return 'available';
  }

  return 'locked';
}

export function isUnitChestUnlocked(
  unit: Unit,
  lessonProgress: Record<string, LessonProgress>
): boolean {
  return unit.lessons.every((l) => Boolean(lessonProgress[l.id]));
}

export function findNextRecommendedLesson(
  lessonProgress: Record<string, LessonProgress>,
  recommendedCefr: CEFRLevel
): { unit: Unit; lesson: Lesson } {
  const preferredUnits = ALL_UNITS.filter((u) => u.cefrLevel === recommendedCefr);
  const orderedUnits = [
    ...preferredUnits,
    ...ALL_UNITS.filter((u) => u.cefrLevel !== recommendedCefr),
  ];

  for (const unit of orderedUnits) {
    for (const lesson of unit.lessons) {
      if (!lessonProgress[lesson.id]) {
        return { unit, lesson };
      }
    }
  }
  return { unit: ALL_UNITS[0], lesson: ALL_UNITS[0].lessons[0] };
}

export interface PersonalizedPlanItem {
  id: string;
  title: string;
  reason: string;
  route: string;
  estimatedMinutes: number;
  priority: 'high' | 'medium';
}

export function buildPersonalizedDailyPlan(params: {
  skillStats: Record<SkillTag, SkillProgress>;
  mistakes: Mistake[];
  vocabularySchedules: Record<string, ReviewSchedule>;
  lessonProgress: Record<string, LessonProgress>;
  recommendedCefr: CEFRLevel;
  dailyGoalMinutes: DailyGoalMinutes;
  studyMinutesToday: number;
}): PersonalizedPlanItem[] {
  const {
    skillStats,
    mistakes,
    vocabularySchedules,
    lessonProgress,
    recommendedCefr,
    dailyGoalMinutes,
    studyMinutesToday,
  } = params;

  const plan: PersonalizedPlanItem[] = [];
  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);
  if (unresolvedMistakes.length > 0) {
    plan.push({
      id: 'plan-mistakes',
      title: `Review ${unresolvedMistakes.length} unresolved mistake${unresolvedMistakes.length > 1 ? 's' : ''}`,
      reason: 'Targeted retry turns past errors into mastery.',
      route: '/review',
      estimatedMinutes: 3,
      priority: 'high',
    });
  }

  const nowIso = new Date().toISOString();
  const dueVocabCount = Object.values(vocabularySchedules).filter((s) =>
    isDueForReview(s, nowIso)
  ).length;
  if (dueVocabCount > 0) {
    plan.push({
      id: 'plan-vocab',
      title: `SM-2 Flashcards (${Math.min(10, dueVocabCount)} due today)`,
      reason: 'Scheduled right before forgetting for maximum memory retention.',
      route: '/vocabulary',
      estimatedMinutes: 4,
      priority: 'high',
    });
  }

  // Weakest skill recommendation derived from real stats
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
          ? `You haven't logged ${weakest.skill} activity yet.`
          : `Accuracy ${Math.round((weakest.correct / weakest.attempts) * 100)}% • ${weakest.minutesPracticed}m practiced.`,
      route: skillRoutes[weakest.skill],
      estimatedMinutes: 5,
      priority: 'medium',
    });
  }

  const nextLesson = findNextRecommendedLesson(lessonProgress, recommendedCefr);
  plan.push({
    id: 'plan-next-lesson',
    title: `Next Path Lesson: ${nextLesson.lesson.title}`,
    reason: `${nextLesson.unit.cefrLevel} • ${nextLesson.unit.title}`,
    route: `/lesson/${nextLesson.lesson.id}`,
    estimatedMinutes: nextLesson.lesson.estimatedMinutes,
    priority: studyMinutesToday < dailyGoalMinutes ? 'high' : 'medium',
  });

  return plan.slice(0, 4);
}

export function getTodayMinutes(studyMinutesByDate: Record<string, number>): number {
  return studyMinutesByDate[toLocalDateKey()] ?? 0;
}
