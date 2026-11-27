import type { GrammarTopic } from '@english-quest/shared';
import { createGrammarLesson, gEx } from './helpers';

export const C2_GRAMMAR_TOPICS: GrammarTopic[] = [
  createGrammarLesson({
    id: 'gram-c2-01-subtle-tense-aspect-stative-shifts',
    cefrLevel: 'C2',
    title: 'Aspect Mastery — Dynamic Stative Shifts ("You’re being...") & Politeness Distancing',
    summary: 'Sense subtle psychological nuance when usually stative verbs shift dynamic or when past tenses soften right-now politeness.',
    summaryVi: 'Làm chủ sắc thái Thì và Thể tinh vi C2: động từ trạng thái chuyển sang tiếp diễn & thì quá khứ tạo khoảng cách lịch sự.',
    objectives: [
      'Spot precise semantic shifts when stative verbs turn continuous ("see" sight vs. "seeing" dating/meeting; "be kind" nature vs. "being kind" deliberately right now; "think" opinion vs. "thinking" considering).',
      'Use Attitudinal Past / Tentative Past Continuous cleanly to make high-stakes right-now requests extraordinarily polite ("I was hoping you might spare five minutes...").',
      'Explain subtle difference between "Did you want..." (friendly barista checking live!) and crisp Present questions.',
    ],
    detailedExplanation:
      'Earlier textbooks declare "Never put state verbs in -ing!" At C2, you see WHY native speakers break that beginner fence brilliantly on purpose: Continuous aspect spotlights temporary deliberate behavior or sensory immersion RIGHT NOW. Saying "Minh IS patient" praises lifelong character; saying "Minh is BEING unusually patient today" means right now he’s holding his tongue deliberately! Even subtler: **Attitudinal Past** steps a present request backward psychologically (`"I wondered whether I could ask..."`, `"I was hoping we might discuss..."`)—not because you stopped hoping yesterday, but to leave the listener serene conversational space to say "no" comfortably!',
    structures: [
      { label: 'Temporary Deliberate Behavior', formula: 'Subject + am/is/are + being + Controllable Personality Adj', example: 'Aren’t you being a bit rash dismissing calm data so quickly?' },
      { label: 'Sense / Cognitive Semantic Shift', formula: 'State Opinion/Sense (Simple)  vs.  Deliberate Experience/Considers (V-ing)', example: 'I think (opinion) this tastes smoky — Wait, she’s tasting (deliberately sampling) tea!' },
      { label: 'Tentative Politeness Distance', formula: 'I was hoping / I wondered if + Subject + might / could + V1', example: 'Excuse me—I was wondering whether tomorrow’s deadline might move by an hour?' },
    ],
    usageRules: [
      'NEVER pair continuous "being" with uncontrollable accidental feelings (*"I am being tall / tired / happy" fails—only deliberate acts like *"being helpful, polite, cautious, stubborn"* work!).',
      'Reserve "Have" in V-ing purely for active experiencing/eating/hosting ("We’re having a serene sunset dinner"), NEVER possession (*"We’re having a car").',
      'When using "wondered/hoped" in polite requests, combine with softer modal "might / could" in the next clause for peak diplomatic elegance.',
    ],
    exceptions: [
      'Mental perception "understand, know, resemble, owe, belong, consist of" almost never yield dynamic continuous forms even creatively in C2 prose.',
    ],
    examples: [
      { english: 'Wait, she isn’t normally loud—she’s simply being playful to keep tired toddlers laughing.', vietnamese: 'Khoan đã, bình thường cô ấy không ồn ào đâu—chỉ là lúc này cô đang cố tình đùa cho các bé đỡ buồn ngủ.' },
      { english: 'I was hoping we might compare both coastal drainage blueprints over morning coffee.', vietnamese: 'Mình đang hy vọng hai chúng ta có thể đối chiếu cả hai bản thiết kế thoát nước ven biển bên tách cà phê sáng.' },
      { english: 'Yes, I see what your paragraph implies, yet I’m seeing my thesis advisor at three to confirm.', vietnamese: 'Vâng, mình hiểu đoạn bạn ngụ ý gì, nhưng ba giờ mình có hẹn gặp giảng viên hướng dẫn để chốt lại.' },
      { english: 'Careful how that soup smells (aroma) vs. Watch the chef carefully smelling (actively sniffing) cinnamon bark.', vietnamese: 'Phân biệt súp có mùi thơm (tự nhiên) với đầu bếp đang ngửi thanh quế (hành động chủ ý).' },
      { english: 'Good morning—did you want oat milk or regular milk in that flat white?', vietnamese: 'Chào buổi sáng—quý khách có muốn dùng sữa yến mạch hay sữa thường cho ly cà phê này không ạ?' },
    ],
    commonMistakes: [
      { wrong: 'Stop worrying—he is just being exhausted after hiking all Saturday.', right: 'Stop worrying—he is simply exhausted after hiking all Saturday.', why: 'Physical fatigue isn’t a controllable performance choice—avoid *"being exhausted"!' },
      { wrong: 'I’m having three thick notebooks inside my locker downtown.', right: 'I have three thick notebooks inside my locker downtown.', why: 'Ownership ("have" = own) rejects V-ing continuous form.' },
      { wrong: 'What are you thinking about the new zoning law?', right: 'What do you think of the new zoning law?', why: 'Asking settled viewpoint opinion takes Present Simple "think of/about"; V-ing asks what currently crosses someone’s mind ("What are you thinking about right now?").' },
    ],
    comparisons: [
      { structure: 'Think (Viewpoint) vs. Think (Pondering)', difference: '"What do you think of Hue?" = opinion! "I’m thinking of moving to Hue" = mulling active plan!', example: 'Two forms communicate completely distinct mental actions.' },
    ],
    speakingTip: 'Start high-stakes requests to professors, editors, or hosts with "I was wondering if..."—instantly radiates grace without sounding meek.',
    writingTip: 'Keep "think / believe / see" brisk and Simple inside academic essays; save dynamic stative play for rich literary characterization or dialogue.',
    reviewSummary: 'Deploy dynamic "-ing" ONLY on controllable actions/active experiences ("being stubborn, thinking of going, having dinner"), and use Attitudinal Past ("was hoping") for refined politeness.',
    quiz: [
      gEx({ id: 'qc2-01-1', topicId: 'gram-c2-01-subtle-tense-aspect-stative-shifts', type: 'multiple_choice', instruction: 'Spot valid dynamic "be + adj" nuance.', prompt: 'In which sentence does Continuous "being" convey deliberate present behavior naturally?', options: ['She is being five feet tall today.', 'Stop—you’re just being overly stubborn for dramatic fun!', 'Our coffee is being hot on the saucer.', 'They are being happy since passing finals.'], correctAnswer: 'Stop—you’re just being overly stubborn for dramatic fun!', explanation: 'Controllable deliberate attitude ("being stubborn / playful") naturally takes "is/are being".', difficulty: 2 }),
      gEx({ id: 'qc2-01-2', topicId: 'gram-c2-01-subtle-tense-aspect-stative-shifts', type: 'multiple_choice', instruction: 'Choose Attitudinal Past for diplomatic politeness.', prompt: 'Which request sounds most diplomatic and non-imposing to a senior department chair?', options: ['Give me five extra days for submitting slides.', 'You have to extend my slide submission by Friday.', 'I was wondering if the panel might possibly allow two extra days on slides?', 'I want two more days on slides right now.'], correctAnswer: 'I was wondering if the panel might possibly allow two extra days on slides?', explanation: 'Attitudinal Past Continuous + modal "might" creates graceful diplomatic distance.', difficulty: 2 }),
      gEx({ id: 'qc2-01-3', topicId: 'gram-c2-01-subtle-tense-aspect-stative-shifts', type: 'error_correction', instruction: 'Fix opinion vs. active consideration.', prompt: 'Fix viewpoint question: "How do you think about vertical farms? — Ask about settled opinion cleanly: What are you thinking..." -> Wait, correct the wrong verb question: "Are you thinking vertical gardening is economically viable?"', correctAnswer: 'Do you think vertical gardening is economically viable?', explanation: 'Asking an evaluative opinion uses stative Present Simple "Do you think...".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c2-02-correlative-comparatives-proportion',
    cefrLevel: 'C2',
    title: 'Proportional Correlatives ("The more..., the sharper...") & Gradability Limits',
    summary: 'Articulate parallel rates of change and match grading adverbs accurately to Extreme vs. Gradable adjectives.',
    summaryVi: 'Cấu trúc Tỷ lệ thuận/nghịch ("The more..., the better...") và kết hợp Trạng từ mức độ cho Tính từ cực hạn.',
    objectives: [
      'Form parallel proportional sentences ("The clearer the input, the swifter the progress") effortlessly—including clean verb-omission style ("The sooner, the better").',
      'Maintain absolute collocation purity separating Gradable modifiers ("very cold, fairly busy") from Non-gradable Extreme/Absolute limits ("absolutely freezing, utterly vital, completely unanimous"—NEVER *"very freezing"*!).',
      'Use crisp C2 comparative enhancers ("exponentially sharper, marginally slower, infinitely more subtle").',
    ],
    detailedExplanation:
      'Parallel cause-and-effect rhythms glow inside **"The + Comparative A, the + Comparative B"**: both halves mirror compact fronting where "the" acts historically as an instrumental marker ("by how much..., by that much..."). Keep both comparative phrases tightly parallel! Meanwhile, C2 precision shines in adjective gradability: **"very / quite / slightly"** work ONLY with sliding-scale adjectives ("cold, tired, helpful, common"). Once an adjective already sits at the ceiling (**freezing, exhausted, indispensable, impossible, unanimous**), pair it strictly with ceiling adverbs (**absolutely, utterly, completely, virtually**) rather than beginner *"very"*!',
    structures: [
      { label: 'Parallel Growth / Decline', formula: 'The + [more / -er + Noun/Adj + (S + V)], + the + [more / -er + Noun/Adj + (S + V)]', example: 'The deeper your active vocabulary, the subtler your essay nuance.' },
      { label: 'Tight Verb Ellipsis Form', formula: 'The + Comparative (+ Noun), the + Comparative (+ Noun)', example: 'The fewer unnecessary clicks, the calmer the interface.' },
      { label: 'Gradable vs. Extreme Adverbs', formula: 'very / fairly + Gradable Adj  !=  absolutely / utterly / virtually + Extreme/Absolute Adj', example: 'fairly tiring / utterly exhausting  |  very surprising / quite extraordinary (meaning totally!)' },
    ],
    usageRules: [
      'Careful with **"quite"**: before a regular gradable word (`quite clear`), "quite" means *moderately*; right before a ceiling word (`quite impossible`, `quite spotless`), "quite" flips sharply to mean *100% completely*!',
      'Place comparatives strictly UPFRONT right after "The" inside proportional clauses (*"The more you practice daily, the confident you feel"* fails -> write *"the MORE CONFIDENT you feel"*!).',
      'Match parallel tense logic ("The harder cities delay flood drains, the costlier damage becomes").',
    ],
    exceptions: [
      '"Rather" can softly introduce unwelcome extremes ("rather impossible" rare—prefer "virtually impossible"); whereas "almost / practically / nearly" pair cleanly with absolute endpoints ("virtually unanimous").',
    ],
    examples: [
      { english: 'The more faithfully learners mimic natural rhythm, the less strained everyday meetings feel.', vietnamese: 'Người học mô phỏng nhịp điệu tự nhiên càng chuẩn xác, các cuộc họp thường ngày càng bớt gượng gạo.' },
      { english: 'The narrower the initial module chunk, the faster older campus tablets render every card.', vietnamese: 'Gói mô-đun ban đầu càng gọn nhẹ, các máy tính bảng cũ ở trường càng hiển thị thẻ nhanh.' },
      { english: 'Clean cross-references are virtually indispensable once databases cross a thousand entries.', vietnamese: 'Tham chiếu chéo chuẩn gần như không thể thiếu khi cơ sở dữ liệu vượt mốc nghìn mục.' },
      { english: 'The mountain ridge looked quite extraordinary through crystal November air.', vietnamese: 'Sống núi trông thực sự phi thường tuyệt mỹ qua bầu khí trong vắt tháng Mười Một.' },
      { english: 'Skipping sleep before an early oral interview proves utterly counterproductive.', vietnamese: 'Bỏ ngủ trước buổi phỏng vấn nói buổi sáng chứng tỏ hoàn toàn phản tác dụng.' },
    ],
    commonMistakes: [
      { wrong: 'The more attentively students listen, they speak smoother.', right: 'The more attentively students listen, the more smoothly they speak.', why: 'Always open the second half with matching "the + comparative" right after the comma!' },
      { wrong: 'Publishing duplicate quiz prompts is very unacceptable in serious exams.', right: 'Publishing duplicate quiz prompts is completely (or wholly) unacceptable in serious exams.', why: '"Unacceptable" already hits ceiling limit; modify ceiling adjectives with "completely / wholly / utterly", not *"very".' },
      { wrong: 'Downtown trains became very exhausted to ride at peak summer.', right: 'Downtown rush hours left commuters utterly exhausted.', why: 'People feel "exhausted" (extreme); modify "exhausted" with "utterly/completely", or use "tiring" for trips.' },
    ],
    comparisons: [
      { structure: '"Very" vs. "Utterly / Virtually"', difference: 'Say "very accurate, remarkably subtle" (sliding scale), yet "utterly cogent / virtually flawless / totally unanimous" (absolute ceiling limits).', example: 'Check before writing: can something be slightly X? Yes -> "very"; No -> "completely/virtually".' },
    ],
    speakingTip: 'Drop "The sooner, the better" or "The calmer you breathe, the clearer vowels sound!" fluently in discussions.',
    writingTip: 'One crisp proportional comparative sentence inside an essay analysis ("The wider income disparity grows, the steeper housing burdens become") elevates analytical punch instantly.',
    reviewSummary: 'Match both halves cleanly via "The + comparative..., the + comparative...", move the whole comparative Adj/Adv immediately behind "the", and reserve "very" for gradables while using "utterly/virtually/completely" for extreme/absolute words.',
    quiz: [
      gEx({ id: 'qc2-02-1', topicId: 'gram-c2-02-correlative-comparatives-proportion', type: 'multiple_choice', instruction: 'Respect whole comparative fronting.', prompt: 'The earlier safety tests catch flaws, ___ later deployment becomes.', options: ['smoothly', 'the smoother', 'more smoother', 'it gets smoother'], correctAnswer: 'the smoother', explanation: 'Move "the + comparative" ("the smoother") immediately behind the comma.', difficulty: 1 }),
      gEx({ id: 'qc2-02-2', topicId: 'gram-c2-02-correlative-comparatives-proportion', type: 'multiple_choice', instruction: 'Separate gradable vs. ceiling adverb collocation.', prompt: 'Pair the right intensifier: Unanimous verification before publishing is ___.', options: ['very indispensable', 'fairly impossible', 'virtually indispensable', 'slightly unique'], correctAnswer: 'virtually indispensable', explanation: '"Indispensable" is an extreme/non-gradable word calling for "virtually / utterly / completely".', difficulty: 2 }),
      gEx({ id: 'qc2-02-3', topicId: 'gram-c2-02-correlative-comparatives-proportion', type: 'sentence_transformation', instruction: 'Recast as sleek proportional comparative.', prompt: 'Compress concisely: "When lessons use clearer examples, adults grasp nuances much quicker." -> The clearer...', correctAnswer: 'The clearer the examples, the quicker adults grasp nuances.', acceptableAnswers: ['The clearer the examples lessons use, the more quickly adults grasp nuances.'], explanation: 'Parallel "The clearer..., the quicker/more quickly..." compresses wordy "when" links smoothly.', difficulty: 3 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c2-03-appositive-phrases-sentence-modifiers',
    cefrLevel: 'C2',
    title: 'Precision Appositives, Resumptive Modifiers & Parenthetical Balance',
    summary: 'Add brisk definition context without clunky "which is" clutter using clean appositives and resumptive rhetorical repeats.',
    summaryVi: 'Cụm Đồng vị tinh tế (Appositives), Điệp ngữ nối ý học thuật (Resumptive Modifiers) và Dấu gạch/ngoặc xen kẽ.',
    objectives: [
      'Compress choppy definitions seamlessly into crisp Noun-Phrase Appositives ("Prosody, the combined rhythm and stress of living speech, transforms listener ease").',
      'Deploy graceful Resumptive & Summative Modifiers cleanly without falling into accidental comma splices.',
      'Choose Commas (mild breath), Em-dashes (dramatic contrast), and Parentheses (quiet bonus side-note) intentionally to control reader pacing.',
    ],
    detailedExplanation:
      'Think of C2 prose rhythm like calm chamber music: constantly writing *"...which is a...", "...which means that..."* drags tempo down heavily! **Appositives** drop empty "which is" helpers silently by placing a second defining noun phrase snugly right beside its partner (`"Hoi An, a calm riverside craft town, welcomes cyclists"`). Even cooler: **Resumptive Modifiers** echo one vivid final word from the end of a long clause (`"...leaving learners exhausted—exhausted not by grammar itself, yet by vague examples"`) and **Summative Modifiers** synthesize the entire clause cleanly with one fresh noun (`"...eliminating idle clicks, a change that halved study fatigue"` — notice ZERO *"which"* needed!).',
    structures: [
      { label: 'Essential vs. Non-Essential Appositive', formula: 'Noun, + [Defining Noun Phrase], + Main Verb  |  Name Noun (no commas when identifying)', example: 'SM-2, an evidence-backed spacing algorithm, schedules timely review.' },
      { label: 'Summative Modifier (No "which")', formula: '[Full Clause], + a/an + [Evaluating Summary Noun] + that + Clause', example: 'Cities converted car lanes to ferries—an overhaul that cut downtown haze.' },
      { label: 'Resumptive Echo Modifier', formula: '...[Key Word], + [same Key Word] + expansion modifier', example: 'Seek daily calm consistency—consistency far deeper than brief bursts.' },
    ],
    usageRules: [
      'Watch comma symmetry strictly: EVERY non-essential mid-sentence appositive MUST carry matching BOTH opening and closing commas (or matching dashes!). Never drop the second closing comma!',
      'Keep defining single names uncomma’d ("My sister Linh reads C2 novels" implies >1 sister; "My sister, Linh, reads..." implies only one sister!).',
      'Test punctuation weight purposefully: commas whisper smoothly, em-dashes spotlight sharp contrast, and parentheses tuck quiet side-notes aside.',
    ],
    exceptions: [
      'Long appositive chains holding internal commas themselves take clean paired em-dashes (`"Three skills—listening, speaking, and concise writing—anchor..."`) so readers never lose where the main verb resumes.',
    ],
    examples: [
      { english: 'Cambridge Dictionary, an authoritative reference trusted worldwide, distinguishes UK and US vowels cleanly.', vietnamese: 'Từ điển Cambridge, một nguồn tham chiếu uy tín toàn cầu, phân biệt rõ nguyên âm Anh-Mỹ.' },
      { english: 'The module split heavy files into per-level chunks—a practical safeguard that kept startup under two seconds.', vietnamese: 'Mô-đun chia tệp nặng thành gói theo từng trình độ—giải pháp thực tế giữ tốc độ mở trang dưới hai giây.' },
      { english: 'True fluency relies on quiet patience—patience enough to embrace gentle daily mistakes without quitting.', vietnamese: 'Sự lưu loát thật sự dựa trên kiên nhẫn lặng lẽ—đủ kiên nhẫn đón nhận lỗi sai nhẹ hằng ngày mà không bỏ cuộc.' },
      { english: 'Three architectural hallmarks—modularity, accessibility, and strict validation—define clean learning apps.', vietnamese: 'Ba dấu ấn kiến trúc—tính mô-đun, khả năng tiếp cận và kiểm định chặt—định hình ứng dụng học tốt.' },
      { english: 'Linguist Minh Pham’s concise notes turned silent letter puzzles into playful stories.', vietnamese: 'Những ghi chú cô đọng của nhà ngôn ngữ học Minh Phạm biến câu đố chữ cái câm thành chuyện thú vị.' },
    ],
    commonMistakes: [
      { wrong: 'Water, a scarce necessity across dry summer farms sustains rural springs.', right: 'Water, a scarce necessity across dry summer farms, sustains rural springs.', why: 'Never forget the second closing comma sealing a mid-sentence non-essential appositive right before the verb!' },
      { wrong: 'My brother Minh, lives in Hue.', right: 'My brother Minh lives in Hue.', why: 'Never slice a bare Subject from its Verb with a single stray comma.' },
      { wrong: 'We removed duplicate sentences, it raised test validity immediately.', right: 'We removed duplicate sentences—an edit that raised test validity immediately.', why: 'Joining two full clauses with a comma alone causes a comma splice; swap the second clause into a crisp Summative Modifier ("an edit that...").' },
    ],
    comparisons: [
      { structure: 'Appositive Punctuation Choices', difference: 'Paired commas blend lightly; paired em-dashes punch crisp spotlight especially when internal commas appear inside the list.', example: 'Pick punctuation consciously like musical dynamics!' },
    ],
    speakingTip: 'Drop neat quick appositives warmly in talks ("Ha Long Bay, one of northern Vietnam’s calmest limestone seascapes, shines in early autumn").',
    writingTip: 'Swap clunky trailing `", which helped users greatly"` endings with crisp Summative Modifiers (`", a milestone that transformed rural study"`) to elevate editorial authority immediately.',
    reviewSummary: 'Use symmetrical paired commas/dashes around non-essential appositives, compress ", which" generalizations into sleek Summative Noun Modifiers, and avoid cutting subjects from verbs with single commas.',
    quiz: [
      gEx({ id: 'qc2-03-1', topicId: 'gram-c2-03-appositive-phrases-sentence-modifiers', type: 'error_identification', instruction: 'Spot missing appositive symmetry or comma splice.', prompt: 'Which sentence punctuates its appositive CLEANLY?', options: ['Prosody, the subtle rhythm of speech transforms listening ease.', 'Prosody, the subtle rhythm of speech, transforms listening ease.', 'Prosody the subtle rhythm of speech, transforms listening ease.', 'Prosody, transforms, the subtle rhythm of speech listening ease.'], correctAnswer: 'Prosody, the subtle rhythm of speech, transforms listening ease.', explanation: 'Non-essential appositives require BOTH opening and closing commas.', difficulty: 1 }),
      gEx({ id: 'qc2-03-2', topicId: 'gram-c2-03-appositive-phrases-sentence-modifiers', type: 'multiple_choice', instruction: 'Pick the cleanest C2 Summative Modifier repair.', prompt: 'Upgrade comma splice smoothly: "Libraries extended evening hours, this helped night-shift workers study calmly."', options: ['Libraries extended evening hours, which this helped night-shift workers.', 'Libraries extended evening hours—a policy shift that helped night-shift workers study calmly.', 'Extending evening hours by libraries, it helped night-shift workers.', 'Libraries extended evening hours, it helped workers.'], correctAnswer: 'Libraries extended evening hours—a policy shift that helped night-shift workers study calmly.', explanation: 'Em-dash + crisp Summative Noun ("a policy shift that...") eliminates comma splice elegantly.', difficulty: 2 }),
      gEx({ id: 'qc2-03-3', topicId: 'gram-c2-03-appositive-phrases-sentence-modifiers', type: 'sentence_transformation', instruction: 'Condense via clean Appositive.', prompt: 'Trim "which is" clutter: "Hoi An, which is a UNESCO heritage port town, bans motorbikes downtown."', correctAnswer: 'Hoi An, a UNESCO heritage port town, bans motorbikes downtown.', explanation: 'Drop "which is" inside paired commas for nimble appositive economy.', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c2-04-cataphora-reference-cohesion-chains',
    cefrLevel: 'C2',
    title: 'Rhetorical Architecture — End-Weight, Given-New Flow & Cataphoric Hooks',
    summary: 'Arrange heavy clauses skillfully toward sentence ends ("end-weight") and weave given-before-new cohesion threads smoothly.',
    summaryVi: 'Kiến trúc câu C2: Nguyên lý Trọng cuối (End-Weight), Mạch Cũ-trước-Mới-sau (Given-New) và Câu dẫn hồi hướng (Cataphora).',
    objectives: [
      'Rebalance awkward top-heavy subjects using IT-extraposition ("It remains unclear whether..." instead of awkward 15-word opening `that/whether`-clauses).',
      'Chain Given-before-New information naturally so every sentence opens by hooking into the previous sentence’s final insight.',
      'Spot when Passive Voice IS superior purely to keep Given information sitting smoothly upfront at the start of sentence two!',
    ],
    detailedExplanation:
      'Why do some grammatically spotless paragraphs feel exhausting to read while others glide like silk? Readers process English easiest through two deep rhythmic engines: **Given-Before-New** and **End-Weight**. Open sentences with short, already-familiar (**Given**) context right after the last sentence ended, then land lengthy surprising **New** analysis comfortably at the sentence finish! That explains why passive isn’t an arbitrary checklist rule—sometimes swapping `"Engineers verified X -> X was then compiled by three archivists"` is ESSENTIAL just to keep **X** sitting cleanly at topic position!',
    structures: [
      { label: 'Extraposed It-Subject (End-Weight Balance)', formula: 'It + Verb/Adj + [Long Infinitive / Whether / That Clause]', example: 'It proved essential to stage binary uploads separately from clean text reads.' },
      { label: 'Given-to-New Bridge Chain', formula: '...ended with [Concept B]. -> [Concept B / Such Concept] now sparks [New Insight C].', example: 'Urban heat stresses elders. This afternoon glare also drains outdoor students.' },
      { label: 'Cataphoric Hook (Look-Ahead)', formula: '[Pronoun/Preview Noun] ... -> [Explicit Definition Revealed Shortly]', example: 'Notice this subtle trap ahead: "innocuous" sounds pleasant yet signals quiet trouble...' },
    ],
    usageRules: [
      'Avoid sprawling >12-word clausal subjects upfront ("Whether rural solar microgrids can fully offset industrial peak draw in winter remains open" -> use `"It remains open whether..."`!).',
      'Watch object-extraposition too: `"make / find / consider / render + IT + Adj + to V1 / that..."` ("Clean chunking renders **it effortless to explore** any CEFR pack"). NEVER drop "it" (*"make possible to study"* fails—say `"make IT possible to study"`!).',
      'Maintain clean thematic progression across 4–5 paragraph sentences rather than bouncing subjects blindly between unrelated actors.',
    ],
    exceptions: [
      'Opening a sentence intentionally with a brief `What...` cleft ("What mattered most...") breaks End-Weight rules gracefully for spoken rhetorical emphasis.',
    ],
    examples: [
      { english: 'Strict grammar rules alone overwhelm fresh students. This cognitive overload eases markedly once examples turn playful.', vietnamese: 'Quy tắc khô khan một mình làm học viên mới ngợp. Gánh nặng nhận thức này dịu hẳn khi ví dụ sinh động.' },
      { english: 'Compact bundle chunking made it surprisingly fast to inspect all thirty collections on slow phones.', vietnamese: 'Chia gói gọn nhẹ giúp việc xem toàn bộ ba mươi bộ sưu tập trên điện thoại chậm nhanh bất ngờ.' },
      { english: 'It remains doubtful whether passive app streaks alone foster real conversational poise without speaking practice.', vietnamese: 'Vẫn còn đáng nghi liệu chuỗi điểm ứng dụng thụ động đơn thuần có tạo sự tự tin nói nếu thiếu thực hành.' },
      { english: 'Ancient canals shaped regional harvests; those very waterways were later preserved by urban architects as serene bike parks.', vietnamese: 'Kênh đào cổ định hình mùa màng vùng; chính những tuyến thủy lộ ấy sau này được kiến trúc sư bảo tồn thành công viên đạp xe.' },
      { english: 'Take one quiet lesson forward from these essays: simplicity never precludes scholarly precision.', vietnamese: 'Hãy mang theo một bài học lắng đọng từ các tiểu luận này: sự giản dị chưa từng loại trừ chuẩn xác học thuật.' },
    ],
    commonMistakes: [
      { wrong: 'Modular separation makes possible to load audio tracks smoothly per level.', right: 'Modular separation makes it possible to load audio tracks smoothly per level.', why: 'Keep anticipatory dummy "it" strictly before `Adj + to-V` after verbs like "make, find, consider"!' },
      { wrong: 'That adults struggle pronouncing quiet word-final clusters whenever tired is clear.', right: 'It is clear that adults struggle to pronounce subtle word-final clusters whenever tired.', why: 'Push heavy `That...` clauses gracefully to sentence end using "It is clear that..."!' },
      { wrong: 'Parks cool streets. Cars burn fuel inside traffic. Trees filter particulates cleanly.', right: 'Urban parks cool streets while mature trees filter particulates; conversely, stalled traffic burns needless fuel.', why: 'Avoid jarring random topic-hopping; maintain cohesive Given-New bridges or explicit contrast transitions.' },
    ],
    comparisons: [
      { structure: 'Passive for Topic Cohesion', difference: '"Cities installed sensors. Sensors logged haze." (choppy) -> "Cities installed street sensors; these records were then scrutinized by health panels." (silky cohesion!).', example: 'Use Passive specifically whenever moving known topics comfortably to the front!' },
    ],
    speakingTip: 'Drop natural object-extraposition effortlessly ("I find it weirdly relaxing to read train timetables in English!")—smooth native pacing!',
    writingTip: 'Read paragraph sentence openers aloud straight down in order ("Topic 1 -> This X -> Yet such Y -> Consequently..."). If the opener jumps abruptly, adjust active/passive voice immediately!',
    reviewSummary: 'Push lengthy clauses smoothly to the right via IT-extraposition ("make IT possible to...", "It remains open whether..."), bridge sentences via Given-before-New, and deploy Passive strategically to protect topic flow.',
    quiz: [
      gEx({ id: 'qc2-04-1', topicId: 'gram-c2-04-cataphora-reference-cohesion-chains', type: 'multiple_choice', instruction: 'Spot missing dummy "it" object-extraposition.', prompt: 'Pick the clean formal sentence balancing `find / make + it + Adj + to`:', options: ['Lazy modules make effortless to download new packs.', 'Lazy modules make it effortless to download new packs.', 'Lazy modules make that effortless downloading packs.', 'Lazy modules make effortless downloading.'], correctAnswer: 'Lazy modules make it effortless to download new packs.', explanation: 'Verbs like "make, find, consider" require anticipatory "it" before Adj + infinitive.', difficulty: 2 }),
      gEx({ id: 'qc2-04-2', topicId: 'gram-c2-04-cataphora-reference-cohesion-chains', type: 'multiple_choice', instruction: 'Choose strongest Given-New cohesion follow-up.', prompt: 'Sentence 1: "Coastal dunes slow typhoon surges noticeably." Pick the silky Sentence 2 keeping cohesion unbroken:', options: ['Many builders prefer tall glass.', 'These protective ridges, however, face erosion once concrete paths slice through reeds.', 'Rain also falls heavily every October.', 'Ferries carry goods calmly across harbors.'], correctAnswer: 'These protective ridges, however, face erosion once concrete paths slice through reeds.', explanation: 'Opening Sentence 2 directly with echo noun "These protective ridges" cements Given-to-New clarity.', difficulty: 2 }),
      gEx({ id: 'qc2-04-3', topicId: 'gram-c2-04-cataphora-reference-cohesion-chains', type: 'sentence_transformation', instruction: 'Balance End-Weight cleanly.', prompt: 'Push top-heavy subject right with "It": "Whether earlier coastal settlers navigated solely by stars remains uncertain."', correctAnswer: 'It remains uncertain whether earlier coastal settlers navigated solely by stars.', explanation: 'Extrapose long `whether`-clause rightward behind "It remains uncertain...".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c2-05-cleft-pseudo-cleft-focus-particles',
    cefrLevel: 'C2',
    title: 'Precision Focus: Wh-Clefts, All-Clefts, & Scope Focus Adverbs ("only / even / merely")',
    summary: 'Aim attention with laser accuracy using "All that / The reason why / It wasn’t until" clefts and pinpoint placement of "only / even".',
    summaryVi: 'Độ chuẩn xác vị trí từ nhấn mạnh (only, even, merely, solely) và Câu chẻ đa dạng C2 (All... is, The thing that..., It wasn’t until...).',
    objectives: [
      'Spot genuine meaning changes caused solely by moving **"only"** or **"even"** right before its exact target ("She ONLY edited subtitles" vs. "She edited ONLY subtitles").',
      'Deploy specialized rhetorical focus frames smoothly ("All we ask is...", "What happened was that...", "It wasn’t until noon that...").',
      'Keep negative inversions cleanly separated from casual "All I wanted was..." clefts.',
    ],
    detailedExplanation:
      'Casual conversation often lazily tosses `"only"` right in front of the main verb regardless of what the speaker truly means (`"I only ate one mango"` usually stays clear by vocal tone). In careful C2 prose, exams, and legal contracts, place **"only, merely, solely, even"** immediately RIGHT NEXT TO the exact word it limits! Compare: `"Minh spoke **only** to the mentor"` (nobody else heard him) vs. `"Only Minh spoke to the mentor"` (no classmate spoke) vs. `"Minh **only** spoke"` (he didn’t write anything down!). Combine this pinpoint accuracy with rich rhetorical clefts (`"All learners require..."`, `"The reason why..."`, `"It wasn’t until..."`).',
    structures: [
      { label: 'Pinpoint Focus Placement', formula: 'Place only / merely / solely / even IMMEDIATELY BEFORE target word/phrase', example: 'Reviewers flagged ONLY broken external URLs, leaving working archives untouched.' },
      { label: 'All-Cleft (Minimal Essential)', formula: 'All (that) + Subject + Verb + is/was + Focused Action/Noun', example: 'All steady progress demands is fifteen quiet unhurried minutes daily.' },
      { label: 'Delayed-Realization Cleft', formula: 'It wasn’t until + Time/Clause + THAT + Main Result (No extra inversion!)', example: 'It wasn’t until reading C1 essays that I noticed subtle register shifts.' },
    ],
    usageRules: [
      'Notice the sharp difference vs. "Not until": `"Not until dawn DID ferries dock"` (INVERTED!), whereas `"It wasn’t until dawn THAT ferries docked"` uses calm `"that"` with NO inversion!',
      'Inside **"All I did was [to] check..."**, bare infinitive `"check"` without `"to"` feels cleanest and crispest ("All she did was nod warmly").',
      'Follow `"The reason why..."` strictly with `"is THAT..."`, NOT colloquial *"is because..."* in formal C2 writing!',
    ],
    exceptions: [
      'Natural spoken stress lets casual `"just"` or `"only"` sit pre-verbally ("I only wanted to ask one quick thing"), yet written ambiguity should always relocate "only".',
    ],
    examples: [
      { english: 'All true fluency asks of busy adults is fifteen patient minutes every day without guilt.', vietnamese: 'Điều duy nhất sự lưu loát đòi hỏi ở người lớn bận rộn là mười lăm phút kiên nhẫn mỗi ngày không tự trách.' },
      { english: 'The curriculum expanded solely high-quality verified modules rather than copying thin lists.', vietnamese: 'Giáo trình mở rộng duy nhất các mô-đun kiểm định chất lượng cao thay vì sao chép danh sách sơ sài.' },
      { english: 'It wasn’t until learners tried interactive dialogues that shy hesitation finally dissolved.', vietnamese: 'Mãi đến khi người học thử đối thoại tương tác thì sự e dè mới dần tan biến.' },
      { english: 'The primary reason public gardens thrive here is that neighbors share watering shifts fairly.', vietnamese: 'Lý do chính khiến vườn công cộng nơi đây xanh tốt là hàng xóm chia ca tưới nước công bằng.' },
      { english: 'Even seasoned bilingual translators occasionally pause over subtle idiomatic register nuances.', vietnamese: 'Ngay cả dịch giả song ngữ dày dạn đôi khi vẫn khựng lại cân nhắc sắc thái thành ngữ tinh tế.' },
    ],
    commonMistakes: [
      { wrong: 'The main reason electric transit succeeds cleanly is because tickets cost less.', right: 'The main reason electric transit succeeds cleanly is that tickets cost less.', why: '"Reason is because" doubles causal meaning—always write `"The reason ... is THAT"` in formal prose!' },
      { wrong: 'It wasn’t until Friday did we locate the misplaced notebook.', right: 'It wasn’t until Friday that we located the misplaced notebook.', why: 'Inside cleft `"It wasn’t until..."`, use `"that + normal Subject + Verb"`, never `"did"` inversion!' },
      { wrong: 'Students only receive certificates if passing every practical check (meant: receive nothing else? or pass ONLY this condition?).', right: 'Students receive certificates only if they pass every practical check.', why: 'Place `"only"` right beside `"if they pass..."` so scope stays airtight and unambiguous.' },
    ],
    comparisons: [
      { structure: 'It wasn’t until X that... vs. Not until X did...', difference: 'Two equally sleek ways to frame delayed breakthroughs: Cleft uses `"that + S + V"`; Negative Fronting uses `"did/have + S + V"`. Never cross-mix them!', example: 'Keep both frames cleanly separated in high-stakes essays.' },
    ],
    speakingTip: '"All I’m saying is..." and "What ended up happening was..." carry natural conversational authority when recapping nuanced views.',
    writingTip: 'Scan formal drafts for `"reason... is because"` and edit immediately to `"reason... is that"` or `"X succeeds primarily because..."`.',
    reviewSummary: 'Place focus adverbs directly before what they limit, fix `"The reason is THAT"`, keep bare V1 inside `"All I did was..."`, and never mix `"did"` inversion inside `"It wasn’t until ... that"`.',
    quiz: [
      gEx({ id: 'qc2-05-1', topicId: 'gram-c2-05-cleft-pseudo-cleft-focus-particles', type: 'multiple_choice', instruction: 'Separate "It wasn’t until" from "Not until".', prompt: 'Pick the strictly grammatical delayed-breakthrough structure:', options: ['It wasn’t until autumn did river levels drop.', 'It wasn’t until autumn that river levels finally dropped.', 'Not until autumn that river levels finally dropped.', 'Until autumn wasn’t when river levels dropped.'], correctAnswer: 'It wasn’t until autumn that river levels finally dropped.', explanation: 'Cleft `"It wasn’t until..."` takes `"that + normal S + V"` (no `"did"` inversion).', difficulty: 2 }),
      gEx({ id: 'qc2-05-2', topicId: 'gram-c2-05-cleft-pseudo-cleft-focus-particles', type: 'multiple_choice', instruction: 'Apply pinpoint scope accuracy for "only".', prompt: 'You want to stress THAT ONE SINGLE TIME (not weekly, not daily) she missed class. Pick clearest formal placement:', options: ['She only missed class once all year.', 'Only she missed class once all year.', 'She missed class only once all year.', 'She missed only class once all year.'], correctAnswer: 'She missed class only once all year.', explanation: 'Placing `"only"` right before `"once all year"` spotlights rare single frequency cleanly.', difficulty: 2 }),
      gEx({ id: 'qc2-05-3', topicId: 'gram-c2-05-cleft-pseudo-cleft-focus-particles', type: 'error_correction', instruction: 'Fix "The reason is because".', prompt: 'Polish formally: "One reason short practice sticks better is because sleep consolidates recent memory."', correctAnswer: 'One reason short practice sticks better is that sleep consolidates recent memory.', explanation: 'Formal register prefers `"The/One reason ... is THAT"`, avoiding redundant *"is because"*.', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c2-06-hedging-modality-academic-register',
    cefrLevel: 'C2',
    title: 'Diplomatic Modality, Compound Hedging & Evaluative Adverbs',
    summary: 'Calibrate certainty cleanly across tentative evidence, polite disagreement, and authoritative scholarly prose.',
    summaryVi: 'Rào đón học thuật C2, Độ chắc chắn đa tầng và Trạng từ đánh giá thái độ (arguably, ostensibly, tellingly).',
    objectives: [
      'Master nuanced academic modal hedges ("would seem to suggest, might well prove, could conceivably reduce") without stacking clumsy fluff.',
      'Deploy stance-signaling sentence adverbs purposefully upfront ("tellingly, ostensibly, admittedly, paradoxically, regrettably").',
      'Spot and revise harsh non-academic extremes ("completely proves", "everybody knows") and sloppy conversational fillers ("kind of, sort of, literally") in formal work.',
    ],
    detailedExplanation:
      'High-level scholars walk an exact tightrope: claiming too wildly reads naive ("Proves 100% forever!"); wobbling apologetically reads unsure (*"Maybe sort of perhaps looks okay"*). C2 mastery calibrates force calmly through **compound modality** (`"may well indicate"`, `"would appear to support"`) and single vivid **evaluative adverbs** sitting cleanly upfront (`"Ostensibly"`, `"Tellingly"`, `"Paradoxically"`). Notice how one clean word `"Admittedly"` concedes an opponent’s point with quiet grace in a single stroke!',
    structures: [
      { label: 'Calibrated Academic Force', formula: 'may well + V1 (likely!)  |  would appear/seem to + V1 (cautious inference)  |  could conceivably (possible)', example: 'Silent solar minibuses may well reshape rural transit faster than rails.' },
      { label: 'Evaluative Sentence Openers', formula: 'Admittedly / Ostensibly / Tellingly / Arguably / Paradoxically, + Main Clause', example: 'Paradoxically, slowing speaking pace often makes speakers sound MORE fluent.' },
      { label: 'Academic Negative Hedge', formula: 'hardly / scarcely / little evidence to suggest that...', example: 'Current trials show scarce evidence to support overnight cramming shortcuts.' },
    ],
    usageRules: [
      'Never stack mismatched conversational hedges inside academic writing (*"might possibly perhaps tend to seem"* weakens credibility!). Keep 1–2 crisp partners ("may well, would appear to").',
      'Check comma right after sentence-opening stance adverbs ("Arguably, clearer rubrics count most", yet skip comma when placing "arguably" right inside the verb phrase: `"the single arguably clearest..."`).',
      'Avoid misusing **"literally"** figuratively in formal writing (*"Essays literally flew off the shelf"* -> reserve `"literally"` strictly for verified literal truth!).',
    ],
    exceptions: [
      '"May well" does NOT mean polite permission ("may")—it explicitly means *fairly likely / strong possibility* ("Costs may well fall faster than expected").',
    ],
    examples: [
      { english: 'Admittedly, launching modular offline bundles demands sharper upfront build scripting.', vietnamese: 'Phải thừa nhận rằng triển khai gói ngoại tuyến tách mô-đun đòi hỏi khâu lập trình đóng gói ban đầu kỹ hơn.' },
      { english: 'Ostensibly designed purely as entertainment, gentle bilingual comics quietly reinforce everyday idioms.', vietnamese: 'Bề ngoài tưởng chỉ để giải trí, truyện tranh song ngữ nhẹ nhàng lại âm thầm củng cố thành ngữ đời sống.' },
      { english: 'Tellingly, dropout spikes occurred precisely where tutorials lacked instant clarifying examples.', vietnamese: 'Đáng chú ý thay, tỷ lệ bỏ học vọt lên đúng ở những bài thiếu ví dụ minh họa tức thì.' },
      { english: 'Early community compost hubs may well cut neighborhood organic waste far faster than sprawling landfills.', vietnamese: 'Các điểm ủ phân hữu cơ cộng đồng hoàn toàn có khả năng giảm rác hữu cơ nhanh hơn bãi chôn lấp lớn.' },
      { english: 'Such limited seasonal surveys would appear to warrant follow-up across drier inland valleys.', vietnamese: 'Những khảo sát theo mùa giới hạn như vậy dường như xứng đáng có nghiên cứu nối tiếp ở thung lũng nội địa khô hơn.' },
    ],
    commonMistakes: [
      { wrong: 'Literally a million learners died of boredom from old worksheets.', right: 'Countless learners quickly lost focus over repetitive worksheets.', why: 'Avoid hyperbolic abuse of `"literally"` in formal/analytical prose; reserve it strictly for literal truth.' },
      { wrong: 'Clearly this tiny twelve-person survey proves beyond doubt everyone prefers laptops.', right: 'Even from this small twelve-person pilot, initial responses suggest a preference for laptops.', why: 'Scale claims honestly to sample size (`"pilot responses suggest"`), never universal proof (`"proves beyond doubt"`).' },
      { wrong: 'Ostensibly electric scooters solved every rush-hour problem completely.', right: 'Ostensibly targeted at short commutes, electric scooters nonetheless created fresh sidewalk clutter.', why: '`"Ostensibly"` signals *on the surface (though deeper contrast exists)*—match it with an honest follow-up nuance!' },
    ],
    comparisons: [
      { structure: '"May" vs. "May well" vs. "Might possibly"', difference: '"Might possibly" = faint slim 20% odds; "May" = fair 50% possibility; "May well" = confident >70% probability!', example: 'Pick exact weight accurately on confidence ladders.' },
    ],
    speakingTip: 'Drop natural calibrated phrases like "Arguably, the biggest hurdle isn’t vocabulary—it’s confidence" seamlessly in C1–C2 interviews.',
    writingTip: 'Use `"Admittedly,..."` at the opening of your Counter-Argument / Concession paragraph followed cleanly by `"Nevertheless,..."` two sentences later!',
    reviewSummary: 'Calibrate modal force cleanly (may well vs. might), deploy evaluative stance openers (Admittedly, Tellingly, Ostensibly) thoughtfully, and keep sample claims proportional to evidence.',
    quiz: [
      gEx({ id: 'qc2-06-1', topicId: 'gram-c2-06-hedging-modality-academic-register', type: 'multiple_choice', instruction: 'Identify meaning of modal phrase "may well".', prompt: 'If an economist writes "Fuel savings may well exceed initial solar ferry upgrades by year three", she signals:', options: ['Strict legal prohibition against spending', 'Quite high probability / strong likelihood of surpassing upgrades', 'Very slim near-zero chance of profit', 'Polite permission requested from board members'], correctAnswer: 'Quite high probability / strong likelihood of surpassing upgrades', explanation: '"May well + V1" expresses strong reasonable likelihood (~70%+).', difficulty: 2 }),
      gEx({ id: 'qc2-06-2', topicId: 'gram-c2-06-hedging-modality-academic-register', type: 'multiple_choice', instruction: 'Pick natural evaluative opener matching nuanced contrast.', prompt: '___ aimed strictly at fast test drills, casual word games unexpectedly sparked bedtime reading habits.', options: ['Ostensibly', 'Undoubtedly', 'Literally', 'Irrelevantly'], correctAnswer: 'Ostensibly', explanation: '"Ostensibly" contrasts apparent surface aim vs. deeper real effect cleanly.', difficulty: 2 }),
      gEx({ id: 'qc2-06-3', topicId: 'gram-c2-06-hedging-modality-academic-register', type: 'error_correction', instruction: 'Trim over-claim and figurative misuse.', prompt: 'Refine formally: "That one survey literally proves everyone everywhere hates slow websites."', correctAnswer: 'That survey suggests users widely dislike slow websites.', acceptableAnswers: ['Evidence from that survey strongly suggests users dislike slow websites.'], explanation: 'Remove misuse of `"literally"` and replace total exaggeration (`proves everyone`) with calm academic hedging.', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c2-07-punctuation-rhetoric-parallelism',
    cefrLevel: 'C2',
    title: 'Structural Parallelism, Semicolons vs. Colons, & Syntactic Rhythm',
    summary: 'Control grammatical symmetry across complex pairs/lists and separate colons, semicolons, and dashes cleanly.',
    summaryVi: 'Cấu trúc Song hành chuẩn mực (Parallelism), dấu Chấm phẩy vs. Hai chấm và Nhịp điệu tu từ câu văn C2.',
    objectives: [
      'Enforce strict grammatical symmetry across coordinates ("and, or, rather than"), correlatives ("not only... but also, neither... nor, both... and"), and formal lists.',
      'Separate Colons (reveal / list / explain directly after a full independent sentence!) cleanly from Semicolons (balance two close equal independent clauses OR untangle messy lists holding internal commas!).',
      'Vary sentence length purposefully: anchor complex multi-clause reasoning with crisp memorable 5-word final impact sentences.',
    ],
    detailedExplanation:
      'Faulty parallelism silently disrupts even advanced essays when writers begin a triplet with nouns, swap mid-stride into an infinitive, and finish with a full clause (*"Apps boost recall, **to build speed**, and **grammar grows clear**"*). Lock every coordinated branch onto identical syntax! Match punctuation equally sharply: use a **Semicolon `;`** between two self-standing complete clauses of similar weight (`"Charts track numbers; interviews uncover reasons"`), and reserve a **Colon `:`** ONLY after a complete sentence to unveil an example, explanation, or list (`"Remember three habits: listen daily, speak bravely, review calmly"`—NEVER slice a verb straight from its object with *"The goals are: X"*!).',
    structures: [
      { label: 'Strict Correlative Parallelism', formula: 'both [Noun] and [Noun]  |  not only [Verb phrase] but also [Verb phrase]  |  neither [Adj] nor [Adj]', example: 'Clean rubrics promote not only fairer grading but also clearer self-review.' },
      { label: 'Colon After Complete Clause', formula: '[Complete Independent Sentence]: [Explanation / Crisp List / Reveal]', example: 'Audio stories carry one silent power: they teach natural breathing rhythm effortlessly.' },
      { label: 'Super-Comma Semicolon', formula: 'Item A, extra info; Item B, extra info; and Item C, extra info', example: 'Visit Hue, the serene river citadel; Hoi An, a lantern port; and Da Lat, the pine valley.' },
    ],
    usageRules: [
      'Never drop a Colon directly behind "is / are / include / such as" (*"Three keys are: clarity, speed, depth"* fails -> say `"Three keys shape quality: clarity, speed, depth"` or simply drop the colon!).',
      'Watch preposition parallelism: `"interested in BOTH speaking AND writing"` (fine) vs. `"both IN speaking and writing"` (FAULTY—move "both" AFTER shared preposition `in`, or repeat `in`: `"both in speaking and in writing"`!).',
      'Use Em-dash pauses or 4–6 word short concluding sentences intentionally right after long balanced periodic sentences.',
    ],
    exceptions: [
      'Lowercase or capitalize the first letter of a full sentence after a colon consistently according to style guide (US APA often capitalizes complete-sentence explanations; UK style prefers lowercase)—just stay consistent within a document.',
    ],
    examples: [
      { english: 'Effective language coaching aims neither to overwhelm beginners with rules nor to praise shallow clicks blindly.', vietnamese: 'Dạy ngôn ngữ hiệu quả không nhằm áp đảo người mới bằng quy tắc và cũng chẳng khen ngợi mù quáng số lượt nhấp rỗng.' },
      { english: 'Coastal towns face an urgent choice: invest now in living mangrove belts or repair endless floodwalls later.', vietnamese: 'Thị trấn ven biển đứng trước lựa chọn khẩn cấp: đầu tư ngay vào dải rừng ngập mặn sống hay liên tục vá đê về sau.' },
      { english: 'Inspectors checked all core metrics: A1–C2 vocabulary depth, grammar explanation accuracy, and verified reference URLs.', vietnamese: 'Kiểm định viên rà mọi chỉ số cốt lõi: độ sâu từ vựng A1–C2, độ chuẩn giải thích ngữ pháp và liên kết tham chiếu xác thực.' },
      { english: 'We tested regional audio mixes from Liverpool, northern England; Glasgow, western Scotland; and Melbourne, southern Australia.', vietnamese: 'Chúng tôi kiểm âm vùng miền từ Liverpool, bắc Anh; Glasgow, tây Scotland; và Melbourne, nam Úc.' },
      { english: 'Long chapters build stamina; brief daily wins sustain joy. Habits endure.', vietnamese: 'Chương dài rèn sức bền; thành quả nhỏ mỗi ngày nuôi niềm vui. Thói quen tồn tại lâu bền.' },
    ],
    commonMistakes: [
      { wrong: 'Our curriculum values clear IPA audio, contextual sentences, and helping students practice daily.', right: 'Our curriculum values clear IPA audio, contextual sentences, and daily interactive practice.', why: 'Keep all three objects clean parallel noun phrases instead of swapping to "-ing clause" at item three.' },
      { wrong: 'Three core habits include: listening daily, speaking bravely, and consistent sleep.', right: 'Three core habits drive fluency: listening daily, speaking bravely, and sleeping well.', why: 'Do not place a colon straight between verb "include" and its direct objects; close an independent clause first, and align all three items as V-ing phrases!' },
      { wrong: 'She spoke both fluently with elders and calmly to impatient crowds.', right: 'She spoke both fluently with elders and calmly to impatient crowds — notice prepositions match cleanly, compare WRONG: *"She succeeded both in speaking and writing quickly"* -> wait: write "succeeded IN both speaking and writing" OR "both IN speaking and IN writing"!', why: 'Whatever follows the first half of `"both / not only"` MUST balance identically after `"and / but also"`.' },
    ],
    comparisons: [
      { structure: 'Semicolon (;) vs. Colon (:)', difference: 'Semicolon balances two independent clauses side by side (Equal "=" sign); Colon points forward (`=>`) unveiling detail/example right after one full sentence!', example: 'Test by replacing `;` with `"="` and `:` with `"namely =>"`.' },
    ],
    speakingTip: 'Use crisp tricolons (rhythmic lists of three parallel elements: "clear voices, patient pacing, genuine listening") in presentations—audiences remember rules of three effortlessly!',
    writingTip: 'Read your IELTS Task 2 conclusion aloud: end with one balanced parallel pair followed by one brisk decisive thought.',
    reviewSummary: 'Align coordinated lists and correlative halves ("both... and / not only... but also") symmetrically, place colons ONLY behind complete clauses, and pair semicolons between closely linked sentences or comma-rich lists.',
    quiz: [
      gEx({ id: 'qc2-07-1', topicId: 'gram-c2-07-punctuation-rhetoric-parallelism', type: 'multiple_choice', instruction: 'Pick strictly parallel correlative syntax.', prompt: 'Which sentence preserves flawless C2 parallelism?', options: ['Automated audits verify not only word counts but also they check duplicate IDs.', 'Automated audits not only verify word counts but also catch broken links immediately.', 'Automated audits verify both unique IDs and catching broken URLs.', 'Automated audits both aim to clean lists and organizing topics.'], correctAnswer: 'Automated audits not only verify word counts but also catch broken links immediately.', explanation: 'Both halves after "not only" and "but also" start symmetrically with crisp plural present verbs (`verify...` / `catch...`).', difficulty: 2 }),
      gEx({ id: 'qc2-07-2', topicId: 'gram-c2-07-punctuation-rhetoric-parallelism', type: 'multiple_choice', instruction: 'Choose proper colon vs. semicolon usage.', prompt: 'Pick flawless formal punctuation:', options: ['Essential grammar guides cover: articles, conditionals, and subtle modals.', 'Clean study apps honor one promise; respect student focus.', 'Clean study apps honor one quiet promise: never waste learner focus.', 'They fixed bugs, moreover; tests stayed green.'], correctAnswer: 'Clean study apps honor one quiet promise: never waste learner focus.', explanation: 'Complete opening sentence followed by colon unveils the exact named promise smoothly.', difficulty: 2 }),
      gEx({ id: 'qc2-07-3', topicId: 'gram-c2-07-punctuation-rhetoric-parallelism', type: 'error_correction', instruction: 'Repair broken 3-part parallelism.', prompt: 'Balance all three list branches: "Good dictionaries provide exact IPA, clear example sentences, and telling users common collocations."', correctAnswer: 'Good dictionaries provide exact IPA, clear example sentences, and common collocations.', explanation: 'Trim "telling users" so all three branches remain crisp adjective + noun phrases.', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c2-08-rhetorical-cohesion-register-polish',
    cefrLevel: 'C2',
    title: 'Register Calibration, Tone Nuance & Authentic Idiomatic Restraint',
    summary: 'Switch seamlessly across academic, executive, literary, and friendly spoken registers while dodging fake "big-word" stiffness.',
    summaryVi: 'Điều chỉnh Văn phong (Register) tinh tế ở trình độ C2: tránh sáo ngữ cầu kỳ giả tạo và chuyển giọng chuẩn từng hoàn cảnh.',
    objectives: [
      'Diagnose and neutralize **register clashes** (mixing informal phrasals/contractions inside legal prose OR stiff Latin pomp inside friendly chat).',
      'Distinguish **plain clarity** (`lucid, concise, direct`) from inflated empty jargon (`utilize -> use`, `facilitate commencement -> begin`) intentionally.',
      'Weave authentic idioms sparingly like delicate seasoning rather than cramming stiff textbook clichés into academic writing.',
    ],
    detailedExplanation:
      'Surprisingly, advanced learners often lose C2 clarity NOT from lacking fancy words, but from **over-decorating simple ideas** (`"Prior to the commencement of morning hydration..."` when `"Before breakfast coffee..."` shines!) or **jarring register mismatches** (`"Findings proved awesome notwithstanding earlier caveats"`!). True Proficiency means total **command of tone**: knowing instinctively when concise Saxon plain English speaks with quiet dignity, when crisp academic nominalization clarifies causation, and when one light authentic idiom warms human dialogue without sounding rehearsed.',
    structures: [
      { label: 'Register Consistency Spectrum', formula: 'Intimate/Spoken ("hang out, grab") <-> Neutral Crisp ("meet, use") <-> Formal/Academic ("collaborate, utilize")', example: 'Don’t drop slang ("kids totally bombed") mid-way inside serious urban essays!' },
      { label: 'Cutting Pompous Bloat', formula: 'verbose pomp ("in light of the fact that") -> clean clarity ("because / given that")', example: 'Trim *"at this precise juncture in time"* smoothly down to `"now"` or `"today"`.' },
      { label: 'Restrained Idiom Balance', formula: 'IELTS Speaking / Op-eds -> light natural idiom  |  Pure Research Papers -> clean analytical metaphors only', example: '"a double-edged sword" works nicely in Essays; skip *"raining cats and dogs"*!' },
    ],
    usageRules: [
      'Verify Latinate vs. Phrasal register balance: single-verb equivalents (`postpone, tolerate, examine, establish`) anchor formal reports, while phrasal twins (`put off, put up with, look into, set up`) warm live speech.',
      'Spot empty tautologies quietly inflating word count: *"past history -> history"*, *"future plans -> plans"*, *"completely unanimous -> unanimous"*, *"each and every -> every"*.',
      'Trust active short Anglo-Saxon verbs (`build, test, verify, guard, shape`) whenever Latin polysyllables add fog without extra precision.',
    ],
    exceptions: [
      'Deliberate comedic understatement intentionally mixes crisp high-register words inside tiny everyday mishaps for dry wit ("Our blender mounted a brief philosophical rebellion this morning").',
    ],
    examples: [
      { english: 'Given tight coastal timetables, planners chose one reliable ferry route over sprawling harbor sprawl.', vietnamese: 'Trước lịch trình ven biển sát sao, nhà quy hoạch chọn một tuyến phà tin cậy thay vì dàn trải nhiều bến.' },
      { english: 'Though social media offers rapid exposure, it remains a double-edged sword for sustained reading focus.', vietnamese: 'Dù mạng xã hội mang lại cơ hội tiếp xúc nhanh, nó vẫn là con dao hai lưỡi với sự tập trung đọc sâu.' },
      { english: 'Reviewers recommended trimming inflated bureaucratic phrases down to transparent plain English.', vietnamese: 'Người thẩm định khuyến nghị cắt bớt cụm từ hành chính phồng chữ để giữ tiếng Anh minh bạch giản dị.' },
      { english: 'Instead of claiming overnight breakthroughs, steady daily craft patiently builds lasting mastery.', vietnamese: 'Thay vì tuyên bố đột phá sau một đêm, việc trau dồi đều mỗi ngày kiên nhẫn dựng nên trình độ vững bền.' },
      { english: 'Keep casual contractions warmly alive in spoken chats while keeping scholarship essays sharp and clean.', vietnamese: 'Hãy giữ rút gọn tự nhiên ấm áp khi trò chuyện miệng đồng thời giữ tiểu luận học thuật sắc nét chỉn chu.' },
    ],
    commonMistakes: [
      { wrong: 'Despite the fact that previous past history showed issues, stuff got totally fixed.', right: 'Although past records revealed early gaps, engineers thoroughly resolved every flaw.', why: 'Fixes tautology (*"previous past history"*), wordy `"despite the fact that"`, and sloppy register mismatch (`"stuff got totally"`).' },
      { wrong: 'All and every single applicant must furnish an exact commencement signature prior to entry.', right: 'Every applicant must sign before entry.', why: 'Trim pompous repetition (`All and every single`, `furnish`, `prior to`) down to lucid plain grace.' },
      { wrong: 'Every student gets the short end of the stick and burns midnight oil daily (IELTS Task 2 Essay!).', right: 'Overloaded timetables deprive learners of healthy evening rest.', why: 'Overused picturesque idioms feel jarring inside formal academic policy paragraphs.' },
    ],
    comparisons: [
      { structure: 'Crisp Formal vs. Pompous Jargon', difference: 'Crisp: "We must verify whether older links still work." vs. Pompous: "It is incumbent upon staff to effectuate retrospective link viability verification."', example: 'C2 writers aim to enlighten effortlessly, never to intimidate!' },
    ],
    speakingTip: 'Match warmth to context: casual `"Sure, let’s iron out those details over coffee"` with teammates vs. poised `"Happy to clarify both timeline tradeoffs"` with executives.',
    writingTip: 'Final C2 edit ritual: hunt down tautologies (*"advance planning, end result, collaborate together"*) and cut every empty filler word without mercy!',
    reviewSummary: 'Keep register consistent without mixing slang into formal prose, strip tautologies and pompous filler down to crisp clarity, and weave tasteful idioms sparingly where register welcomes them.',
    quiz: [
      gEx({ id: 'qc2-08-1', topicId: 'gram-c2-08-rhetorical-cohesion-register-polish', type: 'multiple_choice', instruction: 'Eliminate register clash in academic analysis.', prompt: 'Which revision removes distracting register clash cleanly from an urban planning essay?', options: ['Commuters were totally ticked off by sluggish trains.', 'Daily rail delays eroded commuter trust substantially.', 'Guys really disliked waiting forever on platforms.', 'Sluggish transit caused big bad vibes all round.'], correctAnswer: 'Daily rail delays eroded commuter trust substantially.', explanation: 'Neutral formal phrasing ("eroded commuter trust substantially") fits analytical policy register cleanly.', difficulty: 1 }),
      gEx({ id: 'qc2-08-2', topicId: 'gram-c2-08-rhetorical-cohesion-register-polish', type: 'multiple_choice', instruction: 'Spot subtle hidden tautology redundancy.', prompt: 'Which phrase contains NO redundant repeated meaning?', options: ['past history records', 'collaborate together closely', 'mutual respect', 'future forecasts ahead'], correctAnswer: 'mutual respect', explanation: '"Past" repeats "history"; "together" repeats "collaborate"; "future/ahead" repeat "forecast"—only "mutual respect" is crisp and unpadded.', difficulty: 2 }),
      gEx({ id: 'qc2-08-3', topicId: 'gram-c2-08-rhetorical-cohesion-register-polish', type: 'sentence_transformation', instruction: 'Strip pompous bloat cleanly.', prompt: 'Edit down to crisp plain grace: "In light of the present fact that battery costs dropped, urban buyers adopted EVs faster."', correctAnswer: 'Because battery costs dropped, urban buyers adopted EVs faster.', acceptableAnswers: ['As battery costs fell, urban buyers adopted EVs faster.', 'Since battery costs dropped, urban buyers adopted EVs faster.'], explanation: 'Trim five-word filler `"In light of the present fact that"` cleanly into `"Because / Since / As"`.', difficulty: 2 }),
    ],
  }),
];
