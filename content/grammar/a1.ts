import type { GrammarTopic } from '@english-quest/shared';
import { createGrammarLesson, gEx } from './helpers';

export const A1_GRAMMAR_TOPICS: GrammarTopic[] = [
  createGrammarLesson({
    id: 'gram-a1-01-to-be',
    cefrLevel: 'A1',
    title: 'Verb "To Be" (am / is / are) — States, Jobs & Places',
    summary: 'Express identity, feelings, ages, nationalities, and locations accurately without adding extra action verbs.',
    summaryVi: 'Động từ "To Be" (am / is / are) diễn tả danh tính, nghề nghiệp, cảm xúc, tuổi tác và vị trí.',
    objectives: [
      'Choose am, is, or are automatically with every subject pronoun (I, you, he, she, it, we, they).',
      'Form natural negative contractions (I’m not, isn’t, aren’t) and Yes/No questions by inverting subject and verb.',
      'Avoid the top learner slip of dropping "is/are" before adjectives ("She tall" -> "She is tall").',
    ],
    detailedExplanation:
      'In Vietnamese, adjectives often connect directly to subjects ("Cô ấy cao", "Trời nóng"). In English, every complete sentence needs a real verb, so adjectives, ages, jobs, and locations require "am / is / are". Match the form strictly to the subject, use natural contractions in conversation, and invert Subject + To Be cleanly to ask Yes/No questions without adding "do/does".',
    structures: [
      { label: 'Affirmative (+)', formula: 'Subject + am / is / are + Complement', example: 'Minh is an engineer. We are ready.' },
      { label: 'Negative (-)', formula: 'Subject + am not / isn’t / aren’t + Complement', example: 'The library isn’t open yet today.' },
      { label: 'Question (?)', formula: 'Am / Is / Are + Subject + Complement?', example: 'Are your classmates from Da Nang?' },
    ],
    usageRules: [
      'Use "am" exclusively with "I" (I’m), "is" with singular nouns and he/she/it, and "are" with you/we/they and plural nouns.',
      'Use "To Be" for age ("I am 24"), NOT "have" ("I have 24" is incorrect).',
      'Always keep "is/are" before adjectives ("This soup is hot", "They are tired").',
    ],
    exceptions: [
      'In informal conversation, "I’m not" contracts safely, whereas English avoids *"amn’t" in statements—yet negative tag questions use "aren’t I?" ("I’m early, aren’t I?").',
      '"Everyone / somebody / everything" looks plural in idea yet takes singular "is" ("Everyone is welcome").',
    ],
    examples: [
      { english: 'Hello! I’m Linh, and I’m a product designer from Hue.', vietnamese: 'Chào bạn! Mình là Linh, là nhà thiết kế sản phẩm từ Huế.' },
      { english: 'My morning coffee is still warm on the desk.', vietnamese: 'Cà phê sáng của mình vẫn còn ấm trên bàn.' },
      { english: 'The new study headphones aren’t expensive.', vietnamese: 'Tai nghe học tập mới không đắt đâu.' },
      { english: 'Are the afternoon reading rooms quiet today?', vietnamese: 'Các phòng đọc buổi chiều hôm nay có yên tĩnh không?' },
      { english: 'My brother is nineteen years old and eager to travel.', vietnamese: 'Em trai mình mười chín tuổi và rất háo hức đi du lịch.' },
    ],
    commonMistakes: [
      { wrong: 'She very kind.', right: 'She is very kind.', why: 'English adjectives cannot act as verbs by themselves; keep "is".' },
      { wrong: 'I have twenty-two years old.', right: 'I am twenty-two years old.', why: 'English expresses age with "To Be", never "have".' },
      { wrong: 'Do you are hungry?', right: 'Are you hungry?', why: 'Never mix "do/does" with "am/is/are"—invert "To Be" directly.' },
    ],
    comparisons: [
      { structure: 'To Be vs. Do/Does', difference: 'To Be links states ("Are you tired?"), whereas Do/Does questions action verbs ("Do you work here?").', example: 'Is she a teacher? vs. Does she teach math?' },
    ],
    speakingTip: 'Use natural contractions ("I’m", "she’s", "they’re", "isn’t") in everyday speech—full uncontracted "is not" sounds extra emphatic or stiff.',
    writingTip: 'Check singular vs. plural subjects inside long noun phrases ("The noise of the buses IS loud", not *ARE loud).',
    reviewSummary: 'Match I -> am, he/she/it -> is, you/we/they -> are; invert for questions and never omit "To Be" before adjectives or age.',
    quiz: [
      gEx({ id: 'qa1-01-1', topicId: 'gram-a1-01-to-be', type: 'multiple_choice', instruction: 'Choose the correct form.', prompt: 'My neighbors ___ very friendly and helpful.', options: ['am', 'is', 'are', 'be'], correctAnswer: 'are', explanation: '"Neighbors" is plural, so use "are".', explanationVi: '"Neighbors" là số nhiều nên dùng "are".', difficulty: 1 }),
      gEx({ id: 'qa1-01-2', topicId: 'gram-a1-01-to-be', type: 'fill_blank', instruction: 'Complete with am, is, or are.', prompt: '___ your sister at the library right now?', correctAnswer: 'Is', acceptableAnswers: ['is'], explanation: 'Invert singular "Is" before "your sister".', explanationVi: 'Đảo "Is" trước danh từ số ít "your sister".', difficulty: 1 }),
      gEx({ id: 'qa1-01-3', topicId: 'gram-a1-01-to-be', type: 'error_correction', instruction: 'Fix the common learner mistake.', prompt: 'Rewrite accurately: "This coffee very delicious."', correctAnswer: 'This coffee is very delicious.', acceptableAnswers: ['The coffee is very delicious.'], explanation: 'Add linking verb "is" before adjective "delicious".', explanationVi: 'Cần thêm động từ liên kết "is" trước tính từ "delicious".', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a1-02-present-simple-routines',
    cefrLevel: 'A1',
    title: 'Present Simple Tense — Daily Habits, Facts & Timetables',
    summary: 'Talk naturally about everyday routines, general truths, and recurring work/study schedules.',
    summaryVi: 'Thì Hiện tại đơn diễn tả thói quen hằng ngày, sự thật hiển nhiên và lịch trình cố định.',
    objectives: [
      'Remember third-person singular "-s / -es / -ies" endings cleanly on he/she/it verbs.',
      'Build crisp negatives ("don’t / doesn’t + base verb") and questions ("Do / Does + subject + base verb?").',
      'Position frequency adverbs ("always, usually, often, sometimes, never") naturally.',
    ],
    detailedExplanation:
      'Present Simple expresses what happens regularly, permanently, or by fixed timetable—NOT just what you see right this second. Only "he / she / it" (and singular nouns) add "-s / -es" in positive statements. Once you introduce "does" or "doesn’t" in questions or negatives, return the main verb strictly back to base infinitive form ("Does she speak English?", NOT *"Does she speaks?").',
    structures: [
      { label: 'Affirmative (+)', formula: 'I/You/We/They + V1  |  He/She/It + V1-s/-es', example: 'I walk to work. She takes the 7:15 bus.' },
      { label: 'Negative (-)', formula: 'Subject + don’t / doesn’t + V1 (base verb)', example: 'He doesn’t drink coffee after 3 p.m.' },
      { label: 'Question (?)', formula: 'Do / Does + Subject + V1 (base verb)?', example: 'Does the museum open on Mondays?' },
    ],
    usageRules: [
      'Add "-es" after verbs ending in -s, -sh, -ch, -x, -o ("watches, misses, goes, does").',
      'Verbs ending in consonant + -y change to -ies ("study -> studies"; compare vowel + -y: "play -> plays").',
      'Frequency adverbs sit BEFORE main action verbs ("I always review at 7") yet AFTER To Be ("She is always punctual").',
    ],
    exceptions: [
      'Irregular third-person spelling: "have -> has" (NOT *"haves"), "say -> says" (pronounced /sez/).',
      'Scheduled public timetables (trains, flights, cinema times) also use Present Simple for fixed near futures.',
    ],
    examples: [
      { english: 'Every weekday morning, Linh practices listening for fifteen minutes.', vietnamese: 'Mỗi sáng ngày thường, Linh luyện nghe mười lăm phút.' },
      { english: 'The shuttle bus leaves outside Terminal Two every half hour.', vietnamese: 'Xe buýt trung chuyển rời cổng Nhà ga số Hai mỗi nửa giờ.' },
      { english: 'Water freezes at zero degrees Celsius.', vietnamese: 'Nước đóng băng ở không độ C.' },
      { english: 'My parents don’t live downtown anymore; they prefer a quiet garden.', vietnamese: 'Bố mẹ mình không sống ở trung tâm nữa; họ thích khu vườn yên tĩnh.' },
      { english: 'How often does your study club meet online?', vietnamese: 'Câu lạc bộ học tập của bạn họp trực tuyến bao lâu một lần?' },
    ],
    commonMistakes: [
      { wrong: 'Does he works at the bank?', right: 'Does he work at the bank?', why: 'Auxiliary "Does" already carries the "-s"; keep main verb "work" in base form.' },
      { wrong: 'She don’t like rainy Mondays.', right: 'She doesn’t like rainy Mondays.', why: 'Singular third-person negative takes "doesn’t".' },
      { wrong: 'I am always get up early.', right: 'I always get up early.', why: 'Do not put "am/is/are" in front of an action base verb for routine habits.' },
    ],
    comparisons: [
      { structure: 'Present Simple vs. Continuous', difference: 'Routine fact ("I read daily") vs. action happening right now ("I am reading a mystery chapter").', example: 'She speaks French, and right now she is helping a guest.' },
    ],
    speakingTip: 'Pronounce third-person "-s/-es" clearly when speaking carefully—ending consonants help listeners track singular subjects cleanly.',
    writingTip: 'Watch compound subjects: "Minh and An live" (plural, no -s), vs. "Minh, together with his sister, lives" (-s matches Minh).',
    reviewSummary: 'Use base verb for I/you/we/they and V-s/-es for he/she/it; drop -s whenever Do/Does/don’t/doesn’t appears.',
    quiz: [
      gEx({ id: 'qa1-02-1', topicId: 'gram-a1-02-present-simple-routines', type: 'multiple_choice', instruction: 'Pick the correct third-person verb.', prompt: 'Nam usually ___ new vocabulary cards right after breakfast.', options: ['review', 'reviews', 'reviewing', 'is review'], correctAnswer: 'reviews', explanation: 'Routine with singular subject "Nam" takes "reviews".', difficulty: 1 }),
      gEx({ id: 'qa1-02-2', topicId: 'gram-a1-02-present-simple-routines', type: 'error_correction', instruction: 'Correct the question.', prompt: 'Fix: "Does Anna goes to the park on Sundays?"', correctAnswer: 'Does Anna go to the park on Sundays?', explanation: 'Use base verb "go" after "Does".', difficulty: 1 }),
      gEx({ id: 'qa1-02-3', topicId: 'gram-a1-02-present-simple-routines', type: 'sentence_ordering', instruction: 'Arrange into a natural English sentence.', prompt: 'Put adverb "always" in the right spot.', wordBank: ['are', 'friendly', 'They', 'always'], correctAnswer: 'They are always friendly', explanation: 'Adverbs of frequency go AFTER "am/is/are".', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a1-03-articles-nouns',
    cefrLevel: 'A1',
    title: 'Articles (a / an / the / zero article) & Singular/Plural Nouns',
    summary: 'Know when a singular noun needs "a/an" or "the", when plurals go bare, and how to pluralize accurately.',
    summaryVi: 'Mạo từ (a / an / the / không mạo từ) và Danh từ số ít - số nhiều cơ bản.',
    objectives: [
      'Choose "a" vs. "an" strictly by initial SOUND (vowel sound vs. consonant sound), not spelling letter.',
      'Use "a/an" for singular countable nouns mentioned the first time, and "the" for specific known things.',
      'Leave plural general statements bare ("Cats love sunlit naps", NOT *"The cats love..." when meaning all cats).',
    ],
    detailedExplanation:
      'Vietnamese classifiers ("một cái / những chiếc") do not require articles on every singular countable noun, making articles a top area for Vietnamese learners. Memorize English’s golden rule: a singular countable noun almost NEVER stands naked—it wants a determiner ("a, an, the, my, this, one"). Choose "an" before vowel sounds ("an hour, an umbrella") and "a" before consonant sounds ("a university, a European city").',
    structures: [
      { label: 'Indefinite (New / General Singular)', formula: 'a + consonant sound  |  an + vowel sound', example: 'Wait an hour in a quiet café.' },
      { label: 'Definite (Known / Unique)', formula: 'the + Singular / Plural / Uncountable', example: 'Close the kitchen window, please.' },
      { label: 'Zero Article (General Plural / Uncountable)', formula: 'Ø + Plural Noun  |  Ø + Coffee/Music', example: 'Dictionaries explain pronunciation clearly.' },
    ],
    usageRules: [
      'Mention a noun once with "a/an", then refer back to it with "the" ("I bought a book. The book is great.").',
      'Use "the" for unique things ("the sun, the internet") and specific shared context ("pass the salt on the table").',
      'Sound beats letter: "an honest answer" (/ɒnɪst/ vowel start), "a useful guide" (/juːsfʊl/ starts with /j/ consonant glide).',
    ],
    exceptions: [
      'No article before meal names ("have breakfast"), common sports ("play badminton"), or transport after "by" ("by bus").',
      'Key irregular plurals: child -> children, person -> people, foot -> feet, tooth -> teeth, mouse -> mice.',
    ],
    examples: [
      { english: 'She carries a yellow umbrella and an English dictionary in her bag.', vietnamese: 'Cô ấy mang theo một chiếc ô vàng và một cuốn từ điển tiếng Anh trong túi.' },
      { english: 'Look at the moon above the library roof tonight!', vietnamese: 'Hãy nhìn mặt trăng phía trên mái thư viện tối nay kìa!' },
      { english: 'Good sleep helps memory, whereas stress makes words hard to remember.', vietnamese: 'Giấc ngủ ngon giúp trí nhớ, còn căng thẳng khiến từ khó nhớ.' },
      { english: 'Taking an honest pause helps speakers avoid rushing through an interview.', vietnamese: 'Ngừng nghỉ trung thực một nhịp giúp người nói tránh nói vội trong phỏng vấn.' },
      { english: 'Twenty children read colorful picture books near the garden.', vietnamese: 'Hai mươi em nhỏ đọc sách tranh rực rỡ gần khu vườn.' },
    ],
    commonMistakes: [
      { wrong: 'My brother is doctor at city hospital.', right: 'My brother is a doctor at a city hospital.', why: 'Jobs in English strictly require "a/an" before singular countable nouns.' },
      { wrong: 'We waited a hour outside an university.', right: 'We waited an hour outside a university.', why: '"Hour" starts with silent h (/aʊər/), while "university" starts with /j/ consonant glide.' },
      { wrong: 'The bicycles are very healthy for environment.', right: 'Bicycles are very healthy for the environment.', why: 'General plural categories drop "the", while unique "the environment" keeps "the".' },
    ],
    comparisons: [
      { structure: 'General Tea vs. Specific Tea', difference: '"I love tea" means all tea generally; "The tea in this pot is jasmine" specifies exact tea.', example: 'Green tea calms nerves; the tea you brewed smells wonderful.' },
    ],
    speakingTip: 'Practice linking "an apple" cleanly as /ən‿æpl/ so "an" glides softly rather than breaking your sentence rhythm.',
    writingTip: 'Run a quick singular-noun scan when editing paragraphs: highlight jobs, gadgets, or places and ensure each singular countable noun has a determiner.',
    reviewSummary: 'Match a/an by opening SOUND, never leave singular countable nouns bare, and omit "the" when speaking of plural nouns in general.',
    quiz: [
      gEx({ id: 'qa1-03-1', topicId: 'gram-a1-03-articles-nouns', type: 'multiple_choice', instruction: 'Select the right article pair.', prompt: 'We waited ___ hour outside ___ museum.', options: ['a / an', 'an / the', 'a / the', 'an / Ø'], correctAnswer: 'an / the', explanation: '"Hour" starts with vowel sound /aʊ/; "the museum" refers to a specific museum.', difficulty: 1 }),
      gEx({ id: 'qa1-03-2', topicId: 'gram-a1-03-articles-nouns', type: 'fill_blank', instruction: 'Add "a", "an", or "-" (no article).', prompt: 'My cousin wants to study at ___ university in Canberra.', correctAnswer: 'a', explanation: '"University" starts with the consonant /j/ glide (/juː/), so it takes "a".', difficulty: 2 }),
      gEx({ id: 'qa1-03-3', topicId: 'gram-a1-03-articles-nouns', type: 'error_correction', instruction: 'Fix the missing article.', prompt: 'Correct: "His mother is experienced nurse."', correctAnswer: 'His mother is an experienced nurse.', explanation: 'Singular countable job phrases need "a/an"—vowel start "experienced" requires "an".', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a1-04-present-continuous',
    cefrLevel: 'A1',
    title: 'Present Continuous — Actions Right Now & Temporary Weeks',
    summary: 'Describe live actions unfolding at the moment of speech or temporary current projects cleanly.',
    summaryVi: 'Thì Hiện tại Tiếp diễn diễn tả hành động đang diễn ra ngay lúc nói hoặc kế hoạch tạm thời.',
    objectives: [
      'Form "am / is / are + verb-ing" smoothly without ever omitting "am/is/are".',
      'Apply clean -ing spelling transformations (make -> making, sit -> sitting, listen -> listening).',
      'Contrast temporary current projects ("living with friends this month") with permanent routines.',
    ],
    detailedExplanation:
      'Present Continuous pairs "am / is / are" with the "-ing" present participle to capture snapshots in motion. Use it for actions happening right as you speak ("Look—it is raining!"), photos/scenes you describe aloud ("Two kids are smiling"), or temporary periods around today ("This semester I am preparing for B1"). Remember never to attach -ing without am/is/are (*"I working now" is incomplete).',
    structures: [
      { label: 'Affirmative (+)', formula: 'Subject + am / is / are + V-ing', example: 'Listen! Birds are singing outside.' },
      { label: 'Negative (-)', formula: 'Subject + ’m not / isn’t / aren’t + V-ing', example: 'I’m not watching TV—I’m practicing audio.' },
      { label: 'Question (?)', formula: 'Am / Is / Are + Subject + V-ing?', example: 'What are you cooking for lunch?' },
    ],
    usageRules: [
      'Silent final -e drops before -ing ("write -> writing, smile -> smiling"; keep double e: "see -> seeing").',
      'One-syllable Consonant-Vowel-Consonant words double the final consonant ("run -> running, sit -> sitting").',
      'Do not double final -w, -x, or -y ("draw -> drawing, fix -> fixing, stay -> staying").',
    ],
    exceptions: [
      'Verbs of static states, feelings, or possession normally stay Present Simple, NOT Continuous: "know, like, love, want, need, believe, remember" ("I understand now", NOT *"I am understanding").',
      'Two-syllable verbs stressed on syllable 1 stay single consonant ("listen -> listening, open -> opening").',
    ],
    examples: [
      { english: 'Right now, Minh is drinking jasmine tea while reviewing flashcards.', vietnamese: 'Ngay lúc này, Minh đang uống trà nhài trong khi ôn thẻ từ vựng.' },
      { english: 'Why are those pedestrians standing near the ticket booth?', vietnamese: 'Tại sao những người đi bộ đó đang đứng gần quầy vé vậy?' },
      { english: 'The weather isn’t raining yet, though grey clouds are gathering.', vietnamese: 'Trời vẫn chưa mưa, nhưng mây xám đang kéo đến.' },
      { english: 'This summer we are building a rooftop herb garden.', vietnamese: 'Mùa hè này chúng mình đang làm một vườn rau gia vị trên sân thượng.' },
      { english: 'Look at the photo: everyone is laughing beside the ancient bridge.', vietnamese: 'Nhìn bức ảnh này xem: mọi người đều đang cười rạng rỡ bên cây cầu cổ.' },
    ],
    commonMistakes: [
      { wrong: 'She sitting near the window.', right: 'She is sitting near the window.', why: 'Continuous tenses always require helper "am/is/are" before V-ing.' },
      { wrong: 'I am knowing the answer now!', right: 'I know the answer now!', why: '"Know" describes a mental state rather than an action; keep it simple.' },
      { wrong: 'He is swiming in the lake.', right: 'He is swimming in the lake.', why: 'Double final "m" after a single short vowel in "swim".' },
    ],
    comparisons: [
      { structure: 'Routine vs. Live Moment', difference: 'Routine uses Simple ("He cooks dinner every Sunday"); right now uses Continuous ("He is cooking soup now").', example: 'I usually walk, but today I am taking the bus because of rain.' },
    ],
    speakingTip: 'Contract "is" and "are" into crisp casual speech ("Who’s calling?", "What’re you reading?").',
    writingTip: 'Use Present Continuous selectively for describing charts in real time or describing lively scenes in informal stories.',
    reviewSummary: 'Pair am/is/are + V-ing for actions in progress or temporary weeks; keep state verbs like know/want/like simple.',
    quiz: [
      gEx({ id: 'qa1-04-1', topicId: 'gram-a1-04-present-continuous', type: 'multiple_choice', instruction: 'Pick the live snapshot sentence.', prompt: 'Quiet, please—our roommate ___ an online job interview.', options: ['has', 'having', 'is having', 'are having'], correctAnswer: 'is having', explanation: 'Temporary event occurring right now ("Quiet, please") uses Present Continuous.', difficulty: 1 }),
      gEx({ id: 'qa1-04-2', topicId: 'gram-a1-04-present-continuous', type: 'fill_blank', instruction: 'Spell the -ing form accurately.', prompt: 'Write the -ing form of "write": She is ___ a letter.', correctAnswer: 'writing', explanation: 'Drop silent -e before adding -ing ("write -> writing").', difficulty: 1 }),
      gEx({ id: 'qa1-04-3', topicId: 'gram-a1-04-present-continuous', type: 'error_identification', instruction: 'Identify the incorrect stative verb use.', prompt: 'Which sentence is WRONG in standard English?', options: ['She is smiling warmly.', 'They are waiting outside.', 'I am wanting a glass of water.', 'We are studying English now.'], correctAnswer: 'I am wanting a glass of water.', explanation: '"Want" is a static state verb—say "I want a glass of water".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a1-05-there-is-are-prepositions',
    cefrLevel: 'A1',
    title: '"There is / There are" & Place Prepositions (in / on / at / under)',
    summary: 'Introduce existing places, items in a room, and exact spatial relationships cleanly.',
    summaryVi: 'Cấu trúc "There is / There are" (có...) và giới từ chỉ vị trí (in, on, at, between, next to).',
    objectives: [
      'Introduce existence using "There is / There are" rather than incorrectly using "Have a park near my house".',
      'Match "is" vs. "are" cleanly with countable singulars, uncountables, and plurals.',
      'Select exact place prepositions ("in a box/city, on a table/street, at the bus stop").',
    ],
    detailedExplanation:
      'In Vietnamese, "có" expresses both possession ("Tôi có xe") and existence ("Có một công viên"). In English, split these sharply: use "have" ONLY when an owner possesses something ("The café has warm lighting"), and use "There is / There are" to announce that something exists in a spot ("There is a sunny park behind the café").',
    structures: [
      { label: 'Singular / Uncountable', formula: 'There is (There’s) + a/an + Singular Noun  |  some + Uncountable', example: 'There is a quiet bakery around the corner.' },
      { label: 'Plural', formula: 'There are + two/some/many + Plural Noun', example: 'There are three free study tables upstairs.' },
      { label: 'Questions & Negatives', formula: 'Is/Are there + any + Noun?  |  There isn’t/aren’t any...', example: 'Are there any pharmacies open late nearby?' },
    ],
    usageRules: [
      'In = enclosed spaces, rooms, cities, countries ("in the bag, in Hanoi, in the kitchen").',
      'On = flat surfaces, floors, street names, buses/trains ("on the desk, on the second floor, on Le Loi Street").',
      'At = exact meeting points, addresses with numbers, doors ("at the station entrance, at 24 Main Street").',
    ],
    exceptions: [
      'When listing multiple items starting with a singular noun, natural English uses singular "There is" ("There is a lamp, two pens, and a notebook on the desk").',
      'Say "in a car / taxi" yet "on a bus / train / plane / bicycle".',
    ],
    examples: [
      { english: 'There is a quiet public library just five minutes from my house.', vietnamese: 'Có một thư viện công yên tĩnh cách nhà mình chỉ năm phút.' },
      { english: 'Are there any cold bottles of water left in the fridge?', vietnamese: 'Trong tủ lạnh còn chai nước mát nào không?' },
      { english: 'The keys are right on the kitchen table beside the kettle.', vietnamese: 'Chùm chìa khóa nằm ngay trên bàn bếp cạnh ấm đun nước.' },
      { english: 'Wait for me at the corner between the bakery and the bank.', vietnamese: 'Đợi mình ở góc phố giữa tiệm bánh mì và ngân hàng nhé.' },
      { english: 'There isn’t any sugar in this green jasmine tea.', vietnamese: 'Không có chút đường nào trong trà nhài xanh này đâu.' },
    ],
    commonMistakes: [
      { wrong: 'Near my apartment have two good cafés.', right: 'Near my apartment there are two good cafés.', why: 'Never open an existence sentence with bare "have"; use "there is/there are".' },
      { wrong: 'There is many students in the park.', right: 'There are many students in the park.', why: 'Plural "many students" requires "There are".' },
      { wrong: 'Wait for me in the bus stop.', right: 'Wait for me at the bus stop.', why: 'Exact street meeting stops use "at", not "in".' },
    ],
    comparisons: [
      { structure: 'There is vs. It is', difference: '"There is" introduces new existence; "It is" identifies or describes a known subject.', example: 'There is a café on Oak Street. It is famous for pastries.' },
    ],
    speakingTip: 'Pronounce "There’s" smoothly when mentioning singular items aloud; only avoid contracting plural "There are" to *"There’s" in formal writing.',
    writingTip: 'When describing city maps or living spaces, vary prepositions ("opposite, between, behind, next to") for clear visual layouts.',
    reviewSummary: 'Announce places and items with "There is / There are" (never bare "have"), matching "in / on / at" by space type.',
    quiz: [
      gEx({ id: 'qa1-05-1', topicId: 'gram-a1-05-there-is-are-prepositions', type: 'multiple_choice', instruction: 'Pick the right opener.', prompt: '___ three quiet reading desks near the window.', options: ['There is', 'There are', 'Have', 'It has'], correctAnswer: 'There are', explanation: 'Plural countable noun "three desks" requires "There are".', difficulty: 1 }),
      gEx({ id: 'qa1-05-2', topicId: 'gram-a1-05-there-is-are-prepositions', type: 'multiple_choice', instruction: 'Select the accurate place preposition.', prompt: 'Meet me ___ the north train station gate at eight.', options: ['in', 'on', 'at', 'under'], correctAnswer: 'at', explanation: 'Exact point/gate locations take "at".', difficulty: 1 }),
      gEx({ id: 'qa1-05-3', topicId: 'gram-a1-05-there-is-are-prepositions', type: 'error_correction', instruction: 'Fix the existence mistake.', prompt: 'Rewrite accurately: "My neighborhood have a sunny park." -> or start with There...', correctAnswer: 'There is a sunny park in my neighborhood.', acceptableAnswers: ['My neighborhood has a sunny park.'], explanation: 'Either use "There is..." for existence or singular subject "has".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a1-06-past-simple-regular-irregular',
    cefrLevel: 'A1',
    title: 'Past Simple Basics — Regular "-ed" & Core Irregular Verbs',
    summary: 'Narrate completed yesterday events, weekend trips, and past states using "was/were" and V2 forms.',
    summaryVi: 'Thì Quá khứ đơn cơ bản: động từ có quy tắc thêm "-ed", "was/were" và bất quy tắc thường gặp.',
    objectives: [
      'Distinguish Past Simple "was/were" (for states/places) from "did/didn’t" (for actions).',
      'Apply Past Simple positive V2 vs. negative/question base V1 cleanly ("Did you go?", "I didn’t see").',
      'Master top irregular verbs (go/went, eat/ate, see/saw, buy/bought, come/came, make/made, take/took).',
    ],
    detailedExplanation:
      'Past Simple marks actions completely finished at a specific past time ("yesterday, last night, in 2022, two hours ago"). Just like Present Simple splits To Be and Do/Does, Past Simple uses "was / were" for adjectives, feelings, and places—and "did / didn’t" for action verbs. Whenever "did" or "didn’t" enters, drop "-ed" and return irregular verbs back to base V1 ("I didn’t go", NOT *"I didn’t went").',
    structures: [
      { label: 'To Be Past', formula: 'I/He/She/It + was (wasn’t)  |  You/We/They + were (weren’t)', example: 'Yesterday was sunny, and we were happy.' },
      { label: 'Action Positive (+)', formula: 'Subject + V2 (Verb-ed or Irregular Past)', example: 'We visited Hoi An and ate tasty noodles.' },
      { label: 'Action Negative / Question (-/?)', formula: 'Subject + didn’t + V1  |  Did + Subject + V1?', example: 'Did you buy a ticket? No, I didn’t need one.' },
    ],
    usageRules: [
      'Pronounce "-ed" accurately in 3 clear endings: /t/ after voiceless sounds ("walked, watched"), /d/ after voiced vowels/consonants ("played, called"), and extra syllable /ɪd/ strictly after -t/-d ("waited, needed").',
      'Never combine "was/were" with an active base verb (*"I was go home" -> "I went home").',
    ],
    exceptions: [
      'A few short irregular verbs look identical in Present and Past: "read" (/riːd/ now -> /red/ past), "put -> put", "cost -> cost", "cut -> cut".',
    ],
    examples: [
      { english: 'Last Saturday I woke up early and cooked breakfast for my parents.', vietnamese: 'Thứ Bảy tuần trước mình dậy sớm và nấu bữa sáng cho bố mẹ.' },
      { english: 'The museum wasn’t crowded at nine in the morning.', vietnamese: 'Bảo tàng không hề đông lúc chín giờ sáng.' },
      { english: 'We took the blue train and bought fresh fruit at the market.', vietnamese: 'Chúng mình đi tàu màu xanh và mua trái cây tươi ở chợ.' },
      { english: 'She didn’t forget her passport; it was inside her jacket pocket.', vietnamese: 'Cô ấy không quên hộ chiếu; nó nằm trong túi áo khoác.' },
      { english: 'Did your brother finish his homework before dinner?', vietnamese: 'Em trai bạn có làm xong bài tập trước bữa tối không?' },
    ],
    commonMistakes: [
      { wrong: 'Did you bought new shoes yesterday?', right: 'Did you buy new shoes yesterday?', why: 'Auxiliary "Did" already carries the past tense; return "bought" to base "buy".' },
      { wrong: 'I didn’t saw him at the station.', right: 'I didn’t see him at the station.', why: 'Always use base verb V1 after "didn’t".' },
      { wrong: 'Yesterday we was very tired.', right: 'Yesterday we were very tired.', why: '"We" takes plural "were", never singular "was".' },
    ],
    comparisons: [
      { structure: 'Yesterday Actions vs. Past States', difference: '"Was/were" asks about mood/location ("Were you sick?"); "Did" asks about actions ("Did you visit a doctor?").', example: 'Were you hungry after the swim? Yes, so I ate two eggs.' },
    ],
    speakingTip: 'Avoid pronouncing "walked" or "worked" with an extra "-ed" syllable (/wɔːk-ɪd/ is wrong); finish crisply with a clean /t/ sound (/wɔːkt/).',
    writingTip: 'Anchor past stories with clear time markers ("Yesterday morning, Last weekend, Two days ago") right at the opening.',
    reviewSummary: 'Use was/were for past states, V2 only in positive past sentences, and base V1 whenever did/didn’t appears.',
    quiz: [
      gEx({ id: 'qa1-06-1', topicId: 'gram-a1-06-past-simple-regular-irregular', type: 'multiple_choice', instruction: 'Select the accurate past sentence.', prompt: 'Last Friday, they ___ to a small acoustic concert downtown.', options: ['go', 'went', 'goed', 'were go'], correctAnswer: 'went', explanation: 'Completed past trip uses irregular past V2 "went".', difficulty: 1 }),
      gEx({ id: 'qa1-06-2', topicId: 'gram-a1-06-past-simple-regular-irregular', type: 'error_correction', instruction: 'Fix the negative past form.', prompt: 'Correct: "Minh didn’t ate breakfast before catching the bus."', correctAnswer: 'Minh didn’t eat breakfast before catching the bus.', explanation: 'After "didn’t", always use base verb "eat".', difficulty: 1 }),
      gEx({ id: 'qa1-06-3', topicId: 'gram-a1-06-past-simple-regular-irregular', type: 'pronunciation_discrimination', instruction: 'Pick the word with /ɪd/ extra syllable.', prompt: 'Which Past Simple verb ends with a spoken extra syllable /ɪd/?', options: ['helped', 'played', 'waited', 'cooked'], correctAnswer: 'waited', explanation: 'Verbs ending in -t or -d add syllable /ɪd/ ("waited, needed, decided").', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a1-07-can-cant-modals',
    cefrLevel: 'A1',
    title: 'Can / Can’t & Basic Polite Requests',
    summary: 'Express present abilities, everyday possibilities, and warm polite requests effortlessly.',
    summaryVi: 'Động từ khuyết thiếu "Can / Can’t" diễn tả khả năng, sự cho phép và lời nhờ vả lịch sự.',
    objectives: [
      'Follow every modal ("can / can’t") strictly with a bare infinitive V1—never adding "to" or "-s".',
      'Distinguish spoken stressed "can’t" (/kɑːnt/ or /kænt/) from smooth unstressed "can" (/kən/).',
      'Make polite requests with "Can you...?" and slightly softer "Could you...?".',
    ],
    detailedExplanation:
      '"Can" is English’s friendliest modal helper: it keeps the exact same form for I, you, he, she, it, we, and they! Never add "-s" (*"She cans swim" is wrong) and never insert "to" (*"I can to speak" is wrong). Notice how natives pronounce "I can swim" with a quick light vowel /kən/, whereas negative "I can’t swim" slows down with clear vowel + crisp ending consonant.',
    structures: [
      { label: 'Ability (+)', formula: 'Subject + can + V1 (bare verb)', example: 'My cousin can play guitar and cook great rice.' },
      { label: 'Inability (-)', formula: 'Subject + can’t (cannot) + V1', example: 'Sorry, I can’t open this locked door.' },
      { label: 'Questions / Requests (?)', formula: 'Can + Subject + V1?', example: 'Can you speak a bit more slowly, please?' },
    ],
    usageRules: [
      'Always keep main verb bare after can/can’t ("He can drive", no "-s", no "-ing", no "to").',
      'One word "cannot" is standard in formal spelling; "can’t" is natural everywhere in speech.',
      'Soften favors with "please" at the end ("Can I borrow a pen, please?").',
    ],
    exceptions: [
      'Past general ability uses "could" ("I could swim when I was six"), while future ability uses "will be able to" (never *"will can").',
    ],
    examples: [
      { english: 'Linh can read simple menus in both English and Japanese.', vietnamese: 'Linh có thể đọc thực đơn đơn giản bằng cả tiếng Anh và tiếng Nhật.' },
      { english: 'We can’t park bicycles right in front of the hospital exit.', vietnamese: 'Chúng ta không thể đỗ xe đạp ngay trước cửa ra bệnh viện.' },
      { english: 'Can I pay by phone at this café table?', vietnamese: 'Mình có thể thanh toán qua điện thoại tại bàn quán cà phê này không?' },
      { english: 'He can’t hear you well because the street is very loud.', vietnamese: 'Anh ấy không nghe rõ bạn nói vì ngoài đường rất ồn.' },
      { english: 'Can you show me the way to the train station on this map?', vietnamese: 'Bạn có thể chỉ giúp mình đường ra ga tàu trên bản đồ này không?' },
    ],
    commonMistakes: [
      { wrong: 'My friend can to speak three languages.', right: 'My friend can speak three languages.', why: 'Never put "to" between "can" and the main verb.' },
      { wrong: 'She cans run five kilometers easily.', right: 'She can run five kilometers easily.', why: 'Modals never take "-s" for he/she/it.' },
      { wrong: 'Do you can help me tomorrow?', right: 'Can you help me tomorrow?', why: 'Modals invert by themselves—never add "Do".' },
    ],
    comparisons: [
      { structure: 'Can vs. Could (Requests)', difference: '"Can you help?" is warm and casual; "Could you help?" is extra polite with strangers or teachers.', example: 'Can you pass the salt? vs. Excuse me, could you repeat the gate number?' },
    ],
    speakingTip: 'Pause cleanly on the clear vowel of "can’t" so friends never mishear *"can" for *"can’t"—context plus rhythm makes negative unmistakable!',
    writingTip: 'Use "cannot" as one solid word in official letters, reserving "can’t" for friendly notes and dialogue.',
    reviewSummary: 'Can/can’t stays identical for every subject and always connects straight to a bare verb V1 with zero "to" or "-s".',
    quiz: [
      gEx({ id: 'qa1-07-1', topicId: 'gram-a1-07-can-cant-modals', type: 'multiple_choice', instruction: 'Pick the clean modal sentence.', prompt: 'My grandfather ___ delicious spring rolls without a recipe.', options: ['can cooks', 'can to cook', 'can cook', 'cans cook'], correctAnswer: 'can cook', explanation: 'Modal "can" never adds "-s" or "to".', difficulty: 1 }),
      gEx({ id: 'qa1-07-2', topicId: 'gram-a1-07-can-cant-modals', type: 'error_correction', instruction: 'Fix the question.', prompt: 'Correct: "Do you can help me carry this chair?"', correctAnswer: 'Can you help me carry this chair?', explanation: 'Invert "Can" directly instead of using "Do".', difficulty: 1 }),
      gEx({ id: 'qa1-07-3', topicId: 'gram-a1-07-can-cant-modals', type: 'fill_blank', instruction: 'Complete with one formal negative word.', prompt: 'Guests ___ smoke inside the museum rooms.', correctAnswer: 'cannot', acceptableAnswers: ["can't", "can’t"], explanation: '"Cannot" (written as one word) or "can’t" works cleanly here.', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-a1-08-questions-pronouns',
    cefrLevel: 'A1',
    title: 'Wh- Questions, Subject/Object Pronouns & Possessives',
    summary: 'Ask clear Who/What/Where/When/How questions and distinguish "I/me/my/mine" effortlessly.',
    summaryVi: 'Từ để hỏi Wh- (Who, What, Where, When, How), Đại từ Chủ ngữ/Tân ngữ và Tính từ Sở hữu.',
    objectives: [
      'Form clear Wh- questions placing Question Word + Auxiliary + Subject + Main Verb.',
      'Choose subject pronouns (I, she, they) vs. object pronouns (me, her, them) vs. possessive adjectives (my, her, their).',
      'Distinguish apostrophe "it’s" (it is) cleanly from possessive "its" (no apostrophe!).',
    ],
    detailedExplanation:
      'Strong A1 conversations depend on asking clear open questions and picking natural pronouns without repeating names five times. In Wh- questions, put your question word first, then bring your helper verb ("am/is/are, do/does, did, can") BEFORE the subject ("Where DO YOU live?", NOT *"Where you live?"). Also track English pronouns clearly: "I see her, and she helps me" uses subject before the verb and object after the verb or preposition.',
    structures: [
      { label: 'Wh- Question Formula', formula: 'Wh-word + am/is/are/do/does/did/can + Subject (+ V1)?', example: 'Where does your friend work? When are we leaving?' },
      { label: 'Subject -> Object -> Possessive Adj', formula: 'I/me/my | he/him/his | she/her/her | we/us/our | they/them/their', example: 'They invited us to their garden party.' },
      { label: 'How Much vs. How Many', formula: 'How much + Uncountable (price/water)  |  How many + Plural Countable', example: 'How much is this tea? How many notebooks do you need?' },
    ],
    usageRules: [
      'Always use object pronouns AFTER verbs and prepositions ("Look at them", "Wait for us", "Talk to her").',
      'Use possessive determiners ("my, his, her, our, their") directly in front of nouns ("our new house").',
      'Match "How many" with plural "-s" nouns ("How many friends?") and "How much" with uncountables or prices.',
    ],
    exceptions: [
      'When "Who" or "What" IS the subject doing the action, skip "do/does" and keep normal word order ("Who lives next door?", NOT *"Who does live?").',
      'Possessive pronouns stand alone without a noun ("That blue bag is mine / hers / ours").',
    ],
    examples: [
      { english: 'Where do you usually buy fresh fruit on weekend mornings?', vietnamese: 'Bạn thường mua trái cây tươi ở đâu vào sáng cuối tuần?' },
      { english: 'Wait for me at the corner—my train arrives at ten.', vietnamese: 'Đợi mình ở góc phố nhé—tàu của mình đến lúc mười giờ.' },
      { english: 'The library closed early today, so its front door is locked.', vietnamese: 'Hôm nay thư viện đóng cửa sớm nên cửa trước của nó đã khóa.' },
      { english: 'How much does a return ticket to the airport cost?', vietnamese: 'Vé khứ hồi ra sân bay giá bao nhiêu vậy ạ?' },
      { english: 'Who helped you carry those heavy library books upstairs?', vietnamese: 'Ai đã giúp bạn mang chồng sách thư viện nặng đó lên lầu vậy?' },
    ],
    commonMistakes: [
      { wrong: 'Where you go every morning?', right: 'Where do you go every morning?', why: 'Insert helper "do" before the subject in action Wh- questions.' },
      { wrong: 'Come with we to the café.', right: 'Come with us to the café.', why: 'Prepositions ("with, for, to") always require object pronouns ("us, me, them").' },
      { wrong: 'The café changed it’s menu last week.', right: 'The café changed its menu last week.', why: '"It’s" means "it is"; possessive "its" never takes an apostrophe.' },
    ],
    comparisons: [
      { structure: 'Whose vs. Who’s', difference: '"Whose" asks about owner ("Whose key is this?"); "Who’s" means "Who is / Who has" ("Who’s calling?").', example: 'Who’s at the door, and whose umbrella is wet?' },
    ],
    speakingTip: 'Link "What do you" softly in warm casual chats ("Whaddaya want for dinner?"), while keeping "What do you" crisp in interviews.',
    writingTip: 'Double-check every "it’s / its" and "your / you’re" by silently expanding the contraction ("it is / you are") before submitting.',
    reviewSummary: 'Build questions with Wh- + Helper + Subject + Verb, pick object forms after verbs/prepositions, and never put an apostrophe in possessive "its".',
    quiz: [
      gEx({ id: 'qa1-08-1', topicId: 'gram-a1-08-questions-pronouns', type: 'multiple_choice', instruction: 'Select the grammatically complete question.', prompt: 'Which question asks correctly about lunchtime?', options: ['What time you eat lunch?', 'What time do you eat lunch?', 'What time does you eat lunch?', 'What time are you eat lunch?'], correctAnswer: 'What time do you eat lunch?', explanation: 'Action verb "eat" with "you" needs helper "do" before the subject.', difficulty: 1 }),
      gEx({ id: 'qa1-08-2', topicId: 'gram-a1-08-questions-pronouns', type: 'multiple_choice', instruction: 'Choose the right object/possessive pronouns.', prompt: 'My cousin lent ___ ___ umbrella before the rain started.', options: ['I / she', 'me / her', 'my / hers', 'me / hers'], correctAnswer: 'me / her', explanation: 'Object pronoun "me" follows verb "lent", and possessive adjective "her" precedes noun "umbrella".', difficulty: 2 }),
      gEx({ id: 'qa1-08-3', topicId: 'gram-a1-08-questions-pronouns', type: 'fill_blank', instruction: 'Choose "its" or "it’s".', prompt: 'Look at that little bird—___ wing is bright blue.', correctAnswer: 'its', explanation: 'Possessive "its" takes no apostrophe ("it’s" = "it is").', difficulty: 1 }),
    ],
  }),
];
