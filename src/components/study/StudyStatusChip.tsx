import { useEffect, useState } from "react";
import { useStudyStore, getPomoRemainingMs } from "@/store/studyStore";

/**
 * Compact live status chip rendered inside the TitleBar. Shows the current
 * Pomodoro mode + remaining time; clicking opens the hub on the Focus tab.
 * Auto-hides when no timer is running and no pause is staged.
 */
export function StudyStatusChip() {
  const running = useStudyStore((s) => s.pomoEndsAt != null);
  const paused = useStudyStore((s) => s.pomoPausedRemainingMs != null);
  const mode = useStudyStore((s) => s.pomoMode);
  const patch = useStudyStore((s) => s.patch);

  // 500ms heartbeat keeps the displayed clock fresh without forcing
  // re-render of the whole TitleBar.
  const [, force] = useState(0);
  // Gate render until after mount so SSR markup (no localStorage) always
  // matches the first client paint — prevents hydration mismatch when a
  // persisted Pomodoro session exists.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => force((x) => x + 1), 500);
    return () => window.clearInterval(id);
  }, [running]);

  if (!mounted || (!running && !paused)) return null;

  const remaining = getPomoRemainingMs(useStudyStore.getState());
  const total = Math.ceil(remaining / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");

  const label = paused ? "Paused" : mode === "focus" ? "Focus" : mode === "shortBreak" ? "Break" : "Long";
  const color = paused
    ? "var(--vlc-text-secondary)"
    : mode === "focus"
      ? "var(--vlc-accent)"
      : "color-mix(in oklab, var(--vlc-accent) 50%, #4ade80)";

  return (
    <button
      onClick={() => patch({ hubOpen: true, hubTab: "pomodoro" })}
      aria-label="Open Study Hub"
      className="inline-flex items-center gap-1.5 vlc-num text-[10.5px] uppercase tracking-wider px-2 py-[2px] rounded-full transition-colors"
      style={{
        WebkitAppRegion: "no-drag",
        color,
        background: "color-mix(in oklab, " + color + " 12%, transparent)",
        border: "1px solid color-mix(in oklab, " + color + " 30%, transparent)",
      } as React.CSSProperties}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: color, boxShadow: paused ? "none" : `0 0 8px ${color}` }} />
      <span>{label}</span>
      <span className="tabular-nums">{mm}:{ss}</span>
    </button>
  );
}
