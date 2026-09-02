// PREMIUM WAVE — 10 flagship visual-system themes (Glassmorph, Neumorph,
// Claymorph, Aurora, Neo-Brutalist, Skeuomorph, Holo-Chrome, Retro CRT,
// Substrate, Blueprint). Each theme is authored like midnight-linear:
// per-region CSS scoped under [data-skin="<id>"] that touches title bar,
// menu, seekbar, control bar, buttons, panels, playlist, inputs, sliders.
// Marked tier: "premium" so they pin to the top of the gallery with the
// gold PRO badge and are NOT fanned out into 8 accent variants.

import type { SkinHero } from "./types";

// Shared per-theme helper. Returns the "common shell" CSS every premium
// theme wants: overflow allowance on skinned regions (so heavy shadows
// don't get clipped), button transition base, focus ring reset, timecode
// tabular-nums. Signature-specific CSS is composed on top.
const shell = (id: string, extra: string) => `
  [data-skin="${id}"] { color-scheme: var(--vlc-color-scheme, dark); }
  [data-skin="${id}"] [data-vlc-region] { overflow: visible; }
  [data-skin="${id}"] [data-vlc-region="control"] button,
  [data-skin="${id}"] [data-vlc-region="menu"] button,
  [data-skin="${id}"] [data-vlc-region="title"] button {
    transition: transform 120ms ease, background 160ms ease, box-shadow 220ms ease, color 160ms ease, border-color 160ms ease;
  }
  [data-skin="${id}"] [data-vlc-region="control"] button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--vlc-accent-dim);
  }
  [data-skin="${id}"] [data-vlc-region="control"] [style*="vlc-font-mono"],
  [data-skin="${id}"] .vlc-num { font-variant-numeric: tabular-nums; }
  ${extra}
`;

export const PREMIUM_WAVE: SkinHero[] = [
  // ─── 1. GLASSMORPH AURORA ──────────────────────────────────────────
  {
    id: "pw-glass-aurora",
    name: "Glassmorph Aurora",
    tagline: "Frosted translucent chrome floating on an aurora mesh.",
    tier: "premium",
    tags: ["premium", "glass", "aurora", "blur", "modern"],
    tokens: {
      "--vlc-bg-base": "#070b1d",
      "--vlc-bg-surface": "rgba(255,255,255,0.08)",
      "--vlc-bg-elevated": "rgba(255,255,255,0.14)",
      "--vlc-bg-sunken": "rgba(0,0,0,0.35)",
      "--vlc-border-subtle": "rgba(255,255,255,0.10)",
      "--vlc-border-normal": "rgba(255,255,255,0.22)",
      "--vlc-border-strong": "rgba(255,255,255,0.34)",
      "--vlc-text-primary": "#f6f8ff",
      "--vlc-text-secondary": "rgba(246,248,255,0.78)",
      "--vlc-text-ghost": "rgba(246,248,255,0.55)",
      "--vlc-accent": "#7dd3fc",
      "--vlc-accent-hover": "#a5e4ff",
      "--vlc-accent-dim": "rgba(125,211,252,0.22)",
      "--vlc-accent-text": "#bfe9ff",
      "--vlc-seek-played": "linear-gradient(90deg,#7dd3fc,#a78bfa,#f0abfc)",
      "--vlc-seek-thumb": "#ffffff",
      "--vlc-font-ui": '"Inter Tight","Inter",system-ui,sans-serif',
      "--vlc-radius-sm": "10px",
      "--vlc-radius-md": "16px",
      "--vlc-radius-lg": "22px",
      "--vlc-control-radius": "14px",
    },
    extraCss: shell("pw-glass-aurora", `
      /* Aurora background painted BEHIND the app so glass has something to blur */
      [data-skin="pw-glass-aurora"] body,
      [data-skin="pw-glass-aurora"] {
        background:
          radial-gradient(60% 50% at 15% 20%, rgba(125,211,252,0.55), transparent 60%),
          radial-gradient(50% 45% at 85% 30%, rgba(167,139,250,0.55), transparent 60%),
          radial-gradient(60% 50% at 50% 90%, rgba(236,72,153,0.42), transparent 60%),
          #070b1d;
        background-attachment: fixed;
      }
      [data-skin="pw-glass-aurora"] [data-vlc-region="title"],
      [data-skin="pw-glass-aurora"] [data-vlc-region="menu"],
      [data-skin="pw-glass-aurora"] [data-vlc-region="control"],
      [data-skin="pw-glass-aurora"] [data-vlc-region="panel"],
      [data-skin="pw-glass-aurora"] [data-vlc-region="playlist"] {
        background: rgba(255,255,255,0.08) !important;
        backdrop-filter: blur(28px) saturate(180%);
        -webkit-backdrop-filter: blur(28px) saturate(180%);
        border: 1px solid rgba(255,255,255,0.18);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 12px 40px rgba(4,7,20,0.55);
      }
      [data-skin="pw-glass-aurora"] [data-vlc-region="panel"],
      [data-skin="pw-glass-aurora"] [data-vlc-region="playlist"] {
        border-radius: var(--vlc-radius-lg) !important;
      }
      [data-skin="pw-glass-aurora"] [data-vlc-region="control"] button {
        background: rgba(255,255,255,0.06) !important;
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: var(--vlc-control-radius) !important;
      }
      [data-skin="pw-glass-aurora"] [data-vlc-region="control"] button:hover {
        background: rgba(255,255,255,0.16) !important;
        transform: translateY(-1px);
      }
      [data-skin="pw-glass-aurora"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-glass-aurora"] [data-vlc-region="control"] button[title^="Pause"] {
        background: linear-gradient(135deg,#7dd3fc,#a78bfa) !important;
        color: #0a0f24 !important;
        border: none;
        box-shadow: 0 0 24px rgba(125,211,252,0.55), inset 0 1px 0 rgba(255,255,255,0.6);
      }
      [data-skin="pw-glass-aurora"] [data-vlc-track] { height: 4px !important; border-radius: 999px; background: rgba(255,255,255,0.14) !important; }
      [data-skin="pw-glass-aurora"] [data-vlc-region="seek"]:hover [data-vlc-track] { height: 8px !important; }
      [data-skin="pw-glass-aurora"] [data-vlc-played] { background: linear-gradient(90deg,#7dd3fc,#a78bfa,#f0abfc) !important; box-shadow: 0 0 14px rgba(167,139,250,0.7); }
      [data-skin="pw-glass-aurora"] input, [data-skin="pw-glass-aurora"] textarea, [data-skin="pw-glass-aurora"] select {
        background: rgba(255,255,255,0.08) !important;
        border: 1px solid rgba(255,255,255,0.20) !important;
        color: #f6f8ff !important;
        border-radius: var(--vlc-radius-sm) !important;
        backdrop-filter: blur(12px);
      }
    `),
  },

  // ─── 2. NEUMORPH FOG ──────────────────────────────────────────────
  {
    id: "pw-neumorph-fog",
    name: "Neumorph Fog",
    tagline: "Soft extruded UI with matched ambient shadows.",
    tier: "premium",
    tags: ["premium", "neumorph", "soft", "light", "tactile"],
    tokens: {
      "--vlc-bg-base": "#e6ebf2",
      "--vlc-bg-surface": "#e6ebf2",
      "--vlc-bg-elevated": "#eef2f7",
      "--vlc-bg-sunken": "#d8dee6",
      "--vlc-border-subtle": "rgba(43,53,72,0.06)",
      "--vlc-border-normal": "rgba(43,53,72,0.10)",
      "--vlc-border-strong": "rgba(43,53,72,0.18)",
      "--vlc-text-primary": "#2b3548",
      "--vlc-text-secondary": "rgba(43,53,72,0.70)",
      "--vlc-text-ghost": "rgba(43,53,72,0.45)",
      "--vlc-accent": "#6b7fd7",
      "--vlc-accent-hover": "#5468c7",
      "--vlc-accent-dim": "rgba(107,127,215,0.16)",
      "--vlc-accent-text": "#4a5db8",
      "--vlc-seek-played": "#6b7fd7",
      "--vlc-seek-thumb": "#ffffff",
      "--vlc-seek-track": "#d8dee6",
      "--vlc-font-ui": '"Manrope","Inter",system-ui,sans-serif',
      "--vlc-radius-sm": "12px",
      "--vlc-radius-md": "18px",
      "--vlc-radius-lg": "24px",
      "--vlc-control-radius": "16px",
      "--vlc-color-scheme": "light",
    },
    extraCss: shell("pw-neumorph-fog", `
      [data-skin="pw-neumorph-fog"] {
        background: #e6ebf2 !important;
      }
      [data-skin="pw-neumorph-fog"] [data-vlc-region="title"],
      [data-skin="pw-neumorph-fog"] [data-vlc-region="menu"] {
        background: #e6ebf2 !important;
        border: none;
        box-shadow: 0 8px 20px -12px #c8cdd4;
      }
      [data-skin="pw-neumorph-fog"] [data-vlc-region="control"] {
        background: #e6ebf2 !important;
        border-top: 1px solid #d8dee6;
        padding: 12px 20px !important;
      }
      [data-skin="pw-neumorph-fog"] [data-vlc-region="control"] button {
        background: #e6ebf2 !important;
        border: none !important;
        border-radius: 50% !important;
        color: #4a5db8 !important;
        box-shadow: 6px 6px 14px #c8cdd4, -6px -6px 14px #ffffff;
      }
      [data-skin="pw-neumorph-fog"] [data-vlc-region="control"] button:hover {
        color: #2b3548 !important;
      }
      [data-skin="pw-neumorph-fog"] [data-vlc-region="control"] button:active,
      [data-skin="pw-neumorph-fog"] [data-vlc-region="control"] button[aria-pressed="true"] {
        box-shadow: inset 4px 4px 10px #c8cdd4, inset -4px -4px 10px #ffffff !important;
        color: #6b7fd7 !important;
      }
      [data-skin="pw-neumorph-fog"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-neumorph-fog"] [data-vlc-region="control"] button[title^="Pause"] {
        width: 52px !important; height: 52px !important;
        background: linear-gradient(135deg,#8194e0,#6b7fd7) !important;
        color: #fff !important;
        box-shadow: 8px 8px 20px #c8cdd4, -8px -8px 20px #ffffff, inset 0 1px 0 rgba(255,255,255,0.4);
      }
      [data-skin="pw-neumorph-fog"] [data-vlc-region="panel"],
      [data-skin="pw-neumorph-fog"] [data-vlc-region="playlist"] {
        background: #e6ebf2 !important;
        border: none !important;
        border-radius: var(--vlc-radius-lg) !important;
        box-shadow: 12px 12px 30px #c8cdd4, -12px -12px 30px #ffffff !important;
        color: #2b3548;
      }
      [data-skin="pw-neumorph-fog"] [data-vlc-track] {
        background: #e6ebf2 !important;
        box-shadow: inset 3px 3px 6px #c8cdd4, inset -3px -3px 6px #ffffff !important;
        height: 10px !important;
        border-radius: 999px !important;
      }
      [data-skin="pw-neumorph-fog"] [data-vlc-played] {
        background: linear-gradient(90deg,#8194e0,#6b7fd7) !important;
        border-radius: 999px !important;
      }
      [data-skin="pw-neumorph-fog"] input, [data-skin="pw-neumorph-fog"] textarea, [data-skin="pw-neumorph-fog"] select {
        background: #e6ebf2 !important;
        border: none !important;
        color: #2b3548 !important;
        border-radius: var(--vlc-radius-sm) !important;
        box-shadow: inset 4px 4px 10px #c8cdd4, inset -4px -4px 10px #ffffff;
      }
    `),
  },

  // ─── 3. CLAYMORPH BUBBLE ──────────────────────────────────────────
  {
    id: "pw-claymorph",
    name: "Claymorph Bubble",
    tagline: "Inflatable pastel clay with playful bounce.",
    tier: "premium",
    tags: ["premium", "clay", "playful", "pastel", "bouncy"],
    tokens: {
      "--vlc-bg-base": "#f4ecff",
      "--vlc-bg-surface": "#ffffff",
      "--vlc-bg-elevated": "#ffffff",
      "--vlc-bg-sunken": "#e7dcff",
      "--vlc-border-subtle": "rgba(90,50,150,0.08)",
      "--vlc-border-normal": "rgba(90,50,150,0.14)",
      "--vlc-border-strong": "rgba(90,50,150,0.24)",
      "--vlc-text-primary": "#2f1b52",
      "--vlc-text-secondary": "rgba(47,27,82,0.72)",
      "--vlc-text-ghost": "rgba(47,27,82,0.48)",
      "--vlc-accent": "#a855f7",
      "--vlc-accent-hover": "#c084fc",
      "--vlc-accent-dim": "rgba(168,85,247,0.22)",
      "--vlc-accent-text": "#7e22ce",
      "--vlc-seek-played": "#a855f7",
      "--vlc-seek-thumb": "#ffffff",
      "--vlc-font-ui": '"Quicksand","Nunito",system-ui,sans-serif',
      "--vlc-radius-sm": "16px",
      "--vlc-radius-md": "22px",
      "--vlc-radius-lg": "28px",
      "--vlc-control-radius": "999px",
      "--vlc-color-scheme": "light",
    },
    extraCss: shell("pw-claymorph", `
      [data-skin="pw-claymorph"] { background: #f4ecff !important; font-weight: 600; }
      [data-skin="pw-claymorph"] [data-vlc-region="title"],
      [data-skin="pw-claymorph"] [data-vlc-region="menu"] {
        background: #ffffff !important;
        border-radius: 0 0 22px 22px !important;
        box-shadow: 0 12px 24px -8px rgba(168,85,247,0.28), inset 0 -6px 12px rgba(168,85,247,0.10);
        border: none;
      }
      [data-skin="pw-claymorph"] [data-vlc-region="control"] {
        background: #ffffff !important;
        border-radius: 28px 28px 0 0 !important;
        border: none;
        box-shadow: 0 -12px 24px -8px rgba(168,85,247,0.24), inset 0 6px 12px rgba(255,255,255,0.9);
        padding: 14px 20px !important;
      }
      [data-skin="pw-claymorph"] [data-vlc-region="control"] button {
        background: #ffffff !important;
        border: none !important;
        border-radius: 999px !important;
        color: #7e22ce !important;
        box-shadow: 0 6px 12px rgba(168,85,247,0.24), inset 0 -3px 6px rgba(168,85,247,0.14), inset 0 3px 6px rgba(255,255,255,0.95);
        transition: transform 220ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 220ms ease !important;
      }
      [data-skin="pw-claymorph"] [data-vlc-region="control"] button:hover {
        transform: scale(1.08);
        box-shadow: 0 10px 20px rgba(168,85,247,0.32), inset 0 -3px 6px rgba(168,85,247,0.16), inset 0 3px 6px rgba(255,255,255,0.95);
      }
      [data-skin="pw-claymorph"] [data-vlc-region="control"] button:active { transform: scale(0.94); }
      [data-skin="pw-claymorph"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-claymorph"] [data-vlc-region="control"] button[title^="Pause"] {
        width: 56px !important; height: 56px !important;
        background: linear-gradient(145deg,#c084fc,#a855f7) !important;
        color: #fff !important;
        box-shadow: 0 12px 24px rgba(168,85,247,0.40), inset 0 -6px 12px rgba(90,20,180,0.32), inset 0 6px 12px rgba(255,255,255,0.5);
      }
      [data-skin="pw-claymorph"] [data-vlc-region="panel"],
      [data-skin="pw-claymorph"] [data-vlc-region="playlist"] {
        background: #ffffff !important;
        border: none !important;
        border-radius: 28px !important;
        box-shadow: 0 20px 40px rgba(168,85,247,0.24), inset 0 -8px 16px rgba(168,85,247,0.10), inset 0 8px 16px rgba(255,255,255,0.9) !important;
        color: #2f1b52;
      }
      [data-skin="pw-claymorph"] [data-vlc-track] {
        height: 10px !important;
        background: #e7dcff !important;
        border-radius: 999px !important;
        box-shadow: inset 0 3px 6px rgba(168,85,247,0.20);
      }
      [data-skin="pw-claymorph"] [data-vlc-played] {
        background: linear-gradient(90deg,#c084fc,#a855f7,#ec4899) !important;
        border-radius: 999px !important;
        box-shadow: 0 2px 6px rgba(168,85,247,0.5);
      }
      [data-skin="pw-claymorph"] input, [data-skin="pw-claymorph"] textarea, [data-skin="pw-claymorph"] select {
        background: #f4ecff !important;
        border: none !important;
        border-radius: 16px !important;
        color: #2f1b52 !important;
        box-shadow: inset 0 4px 8px rgba(168,85,247,0.16), inset 0 -2px 4px rgba(255,255,255,0.6);
      }
    `),
  },

  // ─── 4. AURORA FLOW ───────────────────────────────────────────────
  {
    id: "pw-aurora-flow",
    name: "Aurora Flow",
    tagline: "Animated conic aurora with glowing accent halos.",
    tier: "premium",
    tags: ["premium", "aurora", "animated", "vibrant", "gradient"],
    tokens: {
      "--vlc-bg-base": "#0a0520",
      "--vlc-bg-surface": "rgba(20,10,50,0.72)",
      "--vlc-bg-elevated": "rgba(30,15,70,0.82)",
      "--vlc-bg-sunken": "#050110",
      "--vlc-border-subtle": "rgba(236,72,153,0.14)",
      "--vlc-border-normal": "rgba(236,72,153,0.28)",
      "--vlc-border-strong": "rgba(236,72,153,0.48)",
      "--vlc-text-primary": "#fdf4ff",
      "--vlc-text-secondary": "rgba(253,244,255,0.80)",
      "--vlc-text-ghost": "rgba(253,244,255,0.55)",
      "--vlc-accent": "#ec4899",
      "--vlc-accent-hover": "#f472b6",
      "--vlc-accent-dim": "rgba(236,72,153,0.24)",
      "--vlc-accent-text": "#f9a8d4",
      "--vlc-seek-played": "linear-gradient(90deg,#22d3ee,#a855f7,#ec4899)",
      "--vlc-seek-thumb": "#ffffff",
      "--vlc-font-ui": '"Syne","Space Grotesk","Inter",sans-serif',
      "--vlc-radius-sm": "8px",
      "--vlc-radius-md": "14px",
      "--vlc-radius-lg": "20px",
    },
    extraCss: shell("pw-aurora-flow", `
      @keyframes pw-aurora-drift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      [data-skin="pw-aurora-flow"], [data-skin="pw-aurora-flow"] body {
        background:
          conic-gradient(from 180deg at 50% 50%, #22d3ee 0deg, #a855f7 120deg, #ec4899 240deg, #22d3ee 360deg),
          #0a0520;
        background-size: 300% 300%;
        background-attachment: fixed;
        animation: pw-aurora-drift 40s ease-in-out infinite;
      }
      [data-skin="pw-aurora-flow"] [data-vlc-region="title"],
      [data-skin="pw-aurora-flow"] [data-vlc-region="menu"],
      [data-skin="pw-aurora-flow"] [data-vlc-region="control"],
      [data-skin="pw-aurora-flow"] [data-vlc-region="panel"],
      [data-skin="pw-aurora-flow"] [data-vlc-region="playlist"] {
        background: rgba(10,5,30,0.72) !important;
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border: 1px solid rgba(236,72,153,0.24);
      }
      [data-skin="pw-aurora-flow"] [data-vlc-region="control"] button:hover {
        color: #f9a8d4 !important;
        box-shadow: 0 0 20px rgba(236,72,153,0.55);
      }
      [data-skin="pw-aurora-flow"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-aurora-flow"] [data-vlc-region="control"] button[title^="Pause"] {
        background: linear-gradient(135deg,#22d3ee,#a855f7,#ec4899) !important;
        color: #fff !important;
        border-radius: 999px !important;
        box-shadow: 0 0 24px rgba(236,72,153,0.65), 0 0 48px rgba(168,85,247,0.35);
      }
      [data-skin="pw-aurora-flow"] [data-vlc-played] { background: linear-gradient(90deg,#22d3ee,#a855f7,#ec4899) !important; box-shadow: 0 0 12px rgba(236,72,153,0.7); }
    `),
  },

  // ─── 5. NEO-BRUTALIST SIGNAL ──────────────────────────────────────
  {
    id: "pw-neo-brutal",
    name: "Neo-Brutal Signal",
    tagline: "3px black borders. Hard offset shadows. Neon yellow.",
    tier: "premium",
    tags: ["premium", "brutalist", "sharp", "bold", "neon"],
    tokens: {
      "--vlc-bg-base": "#faf7ed",
      "--vlc-bg-surface": "#ffffff",
      "--vlc-bg-elevated": "#ffffff",
      "--vlc-bg-sunken": "#f4efdc",
      "--vlc-border-subtle": "#000000",
      "--vlc-border-normal": "#000000",
      "--vlc-border-strong": "#000000",
      "--vlc-text-primary": "#000000",
      "--vlc-text-secondary": "#111111",
      "--vlc-text-ghost": "#444444",
      "--vlc-accent": "#facc15",
      "--vlc-accent-hover": "#eab308",
      "--vlc-accent-dim": "#fef08a",
      "--vlc-accent-text": "#000000",
      "--vlc-seek-played": "#facc15",
      "--vlc-seek-thumb": "#000000",
      "--vlc-seek-track": "#ffffff",
      "--vlc-font-ui": '"Space Grotesk","Inter",sans-serif',
      "--vlc-radius-sm": "0px",
      "--vlc-radius-md": "0px",
      "--vlc-radius-lg": "0px",
      "--vlc-control-radius": "0px",
      "--vlc-color-scheme": "light",
    },
    extraCss: shell("pw-neo-brutal", `
      [data-skin="pw-neo-brutal"] { background: #faf7ed !important; font-weight: 700; }
      [data-skin="pw-neo-brutal"] [data-vlc-region="title"],
      [data-skin="pw-neo-brutal"] [data-vlc-region="menu"] {
        background: #ffffff !important;
        border-bottom: 3px solid #000 !important;
        color: #000;
      }
      [data-skin="pw-neo-brutal"] [data-vlc-region="control"] {
        background: #ffffff !important;
        border-top: 3px solid #000 !important;
        padding: 10px 14px !important;
        gap: 8px;
      }
      [data-skin="pw-neo-brutal"] [data-vlc-region="control"] button {
        background: #ffffff !important;
        border: 3px solid #000 !important;
        border-radius: 0 !important;
        color: #000 !important;
        box-shadow: 3px 3px 0 #000 !important;
        font-weight: 800;
      }
      [data-skin="pw-neo-brutal"] [data-vlc-region="control"] button:hover {
        background: #facc15 !important;
        transform: translate(-1px,-1px);
        box-shadow: 4px 4px 0 #000 !important;
      }
      [data-skin="pw-neo-brutal"] [data-vlc-region="control"] button:active {
        transform: translate(2px,2px);
        box-shadow: 1px 1px 0 #000 !important;
      }
      [data-skin="pw-neo-brutal"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-neo-brutal"] [data-vlc-region="control"] button[title^="Pause"] {
        background: #facc15 !important;
        color: #000 !important;
        border: 3px solid #000 !important;
        box-shadow: 4px 4px 0 #000 !important;
      }
      [data-skin="pw-neo-brutal"] [data-vlc-region="panel"],
      [data-skin="pw-neo-brutal"] [data-vlc-region="playlist"] {
        background: #ffffff !important;
        border: 3px solid #000 !important;
        border-radius: 0 !important;
        box-shadow: 6px 6px 0 #000 !important;
        color: #000;
      }
      [data-skin="pw-neo-brutal"] [data-vlc-track] {
        height: 12px !important;
        background: #ffffff !important;
        border: 3px solid #000 !important;
        border-radius: 0 !important;
      }
      [data-skin="pw-neo-brutal"] [data-vlc-played] { background: #facc15 !important; border-radius: 0 !important; }
      [data-skin="pw-neo-brutal"] input, [data-skin="pw-neo-brutal"] textarea, [data-skin="pw-neo-brutal"] select {
        background: #ffffff !important;
        border: 3px solid #000 !important;
        border-radius: 0 !important;
        color: #000 !important;
        box-shadow: 3px 3px 0 #000;
      }
      [data-skin="pw-neo-brutal"] h1, [data-skin="pw-neo-brutal"] h2, [data-skin="pw-neo-brutal"] h3 { text-transform: uppercase; letter-spacing: -0.02em; font-weight: 900; }
    `),
  },

  // ─── 6. SKEUOMORPH CHROME PLATE ───────────────────────────────────
  {
    id: "pw-skeuo-chrome",
    name: "Skeuomorph Chrome",
    tagline: "Brushed metal plates with glossy tactile buttons.",
    tier: "premium",
    tags: ["premium", "skeuo", "chrome", "metal", "tactile"],
    tokens: {
      "--vlc-bg-base": "#3a3d42",
      "--vlc-bg-surface": "linear-gradient(180deg,#5c6068 0%,#3a3d42 100%)",
      "--vlc-bg-elevated": "linear-gradient(180deg,#6e7278 0%,#4a4e54 100%)",
      "--vlc-bg-sunken": "#242629",
      "--vlc-border-subtle": "rgba(0,0,0,0.35)",
      "--vlc-border-normal": "rgba(0,0,0,0.55)",
      "--vlc-border-strong": "rgba(0,0,0,0.7)",
      "--vlc-text-primary": "#f3f4f6",
      "--vlc-text-secondary": "rgba(243,244,246,0.88)",
      "--vlc-text-ghost": "rgba(243,244,246,0.58)",
      "--vlc-accent": "#38bdf8",
      "--vlc-accent-hover": "#7dd3fc",
      "--vlc-accent-dim": "rgba(56,189,248,0.20)",
      "--vlc-accent-text": "#bae6fd",
      "--vlc-seek-played": "linear-gradient(180deg,#7dd3fc,#38bdf8)",
      "--vlc-seek-thumb": "linear-gradient(180deg,#ffffff,#c8ccd2)",
      "--vlc-font-ui": '"Inter",system-ui,sans-serif',
      "--vlc-radius-sm": "5px",
      "--vlc-radius-md": "8px",
      "--vlc-radius-lg": "10px",
      "--vlc-control-radius": "6px",
    },
    extraCss: shell("pw-skeuo-chrome", `
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="title"],
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="menu"],
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="control"] {
        background:
          linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.20) 100%),
          linear-gradient(180deg,#5c6068 0%,#3a3d42 100%) !important;
        border-top: 1px solid rgba(255,255,255,0.14);
        border-bottom: 1px solid rgba(0,0,0,0.5);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.4);
      }
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="control"] button {
        background:
          linear-gradient(180deg,#7a7e86 0%,#4a4e54 55%,#3a3d42 100%) !important;
        border: 1px solid #1e2024 !important;
        border-radius: 6px !important;
        color: #f3f4f6 !important;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 1px 2px rgba(0,0,0,0.55);
        text-shadow: 0 -1px 0 rgba(0,0,0,0.55);
      }
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="control"] button:hover {
        background: linear-gradient(180deg,#8a8e96 0%,#5a5e64 55%,#4a4d52 100%) !important;
      }
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="control"] button:active {
        background: linear-gradient(180deg,#3a3d42 0%,#4a4e54 55%,#5a5e64 100%) !important;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
      }
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="control"] button[title^="Pause"] {
        background: linear-gradient(180deg,#7dd3fc 0%,#38bdf8 55%,#0284c7 100%) !important;
        border: 1px solid #0369a1 !important;
        color: #06263a !important;
        text-shadow: 0 1px 0 rgba(255,255,255,0.4);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), 0 2px 4px rgba(0,0,0,0.5);
      }
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="panel"],
      [data-skin="pw-skeuo-chrome"] [data-vlc-region="playlist"] {
        background: linear-gradient(180deg,#4a4e54 0%,#2f3237 100%) !important;
        border: 1px solid #1e2024 !important;
        border-radius: 8px !important;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 12px 32px rgba(0,0,0,0.55) !important;
        color: #f3f4f6;
      }
      [data-skin="pw-skeuo-chrome"] [data-vlc-track] {
        height: 8px !important;
        background: linear-gradient(180deg,#1e2024,#2c2f34) !important;
        border: 1px solid #14161a !important;
        border-radius: 999px !important;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.7);
      }
      [data-skin="pw-skeuo-chrome"] [data-vlc-played] { background: linear-gradient(180deg,#7dd3fc,#0284c7) !important; border-radius: 999px !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.4); }
      [data-skin="pw-skeuo-chrome"] .vlc-num, [data-skin="pw-skeuo-chrome"] [data-vlc-region="control"] [style*="vlc-font-mono"] {
        background: #0a1420; color: #7dd3fc;
        padding: 2px 8px; border-radius: 3px;
        border: 1px solid #000; box-shadow: inset 0 1px 4px rgba(0,0,0,0.8);
        font-family: "Share Tech Mono", "VT323", monospace;
        text-shadow: 0 0 6px rgba(125,211,252,0.7);
      }
    `),
  },

  // ─── 7. HOLO CHROME ───────────────────────────────────────────────
  {
    id: "pw-holo-chrome",
    name: "Holo Chrome",
    tagline: "Iridescent rainbow foil on obsidian.",
    tier: "premium",
    tags: ["premium", "holo", "iridescent", "chrome", "rainbow"],
    tokens: {
      "--vlc-bg-base": "#0b0b12",
      "--vlc-bg-surface": "#141420",
      "--vlc-bg-elevated": "#1c1c2c",
      "--vlc-bg-sunken": "#050508",
      "--vlc-border-subtle": "rgba(255,255,255,0.12)",
      "--vlc-border-normal": "rgba(255,255,255,0.22)",
      "--vlc-border-strong": "rgba(255,255,255,0.38)",
      "--vlc-text-primary": "#f8fafc",
      "--vlc-text-secondary": "rgba(248,250,252,0.80)",
      "--vlc-text-ghost": "rgba(248,250,252,0.55)",
      "--vlc-accent": "#a5f3fc",
      "--vlc-accent-hover": "#e0f7fa",
      "--vlc-accent-dim": "rgba(165,243,252,0.22)",
      "--vlc-accent-text": "#e0f7fa",
      "--vlc-seek-played": "conic-gradient(from 0deg,#f0abfc,#a5f3fc,#fde68a,#c4b5fd,#f0abfc)",
      "--vlc-seek-thumb": "#ffffff",
      "--vlc-font-ui": '"Inter Tight","Inter",sans-serif',
      "--vlc-radius-sm": "6px",
      "--vlc-radius-md": "12px",
      "--vlc-radius-lg": "16px",
    },
    extraCss: shell("pw-holo-chrome", `
      @keyframes pw-holo-sheen { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
      [data-skin="pw-holo-chrome"] [data-vlc-region="title"],
      [data-skin="pw-holo-chrome"] [data-vlc-region="menu"],
      [data-skin="pw-holo-chrome"] [data-vlc-region="control"] {
        background:
          linear-gradient(90deg, rgba(240,171,252,0.14), rgba(165,243,252,0.14), rgba(253,230,138,0.14), rgba(196,181,253,0.14), rgba(240,171,252,0.14)),
          #141420 !important;
        background-size: 300% 100%;
        animation: pw-holo-sheen 16s linear infinite;
        border-bottom: 1px solid rgba(255,255,255,0.14);
      }
      [data-skin="pw-holo-chrome"] [data-vlc-region="control"] button {
        background: rgba(255,255,255,0.04) !important;
        border: 1px solid rgba(255,255,255,0.12) !important;
        color: #f8fafc !important;
      }
      [data-skin="pw-holo-chrome"] [data-vlc-region="control"] button:hover {
        background:
          linear-gradient(90deg,#f0abfc33,#a5f3fc33,#fde68a33,#c4b5fd33) !important;
        border-color: rgba(255,255,255,0.28) !important;
        color: #fff !important;
      }
      [data-skin="pw-holo-chrome"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-holo-chrome"] [data-vlc-region="control"] button[title^="Pause"] {
        background: conic-gradient(from 0deg,#f0abfc,#a5f3fc,#fde68a,#c4b5fd,#f0abfc) !important;
        color: #0b0b12 !important;
        border: none !important;
        border-radius: 999px !important;
        box-shadow: 0 0 20px rgba(240,171,252,0.55), inset 0 1px 0 rgba(255,255,255,0.6);
      }
      [data-skin="pw-holo-chrome"] [data-vlc-region="panel"],
      [data-skin="pw-holo-chrome"] [data-vlc-region="playlist"] {
        background: #141420 !important;
        border: 1px solid rgba(255,255,255,0.14) !important;
        border-radius: 16px !important;
        box-shadow: 0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.14) !important;
        color: #f8fafc;
      }
      [data-skin="pw-holo-chrome"] [data-vlc-track] { height: 6px !important; background: rgba(255,255,255,0.10) !important; border-radius: 999px !important; }
      [data-skin="pw-holo-chrome"] [data-vlc-played] {
        background: linear-gradient(90deg,#f0abfc,#a5f3fc,#fde68a,#c4b5fd) !important;
        background-size: 300% 100%;
        animation: pw-holo-sheen 8s linear infinite;
        border-radius: 999px !important;
      }
    `),
  },

  // ─── 8. RETRO CRT SYNTHWAVE ───────────────────────────────────────
  {
    id: "pw-retro-crt",
    name: "Retro CRT Synthwave",
    tagline: "Magenta grid. Cyan glow. Scanlines.",
    tier: "premium",
    tags: ["premium", "crt", "synthwave", "retro", "neon"],
    tokens: {
      "--vlc-bg-base": "#0a0018",
      "--vlc-bg-surface": "#12002a",
      "--vlc-bg-elevated": "#1a0038",
      "--vlc-bg-sunken": "#050010",
      "--vlc-border-subtle": "rgba(236,72,153,0.20)",
      "--vlc-border-normal": "rgba(236,72,153,0.40)",
      "--vlc-border-strong": "rgba(236,72,153,0.65)",
      "--vlc-text-primary": "#ffe4f9",
      "--vlc-text-secondary": "#a5f3fc",
      "--vlc-text-ghost": "rgba(255,228,249,0.55)",
      "--vlc-accent": "#ec4899",
      "--vlc-accent-hover": "#f472b6",
      "--vlc-accent-dim": "rgba(236,72,153,0.24)",
      "--vlc-accent-text": "#22d3ee",
      "--vlc-seek-played": "linear-gradient(90deg,#ec4899,#22d3ee)",
      "--vlc-seek-thumb": "#22d3ee",
      "--vlc-font-ui": '"VT323","Share Tech Mono","JetBrains Mono",monospace',
      "--vlc-radius-sm": "2px",
      "--vlc-radius-md": "4px",
      "--vlc-radius-lg": "6px",
      "--vlc-control-radius": "2px",
    },
    extraCss: shell("pw-retro-crt", `
      [data-skin="pw-retro-crt"] {
        background:
          linear-gradient(180deg,#0a0018 0%,#1a0038 60%,#2a0055 100%) !important;
        background-attachment: fixed;
      }
      [data-skin="pw-retro-crt"] [data-vlc-region="title"],
      [data-skin="pw-retro-crt"] [data-vlc-region="menu"],
      [data-skin="pw-retro-crt"] [data-vlc-region="control"],
      [data-skin="pw-retro-crt"] [data-vlc-region="panel"],
      [data-skin="pw-retro-crt"] [data-vlc-region="playlist"] {
        background:
          repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 2px, transparent 2px 4px),
          linear-gradient(180deg,#12002a,#1a0038) !important;
        border: 1px solid #ec4899 !important;
        color: #ffe4f9;
        text-shadow: 0 0 4px rgba(236,72,153,0.6);
        font-size: 15px;
      }
      [data-skin="pw-retro-crt"] [data-vlc-region="control"] button {
        background: transparent !important;
        border: 1px solid #ec4899 !important;
        color: #22d3ee !important;
        text-shadow: 0 0 6px rgba(34,211,238,0.7);
        border-radius: 2px !important;
      }
      [data-skin="pw-retro-crt"] [data-vlc-region="control"] button:hover {
        background: rgba(236,72,153,0.20) !important;
        color: #f472b6 !important;
        box-shadow: 0 0 12px rgba(236,72,153,0.7);
      }
      [data-skin="pw-retro-crt"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-retro-crt"] [data-vlc-region="control"] button[title^="Pause"] {
        background: rgba(236,72,153,0.25) !important;
        border: 2px solid #ec4899 !important;
        color: #22d3ee !important;
        box-shadow: 0 0 20px rgba(236,72,153,0.75), inset 0 0 12px rgba(34,211,238,0.35);
      }
      [data-skin="pw-retro-crt"] [data-vlc-track] { height: 4px !important; background: #050010 !important; border: 1px solid #ec4899 !important; border-radius: 0 !important; }
      [data-skin="pw-retro-crt"] [data-vlc-played] { background: linear-gradient(90deg,#ec4899,#22d3ee) !important; box-shadow: 0 0 8px #ec4899, 0 0 16px #22d3ee; border-radius: 0 !important; }
      [data-skin="pw-retro-crt"] input, [data-skin="pw-retro-crt"] textarea, [data-skin="pw-retro-crt"] select {
        background: #050010 !important;
        border: 1px solid #ec4899 !important;
        color: #22d3ee !important;
        border-radius: 2px !important;
        font-family: "VT323",monospace;
        font-size: 15px;
        text-shadow: 0 0 4px rgba(34,211,238,0.6);
      }
    `),
  },

  // ─── 9. SUBSTRATE DEPTH ───────────────────────────────────────────
  {
    id: "pw-substrate",
    name: "Substrate Depth",
    tagline: "Distinct depth zones. Calm neutrals. Best readability.",
    tier: "premium",
    tags: ["premium", "neutral", "depth", "layered", "quiet"],
    tokens: {
      "--vlc-bg-base": "#141518",
      "--vlc-bg-surface": "#1c1e22",
      "--vlc-bg-elevated": "#26282e",
      "--vlc-bg-sunken": "#0d0e10",
      "--vlc-border-subtle": "rgba(255,255,255,0.05)",
      "--vlc-border-normal": "rgba(255,255,255,0.10)",
      "--vlc-border-strong": "rgba(255,255,255,0.18)",
      "--vlc-text-primary": "#f0f0f2",
      "--vlc-text-secondary": "rgba(240,240,242,0.78)",
      "--vlc-text-ghost": "rgba(240,240,242,0.52)",
      "--vlc-accent": "#f97316",
      "--vlc-accent-hover": "#fb923c",
      "--vlc-accent-dim": "rgba(249,115,22,0.18)",
      "--vlc-accent-text": "#fdba74",
      "--vlc-seek-played": "#f97316",
      "--vlc-seek-thumb": "#ffffff",
      "--vlc-font-ui": '"Inter",system-ui,sans-serif',
      "--vlc-radius-sm": "8px",
      "--vlc-radius-md": "12px",
      "--vlc-radius-lg": "16px",
      "--vlc-control-radius": "10px",
    },
    extraCss: shell("pw-substrate", `
      [data-skin="pw-substrate"] [data-vlc-region="title"] {
        background: #1c1e22 !important;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      [data-skin="pw-substrate"] [data-vlc-region="menu"] {
        background: #22242a !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.40);
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      [data-skin="pw-substrate"] [data-vlc-region="control"] {
        background: #1c1e22 !important;
        box-shadow: 0 -4px 12px rgba(0,0,0,0.40);
        border-top: 1px solid rgba(255,255,255,0.05);
      }
      [data-skin="pw-substrate"] [data-vlc-region="control"] button {
        background: #26282e !important;
        border: 1px solid rgba(255,255,255,0.06) !important;
        border-radius: 10px !important;
        color: #f0f0f2 !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05);
      }
      [data-skin="pw-substrate"] [data-vlc-region="control"] button:hover {
        background: #2f3138 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
      }
      [data-skin="pw-substrate"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-substrate"] [data-vlc-region="control"] button[title^="Pause"] {
        background: linear-gradient(180deg,#fb923c,#f97316) !important;
        color: #1a0f04 !important;
        border: none !important;
        border-radius: 999px !important;
        box-shadow: 0 6px 16px rgba(249,115,22,0.45), inset 0 1px 0 rgba(255,255,255,0.3);
      }
      [data-skin="pw-substrate"] [data-vlc-region="panel"],
      [data-skin="pw-substrate"] [data-vlc-region="playlist"] {
        background: #26282e !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
        border-radius: 14px !important;
        box-shadow: 0 20px 48px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        color: #f0f0f2;
      }
      [data-skin="pw-substrate"] [data-vlc-track] { height: 4px !important; background: #0d0e10 !important; border-radius: 999px !important; box-shadow: inset 0 1px 2px rgba(0,0,0,0.6); }
      [data-skin="pw-substrate"] [data-vlc-region="seek"]:hover [data-vlc-track] { height: 8px !important; }
      [data-skin="pw-substrate"] [data-vlc-played] { background: #f97316 !important; border-radius: 999px !important; box-shadow: 0 0 12px rgba(249,115,22,0.5); }
    `),
  },

  // ─── 10. BLUEPRINT ────────────────────────────────────────────────
  {
    id: "pw-blueprint",
    name: "Blueprint",
    tagline: "Technical drawing. Grid paper. IBM Plex Mono.",
    tier: "premium",
    tags: ["premium", "blueprint", "technical", "mono", "grid"],
    tokens: {
      "--vlc-bg-base": "#0d3b66",
      "--vlc-bg-surface": "#0f4a80",
      "--vlc-bg-elevated": "#125792",
      "--vlc-bg-sunken": "#0a2e50",
      "--vlc-border-subtle": "rgba(255,255,255,0.14)",
      "--vlc-border-normal": "rgba(255,255,255,0.30)",
      "--vlc-border-strong": "rgba(255,255,255,0.55)",
      "--vlc-text-primary": "#f0f8ff",
      "--vlc-text-secondary": "rgba(240,248,255,0.80)",
      "--vlc-text-ghost": "rgba(240,248,255,0.55)",
      "--vlc-accent": "#fde047",
      "--vlc-accent-hover": "#fef08a",
      "--vlc-accent-dim": "rgba(253,224,71,0.20)",
      "--vlc-accent-text": "#fef9c3",
      "--vlc-seek-played": "#fde047",
      "--vlc-seek-thumb": "#ffffff",
      "--vlc-font-ui": '"IBM Plex Mono","JetBrains Mono",ui-monospace,monospace',
      "--vlc-font-mono": '"IBM Plex Mono","JetBrains Mono",ui-monospace,monospace',
      "--vlc-radius-sm": "0px",
      "--vlc-radius-md": "2px",
      "--vlc-radius-lg": "3px",
      "--vlc-control-radius": "0px",
    },
    extraCss: shell("pw-blueprint", `
      [data-skin="pw-blueprint"] {
        background:
          repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 40px),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 40px),
          repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 8px),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 8px),
          #0d3b66 !important;
        background-attachment: fixed;
        font-size: 12.5px;
        letter-spacing: 0.02em;
      }
      [data-skin="pw-blueprint"] [data-vlc-region="title"],
      [data-skin="pw-blueprint"] [data-vlc-region="menu"],
      [data-skin="pw-blueprint"] [data-vlc-region="control"] {
        background: transparent !important;
        border: 1px solid rgba(255,255,255,0.30) !important;
        color: #f0f8ff;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 11px;
      }
      [data-skin="pw-blueprint"] [data-vlc-region="control"] button {
        background: transparent !important;
        border: 1px solid rgba(255,255,255,0.40) !important;
        border-radius: 0 !important;
        color: #f0f8ff !important;
      }
      [data-skin="pw-blueprint"] [data-vlc-region="control"] button:hover {
        background: rgba(253,224,71,0.14) !important;
        border-color: #fde047 !important;
        color: #fde047 !important;
      }
      [data-skin="pw-blueprint"] [data-vlc-region="control"] button[title^="Play"],
      [data-skin="pw-blueprint"] [data-vlc-region="control"] button[title^="Pause"] {
        background: #fde047 !important;
        color: #0d3b66 !important;
        border: 1px solid #fde047 !important;
        box-shadow: 0 0 0 3px rgba(253,224,71,0.20);
      }
      [data-skin="pw-blueprint"] [data-vlc-region="panel"],
      [data-skin="pw-blueprint"] [data-vlc-region="playlist"] {
        background: rgba(13,59,102,0.94) !important;
        border: 1px solid rgba(255,255,255,0.40) !important;
        border-radius: 0 !important;
        color: #f0f8ff;
        box-shadow: 0 12px 32px rgba(0,0,0,0.5) !important;
      }
      [data-skin="pw-blueprint"] [data-vlc-track] {
        height: 2px !important;
        background: rgba(255,255,255,0.30) !important;
        border-radius: 0 !important;
        position: relative;
      }
      [data-skin="pw-blueprint"] [data-vlc-played] { background: #fde047 !important; border-radius: 0 !important; box-shadow: 0 0 6px rgba(253,224,71,0.6); }
      [data-skin="pw-blueprint"] input, [data-skin="pw-blueprint"] textarea, [data-skin="pw-blueprint"] select {
        background: transparent !important;
        border: 1px solid rgba(255,255,255,0.40) !important;
        border-radius: 0 !important;
        color: #f0f8ff !important;
        font-family: "IBM Plex Mono", monospace;
      }
    `),
  },
];