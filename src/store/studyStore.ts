import { create } from "zustand";

/**
 * Study Hub state — persistent, derived-time, survives unmount/reload/sleep.
 *
 * Architectural notes:
 *  - Pomodoro stores an absolute `pomoEndsAt` (epoch ms). Remaining time is
 *    derived from `Date.now()` on every render → no drift, survives tab
 *    backgrounding (mobile Safari throttles `setInterval`), and unmounting
 *    the panel cannot wipe it.
 *  - All collections are persisted to `localStorage` under a single
 *    versioned key. A bumped schema version triggers a safe reset.
 */

const LS_KEY = "vlc-study-v1";

export type Priority = "low" | "med" | "high";
export type Subtask = { id: string; title: string; done: boolean };
export type Task = {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  due?: number | null;        // epoch ms
  tags: string[];
  subtasks: Subtask[];
  done: boolean;
  createdAt: number;
  pomosSpent: number;
};
export type PlannerBlock = {
  id: string;
  day: number;                // 0=Sun..6=Sat
  startMin: number;           // minutes since 00:00
  endMin: number;
  title: string;
  color: string;              // CSS color or token
  taskId?: string;
};
export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  videoSrcKey?: string;
  videoTime?: number;         // seconds
  tags: string[];
};
export type Card = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  ef: number;                 // ease factor (SM-2)
  interval: number;           // days
  reps: number;
  due: number;                // epoch ms
  lapses: number;
};
export type Deck = { id: string; name: string; createdAt: number };
export type Goal = {
  id: string;
  title: string;
  why?: string;
  target: number;             // 0..100
  current: number;
  deadline?: number | null;
  milestones: { id: string; title: string; done: boolean }[];
  createdAt: number;
};
export type Habit = {
  id: string;
  title: string;
  emoji: string;
  daysOfWeek: number[];       // 0..6
  history: Record<string, boolean>; // ISO date -> done
  createdAt: number;
};
export type Assignment = {
  id: string;
  course: string;
  title: string;
  due: number;                // epoch ms
  estimateMin: number;
  progress: number;           // 0..100
  done: boolean;
  notes?: string;
};
export type ReadingItem = {
  id: string;
  title: string;
  author?: string;
  totalPages: number;
  currentPage: number;
  notes?: string;
  startedAt: number;
  finishedAt?: number | null;
};
export type StudySession = {
  id: string;
  start: number;
  end: number;
  mode: "focus" | "shortBreak" | "longBreak";
  taskId?: string;
};
export type PomoMode = "focus" | "shortBreak" | "longBreak";

export interface StudySettings {
  notifications: boolean;
  autoPauseVideo: boolean;
  soundOnPhaseEnd: boolean;
  buddyName: string;
  buddyGoal: string;
}

export interface StudyState {
  // — UI —
  hubOpen: boolean;
  hubTab: string;

  // — Pomodoro —
  pomoMode: PomoMode;
  pomoEndsAt: number | null;     // null = idle (or paused)
  pomoPausedRemainingMs: number | null; // when paused, the frozen remaining ms
  pomoCycles: number;
  pomoFocusMin: number;
  pomoShortBreakMin: number;
  pomoLongBreakMin: number;
  pomoLongEvery: number;
  pomoActiveTaskId: string | null;

  // — Collections —
  tasks: Task[];
  blocks: PlannerBlock[];
  notes: Note[];
  decks: Deck[];
  cards: Card[];
  goals: Goal[];
  habits: Habit[];
  assignments: Assignment[];
  reading: ReadingItem[];
  sessions: StudySession[];

  // — Buddy —
  buddyStreak: number;
  buddyLastDay: string | null;
  buddyTotalMin: number;

  settings: StudySettings;

  // — Actions —
  patch: (p: Partial<StudyState>) => void;
  pomoStart: (mode?: PomoMode) => void;
  pomoPause: () => void;
  pomoResume: () => void;
  pomoStop: () => void;
  pomoComplete: () => void;          // called by engine when timer expires
  pomoSkip: () => void;
  recordSession: (s: StudySession) => void;

  addTask: (t: Omit<Task, "id" | "createdAt" | "subtasks" | "tags" | "done" | "pomosSpent"> & { tags?: string[] }) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subId: string) => void;

  addBlock: (b: Omit<PlannerBlock, "id">) => void;
  updateBlock: (id: string, patch: Partial<PlannerBlock>) => void;
  deleteBlock: (id: string) => void;

  addNote: (n: Omit<Note, "id" | "createdAt" | "updatedAt" | "tags"> & { tags?: string[] }) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  addDeck: (name: string) => string;
  addCard: (deckId: string, front: string, back: string) => void;
  reviewCard: (id: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
  deleteCard: (id: string) => void;

  addGoal: (g: Omit<Goal, "id" | "createdAt" | "milestones" | "current"> & { milestones?: { title: string }[] }) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;

  addHabit: (h: Omit<Habit, "id" | "createdAt" | "history">) => void;
  toggleHabitToday: (id: string) => void;
  deleteHabit: (id: string) => void;

  addAssignment: (a: Omit<Assignment, "id" | "progress" | "done">) => void;
  updateAssignment: (id: string, patch: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  addReading: (r: Omit<ReadingItem, "id" | "currentPage" | "startedAt" | "finishedAt">) => void;
  updateReading: (id: string, patch: Partial<ReadingItem>) => void;
  deleteReading: (id: string) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const todayISO = () => new Date().toISOString().slice(0, 10);

const DEFAULT_SETTINGS: StudySettings = {
  notifications: false,
  autoPauseVideo: true,
  soundOnPhaseEnd: true,
  buddyName: "Sage",
  buddyGoal: "Ace this semester",
};

const DEFAULTS: Partial<StudyState> = {
  hubOpen: false,
  hubTab: "pomodoro",
  pomoMode: "focus",
  pomoEndsAt: null,
  pomoPausedRemainingMs: null,
  pomoCycles: 0,
  pomoFocusMin: 25,
  pomoShortBreakMin: 5,
  pomoLongBreakMin: 15,
  pomoLongEvery: 4,
  pomoActiveTaskId: null,
  tasks: [], blocks: [], notes: [], decks: [], cards: [],
  goals: [], habits: [], assignments: [], reading: [], sessions: [],
  buddyStreak: 0, buddyLastDay: null, buddyTotalMin: 0,
  settings: DEFAULT_SETTINGS,
};

const PERSIST_KEYS: (keyof StudyState)[] = [
  "hubTab",
  "pomoMode", "pomoEndsAt", "pomoPausedRemainingMs", "pomoCycles",
  "pomoFocusMin", "pomoShortBreakMin", "pomoLongBreakMin", "pomoLongEvery",
  "pomoActiveTaskId",
  "tasks", "blocks", "notes", "decks", "cards",
  "goals", "habits", "assignments", "reading", "sessions",
  "buddyStreak", "buddyLastDay", "buddyTotalMin", "settings",
];

const loadPersisted = (): Partial<StudyState> => {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<StudyState>;
    return parsed ?? {};
  } catch { return {}; }
};

export const useStudyStore = create<StudyState>((set, get) => ({
  ...(DEFAULTS as StudyState),
  ...loadPersisted(),

  patch: (p) => set(p),

  pomoStart: (mode) => {
    const s = get();
    const m: PomoMode = mode ?? s.pomoMode ?? "focus";
    const mins = m === "focus" ? s.pomoFocusMin : m === "shortBreak" ? s.pomoShortBreakMin : s.pomoLongBreakMin;
    set({ pomoMode: m, pomoEndsAt: Date.now() + mins * 60_000, pomoPausedRemainingMs: null });
  },

  pomoPause: () => {
    const s = get();
    if (s.pomoEndsAt == null) return;
    const remaining = Math.max(0, s.pomoEndsAt - Date.now());
    set({ pomoEndsAt: null, pomoPausedRemainingMs: remaining });
  },

  pomoResume: () => {
    const s = get();
    if (s.pomoPausedRemainingMs == null) return;
    set({ pomoEndsAt: Date.now() + s.pomoPausedRemainingMs, pomoPausedRemainingMs: null });
  },

  pomoStop: () => set({ pomoEndsAt: null, pomoPausedRemainingMs: null, pomoMode: "focus" }),

  pomoSkip: () => {
    // Treat as completion without recording session.
    const s = get();
    const nextMode: PomoMode =
      s.pomoMode !== "focus"
        ? "focus"
        : (s.pomoCycles + 1) % s.pomoLongEvery === 0 ? "longBreak" : "shortBreak";
    set({ pomoMode: nextMode, pomoEndsAt: null, pomoPausedRemainingMs: null });
  },

  pomoComplete: () => {
    const s = get();
    const justFinished = s.pomoMode;
    const start = Date.now() - (justFinished === "focus" ? s.pomoFocusMin : justFinished === "shortBreak" ? s.pomoShortBreakMin : s.pomoLongBreakMin) * 60_000;
    const session: StudySession = {
      id: uid(), start, end: Date.now(), mode: justFinished,
      taskId: s.pomoActiveTaskId ?? undefined,
    };
    const newCycles = justFinished === "focus" ? s.pomoCycles + 1 : s.pomoCycles;
    const nextMode: PomoMode =
      justFinished === "focus"
        ? (newCycles % s.pomoLongEvery === 0 ? "longBreak" : "shortBreak")
        : "focus";
    // Bump buddy stats + streak on a completed focus session
    let buddyStreak = s.buddyStreak;
    let buddyLastDay = s.buddyLastDay;
    let buddyTotalMin = s.buddyTotalMin;
    if (justFinished === "focus") {
      buddyTotalMin += s.pomoFocusMin;
      const today = todayISO();
      if (buddyLastDay !== today) {
        const y = new Date(); y.setDate(y.getDate() - 1);
        const yISO = y.toISOString().slice(0, 10);
        buddyStreak = buddyLastDay === yISO ? buddyStreak + 1 : 1;
        buddyLastDay = today;
      }
    }
    // If a task was active, increment its pomo count
    const tasks = s.pomoActiveTaskId
      ? s.tasks.map((t) => t.id === s.pomoActiveTaskId ? { ...t, pomosSpent: t.pomosSpent + (justFinished === "focus" ? 1 : 0) } : t)
      : s.tasks;
    set({
      pomoMode: nextMode,
      pomoEndsAt: null,
      pomoPausedRemainingMs: null,
      pomoCycles: newCycles,
      sessions: [...s.sessions.slice(-499), session],
      buddyStreak, buddyLastDay, buddyTotalMin, tasks,
    });
  },

  recordSession: (sess) => set((s) => ({ sessions: [...s.sessions.slice(-499), sess] })),

  addTask: (t) => set((s) => ({
    tasks: [
      ...s.tasks,
      {
        id: uid(), createdAt: Date.now(), subtasks: [], tags: t.tags ?? [],
        done: false, pomosSpent: 0,
        title: t.title, priority: t.priority, due: t.due ?? null,
        notes: t.notes,
      },
    ],
  })),
  updateTask: (id, p) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, ...p } : t) })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  addSubtask: (taskId, title) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: uid(), title, done: false }] } : t),
  })),
  toggleSubtask: (taskId, subId) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === taskId
      ? { ...t, subtasks: t.subtasks.map((x) => x.id === subId ? { ...x, done: !x.done } : x) }
      : t),
  })),

  addBlock: (b) => set((s) => ({ blocks: [...s.blocks, { ...b, id: uid() }] })),
  updateBlock: (id, p) => set((s) => ({ blocks: s.blocks.map((b) => b.id === id ? { ...b, ...p } : b) })),
  deleteBlock: (id) => set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) })),

  addNote: (n) => set((s) => ({
    notes: [
      ...s.notes,
      { id: uid(), createdAt: Date.now(), updatedAt: Date.now(), tags: n.tags ?? [],
        title: n.title, body: n.body, videoSrcKey: n.videoSrcKey, videoTime: n.videoTime },
    ],
  })),
  updateNote: (id, p) => set((s) => ({ notes: s.notes.map((n) => n.id === id ? { ...n, ...p, updatedAt: Date.now() } : n) })),
  deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

  addDeck: (name) => {
    const id = uid();
    set((s) => ({ decks: [...s.decks, { id, name, createdAt: Date.now() }] }));
    return id;
  },
  addCard: (deckId, front, back) => set((s) => ({
    cards: [...s.cards, { id: uid(), deckId, front, back, ef: 2.5, interval: 0, reps: 0, due: Date.now(), lapses: 0 }],
  })),
  reviewCard: (id, quality) => set((s) => ({
    cards: s.cards.map((c) => {
      if (c.id !== id) return c;
      // SM-2 algorithm
      let { ef, interval, reps, lapses } = c;
      if (quality < 3) {
        reps = 0; interval = 1; lapses += 1;
      } else {
        reps += 1;
        interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(interval * ef);
      }
      ef = Math.max(1.3, ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      const due = Date.now() + interval * 24 * 60 * 60 * 1000;
      return { ...c, ef, interval, reps, lapses, due };
    }),
  })),
  deleteCard: (id) => set((s) => ({ cards: s.cards.filter((c) => c.id !== id) })),

  addGoal: (g) => set((s) => ({
    goals: [
      ...s.goals,
      {
        id: uid(), createdAt: Date.now(), current: 0,
        milestones: (g.milestones ?? []).map((m) => ({ id: uid(), title: m.title, done: false })),
        title: g.title, why: g.why, target: g.target, deadline: g.deadline ?? null,
      },
    ],
  })),
  updateGoal: (id, p) => set((s) => ({ goals: s.goals.map((g) => g.id === id ? { ...g, ...p } : g) })),
  deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),
  toggleMilestone: (goalId, milestoneId) => set((s) => ({
    goals: s.goals.map((g) => g.id === goalId
      ? { ...g, milestones: g.milestones.map((m) => m.id === milestoneId ? { ...m, done: !m.done } : m) }
      : g),
  })),

  addHabit: (h) => set((s) => ({ habits: [...s.habits, { ...h, id: uid(), createdAt: Date.now(), history: {} }] })),
  toggleHabitToday: (id) => set((s) => ({
    habits: s.habits.map((h) => {
      if (h.id !== id) return h;
      const k = todayISO();
      const next = { ...h.history };
      if (next[k]) delete next[k]; else next[k] = true;
      return { ...h, history: next };
    }),
  })),
  deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

  addAssignment: (a) => set((s) => ({ assignments: [...s.assignments, { ...a, id: uid(), progress: 0, done: false }] })),
  updateAssignment: (id, p) => set((s) => ({ assignments: s.assignments.map((a) => a.id === id ? { ...a, ...p } : a) })),
  deleteAssignment: (id) => set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) })),

  addReading: (r) => set((s) => ({ reading: [...s.reading, { ...r, id: uid(), currentPage: 0, startedAt: Date.now(), finishedAt: null }] })),
  updateReading: (id, p) => set((s) => ({ reading: s.reading.map((r) => r.id === id ? { ...r, ...p } : r) })),
  deleteReading: (id) => set((s) => ({ reading: s.reading.filter((r) => r.id !== id) })),
}));

// Debounced persistence — single write per 300ms of activity.
if (typeof window !== "undefined") {
  let timer: number | null = null;
  useStudyStore.subscribe((state) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      try {
        const snap: Record<string, unknown> = {};
        for (const k of PERSIST_KEYS) snap[k as string] = state[k];
        localStorage.setItem(LS_KEY, JSON.stringify(snap));
      } catch { /* quota / private-mode */ }
    }, 300);
  });
}

/** Derived: live remaining ms (>=0). Returns 0 when idle. */
export const getPomoRemainingMs = (s: Pick<StudyState, "pomoEndsAt" | "pomoPausedRemainingMs">): number => {
  if (s.pomoEndsAt != null) return Math.max(0, s.pomoEndsAt - Date.now());
  if (s.pomoPausedRemainingMs != null) return s.pomoPausedRemainingMs;
  return 0;
};

/** Derived: total ms for the current mode (for ring progress). */
export const getPomoTotalMs = (s: Pick<StudyState, "pomoMode" | "pomoFocusMin" | "pomoShortBreakMin" | "pomoLongBreakMin">): number => {
  const m = s.pomoMode;
  const mins = m === "focus" ? s.pomoFocusMin : m === "shortBreak" ? s.pomoShortBreakMin : s.pomoLongBreakMin;
  return mins * 60_000;
};
