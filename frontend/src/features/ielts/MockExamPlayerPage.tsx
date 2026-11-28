import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
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
} from '@english-quest/shared';
import {
  convertListeningRawToBand,
  convertReadingRawToBand,
  evaluateExerciseAnswer,
  roundIeltsOverallBand,
  UNOFFICIAL_IELTS_NOTICE,
} from '@english-quest/shared';
import { assembleIeltsMockExamById } from '@content/index';
import { PipMascot } from '@/components/mascot/PipMascot';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { getSpeechCapabilities, playFeedbackTone, speakText, stopSpeaking } from '@/services/speechService';
import { countWords } from '@/services/writingAnalyzer';
import { useQuestStore } from '@/stores/useQuestStore';
import { IeltsVisualRenderer } from './IeltsVisualRenderer';

type SectionKey = 'listening' | 'reading' | 'writing' | 'speaking';

const SECTION_DEFAULT_SECONDS: Record<SectionKey, number> = {
  listening: 30 * 60,
  reading: 60 * 60,
  writing: 60 * 60,
  speaking: 14 * 60,
};

function formatClock(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Deterministic offline Writing band heuristic (unofficial self-practice estimate only):
 * checks word target compliance, paragraph segmentation, and analytical punctuation range.
 */
function estimateMockWritingBandHeuristic(task1Text: string, task2Text: string): number {
  const w1 = countWords(task1Text);
  const w2 = countWords(task2Text);
  const p1 = task1Text.split(/\n+/).filter((p) => p.trim().length > 20).length;
  const p2 = task2Text.split(/\n+/).filter((p) => p.trim().length > 20).length;

  let score1 = 4.0;
  if (w1 >= 150) score1 += 1.5;
  else if (w1 >= 80) score1 += 0.8;
  if (p1 >= 3) score1 += 0.8;
  if (/\b(overall|while|whereas|furthermore|dear|sincerely|faithfully)\b/i.test(task1Text)) score1 += 0.7;

  let score2 = 4.0;
  if (w2 >= 250) score2 += 1.5;
  else if (w2 >= 140) score2 += 0.8;
  if (p2 >= 4) score2 += 1.0;
  if (/\b(although|nevertheless|consequently|moreover|however|ultimately)\b/i.test(task2Text)) score2 += 0.8;

  const weighted = score1 * (1 / 3) + score2 * (2 / 3);
  const clamped = Math.max(4.0, Math.min(8.0, Math.round(weighted * 2) / 2));
  return clamped;
}

export function MockExamPlayerPage() {
  const { mockId } = useParams<{ mockId: string }>();
  const navigate = useNavigate();

  const preferences = useQuestStore((s) => s.preferences);
  const inProgressMockExam = useQuestStore((s) => s.inProgressMockExam);
  const saveInProgressMockExam = useQuestStore((s) => s.saveInProgressMockExam);
  const recordMockExamCompletion = useQuestStore((s) => s.recordMockExamCompletion);
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
  const [speakingSelfBand, setSpeakingSelfBand] = useState<number>(initialDraft?.speakingSelfBand ?? 6.5);
  const [speakingNotes, setSpeakingNotes] = useState(initialDraft?.speakingNotes ?? '');

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

  // Global section clock + crash recovery autosave every 3 seconds cleanly
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
        currentSection: section,
        sectionRemainingSeconds: secondsLeft,
        listeningAnswers,
        readingAnswers,
        writingTask1Draft: task1Text,
        writingTask2Draft: task2Text,
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
        <p className="text-base font-black text-[#4B4B4B]">Loading 4-Skill Mock Examination Bundle...</p>
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

  const handleFinishFullMock = () => {
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

    const listeningBand = convertListeningRawToBand(lRaw, listeningExercises.length);
    const readingBand = convertReadingRawToBand(rRaw, exam.manifest.pathway, readingExercises.length);
    const writingBand = estimateMockWritingBandHeuristic(task1Text, task2Text);
    const overallBand = roundIeltsOverallBand([
      listeningBand,
      readingBand,
      writingBand,
      speakingSelfBand,
    ]);

    const { result, awardedXp: xpWon } = recordMockExamCompletion({
      mockId: exam.manifest.id,
      title: exam.manifest.title,
      pathway: exam.manifest.pathway,
      listeningRaw: lRaw,
      listeningMax: listeningExercises.length,
      listeningBand,
      readingRaw: rRaw,
      readingMax: readingExercises.length,
      readingBand,
      writingBand,
      writingTask1Words: countWords(task1Text),
      writingTask2Words: countWords(task2Text),
      speakingBand: speakingSelfBand,
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
      { skill: 'Listening', Band: finalResult.listeningBand },
      { skill: 'Reading', Band: finalResult.readingBand },
      { skill: 'Writing (Heur.)', Band: finalResult.writingBand },
      { skill: 'Speaking (Self)', Band: finalResult.speakingBand },
    ];

    return (
      <div className="min-h-screen bg-[#F7F8FA] p-4 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <HonestNotice
            title="Unofficial 4-Skill Simulation Summary"
            description={UNOFFICIAL_IELTS_NOTICE}
            tone="warning"
          />

          <QuestCard className="space-y-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <PillBadge tone="purple">
                  <Award className="h-4 w-4" />
                  Mock Simulation Complete (+{awardedXp} XP)
                </PillBadge>
                <h1 className="mt-2 text-2xl font-black text-[#3C3C3C]">{exam.manifest.title}</h1>
                <p className="text-sm font-semibold text-[#666666]">
                  Pathway: {exam.manifest.pathway === 'academic' ? 'Academic' : 'General Training'} • Completed in {Math.max(1, Math.round(finalResult.durationSeconds / 60))} min
                </p>
              </div>
              <div className="rounded-2xl border-2 border-[#CE82FF] bg-[#FAF4FF] px-6 py-4 text-center">
                <p className="text-xs font-black uppercase text-[#8E3FD6]">Est. Overall Band</p>
                <p className="text-4xl font-black text-[#3C3C3C]">{finalResult.overallBand.toFixed(1)}</p>
                <p className="text-[11px] font-bold text-[#777777]">Unofficial Round (.25/.75)</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[#BCE7FD] bg-[#F2FAFF] p-3">
                <p className="text-xs font-black text-[#0E8BC9]">Listening</p>
                <p className="text-xl font-black">{finalResult.listeningBand.toFixed(1)}</p>
                <p className="text-xs font-semibold text-[#555555]">
                  {finalResult.listeningRaw}/{finalResult.listeningMax} raw objective
                </p>
              </div>
              <div className="rounded-xl border border-[#C8F0A6] bg-[#EEFFDF] p-3">
                <p className="text-xs font-black text-[#357D00]">Reading</p>
                <p className="text-xl font-black">{finalResult.readingBand.toFixed(1)}</p>
                <p className="text-xs font-semibold text-[#555555]">
                  {finalResult.readingRaw}/{finalResult.readingMax} ({finalResult.pathway === 'academic' ? 'Academic' : 'GT'} curve)
                </p>
              </div>
              <div className="rounded-xl border border-[#FFE175] bg-[#FFFBEB] p-3">
                <p className="text-xs font-black text-[#8A5A00]">Writing (Heuristic)</p>
                <p className="text-xl font-black">{finalResult.writingBand.toFixed(1)}</p>
                <p className="text-xs font-semibold text-[#555555]">
                  T1: {finalResult.writingTask1Words}w • T2: {finalResult.writingTask2Words}w
                </p>
              </div>
              <div className="rounded-xl border border-[#DFB9FF] bg-[#FAF4FF] p-3">
                <p className="text-xs font-black text-[#8E3FD6]">Speaking (Self)</p>
                <p className="text-xl font-black">{finalResult.speakingBand.toFixed(1)}</p>
                <p className="text-xs font-semibold text-[#555555]">Guided rubric self-check</p>
              </div>
            </div>

            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height={240} minWidth={220}>
                <BarChart data={profileData} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
                  <XAxis dataKey="skill" />
                  <YAxis domain={[0, 9]} />
                  <Tooltip />
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
      setMicNote('Microphone denied—complete guided vocal self-rating below.');
    }
  };

  const stopSpeakingMic = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Distraction-Free Top Exam Header Bar */}
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
                {exam.manifest.pathway === 'academic' ? 'Academic Paper' : 'General Training Paper'} • Autosave Active • Unofficial Mock
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

        {/* 4-Paper Exam Switcher Bar */}
        <div className="mx-auto mt-2.5 flex max-w-6xl flex-wrap gap-2">
          {(
            [
              { key: 'listening', label: '1. Listening (Parts 1–4)', icon: Headphones },
              { key: 'reading', label: '2. Reading (Split Screen)', icon: BookOpen },
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
          title="Exam Simulation Mode"
          description={UNOFFICIAL_IELTS_NOTICE}
          tone="info"
        />

        {/* SECTION 1: LISTENING */}
        {section === 'listening' && (
          <div className="space-y-5">
            {exam.listeningParts.map((part, pIdx) => {
              const audioString = part.scriptLines.map((l) => `${l.speaker}: ${l.text}`).join(' ');
              return (
                <QuestCard key={part.id} className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <PillBadge tone="blue">Part {pIdx + 1} • {part.wordLimitNote}</PillBadge>
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

        {/* SECTION 2: READING SPLIT SCREEN */}
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

        {/* SECTION 3: WRITING */}
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

            <div className="flex justify-end">
              <TactileButton variant="primary" onClick={() => switchSection('speaking')}>
                Next Paper: Speaking Simulation
                <ArrowRight className="h-4 w-4" />
              </TactileButton>
            </div>
          </div>
        )}

        {/* SECTION 4: SPEAKING */}
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
                placeholder="Optional 60s Part 2 bullet notes or self-reflection..."
                className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white p-3 text-xs font-semibold"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="mock-spk-band" className="text-xs font-black text-[#555555]">
                    Honest Criterion Self-Rating (Unofficial):
                  </label>
                  <select
                    id="mock-spk-band"
                    value={speakingSelfBand}
                    onChange={(e) => setSpeakingSelfBand(Number(e.target.value))}
                    className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-sm font-black"
                  >
                    {[4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5].map((b) => (
                      <option key={b} value={b}>
                        Band {b.toFixed(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <TactileButton variant="purple" onClick={handleFinishFullMock}>
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Full Mock Exam & View Unofficial Report
                </TactileButton>
              </div>
            </QuestCard>
          </div>
        )}
      </main>
    </div>
  );
}
