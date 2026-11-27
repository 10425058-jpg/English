# English Quest — Implementation Status

> Updated: 2026-11-27 | Active Branch: `feature/english-quest-foundation`

## Milestone Summary

- **Phase 1 — Core Product & Visual Foundation:** **Implemented & Verified**
  - Monorepo structure (`frontend/`, `packages/shared/`, `backend/`, `docs/`, `.github/workflows/`).
  - Original visual identity: Pip the Quest Finch animated mascot, custom SVG scenes, tactile 3D button system, Nunito typography, exact color system, desktop 3-column layout, and mobile bottom bar + full drawer.
  - All 15 required routes implemented and interactive (`/learn`, `/listening`, `/speaking`, `/reading`, `/writing`, `/ai-tutor`, `/vocabulary`, `/grammar`, `/ielts`, `/review`, `/quests`, `/leaderboard`, `/achievements`, `/profile`, `/settings`) plus full-screen `/onboarding` and `/lesson/:lessonId`.
  - 12 complete CEFR units across A1, A2, and B1 (48 lessons, 192 curated exercises) + B2–C2 roadmap preview.
  - Reusable exercise engine covering all 15 exercise types, retry queue, bilingual explanations, lesson recovery, and idempotent XP/chest rewards.
  - Four-skill labs, SM-2 spaced repetition flashcards, Mistake Notebook, Recharts real-progress dashboard, offline Local Smart AI Tutor (9 modes), local Writing analyzer, JSON data export/import/reset, and PWA manifest/service worker.
  - GitHub Pages CI/CD workflow configured (`VITE_BASE_PATH=/English/` + `HashRouter`).

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
