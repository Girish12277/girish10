# Study Hub: Level 1 → Level 100

## How it works today (verified)

- `src/store/studyStore.ts` — a single Zustand store with all study data (tasks, blocks, notes, decks/cards, goals, habits, assignments, reading, sessions) plus Pomodoro state. Persistence is a manual debounced `localStorage` write of a `PERSIST_KEYS` allow-list under `vlc-study-v1`. Timer uses an absolute `pomoEndsAt`, so it survives close/reload.
- `src/components/study/StudyEngine.tsx` — headless 500ms tick, fires `pomoComplete()`, OSD, chime, notification.
- `src/components/study/StudyHub.tsx` — one 1146-line file: header, sidebar, and all 11 tabs (Focus, Tasks, Planner, Assignments, Notes, Flashcards, Reading, Goals, Habits, Stats, Buddy). Lazy-loaded from `AppLayout`.
- `src/components/study/StudyStatusChip.tsx` — TitleBar entry point; the Hub has no separate launcher button.

### Why it feels "level 1"
1. Every tab lives in one chunk — opening the Hub pulls all 11 tabs plus `framer-motion`.
2. The Focus tab force-re-renders on a 250ms interval, re-rendering the whole tab subtree instead of just the clock.
3. Tabs are silos: a task can't be started as a focus session from Tasks, notes don't link to tasks, planner blocks don't drive anything, assignments don't feed the Focus queue.
4. No Today view — a student opens it and must pick a tab to figure out what to do next.
5. No search, no keyboard flow, no undo, no export/import. Data is one browser away from being lost.
6. Fixed 880px desktop-only frame; unusable on a small window.
7. Flashcard scheduling is SM-2 but has no daily cap, no cram mode, no per-deck stats.

---

## The upgrade plan

### Phase 1 — Foundation: split, speed, safety (no new features)
Goal: same functionality, dramatically faster and maintainable.

- Split `StudyHub.tsx` into `src/components/study/tabs/*.tsx` (one file per tab) plus `src/components/study/ui.tsx` for the shared atoms already in the file (`cardStyle`, `SectionTitle`, `PrimaryBtn`, `GhostBtn`, `TextInput`, `NumInput`, `EmptyHint`, `fmtMs`). `StudyHub.tsx` keeps the shell and lazy-imports each tab. No behaviour change — pure move.
- Replace the 250ms `force()` re-render with a small `<PomoClock />` leaf that subscribes to a tick, so the ring/clock update alone.
- Drop `framer-motion` from the Hub shell in favour of the CSS transitions already used elsewhere in the app (matches the earlier bundle-diet work).
- Add data safety: schema-versioned persistence with a migration hook, plus Export / Import JSON in a new Hub header menu.

Risk: the split is mechanical but touches one large file — verified by typecheck plus a click-through of all 11 tabs.

### Phase 2 — The student workflow (highest real value)
Goal: the Hub answers "what should I do right now?"

- **Today** tab, becomes the default: due-today tasks and assignments, cards due for review, habits not yet ticked, next planner block, today's focus minutes vs a daily goal. Everything actionable inline.
- **Start focus on this** — one button on any task or assignment sets `pomoActiveTaskId` and starts the timer; the Focus tab shows what you're working on.
- **Deadline pressure engine** — assignments get `estimateMin` vs days remaining, producing a "you need Xh/day" line and an at-risk badge. Uses existing fields, no schema change.
- **Quick capture** — one input (and a keyboard shortcut) that files a task, note, or card from anywhere in the Hub.
- **Global search** across tasks, notes, cards, assignments, reading.

### Phase 3 — Study quality + polish
- **Review session runner** for flashcards: daily new/review caps, cram mode, session summary, per-deck retention stat.
- **Notes upgrade**: markdown rendering, backlinks to tasks, and the existing video timestamp anchor made clickable to seek the player.
- **Stats that teach**: 14-day focus heatmap, best time of day, subject split from tags, streak honesty (no fake numbers).
- **Responsive shell**: the panel becomes full-screen below ~720px width with a top tab strip instead of the sidebar.
- **Keyboard layer**: `1-9` tab switch, `n` new item, `/` search, `space` start/pause focus, all scoped to the Hub.
- **PWA/offline check**: confirm the Hub's chunks are precached so it opens offline.

---

## Files touched

| Phase | Files |
|---|---|
| 1 | `StudyHub.tsx` (shell only), new `study/tabs/*.tsx`, new `study/ui.tsx`, `studyStore.ts` (version + migrate + export/import) |
| 2 | new `study/tabs/TodayTab.tsx`, `TasksTab`, `AssignmentsTab`, `PomodoroTab`, `StudyHub.tsx` (quick capture + search), `studyStore.ts` (derived selectors only) |
| 3 | `study/tabs/FlashcardsTab.tsx`, `NotesTab.tsx`, `StatsTab.tsx`, `StudyHub.tsx` (responsive + keys) |

No new dependencies. No backend — data stays local, with export/import as the safety net.

## Assumptions and risks
- Local-only storage is acceptable for now; cloud sync across devices is a separate project (needs Lovable Cloud + auth) and is deliberately out of scope.
- Splitting the tab file is the one change that touches everything; it lands first and alone so any regression is obvious.
- Existing persisted data must keep loading — the migration is additive, defaults fill any missing field.

## Suggested order
Phase 1 → review → Phase 2 → review → Phase 3. Each phase is independently shippable.
