import { useCallback, useEffect, useMemo, useState } from "react";
import { MenuDropdown, type MenuItemDef } from "@/components/menubar/MenuDropdown";
import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { isVisible } from "@/utils/uiCustomization";
import { FEATURES } from "@/features/registry";
import { useStudyStore } from "@/store/studyStore";
import { useMediaTracks, selectTextTrack, selectAudioTrack, selectVideoTrack } from "@/hooks/useMediaTracks";

/**
 * MenuBar — VLC-style menu strip.
 */
export function MenuBar() {
  const [open, setOpen] = useState<string | null>(null);

  // Granular selectors — each one re-renders MenuBar only when its slice changes.
  const playing = usePlayerStore((s) => s.playing);
  const playlist = usePlayerStore((s) => s.playlist);
  const speed = usePlayerStore((s) => s.speed);
  const repeat = usePlayerStore((s) => s.repeat);
  const random = usePlayerStore((s) => s.random);
  const muted = usePlayerStore((s) => s.muted);
  const volume = usePlayerStore((s) => s.volume);
  const sync = usePlayerStore((s) => s.sync);
  const aspectRatio = usePlayerStore((s) => s.aspectRatio);
  const filters = usePlayerStore((s) => s.filters);
  const playlistOpen = usePlayerStore((s) => s.playlistOpen);
  const karaoke = usePlayerStore((s) => s.karaoke);
  const tracks = useMediaTracks();

  // Stable action references — Zustand actions are already stable, but we
  // capture them once via getState() helpers to avoid re-subscribing.
  const set = usePlayerStore((s) => s.set);
  const pushOSD = usePlayerStore((s) => s.pushOSD);
  const loadIndex = usePlayerStore((s) => s.loadIndex);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);

  const handleOpen = useCallback((label: string) => setOpen(label), []);
  const handleClose = useCallback(() => setOpen(null), []);

  const setSpeed = useCallback((n: number) => {
    set({ speed: n });
    if (videoRef.current) videoRef.current.playbackRate = n;
    pushOSD(`Speed: ${n.toFixed(2)}×`);
  }, [set, pushOSD]);

  const menus = useMemo<ReadonlyArray<readonly [string, MenuItemDef[], string]>>(() => {
    const media: MenuItemDef[] = [
      { label: "Open File...", shortcut: "Ctrl+O", onSelect: () => document.getElementById("vlc-file-input")?.click() },
      { label: "Open Folder...", onSelect: () => document.getElementById("vlc-file-input")?.click() },
      { label: "Open Network Stream...", shortcut: "Ctrl+N", onSelect: () => set({ networkOpen: true }) },
      { type: "separator" },
      { type: "submenu", label: "Recent Media", submenu: playlist.slice(0, 10).map((p, i) => ({ label: p.title, onSelect: () => loadIndex(i) })) },
      { type: "separator" },
      { label: "Quit", shortcut: "Ctrl+Q", onSelect: () => window.close() },
    ];

    const playback: MenuItemDef[] = [
      { label: playing ? "Pause" : "Play", shortcut: "Space", onSelect: () => { const v = videoRef.current; if (v) (v.paused ? v.play() : v.pause())?.catch?.(() => undefined); } },
      { label: "Stop", shortcut: "S", onSelect: () => { const v = videoRef.current; if (v) { v.pause(); v.currentTime = 0; } } },
      { type: "separator" },
      { label: "Previous", shortcut: "P", onSelect: prev },
      { label: "Next", shortcut: "N", onSelect: next },
      { type: "separator" },
      { type: "submenu", label: "Speed", submenu: [
        { label: "Faster (fine)", shortcut: "]", onSelect: () => setSpeed(speed + 0.1) },
        { label: "Faster", onSelect: () => setSpeed(speed + 0.25) },
        { label: "Normal Speed", shortcut: "=", onSelect: () => setSpeed(1) },
        { label: "Slower", onSelect: () => setSpeed(Math.max(0.25, speed - 0.25)) },
        { label: "Slower (fine)", shortcut: "[", onSelect: () => setSpeed(Math.max(0.25, speed - 0.1)) },
      ] },
      { type: "separator" },
      { label: "Jump to Time...", shortcut: "Ctrl+T", onSelect: () => set({ jumpOpen: true }) },
      { type: "separator" },
      { label: "Repeat One", checked: repeat === 2, onSelect: () => set({ repeat: 2 }) },
      { label: "Repeat All", checked: repeat === 1, onSelect: () => set({ repeat: 1 }) },
      { label: "Random", checked: random, onSelect: () => set({ random: !random }) },
    ];

    const audioTrackItems: MenuItemDef[] = tracks.audioSupported
      ? (tracks.audio.length
          ? tracks.audio.map((t) => ({ label: t.label, checked: t.active, onSelect: () => selectAudioTrack(t.index) }))
          : [{ label: "No audio tracks", disabled: true }])
      : [{ label: "Not exposed by this browser", disabled: true }];

    const audio: MenuItemDef[] = [
      { label: "Audio Track", type: "submenu", submenu: audioTrackItems },
      { type: "separator" },
      { label: "Increase Volume", shortcut: "Ctrl+↑", onSelect: () => set({ volume: Math.min(2, volume + 0.05) }) },
      { label: "Decrease Volume", shortcut: "Ctrl+↓", onSelect: () => set({ volume: Math.max(0, volume - 0.05) }) },
      { label: "Mute", shortcut: "M", checked: muted, onSelect: () => set({ muted: !muted }) },
      { type: "separator" },
      { label: "Audio Delay +50ms", shortcut: "K", onSelect: () => set({ sync: { ...sync, audioDelay: Math.min(5000, sync.audioDelay + 50) } }) },
      { label: "Audio Delay -50ms", shortcut: "J", onSelect: () => set({ sync: { ...sync, audioDelay: Math.max(0, sync.audioDelay - 50) } }) },
      { label: "Karaoke (cancel centre vocals)", checked: karaoke, onSelect: () => set({ karaoke: !karaoke }) },
      { type: "separator" },
      { label: "Background Music...", onSelect: () => set({ ambientOpen: true }) },
      { type: "separator" },
      { label: "Equalizer...", onSelect: () => set({ effectsOpen: true }) },
      { label: "Compressor...", onSelect: () => set({ effectsOpen: true }) },
    ];

    const aspectRatios: MenuItemDef[] = (["default","1:1","4:3","16:9","16:10","2.21:1","2.35:1","2.39:1","5:4"] as const).map((a) => ({
      label: a, checked: aspectRatio === a, onSelect: () => set({ aspectRatio: a }),
    }));

    const videoTrackItems: MenuItemDef[] = tracks.videoSupported
      ? (tracks.video.length
          ? tracks.video.map((t) => ({ label: t.label, checked: t.active, onSelect: () => selectVideoTrack(t.index) }))
          : [{ label: "No video tracks", disabled: true }])
      : [{ label: "Not exposed by this browser", disabled: true }];

    const video: MenuItemDef[] = [
      { label: "Video Track", type: "submenu", submenu: videoTrackItems },
      { label: "Aspect Ratio", type: "submenu", submenu: aspectRatios },
      { label: "Zoom", type: "submenu", submenu: [
        { label: "1:4", onSelect: () => set({ filters: { ...filters, zoom: 25 } }) },
        { label: "1:2", onSelect: () => set({ filters: { ...filters, zoom: 50 } }) },
        { label: "Original", onSelect: () => set({ filters: { ...filters, zoom: 100 } }) },
        { label: "2:1", onSelect: () => set({ filters: { ...filters, zoom: 200 } }) },
      ] },
      { type: "separator" },
      { label: "Fullscreen", shortcut: "F", onSelect: () => window.dispatchEvent(new CustomEvent("vlc-toggle-fullscreen")) },
    ];

    const subtitleItems: MenuItemDef[] = [
      { label: "Disabled", checked: !tracks.text.some((t) => t.active), onSelect: () => selectTextTrack(null) },
      ...tracks.text.map((t) => ({ label: t.label, checked: t.active, onSelect: () => selectTextTrack(t.index) })),
    ];

    const subtitle: MenuItemDef[] = [
      { label: "Subtitle Track", type: "submenu", submenu: subtitleItems },
      { label: "Add Subtitle File...", shortcut: "Ctrl+Shift+O", onSelect: () => document.getElementById("vlc-sub-input")?.click() },
      { type: "separator" },
      { label: "Subtitle Delay +50ms", shortcut: "H", onSelect: () => set({ sync: { ...sync, subtitleDelay: sync.subtitleDelay + 50 } }) },
      { label: "Subtitle Delay -50ms", shortcut: "G", onSelect: () => set({ sync: { ...sync, subtitleDelay: sync.subtitleDelay - 50 } }) },
    ];

    const tools: MenuItemDef[] = [
      { label: "Effects and Filters...", shortcut: "Ctrl+E", onSelect: () => set({ effectsOpen: true }) },
      { label: "Track Synchronization...", onSelect: () => set({ effectsOpen: true }) },
      { type: "separator" },
      { label: "Codec Information...", shortcut: "Ctrl+J", onSelect: () => set({ codecOpen: true }) },
      { label: "Background Music", onSelect: () => set({ ambientOpen: true }) },
      { type: "separator" },
      { label: "Preferences...", shortcut: "Ctrl+P", onSelect: () => set({ preferencesOpen: true }) },
    ];

    const view: MenuItemDef[] = [
      { label: "Playlist", shortcut: "Ctrl+L", checked: playlistOpen, onSelect: () => set({ playlistOpen: !playlistOpen }) },
      { type: "separator" },
      { label: "Full Screen", shortcut: "F", onSelect: () => window.dispatchEvent(new CustomEvent("vlc-toggle-fullscreen")) },
    ];

    const help: MenuItemDef[] = [
      { label: "Keyboard Shortcuts (?)", onSelect: () => set({ helpOpen: true }) },
      { label: "About VLC Web", onSelect: () => alert("VLC Web Player — built with HTMLVideoElement + Web Audio API") },
    ];

    const studyApi = useStudyStore.getState();
    const study: MenuItemDef[] = [
      { label: "Open Study Hub", shortcut: "Ctrl+Shift+S", onSelect: () => useStudyStore.getState().patch({ hubOpen: true }) },
      { type: "separator" },
      { label: "Start Focus Session", onSelect: () => { useStudyStore.getState().pomoStart("focus"); useStudyStore.getState().patch({ hubOpen: true, hubTab: "pomodoro" }); } },
      { label: "Pause Timer", onSelect: () => useStudyStore.getState().pomoPause() },
      { label: "Reset Timer", onSelect: () => useStudyStore.getState().pomoStop() },
      { type: "separator" },
      { label: "Tasks", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "tasks" }) },
      { label: "Planner", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "planner" }) },
      { label: "Notes", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "notes" }) },
      { label: "Flashcards", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "flashcards" }) },
      { label: "Goals", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "goals" }) },
      { label: "Habits", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "habits" }) },
      { label: "Assignments", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "assignments" }) },
      { label: "Reading", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "reading" }) },
      { label: "Stats", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "stats" }) },
      { label: "Buddy", onSelect: () => useStudyStore.getState().patch({ hubOpen: true, hubTab: "buddy" }) },
    ];
    void studyApi; // touch to keep import live for future expansion

    const miniApps: MenuItemDef[] = FEATURES.map((f) => ({
      label: f.title,
      onSelect: () => set({ openFeatureId: f.id }),
    }));

    return [
      ["Media", media, "menu.media"], ["Playback", playback, "menu.playback"], ["Audio", audio, "menu.audio"], ["Video", video, "menu.video"],
      ["Subtitle", subtitle, "menu.subtitle"], ["Tools", tools, "menu.tools"], ["View", view, "menu.view"],
      ["Mini Apps", miniApps, "menu.miniapps"], ["Study", study, "menu.study"], ["Help", help, "menu.help"],
    ] as const;
  }, [playing, playlist, speed, repeat, random, muted, volume, sync, aspectRatio, filters, playlistOpen, karaoke, tracks, set, loadIndex, next, prev, setSpeed]);

  const vis = usePlayerStore((s) => s.uiVisibility);

  return (
    <div
      data-vlc-region="menu"
      role="menubar"
      className="flex items-stretch select-none hairline-bottom"
      style={{
        height: 30,
        background: "var(--vlc-bg-surface)",
        paddingLeft: 4,
      }}
    >
      {menus.filter(([, , id]) => isVisible(vis, id)).map(([label, items]) => (
        <MenuDropdown
          key={label}
          label={label}
          items={items}
          isOpen={open === label}
          onOpen={() => handleOpen(label)}
          onClose={handleClose}
        />
      ))}
    </div>
  );
}
