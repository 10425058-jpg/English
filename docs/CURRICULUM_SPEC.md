# English Quest — Curriculum Data Specification

## 1. Hierarchy

`Course` -> `Section` (CEFR Level) -> `Unit` -> `Lesson` -> `Exercise`

## 2. Implemented Content Scope (Phase 1)

| CEFR Section | Status | Units | Lessons | Exercises | Focus |
|---|---|---|---|---|---|
| **A1 — Beginner** | Complete | 4 | 16 | 64 | Greetings, Daily Routines, Food & Café, Home & Directions |
| **A2 — Elementary** | Complete | 4 | 16 | 64 | Past Stories, Travel & Future, Health & Comparisons, Work & Emails |
| **B1 — Intermediate** | Complete | 4 | 16 | 64 | Present Perfect & Milestones, Conditionals & Tech, Passive & Relative Clauses, Workplace & Academic Register |
| **B2 / C1 / C2** | Planned (Phase 4) | Preview | — | — | Roadmap definitions in `curriculum/index.ts` |

## 3. Supported Exercise Types (15)

`multiple_choice`, `fill_blank`, `word_matching`, `sentence_reconstruction`, `translation`, `error_correction`, `audio_recognition`, `dictation`, `speaking`, `reading_comprehension`, `free_writing`, `dialogue_completion`, `vocabulary_recognition`, `grammar_challenge`, `scenario_conversation`.

Every exercise defines: `instruction`, `prompt`, `correctAnswer`, optional `acceptableAnswers`, `hint`, `explanation`, optional `explanationVi`, `difficulty (1-3)`, `skills`, and `xpReward`.

## 4. Independent Skill Labs & Assessments

- **Listening Lab:** 6 tracks across Conversation, Minimal Pairs, Short Story, Podcast, Academic Lecture, and IELTS Listening.
- **Speaking Lab:** 7 guided activities across Repetition, Shadowing, Picture Description (original SVG scenes), Roleplay, Topic Discussion, and Timed Challenges.
- **Reading Library:** 6 passages with clickable bilingual glossary + 7 reading comprehension question styles (`multiple_choice`, `true_false_not_given`, `matching_headings`, `sentence_completion`, `main_idea`, `inference`, `summary_completion`).
- **Writing Lab:** 7 writing tasks spanning Sentence Construction, Grammar Repair, Emails, Narratives, Argumentative Essays, and IELTS Task 1 & 2.
- **Vocabulary & SM-2:** 24 seeded core A1–B1 entries (plus custom saved words) scheduled via SM-2 (`easeFactor >= 1.3`, `intervalDays`, `repetitions`, `masteryLevel 0-5`).
- **IELTS Disclaimer:** All IELTS tasks and estimated band indicators are original unofficial practice materials.
