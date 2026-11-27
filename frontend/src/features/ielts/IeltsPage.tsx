import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Headphones, Mic, PenTool, Target } from 'lucide-react';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import {
  estimatePracticeBandFromRatio,
  IELTS_MINI_MOCK_QUESTIONS,
  IELTS_SPEAKING_PROMPTS,
} from '@/data/ieltsData';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone, speakText } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function IeltsPage() {
  const ieltsPathway = useQuestStore((s) => s.ieltsPathway);
  const setIeltsPathway = useQuestStore((s) => s.setIeltsPathway);
  const preferences = useQuestStore((s) => s.preferences);
  const updatePreferences = useQuestStore((s) => s.updatePreferences);
  const ieltsSessions = useQuestStore((s) => s.ieltsSessions);
  const recordIeltsSession = useQuestStore((s) => s.recordIeltsSession);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [mockAnswers, setMockAnswers] = useState<Record<string, string>>({});
  const [mockSubmitted, setMockSubmitted] = useState(false);
  const [mockSeconds, setMockSeconds] = useState(0);
  const [activeCueId, setActiveCueId] = useState(IELTS_SPEAKING_PROMPTS[0].id);

  useEffect(() => {
    if (mockSubmitted) return;
    const id = window.setInterval(() => setMockSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [mockSubmitted]);

  const pathwayQuestions = IELTS_MINI_MOCK_QUESTIONS.filter(
    (q) => q.pathway === 'both' || q.pathway === ieltsPathway
  );

  const handleRunMiniMock = () => {
    if (mockSubmitted) return;
    const correct = pathwayQuestions.filter(
      (q) => mockAnswers[q.id] === q.correctAnswer
    ).length;
    const band = estimatePracticeBandFromRatio(correct, pathwayQuestions.length);

    setMockSubmitted(true);
    recordIeltsSession({
      pathway: ieltsPathway,
      skill: 'mini_mock',
      title: `${ieltsPathway === 'academic' ? 'Academic' : 'General Training'} Mini-Mock`,
      score: correct,
      maxScore: pathwayQuestions.length,
      estimatedBand: band,
      isUnofficialEstimate: true,
      durationSeconds: mockSeconds,
    });
    awardActivityXp({
      idempotencyKey: createAttemptKey('ielts-mock', ieltsPathway),
      amount: 25 + correct * 5,
      source: 'ielts',
      referenceId: `mini-mock-${ieltsPathway}`,
      skill: 'reading',
      minutes: Math.max(2, Math.round(mockSeconds / 60)),
      correctDelta: correct,
      attemptsDelta: pathwayQuestions.length,
    });
    playFeedbackTone('celebrate', preferences.soundEffects);
  };

  const activeCue =
    IELTS_SPEAKING_PROMPTS.find((c) => c.id === activeCueId) ?? IELTS_SPEAKING_PROMPTS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="purple">
            <Target className="h-3.5 w-3.5" />
            IELTS Preparation Center
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            Academic & General Training Practice Hub
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Original IELTS-style tasks across Listening, Reading, Writing Task 1 & 2, and Speaking Parts 1–3.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="ielts-target-band" className="text-xs font-black uppercase text-[#777777]">
            Target Band
          </label>
          <select
            id="ielts-target-band"
            value={preferences.ieltsTargetBand}
            onChange={(e) => updatePreferences({ ieltsTargetBand: Number(e.target.value) })}
            className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-black"
          >
            {[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5].map((b) => (
              <option key={b} value={b}>
                {b.toFixed(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <HonestNotice
        title="Unofficial Practice Indicators Only"
        description="All IELTS materials here are original educational practice items—not copied official exam papers. Any estimated band indicator shown reflects unofficial practice heuristics, not certified IELTS scoring."
        tone="warning"
      />

      {/* Pathway Switcher */}
      <div className="flex flex-wrap gap-2">
        <TactileButton
          variant={ieltsPathway === 'academic' ? 'purple' : 'outline'}
          onClick={() => setIeltsPathway('academic')}
        >
          Academic Pathway
        </TactileButton>
        <TactileButton
          variant={ieltsPathway === 'general_training' ? 'purple' : 'outline'}
          onClick={() => setIeltsPathway('general_training')}
        >
          General Training Pathway
        </TactileButton>
      </div>

      {/* 4-Skill IELTS Shortcuts */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/listening" className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 hover:bg-[#F7F8FA]">
          <Headphones className="h-6 w-6 text-[#1CB0F6]" />
          <p className="mt-2 font-black">IELTS Listening</p>
          <p className="text-xs font-semibold text-[#666666]">Form & note completion drills</p>
        </Link>
        <Link to="/reading" className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 hover:bg-[#F7F8FA]">
          <BookOpen className="h-6 w-6 text-[#58CC02]" />
          <p className="mt-2 font-black">IELTS Reading</p>
          <p className="text-xs font-semibold text-[#666666]">TFNG, Headings & Summaries</p>
        </Link>
        <Link to="/writing" className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 hover:bg-[#F7F8FA]">
          <PenTool className="h-6 w-6 text-[#FFC800]" />
          <p className="mt-2 font-black">Writing Task 1 & 2</p>
          <p className="text-xs font-semibold text-[#666666]">Structure check & model essays</p>
        </Link>
        <Link to="/speaking" className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 hover:bg-[#F7F8FA]">
          <Mic className="h-6 w-6 text-[#CE82FF]" />
          <p className="mt-2 font-black">Speaking Studio</p>
          <p className="text-xs font-semibold text-[#666666]">Record & compare fluency</p>
        </Link>
      </div>

      {/* Speaking Parts 1, 2, 3 Cue Explorer */}
      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black">IELTS Speaking Parts 1, 2 & 3 Practice</h2>
          <div className="flex gap-2">
            {IELTS_SPEAKING_PROMPTS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCueId(c.id)}
                className={`rounded-xl border-2 px-3 py-1 text-xs font-black ${
                  activeCue.id === c.id
                    ? 'border-[#CE82FF] bg-[#F5E8FF] text-[#8E3FD6]'
                    : 'border-[#E5E5E5] bg-white'
                }`}
              >
                {c.part}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-4 space-y-2">
          <p className="text-xs font-black uppercase text-[#8E3FD6]">
            {activeCue.part} • {activeCue.topic} (Prep {activeCue.prepSeconds}s / Speak {activeCue.speakSeconds}s)
          </p>
          <ul className="space-y-1.5 text-sm font-bold">
            {activeCue.questions.map((q) => (
              <li key={q} className="flex items-center justify-between gap-2">
                <span>{q}</span>
                <button
                  type="button"
                  onClick={() => speakText(q, { accent: preferences.preferredAccent })}
                  className="text-xs font-black text-[#0E8BC9] hover:underline shrink-0"
                >
                  Listen
                </button>
              </li>
            ))}
          </ul>
          {activeCue.cueCardBullets && (
            <ul className="list-disc pl-5 pt-2 text-sm font-semibold text-[#555555]">
              {activeCue.cueCardBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          <p className="pt-2 text-xs font-bold text-[#46A302]">Tip: {activeCue.bandTip}</p>
        </div>
      </QuestCard>

      {/* Timed Mini Mock Section */}
      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black">
              Timed Mini-Mock ({ieltsPathway === 'academic' ? 'Academic' : 'General Training'})
            </h2>
            <p className="text-xs font-semibold text-[#666666]">
              Quick 3-question diagnostic checkpoint with unofficial practice band estimate.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F7F8FA] px-3 py-1.5 text-xs font-black border border-[#E5E5E5]">
            <Clock className="h-4 w-4 text-[#1CB0F6]" />
            {Math.floor(mockSeconds / 60)}:{String(mockSeconds % 60).padStart(2, '0')}
          </span>
        </div>

        <div className="space-y-4">
          {pathwayQuestions.map((q, i) => (
            <div key={q.id} className="rounded-2xl border-2 border-[#E5E5E5] p-4 space-y-2.5">
              <p className="text-xs font-black uppercase text-[#777777]">
                Item {i + 1} • {q.skill}
              </p>
              <p className="rounded-xl bg-[#F7F8FA] p-3 text-sm font-semibold text-[#3C3C3C]">
                {q.context}
              </p>
              <p className="font-black text-[#3C3C3C]">{q.prompt}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    disabled={mockSubmitted}
                    onClick={() => setMockAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    className={`rounded-xl border-2 px-3 py-2 text-left text-sm font-bold ${
                      mockAnswers[q.id] === opt
                        ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                        : 'border-[#E5E5E5] bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {mockSubmitted && (
                <p className="text-xs font-bold text-[#46A302]">
                  Answer: {q.correctAnswer} — {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {!mockSubmitted ? (
          <div className="flex justify-end">
            <TactileButton variant="purple" onClick={handleRunMiniMock}>
              Finish Mini-Mock & Log Practice Estimate
            </TactileButton>
          </div>
        ) : (
          <div className="flex justify-end">
            <TactileButton
              variant="outline"
              onClick={() => {
                setMockAnswers({});
                setMockSubmitted(false);
                setMockSeconds(0);
              }}
            >
              Try Another Round
            </TactileButton>
          </div>
        )}
      </QuestCard>

      {/* Real IELTS Practice History */}
      {ieltsSessions.length > 0 && (
        <QuestCard>
          <h3 className="text-base font-black">Your IELTS Practice History</h3>
          <div className="mt-3 space-y-2">
            {ieltsSessions.slice(0, 6).map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2.5 text-sm"
              >
                <div>
                  <p className="font-black">{s.title}</p>
                  <p className="text-xs font-semibold text-[#666666]">
                    Score {s.score}/{s.maxScore} • Unofficial Practice Indicator
                  </p>
                </div>
                <PillBadge tone="purple">Est. Band {s.estimatedBand.toFixed(1)} (Unofficial)</PillBadge>
              </div>
            ))}
          </div>
        </QuestCard>
      )}
    </div>
  );
}
