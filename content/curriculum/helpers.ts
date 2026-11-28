import type {
  CEFRLevel,
  Exercise,
  ExerciseType,
  Lesson,
  LessonNodeType,
  ReusedExerciseReference,
  SkillTag,
  Unit,
} from '@english-quest/shared';

interface CurriculumExerciseSeed {
  id: string;
  lessonId: string;
  type: ExerciseType;
  instruction: string;
  prompt: string;
  promptTranslationVi?: string;
  passage?: string;
  audioText?: string;
  dialogueContext?: Array<{ speaker: string; line: string }>;
  options?: string[];
  wordBank?: string[];
  correctAnswer: string | string[];
  acceptableAnswers?: string[];
  minWords?: number;
  requiredKeywords?: string[];
  hint?: string;
  explanation: string;
  explanationVi?: string;
  difficulty: 1 | 2 | 3;
  skills: SkillTag[];
  xpReward?: number;
  relatedKnowledgeId?: string;
  reviewRecommendation?: string;
}

/** Creates a typed curriculum exercise for structured CEFR units and assessments. */
export function cEx(seed: CurriculumExerciseSeed): Exercise {
  return {
    ...seed,
    xpReward: seed.xpReward ?? (seed.difficulty === 3 ? 16 : seed.difficulty === 2 ? 14 : 12),
  };
}

export interface CurriculumLessonSeed {
  id: string;
  unitId: string;
  orderIndex: number;
  title: string;
  subtitle: string;
  nodeType: LessonNodeType;
  cefrLevel: CEFRLevel;
  skills: SkillTag[];
  primarySkill: SkillTag | 'pronunciation' | 'review' | 'assessment';
  estimatedMinutes?: number;
  xpReward?: number;
  instructionalOverview: string;
  instructionalOverviewVi: string;
  learningObjectives: string[];
  prerequisites: string[];
  targetVocabIds: string[];
  targetGrammarIds: string[];
  contextualExamples: Array<{ english: string; vietnamese?: string; note?: string }>;
  guidedPracticeNote: string;
  practicalApplication: {
    summary: string;
    route: string;
    label: string;
    linkedAcademyId?: string;
  };
  lessonSummary: string;
  reviewRecommendations: string[];
  topicTags: string[];
  assessmentCriteria?: string[];
  reusedExerciseRefs?: ReusedExerciseReference[];
  exercises: Exercise[];
}

/** Builds a pedagogically complete learning-path lesson linking existing academies cleanly. */
export function createCurriculumLesson(seed: CurriculumLessonSeed): Lesson {
  return {
    id: seed.id,
    unitId: seed.unitId,
    orderIndex: seed.orderIndex,
    title: seed.title,
    subtitle: seed.subtitle,
    nodeType: seed.nodeType,
    cefrLevel: seed.cefrLevel,
    skills: seed.skills,
    primarySkill: seed.primarySkill,
    xpReward: seed.xpReward ?? (seed.nodeType === 'checkpoint' ? 45 : 30),
    estimatedMinutes: seed.estimatedMinutes ?? (seed.nodeType === 'checkpoint' ? 10 : 7),
    instructionalOverview: seed.instructionalOverview,
    instructionalOverviewVi: seed.instructionalOverviewVi,
    learningObjectives: seed.learningObjectives,
    prerequisites: seed.prerequisites,
    targetVocabIds: seed.targetVocabIds,
    targetGrammarIds: seed.targetGrammarIds,
    contextualExamples: seed.contextualExamples,
    guidedPracticeNote: seed.guidedPracticeNote,
    practicalApplication: seed.practicalApplication,
    lessonSummary: seed.lessonSummary,
    reviewRecommendations: seed.reviewRecommendations,
    topicTags: seed.topicTags,
    assessmentCriteria: seed.assessmentCriteria,
    reusedExerciseRefs: seed.reusedExerciseRefs,
    exercises: seed.exercises,
  };
}

export interface CurriculumUnitSeed {
  id: string;
  cefrLevel: CEFRLevel;
  orderIndex: number;
  title: string;
  description: string;
  themeColor: string;
  guideSummary: string;
  keyGrammar: string[];
  keyVocabulary: string[];
  chestRewardGems?: number;
  chestRewardXp?: number;
  prerequisites: string[];
  prerequisiteUnitIds: string[];
  masteryAssessmentId: string;
  targetVocabIds: string[];
  targetGrammarIds: string[];
  linkedListeningIds: string[];
  linkedSpeakingIds: string[];
  linkedReadingIds: string[];
  linkedWritingIds: string[];
  linkedConversationIds?: string[];
  linkedPronunciationIds?: string[];
  lessons: Lesson[];
}

/** Builds a complete Milestone 3 structured CEFR unit (with 6 lessons and linked academy IDs). */
export function createCurriculumUnit(seed: CurriculumUnitSeed): Unit {
  return {
    id: seed.id,
    sectionId: `sec-${seed.cefrLevel.toLowerCase()}`,
    cefrLevel: seed.cefrLevel,
    orderIndex: seed.orderIndex,
    title: seed.title,
    description: seed.description,
    themeColor: seed.themeColor,
    guideSummary: seed.guideSummary,
    keyGrammar: seed.keyGrammar,
    keyVocabulary: seed.keyVocabulary,
    chestRewardGems: seed.chestRewardGems ?? (seed.cefrLevel === 'C2' || seed.cefrLevel === 'C1' ? 40 : 30),
    chestRewardXp: seed.chestRewardXp ?? (seed.cefrLevel === 'C2' || seed.cefrLevel === 'C1' ? 50 : 40),
    prerequisites: seed.prerequisites,
    prerequisiteUnitIds: seed.prerequisiteUnitIds,
    masteryAssessmentId: seed.masteryAssessmentId,
    targetVocabIds: seed.targetVocabIds,
    targetGrammarIds: seed.targetGrammarIds,
    linkedListeningIds: seed.linkedListeningIds,
    linkedSpeakingIds: seed.linkedSpeakingIds,
    linkedReadingIds: seed.linkedReadingIds,
    linkedWritingIds: seed.linkedWritingIds,
    linkedConversationIds: seed.linkedConversationIds,
    linkedPronunciationIds: seed.linkedPronunciationIds,
    sourceTier: 'milestone3',
    lessons: seed.lessons,
  };
}
