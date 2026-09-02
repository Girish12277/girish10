import { useEffect, useState } from "react";
import { videoRef, currentTimeRef } from "@/hooks/useVideoPlayer";

/**
 * Shared playback ticker — a single rAF loop drives every consumer that needs
 * the live `currentTime`. Replaces N independent rAF loops (SeekBar,
 * ControlBar, OSD) with one source of truth and a Set of subscribers.
 *
 * Idle when no subscribers OR when the document is hidden — both conditions
 * are critical for the "idle CPU < 1%" target.
 */
type Listener = (now: number) => void;

const listeners = new Set<Listener>();
let raf = 0;

function loop() {
  const v = videoRef.current;
  if (v) currentTimeRef.current = v.currentTime;
  const now = currentTimeRef.current;
  listeners.forEach((cb) => cb(now));
  raf = requestAnimationFrame(loop);
}

function ensureLoop() {
  if (raf || listeners.size === 0) return;
  if (typeof document !== "undefined" && document.hidden) return;
  raf = requestAnimationFrame(loop);
}

function stopLoop() {
  if (!raf) return;
  cancelAnimationFrame(raf);
  raf = 0;
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopLoop();
    else ensureLoop();
  });
}

/** Subscribe to the shared ticker. Returns the live currentTime. */
export function usePlaybackTicker(): number {
  const [now, setNow] = useState(0);
  useEffect(() => {
    listeners.add(setNow);
    ensureLoop();
    return () => {
      listeners.delete(setNow);
      if (listeners.size === 0) stopLoop();
    };
  }, []);
  return now;
}
