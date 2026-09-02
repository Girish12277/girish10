// Shared helpers for Player mini-apps that target the loaded video/audio element.
import { useEffect, useState } from "react";

export function getMedia(): HTMLMediaElement | null {
  if (typeof document === "undefined") return null;
  // Ignore the background-music element — mini-apps target the main player.
  return document.querySelector<HTMLMediaElement>("video, audio:not([data-vlc-ambient])");
}

export function useMedia(): HTMLMediaElement | null {
  const [el, setEl] = useState<HTMLMediaElement | null>(null);
  useEffect(() => {
    const tick = () => setEl(getMedia());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return el;
}

export function useMediaTime(el: HTMLMediaElement | null) {
  const [t, setT] = useState({ cur: 0, dur: 0 });
  useEffect(() => {
    if (!el) return;
    const upd = () => setT({ cur: el.currentTime || 0, dur: el.duration || 0 });
    upd();
    const id = window.setInterval(upd, 200);
    return () => window.clearInterval(id);
  }, [el]);
  return t;
}

export function fmtTime(s: number) {
  if (!isFinite(s) || s < 0) return "00:00";
  const m = Math.floor(s / 60), ss = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export function NoMedia() {
  return (
    <div style={{ padding: 16, color: "var(--vlc-text-muted, #888)", fontSize: 13 }}>
      Load a video or audio file in the player first, then reopen this tool.
    </div>
  );
}
