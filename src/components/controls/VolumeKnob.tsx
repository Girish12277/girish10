import { useCallback, useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { audioGraph } from "@/audio/AudioGraph";

/**
 * Radial volume knob — alternate to the ControlBar slider. Selected via the
 * `controlVariant` token in the customization layer. Range: 0..2 (200% with
 * preamp boost). Interaction model:
 *   - Drag (mouse or touch): vertical drag = ±1 per 160px
 *   - Wheel:                 ±0.05 per notch (±0.20 with shift)
 *   - Keyboard:              ArrowUp/Down ±0.05, Home/End jump to 0/1
 *
 * Visual:
 *   - Track ring (0..2) with sweep angle from -135° to +135°
 *   - Fill arc tinted accent until 100%, "boost" color past 100%
 *   - Indicator tick at the current value
 */
const MIN = 0;
const MAX = 2;
const SWEEP = 270;        // total arc in degrees
const START = -135;       // angle for MIN
const SIZE = 56;
const STROKE = 4;
const R = (SIZE - STROKE) / 2;
const C = SIZE / 2;

function angleFor(v: number) {
  const t = (v - MIN) / (MAX - MIN);
  return START + t * SWEEP;
}

function arcPath(from: number, to: number) {
  const a1 = (from * Math.PI) / 180;
  const a2 = (to * Math.PI) / 180;
  const x1 = C + R * Math.cos(a1);
  const y1 = C + R * Math.sin(a1);
  const x2 = C + R * Math.cos(a2);
  const y2 = C + R * Math.sin(a2);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export function VolumeKnob() {
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const set = usePlayerStore((s) => s.set);
  const pushOSD = usePlayerStore((s) => s.pushOSD);
  const dragStart = useRef<{ y: number; v: number } | null>(null);

  const apply = useCallback((next: number) => {
    const v = Math.max(MIN, Math.min(MAX, next));
    set({ volume: v, muted: false });
    if (videoRef.current) videoRef.current.volume = Math.min(1, v);
    if (v > 1) audioGraph.setPreamp((v - 1) * 6); else audioGraph.setPreamp(0);
  }, [set]);

  useEffect(() => {
    if (!dragStart.current) return;
    const onMove = (e: PointerEvent) => {
      const start = dragStart.current;
      if (!start) return;
      const dy = start.y - e.clientY;
      apply(start.v + dy / 160);
    };
    const onUp = () => {
      dragStart.current = null;
      pushOSD(`Volume: ${Math.round(usePlayerStore.getState().volume * 100)}%`);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [apply, pushOSD]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    dragStart.current = { y: e.clientY, v: volume };
  };
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const step = e.shiftKey ? 0.2 : 0.05;
    apply(volume + (e.deltaY < 0 ? step : -step));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") { e.preventDefault(); apply(volume + 0.05); }
    else if (e.key === "ArrowDown") { e.preventDefault(); apply(volume - 0.05); }
    else if (e.key === "Home") { e.preventDefault(); apply(0); }
    else if (e.key === "End") { e.preventDefault(); apply(1); }
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      set({ muted: !muted });
      pushOSD(muted ? "Unmuted" : "Muted");
    }
  };

  const effective = muted ? 0 : volume;
  const angle = angleFor(effective);
  const boost = effective > 1;
  const fill = boost ? "var(--vlc-volume-boost)" : "var(--vlc-accent)";

  return (
    <div
      role="slider"
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={200}
      aria-valuenow={Math.round(volume * 100)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onWheel={onWheel}
      onKeyDown={onKey}
      style={{ width: SIZE, height: SIZE, cursor: "ns-resize", outline: "none", touchAction: "none" }}
      className="press"
    >
      <svg width={SIZE} height={SIZE} aria-hidden>
        <path d={arcPath(START, START + SWEEP)} stroke="var(--vlc-border-normal)" strokeWidth={STROKE} fill="none" strokeLinecap="round" />
        <path d={arcPath(START, angle)} stroke={fill} strokeWidth={STROKE} fill="none" strokeLinecap="round" style={{ transition: "stroke var(--vlc-dur-base)" }} />
        <circle cx={C + R * Math.cos((angle * Math.PI) / 180)} cy={C + R * Math.sin((angle * Math.PI) / 180)} r={3} fill={fill} />
        <text x={C} y={C + 4} textAnchor="middle" fontSize={11} fill="var(--vlc-text-primary)" fontFamily="var(--vlc-font-mono)">
          {muted ? "M" : `${Math.round(volume * 100)}`}
        </text>
      </svg>
    </div>
  );
}
