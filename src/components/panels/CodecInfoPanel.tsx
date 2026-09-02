import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { FloatingPanel } from "./FloatingPanel";
import { formatTime } from "@/utils/formatTime";
import { audioGraph } from "@/audio/AudioGraph";
import { useMediaTracks } from "@/hooks/useMediaTracks";

export function CodecInfoPanel() {
  const open = usePlayerStore((s) => s.codecOpen);
  const set = usePlayerStore((s) => s.set);
  const playlist = usePlayerStore((s) => s.playlist);
  const idx = usePlayerStore((s) => s.currentIndex);
  const tracks = useMediaTracks();
  if (!open) return null;
  const v = videoRef.current as (HTMLVideoElement & { getVideoPlaybackQuality?: () => VideoPlaybackQuality }) | null;
  const item = playlist[idx];
  const w = v?.videoWidth ?? 0;
  const h = v?.videoHeight ?? 0;
  const dur = v?.duration ?? 0;
  const container = /\.([a-z0-9]{2,5})(\?|$)/i.exec(item?.src ?? "")?.[1]?.toUpperCase() ?? "—";
  const quality = v?.getVideoPlaybackQuality?.();
  const buffered = v?.buffered;
  const bufferedEnd = buffered && buffered.length ? buffered.end(buffered.length - 1) : 0;
  const ctx = audioGraph.ctx;
  const READY = ["HAVE_NOTHING", "HAVE_METADATA", "HAVE_CURRENT_DATA", "HAVE_FUTURE_DATA", "HAVE_ENOUGH_DATA"];

  // Codec strings are not exposed to web pages; report the container instead of
  // inventing "H.264 / AAC".
  const rows: [string, string][] = [
    ["File name", item?.title ?? "—"],
    ["URL", v?.currentSrc || item?.src || "—"],
    ["Container", container],
    ["Resolution", w && h ? `${w} × ${h}` : "—"],
    ["Aspect ratio", w && h ? (w / h).toFixed(3) : "—"],
    ["Duration", dur ? formatTime(dur) : "—"],
    ["Ready state", v ? `${v.readyState} · ${READY[v.readyState] ?? "?"}` : "—"],
    ["Buffered", buffered?.length ? `${buffered.length} range(s), to ${formatTime(bufferedEnd)}` : "—"],
    ["Frames dropped", quality ? `${quality.droppedVideoFrames} / ${quality.totalVideoFrames}` : "Not reported"],
    ["Audio context rate", ctx ? `${ctx.sampleRate} Hz` : "Audio graph idle"],
    ["Output channels", ctx ? String(ctx.destination.channelCount) : "—"],
    ["Text tracks", tracks.text.length ? tracks.text.map((t) => t.label).join(", ") : "None"],
    ["Audio tracks", tracks.audioSupported ? (tracks.audio.map((t) => t.label).join(", ") || "None") : "Not exposed by this browser"],
    ["Video tracks", tracks.videoSupported ? (tracks.video.map((t) => t.label).join(", ") || "None") : "Not exposed by this browser"],
  ];
  return (
    <FloatingPanel title="Current Media Information" onClose={() => set({ codecOpen: false })} width={420}>
      <div className="p-4">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-3 py-1.5" style={{ borderBottom: "1px solid var(--vlc-border-subtle)" }}>
            <span className="text-[12px]" style={{ width: 110, color: "var(--vlc-text-ghost)" }}>{k}</span>
            <span className="text-[12px] flex-1 break-all" style={{ fontFamily: "var(--vlc-font-mono)", color: "var(--vlc-text-primary)", userSelect: "text" }}>{v}</span>
          </div>
        ))}
      </div>
    </FloatingPanel>
  );
}
