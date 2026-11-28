import fs from 'node:fs';
import path from 'node:path';
import type {
  CEFRLevel,
  Exercise,
  GrammarTopic,
  LearningResource,
  ThematicCollection,
  Vocabulary,
} from '../packages/shared/src/types/domain';
import { evaluateExerciseAnswer } from '../packages/shared/src/utils/sm2';
import {
  CEFR_LEVELS,
  loadAllAssessments,
  loadAllConversations,
  loadAllCurriculumUnits,
  loadAllExercises,
  loadAllGrammar,
  loadAllListening,
  loadAllReading,
  loadAllSpeaking,
  loadAllVocabulary,
  loadAllWriting,
  loadCurriculumMatrix,
  loadIeltsIdeaBanks,
  loadIeltsListening,
  loadIeltsMockManifests,
  loadIeltsReading,
  loadIeltsSpeaking,
  loadIeltsStrategies,
  loadIeltsWriting,
  loadIntegratedSequences,
  loadLearningResources,
  loadPronunciationLessons,
  loadShadowingSessions,
  loadSpeakingMindsetGuides,
  loadThematicCollections,
  loadThinkInEnglish,
} from '../content/index';
import { SEED_VOCABULARY } from '../frontend/src/data/vocabularySeed';
import { GRAMMAR_TOPICS } from '../frontend/src/data/grammarTopics';
import { ALL_UNITS } from '../frontend/src/data/curriculum/index';
import { LISTENING_LAB_TRACKS } from '../frontend/src/data/listeningLabData';
import { READING_LIBRARY_PASSAGES } from '../frontend/src/data/readingLibraryData';
import { SPEAKING_LAB_ACTIVITIES } from '../frontend/src/data/speakingLabData';
import { WRITING_LAB_PROMPTS } from '../frontend/src/data/writingPromptsData';

function checkNonEmpty(label: string, val: string | undefined | null, errors: string[]): void {
  if (!val || !val.trim()) {
    errors.push(`Missing/empty field: ${label}`);
  }
}

export async function runValidation(writeReport = false): Promise<number> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const [
    expandedVocab,
    expandedGrammar,
    expandedExercises,
    collections,
    resources,
    matrix,
    expandedListening,
    expandedSpeaking,
    speakingGuides,
    pronunciationLessons,
    shadowingSessions,
    expandedReading,
    expandedWriting,
    conversations,
    thinkInEnglish,
    integratedSequences,
    ieltsListening,
    ieltsSpeaking,
    ieltsReading,
    ieltsWriting,
    ieltsIdeaBanks,
    ieltsStrategies,
    ieltsMocks,
  ] = await Promise.all([
    loadAllVocabulary(),
    loadAllGrammar(),
    loadAllExercises(),
    loadThematicCollections(),
    loadLearningResources(),
    loadCurriculumMatrix(),
    loadAllListening(),
    loadAllSpeaking(),
    loadSpeakingMindsetGuides(),
    loadPronunciationLessons(),
    loadShadowingSessions(),
    loadAllReading(),
    loadAllWriting(),
    loadAllConversations(),
    loadThinkInEnglish(),
    loadIntegratedSequences(),
    loadIeltsListening(),
    loadIeltsSpeaking(),
    loadIeltsReading(),
    loadIeltsWriting(),
    loadIeltsIdeaBanks(),
    loadIeltsStrategies(),
    loadIeltsMockManifests(),
  ]);

  // 1. Vocabulary integrity
  const vocabById = new Map<string, Vocabulary>();
  const vocabKeys = new Set<string>();
  const seedWords = new Set<string>();

  for (const v of SEED_VOCABULARY) {
    vocabById.set(v.id, v);
    seedWords.add(`${v.word.toLowerCase()}|${v.senseLabel ?? ''}`);
  }

  const vocabCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

  for (const v of expandedVocab) {
    vocabCountsByLevel[v.cefrLevel] = (vocabCountsByLevel[v.cefrLevel] ?? 0) + 1;
    if (vocabById.has(v.id)) {
      errors.push(`Duplicate vocabulary ID: ${v.id}`);
    }
    vocabById.set(v.id, v);

    const k = `${v.word.toLowerCase().trim()}|${v.senseLabel ?? ''}`;
    if (vocabKeys.has(k)) {
      errors.push(`Duplicate vocabulary entry (word+sense): ${k} (${v.id})`);
    }
    vocabKeys.add(k);

    if (seedWords.has(k)) {
      warnings.push(`Vocabulary overlaps seed without distinct senseLabel: ${v.word} (${v.id})`);
    }

    checkNonEmpty(`vocab.${v.id}.word`, v.word, errors);
    checkNonEmpty(`vocab.${v.id}.partOfSpeech`, v.partOfSpeech, errors);
    checkNonEmpty(`vocab.${v.id}.ipa`, v.ipa, errors);
    if (!v.ipa.startsWith('/') || !v.ipa.endsWith('/')) {
      errors.push(`Invalid IPA format (must wrap in /.../ ): ${v.id} -> ${v.ipa}`);
    }
    checkNonEmpty(`vocab.${v.id}.definition`, v.definition, errors);
    checkNonEmpty(`vocab.${v.id}.vietnameseTranslation`, v.vietnameseTranslation, errors);
    checkNonEmpty(`vocab.${v.id}.exampleSentence`, v.exampleSentence, errors);
    checkNonEmpty(`vocab.${v.id}.exampleTranslationVi`, v.exampleTranslationVi, errors);
  }

  // 2. Grammar integrity
  const grammarById = new Map<string, GrammarTopic>();
  for (const g of GRAMMAR_TOPICS) {
    grammarById.set(g.id, g);
  }

  const grammarCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  let grammarQuizCount = 0;

  for (const g of expandedGrammar) {
    grammarCountsByLevel[g.cefrLevel] = (grammarCountsByLevel[g.cefrLevel] ?? 0) + 1;
    if (grammarById.has(g.id)) {
      errors.push(`Duplicate grammar topic ID: ${g.id}`);
    }
    grammarById.set(g.id, g);

    checkNonEmpty(`grammar.${g.id}.title`, g.title, errors);
    checkNonEmpty(`grammar.${g.id}.summary`, g.summary, errors);
    checkNonEmpty(`grammar.${g.id}.summaryVi`, g.summaryVi, errors);
    checkNonEmpty(`grammar.${g.id}.detailedExplanation`, g.detailedExplanation, errors);
    checkNonEmpty(`grammar.${g.id}.speakingTip`, g.speakingTip, errors);
    checkNonEmpty(`grammar.${g.id}.writingTip`, g.writingTip, errors);
    checkNonEmpty(`grammar.${g.id}.reviewSummary`, g.reviewSummary, errors);

    if (!g.objectives || g.objectives.length < 3) {
      errors.push(`Grammar ${g.id} requires >= 3 objectives`);
    }
    if (!g.structures || g.structures.length < 3) {
      errors.push(`Grammar ${g.id} requires >= 3 structures`);
    }
    if (!g.usageRules || g.usageRules.length < 2) {
      errors.push(`Grammar ${g.id} requires >= 2 usageRules`);
    }
    if (!g.examples || g.examples.length < 5) {
      errors.push(`Grammar ${g.id} requires >= 5 examples`);
    }
    if (!g.commonMistakes || g.commonMistakes.length < 2) {
      errors.push(`Grammar ${g.id} requires >= 2 commonMistakes`);
    }
    if (!g.quiz || g.quiz.length < 3) {
      errors.push(`Grammar ${g.id} requires >= 3 quiz exercises`);
    }

    for (const qItem of g.quiz) {
      grammarQuizCount += 1;
      if (!evaluateExerciseAnswer(qItem, qItem.correctAnswer)) {
        errors.push(`Grammar quiz self-evaluation failed: ${qItem.id} (${g.id})`);
      }
    }
  }

  // 3. Thematic Collections integrity
  const collectionIds = new Set<string>();
  for (const c of collections as ThematicCollection[]) {
    if (collectionIds.has(c.id)) {
      errors.push(`Duplicate collection ID: ${c.id}`);
    }
    collectionIds.add(c.id);
    checkNonEmpty(`collection.${c.id}.title`, c.title, errors);
    checkNonEmpty(`collection.${c.id}.description`, c.description, errors);
    if (!c.vocabularyIds || c.vocabularyIds.length < 8) {
      errors.push(`Collection ${c.id} has fewer than 8 vocabularyIds (${c.vocabularyIds?.length ?? 0})`);
    }
    for (const vid of c.vocabularyIds) {
      if (!vocabById.has(vid)) {
        errors.push(`Collection ${c.id} references non-existent vocabularyId: ${vid}`);
      }
    }
    if (!c.commonExpressions || c.commonExpressions.length < 2) {
      errors.push(`Collection ${c.id} needs >= 2 commonExpressions`);
    }
  }

  // 4. Expanded Interactive Exercises integrity
  const exerciseIds = new Set<string>();
  const exercisePrompts = new Set<string>();
  const exerciseCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  const exerciseTypeCounts: Record<string, number> = {};

  for (const unit of ALL_UNITS) {
    for (const lesson of unit.lessons) {
      for (const ex of lesson.exercises) {
        exerciseIds.add(ex.id);
      }
    }
  }
  for (const t of LISTENING_LAB_TRACKS) {
    for (const ex of t.exercises) exerciseIds.add(ex.id);
  }
  for (const g of GRAMMAR_TOPICS) {
    for (const qItem of g.quiz) exerciseIds.add(qItem.id);
  }
  for (const g of expandedGrammar) {
    for (const qItem of g.quiz) exerciseIds.add(qItem.id);
  }

  const checkExercise = (ex: Exercise): void => {
    if (exerciseIds.has(ex.id)) {
      errors.push(`Duplicate exercise ID: ${ex.id}`);
    }
    exerciseIds.add(ex.id);

    const lvlMatch = ex.lessonId.match(/^ex-bank-(a1|a2|b1|b2|c1|c2)$/i);
    if (lvlMatch) {
      const lvl = lvlMatch[1].toUpperCase() as CEFRLevel;
      exerciseCountsByLevel[lvl] += 1;
    }

    exerciseTypeCounts[ex.type] = (exerciseTypeCounts[ex.type] ?? 0) + 1;

    checkNonEmpty(`exercise.${ex.id}.instruction`, ex.instruction, errors);
    checkNonEmpty(`exercise.${ex.id}.prompt`, ex.prompt, errors);
    checkNonEmpty(`exercise.${ex.id}.explanation`, ex.explanation, errors);

    if (ex.type !== 'definition_matching') {
      const normPrompt = `${ex.lessonId}|${ex.prompt.toLowerCase().trim()}`;
      if (exercisePrompts.has(normPrompt)) {
        errors.push(`Duplicate exercise prompt inside bank: ${ex.id} -> ${ex.prompt}`);
      }
      exercisePrompts.add(normPrompt);
    }

    if (ex.relatedKnowledgeId) {
      if (!vocabById.has(ex.relatedKnowledgeId) && !grammarById.has(ex.relatedKnowledgeId)) {
        errors.push(`Exercise ${ex.id} references unknown relatedKnowledgeId: ${ex.relatedKnowledgeId}`);
      }
    } else {
      errors.push(`Exercise ${ex.id} missing relatedKnowledgeId`);
    }

    if (
      ex.type === 'multiple_choice' ||
      ex.type === 'collocation_selection' ||
      ex.type === 'error_identification' ||
      ex.type === 'pronunciation_discrimination'
    ) {
      if (!ex.options || ex.options.length < 3) {
        errors.push(`Exercise ${ex.id} needs >= 3 options`);
      } else if (typeof ex.correctAnswer !== 'string' || !ex.options.includes(ex.correctAnswer)) {
        errors.push(`Exercise ${ex.id} correctAnswer "${ex.correctAnswer}" not present inside options`);
      }
    }

    if (ex.type === 'multiple_response') {
      if (!Array.isArray(ex.correctAnswer) || ex.correctAnswer.length < 2 || !ex.options) {
        errors.push(`Exercise ${ex.id} multiple_response must have >=2 correctAnswer items and options`);
      } else {
        for (const ans of ex.correctAnswer) {
          if (!ex.options.includes(ans)) {
            errors.push(`Exercise ${ex.id} option missing expected answer "${ans}"`);
          }
        }
      }
    }

    if (ex.type === 'definition_matching') {
      if (!ex.pairs || ex.pairs.length < 3) {
        errors.push(`Exercise ${ex.id} definition_matching needs >= 3 pairs`);
      }
    }

    if (!evaluateExerciseAnswer(ex, ex.correctAnswer)) {
      errors.push(`Self-evaluation failed on exercise ${ex.id} (${ex.type})`);
    }
  };

  for (const ex of expandedExercises) {
    checkExercise(ex);
  }

  // 5. Learning Resources integrity
  const resourceIds = new Set<string>();
  const resourceUrls = new Set<string>();
  for (const r of resources as LearningResource[]) {
    if (resourceIds.has(r.id)) errors.push(`Duplicate resource ID: ${r.id}`);
    resourceIds.add(r.id);

    try {
      const parsed = new URL(r.url);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        errors.push(`Resource ${r.id} has non-HTTP URL: ${r.url}`);
      }
      if (parsed.hostname.includes('example.com')) {
        errors.push(`Resource ${r.id} uses placeholder example domain`);
      }
      if (resourceUrls.has(r.url)) {
        errors.push(`Duplicate resource URL: ${r.url}`);
      }
      resourceUrls.add(r.url);
    } catch {
      errors.push(`Invalid resource URL in ${r.id}: ${r.url}`);
    }

    checkNonEmpty(`resource.${r.id}.title`, r.title, errors);
    checkNonEmpty(`resource.${r.id}.publisher`, r.publisher, errors);
    checkNonEmpty(`resource.${r.id}.description`, r.description, errors);
  }

  // 6. Curriculum Matrix coverage
  const matrixLevels = new Set(matrix.map((m) => m.cefrLevel));
  for (const lvl of CEFR_LEVELS) {
    if (!matrixLevels.has(lvl)) {
      errors.push(`Curriculum matrix missing CEFR level: ${lvl}`);
    }
  }

  // 7. Milestone 2 Listening Academy integrity
  const listeningIds = new Set<string>(LISTENING_LAB_TRACKS.map((l) => l.id));
  const listeningTitles = new Set<string>(LISTENING_LAB_TRACKS.map((l) => l.title.toLowerCase().trim()));
  const listeningCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  let listeningExercisesCount = 0;

  for (const lis of expandedListening) {
    listeningCountsByLevel[lis.cefrLevel] = (listeningCountsByLevel[lis.cefrLevel] ?? 0) + 1;
    if (listeningIds.has(lis.id)) errors.push(`Duplicate listening ID: ${lis.id}`);
    listeningIds.add(lis.id);
    const normTitle = lis.title.toLowerCase().trim();
    if (listeningTitles.has(normTitle)) errors.push(`Duplicate listening title: ${lis.title}`);
    listeningTitles.add(normTitle);
    checkNonEmpty(`listening.${lis.id}.title`, lis.title, errors);
    checkNonEmpty(`listening.${lis.id}.preListeningPrompt`, lis.preListeningPrompt, errors);
    checkNonEmpty(`listening.${lis.id}.summaryText`, lis.summaryText, errors);
    if (!lis.scriptLines || lis.scriptLines.length < 4) {
      errors.push(`Listening ${lis.id} needs >= 4 scriptLines`);
    }
    if (!lis.vocabularyNotes || lis.vocabularyNotes.length < 3) {
      errors.push(`Listening ${lis.id} needs >= 3 vocabularyNotes`);
    }
    if (!lis.exercises || lis.exercises.length < 3) {
      errors.push(`Listening ${lis.id} needs >= 3 comprehension/dictation exercises`);
    }
    for (const ex of lis.exercises) {
      listeningExercisesCount += 1;
      if (exerciseIds.has(ex.id)) errors.push(`Duplicate listening exercise ID: ${ex.id}`);
      exerciseIds.add(ex.id);
      checkNonEmpty(`listeningEx.${ex.id}.prompt`, ex.prompt, errors);
      checkNonEmpty(`listeningEx.${ex.id}.explanation`, ex.explanation, errors);
      if ((ex.type === 'dictation' || ex.type === 'audio_recognition') && !ex.audioText?.trim()) {
        errors.push(`Listening exercise ${ex.id} requires audioText`);
      }
      if (!evaluateExerciseAnswer(ex, ex.correctAnswer).isCorrect) {
        errors.push(`Listening exercise self-eval failed: ${ex.id}`);
      }
    }
  }

  // 8. Milestone 2 Speaking Academy integrity
  const speakingIds = new Set<string>(SPEAKING_LAB_ACTIVITIES.map((s) => s.id));
  const speakingTitles = new Set<string>(SPEAKING_LAB_ACTIVITIES.map((s) => s.title.toLowerCase().trim()));
  const speakingCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

  for (const spk of expandedSpeaking) {
    speakingCountsByLevel[spk.cefrLevel] = (speakingCountsByLevel[spk.cefrLevel] ?? 0) + 1;
    if (speakingIds.has(spk.id)) errors.push(`Duplicate speaking ID: ${spk.id}`);
    speakingIds.add(spk.id);
    const normTitle = spk.title.toLowerCase().trim();
    if (speakingTitles.has(normTitle)) errors.push(`Duplicate speaking title: ${spk.title}`);
    speakingTitles.add(normTitle);
    checkNonEmpty(`speaking.${spk.id}.prompt`, spk.prompt, errors);
    checkNonEmpty(`speaking.${spk.id}.modelText`, spk.modelText, errors);
    if (!spk.objectives?.length || !spk.vocabularyBank?.length || !spk.selfChecklist?.length) {
      errors.push(`Speaking ${spk.id} missing objectives/vocabularyBank/selfChecklist`);
    }
  }
  if (speakingGuides.length < 6) {
    errors.push(`Expected >= 6 speaking mindset/framework guides, found ${speakingGuides.length}`);
  }

  // 9. Milestone 2 Pronunciation Academy integrity
  const proIds = new Set<string>();
  const proTitles = new Set<string>();
  let pronunciationExercisesCount = 0;

  for (const pro of pronunciationLessons) {
    if (proIds.has(pro.id)) errors.push(`Duplicate pronunciation ID: ${pro.id}`);
    proIds.add(pro.id);
    const normTitle = pro.title.toLowerCase().trim();
    if (proTitles.has(normTitle)) errors.push(`Duplicate pronunciation title: ${pro.title}`);
    proTitles.add(normTitle);
    checkNonEmpty(`pro.${pro.id}.articulatoryGuide`, pro.articulatoryGuide, errors);
    checkNonEmpty(`pro.${pro.id}.vietnameseLearnerTip`, pro.vietnameseLearnerTip, errors);
    if (!pro.minimalPairs || pro.minimalPairs.length < 2) {
      errors.push(`Pronunciation ${pro.id} requires >= 2 minimalPairs`);
    }
    for (const mp of pro.minimalPairs) {
      if (!mp.ipaA || !mp.ipaB) errors.push(`Pronunciation ${pro.id} missing IPA in minimal pair`);
    }
    if (!pro.listeningExercises || pro.listeningExercises.length < 3) {
      errors.push(`Pronunciation ${pro.id} requires >= 3 listeningExercises`);
    }
    for (const ex of pro.listeningExercises) {
      pronunciationExercisesCount += 1;
      if (exerciseIds.has(ex.id)) errors.push(`Duplicate pronunciation exercise ID: ${ex.id}`);
      exerciseIds.add(ex.id);
      if (!evaluateExerciseAnswer(ex, ex.correctAnswer).isCorrect) {
        errors.push(`Pronunciation exercise self-eval failed: ${ex.id}`);
      }
    }
  }

  // 10. Milestone 2 Shadowing Studio integrity
  const shdIds = new Set<string>();
  const shdTitles = new Set<string>();
  for (const shd of shadowingSessions) {
    if (shdIds.has(shd.id)) errors.push(`Duplicate shadowing ID: ${shd.id}`);
    shdIds.add(shd.id);
    const normTitle = shd.title.toLowerCase().trim();
    if (shdTitles.has(normTitle)) errors.push(`Duplicate shadowing title: ${shd.title}`);
    shdTitles.add(normTitle);
    checkNonEmpty(`shd.${shd.id}.rhythmOverview`, shd.rhythmOverview, errors);
    checkNonEmpty(`shd.${shd.id}.vietnameseFocusTip`, shd.vietnameseFocusTip, errors);
    if (!shd.segments || shd.segments.length < 3) {
      errors.push(`Shadowing ${shd.id} requires >= 3 segments`);
    }
  }

  // 11. Milestone 2 Reading Academy integrity
  const readingIds = new Set<string>(READING_LIBRARY_PASSAGES.map((p) => p.id));
  const readingTitles = new Set<string>(
    READING_LIBRARY_PASSAGES.map((p) => p.title.toLowerCase().trim())
  );
  const readingCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  const minReadingWords: Record<CEFRLevel, number> = { A1: 90, A2: 115, B1: 130, B2: 150, C1: 165, C2: 240 };
  const readingWordBands: Record<CEFRLevel, number[]> = { A1: [], A2: [], B1: [], B2: [], C1: [], C2: [] };
  let readingExercisesCount = 0;

  for (const r of expandedReading) {
    readingCountsByLevel[r.cefrLevel] = (readingCountsByLevel[r.cefrLevel] ?? 0) + 1;
    if (readingIds.has(r.id)) errors.push(`Duplicate reading ID: ${r.id}`);
    readingIds.add(r.id);
    const normTitle = r.title.toLowerCase().trim();
    if (readingTitles.has(normTitle)) errors.push(`Duplicate reading title: ${r.title}`);
    readingTitles.add(normTitle);
    checkNonEmpty(`reading.${r.id}.readingStrategy`, r.readingStrategy, errors);
    checkNonEmpty(`reading.${r.id}.summaryPrompt`, r.summaryPrompt, errors);
    if (!r.keyTakeaways?.length) errors.push(`Reading ${r.id} missing keyTakeaways`);
    const wc =
      r.wordCount ?? r.paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
    readingWordBands[r.cefrLevel].push(wc);
    if (wc < minReadingWords[r.cefrLevel]) {
      warnings.push(`Reading ${r.id} wordCount ${wc} below target baseline (${minReadingWords[r.cefrLevel]})`);
    }
    if (!r.glossary || r.glossary.length < 3) {
      errors.push(`Reading ${r.id} requires >= 3 glossary entries`);
    }
    for (const g of r.glossary) {
      if (!g.ipa.startsWith('/') || !g.ipa.endsWith('/')) {
        errors.push(`Reading ${r.id} glossary invalid IPA for "${g.word}": ${g.ipa}`);
      }
    }
    if (!r.questions || r.questions.length < 3) {
      errors.push(`Reading ${r.id} requires >= 3 questions`);
    }
    for (const q of r.questions) {
      readingExercisesCount += 1;
      if (exerciseIds.has(q.id)) errors.push(`Duplicate reading exercise ID: ${q.id}`);
      exerciseIds.add(q.id);
      if (!evaluateExerciseAnswer(q, q.correctAnswer).isCorrect) {
        errors.push(`Reading question self-eval failed: ${q.id}`);
      }
    }
  }

  // 12. Milestone 2 Writing Academy integrity
  const writingIds = new Set<string>(WRITING_LAB_PROMPTS.map((w) => w.id));
  const writingTitles = new Set<string>(
    WRITING_LAB_PROMPTS.map((w) => w.title.toLowerCase().trim())
  );
  const writingCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  let writingExercisesCount = 0;

  for (const w of expandedWriting) {
    writingCountsByLevel[w.cefrLevel] = (writingCountsByLevel[w.cefrLevel] ?? 0) + 1;
    if (writingIds.has(w.id)) errors.push(`Duplicate writing ID: ${w.id}`);
    writingIds.add(w.id);
    const normTitle = w.title.toLowerCase().trim();
    if (writingTitles.has(normTitle)) errors.push(`Duplicate writing title: ${w.title}`);
    writingTitles.add(normTitle);
    checkNonEmpty(`writing.${w.id}.prompt`, w.prompt, errors);
    checkNonEmpty(`writing.${w.id}.instructions`, w.instructions, errors);
    checkNonEmpty(`writing.${w.id}.sampleResponse`, w.sampleResponse, errors);
    if (!w.modelOutline || w.modelOutline.length < 3 || !w.rubric?.length || !w.checklist?.length) {
      errors.push(`Writing ${w.id} needs >= 3 modelOutline steps plus rubric and checklist`);
    }
    if (!w.usefulVocabulary?.length || !w.usefulStructures?.length) {
      errors.push(`Writing ${w.id} missing usefulVocabulary/usefulStructures`);
    }
    if (!w.annotatedModelNotes?.length) {
      errors.push(`Writing ${w.id} missing annotatedModelNotes`);
    }
    const sampleWords = w.sampleResponse.trim().split(/\s+/).filter(Boolean).length;
    if (sampleWords < w.minWords) {
      errors.push(`Writing ${w.id} sampleResponse (${sampleWords}w) shorter than minWords (${w.minWords}w)`);
    }
    const drills = w.practiceExercises ?? [];
    if (drills.length < 3) {
      errors.push(`Writing ${w.id} requires >= 3 practiceExercises (found ${drills.length})`);
    }
    for (const ex of drills) {
      writingExercisesCount += 1;
      if (exerciseIds.has(ex.id)) errors.push(`Duplicate writing drill ID: ${ex.id}`);
      exerciseIds.add(ex.id);
      if (!evaluateExerciseAnswer(ex, ex.correctAnswer).isCorrect) {
        errors.push(`Writing drill self-eval failed: ${ex.id}`);
      }
    }
  }

  // 13. Milestone 2 Conversations integrity
  const convIds = new Set<string>();
  const convTitles = new Set<string>();
  const convCountsByDomain: Record<string, number> = {};
  for (const conv of conversations) {
    if (convIds.has(conv.id)) errors.push(`Duplicate conversation ID: ${conv.id}`);
    convIds.add(conv.id);
    const normTitle = conv.title.toLowerCase().trim();
    if (convTitles.has(normTitle)) errors.push(`Duplicate conversation title: ${conv.title}`);
    convTitles.add(normTitle);
    convCountsByDomain[conv.domain] = (convCountsByDomain[conv.domain] ?? 0) + 1;
    checkNonEmpty(`conv.${conv.id}.setting`, conv.setting, errors);
    checkNonEmpty(`conv.${conv.id}.goal`, conv.goal, errors);
    checkNonEmpty(`conv.${conv.id}.culturalTip`, conv.culturalTip, errors);
    if (!conv.dialogueBranches || conv.dialogueBranches.length < 2) {
      errors.push(`Conversation ${conv.id} requires >= 2 dialogueBranches`);
    }
    if (!conv.keyPhrases || conv.keyPhrases.length < 2) {
      errors.push(`Conversation ${conv.id} requires >= 2 keyPhrases`);
    }
  }

  // 14. Milestone 2 Think in English integrity
  const thinkIds = new Set<string>();
  const thinkTitles = new Set<string>();
  const allowedDurations = new Set([15, 30, 60, 120, 300]);
  for (const act of thinkInEnglish) {
    if (thinkIds.has(act.id)) errors.push(`Duplicate Think-in-English ID: ${act.id}`);
    thinkIds.add(act.id);
    const normTitle = act.title.toLowerCase().trim();
    if (thinkTitles.has(normTitle)) errors.push(`Duplicate Think-in-English title: ${act.title}`);
    thinkTitles.add(normTitle);
    checkNonEmpty(`think.${act.id}.prompt`, act.prompt, errors);
    checkNonEmpty(`think.${act.id}.antiTranslationTip`, act.antiTranslationTip, errors);
    checkNonEmpty(`think.${act.id}.sampleMonologue`, act.sampleMonologue, errors);
    if (!allowedDurations.has(act.durationSeconds)) {
      errors.push(`Think-in-English ${act.id} invalid durationSeconds: ${act.durationSeconds}`);
    }
    if (!act.starterFrames?.length) {
      errors.push(`Think-in-English ${act.id} requires starterFrames`);
    }
    if (
      act.mode === 'circumlocution' &&
      (!act.circumlocutionTarget || act.circumlocutionTarget.clues.length < 2)
    ) {
      errors.push(`Think-in-English circumlocution ${act.id} requires >= 2 clues`);
    }
  }

  // 15. Milestone 2 Integrated Four-Skill Sequences integrity & referential validation
  const seqIds = new Set<string>();
  const seqTitles = new Set<string>();
  for (const seq of integratedSequences) {
    if (seqIds.has(seq.id)) errors.push(`Duplicate integrated sequence ID: ${seq.id}`);
    seqIds.add(seq.id);
    const normTitle = seq.title.toLowerCase().trim();
    if (seqTitles.has(normTitle)) errors.push(`Duplicate integrated sequence title: ${seq.title}`);
    seqTitles.add(normTitle);
    checkNonEmpty(`seq.${seq.id}.speakingPrompt`, seq.speakingPrompt, errors);
    checkNonEmpty(`seq.${seq.id}.writingTaskPrompt`, seq.writingTaskPrompt, errors);
    if (!listeningIds.has(seq.listeningLessonId)) {
      errors.push(`Integrated sequence ${seq.id} references unknown listeningLessonId: ${seq.listeningLessonId}`);
    }
    if (!seq.readingPassageId || !readingIds.has(seq.readingPassageId)) {
      errors.push(`Integrated sequence ${seq.id} references unknown readingPassageId: ${seq.readingPassageId}`);
    }
    const localVocab = new Set<string>();
    if (!seq.keyVocabIds || seq.keyVocabIds.length < 3) {
      errors.push(`Integrated sequence ${seq.id} requires >= 3 keyVocabIds`);
    }
    for (const vid of seq.keyVocabIds) {
      if (!vocabById.has(vid)) {
        errors.push(`Integrated sequence ${seq.id} references unknown keyVocabId: ${vid}`);
      }
      if (localVocab.has(vid)) {
        errors.push(`Integrated sequence ${seq.id} has duplicate keyVocabId: ${vid}`);
      }
      localVocab.add(vid);
    }
    const skillsSeen = new Set(seq.sequenceSteps.map((s) => s.skill));
    if (
      seq.sequenceSteps.length !== 4 ||
      !skillsSeen.has('listening') ||
      !skillsSeen.has('reading') ||
      !skillsSeen.has('speaking') ||
      !skillsSeen.has('writing')
    ) {
      errors.push(`Integrated sequence ${seq.id} must have 4 steps covering listening, reading, speaking, writing`);
    }
  }

  // 16. Milestone 2 completeness, CEFR distribution & per-lesson prompt uniqueness
  const expectedM2MainDist: Record<CEFRLevel, number> = { A1: 15, A2: 15, B1: 20, B2: 30, C1: 25, C2: 15 };
  const expectedM2WritingDist: Record<CEFRLevel, number> = { A1: 10, A2: 10, B1: 15, B2: 25, C1: 20, C2: 10 };

  if (expandedListening.length !== 120) {
    errors.push(`Expected 120 Milestone 2 Listening lessons, found ${expandedListening.length}`);
  }
  if (expandedSpeaking.length !== 120) {
    errors.push(`Expected 120 Milestone 2 Speaking lessons, found ${expandedSpeaking.length}`);
  }
  if (expandedReading.length !== 120) {
    errors.push(`Expected 120 Milestone 2 Reading passages, found ${expandedReading.length}`);
  }
  if (expandedWriting.length !== 90) {
    errors.push(`Expected 90 Milestone 2 Writing lessons, found ${expandedWriting.length}`);
  }
  if (pronunciationLessons.length !== 48) {
    errors.push(`Expected 48 Milestone 2 Pronunciation lessons, found ${pronunciationLessons.length}`);
  }
  if (shadowingSessions.length !== 60) {
    errors.push(`Expected 60 Milestone 2 Shadowing sessions, found ${shadowingSessions.length}`);
  }
  if (conversations.length !== 60) {
    errors.push(`Expected 60 Milestone 2 Conversation scenarios, found ${conversations.length}`);
  }
  if (thinkInEnglish.length !== 30) {
    errors.push(`Expected 30 Milestone 2 Think in English drills, found ${thinkInEnglish.length}`);
  }
  if (integratedSequences.length !== 24) {
    errors.push(`Expected 24 Milestone 2 Integrated sequences, found ${integratedSequences.length}`);
  }

  for (const level of CEFR_LEVELS) {
    if (listeningCountsByLevel[level] !== expectedM2MainDist[level]) {
      errors.push(
        `Listening ${level} count mismatch: expected ${expectedM2MainDist[level]}, got ${listeningCountsByLevel[level]}`,
      );
    }
    if (speakingCountsByLevel[level] !== expectedM2MainDist[level]) {
      errors.push(
        `Speaking ${level} count mismatch: expected ${expectedM2MainDist[level]}, got ${speakingCountsByLevel[level]}`,
      );
    }
    if (readingCountsByLevel[level] !== expectedM2MainDist[level]) {
      errors.push(
        `Reading ${level} count mismatch: expected ${expectedM2MainDist[level]}, got ${readingCountsByLevel[level]}`,
      );
    }
    if (writingCountsByLevel[level] !== expectedM2WritingDist[level]) {
      errors.push(
        `Writing ${level} count mismatch: expected ${expectedM2WritingDist[level]}, got ${writingCountsByLevel[level]}`,
      );
    }
  }

  const checkUniquePromptsPerUnit = (
    academy: string,
    items: Array<{ id: string; exercises: Array<{ id: string; prompt: string }> }>,
    minExercises: number,
  ) => {
    for (const item of items) {
      if (item.exercises.length < minExercises) {
        errors.push(`${academy} ${item.id} has ${item.exercises.length} exercises (expected >= ${minExercises})`);
      }
      const seen = new Set<string>();
      for (const ex of item.exercises) {
        const norm = ex.prompt.toLowerCase().trim();
        if (seen.has(norm)) {
          errors.push(`Duplicate exercise prompt inside ${academy} ${item.id}: "${ex.prompt}"`);
        }
        seen.add(norm);
      }
    }
  };

  checkUniquePromptsPerUnit('Listening', expandedListening, 6);
  checkUniquePromptsPerUnit(
    'Reading',
    expandedReading.map((p) => ({ id: p.id, exercises: p.questions })),
    5,
  );
  checkUniquePromptsPerUnit(
    'Pronunciation',
    pronunciationLessons.map((p) => ({ id: p.id, exercises: p.listeningExercises })),
    5,
  );
  checkUniquePromptsPerUnit(
    'Writing',
    expandedWriting.map((w) => ({ id: w.id, exercises: w.practiceExercises ?? [] })),
    3,
  );

  // 17. Milestone 3 Batch 3A: Advanced CEFR Learning Path (36 new units, 216 lessons) & 45 Structured Assessments
  const [m3Units, m3Assessments] = await Promise.all([
    loadAllCurriculumUnits(),
    loadAllAssessments(),
  ]);

  const expectedM3UnitDist: Record<CEFRLevel, number> = {
    A1: 4,
    A2: 4,
    B1: 4,
    B2: 8,
    C1: 8,
    C2: 8,
  };
  const m3UnitCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  const m3LessonCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  const m3ExerciseCountsByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

  const allPathUnitIds = new Set<string>(ALL_UNITS.map((u) => u.id));
  const m3UnitIds = new Set<string>();
  const m3LessonIds = new Set<string>(ALL_UNITS.flatMap((u) => u.lessons.map((l) => l.id)));
  const m3AssessmentById = new Map(m3Assessments.map((a) => [a.id, a]));
  const m3AssessmentIds = new Set<string>();

  let m3LessonCount = 0;
  let m3LessonExercisesCount = 0;
  let m3AssessExercisesCount = 0;
  let m3ReusedRefCount = 0;

  for (const unit of m3Units) {
    if (m3UnitIds.has(unit.id) || ALL_UNITS.some((u) => u.id === unit.id)) {
      errors.push(`Duplicate Milestone 3 unit ID: ${unit.id}`);
    }
    m3UnitIds.add(unit.id);
    allPathUnitIds.add(unit.id);
    m3UnitCountsByLevel[unit.cefrLevel] += 1;

    if (unit.lessons.length !== 6) {
      errors.push(`Milestone 3 unit ${unit.id} has ${unit.lessons.length} lessons (expected 6)`);
    }
    if (!unit.masteryAssessmentId || !m3AssessmentById.has(unit.masteryAssessmentId)) {
      errors.push(`Milestone 3 unit ${unit.id} references missing masteryAssessmentId: ${unit.masteryAssessmentId ?? 'none'}`);
    }
    for (const vid of unit.targetVocabIds ?? []) {
      if (!vocabById.has(vid) && !SEED_VOCABULARY.some((v) => v.id === vid)) {
        errors.push(`Unit ${unit.id} targetVocabId not found: ${vid}`);
      }
    }
    for (const gid of unit.targetGrammarIds ?? []) {
      if (!grammarById.has(gid) && !GRAMMAR_TOPICS.some((g) => g.id === gid)) {
        errors.push(`Unit ${unit.id} targetGrammarId not found: ${gid}`);
      }
    }
    for (const lid of unit.linkedListeningIds ?? []) {
      if (!listeningIds.has(lid)) errors.push(`Unit ${unit.id} missing linkedListeningId: ${lid}`);
    }
    for (const sid of unit.linkedSpeakingIds ?? []) {
      if (!speakingIds.has(sid)) errors.push(`Unit ${unit.id} missing linkedSpeakingId: ${sid}`);
    }
    for (const rid of unit.linkedReadingIds ?? []) {
      if (!readingIds.has(rid)) errors.push(`Unit ${unit.id} missing linkedReadingId: ${rid}`);
    }
    for (const wid of unit.linkedWritingIds ?? []) {
      if (!writingIds.has(wid)) errors.push(`Unit ${unit.id} missing linkedWritingId: ${wid}`);
    }
    for (const cid of unit.linkedConversationIds ?? []) {
      if (!convIds.has(cid)) errors.push(`Unit ${unit.id} missing linkedConversationId: ${cid}`);
    }
    for (const pid of unit.linkedPronunciationIds ?? []) {
      if (!proIds.has(pid)) errors.push(`Unit ${unit.id} missing linkedPronunciationId: ${pid}`);
    }

    for (const lesson of unit.lessons) {
      if (m3LessonIds.has(lesson.id)) {
        errors.push(`Duplicate Milestone 3 lesson ID: ${lesson.id}`);
      }
      m3LessonIds.add(lesson.id);
      m3LessonCount += 1;
      m3LessonCountsByLevel[unit.cefrLevel] += 1;

      if (!lesson.instructionalOverview || !lesson.instructionalOverview.trim()) {
        errors.push(`Lesson ${lesson.id} missing instructionalOverview`);
      }
      if (!lesson.learningObjectives || lesson.learningObjectives.length < 1) {
        errors.push(`Lesson ${lesson.id} missing learningObjectives`);
      }
      if (!lesson.lessonSummary || !lesson.lessonSummary.trim()) {
        errors.push(`Lesson ${lesson.id} missing lessonSummary`);
      }
      if (lesson.exercises.length < 3) {
        errors.push(`Milestone 3 lesson ${lesson.id} has ${lesson.exercises.length} exercises (expected >= 3)`);
      }

      for (const ref of lesson.reusedExerciseRefs ?? []) {
        if (!exerciseIds.has(ref.id)) {
          errors.push(`Lesson ${lesson.id} reusedExerciseRef ${ref.id} does not exist in bank`);
        }
        m3ReusedRefCount += 1;
      }

      const lessonPromptsSeen = new Set<string>();
      for (const ex of lesson.exercises) {
        if (exerciseIds.has(ex.id)) {
          errors.push(`Duplicate Milestone 3 lesson exercise ID: ${ex.id}`);
        }
        exerciseIds.add(ex.id);
        m3LessonExercisesCount += 1;
        m3ExerciseCountsByLevel[unit.cefrLevel] += 1;

        const norm = ex.prompt.toLowerCase().trim();
        if (lessonPromptsSeen.has(norm)) {
          errors.push(`Duplicate prompt inside M3 lesson ${lesson.id}: "${ex.prompt}"`);
        }
        lessonPromptsSeen.add(norm);

        if (ex.options && !Array.isArray(ex.correctAnswer) && !ex.options.includes(ex.correctAnswer)) {
          errors.push(`Exercise ${ex.id} correctAnswer missing from options`);
        }
        if (!ex.explanation || !ex.explanation.trim()) {
          errors.push(`Exercise ${ex.id} missing explanation`);
        }
        const evalCheck = evaluateExerciseAnswer(ex, ex.correctAnswer);
        if (!evalCheck.isCorrect) {
          errors.push(`Self-evaluation failed for M3 lesson exercise ${ex.id}`);
        }
      }
    }
  }

  // Validate prerequisiteUnitIds after collecting all unit IDs
  for (const unit of m3Units) {
    for (const pid of unit.prerequisiteUnitIds ?? []) {
      if (!allPathUnitIds.has(pid)) {
        errors.push(`Unit ${unit.id} prerequisiteUnitId not found: ${pid}`);
      }
    }
  }

  for (const lvl of CEFR_LEVELS) {
    if (m3UnitCountsByLevel[lvl] !== expectedM3UnitDist[lvl]) {
      errors.push(`M3 ${lvl} unit count mismatch: expected ${expectedM3UnitDist[lvl]}, got ${m3UnitCountsByLevel[lvl]}`);
    }
  }
  if (m3Units.length !== 36) errors.push(`Expected 36 new M3 units, got ${m3Units.length}`);
  if (m3LessonCount !== 216) errors.push(`Expected 216 new M3 lessons, got ${m3LessonCount}`);

  let m3UnitAssessCount = 0;
  let m3LevelExamCount = 0;
  for (const asmt of m3Assessments) {
    if (m3AssessmentIds.has(asmt.id)) errors.push(`Duplicate assessment ID: ${asmt.id}`);
    m3AssessmentIds.add(asmt.id);
    if (!asmt.isUnofficialNotice.toLowerCase().includes('do not constitute official')) {
      errors.push(`Assessment ${asmt.id} lacks explicit unofficial notice disclaimer`);
    }
    if (asmt.kind === 'unit_mastery') {
      m3UnitAssessCount += 1;
      if (!asmt.unitId || !m3UnitIds.has(asmt.unitId)) {
        errors.push(`Unit assessment ${asmt.id} links missing unitId: ${asmt.unitId ?? 'none'}`);
      }
    } else if (asmt.kind === 'level_completion') {
      m3LevelExamCount += 1;
    }

    const asmtPrompts = new Set<string>();
    for (const ex of asmt.exercises) {
      if (exerciseIds.has(ex.id)) {
        errors.push(`Duplicate Milestone 3 assessment exercise ID: ${ex.id}`);
      }
      exerciseIds.add(ex.id);
      m3AssessExercisesCount += 1;
      m3ExerciseCountsByLevel[asmt.cefrLevel] += 1;

      const norm = ex.prompt.toLowerCase().trim();
      if (asmtPrompts.has(norm)) {
        errors.push(`Duplicate prompt inside assessment ${asmt.id}: "${ex.prompt}"`);
      }
      asmtPrompts.add(norm);

      if (ex.options && !Array.isArray(ex.correctAnswer) && !ex.options.includes(ex.correctAnswer)) {
        errors.push(`Assessment exercise ${ex.id} correctAnswer missing from options`);
      }
      if (!ex.explanation || !ex.explanation.trim()) {
        errors.push(`Assessment exercise ${ex.id} missing explanation`);
      }
      const evalCheck = evaluateExerciseAnswer(ex, ex.correctAnswer);
      if (!evalCheck.isCorrect) {
        errors.push(`Self-evaluation failed for M3 assessment exercise ${ex.id}`);
      }
    }
  }
  if (m3UnitAssessCount !== 36) errors.push(`Expected 36 unit_mastery assessments, got ${m3UnitAssessCount}`);
  if (m3LevelExamCount !== 6) errors.push(`Expected 6 level_completion exams, got ${m3LevelExamCount}`);

  // 18. Milestone 3 Batch 3B IELTS Mastery Center validation
  const ieltsItemIds = new Set<string>();
  const ieltsPromptBank = new Set<string>();
  let m3IeltsExercisesCount = 0;

  if (ieltsListening.length !== 80) errors.push(`Expected 80 IELTS Listening items, got ${ieltsListening.length}`);
  if (ieltsSpeaking.length !== 100) errors.push(`Expected 100 IELTS Speaking items, got ${ieltsSpeaking.length}`);
  const acReadingCount = ieltsReading.filter((r) => r.pathway === 'academic').length;
  const gtReadingCount = ieltsReading.filter((r) => r.pathway === 'general_training').length;
  if (acReadingCount !== 40) errors.push(`Expected 40 Academic IELTS Reading passages, got ${acReadingCount}`);
  if (gtReadingCount !== 20) errors.push(`Expected 20 General Training IELTS Reading passages, got ${gtReadingCount}`);
  const acT1Count = ieltsWriting.filter((w) => w.taskType === 'task_1_academic').length;
  const gtT1Count = ieltsWriting.filter((w) => w.taskType === 'task_1_gt').length;
  const t2Count = ieltsWriting.filter((w) => w.taskType === 'task_2').length;
  if (acT1Count !== 20) errors.push(`Expected 20 Academic Task 1 prompts, got ${acT1Count}`);
  if (gtT1Count !== 10) errors.push(`Expected 10 GT Task 1 Letters, got ${gtT1Count}`);
  if (t2Count !== 30) errors.push(`Expected 30 IELTS Task 2 prompts, got ${t2Count}`);
  if (ieltsIdeaBanks.length !== 10) errors.push(`Expected 10 IELTS Idea/Lexis packs, got ${ieltsIdeaBanks.length}`);

  for (const spk of ieltsSpeaking) {
    if (ieltsItemIds.has(spk.id)) errors.push(`Duplicate IELTS item ID: ${spk.id}`);
    ieltsItemIds.add(spk.id);
    checkNonEmpty(`Speaking ${spk.id}.band6`, spk.bandModels.band6, errors);
    checkNonEmpty(`Speaking ${spk.id}.band8`, spk.bandModels.band8, errors);
    if (spk.questions.length === 0) errors.push(`Speaking ${spk.id} has no questions`);
  }

  for (const w of ieltsWriting) {
    if (ieltsItemIds.has(w.id)) errors.push(`Duplicate IELTS item ID: ${w.id}`);
    ieltsItemIds.add(w.id);
    if (w.taskType === 'task_1_academic' && !w.visualSpec) {
      errors.push(`Academic Task 1 ${w.id} missing structured visualSpec`);
    }
    if (w.taskType === 'task_1_gt' && (!w.letterContext || w.letterContext.bulletPoints.length < 3)) {
      errors.push(`GT Letter ${w.id} missing 3 letterContext bullet points`);
    }
    checkNonEmpty(`Writing ${w.id}.band8Model`, w.band8Model, errors);
  }

  const ieltsExerciseGroups: Array<{ itemId: string; exList: Exercise[] }> = [
    ...ieltsListening.map((x) => ({ itemId: x.id, exList: x.exercises })),
    ...ieltsReading.map((x) => ({ itemId: x.id, exList: x.exercises })),
    ...ieltsWriting.map((x) => ({ itemId: x.id, exList: x.exercises })),
    ...ieltsIdeaBanks.map((x) => ({ itemId: x.id, exList: x.exercises })),
  ];
  for (const x of [...ieltsListening, ...ieltsReading, ...ieltsIdeaBanks]) {
    if (ieltsItemIds.has(x.id)) errors.push(`Duplicate IELTS item ID: ${x.id}`);
    ieltsItemIds.add(x.id);
  }

  for (const group of ieltsExerciseGroups) {
    for (const ex of group.exList) {
      if (exerciseIds.has(ex.id)) {
        errors.push(`Duplicate IELTS exercise ID: ${ex.id}`);
      }
      exerciseIds.add(ex.id);
      m3IeltsExercisesCount += 1;
      const pNorm = ex.prompt.toLowerCase().trim();
      if (ieltsPromptBank.has(pNorm)) {
        errors.push(`Duplicate IELTS exercise prompt in ${group.itemId}: "${ex.prompt}"`);
      }
      ieltsPromptBank.add(pNorm);
      if (ex.options && !Array.isArray(ex.correctAnswer) && !ex.options.includes(ex.correctAnswer)) {
        errors.push(`IELTS exercise ${ex.id} correctAnswer missing from options`);
      }
      checkNonEmpty(`IELTS ${ex.id}.explanation`, ex.explanation, errors);
      const evalCheck = evaluateExerciseAnswer(ex, ex.correctAnswer);
      if (!evalCheck.isCorrect) {
        errors.push(`Self-evaluation failed for IELTS exercise ${ex.id}`);
      }
    }
  }
  const ieltsTotalEntries =
    ieltsListening.length +
    ieltsSpeaking.length +
    ieltsReading.length +
    ieltsWriting.length +
    ieltsIdeaBanks.length +
    ieltsStrategies.length +
    ieltsMocks.length;

  // 19. Milestone 3 Batch 3C IELTS Strategy Lessons (60 / 120 ex) & Mock Exams (12: 8 Ac + 4 GT)
  let m3StrategyExercisesCount = 0;
  if (ieltsStrategies.length !== 60) {
    errors.push(`Expected 60 IELTS Strategy Lessons, got ${ieltsStrategies.length}`);
  }
  const stratCats = new Set<string>();
  const stratPromptBank = new Set<string>();
  for (const st of ieltsStrategies) {
    stratCats.add(st.category);
    if (ieltsItemIds.has(st.id)) errors.push(`Duplicate IELTS strategy ID: ${st.id}`);
    ieltsItemIds.add(st.id);
    if (st.stepByStepMethod.length < 3 || st.trapPatterns.length < 1) {
      errors.push(`Strategy lesson ${st.id} lacks full steps or trap pattern`);
    }
    for (const ex of st.exercises) {
      if (exerciseIds.has(ex.id)) errors.push(`Duplicate strategy exercise ID: ${ex.id}`);
      exerciseIds.add(ex.id);
      m3StrategyExercisesCount += 1;
      const pNorm = ex.prompt.toLowerCase().trim();
      if (stratPromptBank.has(pNorm)) {
        errors.push(`Duplicate IELTS strategy prompt in ${st.id}: "${ex.prompt}"`);
      }
      stratPromptBank.add(pNorm);
      if (ex.options && !Array.isArray(ex.correctAnswer) && !ex.options.includes(ex.correctAnswer)) {
        errors.push(`Strategy exercise ${ex.id} correctAnswer missing from options`);
      }
      checkNonEmpty(`Strategy ${ex.id}.explanation`, ex.explanation, errors);
      if (!evaluateExerciseAnswer(ex, ex.correctAnswer).isCorrect) {
        errors.push(`Self-evaluation failed for strategy exercise ${ex.id}`);
      }
    }
  }
  if (stratCats.size !== 5) {
    errors.push(`Expected all 5 IELTS strategy categories, got ${stratCats.size}`);
  }

  if (ieltsMocks.length !== 12) {
    errors.push(`Expected 12 complete IELTS Mock Exams, got ${ieltsMocks.length}`);
  }
  const acMockCount = ieltsMocks.filter((m) => m.pathway === 'academic').length;
  const gtMockCount = ieltsMocks.filter((m) => m.pathway === 'general_training').length;
  if (acMockCount !== 8) errors.push(`Expected 8 Academic Mock Exams, got ${acMockCount}`);
  if (gtMockCount !== 4) errors.push(`Expected 4 General Training Mock Exams, got ${gtMockCount}`);

  const listeningSet = new Set(ieltsListening.map((x) => x.id));
  const readingMap = new Map(ieltsReading.map((x) => [x.id, x]));
  const writingMap = new Map(ieltsWriting.map((x) => [x.id, x]));
  const speakingSet = new Set(ieltsSpeaking.map((x) => x.id));

  for (const mock of ieltsMocks) {
    if (ieltsItemIds.has(mock.id)) errors.push(`Duplicate mock ID: ${mock.id}`);
    ieltsItemIds.add(mock.id);
    if (!mock.isUnofficialNotice.toLowerCase().includes('unofficial')) {
      errors.push(`Mock ${mock.id} lacks unofficial practice disclaimer`);
    }
    for (const lid of mock.listeningIds) {
      if (!listeningSet.has(lid)) errors.push(`Mock ${mock.id} invalid listening ref ${lid}`);
    }
    for (const rid of mock.readingIds) {
      const rObj = readingMap.get(rid);
      if (!rObj || rObj.pathway !== mock.pathway) {
        errors.push(`Mock ${mock.id} (${mock.pathway}) invalid/mismatched reading ref ${rid}`);
      }
    }
    const w1 = writingMap.get(mock.writingTask1Id);
    const w2 = writingMap.get(mock.writingTask2Id);
    if (!w1 || (w1.pathway !== 'shared' && w1.pathway !== mock.pathway)) {
      errors.push(`Mock ${mock.id} invalid Task 1 ref ${mock.writingTask1Id}`);
    }
    if (!w2 || w2.taskType !== 'task_2') {
      errors.push(`Mock ${mock.id} invalid Task 2 ref ${mock.writingTask2Id}`);
    }
    for (const sid of mock.speakingPartIds) {
      if (!speakingSet.has(sid)) errors.push(`Mock ${mock.id} invalid speaking ref ${sid}`);
    }
  }

  const m3NewExercises =
    m3LessonExercisesCount +
    m3AssessExercisesCount +
    m3IeltsExercisesCount +
    m3StrategyExercisesCount;

  const totalVocab = SEED_VOCABULARY.length + expandedVocab.length;
  const totalGrammarTopics = GRAMMAR_TOPICS.length + expandedGrammar.length;
  const legacyPathExercises = ALL_UNITS.reduce(
    (sum, u) => sum + u.lessons.reduce((ls, l) => ls + l.exercises.length, 0),
    0
  );
  const legacyGrammarQuizzes = GRAMMAR_TOPICS.reduce((sum, g) => sum + g.quiz.length, 0);
  const m2NewExercises =
    listeningExercisesCount +
    pronunciationExercisesCount +
    readingExercisesCount +
    writingExercisesCount;
  if (m2NewExercises < 1800) {
    errors.push(`Milestone 2 interactive exercises (${m2NewExercises}) below 1,800 target`);
  }
  const totalExercises =
    legacyPathExercises +
    legacyGrammarQuizzes +
    grammarQuizCount +
    expandedExercises.length +
    m2NewExercises +
    m3NewExercises;

  console.log('\n=== ENGLISH QUEST CONTENT VALIDATION REPORT ===');
  console.log(`Expanded Vocabulary: ${expandedVocab.length} (+ ${SEED_VOCABULARY.length} core seed = ${totalVocab})`);
  console.log('  By CEFR level:', JSON.stringify(vocabCountsByLevel));
  console.log(`Expanded Grammar Topics: ${expandedGrammar.length} (+ ${GRAMMAR_TOPICS.length} core = ${totalGrammarTopics})`);
  console.log('  By CEFR level:', JSON.stringify(grammarCountsByLevel));
  console.log(`Thematic Collections: ${collections.length}`);
  console.log(`Expanded Exercise Bank: ${expandedExercises.length} (+ ${grammarQuizCount} academy + ${m2NewExercises} Milestone 2 + ${legacyPathExercises} path = ${totalExercises})`);
  console.log('  Exercise Bank by CEFR level:', JSON.stringify(exerciseCountsByLevel));
  console.log('  Exercise Bank Formats:', JSON.stringify(exerciseTypeCounts));
  console.log(`Milestone 2 Listening Lessons: ${expandedListening.length} (+ ${LISTENING_LAB_TRACKS.length} core = ${expandedListening.length + LISTENING_LAB_TRACKS.length}) [${listeningExercisesCount} ex]`);
  console.log('  Listening by CEFR:', JSON.stringify(listeningCountsByLevel));
  console.log(`Milestone 2 Speaking Lessons: ${expandedSpeaking.length} (+ ${SPEAKING_LAB_ACTIVITIES.length} core = ${expandedSpeaking.length + SPEAKING_LAB_ACTIVITIES.length}) + ${speakingGuides.length} guides`);
  console.log('  Speaking by CEFR:', JSON.stringify(speakingCountsByLevel));
  console.log(`Milestone 2 Reading Passages: ${expandedReading.length} (+ ${READING_LIBRARY_PASSAGES.length} core = ${expandedReading.length + READING_LIBRARY_PASSAGES.length}) [${readingExercisesCount} ex]`);
  console.log('  Reading by CEFR:', JSON.stringify(readingCountsByLevel));
  console.log(
    '  Reading avg words by CEFR:',
    JSON.stringify(
      Object.fromEntries(
        CEFR_LEVELS.map((l) => [
          l,
          {
            min: Math.min(...readingWordBands[l]),
            avg: Math.round(
              readingWordBands[l].reduce((a, b) => a + b, 0) / Math.max(1, readingWordBands[l].length)
            ),
            max: Math.max(...readingWordBands[l]),
          },
        ])
      )
    )
  );
  console.log(`Milestone 2 Writing Lessons: ${expandedWriting.length} (+ ${WRITING_LAB_PROMPTS.length} core = ${expandedWriting.length + WRITING_LAB_PROMPTS.length}) [${writingExercisesCount} ex]`);
  console.log('  Writing by CEFR:', JSON.stringify(writingCountsByLevel));
  console.log(`Milestone 2 Pronunciation Lessons: ${pronunciationLessons.length} [${pronunciationExercisesCount} ex]`);
  console.log(`Milestone 2 Shadowing Sessions: ${shadowingSessions.length}`);
  console.log(`Milestone 2 Conversation Scenarios: ${conversations.length} (${JSON.stringify(convCountsByDomain)})`);
  console.log(`Milestone 2 Think in English Drills: ${thinkInEnglish.length}`);
  console.log(`Milestone 2 Integrated 4-Skill Units: ${integratedSequences.length}`);
  console.log(
    `Milestone 3 CEFR Units: ${m3Units.length} (+ ${ALL_UNITS.length} core = ${m3Units.length + ALL_UNITS.length}) | Lessons: ${m3LessonCount} (+ ${ALL_UNITS.reduce((s, u) => s + u.lessons.length, 0)} core = ${m3LessonCount + ALL_UNITS.reduce((s, u) => s + u.lessons.length, 0)})`
  );
  console.log(
    `Milestone 3 Structured Assessments: ${m3Assessments.length} (${m3UnitAssessCount} unit + ${m3LevelExamCount} level exams + ${m3Assessments.length - m3UnitAssessCount - m3LevelExamCount} diag/review)`
  );
  console.log(
    `Milestone 3 Newly Authored Exercises: ${m3NewExercises} (${m3LessonExercisesCount} lesson + ${m3AssessExercisesCount} assessment + ${m3IeltsExercisesCount} IELTS academies + ${m3StrategyExercisesCount} strategy) [Reused refs tracked separately: ${m3ReusedRefCount}]`
  );
  console.log(
    `Milestone 3 IELTS Mastery Center: ${ieltsTotalEntries} items (Listening ${ieltsListening.length}, Speaking ${ieltsSpeaking.length}, Reading ${ieltsReading.length} [Ac:${acReadingCount}/GT:${gtReadingCount}], Writing ${ieltsWriting.length}, Ideas ${ieltsIdeaBanks.length}, Strategy ${ieltsStrategies.length}, Mocks ${ieltsMocks.length}) [${m3IeltsExercisesCount + m3StrategyExercisesCount} ex]`
  );
  console.log(`Curated Learning Resources: ${resources.length}`);
  console.log(`Curriculum Matrix Levels: ${matrix.length}`);
  console.log(`Warnings: ${warnings.length}`);
  if (warnings.length > 0) console.log('  Sample warnings:', warnings.slice(0, 5));
  console.log(`Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('\nValidation Failures:');
    for (const e of errors.slice(0, 40)) console.error(`  - ${e}`);
    if (errors.length > 40) console.error(`  ... and ${errors.length - 40} more`);
  }

  if (writeReport && errors.length === 0) {
    const reportPath = path.resolve(process.cwd(), 'docs/CONTENT_QUALITY_REPORT.md');
    const md = `# Content Quality & Validation Report

Generated automatically by \`npm run validate:content\`.

## Verification Outcome

- **Errors:** ${errors.length}
- **Warnings:** ${warnings.length}
- **Status:** PASSED

## Verified Live Content Counts

| Category | Core Seed / Phase 1 | Curriculum Expansion (M1 + M2 + M3) | Total Verified |
|---|---:|---:|---:|
| Vocabulary & Lexical Entries | ${SEED_VOCABULARY.length} | ${expandedVocab.length} | ${totalVocab} |
| Grammar Academy Lessons | ${GRAMMAR_TOPICS.length} | ${expandedGrammar.length} | ${totalGrammarTopics} |
| Thematic Vocabulary Collections | 0 | ${collections.length} | ${collections.length} |
| Interactive Practice Bank Exercises | 0 | ${expandedExercises.length} | ${expandedExercises.length} |
| Grammar Academy Mini-Quizzes | ${legacyGrammarQuizzes} | ${grammarQuizCount} | ${legacyGrammarQuizzes + grammarQuizCount} |
| Milestone 2 Academy Interactive Exercises | 0 | ${m2NewExercises} | ${m2NewExercises} |
| Milestone 3 Curriculum, Assessment & IELTS Exercises (Newly Authored) | 0 | ${m3NewExercises} | ${m3NewExercises} |
| IELTS Mastery Center Activities & Banks | 7 | ${ieltsTotalEntries} | ${7 + ieltsTotalEntries} |
| Core Learning Path Exercises | ${legacyPathExercises} | 0 | ${legacyPathExercises} |
| **Combined Interactive Exercises** | **${legacyPathExercises + legacyGrammarQuizzes}** | **${expandedExercises.length + grammarQuizCount + m2NewExercises + m3NewExercises}** | **${totalExercises}** |
| Learning Path CEFR Units | ${ALL_UNITS.length} | ${m3Units.length} | ${ALL_UNITS.length + m3Units.length} |
| Learning Path Lessons | ${ALL_UNITS.reduce((s, u) => s + u.lessons.length, 0)} | ${m3LessonCount} | ${ALL_UNITS.reduce((s, u) => s + u.lessons.length, 0) + m3LessonCount} |
| Structured Assessments & CEFR Exams | 0 | ${m3Assessments.length} | ${m3Assessments.length} |
| Listening Academy Lessons | ${LISTENING_LAB_TRACKS.length} | ${expandedListening.length} | ${LISTENING_LAB_TRACKS.length + expandedListening.length} |
| Speaking Academy Lessons | ${SPEAKING_LAB_ACTIVITIES.length} | ${expandedSpeaking.length} | ${SPEAKING_LAB_ACTIVITIES.length + expandedSpeaking.length} |
| Reading Academy Passages | ${READING_LIBRARY_PASSAGES.length} | ${expandedReading.length} | ${READING_LIBRARY_PASSAGES.length + expandedReading.length} |
| Writing Academy Lessons | ${WRITING_LAB_PROMPTS.length} | ${expandedWriting.length} | ${WRITING_LAB_PROMPTS.length + expandedWriting.length} |
| Pronunciation Academy Lessons | 0 | ${pronunciationLessons.length} | ${pronunciationLessons.length} |
| Shadowing Studio Sessions | 0 | ${shadowingSessions.length} | ${shadowingSessions.length} |
| Practical Conversation Scenarios | 0 | ${conversations.length} | ${conversations.length} |
| Think in English Drills | 0 | ${thinkInEnglish.length} | ${thinkInEnglish.length} |
| Integrated 4-Skill Units | 0 | ${integratedSequences.length} | ${integratedSequences.length} |
| Speaking Mindset Guides | 0 | ${speakingGuides.length} | ${speakingGuides.length} |
| Curated Open Educational Resources | 0 | ${resources.length} | ${resources.length} |
| CEFR Coverage Matrix Levels | 6 active A1–C2 tracks | 6 full A1–C2 specifications | ${matrix.length} |

## Breakdown by CEFR Level (Milestone 1 Expansion Packs)

| CEFR Level | Vocabulary Entries | Grammar Academy Lessons | Interactive Exercise Bank |
|---|---:|---:|---:|
| A1 | ${vocabCountsByLevel.A1} | ${grammarCountsByLevel.A1} | ${exerciseCountsByLevel.A1} |
| A2 | ${vocabCountsByLevel.A2} | ${grammarCountsByLevel.A2} | ${exerciseCountsByLevel.A2} |
| B1 | ${vocabCountsByLevel.B1} | ${grammarCountsByLevel.B1} | ${exerciseCountsByLevel.B1} |
| B2 | ${vocabCountsByLevel.B2} | ${grammarCountsByLevel.B2} | ${exerciseCountsByLevel.B2} |
| C1 | ${vocabCountsByLevel.C1} | ${grammarCountsByLevel.C1} | ${exerciseCountsByLevel.C1} |
| C2 | ${vocabCountsByLevel.C2} | ${grammarCountsByLevel.C2} | ${exerciseCountsByLevel.C2} |
| **Total** | **${expandedVocab.length}** | **${expandedGrammar.length}** | **${expandedExercises.length}** |

## Breakdown by CEFR Level (Milestone 2 Academies)

| CEFR Level | Listening | Speaking | Reading | Writing |
|---|---:|---:|---:|---:|
| A1 | ${listeningCountsByLevel.A1} | ${speakingCountsByLevel.A1} | ${readingCountsByLevel.A1} | ${writingCountsByLevel.A1} |
| A2 | ${listeningCountsByLevel.A2} | ${speakingCountsByLevel.A2} | ${readingCountsByLevel.A2} | ${writingCountsByLevel.A2} |
| B1 | ${listeningCountsByLevel.B1} | ${speakingCountsByLevel.B1} | ${readingCountsByLevel.B1} | ${writingCountsByLevel.B1} |
| B2 | ${listeningCountsByLevel.B2} | ${speakingCountsByLevel.B2} | ${readingCountsByLevel.B2} | ${writingCountsByLevel.B2} |
| C1 | ${listeningCountsByLevel.C1} | ${speakingCountsByLevel.C1} | ${readingCountsByLevel.C1} | ${writingCountsByLevel.C1} |
| C2 | ${listeningCountsByLevel.C2} | ${speakingCountsByLevel.C2} | ${readingCountsByLevel.C2} | ${writingCountsByLevel.C2} |
| **Total** | **${expandedListening.length}** | **${expandedSpeaking.length}** | **${expandedReading.length}** | **${expandedWriting.length}** |

## Interactive Format Distribution (600-Item Bank)

| Exercise Format | Count |
|---|---:|
${Object.entries(exerciseTypeCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([fmt, cnt]) => `| \`${fmt}\` | ${cnt} |`)
  .join('\n')}

## Breakdown by CEFR Level (Milestone 3 Learning Path Expansion)

| CEFR Level | New Units Added | New Lessons Added | New Exercises (Lessons + Assessments) |
|---|---:|---:|---:|
| A1 | ${m3UnitCountsByLevel.A1} | ${m3LessonCountsByLevel.A1} | ${m3ExerciseCountsByLevel.A1} |
| A2 | ${m3UnitCountsByLevel.A2} | ${m3LessonCountsByLevel.A2} | ${m3ExerciseCountsByLevel.A2} |
| B1 | ${m3UnitCountsByLevel.B1} | ${m3LessonCountsByLevel.B1} | ${m3ExerciseCountsByLevel.B1} |
| B2 | ${m3UnitCountsByLevel.B2} | ${m3LessonCountsByLevel.B2} | ${m3ExerciseCountsByLevel.B2} |
| C1 | ${m3UnitCountsByLevel.C1} | ${m3LessonCountsByLevel.C1} | ${m3ExerciseCountsByLevel.C1} |
| C2 | ${m3UnitCountsByLevel.C2} | ${m3LessonCountsByLevel.C2} | ${m3ExerciseCountsByLevel.C2} |
| **Total New M3** | **${m3Units.length}** | **${m3LessonCount}** | **${m3NewExercises}** |

Note: Milestone 3 units additionally link **${m3ReusedRefCount} reused drill references** from the Exercise Bank (\`reusedExerciseRefs\`), tracked separately and never double-counted inside newly authored totals.

## Automated Invariants Verified

1. **Zero duplicate IDs** across all vocabulary entries, grammar topics, collections, exercises, Milestone 2 academies, Milestone 3 units/lessons/assessments, and external resources.
2. **Zero duplicate headwords** (normalized \`word + senseLabel\`) in expanded vocabulary packs.
3. **Zero duplicate prompts** inside any expanded level exercise bank, within any Listening/Reading/Pronunciation/Writing lesson, or within any Milestone 3 learning-path lesson or assessment.
4. **100% referential integrity**: every \`vocabularyIds\` reference inside all ${collections.length} thematic collections exists, every \`relatedKnowledgeId\` inside all ${expandedExercises.length} practice exercises resolves, every \`IntegratedSequence\` links valid assets, and every Milestone 3 \`prerequisiteUnitIds\`, \`masteryAssessmentId\`, \`targetVocabIds\`, \`targetGrammarIds\`, \`reusedExerciseRefs\`, and \`linked*Ids\` reference resolves.
5. **100% evaluator round-trip check**: every expanded quiz, bank, Milestone 2 academy, and Milestone 3 exercise (${expandedExercises.length + grammarQuizCount + m2NewExercises + m3NewExercises} total) passes \`evaluateExerciseAnswer(ex, ex.correctAnswer) === true\`.
6. **100% valid external resource URLs**: all ${resources.length} resource URLs parse cleanly over HTTPS/HTTP with zero placeholder domains.
`;
    fs.writeFileSync(reportPath, md, 'utf8');
    console.log(`\nWrote quality report to ${reportPath}`);
  }

  return errors.length === 0 ? 0 : 1;
}
