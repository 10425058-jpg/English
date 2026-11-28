import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Headphones,
  Mic,
  PenTool,
  Play,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  AssembledIELTSMockExam,
  IELTSMockAttemptDraft,
  IELTSMockAttemptResult,
  ProductiveAssessmentStatus,
} from '@english-quest/shared';
import {
  computeOverallBandIfEligible,
  convertListeningRawToBand,
  convertReadingRawToBand,
  evaluateExerciseAnswer,
  isComplete40QuestionMock,
  MINI_MOCK_SCALING_WARNING,
  UNOFFICIAL_IELTS_NOTICE,
} from '@english-quest/shared';
import { assembleIeltsMockExamById } from '@content/index';
import { PipMascot } from '@/components/mascot/PipMascot';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { getSpeechCapabilities, playFeedbackTone, speakText, stopSpeaking } from '@/services/speechService';
import { analyzeWritingLocally, countWords } from '@/services/writingAnalyzer';
import { useQuestStore } from '@/stores/useQuestStore';
import { IeltsVisualRenderer } from './IeltsVisualRenderer';

type SectionKey = 'listening' | 'reading' | 'writing' | 'speaking';

const SECTION_DEFAULT_SECONDS: Record<SectionKey, number> = {
  listening: 30 * 60,
  reading: 60 * 60,
  writing: 60 * 60,
  speaking: 14 * 60,
};

const BAND_OPTIONS = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

function formatClock(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatAssessmentStatus(status: ProductiveAssessmentStatus): string {
  if (status === 'teacher_assessed') return 'Teacher-Assessed';
  if (status === 'self_assessed') return 'Self-Assessed (Unofficial)';
  return 'Unassessed';
}

function buildWritingMechanicalFeedback(
  task1Text: string,
  task2Text: string,
  exam: AssembledIELTSMockExam
): NonNullable<IELTSMockAttemptResult['mechanicalFeedback']> {
  const w1 = countWords(task1Text);
  const w2 = countWords(task2Text);
  const paragraphCountT1 = task1Text.split(/\n+/).filter((p) => p.trim().length > 15).length;
  const paragraphCountT2 = task2Text.split(/\n+/).filter((p) => p.trim().length > 15).length;
  const connectorMatches = `${task1Text} ${task2Text}`.match(
    /\b(however|moreover|furthermore|therefore|consequently|although|whereas|overall|nevertheless|additionally|meanwhile)\b/gi
  );
  const connectorsCount = connectorMatches ? connectorMatches.length : 0;

  const notes: string[] = [
    `Task 1 mechanical length: ${w1} words (${paragraphCountT1} paragraph block${paragraphCountT1 === 1 ? '' : 's'}) vs ${exam.writingTask1.minWords}-word minimum.`,
    `Task 2 mechanical length: ${w2} words (${paragraphCountT2} paragraph block${paragraphCountT2 === 1 ? '' : 's'}) vs ${exam.writingTask2.minWords}-word minimum.`,
  ];

  if (w1 === 0 && w2 === 0) {
    notes.push('No written response submitted — Writing remains Unassessed until graded by a teacher or explicit rubric self-check.');
  } else {
    const combinedFeedback = analyzeWritingLocally(
      {
        id: exam.writingTask2.id,
        title: exam.writingTask2.title,
        category: 'ielts_task_2',
        cefrLevel: exam.writingTask2.cefrTarget,
        prompt: exam.writingTask2.prompt,
        instructions: '',
        minWords: 250,
        targetWords: 270,
        checklist: [],
        sampleResponse: '',
      },
      task2Text || task1Text
    );
    notes.push(...combinedFeedback.improvements.slice(0, 2));
    notes.push('Mechanical metrics do not evaluate argument logic, task accuracy, or nuance and NEVER generate a Band score.');
  }

  return {
    task1MinMet: w1 >= exam.writingTask1.minWords,
    task2MinMet: w2 >= exam.writingTask2.minWords,
    paragraphCountT1,
    paragraphCountT2,
    connectorsCount,
    notes,
  };
}

export function MockExamPlayerPage() {
  const { mockId } = useParams<{ mockId: string }>();
  const navigate = useNavigate();

  const preferences = useQuestStore((s) => s.preferences);
  const inProgressMockExam = useQuestStore((s) => s.inProgressMockExam);
  const saveInProgressMockExam = useQuestStore((s) => s.saveInProgressMockExam);
  const recordMockExamCompletion = useQuestStore((s) => s.recordMockExamCompletion);
  const updateMockProductiveAssessment = useQuestStore((s) => s.updateMockProductiveAssessment);
  const recordMistake = useQuestStore((s) => s.recordMistake);

  const [exam, setExam] = useState<AssembledIELTSMockExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const initialDraft =
    inProgressMockExam && inProgressMockExam.mockId === mockId ? inProgressMockExam : null;

  const [section, setSection] = useState<SectionKey>(initialDraft?.currentSection ?? 'listening');
  const [secondsLeft, setSecondsLeft] = useState(
    initialDraft?.sectionRemainingSeconds ?? SECTION_DEFAULT_SECONDS.listening
  );
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
  const [readingPassageIdx, setReadingPassageIdx] = useState(0);

  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string | string[]>>(
    initialDraft?.listeningAnswers ?? {}
  );
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string | string[]>>(
    initialDraft?.readingAnswers ?? {}
  );
  const [task1Text, setTask1Text] = useState(initialDraft?.writingTask1Draft ?? '');
  const [task2Text, setTask2Text] = useState(initialDraft?.writingTask2Draft ?? '');

  // Productive assessment starts strictly unassessed (no heuristic Writing band, no default Speaking 6.5)
  const [writingAssessmentStatus, setWritingAssessmentStatus] = useState<ProductiveAssessmentStatus>(
    initialDraft?.writingAssessmentStatus ?? 'unassessed'
  );
  const [writingSelfBand, setWritingSelfBand] = useState<number | null>(
    initialDraft?.writingSelfBand ?? null
  );
  const [speakingAssessmentStatus, setSpeakingAssessmentStatus] = useState<ProductiveAssessmentStatus>(
    initialDraft?.speakingAssessmentStatus ?? 'unassessed'
  );
  const [speakingSelfBand, setSpeakingSelfBand] = useState<number | null>(
    initialDraft?.speakingSelfBand ?? null
  );
  const [speakingNotes, setSpeakingNotes] = useState(initialDraft?.speakingNotes ?? '');
  const [teacherNotes, setTeacherNotes] = useState('');

  // Speaking Cue Card local prep/long-turn timers + audio recorder
  const [cueTimerMode, setCueTimerMode] = useState<'idle' | 'prep' | 'speak'>('idle');
  const [cueSeconds, setCueSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [micNote, setMicNote] = useState<string | null>(null);

  const [finalResult, setFinalResult] = useState<IELTSMockAttemptResult | null>(null);
  const [awardedXp, setAwardedXp] = useState(0);

  const startedAtRef = useRef<string>(initialDraft?.startedAt ?? new Date().toISOString());
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const capabilities = useMemo(() => getSpeechCapabilities(), []);

  useEffect(() => {
    let active = true;
    void assembleIeltsMockExamById(mockId ?? '').then((loaded) => {
      if (!active) return;
      if (!loaded) {
        setExam(null);
        setNotFound(true);
      } else {
        setExam(loaded);
        setNotFound(false);
      }
      setLoading(false);
    });
    return () => {
      active = false;
      stopSpeaking();
    };
  }, [mockId]);

  useEffect(() => {
    if (finalResult || !exam) return;
    const t = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
      setTotalElapsedSeconds((e) => e + 1);
    }, 1000);
    return () => window.clearInterval(t);
  }, [finalResult, exam]);

  useEffect(() => {
    if (!exam || finalResult) return;
    const saveTimer = window.setTimeout(() => {
      const draft: IELTSMockAttemptDraft = {
        mockId: exam.manifest.id,
        pathway: exam.manifest.pathway,
        examFormat: exam.manifest.examFormat,
        currentSection: section,
        sectionRemainingSeconds: secondsLeft,
        listeningAnswers,
        readingAnswers,
        writingTask1Draft: task1Text,
        writingTask2Draft: task2Text,
        writingAssessmentStatus,
        writingSelfBand,
        speakingAssessmentStatus,
        speakingSelfBand,
        speakingNotes,
        startedAt: startedAtRef.current,
        updatedAt: new Date().toISOString(),
      };
      saveInProgressMockExam(draft);
    }, 600);
    return () => window.clearTimeout(saveTimer);
  }, [
    exam,
    finalResult,
    section,
    secondsLeft,
    listeningAnswers,
    readingAnswers,
    task1Text,
    task2Text,
    writingAssessmentStatus,
    writingSelfBand,
    speakingAssessmentStatus,
    speakingSelfBand,
    speakingNotes,
    saveInProgressMockExam,
  ]);

  useEffect(() => {
    if (cueTimerMode === 'idle' || cueSeconds <= 0) return;
    const id = window.setInterval(() => {
      setCueSeconds((s) => {
        if (s <= 1) {
          setCueTimerMode('idle');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [cueTimerMode, cueSeconds]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F8FA] p-6 gap-3">
        <PipMascot mood="thinking" size={76} />
        <p className="text-base font-black text-[#4B4B4B]">Loading Mock Examination Bundle...</p>
      </div>
    );
  }

  if (notFound || !exam) {
    return (
      <div className="mx-auto max-w-2xl p-6 space-y-4">
        <QuestCard className="p-8 text-center space-y-4">
          <h1 className="text-xl font-black">Mock Exam Not Found</h1>
          <TactileButton variant="primary" onClick={() => navigate('/ielts')}>
            Return to IELTS Mastery Center
          </TactileButton>
        </QuestCard>
      </div>
    );
  }

  const switchSection = (next: SectionKey) => {
    stopSpeaking();
    setSection(next);
    setSecondsLeft(SECTION_DEFAULT_SECONDS[next]);
  };

  const handleFinishMock = () => {
    stopSpeaking();
    const listeningExercises = exam.listeningParts.flatMap((p) => p.exercises);
    const readingExercises = exam.readingPassages.flatMap((p) => p.exercises);

    let lRaw = 0;
    for (const ex of listeningExercises) {
      const val = listeningAnswers[ex.id] ?? '';
      const res = evaluateExerciseAnswer(ex, val);
      if (res.isCorrect) lRaw += 1;
      else {
        recordMistake({
          source: 'listening',
          skill: 'listening',
          cefrLevel: 'B2',
          prompt: ex.prompt,
          userAnswer: typeof val === 'string' ? val || '(blank)' : val.join(' '),
          expectedAnswer: res.expectedDisplay,
          explanation: ex.explanation,
          explanationVi: ex.explanationVi,
        });
      }
    }

    let rRaw = 0;
    for (const ex of readingExercises) {
      const val = readingAnswers[ex.id] ?? '';
      const res = evaluateExerciseAnswer(ex, val);
      if (res.isCorrect) rRaw += 1;
      else {
        recordMistake({
          source: 'reading',
          skill: 'reading',
          cefrLevel: 'B2',
          prompt: ex.prompt,
          userAnswer: typeof val === 'string' ? val || '(blank)' : val.join(' '),
          expectedAnswer: res.expectedDisplay,
          explanation: ex.explanation,
          explanationVi: ex.explanationVi,
        });
      }
    }

    const isComplete40 = isComplete40QuestionMock(listeningExercises.length, readingExercises.length);
    const examFormat = isComplete40 ? 'full_exam' : 'practice_mini';

    // Strict 40/40 gating: short 8L/15R mini-mocks MUST remain null (raw % only)
    const listeningBand = convertListeningRawToBand(lRaw, listeningExercises.length);
    const readingBand = convertReadingRawToBand(rRaw, exam.manifest.pathway, readingExercises.length);

    const wBand = writingAssessmentStatus === 'unassessed' ? null : writingSelfBand;
    const sBand = speakingAssessmentStatus === 'unassessed' ? null : speakingSelfBand;
    const overallBand = computeOverallBandIfEligible({
      examFormat,
      listening: listeningBand,
      reading: readingBand,
      writing: wBand,
      speaking: sBand,
    });

    const mechanicalFeedback = buildWritingMechanicalFeedback(task1Text, task2Text, exam);

    const { result, awardedXp: xpWon } = recordMockExamCompletion({
      mockId: exam.manifest.id,
      title: exam.manifest.title,
      pathway: exam.manifest.pathway,
      examFormat,
      listeningRaw: lRaw,
      listeningMax: listeningExercises.length,
      listeningBand,
      readingRaw: rRaw,
      readingMax: readingExercises.length,
      readingBand,
      writingBand: wBand,
      writingAssessmentStatus,
      writingTask1Words: countWords(task1Text),
      writingTask2Words: countWords(task2Text),
      mechanicalFeedback,
      speakingBand: sBand,
      speakingAssessmentStatus,
      teacherNotes: teacherNotes.trim() || undefined,
      overallBand,
      durationSeconds: Math.max(60, totalElapsedSeconds),
      isUnofficialEstimate: true,
    });

    setFinalResult(result);
    setAwardedXp(xpWon);
    playFeedbackTone('celebrate', preferences.soundEffects);
  };

  if (finalResult) {
    const profileData = [
      {
        skill: 'Listening',
        Band: finalResult.listeningBand ?? 0,
        status:
          finalResult.listeningBand !== null
            ? `Band ${finalResult.listeningBand.toFixed(1)} (${finalResult.listeningRaw}/${finalResult.listeningMax})`
            : `Raw ${finalResult.listeningRaw}/${finalResult.listeningMax} (No Band Scaling)`,
      },
      {
        skill: 'Reading',
        Band: finalResult.readingBand ?? 0,
        status:
          finalResult.readingBand !== null
            ? `Band ${finalResult.readingBand.toFixed(1)} (${finalResult.readingRaw}/${finalResult.readingMax})`
            : `Raw ${finalResult.readingRaw}/${finalResult.readingMax} (No Band Scaling)`,
      },
      {
        skill: 'Writing',
        Band: finalResult.writingBand ?? 0,
        status:
          finalResult.writingBand !== null
            ? `Band ${finalResult.writingBand.toFixed(1)} (${formatAssessmentStatus(finalResult.writingAssessmentStatus)})`
            : 'Unassessed',
      },
      {
        skill: 'Speaking',
        Band: finalResult.speakingBand ?? 0,
        status:
          finalResult.speakingBand !== null
            ? `Band ${finalResult.speakingBand.toFixed(1)} (${formatAssessmentStatus(finalResult.speakingAssessmentStatus)})`
            : 'Unassessed',
      },
    ];

    const applyPostExamAssessment = (
      nextWStatus: ProductiveAssessmentStatus,
      nextWBand: number | null,
      nextSStatus: ProductiveAssessmentStatus,
      nextSBand: number | null,
      notes: string
    ) => {
      updateMockProductiveAssessment(finalResult.id, {
        writingAssessmentStatus: nextWStatus,
        writingBand: nextWStatus === 'unassessed' ? null : nextWBand,
        speakingAssessmentStatus: nextSStatus,
        speakingBand: nextSStatus === 'unassessed' ? null : nextSBand,
        teacherNotes: notes.trim() || undefined,
      });
      const updatedOverall = computeOverallBandIfEligible({
        examFormat: finalResult.examFormat,
        listening: finalResult.listeningBand,
        reading: finalResult.readingBand,
        writing: nextWStatus === 'unassessed' ? null : nextWBand,
        speaking: nextSStatus === 'unassessed' ? null : nextSBand,
      });
      setFinalResult({
        ...finalResult,
        writingAssessmentStatus: nextWStatus,
        writingBand: nextWStatus === 'unassessed' ? null : nextWBand,
        speakingAssessmentStatus: nextSStatus,
        speakingBand: nextSStatus === 'unassessed' ? null : nextSBand,
        teacherNotes: notes.trim() || undefined,
        overallBand: updatedOverall,
      });
    };

    const lPct =
      finalResult.listeningMax > 0
        ? Math.round((finalResult.listeningRaw / finalResult.listeningMax) * 100)
        : 0;
    const rPct =
      finalResult.readingMax > 0
        ? Math.round((finalResult.readingRaw / finalResult.readingMax) * 100)
        : 0;

    return (
      <div className="min-h-screen bg-[#F7F8FA] p-4 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <HonestNotice
            title={
              finalResult.examFormat === 'full_exam'
                ? 'Unofficial 40/40 Exam Simulation Report'
                : 'Practice Mini-Mock Report (Raw Score Only — No Band Extrapolation)'
            }
            description={
              finalResult.examFormat === 'practice_mini'
                ? MINI_MOCK_SCALING_WARNING
                : UNOFFICIAL_IELTS_NOTICE
            }
            tone="warning"
          />

          <QuestCard className="space-y-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <PillBadge tone="purple">
                  <Award className="h-4 w-4" />
                  {finalResult.examFormat === 'full_exam' ? 'Full 40/40 Mock' : 'Practice Mini-Mock'} Complete (+{awardedXp} XP)
                </PillBadge>
                <h1 className="mt-2 text-2xl font-black text-[#3C3C3C]">{exam.manifest.title}</h1>
                <p className="text-sm font-semibold text-[#666666]">
                  Pathway: {exam.manifest.pathway === 'academic' ? 'Academic' : 'General Training'} • Completed in {Math.max(1, Math.round(finalResult.durationSeconds / 60))} min
                </p>
              </div>
              <div className="rounded-2xl border-2 border-[#CE82FF] bg-[#FAF4FF] px-6 py-4 text-center">
                <p className="text-xs font-black uppercase text-[#8E3FD6]">Est. Overall Band</p>
                <p className="text-4xl font-black text-[#3C3C3C]">
                  {finalResult.overallBand !== null ? finalResult.overallBand.toFixed(1) : 'N/A'}
                </p>
                <p className="text-[11px] font-bold text-[#777777]">
                  {finalResult.overallBand !== null
                    ? 'Unofficial 4-Skill Round (.25/.75)'
                    : finalResult.examFormat === 'practice_mini'
                      ? 'Short Mock (Needs 40L+40R)'
                      : 'Complete W + S Rubric Below'}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[#BCE7FD] bg-[#F2FAFF] p-3">
                <p className="text-xs font-black text-[#0E8BC9]">Listening</p>
                <p className="text-xl font-black">
                  {finalResult.listeningBand !== null
                    ? finalResult.listeningBand.toFixed(1)
                    : `${lPct}% raw`}
                </p>
                <p className="text-xs font-semibold text-[#555555]">
                  {finalResult.listeningRaw}/{finalResult.listeningMax} objective hits
                </p>
              </div>
              <div className="rounded-xl border border-[#C8F0A6] bg-[#EEFFDF] p-3">
                <p className="text-xs font-black text-[#357D00]">Reading</p>
                <p className="text-xl font-black">
                  {finalResult.readingBand !== null
                    ? finalResult.readingBand.toFixed(1)
                    : `${rPct}% raw`}
                </p>
                <p className="text-xs font-semibold text-[#555555]">
                  {finalResult.readingRaw}/{finalResult.readingMax} ({finalResult.pathway === 'academic' ? 'Academic' : 'GT'})
                </p>
              </div>
              <div className="rounded-xl border border-[#FFE175] bg-[#FFFBEB] p-3">
                <p className="text-xs font-black text-[#8A5A00]">
                  Writing ({formatAssessmentStatus(finalResult.writingAssessmentStatus)})
                </p>
                <p className="text-xl font-black">
                  {finalResult.writingBand !== null ? finalResult.writingBand.toFixed(1) : 'Unassessed'}
                </p>
                <p className="text-xs font-semibold text-[#555555]">
                  T1: {finalResult.writingTask1Words}w • T2: {finalResult.writingTask2Words}w
                </p>
              </div>
              <div className="rounded-xl border border-[#DFB9FF] bg-[#FAF4FF] p-3">
                <p className="text-xs font-black text-[#8E3FD6]">
                  Speaking ({formatAssessmentStatus(finalResult.speakingAssessmentStatus)})
                </p>
                <p className="text-xl font-black">
                  {finalResult.speakingBand !== null ? finalResult.speakingBand.toFixed(1) : 'Unassessed'}
                </p>
                <p className="text-xs font-semibold text-[#555555]">Criterion self / teacher check</p>
              </div>
            </div>

            {finalResult.mechanicalFeedback && finalResult.mechanicalFeedback.notes.length > 0 && (
              <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-4 space-y-1.5">
                <p className="text-xs font-black uppercase text-[#555555]">
                  Mechanical Writing Check (Non-Scoring Metadata)
                </p>
                <ul className="list-disc pl-5 text-xs font-semibold text-[#4B4B4B] space-y-1">
                  {finalResult.mechanicalFeedback.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-[#8E3FD6]" />
                <p className="text-sm font-black text-[#3C3C3C]">
                  Post-Exam Writing & Speaking Rubric / Teacher Grading Panel
                </p>
              </div>
              <p className="text-xs font-semibold text-[#666666]">
                Productive skills stay Unassessed unless you apply official 4-criterion self-assessment or enter a human teacher grade. On full 40/40 mocks, supplying both calculates Overall Band automatically.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3">
                  <label htmlFor="post-writing-mode" className="block text-xs font-black text-[#555555]">
                    Writing Grading Mode
                  </label>
                  <select
                    id="post-writing-mode"
                    value={finalResult.writingAssessmentStatus}
                    onChange={(e) => {
                      const mode = e.target.value as ProductiveAssessmentStatus;
                      const nextBand = mode === 'unassessed' ? null : (finalResult.writingBand ?? 6.0);
                      applyPostExamAssessment(
                        mode,
                        nextBand,
                        finalResult.speakingAssessmentStatus,
                        finalResult.speakingBand,
                        teacherNotes
                      );
                    }}
                    className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-2.5 py-1.5 text-xs font-bold"
                  >
                    <option value="unassessed">Unassessed (Mechanical Notes Only)</option>
                    <option value="self_assessed">Self-Assessed (4-Criterion Rubric)</option>
                    <option value="teacher_assessed">Teacher / Examiner Assessed</option>
                  </select>
                  {finalResult.writingAssessmentStatus !== 'unassessed' && (
                    <select
                      aria-label="Writing Band Selection"
                      value={finalResult.writingBand ?? 6.0}
                      onChange={(e) =>
                        applyPostExamAssessment(
                          finalResult.writingAssessmentStatus,
                          Number(e.target.value),
                          finalResult.speakingAssessmentStatus,
                          finalResult.speakingBand,
                          teacherNotes
                        )
                      }
                      className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-2.5 py-1.5 text-xs font-black"
                    >
                      {BAND_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          Writing Band {b.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3">
                  <label htmlFor="post-speaking-mode" className="block text-xs font-black text-[#555555]">
                    Speaking Grading Mode
                  </label>
                  <select
                    id="post-speaking-mode"
                    value={finalResult.speakingAssessmentStatus}
                    onChange={(e) => {
                      const mode = e.target.value as ProductiveAssessmentStatus;
                      const nextBand = mode === 'unassessed' ? null : (finalResult.speakingBand ?? 6.0);
                      applyPostExamAssessment(
                        finalResult.writingAssessmentStatus,
                        finalResult.writingBand,
                        mode,
                        nextBand,
                        teacherNotes
                      );
                    }}
                    className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-2.5 py-1.5 text-xs font-bold"
                  >
                    <option value="unassessed">Unassessed (Default)</option>
                    <option value="self_assessed">Self-Assessed (4-Criterion Rubric)</option>
                    <option value="teacher_assessed">Teacher / Examiner Assessed</option>
                  </select>
                  {finalResult.speakingAssessmentStatus !== 'unassessed' && (
                    <select
                      aria-label="Speaking Band Selection"
                      value={finalResult.speakingBand ?? 6.0}
                      onChange={(e) =>
                        applyPostExamAssessment(
                          finalResult.writingAssessmentStatus,
                          finalResult.writingBand,
                          finalResult.speakingAssessmentStatus,
                          Number(e.target.value),
                          teacherNotes
                        )
                      }
                      className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-2.5 py-1.5 text-xs font-black"
                    >
                      {BAND_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          Speaking Band {b.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <textarea
                rows={2}
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                onBlur={() =>
                  applyPostExamAssessment(
                    finalResult.writingAssessmentStatus,
                    finalResult.writingBand,
                    finalResult.speakingAssessmentStatus,
                    finalResult.speakingBand,
                    teacherNotes
                  )
                }
                placeholder="Optional teacher comments or self-rubric evidence notes..."
                className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white p-2.5 text-xs font-semibold"
              />
            </div>

            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height={240} minWidth={220}>
                <BarChart data={profileData} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
                  <XAxis dataKey="skill" />
                  <YAxis domain={[0, 9]} />
                  <Tooltip
                    formatter={(_val, _name, item) => [item?.payload?.status ?? 'Unassessed', 'Score']}
                  />
                  <Bar dataKey="Band" fill="#8E3FD6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t border-[#EFEFEF] pt-4">
              <Link to="/review">
                <TactileButton variant="outline">Review Logged Mistakes</TactileButton>
              </Link>
              <Link to="/ielts">
                <TactileButton variant="purple">Return to IELTS Mastery Center</TactileButton>
              </Link>
            </div>
          </QuestCard>
        </div>
      </div>
    );
  }

  const activeReadingPassage = exam.readingPassages[readingPassageIdx] ?? exam.readingPassages[0];
  const spkP1 = exam.speakingParts[0];
  const spkP2 = exam.speakingParts[1];
  const spkP3 = exam.speakingParts[2];
  const isFull40Exam = exam.manifest.examFormat === 'full_exam';

  const startSpeakingMic = async () => {
    if (!capabilities.micSupported) {
      setMicNote('Browser microphone capture unavailable; complete self-practice speaking answers cleanly with countdown.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        setRecordedUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: 'audio/webm' })));
        stream.getTracks().forEach((tr) => tr.stop());
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setMicNote(null);
    } catch {
      setMicNote('Microphone denied—complete guided vocal self-reflection below.');
    }
  };

  const stopSpeakingMic = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const liveWritingNotes = buildWritingMechanicalFeedback(task1Text, task2Text, exam);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="sticky top-0 z-30 border-b-2 border-[#E5E5E5] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/ielts"
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-black text-[#4B4B4B] hover:bg-[#F7F8FA]"
            >
              <ArrowLeft className="h-4 w-4" />
              Save & Exit
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-black text-[#3C3C3C] line-clamp-1">
                {exam.manifest.title}
              </h1>
              <p className="text-[11px] font-bold text-[#777777]">
                {exam.manifest.pathway === 'academic' ? 'Academic' : 'General Training'} •{' '}
                {isFull40Exam
                  ? 'Full 40L + 40R Exam (Band Curve Eligible)'
                  : 'Practice Mini-Mock (8L + 15R • Raw % Only)'}{' '}
                • Autosave Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-sm font-black ${
                secondsLeft < 180
                  ? 'border-[#FFD4D4] bg-[#FFF2F2] text-[#A91D1D]'
                  : 'border-[#BCE7FD] bg-[#F2FAFF] text-[#0E8BC9]'
              }`}
            >
              <Clock className="h-4 w-4" />
              {formatClock(secondsLeft)}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-2.5 flex max-w-6xl flex-wrap gap-2">
          {(
            [
              {
                key: 'listening',
                label: `1. Listening (${exam.manifest.listeningQuestionTotal}Q)`,
                icon: Headphones,
              },
              {
                key: 'reading',
                label: `2. Reading (${exam.manifest.readingQuestionTotal}Q Split Screen)`,
                icon: BookOpen,
              },
              { key: 'writing', label: '3. Writing (T1 + T2)', icon: PenTool },
              { key: 'speaking', label: '4. Speaking Simulation', icon: Mic },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => switchSection(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                  section === tab.key
                    ? 'border-[#8E3FD6] bg-[#F5E8FF] text-[#8E3FD6]'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
        <HonestNotice
          title={isFull40Exam ? 'Full 40/40 Exam Simulation Mode' : 'Practice Mini-Mock Mode (8L + 15R)'}
          description={isFull40Exam ? UNOFFICIAL_IELTS_NOTICE : MINI_MOCK_SCALING_WARNING}
          tone={isFull40Exam ? 'info' : 'warning'}
        />

        {section === 'listening' && (
          <div className="space-y-5">
            {exam.listeningParts.map((part, pIdx) => {
              const audioString = part.scriptLines.map((l) => `${l.speaker}: ${l.text}`).join(' ');
              return (
                <QuestCard key={part.id} className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <PillBadge tone="blue">
                        Part {pIdx + 1} • {part.exercises.length} Qs • {part.wordLimitNote}
                      </PillBadge>
                      <h2 className="mt-1.5 text-lg font-black">{part.title}</h2>
                      <p className="text-xs font-semibold text-[#666666]">{part.contextDescription}</p>
                    </div>
                    <div className="flex gap-2">
                      <TactileButton
                        size="sm"
                        variant="secondary"
                        onClick={() => speakText(audioString, { accent: part.accent, rate: 1.0 })}
                      >
                        <Volume2 className="h-4 w-4" />
                        Play Part {pIdx + 1} Audio
                      </TactileButton>
                      <TactileButton size="sm" variant="outline" onClick={stopSpeaking}>
                        <VolumeX className="h-4 w-4" />
                      </TactileButton>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {part.exercises.map((ex) => (
                      <div key={ex.id} className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4">
                        <ExerciseRenderer
                          key={ex.id}
                          exercise={ex}
                          accent={part.accent}
                          speechRate={1.0}
                          disabled={false}
                          value={listeningAnswers[ex.id] ?? ''}
                          onChange={(next) =>
                            setListeningAnswers((prev) => ({ ...prev, [ex.id]: next }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </QuestCard>
              );
            })}

            <div className="flex justify-end">
              <TactileButton variant="primary" onClick={() => switchSection('reading')}>
                Next Paper: Reading Section
                <ArrowRight className="h-4 w-4" />
              </TactileButton>
            </div>
          </div>
        )}

        {section === 'reading' && activeReadingPassage && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {exam.readingPassages.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setReadingPassageIdx(idx)}
                  className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                    readingPassageIdx === idx
                      ? 'border-[#58CC02] bg-[#EEFFDF] text-[#357D00]'
                      : 'border-[#E5E5E5] bg-white text-[#555555]'
                  }`}
                >
                  Passage {idx + 1} ({p.exercises.length} Qs)
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2 items-start">
              <QuestCard className="lg:sticky lg:top-28 lg:max-h-[70vh] lg:overflow-y-auto space-y-3">
                <PillBadge tone={activeReadingPassage.pathway === 'academic' ? 'purple' : 'blue'}>
                  {activeReadingPassage.sectionLabel}
                </PillBadge>
                <h2 className="text-xl font-black">{activeReadingPassage.title}</h2>
                {activeReadingPassage.paragraphs.map((para) => (
                  <div key={para.label} className="rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] p-3.5 space-y-1">
                    <p className="text-xs font-black uppercase text-[#0E8BC9]">{para.label}</p>
                    <p className="text-sm font-medium leading-relaxed text-[#3C3C3C]">{para.text}</p>
                  </div>
                ))}
              </QuestCard>

              <QuestCard className="space-y-4">
                <h3 className="text-base font-black">
                  Questions for {activeReadingPassage.sectionLabel}
                </h3>
                {activeReadingPassage.exercises.map((ex, i) => {
                  const cleanEx = { ...ex, passage: undefined };
                  return (
                    <div key={ex.id} className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4">
                      <p className="text-xs font-black uppercase text-[#777777] mb-2">Question {i + 1}</p>
                      <ExerciseRenderer
                        key={ex.id}
                        exercise={cleanEx}
                        accent={preferences.preferredAccent}
                        speechRate={1.0}
                        disabled={false}
                        value={readingAnswers[ex.id] ?? ''}
                        onChange={(next) =>
                          setReadingAnswers((prev) => ({ ...prev, [ex.id]: next }))
                        }
                      />
                    </div>
                  );
                })}
              </QuestCard>
            </div>

            <div className="flex justify-end">
              <TactileButton variant="primary" onClick={() => switchSection('writing')}>
                Next Paper: Writing Task 1 & 2
                <ArrowRight className="h-4 w-4" />
              </TactileButton>
            </div>
          </div>
        )}

        {section === 'writing' && (
          <div className="space-y-6">
            <QuestCard className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <PillBadge tone="gold">Task 1 • Recommended 20 Minutes • Min {exam.writingTask1.minWords} Words</PillBadge>
                  <h2 className="mt-2 text-lg font-black">{exam.writingTask1.title}</h2>
                </div>
                <PillBadge tone={countWords(task1Text) >= 150 ? 'green' : 'neutral'}>
                  {countWords(task1Text)} / 150 words
                </PillBadge>
              </div>
              <p className="text-sm font-bold text-[#3C3C3C]">{exam.writingTask1.prompt}</p>
              {exam.writingTask1.visualSpec && (
                <IeltsVisualRenderer visual={exam.writingTask1.visualSpec} />
              )}
              {exam.writingTask1.letterContext && (
                <div className="rounded-xl border border-[#DFB9FF] bg-[#FAF4FF] p-3 text-xs font-bold text-[#4B4B4B]">
                  Recipient: {exam.writingTask1.letterContext.recipientType} ({exam.writingTask1.letterContext.tone.replace('_', ' ')}) — Cover: {exam.writingTask1.letterContext.bulletPoints.join(' • ')}
                </div>
              )}
              <textarea
                rows={7}
                aria-label="Mock Writing Task 1 Response"
                value={task1Text}
                onChange={(e) => setTask1Text(e.target.value)}
                placeholder="Write your Task 1 response (>=150 words)..."
                className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 text-sm font-medium focus:border-[#1CB0F6] focus:outline-none"
              />
            </QuestCard>

            <QuestCard className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <PillBadge tone="gold">Task 2 • Recommended 40 Minutes • Min {exam.writingTask2.minWords} Words</PillBadge>
                  <h2 className="mt-2 text-lg font-black">{exam.writingTask2.title}</h2>
                </div>
                <PillBadge tone={countWords(task2Text) >= 250 ? 'green' : 'neutral'}>
                  {countWords(task2Text)} / 250 words
                </PillBadge>
              </div>
              <p className="text-sm font-bold text-[#3C3C3C]">{exam.writingTask2.prompt}</p>
              <textarea
                rows={9}
                aria-label="Mock Writing Task 2 Response"
                value={task2Text}
                onChange={(e) => setTask2Text(e.target.value)}
                placeholder="Write your 4-paragraph Task 2 essay (>=250 words)..."
                className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 text-sm font-medium focus:border-[#1CB0F6] focus:outline-none"
              />
            </QuestCard>

            <QuestCard className="space-y-3 border-2 border-[#E5E5E5]">
              <p className="text-sm font-black text-[#3C3C3C]">
                Mechanical Writing Feedback & Optional Criterion Assessment
              </p>
              <ul className="list-disc pl-5 text-xs font-semibold text-[#555555] space-y-1">
                {liveWritingNotes.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3 border-t border-[#EFEFEF] pt-3">
                <label htmlFor="mock-wrt-mode" className="text-xs font-black text-[#555555]">
                  Writing Assessment Status:
                </label>
                <select
                  id="mock-wrt-mode"
                  value={writingAssessmentStatus}
                  onChange={(e) => {
                    const next = e.target.value as ProductiveAssessmentStatus;
                    setWritingAssessmentStatus(next);
                    if (next === 'unassessed') setWritingSelfBand(null);
                    else if (writingSelfBand === null) setWritingSelfBand(6.0);
                  }}
                  className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-bold"
                >
                  <option value="unassessed">Unassessed (Default — Mechanical Notes Only)</option>
                  <option value="self_assessed">Self-Assessed (Task Achievement / Coherence / Lexis / Grammar)</option>
                  <option value="teacher_assessed">Teacher / Examiner Assessed</option>
                </select>
                {writingAssessmentStatus !== 'unassessed' && (
                  <select
                    aria-label="Writing Assessed Band"
                    value={writingSelfBand ?? 6.0}
                    onChange={(e) => setWritingSelfBand(Number(e.target.value))}
                    className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-sm font-black"
                  >
                    {BAND_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        Band {b.toFixed(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </QuestCard>

            <div className="flex justify-end">
              <TactileButton variant="primary" onClick={() => switchSection('speaking')}>
                Next Paper: Speaking Simulation
                <ArrowRight className="h-4 w-4" />
              </TactileButton>
            </div>
          </div>
        )}

        {section === 'speaking' && (
          <div className="space-y-5">
            {spkP1 && (
              <QuestCard className="space-y-3">
                <PillBadge tone="purple">Speaking Part 1 • Familiar Interview</PillBadge>
                <h2 className="text-lg font-black">{spkP1.title}</h2>
                <ul className="space-y-2">
                  {spkP1.questions.map((q) => (
                    <li key={q} className="flex items-center justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] p-3 text-sm font-bold">
                      <span>{q}</span>
                      <button
                        type="button"
                        onClick={() => speakText(q, { accent: preferences.preferredAccent })}
                        className="text-xs font-black text-[#0E8BC9] hover:underline"
                      >
                        Hear Question
                      </button>
                    </li>
                  ))}
                </ul>
              </QuestCard>
            )}

            {spkP2?.cueCard && (
              <QuestCard className="space-y-3 border-2 border-[#DFB9FF] bg-[#FAF4FF]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <PillBadge tone="purple">Speaking Part 2 • 1-Min Prep + 2-Min Long Turn</PillBadge>
                  <span className="text-xs font-black text-[#8E3FD6]">
                    {cueTimerMode === 'idle'
                      ? 'Cue Timer Ready'
                      : `${cueTimerMode === 'prep' ? 'Prep' : 'Speak'}: ${formatClock(cueSeconds)}`}
                  </span>
                </div>
                <p className="font-black text-[#3C3C3C]">{spkP2.cueCard.prompt}</p>
                <ul className="list-disc pl-5 text-sm font-bold text-[#4B4B4B]">
                  {spkP2.cueCard.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <TactileButton
                    size="sm"
                    variant="purple"
                    onClick={() => {
                      setCueTimerMode('prep');
                      setCueSeconds(60);
                    }}
                  >
                    Start 1-Min Prep
                  </TactileButton>
                  <TactileButton
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setCueTimerMode('speak');
                      setCueSeconds(120);
                    }}
                  >
                    Start 2-Min Turn
                  </TactileButton>
                </div>
              </QuestCard>
            )}

            {spkP3 && (
              <QuestCard className="space-y-3">
                <PillBadge tone="purple">Speaking Part 3 • Analytical Discussion</PillBadge>
                <h2 className="text-lg font-black">{spkP3.title}</h2>
                <ul className="space-y-2">
                  {spkP3.questions.map((q) => (
                    <li key={q} className="flex items-center justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] p-3 text-sm font-bold">
                      <span>{q}</span>
                      <button
                        type="button"
                        onClick={() => speakText(q, { accent: preferences.preferredAccent })}
                        className="text-xs font-black text-[#0E8BC9] hover:underline"
                      >
                        Hear Question
                      </button>
                    </li>
                  ))}
                </ul>
              </QuestCard>
            )}

            <QuestCard className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-black">Local Speaking Recorder & Criterion Self-Assessment</p>
                {!isRecording ? (
                  <TactileButton size="sm" variant="primary" onClick={startSpeakingMic}>
                    <Mic className="h-4 w-4" />
                    Record Response
                  </TactileButton>
                ) : (
                  <TactileButton size="sm" variant="danger" onClick={stopSpeakingMic}>
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </TactileButton>
                )}
              </div>
              {micNote && <p className="text-xs font-bold text-[#8A5A00]">{micNote}</p>}
              {recordedUrl && (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-[#46A302]" />
                  <audio controls src={recordedUrl} className="h-9 w-full max-w-md" />
                </div>
              )}
              <textarea
                rows={3}
                value={speakingNotes}
                onChange={(e) => setSpeakingNotes(e.target.value)}
                placeholder="Optional 60s Part 2 bullet notes or self-reflection across Fluency, Lexis, Grammar, and Pronunciation..."
                className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white p-3 text-xs font-semibold"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="mock-spk-mode" className="text-xs font-black text-[#555555]">
                    Speaking Assessment:
                  </label>
                  <select
                    id="mock-spk-mode"
                    value={speakingAssessmentStatus}
                    onChange={(e) => {
                      const next = e.target.value as ProductiveAssessmentStatus;
                      setSpeakingAssessmentStatus(next);
                      if (next === 'unassessed') setSpeakingSelfBand(null);
                      else if (speakingSelfBand === null) setSpeakingSelfBand(6.0);
                    }}
                    className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-bold"
                  >
                    <option value="unassessed">Unassessed (Default)</option>
                    <option value="self_assessed">Self-Assessed (Fluency/Lexis/Grammar/Pronunciation)</option>
                    <option value="teacher_assessed">Teacher / Examiner Assessed</option>
                  </select>
                  {speakingAssessmentStatus !== 'unassessed' && (
                    <select
                      aria-label="Speaking Assessed Band"
                      value={speakingSelfBand ?? 6.0}
                      onChange={(e) => setSpeakingSelfBand(Number(e.target.value))}
                      className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-sm font-black"
                    >
                      {BAND_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          Band {b.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <TactileButton variant="purple" onClick={handleFinishMock}>
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Mock Exam & View Honest Report
                </TactileButton>
              </div>
            </QuestCard>
          </div>
        )}
      </main>
    </div>
  );
}
