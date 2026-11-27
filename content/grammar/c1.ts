import type { GrammarTopic } from '@english-quest/shared';
import { createGrammarLesson, gEx } from './helpers';

export const C1_GRAMMAR_TOPICS: GrammarTopic[] = [
  createGrammarLesson({
    id: 'gram-c1-01-negative-inversion-emphasis',
    cefrLevel: 'C1',
    title: 'Negative & Restrictive Inversion ("Never have I...", "Not only...", "Seldom")',
    summary: 'Front negative or restrictive adverbials cleanly using crisp auxiliary-before-subject question inversion for formal emphasis.',
    summaryVi: 'Đảo ngữ với cụm từ phủ định hoặc giới hạn đứng đầu câu (Never, Not only, Hardly, Seldom, Only after).',
    objectives: [
      'Invert Helper Verb + Subject accurately right after fronted negatives ("Never have we observed...", "Seldom does sunlight reach...").',
      'Apply "Only after / Only when / Not until" delayed inversion correctly—investing the MAIN clause rather than the subordinate clause!',
      'Form "No sooner ... than" and "Hardly/Scarcely ... when" smoothly with Past Perfect.',
    ],
    detailedExplanation:
      'In natural academic rhetoric and C1 proficiency prose, opening a sentence with a limiting negative expression ("Never before, Rarely, Little, Under no circumstances, Not only") triggers crisp auxiliary inversion: Helper Verb steps BEFORE the Subject just like a question, except punctuation ends calmly with a period! Watch English’s trickiest delayed trap carefully: inside **"Not until / Only after / Only when"**, keep normal subject-verb order inside the opening time phrase and apply inversion ONLY in the MAIN clause that follows ("Only after testing offline DID engineers ship the update").',
    structures: [
      { label: 'Direct Fronted Negative', formula: 'Negative/Restrictive Adverbial + Auxiliary (do/does/did/have/had/can) + Subject + Verb', example: 'Rarely have urban transit reforms paid off so quickly.' },
      { label: 'Not Only ... But Also', formula: 'Not only + Aux + Subject + Verb, but Subject + also + Verb', example: 'Not only does reading expand lexicon, but it also sharpens intuitive syntax.' },
      { label: 'Delayed Main-Clause Inversion', formula: 'Only after / Not until + Time Phrase/Clause + [Aux + Subject + Main Verb]', example: 'Not until midnight did the coastal ferry dock safely.' },
    ],
    usageRules: [
      'If the positive clause had no helper verb, insert "do / does / did" right after the fronted phrase ("Never did she complain").',
      'Notice preposition partner precision: "No sooner + had + S + V3 ... THAN" vs. "Hardly / Scarcely + had + S + V3 ... WHEN".',
      'Use "Under no circumstances" and "On no account" strictly with positive verbs because the fronted phrase already carries the negative ("On no account MUST you leave", NEVER *"mustn’t").',
    ],
    exceptions: [
      '"Only + Subject" at sentence start ("Only a few researchers noticed...") does NOT invert because "only" modifies the subject directly, not a fronted adverbial.',
    ],
    examples: [
      { english: 'Never before have language apps offered clear offline IPA decks without ads.', vietnamese: 'Chưa từng bao giờ các ứng dụng ngôn ngữ cung cấp bộ thẻ IPA ngoại tuyến rõ ràng không quảng cáo đến vậy.' },
      { english: 'Not only did community gardens cool narrow lanes, but they also united neighbors.', vietnamese: 'Vườn cộng đồng không chỉ làm mát các con ngõ nhỏ mà còn gắn kết hàng xóm.' },
      { english: 'Only after verifying every source link did the curriculum team open the library.', vietnamese: 'Chỉ sau khi kiểm chứng mọi liên kết nguồn, đội ngũ giáo trình mới mở thư viện.' },
      { english: 'No sooner had the train pulled away than gentle autumn rain started falling.', vietnamese: 'Tàu vừa mới rời bến thì cơn mưa thu nhẹ bất ngờ rơi xuống.' },
      { english: 'Under no circumstances should reviewers count unverified filler lines as authentic units.', vietnamese: 'Trong bất kỳ hoàn cảnh nào, người kiểm định cũng không nên đếm dòng độn rỗng thành bài học thật.' },
    ],
    commonMistakes: [
      { wrong: 'Only after arrived home did she realize she lost her ticket.', right: 'Only after arriving home (or she arrived home) did she realize she had lost her ticket.', why: 'Check the first half cleanly, and remember to invert ONLY the second MAIN clause ("did she realize").' },
      { wrong: 'No sooner had we sat down when our order arrived.', right: 'No sooner had we sat down than our order arrived.', why: '"No sooner" is a comparative pairing strictly with "than", never "when".' },
      { wrong: 'Seldom I have heard such calm, balanced pronunciation feedback.', right: 'Seldom have I heard such calm, balanced pronunciation feedback.', why: 'Fronting restrictive "Seldom" triggers auxiliary inversion ("have I", not "I have").' },
    ],
    comparisons: [
      { structure: '"Not until" Inversion Placement', difference: 'WRONG: *"Not until did it stop raining we walked." -> RIGHT: "Not until it stopped raining DID we walk."', example: 'Invert the main result clause, NEVER inside the "until/after" opener.' },
    ],
    speakingTip: 'Use "Little did I know..." playfully when narrating surprising personal turns in speeches or IELTS Part 2 storytelling.',
    writingTip: 'Deploy at most ONE crisp negative inversion ("Not only does public rail reduce emissions...") per essay so its dramatic emphasis hits hard instead of feeling theatrical.',
    reviewSummary: 'Invert Auxiliary + Subject behind fronted negatives (Never, Seldom, Not only), invert ONLY the second main clause after Not until/Only when, and pair No sooner...than cleanly.',
    quiz: [
      gEx({ id: 'qc1-01-1', topicId: 'gram-c1-01-negative-inversion-emphasis', type: 'multiple_choice', instruction: 'Pick the clean delayed inversion.', prompt: 'Only after independent tests passed ___ ready for release.', options: ['did inspectors declare the release', 'inspectors declared the bridge', 'had inspectors declare the release', 'were inspectors declare'], correctAnswer: 'did inspectors declare the release', explanation: 'Fronted "Only after..." keeps its own clause normal and inverts the following MAIN clause ("did inspectors declare").', difficulty: 2 }),
      gEx({ id: 'qc1-01-2', topicId: 'gram-c1-01-negative-inversion-emphasis', type: 'multiple_choice', instruction: 'Match comparative "No sooner" correlative.', prompt: 'No sooner had Minh saved the updated draft ___ his screen battery warned ten percent.', options: ['when', 'than', 'that', 'after'], correctAnswer: 'than', explanation: '"No sooner..." pairs strictly with comparative "than".', difficulty: 1 }),
      gEx({ id: 'qc1-01-3', topicId: 'gram-c1-01-negative-inversion-emphasis', type: 'sentence_transformation', instruction: 'Transform using fronted "Not only".', prompt: 'Elevate: "Electric buses reduce fumes and also quiet city avenues." -> Not only...', correctAnswer: 'Not only do electric buses reduce fumes, but they also quiet city avenues.', explanation: 'Invert Present Simple plural "buses" with helper "do" right behind "Not only".', difficulty: 3 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c1-02-inverted-conditionals-ellipsis',
    cefrLevel: 'C1',
    title: 'Inverted Conditionals ("Were...", "Had...", "Should...") & Substitution',
    summary: 'Drop "if" smoothly in formal hypotheticals ("Had engineers known...") and avoid clumsy noun repetition using "so / not / do so / one".',
    summaryVi: 'Đảo ngữ Điều kiện trang trọng (Should / Were / Had) và Phép thay thế tránh lặp từ (so, neither, do so, that/those of).',
    objectives: [
      'Invert Type 1 ("Should you need assistance..."), Type 2 ("Were solar cheaper / Were I to decide..."), and Type 3 ("Had she arrived earlier...") dropping "if" cleanly.',
      'Handle inverted negative conditionals properly WITHOUT contracting ("Had he NOT checked", NEVER *"Hadn’t he checked"!).',
      'Eliminate repetitive nouns in academic comparisons using crisp demonstrative substitution ("that of / those of / do so").',
    ],
    detailedExplanation:
      'Academic writing loves calm conditional inversion because deleting "if" compresses prose immediately into polished formal authority. Remember the three timeless C1 keys: **Should + Subject + V1** softens formal Type 1 ("Should questions arise, contact support"), **Were + Subject (+ to V1)** replaces Type 2 ("Were cities to expand shaded tram stops..."), and **Had + Subject + V3** elevates Type 3 ("Had researchers waited another decade..."). Watch negative contractions: inside formal inverted conditionals, NEVER contract "n’t" before the subject—spell out **"Had we NOT checked..."** cleanly!',
    structures: [
      { label: 'Inverted Conditional 1 / 2 / 3', formula: 'Should S V1 | Were S (+ Adj / to V1) | Had S V3', example: 'Were teachers given lighter grading duties, creative mentoring would bloom.' },
      { label: 'Strict Uncontracted Negative', formula: 'Had / Were / Should + Subject + NOT + ...', example: 'Had you not spotted that broken ID, the release would have failed.' },
      { label: 'Academic Comparison Substitution', formula: 'Singular Noun -> that of  |  Plural Nouns -> those of  |  Repeat Verb -> do so', example: 'Urban density in Tokyo exceeds that of Hanoi; rail fares match those of Seoul.' },
    ],
    usageRules: [
      'Use "Were + Subject + to + V1" specifically for imaginary actions in Inverted Type 2 ("Were prices to fall tomorrow", NEVER *"Worked prices..." or *"Did prices fall...").',
      'Replace repeated repeated singular nouns cleanly with "that of" and plurals with "those of" ("The air quality inside parks beats THAT OF highway junctions").',
      'Substitute verbose repeated verb phrases gracefully using "do so / did so / doing so".',
    ],
    exceptions: [
      'Fixed idiomatic subjunctive "Were it not for + Noun" / "Had it not been for + Noun" ("Had it not been for your note, I’d have missed the train") equals "But for / Without".',
    ],
    examples: [
      { english: 'Should any discrepancy appear between audio and transcript, flag it via our feedback form.', vietnamese: 'Nếu có bất kỳ sai lệch nào giữa bản nghe và chữ viết, hãy báo qua biểu mẫu góp ý.' },
      { english: 'Were rural clinics to receive solar refrigeration, vaccine spoilage would plummet.', vietnamese: 'Nếu trạm y tế nông thôn được trang bị tủ lạnh năng lượng mặt trời, tỷ lệ hỏng vắc-xin sẽ giảm mạnh.' },
      { english: 'Had planners not saved those waterfront pines in 2010, summers today would feel brutal.', vietnamese: 'Giá mà người quy hoạch không giữ lại hàng thông ven sông hồi 2010, mùa hè nay sẽ rất gay gắt.' },
      { english: 'Mobile reading fluency now matches, and in some towns surpasses, that of desktop browsers.', vietnamese: 'Tốc độ đọc trên di động nay sánh ngang, thậm chí ở vài nơi vượt qua, trình duyệt máy tính.' },
      { english: 'Wait until automated checks turn green—failing to do so invites subtle regression bugs.', vietnamese: 'Hãy đợi kiểm định tự động báo xanh—không làm thế dễ kéo theo lỗi lùi tinh vi.' },
    ],
    commonMistakes: [
      { wrong: 'Hadn’t we checked every URL beforehand, users might click dead links.', right: 'Had we not checked every URL beforehand, users might have clicked dead links.', why: 'Never contract "Hadn’t" before the subject inside an inverted conditional—write "Had + S + not".' },
      { wrong: 'The retention of flashcards exceeded the flashcards of passive word lists.', right: 'The retention of contextual cards exceeded that of passive word lists.', why: 'Substitute repeated singular abstract nouns smoothly with "that of" (or "those of" for plurals).' },
      { wrong: 'Did governments lower ticket prices, bus commuters would climb quickly.', right: 'Were governments to lower ticket prices, bus ridership would climb quickly.', why: 'Unreal present action conditionals invert solely via "Were + Subject + to V1", never *"Did...".' },
    ],
    comparisons: [
      { structure: '"But for / Without" vs. "Had it not been for"', difference: 'Both save long Type 3 negative clauses ("Had it not been for steady rain, fire season would have worsened").', example: 'Use "Were it not for + Noun" (now) vs. "Had it not been for + Noun" (past).' },
    ],
    speakingTip: 'Use "Should you ever visit Hue, don’t miss morning riverside tea!"—charmingly gracious and crisp.',
    writingTip: 'Watch IELTS Task 1 data prose: substituting repeated subjects cleanly with "that of / those of" prevents awkward noun repetition instantly.',
    reviewSummary: 'Invert conditionals cleanly with Should / Were (+ to) / Had, keep negative "not" separate AFTER the subject, and substitute comparisons smoothly via "that of / those of / do so".',
    quiz: [
      gEx({ id: 'qc1-02-1', topicId: 'gram-c1-02-inverted-conditionals-ellipsis', type: 'multiple_choice', instruction: 'Respect inverted negative rule.', prompt: 'Which formal Type 3 inversion contains ZERO contraction errors?', options: ['Hadn’t volunteers cleaned the trail, landslides might close it.', 'Had volunteers not cleared drainage paths, floodwater would have spilled higher.', 'Did volunteers not clear drainage paths, flooding worsened.', 'Were volunteers haven’t cleared it, floods came.'], correctAnswer: 'Had volunteers not cleared drainage paths, floodwater would have spilled higher.', explanation: 'Formal inversion always leaves "not" behind the subject ("Had + S + not + V3").', difficulty: 2 }),
      gEx({ id: 'qc1-02-2', topicId: 'gram-c1-02-inverted-conditionals-ellipsis', type: 'multiple_choice', instruction: 'Choose accurate academic noun substitution.', prompt: 'Wind turbine efficiency in coastal Denmark now rivals ___ hydropower dams.', options: ['this of', 'that of', 'those of', 'it of'], correctAnswer: 'that of', explanation: 'Singular uncountable "efficiency" substitutes accurately using "that of".', difficulty: 2 }),
      gEx({ id: 'qc1-02-3', topicId: 'gram-c1-02-inverted-conditionals-ellipsis', type: 'sentence_transformation', instruction: 'Invert Unreal Type 2 action cleanly.', prompt: 'Elevate dropping "If": "If cities were to fund electric ferries, commuters would embrace clean routes."', correctAnswer: 'Were cities to fund electric ferries, commuters would embrace clean routes.', explanation: 'Move "Were" in front of "cities to fund".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c1-03-modals-nuance-subjunctive',
    cefrLevel: 'C1',
    title: 'Mandative Subjunctive ("insist that he be"), Speculative "Needn’t Have" vs. "Didn’t Need To"',
    summary: 'Master bare-infinitive formal recommendations, crisp regrets ("should have"), and subtle necessity contrasts.',
    summaryVi: 'Thức Giả định bàng thái ("recommend that X + V1") và phân biệt tinh tế giữa "needn’t have V3" vs. "didn’t need to V1".',
    objectives: [
      'Apply the Mandative Subjunctive accurately after urgency verbs/adjectives ("recommend, demand, insist, vital, imperative + that + Subject + bare V1 / be").',
      'Separate unnecessary completed action ("needn’t have V3" — you DID it, turns out needless!) from skipped unnecessary action ("didn’t need to V1" — you skipped doing it!).',
      'Criticize unwise past choices politely with "should/ought to have + V3" or "might/could have V3".',
    ],
    detailedExplanation:
      'C1 accuracy shows clearest inside quiet details native readers sense immediately. Two jewels live here: First, **Mandative Subjunctive** strips "-s / -ed / am-is-are" down to pure base verb right after expressions of urgent necessity ("It is imperative that every link REMAIN verified", "Critics demanded that the committee PUBLISH raw data"). Second, distinguish past wasted effort neatly: if you bought groceries needlessly because your partner already cooked, say "You NEEDN’T HAVE bought bread!" (you bought it, wasted!). If you saw full cupboards BEFORE shopping and stayed home calmly, say "I DIDN’T NEED TO buy bread"!',
    structures: [
      { label: 'Mandative Subjunctive', formula: 'insist / propose / essential / vital + that + Subject + (not) Base Verb (V1 / be)', example: 'Guidelines require that every citation be independently verifiable.' },
      { label: 'Wasted Past Effort', formula: 'Subject + needn’t have + V3 (Done needlessly!)', example: 'You needn’t have printed twenty maps—everyone carries phone GPS!' },
      { label: 'Skipped Unnecessary Effort', formula: 'Subject + didn’t need to + V1 (Skipped sensibly)', example: 'Entry was free, so we didn’t need to exchange any cash.' },
    ],
    usageRules: [
      'Notice Negative Mandative Subjunctive avoids "don’t/doesn’t": place bare "not" directly BEFORE bare verb ("It is vital that audio NOT distort syllables").',
      'British English sometimes softens subjunctive with "should + V1" ("recommended that links should remain active"); both bare V1 and "should + V1" rank crisp C1.',
      'Note "It’s high time + Subject + Past Simple" urges polite overdue action NOW ("It’s high time you practiced aloud!").',
    ],
    exceptions: [
      'Careful with "insist": urging future demand takes subjunctive ("insisted that he leave"), whereas arguing a claimed past fact keeps normal tense ("insisted that he had arrived at eight").',
    ],
    examples: [
      { english: 'The editorial charter mandates that every external URL remain accessible without login walls.', vietnamese: 'Quy chế biên tập bắt buộc mọi liên kết tài liệu ngoài vẫn truy cập được không cần tường đăng nhập.' },
      { english: 'We needn’t have brought heavy rain boots because the mountain ridge stayed dry all week.', vietnamese: 'Đáng lẽ chúng mình chẳng cần mang ủng đi mưa nặng thế vì sườn núi khô ráo cả tuần.' },
      { english: 'Since reception already kept towels, guests didn’t need to pack extra ones.', vietnamese: 'Vì lễ tân đã chuẩn bị sẵn khăn, khách không phải mang thêm khăn dự phòng.' },
      { english: 'It is imperative that beginners not abandon audio practice during busy midterms.', vietnamese: 'Điều tối quan trọng là người mới không bỏ luyện nghe trong kỳ thi giữa kỳ bận rộn.' },
      { english: 'You might have mentioned the platform change five minutes sooner so we wouldn’t sprint!', vietnamese: 'Đáng lẽ bạn có thể báo đổi sân ga sớm năm phút để tụi mình khỏi chạy vội thế chứ!' },
    ],
    commonMistakes: [
      { wrong: 'It is crucial that each chapter maintains unique IDs and doesn’t duplicate prompts.', right: 'It is crucial that each chapter maintain unique IDs and not duplicate prompts.', why: 'Formal Mandative Subjunctive prefers bare base verb ("maintain", "not duplicate").' },
      { wrong: 'Oh, look at three spare umbrellas in our hall! I didn’t need to buy a fourth one just now!', right: 'Oh, look at three spare umbrellas! I needn’t have bought a fourth one!', why: 'Buying it ALREADY and realizing afterward it was needless calls specifically for "needn’t have + V3".' },
      { wrong: 'It’s high time schools encourage daily spoken podcasts.', right: 'It’s high time schools encouraged daily spoken podcasts.', why: 'Hypothetical idiom "It’s (high) time" always steps tense back into Past Simple ("encouraged").' },
    ],
    comparisons: [
      { structure: 'Needn’t have V3 vs. Didn’t need to V1', difference: 'Action DONE yet unnecessary -> "needn’t have bought"; Action SKIPPED because unnecessary -> "didn’t need to buy".', example: 'Ask yourself one question: did the speaker actually waste time performing it?' },
    ],
    speakingTip: 'Use gentle playful "It’s about time we grabbed coffee!" with friends—classic warm English rhythm.',
    writingTip: 'Mandative Subjunctive ("recommend that municipal councils allocate...", "essential that curricula remain...") instantly elevates formal IELTS / proposal authority.',
    reviewSummary: 'Strip verbs down to bare V1 / "not + V1" inside mandative "that"-clauses, step back to Past Simple after "It’s high time", and match completed needless acts strictly to "needn’t have + V3".',
    quiz: [
      gEx({ id: 'qc1-03-1', topicId: 'gram-c1-03-modals-nuance-subjunctive', type: 'multiple_choice', instruction: 'Pick proper Mandative Subjunctive verb.', prompt: 'Public policy experts insist that safe transit routes ___ extended to outer suburbs immediately.', options: ['is', 'are', 'be', 'being'], correctAnswer: 'be', explanation: '"Insist that..." urges action using bare infinitive "be".', difficulty: 2 }),
      gEx({ id: 'qc1-03-2', topicId: 'gram-c1-03-modals-nuance-subjunctive', type: 'multiple_choice', instruction: 'Distinguish done needlessly vs. avoided effortlessly.', prompt: 'I lugged two umbrellas across the island, though there wasn’t a single cloud—I ___ them!', options: ['didn’t need to bring', 'needn’t have brought', 'mustn’t have brought', 'haven’t needed to bring'], correctAnswer: 'needn’t have brought', explanation: 'He DID bring both umbrellas unnecessarily -> "needn’t have + V3".', difficulty: 2 }),
      gEx({ id: 'qc1-03-3', topicId: 'gram-c1-03-modals-nuance-subjunctive', type: 'fill_blank', instruction: 'Complete "It’s high time..." past shift.', prompt: 'It’s high time learners ___ (embrace) short daily speaking habits!', correctAnswer: 'embraced', explanation: '"It’s high time + Subject" uses Past Simple ("embraced") for urgent present urgency.', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c1-04-discourse-markers-cohesion-reference',
    cefrLevel: 'C1',
    title: 'Academic Discourse Flow: Broad Concession, Causal Nominalization & Reference Cohesion',
    summary: 'Link complex multi-clause prose naturally via "albeit, insofar as, whereas, hereby, whereby, this + summary noun".',
    summaryVi: 'Liên kết diễn ngôn học thuật C1: albeit, insofar as, danh hóa câu chữ và từ thay thế bao trùm.',
    objectives: [
      'Use "albeit + phrase/adjective" accurately without forcing a finite verb right after it.',
      'Summarize whole preceding arguments into tight cohesive nouns ("this discrepancy", "such initiatives", "that limitation").',
      'Spot informal spoken linkers ("mind you, having said that, on the whole") vs. authoritative written register.',
    ],
    detailedExplanation:
      'High-band cohesion isn’t sprinkling heavy connectors like *"Moreover/Furthermore"* every sentence—examiners call that mechanical! Instead, true C1 writers weave ideas invisibly through **anaphoric shell nouns** ("Cities launched shaded buses. **This shift** cut heat complaints...") and crisp sub-clause connectors like **"albeit"** (attaching quick gentle limits directly onto phrases) and **"thereby + V-ing"** (folding consequences into flowing syntax without opening fresh sentences!).',
    structures: [
      { label: 'Phrase-Level Concession ("albeit")', formula: 'Statement, + albeit + Adjective / Adverb / Prepositional Phrase', example: 'Progress held steady, albeit modestly during busy exam weeks.' },
      { label: 'Result Participle Flow ("thereby")', formula: 'Action Clause, + thereby + V-ing Outcome', example: 'Load packs per level, thereby cutting initial download overhead.' },
      { label: 'Shell-Noun Cohesion Hook', formula: '[Complex Process Idea]. This / Such + [Abstract Noun] + Verb...', example: 'Kids ignore dry word tables. This reluctance sparked story-first drills.' },
    ],
    usageRules: [
      'Do NOT write a finite subject+verb directly behind "albeit" (*"albeit it was slow" -> "albeit slow" or "although it was slow").',
      'Pair vague "This" with a crisp specific summary noun ("This innovation", "Such resilience", "These discrepancies") instead of letting naked *"This proves..." dangle unclearly.',
      'Reserve casual concessions like "Mind you..." and "Having said that..." cleanly for interviews and natural talks rather than formal research theses.',
    ],
    exceptions: [
      '"Albeit that + clause" appears rarely in archival legal texts, yet contemporary prose overwhelmingly prefers phrase-only "albeit".',
    ],
    examples: [
      { english: 'The hybrid tram system eased downtown delays, albeit at considerable early construction expense.', vietnamese: 'Hệ thống tàu điện kết hợp đã giảm chậm trễ trung tâm, dù với chi phí xây dựng ban đầu khá lớn.' },
      { english: 'Early prototypes missed edge cases. This oversight taught engineers to automate verification early.', vietnamese: 'Nguyên mẫu đầu sót ca ngoại lệ. Sơ sót này đã dạy kỹ sư tự động hóa kiểm định sớm.' },
      { english: 'Students review flashcards just before memory fades, thereby strengthening neural links.', vietnamese: 'Học viên ôn thẻ ngay trước khi ký ức mờ đi, qua đó củng cố liên kết thần kinh.' },
      { english: 'Templates aid beginners insofar as they clarify clean essay structure before free drafting.', vietnamese: 'Khung gợi ý giúp người mới học ở chừng mực làm rõ bố cục bài luận trước lúc tự viết.' },
      { english: 'Vocabulary memorization boosts passive recognition; having said that, speaking aloud unlocks fluency.', vietnamese: 'Học thuộc từ giúp tăng nhận diện thụ động; dẫu vậy, nói thành tiếng mới mở khóa độ trôi chảy.' },
    ],
    commonMistakes: [
      { wrong: 'Solar adoption climbed quickly, albeit rural maintenance stayed pricey.', right: 'Solar adoption climbed quickly, albeit with pricey rural maintenance.', why: 'Follow "albeit" directly with a phrase/adjective ("with pricey...", "slowly"), never a full finite clause.' },
      { wrong: 'Factories polluted canals. This shows strict rules are needed.', right: 'Factories polluted canals. This discharge shows clear enforcement is needed.', why: 'Pair sentence-starting "This" with a clear summary noun ("This pattern / neglect") to raise precision.' },
      { wrong: 'Cities widened paths, whereby speeding commuters safely.', right: 'Cities widened paths, thereby speeding commuters safely along bikes.', why: '"Whereby" takes a Subject+Verb clause defining a rule; "thereby + V-ing" states direct consequence.' },
    ],
    comparisons: [
      { structure: 'Albeit vs. Although vs. Notwithstanding', difference: '"Although" + Clause; "Albeit" + Adj/Phrase mid-sentence; "Notwithstanding" + Noun front or back.', example: 'Pick exact grammar shape—not just similar English definitions!' },
    ],
    speakingTip: 'Bridge nuanced arguments warmly in conversation using "Having said that..." or "All things considered..." without stiff essay phrasing.',
    writingTip: 'Replace every third standalone sentence starting "This is..." or "Therefore..." with a shell-noun bridge ("This bottleneck...") or ", thereby + V-ing".',
    reviewSummary: 'Follow albeit with adjectives/phrases (not clauses), bridge sentences via "This + Shell Noun", and condense consequences cleanly using ", thereby + V-ing".',
    quiz: [
      gEx({ id: 'qc1-04-1', topicId: 'gram-c1-04-discourse-markers-cohesion-reference', type: 'multiple_choice', instruction: 'Pick valid grammar right after "albeit".', prompt: 'Evening lessons progressed smoothly, albeit ___ during summer heatwaves.', options: ['they slowed slightly', 'more slowly', 'it slowed', 'were slow'], correctAnswer: 'more slowly', explanation: 'Adverbial phrase "more slowly" fits "albeit" without finite verb.', difficulty: 2 }),
      gEx({ id: 'qc1-04-2', topicId: 'gram-c1-04-discourse-markers-cohesion-reference', type: 'multiple_choice', instruction: 'Separate "thereby" vs. "whereby".', prompt: 'Split curricula lazily by CEFR pack, ___ keeping mobile startup brisk.', options: ['whereby', 'thereby', 'insofar', 'albeit'], correctAnswer: 'thereby', explanation: 'Direct causal consequence + "-ing" takes ", thereby + V-ing".', difficulty: 2 }),
      gEx({ id: 'qc1-04-3', topicId: 'gram-c1-04-discourse-markers-cohesion-reference', type: 'error_correction', instruction: 'Fix naked ambiguous "This".', prompt: 'Refine weakly vague anchor: "Ferry speeds doubled while delays fell. This boosted tourism."', correctAnswer: 'Ferry speeds doubled while delays fell. This improvement boosted tourism.', acceptableAnswers: ['Ferry speeds doubled while delays fell. This reliability boosted tourism.', 'Ferry speeds doubled while delays fell. This shift boosted tourism.'], explanation: 'Adding a shell noun ("This improvement / reliability / shift") locks cohesion sharply.', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c1-05-nominalization-academic-style',
    cefrLevel: 'C1',
    title: 'Nominalization & Academic Condensation — Turning Wordy Actions into Abstract Nouns',
    summary: 'Shift conversational verb-heavy drafts effortlessly into crisp concise research prose ("because cities grew fast" -> "rapid urban expansion").',
    summaryVi: 'Danh hóa (Nominalization): biến cụm động từ/tính từ dài dòng thành danh ngữ học thuật cô đọng.',
    objectives: [
      'Nominalize core actions safely ("decide -> decision", "fail to maintain -> maintenance failure", "fluctuate -> fluctuation") to compress subjects concisely.',
      'Combine compact noun phrases smoothly with crisp strong transitive verbs ("trigger, offset, undermine, foster").',
      'Guard readability against over-nominalized "noun-pile swamps" by balancing concrete active verbs alongside clear nouns.',
    ],
    detailedExplanation:
      'Compare two ways of sharing the exact same insight: Casual spoken style builds chains of simple verbs ("Because more cars entered downtown quickly, air grew dirtier, so families felt sick"). Formal C1 writing uses **Nominalization**—packaging an entire process neatly inside one noun headword so your main verb can spotlight real causation: "**Rapid vehicular growth compounded** air quality deterioration." Master the balance too: nominalize ONLY to sharpen cause-and-effect focus or connect back from a previous clause—avoid stuffing five clunky nouns in one phrase (*"policy implementation acceleration optimization"*)!',
    structures: [
      { label: 'Verb Clause -> Academic Subject', formula: 'Verb/Adj idea -> [Modifier + Abstract Noun] + Strong Causal Verb + [Outcome Noun]', example: 'When ferries stalled -> Prolonged ferry disruptions hindered regional trade.' },
      { label: 'Core Academic Suffixes', formula: '-tion/-sion | -ment | -ance/-ence | -ity | -al | -ness', example: 'prioritize -> prioritization, sustain -> sustainability, refuse -> refusal' },
      { label: 'Anti-Jargon Balance Check', formula: 'Never chain >3 consecutive heavy abstract nouns when one active verb sparkles clearer.', example: 'Prefer "The team investigated" over *"Conducted an investigation".' },
    ],
    usageRules: [
      'Keep key human clarity inside clear prepositional tails ("The steady introduction OF solar subsidies...") rather than stacking nouns blindly in front ("subsidy solar policy launch delay").',
      'Watch irregular noun forms carefully: analyze -> analysis, diagnose -> diagnosis, vary -> variation, solve -> solution, succeed -> success.',
      'Keep verbs meaningful: replace weak "be / have / happen" + nominalization (*"An evaluation occurred"*) with clean direct action OR insightful link ("triggered", "masked", "accelerated").',
    ],
    exceptions: [
      'Good journalism and clear technical UX writing deliberately DE-nominalize stiff bureaucratic phrasing ("Make an improvement to speeds" -> "Improve loading speed")—choose register carefully!',
    ],
    examples: [
      { english: 'The steady expansion of shaded walkways significantly reduced summer pavement heat.', vietnamese: 'Việc mở rộng đều đặn các lối đi rợp bóng đã giảm đáng kể nhiệt mặt đường mùa hè.' },
      { english: 'Frequent exposure to varied regional accents builds strong listening resilience.', vietnamese: 'Việc tiếp xúc thường xuyên với nhiều chất giọng vùng miền tạo sức bền nghe hiểu vững chắc.' },
      { english: 'A sudden shortage of clean freshwater prompted urgent wetland conservation.', vietnamese: 'Sự khan hiếm nước ngọt sạch đột ngột đã thúc đẩy bảo tồn đất ngập nước khẩn cấp.' },
      { english: 'Consistent verification before deployment prevents frustrating student bugs.', vietnamese: 'Kiểm định nhất quán trước lúc phát hành ngăn chặn lỗi phiền toái cho người học.' },
      { english: 'Transparent explanation of subtle grammar contrasts eases intermediate learner anxiety.', vietnamese: 'Giải thích minh bạch các điểm đối chiếu ngữ pháp tinh tế làm dịu nỗi lo của người học trung cấp.' },
    ],
    commonMistakes: [
      { wrong: 'Cities invested late in rail resulted in crowded buses.', right: 'Late municipal investment in rail resulted in crowded buses.', why: 'An entire Verb clause ("Cities invested...") shouldn’t directly subject "resulted in" without nominalization or "that".' },
      { wrong: 'We made an implementation of daily quizzes last week.', right: 'We implemented daily quizzes last week.', why: 'Do not replace a crisp active verb with empty "make + -tion" unless serving as a theme/cause subject.' },
      { wrong: 'The analyze of these scores showed improvement.', right: 'The analysis of these scores revealed clear improvement.', why: 'Use exact noun form "analysis" (not verb "analyze") after "The".' },
    ],
    comparisons: [
      { structure: 'Crisp Cause vs. Clunky Swamp', difference: 'Crisp: "Rapid urbanization strained public springs." vs. Clunky: "The urbanization growth process caused a strain on spring levels."', example: 'Nominalize when turning an old sentence into the compact subject of the next causal leap.' },
    ],
    speakingTip: 'Keep spoken conversation warmer and verb-led ("Because buses ran slowly, people walked"), saving nominalized condensation mostly for structured briefings and essays.',
    writingTip: 'One clean nominalized subject per IELTS paragraph boosts coherence naturally ("Careless dependence on rote templates lowers writing originality").',
    reviewSummary: 'Package background processes cleanly into nominalized abstract nouns (analysis, expansion, discrepancy) to clarify cause-and-effect, while preserving crisp active verbs.',
    quiz: [
      gEx({ id: 'qc1-05-1', topicId: 'gram-c1-05-nominalization-academic-style', type: 'multiple_choice', instruction: 'Select clean nominalized subject.', prompt: 'Rewrite smoothly: "Because engineers audited data thoroughly, bugs disappeared early." -> ___ eliminated bugs early.', options: ['Thorough engineers audited data', 'Thorough data auditing', 'The thoroughly audit of data', 'Auditing thorough data'], correctAnswer: 'Thorough data auditing', explanation: 'Compact gerund/abstract noun phrase "Thorough data auditing" (or "A thorough data audit") acts cleanly as causal subject.', difficulty: 2 }),
      gEx({ id: 'qc1-05-2', topicId: 'gram-c1-05-nominalization-academic-style', type: 'fill_blank', instruction: 'Use exact derived noun.', prompt: 'Careful vowel ___ (compare -> noun) helps speakers avoid subtle pronunciation mix-ups.', correctAnswer: 'comparison', explanation: 'Derived noun form of "compare" is "comparison".', difficulty: 1 }),
      gEx({ id: 'qc1-05-3', topicId: 'gram-c1-05-nominalization-academic-style', type: 'error_correction', instruction: 'Eliminate weak wordy nominalization.', prompt: 'Tighten active voice: "Staff made an observation of rising afternoon ridership."', correctAnswer: 'Staff observed rising afternoon ridership.', explanation: 'Keep brisk transitive verb "observed" rather than empty *"made an observation of".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c1-06-future-in-the-past-perspective',
    cefrLevel: 'C1',
    title: 'Future-in-the-Past ("was going to", "was to", "would eventually") & Narrative Time Shift',
    summary: 'Step backward into past plans—fulfilled, changed unexpectedly, or destined looking forward from an earlier decade.',
    summaryVi: 'Tương lai trong Quá khứ ("was going to", "was to", "would eventually", "was on the verge of").',
    objectives: [
      'Separate unfulfilled past plans ("We were going to picnic, yet storm warnings came") from quiet historical destiny ("Those muddy paths would later become lush parkways").',
      'Use "was/were about to + V1" and "was on the brink/verge of + V-ing" for suspense right before change.',
      'Apply "was/were supposed to" smoothly for past obligations or plans that broke or shifted.',
    ],
    detailedExplanation:
      'Storytellers, historians, and memoir writers often stand at a past moment (say, 1995 or last Friday at noon) and look toward THAT moment’s future! To sound native without slipping awkwardly into wrong "will", shift every future marker neatly into the past: "will -> would", "is going to -> was going to", "is to -> was to", "is about to -> was about to". Watch the subtle mood split: **"I was going to call you"** almost always implies "but something prevented me!"; whereas **"These tiny saplings would grow into broad shade"** narrates looking back positively with historical hindsight!',
    structures: [
      { label: 'Changed / Interrupted Past Plan', formula: 'Subject + was/were going to + V1 (often + but...)', example: 'We were going to cycle up the coast, yet morning thunder rerouted us.' },
      { label: 'Historical Destiny / Hindsight', formula: 'Subject + would later/eventually + V1', example: 'Her tiny corner café would eventually train dozens of local baristas.' },
      { label: 'Imminent Suspense & Duty', formula: 'was/were about to + V1  |  was/were supposed to + V1', example: 'We were supposed to board at nine, yet maintenance delayed the launch.' },
    ],
    usageRules: [
      'Use "was/were going to + V1" or "was supposed to + V1" freely when plans fell through.',
      'Notice "was/were to have + V3" specifically highlights high-level official events scheduled back then that got canceled ("The ferry was to have launched in April, though low tides intervened").',
      'Never use *"will" when anchoring historical hindsight inside a Past Simple paragraph.',
    ],
    exceptions: [
      '"Would" as Future-in-the-Past differs completely from habitual past "would" ("Grandpa would always walk at dawn"): look for cue adverbs ("would soon, would eventually, would turn out").',
    ],
    examples: [
      { english: 'Minh was going to study inside the library all afternoon, yet an inspiring book talk drew him next door.', vietnamese: 'Minh định ngồi học cả chiều trong thư viện, nhưng một buổi tọa đàm sách hấp dẫn lại lôi cuốn cậu sang phòng bên.' },
      { english: 'Those quiet river workshops of 1980 would later spark one of Asia’s cleanest craft guilds.', vietnamese: 'Những xưởng ven sông yên ả năm 1980 đó sau này đã thổi bùng nên một trong những phường nghề xanh nhất châu Á.' },
      { english: 'She was just about to seal the parcel when she spotted one last handwritten postcard.', vietnamese: 'Cô ấy vừa định dán kín gói bưu kiện thì chợt thấy tấm bưu thiếp viết tay cuối cùng.' },
      { english: 'Tomorrow’s keynote speaker was originally going to join remotely, until flight clearance opened.', vietnamese: 'Diễn giả chính ngày mai ban đầu dự kiến tham gia từ xa, cho tới khi chuyến bay mở lại.' },
      { english: 'Passengers were supposed to validate tickets onboard, yet broken tap scanners stayed offline.', vietnamese: 'Hành khách lẽ ra phải quẹt vé trên tàu, nhưng máy quét hỏng đang tạm tắt.' },
    ],
    commonMistakes: [
      { wrong: 'In 2005, no student guessed portable audio will reshape self-study so rapidly.', right: 'In 2005, no student guessed portable audio would reshape self-study so rapidly.', why: 'Keep narrative past tense aligned: backshift "will" into Future-in-the-Past "would".' },
      { wrong: 'I was go to remind you earlier, but your call ended quickly.', right: 'I was going to remind you earlier, but your call ended quickly.', why: 'Future-in-the-past intention uses full "was going to", not *"was go to".' },
      { wrong: 'Yesterday we were about leaving when our taxi honked.', right: 'Yesterday we were about to leave when our taxi honked.', why: '"Be about" strictly takes to-infinitive ("about to leave"), compare "on the point of + V-ing".' },
    ],
    comparisons: [
      { structure: 'was going to vs. was supposed to', difference: '"I was going to visit" spotlights MY personal intention; "I was supposed to call" spotlights an agreement, duty, or timetable expectation.', example: 'Pick "supposed to" when owning missed schedules politely.' },
    ],
    speakingTip: '"I was just about to text you!" is warm everyday conversational fluency whenever someone messages you first.',
    writingTip: 'Use "would ultimately transform..." inside biographies or historical passage intros for natural journalistic grace.',
    reviewSummary: 'Keep history coherent by shifting will -> would (hindsight), is going to -> was going to (unfulfilled/shifted plans), is about to -> was about to (brink), and was supposed to (unkept expectations).',
    quiz: [
      gEx({ id: 'qc1-06-1', topicId: 'gram-c1-06-future-in-the-past-perspective', type: 'multiple_choice', instruction: 'Apply narrative Future-in-the-Past.', prompt: 'Few early commuters in 1992 imagined silent electric buses ___ carry millions daily.', options: ['will eventually', 'would eventually', 'are eventually going', 'have eventually'], correctAnswer: 'would eventually', explanation: 'Looking forward from past time "in 1992" requires "would eventually".', difficulty: 1 }),
      gEx({ id: 'qc1-06-2', topicId: 'gram-c1-06-future-in-the-past-perspective', type: 'multiple_choice', instruction: 'Pick clean brink-of-action idiom.', prompt: 'Engineers were right ___ pressing publish when validation caught a final broken reference.', options: ['on the verge of', 'on the verge to', 'about checking', 'going'], correctAnswer: 'on the verge of', explanation: '"On the verge of + V-ing" fits "pressing" cleanly (contrast "about to + V1").', difficulty: 2 }),
      gEx({ id: 'qc1-06-3', topicId: 'gram-c1-06-future-in-the-past-perspective', type: 'fill_blank', instruction: 'Express unkept schedule nicely.', prompt: 'Wait—you ___ (suppose) to deliver slides an hour ago!', correctAnswer: 'were supposed', explanation: 'Past broken duty or timetable uses "were supposed to".', difficulty: 2 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c1-07-advanced-reporting-structures',
    cefrLevel: 'C1',
    title: 'Nuanced Reporting Verbs & Prepositional Patterns ("accuse of / urge to / congratulate on")',
    summary: 'Replace flat repetitive "said/told" with expressive, grammatically exact reporting patterns across speeches and summaries.',
    summaryVi: 'Các động từ tường thuật nâng cao cùng mẫu giới từ/tân ngữ chuẩn xác (warn, urge, accuse of, deny V-ing, congratulate on).',
    objectives: [
      'Sort high-value reporting verbs strictly by exact syntactic family (+ to-V, + Obj + to-V, + V-ing, + Obj + Prep + V-ing, + that Clause).',
      'Spot classic traps like *"suggest me to go"* (WRONG -> suggest V-ing / suggest that we go) and *"explain me"* (explain TO me).',
      'Distinguish subtle posture through verb tone ("allege" vs. "concede" vs. "refute" vs. "reassure").',
    ],
    detailedExplanation:
      'Knowing a verb’s emotional tone is only half the win—C1 writers also lock down its exact grammatical tail! Look closely at **suggest, recommend, insist, demand**: NEVER follow any of these four with `Person + to-V` (*"He recommended me to try" is wrong everywhere!). Also keep prepositions exact: criticize FOR, blame FOR, accuse OF, apologize FOR, congratulate ON, insist ON, dissuade FROM. Building clean verb-frame muscle eliminates half of all advanced writing errors at once!',
    structures: [
      { label: 'Person + to + V1', formula: 'urge / persuade / encourage / warn / advise / remind + Person + (not) to + V1', example: 'Coaches urged hesitant candidates not to memorize canned answers.' },
      { label: 'Verb + (Preposition) + V-ing', formula: 'admit / deny / suggest / recommend (+ V-ing)  |  apologize for / accuse Obj of / congratulate Obj on + V-ing', example: 'Reviewers congratulated the authors on maintaining strict factual balance.' },
      { label: 'Verb + to Person (Optional) + that...', formula: 'explain / clarify / admit / mention / confess + TO someone + that Clause', example: 'She explained TO new interns how SM-2 review intervals adjust.' },
    ],
    usageRules: [
      'Keep "explain + Noun + TO + Person" or "explain + TO someone + that..." — NEVER write *"explain me"!',
      '"Suggest / recommend" use EITHER `V-ing` ("suggested revising twice") OR `that + S + (should) V1` ("recommended that we test early").',
      '"Threaten / offer / promise / refuse + to V1" omit any middle person before "to", whereas "warn / persuade / tell + Person + to V1" REQUIRE the person!',
    ],
    exceptions: [
      '"Promise" allows BOTH `"promised to help"` and `"promised her (that) he would help"`, yet avoid *"promised her to help"* in formal ambiguity.',
    ],
    examples: [
      { english: 'Auditors praised the engineering group for splitting curriculum modules into fast chunks.', vietnamese: 'Nhóm kiểm định khen ngợi đội kỹ thuật vì đã tách các mô-đun giáo trình thành gói tải nhanh.' },
      { english: 'The mentor recommended reading one short newspaper column aloud every breakfast.', vietnamese: 'Người cố vấn gợi ý đọc thành tiếng một mục báo ngắn mỗi bữa sáng.' },
      { english: 'Could you explain to first-year learners why continuous tenses reject stative verbs?', vietnamese: 'Bạn có thể giải thích cho học viên năm nhất vì sao các thì tiếp diễn tránh động từ trạng thái không?' },
      { english: 'Officials denied misleading rural commuters regarding winter ferry timetables.', vietnamese: 'Giới chức phủ nhận việc gây hiểu nhầm cho hành khách nông thôn về lịch phà mùa đông.' },
      { english: 'Traffic engineers urged municipal planners to protect shaded corner crossings.', vietnamese: 'Kỹ sư giao thông thúc giục các nhà quy hoạch thành phố bảo vệ lối băng qua rợp bóng.' },
    ],
    commonMistakes: [
      { wrong: 'My friend suggested me to watch British travel documentaries.', right: 'My friend suggested watching British travel documentaries.', why: '"Suggest" never accepts `Person + to-V`; switch to V-ing or `"suggested that I watch"`.' },
      { wrong: 'The librarian explained us where rare poetry books were shelved.', right: 'The librarian explained to us where rare poetry books were shelved.', why: '"Explain" requires preposition "to" before listeners ("explained to us").' },
      { wrong: 'She apologized me about arriving ten minutes after lunch.', right: 'She apologized to me for arriving ten minutes after lunch.', why: '"Apologize + TO someone + FOR doing something".' },
    ],
    comparisons: [
      { structure: 'Refute vs. Rebut vs. Deny vs. Allege', difference: '"Deny" simply says "not true"; "Refute" PROVES an opponent false using solid facts; "Allege" reports an unproven claim neutrally.', example: 'Match academic citation stance accurately!' },
    ],
    speakingTip: 'Drop "explain TO me" and "recommend V-ing" cleanly during client calls—listeners notice high polish effortlessly!',
    writingTip: 'Replace monotone "shows" / "says" in synthesis essays with targeted C1 frames: "critics contend that..., studies corroborate..., proponents concede...".',
    reviewSummary: 'Respect exact reporting verb slots: never put Person+to after suggest/explain, keep "explained TO us / apologized FOR", and align accuse OF / warn TO / congratulate ON.',
    quiz: [
      gEx({ id: 'qc1-07-1', topicId: 'gram-c1-07-advanced-reporting-structures', type: 'multiple_choice', instruction: 'Pick grammatical reporting frame.', prompt: 'Our IELTS coach ___ every evening before sleeping.', options: ['suggested me to read ten minutes', 'recommended to read ten minutes to me', 'recommended reading for ten minutes', 'insisted me reading ten minutes'], correctAnswer: 'recommended reading for ten minutes', explanation: '"Recommend" cleanly takes direct gerund V-ing without `"me to"`.', difficulty: 2 }),
      gEx({ id: 'qc1-07-2', topicId: 'gram-c1-07-advanced-reporting-structures', type: 'fill_blank', instruction: 'Fill exact preposition pairs.', prompt: 'Peers congratulated Minh ___ delivering such a lucid keynote speech.', correctAnswer: 'on', acceptableAnswers: ['for'], explanation: 'Standard C1 frame is "congratulate someone ON doing something" (US also occasionally "for").', difficulty: 1 }),
      gEx({ id: 'qc1-07-3', topicId: 'gram-c1-07-advanced-reporting-structures', type: 'error_correction', instruction: 'Fix "explain + listener" order.', prompt: 'Correct: "The guide explained us why this wooden canal bridge survived floods."', correctAnswer: 'The guide explained to us why this wooden canal bridge survived floods.', explanation: 'Insert preposition "to" right before personal listener ("explained to us").', difficulty: 1 }),
    ],
  }),

  createGrammarLesson({
    id: 'gram-c1-08-ellipsis-fronting-complex-modifiers',
    cefrLevel: 'C1',
    title: 'Fronting, Adverbial Ellipsis & Non-Finite Modifier Flexibility',
    summary: 'Control stylistic fronting ("So calm was the bay that..."), sleek clause ellipsis, and high-impact rhetoric balance.',
    summaryVi: 'Đảo trật tự tu từ (So... that / Such... that / Fronting) và Lược bỏ tinh gọn (Ellipsis).',
    objectives: [
      'Invert emphatic adjective/noun emphasis smoothly via "So + Adj + Be + S + that..." and "Such + was + Noun + that...".',
      'Spot valid graceful ellipsis across repeated auxiliaries ("...and so might others", "...whether planned or accidental") without fragmenting meaning.',
      'Build emphatic concessive fronting safely ("Compelling though the graph appears, margins remain wide").',
    ],
    detailedExplanation:
      'C1 grammar lets writers rearrange familiar word order deliberately to shape rhythm and reader focus. Place **"So + adjective"** or **"Such + noun"** first to build clean crescendo ("So convincing was her evidence that skeptics revised policy"). Or place an adjective right ahead of **"though / as"** ("Daunting though C2 idioms appear at first, clear context dissolves them"). Equally, prune bloated repetition via clean **verb-phrase ellipsis**—leaving only the crisp helper modal/verb ("Many apps claim lasting fluency; few actually nurture it" or "Minh could attend tomorrow, if needed").',
    structures: [
      { label: 'Emphatic So / Such Inversion', formula: 'So + Adj/Adv + Aux + Subject + Verb, + that...  |  Such + Be + Noun + that...', example: 'So crisp was the recording that every /θ/ breath shone through.' },
      { label: 'Adjective + Though/As Concession', formula: 'Adjective/Adverb + though / as + Subject + Verb, Main Clause', example: 'Small though the solar micro-grid was, it lit forty mountain homes.' },
      { label: 'Post-Aux & Adjective Ellipsis', formula: 'While [Adj / Past Participle]..., Subject + Verb  |  ...even if unlikely', example: 'Once validated cleanly, these units ship safely anytime.' },
    ],
    usageRules: [
      'Watch **"So"** (modifies Adjective/Adverb) vs. **"Such"** (modifies Noun Phrase!): *"Such fast was..."* is wrong; write "So fast was..." OR "Such was the speed...".',
      'In reduced time/concession clauses ("When tested across browsers..."), check that the implied omitted subject MATCHES the following main subject identically!',
      'Keep "Though" + Subject + Verb straight ("Hard as I tried", NOT *"Hard as did I try"!).',
    ],
    exceptions: [
      'Preposition fronting after adjectives ("Cold as it looked outside...") drops articles right before singular countable fronted nouns ("Child though she was, her poise amazed judges"—ZERO "a" in front!).',
    ],
    examples: [
      { english: 'So dramatic was the shift toward quiet electric buses that street-café chatter returned.', vietnamese: 'Bước chuyển sang xe buýt điện êm ái ấn tượng đến mức tiếng trò chuyện quán vỉa hè đã quay trở lại.' },
      { english: 'Such was the depth of local folklore that historians spent years cataloging regional songs.', vietnamese: 'Chiều sâu văn hóa dân gian địa phương lớn đến nỗi các sử gia mất nhiều năm phân loại dân ca.' },
      { english: 'Impressive though theoretical test scores look, spontaneous speech remains the truest barometer.', vietnamese: 'Dù điểm thi lý thuyết trông ấn tượng đến đâu, giao tiếp tự nhiên vẫn là thước đo chuẩn xác nhất.' },
      { english: 'When carefully paired with real collocations, flashcards deliver far stronger retention.', vietnamese: 'Khi được kết hợp cẩn thận với cụm từ thật, thẻ ghi nhớ mang lại khả năng nhớ sâu hơn hẳn.' },
      { english: 'Early drafts looked promising—unfocused in places, perhaps, yet alive with curiosity.', vietnamese: 'Các bản nháp đầu đầy hứa hẹn—có lẽ vài chỗ còn tản mạn, nhưng giàu sức sống tò mò.' },
    ],
    commonMistakes: [
      { wrong: 'Such calm was the coastal bay that painters set easels everywhere.', right: 'So calm was the coastal bay that painters set easels everywhere.', why: 'Bare adjective "calm" requires "So", whereas "Such" modifies noun phrases ("Such was the calm of the bay...").' },
      { wrong: 'Difficult though was the C1 reading text, Minh finished calmly.', right: 'Difficult though the C1 reading text was, Minh finished calmly.', why: 'Keep Subject BEFORE Verb inside "Adj + though + Subject + Verb" (no extra inversion inside!).' },
      { wrong: 'While reading closely, several printing typos surprised the author.', right: 'While reading closely, the author spotted several surprising printing typos.', why: 'Elliptical "While [you are] reading..." requires the human reader directly after the comma!' },
    ],
    comparisons: [
      { structure: '"So... that" vs. "Such... that" Fronting', difference: 'So + Adjective ("So loud was traffic...") vs. Such + Noun ("Such was traffic noise...").', example: 'One matches adj; one matches noun—both drop heavy "because" clumsiness elegantly!' },
    ],
    speakingTip: 'Try natural spoken concession "Tricky as that rule feels today, by next week it’ll feel effortless!" to sound warmly fluent.',
    writingTip: 'Use "Once [V3]" and "When [V3]" smoothly inside process essays ("Once roasted cleanly, beans cool rapidly") to achieve effortless conciseness.',
    reviewSummary: 'Match "So + Adj" vs. "Such + Noun" in emphatic fronting, never invert inside "Adj + though + S + V", and align implied subjects behind abbreviated elliptical clauses.',
    quiz: [
      gEx({ id: 'qc1-08-1', topicId: 'gram-c1-08-ellipsis-fronting-complex-modifiers', type: 'multiple_choice', instruction: 'Separate "So" vs. "Such" fronting.', prompt: '___ was the demand for shaded ferry benches that town carpenters built twelve more.', options: ['So', 'Such', 'As', 'Very'], correctAnswer: 'Such', explanation: 'Fronted before `was + Noun ("the demand")`, always choose "Such" ("Such was the demand...").', difficulty: 2 }),
      gEx({ id: 'qc1-08-2', topicId: 'gram-c1-08-ellipsis-fronting-complex-modifiers', type: 'multiple_choice', instruction: 'Keep proper Subject-Verb order after "Adj + though".', prompt: 'Pick the clean formal concession:', options: ['Hectic though became the schedule, quality checks never skipped.', 'Hectic though the schedule became, quality checks were never skipped.', 'Hectic though did the schedule become, we finished.', 'Though hectic the schedule became, but checks ran.'], correctAnswer: 'Hectic though the schedule became, quality checks were never skipped.', explanation: '"Adj + though + Subject + Verb" does NOT invert Subject and Verb.', difficulty: 2 }),
      gEx({ id: 'qc1-08-3', topicId: 'gram-c1-08-ellipsis-fronting-complex-modifiers', type: 'sentence_transformation', instruction: 'Apply "So + Adj" inversion cleanly.', prompt: 'Elevate gracefully: "The night breeze was so gentle that tea candles stayed lit outside." -> So gentle...', correctAnswer: 'So gentle was the night breeze that tea candles stayed lit outside.', explanation: 'Move "So gentle" upfront and invert "was the night breeze".', difficulty: 2 }),
    ],
  }),
];
