import { useEffect, useState, lazy, Suspense, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer,
  Bot,
  CheckSquare,
  Calendar,
  FileSpreadsheet,
  FileText,
  Layers,
  BookOpen,
  Target,
  Activity,
  BarChart3,
  Headphones,
  CloudRain,
  BrainCircuit,
  Waves,
  Coffee,
  Sparkles,
  Flame,
  X,
  type LucideProps,
} from "lucide-react";
import { useStudyStore, getPomoRemainingMs } from "@/store/studyStore";
import { fmtMs } from "./ui";
import { ambientSynth, type AmbientSoundType } from "./audio/ambientSynth";
import { ConfettiCanvas } from "./ui/ConfettiCanvas";

// Core Lazy-Loaded Sub-Tabs
const PomodoroTab = lazy(() => import("./tabs/PomodoroTab").then((m) => ({ default: m.PomodoroTab })));
const TasksTab = lazy(() => import("./tabs/TasksTab").then((m) => ({ default: m.TasksTab })));
const PlannerTab = lazy(() => import("./tabs/PlannerTab").then((m) => ({ default: m.PlannerTab })));
const NotesTab = lazy(() => import("./tabs/NotesTab").then((m) => ({ default: m.NotesTab })));
const FlashcardsTab = lazy(() => import("./tabs/FlashcardsTab").then((m) => ({ default: m.FlashcardsTab })));
const GoalsTab = lazy(() => import("./tabs/GoalsTab").then((m) => ({ default: m.GoalsTab })));
const HabitsTab = lazy(() => import("./tabs/HabitsTab").then((m) => ({ default: m.HabitsTab })));
const AssignmentsTab = lazy(() => import("./tabs/AssignmentsTab").then((m) => ({ default: m.AssignmentsTab })));
const ReadingTab = lazy(() => import("./tabs/ReadingTab").then((m) => ({ default: m.ReadingTab })));
const StatsTab = lazy(() => import("./tabs/StatsTab").then((m) => ({ default: m.StatsTab })));
const BuddyTab = lazy(() => import("./tabs/BuddyTab").then((m) => ({ default: m.BuddyTab })));

type TabId =
  | "pomodoro" | "tasks" | "planner" | "notes" | "flashcards"
  | "goals" | "habits" | "assignments" | "reading" | "stats" | "buddy";

const TABS: { id: TabId; label: string; Icon: ComponentType<LucideProps>; group: "focus" | "plan" | "learn" | "track" }[] = [
  { id: "pomodoro",    label: "Focus",       Icon: Timer,           group: "focus" },
  { id: "buddy",       label: "Buddy",       Icon: Bot,             group: "focus" },
  { id: "tasks",       label: "Tasks",       Icon: CheckSquare,     group: "plan" },
  { id: "planner",     label: "Planner",     Icon: Calendar,        group: "plan" },
  { id: "assignments", label: "Assignments", Icon: FileSpreadsheet, group: "plan" },
  { id: "notes",       label: "Notes",       Icon: FileText,        group: "learn" },
  { id: "flashcards",  label: "Flashcards",  Icon: Layers,          group: "learn" },
  { id: "reading",     label: "Reading",     Icon: BookOpen,        group: "learn" },
  { id: "goals",       label: "Goals",       Icon: Target,          group: "track" },
  { id: "habits",      label: "Habits",      Icon: Activity,        group: "track" },
  { id: "stats",       label: "Stats",       Icon: BarChart3,       group: "track" },
];

export function StudyHub() {
  const open = useStudyStore((s) => s.hubOpen);
  const tab = useStudyStore((s) => s.hubTab) as TabId;
  const patch = useStudyStore((s) => s.patch);
  const [showConfetti, setShowConfetti] = useState(false);

  // Close with ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") patch({ hubOpen: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, patch]);

  return (
    <>
      <ConfettiCanvas active={showConfetti} onComplete={() => setShowConfetti(false)} />

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
              top: 70,
              bottom: 100,
              width: "min(900px, calc(100vw - 32px))",
              background: "color-mix(in oklab, var(--vlc-bg-surface) 96%, transparent)",
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
              border: "1px solid var(--vlc-border-normal)",
              borderRadius: 20,
              boxShadow: "0 32px 80px -16px rgba(0,0,0,0.6), 0 0 0 1px color-mix(in oklab, var(--vlc-text-primary) 5%, transparent) inset",
              color: "var(--vlc-text-primary)",
            }}
            role="dialog"
            aria-label="Study Hub Pro"
          >
            <HubHeader onClose={() => patch({ hubOpen: false })} onTriggerConfetti={() => setShowConfetti(true)} />
            <div className="flex flex-1 min-h-0">
              <Sidebar active={tab} onPick={(t) => patch({ hubTab: t })} />
              <main className="flex-1 min-w-0 overflow-y-auto px-6 py-5">
                <Suspense fallback={<TabFallback />}>
                  <TabRouter tab={tab} />
                </Suspense>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TabFallback() {
  return (
    <div className="flex flex-col gap-4 p-4 animate-pulse">
      <div className="h-6 w-1/3 rounded" style={{ background: "var(--vlc-bg-sunken)" }} />
      <div className="h-24 w-full rounded-lg" style={{ background: "var(--vlc-bg-sunken)" }} />
      <div className="h-16 w-2/3 rounded-lg" style={{ background: "var(--vlc-bg-sunken)" }} />
    </div>
  );
}

function HubHeader({ onClose, onTriggerConfetti }: { onClose: () => void; onTriggerConfetti: () => void }) {
  const remaining = useStudyStore((s) => getPomoRemainingMs(s));
  const mode = useStudyStore((s) => s.pomoMode);
  const running = useStudyStore((s) => s.pomoEndsAt != null);
  const streak = useStudyStore((s) => s.buddyStreak);
  const [ambientMenuOpen, setAmbientMenuOpen] = useState(false);

  return (
    <div
      className="flex items-center justify-between px-5 py-3 hairline-bottom"
      style={{ borderBottom: "1px solid var(--vlc-border-subtle)" }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-block w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ background: "var(--vlc-accent)", boxShadow: "0 0 14px var(--vlc-accent)" }} />
        <h2 className="text-[13px] font-extrabold tracking-[0.2em] uppercase">Study Hub Pro</h2>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
          style={{ background: "color-mix(in oklab, var(--vlc-accent) 20%, transparent)", color: "var(--vlc-accent)" }}>
          PRO
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px]">
        {/* Ambient Soundscape Synthesizer Dropdown */}
        <div className="relative">
          <button
            onClick={() => setAmbientMenuOpen(!ambientMenuOpen)}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium press transition-all"
            style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-normal)", color: "var(--vlc-text-primary)" }}
          >
            <Headphones className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform text-cyan-400" />
            <span>Ambient Audio</span>
          </button>

          {ambientMenuOpen && (
            <div
              className="absolute right-0 top-8 z-[80] w-56 p-3 rounded-lg shadow-xl flex flex-col gap-2.5"
              style={{ background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-normal)", backdropFilter: "blur(20px)" }}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--vlc-text-ghost)" }}>
                Procedural Soundscapes
              </div>
              {[
                { id: "rain", label: "Rain & Thunder", Icon: CloudRain },
                { id: "binaural", label: "40Hz Binaural Beats", Icon: BrainCircuit },
                { id: "waves", label: "Ocean Waves", Icon: Waves },
                { id: "coffee", label: "Coffee Shop Chatter", Icon: Coffee },
              ].map(({ id, label, Icon }) => {
                const state = ambientSynth.getTrackState(id as AmbientSoundType);
                return (
                  <div key={id} className="flex items-center justify-between">
                    <span className="text-[11.5px] flex items-center gap-2" style={{ color: "var(--vlc-text-primary)" }}>
                      <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      {label}
                    </span>
                    <button
                      onClick={() => {
                        ambientSynth.toggleTrack(id as AmbientSoundType, !state?.active);
                        setAmbientMenuOpen(true);
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold rounded transition-all press"
                      style={{
                        background: state?.active ? "var(--vlc-accent)" : "var(--vlc-bg-sunken)",
                        color: state?.active ? "var(--vlc-bg-base)" : "var(--vlc-text-secondary)",
                      }}
                    >
                      {state?.active ? "ON" : "OFF"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {running && (
          <span className="vlc-num tabular-nums px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5"
            style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)" }}>
            <Timer className="w-3.5 h-3.5 text-accent animate-[spin_8s_linear_infinite]" />
            {mode === "focus" ? "Focus" : mode === "shortBreak" ? "Break" : "Long break"} · {fmtMs(remaining)}
          </span>
        )}

        <button onClick={onTriggerConfetti} title="Celebrate milestone!" className="group hover:scale-125 transition-transform p-1">
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
        </button>

        <span className="flex items-center gap-1.5" style={{ color: "var(--vlc-text-secondary)" }}>
          <Flame className="w-4 h-4 text-amber-500 fill-amber-400/20 animate-icon-flicker" />
          {streak}d
        </span>

        <button onClick={onClose} aria-label="Close" className="opacity-60 hover:opacity-100 hover:rotate-90 transition-all p-1">
          <X className="w-4 h-4" />
        </button>
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
      style={{ width: 176, borderRight: "1px solid var(--vlc-border-subtle)" }}
    >
      {groups.map((g) => (
        <div key={g.key} className="mb-3">
          <div className="px-4 mb-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--vlc-text-disabled)" }}>{g.label}</div>
          {TABS.filter((t) => t.group === g.key).map(({ id, label, Icon }) => {
            const on = active === id;
            return (
              <button
                key={id}
                onClick={() => onPick(id)}
                className="group relative flex items-center gap-2.5 w-full px-4 py-2 text-[12px] font-medium text-left transition-all"
                style={{
                  color: on ? "var(--vlc-accent)" : "var(--vlc-text-primary)",
                  background: on ? "color-mix(in oklab, var(--vlc-accent) 12%, transparent)" : "transparent",
                  fontWeight: on ? 600 : 400,
                }}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-115 ${on ? "text-accent scale-110" : "opacity-60"}`} />
                <span>{label}</span>
                {on && (
                  <motion.span layoutId="study-active-bar"
                    className="absolute left-0 top-1 bottom-1 w-[3px]"
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
