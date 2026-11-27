import { buildVocabList } from './helpers';
import { C1_VOCAB_PART1 } from './c1_part1';
import { C1_VOCAB_PART2 } from './c1_part2';

export const C1_VOCABULARY = buildVocabList('C1', [...C1_VOCAB_PART1, ...C1_VOCAB_PART2]);
