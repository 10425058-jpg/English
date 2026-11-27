import { buildVocabList } from './helpers';
import { A1_VOCAB_PART1 } from './a1_part1';
import { A1_VOCAB_PART2 } from './a1_part2';

export const A1_VOCABULARY = buildVocabList('A1', [...A1_VOCAB_PART1, ...A1_VOCAB_PART2]);
