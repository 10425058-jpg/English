# English Quest — Content Expansion Roadmap

> Status date: 2026-11-28 | Branch: `feature/four-skill-intensive-training`

## Purpose & Quality Principle

The long-term platform blueprint spans up to 15,000 lexical entries, 200 grammar lessons, 600 lessons per communicative skill, 500 IELTS activities, and 20,000 interactive exercises. Rather than generating repetitive filler or thin records to inflate metrics, **every milestone adds verified, pedagogically complete, non-duplicate modular packs** gated automatically by `npm run validate:content`.

## Multi-Milestone Delivery Plan

| Milestone | Educational Scope | Key Deliverables | Status |
|---|---|---|---|
| **Baseline (Phase 1)** | Core A1–B1 visual learning path & 4-skill workspace | 12 units (48 lessons, 192 exercises), 24 seed vocab, 7 grammar lessons, 6 listening, 7 speaking, 6 reading, 7 writing, 7 IELTS | **Completed** (`main` @ `7e3b872`) |
| **Milestone 1** | Lazy modular `content/` architecture, A1–C2 foundation packs, Grammar Academy, Collections, Open Resource Directory, Automated QA | **1,444** new A1–C2 vocab (+24 seed = 1,468), **48** deep A1–C2 Grammar Academy lessons (+7 core = 55), **30** thematic collections, **600** new interactive vocab/grammar exercises (+144 quizzes = 744 new / 944 total), **36** verified open resources, **6-level** A1–C2 Coverage Matrix | **Completed & Verified** |
| **Milestone 2 (Current)** | Four-skill intensive academies, pronunciation/shadowing studios, practical dialogues, think-in-English & integrated 4-skill loops | **120** Listening (`720` ex), **120** Speaking (`+6` guides), **120** Reading (`600` ex), **90** Writing (`270` ex), **48** Pronunciation (`240` ex), **60** Shadowing, **60** Conversations, **30** Think in English, **24** Integrated 4-skill units (`1,830` M2 exercises / `2,774` total) | **Batches 2A–2C Verified; Batch 2D Authored & Typechecked (CI Pending)** |
| **Milestone 3 (Planned)** | Full B2–C2 interactive roadmap nodes & timed IELTS practice packs | Interactive B2/C1/C2 path nodes in `LearnPage`, Task 1 visual data commentary sets, Task 2 essay rubrics & timed mock tracks | **Planned** |
| **Milestone 4 (Planned)** | Lexicon & exercise scaling + PostgreSQL/Prisma curriculum ingestion | Progressive expansion toward 15,000 lexical entries, 200 thematic collections, and 20,000 drills backed by Phase 2 database seeding | **Planned** |
