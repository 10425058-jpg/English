import { buildVocabList } from './helpers';
import { B2_VOCAB_PART1 } from './b2_part1';
import { B2_VOCAB_PART2 } from './b2_part2';
import { B2_VOCAB_PART3 } from './b2_part3';

export const B2_VOCABULARY = buildVocabList('B2', [...B2_VOCAB_PART1, ...B2_VOCAB_PART2, ...B2_VOCAB_PART3]);
