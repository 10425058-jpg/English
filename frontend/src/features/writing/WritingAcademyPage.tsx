import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Bookmark,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Eye,
  GitCompare,
  Layers,
  PenTool,
  Search,
  Send,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  evaluateExerciseAnswer,
  type CEFRLevel,
  type WritingLesson,
  type WritingSubmission,
} from '@english-quest/shared';
import { CEFR_LEVELS, loadAllWriting } from '@content/index';
import { HonestNotice, PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { WRITING_LAB_PROMPTS } from '@/data/writingPromptsData';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone } from '@/services/speechService';
import {
  analyzeWritingLocally,
  countWords,
  type WritingPromptItem,
} from '@/services/writingAnalyzer';
import { useQuestStore } from '@/stores/useQuestStore';

const WRITING_CATEGORY_LABELS: Record<string, string> = {
  sentence_construction: 'Sentence Craft',
  grammar_correction: 'Clarity & Editing',
  sentence_transformation: 'Syntax Rewriting',
  paragraph: 'Paragraphs',
  email: 'Emails & Letters',
  story: 'Stories',
  argumentative_essay: 'Opinion / Argument',
  academic_essay: 'Academic Essay',
  report: 'Reports & Briefs',
  synthesis: 'Synthesis Memos',
  ielts_task_1: 'IELTS Task 1',
  ielts_task_2: 'IELTS Task 2',
  practical_email: 'Practical Email',
  ielts_academic: 'IELTS Writing',
  opinion_essay: 'Opinion Essay',
  narrative: 'Narrative',
  workplace_memo: 'Workplace Memo',
};

function mapCorePromptToLesson(p: WritingPromptItem): WritingLesson {
  return {
    id: p.id,
    title: p.title,
    category: p.category as WritingLesson['category'],
    cefrLevel: p.cefrLevel,
    prompt: p.prompt,
    instructions: p.instructions,
    objectives: [`Practice ${p.category.replace(/_/g, ' ')} at ${p.cefrLevel} level.`],
    modelOutline: ['1. Clear opening purpose or thesis', '2. Developed main points', '3. Concise natural closing'],
    usefulVocabulary: [],
    usefulStructures: [],
    minWords: p.minWords,
    targetWords: p.targetWords,
    checklist: p.checklist,
    rubric: [
      { criterion: 'Task Fulfillment', description: 'Addresses every instruction element clearly.' },
      { criterion: 'Language Clarity', description: 'Maintains coherent register and accurate grammar.' },
    ],
    commonMistakes: [],
    sampleResponse: p.sampleResponse,
    annotatedModelNotes: ['Core baseline model response aligned with key checklist items cleanly.'],
    practiceExercises: [],
  };
}

function toAnalyzerPrompt(lesson: WritingLesson): WritingPromptItem {
  const mappedCategory =
    lesson.category === 'report' || lesson.category === 'synthesis'
      ? 'academic_essay'
      : lesson.category;
  return {
    id: lesson.id,
    title: lesson.title,
    category: mappedCategory as WritingPromptItem['category'],
    cefrLevel: lesson.cefrLevel,
    prompt: lesson.prompt,
    instructions: lesson.instructions,
    minWords: lesson.minWords,
    targetWords: lesson.targetWords,
    checklist: lesson.checklist,
    sampleResponse: lesson.sampleResponse,
  };
}

export function WritingAcademyPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const writingDrafts = useQuestStore((s) => s.writingDrafts);
  const writingSubmissions = useQuestStore((s) => s.writingSubmissions);
  const saveWritingDraft = useQuestStore((s) => s.saveWritingDraft);
  const submitWriting = useQuestStore((s) => s.submitWriting);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);
  const bookmarkedContentIds = useQuestStore((s) => s.bookmarkedContentIds ?? []);
  const toggleContentBookmark = useQuestStore((s) => s.toggleContentBookmark);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds ?? []);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);

  const coreLessons = useMemo(
    () => WRITING_LAB_PROMPTS.map(mapCorePromptToLesson),
    []
  );

  const { data: expandedLessons = [], isLoading: expandedLoading } = useQuery({
    queryKey: ['writing-academy-all'],
    queryFn: loadAllWriting,
    staleTime: Infinity,
  });

  const allLessons: WritingLesson[] = useMemo(
    () => [...coreLessons, ...expandedLessons],
    [coreLessons, expandedLessons]
  );

  const [cefrFilter, setCefrFilter] = useState<'ALL' | 'BOOKMARKED' | CEFRLevel>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(coreLessons[0].id);

  const [toolkitTab, setToolkitTab] = useState<'outline' | 'vocab' | 'drills' | 'compare'>('outline');
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string | string[]>>({});
  const [drillsChecked, setDrillsChecked] = useState(false);

  const [text, setText] = useState(() => writingDrafts[coreLessons[0].id]?.text ?? '');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [showSample, setShowSample] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState<WritingSubmission['feedback'] | null>(null);

  const completedSet = useMemo(() => {
    const ids = new Set<string>(completedAcademyIds);
    for (const sub of writingSubmissions) ids.add(sub.promptId);
    return ids;
  }, [completedAcademyIds, writingSubmissions]);

  const categoriesAvailable = useMemo(() => {
    const set = new Set<string>();
    for (const l of allLessons) set.add(l.category);
    return Array.from(set);
  }, [allLessons]);

  const filteredLessons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allLessons.filter((lesson) => {
      if (cefrFilter === 'BOOKMARKED' && !bookmarkedContentIds.includes(lesson.id)) return false;
      if (cefrFilter !== 'ALL' && cefrFilter !== 'BOOKMARKED' && lesson.cefrLevel !== cefrFilter) {
        return false;
      }
      if (categoryFilter !== 'ALL' && lesson.category !== categoryFilter) return false;
      if (
        q &&
        !lesson.title.toLowerCase().includes(q) &&
        !lesson.prompt.toLowerCase().includes(q) &&
        !lesson.category.replace(/_/g, ' ').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [allLessons, bookmarkedContentIds, categoryFilter, cefrFilter, searchQuery]);

  const activeLesson =
    allLessons.find((l) => l.id === selectedId) ?? filteredLessons[0] ?? coreLessons[0];

  const priorSubmissions = useMemo(
    () => writingSubmissions.filter((s) => s.promptId === activeLesson.id),
    [activeLesson.id, writingSubmissions]
  );

  const words = countWords(text);

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeLesson.id]);

  const handleSelectLesson = (id: string) => {
    setSelectedId(id);
    setText(writingDrafts[id]?.text ?? '');
    setElapsedSeconds(0);
    setCheckedItems({});
    setLatestFeedback(null);
    setShowSample(false);
    setDrillAnswers({});
    setDrillsChecked(false);
  };

  const handleTextChange = (nextText: string) => {
    setText(nextText);
    saveWritingDraft(activeLesson.id, nextText);
  };

  const handleCheckDrills = () => {
    if (!activeLesson.practiceExercises?.length || drillsChecked) return;
    let correct = 0;
    for (const ex of activeLesson.practiceExercises) {
      const res = evaluateExerciseAnswer(ex, drillAnswers[ex.id] ?? '');
      if (res.isCorrect) {
        correct += 1;
      } else {
        recordMistake({
          source: 'writing',
          skill: 'writing',
          cefrLevel: activeLesson.cefrLevel,
          prompt: ex.prompt,
          userAnswer: res.normalizedUserAnswer || '(no answer)',
          expectedAnswer: res.expectedDisplay,
          explanation: ex.explanation,
          explanationVi: ex.explanationVi,
        });
      }
    }
    awardActivityXp({
      idempotencyKey: createAttemptKey('writing-drills', activeLesson.id),
      amount: Math.max(10, correct * 8),
      source: 'writing',
      referenceId: `${activeLesson.id}-drills`,
      skill: 'writing',
      minutes: 2,
      correctDelta: correct,
      attemptsDelta: activeLesson.practiceExercises.length,
    });
    playFeedbackTone(
      correct === activeLesson.practiceExercises.length ? 'celebrate' : 'correct',
      preferences.soundEffects
    );
    setDrillsChecked(true);
  };

  const handleSubmitDraft = () => {
    if (words < 8) return;
    const analyzerInput = toAnalyzerPrompt(activeLesson);
    const feedback = analyzeWritingLocally(analyzerInput, text);
    submitWriting({
      promptId: activeLesson.id,
      title: activeLesson.title,
      category: activeLesson.category,
      cefrLevel: activeLesson.cefrLevel,
      originalText: text,
      wordCount: words,
      durationSeconds: elapsedSeconds,
      feedback,
    });
    markAcademyCompleted(activeLesson.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('writing', activeLesson.id),
      amount: words >= activeLesson.minWords ? 30 : 18,
      source: 'writing',
      referenceId: activeLesson.id,
      skill: 'writing',
      minutes: Math.max(2, Math.round(elapsedSeconds / 60)),
      correctDelta: 1,
      attemptsDelta: 1,
    });
    playFeedbackTone('celebrate', preferences.soundEffects);
    setLatestFeedback(feedback);
  };

  const completedCount = allLessons.filter((l) => completedSet.has(l.id)).length;
  const previousSubmission = priorSubmissions[0] ?? null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">
      {/* Header */}
      <QuestCard className="border-[#E5D4FF] bg-gradient-to-br from-[#FBF6FF] via-white to-[#F4FBFF]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="purple">Writing Academy A1–C2</PillBadge>
              <PillBadge tone="green">
                {completedCount} / {allLessons.length} Completed
              </PillBadge>
            </div>
            <h1 className="mt-2 text-2xl font-black text-[#3C3C3C] sm:text-3xl">
              Structured Writing & Academic Composition Studio
            </h1>
            <p className="mt-1 text-sm font-semibold text-[#666666]">
              Explore {allLessons.length} leveled tasks across emails, paragraphs, reports, and
              IELTS Academic prompts with sentence-craft warm-up drills, rubrics, and revision
              comparison.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PillBadge tone="gold">Drafts Autosaved Locally</PillBadge>
          </div>
        </div>
        <div className="mt-4">
          <QuestProgressBar
            value={completedCount}
            max={Math.max(1, allLessons.length)}
            color="#8E3FD6"
            label="Writing Academy progress"
          />
        </div>
      </QuestCard>

      {/* Filter & Lesson Picker */}
      <QuestCard className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(['ALL', 'BOOKMARKED', ...CEFR_LEVELS] as const).map((lvl) => {
              const isActive = cefrFilter === lvl;
              const label = lvl === 'BOOKMARKED' ? `Saved (${bookmarkedContentIds.length})` : lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCefrFilter(lvl)}
                  className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                    isActive
                      ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
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
              aria-label="Filter writing genre"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-extrabold text-[#3C3C3C] focus:border-[#8E3FD6] focus:outline-none"
            >
              <option value="ALL">All Tasks ({allLessons.length})</option>
              {categoriesAvailable.map((cat) => (
                <option key={cat} value={cat}>
                  {WRITING_CATEGORY_LABELS[cat] ?? cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-[#888888]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search writing prompt..."
                className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white py-1.5 pr-3 pl-8 text-xs font-bold text-[#3C3C3C] focus:border-[#8E3FD6] focus:outline-none sm:w-52"
              />
            </div>
          </div>
        </div>

        {expandedLoading ? (
          <p className="text-xs font-bold text-[#777777]">Loading full A1–C2 writing curriculum...</p>
        ) : filteredLessons.length === 0 ? (
          <p className="rounded-xl bg-[#F7F8FA] p-3 text-sm font-bold text-[#777777]">
            No writing tasks match your filter criteria.
          </p>
        ) : (
          <div className="grid max-h-60 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson) => {
              const selected = activeLesson.id === lesson.id;
              const done = completedSet.has(lesson.id);
              const saved = bookmarkedContentIds.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleSelectLesson(lesson.id)}
                  className={`flex min-w-0 flex-col justify-between rounded-2xl border-2 p-3 text-left ${
                    selected
                      ? 'border-[#8E3FD6] bg-[#FAF5FF]'
                      : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="rounded-lg bg-[#F5E8FF] px-2 py-0.5 text-[11px] font-black text-[#6E26B5]">
                      {lesson.cefrLevel} •{' '}
                      {WRITING_CATEGORY_LABELS[lesson.category] ?? lesson.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      {saved && <Bookmark className="h-3.5 w-3.5 fill-[#8E3FD6] text-[#8E3FD6]" />}
                      {done && <CheckCircle2 className="h-4 w-4 text-[#58CC02]" />}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs font-black text-[#3C3C3C]">
                    {lesson.title}
                  </p>
                  <p className="mt-1 text-[11px] font-bold text-[#777777]">
                    Target {lesson.minWords}–{lesson.targetWords} words
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </QuestCard>

      {/* Active Task Header & Toolkit Tabs */}
      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="purple">{activeLesson.cefrLevel}</PillBadge>
              <PillBadge tone="neutral">
                {WRITING_CATEGORY_LABELS[activeLesson.category] ?? activeLesson.category}
              </PillBadge>
              <PillBadge tone="blue">Target: {activeLesson.minWords}–{activeLesson.targetWords}w</PillBadge>
              <PillBadge tone="gold">
                <Clock className="h-3 w-3" /> {Math.floor(elapsedSeconds / 60)}:
                {String(elapsedSeconds % 60).padStart(2, '0')}
              </PillBadge>
            </div>
            <h2 className="mt-2 text-xl font-black text-[#3C3C3C]">{activeLesson.title}</h2>
            <p className="mt-1.5 text-sm font-bold text-[#444444]">{activeLesson.prompt}</p>
            <p className="mt-1 text-xs font-semibold text-[#666666]">{activeLesson.instructions}</p>
          </div>

          <button
            type="button"
            onClick={() => toggleContentBookmark(activeLesson.id)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              bookmarkedContentIds.includes(activeLesson.id)
                ? 'border-[#6E26B5] bg-[#F5E8FF] text-[#6E26B5]'
                : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
            }`}
          >
            <Bookmark
              className={`h-4 w-4 ${
                bookmarkedContentIds.includes(activeLesson.id) ? 'fill-current' : ''
              }`}
            />
            {bookmarkedContentIds.includes(activeLesson.id) ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Sub-Toolkit Selector */}
        <div className="flex flex-wrap gap-2 border-t border-[#F0F0F0] pt-3">
          <button
            type="button"
            onClick={() => setToolkitTab('outline')}
            className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              toolkitTab === 'outline'
                ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#555555]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Outline & Rubric
          </button>
          <button
            type="button"
            onClick={() => setToolkitTab('vocab')}
            className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              toolkitTab === 'vocab'
                ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#555555]'
            }`}
          >
            <BookOpenCheck className="h-3.5 w-3.5" />
            Vocab & Frames
          </button>
          <button
            type="button"
            onClick={() => setToolkitTab('drills')}
            className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              toolkitTab === 'drills'
                ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#555555]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Pre-Draft Drills ({activeLesson.practiceExercises?.length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => setToolkitTab('compare')}
            className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              toolkitTab === 'compare'
                ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#555555]'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            Revision Compare ({priorSubmissions.length})
          </button>
        </div>

        {/* Toolkit Panel */}
        {toolkitTab === 'outline' && (
          <div className="grid gap-4 rounded-2xl bg-[#F7F8FA] p-4 sm:grid-cols-2">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-black uppercase text-[#6E26B5]">Model Outline</p>
                <ul className="mt-1.5 space-y-1 text-xs font-bold text-[#3C3C3C]">
                  {activeLesson.modelOutline.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              {activeLesson.objectives.length > 0 && (
                <div>
                  <p className="text-xs font-black uppercase text-[#0E8BC9]">Skill Goals</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-xs font-semibold text-[#555555]">
                    {activeLesson.objectives.map((obj) => (
                      <li key={obj}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-black uppercase text-[#46A302]">Assessment Rubric</p>
                <div className="mt-1.5 space-y-1.5">
                  {activeLesson.rubric.map((r) => (
                    <div key={r.criterion} className="rounded-xl bg-white p-2.5 text-xs">
                      <span className="font-black text-[#3C3C3C]">{r.criterion}: </span>
                      <span className="font-semibold text-[#555555]">{r.description}</span>
                    </div>
                  ))}
                </div>
              </div>
              {activeLesson.commonMistakes.length > 0 && (
                <div>
                  <p className="flex items-center gap-1 text-xs font-black uppercase text-[#D32F2F]">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Common Mistakes to Avoid
                  </p>
                  <div className="mt-1.5 space-y-1.5">
                    {activeLesson.commonMistakes.map((m) => (
                      <div key={m.issue} className="rounded-xl border border-[#FFD6D6] bg-white p-2.5 text-xs">
                        <p className="font-bold text-[#9A1B1B]">Avoid: {m.issue}</p>
                        <p className="mt-0.5 font-bold text-[#2F6E01]">Better: {m.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {toolkitTab === 'vocab' && (
          <div className="grid gap-4 rounded-2xl bg-[#F7F8FA] p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase text-[#46A302]">
                High-Value Vocabulary (click to insert into draft)
              </p>
              <div className="mt-2 space-y-2">
                {activeLesson.usefulVocabulary.map((v) => (
                  <button
                    key={v.term}
                    type="button"
                    onClick={() =>
                      handleTextChange(text ? `${text.trimEnd()} ${v.term}` : v.term)
                    }
                    className="block w-full rounded-xl border border-[#E5E5E5] bg-white p-2.5 text-left text-xs hover:border-[#58CC02]"
                  >
                    <span className="font-black text-[#3C3C3C]">{v.term}</span> —{' '}
                    <span className="font-semibold text-[#555555]">{v.meaning}</span>
                    {preferences.bilingualExplanations && v.vietnamese !== v.meaning && (
                      <span className="mt-0.5 block font-bold text-[#46A302]">
                        VI: {v.vietnamese}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[#0E8BC9]">Useful Sentence Frames</p>
              <div className="mt-2 space-y-2">
                {activeLesson.usefulStructures.map((s) => (
                  <div key={s.pattern} className="rounded-xl border border-[#E5E5E5] bg-white p-2.5 text-xs">
                    <p className="font-black text-[#0C5E8A]">{s.pattern}</p>
                    <p className="mt-1 italic text-[#555555]">e.g., "{s.example}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {toolkitTab === 'drills' && (
          <div className="space-y-3 rounded-2xl bg-[#F7F8FA] p-4">
            {!activeLesson.practiceExercises?.length ? (
              <p className="text-xs font-bold text-[#777777]">
                This foundational prompt opens directly into guided composition below.
              </p>
            ) : (
              <>
                {activeLesson.practiceExercises.map((ex, i) => {
                  const res = drillsChecked
                    ? evaluateExerciseAnswer(ex, drillAnswers[ex.id] ?? '')
                    : null;
                  return (
                    <div key={ex.id} className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
                      <p className="mb-2 text-xs font-black uppercase text-[#777777]">
                        Drill {i + 1} of {activeLesson.practiceExercises?.length}
                      </p>
                      <ExerciseRenderer
                        exercise={ex}
                        accent={preferences.preferredAccent}
                        speechRate={1.0}
                        disabled={drillsChecked}
                        value={drillAnswers[ex.id] ?? ''}
                        onChange={(val) =>
                          setDrillAnswers((prev) => ({ ...prev, [ex.id]: val }))
                        }
                      />
                      {res && (
                        <div
                          className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs ${
                            res.isCorrect
                              ? 'border-[#B8EE8A] bg-[#F2FDE9] text-[#2F6E01]'
                              : 'border-[#FFB8B8] bg-[#FFF0F0] text-[#9A1B1B]'
                          }`}
                        >
                          {res.isCorrect ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                          ) : (
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          )}
                          <div>
                            <p className="font-black">
                              {res.isCorrect
                                ? 'Spot-on structure!'
                                : `Expected: ${res.expectedDisplay}`}
                            </p>
                            <p className="mt-0.5 font-semibold">{ex.explanation}</p>
                            {preferences.bilingualExplanations && ex.explanationVi && (
                              <p className="mt-0.5 font-bold opacity-90">VI: {ex.explanationVi}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!drillsChecked ? (
                  <TactileButton variant="purple" size="sm" onClick={handleCheckDrills}>
                    Verify Pre-Draft Drills
                  </TactileButton>
                ) : (
                  <TactileButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDrillAnswers({});
                      setDrillsChecked(false);
                    }}
                  >
                    Reset Drills
                  </TactileButton>
                )}
              </>
            )}
          </div>
        )}

        {toolkitTab === 'compare' && (
          <div className="rounded-2xl bg-[#F7F8FA] p-4">
            {!previousSubmission ? (
              <p className="text-xs font-bold text-[#777777]">
                Submit your first draft below to unlock side-by-side v1 vs v2 revision comparison!
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                  <div className="flex items-center justify-between text-xs font-black text-[#777777]">
                    <span>Previous Submitted Draft (v1)</span>
                    <span>{previousSubmission.wordCount} words</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-xs font-semibold text-[#555555]">
                    {previousSubmission.originalText}
                  </p>
                </div>
                <div className="rounded-xl border border-[#8E3FD6] bg-white p-3">
                  <div className="flex items-center justify-between text-xs font-black text-[#6E26B5]">
                    <span>Current Live Revision (v2)</span>
                    <span>
                      {words} words ({words - previousSubmission.wordCount >= 0 ? '+' : ''}
                      {words - previousSubmission.wordCount})
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-xs font-semibold text-[#3C3C3C]">
                    {text || '(Empty editor — edit below to compare live changes!)'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </QuestCard>

      {/* Main Compose Area + Self-Checklist */}
      <div className="grid gap-5 lg:grid-cols-3">
        <QuestCard className="space-y-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="writing-academy-editor"
              className="flex items-center gap-2 text-sm font-black text-[#3C3C3C]"
            >
              <PenTool className="h-4 w-4 text-[#8E3FD6]" />
              Drafting Canvas
            </label>
            <div className="flex items-center gap-2">
              <PillBadge tone={words >= activeLesson.minWords ? 'green' : 'neutral'}>
                {words} / {activeLesson.minWords} min words
              </PillBadge>
            </div>
          </div>

          <QuestProgressBar
            value={words}
            max={activeLesson.targetWords}
            color={words >= activeLesson.minWords ? '#58CC02' : '#CE82FF'}
            heightClass="h-2.5"
            label="Draft word count target"
          />

          <textarea
            id="writing-academy-editor"
            rows={11}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Write calmly here following your selected outline and clear linking expressions..."
            className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#FAFAFA] p-4 text-sm font-semibold leading-6 text-[#3C3C3C] focus:border-[#8E3FD6] focus:bg-white focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <TactileButton
              variant="outline"
              size="sm"
              onClick={() => setShowSample((s) => !s)}
            >
              <Eye className="h-4 w-4" />
              {showSample ? 'Hide Annotated Model' : 'Show Annotated Model'}
            </TactileButton>

            <TactileButton
              variant="primary"
              size="md"
              disabled={words < 8}
              onClick={handleSubmitDraft}
            >
              <Send className="h-4 w-4" />
              Submit & Analyze Locally
            </TactileButton>
          </div>
        </QuestCard>

        {/* Self-Edit Checklist */}
        <QuestCard className="space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-[#777777]">
            Self-Revision Checklist
          </p>
          <div className="space-y-2">
            {activeLesson.checklist.map((item, idx) => {
              const checked = Boolean(checkedItems[idx]);
              return (
                <label
                  key={item}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border-2 p-2.5 text-xs font-bold ${
                    checked
                      ? 'border-[#B8EE8A] bg-[#F2FDE9] text-[#2F6E01]'
                      : 'border-[#E5E5E5] bg-white text-[#444444]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setCheckedItems((prev) => ({ ...prev, [idx]: e.target.checked }))
                    }
                    className="mt-0.5 h-4 w-4 accent-[#58CC02]"
                  />
                  <span>{item}</span>
                </label>
              );
            })}
          </div>
          <p className="rounded-xl bg-[#F7F8FA] p-2.5 text-[11px] font-semibold text-[#666666]">
            Check off each revision check carefully before clicking Submit, then revisit Revision
            Compare above to inspect improvements.
          </p>
        </QuestCard>
      </div>

      {/* Annotated Model Reveal */}
      {showSample && (
        <QuestCard className="border-[#8E3FD6] bg-[#FAF5FF]">
          <p className="text-xs font-black uppercase text-[#6E26B5]">Annotated Sample Response</p>
          <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-7 text-[#3C3C3C]">
            {activeLesson.sampleResponse}
          </p>
          {activeLesson.annotatedModelNotes.length > 0 && (
            <div className="mt-3 border-t border-[#E5D4FF] pt-3">
              <p className="text-xs font-black text-[#6E26B5]">Why this response works:</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs font-bold text-[#4A2D6E]">
                {activeLesson.annotatedModelNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </QuestCard>
      )}

      {/* Local Heuristic Feedback Result */}
      {latestFeedback && (
        <QuestCard className="border-[#58CC02] bg-[#F4FDEA] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-black text-[#3C3C3C]">Local Revision Feedback</h3>
            {latestFeedback.estimatedPracticeIndicator && (
              <PillBadge tone="green">{latestFeedback.estimatedPracticeIndicator}</PillBadge>
            )}
          </div>
          {latestFeedback.strengths.length > 0 && (
            <div>
              <p className="text-xs font-black uppercase text-[#46A302]">Observed Strengths</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs font-bold text-[#2F6E01]">
                {latestFeedback.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {latestFeedback.improvements.length > 0 && (
            <div>
              <p className="text-xs font-black uppercase text-[#0E8BC9]">Revision Opportunities</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs font-semibold text-[#3C3C3C]">
                {latestFeedback.improvements.map((imp) => (
                  <li key={imp}>{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </QuestCard>
      )}

      <HonestNotice
        title="Honest Local Feedback Notice"
        description="Draft checks use deterministic local word, structure, and mechanical heuristics only—useful for quick self-editing, not official human or IELTS examiner grading."
      />
    </div>
  );
}
