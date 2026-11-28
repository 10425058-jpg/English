import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  RotateCcw,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import {
  evaluateExerciseAnswer,
  type Exercise,
  type Lesson,
  type Unit,
} from '@english-quest/shared';
import { loadCurriculumLessonById } from '@content/index';
import { PipMascot } from '@/components/mascot/PipMascot';
import { TactileButton } from '@/components/ui/TactileButton';
import { QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { getLessonById } from '@/services/curriculumService';
import { createAttemptKey, currentEpochMs } from '@/services/idempotency';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function LessonPlayerPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const syncFound = useMemo(() => (lessonId ? getLessonById(lessonId) : null), [lessonId]);

  const { data: asyncFound, isLoading } = useQuery({
    queryKey: ['curriculum-lesson', lessonId],
    queryFn: () => (lessonId ? loadCurriculumLessonById(lessonId) : Promise.resolve(null)),
    enabled: Boolean(lessonId) && !syncFound,
    staleTime: Infinity,
  });

  const resolved = syncFound ?? asyncFound ?? null;

  if (!syncFound && isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 py-16">
        <PipMascot mood="thinking" size={88} />
        <p className="text-sm font-black text-[#777777]">Loading structured CEFR lesson...</p>
      </div>
    );
  }

  if (!resolved) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <PipMascot mood="thinking" size={110} />
        <h1 className="mt-4 text-2xl font-black">Lesson Not Found</h1>
        <p className="mt-2 text-sm font-semibold text-[#666666]">
          That lesson does not exist in the curriculum roadmap.
        </p>
        <div className="mt-6">
          <Link to="/learn">
            <TactileButton>Return to Learning Path</TactileButton>
          </Link>
        </div>
      </div>
    );
  }

  return <LessonSession key={resolved.lesson.id} found={resolved} />;
}

function LessonSession({ found }: { found: { unit: Unit; lesson: Lesson } }) {
  const navigate = useNavigate();
  const { unit, lesson } = found;

  const preferences = useQuestStore((s) => s.preferences);
  const hearts = useQuestStore((s) => s.hearts);
  const inProgress = useQuestStore((s) => s.inProgressLesson);
  const saveInProgressLesson = useQuestStore((s) => s.saveInProgressLesson);
  const completeLessonAttempt = useQuestStore((s) => s.completeLessonAttempt);
  const recordMistake = useQuestStore((s) => s.recordMistake);

  const attemptIdRef = useRef<string>('');
  const startedAtRef = useRef<number>(0);

  const initialExercises = lesson.exercises;

  const [queue, setQueue] = useState<Exercise[]>(initialExercises);
  const [currentIndex, setCurrentIndex] = useState(() =>
    inProgress && inProgress.lessonId === lesson.id && inProgress.exerciseIndex < initialExercises.length
      ? inProgress.exerciseIndex
      : 0,
  );
  const [answer, setAnswer] = useState<string | string[]>('');
  const [feedback, setFeedback] = useState<{
    checked: boolean;
    isCorrect: boolean;
    expectedDisplay: string;
  } | null>(null);
  const [firstPassCorrect, setFirstPassCorrect] = useState(0);
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [completionSummary, setCompletionSummary] = useState<{
    awardedXp: number;
    accuracy: number;
    durationSeconds: number;
  } | null>(null);

  useEffect(() => {
    attemptIdRef.current = createAttemptKey('attempt', lesson.id);
    startedAtRef.current = currentEpochMs();
  }, [lesson.id]);

  const currentExercise = queue[currentIndex];
  const hasBriefingDetails = Boolean(
    lesson.instructionalOverview ||
      (lesson.contextualExamples && lesson.contextualExamples.length > 0) ||
      lesson.guidedPracticeNote ||
      lesson.reusedExerciseRefs?.length,
  );

  const handleCheck = () => {
    if (!currentExercise || feedback?.checked) return;

    const result = evaluateExerciseAnswer(currentExercise, answer);
    const firstTry = !attemptedIds.has(currentExercise.id);
    const nextAttempted = new Set(attemptedIds);
    nextAttempted.add(currentExercise.id);
    setAttemptedIds(nextAttempted);

    if (result.isCorrect) {
      if (firstTry) {
        setFirstPassCorrect((c) => c + 1);
      }
      playFeedbackTone('correct', preferences.soundEffects);
    } else {
      playFeedbackTone('wrong', preferences.soundEffects);
      setQueue((prev) => [...prev, currentExercise]);
      recordMistake({
        source: 'lesson',
        skill: currentExercise.skills[0] ?? 'vocabulary',
        cefrLevel: unit.cefrLevel,
        prompt: currentExercise.prompt,
        userAnswer: Array.isArray(answer) ? answer.join(' ') : answer,
        expectedAnswer: result.expectedDisplay,
        explanation: currentExercise.explanation,
        explanationVi: currentExercise.explanationVi,
      });
    }

    setFeedback({
      checked: true,
      isCorrect: result.isCorrect,
      expectedDisplay: result.expectedDisplay,
    });
  };

  const handleContinue = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= queue.length) {
      const durationSeconds = Math.max(20, Math.round((currentEpochMs() - startedAtRef.current) / 1000));
      const accuracy = Math.round((firstPassCorrect / lesson.exercises.length) * 100);
      const { awardedXp } = completeLessonAttempt({
        idempotencyKey: attemptIdRef.current || createAttemptKey('attempt', lesson.id),
        lessonId: lesson.id,
        unitId: unit.id,
        accuracy,
        xpReward: lesson.xpReward,
        durationSeconds,
        skills: lesson.skills,
        cefrLevel: lesson.cefrLevel,
        correctExercises: firstPassCorrect,
        totalExercises: lesson.exercises.length,
      });
      playFeedbackTone('celebrate', preferences.soundEffects);
      setCompletionSummary({ awardedXp, accuracy, durationSeconds });
      return;
    }

    saveInProgressLesson({
      lessonId: lesson.id,
      unitId: unit.id,
      exerciseIndex: nextIdx,
      correctCount: firstPassCorrect,
      mistakeQueueIds: [],
      startedAt: new Date(startedAtRef.current).toISOString(),
    });

    setCurrentIndex(nextIdx);
    setAnswer('');
    setFeedback(null);
  };

  if (completionSummary) {
    const isFinalUnitLesson =
      Boolean(unit.masteryAssessmentId) && lesson.orderIndex === unit.lessons.length;
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4 py-10">
        <QuestCard className="w-full max-w-lg text-center p-8 space-y-5">
          <div>
            <PipMascot mood="celebrating" size={120} />
            <h1 className="mt-4 text-3xl font-black text-[#58CC02]">Lesson Complete!</h1>
            <p className="mt-1 text-base font-bold text-[#666666]">
              {unit.cefrLevel} • {lesson.title}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border-2 border-[#FFC800] bg-[#FFFBEB] p-3">
              <p className="text-xs font-extrabold uppercase text-[#A67800]">XP Earned</p>
              <p className="mt-1 text-2xl font-black text-[#3C3C3C]">+{completionSummary.awardedXp}</p>
            </div>
            <div className="rounded-2xl border-2 border-[#58CC02] bg-[#E9FCD9] p-3">
              <p className="text-xs font-extrabold uppercase text-[#46A302]">Accuracy</p>
              <p className="mt-1 text-2xl font-black text-[#3C3C3C]">{completionSummary.accuracy}%</p>
            </div>
            <div className="rounded-2xl border-2 border-[#1CB0F6] bg-[#E3F6FF] p-3">
              <p className="text-xs font-extrabold uppercase text-[#0E8BC9]">Time</p>
              <p className="mt-1 text-2xl font-black text-[#3C3C3C]">
                {Math.max(1, Math.round(completionSummary.durationSeconds / 60))}m
              </p>
            </div>
          </div>

          {(lesson.lessonSummary || lesson.practicalApplication || lesson.reviewRecommendations?.length) && (
            <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-4 text-left space-y-2">
              {lesson.lessonSummary && (
                <p className="text-xs font-bold text-[#3C3C3C]">{lesson.lessonSummary}</p>
              )}
              {lesson.reviewRecommendations?.[0] && (
                <p className="text-xs font-semibold text-[#666666]">
                  Next tip: {lesson.reviewRecommendations[0]}
                </p>
              )}
              {lesson.practicalApplication?.route && (
                <Link
                  to={lesson.practicalApplication.route}
                  className="inline-block text-xs font-black text-[#1CB0F6] hover:underline"
                >
                  {lesson.practicalApplication.label} →
                </Link>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {isFinalUnitLesson && unit.masteryAssessmentId && (
              <TactileButton
                variant="secondary"
                fullWidth
                onClick={() => navigate(`/assessment/${unit.masteryAssessmentId}`)}
              >
                <Award className="h-5 w-5" />
                Take Unit Mastery Assessment
              </TactileButton>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <TactileButton fullWidth onClick={() => navigate('/learn')}>
                <Sparkles className="h-5 w-5" />
                Continue Learning Path
              </TactileButton>
              <TactileButton variant="outline" fullWidth onClick={() => navigate('/review')}>
                <RotateCcw className="h-4 w-4" />
                Review Mistakes
              </TactileButton>
            </div>
          </div>
        </QuestCard>
      </div>
    );
  }

  const hasAnswer = Array.isArray(answer) ? answer.length > 0 : answer.trim().length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 py-4">
        <button
          type="button"
          onClick={() => navigate('/learn')}
          aria-label="Exit lesson"
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#E5E5E5] text-[#666666] hover:bg-[#F7F8FA]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <QuestProgressBar
            value={currentIndex + (feedback?.checked ? 1 : 0)}
            max={queue.length}
            color="#58CC02"
            heightClass="h-4"
            label="Lesson progress"
          />
        </div>

        {preferences.heartsEnabled && (
          <div className="flex items-center gap-1 text-sm font-black text-[#FF4B4B]" title="Optional hearts indicator">
            <Heart className="h-5 w-5 fill-[#FF4B4B]" />
            <span>{hearts}</span>
          </div>
        )}

        <span className="text-xs font-black text-[#777777]">
          {currentIndex + 1}/{queue.length}
        </span>
      </header>

      {/* Non-blocking collapsible Lesson Briefing drawer */}
      {hasBriefingDetails && (
        <div className="mx-auto w-full max-w-2xl px-4 pb-1">
          <button
            type="button"
            onClick={() => setBriefingOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-2xl border border-[#BCE7FD] bg-[#F2FAFF] px-3.5 py-2 text-xs font-black text-[#0E8BC9] hover:bg-[#E3F6FF]"
          >
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Lesson Guide, Examples &amp; Practice Links ({unit.cefrLevel})
            </span>
            {briefingOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {briefingOpen && (
            <div className="mt-2 rounded-2xl border-2 border-[#BCE7FD] bg-white p-4 text-xs space-y-2.5 shadow-sm">
              {lesson.instructionalOverview && (
                <div>
                  <p className="font-black text-[#3C3C3C]">Lesson Overview</p>
                  <p className="font-semibold text-[#555555]">{lesson.instructionalOverview}</p>
                  {preferences.bilingualExplanations && lesson.instructionalOverviewVi && (
                    <p className="mt-0.5 font-semibold text-[#0E8BC9]">VI: {lesson.instructionalOverviewVi}</p>
                  )}
                </div>
              )}
              {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
                <div>
                  <p className="font-black text-[#3C3C3C]">Objectives</p>
                  <ul className="list-disc pl-4 font-semibold text-[#555555]">
                    {lesson.learningObjectives.map((obj) => (
                      <li key={obj}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}
              {lesson.contextualExamples && lesson.contextualExamples.length > 0 && (
                <div className="space-y-1">
                  <p className="font-black text-[#3C3C3C]">Model Examples</p>
                  {lesson.contextualExamples.map((ex, idx) => (
                    <div key={idx} className="rounded-xl bg-[#F7F8FA] px-3 py-2 border border-[#E5E5E5]">
                      <p className="font-bold text-[#3C3C3C]">{ex.english}</p>
                      {preferences.bilingualExplanations && ex.vietnamese && (
                        <p className="font-semibold text-[#666666]">{ex.vietnamese}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {lesson.guidedPracticeNote && (
                <p className="font-bold text-[#46A302]">Tip: {lesson.guidedPracticeNote}</p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#F0F0F0]">
                {lesson.practicalApplication?.route && (
                  <Link
                    to={lesson.practicalApplication.route}
                    className="font-black text-[#1CB0F6] hover:underline"
                  >
                    {lesson.practicalApplication.label} →
                  </Link>
                )}
                {lesson.reusedExerciseRefs && lesson.reusedExerciseRefs.length > 0 && (
                  <span className="text-[11px] font-semibold text-[#777777]">
                    Linked drills: {lesson.reusedExerciseRefs.map((r) => r.label).join(' • ')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-4">
        {currentExercise && (
          <ExerciseRenderer
            key={`${currentExercise.id}-${currentIndex}`}
            exercise={currentExercise}
            accent={preferences.preferredAccent}
            speechRate={preferences.speechRate}
            disabled={Boolean(feedback?.checked)}
            value={answer}
            onChange={setAnswer}
          />
        )}
      </main>

      <footer
        className={`border-t-2 px-4 py-5 transition-colors ${
          !feedback?.checked
            ? 'border-[#E5E5E5] bg-white'
            : feedback.isCorrect
              ? 'border-[#A5ED6E] bg-[#D7FFB8]'
              : 'border-[#FFB8B8] bg-[#FFDFE0]'
        }`}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {!feedback?.checked ? (
            <>
              <p className="text-sm font-bold text-[#777777]">
                {lesson.title} • +{lesson.xpReward} XP
              </p>
              <TactileButton
                size="lg"
                disabled={!hasAnswer}
                onClick={handleCheck}
                className="sm:min-w-[190px]"
              >
                Check Answer
              </TactileButton>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-[#46A302]" />
                ) : (
                  <XCircle className="mt-0.5 h-7 w-7 shrink-0 text-[#D32F2F]" />
                )}
                <div>
                  <p
                    className={`text-lg font-black ${
                      feedback.isCorrect ? 'text-[#46A302]' : 'text-[#D32F2F]'
                    }`}
                  >
                    {feedback.isCorrect ? 'Great job!' : 'Not quite — we added this to retry'}
                  </p>
                  {!feedback.isCorrect && (
                    <p className="mt-0.5 text-sm font-extrabold text-[#3C3C3C]">
                      Expected: {feedback.expectedDisplay}
                    </p>
                  )}
                  <p className="mt-1 text-sm font-bold text-[#3C3C3C]">
                    {currentExercise?.explanation}
                  </p>
                  {preferences.bilingualExplanations && currentExercise?.explanationVi && (
                    <p className="mt-0.5 text-xs font-bold text-[#555555]">
                      VI: {currentExercise.explanationVi}
                    </p>
                  )}
                </div>
              </div>
              <TactileButton
                size="lg"
                variant={feedback.isCorrect ? 'primary' : 'danger'}
                onClick={handleContinue}
                className="sm:min-w-[180px]"
              >
                Continue
              </TactileButton>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
