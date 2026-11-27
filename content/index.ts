import type {
  CEFRLevel,
  CurriculumMatrixEntry,
  Exercise,
  GrammarTopic,
  LearningResource,
  ListeningContent,
  PronunciationLesson,
  ShadowingSession,
  SpeakingFrameworkGuide,
  SpeakingLesson,
  ThematicCollection,
  Vocabulary,
} from '@english-quest/shared';

export const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const vocabLoaders: Record<CEFRLevel, () => Promise<Vocabulary[]>> = {
  A1: () => import('./vocabulary/a1').then((m) => m.A1_VOCABULARY),
  A2: () => import('./vocabulary/a2').then((m) => m.A2_VOCABULARY),
  B1: () => import('./vocabulary/b1').then((m) => m.B1_VOCABULARY),
  B2: () => import('./vocabulary/b2').then((m) => m.B2_VOCABULARY),
  C1: () => import('./vocabulary/c1').then((m) => m.C1_VOCABULARY),
  C2: () => import('./vocabulary/c2').then((m) => m.C2_VOCABULARY),
};

const grammarLoaders: Record<CEFRLevel, () => Promise<GrammarTopic[]>> = {
  A1: () => import('./grammar/a1').then((m) => m.A1_GRAMMAR_TOPICS),
  A2: () => import('./grammar/a2').then((m) => m.A2_GRAMMAR_TOPICS),
  B1: () => import('./grammar/b1').then((m) => m.B1_GRAMMAR_TOPICS),
  B2: () => import('./grammar/b2').then((m) => m.B2_GRAMMAR_TOPICS),
  C1: () => import('./grammar/c1').then((m) => m.C1_GRAMMAR_TOPICS),
  C2: () => import('./grammar/c2').then((m) => m.C2_GRAMMAR_TOPICS),
};

const exerciseLoaders: Record<CEFRLevel, () => Promise<Exercise[]>> = {
  A1: () => import('./exercises/a1').then((m) => m.A1_EXERCISE_BANK),
  A2: () => import('./exercises/a2').then((m) => m.A2_EXERCISE_BANK),
  B1: () => import('./exercises/b1').then((m) => m.B1_EXERCISE_BANK),
  B2: () => import('./exercises/b2').then((m) => m.B2_EXERCISE_BANK),
  C1: () => import('./exercises/c1').then((m) => m.C1_EXERCISE_BANK),
  C2: () => import('./exercises/c2').then((m) => m.C2_EXERCISE_BANK),
};

export async function loadVocabularyByLevel(level: CEFRLevel): Promise<Vocabulary[]> {
  return vocabLoaders[level]();
}

export async function loadAllVocabulary(): Promise<Vocabulary[]> {
  const packs = await Promise.all(CEFR_LEVELS.map((lvl) => vocabLoaders[lvl]()));
  return packs.flat();
}

export async function loadGrammarByLevel(level: CEFRLevel): Promise<GrammarTopic[]> {
  return grammarLoaders[level]();
}

export async function loadAllGrammar(): Promise<GrammarTopic[]> {
  const packs = await Promise.all(CEFR_LEVELS.map((lvl) => grammarLoaders[lvl]()));
  return packs.flat();
}

export async function loadExercisesByLevel(level: CEFRLevel): Promise<Exercise[]> {
  return exerciseLoaders[level]();
}

export async function loadAllExercises(): Promise<Exercise[]> {
  const packs = await Promise.all(CEFR_LEVELS.map((lvl) => exerciseLoaders[lvl]()));
  return packs.flat();
}

export async function loadThematicCollections(): Promise<ThematicCollection[]> {
  return import('./collections/thematicCollections').then((m) => m.THEMATIC_COLLECTIONS);
}

export async function loadLearningResources(): Promise<LearningResource[]> {
  return import('./resources/learningResources').then((m) => m.CURATED_LEARNING_RESOURCES);
}

export async function loadCurriculumMatrix(): Promise<CurriculumMatrixEntry[]> {
  return import('./curriculum/matrix').then((m) => m.CURRICULUM_MATRIX);
}

const listeningLoaders: Record<CEFRLevel, () => Promise<ListeningContent[]>> = {
  A1: () => import('./listening/a1').then((m) => m.A1_LISTENING_LESSONS),
  A2: () => import('./listening/a2').then((m) => m.A2_LISTENING_LESSONS),
  B1: () => import('./listening/b1').then((m) => m.B1_LISTENING_LESSONS),
  B2: () => import('./listening/b2').then((m) => m.B2_LISTENING_LESSONS),
  C1: () => import('./listening/c1').then((m) => m.C1_LISTENING_LESSONS),
  C2: () => import('./listening/c2').then((m) => m.C2_LISTENING_LESSONS),
};

const speakingLoaders: Record<CEFRLevel, () => Promise<SpeakingLesson[]>> = {
  A1: () => import('./speaking/a1').then((m) => m.A1_SPEAKING_LESSONS),
  A2: () => import('./speaking/a2').then((m) => m.A2_SPEAKING_LESSONS),
  B1: () => import('./speaking/b1').then((m) => m.B1_SPEAKING_LESSONS),
  B2: () => import('./speaking/b2').then((m) => m.B2_SPEAKING_LESSONS),
  C1: () => import('./speaking/c1').then((m) => m.C1_SPEAKING_LESSONS),
  C2: () => import('./speaking/c2').then((m) => m.C2_SPEAKING_LESSONS),
};

export async function loadListeningByLevel(level: CEFRLevel): Promise<ListeningContent[]> {
  return listeningLoaders[level]();
}

export async function loadAllListening(): Promise<ListeningContent[]> {
  const packs = await Promise.all(CEFR_LEVELS.map((lvl) => listeningLoaders[lvl]()));
  return packs.flat();
}

export async function loadSpeakingByLevel(level: CEFRLevel): Promise<SpeakingLesson[]> {
  return speakingLoaders[level]();
}

export async function loadAllSpeaking(): Promise<SpeakingLesson[]> {
  const packs = await Promise.all(CEFR_LEVELS.map((lvl) => speakingLoaders[lvl]()));
  return packs.flat();
}

export async function loadSpeakingMindsetGuides(): Promise<SpeakingFrameworkGuide[]> {
  return import('./speaking/guides').then((m) => m.SPEAKING_MINDSET_GUIDES);
}

export async function loadPronunciationLessons(): Promise<PronunciationLesson[]> {
  const [p1, p2] = await Promise.all([
    import('./pronunciation/pack1_vowels_consonants').then((m) => m.PRONUNCIATION_PACK_1),
    import('./pronunciation/pack2_stress_rhythm_connected').then((m) => m.PRONUNCIATION_PACK_2),
  ]);
  return [...p1, ...p2];
}

export async function loadShadowingSessions(): Promise<ShadowingSession[]> {
  return import('./shadowing/sessions_batch1').then((m) => m.SHADOWING_SESSIONS_BATCH1);
}
