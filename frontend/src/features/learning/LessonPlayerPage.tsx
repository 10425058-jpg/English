import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Heart, RotateCcw, Sparkles, X, XCircle } from 'lucide-react';
import { evaluateExerciseAnswer, type Exercise } from '@english-quest/shared';
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
  return <LessonSession key={lessonId ?? 'missing'} lessonId={lessonId} />;
}

function LessonSession({ lessonId }: { lessonId?: string }) {
  const navigate = useNavigate();

  const found = useMemo(() => (lessonId ? getLessonById(lessonId) : null), [lessonId]);

  const preferences = useQuestStore((s) => s.preferences);
  const hearts = useQuestStore((s) => s.hearts);
  const inProgress = useQuestStore((s) => s.inProgressLesson);
  const saveInProgressLesson = useQuestStore((s) => s.saveInProgressLesson);
  const completeLessonAttempt = useQuestStore((s) => s.completeLessonAttempt);
  const recordMistake = useQuestStore((s) => s.recordMistake);

  const attemptIdRef = useRef<string>('');
  const startedAtRef = useRef<number>(0);

  const initialExercises = useMemo(() => found?.lesson.exercises ?? [], [found]);

  const [queue, setQueue] = useState<Exercise[]>(initialExercises);
  const [currentIndex, setCurrentIndex] = useState(() =>
    inProgress && inProgress.lessonId === lessonId && inProgress.exerciseIndex < initialExercises.length
      ? inProgress.exerciseIndex
      : 0
  );
  const [answer, setAnswer] = useState<string | string[]>('');
  const [feedback, setFeedback] = useState<{
    checked: boolean;
    isCorrect: boolean;
    expectedDisplay: string;
  } | null>(null);
  const [firstPassCorrect, setFirstPassCorrect] = useState(0);
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());
  const [completionSummary, setCompletionSummary] = useState<{
    awardedXp: number;
    accuracy: number;
    durationSeconds: number;
  } | null>(null);

  useEffect(() => {
    if (!found) return;
    attemptIdRef.current = createAttemptKey('attempt', found.lesson.id);
    startedAtRef.current = currentEpochMs();
  }, [found]);

  if (!found) {
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

  const { unit, lesson } = found;
  const currentExercise = queue[currentIndex];

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
      // Queue for retry at the end of the lesson so learner masters it before finishing
      setQueue((prev) => [...prev, currentExercise]);
      recordMistake({
        source: 'lesson',
        skill: currentExercise.skills[0] ?? 'vocabulary',
        cefrLevel: lesson.cefrLevel,
        prompt: currentExercise.prompt,
        userAnswer: result.normalizedUserAnswer || '(no answer)',
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4 py-10">
        <QuestCard className="w-full max-w-lg text-center p-8">
          <PipMascot mood="celebrating" size={120} />
          <h1 className="mt-4 text-3xl font-black text-[#58CC02]">Lesson Complete!</h1>
          <p className="mt-1 text-base font-bold text-[#666666]">
            {unit.cefrLevel} • {lesson.title}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
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

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <TactileButton fullWidth onClick={() => navigate('/learn')}>
              <Sparkles className="h-5 w-5" />
              Continue Learning Path
            </TactileButton>
            <TactileButton variant="outline" fullWidth onClick={() => navigate('/review')}>
              <RotateCcw className="h-4 w-4" />
              Review Mistakes
            </TactileButton>
          </div>
        </QuestCard>
      </div>
    );
  }

  const hasAnswer = Array.isArray(answer) ? answer.length > 0 : answer.trim().length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top Progress Header */}
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

      {/* Main Exercise Area */}
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

      {/* Bottom Action & Feedback Footer */}
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
