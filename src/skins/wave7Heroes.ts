// Wave 7 — 20 aesthetic hero skins covering the "20-style design system"
// matrix (glassmorph, neumorph, claymorph, aurora, bento, neo-brutal,
// skeuomorph, holo-chrome, organic-editorial, retro-CRT, substrate,
// kinetic, acid, glitch, y2k, isomorphic, blueprint, telemetry,
// generative, maximal-scrapbook). Each hero declares its own tokens
// and a signature extraCss fragment scoped to [data-skin="<id>"].
// The registry fans each one out into 8 accent variants automatically.

import type { SkinHero } from "./types";

interface Spec {
  id: string;
  name: string;
  tagline: string;
  font: string;
  base: string;
  surface: string;
  elevated: string;
  sunken: string;
  accent: string;
  text: string;
  secondary: string;
  border: string;
  radius: [string, string, string, string]; // sm, md, lg, control
  tags: string[];
  /** Signature CSS applied to all skinned regions. */
  signature: string;
  /** Optional per-surface overrides (e.g. shadow stacks that use surface color). */
  surfaceCss?: string;
}

const R = {
  sharp:  ["2px", "4px", "6px", "4px"] as [string, string, string, string],
  soft:   ["8px", "14px", "20px", "10px"] as [string, string, string, string],
  round:  ["16px", "22px", "30px", "999px"] as [string, string, string, string],
  bento:  ["12px", "12px", "12px", "8px"] as [string, string, string, string],
  square: ["0", "0", "0", "0"] as [string, string, string, string],
  pill:   ["999px", "999px", "999px", "999px"] as [string, string, string, string],
};

const SPECS: Spec[] = [
  // 1. Glassmorphism
  {
    id: "glassmorph-arctic", name: "Glassmorph Arctic",
    tagline: "Frosted translucent glass over an icy gradient.",
    font: '"Inter Tight", "Inter", system-ui, sans-serif',
    base: "#0b1220", surface: "rgba(255,255,255,0.08)", elevated: "rgba(255,255,255,0.14)", sunken: "rgba(255,255,255,0.04)",
    accent: "#7dd3fc", text: "#f1f5ff", secondary: "rgba(241,245,255,0.72)",
    border: "rgba(255,255,255,0.22)",
    radius: R.soft, tags: ["glass", "translucent", "modern"],
    signature: `
      backdrop-filter: blur(22px) saturate(160%);
      border: 1px solid rgba(255,255,255,0.18);
      box-shadow: 0 8px 32px rgba(15,23,42,0.35), inset 0 1px 0 rgba(255,255,255,0.22);
    `,
    surfaceCss: `background-image: linear-gradient(140deg, rgba(125,211,252,0.14), rgba(168,85,247,0.12) 60%, rgba(236,72,153,0.10));`,
  },

  // 2. Neumorphism
  {
    id: "neumorph-fog", name: "Neumorph Fog",
    tagline: "Extruded soft UI with matched ambient shadows.",
    font: '"Manrope", "Inter", sans-serif',
    base: "#e6ebf2", surface: "#e6ebf2", elevated: "#eef2f7", sunken: "#dde3ea",
    accent: "#6b7fd7", text: "#2b3548", secondary: "rgba(43,53,72,0.68)",
    border: "rgba(43,53,72,0.08)",
    radius: R.round, tags: ["neumorph", "soft", "light"],
    signature: `
      background: #e6ebf2;
      box-shadow: 8px 8px 20px #c8cdd4, -8px -8px 20px #ffffff;
      border: none;
    `,
  },

  // 3. Claymorphism
  {
    id: "claymorph-bubble", name: "Claymorph Bubble",
    tagline: "Inflatable pastel clay with playful inner light.",
    font: '"Quicksand", "Nunito", sans-serif',
    base: "#f4ecff", surface: "#ffffff", elevated: "#ffffff", sunken: "#e7dcff",
    accent: "#a855f7", text: "#2a1b4a", secondary: "rgba(42,27,74,0.68)",
    border: "rgba(168,85,247,0.18)",
    radius: R.round, tags: ["clay", "pastel", "playful"],
    signature: `
      border-radius: 22px;
      box-shadow:
        inset 0 -8px 0 rgba(168,85,247,0.18),
        inset 0 8px 12px rgba(255,255,255,0.9),
        0 10px 20px rgba(168,85,247,0.18);
    `,
  },

  // 4. Aurora UI
  {
    id: "aurora-mesh", name: "Aurora Mesh",
    tagline: "Fluid glowing blobs on a deep-night mesh.",
    font: '"Syne", "Space Grotesk", sans-serif',
    base: "#08051a", surface: "#0f0a2a", elevated: "#1a1240", sunken: "#04020e",
    accent: "#22d3ee", text: "#f5efff", secondary: "rgba(245,239,255,0.72)",
    border: "rgba(255,255,255,0.10)",
    radius: R.soft, tags: ["aurora", "gradient", "mesh"],
    signature: `
      background-image:
        radial-gradient(60% 40% at 20% 10%, rgba(34,211,238,0.28), transparent 60%),
        radial-gradient(50% 40% at 80% 20%, rgba(168,85,247,0.28), transparent 60%),
        radial-gradient(60% 50% at 60% 100%, rgba(236,72,153,0.24), transparent 65%);
      filter: saturate(120%);
    `,
  },

  // 5. Bento Grid
  {
    id: "bento-slate", name: "Bento Slate",
    tagline: "Uniform tight cells, modular grid discipline.",
    font: '"Inter Tight", "Inter", sans-serif',
    base: "#f4f5f7", surface: "#ffffff", elevated: "#ffffff", sunken: "#e5e7eb",
    accent: "#059669", text: "#0f172a", secondary: "rgba(15,23,42,0.68)",
    border: "rgba(15,23,42,0.10)",
    radius: R.bento, tags: ["bento", "grid", "modular"],
    signature: `
      border-radius: 12px;
      border: 1px solid rgba(15,23,42,0.08);
      box-shadow: 0 1px 2px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.04);
    `,
  },

  // 6. Neo-Brutalism
  {
    id: "neo-brutal-signal", name: "Neo-Brutalist Signal",
    tagline: "Hard 3px borders, neon accent, no apologies.",
    font: '"Space Grotesk", "Archivo Black", sans-serif',
    base: "#f6f5ee", surface: "#ffffff", elevated: "#ffffff", sunken: "#eae7d8",
    accent: "#eab308", text: "#0a0a0a", secondary: "rgba(10,10,10,0.72)",
    border: "#0a0a0a",
    radius: R.sharp, tags: ["brutal", "hard", "neon"],
    signature: `
      border: 3px solid #0a0a0a;
      box-shadow: 6px 6px 0 #0a0a0a;
      border-radius: 4px;
    `,
  },

  // 7. Skeuomorphism 2.0
  {
    id: "skeuo-plate", name: "Skeuomorph Plate",
    tagline: "Glossy brushed metal with tactile inset controls.",
    font: '"SF Pro Display", -apple-system, sans-serif',
    base: "#2b2f36", surface: "#3a3f47", elevated: "#484e57", sunken: "#1e2127",
    accent: "#38bdf8", text: "#f8fafc", secondary: "rgba(248,250,252,0.7)",
    border: "rgba(0,0,0,0.35)",
    radius: R.soft, tags: ["skeuo", "metal", "tactile"],
    signature: `
      background-image:
        linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0) 45%, rgba(0,0,0,0.18)),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 2px);
      border: 1px solid rgba(0,0,0,0.45);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 14px rgba(0,0,0,0.35);
    `,
  },

  // 8. Holographic / Chrome
  {
    id: "holo-chrome", name: "Holo Chrome",
    tagline: "Refracting rainbow foil over liquid mercury.",
    font: '"Orbitron", "Space Mono", monospace',
    base: "#0b0d14", surface: "#161a24", elevated: "#20263a", sunken: "#05070c",
    accent: "#c084fc", text: "#f5f7ff", secondary: "rgba(245,247,255,0.72)",
    border: "rgba(255,255,255,0.16)",
    radius: R.soft, tags: ["holo", "chrome", "iridescent"],
    signature: `
      background-image:
        conic-gradient(from 210deg at 50% 50%, #ff9de3, #a5f3fc, #fef08a, #c4b5fd, #ff9de3);
      background-size: 220% 220%;
      background-position: 30% 40%;
      filter: saturate(85%) contrast(105%);
      border: 1px solid rgba(255,255,255,0.28);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.45);
    `,
  },

  // 9. Organic Minimalism
  {
    id: "organic-editorial", name: "Organic Editorial",
    tagline: "Warm paper, elegant serif, whisper of grain.",
    font: '"Fraunces", "Cormorant Garamond", Georgia, serif',
    base: "#f7f2ea", surface: "#fffaf1", elevated: "#ffffff", sunken: "#ebe3d3",
    accent: "#7c2d12", text: "#1a120a", secondary: "rgba(26,18,10,0.7)",
    border: "rgba(26,18,10,0.14)",
    radius: R.sharp, tags: ["editorial", "serif", "paper"],
    signature: `
      background-image:
        radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1.2px),
        radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 3px 3px, 7px 7px;
      border: 1px solid rgba(26,18,10,0.10);
    `,
  },

  // 10. Retro-Futurism / CRT
  {
    id: "retro-crt", name: "Retro CRT",
    tagline: "Synthwave neon wireframes with a CRT glow.",
    font: '"VT323", "Press Start 2P", monospace',
    base: "#0a0018", surface: "#140033", elevated: "#1e0050", sunken: "#04000c",
    accent: "#ff3df4", text: "#a8f0ff", secondary: "rgba(168,240,255,0.7)",
    border: "rgba(255,61,244,0.35)",
    radius: R.sharp, tags: ["retro", "crt", "synthwave"],
    signature: `
      background-image:
        repeating-linear-gradient(0deg, rgba(168,240,255,0.06) 0 1px, transparent 1px 3px),
        linear-gradient(180deg, rgba(255,61,244,0.10), transparent 40%),
        linear-gradient(0deg, rgba(34,211,238,0.10), transparent 40%);
      text-shadow: 0 0 6px rgba(168,240,255,0.55);
      border: 1px solid rgba(255,61,244,0.35);
      box-shadow: 0 0 20px rgba(255,61,244,0.20), inset 0 0 40px rgba(34,211,238,0.15);
    `,
  },

  // 11. Substrate UI
  {
    id: "substrate-depth", name: "Substrate Depth",
    tagline: "Layered ambient occlusion, calm depth zones.",
    font: '"Inter", system-ui, sans-serif',
    base: "#f2f4f7", surface: "#ffffff", elevated: "#ffffff", sunken: "#e2e6ec",
    accent: "#0284c7", text: "#0f172a", secondary: "rgba(15,23,42,0.68)",
    border: "rgba(15,23,42,0.08)",
    radius: R.soft, tags: ["substrate", "depth", "layered"],
    signature: `
      background: #ffffff;
      box-shadow:
        0 1px 1px rgba(15,23,42,0.04),
        0 2px 4px rgba(15,23,42,0.05),
        0 6px 12px rgba(15,23,42,0.06),
        0 16px 32px rgba(15,23,42,0.06);
      border: 1px solid rgba(15,23,42,0.05);
    `,
  },

  // 12. Kinetic UI
  {
    id: "kinetic-plasma", name: "Kinetic Plasma",
    tagline: "Elastic morphing containers, spring energy.",
    font: '"Space Grotesk", "Inter", sans-serif',
    base: "#0a0512", surface: "#150826", elevated: "#210c3d", sunken: "#04010a",
    accent: "#f43f5e", text: "#fff0f5", secondary: "rgba(255,240,245,0.72)",
    border: "rgba(244,63,94,0.28)",
    radius: R.round, tags: ["kinetic", "motion", "morph"],
    signature: `
      border-radius: 22px;
      transition: transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 380ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 380ms ease;
      box-shadow: 0 12px 32px rgba(244,63,94,0.28), inset 0 1px 0 rgba(255,255,255,0.08);
      border: 1px solid rgba(244,63,94,0.30);
    `,
  },

  // 13. Acid Graphic
  {
    id: "acid-graphic", name: "Acid Graphic",
    tagline: "Distorted display type, high-sat fills, no chill.",
    font: '"Monoton", "Faster One", "Audiowide", monospace',
    base: "#fff8d1", surface: "#f0ff5c", elevated: "#e0ff00", sunken: "#f5ea88",
    accent: "#7c3aed", text: "#0a0033", secondary: "rgba(10,0,51,0.72)",
    border: "#0a0033",
    radius: R.sharp, tags: ["acid", "loud", "graphic"],
    signature: `
      border: 2px solid #0a0033;
      box-shadow: 4px 4px 0 #7c3aed, 8px 8px 0 #0a0033;
      letter-spacing: 0.02em;
    `,
  },

  // 14. Glitch Art
  {
    id: "glitch-rgb", name: "Glitch RGB",
    tagline: "Channel splits, scanlines, digital noise.",
    font: '"Share Tech Mono", "VT323", monospace',
    base: "#050308", surface: "#0d0a12", elevated: "#161320", sunken: "#020103",
    accent: "#00ff88", text: "#e8e6ff", secondary: "rgba(232,230,255,0.7)",
    border: "rgba(255,0,128,0.28)",
    radius: R.sharp, tags: ["glitch", "cyber", "noise"],
    signature: `
      background-image:
        repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px),
        radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: auto, 3px 3px;
      text-shadow: -1px 0 rgba(255,0,128,0.9), 1px 0 rgba(0,255,255,0.9);
      border-left: 2px solid rgba(255,0,128,0.55);
      border-right: 2px solid rgba(0,255,255,0.55);
    `,
  },

  // 15. Y2K Aesthetic
  {
    id: "y2k-plastic", name: "Y2K Plastic",
    tagline: "Semi-transparent bubble tech with silver trim.",
    font: '"Righteous", "Viga", sans-serif',
    base: "#dfeaff", surface: "rgba(255,255,255,0.55)", elevated: "rgba(255,255,255,0.75)", sunken: "#bcd0f5",
    accent: "#0ea5e9", text: "#111827", secondary: "rgba(17,24,39,0.72)",
    border: "rgba(148,163,184,0.55)",
    radius: R.round, tags: ["y2k", "plastic", "bubble"],
    signature: `
      background-image:
        linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.35) 45%, rgba(180,210,255,0.55));
      border: 1px solid rgba(148,163,184,0.6);
      box-shadow: inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -6px 12px rgba(14,165,233,0.20), 0 4px 12px rgba(14,165,233,0.18);
      border-radius: 22px;
    `,
  },

  // 16. Isomorphic Design
  {
    id: "iso-perspective", name: "Iso Perspective",
    tagline: "Architectural 3D grid, indigo depth planes.",
    font: '"Chakra Petch", "Rajdhani", sans-serif',
    base: "#0b1030", surface: "#141a44", elevated: "#1e265c", sunken: "#050820",
    accent: "#f472b6", text: "#e6ecff", secondary: "rgba(230,236,255,0.7)",
    border: "rgba(244,114,182,0.28)",
    radius: R.sharp, tags: ["iso", "3d", "architectural"],
    signature: `
      background-image:
        repeating-linear-gradient(30deg, rgba(244,114,182,0.09) 0 1px, transparent 1px 22px),
        repeating-linear-gradient(150deg, rgba(96,165,250,0.09) 0 1px, transparent 1px 22px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 22px);
      border: 1px solid rgba(244,114,182,0.24);
    `,
  },

  // 17. Line Art / Blueprint
  {
    id: "blueprint-line", name: "Blueprint Line",
    tagline: "Technical blueprint mesh, fine wireframe rule.",
    font: '"IBM Plex Mono", "Space Mono", monospace',
    base: "#0b3a6b", surface: "#0f4a86", elevated: "#155ea6", sunken: "#062347",
    accent: "#ffffff", text: "#e6f2ff", secondary: "rgba(230,242,255,0.85)",
    border: "rgba(255,255,255,0.35)",
    radius: R.sharp, tags: ["blueprint", "technical", "line"],
    signature: `
      background-image:
        linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px),
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px;
      border: 1px dashed rgba(255,255,255,0.45);
    `,
  },

  // 18. Data-Dense Telemetry
  {
    id: "telemetry-dense", name: "Telemetry Dense",
    tagline: "Compact monospace strings, status blips only.",
    font: '"JetBrains Mono", "IBM Plex Mono", monospace',
    base: "#07090c", surface: "#0d1117", elevated: "#151b23", sunken: "#03060a",
    accent: "#22c55e", text: "#d1d5db", secondary: "rgba(209,213,219,0.7)",
    border: "rgba(34,197,94,0.28)",
    radius: R.sharp, tags: ["telemetry", "mono", "dense"],
    signature: `
      border: 1px solid rgba(34,197,94,0.22);
      background-image:
        linear-gradient(180deg, rgba(34,197,94,0.05), transparent 40%),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 22px);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
      font-variant-numeric: tabular-nums;
      letter-spacing: 0;
    `,
  },

  // 19. Generative Art
  {
    id: "generative-noise", name: "Generative Noise",
    tagline: "Algorithmic conic backdrop, shifting math field.",
    font: '"Space Mono", "JetBrains Mono", monospace',
    base: "#0a0714", surface: "#130a22", elevated: "#1e1236", sunken: "#040209",
    accent: "#facc15", text: "#f4ecff", secondary: "rgba(244,236,255,0.72)",
    border: "rgba(250,204,21,0.28)",
    radius: R.soft, tags: ["generative", "abstract", "math"],
    signature: `
      background-image:
        conic-gradient(from 0deg at 30% 40%, rgba(250,204,21,0.18), rgba(139,92,246,0.18), rgba(236,72,153,0.18), rgba(250,204,21,0.18)),
        radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.2px);
      background-size: 200% 200%, 3px 3px;
      animation: vlc-gen-shift 22s linear infinite;
      border: 1px solid rgba(250,204,21,0.22);
    `,
  },

  // 20. Maximalist Scrapbook
  {
    id: "maximal-scrapbook", name: "Maximal Scrapbook",
    tagline: "Chaotic collage, tape, halftone, marker red.",
    font: '"Permanent Marker", "Caveat", cursive',
    base: "#fbf3e2", surface: "#fffaee", elevated: "#ffffff", sunken: "#e7dcc3",
    accent: "#dc2626", text: "#1a1105", secondary: "rgba(26,17,5,0.72)",
    border: "rgba(26,17,5,0.35)",
    radius: R.sharp, tags: ["maximal", "collage", "scrap"],
    signature: `
      background-image:
        radial-gradient(rgba(0,0,0,0.14) 1px, transparent 1.6px),
        repeating-linear-gradient(45deg, rgba(220,38,38,0.10) 0 8px, transparent 8px 18px),
        linear-gradient(180deg, rgba(0,0,0,0.03), transparent);
      background-size: 6px 6px, auto, auto;
      border: 2px solid #1a1105;
      box-shadow: 3px 3px 0 rgba(220,38,38,0.65), 6px 6px 14px rgba(0,0,0,0.18);
      transform: rotate(-0.15deg);
    `,
  },
];

const GLOBAL_KEYFRAMES = `
  @keyframes vlc-gen-shift {
    0%   { background-position: 0% 0%, 0 0; }
    50%  { background-position: 100% 100%, 0 0; }
    100% { background-position: 0% 0%, 0 0; }
  }
`;

export const WAVE7_HEROES: SkinHero[] = SPECS.map((s) => {
  const [sm, md, lg, control] = s.radius;
  return {
    id: s.id,
    name: s.name,
    tagline: s.tagline,
    tags: [...s.tags, "wave-7"],
    tokens: {
      "--vlc-bg-base": s.base,
      "--vlc-bg-surface": s.surface,
      "--vlc-bg-elevated": s.elevated,
      "--vlc-bg-sunken": s.sunken,
      "--vlc-border-subtle": `color-mix(in oklab, ${s.text} 8%, transparent)`,
      "--vlc-border-normal": s.border,
      "--vlc-border-strong": `color-mix(in oklab, ${s.text} 32%, transparent)`,
      "--vlc-accent": s.accent,
      "--vlc-accent-hover": `color-mix(in oklab, ${s.accent} 78%, black 22%)`,
      "--vlc-accent-dim": `color-mix(in oklab, ${s.accent} 18%, transparent)`,
      "--vlc-accent-text": s.accent,
      "--vlc-seek-played": s.accent,
      "--vlc-seek-thumb": s.text,
      "--vlc-text-primary": s.text,
      "--vlc-text-secondary": s.secondary,
      "--vlc-text-ghost": `color-mix(in oklab, ${s.text} 42%, transparent)`,
      "--vlc-control-hover": `color-mix(in oklab, ${s.text} 9%, transparent)`,
      "--vlc-control-active": `color-mix(in oklab, ${s.accent} 22%, transparent)`,
      "--vlc-font-ui": s.font,
      "--vlc-font-mono": '"JetBrains Mono", "Space Mono", ui-monospace, monospace',
      "--vlc-radius-sm": sm,
      "--vlc-radius-md": md,
      "--vlc-radius-lg": lg,
      "--vlc-control-radius": control,
    },
    // Wave 7 uses tokens only. The previous "signature dumped onto every
    // region" pattern caused shadows to be clipped, glass to blur nothing,
    // and left every button/slider looking identical to the default skin.
    // The deep per-region theming lives in PREMIUM_WAVE now; wave7 stays
    // as lightweight token variants (accent + font + palette).
    extraCss: "",
  };
});