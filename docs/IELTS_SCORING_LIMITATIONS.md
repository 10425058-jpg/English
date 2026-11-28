# English Quest — IELTS Scoring Limitations & Integrity Policy

> Updated for Milestone 4 Batch 4A

English Quest is an independent study and self-assessment platform. **English Quest scores are strictly unofficial practice indicators** and must never be represented as official IELTS Academic or General Training results certified by Cambridge Assessment English, IDP Education, or the British Council.

## Specific Scoring Boundaries Enforced in Code

1. **No Short-Set Band Extrapolation:**
   Short practice checkpoints (`8` Listening + `15` Reading questions, or quick `3`–`4` question diagnostics) NEVER multiply or extrapolate raw scores up to a `40`-question IELTS Band. Only `full_exam` simulations containing **40 Listening + 40 Reading** objective items invoke 40-mark band tables.
2. **No Automated Essay or Speech Band Grading:**
   Because authentic IELTS Writing and Speaking band assignment requires evaluating argument coherence, task relevance, register appropriateness, lexical precision, and connected phonological delivery, **offline code NEVER invents numeric Writing or Speaking band scores from word-count or keyword heuristics**.
3. **Mechanical Writing Feedback Is Strictly Non-Scoring:**
   Deterministic checks (`writingAnalyzer.ts`, `buildWritingMechanicalFeedback`) report objective structural metrics—word counts against `150`/`250`-word minimums, paragraph segmentation counts, transition marker frequency, and common phrase upgrades—without emitting any numeric IELTS Band.
4. **Speaking Assessment Defaults to `Unassessed` (`null`):**
   Audio capture (`MediaRecorder` local playback) and speaking timers assist practice delivery, while band fields stay `null` (`Unassessed`) unless a learner performs an explicit self-rubric check or a teacher enters an evaluation.
5. **Overall Band Requires All 4 Assessed Components on a 40/40 Exam:**
   If Writing is `unassessed`, Speaking is `unassessed`, or the mock format is `practice_mini`, `overallBand` stays `null` (`N/A` / `Incomplete` in UI).
