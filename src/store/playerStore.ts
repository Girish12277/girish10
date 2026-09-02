import { create } from "zustand";
import type { ABLoop, AspectRatio, CompressorState, EQState, OSDMessage, PlaylistItem, RepeatMode, SyncState, VideoFilters } from "@/types/player.types";
import type { CursorStyleId } from "@/utils/cursorStyles";

export interface AppFeelState {
  disableTextSelect: boolean;
  disableContextMenu: boolean;
  disableImageDrag: boolean;
  disableOverscroll: boolean;
  disableDoubleTapZoom: boolean;
  disableBrowserZoom: boolean;
  disableFindHotkey: boolean;
  disablePrintHotkey: boolean;
  disableSaveHotkey: boolean;
  disableSpellcheck: boolean;
  disableCallout: boolean;
  blockPageDragDrop: boolean;
  confirmOnClose: boolean;
}

export const DEFAULT_APP_FEEL: AppFeelState = {
  disableTextSelect: true,
  disableContextMenu: true,
  disableImageDrag: true,
  disableOverscroll: true,
  disableDoubleTapZoom: true,
  disableBrowserZoom: true,
  disableFindHotkey: false,
  disablePrintHotkey: true,
  disableSaveHotkey: true,
  disableSpellcheck: true,
  disableCallout: true,
  blockPageDragDrop: true,
  confirmOnClose: false,
};

const DEMO_PLAYLIST: PlaylistItem[] = [];

/** A single background-music entry. `local` sources are object URLs owned by the engine. */
export interface AmbientTrack {
  id: string;
  title: string;
  src: string;
  local: boolean;
}

export interface AmbientState {
  tracks: AmbientTrack[];
  index: number;
  playing: boolean;
  volume: number;
  /** "off" | "all" | "one" */
  repeat: "off" | "all" | "one";
  shuffle: boolean;
}

export const DEFAULT_AMBIENT: AmbientState = {
  tracks: [],
  index: 0,
  playing: false,
  volume: 0.5,
  repeat: "all",
  shuffle: false,
};

export interface A11yState {
  highContrast: boolean;
  dyslexiaFont: boolean;
  focusRingIntensity: number; // 0..3
  subtitleSize: number; // px
  subtitleBackground: number; // 0..1 opacity
  subtitleOutline: boolean;
}

export interface LayoutPreset {
  name: string;
  density: "compact" | "cozy" | "comfortable";
  chromePosition: "top" | "bottom" | "floating";
  uiVisibility: Record<string, boolean>;
  controlOrder: string[];
}

const DEFAULT_A11Y: A11yState = {
  highContrast: false,
  dyslexiaFont: false,
  focusRingIntensity: 1,
  subtitleSize: 18,
  subtitleBackground: 0.4,
  subtitleOutline: true,
};

const DEFAULT_CONTROL_ORDER: string[] = [
  "ctrl.stop", "ctrl.prev", "ctrl.playPause", "ctrl.next",
  "ctrl.repeat", "ctrl.random", "ctrl.time", "ctrl.teletext",
  "ctrl.fullscreen", "ctrl.effects", "ctrl.frameStep", "ctrl.playlist",
  "ctrl.speed", "ctrl.mute", "ctrl.volumeSlider",
];

const EQ_PRESETS: Record<string, number[]> = {
  Flat: [0,0,0,0,0,0,0,0,0,0],
  Classical: [0,0,0,0,0,0,-4,-4,-4,-6],
  Club: [0,0,4,3,3,3,2,0,0,0],
  Dance: [6,4,1,0,0,-3,-4,-4,0,0],
  "Full Bass": [-8,6,6,4,1,-2,-5,-7,-8,-8],
  "Full Bass & Treble": [5,4,0,-5,-3,1,5,7,8,8],
  "Full Treble": [-9,-9,-9,-4,1,6,9,9,9,10],
  Headphones: [4,7,3,-2,-1,1,3,6,8,9],
  "Large Hall": [7,6,3,3,0,-3,-3,-3,0,0],
  Live: [-3,0,2,3,3,3,2,1,1,1],
  Party: [4,4,0,0,0,0,0,0,4,4],
  Pop: [-1,3,4,5,3,0,-1,-1,-1,-1],
  Reggae: [0,0,0,-3,0,4,4,0,0,0],
  Rock: [5,3,-3,-5,-2,2,5,7,8,8],
  Ska: [-2,-3,-3,0,2,4,5,6,7,7],
  Soft: [3,1,0,-1,0,2,5,6,7,8],
  "Soft Rock": [3,3,2,0,-2,-3,-2,0,2,5],
  Techno: [5,4,0,-3,-3,0,5,6,6,5],
  Custom: [0,0,0,0,0,0,0,0,0,0],
};

interface State {
  // Playback
  playing: boolean;
  duration: number;
  buffered: number;
  buffering: boolean;
  volume: number; // 0..2
  muted: boolean;
  speed: number;
  repeat: RepeatMode;
  random: boolean;
  showRemaining: boolean;

  // Chrome interaction — true while user is actively scrubbing / interacting
  // with a control that should keep chrome visible (e.g. seek drag).
  interacting: boolean;

  // Playlist
  playlist: PlaylistItem[];
  currentIndex: number;

  // UI
  playlistOpen: boolean;
  effectsOpen: boolean;
  preferencesOpen: boolean;
  codecOpen: boolean;
  helpOpen: boolean;
  networkOpen: boolean;
  jumpOpen: boolean;
  contextMenu: { x: number; y: number; open: boolean };
  fullscreen: boolean;
  aspectRatio: AspectRatio;

  // Effects
  filters: VideoFilters;
  eq: EQState;
  comp: CompressorState;
  sync: SyncState;
  /** Centre-channel cancellation ("karaoke") in the audio graph. */
  karaoke: boolean;

  // A-B loop
  abLoop: ABLoop;

  // OSD
  osd: OSDMessage[];

  // Theme
  themeName: string;
  themeVars: Record<string, string>;
  customVars: Record<string, string>;

  // Hotkeys
  hotkeys: Record<string, string>;

  // UI customization (visibility toggles for every registered element)
  uiVisibility: Record<string, boolean>;

  // Active skin (catalog id, see src/skins/registry.ts)
  activeSkinId: string;

  // God Mode customization picks per category + free token overrides
  godPicks: Record<string, string>;
  godCustom: Record<string, string>;

  // Bookmarks per source (key = base64 src hash)
  bookmarks: Record<string, number[]>;

  // External subtitle tracks per source (object URLs to VTT/SRT-converted blobs)
  externalSubs: Record<string, { label: string; url: string }[]>;

  // Command palette
  commandPaletteOpen: boolean;

  // Phase 4 — Customization Surface (additive, UI-only)
  density: "compact" | "cozy" | "comfortable";
  chromePosition: "top" | "bottom" | "floating";
  controlOrder: string[];
  layoutPresets: Record<string, LayoutPreset>;
  a11y: A11yState;
  /** Motion scale preset (Phase 7D). 0 = none, 0.5 = calm, 1 = standard, 1.4 = snappy. */
  motionScale: number;
  /** Light/dark theme — applied to <html data-theme>. "system" follows OS. */
  themeMode: "dark" | "light" | "system";

  /** Global cursor preference. Auto-hide still forces `none` while video chrome is hidden. */
  cursorStyle: CursorStyleId;

  /** Free-form user CSS injected after all skin/godmode rules. Highest precedence. */
  customCSS: string;

  /** "Native app feel" toggles — see useAppFeel(). */
  appFeel: AppFeelState;

  // Open mini-app feature id (null = none)
  openFeatureId: string | null;

  /** Background / study music popup. */
  ambientOpen: boolean;
  /** Background / study music playback state (survives closing the popup). */
  ambient: AmbientState;

  // Setters
  set: (p: Partial<State>) => void;
  setAmbient: (p: Partial<AmbientState>) => void;
  /** Unlock localStorage and apply persisted values (call after hydration). */
  hydratePersisted: () => void;
  pushOSD: (text: string) => void;
  loadIndex: (i: number) => void;
  next: () => void;
  prev: () => void;
  cycleRepeat: () => void;
  cycleAB: (current: number) => void;
  setEQBand: (i: number, v: number) => void;
  setEQPreset: (name: string) => void;
  applyTheme: (vars: Record<string, string>, name?: string) => void;
  addBookmark: (srcKey: string, t: number) => void;
  removeBookmark: (srcKey: string, t: number) => void;
}

let osdCounter = 0;

/**
 * Persisted state is deliberately NOT read while the store module is first
 * evaluated: the server renders defaults, so reading localStorage at import
 * time made the very first client render disagree with the SSR HTML
 * (hydration mismatch). Storage is unlocked by `hydratePersisted()`, which
 * AppLayout calls from an effect — i.e. after hydration has committed.
 */
let storageEnabled = false;

const loadJSON = <T,>(k: string, fallback: T): T => {
  if (!storageEnabled || typeof localStorage === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : fallback; } catch { return fallback; }
};
const saveJSON = (k: string, v: unknown) => {
  // Never write before hydration — the pre-hydration state is defaults, and
  // persisting it would erase the user's saved settings.
  if (!storageEnabled) return;
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {/*noop*/}
};

const DEFAULT_HOTKEYS: Record<string, string> = {
  playPause: "Space", stop: "KeyS", next: "KeyN", prev: "KeyP",
  fullscreen: "KeyF", mute: "KeyM", frameAdvance: "KeyE",
  random: "KeyR", abLoop: "KeyL", aspect: "KeyA",
  seekFwd: "ArrowRight", seekBack: "ArrowLeft",
  volUp: "ArrowUp", volDown: "ArrowDown",
  speedUp: "BracketRight", speedDown: "BracketLeft", speedReset: "Equal",
  subDelayPlus: "KeyH", subDelayMinus: "KeyG",
  audDelayPlus: "KeyK", audDelayMinus: "KeyJ",
  toggleTime: "KeyT",
  playlist: "Ctrl+KeyL", effects: "Ctrl+KeyE", prefs: "Ctrl+KeyP",
  codec: "Ctrl+KeyJ", openFile: "Ctrl+KeyO", openNet: "Ctrl+KeyN",
  jumpTime: "Ctrl+KeyT", screenshot: "Ctrl+Alt+KeyS", help: "Slash",
};

/**
 * Every slice that survives a reload. Evaluated twice: once at store creation
 * (storage locked → pure defaults, matching SSR) and once from
 * `hydratePersisted()` after mount (storage unlocked → real values).
 */
const persistedSlice = () => ({
  volume: loadJSON("vlc-player-volume", 0.8),
  muted: loadJSON("vlc-player-muted", false),
  repeat: loadJSON("vlc-player-repeat", 0 as RepeatMode),
  random: loadJSON("vlc-player-random", false),
  playlist: ((): PlaylistItem[] => {
    const stored = loadJSON<PlaylistItem[]>("vlc-player-playlist", DEMO_PLAYLIST);
    // Drop legacy demo entries AND any blob:/object URLs (always invalid after reload)
    return stored.filter((it) =>
      !/commondatastorage\.googleapis\.com\/gtv-videos-bucket/.test(it.src) &&
      !it.src.startsWith("blob:")
    );
  })(),
  eq: loadJSON("vlc-player-eq", { enabled: false, preamp: 0, bands: EQ_PRESETS.Flat, preset: "Flat" }),
  themeName: loadJSON("vlc-theme-name", "Classic"),
  themeVars: loadJSON("vlc-theme-vars", {} as Record<string, string>),
  customVars: loadJSON("vlc-custom-theme-vars", {} as Record<string, string>),
  hotkeys: { ...DEFAULT_HOTKEYS, ...loadJSON("vlc-hotkeys", {} as Record<string, string>) },
  uiVisibility: loadJSON("vlc-ui-visibility", {} as Record<string, boolean>),
  activeSkinId: loadJSON("vlc-active-skin", "vlc-classic"),
  godPicks: loadJSON("vlc-god-picks", {} as Record<string, string>),
  godCustom: loadJSON("vlc-god-custom", {} as Record<string, string>),
  bookmarks: loadJSON("vlc-bookmarks", {} as Record<string, number[]>),
  density: loadJSON<"compact" | "cozy" | "comfortable">("vlc-density", "cozy"),
  chromePosition: loadJSON<"top" | "bottom" | "floating">("vlc-chrome-position", "bottom"),
  controlOrder: loadJSON<string[]>("vlc-control-order", DEFAULT_CONTROL_ORDER),
  layoutPresets: loadJSON<Record<string, LayoutPreset>>("vlc-layout-presets", {}),
  a11y: { ...DEFAULT_A11Y, ...loadJSON<Partial<A11yState>>("vlc-a11y", {}) },
  motionScale: loadJSON<number>("vlc-motion-scale", 1),
  themeMode: loadJSON<"dark" | "light" | "system">("vlc-theme-mode", "dark"),
  cursorStyle: loadJSON<CursorStyleId>("vlc-cursor-style", "auto"),
  customCSS: loadJSON<string>("vlc-custom-css", ""),
  appFeel: { ...DEFAULT_APP_FEEL, ...loadJSON<Partial<AppFeelState>>("vlc-app-feel", {}) },
});

export const usePlayerStore = create<State>((set, get) => ({
  playing: false,
  duration: 0,
  buffered: 0,
  buffering: false,
  speed: 1,
  showRemaining: false,

  interacting: false,

  ...persistedSlice(),
  currentIndex: 0,

  playlistOpen: false,
  effectsOpen: false,
  preferencesOpen: false,
  codecOpen: false,
  helpOpen: false,
  networkOpen: false,
  jumpOpen: false,
  contextMenu: { x: 0, y: 0, open: false },
  fullscreen: false,
  aspectRatio: "default",

  filters: { enabled: false, hue: 0, saturation: 1, contrast: 1, brightness: 1, gamma: 1, rotate: 0, zoom: 100, flipH: false, flipV: false },
  comp: { enabled: false, threshold: -24, knee: 30, ratio: 12, attack: 0.003, release: 0.25, preGain: 0, postGain: 0 },
  sync: { audioDelay: 0, subtitleDelay: 0 },
  karaoke: false,

  abLoop: { a: null, b: null },
  osd: [],

  externalSubs: {},
  commandPaletteOpen: false,
  openFeatureId: null,
  ambientOpen: false,

  set: (p) => set(p),
  ambient: DEFAULT_AMBIENT,
  setAmbient: (p) => set((s) => ({ ambient: { ...s.ambient, ...p } })),
  hydratePersisted: () => {
    if (storageEnabled) return;
    storageEnabled = true;
    set(persistedSlice());
  },
  pushOSD: (text) => {
    const id = ++osdCounter;
    set((s) => ({ osd: [...s.osd, { id, text, ts: Date.now() }] }));
    setTimeout(() => set((s) => ({ osd: s.osd.filter((m) => m.id !== id) })), 1500);
  },
  loadIndex: (i) => {
    const s = get();
    if (i < 0 || i >= s.playlist.length) return;
    set({ currentIndex: i, abLoop: { a: null, b: null } });
  },
  next: () => {
    const s = get();
    if (s.random) {
      const i = Math.floor(Math.random() * s.playlist.length);
      set({ currentIndex: i });
    } else {
      const ni = s.currentIndex + 1;
      if (ni >= s.playlist.length) {
        if (s.repeat === 1) set({ currentIndex: 0 });
      } else set({ currentIndex: ni });
    }
  },
  prev: () => {
    const s = get();
    const ni = s.currentIndex - 1;
    if (ni < 0) set({ currentIndex: s.playlist.length - 1 });
    else set({ currentIndex: ni });
  },
  cycleRepeat: () => {
    const r = get().repeat;
    const next: RepeatMode = ((r + 1) % 3) as RepeatMode;
    set({ repeat: next });
    saveJSON("vlc-player-repeat", next);
    get().pushOSD(`Repeat: ${["Off", "All", "One"][next]}`);
  },
  cycleAB: (current) => {
    const ab = get().abLoop;
    if (ab.a === null) { set({ abLoop: { a: current, b: null } }); get().pushOSD(`A-B loop: A=${current.toFixed(1)}s`); }
    else if (ab.b === null) { set({ abLoop: { a: ab.a, b: current } }); get().pushOSD(`A-B loop: B=${current.toFixed(1)}s (looping)`); }
    else { set({ abLoop: { a: null, b: null } }); get().pushOSD("A-B loop: cleared"); }
  },
  setEQBand: (i, v) => {
    const eq = { ...get().eq, bands: get().eq.bands.map((b, idx) => idx === i ? v : b), preset: "Custom" };
    set({ eq });
    saveJSON("vlc-player-eq", eq);
  },
  setEQPreset: (name) => {
    const bands = EQ_PRESETS[name] ?? EQ_PRESETS.Flat;
    const eq = { ...get().eq, bands: [...bands], preset: name };
    set({ eq });
    saveJSON("vlc-player-eq", eq);
  },
  applyTheme: (vars, name) => {
    Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    const finalName = name ?? get().themeName;
    const patch: Partial<State> = { themeVars: vars, themeName: finalName };
    if (finalName === "Custom") {
      patch.customVars = vars;
      saveJSON("vlc-custom-theme-vars", vars);
    }
    set(patch);
    saveJSON("vlc-theme-vars", vars);
    if (name) saveJSON("vlc-theme-name", name);
  },
  addBookmark: (srcKey, t) => {
    const cur = get().bookmarks[srcKey] ?? [];
    if (cur.some((x) => Math.abs(x - t) < 0.5)) return;
    const next = { ...get().bookmarks, [srcKey]: [...cur, t].sort((a, b) => a - b) };
    set({ bookmarks: next });
    saveJSON("vlc-bookmarks", next);
    get().pushOSD(`Bookmark added @ ${t.toFixed(1)}s`);
  },
  removeBookmark: (srcKey, t) => {
    const cur = get().bookmarks[srcKey] ?? [];
    const next = { ...get().bookmarks, [srcKey]: cur.filter((x) => Math.abs(x - t) > 0.001) };
    set({ bookmarks: next });
    saveJSON("vlc-bookmarks", next);
  },
}));

// Persist subscriptions efficiently (Phase 14)
if (typeof window !== "undefined") {
  let prev = usePlayerStore.getState();
  usePlayerStore.subscribe((s) => {
    if (s.volume !== prev.volume) saveJSON("vlc-player-volume", s.volume);
    if (s.muted !== prev.muted) saveJSON("vlc-player-muted", s.muted);
    if (s.random !== prev.random) saveJSON("vlc-player-random", s.random);
    if (s.playlist !== prev.playlist) saveJSON("vlc-player-playlist", s.playlist.filter((it) => !it.src.startsWith("blob:")));
    if (s.hotkeys !== prev.hotkeys) saveJSON("vlc-hotkeys", s.hotkeys);
    if (s.uiVisibility !== prev.uiVisibility) saveJSON("vlc-ui-visibility", s.uiVisibility);
    if (s.activeSkinId !== prev.activeSkinId) saveJSON("vlc-active-skin", s.activeSkinId);
    if (s.godPicks !== prev.godPicks) saveJSON("vlc-god-picks", s.godPicks);
    if (s.godCustom !== prev.godCustom) saveJSON("vlc-god-custom", s.godCustom);
    if (s.density !== prev.density) saveJSON("vlc-density", s.density);
    if (s.chromePosition !== prev.chromePosition) saveJSON("vlc-chrome-position", s.chromePosition);
    if (s.controlOrder !== prev.controlOrder) saveJSON("vlc-control-order", s.controlOrder);
    if (s.layoutPresets !== prev.layoutPresets) saveJSON("vlc-layout-presets", s.layoutPresets);
    if (s.a11y !== prev.a11y) saveJSON("vlc-a11y", s.a11y);
    if (s.motionScale !== prev.motionScale) saveJSON("vlc-motion-scale", s.motionScale);
    if (s.themeMode !== prev.themeMode) saveJSON("vlc-theme-mode", s.themeMode);
    if (s.cursorStyle !== prev.cursorStyle) saveJSON("vlc-cursor-style", s.cursorStyle);
    if (s.customCSS !== prev.customCSS) saveJSON("vlc-custom-css", s.customCSS);
    if (s.appFeel !== prev.appFeel) saveJSON("vlc-app-feel", s.appFeel);

    if (s.customCSS !== prev.customCSS) {
      let userTag = document.getElementById("vlc-user-css") as HTMLStyleElement | null;
      if (!userTag) {
        userTag = document.createElement("style");
        userTag.id = "vlc-user-css";
        document.head.appendChild(userTag);
      }
      userTag.textContent = s.customCSS ?? "";
    }

    if (s.density !== prev.density || s.a11y !== prev.a11y || s.motionScale !== prev.motionScale || s.themeMode !== prev.themeMode) {
      const root = document.documentElement;
      if (s.density !== prev.density) root.dataset.density = s.density;
      if (s.a11y !== prev.a11y) {
        root.dataset.contrast = s.a11y.highContrast ? "high" : "normal";
        root.dataset.dyslexia = s.a11y.dyslexiaFont ? "on" : "off";
        root.style.setProperty("--vlc-focus-ring-intensity", String(s.a11y.focusRingIntensity));
        root.style.setProperty("--vlc-subtitle-size", `${s.a11y.subtitleSize}px`);
      }
      if (s.motionScale !== prev.motionScale) root.style.setProperty("--vlc-motion-scale", String(s.motionScale));
      if (s.themeMode !== prev.themeMode) {
        if (s.themeMode === "system") delete root.dataset.theme;
        else root.dataset.theme = s.themeMode;
      }
    }
    
    prev = s;
  });
}

export { EQ_PRESETS };
