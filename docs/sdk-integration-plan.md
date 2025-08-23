# SDK integration plan (MVP)

Scope: Establish patterns for analytics and crash reporting without coupling to a vendor. Replace stubs with real SDKs in Sprint 3.

- Environments
  - dev: verbose logging, sampling disabled (100% events), PII scrubbing enabled.
  - prod: minimal logging, sampling default 50% for analytics, 100% for crash.
- Initialization
  - Mobile: `src/analytics` exports `Analytics`/`Crash` with `init(env)`; swap implementation via build-time alias when adopting a vendor.
  - Backend: add request logging and error hooks; future Sentry or OpenTelemetry integration.
- Privacy
  - No raw PII; use stable hashed IDs. Redact message bodies and custom props with potential PII.
- Sampling
  - Gate via remote config later; default constants now.
- Migration path
  - Introduce `analytics_provider` env and DI container; implement Sentry/Firebase adapters.

Deliverable in Sprint 1–2: stubs in mobile, doc in repo. Actual SDK hookup deferred.
