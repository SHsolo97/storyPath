# Execution Plan: StoryPath Interactive

## 0) Scope and intent

This plan turns the PRD into a concrete, staged program of work across product, engineering, content, operations, and go-to-market. It defines the architecture, workstreams, deliverables, milestones, staffing, risks, and success measurement to reach MVP in 4 months and mature the platform over 12 months.

## 1) Objectives recap (from PRD)

- Product: Mobile interactive visual novels with meaningful branching choices and high-quality art.
- Business: 100K+ MAU in 12 months, revenue via premium unlocks/IAP, 20+ complete arcs, brand recognition, scalable platform.
- User: Compelling, replayable, diverse stories; clear premium vs free; accessible and performant.
- Non-goals: Complex RPG/stat mechanics, UGC at launch, real-time multiplayer/social, non-mobile platforms initially.

## 2) Assumptions and constraints

- Platforms: iOS 15+ and Android 8+.
- Tech choice: Cross-platform mobile (recommended: React Native + TypeScript) for speed and shared code; native modules only where needed (IAP, media, performance).
- Backend: Managed cloud (e.g., AWS/Azure/GCP). Recommended: Node.js (TypeScript) services, Postgres for relational data, object storage + CDN for assets, Redis for caching.
- Auth: Apple/Google sign-in + email; use a managed provider (e.g., Firebase Auth or Auth0). Recommendation: Firebase Auth for time-to-market.
- IAP: App Store + Google Play Billing. Consider RevenueCat to simplify cross-store handling and entitlements.
- Analytics: Product analytics + crash reporting (e.g., Firebase Analytics + Amplitude/Mixpanel, Sentry/Crashlytics for stability).
- Content: In-house writers and illustrators; outsource overflow as needed. Initial 3–5 complete starter stories for MVP.
- Localization: English MVP; internationalization-ready content pipeline.

## 3) Product surfaces and core flows

- Library: Browse featured, genres, search, filters, story detail page.
- Reader: Dialogues, illustrations, animations/transitions, choice prompts (2–3+ options), history log, auto-advance, accessibility options.
- Progress: Save state, chapter bookmarks, replay from nodes/chapters.
- Monetization: Premium chapters/paths, bundles, restore purchases.
- Profile: Basic user profile, reading history, settings (text size, theme, audio cues).
- Offline: Download story packs (chapters + art) for offline reading.

## 4) Architecture overview

- Mobile app (React Native):
  - Presentation: Story library, reader UI, store/paywall, settings, profile.
  - Domain: Choice engine, state manager (flags/variables), save system, download manager, entitlement manager.
  - Data: API client, cache layer, local DB (e.g., SQLite/WatermelonDB), asset cache.
- Backend services:
  - API Gateway: Authentication, rate limiting.
  - Content Service: Story/Chapter metadata, versions, publishing pipeline.
  - Progress Service: Saves, bookmarks, achievements.
  - Commerce Service: Products, pricing, entitlements, receipts/verification (or delegate to RevenueCat).
  - Recommendation/Analytics (Phase 3): Personalized recommendations, path analytics.
- Storage:
  - Postgres: Users, profiles, purchases (if self-managed), progress, catalog metadata.
  - Object Storage (S3/GCS/Azure): Images, audio, downloadable story packs.
  - CDN: Asset delivery with versioned paths.
- Observability: Logs (structured), metrics (latency, error rates), tracing; Sentry for client errors.

### 4.1 Content model and story format

- Story: id, title, description, genre(s), cover art, age rating, premium model.
- Chapter: id, storyId, index, title, estimated length, premium status, assets.
- Scene/Node graph: nodes with text, speaker, illustration ref, choices with conditions, effects (set flags, adjust relationships), and jump targets.
- Variables: global (per story) and scoped (per chapter/scene) with types (bool, number, enum, string).
- Versioning: Immutable published builds with semver; draft/published states; content packs per version.
- For MVP, use a JSON schema housed in the Content Service; consider adopting Ink or a custom DSL/editor in Phase 2–3.

### 4.2 Offline strategy

- User selects “Download for offline” on a story or auto-prefetch current chapter+1.
- Pack format: manifest + assets zipped; integrity via checksum; lazy-unpack assets; LRU eviction.
- Conflict resolution: Server-authoritative saves; merge via last-write-wins per variable + bookmark granularity.

### 4.3 Monetization model

- Free: Opening chapters; occasional free branch samplers; ad-free product (ads not in scope).
- Premium: Chapter bundles or full-story unlocks; occasional discounts; restore purchases.
- Entitlements: Managed by RevenueCat or self-managed Commerce Service with server receipt validation.

## 5) Delivery roadmap and milestones

Timeline assumes 2-week sprints. Months refer to calendar from project start.

### Phase 1 (Months 1–4): MVP

- Sprint 1–2: Foundations
  - Choose stack, set up repo, CI/CD, coding standards, analytics/crash reporting.
  - Design system tokens, UI kit, navigation scaffolding.
  - Backend scaffolding (Auth, Content, Progress), DB schema v1, seed sample story.
- Sprint 3–4: Reader + Choice Engine v1
  - Render dialogues, illustrations, basic animations.
  - Choice prompts, flag set/read, basic conditional branching.
  - Save/restore, chapter bookmarks; local cache.
- Sprint 5–6: Library + Monetization
  - Browse, detail page, search/filters, genres.
  - IAP integration (storefront, paywalls), entitlements, restore purchases.
  - Basic profile/history; offline download MVP (chapter-level).
- Sprint 7–8: Content + Polish + Soft Launch
  - Ship 3–5 complete starter stories across genres; content pipeline + review.
  - Accessibility pass (font scaling, color contrast, screen reader labels).
  - Beta/soft launch (1–2 countries), analytics dashboards, crash/stability SLOs.

Exit criteria MVP:

- P0 flows stable (p95 crash-free users > 99.5%, app start < 2.5s, bundle size < 60MB base).
- 3–5 stories live, at least 1 with 2+ major branches and replayability cues.
- IAP working end-to-end; analytics taxonomy in place.

### Phase 2 (Months 5–8): Content expansion and systems

- Relationship tracking and consequences (variables/affinity meters).
- Achievements/collectibles; advanced offline (whole-story packs); recommendations v0 (rule-based).
- +10 story arcs; content ops scaling (outsourcing, SLAs, quality gates).
- Social sharing (client-side image share of moments), referral program.

### Phase 3 (Months 9–12): Platform maturation

- Recommendation engine v1 (content-based + popularity + heuristics).
- Advanced choice analytics and path visualization (internal tooling).
- Community features (discussions) and creator tooling discovery (research + prototype).
- Internationalization rollout; expanded markets and UA scale-up.

## 6) Workstreams and ownership

- Product Management: Backlog, prioritization, roadmap, KPI ownership.
- UX/UI: Information architecture, wireframes, hi-fi, motion, accessibility, design system.
- Mobile Engineering: App features, choice engine, offline, performance.
- Backend Engineering: APIs, content pipeline, commerce, progress, observability.
- Content: Narrative design, writing, editing, illustration, QC, style guides.
- Data/Analytics: Event taxonomy, dashboards, experiments, insights.
- QA: Test plans, manual/exploratory, device matrix, automation.
- DevOps/Release: CI/CD, environments, store submissions, feature flags, rollout.
- Marketing/UA: Soft launch, creatives, ASO, referral program, partnerships.

## 7) Detailed deliverables (by area)

### 7.1 Mobile app (MVP)

- Navigation and Shell: Home, Library, Story Detail, Reader, Profile, Settings, Store/Paywalls.
- Reader: Scene renderer, choice UI, history log, auto-advance, skip, font scaling, dark mode.
- Choice Engine v1: JSON-driven nodes, conditions, variables, effects, jumps; deterministic replays.
- Save System: Auto-save per scene boundary; manual bookmarks; cloud sync.
- Offline v1: Per-chapter download; LRU cache; retry/resume; storage quotas; indicators.
- IAP: Paywalls, product list, purchase/restore, entitlement gating, error handling.
- Telemetry: Screen views, story lifecycle, choice selections, purchases, download events, crashes.

### 7.2 Backend (MVP)

- Auth integration (Firebase Auth). Token verification on gateway.
- Content Service v1: CRUD for Story/Chapter metadata; storage integration; publish pipeline; versioning.
- Progress Service v1: Save slots, bookmarks, achievements schema (placeholder), replay seeds.
- Commerce v1: Price catalog, entitlement lookup; if RevenueCat, implement webhook -> entitlement sync; if self-managed, server receipt verification and anti-fraud.
- Admin Tools v0: Simple CMS (internal) or admin endpoints with Postman/Insomnia collections; S3 upload workflow.
- Observability: Structured logs, basic metrics, alerting.

### 7.3 Content pipeline (MVP)

- Story bible template; branching outline process; variable/flag design.
- Art pipeline: aspect ratios, safe areas, export presets (WebP/PNG), naming convention, compression targets.
- Review gates: Narrative review, sensitivity, editorial QA, visual QA on device.
- Content calendar: Backlog grooming and cadence for releases.

### 7.4 Analytics and experimentation

- Event taxonomy (MVP):
  - app_start, app_foreground
  - story_view, story_start, story_complete, chapter_start, chapter_complete
  - choice_presented, choice_selected, choice_skipped
  - download_start/success/failure, offline_read_start
  - paywall_view, purchase_attempt/success/failure, restore_attempt/success
  - retention_day_n, session_start/end
- Dashboards: Acquisition funnel, engagement (time per chapter), conversion, retention cohorts, revenue.
- Experiments (post-MVP): Paywall copy, free/premium mix, recommendations.

### 7.5 QA and device matrix

- Test strategy: Unit (engine), integration (reader), end-to-end (critical paths).
- Device matrix: iOS (iPhone 11–current, iPad check later), Android (mid/low/high tiers, 720p–1440p).
- Performance budgets: App start < 2.5s; frame time p95 < 16ms in reader; image memory footprint capped per device class.
- Accessibility: VoiceOver/TalkBack labels, dynamic type, high-contrast, touch targets ≥ 44pt.

### 7.6 Security and privacy

- Data minimization: Store only required PII; clear data retention policies.
- Transport security: TLS everywhere; cert pinning optional post-MVP.
- Storage: At-rest encryption for sensitive data; Keychain/Keystore for tokens.
- Compliance: App Store/Play policies, GDPR/CCPA readiness (DSAR process, privacy policy), COPPA N/A (18+ target).

### 7.7 Release management

- Environments: Dev, Staging, Prod. Feature flags for risky features.
- CI/CD: Lint, test, build, sign; beta distribution (TestFlight, Play Internal testing); phased rollout (10% -> 50% -> 100%).
- Crash response: On-call rotation, rollback protocols, hotfix cadence.

## 8) Team and staffing (first 6 months)

- Core: 1 PM, 1 Design Lead, 3 Mobile Engineers, 2 Backend Engineers, 1 QA Engineer, 1 Data Analyst, 1 DevOps (part-time shared), 2 Writers, 2 Illustrators, 1 Narrative Designer, 1 Producer.
- Augment as needed for Phase 2 content scale (writers, artists, QA).

## 9) Risks and mitigations

- Content throughput bottleneck → Staggered pipeline, outsource partners, modular art reuse, strict templates.
- Performance on low-end Android → Aggressive asset optimization, dynamic quality, native modules where needed.
- IAP complexity → Use RevenueCat initially; later in-house if cost/lock-in becomes an issue.
- Branching complexity/continuity errors → Strong schema, lint/validation tools, automated path checks.
- Delays in art delivery → Buffer in content calendar, stock placeholders, parallel writing.
- Store rejections → Adhere to guidelines, early test submissions, handle restore purchases and account deletion flows.

## 10) Budget levers (high-level)

- Cloud: CDN + object storage primary; reserved instances/serverless to control cost.
- Tools: RevenueCat, Firebase/Auth0, Sentry/Crashlytics, Amplitude/Mixpanel.
- Content: Mix of in-house and freelance; per-illustration and per-word rates; maintain quality bar with reviews.

## 11) Phase-wise acceptance criteria

- Phase 1 (MVP):
  - Users can discover, read, make choices, save progress, and unlock premium chapters seamlessly.
  - 3–5 stories live with meaningful branching; at least one encourages replay.
  - Offline read works for current and next chapter; purchases sync across devices.
  - Analytics dashboards show MAU/DAU, conversion, and retention.
- Phase 2:
  - Relationship variables visibly influence content; achievements/collectibles live.
  - 10+ additional arcs; onboarding and paywalls A/B tested.
  - Offline whole-story packs; referrals live; recommendations v0.
- Phase 3:
  - Recommendations improve CTR to read; path analytics tooling aids content teams.
  - Community features available; creator tools R&D complete.

## 12) Implementation plan by sprint (first 8 sprints)

- S1: Project setup, CI/CD, analytics/crash, design tokens, backend scaffold, auth, sample story.
- S2: Reader v1 (text/illustrations), choice UI, variables/effects, simple saves.
- S3: Library + detail, search/filter, content list, CDN integration.
- S4: Cloud saves/bookmarks, profile/settings, asset cache, download manager v0.
- S5: IAP integration (sandbox), paywalls, entitlement checks, restore.
- S6: Offline v1 (chapter), QA hardening, accessibility pass, polish.
- S7: Content load-in (3–5 stories), localization-ready content, dashboards.
- S8: Soft launch, monitor, fix, iterate; go/no-go gates for wider rollout.

## 13) Definition of Done (DoD) and quality gates

- DoD: Tested, documented, instrumented, behind a feature flag if risky, performance within budget, accessibility checked, code reviewed.
- Release gates: Build passes CI, crash-free sessions > 99.5% on beta, no Sev-1 bugs open, analytics verified.

## 14) Go-to-market (GTM) and soft launch plan

- Markets: Soft launch in 1–2 English-speaking regions with lower UA cost (e.g., CA, AU, NZ).
- Creatives: App preview videos highlighting choices; screenshots per genre; ASO keywords.
- KPIs: D1/D7 retention, conversion to first purchase, time-to-first-choice, story completion rate.
- Iterations: Paywall copy, free/premium mix, featured rotation, onboarding tweaks.

## 15) Next steps (immediately actionable)

- Finalize stack choices (React Native + RevenueCat + Firebase Auth + Node/Postgres).
- Draft content bible and style guides; commission first art batch.
- Define JSON schema for story nodes; build internal validator.
- Set up repos, CI/CD, environments, observability; instrument baseline analytics.
- Create sprint 1 and 2 tickets and kick off.
