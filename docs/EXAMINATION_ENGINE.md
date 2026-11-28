# English Quest — Examination Engine Specification

> Status: Implemented & Audited in Milestone 4 Batch 4A | Related Code: `packages/shared/src/utils/ieltsScoring.ts`, `frontend/src/features/ielts/MockExamPlayerPage.tsx`, `content/ielts/mock_exams.ts`

## 1. Strict Exam Classification (`examFormat`)

Every entry in `IELTS_MOCK_EXAMS` declares an explicit `examFormat`, `listeningQuestionTotal`, and `readingQuestionTotal`:

| Format Key | Objective Question Structure | Band Scaling Eligibility | UI Presentation |
|---|---|---|---|
| `full_exam` | **40** Listening (4 parts x 10 Qs) + **40** Reading (3 passages x 13–14 Qs) | Eligible for official Academic / GT 40-mark lookup (`convertListeningRawToBand`, `convertReadingRawToBand`) | Highlighted under **Full-Length Examinations (40L + 40R)** |
| `practice_mini` | **8** Listening (4 parts x 2 Qs) + **15** Reading (3 passages x 5 Qs) | **Not eligible** — Band conversion functions return `null`; reports raw hit count and percentage only | Grouped under **Short Practice Mini-Mocks (No Band Extrapolation)** |

## 2. Objective Conversion Rules (`ieltsScoring.ts`)

- `convertListeningRawToBand(rawScore, maxScore)` returns `null` whenever `maxScore !== 40`.
- `convertReadingRawToBand(rawScore, pathway, maxScore)` returns `null` whenever `maxScore !== 40`. Academic and General Training maintain separate 40-mark threshold curves (`gt: 34/40 ≈ 7.0`, `ac: 30/40 ≈ 7.0`).
- `isComplete40QuestionMock(listeningMax, readingMax)` returns `true` if and only if `listeningMax === 40 && readingMax === 40`.

## 3. Productive Skill Assessment States (`ProductiveAssessmentStatus`)

Writing and Speaking inside both `IeltsListeningSpeakingTabs.tsx` and `MockExamPlayerPage.tsx` default strictly to **`unassessed`** with **`null`** band scores:

- `unassessed`: Default state. Writing still receives non-scoring mechanical feedback (`word counts`, `paragraph counts`, `connector counts`, and deterministic improvement prompts via `analyzeWritingLocally`), while `writingBand` and `speakingBand` stay `null`.
- `self_assessed`: User explicitly selects a half-band score (`4.0`–`9.0`) using the displayed 4-criterion IELTS rubric checklist. Tagged `(Self-Assessed • Unofficial)`.
- `teacher_assessed`: A human instructor or examiner enters verified Writing/Speaking scores plus optional `teacherNotes` either before submission or post-exam via `updateMockProductiveAssessment` on the results screen.

## 4. Overall Band Calculation & Crash Recovery

- `computeOverallBandIfEligible` returns `null` unless **`examFormat === 'full_exam'` AND all four component scores (`listening`, `reading`, `writing`, `speaking`) are non-null**.
- When eligible, `roundIeltsOverallBand` applies standard IELTS rounding (`Math.round(avg * 2) / 2`, where `.25 -> .5` and `.75 -> next whole band`).
- All in-progress mock exam answers, timers, drafts, and productive assessment states autosave to `localStorage` (`inProgressMockExam`) and survive reloads cleanly.
- Persisted Zustand state version 2 includes a non-destructive `migrate` hook that clears pre-Milestone 4 heuristic Writing/overall estimates and scaled `<40` mini-mock bands while preserving raw scores, word counts, and completion history (`legacyHeuristicMigrated: true`).
