import { Link } from 'react-router-dom';
import { ClipboardCheck, Flame, Gem, Info, Sparkles, User, Zap } from 'lucide-react';
import { computeUserLevel } from '@english-quest/shared';
import { PipMascot } from '@/components/mascot/PipMascot';
import { PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { useQuestStore } from '@/stores/useQuestStore';

export function ProfilePage() {
  const displayName = useQuestStore((s) => s.displayName);
  const recommendedCefr = useQuestStore((s) => s.recommendedCefr);
  const preferences = useQuestStore((s) => s.preferences);
  const xp = useQuestStore((s) => s.xp);
  const gems = useQuestStore((s) => s.gems);
  const streak = useQuestStore((s) => s.streak);
  const lessonProgress = useQuestStore((s) => s.lessonProgress);
  const assessmentHistory = useQuestStore((s) => s.assessmentHistory ?? []);
  const ieltsMockHistory = useQuestStore((s) => s.ieltsMockHistory ?? []);
  const skillStats = useQuestStore((s) => s.skillStats);
  const xpTransactions = useQuestStore((s) => s.xpTransactions);

  const levelInfo = computeUserLevel(xp);

  return (
    <div className="space-y-6">
      <QuestCard className="p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <PipMascot mood="happy" size={84} />
            <div>
              <PillBadge tone="blue">
                <User className="h-3.5 w-3.5" />
                Guest Mode (Local Persistence)
              </PillBadge>
              <h1 className="mt-1.5 text-2xl font-black">{displayName}</h1>
              <p className="text-sm font-bold text-[#666666]">
                Level {levelInfo.level} • Path {recommendedCefr} → Target {preferences.targetCefr} • IELTS Target {preferences.ieltsTargetBand.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/onboarding">
              <TactileButton variant="outline" size="sm">
                <Sparkles className="h-4 w-4" />
                Retake Placement
              </TactileButton>
            </Link>
            <Link to="/settings">
              <TactileButton size="sm">Manage Data & Settings</TactileButton>
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-[#F7F8FA] p-3 text-center border border-[#E5E5E5]">
            <Zap className="mx-auto h-5 w-5 text-[#1CB0F6]" />
            <p className="mt-1 text-xl font-black">{xp}</p>
            <p className="text-xs font-bold text-[#777777]">Total XP</p>
          </div>
          <div className="rounded-2xl bg-[#F7F8FA] p-3 text-center border border-[#E5E5E5]">
            <Flame className="mx-auto h-5 w-5 text-[#FF9600]" />
            <p className="mt-1 text-xl font-black">{streak.currentDays}d</p>
            <p className="text-xs font-bold text-[#777777]">Streak</p>
          </div>
          <div className="rounded-2xl bg-[#F7F8FA] p-3 text-center border border-[#E5E5E5]">
            <Gem className="mx-auto h-5 w-5 text-[#CE82FF]" />
            <p className="mt-1 text-xl font-black">{gems}</p>
            <p className="text-xs font-bold text-[#777777]">Gems</p>
          </div>
          <div className="rounded-2xl bg-[#F7F8FA] p-3 text-center border border-[#E5E5E5]">
            <Sparkles className="mx-auto h-5 w-5 text-[#58CC02]" />
            <p className="mt-1 text-xl font-black">{Object.keys(lessonProgress).length}</p>
            <p className="text-xs font-bold text-[#777777]">Lessons Done</p>
          </div>
        </div>
      </QuestCard>

      <QuestCard className="space-y-3">
        <h2 className="text-lg font-black">Per-Skill Practice Breakdown (Unofficial Estimates)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.values(skillStats).map((st) => {
            const acc = st.attempts > 0 ? Math.round((st.correct / st.attempts) * 100) : 0;
            return (
              <div key={st.skill} className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-sm font-black capitalize">
                  <span>{st.skill}</span>
                  <span className="text-[#0E8BC9]">Est. {st.estimatedCefr}</span>
                </div>
                <QuestProgressBar value={acc} max={100} color="#58CC02" heightClass="h-2.5" label={st.skill} />
                <p className="text-xs font-bold text-[#666666]">
                  {st.attempts} attempts • {acc}% accuracy • {st.minutesPracticed} min practiced
                </p>
              </div>
            );
          })}
        </div>
      </QuestCard>

      <QuestCard className="space-y-3 border-[#BCE7FD] bg-[#F5FBFF]">
        <div className="flex items-start gap-2.5 text-xs font-bold text-[#3C3C3C]">
          <Info className="h-4 w-4 shrink-0 text-[#1CB0F6] mt-0.5" />
          <p>
            <strong>XP vs. CEFR Mastery:</strong> XP measures consistent practice effort across lessons, flashcards, and skills. Real CEFR path progression is tracked separately via lesson completion and passing accuracy ({'>='}70%–75%) on structured Unit &amp; Level Assessments (internal estimates only).
          </p>
        </div>
      </QuestCard>

      <QuestCard className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-[#CE82FF]" />
            <h2 className="text-lg font-black">Structured Assessments &amp; Exams</h2>
          </div>
          <Link to="/learn" className="text-xs font-black text-[#1CB0F6] hover:underline">
            Explore Assessments →
          </Link>
        </div>
        {assessmentHistory.length === 0 ? (
          <p className="text-sm font-semibold text-[#666666]">
            No unit mastery or CEFR level assessments completed yet. Challenge any unit assessment on the Learning Path!
          </p>
        ) : (
          <div className="space-y-2">
            {assessmentHistory.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2.5 text-sm"
              >
                <div>
                  <span className="font-black text-[#3C3C3C]">{item.title}</span>
                  <p className="text-xs font-bold text-[#666666]">
                    {item.cefrLevel} • {item.correctCount}/{item.totalObjectiveCount} correct
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-xs font-black ${
                      item.passed ? 'bg-[#E9FCD9] text-[#46A302]' : 'bg-[#FFF5CC] text-[#A67800]'
                    }`}
                  >
                    {item.accuracyPercent}% • {item.passed ? 'Passed' : 'Retry Suggested'}
                  </span>
                  <Link
                    to={`/assessment/${item.assessmentId}`}
                    className="text-xs font-black text-[#1CB0F6] hover:underline"
                  >
                    View/Retake
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </QuestCard>

      <QuestCard className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-black">IELTS Mock Readiness History (Unofficial)</h2>
          <Link to="/ielts" className="text-xs font-black text-[#8E3FD6] hover:underline">
            Open IELTS Mastery Center →
          </Link>
        </div>
        {ieltsMockHistory.length === 0 ? (
          <p className="text-sm font-semibold text-[#666666]">
            No timed 4-skill IELTS mock examinations completed yet. Try any Academic or General Training Mock inside the IELTS hub!
          </p>
        ) : (
          <div className="space-y-2">
            {ieltsMockHistory.slice(0, 5).map((mock) => (
              <div
                key={mock.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2.5 text-sm"
              >
                <div>
                  <span className="font-black text-[#3C3C3C]">{mock.title}</span>
                  <p className="text-xs font-bold text-[#666666]">
                    L {mock.listeningBand !== null ? mock.listeningBand.toFixed(1) : `${mock.listeningRaw}/${mock.listeningMax}`}
                    {' • '}R {mock.readingBand !== null ? mock.readingBand.toFixed(1) : `${mock.readingRaw}/${mock.readingMax}`}
                    {' • '}W {mock.writingBand !== null ? mock.writingBand.toFixed(1) : 'Unassessed'}
                    {' • '}S {mock.speakingBand !== null ? mock.speakingBand.toFixed(1) : 'Unassessed'} (
                    {mock.pathway === 'academic' ? 'Academic' : 'GT'})
                  </p>
                </div>
                <PillBadge tone={mock.overallBand !== null ? 'purple' : 'neutral'}>
                  {mock.overallBand !== null
                    ? `Est. Overall ${mock.overallBand.toFixed(1)}`
                    : mock.examFormat === 'practice_mini'
                      ? 'Practice Mini-Mock (Raw)'
                      : 'Pending W/S Assessment'}
                </PillBadge>
              </div>
            ))}
          </div>
        )}
      </QuestCard>

      <QuestCard>
        <h2 className="text-lg font-black">Recent XP Ledger</h2>
        {xpTransactions.length === 0 ? (
          <p className="mt-2 text-sm font-semibold text-[#666666]">
            Complete any lesson, flashcard session, or four-skill drill to start recording your real XP ledger.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {[...xpTransactions]
              .reverse()
              .slice(0, 8)
              .map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2 text-sm"
                >
                  <span className="font-bold capitalize">
                    {tx.source.replace(/_/g, ' ')} • {tx.referenceId}
                  </span>
                  <span className="font-black text-[#46A302]">+{tx.amount} XP</span>
                </div>
              ))}
          </div>
        )}
      </QuestCard>
    </div>
  );
}
