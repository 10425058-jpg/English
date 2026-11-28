import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Info,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import {
  evaluateExerciseAnswer,
  type AssessmentAttemptRecord,
  type Exercise,
  type SkillTag,
  type StructuredAssessment,
} from '@english-quest/shared';
import { loadAssessmentById } from '@content/index';
import { PipMascot } from '@/components/mascot/PipMascot';
import { QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';
import { ExerciseRenderer } from './ExerciseRenderer';

interface WrongAnswerDetail {
  exercise: Exercise;
  userAnswer: string;
}

const KIND_LABELS: Record<StructuredAssessment['kind'], string> = {
  placement: 'Placement Diagnostic',
  unit_mastery: 'Unit Mastery Assessment',
  section_review: 'Section Transition Review',
  level_completion: 'CEFR Level Completion Exam',
  skill_diagnostic: 'Four-Skill Diagnostic',
  mixed_review: 'Mixed Retention Review',
};

export function AssessmentPlayerPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { data: assessment, isLoading } = useQuery({
    queryKey: ['structured-assessment', assessmentId],
    queryFn: () => (assessmentId ? loadAssessmentById(assessmentId) : Promise.resolve(null)),
    enabled: Boolean(assessmentId),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 p-6">
        <PipMascot mood="thinking" size={76} />
        <p className="text-sm font-black text-[#777777]">Loading structured CEFR assessment...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center space-y-4">
        <PipMascot mood="encouraging" size={88} />
        <h1 className="text-2xl font-black text-[#4B4B4B]">Assessment Not Found</h1>
        <p className="text-sm font-bold text-[#777777]">
          Return to the CEFR Learning Path to select an active Unit Mastery Assessment or Level Exam.
        </p>
        <Link to="/learn">
          <TactileButton>Back to Learning Path</TactileButton>
        </Link>
      </div>
    );
  }

  return <AssessmentSession key={assessment.id} assessment={assessment} />;
}

function AssessmentSession({ assessment }: { assessment: StructuredAssessment }) {
  const navigate = useNavigate();
  const preferences = useQuestStore((s) => s.preferences);
  const recordAssessmentAttempt = useQuestStore((s) => s.recordAssessmentAttempt);
  const recordMistake = useQuestStore((s) => s.recordMistake);

  const [step, setStep] = useState<'running' | 'productive' | 'summary'>('running');
  const [exIndex, setExIndex] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>('');
  const [feedback, setFeedback] = useState<{
    checked: boolean;
    isCorrect: boolean;
    expectedDisplay: string;
  } | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [skillCounts, setSkillCounts] = useState<
    Partial<Record<SkillTag, { correct: number; total: number }>>
  >({});
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerDetail[]>([]);
  const [productiveText, setProductiveText] = useState('');
  const [rubricChecked, setRubricChecked] = useState<Record<number, boolean>>({});
  const [resultRecord, setResultRecord] = useState<{
    record: AssessmentAttemptRecord;
    awardedXp: number;
  } | null>(null);

  const startedAtRef = useRef(0);
  const savedAttemptRef = useRef(false);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const exercises = assessment.exercises;
  const currentExercise = exercises[exIndex];

  const hasAnswer = useMemo(() => {
    if (Array.isArray(answer)) return answer.length > 0;
    return answer.trim().length > 0;
  }, [answer]);

  const wordCount = useMemo(
    () =>
      productiveText
        .trim()
        .split(/\s+/)
        .filter(Boolean).length,
    [productiveText],
  );

  function finalizeAssessment(
    finalCorrect: number,
    finalSkillCounts: Partial<Record<SkillTag, { correct: number; total: number }>>,
    productiveSelfChecked: boolean,
  ) {
    if (savedAttemptRef.current) return;
    savedAttemptRef.current = true;

    const total = assessment.exercises.length;
    const accuracyPercent = total > 0 ? Math.round((finalCorrect / total) * 100) : 0;
    const passed = accuracyPercent >= assessment.passingPercent;
    const durationSeconds = Math.max(15, Math.round((Date.now() - startedAtRef.current) / 1000));

    const outcome = recordAssessmentAttempt({
      assessmentId: assessment.id,
      kind: assessment.kind,
      cefrLevel: assessment.cefrLevel,
      unitId: assessment.unitId,
      title: assessment.title,
      correctCount: finalCorrect,
      totalObjectiveCount: total,
      accuracyPercent,
      passed,
      skillBreakdown: finalSkillCounts,
      productiveResponse: productiveText.trim() || undefined,
      productiveSelfCheckDone: productiveSelfChecked,
      durationSeconds,
    });
    setResultRecord(outcome);
    setStep('summary');
  }

  function handleCheckAnswer() {
    if (!currentExercise || feedback?.checked) return;

    const evalRes = evaluateExerciseAnswer(currentExercise, answer);
    const updatedSkillCounts = { ...skillCounts };
    for (const sk of currentExercise.skills) {
      const prev = updatedSkillCounts[sk] ?? { correct: 0, total: 0 };
      updatedSkillCounts[sk] = {
        correct: prev.correct + (evalRes.isCorrect ? 1 : 0),
        total: prev.total + 1,
      };
    }
    setSkillCounts(updatedSkillCounts);

    const userDisplay = Array.isArray(answer) ? answer.join(' ') : answer;
    if (evalRes.isCorrect) {
      setCorrectCount((c) => c + 1);
      playFeedbackTone('correct', preferences.soundEffects);
    } else {
      playFeedbackTone('wrong', preferences.soundEffects);
      setWrongAnswers((prev) => [...prev, { exercise: currentExercise, userAnswer: userDisplay }]);
      recordMistake({
        source: 'lesson',
        skill: currentExercise.skills[0] ?? 'grammar',
        cefrLevel: assessment.cefrLevel,
        prompt: currentExercise.prompt,
        userAnswer: userDisplay,
        expectedAnswer: evalRes.expectedDisplay,
        explanation: currentExercise.explanation,
        explanationVi: currentExercise.explanationVi,
      });
    }

    setFeedback({
      checked: true,
      isCorrect: evalRes.isCorrect,
      expectedDisplay: evalRes.expectedDisplay,
    });
  }

  function handleContinue() {
    if (exIndex + 1 < exercises.length) {
      setExIndex((i) => i + 1);
      setAnswer('');
      setFeedback(null);
    } else if (assessment.productivePrompt) {
      setFeedback(null);
      setStep('productive');
    } else {
      finalizeAssessment(correctCount, skillCounts, false);
    }
  }

  function handleRestart() {
    savedAttemptRef.current = false;
    startedAtRef.current = Date.now();
    setExIndex(0);
    setAnswer('');
    setFeedback(null);
    setCorrectCount(0);
    setSkillCounts({});
    setWrongAnswers([]);
    setProductiveText('');
    setRubricChecked({});
    setResultRecord(null);
    setStep('running');
  }

  if (step === 'summary' && resultRecord) {
    const { record, awardedXp } = resultRecord;
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8 space-y-5">
        <QuestCard className="space-y-4 border-2 border-[#CE82FF]/40 bg-gradient-to-br from-white to-[#CE82FF]/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <PipMascot mood={record.passed ? 'celebrating' : 'encouraging'} size={76} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-[#CE82FF]/15 px-2.5 py-0.5 text-[11px] font-black uppercase text-[#9A42D9]">
                    {assessment.cefrLevel} • {KIND_LABELS[assessment.kind]}
                  </span>
                  <span
                    className={`rounded-lg px-2.5 py-0.5 text-[11px] font-black uppercase ${
                      record.passed
                        ? 'bg-[#58CC02]/15 text-[#46A302]'
                        : 'bg-[#FF9600]/15 text-[#CC7800]'
                    }`}
                  >
                    {record.passed
                      ? `Passed (${assessment.passingPercent}% target)`
                      : `Below ${assessment.passingPercent}% target — Review Suggested`}
                  </span>
                </div>
                <h1 className="mt-1 text-xl sm:text-2xl font-black text-[#4B4B4B]">
                  {assessment.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white px-4 py-2 text-center">
                <p className="text-[11px] font-black uppercase text-[#777777]">Mastery Score</p>
                <p
                  className={`text-2xl font-black ${
                    record.passed ? 'text-[#58CC02]' : 'text-[#FF9600]'
                  }`}
                >
                  {record.accuracyPercent}%
                </p>
                <p className="text-[11px] font-bold text-[#777777]">
                  {record.correctCount}/{record.totalObjectiveCount} correct
                </p>
              </div>
              {awardedXp > 0 && (
                <div className="rounded-2xl border-2 border-[#FFC800]/50 bg-[#FFC800]/10 px-4 py-2 text-center">
                  <p className="text-[11px] font-black uppercase text-[#A06000]">First-Pass XP</p>
                  <p className="text-2xl font-black text-[#CC7800]">+{awardedXp}</p>
                  <p className="text-[10px] font-bold text-[#777777]">XP != Mastery</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#1CB0F6]/25 bg-[#1CB0F6]/5 px-3.5 py-2.5 flex items-start gap-2.5 text-xs font-bold text-[#4B4B4B]">
            <Info className="h-4 w-4 text-[#1CB0F6] shrink-0 mt-0.5" />
            <span>{assessment.isUnofficialNotice}</span>
          </div>
        </QuestCard>

        <QuestCard className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[#1CB0F6]" />
            <h2 className="text-base font-black text-[#4B4B4B]">Skill Performance Breakdown</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(record.skillBreakdown).map(([skill, stats]) => {
              if (!stats || stats.total === 0) return null;
              const pct = Math.round((stats.correct / stats.total) * 100);
              return (
                <div
                  key={skill}
                  className="rounded-xl border-2 border-[#E5E5E5] bg-[#F7F7F7] px-3.5 py-2.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-black uppercase">
                    <span className="text-[#4B4B4B]">{skill}</span>
                    <span className={pct >= 70 ? 'text-[#58CC02]' : 'text-[#FF9600]'}>
                      {pct}% ({stats.correct}/{stats.total})
                    </span>
                  </div>
                  <QuestProgressBar
                    value={pct}
                    max={100}
                    color={pct >= 70 ? '#58CC02' : '#FF9600'}
                    heightClass="h-2"
                    label={skill}
                  />
                </div>
              );
            })}
          </div>
        </QuestCard>

        {wrongAnswers.length > 0 && (
          <QuestCard className="space-y-3 border-2 border-[#FF4B4B]/25">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-[#FF4B4B]" />
                <h2 className="text-base font-black text-[#4B4B4B]">
                  Mistake Breakdown ({wrongAnswers.length} item{wrongAnswers.length > 1 ? 's' : ''} logged)
                </h2>
              </div>
              <Link to="/mistakes" className="text-xs font-black text-[#1CB0F6] hover:underline">
                Open Mistake Notebook →
              </Link>
            </div>
            <div className="space-y-2.5">
              {wrongAnswers.map(({ exercise, userAnswer }) => (
                <div
                  key={exercise.id}
                  className="rounded-xl border border-[#E5E5E5] bg-[#FFF8F8] p-3 text-xs space-y-1"
                >
                  <p className="font-black text-[#4B4B4B]">{exercise.prompt}</p>
                  <p className="font-bold text-[#EA2B2B]">Your answer: {userAnswer}</p>
                  <p className="font-bold text-[#46A302]">
                    Target answer:{' '}
                    {Array.isArray(exercise.correctAnswer)
                      ? exercise.correctAnswer.join(' / ')
                      : exercise.correctAnswer}
                  </p>
                  <p className="text-[#666666] font-semibold">{exercise.explanation}</p>
                  {exercise.explanationVi && (
                    <p className="text-[#1CB0F6] font-semibold">VN: {exercise.explanationVi}</p>
                  )}
                </div>
              ))}
            </div>
          </QuestCard>
        )}

        {assessment.productivePrompt && productiveText.trim() && (
          <QuestCard className="space-y-2 bg-[#F7F7F7]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#CE82FF]" />
              <h2 className="text-sm font-black text-[#4B4B4B]">
                Productive Task Draft ({wordCount} words • Self-Evaluated Rubric)
              </h2>
            </div>
            <p className="text-xs font-semibold text-[#555555] whitespace-pre-wrap rounded-xl bg-white border border-[#E5E5E5] p-3">
              {productiveText}
            </p>
          </QuestCard>
        )}

        <QuestCard className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#58CC02]" />
            <h2 className="text-base font-black text-[#4B4B4B]">Targeted Next Steps</h2>
          </div>
          <div className="space-y-2">
            {assessment.revisionRecommendations.map((rec, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] px-3.5 py-2.5"
              >
                <div>
                  <span className="text-[11px] font-black uppercase text-[#1CB0F6]">
                    {rec.condition}
                  </span>
                  <p className="text-xs font-bold text-[#4B4B4B]">{rec.recommendation}</p>
                </div>
                <Link
                  to={rec.route}
                  className="text-xs font-black text-[#1CB0F6] whitespace-nowrap hover:underline"
                >
                  Open Module →
                </Link>
              </div>
            ))}
          </div>
        </QuestCard>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <TactileButton variant="outline" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" />
            Retake Assessment
          </TactileButton>
          <TactileButton onClick={() => navigate('/learn')}>
            <Award className="h-4 w-4" />
            Back to CEFR Learning Path
          </TactileButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F7F7]">
      <header className="sticky top-0 z-20 border-b-2 border-[#E5E5E5] bg-white/95 backdrop-blur px-4 py-3">
        <div className="mx-auto max-w-3xl flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/learn')}
            aria-label="Exit assessment"
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#E5E5E5] px-3 py-1.5 text-xs font-black text-[#4B4B4B] hover:bg-[#F7F7F7] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit
          </button>

          <div className="flex-1 max-w-md space-y-1">
            <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#777777]">
              <span>
                {assessment.cefrLevel} • {KIND_LABELS[assessment.kind]}
              </span>
              <span>
                {step === 'productive'
                  ? 'Productive Task'
                  : `Q${exIndex + 1} / ${exercises.length}`}
              </span>
            </div>
            <QuestProgressBar
              value={step === 'productive' ? exercises.length : exIndex + 1}
              max={Math.max(1, exercises.length + (assessment.productivePrompt ? 1 : 0))}
              color="#CE82FF"
              heightClass="h-3"
              label="Assessment progress"
            />
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-[#CE82FF]/15 px-3 py-1 text-xs font-black text-[#9A42D9]">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Pass {assessment.passingPercent}%
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 space-y-5">
        <QuestCard className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E5E5E5]">
          <div>
            <h1 className="text-base sm:text-lg font-black text-[#4B4B4B]">{assessment.title}</h1>
            <p className="text-xs font-bold text-[#777777]">{assessment.subtitle}</p>
          </div>
          <span className="rounded-xl bg-[#1CB0F6]/10 px-3 py-1 text-[11px] font-black text-[#1CB0F6] shrink-0">
            Internal Practice Assessment
          </span>
        </QuestCard>

        {step === 'running' && currentExercise && (
          <QuestCard className="p-5 sm:p-6">
            <ExerciseRenderer
              key={`${currentExercise.id}-${exIndex}`}
              exercise={currentExercise}
              accent={preferences.preferredAccent}
              speechRate={preferences.speechRate}
              disabled={Boolean(feedback?.checked)}
              value={answer}
              onChange={setAnswer}
            />
          </QuestCard>
        )}

        {step === 'productive' && assessment.productivePrompt && (
          <QuestCard className="p-5 sm:p-6 space-y-4 border-2 border-[#CE82FF]/40">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-xl bg-[#CE82FF]/15 px-3 py-1 text-xs font-black uppercase text-[#9A42D9]">
                Productive Extension ({assessment.productivePrompt.skill})
              </span>
              <span className="text-xs font-bold text-[#777777]">
                Self-Evaluated Rubric (not AI-scored)
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#4B4B4B]">
                {assessment.productivePrompt.prompt}
              </h2>
              {assessment.productivePrompt.promptVi && (
                <p className="text-xs font-bold text-[#1CB0F6]">
                  VN: {assessment.productivePrompt.promptVi}
                </p>
              )}
            </div>

            <textarea
              value={productiveText}
              onChange={(e) => setProductiveText(e.target.value)}
              rows={5}
              placeholder={
                assessment.productivePrompt.skill === 'speaking'
                  ? 'Practice aloud first, then jot your key spoken points or transcript outline here...'
                  : `Draft your response here (target around ${assessment.productivePrompt.minRequirement}+ words)...`
              }
              className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white p-3.5 text-sm font-semibold text-[#4B4B4B] focus:border-[#CE82FF] focus:outline-none"
            />

            <div className="flex items-center justify-between text-xs font-bold text-[#777777]">
              <span>Current word count: {wordCount}</span>
              <span>
                Suggested target:{' '}
                {assessment.productivePrompt.skill === 'speaking'
                  ? `${assessment.productivePrompt.minRequirement}+ key points`
                  : `${assessment.productivePrompt.minRequirement}+ words`}
              </span>
            </div>

            <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F7F7] p-4 space-y-2.5">
              <p className="text-xs font-black uppercase text-[#4B4B4B]">
                Self-Check Rubric Before Finishing
              </p>
              {assessment.productivePrompt.rubricCriteria.map((rc, idx) => (
                <label
                  key={rc.criterion}
                  className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-[#4B4B4B]"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(rubricChecked[idx])}
                    onChange={(e) =>
                      setRubricChecked((prev) => ({ ...prev, [idx]: e.target.checked }))
                    }
                    className="mt-0.5 h-4 w-4 rounded border-[#CE82FF]"
                  />
                  <span>
                    <strong className="font-black">{rc.criterion}:</strong> {rc.descriptor}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <TactileButton
                variant="outline"
                onClick={() => finalizeAssessment(correctCount, skillCounts, false)}
              >
                Skip Productive Draft & See Score
              </TactileButton>
              <TactileButton
                onClick={() =>
                  finalizeAssessment(
                    correctCount,
                    skillCounts,
                    Object.values(rubricChecked).some(Boolean) || wordCount > 0,
                  )
                }
              >
                <CheckCircle2 className="h-4 w-4" />
                Submit & View Full Diagnostic
              </TactileButton>
            </div>
          </QuestCard>
        )}
      </main>

      {step === 'running' && (
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
                  Question {exIndex + 1} of {exercises.length} • Pass Target {assessment.passingPercent}%
                </p>
                <TactileButton
                  size="lg"
                  disabled={!hasAnswer}
                  onClick={handleCheckAnswer}
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
                      {feedback.isCorrect ? 'Spot-on answer!' : 'Incorrect — added to Mistake Notebook'}
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
      )}
    </div>
  );
}
