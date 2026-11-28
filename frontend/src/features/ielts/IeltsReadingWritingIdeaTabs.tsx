import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Eye, PenTool, Sparkles } from 'lucide-react';
import type {
  EnglishAccent,
  IELTSIdeaVocabTopic,
  IELTSPathway,
  IELTSReadingPassage,
  IELTSWritingTask,
} from '@english-quest/shared';
import {
  convertReadingRawToBand,
  evaluateExerciseAnswer,
  UNOFFICIAL_IELTS_NOTICE,
} from '@english-quest/shared';
import { PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone } from '@/services/speechService';
import { countWords } from '@/services/writingAnalyzer';
import { useQuestStore } from '@/stores/useQuestStore';
import { IeltsVisualRenderer } from './IeltsVisualRenderer';

interface ReadingTabProps {
  passages: IELTSReadingPassage[];
  pathway: IELTSPathway;
  accent: EnglishAccent;
  soundEffects: boolean;
}

export function IeltsReadingTab({ passages, pathway, accent, soundEffects }: ReadingTabProps) {
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);

  const [pathwayView, setPathwayView] = useState<'active' | 'all'>('active');
  const [selectedId, setSelectedId] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);

  const filtered = useMemo(() => {
    if (pathwayView === 'all') return passages;
    return passages.filter((p) => p.pathway === pathway);
  }, [passages, pathwayView, pathway]);

  const active = useMemo(
    () => filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? passages[0],
    [filtered, selectedId, passages]
  );

  if (!active) return null;

  const selectPassage = (id: string) => {
    setSelectedId(id);
    setAnswers({});
    setChecked(false);
  };

  const acBand30 = convertReadingRawToBand(30, 'academic', 40);
  const gtBand30 = convertReadingRawToBand(30, 'general_training', 40);
  const completedCount = passages.filter((p) => completedAcademyIds.includes(p.id)).length;

  const handleGrade = () => {
    if (checked) return;
    setChecked(true);
    let correct = 0;
    for (const ex of active.exercises) {
      const val = answers[ex.id] ?? '';
      const res = evaluateExerciseAnswer(ex, val);
      if (res.isCorrect) {
        correct += 1;
      } else {
        recordMistake({
          source: 'reading',
          skill: 'reading',
          cefrLevel: active.cefrTarget,
          prompt: ex.prompt,
          userAnswer: typeof val === 'string' ? val || '(blank)' : val.join(' '),
          expectedAnswer: res.expectedDisplay,
          explanation: ex.explanation,
          explanationVi: ex.explanationVi,
        });
      }
    }

    if (correct === active.exercises.length) {
      playFeedbackTone('celebrate', soundEffects);
    } else {
      playFeedbackTone(correct >= 3 ? 'correct' : 'wrong', soundEffects);
    }

    markAcademyCompleted(active.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('ielts-rd', active.id),
      amount: 20 + correct * 6,
      source: 'ielts',
      referenceId: active.id,
      skill: 'reading',
      minutes: 6,
      correctDelta: correct,
      attemptsDelta: active.exercises.length,
    });
  };

  return (
    <div className="space-y-4">
      <QuestCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black">
              IELTS Reading Academy ({filtered.length} {pathwayView === 'all' ? 'Total' : pathway === 'academic' ? 'Academic' : 'General Training'} Texts)
            </h2>
            <p className="text-xs font-semibold text-[#666666]">
              Official 40-mark distinction: 30/40 raw ≈ Academic Band {acBand30.toFixed(1)} vs GT Band {gtBand30.toFixed(1)} (unofficial reference).
            </p>
          </div>
          <PillBadge tone="green">{completedCount}/{passages.length} Completed</PillBadge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPathwayView('active')}
            className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              pathwayView === 'active'
                ? 'border-[#58CC02] bg-[#EEFFDF] text-[#357D00]'
                : 'border-[#E5E5E5] bg-white text-[#555555]'
            }`}
          >
            Current Pathway Only ({pathway === 'academic' ? '40 Academic' : '20 General Training'})
          </button>
          <button
            type="button"
            onClick={() => setPathwayView('all')}
            className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              pathwayView === 'all'
                ? 'border-[#58CC02] bg-[#EEFFDF] text-[#357D00]'
                : 'border-[#E5E5E5] bg-white text-[#555555]'
            }`}
          >
            Browse All Passages (60)
          </button>

          <select
            aria-label="Choose IELTS Reading Passage"
            value={active.id}
            onChange={(e) => selectPassage(e.target.value)}
            className="flex-1 min-w-[220px] rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-bold"
          >
            {filtered.map((p) => (
              <option key={p.id} value={p.id}>
                {completedAcademyIds.includes(p.id) ? '✓ ' : ''}
                {p.sectionLabel} • {p.title} ({p.cefrTarget})
              </option>
            ))}
          </select>
        </div>
      </QuestCard>

      {/* Split Reading Reader & Questions */}
      <div className="grid gap-4 lg:grid-cols-2 items-start">
        <QuestCard className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <PillBadge tone={active.pathway === 'academic' ? 'purple' : 'blue'}>
              <BookOpen className="h-3.5 w-3.5" />
              {active.pathway === 'academic' ? 'Academic' : 'General Training'}
            </PillBadge>
            <PillBadge tone="neutral">{active.sectionLabel}</PillBadge>
            <PillBadge tone="green">CEFR {active.cefrTarget}</PillBadge>
          </div>
          <h3 className="text-xl font-black">{active.title}</h3>
          <div className="space-y-3">
            {active.paragraphs.map((para) => (
              <div key={para.label} className="rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] p-3.5 space-y-1">
                <p className="text-xs font-black uppercase text-[#0E8BC9]">{para.label}</p>
                <p className="text-sm font-medium leading-relaxed text-[#3C3C3C]">{para.text}</p>
              </div>
            ))}
          </div>
        </QuestCard>

        <QuestCard className="space-y-4">
          <h4 className="text-base font-black">Question Suite ({active.exercises.length} Items)</h4>
          <div className="space-y-4">
            {active.exercises.map((ex, i) => {
              const exWithoutDupPassage = { ...ex, passage: undefined };
              const val = answers[ex.id] ?? '';
              const evalRes = checked ? evaluateExerciseAnswer(ex, val) : null;
              return (
                <div key={ex.id} className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-3.5 space-y-2.5">
                  <p className="text-xs font-black uppercase text-[#777777]">Question {i + 1}</p>
                  <ExerciseRenderer
                    exercise={exWithoutDupPassage}
                    accent={accent}
                    speechRate={1.0}
                    disabled={checked}
                    value={val}
                    onChange={(next) => setAnswers((prev) => ({ ...prev, [ex.id]: next }))}
                  />
                  {evalRes && (
                    <div
                      className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                        evalRes.isCorrect
                          ? 'border-[#C8F0A6] bg-[#EEFFDF] text-[#357D00]'
                          : 'border-[#FFD4D4] bg-[#FFF2F2] text-[#A91D1D]'
                      }`}
                    >
                      <p>{evalRes.isCorrect ? 'Correct!' : `Key: ${evalRes.expectedDisplay}`} — {ex.explanation}</p>
                      {ex.explanationVi && <p className="mt-1 opacity-85">{ex.explanationVi}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            {!checked ? (
              <TactileButton variant="primary" onClick={handleGrade}>
                Submit Passage Suite
              </TactileButton>
            ) : (
              <TactileButton
                variant="outline"
                onClick={() => {
                  setAnswers({});
                  setChecked(false);
                }}
              >
                Reset Questions
              </TactileButton>
            )}
          </div>
        </QuestCard>
      </div>
    </div>
  );
}

interface WritingTabProps {
  tasks: IELTSWritingTask[];
  pathway: IELTSPathway;
  accent: EnglishAccent;
  soundEffects: boolean;
}

export function IeltsWritingTab({ tasks, pathway, accent, soundEffects }: WritingTabProps) {
  const writingDrafts = useQuestStore((s) => s.writingDrafts);
  const saveWritingDraft = useQuestStore((s) => s.saveWritingDraft);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [typeFilter, setTypeFilter] = useState<'pathway' | 'task_1_academic' | 'task_1_gt' | 'task_2'>('pathway');
  const [selectedId, setSelectedId] = useState('');
  const [showModels, setShowModels] = useState(false);

  const filtered = useMemo(() => {
    if (typeFilter === 'pathway') {
      return tasks.filter((t) => t.pathway === 'shared' || t.pathway === pathway);
    }
    return tasks.filter((t) => t.taskType === typeFilter);
  }, [tasks, typeFilter, pathway]);

  const active = useMemo(
    () => filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? tasks[0],
    [filtered, selectedId, tasks]
  );

  const [draftText, setDraftText] = useState(() =>
    active ? (writingDrafts[active.id]?.text ?? '') : ''
  );
  const [secondsLeft, setSecondsLeft] = useState(() =>
    active ? active.recommendedMinutes * 60 : 1200
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string | string[]>>({});
  const [drillChecked, setDrillChecked] = useState(false);

  const syncTaskUiState = (nextTask: IELTSWritingTask | undefined) => {
    if (!nextTask) return;
    setSelectedId(nextTask.id);
    setDraftText(writingDrafts[nextTask.id]?.text ?? '');
    setSecondsLeft(nextTask.recommendedMinutes * 60);
    setTimerRunning(false);
    setDrillAnswers({});
    setDrillChecked(false);
    setShowModels(false);
  };

  useEffect(() => {
    if (!active) return;
    const h = window.setTimeout(() => saveWritingDraft(active.id, draftText), 400);
    return () => window.clearTimeout(h);
  }, [active, draftText, saveWritingDraft]);

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return;
    const id = window.setInterval(() => setSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, secondsLeft]);

  if (!active) return null;

  const words = countWords(draftText);
  const completedCount = tasks.filter((t) => completedAcademyIds.includes(t.id)).length;

  const handleCheckDrills = () => {
    if (drillChecked) return;
    setDrillChecked(true);
    const correct = active.exercises.filter((ex) =>
      evaluateExerciseAnswer(ex, drillAnswers[ex.id] ?? '').isCorrect
    ).length;
    playFeedbackTone(correct >= 1 ? 'correct' : 'wrong', soundEffects);
    markAcademyCompleted(active.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('ielts-wrt', active.id),
      amount: 25 + correct * 8,
      source: 'ielts',
      referenceId: active.id,
      skill: 'writing',
      minutes: 8,
      correctDelta: correct,
      attemptsDelta: active.exercises.length,
    });
  };

  return (
    <div className="space-y-4">
      <QuestCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black">IELTS Writing Task 1 & Task 2 Studio ({tasks.length} Tasks)</h2>
            <p className="text-xs font-semibold text-[#666666]">
              Academic visuals (Line, Bar, Pie, Table, Process, Map), GT Letters, and Task 2 Essays with annotated Band 6 vs Band 8 comparisons.
            </p>
          </div>
          <PillBadge tone="gold">{completedCount}/{tasks.length} Practiced</PillBadge>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: 'pathway', label: `Active Pathway (${pathway === 'academic' ? '50' : '40'})` },
            { key: 'task_1_academic', label: 'Task 1 Academic Charts (20)' },
            { key: 'task_1_gt', label: 'Task 1 GT Letters (10)' },
            { key: 'task_2', label: 'Task 2 Essays (30)' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                const nextFilter = tab.key as typeof typeFilter;
                setTypeFilter(nextFilter);
                const nextList =
                  nextFilter === 'pathway'
                    ? tasks.filter((t) => t.pathway === 'shared' || t.pathway === pathway)
                    : tasks.filter((t) => t.taskType === nextFilter);
                syncTaskUiState(nextList[0] ?? tasks[0]);
              }}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                typeFilter === tab.key
                  ? 'border-[#FFC800] bg-[#FFFBEB] text-[#8A5A00]'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          aria-label="Choose IELTS Writing Prompt"
          value={active.id}
          onChange={(e) => syncTaskUiState(filtered.find((t) => t.id === e.target.value))}
          className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-bold"
        >
          {filtered.map((t) => (
            <option key={t.id} value={t.id}>
              {completedAcademyIds.includes(t.id) ? '✓ ' : ''}
              [{t.questionSubtype.replace(/_/g, ' ')}] {t.title} ({t.cefrTarget})
            </option>
          ))}
        </select>
      </QuestCard>

      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <PillBadge tone="gold">
                <PenTool className="h-3.5 w-3.5" />
                {active.taskType.replace(/_/g, ' ').toUpperCase()}
              </PillBadge>
              <PillBadge tone="neutral">{active.questionSubtype.replace(/_/g, ' ')}</PillBadge>
              <PillBadge tone="blue">Target Min {active.minWords} words • {active.recommendedMinutes} min</PillBadge>
            </div>
            <h3 className="mt-2 text-xl font-black">{active.title}</h3>
          </div>

          <button
            type="button"
            onClick={() => setTimerRunning((r) => !r)}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-1.5 text-xs font-black"
          >
            <Clock className="h-4 w-4 text-[#8A5A00]" />
            {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')} ({timerRunning ? 'Pause' : 'Start'})
          </button>
        </div>

        <p className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-4 text-sm font-bold text-[#3C3C3C]">
          {active.prompt}
        </p>

        {active.visualSpec && <IeltsVisualRenderer visual={active.visualSpec} />}

        {active.letterContext && (
          <div className="rounded-2xl border-2 border-[#DFB9FF] bg-[#FAF4FF] p-4 space-y-2">
            <p className="text-xs font-black uppercase text-[#8E3FD6]">
              GT Letter Brief • Recipient: {active.letterContext.recipientType} ({active.letterContext.tone.replace('_', ' ')} tone)
            </p>
            <ul className="list-disc pl-5 text-sm font-bold text-[#4B4B4B]">
              {active.letterContext.bulletPoints.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5 space-y-1.5">
            <p className="text-xs font-black uppercase text-[#666666]">4-Part Paragraph Blueprint</p>
            <ol className="list-decimal pl-5 text-xs font-bold text-[#4B4B4B] space-y-1">
              {active.outlineSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5 space-y-1.5">
            <p className="text-xs font-black uppercase text-[#666666]">High-Value Collocations</p>
            {active.keyCollocations.map((col) => (
              <p key={col.phrase} className="text-xs font-bold text-[#3C3C3C]">
                <span className="font-black text-[#0E8BC9]">{col.phrase}</span> — {col.vietnamese}
              </p>
            ))}
          </div>
        </div>

        {/* Autosaved Timed Writing Box */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor={`draft-${active.id}`} className="text-xs font-black uppercase text-[#555555]">
              Your Timed Response (Autosaved Locally)
            </label>
            <PillBadge tone={words >= active.minWords ? 'green' : 'neutral'}>
              {words} / {active.minWords} words
            </PillBadge>
          </div>
          <textarea
            id={`draft-${active.id}`}
            rows={7}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder={`Write your ${active.taskType === 'task_2' ? '4-paragraph essay' : 'overview + body or letter'} here...`}
            className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 text-sm font-medium leading-relaxed focus:border-[#1CB0F6] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowModels((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#FFE175] bg-[#FFFBEB] px-3 py-1.5 text-xs font-black text-[#8A5A00]"
        >
          <Eye className="h-3.5 w-3.5" />
          {showModels ? 'Hide Band 6 vs Band 8 Annotated Models' : 'Compare Band 6 vs Band 8 Models & Common Pitfalls'}
        </button>

        {showModels && (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border-2 border-[#FFE175] bg-[#FFFBEB] p-4 space-y-1.5">
                <p className="text-xs font-black uppercase text-[#8A5A00]">Band 6 Baseline Response</p>
                <p className="text-xs font-semibold text-[#3C3C3C] leading-relaxed">{active.band6Model}</p>
              </div>
              <div className="rounded-2xl border-2 border-[#C8F0A6] bg-[#EEFFDF] p-4 space-y-1.5">
                <p className="text-xs font-black uppercase text-[#357D00]">Band 8 Model Response</p>
                <p className="text-xs font-semibold text-[#3C3C3C] leading-relaxed">{active.band8Model}</p>
              </div>
            </div>
            <p className="text-xs font-bold text-[#A91D1D]">
              Pitfalls to avoid: {active.commonPitfalls.join(' • ')}
            </p>
          </div>
        )}

        {/* Structure & Overview Mini Drills */}
        <div className="space-y-3 border-t border-[#EFEFEF] pt-4">
          <p className="text-sm font-black">Pre-Draft Overview / Thesis Check ({active.exercises.length} Items)</p>
          {active.exercises.map((ex) => {
            const val = drillAnswers[ex.id] ?? '';
            const evalRes = drillChecked ? evaluateExerciseAnswer(ex, val) : null;
            return (
              <div key={ex.id} className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-3.5 space-y-2.5">
                <ExerciseRenderer
                  exercise={ex}
                  accent={accent}
                  speechRate={1.0}
                  disabled={drillChecked}
                  value={val}
                  onChange={(next) => setDrillAnswers((prev) => ({ ...prev, [ex.id]: next }))}
                />
                {evalRes && (
                  <p className={`text-xs font-bold ${evalRes.isCorrect ? 'text-[#357D00]' : 'text-[#A91D1D]'}`}>
                    {evalRes.isCorrect ? 'Looks strong!' : `Model benchmark: ${evalRes.expectedDisplay}`} — {ex.explanation}
                  </p>
                )}
              </div>
            );
          })}
          <div className="flex justify-end">
            <TactileButton variant="primary" size="sm" onClick={handleCheckDrills}>
              <CheckCircle2 className="h-4 w-4" />
              {drillChecked ? 'Verified (+XP)' : 'Verify Structure & Save Progress'}
            </TactileButton>
          </div>
        </div>
      </QuestCard>
    </div>
  );
}

interface IdeaBankTabProps {
  packs: IELTSIdeaVocabTopic[];
  accent: EnglishAccent;
  soundEffects: boolean;
}

export function IeltsIdeaBankTab({ packs, accent, soundEffects }: IdeaBankTabProps) {
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [selectedId, setSelectedId] = useState(packs[0]?.id ?? '');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);

  const active = useMemo(
    () => packs.find((p) => p.id === selectedId) ?? packs[0],
    [packs, selectedId]
  );

  if (!active) return null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setAnswers({});
    setChecked(false);
  };

  const handleCheck = () => {
    if (checked) return;
    setChecked(true);
    const correct = active.exercises.filter((ex) =>
      evaluateExerciseAnswer(ex, answers[ex.id] ?? '').isCorrect
    ).length;
    playFeedbackTone(correct > 0 ? 'correct' : 'wrong', soundEffects);
    markAcademyCompleted(active.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('ielts-idea', active.id),
      amount: 15 + correct * 5,
      source: 'ielts',
      referenceId: active.id,
      skill: 'vocabulary',
      minutes: 4,
      correctDelta: correct,
      attemptsDelta: active.exercises.length,
    });
  };

  return (
    <div className="space-y-4">
      <QuestCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black">IELTS Idea & Academic Vocabulary Packs ({packs.length} Topics)</h2>
            <p className="text-xs font-semibold text-[#666666]">{UNOFFICIAL_IELTS_NOTICE}</p>
          </div>
          <PillBadge tone="purple">
            <Sparkles className="h-3.5 w-3.5" />
            CEFR {active.cefrTarget}
          </PillBadge>
        </div>

        <select
          aria-label="Choose IELTS Topic Idea Bank"
          value={active.id}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-bold"
        >
          {packs.map((p) => (
            <option key={p.id} value={p.id}>
              {completedAcademyIds.includes(p.id) ? '✓ ' : ''}
              {p.topic} ({p.cefrTarget})
            </option>
          ))}
        </select>
      </QuestCard>

      <QuestCard className="space-y-4">
        <h3 className="text-xl font-black">{active.topic}</h3>

        <div className="grid gap-3 md:grid-cols-2">
          {active.coreArguments.map((arg, i) => (
            <div key={i} className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4 space-y-1.5">
              <p className="text-xs font-black uppercase text-[#0E8BC9]">Argument {i + 1}</p>
              <p className="text-sm font-black text-[#3C3C3C]">{arg.thesis}</p>
              <p className="text-xs font-semibold text-[#555555]">Evidence: {arg.support}</p>
              <p className="text-xs font-bold text-[#8E3FD6]">Nuance / Counter: {arg.counterPoint}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-black uppercase text-[#666666] mb-2">Academic Lexis & Spoken Nuances</p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {active.academicCollocations.map((col) => (
              <div key={col.term} className="rounded-xl border border-[#E5E5E5] bg-white p-3 space-y-1">
                <p className="text-sm font-black text-[#0E8BC9]">{col.term}</p>
                <p className="text-xs font-semibold text-[#555555]">{col.example}</p>
                <p className="text-xs font-bold text-[#46A302]">{col.vietnamese}</p>
              </div>
            ))}
          </div>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {active.speakingNaturalExpressions.map((sp) => (
              <div key={sp.phrase} className="rounded-xl border border-[#DFB9FF] bg-[#FAF4FF] p-3 space-y-0.5">
                <p className="text-xs font-black text-[#8E3FD6]">{sp.phrase} ({sp.nuance})</p>
                <p className="text-xs font-semibold text-[#4B4B4B]">“{sp.example}”</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-[#EFEFEF] pt-3">
          {active.exercises.map((ex) => {
            const val = answers[ex.id] ?? '';
            const evalRes = checked ? evaluateExerciseAnswer(ex, val) : null;
            return (
              <div key={ex.id} className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-3.5 space-y-2">
                <ExerciseRenderer
                  exercise={ex}
                  accent={accent}
                  speechRate={1.0}
                  disabled={checked}
                  value={val}
                  onChange={(next) => setAnswers((prev) => ({ ...prev, [ex.id]: next }))}
                />
                {evalRes && (
                  <p className={`text-xs font-bold ${evalRes.isCorrect ? 'text-[#357D00]' : 'text-[#A91D1D]'}`}>
                    {evalRes.isCorrect ? 'Correct!' : `Key: ${evalRes.expectedDisplay}`} — {ex.explanation}
                  </p>
                )}
              </div>
            );
          })}
          <div className="flex justify-end">
            <TactileButton variant="primary" size="sm" onClick={handleCheck}>
              Check Lexis Recall
            </TactileButton>
          </div>
        </div>
      </QuestCard>
    </div>
  );
}
