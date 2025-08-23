# Sprint 1–2: Foundations

This checklist turns plan.md S1–S2 into concrete, bite-sized tasks to kick off immediately.

## Objectives

- Establish repos, CI/CD, coding standards, and baselines for analytics/crash.
- Define story JSON schema and build a validator.
- Backend scaffolding for Auth, Content, Progress; DB schema v1.
- Design tokens and navigation skeleton for the app.
- Seed a minimal sample story for end-to-end dev.

## Deliverables

- Repo structure and initial README.
- JSON Schema for story/chapters/nodes.
- Validator script and sample story pack.
- Architecture decision records (key choices).
- Analytics taxonomy doc and tracking plan.
- DB schema v1 ERD and migration stub.

## Work breakdown

### Engineering platform

- [x] Initialize monorepo or multi-repo structure (mobile, backend, content tools)
- [x] CI/CD pipeline stubs (schema validation + backend typecheck)
- [x] Code quality: Prettier, ESLint/TSConfig
- [x] Commit hooks (pre-commit validate-story, lint-staged)
- [x] Crash/analytics SDK selection and placeholders

### Content model

- [x] Finalize JSON schema (Story, Chapter, Node, Choice, Variables)
- [x] Create sample story pack with 2 chapters and 1 branch
- [x] Build Node.js validator script
- [x] Add Git pre-commit hook

### Backend scaffolding

- [x] Choose stack (Node TS + Fastify) and create services (gateway, content, progress)
- [x] Define DB schema v1 (users, stories, chapters, saves, bookmarks) doc
- [x] Seed endpoints: GET /stories, GET /stories/:id, GET /stories/:id/chapters (content); POST /progress (progress)
- [x] Local docker-compose for Postgres + Adminer
- [x] DB migrations (Prisma) and connection wiring

### Mobile app scaffolding

- [x] React Native app init with TypeScript (Expo project files)
- [x] Navigation skeleton (Library, StoryDetail, Reader)
- [x] Design tokens doc (colors, typography, spacing)
- [x] Install Expo deps; basic API fetch from content service
- [x] Dark mode support stub
- [x] Local storage foundation (Bookmark/Save placeholder)

### Analytics

- [x] Event taxonomy reviewed and frozen for MVP
- [x] Tracking plan doc (events, properties, owner, status)
- [x] SDK integration plan (environments, privacy, sampling)

### Docs

- [x] ADRs for major decisions (cross-platform choice, IAP provider, auth)
- [x] Contribution guide and coding standards
- [x] Security/privacy baseline

## Milestones

- End of S1: Repos + CI/CD live; schema + validator; RN skeleton runs; backend boots and serves sample data.
- End of S2: Reader v1 can load sample story from local JSON and render text/choices; simple saves local.
