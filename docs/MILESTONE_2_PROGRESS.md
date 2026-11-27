# English Quest — Milestone 2: Four-Skill Intensive Training Progress

> Updated: 2026-11-27 | Branch: `feature/four-skill-intensive-training` | Verified against `npm run validate:content -- --write-report`

## Batch Delivery Status

| Batch | Focus | Cumulative Verified New Content | Status |
|---|---|---|---|
| **Batch 2A** | **Listening, Speaking, Pronunciation & Shadowing Foundations** | **40 Listening** (`160` ex), **40 Speaking** + **6 Guides**, **24 Pronunciation** (`72` ex), **20 Shadowing** | **Complete & Verified** |
| **Batch 2B** | **Reading Academy (120) + Writing Academy (90)** | **120 Reading** (`480` ex) + **90 Writing** (`270` ex) integrated into `ReadingAcademyPage` & `WritingAcademyPage` | **Complete & Verified** |
| **Batch 2C** | Think in English + Conversations + Integrated Sequences + remaining Pronunciation/Shadowing | Target: `30` Thinking + `60` Conversations + `24+` Integrated + `48` Pronunciation + `60` Shadowing | Next |
| **Batch 2D** | Final Scale to 120/120/120/90/48/60/60/30/1,800 + Final QA & PR to `main` | Full Milestone 2 completion | Planned |

## Exact Live Cumulative Milestone 2 Inventory (Post Batch 2B)

| Category | Core Baseline (Phase 1) | Milestone 2 Added (2A + 2B) | Combined Live Total | Milestone 2 Cumulative Target |
|---|---:|---:|---:|---:|
| Listening Lessons | 6 | 40 | **46** | 120 new (126 total) |
| Speaking Lessons | 7 | 40 *(+6 framework guides)* | **47** *(+6 guides)* | 120 new (127 total) |
| Reading Passages | 6 | 120 | **126** *(+36 open resources)* | **120 new (Met)** |
| Writing Lessons | 7 | 90 | **97** | **90 new (Met)** |
| Pronunciation Academy Lessons | 0 | 24 | **24** | 48 |
| Shadowing Studio Sessions | 0 | 20 | **20** | 60 |
| Practical Conversation Scenarios | 0 | 0 | **0** | 60 |
| Think in English Exercises | 0 | 0 | **0** | 30 |
| Linked Interactive Exercises | 200 *(192 path + 8 grammar)* | 744 *(M1)* + 982 *(M2: 160 L + 72 P + 480 R + 270 W)* | **1,926 total** | 1,800 new (M2) |

## CEFR Breakdown for Milestone 2 Packs (Through Batch 2B)

| CEFR Level | Listening | Speaking | Reading | Writing | Pronunciation | Shadowing |
|---|---:|---:|---:|---:|---:|---:|
| **A1** | 5 | 5 | 15 | 10 | 3 | 3 |
| **A2** | 5 | 5 | 15 | 10 | 3 | 3 |
| **B1** | 8 | 8 | 20 | 15 | 8 | 4 |
| **B2** | 10 | 10 | 30 | 25 | 7 | 5 |
| **C1** | 7 | 7 | 25 | 20 | 3 | 3 |
| **C2** | 5 | 5 | 15 | 10 | 0 | 2 |
| **Subtotal** | **40** | **40** | **120** | **90** | **24** | **20** |

## Honest Capabilities & Audio Architecture Note

- **Synthetic Speech Synthesis:** Multi-speaker playback (`speakDialogueLine`) varies browser Web Speech voices and subtle speaker pitch deltas across **0.5x–2.0x** speed; UI explicitly marks audio as synthetic browser Speech Synthesis rather than studio recordings.
- **Voice Recording & Rough Transcripts:** Microphone recordings stay local via `MediaRecorder` blob URLs in session memory; optional browser Speech-to-Text (`SpeechRecognition`) is clearly labeled as a rough recognition aid only.
- **Reading WPM & Writing Analyzer:** Reading speed estimates reflect dwell windows across active reading sessions; Writing Academy checks run locally via deterministic heuristic word, structure, and mechanical checks alongside annotated model answers and self-edit checklists rather than certified human IELTS grading.
