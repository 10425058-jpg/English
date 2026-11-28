# English Quest — Extended Lexical & Knowledge Data Schema

> Source of truth: `packages/shared/src/types/domain.ts`

## 1. Extended `Vocabulary` Record

Every lexical entry uses strict TypeScript fields and optional Milestone 4 normalized metadata while maintaining 100% backward compatibility with Milestone 1–3 packs:

- **Core Headword & Sense Identity:**
  - `id`: unique deterministic string ID (`vocab-<level>-...`)
  - `word`: canonical display headword or multiword phrase (Unicode NFC normalized)
  - `lemma?`: base citation form when entry highlights a distinct inflection or sub-entry
  - `partOfSpeech`: `noun`, `verb`, `adjective`, `adverb`, `phrasal_verb`, `idiom`, `preposition`, etc.
  - `lexicalType?`: `'headword' | 'phrasal_verb' | 'idiom' | 'collocation_entry' | 'expression' | 'contrastive_pair'`
  - `senseId?`, `senseLabel?`, `senseCefr?`: disambiguates polysemous entries (`bank` river vs financial institution)
- **Phonetics & Morphology:**
  - `ipa`, `ipaUk?`, `ipaUs?`, `stressPattern?`
  - `inflectedForms?`, `wordFamily`, `wordFamilyGroupId?`
  - `grammaticalPatterns?`: verb/adjective/noun patterns (e.g. `advise sb to do sth`, `capable of doing sth`)
  - `separability?`, `transitivity?`: for phrasal verbs and verbs
- **Meaning, Register & Pragmatics:**
  - `definition`, `detailedDefinition?`, `vietnameseTranslation`
  - `exampleSentence`, `exampleTranslationVi?`, `examples?`
  - `register?`: `'formal' | 'neutral' | 'informal' | 'academic' | 'technical' | 'spoken' | 'literary'`
  - `usageRestrictions?`, `usageNote?`, `commonMistakes?`
- **Knowledge Graph & Provenance:**
  - `synonyms`, `antonyms`, `collocations`, `topics?`
  - `knowledgeLinks?`: `LexicalKnowledgeLink[]` (`synonym`, `antonym`, `word_family`, `collocation`, `phrasal_verb`, `idiom`, `confused_with`, `formal_equivalent`, `informal_equivalent`)
  - `wordFrequencyRank?`: verified corpus band order only when explicitly sourced
  - `sourceMetadata?`, `sourceLicense?`, `editorialStatus?`: `'imported' | 'authored' | 'reviewed'`

## 2. Companion Pedagogical Structures

- `WordFamilyGroup`: Root word + inflection/derivation members across parts of speech (`word`, `partOfSpeech`, `ipaUk`, `ipaUs`, `stressNote`, `grammaticalPattern`) + morphology rules + drills.
- `CollocationEntry`: Structured pattern (`verb_noun`, `adj_noun`, `noun_noun`, `adv_adj`, `verb_adv`, `adj_prep`, `verb_prep`, `noun_prep`) + domain + unnatural contrast notes (`"make a research"` vs `"conduct research"`).
- `ConfusedWordsPair`: Confusable sets (`affect`/`effect`, `borrow`/`lend`, `historic`/`historical`) with syntactic contrasts, Vietnamese learner L1 traps, and exercises.
- `GrammarComparisonItem`: Side-by-side nuance, timeline/rule, decision guide, and drills.
- `ExpressionFunctionGroup`: Pragmatic functions stratified across `basic`, `intermediate`, and `advanced` registers with mini-dialogues.
- `SearchIndexEntry`: Compact flat metadata index generated across domain shards for instant bilingual lookup.
