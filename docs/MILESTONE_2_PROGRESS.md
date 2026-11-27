# English Quest — Milestone 2: Four-Skill Intensive Training Progress

> Updated: 2026-11-27 | Branch: `feature/four-skill-intensive-training` | Verified against `npm run validate:content -- --write-report`

## Batch Delivery Status

| Batch | Focus | Cumulative Verified New Content | Status |
|---|---|---|---|
| **Batch 2A** | **Listening, Speaking, Pronunciation & Shadowing Foundations** | **40 Listening** (`160` ex), **40 Speaking** + **6 Guides**, **24 Pronunciation** (`72` ex), **20 Shadowing** | **Complete & Verified** |
| **Batch 2B** | Reading Library + Writing Workshop | Target: `120` Reading + `90` Writing + interactive exercises | Next |
| **Batch 2C** | Think in English + Conversations + Integrated Sequences + remaining Pronunciation/Shadowing | Target: `30` Thinking + `60` Conversations + `24+` Integrated + `48` Pronunciation + `60` Shadowing | Planned |
| **Batch 2D** | Final Scale to 120/120/120/90/48/60/60/30/1,800 + Final QA & PR to `main` | Full Milestone 2 completion | Planned |

## Exact Live Batch 2A Inventory

| Category | Core Baseline (Phase 1) | Milestone 2 Batch 2A Added | Combined Live Total | Milestone 2 Cumulative Target |
|---|---:|---:|---:|---:|
| Listening Lessons | 6 | 40 | **46** | 120 new (126 total) |
| Speaking Lessons | 7 | 40 *(+6 framework guides)* | **47** *(+6 guides)* | 120 new (127 total) |
| Pronunciation Academy Lessons | 0 | 24 | **24** | 48 |
| Shadowing Studio Sessions | 0 | 20 | **20** | 60 |
| Practical Conversation Scenarios | 0 | 0 | **0** | 60 |
| Think in English Exercises | 0 | 0 | **0** | 30 |
| Reading Passages | 6 | 0 | **6** | 120 new (126 total) |
| Writing Lessons | 7 | 0 | **7** | 90 new (97 total) |
| Milestone 2 Linked Interactive Exercises | 0 | 232 *(160 listening + 72 pronunciation)* | **1,176 overall** *(+8 core grammar quizzes)* | 1,800 new |

## CEFR Breakdown for Batch 2A New Lessons

| CEFR Level | Listening Added | Speaking Added | Pronunciation Clinics | Shadowing Sessions |
|---|---:|---:|---:|---:|
| **A1** | 5 | 5 | 3 | 3 |
| **A2** | 5 | 5 | 3 | 3 |
| **B1** | 8 | 8 | 8 | 4 |
| **B2** | 10 | 10 | 7 | 5 |
| **C1** | 7 | 7 | 3 | 3 |
| **C2** | 5 | 5 | 0 | 2 |
| **Total Batch 2A** | **40** | **40** | **24** | **20** |

## Honest Capabilities & Audio Architecture Note

- **Synthetic Speech Synthesis:** Multi-speaker playback (`speakDialogueLine`) varies browser Web Speech voices and subtle speaker pitch deltas across **0.5x–2.0x** speed; UI explicitly marks audio as synthetic browser Speech Synthesis rather than studio recordings.
- **Voice Recording & Rough Transcripts:** Microphone recordings stay local via `MediaRecorder` blob URLs in session memory; optional browser Speech-to-Text (`SpeechRecognition`) is clearly labeled as a rough recognition aid only.
