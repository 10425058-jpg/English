import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bookmark,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Lightbulb,
  MessageSquare,
  Mic,
  Play,
  Repeat,
  Square,
  Volume2,
} from 'lucide-react';
import type {
  CEFRLevel,
  SpeakingActivityType,
  SpeakingLesson,
} from '@english-quest/shared';
import {
  CEFR_LEVELS,
  loadAllSpeaking,
  loadSpeakingMindsetGuides,
} from '@content/index';
import { SceneIllustration } from '@/components/mascot/SceneIllustration';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { SPEAKING_LAB_ACTIVITIES, type SpeakingActivityItem } from '@/data/speakingLabData';
import { createAttemptKey } from '@/services/idempotency';
import { getSpeechCapabilities, playFeedbackTone, speakText } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';
import { ConversationsTab } from './ConversationsTab';
import { PronunciationTab } from './PronunciationTab';
import { ShadowingTab } from './ShadowingTab';
import { ThinkInEnglishTab } from './ThinkInEnglishTab';

type StudioTab = 'speaking' | 'conversations' | 'think_english' | 'pronunciation' | 'shadowing';
type ModelLevelView = 'natural' | 'basic' | 'advanced';

function toUnifiedSpeakingItem(core: SpeakingActivityItem): SpeakingLesson {
  return {
    id: core.id,
    title: core.title,
    activityType: core.activityType,
    category: 'daily_conversation',
    cefrLevel: core.cefrLevel,
    prompt: core.prompt,
    objectives: ['Speak aloud smoothly with clear articulation and steady rhythm.'],
    preparationQuestions: ['What 2–3 key words help anchor your first sentence quickly?'],
    modelText: core.modelText,
    alternativeResponses: [],
    vocabularyBank: core.keyVocabulary.map((kw) => ({
      term: kw,
      meaning: 'Key target expression for this prompt.',
      vietnamese: kw,
    })),
    naturalExpressions: core.keyVocabulary.slice(0, 3),
    sentenceStructures: [],
    suggestedOrganization: ['1. Direct opening answer', '2. Supporting detail or reason', '3. Clean finish'],
    commonMistakes: [],
    followUpQuestions: [],
    improvementStrategies: ['Listen once, record a clean take, and compare pace and linking against the model voice.'],
    tips: core.tips,
    selfChecklist: core.selfChecklist,
    keyVocabulary: core.keyVocabulary,
    suggestedSeconds: core.suggestedSeconds,
    scene: core.scene,
    roleplayTurns: core.roleplayTurns,
  };
}

export function SpeakingAcademyPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const speakingSessions = useQuestStore((s) => s.speakingSessions);
  const recordSpeakingSession = useQuestStore((s) => s.recordSpeakingSession);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const bookmarkedContentIds = useQuestStore((s) => s.bookmarkedContentIds ?? []);
  const toggleContentBookmark = useQuestStore((s) => s.toggleContentBookmark);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds ?? []);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);

  const [activeStudio, setActiveStudio] = useState<StudioTab>('speaking');
  const [cefrFilter, setCefrFilter] = useState<'ALL' | 'BOOKMARKED' | CEFRLevel>('ALL');
  const [modeFilter, setModeFilter] = useState<'ALL' | SpeakingActivityType>('ALL');
  const [selectedId, setSelectedId] = useState(SPEAKING_LAB_ACTIVITIES[0].id);
  const [showGuides, setShowGuides] = useState(false);
  const [modelTier, setModelTier] = useState<ModelLevelView>('natural');

  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(16).fill(18));
  const [micError, setMicError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const animRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const capabilities = useMemo(() => getSpeechCapabilities(), []);

  const { data: expandedSpeaking = [], isLoading: speakingLoading } = useQuery({
    queryKey: ['speaking-academy-all'],
    queryFn: loadAllSpeaking,
    staleTime: Infinity,
  });

  const { data: mindsetGuides = [] } = useQuery({
    queryKey: ['speaking-mindset-guides'],
    queryFn: loadSpeakingMindsetGuides,
    enabled: showGuides,
    staleTime: Infinity,
  });

  const allActivities: SpeakingLesson[] = useMemo(
    () => [...SPEAKING_LAB_ACTIVITIES.map(toUnifiedSpeakingItem), ...expandedSpeaking],
    [expandedSpeaking]
  );

  const filteredActivities = useMemo(() => {
    return allActivities.filter((act) => {
      if (cefrFilter === 'BOOKMARKED' && !bookmarkedContentIds.includes(act.id)) return false;
      if (cefrFilter !== 'ALL' && cefrFilter !== 'BOOKMARKED' && act.cefrLevel !== cefrFilter) {
        return false;
      }
      if (modeFilter !== 'ALL' && act.activityType !== modeFilter) return false;
      return true;
    });
  }, [allActivities, bookmarkedContentIds, cefrFilter, modeFilter]);

  const active =
    allActivities.find((a) => a.id === selectedId) ?? filteredActivities[0] ?? allActivities[0];

  const completedSpeakingSet = useMemo(() => {
    const s = new Set<string>(completedAcademyIds);
    for (const sess of speakingSessions) s.add(sess.promptId);
    return s;
  }, [completedAcademyIds, speakingSessions]);

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
    setSelectedId(id);
    setTranscript('');
    setCheckedItems([]);
    setSavedBanner(null);
    setSecondsElapsed(0);
    setMicError(null);
    setModelTier('natural');
  };

  const startRecording = async () => {
    setMicError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setMicError(
        'Audio recording is unsupported in this browser context. You can still play the model speech, capture text, and complete self-review!'
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
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
    markAcademyCompleted(active.id);
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

  const activeModelText =
    active.modelComparisonByLevel?.[modelTier] ?? active.modelText;
  const isBookmarked = bookmarkedContentIds.includes(active.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="purple">
            <Mic className="h-3.5 w-3.5" />
            Speaking, Pronunciation & Shadowing Academy
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Speak Aloud, Shadow & Master Sounds</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            {allActivities.length} speaking lessons (A1–C2), 60 conversations, 30 think-in-English drills, 48 IPA clinics, and 60 shadowing drills.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2 text-right">
          <p className="text-xs font-extrabold uppercase text-[#777777]">Sessions</p>
          <p className="text-lg font-black text-[#8E3FD6]">{speakingSessions.length}</p>
        </div>
      </div>

      {/* Top 5-Academy Switcher */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Speaking academy modules">
        <button
          type="button"
          role="tab"
          aria-selected={activeStudio === 'speaking'}
          onClick={() => setActiveStudio('speaking')}
          className={`inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-2.5 text-sm font-black ${
            activeStudio === 'speaking'
              ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
              : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
          }`}
        >
          <Mic className="h-4 w-4" />
          Speaking Academy ({allActivities.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeStudio === 'conversations'}
          onClick={() => setActiveStudio('conversations')}
          className={`inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-2.5 text-sm font-black ${
            activeStudio === 'conversations'
              ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
              : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Conversations (60)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeStudio === 'think_english'}
          onClick={() => setActiveStudio('think_english')}
          className={`inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-2.5 text-sm font-black ${
            activeStudio === 'think_english'
              ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
              : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
          }`}
        >
          <Brain className="h-4 w-4" />
          Think in English (30)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeStudio === 'pronunciation'}
          onClick={() => setActiveStudio('pronunciation')}
          className={`inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-2.5 text-sm font-black ${
            activeStudio === 'pronunciation'
              ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
              : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
          }`}
        >
          <Volume2 className="h-4 w-4" />
          Pronunciation Academy (48)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeStudio === 'shadowing'}
          onClick={() => setActiveStudio('shadowing')}
          className={`inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-2.5 text-sm font-black ${
            activeStudio === 'shadowing'
              ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
              : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
          }`}
        >
          <Repeat className="h-4 w-4" />
          Shadowing Studio (60)
        </button>
      </div>

      {activeStudio === 'conversations' && <ConversationsTab />}
      {activeStudio === 'think_english' && <ThinkInEnglishTab />}
      {activeStudio === 'pronunciation' && <PronunciationTab />}
      {activeStudio === 'shadowing' && <ShadowingTab />}

      {activeStudio === 'speaking' && (
        <div className="space-y-5">
          <HonestNotice
            title="Transparent Speech Assessment Notice"
            description="Voice recordings stay local in your browser unless you choose future cloud sync. Browser Speech-to-Text transcripts and Speech Synthesis audio are practical local practice tools—not a scientific phoneme exam grade."
          />

          {/* Collapsible Mindset & Speaking Frameworks Drawer */}
          <QuestCard className="border-[#FFE175] bg-[#FFFDF2] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#D9A600]" />
                <div>
                  <p className="text-sm font-black text-[#3C3C3C]">
                    Speaking Mindset & Reusable Fluency Frameworks (PREP, STAR, Circumlocution)
                  </p>
                  <p className="text-xs font-semibold text-[#666666]">
                    Practical anti-translation & quick-organization tools whenever you feel stuck mid-sentence.
                  </p>
                </div>
              </div>
              <TactileButton
                variant="gold"
                size="sm"
                onClick={() => setShowGuides((s) => !s)}
              >
                <BookOpen className="h-4 w-4" />
                {showGuides ? 'Hide Strategy Guides' : 'Open Fluency Guides (6)'}
              </TactileButton>
            </div>

            {showGuides && (
              <div className="grid gap-3 pt-2 md:grid-cols-2">
                {mindsetGuides.map((g) => (
                  <div
                    key={g.id}
                    className="rounded-2xl border-2 border-[#FFE175] bg-white p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-black text-[#3C3C3C]">{g.title}</p>
                      <span className="rounded-lg bg-[#FFF8DB] px-2 py-0.5 text-[10px] font-black text-[#9A6E00]">
                        {g.cefrRange}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#555555]">{g.summary}</p>
                    <div className="space-y-1.5">
                      {g.steps.map((st) => (
                        <div key={st.label} className="rounded-xl bg-[#F7F8FA] p-2 text-xs">
                          <span className="font-black text-[#0E8BC9]">{st.label}: </span>
                          <span className="font-semibold text-[#3C3C3C]">{st.detail}</span>
                          <span className="mt-0.5 block italic text-[#555555]">
                            e.g. &ldquo;{st.example}&rdquo;
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </QuestCard>

          {/* Speaking Filters */}
          <QuestCard className="space-y-3 bg-[#F7F8FA]">
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', ...CEFR_LEVELS, 'BOOKMARKED'] as const).map((lvl) => (
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
                  {lvl === 'ALL' ? 'All Levels' : lvl === 'BOOKMARKED' ? 'Saved' : lvl}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-black uppercase text-[#777777] mr-1">Mode:</span>
              {(
                [
                  'ALL',
                  'repetition',
                  'roleplay',
                  'rapid_response',
                  'topic_discussion',
                  'ielts_speaking',
                  'debate_defense',
                  'academic_speaking',
                  'timed_challenge',
                  'shadowing',
                  'picture_description',
                ] as const
              ).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModeFilter(m)}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-extrabold capitalize ${
                    modeFilter === m
                      ? 'border-[#8E3FD6] bg-[#F5E8FF] text-[#8E3FD6]'
                      : 'border-[#E5E5E5] bg-white text-[#666666]'
                  }`}
                >
                  {m === 'ALL' ? `All (${allActivities.length})` : m.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </QuestCard>

          {/* Activity Selector Grid */}
          {speakingLoading && (
            <p className="text-xs font-bold text-[#8E3FD6]">Loading lazy A1–C2 Speaking packs...</p>
          )}
          <div className="grid max-h-[300px] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((act) => {
              const isSel = act.id === active.id;
              const isDone = completedSpeakingSet.has(act.id);
              const isSaved = bookmarkedContentIds.includes(act.id);
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase text-[#8E3FD6]">
                      {act.cefrLevel} • {act.activityType.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-1">
                      {isSaved && <Bookmark className="h-3.5 w-3.5 fill-[#FFC800] text-[#D9A600]" />}
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-[#58CC02]" />}
                    </div>
                  </div>
                  <p className="mt-1 text-sm font-black text-[#3C3C3C]">{act.title}</p>
                </button>
              );
            })}
          </div>

          {/* Main Studio Card */}
          <QuestCard className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <PillBadge tone="purple">{active.cefrLevel}</PillBadge>
                  <span className="text-xs font-black uppercase text-[#8E3FD6]">
                    {active.activityType.replace(/_/g, ' ')}
                  </span>
                  <PillBadge tone="gold">
                    <Clock className="h-3 w-3" />
                    Target ~{active.suggestedSeconds}s
                  </PillBadge>
                </div>
                <h2 className="mt-1.5 text-xl font-black">{active.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[#555555]">{active.prompt}</p>
                {preferences.bilingualExplanations && active.promptVi && (
                  <p className="mt-0.5 text-xs font-bold text-[#46A302]">VI: {active.promptVi}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => toggleContentBookmark(active.id)}
                className={`inline-flex items-center gap-1 rounded-xl border-2 px-3 py-1 text-xs font-black ${
                  isBookmarked
                    ? 'border-[#FFC800] bg-[#FFF8DB] text-[#9A6E00]'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-[#FFC800]' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
            </div>

            {active.scene && <SceneIllustration kind={active.scene} className="max-h-56 object-contain" />}

            {/* Pre-Speaking Prep & Structure */}
            {(active.preparationQuestions.length > 0 || active.suggestedOrganization.length > 0) && (
              <div className="grid gap-3 md:grid-cols-2">
                {active.preparationQuestions.length > 0 && (
                  <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-3.5 text-xs">
                    <p className="font-black uppercase text-[#777777]">Quick Thinking Prompts</p>
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 font-semibold text-[#3C3C3C]">
                      {active.preparationQuestions.map((pq) => (
                        <li key={pq}>{pq}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {active.suggestedOrganization.length > 0 && (
                  <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-3.5 text-xs">
                    <p className="font-black uppercase text-[#777777]">Suggested Answer Flow</p>
                    <ul className="mt-1.5 space-y-1 font-semibold text-[#3C3C3C]">
                      {active.suggestedOrganization.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {active.roleplayTurns && (
              <div className="space-y-2 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4">
                <p className="text-xs font-black uppercase text-[#777777]">Roleplay Flow</p>
                {active.roleplayTurns.map((t, idx) => (
                  <div key={idx} className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-black text-[#0E8BC9]">{t.partner}</p>
                      <button
                        type="button"
                        aria-label={`Play partner turn ${idx + 1}`}
                        onClick={() => speakText(t.partner, { accent: preferences.preferredAccent, rate: 0.95 })}
                        className="rounded-lg bg-[#E3F6FF] p-1 text-[#0E8BC9]"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs font-bold text-[#555555]">Your cue: {t.cue}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Vocabulary & Sentence Frames */}
            {(active.vocabularyBank.length > 0 || active.sentenceStructures.length > 0) && (
              <div className="grid gap-3 md:grid-cols-2">
                {active.vocabularyBank.length > 0 && (
                  <div className="rounded-2xl border-2 border-[#E5E5E5] p-3.5 text-xs space-y-1.5">
                    <p className="font-black uppercase text-[#777777]">Useful Expressions & Vocab</p>
                    {active.vocabularyBank.map((vb) => (
                      <div key={vb.term} className="rounded-xl bg-[#F7F8FA] px-2.5 py-1.5">
                        <span className="font-black text-[#3C3C3C]">{vb.term}</span> —{' '}
                        <span className="font-semibold text-[#555555]">{vb.meaning}</span>
                        {preferences.bilingualExplanations && vb.vietnamese !== vb.term && (
                          <span className="block font-bold text-[#46A302]">VI: {vb.vietnamese}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {active.sentenceStructures.length > 0 && (
                  <div className="rounded-2xl border-2 border-[#E5E5E5] p-3.5 text-xs space-y-1.5">
                    <p className="font-black uppercase text-[#777777]">Ready Sentence Frames</p>
                    {active.sentenceStructures.map((st) => (
                      <div key={st.frame} className="rounded-xl bg-[#F7F8FA] px-2.5 py-1.5">
                        <p className="font-black text-[#8E3FD6]">{st.frame}</p>
                        <p className="mt-0.5 font-semibold text-[#3C3C3C]">e.g. &ldquo;{st.example}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Multi-Level Model Sample */}
            <div className="space-y-3 rounded-2xl border-2 border-[#BCE7FD] bg-[#F2FAFF] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-black uppercase text-[#0E8BC9] mr-1">Model Answer:</span>
                  {active.modelComparisonByLevel &&
                    (['basic', 'natural', 'advanced'] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setModelTier(tier)}
                        className={`rounded-lg border px-2.5 py-0.5 text-[11px] font-black capitalize ${
                          modelTier === tier
                            ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                            : 'border-[#BCE7FD] bg-white text-[#0E8BC9]'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                </div>
                <div className="flex gap-2">
                  <TactileButton
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      speakText(activeModelText, { accent: preferences.preferredAccent, rate: 0.95 })
                    }
                  >
                    <Volume2 className="h-4 w-4" />
                    Play Model ({preferences.preferredAccent === 'en-GB' ? 'UK' : 'US'})
                  </TactileButton>
                  <TactileButton
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      speakText(activeModelText, { accent: preferences.preferredAccent, rate: 0.78 })
                    }
                  >
                    0.78x Slow
                  </TactileButton>
                </div>
              </div>
              <p className="text-base font-bold text-[#3C3C3C]">&ldquo;{activeModelText}&rdquo;</p>
              {active.alternativeResponses.length > 0 && (
                <p className="border-t border-[#BCE7FD] pt-2 text-xs font-semibold text-[#0C5E8A]">
                  Alternative angle: &ldquo;{active.alternativeResponses[0]}&rdquo;
                </p>
              )}
            </div>

            {/* Recorder + Waveform + Timer */}
            <div className="space-y-4 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  {!isRecording ? (
                    <TactileButton variant="purple" onClick={startRecording}>
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </TactileButton>
                  ) : (
                    <TactileButton variant="danger" onClick={stopRecording}>
                      <Square className="h-4 w-4 fill-current" />
                      Stop ({secondsElapsed}s / {active.suggestedSeconds}s)
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
                    <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF4B4B]" />
                    Recording live • {secondsElapsed}s
                  </span>
                )}
              </div>

              <div className="flex h-14 items-end justify-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2">
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
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white p-3">
                  <Play className="h-4 w-4 text-[#46A302]" />
                  <span className="text-xs font-black">Your Recorded Playback:</span>
                  <audio controls src={recordedUrl} className="h-9 min-w-[200px] flex-1" />
                </div>
              )}

              {micError && <HonestNotice title="Microphone Notice" description={micError} tone="warning" />}

              <div>
                <label htmlFor="spk-notes" className="mb-1 block text-xs font-black uppercase text-[#777777]">
                  Transcript / Practice Notes (Optional)
                </label>
                <textarea
                  id="spk-notes"
                  rows={2}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Speech-to-text capture or expressions you want to refine on Take 2..."
                  className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white p-3 text-sm font-bold"
                />
              </div>
            </div>

            {/* Common Mistakes to Watch For */}
            {active.commonMistakes.length > 0 && (
              <div className="rounded-2xl border-2 border-[#FFB8B8] bg-[#FFF8F8] p-4 space-y-2">
                <p className="text-xs font-black uppercase text-[#9E1C1C]">Common Slips to Fix Early</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {active.commonMistakes.map((cm) => (
                    <div key={cm.mistake} className="rounded-xl border border-[#FFD6D6] bg-white p-2.5 text-xs">
                      <p className="font-bold text-[#9E1C1C] line-through">{cm.mistake}</p>
                      <p className="mt-0.5 font-black text-[#2B6400]">Use instead: {cm.correction}</p>
                      <p className="mt-0.5 font-semibold text-[#555555]">{cm.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      <label key={item} className="flex cursor-pointer items-start gap-2 text-sm font-bold">
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
      )}
    </div>
  );
}
