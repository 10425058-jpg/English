import { UNOFFICIAL_IELTS_NOTICE, type IELTSMockExamManifest } from '@english-quest/shared';

const ACADEMIC_THEME_TITLES: Array<[string, string]> = [
  [
    '[Practice Mini-Mock 1] Urban Ecology, Bio-Materials & Ancient Navigation',
    'Timed Practice Checkpoint (8L + 15R) • Line Chart + Transit Policy Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock 2] Deep Ocean Ecosystems, Lending Bias & Transit',
    'Timed Practice Checkpoint (8L + 15R) • Pie Share + Arts vs Coding Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock 3] Behavioral Anchors, Rail Economics & Neuroplasticity',
    'Timed Practice Checkpoint (8L + 15R) • Bar Visits + Workweek Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock 4] Historical Concrete, Silver Trade & Agroforestry',
    'Timed Practice Checkpoint (8L + 15R) • Canteen Table + Housing Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock 5] Infant Speech Tuning, Silent Films & Dairy Biotech',
    'Timed Practice Checkpoint (8L + 15R) • Glass Process + Repair Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock 6] Solar Tandems, Citizen Birding & Wave Acoustics',
    'Timed Practice Checkpoint (8L + 15R) • Wharf Map + Volunteering Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock 7] Trophic Rewilding, Glacial Loess & Corvid Tools',
    'Timed Practice Checkpoint (8L + 15R) • Renewables Graph + Languages Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock 8] Sleep Consolidation, Clean Steel & Medical Screening',
    'Timed Practice Checkpoint (8L + 15R) • Graduate Bar + Congestion Essay (No Band Extrapolation)',
  ],
];

const GT_THEME_TITLES: Array<[string, string]> = [
  [
    '[Practice Mini-Mock GT 1] Community Libraries, Cold-Chain Safety & Post-Buses',
    'Timed GT Checkpoint (8L + 15R) • Formal Billing Letter + Urban Isolation Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock GT 2] Ferry Mobility, Hybrid Charters & Copper Heritage',
    'Timed GT Checkpoint (8L + 15R) • Semi-Formal Leak Letter + Food Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock GT 3] Balcony Care, Clinic Phishing & Repair Cafes',
    'Timed GT Checkpoint (8L + 15R) • Informal Cabin Invite + Tuition Essay (No Band Extrapolation)',
  ],
  [
    '[Practice Mini-Mock GT 4] Allotment Rules, Workshop Acoustics & Bookshops',
    'Timed GT Checkpoint (8L + 15R) • Semi-Formal WFH Request + Museum Essay (No Band Extrapolation)',
  ],
];

export const IELTS_MOCK_EXAMS: IELTSMockExamManifest[] = [
  {
    id: 'ielts-mock-full-ac-01',
    number: 1,
    pathway: 'academic',
    examFormat: 'full_exam',
    listeningQuestionTotal: 40,
    readingQuestionTotal: 40,
    title: 'Full Academic Mock Exam 1 • Acoustic Reefs, Peatland Hydrology & Sleep',
    subtitle:
      'Complete 40-Question Listening + 40-Question Reading Simulation + Task 1/2 Writing & Speaking (40/40 Objective Curve)',
    estimatedMinutes: 164,
    listeningIds: [
      'ielts-full-ac01-l1',
      'ielts-full-ac01-l2',
      'ielts-full-ac01-l3',
      'ielts-full-ac01-l4',
    ],
    readingIds: [
      'ielts-full-ac01-r1',
      'ielts-full-ac01-r2',
      'ielts-full-ac01-r3',
    ],
    writingTask1Id: 'ielts-wrt-t1-ac-01',
    writingTask2Id: 'ielts-wrt-t2-01',
    speakingPartIds: [
      'ielts-spk-p1-01',
      'ielts-spk-p2-01',
      'ielts-spk-p3-01',
    ],
    isUnofficialNotice: UNOFFICIAL_IELTS_NOTICE,
  },
  {
    id: 'ielts-mock-full-gt-01',
    number: 2,
    pathway: 'general_training',
    examFormat: 'full_exam',
    listeningQuestionTotal: 40,
    readingQuestionTotal: 40,
    title: 'Full General Training Mock Exam 1 • Rail Rules, Lab Induction & Bridges',
    subtitle:
      'Complete 40-Question Listening + 40-Question GT Reading Simulation + Formal Letter/Essay & Speaking (40/40 Objective Curve)',
    estimatedMinutes: 164,
    listeningIds: [
      'ielts-full-gt01-l1',
      'ielts-full-gt01-l2',
      'ielts-full-gt01-l3',
      'ielts-full-gt01-l4',
    ],
    readingIds: [
      'ielts-full-gt01-r1',
      'ielts-full-gt01-r2',
      'ielts-full-gt01-r3',
    ],
    writingTask1Id: 'ielts-wrt-t1-gt-01',
    writingTask2Id: 'ielts-wrt-t2-09',
    speakingPartIds: [
      'ielts-spk-p1-09',
      'ielts-spk-p2-09',
      'ielts-spk-p3-09',
    ],
    isUnofficialNotice: UNOFFICIAL_IELTS_NOTICE,
  },
  ...ACADEMIC_THEME_TITLES.map(([title, subtitle], i): IELTSMockExamManifest => {
    const num = i + 1;
    const p2 = String(num).padStart(2, '0');
    const rStart = i * 3 + 1;
    return {
      id: `ielts-mock-ac-${p2}`,
      number: num + 2,
      pathway: 'academic',
      examFormat: 'practice_mini',
      listeningQuestionTotal: 8,
      readingQuestionTotal: 15,
      title,
      subtitle,
      estimatedMinutes: 55,
      listeningIds: [
        `ielts-lis-p1-${p2}`,
        `ielts-lis-p2-${p2}`,
        `ielts-lis-p3-${p2}`,
        `ielts-lis-p4-${p2}`,
      ],
      readingIds: [
        `ielts-rd-ac-${String(rStart).padStart(2, '0')}`,
        `ielts-rd-ac-${String(rStart + 1).padStart(2, '0')}`,
        `ielts-rd-ac-${String(rStart + 2).padStart(2, '0')}`,
      ],
      writingTask1Id: `ielts-wrt-t1-ac-${p2}`,
      writingTask2Id: `ielts-wrt-t2-${p2}`,
      speakingPartIds: [
        `ielts-spk-p1-${p2}`,
        `ielts-spk-p2-${p2}`,
        `ielts-spk-p3-${p2}`,
      ],
      isUnofficialNotice: UNOFFICIAL_IELTS_NOTICE,
    };
  }),
  ...GT_THEME_TITLES.map(([title, subtitle], i): IELTSMockExamManifest => {
    const mockNum = i + 9;
    const p2 = String(mockNum).padStart(2, '0');
    const gtNum = i + 1;
    return {
      id: `ielts-mock-gt-${String(gtNum).padStart(2, '0')}`,
      number: mockNum + 2,
      pathway: 'general_training',
      examFormat: 'practice_mini',
      listeningQuestionTotal: 8,
      readingQuestionTotal: 15,
      title,
      subtitle,
      estimatedMinutes: 55,
      listeningIds: [
        `ielts-lis-p1-${p2}`,
        `ielts-lis-p2-${p2}`,
        `ielts-lis-p3-${p2}`,
        `ielts-lis-p4-${p2}`,
      ],
      readingIds: [
        `ielts-rd-gt-${String(gtNum).padStart(2, '0')}`,
        `ielts-rd-gt-${String(gtNum + 8).padStart(2, '0')}`,
        `ielts-rd-gt-${String(gtNum + 14).padStart(2, '0')}`,
      ],
      writingTask1Id: `ielts-wrt-t1-gt-${String(gtNum).padStart(2, '0')}`,
      writingTask2Id: `ielts-wrt-t2-${p2}`,
      speakingPartIds: [
        `ielts-spk-p1-${p2}`,
        `ielts-spk-p2-${p2}`,
        `ielts-spk-p3-${p2}`,
      ],
      isUnofficialNotice: UNOFFICIAL_IELTS_NOTICE,
    };
  }),
];
