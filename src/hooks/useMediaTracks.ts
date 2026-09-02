import { useEffect, useState } from "react";
import { videoRef } from "@/hooks/useVideoPlayer";

export interface TrackEntry {
  index: number;
  label: string;
  active: boolean;
}

export interface MediaTracks {
  text: TrackEntry[];
  audio: TrackEntry[];
  video: TrackEntry[];
  /** Whether the browser exposes audioTracks/videoTracks at all. */
  audioSupported: boolean;
  videoSupported: boolean;
}

const EMPTY: MediaTracks = { text: [], audio: [], video: [], audioSupported: false, videoSupported: false };

type NativeTrack = { id?: string; label?: string; language?: string; enabled?: boolean; selected?: boolean };
type NativeTrackList = { length: number; [i: number]: NativeTrack; addEventListener?: (t: string, f: () => void) => void; removeEventListener?: (t: string, f: () => void) => void };

function readList(list: NativeTrackList | undefined, key: "enabled" | "selected"): TrackEntry[] {
  if (!list) return [];
  const out: TrackEntry[] = [];
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    out.push({ index: i, label: t.label || t.language || `Track ${i + 1}`, active: Boolean(t[key]) });
  }
  return out;
}

/**
 * Live view of the real track lists on the attached media element.
 * Text tracks are universally supported; audio/video track lists are not
 * (Chrome ships them behind a flag), so support is reported explicitly
 * instead of faking a "Track 1 - English" entry.
 */
export function useMediaTracks(): MediaTracks {
  const [tracks, setTracks] = useState<MediaTracks>(EMPTY);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      const v = videoRef.current;
      if (!v) { setTracks(EMPTY); return; }
      const el = v as HTMLVideoElement & { audioTracks?: NativeTrackList; videoTracks?: NativeTrackList };
      const text: TrackEntry[] = [];
      for (let i = 0; i < v.textTracks.length; i++) {
        const t = v.textTracks[i];
        text.push({ index: i, label: t.label || t.language || `Subtitle ${i + 1}`, active: t.mode === "showing" });
      }
      setTracks({
        text,
        audio: readList(el.audioTracks, "enabled"),
        video: readList(el.videoTracks, "selected"),
        audioSupported: Boolean(el.audioTracks),
        videoSupported: Boolean(el.videoTracks),
      });
    };

    read();
    const v = videoRef.current;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(read); };
    v?.textTracks.addEventListener("addtrack", schedule);
    v?.textTracks.addEventListener("removetrack", schedule);
    v?.textTracks.addEventListener("change", schedule);
    v?.addEventListener("loadedmetadata", schedule);
    // Track lists mutate without events in some engines; a slow poll keeps the
    // menu honest without measurable cost.
    const id = window.setInterval(read, 2000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
      v?.textTracks.removeEventListener("addtrack", schedule);
      v?.textTracks.removeEventListener("removetrack", schedule);
      v?.textTracks.removeEventListener("change", schedule);
      v?.removeEventListener("loadedmetadata", schedule);
    };
  }, []);

  return tracks;
}

export function selectTextTrack(index: number | null) {
  const v = videoRef.current;
  if (!v) return;
  for (let i = 0; i < v.textTracks.length; i++) {
    v.textTracks[i].mode = index === i ? "showing" : "disabled";
  }
}

export function selectAudioTrack(index: number) {
  const el = videoRef.current as (HTMLVideoElement & { audioTracks?: NativeTrackList }) | null;
  const list = el?.audioTracks;
  if (!list) return;
  for (let i = 0; i < list.length; i++) list[i].enabled = i === index;
}

export function selectVideoTrack(index: number) {
  const el = videoRef.current as (HTMLVideoElement & { videoTracks?: NativeTrackList }) | null;
  const list = el?.videoTracks;
  if (!list) return;
  for (let i = 0; i < list.length; i++) list[i].selected = i === index;
}