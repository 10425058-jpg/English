import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Eye, PenTool, Send, Sparkles } from 'lucide-react';
import type { WritingSubmission } from '@english-quest/shared';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { WRITING_LAB_PROMPTS } from '@/data/writingPromptsData';
import { analyzeWritingLocally, countWords } from '@/services/writingAnalyzer';
import { playFeedbackTone } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

export function WritingPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const writingDrafts = useQuestStore((s) => s.writingDrafts);
  const writingSubmissions = useQuestStore((s) => s.writingSubmissions);
  const saveWritingDraft = useQuestStore((s) => s.saveWritingDraft);
  const submitWriting = useQuestStore((s) => s.submitWriting);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [selectedId, setSelectedId] = useState(WRITING_LAB_PROMPTS[0].id);
  const activePrompt =
    WRITING_LAB_PROMPTS.find((p) => p.id === selectedId) ?? WRITING_LAB_PROMPTS[0];

  const [text, setText] = useState(() => writingDrafts[activePrompt.id]?.text ?? '');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [latestFeedback, setLatestFeedback] = useState<WritingSubmission['feedback'] | null>(null);
  const [showSample, setShowSample] = useState(false);

  const handleSelectPrompt = (id: string) => {
    setSelectedId(id);
    setText(writingDrafts[id]?.text ?? '');
    setSecondsElapsed(0);
    setLatestFeedback(null);
    setShowSample(false);
  };

  useEffect(() => {
    const id = window.setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [activePrompt.id]);

  // Autosave draft gently after short typing pause
  useEffect(() => {
    const handle = window.setTimeout(() => {
      saveWritingDraft(activePrompt.id, text);
    }, 350);
    return () => window.clearTimeout(handle);
  }, [activePrompt.id, text, saveWritingDraft]);

  const wordCount = countWords(text);

  const handleSubmit = () => {
    if (!text.trim()) return;
    const feedback = analyzeWritingLocally(activePrompt, text);
    setLatestFeedback(feedback);

    submitWriting({
      promptId: activePrompt.id,
      title: activePrompt.title,
      category: activePrompt.category,
      cefrLevel: activePrompt.cefrLevel,
      originalText: text,
      wordCount,
      durationSeconds: Math.max(15, secondsElapsed),
      feedback,
    });

    awardActivityXp({
      idempotencyKey: `writing-${activePrompt.id}-${Date.now()}`,
      amount: wordCount >= activePrompt.targetWords ? 30 : 20,
      source: 'writing',
      referenceId: activePrompt.id,
      skill: 'writing',
      minutes: Math.max(2, Math.round(secondsElapsed / 60)),
      correctDelta: wordCount >= activePrompt.minWords ? 1 : 0,
      attemptsDelta: 1,
    });

    playFeedbackTone('celebrate', preferences.soundEffects);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="gold">
            <PenTool className="h-3.5 w-3.5" />
            Writing Lab
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Write, Autosave & Refine Safely</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Your original text is always preserved—never overwritten. Explore sentences, emails, essays, and IELTS tasks.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2 text-right">
          <p className="text-xs font-extrabold uppercase text-[#777777]">Submissions</p>
          <p className="text-lg font-black text-[#A67800]">{writingSubmissions.length}</p>
        </div>
      </div>

      {/* Prompt Selector */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {WRITING_LAB_PROMPTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelectPrompt(p.id)}
            className={`rounded-2xl border-2 border-b-4 p-3.5 text-left transition ${
              p.id === activePrompt.id
                ? 'border-[#FFC800] bg-[#FFFBEB]'
                : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
            }`}
          >
            <span className="text-[11px] font-black uppercase text-[#A67800]">
              {p.cefrLevel} • {p.category.replace(/_/g, ' ')}
            </span>
            <p className="mt-1 font-black text-[#3C3C3C]">{p.title}</p>
          </button>
        ))}
      </div>

      {/* Writing Prompt & Editor */}
      <QuestCard className="space-y-4">
        <div>
          <h2 className="text-xl font-black">{activePrompt.title}</h2>
          <p className="mt-2 whitespace-pre-line rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-4 text-sm font-bold text-[#3C3C3C]">
            {activePrompt.prompt}
          </p>
          <p className="mt-2 text-xs font-bold text-[#666666]">{activePrompt.instructions}</p>
        </div>

        {/* Checklist */}
        <div className="flex flex-wrap gap-2">
          {activePrompt.checklist.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#FFE175] bg-[#FFFBEB] px-3 py-1 text-xs font-bold text-[#785300]"
            >
              • {item}
            </span>
          ))}
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-black text-[#666666]">
          <div className="flex items-center gap-3">
            <span>
              Words: <strong className="text-[#3C3C3C]">{wordCount}</strong> / {activePrompt.targetWords} target
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#1CB0F6]" />
              {Math.floor(secondsElapsed / 60)}:{String(secondsElapsed % 60).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[#46A302]">
            {writingDrafts[activePrompt.id]?.updatedAt ? 'Draft autosaved locally' : 'Ready to draft'}
          </span>
        </div>

        <textarea
          aria-label="Writing editor"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start drafting your response here..."
          className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] p-4 text-base font-semibold leading-relaxed text-[#3C3C3C] focus:border-[#1CB0F6] focus:bg-white"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <TactileButton variant="outline" size="sm" onClick={() => setShowSample((s) => !s)}>
            <Eye className="h-4 w-4" />
            {showSample ? 'Hide Sample Response' : 'View Model Sample'}
          </TactileButton>
          <TactileButton disabled={!text.trim()} onClick={handleSubmit}>
            <Send className="h-4 w-4" />
            Submit for Feedback
          </TactileButton>
        </div>

        {showSample && (
          <div className="rounded-2xl border-2 border-[#B8EE8A] bg-[#F6FFF0] p-4 text-sm">
            <p className="text-xs font-black uppercase text-[#46A302]">Model Reference Example</p>
            <p className="mt-1.5 whitespace-pre-line font-semibold leading-relaxed text-[#3C3C3C]">
              {activePrompt.sampleResponse}
            </p>
          </div>
        )}
      </QuestCard>

      {/* Honest Feedback Panel */}
      {latestFeedback && (
        <QuestCard className="space-y-4 border-[#84D8FF] bg-[#F2FAFF]/60">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#0E8BC9]" />
            <h3 className="text-lg font-black">Writing Review (Original Text Preserved)</h3>
          </div>

          <HonestNotice
            title="Offline Phase 1 Local Analyzer"
            description="Feedback below uses deterministic structural and grammar-pattern checks without requiring a paid AI key. Deep LLM rubric feedback activates in Phase 3."
          />

          {latestFeedback.estimatedPracticeIndicator && (
            <div className="rounded-xl border-2 border-[#FFE175] bg-[#FFFBEB] p-3 text-sm font-black text-[#785300]">
              {latestFeedback.estimatedPracticeIndicator}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 border border-[#E5E5E5]">
              <p className="text-xs font-black uppercase text-[#46A302]">Strengths</p>
              <ul className="mt-2 space-y-1.5 text-sm font-semibold">
                {latestFeedback.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-1.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#58CC02]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-[#E5E5E5]">
              <p className="text-xs font-black uppercase text-[#0E8BC9]">Vocabulary & Next Steps</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm font-semibold">
                {latestFeedback.vocabularySuggestions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
                {latestFeedback.improvements.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {latestFeedback.grammarNotes.length > 0 && (
            <div className="rounded-2xl bg-white p-4 border border-[#E5E5E5]">
              <p className="text-xs font-black uppercase text-[#D32F2F]">Mechanics & Grammar Notes</p>
              <div className="mt-2 space-y-2">
                {latestFeedback.grammarNotes.map((note, idx) => (
                  <div key={idx} className="rounded-xl bg-[#FFF4F4] p-3 text-sm">
                    <p className="font-black text-[#D32F2F]">
                      Check &ldquo;{note.excerpt}&rdquo; → {note.suggestion}
                    </p>
                    <p className="mt-0.5 font-semibold text-[#555555]">{note.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </QuestCard>
      )}

      {/* Recent Submission History */}
      {writingSubmissions.length > 0 && (
        <QuestCard>
          <h3 className="text-base font-black">Recent Writing History</h3>
          <div className="mt-3 space-y-2">
            {writingSubmissions.slice(0, 5).map((sub) => (
              <div
                key={sub.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2.5 text-sm"
              >
                <div>
                  <p className="font-black">{sub.title}</p>
                  <p className="text-xs font-semibold text-[#666666] line-clamp-1">
                    {sub.originalText}
                  </p>
                </div>
                <span className="text-xs font-black text-[#46A302]">
                  {sub.wordCount} words • {new Date(sub.submittedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </QuestCard>
      )}
    </div>
  );
}
