import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  calculateSM2Review,
  createInitialSkillProgress,
  estimateSkillCEFR,
  toLocalDateKey,
  updateStreakForActivity,
  type AIConversation,
  type AIMessage,
  type AssessmentAttemptRecord,
  type CEFRLevel,
  type DailyGoalMinutes,
  type EnglishAccent,
  type GuestMigrationPayload,
  type IELTSMockAttemptDraft,
  type IELTSMockAttemptResult,
  type IELTSPathway,
  type IELTSPracticeSession,
  type LearningPurpose,
  type LessonProgress,
  type Mistake,
  type ReviewSchedule,
  type SkillProgress,
  type SkillTag,
  type SM2Quality,
  type SpeakingSession,
  type Streak,
  type UserPreferences,
  type UserVocabulary,
  type Vocabulary,
  type WritingSubmission,
  type XPTransaction,
} from '@english-quest/shared';
import { SEED_VOCABULARY } from '@/data/vocabularySeed';
import { ACHIEVEMENTS_CATALOG } from '@/data/gamificationData';

export interface InProgressLessonState {
  lessonId: string;
  unitId: string;
  exerciseIndex: number;
  correctCount: number;
  mistakeQueueIds: string[];
  startedAt: string;
}

export interface ListeningSessionRecord {
  id: string;
  contentId: string;
  title: string;
  cefrLevel: CEFRLevel;
  correctCount: number;
  totalCount: number;
  completedAt: string;
}

export interface ReadingSessionRecord {
  id: string;
  passageId: string;
  title: string;
  cefrLevel: CEFRLevel;
  correctCount: number;
  totalCount: number;
  readingSeconds: number;
  completedAt: string;
}

export interface QuestStoreState {
  hasCompletedOnboarding: boolean;
  placementStatus: 'not_taken' | 'completed' | 'skipped';
  recommendedCefr: CEFRLevel;
  displayName: string;
  preferences: UserPreferences;
  ieltsPathway: IELTSPathway;

  xp: number;
  gems: number;
  hearts: number;
  streak: Streak;
  xpTransactions: XPTransaction[];
  studyMinutesByDate: Record<string, number>;

  lessonProgress: Record<string, LessonProgress>;
  claimedChests: string[];
  inProgressLesson: InProgressLessonState | null;
  skillStats: Record<SkillTag, SkillProgress>;

  customVocabulary: Vocabulary[];
  vocabularySchedules: Record<string, ReviewSchedule>;
  vocabReviewsByDate: Record<string, number>;

  mistakes: Mistake[];
  speakingSessions: SpeakingSession[];
  listeningHistory: ListeningSessionRecord[];
  readingHistory: ReadingSessionRecord[];
  writingDrafts: Record<string, { text: string; updatedAt: string }>;
  writingSubmissions: WritingSubmission[];
  ieltsSessions: IELTSPracticeSession[];
  inProgressMockExam: IELTSMockAttemptDraft | null;
  ieltsMockHistory: IELTSMockAttemptResult[];
  unitAssessmentResults: Record<string, AssessmentAttemptRecord>;
  assessmentHistory: AssessmentAttemptRecord[];
  unlockedUnitOverrides: string[];
  aiConversations: AIConversation[];
  aiMessages: Record<string, AIMessage[]>;
  grammarQuizPassedIds: string[];
  bookmarkedContentIds: string[];
  completedAcademyIds: string[];

  questsClaimedByPeriod: Record<string, string[]>;
  achievementsUnlocked: Record<string, string>;

  // Actions
  completeOnboarding: (payload: {
    displayName?: string;
    preferences: Partial<UserPreferences>;
    placementStatus: 'completed' | 'skipped';
    recommendedCefr: CEFRLevel;
  }) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  setIeltsPathway: (pathway: IELTSPathway) => void;
  setDisplayName: (name: string) => void;

  saveInProgressLesson: (state: InProgressLessonState | null) => void;
  completeLessonAttempt: (payload: {
    idempotencyKey: string;
    lessonId: string;
    unitId: string;
    accuracy: number;
    xpReward: number;
    durationSeconds: number;
    skills: SkillTag[];
    cefrLevel: CEFRLevel;
    correctExercises: number;
    totalExercises: number;
  }) => { awardedXp: number; duplicateIgnored: boolean };

  claimTreasureChest: (unitId: string, gemsReward: number, xpReward: number) => boolean;
  awardActivityXp: (payload: {
    idempotencyKey: string;
    amount: number;
    source: XPTransaction['source'];
    referenceId: string;
    skill?: SkillTag;
    minutes?: number;
    correctDelta?: number;
    attemptsDelta?: number;
  }) => boolean;

  recordMistake: (mistake: Omit<Mistake, 'id' | 'createdAt' | 'resolved' | 'retryCount'>) => void;
  resolveMistake: (mistakeId: string) => void;

  saveWordToVocabulary: (word: Omit<Vocabulary, 'id'> & { id?: string }) => string;
  reviewVocabularySM2: (vocabularyId: string, quality: SM2Quality) => void;

  recordListeningSession: (record: Omit<ListeningSessionRecord, 'id' | 'completedAt'>) => void;
  recordReadingSession: (record: Omit<ReadingSessionRecord, 'id' | 'completedAt'>) => void;
  recordSpeakingSession: (record: Omit<SpeakingSession, 'id' | 'completedAt'>) => void;

  saveWritingDraft: (promptId: string, text: string) => void;
  submitWriting: (submission: Omit<WritingSubmission, 'id' | 'submittedAt'>) => void;

  recordGrammarQuizPass: (topicId: string) => void;
  toggleContentBookmark: (contentId: string) => void;
  markAcademyCompleted: (contentId: string) => void;
  recordIeltsSession: (session: Omit<IELTSPracticeSession, 'id' | 'completedAt'>) => void;
  saveInProgressMockExam: (draft: IELTSMockAttemptDraft | null) => void;
  recordMockExamCompletion: (
    result: Omit<IELTSMockAttemptResult, 'id' | 'completedAt'>
  ) => { result: IELTSMockAttemptResult; awardedXp: number };
  recordAssessmentAttempt: (
    attempt: Omit<AssessmentAttemptRecord, 'id' | 'completedAt'>,
  ) => { awardedXp: number; record: AssessmentAttemptRecord };
  unlockUnitForIndependentPractice: (unitId: string) => void;
  setRecommendedCefr: (level: CEFRLevel) => void;

  upsertAiMessage: (
    conversation: Omit<AIConversation, 'createdAt' | 'updatedAt'>,
    message: Omit<AIMessage, 'id' | 'createdAt'>
  ) => void;

  claimQuestReward: (periodKey: string, questId: string, rewardXp: number, rewardGems: number) => boolean;

  exportBackupJson: () => string;
  importBackupJson: (rawJson: string) => { ok: boolean; error?: string };
  buildAccountMigrationPayload: () => GuestMigrationPayload;
  resetAllProgress: () => void;
}

function buildInitialSchedules(): Record<string, ReviewSchedule> {
  const nowIso = new Date().toISOString();
  const map: Record<string, ReviewSchedule> = {};
  for (const item of SEED_VOCABULARY) {
    map[item.id] = {
      vocabularyId: item.id,
      easeFactor: 2.5,
      intervalDays: 0,
      repetitions: 0,
      nextReviewDate: nowIso,
      masteryLevel: 0,
    };
  }
  return map;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  nativeLanguage: 'Vietnamese',
  selfAssessedLevel: 'A1',
  purpose: 'everyday' as LearningPurpose,
  targetCefr: 'B2',
  ieltsTargetBand: 6.5,
  dailyGoalMinutes: 15 as DailyGoalMinutes,
  preferredAccent: 'en-US' as EnglishAccent,
  prioritySkills: ['speaking', 'listening', 'vocabulary'],
  bilingualExplanations: true,
  soundEffects: true,
  reducedMotion: false,
  heartsEnabled: false,
  speechRate: 1.0,
  audioConsentGranted: false,
  retainAudioRecordings: false,
};

function evaluateUnlockedAchievements(state: QuestStoreState): Record<string, string> {
  const next = { ...state.achievementsUnlocked };
  const nowIso = new Date().toISOString();

  const metrics: Record<string, number> = {
    lessons_completed: Object.keys(state.lessonProgress).length,
    xp_total: state.xp,
    streak_days: state.streak.currentDays,
    vocab_mastered: Object.values(state.vocabularySchedules).filter((s) => s.repetitions >= 1).length,
    listening_completed: state.listeningHistory.length,
    speaking_completed: state.speakingSessions.length,
    reading_completed: state.readingHistory.length,
    writing_completed: state.writingSubmissions.length,
    mistakes_resolved: state.mistakes.filter((m) => m.resolved).length,
    units_completed: state.claimedChests.length,
  };

  for (const ach of ACHIEVEMENTS_CATALOG) {
    if (!next[ach.id] && (metrics[ach.metric] ?? 0) >= ach.targetValue) {
      next[ach.id] = nowIso;
    }
  }

  return next;
}

function createInitialDataState() {
  return {
    hasCompletedOnboarding: false,
    placementStatus: 'not_taken' as const,
    recommendedCefr: 'A1' as CEFRLevel,
    displayName: 'Quest Explorer',
    preferences: { ...DEFAULT_PREFERENCES },
    ieltsPathway: 'academic' as IELTSPathway,
    xp: 0,
    gems: 50,
    hearts: 5,
    streak: {
      currentDays: 0,
      longestDays: 0,
      lastActiveDate: null,
      activeDates: [],
    },
    xpTransactions: [],
    studyMinutesByDate: {},
    lessonProgress: {},
    claimedChests: [],
    inProgressLesson: null,
    skillStats: createInitialSkillProgress('A1'),
    customVocabulary: [],
    vocabularySchedules: buildInitialSchedules(),
    vocabReviewsByDate: {},
    mistakes: [],
    speakingSessions: [],
    listeningHistory: [],
    readingHistory: [],
    writingDrafts: {},
    writingSubmissions: [],
    ieltsSessions: [],
    inProgressMockExam: null as IELTSMockAttemptDraft | null,
    ieltsMockHistory: [] as IELTSMockAttemptResult[],
    unitAssessmentResults: {} as Record<string, AssessmentAttemptRecord>,
    assessmentHistory: [] as AssessmentAttemptRecord[],
    unlockedUnitOverrides: [] as string[],
    aiConversations: [],
    aiMessages: {},
    grammarQuizPassedIds: [],
    bookmarkedContentIds: [],
    completedAcademyIds: [],
    questsClaimedByPeriod: {},
    achievementsUnlocked: {},
  };
}

export const useQuestStore = create<QuestStoreState>()(
  persist(
    (set, get) => ({
      ...createInitialDataState(),

      completeOnboarding: ({ displayName, preferences, placementStatus, recommendedCefr }) => {
        set((state) => ({
          hasCompletedOnboarding: true,
          placementStatus,
          recommendedCefr,
          displayName: displayName?.trim() || state.displayName,
          preferences: {
            ...state.preferences,
            ...preferences,
          },
          skillStats: createInitialSkillProgress(recommendedCefr),
        }));
      },

      updatePreferences: (patch) => {
        set((state) => ({
          preferences: { ...state.preferences, ...patch },
        }));
      },

      setIeltsPathway: (pathway) => set({ ieltsPathway: pathway }),

      setDisplayName: (name) => set({ displayName: name.trim() || 'Quest Explorer' }),

      saveInProgressLesson: (inProgressLesson) => set({ inProgressLesson }),

      completeLessonAttempt: ({
        idempotencyKey,
        lessonId,
        unitId,
        accuracy,
        xpReward,
        durationSeconds,
        skills,
        cefrLevel,
        correctExercises,
        totalExercises,
      }) => {
        const state = get();
        if (state.xpTransactions.some((t) => t.idempotencyKey === idempotencyKey)) {
          return { awardedXp: 0, duplicateIgnored: true };
        }

        const todayKey = toLocalDateKey();
        const nowIso = new Date().toISOString();
        const prevLesson = state.lessonProgress[lessonId];
        const isFirstCompletion = !prevLesson;
        const awardedXp = isFirstCompletion ? xpReward : Math.max(5, Math.round(xpReward * 0.4));
        const minutesDelta = Math.max(1, Math.round(durationSeconds / 60));

        const nextSkillStats = { ...state.skillStats };
        for (const skill of skills) {
          const cur = nextSkillStats[skill];
          const attempts = cur.attempts + totalExercises;
          const correct = cur.correct + correctExercises;
          nextSkillStats[skill] = {
            ...cur,
            attempts,
            correct,
            minutesPracticed: cur.minutesPracticed + minutesDelta,
            estimatedCefr: estimateSkillCEFR(attempts, correct, cefrLevel),
            lastPracticedAt: nowIso,
          };
        }

        const nextState: QuestStoreState = {
          ...state,
          xp: state.xp + awardedXp,
          gems: state.gems + (accuracy >= 90 ? 5 : 2),
          streak: updateStreakForActivity(state.streak, todayKey),
          studyMinutesByDate: {
            ...state.studyMinutesByDate,
            [todayKey]: (state.studyMinutesByDate[todayKey] ?? 0) + minutesDelta,
          },
          xpTransactions: [
            ...state.xpTransactions,
            {
              id: `xp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              idempotencyKey,
              amount: awardedXp,
              source: 'lesson',
              referenceId: lessonId,
              createdAt: nowIso,
            },
          ],
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              lessonId,
              unitId,
              status: accuracy >= 90 ? 'mastered' : 'completed',
              bestAccuracy: Math.max(prevLesson?.bestAccuracy ?? 0, accuracy),
              attempts: (prevLesson?.attempts ?? 0) + 1,
              xpEarned: (prevLesson?.xpEarned ?? 0) + awardedXp,
              lastCompletedAt: nowIso,
            },
          },
          inProgressLesson: null,
          skillStats: nextSkillStats,
        };

        nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
        set(nextState);

        return { awardedXp, duplicateIgnored: false };
      },

      claimTreasureChest: (unitId, gemsReward, xpReward) => {
        const state = get();
        const key = `chest-${unitId}`;
        if (state.claimedChests.includes(unitId) || state.xpTransactions.some((t) => t.idempotencyKey === key)) {
          return false;
        }
        const todayKey = toLocalDateKey();
        const nowIso = new Date().toISOString();
        const nextState: QuestStoreState = {
          ...state,
          xp: state.xp + xpReward,
          gems: state.gems + gemsReward,
          claimedChests: [...state.claimedChests, unitId],
          streak: updateStreakForActivity(state.streak, todayKey),
          xpTransactions: [
            ...state.xpTransactions,
            {
              id: `xp-${Date.now()}`,
              idempotencyKey: key,
              amount: xpReward,
              source: 'chest',
              referenceId: unitId,
              createdAt: nowIso,
            },
          ],
        };
        nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
        set(nextState);
        return true;
      },

      awardActivityXp: ({
        idempotencyKey,
        amount,
        source,
        referenceId,
        skill,
        minutes = 2,
        correctDelta = 0,
        attemptsDelta = 0,
      }) => {
        const state = get();
        if (state.xpTransactions.some((t) => t.idempotencyKey === idempotencyKey)) {
          return false;
        }
        const todayKey = toLocalDateKey();
        const nowIso = new Date().toISOString();
        const nextSkillStats = { ...state.skillStats };
        if (skill) {
          const cur = nextSkillStats[skill];
          const attempts = cur.attempts + attemptsDelta;
          const correct = cur.correct + correctDelta;
          nextSkillStats[skill] = {
            ...cur,
            attempts,
            correct,
            minutesPracticed: cur.minutesPracticed + minutes,
            estimatedCefr: estimateSkillCEFR(attempts, correct, cur.estimatedCefr),
            lastPracticedAt: nowIso,
          };
        }

        const nextState: QuestStoreState = {
          ...state,
          xp: state.xp + amount,
          streak: updateStreakForActivity(state.streak, todayKey),
          studyMinutesByDate: {
            ...state.studyMinutesByDate,
            [todayKey]: (state.studyMinutesByDate[todayKey] ?? 0) + minutes,
          },
          xpTransactions: [
            ...state.xpTransactions,
            {
              id: `xp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              idempotencyKey,
              amount,
              source,
              referenceId,
              createdAt: nowIso,
            },
          ],
          skillStats: nextSkillStats,
        };
        nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
        set(nextState);
        return true;
      },

      recordMistake: (mistake) => {
        set((state) => {
          const existing = state.mistakes.find(
            (m) => !m.resolved && m.prompt === mistake.prompt && m.expectedAnswer === mistake.expectedAnswer
          );
          if (existing) {
            return {
              mistakes: state.mistakes.map((m) =>
                m.id === existing.id ? { ...m, userAnswer: mistake.userAnswer, retryCount: m.retryCount + 1 } : m
              ),
            };
          }
          const created: Mistake = {
            ...mistake,
            id: `mst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            createdAt: new Date().toISOString(),
            resolved: false,
            retryCount: 0,
          };
          return { mistakes: [created, ...state.mistakes].slice(0, 100) };
        });
      },

      resolveMistake: (mistakeId) => {
        set((state) => {
          const nextState: QuestStoreState = {
            ...state,
            mistakes: state.mistakes.map((m) =>
              m.id === mistakeId ? { ...m, resolved: true, retryCount: m.retryCount + 1 } : m
            ),
          };
          nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
          return nextState;
        });
      },

      saveWordToVocabulary: (wordInput) => {
        const state = get();
        const existingSeed = [...SEED_VOCABULARY, ...state.customVocabulary].find(
          (w) => w.word.toLowerCase() === wordInput.word.toLowerCase()
        );
        if (existingSeed) {
          return existingSeed.id;
        }
        const id = wordInput.id ?? `voc-user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newWord: Vocabulary = {
          ...wordInput,
          id,
          isUserSaved: true,
        };
        const nowIso = new Date().toISOString();
        set({
          customVocabulary: [newWord, ...state.customVocabulary],
          vocabularySchedules: {
            ...state.vocabularySchedules,
            [id]: {
              vocabularyId: id,
              easeFactor: 2.5,
              intervalDays: 0,
              repetitions: 0,
              nextReviewDate: nowIso,
              masteryLevel: 0,
            },
          },
        });
        return id;
      },

      reviewVocabularySM2: (vocabularyId, quality) => {
        const state = get();
        const nowIso = new Date().toISOString();
        const todayKey = toLocalDateKey();
        const current = state.vocabularySchedules[vocabularyId] ?? {
          vocabularyId,
          easeFactor: 2.5,
          intervalDays: 0,
          repetitions: 0,
          nextReviewDate: nowIso,
          masteryLevel: 0,
        };
        const updated = calculateSM2Review(current, quality, nowIso);
        const nextState: QuestStoreState = {
          ...state,
          vocabularySchedules: {
            ...state.vocabularySchedules,
            [vocabularyId]: updated,
          },
          vocabReviewsByDate: {
            ...state.vocabReviewsByDate,
            [todayKey]: (state.vocabReviewsByDate[todayKey] ?? 0) + 1,
          },
        };
        nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
        set(nextState);
      },

      recordListeningSession: (record) => {
        set((state) => {
          const nextState: QuestStoreState = {
            ...state,
            listeningHistory: [
              {
                ...record,
                id: `lis-${Date.now()}`,
                completedAt: new Date().toISOString(),
              },
              ...state.listeningHistory,
            ].slice(0, 50),
          };
          nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
          return nextState;
        });
      },

      recordReadingSession: (record) => {
        set((state) => {
          const nextState: QuestStoreState = {
            ...state,
            readingHistory: [
              {
                ...record,
                id: `read-${Date.now()}`,
                completedAt: new Date().toISOString(),
              },
              ...state.readingHistory,
            ].slice(0, 50),
          };
          nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
          return nextState;
        });
      },

      recordSpeakingSession: (record) => {
        set((state) => {
          const nextState: QuestStoreState = {
            ...state,
            speakingSessions: [
              {
                ...record,
                id: `spk-${Date.now()}`,
                completedAt: new Date().toISOString(),
              },
              ...state.speakingSessions,
            ].slice(0, 50),
          };
          nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
          return nextState;
        });
      },

      saveWritingDraft: (promptId, text) => {
        set((state) => ({
          writingDrafts: {
            ...state.writingDrafts,
            [promptId]: { text, updatedAt: new Date().toISOString() },
          },
        }));
      },

      submitWriting: (submission) => {
        set((state) => {
          const nextState: QuestStoreState = {
            ...state,
            writingSubmissions: [
              {
                ...submission,
                id: `wrt-${Date.now()}`,
                submittedAt: new Date().toISOString(),
              },
              ...state.writingSubmissions,
            ].slice(0, 50),
          };
          nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
          return nextState;
        });
      },

      recordGrammarQuizPass: (topicId) => {
        set((state) => ({
          grammarQuizPassedIds: state.grammarQuizPassedIds.includes(topicId)
            ? state.grammarQuizPassedIds
            : [...state.grammarQuizPassedIds, topicId],
        }));
      },

      toggleContentBookmark: (contentId) => {
        set((state) => {
          const current = state.bookmarkedContentIds ?? [];
          return {
            bookmarkedContentIds: current.includes(contentId)
              ? current.filter((id) => id !== contentId)
              : [...current, contentId],
          };
        });
      },

      markAcademyCompleted: (contentId) => {
        set((state) => {
          const current = state.completedAcademyIds ?? [];
          return {
            completedAcademyIds: current.includes(contentId) ? current : [...current, contentId],
          };
        });
      },

      recordIeltsSession: (session) => {
        set((state) => ({
          ieltsSessions: [
            {
              ...session,
              id: `ielts-${Date.now()}`,
              completedAt: new Date().toISOString(),
            },
            ...state.ieltsSessions,
          ].slice(0, 50),
        }));
      },

      saveInProgressMockExam: (draft) => {
        set({ inProgressMockExam: draft });
      },

      recordMockExamCompletion: (payload) => {
        const state = get();
        const nowIso = new Date().toISOString();
        const today = toLocalDateKey(new Date(nowIso));
        const result: IELTSMockAttemptResult = {
          ...payload,
          id: `mock-res-${Date.now()}`,
          completedAt: nowIso,
        };
        const idempotencyKey = `mock-complete-${payload.mockId}-${Date.now()}`;
        const awardedXp = 120;
        const mins = Math.max(5, Math.round(payload.durationSeconds / 60));

        const nextState: QuestStoreState = {
          ...state,
          xp: state.xp + awardedXp,
          streak: updateStreakForActivity(state.streak, today),
          studyMinutesByDate: {
            ...state.studyMinutesByDate,
            [today]: (state.studyMinutesByDate[today] ?? 0) + mins,
          },
          xpTransactions: [
            ...state.xpTransactions,
            {
              id: `xp-${Date.now()}`,
              idempotencyKey,
              amount: awardedXp,
              source: 'ielts',
              referenceId: payload.mockId,
              createdAt: nowIso,
            },
          ],
          ieltsSessions: [
            {
              id: `ielts-${Date.now()}`,
              pathway: payload.pathway,
              skill: 'full_mock' as const,
              title: payload.title,
              score: payload.listeningRaw + payload.readingRaw,
              maxScore: payload.listeningMax + payload.readingMax,
              estimatedBand: payload.overallBand,
              isUnofficialEstimate: true as const,
              durationSeconds: payload.durationSeconds,
              completedAt: nowIso,
            },
            ...state.ieltsSessions,
          ].slice(0, 50),
          ieltsMockHistory: [result, ...(state.ieltsMockHistory ?? [])].slice(0, 40),
          inProgressMockExam: null,
          completedAcademyIds: state.completedAcademyIds.includes(payload.mockId)
            ? state.completedAcademyIds
            : [...state.completedAcademyIds, payload.mockId],
        };
        nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
        set(nextState);
        return { result, awardedXp };
      },

      upsertAiMessage: (conversation, message) => {
        set((state) => {
          const nowIso = new Date().toISOString();
          const exists = state.aiConversations.some((c) => c.id === conversation.id);
          const aiConversations = exists
            ? state.aiConversations.map((c) =>
                c.id === conversation.id ? { ...c, updatedAt: nowIso } : c
              )
            : [{ ...conversation, createdAt: nowIso, updatedAt: nowIso }, ...state.aiConversations];

          const prevMsgs = state.aiMessages[conversation.id] ?? [];
          const newMsg: AIMessage = {
            ...message,
            id: `aimsg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            createdAt: nowIso,
          };

          return {
            aiConversations,
            aiMessages: {
              ...state.aiMessages,
              [conversation.id]: [...prevMsgs, newMsg],
            },
          };
        });
      },

      claimQuestReward: (periodKey, questId, rewardXp, rewardGems) => {
        const state = get();
        const claimed = state.questsClaimedByPeriod[periodKey] ?? [];
        const idempotencyKey = `quest-${periodKey}-${questId}`;
        if (claimed.includes(questId) || state.xpTransactions.some((t) => t.idempotencyKey === idempotencyKey)) {
          return false;
        }
        const nowIso = new Date().toISOString();
        const nextState: QuestStoreState = {
          ...state,
          xp: state.xp + rewardXp,
          gems: state.gems + rewardGems,
          questsClaimedByPeriod: {
            ...state.questsClaimedByPeriod,
            [periodKey]: [...claimed, questId],
          },
          xpTransactions: [
            ...state.xpTransactions,
            {
              id: `xp-${Date.now()}`,
              idempotencyKey,
              amount: rewardXp,
              source: 'quest',
              referenceId: questId,
              createdAt: nowIso,
            },
          ],
        };
        nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
        set(nextState);
        return true;
      },

      recordAssessmentAttempt: (attempt) => {
        const state = get();
        const nowIso = new Date().toISOString();
        const today = toLocalDateKey(new Date(nowIso));
        const record: AssessmentAttemptRecord = {
          ...attempt,
          id: `asmt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          completedAt: nowIso,
        };

        const prevUnitRes = attempt.unitId ? state.unitAssessmentResults?.[attempt.unitId] : undefined;
        const updatedUnitResults: Record<string, AssessmentAttemptRecord> = {
          ...(state.unitAssessmentResults ?? {}),
          ...(attempt.unitId
            ? {
                [attempt.unitId]:
                  prevUnitRes && prevUnitRes.passed && prevUnitRes.accuracyPercent > record.accuracyPercent
                    ? prevUnitRes
                    : prevUnitRes && prevUnitRes.passed && !record.passed
                      ? prevUnitRes
                      : record,
              }
            : {}),
        };

        // Award balanced XP ONLY on first passing attempt for an assessment (XP never measures CEFR Mastery itself)
        const idempotencyKey = `assessment-pass-${attempt.assessmentId}`;
        const alreadyRewarded = state.xpTransactions.some((t) => t.idempotencyKey === idempotencyKey);
        const xpByKind =
          attempt.kind === 'level_completion' ? 80 : attempt.kind === 'unit_mastery' ? 40 : 30;
        const awardedXp = attempt.passed && !alreadyRewarded ? xpByKind : 0;

        const nextTransactions =
          awardedXp > 0
            ? [
                ...state.xpTransactions,
                {
                  id: `xp-${Date.now()}`,
                  idempotencyKey,
                  amount: awardedXp,
                  source: 'assessment' as const,
                  referenceId: attempt.assessmentId,
                  createdAt: nowIso,
                },
              ]
            : state.xpTransactions;

        const nextMinutes = Math.max(1, Math.round(attempt.durationSeconds / 60));
        const cefrRank: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
        let nextRecommendedCefr = state.recommendedCefr;
        if (attempt.kind === 'level_completion' && attempt.passed) {
          const levelOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
          const passedIdx = levelOrder.indexOf(attempt.cefrLevel);
          const nextTier = levelOrder[Math.min(levelOrder.length - 1, passedIdx + 1)];
          if (cefrRank[nextTier] > cefrRank[nextRecommendedCefr]) {
            nextRecommendedCefr = nextTier;
          }
        }

        const nextCompletedAcademyIds =
          attempt.passed && !state.completedAcademyIds?.includes(attempt.assessmentId)
            ? [...(state.completedAcademyIds ?? []), attempt.assessmentId]
            : state.completedAcademyIds ?? [];

        const nextState: QuestStoreState = {
          ...state,
          xp: state.xp + awardedXp,
          streak: updateStreakForActivity(state.streak, today),
          studyMinutesByDate: {
            ...state.studyMinutesByDate,
            [today]: (state.studyMinutesByDate[today] ?? 0) + nextMinutes,
          },
          recommendedCefr: nextRecommendedCefr,
          unitAssessmentResults: updatedUnitResults,
          assessmentHistory: [record, ...(state.assessmentHistory ?? [])].slice(0, 100),
          xpTransactions: nextTransactions,
          completedAcademyIds: nextCompletedAcademyIds,
        };
        nextState.achievementsUnlocked = evaluateUnlockedAchievements(nextState);
        set(nextState);
        return { awardedXp, record };
      },

      unlockUnitForIndependentPractice: (unitId) => {
        set((state) => {
          const current = state.unlockedUnitOverrides ?? [];
          if (current.includes(unitId)) return state;
          return { unlockedUnitOverrides: [...current, unitId] };
        });
      },

      setRecommendedCefr: (level) => {
        set({ recommendedCefr: level });
      },

      exportBackupJson: () => {
        const state = get();
        return JSON.stringify(
          {
            schema: 'english-quest-backup-v1',
            exportedAt: new Date().toISOString(),
            data: {
              hasCompletedOnboarding: state.hasCompletedOnboarding,
              placementStatus: state.placementStatus,
              recommendedCefr: state.recommendedCefr,
              displayName: state.displayName,
              preferences: state.preferences,
              ieltsPathway: state.ieltsPathway,
              xp: state.xp,
              gems: state.gems,
              streak: state.streak,
              xpTransactions: state.xpTransactions,
              studyMinutesByDate: state.studyMinutesByDate,
              lessonProgress: state.lessonProgress,
              claimedChests: state.claimedChests,
              skillStats: state.skillStats,
              customVocabulary: state.customVocabulary,
              vocabularySchedules: state.vocabularySchedules,
              mistakes: state.mistakes,
              speakingSessions: state.speakingSessions,
              listeningHistory: state.listeningHistory,
              readingHistory: state.readingHistory,
              writingDrafts: state.writingDrafts,
              writingSubmissions: state.writingSubmissions,
              ieltsSessions: state.ieltsSessions,
              ieltsMockHistory: state.ieltsMockHistory ?? [],
              unitAssessmentResults: state.unitAssessmentResults ?? {},
              assessmentHistory: state.assessmentHistory ?? [],
              unlockedUnitOverrides: state.unlockedUnitOverrides ?? [],
              grammarQuizPassedIds: state.grammarQuizPassedIds,
              bookmarkedContentIds: state.bookmarkedContentIds ?? [],
              completedAcademyIds: state.completedAcademyIds ?? [],
              achievementsUnlocked: state.achievementsUnlocked,
            },
          },
          null,
          2
        );
      },

      importBackupJson: (rawJson) => {
        try {
          const parsed = JSON.parse(rawJson) as { schema?: string; data?: Partial<QuestStoreState> };
          if (parsed?.schema !== 'english-quest-backup-v1' || !parsed.data) {
            return { ok: false, error: 'Unsupported backup format.' };
          }
          set((state) => ({
            ...state,
            ...parsed.data,
          }));
          return { ok: true };
        } catch {
          return { ok: false, error: 'Invalid JSON file.' };
        }
      },

      buildAccountMigrationPayload: () => {
        const state = get();
        return {
          clientVersion: '1.0.0',
          exportedAt: new Date().toISOString(),
          preferences: state.preferences,
          lessonProgress: state.lessonProgress,
          xpTransactions: state.xpTransactions,
          streak: state.streak,
          vocabularySchedules: state.vocabularySchedules,
          mistakes: state.mistakes,
          speakingSessions: state.speakingSessions,
          writingSubmissions: state.writingSubmissions,
          ieltsSessions: state.ieltsSessions,
        };
      },

      resetAllProgress: () => {
        set(createInitialDataState());
      },
    }),
    {
      name: 'english-quest-state-v1',
      version: 1,
    }
  )
);

export function getCombinedVocabulary(customVocabulary: Vocabulary[], schedules: Record<string, ReviewSchedule>): UserVocabulary[] {
  const all = [...customVocabulary, ...SEED_VOCABULARY];
  const nowIso = new Date().toISOString();
  return all.map((v) => ({
    ...v,
    schedule: schedules[v.id] ?? {
      vocabularyId: v.id,
      easeFactor: 2.5,
      intervalDays: 0,
      repetitions: 0,
      nextReviewDate: nowIso,
      masteryLevel: 0,
    },
    savedAt: nowIso,
  }));
}
