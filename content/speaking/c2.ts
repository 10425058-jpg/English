import type { SpeakingLesson } from '@english-quest/shared';
import { createSpeakingLesson } from './helpers';

export const C2_SPEAKING_LESSONS: SpeakingLesson[] = [
  createSpeakingLesson({
    id: 'spk-m2-c2-01',
    title: 'Sophisticated Seminar Defense: AI Co-Authorship, Voice & Intellectual Ownership',
    activityType: 'debate_defense',
    category: 'academic_discussion',
    cefrLevel: 'C2',
    prompt: 'Deliver a poised 75-second seminar response dissecting where automated writing assistants empower clear thinking vs. subtly flattening authentic personal voice and analytical rigor.',
    promptVi: 'Phản biện học thuật sắc bén trong 75 giây về ranh giới giữa việc dùng trợ lý viết AI hỗ trợ mạch tư duy và nguy cơ làm phẳng mất giọng văn cá nhân cùng chiều sâu phân tích.',
    objectives: [
      'Articulate fine philosophical distinctions cleanly using idiomatic precision ("frictionless polish", "homogenized cadence").',
      'Balance practical democratization of clarity against epistemic atrophy cleanly.',
    ],
    preparationQuestions: ['When does struggling through awkward rough drafts actually refine what you truly believe?', 'How does outsourced syntax differ from structural editorial critique?'],
    modelText: 'Reducing automated drafting tools into a simplistic "helpful calculator vs forbidden crutch" debate misses the subtlest hazard: frictionless fluency occasionally substitutes smooth rhythm for genuinely tested conviction. Writing awkwardly through clunky first paragraphs isn’t merely cosmetic tidying; wrestling imprecise verbs into reluctant order often exposes hidden contradictions inside our own reasoning! When writers offload early structural struggle entirely to statistical averages, prose certainly gains sleek surface polish—yet acquires a curiously bloodless, homogenized cadence stripped of lived oddity and hard-earned skepticism. Conversely, using clean tools strictly AFTER wrestling rough raw theses onto paper—akin to sparring with an unsentimental copy-editor who tests weak transitions—accelerates clarity cleanly without surrendering intellectual authorship.',
    modelComparisonByLevel: {
      basic: 'AI fixes grammar fast, which helps non-native writers, yet trusting full drafts stops people thinking deep or keeping unique style.',
      natural: 'Framing writing helpers strictly as simple time-savers misses how messy rough drafting clarifies real thinking! Outsourcing first-draft struggle yields polished yet slightly uniform voice. Keeping messy human drafting first and consulting tools mainly like a sharp editor protects genuine conviction.',
      advanced: 'Constraining inquiry strictly around efficiency gains obscures an underlying cognitive trade-off: arduous first-draft composition frequently forces half-formed intuitions to withstand rigorous verbal scrutiny. Delegating structural genesis wholesale trades idiosyncratic vitality for sleek statistical uniformity—whereas engaging critique strictly post-draft preserves authentic authorial agency.',
    },
    alternativeResponses: [
      'The crucial dividing line turns cleanly on cognitive sequence: treating fluent software as an adversarial proofreader sharpening raw messy claims enriches voice—whereas inviting predictive phrasing to author convictions upfront gradually hollows out stylistic surprise.',
    ],
    vocabularyBank: [
      { term: 'frictionless polish', meaning: 'Suspiciously smooth spotless phrasing masking shallow original analysis.', vietnamese: 'sự trau chuốt mượt mà dễ dãi thiếu chiều sâu' },
      { term: 'homogenized cadence', meaning: 'Predictable bland uniform prose stripped of personal quirk or warmth.', vietnamese: 'nhịp văn đồng loạt nhạt nhòa thiếu bản sắc riêng' },
      { term: 'authorial agency', meaning: 'True personal responsibility and ownership over ideas expressed.', vietnamese: 'quyền làm chủ tư duy tác giả thực sự' },
    ],
    naturalExpressions: ['Misses the subtlest hazard...', 'Wrestling imprecise verbs into order...', 'Without surrendering intellectual authorship'],
    sentenceStructures: [
      { frame: 'When [subjects] offload [cognitive struggle], [output] gains [surface trait]—yet acquires [subtle hollowing].', example: 'When readers offload tough synthesis exclusively to quick summaries, recall gains swift headlines—yet loses deeper skepticism.' },
    ],
    suggestedOrganization: ['1. Reframe shallow binary quickly ("misses the subtlest hazard...")', '2. Cognitive role of messy rough drafting', '3. Sharp aesthetic critique ("homogenized cadence")', '4. Crisp constructive boundary ("strictly post-draft copy-editor")'],
    commonMistakes: [
      { mistake: 'AI prose always bad and soulless, humans always genius.', correction: 'Statistical phrasing excels at surface readability yet flattens risk-taking voice unless writers retain raw post-draft editorial authorship.', why: 'C2 mastery honors genuine utility cleanly while diagnosing structural tradeoffs precisely!' },
    ],
    followUpQuestions: ['Notice the tactile verb imagery ("wrestling imprecise verbs into reluctant order")—concrete physical metaphors make abstract philosophy unforgettable!'],
    improvementStrategies: ['Pair precise Latinate abstractions ("homogenized cadence") straight next to earthy concrete verbs ("wrestling", "sparring")—that contrast defines effortless C2 English rhythm!'],
    tips: ['Deliver "without surrendering intellectual authorship" with deliberate unhurried falling resolution.'],
    selfChecklist: ['Paired abstract analysis seamlessly with earthy action verbs.', 'Deconstructed shallow debate binaries.', 'Defined crisp ethical/practical workflow boundary cleanly.'],
    keyVocabulary: ['homogenized', 'frictionless', 'agency'],
    suggestedSeconds: 75,
  }),

  createSpeakingLesson({
    id: 'spk-m2-c2-02',
    title: 'Diplomatic Crisis Management: De-escalating Cross-Cultural Client Friction',
    activityType: 'roleplay',
    category: 'workplace',
    cefrLevel: 'C2',
    prompt: 'A frustrated enterprise partner interprets concise bullet-point emails from your engineering team as cold arrogance and threatens pulling renewal. Restore warmth, clarify cultural directness without blaming anyone, and cement joint trust.',
    promptVi: 'Một đối tác doanh nghiệp lớn hiểu nhầm email gạch đầu dòng ngắn gọn của đội kỹ thuật là sự lạnh lùng kiêu ngạo và dọa hủy gia hạn. Hóa giải căng thẳng tinh tế, làm rõ khác biệt phong cách giao tiếp mà không đổ lỗi cho ai.',
    objectives: [
      'Separate unintended tone friction cleanly from real shared engineering respect.',
      'Use tactful reframing ("pragmatic brevity mistaken for indifference", "shared accountability forward").',
    ],
    preparationQuestions: ['Why would criticizing YOUR OWN engineers angrily in front of the client destroy team trust too?', 'How do warm vocal softening cues reset tension rapidly?'],
    modelText: 'First, Kenji—thank you sincerely for voicing that candor directly rather than letting frustration simmer silently; long partnerships earn nothing less. Reading back those concise bullet threads through your team’s eyes, I completely recognize how crisp technical shorthand felt brusque and unappreciative—especially amid tight migration stress! Without excusing that blunt presentation, I’ve worked beside these exact engineers closely for three years and know deeply how seriously they guard your uptime; what read across screens as abrupt dismissal stemmed from rushed sprint shorthand rather than indifference. Starting this week, I’ll join our Thursday transition briefs personally alongside concise written context notes so communication matches the real mutual respect we value—shall we review tomorrow’s milestone slate together calmly?',
    modelComparisonByLevel: {
      basic: 'Sorry our engineers sounded cold in short emails. They actually work hard and care about your uptime, just wrote fast. I will join weekly calls so messages feel warmer.',
      natural: 'Kenji, appreciate your speaking plainly rather than letting annoyance grow! Looking back through your lens, those abrupt bullet replies certainly read colder than intended during tense launch weeks. Our engineers care fiercely about your uptime—bad shorthand obscured good intent. Going forward, I’ll step into Thursday check-ins directly so shared warmth matches our engineering care.',
      advanced: 'Thank you genuinely, Kenji, for extending candid feedback upfront rather than allowing quiet alienation to compound. Re-examining that correspondence from your vantage point, curt diagnostic bullets unquestionably landed starkly amid intense migration pressure. Without minimizing the brusque delivery, our engineering leads hold uncompromising respect for your operational trust—technical haste merely masqueraded as detachment. Pairing personal weekly stewardship alongside explicit written context immediately ensures our cadence honors the partnership cleanly.',
    },
    alternativeResponses: [
      'Thank you for flagging that discrepancy openly—looking closely at both cultural expectations, brisk factual bullets meant to save partner reading time easily land harshly without framing courtesy. Let’s pair executive context summaries upfront alongside every engineering status ticket moving forward.',
    ],
    vocabularyBank: [
      { term: 'simmer silently', meaning: 'Worsen quietly beneath polite surface civility.', vietnamese: 'âm ỉ tích tụ bực bội ngầm' },
      { term: 'masqueraded as detachment', meaning: 'Created the false appearance of cold indifference.', vietnamese: 'vô tình mang vẻ ngoài thờ ơ lạnh nhạt' },
      { term: 'stewardship', meaning: 'Attentive personal accountability guiding trust cleanly.', vietnamese: 'sự đồng hành sát sao có trách nhiệm' },
    ],
    naturalExpressions: ['Thank you for voicing that candor...', 'Without minimizing the brusque delivery...', 'Ensure our cadence honors the partnership'],
    sentenceStructures: [
      { frame: 'Re-examining [incident] through [partner’s eyes], [tone] undeniably landed starkly. Without minimizing [impact], [honest intent].', example: 'Re-examining that delay through your clients’ eyes, silence undeniably felt concerning. Without minimizing the wait, final audits stayed vigilant.' },
    ],
    suggestedOrganization: ['1. Honor direct candor warmly first', '2. Step authentically into partner vantage point without defensive excuse', '3. Protect team dignity honestly (haste != indifference)', '4. Concrete personal stewardship fix + warm joint step forward'],
    commonMistakes: [
      { mistake: 'Our engineers are rude people, sorry, or You misread our email too sensitively.', correction: 'Reading back through your eyes, crisp shorthand unquestionably sounded abrupt—let’s bridge that warmly starting Thursday.', why: 'True C2 diplomacy neither throws teammates under the bus nor gaslights client feelings!' },
    ],
    followUpQuestions: ['Pause briefly at "Thank you genuinely..."—vocal unhurried sincerity disarms tense calls in seconds!'],
    improvementStrategies: ['Protect BOTH sides’ dignity while stepping cleanly into proactive ownership ("I’ll bridge weekly check-ins directly").'],
    tips: ['Deliver calm empathy steadily; never talk faster when de-escalating conflict!'],
    selfChecklist: ['Welcomed candid feedback genuinely upfront.', 'Acknowledged emotional impact cleanly without blaming client sensitivity.', 'Defended partner/team intent gracefully with concrete follow-through.'],
    keyVocabulary: ['candor', 'masqueraded', 'stewardship'],
    suggestedSeconds: 70,
    scene: 'workspace',
    roleplayTurns: [
      { partner: 'Client VP: "Honestly, three-word cold tickets from your tech team feel downright dismissive—we’re questioning renewing next quarter."', cue: 'Honor direct candor, validate harsh feel through their lens cleanly, distinguish sprint haste from true respect, pledge weekly personal stewardship.' },
      { partner: 'Client VP: "Fairly put—knowing technical intent wasn’t dismissive already clears air. See you Thursday."', cue: 'Close warmly and confirm calendar invite alignment cleanly.' },
    ],
  }),

  createSpeakingLesson({
    id: 'spk-m2-c2-03',
    title: 'Abstract Philosophical Reflection: The Architecture of Unhurried Mastery',
    activityType: 'academic_speaking',
    category: 'ielts_part_3',
    cefrLevel: 'C2',
    prompt: 'Deliver a 90-second nuanced reflection examining why hyper-optimized speed hacks often sabotage deep intellectual or artistic mastery ("slow precision vs shallow velocity").',
    promptVi: 'Trình bày chiêm nghiệm sâu sắc trong ~90 giây về lý do các mẹo tăng tốc cấp kỳ hay làm xói mòn năng lực tinh thông thực thụ ("độ chính xác chậm rãi vs tốc độ bề nổi").',
    objectives: [
      'Sustain poised lyrical-analytical register seamlessly across concrete metaphors and philosophical depth.',
      'Avoid hollow cliché quotes by anchoring insight inside verifiable human craftsmanship.',
    ],
    preparationQuestions: ['What distinguishes impressive fluency shortcuts from enduring calm depth under surprise strain?', 'Compare learning a musical piece or second language via slow precision vs rushed imitation!'],
    modelText: 'Across modern learning culture, velocity routinely masquerades as progress—counting chapters skimmed, playlists raced at double speed, or shallow checklist streaks snapped at midnight. Yet seasoned violinists, surgical mentors, and patient linguists observe a quieter paradox: genuine speed is seldom chased head-on; rather, it precipitates cleanly as a byproduct of slow, almost pedantic structural clarity. When learners refuse letting messy half-mastered phrasing slip past unchecked early on, slow deliberate repetitions sculpt crisp neurological pathways free of hidden compensation errors. Rush past foundational precision, conversely, and fragile speed collapses dramatically the instant unfamiliar stress, complex audiences, or unexpected subtle idioms appear! True unhurried mastery doesn’t scorn ambition—it simply honors the biological reality that lasting intuition ripens through deep unhurried attention.',
    modelComparisonByLevel: {
      basic: 'Speed tricks don’t make real skill. Slow careful practice like music builds deep base so real speed comes naturally later without panic.',
      natural: 'Hurried streaks often trick learners into mistaking busy pace for deep skill. Experienced musicians and coaches notice true effortless speed grows sideways out of patient unhurried clarity—rushing shaky foundations breaks easily once unfamiliar conversations turn fast.',
      advanced: 'Contemporary optimization frequently conflates surface velocity with genuine mastery. Seasoned practitioners across craft domains recognize effortless speed emerges paradoxically not through frantic pacing, but as the clean precipitate of slow, uncompromising early precision—sustaining resilience precisely when unpredictable nuance pressure-tests shallow shortcuts.',
    },
    alternativeResponses: [
      'Imagine rushing dry wood glue before joints set firmly: initial speed impresses spectators cleanly until heavy weight snaps fragile corners days later. Slow disciplined patience during early structural joins saves years rebuilding shaky habits afterwards.',
    ],
    vocabularyBank: [
      { term: 'precipitates as a byproduct', meaning: 'Emerges naturally downstream out of quieter steady foundations.', vietnamese: 'kết tinh tự nhiên như hệ quả tất yếu' },
      { term: 'compensation errors', meaning: 'Hidden flawed workarounds adopted early while hurrying.', vietnamese: 'thói quen vá víu sai lệch ẩn giấu lúc vội' },
      { term: 'scorn', meaning: 'Dismiss condescendingly as inferior.', vietnamese: 'coi thường phủ nhận' },
    ],
    naturalExpressions: ['Velocity routinely masquerades as progress...', 'Seldom chased head-on...', 'Pressure-tests fragile foundations'],
    sentenceStructures: [
      { frame: 'True [quality] is seldom [direct chase]; rather, it emerges cleanly as [natural byproduct] of [patient craft].', example: 'True composure is seldom memorized before mirrors; rather, it emerges smoothly out of grounded preparation.' },
    ],
    suggestedOrganization: ['1. Cultural diagnosis (velocity masking shallow habits)', '2. Central paradox (speed emerges downstream from slow clarity)', '3. Contrast: fragile shortcuts breaking under stress vs sturdy foundation', '4. Affirmative wrap (respecting ambition + biology cleanly)'],
    commonMistakes: [
      { mistake: 'So never practice fast speaking forever.', correction: 'Fast natural flow grows effortlessly AFTER unhurried accuracy sets deep roots—never in contradiction with speed itself!', why: 'Avoid turning nuances into caricature; balanced C2 thinkers show how slow precision unlocks authentic eventual speed!' },
    ],
    followUpQuestions: ['Apply that wood-glue/violin intuition cleanly straight to shadowing sessions: slow crisp accuracy at 0.8x unlocks clean effortless flow at 1.15x!'],
    improvementStrategies: ['Read balanced sentences aloud noticing cadence rhythm: short sharp thesis -> graceful multi-clause unfolding -> decisive closing beat.'],
    tips: ['Deliver "slow, almost pedantic structural clarity" slightly slower with thoughtful micro-pauses—let form enact meaning!'],
    selfChecklist: ['Sustained C2 register gracefully without hollow jargon.', 'Contrasted fragile shortcuts with resilient foundations cleanly.', 'Spoke ~75–90s smoothly with natural cadence.'],
    keyVocabulary: ['precipitates', 'masquerades', 'compensation errors'],
    suggestedSeconds: 85,
  }),

  createSpeakingLesson({
    id: 'spk-m2-c2-04',
    title: 'Nuanced Literary & Film Critique: Subtext, Restraint & Moral Ambiguity',
    activityType: 'topic_discussion',
    category: 'social_situations',
    cefrLevel: 'C2',
    prompt: 'Review an understated novel or film gracefully in 65 seconds—explaining why artistic restraint (what stays unsaid cleanly between characters) strikes harder than melodramatic speeches.',
    promptVi: 'Bình luận tinh tế trong ~65 giây về một cuốn tiểu thuyết hoặc bộ phim giàu khoảng lặng: giải thích vì sao sự tiết chế ("điều không nói thành lời") lại lay động hơn kịch tính phô trương.',
    objectives: [
      'Analyze artistic subtext cleanly with precise aesthetic nouns ("restraint", "unsaid resonance", "editorial trust").',
      'Speak organically like an insightful cultural columnist rather than stiffly listing plot summaries.',
    ],
    preparationQuestions: ['What memorable silence or simple domestic gesture hit harder than screaming arguments?', 'Why does explaining EVERY emotion loudly often flatten audience imagination?'],
    modelText: 'What lingeringly separates enduring cinema from loud disposable spectacle rarely rests in budget explosions—it lives inside fearless editorial restraint! Think of the finest domestic dramas: when two estranged siblings silently wash chipped porcelain bowls side by side without uttering dramatic confessions, the director trusts viewers to read entire decades inside hesitated glances and clinking water. Melodrama leaves zero room for listener co-creation; spelling out every moral heartbreak in underlined dialogue spoons sentiment thinly straight onto viewers. Restraint, by contrast, recruits our own unspoken memories right into the quiet negative space beside those characters—leaving one quiet kitchen scene echoing in minds weeks after noisier plot twists vanish cleanly.',
    modelComparisonByLevel: {
      basic: 'Great quiet movies leave emotion unsaid like siblings washing dishes quietly, letting viewers feel deep history more than loud shouting dramas.',
      natural: 'Lasting stories win through quiet restraint rather than heavy speeches explaining every tear! When two distant siblings simply wash bowls silently together, viewers read shared history straight into every glance—making subtle stillness linger far longer than melodrama.',
      advanced: 'Enduring narrative distinction frequently resides within audacious artistic restraint: entrusting silent negative space—two estranged siblings rinsing porcelain without declarative confession—to invite audience co-authorship, whereas overwrought melodrama forecloses resonance beneath exhaustive exposition.',
    },
    alternativeResponses: [
      'Whenever prose explains precisely how guilty a protagonist feels rather than merely showing her smoothing cold linen endlessly at twilight, magic evaporates slightly; showing modest everyday gestures preserves delicate tragic honesty cleanly.',
    ],
    vocabularyBank: [
      { term: 'editorial restraint', meaning: 'Disciplined wisdom knowing precisely how little needs explaining aloud.', vietnamese: 'sự tiết chế bản lĩnh trong nghệ thuật kể chuyện' },
      { term: 'negative space', meaning: 'Meaningful quiet gaps intentionally left open for imagination.', vietnamese: 'khoảng lặng mở đầy sức gợi' },
      { term: 'underlined dialogue', meaning: 'Heavy obvious lines spelling themes clumsily aloud.', vietnamese: 'lời thoại phô bày lộ liễu thiếu tinh tế' },
    ],
    naturalExpressions: ['What lingeringly separates...', 'Trusts viewers to read entire decades inside...', 'Recruits our own unspoken memories'],
    sentenceStructures: [
      { frame: 'Whereas [overworked style] leaves zero room for [imagination], [subtle technique] recruits [audience depth] smoothly.', example: 'Whereas loud narration flattens tension, crisp sparse details recruit active listener curiosity.' },
    ],
    suggestedOrganization: ['1. Aesthetic contrast hook (spectacle vs editorial restraint)', '2. Vivid concrete visual image (estranged siblings washing chipped bowls)', '3. Contrast melodrama over-explaining vs reader co-creation', '4. Lasting haunting takeaway'],
    commonMistakes: [
      { mistake: 'Retelling whole A-to-Z plot chronologically during an aesthetic review!', correction: 'Select ONE micro-scene cleanly as evidence demonstrating artistic restraint!', why: 'Reviews dissect HOW a work moves audiences cleanly rather than spoiling plot summaries!' },
    ],
    followUpQuestions: ['Notice the crisp distinction: plot retelling describes WHAT happened; sharp cultural critique dissects WHY one silent moment echoes weeks later!'],
    improvementStrategies: ['Whenever reviewing stories or podcasts in English, capture ONE five-second physical gesture rather than summarizing twenty characters!'],
    tips: ['Let quiet pause syllables sit comfortably—no need racing past "chipped porcelain bowls side by side".'],
    selfChecklist: ['Anchored aesthetic claim inside one evocative micro-scene.', 'Avoided flat chronological spoiler summary.', 'Controlled precise C2 aesthetic vocabulary effortlessly.'],
    keyVocabulary: ['restraint', 'negative space', 'melodrama'],
    suggestedSeconds: 65,
  }),

  createSpeakingLesson({
    id: 'spk-m2-c2-05',
    title: 'High-Speed Spontaneous Q&A: Synthesizing Ambiguity Without Flinching',
    activityType: 'rapid_response',
    category: 'social_situations',
    cefrLevel: 'C2',
    prompt: 'Respond effortlessly within 45 seconds to a sharp surprise curveball: "In thirty years, what ordinary daily habit we normalize right now will future grandchildren find genuinely baffling?"',
    promptVi: 'Ứng biến nhanh đầy thông minh trong 45 giây trước câu hỏi bất ngờ: "30 năm nữa, thói quen thường ngày nào hiện tại sẽ khiến thế hệ con cháu thấy khó hiểu nhất?"',
    objectives: [
      'Launch cleanly in 2 seconds with poise, witty understatement, and philosophical turn.',
      'Compress crisp social observation tightly under brisk natural conversational rhythm.',
    ],
    preparationQuestions: ['Pick ONE concrete everyday absurdity (burning fuel idling alone in steel boxes / checking glowing glass rectangles mid-dinner)!', 'End on a warm ironic self-reflective note!'],
    modelText: 'Without hesitating—our bizarre modern ritual of sitting silently inches apart at sunny street cafés, tapping glowing pocket glass rectangles with strangers across oceans while barely glancing toward warm tea cooling right under our chins! Future social historians will surely chuckle studying photos showing four friends sharing one physical wooden table, each locked politely inside separate algorithmic feeds simultaneously. Mind you, digital connection itself isn’t the villain—merely our cheerful willingness to fragment scarce shared minutes in the same room. Here’s hoping grandchildren look back incredulously asking, "Wait—you honestly checked twenty news alerts mid-dinner?!" before handing each other extra mango slices offline.',
    modelComparisonByLevel: {
      basic: 'Checking phones silently at dinner tables with friends! Grandchildren will laugh seeing people ignore friends right beside them to read online news.',
      natural: 'Hands down, sitting inches from loved ones at dinner while quietly scrolling separate glowing feeds! Future grandchildren will smile in disbelief seeing four friends share one table yet attend four completely isolated conversations—hopefully teasing us cleanly back into real eye contact.',
      advanced: 'Unquestionably our curiously normalized choreography of communal isolation: four close companions gathered over warm tea, visibly entranced by pocket rectangles linking absent strangers while forfeiting immediate sensory presence. Descendants perusing archival snapshots will marvel kindly at how eagerly we auctioned scarce unmediated evenings to glowing alerts.',
    },
    alternativeResponses: [
      'Probably hauling a two-ton personal metal living room smoothly just to drive a single human backpack five kilometers for milk! Future city kids strolling quiet shaded avenues will chuckle picturing steel rush-hour bottlenecks outside neighborhood groceries.',
    ],
    vocabularyBank: [
      { term: 'communal isolation', meaning: 'Being physically side-by-side yet completely elsewhere mentally.', vietnamese: 'cô đơn tập thể khi ngồi cạnh nhau' },
      { term: 'incredulously', meaning: 'With genuine laughing disbelief at past strangeness.', vietnamese: 'đầy kinh ngạc khó tin' },
      { term: 'auctioned scarce evenings', meaning: 'Quietly traded precious shared time away carelessly.', vietnamese: 'đem đổi mất những buổi tối quý giá bên nhau' },
    ],
    naturalExpressions: ['Without hesitating...', 'Mind you...', 'Here’s hoping grandchildren ask...'],
    sentenceStructures: [
      { frame: 'Unquestionably [vivid snapshot]! Future [observers] will chuckle picturing [contrast], before [hopeful twist].', example: 'Unquestionably commuting two hours daily to attend identical screen meetings! Future grandchildren will chuckle reading those calendars.' },
    ],
    suggestedOrganization: ['1. Immediate snappy pick ("Without hesitating...")', '2. Vivid funny visual detail (tea cooling beside glowing feeds)', '3. Balanced aside ("Mind you...")', '4. Warm smiling close'],
    commonMistakes: [
      { mistake: 'Spending 15 seconds humming before choosing between 4 boring topics.', correction: 'Grab your FIRST concrete absurd visual ("tapping phones across warm tea") and commit cleanly!', why: 'Speed clarity in C2 spontaneous Q&A rewards decisive vivid framing over chasing the "perfect" deepest topic!' },
    ],
    followUpQuestions: ['Notice how both "communal cafe phones" and "two-ton steel boxes fetching milk" paint hilarious instant pictures without sounding preachy!'],
    improvementStrategies: ['Keep humor light and self-including ("our bizarre modern ritual") rather than scolding strangers harshly!'],
    tips: ['Hit record, count 1 beat ONLY, and launch straight with "Without hesitating..." cleanly!'],
    selfChecklist: ['Launched inside 2 seconds smoothly without stalled hesitation.', 'Painted vivid concrete everyday snapshot cleanly.', 'Preserved warm self-aware wit throughout.'],
    keyVocabulary: ['incredulously', 'choreography', 'mind you'],
    suggestedSeconds: 45,
    scene: 'cafe',
  }),
];
