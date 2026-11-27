import { buildVocabList } from './helpers';
import { C2_VOCAB_PART1 } from './c2_part1';
import { C2_VOCAB_PART2 } from './c2_part2';

export const C2_VOCABULARY = buildVocabList('C2', [...C2_VOCAB_PART1, ...C2_VOCAB_PART2]);
