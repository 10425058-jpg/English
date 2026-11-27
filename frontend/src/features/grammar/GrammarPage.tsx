import { useState } from 'react';
import { CheckCircle2, GraduationCap, XCircle } from 'lucide-react';
import { evaluateExerciseAnswer } from '@english-quest/shared';
import { PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { GRAMMAR_TOPICS } from '@/data/grammarTopics';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function GrammarPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const grammarQuizPassedIds = useQuestStore((s) => s.grammarQuizPassedIds);
  const recordGrammarQuizPass = useQuestStore((s) => s.recordGrammarQuizPass);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);

  const [selectedId, setSelectedId] = useState(GRAMMAR_TOPICS[0].id);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);

  const topic = GRAMMAR_TOPICS.find((t) => t.id === selectedId) ?? GRAMMAR_TOPICS[0];

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="blue">
            <GraduationCap className="h-3.5 w-3.5" />
            Grammar Academy
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Master Structures From A1 to B1+</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Clear formulas, common pitfalls to avoid, speaking & writing tips, and instant practice quizzes.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2 text-right">
          <p className="text-xs font-extrabold uppercase text-[#777777]">Quizzes Passed</p>
          <p className="text-lg font-black text-[#58CC02]">
            {grammarQuizPassedIds.length}/{GRAMMAR_TOPICS.length}
          </p>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {GRAMMAR_TOPICS.map((t) => {
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
              <p className="mt-1 font-black text-[#3C3C3C]">{t.title}</p>
            </button>
          );
        })}
      </div>

      <QuestCard className="space-y-5">
        <div>
          <PillBadge tone="green">{topic.cefrLevel}</PillBadge>
          <h2 className="mt-2 text-xl font-black">{topic.title}</h2>
          <p className="mt-1 text-sm font-bold text-[#3C3C3C]">{topic.summary}</p>
          {preferences.bilingualExplanations && (
            <p className="mt-1 text-xs font-bold text-[#0E8BC9]">VI: {topic.summaryVi}</p>
          )}
        </div>

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
    </div>
  );
}
