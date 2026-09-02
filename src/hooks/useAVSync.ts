import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { audioGraph } from "@/audio/AudioGraph";
import { videoRef } from "@/hooks/useVideoPlayer";
import { applySubtitleDelay } from "@/utils/subtitles";

/**
 * Applies A/V synchronisation state to the real pipeline.
 *
 *  - audio delay  → DelayNode in the Web Audio graph (positive only; you
 *    cannot pull audio ahead of a live element).
 *  - subtitle delay → cue time shift on every TextTrack (exact, both signs).
 */
export function useAVSync() {
  const sync = usePlayerStore((s) => s.sync);
  const karaoke = usePlayerStore((s) => s.karaoke);

  useEffect(() => {
    audioGraph.setDelayMs(sync.audioDelay);
  }, [sync.audioDelay]);

  useEffect(() => {
    audioGraph.setKaraoke(karaoke);
  }, [karaoke]);

  useEffect(() => {
    const apply = () => applySubtitleDelay(videoRef.current, sync.subtitleDelay);
    apply();
    // Re-apply once cues finish parsing after a track is attached.
    const v = videoRef.current;
    v?.textTracks.addEventListener("addtrack", apply);
    const id = window.setTimeout(apply, 400);
    return () => {
      window.clearTimeout(id);
      v?.textTracks.removeEventListener("addtrack", apply);
    };
  }, [sync.subtitleDelay]);
}