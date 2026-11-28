# English Quest — Sharded Bilingual Search Architecture

> Implementation: `content/search/manifest.ts`, `content/search/shard_*.ts`, `frontend/src/services/knowledgeSearch.ts`, `frontend/src/components/search/GlobalSearchModal.tsx`

## 1. Lazy Sharded Design

To avoid bloating initial page load or loading megabytes of reading passages and scripts just to search a word:

- **`content/search/manifest.ts`**: Lightweight manifest storing only shard metadata and entry count.
- **4 Domain Shards**:
  1. `shard_vocab.ts` (`vocab_core`): All Vocabulary entries & Thematic Collections.
  2. `shard_grammar.ts` (`grammar_core`): All CEFR Grammar Academy rules and summaries.
  3. `shard_skills.ts` (`skills_core`): Learning Path lessons, Listening, Speaking, Reading, Writing, Pronunciation, Shadowing, Conversations, and Think-in-English items.
  4. `shard_ielts.ts` (`ielts_resources`): IELTS Listening, Speaking, Reading, Writing, Strategy, Idea Packs, Mock Exam manifests, and Curated External Resources.
- Shards load dynamically via `import('@content/search/...')` ONLY when the user invokes Global Search (`Ctrl+K` / `Cmd+K` or header search button), then cache in memory for the session.

## 2. Bilingual Query & Ranking Pipeline

Queries pass through `normalizeQuery` (`knowledgeSearch.ts`) and score deterministically via `scoreEntryForQuery`:

1. **Exact Headword / Lemma Match** (`100+`): Exact match on normalized title or citation lemma.
2. **Prefix Match** (`88+`): Headword/title starts with query string.
3. **Inflected Form Match** (`85+`): Matches pre-indexed `inflectedForms` or morphological stem expansions (`analyzing` -> `analyze`, `studies` -> `study`, `stopped` -> `stop`).
4. **Vietnamese Translation Match** (`80+`): Unicode NFD diacritic folding ensures both `"khách sạn"` and `"khach san"` match `"hotel"` reliably.
5. **Partial Title / Keyword Match** (`56–74+`): Matches collocations, tags, category keywords, or definitions.
6. **Bounded Typo Tolerance** (`<= 2` edit distance): Early-pruned Levenshtein fallback (`boundedEditDistance`) activates on single-token queries of length `>= 4` (`"ubiqitous"` -> `"ubiquitous"`).

## 3. Navigation & Search History

- Selecting a search result persists recent query terms in `localStorage` (`english-quest-search-history-v1`, max `8` entries) and navigates directly to `/vocabulary?q=...`, `/grammar?q=...`, `/lesson/:id`, `/mock-exam/:id`, or the matching skill hub.
- Filters support scoping by entity kind (`vocabulary`, `collection`, `grammar`, `listening`, `speaking`, `reading`, `writing`, `pronunciation`, `ielts`) and CEFR tier (`A1`–`C2`).
