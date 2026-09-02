// Central registry of every customizable UI element. Keep ids stable —
// they're used as localStorage keys via the visibility map in playerStore.
export interface UIRegistryEntry { id: string; label: string; group: string }

export const UI_REGISTRY: UIRegistryEntry[] = [
  // Window chrome
  { id: "chrome.titleBar", label: "Title bar", group: "Window chrome" },
  { id: "chrome.menuBar", label: "Menu bar", group: "Window chrome" },
  { id: "chrome.seekBar", label: "Seek bar", group: "Window chrome" },
  { id: "chrome.controlBar", label: "Control bar", group: "Window chrome" },
  { id: "chrome.dockRail", label: "Inspector dock rail", group: "Window chrome" },
  { id: "chrome.osd", label: "On-screen display (OSD)", group: "Window chrome" },
  { id: "chrome.contextMenu", label: "Right-click context menu", group: "Window chrome" },
  // Title bar
  { id: "title.logo", label: "Logo", group: "Title bar" },
  { id: "title.text", label: "Title text", group: "Title bar" },
  { id: "title.metadata", label: "Resolution / duration pill", group: "Title bar" },
  { id: "title.windowButtons", label: "Window buttons (min/max/close)", group: "Title bar" },
  { id: "title.onlineBadge", label: "Online/offline badge", group: "Title bar" },
  { id: "title.studyChip", label: "Study status chip", group: "Title bar" },
  { id: "title.calculator", label: "Calculator quick-launch chip", group: "Title bar" },
  { id: "title.music", label: "Background music chip", group: "Title bar" },
  // Menu bar entries
  { id: "menu.media", label: "Media menu", group: "Menu bar" },
  { id: "menu.playback", label: "Playback menu", group: "Menu bar" },
  { id: "menu.audio", label: "Audio menu", group: "Menu bar" },
  { id: "menu.video", label: "Video menu", group: "Menu bar" },
  { id: "menu.subtitle", label: "Subtitle menu", group: "Menu bar" },
  { id: "menu.tools", label: "Tools menu", group: "Menu bar" },
  { id: "menu.view", label: "View menu", group: "Menu bar" },
  { id: "menu.help", label: "Help menu", group: "Menu bar" },
  { id: "menu.miniapps", label: "Mini Apps menu", group: "Menu bar" },
 { id: "menu.study", label: "Study menu", group: "Menu bar" },
  // Control bar buttons
  { id: "ctrl.stop", label: "Stop button", group: "Control bar" },
  { id: "ctrl.prev", label: "Previous button", group: "Control bar" },
  { id: "ctrl.playPause", label: "Play / Pause button", group: "Control bar" },
  { id: "ctrl.next", label: "Next button", group: "Control bar" },
  { id: "ctrl.repeat", label: "Repeat button", group: "Control bar" },
  { id: "ctrl.random", label: "Random button", group: "Control bar" },
  { id: "ctrl.time", label: "Time display", group: "Control bar" },
  { id: "ctrl.teletext", label: "Teletext button", group: "Control bar" },
  { id: "ctrl.pip", label: "Picture-in-Picture button", group: "Control bar" },
  { id: "ctrl.commandPalette", label: "Command palette button", group: "Control bar" },
  { id: "ctrl.fullscreen", label: "Fullscreen button", group: "Control bar" },
  { id: "ctrl.effects", label: "Effects button", group: "Control bar" },
  { id: "ctrl.frameStep", label: "Next frame button", group: "Control bar" },
  { id: "ctrl.playlist", label: "Playlist button", group: "Control bar" },
  { id: "ctrl.speed", label: "Playback speed button", group: "Control bar" },
  { id: "ctrl.mute", label: "Mute button", group: "Control bar" },
  { id: "ctrl.volumeSlider", label: "Volume slider", group: "Control bar" },
  // Seek bar
  { id: "seek.timeline", label: "Timeline track", group: "Seek bar" },
  { id: "seek.buffered", label: "Buffered range", group: "Seek bar" },
  { id: "seek.thumb", label: "Scrub handle", group: "Seek bar" },
  { id: "seek.bookmarks", label: "Bookmark markers", group: "Seek bar" },
  { id: "seek.abLoop", label: "A-B loop band", group: "Seek bar" },
  { id: "seek.hoverPreview", label: "Hover time tooltip", group: "Seek bar" },
  // On-screen display
  { id: "osd.messages", label: "Toast messages", group: "OSD" },
  // Inspector dock
  { id: "dock.playlist", label: "Playlist tab", group: "Dock rail" },
  { id: "dock.effects", label: "Effects tab", group: "Dock rail" },
  { id: "dock.codec", label: "Codec info tab", group: "Dock rail" },
  { id: "dock.preferences", label: "Preferences tab", group: "Dock rail" },
  { id: "dock.commandPalette", label: "Command palette tab", group: "Dock rail" },
  { id: "dock.installButton", label: "Install app button", group: "Dock rail" },
  { id: "dock.skins", label: "Skins quick-pick", group: "Dock rail" },
  // Floating panels
  { id: "panel.titlebar", label: "Panel title bars", group: "Panels" },
  { id: "panel.closeButton", label: "Panel close button", group: "Panels" },
  { id: "panel.dragHandle", label: "Panel drag handle", group: "Panels" },
  // Empty / welcome state
  { id: "empty.hero", label: "Logo + drop prompt", group: "Welcome screen" },
  { id: "empty.recents", label: "Recent files list", group: "Welcome screen" },
  { id: "empty.shortcuts", label: "Keyboard shortcut card", group: "Welcome screen" },
  { id: "empty.quickActions", label: "Quick action pills", group: "Welcome screen" },
];

// Missing entry → visible. Only an explicit `false` hides an element.
export const isVisible = (vis: Record<string, boolean>, id: string): boolean =>
  vis[id] !== false;
