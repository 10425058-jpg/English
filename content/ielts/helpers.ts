import type {
  CEFRLevel,
  Exercise,
  ExerciseType,
  IELTSIdeaVocabTopic,
  IELTSListeningActivity,
  IELTSListeningPart,
  IELTSReadingPassage,
  IELTSSpeakingActivity,
  IELTSSpeakingPart,
  IELTSWritingTask,
  SkillTag,
} from '@english-quest/shared';

interface IeltsExerciseSeed {
  id: string;
  lessonId: string;
  type: ExerciseType;
  instruction: string;
  prompt: string;
  promptTranslationVi?: string;
  passage?: string;
  audioText?: string;
  options?: string[];
  wordBank?: string[];
  correctAnswer: string | string[];
  acceptableAnswers?: string[];
  minWords?: number;
  requiredKeywords?: string[];
  hint?: string;
  explanation: string;
  explanationVi?: string;
  difficulty?: 1 | 2 | 3;
  skills: SkillTag[];
}

export function iEx(seed: IeltsExerciseSeed): Exercise {
  return {
    ...seed,
    difficulty: seed.difficulty ?? 3,
    xpReward: 15,
  };
}

export function createIeltsListening(seed: IELTSListeningActivity): IELTSListeningActivity {
  return seed;
}

export function createIeltsSpeaking(seed: IELTSSpeakingActivity): IELTSSpeakingActivity {
  return seed;
}

export function createIeltsReading(seed: IELTSReadingPassage): IELTSReadingPassage {
  return seed;
}

export function createIeltsWriting(seed: IELTSWritingTask): IELTSWritingTask {
  return seed;
}

export function createIeltsIdeaPack(seed: IELTSIdeaVocabTopic): IELTSIdeaVocabTopic {
  return seed;
}

export const IELTS_LISTENING_PART_LABELS: Record<IELTSListeningPart, string> = {
  part_1: 'Part 1 • Everyday Social Dialogue',
  part_2: 'Part 2 • Everyday Social Monologue',
  part_3: 'Part 3 • Academic Seminar Discussion',
  part_4: 'Part 4 • Academic Lecture',
};

export const IELTS_SPEAKING_PART_LABELS: Record<IELTSSpeakingPart, string> = {
  part_1: 'Part 1 • Interview & Familiar Topics',
  part_2: 'Part 2 • 2-Minute Long Turn Cue Card',
  part_3: 'Part 3 • Abstract Analytical Discussion',
};

export type { CEFRLevel };
