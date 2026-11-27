import type { CEFRLevel, Exercise, GrammarTopic } from '@english-quest/shared';

export interface DeepGrammarInput {
  id: string;
  cefrLevel: CEFRLevel;
  title: string;
  summary: string;
  summaryVi: string;
  objectives: string[];
  detailedExplanation: string;
  structures: Array<{ label: string; formula: string; example: string }>;
  usageRules: string[];
  exceptions: string[];
  examples: Array<{ english: string; vietnamese: string; note?: string }>;
  commonMistakes: Array<{ wrong: string; right: string; why: string }>;
  comparisons: Array<{ structure: string; difference: string; example: string }>;
  speakingTip: string;
  writingTip: string;
  reviewSummary: string;
  quiz: Exercise[];
}

export function createGrammarLesson(input: DeepGrammarInput): GrammarTopic {
  return {
    id: input.id,
    cefrLevel: input.cefrLevel,
    title: input.title,
    summary: input.summary,
    summaryVi: input.summaryVi,
    objectives: input.objectives,
    detailedExplanation: input.detailedExplanation,
    structures: input.structures,
    usageRules: input.usageRules,
    exceptions: input.exceptions,
    examples: input.examples,
    commonMistakes: input.commonMistakes,
    comparisons: input.comparisons,
    speakingTip: input.speakingTip,
    writingTip: input.writingTip,
    reviewSummary: input.reviewSummary,
    quiz: input.quiz,
  };
}

export function gEx(opts: {
  id: string;
  topicId: string;
  type?: Exercise['type'];
  instruction: string;
  prompt: string;
  options?: string[];
  wordBank?: string[];
  correctAnswer: string | string[];
  acceptableAnswers?: string[];
  explanation: string;
  explanationVi?: string;
  difficulty?: 1 | 2 | 3;
}): Exercise {
  return {
    id: opts.id,
    lessonId: opts.topicId,
    type: opts.type ?? 'multiple_choice',
    instruction: opts.instruction,
    prompt: opts.prompt,
    options: opts.options,
    wordBank: opts.wordBank,
    correctAnswer: opts.correctAnswer,
    acceptableAnswers: opts.acceptableAnswers,
    explanation: opts.explanation,
    explanationVi: opts.explanationVi,
    difficulty: opts.difficulty ?? 2,
    skills: ['grammar'],
    xpReward: 10,
    relatedKnowledgeId: opts.topicId,
    reviewRecommendation: `Review grammar lesson ${opts.topicId}`,
  };
}
