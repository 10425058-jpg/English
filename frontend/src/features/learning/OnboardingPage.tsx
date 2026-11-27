import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import {
  evaluateExerciseAnswer,
  type CEFRLevel,
  type DailyGoalMinutes,
  type EnglishAccent,
  type LearningPurpose,
  type SkillTag,
} from '@english-quest/shared';
import { PipMascot } from '@/components/mascot/PipMascot';
import { TactileButton } from '@/components/ui/TactileButton';
import { PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { evaluatePlacementLevel, PLACEMENT_QUESTIONS } from '@/data/placementTest';
import { useQuestStore } from '@/stores/useQuestStore';

const DAILY_GOALS: DailyGoalMinutes[] = [5, 15, 30, 60, 90];
const PURPOSES: Array<{ id: LearningPurpose; label: string }> = [
  { id: 'everyday', label: 'Everyday Conversation' },
  { id: 'career', label: 'Career & Workplace' },
  { id: 'ielts', label: 'IELTS Preparation' },
  { id: 'travel', label: 'Travel & Culture' },
  { id: 'academic', label: 'Academic Study' },
  { id: 'confidence', label: 'Speak with Confidence' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const storePrefs = useQuestStore((s) => s.preferences);
  const storeName = useQuestStore((s) => s.displayName);
  const completeOnboarding = useQuestStore((s) => s.completeOnboarding);

  const [step, setStep] = useState<'profile' | 'goals' | 'placement' | 'result'>('profile');
  const [displayName, setDisplayName] = useState(storeName);
  const [nativeLanguage, setNativeLanguage] = useState(storePrefs.nativeLanguage);
  const [selfAssessedLevel, setSelfAssessedLevel] = useState<CEFRLevel>(storePrefs.selfAssessedLevel);
  const [purpose, setPurpose] = useState<LearningPurpose>(storePrefs.purpose);
  const [targetCefr, setTargetCefr] = useState<CEFRLevel>(storePrefs.targetCefr);
  const [ieltsTargetBand, setIeltsTargetBand] = useState<number>(storePrefs.ieltsTargetBand);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<DailyGoalMinutes>(storePrefs.dailyGoalMinutes);
  const [preferredAccent, setPreferredAccent] = useState<EnglishAccent>(storePrefs.preferredAccent);
  const [prioritySkills, setPrioritySkills] = useState<SkillTag[]>(storePrefs.prioritySkills);

  // Placement state
  const [qIndex, setQIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>('');
  const [correctCount, setCorrectCount] = useState(0);
  const [placementDone, setPlacementDone] = useState<'completed' | 'skipped'>('skipped');
  const [recommendedCefr, setRecommendedCefr] = useState<CEFRLevel>('A1');
  const [summaryText, setSummaryText] = useState('');

  const togglePrioritySkill = (skill: SkillTag) => {
    setPrioritySkills((prev) =>
      prev.includes(skill) ? (prev.length > 1 ? prev.filter((s) => s !== skill) : prev) : [...prev, skill]
    );
  };

  const handleManualFinish = (manualLevel: CEFRLevel) => {
    setRecommendedCefr(manualLevel);
    setPlacementDone('skipped');
    setSummaryText(
      `Manual starting point selected: ${manualLevel}. All earlier units stay unlocked so you can review anytime.`
    );
    setStep('result');
  };

  const handlePlacementNext = () => {
    const q = PLACEMENT_QUESTIONS[qIndex];
    const evalResult = evaluateExerciseAnswer(q.exercise, currentAnswer);
    const nextCorrect = correctCount + (evalResult.isCorrect ? 1 : 0);
    setCorrectCount(nextCorrect);

    if (qIndex + 1 >= PLACEMENT_QUESTIONS.length) {
      const outcome = evaluatePlacementLevel(nextCorrect, PLACEMENT_QUESTIONS.length);
      setRecommendedCefr(outcome.recommendedCefr);
      setSummaryText(outcome.summary);
      setPlacementDone('completed');
      setStep('result');
      return;
    }

    setQIndex((i) => i + 1);
    setCurrentAnswer('');
  };

  const handleEnterApp = () => {
    completeOnboarding({
      displayName,
      preferences: {
        nativeLanguage,
        selfAssessedLevel,
        purpose,
        targetCefr,
        ieltsTargetBand,
        dailyGoalMinutes,
        preferredAccent,
        prioritySkills,
      },
      placementStatus: placementDone,
      recommendedCefr,
    });
    navigate('/learn');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PipMascot mood="happy" size={54} />
            <div>
              <h1 className="text-2xl font-black text-[#3C3C3C]">Welcome to English Quest</h1>
              <p className="text-sm font-bold text-[#666666]">
                Personalize your CEFR path and daily study rhythm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleManualFinish(selfAssessedLevel)}
            className="text-xs font-extrabold text-[#1CB0F6] hover:underline"
          >
            Skip to Learn
          </button>
        </div>

        {step === 'profile' && (
          <QuestCard className="space-y-5 p-6">
            <PillBadge tone="green">Step 1 of 3 • Learner Profile</PillBadge>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-extrabold mb-1.5" htmlFor="onb-name">
                  Display Name
                </label>
                <input
                  id="onb-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2.5 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold mb-1.5" htmlFor="onb-native">
                  Native Language
                </label>
                <select
                  id="onb-native"
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2.5 text-sm font-bold"
                >
                  <option value="Vietnamese">Vietnamese (Tiếng Việt)</option>
                  <option value="English">English</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-sm font-extrabold mb-2">Main Learning Purpose</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {PURPOSES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPurpose(p.id)}
                    className={`rounded-2xl border-2 border-b-4 px-3 py-2.5 text-left text-xs font-extrabold transition ${
                      purpose === p.id
                        ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                        : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-extrabold mb-2">Current Estimated English Level</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelfAssessedLevel(lvl)}
                    className={`rounded-xl border-2 border-b-4 py-2 text-sm font-black ${
                      selfAssessedLevel === lvl
                        ? 'border-[#58CC02] bg-[#E9FCD9] text-[#46A302]'
                        : 'border-[#E5E5E5] bg-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <TactileButton onClick={() => setStep('goals')}>
                Next: Study Goals
                <ArrowRight className="h-4 w-4" />
              </TactileButton>
            </div>
          </QuestCard>
        )}

        {step === 'goals' && (
          <QuestCard className="space-y-5 p-6">
            <PillBadge tone="blue">Step 2 of 3 • Targets & Accent</PillBadge>

            <div>
              <p className="text-sm font-extrabold mb-2">Daily Study Duration Goal</p>
              <div className="grid grid-cols-5 gap-2">
                {DAILY_GOALS.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyGoalMinutes(mins)}
                    className={`rounded-xl border-2 border-b-4 py-2.5 text-center text-sm font-black ${
                      dailyGoalMinutes === mins
                        ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                        : 'border-[#E5E5E5] bg-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-extrabold mb-1.5" htmlFor="onb-target">
                  Target CEFR Level
                </label>
                <select
                  id="onb-target"
                  value={targetCefr}
                  onChange={(e) => setTargetCefr(e.target.value as CEFRLevel)}
                  className="w-full rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2 text-sm font-bold"
                >
                  {(['A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-extrabold mb-1.5" htmlFor="onb-ielts">
                  IELTS Target Band
                </label>
                <select
                  id="onb-ielts"
                  value={ieltsTargetBand}
                  onChange={(e) => setIeltsTargetBand(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2 text-sm font-bold"
                >
                  {[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5].map((b) => (
                    <option key={b} value={b}>
                      Band {b.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm font-extrabold mb-1.5">Preferred Accent</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: 'en-US', label: 'US' },
                    { id: 'en-GB', label: 'UK' },
                  ] as const).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setPreferredAccent(a.id)}
                      className={`rounded-xl border-2 border-b-4 py-2 text-sm font-black ${
                        preferredAccent === a.id
                          ? 'border-[#CE82FF] bg-[#F5E8FF] text-[#8E3FD6]'
                          : 'border-[#E5E5E5] bg-white'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-extrabold mb-2">Priority Skills (select 1 or more)</p>
              <div className="flex flex-wrap gap-2">
                {(['listening', 'speaking', 'reading', 'writing', 'vocabulary', 'grammar'] as SkillTag[]).map(
                  (sk) => {
                    const active = prioritySkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => togglePrioritySkill(sk)}
                        className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-extrabold capitalize ${
                          active
                            ? 'border-[#58CC02] bg-[#E9FCD9] text-[#46A302]'
                            : 'border-[#E5E5E5] bg-white text-[#666666]'
                        }`}
                      >
                        {sk}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <TactileButton variant="outline" onClick={() => setStep('profile')}>
                Back
              </TactileButton>
              <div className="flex flex-wrap gap-2">
                <TactileButton
                  variant="outline"
                  onClick={() => handleManualFinish(selfAssessedLevel === 'A1' || selfAssessedLevel === 'A2' || selfAssessedLevel === 'B1' ? selfAssessedLevel : 'B1')}
                >
                  Skip Test & Start at {selfAssessedLevel}
                </TactileButton>
                <TactileButton onClick={() => setStep('placement')}>
                  Take 10-Question Placement Check
                  <ArrowRight className="h-4 w-4" />
                </TactileButton>
              </div>
            </div>
          </QuestCard>
        )}

        {step === 'placement' && (
          <QuestCard className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <PillBadge tone="purple">
                Placement Check • Question {qIndex + 1}/{PLACEMENT_QUESTIONS.length}
              </PillBadge>
              <button
                type="button"
                onClick={() => handleManualFinish('A1')}
                className="text-xs font-extrabold text-[#777777] hover:underline"
              >
                Skip & Start A1
              </button>
            </div>
            <QuestProgressBar
              value={qIndex + 1}
              max={PLACEMENT_QUESTIONS.length}
              color="#CE82FF"
              label="Placement test progress"
            />

            <ExerciseRenderer
              key={PLACEMENT_QUESTIONS[qIndex].id}
              exercise={PLACEMENT_QUESTIONS[qIndex].exercise}
              accent={preferredAccent}
              speechRate={1.0}
              disabled={false}
              value={currentAnswer}
              onChange={setCurrentAnswer}
            />

            <div className="flex justify-end">
              <TactileButton
                disabled={Array.isArray(currentAnswer) ? currentAnswer.length === 0 : !currentAnswer.trim()}
                onClick={handlePlacementNext}
              >
                {qIndex + 1 === PLACEMENT_QUESTIONS.length ? 'See Recommended Path' : 'Next Question'}
              </TactileButton>
            </div>
          </QuestCard>
        )}

        {step === 'result' && (
          <QuestCard className="space-y-5 p-7 text-center">
            <PipMascot mood="celebrating" size={110} />
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E9FCD9] px-4 py-1.5 text-sm font-black text-[#46A302]">
              <CheckCircle2 className="h-5 w-5" />
              Recommended Starting Tier: {recommendedCefr}
            </div>
            <h2 className="text-2xl font-black">Your Personalized English Quest Path Is Ready!</h2>
            <p className="text-sm font-semibold text-[#555555] leading-relaxed">{summaryText}</p>

            <div className="grid grid-cols-3 gap-3 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4 text-left text-xs font-bold">
              <div>
                <p className="text-[#777777] uppercase">Daily Goal</p>
                <p className="mt-1 text-base font-black text-[#3C3C3C]">{dailyGoalMinutes} min/day</p>
              </div>
              <div>
                <p className="text-[#777777] uppercase">Target CEFR</p>
                <p className="mt-1 text-base font-black text-[#3C3C3C]">{targetCefr}</p>
              </div>
              <div>
                <p className="text-[#777777] uppercase">Voice Accent</p>
                <p className="mt-1 text-base font-black text-[#3C3C3C]">
                  {preferredAccent === 'en-GB' ? 'British (UK)' : 'American (US)'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold text-[#777777]">Want a different start?</span>
              {(['A1', 'A2', 'B1'] as CEFRLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setRecommendedCefr(lvl)}
                  className={`rounded-xl border-2 px-3 py-1 text-xs font-black ${
                    recommendedCefr === lvl
                      ? 'border-[#58CC02] bg-[#E9FCD9] text-[#46A302]'
                      : 'border-[#E5E5E5] bg-white'
                  }`}
                >
                  Start {lvl}
                </button>
              ))}
            </div>

            <TactileButton size="lg" fullWidth onClick={handleEnterApp}>
              <Sparkles className="h-5 w-5" />
              Start Learning Path
            </TactileButton>
          </QuestCard>
        )}
      </div>
    </div>
  );
}
