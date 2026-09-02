import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";

/**
 * Applies "native app" behaviors to the shell based on the appFeel flags.
 * Each behavior is opt-out (default true) and can be toggled from Preferences
 * → App Feel. Every rule bails on form fields / contenteditable so real input
 * still works, and every rule cleans up on unmount.
 */
export function useAppFeel() {
  const feel = usePlayerStore((s) => s.appFeel);
  const playing = usePlayerStore((s) => s.playing);

  // Reflect flags on <html> so CSS in styles.css can react.
  useEffect(() => {
    const r = document.documentElement;
    r.dataset.feelSelect = feel.disableTextSelect ? "off" : "on";
    r.dataset.feelOverscroll = feel.disableOverscroll ? "off" : "on";
    r.dataset.feelTouchZoom = feel.disableDoubleTapZoom ? "off" : "on";
    r.dataset.feelSpellcheck = feel.disableSpellcheck ? "off" : "on";
    r.spellcheck = !feel.disableSpellcheck;
    r.dataset.feelCallout = feel.disableCallout ? "off" : "on";
    r.dataset.feelStandalone =
      typeof window !== "undefined" &&
      window.matchMedia?.("(display-mode: standalone)")?.matches
        ? "on"
        : "off";
  }, [feel]);

  // ── Right-click / long-press context menu (skip inputs so paste works) ──
  useEffect(() => {
    if (!feel.disableContextMenu) return;
    const isFormField = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable === true
      );
    };
    const onCtx = (e: MouseEvent) => {
      if (isFormField(e.target)) return;
      // Leave the app's own custom context menu (right-click on the video)
      // alone — it dispatches from VideoCanvas and calls preventDefault too.
      e.preventDefault();
    };
    window.addEventListener("contextmenu", onCtx);
    return () => window.removeEventListener("contextmenu", onCtx);
  }, [feel.disableContextMenu]);

  // ── Native drag on images / links (feels like a browser, not an app) ──
  useEffect(() => {
    if (!feel.disableImageDrag) return;
    const onDrag = (e: DragEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("[data-app-allow-drag='1']")) return;
      if (el.tagName === "IMG" || el.tagName === "A") e.preventDefault();
    };
    window.addEventListener("dragstart", onDrag);
    return () => window.removeEventListener("dragstart", onDrag);
  }, [feel.disableImageDrag]);

  // ── Block browser find + view-source + save shortcuts ──
  useEffect(() => {
    if (!feel.disableFindHotkey && !feel.disableSaveHotkey && !feel.disablePrintHotkey) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (feel.disableFindHotkey && ((mod && e.key.toLowerCase() === "f") || e.key === "F3")) {
        e.preventDefault();
      }
      if (feel.disableSaveHotkey && mod && (e.key.toLowerCase() === "s" || e.key.toLowerCase() === "u")) {
        e.preventDefault();
      }
      if (feel.disablePrintHotkey && mod && e.key.toLowerCase() === "p") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true } as EventListenerOptions);
  }, [feel.disableFindHotkey, feel.disableSaveHotkey, feel.disablePrintHotkey]);

  // ── Block Ctrl+wheel pinch-zoom + Ctrl+'+/-/=' page zoom ──
  useEffect(() => {
    if (!feel.disableBrowserZoom) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (["=", "+", "-", "_", "0"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [feel.disableBrowserZoom]);

  // ── Swallow file drops outside registered dropzones so the tab doesn't
  //     navigate away when you accidentally drop a video on the chrome. ──
  useEffect(() => {
    if (!feel.blockPageDragDrop) return;
    const guard = (e: DragEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("[data-app-dropzone='1']")) return;
      e.preventDefault();
    };
    window.addEventListener("dragover", guard);
    window.addEventListener("drop", guard);
    return () => {
      window.removeEventListener("dragover", guard);
      window.removeEventListener("drop", guard);
    };
  }, [feel.blockPageDragDrop]);

  // ── Warn before closing while a video is playing ──
  useEffect(() => {
    if (!feel.confirmOnClose) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!playing) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [feel.confirmOnClose, playing]);
}