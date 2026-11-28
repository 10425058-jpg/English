# English Quest — Content Import & Normalization Pipeline

> Scripts: `scripts/pipeline/normalizeAndDeduplicate.ts`, `scripts/pipeline/generateSearchIndex.ts`

## 1. Lexical Normalization & Deduplication (`normalizeAndDeduplicate.ts`)

All imported JSON packs and modular TS expansion files pass through deterministic normalization and quality checks before entering the codebase:

1. **Unicode Normalization:**
   `normalizeUnicodeNFC` collapses extraneous whitespace and converts all strings to canonical Unicode NFC so Vietnamese tone marks always compare consistently.
2. **Diacritic Folding & Stem Expansion:**
   - `stripVietnameseDiacritics` converts `đ`/`Đ` and strips combining diacritics (`khách sạn` -> `khach san`) for indexed bilingual search.
   - `expandInflectionStems` maps common English inflections (`studies -> study`, `analyzing -> analyze`, `stopped -> stop`) cleanly.
3. **Polysemy-Safe Deduplication Key (`makeLexicalDedupKey`):**
   Key format: `<word_lower>::<pos_lower>::<senseId_or_senseLabel_or_def_prefix>`.
   - Rejects duplicate copies of the exact same headword + part of speech + sense.
   - Preserves distinct polysemous senses (e.g., `charge` [fee] vs `charge` [electrical] vs `charge` [accusation]) when `senseId`, `senseLabel`, or distinct definitions clarify separate senses.
4. **Placeholder & License Enforcement (`validateLexicalRecord`):**
   - Rejects entries with missing `word`, `ipa`, `definition`, `vietnameseTranslation`, or `exampleSentence`.
   - Rejects known placeholder tokens (`todo`, `placeholder`, `lorem ipsum`, `coming soon`, `example definition`).
   - Enforces `ALLOWED_LICENSE_SET` (`English Quest Original`, `CC0`, `CC BY 4.0`, `CC BY-SA 4.0`, `Public Domain`, `MIT`) whenever `sourceLicense` is specified.
5. **Deterministic Importer (`importPackFromJson`):**
   Parses JSON arrays of structured lexical records and returns `{ accepted, rejected }` audits without silently dropping records unlogged.

## 2. Search Index Generator (`generateSearchIndex.ts`)

- Aggregates metadata-only `SearchIndexEntry` records from core seeds and lazy `content/` modules into four compact shard modules (`content/search/shard_vocab.ts`, `shard_grammar.ts`, `shard_skills.ts`, `shard_ielts.ts`) plus `content/search/manifest.ts`.
- Serializes shard arrays via compact `JSON.parse(...)` payloads to eliminate TypeScript `TS2590` literal-union complexity limits even at 15,000+ entries while preserving dynamic Vite code-splitting.
- `scripts/validate-content.ts` verifies manifest total parity and zero `(kind, id)` collisions during every validation run.
