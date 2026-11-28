import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  loadCurriculumMatrix,
  loadLevelAndDiagnosticAssessments,
  loadUnitAssessmentsByLevel,
} from '@content/index';
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
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
  Unlock,
} from 'lucide-react';
import type { CEFRLevel, Lesson, LessonNodeType, Unit } from '@english-quest/shared';
import { PipMascot } from '@/components/mascot/PipMascot';
import { TactileButton } from '@/components/ui/TactileButton';
import { HonestNotice, PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { CURRICULUM_SECTIONS } from '@/data/curriculum';
import {
  computeCefrMasteryProgress,
  findNextRecommendedLesson,
  findNextRecommendedLessonAsync,
  getLessonNodeState,
  getUnitLockState,
  getUnitsByCefr,
  isUnitChestUnlocked,
  loadMergedUnitsByCefr,
} from '@/services/curriculumService';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';
import { IntegratedLearningTab } from './IntegratedLearningTab';

const CEFR_TIERS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const NODE_OFFSETS = [
  'translate-x-0',
  'translate-x-10 sm:translate-x-14',
  'translate-x-0',
  '-translate-x-10 sm:-translate-x-14',
];

function getNodeIcon(type: LessonNodeType, primarySkill: Lesson['primarySkill'], state: string) {
  if (state === 'locked') return Lock;
  if (state === 'mastered') return Crown;
  if (state === 'completed') return Check;
  if (type === 'checkpoint' || primarySkill === 'assessment') return ClipboardCheck;
  if (type === 'challenge') return Target;
  if (type === 'review' || primarySkill === 'review') return Sparkles;
  if (primarySkill === 'listening') return Headphones;
  if (primarySkill === 'speaking' || primarySkill === 'pronunciation') return Mic;
  if (primarySkill === 'reading') return BookOpen;
  if (primarySkill === 'writing') return PenTool;
  return Star;
}

export function LearnPage() {
  const navigate = useNavigate();

  const hasCompletedOnboarding = useQuestStore((s) => s.hasCompletedOnboarding);
  const recommendedCefr = useQuestStore((s) => s.recommendedCefr);
  const lessonProgress = useQuestStore((s) => s.lessonProgress);
  const claimedChests = useQuestStore((s) => s.claimedChests);
  const unitAssessmentResults = useQuestStore((s) => s.unitAssessmentResults ?? {});
  const assessmentHistory = useQuestStore((s) => s.assessmentHistory ?? []);
  const unlockedUnitOverrides = useQuestStore((s) => s.unlockedUnitOverrides ?? []);
  const soundEffects = useQuestStore((s) => s.preferences.soundEffects);

  const claimTreasureChest = useQuestStore((s) => s.claimTreasureChest);
  const unlockUnitForIndependentPractice = useQuestStore(
    (s) => s.unlockUnitForIndependentPractice,
  );
  const setRecommendedCefr = useQuestStore((s) => s.setRecommendedCefr);

  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'ASSESSMENTS' | 'INTEGRATED'>(
    recommendedCefr,
  );
  const [openGuideUnitId, setOpenGuideUnitId] = useState<string | null>(null);
  const [chestToast, setChestToast] = useState<string | null>(null);

  const activeLevel: CEFRLevel =
    selectedCefr === 'ASSESSMENTS' || selectedCefr === 'INTEGRATED' ? recommendedCefr : selectedCefr;

  const { data: mergedLevelUnits } = useQuery({
    queryKey: ['merged-curriculum-units', activeLevel],
    queryFn: () => loadMergedUnitsByCefr(activeLevel),
    enabled: selectedCefr !== 'ASSESSMENTS' && selectedCefr !== 'INTEGRATED',
    staleTime: Infinity,
  });

  const { data: levelUnitAssessments = [] } = useQuery({
    queryKey: ['unit-assessments', activeLevel],
    queryFn: () => loadUnitAssessmentsByLevel(activeLevel),
    enabled: selectedCefr !== 'ASSESSMENTS' && selectedCefr !== 'INTEGRATED',
    staleTime: Infinity,
  });

  const { data: curriculumMatrix = [] } = useQuery({
    queryKey: ['curriculum-matrix'],
    queryFn: loadCurriculumMatrix,
    enabled: selectedCefr === 'ASSESSMENTS',
    staleTime: Infinity,
  });

  const { data: levelAndDiagExams = [] } = useQuery({
    queryKey: ['level-and-diag-assessments'],
    queryFn: loadLevelAndDiagnosticAssessments,
    enabled: selectedCefr === 'ASSESSMENTS',
    staleTime: Infinity,
  });

  const { data: asyncNextStep } = useQuery({
    queryKey: ['next-recommended-lesson', recommendedCefr, Object.keys(lessonProgress).length],
    queryFn: () => findNextRecommendedLessonAsync(lessonProgress, recommendedCefr),
    staleTime: 60_000,
  });

  // Always show synchronous core units immediately for A1–B1, upgrading seamlessly to all 8 units per tier
  const units: Unit[] = useMemo(() => {
    if (selectedCefr === 'ASSESSMENTS' || selectedCefr === 'INTEGRATED') return [];
    if (mergedLevelUnits && mergedLevelUnits.length > 0) return mergedLevelUnits;
    return getUnitsByCefr(selectedCefr);
  }, [mergedLevelUnits, selectedCefr]);

  const syncNextStep = useMemo(
    () => findNextRecommendedLesson(lessonProgress, recommendedCefr),
    [lessonProgress, recommendedCefr],
  );
  const nextStep = asyncNextStep ?? syncNextStep;

  const totalCompletedLessons = Object.keys(lessonProgress).length;

  const masteryStats = useMemo(() => {
    if (selectedCefr === 'ASSESSMENTS' || selectedCefr === 'INTEGRATED') return null;
    const expectedAssessCount = Math.max(
      levelUnitAssessments.length,
      units.filter((u) => Boolean(u.masteryAssessmentId)).length,
    );
    return computeCefrMasteryProgress(
      selectedCefr,
      units,
      expectedAssessCount,
      lessonProgress,
      unitAssessmentResults,
      assessmentHistory,
    );
  }, [
    selectedCefr,
    units,
    levelUnitAssessments.length,
    lessonProgress,
    unitAssessmentResults,
    assessmentHistory,
  ]);

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
                <PillBadge tone="blue">Complete A1–C2 CEFR Track</PillBadge>
                <h1 className="mt-1.5 text-xl font-black text-[#3C3C3C]">
                  Customize Your English Quest Roadmap
                </h1>
                <p className="mt-1 text-sm font-semibold text-[#555555]">
                  48 structured units across A1–C2, daily goals (5–90 min), and placement diagnostics. Start anywhere independently.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/onboarding">
                <TactileButton size="md">
                  <Sparkles className="h-4 w-4" />
                  Personalize &amp; Placement
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
                  Recommended Next • {nextStep.unit.cefrLevel} • {totalCompletedLessons}/264 Total Lessons Done
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
        <div className="mb-2 flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#777777]">
            Practice Any Skill Independently
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/assessment/assess-diag-core')}
              className="text-xs font-extrabold text-[#9A42D9] hover:underline cursor-pointer"
            >
              4-Skill Diagnostic
            </button>
            <Link to="/onboarding" className="text-xs font-extrabold text-[#1CB0F6] hover:underline">
              Retake Placement Test
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            {
              to: '/listening',
              label: 'Listening Lab',
              icon: Headphones,
              color: 'text-[#1CB0F6] bg-[#E3F6FF] border-[#BCE7FD]',
            },
            {
              to: '/speaking',
              label: 'Speaking Lab',
              icon: Mic,
              color: 'text-[#8E3FD6] bg-[#F5E8FF] border-[#E0B8FF]',
            },
            {
              to: '/reading',
              label: 'Reading Library',
              icon: BookOpen,
              color: 'text-[#46A302] bg-[#E9FCD9] border-[#B8EE8A]',
            },
            {
              to: '/writing',
              label: 'Writing Lab',
              icon: PenTool,
              color: 'text-[#A67800] bg-[#FFF5CC] border-[#FFE175]',
            },
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

      {/* Full A1–C2 Interactive CEFR Level Selector */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="CEFR Level Selector">
        {CEFR_TIERS.map((lvl) => {
          const sec = CURRICULUM_SECTIONS.find((s) => s.cefrLevel === lvl);
          const active = selectedCefr === lvl;
          const levelExamPassed = assessmentHistory.some(
            (a) => a.assessmentId === `cefr-exam-${lvl.toLowerCase()}` && a.passed,
          );
          return (
            <button
              key={lvl}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setSelectedCefr(lvl)}
              className={`flex items-center gap-1.5 rounded-2xl border-2 border-b-4 px-3.5 py-2 text-sm font-black transition cursor-pointer ${
                active
                  ? 'border-[#46A302] bg-[#58CC02] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#3C3C3C] hover:bg-[#F7F8FA]'
              }`}
            >
              <span>{lvl}</span>
              <span className={`text-xs ${active ? 'text-white/90' : 'text-[#777777]'}`}>
                {sec?.title.split('—')[1]?.trim()}
              </span>
              {levelExamPassed && <Crown className="h-3.5 w-3.5 text-[#FFC800]" />}
            </button>
          );
        })}

        <button
          role="tab"
          aria-selected={selectedCefr === 'ASSESSMENTS'}
          type="button"
          onClick={() => setSelectedCefr('ASSESSMENTS')}
          className={`flex items-center gap-2 rounded-2xl border-2 border-b-4 px-3.5 py-2 text-sm font-black transition cursor-pointer ${
            selectedCefr === 'ASSESSMENTS'
              ? 'border-[#A55EEA] bg-[#CE82FF] text-white'
              : 'border-[#E5E5E5] bg-white text-[#666666] hover:bg-[#F7F8FA]'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Assessments &amp; Matrix</span>
        </button>

        <button
          role="tab"
          aria-selected={selectedCefr === 'INTEGRATED'}
          type="button"
          onClick={() => setSelectedCefr('INTEGRATED')}
          className={`flex items-center gap-2 rounded-2xl border-2 border-b-4 px-3.5 py-2 text-sm font-black transition cursor-pointer ${
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

      {/* Assessments & A1-C2 Matrix Tab */}
      {selectedCefr === 'ASSESSMENTS' && (
        <div className="space-y-6">
          <HonestNotice
            title="Internal CEFR Assessments & Progression"
            description="Every CEFR level assessment evaluates comprehension, grammar, vocabulary, listening, reading, and guided writing/speaking rubrics. Results measure internal mastery independently of XP and do not constitute official external CEFR certification."
          />

          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#3C3C3C]">
              Comprehensive CEFR Level Completion Exams (A1–C2) &amp; Diagnostics
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {levelAndDiagExams.map((exam) => {
                const attempts = assessmentHistory.filter((a) => a.assessmentId === exam.id);
                const latest = attempts[0];
                const everPassed = attempts.some((a) => a.passed);
                return (
                  <QuestCard key={exam.id} className="space-y-2.5 p-4 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <PillBadge tone={exam.kind === 'level_completion' ? 'purple' : 'blue'}>
                          {exam.cefrLevel} • {exam.kind.replace(/_/g, ' ')}
                        </PillBadge>
                        {everPassed && (
                          <span className="text-xs font-black text-[#46A302]">
                            Passed ({latest?.accuracyPercent ?? 75}%+)
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-black text-[#3C3C3C]">{exam.title}</h3>
                      <p className="text-xs font-semibold text-[#666666]">{exam.description}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F0F0F0]">
                      <span className="text-[11px] font-bold text-[#777777]">
                        {exam.exercises.length} questions • Pass {exam.passingPercent}% • ~{exam.estimatedMinutes} min
                      </span>
                      <TactileButton
                        size="sm"
                        onClick={() => navigate(`/assessment/${exam.id}`)}
                      >
                        <ClipboardCheck className="h-4 w-4" />
                        {everPassed ? 'Retake' : 'Start Exam'}
                      </TactileButton>
                    </div>
                  </QuestCard>
                );
              })}
            </div>
          </div>

          {curriculumMatrix.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-[#3C3C3C]">
                    Complete A1–C2 CEFR Coverage Matrix
                  </h2>
                  <p className="text-xs font-bold text-[#666666]">
                    Can-Do outcomes, grammar &amp; lexical domains across all 48 structured CEFR units.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to="/vocabulary">
                    <TactileButton size="sm" variant="secondary">
                      Vocabulary Bank
                    </TactileButton>
                  </Link>
                  <Link to="/grammar">
                    <TactileButton size="sm" variant="outline">
                      Grammar &amp; Drills
                    </TactileButton>
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

      {/* Active CEFR Track Mastery Header & Flexible Unlocking */}
      {selectedCefr !== 'ASSESSMENTS' && selectedCefr !== 'INTEGRATED' && masteryStats && (
        <QuestCard className="p-4 sm:p-5 border-2 border-[#E5E5E5] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <PillBadge tone={selectedCefr === 'C1' || selectedCefr === 'C2' ? 'purple' : 'green'}>
                  {selectedCefr} Active Learning Path
                </PillBadge>
                <span className="text-xs font-black text-[#4B4B4B]">
                  Real CEFR Mastery: {masteryStats.masteryPercent}%
                </span>
                <span className="text-[11px] font-bold text-[#777777]">
                  ({masteryStats.completedLessons}/{masteryStats.totalLessons} lessons •{' '}
                  {masteryStats.passedUnitAssessments}/{masteryStats.totalUnitAssessments} unit assessments)
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#666666]">
                Progress measures lesson completion and assessment mastery (strictly separate from XP).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {recommendedCefr !== selectedCefr && (
                <TactileButton
                  size="sm"
                  variant="outline"
                  onClick={() => setRecommendedCefr(selectedCefr)}
                >
                  <Unlock className="h-3.5 w-3.5" />
                  Set {selectedCefr} as Active Level
                </TactileButton>
              )}
              <TactileButton
                size="sm"
                variant="secondary"
                onClick={() => navigate(`/assessment/cefr-exam-${selectedCefr.toLowerCase()}`)}
              >
                <Award className="h-4 w-4" />
                {masteryStats.levelExamPassed
                  ? `${selectedCefr} Exam Passed`
                  : `Take ${selectedCefr} Level Exam`}
              </TactileButton>
            </div>
          </div>
          <QuestProgressBar
            value={masteryStats.masteryPercent}
            max={100}
            color="#58CC02"
            heightClass="h-2.5"
            label={`${selectedCefr} curriculum mastery`}
          />
        </QuestCard>
      )}

      {/* Vertically Scrolling Gamified Path for Active CEFR Level */}
      <div className="space-y-10">
        {units.map((unit) => {
          const completedInUnit = unit.lessons.filter((l) => Boolean(lessonProgress[l.id])).length;
          const chestReady = isUnitChestUnlocked(unit, lessonProgress);
          const chestClaimed = claimedChests.includes(unit.id);
          const guideOpen = openGuideUnitId === unit.id;
          const unitLock = getUnitLockState(
            unit,
            units,
            lessonProgress,
            recommendedCefr,
            unitAssessmentResults,
            unlockedUnitOverrides,
          );
          const assessResult = unit.masteryAssessmentId
            ? unitAssessmentResults[unit.id]
            : undefined;

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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-black uppercase tracking-wider opacity-90">
                        {unit.cefrLevel} • Unit {unit.orderIndex} • {completedInUnit}/{unit.lessons.length} Lessons
                      </p>
                      {assessResult && (
                        <span className="rounded-lg bg-black/25 px-2 py-0.5 text-[11px] font-black">
                          Assessment: {assessResult.accuracyPercent}%{' '}
                          {assessResult.passed ? '• Passed' : '• Review'}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-0.5 text-xl font-black sm:text-2xl">{unit.title}</h2>
                    <p className="mt-1 text-sm font-bold opacity-95">{unit.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {!unitLock.isUnlocked && (
                      <button
                        type="button"
                        onClick={() => unlockUnitForIndependentPractice(unit.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border-2 border-white/60 bg-white px-3 py-1.5 text-xs font-black text-[#3C3C3C] hover:bg-[#FFFBEB] cursor-pointer"
                      >
                        <Unlock className="h-3.5 w-3.5 text-[#CC7800]" />
                        Jump Ahead &amp; Unlock
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpenGuideUnitId(guideOpen ? null : unit.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-white/40 bg-black/15 px-3 py-1.5 text-xs font-black text-white hover:bg-black/25 cursor-pointer"
                    >
                      <BookOpen className="h-4 w-4" />
                      Unit Guide
                      {guideOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
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
                  <div className="mt-4 rounded-2xl bg-white p-4 text-[#3C3C3C] space-y-3">
                    <p className="text-sm font-extrabold">{unit.guideSummary}</p>
                    {unit.prerequisites && unit.prerequisites.length > 0 && (
                      <p className="text-xs font-bold text-[#666666]">
                        Recommended Prerequisites: {unit.prerequisites.join(' • ')}
                      </p>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
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

                    {(unit.targetGrammarIds?.length || unit.linkedListeningIds?.length || unit.masteryAssessmentId) && (
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E5E5] text-xs font-black">
                        {unit.targetVocabIds?.length ? (
                          <Link to="/vocabulary" className="text-[#1CB0F6] hover:underline">
                            Linked Vocab ({unit.targetVocabIds.length})
                          </Link>
                        ) : null}
                        {unit.targetGrammarIds?.length ? (
                          <Link to="/grammar" className="text-[#46A302] hover:underline">
                            Linked Grammar ({unit.targetGrammarIds.length})
                          </Link>
                        ) : null}
                        {unit.linkedListeningIds?.length ? (
                          <Link to="/listening" className="text-[#0E8BC9] hover:underline">
                            Listening ({unit.linkedListeningIds.length})
                          </Link>
                        ) : null}
                        {unit.linkedReadingIds?.length ? (
                          <Link to="/reading" className="text-[#46A302] hover:underline">
                            Reading ({unit.linkedReadingIds.length})
                          </Link>
                        ) : null}
                        {unit.linkedWritingIds?.length ? (
                          <Link to="/writing" className="text-[#A67800] hover:underline">
                            Writing ({unit.linkedWritingIds.length})
                          </Link>
                        ) : null}
                        {unit.masteryAssessmentId && (
                          <Link
                            to={`/assessment/${unit.masteryAssessmentId}`}
                            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-[#CE82FF]/15 px-2.5 py-1 text-[#9A42D9] hover:bg-[#CE82FF]/25"
                          >
                            <ClipboardCheck className="h-3.5 w-3.5" />
                            Take Unit Mastery Check →
                          </Link>
                        )}
                      </div>
                    )}
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
                    recommendedCefr,
                    units,
                    unlockedUnitOverrides,
                    unitAssessmentResults,
                  );
                  const offsetClass = NODE_OFFSETS[idx % NODE_OFFSETS.length];
                  const Icon = getNodeIcon(lesson.nodeType, lesson.primarySkill, state);

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
                          canLaunch
                            ? 'cursor-pointer hover:scale-105 active:translate-y-1'
                            : 'cursor-not-allowed opacity-80'
                        } ${circleColors}`}
                      >
                        <Icon className="h-8 w-8" />
                        {state === 'available' && (
                          <span className="absolute -top-8 whitespace-nowrap rounded-xl border-2 border-[#0E8BC9] bg-white px-2.5 py-0.5 text-[11px] font-black uppercase text-[#0E8BC9] shadow-sm">
                            Start
                          </span>
                        )}
                      </button>

                      <div className="mt-2 max-w-[230px] text-center">
                        <p className="text-sm font-black text-[#3C3C3C]">{lesson.title}</p>
                        <p className="text-xs font-bold text-[#777777]">
                          {lesson.nodeType === 'checkpoint'
                            ? 'Checkpoint'
                            : lesson.nodeType === 'challenge'
                              ? 'Challenge'
                              : lesson.nodeType === 'review'
                                ? 'Review'
                                : lesson.primarySkill && lesson.primarySkill !== 'assessment'
                                  ? `${lesson.primarySkill[0].toUpperCase()}${lesson.primarySkill.slice(1)} Lesson`
                                  : 'Lesson'}{' '}
                          • +{lesson.xpReward} XP
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Unit Mastery Assessment Node (on all Milestone 3 units) */}
                {unit.masteryAssessmentId && (
                  <div className="flex flex-col items-center pt-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/assessment/${unit.masteryAssessmentId}`)}
                      className={`flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-b-8 transition cursor-pointer hover:scale-105 ${
                        assessResult?.passed
                          ? 'border-[#46A302] bg-[#58CC02] text-white'
                          : 'border-[#9A42D9] bg-[#CE82FF] text-white'
                      }`}
                      aria-label={`${unit.title} Mastery Assessment`}
                    >
                      <ClipboardCheck className="h-9 w-9" />
                    </button>
                    <p className="mt-2 text-xs font-black text-[#3C3C3C]">
                      {assessResult?.passed
                        ? `Mastery Passed (${assessResult.accuracyPercent}%)`
                        : 'Unit Mastery Assessment (70% Pass)'}
                    </p>
                  </div>
                )}

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
