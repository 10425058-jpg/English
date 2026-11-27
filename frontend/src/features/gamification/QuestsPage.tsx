import { useState } from 'react';
import { Check, Gem, Zap } from 'lucide-react';
import { toLocalDateKey } from '@english-quest/shared';
import { PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { QUESTS_CATALOG } from '@/data/gamificationData';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function QuestsPage() {
  const xpTransactions = useQuestStore((s) => s.xpTransactions);
  const lessonProgress = useQuestStore((s) => s.lessonProgress);
  const vocabReviewsByDate = useQuestStore((s) => s.vocabReviewsByDate);
  const questsClaimedByPeriod = useQuestStore((s) => s.questsClaimedByPeriod);
  const soundEffects = useQuestStore((s) => s.preferences.soundEffects);
  const claimQuestReward = useQuestStore((s) => s.claimQuestReward);

  const [toast, setToast] = useState<string | null>(null);

  const todayKey = toLocalDateKey();
  const weekKey = `${todayKey.slice(0, 7)}-w${Math.ceil(new Date().getDate() / 7)}`;

  const xpToday = xpTransactions
    .filter((t) => t.createdAt.startsWith(todayKey))
    .reduce((sum, t) => sum + t.amount, 0);

  const lessonsToday = Object.values(lessonProgress).filter((l) =>
    l.lastCompletedAt.startsWith(todayKey)
  ).length;

  const vocabToday = vocabReviewsByDate[todayKey] ?? 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const lessonsThisWeek = Object.values(lessonProgress).filter(
    (l) => new Date(l.lastCompletedAt).getTime() >= sevenDaysAgo.getTime()
  ).length;

  const getMetricValue = (metric: string) => {
    if (metric === 'xp_today') return xpToday;
    if (metric === 'lessons_today') return lessonsToday;
    if (metric === 'vocab_reviewed_today') return vocabToday;
    if (metric === 'lessons_this_week') return lessonsThisWeek;
    return 0;
  };

  const handleClaim = (periodKey: string, questId: string, xp: number, gems: number, title: string) => {
    const ok = claimQuestReward(periodKey, questId, xp, gems);
    if (ok) {
      playFeedbackTone('chest', soundEffects);
      setToast(`Claimed "${title}" reward: +${xp} XP & +${gems} Gems!`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <PillBadge tone="gold">
          <Zap className="h-3.5 w-3.5" />
          Daily & Weekly Quests
        </PillBadge>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Earn Bonus Rewards From Real Study</h1>
        <p className="mt-1 text-sm font-semibold text-[#666666]">
          Every quest tracks genuine lessons, XP, and spaced repetition reviews completed today.
        </p>
      </div>

      {toast && (
        <div role="status" className="rounded-2xl border-2 border-[#FFC800] bg-[#FFFBEB] p-3.5 text-sm font-black text-[#8F6500]">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        {QUESTS_CATALOG.map((q) => {
          const periodKey = q.period === 'daily' ? todayKey : weekKey;
          const progress = getMetricValue(q.metric);
          const ready = progress >= q.target;
          const claimed = (questsClaimedByPeriod[periodKey] ?? []).includes(q.id);

          return (
            <QuestCard key={q.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <PillBadge tone={q.period === 'daily' ? 'blue' : 'purple'}>
                    {q.period} quest
                  </PillBadge>
                  <h2 className="mt-1.5 text-lg font-black">{q.title}</h2>
                  <p className="text-sm font-semibold text-[#666666]">{q.description}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-black">
                  <span className="inline-flex items-center gap-1 rounded-xl bg-[#E3F6FF] px-2.5 py-1 text-[#0E8BC9]">
                    <Zap className="h-3.5 w-3.5" /> +{q.rewardXp} XP
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-xl bg-[#F5E8FF] px-2.5 py-1 text-[#8E3FD6]">
                    <Gem className="h-3.5 w-3.5" /> +{q.rewardGems}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <QuestProgressBar
                    value={progress}
                    max={q.target}
                    color={ready ? '#58CC02' : '#FFC800'}
                    label={q.title}
                  />
                </div>
                <span className="text-xs font-black text-[#555555]">
                  {Math.min(progress, q.target)}/{q.target}
                </span>
              </div>

              <div className="flex justify-end">
                {claimed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-[#46A302]">
                    <Check className="h-4 w-4" />
                    Reward Claimed
                  </span>
                ) : (
                  <TactileButton
                    size="sm"
                    disabled={!ready}
                    onClick={() => handleClaim(periodKey, q.id, q.rewardXp, q.rewardGems, q.title)}
                  >
                    {ready ? 'Claim Quest Reward' : 'In Progress'}
                  </TactileButton>
                )}
              </div>
            </QuestCard>
          );
        })}
      </div>
    </div>
  );
}
