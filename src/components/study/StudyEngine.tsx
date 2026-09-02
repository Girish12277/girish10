import { useEffect, useRef } from "react";
import { useStudyStore, getPomoRemainingMs } from "@/store/studyStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { usePlayerStore } from "@/store/playerStore";

/**
 * Headless tick — always mounted, independent of whether the hub panel is
 * open. Polls the persistent `pomoEndsAt` every 500ms; when it crosses 0
 * it fires `pomoComplete()` exactly once. Uses absolute timestamps so it
 * stays accurate across tab-backgrounding and sleep/wake.
 */
export function StudyEngine() {
  const lastFiredRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const s = useStudyStore.getState();
      if (s.pomoEndsAt == null) { lastFiredRef.current = null; return; }
      const remaining = getPomoRemainingMs(s);
      if (remaining > 0) return;
      // Guard against double-fire from rapid re-entry.
      if (lastFiredRef.current === s.pomoEndsAt) return;
      lastFiredRef.current = s.pomoEndsAt;

      const justFinished = s.pomoMode;
      s.pomoComplete();

      // Side-effects: pause video on break boundary, OSD, optional sound + notif.
      const player = usePlayerStore.getState();
      if (justFinished === "focus") {
        if (s.settings.autoPauseVideo) videoRef.current?.pause();
        player.pushOSD("Focus complete — take a break ☕");
      } else {
        player.pushOSD("Break over — back to focus 🔥");
      }
      if (s.settings.soundOnPhaseEnd) playChime();
      if (s.settings.notifications && typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification("Study Hub", {
            body: justFinished === "focus" ? "Focus session complete!" : "Break done — ready to focus?",
            silent: true,
          });
        } catch { /* noop */ }
      }
    };
    const id = window.setInterval(tick, 500);
    // Also re-evaluate when the tab regains focus (mobile Safari throttles timers).
    const onVis = () => { if (!document.hidden) tick(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { window.clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return null;
}

function playChime() {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.55);
    o.onended = () => ctx.close().catch(() => undefined);
  } catch { /* noop */ }
}
