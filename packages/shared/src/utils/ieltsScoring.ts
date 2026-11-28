import type { IELTSPathway } from '@english-quest/shared';

export const UNOFFICIAL_IELTS_NOTICE =
  'Unofficial internal practice estimate aligned with public IELTS 4-criterion descriptors and illustrative 40-mark conversion scales. Scores do not constitute official IELTS test results.';

/** Illustrative Listening raw (out of 40) to IELTS Band conversion table (Academic & GT share Listening). */
export function convertListeningRawToBand(rawScore: number, maxScore = 40): number {
  const scaled40 = maxScore === 40 ? rawScore : Math.round((rawScore / Math.max(1, maxScore)) * 40);
  if (scaled40 >= 39) return 9.0;
  if (scaled40 >= 37) return 8.5;
  if (scaled40 >= 35) return 8.0;
  if (scaled40 >= 32) return 7.5;
  if (scaled40 >= 30) return 7.0;
  if (scaled40 >= 26) return 6.5;
  if (scaled40 >= 23) return 6.0;
  if (scaled40 >= 18) return 5.5;
  if (scaled40 >= 16) return 5.0;
  if (scaled40 >= 13) return 4.5;
  if (scaled40 >= 10) return 4.0;
  if (scaled40 >= 6) return 3.5;
  return 3.0;
}

/** Illustrative Reading raw (out of 40) to IELTS Band conversion distinguishing Academic vs General Training curves. */
export function convertReadingRawToBand(
  rawScore: number,
  pathway: IELTSPathway,
  maxScore = 40,
): number {
  const scaled40 = maxScore === 40 ? rawScore : Math.round((rawScore / Math.max(1, maxScore)) * 40);
  if (pathway === 'general_training') {
    if (scaled40 >= 40) return 9.0;
    if (scaled40 >= 39) return 8.5;
    if (scaled40 >= 37) return 8.0;
    if (scaled40 >= 36) return 7.5;
    if (scaled40 >= 34) return 7.0;
    if (scaled40 >= 32) return 6.5;
    if (scaled40 >= 30) return 6.0;
    if (scaled40 >= 27) return 5.5;
    if (scaled40 >= 23) return 5.0;
    if (scaled40 >= 19) return 4.5;
    if (scaled40 >= 15) return 4.0;
    if (scaled40 >= 12) return 3.5;
    return 3.0;
  }

  // Academic Reading
  if (scaled40 >= 39) return 9.0;
  if (scaled40 >= 37) return 8.5;
  if (scaled40 >= 35) return 8.0;
  if (scaled40 >= 33) return 7.5;
  if (scaled40 >= 30) return 7.0;
  if (scaled40 >= 27) return 6.5;
  if (scaled40 >= 23) return 6.0;
  if (scaled40 >= 19) return 5.5;
  if (scaled40 >= 15) return 5.0;
  if (scaled40 >= 13) return 4.5;
  if (scaled40 >= 10) return 4.0;
  if (scaled40 >= 6) return 3.5;
  return 3.0;
}

/** Official IELTS averaging & nearest-half-band rounding (.25 -> .5, .75 -> next whole band). */
export function roundIeltsOverallBand(scores: [number, number, number, number]): number {
  const avg = (scores[0] + scores[1] + scores[2] + scores[3]) / 4;
  return Math.round(avg * 2 + 1e-9) / 2;
}
