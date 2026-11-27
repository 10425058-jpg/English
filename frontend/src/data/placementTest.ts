import type { CEFRLevel, Exercise, SkillTag } from '@english-quest/shared';
import { audioEx, fill, mc, readEx } from './curriculum/helpers';

export interface PlacementQuestion {
  id: string;
  targetCefr: CEFRLevel;
  skill: SkillTag;
  exercise: Exercise;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'pq-1',
    targetCefr: 'A1',
    skill: 'vocabulary',
    exercise: mc({
      id: 'pq-1',
      lessonId: 'placement',
      instruction: 'Choose the polite response when someone says "Nice to meet you!"',
      prompt: 'Person A: "Nice to meet you!" — Person B: "..."',
      options: ['Nice to meet you too!', 'See you yesterday!', 'I am fine, thank.', 'Goodbye morning!'],
      correctAnswer: 'Nice to meet you too!',
      explanation: '"Nice to meet you too!" is the standard polite reply when meeting someone.',
      explanationVi: '"Nice to meet you too!" là cách đáp lịch sự chuẩn khi mới gặp ai đó.',
      skills: ['vocabulary'],
    }),
  },
  {
    id: 'pq-2',
    targetCefr: 'A1',
    skill: 'grammar',
    exercise: fill({
      id: 'pq-2',
      lessonId: 'placement',
      instruction: 'Complete the sentence with the correct verb form.',
      prompt: 'She ___ coffee every morning before work.',
      options: ['drink', 'drinks', 'drinking', 'is drink'],
      correctAnswer: 'drinks',
      explanation: 'With "she", Present Simple verbs add -s: "She drinks".',
      explanationVi: 'Với chủ ngữ ngôi thứ ba số ít "she", động từ thì Hiện tại đơn thêm -s.',
      skills: ['grammar'],
    }),
  },
  {
    id: 'pq-3',
    targetCefr: 'A1',
    skill: 'listening',
    exercise: audioEx({
      id: 'pq-3',
      lessonId: 'placement',
      type: 'audio_recognition',
      instruction: 'Listen to the announcement and select the gate number.',
      prompt: 'Which gate should the passenger go to?',
      audioText: 'Attention passengers. Flight 204 to London is now boarding at Gate 14.',
      options: ['Gate 4', 'Gate 14', 'Gate 24', 'Gate 40'],
      correctAnswer: 'Gate 14',
      explanation: 'The audio clearly states "boarding at Gate 14".',
      explanationVi: 'Đoạn nghe nói rõ "boarding at Gate 14".',
      skills: ['listening'],
    }),
  },
  {
    id: 'pq-4',
    targetCefr: 'A2',
    skill: 'grammar',
    exercise: mc({
      id: 'pq-4',
      lessonId: 'placement',
      instruction: 'Pick the correct Past Simple sentence.',
      prompt: 'Which sentence is grammatically accurate?',
      options: [
        'We didn’t went to the museum yesterday.',
        'We didn’t go to the museum yesterday.',
        'We don’t went to the museum yesterday.',
        'We wasn’t go to the museum yesterday.',
      ],
      correctAnswer: 'We didn’t go to the museum yesterday.',
      explanation: 'After "didn’t", always use the base verb ("go", not "went").',
      explanationVi: 'Sau trợ động từ "didn’t" luôn dùng động từ nguyên mẫu ("go").',
      skills: ['grammar'],
      difficulty: 2,
    }),
  },
  {
    id: 'pq-5',
    targetCefr: 'A2',
    skill: 'vocabulary',
    exercise: mc({
      id: 'pq-5',
      lessonId: 'placement',
      instruction: 'Choose the best word to complete the travel sentence.',
      prompt: 'You must show your passport and ___ at the departure gate.',
      options: ['boarding pass', 'notebook', 'receipt', 'menu'],
      correctAnswer: 'boarding pass',
      explanation: 'A boarding pass gives passengers permission to board a flight.',
      explanationVi: '"Boarding pass" là thẻ lên máy bay.',
      skills: ['vocabulary'],
      difficulty: 2,
    }),
  },
  {
    id: 'pq-6',
    targetCefr: 'A2',
    skill: 'reading',
    exercise: readEx({
      id: 'pq-6',
      lessonId: 'placement',
      instruction: 'Read the short notice and answer the question.',
      passage:
        'City Library Notice: Starting next Monday, the main reading room will stay open until 9:00 PM on weekdays. Weekend hours remain 9:00 AM to 5:00 PM.',
      prompt: 'What will change next Monday?',
      options: [
        'The library will close on weekends.',
        'Weekday closing time will be extended to 9:00 PM.',
        'The reading room will open at 5:00 PM.',
        'Weekend hours will become longer.',
      ],
      correctAnswer: 'Weekday closing time will be extended to 9:00 PM.',
      explanation: 'The notice states weekday closing extends until 9:00 PM while weekend hours stay the same.',
      explanationVi: 'Thông báo cho biết phòng đọc mở muộn đến 9 giờ tối vào các ngày trong tuần.',
      skills: ['reading'],
      difficulty: 2,
    }),
  },
  {
    id: 'pq-7',
    targetCefr: 'B1',
    skill: 'grammar',
    exercise: mc({
      id: 'pq-7',
      lessonId: 'placement',
      instruction: 'Select the correct tense for an ongoing life experience.',
      prompt: 'Lan ___ in Da Nang since 2022, and she loves living near the sea.',
      options: ['lives', 'lived', 'has lived', 'is living since'],
      correctAnswer: 'has lived',
      explanation: 'Use Present Perfect ("has lived") with "since + starting point" for actions continuing to the present.',
      explanationVi: 'Dùng thì Hiện tại hoàn thành ("has lived") với "since" cho hành động bắt đầu trong quá khứ và kéo dài đến hiện tại.',
      skills: ['grammar'],
      difficulty: 2,
    }),
  },
  {
    id: 'pq-8',
    targetCefr: 'B1',
    skill: 'vocabulary',
    exercise: mc({
      id: 'pq-8',
      lessonId: 'placement',
      instruction: 'Choose the closest synonym for the highlighted word.',
      prompt: 'Daily spaced-repetition practice makes vocabulary learning more "efficient".',
      options: ['productive and time-saving', 'expensive and slow', 'confusing and random', 'temporary'],
      correctAnswer: 'productive and time-saving',
      explanation: '"Efficient" means achieving strong results without wasting time or effort.',
      explanationVi: '"Efficient" nghĩa là hiệu quả, không lãng phí thời gian và công sức.',
      skills: ['vocabulary'],
      difficulty: 3,
    }),
  },
  {
    id: 'pq-9',
    targetCefr: 'B1',
    skill: 'listening',
    exercise: audioEx({
      id: 'pq-9',
      lessonId: 'placement',
      type: 'audio_recognition',
      instruction: 'Listen carefully and identify the speaker’s recommendation.',
      prompt: 'What does the speaker advise for improving fluency?',
      audioText:
        'Many learners memorize isolated word lists, yet speaking short sentences aloud every day builds far stronger natural fluency.',
      options: [
        'Only study grammar charts silently',
        'Speak short sentences aloud every day',
        'Memorize dictionary pages once a month',
        'Avoid speaking until C1 level',
      ],
      correctAnswer: 'Speak short sentences aloud every day',
      explanation: 'The speaker recommends speaking short sentences aloud daily rather than memorizing isolated lists.',
      explanationVi: 'Người nói khuyên nên luyện nói các câu ngắn thành tiếng mỗi ngày.',
      skills: ['listening'],
      difficulty: 3,
    }),
  },
  {
    id: 'pq-10',
    targetCefr: 'B2',
    skill: 'reading',
    exercise: readEx({
      id: 'pq-10',
      lessonId: 'placement',
      instruction: 'Read the excerpt and infer the author’s main point.',
      passage:
        'While automated tools can rapidly flag surface-level spelling slips, genuine communicative competence still depends on understanding tone, audience expectations, and cultural context.',
      prompt: 'What is the author’s central claim?',
      options: [
        'Spelling tools are completely useless.',
        'Technology replaces the need to study tone.',
        'Automated checks assist with mechanics, but real communication requires deeper contextual awareness.',
        'Cultural context only matters in spoken debates.',
      ],
      correctAnswer:
        'Automated checks assist with mechanics, but real communication requires deeper contextual awareness.',
      explanation: 'The passage contrasts surface-level automated checks with deeper communicative judgment.',
      explanationVi: 'Đoạn văn nhấn mạnh công cụ tự động chỉ sửa lỗi bề mặt, giao tiếp thực thụ cần hiểu ngữ cảnh và sắc thái.',
      skills: ['reading'],
      difficulty: 3,
    }),
  },
];

export function evaluatePlacementLevel(correctCount: number, total: number): {
  recommendedCefr: CEFRLevel;
  summary: string;
} {
  const ratio = total > 0 ? correctCount / total : 0;
  if (ratio >= 0.85) {
    return {
      recommendedCefr: 'B1',
      summary:
        'Strong intermediate mastery! You are ready for B1 Intermediate units (with A1–A2 unlocked for quick review anytime).',
    };
  }
  if (ratio >= 0.5) {
    return {
      recommendedCefr: 'A2',
      summary:
        'Solid foundations! We recommend starting at A2 Elementary to sharpen past/future tenses and practical conversations.',
    };
  }
  return {
    recommendedCefr: 'A1',
    summary:
      'Great starting point! We recommend beginning at A1 Beginner to build confident everyday vocabulary, grammar, and listening.',
  };
}
