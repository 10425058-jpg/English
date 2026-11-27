# English Quest — Content Audit Report

> Audit Date: 2026-11-27 | Branch: `feature/curriculum-content-expansion` (branched from `main` @ `7e3b872`)

## 1. Executive Summary

The Phase 1 application shell, responsive design system, exercise engine (`15` types), Zustand state store, and CI/CD pipeline are fully operational. However, actual educational content is concentrated heavily at **A1–B1** with minimal standalone vocabulary/grammar depth and **zero** playable B2–C2 curriculum units, thematic vocabulary collections, or curated external learning resources.

## 2. Quantitative Inventory (Pre-Expansion Baseline)

| Content Category | Existing Total | A1 | A2 | B1 | B2 | C1 | C2 | Long-Term Target |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Core Curriculum Units | **12** | 4 | 4 | 4 | 0 | 0 | 0 | 48+ |
| Core Curriculum Lessons | **48** | 16 | 16 | 16 | 0 | 0 | 0 | 240+ |
| Core Path Exercises | **192** | 64 | 64 | 64 | 0 | 0 | 0 | 20,000 |
| Vocabulary Seed Entries (`vocabularySeed.ts`) | **24** | 8 | 8 | 8 | 0 | 0 | 0 | 15,000 |
| Grammar Topics (`grammarTopics.ts`) | **7** | 2 | 2 | 3 | 0 | 0 | 0 | 200 |
| Grammar Quiz Exercises | **8** | 3 | 2 | 3 | 0 | 0 | 0 | — |
| Thematic Vocabulary Collections | **0** | 0 | 0 | 0 | 0 | 0 | 0 | 200 |
| Listening Lab Tracks (`listeningLabData.ts`) | **6** | 2 | 1 | 3 | 0 | 0 | 0 | 600 |
| Listening Lab Exercises | **12** | 4 | 2 | 6 | 0 | 0 | 0 | — |
| Speaking Lab Activities (`speakingLabData.ts`) | **7** | 1 | 3 | 3 | 0 | 0 | 0 | 600 |
| Reading Passages (`readingLibraryData.ts`) | **6** | 1 | 2 | 3 | 0 | 0 | 0 | 600 |
| Reading Questions | **11** | 2 | 3 | 6 | 0 | 0 | 0 | — |
| Writing Lab Prompts (`writingPromptsData.ts`) | **7** | 1 | 2 | 4 | 0 | 0 | 0 | 400 |
| IELTS Specific Prompts (`ieltsData.ts`) | **7** | — | — | 7 | — | — | — | 500 |
| Placement Test Questions (`placementTest.ts`) | **10** | 3 | 3 | 3 | 1 | 0 | 0 | — |
| Curated Educational Resources | **0** | — | — | — | — | — | — | 50+ |

## 3. Structural & Pedagogical Gaps Identified

1. **Vocabulary Depth & Coverage Gap:**
   - Only 24 seeded words exist (none in B2, C1, or C2).
   - Missing optional fields for dialect differences (`ipaUk`, `ipaUs`), detailed definitions, bilingual example arrays, inflected forms, register tags, common learner errors, and usage notes.
   - No thematic collections covering Everyday, Academic, Professional, or IELTS/Global topics.
2. **Grammar Academy Depth Gap:**
   - Only 7 short grammar summaries exist (0 at B2–C2).
   - Current topics lack explicit learning objectives, deep theoretical explanations, formal/negative/question formulas across tenses, exceptions, 5+ contextual examples, side-by-side structural comparisons, and extended interactive drills.
3. **Exercise Bank & Types:**
   - Core exercises exist only inside the 48 linear lessons + lab screens (total 223 scored exercises across all labs/tests), with no dedicated standalone Vocabulary/Grammar Exercise Bank across A1–C2.
   - `ExerciseType` supports 15 types, but needs expansion support for `multiple_response`, `definition_matching`, `sentence_transformation`, `error_identification`, `collocation_selection`, `vocabulary_recall`, and `grammar_application`.
4. **Content Loading & Scalability:**
   - Current data files are imported synchronously. Expanding to 1,200+ vocabulary entries, 48 deep grammar lessons, 600+ exercises, and 30 thematic collections requires **modular CEFR-chunked lazy loading (`import(...)`)** to keep initial JS bundle weight fast.
5. **Automated Validation & Quality Auditing:**
   - No standalone content validation CLI script or automated report currently verifies duplicate senses, broken cross-references, missing explanations, invalid URLs, or curriculum coverage across A1–C2.

## 4. Milestone 1 Expansion Priorities (This Branch)

1. Extend `@english-quest/shared` schemas backward-compatibly for enriched Vocabulary, Grammar, Thematic Collections, Learning Resources, Curriculum Matrix, and expanded Exercise Types.
2. Create modular lazy-loaded `content/` data architecture (`vocabulary/`, `grammar/`, `collections/`, `exercises/`, `resources/`, `matrix/`).
3. Author **Milestone 1** validated batches:
   - **1,200** curated lexical entries across **A1–C2** (180 A1, 200 A2, 220 B1, 220 B2, 200 C1, 180 C2) with accurate IPA, definitions, Vietnamese meanings, contextual examples, collocations, word families, and usage notes.
   - **48** comprehensive Grammar Academy lessons (8 per CEFR level A1–C2) with all 17 pedagogical components.
   - **30** Thematic Vocabulary Collections spanning Everyday, Academic, Professional, and Advanced/IELTS domains.
   - **600** unique interactive Vocabulary & Grammar exercises (100 per level A1–C2).
   - **30** verified, open educational English learning resources (`docs/CONTENT_SOURCES.md`).
   - Complete **A1–C2 Curriculum Coverage Matrix** (`docs/CURRICULUM_MATRIX.md`).
4. Build `scripts/validate-content.ts` + Vitest integration checks + `docs/CONTENT_QUALITY_REPORT.md`.
5. Integrate all new content seamlessly into the existing UI (`VocabularyPage`, `GrammarPage`, `LearnPage`, `ReadingPage`) via lazy loading without altering visual identity or breaking user progress.
