import type {
  CEFRLevel,
  EnglishAccent,
  Exercise,
  ListeningCategory,
  ListeningContent,
  SkillTag,
} from '@english-quest/shared';

export interface ListeningExerciseSeed {
  id: string;
  lessonId: string;
  type: 'multiple_choice' | 'audio_recognition' | 'dictation' | 'fill_blank';
  instruction: string;
  prompt: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint?: string;
  explanation: string;
  explanationVi: string;
  difficulty: 1 | 2 | 3;
}

export function lEx(input: ListeningExerciseSeed): Exercise {
  const skills: SkillTag[] =
    input.type === 'dictation' ? ['listening', 'writing'] : ['listening'];
  return {
    id: input.id,
    lessonId: input.lessonId,
    type: input.type,
    instruction: input.instruction,
    prompt: input.prompt,
    ...(input.audioText ? { audioText: input.audioText } : {}),
    ...(input.options ? { options: input.options } : {}),
    correctAnswer: input.correctAnswer,
    ...(input.acceptableAnswers ? { acceptableAnswers: input.acceptableAnswers } : {}),
    ...(input.hint ? { hint: input.hint } : {}),
    explanation: input.explanation,
    explanationVi: input.explanationVi,
    difficulty: input.difficulty,
    skills,
    xpReward: input.difficulty === 3 ? 15 : input.difficulty === 2 ? 12 : 10,
  };
}

export interface CompactListeningInput {
  id: string;
  title: string;
  subtitle: string;
  category: ListeningCategory;
  cefrLevel: CEFRLevel;
  accent?: EnglishAccent;
  durationLabel: string;
  learningObjectives: string[];
  preListeningPrompt: string;
  connectedSpeechNotes: string[];
  summaryText: string;
  discussionQuestions: string[];
  scriptLines: Array<{ speaker: string; text: string }>;
  vocabularyNotes: Array<{ term: string; meaning: string; vietnamese: string }>;
  exercises: ListeningExerciseSeed[];
  relatedVocabIds?: string[];
  relatedGrammarIds?: string[];
}

export function createListeningLesson(input: CompactListeningInput): ListeningContent {
  return {
    id: input.id,
    title: input.title,
    subtitle: input.subtitle,
    category: input.category,
    cefrLevel: input.cefrLevel,
    accent: input.accent ?? 'en-US',
    durationLabel: input.durationLabel,
    learningObjectives: input.learningObjectives,
    preListeningPrompt: input.preListeningPrompt,
    connectedSpeechNotes: input.connectedSpeechNotes,
    summaryText: input.summaryText,
    discussionQuestions: input.discussionQuestions,
    relatedVocabIds: input.relatedVocabIds,
    relatedGrammarIds: input.relatedGrammarIds,
    scriptLines: input.scriptLines,
    vocabularyNotes: input.vocabularyNotes,
    exercises: input.exercises.map(lEx),
  };
}
