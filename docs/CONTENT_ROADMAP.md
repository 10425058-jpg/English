# English Quest — Content Expansion Roadmap

> Status date: 2026-11-28 | Branch: `feature/massive-knowledge-expansion`

## Purpose & Quality Principle

The long-term platform blueprint spans up to 15,000+ lexical entries, 200+ grammar lessons, 600 lessons per communicative skill, 500 IELTS activities, and 20,000 interactive exercises. Rather than generating repetitive filler or thin records to inflate metrics, **every milestone adds verified, pedagogically complete, non-duplicate modular packs** gated automatically by `npm run validate:content`.

## Multi-Milestone Delivery Plan

| Milestone | Educational Scope | Key Deliverables | Status |
|---|---|---|---|
| **Baseline (Phase 1)** | Core A1–B1 visual learning path & 4-skill workspace | 12 units (48 lessons, 192 exercises), 24 seed vocab, 7 grammar lessons, 6 listening, 7 speaking, 6 reading, 7 writing, 7 IELTS | **Completed** (`main` @ `7e3b872`) |
| **Milestone 1** | Lazy modular `content/` architecture, A1–C2 foundation packs, Grammar Academy, Collections, Open Resource Directory | **1,444** new A1–C2 vocab (+24 seed = 1,468), **48** Grammar Academy lessons (+7 core = 55), **30** thematic collections, **600** vocab/grammar drills (+144 quizzes = 744 new / 944 total), **36** curated open resources | **Completed (PR #1–#3)** |
| **Milestone 2** | Four-skill intensive academies, pronunciation/shadowing studios, practical dialogues, think-in-English & integrated 4-skill loops | **120** Listening (`720` ex), **120** Speaking (`+6` guides), **120** Reading (`600` ex), **90** Writing (`270` ex), **48** Pronunciation (`240` ex), **60** Shadowing, **60** Conversations, **30** Think in English, **24** Integrated 4-skill units (`1,830` M2 exercises / `2,774` total) | **Completed (PR #4)** |
| **Milestone 3** | Full A1–C2 Learning Path, 45 Structured Assessments, IELTS Mastery Center, Strategy Academy & Analytics | **36** new CEFR units (`48` total), **216** lessons (`264` total), **45** assessments, **382** M3 IELTS activities, **1,608** newly authored M3 exercises (`+51` reused refs), adaptive planner & mistake clustering (`4,382` total exercises) | **Completed (PR #6)** |
| **Milestone 4 — Batch 4A** | M3 Examination Integrity Repair, Extended Lexical Schemas, Import/Dedup/License Pipeline & Sharded Bilingual Search (`Ctrl+K`) | Strict `40/40` vs `8L/15R` separation, **2** Full 40L+40R Mock Exams (`160` new questions -> **4,542** total exercises), removed Writing heuristic & default `6.5` Speaking, post-exam rubric/teacher panel, **2,911** sharded EN+VI search entries | **Complete Locally (Batch 4A)** |
| **Milestone 4 — Batches 4B–4F** | Massive Vocabulary, Multiword Expressions, Morphology, Contrastive Grammar, Domain Readings & Interactive Knowledge Graph | Progressive verified batches (`5,000 -> 15,000+` lexical entries, `500+` phrasal verbs, `400+` idioms, `1,200+` collocations, `250+` confused words, `160+` grammar, `200` collections, `20,000+` exercises, Knowledge Graph Explorer) | **In Progress (4B Next)** |
