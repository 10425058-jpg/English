import type { ShadowingSession } from '@english-quest/shared';
import { createShadowingSession } from './helpers';

export const SHADOWING_SESSIONS_BATCH2: ShadowingSession[] = [
  createShadowingSession({
    id: 'shd-m2-21',
    title: 'Ordering Calmly at a Busy Bakery Counter',
    cefrLevel: 'A1',
    topic: 'Everyday Polite Requests',
    durationLabel: '1:10',
    recommendedRate: 0.85,
    rhythmOverview: 'Steady friendly cadence emphasizing key item counts and soft polite rising questions.',
    vietnameseFocusTip: 'Link "two warm" smoothly and soften polite ending "please" upward lightly.',
    segments: [
      { id: 'shd21-1', speaker: 'Customer', text: 'Good morning! Could I have two warm croissants, please?', focusWords: ['Good morning', 'two', 'croissants'], linkingNote: 'Could_I glides smoothly; croissants_please links lightly.', rhythmBeat: 'good MOR-ning | could i HAVE | TWO WARM crois-SANTS, please' },
      { id: 'shd21-2', speaker: 'Baker', text: 'Of course! Would you like them warmed up in a paper bag?', focusWords: ['course', 'warmed up', 'paper bag'], linkingNote: 'warmed_up links past /d/ directly onto "up".', rhythmBeat: 'of COURSE | would you LIKE them | WARMED UP in a PA-per bag' },
      { id: 'shd21-3', speaker: 'Customer', text: 'Yes, please, and one cup of mild green tea without sugar.', focusWords: ['one cup', 'mild', 'tea', 'sugar'], linkingNote: 'cup_of compresses "of" to light schwa /ə/.', rhythmBeat: 'YES, please | and ONE cup of MILD green TEA with-OUT SU-gar' },
    ],
    keyExpressions: [
      { phrase: 'Could I have ... please?', meaning: 'Polite warm request ordering food or service items', vietnamese: 'Cho tôi gọi ... nhé ạ' },
      { phrase: 'warmed up', meaning: 'Heated lightly back to pleasant oven freshness', vietnamese: 'được làm ấm giòn lại' },
    ],
    reflectionChecklist: [
      'Linked "warmed_up" without dropping final -d cleanly.',
      'Softened rising polite inflection gently at question ends.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-22',
    title: 'Checking Bus Stop Directions Outside the Library',
    cefrLevel: 'A1',
    topic: 'Local Directions & Numbers',
    durationLabel: '1:15',
    recommendedRate: 0.85,
    rhythmOverview: 'Clear pause groups separating distance landmarks cleanly ("two short blocks", "beside the post office").',
    vietnameseFocusTip: 'Articulate clean /st/ in "first" and "post", avoiding dropping final plural "-s" on "blocks".',
    segments: [
      { id: 'shd22-1', speaker: 'Walker', text: 'Excuse me, does Bus Twelve stop near Willow Park?', focusWords: ['Bus Twelve', 'Willow Park'], linkingNote: 'Excuse_me glides gently up in politeness.', rhythmBeat: 'ex-CUSE me | does BUS TWELVE | STOP near WIL-low park' },
      { id: 'shd22-2', speaker: 'Local', text: 'Yes! Walk straight past the bakery, then turn left at the clock.', focusWords: ['Walk straight', 'bakery', 'turn left'], linkingNote: 'left_at links /t/ smoothly into "at".', rhythmBeat: 'YES | WALK STRAIGHT past the BA-kery | then TURN LEFT at the CLOCK' },
      { id: 'shd22-3', speaker: 'Local', text: 'You will see the green shelter waiting right across from you.', focusWords: ['green shelter', 'across'], linkingNote: 'right_across links briskly via gentle US flap or crisp UK /t/.', rhythmBeat: 'you’ll SEE the GREEN SHEL-ter | RIGHT a-CROSS from you' },
    ],
    keyExpressions: [
      { phrase: 'Walk straight past', meaning: 'Keep moving forward beyond a landmark without turning', vietnamese: 'Đi thẳng ngang qua phía trước' },
      { phrase: 'right across from', meaning: 'Directly facing on the opposite side of the lane', vietnamese: 'ngay phía đối diện bên kia' },
    ],
    reflectionChecklist: [
      'Held clear pauses between street steps so listener absorbs calmly.',
      'Distinguished "walk straight" cleanly without trailing -ly.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-23',
    title: 'Sharing Sunny Saturday Picnic Plans at Lunch',
    cefrLevel: 'A1',
    topic: 'Friendly Weekend Chats',
    durationLabel: '1:15',
    recommendedRate: 0.9,
    rhythmOverview: 'Upbeat friendly rhythm linking time details calmly across short natural clauses.',
    vietnameseFocusTip: 'Blend "going to" calmly toward smooth conversational cadence while keeping main verbs lively.',
    segments: [
      { id: 'shd23-1', speaker: 'Friend A', text: 'Are you free this Saturday morning after nine o’clock?', focusWords: ['free', 'Saturday', 'nine'], linkingNote: 'nine_o’clock flows smoothly together.', rhythmBeat: 'are you FREE | this SA-turday MOR-ning | AF-ter NINE o’clock' },
      { id: 'shd23-2', speaker: 'Friend B', text: 'I think so! My sister and I want to picnic near the fountain.', focusWords: ['think so', 'sister', 'picnic', 'fountain'], linkingNote: 'sister_and_I drops "and" lightly to /ən/.', rhythmBeat: 'i THINK so | my SIS-ter and i want to PIC-nic | NEAR the FOUN-tain' },
      { id: 'shd23-3', speaker: 'Friend A', text: 'Wonderful! I will bring cold mango juice and fresh bread.', focusWords: ['Wonderful', 'mango juice', 'fresh bread'], linkingNote: 'juice_and reduces "and" cleanly.', rhythmBeat: 'WON-derful | i’ll BRING cold MAN-go juice | and FRESH BREAD' },
    ],
    keyExpressions: [
      { phrase: 'Are you free ...?', meaning: 'Polite relaxed way to check open free time', vietnamese: 'Bạn có rảnh vào lúc ... không?' },
      { phrase: 'I think so!', meaning: 'Warm flexible affirmative when plans look likely', vietnamese: 'Mình nghĩ là được đấy!' },
    ],
    reflectionChecklist: [
      'Matched warm upward surprise on "Wonderful!" without monotone.',
      'Reduced "and" softly to /ən/ between food nouns.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-24',
    title: 'Describing a Tidy Study Desk to a Pen Pal',
    cefrLevel: 'A1',
    topic: 'Home & Objects',
    durationLabel: '1:10',
    recommendedRate: 0.85,
    rhythmOverview: 'Calm descriptive flow highlighting prepositions ("beside", "inside", "above") gently.',
    vietnameseFocusTip: 'Separate crisp plural "There_are" clearly from singular "There_is" linking smoothly onto nouns.',
    segments: [
      { id: 'shd24-1', speaker: 'Narrator', text: 'Next to my wide bedroom window stands a small pine desk.', focusWords: ['bedroom window', 'pine desk'], linkingNote: 'Next_to softens /t/ smoothly without pausing.', rhythmBeat: 'NEXT to my WIDE bed-room WIN-dow | STANDS a SMALL pine DESK' },
      { id: 'shd24-2', speaker: 'Narrator', text: 'There are three blue notebooks and one warm lamp on top.', focusWords: ['three blue', 'notebooks', 'warm lamp'], linkingNote: 'notebooks_and slides cleanly forward.', rhythmBeat: 'there are THREE blue NOTE-books | and ONE warm LAMP on TOP' },
      { id: 'shd24-3', speaker: 'Narrator', text: 'In the evening, I read quietly here with hot cinnamon tea.', focusWords: ['evening', 'read quietly', 'cinnamon tea'], linkingNote: 'In_the slides lightly as quick /ɪnðə/.', rhythmBeat: 'in the EV-ening | i READ QUI-etly here | with HOT CIN-namon TEA' },
    ],
    keyExpressions: [
      { phrase: 'on top', meaning: 'Resting cleanly upon upper desk surface', vietnamese: 'ở phía trên mặt bàn' },
      { phrase: 'quietly', meaning: 'Calmly without loud background noise', vietnamese: 'một cách yên tĩnh nhẹ nhàng' },
    ],
    reflectionChecklist: [
      'Kept plural "-s" clearly audible on "notebooks".',
      'Paused lightly right after "In the evening," before reading main action.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-25',
    title: 'Checking Home Wi-Fi & Helping Grandparents Gently',
    cefrLevel: 'A1',
    topic: 'Helpful Family Conversations',
    durationLabel: '1:15',
    recommendedRate: 0.85,
    rhythmOverview: 'Patient reassuring pacing giving clear simple action steps calmly.',
    vietnameseFocusTip: 'Hold calm friendly tone cleanly while linking "turn_it_off" and "wait_a minute".',
    segments: [
      { id: 'shd25-1', speaker: 'Grandma', text: 'Oh dear, my reading tablet stopped loading recipes again.', focusWords: ['reading tablet', 'stopped', 'recipes'], linkingNote: 'stopped ends cleanly with voiceless /t/ before "loading".', rhythmBeat: 'oh DEAR | my READ-ing TAB-let | STOPPED load-ing RE-cipes a-GAIN' },
      { id: 'shd25-2', speaker: 'Grandson', text: 'No problem! Let us press this small switch and wait ten seconds.', focusWords: ['No problem', 'small switch', 'ten seconds'], linkingNote: 'Let_us glides naturally toward casual "Let’s".', rhythmBeat: 'NO PROB-lem | let’s PRESS this SMALL SWITCH | and WAIT TEN SEC-onds' },
      { id: 'shd25-3', speaker: 'Grandma', text: 'Aha, the bright green icon came right back! Thank you kindly.', focusWords: ['bright green', 'came back', 'Thank you'], linkingNote: 'Thank_you blends gently forward.', rhythmBeat: 'a-HA | the BRIGHT green I-con | CAME right BACK | THANK you KIND-ly' },
    ],
    keyExpressions: [
      { phrase: 'come right back', meaning: 'Return smoothly online right away', vietnamese: 'hiện lại ngay tức thì' },
      { phrase: 'wait ten seconds', meaning: 'Pause patiently briefly for reset recovery', vietnamese: 'chờ nhẹ mười giây' },
    ],
    reflectionChecklist: [
      'Pronounced "stopped" cleanly in 1 crisp syllable (no fake "-id").',
      'Matched warm cheerful relief intonation on "Aha!".',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-26',
    title: 'Requesting Quiet Hotel Room Switching Politely',
    cefrLevel: 'A2',
    topic: 'Travel Check-In Problem Solving',
    durationLabel: '1:25',
    recommendedRate: 0.9,
    rhythmOverview: 'Respectful problem-solving stress emphasizing polite requests ("if possible") calmly.',
    vietnameseFocusTip: 'Soften requests gently with subtle upward tails rather than flat choppy demands.',
    segments: [
      { id: 'shd26-1', speaker: 'Guest', text: 'Excuse me, my room faces heavy street traffic outside.', focusWords: ['Excuse me', 'street traffic'], linkingNote: 'Excuse_me smoothly sets gracious greeting rhythm.', rhythmBeat: 'ex-CUSE me | my ROOM FA-ces | HEA-vy STREET TRAF-fic' },
      { id: 'shd26-2', speaker: 'Clerk', text: 'I am so sorry about that noise! Let me check quiet courtyard rooms.', focusWords: ['sorry', 'noise', 'courtyard'], linkingNote: 'sorry_about blends smoothly cleanly.', rhythmBeat: 'i’m SO SOR-ry about that NOISE | let me CHECK QUI-et COURT-yard rooms' },
      { id: 'shd26-3', speaker: 'Clerk', text: 'We have a sunny room on floor four available right away.', focusWords: ['sunny room', 'floor four', 'right away'], linkingNote: 'right_away flips /t/ softly onward onto "a-way".', rhythmBeat: 'we’ve a SUN-ny room on FLOOR FOUR | a-VAIL-able RIGHT a-WAY' },
    ],
    keyExpressions: [
      { phrase: 'faces street traffic', meaning: 'Looks out directly toward a loud busy avenue', vietnamese: 'hướng mặt ra đường xe cộ ồn ào' },
      { phrase: 'available right away', meaning: 'Clean and ready to enter immediately', vietnamese: 'còn phòng trống sẵn sàng ngay lập tức' },
    ],
    reflectionChecklist: [
      'Balanced empathetic apology rhythm ("I am SO sorry...") smoothly.',
      'Linked "right_away" seamlessly without stopping hard between words.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-27',
    title: 'Borrowing Notes & Comparing Study Schedules With Friends',
    cefrLevel: 'A2',
    topic: 'Campus Daily Life',
    durationLabel: '1:20',
    recommendedRate: 0.9,
    rhythmOverview: 'Quick conversational back-and-forth highlighting polite gratitude and time alignment.',
    vietnameseFocusTip: 'Keep "-ing" clean without extra trailing consonant in "studying / reading".',
    segments: [
      { id: 'shd27-1', speaker: 'Student A', text: 'Thanks again for lending me your history summary yesterday!', focusWords: ['lending', 'history', 'yesterday'], linkingNote: 'Thanks_again links /s/ right forward onto "again".', rhythmBeat: 'THANKS a-GAIN for LEN-ding me | your HIS-tory SUM-mary YES-terday' },
      { id: 'shd27-2', speaker: 'Student B', text: 'Anytime! Did the green highlights help clarify chapter six?', focusWords: ['Anytime', 'highlights', 'chapter six'], linkingNote: 'clarify flows clearly across 3 light beats.', rhythmBeat: 'A-nytime | did the GREEN HIGH-lights | HELP CLA-rify chap-ter SIX' },
      { id: 'shd27-3', speaker: 'Student A', text: 'Huge help! Could I buy you warm iced coffee after Thursday’s seminar?', focusWords: ['Huge help', 'Thursday’s seminar'], linkingNote: 'Could_I merges cleanly with mild rise.', rhythmBeat: 'HUGE HELP | could i BUY you cof-fee | AF-ter THURS-day’s SEM-inar' },
    ],
    keyExpressions: [
      { phrase: 'Anytime!', meaning: 'Warm cheerful response accepting thanks casually', vietnamese: 'Không có gì đâu / sẵn lòng mà!' },
      { phrase: 'Huge help!', meaning: 'Natural spoken gratitude for genuinely helpful notes', vietnamese: 'Giúp ích cực kỳ nhiều luôn!' },
    ],
    reflectionChecklist: [
      'Linked "Thanks_again" fluidly in single natural breath.',
      'Pronounced "history" naturally in 2 or 3 light smooth beats.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-28',
    title: 'Explaining Symptoms Calmly at a Neighborhood Pharmacy',
    cefrLevel: 'A2',
    topic: 'Health & Everyday Erands',
    durationLabel: '1:25',
    recommendedRate: 0.9,
    rhythmOverview: 'Calm steady phrasing clarifying duration ("for three days") and dosage frequency clearly.',
    vietnameseFocusTip: 'Avoid rushing exact number instructions ("twice_a day after meals") cleanly!',
    segments: [
      { id: 'shd28-1', speaker: 'Patient', text: 'Hello, I have had a dry tickly cough since Tuesday night.', focusWords: ['dry tickly cough', 'Tuesday night'], linkingNote: 'have_had collapses cleanly as "I’ve had a".', rhythmBeat: 'hel-LO | i’ve HAD a DRY tick-ly COUGH | since TUES-day NIGHT' },
      { id: 'shd28-2', speaker: 'Pharmacist', text: 'Any fever yet, or mostly scratchy throat irritation at dusk?', focusWords: ['fever', 'scratchy throat', 'dusk'], linkingNote: 'irritation_at drops "at" softly cleanly.', rhythmBeat: 'a-ny FE-ver yet | or MOST-ly SCRATCH-y throat ir-ri-TA-tion at DUSK' },
      { id: 'shd28-3', speaker: 'Pharmacist', text: 'Sip warm honey water and take one mild lozenge twice a day.', focusWords: ['warm honey', 'lozenge', 'twice a day'], linkingNote: 'twice_a links smoothly onto weak /ə/.', rhythmBeat: 'SIP warm HO-ney wa-ter | and TAKE ONE MILD LO-zenge TWICE a DAY' },
    ],
    keyExpressions: [
      { phrase: 'dry tickly cough', meaning: 'Irritating throat cough producing zero heavy congestion', vietnamese: 'ho khan ngứa rát cổ họng' },
      { phrase: 'twice a day', meaning: 'Two separated doses spaced morning and evening', vietnamese: 'hai lần mỗi ngày' },
    ],
    reflectionChecklist: [
      'Pronounced "cough" accurately (/kɒf/ or /kɔːf/) without dropping /f/.',
      'Marked dosage timing ("TWICE a DAY") clearly with crisp pause before.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-29',
    title: 'Reviewing Weather Change During a Mountain Bus Ride',
    cefrLevel: 'A2',
    topic: 'Weather & Travel Narratives',
    durationLabel: '1:25',
    recommendedRate: 0.95,
    rhythmOverview: 'Reflective scenic storytelling mixing steady Past Continuous backdrop with brisk turns.',
    vietnameseFocusTip: 'Keep "was climbing / were drifting" light while punching vivid descriptive words ("pine mist", "sunbeams").',
    segments: [
      { id: 'shd29-1', speaker: 'Traveler', text: 'When we left the sunlit valley at dawn, skies looked crystal clear.', focusWords: ['sunlit valley', 'crystal clear'], linkingNote: 'looked_crystal holds silent crisp /t/ cleanly.', rhythmBeat: 'when we LEFT the SUN-lit VAL-ley | SKIES looked CRYS-tal CLEAR' },
      { id: 'shd29-2', speaker: 'Traveler', text: 'While our bus was climbing the ridge, cool white mist rolled gently past.', focusWords: ['climbing', 'white mist', 'rolled'], linkingNote: 'mist_rolled slides carefully without awkward vowel drops.', rhythmBeat: 'while our BUS was CLIMB-ing the RIDGE | COOL white MIST rolled PAST' },
      { id: 'shd29-3', speaker: 'Traveler', text: 'Ten minutes later, bright morning sunbeams broke suddenly through cedar trees.', focusWords: ['ten minutes', 'sunbeams', 'cedar trees'], linkingNote: 'cedar_trees links softly without halting.', rhythmBeat: 'TEN mi-nutes LA-ter | BRIGHT sun-beams BROKE through CE-dar TREES' },
    ],
    keyExpressions: [
      { phrase: 'crystal clear', meaning: 'Completely bright and free of morning fog', vietnamese: 'trong vắt không một gợn mây' },
      { phrase: 'rolled gently past', meaning: 'Drifted peacefully beside bus windows', vietnamese: 'trôi lững lờ ngang qua cửa kính' },
    ],
    reflectionChecklist: [
      'Kept "was/were" light weak helpers during Continuous scenes.',
      'Hit clear past /t/ in "looked" and smooth /d/ in "rolled".',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-30',
    title: 'Choosing Fresh Produce Calmly at a Farmers Market',
    cefrLevel: 'A2',
    topic: 'Local Shopping & Prices',
    durationLabel: '1:20',
    recommendedRate: 0.95,
    rhythmOverview: 'Friendly market exchange highlighting natural price comparison and polite closing thanks.',
    vietnameseFocusTip: 'Clearly differentiate currency cents/dollars and plural nouns ("tomatoes, bunches").',
    segments: [
      { id: 'shd30-1', speaker: 'Shopper', text: 'These sweet yellow mangoes look wonderfully ripe today! How much are they?', focusWords: ['yellow mangoes', 'ripe', 'How much'], linkingNote: 'How_much glides effortlessly onto rising question.', rhythmBeat: 'these SWEET YEL-low MAN-goes look RIPE to-DAY | HOW MUCH are they' },
      { id: 'shd30-2', speaker: 'Vendor', text: 'Just three dollars a kilo, or five dollars if you take two!', focusWords: ['three dollars', 'kilo', 'take two'], linkingNote: 'dollars_a merges neatly like "dollər-zə".', rhythmBeat: 'just THREE DOL-lars a KI-lo | or FIVE DOL-lars if you take TWO' },
      { id: 'shd30-3', speaker: 'Shopper', text: 'Two kilos sounds lovely—could you pick two slightly firmer ones?', focusWords: ['lovely', 'slightly firmer'], linkingNote: 'slightly_firmer maintains sharp clear word spacing.', rhythmBeat: 'TWO KI-los sounds LOVE-ly | could you PICK two SLIGHT-ly FIR-mer ones' },
    ],
    keyExpressions: [
      { phrase: 'slightly firmer', meaning: 'Not overly soft so fruit keeps nicely two days', vietnamese: 'hơi cứng tay vừa tầm chín tới để được lâu' },
      { phrase: 'sounds lovely', meaning: 'Warm enthusiastic agreement upon fair pricing', vietnamese: 'nghe tuyệt quá đi chứ' },
    ],
    reflectionChecklist: [
      'Articulated crisp /z/ in "dollars_a" linking directly onto article "a".',
      'Handled friendly pitch bounce naturally on offers ("three... or five!").',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-31',
    title: 'Debating Flexible Morning Gym vs Evening Walks Calmly',
    cefrLevel: 'B1',
    topic: 'Personal Lifestyle Choices',
    durationLabel: '1:30',
    recommendedRate: 1.0,
    rhythmOverview: 'Natural conversational contrast emphasizing comparative rhythm ("whereas", "far steadier").',
    vietnameseFocusTip: 'Keep "whereas" lightly connected and hit clear contrast focus on "MORning" vs "EVEning".',
    segments: [
      { id: 'shd31-1', speaker: 'Coach', text: 'Starting stretches right before breakfast sounds tiring, doesn’t it?', focusWords: ['stretches', 'breakfast', 'doesn’t it'], linkingNote: 'doesn’t_it drops smoothly upward or downward depending curiosity.', rhythmBeat: 'STAR-ting STRET-ches be-fore BREAK-fast sounds TI-ring | DOES-n’t it' },
      { id: 'shd31-2', speaker: 'Runner', text: 'Surprisingly, getting outdoors at seven settles my mind early, whereas late runs wake me up too much.', focusWords: ['Surprisingly', 'settles', 'whereas', 'wake me up'], linkingNote: 'wake_me_up compresses softly onward.', rhythmBeat: 'sur-PRI-singly | getting OUT at SE-ven SET-tles my MIND | where-as LATE runs WAKE me up too MUCH' },
      { id: 'shd31-3', speaker: 'Coach', text: 'Fair point! Whichever rhythm stays consistent beats heroic bursts every single month.', focusWords: ['Fair point', 'consistent', 'beats'], linkingNote: 'beats_heroic glides lightly past /h/ cleanly.', rhythmBeat: 'FAIR POINT | which-E-ver RHY-thm stays con-SIS-tent | BEATS he-RO-ic BURSTS' },
    ],
    keyExpressions: [
      { phrase: 'Fair point', meaning: 'Gracious acknowledgement validating partner insight', vietnamese: 'Nghe rất có lý / điểm hợp lý đấy' },
      { phrase: 'heroic bursts', meaning: 'Short exhausting intense spurts that fizzle quickly', vietnamese: 'những đợt cố gắng hùng hục nhất thời' },
    ],
    reflectionChecklist: [
      'Contrasted "SEven" vs "LATE" brightly without flattening pitch.',
      'Reduced middle syllable inside "consistent" and "heroic" crisply.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-32',
    title: 'Calling Support Over an Unexpected Double Ticket Charge',
    cefrLevel: 'B1',
    topic: 'Phone Consumer Resolution',
    durationLabel: '1:35',
    recommendedRate: 1.0,
    rhythmOverview: 'Polite, steady, factual phone voice balancing crisp spelling reference with warm gratitude.',
    vietnameseFocusTip: 'Pace dates and booking IDs gently with clear micro-pauses rather than rushing digits.',
    segments: [
      { id: 'shd32-1', speaker: 'Caller', text: 'Hello, I noticed two identical card holds for Rail Reference B-492 today.', focusWords: ['identical', 'card holds', 'B-492'], linkingNote: 'Pause lightly cleanly ahead of letter code B-492.', rhythmBeat: 'hel-LO | i NO-ticed TWO i-DEN-tical CARD HOLDS | for RE-ference B FOUR NINE TWO' },
      { id: 'shd32-2', speaker: 'Agent', text: 'Thank you for flagging that calmly! One duplicate authorization drops automatically inside forty-eight hours.', focusWords: ['flagging', 'duplicate', 'automatically'], linkingNote: 'automatically breaks evenly along secondary rhythm beats.', rhythmBeat: 'THANK you for FLAG-ging that CALM-ly | ONE DU-plicate hold DROPS in FOR-ty-EIGHT hours' },
      { id: 'shd32-3', speaker: 'Caller', text: 'That puts my mind completely at ease—would you email a quick confirmation note?', focusWords: ['completely at ease', 'confirmation'], linkingNote: 'at_ease glides smoothly onward.', rhythmBeat: 'that PUTS my mind com-PLETE-ly at EASE | could you E-mail a quick con-fir-MA-tion' },
    ],
    keyExpressions: [
      { phrase: 'flagging that calmly', meaning: 'Reporting a clear administrative mistake early and politely', vietnamese: 'báo lại nhẹ nhàng kịp thời' },
      { phrase: 'put someone’s mind at ease', meaning: 'Relieve lingering practical worry reassuringly', vietnamese: 'giúp ai hoàn toàn yên tâm' },
    ],
    reflectionChecklist: [
      'Articulated 5-syllable "automatically" without rushing past syllables.',
      'Delivered request smoothly without rising defensive impatience.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-33',
    title: 'Handling Unexpected Team Timeline Shifts in a Sync Call',
    cefrLevel: 'B1',
    topic: 'Workplace Teamwork',
    durationLabel: '1:30',
    recommendedRate: 1.0,
    rhythmOverview: 'Cooperative calm coordination tone prioritizing early alignment without panic.',
    vietnameseFocusTip: 'Punch exact action verbs ("split", "unlock", "adjust") and soften alternatives politely.',
    segments: [
      { id: 'shd33-1', speaker: 'Lead', text: 'Looks like vendor imagery slipped forty-eight hours due to rainy shoots outdoors.', focusWords: ['slipped', 'forty-eight', 'shoots'], linkingNote: 'Looks_like glides fast across "like".', rhythmBeat: 'LOOKS like VEN-dor IM-agery SLIPPED forty-EIGHT hours | due to RAI-ny SHOOTS' },
      { id: 'shd33-2', speaker: 'Designer', text: 'No worries—we can finish layout copy today and swap photos in right away Friday morning.', focusWords: ['layout copy', 'swap photos', 'Friday morning'], linkingNote: 'swap_photos holds clear /p/ stop safely before /f/.', rhythmBeat: 'NO WOR-ries | we’ll FI-nish LAY-out CO-py to-DAY | and SWAP PHO-tos FRI-day MOR-ning' },
      { id: 'shd33-3', speaker: 'Lead', text: 'Smart pivot! That keeps review calm without squeezing QA past midnight.', focusWords: ['Smart pivot', 'squeezing'], linkingNote: 'keeps_review connects cleanly without halting.', rhythmBeat: 'SMART PI-vot | that KEEPS re-view CALM | with-OUT SQUEE-zing QA past MID-night' },
    ],
    keyExpressions: [
      { phrase: 'Smart pivot', meaning: 'Clever quick workflow adjustment keeping momentum high', vietnamese: 'Xoay chuyển phương án cực kỳ linh hoạt' },
      { phrase: 'squeezing QA', meaning: 'Rushing quality testing unfairly after upstream delays', vietnamese: 'dồn ép thời gian kiểm thử chất lượng' },
    ],
    reflectionChecklist: [
      'Pronounced "slipped" in crisp 1 syllable (/slɪpt/).',
      'Matched warm reassuring workplace intonation cleanly.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-34',
    title: 'Explaining Why Local Libraries Anchor Neighborhood Belonging',
    cefrLevel: 'B1',
    topic: 'Civic & Community Stories',
    durationLabel: '1:35',
    recommendedRate: 1.0,
    rhythmOverview: 'Warm thoughtful spoken reflection pacing key ideas ("welcoming", "free of charge") gently.',
    vietnameseFocusTip: 'Keep multi-syllable words like "neighborhood" and "belonging" clear and smoothly phrased.',
    segments: [
      { id: 'shd34-1', speaker: 'Speaker', text: 'Few public buildings ask practically nothing from visitors the way local libraries do.', focusWords: ['practically nothing', 'libraries'], linkingNote: 'practically trims gently toward 3 quick smooth beats.', rhythmBeat: 'FEW PUB-lic BUIL-dings ask PRAC-tically NO-thing | the WAY LI-braries DO' },
      { id: 'shd34-2', speaker: 'Speaker', text: 'Whether you arrive to fix a résumé, escape summer heat, or simply read peacefully, doors stay welcoming.', focusWords: ['résumé', 'summer heat', 'welcoming'], linkingNote: 'heat,_or links neatly across gentle list upward cue.', rhythmBeat: 'WHE-ther you FIX a RE-sume | es-CAPE SUM-mer HEAT ↗ | or READ PEACE-fully | DOORS stay WEL-coming' },
      { id: 'shd34-3', speaker: 'Speaker', text: 'Keeping shared quiet tables open builds quiet neighborhood trust day after day.', focusWords: ['shared quiet', 'trust', 'day after day'], linkingNote: 'day_after_day glides continuously as one rhythmic unit.', rhythmBeat: 'KEE-ping SHARED QUI-et TA-bles o-pen | BUILDS NEIGH-borhood TRUST | DAY after DAY' },
    ],
    keyExpressions: [
      { phrase: 'escape summer heat', meaning: 'Find calm cool air shelter away from hot midday streets', vietnamese: 'tránh cái nắng nóng oi ả mùa hè' },
      { phrase: 'day after day', meaning: 'Reliably over quiet passing weeks and seasons', vietnamese: 'bền bỉ ngày qua ngày' },
    ],
    reflectionChecklist: [
      'Applied gentle rising list inflection across three examples before closing fall.',
      'Pronounced "library" clearly without dropping middle /r/.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-35',
    title: 'Introducing Book Recommendations Over Evening Herbal Tea',
    cefrLevel: 'B1',
    topic: 'Social & Cultural Exchanges',
    durationLabel: '1:30',
    recommendedRate: 1.0,
    rhythmOverview: 'Relaxed expressive narrative flow highlighting emotional emphasis words ("hooked", "unexpected").',
    vietnameseFocusTip: 'Avoid flat monotone reading on descriptive adjectives ("gripping", "unputdownable")!',
    segments: [
      { id: 'shd35-1', speaker: 'Friend A', text: 'Have you started anything good for long train trips lately?', focusWords: ['started anything', 'train trips', 'lately'], linkingNote: 'started_anything links /d/ cleanly forward.', rhythmBeat: 'have you STAR-ted a-nything GOOD | for LONG TRAIN TRIPS LATE-ly' },
      { id: 'shd35-2', speaker: 'Friend B', text: 'Oh, I just finished a gentle novel set inside a floating river bookshop!', focusWords: ['gentle novel', 'floating river'], linkingNote: 'finished_a links crisp voiceless /t/ onto weak /ə/.', rhythmBeat: 'i just FI-nished a GEN-tle NO-vel | SET inside a FLOA-ting RI-ver BOOK-shop' },
      { id: 'shd35-3', speaker: 'Friend A', text: 'That sounds cozy! Let me borrow your copy once weekends clear up.', focusWords: ['cozy', 'borrow', 'clear up'], linkingNote: 'clear_up links /r/ forward naturally into "up".', rhythmBeat: 'that sounds CO-zy | let me BOR-row your CO-py | once WEEK-ends CLEAR UP' },
    ],
    keyExpressions: [
      { phrase: 'set inside', meaning: 'Located narratively as story backdrop', vietnamese: 'lấy bối cảnh câu chuyện tại' },
      { phrase: 'clear up', meaning: 'Open up freely once busy chores end', vietnamese: 'thu xếp rảnh rỗi trở lại' },
    ],
    reflectionChecklist: [
      'Linked "finished_a" and "clear_up" with zero jarring break.',
      'Conveyed genuine excited lift on "Oh, I just finished..."!',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-36',
    title: 'Clarifying Technical Requirements Calmly With Stakeholders',
    cefrLevel: 'B1',
    topic: 'Structured Client Clarification',
    durationLabel: '1:35',
    recommendedRate: 1.05,
    rhythmOverview: 'Crisp consultative clarity confirming assumptions smoothly without intimidating jargon.',
    vietnameseFocusTip: 'Keep exact modals calm ("Should we confirm...", "Just to verify...") rather than abrupt orders.',
    segments: [
      { id: 'shd36-1', speaker: 'Analyst', text: 'Just to clarify priority before Wednesday: which metric weighs higher on Launch Day?', focusWords: ['clarify', 'Wednesday', 'Launch Day'], linkingNote: 'Wednesday trims calmly to two beats (/ˈwenzdeɪ/).', rhythmBeat: 'JUST to CLA-rify pri-O-rity | which ME-tric weighs HIGH-er on LAUNCH DAY' },
      { id: 'shd36-2', speaker: 'Client', text: 'Fast page loading beats fancy animations hands down for rural mobile visitors.', focusWords: ['Fast page loading', 'hands down', 'rural mobile'], linkingNote: 'hands_down smoothly drops central /d/ subtly in fast talk.', rhythmBeat: 'FAST page LOA-ding BEATS fan-cy a-ni-MA-tions | HANDS DOWN for RU-ral VI-sitors' },
      { id: 'shd36-3', speaker: 'Analyst', text: 'Crystal clear—we will keep initial screens lean and load heavy previews later.', focusWords: ['Crystal clear', 'lean', 'previews'], linkingNote: 'screens_and leans gently forward.', rhythmBeat: 'CRYS-tal CLEAR | we’ll keep i-NI-tial SCREENS LEAN | and load HEA-vy PRE-views LA-ter' },
    ],
    keyExpressions: [
      { phrase: 'hands down', meaning: 'Decisively by a huge clear margin', vietnamese: 'vượt trội áp đảo hoàn toàn' },
      { phrase: 'keep screens lean', meaning: 'Avoid bloated heavy loading clutter', vietnamese: 'giữ giao diện nhẹ gọn tối ưu tốc độ' },
    ],
    reflectionChecklist: [
      'Pronounced "Wednesday" naturally in 2 smooth beats (/ˈwenzdeɪ/).',
      'Marked rising open focus neatly at question peaks.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-37',
    title: 'Podcast Reflection: Why Slow Habit Progress Stays Invisible Early',
    cefrLevel: 'B1',
    topic: 'Learning Psychology Podcast',
    durationLabel: '1:35',
    recommendedRate: 1.0,
    rhythmOverview: 'Engaging explanatory storytelling mirroring thoughtful podcast cadence cleanly.',
    vietnameseFocusTip: 'Allow tiny deliberate pause before surprising contrast conclusions ("until suddenly...").',
    segments: [
      { id: 'shd37-1', speaker: 'Host', text: 'Have you ever practiced twenty calm minutes daily for six weeks and felt stuck?', focusWords: ['twenty', 'six weeks', 'stuck'], linkingNote: 'six_weeks blends double plural nicely.', rhythmBeat: 'have you E-ver PRAC-ticed TWEN-ty mi-nutes DAI-ly | and FELT STUCK' },
      { id: 'shd37-2', speaker: 'Host', text: 'Early neural roots quietly thicken underground long before green bamboo leaves break sunlight.', focusWords: ['neural roots', 'underground', 'bamboo'], linkingNote: 'underground stresses final root "-GROUND".', rhythmBeat: 'EAR-ly NEU-ral ROOTS | QUI-etly THI-cken under-GROUND | LONG before GREEN LEAVES' },
      { id: 'shd37-3', speaker: 'Host', text: 'Stick loyally beside quiet repetitions even when weekly mirrors look completely unchanged.', focusWords: ['Stick loyally', 'repetitions', 'mirrors'], linkingNote: 'look_completely joins without heavy gap.', rhythmBeat: 'STICK LOY-ally beside QUI-et re-pe-TI-tions | E-ven when MIR-rors look un-CHANGED' },
    ],
    keyExpressions: [
      { phrase: 'stick loyally beside', meaning: 'Remain faithful gently past flat discouragement plateaus', vietnamese: 'kiên trì gắn bó đều đặn' },
      { phrase: 'break sunlight', meaning: 'Emerge visibly above surface showing steady growth', vietnamese: 'vươn chồi đón ánh nắng rõ rệt' },
    ],
    reflectionChecklist: [
      'Held clear suffix stress on "repeTItions".',
      'Mirrored calm reassuring storytelling pacing cleanly.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-38',
    title: 'Summarizing Neighborhood Zero-Waste Swap Results Crisp & Upbeat',
    cefrLevel: 'B1',
    topic: 'Community Impact Stories',
    durationLabel: '1:30',
    recommendedRate: 1.05,
    rhythmOverview: 'Energetic upbeat news-bulletin reporting clear figures crisply.',
    vietnameseFocusTip: 'Articulate numbers and plural nouns clearly ("two hundred sweaters", "volunteers").',
    segments: [
      { id: 'shd38-1', speaker: 'Reporter', text: 'Over one hundred neighbors stopped by Willow Courtyard for Sunday’s winter coat swap.', focusWords: ['hundred neighbors', 'Willow Courtyard', 'coat swap'], linkingNote: 'stopped_by softens final /t/ right ahead of /b/.', rhythmBeat: 'O-ver a HUN-dred NEIGH-bors | STOPPED by WIL-low COURT-yard' },
      { id: 'shd38-2', speaker: 'Reporter', text: 'Instead of buying brand-new parkas online, families traded gently worn jackets free of charge.', focusWords: ['brand-new', 'traded', 'free of charge'], linkingNote: 'free_of_charge weakens "of" swiftly into /ə/.', rhythmBeat: 'in-STEAD of BUY-ing NEW par-kas | FA-milies TRA-ded JAC-kets FREE of CHARGE' },
      { id: 'shd38-3', speaker: 'Reporter', text: 'Leftover warm scarves even headed straight toward evening shelter vans!', focusWords: ['Leftover', 'headed straight', 'shelter vans'], linkingNote: 'headed_straight releases crisp /-ɪd/.', rhythmBeat: 'LEFT-over WARM SCARVES | HEA-ded STRAIGHT toward SHEL-ter VANS' },
    ],
    keyExpressions: [
      { phrase: 'free of charge', meaning: 'Provided openly at zero monetary price', vietnamese: 'hoàn toàn miễn phí' },
      { phrase: 'gently worn', meaning: 'Clean pre-loved clothing still nearly new', vietnamese: 'đồ đã qua sử dụng còn rất mới đẹp' },
    ],
    reflectionChecklist: [
      'Hit crisp extra syllable /-ɪd/ on "traded" and "headed".',
      'Dropped weak "of" inside "free of charge" smoothly to /ə/.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-39',
    title: 'Pitching a Pilot Idea Respectfully During Morning Coffee Stand-up',
    cefrLevel: 'B2',
    topic: 'Collaborative Workplace Persuasion',
    durationLabel: '1:40',
    recommendedRate: 1.05,
    rhythmOverview: 'Poised consultative pitch cadence using tentative open invitations ("What if we trial...") rather than lecturing.',
    vietnameseFocusTip: 'Let rising curiosity lift "What if..." smoothly before dropping decisively on concrete payoffs.',
    segments: [
      { id: 'shd39-1', speaker: 'Teammate', text: 'Notice how scattered afternoon Slack pings pull programmers cleanly out of debugging?', focusWords: ['scattered', 'Slack pings', 'debugging'], linkingNote: 'Notice_how links softly cleanly.', rhythmBeat: 'NO-tice how SCAT-tered PINGS | PULL pro-grammers CLEAN-ly out of de-BUG-ging' },
      { id: 'shd39-2', speaker: 'Teammate', text: 'What if we trial a silent ninety-minute morning block twice weekly with zero risk?', focusWords: ['trial', 'ninety-minute', 'zero risk'], linkingNote: 'What_if glides fast via clean tap [wʌɾɪf].', rhythmBeat: 'WHAT if we TRI-al a SI-lent NINE-ty mi-nute BLOCK | with ZE-ro RISK' },
      { id: 'shd39-3', speaker: 'Manager', text: 'Low-regret experiment! Let us test Tuesdays and Thursdays cleanly for two weeks.', focusWords: ['Low-regret', 'experiment', 'two weeks'], linkingNote: 'Let_us glides into smooth "Let’s".', rhythmBeat: 'LOW-re-GRET ex-PE-riment | let’s TEST TUES-days and THURS-days CLEAN-ly' },
    ],
    keyExpressions: [
      { phrase: 'Low-regret experiment', meaning: 'Lightweight reversible trial bearing tiny downside risk', vietnamese: 'Thử nghiệm ít rủi ro dễ điều chỉnh' },
      { phrase: 'pull cleanly out of', meaning: 'Disrupt deep continuous focus abruptly', vietnamese: 'làm đứt mạch tập trung sâu' },
    ],
    reflectionChecklist: [
      'Captured natural gentle invitation rise on "What if we trial...?".',
      'Articulated crisp 4-beat rhythm in "experiment" without rushing.',
    ],
  }),

  createShadowingSession({
    id: 'shd-m2-40',
    title: 'Evaluating Induced Demand in Urban Transport Planning',
    cefrLevel: 'B2',
    topic: 'IELTS Part 3 Academic Reasoning',
    durationLabel: '1:45',
    recommendedRate: 1.1,
    rhythmOverview: 'Authoritative explanatory cadence contrasting naive expectations clearly against systemic outcomes.',
    vietnameseFocusTip: 'Stress contrastive anchors ("TEMporarily" vs "PERmanently", "MORE lanes" vs "MORE cars") smoothly.',
    segments: [
      { id: 'shd40-1', speaker: 'Lecturer', text: 'On the surface, adding two fresh highway lanes intuitively ought to dissolve traffic bottlenecks completely.', focusWords: ['surface', 'intuitively', 'dissolve', 'bottlenecks'], linkingNote: 'On_the_surface sets Fall–Rise reservation cleanly!', rhythmBeat: 'on the SUR-face ↘↗ | AD-ding TWO LANES | OUGHT to dis-SOLVE BOT-tlenecks' },
      { id: 'shd40-2', speaker: 'Lecturer', text: 'In reality, smoother morning drive times tempt reluctant commuters right back behind steering wheels.', focusWords: ['reality', 'reluctant', 'steering wheels'], linkingNote: 'right_back drops /t/ lightly ahead of /b/.', rhythmBeat: 'in re-A-lity | SMOO-ther DRIVE times TEMPT | re-LUC-tant com-MU-ters BACK' },
      { id: 'shd40-3', speaker: 'Lecturer', text: 'Within three short years, induced road demand routinely refills asphalt capacity virtually back to square one.', focusWords: ['induced', 'routinely refills', 'square one'], linkingNote: 'back_to compresses neatly onward.', rhythmBeat: 'in-DUCED road de-MAND | rou-TINE-ly re-FILLS capacity | BACK to SQUARE ONE' },
    ],
    keyExpressions: [
      { phrase: 'induced demand', meaning: 'Added road capacity luring latent driving back until jams match old delays', vietnamese: 'cầu phát sinh khi nới rộng làn đường' },
      { phrase: 'back to square one', meaning: 'Returned cleanly to the identical starting problem', vietnamese: 'quay trở lại vạch xuất phát ban đầu' },
    ],
    reflectionChecklist: [
      'Executed Fall–Rise concession curve smoothly on "On the surface ↘↗...".',
      'Shifted clear syllable focus cleanly inside "re-A-lity" and "in-TUI-tively".',
    ],
  }),
];
