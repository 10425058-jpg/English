import type { CEFRLevel, ReadingPassage, SkillTag } from '@english-quest/shared';

export interface ReadingQuestionSeed {
  id: string;
  lessonId: string;
  type: 'reading_comprehension' | 'multiple_choice' | 'fill_blank';
  questionStyle:
    | 'multiple_choice'
    | 'true_false_not_given'
    | 'matching_headings'
    | 'sentence_completion'
    | 'main_idea'
    | 'inference'
    | 'summary_completion';
  instruction: string;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint?: string;
  explanation: string;
  explanationVi: string;
  difficulty: 1 | 2 | 3;
}

export function rEx(
  seed: ReadingQuestionSeed
): ReadingPassage['questions'][number] {
  const skills: SkillTag[] = ['reading'];
  return {
    id: seed.id,
    lessonId: seed.lessonId,
    type: seed.type,
    questionStyle: seed.questionStyle,
    instruction: seed.instruction,
    prompt: seed.prompt,
    ...(seed.options ? { options: seed.options } : {}),
    correctAnswer: seed.correctAnswer,
    ...(seed.acceptableAnswers ? { acceptableAnswers: seed.acceptableAnswers } : {}),
    ...(seed.hint ? { hint: seed.hint } : {}),
    explanation: seed.explanation,
    explanationVi: seed.explanationVi,
    difficulty: seed.difficulty,
    skills,
    xpReward: seed.difficulty === 3 ? 15 : 12,
  };
}

export interface CompactReadingInput {
  id: string;
  title: string;
  category: ReadingPassage['category'];
  cefrLevel: CEFRLevel;
  estimatedMinutes: number;
  readingStrategy: string;
  summaryPrompt: string;
  keyTakeaways: string[];
  paragraphs: string[];
  glossary: ReadingPassage['glossary'];
  questions: ReadingQuestionSeed[];
  relatedVocabIds?: string[];
  relatedGrammarIds?: string[];
}

export function countPassageWords(paragraphs: string[]): number {
  return paragraphs
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function createReadingPassage(input: CompactReadingInput): ReadingPassage {
  return {
    id: input.id,
    title: input.title,
    category: input.category,
    cefrLevel: input.cefrLevel,
    estimatedMinutes: input.estimatedMinutes,
    wordCount: countPassageWords(input.paragraphs),
    readingStrategy: input.readingStrategy,
    summaryPrompt: input.summaryPrompt,
    keyTakeaways: input.keyTakeaways,
    relatedVocabIds: input.relatedVocabIds,
    relatedGrammarIds: input.relatedGrammarIds,
    paragraphs: input.paragraphs,
    glossary: input.glossary,
    questions: input.questions.map(rEx),
  };
}
