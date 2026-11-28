import type {
  AssembledIELTSMockExam,
  CEFRLevel,
  ConversationScenario,
  CurriculumMatrixEntry,
  Exercise,
  GrammarTopic,
  IELTSIdeaVocabTopic,
  IELTSListeningActivity,
  IELTSMockExamManifest,
  IELTSPathway,
  IELTSReadingPassage,
  IELTSSpeakingActivity,
  IELTSStrategyLesson,
  IELTSWritingTask,
  IntegratedSequence,
  LearningResource,
  Lesson,
  ListeningContent,
  PronunciationLesson,
  ReadingPassage,
  ShadowingSession,
  SpeakingFrameworkGuide,
  SpeakingLesson,
  StructuredAssessment,
  ThematicCollection,
  ThinkInEnglishActivity,
  Unit,
  Vocabulary,
  WritingLesson,
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

function appendExtraExercises<T extends { id: string; exercises: E[] }, E>(
  items: T[],
  extra: Record<string, E[]>,
): T[] {
  return items.map((item) => {
    const addons = extra[item.id];
    return addons?.length ? { ...item, exercises: [...item.exercises, ...addons] } : item;
  });
}

async function mergeListeningParts(
  parts: Array<Promise<ListeningContent[]>>,
  includeBatch2AExt = true,
): Promise<ListeningContent[]> {
  const [loadedParts, extMap] = await Promise.all([
    Promise.all(parts),
    includeBatch2AExt
      ? import('./listening/drills_batch2a_ext').then((m) => m.EXTRA_LISTENING_DRILLS_BATCH2A)
      : Promise.resolve({} as Record<string, ListeningContent['exercises']>),
  ]);
  return appendExtraExercises(loadedParts.flat(), extMap);
}

const listeningLoaders: Record<CEFRLevel, () => Promise<ListeningContent[]>> = {
  A1: () =>
    mergeListeningParts([
      import('./listening/a1').then((m) => m.A1_LISTENING_LESSONS),
      import('./listening/a1_batch2').then((m) => m.A1_LISTENING_BATCH2),
    ]),
  A2: () =>
    mergeListeningParts([
      import('./listening/a2').then((m) => m.A2_LISTENING_LESSONS),
      import('./listening/a2_batch2').then((m) => m.A2_LISTENING_BATCH2),
    ]),
  B1: () =>
    mergeListeningParts([
      import('./listening/b1').then((m) => m.B1_LISTENING_LESSONS),
      import('./listening/b1_batch2').then((m) => m.B1_LISTENING_BATCH2),
    ]),
  B2: () =>
    mergeListeningParts([
      import('./listening/b2').then((m) => m.B2_LISTENING_LESSONS),
      import('./listening/b2_batch2a').then((m) => m.B2_LISTENING_BATCH2A),
      import('./listening/b2_batch2b').then((m) => m.B2_LISTENING_BATCH2B),
    ]),
  C1: () =>
    mergeListeningParts([
      import('./listening/c1').then((m) => m.C1_LISTENING_LESSONS),
      import('./listening/c1_batch2a').then((m) => m.C1_LISTENING_BATCH2A),
      import('./listening/c1_batch2b').then((m) => m.C1_LISTENING_BATCH2B),
    ]),
  C2: () =>
    mergeListeningParts([
      import('./listening/c2').then((m) => m.C2_LISTENING_LESSONS),
      import('./listening/c2_batch2').then((m) => m.C2_LISTENING_BATCH2),
    ]),
};

async function mergeSpeakingParts(parts: Array<Promise<SpeakingLesson[]>>): Promise<SpeakingLesson[]> {
  return (await Promise.all(parts)).flat();
}

const speakingLoaders: Record<CEFRLevel, () => Promise<SpeakingLesson[]>> = {
  A1: () =>
    mergeSpeakingParts([
      import('./speaking/a1').then((m) => m.A1_SPEAKING_LESSONS),
      import('./speaking/a1_batch2').then((m) => m.A1_SPEAKING_BATCH2),
    ]),
  A2: () =>
    mergeSpeakingParts([
      import('./speaking/a2').then((m) => m.A2_SPEAKING_LESSONS),
      import('./speaking/a2_batch2').then((m) => m.A2_SPEAKING_BATCH2),
    ]),
  B1: () =>
    mergeSpeakingParts([
      import('./speaking/b1').then((m) => m.B1_SPEAKING_LESSONS),
      import('./speaking/b1_batch2').then((m) => m.B1_SPEAKING_BATCH2),
    ]),
  B2: () =>
    mergeSpeakingParts([
      import('./speaking/b2').then((m) => m.B2_SPEAKING_LESSONS),
      import('./speaking/b2_batch2a').then((m) => m.B2_SPEAKING_BATCH2A),
      import('./speaking/b2_batch2b').then((m) => m.B2_SPEAKING_BATCH2B),
    ]),
  C1: () =>
    mergeSpeakingParts([
      import('./speaking/c1').then((m) => m.C1_SPEAKING_LESSONS),
      import('./speaking/c1_batch2a').then((m) => m.C1_SPEAKING_BATCH2A),
      import('./speaking/c1_batch2b').then((m) => m.C1_SPEAKING_BATCH2B),
    ]),
  C2: () =>
    mergeSpeakingParts([
      import('./speaking/c2').then((m) => m.C2_SPEAKING_LESSONS),
      import('./speaking/c2_batch2').then((m) => m.C2_SPEAKING_BATCH2),
    ]),
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
  const [p1, p2, p3, ext] = await Promise.all([
    import('./pronunciation/pack1_vowels_consonants').then((m) => m.PRONUNCIATION_PACK_1),
    import('./pronunciation/pack2_stress_rhythm_connected').then((m) => m.PRONUNCIATION_PACK_2),
    import('./pronunciation/pack3_connected_intonation_advanced').then((m) => m.PRONUNCIATION_PACK_3),
    import('./pronunciation/drills_ext').then((m) => m.EXTRA_PRONUNCIATION_DRILLS_BATCH2D),
  ]);
  return [...p1, ...p2, ...p3].map((lesson) => {
    const addons = ext[lesson.id];
    return addons?.length
      ? { ...lesson, listeningExercises: [...lesson.listeningExercises, ...addons] }
      : lesson;
  });
}

export async function loadShadowingSessions(): Promise<ShadowingSession[]> {
  const [b1, b2, b3] = await Promise.all([
    import('./shadowing/sessions_batch1').then((m) => m.SHADOWING_SESSIONS_BATCH1),
    import('./shadowing/sessions_batch2').then((m) => m.SHADOWING_SESSIONS_BATCH2),
    import('./shadowing/sessions_batch3').then((m) => m.SHADOWING_SESSIONS_BATCH3),
  ]);
  return [...b1, ...b2, ...b3];
}

export async function loadAllConversations(): Promise<ConversationScenario[]> {
  const [c1, c2, c3] = await Promise.all([
    import('./conversations/everyday_travel').then((m) => m.CONVERSATIONS_EVERYDAY_TRAVEL),
    import('./conversations/workplace_social').then((m) => m.CONVERSATIONS_WORKPLACE_SOCIAL),
    import('./conversations/academic_emergency').then((m) => m.CONVERSATIONS_ACADEMIC_EMERGENCY),
  ]);
  return [...c1, ...c2, ...c3];
}

export async function loadThinkInEnglish(): Promise<ThinkInEnglishActivity[]> {
  return import('./think-in-english/activities').then((m) => m.THINK_IN_ENGLISH_ACTIVITIES);
}

export async function loadIntegratedSequences(): Promise<IntegratedSequence[]> {
  return import('./integrated-learning/sequences').then((m) => m.INTEGRATED_LEARNING_SEQUENCES);
}

async function mergeReadingParts(
  parts: Array<Promise<ReadingPassage[]>>,
  loadExt: () => Promise<Record<string, ReadingPassage['questions']>>,
): Promise<ReadingPassage[]> {
  const [loadedParts, ext] = await Promise.all([Promise.all(parts), loadExt()]);
  return loadedParts.flat().map((passage) => {
    const addons = ext[passage.id];
    return addons?.length ? { ...passage, questions: [...passage.questions, ...addons] } : passage;
  });
}

const loadReadingExtA1B1 = () =>
  import('./reading/drills_ext_a').then((m) => m.EXTRA_READING_DRILLS_A1_B1);
const loadReadingExtB2C2 = () =>
  import('./reading/drills_ext_b').then((m) => m.EXTRA_READING_DRILLS_B2_C2);

const readingLoaders: Record<CEFRLevel, () => Promise<ReadingPassage[]>> = {
  A1: () => mergeReadingParts([import('./reading/a1').then((m) => m.A1_READING_PASSAGES)], loadReadingExtA1B1),
  A2: () => mergeReadingParts([import('./reading/a2').then((m) => m.A2_READING_PASSAGES)], loadReadingExtA1B1),
  B1: () =>
    mergeReadingParts(
      [
        import('./reading/b1_part1').then((m) => m.B1_READING_PART1),
        import('./reading/b1_part2').then((m) => m.B1_READING_PART2),
      ],
      loadReadingExtA1B1,
    ),
  B2: () =>
    mergeReadingParts(
      [
        import('./reading/b2_part1').then((m) => m.B2_READING_PART1),
        import('./reading/b2_part2').then((m) => m.B2_READING_PART2),
        import('./reading/b2_part3').then((m) => m.B2_READING_PART3),
      ],
      loadReadingExtB2C2,
    ),
  C1: () =>
    mergeReadingParts(
      [
        import('./reading/c1_part1').then((m) => m.C1_READING_PART1),
        import('./reading/c1_part2').then((m) => m.C1_READING_PART2),
      ],
      loadReadingExtB2C2,
    ),
  C2: () => mergeReadingParts([import('./reading/c2').then((m) => m.C2_READING_PASSAGES)], loadReadingExtB2C2),
};

export async function loadReadingByLevel(level: CEFRLevel): Promise<ReadingPassage[]> {
  return readingLoaders[level]();
}

export async function loadAllReading(): Promise<ReadingPassage[]> {
  const packs = await Promise.all(CEFR_LEVELS.map((lvl) => readingLoaders[lvl]()));
  return packs.flat();
}

const writingLoaders: Record<CEFRLevel, () => Promise<WritingLesson[]>> = {
  A1: () => import('./writing/a1').then((m) => m.A1_WRITING_LESSONS),
  A2: () => import('./writing/a2').then((m) => m.A2_WRITING_LESSONS),
  B1: () => import('./writing/b1').then((m) => m.B1_WRITING_LESSONS),
  B2: async () => {
    const [p1, p2] = await Promise.all([
      import('./writing/b2_part1').then((m) => m.B2_WRITING_PART1),
      import('./writing/b2_part2').then((m) => m.B2_WRITING_PART2),
    ]);
    return [...p1, ...p2];
  },
  C1: async () => {
    const [p1, p2] = await Promise.all([
      import('./writing/c1_part1').then((m) => m.C1_WRITING_PART1),
      import('./writing/c1_part2').then((m) => m.C1_WRITING_PART2),
    ]);
    return [...p1, ...p2];
  },
  C2: () => import('./writing/c2').then((m) => m.C2_WRITING_LESSONS),
};

export async function loadWritingByLevel(level: CEFRLevel): Promise<WritingLesson[]> {
  return writingLoaders[level]();
}

export async function loadAllWriting(): Promise<WritingLesson[]> {
  const packs = await Promise.all(CEFR_LEVELS.map((lvl) => writingLoaders[lvl]()));
  return packs.flat();
}

const curriculumUnitLoaders: Record<CEFRLevel, () => Promise<Unit[]>> = {
  A1: () => import('./curriculum/a1_advanced').then((m) => m.A1_ADVANCED_UNITS),
  A2: () => import('./curriculum/a2_advanced').then((m) => m.A2_ADVANCED_UNITS),
  B1: () => import('./curriculum/b1_advanced').then((m) => m.B1_ADVANCED_UNITS),
  B2: async () => {
    const [p1, p2] = await Promise.all([
      import('./curriculum/b2_part1').then((m) => m.B2_UNITS_PART1),
      import('./curriculum/b2_part2').then((m) => m.B2_UNITS_PART2),
    ]);
    return [...p1, ...p2];
  },
  C1: async () => {
    const [p1, p2] = await Promise.all([
      import('./curriculum/c1_part1').then((m) => m.C1_UNITS_PART1),
      import('./curriculum/c1_part2').then((m) => m.C1_UNITS_PART2),
    ]);
    return [...p1, ...p2];
  },
  C2: async () => {
    const [p1, p2] = await Promise.all([
      import('./curriculum/c2_part1').then((m) => m.C2_UNITS_PART1),
      import('./curriculum/c2_part2').then((m) => m.C2_UNITS_PART2),
    ]);
    return [...p1, ...p2];
  },
};

export async function loadCurriculumUnitsByLevel(level: CEFRLevel): Promise<Unit[]> {
  return curriculumUnitLoaders[level]();
}

export async function loadAllCurriculumUnits(): Promise<Unit[]> {
  const packs = await Promise.all(CEFR_LEVELS.map((lvl) => curriculumUnitLoaders[lvl]()));
  return packs.flat();
}

export async function loadCurriculumLessonById(
  lessonId: string,
): Promise<{ unit: Unit; lesson: Lesson } | null> {
  const match = lessonId.match(/^(a1|a2|b1|b2|c1|c2)-/i);
  if (match) {
    const level = match[1].toUpperCase() as CEFRLevel;
    const units = await loadCurriculumUnitsByLevel(level);
    for (const unit of units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return { unit, lesson };
    }
  }
  const all = await loadAllCurriculumUnits();
  for (const unit of all) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return { unit, lesson };
  }
  return null;
}

const unitAssessmentLoaders: Record<CEFRLevel, () => Promise<StructuredAssessment[]>> = {
  A1: () =>
    import('./assessments/unit_assessments_a1_b1').then((m) =>
      m.UNIT_ASSESSMENTS_A1_B1.filter((a) => a.cefrLevel === 'A1'),
    ),
  A2: () =>
    import('./assessments/unit_assessments_a1_b1').then((m) =>
      m.UNIT_ASSESSMENTS_A1_B1.filter((a) => a.cefrLevel === 'A2'),
    ),
  B1: () =>
    import('./assessments/unit_assessments_a1_b1').then((m) =>
      m.UNIT_ASSESSMENTS_A1_B1.filter((a) => a.cefrLevel === 'B1'),
    ),
  B2: () => import('./assessments/unit_assessments_b2').then((m) => m.UNIT_ASSESSMENTS_B2),
  C1: () => import('./assessments/unit_assessments_c1').then((m) => m.UNIT_ASSESSMENTS_C1),
  C2: () => import('./assessments/unit_assessments_c2').then((m) => m.UNIT_ASSESSMENTS_C2),
};

export async function loadUnitAssessmentsByLevel(
  level: CEFRLevel,
): Promise<StructuredAssessment[]> {
  return unitAssessmentLoaders[level]();
}

export async function loadLevelAndDiagnosticAssessments(): Promise<StructuredAssessment[]> {
  return import('./assessments/cefr_level_exams').then((m) => m.CEFR_LEVEL_AND_DIAGNOSTIC_EXAMS);
}

export async function loadAllAssessments(): Promise<StructuredAssessment[]> {
  const [a1b1, b2, c1, c2, exams] = await Promise.all([
    import('./assessments/unit_assessments_a1_b1').then((m) => m.UNIT_ASSESSMENTS_A1_B1),
    import('./assessments/unit_assessments_b2').then((m) => m.UNIT_ASSESSMENTS_B2),
    import('./assessments/unit_assessments_c1').then((m) => m.UNIT_ASSESSMENTS_C1),
    import('./assessments/unit_assessments_c2').then((m) => m.UNIT_ASSESSMENTS_C2),
    import('./assessments/cefr_level_exams').then((m) => m.CEFR_LEVEL_AND_DIAGNOSTIC_EXAMS),
  ]);
  return [...a1b1, ...b2, ...c1, ...c2, ...exams];
}

export async function loadAssessmentById(id: string): Promise<StructuredAssessment | null> {
  if (id.startsWith('unit-assess-')) {
    const match = id.match(/^unit-assess-(a1|a2|b1|b2|c1|c2)-/i);
    if (match) {
      const lvl = match[1].toUpperCase() as CEFRLevel;
      const items = await loadUnitAssessmentsByLevel(lvl);
      const found = items.find((a) => a.id === id);
      if (found) return found;
    }
  }
  const exams = await loadLevelAndDiagnosticAssessments();
  const examHit = exams.find((a) => a.id === id);
  if (examHit) return examHit;

  const all = await loadAllAssessments();
  return all.find((a) => a.id === id) ?? null;
}

/**
 * Lazy loaders for Milestone 3 Batch 3B IELTS Mastery Center Academies.
 */
export async function loadIeltsListening(): Promise<IELTSListeningActivity[]> {
  const [p12, p34] = await Promise.all([
    import('./ielts/listening_p1_p2').then((m) => m.IELTS_LISTENING_P1_P2),
    import('./ielts/listening_p3_p4').then((m) => m.IELTS_LISTENING_P3_P4),
  ]);
  return [...p12, ...p34];
}

export async function loadIeltsSpeaking(): Promise<IELTSSpeakingActivity[]> {
  const [p1, p23] = await Promise.all([
    import('./ielts/speaking_p1').then((m) => m.IELTS_SPEAKING_PART1),
    import('./ielts/speaking_p2_p3').then((m) => m.IELTS_SPEAKING_PART2_PART3),
  ]);
  return [...p1, ...p23];
}

export async function loadIeltsReading(pathway?: IELTSPathway): Promise<IELTSReadingPassage[]> {
  if (pathway === 'general_training') {
    return import('./ielts/reading_gt').then((m) => m.IELTS_READING_GT);
  }
  const [acA, acB] = await Promise.all([
    import('./ielts/reading_academic_a').then((m) => m.IELTS_READING_ACADEMIC_A),
    import('./ielts/reading_academic_b').then((m) => m.IELTS_READING_ACADEMIC_B),
  ]);
  if (pathway === 'academic') {
    return [...acA, ...acB];
  }
  const gt = await import('./ielts/reading_gt').then((m) => m.IELTS_READING_GT);
  return [...acA, ...acB, ...gt];
}

export async function loadIeltsWriting(pathway?: IELTSPathway): Promise<IELTSWritingTask[]> {
  const [t1, t2] = await Promise.all([
    import('./ielts/writing_task1').then((m) => m.IELTS_WRITING_TASK1),
    import('./ielts/writing_task2').then((m) => m.IELTS_WRITING_TASK2),
  ]);
  const all = [...t1, ...t2];
  if (!pathway) return all;
  return all.filter((w) => w.pathway === 'shared' || w.pathway === pathway);
}

export async function loadIeltsIdeaBanks(): Promise<IELTSIdeaVocabTopic[]> {
  return import('./ielts/vocabulary_ideas').then((m) => m.IELTS_TOPIC_IDEA_BANKS);
}

/**
 * Lazy loaders for Milestone 3 Batch 3C IELTS Strategy Academy & Timed Mock Exams.
 */
export async function loadIeltsStrategies(): Promise<IELTSStrategyLesson[]> {
  return import('./ielts/strategy_lessons').then((m) => m.IELTS_STRATEGY_LESSONS);
}

export async function loadIeltsMockManifests(): Promise<IELTSMockExamManifest[]> {
  return import('./ielts/mock_exams').then((m) => m.IELTS_MOCK_EXAMS);
}

export async function assembleIeltsMockExamById(mockId: string): Promise<AssembledIELTSMockExam | null> {
  const manifests = await loadIeltsMockManifests();
  const manifest = manifests.find((m) => m.id === mockId);
  if (!manifest) return null;

  const [listening, reading, writing, speaking] = await Promise.all([
    loadIeltsListening(),
    loadIeltsReading(manifest.pathway),
    loadIeltsWriting(manifest.pathway),
    loadIeltsSpeaking(),
  ]);

  const lMap = new Map(listening.map((x) => [x.id, x]));
  const rMap = new Map(reading.map((x) => [x.id, x]));
  const wMap = new Map(writing.map((x) => [x.id, x]));
  const sMap = new Map(speaking.map((x) => [x.id, x]));

  const listeningParts = manifest.listeningIds.map((id) => lMap.get(id)).filter(Boolean) as IELTSListeningActivity[];
  const readingPassages = manifest.readingIds.map((id) => rMap.get(id)).filter(Boolean) as IELTSReadingPassage[];
  const writingTask1 = wMap.get(manifest.writingTask1Id);
  const writingTask2 = wMap.get(manifest.writingTask2Id);
  const speakingParts = manifest.speakingPartIds.map((id) => sMap.get(id)).filter(Boolean) as IELTSSpeakingActivity[];

  if (!writingTask1 || !writingTask2) return null;
  return {
    manifest,
    listeningParts,
    readingPassages,
    writingTask1,
    writingTask2,
    speakingParts,
  };
}

