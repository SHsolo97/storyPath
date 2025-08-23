# Mobile app (Sprint 1–2)

- Local storage foundation via `@react-native-async-storage/async-storage` in `src/storage/local.ts` (last read + bookmarks helpers).
- Analytics/crash placeholders in `src/analytics` with console-backed stubs. Replace with real SDKs in a later sprint.
- Dark mode enabled; simple navigation and Library screen fetching from the content service using environment-aware host resolution (`src/config/env.ts`).

Run:

```bash
# from repo root
npm --workspaces install
# start backend services separately, then
cd mobile
npm start
Notes:

- The app derives API base URLs at runtime (LAN IP for Expo; Android emulators use 10.0.2.2). Update ports in `src/config/env.ts` if services change.
```
