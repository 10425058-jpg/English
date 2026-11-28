# English Quest — Milestone 3 Progress Report

> Branch: `feature/advanced-cefr-ielts-mastery` | Base: `main` @ `54b5ee5` (PR #4 merged)

## Delivery Status Across Batches

| Batch | Focus | Status | Verified Highlights |
|---|---|---|---|
| **Audit & Baseline** | Repository count audit & official IELTS spec reconciliation | **Done** | [MILESTONE_3_AUDIT.md](./MILESTONE_3_AUDIT.md) + reconciled M1/M2 baseline (`2,774` baseline exercises) |
| **Batch 3A** | Complete A1–C2 CEFR Learning Path & Structured Assessments | **Done (CI Passed `358b7dd`)** | `36` new CEFR units (`48` total), `216` new lessons (`264` total), `45` assessments (`36` unit + `6` level exams + `3` diagnostic/review), `888` newly authored exercises (`51` reused refs tracked separately) |
| **Batch 3B** | IELTS Mastery Center Academies & Idea/Lexis Banks | **Done (CI Passed `e945f1c`)** | `310` IELTS entries (`80` Listening, `100` Speaking, `60` Reading [40 Ac / 20 GT], `60` Writing [20 Ac T1 w/ Recharts visuals / 10 GT Letters / 30 T2 Essays], `10` Topic Idea Banks) + `600` new IELTS exercises + Academic/GT scoring scaling |
| **Batch 3C** | IELTS Strategy Academy & 12 Timed Mock Examinations | **Done (Local Validated; CI Pending Push)** | `60` IELTS strategy lessons (`120` new exercises) + distraction-free `/mock-exam/:mockId` engine (timers, split-screen Reading, Task 1 visuals, local recorder, autosave) + `8` Academic & `4` GT full 4-skill mocks |
| **Batch 3D** | Real Analytics, Study Planner, Mistake Diagnostic & Release Verification | **Planned** | Real study metrics, rule-based planner, mistake clustering, full CI verification & open PR |

---

## Batch 3A Verified Inventory & Architecture

- **Curriculum Expansion (`content/curriculum/`):**
  - `A1`: `+4` units (`a1-u5..a1-u8`, `24` lessons) -> **`8` active A1 units**
  - `A2`: `+4` units (`a2-u5..a2-u8`, `24` lessons) -> **`8` active A2 units**
  - `B1`: `+4` units (`b1-u5..b1-u8`, `24` lessons) -> **`8` active B1 units**
  - `B2`: `+8` units (`b2-u1..b2-u8`, `48` lessons) -> **`8` active B2 units**
  - `C1`: `+8` units (`c1-u1..c1-u8`, `48` lessons) -> **`8` active C1 units**
  - `C2`: `+8` units (`c2-u1..c2-u8`, `48` lessons) -> **`8` active C2 units**
  - **Total Newly Authored Batch 3A Path:** `36` units, `216` lessons (`6` lessons per unit covering vocabulary, grammar, listening/speaking, reading, synthesis writing/dialogue, and checkpoint), `648` newly authored lesson exercises, plus `51` explicitly tagged `reusedExerciseRefs` (never double-counted).

- **Structured Assessments (`content/assessments/`):**
  - `36` Unit Mastery Assessments (`unit-assess-a1-u5..unit-assess-c2-u8`, `180` exercises, `70%` mastery threshold).
  - `6` Comprehensive CEFR Level Completion Assessments (`cefr-exam-a1..cefr-exam-c2`, `48` multi-skill exercises + self-evaluated productive prompts, `75%` mastery threshold).
  - `3` Diagnostic, Section Bridge & Mixed Review Packs (`assess-diag-core`, `assess-section-b1-b2-bridge`, `assess-mixed-c1-c2-review`, `12` exercises).
  - **Unofficial Alignment Notice:** Every assessment displays explicit internal alignment wording clarification (`isUnofficialNotice`).

- **UI, Store & Assessment Player Integration:**
  - `LearnPage.tsx`: Replaced preview-only B2–C2 roadmap cards with all 6 interactive `A1–C2` tabs, real CEFR Level Mastery bars strictly decoupled from XP, flexible starting-level switch (`setRecommendedCefr`), `Jump Ahead & Unlock` independent unit override (`unlockUnitForIndependentPractice`), skill-specific path node icons, deep Unit Guide cross-links, and Unit Mastery Assessment nodes, plus dedicated `Assessments & Matrix` tab.
  - `AssessmentPlayerPage.tsx` (`/assessment/:assessmentId`): Distraction-free objective + optional productive draft runner, per-skill accuracy breakdown, immediate explanations, Mistake Notebook logging, and targeted revision links.
  - `LessonPlayerPage.tsx`: Asynchronous M3 lesson loading (`loadCurriculumLessonById`), collapsible non-blocking Lesson Guide/Examples/Practice Links panel, post-lesson summary cards, and direct Unit Mastery Assessment handoff on Lesson 6 completion.
  - `placementTest.ts` & `OnboardingPage.tsx`: Extended placement test to `14` items covering `A1–C2` and removed B1 clamping on manual self-selection.

## Validation Notes

- Local validation (`tsc` + `runValidation(true)`), monorepo `npm run typecheck`, and frontend `npm run lint` all passed (`0` errors, `0` warnings).
- Local Vitest/Vite rollup execution remains blocked by Windows Application Control on `rolldown-binding.win32-x64-msvc.node`; full Vite production build, Vitest unit suite, `validate:content`, and Playwright E2E smoke tests run on `ubuntu-latest` GitHub Actions CI upon push.

---

## Batch 3B Verified Inventory & Architecture

- **Scoring & Domain Helpers (`packages/shared/src/utils/ieltsScoring.ts`):**
  - Implements 40-mark raw-to-band conversion differentiating `'academic'` vs `'general_training'` Reading curves (`convertReadingRawToBand`), `convertListeningRawToBand`, official `.25/.75` half-band rounding (`roundIeltsOverallBand`), and `UNOFFICIAL_IELTS_NOTICE` practice banner text.
- **IELTS Academies (`content/ielts/`):**
  - **Listening (`80` items / `160` exercises):** `20` per Part 1–4 across accents with multi-speaker scripts, distractor trap notes, audio controls, and one-word/phrase checks.
  - **Speaking (`100` sets):** `40` Part 1 interviews + `30` Part 2 Cue Cards (60s prep / 120s long turn timers) + `30` Part 3 abstract analytical discussions, each featuring collocations and Band 6 vs Band 8 comparisons.
  - **Reading (`60` passages / `300` exercises):** `40` multi-paragraph Academic texts (`ielts-rd-ac-01..40`) + `20` authentic General Training texts across Section 1 Everyday Survival, Section 2 Workplace Policy, and Section 3 Feature Articles (`ielts-rd-gt-01..20`).
  - **Writing (`60` tasks / `120` exercises):** `20` Academic Task 1 visuals (`line`, `bar`, `pie`, `table`, `process`, `map` rendered interactively via `IeltsVisualRenderer` using Recharts) + `10` GT Task 1 Letters (`formal`, `semi_formal`, `informal`) + `30` Task 2 essays across all 5 IELTS Task 2 genres, with autosaved timed drafting and Band 6 vs Band 8 comparisons.
  - **Topic Idea & Lexis Bank (`10` packs / `20` exercises):** Deep argument pairs, counterpoints, academic collocations, and natural spoken expressions.
- **UI & Lazy Chunking (`frontend/src/features/ielts/`):**
  - `IeltsPage.tsx`, `IeltsVisualRenderer.tsx`, `IeltsListeningSpeakingTabs.tsx`, and `IeltsReadingWritingIdeaTabs.tsx` dynamically import chunks per tab via `content/index.ts`.

---

## Batch 3C Verified Inventory & Architecture

- **IELTS Strategy & Methodology Academy (`content/ielts/strategy_lessons.ts`):**
  - `60` lessons across 5 pillars (`listening`, `reading`, `writing`, `speaking`, `exam_day` — `12` each), featuring step-by-step tactical breakdowns, Trap Pattern & Counter-Move modules, pacing allocations, annotated snippets, and **`120` interactive strategy application checks**.
- **Timed 4-Skill Mock Examination Suite (`content/ielts/mock_exams.ts` & `MockExamPlayerPage.tsx`):**
  - `12` distinct non-overlapping mock bundles (`8` Academic `ielts-mock-ac-01..08`, `4` General Training `ielts-mock-gt-01..04`) assembled dynamically via `assembleIeltsMockExamById`.
  - Dedicated distraction-free `/mock-exam/:mockId` simulator with per-section countdown clocks (`30m`/`60m`/`60m`/`14m`), automatic crash-recovery autosave (`inProgressMockExam`), split-screen Reading reader, Task 1 visuals/letters, live Writing counters & heuristic self-practice band estimate, Speaking prep/turn timers + local `MediaRecorder` playback, Mistake Notebook sync, and unofficial overall `.25/.75` rounded reporting.
