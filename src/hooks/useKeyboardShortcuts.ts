import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "./useVideoPlayer";
import { audioGraph } from "@/audio/AudioGraph";
import { srcKey } from "@/utils/srcKey";
import { useStudyStore } from "@/store/studyStore";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const v = videoRef.current;
      const s = usePlayerStore.getState();

      const seek = (delta: number) => {
        if (!v) return;
        window.dispatchEvent(new CustomEvent("vlc-chrome-silent-seek"));
        v.currentTime = clamp(v.currentTime + delta, 0, v.duration || 0);
        s.pushOSD(`Seek ${delta > 0 ? "+" : ""}${delta}s`);
      };
      const setVol = (delta: number) => {
        const nv = clamp(s.volume + delta, 0, 2);
        s.set({ volume: nv, muted: false });
        if (v) v.volume = Math.min(1, nv);
        try { audioGraph.setPreamp(nv > 1 ? (nv - 1) * 6 : 0); } catch {/*noop*/}
        s.pushOSD(`Volume: ${Math.round(nv * 100)}%`);
      };
      const setSpeed = (sp: number) => { s.set({ speed: sp }); if (v) v.playbackRate = sp; s.pushOSD(`Speed: ${sp.toFixed(2)}×`); };

      const code = e.code;
      const ctrl = e.ctrlKey || e.metaKey;
      const alt = e.altKey;
      const shift = e.shiftKey;

      // Modal / global Ctrl combos
      if (ctrl && code === "KeyO") { e.preventDefault(); document.getElementById("vlc-file-input")?.click(); return; }
      if (ctrl && code === "KeyN") { e.preventDefault(); s.set({ networkOpen: true }); return; }
      if (ctrl && code === "KeyL") { e.preventDefault(); s.set({ playlistOpen: !s.playlistOpen }); return; }
      if (ctrl && code === "KeyE") { e.preventDefault(); s.set({ effectsOpen: !s.effectsOpen }); return; }
      if (ctrl && code === "KeyP") { e.preventDefault(); s.set({ preferencesOpen: !s.preferencesOpen }); return; }
      if (ctrl && code === "KeyJ") { e.preventDefault(); s.set({ codecOpen: !s.codecOpen }); return; }
      if (ctrl && code === "KeyT") { e.preventDefault(); s.set({ jumpOpen: true }); return; }
      if (ctrl && code === "KeyK") { e.preventDefault(); s.set({ commandPaletteOpen: !s.commandPaletteOpen }); return; }
      if (ctrl && code === "KeyB") {
        e.preventDefault();
        const cur = s.playlist[s.currentIndex];
        if (v && cur) s.addBookmark(srcKey(cur.src), v.currentTime);
        return;
      }
      if (ctrl && alt && code === "KeyS") { e.preventDefault(); window.dispatchEvent(new CustomEvent("vlc-screenshot")); return; }
      if (ctrl && alt && code === "KeyC") {
        e.preventDefault();
        s.set({ openFeatureId: s.openFeatureId === "scicalc" ? null : "scicalc" });
        return;
      }
      if (ctrl && shift && code === "KeyS") { e.preventDefault(); useStudyStore.getState().patch({ hubOpen: !useStudyStore.getState().hubOpen }); return; }
      if (ctrl && code === "ArrowRight") { e.preventDefault(); seek(60); return; }
      if (ctrl && code === "ArrowLeft") { e.preventDefault(); seek(-60); return; }
      if (alt && code === "ArrowRight") { e.preventDefault(); seek(300); return; }
      if (alt && code === "ArrowLeft") { e.preventDefault(); seek(-300); return; }
      if (ctrl && code === "ArrowUp") { e.preventDefault(); setVol(0.05); return; }
      if (ctrl && code === "ArrowDown") { e.preventDefault(); setVol(-0.05); return; }
      if (ctrl) return;

      // Shift modifiers (VLC short seek + frame back)
      if (shift && code === "ArrowRight") { e.preventDefault(); seek(3); return; }
      if (shift && code === "ArrowLeft") { e.preventDefault(); seek(-3); return; }
      if (shift && code === "KeyE") { if (v && v.paused) { v.currentTime = Math.max(0, v.currentTime - 1 / 30); s.pushOSD("Frame back"); } return; }

      switch (code) {
        case "Space": e.preventDefault(); if (v) (v.paused ? v.play() : v.pause())?.catch?.(() => undefined); break;
        case "Backspace": if (v) { v.currentTime = 0; v.play().catch(() => undefined); s.pushOSD("Restart"); } break;
        case "KeyI": {
          // Picture-in-Picture toggle
          const vv = v as (HTMLVideoElement & { requestPictureInPicture?: () => Promise<PictureInPictureWindow> }) | null;
          if (!vv) break;
          if (document.pictureInPictureElement) document.exitPictureInPicture?.().catch(() => undefined);
          else vv.requestPictureInPicture?.().catch(() => undefined);
          break;
        }
        case "KeyS": if (v) { v.pause(); v.currentTime = 0; } break;
        case "KeyN": s.next(); break;
        case "KeyP": s.prev(); break;
        case "KeyF": e.preventDefault(); window.dispatchEvent(new CustomEvent("vlc-toggle-fullscreen")); break;
        case "KeyM": s.set({ muted: !s.muted }); s.pushOSD(s.muted ? "Unmuted" : "Muted"); break;
        case "KeyE": if (v && v.paused) { v.currentTime += 1 / 30; s.pushOSD("Frame advance"); } break;
        case "KeyR": s.set({ random: !s.random }); s.pushOSD(`Random: ${!s.random ? "On" : "Off"}`); break;
        case "KeyL": if (v) s.cycleAB(v.currentTime); break;
        case "KeyA": {
          const order = ["default", "16:9", "4:3", "16:10", "1:1", "2.35:1"] as const;
          const i = order.indexOf(s.aspectRatio as typeof order[number]);
          const ne = order[(i + 1) % order.length];
          s.set({ aspectRatio: ne }); s.pushOSD(`Aspect: ${ne}`);
          break;
        }
        case "KeyT": s.set({ showRemaining: !s.showRemaining }); break;
        case "ArrowRight": e.preventDefault(); seek(10); break;
        case "ArrowLeft": e.preventDefault(); seek(-10); break;
        case "ArrowUp": e.preventDefault(); setVol(0.05); break;
        case "ArrowDown": e.preventDefault(); setVol(-0.05); break;
        case "BracketRight": setSpeed(Math.min(4, s.speed + 0.25)); break;
        case "BracketLeft": setSpeed(Math.max(0.25, s.speed - 0.25)); break;
        case "Equal": setSpeed(1); break;
        case "KeyH": s.set({ sync: { ...s.sync, subtitleDelay: s.sync.subtitleDelay + 50 } }); s.pushOSD(`Subtitle delay: ${s.sync.subtitleDelay + 50}ms`); break;
        case "KeyG": s.set({ sync: { ...s.sync, subtitleDelay: s.sync.subtitleDelay - 50 } }); s.pushOSD(`Subtitle delay: ${s.sync.subtitleDelay - 50}ms`); break;
        case "KeyK": s.set({ sync: { ...s.sync, audioDelay: s.sync.audioDelay + 50 } }); s.pushOSD(`Audio delay: ${s.sync.audioDelay + 50}ms`); break;
        case "KeyJ": s.set({ sync: { ...s.sync, audioDelay: s.sync.audioDelay - 50 } }); s.pushOSD(`Audio delay: ${s.sync.audioDelay - 50}ms`); break;
        case "Slash": if (e.shiftKey) { e.preventDefault(); s.set({ helpOpen: !s.helpOpen }); } break;
      }

      // 0-9 percent seek
      if (/^Digit[0-9]$/.test(code) && v && v.duration) {
        const n = parseInt(code.slice(5), 10);
        window.dispatchEvent(new CustomEvent("vlc-chrome-silent-seek"));
        v.currentTime = (n / 10) * v.duration;
        s.pushOSD(`Seek ${n * 10}%`);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
}
