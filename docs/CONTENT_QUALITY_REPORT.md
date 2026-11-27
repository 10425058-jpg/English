# Content Quality & Validation Report

Generated automatically by `npm run validate:content`.

## Verification Outcome

- **Errors:** 0
- **Warnings:** 0
- **Status:** PASSED

## Verified Live Content Counts

| Category | Core Seed / Phase 1 | Milestone 1 Expansion | Total Verified |
|---|---:|---:|---:|
| Vocabulary & Lexical Entries | 24 | 1444 | 1468 |
| Grammar Academy Lessons | 7 | 48 | 55 |
| Thematic Vocabulary Collections | 0 | 30 | 30 |
| Interactive Practice Bank Exercises | 0 | 600 | 600 |
| Grammar Academy Mini-Quizzes | 8 | 144 | 152 |
| Core Learning Path Exercises | 192 | 0 | 192 |
| **Combined Interactive Exercises** | **200** | **744** | **944** |
| Curated Open Educational Resources | 0 | 36 | 36 |
| CEFR Coverage Matrix Levels | 3 active + 3 upcoming | 6 full A1–C2 specifications | 6 |

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

## Automated Invariants Verified

1. **Zero duplicate IDs** across all vocabulary entries, grammar topics, collections, exercises, and external resources.
2. **Zero duplicate headwords** (normalized `word + senseLabel`) in expanded vocabulary packs.
3. **Zero duplicate prompts** inside any expanded level exercise bank.
4. **100% referential integrity**: every `vocabularyIds` reference inside all 30 thematic collections exists, and every `relatedKnowledgeId` inside all 600 practice exercises resolves to a real vocabulary item or grammar topic.
5. **100% evaluator round-trip check**: every expanded quiz and bank exercise (744 total) passes `evaluateExerciseAnswer(ex, ex.correctAnswer) === true`.
6. **100% valid external resource URLs**: all 36 resource URLs parse cleanly over HTTPS/HTTP with zero placeholder domains.
