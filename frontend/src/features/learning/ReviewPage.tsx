import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle2, Flame, RotateCcw, ShieldCheck } from 'lucide-react';
import { normalizeAnswer, toLocalDateKey } from '@english-quest/shared';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { buildPersonalizedDailyPlan, getTodayMinutes } from '@/services/curriculumService';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function ReviewPage() {
  const skillStats = useQuestStore((s) => s.skillStats);
  const mistakes = useQuestStore((s) => s.mistakes);
  const vocabularySchedules = useQuestStore((s) => s.vocabularySchedules);
  const lessonProgress = useQuestStore((s) => s.lessonProgress);
  const recommendedCefr = useQuestStore((s) => s.recommendedCefr);
  const preferences = useQuestStore((s) => s.preferences);
  const studyMinutesByDate = useQuestStore((s) => s.studyMinutesByDate);
  const streak = useQuestStore((s) => s.streak);
  const xpTransactions = useQuestStore((s) => s.xpTransactions);
  const resolveMistake = useQuestStore((s) => s.resolveMistake);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [retryInputs, setRetryInputs] = useState<Record<string, string>>({});
  const [retryFeedback, setRetryFeedback] = useState<Record<string, string>>({});

  const dailyPlan = useMemo(
    () =>
      buildPersonalizedDailyPlan({
        skillStats,
        mistakes,
        vocabularySchedules,
        lessonProgress,
        recommendedCefr,
        dailyGoalMinutes: preferences.dailyGoalMinutes,
        studyMinutesToday: getTodayMinutes(studyMinutesByDate),
      }),
    [
      skillStats,
      mistakes,
      vocabularySchedules,
      lessonProgress,
      recommendedCefr,
      preferences.dailyGoalMinutes,
      studyMinutesByDate,
    ]
  );

  // Real 4-skill + Vocab/Grammar radar data derived strictly from stored activity
  const radarData = useMemo(() => {
    const skills = ['listening', 'speaking', 'reading', 'writing', 'vocabulary', 'grammar'] as const;
    return skills.map((sk) => {
      const st = skillStats[sk];
      const score =
        st.attempts > 0
          ? Math.min(100, Math.round((st.correct / st.attempts) * 70 + Math.min(30, st.minutesPracticed * 2)))
          : 0;
      return {
        skill: sk.charAt(0).toUpperCase() + sk.slice(1),
        proficiency: score,
        cefr: st.estimatedCefr,
      };
    });
  }, [skillStats]);

  // Last 7 days real study minutes & XP
  const weeklyChartData = useMemo(() => {
    const days: Array<{ day: string; minutes: number; xp: number }> = [];
    for (let offset = 6; offset >= 0; offset--) {
      const d = new Date();
      d.setDate(d.getDate() - offset);
      const key = toLocalDateKey(d);
      const label = d.toLocaleDateString(undefined, { weekday: 'short' });
      const xpForDay = xpTransactions
        .filter((t) => t.createdAt.startsWith(key))
        .reduce((acc, t) => acc + t.amount, 0);
      days.push({
        day: label,
        minutes: studyMinutesByDate[key] ?? 0,
        xp: xpForDay,
      });
    }
    return days;
  }, [studyMinutesByDate, xpTransactions]);

  const totalAttempts = Object.values(skillStats).reduce((s, k) => s + k.attempts, 0);
  const totalCorrect = Object.values(skillStats).reduce((s, k) => s + k.correct, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null;

  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);

  const handleRetryMistake = (mistakeId: string, expectedAnswer: string) => {
    const attempt = retryInputs[mistakeId] ?? '';
    if (!attempt.trim()) return;
    if (normalizeAnswer(attempt) === normalizeAnswer(expectedAnswer)) {
      resolveMistake(mistakeId);
      awardActivityXp({
        idempotencyKey: `mistake-resolve-${mistakeId}`,
        amount: 10,
        source: 'mistake_retry',
        referenceId: mistakeId,
        minutes: 1,
      });
      playFeedbackTone('correct', preferences.soundEffects);
      setRetryFeedback((prev) => ({ ...prev, [mistakeId]: 'Resolved! +10 XP earned.' }));
    } else {
      playFeedbackTone('wrong', preferences.soundEffects);
      setRetryFeedback((prev) => ({
        ...prev,
        [mistakeId]: `Close—compare carefully with: "${expectedAnswer}"`,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <PillBadge tone="green">
          <RotateCcw className="h-3.5 w-3.5" />
          Review, Mistake Notebook & Real Analytics
        </PillBadge>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Personalized Daily Plan & Progress</h1>
        <p className="mt-1 text-sm font-semibold text-[#666666]">
          All statistics below come strictly from your actual recorded practice—never simulated numbers.
        </p>
      </div>

      {/* Personalized Daily Plan */}
      <QuestCard className="space-y-3">
        <h2 className="text-lg font-black">Today’s Personalized Plan</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {dailyPlan.map((item) => (
            <Link
              key={item.id}
              to={item.route}
              className="flex items-start justify-between gap-3 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4 hover:border-[#1CB0F6] hover:bg-[#F2FAFF]"
            >
              <div>
                <span
                  className={`text-[10px] font-black uppercase ${
                    item.priority === 'high' ? 'text-[#D32F2F]' : 'text-[#0E8BC9]'
                  }`}
                >
                  {item.priority} priority • ~{item.estimatedMinutes}m
                </span>
                <p className="mt-0.5 font-black text-[#3C3C3C]">{item.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-[#666666]">{item.reason}</p>
              </div>
            </Link>
          ))}
        </div>
      </QuestCard>

      {/* Mistake Notebook */}
      <QuestCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">
            Mistake Notebook ({unresolvedMistakes.length} active)
          </h2>
          <span className="text-xs font-black text-[#46A302]">
            {mistakes.filter((m) => m.resolved).length} resolved
          </span>
        </div>

        {unresolvedMistakes.length === 0 ? (
          <div className="rounded-2xl bg-[#E9FCD9]/60 p-5 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#46A302]" />
            <p className="mt-2 font-black text-[#3C3C3C]">No unresolved mistakes right now!</p>
            <p className="text-xs font-semibold text-[#666666]">
              Any incorrect answer from lessons, listening, reading, or grammar automatically appears here for targeted retry.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {unresolvedMistakes.map((m) => (
              <div key={m.id} className="rounded-2xl border-2 border-[#FFB8B8] bg-[#FFF8F8] p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-black uppercase text-[#D32F2F]">
                  <span>
                    {m.cefrLevel} • {m.skill} • {m.source}
                  </span>
                </div>
                <p className="font-black text-[#3C3C3C]">{m.prompt}</p>
                <p className="text-xs font-bold text-[#777777]">
                  Your earlier answer: <span className="text-[#D32F2F]">{m.userAnswer}</span>
                </p>
                <p className="text-xs font-bold text-[#3C3C3C]">{m.explanation}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <input
                    type="text"
                    value={retryInputs[m.id] ?? ''}
                    onChange={(e) => setRetryInputs((p) => ({ ...p, [m.id]: e.target.value }))}
                    placeholder="Type the corrected answer..."
                    className="min-w-[200px] flex-1 rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-bold"
                  />
                  <TactileButton
                    size="sm"
                    onClick={() => handleRetryMistake(m.id, m.expectedAnswer)}
                  >
                    Retry & Resolve
                  </TactileButton>
                </div>
                {retryFeedback[m.id] && (
                  <p className="text-xs font-black text-[#0E8BC9]">{retryFeedback[m.id]}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </QuestCard>

      {/* Real Progress Dashboard Charts */}
      <HonestNotice
        title="Separate Skill Estimates (Unofficial)"
        description="Per-skill CEFR estimates reflect your real stored exercise accuracy and practice minutes inside English Quest—not an official CEFR certification."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <QuestCard className="text-center">
          <p className="text-xs font-black uppercase text-[#777777]">Exercise Accuracy</p>
          <p className="mt-1 text-3xl font-black text-[#58CC02]">
            {overallAccuracy === null ? 'No data yet' : `${overallAccuracy}%`}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#666666]">
            {totalCorrect}/{totalAttempts} answers correct
          </p>
        </QuestCard>
        <QuestCard className="text-center">
          <p className="text-xs font-black uppercase text-[#777777]">Current Streak</p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-3xl font-black text-[#FF9600]">
            <Flame className="h-7 w-7" />
            {streak.currentDays}d
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#666666]">Best: {streak.longestDays} days</p>
        </QuestCard>
        <QuestCard className="text-center">
          <p className="text-xs font-black uppercase text-[#777777]">Lessons Completed</p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-3xl font-black text-[#1CB0F6]">
            <CheckCircle2 className="h-7 w-7" />
            {Object.keys(lessonProgress).length}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#666666]">Across A1–B1 path</p>
        </QuestCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <QuestCard>
          <h3 className="text-base font-black mb-3">Skill Proficiency Radar (Real Activity)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E5E5" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#3C3C3C', fontSize: 12, fontWeight: 700 }} />
                <Radar
                  name="Proficiency"
                  dataKey="proficiency"
                  stroke="#58CC02"
                  fill="#58CC02"
                  fillOpacity={0.35}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs font-bold">
            {radarData.map((r) => (
              <div key={r.skill} className="rounded-lg bg-[#F7F8FA] px-2.5 py-1.5 flex justify-between">
                <span>{r.skill}</span>
                <span className="font-black text-[#0E8BC9]">{r.cefr}</span>
              </div>
            ))}
          </div>
        </QuestCard>

        <QuestCard>
          <h3 className="text-base font-black mb-3">7-Day Study Minutes & XP</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData}>
                <XAxis dataKey="day" tick={{ fill: '#666666', fontSize: 12, fontWeight: 700 }} />
                <YAxis tick={{ fill: '#666666', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="xp" name="XP Earned" fill="#1CB0F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="minutes" name="Minutes" fill="#58CC02" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </QuestCard>
      </div>
    </div>
  );
}
