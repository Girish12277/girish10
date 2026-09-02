import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { usePlayerStore } from "@/store/playerStore";

/**
 * YouTube/VLC-style auto-hide controller for the top/bottom chrome.
 *
 * Rules:
 *  - Hidden only when the video is playing AND no interaction/hover is active.
 *  - Mouse movement over the video stage arms a 2s idle timer.
 *  - Mouse leaving the stage (e.g. cursor goes off the bottom of the window)
 *    hides chrome immediately.
 *  - Hovering the chrome itself pins it visible (no timer).
 *  - Paused, buffering, or any dialog/context menu open → force visible.
 *  - Silent seek commands are the exception: 10s jumps keep chrome hidden.
 */
export function useChromeAutoHide(enabled: boolean) {
  const playing = usePlayerStore((s) => s.playing);
  const buffering = usePlayerStore((s) => s.buffering);
  const [silentSeekActive, setSilentSeekActive] = useState(false);
  const interacting = usePlayerStore((s) => s.interacting);
  const preferencesOpen = usePlayerStore((s) => s.preferencesOpen);
  const commandPaletteOpen = usePlayerStore((s) => s.commandPaletteOpen);
  const contextOpen = usePlayerStore((s) => s.contextMenu.open);
  const networkOpen = usePlayerStore((s) => s.networkOpen);
  const jumpOpen = usePlayerStore((s) => s.jumpOpen);
  const helpOpen = usePlayerStore((s) => s.helpOpen);
  const playlistOpen = usePlayerStore((s) => s.playlistOpen);
  const effectsOpen = usePlayerStore((s) => s.effectsOpen);
  const codecOpen = usePlayerStore((s) => s.codecOpen);
  const openFeatureId = usePlayerStore((s) => s.openFeatureId);

  const forceVisible =
    !playing || (buffering && !silentSeekActive) || interacting ||
    preferencesOpen || commandPaletteOpen || contextOpen ||
    networkOpen || jumpOpen || helpOpen || playlistOpen ||
    effectsOpen || codecOpen || !!openFeatureId;

  const [hidden, setHidden] = useState(false);
  const timerRef = useRef<number | null>(null);
  const silentSeekTimerRef = useRef<number | null>(null);
  const silentSeekUntilRef = useRef(0);
  const hoveringChromeRef = useRef(false);
  const enabledRef = useRef(enabled);
  const forceVisibleRef = useRef(forceVisible);

  const clear = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    enabledRef.current = enabled;
    forceVisibleRef.current = forceVisible;
  }, [enabled, forceVisible]);

  const hideNow = useCallback(() => {
    clear();
    hoveringChromeRef.current = false;
    if (enabledRef.current && !forceVisibleRef.current) setHidden(true);
  }, []);

  const arm = useCallback(() => {
    clear();
    if (!enabled || forceVisible || hoveringChromeRef.current) return;
    timerRef.current = window.setTimeout(() => setHidden(true), 2000);
  }, [enabled, forceVisible]);

  // Force-visible watchdog: whenever any "keep visible" signal is on, cancel
  // the timer and show chrome. When it flips off (e.g. resume playback),
  // start counting down.
  useEffect(() => {
    if (!enabled) { clear(); setHidden(false); return; }
    if (forceVisible) { clear(); setHidden(false); return; }
    arm();
    return clear;
  }, [enabled, forceVisible, arm]);

  // Programmatic seeks (keyboard arrows, double-tap 10s jumps, media keys)
  // should not "wake" the chrome. Let playback feedback show via OSD, then
  // keep the bars hidden just like YouTube/VLC fullscreen controls.
  useEffect(() => {
    const onHideRequest = () => hideNow();
    const onSilentSeek = () => {
      silentSeekUntilRef.current = Date.now() + 900;
      setSilentSeekActive(true);
      clear();
      hoveringChromeRef.current = false;
      setHidden(true);
      if (silentSeekTimerRef.current !== null) window.clearTimeout(silentSeekTimerRef.current);
      silentSeekTimerRef.current = window.setTimeout(() => {
        setSilentSeekActive(false);
        silentSeekTimerRef.current = null;
      }, 950);
    };
    window.addEventListener("vlc-chrome-hide-now", onHideRequest);
    window.addEventListener("vlc-chrome-silent-seek", onSilentSeek);
    window.addEventListener("blur", onHideRequest);
    return () => {
      window.removeEventListener("vlc-chrome-hide-now", onHideRequest);
      window.removeEventListener("vlc-chrome-silent-seek", onSilentSeek);
      window.removeEventListener("blur", onHideRequest);
      if (silentSeekTimerRef.current !== null) window.clearTimeout(silentSeekTimerRef.current);
    };
  }, [hideNow]);

  const onStageMouseMove = useCallback(() => {
    if (Date.now() < silentSeekUntilRef.current) {
      if (enabledRef.current && !forceVisibleRef.current) setHidden(true);
      return;
    }
    if (hidden) setHidden(false);
    arm();
  }, [hidden, arm]);

  const onStageMouseLeave = useCallback(() => {
    // Cursor exited the video area — YouTube-style immediate hide (unless
    // something is forcing visible, in which case forceVisible wins).
    clear();
    if (enabled && !forceVisible && !hoveringChromeRef.current) setHidden(true);
  }, [enabled, forceVisible]);

  const onAppMouseLeave = useCallback(() => {
    hideNow();
  }, [hideNow]);

  const onChromeMouseEnter = useCallback(() => {
    hoveringChromeRef.current = true;
    clear();
    setHidden(false);
  }, []);

  const onChromeMouseLeave = useCallback((event?: ReactMouseEvent) => {
    hoveringChromeRef.current = false;
    const leftViewport = !event?.relatedTarget || event.clientY <= 0 || event.clientY >= window.innerHeight - 1;
    if (leftViewport) hideNow();
    else arm();
  }, [arm, hideNow]);

  return {
    hidden: enabled && hidden && (!forceVisible || (silentSeekActive && playing)),
    onStageMouseMove,
    onStageMouseLeave,
    onAppMouseLeave,
    onChromeMouseEnter,
    onChromeMouseLeave,
  };
}