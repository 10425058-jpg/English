# English Quest — Editorial & Content Quality Standards

> Applied across all Milestone 1–4 content modules and enforced by `scripts/validate-content.ts`

1. **Authentic Bilingual Pedagogy:** Every lexical item includes canonical orthography, IPA, part of speech, clear English meaning, accurate natural Vietnamese translation, contextual bilingual example sentence, and zero machine-translated nonsense.
2. **Zero Count Inflation:**
   - Never count pluralized/conjugated stubs as independent vocabulary headwords.
   - Only separate polysemous entries when meanings genuinely diverge (`senseId` / `senseLabel` + distinct definition + distinct example).
   - Never count reused references (`reusedExerciseRefs`) inside newly authored exercise totals.
3. **Zero Placeholder Text:** Any placeholder phrase (`todo`, `lorem ipsum`, `coming soon`, `example definition`) fails validation immediately.
4. **Academic & Practical Diversity:** Thematic collections, readings, listening scripts, and IELTS tasks avoid repetitive sentence templates and adapt register realistically to everyday, workplace, academic, and technical domains.
5. **Honest Metadata Only:** Phonetics, register restrictions, collocations, usage notes, source licenses (`CC0`, `CC BY 4.0`, `CC BY-SA 4.0`, `Public Domain`, `MIT`, or `English Quest Original`), and frequency/CEFR tags must reflect verified linguistic facts or remain omitted rather than fabricated.
6. **Complete Evaluator Determinism:** Every objective exercise must contain unambiguous distractors and pass `evaluateExerciseAnswer(ex, ex.correctAnswer) === true`.
7. **Honest Assessment Claims:** Practice checkpoints report raw accuracy (`%`) and practice guidance only; IELTS 40-mark band conversions apply strictly to full 40Q simulations, and Writing/Speaking stay Unassessed until explicitly evaluated.
