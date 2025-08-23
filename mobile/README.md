# Mobile app (Sprint 1–2)

- Local storage foundation via `@react-native-async-storage/async-storage` in `src/storage/local.ts` (last read + bookmarks helpers).
- Analytics/crash placeholders in `src/analytics` with console-backed stubs. Replace with real SDKs in a later sprint.
- Dark mode enabled; simple navigation and Library screen fetching from content service at http://localhost:4001.

Run:

```bash
# from repo root
npm --workspaces install
# start backend services separately, then
cd mobile
npm start
```
