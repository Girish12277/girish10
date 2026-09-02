import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { isVisible } from "@/utils/uiCustomization";
import { useVideoPlayer, videoRef } from "@/hooks/useVideoPlayer";
import { EmptyState } from "./EmptyState";

export function VideoCanvas() {
  const { attach } = useVideoPlayer();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const playlist = usePlayerStore((s) => s.playlist);
  const idx = usePlayerStore((s) => s.currentIndex);
  const filters = usePlayerStore((s) => s.filters);
  const aspectRatio = usePlayerStore((s) => s.aspectRatio);
  // playing state used elsewhere via store
  const set = usePlayerStore((s) => s.set);
  const pushOSD = usePlayerStore((s) => s.pushOSD);

  useEffect(() => {
    const handler = () => {
      const v = videoRef.current; if (!v) return;
      try {
        const c = document.createElement("canvas");
        c.width = v.videoWidth || 1280; c.height = v.videoHeight || 720;
        const ctx = c.getContext("2d"); if (!ctx) return;
        ctx.drawImage(v, 0, 0, c.width, c.height);
        c.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          const ts = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
          a.download = `vlc-snap-${ts}.png`;
          a.href = url; a.click();
          setTimeout(() => URL.revokeObjectURL(url), 60000);
          pushOSD(`Snapshot taken: ${a.download}`);
          if (flashRef.current) {
            flashRef.current.style.opacity = "0.4";
            requestAnimationFrame(() => { if (flashRef.current) { flashRef.current.style.transition = "opacity 200ms"; flashRef.current.style.opacity = "0"; } });
            setTimeout(() => { if (flashRef.current) flashRef.current.style.transition = ""; }, 220);
          }
        }, "image/png");
      } catch (e) { console.warn(e); }
    };
    window.addEventListener("vlc-screenshot", handler);
    return () => window.removeEventListener("vlc-screenshot", handler);
  }, [pushOSD]);

  // Fullscreen toggle
  useEffect(() => {
    const handler = () => {
      const root = document.documentElement;
      if (!document.fullscreenElement) root.requestFullscreen?.().catch(() => undefined);
      else document.exitFullscreen?.();
    };
    const onChange = () => set({ fullscreen: !!document.fullscreenElement });
    window.addEventListener("vlc-toggle-fullscreen", handler);
    document.addEventListener("fullscreenchange", onChange);
    return () => { window.removeEventListener("vlc-toggle-fullscreen", handler); document.removeEventListener("fullscreenchange", onChange); };
  }, [set]);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // ignore double-click handler conflict with timeout
    const v = videoRef.current; if (!v) return;
    if ((e as React.MouseEvent & { detail?: number }).detail === 2) return;
    setTimeout(() => {
      // single click toggles
      if ((e as React.MouseEvent & { detail?: number }).detail !== 1) return;
      (v.paused ? v.play() : v.pause())?.catch?.(() => undefined);
    }, 0);
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect(); if (!rect) return;
    const x = e.clientX - rect.left;
    const v = videoRef.current; if (!v) return;
    if (x < rect.width * 0.25) { window.dispatchEvent(new CustomEvent("vlc-chrome-silent-seek")); v.currentTime = Math.max(0, v.currentTime - 10); pushOSD("◀◀ 10s"); }
    else if (x > rect.width * 0.75) { window.dispatchEvent(new CustomEvent("vlc-chrome-silent-seek")); v.currentTime = Math.min(v.duration, v.currentTime + 10); pushOSD("10s ▶▶"); }
    else window.dispatchEvent(new CustomEvent("vlc-toggle-fullscreen"));
  };

  const onWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) return;
    const s = usePlayerStore.getState();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const nv = Math.max(0, Math.min(2, s.volume + delta));
    s.set({ volume: nv, muted: false });
    if (videoRef.current) videoRef.current.volume = Math.min(1, nv);
    pushOSD(`Volume: ${Math.round(nv * 100)}%`);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isVisible(usePlayerStore.getState().uiVisibility, "chrome.contextMenu")) return;
    set({ contextMenu: { x: e.clientX, y: e.clientY, open: true } });
  };

  // Filter style. CSS has no gamma primitive, so gamma is applied through an
  // inline SVG feComponentTransfer filter chained after the CSS functions.
  const gammaActive = filters.enabled && Math.abs(filters.gamma - 1) > 0.001;
  const filterStyle = filters.enabled
    ? `hue-rotate(${filters.hue}deg) saturate(${filters.saturation}) contrast(${filters.contrast}) brightness(${filters.brightness})${gammaActive ? " url(#vlc-gamma)" : ""}`
    : "none";

  // Aspect ratio handling
  let objectFit: React.CSSProperties["objectFit"] = "contain";
  let arStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit };
  if (aspectRatio !== "default") {
    const ratios: Record<string, number> = { "1:1": 1, "4:3": 4/3, "16:9": 16/9, "16:10": 16/10, "2.21:1": 2.21, "2.35:1": 2.35, "2.39:1": 2.39, "5:4": 5/4 };
    const ar = ratios[aspectRatio];
    if (ar) arStyle = { width: "100%", height: "100%", aspectRatio: String(ar), objectFit: "fill" };
  }

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;
    if (dt < 400 && Math.abs(dx) > 60 && Math.abs(dy) < 100) {
      const v = videoRef.current;
      if (v && v.duration) {
        if (dx > 0) { v.currentTime = Math.min(v.duration, v.currentTime + 10); pushOSD("Forward 10s"); }
        else { v.currentTime = Math.max(0, v.currentTime - 10); pushOSD("Rewind 10s"); }
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      data-vlc-video-stage
      className="relative flex-1 flex items-center justify-center overflow-hidden"
      style={{ background: "#000" }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onWheel={onWheel}
      onContextMenu={onContextMenu}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {gammaActive && (
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <filter id="vlc-gamma" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="gamma" exponent={1 / filters.gamma} />
              <feFuncG type="gamma" exponent={1 / filters.gamma} />
              <feFuncB type="gamma" exponent={1 / filters.gamma} />
            </feComponentTransfer>
          </filter>
        </svg>
      )}
      <video
        ref={attach}
        playsInline
        crossOrigin="anonymous"
        style={{ ...arStyle, filter: filterStyle, transform: `scale(${filters.zoom / 100}) rotate(${filters.rotate}deg) scaleX(${filters.flipH ? -1 : 1}) scaleY(${filters.flipV ? -1 : 1})`, transformOrigin: "center", display: playlist.length === 0 ? "none" : undefined }}
      />
      {playlist.length === 0 && <EmptyState />}
      <div ref={flashRef} className="absolute inset-0 pointer-events-none" style={{ background: "white", opacity: 0 }} />
    </div>
  );
}
