import type { GrammarTopic } from '@english-quest/shared';
import { createGrammarLesson, gEx } from './helpers';

export const A2_GRAMMAR_TOPICS: GrammarTopic[] = [
  createGrammarLesson({
    id: 'gram-a2-01-past-continuous-while-when',
    cefrLevel: 'A2',
    title: 'Past Continuous vs. Past Simple ("when" & "while")',
    summary: 'Paint the background scene of a story and interrupt it sharply with sudden completed events.',
    summaryVi: 'Thì Quá khứ Tiếp diễn kết hợp Quá khứ đơn với "when" và "while" để kể chuyện tự nhiên.',
    objectives: [
      'Form "was / were + V-ing" smoothly to show ongoing background actions at a specific past moment.',
      'Pair long ongoing scenes (Past Continuous) cleanly with short interrupting actions (Past Simple).',
      'Place commas cleanly when opening sentences with "When..." or "While...".',
    ],
    detailedExplanation:
      'Think of storytelling like a movie camera: Past Continuous sets the wide background scenery already running ("Sunlight was streaming through the train window..."), while Past Simple captures sudden crisp events stepping across that scene ("...when the conductor announced our coastal stop"). Both tenses can also run side-by-side with "while" when two background activities happened simultaneously ("While Dad was brewing coffee, kids were packing backpacks").',
    structures: [
      { label: 'Background Scene', formula: 'Subject + was/were + V-ing', example: 'At 8 p.m. last night, we were eating dinner together.' },
      { label: 'Interrupted Action', formula: 'While + Past Continuous, + Past Simple  |  Past Continuous + when + Past Simple', example: 'I was walking home when the summer storm suddenly started.' },
      { label: 'Parallel Background', formula: 'Past Continuous + while + Past Continuous', example: 'Linh was taking photos while Nam was checking our train map.' },
    ],
    usageRules: [
      'Typically use "while" immediately before longer continuous V-ing actions ("While I was waiting...").',
      'Typically use "when" before sudden short Past Simple interruptions ("...when my phone rang").',
      'Keep static state verbs ("know, believe, belong, want") simple even inside "while/when" background stories.',
    ],
    exceptions: [
      'In casual speech, "When I was walking home, I bumped into an old teacher" is also natural alongside "While...".',
      'If two short events happen one cleanly after the other in sequence, keep BOTH in Past Simple ("She locked the door and stepped onto the porch").',
    ],
    examples: [
      { english: 'While I was carrying groceries upstairs, a kind neighbor held the door open.', vietnamese: 'Trong lúc mình đang xách đồ lên cầu thang, một người hàng xóm tốt bụng đã giữ cửa giúp.' },
      { english: 'What were you doing when the afternoon power outage hit?', vietnamese: 'Bạn đang làm gì lúc mất điện buổi chiều vậy?' },
      { english: 'Tourists were watching boats glide past as lanterns lit up the river.', vietnamese: 'Du khách đang ngắm thuyền lướt qua khi đèn lồng bừng sáng bên sông.' },
      { english: 'The battery didn’t charge because I wasn’t plugging the cable tightly enough.', vietnamese: 'Pin không sạc vào vì lúc đó mình cắm dây chưa chặt.' },
      { english: 'While Minh was practicing his presentation, his cat quietly napped on the keyboard.', vietnamese: 'Trong khi Minh đang tập thuyết trình, con mèo lặng lẽ ngủ gật trên bàn phím.' },
    ],
    commonMistakes: [
      { wrong: 'I walked in the park when I was dropping my keys.', right: 'I was walking in the park when I dropped my keys.', why: 'Walking is the long background scene (Continuous); dropping keys is the sudden quick event (Simple).' },
      { wrong: 'While she was cooking, the phone was ringing loudly once.', right: 'While she was cooking, the phone rang loudly.', why: 'A sudden interruptive ring uses Past Simple.' },
      { wrong: 'We was waiting for the delayed airport shuttle.', right: 'We were waiting for the delayed airport shuttle.', why: 'Plural "we" always requires "were".' },
    ],
    comparisons: [
      { structure: 'Sequence vs. Interruption', difference: '"When I arrived, they ate dinner" (they started after I came) vs. "When I arrived, they were eating" (already halfway through).', example: 'Compare timing carefully before picking Past Simple vs. Past Continuous.' },
    ],
    speakingTip: 'In IELTS Part 2 stories, open with one rich Past Continuous background sentence ("It was raining softly outside while I was waiting...")—examiners immediately hear narrative depth.',
    writingTip: 'Use a comma right after an opening adverb clause ("While we were waiting, the station cleared"), yet skip it if "while" sits in the middle.',
    reviewSummary: 'Set ongoing past scenes with was/were + V-ing and slice sudden interruptions using Past Simple + when/while.',
    quiz: [
      gEx({ id: 'qa2-01-1', topicId: 'gram-a2-01-past-continuous-while-when', type: 'multiple_choice', instruction: 'Pick the natural background + interruption combo.', prompt: 'Minh ___ an email when the café Wi-Fi suddenly disconnected.', options: ['wrote', 'was writing', 'writes', 'is writing'], correctAnswer: 'was writing', explanation: 'Ongoing task interrupted by sudden disconnection uses Past Continuous.', difficulty: 1 }),
      gEx({ id: 'qa2-01-2', topicId: 'gram-a2-01-past-continuous-while-when', type: 'fill_blank', instruction: 'Complete with Past Simple or Past Continuous.', prompt: 'While they ___ (pack) suitcases, the taxi arrived downstairs.', correctAnswer: 'were packing', explanation: 'Long background preparation inside "While..." takes Past Continuous "were packing".', difficulty: 1 }),
      gEx({ id: 'qa2-01-3', topicId: 'gram-a2-01-past-continuous-while-when', type: 'error_correction', instruction: 'Fix the mismatched tenses.', prompt: 'Correct: "When she was seeing her friend, she waved immediately."', correctAnswer: 'When she saw her friend, she waved immediately.', explanation: 'Seeing and waving are two quick sequential actions; use Past Simple for both.', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a2-02-future-will-going-to-present-cont',
    cefrLevel: 'A2',
    title: 'Future Forms: "will", "be going to", & Arranged Present Continuous',
    summary: 'Choose naturally between spontaneous promises, prior intentions, fixed calendar dates, and predictions.',
    summaryVi: 'Các cách diễn đạt tương lai: will, be going to và Hiện tại tiếp diễn mang nghĩa tương lai.',
    objectives: [
      'Use "will" smoothly for instant decisions made right now, promises, and offers.',
      'Use "be going to" for pre-decided plans and predictions backed by visible right-now clues.',
      'Use Present Continuous ("We’re flying on Friday") for fixed dates/appointments booked with someone else.',
    ],
    detailedExplanation:
      'English chooses its future form based on WHY you are sure. Decide right at the restaurant table? "I’ll have the tea!" Made up your mind before walking in? "I’m going to study engineering next autumn." Bought plane tickets or wrote down a doctor’s slot on your calendar? "I’m flying to Hue next Tuesday morning." Never try to express every future identically with only "will".',
    structures: [
      { label: 'Instant Decision / Promise / Offer', formula: 'Subject + will (’ll) / won’t + V1', example: 'Wait—you forgot your bag! I’ll run downstairs with it.' },
      { label: 'Planned Intention / Visual Clue', formula: 'Subject + am/is/are going to + V1', example: 'Look at those black storm clouds—it’s going to pour!' },
      { label: 'Booked Calendar Arrangement', formula: 'Subject + am/is/are + V-ing + future time', example: 'We are meeting the mentor at three o’clock tomorrow.' },
    ],
    usageRules: [
      'NEVER write future "will" inside time clauses beginning with "when, before, after, until, as soon as" ("Call me when you arrive", NOT *"when you will arrive").',
      'Pair Present Continuous with a clear future time tag ("tonight, next Friday, at 4") so listeners know you don’t mean right this second.',
      'In informal conversation, shorten "going to" naturally to /ɡənə/ in speech, yet always spell out "going to" in careful writing.',
    ],
    exceptions: [
      'Weather forecasts and formal timetables commonly say both "will rain" (general prediction) and "starts at 8:00" (train/class timetable).',
    ],
    examples: [
      { english: 'The kettle is empty? No problem, I’ll boil fresh water right now.', vietnamese: 'Ấm hết nước rồi à? Không sao, mình đi đun nước mới ngay đây.' },
      { english: 'She’s going to organize all her travel receipts tonight before filing.', vietnamese: 'Tối nay cô ấy dự định sắp xếp hết biên lai du lịch trước khi nộp.' },
      { english: 'Look at his relaxed smile—he’s going to pass that speaking exam easily.', vietnamese: 'Nhìn nụ cười tự tin của anh ấy kìa—anh ấy chắc chắn đậu kỳ thi nói dễ dàng.' },
      { english: 'We’re meeting the project coordinator at nine tomorrow morning.', vietnamese: 'Sáng mai lúc chín giờ chúng mình hẹn gặp điều phối viên dự án.' },
      { english: 'Wait right here until the pharmacy opens at half past seven.', vietnamese: 'Hãy đợi ngay đây cho tới khi hiệu thuốc mở cửa lúc bảy giờ rưỡi.' },
    ],
    commonMistakes: [
      { wrong: 'I’ll call you as soon as I will arrive at the station.', right: 'I’ll call you as soon as I arrive at the station.', why: 'Time clauses ("as soon as, when, until") use Present Simple for future meaning.' },
      { wrong: 'Tomorrow evening I will to buy fresh vegetables.', right: 'Tomorrow evening I will buy fresh vegetables.', why: 'Modal "will" takes bare infinitive without "to".' },
      { wrong: 'Look at that slippery ice! She will falls!', right: 'Look at that slippery ice! She’s going to fall!', why: 'Present visual danger prefers "be going to" + bare base verb "fall".' },
    ],
    comparisons: [
      { structure: 'Instant "will" vs. Planned "going to"', difference: '"Oh, it’s cold—I’ll close the window" (decided now) vs. "I’m going to repaint this room in May" (already planned).', example: 'Pick form based on when you made the choice.' },
    ],
    speakingTip: 'Match real timing: say "I’m having dinner with Anna tonight" (calendar arranged!) instead of stiff textbook *"I will have dinner with Anna tonight".',
    writingTip: 'In academic essays predicting trends ("Solar capacity will expand..."), clean "will" fits neutral objective register well.',
    reviewSummary: 'Use will for spontaneous decisions/offers, going to for prior intentions/visible clues, Present Continuous for booked plans, and Present Simple inside "when/until" clauses.',
    quiz: [
      gEx({ id: 'qa2-02-1', topicId: 'gram-a2-02-future-will-going-to-present-cont', type: 'multiple_choice', instruction: 'Pick the spontaneous offer.', prompt: '"That suitcase looks heavy!" — "Wait, I ___ help you carry it upstairs."', options: ['will', 'am going', 'help', 'helping'], correctAnswer: 'will', explanation: 'Spontaneous helpful decision made right at speaking time uses "will".', difficulty: 1 }),
      gEx({ id: 'qa2-02-2', topicId: 'gram-a2-02-future-will-going-to-present-cont', type: 'error_correction', instruction: 'Fix the future time clause error.', prompt: 'Rewrite accurately: "Send me a message when you will arrive home."', correctAnswer: 'Send me a message when you arrive home.', explanation: 'Drop "will" after "when" and keep Present Simple "arrive".', difficulty: 2 }),
      gEx({ id: 'qa2-02-3', topicId: 'gram-a2-02-future-will-going-to-present-cont', type: 'multiple_choice', instruction: 'Choose the visual prediction.', prompt: 'Check out those dark thunderclouds! It ___ rain within minutes.', options: ['will', 'is going to', 'rains', 'rained'], correctAnswer: 'is going to', explanation: 'Strong present visible evidence takes "be going to".', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a2-03-present-perfect-intro',
    cefrLevel: 'A2',
    title: 'Present Perfect Intro — Experiences, Recent News & "for / since"',
    summary: 'Connect past actions directly to right-now experiences using "have/has + V3", "already/yet/just", and "for/since".',
    summaryVi: 'Thì Hiện tại Hoàn thành (cơ bản): trải nghiệm quá khứ, tin tức vừa xong và "for / since".',
    objectives: [
      'Form "have / has + past participle (V3)" cleanly and distinguish it from finished-time Past Simple.',
      'Use "for + length of time" ("for three years") vs. "since + starting point" ("since 2023") naturally.',
      'Place "already, just, ever, never" cleanly before V3, and "yet" cleanly at the end of negatives/questions.',
    ],
    detailedExplanation:
      'Present Perfect acts like a bridge linking past actions to RIGHT NOW. Use it when time is unspecified life experience ("Have you ever visited Hoi An?"), recent news affecting right now ("I have lost my key—I can’t enter!"), or something that started in the past and is STILL true today ("She has lived here for two years"). The moment you name a closed past clock time ("yesterday, in 2021, last summer"), cross off Present Perfect and switch straight to Past Simple!',
    structures: [
      { label: 'Core Bridge Formula', formula: 'Subject + have / has + V3 (Past Participle)', example: 'We have finished checking twenty new words today.' },
      { label: 'Life Experience / Adverbs', formula: 'Have/Has + Subj + ever + V3?  |  has just/already + V3  |  hasn’t + V3 + yet', example: 'Have you checked the forecast yet? Yes, I’ve just checked it.' },
      { label: 'Unfinished Duration', formula: 'Subject + have/has + V3 + for [duration] / since [start time]', example: 'Minh has played violin since he was eight years old.' },
    ],
    usageRules: [
      'Use "for" before countable durations ("for two hours, for six months, for a long time").',
      'Use "since" before exact starting anchors ("since Monday, since 2019, since we arrived").',
      'Put "yet" normally at the END of negatives and questions ("Did..." or "Has she arrived yet?").',
    ],
    exceptions: [
      'Compare "has been to" (visited and returned) vs. "has gone to" (traveled there and is STILL away right now!).',
      '"This morning / Today / This week" uses Present Perfect while the period is STILL open, and Past Simple after the period closes.',
    ],
    examples: [
      { english: 'Have you ever tasted fresh coconut coffee in Hanoi?', vietnamese: 'Bạn đã từng thử cà phê cốt dừa ở Hà Nội bao giờ chưa?' },
      { english: 'Linh has studied English seriously for nine months without skipping a day.', vietnamese: 'Linh đã học tiếng Anh nghiêm túc được chín tháng không bỏ ngày nào.' },
      { english: 'Sorry I’m breathless—our train has just arrived at platform four!', vietnamese: 'Xin lỗi mình hơi hụt hơi—tàu của mình vừa mới tới sân ga số bốn!' },
      { english: 'Have you attached your presentation slides yet?', vietnamese: 'Bạn đã đính kèm tệp trang trình chiếu chưa?' },
      { english: 'I haven’t seen my cousin since his graduation ceremony last summer.', vietnamese: 'Mình chưa gặp lại anh họ kể từ lễ tốt nghiệp hè năm ngoái.' },
    ],
    commonMistakes: [
      { wrong: 'I have visited Hue last winter.', right: 'I visited Hue last winter.', why: 'Specific finished time "last winter" forces Past Simple.' },
      { wrong: 'She lives in Da Nang since 2022.', right: 'She has lived in Da Nang since 2022.', why: 'Duration continuing from a past anchor up to now requires Present Perfect.' },
      { wrong: 'We have studied together since three years.', right: 'We have studied together for three years.', why: 'Use "for" with total time spans ("three years"), reserving "since" for start dates.' },
    ],
    comparisons: [
      { structure: 'Present Perfect vs. Past Simple', difference: '"I’ve been to Hue" (life experience—when unknown) vs. "I went to Hue in 2024" (closed past date).', example: 'Have you ever seen snow? Yes, I saw it in Japan two years ago.' },
    ],
    speakingTip: 'Answer "Have you ever...?" questions brightly with "Yes, I have—actually I went..." moving seamlessly from experience (Present Perfect) into story details (Past Simple)!',
    writingTip: 'Use "for" + duration neatly inside cover letters ("I have coordinated bilingual workshops for two years").',
    reviewSummary: 'Link past to right now with have/has + V3 ("for" durations, "since" start times), and switch immediately to Past Simple once a finished past date appears.',
    quiz: [
      gEx({ id: 'qa2-03-1', topicId: 'gram-a2-03-present-perfect-intro', type: 'multiple_choice', instruction: 'Pick "for" or "since".', prompt: 'An has volunteered at the neighborhood library ___ last September.', options: ['for', 'since', 'during', 'from'], correctAnswer: 'since', explanation: '"Last September" is a specific starting point, so use "since".', difficulty: 1 }),
      gEx({ id: 'qa2-03-2', topicId: 'gram-a2-03-present-perfect-intro', type: 'error_correction', instruction: 'Fix the closed-time clash.', prompt: 'Correct: "We have visited the art exhibition two days ago."', correctAnswer: 'We visited the art exhibition two days ago.', explanation: '"Two days ago" signals finished Past Simple time.', difficulty: 2 }),
      gEx({ id: 'qa2-03-3', topicId: 'gram-a2-03-present-perfect-intro', type: 'fill_blank', instruction: 'Place "just" or "yet" accurately.', prompt: 'I haven’t packed my umbrella ___.', correctAnswer: 'yet', explanation: 'Negative sentences about unfinished tasks end with "yet".', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a2-04-comparatives-superlatives',
    cefrLevel: 'A2',
    title: 'Comparatives, Superlatives & "(not) as ... as"',
    summary: 'Compare items, cities, habits, and qualities fluently using "-er/more", "-est/most", irregulars, and "as...as".',
    summaryVi: 'So sánh hơn, so sánh nhất và so sánh bằng "(not) as ... as".',
    objectives: [
      'Apply short "-er / -est" endings vs. multi-syllable "more / the most" cleanly without doubling (*"more better").',
      'Master core irregular pairs (good/better/best, bad/worse/worst, far/farther/farthest).',
      'Express gentle fairness or mild differences with "as...as" and "not nearly as...as".',
    ],
    detailedExplanation:
      'English splits comparisons neatly by syllable length. Short 1-syllable adjectives (tall, cheap, fast) plus 2-syllable "-y" adjectives (happy, healthy, easy -> happier/easiest) take suffix "-er / -est". Longer 2+ syllable words (comfortable, reliable, expensive) stay untouched while adding "more / the most" upfront. NEVER use BOTH together (*"more cheaper" is a classic avoidable error).',
    structures: [
      { label: 'Comparative (Two Items)', formula: 'Adj-er / more + Adj + than', example: 'Morning trains feel calmer and faster than afternoon buses.' },
      { label: 'Superlative (Group Winner)', formula: 'the + Adj-est / the most + Adj (+ in/of group)', example: 'This is the most comfortable cafe in our neighborhood.' },
      { label: 'Equality Contrast', formula: '(not) as + Base Adjective/Adverb + as', example: 'Paper books aren’t as light as e-readers, yet they rest eyes better.' },
    ],
    usageRules: [
      'Consonant + -y switches to -ier / -iest ("busy -> busier -> busiest").',
      'Short CVC adjectives double the final letter ("hot -> hotter, big -> bigger").',
      'Superlatives take "the" upfront ("the clearest rule") unless a possessive replaces it ("my best essay").',
    ],
    exceptions: [
      'Irregulars: good -> better -> the best; bad -> worse -> the worst; far -> farther/further -> the farthest/furthest.',
      '"Fun" takes "more fun / the most fun" in modern natural English rather than *"funner".',
    ],
    examples: [
      { english: 'Walking is slower than cycling, yet often healthier for daily errands.', vietnamese: 'Đi bộ chậm hơn đạp xe, nhưng thường tốt cho sức khỏe hơn khi làm việc vặt.' },
      { english: 'July usually brings the hottest afternoons of the year here.', vietnamese: 'Tháng Bảy thường mang lại những buổi chiều nóng nhất trong năm ở đây.' },
      { english: 'The new dictionary app is much easier to read than older tiny brochures.', vietnamese: 'Ứng dụng từ điển mới dễ đọc hơn nhiều so với sách gấp chữ nhỏ cũ.' },
      { english: 'This jacket isn’t nearly as warm as my wool winter coat.', vietnamese: 'Chiếc áo khoác này không ấm bằng áo dạ mùa đông của mình đâu.' },
      { english: 'What is the most unforgettable festival you have attended recently?', vietnamese: 'Lễ hội đáng nhớ nhất bạn từng tham gia gần đây là gì?' },
    ],
    commonMistakes: [
      { wrong: 'Your essay is more clear and more better now.', right: 'Your essay is clearer and much better now.', why: 'Never combine "more" with "-er" or irregular "better"; emphasize with "much" or "far".' },
      { wrong: 'Da Nang is one of most peaceful city.', right: 'Da Nang is one of the most peaceful cities.', why: 'Always keep "the" before superlatives and make the noun plural after "one of the...".' },
      { wrong: 'Coffee today was as hot than yesterday.', right: 'Coffee today was hotter than yesterday.', why: 'Pair "as...as" (equal) OR "-er...than" (more)—never cross-wire *"as...than".' },
    ],
    comparisons: [
      { structure: '"as ... as" vs. "-er than"', difference: '"Not as noisy as downtown" expresses gentleness softly without sounding harsh.', example: 'Trains aren’t as crowded as expressways.' },
    ],
    speakingTip: 'Add mild modifiers ("a bit quieter, much more convenient, by far the tastiest") to jump immediately from flat A2 comparisons into colorful B1+ speech!',
    writingTip: 'Use "significantly / slightly" with comparatives when describing charts cleanly ("Bus ridership rose slightly higher than ferry traffic").',
    reviewSummary: 'Split comparisons by syllable (-er/-est vs. more/the most), never mix both together, and always keep "the" + plural noun after "one of the...".',
    quiz: [
      gEx({ id: 'qa2-04-1', topicId: 'gram-a2-04-comparatives-superlatives', type: 'multiple_choice', instruction: 'Pick the natural comparison.', prompt: 'Living near a green park is ___ than living beside a loud highway.', options: ['more peaceful', 'peacefuller', 'most peaceful', 'more peacefuller'], correctAnswer: 'more peaceful', explanation: 'Multi-syllable adjective "peaceful" takes "more peaceful".', difficulty: 1 }),
      gEx({ id: 'qa2-04-2', topicId: 'gram-a2-04-comparatives-superlatives', type: 'error_correction', instruction: 'Fix the double comparative and missing plural.', prompt: 'Correct: "This is one of the most comfortable chair in library."', correctAnswer: 'This is one of the most comfortable chairs in the library.', explanation: '"One of the..." requires plural "chairs", plus article "the" before specific "library".', difficulty: 2 }),
      gEx({ id: 'qa2-04-3', topicId: 'gram-a2-04-comparatives-superlatives', type: 'fill_blank', instruction: 'Complete using "(not) as ... as" syntax.', prompt: 'My backpack isn’t ___ heavy ___ yours.', correctAnswer: 'as / as', acceptableAnswers: ['as ... as'], explanation: 'Always mirror "as [adj] as" in equality comparisons.', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a2-05-countable-uncountable-quantifiers',
    cefrLevel: 'A2',
    title: 'Countable vs. Uncountable Nouns & Quantifiers',
    summary: 'Handle tricky English uncountables (advice, furniture, luggage, information) plus "some/any/much/many/a few/a little".',
    summaryVi: 'Danh từ đếm được/không đếm được và Lượng từ (some, any, much, many, a few, a little).',
    objectives: [
      'Avoid pluralizing famous English uncountable nouns (*"informations, advices, luggages, equipments").',
      'Pick exact container units ("a piece of advice, two cups of tea") cleanly.',
      'Select countable "many / a few" vs. uncountable "much / a little" vs. flexible "some / a lot of" effortlessly.',
    ],
    detailedExplanation:
      'Many everyday objects treated as easily countable in Vietnamese (like lời khuyên/advice, thông tin/information, hành lý/luggage, đồ nội thất/furniture, bài tập về nhà/homework) are strictly UNCOUNTABLE mass concepts in English! Never add "-s" or "a/an" directly onto them. Instead, keep the verb singular ("The information is helpful") or count individual units with "a piece of advice / two pieces of luggage".',
    structures: [
      { label: 'Countable Plural', formula: 'many / a few / several + Plural Noun', example: 'Only a few passengers waited on platform two.' },
      { label: 'Uncountable Mass', formula: 'much / a little / a piece of + Singular Mass Noun', example: 'Add a little sugar and ask for some helpful advice.' },
      { label: 'Flexible Positive vs. Negative/Question', formula: 'some (+ / polite offer)  |  any (- / neutral ?)  |  a lot of (both +)', example: 'Do you have any questions? Would you like some tea?' },
    ],
    usageRules: [
      'Always follow uncountable nouns with singular verbs ("Traffic is slow", "Good equipment helps").',
      'Use "some" inside genuine polite offers/requests even though they end with a question mark ("Would you like some water?").',
      '"A few / a little" carry a warm hopeful tone (enough!), whereas bare "few / little" means sadly almost none.',
    ],
    exceptions: [
      'News ends in "-s" yet is ALWAYS singular uncountable ("The morning news is encouraging").',
      'Certain words switch meaning between mass and discrete units: "experience" (uncountable skill) vs. "two unforgettable experiences" (specific memorable trips).',
    ],
    examples: [
      { english: 'My mentor gave me one really helpful piece of advice before my interview.', vietnamese: 'Người hướng dẫn đã cho mình một lời khuyên rất hữu ích trước buổi phỏng vấn.' },
      { english: 'How many suitcases can each passenger check in without an extra fee?', vietnamese: 'Mỗi hành khách được ký gửi bao nhiêu va-li mà không mất thêm phí?' },
      { english: 'There isn’t much traffic along the river road before seven o’clock.', vietnamese: 'Trước bảy giờ đường ven sông không đông xe lắm.' },
      { english: 'Would you like some fresh ginger with your hot tea?', vietnamese: 'Bạn có muốn thêm chút gừng tươi vào trà nóng không?' },
      { english: 'All the museum information is clear and easy to find online.', vietnamese: 'Toàn bộ thông tin bảo tàng đều rõ ràng và dễ tìm trên mạng.' },
    ],
    commonMistakes: [
      { wrong: 'Thanks for giving me many useful informations and advices.', right: 'Thanks for giving me useful information and advice.', why: 'Never add plural "-s" to "information" or "advice".' },
      { wrong: 'She brought three luggages onto the airport bus.', right: 'She brought three suitcases (or three pieces of luggage) onto the airport bus.', why: '"Luggage" is an uncountable mass noun; use "suitcases" or "pieces of luggage" to count bags.' },
      { wrong: 'How much bananas do we need for smoothies?', right: 'How many bananas do we need for smoothies?', why: 'Bananas are countable plural—always pair countable plurals with "How many".' },
    ],
    comparisons: [
      { structure: '"a little" vs. "little"', difference: '"We have a little time left" (cheerful—we can finish coffee!); "We have little time left" (worried—almost zero time!).', example: 'Mind that tiny "a"—it reverses your emotional message!' },
    ],
    speakingTip: 'Notice how natural phrases like "a couple of questions" or "a bit of patience" soften requests wonderfully in office chats.',
    writingTip: 'Never write *"much friends" in positive essays ("I met much new food" -> say "a lot of" or "plenty of" in positive statements).',
    reviewSummary: 'Keep advice/information/furniture/luggage strictly singular without "-s", count items via containers, and match "many/few" to countable plurals vs. "much/little" to uncountables.',
    quiz: [
      gEx({ id: 'qa2-05-1', topicId: 'gram-a2-05-countable-uncountable-quantifiers', type: 'multiple_choice', instruction: 'Pick the correct uncountable sentence.', prompt: 'Which sentence uses "information" and "advice" properly?', options: ['She shared two useful advices.', 'We found many clear informations.', 'The receptionist gave us helpful information.', 'Do you have a good advice for me?'], correctAnswer: 'The receptionist gave us helpful information.', explanation: '"Information" and "advice" never take plural "-s" or direct "a/an".', difficulty: 1 }),
      gEx({ id: 'qa2-05-2', topicId: 'gram-a2-05-countable-uncountable-quantifiers', type: 'multiple_choice', instruction: 'Select the right quantifier.', prompt: 'Hurry softly—only ___ minutes remain before the library closes.', options: ['a few', 'a little', 'much', 'less'], correctAnswer: 'a few', explanation: 'Countable plural "minutes" pairs with "a few".', difficulty: 1 }),
      gEx({ id: 'qa2-05-3', topicId: 'gram-a2-05-countable-uncountable-quantifiers', type: 'fill_blank', instruction: 'Complete the polite offer.', prompt: 'Would you like ___ lemon tea while you wait?', correctAnswer: 'some', explanation: 'Polite hospitable offers use "some" in questions.', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a2-06-obligation-advice-modals',
    cefrLevel: 'A2',
    title: 'Must / Have to / Should / Don’t Have to',
    summary: 'Express necessity, gentle suggestions, strict bans ("mustn’t"), and optional freedom ("don’t have to") cleanly.',
    summaryVi: 'Động từ khuyết thiếu chỉ nghĩa vụ và lời khuyên: must, have to, should và sự khác biệt giữa mustn’t vs. don’t have to.',
    objectives: [
      'Distinguish personal urgency ("must") from external rules/past obligation ("had to").',
      'Separate strict prohibition ("mustn’t" = forbidden!) from zero obligation ("don’t have to" = optional!).',
      'Give warm everyday advice using "should / shouldn’t" without adding "to".',
    ],
    detailedExplanation:
      'One of the biggest A2–B1 communication traps is confusing "mustn’t" with "don’t have to". If museum signs say "You MUSTN’T touch ancient pottery", touching is STRICTLY FORBIDDEN. If a host says "You DON’T HAVE TO wear a suit—jeans are fine!", touching isn’t forbidden at all—it is simply optional! Also remember "must" has no past or future tense: whenever describing past or future duties, switch smoothly to "had to" and "will have to".',
    structures: [
      { label: 'Advice', formula: 'Subject + should / shouldn’t + V1', example: 'You should back up important notes before updating.' },
      { label: 'Obligation (Present / Past)', formula: 'have/has to + V1  |  must + V1  |  Past: had to + V1', example: 'Yesterday I had to reschedule my dentist appointment.' },
      { label: 'Forbidden vs. Optional', formula: 'mustn’t + V1 (NO!) vs. don’t/doesn’t have to + V1 (Optional)', example: 'You don’t have to print tickets, though you must carry ID.' },
    ],
    usageRules: [
      'Notice "have to" behaves like an ordinary verb in questions ("Do you have to work on Saturday?", NOT *"Have you to...").',
      'Never insert "to" after "should" or "must" (*"You should to sleep" is wrong).',
      'Use "didn’t have to + V1" when an action wasn’t required in the past.',
    ],
    exceptions: [
      '"Must" also expresses strong confident logical guesswork ("Look at the wet street—it must have rained last night!").',
    ],
    examples: [
      { english: 'You should try shadowing short two-minute podcasts during your morning walk.', vietnamese: 'Bạn nên thử nói nhại theo các đoạn podcast ngắn hai phút khi đi dạo buổi sáng.' },
      { english: 'Passengers don’t have to pay extra for carry-on backpacks.', vietnamese: 'Hành khách không bắt buộc trả thêm phí cho ba lô xách tay.' },
      { english: 'Cyclists mustn’t ride quickly through crowded pedestrian markets.', vietnamese: 'Người đi xe đạp không được phép chạy nhanh qua chợ đi bộ đông người.' },
      { english: 'Because the train was delayed, we had to catch an evening ferry instead.', vietnamese: 'Vì tàu bị hoãn nên chúng mình đã phải đi chuyến phà buổi tối thay thế.' },
      { english: 'Does Minh have to wear safety boots inside the workshop?', vietnamese: 'Minh có bắt buộc phải đi giày bảo hộ bên trong xưởng không?' },
    ],
    commonMistakes: [
      { wrong: 'It’s Sunday—you mustn’t wake up early if you’re tired.', right: 'It’s Sunday—you don’t have to wake up early if you’re tired.', why: '"Mustn’t" bans sleeping in; "don’t have to" means relaxing is completely optional.' },
      { wrong: 'Last week she must stay late at the office.', right: 'Last week she had to stay late at the office.', why: '"Must" has no past tense—use "had to".' },
      { wrong: 'You should to check spam folders for your ticket.', right: 'You should check spam folders for your ticket.', why: 'Keep bare verb "check" right after "should".' },
    ],
    comparisons: [
      { structure: 'Should vs. Must', difference: '"Should" recommends kindly; "must/have to" signals critical duty or safety rule.', example: 'You should drink water often, and drivers must stop at red lights.' },
    ],
    speakingTip: 'Pronounce "have to" smoothly as /ˈhæftə/ in casual speech—keeping the /f/ whisper links effortlessly into "to"!',
    writingTip: 'Soften policy advice in essays using "authorities should prioritize..." rather than harsh *"authorities must obey...".',
    reviewSummary: 'Remember mustn’t = forbidden, don’t have to = optional, had to = past obligation, and keep verbs bare after should/must.',
    quiz: [
      gEx({ id: 'qa2-06-1', topicId: 'gram-a2-06-obligation-advice-modals', type: 'multiple_choice', instruction: 'Separate "forbidden" from "optional".', prompt: 'Entry to the community garden is completely free, so visitors ___ buy tickets.', options: ['mustn’t', 'don’t have to', 'shouldn’t', 'can’t'], correctAnswer: 'don’t have to', explanation: 'Because admission is free, paying isn’t banned—it simply isn’t required ("don’t have to").', difficulty: 2 }),
      gEx({ id: 'qa2-06-2', topicId: 'gram-a2-06-obligation-advice-modals', type: 'fill_blank', instruction: 'Select accurate past obligation.', prompt: 'Two days ago our team ___ reschedule the outdoor match due to storms.', correctAnswer: 'had to', explanation: 'Past obligation always switches from "must/have to" into "had to".', difficulty: 1 }),
      gEx({ id: 'qa2-06-3', topicId: 'gram-a2-06-obligation-advice-modals', type: 'error_correction', instruction: 'Fix the modal infinitive error.', prompt: 'Fix: "Learners should to review five minutes daily."', correctAnswer: 'Learners should review five minutes daily.', explanation: 'Never insert "to" after modal "should".', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a2-07-infinitive-vs-gerund-basics',
    cefrLevel: 'A2',
    title: 'Verb Patterns: "to + Infinitive" vs. "Verb-ing" Gerunds',
    summary: 'Know when two verbs meet whether the second wants "to do" (goals/plans) or "-ing" (enjoyment/prepositions).',
    summaryVi: 'Mẫu động từ đi sau: Động từ nguyên mẫu có "to" (to-V) và Danh động từ (V-ing).',
    objectives: [
      'Use "V-ing" cleanly after enjoyment/hobby verbs ("enjoy, love, mind, finish, suggest, practice, avoid").',
      'Use "to + V1" cleanly after intention/decision verbs ("want, decide, plan, promise, learn, agree, hope").',
      'Always turn verbs straight into "-ing" immediately after any preposition ("good AT speaking, interested IN learning, look forward TO hearing").',
    ],
    detailedExplanation:
      'Whenever two action verbs appear side-by-side in English ("I enjoy reading", "She decided to move"), the second verb changes into a non-finite form: either "to + V1" or "V-ing". Future-facing intention verbs ("decide, plan, hope, promise") choose "to + V1". Activity-experience verbs ("enjoy, finish, keep, suggest, mind") and ALL prepositions ("for, at, of, without, about, look forward to") insist strictly on "V-ing"!',
    structures: [
      { label: 'Mental Experience / Prepositions -> V-ing', formula: 'enjoy / avoid / suggest / finish / practice + V-ing', example: 'Do you mind closing the noisy window?' },
      { label: 'Goals / Decisions -> to + V1', formula: 'want / hope / plan / decide / promise / learn + to + V1', example: 'We decided to catch an early Sunday bus.' },
      { label: 'Preposition Trap -> Always V-ing', formula: 'good at / interested in / thank for / look forward to + V-ing', example: 'I look forward to seeing your team next Monday!' },
    ],
    usageRules: [
      'Gerunds can act as sentence subjects ("Learning five clear words daily builds fluency steadily").',
      'Notice "look forward to" uses "to" as a PREPOSITION—follow it with V-ing ("looking forward to hearing", NOT *"to hear").',
      'After "would like / would love", always use "to + V1" ("I’d love to join", compare "I love joining").',
    ],
    exceptions: [
      'Verbs like "like, love, start, begin" accept BOTH patterns without changing core meaning ("I started to read / started reading").',
    ],
    examples: [
      { english: 'Minh enjoys cooking spicy noodle soup when friends drop by.', vietnamese: 'Minh thích nấu món mì cay mỗi khi bạn bè ghé chơi.' },
      { english: 'Remember to finish practicing pronunciation before closing the lesson.', vietnamese: 'Nhớ luyện phát âm xong rồi hãy đóng bài học nhé.' },
      { english: 'We’re really looking forward to exploring Hoi An lanterns next month.', vietnamese: 'Chúng mình rất mong chờ được khám phá phố đèn lồng Hội An tháng tới.' },
      { english: 'Would you like to order iced jasmine tea or warm coffee?', vietnamese: 'Bạn muốn gọi trà nhài đá hay cà phê ấm?' },
      { english: 'Writing short diary entries every night makes vocabulary stick fast.', vietnamese: 'Viết vài dòng nhật ký ngắn mỗi tối giúp từ vựng bám rất nhanh.' },
    ],
    commonMistakes: [
      { wrong: 'I really enjoy to listen to English podcasts.', right: 'I really enjoy listening to English podcasts.', why: '"Enjoy" strictly takes a gerund (-ing), never "to-infinitive".' },
      { wrong: 'Thank you for explain that rule clearly.', right: 'Thank you for explaining that rule clearly.', why: 'Any verb right after a preposition ("for, in, at, without") takes "-ing".' },
      { wrong: 'I’m looking forward to meet you soon.', right: 'I’m looking forward to meeting you soon.', why: '"To" inside "look forward to" is a preposition requiring "-ing".' },
    ],
    comparisons: [
      { structure: '"like + V-ing" vs. "would like + to V1"', difference: 'General fondness ("I like swimming") vs. polite specific right-now request ("I’d like to swim now").', example: 'I like visiting museums, and today I’d like to visit the ceramic gallery.' },
    ],
    speakingTip: 'Make "Would you like to..." and "I look forward to + V-ing" automatic email and coffee-shop phrases!',
    writingTip: 'Start IELTS essay topic sentences smoothly using gerund subjects ("Protecting coastal wetlands reduces seasonal flood damage").',
    reviewSummary: 'Pair intention verbs with to-V1, enjoyment/prepositions/subjects with V-ing, and remember "look forward to + V-ing".',
    quiz: [
      gEx({ id: 'qa2-07-1', topicId: 'gram-a2-07-infinitive-vs-gerund-basics', type: 'multiple_choice', instruction: 'Pick the clean verb pattern.', prompt: 'My study partner suggested ___ at the library instead of a noisy mall.', options: ['meet', 'to meet', 'meeting', 'met'], correctAnswer: 'meeting', explanation: '"Suggest" strictly prefers V-ing ("suggest doing"), never *"suggest someone to do".', difficulty: 2 }),
      gEx({ id: 'qa2-07-2', topicId: 'gram-a2-07-infinitive-vs-gerund-basics', type: 'fill_blank', instruction: 'Complete with accurate form of "hear".', prompt: 'I’m looking forward to ___ from you next week!', correctAnswer: 'hearing', explanation: '"Look forward to" ends in a preposition, so follow with gerund "hearing".', difficulty: 1 }),
      gEx({ id: 'qa2-07-3', topicId: 'gram-a2-07-infinitive-vs-gerund-basics', type: 'error_correction', instruction: 'Fix the preposition verb ending.', prompt: 'Correct: "She improved her writing by read short articles daily."', correctAnswer: 'She improved her writing by reading short articles daily.', explanation: 'Turn verbs straight into "-ing" immediately after preposition "by".', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a2-08-first-conditional-time-clauses',
    cefrLevel: 'A2',
    title: 'Zero & First Conditionals + Future Time Conjunctions',
    summary: 'Describe general scientific laws (Zero) and realistic likely future results (First) without double-"will" slips.',
    summaryVi: 'Câu Điều kiện Loại 0 (sự thật) và Loại 1 (khả năng có thật ở tương lai).',
    objectives: [
      'Form Zero Conditionals cleanly for facts and habits ("If water boils, it turns to steam").',
      'Form First Conditionals cleanly pairing Present Simple condition + "will/can/should" result.',
      'Spot and fix the top conditional mistake of inserting "will" inside the "If..." clause.',
    ],
    detailedExplanation:
      'Conditionals connect two connected ideas cleanly: IF this condition happens, THEN that outcome follows. Zero Conditional links timeless rules ("If you press play, audio starts"). First Conditional predicts realistic likely futures ("If you practice daily, your speaking will improve quickly"). Remember English’s strict asymmetry: keep the "If" half in PRESENT tense—save "will" purely for the result half!',
    structures: [
      { label: 'Zero Conditional (Always True)', formula: 'If/When + Present Simple, Present Simple', example: 'If plants receive sunlight and water, they grow steadily.' },
      { label: 'First Conditional (Real Future)', formula: 'If + Present Simple, Subject + will / can / might / should + V1', example: 'If the bus arrives early, we’ll grab warm tea before class.' },
      { label: 'Unless Meaning (= If Not)', formula: 'Unless + Present Simple (Affirmative), Future Result', example: 'Unless it rains heavily, the evening walk will go ahead.' },
    ],
    usageRules: [
      'NEVER write "will" inside the condition clause ("If we miss the train..." NOT *"If we will miss...").',
      'Use a comma ONLY when "If/Unless" opens the sentence; drop the comma when "if" sits in the middle.',
      'Pairs naturally with imperative instructions too ("If you need help, raise your hand").',
    ],
    exceptions: [
      '"Will" CAN appear inside "If you will..." only as an extra-formal polite request ("If you’ll kindly wait here, I’ll fetch the manager"), not future conditional prediction.',
    ],
    examples: [
      { english: 'If you study fifteen focused minutes a day, words return effortlessly.', vietnamese: 'Nếu bạn học tập trung mười lăm phút mỗi ngày, từ vựng sẽ quay lại nhẹ nhàng.' },
      { english: 'If the flight runs late tonight, I’ll call the hotel reception right away.', vietnamese: 'Nếu chuyến bay tối nay trễ, mình sẽ gọi ngay cho lễ tân khách sạn.' },
      { english: 'We won’t catch the opening film unless we leave home before six.', vietnamese: 'Chúng ta sẽ không kịp đầu phim trừ khi ra khỏi nhà trước sáu giờ.' },
      { english: 'You can save your spot easily if you confirm your ticket online.', vietnamese: 'Bạn có thể giữ chỗ dễ dàng nếu xác nhận vé trực tuyến.' },
      { english: 'If red lights flash on the dashboard, pull over calmly and check oil.', vietnamese: 'Nếu đèn đỏ nhấp nháy trên bảng điều khiển, hãy tấp xe vào lề kiểm tra dầu.' },
    ],
    commonMistakes: [
      { wrong: 'If it will rain tomorrow, we will stay inside.', right: 'If it rains tomorrow, we will stay inside.', why: 'Keep Present Simple inside the "If" clause; put "will" only in the result clause.' },
      { wrong: 'Unless you don’t hurry, you’ll miss the bus.', right: 'Unless you hurry, you’ll miss the bus.', why: '"Unless" already contains negative meaning ("if not")—never double-negate with "don’t".' },
      { wrong: 'If she practice more she speak well.', right: 'If she practices more, she will speak well.', why: 'Remember "-s" for "she" in Present Simple, a comma after opening clause, and "will" in result.' },
    ],
    comparisons: [
      { structure: '"If" vs. "When" (First Conditional)', difference: '"When I get home" = I’m definitely going home; "If I get home before 8" = unsure whether I’ll manage by 8.', example: 'Pick "when" for certain timing and "if" for uncertain conditions.' },
    ],
    speakingTip: 'Substitute "might" or "could" inside results when you feel 50/50 rather than 100% sure ("If it cools down, we might eat outside").',
    writingTip: 'Great for IELTS recommendations: "If cities widen shaded bike paths, more commuters will swap short car trips for cycling."',
    reviewSummary: 'Keep Present Simple inside If/Unless/When clauses, put will/can/should strictly in the result clause, and avoid double negatives with "unless".',
    quiz: [
      gEx({ id: 'qa2-08-1', topicId: 'gram-a2-08-first-conditional-time-clauses', type: 'multiple_choice', instruction: 'Choose the proper First Conditional condition.', prompt: 'If An ___ her essay tonight, she’ll have all Saturday free.', options: ['finish', 'finishes', 'will finish', 'finished'], correctAnswer: 'finishes', explanation: 'Singular subject "An" inside an "If" clause uses Present Simple "finishes", never "will".', difficulty: 1 }),
      gEx({ id: 'qa2-08-2', topicId: 'gram-a2-08-first-conditional-time-clauses', type: 'error_correction', instruction: 'Fix the double-negative "unless" trap.', prompt: 'Rewrite accurately: "Unless you don’t confirm by noon, the table won’t stay held."', correctAnswer: 'Unless you confirm by noon, the table won’t stay held.', explanation: '"Unless" means "If you do not"; keep the verb inside positive ("confirm").', difficulty: 2 }),
      gEx({ id: 'qa2-08-3', topicId: 'gram-a2-08-first-conditional-time-clauses', type: 'sentence_transformation', instruction: 'Combine with First Conditional.', prompt: 'Rewrite starting with "If": "Take regular listening breaks -> your focus will stay sharp."', correctAnswer: 'If you take regular listening breaks, your focus will stay sharp.', explanation: 'Present Simple in the If clause + comma + "will" result clause.', difficulty: 2 }),
    ],
  }),
];
