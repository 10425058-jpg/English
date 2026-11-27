import { describe, expect, it } from 'vitest';
import { WRITING_LAB_PROMPTS } from '@/data/writingPromptsData';
import { defaultTutorProvider } from '@/services/aiTutorEngine';
import { analyzeWritingLocally, countWords } from '@/services/writingAnalyzer';

describe('Local Writing Analyzer', () => {
  it('analyzes writing constructively without altering user original work', () => {
    const prompt = WRITING_LAB_PROMPTS[0];
    const draft = 'Every morning i wake up at six and drink tea.';
    const feedback = analyzeWritingLocally(prompt, draft);

    expect(countWords(draft)).toBe(10);
    expect(feedback.analysisKind).toBe('local_heuristic_unofficial');
    expect(feedback.grammarNotes.some((n) => n.suggestion.includes('Capitalize'))).toBe(true);
    expect(feedback.sampleResponse).toBe(prompt.sampleResponse);
  });
});

describe('Local Smart AI Tutor Provider', () => {
  it('validates output and pulls real mistakes in explain_mistakes mode', async () => {
    const res = await defaultTutorProvider.reply({
      mode: 'explain_mistakes',
      bilingual: true,
      learnerLevel: 'A2',
      userMessage: 'Explain my error',
      recentMistakes: [
        {
          id: 'm1',
          source: 'lesson',
          skill: 'grammar',
          cefrLevel: 'A2',
          prompt: 'We didn’t ___ yesterday.',
          userAnswer: 'went',
          expectedAnswer: 'go',
          explanation: 'Use base verb after didn’t.',
          createdAt: new Date().toISOString(),
          resolved: false,
          retryCount: 0,
        },
      ],
    });

    expect(res.providerMode).toBe('local_rule_based');
    expect(res.structured.correctedText).toBe('go');
    expect(res.structured.explanationVi).toBeTruthy();
  });
});
