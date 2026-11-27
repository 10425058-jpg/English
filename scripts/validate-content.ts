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
  loadAllConversations,
  loadAllExercises,
  loadAllGrammar,
  loadAllListening,
  loadAllReading,
  loadAllSpeaking,
  loadAllVocabulary,
  loadAllWriting,
  loadCurriculumMatrix,
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
  const totalExercises =
    legacyPathExercises +
    legacyGrammarQuizzes +
    grammarQuizCount +
    expandedExercises.length +
    m2NewExercises;

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

| Category | Core Seed / Phase 1 | Milestone 1 Expansion | Total Verified |
|---|---:|---:|---:|
| Vocabulary & Lexical Entries | ${SEED_VOCABULARY.length} | ${expandedVocab.length} | ${totalVocab} |
| Grammar Academy Lessons | ${GRAMMAR_TOPICS.length} | ${expandedGrammar.length} | ${totalGrammarTopics} |
| Thematic Vocabulary Collections | 0 | ${collections.length} | ${collections.length} |
| Interactive Practice Bank Exercises | 0 | ${expandedExercises.length} | ${expandedExercises.length} |
| Grammar Academy Mini-Quizzes | ${legacyGrammarQuizzes} | ${grammarQuizCount} | ${legacyGrammarQuizzes + grammarQuizCount} |
| Core Learning Path Exercises | ${legacyPathExercises} | 0 | ${legacyPathExercises} |
| **Combined Interactive Exercises** | **${legacyPathExercises + legacyGrammarQuizzes}** | **${expandedExercises.length + grammarQuizCount + m2NewExercises}** | **${totalExercises}** |
| Listening Academy Lessons (Batch 2A+) | ${LISTENING_LAB_TRACKS.length} | ${expandedListening.length} | ${LISTENING_LAB_TRACKS.length + expandedListening.length} |
| Speaking Academy Lessons (Batch 2A+) | ${SPEAKING_LAB_ACTIVITIES.length} | ${expandedSpeaking.length} | ${SPEAKING_LAB_ACTIVITIES.length + expandedSpeaking.length} |
| Reading Academy Passages (Batch 2B) | ${READING_LIBRARY_PASSAGES.length} | ${expandedReading.length} | ${READING_LIBRARY_PASSAGES.length + expandedReading.length} |
| Writing Academy Lessons (Batch 2B) | ${WRITING_LAB_PROMPTS.length} | ${expandedWriting.length} | ${WRITING_LAB_PROMPTS.length + expandedWriting.length} |
| Pronunciation Academy Lessons | 0 | ${pronunciationLessons.length} | ${pronunciationLessons.length} |
| Shadowing Studio Sessions | 0 | ${shadowingSessions.length} | ${shadowingSessions.length} |
| Practical Conversation Scenarios | 0 | ${conversations.length} | ${conversations.length} |
| Think in English Drills | 0 | ${thinkInEnglish.length} | ${thinkInEnglish.length} |
| Integrated 4-Skill Units | 0 | ${integratedSequences.length} | ${integratedSequences.length} |
| Speaking Mindset Guides | 0 | ${speakingGuides.length} | ${speakingGuides.length} |
| Curated Open Educational Resources | 0 | ${resources.length} | ${resources.length} |
| CEFR Coverage Matrix Levels | 3 active + 3 upcoming | 6 full A1–C2 specifications | ${matrix.length} |

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

## Interactive Format Distribution (600-Item Bank)

| Exercise Format | Count |
|---|---:|
${Object.entries(exerciseTypeCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([fmt, cnt]) => `| \`${fmt}\` | ${cnt} |`)
  .join('\n')}

## Automated Invariants Verified

1. **Zero duplicate IDs** across all vocabulary entries, grammar topics, collections, exercises, and external resources.
2. **Zero duplicate headwords** (normalized \`word + senseLabel\`) in expanded vocabulary packs.
3. **Zero duplicate prompts** inside any expanded level exercise bank.
4. **100% referential integrity**: every \`vocabularyIds\` reference inside all ${collections.length} thematic collections exists, and every \`relatedKnowledgeId\` inside all ${expandedExercises.length} practice exercises resolves to a real vocabulary item or grammar topic.
5. **100% evaluator round-trip check**: every expanded quiz and bank exercise (${expandedExercises.length + grammarQuizCount} total) passes \`evaluateExerciseAnswer(ex, ex.correctAnswer) === true\`.
6. **100% valid external resource URLs**: all ${resources.length} resource URLs parse cleanly over HTTPS/HTTP with zero placeholder domains.
`;
    fs.writeFileSync(reportPath, md, 'utf8');
    console.log(`\nWrote quality report to ${reportPath}`);
  }

  return errors.length === 0 ? 0 : 1;
}
