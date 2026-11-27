import type { CEFRLevel, Exercise, MatchingPair, SkillTag } from '@english-quest/shared';

interface BaseOpts {
  id: string;
  lessonId: string;
  instruction: string;
  prompt: string;
  promptTranslationVi?: string;
  hint?: string;
  explanation: string;
  explanationVi?: string;
  difficulty?: 1 | 2 | 3;
  skills: SkillTag[];
  xpReward?: number;
}

export function mc(
  opts: BaseOpts & {
    type?: 'multiple_choice' | 'vocabulary_recognition' | 'grammar_challenge' | 'error_correction' | 'dialogue_completion' | 'scenario_conversation';
    options: string[];
    correctAnswer: string;
    dialogueContext?: Array<{ speaker: string; line: string }>;
  }
): Exercise {
  return {
    id: opts.id,
    lessonId: opts.lessonId,
    type: opts.type ?? 'multiple_choice',
    instruction: opts.instruction,
    prompt: opts.prompt,
    promptTranslationVi: opts.promptTranslationVi,
    dialogueContext: opts.dialogueContext,
    options: opts.options,
    correctAnswer: opts.correctAnswer,
    hint: opts.hint,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 1,
    skills: opts.skills,
    xpReward: opts.xpReward ?? 10,
  };
}

export function fill(
  opts: BaseOpts & {
    correctAnswer: string;
    acceptableAnswers?: string[];
    options?: string[];
  }
): Exercise {
  return {
    id: opts.id,
    lessonId: opts.lessonId,
    type: 'fill_blank',
    instruction: opts.instruction,
    prompt: opts.prompt,
    promptTranslationVi: opts.promptTranslationVi,
    options: opts.options,
    correctAnswer: opts.correctAnswer,
    acceptableAnswers: opts.acceptableAnswers,
    hint: opts.hint,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 1,
    skills: opts.skills,
    xpReward: opts.xpReward ?? 10,
  };
}

export function order(
  opts: BaseOpts & {
    wordBank: string[];
    correctAnswer: string[];
  }
): Exercise {
  return {
    id: opts.id,
    lessonId: opts.lessonId,
    type: 'sentence_reconstruction',
    instruction: opts.instruction,
    prompt: opts.prompt,
    promptTranslationVi: opts.promptTranslationVi,
    wordBank: opts.wordBank,
    correctAnswer: opts.correctAnswer,
    hint: opts.hint,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 1,
    skills: opts.skills,
    xpReward: opts.xpReward ?? 12,
  };
}

export function trans(
  opts: BaseOpts & {
    correctAnswer: string;
    acceptableAnswers?: string[];
  }
): Exercise {
  return {
    id: opts.id,
    lessonId: opts.lessonId,
    type: 'translation',
    instruction: opts.instruction,
    prompt: opts.prompt,
    promptTranslationVi: opts.promptTranslationVi,
    correctAnswer: opts.correctAnswer,
    acceptableAnswers: opts.acceptableAnswers,
    hint: opts.hint,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 1,
    skills: opts.skills,
    xpReward: opts.xpReward ?? 12,
  };
}

export function match(
  opts: BaseOpts & {
    pairs: MatchingPair[];
  }
): Exercise {
  return {
    id: opts.id,
    lessonId: opts.lessonId,
    type: 'word_matching',
    instruction: opts.instruction,
    prompt: opts.prompt,
    pairs: opts.pairs,
    correctAnswer: opts.pairs.map((p) => `${p.left}=${p.right}`).join('; '),
    hint: opts.hint,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 1,
    skills: opts.skills,
    xpReward: opts.xpReward ?? 12,
  };
}

export function audioEx(
  opts: BaseOpts & {
    type: 'audio_recognition' | 'dictation';
    audioText: string;
    options?: string[];
    correctAnswer: string;
    acceptableAnswers?: string[];
  }
): Exercise {
  return {
    id: opts.id,
    lessonId: opts.lessonId,
    type: opts.type,
    instruction: opts.instruction,
    prompt: opts.prompt,
    audioText: opts.audioText,
    options: opts.options,
    correctAnswer: opts.correctAnswer,
    acceptableAnswers: opts.acceptableAnswers,
    hint: opts.hint,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 1,
    skills: opts.skills,
    xpReward: opts.xpReward ?? 12,
  };
}

export function speakEx(
  opts: BaseOpts & {
    audioText: string;
    correctAnswer: string;
    acceptableAnswers?: string[];
  }
): Exercise {
  return {
    id: opts.id,
    lessonId: opts.lessonId,
    type: 'speaking',
    instruction: opts.instruction,
    prompt: opts.prompt,
    audioText: opts.audioText,
    correctAnswer: opts.correctAnswer,
    acceptableAnswers: opts.acceptableAnswers,
    hint: opts.hint,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 1,
    skills: opts.skills,
    xpReward: opts.xpReward ?? 12,
  };
}

export function readEx(
  opts: BaseOpts & {
    passage: string;
    options: string[];
    correctAnswer: string;
  }
): Exercise {
  return {
    id: opts.id,
    lessonId: opts.lessonId,
    type: 'reading_comprehension',
    instruction: opts.instruction,
    prompt: opts.prompt,
    passage: opts.passage,
    options: opts.options,
    correctAnswer: opts.correctAnswer,
    hint: opts.hint,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 1,
    skills: opts.skills,
    xpReward: opts.xpReward ?? 12,
  };
}

export function writeEx(
  opts: BaseOpts & {
    minWords?: number;
    requiredKeywords?: string[];
    correctAnswer: string;
  }
): Exercise {
  return {
    id: opts.id,
    lessonId: opts.lessonId,
    type: 'free_writing',
    instruction: opts.instruction,
    prompt: opts.prompt,
    minWords: opts.minWords ?? 6,
    requiredKeywords: opts.requiredKeywords,
    correctAnswer: opts.correctAnswer,
    hint: opts.hint,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 1,
    skills: opts.skills,
    xpReward: opts.xpReward ?? 15,
  };
}

export const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
