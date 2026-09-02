import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { audioGraph } from "@/audio/AudioGraph";

// Singleton refs accessible across components without React state.
export const videoRef: { current: HTMLVideoElement | null } = { current: null };
export const currentTimeRef: { current: number } = { current: 0 };

export function useVideoPlayer() {
  const playlist = usePlayerStore((s) => s.playlist);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const speed = usePlayerStore((s) => s.speed);
  const set = usePlayerStore((s) => s.set);
  const next = usePlayerStore((s) => s.next);
  const repeat = usePlayerStore((s) => s.repeat);

  const localRef = useRef<HTMLVideoElement | null>(null);

  // Sync volume/mute/speed
  useEffect(() => { if (videoRef.current) { videoRef.current.volume = Math.min(1, volume); videoRef.current.muted = muted; } }, [volume, muted]);
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = speed; }, [speed]);

  // Source change
  const item = playlist[currentIndex];
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !item) return;

    const applyPos = () => {
      try {
        const hash = btoa(item.src).slice(0, 16);
        const pos = localStorage.getItem(`vlc-player-pos-${hash}`);
        if (pos) v.currentTime = parseFloat(pos);
      } catch {/*noop*/}
    };

    if (v.src !== item.src) {
      v.src = item.src;
      v.load();
      applyPos();
      if (usePlayerStore.getState().playing) v.play().catch(() => undefined);
    }
  }, [item]);

  // Persist position periodically
  useEffect(() => {
    if (!item) return;
    const id = setInterval(() => {
      const v = videoRef.current; if (!v || !v.duration) return;
      const hash = btoa(item.src).slice(0, 16);
      const pct = v.currentTime / v.duration;
      if (pct > 0.97) localStorage.removeItem(`vlc-player-pos-${hash}`);
      else if (v.currentTime > 5) localStorage.setItem(`vlc-player-pos-${hash}`, String(v.currentTime));
    }, 5000);
    return () => clearInterval(id);
  }, [item]);

  // Wire events
  const attach = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    localRef.current = el;
    if (!el) return;
    el.volume = Math.min(1, volume);
    el.muted = muted;
    el.playbackRate = speed;
    el.onplay = () => set({ playing: true });
    el.onpause = () => set({ playing: false });
    el.ondurationchange = () => set({ duration: el.duration || 0 });
    el.onended = () => {
      if (repeat === 2) { el.currentTime = 0; el.play().catch(() => undefined); return; }
      const s = usePlayerStore.getState();
      const isLast = s.currentIndex >= s.playlist.length - 1;
      if (isLast && repeat !== 1 && !s.random) {
        // VLC-style: stay parked on the final frame so the user can rewind / replay.
        // Do NOT clear the playlist, revoke blobs, or detach src.
        try { if (el.duration && isFinite(el.duration)) el.currentTime = Math.max(0, el.duration - 0.05); } catch {/*noop*/}
        s.set({ playing: false });
        s.pushOSD("End of playlist · press Play to replay, Backspace to restart");
      } else {
        next();
      }
    };
    el.onprogress = () => {
      if (el.buffered.length > 0) set({ buffered: el.buffered.end(el.buffered.length - 1) });
    };
    el.onwaiting = () => set({ buffering: true });
    el.onplaying = () => set({ buffering: false });
    el.oncanplay = () => set({ buffering: false });
    el.onseeking = () => set({ buffering: true });
    el.onseeked = () => set({ buffering: false });
    el.onloadedmetadata = () => {
      try { audioGraph.attach(el); } catch {/*noop*/}
      // MediaSession integration — lock-screen / Bluetooth headset controls
      try {
        const s = usePlayerStore.getState();
        const cur = s.playlist[s.currentIndex];
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: cur?.title ?? "VLC Web Player",
            artist: "VLC Web Player",
          });
          const ms = navigator.mediaSession;
          ms.setActionHandler?.("play", () => el.play().catch(() => undefined));
          ms.setActionHandler?.("pause", () => el.pause());
          ms.setActionHandler?.("previoustrack", () => usePlayerStore.getState().prev());
          ms.setActionHandler?.("nexttrack", () => usePlayerStore.getState().next());
          ms.setActionHandler?.("seekbackward", (d) => { window.dispatchEvent(new CustomEvent("vlc-chrome-silent-seek")); el.currentTime = Math.max(0, el.currentTime - (d.seekOffset ?? 10)); });
          ms.setActionHandler?.("seekforward", (d) => { window.dispatchEvent(new CustomEvent("vlc-chrome-silent-seek")); el.currentTime = Math.min(el.duration || 0, el.currentTime + (d.seekOffset ?? 10)); });
          ms.setActionHandler?.("seekto", (d) => { if (typeof d.seekTime === "number") { window.dispatchEvent(new CustomEvent("vlc-chrome-silent-seek")); el.currentTime = d.seekTime; } });
        }
      } catch {/*noop*/}
    };
  };

  return { attach };
}
