// God Mode customization presets. Each category has 10 named options that
// emit CSS targeting `:root[data-vlc-skinned][data-god-<cat>="<opt>"]`.
// Selections are persisted in playerStore and applied via a single managed
// <style id="vlc-godmode"> tag — no React re-render of the video tree.

export interface GodOption {
  id: string;
  name: string;
  /** CSS body. Selector is auto-prefixed. */
  css: string;
}

export interface GodCategory {
  id: string;
  label: string;
  /** Plain-language explainer shown above the swatch grid. */
  hint: string;
  /** First entry must be id="default" — no override, restores skin defaults. */
  options: GodOption[];
}

// Build a selector targeting an element when this category is active.
const sel = (cat: string, opt: string, inner = "") =>
  `:root[data-vlc-skinned][data-god-${cat}="${opt}"] ${inner}`.trim();

export const GOD_CATEGORIES: GodCategory[] = [
  {
    id: "seek",
    label: "Seek Bar",
    hint: "How the timeline scrubber looks.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "slim", name: "Slim Line", css: `${sel("seek", "slim", '[data-vlc-region="seek"]')} { padding: 2px 12px !important; } ${sel("seek", "slim", '[data-vlc-region="seek"] [data-vlc-track]')} { height: 2px !important; }` },
      { id: "thick", name: "Thick Bar", css: `${sel("seek", "thick", '[data-vlc-region="seek"] [data-vlc-track]')} { height: 10px !important; border-radius: 5px !important; }` },
      { id: "glow", name: "Neon Glow", css: `${sel("seek", "glow", '[data-vlc-region="seek"] [data-vlc-played]')} { box-shadow: 0 0 12px var(--vlc-accent), 0 0 24px var(--vlc-accent); }` },
      { id: "gradient", name: "Rainbow", css: `${sel("seek", "gradient", '[data-vlc-region="seek"] [data-vlc-played]')} { background: linear-gradient(90deg,#ff3d6e,#ffb800,#3dff7d,#3dafff,#a93dff) !important; }` },
      { id: "dotted", name: "Dotted", css: `${sel("seek", "dotted", '[data-vlc-region="seek"] [data-vlc-track]')} { background-image: radial-gradient(currentColor 1px, transparent 1.5px); background-size: 6px 100%; background-repeat: repeat-x; }` },
      { id: "segmented", name: "Segmented", css: `${sel("seek", "segmented", '[data-vlc-region="seek"] [data-vlc-played]')} { background: repeating-linear-gradient(90deg,var(--vlc-accent) 0 8px,transparent 8px 10px) !important; }` },
      { id: "beveled", name: "Beveled", css: `${sel("seek", "beveled", '[data-vlc-region="seek"] [data-vlc-track]')} { box-shadow: inset 0 1px 2px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(255,255,255,0.1); border-radius: 0 !important; }` },
      { id: "floating", name: "Floating Pill", css: `${sel("seek", "floating", '[data-vlc-region="seek"]')} { margin: 0 12px 6px !important; background: rgba(0,0,0,0.5) !important; border-radius: 999px !important; backdrop-filter: blur(12px); }` },
      { id: "minimal", name: "Hairline", css: `${sel("seek", "minimal", '[data-vlc-region="seek"] [data-vlc-track]')} { height: 1px !important; opacity: 0.5; } ${sel("seek", "minimal", '[data-vlc-region="seek"]:hover [data-vlc-track]')} { height: 4px !important; opacity: 1; transition: all 180ms; }` },
    ],
  },
  {
    id: "control",
    label: "Control Bar Layout",
    hint: "Density, alignment, and chrome of the play controls.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "centered", name: "Centered", css: `${sel("control", "centered", '[data-vlc-region="control"]')} { justify-content: center !important; }` },
      { id: "compact", name: "Compact", css: `${sel("control", "compact", '[data-vlc-region="control"]')} { padding: 2px 8px !important; min-height: 32px !important; } ${sel("control", "compact", '[data-vlc-region="control"] button')} { padding: 2px 4px !important; }` },
      { id: "mega", name: "Mega", css: `${sel("control", "mega", '[data-vlc-region="control"]')} { padding: 18px 24px !important; } ${sel("control", "mega", '[data-vlc-region="control"] button')} { transform: scale(1.3); margin: 0 4px; }` },
      { id: "floating", name: "Floating Island", css: `${sel("control", "floating", '[data-vlc-region="control"]')} { margin: 8px 16px !important; border-radius: 24px !important; background: rgba(20,20,20,0.7) !important; backdrop-filter: blur(16px); }` },
      { id: "split", name: "Split Edges", css: `${sel("control", "split", '[data-vlc-region="control"]')} { justify-content: space-between !important; padding: 0 24px !important; }` },
      { id: "stacked", name: "Stacked Rows", css: `${sel("control", "stacked", '[data-vlc-region="control"]')} { flex-wrap: wrap !important; min-height: 80px; }` },
      { id: "transparent", name: "Transparent", css: `${sel("control", "transparent", '[data-vlc-region="control"]')} { background: transparent !important; border-top: none !important; }` },
      { id: "bordered", name: "Hard Bordered", css: `${sel("control", "bordered", '[data-vlc-region="control"]')} { border: 2px solid var(--vlc-border-strong) !important; margin: 4px; }` },
      { id: "glass", name: "Glass Pane", css: `${sel("control", "glass", '[data-vlc-region="control"]')} { background: rgba(255,255,255,0.06) !important; backdrop-filter: blur(24px) saturate(180%); border-top: 1px solid rgba(255,255,255,0.12) !important; }` },
    ],
  },
  {
    id: "btn",
    label: "Button Shape",
    hint: "Per-button corner, fill, and hover affordance.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "square", name: "Square", css: `${sel("btn", "square", 'button')} { border-radius: 0 !important; }` },
      { id: "pill", name: "Pill", css: `${sel("btn", "pill", 'button')} { border-radius: 999px !important; padding-left: 12px !important; padding-right: 12px !important; }` },
      { id: "circle", name: "Circle", css: `${sel("btn", "circle", '[data-vlc-region="control"] button')} { border-radius: 50% !important; width: 36px !important; height: 36px !important; padding: 0 !important; display: inline-flex; align-items: center; justify-content: center; }` },
      { id: "outline", name: "Outline", css: `${sel("btn", "outline", 'button')} { border: 1px solid var(--vlc-border-normal) !important; background: transparent !important; }` },
      { id: "solid", name: "Solid Fill", css: `${sel("btn", "solid", '[data-vlc-region="control"] button')} { background: var(--vlc-accent-dim) !important; }` },
      { id: "ghost", name: "Ghost", css: `${sel("btn", "ghost", 'button')} { background: transparent !important; border: none !important; opacity: 0.7; } ${sel("btn", "ghost", 'button:hover')} { opacity: 1; }` },
      { id: "neumorph", name: "Neumorphic", css: `${sel("btn", "neumorph", '[data-vlc-region="control"] button')} { box-shadow: 4px 4px 8px rgba(0,0,0,0.35), -4px -4px 8px rgba(255,255,255,0.06); border-radius: 12px !important; }` },
      { id: "beveled", name: "Beveled", css: `${sel("btn", "beveled", 'button')} { box-shadow: inset 1px 1px 0 rgba(255,255,255,0.2), inset -1px -1px 0 rgba(0,0,0,0.4); border-radius: 0 !important; }` },
      { id: "glow", name: "Glowing", css: `${sel("btn", "glow", '[data-vlc-region="control"] button:hover')} { box-shadow: 0 0 12px var(--vlc-accent), 0 0 24px var(--vlc-accent); }` },
    ],
  },
  {
    id: "radius",
    label: "Corner Radius",
    hint: "Global rounding of every surface.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "0", name: "Sharp 0px", css: `${sel("radius", "0")} { --vlc-radius-sm:0; --vlc-radius-md:0; --vlc-radius-lg:0; --vlc-control-radius:0; }` },
      { id: "2", name: "Crisp 2px", css: `${sel("radius", "2")} { --vlc-radius-sm:2px; --vlc-radius-md:2px; --vlc-radius-lg:4px; --vlc-control-radius:2px; }` },
      { id: "4", name: "Modest 4px", css: `${sel("radius", "4")} { --vlc-radius-sm:4px; --vlc-radius-md:6px; --vlc-radius-lg:8px; --vlc-control-radius:4px; }` },
      { id: "8", name: "Soft 8px", css: `${sel("radius", "8")} { --vlc-radius-sm:8px; --vlc-radius-md:10px; --vlc-radius-lg:14px; --vlc-control-radius:8px; }` },
      { id: "12", name: "Round 12px", css: `${sel("radius", "12")} { --vlc-radius-sm:10px; --vlc-radius-md:14px; --vlc-radius-lg:18px; --vlc-control-radius:12px; }` },
      { id: "16", name: "Plush 16px", css: `${sel("radius", "16")} { --vlc-radius-sm:12px; --vlc-radius-md:18px; --vlc-radius-lg:22px; --vlc-control-radius:16px; }` },
      { id: "22", name: "Cozy 22px", css: `${sel("radius", "22")} { --vlc-radius-sm:16px; --vlc-radius-md:22px; --vlc-radius-lg:28px; --vlc-control-radius:22px; }` },
      { id: "28", name: "Cushion 28px", css: `${sel("radius", "28")} { --vlc-radius-sm:20px; --vlc-radius-md:28px; --vlc-radius-lg:36px; --vlc-control-radius:28px; }` },
      { id: "pill", name: "Full Pill", css: `${sel("radius", "pill")} { --vlc-radius-sm:999px; --vlc-radius-md:999px; --vlc-radius-lg:999px; --vlc-control-radius:999px; }` },
    ],
  },
  {
    id: "density",
    label: "Density",
    hint: "Spacing scale across the whole shell.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "ultra-tight", name: "Ultra Tight", css: `${sel("density", "ultra-tight", '[data-vlc-region]')} { padding-top: 1px !important; padding-bottom: 1px !important; min-height: 22px !important; }` },
      { id: "tight", name: "Tight", css: `${sel("density", "tight", '[data-vlc-region]')} { padding-top: 2px !important; padding-bottom: 2px !important; min-height: 28px !important; }` },
      { id: "snug", name: "Snug", css: `${sel("density", "snug", '[data-vlc-region]')} { padding-top: 4px !important; padding-bottom: 4px !important; }` },
      { id: "normal", name: "Normal", css: `${sel("density", "normal", '[data-vlc-region]')} { padding-top: 8px !important; padding-bottom: 8px !important; }` },
      { id: "comfy", name: "Comfy", css: `${sel("density", "comfy", '[data-vlc-region]')} { padding-top: 12px !important; padding-bottom: 12px !important; }` },
      { id: "roomy", name: "Roomy", css: `${sel("density", "roomy", '[data-vlc-region]')} { padding-top: 16px !important; padding-bottom: 16px !important; }` },
      { id: "airy", name: "Airy", css: `${sel("density", "airy", '[data-vlc-region]')} { padding-top: 22px !important; padding-bottom: 22px !important; }` },
      { id: "spacious", name: "Spacious", css: `${sel("density", "spacious", '[data-vlc-region]')} { padding-top: 28px !important; padding-bottom: 28px !important; }` },
      { id: "monumental", name: "Monumental", css: `${sel("density", "monumental", '[data-vlc-region]')} { padding-top: 38px !important; padding-bottom: 38px !important; }` },
    ],
  },
  {
    id: "fontscale",
    label: "Font Scale",
    hint: "Multiplies every label and timecode.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "75", name: "75%", css: `${sel("fontscale", "75")} { font-size: 11px; }` },
      { id: "85", name: "85%", css: `${sel("fontscale", "85")} { font-size: 12px; }` },
      { id: "95", name: "95%", css: `${sel("fontscale", "95")} { font-size: 13px; }` },
      { id: "100", name: "100%", css: `${sel("fontscale", "100")} { font-size: 14px; }` },
      { id: "110", name: "110%", css: `${sel("fontscale", "110")} { font-size: 15px; }` },
      { id: "125", name: "125%", css: `${sel("fontscale", "125")} { font-size: 17px; }` },
      { id: "140", name: "140%", css: `${sel("fontscale", "140")} { font-size: 19px; }` },
      { id: "160", name: "160%", css: `${sel("fontscale", "160")} { font-size: 22px; }` },
      { id: "200", name: "200%", css: `${sel("fontscale", "200")} { font-size: 28px; }` },
    ],
  },
  {
    id: "accent",
    label: "Accent Intensity",
    hint: "How loud the highlight color shouts.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "mono", name: "Monochrome", css: `${sel("accent", "mono")} { --vlc-accent:#888 !important; --vlc-accent-hover:#aaa !important; --vlc-seek-played:#888 !important; }` },
      { id: "subtle", name: "Subtle", css: `${sel("accent", "subtle", '[data-vlc-region="control"] button:hover, [data-vlc-region="menu"] button:hover')} { filter: brightness(1.1); }` },
      { id: "soft", name: "Soft", css: `${sel("accent", "soft", '[data-vlc-region="seek"] [data-vlc-played]')} { opacity: 0.7; }` },
      { id: "normal", name: "Normal", css: "" },
      { id: "vivid", name: "Vivid", css: `${sel("accent", "vivid")} { filter: saturate(1.2); }` },
      { id: "bold", name: "Bold", css: `${sel("accent", "bold", '[data-vlc-region="seek"] [data-vlc-played]')} { box-shadow: 0 0 6px var(--vlc-accent); }` },
      { id: "neon", name: "Neon", css: `${sel("accent", "neon", '[data-vlc-region="control"] button, [data-vlc-region="seek"] [data-vlc-played]')} { box-shadow: 0 0 12px var(--vlc-accent), 0 0 24px var(--vlc-accent); }` },
      { id: "ultra", name: "Ultra", css: `${sel("accent", "ultra")} { filter: saturate(1.5) contrast(1.08); }` },
      { id: "max", name: "Maximum", css: `${sel("accent", "max")} { filter: saturate(2) contrast(1.15); } ${sel("accent", "max", 'button:hover')} { text-shadow: 0 0 8px var(--vlc-accent); }` },
    ],
  },
  {
    id: "bg",
    label: "Background Style",
    hint: "Texture under the entire app shell.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "solid", name: "Pure Solid", css: `${sel("bg", "solid")} body { background: var(--vlc-bg-base) !important; }` },
      { id: "soft", name: "Soft Gradient", css: `${sel("bg", "soft")} body { background-image: linear-gradient(180deg, color-mix(in oklab, var(--vlc-bg-base) 90%, white 10%), var(--vlc-bg-base)); }` },
      { id: "bold", name: "Bold Gradient", css: `${sel("bg", "bold")} body { background-image: linear-gradient(135deg, var(--vlc-bg-base), color-mix(in oklab, var(--vlc-accent) 40%, var(--vlc-bg-base) 60%)); }` },
      { id: "radial", name: "Radial Spotlight", css: `${sel("bg", "radial")} body { background-image: radial-gradient(at 50% 30%, color-mix(in oklab, var(--vlc-accent) 30%, transparent), transparent 60%); }` },
      { id: "grid", name: "Grid", css: `${sel("bg", "grid")} body { background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 24px 24px; }` },
      { id: "dotted", name: "Dotted", css: `${sel("bg", "dotted")} body { background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.5px); background-size: 16px 16px; }` },
      { id: "scanlines", name: "Scanlines", css: `${sel("bg", "scanlines")} body { background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px); }` },
      { id: "noise", name: "Noise", css: `${sel("bg", "noise")} body { background-image: radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 3px 3px, 5px 5px; }` },
      { id: "vignette", name: "Vignette", css: `${sel("bg", "vignette")} body::after { content:""; position: fixed; inset: 0; pointer-events: none; box-shadow: inset 0 0 200px rgba(0,0,0,0.7); }` },
    ],
  },
  {
    id: "osd",
    label: "OSD Position",
    hint: "Where on-screen messages appear.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "top-left", name: "Top Left", css: `${sel("osd", "top-left", '[data-vlc-osd]')} { top: 12px !important; left: 12px !important; right: auto !important; bottom: auto !important; transform: none !important; }` },
      { id: "top-center", name: "Top Center", css: `${sel("osd", "top-center", '[data-vlc-osd]')} { top: 12px !important; left: 50% !important; right: auto !important; bottom: auto !important; transform: translateX(-50%) !important; }` },
      { id: "top-right", name: "Top Right", css: `${sel("osd", "top-right", '[data-vlc-osd]')} { top: 12px !important; right: 12px !important; left: auto !important; bottom: auto !important; transform: none !important; }` },
      { id: "center", name: "Center", css: `${sel("osd", "center", '[data-vlc-osd]')} { top: 50% !important; left: 50% !important; right: auto !important; bottom: auto !important; transform: translate(-50%,-50%) !important; font-size: 22px !important; }` },
      { id: "bottom-left", name: "Bottom Left", css: `${sel("osd", "bottom-left", '[data-vlc-osd]')} { bottom: 80px !important; left: 12px !important; right: auto !important; top: auto !important; transform: none !important; }` },
      { id: "bottom-right", name: "Bottom Right", css: `${sel("osd", "bottom-right", '[data-vlc-osd]')} { bottom: 80px !important; right: 12px !important; left: auto !important; top: auto !important; transform: none !important; }` },
      { id: "pill-top", name: "Pill Top", css: `${sel("osd", "pill-top", '[data-vlc-osd] > *')} { background: rgba(0,0,0,0.7) !important; backdrop-filter: blur(12px); border-radius: 999px !important; padding: 6px 14px !important; }` },
      { id: "banner", name: "Banner", css: `${sel("osd", "banner", '[data-vlc-osd]')} { left: 0 !important; right: 0 !important; transform: none !important; text-align: center !important; } ${sel("osd", "banner", '[data-vlc-osd] > *')} { background: var(--vlc-accent) !important; color: #000 !important; }` },
      { id: "minimal", name: "Minimal", css: `${sel("osd", "minimal", '[data-vlc-osd] > *')} { background: transparent !important; box-shadow: none !important; opacity: 0.85; }` },
    ],
  },
  {
    id: "motion",
    label: "Animation Speed",
    hint: "How snappy or cinematic the UI feels.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "none", name: "None", css: `${sel("motion", "none", '*')} { transition-duration: 0s !important; animation-duration: 0s !important; }` },
      { id: "instant", name: "Instant", css: `${sel("motion", "instant", '*')} { transition-duration: 40ms !important; }` },
      { id: "fast", name: "Fast", css: `${sel("motion", "fast", '*')} { transition-duration: 90ms !important; }` },
      { id: "normal", name: "Normal", css: `${sel("motion", "normal", '*')} { transition-duration: 150ms !important; }` },
      { id: "smooth", name: "Smooth", css: `${sel("motion", "smooth", '*')} { transition-duration: 240ms !important; transition-timing-function: cubic-bezier(.4,0,.2,1) !important; }` },
      { id: "slow", name: "Slow", css: `${sel("motion", "slow", '*')} { transition-duration: 380ms !important; }` },
      { id: "dreamy", name: "Dreamy", css: `${sel("motion", "dreamy", '*')} { transition-duration: 600ms !important; transition-timing-function: cubic-bezier(.16,1,.3,1) !important; }` },
      { id: "springy", name: "Springy", css: `${sel("motion", "springy", 'button:hover')} { transform: scale(1.08); transition: transform 200ms cubic-bezier(.34,1.56,.64,1) !important; }` },
      { id: "cinematic", name: "Cinematic", css: `${sel("motion", "cinematic", '*')} { transition-duration: 900ms !important; transition-timing-function: cubic-bezier(.65,0,.35,1) !important; }` },
    ],
  },
  {
    id: "shadow",
    label: "Shadow Depth",
    hint: "Drop shadow elevation under control regions.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "none", name: "Flat", css: `${sel("shadow", "none", '[data-vlc-region]')} { box-shadow: none !important; }` },
      { id: "hairline", name: "Hairline", css: `${sel("shadow", "hairline", '[data-vlc-region]')} { box-shadow: 0 1px 0 rgba(0,0,0,0.25) !important; }` },
      { id: "soft", name: "Soft Lift", css: `${sel("shadow", "soft", '[data-vlc-region]')} { box-shadow: 0 4px 12px -6px rgba(0,0,0,0.4) !important; }` },
      { id: "card", name: "Card", css: `${sel("shadow", "card", '[data-vlc-region]')} { box-shadow: 0 8px 24px -10px rgba(0,0,0,0.55) !important; }` },
      { id: "elevated", name: "Elevated", css: `${sel("shadow", "elevated", '[data-vlc-region]')} { box-shadow: 0 16px 40px -12px rgba(0,0,0,0.7) !important; }` },
      { id: "long", name: "Long Throw", css: `${sel("shadow", "long", '[data-vlc-region]')} { box-shadow: 0 32px 56px -16px rgba(0,0,0,0.7) !important; }` },
      { id: "inset", name: "Inset", css: `${sel("shadow", "inset", '[data-vlc-region]')} { box-shadow: inset 0 2px 6px rgba(0,0,0,0.35) !important; }` },
      { id: "neon", name: "Neon Halo", css: `${sel("shadow", "neon", '[data-vlc-region]')} { box-shadow: 0 0 22px var(--vlc-accent), 0 0 44px var(--vlc-accent-dim) !important; }` },
      { id: "brutal", name: "Brutal Block", css: `${sel("shadow", "brutal", '[data-vlc-region]')} { box-shadow: 6px 6px 0 var(--vlc-border-strong, #000) !important; }` },
    ],
  },
  {
    id: "panel",
    label: "Panel Texture",
    hint: "Surface fill of side / floating panels.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "flat", name: "Flat", css: `${sel("panel", "flat", '[data-vlc-region]')} { background-image: none !important; }` },
      { id: "gradient", name: "Gradient", css: `${sel("panel", "gradient", '[data-vlc-region]')} { background-image: linear-gradient(180deg, color-mix(in oklab, var(--vlc-bg-surface) 70%, white 4%), var(--vlc-bg-surface)) !important; }` },
      { id: "frost", name: "Frosted", css: `${sel("panel", "frost", '[data-vlc-region]')} { background: color-mix(in oklab, var(--vlc-bg-surface) 70%, transparent) !important; backdrop-filter: blur(20px) saturate(160%); }` },
      { id: "glass", name: "Deep Glass", css: `${sel("panel", "glass", '[data-vlc-region]')} { background: color-mix(in oklab, var(--vlc-bg-surface) 50%, transparent) !important; backdrop-filter: blur(32px) saturate(180%); border: 1px solid color-mix(in oklab, var(--vlc-border-normal) 80%, transparent) !important; }` },
      { id: "linen", name: "Linen", css: `${sel("panel", "linen", '[data-vlc-region]')} { background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px) !important; background-size: 3px 3px, 5px 5px; }` },
      { id: "carbon", name: "Carbon", css: `${sel("panel", "carbon", '[data-vlc-region]')} { background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 4px) !important; }` },
      { id: "brushed", name: "Brushed Metal", css: `${sel("panel", "brushed", '[data-vlc-region]')} { background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px) !important; }` },
      { id: "halftone", name: "Halftone", css: `${sel("panel", "halftone", '[data-vlc-region]')} { background-image: radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1.2px) !important; background-size: 6px 6px; }` },
      { id: "stripe", name: "Diagonal Stripe", css: `${sel("panel", "stripe", '[data-vlc-region]')} { background-image: repeating-linear-gradient(-45deg, color-mix(in oklab, var(--vlc-accent) 8%, transparent) 0 10px, transparent 10px 20px) !important; }` },
    ],
  },
  {
    id: "divider",
    label: "Divider Style",
    hint: "How regions separate from each other.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "none", name: "Invisible", css: `${sel("divider", "none", '[data-vlc-region]')} { border-top-color: transparent !important; border-bottom-color: transparent !important; }` },
      { id: "hairline", name: "Hairline", css: `${sel("divider", "hairline", '[data-vlc-region]')} { border-top: 1px solid color-mix(in oklab, var(--vlc-border-normal) 60%, transparent) !important; }` },
      { id: "double", name: "Double Line", css: `${sel("divider", "double", '[data-vlc-region]')} { border-top: 3px double var(--vlc-border-strong, var(--vlc-border-normal)) !important; }` },
      { id: "dashed", name: "Dashed", css: `${sel("divider", "dashed", '[data-vlc-region]')} { border-top: 1px dashed var(--vlc-accent) !important; }` },
      { id: "dotted", name: "Dotted", css: `${sel("divider", "dotted", '[data-vlc-region]')} { border-top: 2px dotted var(--vlc-border-normal) !important; }` },
      { id: "accent", name: "Accent Rule", css: `${sel("divider", "accent", '[data-vlc-region]')} { border-top: 2px solid var(--vlc-accent) !important; }` },
      { id: "glow", name: "Glow Edge", css: `${sel("divider", "glow", '[data-vlc-region]')} { border-top: 1px solid var(--vlc-accent) !important; box-shadow: 0 -2px 12px -2px var(--vlc-accent) !important; }` },
      { id: "gap", name: "Gap Spacer", css: `${sel("divider", "gap", '[data-vlc-region]')} { border-top: none !important; margin-top: 8px !important; }` },
      { id: "ridge", name: "Ridge", css: `${sel("divider", "ridge", '[data-vlc-region]')} { border-top: 3px ridge var(--vlc-border-normal) !important; }` },
    ],
  },
  {
    id: "focus",
    label: "Focus Ring",
    hint: "Keyboard-focus indicator on buttons and inputs.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "none", name: "Hidden", css: `${sel("focus", "none", 'button:focus-visible, input:focus-visible')} { outline: none !important; box-shadow: none !important; }` },
      { id: "subtle", name: "Subtle", css: `${sel("focus", "subtle", 'button:focus-visible, input:focus-visible')} { outline: 1px solid color-mix(in oklab, var(--vlc-accent) 50%, transparent) !important; outline-offset: 2px !important; }` },
      { id: "solid", name: "Solid", css: `${sel("focus", "solid", 'button:focus-visible, input:focus-visible')} { outline: 2px solid var(--vlc-accent) !important; outline-offset: 2px !important; }` },
      { id: "thick", name: "Thick", css: `${sel("focus", "thick", 'button:focus-visible, input:focus-visible')} { outline: 4px solid var(--vlc-accent) !important; outline-offset: 2px !important; }` },
      { id: "dashed", name: "Dashed", css: `${sel("focus", "dashed", 'button:focus-visible, input:focus-visible')} { outline: 2px dashed var(--vlc-accent) !important; outline-offset: 3px !important; }` },
      { id: "glow", name: "Glow", css: `${sel("focus", "glow", 'button:focus-visible, input:focus-visible')} { outline: none !important; box-shadow: 0 0 0 3px var(--vlc-accent-dim), 0 0 16px var(--vlc-accent) !important; }` },
      { id: "inset", name: "Inset Ring", css: `${sel("focus", "inset", 'button:focus-visible, input:focus-visible')} { outline: none !important; box-shadow: inset 0 0 0 2px var(--vlc-accent) !important; }` },
      { id: "underline", name: "Underline", css: `${sel("focus", "underline", 'button:focus-visible, input:focus-visible')} { outline: none !important; box-shadow: inset 0 -3px 0 var(--vlc-accent) !important; }` },
      { id: "corners", name: "Corner Brackets", css: `${sel("focus", "corners", 'button:focus-visible, input:focus-visible')} { outline: none !important; background-image: linear-gradient(var(--vlc-accent), var(--vlc-accent)), linear-gradient(var(--vlc-accent), var(--vlc-accent)), linear-gradient(var(--vlc-accent), var(--vlc-accent)), linear-gradient(var(--vlc-accent), var(--vlc-accent)) !important; background-size: 8px 2px, 2px 8px, 8px 2px, 2px 8px !important; background-position: 0 0, 0 0, 100% 100%, 100% 100% !important; background-repeat: no-repeat !important; }` },
    ],
  },
  {
    id: "scrollbar",
    label: "Scrollbar",
    hint: "Style of overflow scrollbars in panels.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "hidden", name: "Hidden", css: `${sel("scrollbar", "hidden", '*')} { scrollbar-width: none !important; } ${sel("scrollbar", "hidden", '*::-webkit-scrollbar')} { display: none !important; }` },
      { id: "thin", name: "Thin", css: `${sel("scrollbar", "thin", '*')} { scrollbar-width: thin !important; } ${sel("scrollbar", "thin", '*::-webkit-scrollbar')} { width: 6px !important; height: 6px !important; }` },
      { id: "fat", name: "Fat", css: `${sel("scrollbar", "fat", '*::-webkit-scrollbar')} { width: 14px !important; height: 14px !important; }` },
      { id: "accent", name: "Accent Thumb", css: `${sel("scrollbar", "accent", '*::-webkit-scrollbar-thumb')} { background: var(--vlc-accent) !important; border-radius: 999px !important; }` },
      { id: "pill", name: "Floating Pill", css: `${sel("scrollbar", "pill", '*::-webkit-scrollbar')} { width: 8px !important; } ${sel("scrollbar", "pill", '*::-webkit-scrollbar-thumb')} { background: color-mix(in oklab, var(--vlc-text-primary) 30%, transparent) !important; border-radius: 999px !important; border: 2px solid transparent !important; background-clip: padding-box !important; }` },
      { id: "square", name: "Square", css: `${sel("scrollbar", "square", '*::-webkit-scrollbar-thumb')} { border-radius: 0 !important; background: var(--vlc-border-strong, var(--vlc-border-normal)) !important; }` },
      { id: "neon", name: "Neon", css: `${sel("scrollbar", "neon", '*::-webkit-scrollbar-thumb')} { background: var(--vlc-accent) !important; box-shadow: 0 0 8px var(--vlc-accent) !important; }` },
      { id: "track-soft", name: "Soft Track", css: `${sel("scrollbar", "track-soft", '*::-webkit-scrollbar-track')} { background: var(--vlc-bg-sunken) !important; border-radius: 999px !important; }` },
      { id: "mac", name: "macOS", css: `${sel("scrollbar", "mac", '*::-webkit-scrollbar')} { width: 8px !important; height: 8px !important; } ${sel("scrollbar", "mac", '*::-webkit-scrollbar-thumb')} { background: rgba(127,127,127,0.4) !important; border-radius: 4px !important; border: 2px solid transparent !important; background-clip: padding-box !important; }` },
    ],
  },
  {
    id: "icon",
    label: "Icon Weight",
    hint: "Stroke and fill style of all SVG icons.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "hairline", name: "Hairline", css: `${sel("icon", "hairline", 'svg')} { stroke-width: 1 !important; }` },
      { id: "thin", name: "Thin", css: `${sel("icon", "thin", 'svg')} { stroke-width: 1.25 !important; }` },
      { id: "regular", name: "Regular", css: `${sel("icon", "regular", 'svg')} { stroke-width: 1.75 !important; }` },
      { id: "bold", name: "Bold", css: `${sel("icon", "bold", 'svg')} { stroke-width: 2.25 !important; }` },
      { id: "heavy", name: "Heavy", css: `${sel("icon", "heavy", 'svg')} { stroke-width: 3 !important; }` },
      { id: "filled", name: "Filled", css: `${sel("icon", "filled", 'svg')} { fill: currentColor !important; stroke-width: 0 !important; }` },
      { id: "duotone", name: "Duotone", css: `${sel("icon", "duotone", 'svg')} { fill: var(--vlc-accent-dim) !important; stroke: currentColor !important; }` },
      { id: "shadow", name: "Drop Shadow", css: `${sel("icon", "shadow", 'svg')} { filter: drop-shadow(0 1px 1px rgba(0,0,0,0.4)) !important; }` },
      { id: "glow", name: "Glow", css: `${sel("icon", "glow", 'button:hover svg')} { filter: drop-shadow(0 0 6px var(--vlc-accent)) !important; }` },
    ],
  },
  {
    id: "title",
    label: "Title Treatment",
    hint: "Typography of the title bar text.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "upper", name: "ALL CAPS", css: `${sel("title", "upper", '[data-vlc-region="title"]')} { text-transform: uppercase !important; letter-spacing: 2px !important; }` },
      { id: "smallcaps", name: "Small Caps", css: `${sel("title", "smallcaps", '[data-vlc-region="title"]')} { font-variant: small-caps !important; letter-spacing: 1px !important; }` },
      { id: "italic", name: "Italic", css: `${sel("title", "italic", '[data-vlc-region="title"]')} { font-style: italic !important; }` },
      { id: "wide", name: "Wide Track", css: `${sel("title", "wide", '[data-vlc-region="title"]')} { letter-spacing: 6px !important; }` },
      { id: "tight", name: "Tight Track", css: `${sel("title", "tight", '[data-vlc-region="title"]')} { letter-spacing: -0.5px !important; }` },
      { id: "underline", name: "Underline", css: `${sel("title", "underline", '[data-vlc-region="title"]')} { text-decoration: underline; text-underline-offset: 4px; text-decoration-color: var(--vlc-accent) !important; }` },
      { id: "marquee", name: "Marquee Caps", css: `${sel("title", "marquee", '[data-vlc-region="title"]')} { text-transform: uppercase !important; text-shadow: 0 0 6px var(--vlc-accent) !important; }` },
      { id: "gradient", name: "Gradient Fill", css: `${sel("title", "gradient", '[data-vlc-region="title"]')} { background: linear-gradient(90deg, var(--vlc-accent), var(--vlc-text-primary)); -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; color: transparent !important; }` },
      { id: "outline", name: "Outline Text", css: `${sel("title", "outline", '[data-vlc-region="title"]')} { color: transparent !important; -webkit-text-stroke: 1px var(--vlc-text-primary) !important; }` },
    ],
  },
  {
    id: "overlay",
    label: "Gradient Overlay",
    hint: "Top-and-bottom video gradient (cinematic vignettes).",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "off", name: "Off", css: `${sel("overlay", "off", '[data-vlc-region="control"]')} { background-image: none !important; }` },
      { id: "gentle-bottom", name: "Gentle Bottom", css: `${sel("overlay", "gentle-bottom", '[data-vlc-region="control"]')} { background-image: linear-gradient(transparent, rgba(0,0,0,0.55)) !important; }` },
      { id: "deep-bottom", name: "Deep Bottom", css: `${sel("overlay", "deep-bottom", '[data-vlc-region="control"]')} { background-image: linear-gradient(transparent, rgba(0,0,0,0.9)) !important; }` },
      { id: "top-fade", name: "Top Fade", css: `${sel("overlay", "top-fade", '[data-vlc-region="title"]')} { background-image: linear-gradient(rgba(0,0,0,0.85), transparent) !important; }` },
      { id: "both-fade", name: "Both Ends", css: `${sel("overlay", "both-fade", '[data-vlc-region="control"]')} { background-image: linear-gradient(transparent, rgba(0,0,0,0.75)) !important; } ${sel("overlay", "both-fade", '[data-vlc-region="title"]')} { background-image: linear-gradient(rgba(0,0,0,0.75), transparent) !important; }` },
      { id: "accent-tint", name: "Accent Tint", css: `${sel("overlay", "accent-tint", '[data-vlc-region="control"]')} { background-image: linear-gradient(transparent, color-mix(in oklab, var(--vlc-accent) 70%, black 30%)) !important; }` },
      { id: "blur-bar", name: "Blur Bar", css: `${sel("overlay", "blur-bar", '[data-vlc-region="control"]')} { background: rgba(0,0,0,0.25) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important; }` },
      { id: "letterbox", name: "Letterbox", css: `${sel("overlay", "letterbox", '[data-vlc-region="control"]')} { background: #000 !important; border-top: none !important; min-height: 44px; }` },
      { id: "scanlines", name: "Scanline Overlay", css: `${sel("overlay", "scanlines", '[data-vlc-region="control"]')} { background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px), linear-gradient(transparent, rgba(0,0,0,0.75)) !important; }` },
    ],
  },
  {
    id: "panelshape",
    label: "Panel Geometry",
    hint: "How dialogs, playlists, and menus are physically shaped.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "flush", name: "Flush Edge", css: `${sel("panelshape", "flush", '[data-vlc-region="panel"], [data-vlc-region="playlist"]')} { border-radius: 0 !important; border-left: none !important; border-right: none !important; }` },
      { id: "compact", name: "Compact", css: `${sel("panelshape", "compact", '[data-vlc-region="panel"]')} { transform: scale(.96); transform-origin: top right; }` },
      { id: "wide", name: "Wide Body", css: `${sel("panelshape", "wide", '[data-vlc-region="panel"]')} { min-width: min(86vw, 820px) !important; }` },
      { id: "tall", name: "Tall Body", css: `${sel("panelshape", "tall", '[data-vlc-region="panel"]')} { max-height: 92vh !important; }` },
      { id: "ticket", name: "Ticket", css: `${sel("panelshape", "ticket", '[data-vlc-region="panel"]')} { border-radius: 2px !important; outline: 1px dashed var(--vlc-border-normal); outline-offset: -6px; }` },
      { id: "sheet", name: "Bottom Sheet", css: `${sel("panelshape", "sheet", '[data-vlc-region="panel"]')} { border-radius: 18px 18px 0 0 !important; }` },
      { id: "capsule", name: "Capsule", css: `${sel("panelshape", "capsule", '[data-vlc-region="panel"]')} { border-radius: 28px !important; overflow: hidden; }` },
      { id: "chrome", name: "Chrome Frame", css: `${sel("panelshape", "chrome", '[data-vlc-region="panel"]')} { border-width: 2px !important; box-shadow: inset 0 1px 0 rgba(255,255,255,.14), var(--vlc-shadow-popup) !important; }` },
      { id: "outline", name: "Outline Only", css: `${sel("panelshape", "outline", '[data-vlc-region="panel"]')} { background: transparent !important; border: 1px solid var(--vlc-border-strong) !important; }` },
    ],
  },
  {
    id: "menustyle",
    label: "Menu Behavior",
    hint: "VLC menu strip spacing, weight, and hover style.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "dense", name: "Dense", css: `${sel("menustyle", "dense", '[data-vlc-region="menu"]')} { height: 22px !important; font-size: 11px !important; }` },
      { id: "touch", name: "Touch", css: `${sel("menustyle", "touch", '[data-vlc-region="menu"]')} { height: 40px !important; } ${sel("menustyle", "touch", '[data-vlc-region="menu"] button')} { padding-inline: 14px !important; }` },
      { id: "tabs", name: "Tabs", css: `${sel("menustyle", "tabs", '[data-vlc-region="menu"] button')} { border-radius: var(--vlc-radius-sm) var(--vlc-radius-sm) 0 0 !important; margin-top: 4px; }` },
      { id: "pills", name: "Pills", css: `${sel("menustyle", "pills", '[data-vlc-region="menu"]')} { gap: 4px; padding: 3px 6px; } ${sel("menustyle", "pills", '[data-vlc-region="menu"] button')} { border-radius: 999px !important; }` },
      { id: "underline", name: "Underline", css: `${sel("menustyle", "underline", '[data-vlc-region="menu"] button:hover')} { box-shadow: inset 0 -2px 0 var(--vlc-accent) !important; }` },
      { id: "block", name: "Block Hover", css: `${sel("menustyle", "block", '[data-vlc-region="menu"] button:hover')} { background: var(--vlc-accent) !important; color: var(--vlc-bg-base) !important; }` },
      { id: "mono", name: "Mono", css: `${sel("menustyle", "mono", '[data-vlc-region="menu"]')} { font-family: var(--vlc-font-mono) !important; text-transform: uppercase; }` },
      { id: "spaced", name: "Spaced", css: `${sel("menustyle", "spaced", '[data-vlc-region="menu"]')} { gap: 10px; padding-inline: 10px; }` },
      { id: "hidden", name: "Ghost Menu", css: `${sel("menustyle", "hidden", '[data-vlc-region="menu"]')} { opacity: .28; } ${sel("menustyle", "hidden", '[data-vlc-region="menu"]:hover')} { opacity: 1; }` },
    ],
  },
  {
    id: "videoframe",
    label: "Video Frame",
    hint: "The stage around the actual video element.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "pure-black", name: "Pure Black", css: `${sel("videoframe", "pure-black", '[data-vlc-video-stage]')} { background: #000 !important; }` },
      { id: "matte", name: "Matte", css: `${sel("videoframe", "matte", '[data-vlc-video-stage]')} { background: color-mix(in oklab, var(--vlc-bg-base) 85%, black 15%) !important; }` },
      { id: "frame", name: "Thin Frame", css: `${sel("videoframe", "frame", '[data-vlc-video-stage] video')} { outline: 1px solid var(--vlc-border-normal); outline-offset: -1px; }` },
      { id: "shadowbox", name: "Shadowbox", css: `${sel("videoframe", "shadowbox", '[data-vlc-video-stage] video')} { box-shadow: 0 24px 80px rgba(0,0,0,.55); }` },
      { id: "soft-edge", name: "Soft Edge", css: `${sel("videoframe", "soft-edge", '[data-vlc-video-stage] video')} { border-radius: var(--vlc-radius-md); overflow: hidden; }` },
      { id: "cinema", name: "Cinema Mask", css: `${sel("videoframe", "cinema", '[data-vlc-video-stage]')} { box-shadow: inset 0 48px 0 #000, inset 0 -48px 0 #000; }` },
      { id: "projector", name: "Projector", css: `${sel("videoframe", "projector", '[data-vlc-video-stage]')} { background-image: radial-gradient(circle at center, transparent 50%, rgba(0,0,0,.55)); }` },
      { id: "safegrid", name: "Safe Grid", css: `${sel("videoframe", "safegrid", '[data-vlc-video-stage]::after')} { content:""; position:absolute; inset:8%; pointer-events:none; border:1px dashed rgba(255,255,255,.16); }` },
      { id: "ambient", name: "Ambient", css: `${sel("videoframe", "ambient", '[data-vlc-video-stage]')} { background: radial-gradient(circle at center, color-mix(in oklab, var(--vlc-accent) 16%, #000 84%), #000 70%) !important; }` },
    ],
  },
  {
    id: "emptydrop",
    label: "Drop Zone",
    hint: "The first screen before a file is loaded.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "minimal", name: "Minimal", css: `${sel("emptydrop", "minimal", '[data-vlc-empty-drop]')} { border: none !important; }` },
      { id: "dashed", name: "Dashed", css: `${sel("emptydrop", "dashed", '[data-vlc-empty-drop]')} { border-style: dashed !important; border-width: 3px !important; }` },
      { id: "solid", name: "Solid", css: `${sel("emptydrop", "solid", '[data-vlc-empty-drop]')} { border-style: solid !important; }` },
      { id: "glow", name: "Glow", css: `${sel("emptydrop", "glow", '[data-vlc-empty-drop]')} { box-shadow: inset 0 0 50px var(--vlc-accent-dim), 0 0 28px var(--vlc-accent-dim); }` },
      { id: "poster", name: "Poster", css: `${sel("emptydrop", "poster", '[data-vlc-empty-drop]')} { background: linear-gradient(135deg, var(--vlc-accent-dim), transparent) !important; }` },
      { id: "grid", name: "Grid", css: `${sel("emptydrop", "grid", '[data-vlc-empty-drop]')} { background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px) !important; background-size: 24px 24px; }` },
      { id: "center-card", name: "Center Card", css: `${sel("emptydrop", "center-card", '[data-vlc-empty-drop]')} { inset: 14% !important; background: var(--vlc-bg-surface) !important; }` },
      { id: "huge-logo", name: "Huge Logo", css: `${sel("emptydrop", "huge-logo", '[data-vlc-empty-drop] > div:first-child')} { font-size: 96px !important; }` },
      { id: "compact", name: "Compact", css: `${sel("emptydrop", "compact", '[data-vlc-empty-drop]')} { inset: 22% !important; }` },
    ],
  },
  {
    id: "readability",
    label: "Readability Lock",
    hint: "Hard contrast protection for extreme skins and custom colors.",
    options: [
      { id: "default", name: "Original", css: "" },
      { id: "white", name: "Force White", css: `${sel("readability", "white")} { --vlc-text-primary:#ffffff; --vlc-text-secondary:rgba(255,255,255,.78); --vlc-text-ghost:rgba(255,255,255,.52); }` },
      { id: "black", name: "Force Black", css: `${sel("readability", "black")} { --vlc-text-primary:#050505; --vlc-text-secondary:rgba(5,5,5,.72); --vlc-text-ghost:rgba(5,5,5,.48); }` },
      { id: "cream", name: "Warm Cream", css: `${sel("readability", "cream")} { --vlc-text-primary:#fff7e6; --vlc-text-secondary:rgba(255,247,230,.76); --vlc-text-ghost:rgba(255,247,230,.5); }` },
      { id: "ice", name: "Ice Blue", css: `${sel("readability", "ice")} { --vlc-text-primary:#e8f7ff; --vlc-text-secondary:rgba(232,247,255,.76); --vlc-text-ghost:rgba(232,247,255,.5); }` },
      { id: "ink", name: "Ink", css: `${sel("readability", "ink")} { --vlc-text-primary:#101014; --vlc-text-secondary:rgba(16,16,20,.72); --vlc-text-ghost:rgba(16,16,20,.46); }` },
      { id: "outline", name: "Outline Text", css: `${sel("readability", "outline", '*')} { text-shadow: 0 1px 2px rgba(0,0,0,.75); }` },
      { id: "bold", name: "Bold Text", css: `${sel("readability", "bold", 'button, input, select, [data-vlc-region]')} { font-weight: 650 !important; }` },
      { id: "borders", name: "Strong Borders", css: `${sel("readability", "borders")} { --vlc-border-subtle: color-mix(in oklab, var(--vlc-text-primary) 18%, transparent); --vlc-border-normal: color-mix(in oklab, var(--vlc-text-primary) 30%, transparent); --vlc-border-strong: color-mix(in oklab, var(--vlc-text-primary) 48%, transparent); }` },
      { id: "maximum", name: "Maximum", css: `${sel("readability", "maximum")} { --vlc-text-primary:#fff; --vlc-text-secondary:rgba(255,255,255,.84); --vlc-text-ghost:rgba(255,255,255,.62); --vlc-border-normal:rgba(255,255,255,.36); } ${sel("readability", "maximum", '*')} { text-shadow: 0 1px 2px rgba(0,0,0,.85); }` },
    ],
  },
];


export const GOD_DEFAULTS: Record<string, string> = Object.fromEntries(
  GOD_CATEGORIES.map((c) => [c.id, "default"]),
);

/** Build the CSS payload from the active selection map. Single string. */
export function buildGodModeCss(
  picks: Record<string, string>,
  customVars: Record<string, string>,
): string {
  const parts: string[] = [];
  for (const cat of GOD_CATEGORIES) {
    const opt = picks[cat.id] ?? "default";
    const found = cat.options.find((o) => o.id === opt);
    if (found && found.css) parts.push(found.css);
  }
  const vars = Object.entries(customVars).filter(([, v]) => v && v.trim());
  if (vars.length) {
    parts.push(
      `:root[data-vlc-skinned] {\n${vars.map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`,
    );
  }
  return parts.join("\n");
}

/** Tokens that the free-form God Mode customizer exposes. */
export const GOD_CUSTOM_TOKENS: { key: string; label: string; type: "color" | "text"; placeholder?: string }[] = [
  { key: "--vlc-bg-base", label: "Base background", type: "text", placeholder: "#101010 or gradient(...)" },
  { key: "--vlc-bg-surface", label: "Surface", type: "text" },
  { key: "--vlc-bg-elevated", label: "Elevated", type: "text" },
  { key: "--vlc-bg-sunken", label: "Sunken", type: "text" },
  { key: "--vlc-accent", label: "Accent", type: "color" },
  { key: "--vlc-accent-hover", label: "Accent hover", type: "color" },
  { key: "--vlc-seek-played", label: "Seek played", type: "text" },
  { key: "--vlc-seek-thumb", label: "Seek thumb", type: "color" },
  { key: "--vlc-text-primary", label: "Text primary", type: "color" },
  { key: "--vlc-text-secondary", label: "Text secondary", type: "text" },
  { key: "--vlc-border-normal", label: "Border", type: "text" },
  { key: "--vlc-font-ui", label: "Font family", type: "text", placeholder: "'Inter', sans-serif" },
];
