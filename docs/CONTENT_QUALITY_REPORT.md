# Content Quality & Validation Report

Generated automatically by `npm run validate:content`.

## Verification Outcome

- **Errors:** 0
- **Warnings:** 0
- **Status:** PASSED

## Verified Live Content Counts

| Category | Core Seed / Phase 1 | Curriculum Expansion (M1 + M2 + M3) | Total Verified |
|---|---:|---:|---:|
| Vocabulary & Lexical Entries | 24 | 1444 | 1468 |
| Grammar Academy Lessons | 7 | 48 | 55 |
| Thematic Vocabulary Collections | 0 | 30 | 30 |
| Interactive Practice Bank Exercises | 0 | 600 | 600 |
| Grammar Academy Mini-Quizzes | 8 | 144 | 152 |
| Milestone 2 Academy Interactive Exercises | 0 | 1830 | 1830 |
| Milestone 3 Curriculum & Assessment Exercises (Newly Authored) | 0 | 888 | 888 |
| Core Learning Path Exercises | 192 | 0 | 192 |
| **Combined Interactive Exercises** | **200** | **3462** | **3662** |
| Learning Path CEFR Units | 12 | 36 | 48 |
| Learning Path Lessons | 48 | 216 | 264 |
| Structured Assessments & CEFR Exams | 0 | 45 | 45 |
| Listening Academy Lessons | 6 | 120 | 126 |
| Speaking Academy Lessons | 7 | 120 | 127 |
| Reading Academy Passages | 6 | 120 | 126 |
| Writing Academy Lessons | 7 | 90 | 97 |
| Pronunciation Academy Lessons | 0 | 48 | 48 |
| Shadowing Studio Sessions | 0 | 60 | 60 |
| Practical Conversation Scenarios | 0 | 60 | 60 |
| Think in English Drills | 0 | 30 | 30 |
| Integrated 4-Skill Units | 0 | 24 | 24 |
| Speaking Mindset Guides | 0 | 6 | 6 |
| Curated Open Educational Resources | 0 | 36 | 36 |
| CEFR Coverage Matrix Levels | 6 active A1–C2 tracks | 6 full A1–C2 specifications | 6 |

## Breakdown by CEFR Level (Milestone 1 Expansion Packs)

| CEFR Level | Vocabulary Entries | Grammar Academy Lessons | Interactive Exercise Bank |
|---|---:|---:|---:|
| A1 | 209 | 8 | 100 |
| A2 | 325 | 8 | 100 |
| B1 | 240 | 8 | 100 |
| B2 | 233 | 8 | 100 |
| C1 | 208 | 8 | 100 |
| C2 | 229 | 8 | 100 |
| **Total** | **1444** | **48** | **600** |

## Breakdown by CEFR Level (Milestone 2 Academies)

| CEFR Level | Listening | Speaking | Reading | Writing |
|---|---:|---:|---:|---:|
| A1 | 15 | 15 | 15 | 10 |
| A2 | 15 | 15 | 15 | 10 |
| B1 | 20 | 20 | 20 | 15 |
| B2 | 30 | 30 | 30 | 25 |
| C1 | 25 | 25 | 25 | 20 |
| C2 | 15 | 15 | 15 | 10 |
| **Total** | **120** | **120** | **120** | **90** |

## Interactive Format Distribution (600-Item Bank)

| Exercise Format | Count |
|---|---:|
| `multiple_choice` | 205 |
| `fill_blank` | 113 |
| `error_correction` | 53 |
| `collocation_selection` | 49 |
| `definition_matching` | 33 |
| `multiple_response` | 31 |
| `translation` | 30 |
| `vocabulary_recall` | 28 |
| `sentence_transformation` | 24 |
| `sentence_ordering` | 18 |
| `error_identification` | 8 |
| `grammar_application` | 7 |
| `pronunciation_discrimination` | 1 |

## Breakdown by CEFR Level (Milestone 3 Learning Path Expansion)

| CEFR Level | New Units Added | New Lessons Added | New Exercises (Lessons + Assessments) |
|---|---:|---:|---:|
| A1 | 4 | 24 | 100 |
| A2 | 4 | 24 | 100 |
| B1 | 4 | 24 | 104 |
| B2 | 8 | 48 | 196 |
| C1 | 8 | 48 | 192 |
| C2 | 8 | 48 | 196 |
| **Total New M3** | **36** | **216** | **888** |

Note: Milestone 3 units additionally link **51 reused drill references** from the Exercise Bank (`reusedExerciseRefs`), tracked separately and never double-counted inside newly authored totals.

## Automated Invariants Verified

1. **Zero duplicate IDs** across all vocabulary entries, grammar topics, collections, exercises, Milestone 2 academies, Milestone 3 units/lessons/assessments, and external resources.
2. **Zero duplicate headwords** (normalized `word + senseLabel`) in expanded vocabulary packs.
3. **Zero duplicate prompts** inside any expanded level exercise bank, within any Listening/Reading/Pronunciation/Writing lesson, or within any Milestone 3 learning-path lesson or assessment.
4. **100% referential integrity**: every `vocabularyIds` reference inside all 30 thematic collections exists, every `relatedKnowledgeId` inside all 600 practice exercises resolves, every `IntegratedSequence` links valid assets, and every Milestone 3 `prerequisiteUnitIds`, `masteryAssessmentId`, `targetVocabIds`, `targetGrammarIds`, `reusedExerciseRefs`, and `linked*Ids` reference resolves.
5. **100% evaluator round-trip check**: every expanded quiz, bank, Milestone 2 academy, and Milestone 3 exercise (3462 total) passes `evaluateExerciseAnswer(ex, ex.correctAnswer) === true`.
6. **100% valid external resource URLs**: all 36 resource URLs parse cleanly over HTTPS/HTTP with zero placeholder domains.
