import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { useShallow } from "zustand/react/shallow";
import { videoRef, currentTimeRef } from "@/hooks/useVideoPlayer";
import { usePlaybackTicker } from "@/hooks/usePlaybackTicker";
import { formatTime } from "@/utils/formatTime";
import { srcKey } from "@/utils/srcKey";
import { isVisible } from "@/utils/uiCustomization";

/**
 * SeekBar — layered scrub track.
 *
 * Phase 3 Upgrade:
 *  - Premium elastic thumb scaling on hover/drag using springs.
 *  - Increased touch target height (48px) for mobile-first accessibility.
 *  - Glowing accent trail on played portion.
 *  - Bookmark markers pulse on hover.
 *  - Hover tooltip has a subtle slide-in animation.
 */
export function SeekBar() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const playedRef = useRef<HTMLDivElement | null>(null);
  const bufferedRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<{ x: number; t: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const wasPlayingRef = useRef(false);
  const buffering = usePlayerStore((s) => s.buffering);
  const duration = usePlayerStore((s) => s.duration);
  const buffered = usePlayerStore((s) => s.buffered);
  const ab = usePlayerStore((s) => s.abLoop);
  
  // Isolate current key extraction so playlist changes don't re-render SeekBar
  const curKey = usePlayerStore((s) => srcKey(s.playlist[s.currentIndex]?.src));
  
  // Use shallow compare for bookmarks to prevent re-renders when other videos' bookmarks change
  const bookmarks = usePlayerStore(useShallow((s) => s.bookmarks[curKey] ?? []));

  const removeBookmark = usePlayerStore((s) => s.removeBookmark);
  const setStore = usePlayerStore((s) => s.set);
  const cycleAB = usePlayerStore((s) => s.cycleAB);
  const addBookmark = usePlayerStore((s) => s.addBookmark);
  const [menu, setMenu] = useState<{ x: number; y: number; t: number } | null>(null);
  const vis = usePlayerStore((s) => s.uiVisibility);
  const v = (id: string) => isVisible(vis, id);

  const now = usePlaybackTicker();

  useEffect(() => {
    const v = videoRef.current;
    if (v && v.duration > 0) {
      const pct = (now / v.duration) * 100;
      if (playedRef.current) playedRef.current.style.width = `${pct}%`;
      if (thumbRef.current) thumbRef.current.style.left = `${pct}%`;
      if (bufferedRef.current && v.duration) bufferedRef.current.style.width = `${(buffered / v.duration) * 100}%`;
      const a = ab.a; const b = ab.b;
      if (a !== null && b !== null && now >= b) v.currentTime = a;
    }
  }, [now, buffered, ab.a, ab.b]);

  const seekFromX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect(); if (!rect) return;
    const v = videoRef.current; if (!v || !v.duration) return;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click for seeking
    const v = videoRef.current; if (!v) return;
    wasPlayingRef.current = !v.paused;
    v.pause();
    setDragging(true);
    usePlayerStore.getState().set({ interacting: true });
    seekFromX(e.clientX);
  };

  useEffect(() => {
    if (!dragging) return;
    const mv = (e: MouseEvent) => seekFromX(e.clientX);
    const up = () => {
      setDragging(false);
      usePlayerStore.getState().set({ interacting: false });
      if (wasPlayingRef.current) videoRef.current?.play().catch(() => undefined);
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [dragging]);

  const onMove = (e: React.MouseEvent) => {
    const rect = trackRef.current?.getBoundingClientRect(); if (!rect) return;
    const v = videoRef.current; if (!v || !v.duration) return;
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHover({ x: e.clientX - rect.left, t: pct * v.duration });
    if (dragging) seekFromX(e.clientX);
  };

  const active = dragging || !!hover;
  const trackH = active ? 8 : 4;
  const thumbScale = dragging ? 1.6 : active ? 1.3 : 1;

  const keyStep = (delta: number) => {
    const v = videoRef.current; if (!v || !v.duration) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + delta));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current; if (!v || !v.duration) return;
    const s = e.shiftKey ? 1 : 5;
    switch (e.key) {
      case "ArrowRight": e.preventDefault(); keyStep(s); break;
      case "ArrowLeft": e.preventDefault(); keyStep(-s); break;
      case "PageUp": e.preventDefault(); keyStep(60); break;
      case "PageDown": e.preventDefault(); keyStep(-60); break;
      case "Home": e.preventDefault(); v.currentTime = 0; break;
      case "End": e.preventDefault(); v.currentTime = v.duration; break;
    }
  };
  const onWheel = (e: React.WheelEvent) => {
    const v = videoRef.current; if (!v || !v.duration) return;
    const dir = e.deltaY > 0 ? -1 : 1;
    const step = e.ctrlKey || e.metaKey ? 1 : 5;
    keyStep(dir * step);
  };
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = trackRef.current?.getBoundingClientRect(); if (!rect) return;
    const v = videoRef.current; if (!v || !v.duration) return;
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setMenu({ x: e.clientX, y: e.clientY, t: pct * v.duration });
  };
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    return () => { window.removeEventListener("mousedown", close); window.removeEventListener("scroll", close, true); };
  }, [menu]);

  return (
    <div
      data-vlc-region="seek"
      data-vlc-focus="none"
      role="slider"
      tabIndex={0}
      aria-label="Video position"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(videoRef.current?.currentTime ?? 0)}
      className="relative flex items-center group w-full"
      style={{
        height: 48, // Larger touch target
        padding: "0 14px",
        cursor: "ew-resize",
        touchAction: "none",
        outline: "none",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      onContextMenu={onContextMenu}
    >
      {v("seek.timeline") && <div
        ref={trackRef}
        data-vlc-track
        className="relative w-full"
        style={{
          height: trackH,
          background: "var(--vlc-seek-track)",
          borderRadius: "var(--vlc-radius-full)",
          transition: "height 300ms cubic-bezier(0.05, 0.7, 0.1, 1)",
          boxShadow: active ? "inset 0 0 0 1px color-mix(in oklab, var(--vlc-border-subtle) 50%, transparent)" : "none",
        }}
      >
        {buffering && (
          <div
            aria-hidden
            className="absolute top-0 left-0 h-full w-full pointer-events-none"
            style={{
              borderRadius: "var(--vlc-radius-full)",
              background:
                "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--vlc-accent) 65%, transparent) 50%, transparent 100%)",
              backgroundSize: "40% 100%",
              backgroundRepeat: "no-repeat",
              animation: "vlc-seek-shimmer 1.1s linear infinite",
              mixBlendMode: "screen",
            }}
          />
        )}
        {v("seek.buffered") && <div
          ref={bufferedRef}
          data-vlc-buffered
          className="absolute top-0 left-0 h-full pointer-events-none"
          style={{ background: "var(--vlc-seek-buffered)", borderRadius: "var(--vlc-radius-full)" }}
        />}
        <div
          ref={playedRef}
          data-vlc-played
          className="absolute top-0 left-0 h-full pointer-events-none"
          style={{
            background: "linear-gradient(90deg, var(--vlc-accent-active) 0%, var(--vlc-accent) 60%, var(--vlc-accent-hover) 100%)",
            borderRadius: "var(--vlc-radius-full)",
            width: 0,
            boxShadow: active
              ? "0 0 20px color-mix(in oklab, var(--vlc-accent) 75%, transparent), 0 0 6px color-mix(in oklab, var(--vlc-accent) 90%, transparent)"
              : "0 0 10px color-mix(in oklab, var(--vlc-accent) 30%, transparent)",
            transition: "box-shadow 300ms cubic-bezier(0.05, 0.7, 0.1, 1)",
          }}
        />

        {/* AB region */}
        {v("seek.abLoop") && ab.a !== null && ab.b !== null && duration > 0 && (
          <div
            className="absolute top-0 h-full pointer-events-none"
            style={{
              left: `${(ab.a / duration) * 100}%`,
              width: `${((ab.b - ab.a) / duration) * 100}%`,
              background: "var(--vlc-accent)",
              opacity: 0.25,
            }}
          />
        )}
        {v("seek.abLoop") && ab.a !== null && duration > 0 && (
          <div
            className="absolute pointer-events-none rounded-full"
            style={{ left: `${(ab.a / duration) * 100}%`, top: -2, bottom: -2, width: 3, background: "var(--vlc-accent)" }}
          />
        )}
        {v("seek.abLoop") && ab.b !== null && duration > 0 && (
          <div
            className="absolute pointer-events-none rounded-full"
            style={{ left: `${(ab.b / duration) * 100}%`, top: -2, bottom: -2, width: 3, background: "var(--vlc-accent)" }}
          />
        )}

        {/* Bookmarks */}
        {v("seek.bookmarks") && duration > 0 && bookmarks.map((t) => (
          <button
            key={t}
            title={`Bookmark @ ${formatTime(t)} — click to jump, right-click to remove`}
            aria-label={`Jump to bookmark at ${formatTime(t)}`}
            onClick={(e) => { e.stopPropagation(); const v = videoRef.current; if (v) v.currentTime = t; }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); removeBookmark(curKey, t); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute pointer-events-auto vlc-bookmark-marker"
            style={{
              left: `${(t / duration) * 100}%`,
              top: active ? -3 : -2,
              bottom: active ? -3 : -2,
              width: 6,
              transform: "translateX(-50%)",
              background: "var(--vlc-warning)",
              border: "1px solid var(--vlc-bg-surface)",
              borderRadius: 3,
              cursor: "pointer",
              padding: 0,
              transition: "top 200ms ease, bottom 200ms ease",
            }}
          />
        ))}

        {v("seek.thumb") && <div
          ref={thumbRef}
          className="absolute top-1/2 rounded-full pointer-events-none"
          style={{
            width: 14,
            height: 14,
            background: "var(--vlc-seek-thumb)",
            left: 0,
            transform: `translate(-50%, -50%) scale(${thumbScale})`,
            opacity: active ? 1 : 0.8,
            boxShadow: dragging
              ? "0 0 0 6px color-mix(in oklab, var(--vlc-accent) 25%, transparent), var(--vlc-shadow-2)"
              : active
                ? "0 0 0 4px color-mix(in oklab, var(--vlc-accent) 15%, transparent), var(--vlc-shadow-1)"
                : "var(--vlc-shadow-1)",
            transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease, box-shadow 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />}
      </div>}

      {/* Hover preview tooltip */}
      {v("seek.hoverPreview") && hover && (
        <div
          className="vlc-tooltip-enter absolute pointer-events-none"
          style={{
            bottom: 36,
            left: Math.max(48, Math.min(hover.x + 14, (trackRef.current?.clientWidth ?? 0) - 48)),
            transform: "translateX(-50%)",
            zIndex: 40,
          }}
        >
          <div
            className="glass-panel flex items-center gap-1.5 px-2.5 py-1.5 rounded-md"
            style={{
              border: "1px solid var(--vlc-border-normal)",
              boxShadow: "var(--vlc-shadow-3)",
            }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 6, height: 6, background: "var(--vlc-accent)", boxShadow: "0 0 8px color-mix(in oklab, var(--vlc-accent) 80%, transparent)" }}
            />
            <span className="vlc-num text-[12px] font-semibold" style={{ color: "var(--vlc-text-primary)" }}>
              {formatTime(hover.t)}
            </span>
          </div>
          {/* tooltip pointer */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -5,
              width: 10,
              height: 10,
              background: "var(--vlc-bg-elevated)",
              borderRight: "1px solid var(--vlc-border-normal)",
              borderBottom: "1px solid var(--vlc-border-normal)",
              transform: "translateX(-50%) rotate(45deg)",
            }}
          />
        </div>
      )}

      {menu && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
          className="fixed z-[80] glass-panel rounded-md py-1"
          style={{
            top: menu.y + 4,
            left: menu.x + 4,
            minWidth: 200,
            border: "1px solid var(--vlc-border-normal)",
            boxShadow: "var(--vlc-shadow-popup)",
            color: "var(--vlc-text-primary)",
            fontSize: 12,
          }}
        >
          {[
            { label: `Jump to ${formatTime(menu.t)}`, run: () => { const v = videoRef.current; if (v) v.currentTime = menu.t; } },
            { label: "Add bookmark here", run: () => addBookmark(curKey, menu.t) },
            { label: "Set A / B loop here", run: () => cycleAB(menu.t) },
            { label: "Clear A / B loop", run: () => setStore({ abLoop: { a: null, b: null } }) },
          ].map((it) => (
            <button
              key={it.label}
              onClick={() => { it.run(); setMenu(null); }}
              className="w-full text-left px-3 py-1.5 press"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--vlc-accent-dim)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
