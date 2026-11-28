import type { Vocabulary } from '@english-quest/shared';

export const ALLOWED_SOURCE_LICENSES = [
  'English Quest Original',
  'CC0',
  'CC BY 4.0',
  'CC BY-SA 4.0',
  'Public Domain',
  'MIT',
] as const;

export const ALLOWED_LICENSE_SET: ReadonlySet<string> = new Set<string>(ALLOWED_SOURCE_LICENSES);

export const VALID_EDITORIAL_STATUSES: ReadonlySet<'imported' | 'authored' | 'reviewed'> = new Set([
  'imported',
  'authored',
  'reviewed',
]);

const FORBIDDEN_PLACEHOLDER_PATTERNS = [
  /^placeholder\b/i,
  /\bTODO\b/,
  /^todo[:\s-]/i,
  /^example definition$/i,
  /\blorem ipsum\b/i,
  /^coming soon\.?$/i,
  /^tbd$/i,
];

export function normalizeUnicodeNFC(text: string): string {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim();
}

export function stripVietnameseDiacritics(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFC');
}

export function normalizeSearchTerm(input: string): string {
  return stripVietnameseDiacritics(normalizeUnicodeNFC(input))
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes conservative stem candidates for English inflected searches
 * (e.g., "studies" -> "study", "running" -> "run", "implemented" -> "implement").
 */
export function expandInflectionStems(token: string): string[] {
  const clean = token.toLowerCase().trim();
  const candidates = new Set<string>([clean]);
  if (clean.length <= 3) return [clean];

  if (clean.endsWith('ies') && clean.length > 4) {
    candidates.add(`${clean.slice(0, -3)}y`);
  }
  if (clean.endsWith('es') && clean.length > 4) {
    candidates.add(clean.slice(0, -2));
    candidates.add(clean.slice(0, -1));
  }
  if (clean.endsWith('s') && !clean.endsWith('ss') && clean.length > 3) {
    candidates.add(clean.slice(0, -1));
  }
  if (clean.endsWith('ied') && clean.length > 4) {
    candidates.add(`${clean.slice(0, -3)}y`);
  }
  if (clean.endsWith('ed') && clean.length > 4) {
    const stem = clean.slice(0, -2);
    candidates.add(stem);
    candidates.add(`${stem}e`);
    if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
      candidates.add(stem.slice(0, -1));
    }
  }
  if (clean.endsWith('ing') && clean.length > 5) {
    const stem = clean.slice(0, -3);
    candidates.add(stem);
    candidates.add(`${stem}e`);
    if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
      candidates.add(stem.slice(0, -1));
    }
  }
  if (clean.endsWith('ly') && clean.length > 4) {
    candidates.add(clean.slice(0, -2));
  }
  return Array.from(candidates);
}

/**
 * Builds deterministic deduplication key preserving legitimate polysemous senses
 * when senseId or definition differs while rejecting duplicate copies.
 */
export function makeLexicalDedupKey(entry: {
  word: string;
  partOfSpeech: string;
  senseId?: string;
  senseLabel?: string;
  definition?: string;
}): string {
  const wordKey = normalizeUnicodeNFC(entry.word).toLowerCase();
  const posKey = entry.partOfSpeech.toLowerCase().trim();
  const senseKey = entry.senseId
    ? normalizeUnicodeNFC(entry.senseId).toLowerCase()
    : entry.senseLabel
      ? normalizeUnicodeNFC(entry.senseLabel).toLowerCase()
      : normalizeSearchTerm(entry.definition ?? '').split(' ').slice(0, 6).join('_');
  return `${wordKey}::${posKey}::${senseKey}`;
}

export function validateLexicalRecord(entry: Vocabulary): string[] {
  const errs: string[] = [];
  const word = normalizeUnicodeNFC(entry.word ?? '');
  if (!word) errs.push(`Entry ${entry.id}: empty word`);
  if (!entry.ipa?.trim()) errs.push(`Entry ${entry.id}: missing IPA`);
  if (!entry.definition?.trim()) errs.push(`Entry ${entry.id}: missing definition`);
  if (!entry.vietnameseTranslation?.trim()) errs.push(`Entry ${entry.id}: missing vietnameseTranslation`);
  if (!entry.exampleSentence?.trim()) errs.push(`Entry ${entry.id}: missing exampleSentence`);
  if (entry.sourceLicense && !ALLOWED_LICENSE_SET.has(entry.sourceLicense)) {
    errs.push(`Entry ${entry.id}: unapproved sourceLicense "${entry.sourceLicense}"`);
  }
  if (entry.editorialStatus && !VALID_EDITORIAL_STATUSES.has(entry.editorialStatus)) {
    errs.push(`Entry ${entry.id}: invalid editorialStatus "${entry.editorialStatus}"`);
  }
  const fieldsToCheck = [word, entry.definition.trim(), entry.exampleSentence.trim()];
  if (fieldsToCheck.some((f) => FORBIDDEN_PLACEHOLDER_PATTERNS.some((re) => re.test(f)))) {
    errs.push(`Entry ${entry.id}: placeholder pattern detected`);
  }
  return errs;
}

export function deduplicateLexicalPack<T extends Vocabulary>(entries: T[]): {
  accepted: T[];
  rejected: Array<{ id: string; reason: string }>;
} {
  const seenIds = new Set<string>();
  const seenKeys = new Set<string>();
  const accepted: T[] = [];
  const rejected: Array<{ id: string; reason: string }> = [];

  for (const raw of entries) {
    const normalized: T = {
      ...raw,
      word: normalizeUnicodeNFC(raw.word),
      ipa: normalizeUnicodeNFC(raw.ipa),
      definition: normalizeUnicodeNFC(raw.definition),
      vietnameseTranslation: normalizeUnicodeNFC(raw.vietnameseTranslation),
      exampleSentence: normalizeUnicodeNFC(raw.exampleSentence),
      exampleTranslationVi: raw.exampleTranslationVi
        ? normalizeUnicodeNFC(raw.exampleTranslationVi)
        : undefined,
    };

    const issues = validateLexicalRecord(normalized);
    if (issues.length > 0) {
      rejected.push({ id: normalized.id, reason: issues.join('; ') });
      continue;
    }
    if (seenIds.has(normalized.id)) {
      rejected.push({ id: normalized.id, reason: `Duplicate ID: ${normalized.id}` });
      continue;
    }
    const dedupKey = makeLexicalDedupKey(normalized);
    if (seenKeys.has(dedupKey)) {
      rejected.push({ id: normalized.id, reason: `Duplicate lexical sense key: ${dedupKey}` });
      continue;
    }
    seenIds.add(normalized.id);
    seenKeys.add(dedupKey);
    accepted.push(normalized);
  }

  return { accepted, rejected };
}

export function importPackFromJson<T extends Vocabulary>(rawJson: string): {
  accepted: T[];
  rejected: Array<{ id: string; reason: string }>;
} {
  const parsed = JSON.parse(rawJson) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error('Expected JSON array of Vocabulary items.');
  }
  return deduplicateLexicalPack(parsed as T[]);
}
