# English Quest — Technical Architecture

## 1. Monorepo Layout

```text
English/
├── frontend/                 # React 19 + TypeScript + Vite 8 + Tailwind v4 PWA
├── packages/shared/          # Shared TypeScript domain contracts, SM-2 scheduler & validators
├── backend/                  # Phase 2 NestJS + PostgreSQL Prisma schema & module blueprint
├── docs/                     # Architecture, curriculum spec, API contract & milestone status
└── .github/workflows/        # Automated CI validation + GitHub Pages deployment
```

## 2. Frontend Architecture (Phase 1 — Standalone Offline-First)

- **UI & Design System:** Custom tactile 3D button and card system built with Tailwind CSS v4 tokens (`#58CC02`, `#46A302`, `#1CB0F6`, `#FFC800`, `#CE82FF`, `#FF4B4B`, `#F7F8FA`, `#3C3C3C`, `#E5E5E5`) and Nunito typography. Includes original SVG mascot **Pip the Quest Finch** (`PipMascot.tsx`) and original SVG illustrations (`SceneIllustration.tsx`).
- **Routing & GitHub Pages Compatibility:** `HashRouter` combined with Vite `base: '/English/'` on production builds (`public/404.html` fallback included) prevents broken deep links on GitHub Pages static hosting. Heavy routes are code-split via `React.lazy` and `Suspense`.
- **State & Local Persistence:** Zustand store (`useQuestStore.ts`) persisted in `localStorage` (`english-quest-state-v1`), featuring:
  - Idempotent XP & chest claims (`idempotencyKey` deduplication in `xpTransactions`).
  - Lesson recovery (`inProgressLesson` state).
  - Real Mistake Notebook logging and targeted retry resolution.
  - SM-2 Spaced Repetition schedules (`calculateSM2Review` in `@english-quest/shared`).
  - JSON backup export, import, reset, and Phase 2 `GuestMigrationPayload` builder.
- **Audio & Speech Layer (`speechService.ts`):**
  - Web Speech API (`SpeechSynthesis`) for US/UK playback at configurable speeds (`0.75x`–`1.25x`), with clear script fallback when unavailable.
  - Web Audio API synthesized chimes for positive/negative/chest/celebration audio cues.
  - `MediaRecorder` + Web Audio frequency analyzer waveform for local voice recording in Speaking Lab, handling denied permissions or unsupported browsers gracefully.
  - Optional browser `SpeechRecognition` transcript capture explicitly labeled as an estimate (never presented as a scientific pronunciation score).
- **Provider-Independent AI & Writing Layer:**
  - `AITutorProvider` interface + `validateTutorOutput` runtime sanitizer.
  - `LocalSmartTutorProvider` delivers offline rule-based coaching across all 9 tutor modes (including English/Vietnamese explanations and Mistake Notebook lookup) without needing paid API keys.
  - `writingAnalyzer.ts` runs deterministic structural/mechanics checks without ever mutating the user's original text.

## 3. Target Backend & AI Architecture (Phases 2 & 3)

- **Backend (`backend/prisma/schema.prisma` & `backend/src/app.module.ts`):** 28 normalized PostgreSQL Prisma models (`User`, `UserPreferences`, `LearningGoal`, `Course`, `Section`, `Unit`, `Lesson`, `Exercise`, `ExerciseAttempt`, `LessonProgress`, `SkillProgress`, `Vocabulary`, `UserVocabulary`, `ReviewSchedule`, `GrammarTopic`, `Mistake`, `SpeakingSession`, `WritingSubmission`, `ReadingPassage`, `ListeningContent`, `AIConversation`, `AIMessage`, `Achievement`, `UserAchievement`, `DailyQuest`, `Streak`, `XPTransaction`, `IELTSPracticeSession`).
- **Security Controls:** Server-side AI key isolation (zero `VITE_*` AI keys), `XPTransaction.idempotencyKey` unique index, ownership checks on private learning tables, rate limiting, CORS allowlisting, and audio retention controls.
