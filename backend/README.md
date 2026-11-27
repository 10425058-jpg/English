# English Quest Backend (Phase 2 Blueprint)

This directory contains the normalized PostgreSQL Prisma schema (`prisma/schema.prisma`) and TypeScript module contracts for **Phase 2 (NestJS + PostgreSQL)** and **Phase 3 (Server-Side AI & Speech Providers)**.

## Status
- **Phase 1 (Current):** The English Quest frontend operates 100% standalone with persistent guest storage (`localStorage`), deterministic exercise validation, SM-2 vocabulary scheduling, and honest local speech/AI fallbacks — requiring no running backend or paid API keys.
- **Phase 2 (Next):** Bootstrap full NestJS runtime (`@nestjs/core`, `@nestjs/common`, `@nestjs/swagger`, `@prisma/client`) against `prisma/schema.prisma`, implement JWT auth + guest migration endpoint, and connect to Railway/Supabase PostgreSQL.
