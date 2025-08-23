# Sprint status

## Sprint 1–2 (Foundations)

Done

- Schema + validator; sample story
- Architecture and analytics docs (analytics taxonomy, tracking plan, SDK integration plan)
- Backend scaffolding: gateway, content, progress services; docker-compose for Postgres; Prisma schema and migrations wired
- Repo config: .editorconfig, .gitignore, ESLint, Prettier, Husky pre-commit with validator and lint-staged
- Mobile app init (Expo) with navigation, API fetch, dark mode, and local storage foundation (AsyncStorage)

Notes

- CI validates schema and typechecks backend services; mobile TS checks are deferred to runtime builds to avoid RN type noise in CI.

## Sprint 3–4 (Execution & Hardening)

Done

- CodeQL and Dependabot enabled; added seed-check CI workflow
- Postgres port remapped (55432) + password auth; Prisma generate/migrate/seed PASS
- Content service endpoints verified: /stories and /stories/:id
- Progress service implemented (GET/POST) with health; logs show listening
- Root scripts to orchestrate DB and services (dev:db, dev:backend, dev:up)
- Mobile TS typecheck PASS after removing custom JSX shims; reader flow wired to content and progress
- Progress POST hardened: Prisma.JsonValue typing, basic validation, user upsert
- E2E smoke test added and passing locally

In progress

- Add backend unit tests; wire smoke into CI
- Investigate intermittent host access to progress /health via PowerShell (use browser/Postman as alternative)
- Reader UI polish and interpreter tests
