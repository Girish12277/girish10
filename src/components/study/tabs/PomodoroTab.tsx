import { useEffect, useState } from "react";
import { useStudyStore, getPomoRemainingMs, getPomoTotalMs } from "@/store/studyStore";
import { cardStyle, fmtMs, GhostBtn, NumInput, PrimaryBtn, selectStyle, ToggleRow } from "../ui";

/**
 * Focus tab. The ticking clock lives in its own leaf component (`PomoRing`)
 * so the 250ms heartbeat re-renders ~1 SVG instead of the whole tab.
 */
export function PomodoroTab() {
  const s = useStudyStore();
  const running = s.pomoEndsAt != null;
  const paused = s.pomoPausedRemainingMs != null;
  const tasks = s.tasks.filter((t) => !t.done);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
      <div className="flex flex-col items-center gap-5 py-2">
        <PomoRing />
        <div className="flex gap-2">
          {!running && !paused && <PrimaryBtn onClick={() => s.pomoStart()}>Start</PrimaryBtn>}
          {running && <PrimaryBtn onClick={s.pomoPause}>Pause</PrimaryBtn>}
          {paused && <PrimaryBtn onClick={s.pomoResume}>Resume</PrimaryBtn>}
          <GhostBtn onClick={s.pomoSkip}>Skip</GhostBtn>
          <GhostBtn onClick={s.pomoStop}>Reset</GhostBtn>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div style={cardStyle}>
          <div className="text-[11px] uppercase tracking-widest mb-2" style={{ color: "var(--vlc-text-disabled)" }}>Durations</div>
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <label className="flex items-center justify-between">Focus<NumInput value={s.pomoFocusMin} min={1} max={180} onChange={(v) => s.patch({ pomoFocusMin: v })} /></label>
            <label className="flex items-center justify-between">Short<NumInput value={s.pomoShortBreakMin} min={1} max={60} onChange={(v) => s.patch({ pomoShortBreakMin: v })} /></label>
            <label className="flex items-center justify-between">Long<NumInput value={s.pomoLongBreakMin} min={1} max={120} onChange={(v) => s.patch({ pomoLongBreakMin: v })} /></label>
            <label className="flex items-center justify-between">Long ÷<NumInput value={s.pomoLongEvery} min={2} max={10} onChange={(v) => s.patch({ pomoLongEvery: v })} /></label>
          </div>
        </div>
        <div style={cardStyle}>
          <div className="text-[11px] uppercase tracking-widest mb-2" style={{ color: "var(--vlc-text-disabled)" }}>Settings</div>
          <ToggleRow label="Auto-pause video on break" value={s.settings.autoPauseVideo}
            onChange={(v) => s.patch({ settings: { ...s.settings, autoPauseVideo: v } })} />
          <ToggleRow label="Sound on phase end" value={s.settings.soundOnPhaseEnd}
            onChange={(v) => s.patch({ settings: { ...s.settings, soundOnPhaseEnd: v } })} />
          <ToggleRow label="Browser notifications" value={s.settings.notifications}
            onChange={async (v) => {
              if (v && typeof Notification !== "undefined" && Notification.permission !== "granted") {
                try { await Notification.requestPermission(); } catch { /* noop */ }
              }
              s.patch({ settings: { ...s.settings, notifications: v } });
            }} />
        </div>
        <div style={cardStyle}>
          <div className="text-[11px] uppercase tracking-widest mb-2" style={{ color: "var(--vlc-text-disabled)" }}>Active task</div>
          <select value={s.pomoActiveTaskId ?? ""} onChange={(e) => s.patch({ pomoActiveTaskId: e.target.value || null })}
            className="w-full px-2 py-1.5 text-[12px] rounded-md" style={selectStyle}>
            <option value="">— none —</option>
            {tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

const RING = 220;
const STROKE = 12;
const R = (RING - STROKE) / 2;
const C = 2 * Math.PI * R;

function PomoRing() {
  const [, force] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => force((x) => x + 1), 250);
    return () => window.clearInterval(id);
  }, []);

  const s = useStudyStore.getState();
  const mode = useStudyStore((x) => x.pomoMode);
  const cycles = useStudyStore((x) => x.pomoCycles);
  const activeId = useStudyStore((x) => x.pomoActiveTaskId);
  const activeTitle = useStudyStore((x) => x.tasks.find((t) => t.id === activeId)?.title);

  const remaining = getPomoRemainingMs(s);
  const total = getPomoTotalMs(s);
  const running = s.pomoEndsAt != null;
  const paused = s.pomoPausedRemainingMs != null;
  const display = remaining > 0 ? remaining : (running || paused ? 0 : total);
  const progress = total > 0 ? 1 - display / total : 0;
  const ringColor = mode === "focus"
    ? "var(--vlc-accent)"
    : "color-mix(in oklab, var(--vlc-accent) 50%, #4ade80)";

  return (
    <div className="relative" style={{ width: RING, height: RING }}>
      <svg width={RING} height={RING} className="-rotate-90">
        <circle cx={RING / 2} cy={RING / 2} r={R} fill="none"
          stroke="color-mix(in oklab, var(--vlc-text-primary) 10%, transparent)" strokeWidth={STROKE} />
        <circle
          cx={RING / 2} cy={RING / 2} r={R} fill="none"
          stroke={ringColor} strokeWidth={STROKE} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
          style={{ transition: "stroke-dashoffset 300ms linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10.5px] uppercase tracking-[0.22em]" style={{ color: "var(--vlc-text-secondary)" }}>
          {paused ? "Paused" : mode === "focus" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break"}
        </div>
        <div className="text-[54px] font-bold tabular-nums leading-none mt-1">{fmtMs(display)}</div>
        <div className="text-[11px] mt-2" style={{ color: "var(--vlc-text-secondary)" }}>
          Cycle {cycles} · {activeTitle ?? "no task"}
        </div>
      </div>
    </div>
  );
}
