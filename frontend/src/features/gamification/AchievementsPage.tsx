import { Award, CheckCircle2, Lock } from 'lucide-react';
import { PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { ACHIEVEMENTS_CATALOG } from '@/data/gamificationData';
import { useQuestStore } from '@/stores/useQuestStore';

export function AchievementsPage() {
  const achievementsUnlocked = useQuestStore((s) => s.achievementsUnlocked);
  const lessonProgress = useQuestStore((s) => s.lessonProgress);
  const xp = useQuestStore((s) => s.xp);
  const streak = useQuestStore((s) => s.streak);
  const vocabularySchedules = useQuestStore((s) => s.vocabularySchedules);
  const listeningHistory = useQuestStore((s) => s.listeningHistory);
  const speakingSessions = useQuestStore((s) => s.speakingSessions);
  const readingHistory = useQuestStore((s) => s.readingHistory);
  const writingSubmissions = useQuestStore((s) => s.writingSubmissions);
  const mistakes = useQuestStore((s) => s.mistakes);
  const claimedChests = useQuestStore((s) => s.claimedChests);

  const metrics: Record<string, number> = {
    lessons_completed: Object.keys(lessonProgress).length,
    xp_total: xp,
    streak_days: streak.currentDays,
    vocab_mastered: Object.values(vocabularySchedules).filter((s) => s.repetitions >= 1).length,
    listening_completed: listeningHistory.length,
    speaking_completed: speakingSessions.length,
    reading_completed: readingHistory.length,
    writing_completed: writingSubmissions.length,
    mistakes_resolved: mistakes.filter((m) => m.resolved).length,
    units_completed: claimedChests.length,
  };

  const unlockedCount = Object.keys(achievementsUnlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="purple">
            <Award className="h-3.5 w-3.5" />
            Achievements & Skill Badges
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Your Milestones</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Every badge unlocks automatically from real completed activities.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2 text-right">
          <p className="text-xs font-extrabold uppercase text-[#777777]">Unlocked</p>
          <p className="text-lg font-black text-[#8E3FD6]">
            {unlockedCount}/{ACHIEVEMENTS_CATALOG.length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ACHIEVEMENTS_CATALOG.map((ach) => {
          const unlockedAt = achievementsUnlocked[ach.id];
          const cur = metrics[ach.metric] ?? 0;
          return (
            <QuestCard
              key={ach.id}
              className={`space-y-3 ${unlockedAt ? 'border-[#B8EE8A] bg-[#F6FFF0]/70' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: unlockedAt ? ach.color : '#CCCCCC' }}
                  >
                    {unlockedAt ? <Award className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div>
                    <h2 className="font-black text-[#3C3C3C]">{ach.title}</h2>
                    <p className="text-xs font-semibold text-[#666666]">{ach.description}</p>
                  </div>
                </div>
                {unlockedAt && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#58CC02]" />}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <QuestProgressBar
                    value={Math.min(cur, ach.targetValue)}
                    max={ach.targetValue}
                    color={ach.color}
                    heightClass="h-2.5"
                    label={ach.title}
                  />
                </div>
                <span className="text-xs font-black text-[#555555]">
                  {Math.min(cur, ach.targetValue)}/{ach.targetValue}
                </span>
              </div>
              {unlockedAt && (
                <p className="text-[11px] font-bold text-[#46A302]">
                  Unlocked on {new Date(unlockedAt).toLocaleDateString()}
                </p>
              )}
            </QuestCard>
          );
        })}
      </div>
    </div>
  );
}
