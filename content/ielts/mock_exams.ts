import { UNOFFICIAL_IELTS_NOTICE, type IELTSMockExamManifest } from '@english-quest/shared';

const ACADEMIC_THEME_TITLES: Array<[string, string]> = [
  ['Mock Exam 1 • Urban Ecology, Bio-Materials & Ancient Navigation', 'Full Academic Simulation • Line Chart + Transit Policy Essay'],
  ['Mock Exam 2 • Deep Ocean Ecosystems, Lending Bias & Transit', 'Full Academic Simulation • Pie Share + Arts vs Coding Discussion'],
  ['Mock Exam 3 • Behavioral Anchors, Rail Economics & Neuroplasticity', 'Full Academic Simulation • Bar Visits + Compressed Workweeks'],
  ['Mock Exam 4 • Historical Concrete, Silver Trade & Agroforestry', 'Full Academic Simulation • Canteen Table + Housing Crunch'],
  ['Mock Exam 5 • Infant Speech Tuning, Silent Films & Dairy Biotech', 'Full Academic Simulation • Glass Process + Repair Mindset'],
  ['Mock Exam 6 • Solar Tandems, Citizen Birding & Wave Acoustics', 'Full Academic Simulation • Wharf Map + Youth Volunteering'],
  ['Mock Exam 7 • Trophic Rewilding, Glacial Loess & Corvid Tools', 'Full Academic Simulation • Renewables Graph + Endangered Languages'],
  ['Mock Exam 8 • Sleep Consolidation, Clean Steel & Medical Screening', 'Full Academic Simulation • Graduate Bar + Congestion Charges'],
];

const GT_THEME_TITLES: Array<[string, string]> = [
  ['General Training Mock 1 • Community Libraries, Cold-Chain Safety & Post-Buses', 'Full GT Simulation • Formal Billing Letter + Urban Isolation Essay'],
  ['General Training Mock 2 • Ferry Mobility, Hybrid Charters & Copper Heritage', 'Full GT Simulation • Semi-Formal Leak Letter + Processed Food Essay'],
  ['General Training Mock 3 • Balcony Care, Clinic Phishing & Repair Cafes', 'Full GT Simulation • Informal Cabin Invite + University Tuition Essay'],
  ['General Training Mock 4 • Allotment Rules, Workshop Acoustics & quiet Bookshops', 'Full GT Simulation • Semi-Formal WFH Request + Museum Artifacts Essay'],
];

export const IELTS_MOCK_EXAMS: IELTSMockExamManifest[] = [
  ...ACADEMIC_THEME_TITLES.map(([title, subtitle], i): IELTSMockExamManifest => {
    const num = i + 1;
    const p2 = String(num).padStart(2, '0');
    const rStart = i * 3 + 1;
    return {
      id: `ielts-mock-ac-${p2}`,
      number: num,
      pathway: 'academic',
      title,
      subtitle,
      estimatedMinutes: 164,
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
      number: mockNum,
      pathway: 'general_training',
      title,
      subtitle,
      estimatedMinutes: 164,
      listeningIds: [
        `ielts-lis-p1-${p2}`,
        `ielts-lis-p2-${p2}`,
        `ielts-lis-p3-${p2}`,
        `ielts-lis-p4-${p2}`,
      ],
      readingIds: [
        `ielts-rd-gt-${String(gtNum).padStart(2, '0')}`, // Sec 1 Everyday Survival (01..04)
        `ielts-rd-gt-${String(gtNum + 8).padStart(2, '0')}`, // Sec 2 Workplace Training (09..12)
        `ielts-rd-gt-${String(gtNum + 14).padStart(2, '0')}`, // Sec 3 Feature Article (15..18)
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
