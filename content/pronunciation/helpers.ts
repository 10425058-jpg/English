import type {
  CEFRLevel,
  Exercise,
  PronunciationCategory,
  PronunciationLesson,
} from '@english-quest/shared';

export interface PronunciationExerciseSeed {
  id: string;
  lessonId: string;
  type: 'pronunciation_discrimination' | 'audio_recognition' | 'multiple_choice';
  instruction: string;
  prompt: string;
  audioText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  explanationVi: string;
  difficulty: 1 | 2 | 3;
}

export function pEx(seed: PronunciationExerciseSeed): Exercise {
  return {
    id: seed.id,
    lessonId: seed.lessonId,
    type: seed.type,
    instruction: seed.instruction,
    prompt: seed.prompt,
    audioText: seed.audioText,
    options: seed.options,
    correctAnswer: seed.correctAnswer,
    explanation: seed.explanation,
    explanationVi: seed.explanationVi,
    difficulty: seed.difficulty,
    skills: ['speaking', 'listening'],
    xpReward: seed.difficulty === 3 ? 14 : 10,
  };
}

export interface CompactPronunciationInput {
  id: string;
  title: string;
  category: PronunciationCategory;
  cefrLevel: CEFRLevel;
  targetSymbols: string[];
  contrastSymbol?: string;
  articulatoryGuide: string;
  vietnameseLearnerTip: string;
  commonErrors: string[];
  ukUsNote?: string;
  minimalPairs: Array<{
    wordA: string;
    ipaA: string;
    wordB: string;
    ipaB: string;
    differenceNote: string;
  }>;
  practiceWords: Array<{ word: string; ipa: string; stressPattern?: string }>;
  practiceSentences: Array<{ text: string; focusHighlight: string }>;
  listeningExercises: PronunciationExerciseSeed[];
}

export function createPronunciationLesson(
  input: CompactPronunciationInput
): PronunciationLesson {
  return {
    ...input,
    listeningExercises: input.listeningExercises.map(pEx),
  };
}
