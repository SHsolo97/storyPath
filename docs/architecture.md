# Architecture overview (Sprint foundations)

This doc captures initial system choices and trade-offs to unblock Sprint 1–2.

## Mobile app

- Stack: React Native + TypeScript, React Navigation, Zustand/Redux for state, SQLite for offline cache.
- Native integrations: IAP (RevenueCat SDK), Auth (Firebase Auth), Crash (Sentry/Crashlytics).
- The reader is a scene graph renderer driven by validated JSON.

## Backend

- Stack: Node.js (TypeScript) + Fastify; Postgres via Prisma ORM; Redis for caching later.
- Services: API Gateway (Auth token check), Content, Progress. Commerce via RevenueCat webhooks later.
- Hosting: Any major cloud (AWS/GCP/Azure). Start with managed Postgres and object storage + CDN.

## Content format

- JSON schema (schemas/story.schema.json) with strong typing for nodes/choices and variables.
- Assets stored in object storage; JSON references by URL or asset key; versioned packs.

## Observability

- Mobile: Sentry/Crashlytics; analytics events per taxonomy.
- Backend: pino logs, basic latency/error metrics; later tracing.

## Security

- Firebase Auth tokens verified at gateway; least-privilege service accounts.
- At-rest encryption for sensitive data; Keychain/Keystore for client tokens.

## Open questions (to resolve by end of S2)

- State engine variable scoping semantics and conflict resolution rules.
- Save file format for deterministic replays.
- Asset packaging for offline (zip vs. per-file caching) and eviction policies.
