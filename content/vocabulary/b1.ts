import { buildVocabList } from './helpers';
import { B1_VOCAB_PART1 } from './b1_part1';
import { B1_VOCAB_PART2 } from './b1_part2';

export const B1_VOCABULARY = buildVocabList('B1', [...B1_VOCAB_PART1, ...B1_VOCAB_PART2]);
