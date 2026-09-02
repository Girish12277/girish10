import { useEffect, useRef, useState } from "react";
import {
  Play, Pause, Square, SkipBack, SkipForward, Repeat, Repeat1, Shuffle,
  Maximize, Minimize, SlidersHorizontal, StepForward, List,
  Volume2, Volume1, VolumeX, Volume, Type, Gauge, PictureInPicture2, Command,
} from "@/components/icons";
import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { usePlaybackTicker } from "@/hooks/usePlaybackTicker";
import { formatTime } from "@/utils/formatTime";
import { audioGraph } from "@/audio/AudioGraph";
import { isVisible } from "@/utils/uiCustomization";
import { Tooltip } from "@/components/ui/vlc-tooltip";

/**
 * ControlBar — three-zone transport.
 *
 * Phase 4 Upgrade:
 *  - Premium tooltips replacing native `title` (animated, keyboard hints).
 *  - Spring-driven icon morph animations (Play/Pause, Fullscreen).
 *  - Dynamic CSS ripple effects on button press.
 *  - Active speed indicator badge on the gauge icon.
 *  - Gradient-filled volume slider track.
 */

type BtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  label?: string;
  large?: boolean;
  active?: boolean;
  primary?: boolean;
};

const Btn = ({ children, onClick, title, label, large = false, active = false, primary = false }: BtnProps) => {
  const sz = large ? 44 : 36;
  const fg = primary
    ? "var(--vlc-text-inverse)"
    : active
    ? "var(--vlc-accent)"
    : "var(--vlc-text-primary)";
  const bg = primary
    ? "var(--vlc-accent)"
    : active
    ? "var(--vlc-accent-dim)"
    : "transparent";
    
  const content = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? (title?.replace(/\s*\(.+\)$/, "") ?? undefined)}
      aria-pressed={active || undefined}
      className="vlc-ctrl-btn relative inline-flex items-center justify-center shrink-0 overflow-hidden group"
      style={{
        width: sz,
        height: sz,
        borderRadius: "var(--vlc-control-radius)",
        background: bg,
        color: fg,
        transition: "background var(--vlc-dur-fast) var(--vlc-ease-standard), color var(--vlc-dur-fast)",
      }}
      onMouseEnter={(e) => {
        if (primary) e.currentTarget.style.background = "var(--vlc-accent-hover)";
        else if (!active) e.currentTarget.style.background = "var(--vlc-control-hover)";
      }}
      onMouseLeave={(e) => {
        if (primary) e.currentTarget.style.background = "var(--vlc-accent)";
        else if (!active) e.currentTarget.style.background = "transparent";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.92)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <span className="vlc-btn-ripple" aria-hidden />
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </button>
  );

  if (title) {
    const hasKbd = title.match(/\((.+)\)$/);
    const kbd = hasKbd ? hasKbd[1] : undefined;
    const cleanLabel = hasKbd ? title.replace(/\s*\(.+\)$/, "") : title;
    return <Tooltip label={cleanLabel} kbd={kbd}>{content}</Tooltip>;
  }
  return content;
};

const Divider = () => (
  <div
    aria-hidden="true"
    className="shrink-0"
    style={{ width: 1, height: 22, background: "var(--vlc-border-subtle)", margin: "0 6px" }}
  />
);

import { useShallow } from "zustand/react/shallow";

export function ControlBar() {
  const { 
    set, pushOSD, playing, muted, volume, repeat, random, showRemaining, duration, 
    fullscreen, uiVisibility: vis, speed, next, prev, cycleRepeat, effectsOpen, playlistOpen, commandPaletteOpen
  } = usePlayerStore(useShallow((st) => ({
    set: st.set,
    pushOSD: st.pushOSD,
    playing: st.playing,
    muted: st.muted,
    volume: st.volume,
    repeat: st.repeat,
    random: st.random,
    showRemaining: st.showRemaining,
    duration: st.duration,
    fullscreen: st.fullscreen,
    uiVisibility: st.uiVisibility,
    speed: st.speed,
    next: st.next,
    prev: st.prev,
    cycleRepeat: st.cycleRepeat,
    effectsOpen: st.effectsOpen,
    playlistOpen: st.playlistOpen,
    commandPaletteOpen: st.commandPaletteOpen,
  })));
  const v = (id: string) => isVisible(vis, id);
  const [speedOpen, setSpeedOpen] = useState(false);
  const speedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!speedOpen) return;
    const onDoc = (e: MouseEvent) => { if (speedRef.current && !speedRef.current.contains(e.target as Node)) setSpeedOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [speedOpen]);
  const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4];
  const setSpeed = (val: number) => { set({ speed: val }); if (videoRef.current) videoRef.current.playbackRate = val; pushOSD(`Speed: ${val}x`); setSpeedOpen(false); };

  const [volOpen, setVolOpen] = useState(false);
  const volRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!volOpen) return;
    const onDoc = (e: MouseEvent) => { if (volRef.current && !volRef.current.contains(e.target as Node)) setVolOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [volOpen]);

  const now = usePlaybackTicker();

  const togglePlay = () => { const vEl = videoRef.current; if (vEl) (vEl.paused ? vEl.play() : vEl.pause())?.catch?.(() => undefined); audioGraph.resume(); };
  const stop = () => { const vEl = videoRef.current; if (vEl) { vEl.pause(); vEl.currentTime = 0; } };

  const VolIcon = muted || volume === 0 ? VolumeX : volume <= 0.33 ? Volume : volume <= 0.66 ? Volume1 : Volume2;

  const onVolChange = (val: number) => {
    set({ volume: val, muted: false });
    if (videoRef.current) videoRef.current.volume = Math.min(1, val);
    if (val > 1) audioGraph.setPreamp((val - 1) * 6); else audioGraph.setPreamp(0);
  };

  const volPct = Math.round(volume * 100);
  // Color gradient for the slider track
  const volColor = volume > 1 ? "var(--vlc-warning)" : "var(--vlc-accent)";
  const volTrackBg = `linear-gradient(to right, ${volColor} ${(Math.min(volume, 2) / 2) * 100}%, color-mix(in oklab, var(--vlc-text-primary) 12%, transparent) 0%)`;

  return (
    <div
      data-vlc-region="control"
      role="toolbar"
      aria-label="Playback controls"
      className="vlc-control-bar flex items-center gap-0.5 px-3 hairline-top"
      style={{
        background: "var(--vlc-bg-surface)",
      }}
    >
      {/* ─────────── LEFT: transport ─────────── */}
      <div className="flex items-center gap-0.5 shrink-0">
        {v("ctrl.stop") && <Btn onClick={stop} title="Stop (S)"><Square size={14} fill="currentColor" /></Btn>}
        {v("ctrl.prev") && <Btn onClick={prev} title="Previous (P)"><SkipBack size={18} fill="currentColor" /></Btn>}
        {v("ctrl.playPause") && (
          <Btn large primary onClick={togglePlay} title={playing ? "Pause (Space)" : "Play (Space)"}>
            <div style={{ display: "grid", placeItems: "center", width: 22, height: 22 }}>
              <div style={{ gridArea: "1/1", opacity: playing ? 0 : 1, transform: playing ? "scale(0.5) rotate(-90deg)" : "scale(1) rotate(0)", transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)", willChange: "transform, opacity" }}>
                <Play size={22} fill="currentColor" style={{ marginLeft: 2 }} />
              </div>
              <div style={{ gridArea: "1/1", opacity: playing ? 1 : 0, transform: playing ? "scale(1) rotate(0)" : "scale(0.5) rotate(90deg)", transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)", willChange: "transform, opacity" }}>
                <Pause size={22} fill="currentColor" />
              </div>
            </div>
          </Btn>
        )}
        {v("ctrl.next") && <Btn onClick={next} title="Next (N)"><SkipForward size={18} fill="currentColor" /></Btn>}
        {v("ctrl.frameStep") && !playing && (
          <Btn onClick={() => { const vEl = videoRef.current; if (vEl) { try { if (document.fullscreenElement) { void document.exitFullscreen(); } else { void vEl.requestFullscreen(); } } catch { /* ignore */ } } }} title="Next frame (E)">
            <StepForward size={16} />
          </Btn>
        )}
        <Divider />
        {v("ctrl.repeat") && (
          <Btn active={repeat !== 0} onClick={cycleRepeat} title={`Repeat: ${["Off","All","One"][repeat]}`}>
            {repeat === 2 ? <Repeat1 size={17} /> : <Repeat size={17} />}
          </Btn>
        )}
        {v("ctrl.random") && (
          <Btn active={random} onClick={() => { set({ random: !random }); pushOSD(`Random: ${!random ? "On" : "Off"}`); }} title="Random (R)">
            <Shuffle size={17} />
          </Btn>
        )}
      </div>

      {/* ─────────── CENTER: time readout ─────────── */}
      <div className="vlc-control-center-meta flex-1 flex items-center justify-center gap-2 min-w-0 px-3">
        {v("ctrl.time") && (
          <Tooltip label="Toggle elapsed/remaining" kbd="T">
            <button
              type="button"
              onClick={() => set({ showRemaining: !showRemaining })}
              className="vlc-num inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-md transition-colors"
              style={{
                fontSize: 13,
                color: "var(--vlc-text-primary)",
                background: "var(--vlc-bg-sunken)",
                border: "1px solid var(--vlc-border-subtle)",
                minWidth: 180,
                justifyContent: "center",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--vlc-border-normal)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--vlc-border-subtle)"; }}
            >
              <span style={{ color: showRemaining ? "var(--vlc-accent)" : "var(--vlc-text-primary)" }}>
                {showRemaining && duration > 0 ? `-${formatTime(duration - now)}` : formatTime(now)}
              </span>
              <span style={{ color: "var(--vlc-text-disabled)" }}>/</span>
              <span style={{ color: "var(--vlc-text-secondary)" }}>{formatTime(duration)}</span>
            </button>
          </Tooltip>
        )}
      </div>

      {/* ─────────── RIGHT: utility + volume ─────────── */}
      <div className="flex items-center gap-0.5 shrink-0">
        {v("ctrl.teletext") && <Btn title="Teletext"><Type size={17} /></Btn>}
        {v("ctrl.pip") && <Btn
          onClick={() => {
            const vv = videoRef.current as (HTMLVideoElement & { requestPictureInPicture?: () => Promise<PictureInPictureWindow> }) | null;
            if (!vv) return;
            if (document.pictureInPictureElement) document.exitPictureInPicture?.().catch(() => undefined);
            else vv.requestPictureInPicture?.().catch(() => undefined);
          }}
          title="Picture-in-Picture (I)"
        >
          <PictureInPicture2 size={17} />
        </Btn>}
        {v("ctrl.commandPalette") && <Btn onClick={() => set({ commandPaletteOpen: true })} title="Command palette (Ctrl+K)">
          <Command size={17} />
        </Btn>}
        {v("ctrl.effects") && (
          <Btn onClick={() => set({ effectsOpen: !effectsOpen })} title="Extended settings (Ctrl+E)" active={effectsOpen}>
            <SlidersHorizontal size={17} />
          </Btn>
        )}
        {v("ctrl.playlist") && (
          <Btn onClick={() => set({ playlistOpen: !playlistOpen })} title="Playlist (Ctrl+L)" active={playlistOpen}>
            <List size={17} />
          </Btn>
        )}
        {v("ctrl.speed") && (
          <div ref={speedRef} className="relative">
            <Btn onClick={() => setSpeedOpen((o) => !o)} title={`Playback speed: ${speed}x`} active={speed !== 1 || speedOpen}>
              <div className="relative">
                <Gauge size={17} />
                {speed !== 1 && (
                  <span
                    className="absolute -bottom-2 -right-2 vlc-num flex items-center justify-center rounded-full"
                    style={{
                      background: "var(--vlc-accent)",
                      color: "var(--vlc-text-inverse)",
                      border: "2px solid var(--vlc-bg-surface)",
                      fontSize: 9,
                      fontWeight: 800,
                      width: 18,
                      height: 18,
                      transform: "scale(0.8)",
                    }}
                  >
                    {speed}
                  </span>
                )}
              </div>
            </Btn>
            {speedOpen && (
              <div
                role="menu"
                className="vlc-tooltip-enter"
                style={{
                  position: "absolute", bottom: "calc(100% + 12px)", right: 0, zIndex: 60,
                  background: "color-mix(in oklab, var(--vlc-bg-elevated) 90%, transparent)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid var(--vlc-border-normal)",
                  borderRadius: "var(--vlc-radius-md)",
                  padding: 6, minWidth: 140,
                  boxShadow: "var(--vlc-shadow-4)",
                }}
              >
                {SPEEDS.map((sp) => {
                  const isActive = Math.abs(sp - speed) < 0.001;
                  return (
                    <button
                      key={sp}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => setSpeed(sp)}
                      className="vlc-num flex items-center justify-between w-full transition-colors"
                      style={{
                        padding: "6px 10px",
                        fontSize: 12,
                        color: isActive ? "var(--vlc-accent)" : "var(--vlc-text-primary)",
                        background: isActive ? "var(--vlc-accent-dim)" : "transparent",
                        borderRadius: "var(--vlc-radius-sm)",
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--vlc-control-hover)"; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span>{sp}×</span>
                      {sp === 1 && <span style={{ fontSize: 10, color: "var(--vlc-text-ghost)" }}>Normal</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {v("ctrl.fullscreen") && (
          <Btn onClick={() => window.dispatchEvent(new CustomEvent("vlc-toggle-fullscreen"))} title="Fullscreen (F)">
            <div style={{ display: "grid", placeItems: "center", width: 17, height: 17 }}>
              <div style={{ gridArea: "1/1", opacity: fullscreen ? 0 : 1, transform: fullscreen ? "scale(0.5)" : "scale(1)", transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)", willChange: "transform, opacity" }}>
                <Maximize size={17} />
              </div>
              <div style={{ gridArea: "1/1", opacity: fullscreen ? 1 : 0, transform: fullscreen ? "scale(1)" : "scale(0.5)", transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)", willChange: "transform, opacity" }}>
                <Minimize size={17} />
              </div>
            </div>
          </Btn>
        )}
        <Divider />

        {/* Volume cluster */}
        {(v("ctrl.mute") || v("ctrl.volumeSlider")) && (
          <div ref={volRef} className="relative flex items-center">
            {v("ctrl.mute") && (
              <Btn
                onClick={() => { set({ muted: !muted }); pushOSD(muted ? "Unmuted" : "Muted"); }}
                title={muted ? `Unmute (M)` : `Mute (M)`}
              >
                <div style={{ display: "grid", placeItems: "center", width: 18, height: 18 }}>
                  <div style={{ gridArea: "1/1", opacity: muted ? 0 : 1, transform: muted ? "scale(0.5) rotate(-30deg)" : "scale(1) rotate(0)", transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                    <VolIcon size={18} color={volume > 1 ? "var(--vlc-warning)" : undefined} />
                  </div>
                  <div style={{ gridArea: "1/1", opacity: muted ? 1 : 0, transform: muted ? "scale(1) rotate(0)" : "scale(0.5) rotate(30deg)", transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                    <VolumeX size={18} />
                  </div>
                </div>
              </Btn>
            )}
            {v("ctrl.volumeSlider") && (
              <>
                {/* Inline slider on wider viewports */}
                <div className="hidden md:flex items-center pl-1 pr-2 group" style={{ width: 100 }}>
                  <input
                    type="range" min={0} max={2} step={0.01} value={volume}
                    onChange={(e) => onVolChange(parseFloat(e.target.value))}
                    className="vlc-slider w-full"
                    style={{ 
                      background: volTrackBg,
                      height: 4,
                      borderRadius: 2,
                    }}
                    aria-label="Volume"
                    title={volume > 1 ? `Volume boost: ${volPct}%` : `Volume: ${volPct}%`}
                  />
                </div>
                {/* Compact popover on small viewports */}
                <div className="md:hidden">
                  <Btn onClick={() => setVolOpen((o) => !o)} title="Volume" active={volOpen}>
                    <span className="vlc-num text-[10px] font-semibold" style={{ color: volume > 1 ? "var(--vlc-warning)" : "var(--vlc-text-secondary)" }}>{volPct}</span>
                  </Btn>
                  {volOpen && (
                    <div
                      className="vlc-tooltip-enter"
                      style={{
                        position: "absolute", bottom: "calc(100% + 12px)", right: 0, zIndex: 60,
                        background: "color-mix(in oklab, var(--vlc-bg-elevated) 90%, transparent)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid var(--vlc-border-normal)",
                        borderRadius: "var(--vlc-radius-md)",
                        padding: 14, width: 180,
                        boxShadow: "var(--vlc-shadow-4)",
                      }}
                    >
                      <input
                        type="range" min={0} max={2} step={0.01} value={volume}
                        onChange={(e) => onVolChange(parseFloat(e.target.value))}
                        className="vlc-slider w-full"
                        style={{ 
                          background: volTrackBg,
                          height: 6,
                          borderRadius: 3,
                        }}
                        aria-label="Volume"
                      />
                      <div className="mt-3 flex items-center justify-between vlc-num text-[11px] font-medium" style={{ color: "var(--vlc-text-secondary)" }}>
                        <span>0%</span>
                        <span style={{ color: volume > 1 ? "var(--vlc-warning)" : "var(--vlc-text-primary)" }}>{volPct}%</span>
                        <span>200%</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
