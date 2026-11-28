import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bookmark,
  CheckCircle2,
  Ear,
  RotateCcw,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  evaluateExerciseAnswer,
  type CEFRLevel,
  type EnglishAccent,
  type PronunciationCategory,
  type PronunciationLesson,
} from '@english-quest/shared';
import { CEFR_LEVELS, loadPronunciationLessons } from '@content/index';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone, speakText } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function PronunciationTab() {
  const preferences = useQuestStore((s) => s.preferences);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);
  const bookmarkedContentIds = useQuestStore((s) => s.bookmarkedContentIds ?? []);
  const toggleContentBookmark = useQuestStore((s) => s.toggleContentBookmark);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds ?? []);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);

  const [cefrFilter, setCefrFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [catFilter, setCatFilter] = useState<'ALL' | PronunciationCategory>('ALL');
  const [accent, setAccent] = useState<EnglishAccent>(preferences.preferredAccent);
  const [speed, setSpeed] = useState<number>(0.9);
  const [selectedId, setSelectedId] = useState<string>('pro-m2-01');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['pronunciation-lessons'],
    queryFn: loadPronunciationLessons,
    staleTime: Infinity,
  });

  const categories = useMemo(() => {
    const s = new Set<PronunciationCategory>();
    for (const l of lessons) s.add(l.category);
    return Array.from(s);
  }, [lessons]);

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (cefrFilter !== 'ALL' && l.cefrLevel !== cefrFilter) return false;
      if (catFilter !== 'ALL' && l.category !== catFilter) return false;
      return true;
    });
  }, [catFilter, cefrFilter, lessons]);

  const active: PronunciationLesson | undefined =
    lessons.find((l) => l.id === selectedId) ?? filtered[0] ?? lessons[0];

  const handleSelectLesson = (id: string) => {
    setSelectedId(id);
    setAnswers({});
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!active || submitted) return;
    let correct = 0;
    for (const ex of active.listeningExercises) {
      const res = evaluateExerciseAnswer(ex, answers[ex.id] ?? '');
      if (res.isCorrect) {
        correct += 1;
      } else {
        recordMistake({
          source: 'lesson',
          skill: 'speaking',
          cefrLevel: active.cefrLevel,
          prompt: ex.prompt,
          userAnswer: res.normalizedUserAnswer || '(no answer)',
          expectedAnswer: res.expectedDisplay,
          explanation: ex.explanation,
          explanationVi: ex.explanationVi,
        });
      }
    }
    setSubmitted(true);
    markAcademyCompleted(active.id);
    playFeedbackTone(
      correct === active.listeningExercises.length ? 'celebrate' : 'correct',
      preferences.soundEffects
    );
    awardActivityXp({
      idempotencyKey: createAttemptKey('pronunciation', active.id),
      amount: 12 + correct * 4,
      source: 'speaking',
      referenceId: active.id,
      skill: 'speaking',
      minutes: 3,
      correctDelta: correct,
      attemptsDelta: active.listeningExercises.length,
    });
  };

  if (isLoading && lessons.length === 0) {
    return <p className="text-sm font-bold text-[#8E3FD6]">Loading Pronunciation Academy...</p>;
  }

  if (!active) return null;

  const isBookmarked = bookmarkedContentIds.includes(active.id);

  return (
    <div className="space-y-5">
      <HonestNotice
        title="Pronunciation Practice Scope"
        description="Minimal-pair playback uses your device Web Speech Synthesis voices. Compare UK/US sounds side-by-side and listen carefully for subtle vowel length, lip shape, and voiced vibration cues."
      />

      {/* Filters */}
      <QuestCard className="space-y-3 bg-[#F7F8FA]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(['ALL', ...CEFR_LEVELS] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setCefrFilter(lvl)}
                className={`rounded-xl border-2 border-b-4 px-3 py-1 text-xs font-black ${
                  cefrFilter === lvl
                    ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                {lvl === 'ALL' ? `All (${lessons.length})` : lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {(['en-US', 'en-GB'] as EnglishAccent[]).map((acc) => (
              <button
                key={acc}
                type="button"
                onClick={() => setAccent(acc)}
                className={`rounded-xl border-2 px-3 py-1 text-xs font-black ${
                  accent === acc
                    ? 'border-[#1CB0F6] bg-[#1CB0F6] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                {acc === 'en-GB' ? 'UK Voice' : 'US Voice'}
              </button>
            ))}
            {[0.7, 0.9, 1.0].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSpeed(r)}
                className={`rounded-xl border-2 px-2.5 py-1 text-xs font-black ${
                  speed === r
                    ? 'border-[#46A302] bg-[#58CC02] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCatFilter('ALL')}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-extrabold ${
              catFilter === 'ALL'
                ? 'border-[#8E3FD6] bg-[#F5E8FF] text-[#8E3FD6]'
                : 'border-[#E5E5E5] bg-white text-[#666666]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-extrabold capitalize ${
                catFilter === cat
                  ? 'border-[#8E3FD6] bg-[#F5E8FF] text-[#8E3FD6]'
                  : 'border-[#E5E5E5] bg-white text-[#666666]'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </QuestCard>

      {/* Selector Grid */}
      <div className="grid max-h-[260px] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const isSel = item.id === active.id;
          const isDone = completedAcademyIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectLesson(item.id)}
              className={`rounded-2xl border-2 border-b-4 p-3 text-left transition ${
                isSel
                  ? 'border-[#CE82FF] bg-[#F5E8FF]'
                  : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase text-[#8E3FD6]">
                  {item.cefrLevel} • {item.targetSymbols.join(' ')}
                </span>
                {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-[#58CC02]" />}
              </div>
              <p className="mt-1 text-sm font-black text-[#3C3C3C]">{item.title}</p>
            </button>
          );
        })}
      </div>

      {/* Main Pronunciation Lesson Studio */}
      <QuestCard className="space-y-5 border-[#E5D4FF] bg-[#FDF9FF]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="purple">{active.cefrLevel}</PillBadge>
              {active.targetSymbols.map((sym) => (
                <span
                  key={sym}
                  className="rounded-lg border border-[#D8B4FE] bg-white px-2.5 py-0.5 text-xs font-black text-[#7E22CE]"
                >
                  {sym}
                </span>
              ))}
            </div>
            <h2 className="mt-1.5 text-xl font-black text-[#3C3C3C]">{active.title}</h2>
            {active.contrastSymbol && (
              <p className="text-xs font-bold text-[#666666]">{active.contrastSymbol}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => toggleContentBookmark(active.id)}
            className={`inline-flex items-center gap-1 rounded-xl border-2 px-3 py-1 text-xs font-black ${
              isBookmarked
                ? 'border-[#FFC800] bg-[#FFF8DB] text-[#9A6E00]'
                : 'border-[#E5E5E5] bg-white text-[#555555]'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-[#FFC800]' : ''}`} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 text-sm">
            <p className="text-xs font-black uppercase text-[#0E8BC9]">Mouth & Articulation Guide</p>
            <p className="mt-1.5 font-semibold text-[#3C3C3C]">{active.articulatoryGuide}</p>
          </div>
          <div className="rounded-2xl border-2 border-[#A5ED6E] bg-[#F5FFE8] p-4 text-sm">
            <p className="flex items-center gap-1.5 text-xs font-black uppercase text-[#46A302]">
              <Sparkles className="h-3.5 w-3.5" />
              Vietnamese Learner Breakthrough
            </p>
            <p className="mt-1.5 font-semibold text-[#3C3C3C]">{active.vietnameseLearnerTip}</p>
          </div>
        </div>

        {active.ukUsNote && (
          <p className="rounded-xl border border-[#BCE7FD] bg-[#F2FAFF] px-3.5 py-2 text-xs font-bold text-[#0C5E8A]">
            UK vs US Note: {active.ukUsNote}
          </p>
        )}

        {/* Minimal Pair Contrast Deck */}
        <div className="space-y-2.5">
          <p className="text-xs font-black uppercase text-[#777777]">
            Minimal Pair Audio Contrast (Tap Words to Hear Subtle Shift)
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {active.minimalPairs.map((pair) => (
              <div
                key={`${pair.wordA}-${pair.wordB}`}
                className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-3.5 space-y-2"
              >
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => speakText(pair.wordA, { accent, rate: speed })}
                    className="rounded-xl border-2 border-[#BCE7FD] bg-[#F2FAFF] p-2 text-center hover:bg-[#DDF4FF]"
                  >
                    <p className="font-black text-[#0E8BC9] flex items-center justify-center gap-1">
                      <Volume2 className="h-3.5 w-3.5" />
                      {pair.wordA}
                    </p>
                    <p className="text-[11px] font-bold text-[#666666]">{pair.ipaA}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => speakText(pair.wordB, { accent, rate: speed })}
                    className="rounded-xl border-2 border-[#E5D4FF] bg-[#FBF6FF] p-2 text-center hover:bg-[#F5E8FF]"
                  >
                    <p className="font-black text-[#8E3FD6] flex items-center justify-center gap-1">
                      <Volume2 className="h-3.5 w-3.5" />
                      {pair.wordB}
                    </p>
                    <p className="text-[11px] font-bold text-[#666666]">{pair.ipaB}</p>
                  </button>
                </div>
                <p className="text-xs font-semibold text-[#555555]">{pair.differenceNote}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Drill Words & Focus Sentences */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 space-y-2.5">
            <p className="text-xs font-black uppercase text-[#777777]">Practice Words</p>
            <div className="flex flex-wrap gap-2">
              {active.practiceWords.map((w) => (
                <button
                  key={w.word}
                  type="button"
                  onClick={() => speakText(w.word, { accent, rate: speed })}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-1.5 text-xs font-bold hover:border-[#CE82FF]"
                >
                  <Volume2 className="h-3.5 w-3.5 text-[#8E3FD6]" />
                  <span className="font-black text-[#3C3C3C]">{w.word}</span>
                  <span className="text-[#777777]">{w.ipa}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 space-y-2.5">
            <p className="text-xs font-black uppercase text-[#777777]">Focus Sentences</p>
            <div className="space-y-2">
              {active.practiceSentences.map((s) => (
                <div key={s.text} className="rounded-xl bg-[#F7F8FA] p-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => speakText(s.text, { accent, rate: speed })}
                      aria-label={`Play sentence: ${s.text}`}
                      className="mt-0.5 rounded-lg bg-[#E3F6FF] p-1 text-[#0E8BC9]"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <div>
                      <p className="font-black text-[#3C3C3C]">{s.text}</p>
                      <p className="font-semibold text-[#8E3FD6]">{s.focusHighlight}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </QuestCard>

      {/* Sound Discrimination Practice Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-black uppercase text-[#8E3FD6]">
            <Ear className="h-4 w-4" />
            Sound Discrimination Practice ({active.listeningExercises.length} Questions)
          </p>
          <TactileButton
            variant="outline"
            size="sm"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Quiz
          </TactileButton>
        </div>

        {active.listeningExercises.map((ex, idx) => {
          const result = submitted ? evaluateExerciseAnswer(ex, answers[ex.id] ?? '') : null;
          return (
            <QuestCard key={ex.id}>
              <p className="mb-2 text-xs font-black uppercase text-[#777777]">
                Drill {idx + 1} of {active.listeningExercises.length}
              </p>
              <ExerciseRenderer
                exercise={ex}
                accent={accent}
                speechRate={speed}
                disabled={submitted}
                value={answers[ex.id] ?? ''}
                onChange={(v) => setAnswers((prev) => ({ ...prev, [ex.id]: v }))}
              />
              {result && (
                <div
                  className={`mt-4 flex items-start gap-2.5 rounded-2xl border-2 p-3.5 text-sm ${
                    result.isCorrect
                      ? 'border-[#A5ED6E] bg-[#D7FFB8] text-[#2B6400]'
                      : 'border-[#FFB8B8] bg-[#FFDFE0] text-[#9E1C1C]'
                  }`}
                >
                  {result.isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <div>
                    <p className="font-black">
                      {result.isCorrect ? 'Spot-on ear!' : `Expected: ${result.expectedDisplay}`}
                    </p>
                    <p className="mt-0.5 font-semibold">{ex.explanation}</p>
                    {preferences.bilingualExplanations && ex.explanationVi && (
                      <p className="mt-0.5 text-xs font-bold opacity-85">VI: {ex.explanationVi}</p>
                    )}
                  </div>
                </div>
              )}
            </QuestCard>
          );
        })}

        {!submitted && (
          <div className="flex justify-end">
            <TactileButton variant="purple" size="lg" onClick={handleSubmit}>
              Check Sound Discrimination Answers
            </TactileButton>
          </div>
        )}
      </div>
    </div>
  );
}
