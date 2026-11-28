import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadCurriculumMatrix } from '@content/index';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Crown,
  Gift,
  Headphones,
  Layers,
  Lock,
  Mic,
  PenTool,
  Play,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import type { CEFRLevel, LessonNodeType } from '@english-quest/shared';
import { PipMascot } from '@/components/mascot/PipMascot';
import { TactileButton } from '@/components/ui/TactileButton';
import { HonestNotice, PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import {
  CURRICULUM_SECTIONS,
  UPCOMING_CEFR_PREVIEWS,
} from '@/data/curriculum';
import {
  findNextRecommendedLesson,
  getLessonNodeState,
  getUnitsByCefr,
  isUnitChestUnlocked,
} from '@/services/curriculumService';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';
import { IntegratedLearningTab } from './IntegratedLearningTab';

const NODE_OFFSETS = ['translate-x-0', 'translate-x-10 sm:translate-x-14', 'translate-x-0', '-translate-x-10 sm:-translate-x-14'];

function getNodeIcon(type: LessonNodeType, state: string) {
  if (state === 'locked') return Lock;
  if (state === 'mastered') return Crown;
  if (state === 'completed') return Check;
  if (type === 'checkpoint') return Crown;
  if (type === 'challenge') return Target;
  if (type === 'review') return Sparkles;
  return Star;
}

export function LearnPage() {
  const navigate = useNavigate();

  const hasCompletedOnboarding = useQuestStore((s) => s.hasCompletedOnboarding);
  const recommendedCefr = useQuestStore((s) => s.recommendedCefr);
  const lessonProgress = useQuestStore((s) => s.lessonProgress);
  const claimedChests = useQuestStore((s) => s.claimedChests);
  const soundEffects = useQuestStore((s) => s.preferences.soundEffects);
  const claimTreasureChest = useQuestStore((s) => s.claimTreasureChest);

  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'UPCOMING' | 'INTEGRATED'>(
    recommendedCefr === 'A2' || recommendedCefr === 'B1' ? recommendedCefr : 'A1'
  );
  const [openGuideUnitId, setOpenGuideUnitId] = useState<string | null>(null);
  const [chestToast, setChestToast] = useState<string | null>(null);

  const { data: curriculumMatrix = [] } = useQuery({
    queryKey: ['curriculum-matrix'],
    queryFn: loadCurriculumMatrix,
    enabled: selectedCefr === 'UPCOMING',
    staleTime: Infinity,
  });

  const units =
    selectedCefr === 'UPCOMING' || selectedCefr === 'INTEGRATED'
      ? []
      : getUnitsByCefr(selectedCefr);
  const nextStep = findNextRecommendedLesson(lessonProgress, recommendedCefr);
  const totalCompletedLessons = Object.keys(lessonProgress).length;

  const handleOpenChest = (unitId: string, gems: number, xp: number) => {
    const claimed = claimTreasureChest(unitId, gems, xp);
    if (claimed) {
      playFeedbackTone('chest', soundEffects);
      setChestToast(`Treasure Chest opened! Earned +${gems} Gems and +${xp} XP.`);
      setTimeout(() => setChestToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Onboarding Prompt or Quick Next Lesson Hero */}
      {!hasCompletedOnboarding ? (
        <QuestCard className="border-[#84D8FF] bg-gradient-to-r from-[#F2FAFF] to-[#E9FCD9]/60 p-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <PipMascot mood="happy" size={76} />
              <div>
                <PillBadge tone="blue">Welcome Explorer</PillBadge>
                <h1 className="mt-1.5 text-xl font-black text-[#3C3C3C]">
                  Customize Your English Quest Roadmap
                </h1>
                <p className="mt-1 text-sm font-semibold text-[#555555]">
                  Set your daily goal (5–90 min), accent, and take a quick 10-question placement check.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/onboarding">
                <TactileButton size="md">
                  <Sparkles className="h-4 w-4" />
                  Personalize & Placement
                </TactileButton>
              </Link>
            </div>
          </div>
        </QuestCard>
      ) : (
        <QuestCard className="border-[#B8EE8A] bg-[#F6FFF0] p-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <PipMascot mood="happy" size={68} />
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#46A302]">
                  Recommended Next • {nextStep.unit.cefrLevel} • {totalCompletedLessons}/48 Lessons Done
                </p>
                <h1 className="text-xl font-black text-[#3C3C3C]">{nextStep.lesson.title}</h1>
                <p className="text-sm font-semibold text-[#555555]">{nextStep.unit.title}</p>
              </div>
            </div>
            <TactileButton onClick={() => navigate(`/lesson/${nextStep.lesson.id}`)}>
              <Play className="h-4 w-4 fill-current" />
              Continue Lesson
            </TactileButton>
          </div>
        </QuestCard>
      )}

      {/* Independent Four-Skill Practice Strip */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#777777]">
            Practice Any Skill Independently
          </h2>
          <Link to="/onboarding" className="text-xs font-extrabold text-[#1CB0F6] hover:underline">
            Retake Placement Test
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { to: '/listening', label: 'Listening Lab', icon: Headphones, color: 'text-[#1CB0F6] bg-[#E3F6FF] border-[#BCE7FD]' },
            { to: '/speaking', label: 'Speaking Lab', icon: Mic, color: 'text-[#8E3FD6] bg-[#F5E8FF] border-[#E0B8FF]' },
            { to: '/reading', label: 'Reading Library', icon: BookOpen, color: 'text-[#46A302] bg-[#E9FCD9] border-[#B8EE8A]' },
            { to: '/writing', label: 'Writing Lab', icon: PenTool, color: 'text-[#A67800] bg-[#FFF5CC] border-[#FFE175]' },
          ].map((skill) => {
            const Icon = skill.icon;
            return (
              <Link
                key={skill.to}
                to={skill.to}
                className={`flex items-center gap-2.5 rounded-2xl border-2 border-b-4 px-3.5 py-2.5 text-sm font-extrabold transition hover:brightness-98 ${skill.color}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{skill.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CEFR Level Selector */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="CEFR Level Selector">
        {(['A1', 'A2', 'B1'] as CEFRLevel[]).map((lvl) => {
          const sec = CURRICULUM_SECTIONS.find((s) => s.cefrLevel === lvl);
          const levelUnits = getUnitsByCefr(lvl);
          const doneCount = levelUnits.reduce(
            (sum, u) => sum + u.lessons.filter((l) => Boolean(lessonProgress[l.id])).length,
            0
          );
          const totalCount = levelUnits.reduce((sum, u) => sum + u.lessons.length, 0);
          const active = selectedCefr === lvl;
          return (
            <button
              key={lvl}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setSelectedCefr(lvl)}
              className={`flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-2 text-sm font-black transition ${
                active
                  ? 'border-[#46A302] bg-[#58CC02] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#3C3C3C] hover:bg-[#F7F8FA]'
              }`}
            >
              <span>{lvl}</span>
              <span className={`text-xs ${active ? 'text-white/90' : 'text-[#777777]'}`}>
                {sec?.title.split('—')[1]?.trim()} ({doneCount}/{totalCount})
              </span>
            </button>
          );
        })}
        <button
          role="tab"
          aria-selected={selectedCefr === 'UPCOMING'}
          type="button"
          onClick={() => setSelectedCefr('UPCOMING')}
          className={`flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-2 text-sm font-black transition ${
            selectedCefr === 'UPCOMING'
              ? 'border-[#A55EEA] bg-[#CE82FF] text-white'
              : 'border-[#E5E5E5] bg-white text-[#666666] hover:bg-[#F7F8FA]'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>B2–C2 Roadmap</span>
        </button>
        <button
          role="tab"
          aria-selected={selectedCefr === 'INTEGRATED'}
          type="button"
          onClick={() => setSelectedCefr('INTEGRATED')}
          className={`flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-2 text-sm font-black transition ${
            selectedCefr === 'INTEGRATED'
              ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
              : 'border-[#E5E5E5] bg-white text-[#666666] hover:bg-[#F7F8FA]'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Integrated Loops (24)</span>
        </button>
      </div>

      {chestToast && (
        <div
          role="status"
          className="rounded-2xl border-2 border-[#FFC800] bg-[#FFFBEB] p-4 text-center text-sm font-black text-[#8F6500]"
        >
          {chestToast}
        </div>
      )}

      {/* Upcoming B2-C2 Honest Roadmap */}
      {selectedCefr === 'UPCOMING' && (
        <div className="space-y-4">
          <HonestNotice
            title="Extensible Curriculum Through C2 (Phase 4)"
            description="Phase 1 includes 12 complete interactive units across A1, A2, and B1 (48 full lessons). B2, C1, and C2 units shown below are planned curriculum expansions scheduled for Phase 4."
          />
          {UPCOMING_CEFR_PREVIEWS.map((preview) => (
            <QuestCard key={preview.cefrLevel}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">{preview.title}</h2>
                <PillBadge tone="purple">Upcoming Phase 4</PillBadge>
              </div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {preview.plannedUnits.map((unitName) => (
                  <li
                    key={unitName}
                    className="flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2 text-xs font-bold text-[#555555]"
                  >
                    <Lock className="h-3.5 w-3.5 shrink-0 text-[#999999]" />
                    <span>{unitName}</span>
                  </li>
                ))}
              </ul>
            </QuestCard>
          ))}

          {curriculumMatrix.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-[#3C3C3C]">
                    Complete A1–C2 CEFR Coverage Matrix
                  </h2>
                  <p className="text-xs font-bold text-[#666666]">
                    Can-Do outcomes, grammar &amp; lexical domains, and Milestone 1 study tracks across every proficiency band.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to="/vocabulary">
                    <TactileButton size="sm" variant="secondary">Vocabulary Bank</TactileButton>
                  </Link>
                  <Link to="/grammar">
                    <TactileButton size="sm" variant="outline">Grammar &amp; Drills</TactileButton>
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {curriculumMatrix.map((row) => (
                  <QuestCard key={row.cefrLevel} className="space-y-2.5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <PillBadge tone={row.cefrLevel === 'C1' || row.cefrLevel === 'C2' ? 'purple' : 'blue'}>
                        {row.title}
                      </PillBadge>
                      <span className="text-[11px] font-black text-[#46A302]">
                        {row.grammarTarget} grammar • {row.vocabularyTarget.toLocaleString()} vocab goal
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs font-semibold text-[#444444]">
                      {row.canDoStatements.map((stmt) => (
                        <li key={stmt}>• {stmt}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {row.keyGrammarThemes.slice(0, 4).map((theme) => (
                        <span
                          key={theme}
                          className="rounded-lg border border-[#E5E5E5] bg-[#F7F8FA] px-2 py-0.5 text-[11px] font-bold text-[#555555]"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </QuestCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedCefr === 'INTEGRATED' && <IntegratedLearningTab />}

      {/* Vertically Scrolling Gamified Path for Active CEFR Level */}
      <div className="space-y-10">
        {units.map((unit) => {
          const completedInUnit = unit.lessons.filter((l) => Boolean(lessonProgress[l.id])).length;
          const chestReady = isUnitChestUnlocked(unit, lessonProgress);
          const chestClaimed = claimedChests.includes(unit.id);
          const guideOpen = openGuideUnitId === unit.id;

          return (
            <section key={unit.id} aria-label={unit.title} className="space-y-6">
              {/* Unit Header Banner */}
              <div
                className="rounded-3xl border-2 border-b-4 p-5 text-white shadow-sm"
                style={{
                  backgroundColor: unit.themeColor,
                  borderColor: 'rgba(0,0,0,0.18)',
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider opacity-90">
                      {unit.cefrLevel} • Unit {unit.orderIndex} • {completedInUnit}/{unit.lessons.length} Lessons
                    </p>
                    <h2 className="mt-0.5 text-xl font-black sm:text-2xl">{unit.title}</h2>
                    <p className="mt-1 text-sm font-bold opacity-95">{unit.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenGuideUnitId(guideOpen ? null : unit.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-white/40 bg-black/15 px-3 py-1.5 text-xs font-black text-white hover:bg-black/25"
                  >
                    <BookOpen className="h-4 w-4" />
                    Unit Guide
                    {guideOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="mt-3">
                  <QuestProgressBar
                    value={completedInUnit}
                    max={unit.lessons.length}
                    color="#FFFFFF"
                    heightClass="h-2.5"
                    label={`${unit.title} completion`}
                  />
                </div>

                {guideOpen && (
                  <div className="mt-4 rounded-2xl bg-white p-4 text-[#3C3C3C]">
                    <p className="text-sm font-extrabold">{unit.guideSummary}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-black uppercase text-[#777777]">Key Grammar</p>
                        <ul className="mt-1 list-disc pl-4 text-xs font-bold space-y-1">
                          {unit.keyGrammar.map((g) => (
                            <li key={g}>{g}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-[#777777]">Core Vocabulary</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {unit.keyVocabulary.map((w) => (
                            <span
                              key={w}
                              className="rounded-lg bg-[#F7F8FA] border border-[#E5E5E5] px-2 py-0.5 text-xs font-extrabold"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Curved Alternating Path Nodes */}
              <div className="relative flex flex-col items-center gap-6 py-2">
                {unit.lessons.map((lesson, idx) => {
                  const state = getLessonNodeState(
                    lesson,
                    unit,
                    lessonProgress,
                    recommendedCefr
                  );
                  const offsetClass = NODE_OFFSETS[idx % NODE_OFFSETS.length];
                  const Icon = getNodeIcon(lesson.nodeType, state);

                  const circleColors =
                    state === 'mastered'
                      ? 'bg-[#FFC800] border-[#D9A600] text-[#3C3C3C]'
                      : state === 'completed'
                        ? 'bg-[#58CC02] border-[#46A302] text-white'
                        : state === 'available'
                          ? 'bg-[#1CB0F6] border-[#0E8BC9] text-white ring-8 ring-[#1CB0F6]/20'
                          : 'bg-[#E5E5E5] border-[#CCCCCC] text-[#888888]';

                  const canLaunch = state !== 'locked';

                  return (
                    <div
                      key={lesson.id}
                      className={`flex flex-col items-center ${offsetClass}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (canLaunch) navigate(`/lesson/${lesson.id}`);
                        }}
                        disabled={!canLaunch}
                        aria-label={`${lesson.title} (${state})`}
                        className={`group relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-b-8 transition-transform ${
                          canLaunch ? 'cursor-pointer hover:scale-105 active:translate-y-1' : 'cursor-not-allowed opacity-80'
                        } ${circleColors}`}
                      >
                        <Icon className="h-8 w-8" />
                        {state === 'available' && (
                          <span className="absolute -top-8 whitespace-nowrap rounded-xl border-2 border-[#0E8BC9] bg-white px-2.5 py-0.5 text-[11px] font-black uppercase text-[#0E8BC9] shadow-sm">
                            Start
                          </span>
                        )}
                      </button>

                      <div className="mt-2 max-w-[220px] text-center">
                        <p className="text-sm font-black text-[#3C3C3C]">{lesson.title}</p>
                        <p className="text-xs font-bold text-[#777777]">
                          {lesson.nodeType === 'checkpoint'
                            ? 'Checkpoint'
                            : lesson.nodeType === 'challenge'
                              ? 'Challenge'
                              : lesson.nodeType === 'review'
                                ? 'Review'
                                : 'Lesson'}{' '}
                          • +{lesson.xpReward} XP
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Unit Treasure Chest Node */}
                <div className="flex flex-col items-center pt-1">
                  <button
                    type="button"
                    disabled={!chestReady || chestClaimed}
                    onClick={() => handleOpenChest(unit.id, unit.chestRewardGems, unit.chestRewardXp)}
                    className={`flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-b-8 transition ${
                      chestClaimed
                        ? 'border-[#B8EE8A] bg-[#E9FCD9] text-[#46A302]'
                        : chestReady
                          ? 'cursor-pointer border-[#D9A600] bg-[#FFC800] text-[#3C3C3C] animate-bounce'
                          : 'cursor-not-allowed border-[#CCCCCC] bg-[#F7F8FA] text-[#999999]'
                    }`}
                    aria-label={`${unit.title} Treasure Chest`}
                  >
                    <Gift className="h-9 w-9" />
                  </button>
                  <p className="mt-2 text-xs font-black text-[#555555]">
                    {chestClaimed
                      ? 'Treasure Claimed!'
                      : chestReady
                        ? `Tap to Open (+${unit.chestRewardGems} Gems)`
                        : `Unit Chest (Finish ${unit.lessons.length} lessons)`}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
