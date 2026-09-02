import type { Theme } from "@/types/theme.types";

// Light-mode token pack — fixes contrast on light backgrounds.
const LIGHT_TOKENS: Record<string, string> = {
  "--vlc-border-subtle":    "rgba(0,0,0,0.06)",
  "--vlc-border-normal":    "rgba(0,0,0,0.14)",
  "--vlc-border-strong":    "rgba(0,0,0,0.28)",
  "--vlc-text-secondary":   "rgba(15,23,42,0.72)",
  "--vlc-text-ghost":       "rgba(15,23,42,0.50)",
  "--vlc-text-disabled":    "rgba(15,23,42,0.32)",
  "--vlc-control-hover":    "rgba(0,0,0,0.07)",
  "--vlc-control-active":   "rgba(0,0,0,0.14)",
  "--vlc-seek-track":       "rgba(0,0,0,0.14)",
  "--vlc-seek-buffered":    "rgba(0,0,0,0.32)",
  "--vlc-seek-thumb":       "#0F172A",
  "--vlc-chapter-marker":   "rgba(0,0,0,0.55)",
  "--vlc-volume-fill":      "#0F172A",
  "--vlc-gradient":         "linear-gradient(to top, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
};

// Base curated themes
const CURATED: Theme[] = [
  { name: "Classic", vars: {} },
  { name: "Light", vars: {
    "--vlc-bg-base": "#F4F4F5", "--vlc-bg-surface": "#E4E4E7", "--vlc-bg-elevated": "#FFFFFF", "--vlc-bg-sunken": "#D4D4D8",
    "--vlc-text-primary": "#0F172A",
    ...LIGHT_TOKENS,
  } },
  { name: "Midnight", vars: { "--vlc-bg-base": "#0D1117", "--vlc-bg-surface": "#161B22", "--vlc-bg-elevated": "#21262D", "--vlc-bg-sunken": "#010409", "--vlc-accent": "#58A6FF", "--vlc-accent-hover": "#4493F8", "--vlc-accent-dim": "rgba(88,166,255,0.15)", "--vlc-accent-text": "#79B8FF", "--vlc-seek-played": "#58A6FF" } },
  { name: "Forest", vars: { "--vlc-bg-base": "#0F1A14", "--vlc-bg-surface": "#162019", "--vlc-bg-elevated": "#1D2A22", "--vlc-bg-sunken": "#08110C", "--vlc-accent": "#4CAF50", "--vlc-accent-hover": "#3E8E41", "--vlc-accent-dim": "rgba(76,175,80,0.15)", "--vlc-accent-text": "#81C784", "--vlc-seek-played": "#4CAF50" } },
  { name: "Rose", vars: { "--vlc-bg-base": "#1A0F14", "--vlc-bg-surface": "#22141A", "--vlc-bg-elevated": "#2C1A22", "--vlc-bg-sunken": "#0F080B", "--vlc-accent": "#E91E8C", "--vlc-accent-hover": "#C2185B", "--vlc-accent-dim": "rgba(233,30,140,0.15)", "--vlc-accent-text": "#F06292", "--vlc-seek-played": "#E91E8C" } },
  { name: "Nord", vars: { "--vlc-bg-base": "#2E3440", "--vlc-bg-surface": "#3B4252", "--vlc-bg-elevated": "#434C5E", "--vlc-bg-sunken": "#242933", "--vlc-accent": "#88C0D0", "--vlc-accent-hover": "#6FAFC2", "--vlc-accent-dim": "rgba(136,192,208,0.16)", "--vlc-accent-text": "#A6D5E2", "--vlc-seek-played": "#88C0D0", "--vlc-text-primary": "#ECEFF4" } },
  { name: "Dracula", vars: { "--vlc-bg-base": "#282A36", "--vlc-bg-surface": "#343746", "--vlc-bg-elevated": "#44475A", "--vlc-bg-sunken": "#1E2029", "--vlc-accent": "#BD93F9", "--vlc-accent-hover": "#A57DEE", "--vlc-accent-dim": "rgba(189,147,249,0.18)", "--vlc-accent-text": "#D6BCFA", "--vlc-seek-played": "#FF79C6", "--vlc-text-primary": "#F8F8F2" } },
];

export const THEMES: Theme[] = [
  ...CURATED,
  { name: "Custom", vars: {} },
];

// Full customization surface — every visual variable a user can tweak.
export const ALL_THEME_VARS: { key: string; label: string; group: string; type: "color" | "size" }[] = [
  // Surfaces
  { key: "--vlc-bg-base", label: "Base background", group: "Surfaces", type: "color" },
  { key: "--vlc-bg-surface", label: "Surface", group: "Surfaces", type: "color" },
  { key: "--vlc-bg-elevated", label: "Elevated", group: "Surfaces", type: "color" },
  { key: "--vlc-bg-sunken", label: "Sunken", group: "Surfaces", type: "color" },
  // Borders
  { key: "--vlc-border-subtle", label: "Border subtle", group: "Borders", type: "color" },
  { key: "--vlc-border-normal", label: "Border normal", group: "Borders", type: "color" },
  { key: "--vlc-border-strong", label: "Border strong", group: "Borders", type: "color" },
  // Accent
  { key: "--vlc-accent", label: "Accent", group: "Accent", type: "color" },
  { key: "--vlc-accent-hover", label: "Accent hover", group: "Accent", type: "color" },
  { key: "--vlc-accent-dim", label: "Accent dim", group: "Accent", type: "color" },
  { key: "--vlc-accent-text", label: "Accent text", group: "Accent", type: "color" },
  // Text
  { key: "--vlc-text-primary", label: "Text primary", group: "Text", type: "color" },
  { key: "--vlc-text-secondary", label: "Text secondary", group: "Text", type: "color" },
  { key: "--vlc-text-ghost", label: "Text ghost", group: "Text", type: "color" },
  { key: "--vlc-text-disabled", label: "Text disabled", group: "Text", type: "color" },
  // Seek
  { key: "--vlc-seek-played", label: "Seek played", group: "Seek", type: "color" },
  { key: "--vlc-seek-buffered", label: "Seek buffered", group: "Seek", type: "color" },
  { key: "--vlc-seek-track", label: "Seek track", group: "Seek", type: "color" },
  { key: "--vlc-seek-thumb", label: "Seek thumb", group: "Seek", type: "color" },
  { key: "--vlc-chapter-marker", label: "Chapter marker", group: "Seek", type: "color" },
  // Volume
  { key: "--vlc-volume-fill", label: "Volume fill", group: "Volume", type: "color" },
  { key: "--vlc-volume-boost", label: "Volume boost", group: "Volume", type: "color" },
  // Controls / icons / buttons
  { key: "--vlc-control-hover", label: "Button hover", group: "Controls", type: "color" },
  { key: "--vlc-control-active", label: "Button active", group: "Controls", type: "color" },
  { key: "--vlc-control-radius", label: "Button radius", group: "Controls", type: "size" },
  { key: "--vlc-icon-size", label: "Icon size", group: "Controls", type: "size" },
  { key: "--vlc-icon-color", label: "Icon color", group: "Controls", type: "color" },
  // Typography
  { key: "--vlc-font-size-sm", label: "Font size small", group: "Typography", type: "size" },
  { key: "--vlc-font-size-md", label: "Font size medium", group: "Typography", type: "size" },
  { key: "--vlc-font-size-lg", label: "Font size large", group: "Typography", type: "size" },
  // Radius
  { key: "--vlc-radius-sm", label: "Radius small", group: "Radius", type: "size" },
  { key: "--vlc-radius-md", label: "Radius medium", group: "Radius", type: "size" },
  { key: "--vlc-radius-lg", label: "Radius large", group: "Radius", type: "size" },
];

export const applyThemeByName = (
  name: string,
  applyFn: (vars: Record<string, string>, name: string) => void,
  customVars?: Record<string, string>,
) => {
  const theme = THEMES.find((t) => t.name === name) ?? THEMES[0];
  if (!theme) return;
  // Reset all known vars first so themes don't leak between switches.
  ALL_THEME_VARS.forEach((v) => document.documentElement.style.removeProperty(v.key));
  const vars = name === "Custom" ? (customVars ?? {}) : theme.vars;
  applyFn(vars, name);
};
