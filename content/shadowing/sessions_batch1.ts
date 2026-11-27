import type { ShadowingSession } from '@english-quest/shared';
import { createShadowingSession } from './helpers';

export const SHADOWING_SESSIONS_BATCH1: ShadowingSession[] = [
  createShadowingSession({
    id: 'shd-m2-01',
    title: 'Warm Greetings & Morning Routine Flow (A1)',
    cefrLevel: 'A1',
    topic: 'Everyday Greetings',
    durationLabel: '0:35',
    recommendedRate: 0.85,
    rhythmOverview: 'Short three-word breaths linking polite openers smoothly ("Good morning", "walk to school").',
    vietnameseFocusTip: 'Nối mượt "Good morning" đừng ngắt nặng chữ /d/, và giữ nguyên âm dài ở "wake up".',
    segments: [
      { id: 'shd-01-1', speaker: 'Anna', text: 'Good morning! Did you sleep well last night?', focusWords: ['morning', 'sleep', 'last night'], linkingNote: 'Link "sleep well" and compress final /t/ cleanly on "last night".', rhythmBeat: 'good MOR-ning | SLEEP well LAST night' },
      { id: 'shd-01-2', speaker: 'Ben', text: 'Yes, thanks! I woke up early at six thirty today.', focusWords: ['woke up', 'early', 'six thirty'], linkingNote: 'Connect "woke + up" cleanly as "wo-kup" without stopping!', rhythmBeat: 'WOKE up EAR-ly at SIX THIR-ty' },
      { id: 'shd-01-3', speaker: 'Anna', text: 'Nice! Let’s grab warm tea before our first class.', focusWords: ['grab', 'warm tea', 'first class'], linkingNote: 'Push lips neatly into crisp /t/ on "first" before "class".', rhythmBeat: 'GRAB WARM TEA be-fore FIRST CLASS' },
    ],
    keyExpressions: [
      { phrase: 'Did you sleep well?', meaning: 'Friendly natural morning greeting checking rest.', vietnamese: 'Bạn ngủ ngon chứ?' },
      { phrase: 'grab warm tea', meaning: 'Get a quick warm cup casually before class.', vietnamese: 'lấy nhanh ly trà ấm' },
    ],
    reflectionChecklist: ['Matched friendly rising curve on "Did you sleep well?"', 'Linked "woke up" cleanly in one fluid movement.', 'Echoed 0.85x first, then tried 1.0x natural pace.'],
  }),

  createShadowingSession({
    id: 'shd-m2-02',
    title: 'Ordering Lunch & Paying Cheerfully (A1)',
    cefrLevel: 'A1',
    topic: 'Café & Dining',
    durationLabel: '0:40',
    recommendedRate: 0.85,
    rhythmOverview: 'Upbeat polite intonation peaking slightly on "please" and falling warmly on "thank you".',
    vietnameseFocusTip: 'Chú ý bật nhẹ âm cuối /t/ ở "hot", /d/ ở "iced" và giữ ngữ điệu lên xuống thân thiện.',
    segments: [
      { id: 'shd-02-1', speaker: 'Linh', text: 'Hi there! Can I get a small iced coffee, please?', focusWords: ['Can I', 'iced coffee', 'please'], linkingNote: 'Glide smoothly through "Can I get a" -> "Ca-nai ge-tə".', rhythmBeat: 'CAN I get a SMALL ICED COF-fee, PLEASE' },
      { id: 'shd-02-2', speaker: 'Server', text: 'Coming right up! Anything else from the bakery shelf?', focusWords: ['right up', 'anything else', 'shelf'], linkingNote: 'Link "right + up" -> "righ-tup" seamlessly.', rhythmBeat: 'COM-ing RIGHT UP | AN-y-thing ELSE' },
      { id: 'shd-02-3', speaker: 'Linh', text: 'One warm cheese bread too—that will be all, thank you!', focusWords: ['warm', 'cheese bread', 'thank you'], linkingNote: 'Soft /θ/ opening "thank" into "thank you".', rhythmBeat: 'ONE WARM CHEESE BREAD TOO | THANK you' },
    ],
    keyExpressions: [
      { phrase: 'Coming right up!', meaning: 'Friendly staff assurance that order starts right away.', vietnamese: 'Có ngay đây ạ!' },
      { phrase: 'That will be all', meaning: 'Polite phrase confirming you are finished adding items.', vietnamese: 'Chỉ vậy thôi ạ' },
    ],
    reflectionChecklist: ['Pressed tongue behind upper teeth lightly for "thank you".', 'Glided through "Can I get a" cleanly without staccato stops.', 'Finished with confident gentle drop on "thank you!".'],
  }),

  createShadowingSession({
    id: 'shd-m2-03',
    title: 'Weekend Park Plans in Casual Rhythm (A1)',
    cefrLevel: 'A1',
    topic: 'Free Time & Weather',
    durationLabel: '0:40',
    recommendedRate: 0.9,
    rhythmOverview: 'Steady lighthearted beat highlighting day, time, and sunny adjectives.',
    vietnameseFocusTip: 'Phân biệt âm /s/ và /ʃ/ ở "Sunday / sunny / park benches".',
    segments: [
      { id: 'shd-03-1', speaker: 'Maya', text: 'Look at that bright blue sky outside the window today!', focusWords: ['bright blue', 'outside', 'today'], linkingNote: 'Link "look at" cleanly -> "loo-kət".', rhythmBeat: 'LOOK at that BRIGHT BLUE SKY' },
      { id: 'shd-03-2', speaker: 'Dan', text: 'Yeah, let’s walk through Green Park right after lunch!', focusWords: ['walk through', 'Green Park', 'after lunch'], linkingNote: 'Shift smoothly from /k/ into dental /θ/ on "walk through".', rhythmBeat: 'WALK through GREEN PARK RIGHT af-ter LUNCH' },
      { id: 'shd-03-3', speaker: 'Maya', text: 'Awesome! Wait for me at the corner gate at two.', focusWords: ['wait for me', 'corner gate', 'at two'], linkingNote: 'Weaken "for" -> /fər/ and blend "at + two".', rhythmBeat: 'WAIT for me at the COR-ner GATE at TWO' },
    ],
    keyExpressions: [
      { phrase: 'right after lunch', meaning: 'Immediately once lunch finishes.', vietnamese: 'ngay sau bữa trưa' },
      { phrase: 'wait for me', meaning: 'Pause until I join you ("for" always stays!).', vietnamese: 'chờ mình với nhé' },
    ],
    reflectionChecklist: ['Kept "for" smoothly inside "Wait for me".', 'Pronounced /θ/ between teeth on "through".', 'Matched brisk upbeat pacing smoothly.'],
  }),

  createShadowingSession({
    id: 'shd-m2-04',
    title: 'Train Ticket Counter & Platform Directions (A2)',
    cefrLevel: 'A2',
    topic: 'Travel & Transit',
    durationLabel: '0:45',
    recommendedRate: 0.9,
    rhythmOverview: 'Clean polite rising questions paired with clear directional falling steps.',
    vietnameseFocusTip: 'Nhấn rõ số giờ "ten fifteen" và tránh nối sai âm cuối "platform four".',
    segments: [
      { id: 'shd-04-1', speaker: 'Traveler', text: 'Excuse me—could you tell me which track goes to Oxford?', focusWords: ['Excuse me', 'which track', 'Oxford'], linkingNote: 'Connect "which + track" cleanly without dropping /tʃ/.', rhythmBeat: 'ex-CUSE me | WHICH TRACK goes to OX-ford' },
      { id: 'shd-04-2', speaker: 'Agent', text: 'That’s Platform Four right down the stairs on your left.', focusWords: ['Platform Four', 'down the stairs', 'on your left'], linkingNote: 'Keep /f/ crisp on "left".', rhythmBeat: 'PLAT-form FOUR RIGHT DOWN the STAIRS on your LEFT' },
      { id: 'shd-04-3', speaker: 'Traveler', text: 'Does it leave on time at ten fifteen, or should I hurry?', focusWords: ['leave on time', 'ten fifteen', 'hurry'], linkingNote: 'Link "leave + on" -> "lea-von"; put primary beat on "fif-TEEN".', rhythmBeat: 'LEAVE on TIME at TEN fif-TEEN or HUR-ry' },
    ],
    keyExpressions: [
      { phrase: 'right down the stairs', meaning: 'Directly downstairs along the nearby steps.', vietnamese: 'ngay dưới chân cầu thang' },
      { phrase: 'on time', meaning: 'Operating punctually by timetable.', vietnamese: 'đúng giờ' },
    ],
    reflectionChecklist: ['Stressed syllable 2 cleanly on "fif-TEEN".', 'Maintained statement order inside "tell me which track goes...".', 'Linked "leave on time" smoothly without glottal breaks.'],
  }),

  createShadowingSession({
    id: 'shd-m2-05',
    title: 'Casual Catch-Up Story: Lost Wallet Returned (A2)',
    cefrLevel: 'A2',
    topic: 'Personal Stories',
    durationLabel: '0:50',
    recommendedRate: 0.95,
    rhythmOverview: 'Expressive story arc rising lightly in suspense ("I thought I lost it!") then dropping smoothly in warm relief.',
    vietnameseFocusTip: 'Giữ rõ đuôi quá khứ "-ed" đúng 1 âm tiết trong "dropped, picked, checked, called"!',
    segments: [
      { id: 'shd-05-1', speaker: 'Kai', text: 'You won’t believe what happened on the bus home last night!', focusWords: ['won’t believe', 'happened', 'last night'], linkingNote: 'Glide past middle /t/ cleanly inside "last night".', rhythmBeat: 'WON’T be-LIEVE what HAP-pened on the BUS HOME' },
      { id: 'shd-05-2', speaker: 'Kai', text: 'My library pass slipped out of my pocket beside the back door.', focusWords: ['slipped out', 'pocket', 'back door'], linkingNote: 'Connect crisp /pt/ straight into "out" -> "slip-tout".', rhythmBeat: 'LI-brary PASS SLIPPED OUT of my POCK-et' },
      { id: 'shd-05-3', speaker: 'Kai', text: 'Thankfully a kind student picked it up and handed it straight back!', focusWords: ['thankfully', 'picked it up', 'straight back'], linkingNote: 'Link 3 words cleanly: "pick-ti-tʌp" and "han-də-dit".', rhythmBeat: 'KIND STU-dent PICKED it UP and HAN-ded it BACK' },
    ],
    keyExpressions: [
      { phrase: 'slipped out of', meaning: 'Fell quietly unseen from a pocket or bag.', vietnamese: 'tuột rơi ra ngoài' },
      { phrase: 'handed it straight back', meaning: 'Returned an item immediately in person.', vietnamese: 'đưa trả lại tận tay ngay lập tức' },
    ],
    reflectionChecklist: ['Pronounced "slipped" and "picked" as clean 1-syllable /pt/ /kt/ verbs.', 'Linked "picked it up" cleanly without choppy pauses.', 'Captured warm expressive pitch lift on "thankfully".'],
  }),

  createShadowingSession({
    id: 'shd-m2-06',
    title: 'Everyday Apology & Rescheduling Call (A2)',
    cefrLevel: 'A2',
    topic: 'Phone Calls & Plans',
    durationLabel: '0:50',
    recommendedRate: 0.95,
    rhythmOverview: 'Gentle apologetic phrasing transitioning smoothly into crisp alternative times.',
    vietnameseFocusTip: 'Đọc nối nhẹ "Could we", "a bit later", và nhấn vào giờ mới để người nghe dễ bắt nhịp.',
    segments: [
      { id: 'shd-06-1', speaker: 'Maya', text: 'Hi Tom, so sorry—heavy rain slowed traffic down completely.', focusWords: ['sorry', 'heavy rain', 'completely'], linkingNote: 'Pause lightly after "so sorry" to signal friendly sincerity.', rhythmBeat: 'so SOR-ry | HEA-vy RAIN SLOWED TRAF-fic DOWN' },
      { id: 'shd-06-2', speaker: 'Maya', text: 'Could we push our study meetup twenty minutes later to four?', focusWords: ['push our', 'twenty minutes', 'to four'], linkingNote: 'Link "twenty minutes" plural crisp /-ts/ into "later".', rhythmBeat: 'PUSH our MEE-tup TWEN-ty MIN-utes LA-ter to FOUR' },
      { id: 'shd-06-3', speaker: 'Tom', text: 'No problem at all! Take your time and stay safe getting here.', focusWords: ['at all', 'take your time', 'stay safe'], linkingNote: 'Link "problem + at + all" smoothly -> "prob-lə-mə-tall".', rhythmBeat: 'no PROB-lem at ALL | STAY SAFE' },
    ],
    keyExpressions: [
      { phrase: 'push our meetup later', meaning: 'Reschedule an appointment slightly backwards.', vietnamese: 'lùi giờ hẹn trễ hơn một chút' },
      { phrase: 'Take your time', meaning: 'Friendly reassurance telling someone not to rush dangerously.', vietnamese: 'Cứ thong thả đi an toàn nhé' },
    ],
    reflectionChecklist: ['Linked "problem at all" fluidly in one smooth sweep.', 'Stressed new hour "FOUR" clearly.', 'Maintained relaxed warmth rather than stiff hurry.'],
  }),

  createShadowingSession({
    id: 'shd-m2-07',
    title: 'Workplace Morning Sync: Clear Concise Progress Report (B1)',
    cefrLevel: 'B1',
    topic: 'Workplace Communication',
    durationLabel: '0:55',
    recommendedRate: 1.0,
    rhythmOverview: 'Crisp professional pace highlighting DONE vs BLOCKED items smoothly.',
    vietnameseFocusTip: 'Nhấn mạnh danh từ ghép đầu (CHECK-list, DATA-base) và giữ cụm "give me a quick ring" nối mượt.',
    segments: [
      { id: 'shd-07-1', speaker: 'An', text: 'Quick update from design: all four onboarding screens look solid now.', focusWords: ['update', 'onboarding', 'solid'], linkingNote: 'Clean C+V on "look solid" and compound "ON-boarding".', rhythmBeat: 'QUICK UP-date from de-SIGN | ALL FOUR SCREENS look SO-lid' },
      { id: 'shd-07-2', speaker: 'An', text: 'The only tiny blocker left is checking two updated pricing labels.', focusWords: ['only', 'blocker', 'pricing labels'], linkingNote: 'Connect "left + is" smoothly -> "lef-tiz".', rhythmBeat: 'ON-ly TI-ny BLOCK-er LEFT is TWO PRIC-ing LA-bels' },
      { id: 'shd-07-3', speaker: 'Sam', text: 'Awesome, drop those inside the shared folder whenever ready by three!', focusWords: ['shared folder', 'whenever ready', 'by three'], linkingNote: 'Keep dental /θ/ clear on "three" without dropping into "tree".', rhythmBeat: 'DROP those in-SIDE the SHARED FOL-der by THREE' },
    ],
    keyExpressions: [
      { phrase: 'tiny blocker left', meaning: 'Small remaining obstacle holding up completion.', vietnamese: 'vướng mắc nhỏ còn sót lại' },
      { phrase: 'whenever ready', meaning: 'Comfortably at any point you finish checking.', vietnamese: 'khi nào xong xuôi sẵn sàng thì gửi' },
    ],
    reflectionChecklist: ['Stressed Element 1 of "ONboarding" and "UPdate" (as noun).', 'Linked "left is" smoothly without breaking cadence.', 'Kept clear /θ/ opening "three".'],
  }),

  createShadowingSession({
    id: 'shd-m2-08',
    title: 'Podcast Host Energy: Opening an Engaging Story Smoothly (B1)',
    cefrLevel: 'B1',
    topic: 'Podcasts & Curiosity',
    durationLabel: '1:00',
    recommendedRate: 1.0,
    rhythmOverview: 'Warm conversational hook pacing slowing subtly at surprises and rising gently on open questions.',
    vietnameseFocusTip: 'Tập ngắt hơi ngắn đúng cụm nghĩa thay vì đọc tuốt một mạch không nhấn nhá.',
    segments: [
      { id: 'shd-08-1', speaker: 'Host', text: 'Have you ever noticed how tiny habits reshape entire evenings quietly?', focusWords: ['ever noticed', 'tiny habits', 'quietly'], linkingNote: 'Weak "have" -> /həv/ + clean linking "habits" /-ts/.', rhythmBeat: 'E-ver NO-ticed how TI-ny HA-bits re-SHAPE E-venings' },
      { id: 'shd-08-2', speaker: 'Host', text: 'Instead of hunting giant willpower every night, smart planners shrink first steps.', focusWords: ['instead of', 'giant willpower', 'shrink'], linkingNote: 'Link "instead of" -> "instea-dəv".', rhythmBeat: 'in-STEAD of GI-ant WILL-pow-er | SHRINK FIRST STEPS' },
      { id: 'shd-08-3', speaker: 'Host', text: 'Read two single pages—then watch momentum carry the whole chapter effortlessly!', focusWords: ['two single pages', 'momentum', 'effortlessly'], linkingNote: 'Push "-es" cleanly onto /ˈpeɪdʒɪz/ (2 syllables!).', rhythmBeat: 'TWO SIN-gle PA-ges | WATCH mo-MEN-tum CAR-ry' },
    ],
    keyExpressions: [
      { phrase: 'reshape entire evenings', meaning: 'Quietly transform how evenings feel and go.', vietnamese: 'định hình lại hoàn toàn cả buổi tối' },
      { phrase: 'carry the whole chapter', meaning: 'Keep action flowing smoothly far past start.', vietnamese: 'tạo đà đọc trôi suốt cả chương' },
    ],
    reflectionChecklist: ['Pronounced "pages" cleanly as two syllables ending in /ɪz/.', 'Glided smoothly across "instead of".', 'Used curious inviting tone on the opening rhetorical question.'],
  }),

  createShadowingSession({
    id: 'shd-m2-09',
    title: 'Job Interview Strength Summary: Sounding Grounded & Natural (B1)',
    cefrLevel: 'B1',
    topic: 'Career & Interviews',
    durationLabel: '1:00',
    recommendedRate: 1.0,
    rhythmOverview: 'Measured confident cadence pairing crisp verbs ("listened, organized, simplified") smoothly without rushing.',
    vietnameseFocusTip: 'Giữ chắc nguyên âm /ʌ/ ở "customer", âm /z/ ở "results" và nhịp nghỉ nhẹ sau "First...".',
    segments: [
      { id: 'shd-09-1', speaker: 'Candidate', text: 'What I enjoy most about operations work is simplifying messy steps.', focusWords: ['enjoy most', 'operations', 'simplifying'], linkingNote: 'Link "most about" smoothly -> "mos-tə-bout".', rhythmBeat: 'what I en-JOY MOST is SIM-pli-fy-ing MES-sy STEPS' },
      { id: 'shd-09-2', speaker: 'Candidate', text: 'When teammates follow one clear checklist, frantic confusion drops right away.', focusWords: ['checklist', 'frantic', 'right away'], linkingNote: 'Element 1 peak on "CHECKlist"; C+V smoothly "righ-tə-way".', rhythmBeat: 'ONE CLEAR CHECK-list | CON-fu-sion DROPS right a-WAY' },
      { id: 'shd-09-3', speaker: 'Candidate', text: 'That focus directly cut onboarding questions nearly in half last quarter.', focusWords: ['directly', 'nearly in half', 'last quarter'], linkingNote: 'Glide past middle /t/ lightly between consonants on "last quarter".', rhythmBeat: 'CUT ON-boarding QUES-tions NEAR-ly in HALF' },
    ],
    keyExpressions: [
      { phrase: 'simplifying messy steps', meaning: 'Turning confusing procedures tidy and easy to repeat.', vietnamese: 'đơn giản hóa quy trình rối rắm' },
      { phrase: 'cut ... nearly in half', meaning: 'Reduced by nearly 50%.', vietnamese: 'giảm gần một nửa' },
    ],
    reflectionChecklist: ['Paused half a beat after "...is simplifying messy steps" for calm weight.', 'Stressed "CHECKlist" and "ONboarding" cleanly on Element 1.', 'Hit strong crisp /f/ ending on "half".'],
  }),

  createShadowingSession({
    id: 'shd-m2-10',
    title: 'Shopping & Helpful Recommendations: Soft Natural Connected Questions (B1)',
    cefrLevel: 'B1',
    topic: 'Practical Service',
    durationLabel: '0:55',
    recommendedRate: 1.0,
    rhythmOverview: 'Polite upward-then-smoothly-level tone for asking sizes, fabrics, and gentle swaps.',
    vietnameseFocusTip: 'Thả nhẹ /ð/ trong "whether / these / they" đừng đọc cứng thành /d/.',
    segments: [
      { id: 'shd-10-1', speaker: 'Shopper', text: 'Excuse me—do you happen to carry these linen shirts in a medium?', focusWords: ['happen to carry', 'linen shirts', 'medium'], linkingNote: 'Link "shirts in a" smoothly -> "shirt-si-nə".', rhythmBeat: 'HAP-pen to CAR-ry these LI-nen SHIRTS in a ME-dium' },
      { id: 'shd-10-2', speaker: 'Staff', text: 'Let me check our back rack—we received a fresh shipment this morning.', focusWords: ['back rack', 'received', 'fresh shipment'], linkingNote: 'Keep 1-syllable /vd/ on "received" -> "receiv-də fresh".', rhythmBeat: 'CHECK our BACK RACK | re-CEIVED a FRESH SHIP-ment' },
      { id: 'shd-10-3', speaker: 'Shopper', text: 'No rush at all! Thanks so much for checking whether one’s left.', focusWords: ['no rush at all', 'whether', 'left'], linkingNote: 'Link "rush at all" smoothly and buzz gentle /ð/ in "whether".', rhythmBeat: 'no RUSH at ALL | THANKS for CHECK-ing WHE-ther ONE’s LEFT' },
    ],
    keyExpressions: [
      { phrase: 'Do you happen to carry...', meaning: 'Extra-polite softly worded question asking stock.', vietnamese: 'Cho hỏi cửa hàng có bán mặt hàng... không ạ?' },
      { phrase: 'No rush at all!', meaning: 'Kind assurance letting someone take comfortable time.', vietnamese: 'Cứ từ từ không cần vội đâu ạ!' },
    ],
    reflectionChecklist: ['Practiced gentle tooth contact on /ð/ in "these" and "whether".', 'Linked "shirts in a" cleanly without dropping plural "-s".', 'Kept relaxed kind intonation on "No rush at all!".'],
  }),

  createShadowingSession({
    id: 'shd-m2-11',
    title: 'Negotiating Priorities Calmly: B2 Meeting Cadence (B2)',
    cefrLevel: 'B2',
    topic: 'Workplace Trade-offs',
    durationLabel: '1:05',
    recommendedRate: 1.05,
    rhythmOverview: 'Balanced measured pacing highlighting "before...", "instead of...", and "without compromising...".',
    vietnameseFocusTip: 'Giữ nhịp vững chãi khi nói câu dài có mệnh đề phụ; dừng 0.4 giây nhẹ ngay dấu phẩy.',
    segments: [
      { id: 'shd-11-1', speaker: 'Priya', text: 'Before promising all five extras Friday, let’s inspect how tight QA hours look.', focusWords: ['promising', 'inspect', 'tight'], linkingNote: 'Stress "in-SPECT" cleanly on syllable 2 as verb.', rhythmBeat: 'be-FORE PROM-is-ing FIVE EX-tras | IN-spect TIGHT QA HOURS' },
      { id: 'shd-11-2', speaker: 'Dan', text: 'Agreed—shipping three rock-solid core flows beats five rushed prototypes effortlessly.', focusWords: ['rock-solid', 'core flows', 'rushed'], linkingNote: '1-syllable voiceless /ʃt/ cleanly ending "rushed".', rhythmBeat: 'THREE ROCK-SOL-id FLOWS BEATS FIVE RUSHED PRO-to-types' },
      { id: 'shd-11-3', speaker: 'Priya', text: 'Precisely, and rolling polishing tweaks right into Sprint Nine keeps client trust unshaken.', focusWords: ['precisely', 'polishing', 'unshaken'], linkingNote: 'Stretch contrastive fall decisively on "unSHAKen".', rhythmBeat: 'INTO SPRINT NINE KEEPS CLI-ent TRUST un-SHA-ken' },
    ],
    keyExpressions: [
      { phrase: 'rock-solid core flows', meaning: 'Thoroughly reliable essential user features.', vietnamese: 'các luồng tính năng cốt lõi cực kỳ vững chắc' },
      { phrase: 'keeps trust unshaken', meaning: 'Maintains high stakeholder confidence smoothly.', vietnamese: 'giữ vững niềm tin nơi khách hàng' },
    ],
    reflectionChecklist: ['Distinguished crisp 1-syllable "rushed" cleanly.', 'Placed contrastive emphasis cleanly on THREE vs FIVE.', 'Delivered closing word "unshaken" steadily.'],
  }),

  createShadowingSession({
    id: 'shd-m2-12',
    title: 'Media Literacy & Podcast Reasoning: Unpacking Headlines (B2)',
    cefrLevel: 'B2',
    topic: 'Critical Thinking',
    durationLabel: '1:10',
    recommendedRate: 1.05,
    rhythmOverview: 'Crisp analytical rising pauses ("Granted...", "However...") paired with confident declarative punchlines.',
    vietnameseFocusTip: 'Chú ý bật nhẹ âm /d/ ở "granted", /t/ ở "shortcut", và tách nhịp giữa "however" và mệnh đề chính.',
    segments: [
      { id: 'shd-12-1', speaker: 'Speaker', text: 'Flashy single-number headlines grab clicks effortlessly across crowded morning feeds.', focusWords: ['single-number', 'effortlessly', 'crowded'], linkingNote: 'Blend "grab clicks" swiftly without breaking rhythm.', rhythmBeat: 'FLASH-y SINGLE-NUM-ber HEAD-lines GRAB CLICKS EF-fort-less-ly' },
      { id: 'shd-12-2', speaker: 'Speaker', text: 'Granted, short visual summaries spark curiosity—yet curiosity shouldn’t replace checking baseline control groups.', focusWords: ['granted', 'spark curiosity', 'control groups'], linkingNote: 'Use 2-syllable /ɪd/ cleanly on "granted" before tiny micro-pause!', rhythmBeat: 'GRAN-ted, SUM-ma-ries SPARK | YET CHECK BASE-line GROUPS' },
      { id: 'shd-12-3', speaker: 'Speaker', text: 'Asking who wasn’t measured routinely tells twice as much story as bold chart arrows.', focusWords: ['wasn’t measured', 'routinely', 'bold arrows'], linkingNote: 'Notice weak "as" around "TWICE əz MUCH".', rhythmBeat: 'WHO WAS-n’t MEA-sured TELLS TWICE as MUCH' },
    ],
    keyExpressions: [
      { phrase: 'spark curiosity', meaning: 'Awaken initial interest smoothly.', vietnamese: 'khơi gợi sự tò mò tìm hiểu' },
      { phrase: 'baseline control groups', meaning: 'Unchanged reference cohorts verifying genuine effect.', vietnamese: 'nhóm đối chứng nền tảng chuẩn' },
    ],
    reflectionChecklist: ['Paused smoothly after "Granted,".', 'Lightened "as" in "TWICE as MUCH".', 'Kept smooth steady cadence through long clauses.'],
  }),

  createShadowingSession({
    id: 'shd-m2-13',
    title: 'Urban Architecture Commentary: Walkable Streets & Civic Warmth (B2)',
    cefrLevel: 'B2',
    topic: 'Cities & Society',
    durationLabel: '1:05',
    recommendedRate: 1.05,
    rhythmOverview: 'Lyrical steady rhythm highlighting contrasting urban textures ("shaded benches", "roaring lanes").',
    vietnameseFocusTip: 'Giữ rõ phân biệt âm /θ/ và /ð/ cùng độ vang của phụ âm cuối ở các tính từ mô tả.',
    segments: [
      { id: 'shd-13-1', speaker: 'Host', text: 'Great streets rarely feel impressive purely for towering glass height from highways.', focusWords: ['rarely', 'purely', 'towering'], linkingNote: 'Glide /r/ cleanly across both syllables of "rarely" and "towering".', rhythmBeat: 'GREAT STREETS RARE-ly feel im-PRES-sive PURE-ly for HEIGHT' },
      { id: 'shd-13-2', speaker: 'Host', text: 'Instead, human warmth thrives beside waist-high greenery, slow benches, and lively ground-floor corners.', focusWords: ['thrives', 'waist-high', 'ground-floor'], linkingNote: 'Press dental /θ/ cleanly launching "thrives" ending in /vz/.', rhythmBeat: 'HU-man WARMTH THRIVES be-side GREE-ner-y and COR-ners' },
      { id: 'shd-13-3', speaker: 'Host', text: 'Slowing footsteps naturally invites spontaneous greetings among otherwise hurried neighbors.', focusWords: ['spontaneous', 'greetings', 'otherwise'], linkingNote: 'Link "among otherwise" cleanly around weak vowels.', rhythmBeat: 'SLOW-ing FOOT-steps in-VITES spon-TA-ne-ous GREE-tings' },
    ],
    keyExpressions: [
      { phrase: 'ground-floor corners', meaning: 'Street-level active shopfronts bringing sidewalks alive.', vietnamese: 'góc tầng trệt nhộn nhịp sát vỉa hè' },
      { phrase: 'hurried neighbors', meaning: 'Busy residents normally rushing straight indoors.', vietnamese: 'hàng xóm bận rộn vội vã' },
    ],
    reflectionChecklist: ['Pronounced "thrives" smoothly from /θ/ -> /vz/.', 'Put Element 1 peak on "FOOTsteps" and "GROUND-floor".', 'Sustained smooth descriptive flow across clauses.'],
  }),

  createShadowingSession({
    id: 'shd-m2-14',
    title: 'Academic Science Framing: Turning Complex Terms Into Crisp Imagery (B2)',
    cefrLevel: 'B2',
    topic: 'Science & Learning',
    durationLabel: '1:10',
    recommendedRate: 1.05,
    rhythmOverview: 'Clear instructive stress lifting new definitions upward then pausing gently to let imagery settle.',
    vietnameseFocusTip: 'Chú ý hạ giọng tự nhiên cuối câu giải thích và giữ nhịp nhấn đều vào cặp từ ẩn dụ.',
    segments: [
      { id: 'shd-14-1', speaker: 'Lecturer', text: 'Imagine learning new English verbs less like locking shiny trophies inside glass cabinets.', focusWords: ['imagine', 'locking', 'cabinets'], linkingNote: 'Compress middle syllable cleanly on "CABinets" (/ˈkæbɪnɪts/).', rhythmBeat: 'i-MA-gine LEARN-ing VERBS LESS like LOCK-ing TRO-phies' },
      { id: 'shd-14-2', speaker: 'Lecturer', text: 'Picture instead planting sturdy trail markers you actively walk past twice weekly.', focusWords: ['sturdy', 'trail markers', 'actively'], linkingNote: 'Contrastive pause lightly right after "instead".', rhythmBeat: 'PIC-ture in-STEAD PLAN-ting STUR-dy TRAIL MAR-kers' },
      { id: 'shd-14-3', speaker: 'Lecturer', text: 'Each time active retrieval touches one faded word, memory deepens that gravel path unmistakably!', focusWords: ['retrieval', 'faded', 'unmistakably'], linkingNote: 'Let "un-mis-TAK-a-bly" peak boldly on syllable 3.', rhythmBeat: 'EACH TIME RE-TRIEV-al TOU-ches | DEE-pens un-mis-TAK-ably' },
    ],
    keyExpressions: [
      { phrase: 'trail markers', meaning: 'Reliable guideposts keeping hikers on steady paths.', vietnamese: 'cọc chỉ dấu dẫn đường' },
      { phrase: 'active retrieval', meaning: 'Trying cleanly to recall answers from memory before checking hints.', vietnamese: 'chủ động tự truy xuất trí nhớ' },
    ],
    reflectionChecklist: ['Hit primary stress cleanly on "reTRIEVal" and "unmisTAKably".', 'Paired "instead" pause cleanly before metaphor.', 'Delivered enthusiastic confident scientific cadence.'],
  }),

  createShadowingSession({
    id: 'shd-m2-15',
    title: 'Storytelling Turning Point: Expressive Pauses & Pacing Shifts (B2)',
    cefrLevel: 'B2',
    topic: 'Reflective Narrative',
    durationLabel: '1:05',
    recommendedRate: 1.0,
    rhythmOverview: 'Notice shifting gear smoothly: brisk rushed phrases for early stress -> unhurried slower cadence at emotional release.',
    vietnameseFocusTip: 'Thay đổi tốc độ nhịp theo cảm xúc đoạn văn: đoạn vội nhanh hơn một chút, đoạn lắng dịu chậm rãi nhẹ nhàng.',
    segments: [
      { id: 'shd-15-1', speaker: 'Storyteller', text: 'All afternoon I raced tightly through emails, deadlines, and crowded subway platforms.', focusWords: ['raced tightly', 'deadlines', 'crowded'], linkingNote: 'Quick crisp consonant flow conveying genuine rush.', rhythmBeat: 'RACED TIGHT-ly through E-mails DEAD-lines PLAT-forms' },
      { id: 'shd-15-2', speaker: 'Storyteller', text: 'Then stepping off onto quiet evening hills, pine needles cooled every sharp hurry away.', focusWords: ['stepping off', 'pine needles', 'cooled'], linkingNote: 'Link "stepping off" -> "step-ping-off"; soften voice speed slightly.', rhythmBeat: 'STEP-ping off onto QUI-et HILLS | COOLED ev-ery HUR-ry a-WAY' },
      { id: 'shd-15-3', speaker: 'Storyteller', text: 'Sometimes catching calm stillness teaches more clearly than chasing another hour.', focusWords: ['calm stillness', 'clearly', 'chasing'], linkingNote: 'Gentle downward peace across "another hour".', rhythmBeat: 'CATCH-ing CALM STILL-ness TEA-ches CLEAR-ly' },
    ],
    keyExpressions: [
      { phrase: 'cooled every hurry away', meaning: 'Soothingly dissolved rushed nervousness.', vietnamese: 'làm dịu tan mọi sự hối hả' },
      { phrase: 'chasing another hour', meaning: 'Obsessively cramming yet one more frantic task.', vietnamese: 'mải miết đuổi theo thêm từng giờ bận rộn' },
    ],
    reflectionChecklist: ['Deliberately slowed tempo slightly entering Segment 2.', 'Kept smooth 1-syllable "cooled" (/kuːld/).', 'Let calm stillness settle cleanly on closing phrase.'],
  }),

  createShadowingSession({
    id: 'shd-m2-16',
    title: 'C1 Seminar Synthesis: Nuanced Concession & Conditional Balancing (C1)',
    cefrLevel: 'C1',
    topic: 'Academic Discourse',
    durationLabel: '1:15',
    recommendedRate: 1.1,
    rhythmOverview: 'Controlled executive pitch stepping gracefully through concessions ("At first glance...") toward refined precision.',
    vietnameseFocusTip: 'Giữ trọng âm sắc nét ở "superficial", "insofar", và hạ âm nhẹ ở các cụm đệm giải thích.',
    segments: [
      { id: 'shd-16-1', speaker: 'Scholar', text: 'At first glance, stripping human friction altogether out of civic errands looks purely liberating.', focusWords: ['at first glance', 'friction', 'liberating'], linkingNote: 'Slightly lifted skeptical fall-rise on "purely liberating".', rhythmBeat: 'at FIRST GLANCE | STRIP-ping FRIC-tion looks PURE-ly LIB-er-a-ting' },
      { id: 'shd-16-2', speaker: 'Scholar', text: 'Yet sociological field surveys point toward a subtler trade-off insofar as daily micro-chats build quiet neighborhood trust.', focusWords: ['subtler trade-off', 'insofar as', 'neighborhood trust'], linkingNote: 'Maintain soft silent /t/ inside "subtler" (/ˈsʌtlər/)!', rhythmBeat: 'SUB-tler TRADE-off in-so-FAR as MI-cro-chats BUILD TRUST' },
      { id: 'shd-16-3', speaker: 'Scholar', text: 'Efficiency serves citizens admirably only provided shared public squares keep unhurried spaces welcoming everyone.', focusWords: ['admirably', 'provided', 'welcoming'], linkingNote: 'Stress syllable 1 crisply on "ADmirably" (/ˈædmərəbli/).', rhythmBeat: 'SERVES CIT-i-zens AD-mir-ably | ON-ly pro-VI-ded SQUARES KEEP SPACE' },
    ],
    keyExpressions: [
      { phrase: 'micro-chats build trust', meaning: 'Tiny pleasant daily greetings creating social warmth.', vietnamese: 'những lời chào hỏi nhỏ hằng ngày xây dựng niềm tin cộng đồng' },
      { phrase: 'insofar as', meaning: 'Formal precision connector specifying "to the exact degree that".', vietnamese: 'xét ở mức độ mà' },
    ],
    reflectionChecklist: ['Silent T cleanly maintained inside "subtler" (/ˈsʌtlər/).', 'Correctly stressed syllable 1 on "ADmirably".', 'Maintained steady poise at 1.1x speed cleanly.'],
  }),

  createShadowingSession({
    id: 'shd-m2-17',
    title: 'Diplomatic Upward Pushback: Disagreeing Smoothly Without Tension (C1)',
    cefrLevel: 'C1',
    topic: 'Executive Diplomacy',
    durationLabel: '1:10',
    recommendedRate: 1.1,
    rhythmOverview: 'Warm affirming rise upfront transforming cleanly into firm unhurried data calibration.',
    vietnameseFocusTip: 'Âm điệu điềm tĩnh không cao giọng gay gắt khi phản bác—dùng nhịp dừng tinh tế trước "however".',
    segments: [
      { id: 'shd-17-1', speaker: 'Lead', text: 'Your instinct targeting customer onboarding speed definitely lands squarely on our biggest lever.', focusWords: ['instinct', 'onboarding', 'squarely'], linkingNote: 'Steady affirming warmth throughout sentence 1.', rhythmBeat: 'your IN-stinct tar-ge-ting SPEED LANDS SQUARE-ly on LE-ver' },
      { id: 'shd-17-2', speaker: 'Lead', text: 'Before cutting helpful human orientation checks altogether, though, exit logs suggest anxious newcomers relied strongly on them.', focusWords: ['orientation checks', 'exit logs', 'anxious newcomers'], linkingNote: 'Keep final parenthetical "though" smooth and rising lightly.', rhythmBeat: 'be-FORE CUT-ting CHECKS though | EX-it LOGS show ANX-ious NEW-comers' },
      { id: 'shd-17-3', speaker: 'Lead', text: 'Testing an optional express fast-track preserves newcomer warmth while still unblocking seasoned users immediately.', focusWords: ['express fast-track', 'preserves', 'unblocking'], linkingNote: 'Contrastive lift on "OPtional" vs "SEAsoned".', rhythmBeat: 'OP-tional EXPRESS fast-track pre-SERVES WARMTH while UN-block-ing USERS' },
    ],
    keyExpressions: [
      { phrase: 'lands squarely on', meaning: 'Accurately targets the central crucial point.', vietnamese: 'đánh trúng vào trọng tâm vấn đề' },
      { phrase: 'optional express fast-track', meaning: 'Volunteer skip lane keeping defaults supportive for beginners.', vietnamese: 'lối đi tắt tùy chọn linh hoạt' },
    ],
    reflectionChecklist: ['Sounded genuinely collaborative in Segment 1 before pivoting cleanly.', 'Delivered "though" gently mid-clause without sounding defensive.', 'Maintained smooth unhurried control at natural pace.'],
  }),

  createShadowingSession({
    id: 'shd-m2-18',
    title: 'Rapid Connected Idiomatic Debate & Hedging (C1)',
    cefrLevel: 'C1',
    topic: 'Debate & Persuasion',
    durationLabel: '1:05',
    recommendedRate: 1.15,
    rhythmOverview: 'Brisk natural conversational pace integrating weak forms, elision, and idiomatic pivots seamlessly.',
    vietnameseFocusTip: 'Tăng tốc nhẹ lên 1.15x theo nhịp nói tự nhiên bản xứ; giữ rõ cụm "fair enough" và "by and large".',
    segments: [
      { id: 'shd-18-1', speaker: 'Speaker A', text: 'Fair enough—quarterly KPIs catch sloppy leaks, yet worshipping strict metrics blindly breeds narrow tunnel vision.', focusWords: ['fair enough', 'sloppy leaks', 'tunnel vision'], linkingNote: 'Link "fair enough" smoothly -> "fai-rə-nʌf".', rhythmBeat: 'FAIR e-NOUGH | WOR-ship-ping MET-rics BREEDS TUN-nel VI-sion' },
      { id: 'shd-18-2', speaker: 'Speaker B', text: 'By and large true, though leaving ambiguous creative teams zero shared yardsticks risks drifting sideways quietly.', focusWords: ['by and large', 'yardsticks', 'sideways'], linkingNote: 'Compress "and" effortlessly inside "by ’n large".', rhythmBeat: 'BY ’n LARGE TRUE | ZERO YARD-sticks RISKS DRIF-ting SIDE-ways' },
      { id: 'shd-18-3', speaker: 'Speaker A', text: 'Then pair three crisp outcome anchors alongside real space to question bad targets openly!', focusWords: ['outcome anchors', 'real space', 'openly'], linkingNote: 'Clear downward closure landing firmly on "OPenly!".', rhythmBeat: 'PAIR OUT-come AN-chors with SPACE to QUES-tion O-pen-ly' },
    ],
    keyExpressions: [
      { phrase: 'breeds tunnel vision', meaning: 'Makes workers focus blindly on one number while ignoring overall health.', vietnamese: 'tạo ra tầm nhìn thiển cận hẹp hòi' },
      { phrase: 'shared yardsticks', meaning: 'Agreed fair standards evaluating real progress.', vietnamese: 'thước đo chuẩn mực chung' },
    ],
    reflectionChecklist: ['Glided cleanly through "fair enough" and "by and large".', 'Caught rapid "-ks" and "-ts" clusters without stumbling at 1.15x.', 'Delivered clear assertive close on "openly!".'],
  }),

  createShadowingSession({
    id: 'shd-m2-19',
    title: 'Poetic Precision & Literary Irony Cadence (C2)',
    cefrLevel: 'C2',
    topic: 'Culture & Essays',
    durationLabel: '1:10',
    recommendedRate: 1.05,
    rhythmOverview: 'Deliberate rhetorical pacing balancing crisp Latinate polish right beside dry understated wit.',
    vietnameseFocusTip: 'Giữ khoảng ngắt nhỏ trước từ mang sắc thái mỉa nhẹ để tạo chiều sâu duyên dáng C2.',
    segments: [
      { id: 'shd-19-1', speaker: 'Essayist', text: 'Few modern inventions conceal astonishing complexity so effortlessly beneath quiet household humility as the modest thermos.', focusWords: ['conceal', 'effortlessly', 'humility'], linkingNote: 'Give gentle breathing rise onto "so effortlessly".', rhythmBeat: 'FEW in-VEN-tions con-CEAL com-PLEX-i-ty be-neath HUM-ble THER-mos' },
      { id: 'shd-19-2', speaker: 'Essayist', text: 'Outwardly unadorned, double-walled vacuum silver silently refuses thermal compromise—cradling winter soup scalding across icy summits.', focusWords: ['unadorned', 'silently refuses', 'scalding'], linkingNote: 'Hold crisp /ld/ gently inside "scalding" before cool "summits".', rhythmBeat: 'OUT-ward-ly un-a-DORNED | SI-lent-ly re-FU-ses COM-pro-mise' },
      { id: 'shd-19-3', speaker: 'Essayist', text: 'Perhaps civilization peaks not with noisy chrome rockets, merely ordinary quiet objects performing promises faithfully.', focusWords: ['chrome rockets', 'performing', 'faithfully'], linkingNote: 'Pause lightly before gentle quiet twist: "merely ordinary...".', rhythmBeat: 'PEAKS NOT with NOISE | MERE-ly QUI-et OB-jects FAITH-ful-ly' },
    ],
    keyExpressions: [
      { phrase: 'outwardly unadorned', meaning: 'Looking simple and unpretentious on the surface.', vietnamese: 'vẻ ngoài mộc mạc giản dị không phô trương' },
      { phrase: 'performing promises faithfully', meaning: 'Doing honest reliable duty consistently without fanfare.', vietnamese: 'làm tròn bổn phận âm thầm bền bỉ' },
    ],
    reflectionChecklist: ['Balanced poised rhythm cleanly without sounding theatrical.', 'Executed clean breathing pause right before "merely ordinary...".', 'Mastered clear /θ/ inside "faithfully".'],
  }),

  createShadowingSession({
    id: 'shd-m2-20',
    title: 'High-Speed Elliptical Film Debate & Witty Repartee (C2)',
    cefrLevel: 'C2',
    topic: 'Natural Dialogue Speed',
    durationLabel: '1:05',
    recommendedRate: 1.2,
    rhythmOverview: 'Crisp fast native exchange dropping predictable opening words smoothly while retaining razor-sharp stress irony.',
    vietnameseFocusTip: 'Theo kịp tốc độ tự nhiên 1.2x; lược âm gọn ở "wouldn’t", "could’ve", và nhấn mạnh các tính từ đánh giá.',
    segments: [
      { id: 'shd-20-1', speaker: 'Alex', text: 'Couldn’t possibly watch another three-hour monochrome epic right after Tuesday’s spreadsheet marathon!', focusWords: ['couldn’t possibly', 'monochrome', 'marathon'], linkingNote: 'Drop opening "I" cleanly; soften "possibly" briskly.', rhythmBeat: 'COULD-n’t POS-si-bly WATCH THREE-hour EP-ic right af-ter SPREAD-sheets' },
      { id: 'shd-20-2', speaker: 'Sam', text: 'Fair call—looks gorgeous on giant theater screens, though brisk ninety-minute comedies definitely save knees and Mondays.', focusWords: ['fair call', 'looks gorgeous', 'definitely'], linkingNote: 'Drop "it" silently before "looks gorgeous".', rhythmBeat: 'FAIR CALL | LOOKS GOR-geous | BRISK COM-e-dies SAVE MON-days' },
      { id: 'shd-20-3', speaker: 'Alex', text: 'Sold—lighthearted neighborhood mystery plus crispy dumplings straight down the block!', focusWords: ['sold', 'lighthearted', 'crispy dumplings'], linkingNote: 'Warm cheerful landing beat falling crisply on "down the block!".', rhythmBeat: 'SOLD | LIGHT-hear-ted MYS-ter-y plus DUMP-lings DOWN the BLOCK' },
    ],
    keyExpressions: [
      { phrase: 'Fair call', meaning: 'Crisp gracious concession meaning "Reasonable judgment—I agree!".', vietnamese: 'Ý kiến hợp lý đấy / chuẩn không cãi!' },
      { phrase: 'Sold!', meaning: 'Instant playful agreement ("Count me in immediately!").', vietnamese: 'Chốt luôn!' },
    ],
    reflectionChecklist: ['Kept effortless fluency at 1.2x speed without rushing pauses.', 'Pronounced "gorgeous" cleanly as /ˈɡɔːrdʒəs/ finishing softly on /s/.', 'Matched playful snappy back-and-forth energy naturally.'],
  }),
];
