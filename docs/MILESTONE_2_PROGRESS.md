# English Quest — Milestone 2: Four-Skill Intensive Training Progress

> Updated: 2026-11-28 | Branch: `feature/four-skill-intensive-training` | Typecheck + ESLint + validator logic checked (`RUN_VAL_EXIT=0` via `tsc`+Node); `vite`/`vitest`/`playwright` CI execution on `ubuntu-latest` pending due to local Windows Application Control blocking `rolldown-binding.win32-x64-msvc.node` (`CONTENT_QUALITY_REPORT.md` remains at the Batch 2C `--write-report` snapshot).

## Batch Delivery Status

| Batch | Focus | Cumulative New Content | Status |
|---|---|---|---|
| **Batch 2A** | **Listening, Speaking, Pronunciation & Shadowing Foundations** | **40 Listening** (`160` ex), **40 Speaking** + **6 Guides**, **24 Pronunciation** (`72` ex), **20 Shadowing** | **Complete & Verified** |
| **Batch 2B** | **Reading Academy (120) + Writing Academy (90)** | **120 Reading** (`480` ex) + **90 Writing** (`270` ex) integrated into `ReadingAcademyPage` & `WritingAcademyPage` | **Complete & Verified** |
| **Batch 2C** | **Pronunciation (48) + Shadowing (60) + Conversations (60) + Think in English (30) + Integrated Loops (24)** | **+24 Pronunciation** (`144` ex total), **+40 Shadowing** (`60` total), **60 Conversations**, **30 Think in English**, **24 Integrated Units** | **Complete & Verified** |
| **Batch 2D** | **Final Scale to `120` Listening, `120` Speaking, `1,830` M2 Exercises + QA/Test Updates** | **+80 Listening** (`120` total, `720` ex), **+80 Speaking** (`120` total), **+96 Pronunciation drills** (`240` ex total), **+120 Reading questions** (`600` ex total) | **Authored & Typechecked (CI Pending)** |

## Exact Cumulative Milestone 2 Inventory (Batch 2A–2D)

| Category | Core Baseline (Phase 1) | Milestone 2 Added (2A–2D) | Combined Total | Milestone 2 Cumulative Target |
|---|---:|---:|---:|---:|
| Listening Lessons | 6 | 120 | **126** | **120 new (Met)** |
| Speaking Lessons | 7 | 120 *(+6 framework guides)* | **127** *(+6 guides)* | **120 new (Met)** |
| Reading Passages | 6 | 120 | **126** *(+36 open resources)* | **120 new (Met)** |
| Writing Lessons | 7 | 90 | **97** | **90 new (Met)** |
| Pronunciation Academy Lessons | 0 | 48 | **48** | **48 new (Met)** |
| Shadowing Studio Sessions | 0 | 60 | **60** | **60 new (Met)** |
| Practical Conversation Scenarios | 0 | 60 | **60** | **60 new (Met)** |
| Think in English Exercises | 0 | 30 | **30** | **30 new (Met)** |
| Integrated 4-Skill Units | 0 | 24 | **24** | **24 Loops (Met)** |
| Linked Interactive Exercises | 200 *(192 path + 8 grammar)* | 744 *(M1)* + 1,830 *(M2: 720 L + 240 P + 600 R + 270 W)* | **2,774 total** | **1,800+ new (Met: 1,830)** |

## CEFR Breakdown for Milestone 2 Packs (Batches 2A–2D)

| CEFR Level | Listening | Speaking | Reading | Writing | Pronunciation | Shadowing | Conversations | Think in English |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **A1** | 15 | 15 | 15 | 10 | 5 | 7 | 7 | 4 |
| **A2** | 15 | 15 | 15 | 10 | 6 | 9 | 9 | 5 |
| **B1** | 20 | 20 | 20 | 15 | 15 | 13 | 12 | 6 |
| **B2** | 30 | 30 | 30 | 25 | 12 | 13 | 14 | 6 |
| **C1** | 25 | 25 | 25 | 20 | 7 | 11 | 11 | 5 |
| **C2** | 15 | 15 | 15 | 10 | 3 | 7 | 7 | 4 |
| **Subtotal** | **120** | **120** | **120** | **90** | **48** | **60** | **60** | **30** |

## Honest Capabilities & Audio Architecture Note

- **Synthetic Speech Synthesis:** Multi-speaker playback (`speakDialogueLine`) varies browser Web Speech voices and subtle speaker pitch deltas across **0.5x–2.0x** speed; UI explicitly marks audio as synthetic browser Speech Synthesis rather than studio recordings.
- **Voice Recording & Rough Transcripts:** Microphone recordings stay local via `MediaRecorder` blob URLs in session memory; optional browser Speech-to-Text (`SpeechRecognition`) is clearly labeled as a rough recognition aid only.
- **Reading WPM & Writing Analyzer:** Reading speed estimates reflect dwell windows across active reading sessions; Writing Academy checks run locally via deterministic heuristic word, structure, and mechanical checks alongside annotated model answers and self-edit checklists rather than certified human IELTS grading.
