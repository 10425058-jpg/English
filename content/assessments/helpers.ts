import type {
  CEFRLevel,
  CefrAssessmentKind,
  Exercise,
  SkillTag,
  StructuredAssessment,
} from '@english-quest/shared';

export const UNOFFICIAL_CEFR_ASSESSMENT_NOTICE =
  'Internal mastery assessment aligned with English Quest CEFR objectives. Scores reflect practice mastery only and do not constitute official CEFR or external exam certification.';

export interface AssessmentSeed {
  id: string;
  kind: CefrAssessmentKind;
  cefrLevel: CEFRLevel;
  unitId?: string;
  title: string;
  subtitle: string;
  description: string;
  descriptionVi: string;
  estimatedMinutes: number;
  passingPercent?: number;
  skillsAssessed: SkillTag[];
  topicTags: string[];
  exercises: Exercise[];
  productivePrompt?: StructuredAssessment['productivePrompt'];
  revisionRecommendations: StructuredAssessment['revisionRecommendations'];
}

/** Creates a structured CEFR assessment (unit mastery, level completion, diagnostic, or mixed review). */
export function createStructuredAssessment(seed: AssessmentSeed): StructuredAssessment {
  return {
    id: seed.id,
    kind: seed.kind,
    cefrLevel: seed.cefrLevel,
    unitId: seed.unitId,
    title: seed.title,
    subtitle: seed.subtitle,
    description: seed.description,
    descriptionVi: seed.descriptionVi,
    estimatedMinutes: seed.estimatedMinutes,
    passingPercent: seed.passingPercent ?? (seed.kind === 'level_completion' ? 75 : 70),
    isUnofficialNotice: UNOFFICIAL_CEFR_ASSESSMENT_NOTICE,
    skillsAssessed: seed.skillsAssessed,
    topicTags: seed.topicTags,
    exercises: seed.exercises,
    productivePrompt: seed.productivePrompt,
    revisionRecommendations: seed.revisionRecommendations,
  };
}
