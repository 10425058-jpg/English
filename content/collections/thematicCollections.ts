import type { ThematicCollection } from '@english-quest/shared';

export const THEMATIC_COLLECTIONS: ThematicCollection[] = [
  // ======================== EVERYDAY ENGLISH (10) ========================
  {
    id: 'col-greetings-first-meetings',
    title: 'Greetings, Introductions & Small Talk',
    domain: 'everyday',
    cefrLevels: ['A1', 'A2'],
    description: 'Essential polite openers, family introductions, and friendly check-ins for breaking the ice smoothly.',
    vocabularyIds: ['va1-hello', 'va1-goodbye', 'va1-please', 'va1-thank', 'va1-sorry', 'va1-name', 'va1-friend', 'va1-neighbor', 'va2-neighbor-verb', 'va2-apologize'],
    commonExpressions: [
      { expression: 'Nice to finally put a face to the name.', meaning: 'Warm greeting when meeting an online contact in person', example: 'Hi Minh, nice to finally put a face to the name!' },
      { expression: 'Excuse me, could you give me a quick hand?', meaning: 'Polite everyday request for brief help', example: 'Excuse me, could you give me a quick hand with this suitcase?' },
    ],
    collocationGroups: [
      { label: 'Warm Openings', items: ['warm greeting', 'first impression', 'exchange phone numbers'] },
      { label: 'Polite Apologies', items: ['sincerely apologize', 'excuse the delay', 'no worries at all'] },
    ],
    speakingApplications: [
      'Introduce yourself naturally in 30 seconds including hometown, work or study, and one hobby.',
      'Open polite small talk with a neighbor at a coffee shop or elevator.',
    ],
    writingApplications: [
      'Write friendly welcoming emails to new classmates or teammates.',
      'Send brief polite chat messages rescheduling coffee without sounding blunt.',
    ],
  },
  {
    id: 'col-daily-routines-time',
    title: 'Daily Routines, Schedules & Time Management',
    domain: 'everyday',
    cefrLevels: ['A1', 'A2'],
    description: 'Verbs, time expressions, and phrasal actions for talking effortlessly about mornings, weekends, and habits.',
    vocabularyIds: ['va1-morning', 'va1-afternoon', 'va1-evening', 'va1-today', 'va1-tomorrow', 'va1-yesterday', 'va1-weekend', 'va1-early', 'va1-late', 'va1-wake-up', 'va1-get-up', 'va2-routine'],
    commonExpressions: [
      { expression: 'I try to wind down by ten each evening.', meaning: 'Relax calmly before going to sleep', example: 'Putting my phone away helps me wind down before bed.' },
      { expression: 'It completely slipped my mind.', meaning: 'Natural apology for innocently forgetting a small task', example: 'Sorry I missed your message—it completely slipped my mind!' },
    ],
    collocationGroups: [
      { label: 'Daily Verbs', items: ['wake up early', 'stick to a routine', 'catch up on rest'] },
      { label: 'Time Markers', items: ['on weekdays', 'twice a week', 'first thing tomorrow'] },
    ],
    speakingApplications: [
      'Describe your ideal weekday morning vs. a relaxed Saturday schedule in IELTS Speaking Part 1.',
    ],
    writingApplications: [
      'Write a simple weekly study planner pairing 15-minute review slots with work hours.',
    ],
  },
  {
    id: 'col-food-dining-markets',
    title: 'Food, Fresh Markets & Restaurant Dining',
    domain: 'everyday',
    cefrLevels: ['A1', 'A2'],
    description: 'Ordering confidently at cafés, asking about ingredients or spice levels, and shopping at fresh markets.',
    vocabularyIds: ['va1-breakfast', 'va1-lunch', 'va1-dinner', 'va1-water', 'va1-coffee', 'va1-menu', 'va1-bill', 'va1-hungry', 'va1-thirsty', 'va2-fresh', 'va2-tasty', 'va2-spicy', 'va2-recipe', 'va2-ingredient'],
    commonExpressions: [
      { expression: 'Could we have the bill when you get a moment?', meaning: 'Natural polite restaurant phrasing to pay', example: 'Thank you—could we have the bill when you get a moment?' },
      { expression: 'Is there anything on the mild side?', meaning: 'Asking gently for non-spicy food recommendations', example: 'I love noodles, though is there anything on the mild side today?' },
    ],
    collocationGroups: [
      { label: 'Taste & Freshness', items: ['fresh seasonal fruit', 'savory broth', 'home-cooked meal'] },
      { label: 'Dining Actions', items: ['book a table', 'browse the menu', 'split the bill'] },
    ],
    speakingApplications: [
      'Role-play ordering dinner while checking dietary preferences clearly.',
    ],
    writingApplications: [
      'Write a short honest café review praising ambiance, service, and signature dishes.',
    ],
  },
  {
    id: 'col-home-neighborhood',
    title: 'Home Life, Rooms & Neighborhood Places',
    domain: 'everyday',
    cefrLevels: ['A1', 'A2'],
    description: 'Concrete household nouns, cozy spaces, and clear street landmarks for describing where you live.',
    vocabularyIds: ['va1-house', 'va1-home', 'va1-room', 'va1-kitchen', 'va1-bedroom', 'va1-bathroom', 'va1-window', 'va1-apartment', 'va1-garden', 'va1-street', 'va1-park', 'va2-bridge', 'va2-corner', 'va2-nearby'],
    commonExpressions: [
      { expression: 'It’s just a stone’s throw from the park.', meaning: 'Very close walking distance', example: 'Our bakery is just a stone’s throw from the bus stop.' },
      { expression: 'Feel right at home.', meaning: 'Warm hospitality inviting guests to relax', example: 'Please hang up your umbrella and feel right at home.' },
    ],
    collocationGroups: [
      { label: 'Home Comfort', items: ['sunlit balcony', 'quiet apartment', 'tidy up the desk'] },
      { label: 'Giving Directions', items: ['turn left at the corner', 'cross the footbridge', 'five minutes on foot'] },
    ],
    speakingApplications: [
      'Guide a visiting friend from the station to your apartment building clearly.',
    ],
    writingApplications: [
      'Write an appealing short neighborhood welcome note for a homestay exchange.',
    ],
  },
  {
    id: 'col-travel-transit-airports',
    title: 'Airports, Hotels & Smart City Transit',
    domain: 'everyday',
    cefrLevels: ['A2', 'B1'],
    description: 'Navigating check-in counters, customs delays, train platforms, and sightseeing itineraries calmly.',
    vocabularyIds: ['va1-bus', 'va1-train', 'va1-map', 'va1-ticket', 'va1-hotel', 'va2-airport', 'va2-passport', 'va2-departure', 'va2-arrival', 'va2-reservation', 'va2-delay', 'va2-suitcase', 'va2-platform', 'va2-itinerary'],
    commonExpressions: [
      { expression: 'Is there any update on the boarding gate?', meaning: 'Asking airport staff politely about departure changes', example: 'Excuse me, is there any update on the boarding gate for flight 402?' },
      { expression: 'I’d like to check in under Minh Nguyen.', meaning: 'Opening calmly at hotel reception', example: 'Good evening—I’d like to check in under Minh Nguyen.' },
    ],
    collocationGroups: [
      { label: 'Airports & Stays', items: ['confirm a reservation', 'window seat', 'complimentary breakfast'] },
      { label: 'City Transit', items: ['catch the express train', 'heavy traffic', 'local sightseeing'] },
    ],
    speakingApplications: [
      'Resolve a brief flight delay or luggage misplacement politely at a help desk.',
    ],
    writingApplications: [
      'Draft an inquiry email confirming late hotel check-in details.',
    ],
  },
  {
    id: 'col-shopping-money-consumer',
    title: 'Shopping, Fair Prices & Smart Refunds',
    domain: 'everyday',
    cefrLevels: ['A1', 'A2', 'B1'],
    description: 'Comparing value vs. price, asking about receipts or refunds, and discussing daily consumer budgets.',
    vocabularyIds: ['va1-buy', 'va1-sell', 'va1-market', 'va1-money', 'va1-price', 'va1-cheap', 'va1-expensive', 'va1-pay', 'va2-receipt', 'va2-discount', 'va2-exchange', 'va2-convenience-store', 'va2-change-money', 'vb1-affordable'],
    commonExpressions: [
      { expression: 'Does this come with a warranty or exchange policy?', meaning: 'Checking customer protection before purchasing', example: 'I like these headphones—does this come with an exchange policy?' },
      { expression: 'It’s well worth the price.', meaning: 'Good durable value even if not the cheapest', example: 'Solid canvas shoes cost more upfront, yet they’re well worth the price.' },
    ],
    collocationGroups: [
      { label: 'Smart Buying', items: ['keep the receipt', 'seasonal discount', 'fair refund policy'] },
      { label: 'Value Judgments', items: ['affordable option', 'compare prices', 'great value'] },
    ],
    speakingApplications: [
      'Politely return a wrong clothing size or defective charger with a receipt.',
    ],
    writingApplications: [
      'Write a clear polite customer service message requesting an exchange order.',
    ],
  },
  {
    id: 'col-health-body-pharmacy',
    title: 'Health, Pharmacy Visits & Everyday Wellness',
    domain: 'everyday',
    cefrLevels: ['A1', 'A2', 'B1'],
    description: 'Describing mild symptoms clearly at a pharmacy or clinic and talking about balanced sleep, exercise, and breathing.',
    vocabularyIds: ['va1-healthy', 'va1-sick', 'va1-doctor', 'va1-hospital', 'va1-head', 'va1-hand', 'va2-symptom', 'va2-fever', 'va2-headache', 'va2-cough', 'va2-pharmacy', 'va2-medicine', 'va2-breathe', 'va2-stretch'],
    commonExpressions: [
      { expression: 'I’ve had a sore throat since yesterday morning.', meaning: 'Timing a symptom naturally using Present Perfect', example: 'Doctor, I’ve had a slight fever and cough since Tuesday morning.' },
      { expression: 'Take it easy for a couple of days.', meaning: 'Warm advice to rest and recover', example: 'Drink warm water and take it easy over the weekend.' },
    ],
    collocationGroups: [
      { label: 'Symptoms & Care', items: ['mild headache', 'pick up a prescription', 'stay hydrated'] },
      { label: 'Daily Wellness', items: ['morning stretch', 'steady breathing', 'sound sleep'] },
    ],
    speakingApplications: [
      'Explain common cold symptoms and allergies accurately to a pharmacist.',
    ],
    writingApplications: [
      'Send a brief polite sick-leave note letting colleagues know how your tasks are covered.',
    ],
  },
  {
    id: 'col-weather-seasons-clothes',
    title: 'Weather Forecasts, Seasons & Dressing Well',
    domain: 'everyday',
    cefrLevels: ['A1', 'A2'],
    description: 'Checking forecasts, chatting naturally about seasonal weather shifts, and packing smart clothing layers.',
    vocabularyIds: ['va1-sunny', 'va1-rain', 'va1-windy', 'va1-cloudy', 'va1-hot', 'va1-cold', 'va1-spring', 'va1-summer', 'va1-autumn', 'va1-winter', 'va1-shirt', 'va1-jacket', 'va1-shoes', 'va2-forecast', 'va2-umbrella', 'va2-temperature'],
    commonExpressions: [
      { expression: 'Better bring an umbrella just in case.', meaning: 'Friendly practical warning about uncertain rain', example: 'The sky looks bright now, though better bring an umbrella just in case.' },
      { expression: 'It’s crisp and breezy out today.', meaning: 'Appreciating pleasant cool autumn air', example: 'Morning walks feel wonderful when it’s crisp and breezy out.' },
    ],
    collocationGroups: [
      { label: 'Sky & Air', items: ['heavy rain', 'check the forecast', 'mild temperature'] },
      { label: 'Packing Layers', items: ['light rain jacket', 'breathable cotton', 'comfortable walking shoes'] },
    ],
    speakingApplications: [
      'Compare your favorite season in northern vs. southern Vietnam naturally.',
    ],
    writingApplications: [
      'Write a weekend packing checklist tailored to mountain vs. beach weather.',
    ],
  },
  {
    id: 'col-hobbies-leisure-media',
    title: 'Hobbies, Music, Sports & Free-Time Stories',
    domain: 'everyday',
    cefrLevels: ['A1', 'A2', 'B1'],
    description: 'Expressing likes, artistic interests, concerts, exhibitions, and relaxed weekend passions warmly.',
    vocabularyIds: ['va1-sport', 'va1-music', 'va1-movie', 'va1-game', 'va1-swim', 'va1-cook', 'va1-photo', 'va2-hobby', 'va2-concert', 'va2-museum', 'va2-exhibition', 'va2-hang-out', 'va2-story', 'va2-popular'],
    commonExpressions: [
      { expression: 'I’ve recently gotten into watercolor sketching.', meaning: 'Sharing a fresh rewarding hobby', example: 'To stay off screens on Sundays, I’ve gotten into watercolor sketching.' },
      { expression: 'Nothing beats acoustic music after work.', meaning: 'Warm natural enthusiasm', example: 'After a busy week, nothing beats live acoustic music.' },
    ],
    collocationGroups: [
      { label: 'Leisure Life', items: ['visit an art exhibition', 'hang out with friends', 'snap photos'] },
      { label: 'Enthusiasm', items: ['eager to learn', 'unforgettable concert', 'relaxing weekend'] },
    ],
    speakingApplications: [
      'Deliver a lively 2-minute IELTS Part 2 talk about a favorite weekend outing.',
    ],
    writingApplications: [
      'Share an informal pen-pal paragraph recommending a local museum or street performance.',
    ],
  },
  {
    id: 'col-emotions-personality-bonds',
    title: 'Feelings, Personalities & Supportive Friendships',
    domain: 'everyday',
    cefrLevels: ['A2', 'B1'],
    description: 'Adjectives moving beyond simple "happy/sad" toward grateful, curious, patient, generous, and anxious.',
    vocabularyIds: ['va1-happy', 'va1-sad', 'va1-excited', 'va2-relaxed', 'va2-anxious', 'va2-confident', 'va2-generous', 'va2-honest', 'va2-polite', 'va2-patient-adj', 'va2-grateful', 'va2-proud', 'va2-curious', 'vb2-empathy'],
    commonExpressions: [
      { expression: 'I really appreciate you taking the time to explain that.', meaning: 'Sincere specific thank-you', example: 'Thanks, Linh—I really appreciate you checking my essay calmly.' },
      { expression: 'Don’t be too hard on yourself.', meaning: 'Kind encouragement after someone slips up', example: 'Everyone mixes up articles at first—don’t be too hard on yourself.' },
    ],
    collocationGroups: [
      { label: 'Warm Character', items: ['generous spirit', 'calm listener', 'deeply grateful'] },
      { label: 'Quiet Support', items: ['boost confidence', 'show empathy', 'share honest feedback'] },
    ],
    speakingApplications: [
      'Describe a mentor or close friend you genuinely admire using concrete behavioral examples.',
    ],
    writingApplications: [
      'Compose a thoughtful thank-you card noting a specific helpful kindness.',
    ],
  },

  // ======================== ACADEMIC ENGLISH (6) ========================
  {
    id: 'col-academic-research-evidence',
    title: 'Academic Research, Evidence & Verification',
    domain: 'academic',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Core verbs and nouns used across university papers to cite studies, weigh reliability, and avoid claims without proof.',
    vocabularyIds: ['vb1-research', 'vb1-survey', 'vb1-evidence', 'vb1-demonstrate', 'vb1-analyze', 'vb1-evaluate', 'vb1-confirm-b1', 'vb1-reliable-evidence', 'vb1-cite', 'vb2-hypothesis', 'vb2-empirical', 'vb2-methodology', 'vc1-corroborate', 'vc1-substantiate'],
    commonExpressions: [
      { expression: 'Empirical evidence strongly suggests that...', meaning: 'Introducing cautious proof without exaggeration', example: 'Empirical evidence suggests daily brief review outlasts weekend cramming.' },
      { expression: 'However, independent trials cast doubt on this claim.', meaning: 'Challenging weak findings politely', example: 'Early anecdotes looked shiny; however, independent trials cast doubt on that claim.' },
    ],
    collocationGroups: [
      { label: 'Research Actions', items: ['conduct a longitudinal survey', 'verify primary data', 'corroborate findings'] },
      { label: 'Evidence Quality', items: ['credible peer-reviewed source', 'empirical test', 'methodology limit'] },
    ],
    speakingApplications: [
      'Defend a seminar conclusion while calmly acknowledging sample limitations.',
    ],
    writingApplications: [
      'Synthesize two contrasting studies smoothly in a university literature review.',
    ],
  },
  {
    id: 'col-academic-argument-hedging',
    title: 'Logical Argumentation, Hedging & Rebuttal',
    domain: 'academic',
    cefrLevels: ['B2', 'C1', 'C2'],
    description: 'Discourse verbs and nuanced qualifiers for conceding counter-arguments and rebutting flaws gracefully.',
    vocabularyIds: ['vb1-argument', 'vb1-claim', 'vb2-justify', 'vb2-refute', 'vb2-acknowledge', 'vb2-plausible', 'vb2-contradict', 'vc1-pragmatic-concede', 'vc1-contend', 'vc1-cogent', 'vc1-fallacious', 'vc1-premise', 'vc1-tenuous', 'vc2-specious'],
    commonExpressions: [
      { expression: 'While proponents rightly point out..., they overlook...', meaning: 'Balanced concession-and-rebuttal transition', example: 'While proponents point out app convenience, they overlook passive scroll distraction.' },
      { expression: 'This assumption rests on a questionable premise.', meaning: 'Pinpointing a root logical weakness cleanly', example: 'Grading effort solely by screen hours rests on a questionable premise.' },
    ],
    collocationGroups: [
      { label: 'Logical Weight', items: ['cogent thesis', 'sound reasoning', 'tenuous link'] },
      { label: 'Debate Moves', items: ['concede a valid caveat', 'refute myth empirically', 'spot fallacies'] },
    ],
    speakingApplications: [
      'Respond diplomatically to a counter-argument in academic panel Q&A.',
    ],
    writingApplications: [
      'Craft cohesive body paragraphs balanced between fairness and crisp persuasion.',
    ],
  },
  {
    id: 'col-science-biology-ecology',
    title: 'Environmental Science, Ecosystems & Climate Solutions',
    domain: 'academic',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Essential science terms covering biodiversity, carbon sequestration, coastal resilience, and green energy transitions.',
    vocabularyIds: ['vb1-environment', 'vb1-renewable', 'vb1-pollution', 'vb1-habitat', 'vb1-sustainable-b1', 'vb1-biodiversity', 'vb1-ecosystem', 'vb1-emission', 'vb2-mitigate', 'vb2-deplete', 'vb2-replenish', 'vc1-anthropogenic', 'vc1-sequester', 'vc1-symbiotic'],
    commonExpressions: [
      { expression: 'Peatlands and mangroves sequester carbon at remarkable density.', meaning: 'Describing natural climate buffers precisely', example: 'Protecting coastal wetlands sequesters carbon while sheltering fishing villages.' },
      { expression: 'Clean power alone must pair with cutting wasteful consumption.', meaning: 'Pairing supply and demand policy cleanly', example: 'Green electricity must pair with cutting standby building heat waste.' },
    ],
    collocationGroups: [
      { label: 'Climate Dynamics', items: ['mitigate flood impact', 'curb industrial emissions', 'anthropogenic warming'] },
      { label: 'Living Habitats', items: ['biodiversity sanctuary', 'symbiotic soil fungi', 'indigenous flora'] },
    ],
    speakingApplications: [
      'Discuss urban heat adaptation and protected wetlands smoothly in IELTS Part 3.',
    ],
    writingApplications: [
      'Write a cause-and-solution essay on sustainable city transport and canopy shade.',
    ],
  },
  {
    id: 'col-psychology-cognition-learning',
    title: 'Psychology, Memory Science & Effective Study',
    domain: 'academic',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Terminology from cognitive psychology describing retention, neuroplasticity, focus, and intrinsic motivation.',
    vocabularyIds: ['va2-memory', 'vb1-retain', 'vb1-concentrate', 'vb1-distraction', 'vb1-motivation', 'vb1-curiosity', 'vb2-cognition', 'vb2-retention', 'vb2-proficiency', 'vb2-intuition', 'vc1-intrinsic', 'vc1-neuroplasticity', 'vc1-mnemonic'],
    commonExpressions: [
      { expression: 'Active retrieval outperforms passive rereading over the long run.', meaning: 'Explaining proven study science concisely', example: 'Quizzing yourself beats highlighting ten pages three times passively.' },
      { expression: 'Sleep consolidates daytime memory traces effortlessly.', meaning: 'Connecting rest with retention naturally', example: 'Restful sleep consolidates delicate new vocabulary connections cleanly.' },
    ],
    collocationGroups: [
      { label: 'Memory & Attention', items: ['spaced retention', 'deep concentration', 'resist distractions'] },
      { label: 'Learning Mindset', items: ['intrinsic curiosity', 'adult neuroplasticity', 'helpful mnemonic'] },
    ],
    speakingApplications: [
      'Explain your own personal learning strategies during job interviews or tutoring talks.',
    ],
    writingApplications: [
      'Summarize cognitive findings on micro-habits vs. weekend cramming cleanly.',
    ],
  },
  {
    id: 'col-linguistics-phonetics-style',
    title: 'Linguistics, Phonetics, Register & Literary Craft',
    domain: 'academic',
    cefrLevels: ['B1', 'B2', 'C1', 'C2'],
    description: 'Metalanguage for analyzing pronunciation stress, conversational pragmatics, formal register, and figurative nuance.',
    vocabularyIds: ['vb1-context', 'vb1-register', 'vb1-tone', 'vb1-intonation', 'vb1-rhythm', 'vb1-syllable', 'vb2-nuance', 'vc1-denote', 'vc1-connote', 'vc1-nuance-pragmatics', 'vc1-phonology', 'vc1-colloquial', 'vc1-euphemism', 'vc1-vernacular'],
    commonExpressions: [
      { expression: 'Word choice shifts sharply depending on listener register.', meaning: 'Noting formal vs. friendly tone choices', example: '"Respond" fits formal notices, while "write back" warms friendly texts.' },
      { expression: 'Intonation often reveals more subtext than printed grammar.', meaning: 'Explaining prosody in spoken English', example: 'Rising hesitation tunes change polite offers completely.' },
    ],
    collocationGroups: [
      { label: 'Spoken Craft', items: ['sentence stress rhythm', 'natural prosody', 'connected syllable linking'] },
      { label: 'Meaning & Tone', items: ['emotional connotation', 'colloquial idiom', 'subtle irony'] },
    ],
    speakingApplications: [
      'Self-correct your own stress timing gracefully when reading complex prose aloud.',
    ],
    writingApplications: [
      'Adapt the same core announcement smoothly for formal press vs. friendly community notes.',
    ],
  },
  {
    id: 'col-data-statistics-charts',
    title: 'Statistics, Trends & Data Literacy',
    domain: 'academic',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Essential trend verbs, measurement nouns, and chart-reading vocabulary for data briefings and IELTS Task 1.',
    vocabularyIds: ['vb1-trend', 'vb1-average', 'vb1-percentage', 'vb1-figure', 'vb1-decline', 'vb2-fluctuate', 'vb2-surge', 'vb2-plummet', 'vb2-plateau', 'vb2-proportion', 'vb2-margin', 'vc1-anomaly', 'vc1-extrapolate', 'vc2-spurious'],
    commonExpressions: [
      { expression: 'While ridership initially surged, growth reached a steady plateau by June.', meaning: 'Describing classic chart trajectories accurately', example: 'After doubling in spring, commuter trips settled onto a steady summer plateau.' },
      { expression: 'Always inspect axis units before drawing dramatic comparisons.', meaning: 'Preventing visual chart misreading', example: 'Trimmed vertical axes easily exaggerate tiny fluctuations into false spikes.' },
    ],
    collocationGroups: [
      { label: 'Sharp Shifts', items: ['surge dramatically', 'plummet sharply', 'minor anomaly'] },
      { label: 'Measurement', items: ['margin of error', 'growing proportion', 'weighted average'] },
    ],
    speakingApplications: [
      'Walk a teammate verbally through three key takeaways from a weekly quiz dashboard.',
    ],
    writingApplications: [
      'Produce crystal-clear 170-word IELTS Academic Task 1 overview and detail paragraphs.',
    ],
  },

  // ======================== PROFESSIONAL ENGLISH (7) ========================
  {
    id: 'col-workplace-meetings-updates',
    title: 'Workplace Meetings, Deadlines & Clear Alignment',
    domain: 'professional',
    cefrLevels: ['A2', 'B1', 'B2'],
    description: 'Everyday office vocabulary for running brisk agendas, rescheduling smoothly, and confirming next owners clearly.',
    vocabularyIds: ['va2-colleague', 'va2-manager', 'va2-meeting', 'va2-deadline', 'va2-reschedule', 'va2-confirm', 'va2-attach', 'va2-presentation', 'vb1-coordinate', 'vb1-prioritize', 'vb1-ahead-of-schedule', 'vb1-meet-a-deadline', 'vb1-agenda', 'vb2-compromise-b2'],
    commonExpressions: [
      { expression: 'Let’s double-check that everyone is on the same page before wrapping up.', meaning: 'Aligning action owners warmly at meeting close', example: 'Great call—let’s make sure we’re on the same page on Friday’s handoff.' },
      { expression: 'Could we push Tuesday’s sync back thirty minutes?', meaning: 'Polite schedule tweak request', example: 'Hi An, an urgent review popped up—could we move Tuesday’s sync to ten?' },
    ],
    collocationGroups: [
      { label: 'Meeting Flow', items: ['circulate the agenda', 'confirm action items', 'reach consensus'] },
      { label: 'Deadline Poise', items: ['ahead of schedule', 'flag early blockers', 'confirm attachment'] },
    ],
    speakingApplications: [
      'Chair a concise 10-minute stand-up sync with polite turn-taking and explicit owner recaps.',
    ],
    writingApplications: [
      'Send crisp recap notes separating decisions made from pending open questions.',
    ],
  },
  {
    id: 'col-career-interviews-growth',
    title: 'Career Growth, Interviews & Constructive Mentorship',
    domain: 'professional',
    cefrLevels: ['B1', 'B2'],
    description: 'Showcasing real experience, asking smart interview questions, and accepting or giving candid helpful feedback.',
    vocabularyIds: ['va2-interview', 'va2-salary', 'va2-experience', 'va2-skill', 'vb1-qualify', 'vb1-candidate', 'vb1-resume', 'vb1-feedback', 'vb1-constructive', 'vb1-mentor', 'vb1-promote', 'vb2-competence', 'vb2-asset', 'vb2-conscientious'],
    commonExpressions: [
      { expression: 'What does success look like during the first ninety days?', meaning: 'Thoughtful candidate interview question', example: 'For someone stepping into this coordinator role, what matters most in month three?' },
      { expression: 'One strength I’ve built deliberately is...', meaning: 'Concrete STAR interview framing', example: 'One strength I’ve built deliberately is catching hidden ambiguity in project specs.' },
    ],
    collocationGroups: [
      { label: 'Career Momentum', items: ['tailor a resume', 'constructive feedback', 'valuable team asset'] },
      { label: 'Work Ethic', items: ['proactive ownership', 'steady competence', 'dependable teammate'] },
    ],
    speakingApplications: [
      'Answer behavioral interview prompts clearly using Situation-Action-Result examples.',
    ],
    writingApplications: [
      'Write a focused cover letter linking two verified accomplishments directly to job needs.',
    ],
  },
  {
    id: 'col-project-management-ops',
    title: 'Project Delivery, Milestones & Risk Management',
    domain: 'professional',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Managing deliverables, delegating work, spotting bottlenecks early, and evaluating operational feasibility.',
    vocabularyIds: ['vb1-milestone', 'vb1-strategy', 'vb1-outcome', 'vb1-efficient-b1', 'vb2-allocate', 'vb2-delegate', 'vb2-stakeholder', 'vb2-feasibility', 'vb2-deliverable', 'vb2-bottleneck', 'vb2-benchmark', 'vb2-implement', 'vc1-trajectory-scope', 'vc2-tractable'],
    commonExpressions: [
      { expression: 'Splitting this milestone into independent deliverables avoids downstream bottlenecks.', meaning: 'Scoping engineering or content batches smartly', example: 'Let’s release Milestone 1 verified cleanly before launching Phase 2 audio.' },
      { expression: 'Let’s flag potential scope creep early.', meaning: 'Protecting project timelines kindly', example: 'That redesign looks nice later, yet let’s protect current milestone scope first.' },
    ],
    collocationGroups: [
      { label: 'Execution Control', items: ['hit key milestones', 'delegate clearly', 'clear bottlenecks'] },
      { label: 'Planning', items: ['assess feasibility', 'reallocate resources', 'set measurable benchmarks'] },
    ],
    speakingApplications: [
      'Brief executive stakeholders clearly on three risks and exact mitigation steps.',
    ],
    writingApplications: [
      'Author a structured project status memo using status lights, facts, and blockers.',
    ],
  },
  {
    id: 'col-software-ai-engineering',
    title: 'Software Architecture, AI Systems & Reliability',
    domain: 'professional',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Modern engineering terms covering modular architecture, latency, validation, privacy ethics, and automated testing.',
    vocabularyIds: ['vb1-software', 'vb1-database', 'vb1-privacy', 'vb1-security', 'vb2-architecture', 'vb2-algorithm', 'vb2-deploy', 'vb2-interface', 'vb2-latency', 'vb2-artificial-intelligence', 'vb2-bias', 'vb2-optimize', 'vb2-modular', 'vc1-stochastic'],
    commonExpressions: [
      { expression: 'Lazy-loading heavy content preserves crisp startup latency.', meaning: 'Explaining bundle performance calmly', example: 'Dynamic imports split CEFR modules so startup stay lightweight on older phones.' },
      { expression: 'Deterministic schema checks catch regressions before code ships.', meaning: 'Articulating QA automation clearly', example: 'Running automated unique-ID tests catches duplicates long before merge.' },
    ],
    collocationGroups: [
      { label: 'System Craft', items: ['modular architecture', 'backward compatible', 'low mobile latency'] },
      { label: 'Trust & AI', items: ['mitigate algorithmic bias', 'explicit user consent', 'encrypted storage'] },
    ],
    speakingApplications: [
      'Explain a subtle production performance improvement cleanly to non-technical teammates.',
    ],
    writingApplications: [
      'Write concise pull-request descriptions detailing design choices, tradeoffs, and verification tests.',
    ],
  },
  {
    id: 'col-business-economics-finance',
    title: 'Business Strategy, Markets & Financial Clarity',
    domain: 'professional',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Essential financial, budgeting, consumer, and macroeconomic concepts for global business discussions.',
    vocabularyIds: ['vb1-budget', 'vb1-invest', 'vb1-profit', 'vb1-consumer', 'vb1-marketing', 'vb2-incentive', 'vb2-inflation', 'vb2-revenue', 'vb2-expenditure', 'vb2-viable', 'vb2-entrepreneur', 'vb2-asset', 'vb2-liability', 'vc1-volatile'],
    commonExpressions: [
      { expression: 'Operating revenue stabilized even while raw material prices stayed volatile.', meaning: 'Summarizing quarterly market resilience', example: 'Smart forward purchasing stabilized margins amid volatile grain costs.' },
      { expression: 'Recurring learner trust beats quick unsustainable promos.', meaning: 'Championing long-term unit value', example: 'Generous educational quality creates durable trust without noisy flash sales.' },
    ],
    collocationGroups: [
      { label: 'Financial Health', items: ['healthy cash liquidity', 'profit margin', 'balanced fiscal plan'] },
      { label: 'Growth Levers', items: ['economically viable', 'social entrepreneur', 'sustainable revenue'] },
    ],
    speakingApplications: [
      'Present a balanced 3-minute neighborhood coffee-roastery expansion pitch.',
    ],
    writingApplications: [
      'Summarize quarterly sales tradeoffs in a clean two-paragraph executive brief.',
    ],
  },
  {
    id: 'col-negotiation-ethics-law',
    title: 'Negotiation, Contracts, Copyright & Integrity',
    domain: 'professional',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Navigating compromises fairly, respecting copyright and jurisdiction rules, and upholding ethical standards.',
    vocabularyIds: ['vb1-compromise', 'vb1-clarify', 'vb1-negotiate', 'vb1-ethical', 'vb2-comply', 'vb2-patent', 'vb2-copyright', 'vb2-jurisdiction', 'vb2-legitimate', 'vc1-integrity', 'vc1-candid', 'vc1-caveat', 'vc2-probity', 'vc2-tacit'],
    commonExpressions: [
      { expression: 'Let’s make our licensing caveat completely explicit in writing.', meaning: 'Preventing copyright confusion clearly', example: 'Document every third-party curriculum link with clear explicit attribution.' },
      { expression: 'Both sides moved away from an impasse once incentives aligned.', meaning: 'Describing mature diplomatic compromise', example: 'Transparent terms turned a pricing stalemate into a win-win renewal.' },
    ],
    collocationGroups: [
      { label: 'Fair Dealing', items: ['reach a fair compromise', 'honor copyright licenses', 'comply with local law'] },
      { label: 'Trust Culture', items: ['above ethical reproach', 'candid transparency', 'scrupulous accuracy'] },
    ],
    speakingApplications: [
      'Negotiate fair milestone timelines between design and engineering constraints calmly.',
    ],
    writingApplications: [
      'Write clear community terms clarifying attribution and open educational usage cleanly.',
    ],
  },
  {
    id: 'col-leadership-team-culture',
    title: 'Collaborative Leadership & Cross-Cultural Poise',
    domain: 'professional',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Encouraging proactive teamwork, mentoring learners gently, and building warm cross-cultural rapport.',
    vocabularyIds: ['vb1-inspire', 'vb1-overcome', 'vb1-trust', 'vb1-fluent-b1', 'vb2-collaborate-b2', 'vb2-foster', 'vb2-embrace', 'vb2-resilient', 'vb2-accountable-adj', 'vc1-leverage-rapport', 'vc1-accountability-stewardship', 'vc1-emulate', 'vc2-magnanimity'],
    commonExpressions: [
      { expression: 'Great mentors build shared autonomy rather than permanent dependence.', meaning: 'Empowering teammates and learners', example: 'Good study tools build confidence so learners step forward bravely on their own.' },
      { expression: 'Diverse accents bring complementary richness to global calls.', meaning: 'Warmly respecting world Englishes', example: 'Clear pacing and active listening help multicultural calls run smoothly.' },
    ],
    collocationGroups: [
      { label: 'Leading Well', items: ['foster collaboration', 'build genuine rapport', 'take accountable ownership'] },
      { label: 'Culture Craft', items: ['multicultural team', 'shared stewardship', 'quiet candor'] },
    ],
    speakingApplications: [
      'Facilitate an inclusive group brainstorm ensuring quiet contributors get heard warmly.',
    ],
    writingApplications: [
      'Draft an appreciative project retrospective highlighting specific contributions fairly.',
    ],
  },

  // ======================== IELTS & ADVANCED MASTERY (7) ========================
  {
    id: 'col-ielts-urbanization-society',
    title: 'IELTS Core: Urbanization, Housing & Public Transit',
    domain: 'ielts_advanced',
    cefrLevels: ['B2', 'C1'],
    description: 'High-scoring lexical resources for essays and discussions on city density, commuter infrastructure, and green neighborhoods.',
    vocabularyIds: ['vb1-urban', 'vb2-urbanization', 'vb2-infrastructure', 'vb2-congestion', 'vb1-affordable', 'vb2-infrastructure-transit', 'vb2-pedestrian', 'vb2-density', 'vb2-metropolitan', 'vb2-suburban', 'vb2-curtail', 'vc1-disproportionate', 'vc1-repercussion', 'vc2-precipitate'],
    commonExpressions: [
      { expression: 'Prioritizing dedicated tram and bike corridors curbs peak-hour congestion more durably than widening lanes.', meaning: 'High-band IELTS Task 2 thesis point', example: 'High-frequency light rail reduces commute emissions while reviving neighborhood shops.' },
      { expression: 'Outer suburbs suffer disproportionately when transit planning lags behind housing.', meaning: 'Nuanced equity observation', example: 'Families living farther out lose daily study and work hours to erratic bus waits.' },
    ],
    collocationGroups: [
      { label: 'City Systems', items: ['ease chronic congestion', 'pedestrian-first streets', 'metropolitan transit network'] },
      { label: 'Housing Balance', items: ['rising living costs', 'suburban connectivity', 'green public plazas'] },
    ],
    speakingApplications: [
      'Compare livable walkable neighborhoods vs. car-centric sprawls cleanly in IELTS Part 3.',
    ],
    writingApplications: [
      'Achieve Band 7.5+ Lexical Resource on urban transport and housing affordability prompts.',
    ],
  },
  {
    id: 'col-ielts-education-technology',
    title: 'IELTS Core: Education, Equity & Digital Literacy',
    domain: 'ielts_advanced',
    cefrLevels: ['B2', 'C1'],
    description: 'Comparing classroom depth with mobile tools, safeguarding learner focus, and narrowing unequal access gaps.',
    vocabularyIds: ['vb2-prerequisite', 'vb2-proficiency-benchmark', 'vb2-autonomy', 'vb2-curriculum-align', 'vb2-facilitate', 'vb2-cultivate', 'vb2-disparity', 'vc1-disparity-gap', 'vc1-conducive', 'vc1-detrimental', 'vc1-ubiquitous', 'vc1-extrinsic', 'vc2-efficacious'],
    commonExpressions: [
      { expression: 'Digital tools facilitate access yet cannot replace skilled human mentorship.', meaning: 'Balanced Band 8 essay stance', example: 'Interactive quizzes reinforce daily recall while warm teachers sustain curiosity.' },
      { expression: 'Reliable offline availability promotes genuine educational equity.', meaning: 'Policy fairness perspective', example: 'Compact downloaded lessons keep rural students progressing regardless of Wi-Fi drops.' },
    ],
    collocationGroups: [
      { label: 'Teaching Depth', items: ['conducive to deep study', 'build learner autonomy', 'essential prerequisite'] },
      { label: 'System Equity', items: ['close access disparities', 'support active recall', 'cultivate lifelong curiosity'] },
    ],
    speakingApplications: [
      'Discuss pros and drawbacks of homework apps vs. group projects fluidly.',
    ],
    writingApplications: [
      'Evaluate how online tools support traditional classrooms without diminishing human bond.',
    ],
  },
  {
    id: 'col-ielts-public-health-society',
    title: 'IELTS Core: Preventative Health & Active Living',
    domain: 'ielts_advanced',
    cefrLevels: ['B2', 'C1'],
    description: 'Precision vocabulary addressing sedentary urban work, preventative care, seasonal stress, and health equity.',
    vocabularyIds: ['vb2-preventive', 'vb2-nutrition', 'vb2-sedentary', 'vb2-chronic', 'vb2-immune', 'vb2-fatigue', 'vb2-rehab-verb', 'vc1-epidemic-health', 'vc1-pathogen', 'vc1-prognosis', 'vb2-alleviate', 'vc2-debilitate', 'vc2-salubrious', 'vc2-indolent'],
    commonExpressions: [
      { expression: 'Investing in walkable parks proves far cheaper than treating chronic sedentary illnesses later.', meaning: 'Strong cause-and-prevention argument', example: 'Shaded community paths yield lasting preventative dividends across every age bracket.' },
      { expression: 'Consistent sleep hygiene shields mental resilience during demanding terms.', meaning: 'Linking rest to student outcomes', example: 'Cutting late caffeine improves both exam concentration and emotional poise.' },
    ],
    collocationGroups: [
      { label: 'Prevention Policy', items: ['preventative public health', 'ease chronic strain', 'build walkable greenery'] },
      { label: 'Clinical Precision', items: ['early diagnosis', 'favorable long-term prognosis', 'alleviate workplace stress'] },
    ],
    speakingApplications: [
      'Answer Part 3 questions on government sugar taxes vs. sports subsidies smoothly.',
    ],
    writingApplications: [
      'Frame balanced public-health policy essays with natural formal collocations.',
    ],
  },
  {
    id: 'col-highband-cohesion-connectors',
    title: 'Cohesion Toolkit: Formal Transitions & Academic Signposting',
    domain: 'ielts_advanced',
    cefrLevels: ['B1', 'B2', 'C1', 'C2'],
    description: 'High-precision linking words ("nonetheless", "conversely", "albeit", "thereby", "whereby") used accurately without stiffness.',
    vocabularyIds: ['vb1-furthermore', 'vb1-moreover', 'vb1-nevertheless', 'vb1-whereas', 'vb2-consequently', 'vb2-nonetheless', 'vb2-conversely', 'vb2-predominantly', 'vb2-substantially', 'vc1-albeit', 'vc1-notwithstanding', 'vc1-whereby', 'vc1-thereby', 'vc1-insofar-as'],
    commonExpressions: [
      { expression: 'Early gains felt modest, albeit steady—thereby building quiet daily confidence.', meaning: 'Using "albeit" + "thereby" naturally inside one crisp sentence', example: 'Solar panel costs dropped fast, albeit irregularly—thereby widening rural adoption.' },
      { expression: 'Spaced review lifts retention; conversely, marathon cramming accelerates forgetting.', meaning: 'Clean semicolon contrast linking', example: 'Visual diagrams speed clarity; conversely, cramped walls of text tire eyes quickly.' },
    ],
    collocationGroups: [
      { label: 'Contrast Links', items: ['whereas + full clause', 'albeit + phrase/adj', 'nonetheless + sentence'] },
      { label: 'Cause & Mechanism', items: ['thereby + -ing participle', 'system whereby + clause', 'consequently, trends shifted'] },
    ],
    speakingApplications: [
      'Keep formal transitions natural in speech by pairing shorter anchors like "even so" and "by contrast".',
    ],
    writingApplications: [
      'Replace mechanical "Firstly/Secondly/Finally" lists with organic logical flow.',
    ],
  },
  {
    id: 'col-phrasal-verbs-power-pack',
    title: 'Everyday-to-Academic Phrasal Verbs Mastery',
    domain: 'ielts_advanced',
    cefrLevels: ['B1', 'B2', 'C1'],
    description: 'Natural multi-word verbs that give English idiomatic warmth in speaking and concise precision in essays.',
    vocabularyIds: ['vb1-carry-out', 'vb1-figure-out', 'vb1-come-up-with', 'vb1-put-off', 'vb1-get-along', 'vb2-bring-about', 'vb2-account-for', 'vb2-stem-from', 'vb2-phase-out', 'vb2-rule-out', 'vb2-back-up', 'vb2-weigh-up', 'vc1-boil-down-to', 'vc1-iron-out'],
    commonExpressions: [
      { expression: 'Clean urban buses accounted for nearly half the drop in street particulate soot.', meaning: 'Essential data/essay phrasal verb', example: 'Renewables accounted for 40% of new autumn power installations.' },
      { expression: 'Let’s iron out those last two edge cases before lunch.', meaning: 'Warm agile workplace phrasal verb', example: 'Ten minutes of review ironed out all remaining date formatting glitches.' },
    ],
    collocationGroups: [
      { label: 'Causal & Analytic', items: ['stem from habit', 'bring about reform', 'rule out alternatives'] },
      { label: 'Action & Follow-Through', items: ['carry out an audit', 'back up every claim', 'phase out fossil fuels'] },
    ],
    speakingApplications: [
      'Upgrade repetitive single Latin verbs ("investigate/reduce/solve") with natural phrasal verbs in IELTS Speaking.',
    ],
    writingApplications: [
      'Blend precise semi-formal phrasal verbs like "account for" and "phase out" neatly into essays.',
    ],
  },
  {
    id: 'col-idioms-metaphors-natural',
    title: 'Tasteful Idioms & Nuanced Figurative Expressions',
    domain: 'ielts_advanced',
    cefrLevels: ['B2', 'C1', 'C2'],
    description: 'Modern natural idioms that sound sharp rather than cliché—plus when formal writing prefers clear literal prose.',
    vocabularyIds: ['vb1-piece-of-cake', 'vb1-break-the-ice', 'vb1-broaden-horizons', 'vb2-double-edged', 'vb2-food-for-thought', 'vb2-silver-lining', 'vb2-tip-iceberg', 'vb2-go-hand-in-hand', 'vc1-turn-blind-eye', 'vc1-bear-fruit', 'vc1-steer-clear-of', 'vc2-watershed-moment', 'vc2-cut-gordian-knot', 'vc2-separate-wheat'],
    commonExpressions: [
      { expression: 'Automation is often a double-edged sword: freeing time while risking shallow shortcuts.', meaning: 'Natural balanced evaluation idiom', example: 'Quick AI summaries can be a double-edged sword if students stop reading deep prose.' },
      { expression: 'Consistent reading and strong speaking fluency go hand in hand.', meaning: 'Expressing mutual reinforcement naturally', example: 'Clean audio exposure and crisp pronunciation go hand in hand.' },
    ],
    collocationGroups: [
      { label: 'Balanced Evaluation', items: ['a double-edged sword', 'only the tip of the iceberg', 'a watershed moment'] },
      { label: 'Wisdom & Craft', items: ['bear fruit over time', 'steer clear of clichés', 'pass strict muster'] },
    ],
    speakingApplications: [
      'Weave 1–2 genuine context-matched idioms smoothly into IELTS Speaking Parts 2–3 without forcing them.',
    ],
    writingApplications: [
      'Keep academic essays crisp—reserve picturesque idioms for journalism, op-eds, or creative reflections.',
    ],
  },
  {
    id: 'col-c2-critical-rhetoric-ethics',
    title: 'C2 Rhetoric, Critical Discernment & Scholarly Polish',
    domain: 'ielts_advanced',
    cefrLevels: ['C1', 'C2'],
    description: 'High-precision vocabulary separating lucid rigor from specious spin, jargon obfuscation, and empty platitudes.',
    vocabularyIds: ['vc2-elucidate', 'vc2-incisive', 'vc2-pellucid', 'vc2-obfuscate', 'vc2-disingenuous', 'vc2-platitude', 'vc2-esoteric', 'vc2-laconic', 'vc2-epistemology', 'vc2-erudite', 'vc2-veracious', 'vc2-verbose', 'vc2-turgid', 'vc2-incontrovertible', 'vc2-sine-qua-non'],
    commonExpressions: [
      { expression: 'Genuine erudition illuminates hard truths clearly rather than hiding behind obfuscation.', meaning: 'Principle of transparent scholarly writing', example: 'Pellucid explanation remains harder—and infinitely kinder—than verbose jargon.' },
      { expression: 'Independent corroboration turns plausible hypotheses into incontrovertible history.', meaning: 'Standard of proof statement', example: 'Matched carbon dating transformed coastal trade conjecture into solid consensus.' },
    ],
    collocationGroups: [
      { label: 'Clear Craft', items: ['pellucid academic prose', 'incisive rebuttal', 'laconic dry wit'] },
      { label: 'Diagnosing Flaws', items: ['cut through obfuscation', 'reject empty platitudes', 'expose spurious noise'] },
    ],
    speakingApplications: [
      'Deliver calm, understated executive summaries without sounding pompous or overly rehearsed.',
    ],
    writingApplications: [
      'Edit graduate dissertations, policy critiques, and literary essays to C2 editorial polish.',
    ],
  },
];
