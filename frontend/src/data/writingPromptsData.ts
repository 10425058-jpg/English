import type { WritingPromptItem } from '@/services/writingAnalyzer';

export const WRITING_LAB_PROMPTS: WritingPromptItem[] = [
  {
    id: 'wrt-a1-sentence',
    title: 'Sentence Construction: Describe Your Morning',
    category: 'sentence_construction',
    cefrLevel: 'A1',
    prompt: 'Write 2–3 connected sentences describing what time you wake up, what you eat or drink, and how you travel to school or work.',
    instructions: 'Use Present Simple verbs and at least one frequency word ("usually", "always", or "every day").',
    minWords: 15,
    targetWords: 28,
    checklist: [
      'Capitalize "I" and sentence beginnings',
      'Include a time expression (e.g. "at 7:00 AM")',
      'End every sentence with a period',
    ],
    sampleResponse:
      'I usually wake up at 6:45 AM on weekdays. After brushing my teeth, I have eggs and warm tea for breakfast. Then I take the bus to my university at 7:30 AM.',
  },
  {
    id: 'wrt-a2-correction',
    title: 'Grammar Repair & Paragraph Rewrite',
    category: 'grammar_correction',
    cefrLevel: 'A2',
    prompt:
      'Rewrite this short paragraph cleanly, fixing the tense, preposition, and agreement mistakes:\n\n"Last Sunday i go to bookshop with my friend. There was many interesting book on the table. We buy two novel and then we drinked coffee in a quiet cafe."',
    instructions: 'Keep the meaning clear while correcting all 6 grammar/mechanics slips.',
    minWords: 25,
    targetWords: 38,
    checklist: [
      'Fix Past Simple verbs (went, bought, drank)',
      'Fix plural agreement ("There were many interesting books", "two novels")',
      'Capitalize "I"',
    ],
    sampleResponse:
      'Last Sunday, I went to a bookshop with my friend. There were many interesting books on the table. We bought two novels and then drank coffee at a quiet café.',
  },
  {
    id: 'wrt-a2-email',
    title: 'Practical Email: Rescheduling a Study Session',
    category: 'email',
    cefrLevel: 'A2',
    prompt:
      'Write a polite email to your English partner explaining that you have a family event on Saturday morning and proposing Sunday afternoon instead.',
    instructions: 'Include a short greeting, a clear reason, an alternative time, and a friendly closing.',
    minWords: 35,
    targetWords: 55,
    checklist: [
      'Friendly greeting ("Hi...", "Dear...")',
      'Clear polite request ("Could we move...?")',
      'Specific alternative day & time',
    ],
    sampleResponse:
      'Hi Emma,\n\nI hope your week is going smoothly! Something unexpected came up: my family is hosting a small gathering this Saturday morning, so I won’t be free at 9:00 AM.\n\nCould we reschedule our speaking practice to Sunday at 3:00 PM instead? Please let me know if that works for you.\n\nBest regards,\nMinh',
  },
  {
    id: 'wrt-b1-story',
    title: 'Short Narrative: A Helpful Stranger',
    category: 'story',
    cefrLevel: 'B1',
    prompt:
      'Write a brief story about a time someone helped you—or you helped someone—when traveling or learning something new.',
    instructions: 'Use Past Simple for main events and time connectors ("First", "Suddenly", "In the end").',
    minWords: 55,
    targetWords: 85,
    checklist: [
      'Set the time and place in sentence one',
      'Include at least 2 time connectors',
      'Share how the experience made you feel',
    ],
    sampleResponse:
      'Two summers ago, I missed the last evening bus after visiting a mountain museum. My phone battery had dropped to two percent, so I felt quite anxious. Fortunately, a friendly shopkeeper noticed me checking the timetable. She kindly let me charge my phone inside her shop and wrote down the number of a reliable local taxi. Thanks to her warmth, I arrived back safely and felt deeply grateful.',
  },
  {
    id: 'wrt-b1-argument',
    title: 'Argumentative Paragraph: Reading Paper Books vs E-Books',
    category: 'argumentative_essay',
    cefrLevel: 'B1',
    prompt:
      'Do you prefer reading printed paper books or digital e-books for learning? Explain your viewpoint with at least two reasons.',
    instructions: 'Present a clear opinion, give supporting examples, and acknowledge one benefit of the other side.',
    minWords: 70,
    targetWords: 110,
    checklist: [
      'Clear topic sentence stating your stance',
      'At least two linking words ("Although", "Moreover", "For example")',
      'One counter-point acknowledged politely',
    ],
    sampleResponse:
      'Although digital e-books are undeniably convenient for traveling light, I strongly prefer printed books for deep study. First, paper pages protect my eyes from screen fatigue after a long workday. Moreover, writing brief pencil notes in the margins helps me remember new vocabulary far better than tapping glass screens. While e-readers remain great for quick dictionary lookups on the bus, printed books create the calm focus I need most.',
  },
  {
    id: 'wrt-b1-ielts2',
    title: 'IELTS Writing Task 2 Practice: Daily Language Habits',
    category: 'ielts_task_2',
    cefrLevel: 'B1',
    prompt:
      'Some learners believe studying vocabulary through short daily sessions is more effective than attending one long weekly class. To what extent do you agree or disagree?',
    instructions: 'Write a structured 3-to-4-paragraph practice response (Target 150+ words in Phase 1 practice mode, or aim for 250 in full mock timing).',
    minWords: 90,
    targetWords: 160,
    checklist: [
      'Introduction paraphrasing the prompt + clear position',
      'Body paragraphs with concrete reasons and examples',
      'Brief conclusion summarizing your view',
    ],
    sampleResponse:
      'Many language students debate whether frequent short practice outperforms one lengthy weekly lesson. In my view, brief daily study brings substantially stronger results, though weekly classes still offer valuable social feedback.\n\nFirstly, daily contact keeps new expressions active in working memory. When a learner reviews twenty flashcards and listens to one short podcast every morning, sleep consolidates those patterns repeatedly across the week. By contrast, cramming everything into one Saturday afternoon often causes fatigue and rapid forgetting by Tuesday.\n\nHowever, structured weekly classes remain helpful for guided pronunciation feedback and live group discussion. Therefore, the ideal routine combines a guided weekly session with focused fifteen-minute daily practice.',
  },
  {
    id: 'wrt-b1-ielts1',
    title: 'IELTS Writing Task 1 Practice: Library Study Format Trends',
    category: 'ielts_task_1',
    cefrLevel: 'B1',
    prompt:
      'Practice prompt: A city library recorded weekly visits across three study zones from 2020 to 2024: Quiet Reading Room (rose from 400 to 620), Group Collaboration Tables (rose sharply from 150 to 510), and Print Newspaper Corner (fell steadily from 300 to 120). Summarize the main trends and make relevant comparisons.',
    instructions: 'Write an overview sentence identifying overall growth vs decline, plus accurate data comparisons without adding personal opinions.',
    minWords: 75,
    targetWords: 130,
    checklist: [
      'Paraphrase what the data shows in sentence one',
      'Include a clear Overview summarizing upward vs downward trends',
      'Quote exact figures accurately (400 -> 620, 150 -> 510, 300 -> 120)',
    ],
    sampleResponse:
      'The summary compares weekly visitor numbers across three zones at a city library between 2020 and 2024. Overall, both the Quiet Reading Room and Group Collaboration Tables grew steadily in popularity, whereas visits to the Print Newspaper Corner declined noticeably.\n\nIn 2020, the Quiet Reading Room was the busiest area with 400 weekly visits, rising to 620 by 2024. Group Collaboration Tables experienced the sharpest expansion, more than tripling from 150 visits to 510 over the same period. In contrast, the Print Newspaper Corner saw a steady drop from 300 weekly visitors in 2020 down to just 120 in 2024.',
  },
];
