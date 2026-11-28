import type { CEFRLevel, Exercise, SkillTag, WritingLesson } from '@english-quest/shared';

export interface WritingPracticeSeed {
  id: string;
  lessonId: string;
  type:
    | 'multiple_choice'
    | 'error_correction'
    | 'sentence_transformation'
    | 'fill_blank'
    | 'sentence_ordering';
  instruction: string;
  prompt: string;
  options?: string[];
  wordBank?: string[];
  correctAnswer: string | string[];
  acceptableAnswers?: string[];
  hint?: string;
  explanation: string;
  explanationVi: string;
  difficulty: 1 | 2 | 3;
}

export function wEx(seed: WritingPracticeSeed): Exercise {
  const skills: SkillTag[] = ['writing', 'grammar'];
  return {
    id: seed.id,
    lessonId: seed.lessonId,
    type: seed.type,
    instruction: seed.instruction,
    prompt: seed.prompt,
    ...(seed.options ? { options: seed.options } : {}),
    ...(seed.wordBank ? { wordBank: seed.wordBank } : {}),
    correctAnswer: seed.correctAnswer,
    ...(seed.acceptableAnswers ? { acceptableAnswers: seed.acceptableAnswers } : {}),
    ...(seed.hint ? { hint: seed.hint } : {}),
    explanation: seed.explanation,
    explanationVi: seed.explanationVi,
    difficulty: seed.difficulty,
    skills,
    xpReward: seed.difficulty === 3 ? 14 : 10,
  };
}

export interface CompactWritingInput {
  id: string;
  title: string;
  category: WritingLesson['category'];
  cefrLevel: CEFRLevel;
  prompt: string;
  instructions: string;
  objectives: string[];
  modelOutline: string[];
  usefulVocabulary: Array<{ term: string; meaning: string; vietnamese: string }>;
  usefulStructures: Array<{ pattern: string; example: string }>;
  minWords: number;
  targetWords: number;
  checklist: string[];
  rubric: Array<{ criterion: string; description: string }>;
  commonMistakes: Array<{ issue: string; fix: string }>;
  sampleResponse: string;
  annotatedModelNotes: string[];
  practiceExercises: WritingPracticeSeed[];
}

export function createWritingLesson(input: CompactWritingInput): WritingLesson {
  return {
    ...input,
    practiceExercises: input.practiceExercises.map(wEx),
  };
}
