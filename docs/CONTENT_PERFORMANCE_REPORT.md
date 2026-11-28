# English Quest — Content Performance & Bundle Safety Report

> Updated: 2026-11-28 (Milestone 4 Batch 4A)

## 1. Lazy Code-Splitting & Startup Bundle Budget

- **Dynamic Module Loading (`content/index.ts`):**
  Every large dataset (CEFR vocabulary packs, Grammar Academy lessons, 600-item exercise bank, Milestone 2 listening/speaking/reading/writing/pronunciation/shadowing academies, Milestone 3 CEFR units, IELTS academies, and Batch 4A full 40/40 mock exams) is imported lazily on demand via Vite dynamic `import()` chunks paired with TanStack Query infinite `staleTime` caching.
- **Full 40/40 Mock Isolation:**
  `mock_full_ac.ts` and `mock_full_gt.ts` only load inside `assembleIeltsMockExamById(mockId)` when a learner opens `/mock-exam/ielts-mock-full-ac-01` or `ielts-mock-full-gt-01`.
- **Sharded Search Architecture (`content/search/`):**
  - Global Search (`2,911` entries across 4 domain shards) NEVER loads reading passages, audio scripts, or exercises when searching.
  - Each shard uses compact JSON strings parsed lazily inside `loadAllSearchShards()` ONLY when the user invokes Global Search (`Ctrl+K` or header search button), avoiding both startup bloat and TypeScript `TS2590` AST overhead at 15,000+ item scale.

## 2. State & `localStorage` Performance

- **SM-2 Lazy Initialization:**
  `buildInitialSchedules()` in `useQuestStore.ts` seeds schedules ONLY for the 24 core starter words (`SEED_VOCABULARY`). Expanded vocabulary cards (1,444 currently, scaling toward 15,000 in Batches 4B–4F) do NOT allocate schedule objects in `localStorage` until the learner explicitly reviews or saves a word (`reviewVocabularySM2` / `saveWordToVocabulary`).
- **Search History Bounding:**
  `english-quest-search-history-v1` caps recent history at `8` trimmed query strings.
- **Debounced Mock Autosave:**
  `MockExamPlayerPage.tsx` debounces draft persistence by `600ms` so typing long Writing essays never stutters main-thread rendering.
