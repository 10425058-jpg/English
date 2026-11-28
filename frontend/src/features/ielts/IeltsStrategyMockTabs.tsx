import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Play,
  ShieldAlert,
  Timer,
} from 'lucide-react';
import type {
  EnglishAccent,
  IELTSMockExamManifest,
  IELTSPathway,
  IELTSStrategyCategory,
  IELTSStrategyLesson,
} from '@english-quest/shared';
import { evaluateExerciseAnswer, MINI_MOCK_SCALING_WARNING, UNOFFICIAL_IELTS_NOTICE } from '@english-quest/shared';
import { PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

interface StrategyTabProps {
  lessons: IELTSStrategyLesson[];
  accent: EnglishAccent;
  soundEffects: boolean;
}

const STRATEGY_CATS: Array<{ key: 'all' | IELTSStrategyCategory; label: string }> = [
  { key: 'all', label: 'All Tactics (60)' },
  { key: 'listening', label: 'Listening Traps (12)' },
  { key: 'reading', label: 'Reading Scanning (12)' },
  { key: 'writing', label: 'Writing Rubric (12)' },
  { key: 'speaking', label: 'Speaking Delivery (12)' },
  { key: 'exam_day', label: 'Scoring & Timing (12)' },
];

export function IeltsStrategyTab({ lessons, accent, soundEffects }: StrategyTabProps) {
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [catFilter, setCatFilter] = useState<'all' | IELTSStrategyCategory>('all');
  const [selectedId, setSelectedId] = useState(lessons[0]?.id ?? '');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);

  const filtered = useMemo(
    () => lessons.filter((l) => catFilter === 'all' || l.category === catFilter),
    [lessons, catFilter]
  );

  const active = useMemo(
    () => filtered.find((l) => l.id === selectedId) ?? filtered[0] ?? lessons[0],
    [filtered, selectedId, lessons]
  );

  if (!active) return null;

  const doneCount = lessons.filter((l) => completedAcademyIds.includes(l.id)).length;

  const selectLesson = (next: IELTSStrategyLesson | undefined) => {
    if (!next) return;
    setSelectedId(next.id);
    setAnswers({});
    setChecked(false);
  };

  const handleVerify = () => {
    if (checked) return;
    setChecked(true);
    const correct = active.exercises.filter((ex) =>
      evaluateExerciseAnswer(ex, answers[ex.id] ?? '').isCorrect
    ).length;
    playFeedbackTone(correct === active.exercises.length ? 'celebrate' : 'correct', soundEffects);
    markAcademyCompleted(active.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('ielts-strat', active.id),
      amount: 15 + correct * 5,
      source: 'ielts',
      referenceId: active.id,
      skill: active.category === 'exam_day' ? 'reading' : active.category,
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
            <h2 className="text-lg font-black">IELTS Strategy & Methodology Academy ({lessons.length} Lessons)</h2>
            <p className="text-xs font-semibold text-[#666666]">
              High-ROI exam craft: distractor decoding, TFNG/YNNG boundaries, Writing Task 1/2 planning, and timeboxing.
            </p>
          </div>
          <PillBadge tone="blue">{doneCount}/{lessons.length} Mastered</PillBadge>
        </div>

        <div className="flex flex-wrap gap-2">
          {STRATEGY_CATS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => {
                setCatFilter(c.key);
                const nextList = lessons.filter((l) => c.key === 'all' || l.category === c.key);
                selectLesson(nextList[0] ?? lessons[0]);
              }}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                catFilter === c.key
                  ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <select
          aria-label="Choose IELTS Strategy Lesson"
          value={active.id}
          onChange={(e) => selectLesson(filtered.find((l) => l.id === e.target.value))}
          className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-bold"
        >
          {filtered.map((l) => (
            <option key={l.id} value={l.id}>
              {completedAcademyIds.includes(l.id) ? '✓ ' : ''}
              [{l.category.replace('_', ' ').toUpperCase()}] {l.title} ({l.cefrTarget})
            </option>
          ))}
        </select>
      </QuestCard>

      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <PillBadge tone="blue">
                <Compass className="h-3.5 w-3.5" />
                {active.skillFocus}
              </PillBadge>
              <PillBadge tone="neutral">CEFR {active.cefrTarget}</PillBadge>
            </div>
            <h3 className="mt-2 text-xl font-black">{active.title}</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3 py-1.5 text-xs font-black text-[#4B4B4B]">
            <Clock className="h-3.5 w-3.5 text-[#0E8BC9]" />
            {active.timingAllocationNote}
          </span>
        </div>

        <div className="rounded-2xl border-2 border-[#BCE7FD] bg-[#F2FAFF] p-4 space-y-1">
          <p className="text-xs font-black uppercase text-[#0C5E8A]">Core Tactical Principle</p>
          <p className="text-sm font-bold text-[#3C3C3C] leading-relaxed">{active.corePrinciple}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4 space-y-2">
            <p className="text-xs font-black uppercase text-[#46A302]">Step-by-Step Execution</p>
            <ol className="list-decimal pl-5 text-sm font-semibold text-[#3C3C3C] space-y-1.5">
              {active.stepByStepMethod.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border-2 border-[#FFE175] bg-[#FFFBEB] p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#8A5A00]">
              <ShieldAlert className="h-4 w-4" />
              Common Exam Trap & Counter-Move
            </div>
            {active.trapPatterns.map((t) => (
              <div key={t.trapName} className="space-y-1 text-xs">
                <p className="font-black text-[#8A5A00]">{t.trapName}</p>
                <p className="font-semibold text-[#785300]">Trap: {t.howItTricks}</p>
                <p className="font-bold text-[#357D00]">Counter: {t.counterMove}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-4 space-y-1">
          <p className="text-xs font-black uppercase text-[#8E3FD6]">Exam Example Breakdown</p>
          <p className="text-sm font-black text-[#3C3C3C]">{active.exampleBox.snippet}</p>
          <p className="text-xs font-semibold text-[#555555]">{active.exampleBox.breakdown}</p>
        </div>

        <div className="space-y-3 border-t border-[#EFEFEF] pt-4">
          <p className="text-sm font-black">Tactical Application Check ({active.exercises.length} Items)</p>
          {active.exercises.map((ex) => {
            const val = answers[ex.id] ?? '';
            const evalRes = checked ? evaluateExerciseAnswer(ex, val) : null;
            return (
              <div key={ex.id} className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-3.5 space-y-2">
                <ExerciseRenderer
                  key={ex.id}
                  exercise={ex}
                  accent={accent}
                  speechRate={1.0}
                  disabled={checked}
                  value={val}
                  onChange={(next) => setAnswers((prev) => ({ ...prev, [ex.id]: next }))}
                />
                {evalRes && (
                  <p className={`text-xs font-bold ${evalRes.isCorrect ? 'text-[#357D00]' : 'text-[#A91D1D]'}`}>
                    {evalRes.isCorrect ? 'Verified!' : `Target tactic: ${evalRes.expectedDisplay}`} — {ex.explanation}
                  </p>
                )}
              </div>
            );
          })}
          <div className="flex justify-end">
            <TactileButton variant="primary" size="sm" onClick={handleVerify}>
              <CheckCircle2 className="h-4 w-4" />
              {checked ? 'Mastered (+XP)' : 'Check Strategy Application'}
            </TactileButton>
          </div>
        </div>
      </QuestCard>
    </div>
  );
}

interface MockHubProps {
  manifests: IELTSMockExamManifest[];
  pathway: IELTSPathway;
}

export function IeltsMockHubTab({ manifests, pathway }: MockHubProps) {
  const inProgressMockExam = useQuestStore((s) => s.inProgressMockExam);
  const ieltsMockHistory = useQuestStore((s) => s.ieltsMockHistory);
  const saveInProgressMockExam = useQuestStore((s) => s.saveInProgressMockExam);

  const [filterMode, setFilterMode] = useState<'all' | IELTSPathway>(pathway);

  const filtered = manifests.filter((m) => filterMode === 'all' || m.pathway === filterMode);
  const fullExams = filtered.filter((m) => m.examFormat === 'full_exam');
  const miniMocks = filtered.filter((m) => m.examFormat === 'practice_mini');

  return (
    <div className="space-y-4">
      <QuestCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black">
              Timed 4-Skill IELTS Mock Examination Center ({manifests.length} Packs: 2 Full 40/40 + 12 Mini-Mocks)
            </h2>
            <p className="text-xs font-semibold text-[#666666]">{UNOFFICIAL_IELTS_NOTICE}</p>
          </div>
          <PillBadge tone="purple">2 Full 40Q Mocks • 12 Mini-Mocks (8L/15R)</PillBadge>
        </div>

        <div className="rounded-xl border border-[#FFE175] bg-[#FFFBEB] p-3 text-xs font-bold text-[#785300]">
          {MINI_MOCK_SCALING_WARNING}
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: `All Packs (${manifests.length})` },
            { key: 'academic', label: `Academic (${manifests.filter((m) => m.pathway === 'academic').length})` },
            { key: 'general_training', label: `General Training (${manifests.filter((m) => m.pathway === 'general_training').length})` },
          ].map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setFilterMode(btn.key as 'all' | IELTSPathway)}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                filterMode === btn.key
                  ? 'border-[#8E3FD6] bg-[#F5E8FF] text-[#8E3FD6]'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </QuestCard>

      {inProgressMockExam && (
        <QuestCard className="border-2 border-[#FFE175] bg-[#FFFBEB] flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#8A5A00]">
              <AlertTriangle className="h-4 w-4" />
              Autosaved Unfinished Exam Recovered
            </div>
            <p className="text-sm font-black text-[#3C3C3C]">
              Active paper: {inProgressMockExam.mockId.toUpperCase()} • Currently on {inProgressMockExam.currentSection.toUpperCase()} ({Math.floor(inProgressMockExam.sectionRemainingSeconds / 60)}m left)
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/mock-exam/${inProgressMockExam.mockId}`}>
              <TactileButton variant="primary" size="sm">
                <Play className="h-4 w-4" />
                Resume Mock Test
              </TactileButton>
            </Link>
            <TactileButton
              variant="outline"
              size="sm"
              onClick={() => saveInProgressMockExam(null)}
            >
              Discard Draft
            </TactileButton>
          </div>
        </QuestCard>
      )}

      {fullExams.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#8E3FD6]">
            Full-Length Examinations (40 Listening + 40 Reading Questions • Eligible for Band Scaling)
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {fullExams.map((mock) => {
              const pastRuns = (ieltsMockHistory ?? []).filter((h) => h.mockId === mock.id);
              const numericOveralls = pastRuns
                .map((h) => h.overallBand)
                .filter((b): b is number => typeof b === 'number');
              const bestOverall = numericOveralls.length > 0 ? Math.max(...numericOveralls) : null;

              return (
                <QuestCard key={mock.id} className="border-2 border-[#DFB9FF] flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        <PillBadge tone={mock.pathway === 'academic' ? 'purple' : 'blue'}>
                          {mock.pathway === 'academic' ? 'Full Academic Mock' : 'Full General Training Mock'}
                        </PillBadge>
                        <PillBadge tone="green">
                          {mock.listeningQuestionTotal}L + {mock.readingQuestionTotal}R
                        </PillBadge>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[#666666]">
                        <Timer className="h-3.5 w-3.5" />
                        ~{mock.estimatedMinutes} min
                      </span>
                    </div>
                    <h4 className="text-base font-black text-[#3C3C3C]">{mock.title}</h4>
                    <p className="text-xs font-semibold text-[#666666]">{mock.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EFEFEF] pt-3">
                    {bestOverall !== null ? (
                      <PillBadge tone="green">
                        <Award className="h-3.5 w-3.5" />
                        Best Assessed Overall {bestOverall.toFixed(1)}
                      </PillBadge>
                    ) : pastRuns.length > 0 ? (
                      <span className="text-xs font-bold text-[#666666]">
                        Attempted • L {pastRuns[0].listeningBand?.toFixed(1) ?? '—'} • R {pastRuns[0].readingBand?.toFixed(1) ?? '—'} (W/S Unassessed)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#888888]">Not yet attempted</span>
                    )}
                    <Link to={`/mock-exam/${mock.id}`}>
                      <TactileButton variant="purple" size="sm">
                        <Play className="h-3.5 w-3.5" />
                        Start Full Exam (40L+40R)
                      </TactileButton>
                    </Link>
                  </div>
                </QuestCard>
              );
            })}
          </div>
        </div>
      )}

      {miniMocks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#555555]">
            Short Practice Mini-Mocks (8 Listening + 15 Reading • Raw Percentage Only)
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {miniMocks.map((mock) => {
              const pastRuns = (ieltsMockHistory ?? []).filter((h) => h.mockId === mock.id);
              const latestRun = pastRuns[0];

              return (
                <QuestCard key={mock.id} className="flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        <PillBadge tone={mock.pathway === 'academic' ? 'purple' : 'blue'}>
                          {mock.pathway === 'academic' ? 'Academic Mini-Mock' : 'GT Mini-Mock'}
                        </PillBadge>
                        <PillBadge tone="neutral">
                          {mock.listeningQuestionTotal}L + {mock.readingQuestionTotal}R • No Band Scaling
                        </PillBadge>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[#666666]">
                        <Timer className="h-3.5 w-3.5" />
                        ~{mock.estimatedMinutes} min
                      </span>
                    </div>
                    <h4 className="text-base font-black text-[#3C3C3C]">{mock.title}</h4>
                    <p className="text-xs font-semibold text-[#666666]">{mock.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EFEFEF] pt-3">
                    {latestRun ? (
                      <PillBadge tone="neutral">
                        Latest Raw: L {latestRun.listeningRaw}/{latestRun.listeningMax} • R {latestRun.readingRaw}/{latestRun.readingMax}
                      </PillBadge>
                    ) : (
                      <span className="text-xs font-bold text-[#888888]">Not yet attempted</span>
                    )}
                    <Link to={`/mock-exam/${mock.id}`}>
                      <TactileButton variant="outline" size="sm">
                        <Play className="h-3.5 w-3.5" />
                        Start Mini-Mock
                      </TactileButton>
                    </Link>
                  </div>
                </QuestCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
