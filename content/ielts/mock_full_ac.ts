import type {
  CEFRLevel,
  Exercise,
  IELTSListeningActivity,
  IELTSReadingPassage,
} from '@english-quest/shared';
import { createIeltsListening, createIeltsReading, iEx } from './helpers';

export interface FullListeningSeed {
  id: string;
  part: 'part_1' | 'part_2' | 'part_3' | 'part_4';
  title: string;
  topic: string;
  accent: 'en-GB' | 'en-US';
  cefrTarget: CEFRLevel;
  contextDescription: string;
  wordLimitNote: string;
  scriptLines: Array<{ speaker: string; text: string }>;
  distractorTraps: string[];
  questions: Array<{
    type: 'audio_recognition' | 'fill_blank';
    instruction: string;
    prompt: string;
    options?: string[];
    correctAnswer: string;
    acceptableAnswers?: string[];
    explanation: string;
    explanationVi: string;
  }>;
}

export function buildFullListeningPart(seed: FullListeningSeed): IELTSListeningActivity {
  const audioText = seed.scriptLines.map((l) => `${l.speaker}: ${l.text}`).join(' ');
  const exercises: Exercise[] = seed.questions.map((q, idx) =>
    iEx({
      id: `${seed.id}-q${idx + 1}`,
      lessonId: seed.id,
      type: q.type,
      instruction: q.instruction,
      prompt: `[${seed.title} • Q${idx + 1}] ${q.prompt}`,
      audioText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      acceptableAnswers: q.acceptableAnswers ?? (q.options ? undefined : [q.correctAnswer.toLowerCase()]),
      explanation: q.explanation,
      explanationVi: q.explanationVi,
      difficulty: seed.part === 'part_3' || seed.part === 'part_4' ? 3 : 2,
      skills: q.type === 'fill_blank' ? ['listening', 'writing'] : ['listening'],
    }),
  );

  return createIeltsListening({
    id: seed.id,
    part: seed.part,
    pathway: 'shared',
    title: seed.title,
    topic: seed.topic,
    accent: seed.accent,
    cefrTarget: seed.cefrTarget,
    contextDescription: seed.contextDescription,
    wordLimitNote: seed.wordLimitNote,
    scriptLines: seed.scriptLines,
    distractorTraps: seed.distractorTraps,
    exercises,
  });
}

export interface FullReadingPassageSeed {
  id: string;
  pathway: 'academic' | 'general_training';
  sectionLabel: string;
  title: string;
  topic: string;
  cefrTarget: CEFRLevel;
  paragraphs: Array<{ label: string; text: string }>;
  questionTypesCovered: string[];
  questions: Array<{
    type: 'reading_comprehension' | 'multiple_choice' | 'fill_blank';
    instruction: string;
    prompt: string;
    options?: string[];
    correctAnswer: string;
    acceptableAnswers?: string[];
    explanation: string;
    explanationVi: string;
  }>;
}

export function buildFullReadingPassage(seed: FullReadingPassageSeed): IELTSReadingPassage {
  const passage = seed.paragraphs.map((p) => `[${p.label}] ${p.text}`).join('\n\n');
  const exercises: Exercise[] = seed.questions.map((q, idx) =>
    iEx({
      id: `${seed.id}-q${idx + 1}`,
      lessonId: seed.id,
      type: q.type,
      instruction: q.instruction,
      prompt: `[${seed.sectionLabel}: ${seed.title} • Q${idx + 1}] ${q.prompt}`,
      passage,
      options: q.options,
      correctAnswer: q.correctAnswer,
      acceptableAnswers: q.acceptableAnswers ?? (q.options ? undefined : [q.correctAnswer.toLowerCase()]),
      explanation: q.explanation,
      explanationVi: q.explanationVi,
      difficulty: seed.pathway === 'academic' ? 3 : 2,
      skills: q.type === 'fill_blank' ? ['reading', 'vocabulary'] : ['reading'],
    }),
  );

  return createIeltsReading({
    id: seed.id,
    pathway: seed.pathway,
    sectionLabel: seed.sectionLabel,
    title: seed.title,
    topic: seed.topic,
    cefrTarget: seed.cefrTarget,
    paragraphs: seed.paragraphs,
    questionTypesCovered: seed.questionTypesCovered,
    exercises,
  });
}

export const IELTS_FULL_AC_01_LISTENING: IELTSListeningActivity[] = [
  buildFullListeningPart({
    id: 'ielts-full-ac01-l1',
    part: 'part_1',
    title: 'Greenbank Community Sports Hall Membership',
    topic: 'Civic Membership Registration',
    accent: 'en-GB',
    cefrTarget: 'B1',
    contextDescription: 'Part 1 (Questions 1–10): A new resident calls Greenbank Sports Centre to arrange off-peak swim access and locker hire.',
    wordLimitNote: 'ONE WORD AND/OR A NUMBER',
    scriptLines: [
      { speaker: 'Receptionist', text: 'Good morning, Greenbank Community Sports Hall, Claire speaking. Are you calling to renew an existing card?' },
      { speaker: 'Caller', text: 'No, I just moved nearby—first time joining. My surname is Haldane, spelt H-A-L-D-A-N-E, first name Martin. I work at the harbor bakery.' },
      { speaker: 'Receptionist', text: 'Great, Mr. Haldane. Let’s add your residential street cleanly—is it 14 Ashbourne Lane?' },
      { speaker: 'Caller', text: 'Close—40 Ashbourne Avenue! Fourteen used to be my flat number years ago. The postcode ends K-J-7, full code NW4 7KJ.' },
      { speaker: 'Receptionist', text: 'Noted cleanly: 40 Ashbourne Avenue. Standard Anytime passes run forty-eight pounds monthly, whereas Daytime Off-Peak cuts down cleanly to thirty-two pounds if you swim strictly before four p.m. on weekdays.' },
      { speaker: 'Caller', text: 'Since bakery mornings wrap up at noon, thirty-two fits me perfectly! Do I pay extra for tall lockers?' },
      { speaker: 'Receptionist', text: 'Standard coin lockers stay free; private monthly dry lockers cost six pounds, though bringing a brass padlock saves renting keys. Also attend Friday’s mandatory twenty-minute safety briefing in Studio B—Thursday sessions paused while new mats arrive.' },
    ],
    distractorTraps: ['14 Ashbourne Lane vs 40 Ashbourne Avenue.', 'Anytime £48 vs chosen Off-Peak £32.', 'Thursday briefing paused vs confirmed Friday session.'],
    questions: [
      { type: 'fill_blank', instruction: 'Write ONE WORD matching dictated spelling.', prompt: 'Applicant surname: ___', correctAnswer: 'Haldane', acceptableAnswers: ['haldane'], explanation: 'Caller spells surname clearly as H-A-L-D-A-N-E.', explanationVi: 'Họ thí sinh đánh vần là Haldane.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Caller’s place of employment: harbor ___', correctAnswer: 'bakery', explanation: 'Caller states he works at the harbor bakery.', explanationVi: 'Làm việc tại tiệm bánh ("bakery").' },
      { type: 'fill_blank', instruction: 'Write ONE NUMBER.', prompt: 'Verified street house number: ___ Ashbourne Avenue', correctAnswer: '40', acceptableAnswers: ['forty', '40'], explanation: 'Corrects 14 Lane distraction to 40 Ashbourne Avenue.', explanationVi: 'Số nhà xác nhận là 40.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Confirmed street type: Ashbourne ___', correctAnswer: 'Avenue', acceptableAnswers: ['avenue'], explanation: 'Clarifies "Avenue" instead of "Lane".', explanationVi: 'Loại đường là Avenue.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD OR CODE.', prompt: 'Postcode segment after NW4: ___', correctAnswer: '7KJ', acceptableAnswers: ['7kj'], explanation: 'Full postcode is NW4 7KJ.', explanationVi: 'Mã bưu điện kết thúc bằng 7KJ.' },
      { type: 'fill_blank', instruction: 'Write ONE NUMBER.', prompt: 'Monthly fee chosen by Martin: £___', correctAnswer: '32', acceptableAnswers: ['thirty-two', '32'], explanation: 'Selects Daytime Off-Peak at £32 over £48 Anytime.', explanationVi: 'Chọn gói ban ngày £32.' },
      { type: 'audio_recognition', instruction: 'Choose the exact Off-Peak cutoff rule.', prompt: 'By when must Off-Peak weekday swimmers check out cleanly?', options: ['Before noon daily', 'Strictly before 4:00 p.m. on weekdays', 'Anytime past 7:00 p.m.', 'Sundays only'], correctAnswer: 'Strictly before 4:00 p.m. on weekdays', explanation: 'Staff clarifies swimming strictly before four p.m. weekdays.', explanationVi: 'Quy định bơi trước 4 giờ chiều các ngày trong tuần.' },
      { type: 'fill_blank', instruction: 'Write ONE NUMBER.', prompt: 'Private monthly locker fee if selected: £___', correctAnswer: '6', acceptableAnswers: ['six', '6'], explanation: 'Private dry lockers cost six pounds monthly.', explanationVi: 'Phí tủ khóa riêng là 6 bảng.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Recommended metal type for own locker lock: ___ padlock', correctAnswer: 'brass', explanation: 'Advises bringing a brass padlock cleanly.', explanationVi: 'Mang ổ khóa đồng ("brass").' },
      { type: 'audio_recognition', instruction: 'Select verified safety briefing schedule.', prompt: 'Which day and room does Martin attend the safety induction?', options: ['Thursday in Studio A', 'Friday in Studio B', 'Monday at Front Pool', 'Saturday upstairs'], correctAnswer: 'Friday in Studio B', explanation: 'Thursday is paused for mats; Friday Studio B is confirmed.', explanationVi: 'Thứ Sáu tại Studio B vì thứ Năm tạm hoãn thay thảm.' },
    ],
  }),
  buildFullListeningPart({
    id: 'ielts-full-ac01-l2',
    part: 'part_2',
    title: 'Westport Maritime Heritage Trail Audio Orientation',
    topic: 'Visitor Orientation & Maps',
    accent: 'en-GB',
    cefrTarget: 'B2',
    contextDescription: 'Part 2 (Questions 11–20): Visitors hear an orientation guide covering piers, dry docks, timber workshops, and cafe rules.',
    wordLimitNote: 'ONE WORD ONLY',
    scriptLines: [
      { speaker: 'Guide', text: 'Welcome aboard Westport Heritage Quay! Before exploring outdoor slipways, note our Clocktower Gift Shop reopened behind East Fountain yesterday—skip North Jetty’s old shed, since storm scaffolding covers carpentry booths there until autumn.' },
      { speaker: 'Guide', text: 'Walking past Copper Bell Wharf straight toward Harbour Shed Three, you’ll hear shipwrights hand-planing seasoned cedar oars! Photography without tripod legs stays free along wooden galleries; only bulky flash stands require conservation approval.' },
      { speaker: 'Guide', text: 'Wait—many flyers show 1904 steam tugs firing coal boilers at noon, yet clean compressed steam boilers only chime now at 1:30 p.m. so primary school lunches run quiet.' },
      { speaker: 'Guide', text: 'Hungry visitors find hot spiced chowder inside Sailor’s Pantry beside Ticket Gate C, while green waterproof rain ponchos lend out free under Reception Umbrella Racks whenever sudden coastal squalls sweep inland.' },
    ],
    distractorTraps: ['Clocktower Shop behind East Fountain vs North Jetty scaffolding.', 'Steam tug noon myth vs updated 1:30 p.m. bell.'],
    questions: [
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'New location landmark beside reopened Gift Shop: ___ Fountain', correctAnswer: 'East', explanation: 'Reopened behind East Fountain yesterday.', explanationVi: 'Phía sau đài phun nước East.' },
      { type: 'audio_recognition', instruction: 'Identify temporary closure reason.', prompt: 'Why are carpentry booths at North Jetty currently closed to guests?', options: ['Roof fires destroyed old sheds', 'Storm scaffolding blocks safe walkway access until autumn', 'Boatwrights moved across town', 'Rain flooding ruined tickets'], correctAnswer: 'Storm scaffolding blocks safe walkway access until autumn', explanation: 'Storm scaffolding covers carpentry booths until autumn.', explanationVi: 'Giàn giáo sửa bão che khu xưởng mộc đến mùa thu.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Aromatic boat-oar timber hand-planed in Shed Three: ___', correctAnswer: 'cedar', explanation: 'Shipwrights plane "seasoned cedar oars".', explanationVi: 'Chế tác mái chèo gỗ tuyết tùng ("cedar").' },
      { type: 'audio_recognition', instruction: 'Check camera equipment rule.', prompt: 'Which photography setup is banned inside Shed Three without special permits?', options: ['Handheld smartphone cameras', 'Bulky tripods and flash stands', 'Silent film notebooks', 'Sketching boards'], correctAnswer: 'Bulky tripods and flash stands', explanation: 'Photography without tripods stays free; bulky flash stands need approval.', explanationVi: 'Cấm chân máy cồng kềnh và đèn flash rời.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Revised boiler chime period matching school lunch calm: ___ (word/time digit)', correctAnswer: '1:30', acceptableAnswers: ['1:30', '13:30'], explanation: 'Updated from noon flyers to 1:30 p.m.', explanationVi: 'Đổi từ 12h sang 1:30 chiều.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Fuel omitted now inside quiet compressed museum boilers: ___', correctAnswer: 'coal', explanation: 'Flyers cite 1904 coal boilers, replaced cleanly by compressed steam.', explanationVi: 'Không đốt than ("coal") như năm 1904 nữa.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Hot soup dish served inside Sailor’s Pantry: spiced ___', correctAnswer: 'chowder', explanation: 'Menus feature "hot spiced chowder".', explanationVi: 'Món súp hải sản đặc trưng ("chowder").' },
      { type: 'fill_blank', instruction: 'Write ONE LETTER.', prompt: 'Ticket gate adjacent to Sailor’s Pantry: Gate ___', correctAnswer: 'C', acceptableAnswers: ['c'], explanation: 'Located cleanly beside Ticket Gate C.', explanationVi: 'Cạnh Cổng vé C.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Color of complimentary weather ponchos at Reception: ___', correctAnswer: 'green', explanation: 'Describes "green waterproof rain ponchos".', explanationVi: 'Áo mưa màu xanh lá ("green").' },
      { type: 'audio_recognition', instruction: 'Confirm equipment lending rule.', prompt: 'Where can guests pick up temporary rain ponchos when coastal squalls hit?', options: ['Bought upstairs inside Clocktower Shop', 'Borrowed free beneath Reception Umbrella Racks', 'Delivered via Harbor Bell Ferry', 'Restricted exclusively to paid boat crews'], correctAnswer: 'Borrowed free beneath Reception Umbrella Racks', explanation: 'Ponchos "lend out free under Reception Umbrella Racks".', explanationVi: 'Mượn miễn phí dưới giá ô Lễ tân.' },
    ],
  }),
  buildFullListeningPart({
    id: 'ielts-full-ac01-l3',
    part: 'part_3',
    title: 'Academic Tutorial: Biochar Maize Soil Trial',
    topic: 'Agronomy Research Design',
    accent: 'en-US',
    cefrTarget: 'C1',
    contextDescription: 'Part 3 (Questions 21–30): Two agronomy seniors debrief tutor Dr. Patel on soil moisture sensor flaws and thesis table cuts.',
    wordLimitNote: 'ONE WORD ONLY',
    scriptLines: [
      { speaker: 'Tutor', text: 'So Samira and Ben, your summer sandy plot figures look promising—before submitting Friday drafts cleanly, why did Plot C drop moisture retention abruptly during week six?' },
      { speaker: 'Samira', text: 'Wait—initially Ben suspected afternoon wind gusts dried tops, yet when we dug up moisture probes Friday, buried wire sheathing had snapped cleanly along stony gravel seams!' },
      { speaker: 'Ben', text: 'Right—and worse, our control plots got watered casually whenever campus sprinklers swung wide past north fences! Wait, Dr. Patel—should we quietly average all four plots or drop contaminated North Border trays entirely?' },
      { speaker: 'Tutor', text: 'Never hide outlying contamination inside blended tables! Keep raw Border readings transparently inside an appendix footnote while analyzing strictly Plots A and B across Main Charts.' },
      { speaker: 'Samira', text: 'Makes total sense. Plus we noticed fine sieved rice-hull char held nearly twice the trace phosphorus compared with coarse pine chunks—making grain texture our star practical recommendation for valley growers.' },
    ],
    distractorTraps: ['Wind drying hunch disproven -> broken gravel probe wire.', 'Temptation to blend contaminated Border data vs Tutor insistence on isolating clean Plots A/B + appendix disclosure.'],
    questions: [
      { type: 'audio_recognition', instruction: 'Identify verified sensor fault.', prompt: 'What truly caused Plot C’s erratic Week 6 dip in readings?', options: ['Strong unexpected desert heatwaves', 'Severed sensor wiring pinched across rocky soil gravel', 'Rabbits chewing corn stalks clean', 'Battery drain in solar boxes'], correctAnswer: 'Severed sensor wiring pinched across rocky soil gravel', explanation: 'Samira found "buried wire sheathing had snapped cleanly along stony gravel seams."', explanationVi: 'Dây cảm biến bị đứt ngầm qua lớp sỏi đá.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'False culprit initially suspected by Ben for drying soil: afternoon ___', correctAnswer: 'wind', explanation: 'Ben initially suspected afternoon wind gusts.', explanationVi: 'Ban đầu nghi ngờ do gió ("wind") buổi chiều.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Site equipment that accidentally soaked control beds: campus ___', correctAnswer: 'sprinklers', acceptableAnswers: ['sprinkler', 'sprinklers'], explanation: 'Watered accidentally by "campus sprinklers".', explanationVi: 'Vòi phun nước khuôn viên trường ("sprinklers").' },
      { type: 'audio_recognition', instruction: 'Select methodological ruling.', prompt: 'How does Dr. Patel instruct students to handle contaminated Border trays?', options: ['Blend them quietly into Plot A averages', 'Analyze strictly Plots A/B in main visuals while disclosing raw border noise openly inside an appendix note', 'Replant fresh winter wheat overnight', 'Delete appendix folders altogether'], correctAnswer: 'Analyze strictly Plots A/B in main visuals while disclosing raw border noise openly inside an appendix note', explanation: 'Dr. Patel stresses honest disclosure in an appendix rather than blended hiding.', explanationVi: 'Giữ nguyên biểu đồ chính từ Lô A/B sạch và minh bạch số liệu nhiễu ở phụ lục.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Draft final thesis submission weekday deadline: ___', correctAnswer: 'Friday', explanation: 'Mentioned "before submitting Friday drafts cleanly".', explanationVi: 'Hạn nộp bản nháp là thứ Sáu ("Friday").' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Primary crop material yielded stronger retention char: ___ hulls', correctAnswer: 'rice', acceptableAnswers: ['rice', 'rice-hull'], explanation: 'Fine sieved rice-hull char excelled.', explanationVi: 'Than sinh học từ vỏ trấu ("rice").' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Soil nutrient preserved double by fine char: ___', correctAnswer: 'phosphorus', explanation: 'Held nearly twice the trace phosphorus.', explanationVi: 'Khoáng phốt pho ("phosphorus").' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Control timber char sample performing worse: coarse ___ chunks', correctAnswer: 'pine', explanation: 'Contrasted cleanly against "coarse pine chunks".', explanationVi: 'Gỗ thông ("pine") thô.' },
      { type: 'audio_recognition', instruction: 'Summarize primary agronomic conclusion.', prompt: 'Which practical factor do students highlight most strongly to regional farmers?', options: ['Heavy deep chemical plowing every spring', 'Fineness/particle texture of organic char added to loose sandy dirt', 'Higher fence gates stopping stray sprinkler spray', 'Imported metal water tanks'], correctAnswer: 'Fineness/particle texture of organic char added to loose sandy dirt', explanation: 'Grain texture ("fine sieved rice-hull char") boosts retention cleanly.', explanationVi: 'Độ mịn kích thước hạt than là yếu tố quyết định độ giữ ẩm/dinh dưỡng.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Section reserved to document isolated experimental border noise honestly: ___ footnote', correctAnswer: 'appendix', explanation: 'Keep transparently inside an "appendix footnote".', explanationVi: 'Chú thích tại phụ lục ("appendix").' },
    ],
  }),
  buildFullListeningPart({
    id: 'ielts-full-ac01-l4',
    part: 'part_4',
    title: 'Lecture: Subsurface Earth-Tube Passive Building Cooling',
    topic: 'Architectural Thermal Physics',
    accent: 'en-US',
    cefrTarget: 'C1',
    contextDescription: 'Part 4 (Questions 31–40): An academic engineering lecture explaining soil thermal flywheel stabilization, condensation hygiene filters, and density constraints.',
    wordLimitNote: 'ONE WORD ONLY',
    scriptLines: [
      { speaker: 'Lecturer', text: 'Today we inspect passive earth-to-air heat exchangers—widely nicknamed "earth tubes". For decades, textbook builders assumed buried air shafts needed ten-meter shafts down toward bedrock; actual thermistor arrays confirm soil three meters underneath lawns already stabilizes near twelve degrees Celsius year-round!' },
      { speaker: 'Lecturer', text: 'Incoming scorching July outdoor breezes travel lazily through long smooth corrugated polypropylene conduits laid at two-degree gentle slopes—shedding nine degrees of peak heat before emerging calmly through floor museum grilles.' },
      { speaker: 'Lecturer', text: 'Wait—naive un-sloped earth trenches triggered notorious summer slime crises in the 1990s! Warm humid summer breezes chill beneath dew point inside buried walls, pooling sticky stagnant condensation puddles breeding mold spores unless silver-lined gravel sumps drain sloped bases daily.' },
      { speaker: 'Lecturer', text: 'Crucially, suburban concrete utilities—thick high-voltage fiber trunks and deep sewer mains—starve crowded central downtown towers of horizontal garden trenches, restricting classic earth loops largely toward suburban schools, campus museums, and timber pavilions.' },
    ],
    distractorTraps: ['10-meter bedrock myth vs verified 3-meter depth.', 'Humidity mold flaw resolved ONLY via sloped drains + sumps.'],
    questions: [
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Popular shorthand label for buried thermal ventilation conduits: earth ___', correctAnswer: 'tubes', acceptableAnswers: ['tube', 'tubes'], explanation: 'Widely nicknamed "earth tubes".', explanationVi: 'Thường gọi là ống địa nhiệt ("tubes").' },
      { type: 'fill_blank', instruction: 'Write ONE NUMBER.', prompt: 'Verified ground depth (meters) sufficient for steady 12°C cooling: ___ meters', correctAnswer: '3', acceptableAnswers: ['three', '3'], explanation: 'Arrays confirm "three meters underneath lawns" suffices vs naive 10m assumption.', explanationVi: 'Độ sâu 3 mét đã đủ ổn định nhiệt.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Standard plastic material chosen for smooth buried ductwork: ___', correctAnswer: 'polypropylene', explanation: 'Air travels through corrugated "polypropylene" conduits.', explanationVi: 'Nhựa ống "polypropylene".' },
      { type: 'fill_blank', instruction: 'Write ONE NUMBER.', prompt: 'Degrees Celsius trimmed from July incoming peak heat: ___ °C', correctAnswer: '9', acceptableAnswers: ['nine', '9'], explanation: 'Conduits shed "nine degrees of peak heat".', explanationVi: 'Giảm được 9 độ C đỉnh nóng.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Room delivery opening admitting cooled air quietly into halls: floor ___', correctAnswer: 'grilles', acceptableAnswers: ['grille', 'grilles'], explanation: 'Emerges cleanly through "floor museum grilles".', explanationVi: 'Lưới thông sàn ("grilles").' },
      { type: 'audio_recognition', instruction: 'Identify main hygiene risk of 1990s un-sloped systems.', prompt: 'Why did un-sloped early earth channels trigger indoor respiratory hazards?', options: ['Hot desert dust eroded copper ducts', 'Cooled moist summer vapor condensed into flat stagnant puddles cultivating toxic molds', 'Soil earthworms crawled directly inside fans', 'Loud compressor whine broke ceramic seams'], correctAnswer: 'Cooled moist summer vapor condensed into flat stagnant puddles cultivating toxic molds', explanation: 'Humidity crossing dew point creates puddles breeding mold spores.', explanationVi: 'Hơi ẩm ngưng tụ đọng nước phát sinh nấm mốc.' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Antimicrobial coating inside modern sloped drainage collection pockets: ___ -lined sumps', correctAnswer: 'silver', explanation: 'Modern loops rely on "silver-lined gravel sumps".', explanationVi: 'Hố sỏi lót bạc kháng khuẩn ("silver").' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Seasonal winter-summer threshold crossed cleanly causing buried walls to drip moisture: ___ point', correctAnswer: 'dew', explanation: 'Crosses "dew point" inside cool soil pipes.', explanationVi: 'Ngưỡng điểm sương ("dew" point).' },
      { type: 'fill_blank', instruction: 'Write ONE WORD.', prompt: 'Tight buried urban pipes blocking earth trenches underneath tall city skyscrapers: municipal ___ mains', correctAnswer: 'sewer', explanation: 'Fiber trunks and deep "sewer mains" crowd central underground trenches.', explanationVi: 'Đường cống thoát nước ngầm ("sewer").' },
      { type: 'audio_recognition', instruction: 'Summarize primary modern suitability constraint.', prompt: 'Which venue category adapts most practically to classic earth-tube trenches today?', options: ['Subterranean subway trains beneath tight financial alleys', 'Spacious suburban schools, campus halls, and low-density museums with open lawns', 'Rooftop timber penthouse apartments', 'Desert oil tanker hulls'], correctAnswer: 'Spacious suburban schools, campus halls, and low-density museums with open lawns', explanation: 'Lack of urban utilities leaves open-lawn suburban schools & campus pavilions ideal.', explanationVi: 'Trường học ngoại ô và bảo tàng có khoảng sân trống phù hợp nhất.' },
    ],
  }),
];

export const IELTS_FULL_AC_01_READING: IELTSReadingPassage[] = [
  buildFullReadingPassage({
    id: 'ielts-full-ac01-r1',
    pathway: 'academic',
    sectionLabel: 'Academic Passage 1 (Q1–Q13)',
    title: 'Mechanizing the Furrow: Jethro Tull & Seed Drill Precision',
    topic: 'Agricultural Innovation History',
    cefrTarget: 'B2',
    paragraphs: [
      { label: 'A', text: 'For centuries across pre-industrial Europe, springtime sowing varied little from Roman antiquity: barefoot farmhands strode steadily along ploughed ridges swinging woven wicker baskets and scattering barley kernels broadcast by hand. Roughly a third of precious winter seed vanished onto shallow clods where starlings gorged openly, another portion rotted tangled inside uneven damp puddles, while tangled weeds thrived unchecked between erratic seed clusters.' },
      { label: 'B', text: 'Disturbed by chronic seed wastage and erratic landlord tenant harvests around Oxfordshire in 1701, musician-turned-estate-improver Jethro Tull fused church pipe-organ rotary valve brasswork seamlessly onto an ox-drawn pine seed hopper. Rotating spoked wheels drove notched oak cylinders—dropping exact metered grain pinches gently down grooved coulter blades straight along straight parallel trenches immediately trailed behind by smoothing harrow teeth.' },
      { label: 'C', text: 'Surprisingly, Tull’s revolutionary three-row horse-hoeing drill ignited fierce initial disdain among village ploughmen rather than overnight praise. Workers feared fewer casual broadcast day-wages; conservative gentry mocked the awkward iron teeth snapping cleanly whenever flint boulders lurked hidden inside stiff Berkshire chalk loams; and rough artisanal carpenters rarely duplicated Tull’s delicate organ valves accurately until uniform cast-iron factory foundries normalized interchangeable brass gears after 1785.' },
      { label: 'D', text: 'Once reliable foundry drills spread systematically across Norfolk crop rotations late in the eighteenth century, wheat-to-seed return ratios leaped roughly from four-to-one upward past ten-to-one without claiming a single extra wild woodland acre. Straight uniform crop aisles even invited horse-drawn inter-row scuffle hoes mid-May, star-choking aggressive thistles long before selective chemical sprays existed—establishing precision planting density as modern agronomy’s quiet corner hinge.' },
    ],
    questionTypesCovered: ['True / False / Not Given', 'One-Word Note Completion', 'Academic Multiple Choice'],
    questions: [
      { type: 'reading_comprehension', instruction: 'TRUE, FALSE, or NOT GIVEN.', prompt: 'Hand-broadcast sowing reliably kept winter barley seeds concealed safe from hungry surface birds.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'FALSE', explanation: 'Para A notes a third vanished onto shallow clods "where starlings gorged openly".', explanationVi: 'Đoạn A nói 1/3 hạt lộ thiên bị chim sáo ăn sạch -> FALSE.' },
      { type: 'reading_comprehension', instruction: 'TRUE, FALSE, or NOT GIVEN.', prompt: 'Jethro Tull adapted valve metering mechanics originally inspired by musical church organs.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'TRUE', explanation: 'Para B details fusing "church pipe-organ rotary valve brasswork" onto his hopper.', explanationVi: 'Đoạn B xác nhận Tull lấy cảm hứng van xoay từ đàn ống nhà thờ -> TRUE.' },
      { type: 'reading_comprehension', instruction: 'TRUE, FALSE, or NOT GIVEN.', prompt: 'Jethro Tull sold over fifty thousand patented pine seed drills to French dukes before 1720.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'NOT GIVEN', explanation: 'No export quantities or French dukes appear in the passage -> NOT GIVEN.', explanationVi: 'Không hề nhắc đến doanh số bán cho công tước Pháp -> NOT GIVEN.' },
      { type: 'reading_comprehension', instruction: 'TRUE, FALSE, or NOT GIVEN.', prompt: 'Hidden chalk stones in early Berkshire fields occasionally fractured Tull’s prototype iron blades.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'TRUE', explanation: 'Para C states teeth snapped cleanly "whenever flint boulders lurked... inside Berkshire chalk loams".', explanationVi: 'Đoạn C nhắc đá lửa ẩn làm gãy răng lưỡi sắt sớm -> TRUE.' },
      { type: 'reading_comprehension', instruction: 'TRUE, FALSE, or NOT GIVEN.', prompt: 'Uniform horse-hoed aisles became practical only after petroleum synthetic weedkillers arrived.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'FALSE', explanation: 'Para D clarifies inter-row hoes checked weeds "long before selective chemical sprays existed".', explanationVi: 'Đoạn D khẳng định việc làm cỏ giữa hàng có từ rất lâu trước thuốc hóa học -> FALSE.' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph A.', prompt: 'Traditional farm sowers carried seed supplies inside woven ___ baskets.', correctAnswer: 'wicker', explanation: 'Para A mentions "woven wicker baskets".', explanationVi: 'Giỏ đan liễu gai ("wicker").' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph B.', prompt: 'Grooved knife ___ cut even parallel trenches ahead of falling seed pinches.', correctAnswer: 'blades', acceptableAnswers: ['coulter', 'blades'], explanation: 'Matches "grooved coulter blades".', explanationVi: 'Lưỡi cắt rãnh ("blades").' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph B.', prompt: 'Trailing wooden harrow ___ sealed protective loose soil gently across covered seeds.', correctAnswer: 'teeth', explanation: 'Text writes "smoothing harrow teeth".', explanationVi: 'Răng bừa ("teeth") lấp đất lại.' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph C.', prompt: 'Standardized interchangeable drill parts waited until mechanical cast-iron ___ scaled after 1785.', correctAnswer: 'foundries', acceptableAnswers: ['foundry', 'foundries'], explanation: 'Para C attributes reliability to "cast-iron factory foundries".', explanationVi: 'Các xưởng đúc gang ("foundries").' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph D.', prompt: 'Spaced straight crop alleys allowed mechanical summer weed control targeting aggressive ___.', correctAnswer: 'thistles', acceptableAnswers: ['thistle', 'thistles'], explanation: 'Notes "star-choking aggressive thistles".', explanationVi: 'Cây kế gai dại ("thistles").' },
      { type: 'multiple_choice', instruction: 'Select evidence-based answer.', prompt: 'Why did early village carpenters struggle reproducing Tull’s 1701 prototype accurately?', options: ['Oaks stopped growing in wet summers', 'Complex handmade brass organ cylinders lacked uniform standardized tooling until 1785', 'Lawmakers banned rotary spoke wheels cleanly', 'Oxen refused pulling painted wood frames'], correctAnswer: 'Complex handmade brass organ cylinders lacked uniform standardized tooling until 1785', explanation: 'Para C states artisanal carpenters rarely copied delicate valves cleanly until foundries normalized gears.', explanationVi: 'Thợ mộc thủ công khó sao chép chính xác van nhạc cụ tinh xảo trước khi có xưởng đúc chuẩn hóa.' },
      { type: 'multiple_choice', instruction: 'Select evidence-based answer.', prompt: 'How did Norfolk drills elevate grain yield without clearing virgin forest?', options: ['Uniform depth and even spacing cut rot/bird waste nearly tenfold', 'Farmers doubled fertilizer nitrate imports yearly', 'Barley crops replaced potatoes every August cleanly', 'Deeper drainage trenches poured seawater on roots'], correctAnswer: 'Uniform depth and even spacing cut rot/bird waste nearly tenfold', explanation: 'Para D notes return ratios jumped 4:1 -> 10:1 cleanly on existing acreage.', explanationVi: 'Gieo đúng độ sâu, thẳng hàng giúp tỷ lệ nảy mầm thu hoạch vọt từ 4:1 lên hơn 10:1 trên cùng diện tích.' },
      { type: 'multiple_choice', instruction: 'Identify central theme across A–D.', prompt: 'What overarching lesson does Tull’s seed drill history illustrate?', options: ['Bright mechanical inventions require industrial manufacturing consistency plus compatible workflow shifts to thrive', 'Medieval manual broadcast planting still outperforms metal farm gears overall', 'Pipe organs disappeared completely from England by 1790', 'Tenant workers always welcome labor-saving field robots enthusiastically'], correctAnswer: 'Bright mechanical inventions require industrial manufacturing consistency plus compatible workflow shifts to thrive', explanation: 'Traces 80-year gap between bright 1701 invention and 1785 foundry scaling + crop rotation adoption.', explanationVi: 'Phát minh 1701 cần công nghiệp đúc chuẩn hóa (1785) và kỹ thuật làm cỏ đồng bộ mới bùng nổ.' },
    ],
  }),
  buildFullReadingPassage({
    id: 'ielts-full-ac01-r2',
    pathway: 'academic',
    sectionLabel: 'Academic Passage 2 (Q14–Q26)',
    title: 'Symbiotic Coral Resilience & Acidification Thresholds',
    topic: 'Marine Biogeochemistry',
    cefrTarget: 'C1',
    paragraphs: [
      { label: 'A', text: 'Tropical coral cities cover merely one-tenth of one percent of seafloor area, yet shelter roughly a quarter of known marine fish diversity—built millimeter by millimeter as translucent cnidarian polyps pull dissolved calcium carbonate ions directly out of sun-drenched alkaline surf to construct porous aragonite skeletons alongside microscopic photosynthetic dinoflagellates called Symbiodiniaceae.' },
      { label: 'B', text: 'When anomalously warm Pacific El Niño pools elevate sea-surface temperatures merely one and a half degrees past local summer maxima for weeks cleanly, stressed algae overheat inside host cells—flooding fragile polyps with reactive oxygen free radicals until hosts violently expel golden symbionts outright, leaving skeletal white ghosts behind ("bleaching"). Unless chilly swells restore normal water swiftly within six weeks, star-starved hosts perish slowly.' },
      { label: 'C', text: 'Meanwhile, a quieter parallel chemical squeeze compounds thermal bleaching cleanly: as oceans absorb nearly thirty percent of human industrial carbon dioxide emissions, seawater carbonate ions bind upward with dissolved carbonic hydrogen, depleting free aragonite building blocks needed cleanly by juvenile coral larvae cementing onto limestone reefs.' },
      { label: 'D', text: 'Wait—field resilience teams led by Red Sea marine physiologist Maoz Fine discovered pockets of thermally tolerant coral lineages surviving astonishing two-degree heat anomalies right inside deep northern Gulf of Aqaba corridors without bleaching! Selective nursery cross-breeding paired cleanly alongside strict upstream lagoon sewage controls now sparks cautious optimism—though scientists underscore firmly no genetic "super-coral" survives unchecked planetary warming past two continuous degrees.' },
    ],
    questionTypesCovered: ['Matching Headings', 'Yes / No / Not Given', 'Summary Completion'],
    questions: [
      { type: 'reading_comprehension', instruction: 'Match heading for Paragraph A.', prompt: 'Best thematic heading for Paragraph A:', options: ['Disproportionate coastal biodiversity built on dual symbiosis', 'Volcanic island sinking around deep ocean ridges', 'Why commercial shrimp boats drag limestone anchors', 'Medieval trade tariffs affecting pearl shells'], correctAnswer: 'Disproportionate coastal biodiversity built on dual symbiosis', explanation: 'Para A highlights 0.1% seabed holding 25% fish via coral-algae symbiosis.', explanationVi: 'Đoạn A nhấn mạnh hệ sinh thái san hô-tảo nuôi sống tới 1/4 cá biển dù diện tích nhỏ bé.' },
      { type: 'reading_comprehension', instruction: 'Match heading for Paragraph B.', prompt: 'Best thematic heading for Paragraph B:', options: ['Toxic oxidative triggers behind sudden coral tissue expulsion', 'Freshwater monsoon lakes diluting Pacific beaches', 'Scuba tourism rules guarding sandy diving piers', 'How deep sharks navigate pitch-black reefs'], correctAnswer: 'Toxic oxidative triggers behind sudden coral tissue expulsion', explanation: 'Para B explains reactive oxygen radicals prompting expulsion of golden symbionts.', explanationVi: 'Đoạn B giải thích gốc oxy hóa tự do gây tẩy trắng san hô khi nóng.' },
      { type: 'reading_comprehension', instruction: 'Match heading for Paragraph C.', prompt: 'Best thematic heading for Paragraph C:', options: ['Dissolved carbon chemistry starving juvenile skeleton growth', 'Commercial limestone quarry pits near Red Sea piers', 'Rapid coral farming income for tourist cafes', 'Seasonal monsoon fish migrations offshore'], correctAnswer: 'Dissolved carbon chemistry starving juvenile skeleton growth', explanation: 'Para C details CO2 acidification depleting aragonite ions needed by larvae.', explanationVi: 'Đoạn C trình bày sự axit hóa đại dương làm cạn ion aragonite xây khung xương san hô.' },
      { type: 'reading_comprehension', instruction: 'Match heading for Paragraph D.', prompt: 'Best thematic heading for Paragraph D:', options: ['Localized heat-hardy populations offering bounded practical conservation space', 'Total abandonment of all coral nurseries worldwide', 'Why Red Sea shipping traffic vanished in 2010', 'Permanent extinction of Gulf of Aqaba polyps'], correctAnswer: 'Localized heat-hardy populations offering bounded practical conservation space', explanation: 'Para D profiles Gulf of Aqaba tolerant lineages alongside realistic limits.', explanationVi: 'Đoạn D nói về dòng san hô chịu nhiệt ở Vịnh Aqaba và giới hạn tự nhiên của nó.' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Healthy reefs house close to twenty-five percent of ocean fish varieties despite spanning tiny seafloor margins.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'YES', explanation: 'Para A states reefs cover 0.1% area yet shelter "roughly a quarter of known marine fish diversity".', explanationVi: 'Đoạn A nêu rõ 0.1% diện tích nhưng che chở ~1/4 loài cá biển -> YES.' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Polyps eject colorful microalgae during severe warming purely out of gentle visual seasonal instinct.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'NO', explanation: 'Para B shows toxic reactive oxygen free radicals drive violent stress expulsion -> NO.', explanationVi: 'Đoạn B nêu tảo bị tống xuất do độc tính gốc oxy hóa tự do khi stress nhiệt -> NO.' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Corals always die irreversibly the very minute their Symbiodiniaceae tint disappears.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'NO', explanation: 'Para B notes if normal cool swells return within six weeks, polyps can recover.', explanationVi: 'Đoạn B nói nếu nước mát lại trong 6 tuần san hô vẫn có thể phục hồi -> NO.' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Red Sea hotel developers funded Maoz Fine’s laboratory dives strictly to build underwater villas.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'NOT GIVEN', explanation: 'Zero hotel developer funding or villas mentioned anywhere -> NOT GIVEN.', explanationVi: 'Bài không nhắc tới dự án khách sạn dưới biển -> NOT GIVEN.' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Breeding hardy Red Sea coral stocks removes any urgent necessity to curb planetary warming.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'NO', explanation: 'Para D emphasizes "no genetic super-coral survives unchecked planetary warming past two continuous degrees."', explanationVi: 'Đoạn D bác bỏ: không giống siêu san hô nào sống nổi nếu ấm toàn cầu vượt ngưỡng kiểm soát -> NO.' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph A.', prompt: 'Mineral crystal phase formed by growing tropical coral stone skeletons: ___', correctAnswer: 'aragonite', explanation: 'Polyps construct "porous aragonite skeletons".', explanationVi: 'Khung xương khoáng chất aragonit ("aragonite").' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph B.', prompt: 'Toxic reactive ___ free radicals prompt host tissue bleaching ejection.', correctAnswer: 'oxygen', explanation: 'Algae flood polyps with "reactive oxygen free radicals".', explanationVi: 'Gốc tự do oxy ("oxygen").' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph C.', prompt: 'Dissolved ocean CO2 steals carbonate needed by young settling coral ___.', correctAnswer: 'larvae', acceptableAnswers: ['larva', 'larvae'], explanation: 'Para C references "juvenile coral larvae cementing onto limestone".', explanationVi: 'Ấu trùng san hô ("larvae") bám đá vôi.' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph D.', prompt: 'Practical local threat paired cleanly alongside genetics via nursery reef rules: lagoon ___ controls.', correctAnswer: 'sewage', explanation: 'Para D emphasizes "strict upstream lagoon sewage controls".', explanationVi: 'Kiểm soát nước thải ("sewage") ven đầm phá.' },
    ],
  }),
  buildFullReadingPassage({
    id: 'ielts-full-ac01-r3',
    pathway: 'academic',
    sectionLabel: 'Academic Passage 3 (Q27–Q40)',
    title: 'Calibration & Epistemic Humility in Complex Forecasting',
    topic: 'Cognitive Judgment Science',
    cefrTarget: 'C2',
    paragraphs: [
      { label: 'A', text: 'Why did a sprawling twenty-year political-science audit conducted by Philip Tetlock reveal prominent television commentators fared marginally worse at five-year geopolitical predictions than simple mechanical extrapolation algorithms? Crucially, pundits prized bold ideological certainty cleanly ("hedgehogs" forcing messy events neatly inside one sweeping grand master-theory) while television producers systematically rewarded confident dramatic extremes rather than boring calibrated nuance.' },
      { label: 'B', text: 'Contrastingly, a quieter sub-cohort nicknamed "foxes"—practitioners stitching tentative imperfect probabilities together across disparate messy historical analogies without dogmatically worshipping one elegant creed—consistently outscored media darlings cleanly across Brier accuracy calibration metrics. Crucially, top forecasters updated numerical likelihood bets incrementally by subtle two-percent notches whenever fresh conflicting evidence leaked in, avoiding all-or-nothing defensive flip-flops cleanly.' },
      { label: 'C', text: 'Subsequent Good Judgment tournament trials further shattered solitary-genius mystique: ordinary observant citizens assigned briefly into cooperative non-hierarchical estimation teams debating underlying base rates openly beat seasoned intelligence analysts holding classified satellite briefings cleanly by nearly thirty percent cleanly on accuracy margins.' },
      { label: 'D', text: 'Translating this cognitive insight outward carries crisp practical stakes across clinical prognosis, venture boardrooms, and public urban budgets: replacing inflated vague verbal confidence ("highly likely!") with explicit crisp Brier numeric probabilities—paired effortlessly alongside transparent "premortem" failure audits beforehand—transforms forecasting away from theatrical ego performance cleanly back into disciplined self-correcting science.' },
    ],
    questionTypesCovered: ['Academic Multiple Choice', 'Yes / No / Not Given', 'One-Word Summary'],
    questions: [
      { type: 'multiple_choice', instruction: 'Select best evidence-backed answer.', prompt: 'What defined the "hedgehog" pundit forecasting failure in Tetlock’s audit?', options: ['Refusing TV broadcast studio stipends', 'Forcing intricate ambiguous evidence rigidly inside one unifying ideological thesis', 'Using mechanical computer extrapolation daily', 'Always writing down low twenty-percent numerical chances'], correctAnswer: 'Forcing intricate ambiguous evidence rigidly inside one unifying ideological thesis', explanation: 'Para A characterizes "hedgehogs" as forcing messy world events cleanly inside one sweeping master-theory.', explanationVi: 'Đoạn A mô tả nhóm "nhím" ép mọi biến cố phức tạp vào một học thuyết duy nhất cứng nhắc.' },
      { type: 'multiple_choice', instruction: 'Select evidence-backed answer.', prompt: 'Why did broadcast news outlets compound weak forecasting?', options: ['Television producers paid extra purely for dull mathematical decimals', 'Audiences and studios preferred confident bold certainties ahead of boring hedged probabilities', 'Cameras shut down automatically during political debates', 'Pundits only discussed weather systems'], correctAnswer: 'Audiences and studios preferred confident bold certainties ahead of boring hedged probabilities', explanation: 'Para A notes producers rewarded "confident dramatic extremes rather than boring calibrated nuance".', explanationVi: 'Truyền hình thích những tuyên ngôn cực đoan chắc nịch thay vì sắc thái xác suất thận trọng.' },
      { type: 'multiple_choice', instruction: 'Select evidence-backed answer.', prompt: 'How do high-scoring "foxes" digest surprising small contradictory evidence?', options: ['Dismiss contradictory news as enemy rumors', 'Adjust probability odds gently step-by-step via small incremental notches', 'Wait five whole years cleanly before altering stances once', 'Flip from 10% directly upward to 95% immediately'], correctAnswer: 'Adjust probability odds gently step-by-step via small incremental notches', explanation: 'Para B documents incremental 2% probability updates avoiding rigid pride.', explanationVi: 'Nhóm "cáo" cập nhật xác suất tinh chỉnh nhỏ từng bước theo bằng chứng mới.' },
      { type: 'multiple_choice', instruction: 'Select evidence-backed answer.', prompt: 'What did Good Judgment trials prove regarding private classified information?', options: ['Classified data guarantees unbeatable predictive clarity alone', 'Open base-rate reasoning in collaborative citizen groups frequently outperforms solitary intelligence analysts', 'Secret military agencies forbid all team discussions permanently', 'Individual geniuses always triple team accuracy scores'], correctAnswer: 'Open base-rate reasoning in collaborative citizen groups frequently outperforms solitary intelligence analysts', explanation: 'Para C highlights citizen teams beating intelligence analysts holding classified briefings by ~30%.', explanationVi: 'Nhóm công dân hợp tác suy luận tỷ lệ nền công khai vượt trội cả chuyên gia tình báo giữ tài liệu mật.' },
      { type: 'multiple_choice', instruction: 'Select evidence-backed answer.', prompt: 'Which organizational ritual does Paragraph D advocate cleanly replacing vague "highly likely!" slogans?', options: ['Strictly banning written medical patient predictions', 'Explicit numeric odds alongside upfront team premortem error reviews', 'Hiring famous charismatic television pundits on corporate boards', 'Counting adjective adjectives across quarterly budgets'], correctAnswer: 'Explicit numeric odds alongside upfront team premortem error reviews', explanation: 'Para D proposes transparent Brier probabilities plus "premortem" audits beforehand.', explanationVi: 'Đề xuất dùng xác suất số tường minh kèm rà soát giả định thất bại trước ("premortem").' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Tetlock’s audit demonstrated bold charismatic media pundits consistently trounced plain statistical baselines.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'NO', explanation: 'Para A explicitly notes pundits scored "marginally worse" than simple extrapolation algorithms -> NO.', explanationVi: 'Đoạn A khẳng định các bình luận viên dự đoán còn hơi kém hơn thuật toán ngoại suy đơn giản -> NO.' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Collaborating citizen superforecaster groups debated base rates quietly without rigid hierarchy rules.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'YES', explanation: 'Para C states teams worked cleanly inside "cooperative non-hierarchical estimation teams debating base rates".', explanationVi: 'Đoạn C xác nhận các đội hoạt động không phân cấp và cùng tranh luận tỷ lệ nền -> YES.' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Philip Tetlock spent three winters analyzing financial stock returns on Japanese rail shares.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'NOT GIVEN', explanation: 'Japanese rail shares never appear inside passage text -> NOT GIVEN.', explanationVi: 'Không nhắc tới cổ phiếu đường sắt Nhật Bản -> NOT GIVEN.' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Substituting explicit numbers for fuzzy adjectives reduces vanity theatrics inside corporate projections.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'YES', explanation: 'Para D concludes explicit numbers turn forecasting "away from theatrical ego performance cleanly back into disciplined self-correcting science."', explanationVi: 'Đoạn D xác nhận thay tính từ mơ hồ bằng con số giúp dự báo bớt phô trương cái tôi -> YES.' },
      { type: 'reading_comprehension', instruction: 'YES, NO, or NOT GIVEN.', prompt: 'Most hospitals in Europe already enforce mandatory numeric Brier scoring inside emergency rooms cleanly.', options: ['YES', 'NO', 'NOT GIVEN'], correctAnswer: 'NOT GIVEN', explanation: 'Para D recommends clinical adoption—it never states Europe already mandates it -> NOT GIVEN.', explanationVi: 'Đoạn D chỉ nêu ứng dụng tiềm năng, không nói bệnh viện châu Âu đã bắt buộc -> NOT GIVEN.' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph A.', prompt: 'TV networks reward sweeping certainty over calibrated intellectual ___.', correctAnswer: 'nuance', explanation: 'Para A reads "rather than boring calibrated nuance".', explanationVi: 'Sắc thái tinh tế có hiệu chỉnh ("nuance").' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph B.', prompt: 'Probability calibration precision in forecasting trials gets quantified via formal ___ scores.', correctAnswer: 'Brier', acceptableAnswers: ['brier'], explanation: 'Para B identifies "Brier accuracy calibration metrics".', explanationVi: 'Thước đo hiệu chỉnh Brier.' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph C.', prompt: 'Cooperative citizen estimation teams start by evaluating empirical historical ___ rates openly.', correctAnswer: 'base', explanation: 'Para C stresses "debating underlying base rates openly".', explanationVi: 'Tỷ lệ cơ sở/nền tảng ("base" rates).' },
      { type: 'fill_blank', instruction: 'ONE WORD from Paragraph D.', prompt: 'Diagnostic planning reviews listing how a forecast project could fail cleanly upfront are called ___ audits.', correctAnswer: 'premortem', acceptableAnswers: ['pre-mortem', 'premortem'], explanation: 'Para D specifically names transparent "premortem" failure audits.', explanationVi: 'Kiểm toán giả định thất bại trước ("premortem").' },
    ],
  }),
];
