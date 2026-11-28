# English Quest — Milestone 3 Progress Report

> Branch: `feature/advanced-cefr-ielts-mastery` | Base: `main` @ `54b5ee5` (PR #4 merged)

## Delivery Status Across Batches

| Batch | Focus | Status | Verified Highlights |
|---|---|---|---|
| **Audit & Baseline** | Repository count audit & official IELTS spec reconciliation | **Done** | [MILESTONE_3_AUDIT.md](./MILESTONE_3_AUDIT.md) + reconciled M1/M2 baseline (`2,774` baseline exercises) |
| **Batch 3A** | Complete A1–C2 CEFR Learning Path & Structured Assessments | **Done (Local Validated; CI Pending Push)** | `36` new CEFR units (`48` total), `216` new lessons (`264` total), `45` assessments (`36` unit + `6` level exams + `3` diagnostic/review), `888` newly authored exercises (`51` reused refs tracked separately) |
| **Batch 3B** | IELTS Mastery Center Academies & Idea/Lexis Banks | **Planned Next** | `80` Listening, `100` Speaking, `60` Reading, `60` Writing, Academic/GT separation |
| **Batch 3C** | IELTS Strategy Academy & 12 Timed Mock Examinations | **Planned** | `60` strategy lessons + distraction-free exam runner + `8` Academic & `4` GT full 4-skill mocks |
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
