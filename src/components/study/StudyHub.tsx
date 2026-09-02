import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyStore, getPomoRemainingMs } from "@/store/studyStore";
import { fmtMs } from "./ui";

import { PomodoroTab } from "./tabs/PomodoroTab";
import { TasksTab } from "./tabs/TasksTab";
import { PlannerTab } from "./tabs/PlannerTab";
import { NotesTab } from "./tabs/NotesTab";
import { FlashcardsTab } from "./tabs/FlashcardsTab";
import { GoalsTab } from "./tabs/GoalsTab";
import { HabitsTab } from "./tabs/HabitsTab";
import { AssignmentsTab } from "./tabs/AssignmentsTab";
import { ReadingTab } from "./tabs/ReadingTab";
import { StatsTab } from "./tabs/StatsTab";
import { BuddyTab } from "./tabs/BuddyTab";

/**
 * Study Hub Pro — docked workspace.
 *
 * - Open state lives in `usePlayerStore`-adjacent `useStudyStore` so the
 *   timer keeps running while the panel is closed.
 * - 11 tabs in Phase 1. Each is small and self-contained; deeper tabs (mind
 *   map, whiteboard, etc.) ship in Phase 2.
 * - Pure CSS-token theming — adapts to every skin and contrast mode.
 */

type TabId =
  | "pomodoro" | "tasks" | "planner" | "notes" | "flashcards"
  | "goals" | "habits" | "assignments" | "reading" | "stats" | "buddy";

const TABS: { id: TabId; label: string; icon: string; group: "focus" | "plan" | "learn" | "track" }[] = [
  { id: "pomodoro",    label: "Focus",       icon: "◐", group: "focus" },
  { id: "tasks",       label: "Tasks",       icon: "✓", group: "plan" },
  { id: "planner",     label: "Planner",     icon: "▦", group: "plan" },
  { id: "assignments", label: "Assignments", icon: "✦", group: "plan" },
  { id: "notes",       label: "Notes",       icon: "✎", group: "learn" },
  { id: "flashcards",  label: "Flashcards",  icon: "⌘", group: "learn" },
  { id: "reading",     label: "Reading",     icon: "❡", group: "learn" },
  { id: "goals",       label: "Goals",       icon: "▲", group: "track" },
  { id: "habits",      label: "Habits",      icon: "◇", group: "track" },
  { id: "stats",       label: "Stats",       icon: "▥", group: "track" },
  { id: "buddy",       label: "Buddy",       icon: "♥", group: "focus" },
];

export function StudyHub() {
  const open = useStudyStore((s) => s.hubOpen);
  const tab = useStudyStore((s) => s.hubTab) as TabId;
  const patch = useStudyStore((s) => s.patch);

  // Close with ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") patch({ hubOpen: false }); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, patch]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="study-hub"
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.985 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed z-[69] flex flex-col overflow-hidden"
          style={{
            right: "max(16px, env(safe-area-inset-right))",
            top: 80,
            bottom: 110,
            width: "min(880px, calc(100vw - 32px))",
            background: "color-mix(in oklab, var(--vlc-bg-surface) 94%, transparent)",
            backdropFilter: "blur(28px) saturate(150%)",
            WebkitBackdropFilter: "blur(28px) saturate(150%)",
            border: "1px solid var(--vlc-border-normal)",
            borderRadius: 20,
            boxShadow: "0 32px 80px -16px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in oklab, var(--vlc-text-primary) 5%, transparent) inset",
            color: "var(--vlc-text-primary)",
          }}
          role="dialog"
          aria-label="Study Hub"
        >
          <HubHeader onClose={() => patch({ hubOpen: false })} />
          <div className="flex flex-1 min-h-0">
            <Sidebar active={tab} onPick={(t) => patch({ hubTab: t })} />
            <main className="flex-1 min-w-0 overflow-y-auto px-5 py-4">
              <TabRouter tab={tab} />
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HubHeader({ onClose }: { onClose: () => void }) {
  const remaining = useStudyStore((s) => getPomoRemainingMs(s));
  const mode = useStudyStore((s) => s.pomoMode);
  const running = useStudyStore((s) => s.pomoEndsAt != null);
  const streak = useStudyStore((s) => s.buddyStreak);
  return (
    <div
      className="flex items-center justify-between px-5 py-3 hairline-bottom"
      style={{ borderBottom: "1px solid var(--vlc-border-subtle)" }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-block w-2 h-2 rounded-full"
          style={{ background: "var(--vlc-accent)", boxShadow: "0 0 14px var(--vlc-accent)" }} />
        <h2 className="text-[13px] font-bold tracking-[0.18em] uppercase">Study Hub</h2>
        <span className="text-[10.5px] px-2 py-0.5 rounded-full"
          style={{ background: "color-mix(in oklab, var(--vlc-accent) 18%, transparent)", color: "var(--vlc-accent)", fontWeight: 700 }}>
          PRO
        </span>
      </div>
      <div className="flex items-center gap-3 text-[11px]">
        {running && (
          <span className="vlc-num tabular-nums px-2 py-0.5 rounded"
            style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)" }}>
            {mode === "focus" ? "Focus" : mode === "shortBreak" ? "Break" : "Long break"} · {fmtMs(remaining)}
          </span>
        )}
        <span style={{ color: "var(--vlc-text-secondary)" }}>🔥 {streak}d</span>
        <button onClick={onClose} aria-label="Close" className="text-[14px] opacity-60 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}

function Sidebar({ active, onPick }: { active: TabId; onPick: (t: TabId) => void }) {
  const groups: { key: "focus" | "plan" | "learn" | "track"; label: string }[] = [
    { key: "focus", label: "Focus" },
    { key: "plan",  label: "Plan" },
    { key: "learn", label: "Learn" },
    { key: "track", label: "Track" },
  ];
  return (
    <aside
      className="shrink-0 overflow-y-auto py-3"
      style={{ width: 168, borderRight: "1px solid var(--vlc-border-subtle)" }}
    >
      {groups.map((g) => (
        <div key={g.key} className="mb-3">
          <div className="px-4 mb-1 text-[10px] uppercase tracking-widest"
            style={{ color: "var(--vlc-text-disabled)" }}>{g.label}</div>
          {TABS.filter((t) => t.group === g.key).map((t) => {
            const on = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onPick(t.id)}
                className="relative flex items-center gap-2 w-full px-4 py-1.5 text-[12px] font-medium text-left transition-colors"
                style={{
                  color: on ? "var(--vlc-accent)" : "var(--vlc-text-primary)",
                  background: on ? "color-mix(in oklab, var(--vlc-accent) 10%, transparent)" : "transparent",
                }}
              >
                <span style={{ width: 16, textAlign: "center", opacity: on ? 1 : 0.6 }}>{t.icon}</span>
                <span>{t.label}</span>
                {on && (
                  <motion.span layoutId="study-active-bar"
                    className="absolute left-0 top-1 bottom-1 w-[2px]"
                    style={{ background: "var(--vlc-accent)", borderRadius: 2 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

function TabRouter({ tab }: { tab: TabId }) {
  switch (tab) {
    case "pomodoro":    return <PomodoroTab />;
    case "tasks":       return <TasksTab />;
    case "planner":     return <PlannerTab />;
    case "notes":       return <NotesTab />;
    case "flashcards":  return <FlashcardsTab />;
    case "goals":       return <GoalsTab />;
    case "habits":      return <HabitsTab />;
    case "assignments": return <AssignmentsTab />;
    case "reading":     return <ReadingTab />;
    case "stats":       return <StatsTab />;
    case "buddy":       return <BuddyTab />;
    default:            return <PomodoroTab />;
  }
}
