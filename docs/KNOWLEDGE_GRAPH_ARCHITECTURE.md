# English Quest — Knowledge Graph Architecture

> Planned Full Interactive Explorer: Batch 4F | Underlying Schema Active Since Batch 4A (`LexicalKnowledgeLink`)

## Core Entity Model

English Quest interconnects lexical entries, collocations, multiword expressions, grammar rules, learning lessons, reading passages, listening transcripts, and IELTS practice packs through typed directed relationships (`KnowledgeRelationType`):

| Relation Type | Meaning | Pedagogical Navigation |
|---|---|---|
| `synonym` / `antonym` | Nuanced near-synonyms or opposites | Jump directly between words with register comparison |
| `word_family` | Derivational / morphological cousins | Inspect noun/verb/adjective/adverb shifts + stress changes |
| `collocation` | Natural recurring multiword pairings | Link base word to high-frequency academic/everyday collocations |
| `phrasal_verb` / `idiom` | Non-compositional or particle-verb forms | Link base verb (`take`, `put`, `set`) to key phrasal/idiomatic extensions |
| `confused_with` | L1/L2 interference traps (`affect`/`effect`) | Surface side-by-side contrastive examples & error drills |
| `formal_equivalent` / `informal_equivalent` | Register upgrades for IELTS/workplace | Map informal verbs (`find out`, `put off`) to academic alternatives (`ascertain`, `postpone`) |

## Phased Rollout

- **Batch 4A:** Defined typed `LexicalKnowledgeLink` schema fields on `Vocabulary` plus domain types for `WordFamilyGroup`, `CollocationEntry`, `ConfusedWordsPair`, and `ExpressionFunctionGroup`.
- **Batches 4B–4E:** Author and link structured vocabulary senses, phrasal verbs, idioms, collocations, morphology groups, contrastive grammar comparisons, and multi-domain reading/listening content referencing consistent vocabulary/grammar IDs.
- **Batch 4F:** Materialize bidirectional knowledge-graph indexes and render an interactive Word Detail & Relation Explorer drawer across `VocabularyPage`, `ReadingAcademyPage`, and Global Search without eager-loading full corpora on boot.
