import { Trophy } from 'lucide-react';
import { HonestNotice, PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { OFFLINE_LEAGUE_BENCHMARKS } from '@/data/gamificationData';
import { useQuestStore } from '@/stores/useQuestStore';

export function LeaderboardPage() {
  const displayName = useQuestStore((s) => s.displayName);
  const xpTransactions = useQuestStore((s) => s.xpTransactions);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyXp = xpTransactions
    .filter((t) => new Date(t.createdAt).getTime() >= sevenDaysAgo.getTime())
    .reduce((sum, t) => sum + t.amount, 0);

  const currentTier =
    [...OFFLINE_LEAGUE_BENCHMARKS]
      .reverse()
      .find((b) => weeklyXp >= b.minWeeklyXp) ?? OFFLINE_LEAGUE_BENCHMARKS[0];

  return (
    <div className="space-y-6">
      <div>
        <PillBadge tone="gold">
          <Trophy className="h-3.5 w-3.5" />
          League Tiers
        </PillBadge>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Weekly League Standing</h1>
        <p className="mt-1 text-sm font-semibold text-[#666666]">
          Track your 7-day learning XP against milestone league thresholds.
        </p>
      </div>

      <HonestNotice
        title="Phase 1 Offline Mode — Live Multiplayer Leaderboard Unlocks in Phase 2"
        description="Because Phase 1 stores progress locally without a backend server, we do not fabricate simulated opponent scores. Below is your real 7-day XP compared against transparent league tier milestones; authenticated peer leaderboards arrive in Phase 2."
      />

      <QuestCard className="border-[#FFC800] bg-[#FFFBEB]/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-[#A67800]">Your Active League Tier</p>
            <h2 className="mt-1 text-2xl font-black text-[#3C3C3C]">{currentTier.tier}</h2>
            <p className="mt-0.5 text-sm font-bold text-[#666666]">
              Learner: {displayName}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-[#FFE175] bg-white px-5 py-3 text-center">
            <p className="text-xs font-black uppercase text-[#777777]">Your 7-Day XP</p>
            <p className="text-3xl font-black text-[#58CC02]">{weeklyXp}</p>
          </div>
        </div>
      </QuestCard>

      <div className="space-y-3">
        {OFFLINE_LEAGUE_BENCHMARKS.map((tier) => {
          const unlocked = weeklyXp >= tier.minWeeklyXp;
          const target = Math.max(1, tier.minWeeklyXp);
          return (
            <QuestCard key={tier.tier} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-black"
                    style={{ backgroundColor: tier.badgeColor }}
                  >
                    <Trophy className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-black text-[#3C3C3C]">{tier.tier}</p>
                    <p className="text-xs font-bold text-[#777777]">
                      Threshold: {tier.minWeeklyXp} XP / 7 days
                    </p>
                  </div>
                </div>
                <PillBadge tone={unlocked ? 'green' : 'neutral'}>
                  {unlocked ? 'Reached' : `${tier.minWeeklyXp - weeklyXp} XP to go`}
                </PillBadge>
              </div>
              {tier.minWeeklyXp > 0 && (
                <QuestProgressBar
                  value={Math.min(weeklyXp, target)}
                  max={target}
                  color={tier.badgeColor}
                  heightClass="h-2.5"
                  label={tier.tier}
                />
              )}
            </QuestCard>
          );
        })}
      </div>
    </div>
  );
}
