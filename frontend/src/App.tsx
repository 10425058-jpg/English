import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { AppShell } from '@/components/layout/AppShell';
import { PipMascot } from '@/components/mascot/PipMascot';
import { useQuestStore } from '@/stores/useQuestStore';

const LearnPage = lazy(() =>
  import('@/features/learning/LearnPage').then((m) => ({ default: m.LearnPage }))
);
const OnboardingPage = lazy(() =>
  import('@/features/learning/OnboardingPage').then((m) => ({ default: m.OnboardingPage }))
);
const LessonPlayerPage = lazy(() =>
  import('@/features/learning/LessonPlayerPage').then((m) => ({ default: m.LessonPlayerPage }))
);
const AssessmentPlayerPage = lazy(() =>
  import('@/features/learning/AssessmentPlayerPage').then((m) => ({
    default: m.AssessmentPlayerPage,
  }))
);
const ReviewPage = lazy(() =>
  import('@/features/learning/ReviewPage').then((m) => ({ default: m.ReviewPage }))
);
const ListeningPage = lazy(() =>
  import('@/features/listening/ListeningAcademyPage').then((m) => ({
    default: m.ListeningAcademyPage,
  }))
);
const SpeakingPage = lazy(() =>
  import('@/features/speaking/SpeakingAcademyPage').then((m) => ({
    default: m.SpeakingAcademyPage,
  }))
);
const ReadingPage = lazy(() =>
  import('@/features/reading/ReadingAcademyPage').then((m) => ({
    default: m.ReadingAcademyPage,
  }))
);
const WritingPage = lazy(() =>
  import('@/features/writing/WritingAcademyPage').then((m) => ({
    default: m.WritingAcademyPage,
  }))
);
const AITutorPage = lazy(() =>
  import('@/features/ai-tutor/AITutorPage').then((m) => ({ default: m.AITutorPage }))
);
const VocabularyPage = lazy(() =>
  import('@/features/vocabulary/VocabularyPage').then((m) => ({ default: m.VocabularyPage }))
);
const GrammarPage = lazy(() =>
  import('@/features/grammar/GrammarPage').then((m) => ({ default: m.GrammarPage }))
);
const IeltsPage = lazy(() =>
  import('@/features/ielts/IeltsPage').then((m) => ({ default: m.IeltsPage }))
);
const QuestsPage = lazy(() =>
  import('@/features/gamification/QuestsPage').then((m) => ({ default: m.QuestsPage }))
);
const LeaderboardPage = lazy(() =>
  import('@/features/gamification/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage }))
);
const AchievementsPage = lazy(() =>
  import('@/features/gamification/AchievementsPage').then((m) => ({ default: m.AchievementsPage }))
);
const ProfilePage = lazy(() =>
  import('@/features/gamification/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SettingsPage = lazy(() =>
  import('@/features/gamification/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

function RouteLoader() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <PipMascot mood="happy" size={72} />
      <p className="text-sm font-black text-[#777777]">Loading English Quest...</p>
    </div>
  );
}

export function App() {
  const reducedMotion = useQuestStore((s) => s.preferences.reducedMotion);

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
  }, [reducedMotion]);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
        <HashRouter>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Full-screen distraction-free flows */}
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/lesson/:lessonId" element={<LessonPlayerPage />} />
              <Route path="/assessment/:assessmentId" element={<AssessmentPlayerPage />} />

              {/* Main 15-page Application Shell */}
              <Route
                path="/learn"
                element={
                  <AppShell>
                    <LearnPage />
                  </AppShell>
                }
              />
              <Route
                path="/listening"
                element={
                  <AppShell>
                    <ListeningPage />
                  </AppShell>
                }
              />
              <Route
                path="/speaking"
                element={
                  <AppShell>
                    <SpeakingPage />
                  </AppShell>
                }
              />
              <Route
                path="/reading"
                element={
                  <AppShell>
                    <ReadingPage />
                  </AppShell>
                }
              />
              <Route
                path="/writing"
                element={
                  <AppShell>
                    <WritingPage />
                  </AppShell>
                }
              />
              <Route
                path="/ai-tutor"
                element={
                  <AppShell>
                    <AITutorPage />
                  </AppShell>
                }
              />
              <Route
                path="/vocabulary"
                element={
                  <AppShell>
                    <VocabularyPage />
                  </AppShell>
                }
              />
              <Route
                path="/grammar"
                element={
                  <AppShell>
                    <GrammarPage />
                  </AppShell>
                }
              />
              <Route
                path="/ielts"
                element={
                  <AppShell>
                    <IeltsPage />
                  </AppShell>
                }
              />
              <Route
                path="/review"
                element={
                  <AppShell>
                    <ReviewPage />
                  </AppShell>
                }
              />
              <Route
                path="/quests"
                element={
                  <AppShell>
                    <QuestsPage />
                  </AppShell>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <AppShell>
                    <LeaderboardPage />
                  </AppShell>
                }
              />
              <Route
                path="/achievements"
                element={
                  <AppShell>
                    <AchievementsPage />
                  </AppShell>
                }
              />
              <Route
                path="/profile"
                element={
                  <AppShell>
                    <ProfilePage />
                  </AppShell>
                }
              />
              <Route
                path="/settings"
                element={
                  <AppShell>
                    <SettingsPage />
                  </AppShell>
                }
              />

              <Route path="/" element={<Navigate to="/learn" replace />} />
              <Route path="*" element={<Navigate to="/learn" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </MotionConfig>
    </QueryClientProvider>
  );
}
export default App;
