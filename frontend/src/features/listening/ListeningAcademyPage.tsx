import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bookmark,
  CheckCircle2,
  Eye,
  Headphones,
  MessageCircle,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  Search,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  evaluateExerciseAnswer,
  type CEFRLevel,
  type EnglishAccent,
  type ListeningCategory,
  type ListeningContent,
} from '@english-quest/shared';
import { CEFR_LEVELS, loadAllListening } from '@content/index';
import { HonestNotice, PillBadge, QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { LISTENING_LAB_TRACKS } from '@/data/listeningLabData';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { createAttemptKey } from '@/services/idempotency';
import {
  getSpeechCapabilities,
  playFeedbackTone,
  speakDialogueLine,
  stopSpeaking,
} from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export function ListeningAcademyPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const recordListeningSession = useQuestStore((s) => s.recordListeningSession);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);
  const listeningHistory = useQuestStore((s) => s.listeningHistory);
  const bookmarkedContentIds = useQuestStore((s) => s.bookmarkedContentIds ?? []);
  const toggleContentBookmark = useQuestStore((s) => s.toggleContentBookmark);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds ?? []);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);

  const [cefrFilter, setCefrFilter] = useState<'ALL' | 'BOOKMARKED' | CEFRLevel>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | ListeningCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(LISTENING_LAB_TRACKS[0].id);
  const [accentOverride, setAccentOverride] = useState<EnglishAccent>(preferences.preferredAccent);
  const [speed, setSpeed] = useState<number>(1.0);
  const [repeatLineLoop, setRepeatLineLoop] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIdx, setActiveLineIdx] = useState<number>(-1);
  const [audioMessage, setAudioMessage] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showSummaryAndDiscuss, setShowSummaryAndDiscuss] = useState(false);
  const playAbortRef = useRef(false);
  const loopRef = useRef(repeatLineLoop);

  useEffect(() => {
    loopRef.current = repeatLineLoop;
  }, [repeatLineLoop]);

  useEffect(() => {
    return () => {
      playAbortRef.current = true;
      stopSpeaking();
    };
  }, []);

  const { data: expandedTracks = [], isLoading: expandedLoading } = useQuery({
    queryKey: ['listening-academy-all'],
    queryFn: loadAllListening,
    staleTime: Infinity,
  });

  const allTracks: ListeningContent[] = useMemo(
    () => [...LISTENING_LAB_TRACKS, ...expandedTracks],
    [expandedTracks]
  );

  const categoriesAvailable = useMemo(() => {
    const set = new Set<ListeningCategory>();
    for (const item of allTracks) set.add(item.category);
    return Array.from(set);
  }, [allTracks]);

  const completedSet = useMemo(() => {
    const ids = new Set<string>(completedAcademyIds);
    for (const rec of listeningHistory) ids.add(rec.contentId);
    return ids;
  }, [completedAcademyIds, listeningHistory]);

  const filteredTracks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allTracks.filter((track) => {
      if (cefrFilter === 'BOOKMARKED' && !bookmarkedContentIds.includes(track.id)) return false;
      if (cefrFilter !== 'ALL' && cefrFilter !== 'BOOKMARKED' && track.cefrLevel !== cefrFilter) {
        return false;
      }
      if (categoryFilter !== 'ALL' && track.category !== categoryFilter) return false;
      if (
        q &&
        !track.title.toLowerCase().includes(q) &&
        !(track.subtitle ?? '').toLowerCase().includes(q) &&
        !track.category.replace(/_/g, ' ').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [allTracks, bookmarkedContentIds, categoryFilter, cefrFilter, searchQuery]);

  const activeTrack =
    allTracks.find((t) => t.id === selectedId) ?? filteredTracks[0] ?? LISTENING_LAB_TRACKS[0];

  const capabilities = useMemo(() => getSpeechCapabilities(), []);

  const speakerIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    let idx = 0;
    for (const line of activeTrack.scriptLines) {
      if (!map.has(line.speaker)) {
        map.set(line.speaker, idx);
        idx += 1;
      }
    }
    return map;
  }, [activeTrack.scriptLines]);

  const stopAudioNow = () => {
    playAbortRef.current = true;
    stopSpeaking();
    setIsPlaying(false);
    setActiveLineIdx(-1);
  };

  const handleSelectTrack = (id: string) => {
    stopAudioNow();
    setSelectedId(id);
    setAnswers({});
    setSubmitted(false);
    setShowTranscript(false);
    setShowSummaryAndDiscuss(false);
    setAudioMessage(null);
  };

  const playSingleLine = (lineIdx: number, loopThisLine = false) => {
    const line = activeTrack.scriptLines[lineIdx];
    if (!line) return;
    playAbortRef.current = false;
    setAudioMessage(null);
    setIsPlaying(true);
    setActiveLineIdx(lineIdx);

    const runLine = () => {
      if (playAbortRef.current) return;
      speakDialogueLine(line.text, {
        accent: accentOverride,
        rate: speed,
        speakerIndex: speakerIndexMap.get(line.speaker) ?? 0,
        onEnd: () => {
          if (playAbortRef.current) return;
          if (loopThisLine && loopRef.current) {
            runLine();
          } else {
            setIsPlaying(false);
            setActiveLineIdx(-1);
          }
        },
        onError: (msg) => {
          setAudioMessage(msg);
          setIsPlaying(false);
          setActiveLineIdx(-1);
        },
      });
    };

    runLine();
  };

  const handlePlayScript = () => {
    if (isPlaying) {
      stopAudioNow();
      return;
    }

    setAudioMessage(null);
    playAbortRef.current = false;
    setIsPlaying(true);

    const playLine = (idx: number) => {
      if (playAbortRef.current || idx >= activeTrack.scriptLines.length) {
        if (loopRef.current && !playAbortRef.current && activeTrack.scriptLines.length > 0) {
          playLine(0);
          return;
        }
        setIsPlaying(false);
        setActiveLineIdx(-1);
        return;
      }
      setActiveLineIdx(idx);
      const line = activeTrack.scriptLines[idx];
      speakDialogueLine(line.text, {
        accent: accentOverride,
        rate: speed,
        speakerIndex: speakerIndexMap.get(line.speaker) ?? 0,
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
    setShowSummaryAndDiscuss(true);
    markAcademyCompleted(activeTrack.id);
    playFeedbackTone(
      correct === activeTrack.exercises.length ? 'celebrate' : 'correct',
      preferences.soundEffects
    );

    recordListeningSession({
      contentId: activeTrack.id,
      title: activeTrack.title,
      cefrLevel: activeTrack.cefrLevel,
      correctCount: correct,
      totalCount: activeTrack.exercises.length,
    });

    awardActivityXp({
      idempotencyKey: createAttemptKey('listening', activeTrack.id),
      amount: 15 + correct * 5,
      source: 'listening',
      referenceId: activeTrack.id,
      skill: 'listening',
      minutes: 4,
      correctDelta: correct,
      attemptsDelta: activeTrack.exercises.length,
    });
  };

  const isBookmarked = bookmarkedContentIds.includes(activeTrack.id);
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
            Listening Academy • {allTracks.length} Lessons (A1–C2)
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            Train Your Ear Across Real Contexts
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Structured A1–C2 dialogues, announcements, podcasts, lectures, debates, connected speech, and IELTS listening drills.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2 text-right">
            <p className="text-xs font-extrabold uppercase text-[#777777]">Completed</p>
            <p className="text-lg font-black text-[#1CB0F6]">
              {Array.from(completedSet).filter((id) => id.startsWith('lis-')).length} / {allTracks.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <QuestCard className="space-y-3 bg-[#F7F8FA]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(['ALL', ...CEFR_LEVELS, 'BOOKMARKED'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setCefrFilter(lvl)}
                className={`rounded-xl border-2 border-b-4 px-3 py-1 text-xs font-black transition ${
                  cefrFilter === lvl
                    ? 'border-[#0E8BC9] bg-[#1CB0F6] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F2FAFF]'
                }`}
              >
                {lvl === 'ALL' ? 'All Levels' : lvl === 'BOOKMARKED' ? 'Saved' : lvl}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[210px] max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic, skill, or category..."
              aria-label="Search listening lessons"
              className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white py-1.5 pl-9 pr-3 text-xs font-bold text-[#3C3C3C] focus:border-[#1CB0F6]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-black uppercase text-[#777777] mr-1">Format:</span>
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-extrabold ${
              categoryFilter === 'ALL'
                ? 'border-[#0E8BC9] bg-[#DDF4FF] text-[#0E8BC9]'
                : 'border-[#E5E5E5] bg-white text-[#666666]'
            }`}
          >
            All ({allTracks.length})
          </button>
          {categoriesAvailable.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-extrabold capitalize ${
                categoryFilter === cat
                  ? 'border-[#0E8BC9] bg-[#DDF4FF] text-[#0E8BC9]'
                  : 'border-[#E5E5E5] bg-white text-[#666666]'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </QuestCard>

      {/* Track Selector Grid */}
      {expandedLoading && (
        <p className="text-xs font-bold text-[#0E8BC9]">Loading lazy CEFR A1–C2 listening packs...</p>
      )}
      <div className="grid max-h-[310px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTracks.map((track) => {
          const active = track.id === activeTrack.id;
          const done = completedSet.has(track.id);
          const saved = bookmarkedContentIds.includes(track.id);
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => handleSelectTrack(track.id)}
              className={`rounded-2xl border-2 border-b-4 p-3.5 text-left transition ${
                active
                  ? 'border-[#1CB0F6] bg-[#E3F6FF]'
                  : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg border border-[#BCE7FD] bg-white px-2 py-0.5 text-[11px] font-black text-[#0E8BC9]">
                  {track.cefrLevel} • {track.category.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#777777]">
                  {saved && <Bookmark className="h-3.5 w-3.5 fill-[#FFC800] text-[#D9A600]" />}
                  {done && <CheckCircle2 className="h-3.5 w-3.5 text-[#58CC02]" />}
                  <span>{track.durationLabel}</span>
                </div>
              </div>
              <p className="mt-2 text-sm font-black text-[#3C3C3C]">{track.title}</p>
              {track.subtitle && (
                <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-[#666666]">
                  {track.subtitle}
                </p>
              )}
            </button>
          );
        })}
        {filteredTracks.length === 0 && (
          <p className="col-span-full rounded-2xl border-2 border-dashed border-[#E5E5E5] p-6 text-center text-sm font-bold text-[#777777]">
            No listening tracks matched this filter combination. Clear filters to view all lessons.
          </p>
        )}
      </div>

      {/* Active Audio Studio Card */}
      <QuestCard className="space-y-4 border-[#BCE7FD] bg-[#F2FAFF]/75">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="blue">{activeTrack.cefrLevel}</PillBadge>
              <span className="text-xs font-black uppercase text-[#0E8BC9]">
                {activeTrack.category.replace(/_/g, ' ')}
              </span>
              {speakerIndexMap.size > 1 && (
                <PillBadge tone="purple">{speakerIndexMap.size} Dialogue Voices</PillBadge>
              )}
            </div>
            <h2 className="mt-1.5 text-xl font-black text-[#3C3C3C]">{activeTrack.title}</h2>
            <p className="text-xs font-bold text-[#666666]">
              {activeTrack.scriptLines.length} lines • Synthetic Web Speech output ({accentOverride})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toggleContentBookmark(activeTrack.id)}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
              className={`inline-flex items-center gap-1 rounded-xl border-2 px-3 py-1 text-xs font-black ${
                isBookmarked
                  ? 'border-[#FFC800] bg-[#FFF8DB] text-[#9A6E00]'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-[#FFC800]' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>

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
          </div>
        </div>

        {/* Speed & Playback Controls */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-[#DDF4FF] bg-white p-3">
          <span className="text-[11px] font-black uppercase text-[#777777] mr-1">Speed:</span>
          {SPEED_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSpeed(r)}
              className={`rounded-xl border-2 px-2.5 py-1 text-xs font-black ${
                speed === r
                  ? 'border-[#46A302] bg-[#58CC02] text-white'
                  : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#555555]'
              }`}
            >
              {r}x
            </button>
          ))}
          <button
            type="button"
            onClick={() => setRepeatLineLoop((prev) => !prev)}
            className={`ml-auto inline-flex items-center gap-1 rounded-xl border-2 px-3 py-1 text-xs font-black ${
              repeatLineLoop
                ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                : 'border-[#E5E5E5] bg-white text-[#666666]'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" />
            Loop Audio {repeatLineLoop ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Objectives & Pre-Listening Cue */}
        {(activeTrack.learningObjectives || activeTrack.preListeningPrompt) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {activeTrack.preListeningPrompt && (
              <div className="rounded-xl border border-[#BCE7FD] bg-white p-3 text-xs">
                <p className="font-black uppercase text-[#0E8BC9]">Pre-Listening Focus</p>
                <p className="mt-1 font-semibold text-[#3C3C3C]">{activeTrack.preListeningPrompt}</p>
              </div>
            )}
            {activeTrack.learningObjectives && (
              <div className="rounded-xl border border-[#BCE7FD] bg-white p-3 text-xs">
                <p className="font-black uppercase text-[#0E8BC9]">Lesson Goals</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 font-semibold text-[#3C3C3C]">
                  {activeTrack.learningObjectives.map((obj) => (
                    <li key={obj}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <TactileButton variant={isPlaying ? 'danger' : 'secondary'} onClick={handlePlayScript}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            {isPlaying ? 'Stop Audio' : 'Play Full Track'}
          </TactileButton>
          <TactileButton variant="outline" onClick={() => setShowTranscript((s) => !s)}>
            <Eye className="h-4 w-4" />
            {showTranscript ? 'Hide Transcript (Dictation Mode)' : 'Reveal Transcript'}
          </TactileButton>
          <TactileButton
            variant="outline"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Questions
          </TactileButton>
        </div>

        <QuestProgressBar
          value={progressPct}
          max={100}
          color="#1CB0F6"
          heightClass="h-2.5"
          label="Audio playback progress"
        />

        <HonestNotice
          title="Synthetic Speech Audio Notice"
          description="Dialogue lines use your browser’s built-in Web Speech Synthesis with speaker pitch shifts—helpful for ear training and variable speeds (0.5x–2.0x), though distinct from studio multi-actor recordings."
        />

        {audioMessage && (
          <HonestNotice title="Audio Playback Notice" description={audioMessage} tone="warning" />
        )}

        {!capabilities.ttsSupported && !audioMessage && (
          <HonestNotice
            title="Speech Synthesis Not Detected"
            description="This browser environment does not expose Web Speech voices. Toggle Reveal Transcript below to read dialogues and study connected speech notes."
          />
        )}

        {/* Transcript, Line-by-Line Replay, Connected Speech & Vocab Notes */}
        {(showTranscript || submitted) && (
          <div className="space-y-4 rounded-2xl border-2 border-[#E5E5E5] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-wider text-[#777777]">
                Line-by-Line Transcript (Tap Any Speaker Bubble to Replay at {speed}x)
              </p>
            </div>
            <div className="space-y-2">
              {activeTrack.scriptLines.map((line, i) => (
                <div
                  key={i}
                  className={`flex items-start justify-between gap-2.5 rounded-xl border p-2.5 text-sm transition ${
                    activeLineIdx === i
                      ? 'border-[#1CB0F6] bg-[#DDF4FF]'
                      : 'border-transparent hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      aria-label={`Play line ${i + 1}`}
                      onClick={() => playSingleLine(i, loopRef.current)}
                      className="mt-0.5 rounded-lg bg-[#E3F6FF] p-1.5 text-[#0E8BC9] hover:bg-[#BCE7FD]"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <div>
                      <span className="font-black text-[#0E8BC9]">{line.speaker}: </span>
                      <span className="font-semibold text-[#3C3C3C]">{line.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeTrack.connectedSpeechNotes && activeTrack.connectedSpeechNotes.length > 0 && (
              <div className="rounded-xl border border-[#E5D4FF] bg-[#FBF6FF] p-3 text-xs">
                <p className="flex items-center gap-1.5 font-black uppercase text-[#8E3FD6]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Connected Speech & Intonation Cues
                </p>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 font-semibold text-[#4A2D6E]">
                  {activeTrack.connectedSpeechNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-[#E5E5E5] pt-3">
              <p className="text-xs font-black uppercase text-[#777777]">Key Vocabulary Notes</p>
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

      {/* Comprehension & Dictation Exercises */}
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
                    {preferences.bilingualExplanations && ex.explanationVi && (
                      <p className="mt-0.5 text-xs font-bold opacity-85">VI: {ex.explanationVi}</p>
                    )}
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

        {(showSummaryAndDiscuss || submitted) &&
          (activeTrack.summaryText || activeTrack.discussionQuestions) && (
            <QuestCard className="border-[#A5ED6E] bg-[#F5FFE8] space-y-3">
              {activeTrack.summaryText && (
                <div>
                  <p className="text-xs font-black uppercase text-[#46A302]">Lesson Summary</p>
                  <p className="mt-1 text-sm font-bold text-[#3C3C3C]">{activeTrack.summaryText}</p>
                </div>
              )}
              {activeTrack.discussionQuestions && activeTrack.discussionQuestions.length > 0 && (
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-black uppercase text-[#46A302]">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Reflection & Follow-Up Discussion
                  </p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm font-semibold text-[#3C3C3C]">
                    {activeTrack.discussionQuestions.map((dq) => (
                      <li key={dq}>{dq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </QuestCard>
          )}
      </div>
    </div>
  );
}
