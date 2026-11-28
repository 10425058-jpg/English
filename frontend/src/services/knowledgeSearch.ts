import type { CEFRLevel, SearchIndexEntry } from '@english-quest/shared';

const SEARCH_HISTORY_KEY = 'english-quest-search-history-v1';

export type KnowledgeSearchCategory =
  | 'all'
  | 'vocabulary'
  | 'collection'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'pronunciation'
  | 'conversation'
  | 'lesson'
  | 'ielts'
  | 'resource';

export interface KnowledgeSearchOptions {
  category?: KnowledgeSearchCategory;
  cefrLevel?: 'ALL' | CEFRLevel;
  limit?: number;
}

export interface KnowledgeSearchResult {
  entry: SearchIndexEntry;
  score: number;
  matchReason: string;
}

export function stripVietnameseDiacriticsClient(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFC');
}

export function normalizeQuery(input: string): string {
  return stripVietnameseDiacriticsClient(input.normalize('NFC'))
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function expandClientStems(token: string): string[] {
  const clean = token.toLowerCase().trim();
  const out = new Set<string>([clean]);
  if (clean.length <= 3) return [clean];
  if (clean.endsWith('ies') && clean.length > 4) out.add(`${clean.slice(0, -3)}y`);
  if (clean.endsWith('es') && clean.length > 4) {
    out.add(clean.slice(0, -2));
    out.add(clean.slice(0, -1));
  }
  if (clean.endsWith('s') && !clean.endsWith('ss') && clean.length > 3) {
    out.add(clean.slice(0, -1));
  }
  if (clean.endsWith('ied') && clean.length > 4) out.add(`${clean.slice(0, -3)}y`);
  if (clean.endsWith('ed') && clean.length > 4) {
    const s = clean.slice(0, -2);
    out.add(s);
    out.add(`${s}e`);
    if (s.length >= 3 && s[s.length - 1] === s[s.length - 2]) out.add(s.slice(0, -1));
  }
  if (clean.endsWith('ing') && clean.length > 5) {
    const s = clean.slice(0, -3);
    out.add(s);
    out.add(`${s}e`);
    if (s.length >= 3 && s[s.length - 1] === s[s.length - 2]) out.add(s.slice(0, -1));
  }
  if (clean.endsWith('ly') && clean.length > 4) out.add(clean.slice(0, -2));
  return Array.from(out);
}

/**
 * Bounded Levenshtein edit distance (capped early at maxDist + 1).
 */
export function boundedEditDistance(a: string, b: string, maxDist = 2): number {
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  if (a === b) return 0;

  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      curr.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > maxDist) return maxDist + 1;
    prev = curr;
  }
  return prev[b.length];
}

let cachedShards: SearchIndexEntry[] | null = null;

export async function loadAllSearchShards(): Promise<SearchIndexEntry[]> {
  if (cachedShards) return cachedShards;
  const [vocab, grammar, skills, ielts] = await Promise.all([
    import('@content/search/shard_vocab').then((m) => m.SEARCH_SHARD_VOCAB),
    import('@content/search/shard_grammar').then((m) => m.SEARCH_SHARD_GRAMMAR),
    import('@content/search/shard_skills').then((m) => m.SEARCH_SHARD_SKILLS),
    import('@content/search/shard_ielts').then((m) => m.SEARCH_SHARD_IELTS),
  ]);
  cachedShards = [...vocab, ...grammar, ...skills, ...ielts];
  return cachedShards;
}

export async function getSearchManifestSummary() {
  return import('@content/search/manifest').then((m) => m.SEARCH_SHARD_MANIFEST);
}

export function scoreEntryForQuery(entry: SearchIndexEntry, rawQuery: string): KnowledgeSearchResult | null {
  const qNorm = normalizeQuery(rawQuery);
  if (!qNorm) return null;

  const qStems = qNorm.split(' ').flatMap(expandClientStems);
  const titleNorm = normalizeQuery(entry.title);
  const viNorm = normalizeQuery(entry.vietnamese ?? '');
  const subNorm = normalizeQuery(entry.subtitle);
  const lemmaNorm = normalizeQuery(entry.lemma ?? '');
  const kwJoined = (entry.keywords ?? []).map(normalizeQuery);
  const inflectedNorm = (entry.inflectedForms ?? []).map(normalizeQuery);
  const weightBonus = (entry.rankWeight ?? 60) * 0.05;

  if (titleNorm === qNorm || lemmaNorm === qNorm) {
    return { entry, score: 100 + weightBonus, matchReason: 'Exact headword match' };
  }
  if (titleNorm.startsWith(qNorm)) {
    return { entry, score: 88 + weightBonus, matchReason: 'Title prefix match' };
  }
  if (inflectedNorm.some((f) => f === qNorm)) {
    return { entry, score: 85 + weightBonus, matchReason: 'Inflected form match' };
  }
  if (viNorm && viNorm.includes(qNorm)) {
    return { entry, score: 80 + weightBonus, matchReason: 'Vietnamese translation match' };
  }
  if (titleNorm.includes(qNorm)) {
    return { entry, score: 74 + weightBonus, matchReason: 'Partial title match' };
  }
  if (
    qStems.some(
      (st) =>
        st.length >= 3 &&
        (titleNorm === st ||
          lemmaNorm === st ||
          titleNorm.startsWith(st) ||
          kwJoined.some((k) => k === st || k.split(' ').includes(st)))
    )
  ) {
    return { entry, score: 66 + weightBonus, matchReason: 'Stem / lemma match' };
  }
  if (subNorm.includes(qNorm) || kwJoined.some((k) => k.includes(qNorm))) {
    return { entry, score: 56 + weightBonus, matchReason: 'Definition / keyword match' };
  }

  // Bounded typo fallback for >=4-char queries without punctuation spaces
  if (qNorm.length >= 4 && !qNorm.includes(' ')) {
    const firstWord = titleNorm.split(' ')[0] ?? '';
    if (firstWord.length >= 4) {
      const dist = boundedEditDistance(qNorm, firstWord, qNorm.length >= 7 ? 2 : 1);
      if (dist <= (qNorm.length >= 7 ? 2 : 1)) {
        return {
          entry,
          score: 48 - dist * 8 + weightBonus,
          matchReason: `Closest spelling match (distance ${dist})`,
        };
      }
    }
  }

  return null;
}

export function searchEntriesSync(
  entries: SearchIndexEntry[],
  rawQuery: string,
  options: KnowledgeSearchOptions = {}
): KnowledgeSearchResult[] {
  const { category = 'all', cefrLevel = 'ALL', limit = 24 } = options;
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];

  const results: KnowledgeSearchResult[] = [];
  for (const entry of entries) {
    if (category !== 'all' && entry.kind !== category) continue;
    if (cefrLevel !== 'ALL' && entry.cefrLevel !== cefrLevel) continue;
    const hit = scoreEntryForQuery(entry, trimmed);
    if (hit) results.push(hit);
  }

  results.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
  return results.slice(0, limit);
}

export async function searchKnowledge(
  rawQuery: string,
  options: KnowledgeSearchOptions = {}
): Promise<KnowledgeSearchResult[]> {
  const entries = await loadAllSearchShards();
  return searchEntriesSync(entries, rawQuery, options);
}

export function readSearchHistory(): string[] {
  try {
    const raw = window.localStorage.getItem(SEARCH_HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function pushSearchHistory(query: string): string[] {
  const clean = query.trim();
  if (!clean) return readSearchHistory();
  const next = [clean, ...readSearchHistory().filter((q) => q.toLowerCase() !== clean.toLowerCase())].slice(
    0,
    8
  );
  try {
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors in restricted contexts
  }
  return next;
}
