import type { Exercise, ExerciseType, MatchingPair, SkillTag } from '@english-quest/shared';

export interface BankExerciseInput {
  id: string;
  bankId: string;
  type: ExerciseType;
  instruction: string;
  prompt: string;
  options?: string[];
  pairs?: MatchingPair[];
  wordBank?: string[];
  correctAnswer: string | string[];
  acceptableAnswers?: string[];
  hint?: string;
  explanation: string;
  explanationVi?: string;
  difficulty: 1 | 2 | 3;
  skills: SkillTag[];
  relatedKnowledgeId: string;
  reviewRecommendation: string;
}

export function buildBankExercises(items: BankExerciseInput[]): Exercise[] {
  return items.map((it) => ({
    id: it.id,
    lessonId: it.bankId,
    type: it.type,
    instruction: it.instruction,
    prompt: it.prompt,
    ...(it.options ? { options: it.options } : {}),
    ...(it.pairs ? { pairs: it.pairs } : {}),
    ...(it.wordBank ? { wordBank: it.wordBank } : {}),
    correctAnswer: it.correctAnswer,
    ...(it.acceptableAnswers ? { acceptableAnswers: it.acceptableAnswers } : {}),
    ...(it.hint ? { hint: it.hint } : {}),
    explanation: it.explanation,
    ...(it.explanationVi ? { explanationVi: it.explanationVi } : {}),
    difficulty: it.difficulty,
    skills: it.skills,
    xpReward: it.difficulty === 3 ? 15 : it.difficulty === 2 ? 12 : 10,
    relatedKnowledgeId: it.relatedKnowledgeId,
    reviewRecommendation: it.reviewRecommendation,
  }));
}

type Diff = 1 | 2 | 3;

export function exBank(
  id: string,
  bankId: string,
  type: ExerciseType,
  instruction: string,
  prompt: string,
  correctAnswer: string | string[],
  explanation: string,
  explanationVi: string,
  relatedKnowledgeId: string,
  opts: {
    options?: string[];
    pairs?: MatchingPair[];
    wordBank?: string[];
    acceptableAnswers?: string[];
    hint?: string;
    difficulty?: Diff;
    skills?: SkillTag[];
    review?: string;
  } = {}
): Exercise {
  const difficulty = opts.difficulty ?? 2;
  return {
    id,
    lessonId: bankId,
    type,
    instruction,
    prompt,
    ...(opts.options ? { options: opts.options } : {}),
    ...(opts.pairs ? { pairs: opts.pairs } : {}),
    ...(opts.wordBank ? { wordBank: opts.wordBank } : {}),
    correctAnswer,
    ...(opts.acceptableAnswers ? { acceptableAnswers: opts.acceptableAnswers } : {}),
    ...(opts.hint ? { hint: opts.hint } : {}),
    explanation,
    explanationVi,
    difficulty,
    skills: opts.skills ?? (relatedKnowledgeId.startsWith('gram-') ? ['grammar'] : ['vocabulary']),
    xpReward: difficulty === 3 ? 15 : difficulty === 2 ? 12 : 10,
    relatedKnowledgeId,
    reviewRecommendation: opts.review ?? `Review ${relatedKnowledgeId}`,
  };
}

export function exMatch(
  id: string,
  bankId: string,
  instruction: string,
  pairs: Array<[string, string]>,
  explanation: string,
  explanationVi: string,
  relatedKnowledgeId: string,
  difficulty: Diff = 2
): Exercise {
  const mapped: MatchingPair[] = pairs.map(([left, right], i) => ({ id: `${id}-p${i + 1}`, left, right }));
  return exBank(
    id,
    bankId,
    'definition_matching',
    instruction,
    'Tap a term on the left, then select its matching meaning or gloss on the right.',
    mapped.map((p) => `${p.left}=${p.right}`).join('; '),
    explanation,
    explanationVi,
    relatedKnowledgeId,
    { pairs: mapped, difficulty, skills: ['vocabulary', 'reading'] }
  );
}
