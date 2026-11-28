import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Search,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react';
import type { CEFRLevel, ConversationScenario } from '@english-quest/shared';
import { CEFR_LEVELS, loadAllConversations } from '@content/index';
import { HonestNotice, PillBadge, QuestCard } from '@/components/ui/QuestUI';
import { TactileButton } from '@/components/ui/TactileButton';
import { createAttemptKey } from '@/services/idempotency';
import { playFeedbackTone, speakDialogueLine, speakText } from '@/services/speechService';
import { useQuestStore } from '@/stores/useQuestStore';

const DOMAIN_LABELS: Record<ConversationScenario['domain'], string> = {
  everyday: 'Everyday Life',
  travel: 'Travel & Transit',
  workplace: 'Workplace',
  social: 'Social & Friends',
  academic: 'Academic & Campus',
  emergency: 'Urgent & Safety',
};

export function ConversationsTab() {
  const preferences = useQuestStore((s) => s.preferences);
  const awardActivityXp = useQuestStore((s) => s.awardActivityXp);
  const bookmarkedContentIds = useQuestStore((s) => s.bookmarkedContentIds ?? []);
  const toggleContentBookmark = useQuestStore((s) => s.toggleContentBookmark);
  const completedAcademyIds = useQuestStore((s) => s.completedAcademyIds ?? []);
  const markAcademyCompleted = useQuestStore((s) => s.markAcademyCompleted);

  const { data: scenarios = [], isLoading } = useQuery({
    queryKey: ['conversations-all'],
    queryFn: loadAllConversations,
    staleTime: Infinity,
  });

  const [cefrFilter, setCefrFilter] = useState<'ALL' | 'BOOKMARKED' | CEFRLevel>('ALL');
  const [domainFilter, setDomainFilter] = useState<'ALL' | ConversationScenario['domain']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState('conv-m2-01');
  const [selectedReplies, setSelectedReplies] = useState<Record<number, 'polite' | 'casual' | 'formal'>>({});
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scenarios.filter((s) => {
      if (cefrFilter === 'BOOKMARKED' && !bookmarkedContentIds.includes(s.id)) return false;
      if (cefrFilter !== 'ALL' && cefrFilter !== 'BOOKMARKED' && s.cefrLevel !== cefrFilter) {
        return false;
      }
      if (domainFilter !== 'ALL' && s.domain !== domainFilter) return false;
      if (
        q &&
        !s.title.toLowerCase().includes(q) &&
        !s.setting.toLowerCase().includes(q) &&
        !s.goal.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [bookmarkedContentIds, cefrFilter, domainFilter, scenarios, searchQuery]);

  const active =
    scenarios.find((s) => s.id === selectedId) ?? filtered[0] ?? scenarios[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSelectedReplies({});
    setSavedNotice(null);
  };

  const handleCompleteScenario = () => {
    if (!active) return;
    markAcademyCompleted(active.id);
    awardActivityXp({
      idempotencyKey: createAttemptKey('conversation', active.id),
      amount: 20,
      source: 'speaking',
      referenceId: active.id,
      skill: 'speaking',
      minutes: 3,
      correctDelta: active.dialogueBranches.length,
      attemptsDelta: active.dialogueBranches.length,
    });
    playFeedbackTone('celebrate', preferences.soundEffects);
    setSavedNotice(`Logged "${active.title}" practice cleanly (+20 XP)!`);
  };

  if (isLoading || !active) {
    return (
      <QuestCard>
        <p className="text-sm font-bold text-[#777777]">Loading 60 practical conversation scenarios...</p>
      </QuestCard>
    );
  }

  return (
    <div className="space-y-5">
      <HonestNotice
        title="Register-Aware Branching Dialogue Simulator"
        description="Compare how Polite, Casual, and Formal phrasing shift interpersonal warmth across identical real-world turns, then practice saying chosen lines aloud cleanly or launch open dialogue in AI Tutor."
      />

      {/* Filter Shelf */}
      <QuestCard className="space-y-4 bg-[#F7F8FA]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(['ALL', 'BOOKMARKED', ...CEFR_LEVELS] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setCefrFilter(lvl)}
                className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                  cefrFilter === lvl
                    ? 'border-[#6E26B5] bg-[#8E3FD6] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#555555]'
                }`}
              >
                {lvl === 'BOOKMARKED' ? `Saved (${bookmarkedContentIds.length})` : lvl}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              aria-label="Filter conversation domain"
              value={domainFilter}
              onChange={(e) =>
                setDomainFilter(e.target.value as 'ALL' | ConversationScenario['domain'])
              }
              className="rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-extrabold text-[#3C3C3C] focus:border-[#8E3FD6] focus:outline-none"
            >
              <option value="ALL">All Domains ({scenarios.length})</option>
              {(Object.keys(DOMAIN_LABELS) as ConversationScenario['domain'][]).map((dom) => (
                <option key={dom} value={dom}>
                  {DOMAIN_LABELS[dom]}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-[#888888]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenario..."
                className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white py-1.5 pr-3 pl-8 text-xs font-bold text-[#3C3C3C] focus:border-[#8E3FD6] focus:outline-none sm:w-52"
              />
            </div>
          </div>
        </div>

        <div className="grid max-h-56 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const isSel = active.id === item.id;
            const isDone = completedAcademyIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`flex min-w-0 flex-col justify-between rounded-2xl border-2 p-3 text-left ${
                  isSel ? 'border-[#8E3FD6] bg-[#FAF5FF]' : 'border-[#E5E5E5] bg-white hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="rounded-lg bg-[#F5E8FF] px-2 py-0.5 text-[11px] font-black text-[#6E26B5]">
                    {item.cefrLevel} • {DOMAIN_LABELS[item.domain]}
                  </span>
                  {isDone && <CheckCircle2 className="h-4 w-4 text-[#58CC02]" />}
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs font-black text-[#3C3C3C]">
                  {item.title}
                </p>
              </button>
            );
          })}
        </div>
      </QuestCard>

      {/* Active Scenario Workspace */}
      <QuestCard className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <PillBadge tone="purple">{active.cefrLevel}</PillBadge>
              <PillBadge tone="blue">{DOMAIN_LABELS[active.domain]}</PillBadge>
            </div>
            <h2 className="mt-2 text-xl font-black text-[#3C3C3C]">{active.title}</h2>
            <p className="mt-1 text-xs font-semibold text-[#666666]">{active.setting}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleContentBookmark(active.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black ${
                bookmarkedContentIds.includes(active.id)
                  ? 'border-[#6E26B5] bg-[#F5E8FF] text-[#6E26B5]'
                  : 'border-[#E5E5E5] bg-white text-[#555555]'
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  bookmarkedContentIds.includes(active.id) ? 'fill-current' : ''
                }`}
              />
              {bookmarkedContentIds.includes(active.id) ? 'Saved' : 'Save'}
            </button>
            <Link to="/ai-tutor">
              <TactileButton variant="outline" size="sm">
                <Sparkles className="h-3.5 w-3.5" />
                Practice Free-Form in AI Tutor
              </TactileButton>
            </Link>
          </div>
        </div>

        {/* Role & Mission Cards */}
        <div className="grid gap-3 rounded-2xl bg-[#F7F8FA] p-3.5 text-xs sm:grid-cols-3">
          <div>
            <p className="font-black uppercase text-[#6E26B5]">Your Role</p>
            <p className="mt-0.5 font-semibold text-[#3C3C3C]">{active.userRole}</p>
          </div>
          <div>
            <p className="font-black uppercase text-[#0E8BC9]">Partner Role</p>
            <p className="mt-0.5 font-semibold text-[#3C3C3C]">{active.partnerRole}</p>
          </div>
          <div>
            <p className="font-black uppercase text-[#46A302]">Mission Goal</p>
            <p className="mt-0.5 font-semibold text-[#3C3C3C]">{active.goal}</p>
          </div>
        </div>

        {/* Multi-Turn Interactive Branches */}
        <div className="space-y-4">
          {active.dialogueBranches.map((branch) => {
            const picked = selectedReplies[branch.step];
            const pickedText =
              picked === 'polite'
                ? branch.politeOption
                : picked === 'casual'
                  ? branch.casualOption
                  : picked === 'formal'
                    ? branch.formalOption
                    : null;

            return (
              <div
                key={branch.step}
                className="space-y-3 rounded-2xl border-2 border-[#E5E5E5] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-black uppercase text-[#0E8BC9]">
                      Turn {branch.step} • Partner Says
                    </span>
                    <p className="mt-0.5 text-sm font-black text-[#3C3C3C]">
                      &ldquo;{branch.partnerSays}&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Play partner turn ${branch.step}`}
                    onClick={() =>
                      speakDialogueLine(branch.partnerSays, {
                        accent: preferences.preferredAccent,
                        rate: 0.95,
                        speakerIndex: 1,
                      })
                    }
                    className="shrink-0 rounded-xl bg-[#E3F6FF] p-2 text-[#0E8BC9] hover:bg-[#BCE7FD]"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReplies((prev) => ({ ...prev, [branch.step]: 'polite' }));
                      speakText(branch.politeOption, { accent: preferences.preferredAccent });
                    }}
                    className={`rounded-xl border-2 p-3 text-left text-xs ${
                      picked === 'polite'
                        ? 'border-[#46A302] bg-[#F2FDE9]'
                        : 'border-[#E5E5E5] bg-[#FAFAFA] hover:bg-white'
                    }`}
                  >
                    <span className="font-black uppercase text-[#46A302]">Polite Option</span>
                    <p className="mt-1 font-bold text-[#3C3C3C]">{branch.politeOption}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReplies((prev) => ({ ...prev, [branch.step]: 'casual' }));
                      speakText(branch.casualOption, { accent: preferences.preferredAccent });
                    }}
                    className={`rounded-xl border-2 p-3 text-left text-xs ${
                      picked === 'casual'
                        ? 'border-[#0E8BC9] bg-[#F2FAFF]'
                        : 'border-[#E5E5E5] bg-[#FAFAFA] hover:bg-white'
                    }`}
                  >
                    <span className="font-black uppercase text-[#0E8BC9]">Natural / Casual Option</span>
                    <p className="mt-1 font-bold text-[#3C3C3C]">{branch.casualOption}</p>
                  </button>
                </div>

                {branch.formalOption && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReplies((prev) => ({ ...prev, [branch.step]: 'formal' }));
                      speakText(branch.formalOption ?? '', { accent: preferences.preferredAccent });
                    }}
                    className={`block w-full rounded-xl border-2 p-3 text-left text-xs ${
                      picked === 'formal'
                        ? 'border-[#6E26B5] bg-[#FAF5FF]'
                        : 'border-[#E5E5E5] bg-[#FAFAFA] hover:bg-white'
                    }`}
                  >
                    <span className="font-black uppercase text-[#6E26B5]">Formal / Executive Option</span>
                    <p className="mt-1 font-bold text-[#3C3C3C]">{branch.formalOption}</p>
                  </button>
                )}

                {pickedText && (
                  <div className="flex items-start gap-2 rounded-xl border border-[#FFE175] bg-[#FFFBEB] p-2.5 text-xs">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A600]" />
                    <p className="font-bold text-[#785300]">{branch.followUpNote}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Key Phrases & Pragmatics Notes */}
        <div className="grid gap-4 border-t border-[#E5E5E5] pt-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-black uppercase text-[#6E26B5]">
              <MessageSquare className="h-3.5 w-3.5" />
              High-Value Key Phrases
            </p>
            {active.keyPhrases.map((kp) => (
              <div
                key={kp.phrase}
                className="flex items-start justify-between gap-2 rounded-xl bg-[#F7F8FA] p-2.5 text-xs"
              >
                <div>
                  <span className="font-black text-[#3C3C3C]">{kp.phrase}</span>{' '}
                  <span className="rounded bg-[#E5E5E5] px-1.5 py-0.5 text-[10px] font-black uppercase text-[#555555]">
                    {kp.register}
                  </span>
                  <p className="mt-0.5 font-semibold text-[#555555]">{kp.meaning}</p>
                  {preferences.bilingualExplanations && (
                    <p className="font-bold text-[#46A302]">VI: {kp.vietnamese}</p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Hear ${kp.phrase}`}
                  onClick={() => speakText(kp.phrase, { accent: preferences.preferredAccent })}
                  className="rounded-lg bg-white p-1.5 text-[#0E8BC9]"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-[#B8EE8A] bg-[#F2FDE9] p-3 text-xs">
              <p className="flex items-center gap-1.5 font-black uppercase text-[#46A302]">
                <Users className="h-3.5 w-3.5" />
                Cultural & Pragmatic Note
              </p>
              <p className="mt-1 font-semibold text-[#2F6E01]">{active.culturalTip}</p>
            </div>
            <div className="rounded-xl border border-[#FFD6D6] bg-[#FFF5F5] p-3 text-xs">
              <p className="flex items-center gap-1.5 font-black uppercase text-[#D32F2F]">
                <AlertTriangle className="h-3.5 w-3.5" />
                Pitfalls to Avoid
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 font-semibold text-[#9A1B1B]">
                {active.commonPitfalls.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {savedNotice ? (
            <span className="text-xs font-black text-[#46A302]">{savedNotice}</span>
          ) : (
            <span className="text-xs font-semibold text-[#777777]">
              Speak all {active.dialogueBranches.length} turns aloud cleanly before marking practiced.
            </span>
          )}
          <TactileButton variant="primary" size="md" onClick={handleCompleteScenario}>
            <CheckCircle2 className="h-4 w-4" />
            Mark Roleplay Practiced (+20 XP)
          </TactileButton>
        </div>
      </QuestCard>
    </div>
  );
}
