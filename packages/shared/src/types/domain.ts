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
  prerequisites?: string[];
  prerequisiteUnitIds?: string[];
  masteryAssessmentId?: string;
  targetVocabIds?: string[];
  targetGrammarIds?: string[];
  linkedListeningIds?: string[];
  linkedSpeakingIds?: string[];
  linkedReadingIds?: string[];
  linkedWritingIds?: string[];
  linkedConversationIds?: string[];
  linkedPronunciationIds?: string[];
  sourceTier?: 'phase1' | 'milestone3';
}

export interface ReusedExerciseReference {
  id: string;
  sourcePack: 'exercise_bank' | 'listening' | 'reading' | 'writing' | 'pronunciation';
  label: string;
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
  primarySkill?: SkillTag | 'pronunciation' | 'review' | 'assessment';
  instructionalOverview?: string;
  instructionalOverviewVi?: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  targetVocabIds?: string[];
  targetGrammarIds?: string[];
  contextualExamples?: Array<{ english: string; vietnamese?: string; note?: string }>;
  guidedPracticeNote?: string;
  practicalApplication?: {
    summary: string;
    route?: string;
    label?: string;
    linkedAcademyId?: string;
  };
  lessonSummary?: string;
  topicTags?: string[];
  assessmentCriteria?: string[];
  reviewRecommendations?: string[];
  reusedExerciseRefs?: ReusedExerciseReference[];
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

export type LexicalEntryType =
  | 'headword'
  | 'phrasal_verb'
  | 'idiom'
  | 'collocation_entry'
  | 'expression'
  | 'contrastive_pair';

export type KnowledgeRelationType =
  | 'synonym'
  | 'antonym'
  | 'word_family'
  | 'collocation'
  | 'phrasal_verb'
  | 'idiom'
  | 'confused_with'
  | 'formal_equivalent'
  | 'informal_equivalent';

export interface LexicalKnowledgeLink {
  targetId: string;
  targetWord: string;
  relation: KnowledgeRelationType;
  note?: string;
}

export interface Vocabulary {
  id: string;
  word: string;
  lemma?: string;
  partOfSpeech: string;
  ipa: string;
  ipaUk?: string;
  ipaUs?: string;
  stressPattern?: string;
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
  grammaticalPatterns?: string[];
  register?: 'formal' | 'neutral' | 'informal' | 'academic' | 'technical' | 'spoken' | 'literary';
  usageRestrictions?: string;
  commonMistakes?: string[];
  usageNote?: string;
  topics?: string[];
  senseId?: string;
  senseLabel?: string;
  senseCefr?: CEFRLevel;
  sourceMetadata?: string;
  sourceLicense?: string;
  editorialStatus?: 'imported' | 'authored' | 'reviewed';
  lexicalType?: LexicalEntryType;
  wordFrequencyRank?: number;
  wordFamilyGroupId?: string;
  separability?: 'separable' | 'inseparable' | 'always_separated' | 'non_applicable';
  transitivity?: 'transitive' | 'intransitive' | 'both' | 'non_applicable';
  knowledgeLinks?: LexicalKnowledgeLink[];
  cefrLevel: CEFRLevel;
  category: string;
  isUserSaved?: boolean;
}

export interface WordFamilyGroup {
  id: string;
  rootWord: string;
  coreMeaning: string;
  coreMeaningVi: string;
  cefrRange: [CEFRLevel, CEFRLevel];
  members: Array<{
    vocabularyId?: string;
    word: string;
    partOfSpeech: string;
    ipaUk: string;
    ipaUs: string;
    stressNote: string;
    meaning: string;
    example: string;
    grammaticalPattern: string;
  }>;
  morphologyNotes: string[];
  commonMistakes: Array<{ wrong: string; right: string; why: string }>;
  exercises: Exercise[];
}

export interface CollocationEntry {
  id: string;
  phrase: string;
  pattern:
    | 'verb_noun'
    | 'adj_noun'
    | 'noun_noun'
    | 'adv_adj'
    | 'verb_adv'
    | 'adj_prep'
    | 'verb_prep'
    | 'noun_prep';
  domain: 'everyday' | 'academic' | 'business' | 'ielts' | 'technical' | 'spoken';
  cefrLevel: CEFRLevel;
  meaning: string;
  vietnamese: string;
  example: string;
  unnaturalContrast?: { unnatural: string; why: string };
  relatedVocabularyId?: string;
}

export interface ConfusedWordsPair {
  id: string;
  title: string;
  cefrLevel: CEFRLevel;
  words: [string, string, ...string[]];
  distinctions: Array<{
    word: string;
    partOfSpeech: string;
    meaning: string;
    vietnamese: string;
    grammarPattern: string;
    example: string;
  }>;
  vietnameseLearnerPitfall: string;
  exercises: Exercise[];
}

export interface GrammarComparisonItem {
  id: string;
  title: string;
  cefrLevel: CEFRLevel;
  structuresCompared: [string, string, ...string[]];
  coreContrastSummary: string;
  sideBySide: Array<{
    structure: string;
    meaningNuance: string;
    timelineOrRule: string;
    example: string;
  }>;
  decisionGuide: string[];
  exercises: Exercise[];
}

export interface ExpressionFunctionGroup {
  id: string;
  communicativeFunction: string;
  cefrRange: [CEFRLevel, CEFRLevel];
  overview: string;
  tiers: {
    basic: Array<{ phrase: string; register: string; example: string }>;
    intermediate: Array<{ phrase: string; register: string; example: string }>;
    advanced: Array<{ phrase: string; register: string; example: string }>;
  };
  miniDialogue: Array<{ speaker: string; line: string }>;
}

export interface SearchIndexEntry {
  id: string;
  shardId?: 'vocab_core' | 'grammar_core' | 'skills_core' | 'ielts_resources';
  kind:
    | 'vocabulary'
    | 'grammar'
    | 'collection'
    | 'collocation'
    | 'confused_words'
    | 'word_family'
    | 'lesson'
    | 'listening'
    | 'speaking'
    | 'reading'
    | 'writing'
    | 'pronunciation'
    | 'conversation'
    | 'ielts'
    | 'resource';
  title: string;
  lemma?: string;
  subtitle: string;
  vietnamese?: string;
  cefrLevel?: CEFRLevel;
  category?: string;
  register?: string;
  inflectedForms?: string[];
  keywords?: string[];
  tags: string[];
  route: string;
  rankWeight?: number;
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
    | 'ielts_speaking'
    | 'rapid_response'
    | 'debate_defense'
    | 'academic_speaking'
    | 'pronunciation_drill';
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
    | 'ielts'
    | 'biography'
    | 'opinion';
  cefrLevel: CEFRLevel;
  estimatedMinutes: number;
  wordCount?: number;
  readingStrategy?: string;
  summaryPrompt?: string;
  keyTakeaways?: string[];
  relatedVocabIds?: string[];
  relatedGrammarIds?: string[];
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

export type ListeningCategory =
  | 'conversation'
  | 'announcement'
  | 'phone_call'
  | 'interview'
  | 'short_story'
  | 'podcast'
  | 'academic_lecture'
  | 'workplace_discussion'
  | 'academic_presentation'
  | 'news_report'
  | 'scientific_explanation'
  | 'debate'
  | 'ielts_listening'
  | 'minimal_pairs'
  | 'connected_speech';

export interface ListeningContent {
  id: string;
  title: string;
  subtitle?: string;
  category: ListeningCategory;
  cefrLevel: CEFRLevel;
  accent: EnglishAccent;
  durationLabel: string;
  learningObjectives?: string[];
  preListeningPrompt?: string;
  connectedSpeechNotes?: string[];
  summaryText?: string;
  discussionQuestions?: string[];
  relatedVocabIds?: string[];
  relatedGrammarIds?: string[];
  scriptLines: Array<{ speaker: string; text: string }>;
  vocabularyNotes: Array<{ term: string; meaning: string; vietnamese: string }>;
  exercises: Exercise[];
}

export type SpeakingActivityType =
  | 'repetition'
  | 'shadowing'
  | 'picture_description'
  | 'topic_discussion'
  | 'roleplay'
  | 'timed_challenge'
  | 'ielts_speaking'
  | 'rapid_response'
  | 'debate_defense'
  | 'academic_speaking';

export type SpeakingCategory =
  | 'daily_conversation'
  | 'travel_service'
  | 'workplace'
  | 'academic_discussion'
  | 'storytelling'
  | 'opinion_debate'
  | 'ielts_part_1'
  | 'ielts_part_2'
  | 'ielts_part_3'
  | 'social_situations';

export interface SpeakingLesson {
  id: string;
  title: string;
  activityType: SpeakingActivityType;
  category: SpeakingCategory;
  cefrLevel: CEFRLevel;
  prompt: string;
  promptVi?: string;
  objectives: string[];
  preparationQuestions: string[];
  modelText: string;
  modelComparisonByLevel?: Partial<Record<'basic' | 'natural' | 'advanced', string>>;
  alternativeResponses: string[];
  vocabularyBank: Array<{ term: string; meaning: string; vietnamese: string }>;
  naturalExpressions: string[];
  sentenceStructures: Array<{ frame: string; example: string }>;
  suggestedOrganization: string[];
  commonMistakes: Array<{ mistake: string; correction: string; why: string }>;
  followUpQuestions: string[];
  improvementStrategies: string[];
  tips: string[];
  selfChecklist: string[];
  keyVocabulary: string[];
  suggestedSeconds: number;
  scene?: 'cafe' | 'airport' | 'workspace' | 'park';
  roleplayTurns?: Array<{ partner: string; cue: string }>;
  relatedVocabIds?: string[];
  relatedGrammarIds?: string[];
}

export interface SpeakingFrameworkGuide {
  id: string;
  title: string;
  focus: 'mindset' | 'think_in_english' | 'fluency_strategy' | 'self_practice';
  cefrRange: string;
  summary: string;
  steps: Array<{ label: string; detail: string; example: string }>;
}

export type PronunciationCategory =
  | 'vowels'
  | 'diphthongs'
  | 'consonants'
  | 'consonant_clusters'
  | 'word_endings'
  | 'word_stress'
  | 'sentence_stress'
  | 'connected_speech'
  | 'intonation'
  | 'uk_us_differences'
  | 'vietnamese_traps';

export interface PronunciationLesson {
  id: string;
  title: string;
  category: PronunciationCategory;
  cefrLevel: CEFRLevel;
  targetSymbols: string[];
  contrastSymbol?: string;
  articulatoryGuide: string;
  vietnameseLearnerTip: string;
  commonErrors: string[];
  ukUsNote?: string;
  minimalPairs: Array<{
    wordA: string;
    ipaA: string;
    wordB: string;
    ipaB: string;
    differenceNote: string;
  }>;
  practiceWords: Array<{ word: string; ipa: string; stressPattern?: string }>;
  practiceSentences: Array<{ text: string; focusHighlight: string }>;
  listeningExercises: Exercise[];
}

export interface ShadowingSegment {
  id: string;
  speaker?: string;
  text: string;
  focusWords: string[];
  linkingNote: string;
  rhythmBeat?: string;
}

export interface ShadowingSession {
  id: string;
  title: string;
  cefrLevel: CEFRLevel;
  topic: string;
  durationLabel: string;
  recommendedRate: number;
  rhythmOverview: string;
  vietnameseFocusTip: string;
  segments: ShadowingSegment[];
  keyExpressions: Array<{ phrase: string; meaning: string; vietnamese: string }>;
  reflectionChecklist: string[];
}

export interface WritingLesson {
  id: string;
  title: string;
  category:
    | 'sentence_construction'
    | 'grammar_correction'
    | 'sentence_transformation'
    | 'paragraph'
    | 'email'
    | 'story'
    | 'academic_essay'
    | 'argumentative_essay'
    | 'ielts_task_1'
    | 'ielts_task_2'
    | 'report'
    | 'synthesis';
  cefrLevel: CEFRLevel;
  prompt: string;
  instructions: string;
  objectives: string[];
  modelOutline: string[];
  usefulVocabulary: Array<{ term: string; meaning: string; vietnamese: string }>;
  usefulStructures: Array<{ pattern: string; example: string }>;
  minWords: number;
  targetWords: number;
  checklist: string[];
  rubric: Array<{ criterion: string; description: string }>;
  commonMistakes: Array<{ issue: string; fix: string }>;
  sampleResponse: string;
  annotatedModelNotes: string[];
  practiceExercises?: Exercise[];
}

export interface ConversationScenario {
  id: string;
  title: string;
  domain: 'everyday' | 'travel' | 'workplace' | 'social' | 'academic' | 'emergency';
  cefrLevel: CEFRLevel;
  setting: string;
  userRole: string;
  partnerRole: string;
  goal: string;
  keyPhrases: Array<{ phrase: string; meaning: string; register: string; vietnamese: string }>;
  dialogueBranches: Array<{
    step: number;
    partnerSays: string;
    politeOption: string;
    casualOption: string;
    formalOption?: string;
    followUpNote: string;
  }>;
  culturalTip: string;
  commonPitfalls: string[];
}

export interface ThinkInEnglishActivity {
  id: string;
  title: string;
  mode: 'object_naming' | 'daily_narration' | 'circumlocution' | 'rapid_question' | 'problem_solving';
  cefrLevel: CEFRLevel;
  durationSeconds: 15 | 30 | 60 | 120 | 300;
  prompt: string;
  visualFocus?: string;
  antiTranslationTip: string;
  starterFrames: string[];
  sampleMonologue: string;
  circumlocutionTarget?: { targetIdea: string; clues: string[]; sampleParaphrase: string };
}

export interface IntegratedSequence {
  id: string;
  title: string;
  theme: string;
  cefrLevel: CEFRLevel;
  estimatedMinutes: number;
  listeningLessonId: string;
  readingPassageId?: string;
  speakingPrompt: string;
  writingTaskPrompt: string;
  keyVocabIds: string[];
  sequenceSteps: Array<{
    skill: SkillTag;
    title: string;
    instruction: string;
  }>;
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
    | 'mistake_retry'
    | 'assessment';
  referenceId: string;
  createdAt: string;
}

export interface IELTSPracticeSession {
  id: string;
  pathway: IELTSPathway;
  skill: 'listening' | 'reading' | 'writing' | 'speaking' | 'mini_mock' | 'full_mock';
  title: string;
  score: number;
  maxScore: number;
  estimatedBand: number | null;
  isUnofficialEstimate: true;
  durationSeconds: number;
  completedAt: string;
}

export type CefrAssessmentKind =
  | 'placement'
  | 'unit_mastery'
  | 'section_review'
  | 'level_completion'
  | 'skill_diagnostic'
  | 'mixed_review';

export interface StructuredAssessment {
  id: string;
  kind: CefrAssessmentKind;
  cefrLevel: CEFRLevel;
  unitId?: string;
  title: string;
  subtitle: string;
  description: string;
  descriptionVi?: string;
  estimatedMinutes: number;
  passingPercent: number;
  isUnofficialNotice: string;
  skillsAssessed: SkillTag[];
  topicTags: string[];
  exercises: Exercise[];
  productivePrompt?: {
    skill: 'speaking' | 'writing';
    prompt: string;
    promptVi?: string;
    rubricCriteria: Array<{ criterion: string; descriptor: string }>;
    minRequirement: number;
  };
  revisionRecommendations: Array<{
    condition: string;
    recommendation: string;
    route: string;
  }>;
}

export interface AssessmentAttemptRecord {
  id: string;
  assessmentId: string;
  kind: CefrAssessmentKind;
  cefrLevel: CEFRLevel;
  unitId?: string;
  title: string;
  correctCount: number;
  totalObjectiveCount: number;
  accuracyPercent: number;
  passed: boolean;
  skillBreakdown: Partial<Record<SkillTag, { correct: number; total: number }>>;
  productiveResponse?: string;
  productiveSelfCheckDone?: boolean;
  durationSeconds: number;
  completedAt: string;
}

export type IELTSListeningPart = 'part_1' | 'part_2' | 'part_3' | 'part_4';
export type IELTSSpeakingPart = 'part_1' | 'part_2' | 'part_3';
export type IELTSWritingSubtype =
  | 'bar_chart'
  | 'line_graph'
  | 'pie_chart'
  | 'table'
  | 'process'
  | 'map'
  | 'formal_letter'
  | 'semi_formal_letter'
  | 'informal_letter'
  | 'opinion'
  | 'discussion'
  | 'advantages_disadvantages'
  | 'problem_solution'
  | 'two_part';

export interface IELTSListeningActivity {
  id: string;
  part: IELTSListeningPart;
  pathway: 'shared';
  title: string;
  topic: string;
  accent: EnglishAccent;
  cefrTarget: CEFRLevel;
  contextDescription: string;
  wordLimitNote: string;
  scriptLines: Array<{ speaker: string; text: string }>;
  distractorTraps: string[];
  exercises: Exercise[];
}

export interface IELTSSpeakingActivity {
  id: string;
  part: IELTSSpeakingPart;
  title: string;
  topic: string;
  cefrTarget: CEFRLevel;
  activityType?: SpeakingActivityType;
  category?: SpeakingCategory;
  prompt?: string;
  promptVi?: string;
  objectives?: string[];
  preparationQuestions?: string[];
  cueCard?: {
    prompt: string;
    bullets: string[];
    prepSeconds: 60;
    speakSeconds: 120;
  };
  questions: string[];
  followUpProbes?: string[];
  vocabularyCollocations: Array<{ phrase: string; meaning: string; vietnamese: string }>;
  bandModels: {
    band6: string;
    band8: string;
  };
  examinerNotes: string[];
  modelText?: string;
  alternativeResponses?: string[];
  vocabularyBank?: Array<{ term: string; meaning: string; vietnamese: string }>;
  naturalExpressions?: string[];
  sentenceStructures?: Array<{ frame: string; example: string }>;
  suggestedOrganization?: string[];
  commonMistakes?: Array<{ mistake: string; correction: string; why: string }>;
  followUpQuestions?: string[];
  improvementStrategies?: string[];
  tips?: string[];
  selfChecklist?: string[];
  keyVocabulary?: string[];
  suggestedSeconds?: number;
}

export interface IELTSReadingPassage {
  id: string;
  pathway: 'academic' | 'general_training';
  sectionLabel: string;
  title: string;
  topic: string;
  cefrTarget: CEFRLevel;
  paragraphs: Array<{ label: string; text: string }>;
  questionTypesCovered: string[];
  exercises: Exercise[];
}

export interface IELTSVisualSpec {
  type: 'line' | 'bar' | 'pie' | 'table' | 'process' | 'map';
  title: string;
  unitLabel: string;
  categories?: string[];
  series?: Array<{ name: string; values: number[] }>;
  tableRows?: string[][];
  processSteps?: string[];
  mapChanges?: Array<{ zone: string; before: string; after: string }>;
}

export interface IELTSWritingTask {
  id: string;
  taskType: 'task_1_academic' | 'task_1_gt' | 'task_2';
  pathway: 'academic' | 'general_training' | 'shared';
  questionSubtype: IELTSWritingSubtype;
  title: string;
  topic: string;
  cefrTarget: CEFRLevel;
  prompt: string;
  minWords: 150 | 250;
  recommendedMinutes: 20 | 40;
  visualSpec?: IELTSVisualSpec;
  letterContext?: {
    recipientType: string;
    tone: 'formal' | 'semi_formal' | 'informal';
    bulletPoints: string[];
  };
  bandDescriptors: Array<{ criterion: string; targetNote: string }>;
  outlineSteps: string[];
  keyCollocations: Array<{ phrase: string; note: string; vietnamese: string }>;
  band6Model: string;
  band8Model: string;
  commonPitfalls: string[];
  exercises: Exercise[];
}

export interface IELTSIdeaVocabTopic {
  id: string;
  topic: string;
  cefrTarget: CEFRLevel;
  coreArguments: Array<{ thesis: string; support: string; counterPoint: string }>;
  academicCollocations: Array<{
    term: string;
    registerNote: string;
    example: string;
    vietnamese: string;
  }>;
  speakingNaturalExpressions: Array<{
    phrase: string;
    nuance: string;
    example: string;
  }>;
  exercises: Exercise[];
}

export type IELTSStrategyCategory =
  | 'listening'
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'exam_day';

export interface IELTSStrategyLesson {
  id: string;
  category: IELTSStrategyCategory;
  title: string;
  cefrTarget: CEFRLevel;
  skillFocus: string;
  corePrinciple: string;
  stepByStepMethod: string[];
  trapPatterns: Array<{
    trapName: string;
    howItTricks: string;
    counterMove: string;
  }>;
  timingAllocationNote: string;
  exampleBox: {
    snippet: string;
    breakdown: string;
  };
  exercises: Exercise[];
}

export type ProductiveAssessmentStatus = 'unassessed' | 'self_assessed' | 'teacher_assessed';

export interface IELTSMockExamManifest {
  id: string;
  number: number;
  pathway: IELTSPathway;
  examFormat: 'full_exam' | 'practice_mini';
  listeningQuestionTotal: number;
  readingQuestionTotal: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  listeningIds: [string, string, string, string];
  readingIds: [string, string, string];
  writingTask1Id: string;
  writingTask2Id: string;
  speakingPartIds: [string, string, string];
  isUnofficialNotice: string;
}

export interface AssembledIELTSMockExam {
  manifest: IELTSMockExamManifest;
  listeningParts: IELTSListeningActivity[];
  readingPassages: IELTSReadingPassage[];
  writingTask1: IELTSWritingTask;
  writingTask2: IELTSWritingTask;
  speakingParts: IELTSSpeakingActivity[];
}

export interface IELTSMockAttemptDraft {
  mockId: string;
  pathway: IELTSPathway;
  examFormat: 'full_exam' | 'practice_mini';
  currentSection: 'listening' | 'reading' | 'writing' | 'speaking';
  sectionRemainingSeconds: number;
  listeningAnswers: Record<string, string | string[]>;
  readingAnswers: Record<string, string | string[]>;
  writingTask1Draft: string;
  writingTask2Draft: string;
  writingAssessmentStatus: ProductiveAssessmentStatus;
  writingSelfBand: number | null;
  speakingAssessmentStatus: ProductiveAssessmentStatus;
  speakingSelfBand: number | null;
  speakingNotes: string;
  startedAt: string;
  updatedAt: string;
}

export interface IELTSMockAttemptResult {
  id: string;
  mockId: string;
  title: string;
  pathway: IELTSPathway;
  examFormat: 'full_exam' | 'practice_mini';
  listeningRaw: number;
  listeningMax: number;
  listeningBand: number | null;
  readingRaw: number;
  readingMax: number;
  readingBand: number | null;
  writingBand: number | null;
  writingAssessmentStatus: ProductiveAssessmentStatus;
  writingTask1Words: number;
  writingTask2Words: number;
  mechanicalFeedback?: {
    task1MinMet: boolean;
    task2MinMet: boolean;
    paragraphCountT1: number;
    paragraphCountT2: number;
    connectorsCount: number;
    notes: string[];
  };
  speakingBand: number | null;
  speakingAssessmentStatus: ProductiveAssessmentStatus;
  teacherNotes?: string;
  overallBand: number | null;
  durationSeconds: number;
  isUnofficialEstimate: true;
  legacyHeuristicMigrated?: boolean;
  completedAt: string;
}
