# English Quest — Current Content Status

> Generated & checked against `npm run validate:content -- --write-report` | Last verified: 2026-11-27

This document records **exact observed repository counts** only—never counting planned Phase 2–4 milestones as finished work.

## Verified Cumulative Content Inventory

| Content Category | Baseline (Phase 1) | Milestone 1 Added | Verified Live Total | Long-Term Blueprint Target | Completion Status |
|---|---:|---:|---:|---:|---|
| Vocabulary & Lexical Entries | 24 | 1,444 | **1,468** | 15,000 | Milestone 1 Complete (~9.8%) |
| Grammar Lessons & Guides | 7 | 48 | **55** | 200 | Milestone 1 Complete (27.5%) |
| Thematic Vocabulary Collections | 0 | 30 | **30** | 200 | Milestone 1 Complete (15.0%) |
| Interactive Exercises & Quizzes | 200 | 744 *(600 bank + 144 academy)* + 1,054 *(Milestone 2A–2C)* | **1,998** | 20,000 | Milestone 1 + Batch 2A–2C (~10.0%) |
| Curated Open Educational Resources | 0 | 36 | **36** | 30+ | **Milestone Target Met** |
| CEFR Matrix Specifications | 3 active | 6 full A1–C2 | **6 levels** | 6 levels | **Complete (A1–C2)** |
| Listening Lessons | 6 | 40 *(Batch 2A)* | **46** | 600 | Batch 2A Complete |
| Speaking Lessons | 7 | 40 *(Batch 2A, +6 guides)* | **47** | 600 | Batch 2A Complete |
| Pronunciation Academy Lessons | 0 | 48 *(Batches 2A + 2C)* | **48** | 150 | **Milestone 2 Target Met (48 new)** |
| Shadowing Studio Sessions | 0 | 60 *(Batches 2A + 2C)* | **60** | — | **Milestone 2 Target Met (60 new)** |
| Practical Conversation Scenarios | 0 | 60 *(Batch 2C)* | **60** | 300 | **Milestone 2 Target Met (60 new)** |
| Think in English Drills | 0 | 30 *(Batch 2C)* | **30** | — | **Milestone 2 Target Met (30 new)** |
| Integrated 4-Skill Units | 0 | 24 *(Batch 2C)* | **24** | — | **Complete (24 loops)** |
| Reading Passages | 6 | 120 *(Batch 2B)* | **126** | 600 | **Milestone 2 Target Met (120 new)** |
| Writing Activities | 7 | 90 *(Batch 2B)* | **97** | 400 | **Milestone 2 Target Met (90 new)** |
| IELTS Practice Activities | 7 | 0 | **7** | 500 | Baseline Only (Milestone 3+) |

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
