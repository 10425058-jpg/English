import fs from 'node:fs';
import path from 'node:path';
import type { CEFRLevel, SearchIndexEntry } from '@english-quest/shared';
import {
  loadAllConversations,
  loadAllCurriculumUnits,
  loadAllGrammar,
  loadAllListening,
  loadAllReading,
  loadAllSpeaking,
  loadAllVocabulary,
  loadAllWriting,
  loadIeltsIdeaBanks,
  loadIeltsListening,
  loadIeltsMockManifests,
  loadIeltsReading,
  loadIeltsSpeaking,
  loadIeltsStrategies,
  loadIeltsWriting,
  loadLearningResources,
  loadPronunciationLessons,
  loadShadowingSessions,
  loadThematicCollections,
  loadThinkInEnglish,
} from '../../content/index';
import { SEED_VOCABULARY } from '../../frontend/src/data/vocabularySeed';
import { GRAMMAR_TOPICS } from '../../frontend/src/data/grammarTopics';
import { ALL_UNITS } from '../../frontend/src/data/curriculum/index';
import { LISTENING_LAB_TRACKS } from '../../frontend/src/data/listeningLabData';
import { READING_LIBRARY_PASSAGES } from '../../frontend/src/data/readingLibraryData';
import { SPEAKING_LAB_ACTIVITIES } from '../../frontend/src/data/speakingLabData';
import { WRITING_LAB_PROMPTS } from '../../frontend/src/data/writingPromptsData';
import { expandInflectionStems, normalizeSearchTerm } from './normalizeAndDeduplicate';

export type SearchShardId = 'vocab_core' | 'grammar_core' | 'skills_core' | 'ielts_resources';

export interface GeneratedSearchShards {
  vocab_core: SearchIndexEntry[];
  grammar_core: SearchIndexEntry[];
  skills_core: SearchIndexEntry[];
  ielts_resources: SearchIndexEntry[];
}

function buildKeywords(parts: Array<string | undefined>): string[] {
  const set = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    const norm = normalizeSearchTerm(part);
    if (!norm) continue;
    set.add(norm);
    for (const token of norm.split(' ')) {
      if (token.length >= 3) {
        for (const stem of expandInflectionStems(token)) {
          set.add(stem);
        }
      }
    }
  }
  return Array.from(set).slice(0, 12);
}

export async function buildSearchShardData(): Promise<GeneratedSearchShards> {
  const [
    expandedVocab,
    expandedGrammar,
    collections,
    unitsExpanded,
    listeningExpanded,
    speakingExpanded,
    readingExpanded,
    writingExpanded,
    pronunciationLessons,
    shadowingSessions,
    conversationScenarios,
    thinkInEnglish,
    ieltsListening,
    ieltsSpeaking,
    ieltsReading,
    ieltsWriting,
    ieltsStrategies,
    ieltsMocks,
    ieltsIdeas,
    resources,
  ] = await Promise.all([
    loadAllVocabulary(),
    loadAllGrammar(),
    loadThematicCollections(),
    loadAllCurriculumUnits(),
    loadAllListening(),
    loadAllSpeaking(),
    loadAllReading(),
    loadAllWriting(),
    loadPronunciationLessons(),
    loadShadowingSessions(),
    loadAllConversations(),
    loadThinkInEnglish(),
    loadIeltsListening(),
    loadIeltsSpeaking(),
    loadIeltsReading(),
    loadIeltsWriting(),
    loadIeltsStrategies(),
    loadIeltsMockManifests(),
    loadIeltsIdeaBanks(),
    loadLearningResources(),
  ]);

  const allVocab = [...SEED_VOCABULARY, ...expandedVocab];
  const vocabEntries: SearchIndexEntry[] = [
    ...allVocab.map((v): SearchIndexEntry => ({
      id: v.id,
      shardId: 'vocab_core',
      kind: 'vocabulary',
      cefrLevel: v.cefrLevel,
      title: v.word,
      lemma: v.lemma,
      subtitle: `${v.partOfSpeech} • ${v.ipa} — ${v.definition}`,
      vietnamese: v.vietnameseTranslation,
      category: v.category,
      register: v.register,
      inflectedForms: v.inflectedForms,
      keywords: buildKeywords([
        v.word,
        v.lemma,
        v.category,
        ...(v.collocations ?? []),
        ...(v.synonyms ?? []),
        ...(v.inflectedForms ?? []),
      ]),
      tags: [v.category, ...(v.register ? [v.register] : [])],
      route: `/vocabulary?q=${encodeURIComponent(v.word)}`,
      rankWeight: v.wordFrequencyRank ? Math.max(10, 100 - Math.floor(v.wordFrequencyRank / 50)) : 80,
    })),
    ...collections.map((c): SearchIndexEntry => ({
      id: c.id,
      shardId: 'vocab_core',
      kind: 'collection',
      cefrLevel: c.cefrLevels[0],
      title: c.title,
      subtitle: `${c.cefrLevels.join('–')} Thematic Collection • ${c.vocabularyIds.length} terms`,
      vietnamese: c.description,
      category: c.domain,
      keywords: buildKeywords([
        c.title,
        c.description,
        c.domain,
        ...c.commonExpressions.slice(0, 4).map((e) => e.expression),
      ]),
      tags: [c.domain, ...c.cefrLevels],
      route: `/vocabulary?tab=collections&q=${encodeURIComponent(c.title)}`,
      rankWeight: 72,
    })),
  ];

  const allGrammar = [...GRAMMAR_TOPICS, ...expandedGrammar];
  const grammarEntries: SearchIndexEntry[] = allGrammar.map((g): SearchIndexEntry => ({
    id: g.id,
    shardId: 'grammar_core',
    kind: 'grammar',
    cefrLevel: g.cefrLevel,
    title: g.title,
    subtitle: `${g.cefrLevel} • ${g.structures[0]?.formula ?? g.summary}`,
    vietnamese: g.summaryVi,
    category: 'grammar',
    keywords: buildKeywords([g.title, g.summaryVi, g.summary, g.structures[0]?.formula]),
    tags: [g.cefrLevel, 'grammar'],
    route: `/grammar?q=${encodeURIComponent(g.title)}`,
    rankWeight: 82,
  }));

  const allUnits = [...ALL_UNITS, ...unitsExpanded];
  const allListening = [...LISTENING_LAB_TRACKS, ...listeningExpanded];
  const allSpeaking = [...SPEAKING_LAB_ACTIVITIES, ...speakingExpanded];
  const allReading = [...READING_LIBRARY_PASSAGES, ...readingExpanded];
  const allWriting = [...WRITING_LAB_PROMPTS, ...writingExpanded];

  const skillsEntries: SearchIndexEntry[] = [
    ...allUnits.flatMap((u) =>
      u.lessons.map((l): SearchIndexEntry => ({
        id: l.id,
        shardId: 'skills_core',
        kind: 'lesson',
        cefrLevel: u.cefrLevel,
        title: l.title,
        subtitle: `${u.cefrLevel} ${u.title} • ${l.subtitle}`,
        vietnamese: l.instructionalOverviewVi ?? u.description,
        category: u.cefrLevel,
        keywords: buildKeywords([l.title, u.title, l.subtitle, ...(l.topicTags ?? [])]),
        tags: [u.cefrLevel, 'lesson'],
        route: `/lesson/${l.id}`,
        rankWeight: 76,
      }))
    ),
    ...allListening.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'skills_core',
      kind: 'listening',
      cefrLevel: x.cefrLevel,
      title: x.title,
      subtitle: `${x.cefrLevel} Listening • ${x.category.replace(/_/g, ' ')}`,
      vietnamese: x.subtitle ?? x.summaryText,
      category: x.category,
      keywords: buildKeywords([x.title, x.category, x.subtitle, x.summaryText]),
      tags: [x.cefrLevel, 'listening'],
      route: '/listening',
      rankWeight: 70,
    })),
    ...allSpeaking.map((x): SearchIndexEntry => {
      const viNote = 'promptVi' in x ? x.promptVi : undefined;
      const cat = 'category' in x ? x.category : x.activityType;
      return {
        id: x.id,
        shardId: 'skills_core',
        kind: 'speaking',
        cefrLevel: x.cefrLevel,
        title: x.title,
        subtitle: `${x.cefrLevel} Speaking • ${x.prompt.slice(0, 75)}`,
        vietnamese: viNote,
        category: cat,
        keywords: buildKeywords([x.title, x.prompt, ...(x.keyVocabulary ?? [])]),
        tags: [x.cefrLevel, 'speaking'],
        route: '/speaking',
        rankWeight: 68,
      };
    }),
    ...allReading.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'skills_core',
      kind: 'reading',
      cefrLevel: x.cefrLevel,
      title: x.title,
      subtitle: `${x.cefrLevel} Reading • ${x.category}`,
      vietnamese: x.readingStrategy,
      category: x.category,
      keywords: buildKeywords([x.title, x.category, x.readingStrategy]),
      tags: [x.cefrLevel, 'reading'],
      route: '/reading',
      rankWeight: 70,
    })),
    ...allWriting.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'skills_core',
      kind: 'writing',
      cefrLevel: x.cefrLevel,
      title: x.title,
      subtitle: `${x.cefrLevel} Writing • ${x.category.replace(/_/g, ' ')}`,
      vietnamese: x.prompt.slice(0, 80),
      category: x.category,
      keywords: buildKeywords([x.title, x.category, x.prompt]),
      tags: [x.cefrLevel, 'writing'],
      route: '/writing',
      rankWeight: 68,
    })),
    ...pronunciationLessons.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'skills_core',
      kind: 'pronunciation',
      cefrLevel: x.cefrLevel,
      title: x.title,
      subtitle: `${x.cefrLevel} Pronunciation • ${x.targetSymbols.join(' ')}`,
      vietnamese: x.vietnameseLearnerTip.slice(0, 90),
      category: x.category,
      keywords: buildKeywords([x.title, ...x.targetSymbols, x.category, x.articulatoryGuide]),
      tags: [x.cefrLevel, 'pronunciation'],
      route: '/speaking',
      rankWeight: 72,
    })),
    ...shadowingSessions.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'skills_core',
      kind: 'speaking',
      cefrLevel: x.cefrLevel,
      title: x.title,
      subtitle: `${x.cefrLevel} Shadowing • ${x.topic}`,
      vietnamese: x.vietnameseFocusTip.slice(0, 90),
      category: 'shadowing',
      keywords: buildKeywords([x.title, x.topic, x.rhythmOverview]),
      tags: [x.cefrLevel, 'shadowing'],
      route: '/speaking',
      rankWeight: 64,
    })),
    ...conversationScenarios.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'skills_core',
      kind: 'conversation',
      cefrLevel: x.cefrLevel,
      title: x.title,
      subtitle: `${x.cefrLevel} Role-Play • ${x.setting}`,
      vietnamese: x.goal,
      category: x.domain,
      keywords: buildKeywords([x.title, x.setting, x.domain, x.goal]),
      tags: [x.cefrLevel, 'conversation'],
      route: '/speaking',
      rankWeight: 66,
    })),
    ...thinkInEnglish.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'skills_core',
      kind: 'speaking',
      cefrLevel: x.cefrLevel,
      title: x.title,
      subtitle: `${x.cefrLevel} Think in English • ${x.mode.replace(/_/g, ' ')}`,
      vietnamese: x.antiTranslationTip,
      category: x.mode,
      keywords: buildKeywords([x.title, x.mode, ...x.starterFrames]),
      tags: [x.cefrLevel, 'think_in_english'],
      route: '/speaking',
      rankWeight: 62,
    })),
  ];

  const ieltsEntries: SearchIndexEntry[] = [
    ...ieltsMocks.map((m): SearchIndexEntry => ({
      id: m.id,
      shardId: 'ielts_resources',
      kind: 'ielts',
      cefrLevel: 'C1' as CEFRLevel,
      title: m.title,
      subtitle: `${m.examFormat === 'full_exam' ? 'Full 40/40 Exam' : 'Practice Mini-Mock'} • ${m.pathway}`,
      category: m.examFormat,
      keywords: buildKeywords([m.title, m.subtitle, m.pathway, m.examFormat]),
      tags: ['ielts', m.examFormat, m.pathway],
      route: `/mock-exam/${m.id}`,
      rankWeight: m.examFormat === 'full_exam' ? 92 : 76,
    })),
    ...ieltsListening.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'ielts_resources',
      kind: 'ielts',
      cefrLevel: x.cefrTarget,
      title: x.title,
      subtitle: `IELTS Listening ${x.part.replace('_', ' ')} • ${x.topic}`,
      category: 'ielts_listening',
      keywords: buildKeywords([x.title, x.topic, x.part]),
      tags: ['ielts', 'listening'],
      route: '/ielts',
      rankWeight: 68,
    })),
    ...ieltsSpeaking.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'ielts_resources',
      kind: 'ielts',
      cefrLevel: x.cefrTarget,
      title: x.title,
      subtitle: `IELTS Speaking ${x.part.replace('_', ' ')} • ${x.topic}`,
      category: 'ielts_speaking',
      keywords: buildKeywords([x.title, x.topic, x.part]),
      tags: ['ielts', 'speaking'],
      route: '/ielts',
      rankWeight: 68,
    })),
    ...ieltsReading.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'ielts_resources',
      kind: 'ielts',
      cefrLevel: x.cefrTarget,
      title: x.title,
      subtitle: `IELTS Reading (${x.pathway}) • ${x.topic}`,
      category: 'ielts_reading',
      keywords: buildKeywords([x.title, x.topic, x.pathway]),
      tags: ['ielts', 'reading'],
      route: '/ielts',
      rankWeight: 68,
    })),
    ...ieltsWriting.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'ielts_resources',
      kind: 'ielts',
      cefrLevel: x.cefrTarget,
      title: x.title,
      subtitle: `IELTS Writing (${x.questionSubtype.replace(/_/g, ' ')}) • ${x.topic}`,
      category: 'ielts_writing',
      keywords: buildKeywords([x.title, x.topic, x.questionSubtype]),
      tags: ['ielts', 'writing'],
      route: '/ielts',
      rankWeight: 68,
    })),
    ...ieltsStrategies.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'ielts_resources',
      kind: 'ielts',
      cefrLevel: x.cefrTarget,
      title: x.title,
      subtitle: `IELTS Strategy (${x.category}) • ${x.skillFocus}`,
      category: 'ielts_strategy',
      keywords: buildKeywords([x.title, x.skillFocus, x.category]),
      tags: ['ielts', 'strategy'],
      route: '/ielts',
      rankWeight: 72,
    })),
    ...ieltsIdeas.map((x): SearchIndexEntry => ({
      id: x.id,
      shardId: 'ielts_resources',
      kind: 'ielts',
      cefrLevel: x.cefrTarget,
      title: x.topic,
      subtitle: 'IELTS Topic Idea & Lexical Bank',
      vietnamese: x.academicCollocations.slice(0, 3).map((c) => `${c.term} (${c.vietnamese})`).join(' • '),
      category: 'ielts_ideas',
      keywords: buildKeywords([
        x.topic,
        ...x.academicCollocations.slice(0, 6).map((c) => c.term),
        ...x.academicCollocations.slice(0, 6).map((c) => c.vietnamese),
      ]),
      tags: ['ielts', 'ideas'],
      route: '/ielts',
      rankWeight: 74,
    })),
    ...resources.map((r): SearchIndexEntry => ({
      id: r.id,
      shardId: 'ielts_resources',
      kind: 'resource',
      cefrLevel: r.cefrLevels[0],
      title: r.title,
      subtitle: `${r.publisher} • Curated Open Resource (${r.cefrLevels.join('–')})`,
      vietnamese: r.description,
      category: r.subject,
      keywords: buildKeywords([r.title, r.publisher, r.subject, ...r.skills]),
      tags: ['resource', ...r.skills],
      route: '/reading',
      rankWeight: 60,
    })),
  ];

  return {
    vocab_core: vocabEntries,
    grammar_core: grammarEntries,
    skills_core: skillsEntries,
    ielts_resources: ieltsEntries,
  };
}

export async function generateSearchShardsToDisk(): Promise<{
  totalEntries: number;
  shardCounts: Record<SearchShardId, number>;
}> {
  const shards = await buildSearchShardData();
  const outDir = path.resolve(process.cwd(), 'content/search');
  fs.mkdirSync(outDir, { recursive: true });

  const writeShardFile = (filename: string, exportName: string, rows: SearchIndexEntry[]) => {
    // Store serialized payload inside JSON.parse so TypeScript avoids TS2590 union expansion at scale.
    const serializedLiteral = JSON.stringify(JSON.stringify(rows));
    const fileContent = `import type { SearchIndexEntry } from '@english-quest/shared';\n\nexport const ${exportName}: SearchIndexEntry[] = JSON.parse(${serializedLiteral}) as SearchIndexEntry[];\n`;
    fs.writeFileSync(path.join(outDir, filename), fileContent, 'utf-8');
  };

  writeShardFile('shard_vocab.ts', 'SEARCH_SHARD_VOCAB', shards.vocab_core);
  writeShardFile('shard_grammar.ts', 'SEARCH_SHARD_GRAMMAR', shards.grammar_core);
  writeShardFile('shard_skills.ts', 'SEARCH_SHARD_SKILLS', shards.skills_core);
  writeShardFile('shard_ielts.ts', 'SEARCH_SHARD_IELTS', shards.ielts_resources);

  const shardCounts: Record<SearchShardId, number> = {
    vocab_core: shards.vocab_core.length,
    grammar_core: shards.grammar_core.length,
    skills_core: shards.skills_core.length,
    ielts_resources: shards.ielts_resources.length,
  };
  const totalEntries =
    shardCounts.vocab_core +
    shardCounts.grammar_core +
    shardCounts.skills_core +
    shardCounts.ielts_resources;

  const manifestContent = `export interface SearchShardManifest {
  version: number;
  totalEntries: number;
  shards: Array<{
    id: 'vocab_core' | 'grammar_core' | 'skills_core' | 'ielts_resources';
    label: string;
    count: number;
  }>;
}

export const SEARCH_SHARD_MANIFEST: SearchShardManifest = ${JSON.stringify(
    {
      version: 1,
      totalEntries,
      shards: [
        { id: 'vocab_core', label: 'Vocabulary & Collections', count: shardCounts.vocab_core },
        { id: 'grammar_core', label: 'Grammar Rules', count: shardCounts.grammar_core },
        { id: 'skills_core', label: 'Lessons & 4-Skill Academies', count: shardCounts.skills_core },
        { id: 'ielts_resources', label: 'IELTS & Curated Resources', count: shardCounts.ielts_resources },
      ],
    },
    null,
    2
  )};\n`;

  fs.writeFileSync(path.join(outDir, 'manifest.ts'), manifestContent, 'utf-8');
  return { totalEntries, shardCounts };
}
