import { usePlayerStore } from "@/store/playerStore";
import { useShallow } from "zustand/react/shallow";
import { isVisible } from "@/utils/uiCustomization";
import { ListMusic, SlidersHorizontal, Info, Settings, Command, Sparkles } from "@/components/icons";
import type { ReactNode } from "react";
import { Tooltip } from "@/components/ui/vlc-tooltip";
import { InstallButton } from "./InstallButton";

/**
 * Right-edge collapsible inspector rail. Single-click toggles for each major
 * panel — modeled after Final Cut's inspector dock. Hidden behind the
 * `chrome.dockRail` UI visibility key so users can opt out.
 */
export function DockRail() {
  const { 
    uiVisibility: vis, set, playlistOpen, effectsOpen, codecOpen, preferencesOpen, commandPaletteOpen 
  } = usePlayerStore(useShallow((x) => ({
    uiVisibility: x.uiVisibility,
    set: x.set,
    playlistOpen: x.playlistOpen,
    effectsOpen: x.effectsOpen,
    codecOpen: x.codecOpen,
    preferencesOpen: x.preferencesOpen,
    commandPaletteOpen: x.commandPaletteOpen,
  })));
  
  if (!isVisible(vis, "chrome.dockRail")) return null;

  const allItems: { id: string; visKey: string; label: string; icon: ReactNode; active: boolean; onClick: () => void }[] = [
    { id: "playlist", visKey: "dock.playlist", label: "Playlist", icon: <ListMusic size={16} />, active: playlistOpen,
      onClick: () => set({ playlistOpen: !playlistOpen }) },
    { id: "effects", visKey: "dock.effects", label: "Effects", icon: <SlidersHorizontal size={16} />, active: effectsOpen,
      onClick: () => set({ effectsOpen: !effectsOpen }) },
    { id: "codec", visKey: "dock.codec", label: "Media Info", icon: <Info size={16} />, active: codecOpen,
      onClick: () => set({ codecOpen: !codecOpen }) },
    { id: "prefs", visKey: "dock.preferences", label: "Preferences", icon: <Settings size={16} />, active: preferencesOpen,
      onClick: () => set({ preferencesOpen: !preferencesOpen }) },
    { id: "cmd", visKey: "dock.commandPalette", label: "Command Palette", icon: <Command size={16} />, active: commandPaletteOpen,
      onClick: () => set({ commandPaletteOpen: !commandPaletteOpen }) },
    { id: "skins", visKey: "dock.skins", label: "Skins", icon: <Sparkles size={16} />, active: false,
      onClick: () => set({ preferencesOpen: true }) },
  ];
  const items = allItems.filter((it) => isVisible(vis, it.visKey));

  return (
    <aside
      data-vlc-region="dock-rail"
      aria-label="Inspector dock"
      className="vlc-dock-rail fixed right-0 top-1/2 z-30 flex flex-col items-center gap-0.5 px-1.5 py-2"
      style={{
        transform: "translateY(-50%)",
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--vlc-bg-elevated) 92%, transparent) 0%, color-mix(in oklab, var(--vlc-bg-elevated) 78%, transparent) 100%)",
        backdropFilter: "blur(18px) saturate(1.6)",
        border: "1px solid color-mix(in oklab, var(--vlc-text-primary) 8%, transparent)",
        borderRight: "none",
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
        boxShadow:
          "var(--vlc-shadow-popup), inset 1px 0 0 color-mix(in oklab, var(--vlc-text-primary) 6%, transparent), inset 0 1px 0 color-mix(in oklab, var(--vlc-text-primary) 10%, transparent)",
      }}
    >
      {items.map((it) => (
        <DockButton key={it.id} item={it} />
      ))}
      <div style={{ height: 1, alignSelf: "stretch", margin: "6px 4px", background: "color-mix(in oklab, var(--vlc-text-primary) 8%, transparent)" }} aria-hidden />
      {isVisible(vis, "dock.installButton") && <InstallButton />}
    </aside>
  );
}

/**
 * Single dock affordance with a magnetic hover lift and an accent blob for the
 * active panel. Hover/press scaling and the blob fade are pure CSS (see
 * `.vlc-dock-btn` in styles.css) so the always-mounted rail ships no animation
 * runtime; the transforms stay GPU-only and 60fps.
 */
function DockButton({ item }: { item: { id: string; label: string; icon: ReactNode; active: boolean; onClick: () => void } }) {
  return (
    <Tooltip label={item.label} side="left">
      <button
        onClick={item.onClick}
        aria-label={item.label}
        aria-pressed={item.active}
        className="vlc-dock-btn relative grid place-items-center rounded-md"
        style={{
          width: 32,
          height: 32,
          color: item.active ? "var(--vlc-accent)" : "var(--vlc-text-secondary)",
          background: "transparent",
        }}
      >
        {item.active && (
          <span
            aria-hidden
            className="vlc-dock-blob absolute inset-0 rounded-md"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--vlc-accent) 24%, transparent), color-mix(in oklab, var(--vlc-accent) 10%, transparent))",
              boxShadow:
                "inset 0 0 0 1px color-mix(in oklab, var(--vlc-accent) 40%, transparent), 0 6px 18px -6px color-mix(in oklab, var(--vlc-accent) 55%, transparent)",
            }}
          />
        )}
        <span className="relative">{item.icon}</span>
      </button>
    </Tooltip>
  );
}
