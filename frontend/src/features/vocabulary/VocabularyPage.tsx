import { useMemo, useState } from 'react';
import { BookText, Eye, Plus, RotateCw, Search, Sparkles, Volume2 } from 'lucide-react';
import { isDueForReview, type CEFRLevel, type SM2Quality } from '@english-quest/shared';
import { PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { speakText } from '@/services/speechService';
import { getCombinedVocabulary, useQuestStore } from '@/stores/useQuestStore';

export function VocabularyPage() {
  const customVocabulary = useQuestStore((s) => s.customVocabulary);
  const vocabularySchedules = useQuestStore((s) => s.vocabularySchedules);
  const preferences = useQuestStore((s) => s.preferences);
  const reviewVocabularySM2 = useQuestStore((s) => s.reviewVocabularySM2);
  const saveWordToVocabulary = useQuestStore((s) => s.saveWordToVocabulary);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [tab, setTab] = useState<'flashcards' | 'notebook'>('flashcards');
  const [search, setSearch] = useState('');
  const [cefrFilter, setCefrFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [flipped, setFlipped] = useState(false);
  const [recallInput, setRecallInput] = useState('');
  const [cardIndex, setCardIndex] = useState(0);

  // Quick Add Word state
  const [newWord, setNewWord] = useState('');
  const [newDef, setNewDef] = useState('');
  const [newVi, setNewVi] = useState('');

  const allVocab = useMemo(
    () => getCombinedVocabulary(customVocabulary, vocabularySchedules),
    [customVocabulary, vocabularySchedules]
  );

  const nowIso = new Date().toISOString();
  const dueCards = useMemo(
    () => allVocab.filter((v) => isDueForReview(v.schedule, nowIso)),
    [allVocab, nowIso]
  );

  const studyDeck = dueCards.length > 0 ? dueCards : allVocab;
  const activeCard = studyDeck[cardIndex % studyDeck.length];

  const filteredNotebook = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allVocab.filter((item) => {
      if (cefrFilter !== 'ALL' && item.cefrLevel !== cefrFilter) return false;
      if (!q) return true;
      return (
        item.word.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.vietnameseTranslation.toLowerCase().includes(q)
      );
    });
  }, [allVocab, search, cefrFilter]);

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

  const masteredCount = allVocab.filter((v) => v.schedule.masteryLevel >= 3).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="green">
            <BookText className="h-3.5 w-3.5" />
            Vocabulary & SM-2 Flashcards
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Build Lasting Word Mastery</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Active recall flashcards powered by SM-2 spaced repetition + personal word notebook.
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
          Vocabulary Notebook ({allVocab.length})
        </TactileButton>
      </div>

      {tab === 'flashcards' && activeCard && (
        <QuestCard className="mx-auto max-w-xl space-y-5 p-6 text-center">
          <div className="flex items-center justify-between text-xs font-black text-[#777777]">
            <span>
              {activeCard.cefrLevel} • {activeCard.category}
            </span>
            <span>
              Mastery Lv.{activeCard.schedule.masteryLevel}/5 • Interval {activeCard.schedule.intervalDays}d
            </span>
          </div>

          <div className="rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-6">
            <p className="text-3xl font-black text-[#3C3C3C]">{activeCard.word}</p>
            <p className="mt-1 text-sm font-bold text-[#777777]">
              {activeCard.partOfSpeech} • {activeCard.ipa}
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
                  Reveal Definition & Examples
                </TactileButton>
              </div>
            ) : (
              <div className="mt-5 space-y-3 border-t border-[#E5E5E5] pt-4 text-left">
                <p className="text-base font-black text-[#3C3C3C]">{activeCard.definition}</p>
                <p className="text-sm font-extrabold text-[#46A302]">
                  VI: {activeCard.vietnameseTranslation}
                </p>
                <p className="rounded-xl bg-white p-3 text-sm italic font-semibold text-[#555555] border border-[#E5E5E5]">
                  &ldquo;{activeCard.exampleSentence}&rdquo;
                </p>
                {activeCard.collocations.length > 0 && (
                  <p className="text-xs font-bold text-[#0E8BC9]">
                    Collocations: {activeCard.collocations.join(' • ')}
                  </p>
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
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filteredNotebook.map((item) => (
              <QuestCard key={item.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black">{item.word}</span>
                      <span className="rounded-lg bg-[#E9FCD9] px-2 py-0.5 text-[11px] font-black text-[#46A302]">
                        {item.cefrLevel}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#777777]">
                      {item.partOfSpeech} • {item.ipa}
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
                      Synonyms: {item.synonyms.join(', ')}
                    </span>
                  )}
                </div>
              </QuestCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
