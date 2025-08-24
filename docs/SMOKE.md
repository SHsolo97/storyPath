# Smoke test

Run a quick end-to-end smoke from the repo root:

```
pnpm install
pnpm run dev:db
pnpm run dev:backend # or pnpm run dev:up
pnpm run smoke
```

If `@prisma/client` types are missing, run:

```
pnpm -w --filter backend exec prisma generate
```
