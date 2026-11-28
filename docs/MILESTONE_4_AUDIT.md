# English Quest — Milestone 4 Initial Repository Audit

> Audited: 2026-11-28 | Branch: `feature/massive-knowledge-expansion` | Base Commit: `main` @ `42133b3` (PR #6 merged)

## 1. Verified Baseline Content Inventory (Direct Code & Report Inspection)

| Category | Observed Count | Verified Location | Status |
|---|---:|---|---|
| Vocabulary & Lexical Entries | 1,468 *(24 core + 1,444 M1)* | `frontend/src/data/vocabularySeed.ts`, `content/vocabulary/` | High-quality core, needs 10x scale + polysemy + Vietnamese dictionary lookup |
| Grammar Topics | 55 *(7 core + 48 M1)* | `frontend/src/data/grammarTopics.ts`, `content/grammar/` | Solid foundation; lacks comparison center & 145 topics for encyclopedia depth |
| Thematic Vocabulary Collections | 30 | `content/collections/` | Lacks IT/CS, Cybersecurity, Academic STEM & Business depth toward 200 |
| Learning Path Units & Lessons | 48 units / 264 lessons | `frontend/src/data/curriculum/`, `content/curriculum/` | Complete active `A1–C2` progression (`8` units / `48` lessons per level) |
| Structured Assessments & Exams | 45 *(36 unit + 6 level + 3 diag)* | `content/assessments/` | Active & verified (`70%` / `75%` pass thresholds) |
| Listening Academy | 126 *(6 core + 120 M2)* | `content/listening/` | Target 300 in M4 Batches 4E–4F |
| Speaking Academy | 127 *(7 core + 120 M2, +6 guides)* | `content/speaking/` | Target 300 in M4 Batches 4E–4F |
| Reading Academy | 126 *(6 core + 120 M2)* | `content/reading/` | Target 300 in M4 Batches 4E–4F |
| Writing Academy | 97 *(7 core + 90 M2)* | `content/writing/` | Target 200 in M4 Batches 4E–4F |
| Pronunciation & Shadowing | 48 Pronunciation / 60 Shadowing | `content/pronunciation/`, `content/shadowing/` | Target 150 each |
| Conversation / Think in English / Integrated | 60 Conv / 30 Think / 24 Integrated | `content/conversations/`, `think-in-english/`, `integrated-learning/` | Target 300 / 100 / 100 |
| IELTS Mastery Modules | 389 items *(80 L, 100 S, 60 R, 60 W, 10 Ideas, 60 Strategy, 12 Mocks, 7 base)* | `content/ielts/` | **Critical defects detected (see Section 2 below)** |
| External Educational Resources | 36 | `content/resources/learningResources.ts` | Target 150 curated & availability-checked |
| Combined Interactive Exercises | **4,382** *(200 Phase 1 + 744 M1 + 1,830 M2 + 1,608 M3)* | Validated by `scripts/validate-content.ts` | Target 20,000 |

---

## 2. Critical Milestone 3 Examination & Scoring Defects Found (Priority Batch 4A Fix)

1. **Incomplete Mock Examinations Scaled as Full 40-Mark IELTS Bands (`content/ielts/mock_exams.ts`, `MockExamPlayerPage.tsx`, `ieltsScoring.ts`):**
   - **Defect:** All 12 existing mock manifests assemble `4` short Listening parts x `2` Qs = **8 Listening questions** and `3` short Reading passages x `5` Qs = **15 Reading questions**, yet `MockExamPlayerPage.tsx` calls `convertListeningRawToBand(lRaw, 8)` and `convertReadingRawToBand(rRaw, pathway, 15)`, linearly scaling `8 -> 40` and `15 -> 40` and presenting the output as an official-style full IELTS Overall Band.
   - **Resolution Plan (Batch 4A):** Disallow `!= 40` scaling inside `ieltsScoring.ts`, relabel all `8L / 15R` sets honestly as **Practice Mini-Mocks** (raw percentage accuracy only, `overallBand: null`), author complete **40Q Listening + 40Q Reading Full Academic & GT Mock Exams**, and enforce `40L / 40R` invariants inside `validate-content.ts`.
2. **Heuristic Writing Band Fabrication (`MockExamPlayerPage.tsx` lines 64–83):**
   - **Defect:** `estimateMockWritingBandHeuristic` awards a baseline Band `4.0` even for empty (`0`-word) responses and climbs toward `8.0` via paragraph newlines, word thresholds, and surface keyword checks (`overall`, `however`).
   - **Resolution Plan (Batch 4A):** Remove numeric heuristic Writing band calculation completely. Retain mechanical diagnostics strictly labeled as non-scoring checklists, represent empty/ungraded Writing strictly as `writingAssessmentStatus: 'unassessed'` (`writingBand: null`), and support explicit criterion-based Self-Assessment or Teacher-Entered Band scores.
3. **Default Band `6.5` Speaking Bias (`MockExamPlayerPage.tsx` line 122, `IeltsListeningSpeakingTabs.tsx` line 264):**
   - **Defect:** Speaking UI pre-initializes candidate self-rating to `6.5`, outputting a Band `6.5` without any learner effort or assessment.
   - **Resolution Plan (Batch 4A):** Change initial state cleanly to `null` (`speakingAssessmentStatus: 'unassessed'`), never compute overall bands while Writing or Speaking remains unassessed, and preserve M3 history entries explicitly tagged as legacy heuristic migrations (`legacyHeuristicMigrated: true`).

---

## 3. Content, Search & Architecture Gaps for Milestone 4

- **Missing Vocabulary Breadth & Depth (`1,468` -> `15,000`):** Current vocabulary focuses heavily on general CEFR & foundational academic glosses. Key deficits include polysemous sense branching (`run` -> physical move, company leadership, code execution, machine uptime, elections, fluid flow, time duration), formal/informal register links, systematic word-family trees (e.g., *analyze/analysis/analyst/analytical/analytically*), separable/inseparable phrasal verb grammar (`1,000` target), natural idioms (`800` target), Vietnamese learner false-friend contrast sets (`300` confused-word lessons), and deep STEM/CS/Cybersecurity domains.
- **Missing Grammar Topics & Comparison Depth (`55` -> `200`):** Current grammar covers core rules across levels (`8`/level) plus `7` legacy cards, missing structured side-by-side Grammar Comparisons (`Present Perfect vs Past Simple`, `Used to vs Be used to`, `Mustn't vs Don't have to`, `Despite vs Although`) and advanced C1–C2 cohesive/discourse topics (ellipsis, fronting, nominalization, hedging, theme/rheme).
- **Missing Global Search & Dictionary Lookup:** Searching exists purely inside isolated page filters (one CEFR pack at a time inside `VocabularyPage`). Missing Unicode + Vietnamese diacritic-insensitive matching, inflected-form lemmatization, typo tolerance, partial matches, and lightweight lazy-loaded search shards across all content types.
- **Local Storage / Memory Guard:** Initializing `vocabularySchedules` for 15,000 words upfront in `useQuestStore` would bloat `localStorage` past browser quotas and flood due queues. Initial schedules must stay restricted to core/actively studied entries, assigning schedules dynamically only when a word is studied or bookmarked.
- **Bundle & Performance Risk:** Importing full scripts/passages for 15,000 dictionary entries or 20,000 exercises at startup would bust mobile memory/TTI budgets. All Milestone 4 data must reside in sharded lazy packs (`content/...`) indexed by ultra-compact JSON search index shards.
