# English Quest — Current Content Status

> Updated: 2026-11-28 | Synchronized with regenerated [CONTENT_QUALITY_REPORT.md](./CONTENT_QUALITY_REPORT.md) (`0` errors, `0` warnings; Milestone 4 Batch 4A Complete on `feature/massive-knowledge-expansion`)

This document records **exact observed repository counts** only—never counting planned later-batch items as finished work.

## Cumulative Content Inventory

| Content Category | Baseline (Phase 1) | Milestone 1 + 2 Added | Milestone 3 + 4A Added | Combined Total | Long-Term Blueprint Target | Completion Status |
|---|---:|---:|---:|---:|---:|---|
| Learning Path CEFR Units | 12 *(A1–B1 u1–4)* | 0 | 36 *(M3: A1–B1 u5–8 + B2–C2 u1–8)* | **48** *(8 per level)* | 48+ | **Complete (All A1–C2 Active)** |
| Learning Path Lessons | 48 | 0 | 216 *(M3: 6 per unit)* | **264** | 264+ | **Complete** |
| Structured Assessments & CEFR Exams | 0 | 0 | 45 *(M3: 36 unit + 6 level exams + 3 diag/review)* | **45** | 45+ | **Complete** |
| Vocabulary & Lexical Entries | 24 | 1,444 | 0 *(Batches 4B–4F pending)* | **1,468** | 15,000 | M1 Complete (Schema & Pipeline Ready) |
| Grammar Lessons & Guides | 7 | 48 | 0 *(Batch 4D pending)* | **55** | 200 | M1 Complete |
| Thematic Vocabulary Collections | 0 | 30 | 0 *(Batches 4B/4E pending)* | **30** | 200 | M1 Complete |
| Interactive Exercises & Quizzes | 200 | 744 *(M1)* + 1,830 *(M2)* | 1,608 *(M3)* + 160 *(M4A 40/40 Mocks)* | **4,542** | 20,000 | M1–M4A Verified (~22.7%) |
| Curated Open Educational Resources | 0 | 36 | 0 | **36** | 30+ | **Milestone Target Met** |
| CEFR Matrix Specifications | 3 active | 6 full A1–C2 | All 6 interactive tracks unlocked | **6 levels** | 6 levels | **Complete (A1–C2 Active)** |
| Listening Lessons | 6 | 120 | 0 | **126** | 600 | **M2 Target Met** |
| Speaking Lessons | 7 | 120 *(+6 guides)* | 0 | **127** | 600 | **M2 Target Met** |
| Pronunciation Academy Lessons | 0 | 48 | 0 | **48** | 150 | **M2 Target Met** |
| Shadowing Studio Sessions | 0 | 60 | 0 | **60** | — | **M2 Target Met** |
| Practical Conversation Scenarios | 0 | 60 | 0 | **60** | 300 | **M2 Target Met** |
| Think in English Drills | 0 | 30 | 0 | **30** | — | **M2 Target Met** |
| Integrated 4-Skill Units | 0 | 24 | 0 | **24** | — | **Complete (24 loops)** |
| Reading Passages | 6 | 120 | 0 | **126** | 600 | **M2 Target Met** |
| Writing Activities | 7 | 90 | 0 | **97** | 400 | **M2 Target Met** |
| IELTS Mastery Center & Mock Exams | 7 | 0 | 384 *(80 L, 100 S, 60 R, 60 W, 10 Idea, 60 Strategy, 2 Full 40/40 Mocks, 12 Mini-Mocks)* | **391** | 500 | **Batch 4A Repaired & Expanded** |
| Sharded Global Search Entries | 0 | 0 | 2,911 *(4 lazy domain shards)* | **2,911** | All entities | **Batch 4A Live (`Ctrl+K`)** |

## Bundle & Integration Architecture

- All `content/` datasets and `content/search/` index shards load **lazily** via dynamic `import()` in [content/index.ts](../content/index.ts) and [knowledgeSearch.ts](../frontend/src/services/knowledgeSearch.ts).
- Full 40Q Listening + 40Q Reading mocks isolate their large passage/script payloads inside [mock_full_ac.ts](../content/ielts/mock_full_ac.ts) and [mock_full_gt.ts](../content/ielts/mock_full_gt.ts).
