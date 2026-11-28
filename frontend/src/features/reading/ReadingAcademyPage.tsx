import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Bookmark,
  BookmarkPlus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Highlighter,
  Lightbulb,
  Search,
  Sparkles,
  Type,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  evaluateExerciseAnswer,
  type CEFRLevel,
  type ReadingPassage,
} from '@english-quest/shared';
import { CEFR_LEVELS, loadAllReading, loadLearningResources } from '@content/index';
import { HonestNotice, PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { READING_LIBRARY_PASSAGES } from '@/data/readingLibraryData';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone, speakText, stopSpeaking } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

const CATEGORY_LABELS: Record<ReadingPassage['category'], string> = {
  everyday: 'Everyday',
  short_story: 'Short Story',
  science: 'Science',
  technology: 'Technology',
  business: 'Business & Work',
  culture: 'Culture & Society',
  history: 'History',
  academic: 'Academic',
  ielts: 'IELTS Style',
  biography: 'Biography',
  opinion: 'Opinion & Essay',
};

function countWordsInParagraphs(paragraphs: string[]): number {
  return paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
}

export function ReadingAcademyPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const saveWordToVocabulary = useQuestStore((s) => s.saveWordToVocabulary);
  const recordReadingSession = useQuestStore((s) => s.recordReadingSession);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);
  const readingHistory = useQuestStore((s) => s.readingHistory);
  const bookmarkedContentIds = useQuestStore((s) => s.bookmarkedContentIds ?? []);
  const toggleContentBookmark = useQuestStore((s) => s.toggleContentBookmark);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds ?? []);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);

  const [mainTab, setMainTab] = useState<'passages' | 'resources'>('passages');
  const [cefrFilter, setCefrFilter] = useState<'ALL' | 'BOOKMARKED' | CEFRLevel>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | ReadingPassage['category']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(READING_LIBRARY_PASSAGES[0].id);

  const [fontScale, setFontScale] = useState<'sm' | 'base' | 'lg'>('base');
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [highlightMode, setHighlightMode] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState('');
  const [savedSummaryNotice, setSavedSummaryNotice] = useState(false);

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceLevelFilter, setResourceLevelFilter] = useState<'ALL' | CEFRLevel>('ALL');

  const { data: expandedPassages = [], isLoading: passagesLoading } = useQuery({
    queryKey: ['reading-academy-all'],
    queryFn: loadAllReading,
    staleTime: Infinity,
  });

  const { data: curatedResources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ['learning-resources'],
    queryFn: loadLearningResources,
    staleTime: Infinity,
  });

  const allPassages: ReadingPassage[] = useMemo(
    () => [...READING_LIBRARY_PASSAGES, ...expandedPassages],
    [expandedPassages]
  );

  const completedSet = useMemo(() => {
    const ids = new Set<string>(completedAcademyIds);
    for (const rec of readingHistory) ids.add(rec.passageId);
    return ids;
  }, [completedAcademyIds, readingHistory]);

  const categoriesAvailable = useMemo(() => {
    const set = new Set<ReadingPassage['category']>();
    for (const p of allPassages) set.add(p.category);
    return Array.from(set);
  }, [allPassages]);

  const filteredPassages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPassages.filter((passage) => {
      if (cefrFilter === 'BOOKMARKED' && !bookmarkedContentIds.includes(passage.id)) return false;
      if (
        cefrFilter !== 'ALL' &&
        cefrFilter !== 'BOOKMARKED' &&
        passage.cefrLevel !== cefrFilter
      ) {
        return false;
      }
      if (categoryFilter !== 'ALL' && passage.category !== categoryFilter) return false;
      if (
        q &&
        !passage.title.toLowerCase().includes(q) &&
        !passage.category.replace(/_/g, ' ').toLowerCase().includes(q) &&
        !(passage.readingStrategy ?? '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [allPassages, bookmarkedContentIds, categoryFilter, cefrFilter, searchQuery]);

  const activePassage =
    allPassages.find((p) => p.id === selectedId) ?? filteredPassages[0] ?? READING_LIBRARY_PASSAGES[0];

  const passageWordCount = useMemo(
    () => activePassage.wordCount ?? countWordsInParagraphs(activePassage.paragraphs),
    [activePassage]
  );

  useEffect(() => {
    if (mainTab !== 'passages' || submitted) return;
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [mainTab, submitted, activePassage.id]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleSelectPassage = (id: string) => {
    stopSpeaking();
    setSelectedId(id);
    setAnswers({});
    setSubmitted(false);
    setElapsedSeconds(0);
    setHighlightedIndices([]);
    setSummaryDraft('');
    setSavedSummaryNotice(false);
    setSavedToast(null);
  };

  const toggleParagraphHighlight = (index: number) => {
    if (!highlightMode) return;
    setHighlightedIndices((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    );
  };

  const handleSaveGlossaryWord = (
    entry: ReadingPassage['glossary'][number]
  ) => {
    saveWordToVocabulary({
      word: entry.word,
      ipa: entry.ipa,
      partOfSpeech: entry.partOfSpeech,
      definition: entry.definition,
      vietnameseTranslation: entry.vietnamese,
      exampleSentence: entry.example,
      synonyms: [],
      antonyms: [],
      collocations: [],
      wordFamily: [],
      cefrLevel: activePassage.cefrLevel,
      category: `reading-${activePassage.category}`,
    });
    setSavedToast(`Saved "${entry.word}" to your SM-2 Vocabulary Notebook.`);
    playFeedbackTone('correct', preferences.soundEffects);
  };

  const handleSubmit = () => {
    if (submitted) return;
    let correct = 0;
    for (const q of activePassage.questions) {
      const res = evaluateExerciseAnswer(q, answers[q.id] ?? '');
      if (res.isCorrect) {
        correct += 1;
      } else {
        recordMistake({
          source: 'reading',
          skill: 'reading',
          cefrLevel: activePassage.cefrLevel,
          prompt: q.prompt,
          userAnswer: res.normalizedUserAnswer || '(no answer)',
          expectedAnswer: res.expectedDisplay,
          explanation: q.explanation,
          explanationVi: q.explanationVi,
        });
      }
    }

    const total = activePassage.questions.length;
    recordReadingSession({
      passageId: activePassage.id,
      title: activePassage.title,
      cefrLevel: activePassage.cefrLevel,
      correctCount: correct,
      totalCount: total,
      readingSeconds: Math.max(15, elapsedSeconds),
    });
    markAcademyCompleted(activePassage.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('reading', activePassage.id),
      amount: Math.max(15, correct * 10),
      source: 'reading',
      referenceId: activePassage.id,
      skill: 'reading',
      minutes: Math.max(2, Math.round(elapsedSeconds / 60)),
      correctDelta: correct,
      attemptsDelta: total,
    });
    playFeedbackTone(correct === total ? 'celebrate' : 'correct', preferences.soundEffects);
    setSubmitted(true);
  };

  const correctTotal = submitted
    ? activePassage.questions.filter((q) => evaluateExerciseAnswer(q, answers[q.id] ?? '').isCorrect)
        .length
    : 0;

  const estimatedWpm =
    elapsedSeconds >= 10
      ? Math.min(480, Math.round((passageWordCount / elapsedSeconds) * 60))
      : null;

  const filteredResources = useMemo(() => {
    const q = resourceSearch.trim().toLowerCase();
    return curatedResources.filter((r) => {
      if (resourceLevelFilter !== 'ALL' && !r.cefrLevels.includes(resourceLevelFilter)) {
        return false;
      }
      if (
        q &&
        !r.title.toLowerCase().includes(q) &&
        !r.publisher.toLowerCase().includes(q) &&
        !r.description.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [curatedResources, resourceLevelFilter, resourceSearch]);

  const passageCompletedCount = allPassages.filter((p) => completedSet.has(p.id)).length;
  const textSizeClass =
    fontScale === 'sm' ? 'text-sm leading-6' : fontScale === 'lg' ? 'text-lg leading-8' : 'text-base leading-7';

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">
      {/* Header */}
      <QuestCard className="border-[#FFE175] bg-gradient-to-br from-[#FFFDF2] via-white to-[#FFF7E0]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="gold">Reading Academy A1–C2</PillBadge>
              <PillBadge tone="green">
                {passageCompletedCount} / {allPassages.length} Passages Read
              </PillBadge>
            </div>
            <h1 className="mt-2 text-2xl font-black text-[#3C3C3C] sm:text-3xl">
              Intensive Academic & Practical Reading
            </h1>
            <p className="mt-1 text-sm font-semibold text-[#666666]">
              Explore {allPassages.length} leveled passages with click-to-save SM-2 glossaries,
              reading-speed timing, IELTS question styles, and {curatedResources.length} vetted open
              libraries.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMainTab('passages')}
              className={`inline-flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-black ${
                mainTab === 'passages'
                  ? 'border-[#C99600] bg-[#FFC800] text-[#3C3C3C]'
                  : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Passages ({allPassages.length})
            </button>
            <button
              type="button"
              onClick={() => setMainTab('resources')}
              className={`inline-flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-black ${
                mainTab === 'resources'
                  ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
              }`}
            >
              <Globe className="h-4 w-4" />
              Curated Open Resources ({curatedResources.length || 36})
            </button>
          </div>
        </div>
        <div className="mt-4">
          <QuestProgressBar
            value={passageCompletedCount}
            max={Math.max(1, allPassages.length)}
            color="#FFC800"
            label="Reading Academy completion"
          />
        </div>
      </QuestCard>

      {mainTab === 'resources' ? (
        <div className="space-y-4">
          <QuestCard>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-[#888888]" />
                <input
                  type="text"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  placeholder="Search BBC, British Council, Voice of America, IELTS guides..."
                  className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white py-2 pr-4 pl-10 text-sm font-semibold text-[#3C3C3C] focus:border-[#1CB0F6] focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['ALL', ...CEFR_LEVELS] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setResourceLevelFilter(lvl)}
                    className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                      resourceLevelFilter === lvl
                        ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                        : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#555555]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </QuestCard>

          {resourcesLoading ? (
            <QuestCard>
              <p className="text-sm font-bold text-[#777777]">Loading curated open resources...</p>
            </QuestCard>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredResources.map((res) => (
                <QuestCard key={res.id} className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <PillBadge tone="blue">{res.subject}</PillBadge>
                      <PillBadge tone={res.pricing === 'free' ? 'green' : 'gold'}>
                        {res.pricing}
                      </PillBadge>
                    </div>
                    <h3 className="mt-2.5 text-base font-black text-[#3C3C3C]">{res.title}</h3>
                    <p className="text-xs font-bold text-[#0E8BC9]">{res.publisher}</p>
                    <p className="mt-2 text-sm font-semibold text-[#555555]">{res.description}</p>
                    <div className="mt-3 rounded-xl bg-[#F7F8FA] p-2.5 text-xs font-semibold text-[#555555]">
                      <span className="font-black text-[#3C3C3C]">Study Method: </span>
                      {res.recommendedStudyMethod}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {res.cefrLevels.map((lv) => (
                        <PillBadge key={lv} tone="neutral">
                          {lv}
                        </PillBadge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#F0F0F0] pt-3">
                    <span className="text-xs font-bold text-[#888888]">{res.licenseInfo}</span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#0E8BC9] bg-[#1CB0F6] px-3 py-1.5 text-xs font-black text-white hover:bg-[#2EBCFF]"
                    >
                      Open Site
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </QuestCard>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Filter & Passage Selector */}
          <QuestCard className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {(['ALL', 'BOOKMARKED', ...CEFR_LEVELS] as const).map((lvl) => {
                  const isActive = cefrFilter === lvl;
                  const label =
                    lvl === 'BOOKMARKED' ? `Saved (${bookmarkedContentIds.length})` : lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCefrFilter(lvl)}
                      className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                        isActive
                          ? 'border-[#C99600] bg-[#FFC800] text-[#3C3C3C]'
                          : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#555555] hover:bg-[#EFEFEF]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  aria-label="Filter reading category"
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as 'ALL' | ReadingPassage['category'])
                  }
                  className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-extrabold text-[#3C3C3C] focus:border-[#FFC800] focus:outline-none"
                >
                  <option value="ALL">All Genres ({allPassages.length})</option>
                  {categoriesAvailable.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat] ?? cat}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-[#888888]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search title or topic..."
                    className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white py-1.5 pr-3 pl-8 text-xs font-bold text-[#3C3C3C] focus:border-[#FFC800] focus:outline-none sm:w-52"
                  />
                </div>
              </div>
            </div>

            {passagesLoading ? (
              <p className="text-xs font-bold text-[#777777]">
                Loading expanded Reading Academy catalog...
              </p>
            ) : filteredPassages.length === 0 ? (
              <p className="rounded-xl bg-[#F7F8FA] p-3 text-sm font-bold text-[#777777]">
                No reading passages match your current filters. Try clearing search or choosing ALL.
              </p>
            ) : (
              <div className="grid max-h-60 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPassages.map((p) => {
                  const selected = activePassage.id === p.id;
                  const done = completedSet.has(p.id);
                  const saved = bookmarkedContentIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPassage(p.id)}
                      className={`flex min-w-0 flex-col justify-between rounded-2xl border-2 p-3 text-left ${
                        selected
                          ? 'border-[#D9A600] bg-[#FFFBEB]'
                          : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="rounded-lg bg-[#FFF5CC] px-2 py-0.5 text-[11px] font-black text-[#8F6500]">
                          {p.cefrLevel} • {CATEGORY_LABELS[p.category] ?? p.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          {saved && <Bookmark className="h-3.5 w-3.5 fill-[#FFC800] text-[#D9A600]" />}
                          {done && <CheckCircle2 className="h-4 w-4 text-[#58CC02]" />}
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs font-black text-[#3C3C3C]">
                        {p.title}
                      </p>
                      <p className="mt-1 text-[11px] font-bold text-[#777777]">
                        {p.wordCount ?? countWordsInParagraphs(p.paragraphs)} words •{' '}
                        {p.questions.length} Qs
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </QuestCard>

          {/* Active Passage Workspace */}
          <QuestCard className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <PillBadge tone="gold">{activePassage.cefrLevel}</PillBadge>
                  <PillBadge tone="neutral">
                    {CATEGORY_LABELS[activePassage.category] ?? activePassage.category}
                  </PillBadge>
                  <PillBadge tone="blue">{passageWordCount} words</PillBadge>
                  <PillBadge tone="purple">
                    <Clock className="h-3 w-3" /> {Math.floor(elapsedSeconds / 60)}:
                    {String(elapsedSeconds % 60).padStart(2, '0')}
                  </PillBadge>
                  {submitted && estimatedWpm !== null && (
                    <PillBadge tone="green">~{estimatedWpm} WPM</PillBadge>
                  )}
                </div>
                <h2 className="mt-2.5 text-xl font-black text-[#3C3C3C] sm:text-2xl">
                  {activePassage.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-label="Bookmark passage"
                  onClick={() => toggleContentBookmark(activePassage.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                    bookmarkedContentIds.includes(activePassage.id)
                      ? 'border-[#D9A600] bg-[#FFF5CC] text-[#785300]'
                      : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
                  }`}
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      bookmarkedContentIds.includes(activePassage.id) ? 'fill-current' : ''
                    }`}
                  />
                  {bookmarkedContentIds.includes(activePassage.id) ? 'Saved' : 'Save'}
                </button>

                <button
                  type="button"
                  onClick={() => setHighlightMode((m) => !m)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                    highlightMode
                      ? 'border-[#D9A600] bg-[#FFC800] text-[#3C3C3C]'
                      : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
                  }`}
                >
                  <Highlighter className="h-4 w-4" />
                  {highlightMode ? 'Highlighting On' : 'Highlight'}
                </button>

                <div className="flex items-center rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-0.5">
                  <Type className="mx-1.5 h-3.5 w-3.5 text-[#777777]" />
                  {(['sm', 'base', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontScale(sz)}
                      className={`rounded-lg px-2 py-1 text-xs font-black uppercase ${
                        fontScale === sz ? 'bg-white text-[#3C3C3C] shadow-xs' : 'text-[#777777]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <TactileButton
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    speakText(activePassage.paragraphs.join(' '), {
                      accent: preferences.preferredAccent,
                    })
                  }
                >
                  <Volume2 className="h-4 w-4" />
                  Read Aloud
                </TactileButton>
              </div>
            </div>

            {activePassage.readingStrategy && (
              <div className="flex items-start gap-2.5 rounded-2xl border-2 border-[#E3F6FF] bg-[#F4FBFF] p-3 text-xs sm:text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#0E8BC9]" />
                <div>
                  <span className="font-black text-[#0C5E8A]">Reading Strategy: </span>
                  <span className="font-semibold text-[#3C3C3C]">
                    {activePassage.readingStrategy}
                  </span>
                </div>
              </div>
            )}

            {/* Passage Body */}
            <div className={`space-y-4 font-semibold text-[#3C3C3C] ${textSizeClass}`}>
              {activePassage.paragraphs.map((para, idx) => {
                const isLit = highlightedIndices.includes(idx);
                return (
                  <p
                    key={idx}
                    onClick={() => toggleParagraphHighlight(idx)}
                    className={`rounded-xl px-3 py-2 ${
                      highlightMode ? 'cursor-pointer hover:bg-[#FFFDF0]' : ''
                    } ${
                      isLit
                        ? 'border-l-4 border-[#FFC800] bg-[#FFFBEB]'
                        : 'border-l-4 border-transparent'
                    }`}
                  >
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Interactive Summary Prompt & Takeaways */}
            {activePassage.summaryPrompt && (
              <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#FAFAFA] p-4">
                <p className="flex items-center gap-1.5 text-xs font-black uppercase text-[#777777]">
                  <Sparkles className="h-4 w-4 text-[#8E3FD6]" />
                  One-Sentence Comprehension Summary Check
                </p>
                <p className="mt-1 text-sm font-bold text-[#3C3C3C]">
                  {activePassage.summaryPrompt}
                </p>
                <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={summaryDraft}
                    onChange={(e) => {
                      setSummaryDraft(e.target.value);
                      setSavedSummaryNotice(false);
                    }}
                    placeholder="Type one concise own-words takeaway..."
                    className="flex-1 rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-semibold text-[#3C3C3C] focus:border-[#8E3FD6] focus:outline-none"
                  />
                  <TactileButton
                    variant="outline"
                    size="sm"
                    disabled={summaryDraft.trim().length < 6}
                    onClick={() => setSavedSummaryNotice(true)}
                  >
                    Compare Takeaways
                  </TactileButton>
                </div>
                {savedSummaryNotice &&
                  activePassage.keyTakeaways &&
                  activePassage.keyTakeaways.length > 0 && (
                    <div className="mt-3 rounded-xl border border-[#D4B3FF] bg-[#FAF5FF] p-3 text-xs">
                      <p className="font-black text-[#6E26B5]">Key Text Takeaways:</p>
                      <ul className="mt-1 list-disc space-y-1 pl-4 font-semibold text-[#3C3C3C]">
                        {activePassage.keyTakeaways.map((kt) => (
                          <li key={kt}>{kt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Glossary Notebook Integration */}
            <div className="border-t border-[#E5E5E5] pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-wider text-[#777777]">
                  Interactive Glossary ({activePassage.glossary.length} terms — click Save for SM-2)
                </p>
                {savedToast && (
                  <span className="text-xs font-extrabold text-[#46A302]">{savedToast}</span>
                )}
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {activePassage.glossary.map((entry) => (
                  <div
                    key={entry.word}
                    className="flex flex-col justify-between rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-sm font-black text-[#3C3C3C]">{entry.word}</span>{' '}
                          <span className="text-xs font-bold text-[#777777]">{entry.ipa}</span>
                        </div>
                        <button
                          type="button"
                          aria-label={`Pronounce ${entry.word}`}
                          onClick={() =>
                            speakText(entry.word, { accent: preferences.preferredAccent })
                          }
                          className="rounded-lg bg-white p-1.5 text-[#0E8BC9] hover:bg-[#E3F6FF]"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-[#555555]">
                        ({entry.partOfSpeech}) {entry.definition}
                      </p>
                      {preferences.bilingualExplanations && (
                        <p className="mt-0.5 text-xs font-bold text-[#46A302]">
                          VI: {entry.vietnamese}
                        </p>
                      )}
                      <p className="mt-1 text-xs italic text-[#777777]">"{entry.example}"</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveGlossaryWord(entry)}
                      className="mt-2.5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#B8EE8A] bg-[#E9FCD9] px-3 py-1.5 text-xs font-black text-[#46A302] hover:bg-[#DCF9C5]"
                    >
                      <BookmarkPlus className="h-3.5 w-3.5" />
                      Save to Notebook
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </QuestCard>

          {/* Reading Comprehension Battery */}
          <div className="space-y-4">
            {activePassage.questions.map((q, i) => {
              const result = submitted ? evaluateExerciseAnswer(q, answers[q.id] ?? '') : null;
              return (
                <QuestCard key={q.id}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase text-[#777777]">
                      Question {i + 1} of {activePassage.questions.length}
                    </span>
                    <PillBadge tone="neutral">{q.questionStyle.replace(/_/g, ' ')}</PillBadge>
                  </div>
                  <ExerciseRenderer
                    exercise={q}
                    accent={preferences.preferredAccent}
                    speechRate={1.0}
                    disabled={submitted}
                    value={answers[q.id] ?? ''}
                    onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                  />
                  {result && (
                    <div
                      className={`mt-4 flex items-start gap-2.5 rounded-2xl border-2 p-3.5 text-sm ${
                        result.isCorrect
                          ? 'border-[#B8EE8A] bg-[#F2FDE9] text-[#2F6E01]'
                          : 'border-[#FFB8B8] bg-[#FFF0F0] text-[#9A1B1B]'
                      }`}
                    >
                      {result.isCorrect ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      )}
                      <div>
                        <p className="font-black">
                          {result.isCorrect
                            ? 'Accurate reading analysis!'
                            : `Expected answer: ${result.expectedDisplay}`}
                        </p>
                        <p className="mt-1 font-semibold">{q.explanation}</p>
                        {preferences.bilingualExplanations && q.explanationVi && (
                          <p className="mt-1 text-xs font-bold opacity-90">VI: {q.explanationVi}</p>
                        )}
                      </div>
                    </div>
                  )}
                </QuestCard>
              );
            })}
          </div>

          {!submitted ? (
            <div className="flex justify-end">
              <TactileButton variant="primary" size="lg" onClick={handleSubmit}>
                Check Comprehension ({activePassage.questions.length} Questions)
              </TactileButton>
            </div>
          ) : (
            <QuestCard className="border-[#58CC02] bg-[#F4FDEA]">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-black text-[#3C3C3C]">
                    Score: {correctTotal} / {activePassage.questions.length}
                  </h3>
                  <p className="text-sm font-bold text-[#46A302]">
                    {estimatedWpm !== null
                      ? `Completed in ${elapsedSeconds}s (~${estimatedWpm} words per minute).`
                      : `Completed cleanly in ${elapsedSeconds}s.`}{' '}
                    Any missed answers were saved automatically to your Mistake Review queue.
                  </p>
                </div>
                <TactileButton
                  variant="secondary"
                  onClick={() => {
                    const idx = filteredPassages.findIndex((p) => p.id === activePassage.id);
                    const next =
                      filteredPassages[(idx + 1) % Math.max(1, filteredPassages.length)] ??
                      activePassage;
                    handleSelectPassage(next.id);
                  }}
                >
                  Practice Next Passage
                </TactileButton>
              </div>
            </QuestCard>
          )}

          <HonestNotice
            title="Active Reading Calibration"
            description="Timer-based WPM estimates measure your dwell window on the active passage and help build fluent scanning endurance alongside careful critical analysis."
          />
        </div>
      )}
    </div>
  );
}
