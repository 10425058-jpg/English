import { buildVocabList } from './helpers';
import { A2_VOCAB_PART1 } from './a2_part1';
import { A2_VOCAB_PART2 } from './a2_part2';

export const A2_VOCABULARY = buildVocabList('A2', [...A2_VOCAB_PART1, ...A2_VOCAB_PART2]);
