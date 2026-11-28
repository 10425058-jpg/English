# English Quest — Implementation Status

> Updated: 2026-11-28 | Active Branch: `feature/advanced-cefr-ielts-mastery` (Milestone 3 Batches 3A–3B)

## Milestone Summary

- **Phase 1 — Core Product & Visual Foundation:** **Implemented & Verified (`main` @ `7e3b872`)**
  - Monorepo structure (`frontend/`, `packages/shared/`, `backend/`, `docs/`, `.github/workflows/`).
  - Original visual identity: Pip the Quest Finch animated mascot, custom SVG scenes, tactile 3D button system, Nunito typography, exact color system, desktop 3-column layout, and mobile bottom bar + full drawer.
  - All 15 required routes implemented and interactive (`/learn`, `/listening`, `/speaking`, `/reading`, `/writing`, `/ai-tutor`, `/vocabulary`, `/grammar`, `/ielts`, `/review`, `/quests`, `/leaderboard`, `/achievements`, `/profile`, `/settings`) plus full-screen `/onboarding` and `/lesson/:lessonId`.
  - 12 complete CEFR units across A1, A2, and B1 (48 lessons, 192 curated exercises) + B2–C2 roadmap preview.
  - Reusable exercise engine covering expanded interactive formats, retry queue, bilingual explanations, lesson recovery, and idempotent XP/chest rewards.
  - Four-skill labs, SM-2 spaced repetition flashcards, Mistake Notebook, Recharts real-progress dashboard, offline Local Smart AI Tutor (9 modes), local Writing analyzer, JSON data export/import/reset, and PWA manifest/service worker.

- **Milestone 1 — Massive Content & Curriculum Expansion:** **Implemented & Verified**
  - Lazy per-level modular `content/` architecture (`@content/index`) preserving lightweight startup bundle size via dynamic Vite `import()` splitting paired with TanStack Query caching.
  - **1,444** new A1–C2 curated vocabulary entries (+24 core seed = **1,468 total**) with UK/US IPA variants, register tags, synonyms/antonyms, collocations, usage notes, and bilingual sentences.
  - **48** deep Grammar Academy lessons across A1–C2 (8/level, 17 pedagogical components each + 144 quizzes; **55 total grammar topics** including 7 core guides).
  - **30** Thematic Vocabulary Collections (`Everyday`, `Academic`, `Professional`, `IELTS & Advanced`) integrated directly with SM-2 flashcard study decks.
  - **600** unique interactive Vocabulary & Grammar practice drills (100/level across 13 distinct formats, bringing total verified interactive items to **944**).
  - **36** verified open educational resources integrated into `ReadingPage`, plus the **6-level A1–C2 Curriculum Matrix** visible in `LearnPage`.
  - Automated validation suite (`npm run validate:content`) + Vitest integration tests enforcing zero duplicate IDs, zero broken references, and 100% evaluator round-trip verification (`docs/CONTENT_QUALITY_REPORT.md`).

- **Milestone 2 — Four-Skill Intensive Training (Complete & Merged via PR #4):**
  - Expanded `ListeningAcademyPage` (`126` lessons across A1–C2 = 120 new + 6 core) with **0.5x–2.0x** speed presets (`speechService.ts`), multi-speaker Web Speech dialogue synthesis (`speakDialogueLine`), loop replay, dictation mode toggle, connected speech notes, bookmarking, and **720** new listening comprehension & dictation exercises.
  - Expanded `SpeakingAcademyPage` with **Speaking Academy (`127` lessons = 120 new + 7 core)**, **Conversations Studio (`60` branching scenarios across 6 domains)**, **Think in English (`30` timed anti-translation & circumlocution sprints)**, **Pronunciation Academy (`48` IPA/Vietnamese trap lessons, `240` discrimination exercises)**, **Shadowing Studio (`60` progressive sessions)**, and **6 Speaking Mindset & Framework guides** (`PREP`, `STAR`, `Past-Present-Future`, `Circumlocution`, etc.).
  - Expanded `LearnPage` with **Integrated Loops (`24` thematic L -> R -> S -> W pathways)** connecting matched Listening, Reading, Speaking, Writing, and SM-2 vocabulary items cleanly across A1–C2.
  - Expanded `ReadingAcademyPage` (`126` leveled passages across A1–C2 = 120 new + 6 core, **600** new comprehension/IELTS-style questions, interactive SM-2 click-to-save glossaries, WPM dwell indicator, paragraph highlighter, summary check, plus all **36** Curated Open Resources).
  - Expanded `WritingAcademyPage` (`97` lessons across A1–C2 = 90 new + 7 core, **270** interactive pre-draft drills, model outlines, clickable vocab/sentence-frame banks, rubrics, common mistakes, annotated model samples, autosave drafts, and side-by-side **Revision Compare** alongside local heuristic feedback).
  - See [MILESTONE_2_PROGRESS.md](./MILESTONE_2_PROGRESS.md) for live batch-by-batch tracking and verification status.

- **Milestone 3 — Advanced CEFR Learning Path & IELTS Mastery Center (Batches 3A–3B Active on `feature/advanced-cefr-ielts-mastery`):**
  - **Batch 3A (Complete & CI Passed `358b7dd`):** Activated full A1–C2 CEFR Learning Path (`36` new units + `12` core = `48` total units across `A1–C2`, `216` new structured lessons + `48` core = `264` lessons), **`45` structured assessments** (`36` Unit Mastery + `6` CEFR Level Completion Exams + `3` diagnostic/section/mixed review packs), **`888` newly authored interactive exercises** (`+51` reused drill references tracked separately), upgraded `placementTest.ts` across A1–C2 (`14` items), added dedicated `/assessment/:assessmentId` Assessment Player, separated non-XP CEFR Mastery metrics, flexible level unlocking, and collapsible lesson briefing panels. See [MILESTONE_3_PROGRESS.md](./MILESTONE_3_PROGRESS.md).
  - **Batch 3B (Complete & Local Validated):** Upgraded `IeltsPage.tsx` into the full IELTS Mastery Center with Academic vs. General Training separation (`ieltsScoring.ts` 40-mark curves & `.25/.75` rounding), **`80` Listening** items (`160` ex), **`100` Speaking** sets (Cue Cards w/ 1m/2m timers, mic recorder, Band 6 vs Band 8 comparisons), **`60` Reading** passages (`40` Academic + `20` GT, `300` ex), **`60` Writing** prompts (`20` Academic Task 1 w/ Recharts `line`/`bar`/`pie`/Table/Process/Map visuals, `10` GT Letters, `30` Task 2 essays, `120` ex), and **`10` Topic Idea & Lexis Packs** (`20` ex) -> **`4,262` combined interactive exercises**.
  - **Batches 3C–3D (Planned Next):** `60` IELTS Strategy Lessons + `12` Timed Mock Exams (`8` Academic, `4` GT), real analytics, adaptive study planner, and mistake breakdown.

- **Phase 2 — Backend & Cloud Persistence:** **Schema & Contracts Drafted**
  - 28 normalized PostgreSQL Prisma models defined in `backend/prisma/schema.prisma`.
  - NestJS modular boundaries and shared API contracts typed in `packages/shared` and `backend/src`.
  - *Not yet deployed:* Live NestJS server runtime, JWT auth, PostgreSQL migrations, and multiplayer authenticated leaderboard.

- **Phase 3 — Server AI & Advanced Speech Providers:** **Interface Ready (Offline Fallback Active)**
  - *Current fallback:* Local deterministic rule-based tutor & heuristic writing checks; Web Speech API synthesis & `MediaRecorder` local audio playback.
  - *Upcoming:* Server-side OpenAI-compatible streaming proxy, token budgets, cloud STT/TTS, and dedicated pronunciation scoring provider.

- **Phase 4 — Platform Scale & Full Exam Content:** **In Progress via Milestone 3**
  - Expanded B2, C1, and C2 learning path tracks delivered cleanly in Milestone 3 Batch 3A; expanded IELTS timed multi-section mock tests queued for Batches 3B–3D.

## Known Limitations (Phase 1)
1. Progress is persisted locally in browser `localStorage`; cross-device cloud sync awaits Phase 2 backend deployment.
2. AI Tutor and Writing feedback run deterministic local coaching offline so zero paid API keys are required; nuanced open-ended essay scoring requires Phase 3 server LLM integration.
3. Speaking Lab voice recordings remain in browser session memory; browser speech-to-text transcripts are rough estimates and not scientific pronunciation scores.
4. Leaderboard shows real 7-day user XP against transparent league tier milestones rather than live peer rankings until Phase 2 backend auth launches.

## Recommended Next Phase
Proceed to **Phase 2 (NestJS + PostgreSQL + Auth + Guest Migration)** using `backend/prisma/schema.prisma` and `docs/API_CONTRACT.md`, deploying the API to Railway/Render and PostgreSQL to Supabase/Railway.
