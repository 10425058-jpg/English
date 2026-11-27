import type { GrammarTopic } from '@english-quest/shared';
import { createGrammarLesson, gEx } from './helpers';

export const B1_GRAMMAR_TOPICS: GrammarTopic[] = [
  createGrammarLesson({
    id: 'gram-b1-01-present-perfect-continuous',
    cefrLevel: 'B1',
    title: 'Present Perfect Simple vs. Present Perfect Continuous',
    summary: 'Highlight completed visible achievements vs. ongoing uninterrupted activity duration and effort.',
    summaryVi: 'Phân biệt Hiện tại Hoàn thành đơn (kết quả/số lượng) và Tiếp diễn (quá trình/nỗ lực kéo dài).',
    objectives: [
      'Form "have / has been + V-ing" cleanly to stress how long an activity has continued without stopping.',
      'Choose Present Perfect Simple for measurable counts/results ("three essays") vs. Continuous for ongoing time ("all morning").',
      'Explain visible right-now clues ("Tired? Yes, I’ve been cycling uphill") smoothly.',
    ],
    detailedExplanation:
      'Both tenses connect past time right up to now, yet they spotlight different details. Present Perfect Simple asks "HOW MANY / HOW MUCH finished?" ("I’ve read four articles today"). Present Perfect Continuous ("have/has been + V-ing") asks "HOW LONG have you been immersed in doing it?" or explains a live right-now clue ("Look at the mud—he has been gardening in the rain!"). Remember that static state verbs ("know, own, believe") never enter V-ing forms—even with "for five years", write "I’ve known him for five years".',
    structures: [
      { label: 'Process / Duration', formula: 'Subject + have/has + been + V-ing (+ for / since)', example: 'She has been practicing shadowing since six o’clock.' },
      { label: 'Completed Quantity / Result', formula: 'Subject + have/has + V3 (+ how many times)', example: 'She has completed three speaking dialogues so far.' },
      { label: 'Question Focus', formula: 'How long have you been V-ing?  |  How many have you V3?', example: 'How long have you been learning English?' },
    ],
    usageRules: [
      'Choose Continuous for temporary nonstop effort ("I’ve been writing reports all morning").',
      'Switch cleanly to Simple whenever stating permanent duration ("I’ve lived in Hue for ten years" or state verbs "I’ve had this bike since June").',
      'Always use Simple inside "how many / how much" numbers ("They’ve planted forty trees", NOT *"They’ve been planting forty trees").',
    ],
    exceptions: [
      '"Work" and "live" can appear naturally in either Simple or Continuous when talking about ongoing years ("I’ve worked / I’ve been working here since 2021") with little difference.',
    ],
    examples: [
      { english: 'Minh has been working on his presentation slides since eight this morning.', vietnamese: 'Minh đã ngồi làm trang trình chiếu từ tám giờ sáng nay.' },
      { english: 'He has finished twelve slides so far and still feels energized.', vietnamese: 'Đến giờ cậu ấy đã hoàn thiện mười hai trang và vẫn thấy tràn đầy năng lượng.' },
      { english: 'Why are your sneakers dusty? Have you been hiking on the ridge trail?', vietnamese: 'Sao giày bạn dính bụi vậy? Bạn vừa đi bộ đường mòn trên sườn núi à?' },
      { english: 'How long have your neighbors been running that community repair café?', vietnamese: 'Hàng xóm của bạn vận hành quán Repair Café cộng đồng đó bao lâu rồi?' },
      { english: 'We’ve known each other for six semesters, yet today was our first coffee.', vietnamese: 'Chúng mình quen nhau sáu học kỳ rồi mà hôm nay mới đi cà phê buổi đầu.' },
    ],
    commonMistakes: [
      { wrong: 'I have been knowing my best friend for eight years.', right: 'I have known my best friend for eight years.', why: 'Static cognitive verb "know" cannot take Continuous "-ing" forms.' },
      { wrong: 'She has been baking six cakes this afternoon.', right: 'She has baked six cakes this afternoon.', why: 'Finished counted quantities ("six cakes") require Present Perfect Simple.' },
      { wrong: 'How long are you studying English?', right: 'How long have you been studying English?', why: 'Duration starting in the past up to right now needs Present Perfect (Simple or Continuous), not Present Continuous.' },
    ],
    comparisons: [
      { structure: 'Process vs. Result Pair', difference: '"I’ve been painting the kitchen" (hands stained, maybe unfinished) vs. "I’ve painted the kitchen" (job finished—look at clean dry walls!).', example: 'Use Continuous for active effort and Simple for finished completion.' },
    ],
    speakingTip: 'Answer IELTS Part 1 questions like "How long have you lived there?" briskly using "I’ve been living there since..." followed by one warm detail.',
    writingTip: 'Use Present Perfect Continuous smoothly in cover-letter motivation ("I have been mentoring first-year coders over the past three terms").',
    reviewSummary: 'Use have/has been + V-ing for ongoing process duration or live visible clues; switch to have/has + V3 for finished numbers and state verbs.',
    quiz: [
      gEx({ id: 'qb1-01-1', topicId: 'gram-b1-01-present-perfect-continuous', type: 'multiple_choice', instruction: 'Contrast count vs. ongoing duration.', prompt: 'My eyes feel tired because I ___ closely for three straight hours.', options: ['read', 'have read', 'have been reading', 'am reading'], correctAnswer: 'have been reading', explanation: 'Visible present consequence ("eyes feel tired") from nonstop duration uses Continuous.', difficulty: 1 }),
      gEx({ id: 'qb1-01-2', topicId: 'gram-b1-01-present-perfect-continuous', type: 'multiple_choice', instruction: 'Pick proper tense with fixed count.', prompt: 'So far today, An ___ twenty tricky idioms accurately.', options: ['has learned', 'has been learning', 'learned', 'is learning'], correctAnswer: 'has learned', explanation: 'Counted finished results ("twenty idioms so far") take Present Perfect Simple.', difficulty: 2 }),
      gEx({ id: 'qb1-01-3', topicId: 'gram-b1-01-present-perfect-continuous', type: 'error_correction', instruction: 'Fix the stative verb mistake.', prompt: 'Correct: "They have been owning that lakeside bookstore since 2018."', correctAnswer: 'They have owned that lakeside bookstore since 2018.', explanation: 'Possession verb "own" stays Present Perfect Simple.', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b1-02-past-perfect-narrative',
    cefrLevel: 'B1',
    title: 'Past Perfect ("had + V3") — Sequencing Earlier Past Events',
    summary: 'Flash back clearly inside stories to show which past event happened BEFORE another past milestone.',
    summaryVi: 'Thì Quá khứ Hoàn thành ("had + V3"): diễn tả sự việc xảy ra TRƯỚC một mốc quá khứ khác.',
    objectives: [
      'Form "had / hadn’t + past participle (V3)" accurately for earlier past flashbacks.',
      'Combine Past Perfect (earlier step) and Past Simple (later step) smoothly with "by the time, already, never...before, because".',
      'Avoid overusing Past Perfect for ordinary step-by-step past order when chronological flow is already crystal clear.',
    ],
    detailedExplanation:
      'Imagine two moments on yesterday’s timeline: Event A at 7:00 a.m. and Event B at 7:20 a.m. When telling a story anchored at 7:20 a.m. ("When I arrived at the station..."), flash back smoothly to 7:00 a.m. using Past Perfect ("...the express train had already left!"). Notice that if you narrate in clean forward order ("I arrived at 7:20 and bought a coffee at 7:25"), normal Past Simple works wonderfully—only bring in "had + V3" when jumping backward out of order or showing a reason.',
    structures: [
      { label: 'Earlier Action Flashback', formula: 'Later Moment (Past Simple) + Earlier Cause (had + V3)', example: 'She felt calm in the exam because she had practiced speaking all week.' },
      { label: 'By The Time', formula: 'By the time + Past Simple, Subject + had + V3', example: 'By the time we reached the harbor, volunteers had cleaned the shore.' },
      { label: 'First Past Experience', formula: 'It was the first time + Subject + had ever + V3', example: 'It was the first time Nam had tasted homemade buckwheat pancakes.' },
    ],
    usageRules: [
      'Only deploy Past Perfect when comparing two past moments—never use "had + V3" alone for a single yesterday sentence.',
      'Combine smoothly with "already, just, never, still not, by then" ("By noon they hadn’t received the reply").',
      'Contract "had" softly to "’d" in conversation ("When I opened my bag, I realized I’d left my charger behind").',
    ],
    exceptions: [
      'With "after" and "before", English already makes chronological order unmistakable, so BOTH Past Simple ("After we ate, we walked") and Past Perfect ("After we had eaten, we walked") are grammatically natural.',
    ],
    examples: [
      { english: 'When Minh reached platform three, the morning train had already departed.', vietnamese: 'Khi Minh ra tới sân ga số ba thì chuyến tàu sáng đã khởi hành mất rồi.' },
      { english: 'The kitchen smelled warm because Mom had baked cinnamon bread earlier.', vietnamese: 'Căn bếp thơm ấm vì mẹ đã nướng bánh mì quế trước đó.' },
      { english: 'She didn’t recognize the street because everything had changed since her childhood.', vietnamese: 'Cô ấy không nhận ra con phố vì mọi thứ đã đổi khác từ thời thơ ấu.' },
      { english: 'By the time we checked in, our teammate had already set up the projector.', vietnamese: 'Đến lúc chúng mình làm thủ tục vào, đồng đội đã lắp xong máy chiếu rồi.' },
      { english: 'Had you ever stayed in a wooden mountain lodge before that winter trip?', vietnamese: 'Bạn đã từng ở nhà gỗ trên núi bao giờ trước chuyến đi mùa đông đó chưa?' },
    ],
    commonMistakes: [
      { wrong: 'When I arrived downtown, my friend already bought cinema tickets.', right: 'When I arrived downtown, my friend had already bought cinema tickets.', why: 'Buying tickets happened BEFORE arriving; add "had" before "bought".' },
      { wrong: 'Yesterday I had gone to the bank and had paid my bill.', right: 'Yesterday I went to the bank and paid my bill.', why: 'Sequential actions told in forward order belong in clean Past Simple, not repeated Past Perfect.' },
      { wrong: 'She had never fly overseas before 2023.', right: 'She had never flown overseas before 2023.', why: 'Use V3 Past Participle ("flown"), not base V1 ("fly").' },
    ],
    comparisons: [
      { structure: 'When I got home, Dad cooked vs. had cooked', difference: '"Dad cooked dinner" = he began after I walked in; "Dad had cooked dinner" = warm plates were already waiting on the table!', example: 'That single helper "had" completely swaps dinner timing!' },
    ],
    speakingTip: 'Watch how "I’d + V3" ("I’d completely forgotten my umbrella!") adds dramatic narrative sparkle naturally in everyday anecdotes.',
    writingTip: 'Use Past Perfect in IELTS history summaries or Task 1 past maps ("By 2020, planners had converted the old factory yard into a riverside park").',
    reviewSummary: 'Use "had + V3" specifically to step backward behind a Past Simple story anchor ("By the time we arrived, it had begun").',
    quiz: [
      gEx({ id: 'qb1-02-1', topicId: 'gram-b1-02-past-perfect-narrative', type: 'multiple_choice', instruction: 'Sequence the two past events.', prompt: 'By the time our flight landed, the heavy rainstorm ___.', options: ['already stopped', 'had already stopped', 'has already stopped', 'stops'], correctAnswer: 'had already stopped', explanation: '"By the time + Past Simple" calls for Past Perfect showing earlier completion.', difficulty: 1 }),
      gEx({ id: 'qb1-02-2', topicId: 'gram-b1-02-past-perfect-narrative', type: 'fill_blank', instruction: 'Use the V3 participle after "had".', prompt: 'They felt proud because they had ___ (overcome) months of stage fright.', correctAnswer: 'overcome', explanation: 'Irregular V3 of "overcome" is "overcome" (overcome-overcame-overcome).', difficulty: 2 }),
      gEx({ id: 'qb1-02-3', topicId: 'gram-b1-02-past-perfect-narrative', type: 'multiple_choice', instruction: 'Distinguish sequence vs. flashback.', prompt: 'In which sentence were dinner plates ALREADY cooked before arrival?', options: ['When we arrived, Grandma cooked soup.', 'When we arrived, Grandma was cooking soup.', 'When we arrived, Grandma had cooked soup.', 'Before we arrived, we cooked soup.'], correctAnswer: 'When we arrived, Grandma had cooked soup.', explanation: 'Past Perfect ("had cooked") signals dinner was completed earlier.', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b1-03-defining-nondefining-relative-clauses',
    cefrLevel: 'B1',
    title: 'Relative Clauses: Who / Which / That / Where / Whose (+ Commas)',
    summary: 'Combine choppy sentences smoothly while distinguishing essential Defining vs. extra Non-defining clauses.',
    summaryVi: 'Mệnh đề Quan hệ xác định và không xác định (who, which, that, where, whose).',
    objectives: [
      'Choose "who/that" for people, "which/that" for things, "whose + noun" for possession, and "where" for places-with-action.',
      'Omit object relative pronouns fluently in natural speech ("the podcast [that] I heard yesterday").',
      'Protect punctuation in Non-defining clauses: keep commas around extra info and NEVER use "that" after a comma.',
    ],
    detailedExplanation:
      'Instead of repeating short clunky sentences ("I have a mentor. She gives warm advice."), relative clauses weave details neatly together ("I have a mentor who gives warm advice"). Master the critical comma split: Defining clauses specify WHICH one ("Learners who review daily keep words longer" — NO commas, "that" OK). Non-defining clauses add extra bonus background about an already unique noun ("My laptop, which I bought in 2023, still runs fast" — MUST have commas and FORBID "that"!).',
    structures: [
      { label: 'Defining (Essential ID — No Commas)', formula: 'Noun + who/which/that + Clause', example: 'The app that trains pronunciation rhythm helped her confidence.' },
      { label: 'Object Pronoun Optional Drop', formula: 'Noun + (who/which/that) + Subject + Verb', example: 'Here is the book [which] you recommended last week!' },
      { label: 'Non-Defining (Bonus Fact — Commas, NO "that")', formula: 'Unique Noun, + who/which/whose + Extra Fact, + Main Verb', example: 'Hoi An, which welcomes craft lovers worldwide, bans downtown motorbikes.' },
    ],
    usageRules: [
      'Use "whose + Noun" even for inanimate organizations or items ("the city whose tram network runs cleanly").',
      'Choose "where" ONLY when the clause lacks a spatial pronoun/preposition ("the café where we met", YET "the café WHICH we visited" because "visit" takes a direct object!).',
      'Never leave an extra duplicate pronoun behind (*"The student who I met him" -> "The student who I met").',
    ],
    exceptions: [
      'After a comma referring back to a whole preceding idea/clause, always use ", which..." ("He arrived ahead of schedule, which surprised everyone").',
    ],
    examples: [
      { english: 'Students who summarize articles in their own words retain arguments better.', vietnamese: 'Học viên tự tóm tắt bài báo bằng lời của mình ghi nhớ lập luận tốt hơn.' },
      { english: 'The mountain cabin where we stayed overlooked quiet pine terraces.', vietnamese: 'Căn nhà gỗ trên núi nơi chúng mình nghỉ lại nhìn ra thềm thông yên ả.' },
      { english: 'The new audio lesson that you unlocked introduces gentle café shadowing.', vietnamese: 'Bài nghe mới mà bạn vừa mở khóa giới thiệu kỹ thuật nhại hội thoại quán cà phê.' },
      { english: 'My brother Minh, who recently moved to Da Nang, works as a harbor architect.', vietnamese: 'Anh trai Minh của mình, người mới chuyển tới Đà Nẵng, làm kiến trúc sư cảng biển.' },
      { english: 'Always support colleagues whose presentations require quick slides feedback.', vietnamese: 'Luôn hỗ trợ đồng nghiệp những người có bài thuyết trình cần góp ý nhanh.' },
    ],
    commonMistakes: [
      { wrong: 'Here is the cafe which we had breakfast yesterday.', right: 'Here is the café where we had breakfast yesterday.', why: '"Had breakfast" has no missing noun object—use "where" (or "in which") for place context.' },
      { wrong: 'Saigon, that sits beside the river, thrives with street coffee.', right: 'Ho Chi Minh City, which sits beside the river, thrives with street coffee.', why: 'Never put "that" after a comma in Non-defining clauses—use "which" or "who".' },
      { wrong: 'The article that I read it yesterday offered sharp evidence.', right: 'The article that I read yesterday offered sharp evidence.', why: 'Remove dangling "it"; "that" already plays the object role inside the clause.' },
    ],
    comparisons: [
      { structure: '"where" vs. "which" for Places', difference: '"The library where I study" (action occurs AT library) vs. "The library which opens at 8" (library itself IS subject/object).', example: 'Does the place act as thing ("which") or stage ("where")?' },
    ],
    speakingTip: 'Drop optional object "that/which" smoothly in casual talk ("The shirt you wore looked great") to sound effortlessly natural!',
    writingTip: 'Use Non-defining ", which..." comments in IELTS essays sparingly to synthesize impacts neatly without chopping prose into toddler sentences.',
    reviewSummary: 'Separate Defining (no commas, "that" allowed) from Non-defining (commas mandatory, "that" forbidden!), keep "which" vs. "where" clean, and delete duplicate pronouns.',
    quiz: [
      gEx({ id: 'qb1-03-1', topicId: 'gram-b1-03-defining-nondefining-relative-clauses', type: 'multiple_choice', instruction: 'Respect Non-defining comma rules.', prompt: 'Solar panels, ___ generate silent roof power, now cost far less than a decade ago.', options: ['that', 'which', 'what', 'where'], correctAnswer: 'which', explanation: 'After a comma in a Non-defining clause describing things, always use "which", never "that".', difficulty: 2 }),
      gEx({ id: 'qb1-03-2', topicId: 'gram-b1-03-defining-nondefining-relative-clauses', type: 'multiple_choice', instruction: 'Separate "which" (object) vs. "where" (place stage).', prompt: 'This is the sunny garden ___ my grandparents planted twenty orange trees.', options: ['which', 'where', 'whose', 'that'], correctAnswer: 'where', explanation: '"Planted twenty orange trees" already has its direct object; the garden is the location stage ("where").', difficulty: 2 }),
      gEx({ id: 'qb1-03-3', topicId: 'gram-b1-03-defining-nondefining-relative-clauses', type: 'error_correction', instruction: 'Delete the redundant object pronoun.', prompt: 'Correct: "The feedback who our mentor shared it helped immediately."', correctAnswer: 'The feedback that our mentor shared helped immediately.', acceptableAnswers: ['The feedback which our mentor shared helped immediately.', 'The feedback our mentor shared helped immediately.'], explanation: 'Change "who" -> "that/which" for non-human "feedback" and remove redundant "it".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b1-04-passive-voice-all-common-tenses',
    cefrLevel: 'B1',
    title: 'Passive Voice Across Tenses & Academic Impersonal Tone',
    summary: 'Spotlight the receiver, scientific process, or city improvement naturally when "who did it" matters less or is obvious.',
    summaryVi: 'Câu Bị động (Passive Voice) ở các thì phổ biến và văn phong khách quan trong học thuật.',
    objectives: [
      'Form clean Passive across Present Simple ("is baked"), Past Simple ("was built"), Future ("will be tested"), Modals ("can be reused"), and Present Perfect ("has been verified").',
      'Maintain correct auxiliary agreement ("The criteria WERE revised", NOT *"was revised").',
      'Spot when Active voice reads stronger vs. when Passive voice elevates objective science/process writing.',
    ],
    detailedExplanation:
      'Active voice follows WHO acts ("Engineers tested the bridge"). Passive flips the spotlight onto WHAT receives action ("The bridge was tested carefully"). Every Passive tense obeys one universal mathematical formula: [appropriate tense of TO BE] + [V3 Past Participle]. If you can conjugate "To Be" accurately across any tense, you already know every Passive tense! Only include "by + doer" when naming the doer adds truly helpful new information ("invented by Ada Lovelace", NOT *"caught by police officers").',
    structures: [
      { label: 'Universal Formula', formula: 'Receiver Subject + [To Be in target tense] + V3 (+ by Agent)', example: 'Clean cotton shirts are washed gently in cool water.' },
      { label: 'Modals & Future Passive', formula: 'will / can / should / must + be + V3', example: 'Old glass bottles can be recycled endlessly without losing purity.' },
      { label: 'Continuous & Perfect Passive', formula: 'is/are being + V3  |  has/have been + V3', example: 'Three shaded bike lanes have been built downtown this year.' },
    ],
    usageRules: [
      'Check if the verb is TRANSITIVE (capable of taking an object): intransitive verbs like "happen, arrive, fall, disappear, seem" CANNOT become passive (*"The storm was happened" is wrong!).',
      'Match "is/was" vs. "are/were" to the NEW receiver subject at the front ("Hundreds of essays were graded").',
      'Drop vague obvious agents ("by someone", "by people")—keep sentences crisp.',
    ],
    exceptions: [
      'In casual everyday speech, "get + V3" sometimes replaces "be + V3" for unexpected accidents or repairs ("My bike got repaired fast").',
    ],
    examples: [
      { english: 'Every new vocabulary word is validated against duplicate IDs before release.', vietnamese: 'Mỗi từ vựng mới đều được kiểm định chống trùng mã trước khi phát hành.' },
      { english: 'This stone pedestrian bridge was restored gently using traditional lime mortar.', vietnamese: 'Cây cầu đi bộ bằng đá này được trùng tu cẩn thận bằng vữa vôi truyền thống.' },
      { english: 'Several historic tram signs have been preserved inside the civic museum.', vietnamese: 'Nhiều biển báo xe điện cổ đã được bảo tồn trong bảo tàng thành phố.' },
      { english: 'Solar battery units are being installed on school roofs across three provinces.', vietnamese: 'Các bộ lưu trữ pin mặt trời đang được lắp đặt trên mái trường học ở ba tỉnh.' },
      { english: 'Clear safety procedures must be followed before activating compressed tanks.', vietnamese: 'Phải tuân thủ quy trình an toàn rõ ràng trước khi mở bình khí nén.' },
    ],
    commonMistakes: [
      { wrong: 'An unexpected power failure was happened during dinner.', right: 'An unexpected power failure happened during dinner.', why: '"Happen" and "occur" are intransitive verbs with zero object—never make them passive!' },
      { wrong: 'The curriculum materials will update next Monday.', right: 'The curriculum materials will be updated next Monday.', why: 'Materials cannot update themselves—add "be" + V3 "updated".' },
      { wrong: 'Coffee beans is grown along highland volcanic hills.', right: 'Coffee beans are grown along highland volcanic hills.', why: 'Plural receiver "beans" demands plural auxiliary "are".' },
    ],
    comparisons: [
      { structure: 'Active Story vs. Passive Process', difference: 'Tell friend stories Actively ("My uncle roasted these beans"); describe IELTS Task 1 manufacturing charts Passively ("Next, roasted beans are cooled and ground").', example: 'Use Passive specifically where object transformation matters more than human names.' },
    ],
    speakingTip: 'Use "was made / was built / is celebrated" naturally when talking about hometown dishes or architecture.',
    writingTip: 'Passive shines in IELTS Task 1 process diagrams ("First, rain is filtered through fine river sand before storage").',
    reviewSummary: 'Conjugate "To Be" into the needed tense plus V3, never passivize intransitive verbs like "happen/arrive", and drop obvious "by people" endings.',
    quiz: [
      gEx({ id: 'qb1-04-1', topicId: 'gram-b1-04-passive-voice-all-common-tenses', type: 'multiple_choice', instruction: 'Choose accurate Present Perfect Passive.', prompt: 'Over forty public benches ___ along the riverfront promenade this spring.', options: ['have installed', 'have been installed', 'were installing', 'are install'], correctAnswer: 'have been installed', explanation: '"This spring" + receiver "benches" requires "have been + V3".', difficulty: 2 }),
      gEx({ id: 'qb1-04-2', topicId: 'gram-b1-04-passive-voice-all-common-tenses', type: 'error_identification', instruction: 'Spot the impossible passive verb.', prompt: 'Which sentence contains a common intransitive-verb passive error?', options: ['The bike path was repainted in May.', 'The accident was happened near dusk.', 'The parcel will be delivered tomorrow.', 'Clean water is tested hourly.'], correctAnswer: 'The accident was happened near dusk.', explanation: '"Happen" has no passive form—write "The accident happened near dusk."', difficulty: 2 }),
      gEx({ id: 'qb1-04-3', topicId: 'gram-b1-04-passive-voice-all-common-tenses', type: 'sentence_transformation', instruction: 'Rewrite into clean Passive Voice.', prompt: 'Active -> Passive (omit obvious agent): "Staff must check every passport at boarding."', correctAnswer: 'Every passport must be checked at boarding.', explanation: 'Keep modal "must" + "be" + V3 "checked".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b1-05-second-conditional-hypothetical',
    cefrLevel: 'B1',
    title: 'Second Conditional & Hypothetical Preferences ("wish / if only")',
    summary: 'Imagine unlikely, creative, or opposite-to-reality present situations smoothly ("If I lived near the sea...").',
    summaryVi: 'Câu Điều kiện Loại 2 và cấu trúc ước muốn ở hiện tại ("wish / if only").',
    objectives: [
      'Form Second Conditional ("If + Past Simple, would/could/might + V1") cleanly for imaginary now/future worlds.',
      'Use polite standard "If I were..." gracefully when offering gentle advice ("If I were in your shoes, I’d...").',
      'Separate Real First Conditional ("If I get time tonight...") cleanly from Unreal Second Conditional ("If I had 48 hours a day...").',
    ],
    detailedExplanation:
      'Second Conditional does NOT talk about yesterday! Instead, using Past tense inside "If..." creates mental distance from real present life: "If I had an extra afternoon free (I don’t right now!), I would hike up to the waterfall." Even better, remember not to drag "would" inside the "If" clause—just like First Conditional saves "will" for the result, Second Conditional saves "would / could / might" strictly for the result half!',
    structures: [
      { label: 'Unreal Present / Imaginary Future', formula: 'If + Subject + Past Simple (or were), Subject + would / could / might + V1', example: 'If buses ran every ten minutes, fewer citizens would drive downtown.' },
      { label: 'Empathetic Advice Frame', formula: 'If I were you, I’d + V1', example: 'If I were you, I’d test microphone sound ten minutes before the call.' },
      { label: 'Present Wish', formula: 'Subject + wish / if only + Subject + Past Simple (or were)', example: 'I wish I spoke Spanish well enough to follow travel podcasts.' },
    ],
    usageRules: [
      'Use "were" for ALL persons in careful formal/IELTS Second Conditionals ("If public transport were free..."), while "was" appears in relaxed casual speech with I/he/she.',
      'Never insert "would" inside the "If" condition (*"If I would live..." -> "If I lived...").',
      'Replace "would" with "could" for imaginary ability ("If I had a studio, I could record clean podcasts") or "might" for cautious possibility.',
    ],
    exceptions: [
      'With "wish", complaining politely about an annoying habit or weather uses "wish + would" ("I wish the rain would stop!"), NEVER with "I wish I would..." for your own self (say "I wish I could...").',
    ],
    examples: [
      { english: 'If cities replaced wide concrete roundabouts with shaded parks, summers would cool down.', vietnamese: 'Nếu thành phố thay bùng binh bê tông lớn bằng công viên rợp bóng, mùa hè sẽ mát mẻ hơn.' },
      { english: 'If I had six spare months, I would travel slowly along the northern coast by train.', vietnamese: 'Nếu có sáu tháng rảnh rỗi, mình sẽ đi chậm dọc bờ biển phía bắc bằng tàu hỏa.' },
      { english: 'If she were less nervous before presentations, her clear voice would shine immediately.', vietnamese: 'Nếu cô ấy bớt hồi hộp trước lúc thuyết trình, giọng nói rõ của cô ấy sẽ tỏa sáng ngay.' },
      { english: 'I wish my apartment balcony received a bit more morning sunlight for herbs.', vietnamese: 'Ước gì ban công nhà mình đón được thêm chút nắng sáng để trồng rau gia vị.' },
      { english: 'Would you switch careers if you could keep the exact same salary while working part-time?', vietnamese: 'Bạn có chuyển nghề không nếu vừa giữ nguyên mức lương vừa chỉ làm bán thời gian?' },
    ],
    commonMistakes: [
      { wrong: 'If I would have more free time, I would paint often.', right: 'If I had more free time, I would paint often.', why: 'Keep "would" purely inside the result clause; use Past Simple "had" after "If".' },
      { wrong: 'If I am you, I choose the morning train.', right: 'If I were you, I would choose the morning train.', why: 'Advice imagining being someone else always uses Second Conditional "If I were you, I’d...".' },
      { wrong: 'I wish I have a quieter desk lamp.', right: 'I wish I had a quieter desk lamp.', why: '"Wish" about current reality shifts the verb back one step into Past Simple ("had").' },
    ],
    comparisons: [
      { structure: 'First vs. Second Conditional Mindset', difference: 'Candidate says "If I get Band 7.5 this autumn, I’ll apply" (real active plan!) vs. "If I won the lottery tomorrow, I’d build a library" (fun daydream).', example: 'Pick conditional 1 vs. 2 by how realistic you see the odds.' },
    ],
    speakingTip: '"If I could choose anywhere to live for a year, I’d probably pick..." helps you ace hypothetical IELTS Part 3 questions smoothly.',
    writingTip: 'Never mix half Type-1 ("If government provides...") with half Type-2 ("citizens would enjoy..."); keep tense logic parallel across both halves.',
    reviewSummary: 'Use Past Simple (and "were") inside "If / wish" to signal unreal present/hypothetical worlds, keeping "would / could / might" strictly in the result clause.',
    quiz: [
      gEx({ id: 'qb1-05-1', topicId: 'gram-b1-05-second-conditional-hypothetical', type: 'multiple_choice', instruction: 'Pick the clean Second Conditional.', prompt: 'If coastal schools ___ offline study kits, rural students ___ stay connected easily.', options: ['receive / would', 'received / would', 'would receive / will', 'had received / would'], correctAnswer: 'received / would', explanation: 'Match Past Simple "received" in If-clause with modal "would" in result clause.', difficulty: 1 }),
      gEx({ id: 'qb1-05-2', topicId: 'gram-b1-05-second-conditional-hypothetical', type: 'fill_blank', instruction: 'Complete present wish accurately.', prompt: 'Linh lives in a busy center and wishes her street ___ (be) much quieter.', correctAnswer: 'were', acceptableAnswers: ['was'], explanation: 'Formal "were" (or casual "was") follows "wish" for unreal present situations.', difficulty: 1 }),
      gEx({ id: 'qb1-05-3', topicId: 'gram-b1-05-second-conditional-hypothetical', type: 'error_correction', instruction: 'Fix the double "would" conditional error.', prompt: 'Rewrite accurately: "If it wouldn’t rain right now, we’d walk home."', correctAnswer: 'If it weren’t raining right now, we’d walk home.', acceptableAnswers: ["If it didn't rain so much right now, we'd walk home.", "If it weren't raining right now, we would walk home."], explanation: 'Remove "would" from the "If" clause and use past tense ("didn’t / weren’t V-ing").', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b1-06-reported-speech-statements-questions',
    cefrLevel: 'B1',
    title: 'Reported Speech — Backshifting Statements, Questions & Requests',
    summary: 'Relay what colleagues, mentors, or speakers said cleanly with accurate pronoun, tense, and word-order shifts.',
    summaryVi: 'Câu Tường thuật (Reported Speech): lùi thì câu kể, câu hỏi gián tiếp và lời đề nghị.',
    objectives: [
      'Separate "say (that)..." (no direct person object required) from "tell SOMEONE (that)..." cleanly.',
      'Backshift tenses logically after past reporting verbs ("is -> was", "will -> would", "can -> could", "Past Simple -> Past Perfect").',
      'Invert indirect question word order BACK to calm statement order ("He asked where I LIVED", NOT *"where did I live").',
    ],
    detailedExplanation:
      'Reporting speech is more than swapping quotation marks—you act as a clear camera from TODAY’s perspective. First fix "said/told": never say *"She said me" (say "She told me" or "She said to me"). Second, when the reporting verb is past ("She explained that..."), step verbs back one frame ("I am ready" -> "she was ready"; "We will adjust" -> "they would adjust"). Crucially, reported questions LOSE question inversion and drop "do/does/did" completely!',
    structures: [
      { label: 'Reported Statement', formula: 'Subj + said (that) / told + Person + [Backshifted Verb]', example: 'Minh told us he had already submitted the report.' },
      { label: 'Reported Yes/No & Wh- Question', formula: 'asked (Person) + if / whether / Wh-word + Subject + Verb (NO do/did)', example: 'She asked whether the express train stopped at central station.' },
      { label: 'Reported Requests & Advice', formula: 'asked / told / advised / reminded + Person + (not) to + V1', example: 'The guide reminded us not to leave bags unattended.' },
    ],
    usageRules: [
      'Always name a personal listener right after "told" ("He told ME", NOT *"He told that...").',
      'In reported questions, put Subject BEFORE Verb with period punctuation ("She asked what time the shop opened.").',
      'Adjust time words thoughtfully if context moved ("today -> that day", "tomorrow -> the next day", "here -> there").',
    ],
    exceptions: [
      'If a timeless general scientific truth OR present fact is STILL true today ("Water boils at 100°C", "Hanoi is humid in July"), you may keep Present tense instead of backshifting.',
    ],
    examples: [
      { english: 'Our speaking coach told us that steady fifteen-minute practice beat weekend cramming.', vietnamese: 'Huấn luyện viên nói bảo chúng mình rằng luyện đều mười lăm phút mỗi ngày thắng việc học dồn cuối tuần.' },
      { english: 'She said she would review my cover letter once her afternoon meeting ended.', vietnamese: 'Chị ấy bảo chị sẽ xem lại thư xin việc của mình sau khi cuộc họp chiều xong.' },
      { english: 'The librarian politely asked visitors whether they needed help finding audio books.', vietnamese: 'Thủ thư lịch sự hỏi khách xem họ có cần hỗ trợ tìm sách nói không.' },
      { english: 'Could you tell me where the quiet reading terrace is located?', vietnamese: 'Bạn có thể chỉ giúp mình sân thượng đọc sách yên tĩnh nằm ở đâu không?' },
      { english: 'The mentor advised new speakers to slow down slightly on telephone calls.', vietnamese: 'Người cố vấn khuyên người mới nói chậm lại một chút khi gọi điện thoại.' },
    ],
    commonMistakes: [
      { wrong: 'He said me that the train arrived on time.', right: 'He told me that the train arrived on time.', why: '"Say" never takes a direct bare personal pronoun; switch to "told me".' },
      { wrong: 'They asked us where did we buy fresh coffee beans.', right: 'They asked us where we had bought fresh coffee beans.', why: 'Reported questions switch back to Subject + Verb order without "did".' },
      { wrong: 'She told me don’t forget my library card.', right: 'She told me not to forget my library card.', why: 'Negative reported commands always use "not to + V1".' },
    ],
    comparisons: [
      { structure: 'Say vs. Tell vs. Ask', difference: '"Say + words", "Tell + listener + words", "Ask + if/Wh/to-V".', example: 'She said "Hello", told us the timetable, and asked us to sit calmly.' },
    ],
    speakingTip: 'Notice polite embedded openers ("Do you know where the restroom is?" / "Could you tell me when the shop closes?") obey the exact same no-inversion rule!',
    writingTip: 'Strengthen research summaries by varying reporting verbs accurately: "noted, emphasized, observed, contended, warned".',
    reviewSummary: 'Match "tell + Person" vs. "say (that)", shift tenses smoothly after past verbs, drop "do/did" inside indirect questions keeping Subject + Verb order, and use "(not) to + V1" for requests.',
    quiz: [
      gEx({ id: 'qb1-06-1', topicId: 'gram-b1-06-reported-speech-statements-questions', type: 'multiple_choice', instruction: 'Apply reported question word order.', prompt: 'The tour guide asked the guests where ___ from.', options: ['did they come', 'they came', 'came they', 'do they come'], correctAnswer: 'they came', explanation: 'Reported Wh- questions drop "did" and keep Subject + Verb statement order.', difficulty: 1 }),
      gEx({ id: 'qb1-06-2', topicId: 'gram-b1-06-reported-speech-statements-questions', type: 'error_correction', instruction: 'Fix say vs. tell confusion.', prompt: 'Correct: "My friend said me he would join early."', correctAnswer: 'My friend told me he would join early.', acceptableAnswers: ['My friend told me that he would join early.', 'My friend said to me he would join early.'], explanation: 'Replace "said me" with "told me".', difficulty: 1 }),
      gEx({ id: 'qb1-06-3', topicId: 'gram-b1-06-reported-speech-statements-questions', type: 'sentence_transformation', instruction: 'Report the direct request cleanly.', prompt: 'Teacher -> Class: "Please read the passage twice before answering." -> The teacher advised us...', correctAnswer: 'The teacher advised us to read the passage twice before answering.', explanation: 'Reported commands/requests follow reporting verb + person + to + V1.', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b1-07-modal-deduction-speculation',
    cefrLevel: 'B1',
    title: 'Modals of Present & Past Deduction ("must / might / can’t")',
    summary: 'Express smart logical certainty vs. open possibility cleanly without overusing "maybe" or *"mustn’t".',
    summaryVi: 'Động từ khuyết thiếu suy đoán logic ở hiện tại và quá khứ (must, might/could, can’t).',
    objectives: [
      'Rank certainty accurately: ~95% yes ("must be"), ~50% unsure ("might/could/may be"), and ~95% impossible ("can’t be", NEVER *"mustn’t be"!).',
      'Extend deduction into the past seamlessly using "must have / might have / can’t have + V3".',
      'Spot why *"It can be rain" is ungrammatical compared with "It might/could rain".',
    ],
    detailedExplanation:
      'English uses special modal lenses to measure HOW SURE you are from clues. See wet footprints by the front door? "Someone MUST BE home." See dark shadows down a distant path? "That MIGHT BE Minh—or maybe his neighbor." Know friend Nam is currently sitting beside you? "That shadow CAN’T BE Nam!" Notice two subtle rules: for logical impossibility ("chắc chắn không phải"), English chooses "CAN’T BE" rather than "mustn’t be"—and for neutral possibility ("có thể"), choose "may / might / could", reserving "can" for general tendencies rather than specific guesses right now.',
    structures: [
      { label: 'Present State / Ongoing Guess', formula: 'must / might / could / may / can’t + V1 (or be + V-ing)', example: 'She isn’t answering texts—she might be driving.' },
      { label: 'Past Event Speculation', formula: 'must / might / could / can’t + have + V3', example: 'No bread is left on the shelf—earlier shoppers must have bought it all!' },
      { label: 'Zero Obligation vs. Impossibility Contrast', formula: 'can’t be (99% impossible)  !=  might not be (50% unsure)', example: 'He’s away in Hue, so he can’t be in class today.' },
    ],
    usageRules: [
      'Always use "can’t be / couldn’t be" (NOT *"mustn’t be") as the logical opposite of "must be" in certainty deductions!',
      'Keep "might not" uncontracted in formal writing ("That figure might not include rural towns").',
      'Follow "must/might/can’t + have" strictly with V3 Past Participle ("must have forgotten", NOT *"must forgot").',
    ],
    exceptions: [
      'Careful with "couldn’t": in general past ability, "couldn’t" means didn’t know how; in past deduction, "He couldn’t have sent it" means it was impossible!',
    ],
    examples: [
      { english: 'The pavement is gleaming wet—there must have been a sudden shower while we cooked.', vietnamese: 'Vỉa hè ướt loáng thoáng—chắc hẳn vừa có cơn mưa rào lúc chúng ta nấu ăn.' },
      { english: 'That tall figure in a green helmet can’t be Lan; she flew to Da Nang yesterday.', vietnamese: 'Dáng người đội mũ xanh đằng kia không thể nào là Lan được; hôm qua cậu ấy bay đi Đà Nẵng rồi.' },
      { english: 'Speak softly—students inside Room 4 might be taking an oral exam right now.', vietnamese: 'Nói khẽ thôi—sinh viên trong Phòng 4 có thể đang thi nói lúc này đấy.' },
      { english: 'Don’t throw away the spare charger yet; someone at reception could have turned it in.', vietnamese: 'Đừng vội bỏ sạc dự phòng; biết đâu ai đó đã gửi lại ở quầy lễ tân.' },
      { english: 'Why haven’t the slides opened? You may have clicked a temporary draft link.', vietnamese: 'Sao trang trình chiếu chưa mở vậy? Có thể bạn đã bấm nhầm liên kết nháp tạm.' },
    ],
    commonMistakes: [
      { wrong: 'He studied nonstop all summer—he mustn’t fail simply out of luck.', right: 'He studied nonstop all summer—he can’t possibly fail without knowing why.', why: '"Mustn’t" means forbidden rule, NOT logical impossibility; use "can’t" for logical certainty.' },
      { wrong: 'Look at the clock! It can be after ten already.', right: 'Look at the clock! It could (or might) be after ten already.', why: 'Specific right-now possibility takes "might / could / may", NOT bare *"can be".' },
      { wrong: 'She must forgot her train card on the sofa.', right: 'She must have forgotten her train card on the sofa.', why: 'Past modal deduction requires "have + V3".' },
    ],
    comparisons: [
      { structure: '"Mustn’t" vs. "Can’t" Deduction', difference: '"You mustn’t smoke" = Rule bans it; "That can’t be our bus—it’s purple!" = Logical deduction proves it impossible.', example: 'Always test: Forbidden rule -> mustn’t; Impossible logic -> can’t.' },
    ],
    speakingTip: 'Sound natural in IELTS Speaking Part 3 when guessing social causes: swap repetitive *"maybe / I think"* with "Parents might feel...", "Cities must have noticed...".',
    writingTip: 'Use "may / could" judiciously when discussing policy causes so essays sound balanced and scientific rather than overly dogmatic.',
    reviewSummary: 'Rank logical clues cleanly with must (almost certain yes), might/could/may (possible), and can’t (impossible); add have + V3 for past deductions.',
    quiz: [
      gEx({ id: 'qb1-07-1', topicId: 'gram-b1-07-modal-deduction-speculation', type: 'multiple_choice', instruction: 'Pick the logical impossibility modal.', prompt: 'Minh’s bike is parked downstairs right now, so he ___ left the office yet.', options: ['mustn’t have', 'can’t have', 'doesn’t have', 'might haven’t'], correctAnswer: 'can’t have', explanation: 'Logical impossibility about the past uses "can’t have + V3".', difficulty: 2 }),
      gEx({ id: 'qb1-07-2', topicId: 'gram-b1-07-modal-deduction-speculation', type: 'multiple_choice', instruction: 'Pick natural specific-event guesswork.', prompt: 'Take a warm sweater—mountain evenings ___ turn chilly after sunset.', options: ['can', 'mustn’t', 'can’t', 'might have'], correctAnswer: 'can', explanation: 'General recurring mountain climate tendency works naturally with "can" ("sometimes turns chilly"); compare a specific night "might rain".', difficulty: 2 }),
      gEx({ id: 'qb1-07-3', topicId: 'gram-b1-07-modal-deduction-speculation', type: 'fill_blank', instruction: 'Complete past logical deduction.', prompt: 'Look how spotless the kitchen looks! Someone ___ (clean) up early!', correctAnswer: 'must have cleaned', explanation: 'Present strong visual proof about a finished past act takes "must have + V3".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b1-08-contrast-cause-conjunctions',
    cefrLevel: 'B1',
    title: 'Clause vs. Noun Linkers: Although / Despite / Because / Because of',
    summary: 'Connect cause, purpose, and sharp contrast across sentences accurately without mixing clauses and noun phrases.',
    summaryVi: 'Liên từ và giới từ nối nguyên nhân, tương phản: although/though vs. despite/in spite of, because vs. because of.',
    objectives: [
      'Separate Clause linkers ("although, even though, because, whereas" + Subject + Verb) cleanly from Phrase linkers ("despite, in spite of, because of, due to" + Noun / V-ing).',
      'Join ideas with smooth semicolon + sentence adverbs ("; however, ...", "; therefore, ...") instead of comma splices.',
      'Avoid the famous trap of pairing *"Although..., but..." inside the same English sentence.',
    ],
    detailedExplanation:
      'In Vietnamese, pairing "Mặc dù trời mưa, NHƯNG chúng tôi vẫn đi" is completely standard. In English, you can pick ONLY ONE bridge per two clauses: EITHER open with "Although" (no "but"!) OR keep "but" in the middle (no "Although"!). Even more important: pay tight attention to grammar shape right after each linker. "Although" and "because" demand a full Subject + Verb clause, whereas "despite, in spite of, because of, due to" act like prepositions accepting ONLY a noun, pronoun, or V-ing!',
    structures: [
      { label: 'Full-Clause Linkers', formula: 'Although / Even though / Because / Whereas + Subject + Verb, Main Clause', example: 'Although the bus ran late, everyone stayed calm.' },
      { label: 'Noun / V-ing Prepositions', formula: 'Despite / In spite of / Because of / Due to + Noun / V-ing, Main Clause', example: 'Despite heavy coastal mist, boats docked smoothly.' },
      { label: 'Expanding Phrase via "the fact that"', formula: 'Despite / Because of + the fact that + Subject + Verb', example: 'Despite the fact that she felt shy, she spoke clearly.' },
    ],
    usageRules: [
      'NEVER combine "Although + X, but + Y" in the same sentence.',
      'Check punctuation carefully: use a period or semicolon BEFORE "However, / Therefore," when joining two complete sentences ("Traffic grew heavy; however, trains stayed punctual").',
      'Match "while / whereas" when comparing two different groups side by side in charts ("Solar rose, whereas coal fell").',
    ],
    exceptions: [
      '"Though" may sit informally at the very end of a spoken sentence meaning "however" ("Nice cafe—tables are tiny, though!").',
    ],
    examples: [
      { english: 'Even though pronunciation felt tricky at first, daily five-minute practice paid off.', vietnamese: 'Dù phát âm ban đầu thấy khó, thói quen năm phút mỗi ngày đã mang lại kết quả xứng đáng.' },
      { english: 'Despite living in a busy city district, they carved out a quiet balcony garden.', vietnamese: 'Mặc dù sống giữa khu phố sầm uất, họ vẫn tạo được khu vườn ban công yên bình.' },
      { english: 'Outdoor workshops paused briefly because of sudden afternoon thunder.', vietnamese: 'Buổi học ngoài trời tạm dừng ngắn vì cơn sấm bất ngờ buổi chiều.' },
      { english: 'Audio files stayed compact; therefore, mobile visitors opened lessons right away.', vietnamese: 'Tệp âm thanh gọn nhẹ; do đó người dùng di động mở bài ngay lập tức.' },
      { english: 'Adults often memorize rules consciously, whereas children absorb speech prosody effortlessly.', vietnamese: 'Người lớn thường học thuộc quy tắc có ý thức, trong khi trẻ nhỏ tiếp thu ngữ điệu tự nhiên.' },
    ],
    commonMistakes: [
      { wrong: 'Although the exam was hard, but Minh answered calmly.', right: 'Although the exam was hard, Minh answered calmly.', why: 'One English conjunction covers two clauses—drop "but" when opening with "Although".' },
      { wrong: 'Despite it rained heavily, fans filled the outdoor square.', right: 'Despite heavy rain, fans filled the outdoor square.', why: '"Despite" cannot directly precede a Subject + Verb clause without noun/V-ing or "the fact that".' },
      { wrong: 'The train stopped because the fallen tree.', right: 'The train stopped because of the fallen tree.', why: 'Noun phrases require two-word preposition "because of" (or "due to").' },
    ],
    comparisons: [
      { structure: 'Although vs. However', difference: '"Although" connects inside ONE sentence ("Although tiny, it helps"); "However" starts a new clause/sentence ("; however, it helps").', example: 'Check comma vs. semicolon rules carefully when polishing essays!' },
    ],
    speakingTip: 'Add polite natural ", though!" at the end of spoken thoughts ("The bus was packed—pretty fast ride, though") to sound smoothly conversational.',
    writingTip: 'Deleting comma splices (", however,") by switching the first comma to a semicolon IMMEDIATELY raises IELTS Grammatical Range & Accuracy.',
    reviewSummary: 'Follow although/because with Subject + Verb, follow despite/because of with Noun/V-ing, and never pair "Although" with "but".',
    quiz: [
      gEx({ id: 'qb1-08-1', topicId: 'gram-b1-08-contrast-cause-conjunctions', type: 'multiple_choice', instruction: 'Match preposition linker cleanly.', prompt: '___ facing initial delays, the solar ferry team launched right before summer.', options: ['Although', 'Despite', 'Even though', 'Because'], correctAnswer: 'Despite', explanation: 'Gerund phrase "facing initial delays" (no main finite verb) fits preposition "Despite".', difficulty: 1 }),
      gEx({ id: 'qb1-08-2', topicId: 'gram-b1-08-contrast-cause-conjunctions', type: 'error_correction', instruction: 'Remove the Vietnamese-transfer double conjunction.', prompt: 'Correct: "Although he felt tired after work, but he still completed ten flashcards."', correctAnswer: 'Although he felt tired after work, he still completed ten flashcards.', explanation: 'Keep "Although" OR keep "but"—never include both.', difficulty: 1 }),
      gEx({ id: 'qb1-08-3', topicId: 'gram-b1-08-contrast-cause-conjunctions', type: 'multiple_choice', instruction: 'Spot clean semicolon punctuation.', prompt: 'Which punctuation correctly joins two independent ideas using "however"?', options: ['Costs fell, however, demand rose.', 'Costs fell; however, demand rose.', 'Despite costs fell, demand rose.', 'Costs fell because of demand rose.'], correctAnswer: 'Costs fell; however, demand rose.', explanation: 'Use a semicolon (or period) before sentence adverb "however" linking two full clauses.', difficulty: 2 }),
    ],
  }),
];
