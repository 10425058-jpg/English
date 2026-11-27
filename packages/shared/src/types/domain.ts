export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type SkillTag =
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing';

export type EnglishAccent = 'en-US' | 'en-GB';

export type DailyGoalMinutes = 5 | 15 | 30 | 60 | 90;

export type LearningPurpose =
  | 'everyday'
  | 'travel'
  | 'career'
  | 'academic'
  | 'ielts'
  | 'confidence';

export type ExerciseType =
  | 'multiple_choice'
  | 'multiple_response'
  | 'fill_blank'
  | 'word_matching'
  | 'definition_matching'
  | 'sentence_reconstruction'
  | 'sentence_ordering'
  | 'sentence_transformation'
  | 'translation'
  | 'error_identification'
  | 'error_correction'
  | 'audio_recognition'
  | 'dictation'
  | 'pronunciation_discrimination'
  | 'speaking'
  | 'reading_comprehension'
  | 'free_writing'
  | 'dialogue_completion'
  | 'vocabulary_recognition'
  | 'vocabulary_recall'
  | 'collocation_selection'
  | 'grammar_challenge'
  | 'grammar_application'
  | 'scenario_conversation';

export type LessonNodeType =
  | 'lesson'
  | 'chest'
  | 'checkpoint'
  | 'review'
  | 'challenge';

export type NodeState = 'locked' | 'available' | 'completed' | 'mastered';

export type IELTSPathway = 'academic' | 'general_training';

export type AITutorMode =
  | 'free_conversation'
  | 'grammar_teacher'
  | 'vocabulary_coach'
  | 'pronunciation_coach'
  | 'writing_assistant'
  | 'ielts_examiner'
  | 'debate_partner'
  | 'think_in_english'
  | 'explain_mistakes';

export interface User {
  id: string;
  mode: 'guest' | 'authenticated';
  displayName: string;
  email?: string;
  avatarMascotMood: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  nativeLanguage: string;
  selfAssessedLevel: CEFRLevel;
  purpose: LearningPurpose;
  targetCefr: CEFRLevel;
  ieltsTargetBand: number;
  dailyGoalMinutes: DailyGoalMinutes;
  preferredAccent: EnglishAccent;
  prioritySkills: SkillTag[];
  bilingualExplanations: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
  heartsEnabled: boolean;
  speechRate: number;
  audioConsentGranted: boolean;
  retainAudioRecordings: boolean;
}

export interface LearningGoal {
  id: string;
  userId: string;
  dailyMinutes: DailyGoalMinutes;
  targetCefr: CEFRLevel;
  targetIeltsBand?: number;
  prioritySkills: SkillTag[];
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  targetLanguage: 'en';
  cefrRange: [CEFRLevel, CEFRLevel];
  isPublished: boolean;
}

export interface Section {
  id: string;
  courseId: string;
  cefrLevel: CEFRLevel;
  title: string;
  subtitle: string;
  orderIndex: number;
  status: 'active' | 'upcoming';
  accentColor: string;
}

export interface Unit {
  id: string;
  sectionId: string;
  cefrLevel: CEFRLevel;
  orderIndex: number;
  title: string;
  description: string;
  themeColor: string;
  guideSummary: string;
  keyGrammar: string[];
  keyVocabulary: string[];
  chestRewardGems: number;
  chestRewardXp: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  unitId: string;
  orderIndex: number;
  title: string;
  subtitle: string;
  nodeType: LessonNodeType;
  cefrLevel: CEFRLevel;
  skills: SkillTag[];
  xpReward: number;
  estimatedMinutes: number;
  exercises: Exercise[];
  learningObjectives?: string[];
  prerequisites?: string[];
  topicTags?: string[];
  assessmentCriteria?: string[];
  reviewRecommendations?: string[];
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  instruction: string;
  prompt: string;
  promptTranslationVi?: string;
  passage?: string;
  audioText?: string;
  dialogueContext?: Array<{ speaker: string; line: string }>;
  options?: string[];
  pairs?: MatchingPair[];
  wordBank?: string[];
  correctAnswer: string | string[];
  acceptableAnswers?: string[];
  minWords?: number;
  requiredKeywords?: string[];
  hint?: string;
  explanation: string;
  explanationVi?: string;
  difficulty: 1 | 2 | 3;
  skills: SkillTag[];
  xpReward: number;
  relatedKnowledgeId?: string;
  reviewRecommendation?: string;
}

export interface ExerciseAttempt {
  id: string;
  userId: string;
  exerciseId: string;
  lessonId: string;
  userAnswer: string;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  unitId: string;
  status: 'available' | 'completed' | 'mastered';
  bestAccuracy: number;
  attempts: number;
  xpEarned: number;
  lastCompletedAt: string;
}

export interface SkillProgress {
  skill: SkillTag;
  attempts: number;
  correct: number;
  minutesPracticed: number;
  estimatedCefr: CEFRLevel;
  lastPracticedAt?: string;
}

export interface Vocabulary {
  id: string;
  word: string;
  partOfSpeech: string;
  ipa: string;
  ipaUk?: string;
  ipaUs?: string;
  definition: string;
  detailedDefinition?: string;
  vietnameseTranslation: string;
  exampleSentence: string;
  exampleTranslationVi?: string;
  examples?: Array<{ english: string; vietnamese?: string }>;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  wordFamily: string[];
  inflectedForms?: string[];
  register?: 'formal' | 'neutral' | 'informal' | 'academic' | 'technical' | 'spoken' | 'literary';
  commonMistakes?: string[];
  usageNote?: string;
  topics?: string[];
  senseLabel?: string;
  sourceMetadata?: string;
  cefrLevel: CEFRLevel;
  category: string;
  isUserSaved?: boolean;
}

export interface ReviewSchedule {
  vocabularyId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewedAt?: string;
  masteryLevel: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface UserVocabulary extends Vocabulary {
  schedule: ReviewSchedule;
  savedAt: string;
}

export interface GrammarTopic {
  id: string;
  cefrLevel: CEFRLevel;
  title: string;
  summary: string;
  summaryVi: string;
  objectives?: string[];
  detailedExplanation?: string;
  structures: Array<{ label: string; formula: string; example: string }>;
  usageRules?: string[];
  exceptions?: string[];
  examples?: Array<{ english: string; vietnamese?: string; note?: string }>;
  commonMistakes: Array<{ wrong: string; right: string; why: string }>;
  comparisons?: Array<{ structure: string; difference: string; example: string }>;
  speakingTip: string;
  writingTip: string;
  reviewSummary?: string;
  quiz: Exercise[];
}

export interface ThematicCollection {
  id: string;
  title: string;
  domain: 'everyday' | 'academic' | 'professional' | 'ielts_advanced';
  cefrLevels: CEFRLevel[];
  description: string;
  vocabularyIds: string[];
  commonExpressions: Array<{ expression: string; meaning: string; example: string }>;
  collocationGroups: Array<{ label: string; items: string[] }>;
  speakingApplications: string[];
  writingApplications: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  description: string;
  skills: SkillTag[];
  cefrLevels: CEFRLevel[];
  subject: string;
  learningObjectives: string[];
  pricing: 'free' | 'freemium' | 'paid';
  licenseInfo: string;
  recommendedStudyMethod: string;
  lastVerifiedDate: string;
}

export interface CurriculumMatrixEntry {
  cefrLevel: CEFRLevel;
  title: string;
  canDoStatements: string[];
  vocabularyTarget: number;
  grammarTarget: number;
  listeningTarget: number;
  speakingTarget: number;
  readingTarget: number;
  writingTarget: number;
  keyGrammarThemes: string[];
  keyVocabularyDomains: string[];
  milestoneAssessmentTypes: string[];
}

export interface Mistake {
  id: string;
  source: 'lesson' | 'listening' | 'reading' | 'grammar' | 'writing';
  skill: SkillTag;
  cefrLevel: CEFRLevel;
  prompt: string;
  userAnswer: string;
  expectedAnswer: string;
  explanation: string;
  explanationVi?: string;
  createdAt: string;
  resolved: boolean;
  retryCount: number;
}

export interface SpeakingSession {
  id: string;
  promptId: string;
  activityType:
    | 'repetition'
    | 'shadowing'
    | 'picture_description'
    | 'topic_discussion'
    | 'roleplay'
    | 'timed_challenge'
    | 'ielts_speaking';
  cefrLevel: CEFRLevel;
  durationSeconds: number;
  transcript?: string;
  assessmentKind: 'self_review' | 'browser_stt_estimate';
  selfChecklistCompleted: string[];
  completedAt: string;
}

export interface WritingSubmission {
  id: string;
  promptId: string;
  title: string;
  category: string;
  cefrLevel: CEFRLevel;
  originalText: string;
  wordCount: number;
  durationSeconds: number;
  submittedAt: string;
  feedback: {
    analysisKind: 'local_heuristic_unofficial';
    strengths: string[];
    grammarNotes: Array<{ excerpt: string; suggestion: string; explanation: string }>;
    vocabularySuggestions: string[];
    improvements: string[];
    estimatedPracticeIndicator?: string;
    sampleResponse?: string;
  };
}

export interface ReadingPassage {
  id: string;
  title: string;
  category:
    | 'everyday'
    | 'short_story'
    | 'science'
    | 'technology'
    | 'business'
    | 'culture'
    | 'history'
    | 'academic'
    | 'ielts';
  cefrLevel: CEFRLevel;
  estimatedMinutes: number;
  paragraphs: string[];
  glossary: Array<{
    word: string;
    ipa: string;
    partOfSpeech: string;
    definition: string;
    vietnamese: string;
    example: string;
  }>;
  questions: Array<
    Exercise & {
      questionStyle:
        | 'multiple_choice'
        | 'true_false_not_given'
        | 'matching_headings'
        | 'sentence_completion'
        | 'main_idea'
        | 'inference'
        | 'summary_completion';
    }
  >;
}

export interface ListeningContent {
  id: string;
  title: string;
  category:
    | 'conversation'
    | 'short_story'
    | 'academic_lecture'
    | 'podcast'
    | 'minimal_pairs'
    | 'ielts_listening';
  cefrLevel: CEFRLevel;
  accent: EnglishAccent;
  durationLabel: string;
  scriptLines: Array<{ speaker: string; text: string }>;
  vocabularyNotes: Array<{ term: string; meaning: string; vietnamese: string }>;
  exercises: Exercise[];
}

export interface AIConversation {
  id: string;
  mode: AITutorMode;
  title: string;
  bilingual: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'tutor';
  content: string;
  structured?: {
    correctedText?: string;
    naturalAlternative?: string;
    explanation?: string;
    explanationVi?: string;
    followUpQuestion?: string;
    savedVocabularyTip?: string;
  };
  providerMode: 'local_rule_based' | 'server_llm';
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  targetValue: number;
  metric:
    | 'lessons_completed'
    | 'xp_total'
    | 'streak_days'
    | 'vocab_mastered'
    | 'listening_completed'
    | 'speaking_completed'
    | 'reading_completed'
    | 'writing_completed'
    | 'mistakes_resolved'
    | 'units_completed';
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  period: 'daily' | 'weekly';
  metric:
    | 'xp_today'
    | 'lessons_today'
    | 'vocab_reviewed_today'
    | 'skills_practiced_today'
    | 'study_minutes_today'
    | 'lessons_this_week';
  target: number;
  rewardXp: number;
  rewardGems: number;
}

export interface Streak {
  currentDays: number;
  longestDays: number;
  lastActiveDate: string | null;
  activeDates: string[];
}

export interface XPTransaction {
  id: string;
  idempotencyKey: string;
  amount: number;
  source:
    | 'lesson'
    | 'chest'
    | 'quest'
    | 'listening'
    | 'speaking'
    | 'reading'
    | 'writing'
    | 'vocabulary'
    | 'grammar'
    | 'ielts'
    | 'mistake_retry';
  referenceId: string;
  createdAt: string;
}

export interface IELTSPracticeSession {
  id: string;
  pathway: IELTSPathway;
  skill: 'listening' | 'reading' | 'writing' | 'speaking' | 'mini_mock';
  title: string;
  score: number;
  maxScore: number;
  estimatedBand: number;
  isUnofficialEstimate: true;
  durationSeconds: number;
  completedAt: string;
}
