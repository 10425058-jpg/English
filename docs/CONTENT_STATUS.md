# English Quest — Current Content Status

> Updated: 2026-11-28 | Synchronized with regenerated [CONTENT_QUALITY_REPORT.md](./CONTENT_QUALITY_REPORT.md) (`0` errors, `0` warnings; Batch 3B on `feature/advanced-cefr-ielts-mastery`)

This document records **exact observed repository counts** only—never counting planned Phase 4 or unimplemented Batch 3C–3D items as finished work.

## Cumulative Content Inventory

| Content Category | Baseline (Phase 1) | Milestone 1 + 2 Added | Milestone 3 Added (Batch 3A + 3B) | Combined Total | Long-Term Blueprint Target | Completion Status |
|---|---:|---:|---:|---:|---:|---|
| Learning Path CEFR Units | 12 *(A1–B1 u1–4)* | 0 | 36 *(A1–B1 u5–8 + B2–C2 u1–8)* | **48** *(8 per level)* | 48+ | **Batch 3A Complete (All A1–C2 Active)** |
| Learning Path Lessons | 48 | 0 | 216 *(6 per M3 unit)* | **264** | 264+ | **Batch 3A Complete** |
| Structured Assessments & CEFR Exams | 0 | 0 | 45 *(36 unit + 6 level exams + 3 diag/review)* | **45** | 45+ | **Batch 3A Complete** |
| Vocabulary & Lexical Entries | 24 | 1,444 | 0 | **1,468** | 15,000 | Milestone 1 Complete (~9.8%) |
| Grammar Lessons & Guides | 7 | 48 | 0 | **55** | 200 | Milestone 1 Complete (27.5%) |
| Thematic Vocabulary Collections | 0 | 30 | 0 | **30** | 200 | Milestone 1 Complete (15.0%) |
| Interactive Exercises & Quizzes | 200 | 744 *(M1)* + 1,830 *(M2)* | 1,488 *(648 M3 lesson + 240 assessment + 600 IELTS; +51 reused refs tracked separately)* | **4,262** | 20,000 | Milestone 1 + 2 + Batches 3A–3B (~21.3%) |
| Curated Open Educational Resources | 0 | 36 | 0 | **36** | 30+ | **Milestone Target Met** |
| CEFR Matrix Specifications | 3 active | 6 full A1–C2 | All 6 interactive tracks unlocked | **6 levels** | 6 levels | **Complete (A1–C2 Active)** |
| Listening Lessons | 6 | 120 *(Batches 2A + 2D)* | 0 | **126** | 600 | **Milestone 2 Target Met (120 new)** |
| Speaking Lessons | 7 | 120 *(Batches 2A + 2D, +6 guides)* | 0 | **127** | 600 | **Milestone 2 Target Met (120 new)** |
| Pronunciation Academy Lessons | 0 | 48 *(Batches 2A + 2C + 2D drills)* | 0 | **48** | 150 | **Milestone 2 Target Met (48 new)** |
| Shadowing Studio Sessions | 0 | 60 *(Batches 2A + 2C)* | 0 | **60** | — | **Milestone 2 Target Met (60 new)** |
| Practical Conversation Scenarios | 0 | 60 *(Batch 2C)* | 0 | **60** | 300 | **Milestone 2 Target Met (60 new)** |
| Think in English Drills | 0 | 30 *(Batch 2C)* | 0 | **30** | — | **Milestone 2 Target Met (30 new)** |
| Integrated 4-Skill Units | 0 | 24 *(Batch 2C)* | 0 | **24** | — | **Complete (24 loops)** |
| Reading Passages | 6 | 120 *(Batch 2B + 2D drills)* | 0 | **126** | 600 | **Milestone 2 Target Met (120 new)** |
| Writing Activities | 7 | 90 *(Batch 2B)* | 0 | **97** | 400 | **Milestone 2 Target Met (90 new)** |
| IELTS Mastery Center & Packs | 7 | 0 | 310 *(80 L, 100 S, 60 R, 60 W, 10 Idea/Lexis)* | **317** | 500 | **Batch 3B Complete (Strategies/Mocks Next in 3C)** |

## Milestone 1 Breakdown by CEFR Level

| Level | Expanded Vocabulary | Expanded Grammar Academy | Practice Bank Exercises |
|---|---:|---:|---:|
| **A1** | 209 | 8 *(+24 quizzes)* | 100 |
| **A2** | 325 | 8 *(+24 quizzes)* | 100 |
| **B1** | 240 | 8 *(+24 quizzes)* | 100 |
| **B2** | 233 | 8 *(+24 quizzes)* | 100 |
| **C1** | 208 | 8 *(+24 quizzes)* | 100 |
| **C2** | 229 | 8 *(+24 quizzes)* | 100 |
| **Total Milestone 1** | **1,444** | **48** *(+144 quizzes)* | **600** |

## Bundle & Integration Architecture

- All `content/` datasets load **lazily per CEFR level or domain pack** via dynamic `import()` in [content/index.ts](../content/index.ts), paired with TanStack Query caching across `VocabularyPage`, `GrammarPage`, `LearnPage`, and `ReadingPage`.
- Existing Phase 1 routes, visual theme, SM-2 scheduler, and user progress keys (`english-quest-state-v1`) remain 100% compatible.
