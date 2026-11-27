import type { GrammarTopic } from '@english-quest/shared';
import { createGrammarLesson, gEx } from './helpers';

export const B2_GRAMMAR_TOPICS: GrammarTopic[] = [
  createGrammarLesson({
    id: 'gram-b2-01-third-and-mixed-conditionals',
    cefrLevel: 'B2',
    title: 'Third Conditional & Mixed Conditionals (Past-to-Present Links)',
    summary: 'Reflect clearly on unreal past regrets and explain how a different past decision would reshape RIGHT NOW.',
    summaryVi: 'Câu Điều kiện Loại 3 và Câu Điều kiện Hỗn hợp (liên kết giả định quá khứ với kết quả hiện tại).',
    objectives: [
      'Build Type 3 Unreal Past cleanly ("If + had + V3, would/could have + V3").',
      'Connect Unreal Past causes directly into Present results using Mixed Conditionals ("If I had learned typing earlier, I wouldn’t struggle NOW").',
      'Spot the difference between Present General Trait -> Unreal Past Result ("If she weren’t so diligent, she wouldn’t have won").',
    ],
    detailedExplanation:
      'Sometimes yesterday’s closed fork shapes today’s reality. Pure Third Conditional explores closed past moments entirely in the past: "If we had booked sleeper berths early, we wouldn’t have slept upright on the overnight train." Mixed Conditionals build a dramatic bridge across timelines: use "had + V3" when an UNREAL PAST action explains why TODAY is different ("If we had invested in tram rails decades ago, downtown commuters WOULD ENJOY cleaner air RIGHT NOW"). Keep your "now/today" time marker sharp!',
    structures: [
      { label: 'Type 3 (Unreal Past -> Unreal Past)', formula: 'If + Subject + had (not) + V3, Subject + would/could/might + (not) have + V3', example: 'If you hadn’t backed up your notes, you would have lost three chapters.' },
      { label: 'Mixed (Unreal Past -> Result NOW)', formula: 'If + Subject + had + V3, Subject + would/could + V1 (now/today)', example: 'If An had accepted that internship, she would work in Osaka today.' },
      { label: 'Mixed (Permanent Trait -> Past Action)', formula: 'If + Subject + weren’t / didn’t V2, Subject + would/wouldn’t have + V3', example: 'If Minh weren’t so calm under pressure, he wouldn’t have rescued that live demo.' },
    ],
    usageRules: [
      'Never insert "would have" inside the "If" clause (*"If I would have known" -> "If I had known").',
      'Look closely at result time markers ("yesterday" -> Type 3 "would have + V3"; "right now/today" -> Mixed "would + V1").',
      'Use "could have + V3" for unrealized ability and "might have + V3" for cautious past possibility.',
    ],
    exceptions: [
      'In formal C1–C2 essays, "If + had + V3" often elevates gracefully with inversion dropping "if": "Had cities built safer bike lanes sooner, commutes would be healthier today."',
    ],
    examples: [
      { english: 'If earlier planners had protected those wetlands, last autumn’s flood would have stayed minor.', vietnamese: 'Giá mà người quy hoạch trước đây giữ vùng ngập nước đó thì trận lụt thu vừa rồi đã nhẹ hơn nhiều.' },
      { english: 'If I had listened to five minutes of English daily at school, I would feel far freer speaking now.', vietnamese: 'Giá hồi đi học mình nghe tiếng Anh năm phút mỗi ngày thì bây giờ nói đã thoải mái hơn hẳn.' },
      { english: 'We could have caught the mountain sunrise if we hadn’t forgotten our alarm batteries.', vietnamese: 'Chúng mình đã kịp ngắm bình minh trên núi nếu không quên lắp pin đồng hồ báo thức.' },
      { english: 'If Lan didn’t read essays so closely by nature, she wouldn’t have spotted that tiny contradiction.', vietnamese: 'Nếu bản tính Lan không hay đọc kỹ văn bản thì cô ấy đã chẳng phát hiện mâu thuẫn nhỏ đó.' },
      { english: 'I might never have met my closest research teammate if I hadn’t joined that workshop.', vietnamese: 'Có lẽ mình chẳng bao giờ gặp đồng đội nghiên cứu thân nhất nếu không dự buổi hội thảo đó.' },
    ],
    commonMistakes: [
      { wrong: 'If she would have practiced harder, she would have passed.', right: 'If she had practiced harder, she would have passed.', why: 'Keep "had + V3" in the If-clause; reserve "would have + V3" strictly for the result clause.' },
      { wrong: 'If I had taken that umbrella, I wouldn’t have been wet right now.', right: 'If I had taken that umbrella, I wouldn’t be soaking wet right now.', why: '"Right now" signals a present Mixed result ("wouldn’t be"), not Type 3 past.' },
      { wrong: 'If they didn’t miss the early ferry yesterday, they would arrive already.', right: 'If they hadn’t missed the early ferry yesterday, they would have arrived already.', why: '"Yesterday" makes the condition Unreal Past ("hadn’t missed").' },
    ],
    comparisons: [
      { structure: 'Type 2 vs. Type 3 vs. Mixed', difference: 'Type 2 = imaginary now -> now; Type 3 = unreal past -> past; Mixed = unreal past -> right now!', example: 'Always test both halves separately for PAST vs. NOW time!' },
    ],
    speakingTip: 'Practice natural contraction flow: "wouldn’t have" sounds smoothly like /ˈwʊdntəv/ in speech—never say *"would of" when writing!',
    writingTip: 'One crystal-clear Mixed Conditional inside an IELTS essay conclusion ("Had schools emphasized speaking sooner, more graduates would collaborate confidently today") showcases high syntactic range immediately.',
    reviewSummary: 'Keep had+V3 inside unreal past If-clauses; match result halves carefully between "would have+V3" (closed past) and "would+V1" (effect right now).',
    quiz: [
      gEx({ id: 'qb2-01-1', topicId: 'gram-b2-01-third-and-mixed-conditionals', type: 'multiple_choice', instruction: 'Spot the Mixed Conditional now-clue.', prompt: 'If you had backed up your thesis files yesterday, you ___ calmly preparing slides right now!', options: ['would have been', 'would be', 'will be', 'are'], correctAnswer: 'would be', explanation: '"Right now" places the result in the present: Mixed Conditional uses "would + V1" ("would be").', difficulty: 2 }),
      gEx({ id: 'qb2-01-2', topicId: 'gram-b2-01-third-and-mixed-conditionals', type: 'error_correction', instruction: 'Fix "If... would have".', prompt: 'Correct: "If engineers would have tested offline earlier, users wouldn’t have paused."', correctAnswer: 'If engineers had tested offline earlier, users wouldn’t have paused.', explanation: 'Replace "would have" inside the If-clause with Past Perfect "had".', difficulty: 2 }),
      gEx({ id: 'qb2-01-3', topicId: 'gram-b2-01-third-and-mixed-conditionals', type: 'fill_blank', instruction: 'Complete Type 3 unrealized ability.', prompt: 'If the path hadn’t flooded overnight, cyclists ___ (could / cross) safely by seven.', correctAnswer: 'could have crossed', explanation: 'Past unrealized possibility takes "could have + V3".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b2-02-participle-clauses-conciseness',
    cefrLevel: 'B2',
    title: 'Participle Clauses (-ing / -ed / Having + V3) & Subject Alignment',
    summary: 'Compress wordy adverb/relative sentences cleanly into crisp academic style without dangling modifiers.',
    summaryVi: 'Mệnh đề Phân từ (-ing / -ed / Having V3) giúp câu cô đọng, học thuật và tránh lỗi treo chủ ngữ.',
    objectives: [
      'Reduce active simultaneous/causal clauses smoothly with Present Participles ("Realizing the error, she stopped").',
      'Reduce passive clauses cleanly with Past Participles ("Built in 1920, the station remains functional").',
      'Audit EVERY opening participle phrase against the FIRST noun right after the comma to prevent hilarious dangling modifiers!',
    ],
    detailedExplanation:
      'Academic journals and Band 8 essays save words without cutting depth by folding two linked clauses around one shared subject. Active action? Open with "-ing" ("Walking past the market, I spotted fresh figs") or "Having + V3" when clearly finished beforehand ("Having verified the dataset, analysts published the chart"). Passive receiver? Open cleanly with "-ed" V3 ("Designed for low-end phones, the bundle loads instantaneously"). CRITICAL SAFETY CHECK: Whoever sits immediately RIGHT AFTER the comma MUST be the exact logical doer/receiver of that opening participle!',
    structures: [
      { label: 'Active Simultaneous / Cause', formula: 'V-ing ..., Subject + Main Verb', example: 'Hoping to widen sidewalks, planners banned curbside parking.' },
      { label: 'Passive State / Condition', formula: 'V3 (Past Participle) ..., Subject + Main Verb', example: 'Located near central rail, the library thrives daily.' },
      { label: 'Completed Prior Step', formula: 'Having (+ been) + V3 ..., Subject + Main Verb', example: 'Having compared both drafts, we chose the clearer outline.' },
    ],
    usageRules: [
      'Put "Not" directly BEFORE the participle for negatives ("Not wanting to wake anyone, he tiptoed upstairs").',
      'Align subjects strictly: *"Walking across the bridge, the cathedral amazed us" is FALSE because cathedrals don’t walk across bridges! Write "...we admired the cathedral".',
      'Use "-ed" participles cleanly inside noun post-modification too ("the data submitted yesterday = the data that was submitted yesterday").',
    ],
    exceptions: [
      'A tiny set of fixed discourse phrases ("Generally speaking, Judging by the rain, Taking costs into account") function as speaker comments exempt from strict subject matching.',
    ],
    examples: [
      { english: 'Having double-checked every external URL, editors compiled the final bibliography.', vietnamese: 'Sau khi kiểm tra kỹ từng đường dẫn ngoài, ban biên tập đã tổng hợp danh mục tài liệu cuối cùng.' },
      { english: 'Surrounded by tall shade trees, the neighborhood plaza stays cool even in July.', vietnamese: 'Được bao bọc bởi hàng cây cao rợp bóng, quảng trường khu phố luôn mát ngay cả tháng Bảy.' },
      { english: 'Noticing repeated confusion over articles, the coach added clearer visual examples.', vietnamese: 'Nhận thấy sự lúng túng lặp lại về mạo từ, huấn luyện viên đã bổ sung ví dụ trực quan rõ hơn.' },
      { english: 'Driven slowly through historic lanes, quiet electric shuttles cut harmful street noise.', vietnamese: 'Chạy chậm qua các ngõ phố cổ, xe điện êm giảm đáng kể tiếng ồn đường phố gây hại.' },
      { english: 'Not knowing the regional train schedule, tourists confirmed departure times upstairs.', vietnamese: 'Chưa rõ lịch tàu vùng miền, du khách xác nhận lại giờ khởi hành trên quầy tầng trên.' },
    ],
    commonMistakes: [
      { wrong: 'Climbing up the hill, the small white temple suddenly came into view.', right: 'Climbing up the hill, we suddenly saw the small white temple come into view.', why: 'The temple was not climbing the hill! Match the human climber right after the comma.' },
      { wrong: 'Fixing quietly last Tuesday, the ferry resumed full service.', right: 'Fixed quietly last Tuesday, the ferry resumed full service.', why: 'The ferry RECEIVED repair (passive meaning) -> use V3 "Fixed", not active V-ing "Fixing".' },
      { wrong: 'Didn’t wanting to disturb sleep, she whispered outside.', right: 'Not wanting to disturb anyone, she whispered outside.', why: 'Negate participles simply with "Not + V-ing", never *"Didn’t wanting".' },
    ],
    comparisons: [
      { structure: 'Active V-ing vs. Passive V3', difference: '"Seeing the sign, visitors paused" (visitors saw = Active) vs. "Seen from afar, the lantern glowed" (lantern IS seen = Passive).', example: 'Always test whether the post-comma noun performs or receives the participle!' },
    ],
    speakingTip: 'Drop tidy short participles into summaries ("Talking about daily habits..." / "Born in Hue, she...").',
    writingTip: 'One crisp "Having V3..." or passive "V3..." opening participle lifts paragraph cohesion far beyond repetitive *"Because..., Therefore..." clauses.',
    reviewSummary: 'Use V-ing for active modifiers, V3 for passive modifiers, Having+V3 for prior steps, and ALWAYS verify the post-comma subject matches!',
    quiz: [
      gEx({ id: 'qb2-02-1', topicId: 'gram-b2-02-participle-clauses-conciseness', type: 'multiple_choice', instruction: 'Spot and fix the dangling modifier.', prompt: 'Choose the sentence where the post-comma subject logically matches the opening participle:', options: ['Reviewing past mistakes carefully, high scores became easier.', 'Reviewing past mistakes carefully, learners build accurate habits.', 'Reviewing past mistakes carefully, the notebook improved fast.', 'Reviewing past mistakes carefully, accuracy grew by June.'], correctAnswer: 'Reviewing past mistakes carefully, learners build accurate habits.', explanation: 'Only human "learners" can logically perform "Reviewing past mistakes".', difficulty: 2 }),
      gEx({ id: 'qb2-02-2', topicId: 'gram-b2-02-participle-clauses-conciseness', type: 'multiple_choice', instruction: 'Choose Active vs. Passive participle.', prompt: '___ in 1904 and lovingly preserved today, the wooden tea house draws calm visitors.', options: ['Building', 'Built', 'Having built', 'Was built'], correctAnswer: 'Built', explanation: 'The wooden tea house RECEIVED construction (passive), so use Past Participle "Built".', difficulty: 2 }),
      gEx({ id: 'qb2-02-3', topicId: 'gram-b2-02-participle-clauses-conciseness', type: 'sentence_transformation', instruction: 'Condense using "Having + V3".', prompt: 'Rewrite smoothly: "After he had resolved those two bugs, he ran the test suite." -> Having...', correctAnswer: 'Having resolved those two bugs, he ran the test suite.', explanation: 'Completed prior step condenses cleanly into "Having + V3".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b2-03-gerund-infinitive-meaning-shifts',
    cefrLevel: 'B2',
    title: 'Verbs That Change Meaning: Stop / Remember / Try / Regret / Mean',
    summary: 'Distinguish subtle sharp shifts between V-ing (completed memory / action in progress / experiment) and "to + V1" (task / goal / effort).',
    summaryVi: 'Các động từ đổi nghĩa hoàn toàn giữa theo sau bởi "to-V" và "V-ing" (stop, remember, forget, try, regret, mean).',
    objectives: [
      'Separate memory of a PAST experience ("remember V-ing") from remembering an UPCOMING duty ("remember to V1").',
      'Distinguish stopping a habit forever ("stop smoking") from pausing briefly in order to do something else ("stop to admire the view").',
      'Tell "try V-ing" (experiment with a quick test solution) from "try to V1" (make strenuous effort at something hard).',
    ],
    detailedExplanation:
      'English stores a beautiful timeline compass inside "-ing" vs. "to-V" right after five essential verbs: stop, remember/forget, regret, try, and mean. Think: **"-ing" looks BACKWARD at the activity itself or experiments sideways**, while **"to + V1" points FORWARD toward a goal, duty, or purpose!** Compare "I’ll never forget meeting her in Kyoto" (rich past memory!) vs. "Don’t forget to lock the front latch" (future reminder!).',
    structures: [
      { label: 'Remember / Forget / Regret', formula: '+ V-ing (past memory / regret)  vs.  + to V1 (duty / polite announcement)', example: 'I remember packing my keys—oh, wait, I forgot to zip the pouch!' },
      { label: 'Stop', formula: 'stop + V-ing (quit habit)  vs.  stop + to V1 (pause movement IN ORDER TO do X)', example: 'Let’s stop rushing and stop to enjoy sunset tea.' },
      { label: 'Try & Mean', formula: 'try V-ing (experiment test) vs. try to V1 (strain hard) | mean V-ing (involve) vs. mean to V1 (intend)', example: 'Try resetting the cache! Learning well means practicing consistently.' },
    ],
    usageRules: [
      'Read context clues carefully: words like "I distinctly recall..." point to + V-ing memories; alarms/reminders point to + to V1 tasks.',
      'Polite formal refusals use "regret to inform / regret to say" (+ to V1 right now), while sorrow over past choices uses "regret saying / regret skipping" (+ V-ing).',
      'Watch passive sensitivity too: "Your bike chain needs oil / needs fixing" (= needs to be fixed!).',
    ],
    exceptions: [
      '"Used to + V1" (past discontinued habit: "I used to skip audio") differs sharply from "be/get used to + V-ing/Noun" (currently accustomed to: "I’m used to commuting early").',
    ],
    examples: [
      { english: 'Did you remember to turn off the studio lamp before locking up?', vietnamese: 'Bạn đã nhớ tắt đèn phòng thu trước khi khóa cửa chưa?' },
      { english: 'I clearly remember listening to my first whole audiobook on a rainy train.', vietnamese: 'Mình vẫn nhớ rõ cảm giác nghe trọn cuốn sách nói đầu tiên trên chuyến tàu trời mưa.' },
      { english: 'Cyclists stopped to check the trail map beside the stone bridge.', vietnamese: 'Những người đạp xe dừng lại để xem bản đồ đường mòn bên cây cầu đá.' },
      { english: 'He stopped drinking late espresso and immediately slept deeper at night.', vietnamese: 'Anh ấy ngừng uống cà phê đậm buổi tối và ngủ sâu hơn hẳn vào ban đêm.' },
      { english: 'If audio clips feel too rapid, try reading the transcript aloud first before listening.', vietnamese: 'Nếu đoạn nghe thấy hơi nhanh, hãy thử đọc to bản chữ trước rồi hãy nghe.' },
    ],
    commonMistakes: [
      { wrong: 'Please remember locking the studio door tonight.', right: 'Please remember to lock the studio door tonight.', why: 'A future responsibility not yet performed takes "to lock", not past-memory "locking".' },
      { wrong: 'She stopped to check her emails because notifications ruined focus.', right: 'She stopped checking her emails constantly because notifications ruined focus.', why: 'Quitting a habit permanently uses "stop + V-ing" ("stopped checking").' },
      { wrong: 'I’m not used to wake up at five yet.', right: 'I’m not used to waking up at five yet.', why: 'Inside "be used to", "to" is a preposition—always follow it with "-ing"!' },
    ],
    comparisons: [
      { structure: 'Used to + V1 vs. Be used to + V-ing', difference: '"I used to live in Hue" (old habit—not anymore!) vs. "I’m used to living in loud cities" (familiar & comfortable now!).', example: 'Never miss that small "am/is/are/get"—it turns V1 directly into V-ing!' },
    ],
    speakingTip: '"Have you tried listening at 0.9x speed first?" sounds far warmer and more coaching-oriented than stiff "Try to improve listening".',
    writingTip: 'Use "Building fluency does not mean memorizing isolated definitions; it means noticing real collocations" gracefully in IELTS essays.',
    reviewSummary: 'Match V-ing to backward memories, quitting habits, and tests; match to-V1 to forward duties, pausing in order to act, and intentions; follow "be used to" with V-ing.',
    quiz: [
      gEx({ id: 'qb2-03-1', topicId: 'gram-b2-03-gerund-infinitive-meaning-shifts', type: 'multiple_choice', instruction: 'Pick the future duty vs. past memory meaning.', prompt: 'I distinctly remember ___ my umbrella inside the café, yet reception hasn’t found it.', options: ['to leave', 'leaving', 'left', 'have to leave'], correctAnswer: 'leaving', explanation: 'Memory of a finished past action uses "remember + V-ing".', difficulty: 2 }),
      gEx({ id: 'qb2-03-2', topicId: 'gram-b2-03-gerund-infinitive-meaning-shifts', type: 'multiple_choice', instruction: 'Choose stopping to act vs. quitting.', prompt: 'Halfway uphill, hikers stopped ___ the misty terraced valley below.', options: ['photographing', 'to photograph', 'photograph', 'photographed'], correctAnswer: 'to photograph', explanation: 'They paused walking IN ORDER TO take photos -> "stopped to photograph".', difficulty: 2 }),
      gEx({ id: 'qb2-03-3', topicId: 'gram-b2-03-gerund-infinitive-meaning-shifts', type: 'error_correction', instruction: 'Fix the "be used to" pattern.', prompt: 'Correct: "Soon you will get used to drive on the right side smoothly."', correctAnswer: 'Soon you will get used to driving on the right side smoothly.', explanation: '"Get used to" ends in preposition "to" requiring gerund "driving".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b2-04-advanced-passive-reporting-causative',
    cefrLevel: 'B2',
    title: 'Impersonal Reporting Passive ("It is said that...") & Causatives ("have something done")',
    summary: 'Report expert consensus objectively in academic prose and distinguish doing repairs yourself vs. hiring a service.',
    summaryVi: 'Bị động Tường thuật khách quan ("It is claimed that / X is thought to...") và Cấu trúc Nhờ vả ("have/get something done").',
    objectives: [
      'Deploy two academic hedging patterns smoothly: "It is widely believed that..." and "Micro-habits are thought to boost retention".',
      'Distinguish personal action ("I repaired my bike") cleanly from hired service ("I had my bike repaired").',
      'Contrast permissive "make someone do / let someone do" (bare V1!) vs. passive "be made TO do" (keeps "to"!).',
    ],
    detailedExplanation:
      'High-band essays avoid vague "People say..." by adopting crisp impersonal reporting structures: either open neutrally ("It is estimated that coastal cities...") or spotlight your subject upfront with an infinitive ("Coastal cities are projected to expand..."). Meanwhile, everyday conversation saves confusion between DIY and services via Causative "have/get + Object + V3": saying "I cut my hair" sounds like you grabbed scissors yourself—whereas "I had my hair cut" credits the barber neatly!',
    structures: [
      { label: 'Impersonal Reporting (It...)', formula: 'It is widely believed / estimated / reported + that + Clause', example: 'It is widely acknowledged that early feedback curbs bad habits.' },
      { label: 'Subject-Fronted Reporting', formula: 'Subject + is/are thought / expected / reported + to + V1 (or have V3)', example: 'Sleep cycles are thought to lock daytime vocabulary cleanly.' },
      { label: 'Causative Service', formula: 'Subject + have / get + Object + V3 (Past Participle)', example: 'We got the leaky balcony tap repaired yesterday afternoon.' },
    ],
    usageRules: [
      'When reported events already happened earlier, shift the infinitive cleanly into perfect form ("Ancient traders are believed TO HAVE SAILED along this coast").',
      'Place Object strictly BETWEEN "have/get" and "V3" ("had my phone fixed", NOT *"had fixed my phone").',
      'In active causatives, "make/let + Person + V1" omits "to", yet if "make" becomes passive ("Workers were made TO wait"), put "to" back!',
    ],
    exceptions: [
      '"Make" in "The workshop had us test five mics" uses active causative "have + Person + V1" (assign gently), differing from "get + Person + TO + V1" ("I got my sister to proofread it").',
    ],
    examples: [
      { english: 'It is widely accepted that brief daily review outlasts exhausting weekend cramming.', vietnamese: 'Mọi người nhìn chung công nhận rằng ôn ngắn mỗi ngày bền hơn nhồi nhét cuối tuần.' },
      { english: 'Protected mangrove swamps are estimated to shelter thousands of coastal homes.', vietnamese: 'Các dải rừng ngập mặn được ước tính che chắn cho hàng nghìn ngôi nhà ven biển.' },
      { english: 'This historic brick clock tower is thought to have stood here since 1898.', vietnamese: 'Tháp đồng hồ gạch cổ này được cho là đã đứng tại đây từ năm 1898.' },
      { english: 'Before flying abroad, Minh had his passport photo updated at a local studio.', vietnamese: 'Trước khi bay ra nước ngoài, Minh đã đi chụp lại ảnh hộ chiếu tại tiệm gần nhà.' },
      { english: 'The calm reading corner gets its floorboards polished every single December.', vietnamese: 'Góc đọc sách yên tĩnh được đánh bóng sàn gỗ mỗi tháng Mười Hai hằng năm.' },
    ],
    commonMistakes: [
      { wrong: 'Yesterday I repaired my glasses at the optician shop.', right: 'Yesterday I had my glasses repaired at the optician shop.', why: 'When a specialist fixes your item for you, use causative "had + Object + V3".' },
      { wrong: 'Employees were made sign long schedules without rest.', right: 'Employees were made to sign long schedules without rest.', why: 'Passive "be made" brings "to" back before the infinitive ("made TO sign").' },
      { wrong: 'Ancient mariners are thought that they crossed the bay early.', right: 'It is thought that ancient mariners crossed the bay early.', why: 'Start with dummy "It" before a "that"-clause, OR use "to have crossed" after personal subject.' },
    ],
    comparisons: [
      { structure: 'It is claimed that X vs. X is claimed to...', difference: 'Both express cautious attribution accurately; subject-fronted "X is thought to..." sounds smoother when connecting back to the previous sentence’s topic.', example: 'Pick impersonal "It..." to introduce new broad statistics cleanly.' },
    ],
    speakingTip: '"I need to get my bike brakes checked before Friday" is the natural everyday way native speakers talk about repair errands.',
    writingTip: 'Use "to have + V3" inside historical/archaeological readings ("These stone jars are believed to have held sea salt") to match B2–C1 evidence hedging.',
    reviewSummary: 'Report consensus via "It is thought that..." or "X is thought to (have) V...", place object before V3 in causatives, and restore "to" after passive "be made".',
    quiz: [
      gEx({ id: 'qb2-04-1', topicId: 'gram-b2-04-advanced-passive-reporting-causative', type: 'multiple_choice', instruction: 'Pick the natural causative word order.', prompt: 'My cousin ___ last week before her graduation photos.', options: ['cut her hair at the salon', 'had her hair cut', 'had cut her hair', 'got to cut hair'], correctAnswer: 'had her hair cut', explanation: 'Place Object ("her hair") cleanly between "had" and V3 ("cut").', difficulty: 2 }),
      gEx({ id: 'qb2-04-2', topicId: 'gram-b2-04-advanced-passive-reporting-causative', type: 'multiple_choice', instruction: 'Use perfect infinitive for earlier past reporting.', prompt: 'Those coastal canals are estimated ___ nearly five centuries ago.', options: ['to dig', 'to be dug', 'to have been dug', 'having dug'], correctAnswer: 'to have been dug', explanation: 'Earlier finished passive construction takes perfect passive infinitive "to have been + V3".', difficulty: 3 }),
      gEx({ id: 'qb2-04-3', topicId: 'gram-b2-04-advanced-passive-reporting-causative', type: 'error_correction', instruction: 'Fix passive "be made".', prompt: 'Correct: "Waiters were made stand outside during repairs."', correctAnswer: 'Waiters were made to stand outside during repairs.', explanation: 'Passive "were made" requires "to" before bare infinitive "stand".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b2-05-future-continuous-and-perfect',
    cefrLevel: 'B2',
    title: 'Future Continuous ("will be V-ing") & Future Perfect ("will have V3")',
    summary: 'Project scenes in progress at an exact future hour and announce deadlines completed cleanly by a milestone date.',
    summaryVi: 'Tương lai Tiếp diễn (đang diễn ra tại một mốc tương lai) và Tương lai Hoàn thành (hoàn tất trước mốc tương lai).',
    objectives: [
      'Form "will be + V-ing" to depict an action mid-flight at a future clock point ("At 10 tomorrow, we’ll be boarding").',
      'Form "will have + V3" with "by + time" to state what will ALREADY finish before a deadline ("By Friday, she will have reviewed 50 cards").',
      'Ask polite non-pushy inquiries about someone’s existing plans with Future Continuous ("Will you be passing the post office?").',
    ],
    detailedExplanation:
      'Think forward like looking at tomorrow’s clock: Future Continuous puts your viewer right INSIDE an ongoing future moment ("This time next Tuesday I’ll be sipping tea on the express train north"). Future Perfect instead places your viewer right AFTER a future milestone looking back ("By midnight Friday, our team will have checked all 600 exercises!"). Pairing "by + deadline" with "will have + V3" immediately shines in project reports and IELTS forecasts.',
    structures: [
      { label: 'In Progress at Future Moment', formula: 'Subject + will (not) be + V-ing (+ at [time] tomorrow)', example: 'Don’t phone at 8 p.m.—we’ll be eating family dinner.' },
      { label: 'Finished Before Future Cutoff', formula: 'By [future point], Subject + will (not) have + V3', example: 'By next June, Linh will have lived in Hanoi for five years.' },
      { label: 'Completed Duration Lookback', formula: 'will have been + V-ing + for [duration]', example: 'By noon, hikers will have been climbing for four hours.' },
    ],
    usageRules: [
      'Always anchor Future Perfect with clear prepositions like "by then, by December, by the end of the term, before Friday".',
      'Future Continuous softens favors politely ("Will you be using the projector at two?" sounds gentler than blunt "Are you going to let me take it?").',
      'Keep future time clauses ("by the time + Present Simple") free of "will" ("By the time you land, we’ll have prepared tea").',
    ],
    exceptions: [
      'Even in Future Perfect duration ("will have been working"), switch back cleanly to "will have + V3" for stative verbs ("By May, I’ll have known Minh for ten years").',
    ],
    examples: [
      { english: 'This time next Saturday morning, we’ll be strolling calmly through Da Lat flower stalls.', vietnamese: 'Giờ này sáng thứ Bảy tuần sau, chúng mình sẽ đang dạo bước bình yên qua các sạp hoa Đà Lạt.' },
      { english: 'By the end of this term, students will have practiced over six hundred contextual exercises.', vietnamese: 'Đến cuối học kỳ này, học viên sẽ đã luyện hơn sáu trăm bài tập theo ngữ cảnh.' },
      { english: 'By the time your night bus reaches the station, our host will already have set the lights on.', vietnamese: 'Đến lúc xe đêm của bạn vào bến, chủ nhà sẽ đã bật sẵn đèn rồi.' },
      { english: 'Will you be cycling past the main pharmacy later this afternoon?', vietnamese: 'Chiều nay bạn có tiện đạp xe ngang qua hiệu thuốc lớn không?' },
      { english: 'Hopefully by 2030, electric commuter rail will have cut downtown gridlock noticeably.', vietnamese: 'Hy vọng tới năm 2030, đường sắt đô thị điện sẽ đã giảm rõ rệt cảnh kẹt xe trung tâm.' },
    ],
    commonMistakes: [
      { wrong: 'By next month, our club will finish translating ten chapters.', right: 'By next month, our club will have finished translating ten chapters.', why: '"By [deadline]" signals completion BEFORE that boundary—use Future Perfect "will have + V3".' },
      { wrong: 'By the time they will arrive downtown, shops will have closed.', right: 'By the time they arrive downtown, shops will have closed.', why: 'No "will" inside "By the time..." clauses—use Present Simple "arrive".' },
      { wrong: 'Tomorrow at 9 a.m. I will write my final exam.', right: 'Tomorrow at 9 a.m. I will be writing my final exam.', why: 'Action already mid-progress at a clock snapshot favors Future Continuous "will be writing".' },
    ],
    comparisons: [
      { structure: 'will V1 vs. will be V-ing vs. will have V3', difference: '9:00 starts ("The film will start at 9"); 9:30 in progress ("We’ll be watching at 9:30"); 11:30 finished ("It will have ended by 11:30").', example: 'One movie night illustrates all three future tenses cleanly!' },
    ],
    speakingTip: 'Use "Will you be heading downtown later?" when hoping gently for a lift—polite, non-demanding, and native-natural!',
    writingTip: 'Use "By 2035, urban solar grids will have expanded..." in IELTS essays looking toward future projections.',
    reviewSummary: 'Picture an ongoing future clock point with will be V-ing, announce deadline completion with By X + will have V3, and drop "will" inside "by the time" clauses.',
    quiz: [
      gEx({ id: 'qb2-05-1', topicId: 'gram-b2-05-future-continuous-and-perfect', type: 'multiple_choice', instruction: 'Match completion before a deadline.', prompt: 'By next Friday afternoon, Minh ___ all eight B2 grammar summaries.', options: ['reviews', 'will be reviewing', 'will have reviewed', 'has reviewed'], correctAnswer: 'will have reviewed', explanation: '"By next Friday" + completed countable milestone demands Future Perfect "will have reviewed".', difficulty: 2 }),
      gEx({ id: 'qb2-05-2', topicId: 'gram-b2-05-future-continuous-and-perfect', type: 'multiple_choice', instruction: 'Pick ongoing future snapshot.', prompt: 'Please wait until ten to phone An; at nine tonight she ___ her evening violin class.', options: ['will teach', 'will be teaching', 'will have taught', 'is taught'], correctAnswer: 'will be teaching', explanation: 'Ongoing activity right at 9 p.m. uses Future Continuous "will be teaching".', difficulty: 1 }),
      gEx({ id: 'qb2-05-3', topicId: 'gram-b2-05-future-continuous-and-perfect', type: 'error_correction', instruction: 'Fix "will" inside future time clause.', prompt: 'Correct: "By the time autumn will begin, roof panels will have been tested."', correctAnswer: 'By the time autumn begins, roof panels will have been tested.', explanation: 'Never place "will" inside a "by the time" time clause.', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b2-06-relative-adverb-clauses-prepositions',
    cefrLevel: 'B2',
    title: 'Formal Relative Clauses (Preposition + Whom / Which) & Sentential ", which"',
    summary: 'Elevate formal writing gracefully using "in which, by which, through which" and smooth whole-clause ", which" comments.',
    summaryVi: 'Mệnh đề Quan hệ trang trọng (giới từ + whom/which) và mệnh đề ", which" nhận xét cả vế câu.',
    objectives: [
      'Choose "Preposition + whom" (people) and "Preposition + which" (things/processes) naturally in academic descriptions.',
      'Comment smoothly on an entire previous clause using ", which + singular verb" without comma-splice errors.',
      'Avoid prepositional doubling (keeping "where" clean without a dangling "in" at the end!).',
    ],
    detailedExplanation:
      'Casual English loves tossing prepositions politely at the end of a relative clause ("the bench I sat ON", "the friend I worked WITH"). Academic, legal, and formal IELTS writing often moves that preposition neatly in front of "which" or "whom"—creating elegant rhythms ("the policy ON WHICH our roadmap rests", "the coordinator WITH WHOM she collaborated"). Remember a golden rule: right after ANY preposition, "who" switches strictly into "whom", and "that" NEVER follows a preposition (*"in that" as relative is ungrammatical; use "in which" or "whereby")!',
    structures: [
      { label: 'Formal Preposition Fronting', formula: 'Noun + Prep + whom (people) / which (things) + Subject + Verb', example: 'This is the transparent rubric by which every essay is evaluated.' },
      { label: 'Process Mechanism', formula: 'a system / method + whereby / in which + Clause', example: 'SM-2 schedules intervals whereby older words return right before fading.' },
      { label: 'Whole-Clause Commentary', formula: '[Complete Clause], + which + Singular Verb', example: 'Urban buses ran every eight minutes, which slashed morning car delays.' },
    ],
    usageRules: [
      'Always use singular verb forms right after whole-clause ", which" (", which MAKES", never *"make", because an entire idea is singular).',
      'NEVER place "that" directly after a preposition (*"the tools with that we build" -> "the tools with which we build" or "the tools [that] we build with").',
      'Never pair "where" with an extra preposition at the end (*"the town where I live IN" -> either "where I live" OR "that I live in").',
    ],
    exceptions: [
      'Prepositional phrasal verbs stay intact rather than splitting awkwardly ("look after, put up with"): keep "the children whom she looked after", NOT *"the children after whom she looked"!).',
    ],
    examples: [
      { english: 'Transparency is the core standard to which every educational audit must conform.', vietnamese: 'Tính minh bạch là chuẩn mực cốt lõi mà mọi cuộc rà soát giáo dục phải tuân thủ.' },
      { english: 'Our neighborhood planted eighty shade trees along the canal, which lowered sidewalk heat noticeably.', vietnamese: 'Khu phố đã trồng tám mươi cây bóng mát dọc kênh, điều đó giúp giảm nhiệt vỉa hè rõ rệt.' },
      { english: 'The bilingual mentor with whom An practiced daily later reviewed her scholarship essay.', vietnamese: 'Người cố vấn song ngữ mà An luyện tập hằng ngày cùng sau đó đã sửa bài luận học bổng cho cô.' },
      { english: 'Identify clear learning goals toward which weekly quizzes contribute step by step.', vietnamese: 'Xác định mục tiêu học tập rõ ràng mà các bài kiểm tra hằng tuần góp phần xây dựng từng bước.' },
      { english: 'Evening workshops ended precisely at eight, leaving commuters plenty of time—which everyone appreciated.', vietnamese: 'Buổi chuyên đề tối kết thúc đúng tám giờ, tạo nhiều thời gian cho người đi làm—điều ai cũng đánh giá cao.' },
    ],
    commonMistakes: [
      { wrong: 'This is the framework through that progress scores remain fair.', right: 'This is the framework through which progress scores remain fair.', why: 'Never put "that" right after a preposition—use "which".' },
      { wrong: 'Public solar buses cut air smoke, what delighted local families.', right: 'Public solar buses cut air smoke, which delighted local families.', why: 'Sentential comment clauses after commas ALWAYS use ", which", never *", what".' },
      { wrong: 'That is the quiet bookshop where we studied together in last May.', right: 'That is the quiet bookshop where we studied together last May.', why: '"Where" already equals "in which"—delete the extra stranded "in"!' },
    ],
    comparisons: [
      { structure: 'Informal End Prep vs. Formal Front Prep', difference: '"The method they rely on" (warm & spoken) vs. "The method on which they rely" (crisp academic essay style).', example: 'Match preposition position to spoken vs. formal writing audience.' },
    ],
    speakingTip: 'Keep prepositions naturally at the end in normal speech ("the cafe we met at") so you never sound stiff over coffee—save "at which" for academic talks!',
    writingTip: 'Pair ", which..." commentary selectively in IELTS Writing Task 2 to evaluate real consequences smoothly inside one cohesive sentence.',
    reviewSummary: 'Put whom/which (never "that"!) immediately after fronted prepositions, use ", which + singular verb" (never ", what") for whole-clause remarks, and never strand extra prepositions behind "where".',
    quiz: [
      gEx({ id: 'qb2-06-1', topicId: 'gram-b2-06-relative-adverb-clauses-prepositions', type: 'multiple_choice', instruction: 'Select valid formal preposition relative.', prompt: 'Reliability is the principle ___ this curriculum framework rests.', options: ['on that', 'on which', 'on what', 'where on'], correctAnswer: 'on which', explanation: 'Prepositions may precede "which" or "whom", never "that" or "what".', difficulty: 2 }),
      gEx({ id: 'qb2-06-2', topicId: 'gram-b2-06-relative-adverb-clauses-prepositions', type: 'multiple_choice', instruction: 'Pick whole-clause comment linker.', prompt: 'Automated checks flagged two missing items before build, ___ saved hours later.', options: ['that', 'what', 'which', 'whom'], correctAnswer: 'which', explanation: 'Whole-clause retrospective comment after comma takes ", which".', difficulty: 1 }),
      gEx({ id: 'qb2-06-3', topicId: 'gram-b2-06-relative-adverb-clauses-prepositions', type: 'error_correction', instruction: 'Eliminate preposition doubling with "where".', prompt: 'Correct: "Here is the bright terrace where our study club meets at."', correctAnswer: 'Here is the bright terrace where our study club meets.', acceptableAnswers: ['Here is the bright terrace that our study club meets at.', 'Here is the bright terrace at which our study club meets.'], explanation: '"Where" already replaces "at the terrace"—drop stranded "at".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b2-07-complex-prepositional-linkers',
    cefrLevel: 'B2',
    title: 'Complex Essay Connectors: Providing / Provided / In Case / Notwithstanding',
    summary: 'Express precise conditions ("provided that"), safety precautions ("in case"), and concessive contrast crisply.',
    summaryVi: 'Cụm từ nối nâng cao cho bài luận: provided that (miễn là), in case (phòng khi), rather than, apart from.',
    objectives: [
      'Separate urgent backup prep ("in case" = prepare BEFORE just possibly happening) cleanly from strict conditions ("if" = only act IF it happens).',
      'Upgrade repetitive "if" clauses smoothly with formal conditional "provided (that) / as long as / on condition that".',
      'Balance contrasting alternatives clearly using "rather than + bare verb / -ing" and "apart from".',
    ],
    detailedExplanation:
      'Many learners accidentally swap "in case" and "if"—causing hilarious real confusion! Say "Carry a light rain poncho IN CASE it showers" = pack it NOW even under blue skies as safe insurance! Contrast "Open the rain poncho IF it starts pouring" = wait until drops fall! Meanwhile, elevate B2 persuasive essays smoothly with clear conditional anchors ("Provided daily audio clips stay under three minutes, busy adults sustain consistent practice") and crisp contrast frames ("rather than").',
    structures: [
      { label: 'Backup Precaution', formula: 'Main Clause + in case + Present Simple / should + V1', example: 'Keep offline PDF summaries in case train tunnels drop Wi-Fi.' },
      { label: 'Strict Requirement ("only if")', formula: 'Provided (that) / As long as / On condition that + Present Simple, Future Result', example: 'You may borrow two extra novels provided that you return both Friday.' },
      { label: 'Preference Comparison', formula: 'Verb + A + rather than + B (parallel form!)', example: 'Trainers encourage paraphrasing aloud rather than translating silently.' },
    ],
    usageRules: [
      'NEVER insert future "will" inside "provided that", "as long as", or "in case" ("in case it rains", NOT *"in case it will rain").',
      'Watch parallel verb forms around "rather than": if opening with "To improve..., learners should practice..." use base verb or -ing cleanly ("rather than cram / rather than cramming").',
      'Distinct from "in case OF + Noun" ("In case of fire, use stairs") vs. "in case + Subject + Verb" ("Pack boots in case roads mud up").',
    ],
    exceptions: [
      'Formal safety signs sometimes use "should" softly inside "in case": "Take spare coins in case the meter should reject notes."',
    ],
    examples: [
      { english: 'Bring an extra notebook tomorrow in case our workshop runs interactive pair games.', vietnamese: 'Mang thêm quyển sổ tay ngày mai phòng khi buổi workshop có trò chơi thực hành theo cặp.' },
      { english: 'Neighborhood parks thrive beautifully as long as local volunteers steward young saplings.', vietnamese: 'Công viên khu phố xanh tốt miễn là tình nguyện viên địa phương chăm nom cây non.' },
      { english: 'The scholarship renews each semester provided that students attend weekly seminars regularly.', vietnamese: 'Học bổng được gia hạn từng kỳ với điều kiện sinh viên dự hội thảo hằng tuần đều đặn.' },
      { english: 'Urban architects chose breathable brick walkways rather than heat-trapping dark asphalt.', vietnamese: 'Kiến trúc sư đô thị chọn lối đi gạch thoáng khí thay vì nhựa đường sẫm giữ nhiệt.' },
      { english: 'Early rainy forecasts notwithstanding, three hundred community planters gathered by dawn.', vietnamese: 'Bất chấp dự báo mưa sớm, ba trăm người trồng cây cộng đồng đã tập trung từ bình minh.' },
    ],
    commonMistakes: [
      { wrong: 'Pack spare warm gloves if the ridge turns frosty tonight.', right: 'Pack spare warm gloves in case the ridge turns frosty tonight.', why: 'Packing gloves ahead as safeguard against uncertainty uses "in case", not "if".' },
      { wrong: 'Keep quiet inside the studio in case of someone records audio.', right: 'Keep quiet inside the studio in case someone records audio.', why: '"In case of" wants a short NOUN ("in case of rain"); use bare "in case" before full clauses.' },
      { wrong: 'I prefer biking to work rather than drive through traffic.', right: 'I prefer biking to work rather than driving through traffic.', why: 'Parallel "-ing" forms match smoothly on both sides of "rather than".' },
    ],
    comparisons: [
      { structure: '"In case" vs. "In case of" vs. "If"', difference: 'In case + Clause = preemptive shield; In case of + Noun = safety sign; If + Clause = reactive trigger.', example: 'Carry snacks in case the train stalls; call help in case of emergency!' },
    ],
    speakingTip: '"As long as..." sounds completely relaxed and idiomatic in daily talks ("Sure, stay as long as you need!").',
    writingTip: '"Provided that..." and "Rather than..." deliver immediate crisp B2–C1 syntactic range in policy paragraphs.',
    reviewSummary: 'Use "in case" (+ Clause) vs. "in case of" (+ Noun) for safeguards, "provided/as long as" for strict conditions without "will", and mirror parallel grammar across "rather than".',
    quiz: [
      gEx({ id: 'qb2-07-1', topicId: 'gram-b2-07-complex-prepositional-linkers', type: 'multiple_choice', instruction: 'Separate preemptive precaution from trigger.', prompt: 'Download offline reading modules tonight ___ train Wi-Fi cuts out tomorrow morning.', options: ['if', 'in case', 'in case of', 'unless'], correctAnswer: 'in case', explanation: 'Taking preventative action beforehand ("download tonight") takes "in case" + Clause.', difficulty: 2 }),
      gEx({ id: 'qb2-07-2', topicId: 'gram-b2-07-complex-prepositional-linkers', type: 'multiple_choice', instruction: 'Keep form parallel across "rather than".', prompt: 'Effective learners focus on mastering collocations ___ isolated translation lists.', options: ['rather than memorize', 'rather than memorizing', 'instead memorize', 'despite memorizing'], correctAnswer: 'rather than memorizing', explanation: '"On mastering..." (preposition + -ing) pairs cleanly with parallel "-ing" ("rather than memorizing").', difficulty: 2 }),
      gEx({ id: 'qb2-07-3', topicId: 'gram-b2-07-complex-prepositional-linkers', type: 'fill_blank', instruction: 'Distinguish "in case" vs "in case of".', prompt: 'Red exits stay unlocked ___ an unexpected building evacuation.', correctAnswer: 'in case of', explanation: 'Short noun phrase "an unexpected building evacuation" follows "in case of".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-b2-08-subjunctive-hedging-cleft-intro',
    cefrLevel: 'B2',
    title: 'Cleft Focus Sentences ("It is ... that" / "What ... is") & Polite Hedging',
    summary: 'Spotlight key causes cleanly with cleft focus structures and temper strong claims politely using academic hedges.',
    summaryVi: 'Câu chẻ nhấn mạnh trọng tâm (It is... that / What... is) và Ngôn ngữ rào đón lịch sự trong học thuật.',
    objectives: [
      'Isolate spotlight reasons smoothly via It-clefts ("It is daily spacing—not weekend marathons—that shapes long-term recall").',
      'Engage listeners upfront with What-clefts ("What surprises beginners most is silent vowel reduction").',
      'Swap aggressive sweeping claims ("Everyone agrees technology always helps") for credible hedged B2–C1 generalizations.',
    ],
    detailedExplanation:
      'Strong arguments shine when key insights stand clearly under a clean stage spotlight instead of hiding at the back of flat clauses. Two structures build that spotlight naturally: **It-clefts** ("It is consistent habits that turn effort into fluency") and **Wh-clefts** ("What learners crave most is respectful, concrete feedback"). Pair focus sentences with thoughtful academic **hedging** ("tends to, is likely to, arguably, to a certain extent, frequently") so your claims stay resilient against sharp counter-examples!',
    structures: [
      { label: 'It-Cleft Spotlight', formula: 'It is / was + [Focused Noun/Reason] + that / who + Rest of Clause', example: 'It is context, rather than length, that makes words memorable.' },
      { label: 'What-Cleft Hook', formula: 'What + Subject + Verb + is / was + Focused Point', example: 'What cities urgently need is protected pedestrian shade.' },
      { label: 'Credible Academic Hedging', formula: 'tend to / appear to / may / arguably / in many contexts', example: 'Overly noisy alerts tend to discourage quiet daily focus.' },
    ],
    usageRules: [
      'Always treat a singular opening "What + Clause..." as a SINGULAR subject taking "is/was" ("What helps learners IS steady pacing", unless highlighting explicit plural nouns casually).',
      'Pair It-cleft spotlights cleanly with contrast ("It was funding delays, NOT design flaws, that slowed the rail line").',
      'Balance hedging gently—one strong hedge ("tends to", "frequently") beats stacking three insecure words (*"It seems maybe perhaps kind of helpful").',
    ],
    exceptions: [
      '"What..." can spotlight verbs too using optional "to" ("What we should do first is [to] verify unique IDs").',
    ],
    examples: [
      { english: 'It is consistent daily listening, rather than memorizing isolated word lists, that sharpens rhythm.', vietnamese: 'Chính việc nghe đều đặn hằng ngày, chứ không phải học thuộc danh sách từ rời, giúp tinh chỉnh nhịp điệu.' },
      { english: 'What distinguishes C1 essays most clearly is cohesive paragraph transitions rather than flashy adjectives.', vietnamese: 'Điều phân biệt rõ nhất bài luận C1 là chuyển đoạn mạch lạc thay vì tính từ cầu kỳ.' },
      { english: 'Dedicated tram lanes appear to raise local café foot traffic even where car spots shrink.', vietnamese: 'Làn tàu điện riêng dường như làm tăng lượng khách đi bộ ghé quán dù chỗ đỗ ô tô thu hẹp.' },
      { english: 'It was only after switching to offline audio cards that evening train commutes turned productive.', vietnamese: 'Chỉ sau khi chuyển sang thẻ âm thanh ngoại tuyến thì chuyến tàu tối mới trở nên hiệu quả.' },
      { english: 'Strict grammar rules alone tend to overwhelm beginners unless paired with lively sample dialogue.', vietnamese: 'Chỉ quy tắc ngữ pháp khô khan thường dễ làm người mới ngợp trừ khi đi cùng hội thoại sinh động.' },
    ],
    commonMistakes: [
      { wrong: 'What motivates most adult students are friendly weekly targets.', right: 'What motivates most adult students is having clear weekly targets.', why: 'Opening clause "What motivates..." functions grammatically as a singular idea taking "is" (or align clearly with plural noun).' },
      { wrong: 'It was Minh which fixed all the broken audio tracks.', right: 'It was Minh who fixed (or that fixed) all the broken audio tracks.', why: 'Keep "who / that" for spotlighted people inside It-clefts, never "which".' },
      { wrong: 'Every teenager without exception loves studying early morning.', right: 'Teenagers frequently struggle with early morning study schedules.', why: 'Replace absolute exaggeration ("every... without exception") with accurate hedged wording.' },
    ],
    comparisons: [
      { structure: 'It-Cleft vs. Passive Focus', difference: 'Passive drops/moves agents smoothly; It-cleft punches sharp contrast ("It was THE BATTERY, not the software, that failed").', example: 'Use It-clefts specifically when correcting misunderstandings or spotlighting key priorities.' },
    ],
    speakingTip: '"What I appreciate most about that café is..." sounds wonderfully natural and gives you an extra half-second to organize thoughts during IELTS Speaking!',
    writingTip: 'Review every "always / never / everyone / all" inside your IELTS Task 2 draft and soften sweeping assertions into "widely / frequently / in many urban areas".',
    reviewSummary: 'Use It-clefts (It is X that...) and What-clefts (What X needs is...) to highlight central claims, supported by natural academic hedges like tend to and appear to.',
    quiz: [
      gEx({ id: 'qb2-08-1', topicId: 'gram-b2-08-subjunctive-hedging-cleft-intro', type: 'multiple_choice', instruction: 'Complete the cleft focus accurately.', prompt: 'It was the broken microphone cable, rather than software latency, ___ distorted the clip.', options: ['who', 'what', 'that', 'where'], correctAnswer: 'that', explanation: 'It-clefts spotlighting things take "that" (never "what").', difficulty: 1 }),
      gEx({ id: 'qb2-08-2', topicId: 'gram-b2-08-subjunctive-hedging-cleft-intro', type: 'sentence_transformation', instruction: 'Spotlighting via What-cleft.', prompt: 'Rewrite using "What": "Learners need supportive contextual examples first." -> What learners...', correctAnswer: 'What learners need first is supportive contextual examples.', acceptableAnswers: ['What learners need first are supportive contextual examples.'], explanation: 'Move focused object behind "What learners need first is...".', difficulty: 2 }),
      gEx({ id: 'qb2-08-3', topicId: 'gram-b2-08-subjunctive-hedging-cleft-intro', type: 'multiple_choice', instruction: 'Select the strongest academic hedge.', prompt: 'Which revision sounds most credible for an academic IELTS essay?', options: ['Homework apps always ruin handwriting completely.', 'Heavy screen homework may reduce handwritten practice unless schools balance both.', 'All kids never write neatly nowadays.', 'Maybe apps kind of sort of stop writing.'], correctAnswer: 'Heavy screen homework may reduce handwritten practice unless schools balance both.', explanation: 'Cautious modal "may" + realistic condition produces poised scholarly balance.', difficulty: 2 }),
    ],
  }),
];
