import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Award,
  BookOpen,
  BookText,
  Compass,
  Flame,
  Gem,
  GraduationCap,
  Headphones,
  LayoutGrid,
  Menu,
  Mic,
  PenTool,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Target,
  Trophy,
  User,
  X,
  Zap,
} from 'lucide-react';
import { computeUserLevel, toLocalDateKey } from '@english-quest/shared';
import { PipMascot } from '@/components/mascot/PipMascot';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';
import { QuestCard, QuestProgressBar } from '@/components/ui/QuestUI';
import { QUESTS_CATALOG } from '@/data/gamificationData';
import { useQuestStore } from '@/stores/useQuestStore';

interface NavGroup {
  label: string;
  items: Array<{
    to: string;
    label: string;
    icon: typeof Compass;
    badge?: string;
  }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Core',
    items: [
      { to: '/learn', label: 'Learn', icon: Compass },
      { to: '/review', label: 'Review', icon: RotateCcw },
      { to: '/ai-tutor', label: 'AI Tutor', icon: Sparkles },
    ],
  },
  {
    label: 'Four Skills',
    items: [
      { to: '/listening', label: 'Listening', icon: Headphones },
      { to: '/speaking', label: 'Speaking', icon: Mic },
      { to: '/reading', label: 'Reading', icon: BookOpen },
      { to: '/writing', label: 'Writing', icon: PenTool },
    ],
  },
  {
    label: 'Mastery & Exam',
    items: [
      { to: '/vocabulary', label: 'Vocabulary', icon: BookText },
      { to: '/grammar', label: 'Grammar', icon: GraduationCap },
      { to: '/ielts', label: 'IELTS', icon: Target },
    ],
  },
  {
    label: 'Progress & Account',
    items: [
      { to: '/quests', label: 'Quests', icon: Zap },
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      { to: '/achievements', label: 'Achievements', icon: Award },
      { to: '/profile', label: 'Profile', icon: User },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const xp = useQuestStore((s) => s.xp);
  const gems = useQuestStore((s) => s.gems);
  const streak = useQuestStore((s) => s.streak);
  const preferences = useQuestStore((s) => s.preferences);
  const studyMinutesByDate = useQuestStore((s) => s.studyMinutesByDate);
  const lessonProgress = useQuestStore((s) => s.lessonProgress);
  const xpTransactions = useQuestStore((s) => s.xpTransactions);
  const vocabReviewsByDate = useQuestStore((s) => s.vocabReviewsByDate);
  const mistakes = useQuestStore((s) => s.mistakes);

  const todayKey = toLocalDateKey();
  const todayMinutes = studyMinutesByDate[todayKey] ?? 0;
  const levelInfo = computeUserLevel(xp);

  const xpToday = xpTransactions
    .filter((t) => t.createdAt.startsWith(todayKey))
    .reduce((acc, t) => acc + t.amount, 0);
  const lessonsToday = Object.values(lessonProgress).filter((l) =>
    l.lastCompletedAt.startsWith(todayKey)
  ).length;
  const vocabToday = vocabReviewsByDate[todayKey] ?? 0;
  const unresolvedMistakes = mistakes.filter((m) => !m.resolved).length;

  const getQuestProgress = (metric: string) => {
    if (metric === 'xp_today') return xpToday;
    if (metric === 'lessons_today') return lessonsToday;
    if (metric === 'vocab_reviewed_today') return vocabToday;
    return Object.keys(lessonProgress).length;
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#3C3C3C]">
      {/* Mobile Compact Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-[#E5E5E5] bg-white px-4 py-2.5 lg:hidden">
        <Link to="/learn" className="flex items-center gap-2">
          <PipMascot mood="happy" size={34} label="English Quest mascot" />
          <span className="text-lg font-black tracking-tight text-[#58CC02]">English Quest</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-xl bg-[#FFF5CC] px-2.5 py-1 text-xs font-black text-[#A67800]">
            <Flame className="h-4 w-4 text-[#FF9600]" />
            {streak.currentDays}
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-[#E3F6FF] px-2.5 py-1 text-xs font-black text-[#0E8BC9]">
            <Zap className="h-4 w-4 text-[#1CB0F6]" />
            {xp}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-[#F5E8FF] px-2.5 py-1 text-xs font-black text-[#8E3FD6]">
            <Gem className="h-4 w-4 text-[#CE82FF]" />
            {gems}
          </span>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Open global knowledge search"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#E5E5E5] bg-white text-[#0E8BC9] hover:bg-[#F2FAFF]"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open all navigation sections"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#E5E5E5] bg-white text-[#3C3C3C] hover:bg-[#F7F8FA]"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {/* Desktop Left Sidebar */}
        <aside
          aria-label="Primary navigation"
          className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r-2 lg:border-[#E5E5E5] lg:bg-white lg:px-4 lg:py-5 lg:overflow-y-auto"
        >
          <Link to="/learn" className="mb-5 flex items-center gap-2.5 px-2">
            <PipMascot mood="idle" size={42} />
            <div>
              <p className="text-xl font-black leading-tight tracking-tight text-[#58CC02]">
                English Quest
              </p>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#777777]">
                CEFR & IELTS Hub
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Open global knowledge search"
            className="mb-4 flex items-center justify-between rounded-2xl border-2 border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2 text-xs font-extrabold text-[#555555] hover:border-[#84D8FF] hover:bg-[#F2FAFF]"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#0E8BC9]" />
              Search Knowledge
            </span>
            <kbd className="rounded-md border border-[#E5E5E5] bg-white px-1.5 py-0.5 text-[10px] font-black text-[#777777]">
              Ctrl K
            </kbd>
          </button>

          <nav className="flex-1 space-y-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 px-3 text-[11px] font-extrabold uppercase tracking-wider text-[#777777]">
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center justify-between rounded-2xl border-2 px-3 py-2 text-sm font-extrabold transition-colors ${
                              isActive
                                ? 'border-[#84D8FF] bg-[#DDF4FF] text-[#0E8BC9]'
                                : 'border-transparent text-[#555555] hover:bg-[#F7F8FA] hover:text-[#3C3C3C]'
                            }`
                          }
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="h-5 w-5 shrink-0" />
                            <span>{item.label}</span>
                          </span>
                          {item.to === '/review' && unresolvedMistakes > 0 && (
                            <span className="rounded-full bg-[#FF4B4B] px-2 py-0.5 text-[11px] font-black text-white">
                              {unresolvedMistakes}
                            </span>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Central Content Canvas */}
        <main className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-12">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>

        {/* Desktop Right Status & Quest Panel */}
        <aside
          aria-label="Learner status and daily quests"
          className="hidden xl:sticky xl:top-0 xl:flex xl:h-screen xl:w-80 xl:shrink-0 xl:flex-col xl:gap-4 xl:border-l-2 xl:border-[#E5E5E5] xl:bg-[#F7F8FA]/60 xl:p-5 xl:overflow-y-auto"
        >
          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center rounded-2xl border-2 border-[#E5E5E5] bg-white p-2.5">
              <Flame className="h-5 w-5 text-[#FF9600]" />
              <span className="mt-1 text-base font-black">{streak.currentDays}</span>
              <span className="text-[11px] font-bold text-[#777777]">Streak</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-[#E5E5E5] bg-white p-2.5">
              <Zap className="h-5 w-5 text-[#1CB0F6]" />
              <span className="mt-1 text-base font-black">{xp}</span>
              <span className="text-[11px] font-bold text-[#777777]">Total XP</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-[#E5E5E5] bg-white p-2.5">
              <Gem className="h-5 w-5 text-[#CE82FF]" />
              <span className="mt-1 text-base font-black">{gems}</span>
              <span className="text-[11px] font-bold text-[#777777]">Gems</span>
            </div>
          </div>

          {/* Level & Daily Goal */}
          <QuestCard className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black">Level {levelInfo.level}</span>
              <span className="text-xs font-extrabold text-[#46A302]">
                {levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP
              </span>
            </div>
            <div className="mt-2">
              <QuestProgressBar
                value={levelInfo.currentLevelXp}
                max={levelInfo.nextLevelXp}
                color="#58CC02"
                label="Level progress"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-black">Daily Study Goal</span>
              <span className="text-xs font-extrabold text-[#0E8BC9]">
                {todayMinutes}/{preferences.dailyGoalMinutes} min
              </span>
            </div>
            <div className="mt-2">
              <QuestProgressBar
                value={todayMinutes}
                max={preferences.dailyGoalMinutes}
                color="#1CB0F6"
                label="Daily study goal"
              />
            </div>
          </QuestCard>

          {/* Daily Quests Snapshot */}
          <QuestCard className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wide">Daily Quests</h2>
              <Link to="/quests" className="text-xs font-extrabold text-[#1CB0F6] hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {QUESTS_CATALOG.slice(0, 3).map((q) => {
                const progress = getQuestProgress(q.metric);
                return (
                  <div key={q.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{q.title}</span>
                      <span className="text-[#777777]">
                        {Math.min(progress, q.target)}/{q.target}
                      </span>
                    </div>
                    <QuestProgressBar
                      value={progress}
                      max={q.target}
                      color="#FFC800"
                      heightClass="h-2.5"
                      label={q.title}
                    />
                  </div>
                );
              })}
            </div>
          </QuestCard>

          {/* Quick Review Spotlight */}
          <QuestCard className="bg-[#E9FCD9]/50 p-4">
            <div className="flex items-center gap-3">
              <PipMascot mood={unresolvedMistakes > 0 ? 'thinking' : 'happy'} size={52} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black">
                  {unresolvedMistakes > 0
                    ? `${unresolvedMistakes} Mistake${unresolvedMistakes > 1 ? 's' : ''} to Retry`
                    : 'Keep Your Momentum'}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-[#555555]">
                  {unresolvedMistakes > 0
                    ? 'Turn past slips into mastered skills.'
                    : 'Explore your 4-skill labs or SM-2 cards!'}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                to="/review"
                className="flex-1 rounded-xl border-2 border-[#46A302] border-b-4 bg-[#58CC02] py-2 text-center text-xs font-black text-white hover:bg-[#61DA06]"
              >
                Open Review
              </Link>
              <Link
                to="/onboarding"
                className="rounded-xl border-2 border-[#E5E5E5] border-b-4 bg-white px-3 py-2 text-xs font-black text-[#3C3C3C] hover:bg-[#F7F8FA]"
              >
                Placement
              </Link>
            </div>
          </QuestCard>
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t-2 border-[#E5E5E5] bg-white px-2 py-1.5 lg:hidden"
      >
        {[
          { to: '/learn', label: 'Learn', icon: Compass },
          { to: '/listening', label: 'Listen', icon: Headphones },
          { to: '/speaking', label: 'Speak', icon: Mic },
          { to: '/vocabulary', label: 'Vocab', icon: BookText },
          { to: '/ai-tutor', label: 'Tutor', icon: Sparkles },
        ].map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center rounded-xl px-2 py-1 text-[11px] font-extrabold ${
                active ? 'bg-[#DDF4FF] text-[#0E8BC9]' : 'text-[#666666]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex min-h-[44px] min-w-[54px] flex-col items-center justify-center rounded-xl px-2 py-1 text-[11px] font-extrabold text-[#666666]"
        >
          <LayoutGrid className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile Full Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="All navigation pages"
        >
          <div className="flex h-full w-80 max-w-[88vw] flex-col bg-white p-5 shadow-2xl overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PipMascot mood="happy" size={36} />
                <span className="text-lg font-black text-[#58CC02]">All Sections</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#E5E5E5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#777777]">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex min-h-[44px] items-center gap-3 rounded-xl border-2 px-3 py-2 text-sm font-extrabold ${
                              isActive
                                ? 'border-[#84D8FF] bg-[#DDF4FF] text-[#0E8BC9]'
                                : 'border-[#F0F0F0] bg-[#F7F8FA] text-[#3C3C3C]'
                            }`
                          }
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
