// Wave 6 — 35 additional hero skins. Each multiplied by 8 accent variants
// via registry.ts yields 280 selectable entries. Uses fonts already loaded
// in __root.tsx to keep network cost flat (zero new font requests).
import type { SkinHero } from "./types";

interface Spec {
  id: string; name: string; tagline: string; font: string;
  base: string; surface: string; elevated: string; sunken: string;
  accent: string; text: string; secondary: string;
  radius: "sharp" | "soft" | "round" | "pill" | "square";
  tags: string[]; pattern: string;
}

const SPECS: Spec[] = [
  { id: "obsidian-prism",     name: "Obsidian Prism",     tagline: "Faceted black glass with prismatic accent.",            font: '"Syne", sans-serif',                    base: "#05060a", surface: "#0d0f17", elevated: "#181c2a", sunken: "#020306", accent: "#a78bfa", text: "#eef2ff", secondary: "rgba(238,242,255,0.7)", radius: "sharp",  tags: ["dark","prism","glass"],    pattern: "glass" },
  { id: "aurora-fjord",       name: "Aurora Fjord",       tagline: "Cold fjord night with aurora green ribbons.",           font: '"Manrope", sans-serif',                 base: "#04121b", surface: "#0a2030", elevated: "#103349", sunken: "#020a10", accent: "#34d399", text: "#e8fffb", secondary: "rgba(232,255,251,0.72)", radius: "soft",   tags: ["dark","aurora","cool"],    pattern: "waves" },
  { id: "rose-quartz-day",    name: "Rose Quartz Day",    tagline: "Soft quartz pink with deep plum readouts.",             font: '"Cormorant Garamond", Georgia, serif',  base: "#fff5f7", surface: "#ffffff", elevated: "#fffafc", sunken: "#fbe1ea", accent: "#a21caf", text: "#2b0916", secondary: "rgba(43,9,22,0.68)", radius: "round",  tags: ["light","pink","luxury"],   pattern: "petal" },
  { id: "tactical-olive",     name: "Tactical Olive",     tagline: "Field-radio olive matte with hazard amber.",            font: '"Chakra Petch", sans-serif',            base: "#10130b", surface: "#1d2113", elevated: "#2a301c", sunken: "#070803", accent: "#fbbf24", text: "#f0f1d8", secondary: "rgba(240,241,216,0.7)", radius: "sharp",  tags: ["dark","tactical","olive"], pattern: "hazard" },
  { id: "monochrome-bauhaus", name: "Monochrome Bauhaus", tagline: "Pure grid geometry, primary-red signal only.",          font: '"Archivo Black", Impact, sans-serif',   base: "#f4f3ef", surface: "#ffffff", elevated: "#ffffff", sunken: "#e3e2dd", accent: "#dc2626", text: "#0a0a0a", secondary: "rgba(10,10,10,0.7)", radius: "square", tags: ["light","bauhaus","print"], pattern: "rulers" },
  { id: "magma-core",         name: "Magma Core",         tagline: "Molten obsidian crust with magma seams.",               font: '"Audiowide", monospace',                base: "#0b0303", surface: "#1a0606", elevated: "#2f0a0a", sunken: "#040000", accent: "#f97316", text: "#ffe8d6", secondary: "rgba(255,232,214,0.72)", radius: "soft",   tags: ["dark","fire","sci-fi"],    pattern: "glow" },
  { id: "porcelain-mint",     name: "Porcelain Mint",     tagline: "Cool porcelain shell with mint signal trace.",          font: '"Karla", sans-serif',                   base: "#f0fbf6", surface: "#ffffff", elevated: "#ffffff", sunken: "#d6efe3", accent: "#059669", text: "#062017", secondary: "rgba(6,32,23,0.68)", radius: "soft",   tags: ["light","mint","clean"],    pattern: "dots" },
  { id: "vinyl-night",        name: "Vinyl Night",        tagline: "Lacquered vinyl black with gold groove rings.",          font: '"Playfair Display", Georgia, serif',    base: "#08070a", surface: "#15131a", elevated: "#22202b", sunken: "#040305", accent: "#facc15", text: "#fff8db", secondary: "rgba(255,248,219,0.72)", radius: "round",  tags: ["dark","music","luxury"],   pattern: "radar" },
  { id: "cyan-grid",          name: "Cyan Grid",          tagline: "Wireframe cyan grid on midnight.",                       font: '"Space Mono", monospace',               base: "#020a14", surface: "#04162a", elevated: "#062340", sunken: "#000308", accent: "#22d3ee", text: "#e0fbff", secondary: "rgba(224,251,255,0.72)", radius: "sharp",  tags: ["dark","grid","cyber"],     pattern: "blueprint" },
  { id: "khaki-paper",        name: "Khaki Paper",        tagline: "Field-notebook khaki with hand-marked indigo.",         font: '"Special Elite", monospace',            base: "#eee4cf", surface: "#fbf3dc", elevated: "#fffae9", sunken: "#d6c8a8", accent: "#1d4ed8", text: "#1a1306", secondary: "rgba(26,19,6,0.7)", radius: "sharp",  tags: ["light","paper","field"],   pattern: "paper" },
  { id: "neon-shrine",        name: "Neon Shrine",        tagline: "Lantern-lit shrine night with crimson torii.",          font: '"Shippori Mincho", serif',              base: "#0a0203", surface: "#170406", elevated: "#28080b", sunken: "#040001", accent: "#fb7185", text: "#ffeaee", secondary: "rgba(255,234,238,0.72)", radius: "soft",   tags: ["dark","shrine","japan"],   pattern: "lantern" },
  { id: "concrete-loft",      name: "Concrete Loft",      tagline: "Polished concrete loft with copper rails.",             font: '"Urbanist", system-ui, sans-serif',     base: "#1d1d1f", surface: "#28282b", elevated: "#363639", sunken: "#0e0e10", accent: "#d97706", text: "#f4f4f5", secondary: "rgba(244,244,245,0.7)", radius: "soft",   tags: ["dark","loft","industrial"],pattern: "metal" },
  { id: "lemon-tonic",        name: "Lemon Tonic",        tagline: "Soft lemon wash with deep teal action.",                font: '"Quicksand", sans-serif',               base: "#fffce6", surface: "#fffef2", elevated: "#ffffff", sunken: "#f0e9b8", accent: "#0d9488", text: "#1a1a00", secondary: "rgba(26,26,0,0.7)", radius: "round",  tags: ["light","citrus","playful"],pattern: "dots" },
  { id: "thermo-print",       name: "Thermo Print",       tagline: "Thermal receipt UI, black ink on warm paper.",          font: '"Courier Prime", monospace',            base: "#f5efe2", surface: "#fff9ea", elevated: "#fffdf2", sunken: "#dccfb6", accent: "#0a0a0a", text: "#161106", secondary: "rgba(22,17,6,0.7)", radius: "sharp",  tags: ["light","receipt","mono"],  pattern: "scan" },
  { id: "abyss-violet",       name: "Abyss Violet",       tagline: "Abyssal violet trench with anglerfish glow.",            font: '"Exo 2", sans-serif',                   base: "#06031a", surface: "#0e0832", elevated: "#1a0f4b", sunken: "#020108", accent: "#e879f9", text: "#f5ebff", secondary: "rgba(245,235,255,0.72)", radius: "soft",   tags: ["dark","violet","ocean"],   pattern: "glow" },
  { id: "graph-paper",        name: "Graph Paper",        tagline: "Engineer graph paper, indigo grid, black mark.",         font: '"IBM Plex Mono", monospace',            base: "#f7faff", surface: "#ffffff", elevated: "#ffffff", sunken: "#dde7f5", accent: "#1e3a8a", text: "#0b1228", secondary: "rgba(11,18,40,0.68)", radius: "sharp",  tags: ["light","grid","engineer"], pattern: "grid" },
  { id: "midnight-fern",      name: "Midnight Fern",      tagline: "Botanical midnight with fern-green markers.",            font: '"Lora", Georgia, serif',                base: "#040a07", surface: "#0a1812", elevated: "#13281e", sunken: "#020503", accent: "#86efac", text: "#e6fff0", secondary: "rgba(230,255,240,0.72)", radius: "soft",   tags: ["dark","botanical","green"],pattern: "petal" },
  { id: "denim-workshop",     name: "Denim Workshop",     tagline: "Worn denim canvas with orange stitch accent.",          font: '"Rubik", sans-serif',                   base: "#162338", surface: "#1f324e", elevated: "#2c4366", sunken: "#0a1322", accent: "#fb923c", text: "#eef4ff", secondary: "rgba(238,244,255,0.7)", radius: "soft",   tags: ["dark","workshop","blue"],  pattern: "stripes" },
  { id: "off-white-museum",   name: "Off-White Museum",   tagline: "Museum off-white plaster with antique gold.",            font: '"Instrument Serif", Georgia, serif',    base: "#f1ecdf", surface: "#fbf6e8", elevated: "#ffffff", sunken: "#dfd6c0", accent: "#a16207", text: "#1d160a", secondary: "rgba(29,22,10,0.68)", radius: "sharp",  tags: ["light","museum","gallery"],pattern: "paper" },
  { id: "midnight-arcade",    name: "Midnight Arcade",    tagline: "Late-night arcade cabinet with neon flicker.",          font: '"Press Start 2P", monospace',           base: "#080018", surface: "#10052a", elevated: "#1c0a47", sunken: "#020009", accent: "#f0abfc", text: "#fdf2ff", secondary: "rgba(253,242,255,0.72)", radius: "square", tags: ["dark","pixel","arcade"],   pattern: "halftone" },
  { id: "graphene-grid",      name: "Graphene Grid",      tagline: "Hexagonal graphene mesh, electric blue trace.",         font: '"Orbitron", monospace',                 base: "#05080d", surface: "#0c1320", elevated: "#172238", sunken: "#020409", accent: "#60a5fa", text: "#edf2ff", secondary: "rgba(237,242,255,0.72)", radius: "sharp",  tags: ["dark","tech","grid"],      pattern: "grid" },
  { id: "soft-tofu",          name: "Soft Tofu",          tagline: "Pillowy off-white panels with soft coral.",             font: '"M PLUS Rounded 1c", sans-serif',       base: "#fbf7f2", surface: "#ffffff", elevated: "#ffffff", sunken: "#efe5dc", accent: "#fb7185", text: "#27201a", secondary: "rgba(39,32,26,0.68)", radius: "round",  tags: ["light","soft","cozy"],     pattern: "petal" },
  { id: "ink-on-rice",        name: "Ink on Rice",        tagline: "Rice-paper cream with sumi ink controls.",              font: '"Shippori Mincho", serif',              base: "#f4ecd8", surface: "#fff8e3", elevated: "#fffceb", sunken: "#d8cfb6", accent: "#0a0a0a", text: "#100b04", secondary: "rgba(16,11,4,0.7)", radius: "sharp",  tags: ["light","japanese","paper"],pattern: "paper" },
  { id: "studio-amethyst",    name: "Studio Amethyst",    tagline: "Mastering-studio purple with white meter rails.",        font: '"Manrope", sans-serif',                 base: "#0e0820", surface: "#1a1132", elevated: "#281c4d", sunken: "#060312", accent: "#f5f3ff", text: "#f3edff", secondary: "rgba(243,237,255,0.72)", radius: "soft",   tags: ["dark","studio","purple"],  pattern: "rulers" },
  { id: "midcentury-mod",     name: "Midcentury Mod",     tagline: "Avocado and orange midcentury wall panel.",             font: '"Viga", sans-serif',                    base: "#f1e9d2", surface: "#f8f1da", elevated: "#fff9e0", sunken: "#d6c7a3", accent: "#b45309", text: "#2a200d", secondary: "rgba(42,32,13,0.7)", radius: "round",  tags: ["light","retro","midcent"], pattern: "stripes" },
  { id: "neon-sushi",         name: "Neon Sushi",         tagline: "Wasabi-green neon over lacquered black plate.",         font: '"Bangers", Impact, sans-serif',         base: "#04050a", surface: "#0c0f1a", elevated: "#171b2d", sunken: "#000103", accent: "#a3e635", text: "#f1ffd9", secondary: "rgba(241,255,217,0.72)", radius: "round",  tags: ["dark","food","neon"],      pattern: "lantern" },
  { id: "boardroom-noir",     name: "Boardroom Noir",     tagline: "Executive walnut and tungsten-warm signals.",           font: '"Libre Baskerville", Georgia, serif',   base: "#100b08", surface: "#1b1410", elevated: "#28201a", sunken: "#070504", accent: "#fbbf24", text: "#f5ead2", secondary: "rgba(245,234,210,0.7)", radius: "soft",   tags: ["dark","boardroom","walnut"],pattern: "wood" },
  { id: "studio-frosted",     name: "Studio Frosted",     tagline: "Frosted-acrylic light surfaces, cobalt rails.",         font: '"Urbanist", sans-serif',                base: "#eef2f8", surface: "#ffffff", elevated: "#ffffff", sunken: "#dde4ee", accent: "#1d4ed8", text: "#0b1428", secondary: "rgba(11,20,40,0.68)", radius: "pill",   tags: ["light","frost","studio"],  pattern: "frost" },
  { id: "lichen-rock",        name: "Lichen Rock",        tagline: "Stone gray with mossy lichen accent.",                  font: '"Zilla Slab", Georgia, serif',          base: "#21221e", surface: "#2d2e29", elevated: "#3a3b36", sunken: "#131410", accent: "#a3e635", text: "#f1f1ec", secondary: "rgba(241,241,236,0.7)", radius: "sharp",  tags: ["dark","stone","nature"],   pattern: "ash" },
  { id: "champagne-suite",    name: "Champagne Suite",    tagline: "Pearl champagne with rose-gold filigree.",              font: '"Fraunces", Georgia, serif',            base: "#fbf6ec", surface: "#fffaf0", elevated: "#fffdf6", sunken: "#ecdfc6", accent: "#be185d", text: "#28190a", secondary: "rgba(40,25,10,0.68)", radius: "round",  tags: ["light","luxury","pearl"],  pattern: "pearl" },
  { id: "dystopia-yellow",    name: "Dystopia Yellow",    tagline: "Bunker yellow signage on charred concrete.",            font: '"Anton", Impact, sans-serif',           base: "#0c0a05", surface: "#191506", elevated: "#241d0a", sunken: "#040301", accent: "#facc15", text: "#fff7d6", secondary: "rgba(255,247,214,0.72)", radius: "square", tags: ["dark","brutal","yellow"],  pattern: "hazard" },
  { id: "tide-pool",          name: "Tide Pool",          tagline: "Wet-sand light cream with tide-blue current.",           font: '"Comfortaa", sans-serif',               base: "#f3f8fb", surface: "#ffffff", elevated: "#ffffff", sunken: "#dbe7ee", accent: "#0284c7", text: "#0a1d2a", secondary: "rgba(10,29,42,0.68)", radius: "round",  tags: ["light","coast","blue"],    pattern: "waves" },
  { id: "noir-detective",     name: "Noir Detective",     tagline: "1940s noir, cigarette-smoke gray, neon sign red.",      font: '"Cinzel", Georgia, serif',              base: "#0c0c0e", surface: "#181819", elevated: "#262628", sunken: "#050505", accent: "#ef4444", text: "#e6e6e8", secondary: "rgba(230,230,232,0.7)", radius: "sharp",  tags: ["dark","noir","cinema"],    pattern: "scan" },
  { id: "candy-shoppe",       name: "Candy Shoppe",       tagline: "Strawberry-cream pastel candy counter.",                 font: '"Pacifico", cursive',                   base: "#fff3f7", surface: "#ffffff", elevated: "#ffffff", sunken: "#f8d8e3", accent: "#db2777", text: "#3a0a1f", secondary: "rgba(58,10,31,0.68)", radius: "round",  tags: ["light","candy","playful"], pattern: "dots" },
  { id: "carbon-emerald",     name: "Carbon Emerald",     tagline: "Forged carbon weave with emerald HUD.",                  font: '"Rajdhani", sans-serif',                base: "#06080a", surface: "#0e1214", elevated: "#171d20", sunken: "#020304", accent: "#10b981", text: "#eafff5", secondary: "rgba(234,255,245,0.72)", radius: "sharp",  tags: ["dark","carbon","hud"],     pattern: "carbon" },
  { id: "porcelain-ink",      name: "Porcelain Ink",      tagline: "Bone porcelain with brush-ink black controls.",          font: '"DM Serif Display", Georgia, serif',    base: "#f8f5ee", surface: "#ffffff", elevated: "#ffffff", sunken: "#e8e2d3", accent: "#111827", text: "#0b0a08", secondary: "rgba(11,10,8,0.7)", radius: "sharp",  tags: ["light","porcelain","ink"], pattern: "porcelain" },
];

const RADIUS = { sharp: ["2px","4px","6px","4px"], soft: ["8px","12px","18px","10px"], round: ["14px","22px","30px","999px"], pill: ["999px","999px","999px","999px"], square: ["0","0","0","0"] } as const;

const patternCss = (p: string): string => {
  switch (p) {
    case "glass": return `backdrop-filter: blur(22px) saturate(160%); -webkit-backdrop-filter: blur(22px) saturate(160%);`;
    case "frost": return `backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);`;
    case "grid": return `background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px); background-size: 18px 18px;`;
    case "dots": return `background-image: radial-gradient(color-mix(in oklab, var(--vlc-accent) 18%, transparent) 1px, transparent 1.5px); background-size: 14px 14px;`;
    case "scan": return `background-image: repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 4px);`;
    case "paper": return `background-image: linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px); background-size: 100% 22px;`;
    case "waves": return `background-image: radial-gradient(ellipse at 20% 120%, color-mix(in oklab, var(--vlc-accent) 20%, transparent), transparent 45%);`;
    case "rulers": return `background-image: repeating-linear-gradient(90deg, color-mix(in oklab, var(--vlc-border-normal) 70%, transparent) 0 1px, transparent 1px 48px);`;
    case "petal": return `background-image: radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--vlc-accent) 16%, transparent), transparent 28%);`;
    case "stripes": return `background-image: repeating-linear-gradient(-45deg, color-mix(in oklab, var(--vlc-accent) 14%, transparent) 0 12px, transparent 12px 24px);`;
    case "glow": return `box-shadow: inset 0 0 42px color-mix(in oklab, var(--vlc-accent) 18%, transparent);`;
    case "wood": return `background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0 2px, transparent 2px 9px);`;
    case "porcelain": return `background-image: linear-gradient(90deg, color-mix(in oklab, var(--vlc-accent) 16%, transparent) 1px, transparent 1px); background-size: 34px 100%;`;
    case "metal": return `background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.045) 0 1px, rgba(0,0,0,.045) 1px 2px);`;
    case "hazard": return `background-image: repeating-linear-gradient(45deg, color-mix(in oklab, var(--vlc-accent) 16%, transparent) 0 10px, transparent 10px 20px);`;
    case "halftone": return `background-image: radial-gradient(rgba(0,0,0,.22) 1px, transparent 1.5px); background-size: 8px 8px;`;
    case "carbon": return `background-image: repeating-linear-gradient(45deg, rgba(255,255,255,.04) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,.35) 0 2px, transparent 2px 6px);`;
    case "pearl": return `background-image: linear-gradient(120deg, rgba(255,255,255,.6), transparent 45%, rgba(255,255,255,.28));`;
    case "radar": return `background-image: radial-gradient(circle, transparent 38%, color-mix(in oklab, var(--vlc-accent) 18%, transparent) 39% 40%, transparent 41%); background-size: 120px 120px;`;
    case "lantern": return `box-shadow: inset 0 -16px 48px color-mix(in oklab, var(--vlc-accent) 18%, transparent);`;
    case "ash": return `background-image: radial-gradient(rgba(255,255,255,.035) 1px, transparent 1px); background-size: 7px 7px;`;
    case "blueprint": return `background-image: linear-gradient(rgba(125,211,252,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.12) 1px, transparent 1px); background-size: 20px 20px;`;
    default: return "";
  }
};

export const WAVE6_HEROES: SkinHero[] = SPECS.map((s) => {
  const [sm, md, lg, control] = RADIUS[s.radius];
  return {
    id: s.id,
    name: s.name,
    tagline: s.tagline,
    tags: [...s.tags, "wave-6"],
    tokens: {
      "--vlc-bg-base": s.base,
      "--vlc-bg-surface": s.surface,
      "--vlc-bg-elevated": s.elevated,
      "--vlc-bg-sunken": s.sunken,
      "--vlc-border-subtle": `color-mix(in oklab, ${s.text} 8%, transparent)`,
      "--vlc-border-normal": `color-mix(in oklab, ${s.text} 16%, transparent)`,
      "--vlc-border-strong": `color-mix(in oklab, ${s.text} 28%, transparent)`,
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
    extraCss: "",
  };
});
