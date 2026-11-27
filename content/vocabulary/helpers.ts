import type { CEFRLevel, Vocabulary } from '@english-quest/shared';

export interface CompactVocabInput {
  id: string;
  w: string;
  pos: string;
  ipa: string;
  ipaUk?: string;
  ipaUs?: string;
  def: string;
  detail?: string;
  vi: string;
  ex: string;
  exVi: string;
  syn?: string[];
  ant?: string[];
  col?: string[];
  fam?: string[];
  inf?: string[];
  reg?: Vocabulary['register'];
  err?: string[];
  note?: string;
  topics: string[];
  sense?: string;
  cat?: string;
}

export function buildVocabList(level: CEFRLevel, items: CompactVocabInput[]): Vocabulary[] {
  return items.map((item) => ({
    id: item.id,
    word: item.w,
    partOfSpeech: item.pos,
    ipa: item.ipa,
    ...(item.ipaUk ? { ipaUk: item.ipaUk } : {}),
    ...(item.ipaUs ? { ipaUs: item.ipaUs } : {}),
    definition: item.def,
    ...(item.detail ? { detailedDefinition: item.detail } : {}),
    vietnameseTranslation: item.vi,
    exampleSentence: item.ex,
    exampleTranslationVi: item.exVi,
    examples: [{ english: item.ex, vietnamese: item.exVi }],
    synonyms: item.syn ?? [],
    antonyms: item.ant ?? [],
    collocations: item.col ?? [],
    wordFamily: item.fam ?? [],
    ...(item.inf ? { inflectedForms: item.inf } : {}),
    register: item.reg ?? 'neutral',
    ...(item.err ? { commonMistakes: item.err } : {}),
    ...(item.note ? { usageNote: item.note } : {}),
    topics: item.topics,
    ...(item.sense ? { senseLabel: item.sense } : {}),
    sourceMetadata: 'Original curated English Quest lexical entry',
    cefrLevel: level,
    category: item.cat ?? item.topics[0] ?? 'General',
  }));
}
