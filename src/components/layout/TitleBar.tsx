import { useEffect, useState } from "react";
import { Minus, Square, X, Calculator, Music } from "@/components/icons";
import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { isVisible } from "@/utils/uiCustomization";
import { formatTime } from "@/utils/formatTime";
import { OnlineBadge } from "./OnlineBadge";
import { StudyStatusChip } from "@/components/study/StudyStatusChip";

/**
 * TitleBar — desktop-app style title strip.
 *
 * Visual upgrades (Phase 2):
 *  - Glass-chrome background with hairline top highlight + bottom border.
 *  - Centered title slot with secondary metadata pill (resolution • duration).
 *  - Micro window-control hover/focus states; close button keeps red wash.
 *  - All styling routed through tokens — no hard-coded greys.
 */
export function TitleBar() {
  const playlist = usePlayerStore((s) => s.playlist);
  const idx = usePlayerStore((s) => s.currentIndex);
  const vis = usePlayerStore((s) => s.uiVisibility);
  const duration = usePlayerStore((s) => s.duration);
  const openFeatureId = usePlayerStore((s) => s.openFeatureId);
  const setStore = usePlayerStore((s) => s.set);
  const item = playlist[idx];
  const v = (id: string) => isVisible(vis, id);

  // Live resolution from the video element — sampled on each mount/change.
  const [res, setRes] = useState<string | null>(null);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const update = () => {
      if (el.videoWidth && el.videoHeight) setRes(`${el.videoWidth}×${el.videoHeight}`);
      else setRes(null);
    };
    update();
    el.addEventListener("loadedmetadata", update);
    el.addEventListener("resize", update);
    return () => {
      el.removeEventListener("loadedmetadata", update);
      el.removeEventListener("resize", update);
    };
  }, [idx, item?.src]);

  return (
    <div
      data-vlc-region="title"
      role="banner"
      className="relative flex items-center select-none hairline-top hairline-bottom"
      style={{
        height: 36,
        background: "var(--vlc-bg-sunken)",
        // Native title drag region (PWA window-controls-overlay)
        WebkitAppRegion: "drag",
      } as React.CSSProperties}
    >
      {/* Left: logo */}
      <div className="flex items-center gap-2 pl-3 pr-2 shrink-0">
        {v("title.logo") && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3 L3 21 L21 21 Z" fill="var(--vlc-accent)" />
            <ellipse cx="12" cy="21" rx="9" ry="1.5" fill="var(--vlc-bg-sunken)" />
          </svg>
        )}
      </div>

      {/* Center: title + metadata */}
      <div className="flex-1 min-w-0 flex items-center justify-center gap-3 px-3">
        {v("title.text") && (
          <span
            className="truncate text-[12px] font-medium tracking-tight"
            style={{ color: "var(--vlc-text-primary)", maxWidth: 520 }}
            title={item?.title ?? "VLC Web Player"}
          >
            {item?.title ?? "VLC Web Player"}
          </span>
        )}
        {v("title.metadata") && (res || duration > 0) && (
          <span
            className="hidden md:inline-flex items-center gap-1.5 vlc-num text-[10.5px] uppercase tracking-wider px-2 py-[2px] rounded-full"
            style={{
              color: "var(--vlc-text-secondary)",
              background: "var(--vlc-bg-surface)",
              border: "1px solid var(--vlc-border-subtle)",
            }}
          >
            {res && <span>{res}</span>}
            {res && duration > 0 && <span style={{ color: "var(--vlc-text-disabled)" }}>•</span>}
            {duration > 0 && <span>{formatTime(duration)}</span>}
          </span>
        )}
        {v("title.onlineBadge") && <OnlineBadge />}
        {v("title.studyChip") && <StudyStatusChip />}
        {v("title.calculator") && (
          <button
            type="button"
            onClick={() =>
              setStore({ openFeatureId: openFeatureId === "scicalc" ? null : "scicalc" })
            }
            title="Scientific Calculator (Ctrl+Alt+C)"
            aria-label="Scientific Calculator"
            aria-pressed={openFeatureId === "scicalc"}
            className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full text-[10.5px] font-medium transition-colors"
            style={{
              color:
                openFeatureId === "scicalc"
                  ? "var(--vlc-bg-base)"
                  : "var(--vlc-text-secondary)",
              background:
                openFeatureId === "scicalc"
                  ? "var(--vlc-accent)"
                  : "var(--vlc-bg-surface)",
              border: "1px solid var(--vlc-border-subtle)",
              WebkitAppRegion: "no-drag",
            } as React.CSSProperties}
          >
            <Calculator size={12} />
            <span className="hidden md:inline">Calc</span>
          </button>
        )}
        {v("title.music") && <MusicChip />}
      </div>

      {/* Right: window controls */}
      {v("title.windowButtons") && (
        <div
          className="flex items-stretch shrink-0"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <TitleBtn aria-label="Minimize">
            <Minus size={12} />
          </TitleBtn>
          <TitleBtn aria-label="Maximize">
            <Square size={11} />
          </TitleBtn>
          <TitleBtn aria-label="Close" danger>
            <X size={14} />
          </TitleBtn>
        </div>
      )}
    </div>
  );
}

/** Background-music quick chip — toggles the music popup. */
function MusicChip() {
  const ambientOpen = usePlayerStore((s) => s.ambientOpen);
  const musicPlaying = usePlayerStore((s) => s.ambient.playing);
  const set = usePlayerStore((s) => s.set);
  return (
    <button
      type="button"
      onClick={() => set({ ambientOpen: !ambientOpen })}
      title={musicPlaying ? "Background music (playing)" : "Background music"}
      aria-label="Background music"
      aria-pressed={ambientOpen}
      className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full text-[10.5px] font-medium transition-colors"
      style={{
        color: ambientOpen ? "var(--vlc-bg-base)" : musicPlaying ? "var(--vlc-accent)" : "var(--vlc-text-secondary)",
        background: ambientOpen ? "var(--vlc-accent)" : "var(--vlc-bg-surface)",
        border: "1px solid var(--vlc-border-subtle)",
        WebkitAppRegion: "no-drag",
      } as React.CSSProperties}
    >
      <Music size={12} />
      <span className="hidden md:inline">Music</span>
      {musicPlaying && !ambientOpen && (
        <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: "var(--vlc-accent)" }} />
      )}
    </button>
  );
}

function TitleBtn({
  children,
  danger = false,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      {...rest}
      className="flex items-center justify-center transition-colors"
      style={{
        width: 46,
        height: 36,
        color: "var(--vlc-text-secondary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? "#c42b1c" : "var(--vlc-control-hover)";
        e.currentTarget.style.color = danger ? "#fff" : "var(--vlc-text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--vlc-text-secondary)";
      }}
    >
      {children}
    </button>
  );
}
