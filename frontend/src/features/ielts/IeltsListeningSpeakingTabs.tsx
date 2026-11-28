import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Headphones,
  Mic,
  Play,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type {
  EnglishAccent,
  IELTSListeningActivity,
  IELTSListeningPart,
  IELTSSpeakingActivity,
  IELTSSpeakingPart,
} from '@english-quest/shared';
import {
  convertListeningRawToBand,
  evaluateExerciseAnswer,
  UNOFFICIAL_IELTS_NOTICE,
} from '@english-quest/shared';
import { PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { createAttemptKey } from '@/services/idempotency';
import {
  getSpeechCapabilities,
  playFeedbackTone,
  speakText,
  stopSpeaking,
} from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

interface ListeningTabProps {
  items: IELTSListeningActivity[];
  accent: EnglishAccent;
  soundEffects: boolean;
}

const LISTENING_PARTS: Array<{ key: 'all' | IELTSListeningPart; label: string }> = [
  { key: 'all', label: 'All Parts (80)' },
  { key: 'part_1', label: 'Part 1 • Everyday Dialogue (20)' },
  { key: 'part_2', label: 'Part 2 • Social Monologue (20)' },
  { key: 'part_3', label: 'Part 3 • Seminar Discussion (20)' },
  { key: 'part_4', label: 'Part 4 • Academic Lecture (20)' },
];

export function IeltsListeningTab({ items, accent, soundEffects }: ListeningTabProps) {
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);

  const [partFilter, setPartFilter] = useState<'all' | IELTSListeningPart>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? '');
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1.0 | 1.25>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTraps, setShowTraps] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (partFilter !== 'all' && item.part !== partFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.contextDescription.toLowerCase().includes(q)
      );
    });
  }, [items, partFilter, searchQuery]);

  const active = useMemo(
    () => filtered.find((x) => x.id === selectedId) ?? filtered[0] ?? items[0],
    [filtered, selectedId, items]
  );

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  if (!active) return null;

  const selectItem = (id: string) => {
    stopSpeaking();
    setSelectedId(id);
    setAnswers({});
    setChecked(false);
    setShowTranscript(false);
    setShowTraps(false);
  };

  const fullScriptAudio = active.scriptLines.map((l) => `${l.speaker}: ${l.text}`).join(' ');
  const completedCount = items.filter((x) => completedAcademyIds.includes(x.id)).length;

  const handleCheck = () => {
    if (checked) return;
    setChecked(true);

    let correctCount = 0;
    for (const ex of active.exercises) {
      const userVal = answers[ex.id] ?? '';
      const res = evaluateExerciseAnswer(ex, userVal);
      if (res.isCorrect) {
        correctCount += 1;
      } else {
        recordMistake({
          source: 'listening',
          skill: 'listening',
          cefrLevel: active.cefrTarget,
          prompt: ex.prompt,
          userAnswer: typeof userVal === 'string' ? userVal || '(blank)' : userVal.join(' '),
          expectedAnswer: res.expectedDisplay,
          explanation: ex.explanation,
          explanationVi: ex.explanationVi,
        });
      }
    }

    if (correctCount === active.exercises.length) {
      playFeedbackTone('celebrate', soundEffects);
    } else {
      playFeedbackTone(correctCount > 0 ? 'correct' : 'wrong', soundEffects);
    }

    markAcademyCompleted(active.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('ielts-lis', active.id),
      amount: 15 + correctCount * 8,
      source: 'ielts',
      referenceId: active.id,
      skill: 'listening',
      minutes: 4,
      correctDelta: correctCount,
      attemptsDelta: active.exercises.length,
    });
  };

  const band30 = convertListeningRawToBand(30, 40) ?? 7.0;
  const band35 = convertListeningRawToBand(35, 40) ?? 8.0;

  return (
    <div className="space-y-4">
      <QuestCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black">IELTS Listening Distractor Lab ({items.length} Tracks)</h2>
            <p className="text-xs font-semibold text-[#666666]">
              Official 40-mark reference benchmarks (unofficial guide): 30/40 ≈ Band {band30.toFixed(1)}, 35/40 ≈ Band {band35.toFixed(1)}.
            </p>
          </div>
          <PillBadge tone="blue">{completedCount}/{items.length} Completed</PillBadge>
        </div>

        <div className="flex flex-wrap gap-2">
          {LISTENING_PARTS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPartFilter(p.key)}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                partFilter === p.key
                  ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by topic or keyword..."
            aria-label="Search IELTS Listening items"
            className="w-full sm:w-72 rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-bold"
          />
          <select
            aria-label="Choose IELTS Listening Track"
            value={active.id}
            onChange={(e) => selectItem(e.target.value)}
            className="flex-1 min-w-[200px] rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-bold"
          >
            {filtered.map((item) => (
              <option key={item.id} value={item.id}>
                {completedAcademyIds.includes(item.id) ? '✓ ' : ''}
                {item.part.replace('_', ' ').toUpperCase()} • {item.title} ({item.cefrTarget})
              </option>
            ))}
          </select>
        </div>
      </QuestCard>

      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="blue">{active.part.replace('_', ' ').toUpperCase()}</PillBadge>
              <PillBadge tone="neutral">{active.topic}</PillBadge>
              <PillBadge tone="gold">{active.wordLimitNote}</PillBadge>
            </div>
            <h3 className="mt-2 text-xl font-black">{active.title}</h3>
            <p className="text-sm font-semibold text-[#555555]">{active.contextDescription}</p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[#BCE7FD] bg-[#F2FAFF] p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <TactileButton
              variant="secondary"
              size="sm"
              onClick={() => speakText(fullScriptAudio, { accent: active.accent ?? accent, rate: playbackSpeed })}
            >
              <Volume2 className="h-4 w-4" />
              Play Full Track ({playbackSpeed}x)
            </TactileButton>
            <TactileButton variant="outline" size="sm" onClick={stopSpeaking}>
              <VolumeX className="h-4 w-4" />
              Stop
            </TactileButton>
          </div>

          <div className="flex items-center gap-1.5">
            {([0.75, 1.0, 1.25] as const).map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setPlaybackSpeed(rate)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-black ${
                  playbackSpeed === rate
                    ? 'border-[#1CB0F6] bg-[#1CB0F6] text-white'
                    : 'border-[#BCE7FD] bg-white text-[#0C5E8A]'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowTranscript((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-black text-[#4B4B4B]"
          >
            {showTranscript ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showTranscript ? 'Hide Transcript' : 'Show Audio Script'}
          </button>
          <button
            type="button"
            onClick={() => setShowTraps((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#FFE175] bg-[#FFFBEB] px-3 py-1.5 text-xs font-black text-[#8A5A00]"
          >
            <Headphones className="h-3.5 w-3.5" />
            {showTraps ? 'Hide Trap Notes' : 'Reveal Distractor Traps'}
          </button>
        </div>

        {showTranscript && (
          <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-4 space-y-2">
            {active.scriptLines.map((line, i) => (
              <p key={i} className="text-sm font-semibold text-[#3C3C3C]">
                <span className="font-black text-[#0E8BC9]">{line.speaker}: </span>
                {line.text}
              </p>
            ))}
          </div>
        )}

        {showTraps && (
          <div className="rounded-2xl border-2 border-[#FFE175] bg-[#FFFBEB] p-4 space-y-1.5">
            <p className="text-xs font-black uppercase text-[#8A5A00]">IELTS Distractor Self-Check</p>
            <ul className="list-disc pl-5 text-sm font-bold text-[#785300] space-y-1">
              {active.distractorTraps.map((trap) => (
                <li key={trap}>{trap}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          {active.exercises.map((ex) => {
            const val = answers[ex.id] ?? '';
            const evalRes = checked ? evaluateExerciseAnswer(ex, val) : null;
            return (
              <div key={ex.id} className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 space-y-3">
                <ExerciseRenderer
                  exercise={ex}
                  accent={active.accent ?? accent}
                  speechRate={playbackSpeed}
                  disabled={checked}
                  value={val}
                  onChange={(next) => setAnswers((prev) => ({ ...prev, [ex.id]: next }))}
                />
                {evalRes && (
                  <div
                    className={`rounded-xl border px-3.5 py-2.5 text-sm font-bold ${
                      evalRes.isCorrect
                        ? 'border-[#C8F0A6] bg-[#EEFFDF] text-[#357D00]'
                        : 'border-[#FFD4D4] bg-[#FFF2F2] text-[#A91D1D]'
                    }`}
                  >
                    <p>
                      {evalRes.isCorrect ? 'Correct!' : `Answer: ${evalRes.expectedDisplay}`} — {ex.explanation}
                    </p>
                    {ex.explanationVi && <p className="mt-1 text-xs opacity-85">{ex.explanationVi}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {!checked ? (
            <TactileButton variant="primary" onClick={handleCheck}>
              Check Answers & Save Progress
            </TactileButton>
          ) : (
            <TactileButton
              variant="outline"
              onClick={() => {
                setAnswers({});
                setChecked(false);
              }}
            >
              Retry Listening Check
            </TactileButton>
          )}
        </div>
      </QuestCard>
    </div>
  );
}

interface SpeakingTabProps {
  items: IELTSSpeakingActivity[];
  accent: EnglishAccent;
  soundEffects: boolean;
}

const SPEAKING_PARTS: Array<{ key: 'all' | IELTSSpeakingPart; label: string }> = [
  { key: 'all', label: 'All Parts (100)' },
  { key: 'part_1', label: 'Part 1 • Interview (40)' },
  { key: 'part_2', label: 'Part 2 • Cue Cards (30)' },
  { key: 'part_3', label: 'Part 3 • Analysis (30)' },
];

export function IeltsSpeakingTab({ items, accent, soundEffects }: SpeakingTabProps) {
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordIeltsSession = useQuestStore((s) => s.recordIeltsSession);

  const [partFilter, setPartFilter] = useState<'all' | IELTSSpeakingPart>('all');
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const [showModels, setShowModels] = useState(false);
  const [timerMode, setTimerMode] = useState<'idle' | 'prep' | 'speak'>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [micNote, setMicNote] = useState<string | null>(null);
  const [selfBand, setSelfBand] = useState<number | null>(null);
  const [savedFlag, setSavedFlag] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const capabilities = useMemo(() => getSpeechCapabilities(), []);

  const filtered = useMemo(
    () => items.filter((item) => partFilter === 'all' || item.part === partFilter),
    [items, partFilter]
  );

  const active = useMemo(
    () => filtered.find((x) => x.id === selectedId) ?? filtered[0] ?? items[0],
    [filtered, selectedId, items]
  );

  useEffect(() => {
    if (timerMode === 'idle' || secondsLeft <= 0) return;
    const t = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setTimerMode('idle');
          playFeedbackTone('celebrate', soundEffects);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [timerMode, secondsLeft, soundEffects]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  if (!active) return null;

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    if (!capabilities.micSupported) {
      setMicNote('Microphone recording is unavailable in this browser—practice aloud with the timer or Band 6 vs Band 8 models.');
      return;
    }
    setMicNote(null);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
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
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((tr) => tr.stop());
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setMicNote('Microphone permission denied or unavailable; you can still run timed practice and self-review.');
    }
  };

  const handleSelectItem = (id: string) => {
    if (isRecording) stopRecording();
    stopSpeaking();
    setSelectedId(id);
    setTimerMode('idle');
    setSecondsLeft(0);
    setShowModels(false);
    setSelfBand(null);
    setSavedFlag(false);
    setMicNote(null);
  };

  const handleLogSpeakingPractice = () => {
    markAcademyCompleted(active.id);
    recordIeltsSession({
      pathway: 'academic',
      skill: 'speaking',
      title: `Speaking ${active.part.replace('_', ' ').toUpperCase()} • ${active.title}`,
      score: selfBand === null ? 0 : Math.round(selfBand * 2),
      maxScore: selfBand === null ? 0 : 18,
      estimatedBand: selfBand,
      isUnofficialEstimate: true,
      durationSeconds: active.part === 'part_2' ? 180 : 120,
    });
    awardActivityXp({
      idempotencyKey: createAttemptKey('ielts-spk', active.id),
      amount: 25,
      source: 'ielts',
      referenceId: active.id,
      skill: 'speaking',
      minutes: 3,
      correctDelta: 1,
      attemptsDelta: 1,
    });
    playFeedbackTone('correct', soundEffects);
    setSavedFlag(true);
  };

  const completedCount = items.filter((x) => completedAcademyIds.includes(x.id)).length;

  return (
    <div className="space-y-4">
      <QuestCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black">IELTS Speaking Parts 1–3 Studio ({items.length} Sets)</h2>
            <p className="text-xs font-semibold text-[#666666]">{UNOFFICIAL_IELTS_NOTICE}</p>
          </div>
          <PillBadge tone="purple">{completedCount}/{items.length} Practiced</PillBadge>
        </div>

        <div className="flex flex-wrap gap-2">
          {SPEAKING_PARTS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPartFilter(p.key)}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                partFilter === p.key
                  ? 'border-[#CE82FF] bg-[#F5E8FF] text-[#8E3FD6]'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <select
          aria-label="Choose IELTS Speaking Set"
          value={active.id}
          onChange={(e) => handleSelectItem(e.target.value)}
          className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-bold"
        >
          {filtered.map((item) => (
            <option key={item.id} value={item.id}>
              {completedAcademyIds.includes(item.id) ? '✓ ' : ''}
              {item.part.replace('_', ' ').toUpperCase()} • {item.title} ({item.cefrTarget})
            </option>
          ))}
        </select>
      </QuestCard>

      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <PillBadge tone="purple">{active.part.replace('_', ' ').toUpperCase()}</PillBadge>
              <PillBadge tone="neutral">{active.topic}</PillBadge>
              <PillBadge tone="green">CEFR {active.cefrTarget}</PillBadge>
            </div>
            <h3 className="mt-2 text-xl font-black">{active.title}</h3>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3 py-2">
            <Clock className="h-4 w-4 text-[#8E3FD6]" />
            <span className="text-sm font-black">
              {timerMode === 'idle'
                ? 'Timer Ready'
                : `${timerMode === 'prep' ? 'Prep' : 'Speak'}: ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`}
            </span>
          </div>
        </div>

        {active.cueCard && (
          <div className="rounded-2xl border-2 border-[#DFB9FF] bg-[#FAF4FF] p-4 space-y-2">
            <p className="text-xs font-black uppercase text-[#8E3FD6]">Official-Style 1-Min Prep / 2-Min Cue Card</p>
            <p className="font-black text-[#3C3C3C]">{active.cueCard.prompt}</p>
            <ul className="list-disc pl-5 text-sm font-bold text-[#4B4B4B] space-y-1">
              {active.cueCard.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              <TactileButton
                size="sm"
                variant="purple"
                onClick={() => {
                  setTimerMode('prep');
                  setSecondsLeft(active.cueCard?.prepSeconds ?? 60);
                }}
              >
                Start 1-Min Prep
              </TactileButton>
              <TactileButton
                size="sm"
                variant="secondary"
                onClick={() => {
                  setTimerMode('speak');
                  setSecondsLeft(active.cueCard?.speakSeconds ?? 120);
                }}
              >
                Start 2-Min Long Turn
              </TactileButton>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-black uppercase text-[#666666]">Examiner Prompt Questions</p>
          {active.questions.map((q) => (
            <div
              key={q}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2.5"
            >
              <p className="text-sm font-bold text-[#3C3C3C]">{q}</p>
              <button
                type="button"
                onClick={() => speakText(q, { accent })}
                className="text-xs font-black text-[#0E8BC9] hover:underline shrink-0"
              >
                Listen
              </button>
            </div>
          ))}
        </div>

        {/* Local Voice Recording Controls */}
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-black">Local Microphone Response Check (Optional)</p>
            {!isRecording ? (
              <TactileButton size="sm" variant="primary" onClick={startRecording}>
                <Mic className="h-4 w-4" />
                Record Answer
              </TactileButton>
            ) : (
              <TactileButton size="sm" variant="danger" onClick={stopRecording}>
                <Square className="h-4 w-4" />
                Stop Recording
              </TactileButton>
            )}
          </div>
          {micNote && <p className="text-xs font-bold text-[#8A5A00]">{micNote}</p>}
          {recordedUrl && (
            <div className="flex items-center gap-2 pt-1">
              <Play className="h-4 w-4 text-[#46A302]" />
              <audio controls src={recordedUrl} className="h-9 w-full max-w-md" />
            </div>
          )}
        </div>

        {/* Collocations */}
        <div>
          <p className="text-xs font-black uppercase text-[#666666] mb-2">Natural High-Band Collocations</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {active.vocabularyCollocations.map((col) => (
              <div key={col.phrase} className="rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] p-3">
                <p className="text-sm font-black text-[#0E8BC9]">{col.phrase}</p>
                <p className="text-xs font-semibold text-[#555555] mt-0.5">{col.meaning}</p>
                <p className="text-xs font-bold text-[#46A302] mt-1">{col.vietnamese}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Band 6 vs Band 8 Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowModels((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#DFB9FF] bg-[#FAF4FF] px-3 py-1.5 text-xs font-black text-[#8E3FD6]"
          >
            {showModels ? 'Hide Band 6 vs Band 8 Comparison' : 'Compare Band 6 vs Band 8 Sample Responses'}
          </button>

          {showModels && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-[#FFE175] bg-[#FFFBEB] p-4 space-y-1.5">
                <p className="text-xs font-black uppercase text-[#8A5A00]">Typical Band 6 Sample</p>
                <p className="text-sm font-semibold text-[#3C3C3C] leading-relaxed">{active.bandModels.band6}</p>
              </div>
              <div className="rounded-2xl border-2 border-[#C8F0A6] bg-[#EEFFDF] p-4 space-y-1.5">
                <p className="text-xs font-black uppercase text-[#357D00]">Upgraded Band 8 Model</p>
                <p className="text-sm font-semibold text-[#3C3C3C] leading-relaxed">{active.bandModels.band8}</p>
                <button
                  type="button"
                  onClick={() => speakText(active.bandModels.band8, { accent })}
                  className="text-xs font-black text-[#0E8BC9] hover:underline pt-1"
                >
                  Hear Band 8 Delivery
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFEFEF] pt-3">
          <div className="flex items-center gap-2">
            <label htmlFor="spk-self-band" className="text-xs font-black text-[#666666]">
              Optional Self-Assessment (Unassessed by default):
            </label>
            <select
              id="spk-self-band"
              value={selfBand === null ? '' : String(selfBand)}
              onChange={(e) => setSelfBand(e.target.value ? Number(e.target.value) : null)}
              className="rounded-xl border-2 border-[#E5E5E5] bg-white px-2.5 py-1.5 text-xs font-black"
            >
              <option value="">Unassessed (Log practice only)</option>
              {[4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5].map((b) => (
                <option key={b} value={b}>
                  Self-Rated Band {b.toFixed(1)}
                </option>
              ))}
            </select>
          </div>
          <TactileButton variant="purple" size="sm" onClick={handleLogSpeakingPractice}>
            <CheckCircle2 className="h-4 w-4" />
            {savedFlag ? 'Saved (+25 XP)' : 'Log Speaking Session'}
          </TactileButton>
        </div>
      </QuestCard>
    </div>
  );
}
