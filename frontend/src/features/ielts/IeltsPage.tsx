import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Compass,
  Headphones,
  Lightbulb,
  Mic,
  PenTool,
  Play,
  ShieldCheck,
  Target,
} from 'lucide-react';
import type {
  IELTSIdeaVocabTopic,
  IELTSListeningActivity,
  IELTSMockExamManifest,
  IELTSReadingPassage,
  IELTSSpeakingActivity,
  IELTSStrategyLesson,
  IELTSWritingTask,
} from '@english-quest/shared';
import {
  convertListeningRawToBand,
  convertReadingRawToBand,
  UNOFFICIAL_IELTS_NOTICE,
} from '@english-quest/shared';
import {
  loadIeltsIdeaBanks,
  loadIeltsListening,
  loadIeltsMockManifests,
  loadIeltsReading,
  loadIeltsSpeaking,
  loadIeltsStrategies,
  loadIeltsWriting,
} from '@content/index';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import {
  computeMiniMockPercent,
  IELTS_MINI_MOCK_QUESTIONS,
  IELTS_SPEAKING_PROMPTS,
} from '@/data/ieltsData';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone, speakText } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';
import { IeltsListeningTab, IeltsSpeakingTab } from './IeltsListeningSpeakingTabs';
import { IeltsIdeaBankTab, IeltsReadingTab, IeltsWritingTab } from './IeltsReadingWritingIdeaTabs';
import { IeltsMockHubTab, IeltsStrategyTab } from './IeltsStrategyMockTabs';

type IeltsTab = 'overview' | 'listening' | 'speaking' | 'reading' | 'writing' | 'strategy' | 'mocks' | 'ideas';

export function IeltsPage() {
  const ieltsPathway = useQuestStore((s) => s.ieltsPathway);
  const setIeltsPathway = useQuestStore((s) => s.setIeltsPathway);
  const preferences = useQuestStore((s) => s.preferences);
  const updatePreferences = useQuestStore((s) => s.updatePreferences);
  const ieltsSessions = useQuestStore((s) => s.ieltsSessions);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds);
  const recordIeltsSession = useQuestStore((s) => s.recordIeltsSession);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);

  const [activeTab, setActiveTab] = useState<IeltsTab>('overview');
  const [mockAnswers, setMockAnswers] = useState<Record<string, string>>({});
  const [mockSubmitted, setMockSubmitted] = useState(false);
  const [mockSeconds, setMockSeconds] = useState(0);
  const [activeCueId, setActiveCueId] = useState(IELTS_SPEAKING_PROMPTS[0].id);

  const [listeningItems, setListeningItems] = useState<IELTSListeningActivity[] | null>(null);
  const [speakingItems, setSpeakingItems] = useState<IELTSSpeakingActivity[] | null>(null);
  const [readingItems, setReadingItems] = useState<IELTSReadingPassage[] | null>(null);
  const [writingItems, setWritingItems] = useState<IELTSWritingTask[] | null>(null);
  const [strategyItems, setStrategyItems] = useState<IELTSStrategyLesson[] | null>(null);
  const [mockManifests, setMockManifests] = useState<IELTSMockExamManifest[] | null>(null);
  const [ideaItems, setIdeaItems] = useState<IELTSIdeaVocabTopic[] | null>(null);
  const [loadingTab, setLoadingTab] = useState(false);

  useEffect(() => {
    if (mockSubmitted) return;
    const id = window.setInterval(() => setMockSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [mockSubmitted]);

  useEffect(() => {
    let active = true;
    const loadForTab = async () => {
      if (activeTab === 'overview') return;
      if (activeTab === 'listening' && listeningItems) return;
      if (activeTab === 'speaking' && speakingItems) return;
      if (activeTab === 'reading' && readingItems) return;
      if (activeTab === 'writing' && writingItems) return;
      if (activeTab === 'strategy' && strategyItems) return;
      if (activeTab === 'mocks' && mockManifests) return;
      if (activeTab === 'ideas' && ideaItems) return;

      setLoadingTab(true);
      try {
        if (activeTab === 'listening') {
          const data = await loadIeltsListening();
          if (active) setListeningItems(data);
        } else if (activeTab === 'speaking') {
          const data = await loadIeltsSpeaking();
          if (active) setSpeakingItems(data);
        } else if (activeTab === 'reading') {
          const data = await loadIeltsReading();
          if (active) setReadingItems(data);
        } else if (activeTab === 'writing') {
          const data = await loadIeltsWriting();
          if (active) setWritingItems(data);
        } else if (activeTab === 'strategy') {
          const data = await loadIeltsStrategies();
          if (active) setStrategyItems(data);
        } else if (activeTab === 'mocks') {
          const data = await loadIeltsMockManifests();
          if (active) setMockManifests(data);
        } else if (activeTab === 'ideas') {
          const data = await loadIeltsIdeaBanks();
          if (active) setIdeaItems(data);
        }
      } finally {
        if (active) setLoadingTab(false);
      }
    };
    void loadForTab();
    return () => {
      active = false;
    };
  }, [activeTab, listeningItems, speakingItems, readingItems, writingItems, strategyItems, mockManifests, ideaItems]);

  const pathwayQuestions = IELTS_MINI_MOCK_QUESTIONS.filter(
    (q) => q.pathway === 'both' || q.pathway === ieltsPathway
  );

  const handleRunMiniMock = () => {
    if (mockSubmitted) return;
    const correct = pathwayQuestions.filter(
      (q) => mockAnswers[q.id] === q.correctAnswer
    ).length;

    setMockSubmitted(true);
    recordIeltsSession({
      pathway: ieltsPathway,
      skill: 'mini_mock',
      title: `${ieltsPathway === 'academic' ? 'Academic' : 'General Training'} Quick Mini-Mock (${computeMiniMockPercent(correct, pathwayQuestions.length)}%)`,
      score: correct,
      maxScore: pathwayQuestions.length,
      estimatedBand: null,
      isUnofficialEstimate: true,
      durationSeconds: mockSeconds,
    });
    awardActivityXp({
      idempotencyKey: createAttemptKey('ielts-mock', ieltsPathway),
      amount: 25 + correct * 5,
      source: 'ielts',
      referenceId: `mini-mock-${ieltsPathway}`,
      skill: 'reading',
      minutes: Math.max(2, Math.round(mockSeconds / 60)),
      correctDelta: correct,
      attemptsDelta: pathwayQuestions.length,
    });
    playFeedbackTone('celebrate', preferences.soundEffects);
  };

  const activeCue =
    IELTS_SPEAKING_PROMPTS.find((c) => c.id === activeCueId) ?? IELTS_SPEAKING_PROMPTS[0];

  const ieltsDoneCount = completedAcademyIds.filter((id) => id.startsWith('ielts-')).length;

  const tabs: Array<{ id: IeltsTab; label: string; icon: typeof Target }> = [
    { id: 'overview', label: 'Overview & Mini-Mock', icon: Target },
    { id: 'listening', label: 'Listening (80)', icon: Headphones },
    { id: 'speaking', label: 'Speaking (100)', icon: Mic },
    { id: 'reading', label: 'Reading (60)', icon: BookOpen },
    { id: 'writing', label: 'Writing (60)', icon: PenTool },
    { id: 'strategy', label: 'Strategy (60)', icon: Compass },
    { id: 'mocks', label: 'Mock Exams (14)', icon: Play },
    { id: 'ideas', label: 'Idea & Lexis (10)', icon: Lightbulb },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PillBadge tone="purple">
            <Target className="h-3.5 w-3.5" />
            IELTS Mastery Center ({ieltsDoneCount}/384 Completed)
          </PillBadge>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            Academic & General Training Practice Hub
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#666666]">
            Original IELTS-aligned training across Listening (80), Speaking (100), Reading (60), Writing (60), Strategy (60), Mock Packs (14: 2 Full 40/40 + 12 Mini-Mocks), and Idea Packs (10).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="ielts-target-band" className="text-xs font-black uppercase text-[#777777]">
            Target Band
          </label>
          <select
            id="ielts-target-band"
            value={preferences.ieltsTargetBand}
            onChange={(e) => updatePreferences({ ieltsTargetBand: Number(e.target.value) })}
            className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm font-black"
          >
            {[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5].map((b) => (
              <option key={b} value={b}>
                {b.toFixed(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <HonestNotice
        title="Unofficial Practice Indicators Only"
        description={UNOFFICIAL_IELTS_NOTICE}
        tone="warning"
      />

      {/* Pathway Switcher + Quick Reference */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <TactileButton
            variant={ieltsPathway === 'academic' ? 'purple' : 'outline'}
            onClick={() => setIeltsPathway('academic')}
          >
            Academic Pathway
          </TactileButton>
          <TactileButton
            variant={ieltsPathway === 'general_training' ? 'purple' : 'outline'}
            onClick={() => setIeltsPathway('general_training')}
          >
            General Training Pathway
          </TactileButton>
        </div>

        <div className="text-xs font-bold text-[#555555]">
          {ieltsPathway === 'academic'
            ? `Academic Reading 30/40 ≈ Band ${(convertReadingRawToBand(30, 'academic', 40) ?? 7.0).toFixed(1)} • Task 1 Visual Data`
            : `GT Reading 30/40 ≈ Band ${(convertReadingRawToBand(30, 'general_training', 40) ?? 6.0).toFixed(1)} • Task 1 Formal/Semi/Informal Letters`}
        </div>
      </div>

      {/* Mastery Center Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[#EFEFEF] pb-3" role="tablist" aria-label="IELTS Mastery Academies">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-black transition ${
                isCurrent
                  ? 'border-[#8E3FD6] bg-[#F5E8FF] text-[#8E3FD6]'
                  : 'border-[#E5E5E5] bg-white text-[#555555] hover:bg-[#F7F8FA]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loadingTab && (
        <QuestCard className="p-8 text-center text-sm font-black text-[#666666]">
          Loading IELTS Academy module...
        </QuestCard>
      )}

      {!loadingTab && activeTab === 'listening' && listeningItems && (
        <IeltsListeningTab
          items={listeningItems}
          accent={preferences.preferredAccent}
          soundEffects={preferences.soundEffects}
        />
      )}

      {!loadingTab && activeTab === 'speaking' && speakingItems && (
        <IeltsSpeakingTab
          items={speakingItems}
          accent={preferences.preferredAccent}
          soundEffects={preferences.soundEffects}
        />
      )}

      {!loadingTab && activeTab === 'reading' && readingItems && (
        <IeltsReadingTab
          passages={readingItems}
          pathway={ieltsPathway}
          accent={preferences.preferredAccent}
          soundEffects={preferences.soundEffects}
        />
      )}

      {!loadingTab && activeTab === 'writing' && writingItems && (
        <IeltsWritingTab
          tasks={writingItems}
          pathway={ieltsPathway}
          accent={preferences.preferredAccent}
          soundEffects={preferences.soundEffects}
        />
      )}

      {!loadingTab && activeTab === 'strategy' && strategyItems && (
        <IeltsStrategyTab
          lessons={strategyItems}
          accent={preferences.preferredAccent}
          soundEffects={preferences.soundEffects}
        />
      )}

      {!loadingTab && activeTab === 'mocks' && mockManifests && (
        <IeltsMockHubTab
          manifests={mockManifests}
          pathway={ieltsPathway}
        />
      )}

      {!loadingTab && activeTab === 'ideas' && ideaItems && (
        <IeltsIdeaBankTab
          packs={ideaItems}
          accent={preferences.preferredAccent}
          soundEffects={preferences.soundEffects}
        />
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Interactive IELTS Academies Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              onClick={() => setActiveTab('mocks')}
              className="rounded-2xl border-2 border-[#8E3FD6] bg-[#FAF4FF] p-4 text-left hover:bg-[#F3E6FF]"
            >
              <Play className="h-6 w-6 text-[#8E3FD6]" />
              <p className="mt-2 font-black text-[#8E3FD6]">Mock Exams (12)</p>
              <p className="text-xs font-semibold text-[#555555]">8 Academic + 4 GT Timed Tests</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('strategy')}
              className="rounded-2xl border-2 border-[#1CB0F6] bg-[#F2FAFF] p-4 text-left hover:bg-[#E1F4FF]"
            >
              <Compass className="h-6 w-6 text-[#0E8BC9]" />
              <p className="mt-2 font-black text-[#0E8BC9]">Strategy Academy (60)</p>
              <p className="text-xs font-semibold text-[#555555]">Exam traps, timing & rubrics</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('listening')}
              className="rounded-2xl border-2 border-[#BCE7FD] bg-white p-4 text-left hover:bg-[#F2FAFF]"
            >
              <Headphones className="h-6 w-6 text-[#1CB0F6]" />
              <p className="mt-2 font-black">Listening (80)</p>
              <p className="text-xs font-semibold text-[#666666]">Parts 1–4 + distractor traps</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('speaking')}
              className="rounded-2xl border-2 border-[#DFB9FF] bg-white p-4 text-left hover:bg-[#FAF4FF]"
            >
              <Mic className="h-6 w-6 text-[#CE82FF]" />
              <p className="mt-2 font-black">Speaking (100)</p>
              <p className="text-xs font-semibold text-[#666666]">Cue cards, mic & Band 6 vs 8</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reading')}
              className="rounded-2xl border-2 border-[#C8F0A6] bg-white p-4 text-left hover:bg-[#EEFFDF]"
            >
              <BookOpen className="h-6 w-6 text-[#58CC02]" />
              <p className="mt-2 font-black">Reading (60)</p>
              <p className="text-xs font-semibold text-[#666666]">40 Academic + 20 GT passages</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('writing')}
              className="rounded-2xl border-2 border-[#FFE175] bg-white p-4 text-left hover:bg-[#FFFBEB]"
            >
              <PenTool className="h-6 w-6 text-[#FFC800]" />
              <p className="mt-2 font-black">Writing (60)</p>
              <p className="text-xs font-semibold text-[#666666]">Charts, Letters & Essays</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ideas')}
              className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 text-left hover:bg-[#F7F8FA] sm:col-span-2"
            >
              <Lightbulb className="h-6 w-6 text-[#8E3FD6]" />
              <p className="mt-2 font-black">Topic Idea & Lexis Packs (10)</p>
              <p className="text-xs font-semibold text-[#666666]">Thesis + counterpoints & Band 8 academic collocations</p>
            </button>
          </div>

          {/* 4-Mark Band Curve Quick Explainer */}
          <QuestCard className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#46A302]" />
                <h2 className="text-base font-black">Official 40-Mark Scaling & Half-Band Rounding Guide</h2>
              </div>
              <Link to="/reading" className="text-xs font-black text-[#0E8BC9] hover:underline">
                Open General Skill Labs →
              </Link>
            </div>
            <p className="text-xs font-semibold text-[#555555]">
              Listening (shared): 23/40 ≈ {(convertListeningRawToBand(23, 40) ?? 6.0).toFixed(1)}, 30/40 ≈ {(convertListeningRawToBand(30, 40) ?? 7.0).toFixed(1)}, 35/40 ≈ {(convertListeningRawToBand(35, 40) ?? 8.0).toFixed(1)}. General Training Reading requires higher raw hits (e.g., 34/40 ≈ Band {(convertReadingRawToBand(34, 'general_training', 40) ?? 7.0).toFixed(1)}) than Academic Reading (30/40 ≈ Band {(convertReadingRawToBand(30, 'academic', 40) ?? 7.0).toFixed(1)}). Overall averages round to nearest 0.5 (.25 rounds up to .5, .75 rounds up to whole band) — applied strictly to 40-question sets only.
            </p>
          </QuestCard>

          {/* Quick Speaking Parts 1, 2, 3 Cue Explorer */}
          <QuestCard className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-black">Quick Speaking Parts 1, 2 & 3 Preview</h2>
              <div className="flex gap-2">
                {IELTS_SPEAKING_PROMPTS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCueId(c.id)}
                    className={`rounded-xl border-2 px-3 py-1 text-xs font-black ${
                      activeCue.id === c.id
                        ? 'border-[#CE82FF] bg-[#F5E8FF] text-[#8E3FD6]'
                        : 'border-[#E5E5E5] bg-white'
                    }`}
                  >
                    {c.part}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F8FA] p-4 space-y-2">
              <p className="text-xs font-black uppercase text-[#8E3FD6]">
                {activeCue.part} • {activeCue.topic} (Prep {activeCue.prepSeconds}s / Speak {activeCue.speakSeconds}s)
              </p>
              <ul className="space-y-1.5 text-sm font-bold">
                {activeCue.questions.map((q) => (
                  <li key={q} className="flex items-center justify-between gap-2">
                    <span>{q}</span>
                    <button
                      type="button"
                      onClick={() => speakText(q, { accent: preferences.preferredAccent })}
                      className="text-xs font-black text-[#0E8BC9] hover:underline shrink-0"
                    >
                      Listen
                    </button>
                  </li>
                ))}
              </ul>
              {activeCue.cueCardBullets && (
                <ul className="list-disc pl-5 pt-2 text-sm font-semibold text-[#555555]">
                  {activeCue.cueCardBullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              <p className="pt-2 text-xs font-bold text-[#46A302]">Tip: {activeCue.bandTip}</p>
            </div>
          </QuestCard>

          {/* Timed Mini Mock Section */}
          <QuestCard className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black">
                  Timed Mini-Mock ({ieltsPathway === 'academic' ? 'Academic' : 'General Training'})
                </h2>
                <p className="text-xs font-semibold text-[#666666]">
                  Quick diagnostic checkpoint reporting raw accuracy (%) — no Band scaling on 3-question checks.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F7F8FA] px-3 py-1.5 text-xs font-black border border-[#E5E5E5]">
                <Clock className="h-4 w-4 text-[#1CB0F6]" />
                {Math.floor(mockSeconds / 60)}:{String(mockSeconds % 60).padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-4">
              {pathwayQuestions.map((q, i) => (
                <div key={q.id} className="rounded-2xl border-2 border-[#E5E5E5] p-4 space-y-2.5">
                  <p className="text-xs font-black uppercase text-[#777777]">
                    Item {i + 1} • {q.skill}
                  </p>
                  <p className="rounded-xl bg-[#F7F8FA] p-3 text-sm font-semibold text-[#3C3C3C]">
                    {q.context}
                  </p>
                  <p className="font-black text-[#3C3C3C]">{q.prompt}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={mockSubmitted}
                        onClick={() => setMockAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                        className={`rounded-xl border-2 px-3 py-2 text-left text-sm font-bold ${
                          mockAnswers[q.id] === opt
                            ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#0E8BC9]'
                            : 'border-[#E5E5E5] bg-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {mockSubmitted && (
                    <p className="text-xs font-bold text-[#46A302]">
                      Answer: {q.correctAnswer} — {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!mockSubmitted ? (
              <div className="flex justify-end">
                <TactileButton variant="purple" onClick={handleRunMiniMock}>
                  Finish Mini-Mock & Check Raw Score
                </TactileButton>
              </div>
            ) : (
              <div className="flex justify-end">
                <TactileButton
                  variant="outline"
                  onClick={() => {
                    setMockAnswers({});
                    setMockSubmitted(false);
                    setMockSeconds(0);
                  }}
                >
                  Try Another Round
                </TactileButton>
              </div>
            )}
          </QuestCard>

          {/* Real IELTS Practice History */}
          {ieltsSessions.length > 0 && (
            <QuestCard>
              <h3 className="text-base font-black">Your IELTS Practice History</h3>
              <div className="mt-3 space-y-2">
                {ieltsSessions.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#F7F8FA] px-3.5 py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-black">{s.title}</p>
                      <p className="text-xs font-semibold text-[#666666]">
                        {s.maxScore > 0
                          ? `Score ${s.score}/${s.maxScore} (${Math.round((s.score / s.maxScore) * 100)}%)`
                          : 'Speaking practice log'}{' '}
                        • Unofficial Practice Record
                      </p>
                    </div>
                    <PillBadge tone="purple">
                      {s.estimatedBand !== null
                        ? `Est. Band ${s.estimatedBand.toFixed(1)} (Unofficial)`
                        : 'Unassessed / Practice Only'}
                    </PillBadge>
                  </div>
                ))}
              </div>
            </QuestCard>
          )}
        </div>
      )}
    </div>
  );
}
