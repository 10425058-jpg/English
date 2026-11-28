# English Quest — Milestone 3 Repository Audit & Gap Analysis

> Date: 2026-11-28 | Base Branch: `main` @ `54b5ee5` (PR #4 merged) | Working Branch: `feature/advanced-cefr-ielts-mastery`

## 1. Verified Pre-Milestone-3 Repository Counts

Reconciled against [CONTENT_QUALITY_REPORT.md](./CONTENT_QUALITY_REPORT.md) (`0` errors, `0` warnings via `scripts/validate-content.ts` `runValidation(true)` executed through `tsc` + Node `v24.21.0`; note local `npm run validate:content` via Vite remains blocked on Windows due to Application Control blocking `rolldown-binding.win32-x64-msvc.node`, so `ubuntu-latest` GitHub Actions CI validates the Vite runner directly):

| Category | Core Seed / Phase 1 | Milestone 1 + 2 Added | Verified Baseline Total |
|---|---:|---:|---:|
| Vocabulary & Lexical Entries | 24 | 1,444 | **1,468** (`A1:209, A2:325, B1:240, B2:233, C1:208, C2:229` expanded) |
| Grammar Topics | 7 | 48 | **55** (`8` per level `A1–C2` expanded) |
| Thematic Vocabulary Collections | 0 | 30 | **30** |
| Core Learning Path Units / Lessons | 12 units / 48 lessons | 0 | **12 units / 48 lessons** (`A1–B1` only; `B2–C2` preview-only) |
| Listening Academy Lessons | 6 | 120 (`720` ex) | **126** (`A1:15, A2:15, B1:20, B2:30, C1:25, C2:15`) |
| Speaking Academy Lessons | 7 | 120 (+ `6` guides) | **127** (+ `6` framework guides) |
| Reading Academy Passages | 6 | 120 (`600` ex) | **126** |
| Writing Academy Lessons | 7 | 90 (`270` ex) | **97** |
| Pronunciation Academy Lessons | 0 | 48 (`240` ex) | **48** |
| Shadowing Studio Sessions | 0 | 60 | **60** |
| Conversation Scenarios | 0 | 60 | **60** (`10` per domain) |
| Think in English Drills | 0 | 30 | **30** |
| Integrated 4-Skill Units | 0 | 24 | **24** |
| Combined Interactive Exercises | 200 (`192` path + `8` grammar) | 2,574 (`744` M1 + `1,830` M2) | **2,774** |
| Curated Open Resources | 0 | 36 | **36** |
| IELTS Practice Content (`ieltsData.ts`) | 7 (`3` speaking + `4` mini-mock) | 0 | **7** |

## 2. Architectural & Curriculum Findings

1. **Learning Path Coverage Gap (`frontend/src/data/curriculum/`, `LearnPage.tsx`):**
   - `ALL_UNITS` only covers 12 units across `A1`, `A2`, and `B1` (4 lessons per unit = 48 lessons).
   - `B2`, `C1`, and `C2` sections in `CURRICULUM_SECTIONS` have `status: 'upcoming'` and display locked Phase 4 roadmap cards via `UPCOMING_CEFR_PREVIEWS`.
   - Core lessons lack structured pedagogical briefing sections (explicit `instructionalOverview`, `contextualExamples`, `practicalApplication` deep-links into Milestone 2 academies, separated `targetVocabIds` / `targetGrammarIds`, and unit mastery assessment linkage).
   - `PLACEMENT_QUESTIONS` (`placementTest.ts`) caps placement at `B1` (`10` items) and `LearnPage` defaults any user placed at `B2–C2` back to `A1`.
   - CEFR mastery is not cleanly decoupled from raw `xp` totals (`computeUserLevel(xp)` is XP-based, while real level mastery requires counting path lessons + unit/level assessments without score inflation).

2. **Exercise Engine & Persistence (`ExerciseRenderer.tsx`, `useQuestStore.ts`, `sm2.ts`):**
   - `evaluateExerciseAnswer` already supports choice, `multiple_response`, `fill_blank`, `word_matching`, `definition_matching`, `sentence_reconstruction`, `sentence_ordering`, `sentence_transformation`, `translation`, `error_identification`, `error_correction`, `audio_recognition`, `dictation`, `pronunciation_discrimination`, `speaking`, `reading_comprehension`, and keyword-checked `free_writing`.
   - `useQuestStore` persists cleanly under `english-quest-state-v1` (`version: 1`) with idempotent `xpTransactions`, `lessonProgress`, `claimedChests`, `mistakes`, `vocabularySchedules`, `listeningHistory`, `readingHistory`, `speakingSessions`, `writingSubmissions`, `ieltsSessions`, and JSON export/import backup (`english-quest-backup-v1`).
   - Milestone 3 additions (`unitAssessmentResults`, `levelAssessmentResults`, `ieltsActivityProgress`, `ieltsMockHistory`, `studyPlanConfig`) must remain optional/defaulted on hydration so existing `english-quest-state-v1` data migrates seamlessly with zero data loss.

3. **IELTS Module Gaps (`IeltsPage.tsx`, `ieltsData.ts`):**
   - Currently hosts only 3 speaking cues, 4 diagnostic multiple-choice questions, and a naive band ratio (`estimatePracticeBandFromRatio`) without distinguishing Academic vs. General Training Reading 40-question raw conversion curves, official half-band `.25` / `.75` averaging rules, timed section navigation, split-screen Reading, IELTS Task 1 data visuals, strategy lessons, or full 4-section mocks.

4. **Production White-Screen & Build Safeguards (`sw.js`, `main.tsx`, `vite.config.ts`):**
   - `public/sw.js` uses `english-quest-v2` cache with network-first `no-cache` navigation and never returns HTML fallbacks for hashed JS/CSS assets.
   - `main.tsx` registers `sw.js` at `${import.meta.env.BASE_URL}sw.js` with `updateViaCache: 'none'` and wraps `<App />` in `StartupErrorBoundary`.
   - `vite.config.ts` keeps `/English/` base path and manual vendor chunking; all new Milestone 3 `content/curriculum/` and `content/ielts/` modules must be loaded **lazily via dynamic `import()`** in `content/index.ts` to protect startup bundle size.

5. **Reusable Milestone 1 & Milestone 2 Inventory:**
   - All `1,468` vocabulary entries (`va1-*`..`vc2-*`), `55` grammar topics (`gram-a1-*`..`gram-c2-*`), `600` interactive bank exercises (`xa1-*`..`xc2-*`), `120` M2 listening tracks (`lis-m2-*`), `120` M2 speaking lessons (`spk-m2-*`), `120` M2 reading passages (`rd-m2-*`), `90` M2 writing lessons (`wrt-m2-*`), `48` pronunciation lessons (`pro-m2-*`), `60` shadowing sessions, and `60` conversations exist with verified IDs and can be cross-referenced directly inside Milestone 3 structured units and study plans.

## 3. Milestone 3 Implementation Plan (Batches 3A–3D)

- **Batch 3A — Complete (Verified via `tsc`+Node Validator `0` Errors / `0` Warnings, `typecheck`, and `eslint`):** Activated full **A1–C2 Learning Path** by adding **36 structured units** (`A1:+4, A2:+4, B1:+4, B2:+8, C1:+8, C2:+8` -> `48` total), **216 learning-path lessons** (`6` per unit -> `264` total), **36 Unit Mastery Assessments**, **6 CEFR Level Completion Exams**, **3 Diagnostic/Section/Mixed Review packs** (`45` assessments total), **888 newly authored exercises** (`648` lesson + `240` assessment, tracked separately from `51` reused `reusedExerciseRefs`), A1–C2 placement upgrade (`14` items), skill-specific node UX, `/assessment/:assessmentId` player, non-XP mastery meter, independent jump-ahead unit unlock controls, and lazy per-level loading.
- **Batch 3B (Next):** Expand IELTS Mastery Center with Academic/GT pathways, `80` IELTS Listening, `100` IELTS Speaking, `60` IELTS Reading, `60` IELTS Writing activities, and thematic IELTS Vocabulary & Idea Banks.
- **Batch 3C:** Implement `60` IELTS Strategy Lessons + distraction-free Mock Examination Engine with `12` complete 4-skill mocks (`8` Academic, `4` GT), official timers, split-screen Reading, Task 1 visual data, local Speaking recorder, autosave/recovery, and honest band/rubric reporting.
- **Batch 3D:** Extend real Performance Analytics, Rule-Based Study Planner, Mistake Review breakdown, final editorial audit, full test coverage, and documentation sync.
