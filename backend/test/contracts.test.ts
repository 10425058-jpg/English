import { describe, expect, it } from 'vitest';
import {
  ENGLISH_QUEST_BACKEND_MODULES,
  validateLessonRequestShape,
} from '../src/app.module';
import { describeBackendArchitecture } from '../src/main';

describe('Backend Phase 2 contract blueprint', () => {
  it('defines all planned modular boundaries', () => {
    const info = describeBackendArchitecture();
    expect(info.service).toBe('english-quest-api');
    expect(ENGLISH_QUEST_BACKEND_MODULES.map((m) => m.name)).toEqual([
      'AuthModule',
      'CurriculumModule',
      'ProgressModule',
      'AITutorModule',
    ]);
  });

  it('validates idempotent lesson completion contract shape', () => {
    expect(
      validateLessonRequestShape({
        idempotencyKey: 'lesson-a1-u1-l1-1234',
        lessonId: 'a1-u1-l1',
        unitId: 'a1-u1',
        accuracy: 95,
        durationSeconds: 180,
        attempts: [],
      })
    ).toBe(true);

    expect(
      validateLessonRequestShape({
        idempotencyKey: '',
        lessonId: 'a1-u1-l1',
        unitId: 'a1-u1',
        accuracy: 95,
        durationSeconds: 180,
        attempts: [],
      })
    ).toBe(false);
  });
});
