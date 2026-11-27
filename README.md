# English Quest

An original, playful, gamified English learning platform built with React, TypeScript, Tailwind CSS, Zustand, Recharts, and a NestJS/PostgreSQL backend architecture blueprint.

## Features Implemented (Phase 1)

- **Onboarding & Placement Test:** Customize native language, purpose, target CEFR, IELTS target band, daily goal (5/15/30/60/90 min), preferred accent (`en-US` / `en-GB`), and take a 10-question multi-skill placement test or start manually.
- **Interactive CEFR Learning Path (A1–B1 Complete, B2–C2 Roadmap):** 12 complete units (48 lessons, 192 curated exercises) with curved alternating nodes, unit guides, checkpoints, skill challenges, and claimable treasure chests.
- **Reusable 15-Type Exercise Engine:** Multiple choice, fill in the blanks, word matching, sentence reconstruction, translation, error correction, audio recognition, dictation, speaking, reading comprehension, free writing, dialogue completion, vocabulary recognition, grammar challenge, and scenario conversation—with idempotent XP rewards and mistake retry loops.
- **Four-Skill Practice Labs:**
  - **Listening Lab:** Web Speech Synthesis playback (`en-US`/`en-GB`), speed control (`0.75x`–`1.25x`), minimal pairs, stories, podcasts, lectures, IELTS listening, and post-submission transcripts.
  - **Speaking Lab:** Local `MediaRecorder` recording, live waveform visualizer, audio playback, custom SVG picture descriptions, roleplays, and honest separation of rough browser STT vs Phase 3 pronunciation providers.
  - **Reading Library:** Categorized passages, font size controls, timer, interactive clickable vocabulary with IPA & Vietnamese meanings, one-click saving to Vocabulary Notebook, and 7 IELTS/reading question formats.
  - **Writing Lab:** Live word count, timer, local draft autosave, non-destructive analysis preserving original work, and model responses.
- **AI Tutor With Pip (Offline Smart Coach):** 9 tutor modes (`Free Conversation`, `Grammar Teacher`, `Vocabulary Coach`, `Pronunciation Coach`, `Writing Assistant`, `IELTS Examiner`, `Debate Partner`, `Think in English`, `Explain My Mistakes`), English-only or EN–VI bilingual explanations, and zero API key requirement.
- **Vocabulary Notebook & SM-2 Spaced Repetition:** Interactive flashcards with active recall and SM-2 scheduling.
- **Grammar Academy & IELTS Center:** Formula cards, common mistakes, quizzes, Academic/General Training pathways, and timed mini-mock.
- **Review, Mistake Notebook & Real Analytics:** Recharts 4-skill radar & 7-day activity charts derived strictly from real stored activity, plus JSON data export/import/reset.

## Repository Structure

```text
English/
├── frontend/          # React 19 + Vite 8 + Tailwind CSS v4 + Motion + Zustand + Recharts PWA
├── packages/shared/   # Shared domain models, API contracts, SM-2 scheduler & answer validators
├── backend/           # Phase 2 Prisma PostgreSQL schema (28 models) & NestJS module blueprint
├── docs/              # ARCHITECTURE.md, CURRICULUM_SPEC.md, API_CONTRACT.md, IMPLEMENTATION_STATUS.md
└── .github/workflows/ # CI validation + GitHub Pages deployment
```

## Quick Start

### Prerequisites
- Node.js 22+ (tested on Node 24)
- npm 10+

### Install & Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/English/`.

### Validation & Testing

```bash
npm run typecheck   # TypeScript strict check across shared, frontend, and backend
npm run lint        # ESLint across frontend
npm run test        # Vitest unit tests (SM-2, validators, curriculum integrity, store, services)
npm run build       # Production build (configured with /English/ base path for GitHub Pages)
npm run test:e2e    # Playwright smoke + responsive desktop/mobile screenshot verification
```

## Deployment

- **Frontend:** Automated via `.github/workflows/ci-cd.yml` to GitHub Pages on push to `main` (`VITE_BASE_PATH=/English/` with `HashRouter` + `404.html` redirect).
- **Backend & Database (Phase 2):** Planned for Railway + Supabase/Railway PostgreSQL using `backend/prisma/schema.prisma`. See `.env.example` for environment variables.

## Documentation

- [Technical Architecture](docs/ARCHITECTURE.md)
- [Curriculum Specification](docs/CURRICULUM_SPEC.md)
- [API Contract Draft](docs/API_CONTRACT.md)
- [Implementation Status & Roadmap](docs/IMPLEMENTATION_STATUS.md)
