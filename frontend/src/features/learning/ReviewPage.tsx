import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Award, CheckCircle2, Flame, RotateCcw, ShieldCheck, Target } from 'lucide-react';
import { normalizeAnswer, toLocalDateKey, UNOFFICIAL_IELTS_NOTICE } from '@english-quest/shared';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import {
  buildPersonalizedDailyPlan,
  clusterUnresolvedMistakes,
  getTodayMinutes,
} from '@/services/curriculumService';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function ReviewPage() {
  const skillStats = useQuestStore((s) => s.skillStats);
  const mistakes = useQuestStore((s) => s.mistakes);
  const vocabularySchedules = useQuestStore((s) => s.vocabularySchedules);
  const lessonProgress = useQuestStore((s) => s.lessonProgress);
  const unitAssessmentResults = useQuestStore((s) => s.unitAssessmentResults);
  const ieltsMockHistory = useQuestStore((s) => s.ieltsMockHistory);
  const ieltsPathway = useQuestStore((s) => s.ieltsPathway);
  const recommendedCefr = useQuestStore((s) => s.recommendedCefr);
  const preferences = useQuestStore((s) => s.preferences);
  const studyMinutesByDate = useQuestStore((s) => s.studyMinutesByDate);
  const streak = useQuestStore((s) => s.streak);
  const xpTransactions = useQuestStore((s) => s.xpTransactions);
  const resolveMistake = useQuestStore((s) => s.resolveMistake);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [retryInputs, setRetryInputs] = useState<Record<string, string>>({});
  const [retryFeedback, setRetryFeedback] = useState<Record<string, string>>({});
  const [mistakeClusterFilter, setMistakeClusterFilter] = useState<string>('all');

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
        purpose: preferences.purpose,
        ieltsPathway,
        ieltsTargetBand: preferences.ieltsTargetBand,
        ieltsMockHistory,
        unitAssessmentResults,
      }),
    [
      skillStats,
      mistakes,
      vocabularySchedules,
      lessonProgress,
      recommendedCefr,
      preferences.dailyGoalMinutes,
      preferences.purpose,
      preferences.ieltsTargetBand,
      studyMinutesByDate,
      ieltsPathway,
      ieltsMockHistory,
      unitAssessmentResults,
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

  const ieltsTrendData = useMemo(() => {
    return [...(ieltsMockHistory ?? [])]
      .slice(0, 8)
      .reverse()
      .map((m, idx) => ({
        run: `Mock #${idx + 1}`,
        Overall: m.overallBand,
        Listening: m.listeningBand,
        Reading: m.readingBand,
        Writing: m.writingBand,
        Speaking: m.speakingBand,
      }));
  }, [ieltsMockHistory]);

  const totalAttempts = Object.values(skillStats).reduce((s, k) => s + k.attempts, 0);
  const totalCorrect = Object.values(skillStats).reduce((s, k) => s + k.correct, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null;
  const passedUnitAssessments = Object.values(unitAssessmentResults ?? {}).filter((r) => r.passed).length;
  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);
  const mistakeClusters = useMemo(() => clusterUnresolvedMistakes(mistakes), [mistakes]);

  const visibleMistakes = useMemo(() => {
    if (mistakeClusterFilter === 'all') return unresolvedMistakes;
    return unresolvedMistakes.filter((m) => `${m.skill}:${m.source}` === mistakeClusterFilter);
  }, [unresolvedMistakes, mistakeClusterFilter]);

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
          Review, Adaptive Planner & Real Analytics
        </PillBadge>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Personalized Study Plan & Performance Hub</h1>
        <p className="mt-1 text-sm font-semibold text-[#666666]">
          Rule-based recommendations and charts computed strictly from your logged activity—zero simulated figures.
        </p>
      </div>

      {/* Rule-Based Adaptive Study Plan */}
      <QuestCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black">Today’s Rule-Based Adaptive Study Plan</h2>
          <PillBadge tone="blue">Daily Goal: {getTodayMinutes(studyMinutesByDate)} / {preferences.dailyGoalMinutes} min</PillBadge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {dailyPlan.map((item) => (
            <Link
              key={item.id}
              to={item.route}
              className="flex items-start justify-between gap-3 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4 hover:border-[#1CB0F6] hover:bg-[#F2FAFF]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase ${
                      item.priority === 'high' ? 'text-[#D32F2F]' : 'text-[#0E8BC9]'
                    }`}
                  >
                    {item.priority} priority • ~{item.estimatedMinutes}m
                  </span>
                  <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-black uppercase text-[#666666] border border-[#E5E5E5]">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>
                <p className="mt-0.5 font-black text-[#3C3C3C]">{item.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-[#666666]">{item.reason}</p>
              </div>
            </Link>
          ))}
        </div>
      </QuestCard>

      {/* Mistake Diagnostic Notebook with Pattern Clustering */}
      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black">
            Mistake Diagnostic Notebook ({unresolvedMistakes.length} active)
          </h2>
          <span className="text-xs font-black text-[#46A302]">
            {mistakes.filter((m) => m.resolved).length} resolved
          </span>
        </div>

        {mistakeClusters.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Mistake pattern clusters">
            <button
              type="button"
              onClick={() => setMistakeClusterFilter('all')}
              className={`rounded-xl border-2 px-3 py-1 text-xs font-black ${
                mistakeClusterFilter === 'all'
                  ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              All Active ({unresolvedMistakes.length})
            </button>
            {mistakeClusters.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setMistakeClusterFilter(c.key)}
                className={`rounded-xl border-2 px-3 py-1 text-xs font-black capitalize ${
                  mistakeClusterFilter === c.key
                    ? 'border-[#FF9600] bg-[#FFFBEB] text-[#8A5A00]'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                {c.skill} ({c.source}): {c.count}
              </button>
            ))}
          </div>
        )}

        {unresolvedMistakes.length === 0 ? (
          <div className="rounded-2xl bg-[#E9FCD9]/60 p-5 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#46A302]" />
            <p className="mt-2 font-black text-[#3C3C3C]">No unresolved mistakes right now!</p>
            <p className="text-xs font-semibold text-[#666666]">
              Incorrect answers across CEFR lessons, assessments, Listening, Reading, or IELTS mocks cluster automatically here for targeted retry.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleMistakes.map((m) => (
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

      {/* Real Progress Dashboard Metrics */}
      <HonestNotice
        title="Separate Skill & Band Estimates (Unofficial)"
        description="Per-skill CEFR proficiency and mock band indicators reflect your stored practice accuracy and minutes inside English Quest—not official CEFR/IELTS certificates."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <p className="mt-0.5 text-xs font-semibold text-[#666666]">Across A1–C2 path (264 lessons)</p>
        </QuestCard>
        <QuestCard className="text-center">
          <p className="text-xs font-black uppercase text-[#777777]">Unit Mastery Exams</p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-3xl font-black text-[#8E3FD6]">
            <Award className="h-7 w-7" />
            {passedUnitAssessments}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#666666]">Passed across CEFR units</p>
        </QuestCard>
      </div>

      {/* Real IELTS Mock Progression Chart */}
      <QuestCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black">IELTS Mock Readiness Progression (Unofficial)</h2>
            <p className="text-xs font-semibold text-[#666666]">{UNOFFICIAL_IELTS_NOTICE}</p>
          </div>
          <Link to="/ielts">
            <TactileButton variant="purple" size="sm">
              <Target className="h-4 w-4" />
              Open Mock Center
            </TactileButton>
          </Link>
        </div>

        {ieltsTrendData.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-[#E5E5E5] bg-[#F7F8FA] p-6 text-center space-y-2">
            <p className="text-sm font-black text-[#3C3C3C]">No Completed 4-Skill Mock Runs Yet</p>
            <p className="text-xs font-semibold text-[#666666]">
              Complete an Academic or General Training Mock inside the IELTS Mastery Center to plot real Listening, Reading, Writing, and Speaking band trends here.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height={240} minWidth={220}>
              <LineChart data={ieltsTrendData} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
                <XAxis dataKey="run" />
                <YAxis domain={[0, 9]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Overall" stroke="#8E3FD6" strokeWidth={3} />
                <Line type="monotone" dataKey="Listening" stroke="#1CB0F6" strokeWidth={2} />
                <Line type="monotone" dataKey="Reading" stroke="#58CC02" strokeWidth={2} />
                <Line type="monotone" dataKey="Writing" stroke="#FFC800" strokeWidth={2} />
                <Line type="monotone" dataKey="Speaking" stroke="#CE82FF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </QuestCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <QuestCard>
          <h3 className="text-base font-black mb-3">Skill Proficiency Radar (Real Activity)</h3>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height={240} minWidth={220}>
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
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height={240} minWidth={220}>
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
