import { useEffect, useState } from "react";
import { Target, Coffee, Palmtree, Maximize2, Play, Pause, SkipForward, RotateCcw, X } from "lucide-react";
import { useStudyStore, getPomoRemainingMs, getPomoTotalMs } from "@/store/studyStore";
import { cardStyle, fmtMs, GhostBtn, NumInput, PrimaryBtn, selectStyle, ToggleRow } from "../ui";

export function PomodoroTab() {
  const s = useStudyStore();
  const running = s.pomoEndsAt != null;
  const paused = s.pomoPausedRemainingMs != null;
  const tasks = s.tasks.filter((t) => !t.done);
  const [fullscreenFocus, setFullscreenFocus] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6">
      {/* Fullscreen Overlay */}
      {fullscreenFocus && (
        <div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-8 backdrop-blur-3xl animate-fade-in"
          style={{ background: "color-mix(in oklab, var(--vlc-bg-base) 95%, black)" }}
        >
          <button
            onClick={() => setFullscreenFocus(false)}
            className="absolute top-6 right-6 flex items-center gap-1.5 text-[12px] px-3.5 py-1.5 rounded-full font-semibold group hover:scale-105 transition-all"
            style={{ background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-normal)" }}
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Exit Focus Mode
          </button>
          <PomoRing size={340} strokeWidth={16} />
          <div className="flex gap-4 mt-8">
            {!running && !paused && (
              <PrimaryBtn onClick={() => s.pomoStart()}>
                <Play className="w-4 h-4 fill-current inline mr-1.5" /> Start Focus
              </PrimaryBtn>
            )}
            {running && (
              <PrimaryBtn onClick={s.pomoPause}>
                <Pause className="w-4 h-4 fill-current inline mr-1.5" /> Pause
              </PrimaryBtn>
            )}
            {paused && (
              <PrimaryBtn onClick={s.pomoResume}>
                <Play className="w-4 h-4 fill-current inline mr-1.5" /> Resume
              </PrimaryBtn>
            )}
            <GhostBtn onClick={s.pomoSkip}>
              <SkipForward className="w-4 h-4 inline mr-1.5" /> Skip Phase
            </GhostBtn>
          </div>
        </div>
      )}

      {/* Main Focus Ring & Controls */}
      <div className="flex flex-col items-center justify-center gap-6 py-4">
        {/* Quick Presets */}
        <div className="flex gap-2">
          {[
            { label: "25m Focus", focus: 25, break: 5, Icon: Target },
            { label: "50m Deep Work", focus: 50, break: 10, Icon: Target },
            { label: "15m Sprint", focus: 15, break: 3, Icon: Coffee },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                s.patch({ pomoFocusMin: preset.focus, pomoShortBreakMin: preset.break });
              }}
              className="group flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full transition-all press"
              style={{
                background: s.pomoFocusMin === preset.focus ? "var(--vlc-accent)" : "var(--vlc-bg-sunken)",
                color: s.pomoFocusMin === preset.focus ? "var(--vlc-bg-base)" : "var(--vlc-text-secondary)",
                border: "1px solid var(--vlc-border-subtle)",
              }}
            >
              <preset.Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              {preset.label}
            </button>
          ))}
        </div>

        <PomoRing size={230} strokeWidth={12} />

        <div className="flex items-center gap-3">
          {!running && !paused && (
            <PrimaryBtn onClick={() => s.pomoStart()}>
              <Play className="w-3.5 h-3.5 fill-current inline mr-1.5" /> Start Session
            </PrimaryBtn>
          )}
          {running && (
            <PrimaryBtn onClick={s.pomoPause}>
              <Pause className="w-3.5 h-3.5 fill-current inline mr-1.5" /> Pause
            </PrimaryBtn>
          )}
          {paused && (
            <PrimaryBtn onClick={s.pomoResume}>
              <Play className="w-3.5 h-3.5 fill-current inline mr-1.5" /> Resume
            </PrimaryBtn>
          )}
          <GhostBtn onClick={s.pomoSkip}>
            <SkipForward className="w-3.5 h-3.5 inline mr-1" /> Skip
          </GhostBtn>
          <GhostBtn onClick={s.pomoStop}>
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
          </GhostBtn>
          <button
            onClick={() => setFullscreenFocus(true)}
            className="group flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-md press transition-all"
            style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-normal)", color: "var(--vlc-text-primary)" }}
          >
            <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Fullscreen
          </button>
        </div>
      </div>

      {/* Side Settings & Task Select */}
      <div className="flex flex-col gap-4">
        <div style={cardStyle}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--vlc-text-disabled)" }}>
            Session Durations
          </div>
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <label className="flex items-center justify-between">Focus<NumInput value={s.pomoFocusMin} min={1} max={180} onChange={(v) => s.patch({ pomoFocusMin: v })} /></label>
            <label className="flex items-center justify-between">Short<NumInput value={s.pomoShortBreakMin} min={1} max={60} onChange={(v) => s.patch({ pomoShortBreakMin: v })} /></label>
            <label className="flex items-center justify-between">Long<NumInput value={s.pomoLongBreakMin} min={1} max={120} onChange={(v) => s.patch({ pomoLongBreakMin: v })} /></label>
            <label className="flex items-center justify-between">Long ÷<NumInput value={s.pomoLongEvery} min={2} max={10} onChange={(v) => s.patch({ pomoLongEvery: v })} /></label>
          </div>
        </div>

        <div style={cardStyle}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--vlc-text-disabled)" }}>
            Target Task
          </div>
          <select
            value={s.pomoActiveTaskId ?? ""}
            onChange={(e) => s.patch({ pomoActiveTaskId: e.target.value || null })}
            className="w-full px-3 py-2 text-[12px] rounded-md"
            style={selectStyle}
          >
            <option value="">— No Active Task —</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div style={cardStyle}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--vlc-text-disabled)" }}>
            Automation Settings
          </div>
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
      </div>
    </div>
  );
}

function PomoRing({ size = 230, strokeWidth = 12 }: { size?: number; strokeWidth?: number }) {
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

  const R = (size - strokeWidth) / 2;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={R} fill="none"
          stroke="color-mix(in oklab, var(--vlc-text-primary) 10%, transparent)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={R} fill="none"
          stroke={ringColor} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
          style={{
            transition: "stroke-dashoffset 300ms linear",
            filter: "drop-shadow(0 0 10px var(--vlc-accent))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-1.5" style={{ color: "var(--vlc-text-secondary)" }}>
          {mode === "focus" ? <Target className="w-3 h-3 text-accent animate-pulse" /> : <Coffee className="w-3 h-3 text-green-400" />}
          {paused ? "Paused" : mode === "focus" ? "Focus Phase" : mode === "shortBreak" ? "Short Break" : "Long Break"}
        </div>
        <div className="text-[48px] font-extrabold tabular-nums leading-none mt-1 tracking-tight">{fmtMs(display)}</div>
        <div className="text-[11px] mt-2 font-medium" style={{ color: "var(--vlc-text-secondary)" }}>
          Cycle {cycles} · {activeTitle ?? "No active task"}
        </div>
      </div>
    </div>
  );
}
