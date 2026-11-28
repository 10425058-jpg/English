export interface SearchShardManifest {
  version: number;
  totalEntries: number;
  shards: Array<{
    id: 'vocab_core' | 'grammar_core' | 'skills_core' | 'ielts_resources';
    label: string;
    count: number;
  }>;
}

export const SEARCH_SHARD_MANIFEST: SearchShardManifest = {
  "version": 1,
  "totalEntries": 2911,
  "shards": [
    {
      "id": "vocab_core",
      "label": "Vocabulary & Collections",
      "count": 1498
    },
    {
      "id": "grammar_core",
      "label": "Grammar Rules",
      "count": 55
    },
    {
      "id": "skills_core",
      "label": "Lessons & 4-Skill Academies",
      "count": 938
    },
    {
      "id": "ielts_resources",
      "label": "IELTS & Curated Resources",
      "count": 420
    }
  ]
};
