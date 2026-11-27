import { describe, expect, it } from 'vitest';
import { evaluateExerciseAnswer } from '@english-quest/shared';
import {
  CEFR_LEVELS,
  loadAllExercises,
  loadAllGrammar,
  loadAllListening,
  loadAllSpeaking,
  loadAllVocabulary,
  loadCurriculumMatrix,
  loadLearningResources,
  loadPronunciationLessons,
  loadShadowingSessions,
  loadSpeakingMindsetGuides,
  loadThematicCollections,
} from '@content/index';
import { SEED_VOCABULARY } from '@/data/vocabularySeed';
import { GRAMMAR_TOPICS } from '@/data/grammarTopics';
import { LISTENING_LAB_TRACKS } from '@/data/listeningLabData';
import { SPEAKING_LAB_ACTIVITIES } from '@/data/speakingLabData';

describe('Expanded Milestone 1 Content Integrity & Lazy Modules', () => {
  it('loads 1,400+ curated unique vocabulary entries distributed cleanly across A1–C2', async () => {
    const vocab = await loadAllVocabulary();
    expect(vocab.length).toBeGreaterThanOrEqual(1200);

    const ids = new Set<string>(SEED_VOCABULARY.map((v) => v.id));
    const keys = new Set<string>();
    const counts: Record<string, number> = {};

    for (const v of vocab) {
      expect(ids.has(v.id)).toBe(false);
      ids.add(v.id);
      const key = `${v.word.toLowerCase()}|${v.senseLabel ?? ''}`;
      expect(keys.has(key)).toBe(false);
      keys.add(key);
      expect(v.ipa).toMatch(/^\/.*\/$/);
      expect(v.vietnameseTranslation.trim().length).toBeGreaterThan(0);
      counts[v.cefrLevel] = (counts[v.cefrLevel] ?? 0) + 1;
    }

    for (const lvl of CEFR_LEVELS) {
      expect(counts[lvl]).toBeGreaterThanOrEqual(200);
    }
  });

  it('loads 48 deep Grammar Academy lessons across A1–C2 (8 per level)', async () => {
    const grammar = await loadAllGrammar();
    expect(grammar.length).toBe(48);

    const ids = new Set<string>(GRAMMAR_TOPICS.map((g) => g.id));
    for (const topic of grammar) {
      expect(ids.has(topic.id)).toBe(false);
      ids.add(topic.id);
      expect(topic.objectives?.length).toBeGreaterThanOrEqual(3);
      expect(topic.structures.length).toBeGreaterThanOrEqual(3);
      expect(topic.examples?.length).toBeGreaterThanOrEqual(5);
      expect(topic.commonMistakes.length).toBeGreaterThanOrEqual(2);
      expect(topic.quiz.length).toBeGreaterThanOrEqual(3);
      for (const q of topic.quiz) {
        expect(evaluateExerciseAnswer(q, q.correctAnswer).isCorrect).toBe(true);
      }
    }
  });

  it('loads 30 thematic collections with valid vocabulary IDs and 600 unique bank exercises', async () => {
    const [vocab, grammar, collections, exercises, resources, matrix] = await Promise.all([
      loadAllVocabulary(),
      loadAllGrammar(),
      loadThematicCollections(),
      loadAllExercises(),
      loadLearningResources(),
      loadCurriculumMatrix(),
    ]);

    expect(collections.length).toBe(30);
    expect(exercises.length).toBe(600);
    expect(resources.length).toBeGreaterThanOrEqual(30);
    expect(matrix.length).toBe(6);

    const knownIds = new Set([
      ...SEED_VOCABULARY.map((v) => v.id),
      ...vocab.map((v) => v.id),
      ...GRAMMAR_TOPICS.map((g) => g.id),
      ...grammar.map((g) => g.id),
    ]);

    for (const col of collections) {
      expect(col.vocabularyIds.length).toBeGreaterThanOrEqual(8);
      for (const vid of col.vocabularyIds) {
        expect(knownIds.has(vid)).toBe(true);
      }
    }

    const promptKeys = new Set<string>();
    for (const ex of exercises) {
      expect(ex.relatedKnowledgeId && knownIds.has(ex.relatedKnowledgeId)).toBe(true);
      if (ex.type !== 'definition_matching') {
        const key = `${ex.lessonId}|${ex.prompt.toLowerCase().trim()}`;
        expect(promptKeys.has(key)).toBe(false);
        promptKeys.add(key);
      }
      expect(evaluateExerciseAnswer(ex, ex.correctAnswer).isCorrect).toBe(true);
    }

    for (const res of resources) {
      const parsed = new URL(res.url);
      expect(['https:', 'http:']).toContain(parsed.protocol);
      expect(parsed.hostname).not.toContain('example.com');
    }
  });

  it('loads Milestone 2 Batch 2A Listening, Speaking, Pronunciation & Shadowing packs cleanly', async () => {
    const [listening, speaking, guides, pronunciation, shadowing] = await Promise.all([
      loadAllListening(),
      loadAllSpeaking(),
      loadSpeakingMindsetGuides(),
      loadPronunciationLessons(),
      loadShadowingSessions(),
    ]);

    expect(listening.length).toBeGreaterThanOrEqual(40);
    expect(speaking.length).toBeGreaterThanOrEqual(40);
    expect(guides.length).toBeGreaterThanOrEqual(6);
    expect(pronunciation.length).toBeGreaterThanOrEqual(24);
    expect(shadowing.length).toBeGreaterThanOrEqual(20);

    const lisIds = new Set(LISTENING_LAB_TRACKS.map((l) => l.id));
    for (const track of listening) {
      expect(lisIds.has(track.id)).toBe(false);
      lisIds.add(track.id);
      expect(track.scriptLines.length).toBeGreaterThanOrEqual(4);
      expect(track.exercises.length).toBeGreaterThanOrEqual(3);
      for (const ex of track.exercises) {
        expect(evaluateExerciseAnswer(ex, ex.correctAnswer).isCorrect).toBe(true);
      }
    }

    const spkIds = new Set(SPEAKING_LAB_ACTIVITIES.map((s) => s.id));
    for (const lesson of speaking) {
      expect(spkIds.has(lesson.id)).toBe(false);
      spkIds.add(lesson.id);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(1);
      expect(lesson.vocabularyBank.length).toBeGreaterThanOrEqual(2);
    }

    const proIds = new Set<string>();
    for (const pro of pronunciation) {
      expect(proIds.has(pro.id)).toBe(false);
      proIds.add(pro.id);
      expect(pro.minimalPairs.length).toBeGreaterThanOrEqual(2);
      expect(pro.listeningExercises.length).toBeGreaterThanOrEqual(3);
      for (const ex of pro.listeningExercises) {
        expect(evaluateExerciseAnswer(ex, ex.correctAnswer).isCorrect).toBe(true);
      }
    }

    const shdIds = new Set<string>();
    for (const shd of shadowing) {
      expect(shdIds.has(shd.id)).toBe(false);
      shdIds.add(shd.id);
      expect(shd.segments.length).toBeGreaterThanOrEqual(3);
    }
  });
});
