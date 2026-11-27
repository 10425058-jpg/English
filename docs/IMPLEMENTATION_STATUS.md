# English Quest — Implementation Status

> Updated: 2026-11-27 | Active Branch: `feature/four-skill-intensive-training`

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

- **Milestone 2 — Four-Skill Intensive Training (Batches 2A & 2B Complete; Batches 2C–2D In Progress):**
  - Expanded `ListeningAcademyPage` (`46` lessons across A1–C2 = 40 new + 6 core) with **0.5x–2.0x** speed presets (`speechService.ts`), multi-speaker Web Speech dialogue synthesis (`speakDialogueLine`), loop replay, dictation mode toggle, connected speech notes, bookmarking, and **160** listening comprehension & dictation exercises.
  - Expanded `SpeakingAcademyPage` with **Speaking Academy (`47` lessons)**, **Pronunciation Academy (`24` IPA/Vietnamese trap lessons, `72` discrimination exercises)**, **Shadowing Studio (`20` progressive sessions)**, and **6 Speaking Mindset & Framework guides** (`PREP`, `STAR`, `Past-Present-Future`, `Circumlocution`, etc.).
  - Expanded `ReadingAcademyPage` (`126` leveled passages across A1–C2 = 120 new + 6 core, **480** new comprehension/IELTS-style questions, interactive SM-2 click-to-save glossaries, WPM dwell indicator, paragraph highlighter, summary check, plus all **36** Curated Open Resources).
  - Expanded `WritingAcademyPage` (`97` lessons across A1–C2 = 90 new + 7 core, **270** interactive pre-draft drills, model outlines, clickable vocab/sentence-frame banks, rubrics, common mistakes, annotated model samples, autosave drafts, and side-by-side **Revision Compare** alongside local heuristic feedback).
  - See [MILESTONE_2_PROGRESS.md](./MILESTONE_2_PROGRESS.md) for live batch-by-batch tracking.

- **Phase 2 — Backend & Cloud Persistence:** **Schema & Contracts Drafted**
  - 28 normalized PostgreSQL Prisma models defined in `backend/prisma/schema.prisma`.
  - NestJS modular boundaries and shared API contracts typed in `packages/shared` and `backend/src`.
  - *Not yet deployed:* Live NestJS server runtime, JWT auth, PostgreSQL migrations, and multiplayer authenticated leaderboard.

- **Phase 3 — Server AI & Advanced Speech Providers:** **Interface Ready (Offline Fallback Active)**
  - *Current fallback:* Local deterministic rule-based tutor & heuristic writing checks; Web Speech API synthesis & `MediaRecorder` local audio playback.
  - *Upcoming:* Server-side OpenAI-compatible streaming proxy, token budgets, cloud STT/TTS, and dedicated pronunciation scoring provider.

- **Phase 4 — Advanced Curriculum & Full IELTS Mock Suite:** **Upcoming**
  - B2, C1, and C2 unit authoring and expanded IELTS timed multi-section mock tests.

## Known Limitations (Phase 1)
1. Progress is persisted locally in browser `localStorage`; cross-device cloud sync awaits Phase 2 backend deployment.
2. AI Tutor and Writing feedback run deterministic local coaching offline so zero paid API keys are required; nuanced open-ended essay scoring requires Phase 3 server LLM integration.
3. Speaking Lab voice recordings remain in browser session memory; browser speech-to-text transcripts are rough estimates and not scientific pronunciation scores.
4. Leaderboard shows real 7-day user XP against transparent league tier milestones rather than live peer rankings until Phase 2 backend auth launches.

## Recommended Next Phase
Proceed to **Phase 2 (NestJS + PostgreSQL + Auth + Guest Migration)** using `backend/prisma/schema.prisma` and `docs/API_CONTRACT.md`, deploying the API to Railway/Render and PostgreSQL to Supabase/Railway.
