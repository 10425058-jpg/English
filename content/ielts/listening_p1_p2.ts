import type { IELTSListeningActivity } from '@english-quest/shared';
import { createIeltsListening, iEx } from './helpers';

type SeedP12 = {
  id: string;
  part: 'part_1' | 'part_2';
  title: string;
  topic: string;
  accent: 'british' | 'american' | 'australian' | 'international';
  cefrTarget: 'B1' | 'B2' | 'C1';
  contextDescription: string;
  wordLimitNote: string;
  scriptLines: Array<{ speaker: string; text: string }>;
  distractorTraps: string[];
  q1: {
    instruction: string;
    prompt: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    explanationVi: string;
  };
  q2: {
    instruction: string;
    prompt: string;
    type: 'fill_blank' | 'dictation';
    correctAnswer: string;
    acceptableAnswers?: string[];
    explanation: string;
    explanationVi: string;
  };
};

const SEEDS_P12: SeedP12[] = [
  {
    id: 'ielts-lis-p1-01',
    part: 'part_1',
    title: 'City Library Maker-Pass Registration',
    topic: 'Community Services',
    accent: 'british',
    cefrTarget: 'B1',
    contextDescription: 'A resident registers for an evening 3D-printer induction slot at Oakwood Library.',
    wordLimitNote: 'ONE WORD AND/OR A NUMBER',
    scriptLines: [
      { speaker: 'Clerk', text: 'Good morning, Oakwood Makerspace desk. What surname should I file under? Is it spelled B-R-A-D-S-H-A-W?' },
      { speaker: 'Caller', text: 'Actually without the first A after R: it’s B-R-O-D-S-H-A-W, first name Claire.' },
      { speaker: 'Clerk', text: 'Thanks Claire. Tuesday’s beginner laser session is full after six bookings, so how about Thursday at 6:30 p.m. in Studio Three? Bring photo ID rather than a paper utility bill—we upgraded scanners last Monday.' },
    ],
    distractorTraps: [
      'Letter swap distractor: caller rejects BRADSHAW and clarifies BRODSHAW.',
      'Full-day slot trap: Tuesday is full, confirmed evening slot moves to Thursday 6:30 p.m.',
      'Outdated requirement trap: paper utility bills are no longer needed—bring photo ID.',
    ],
    q1: {
      instruction: 'Choose the verified appointment details matching Claire’s final confirmation.',
      prompt: 'When does Claire attend the induction and what document must she bring?',
      options: [
        'Tuesday at 6:30 p.m. with a utility bill',
        'Thursday at 6:30 p.m. with official photo ID',
        'Monday at 6:00 p.m. with both ID and bill',
        'Thursday at 6:00 p.m. with a paper library slip',
      ],
      correctAnswer: 'Thursday at 6:30 p.m. with official photo ID',
      explanation: 'Tuesday is full and paper utility bills were dropped in favor of photo ID.',
      explanationVi: 'Thứ Ba đã hết chỗ và hóa đơn giấy đã bỏ; lịch chốt là tối thứ Năm 6:30 cùng giấy tờ có ảnh.',
    },
    q2: {
      instruction: 'Type ONE EXACT SURNAME word confirmed by Claire (strictly check spelling!).',
      prompt: 'Registered member surname on Oakwood Makerspace form: ___',
      type: 'fill_blank',
      correctAnswer: 'Brodshaw',
      acceptableAnswers: ['brodshaw', 'BRODSHAW'],
      explanation: 'Caller clarifies spelling B-R-O-D-S-H-A-W cleanly after rejecting BRADSHAW.',
      explanationVi: 'Người gọi đính chính chính tả là BRODSHAW.',
    },
  },
  {
    id: 'ielts-lis-p1-02',
    part: 'part_1',
    title: 'Harbor Cycle Rental Weekend Booking',
    topic: 'Leisure & Transport',
    accent: 'australian',
    cefrTarget: 'B1',
    contextDescription: 'A cyclist calls Green Bay Bike Hut to reserve commuter tandems and helmets.',
    wordLimitNote: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
    scriptLines: [
      { speaker: 'Staff', text: 'Green Bay Bike Hut! Standard coastal cruisers run twenty-four dollars daily, though electric-assist bikes cost thirty-eight.' },
      { speaker: 'Caller', text: 'Just two standard manual cruisers for Sunday—my knee handles hills fine without batteries. Do bike locks add extra fee?' },
      { speaker: 'Staff', text: 'Chain locks come free inside the frame bag, though sturdy saddle panniers add six dollars per bike. Leave pickup at Pier Nine beside the ferry clock—Pier Four closed for paving yesterday.' },
    ],
    distractorTraps: [
      'Price trap: caller picks manual cruisers ($24), NOT electric ($38).',
      'Pier closure swap: Pier Four is closed for paving, final meeting spot is Pier Nine.',
    ],
    q1: {
      instruction: 'Select the confirmed bicycle type and pickup gate.',
      prompt: 'Which bicycles does the caller book and where must they collect them?',
      options: [
        'Electric-assist bikes collected at Pier Four',
        'Standard manual cruisers picked up at Pier Nine',
        'Mountain bikes delivered inside the ferry station',
        'Standard cruisers collected at closed Pier Four',
      ],
      correctAnswer: 'Standard manual cruisers picked up at Pier Nine',
      explanation: 'Caller declined electric bikes ($38) and Pier Four is closed for paving, shifting pickup to Pier Nine.',
      explanationVi: 'Khách chọn xe thường không pin ($24) và nhận xe tại Bến Số 9 vì Bến Số 4 đang sửa.',
    },
    q2: {
      instruction: 'Enter the daily price number OR single word (e.g., 24) for ONE standard bike alone.',
      prompt: 'Daily rate in dollars for one standard manual cruiser: $___',
      type: 'fill_blank',
      correctAnswer: '24',
      acceptableAnswers: ['twenty-four', 'twenty four'],
      explanation: 'Standard cruisers cost 24 dollars; 38 applies strictly to electric-assist bikes.',
      explanationVi: 'Giá thuê xe đạp thường là $24/ngày ($38 là xe trợ lực điện).',
    },
  },
  {
    id: 'ielts-lis-p1-03',
    part: 'part_1',
    title: 'Riverside Apartment Boiler Check',
    topic: 'Housing & Repairs',
    accent: 'british',
    cefrTarget: 'B1',
    contextDescription: 'A tenant arranges an urgent morning heating valve check with letting agent Priya.',
    wordLimitNote: 'ONE WORD AND/OR A NUMBER',
    scriptLines: [
      { speaker: 'Priya', text: 'Lettings maintenance, Priya speaking. Apartment 4B, Maple Court—right? Our engineer Sam usually covers Zone North until twelve.' },
      { speaker: 'Tenant', text: 'Actually I moved from 4B downstairs into 2C last spring! Water pressure dips every time kitchen taps turn on.' },
      { speaker: 'Priya', text: 'Got it, Flat 2C Maple Court. Let’s send Sam between 10:15 and 11:00 tomorrow, since 8:30 got booked for broken radiator pipes on Elm Row. Ask the concierge for code H-49 if Sam arrives early.' },
    ],
    distractorTraps: [
      'Outdated flat trap: tenant relocated from 4B to 2C last spring.',
      'Time slot redirect: 8:30 already taken on Elm Row, finalized window 10:15–11:00.',
    ],
    q1: {
      instruction: 'Verify final apartment number and arrival window.',
      prompt: 'Which apartment will Sam visit and when?',
      options: [
        'Flat 4B at 8:30 a.m.',
        'Flat 2C between 10:15 and 11:00 a.m.',
        'Elm Row Unit 2C after noon',
        'Flat 4B between 10:15 and 11:00 a.m.',
      ],
      correctAnswer: 'Flat 2C between 10:15 and 11:00 a.m.',
      explanation: 'Tenant corrected address to Flat 2C, and 8:30 belongs to Elm Row.',
      explanationVi: 'Khách thuê đã chuyển sang căn 2C; 8:30 bận ca khác nên lịch hẹn mới là 10:15–11:00.',
    },
    q2: {
      instruction: 'Type the exact street name (ONE WORD) where Sam’s 8:30 urgent job takes place.',
      prompt: 'Earlier morning radiator repair street location: ___ Row',
      type: 'fill_blank',
      correctAnswer: 'Elm',
      acceptableAnswers: ['elm'],
      explanation: 'Priya notes broken radiator pipes sit on "Elm Row" at 8:30.',
      explanationVi: 'Đường sửa ống lúc 8:30 là "Elm Row".',
    },
  },
  {
    id: 'ielts-lis-p1-04',
    part: 'part_1',
    title: 'Botanical Pottery Workshop Inquiry',
    topic: 'Adult Education',
    accent: 'american',
    cefrTarget: 'B2',
    contextDescription: 'A visitor phones Meadow Art Kiln to join a weekend wheel-throwing course.',
    wordLimitNote: 'ONE WORD AND/OR A NUMBER',
    scriptLines: [
      { speaker: 'Host', text: 'Meadow Kiln Studio! Clay and firing glaze sit inside the 95-dollar fee, though you bring your own cotton apron.' },
      { speaker: 'Caller', text: 'Nice! Does the Saturday morning group open for raw beginners, or only intermediates?' },
      { speaker: 'Host', text: 'Saturday mornings actually shifted to intermediate stoneware this month; absolute beginners meet Sunday afternoons at 1:45 p.m. Oh, and park behind Cedar Barn—front street bays are residents-only until six.' },
    ],
    distractorTraps: [
      'Schedule change: Saturday shifted to intermediate; absolute beginners move to Sunday 1:45 p.m.',
      'Supply vs excluded trap: clay & glaze included in $95, apron excluded (must bring own).',
    ],
    q1: {
      instruction: 'Pick the accurate course schedule and parking instruction.',
      prompt: 'When do complete beginners meet and where should the caller park?',
      options: [
        'Saturday morning along the front residential street',
        'Sunday afternoon behind Cedar Barn',
        'Sunday morning beside Meadow Kiln gate without paying',
        'Saturday afternoon with an included linen apron',
      ],
      correctAnswer: 'Sunday afternoon behind Cedar Barn',
      explanation: 'Beginners attend Sunday 1:45 p.m.; street front spaces stay residents-only so drivers park behind Cedar Barn.',
      explanationVi: 'Lớp nhập môn chuyển sang chiều Chủ Nhật (1:45) và khách đỗ xe sau Cedar Barn.',
    },
    q2: {
      instruction: 'Enter ONE WORD identifying the fabric protection item the caller must bring personally.',
      prompt: 'Item NOT supplied in the $95 materials fee: personal ___',
      type: 'fill_blank',
      correctAnswer: 'apron',
      acceptableAnswers: ['cotton apron'],
      explanation: 'Host states "you bring your own cotton apron" while clay and glaze come included.',
      explanationVi: 'Đất sét và men có sẵn, học viên phải tự mang tạp dề ("apron").',
    },
  },
  {
    id: 'ielts-lis-p1-05',
    part: 'part_1',
    title: 'Regional Rail Lost Luggage Report',
    topic: 'Travel Support',
    accent: 'british',
    cefrTarget: 'B2',
    contextDescription: 'A commuter describes a misplaced canvas laptop backpack left on a coastal express.',
    wordLimitNote: 'ONE WORD ONLY',
    scriptLines: [
      { speaker: 'Agent', text: 'Central Rail Lost Property. You left a navy hard-shell suitcase on Train 412?' },
      { speaker: 'Caller', text: 'No, navy suitcases belong to my brother—mine is an olive-green canvas backpack stowed under Seat 18 in Coach D. Inside sits a steel thermos flask plus two annotated architecture sketchbooks, though no laptop—thankfully I held that.' },
      { speaker: 'Agent', text: 'Clear—no electronics inside, olive canvas pack in Coach D! Let’s check Terminal Lockbox East right after 3:00 p.m. when cleaning sweeps log arrivals.' },
    ],
    distractorTraps: [
      'Item contrast: caller’s brother owns navy hard-shell suitcase; missing item is olive-green canvas backpack.',
      'Negative presence distractor: no laptop inside the bag (caller kept the laptop).',
    ],
    q1: {
      instruction: 'Identify what the misplaced olive bag contains.',
      prompt: 'Which items are missing inside Coach D’s misplaced bag?',
      options: [
        'A laptop computer and navy travel suit',
        'A metal thermos bottle and two architecture sketchbooks',
        'Only train passes inside a navy suitcase',
        'Cleaning keys and silver camera tripod',
      ],
      correctAnswer: 'A metal thermos bottle and two architecture sketchbooks',
      explanation: 'Caller explains she kept her laptop and lost an olive backpack holding a steel thermos + two sketchbooks.',
      explanationVi: 'Bên trong ba lô rêu thất lạc có bình giữ nhiệt thép và hai cuốn sổ phác thảo kiến trúc (laptop không mất).',
    },
    q2: {
      instruction: 'Write ONE WORD specifying the backpack fabric mentioned by the caller.',
      prompt: 'Lost bag outer material: olive-green ___',
      type: 'fill_blank',
      correctAnswer: 'canvas',
      acceptableAnswers: ['CANVAS'],
      explanation: 'Bag description specifies "olive-green canvas backpack".',
      explanationVi: 'Chất liệu vải ba lô là "canvas" (vải bố).',
    },
  },
  {
    id: 'ielts-lis-p1-06',
    part: 'part_1',
    title: 'District Aquatics Swim Pass Renewal',
    topic: 'Fitness & Membership',
    accent: 'australian',
    cefrTarget: 'B1',
    contextDescription: 'A swimmer renews an off-peak lane pass and checks sauna maintenance hours.',
    wordLimitNote: 'ONE WORD AND/OR A NUMBER',
    scriptLines: [
      { speaker: 'Reception', text: 'Harbor Pools Reception! Full anytime access sits at forty-six dollars monthly, whereas Off-Peak morning lanes run twenty-nine—provided you finish laps before 4:00 p.m.' },
      { speaker: 'Member', text: 'I swim around 6:45 before office hours, so Off-Peak fits cleanly! Wait—is the cedar steam room open Wednesdays?' },
      { speaker: 'Reception', text: 'Usually yes, though this Wednesday until noon technicians replace floor tiles cleanly—check Lane Eight noticeboards when scanning in. Your card finishes printing in just ten minutes at Counter B.' },
    ],
    distractorTraps: [
      'Tier filter: early-morning 6:45 routine fits Off-Peak ($29), not $46 anytime tier.',
      'Temporary Wednesday closure: cedar steam room closed specifically Wednesday until noon.',
    ],
    q1: {
      instruction: 'Choose the right membership plan and Wednesday maintenance detail.',
      prompt: 'Which pass suits the swimmer and why is Counter B relevant today?',
      options: [
        'Full $46 access while Counter B repairs steam room tiles',
        'Off-Peak $29 pass with replacement card pickup at Counter B after ten minutes',
        'Off-Peak $46 plan excluding early 6:45 swims',
        'Afternoon lane ticket picked up at Lane Eight directly',
      ],
      correctAnswer: 'Off-Peak $29 pass with replacement card pickup at Counter B after ten minutes',
      explanation: '6:45 a.m. swims fit Off-Peak ($29), and card prints in ten minutes at Counter B.',
      explanationVi: 'Bơi lúc 6:45 sáng hợp gói Off-Peak $29 và nhận thẻ mới sau 10 phút tại Quầy B.',
    },
    q2: {
      instruction: 'Enter ONE WORD telling which swimming area workers finish re-tiling Wednesday before noon.',
      prompt: 'Closed Wednesday until 12:00 for tile replacement: cedar ___ room',
      type: 'fill_blank',
      correctAnswer: 'steam',
      acceptableAnswers: ['STEAM'],
      explanation: 'Reception notes "this Wednesday until noon technicians replace floor tiles cleanly" inside the cedar steam room.',
      explanationVi: 'Khu vực đóng cửa bảo trì gạch đến trưa thứ Tư là phòng xông hơi tuyết tùng ("steam" room).',
    },
  },
  {
    id: 'ielts-lis-p1-07',
    part: 'part_1',
    title: 'City Hall Community Garden Plot Application',
    topic: 'Community Volunteering',
    accent: 'american',
    cefrTarget: 'B2',
    contextDescription: 'A resident applies for a raised organic vegetable box in the municipal courtyard.',
    wordLimitNote: 'ONE WORD ONLY',
    scriptLines: [
      { speaker: 'Coordinator', text: 'Green Alley Co-op! Full waist-high plots carry a three-month waitlist, yet half-size wooden boxes near the south rain tank open this weekend.' },
      { speaker: 'Resident', text: 'Half-size suits balcony gardeners well—do herbs need special soil approval?' },
      { speaker: 'Coordinator', text: 'No permits for herbs, though chemical slugs pellets remain strictly banned near neighborhood bee boxes. Rain barrels run dry mid-August occasionally, so grab a bright orange watering can under Porch Three.' },
    ],
    distractorTraps: [
      'Immediate availability vs waitlist: waist-high plots wait 3 months; south rain-tank boxes open right away.',
      'Color/location cue: cans sit orange under Porch Three.',
    ],
    q1: {
      instruction: 'Verify plot availability and strict orchard co-op rule.',
      prompt: 'What box opens immediately and what gardening product is forbidden?',
      options: [
        'Waist-high plot opens now; herbs require written permits',
        'Half-size wooden bed near south tank; chemical slug pellets banned due to bee hives',
        'North tank bed without watering barrels; synthetic fertilizer encouraged',
        'Full lawn plot under Porch Three; orange tools banned',
      ],
      correctAnswer: 'Half-size wooden bed near south tank; chemical slug pellets banned due to bee hives',
      explanation: 'South tank wooden bed is free immediately and chemical slug pellets remain banned.',
      explanationVi: 'Ô gỗ nhỏ cạnh bể nước phía nam trống ngay cuối tuần này, và cấm dùng thuốc diệt ốc sên hóa học để bảo vệ đàn ong.',
    },
    q2: {
      instruction: 'Type ONE WORD identifying what color watering cans sit under Porch Three.',
      prompt: 'Shared watering cans located under Porch Three are bright ___',
      type: 'fill_blank',
      correctAnswer: 'orange',
      acceptableAnswers: ['ORANGE'],
      explanation: 'Coordinator mentions grabbing a "bright orange watering can".',
      explanationVi: 'Bình tưới dưới hiên số 3 có màu cam sáng ("orange").',
    },
  },
  {
    id: 'ielts-lis-p1-08',
    part: 'part_1',
    title: 'Coastal Acoustic Trio Venue Inquiry',
    topic: 'Arts & Events',
    accent: 'british',
    cefrTarget: 'B2',
    contextDescription: 'A musician asks a community hall manager about acoustics, curfew, and stage gear.',
    wordLimitNote: 'ONE WORD AND/OR A NUMBER',
    scriptLines: [
      { speaker: 'Manager', text: 'Bellview Annex Hall! Evening acoustics stay crisp up to two hundred guests, though fire caps cap upstairs recitals at 140 seats.' },
      { speaker: 'Musician', text: 'Our jazz acoustic trio draws barely ninety listeners—do stage microphones need an in-house sound technician?' },
      { speaker: 'Manager', text: 'Only if you plug electric keyboards or brass amplifiers; pure acoustic cello and guitar skip the eighty-dollar engineer surcharge cleanly. Just wrap final encores before 10:15 p.m.—city noise curfew starts 10:30.' },
    ],
    distractorTraps: [
      'Capacity confusion: general hall holds 200, upstairs ceiling is 140, actual trio expects ~90.',
      'Time gap trap: music encores finish by 10:15 p.m. ahead of the 10:30 statutory curfew.',
    ],
    q1: {
      instruction: 'Confirm fee waiver condition and curfew deadline.',
      prompt: 'When can the trio skip paying the sound engineer surcharge, and when must live music stop?',
      options: [
        'Never waived under 140 seats; play strictly until 10:30 p.m.',
        'Waived for pure non-amplified acoustic sets; end encores by 10:15 p.m.',
        'Waived exclusively over 200 tickets; wrap stage cleanup at 9:15 p.m.',
        'Included automatically with keyboards; noise runs freely past midnight',
      ],
      correctAnswer: 'Waived for pure non-amplified acoustic sets; end encores by 10:15 p.m.',
      explanation: 'Pure acoustic cello/guitar avoids the $80 tech fee, and live music must end by 10:15 p.m.',
      explanationVi: 'Nhóm acoustic thuần không dùng khuếch đại điện được miễn phí kỹ thuật viên $80 và phải kết thúc biểu diễn trước 10:15 tối.',
    },
    q2: {
      instruction: 'Type ONE EXACT NUMBER showing the official maximum upstairs fire capacity.',
      prompt: 'Maximum upstairs recital seating cap allowed: ___ guests',
      type: 'fill_blank',
      correctAnswer: '140',
      acceptableAnswers: ['one hundred forty', 'one hundred and forty'],
      explanation: 'Manager warns "fire caps cap upstairs recitals at 140 seats" (not 200!).',
      explanationVi: 'Trần sức chứa an toàn phòng trên lầu là 140 ghế.',
    },
  },
  {
    id: 'ielts-lis-p1-09',
    part: 'part_1',
    title: 'Rural Rail Bicycle Parcel Dispatch',
    topic: 'Logistics & Courier',
    accent: 'international',
    cefrTarget: 'B2',
    contextDescription: 'A traveler ships folding bicycles ahead by overnight rail parcel freight.',
    wordLimitNote: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
    scriptLines: [
      { speaker: 'Clerk', text: 'Valley Rail Freight! Unfolded touring bikes need thick wood crates costing fifty pounds, whereas compact folded frames zip straight inside padded nylon sleeves for eighteen.' },
      { speaker: 'Traveler', text: 'Both bikes fold compact cleanly! Does next-morning arrival cover North Station too?' },
      { speaker: 'Clerk', text: 'Next-morning vans drop strictly at South Depot Platform Two; North Station deliveries take two afternoons because rural shuttles detour over Oak Bridge Tuesdays. Tape your return tag under the saddle rail cleanly!' },
    ],
    distractorTraps: [
      'Pricing trap: folded nylon sleeves cost £18, NOT £50 wood crates.',
      'Station timing split: South Depot = next morning; North Station = two afternoons.',
    ],
    q1: {
      instruction: 'Confirm shipping rate and South vs North timing.',
      prompt: 'Why would the traveler pick South Depot Platform Two over North Station?',
      options: [
        'Wood crates stay free exclusively at South Depot',
        'Compact bikes cost £18 and arrive the following morning instead of waiting two afternoons',
        'Oak Bridge bans folded bikes completely every Tuesday',
        'North Station opens 24-hour bike wrapping services free',
      ],
      correctAnswer: 'Compact bikes cost £18 and arrive the following morning instead of waiting two afternoons',
      explanation: 'Folded frames drop cost to £18 inside sleeves, and South Depot receives next-morning vans.',
      explanationVi: 'Xe gấp đựng túi đệm chỉ tốn £18 và giao tới Bến Nam vào sáng hôm sau thay vì đợi 2 ngày như Bến Bắc.',
    },
    q2: {
      instruction: 'Dictate ONE WORD identifying the padded wrap material replacing wooden crates.',
      prompt: 'Protective bag material for folded frames: padded ___ sleeves',
      type: 'fill_blank',
      correctAnswer: 'nylon',
      acceptableAnswers: ['NYLON'],
      explanation: 'Clerk confirms folded frames ship inside "padded nylon sleeves".',
      explanationVi: 'Chất liệu túi bọc khung xe gấp là vải "nylon".',
    },
  },
  {
    id: 'ielts-lis-p1-10',
    part: 'part_1',
    title: 'University Health Vaccine & Records Desk',
    topic: 'Campus Health',
    accent: 'american',
    cefrTarget: 'B1',
    contextDescription: 'An incoming exchange student checks vaccination paperwork drop-off rules.',
    wordLimitNote: 'ONE WORD AND/OR A NUMBER',
    scriptLines: [
      { speaker: 'Nurse', text: 'Campus Clinic Records Desk! Incoming postgrads used to bring paper yellow cards to Window Four until May.' },
      { speaker: 'Student', text: 'Do I hand them there today, or upload scans?' },
      { speaker: 'Nurse', text: 'Please don’t wait in line downstairs—use our encrypted Student Portal before Friday 5:00 p.m., choosing Document Tab Green rather than Finance Tab. Once nurses review scans, green confirmation badges clear registration automatically within forty-eight hours.' },
    ],
    distractorTraps: [
      'Obsolete workflow trap: Window Four paper drop ended in May.',
      'Wrong tab trap: submit under Document Tab Green, never Finance Tab.',
    ],
    q1: {
      instruction: 'Select current upload channel and review turnaround time.',
      prompt: 'How must the student submit vaccine scans and how long does approval take?',
      options: [
        'Drop yellow paper cards at Window Four waiting one week',
        'Upload via Student Portal Document Tab Green and clear within 48 hours',
        'Email Finance Tab Friday midnight for instant stamps',
        'Bring wet ink forms directly to campus classrooms',
      ],
      correctAnswer: 'Upload via Student Portal Document Tab Green and clear within 48 hours',
      explanation: 'Old Window Four stopped in May; portal green-tab scans review inside 48 hours.',
      explanationVi: 'Không nộp giấy tại Quầy 4 nữa mà tải qua cổng Student Portal mục Document Tab Green, duyệt trong 48 giờ.',
    },
    q2: {
      instruction: 'Enter the exact HOURS integer OR word-pair indicating maximum approval wait time.',
      prompt: 'Clearance processing time: within ___ hours',
      type: 'fill_blank',
      correctAnswer: '48',
      acceptableAnswers: ['forty-eight', 'forty eight'],
      explanation: 'Nurse states nurses clear badges "within forty-eight hours".',
      explanationVi: 'Thời gian xác nhận hồ sơ là trong vòng 48 giờ.',
    },
  },
  ...Array.from({ length: 10 }, (_, idx): SeedP12 => {
    const n = idx + 11;
    const configs: Array<{
      title: string;
      topic: string;
      accent: SeedP12['accent'];
      speakerA: string;
      speakerB: string;
      trapA: string;
      factB: string;
      qPrompt: string;
      qOptions: string[];
      qAns: string;
      qExp: string;
      qExpVi: string;
      wordPrompt: string;
      wordAns: string;
      wordExp: string;
      wordExpVi: string;
    }> = [
      {
        title: 'Museum Nocturne Ticket Swap',
        topic: 'Cultural Events',
        accent: 'british',
        speakerA: 'Natural History Box Office! Friday’s candle-lit fossil walk sold out earlier, though Saturday 7:15 p.m. has four spots under Concession Code S-12.',
        speakerB: 'Saturday 7:15 works cleanly! Wait—do umbrellas check at the West Gate or North Vault?',
        trapA: 'East entrance lockboxes stay closed; wrap damp coats at the North Vault before stepping inside Fossil Gallery.',
        factB: 'Code S-12 grants 15% student reduction.',
        qPrompt: 'Which evening does the caller book and where must wet coats go?',
        qOptions: [
          'Friday night with umbrellas stored at West Gate',
          'Saturday 7:15 p.m. with coat check inside North Vault',
          'Friday 7:15 p.m. using full undiscounted cash fee',
          'Saturday afternoon bypassing East lockers',
        ],
        qAns: 'Saturday 7:15 p.m. with coat check inside North Vault',
        qExp: 'Friday sold out; East lockboxes closed; Saturday 7:15 p.m. + North Vault is confirmed.',
        qExpVi: 'Tối thứ Sáu hết vé và tủ phía Đông đóng; lịch chốt là 7:15 tối thứ Bảy gửi đồ tại North Vault.',
        wordPrompt: 'Write ONE WORD naming the gallery hosting the evening tour: ___ Gallery',
        wordAns: 'Fossil',
        wordExp: 'The script states visitors step inside the "Fossil Gallery".',
        wordExpVi: 'Khu triển lãm diễn ra tour đêm là "Fossil" Gallery.',
      },
      {
        title: 'Mountain Cabin Trail Pass Extension',
        topic: 'Outdoor Recreation',
        accent: 'american',
        speakerA: 'Pine Crest Ranger Hut! Standard camp permits run three nights, though winter-storm alerts pushed Trail West closure through Thursday.',
        speakerB: 'We’re hiking East Ridge instead—do bear canisters rent inside the ranger post?',
        trapA: 'Plastic tubs ran empty yesterday—rent aluminum bear canisters at General Store Two across the wooden footbridge for nine dollars weekly.',
        factB: 'Trail East remains clear and dry.',
        qPrompt: 'Where can hikers actually rent a reliable food canister today?',
        qOptions: [
          'Free plastic tubs inside Pine Crest Ranger Hut',
          'Paid aluminum canisters from General Store Two across the bridge',
          'Along closed Trail West checkpoints',
          'Beside East Ridge mountain huts free of charge',
        ],
        qAns: 'Paid aluminum canisters from General Store Two across the bridge',
        qExp: 'Plastic tubs ran out; hikers rent aluminum canisters at General Store Two ($9/wk).',
        qExpVi: 'Hộp nhựa ở trạm kiểm lâm đã hết; phải sang cửa hàng General Store Two thuê bình nhôm $9/tuần.',
        wordPrompt: 'Type ONE WORD specifying the metal material of available canisters: ___',
        wordAns: 'aluminum',
        wordExp: 'Rangers specifically confirm renting "aluminum" canisters (also accepted aluminium).',
        wordExpVi: 'Chất liệu hộp chống gấu hiện còn là nhôm ("aluminum").',
      },
      {
        title: 'Downtown Evening Choir Audition',
        topic: 'Music & Communities',
        accent: 'australian',
        speakerA: 'Bayside Civic Chorus! Sopranos audition upstairs Tuesday, while Tenor and Bass sight-reading shifted to Studio Four Wednesday at seven.',
        speakerB: 'I sing Tenor and prefer bringing classical sheet music—do pianists accompany sight-reading?',
        trapA: 'Bring two crisp copies—one solely for pianist Marco! Skip memorized pop ballads because panels test four bars of plain folk hymn rhythm first.',
        factB: 'Studio Four holds clean acoustic uprights.',
        qPrompt: 'When does a tenor singer audition and what piece should they prepare?',
        qOptions: [
          'Upstairs Tuesday singing memorized pop hits',
          'Studio Four Wednesday at seven bringing two copies and prepping folk rhythm',
          'Studio Two Wednesday singing pop unaccompanied',
          'Tuesday noon bringing only acoustic guitar scores',
        ],
        qAns: 'Studio Four Wednesday at seven bringing two copies and prepping folk rhythm',
        qExp: 'Tenors test Wednesday 7 p.m. Studio Four; memorized pop is skipped in favor of plain folk hymn rhythm.',
        qExpVi: 'Giọng Nam cao (Tenor) thi vào 7 giờ tối thứ Tư phòng Studio Four với hai bản nhạc dân ca chuẩn nhịp.',
        wordPrompt: 'Enter ONE WORD naming accompanist Marco’s instrument role: ___',
        wordAns: 'pianist',
        wordExp: 'Caller needs a second score copy strictly "for pianist Marco".',
        wordExpVi: 'Cần thêm 1 bản nhạc cho nghệ sĩ đệm đàn "pianist" Marco.',
      },
      {
        title: 'Neighbourhood Electronics Repair Cafe',
        topic: 'Sustainability',
        accent: 'british',
        speakerA: 'Fixing Shed Volunteers! We mend toasters and desk lamps free Saturdays, though broken microwave ovens stay forbidden over high-voltage safety bans.',
        speakerB: 'Great—it’s only a vintage brass floor lamp with frayed cord insulation! Do visitors book morning slots?',
        trapA: 'Yes—online check-in closes Friday five, yet walk-in slots stay open from 10:30 to noon whenever Bench Three frees up. Pick up spare plugs downstairs.',
        factB: 'Coffee jars collect voluntary coin donations only.',
        qPrompt: 'Why is the caller’s item accepted and what must stay banned?',
        qOptions: [
          'Vintage microwave accepted free; toasters banned',
          'Vintage brass lamp qualifies cleanly; high-voltage microwave ovens remain strictly prohibited',
          'Repair slots stay cash-only at fifty pounds upfront',
          'Saturday walk-ins stay permanently closed after noon',
        ],
        qAns: 'Vintage brass lamp qualifies cleanly; high-voltage microwave ovens remain strictly prohibited',
        qExp: 'Lamps qualify safely whereas microwaves fail high-voltage safety rules.',
        qExpVi: 'Đèn sàn đồng được nhận sửa bình thường, còn lò vi sóng bị cấm vì rủi ro điện áp cao.',
        wordPrompt: 'Type ONE WORD identifying the metal finishing of the caller’s lamp: ___',
        wordAns: 'brass',
        wordExp: 'Caller explicitly specifies a "vintage brass floor lamp".',
        wordExpVi: 'Chất liệu đèn cây cổ là đồng thau ("brass").',
      },
      {
        title: 'City Marathon Packet Collection',
        topic: 'Sport & Events',
        accent: 'international',
        speakerA: 'Harbor Marathon Expo! Half-marathon bibs sit inside Tent A, while full 42k runners pick timing chips over at Glass Pavilion East.',
        speakerB: 'I downgraded from 42k down to the Half-Marathon last week—which tent holds my bib?',
        trapA: 'Even after downgrades logged Friday, check Tent A—plus verify magnetic chip sensitivity near the red scanner arch before five! Paper baggage stickers come inside envelope pouches.',
        factB: 'No race-day Sunday packet pickup exists.',
        qPrompt: 'Where does the runner collect race gear after switching distances?',
        qOptions: [
          'Glass Pavilion East on Sunday morning right before kickoff',
          'Tent A prior to five o’clock alongside testing the red arch scanner',
          'Inside Sunday baggage trucks without paper stickers',
          'Full marathon desks exclusively',
        ],
        qAns: 'Tent A prior to five o’clock alongside testing the red arch scanner',
        qExp: 'Half-Marathon transfers route cleanly through Tent A and check chip timing under the red scanner.',
        qExpVi: 'Do đã đổi xuống cự ly bán marathon, vận động viên nhận bib tại Lều A và kiểm tra chip qua cổng quét đỏ.',
        wordPrompt: 'Write ONE WORD identifying the color of the timing chip scanner arch: ___',
        wordAns: 'red',
        wordExp: 'Staff tells runner to test chip sensitivity near the "red" scanner arch.',
        wordExpVi: 'Cổng kiểm tra từ tính chip màu đỏ ("red").',
      },
      {
        title: 'Airport Express Quiet Coach Policy',
        topic: 'Transit Rules',
        accent: 'british',
        speakerA: 'Airport Link Inquiry! Standard Express coaches stop at three towns, whereas Non-Stop Flyer carriages run every twenty minutes reaching Terminal One in nineteen minutes flat.',
        speakerB: 'Can passengers open laptop meetings inside Quiet Coach C?',
        trapA: 'Voices stay hushed in Coach C—take phone meetings over in Lounge Coach B! Free espresso coupons work only before 9:30 a.m. in dining cars.',
        factB: 'Platform Seven serves airport departures exclusively.',
        qPrompt: 'How fast is the non-stop express and where should phone calls move?',
        qOptions: [
          'Takes 35 minutes; phone meetings stay welcome inside Quiet Coach C',
          'Reaches Terminal One in 19 minutes; callers move into Lounge Coach B',
          'Runs once per hour; complimentary coffee runs until midnight',
          'Stops at three suburban hubs from Platform Nine',
        ],
        qAns: 'Reaches Terminal One in 19 minutes; callers move into Lounge Coach B',
        qExp: 'Non-stop runs 19 mins flat; calls shift cleanly from Quiet Coach C to Lounge Coach B.',
        qExpVi: 'Tàu thẳng tới Terminal One chỉ mất 19 phút; cuộc gọi phải chuyển sang toa Lounge Coach B.',
        wordPrompt: 'Enter ONE NUMBER giving non-stop transit duration in minutes: ___ minutes',
        wordAns: '19',
        wordExp: 'Agent specifies reaching Terminal One "in nineteen minutes flat".',
        wordExpVi: 'Thời gian di chuyển tàu thẳng là 19 phút.',
      },
      {
        title: 'University Rare Book Reading Room Pass',
        topic: 'Academic Access',
        accent: 'american',
        speakerA: 'Special Collections Desk! Nineteenth-century shipping maps stay inside Vault Two until afternoon humidity settles safely below fifty percent.',
        speakerB: 'May graduate visitors photograph ink sketches silently with tripods?',
        trapA: 'No camera flashes OR heavy tripods near vellum edges—bring soft foam cradles supplied at Desk One, and store ink pens outside in silver lockers! Pencils stay permitted freely.',
        factB: 'Vault Two requests take 25 minutes.',
        qPrompt: 'Which writing tool and photography restriction protect fragile maps?',
        qOptions: [
          'Ballpoint ink pens allowed beside camera tripods anytime',
          'Only wooden pencils allowed; flashes and tripods forbidden around edges',
          'Vault Two stays open strictly when room humidity exceeds 80%',
          'Digital tablets banned completely outside silver lockers',
        ],
        qAns: 'Only wooden pencils allowed; flashes and tripods forbidden around edges',
        qExp: 'Pens lock outside while pencils + gentle foam cradles protect maps without tripods or flash.',
        qExpVi: 'Cấm bút mực, đèn flash và chân máy; chỉ cho phép dùng bút chì và gối đệm xốp.',
        wordPrompt: 'Type ONE WORD naming the locker color storing prohibited ink pens: ___ lockers',
        wordAns: 'silver',
        wordExp: 'Staff specifies storing ink pens outside inside "silver lockers".',
        wordExpVi: 'Tủ gửi đồ bên ngoài có màu bạc ("silver").',
      },
      {
        title: 'Regional Farmers Organic Stall Licensing',
        topic: 'Small Business',
        accent: 'australian',
        speakerA: 'Sunday Valley Growers Market! Full twelve-month stall pitches open solely to certified organic orchards, yet monthly guest spots allow homemade jam booths twice a season.',
        speakerB: 'We bake sourdough rye loaves and sell walnut honey—do both fit one guest spot?',
        trapA: 'Yes, provided clear allergen ingredient cards sit beside front trays before 7:15 a.m. council walk-throughs! Skip generators completely—battery lanterns keep booths silent.',
        factB: 'Electricity outlets remain reserved strictly for dairy vans.',
        qPrompt: 'What power rule and health display rule apply to guest bakery stalls?',
        qOptions: [
          'Use quiet fuel generators; print allergen lists after breakfast',
          'Rely solely on silent battery lights and display clear allergen lists before 7:15 a.m.',
          'Book dairy outlets for bread mixers throughout afternoon market',
          'Exclude honey products unless orchards pass twelve-month inspections',
        ],
        qAns: 'Rely solely on silent battery lights and display clear allergen lists before 7:15 a.m.',
        qExp: 'No fuel generators allowed; allergen cards must appear ahead of 7:15 checks.',
        qExpVi: 'Cấm dùng máy phát điện ồn, chỉ dùng đèn pin ắc quy yên tĩnh và bày bảng dị ứng trước 7:15 sáng.',
        wordPrompt: 'Type ONE WORD naming the morning dairy vans exclusively reserving electric outlets: ___ vans',
        wordAns: 'dairy',
        wordExp: 'Speaker states electric outlets "remain reserved strictly for dairy vans".',
        wordExpVi: 'Ổ điện chỉ dành riêng cho xe chở sữa ("dairy" vans).',
      },
      {
        title: 'Coastal Bird Sanctuary Volunteer Induction',
        topic: 'Ecology & Wildlife',
        accent: 'british',
        speakerA: 'Estuary Warden Office! Tidewatch shifts log spoonbill nests starting Saturday six, though beginners partner first with seasoned guide Marta near Observation Hide C.',
        speakerB: 'Should we pack bright orange rain parkas for safety around reed beds?',
        trapA: 'Leave neon gear inside cars please—wear dull olive or slate jackets so shy wading flocks settle undisturbed! Binocular straps adjust at the timber shed.',
        factB: 'Hot barley tea pours hourly near Gate One.',
        qPrompt: 'Why must volunteers avoid bright neon coats near Observation Hide C?',
        qOptions: [
          'Reed beds stain pale jackets permanently over weekends',
          'Startling neon colors disturb shy wetland birds near nesting reeds',
          'Timber sheds supply matching neon vests automatically at six',
          'Warden Marta cancels tours whenever rain falls near tides',
        ],
        qAns: 'Startling neon colors disturb shy wetland birds near nesting reeds',
        qExp: 'Dull olive/slate tones protect shy wading birds around nests.',
        qExpVi: 'Áo màu rực dễ làm hoảng sợ các loài chim lội nhút nhát quanh tổ.',
        wordPrompt: 'Type ONE WORD specifying the coastal bird species monitored Saturday morning: ___ nests',
        wordAns: 'spoonbill',
        wordExp: 'The text states tidewatch shifts log "spoonbill nests".',
        wordExpVi: 'Loài chim được theo dõi tổ là chim mỏ thìa ("spoonbill").',
      },
      {
        title: 'Evening Language Cafe Host Briefing',
        topic: 'Cultural Exchange',
        accent: 'international',
        speakerA: 'Polyglot Harbor Table! Beginners gather around Window Booths Monday evenings, while upper-intermediate discussion cards rotate at 7:45 inside the back conservatory.',
        speakerB: 'Do first-timers pay table dues online before ordering herb drinks?',
        trapA: 'No table membership dues at all—simply order one beverage directly at Counter One! Name-sticker colors show comfortable speed: teal for slow clarity, gold for full brisk banter.',
        factB: 'Volunteers never lecture grammar rules unless invited.',
        qPrompt: 'How do guests select pacing comfort and cover event entry?',
        qOptions: [
          'Pay cash fees at Window Booths and test grammar levels verbally',
          'Order one drink at Counter One without cover dues and wear teal or gold pace badges',
          'Join strictly beginners Monday before moving upstairs without badges',
          'Book gold tables exclusively online ahead of Monday',
        ],
        qAns: 'Order one drink at Counter One without cover dues and wear teal or gold pace badges',
        qExp: 'One counter beverage covers participation cleanly, with teal (slow) vs. gold (brisk) stickers.',
        qExpVi: 'Không thu phí hội viên—chỉ cần gọi 1 đồ uống và chọn thẻ màu tốc độ nói (xanh ngọc = chậm rõ, vàng = nhanh).',
        wordPrompt: 'Type ONE WORD identifying the sticker color for relaxed slow English clarity: ___',
        wordAns: 'teal',
        wordExp: 'Host explains "teal for slow clarity, gold for full brisk banter".',
        wordExpVi: 'Màu nhãn dành cho tốc độ chậm rõ ràng là xanh ngọc ("teal").',
      },
    ];
    const c = configs[idx];
    return {
      id: `ielts-lis-p1-${n}`,
      part: 'part_1',
      title: c.title,
      topic: c.topic,
      accent: c.accent,
      cefrTarget: 'B2',
      contextDescription: `Everyday IELTS Part 1 dialogue checking ${c.topic.toLowerCase()} details and avoiding booking traps.`,
      wordLimitNote: 'ONE WORD AND/OR A NUMBER',
      scriptLines: [
        { speaker: 'Coordinator', text: c.speakerA },
        { speaker: 'Caller', text: c.speakerB },
        { speaker: 'Coordinator', text: `${c.trapA} ${c.factB}` },
      ],
      distractorTraps: [
        'Verify revised room/price/location after caller clarifies real situation.',
        'Catch exact single-word/number detail stated explicitly without synonyms.',
      ],
      q1: {
        instruction: 'Choose the accurate confirmed plan filtering out superseded details.',
        prompt: c.qPrompt,
        options: c.qOptions,
        correctAnswer: c.qAns,
        explanation: c.qExp,
        explanationVi: c.qExpVi,
      },
      q2: {
        instruction: 'Complete using STRICTLY ONE WORD/NUMBER verbatim from the dialogue.',
        prompt: c.wordPrompt,
        type: 'fill_blank',
        correctAnswer: c.wordAns,
        acceptableAnswers: [c.wordAns.toLowerCase()],
        explanation: c.wordExp,
        explanationVi: c.wordExpVi,
      },
    };
  }),

  // PART 2: 20 Everyday Social Monologues (ielts-lis-p2-01..20)
  ...Array.from({ length: 20 }, (_, idx): SeedP12 => {
    const num = String(idx + 1).padStart(2, '0');
    const topics: Array<{
      title: string;
      topic: string;
      accent: SeedP12['accent'];
      monologue: string[];
      trapNote: string;
      prompt1: string;
      opts1: string[];
      ans1: string;
      exp1: string;
      exp1Vi: string;
      prompt2: string;
      ans2: string;
      exp2: string;
      exp2Vi: string;
    }> = [
      {
        title: 'Elmwood Botanical Glasshouse Orientation',
        topic: 'Visitor Maps & Parks',
        accent: 'british',
        monologue: [
          'Welcome to Elmwood Conservatory! Looking south from our Ticket Arch, you might spot Palm Dome gleaming first—though hold off photographing cacti yet, since morning sprayers fog Glass Wing A until 10:30.',
          'Walk instead past Stone Koi Pond toward the Fern Corridor along your right shoulder: our volunteer herbarium booth sits just opposite Cinnamon Cafe, well clear of afternoon mower noise.',
        ],
        trapNote: 'Spatial orientation trap: avoid Palm Dome early due to morning misting.',
        prompt1: 'Why should visitors skip Glass Wing A immediately after entering?',
        opts1: [
          'Lawn mowers block the Ticket Arch all morning',
          'Overhead water sprayers cloud camera views inside Wing A until 10:30',
          'Cinnamon Cafe stays closed permanently near the pond',
          'Volunteer guides forbid walking past Stone Koi Pond',
        ],
        ans1: 'Overhead water sprayers cloud camera views inside Wing A until 10:30',
        exp1: 'Guide warns "morning sprayers fog Glass Wing A until 10:30".',
        exp1Vi: 'Vòi phun sương buổi sáng làm mờ kính Khu A tới 10:30.',
        prompt2: 'Single-word noun naming the indoor herbarium station neighbor across the path: ___ Cafe',
        ans2: 'Cinnamon',
        exp2: 'Volunteer herbarium booth stands "just opposite Cinnamon Cafe".',
        exp2Vi: 'Quầy thảo mộc nằm đối diện quán "Cinnamon" Cafe.',
      },
      {
        title: 'Heritage Tramway Museum Audio Walk',
        topic: 'Local History Tours',
        accent: 'australian',
        monologue: [
          'As electric tram Car 18 rolls past Old Brass Depot, notice those iron overhead brackets—everyone credits Mayor Finch in 1924, yet town ledgers confirm chief draughtsman Clara Bell designed those curved braces twelve winters earlier.',
          'Feel free to ring bronze conductor chimes along Platform Five afterward; only Car 4 remains cordoned behind red ropes for fresh oak varnish.',
        ],
        trapNote: 'Attribution reversal: Mayor Finch is wrong foil; Clara Bell designed brackets in 1912.',
        prompt1: 'What common historical myth about the iron brackets does the guide correct?',
        opts1: [
          'Mayor Finch personally funded overhead lines in 1912',
          'Chief draughtsman Clara Bell created the design over a decade before Mayor Finch took credit',
          'Bronze chimes come exclusively from wooden Car 4 carriages',
          'Platform Five remains fenced off behind fresh oak varnish ropes',
        ],
        ans1: 'Chief draughtsman Clara Bell created the design over a decade before Mayor Finch took credit',
        exp1: 'Town ledgers prove Clara Bell drew them "twelve winters earlier" than 1924 credit to Finch.',
        exp1Vi: 'Sổ sách chứng minh nữ kỹ sư Clara Bell thiết kế sớm hơn 12 năm trước khi người ta gán nhầm cho Thị trưởng Finch.',
        prompt2: 'Write ONE WORD identifying the wood finish currently drying on closed Car 4: fresh oak ___',
        ans2: 'varnish',
        exp2: 'Car 4 stays cordoned solely for drying "oak varnish".',
        exp2Vi: 'Toa số 4 đang căng dây vì sơn vecni ("varnish") gỗ sồi mới quét.',
      },
    ];

    // Generate 20 completely distinct, authentic Part 2 everyday monologues deterministically with zero repeats
    const p2Bank: Array<{
      title: string;
      topic: string;
      accent: SeedP12['accent'];
      line1: string;
      line2: string;
      trap: string;
      p1: string;
      opts: string[];
      a1: string;
      e1: string;
      e1Vi: string;
      p2: string;
      a2: string;
      e2: string;
      e2Vi: string;
    }> = [
      {
        title: topics[0].title,
        topic: topics[0].topic,
        accent: topics[0].accent,
        line1: topics[0].monologue[0],
        line2: topics[0].monologue[1],
        trap: topics[0].trapNote,
        p1: topics[0].prompt1,
        opts: topics[0].opts1,
        a1: topics[0].ans1,
        e1: topics[0].exp1,
        e1Vi: topics[0].exp1Vi,
        p2: topics[0].prompt2,
        a2: topics[0].ans2,
        e2: topics[0].exp2,
        e2Vi: topics[0].exp2Vi,
      },
      {
        title: topics[1].title,
        topic: topics[1].topic,
        accent: topics[1].accent,
        line1: topics[1].monologue[0],
        line2: topics[1].monologue[1],
        trap: topics[1].trapNote,
        p1: topics[1].prompt1,
        opts: topics[1].opts1,
        a1: topics[1].ans1,
        e1: topics[1].exp1,
        e1Vi: topics[1].exp1Vi,
        p2: topics[1].prompt2,
        a2: topics[1].ans2,
        e2: topics[1].exp2,
        e2Vi: topics[1].exp2Vi,
      },
      {
        title: 'Westside Arena Spin & Locker Induction',
        topic: 'Campus Athletics',
        accent: 'american',
        line1: 'Welcome Westside Arena members—please don’t hike upstairs past Squash Court Two for spin cycling anymore! Cycling studios shifted downstairs beside Indoor Rowing Tank North once padded acoustic mats arrived.',
        line2: 'Standard gym towels lock comfortably with wrist bands, whereas full keypads stay reserved strictly for bulky badminton bags.',
        trap: 'Relocation distractors: former upstairs Squash room replaced by downstairs Rowing Tank North.',
        p1: 'Where do spinning cycle sessions currently take place?',
        opts: [
          'Upstairs above Squash Court Two as originally built',
          'Downstairs adjacent to Indoor Rowing Tank North',
          'Inside oversized badminton equipment bays',
          'Outdoors around gravel running lanes',
        ],
        a1: 'Downstairs adjacent to Indoor Rowing Tank North',
        e1: 'Speaker clarifies bikes moved "downstairs beside Indoor Rowing Tank North".',
        e1Vi: 'Phòng đạp xe đã dời xuống tầng dưới cạnh bể Rowing Tank North.',
        p2: 'ONE WORD naming the padded floor type placed under bikes: ___ mats',
        a2: 'acoustic',
        e2: 'Studio gained "padded acoustic mats" before shifting downstairs.',
        e2Vi: 'Sàn lót thảm cách âm ("acoustic") được lắp đặt.',
      },
      {
        title: 'Old Port Maritime Lightship Tour Briefing',
        topic: 'Heritage Sites',
        accent: 'british',
        line1: 'Step carefully onto Lightship Aurora! Families sometimes imagine brass beacon bells rang hourly manually, though automated kerosene weights rotated lens gears cleanly every forty seconds after 1919.',
        line2: 'Down in Galley Two smell cinnamon buns baking from replicas, yet climb steep deck ladders solely wearing closed rubber trainers rather than slick leather sandals.',
        trap: 'Technology myth: automated rotating weights ran lenses, NOT manual bell pulling.',
        p1: 'What footwear policy protects visitors climbing ship ladders?',
        opts: [
          'Clean open leather sandals around Galley Two',
          'Closed rubber trainers ensuring non-slip footing',
          'Bare feet on wet wooden brass steps',
          'Boots issued inside the kerosene engine room',
        ],
        a1: 'Closed rubber trainers ensuring non-slip footing',
        e1: 'Guide directs visitors toward "closed rubber trainers rather than slick leather sandals".',
        e1Vi: 'Khách phải đi giày đế cao su kín mũi ("rubber trainers") tránh trơn trượt thang tàu.',
        p2: 'ONE WORD naming the lamp fuel powering automated rotation after 1919: ___ weights',
        a2: 'kerosene',
        e2: 'Audio specifies automated "kerosene" weights driving beacon rotation.',
        e2Vi: 'Nguồn năng lượng xoay đèn biển là dầu hỏa ("kerosene").',
      },
      {
        title: 'Annual Civic Lantern Festival Route',
        topic: 'Town Festivals',
        accent: 'international',
        line1: 'Festival stewards! Last year’s riverside parade looped right across Old Stone Bridge, yet winter stonework repairs nudge this Friday’s paper-lantern procession northward along Willow Canal Towpath instead.',
        line2: 'Brass drums assemble behind Town Clock by 6:40 p.m.; leave fragile electric scooters outside Canal Locks so foot crowds stroll safely under illuminated silk dragons.',
        trap: 'Historical comparison: last year crossed Old Stone Bridge; THIS year shifts onto Willow Canal Towpath.',
        p1: 'Why did parade planners change routes away from Old Stone Bridge?',
        opts: [
          'Electric scooters damaged silk lanterns downtown',
          'Stonework maintenance forced rerouting north along Willow Canal Towpath',
          'Brass bands refused to play near river barges',
          'Crowds outgrew Willow Towpath during last summer’s fair',
        ],
        a1: 'Stonework maintenance forced rerouting north along Willow Canal Towpath',
        e1: 'Winter masonry repairs moved this year’s procession onto Willow Canal Towpath.',
        e1Vi: 'Sửa chữa đá cầu Old Stone Bridge khiến đoàn rước chuyển sang dọc đường kênh Willow Canal.',
        p2: 'ONE WORD specifying lantern dragon fabric fluttering above walkways: ___ dragons',
        a2: 'silk',
        e2: 'Speakers highlight crowds strolling beneath "illuminated silk dragons".',
        e2Vi: 'Chất liệu rồng đèn lồng là vải lụa ("silk").',
      },
    ];

    const extraP2: Array<[string, string, SeedP12['accent'], string, string, string, string[], string, string, string, string, string, string, string]> = [
      ['Suburban Zero-Waste Swap Hub Guide', 'Recycling & Sorting', 'australian', 'Drop dusty glass jars straight onto Wash Racks East cleanly—don’t toss unbroken porcelain saucers into crushed bottle bins! Electronics with bulging lithium packs go strictly inside Fire Sand Drum Three under the porch.', 'Never mix porcelain plates inside bottle recycling chutes; check battery drum safety.', 'Where should cracked ceramic mugs or plates NOT be placed?', ['Wash Racks East before rinsing', 'Crushed glass bottle recycling bins', 'Main reception sorting desks', 'Cardboard flattening shelves'], 'Crushed glass bottle recycling bins', 'Host cautions never tossing porcelain into glass bottle bins because ceramic melts poorly.', 'Không bỏ gốm sứ vỡ vào thùng chai thủy tinh vì khác nhiệt độ nóng chảy.', 'ONE WORD identifying Drum Three’s protective extinguishing material: Fire ___', 'Sand', 'Bulging batteries sit safely inside Fire Sand Drum Three.', 'Cát chống cháy ("Sand").'],
      ['Regional Airport Express Lounge Audio Brief', 'Airport Services', 'american', 'Concourse B Travellers: complimentary quiet pods hide behind Bookshop North rather than beside loud Espresso Bar gates. Shower vouchers print seamlessly using emerald boarding passes—standard economy tickets simply cover fifty-percent towel fees.', 'Pod location trap vs gate cafe; emerald tier gets full waiver.', 'Who prints complimentary shower access vouchers seamlessly?', ['Passengers relaxing near Espresso Bar counters', 'Travellers holding emerald boarding passes', 'Bookshop shoppers arriving without boarding passes', 'All standard economy flyers unconditionally'], 'Travellers holding emerald boarding passes', 'Vouchers unlock free strictly via emerald passes while economy pays half.', 'Thẻ hạng ngọc lục bảo ("emerald") được miễn phí vòi sen; vé phổ thông trả 50%.', 'Write ONE WORD naming the shop located directly in front of the quiet pods: ___ North', 'Bookshop', 'Quiet pods hide "behind Bookshop North".', 'Phía sau hiệu sách ("Bookshop").'],
      ['Woodland Mountain-Bike Park Safety Talk', 'Outdoor Safety', 'british', 'Blue-grade Ridge Loop welcomes new trail riders nicely—never confuse that calm route with Black Drop Ravine forks marked by crossed white triangles after Milepost Four! Always fasten mudguards before clay hollows.', 'Trail color swap: Blue Ridge safe, Black Drop dangerous.', 'What symbol warns cyclists against Black Drop Ravine at Milepost Four?', ['Bright orange painted flags', 'Crossed white triangle signposts', 'Round yellow arrows', 'Red wooden trail gates'], 'Crossed white triangle signposts', 'Rangers mark Black Drop forks specifically using "crossed white triangles".', 'Ký hiệu cảnh báo dốc nguy hiểm là hai tam giác trắng chéo nhau.', 'ONE WORD naming damp valley surface slowing bikes without mudguards: ___ hollows', 'clay', 'Riders attach mudguards specifically before "clay hollows".', 'Hố bùn đất sét ("clay").'],
      ['Central Train Concourse Orientation Walk', 'Station Map', 'international', 'Exiting Main Gates toward North Taxi Rank? Wait—taxis moved briefly around West Arcade while glass awnings wash through Thursday! Left-luggage lockers remain open 24 hours next to Pharmacy Booth Seven.', 'Taxi detour around West Arcade vs intact Pharmacy lockers.', 'Why should arriving guests head to West Arcade for taxis until Thursday?', ['Main Gates flooded permanently after storm drains broke', 'Glass skylight washing temporarily shifted taxi pickup lanes', 'Pharmacy Booth Seven blocked north driveways overnight', 'Train platforms halted arrivals before noon'], 'Glass skylight washing temporarily shifted taxi pickup lanes', 'Cleaning glass awnings nudged taxi bays temporarily into West Arcade.', 'Vệ sinh mái kính khiến bãi đón taxi tạm dời sang West Arcade.', 'ONE WORD identifying the 24-hour shop adjacent to Left-Luggage Lockers: ___ Booth Seven', 'Pharmacy', 'Left-luggage sits directly beside "Pharmacy Booth Seven".', 'Tủ hành lý nằm ngay cạnh quầy thuốc ("Pharmacy").'],
      ['Historic Wool Mill Museum Acoustic Tour', 'Industrial History', 'british', 'Floor Three weaves cotton thread fast now solely for demonstrations—back in 1882 waterwheels below the millrace drove heavy sandstone grindstones before steam turbines arrived cleanly in 1907. Remember wooden ear plugs along Floor Three looms!', 'Shift from 1882 waterwheels -> 1907 steam -> today demo.', 'What initially powered the mill’s heavy grindstones in 1882?', ['Pressurized steam turbines imported overnight', 'Undershot waterwheels turning beneath the millrace', 'Electric motors humming along Floor Three looms', 'Gas lamps mounted near stone ceilings'], 'Undershot waterwheels turning beneath the millrace', 'Waterwheels drove grindstones starting 1882, years before 1907 steam.', 'Guồng nước dưới dòng kênh vận hành máy từ 1882, trước khi chuyển sang tuabin hơi năm 1907.', 'ONE WORD naming the protective audio gear supplied along Floor Three looms: ___ plugs', 'ear', 'Loom demonstrations stay noisy so staff supply wooden "ear" plugs.', 'Nút bịt tai ("ear" plugs).'],
      ['District Hospital Volunteer Courier Guide', 'Health Volunteering', 'american', 'Afternoon blood-sample runners skip slow patient elevators along Wing A cleanly—swipe green badge cards along Service Stair Five straight between Pathology Lab Two and Cardiac Wards cleanly!', 'Elevator bypass: volunteers use Service Stair Five via badge swipe.', 'How do sample couriers move fastest between Pathology Lab Two and Cardiac Wards?', ['Sharing public visitor elevators inside Wing A', 'Swiping green cards to use dedicated Service Stair Five', 'Walking outside hospital lawns to East Gates', 'Waiting hourly for electric carts at Reception'], 'Swiping green cards to use dedicated Service Stair Five', 'Swiping green badges unlocks dedicated Service Stair Five.', 'Quẹt thẻ xanh đi cầu thang nội bộ số 5 để chuyển mẫu nhanh.', 'ONE WORD naming the main lab sending out afternoon tubes cleanly: ___ Lab Two', 'Pathology', 'Stair routes link "Pathology Lab Two" straight up to wards.', 'Phòng xét nghiệm bệnh học ("Pathology").'],
      ['University Freshers Rowing Club Regatta', 'Campus Sport', 'british', 'Beginner scullers launch exclusively from Timber Jetty South where currents slow cleanly; senior eight-oar crews launch off Concrete Pontoon North from 5:45 a.m. Wrap dry fleece jumpers inside sealed blue dry-bags!', 'Jetty split: beginners South calm tides vs seniors Concrete North.', 'Why do first-year scullers use Timber Jetty South instead of the Concrete Pontoon?', ['Concrete Pontoon stays too fragile for light single boats', 'Gentler river flow at Timber Jetty South keeps beginners safe', 'Blue dry-bags hang exclusively near South sheds', 'Senior rowers ban training after seven in the morning'], 'Gentler river flow at Timber Jetty South keeps beginners safe', 'Speaker notes Timber Jetty South sits "where currents slow cleanly".', 'Dòng nước ở bến gỗ phía Nam êm hơn giúp sinh viên năm nhất an toàn.', 'ONE WORD naming the waterproof bag color protecting spare jumpers cleanly: ___ dry-bags', 'blue', 'Coxes advise packing fleece inside "sealed blue dry-bags".', 'Túi chống nước màu xanh dương ("blue").'],
      ['Town Observatory Meteor Watch Brief', 'Astronomy Clubs', 'australian', 'Turn dim red pocket torches down at gravel paths cleanly—white smartphone beams ruin thirty minutes of pupil night adjustment instantaneously! Warm spiced ginger tea pours quietly inside Dome Two shelter cleanly.', 'Eye adaptation rule: dim red lights ONLY, never white phone glare.', 'Why are smartphones and bright white torches forbidden on meadow paths?', ['White signals confuse low coastal rescue helicopters', 'Bright glare strips away thirty minutes of natural dark vision sensitivity', 'Spiced tea stalls rely exclusively on solar sensors', 'Metal domes amplify cell tower interference loudly'], 'Bright glare strips away thirty minutes of natural dark vision sensitivity', 'White glare spoils dark adaptation cleanly described by speaker.', 'Ánh sáng trắng làm mất 30 phút mắt điều tiết quen bóng tối.', 'ONE WORD naming the dome lounge serving hot spiced ginger drinks cleanly: Dome ___ -> ONE WORD NUMBER: ___', 'Two', 'Tea pours inside "Dome Two" shelter.', 'Mái vòm số Hai ("Two").'],
      ['Local Film Archive Silent Screening', 'Cinema Culture', 'american', 'Tonight’s restored 1927 ferry documentary screens with live upright piano score! Ignore stamped 8:00 p.m. flyers—projector reels inspect cleanly so doors open 7:30 and curtains rise strictly at 8:15 p.m.', 'Time adjustment: printed 8:00 p.m. flyers delayed 15 minutes to 8:15 p.m.', 'When does the main silent documentary start screening tonight?', ['Doors at 7:00, screening at 8:00 p.m.', 'Doors open at 7:30 p.m., main film starts promptly at 8:15 p.m.', 'Curators postpone until Friday at noon', 'Live upright piano opens alone at 9:00 p.m.'], 'Doors open at 7:30 p.m., main film starts promptly at 8:15 p.m.', 'Presenter overrides outdated 8:00 p.m. flyers with actual 8:15 p.m. start.', 'Tờ rơi cũ ghi 8:00, thực tế rèm mở lúc 8:15 tối.', 'ONE WORD specifying the live acoustic accompanying instrument tonight cleanly: ___', 'piano', 'Silent film runs with live "upright piano" music.', 'Đàn dương cầm ("piano").'],
      ['Estuary Kayaking Ebb-Tide Orientation', 'Eco Tourism', 'international', 'Before sliding yellow kayaks past reed channels, clip whistle lanyards onto collar straps directly—never tuck whistles inside zipper pockets where stiff saltwater sleeves jam mid-channel!', 'Safety check trap: clip whistles externally on collars, NOT tucked inside zip pockets.', 'Why must whistles stay clipped onto outer collar loops?', ['Whistles rust swiftly unless exposed continuously to breeze', 'Salt-stiff zippers make pocketed whistles slow or stuck during urgencies', 'Pocket clips hold kayak compass maps tightly instead', 'Guide whistles sound louder inside pockets than air'], 'Salt-stiff zippers make pocketed whistles slow or stuck during urgencies', 'Saltwater stiffens pocket zips dangerously during sudden capsizes.', 'Nước mặn làm kẹt khóa kéo túi áo nên phải kẹp còi ở ngoài cổ áo.', 'ONE WORD identifying hull colors lining the reed launch racks cleanly: ___ kayaks', 'yellow', 'Guide checks launching "yellow kayaks past reed channels".', 'Thuyền kayak màu vàng ("yellow").'],
      ['Autumn Book Fair Charity Drop Info', 'Community Markets', 'british', 'Bring crisp hardcover novels straight to Sorting Table Four cleanly, while glossy old magazines roll neatly into paper-baling carts behind Gym Doors! Damaged wet pages sadly cannot enter sale boxes.', 'Exclusion check: wet/stained books rejected; magazines recycled via carts.', 'What becomes of clean glossy magazines brought to the Gym drop-off?', ['Priced beside hardcover novels at Table Four', 'Fed neatly into paper-baling carts behind Gym Doors', 'Returned untouched inside family car trunks', 'Bound into library hardcover sets cleanly'], 'Fed neatly into paper-baling carts behind Gym Doors', 'Magazines separate cleanly into baling carts rather than Table Four sales.', 'Tạp chí bóng đẩy vào xe ép giấy tái chế sau cửa phòng tập.', 'ONE WORD naming the banned condition disqualifying damp books cleanly: ___ pages', 'wet', 'Damaged "wet" pages fail resale safety.', 'Trang bị ướt ("wet") không nhận trưng bày.'],
      ['Regional Pottery Heritage Kiln Tour', 'Craft Heritage', 'australian', 'Stand clear of brick Chimney West while morning ash clears cleanly; visitors enter Drying Loft Two safely once fans finish cycling! Feel cool river-clay blocks stamped neatly with twin anchor crests.', 'Timing clearance: Loft Two opens cleanly ONLY after ventilation fans finish cycling.', 'What indicates the coastal origins of studio pottery clay bricks?', ['Ash brick chimney stamps facing West', 'Twin anchor emblems pressed neatly onto fresh clay blocks', 'Glazed green coffee trays drying upstairs', 'Timber racks painted along Drying Loft Three'], 'Twin anchor emblems pressed neatly onto fresh clay blocks', 'River-clay blocks carry "twin anchor crests" showing coastal trade links.', 'Khối đất sét đóng dấu mỏ neo đôi ("twin anchor crests").', 'ONE WORD naming the cooling room visitors tour cleanly once fans stop: ___ Loft Two', 'Drying', 'Tour moves safely inside "Drying Loft Two".', 'Gác sấy gốm ("Drying").'],
      ['Civic Urban Orchard Tree Planting Day', 'Volunteering', 'american', 'Water new young plum saplings slowly around gravel basins before tucking timber mulch neatly two inches clear of bark trunks! Packing bark tight under damp mulch triggers fungal collar rot cleanly.', 'Crucial technical planting error trap: keep mulch 2 inches away from bark trunk!', 'Why do orchard leaders warn against piling mulch against young tree trunks?', ['Damp wind scatters mulch rings across alleys cleanly', 'Trap moisture sitting right against bark causes collar rot disease', 'Plum roots grow strictly outside gravel basins cleanly', 'Volunteer spades slice mulch boards too shallowly'], 'Trap moisture sitting right against bark causes collar rot disease', 'Tight damp contact invites trunk rot ("collar rot"), so keep mulch two inches back.', 'Tủ mùn sát vỏ thân cây gây thối cổ rễ ("collar rot").', 'ONE WORD specifying which orchard stone-fruit tree volunteers plant today cleanly: ___ saplings', 'plum', 'Team waters young "plum" saplings calmly.', 'Cây mận non ("plum").'],
      ['Night Ferry Terminal Boarding Upgrade', 'Transport Briefings', 'international', 'Foot passengers board cleanly via Covered Walkway East after 9:00 p.m., leaving lower hydraulic ramps clear strictly for heavy timber freight vans! Check green overhead boards if foggy weather holds ferries ten minutes.', 'Gate separation: pedestrians stay on Walkway East away from freight ramps.', 'Why do foot passengers switch to Walkway East late evenings?', ['Lower ferry lounges flood regularly past nine at night', 'Hydraulic ground ramps must clear heavy freight vehicles safely', 'Covered Walkway East closes completely before sunset', 'Overhead green screens show train times exclusively'], 'Hydraulic ground ramps must clear heavy freight vehicles safely', 'Separation removes foot passengers cleanly from truck loading paths.', 'Dành lối dốc thủy lực tầng dưới cho xe tải chở gỗ nặng ban đêm.', 'ONE WORD naming natural weather delays monitored on green boards cleanly: ___ weather', 'foggy', 'Screens post delays specifically when "foggy" harbor conditions slow docking.', 'Thời tiết sương mù ("foggy").'],
      ['Open Campus Radio Studio Tour', 'Student Media', 'british', 'Behind thick triple-pane sound booths, Studio A broadcasts morning campus traffic reports smoothly! Never touch red ceiling lights beside glass doors—lit bulbs alert producers live recordings remain currently active inside.', 'Light signal etiquette: red ceiling bulb means recording live inside.', 'What does an illuminated red door bulb warn visitors not to do?', ['Use campus Wi-Fi passwords inside the studio', 'Open sound booth doors while live microphones stay active', 'Turn on Studio A coffee makers silently', 'Borrow thick headphones cleanly from reception'], 'Open sound booth doors while live microphones stay active', 'Red light indicates live recording, warning against interrupting.', 'Đèn đỏ trên trần báo hiệu phòng đang thu âm trực tiếp, tuyệt đối không mở cửa.', 'ONE WORD describing window glass thickness blocking studio noise cleanly: ___ -pane', 'triple', 'Booths rely on thick "triple-pane" sound glass.', 'Kính ba lớp ("triple"-pane).'],
    ];

    const item =
      idx < p2Bank.length
        ? p2Bank[idx]
        : (() => {
            const e = extraP2[idx - p2Bank.length];
            return {
              title: e[0],
              topic: e[1],
              accent: e[2],
              line1: e[3],
              line2: '',
              trap: e[4],
              p1: e[5],
              opts: e[6],
              a1: e[7],
              e1: e[8],
              e1Vi: e[9],
              p2: e[10],
              a2: e[11],
              e2: e[12],
              e2Vi: e[13],
            };
          })();

    return {
      id: `ielts-lis-p2-${num}`,
      part: 'part_2',
      title: item.title,
      topic: item.topic,
      accent: item.accent,
      cefrTarget: 'B2',
      contextDescription: `Everyday IELTS Part 2 informational briefing focusing on ${item.topic.toLowerCase()} rules and spatial orientation.`,
      wordLimitNote: 'ONE WORD ONLY',
      scriptLines: item.line2
        ? [
            { speaker: 'Guide', text: item.line1 },
            { speaker: 'Guide', text: item.line2 },
          ]
        : [{ speaker: 'Guide', text: item.line1 }],
      distractorTraps: [item.trap],
      q1: {
        instruction: 'Choose the exact detail confirmed in the speaker orientation.',
        prompt: item.p1,
        options: item.opts,
        correctAnswer: item.a1,
        explanation: item.e1,
        explanationVi: item.e1Vi,
      },
      q2: {
        instruction: 'Fill in STRICTLY ONE WORD/NUMBER heard clearly in the briefing.',
        prompt: item.p2,
        type: 'fill_blank',
        correctAnswer: item.a2,
        acceptableAnswers: [item.a2.toLowerCase()],
        explanation: item.e2,
        explanationVi: item.e2Vi,
      },
    };
  }),
];

export const IELTS_LISTENING_P1_P2: IELTSListeningActivity[] = SEEDS_P12.map((s) =>
  createIeltsListening({
    id: s.id,
    part: s.part,
    pathway: 'shared',
    title: s.title,
    topic: s.topic,
    accent: s.accent === 'american' ? 'en-US' : 'en-GB',
    cefrTarget: s.cefrTarget,
    contextDescription: s.contextDescription,
    wordLimitNote: s.wordLimitNote,
    scriptLines: s.scriptLines,
    distractorTraps: s.distractorTraps,
    exercises: [
      iEx({
        id: `il-${s.id}-1`,
        lessonId: s.id,
        type: 'audio_recognition',
        instruction: s.q1.instruction,
        prompt: s.q1.prompt,
        audioText: s.scriptLines.map((l) => `${l.speaker}: ${l.text}`).join(' '),
        options: s.q1.options,
        correctAnswer: s.q1.correctAnswer,
        explanation: s.q1.explanation,
        explanationVi: s.q1.explanationVi,
        difficulty: s.part === 'part_2' ? 3 : 2,
        skills: ['listening'],
      }),
      iEx({
        id: `il-${s.id}-2`,
        lessonId: s.id,
        type: s.q2.type,
        instruction: s.q2.instruction,
        prompt: s.q2.prompt,
        audioText: s.scriptLines.map((l) => `${l.speaker}: ${l.text}`).join(' '),
        correctAnswer: s.q2.correctAnswer,
        acceptableAnswers: s.q2.acceptableAnswers,
        explanation: s.q2.explanation,
        explanationVi: s.q2.explanationVi,
        difficulty: s.part === 'part_2' ? 3 : 2,
        skills: ['listening', 'writing'],
      }),
    ],
  }),
);
