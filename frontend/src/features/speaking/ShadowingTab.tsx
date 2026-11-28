import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Mic,
  Pause,
  Play,
  Repeat,
  Square,
  Volume2,
} from 'lucide-react';
import type { CEFRLevel, EnglishAccent, ShadowingSession } from '@english-quest/shared';
import { CEFR_LEVELS, loadShadowingSessions } from '@content/index';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone, speakDialogueLine, stopSpeaking } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

const SHADOW_SPEEDS = [0.75, 0.85, 1.0, 1.15, 1.5, 2.0];

export function ShadowingTab() {
  const preferences = useQuestStore((s) => s.preferences);
  const recordSpeakingSession = useQuestStore((s) => s.recordSpeakingSession);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds ?? []);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);

  const [cefrFilter, setCefrFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [selectedId, setSelectedId] = useState('shd-m2-01');
  const [accent, setAccent] = useState<EnglishAccent>(preferences.preferredAccent);
  const [speed, setSpeed] = useState<number>(0.9);
  const [loopSegment, setLoopSegment] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegIdx, setActiveSegIdx] = useState(-1);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  // Simple shadow voice recorder
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const abortRef = useRef(false);
  const loopRef = useRef(loopSegment);

  useEffect(() => {
    loopRef.current = loopSegment;
  }, [loopSegment]);

  useEffect(() => {
    return () => {
      abortRef.current = true;
      stopSpeaking();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['shadowing-sessions'],
    queryFn: loadShadowingSessions,
    staleTime: Infinity,
  });

  const filtered = useMemo(
    () => (cefrFilter === 'ALL' ? sessions : sessions.filter((s) => s.cefrLevel === cefrFilter)),
    [cefrFilter, sessions]
  );

  const active: ShadowingSession | undefined =
    sessions.find((s) => s.id === selectedId) ?? filtered[0] ?? sessions[0];

  const handleSelectSession = (sess: ShadowingSession) => {
    abortRef.current = true;
    stopSpeaking();
    setIsPlaying(false);
    setActiveSegIdx(-1);
    setSelectedId(sess.id);
    setSpeed(sess.recommendedRate);
    setCheckedItems([]);
    setSavedMsg(null);
  };

  const playSegment = (idx: number, singleOnly: boolean) => {
    if (!active) return;
    const seg = active.segments[idx];
    if (!seg) {
      setIsPlaying(false);
      setActiveSegIdx(-1);
      return;
    }
    abortRef.current = false;
    setIsPlaying(true);
    setActiveSegIdx(idx);
    speakDialogueLine(seg.text, {
      accent,
      rate: speed,
      speakerIndex: idx,
      onEnd: () => {
        if (abortRef.current) return;
        if (singleOnly && loopRef.current) {
          playSegment(idx, true);
        } else if (!singleOnly && idx + 1 < active.segments.length) {
          playSegment(idx + 1, false);
        } else if (!singleOnly && loopRef.current) {
          playSegment(0, false);
        } else {
          setIsPlaying(false);
          setActiveSegIdx(-1);
        }
      },
      onError: () => {
        setIsPlaying(false);
        setActiveSegIdx(-1);
      },
    });
  };

  const togglePlayAll = () => {
    if (isPlaying) {
      abortRef.current = true;
      stopSpeaking();
      setIsPlaying(false);
      setActiveSegIdx(-1);
      return;
    }
    playSegment(0, false);
  };

  const startShadowRecord = async () => {
    setMicError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setMicError('Recording requires microphone permission and MediaRecorder support in browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const rec = new MediaRecorder(stream);
      mediaRecRef.current = rec;
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        if (recordedUrl) URL.revokeObjectURL(recordedUrl);
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      setIsRecording(true);
    } catch {
      setMicError('Microphone access denied or unavailable. Practice shadowing aloud with line audio first!');
    }
  };

  const stopShadowRecord = () => {
    if (mediaRecRef.current && mediaRecRef.current.state !== 'inactive') {
      mediaRecRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleCompleteShadowing = () => {
    if (!active) return;
    recordSpeakingSession({
      promptId: active.id,
      activityType: 'shadowing',
      cefrLevel: active.cefrLevel,
      durationSeconds: 45,
      assessmentKind: 'self_review',
      selfChecklistCompleted: checkedItems,
    });
    markAcademyCompleted(active.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('shadowing', active.id),
      amount: 18,
      source: 'speaking',
      referenceId: active.id,
      skill: 'speaking',
      minutes: 3,
      correctDelta: 1,
      attemptsDelta: 1,
    });
    playFeedbackTone('celebrate', preferences.soundEffects);
    setSavedMsg('Shadowing session completed! +18 XP added.');
  };

  if (isLoading && sessions.length === 0) {
    return <p className="text-sm font-bold text-[#8E3FD6]">Loading Shadowing Studio...</p>;
  }

  if (!active) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-3">
        <div className="flex flex-wrap gap-1.5">
          {(['ALL', ...CEFR_LEVELS] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setCefrFilter(lvl)}
              className={`rounded-xl border-2 border-b-4 px-3 py-1 text-xs font-black ${
                cefrFilter === lvl
                  ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {lvl === 'ALL' ? `All (${sessions.length})` : lvl}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['en-US', 'en-GB'] as EnglishAccent[]).map((acc) => (
            <button
              key={acc}
              type="button"
              onClick={() => setAccent(acc)}
              className={`rounded-xl border-2 px-2.5 py-1 text-xs font-black ${
                accent === acc
                  ? 'border-[#1CB0F6] bg-[#1CB0F6] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {acc === 'en-GB' ? 'UK' : 'US'}
            </button>
          ))}
          {SHADOW_SPEEDS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSpeed(r)}
              className={`rounded-xl border-2 px-2 py-1 text-xs font-black ${
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

      {/* Session Selector */}
      <div className="grid max-h-[250px] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((sess) => {
          const isSel = sess.id === active.id;
          const isDone = completedAcademyIds.includes(sess.id);
          return (
            <button
              key={sess.id}
              type="button"
              onClick={() => handleSelectSession(sess)}
              className={`rounded-2xl border-2 border-b-4 p-3 text-left transition ${
                isSel
                  ? 'border-[#CE82FF] bg-[#F5E8FF]'
                  : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-black text-[#8E3FD6]">
                <span>{sess.cefrLevel} • {sess.topic}</span>
                <span className="flex items-center gap-1">
                  {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-[#58CC02]" />}
                  {sess.durationLabel}
                </span>
              </div>
              <p className="mt-1 text-sm font-black text-[#3C3C3C]">{sess.title}</p>
            </button>
          );
        })}
      </div>

      {/* Active Shadowing Workspace */}
      <QuestCard className="space-y-4 border-[#E5D4FF] bg-[#FDF9FF]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <PillBadge tone="purple">
              {active.cefrLevel} Shadowing • Recommended {active.recommendedRate}x
            </PillBadge>
            <h2 className="mt-1.5 text-xl font-black text-[#3C3C3C]">{active.title}</h2>
            <p className="mt-1 text-xs font-semibold text-[#555555]">{active.rhythmOverview}</p>
          </div>
          <button
            type="button"
            onClick={() => setLoopSegment((p) => !p)}
            className={`inline-flex items-center gap-1 rounded-xl border-2 px-3 py-1 text-xs font-black ${
              loopSegment
                ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                : 'border-[#E5E5E5] bg-white text-[#666666]'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" />
            Loop Repeat {loopSegment ? 'ON' : 'OFF'}
          </button>
        </div>

        <p className="rounded-xl border border-[#A5ED6E] bg-[#F5FFE8] px-3.5 py-2 text-xs font-bold text-[#2B6400]">
          Vietnamese Rhythm Tip: {active.vietnameseFocusTip}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <TactileButton variant={isPlaying ? 'danger' : 'secondary'} onClick={togglePlayAll}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            {isPlaying ? 'Stop Shadow Sequence' : `Play All (${speed}x)`}
          </TactileButton>
          {!isRecording ? (
            <TactileButton variant="purple" onClick={startShadowRecord}>
              <Mic className="h-4 w-4" />
              Record Your Shadow Take
            </TactileButton>
          ) : (
            <TactileButton variant="danger" onClick={stopShadowRecord}>
              <Square className="h-4 w-4 fill-current" />
              Stop Recording
            </TactileButton>
          )}
        </div>

        {micError && <HonestNotice title="Microphone Notice" description={micError} tone="warning" />}
        {recordedUrl && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white p-3">
            <Play className="h-4 w-4 text-[#46A302]" />
            <span className="text-xs font-black">Compare Your Voice vs. Model:</span>
            <audio controls src={recordedUrl} className="h-9 flex-1 min-w-[200px]" />
          </div>
        )}

        {/* Segment-by-Segment Shadowing Script */}
        <div className="space-y-2.5">
          {active.segments.map((seg, i) => (
            <div
              key={seg.id}
              className={`rounded-2xl border-2 p-3.5 transition ${
                activeSegIdx === i
                  ? 'border-[#1CB0F6] bg-[#DDF4FF]'
                  : 'border-[#E5E5E5] bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  {seg.speaker && (
                    <span className="text-[11px] font-black uppercase text-[#0E8BC9]">
                      {seg.speaker}
                    </span>
                  )}
                  <p className="text-base font-black text-[#3C3C3C]">{seg.text}</p>
                  {seg.rhythmBeat && (
                    <p className="font-mono text-xs font-bold text-[#8E3FD6]">
                      Beat: {seg.rhythmBeat}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-[#555555]">Link cue: {seg.linkingNote}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Play segment ${i + 1}`}
                  onClick={() => playSegment(i, true)}
                  className="shrink-0 rounded-xl bg-[#E3F6FF] p-2 text-[#0E8BC9] hover:bg-[#BCE7FD]"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-3.5">
            <p className="text-xs font-black uppercase text-[#777777]">Key Spoken Expressions</p>
            <div className="mt-2 space-y-1.5 text-xs">
              {active.keyExpressions.map((exp) => (
                <div key={exp.phrase} className="rounded-xl bg-[#F7F8FA] px-3 py-1.5">
                  <span className="font-black text-[#3C3C3C]">{exp.phrase}</span> —{' '}
                  <span className="font-semibold text-[#555555]">{exp.meaning}</span>
                  {preferences.bilingualExplanations && (
                    <span className="block font-bold text-[#46A302]">VI: {exp.vietnamese}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-3.5">
            <p className="text-xs font-black uppercase text-[#777777]">Shadowing Self-Check</p>
            <div className="mt-2 space-y-1.5">
              {active.reflectionChecklist.map((item) => {
                const checked = checkedItems.includes(item);
                return (
                  <label key={item} className="flex items-start gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setCheckedItems((prev) =>
                          checked ? prev.filter((x) => x !== item) : [...prev, item]
                        )
                      }
                      className="mt-0.5 h-4 w-4 accent-[#58CC02]"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {savedMsg && (
          <div className="flex items-center gap-2 rounded-2xl border-2 border-[#A5ED6E] bg-[#D7FFB8] p-3 text-sm font-black text-[#2B6400]">
            <CheckCircle2 className="h-5 w-5" />
            <span>{savedMsg}</span>
          </div>
        )}

        <div className="flex justify-end">
          <TactileButton onClick={handleCompleteShadowing}>
            Complete Shadowing Studio Session (+18 XP)
          </TactileButton>
        </div>
      </QuestCard>
    </div>
  );
}
