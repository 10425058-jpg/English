import type { CEFRLevel } from '@english-quest/shared';
import type { SceneKind } from '@/components/mascot/SceneIllustration';

export interface SpeakingActivityItem {
  id: string;
  title: string;
  activityType:
    | 'repetition'
    | 'shadowing'
    | 'picture_description'
    | 'topic_discussion'
    | 'roleplay'
    | 'timed_challenge';
  cefrLevel: CEFRLevel;
  prompt: string;
  modelText: string;
  scene?: SceneKind;
  suggestedSeconds: number;
  tips: string[];
  selfChecklist: string[];
  keyVocabulary: string[];
  roleplayTurns?: Array<{ partner: string; cue: string }>;
}

export const SPEAKING_LAB_ACTIVITIES: SpeakingActivityItem[] = [
  {
    id: 'spk-rep-1',
    title: 'Everyday Polite Repetition',
    activityType: 'repetition',
    cefrLevel: 'A1',
    prompt: 'Listen to the model sentence, then record yourself matching its rhythm and clear endings.',
    modelText: 'Excuse me, could you tell me where the nearest coffee shop is?',
    suggestedSeconds: 12,
    tips: [
      'Pronounce the /t/ at the end of "nearest".',
      'Group "could you tell me" smoothly as one phrase.',
    ],
    selfChecklist: [
      'I paused slightly after "Excuse me".',
      'I finished with polite rising/falling intonation.',
    ],
    keyVocabulary: ['excuse me', 'nearest', 'coffee shop'],
  },
  {
    id: 'spk-shad-1',
    title: 'Shadowing: Smooth Morning Routine',
    activityType: 'shadowing',
    cefrLevel: 'A2',
    prompt: 'Play the model voice and speak just half a second behind it to match natural pace and stress.',
    modelText:
      'Every morning I wake up early, brew a fresh cup of tea, and review ten English flashcards before starting work.',
    suggestedSeconds: 20,
    tips: [
      'Stress key content words: EVERY, MORNING, EARLY, FRESH, TEA, TEN, FLASHCARDS.',
      'Keep unstressed words ("a", "of", "and") light and quick.',
    ],
    selfChecklist: [
      'I kept steady pace without stopping on small words.',
      'I pronounced past/present verbs clearly.',
    ],
    keyVocabulary: ['brew', 'review', 'before starting'],
  },
  {
    id: 'spk-pic-cafe',
    title: 'Picture Description: Sunny Corner Café',
    activityType: 'picture_description',
    cefrLevel: 'A2',
    prompt:
      'Describe what you see in the illustration: setting, objects on the table, menu board, and atmosphere.',
    modelText:
      'In this bright café scene, there is a wooden table with a hot cup of coffee and a golden croissant. Through the wide blue window, green hills shine under the morning sun, while a chalkboard menu hangs on the right.',
    scene: 'cafe',
    suggestedSeconds: 35,
    tips: [
      'Start with an overview ("In this picture, I can see a cozy café...").',
      'Use location phrases: "on the left", "on the table", "through the window".',
    ],
    selfChecklist: [
      'I used "There is / There are" accurately.',
      'I mentioned at least 4 visual details from the picture.',
    ],
    keyVocabulary: ['wooden table', 'croissant', 'menu board', 'sunshine'],
  },
  {
    id: 'spk-pic-airport',
    title: 'Picture Description: International Departure Hall',
    activityType: 'picture_description',
    cefrLevel: 'B1',
    prompt:
      'Describe this airport scene and speculate about where travelers are going.',
    modelText:
      'This illustration shows a busy departure terminal. Outside the large panoramic window, an airplane is ready on the runway. On the right, a digital board lists flights to London and Ho Chi Minh City, while a purple wheeled suitcase sits ready for boarding.',
    scene: 'airport',
    suggestedSeconds: 40,
    tips: [
      'Connect concrete objects ("purple suitcase") to context ("ready for boarding").',
      'Practice speaking for 30+ seconds without long silences.',
    ],
    selfChecklist: [
      'I described both the background (window/plane) and foreground (suitcase/board).',
      'I spoke continuously for at least 25 seconds.',
    ],
    keyVocabulary: ['departure terminal', 'runway', 'boarding', 'wheeled suitcase'],
  },
  {
    id: 'spk-role-airport',
    title: 'Situational Roleplay: Airport Check-In',
    activityType: 'roleplay',
    cefrLevel: 'A2',
    prompt: 'Practice responding naturally through a 3-step check-in conversation.',
    modelText:
      'Good morning! Here is my passport. I have one checked suitcase and a small backpack. Could I have a window seat if one is available? Thank you very much!',
    suggestedSeconds: 30,
    tips: [
      'Respond directly to each agent question.',
      'Use polite softeners like "Could I have..." and "if possible".',
    ],
    selfChecklist: [
      'I answered all 3 cues clearly.',
      'I used polite travel requests.',
    ],
    keyVocabulary: ['passport', 'checked suitcase', 'window seat', 'boarding gate'],
    roleplayTurns: [
      { partner: 'Agent: "Good morning! Where are you flying today, and may I see your passport?"', cue: 'Greet the agent and name your destination.' },
      { partner: 'Agent: "Thank you. Are you checking any bags, or just carry-on?"', cue: 'State whether you have checked luggage.' },
      { partner: 'Agent: "Would you prefer a window or an aisle seat?"', cue: 'Make a polite seat preference request.' },
    ],
  },
  {
    id: 'spk-topic-tech',
    title: 'Topic Discussion: Daily Habits & Productivity',
    activityType: 'topic_discussion',
    cefrLevel: 'B1',
    prompt:
      'Discuss how you organize your study or work time, and explain one habit that helps you stay focused.',
    modelText:
      'To stay productive, I divide big goals into twenty-minute blocks and keep my phone in another room. As a result, I finish reading tasks faster and feel less stressed in the evening.',
    scene: 'workspace',
    suggestedSeconds: 45,
    tips: [
      'Structure your answer: Main habit -> How you do it -> Positive result.',
      'Use connectors such as "To stay...", "For example", and "As a result".',
    ],
    selfChecklist: [
      'I gave at least one concrete example.',
      'I used one linking phrase ("because", "therefore", or "as a result").',
    ],
    keyVocabulary: ['productive', 'divide', 'focus', 'as a result'],
  },
  {
    id: 'spk-timed-park',
    title: 'Timed 45-Second Challenge: Favorite Outdoor Place',
    activityType: 'timed_challenge',
    cefrLevel: 'B1',
    prompt:
      'Speak continuously for up to 45 seconds describing an outdoor park or green space you enjoy visiting.',
    modelText:
      'One of my favorite places to unwind is a quiet riverside park near my neighborhood. Tall trees shade the walking path, and families gather on wooden benches every late afternoon. Going there after work always refreshes my mind.',
    scene: 'park',
    suggestedSeconds: 45,
    tips: [
      'Use sensory details: shade, fresh air, afternoon sunlight, calm pathway.',
      'Explain WHY you enjoy spending time there.',
    ],
    selfChecklist: [
      'I described what the place looks like.',
      'I explained what people do there and why I like it.',
    ],
    keyVocabulary: ['unwind', 'shaded path', 'refresh my mind', 'neighborhood'],
  },
];
