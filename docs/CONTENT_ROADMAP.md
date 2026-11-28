# English Quest — Content Expansion Roadmap

> Status date: 2026-11-28 | Branch: `feature/advanced-cefr-ielts-mastery`

## Purpose & Quality Principle

The long-term platform blueprint spans up to 15,000 lexical entries, 200 grammar lessons, 600 lessons per communicative skill, 500 IELTS activities, and 20,000 interactive exercises. Rather than generating repetitive filler or thin records to inflate metrics, **every milestone adds verified, pedagogically complete, non-duplicate modular packs** gated automatically by `npm run validate:content`.

## Multi-Milestone Delivery Plan

| Milestone | Educational Scope | Key Deliverables | Status |
|---|---|---|---|
| **Baseline (Phase 1)** | Core A1–B1 visual learning path & 4-skill workspace | 12 units (48 lessons, 192 exercises), 24 seed vocab, 7 grammar lessons, 6 listening, 7 speaking, 6 reading, 7 writing, 7 IELTS | **Completed** (`main` @ `7e3b872`) |
| **Milestone 1** | Lazy modular `content/` architecture, A1–C2 foundation packs, Grammar Academy, Collections, Open Resource Directory, Automated QA | **1,444** new A1–C2 vocab (+24 seed = 1,468), **48** deep A1–C2 Grammar Academy lessons (+7 core = 55), **30** thematic collections, **600** new interactive vocab/grammar exercises (+144 quizzes = 744 new / 944 total), **36** verified open resources, **6-level** A1–C2 Coverage Matrix | **Completed & Verified** |
| **Milestone 2** | Four-skill intensive academies, pronunciation/shadowing studios, practical dialogues, think-in-English & integrated 4-skill loops | **120** Listening (`720` ex), **120** Speaking (`+6` guides), **120** Reading (`600` ex), **90** Writing (`270` ex), **48** Pronunciation (`240` ex), **60** Shadowing, **60** Conversations, **30** Think in English, **24** Integrated 4-skill units (`1,830` M2 exercises / `2,774` total) | **Completed (PR #4)** |
| **Milestone 3 — Batch 3A** | Complete A1–C2 interactive Learning Path & Structured CEFR Assessment Framework | **36** new structured CEFR units (`48` cumulative: 8/level A1–C2), **216** learning-path lessons (`264` cumulative), **45** structured assessments (`36` unit mastery + `6` CEFR level completion exams + `3` diagnostic/review), **888** newly authored M3 exercises (`+51` reused bank refs tracked separately), A1–C2 placement upgrade, `/assessment/:assessmentId` player, non-XP mastery meter | **Completed on Branch (Batch 3A)** |
| **Milestone 3 — Batches 3B–3D** | Comprehensive IELTS Mastery Center, Strategy Academy, 12 Timed Mock Exams & Learning Analytics | 80 IELTS Listening, 100 IELTS Speaking, 60 IELTS Reading, 60 IELTS Writing, 60 Strategy lessons, 12 full 4-skill timed mocks, analytics dashboard & adaptive study planner | **Planned Next (Batches 3B–3D)** |
| **Milestone 4 (Planned)** | Lexicon & exercise scaling + PostgreSQL/Prisma curriculum ingestion | Progressive expansion toward 15,000 lexical entries, 200 thematic collections, and 20,000 drills backed by Phase 2 database seeding | **Planned** |
