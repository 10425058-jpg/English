import type { IELTSPathway } from '@english-quest/shared';

export const UNOFFICIAL_IELTS_NOTICE =
  'Unofficial internal practice indicator aligned with public IELTS 4-criterion descriptors and illustrative 40-mark scales. Scores do not constitute official IELTS certification.';

export const MINI_MOCK_SCALING_WARNING =
  'Short practice mini-mock (<40 Listening or <40 Reading questions). Only raw accuracy percentage is reported—mini sets are never scaled up to official-style 40-mark band scores.';

/** Returns true strictly when Listening and Reading both carry authentic 40 scorable items. */
export function isComplete40QuestionMock(listeningMax: number, readingMax: number): boolean {
  return listeningMax === 40 && readingMax === 40;
}

/**
 * Converts a genuine 40-item Listening raw score to an illustrative Band (3.0–9.0).
 * Strictly returns `null` if maxScore !== 40 so short practice quizzes cannot masquerade as full 40Q exams.
 */
export function convertListeningRawToBand(rawScore: number, maxScore = 40): number | null {
  if (maxScore !== 40 || rawScore < 0 || rawScore > 40) return null;
  if (rawScore >= 39) return 9.0;
  if (rawScore >= 37) return 8.5;
  if (rawScore >= 35) return 8.0;
  if (rawScore >= 32) return 7.5;
  if (rawScore >= 30) return 7.0;
  if (rawScore >= 26) return 6.5;
  if (rawScore >= 23) return 6.0;
  if (rawScore >= 18) return 5.5;
  if (rawScore >= 16) return 5.0;
  if (rawScore >= 13) return 4.5;
  if (rawScore >= 10) return 4.0;
  if (rawScore >= 6) return 3.5;
  return 3.0;
}

/**
 * Converts a genuine 40-item Reading raw score differentiating Academic vs General Training curves.
 * Strictly returns `null` if maxScore !== 40.
 */
export function convertReadingRawToBand(
  rawScore: number,
  pathway: IELTSPathway,
  maxScore = 40,
): number | null {
  if (maxScore !== 40 || rawScore < 0 || rawScore > 40) return null;
  if (pathway === 'general_training') {
    if (rawScore >= 40) return 9.0;
    if (rawScore >= 39) return 8.5;
    if (rawScore >= 37) return 8.0;
    if (rawScore >= 36) return 7.5;
    if (rawScore >= 34) return 7.0;
    if (rawScore >= 32) return 6.5;
    if (rawScore >= 30) return 6.0;
    if (rawScore >= 27) return 5.5;
    if (rawScore >= 23) return 5.0;
    if (rawScore >= 19) return 4.5;
    if (rawScore >= 15) return 4.0;
    if (rawScore >= 12) return 3.5;
    return 3.0;
  }

  // Academic Reading
  if (rawScore >= 39) return 9.0;
  if (rawScore >= 37) return 8.5;
  if (rawScore >= 35) return 8.0;
  if (rawScore >= 33) return 7.5;
  if (rawScore >= 30) return 7.0;
  if (rawScore >= 27) return 6.5;
  if (rawScore >= 23) return 6.0;
  if (rawScore >= 19) return 5.5;
  if (rawScore >= 15) return 5.0;
  if (rawScore >= 13) return 4.5;
  if (rawScore >= 10) return 4.0;
  if (rawScore >= 6) return 3.5;
  return 3.0;
}

/** Official IELTS averaging & nearest-half-band rounding (.25 -> .5, .75 -> next whole band). */
export function roundIeltsOverallBand(scores: [number, number, number, number]): number {
  const avg = (scores[0] + scores[1] + scores[2] + scores[3]) / 4;
  return Math.round(avg * 2 + 1e-9) / 2;
}

/**
 * Computes an unofficial Overall Band STRICTLY when:
 * 1. The simulation uses full 40Q Listening & 40Q Reading (`examFormat === 'full_exam'`).
 * 2. All 4 components (Listening, Reading, Writing, Speaking) carry valid explicit scores (never defaults/unassessed).
 */
export function computeOverallBandIfEligible(params: {
  examFormat: 'full_exam' | 'practice_mini';
  listening: number | null;
  reading: number | null;
  writing: number | null;
  speaking: number | null;
}): number | null {
  if (params.examFormat !== 'full_exam') return null;
  const { listening, reading, writing, speaking } = params;
  if (listening === null || reading === null || writing === null || speaking === null) {
    return null;
  }
  return roundIeltsOverallBand([listening, reading, writing, speaking]);
}
