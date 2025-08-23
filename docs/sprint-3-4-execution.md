# Sprint 3–4: Execution and Hardening

This checklist continues from S1–S2 and tracks the implementation/hardening we targeted for S3–S4.

## Objectives

- Harden CI/security and stabilize local dev infra (database, migrations, seeding).
- Implement and wire the reader flow end-to-end (content → mobile → progress persistence).
- Unblock strict TypeScript on mobile and reduce DX friction.
- Add orchestration scripts for fast local spin-up.

## Deliverables

- CI/security hardening (CodeQL, Dependabot, seed-check workflow).
- Stable Postgres + Prisma migrations and seed running locally.
- Content service serving sample story; Progress service with GET/POST.
- Mobile reader flow integrated with content and progress; typecheck passing.
- Root scripts to start DB and services concurrently.
- Passing end-to-end smoke test (content + progress roundtrip).

## Work breakdown

### CI/Security & DevX

- [x] CodeQL workflow added
- [x] Dependabot configuration added
- [x] Seed-check workflow (ephemeral PG + prisma generate/migrate/seed)
- [x] Fix Husky deprecation and standardize Prettier formatting; pin Node/npm engines
- [ ] Consider enabling mobile typecheck in CI (currently deferred due to RN typings noise)

### Database & migrations

- [x] Docker Compose Postgres mapped to host 55432; Adminer exposed on 8080
- [x] DATABASE_URL updated across envs with password auth (no trust)
- [x] Prisma generate/migrate/seed succeed locally
- [ ] Use a dedicated non-superuser DB role in Prisma for least privilege

### Backend services

- [x] Content service: /health, /stories, /stories/:id, /stories/:id/chapters
- [x] Progress service: /health, GET /progress/:userId/:storyId, POST /progress
- [x] Replace temporary JSON `any` with `Prisma.JsonValue` and add DTO validation (basic required fields)
- [x] POST now upserts user for dev convenience and returns structured errors
- [ ] Add backend tests (unit + tiny e2e health/progress smoke)
- [ ] Investigate intermittent host access to progress /health from PowerShell; add alternate curl/Postman smoke recipe

### Mobile app (Expo RN 0.74 + TS)

- [x] Resolve strict TypeScript JSX errors; rely on Expo base JSX config; remove over-broad JSX shims
- [x] Reader flow: load story, step nodes/choices, save last read locally and to server
- [x] Env-aware API config (content 4001, progress 4002) and dev user constant
- [ ] Reader UI polish (images, speaker styling, end-of-chapter transitions)
- [ ] Strengthen variable types; remove ad-hoc `any` in state propagation
- [ ] Add basic tests (interpreter unit tests; snapshot for reader rendering)

### Orchestration

- [x] Root scripts: dev:db, db:down, dev:content, dev:progress, dev:backend (parallel), dev:up (db + backend)
- [x] tools/smoke.e2e.ts with root script `npm run smoke`
- [ ] Optional gateway/proxy for a single mobile base URL

### Docs & Monitoring

- [x] Update sprint docs and status for S3–S4
- [ ] Add lightweight monitoring/logging hooks and error tracking stubs in services

## Milestones

- End of S3: CI/security hardening complete; DB stable; content + progress services run locally; mobile typecheck passes.
- End of S4: Reader E2E demo (content fetch → read → choice → save to server) with smoke tests; JSON typing hardened and basic tests in place. Status: E2E smoke PASS locally.

## How to run (local)

- Start DB + services (from repo root):
  - `npm run dev:db`
  - `npm run dev:backend` (or `npm run dev:up` to start DB and services together)
- Verify endpoints:
  - Content: http://localhost:4001/stories and /stories/mystery-noir-001
  - Progress: http://localhost:4002/health, GET /progress/:userId/:storyId
- Run smoke (from repo root): `npm run smoke`
- Mobile: run `npm run start` in `mobile/` and launch in a simulator or device.

## Quality gates (current)

- Build/Lint/Typecheck:
  - Backend typecheck: PASS
  - Mobile typecheck: PASS (RN 0.74, Expo 51)
- Tests: Minimal; e2e smoke PASS (local); unit tests pending

## Dependency update triage (2025-08-24)

- Backend (merge in this order, validate with `npm run smoke` after each batch):
  - actions/checkout v5 (#1): safe infra upgrade.
  - lint-staged v16 (#11): requires Node ≥18; config unchanged for our usage.
  - @types/node 24 (#7): minor type impacts; merge with a quick typecheck.
  - Fastify v5 in content/progress (#6, #8) and @fastify/cors v11 (#9, #17): update together; our usage is compatible.
  - Prisma 6 (@prisma/client #13 and prisma #16): merge as a pair; run seed-check workflow and smoke.
- Mobile (defer to a dedicated upgrade sprint):
  - Expo 51 → 53 (#10), React Native 0.74 → 0.81 (#12), React 18 → 19 (#2, #3), react-navigation v7 (#4, #5), AsyncStorage v2 (#15).
  - Reason: managed workflow constraints and major-breaking changes; upgrade in a staged plan starting with Expo 53.
- Security scans: CodeQL enabled; Dependabot active
