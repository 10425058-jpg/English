import type { IELTSPathway } from '@english-quest/shared';

export interface IELTSSpeakingCue {
  id: string;
  part: 'Part 1' | 'Part 2' | 'Part 3';
  topic: string;
  questions: string[];
  cueCardBullets?: string[];
  prepSeconds: number;
  speakSeconds: number;
  bandTip: string;
}

export const IELTS_SPEAKING_PROMPTS: IELTSSpeakingCue[] = [
  {
    id: 'ielts-spk-p1',
    part: 'Part 1',
    topic: 'Daily Routines & Study Habits',
    questions: [
      'Do you prefer studying early in the morning or late at night?',
      'What part of your daily routine helps you relax the most?',
      'Has your weekly schedule changed much over the past year?',
    ],
    prepSeconds: 5,
    speakSeconds: 45,
    bandTip: 'Give a direct answer in sentence 1, then add one concrete reason and a brief example.',
  },
  {
    id: 'ielts-spk-p2',
    part: 'Part 2',
    topic: 'Describe a Skill You Learned Outside School',
    questions: ['Speak for 1–2 minutes covering all points on the cue card.'],
    cueCardBullets: [
      'What skill it was',
      'When and how you learned it',
      'What difficulties you faced at first',
      'Why this skill has been useful to you',
    ],
    prepSeconds: 60,
    speakSeconds: 120,
    bandTip: 'Use your 1-minute prep to jot 1 keyword per bullet plus one past-tense memory.',
  },
  {
    id: 'ielts-spk-p3',
    part: 'Part 3',
    topic: 'Lifelong Learning & Technology',
    questions: [
      'Why do you think adults continue learning new skills later in life?',
      'How has online education changed access to specialized training?',
      'Will face-to-face teachers always remain important despite digital tools?',
    ],
    prepSeconds: 10,
    speakSeconds: 60,
    bandTip: 'Move from personal stories to broader societal reasons ("Generally speaking...", "In many workplaces...").',
  },
];

export interface IELTSMiniMockQuestion {
  id: string;
  skill: 'listening' | 'reading';
  pathway: IELTSPathway | 'both';
  prompt: string;
  context: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const IELTS_MINI_MOCK_QUESTIONS: IELTSMiniMockQuestion[] = [
  {
    id: 'mock-q1',
    skill: 'listening',
    pathway: 'both',
    context: 'Audio announcement: "Welcome to the City Botanical Workshop. Morning registration opens at 8:45 AM in Courtyard B, though tools are distributed at 9:15 AM sharp."',
    prompt: 'When does registration begin?',
    options: ['8:15 AM', '8:45 AM', '9:00 AM', '9:15 AM'],
    correctAnswer: '8:45 AM',
    explanation: 'Registration opens at 8:45 AM; 9:15 AM is when tools are distributed.',
  },
  {
    id: 'mock-q2',
    skill: 'reading',
    pathway: 'both',
    context: 'Passage excerpt: "While vertical farms use 95% less water than open-field agriculture, high LED lighting costs currently restrict profitable crops mostly to leafy greens and herbs."',
    prompt: 'True / False / Not Given: Vertical farms already grow wheat and corn more cheaply than outdoor farms.',
    options: ['True', 'False', 'Not Given'],
    correctAnswer: 'False',
    explanation: 'The passage states high electricity costs currently limit profitable crops mainly to leafy greens and herbs.',
  },
  {
    id: 'mock-q3',
    skill: 'reading',
    pathway: 'academic',
    context: 'Passage excerpt: "Archaeologists re-examined pottery shards from the coastal site and concluded that maritime trade routes operated nearly three centuries earlier than previous textbooks claimed."',
    prompt: 'What did the re-examination reveal?',
    options: [
      'Coastal pottery was purely decorative.',
      'Sea trade began roughly 300 years earlier than older sources assumed.',
      'Textbooks overstated the size of coastal villages.',
      'Trade stopped completely three centuries ago.',
    ],
    correctAnswer: 'Sea trade began roughly 300 years earlier than older sources assumed.',
    explanation: '"Three centuries earlier" corresponds directly to 300 years earlier.',
  },
  {
    id: 'mock-q4',
    skill: 'reading',
    pathway: 'general_training',
    context: 'Workplace Policy: "Staff requesting remote-work days must submit schedules to their team lead at least 48 hours in advance, except during medical emergencies."',
    prompt: 'When is 48-hour advance notice NOT required?',
    options: [
      'On public holidays',
      'During medical emergencies',
      'For senior managers',
      'During the summer months',
    ],
    correctAnswer: 'During medical emergencies',
    explanation: 'The policy explicitly notes "except during medical emergencies."',
  },
];

export function computeMiniMockPercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}
