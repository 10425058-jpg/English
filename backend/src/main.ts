import { ENGLISH_QUEST_BACKEND_MODULES } from './app.module';

export function describeBackendArchitecture(): {
  service: string;
  status: string;
  modules: typeof ENGLISH_QUEST_BACKEND_MODULES;
} {
  return {
    service: 'english-quest-api',
    status: 'Phase 2 architecture blueprint ready (Phase 1 runs client-side offline-first)',
    modules: ENGLISH_QUEST_BACKEND_MODULES,
  };
}
