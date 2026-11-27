# English Quest — Milestone 2: Four-Skill Intensive Training Progress

> Updated: 2026-11-27 | Branch: `feature/four-skill-intensive-training` | Verified against `npm run validate:content -- --write-report`

## Batch Delivery Status

| Batch | Focus | Cumulative Verified New Content | Status |
|---|---|---|---|
| **Batch 2A** | **Listening, Speaking, Pronunciation & Shadowing Foundations** | **40 Listening** (`160` ex), **40 Speaking** + **6 Guides**, **24 Pronunciation** (`72` ex), **20 Shadowing** | **Complete & Verified** |
| **Batch 2B** | **Reading Academy (120) + Writing Academy (90)** | **120 Reading** (`480` ex) + **90 Writing** (`270` ex) integrated into `ReadingAcademyPage` & `WritingAcademyPage` | **Complete & Verified** |
| **Batch 2C** | **Pronunciation (48) + Shadowing (60) + Conversations (60) + Think in English (30) + Integrated Loops (24)** | **+24 Pronunciation** (`144` ex total), **+40 Shadowing** (`60` total), **60 Conversations**, **30 Think in English**, **24 Integrated Units** | **Complete & Verified** |
| **Batch 2D** | Final Scale to `120` Listening, `120` Speaking, `>= 1,800` M2 Exercises + Final QA & PR to `main` | Full Milestone 2 completion | Next |

## Exact Live Cumulative Milestone 2 Inventory (Post Batch 2C)

| Category | Core Baseline (Phase 1) | Milestone 2 Added (2A–2C) | Combined Live Total | Milestone 2 Cumulative Target |
|---|---:|---:|---:|---:|
| Listening Lessons | 6 | 40 | **46** | 120 new (126 total) |
| Speaking Lessons | 7 | 40 *(+6 framework guides)* | **47** *(+6 guides)* | 120 new (127 total) |
| Reading Passages | 6 | 120 | **126** *(+36 open resources)* | **120 new (Met)** |
| Writing Lessons | 7 | 90 | **97** | **90 new (Met)** |
| Pronunciation Academy Lessons | 0 | 48 | **48** | **48 new (Met)** |
| Shadowing Studio Sessions | 0 | 60 | **60** | **60 new (Met)** |
| Practical Conversation Scenarios | 0 | 60 | **60** | **60 new (Met)** |
| Think in English Exercises | 0 | 30 | **30** | **30 new (Met)** |
| Integrated 4-Skill Units | 0 | 24 | **24** | **Integrated Loops** |
| Linked Interactive Exercises | 200 *(192 path + 8 grammar)* | 744 *(M1)* + 1,054 *(M2: 160 L + 144 P + 480 R + 270 W)* | **1,998 total** | 1,800 new (M2) |

## CEFR Breakdown for Milestone 2 Packs (Through Batch 2C)

| CEFR Level | Listening | Speaking | Reading | Writing | Pronunciation | Shadowing | Conversations | Think in English |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **A1** | 5 | 5 | 15 | 10 | 5 | 7 | 7 | 4 |
| **A2** | 5 | 5 | 15 | 10 | 6 | 9 | 9 | 5 |
| **B1** | 8 | 8 | 20 | 15 | 15 | 13 | 12 | 6 |
| **B2** | 10 | 10 | 30 | 25 | 12 | 13 | 14 | 6 |
| **C1** | 7 | 7 | 25 | 20 | 7 | 11 | 11 | 5 |
| **C2** | 5 | 5 | 15 | 10 | 3 | 7 | 7 | 4 |
| **Subtotal** | **40** | **40** | **120** | **90** | **48** | **60** | **60** | **30** |

## Honest Capabilities & Audio Architecture Note

- **Synthetic Speech Synthesis:** Multi-speaker playback (`speakDialogueLine`) varies browser Web Speech voices and subtle speaker pitch deltas across **0.5x–2.0x** speed; UI explicitly marks audio as synthetic browser Speech Synthesis rather than studio recordings.
- **Voice Recording & Rough Transcripts:** Microphone recordings stay local via `MediaRecorder` blob URLs in session memory; optional browser Speech-to-Text (`SpeechRecognition`) is clearly labeled as a rough recognition aid only.
- **Reading WPM & Writing Analyzer:** Reading speed estimates reflect dwell windows across active reading sessions; Writing Academy checks run locally via deterministic heuristic word, structure, and mechanical checks alongside annotated model answers and self-edit checklists rather than certified human IELTS grading.
