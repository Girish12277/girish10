import { lazy, Suspense, useEffect, useState } from "react";
import { TitleBar } from "./TitleBar";
import { MenuBar } from "./MenuBar";
import { VideoCanvas } from "@/components/video/VideoCanvas";
import { OSDDisplay } from "@/components/video/OSDDisplay";
import { SeekBar } from "@/components/seekbar/SeekBar";
import { ControlBar } from "@/components/controls/ControlBar";
import { DockRail } from "@/components/layout/DockRail";
import { videoRef } from "@/hooks/useVideoPlayer";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useChromeAutoHide } from "@/hooks/useChromeAutoHide";
import { usePlayerStore } from "@/store/playerStore";
import { isVisible } from "@/utils/uiCustomization";
import { SkinProvider } from "@/skins/SkinProvider";
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { cursorCssFor } from "@/utils/cursorStyles";

// ── Lazy panels: none of these are needed at first paint. Each chunk loads
// on demand when the user opens the panel, keeping the initial bundle lean.
const PlaylistPanel = lazy(() => import("@/components/playlist/PlaylistPanel").then((m) => ({ default: m.PlaylistPanel })));
const EffectsPanel = lazy(() => import("@/components/panels/EffectsPanel").then((m) => ({ default: m.EffectsPanel })));
const PreferencesPanel = lazy(() => import("@/components/panels/PreferencesPanel").then((m) => ({ default: m.PreferencesPanel })));
const CodecInfoPanel = lazy(() => import("@/components/panels/CodecInfoPanel").then((m) => ({ default: m.CodecInfoPanel })));
const Dialogs = lazy(() => import("@/components/dialogs/Dialogs").then((m) => ({ default: m.AllDialogs })));
const CommandPalette = lazy(() => import("@/components/dialogs/CommandPalette").then((m) => ({ default: m.CommandPalette })));
const FeatureHost = lazy(() => import("@/features/FeatureHost").then((m) => ({ default: m.FeatureHost })));
const StudyHub = lazy(() => import("@/components/study/StudyHub").then((m) => ({ default: m.StudyHub })));
// Headless engines: always live, but pulled out of the initial bundle so first
// paint doesn't pay for the study timer or the audio graph.
const StudyEngine = lazy(() => import("@/components/study/StudyEngine").then((m) => ({ default: m.StudyEngine })));
const AmbientAudioEngine = lazy(() => import("@/components/music/AmbientMusic").then((m) => ({ default: m.AmbientAudioEngine })));
import { useAppFeel } from "@/hooks/useAppFeel";
import { PanelErrorBoundary } from "@/components/system/PanelErrorBoundary";
import { useAVSync } from "@/hooks/useAVSync";
import { attachSubtitleFile } from "@/utils/subtitles";

const AmbientMusic = lazy(() => import("@/components/music/AmbientMusic").then((m) => ({ default: m.AmbientMusic })));


export function AppLayout() {
  useKeyboardShortcuts();
  useAppFeel();
  useAVSync();
  const themeVars = usePlayerStore((s) => s.themeVars);
  const fullscreen = usePlayerStore((s) => s.fullscreen);
  const set = usePlayerStore((s) => s.set);
  const [updateReady, setUpdateReady] = useState(false);

  // Lazy-panel open state — drives conditional mounting so chunks load on demand
  const playlistOpen = usePlayerStore((s) => s.playlistOpen);
  const effectsOpen = usePlayerStore((s) => s.effectsOpen);
  const preferencesOpen = usePlayerStore((s) => s.preferencesOpen);
  const codecOpen = usePlayerStore((s) => s.codecOpen);
  const networkOpen = usePlayerStore((s) => s.networkOpen);
  const jumpOpen = usePlayerStore((s) => s.jumpOpen);
  const helpOpen = usePlayerStore((s) => s.helpOpen);
  const commandPaletteOpen = usePlayerStore((s) => s.commandPaletteOpen);
  const openFeatureId = usePlayerStore((s) => s.openFeatureId);
  const ambientOpen = usePlayerStore((s) => s.ambientOpen);
  const anyDialogOpen = networkOpen || jumpOpen || helpOpen;

  // Persisted settings are applied only after hydration, so the first client
  // render matches the SSR markup exactly.
  useEffect(() => { usePlayerStore.getState().hydratePersisted(); }, []);

  useEffect(() => {
    Object.entries(themeVars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [themeVars]);

  useEffect(() => {
    const onUpdate = () => {
      setUpdateReady(true);
      usePlayerStore.getState().pushOSD("Update downloaded — restart ready");
    };
    window.addEventListener("vlc-update-ready", onUpdate);
    return () => window.removeEventListener("vlc-update-ready", onUpdate);
  }, []);

  const attachSubtitle = async (file: File) => {
    const v = videoRef.current;
    if (!v) { usePlayerStore.getState().pushOSD("Load a video first to attach subtitles"); return; }
    const label = await attachSubtitleFile(v, file);
    usePlayerStore.getState().pushOSD(`Subtitle attached: ${label}`);
  };

  const addFiles = (files: File[]) => {
    if (!files.length) return;
    const subs = files.filter((f) => /\.(srt|vtt)$/i.test(f.name));
    const media = files.filter((f) => !/\.(srt|vtt)$/i.test(f.name));
    subs.forEach((f) => { void attachSubtitle(f); });
    if (!media.length) return;
    const cur = usePlayerStore.getState().playlist;
    const items = media.map((f) => ({ id: `${Date.now()}-${f.name}-${f.size}`, title: f.name, src: URL.createObjectURL(f) }));
    usePlayerStore.getState().set({ playlist: [...cur, ...items], currentIndex: cur.length });
    usePlayerStore.getState().pushOSD(`Opened ${media.length} file${media.length === 1 ? "" : "s"}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shortcut = params.get("shortcut");
    if (shortcut === "open-file") requestAnimationFrame(() => document.getElementById("vlc-file-input")?.click());
    if (shortcut === "network-stream") set({ networkOpen: true });
    if (shortcut === "customize") set({ preferencesOpen: true });
    if (shortcut === "scicalc") set({ openFeatureId: "scicalc" });

    const launchQueue = (window as Window & {
      launchQueue?: { setConsumer: (consumer: (launchParams: { files?: Array<{ getFile: () => Promise<File> }> }) => void) => void };
    }).launchQueue;
    launchQueue?.setConsumer((launchParams) => {
      if (!launchParams.files?.length) return;
      Promise.all(launchParams.files.map((h) => h.getFile())).then(addFiles).catch(() => undefined);
    });
  }, [set]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    e.currentTarget.value = "";
  };

  useEffect(() => {
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer?.files ?? []);
      addFiles(files);
    };
    const onDragOver = (e: DragEvent) => e.preventDefault();
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragover", onDragOver);
    return () => { window.removeEventListener("drop", onDrop); window.removeEventListener("dragover", onDragOver); };
  }, []);

  const chromePosition = usePlayerStore((s) => s.chromePosition);
  const overlayChrome = fullscreen || chromePosition === "floating";

  // YouTube-style auto-hide: only active when chrome is overlaying the video
  // (fullscreen or floating skin). In classic docked mode the bars stay
  // present so the app frame doesn't jump.
  const autoHide = useChromeAutoHide(overlayChrome);
  const hideChrome = autoHide.hidden;
  const preferredCursor = usePlayerStore((s) => s.cursorStyle);
  const cursorStyle = hideChrome ? "none" : cursorCssFor(preferredCursor);

  const vis = usePlayerStore((s) => s.uiVisibility);
  const showTitle = isVisible(vis, "chrome.titleBar");
  const showMenu = isVisible(vis, "chrome.menuBar");
  const showSeek = isVisible(vis, "chrome.seekBar");
  const showCtrl = isVisible(vis, "chrome.controlBar");

  const topChrome = (
    <div
      onMouseEnter={autoHide.onChromeMouseEnter}
      onMouseLeave={autoHide.onChromeMouseLeave}
      style={{
        position: overlayChrome ? "absolute" : "relative",
        top: overlayChrome ? 0 : undefined,
        left: 0,
        right: 0,
        zIndex: 40,
        background: overlayChrome ? "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0))" : undefined,
        transform: hideChrome ? "translateY(-100%)" : "translateY(0)",
        opacity: hideChrome ? 0 : 1,
        transition: "transform 220ms ease, opacity 180ms ease",
        pointerEvents: hideChrome ? "none" : "auto",
      }}
    >
      {showTitle && <TitleBar />}
      {showMenu && <MenuBar />}
    </div>
  );

  const bottomChrome = (
    <div
      onMouseEnter={autoHide.onChromeMouseEnter}
      onMouseLeave={autoHide.onChromeMouseLeave}
      style={{
        position: overlayChrome ? "absolute" : "relative",
        bottom: overlayChrome ? 0 : undefined,
        left: 0,
        right: 0,
        zIndex: 40,
        background: overlayChrome ? "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))" : undefined,
        paddingTop: overlayChrome ? 24 : 0,
        transform: hideChrome ? "translateY(100%)" : "translateY(0)",
        opacity: hideChrome ? 0 : 1,
        transition: "transform 220ms ease, opacity 180ms ease",
        pointerEvents: hideChrome ? "none" : "auto",
      }}
    >
      {showSeek && <SeekBar />}
      {showCtrl && <ControlBar />}
    </div>
  );

  return (
    <SkinProvider>
      <TooltipProvider delayDuration={250} skipDelayDuration={0}>
        <div className="vlc-app-entrance flex flex-col h-screen w-screen relative" onMouseLeave={autoHide.onAppMouseLeave} style={{ background: "var(--vlc-bg-base)", cursor: cursorStyle }}>
          <a href="#vlc-main-stage" className="sr-only focus:not-sr-only focus:absolute focus:p-3 focus:font-bold focus:z-[9999]" style={{ top: 12, left: 12, background: "var(--vlc-bg-elevated)", color: "var(--vlc-accent)", borderRadius: "var(--vlc-radius-md)", outline: "2px solid var(--vlc-accent)", outlineOffset: 2 }}>
            Skip to main content
          </a>
          <input id="vlc-file-input" type="file" accept="video/*,audio/*,.srt,.vtt" multiple onChange={onFile} style={{ display: "none" }} />
          <input
            id="vlc-sub-input"
            type="file"
            accept=".srt,.vtt"
            multiple
            style={{ display: "none" }}
            onChange={(e) => { Array.from(e.target.files ?? []).forEach((f) => { void attachSubtitle(f); }); e.currentTarget.value = ""; }}
          />

          {!overlayChrome && topChrome}

          <div
            id="vlc-main-stage"
            tabIndex={-1}
            className="relative flex-1 flex flex-col min-h-0 focus:outline-none"
            onMouseMove={autoHide.onStageMouseMove}
            onMouseLeave={autoHide.onStageMouseLeave}
          >
            <VideoCanvas />
            <OSDDisplay />
          </div>

          {!overlayChrome && bottomChrome}

          {overlayChrome && topChrome}
          {overlayChrome && bottomChrome}

          <PanelErrorBoundary name="App panels">
            <Suspense fallback={null}>
              {playlistOpen && <PlaylistPanel />}
              {effectsOpen && <EffectsPanel />}
              {preferencesOpen && <PreferencesPanel />}
              {codecOpen && <CodecInfoPanel />}
              {anyDialogOpen && <Dialogs />}
              {commandPaletteOpen && <CommandPalette />}
              {openFeatureId && <FeatureHost />}
              <StudyHub />
              {ambientOpen && <AmbientMusic />}
            </Suspense>
          </PanelErrorBoundary>
          <Suspense fallback={null}>
            <StudyEngine />
            <AmbientAudioEngine />
          </Suspense>
          <DockRail />
          <NativeContextMenu />
          {updateReady && <UpdateToast onApply={() => window.dispatchEvent(new CustomEvent("vlc-apply-update"))} onDismiss={() => setUpdateReady(false)} />}
        </div>
      </TooltipProvider>
    </SkinProvider>
  );
}

function UpdateToast({ onApply, onDismiss }: { onApply: () => void; onDismiss: () => void }) {
  return (
    <div data-vlc-region="panel" className="fixed right-4 bottom-4 z-[90] p-3" style={{ width: 280, background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-normal)", borderRadius: "var(--vlc-radius-md)", boxShadow: "var(--vlc-shadow-popup)", color: "var(--vlc-text-primary)" }}>
      <div className="text-[13px] font-semibold">Update ready</div>
      <div className="mt-1 text-[11px]" style={{ color: "var(--vlc-text-secondary)" }}>A new app version was downloaded in the background.</div>
      <div className="mt-3 flex justify-end gap-2">
        <button onClick={onDismiss} className="px-2 py-1 text-[11px]" style={{ color: "var(--vlc-text-secondary)" }}>Later</button>
        <button onClick={onApply} className="px-2 py-1 text-[11px] rounded" style={{ background: "var(--vlc-accent)", color: "var(--vlc-bg-base)", fontWeight: 700 }}>Restart</button>
      </div>
    </div>
  );
}

function NativeContextMenu() {
  const contextMenu = usePlayerStore((s) => s.contextMenu);
  const set = usePlayerStore((s) => s.set);
  const pushOSD = usePlayerStore((s) => s.pushOSD);

  useEffect(() => {
    if (!contextMenu.open) return;
    const close = () => set({ contextMenu: { ...usePlayerStore.getState().contextMenu, open: false } });
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", close);
    };
  }, [contextMenu.open, set]);

  if (!contextMenu.open) return null;
  const installable = "BeforeInstallPromptEvent" in window || window.matchMedia("(display-mode: standalone)").matches;
  return (
    <div
      data-vlc-region="panel"
      className="fixed z-[80] min-w-56 overflow-hidden"
      style={{ left: contextMenu.x, top: contextMenu.y, background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-normal)", borderRadius: "var(--vlc-radius-md)", boxShadow: "var(--vlc-shadow-popup)", color: "var(--vlc-text-primary)" }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <CtxItem label="Open with VLC Web Player" onClick={() => { document.getElementById("vlc-file-input")?.click(); set({ contextMenu: { ...contextMenu, open: false } }); }} />
      <CtxItem label="Open Network Stream…" onClick={() => set({ networkOpen: true, contextMenu: { ...contextMenu, open: false } })} />
      <CtxItem label="Skins / God Mode…" onClick={() => set({ preferencesOpen: true, contextMenu: { ...contextMenu, open: false } })} />
      <div style={{ height: 1, background: "var(--vlc-border-subtle)", margin: "4px 0" }} />
      <CtxItem label={installable ? "Installed PWA Ready" : "Install as Desktop App"} onClick={() => pushOSD("Use browser Install App to add VLC Web Player to desktop")} />
    </div>
  );
}

function CtxItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-3 py-2 text-left text-[12px]"
      style={{ color: "var(--vlc-text-primary)", background: "transparent" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--vlc-control-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {label}
    </button>
  );
}

