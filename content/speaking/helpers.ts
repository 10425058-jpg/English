import type {
  CEFRLevel,
  SpeakingActivityType,
  SpeakingCategory,
  SpeakingLesson,
} from '@english-quest/shared';

export interface CompactSpeakingInput {
  id: string;
  title: string;
  activityType: SpeakingActivityType;
  category: SpeakingCategory;
  cefrLevel: CEFRLevel;
  prompt: string;
  promptVi: string;
  objectives: string[];
  preparationQuestions: string[];
  modelText: string;
  modelComparisonByLevel: Partial<Record<'basic' | 'natural' | 'advanced', string>>;
  alternativeResponses: string[];
  vocabularyBank: Array<{ term: string; meaning: string; vietnamese: string }>;
  naturalExpressions: string[];
  sentenceStructures: Array<{ frame: string; example: string }>;
  suggestedOrganization: string[];
  commonMistakes: Array<{ mistake: string; correction: string; why: string }>;
  followUpQuestions: string[];
  improvementStrategies: string[];
  tips: string[];
  selfChecklist: string[];
  keyVocabulary: string[];
  suggestedSeconds: number;
  scene?: 'cafe' | 'airport' | 'workspace' | 'park';
  roleplayTurns?: Array<{ partner: string; cue: string }>;
  relatedVocabIds?: string[];
  relatedGrammarIds?: string[];
}

export function createSpeakingLesson(input: CompactSpeakingInput): SpeakingLesson {
  return {
    ...input,
  };
}
