# English Quest — REST API Contract Draft (Phase 2 & Phase 3)

Shared request/response TypeScript interfaces live in [`packages/shared/src/types/api.ts`](../packages/shared/src/types/api.ts).

## Base URL
`/api/v1`

## Planned Endpoints

### Auth & Account Migration (Phase 2)
- `POST /auth/register` — Create user account with password hashing (`argon2id`), return `AuthSessionResponse`.
- `POST /auth/login` — Authenticate credentials, return short-lived JWT access token + rotating refresh token.
- `POST /auth/migrate-guest` — Accepts `GuestMigrationPayload` (`lessonProgress`, `xpTransactions`, `streak`, `vocabularySchedules`, `mistakes`, etc.) and merges idempotently via `idempotencyKey`.
- `GET /users/me/export` & `DELETE /users/me` — Full user data export and account/recording deletion.

### Curriculum & Learning (Phase 2)
- `GET /curriculum/sections` — List CEFR sections and unit summaries.
- `GET /curriculum/units/:unitId` — Fetch unit lessons and guide notes.
- `POST /progress/lessons/complete` — Body: `CompleteLessonRequest` (requires unique `idempotencyKey`). Returns `CompleteLessonResponse` (`duplicateIgnored: true` on network retries).
- `POST /progress/chests/:unitId/claim` — Validates unit completion server-side before awarding Gems/XP.

### Vocabulary & Mistakes (Phase 2)
- `GET /vocabulary/due` — Query SM-2 items due by `nextReviewDate`.
- `POST /vocabulary/:id/review` — Apply server-side SM-2 rating (`1 | 3 | 4 | 5`).
- `GET /mistakes` & `POST /mistakes/:id/resolve` — Retrieve and retry unresolved errors.

### AI Tutor, Writing & Speech Providers (Phase 3)
- `POST /ai/tutor/reply` — Body: `AITutorRequest`. Server checks per-user rate limit & daily token budget (`AI_DAILY_TOKEN_BUDGET`), queries OpenAI-compatible provider, validates JSON output schema, and returns structured reply (SSE streaming supported).
- `POST /ai/writing/evaluate` — Criterion-based writing feedback (never mutates user original submission).
- `POST /speech/assess` — Dedicated pronunciation provider adapter (separate from browser STT).
