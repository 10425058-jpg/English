import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Mic, Play, Square, Volume2 } from 'lucide-react';
import { SceneIllustration } from '@/components/mascot/SceneIllustration';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { SPEAKING_LAB_ACTIVITIES } from '@/data/speakingLabData';
import { createAttemptKey } from '@/services/idempotency';
import { getSpeechCapabilities, playFeedbackTone, speakText } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function SpeakingPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const updatePreferences = useQuestStore((s) => s.updatePreferences);
  const recordSpeakingSession = useQuestStore((s) => s.recordSpeakingSession);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const speakingSessions = useQuestStore((s) => s.speakingSessions);

  const [selectedId, setSelectedId] = useState(SPEAKING_LAB_ACTIVITIES[0].id);
  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(16).fill(18));
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const animRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const capabilities = useMemo(() => getSpeechCapabilities(), []);
  const active =
    SPEAKING_LAB_ACTIVITIES.find((a) => a.id === selectedId) ?? SPEAKING_LAB_ACTIVITIES[0];

  const cleanupRecordingHandles = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (animRef.current) window.cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    return () => {
      cleanupRecordingHandles();
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  const handleSelectActivity = (id: string) => {
    if (isRecording) stopRecording();
    setSelectedId(id);
    setMicError(null);
    setTranscript('');
    setCheckedItems([]);
    setSavedBanner(null);
    setSecondsElapsed(0);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
    }
  };

  const startRecording = async () => {
    setMicError(null);
    setSavedBanner(null);

    if (!preferences.audioConsentGranted) {
      updatePreferences({ audioConsentGranted: true });
    }

    if (!capabilities.micSupported) {
      setMicError(
        'Microphone recording (MediaRecorder API) is unavailable in this browser. You can still practice aloud with the model audio and save your self-check reflection below.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (recordedUrl) URL.revokeObjectURL(recordedUrl);
        setRecordedUrl(URL.createObjectURL(blob));
      };

      recorder.start();
      setIsRecording(true);
      setSecondsElapsed(0);

      timerRef.current = window.setInterval(() => {
        setSecondsElapsed((s) => s + 1);
      }, 1000);

      // Live Web Audio level waveform
      const AudioCtx = window.AudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 32;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const tickWave = () => {
          analyser.getByteFrequencyData(data);
          const nextBars = Array.from({ length: 16 }, (_, idx) => {
            const v = data[idx % data.length] ?? 0;
            return Math.max(12, Math.min(95, Math.round((v / 255) * 95)));
          });
          setWaveformBars(nextBars);
          animRef.current = window.requestAnimationFrame(tickWave);
        };
        animRef.current = window.requestAnimationFrame(tickWave);
      }
    } catch {
      setMicError(
        'Microphone permission was denied or no microphone device was found. Grant mic access in browser settings or practice using the model voice & self-check below.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    cleanupRecordingHandles();
    setIsRecording(false);
    setWaveformBars(Array(16).fill(18));
  };

  const handleBrowserSttCapture = () => {
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onerror: () => void;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onerror: () => void;
        start: () => void;
      };
    };
    const Rec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Rec) {
      setMicError('Live browser Speech-to-Text is unsupported in this browser; type notes if helpful.');
      return;
    }
    try {
      const rec = new Rec();
      rec.lang = preferences.preferredAccent;
      rec.onresult = (e) => {
        const text = e.results[0]?.[0]?.transcript ?? '';
        if (text) setTranscript(text);
      };
      rec.onerror = () => setMicError('Could not capture Speech-to-Text transcript.');
      rec.start();
    } catch {
      setMicError('Speech-to-Text unavailable in this context.');
    }
  };

  const handleSaveSession = () => {
    const duration = Math.max(10, secondsElapsed || active.suggestedSeconds);
    recordSpeakingSession({
      promptId: active.id,
      activityType: active.activityType,
      cefrLevel: active.cefrLevel,
      durationSeconds: duration,
      transcript: transcript.trim() || undefined,
      assessmentKind: transcript.trim() ? 'browser_stt_estimate' : 'self_review',
      selfChecklistCompleted: checkedItems,
    });
    awardActivityXp({
      idempotencyKey: createAttemptKey('speaking', active.id),
      amount: 20,
      source: 'speaking',
      referenceId: active.id,
      skill: 'speaking',
      minutes: Math.max(2, Math.round(duration / 60)),
      correctDelta: 1,
      attemptsDelta: 1,
    });
    playFeedbackTone('celebrate', preferences.soundEffects);
    setSavedBanner('Speaking session logged! +20 XP added to your Speaking skill.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="purple">
            <Mic className="h-3.5 w-3.5" />
            Speaking Lab
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Speak Aloud, Shadow & Roleplay</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Record your voice locally, compare against model pronunciation, and practice realistic scenarios.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2 text-right">
          <p className="text-xs font-extrabold uppercase text-[#777777]">Sessions</p>
          <p className="text-lg font-black text-[#8E3FD6]">{speakingSessions.length}</p>
        </div>
      </div>

      <HonestNotice
        title="Transparent Speech Assessment Notice"
        description="Voice recordings stay local in your browser unless you choose future cloud sync. Browser Speech-to-Text transcripts are rough recognition aids—not a scientific pronunciation score. Provider-backed phoneme assessment arrives in Phase 3."
      />

      {/* Activity Tabs */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {SPEAKING_LAB_ACTIVITIES.map((act) => {
          const isSel = act.id === active.id;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => handleSelectActivity(act.id)}
              className={`rounded-2xl border-2 border-b-4 p-3.5 text-left transition ${
                isSel
                  ? 'border-[#CE82FF] bg-[#F5E8FF]'
                  : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
              }`}
            >
              <span className="text-[11px] font-black uppercase text-[#8E3FD6]">
                {act.cefrLevel} • {act.activityType.replace(/_/g, ' ')}
              </span>
              <p className="mt-1 font-black text-[#3C3C3C]">{act.title}</p>
            </button>
          );
        })}
      </div>

      {/* Main Studio Card */}
      <QuestCard className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black">{active.title}</h2>
            <p className="mt-1 text-sm font-semibold text-[#555555]">{active.prompt}</p>
          </div>
          <PillBadge tone="gold">Target ~{active.suggestedSeconds}s</PillBadge>
        </div>

        {active.scene && <SceneIllustration kind={active.scene} className="max-h-56 object-contain" />}

        {active.roleplayTurns && (
          <div className="space-y-2 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4">
            <p className="text-xs font-black uppercase text-[#777777]">Roleplay Flow</p>
            {active.roleplayTurns.map((t, idx) => (
              <div key={idx} className="rounded-xl bg-white p-3 border border-[#E5E5E5]">
                <p className="text-sm font-black text-[#0E8BC9]">{t.partner}</p>
                <p className="mt-0.5 text-xs font-bold text-[#555555]">Your cue: {t.cue}</p>
              </div>
            ))}
          </div>
        )}

        {/* Model Sample */}
        <div className="rounded-2xl border-2 border-[#BCE7FD] bg-[#F2FAFF] p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black uppercase text-[#0E8BC9]">Model Example</span>
            <div className="flex gap-2">
              <TactileButton
                size="sm"
                variant="secondary"
                onClick={() => speakText(active.modelText, { accent: preferences.preferredAccent, rate: 0.95 })}
              >
                <Volume2 className="h-4 w-4" />
                Play Model ({preferences.preferredAccent === 'en-GB' ? 'UK' : 'US'})
              </TactileButton>
              <TactileButton
                size="sm"
                variant="outline"
                onClick={() => speakText(active.modelText, { accent: preferences.preferredAccent, rate: 0.78 })}
              >
                0.78x Shadow Speed
              </TactileButton>
            </div>
          </div>
          <p className="text-base font-bold text-[#3C3C3C]">&ldquo;{active.modelText}&rdquo;</p>
        </div>

        {/* Recorder + Waveform */}
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <TactileButton variant="purple" onClick={startRecording}>
                  <Mic className="h-4 w-4" />
                  Start Recording
                </TactileButton>
              ) : (
                <TactileButton variant="danger" onClick={stopRecording}>
                  <Square className="h-4 w-4 fill-current" />
                  Stop ({secondsElapsed}s)
                </TactileButton>
              )}

              {capabilities.sttSupported && (
                <TactileButton variant="outline" size="sm" onClick={handleBrowserSttCapture}>
                  Capture Rough Transcript (STT)
                </TactileButton>
              )}
            </div>

            {isRecording && (
              <span className="inline-flex items-center gap-2 text-xs font-black text-[#FF4B4B]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF4B4B] animate-ping" />
                Recording live • {secondsElapsed}s
              </span>
            )}
          </div>

          {/* Live Waveform Bars */}
          <div className="flex h-14 items-end justify-center gap-1.5 rounded-xl bg-white px-4 py-2 border border-[#E5E5E5]">
            {waveformBars.map((heightPct, i) => (
              <div
                key={i}
                className="w-2 rounded-full transition-all duration-75"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: isRecording ? '#CE82FF' : '#D4D4D4',
                }}
              />
            ))}
          </div>

          {recordedUrl && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 border border-[#E5E5E5]">
              <Play className="h-4 w-4 text-[#46A302]" />
              <span className="text-xs font-black">Your Recorded Playback:</span>
              <audio controls src={recordedUrl} className="h-9 flex-1 min-w-[200px]" />
            </div>
          )}

          {micError && (
            <HonestNotice title="Microphone Notice" description={micError} tone="warning" />
          )}

          <div>
            <label htmlFor="spk-notes" className="block text-xs font-black uppercase text-[#777777] mb-1">
              Transcript / Practice Notes (Optional)
            </label>
            <textarea
              id="spk-notes"
              rows={2}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Speech-to-text output or notes on words you want to refine..."
              className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white p-3 text-sm font-bold"
            />
          </div>
        </div>

        {/* Coaching Tips & Self-Check */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-[#E5E5E5] p-4">
            <p className="text-xs font-black uppercase text-[#777777]">Coach Tips</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm font-bold text-[#3C3C3C]">
              {active.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-[#E5E5E5] p-4">
            <p className="text-xs font-black uppercase text-[#777777]">Fluency Self-Check</p>
            <div className="mt-2 space-y-2">
              {active.selfChecklist.map((item) => {
                const checked = checkedItems.includes(item);
                return (
                  <label key={item} className="flex items-start gap-2 text-sm font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setCheckedItems((prev) =>
                          checked ? prev.filter((x) => x !== item) : [...prev, item]
                        )
                      }
                      className="mt-1 h-4 w-4 accent-[#58CC02]"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {savedBanner && (
          <div className="flex items-center gap-2 rounded-2xl border-2 border-[#A5ED6E] bg-[#D7FFB8] p-3.5 text-sm font-black text-[#2B6400]">
            <CheckCircle2 className="h-5 w-5" />
            <span>{savedBanner}</span>
          </div>
        )}

        <div className="flex justify-end">
          <TactileButton onClick={handleSaveSession}>
            Complete Speaking Practice (+20 XP)
          </TactileButton>
        </div>
      </QuestCard>
    </div>
  );
}
