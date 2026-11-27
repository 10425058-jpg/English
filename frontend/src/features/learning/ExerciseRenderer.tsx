import { useMemo, useState } from 'react';
import { HelpCircle, Mic, MicOff, Volume2 } from 'lucide-react';
import type { EnglishAccent, Exercise } from '@english-quest/shared';
import { TactileButton } from '@/components/ui/TactileButton';
import { getSpeechCapabilities, speakText } from '@/services/speechService';

interface ExerciseRendererProps {
  exercise: Exercise;
  accent: EnglishAccent;
  speechRate: number;
  disabled: boolean;
  value: string | string[];
  onChange: (next: string | string[]) => void;
}

export function ExerciseRenderer({
  exercise,
  accent,
  speechRate,
  disabled,
  value,
  onChange,
}: ExerciseRendererProps) {
  const [showHint, setShowHint] = useState(false);
  const [audioStatus, setAudioStatus] = useState<string | null>(null);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [isListeningMic, setIsListeningMic] = useState(false);

  const capabilities = useMemo(() => getSpeechCapabilities(), []);

  const shuffledRightPairs = useMemo(() => {
    if (!exercise.pairs) return [];
    return [...exercise.pairs].sort((a, b) => a.right.localeCompare(b.right));
  }, [exercise.pairs]);

  const handlePlayAudio = (slow = false) => {
    const spoken = exercise.audioText || exercise.prompt;
    setAudioStatus(null);
    speakText(spoken, {
      accent,
      rate: slow ? Math.max(0.7, speechRate * 0.78) : speechRate,
      onError: (msg) => setAudioStatus(msg),
    });
  };

  const handleTapWordChip = (word: string, fromSelectedIdx?: number) => {
    if (disabled) return;
    const currentTokens = Array.isArray(value) ? value : [];
    if (typeof fromSelectedIdx === 'number') {
      const next = [...currentTokens];
      next.splice(fromSelectedIdx, 1);
      onChange(next);
      return;
    }
    onChange([...currentTokens, word]);
  };

  const handlePairSelect = (side: 'left' | 'right', text: string) => {
    if (disabled || !exercise.pairs) return;
    if (side === 'left') {
      setSelectedLeft(text);
      return;
    }
    if (!selectedLeft) return;
    const next = { ...matchedPairs, [selectedLeft]: text };
    setMatchedPairs(next);
    setSelectedLeft(null);

    const summary = exercise.pairs
      .map((p) => `${p.left}=${next[p.left] ?? ''}`)
      .join('; ');
    onChange(summary);
  };

  const handleSpeechPracticeCapture = () => {
    if (disabled) return;
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
    };
    const Rec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Rec) {
      setAudioStatus('Browser speech recognition is unavailable here—type or mark self-practice below.');
      return;
    }
    try {
      const recognition = new Rec();
      recognition.lang = accent;
      recognition.interimResults = false;
      setIsListeningMic(true);
      setAudioStatus('Listening... speak the sentence clearly.');
      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript ?? '';
        if (transcript) {
          onChange(transcript);
          setAudioStatus(`Captured transcript (estimate only): "${transcript}"`);
        }
      };
      recognition.onerror = () => {
        setAudioStatus('Microphone access denied or speech capture unavailable. You can type your response below.');
        setIsListeningMic(false);
      };
      recognition.onend = () => setIsListeningMic(false);
      recognition.start();
    } catch {
      setIsListeningMic(false);
      setAudioStatus('Speech recognition could not start in this browser.');
    }
  };

  const selectedTokens = Array.isArray(value) ? value : [];
  const availableBank = (() => {
    const bank = [...(exercise.wordBank ?? [])];
    for (const used of selectedTokens) {
      const idx = bank.indexOf(used);
      if (idx !== -1) bank.splice(idx, 1);
    }
    return bank;
  })();

  const isChoiceExercise =
    (exercise.type === 'multiple_choice' ||
      exercise.type === 'error_correction' ||
      exercise.type === 'error_identification' ||
      exercise.type === 'vocabulary_recognition' ||
      exercise.type === 'collocation_selection' ||
      exercise.type === 'grammar_challenge' ||
      exercise.type === 'grammar_application' ||
      exercise.type === 'pronunciation_discrimination' ||
      exercise.type === 'dialogue_completion' ||
      exercise.type === 'scenario_conversation' ||
      exercise.type === 'reading_comprehension' ||
      exercise.type === 'audio_recognition' ||
      ((exercise.type === 'fill_blank' || exercise.type === 'vocabulary_recall' || exercise.type === 'sentence_transformation') &&
        Boolean(exercise.options?.length))) &&
    Boolean(exercise.options?.length);

  const isMultiResponse = exercise.type === 'multiple_response' && Boolean(exercise.options?.length);

  const toggleMultiOption = (option: string) => {
    if (disabled) return;
    const current = Array.isArray(value) ? value : [];
    const exists = current.includes(option);
    onChange(exists ? current.filter((o) => o !== option) : [...current, option]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-xl bg-[#F7F8FA] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#666666] border border-[#E5E5E5]">
          {exercise.type.replace(/_/g, ' ')}
        </span>
        {exercise.hint && (
          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1CB0F6] hover:underline"
          >
            <HelpCircle className="h-4 w-4" />
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
        )}
      </div>

      <div>
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#777777]">
          {exercise.instruction}
        </p>
        <h2 className="mt-1.5 text-xl font-black leading-snug text-[#3C3C3C] sm:text-2xl">
          {exercise.prompt}
        </h2>
        {exercise.promptTranslationVi && (
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            {exercise.promptTranslationVi}
          </p>
        )}
      </div>

      {showHint && exercise.hint && (
        <div className="rounded-2xl border-2 border-[#FFE175] bg-[#FFFBEB] px-4 py-2.5 text-sm font-bold text-[#785300]">
          Hint: {exercise.hint}
        </div>
      )}

      {/* Reading Passage Block */}
      {exercise.passage && (
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4 text-base leading-relaxed text-[#3C3C3C] whitespace-pre-line">
          {exercise.passage}
        </div>
      )}

      {/* Dialogue Context Bubbles */}
      {exercise.dialogueContext && (
        <div className="space-y-2 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4">
          {exercise.dialogueContext.map((turn, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-black text-[#0E8BC9] border border-[#BCE7FD]">
                {turn.speaker}
              </span>
              <p className="pt-0.5 text-sm font-bold text-[#3C3C3C]">{turn.line}</p>
            </div>
          ))}
        </div>
      )}

      {/* Audio Controls */}
      {(exercise.audioText || exercise.type === 'audio_recognition' || exercise.type === 'dictation' || exercise.type === 'speaking') && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-[#BCE7FD] bg-[#F2FAFF] p-3.5">
          <TactileButton
            variant="secondary"
            size="sm"
            onClick={() => handlePlayAudio(false)}
          >
            <Volume2 className="h-4 w-4" />
            Play Audio ({accent === 'en-GB' ? 'UK' : 'US'})
          </TactileButton>
          <TactileButton
            variant="outline"
            size="sm"
            onClick={() => handlePlayAudio(true)}
          >
            0.75x Slow
          </TactileButton>
          {!capabilities.ttsSupported && (
            <span className="text-xs font-bold text-[#0C5E8A]">
              Speech synthesis unavailable; script fallback: &ldquo;{exercise.audioText}&rdquo;
            </span>
          )}
          {audioStatus && (
            <p className="w-full text-xs font-bold text-[#0C5E8A]">{audioStatus}</p>
          )}
        </div>
      )}

      {/* Choice Options */}
      {isChoiceExercise && (
        <div className="grid grid-cols-1 gap-3">
          {exercise.options?.map((option, idx) => {
            const selected = value === option;
            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() => onChange(option)}
                className={`flex min-h-[52px] items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-base font-extrabold transition-all ${
                  selected
                    ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                    : 'border-[#E5E5E5] bg-white text-[#3C3C3C] hover:bg-[#F7F8FA]'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-black ${
                    selected
                      ? 'border-[#1CB0F6] bg-[#1CB0F6] text-white'
                      : 'border-[#E5E5E5] bg-[#F7F8FA] text-[#777777]'
                  }`}
                >
                  {idx + 1}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Multi-Select Response Options */}
      {isMultiResponse && (
        <div className="grid grid-cols-1 gap-3">
          <p className="text-xs font-black uppercase text-[#0E8BC9]">Select all correct options</p>
          {exercise.options?.map((option) => {
            const selected = Array.isArray(value) && value.includes(option);
            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() => toggleMultiOption(option)}
                className={`flex min-h-[52px] items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-base font-extrabold transition-all ${
                  selected
                    ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                    : 'border-[#E5E5E5] bg-white text-[#3C3C3C] hover:bg-[#F7F8FA]'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs font-black ${
                    selected
                      ? 'border-[#1CB0F6] bg-[#1CB0F6] text-white'
                      : 'border-[#E5E5E5] bg-[#F7F8FA] text-transparent'
                  }`}
                >
                  ✓
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Word Bank Sentence Reconstruction / Ordering */}
      {(exercise.type === 'sentence_reconstruction' || exercise.type === 'sentence_ordering') && (
        <div className="space-y-4">
          <div
            aria-label="Your assembled sentence"
            className="min-h-[64px] rounded-2xl border-2 border-dashed border-[#CCCCCC] bg-[#F7F8FA] p-3 flex flex-wrap gap-2"
          >
            {selectedTokens.length === 0 ? (
              <span className="text-sm font-bold text-[#888888]">
                Tap words below in order to build the sentence...
              </span>
            ) : (
              selectedTokens.map((tok, idx) => (
                <button
                  key={`${tok}-${idx}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleTapWordChip(tok, idx)}
                  className="rounded-xl border-2 border-[#1CB0F6] border-b-4 bg-[#DDF4FF] px-3.5 py-2 text-sm font-extrabold text-[#0E8BC9]"
                >
                  {tok}
                </button>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {availableBank.map((tok, idx) => (
              <button
                key={`${tok}-${idx}`}
                type="button"
                disabled={disabled}
                onClick={() => handleTapWordChip(tok)}
                className="rounded-xl border-2 border-[#E5E5E5] border-b-4 bg-white px-3.5 py-2 text-sm font-extrabold text-[#3C3C3C] hover:bg-[#F7F8FA]"
              >
                {tok}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Word / Definition Matching */}
      {(exercise.type === 'word_matching' || exercise.type === 'definition_matching') &&
        exercise.pairs && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2.5">
            <p className="text-xs font-black uppercase text-[#777777]">English</p>
            {exercise.pairs.map((p) => {
              const assigned = matchedPairs[p.left];
              const active = selectedLeft === p.left;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handlePairSelect('left', p.left)}
                  className={`w-full rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-sm font-extrabold transition-all ${
                    active
                      ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                      : assigned
                        ? 'border-[#58CC02] bg-[#E9FCD9] text-[#46A302]'
                        : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div>{p.left}</div>
                  {assigned && (
                    <div className="mt-1 text-xs font-bold text-[#3C3C3C]">→ {assigned}</div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="space-y-2.5">
            <p className="text-xs font-black uppercase text-[#777777]">Meaning</p>
            {shuffledRightPairs.map((p) => {
              const used = Object.values(matchedPairs).includes(p.right);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handlePairSelect('right', p.right)}
                  className={`w-full rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-sm font-extrabold transition-all ${
                    used
                      ? 'border-[#58CC02] bg-[#E9FCD9]/60 text-[#46A302]'
                      : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
                  }`}
                >
                  {p.right}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Text Input Exercises */}
      {(exercise.type === 'translation' ||
        exercise.type === 'dictation' ||
        ((exercise.type === 'fill_blank' ||
          exercise.type === 'vocabulary_recall' ||
          exercise.type === 'sentence_transformation') &&
          !exercise.options?.length) ||
        exercise.type === 'free_writing') && (
        <div>
          <label htmlFor={`input-${exercise.id}`} className="sr-only">
            Your answer
          </label>
          <textarea
            id={`input-${exercise.id}`}
            rows={exercise.type === 'free_writing' ? 4 : 2}
            disabled={disabled}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              exercise.type === 'free_writing'
                ? 'Write your English response here...'
                : 'Type your English answer...'
            }
            className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4 text-base font-bold text-[#3C3C3C] placeholder:text-[#999999] focus:border-[#1CB0F6] focus:bg-white"
          />
          {exercise.type === 'free_writing' && (
            <p className="mt-1.5 text-xs font-bold text-[#777777]">
              Minimum words: {exercise.minWords ?? 6} • Current words:{' '}
              {typeof value === 'string' && value.trim()
                ? value.trim().split(/\s+/).length
                : 0}
            </p>
          )}
        </div>
      )}

      {/* Speaking Exercise */}
      {exercise.type === 'speaking' && (
        <div className="space-y-3 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <TactileButton
              variant={isListeningMic ? 'danger' : 'purple'}
              size="sm"
              disabled={disabled}
              onClick={handleSpeechPracticeCapture}
            >
              {isListeningMic ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListeningMic
                ? 'Listening...'
                : capabilities.sttSupported
                  ? 'Speak with Microphone'
                  : 'Mic STT Unavailable'}
            </TactileButton>
            <TactileButton
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onChange(exercise.audioText || exercise.prompt)}
            >
              I Read It Aloud (Self-Check)
            </TactileButton>
          </div>
          <p className="text-xs font-bold text-[#666666]">
            Note: Browser speech transcription is an estimate only, not a clinical pronunciation score.
          </p>
          <input
            type="text"
            disabled={disabled}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Captured speech or typed repetition..."
            className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white px-3.5 py-2.5 text-sm font-bold"
          />
        </div>
      )}
    </div>
  );
}
