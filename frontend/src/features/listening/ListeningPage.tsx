import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Eye, Headphones, Pause, Play, RotateCcw, Volume2, XCircle } from 'lucide-react';
import { evaluateExerciseAnswer, type CEFRLevel, type EnglishAccent } from '@english-quest/shared';
import { HonestNotice, PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { LISTENING_LAB_TRACKS } from '@/data/listeningLabData';
import { getSpeechCapabilities, playFeedbackTone, speakText, stopSpeaking } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function ListeningPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const recordListeningSession = useQuestStore((s) => s.recordListeningSession);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);
  const listeningHistory = useQuestStore((s) => s.listeningHistory);

  const [cefrFilter, setCefrFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [selectedId, setSelectedId] = useState(LISTENING_LAB_TRACKS[0].id);
  const [accentOverride, setAccentOverride] = useState<EnglishAccent>(preferences.preferredAccent);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIdx, setActiveLineIdx] = useState<number>(-1);
  const [audioMessage, setAudioMessage] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const playAbortRef = useRef(false);

  const capabilities = useMemo(() => getSpeechCapabilities(), []);

  const filteredTracks = useMemo(
    () =>
      cefrFilter === 'ALL'
        ? LISTENING_LAB_TRACKS
        : LISTENING_LAB_TRACKS.filter((t) => t.cefrLevel === cefrFilter),
    [cefrFilter]
  );

  const activeTrack =
    LISTENING_LAB_TRACKS.find((t) => t.id === selectedId) ?? filteredTracks[0] ?? LISTENING_LAB_TRACKS[0];

  useEffect(() => {
    return () => {
      playAbortRef.current = true;
      stopSpeaking();
    };
  }, []);

  const handleSelectTrack = (id: string) => {
    playAbortRef.current = true;
    stopSpeaking();
    setIsPlaying(false);
    setActiveLineIdx(-1);
    setSelectedId(id);
    setAnswers({});
    setSubmitted(false);
    setShowTranscript(false);
    setAudioMessage(null);
  };

  const handlePlayScript = () => {
    if (isPlaying) {
      playAbortRef.current = true;
      stopSpeaking();
      setIsPlaying(false);
      setActiveLineIdx(-1);
      return;
    }

    if (!capabilities.ttsSupported) {
      setAudioMessage('Browser Speech Synthesis is unavailable here—open the transcript to read and solve.');
      setShowTranscript(true);
      return;
    }

    playAbortRef.current = false;
    setAudioMessage(null);
    setIsPlaying(true);

    const playLine = (idx: number) => {
      if (playAbortRef.current || idx >= activeTrack.scriptLines.length) {
        setIsPlaying(false);
        setActiveLineIdx(-1);
        return;
      }
      setActiveLineIdx(idx);
      const line = activeTrack.scriptLines[idx];
      speakText(line.text, {
        accent: accentOverride,
        rate: speed,
        onEnd: () => {
          if (!playAbortRef.current) playLine(idx + 1);
        },
        onError: (msg) => {
          setAudioMessage(msg);
          setIsPlaying(false);
          setActiveLineIdx(-1);
        },
      });
    };

    playLine(0);
  };

  const handleSubmit = () => {
    if (submitted) return;
    let correct = 0;
    for (const ex of activeTrack.exercises) {
      const res = evaluateExerciseAnswer(ex, answers[ex.id] ?? '');
      if (res.isCorrect) {
        correct += 1;
      } else {
        recordMistake({
          source: 'listening',
          skill: 'listening',
          cefrLevel: activeTrack.cefrLevel,
          prompt: ex.prompt,
          userAnswer: res.normalizedUserAnswer || '(no answer)',
          expectedAnswer: res.expectedDisplay,
          explanation: ex.explanation,
          explanationVi: ex.explanationVi,
        });
      }
    }

    setSubmitted(true);
    setShowTranscript(true);
    playFeedbackTone(correct === activeTrack.exercises.length ? 'celebrate' : 'correct', preferences.soundEffects);

    recordListeningSession({
      contentId: activeTrack.id,
      title: activeTrack.title,
      cefrLevel: activeTrack.cefrLevel,
      correctCount: correct,
      totalCount: activeTrack.exercises.length,
    });

    awardActivityXp({
      idempotencyKey: `listening-${activeTrack.id}-${Date.now()}`,
      amount: 15 + correct * 5,
      source: 'listening',
      referenceId: activeTrack.id,
      skill: 'listening',
      minutes: 3,
      correctDelta: correct,
      attemptsDelta: activeTrack.exercises.length,
    });
  };

  const progressPct =
    activeLineIdx >= 0
      ? Math.round(((activeLineIdx + 1) / activeTrack.scriptLines.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="blue">
            <Headphones className="h-3.5 w-3.5" />
            Listening Lab
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Train Your Ear Across Real Contexts</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Conversations, minimal pairs, short stories, podcasts, academic lectures, and IELTS listening drills.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2 text-right">
          <p className="text-xs font-extrabold uppercase text-[#777777]">Completed</p>
          <p className="text-lg font-black text-[#1CB0F6]">{listeningHistory.length} tracks</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setCefrFilter(lvl)}
            className={`rounded-xl border-2 border-b-4 px-3.5 py-1.5 text-xs font-black ${
              cefrFilter === lvl
                ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                : 'border-[#E5E5E5] bg-white text-[#555555]'
            }`}
          >
            {lvl === 'ALL' ? 'All Levels' : lvl}
          </button>
        ))}
      </div>

      {/* Track Selector Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTracks.map((track) => {
          const active = track.id === activeTrack.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => handleSelectTrack(track.id)}
              className={`rounded-2xl border-2 border-b-4 p-4 text-left transition ${
                active
                  ? 'border-[#1CB0F6] bg-[#E3F6FF]'
                  : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-black text-[#0E8BC9] border border-[#BCE7FD]">
                  {track.cefrLevel} • {track.category.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-bold text-[#777777]">{track.durationLabel}</span>
              </div>
              <p className="mt-2 font-black text-[#3C3C3C]">{track.title}</p>
            </button>
          );
        })}
      </div>

      {/* Active Audio Player */}
      <QuestCard className="border-[#BCE7FD] bg-[#F2FAFF]/70 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">{activeTrack.title}</h2>
            <p className="text-xs font-bold text-[#666666]">
              {activeTrack.scriptLines.length} spoken lines • Powered by Web Speech Synthesis ({accentOverride})
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['en-US', 'en-GB'] as EnglishAccent[]).map((acc) => (
              <button
                key={acc}
                type="button"
                onClick={() => setAccentOverride(acc)}
                className={`rounded-xl border-2 px-3 py-1 text-xs font-black ${
                  accentOverride === acc
                    ? 'border-[#1CB0F6] bg-[#1CB0F6] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                {acc === 'en-GB' ? 'UK Voice' : 'US Voice'}
              </button>
            ))}
            {[0.75, 1, 1.25].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSpeed(r)}
                className={`rounded-xl border-2 px-2.5 py-1 text-xs font-black ${
                  speed === r
                    ? 'border-[#46A302] bg-[#58CC02] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <TactileButton variant={isPlaying ? 'danger' : 'secondary'} onClick={handlePlayScript}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            {isPlaying ? 'Stop Audio' : 'Play Track'}
          </TactileButton>
          <TactileButton
            variant="outline"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Answers
          </TactileButton>
          {submitted && (
            <TactileButton variant="outline" onClick={() => setShowTranscript((s) => !s)}>
              <Eye className="h-4 w-4" />
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </TactileButton>
          )}
        </div>

        <QuestProgressBar
          value={progressPct}
          max={100}
          color="#1CB0F6"
          heightClass="h-2.5"
          label="Audio playback progress"
        />

        {audioMessage && (
          <HonestNotice title="Audio Playback Notice" description={audioMessage} tone="warning" />
        )}

        {!capabilities.ttsSupported && !audioMessage && (
          <HonestNotice
            title="Speech Synthesis Not Detected"
            description="Your current browser environment does not expose voices via SpeechSynthesis. You can inspect the transcript below to practice reading & dictation."
          />
        )}

        {/* Transcript & Vocabulary Notes (Revealed after submission or fallback) */}
        {(showTranscript || submitted) && (
          <div className="space-y-3 rounded-2xl border-2 border-[#E5E5E5] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-wider text-[#777777]">
              Audio Script & Key Vocabulary
            </p>
            <div className="space-y-2">
              {activeTrack.scriptLines.map((line, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 rounded-xl p-2 text-sm ${
                    activeLineIdx === i ? 'bg-[#DDF4FF]' : ''
                  }`}
                >
                  <button
                    type="button"
                    aria-label={`Play line ${i + 1}`}
                    onClick={() => speakText(line.text, { accent: accentOverride, rate: speed })}
                    className="mt-0.5 rounded-lg bg-[#F7F8FA] p-1 text-[#0E8BC9] hover:bg-[#E3F6FF]"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <div>
                    <span className="font-black text-[#0E8BC9]">{line.speaker}: </span>
                    <span className="font-semibold text-[#3C3C3C]">{line.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E5E5E5] pt-3">
              <p className="text-xs font-black uppercase text-[#777777]">Vocabulary Notes</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {activeTrack.vocabularyNotes.map((v) => (
                  <div key={v.term} className="rounded-xl bg-[#F7F8FA] px-3 py-2 text-xs">
                    <span className="font-black text-[#3C3C3C]">{v.term}</span> —{' '}
                    <span className="font-semibold text-[#555555]">{v.meaning}</span>
                    {preferences.bilingualExplanations && (
                      <span className="block font-bold text-[#46A302]">VI: {v.vietnamese}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </QuestCard>

      {/* Comprehension Questions */}
      <div className="space-y-4">
        {activeTrack.exercises.map((ex, i) => {
          const result = submitted ? evaluateExerciseAnswer(ex, answers[ex.id] ?? '') : null;
          return (
            <QuestCard key={ex.id}>
              <p className="mb-2 text-xs font-black uppercase text-[#777777]">
                Question {i + 1} of {activeTrack.exercises.length}
              </p>
              <ExerciseRenderer
                exercise={ex}
                accent={accentOverride}
                speechRate={speed}
                disabled={submitted}
                value={answers[ex.id] ?? ''}
                onChange={(val) => setAnswers((prev) => ({ ...prev, [ex.id]: val }))}
              />
              {result && (
                <div
                  className={`mt-4 flex items-start gap-2.5 rounded-2xl border-2 p-3.5 text-sm ${
                    result.isCorrect
                      ? 'border-[#A5ED6E] bg-[#D7FFB8] text-[#2B6400]'
                      : 'border-[#FFB8B8] bg-[#FFDFE0] text-[#9E1C1C]'
                  }`}
                >
                  {result.isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <div>
                    <p className="font-black">
                      {result.isCorrect ? 'Correct!' : `Expected: ${result.expectedDisplay}`}
                    </p>
                    <p className="mt-0.5 font-semibold">{ex.explanation}</p>
                  </div>
                </div>
              )}
            </QuestCard>
          );
        })}

        {!submitted && (
          <div className="flex justify-end">
            <TactileButton size="lg" onClick={handleSubmit}>
              Check Listening Answers & Unlock Transcript
            </TactileButton>
          </div>
        )}
      </div>
    </div>
  );
}
