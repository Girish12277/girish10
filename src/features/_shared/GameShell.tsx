import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * useRAFLoop — runs `tick(dt)` while the document is visible.
 * Auto-pauses on tab hide; cleans up on unmount. Zero leaks.
 */
export function useRAFLoop(tick: (dtMs: number) => void, deps: unknown[] = []) {
  const tickRef = useRef(tick);
  tickRef.current = tick;
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let paused = document.hidden;
    const loop = (t: number) => {
      const dt = t - last; last = t;
      if (!paused) tickRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => { paused = document.hidden; last = performance.now(); };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", onVis); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function GameStatusBar({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 text-[12px]"
      style={{ borderTop: "1px solid var(--vlc-border-subtle)", color: "var(--vlc-text-secondary)", fontFamily: "var(--vlc-font-mono)" }}>
      <span>{left}</span><span>{right}</span>
    </div>
  );
}

export function loadHigh(key: string): number {
  try { return parseInt(localStorage.getItem(`vlc-feat-${key}`) ?? "0", 10) || 0; } catch { return 0; }
}
export function saveHigh(key: string, v: number) {
  try { localStorage.setItem(`vlc-feat-${key}`, String(v)); } catch { /* noop */ }
}

/* ------------------------------------------------------------------ */
/*  Dynamic theme palette — root-cause fix for "static colors".
    Every game pulls its hex values from here so they react live to
    skin / theme changes (CSS var updates) without per-component logic. */
/* ------------------------------------------------------------------ */

export interface ThemePalette {
  accent: string;
  accentDim: string;
  accentText: string;
  bg: string;
  surface: string;
  elevated: string;
  sunken: string;
  fg: string;
  fg2: string;
  fg3: string;
  border: string;
  borderStrong: string;
  /** Derived semantic colors (track accent hue when possible). */
  good: string;
  bad: string;
  warn: string;
  info: string;
}

function readVar(cs: CSSStyleDeclaration, name: string, fb: string): string {
  const v = cs.getPropertyValue(name).trim();
  return v || fb;
}

export function getThemePalette(): ThemePalette {
  if (typeof window === "undefined") {
    return {
      accent: "#FF8800", accentDim: "rgba(255,136,0,0.15)", accentText: "#FFA033",
      bg: "#1E1E1E", surface: "#2A2A2A", elevated: "#333333", sunken: "#161616",
      fg: "#F0F0F0", fg2: "rgba(240,240,240,0.65)", fg3: "rgba(240,240,240,0.35)",
      border: "rgba(255,255,255,0.12)", borderStrong: "rgba(255,255,255,0.22)",
      good: "#5cdb95", bad: "#ff4d6d", warn: "#ffd166", info: "#56a3ff",
    };
  }
  const cs = getComputedStyle(document.documentElement);
  const accent = readVar(cs, "--vlc-accent", "#FF8800");
  return {
    accent,
    accentDim: readVar(cs, "--vlc-accent-dim", "rgba(255,136,0,0.15)"),
    accentText: readVar(cs, "--vlc-accent-text", "#FFA033"),
    bg: readVar(cs, "--vlc-bg-base", "#1E1E1E"),
    surface: readVar(cs, "--vlc-bg-surface", "#2A2A2A"),
    elevated: readVar(cs, "--vlc-bg-elevated", "#333333"),
    sunken: readVar(cs, "--vlc-bg-sunken", "#161616"),
    fg: readVar(cs, "--vlc-text-primary", "#F0F0F0"),
    fg2: readVar(cs, "--vlc-text-secondary", "rgba(240,240,240,0.65)"),
    fg3: readVar(cs, "--vlc-text-ghost", "rgba(240,240,240,0.35)"),
    border: readVar(cs, "--vlc-border-normal", "rgba(255,255,255,0.12)"),
    borderStrong: readVar(cs, "--vlc-border-strong", "rgba(255,255,255,0.22)"),
    good: readVar(cs, "--vlc-good", "#5cdb95"),
    bad: readVar(cs, "--vlc-bad", "#ff4d6d"),
    warn: readVar(cs, "--vlc-warn", "#ffd166"),
    info: readVar(cs, "--vlc-info", "#56a3ff"),
  };
}

/** React hook — re-renders on theme / skin change. */
export function useThemePalette(): ThemePalette {
  const [pal, setPal] = useState<ThemePalette>(getThemePalette);
  useEffect(() => {
    const refresh = () => setPal(getThemePalette());
    const obs = new MutationObserver(refresh);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class", "data-theme", "data-skin"] });
    if (document.body) obs.observe(document.body, { attributes: true, attributeFilter: ["style", "class", "data-theme", "data-skin"] });
    window.addEventListener("vlc-theme-change", refresh);
    // initial settle (fonts/vars may resolve after mount)
    const t = setTimeout(refresh, 60);
    return () => { obs.disconnect(); window.removeEventListener("vlc-theme-change", refresh); clearTimeout(t); };
  }, []);
  return pal;
}

/** Ref-backed palette for canvas games — always reads the latest values
 *  in the RAF loop without re-creating the loop on theme change. */
export function usePaletteRef() {
  const ref = useRef<ThemePalette>(getThemePalette());
  useEffect(() => {
    const refresh = () => { ref.current = getThemePalette(); };
    refresh();
    const obs = new MutationObserver(refresh);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class", "data-theme", "data-skin"] });
    window.addEventListener("vlc-theme-change", refresh);
    const id = window.setInterval(refresh, 1000); // safety: catch programmatic var writes
    return () => { obs.disconnect(); window.removeEventListener("vlc-theme-change", refresh); clearInterval(id); };
  }, []);
  return ref;
}
