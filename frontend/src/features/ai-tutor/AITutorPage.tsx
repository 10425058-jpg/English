import { useMemo, useState } from 'react';
import { Globe2, Mic, Send, Sparkles, Volume2 } from 'lucide-react';
import type { AITutorMode } from '@english-quest/shared';
import { PipMascot } from '@/components/mascot/PipMascot';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { defaultTutorProvider } from '@/services/aiTutorEngine';
import { getSpeechCapabilities, speakText } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

const TUTOR_MODES: Array<{ id: AITutorMode; label: string; samplePrompt: string }> = [
  { id: 'free_conversation', label: 'Free Conversation', samplePrompt: 'Hi Pip! Today I studied English for twenty minutes before breakfast.' },
  { id: 'grammar_teacher', label: 'Grammar Teacher', samplePrompt: 'Yesterday I go to the library and I am agree with my teacher.' },
  { id: 'vocabulary_coach', label: 'Vocabulary Coach', samplePrompt: 'How can I sound more natural than saying "very good" in essays?' },
  { id: 'pronunciation_coach', label: 'Pronunciation Coach', samplePrompt: 'How should I practice word stress and -ed endings?' },
  { id: 'writing_assistant', label: 'Writing Assistant', samplePrompt: 'How can I organize a short opinion paragraph clearly?' },
  { id: 'ielts_examiner', label: 'IELTS Examiner', samplePrompt: 'Can we practice an IELTS Speaking Part 1 question about daily habits?' },
  { id: 'debate_partner', label: 'English Debate Partner', samplePrompt: 'I believe remote learning gives students more flexibility than traditional lectures.' },
  { id: 'think_in_english', label: 'Think in English', samplePrompt: 'Give me a quick think-in-English challenge right now!' },
  { id: 'explain_mistakes', label: 'Explain My Mistakes', samplePrompt: 'Please check my recent Mistake Notebook errors and explain how to fix them.' },
];

export function AITutorPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const recommendedCefr = useQuestStore((s) => s.recommendedCefr);
  const mistakes = useQuestStore((s) => s.mistakes);
  const aiMessages = useQuestStore((s) => s.aiMessages);
  const upsertAiMessage = useQuestStore((s) => s.upsertAiMessage);

  const [mode, setMode] = useState<AITutorMode>('free_conversation');
  const [bilingual, setBilingual] = useState(preferences.bilingualExplanations);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const capabilities = useMemo(() => getSpeechCapabilities(), []);
  const conversationId = `conv-${mode}`;
  const messages = aiMessages[conversationId] ?? [];
  const activeModeMeta = TUTOR_MODES.find((m) => m.id === mode) ?? TUTOR_MODES[0];

  const handleSend = async (overrideText?: string) => {
    const content = (overrideText ?? input).trim();
    if (!content || isThinking) return;

    const convMeta = {
      id: conversationId,
      mode,
      title: activeModeMeta.label,
      bilingual,
    };

    upsertAiMessage(convMeta, {
      conversationId,
      role: 'user',
      content,
      providerMode: 'local_rule_based',
    });

    if (!overrideText) setInput('');
    setIsThinking(true);

    try {
      const reply = await defaultTutorProvider.reply({
        mode,
        bilingual,
        learnerLevel: recommendedCefr,
        userMessage: content,
        recentMistakes: mistakes,
      });

      upsertAiMessage(convMeta, {
        conversationId,
        role: 'tutor',
        content: reply.content,
        structured: reply.structured,
        providerMode: reply.providerMode,
      });

      if (autoSpeak && capabilities.ttsSupported) {
        speakText(reply.content, { accent: preferences.preferredAccent, rate: preferences.speechRate });
      }
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoicePrompt = () => {
    const win = window as unknown as {
      SpeechRecognition?: new () => { lang: string; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; start: () => void };
      webkitSpeechRecognition?: new () => { lang: string; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; start: () => void };
    };
    const Rec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Rec) return;
    const rec = new Rec();
    rec.lang = preferences.preferredAccent;
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? '';
      if (text) setInput(text);
    };
    rec.start();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <PipMascot mood={isThinking ? 'thinking' : 'speaking'} size={64} />
          <div>
            <PillBadge tone="green">
              <Sparkles className="h-3.5 w-3.5" />
              AI Tutor • Pip
            </PillBadge>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">Interactive Coaching With Pip</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBilingual((b) => !b)}
            className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              bilingual
                ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                : 'border-[#E5E5E5] bg-white text-[#555555]'
            }`}
          >
            <Globe2 className="h-4 w-4" />
            {bilingual ? 'EN + VI Bilingual' : 'English-Only'}
          </button>
          <button
            type="button"
            onClick={() => setAutoSpeak((a) => !a)}
            className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
              autoSpeak
                ? 'border-[#58CC02] bg-[#E9FCD9] text-[#46A302]'
                : 'border-[#E5E5E5] bg-white text-[#555555]'
            }`}
          >
            <Volume2 className="h-4 w-4" />
            {autoSpeak ? 'Spoken Replies On' : 'Spoken Replies Off'}
          </button>
        </div>
      </div>

      <HonestNotice
        title="Phase 1 Offline Smart Coach Active (Zero API Key Needed)"
        description="Pip runs locally with validated structured coaching schemas, deterministic grammar repair, and live Mistake Notebook analysis. Server-side OpenAI-compatible LLM streaming activates in Phase 3 without exposing API keys."
      />

      {/* 9 Tutor Mode Pills */}
      <div className="flex flex-wrap gap-2">
        {TUTOR_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`rounded-2xl border-2 border-b-4 px-3.5 py-2 text-xs font-black transition ${
              mode === m.id
                ? 'border-[#46A302] bg-[#58CC02] text-white'
                : 'border-[#E5E5E5] bg-white text-[#3C3C3C] hover:bg-[#F7F8FA]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5] pb-3">
          <div>
            <h2 className="font-black text-lg">{activeModeMeta.label}</h2>
            <p className="text-xs font-bold text-[#777777]">
              Adapted for {recommendedCefr} • Provider: {defaultTutorProvider.id}
            </p>
          </div>
          <TactileButton
            size="sm"
            variant="outline"
            onClick={() => void handleSend(activeModeMeta.samplePrompt)}
          >
            Try Sample Prompt
          </TactileButton>
        </div>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="rounded-2xl bg-[#F7F8FA] p-5 text-center">
              <p className="text-sm font-black text-[#3C3C3C]">
                Start chatting in {activeModeMeta.label}!
              </p>
              <p className="mt-1 text-xs font-semibold text-[#666666]">
                Write an English sentence below or click &ldquo;Try Sample Prompt&rdquo;.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl border-2 p-3.5 text-sm ${
                    msg.role === 'user'
                      ? 'border-[#1CB0F6] bg-[#DDF4FF] font-bold text-[#0C5E8A]'
                      : 'border-[#E5E5E5] bg-[#F7F8FA] font-semibold text-[#3C3C3C]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase opacity-75">
                      {msg.role === 'user' ? 'You' : 'Pip Coach'}
                    </span>
                    {msg.role === 'tutor' && (
                      <button
                        type="button"
                        aria-label="Listen to tutor reply"
                        onClick={() =>
                          speakText(msg.content, { accent: preferences.preferredAccent })
                        }
                        className="text-[#0E8BC9] hover:opacity-80"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1">{msg.content}</p>

                  {msg.structured && (
                    <div className="mt-3 space-y-2 border-t border-[#E5E5E5] pt-2.5 text-xs">
                      {msg.structured.correctedText && (
                        <p className="rounded-lg bg-[#E9FCD9] px-2.5 py-1.5 font-extrabold text-[#2B6400]">
                          Suggested Fix: {msg.structured.correctedText}
                        </p>
                      )}
                      {msg.structured.naturalAlternative && (
                        <p className="font-bold text-[#3C3C3C]">
                          Natural phrasing: {msg.structured.naturalAlternative}
                        </p>
                      )}
                      {msg.structured.explanationVi && bilingual && (
                        <p className="font-bold text-[#0E8BC9]">
                          VI: {msg.structured.explanationVi}
                        </p>
                      )}
                      {msg.structured.savedVocabularyTip && (
                        <p className="font-bold text-[#8E3FD6]">
                          {msg.structured.savedVocabularyTip}
                        </p>
                      )}
                      {msg.structured.followUpQuestion && (
                        <p className="rounded-lg bg-white px-2.5 py-1.5 font-extrabold text-[#3C3C3C] border border-[#E5E5E5]">
                          Follow-up: {msg.structured.followUpQuestion}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="flex items-center gap-2 pt-2"
        >
          {capabilities.sttSupported && (
            <TactileButton
              type="button"
              variant="outline"
              size="md"
              aria-label="Voice input"
              onClick={handleVoicePrompt}
            >
              <Mic className="h-4 w-4" />
            </TactileButton>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message in English to Pip..."
            className="min-h-[44px] flex-1 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 text-sm font-bold focus:border-[#1CB0F6] focus:bg-white"
          />
          <TactileButton type="submit" disabled={!input.trim() || isThinking}>
            <Send className="h-4 w-4" />
            Send
          </TactileButton>
        </form>
      </QuestCard>
    </div>
  );
}
