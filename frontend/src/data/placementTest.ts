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
  {
    id: 'pq-11',
    targetCefr: 'C1',
    skill: 'grammar',
    exercise: fill({
      id: 'pq-11',
      lessonId: 'placement',
      instruction: 'Choose the accurate delayed main-clause inversion structure.',
      prompt: 'Not until independent monitors verified hospital pressure logs ___ the board retract its initial advisory.',
      options: ['did', 'the board did', 'had done', 'retracted'],
      correctAnswer: 'did',
      explanation: 'After opening time clause "Not until...", invert only the main clause ("did the board retract").',
      explanationVi: 'Với "Not until...", giữ bình thường mệnh đề đầu và chỉ đảo trợ động từ ở mệnh đề chính ("did").',
      skills: ['grammar'],
      difficulty: 3,
    }),
  },
  {
    id: 'pq-12',
    targetCefr: 'C1',
    skill: 'vocabulary',
    exercise: mc({
      id: 'pq-12',
      lessonId: 'placement',
      instruction: 'Select the C1 verb meaning "confirm and strengthen an assertion with independent evidence".',
      prompt: 'Two external acoustic labs managed to ___ what night dispatchers had logged along the bridge.',
      options: ['corroborate', 'extrapolate', 'circumvent', 'stagnate'],
      correctAnswer: 'corroborate',
      explanation: '"Corroborate" means confirming a statement or finding with independent supporting evidence.',
      explanationVi: '"Corroborate" = xác nhận củng cố thêm bằng chứng cứ độc lập.',
      skills: ['vocabulary'],
      difficulty: 3,
    }),
  },
  {
    id: 'pq-13',
    targetCefr: 'C2',
    skill: 'grammar',
    exercise: mc({
      id: 'pq-13',
      lessonId: 'placement',
      instruction: 'Select the C2 sentence using summative apposition and faultless proportionality cleanly.',
      prompt: 'Which closing observation maintains full C2 syntactic precision?',
      options: [
        'For all its conciliatory grace, the charter revealed a dearth of clear sanctions—a quiet loophole commensurate with years of lobbying.',
        'For all its conciliatory grace; the charter revealed paucity, which being commensurate for lobbying.',
        'The charter had scarcely never corroborated clandestine exemptions despite copious memos.',
        'Not only did judges demur cleanly, yet also to adjudicating capricious waivers.',
      ],
      correctAnswer:
        'For all its conciliatory grace, the charter revealed a dearth of clear sanctions—a quiet loophole commensurate with years of lobbying.',
      explanation: 'Demonstrates clean subordinated cataphora ("For all its... the charter") and summative appositive paired with "commensurate with".',
      explanationVi: 'Kết hợp nhuần nhuyễn cataphora ("For all its...") với đồng vị tổng kết và "commensurate with".',
      skills: ['grammar'],
      difficulty: 3,
    }),
  },
  {
    id: 'pq-14',
    targetCefr: 'C2',
    skill: 'reading',
    exercise: readEx({
      id: 'pq-14',
      lessonId: 'placement',
      instruction: 'Read this C2 stylistic judgment and detect the narrator’s quiet irony.',
      passage:
        'Ministry briefs observed immaculate parliamentary decorum on thick stationery; nonetheless, professing total innocence over three prior storm memos while arrogating emergency fee discretion would appear scarcely credible—if not downright disingenuous.',
      prompt: 'What critique lies beneath the judge’s restrained academic phrasing?',
      options: [
        'Smooth formal manners mask deliberate bad-faith excuses and unauthorized overreach.',
        'Thick stationery caused flooding delays inside parliamentary archives.',
        'Storm alerts failed to reach regional ministries until three summers later.',
        'Parliamentary committees praised fee discretion for cutting clerical budgets.',
      ],
      correctAnswer: 'Smooth formal manners mask deliberate bad-faith excuses and unauthorized overreach.',
      explanation: 'Litotes "scarcely credible—if not downright disingenuous" delivers biting yet poised institutional critique.',
      explanationVi: 'Phép nói giảm nhẹ ("scarcely credible") vạch trần thái độ thiếu thành thật đằng sau vẻ lịch thiệp.',
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
  if (ratio >= 0.9) {
    return {
      recommendedCefr: 'C2',
      summary:
        'Exceptional C2 Mastery placement! C2 Proficiency plus all A1–C1 levels are unlocked (you can also switch levels freely anytime).',
    };
  }
  if (ratio >= 0.78) {
    return {
      recommendedCefr: 'C1',
      summary:
        'Strong C1 Advanced placement! C1 Rhetoric & Critical Inquiry plus A1–B2 units are unlocked for immediate training.',
    };
  }
  if (ratio >= 0.64) {
    return {
      recommendedCefr: 'B2',
      summary:
        'Upper-Intermediate B2 placement! B2 units plus A1–B1 foundations are unlocked to sharpen conditionals, participles, and academic writing.',
    };
  }
  if (ratio >= 0.48) {
    return {
      recommendedCefr: 'B1',
      summary:
        'Strong intermediate B1 placement! You are ready for B1 Intermediate units (with A1–A2 unlocked for quick review anytime).',
    };
  }
  if (ratio >= 0.3) {
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
