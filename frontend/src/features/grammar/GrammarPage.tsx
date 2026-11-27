import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Dumbbell, GraduationCap, Layers, XCircle } from 'lucide-react';
import { evaluateExerciseAnswer, type CEFRLevel } from '@english-quest/shared';
import { CEFR_LEVELS, loadExercisesByLevel, loadGrammarByLevel } from '@content/index';
import { PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { GRAMMAR_TOPICS } from '@/data/grammarTopics';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

type PackSelection = 'CORE' | CEFRLevel;

export function GrammarPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const grammarQuizPassedIds = useQuestStore((s) => s.grammarQuizPassedIds);
  const recordGrammarQuizPass = useQuestStore((s) => s.recordGrammarQuizPass);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);

  const [viewMode, setViewMode] = useState<'lessons' | 'drills'>('lessons');
  const [pack, setPack] = useState<PackSelection>('CORE');
  const [selectedId, setSelectedId] = useState(GRAMMAR_TOPICS[0].id);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);

  // Exercise bank drill states
  const [drillLevel, setDrillLevel] = useState<CEFRLevel>('A1');
  const [drillFilter, setDrillFilter] = useState<'ALL' | 'grammar' | 'vocabulary'>('ALL');
  const [drillPage, setDrillPage] = useState(0);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string | string[]>>({});
  const [drillChecked, setDrillChecked] = useState(false);

  const { data: lazyTopics = [], isLoading: topicsLoading } = useQuery({
    queryKey: ['grammar-pack', pack],
    queryFn: () => (pack === 'CORE' ? Promise.resolve(GRAMMAR_TOPICS) : loadGrammarByLevel(pack)),
    staleTime: Infinity,
  });

  const activeTopics = pack === 'CORE' ? GRAMMAR_TOPICS : lazyTopics;
  const topic = activeTopics.find((t) => t.id === selectedId) ?? activeTopics[0] ?? GRAMMAR_TOPICS[0];

  const { data: drillBank = [], isLoading: drillLoading } = useQuery({
    queryKey: ['exercise-bank', drillLevel],
    queryFn: () => loadExercisesByLevel(drillLevel),
    enabled: viewMode === 'drills',
    staleTime: Infinity,
  });

  const filteredDrills = useMemo(() => {
    if (drillFilter === 'ALL') return drillBank;
    return drillBank.filter((ex) =>
      drillFilter === 'grammar'
        ? ex.relatedKnowledgeId?.startsWith('gram-')
        : !ex.relatedKnowledgeId?.startsWith('gram-')
    );
  }, [drillBank, drillFilter]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredDrills.length / pageSize));
  const safePage = Math.min(drillPage, totalPages - 1);
  const pagedDrills = filteredDrills.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const handleSelectPack = (nextPack: PackSelection) => {
    setPack(nextPack);
    setAnswers({});
    setChecked(false);
  };

  const handleSelectTopic = (id: string) => {
    setSelectedId(id);
    setAnswers({});
    setChecked(false);
  };

  const handleCheckQuiz = () => {
    if (checked) return;
    let correct = 0;
    for (const q of topic.quiz) {
      const res = evaluateExerciseAnswer(q, answers[q.id] ?? '');
      if (res.isCorrect) {
        correct += 1;
      } else {
        recordMistake({
          source: 'grammar',
          skill: 'grammar',
          cefrLevel: topic.cefrLevel,
          prompt: q.prompt,
          userAnswer: res.normalizedUserAnswer || '(no answer)',
          expectedAnswer: res.expectedDisplay,
          explanation: q.explanation,
          explanationVi: q.explanationVi,
        });
      }
    }
    setChecked(true);
    if (correct === topic.quiz.length) {
      recordGrammarQuizPass(topic.id);
    }
    awardActivityXp({
      idempotencyKey: createAttemptKey('grammar', topic.id),
      amount: 12 + correct * 6,
      source: 'grammar',
      referenceId: topic.id,
      skill: 'grammar',
      minutes: 3,
      correctDelta: correct,
      attemptsDelta: topic.quiz.length,
    });
    playFeedbackTone(correct === topic.quiz.length ? 'celebrate' : 'correct', preferences.soundEffects);
  };

  const handleCheckDrills = () => {
    if (drillChecked || pagedDrills.length === 0) return;
    let correct = 0;
    for (const ex of pagedDrills) {
      const res = evaluateExerciseAnswer(ex, drillAnswers[ex.id] ?? '');
      if (res.isCorrect) {
        correct += 1;
      } else {
        recordMistake({
          source: 'grammar',
          skill: ex.relatedKnowledgeId?.startsWith('gram-') ? 'grammar' : 'vocabulary',
          cefrLevel: drillLevel,
          prompt: ex.prompt,
          userAnswer: res.normalizedUserAnswer || '(no answer)',
          expectedAnswer: res.expectedDisplay,
          explanation: ex.explanation,
          explanationVi: ex.explanationVi,
        });
      }
    }
    setDrillChecked(true);
    awardActivityXp({
      idempotencyKey: createAttemptKey('grammar', `bank-${drillLevel}-${safePage}`),
      amount: 10 + correct * 4,
      source: 'grammar',
      referenceId: `bank-${drillLevel}-${safePage}`,
      skill: 'grammar',
      minutes: 4,
      correctDelta: correct,
      attemptsDelta: pagedDrills.length,
    });
    playFeedbackTone(correct >= Math.ceil(pagedDrills.length * 0.7) ? 'celebrate' : 'correct', preferences.soundEffects);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="blue">
            <GraduationCap className="h-3.5 w-3.5" />
            Grammar Academy (A1–C2)
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Master Structures From A1 to C2</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            55 grammar guides (7 core + 48 deep CEFR lessons) and 600 interactive vocab &amp; grammar drills.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2 text-right">
          <p className="text-xs font-extrabold uppercase text-[#777777]">Quizzes Passed</p>
          <p className="text-lg font-black text-[#58CC02]">{grammarQuizPassedIds.length}/55</p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2">
        <TactileButton
          size="sm"
          variant={viewMode === 'lessons' ? 'primary' : 'outline'}
          onClick={() => setViewMode('lessons')}
        >
          <Layers className="h-4 w-4" />
          Academy Lessons (55)
        </TactileButton>
        <TactileButton
          size="sm"
          variant={viewMode === 'drills' ? 'secondary' : 'outline'}
          onClick={() => setViewMode('drills')}
        >
          <Dumbbell className="h-4 w-4" />
          600 Interactive Drills (A1–C2)
        </TactileButton>
      </div>

      {viewMode === 'lessons' && (
        <>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectPack('CORE')}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                pack === 'CORE'
                  ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              Core (7)
            </button>
            {CEFR_LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSelectPack(lvl)}
                className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                  pack === lvl
                    ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                {lvl} Academy (8)
              </button>
            ))}
          </div>

          {topicsLoading ? (
            <QuestCard className="p-6 text-center text-sm font-bold text-[#666666]">
              Loading {pack} Grammar Academy curriculum...
            </QuestCard>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {activeTopics.map((t) => {
                const passed = grammarQuizPassedIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTopic(t.id)}
                    className={`rounded-2xl border-2 border-b-4 p-3.5 text-left transition ${
                      t.id === topic.id
                        ? 'border-[#1CB0F6] bg-[#E3F6FF]'
                        : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-[#0E8BC9]">{t.cefrLevel}</span>
                      {passed && <CheckCircle2 className="h-4 w-4 text-[#58CC02]" />}
                    </div>
                    <p className="mt-1 text-sm font-black text-[#3C3C3C]">{t.title}</p>
                  </button>
                );
              })}
            </div>
          )}

          <QuestCard className="space-y-5">
            <div>
              <PillBadge tone="green">{topic.cefrLevel}</PillBadge>
              <h2 className="mt-2 text-xl font-black">{topic.title}</h2>
              <p className="mt-1 text-sm font-bold text-[#3C3C3C]">{topic.summary}</p>
              {preferences.bilingualExplanations && (
                <p className="mt-1 text-xs font-bold text-[#0E8BC9]">VI: {topic.summaryVi}</p>
              )}
              {topic.detailedExplanation && (
                <p className="mt-3 rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-3.5 text-sm font-semibold leading-relaxed text-[#444444]">
                  {topic.detailedExplanation}
                </p>
              )}
            </div>

            {topic.objectives && topic.objectives.length > 0 && (
              <div className="rounded-2xl border border-[#B8EE8A] bg-[#F3FDE8] p-3.5">
                <p className="text-xs font-black uppercase text-[#46A302]">Learning Objectives</p>
                <ul className="mt-1.5 space-y-1 text-xs font-bold text-[#3C3C3C]">
                  {topic.objectives.map((obj) => (
                    <li key={obj}>✓ {obj}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              {topic.structures.map((st) => (
                <div key={st.label} className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-3.5">
                  <p className="text-xs font-black uppercase text-[#0E8BC9]">{st.label}</p>
                  <p className="mt-1 text-sm font-black text-[#3C3C3C]">{st.formula}</p>
                  <p className="mt-1.5 text-xs italic font-semibold text-[#555555]">
                    &ldquo;{st.example}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {(topic.usageRules?.length || topic.exceptions?.length) && (
              <div className="grid gap-3 md:grid-cols-2">
                {topic.usageRules && topic.usageRules.length > 0 && (
                  <div className="rounded-2xl border border-[#E5E5E5] bg-white p-3.5">
                    <p className="text-xs font-black uppercase text-[#0E8BC9]">Key Usage Rules</p>
                    <ul className="mt-1.5 space-y-1 text-xs font-semibold text-[#444444]">
                      {topic.usageRules.map((rule) => (
                        <li key={rule}>• {rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {topic.exceptions && topic.exceptions.length > 0 && (
                  <div className="rounded-2xl border border-[#FFE58F] bg-[#FFFDF2] p-3.5">
                    <p className="text-xs font-black uppercase text-[#A67800]">Exceptions &amp; Edge Cases</p>
                    <ul className="mt-1.5 space-y-1 text-xs font-semibold text-[#555555]">
                      {topic.exceptions.map((exc) => (
                        <li key={exc}>! {exc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {topic.examples && topic.examples.length > 0 && (
              <div className="space-y-2 rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-4">
                <p className="text-xs font-black uppercase text-[#3C3C3C]">
                  Contextual Examples ({topic.examples.length})
                </p>
                <div className="grid gap-2">
                  {topic.examples.map((ex, i) => (
                    <div key={i} className="rounded-xl bg-white p-2.5 border border-[#E5E5E5]">
                      <p className="text-sm font-bold text-[#3C3C3C]">{ex.english}</p>
                      {preferences.bilingualExplanations && ex.vietnamese && (
                        <p className="text-xs font-bold text-[#46A302]">{ex.vietnamese}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border-2 border-[#FFB8B8] bg-[#FFF6F6] p-4 space-y-2">
              <p className="text-xs font-black uppercase text-[#D32F2F]">Common Mistakes to Avoid</p>
              {topic.commonMistakes.map((m, idx) => (
                <div key={idx} className="text-sm">
                  <p className="font-bold text-[#D32F2F] line-through">{m.wrong}</p>
                  <p className="font-black text-[#46A302]">→ {m.right}</p>
                  <p className="text-xs font-semibold text-[#555555]">{m.why}</p>
                </div>
              ))}
            </div>

            {topic.comparisons && topic.comparisons.length > 0 && (
              <div className="rounded-2xl border border-[#BCE7FD] bg-[#F2FAFF] p-3.5 space-y-1.5">
                <p className="text-xs font-black uppercase text-[#0E8BC9]">Structure Contrast</p>
                {topic.comparisons.map((c) => (
                  <div key={c.structure} className="text-xs">
                    <p className="font-black text-[#3C3C3C]">{c.structure}</p>
                    <p className="font-semibold text-[#555555]">{c.difference}</p>
                    <p className="italic text-[#0E8BC9]">{c.example}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 text-xs font-bold">
              <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-3.5">
                <p className="uppercase text-[#8E3FD6] font-black">Speaking Application</p>
                <p className="mt-1 text-sm font-semibold text-[#3C3C3C]">{topic.speakingTip}</p>
              </div>
              <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-3.5">
                <p className="uppercase text-[#A67800] font-black">Writing Application</p>
                <p className="mt-1 text-sm font-semibold text-[#3C3C3C]">{topic.writingTip}</p>
              </div>
            </div>

            {topic.reviewSummary && (
              <p className="rounded-xl bg-[#E9FCD9] px-3.5 py-2.5 text-xs font-black text-[#2B6400]">
                Quick Recap: {topic.reviewSummary}
              </p>
            )}
          </QuestCard>

          {/* Topic Quiz */}
          <div className="space-y-4">
            {topic.quiz.map((q) => {
              const res = checked ? evaluateExerciseAnswer(q, answers[q.id] ?? '') : null;
              return (
                <QuestCard key={q.id}>
                  <ExerciseRenderer
                    exercise={q}
                    accent={preferences.preferredAccent}
                    speechRate={preferences.speechRate}
                    disabled={checked}
                    value={answers[q.id] ?? ''}
                    onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                  />
                  {res && (
                    <div
                      className={`mt-4 flex items-start gap-2 rounded-2xl border-2 p-3 text-sm ${
                        res.isCorrect
                          ? 'border-[#A5ED6E] bg-[#D7FFB8] text-[#2B6400]'
                          : 'border-[#FFB8B8] bg-[#FFDFE0] text-[#9E1C1C]'
                      }`}
                    >
                      {res.isCorrect ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      )}
                      <div>
                        <p className="font-black">
                          {res.isCorrect ? 'Spot on!' : `Correct: ${res.expectedDisplay}`}
                        </p>
                        <p className="font-semibold">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </QuestCard>
              );
            })}
            {!checked && (
              <div className="flex justify-end">
                <TactileButton onClick={handleCheckQuiz}>Check Grammar Quiz</TactileButton>
              </div>
            )}
          </div>
        </>
      )}

      {viewMode === 'drills' && (
        <div className="space-y-4">
          <QuestCard className="space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {CEFR_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setDrillLevel(lvl);
                      setDrillPage(0);
                      setDrillAnswers({});
                      setDrillChecked(false);
                    }}
                    className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                      drillLevel === lvl
                        ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                        : 'border-[#E5E5E5] bg-white text-[#555555]'
                    }`}
                  >
                    {lvl} (100)
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5">
                {(['ALL', 'vocabulary', 'grammar'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setDrillFilter(f);
                      setDrillPage(0);
                      setDrillAnswers({});
                      setDrillChecked(false);
                    }}
                    className={`rounded-xl border-2 px-2.5 py-1 text-xs font-black uppercase ${
                      drillFilter === f
                        ? 'border-[#46A302] bg-[#58CC02] text-white'
                        : 'border-[#E5E5E5] bg-white text-[#555555]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {!drillLoading && totalPages > 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDrillPage(idx);
                      setDrillAnswers({});
                      setDrillChecked(false);
                    }}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-black ${
                      safePage === idx
                        ? 'border-[#0E8BC9] bg-[#E3F6FF] text-[#0E8BC9]'
                        : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#666666]'
                    }`}
                  >
                    Set {idx + 1} (#{idx * pageSize + 1}–{Math.min(filteredDrills.length, (idx + 1) * pageSize)})
                  </button>
                ))}
              </div>
            )}
          </QuestCard>

          {drillLoading ? (
            <QuestCard className="p-6 text-center text-sm font-bold text-[#666666]">
              Loading {drillLevel} interactive drills...
            </QuestCard>
          ) : (
            <div className="space-y-4">
              {pagedDrills.map((ex, i) => {
                const res = drillChecked ? evaluateExerciseAnswer(ex, drillAnswers[ex.id] ?? '') : null;
                return (
                  <QuestCard key={ex.id}>
                    <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase text-[#777777]">
                      <span>
                        Item #{safePage * pageSize + i + 1} • {ex.type.replace(/_/g, ' ')}
                      </span>
                      <span>+{ex.xpReward} XP</span>
                    </div>
                    <ExerciseRenderer
                      exercise={ex}
                      accent={preferences.preferredAccent}
                      speechRate={preferences.speechRate}
                      disabled={drillChecked}
                      value={drillAnswers[ex.id] ?? ''}
                      onChange={(v) => setDrillAnswers((prev) => ({ ...prev, [ex.id]: v }))}
                    />
                    {res && (
                      <div
                        className={`mt-4 flex items-start gap-2 rounded-2xl border-2 p-3 text-sm ${
                          res.isCorrect
                            ? 'border-[#A5ED6E] bg-[#D7FFB8] text-[#2B6400]'
                            : 'border-[#FFB8B8] bg-[#FFDFE0] text-[#9E1C1C]'
                        }`}
                      >
                        {res.isCorrect ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                        ) : (
                          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                        )}
                        <div>
                          <p className="font-black">
                            {res.isCorrect ? 'Spot on!' : `Correct: ${res.expectedDisplay}`}
                          </p>
                          <p className="font-semibold">{ex.explanation}</p>
                          {preferences.bilingualExplanations && ex.explanationVi && (
                            <p className="mt-0.5 text-xs font-bold">{ex.explanationVi}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </QuestCard>
                );
              })}

              {!drillChecked && pagedDrills.length > 0 && (
                <div className="flex justify-end">
                  <TactileButton onClick={handleCheckDrills}>
                    Check Set {safePage + 1} Answers
                  </TactileButton>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
