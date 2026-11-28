# English Quest — Milestone 4 Progress Log

> Active Branch: `feature/massive-knowledge-expansion` | Last Updated: 2026-11-28

## Batch Execution Status

| Batch | Scope | Verification Status |
|---|---|---|
| **Batch 4A** | M3 IELTS Defect Audit & Scoring Repair (`full_exam` 40L+40R vs `practice_mini`, removal of heuristic Writing bands & default `6.5` Speaking, `Unassessed` productive gating), Extended Lexical Schemas, Pipeline Normalization/Dedup/License Tools, Sharded EN+VI Search Index (`2,911` entries) & Global Search UI | **Complete Local Validation (`TC=0`, `LN=0`, `VAL=0`) — Pending CI Push** |
| **Batch 4B** | Core Lexicon Scaling (`1,468 -> 5,000+` unique headwords & polysemous senses, UK/US IPA, patterns, `80` collections, dictionary lookup UI & mastery modes) | Pending (starts after Batch 4A CI green) |
| **Batch 4C** | Multiword Expressions (`500+` phrasal verbs, `400+` idioms, `1,200+` collocations, communicative functions) | Pending |
| **Batch 4D** | Word-Building Morphology, Register Upgrades, `250+` Confused-Words Sets, Grammar `55 -> 160+` Topics | Pending |
| **Batch 4E** | Thematic Collections (`-> 200`), Specialized Domains, Graded Reading (`200+`), Listening (`200+`), Speaking (`200+`), Writing (`150+`) | Pending |
| **Batch 4F** | Final Scaling to `15,000+` Headwords & `20,000+` Exercises, Interactive Knowledge Graph, Cross-Content Linking & Final PR | Pending |

## Batch 4A Verified Metrics

- `npm run typecheck` (`shared`, `frontend`, `backend`): **0 errors**
- `npm run lint` (`frontend`): **0 errors, 0 warnings**
- `runValidation(true)` (`scripts/validate-content.ts`): **0 errors, 0 warnings**
- Combined Interactive Exercises: **4,542** (including **160** newly authored 40L/40R full-mock exam questions in `content/ielts/mock_full_ac.ts` & `mock_full_gt.ts`)
- IELTS Mock Manifests: **14** total (**2** `full_exam` w/ `40L+40R`, **12** `practice_mini` w/ `8L+15R`)
- Indexed Sharded Search Metadata: **2,911** entries (`1,498` vocab/collections, `55` grammar, `938` lessons/skills, `420` IELTS/resources)
