# English Quest — Implementation Status

> Updated: 2026-11-28 | Active Branch: `feature/massive-knowledge-expansion` (Milestone 4 Batch 4A Complete)

## Milestone Summary

- **Phase 1 — Core Product & Visual Foundation:** **Implemented & Verified (`main` @ `7e3b872`)**
  - Original Duolingo-inspired interface, Pip the Quest Finch mascot, 15 routes, reusable exercise engine, SM-2 scheduler, Local Smart AI Tutor, and local JSON backup/migration.
- **Milestone 1 — Vocabulary, Grammar & Resource Foundation:** **Complete** (`1,468` vocab, `55` grammar, `30` collections, `600` drill bank, `36` open resources).
- **Milestone 2 — Four-Skill Intensive Training (PR #4):** **Complete** (`126` Listening, `127` Speaking + `6` guides, `48` Pronunciation, `60` Shadowing, `60` Conversations, `30` Think in English, `24` Integrated 4-skill loops, `126` Reading, `97` Writing).
- **Milestone 3 — Advanced CEFR Learning Path & IELTS Mastery Center (PR #6):** **Complete** (`48` A1–C2 units / `264` lessons, `45` structured assessments, `382` M3 IELTS items, adaptive study planner, mistake clustering).
- **Milestone 4 — Batch 4A (Quality Repair & Knowledge Infrastructure):** **Implemented & Locally Verified**
  - Fixed all M3 examination scoring defects: separated `full_exam` (**2** complete 40L+40R simulations w/ **160** new questions -> **4,542** total interactive exercises) from `practice_mini` (**12** short 8L+15R checkpoints reporting raw `%` only), removed the heuristic Writing band generator (`buildWritingMechanicalFeedback` provides non-scoring mechanical checks only), changed Speaking & Writing defaults to strictly `unassessed` (`null`), implemented post-exam rubric/teacher grading (`updateMockProductiveAssessment`) + non-destructive v1 -> v2 store migration.
  - Defined extended lexical/knowledge schemas (`Vocabulary` optional fields, `WordFamilyGroup`, `CollocationEntry`, `ConfusedWordsPair`, `GrammarComparisonItem`, `ExpressionFunctionGroup`, `LexicalKnowledgeLink`, `SearchIndexEntry`).
  - Built normalization/deduplication/license pipeline (`scripts/pipeline/normalizeAndDeduplicate.ts`), sharded EN+VI search generator (`scripts/pipeline/generateSearchIndex.ts`, **2,911** indexed entries across `content/search/`), client search service (`knowledgeSearch.ts` with Vietnamese diacritic folding, English inflection stems, bounded typo tolerance <= 2, history), and accessible `Ctrl+K` `GlobalSearchModal`.
  - Upcoming Batches **4B–4F** will expand the curated vocabulary, multiword expressions, morphology, domain tracks, and Knowledge Graph explorer sequentially.

## Known Limitations
1. Progress persists locally in browser `localStorage`; cross-device sync and teacher role auth await Phase 2 backend deployment.
2. IELTS Writing and Speaking simulations never auto-assign official or heuristic numeric Bands offline; learners use structured 4-criterion self-rubrics or optional human teacher entry while awaiting Phase 3 AI/tutor review workflows.
3. Browser speech synthesis & `MediaRecorder` playback provide offline accessibility without paid STT/TTS cloud APIs.
