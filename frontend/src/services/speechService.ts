import type { EnglishAccent } from '@english-quest/shared';

export interface SpeechCapabilities {
  ttsSupported: boolean;
  micSupported: boolean;
  sttSupported: boolean;
}

export function getSpeechCapabilities(): SpeechCapabilities {
  if (typeof window === 'undefined') {
    return { ttsSupported: false, micSupported: false, sttSupported: false };
  }
  const win = window as unknown as Record<string, unknown>;
  return {
    ttsSupported: 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined',
    micSupported:
      typeof navigator !== 'undefined' &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      typeof MediaRecorder !== 'undefined',
    sttSupported: Boolean(win.SpeechRecognition || win.webkitSpeechRecognition),
  };
}

export interface SpeakOptions {
  accent?: EnglishAccent;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (reason: string) => void;
}

export function pickVoiceForAccent(
  voices: SpeechSynthesisVoice[],
  accent: EnglishAccent
): SpeechSynthesisVoice | undefined {
  const exact = voices.find((v) => v.lang.toLowerCase() === accent.toLowerCase());
  if (exact) return exact;
  const prefix = accent.split('-')[0]?.toLowerCase() ?? 'en';
  return voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(text: string, options: SpeakOptions = {}): boolean {
  const { accent = 'en-US', rate = 1, onStart, onEnd, onError } = options;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.('Browser speech synthesis is unavailable on this device.');
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent;
    utterance.rate = Math.min(2.0, Math.max(0.5, rate));
    const voices = window.speechSynthesis.getVoices();
    const voice = pickVoiceForAccent(voices, accent);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onError?.('Could not play audio output on this device.');
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    onError?.('Audio playback failed in this browser environment.');
    return false;
  }
}

export function playFeedbackTone(
  kind: 'correct' | 'wrong' | 'celebrate' | 'chest',
  enabled: boolean
): void {
  if (!enabled || typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const scheduleNote = (freq: number, startOffset: number, duration: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + startOffset);
      gain.gain.setValueAtTime(0.08, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration);
    };

    if (kind === 'correct') {
      scheduleNote(523.25, 0, 0.14);
      scheduleNote(659.25, 0.08, 0.18);
    } else if (kind === 'wrong') {
      scheduleNote(260, 0, 0.14, 'triangle');
      scheduleNote(210, 0.1, 0.18, 'triangle');
    } else if (kind === 'chest') {
      scheduleNote(523.25, 0, 0.12);
      scheduleNote(659.25, 0.08, 0.12);
      scheduleNote(783.99, 0.16, 0.25);
    } else {
      scheduleNote(523.25, 0, 0.12);
      scheduleNote(659.25, 0.09, 0.12);
      scheduleNote(783.99, 0.18, 0.14);
      scheduleNote(1046.5, 0.28, 0.28);
    }

    setTimeout(() => {
      void ctx.close().catch(() => undefined);
    }, 800);
  } catch {
    // Ignore audio context errors when autoplay policies block sound
  }
}

export function pickDialogueVoice(
  voices: SpeechSynthesisVoice[],
  accent: EnglishAccent,
  speakerIndex: number
): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;
  const exact = voices.filter((v) => v.lang.toLowerCase() === accent.toLowerCase());
  const prefix = voices.filter((v) => v.lang.toLowerCase().startsWith(accent.toLowerCase().slice(0, 2)));
  const pool = exact.length > 0 ? exact : prefix.length > 0 ? prefix : voices;
  return pool[Math.abs(speakerIndex) % pool.length];
}

export function speakDialogueLine(
  text: string,
  options: {
    accent: EnglishAccent;
    rate?: number;
    speakerIndex?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (reason: string) => void;
  }
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onError?.('Speech synthesis is unavailable in this browser.');
    return false;
  }
  const speakerIdx = options.speakerIndex ?? 0;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.accent;
    utterance.rate = Math.min(2.0, Math.max(0.5, options.rate ?? 1.0));
    utterance.pitch = speakerIdx % 2 === 0 ? 1.0 : 1.08;
    const voice = pickDialogueVoice(window.speechSynthesis.getVoices(), options.accent, speakerIdx);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => options.onEnd?.();
    utterance.onerror = () => options.onError?.('Could not play audio output on this device.');
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    options.onError?.('Audio synthesis failed to start.');
    return false;
  }
}
