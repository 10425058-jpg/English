import type { AIMessage, AITutorMode, CEFRLevel, Mistake } from '@english-quest/shared';

export interface AITutorInput {
  mode: AITutorMode;
  bilingual: boolean;
  learnerLevel: CEFRLevel;
  userMessage: string;
  recentMistakes: Mistake[];
}

export interface ValidatedTutorOutput {
  content: string;
  structured: NonNullable<AIMessage['structured']>;
  providerMode: 'local_rule_based' | 'server_llm';
}

export interface AITutorProvider {
  readonly id: string;
  readonly isCloudModel: boolean;
  reply(input: AITutorInput): Promise<ValidatedTutorOutput>;
}

/**
 * Validates structured tutor responses before rendering so malformed payloads
 * can never break UI rendering or inject unsafe HTML.
 */
export function validateTutorOutput(raw: unknown): ValidatedTutorOutput {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid tutor response payload.');
  }
  const obj = raw as Record<string, unknown>;
  const content = typeof obj.content === 'string' && obj.content.trim() ? obj.content.trim() : 'Let us keep practicing together!';
  const rawStruct = (obj.structured && typeof obj.structured === 'object' ? obj.structured : {}) as Record<string, unknown>;

  return {
    content,
    providerMode: obj.providerMode === 'server_llm' ? 'server_llm' : 'local_rule_based',
    structured: {
      correctedText: typeof rawStruct.correctedText === 'string' ? rawStruct.correctedText : undefined,
      naturalAlternative:
        typeof rawStruct.naturalAlternative === 'string' ? rawStruct.naturalAlternative : undefined,
      explanation: typeof rawStruct.explanation === 'string' ? rawStruct.explanation : undefined,
      explanationVi:
        typeof rawStruct.explanationVi === 'string' ? rawStruct.explanationVi : undefined,
      followUpQuestion:
        typeof rawStruct.followUpQuestion === 'string' ? rawStruct.followUpQuestion : undefined,
      savedVocabularyTip:
        typeof rawStruct.savedVocabularyTip === 'string' ? rawStruct.savedVocabularyTip : undefined,
    },
  };
}

function detectQuickCorrection(text: string): {
  corrected?: string;
  explanation?: string;
  explanationVi?: string;
} {
  let fixed = text.trim();
  const notes: string[] = [];
  const notesVi: string[] = [];

  if (/\bi am agree\b/i.test(fixed)) {
    fixed = fixed.replace(/\bi am agree\b/gi, 'I agree');
    notes.push('"Agree" is a verb, so say "I agree" rather than "I am agree".');
    notesVi.push('"Agree" là động từ thường, nên nói "I agree" chứ không dùng "I am agree".');
  }
  if (/\bi\b/.test(fixed)) {
    fixed = fixed.replace(/\bi\b/g, 'I');
    notes.push('Always capitalize the pronoun "I".');
    notesVi.push('Đại từ "I" luôn phải viết hoa.');
  }
  if (/\byesterday i go\b/i.test(fixed)) {
    fixed = fixed.replace(/\byesterday i go\b/gi, 'Yesterday I went');
    notes.push('Use the past tense "went" with past time markers like "yesterday".');
    notesVi.push('Với dấu hiệu quá khứ như "yesterday", hãy dùng động từ quá khứ "went".');
  }
  if (/\bgo to home\b/i.test(fixed)) {
    fixed = fixed.replace(/\bgo to home\b/gi, 'go home');
    notes.push('"Home" acts as an adverb here: say "go home" without "to".');
    notesVi.push('Dùng "go home" trực tiếp, không thêm giới từ "to".');
  }
  if (/\bmore better\b/i.test(fixed)) {
    fixed = fixed.replace(/\bmore better\b/gi, 'much better');
    notes.push('Avoid double comparatives: use "better" or "much better".');
    notesVi.push('Không dùng "more better"; hãy dùng "better" hoặc "much better".');
  }

  if (notes.length === 0) return {};
  return {
    corrected: fixed,
    explanation: notes.join(' '),
    explanationVi: notesVi.join(' '),
  };
}

export class LocalSmartTutorProvider implements AITutorProvider {
  readonly id = 'local-smart-coach-v1';
  readonly isCloudModel = false;

  async reply(input: AITutorInput): Promise<ValidatedTutorOutput> {
    const msg = input.userMessage.trim();
    const correction = detectQuickCorrection(msg);
    const bilingual = input.bilingual;

    if (input.mode === 'explain_mistakes') {
      const unresolved = input.recentMistakes.filter((m) => !m.resolved);
      if (unresolved.length === 0) {
        return validateTutorOutput({
          providerMode: 'local_rule_based',
          content:
            'Great news! Your Mistake Notebook currently has no unresolved mistakes. Complete a lesson or quiz and come back anytime for targeted explanations.',
          structured: {
            explanation: 'All recorded mistakes are resolved right now.',
            explanationVi: bilingual
              ? 'Hiện tại bạn chưa có lỗi sai nào cần sửa trong Sổ Lỗi Sai. Hãy hoàn thành thêm bài học để mình phân tích giúp bạn nhé!'
              : undefined,
            followUpQuestion: 'Would you like to test yourself with a quick sentence using "Present Perfect" or "Past Simple"?',
          },
        });
      }

      const top = unresolved[0];
      return validateTutorOutput({
        providerMode: 'local_rule_based',
        content: `Let's review your recent mistake from "${top.prompt}". You wrote "${top.userAnswer || '(blank)'}", whereas the expected answer is "${top.expectedAnswer}".`,
        structured: {
          correctedText: top.expectedAnswer,
          explanation: top.explanation,
          explanationVi: bilingual
            ? top.explanationVi ?? `Đáp án đúng là "${top.expectedAnswer}". Hãy chú ý cấu trúc câu trong ngữ cảnh này.`
            : undefined,
          followUpQuestion: `Can you write a brand-new sentence using "${top.expectedAnswer}" right now?`,
        },
      });
    }

    const modeResponses: Record<Exclude<AITutorMode, 'explain_mistakes'>, {
      lead: string;
      natural: string;
      vocabTip: string;
      followUp: string;
      viNote: string;
    }> = {
      free_conversation: {
        lead: `Thanks for sharing! At level ${input.learnerLevel}, your message communicates clearly.`,
        natural: msg.length < 35 ? `You could expand that naturally as: "Actually, ${msg.replace(/^[a-z]/, (c) => c.toLowerCase())} because it helps me stay motivated."` : `"${msg}"`,
        vocabTip: 'Useful connector: "Actually, what I enjoy most is..."',
        followUp: 'What part of your daily routine makes learning English easiest for you?',
        viNote: 'Mẹo giao tiếp: Thêm một lý do ngắn sau "because" giúp câu nói tự nhiên và đạt điểm trôi chảy cao hơn.',
      },
      grammar_teacher: {
        lead: `Let's inspect the grammar in your sentence (${input.learnerLevel} level).`,
        natural: correction.corrected ?? `Check tense consistency and subject-verb agreement in: "${msg}"`,
        vocabTip: 'Grammar anchor: Keep one clear time marker per clause.',
        followUp: 'Try rewriting your sentence in the past tense or with "because"!',
        viNote: 'Mẹo ngữ pháp: Luôn kiểm tra thì của động từ (hiện tại/quá khứ/tương lai) và chủ ngữ số ít/số nhiều.',
      },
      vocabulary_coach: {
        lead: 'Let us upgrade your word choice with richer everyday collocations.',
        natural: `Instead of basic adjectives, try pairing strong verbs and nouns like "make steady progress" or "boost confidence".`,
        vocabTip: 'Collocation spotlight: "build a habit" / "gain confidence" / "expand vocabulary"',
        followUp: 'Can you use "make steady progress" in a sentence about your goals?',
        viNote: 'Học từ theo cụm (collocation) giúp bạn nói tự nhiên như người bản ngữ thay vì ghép từng từ đơn lẻ.',
      },
      pronunciation_coach: {
        lead: 'Focus on word stress and clear final consonants (-s, -ed, -t, -d).',
        natural: 'Read your phrase aloud in 2-word or 3-word thought groups, stressing the key content words.',
        vocabTip: 'Tip: Use the Audio button in Speaking Lab to shadow at 0.85x speed first.',
        followUp: 'Which English sound feels trickiest for you right now: /θ/ ("think"), /ʃ/ ("she"), or final "-ed" endings?',
        viNote: 'Lưu ý phát âm: Đừng bỏ âm cuối (-t, -d, -s, -ed) vì chúng thay đổi nghĩa và thì của câu.',
      },
      writing_assistant: {
        lead: 'Looking at structure and clarity for your writing:',
        natural: 'Start with a clear topic sentence, add one concrete example, and finish with a brief takeaway.',
        vocabTip: 'Transition trio: "First of all," -> "For instance," -> "As a result,"',
        followUp: 'What is the main point you want your reader to remember in one sentence?',
        viNote: 'Cấu trúc đoạn văn chuẩn: Câu chủ đề (Topic) -> Giải thích -> Ví dụ cụ thể -> Kết luận ngắn.',
      },
      ielts_examiner: {
        lead: 'IELTS Practice Coach note (unofficial practice guidance):',
        natural: 'Aim to extend Part 1/Part 3 answers to 2–4 sentences: direct answer + reason + concrete example.',
        vocabTip: 'IELTS phrase: "From my perspective, a major factor is..."',
        followUp: 'Let us try a Part 1 question: How has technology changed the way people learn languages in your country?',
        viNote: 'Khi luyện IELTS Speaking, tránh trả lời chỉ 1 câu ngắn; hãy mở rộng bằng lý do và ví dụ thực tế.',
      },
      debate_partner: {
        lead: 'Interesting viewpoint! Here is a friendly counter-perspective to sharpen your argument:',
        natural: 'While remote study offers flexibility, some learners find in-person classrooms create stronger social accountability.',
        vocabTip: 'Debate frame: "While I see your point about..., I would argue that..."',
        followUp: 'How would you respond to someone who prefers the opposite side?',
        viNote: 'Trong tranh luận, công nhận ý kiến đối phương bằng "While I see your point..." giúp lập luận thuyết phục hơn.',
      },
      think_in_english: {
        lead: 'Think-in-English Sprint! Describe what is around you right now without translating word-for-word.',
        natural: 'Name 3 objects near you, 1 action happening now, and 1 plan for tonight.',
        vocabTip: 'Quick frame: "Right now I am looking at..., and later I plan to..."',
        followUp: 'Tell me 3 things you can see on your desk or around your room in English!',
        viNote: 'Mẹo tư duy bằng tiếng Anh: Gọi tên trực tiếp sự vật và hành động xung quanh bạn bằng các câu ngắn 5-8 từ.',
      },
    };

    const modeKey = input.mode as Exclude<AITutorMode, 'explain_mistakes'>;
    const template = modeResponses[modeKey] ?? modeResponses.free_conversation;

    return validateTutorOutput({
      providerMode: 'local_rule_based',
      content: `${template.lead} ${correction.explanation ? correction.explanation : ''}`.trim(),
      structured: {
        correctedText: correction.corrected,
        naturalAlternative: template.natural,
        explanation:
          correction.explanation ??
          `Offline Local Tutor Mode active (no external API key required). Running deterministic coaching for ${input.learnerLevel}.`,
        explanationVi: bilingual
          ? `${correction.explanationVi ? `${correction.explanationVi} ` : ''}${template.viNote}`
          : undefined,
        savedVocabularyTip: template.vocabTip,
        followUpQuestion: template.followUp,
      },
    });
  }
}

export const defaultTutorProvider: AITutorProvider = new LocalSmartTutorProvider();
