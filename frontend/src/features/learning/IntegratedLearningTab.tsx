import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Headphones,
  Layers,
  Mic,
  PenTool,
  Sparkles,
} from 'lucide-react';
import type { CEFRLevel, SkillTag } from '@english-quest/shared';
import { CEFR_LEVELS, loadIntegratedSequences } from '@content/index';
import { HonestNotice, PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

const SKILL_ROUTE: Record<SkillTag, { to: string; icon: typeof Headphones; color: string }> = {
  listening: { to: '/listening', icon: Headphones, color: 'text-[#0E8BC9] bg-[#E3F6FF]' },
  reading: { to: '/reading', icon: BookOpen, color: 'text-[#46A302] bg-[#E9FCD9]' },
  speaking: { to: '/speaking', icon: Mic, color: 'text-[#6E26B5] bg-[#F5E8FF]' },
  writing: { to: '/writing', icon: PenTool, color: 'text-[#A67800] bg-[#FFF5CC]' },
  vocabulary: { to: '/vocabulary', icon: Layers, color: 'text-[#0E8BC9] bg-[#E3F6FF]' },
  grammar: { to: '/grammar', icon: Layers, color: 'text-[#46A302] bg-[#E9FCD9]' },
};

export function IntegratedLearningTab() {
  const preferences = useQuestStore((s) => s.preferences);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds ?? []);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const { data: sequences = [], isLoading } = useQuery({
    queryKey: ['integrated-sequences'],
    queryFn: loadIntegratedSequences,
    staleTime: Infinity,
  });

  const [cefrFilter, setCefrFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [selectedId, setSelectedId] = useState('int-m2-01');
  const [doneBanner, setDoneBanner] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      cefrFilter === 'ALL'
        ? sequences
        : sequences.filter((seq) => seq.cefrLevel === cefrFilter),
    [cefrFilter, sequences]
  );

  const active =
    sequences.find((s) => s.id === selectedId) ?? filtered[0] ?? sequences[0];

  const completedCount = sequences.filter((s) => completedAcademyIds.includes(s.id)).length;

  const handleMarkUnitCompleted = () => {
    if (!active) return;
    markAcademyCompleted(active.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('integrated', active.id),
      amount: 35,
      source: 'lesson',
      referenceId: active.id,
      minutes: active.estimatedMinutes,
      correctDelta: active.sequenceSteps.length,
      attemptsDelta: active.sequenceSteps.length,
    });
    playFeedbackTone('celebrate', preferences.soundEffects);
    setDoneBanner(`Completed "${active.title}" Four-Skill Sequence (+35 XP)!`);
  };

  if (isLoading || !active) {
    return (
      <QuestCard>
        <p className="text-sm font-bold text-[#777777]">
          Loading 24 Integrated Four-Skill Thematic Loops...
        </p>
      </QuestCard>
    );
  }

  return (
    <div className="space-y-5">
      <HonestNotice
        title="Integrated Four-Skill Thematic Loops (L -> R -> S -> W)"
        description="Instead of studying isolated flashcards, pair a matched Listening track, Reading passage, Speaking output task, and Writing composition sharing one coherent A1–C2 topic and vocabulary core."
      />

      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[#6E26B5]">
              Cross-Skill Integration Mastery
            </p>
            <h2 className="text-lg font-black text-[#3C3C3C]">
              {completedCount} / {sequences.length} Thematic Units Completed
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['ALL', ...CEFR_LEVELS] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setCefrFilter(lvl)}
                className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                  cefrFilter === lvl
                    ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                    : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#555555]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <QuestProgressBar
          value={completedCount}
          max={Math.max(1, sequences.length)}
          color="#8E3FD6"
          heightClass="h-2.5"
          label="Integrated sequence completion"
        />

        <div className="grid max-h-60 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((seq) => {
            const isSel = active.id === seq.id;
            const isDone = completedAcademyIds.includes(seq.id);
            return (
              <button
                key={seq.id}
                type="button"
                onClick={() => {
                  setSelectedId(seq.id);
                  setDoneBanner(null);
                }}
                className={`flex min-w-0 flex-col justify-between rounded-2xl border-2 p-3 text-left ${
                  isSel ? 'border-[#8E3FD6] bg-[#FAF5FF]' : 'border-[#E5E5E5] bg-white hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="rounded-lg bg-[#F5E8FF] px-2 py-0.5 text-[11px] font-black text-[#6E26B5]">
                    {seq.cefrLevel} • ~{seq.estimatedMinutes} min
                  </span>
                  {isDone && <CheckCircle2 className="h-4 w-4 text-[#58CC02]" />}
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs font-black text-[#3C3C3C]">
                  {seq.title}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-[#777777]">{seq.theme}</p>
              </button>
            );
          })}
        </div>
      </QuestCard>

      {/* Active Integrated Unit Workspace */}
      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="purple">{active.cefrLevel}</PillBadge>
              <PillBadge tone="blue">{active.theme}</PillBadge>
              <PillBadge tone="gold">{active.estimatedMinutes} min loop</PillBadge>
            </div>
            <h3 className="mt-2 text-xl font-black text-[#3C3C3C]">{active.title}</h3>
          </div>
          <Link to="/vocabulary">
            <TactileButton variant="outline" size="sm">
              Review Shared Vocabulary Deck ({active.keyVocabIds.length})
            </TactileButton>
          </Link>
        </div>

        {/* Linked 4-Step Pathway */}
        <div className="grid gap-3 sm:grid-cols-2">
          {active.sequenceSteps.map((step, i) => {
            const meta = SKILL_ROUTE[step.skill];
            const Icon = meta.icon;
            return (
              <div
                key={step.title}
                className="flex flex-col justify-between rounded-2xl border-2 border-[#E5E5E5] bg-[#FAFAFA] p-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-black uppercase ${meta.color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      Step {i + 1}: {step.skill}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-black text-[#3C3C3C]">{step.title}</p>
                  <p className="mt-1 text-xs font-semibold text-[#555555]">{step.instruction}</p>
                </div>
                <div className="mt-3">
                  <Link
                    to={meta.to}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#0E8BC9] hover:underline"
                  >
                    Launch {step.skill} studio
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 rounded-2xl border-2 border-[#E5D4FF] bg-[#FBF6FF] p-4 text-xs sm:grid-cols-2">
          <div>
            <p className="font-black uppercase text-[#6E26B5]">Spoken Output Task</p>
            <p className="mt-1 font-semibold text-[#3C3C3C]">{active.speakingPrompt}</p>
          </div>
          <div>
            <p className="font-black uppercase text-[#A67800]">Written Output Task</p>
            <p className="mt-1 font-semibold text-[#3C3C3C]">{active.writingTaskPrompt}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {doneBanner ? (
            <span className="text-xs font-black text-[#46A302]">{doneBanner}</span>
          ) : (
            <span className="text-xs font-semibold text-[#777777]">
              Work calmly across Listening, Reading, Speaking, and Writing steps to master this
              topic deeply.
            </span>
          )}
          <TactileButton variant="primary" size="md" onClick={handleMarkUnitCompleted}>
            <Sparkles className="h-4 w-4" />
            Complete Integrated Sequence (+35 XP)
          </TactileButton>
        </div>
      </QuestCard>
    </div>
  );
}
