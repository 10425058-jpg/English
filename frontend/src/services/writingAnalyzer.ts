import type { CEFRLevel, WritingSubmission } from '@english-quest/shared';

export interface WritingPromptItem {
  id: string;
  title: string;
  category:
    | 'sentence_construction'
    | 'grammar_correction'
    | 'sentence_transformation'
    | 'paragraph'
    | 'email'
    | 'story'
    | 'academic_essay'
    | 'argumentative_essay'
    | 'ielts_task_1'
    | 'ielts_task_2';
  cefrLevel: CEFRLevel;
  prompt: string;
  instructions: string;
  minWords: number;
  targetWords: number;
  checklist: string[];
  sampleResponse: string;
}

const LINKING_WORDS = [
  'however',
  'moreover',
  'therefore',
  'because',
  'although',
  'firstly',
  'secondly',
  'finally',
  'in addition',
  'for example',
  'on the other hand',
  'as a result',
  'in conclusion',
  'while',
  'since',
];

const UPGRADE_PAIRS: Array<{ basic: RegExp; suggestion: string }> = [
  { basic: /\bvery good\b/gi, suggestion: 'Try "excellent", "effective", or "beneficial" instead of "very good".' },
  { basic: /\bvery bad\b/gi, suggestion: 'Try "harmful", "challenging", or "inadequate" instead of "very bad".' },
  { basic: /\ba lot of\b/gi, suggestion: 'In formal writing, consider "a significant number of" or "numerous" instead of "a lot of".' },
  { basic: /\bthings\b/gi, suggestion: 'Replace vague "things" with specific nouns such as "factors", "aspects", or "habits".' },
  { basic: /\bvery important\b/gi, suggestion: 'Try "crucial", "essential", or "vital" instead of "very important".' },
];

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export function analyzeWritingLocally(
  prompt: WritingPromptItem,
  originalText: string
): WritingSubmission['feedback'] {
  const trimmed = originalText.trim();
  const words = trimmed ? trimmed.split(/\s+/) : [];
  const wordCount = words.length;
  const sentences = trimmed
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const lower = trimmed.toLowerCase();

  const strengths: string[] = [];
  const grammarNotes: Array<{ excerpt: string; suggestion: string; explanation: string }> = [];
  const vocabularySuggestions: string[] = [];
  const improvements: string[] = [];

  if (wordCount >= prompt.targetWords) {
    strengths.push(`Great length: ${wordCount} words meets or exceeds the ${prompt.targetWords}-word target.`);
  } else if (wordCount >= prompt.minWords) {
    strengths.push(`Good progress (${wordCount} words). Aim for ${prompt.targetWords}+ words for stronger development.`);
  } else {
    improvements.push(`Expand your response from ${wordCount} words to at least ${prompt.minWords} words with concrete examples.`);
  }

  const usedLinkers = LINKING_WORDS.filter((lw) => lower.includes(lw));
  if (usedLinkers.length >= 2) {
    strengths.push(`Nice cohesion using linking words (${usedLinkers.slice(0, 4).join(', ')}).`);
  } else {
    improvements.push('Add clear transition words (e.g., "However", "For example", "Therefore") to connect ideas.');
  }

  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z']/g, '')).filter(Boolean));
  const lexicalRatio = wordCount > 0 ? uniqueWords.size / wordCount : 0;
  if (lexicalRatio >= 0.55 && wordCount >= 20) {
    strengths.push('Solid vocabulary variety with minimal repetition.');
  }

  // Common deterministic grammar/mechanics checks
  if (/\bi\b/.test(trimmed)) {
    grammarNotes.push({
      excerpt: 'lowercase "i"',
      suggestion: 'Capitalize "I"',
      explanation: 'The pronoun "I" is always capitalized in English.',
    });
  }

  if (/\b(he|she|it)\s+(have|do|don't|go|work|live)\b/i.test(trimmed)) {
    const match = trimmed.match(/\b(he|she|it)\s+(have|do|don't|go|work|live)\b/i)?.[0] ?? 'he/she + base verb';
    grammarNotes.push({
      excerpt: match,
      suggestion: 'Check 3rd-person singular agreement (has / does / doesn’t / works)',
      explanation: 'In Present Simple, singular subjects (he, she, it) normally take -s/-es or "has"/"does".',
    });
  }

  if (/\b(didn't|did not|can't|should|must|will)\s+\w+ed\b/i.test(trimmed)) {
    const match = trimmed.match(/\b(didn't|did not|can't|should|must|will)\s+\w+ed\b/i)?.[0] ?? 'modal/did + -ed';
    grammarNotes.push({
      excerpt: match,
      suggestion: 'Use the base verb after "did not" or modal verbs',
      explanation: 'Use the infinitive without -ed after "did/didn’t" and modals (e.g., "didn’t go", "should study").',
    });
  }

  if (trimmed.length > 0 && !/[.!?]$/.test(trimmed)) {
    grammarNotes.push({
      excerpt: trimmed.slice(-18),
      suggestion: 'End your final sentence with punctuation (., !, or ?)',
      explanation: 'Consistent terminal punctuation improves clarity and writing presentation.',
    });
  }

  if (sentences.length >= 2 && trimmed.split(/\n\s*\n/).length === 1 && wordCount >= 90) {
    improvements.push('Organize longer writing into 2–4 focused paragraphs (introduction, body, conclusion).');
  }

  for (const pair of UPGRADE_PAIRS) {
    if (pair.basic.test(trimmed)) {
      vocabularySuggestions.push(pair.suggestion);
    }
  }
  if (vocabularySuggestions.length === 0) {
    vocabularySuggestions.push('Consider adding 1–2 topic-specific collocations (e.g., "play a vital role", "time management").');
  }

  const isIelts = prompt.category === 'ielts_task_1' || prompt.category === 'ielts_task_2';
  let estimatedPracticeIndicator: string | undefined;
  if (isIelts) {
    const ratio = Math.min(1, wordCount / prompt.targetWords);
    const estBand = (4.5 + ratio * 1.5 + (usedLinkers.length >= 2 ? 0.5 : 0) - Math.min(0.5, grammarNotes.length * 0.25)).toFixed(1);
    estimatedPracticeIndicator = `Unofficial Phase 1 structural readiness indicator: ~Band ${estBand} (heuristic only — full AI criterion evaluation activates in Phase 3).`;
  }

  return {
    analysisKind: 'local_heuristic_unofficial',
    strengths: strengths.length > 0 ? strengths : ['Your draft has been saved safely without altering your original wording.'],
    grammarNotes,
    vocabularySuggestions,
    improvements,
    estimatedPracticeIndicator,
    sampleResponse: prompt.sampleResponse,
  };
}
