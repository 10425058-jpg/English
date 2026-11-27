import type { CEFRLevel, Course, Section, Unit } from '@english-quest/shared';
import { A1_UNITS } from './a1';
import { A2_UNITS } from './a2';
import { B1_UNITS } from './b1';

export const ENGLISH_QUEST_COURSE: Course = {
  id: 'course-english-quest',
  title: 'English Quest Core Path',
  description: 'Structured CEFR A1–C2 communicative English curriculum across all four skills.',
  targetLanguage: 'en',
  cefrRange: ['A1', 'C2'],
  isPublished: true,
};

export const CURRICULUM_SECTIONS: Section[] = [
  {
    id: 'sec-a1',
    courseId: ENGLISH_QUEST_COURSE.id,
    cefrLevel: 'A1',
    title: 'A1 — Beginner Foundations',
    subtitle: 'Everyday greetings, routines, cafés, and navigating your neighborhood.',
    orderIndex: 1,
    status: 'active',
    accentColor: '#58CC02',
  },
  {
    id: 'sec-a2',
    courseId: ENGLISH_QUEST_COURSE.id,
    cefrLevel: 'A2',
    title: 'A2 — Elementary Explorer',
    subtitle: 'Past stories, airports & future travel plans, comparisons, and daily emails.',
    orderIndex: 2,
    status: 'active',
    accentColor: '#1CB0F6',
  },
  {
    id: 'sec-b1',
    courseId: ENGLISH_QUEST_COURSE.id,
    cefrLevel: 'B1',
    title: 'B1 — Intermediate Builder',
    subtitle: 'Life milestones, conditionals & opinions, passive voice, and workplace fluency.',
    orderIndex: 3,
    status: 'active',
    accentColor: '#CE82FF',
  },
  {
    id: 'sec-b2',
    courseId: ENGLISH_QUEST_COURSE.id,
    cefrLevel: 'B2',
    title: 'B2 — Upper Intermediate',
    subtitle: 'Upcoming in Phase 4: nuanced persuasion, academic argumentation, and idioms.',
    orderIndex: 4,
    status: 'upcoming',
    accentColor: '#FFC800',
  },
  {
    id: 'sec-c1',
    courseId: ENGLISH_QUEST_COURSE.id,
    cefrLevel: 'C1',
    title: 'C1 — Advanced Mastery',
    subtitle: 'Upcoming in Phase 4: executive briefings, rhetoric, and complex inference.',
    orderIndex: 5,
    status: 'upcoming',
    accentColor: '#46A302',
  },
  {
    id: 'sec-c2',
    courseId: ENGLISH_QUEST_COURSE.id,
    cefrLevel: 'C2',
    title: 'C2 — Proficiency',
    subtitle: 'Upcoming in Phase 4: near-native nuance, literary analysis, and precision.',
    orderIndex: 6,
    status: 'upcoming',
    accentColor: '#FF4B4B',
  },
];

export const ALL_UNITS: Unit[] = [...A1_UNITS, ...A2_UNITS, ...B1_UNITS];

export const UPCOMING_CEFR_PREVIEWS: Array<{
  cefrLevel: CEFRLevel;
  title: string;
  plannedUnits: string[];
}> = [
  {
    cefrLevel: 'B2',
    title: 'B2 — Upper Intermediate (Phase 4 Roadmap)',
    plannedUnits: [
      'Unit 13: Persuasive Presentations & Mixed Conditionals',
      'Unit 14: Media Literacy, Bias & Inversion',
      'Unit 15: Research Synthesis & Hedging Language',
      'Unit 16: Negotiation, Diplomacy & Idiomatic Fluency',
    ],
  },
  {
    cefrLevel: 'C1',
    title: 'C1 — Advanced (Phase 4 Roadmap)',
    plannedUnits: [
      'Unit 17: Academic Rhetoric & Cleft Sentences',
      'Unit 18: Cross-Cultural Leadership & Register Shifts',
      'Unit 19: Policy Debates & Subtle Inference',
      'Unit 20: C1 Capstone Portfolio',
    ],
  },
  {
    cefrLevel: 'C2',
    title: 'C2 — Proficiency (Phase 4 Roadmap)',
    plannedUnits: [
      'Unit 21: Literary Style, Irony & Nuance',
      'Unit 22: Precision Editing & High-Stakes Debate',
      'Unit 23: Global Lectures & Simultaneous Note Synthesis',
      'Unit 24: C2 Mastery Review',
    ],
  },
];
