import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Brain,
  CheckCircle2,
  Eye,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  Volume2,
} from 'lucide-react';
import type { CEFRLevel, ThinkInEnglishActivity } from '@english-quest/shared';
import { CEFR_LEVELS, loadThinkInEnglish } from '@content/index';
import { HonestNotice, PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone, speakText } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

const MODE_LABELS: Record<ThinkInEnglishActivity['mode'], string> = {
  object_naming: 'Direct Object Scan',
  daily_narration: 'Live Narration',
  circumlocution: 'Circumlocution Rescue',
  rapid_question: 'Rapid Question Sprint',
  problem_solving: 'Real-Time Problem Solving',
};

export function ThinkInEnglishTab() {
  const preferences = useQuestStore((s) => s.preferences);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds ?? []);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['think-in-english-all'],
    queryFn: loadThinkInEnglish,
    staleTime: Infinity,
  });

  const [cefrFilter, setCefrFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [modeFilter, setModeFilter] = useState<'ALL' | ThinkInEnglishActivity['mode']>('ALL');
  const [selectedId, setSelectedId] = useState('thk-m2-01');
  const [secondsLeft, setSecondsLeft] = useState<number>(15);
  const [running, setRunning] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [loggedMsg, setLoggedMsg] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      activities.filter((a) => {
        if (cefrFilter !== 'ALL' && a.cefrLevel !== cefrFilter) return false;
        if (modeFilter !== 'ALL' && a.mode !== modeFilter) return false;
        return true;
      }),
    [activities, cefrFilter, modeFilter]
  );

  const active =
    activities.find((a) => a.id === selectedId) ?? filtered[0] ?? activities[0];

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          playFeedbackTone('celebrate', preferences.soundEffects);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, preferences.soundEffects]);

  const handleSelect = (item: ThinkInEnglishActivity) => {
    setSelectedId(item.id);
    setSecondsLeft(item.durationSeconds);
    setRunning(false);
    setNotesDraft('');
    setShowSample(false);
    setLoggedMsg(null);
  };

  const handleLogSprint = () => {
    if (!active) return;
    markAcademyCompleted(active.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('think-english', active.id),
      amount: 15,
      source: 'speaking',
      referenceId: active.id,
      skill: 'speaking',
      minutes: Math.max(1, Math.round(active.durationSeconds / 60)),
      correctDelta: 1,
      attemptsDelta: 1,
    });
    playFeedbackTone('celebrate', preferences.soundEffects);
    setLoggedMsg(`Completed "${active.title}" sprint (+15 XP)!`);
  };

  if (isLoading || !active) {
    return (
      <QuestCard>
        <p className="text-sm font-bold text-[#777777]">Loading 30 Think-in-English drills...</p>
      </QuestCard>
    );
  }

  return (
    <div className="space-y-5">
      <HonestNotice
        title="Anti-Translation Mental Speed Training"
        description="Use timed countdown sprints (15s to 300s) to practice bypassing native Vietnamese word-for-word lookup—even when forgetting an exact noun via circumlocution rescues."
      />

      <QuestCard className="space-y-3 bg-[#F7F8FA]">
        <div className="flex flex-wrap gap-1.5">
          {(['ALL', ...CEFR_LEVELS] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setCefrFilter(lvl)}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                cefrFilter === lvl
                  ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setModeFilter('ALL')}
            className={`rounded-xl border-2 px-2.5 py-1 text-[11px] font-black ${
              modeFilter === 'ALL'
                ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                : 'border-[#E5E5E5] bg-white text-[#555555]'
            }`}
          >
            All Modes ({activities.length})
          </button>
          {(Object.keys(MODE_LABELS) as ThinkInEnglishActivity['mode'][]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setModeFilter(mode)}
              className={`rounded-xl border-2 px-2.5 py-1 text-[11px] font-black ${
                modeFilter === mode
                  ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {MODE_LABELS[mode]}
            </button>
          ))}
        </div>

        <div className="grid max-h-56 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const sel = active.id === item.id;
            const done = completedAcademyIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={`flex min-w-0 flex-col justify-between rounded-2xl border-2 p-3 text-left ${
                  sel ? 'border-[#0E8BC9] bg-[#F2FAFF]' : 'border-[#E5E5E5] bg-white hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="rounded-lg bg-[#E3F6FF] px-2 py-0.5 text-[11px] font-black text-[#0E8BC9]">
                    {item.cefrLevel} • {item.durationSeconds}s
                  </span>
                  {done && <CheckCircle2 className="h-4 w-4 text-[#58CC02]" />}
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs font-black text-[#3C3C3C]">
                  {item.title}
                </p>
              </button>
            );
          })}
        </div>
      </QuestCard>

      {/* Active Sprint Studio */}
      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="blue">{active.cefrLevel}</PillBadge>
              <PillBadge tone="purple">{MODE_LABELS[active.mode]}</PillBadge>
              <PillBadge tone="gold">{active.durationSeconds}s Challenge</PillBadge>
            </div>
            <h2 className="mt-2 text-xl font-black text-[#3C3C3C]">{active.title}</h2>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2">
            <Timer className="h-5 w-5 text-[#0E8BC9]" />
            <span className="font-mono text-2xl font-black text-[#3C3C3C]">
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </span>
          </div>
        </div>

        <QuestProgressBar
          value={active.durationSeconds - secondsLeft}
          max={active.durationSeconds}
          color={secondsLeft === 0 ? '#58CC02' : '#1CB0F6'}
          heightClass="h-2.5"
          label="Think in English timer progress"
        />

        <div className="flex flex-wrap gap-2">
          <TactileButton
            variant={running ? 'outline' : 'secondary'}
            size="sm"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? 'Pause Timer' : 'Start Timed Sprint'}
          </TactileButton>
          <TactileButton
            variant="outline"
            size="sm"
            onClick={() => {
              setRunning(false);
              setSecondsLeft(active.durationSeconds);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </TactileButton>
        </div>

        <div className="rounded-2xl border-2 border-[#BCE7FD] bg-[#F2FAFF] p-4 text-sm font-bold text-[#0C5E8A]">
          {active.prompt}
          {active.visualFocus && (
            <p className="mt-1.5 text-xs font-semibold text-[#3C3C3C]">
              Focus cue: {active.visualFocus}
            </p>
          )}
        </div>

        {active.circumlocutionTarget && (
          <div className="rounded-2xl border-2 border-[#FFE175] bg-[#FFFBEB] p-3.5 text-xs">
            <p className="flex items-center gap-1.5 font-black uppercase text-[#9A6E00]">
              <Brain className="h-4 w-4" />
              Circumlocution Clue Hints (speak around the idea!)
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {active.circumlocutionTarget.clues.map((clue) => (
                <PillBadge key={clue} tone="gold">
                  {clue}
                </PillBadge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2.5 rounded-2xl border-2 border-[#E5D4FF] bg-[#FBF6FF] p-3 text-xs">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#8E3FD6]" />
          <div>
            <span className="font-black text-[#6E26B5]">Anti-Translation Coaching: </span>
            <span className="font-semibold text-[#3C3C3C]">{active.antiTranslationTip}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase text-[#777777]">Instant Direct Starters</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {active.starterFrames.map((frame) => (
              <span
                key={frame}
                className="rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3 py-1 text-xs font-bold text-[#3C3C3C]"
              >
                {frame}
              </span>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={notesDraft}
          onChange={(e) => setNotesDraft(e.target.value)}
          placeholder="Optional quick English key-phrase scratchpad (speak aloud continuously first!)..."
          className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#FAFAFA] p-3 text-sm font-semibold text-[#3C3C3C] focus:border-[#1CB0F6] focus:bg-white focus:outline-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <TactileButton
            variant="outline"
            size="sm"
            onClick={() => setShowSample((s) => !s)}
          >
            <Eye className="h-4 w-4" />
            {showSample ? 'Hide Model Stream' : 'Compare Model Direct Flow'}
          </TactileButton>

          <TactileButton variant="primary" size="md" onClick={handleLogSprint}>
            <Sparkles className="h-4 w-4" />
            Log Think-in-English Sprint (+15 XP)
          </TactileButton>
        </div>

        {loggedMsg && <p className="text-xs font-black text-[#46A302]">{loggedMsg}</p>}

        {showSample && (
          <div className="rounded-2xl border-2 border-[#B8EE8A] bg-[#F2FDE9] p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-black uppercase text-[#46A302]">
                Sample Direct English Thought Flow
              </p>
              <button
                type="button"
                aria-label="Play model thought flow"
                onClick={() =>
                  speakText(active.sampleMonologue, { accent: preferences.preferredAccent })
                }
                className="rounded-lg bg-white p-1.5 text-[#46A302]"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm font-semibold leading-6 text-[#2F6E01]">
              {active.sampleMonologue}
            </p>
            {active.circumlocutionTarget && (
              <p className="text-xs font-bold text-[#3C3C3C]">
                Crisp Circumlocution Summary ({active.circumlocutionTarget.targetIdea}):{' '}
                {active.circumlocutionTarget.sampleParaphrase}
              </p>
            )}
          </div>
        )}
      </QuestCard>
    </div>
  );
}
