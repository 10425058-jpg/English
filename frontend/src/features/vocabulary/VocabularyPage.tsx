import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookText, Eye, FolderHeart, Plus, RotateCw, Search, Sparkles, Volume2 } from 'lucide-react';
import {
  isDueForReview,
  type CEFRLevel,
  type SM2Quality,
  type ThematicCollection,
  type UserVocabulary,
  type Vocabulary,
} from '@english-quest/shared';
import {
  CEFR_LEVELS,
  loadAllVocabulary,
  loadThematicCollections,
  loadVocabularyByLevel,
} from '@content/index';
import { PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { speakText } from '@/services/speechService';
import { getCombinedVocabulary, useQuestStore } from '@/stores/useQuestStore';

type VocabPackKey = 'CORE' | CEFRLevel;

function toUserVocab(
  list: Vocabulary[],
  schedules: ReturnType<typeof useQuestStore.getState>['vocabularySchedules'],
  fallbackIso: string
): UserVocabulary[] {
  return list.map((v) => ({
    ...v,
    schedule: schedules[v.id] ?? {
      vocabularyId: v.id,
      easeFactor: 2.5,
      intervalDays: 0,
      repetitions: 0,
      nextReviewDate: fallbackIso,
      masteryLevel: 0,
    },
    savedAt: fallbackIso,
  }));
}

export function VocabularyPage() {
  const customVocabulary = useQuestStore((s) => s.customVocabulary);
  const vocabularySchedules = useQuestStore((s) => s.vocabularySchedules);
  const preferences = useQuestStore((s) => s.preferences);
  const reviewVocabularySM2 = useQuestStore((s) => s.reviewVocabularySM2);
  const saveWordToVocabulary = useQuestStore((s) => s.saveWordToVocabulary);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [nowIso] = useState(() => new Date().toISOString());
  const [tab, setTab] = useState<'flashcards' | 'notebook' | 'collections'>('flashcards');
  const [pack, setPack] = useState<VocabPackKey>('CORE');
  const [activeCollectionDeck, setActiveCollectionDeck] = useState<{
    title: string;
    ids: string[];
  } | null>(null);
  const [domainFilter, setDomainFilter] = useState<'ALL' | ThematicCollection['domain']>('ALL');
  const [expandedColId, setExpandedColId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [cefrFilter, setCefrFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [notebookLimit, setNotebookLimit] = useState(40);
  const [flipped, setFlipped] = useState(false);
  const [recallInput, setRecallInput] = useState('');
  const [cardIndex, setCardIndex] = useState(0);

  // Quick Add Word state
  const [newWord, setNewWord] = useState('');
  const [newDef, setNewDef] = useState('');
  const [newVi, setNewVi] = useState('');

  const coreVocab = useMemo(
    () => getCombinedVocabulary(customVocabulary, vocabularySchedules),
    [customVocabulary, vocabularySchedules]
  );

  const { data: lazyPack = [], isLoading: packLoading } = useQuery({
    queryKey: ['vocab-pack', pack],
    queryFn: () => (pack === 'CORE' ? Promise.resolve([]) : loadVocabularyByLevel(pack)),
    enabled: pack !== 'CORE',
    staleTime: Infinity,
  });

  const { data: collections = [], isLoading: collectionsLoading } = useQuery({
    queryKey: ['thematic-collections'],
    queryFn: loadThematicCollections,
    enabled: tab === 'collections',
    staleTime: Infinity,
  });

  const { data: allExpandedForCollection = [] } = useQuery({
    queryKey: ['vocab-all-for-collection'],
    queryFn: loadAllVocabulary,
    enabled: activeCollectionDeck !== null,
    staleTime: Infinity,
  });

  const activePackList = useMemo(() => {
    if (activeCollectionDeck && allExpandedForCollection.length > 0) {
      const idSet = new Set(activeCollectionDeck.ids);
      const matched = [...coreVocab, ...allExpandedForCollection].filter((v) => idSet.has(v.id));
      return toUserVocab(matched, vocabularySchedules, nowIso);
    }
    if (pack === 'CORE') return coreVocab;
    return toUserVocab(lazyPack, vocabularySchedules, nowIso);
  }, [activeCollectionDeck, allExpandedForCollection, coreVocab, pack, lazyPack, vocabularySchedules, nowIso]);

  const dueCards = useMemo(
    () => activePackList.filter((v) => isDueForReview(v.schedule, nowIso)),
    [activePackList, nowIso]
  );

  const studyDeck = dueCards.length > 0 ? dueCards : activePackList;
  const activeCard = studyDeck.length > 0 ? studyDeck[cardIndex % studyDeck.length] : undefined;

  const filteredNotebook = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = pack === 'CORE' ? coreVocab : toUserVocab(lazyPack, vocabularySchedules, nowIso);
    return base.filter((item) => {
      if (cefrFilter !== 'ALL' && item.cefrLevel !== cefrFilter) return false;
      if (!q) return true;
      return (
        item.word.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.vietnameseTranslation.toLowerCase().includes(q)
      );
    });
  }, [pack, coreVocab, lazyPack, vocabularySchedules, nowIso, search, cefrFilter]);

  const visibleNotebook = filteredNotebook.slice(0, notebookLimit);

  const filteredCollections = useMemo(() => {
    if (domainFilter === 'ALL') return collections;
    return collections.filter((c) => c.domain === domainFilter);
  }, [collections, domainFilter]);

  const handleSm2Rate = (quality: SM2Quality) => {
    if (!activeCard) return;
    reviewVocabularySM2(activeCard.id, quality);
    awardActivityXp({
      idempotencyKey: `vocab-sm2-${activeCard.id}-${Date.now()}`,
      amount: quality >= 4 ? 8 : 4,
      source: 'vocabulary',
      referenceId: activeCard.id,
      skill: 'vocabulary',
      minutes: 1,
      correctDelta: quality >= 3 ? 1 : 0,
      attemptsDelta: 1,
    });
    setFlipped(false);
    setRecallInput('');
    setCardIndex((i) => i + 1);
  };

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newDef.trim()) return;
    saveWordToVocabulary({
      word: newWord.trim(),
      partOfSpeech: 'noun/verb',
      ipa: '/custom/',
      definition: newDef.trim(),
      vietnameseTranslation: newVi.trim() || 'từ tự lưu',
      exampleSentence: `I practiced using "${newWord.trim()}" today.`,
      synonyms: [],
      antonyms: [],
      collocations: [],
      wordFamily: [],
      cefrLevel: 'A2',
      category: 'Personal Note',
    });
    setNewWord('');
    setNewDef('');
    setNewVi('');
  };

  const masteredCount = coreVocab.filter((v) => v.schedule.masteryLevel >= 3).length +
    Object.values(vocabularySchedules).filter((s) => s.masteryLevel >= 3 && !s.vocabularyId.startsWith('voc-')).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="green">
            <BookText className="h-3.5 w-3.5" />
            Vocabulary, Collections &amp; SM-2
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Build Lasting Word Mastery</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            1,440+ curated A1–C2 entries, 30 thematic collections, UK/US IPA, and SM-2 spaced repetition.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2 text-center">
            <p className="text-[11px] font-extrabold uppercase text-[#777777]">Due Now</p>
            <p className="text-lg font-black text-[#1CB0F6]">{dueCards.length}</p>
          </div>
          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2 text-center">
            <p className="text-[11px] font-extrabold uppercase text-[#777777]">Mastered</p>
            <p className="text-lg font-black text-[#58CC02]">{masteredCount}</p>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2">
        <TactileButton
          size="sm"
          variant={tab === 'flashcards' ? 'primary' : 'outline'}
          onClick={() => setTab('flashcards')}
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          SM-2 Flashcard Session ({studyDeck.length})
        </TactileButton>
        <TactileButton
          size="sm"
          variant={tab === 'notebook' ? 'primary' : 'outline'}
          onClick={() => setTab('notebook')}
        >
          <BookText className="h-4 w-4 shrink-0" />
          Vocabulary Notebook ({filteredNotebook.length})
        </TactileButton>
        <TactileButton
          size="sm"
          variant={tab === 'collections' ? 'secondary' : 'outline'}
          onClick={() => setTab('collections')}
        >
          <FolderHeart className="h-4 w-4 shrink-0" />
          Thematic Collections (30)
        </TactileButton>
      </div>

      {/* Lazy CEFR Pack Selector (Flashcards & Notebook) */}
      {tab !== 'collections' && (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveCollectionDeck(null);
              setPack('CORE');
              setCardIndex(0);
              setNotebookLimit(40);
            }}
            className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              !activeCollectionDeck && pack === 'CORE'
                ? 'border-[#46A302] bg-[#58CC02] text-white'
                : 'border-[#E5E5E5] bg-white text-[#555555]'
            }`}
          >
            Core + Saved ({coreVocab.length})
          </button>
          {CEFR_LEVELS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                setActiveCollectionDeck(null);
                setPack(lvl);
                setCefrFilter('ALL');
                setCardIndex(0);
                setNotebookLimit(40);
              }}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                !activeCollectionDeck && pack === lvl
                  ? 'border-[#46A302] bg-[#58CC02] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {lvl} Pack
            </button>
          ))}
          {activeCollectionDeck && (
            <PillBadge tone="blue">
              Collection: {activeCollectionDeck.title}
            </PillBadge>
          )}
        </div>
      )}

      {tab === 'flashcards' && packLoading && pack !== 'CORE' && (
        <QuestCard className="p-6 text-center text-sm font-bold text-[#666666]">
          Loading {pack} vocabulary pack...
        </QuestCard>
      )}

      {tab === 'flashcards' && activeCard && (
        <QuestCard className="mx-auto max-w-xl space-y-5 p-6 text-center">
          <div className="flex items-center justify-between text-xs font-black text-[#777777]">
            <span>
              {activeCard.cefrLevel} • {activeCard.category}
              {activeCard.register ? ` • ${activeCard.register}` : ''}
            </span>
            <span>
              Mastery Lv.{activeCard.schedule.masteryLevel}/5 • Interval {activeCard.schedule.intervalDays}d
            </span>
          </div>

          <div className="rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-6">
            <p className="text-3xl font-black text-[#3C3C3C]">{activeCard.word}</p>
            {activeCard.senseLabel && (
              <p className="mt-1 text-xs font-extrabold text-[#8E3FD6]">{activeCard.senseLabel}</p>
            )}
            <p className="mt-1 text-sm font-bold text-[#777777]">
              {activeCard.partOfSpeech} • {activeCard.ipa}
              {activeCard.ipaUs && activeCard.ipaUs !== activeCard.ipa ? ` (US ${activeCard.ipaUs})` : ''}
            </p>
            <div className="mt-3 flex justify-center">
              <TactileButton
                size="sm"
                variant="secondary"
                onClick={() => speakText(activeCard.word, { accent: preferences.preferredAccent })}
              >
                <Volume2 className="h-4 w-4" />
                Listen
              </TactileButton>
            </div>

            {!flipped ? (
              <div className="mt-5 space-y-3">
                <input
                  type="text"
                  value={recallInput}
                  onChange={(e) => setRecallInput(e.target.value)}
                  placeholder="Active recall: type the meaning before flipping..."
                  className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-3.5 py-2.5 text-sm font-bold text-center"
                />
                <TactileButton fullWidth onClick={() => setFlipped(true)}>
                  <Eye className="h-4 w-4" />
                  Reveal Definition &amp; Examples
                </TactileButton>
              </div>
            ) : (
              <div className="mt-5 space-y-3 border-t border-[#E5E5E5] pt-4 text-left">
                <p className="text-base font-black text-[#3C3C3C]">{activeCard.definition}</p>
                <p className="text-sm font-extrabold text-[#46A302]">
                  VI: {activeCard.vietnameseTranslation}
                </p>
                <div className="rounded-xl bg-white p-3 text-sm border border-[#E5E5E5] space-y-1">
                  <p className="italic font-semibold text-[#444444]">
                    &ldquo;{activeCard.exampleSentence}&rdquo;
                  </p>
                  {preferences.bilingualExplanations && activeCard.exampleTranslationVi && (
                    <p className="text-xs font-bold text-[#0E8BC9]">
                      {activeCard.exampleTranslationVi}
                    </p>
                  )}
                </div>
                {activeCard.collocations.length > 0 && (
                  <p className="text-xs font-bold text-[#0E8BC9]">
                    Collocations: {activeCard.collocations.join(' • ')}
                  </p>
                )}
                {activeCard.usageNote && (
                  <p className="text-xs font-bold text-[#A67800]">Note: {activeCard.usageNote}</p>
                )}
              </div>
            )}
          </div>

          {flipped && (
            <div className="space-y-2">
              <p className="text-xs font-black uppercase text-[#777777]">
                Rate your recall (SM-2 Scheduler)
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <TactileButton size="sm" variant="danger" onClick={() => handleSm2Rate(1)}>
                  <RotateCw className="h-3.5 w-3.5" />
                  Again (1d)
                </TactileButton>
                <TactileButton size="sm" variant="gold" onClick={() => handleSm2Rate(3)}>
                  Hard
                </TactileButton>
                <TactileButton size="sm" variant="secondary" onClick={() => handleSm2Rate(4)}>
                  Good
                </TactileButton>
                <TactileButton size="sm" variant="primary" onClick={() => handleSm2Rate(5)}>
                  Easy
                </TactileButton>
              </div>
            </div>
          )}
        </QuestCard>
      )}

      {tab === 'notebook' && (
        <div className="space-y-5">
          {/* Add Word Form */}
          <QuestCard>
            <h2 className="text-base font-black">Add Personal Word to Notebook</h2>
            <form onSubmit={handleAddCustomWord} className="mt-3 grid gap-2.5 sm:grid-cols-4">
              <input
                type="text"
                placeholder="English word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2 text-sm font-bold"
              />
              <input
                type="text"
                placeholder="Definition"
                value={newDef}
                onChange={(e) => setNewDef(e.target.value)}
                className="rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2 text-sm font-bold"
              />
              <input
                type="text"
                placeholder="Vietnamese meaning"
                value={newVi}
                onChange={(e) => setNewVi(e.target.value)}
                className="rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2 text-sm font-bold"
              />
              <TactileButton type="submit" size="sm">
                <Plus className="h-4 w-4" />
                Save Word
              </TactileButton>
            </form>
          </QuestCard>

          {/* Search & CEFR Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#888888]" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search words, definitions, Vietnamese..."
                className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white py-2 pl-10 pr-4 text-sm font-bold"
              />
            </div>
            {pack === 'CORE' && (
              <div className="flex gap-1.5">
                {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCefrFilter(lvl)}
                    className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                      cefrFilter === lvl
                        ? 'border-[#46A302] bg-[#58CC02] text-white'
                        : 'border-[#E5E5E5] bg-white text-[#555555]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {visibleNotebook.map((item) => (
              <QuestCard key={item.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-black">{item.word}</span>
                      <span className="rounded-lg bg-[#E9FCD9] px-2 py-0.5 text-[11px] font-black text-[#46A302]">
                        {item.cefrLevel}
                      </span>
                      {item.register && (
                        <span className="rounded-lg bg-[#F2FAFF] px-2 py-0.5 text-[10px] font-black uppercase text-[#0E8BC9]">
                          {item.register}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#777777]">
                      {item.partOfSpeech} • {item.ipa}
                      {item.ipaUs && item.ipaUs !== item.ipa ? ` (US ${item.ipaUs})` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Pronounce ${item.word}`}
                    onClick={() => speakText(item.word, { accent: preferences.preferredAccent })}
                    className="rounded-xl border border-[#BCE7FD] bg-[#F2FAFF] p-2 text-[#0E8BC9]"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-sm font-bold text-[#3C3C3C]">{item.definition}</p>
                <p className="text-xs font-extrabold text-[#46A302]">VI: {item.vietnameseTranslation}</p>
                <p className="text-xs italic font-semibold text-[#555555]">
                  &ldquo;{item.exampleSentence}&rdquo;
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-bold text-[#666666]">
                  {item.collocations.length > 0 && (
                    <span className="rounded-md bg-[#F7F8FA] px-2 py-0.5 border border-[#E5E5E5]">
                      Collocations: {item.collocations.slice(0, 2).join(', ')}
                    </span>
                  )}
                  {item.synonyms.length > 0 && (
                    <span className="rounded-md bg-[#F7F8FA] px-2 py-0.5 border border-[#E5E5E5]">
                      Synonyms: {item.synonyms.slice(0, 3).join(', ')}
                    </span>
                  )}
                </div>
              </QuestCard>
            ))}
          </div>

          {filteredNotebook.length > notebookLimit && (
            <div className="flex justify-center">
              <TactileButton variant="outline" size="sm" onClick={() => setNotebookLimit((n) => n + 40)}>
                Load More Entries ({visibleNotebook.length} of {filteredNotebook.length})
              </TactileButton>
            </div>
          )}
        </div>
      )}

      {tab === 'collections' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['ALL', 'All Domains (30)'],
                ['everyday', 'Everyday (10)'],
                ['academic', 'Academic (6)'],
                ['professional', 'Professional (7)'],
                ['ielts_advanced', 'IELTS & Advanced (7)'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setDomainFilter(key)}
                className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                  domainFilter === key
                    ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {collectionsLoading ? (
            <QuestCard className="p-6 text-center text-sm font-bold text-[#666666]">
              Loading thematic vocabulary collections...
            </QuestCard>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredCollections.map((col) => {
                const open = expandedColId === col.id;
                return (
                  <QuestCard key={col.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <PillBadge tone="blue">{col.cefrLevels.join(' • ')}</PillBadge>
                        <h2 className="mt-1.5 text-base font-black text-[#3C3C3C]">{col.title}</h2>
                      </div>
                      <span className="rounded-lg bg-[#E9FCD9] px-2 py-0.5 text-[11px] font-black text-[#46A302]">
                        {col.vocabularyIds.length} words
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#555555]">{col.description}</p>

                    <div className="flex flex-wrap gap-2">
                      <TactileButton
                        size="sm"
                        variant="outline"
                        onClick={() => setExpandedColId(open ? null : col.id)}
                      >
                        {open ? 'Hide Expressions' : 'Expressions & Usage'}
                      </TactileButton>
                      <TactileButton
                        size="sm"
                        onClick={() => {
                          setActiveCollectionDeck({ title: col.title, ids: col.vocabularyIds });
                          setCardIndex(0);
                          setFlipped(false);
                          setTab('flashcards');
                        }}
                      >
                        Study Deck
                      </TactileButton>
                    </div>

                    {open && (
                      <div className="space-y-2 border-t border-[#E5E5E5] pt-3 text-xs">
                        {col.commonExpressions.map((exp) => (
                          <div key={exp.expression} className="rounded-xl bg-[#F7F8FA] p-2.5">
                            <p className="font-black text-[#3C3C3C]">{exp.expression}</p>
                            <p className="font-semibold text-[#666666]">{exp.meaning}</p>
                            <p className="italic text-[#0E8BC9]">{exp.example}</p>
                          </div>
                        ))}
                        <div className="flex flex-wrap gap-1.5">
                          {col.collocationGroups.flatMap((g) => g.items).map((phrase) => (
                            <span
                              key={phrase}
                              className="rounded-md border border-[#E5E5E5] bg-white px-2 py-0.5 text-[11px] font-bold text-[#444444]"
                            >
                              {phrase}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </QuestCard>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
