import { useEffect, useMemo, useState } from 'react';
import { BookOpen, BookmarkPlus, CheckCircle2, Clock, Type, Volume2, XCircle } from 'lucide-react';
import { evaluateExerciseAnswer, type CEFRLevel } from '@english-quest/shared';
import { PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { ExerciseRenderer } from '@/features/learning/ExerciseRenderer';
import { READING_LIBRARY_PASSAGES } from '@/data/readingLibraryData';
import { playFeedbackTone, speakText } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

type FontScale = 'sm' | 'base' | 'lg' | 'xl';

export function ReadingPage() {
  const preferences = useQuestStore((s) => s.preferences);
  const saveWordToVocabulary = useQuestStore((s) => s.saveWordToVocabulary);
  const recordReadingSession = useQuestStore((s) => s.recordReadingSession);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const recordMistake = useQuestStore((s) => s.recordMistake);
  const readingHistory = useQuestStore((s) => s.readingHistory);

  const [cefrFilter, setCefrFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [selectedId, setSelectedId] = useState(READING_LIBRARY_PASSAGES[0].id);
  const [fontScale, setFontScale] = useState<FontScale>('base');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [selectedGlossaryWord, setSelectedGlossaryWord] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(
    () =>
      cefrFilter === 'ALL'
        ? READING_LIBRARY_PASSAGES
        : READING_LIBRARY_PASSAGES.filter((p) => p.cefrLevel === cefrFilter),
    [cefrFilter]
  );

  const passage =
    READING_LIBRARY_PASSAGES.find((p) => p.id === selectedId) ?? filtered[0] ?? READING_LIBRARY_PASSAGES[0];

  useEffect(() => {
    const id = window.setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [passage.id]);

  const handleSelectPassage = (id: string) => {
    setSelectedId(id);
    setSecondsElapsed(0);
    setSelectedGlossaryWord(null);
    setSavedFeedback(null);
    setAnswers({});
    setSubmitted(false);
  };

  const activeGlossaryItem = passage.glossary.find(
    (g) => g.word.toLowerCase() === selectedGlossaryWord?.toLowerCase()
  );

  const handleSaveGlossaryWord = () => {
    if (!activeGlossaryItem) return;
    saveWordToVocabulary({
      word: activeGlossaryItem.word,
      partOfSpeech: activeGlossaryItem.partOfSpeech,
      ipa: activeGlossaryItem.ipa,
      definition: activeGlossaryItem.definition,
      vietnameseTranslation: activeGlossaryItem.vietnamese,
      exampleSentence: activeGlossaryItem.example,
      synonyms: [],
      antonyms: [],
      collocations: [],
      wordFamily: [],
      cefrLevel: passage.cefrLevel,
      category: 'Reading Library',
    });
    setSavedFeedback(`Saved "${activeGlossaryItem.word}" to your Vocabulary Notebook!`);
  };

  const handleSubmitQuestions = () => {
    if (submitted) return;
    let correct = 0;
    for (const q of passage.questions) {
      const res = evaluateExerciseAnswer(q, answers[q.id] ?? '');
      if (res.isCorrect) {
        correct += 1;
      } else {
        recordMistake({
          source: 'reading',
          skill: 'reading',
          cefrLevel: passage.cefrLevel,
          prompt: q.prompt,
          userAnswer: res.normalizedUserAnswer || '(no answer)',
          expectedAnswer: res.expectedDisplay,
          explanation: q.explanation,
          explanationVi: q.explanationVi,
        });
      }
    }
    setSubmitted(true);
    playFeedbackTone(correct === passage.questions.length ? 'celebrate' : 'correct', preferences.soundEffects);
    recordReadingSession({
      passageId: passage.id,
      title: passage.title,
      cefrLevel: passage.cefrLevel,
      correctCount: correct,
      totalCount: passage.questions.length,
      readingSeconds: secondsElapsed,
    });
    awardActivityXp({
      idempotencyKey: `reading-${passage.id}-${Date.now()}`,
      amount: 15 + correct * 6,
      source: 'reading',
      referenceId: passage.id,
      skill: 'reading',
      minutes: Math.max(2, Math.round(secondsElapsed / 60)),
      correctDelta: correct,
      attemptsDelta: passage.questions.length,
    });
  };

  const fontSizeClass =
    fontScale === 'sm'
      ? 'text-sm leading-relaxed'
      : fontScale === 'lg'
        ? 'text-lg leading-relaxed'
        : fontScale === 'xl'
          ? 'text-xl leading-relaxed'
          : 'text-base leading-relaxed';

  const renderInteractiveParagraph = (text: string) => {
    const glossaryTerms = passage.glossary.map((g) => g.word);
    if (glossaryTerms.length === 0) return text;

    const escaped = glossaryTerms.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      const matched = passage.glossary.find((g) => g.word.toLowerCase() === part.toLowerCase());
      if (!matched) return <span key={idx}>{part}</span>;
      return (
        <button
          key={idx}
          type="button"
          onClick={() => {
            setSelectedGlossaryWord(matched.word);
            setSavedFeedback(null);
          }}
          className="mx-0.5 inline rounded-md border-b-2 border-[#1CB0F6] bg-[#E3F6FF] px-1 font-extrabold text-[#0E8BC9] hover:bg-[#CBEFFF]"
        >
          {part}
        </button>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="green">
            <BookOpen className="h-3.5 w-3.5" />
            Reading Library
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Explore Articles, Stories & IELTS Passages</h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Tap any highlighted word for IPA, definition, Vietnamese meaning, and one-click flashcard saving.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] px-4 py-2 text-right">
          <p className="text-xs font-extrabold uppercase text-[#777777]">Passages Done</p>
          <p className="text-lg font-black text-[#46A302]">{readingHistory.length}</p>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setCefrFilter(lvl)}
              className={`rounded-xl border-2 border-b-4 px-3.5 py-1.5 text-xs font-black ${
                cefrFilter === lvl
                  ? 'border-[#46A302] bg-[#58CC02] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              {lvl === 'ALL' ? 'All Levels' : lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5">
          <Type className="h-4 w-4 text-[#777777]" />
          {(['sm', 'base', 'lg', 'xl'] as FontScale[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setFontScale(sz)}
              className={`rounded-lg px-2 py-0.5 text-xs font-black uppercase ${
                fontScale === sz ? 'bg-[#E9FCD9] text-[#46A302]' : 'text-[#777777]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Passage Picker */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelectPassage(item.id)}
            className={`rounded-2xl border-2 border-b-4 p-4 text-left transition ${
              item.id === passage.id
                ? 'border-[#58CC02] bg-[#E9FCD9]/60'
                : 'border-[#E5E5E5] bg-white hover:bg-[#F7F8FA]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#46A302]">
              <span>
                {item.cefrLevel} • {item.category.replace(/_/g, ' ')}
              </span>
              <span className="text-[#777777]">~{item.estimatedMinutes} min</span>
            </div>
            <p className="mt-1.5 font-black text-[#3C3C3C]">{item.title}</p>
          </button>
        ))}
      </div>

      {/* Reader Surface */}
      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5] pb-3">
          <div>
            <h2 className="text-xl font-black">{passage.title}</h2>
            <p className="text-xs font-bold text-[#777777]">
              {passage.cefrLevel} • Estimated {passage.estimatedMinutes} min read
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F7F8FA] px-3 py-1.5 text-xs font-black text-[#555555] border border-[#E5E5E5]">
            <Clock className="h-4 w-4 text-[#1CB0F6]" />
            {Math.floor(secondsElapsed / 60)}:{String(secondsElapsed % 60).padStart(2, '0')}
          </span>
        </div>

        <div className={`space-y-4 font-semibold text-[#3C3C3C] ${fontSizeClass}`}>
          {passage.paragraphs.map((p, idx) => (
            <p key={idx}>{renderInteractiveParagraph(p)}</p>
          ))}
        </div>

        {/* Interactive Word Popover Card */}
        {activeGlossaryItem && (
          <div className="rounded-2xl border-2 border-[#1CB0F6] bg-[#F2FAFF] p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-lg font-black text-[#0E8BC9]">{activeGlossaryItem.word}</span>{' '}
                <span className="text-xs font-bold text-[#666666]">
                  ({activeGlossaryItem.partOfSpeech}) {activeGlossaryItem.ipa}
                </span>
              </div>
              <div className="flex gap-2">
                <TactileButton
                  size="sm"
                  variant="secondary"
                  onClick={() => speakText(activeGlossaryItem.word, { accent: preferences.preferredAccent })}
                >
                  <Volume2 className="h-4 w-4" />
                  Pronounce
                </TactileButton>
                <TactileButton size="sm" onClick={handleSaveGlossaryWord}>
                  <BookmarkPlus className="h-4 w-4" />
                  Save to Notebook
                </TactileButton>
              </div>
            </div>
            <p className="text-sm font-bold text-[#3C3C3C]">{activeGlossaryItem.definition}</p>
            <p className="text-xs font-extrabold text-[#46A302]">
              Vietnamese: {activeGlossaryItem.vietnamese}
            </p>
            <p className="text-xs italic font-semibold text-[#555555]">
              &ldquo;{activeGlossaryItem.example}&rdquo;
            </p>
            {savedFeedback && (
              <p className="text-xs font-black text-[#46A302]">{savedFeedback}</p>
            )}
          </div>
        )}
      </QuestCard>

      {/* Comprehension Questions */}
      <div className="space-y-4">
        {passage.questions.map((q, idx) => {
          const result = submitted ? evaluateExerciseAnswer(q, answers[q.id] ?? '') : null;
          return (
            <QuestCard key={q.id}>
              <p className="mb-2 text-xs font-black uppercase text-[#777777]">
                Question {idx + 1} • {q.questionStyle.replace(/_/g, ' ')}
              </p>
              <ExerciseRenderer
                exercise={q}
                accent={preferences.preferredAccent}
                speechRate={preferences.speechRate}
                disabled={submitted}
                value={answers[q.id] ?? ''}
                onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
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
                    <p className="mt-0.5 font-semibold">{q.explanation}</p>
                  </div>
                </div>
              )}
            </QuestCard>
          );
        })}

        {!submitted && (
          <div className="flex justify-end">
            <TactileButton size="lg" onClick={handleSubmitQuestions}>
              Submit Reading Answers
            </TactileButton>
          </div>
        )}
      </div>
    </div>
  );
}
