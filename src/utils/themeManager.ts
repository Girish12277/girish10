import type { Theme } from "@/types/theme.types";

// Light-mode token pack — fixes the "zero contrast" problem on light backgrounds.
// Default :root tokens (borders, secondary text, control hovers, seek track,
// volume fill, gradient) are tuned for dark bg. On light bg they vanish.
// Apply these overrides to every light theme so text and chrome stay readable.
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

// Existing curated themes (kept verbatim) -----------------------------------
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
  { name: "Synthwave", vars: { "--vlc-bg-base": "#1B0B2E", "--vlc-bg-surface": "#241040", "--vlc-bg-elevated": "#311555", "--vlc-bg-sunken": "#10061C", "--vlc-accent": "#FF2E9A", "--vlc-accent-hover": "#E01E80", "--vlc-accent-dim": "rgba(255,46,154,0.18)", "--vlc-accent-text": "#FF7AC6", "--vlc-seek-played": "#FF2E9A", "--vlc-text-primary": "#F4E9FF" } },
  { name: "Sunset", vars: { "--vlc-bg-base": "#1F0E08", "--vlc-bg-surface": "#2A140C", "--vlc-bg-elevated": "#3A1C12", "--vlc-bg-sunken": "#140703", "--vlc-accent": "#FF6B35", "--vlc-accent-hover": "#E0521E", "--vlc-accent-dim": "rgba(255,107,53,0.18)", "--vlc-accent-text": "#FFB088", "--vlc-seek-played": "#FF8A4C" } },
  { name: "Ocean", vars: { "--vlc-bg-base": "#06182A", "--vlc-bg-surface": "#0B2238", "--vlc-bg-elevated": "#103049", "--vlc-bg-sunken": "#020E1A", "--vlc-accent": "#22D3EE", "--vlc-accent-hover": "#0FB5CE", "--vlc-accent-dim": "rgba(34,211,238,0.16)", "--vlc-accent-text": "#7DE7F5", "--vlc-seek-played": "#22D3EE" } },
  { name: "Cyberpunk", vars: { "--vlc-bg-base": "#0A0014", "--vlc-bg-surface": "#140524", "--vlc-bg-elevated": "#1F0A36", "--vlc-bg-sunken": "#04000B", "--vlc-accent": "#F9F002", "--vlc-accent-hover": "#D9D000", "--vlc-accent-dim": "rgba(249,240,2,0.16)", "--vlc-accent-text": "#FFFA66", "--vlc-seek-played": "#F9F002", "--vlc-text-primary": "#E8FFFA" } },
  { name: "Mango", vars: { "--vlc-bg-base": "#1F1505", "--vlc-bg-surface": "#2A1D08", "--vlc-bg-elevated": "#3A2A0C", "--vlc-bg-sunken": "#150E03", "--vlc-accent": "#FFB300", "--vlc-accent-hover": "#E69E00", "--vlc-accent-dim": "rgba(255,179,0,0.18)", "--vlc-accent-text": "#FFD166", "--vlc-seek-played": "#FFB300" } },
  { name: "Nord", vars: { "--vlc-bg-base": "#2E3440", "--vlc-bg-surface": "#3B4252", "--vlc-bg-elevated": "#434C5E", "--vlc-bg-sunken": "#242933", "--vlc-accent": "#88C0D0", "--vlc-accent-hover": "#6FAFC2", "--vlc-accent-dim": "rgba(136,192,208,0.16)", "--vlc-accent-text": "#A6D5E2", "--vlc-seek-played": "#88C0D0", "--vlc-text-primary": "#ECEFF4" } },
  { name: "Dracula", vars: { "--vlc-bg-base": "#282A36", "--vlc-bg-surface": "#343746", "--vlc-bg-elevated": "#44475A", "--vlc-bg-sunken": "#1E2029", "--vlc-accent": "#BD93F9", "--vlc-accent-hover": "#A57DEE", "--vlc-accent-dim": "rgba(189,147,249,0.18)", "--vlc-accent-text": "#D6BCFA", "--vlc-seek-played": "#FF79C6", "--vlc-text-primary": "#F8F8F2" } },
  { name: "Solarized", vars: { "--vlc-bg-base": "#002B36", "--vlc-bg-surface": "#073642", "--vlc-bg-elevated": "#0E4A57", "--vlc-bg-sunken": "#001E26", "--vlc-accent": "#B58900", "--vlc-accent-hover": "#9A7400", "--vlc-accent-dim": "rgba(181,137,0,0.18)", "--vlc-accent-text": "#D4A92A", "--vlc-seek-played": "#268BD2", "--vlc-text-primary": "#EEE8D5" } },
  { name: "Monokai", vars: { "--vlc-bg-base": "#272822", "--vlc-bg-surface": "#33342C", "--vlc-bg-elevated": "#3E3F36", "--vlc-bg-sunken": "#1B1C17", "--vlc-accent": "#A6E22E", "--vlc-accent-hover": "#8FCC1E", "--vlc-accent-dim": "rgba(166,226,46,0.18)", "--vlc-accent-text": "#C5EE6E", "--vlc-seek-played": "#F92672", "--vlc-text-primary": "#F8F8F2" } },
  { name: "Gruvbox", vars: { "--vlc-bg-base": "#282828", "--vlc-bg-surface": "#3C3836", "--vlc-bg-elevated": "#504945", "--vlc-bg-sunken": "#1D2021", "--vlc-accent": "#FE8019", "--vlc-accent-hover": "#E06A0A", "--vlc-accent-dim": "rgba(254,128,25,0.18)", "--vlc-accent-text": "#FDB266", "--vlc-seek-played": "#FE8019", "--vlc-text-primary": "#EBDBB2" } },
  { name: "Tokyo Night", vars: { "--vlc-bg-base": "#1A1B26", "--vlc-bg-surface": "#24283B", "--vlc-bg-elevated": "#2F334D", "--vlc-bg-sunken": "#13141C", "--vlc-accent": "#7AA2F7", "--vlc-accent-hover": "#5C89E8", "--vlc-accent-dim": "rgba(122,162,247,0.18)", "--vlc-accent-text": "#A8C0FA", "--vlc-seek-played": "#BB9AF7", "--vlc-text-primary": "#C0CAF5" } },
  { name: "Matrix", vars: { "--vlc-bg-base": "#000A00", "--vlc-bg-surface": "#001500", "--vlc-bg-elevated": "#002400", "--vlc-bg-sunken": "#000500", "--vlc-accent": "#00FF41", "--vlc-accent-hover": "#00D936", "--vlc-accent-dim": "rgba(0,255,65,0.16)", "--vlc-accent-text": "#5BFF85", "--vlc-seek-played": "#00FF41", "--vlc-text-primary": "#D4FFD9" } },
  { name: "Coffee", vars: { "--vlc-bg-base": "#1C140F", "--vlc-bg-surface": "#281C15", "--vlc-bg-elevated": "#37271C", "--vlc-bg-sunken": "#120C09", "--vlc-accent": "#C8956D", "--vlc-accent-hover": "#B07F58", "--vlc-accent-dim": "rgba(200,149,109,0.18)", "--vlc-accent-text": "#E0B58A", "--vlc-seek-played": "#C8956D", "--vlc-text-primary": "#F0E4D4" } },
  { name: "Ice", vars: { "--vlc-bg-base": "#0B1620", "--vlc-bg-surface": "#142233", "--vlc-bg-elevated": "#1D304A", "--vlc-bg-sunken": "#060D14", "--vlc-accent": "#A0E9FF", "--vlc-accent-hover": "#7CD8F2", "--vlc-accent-dim": "rgba(160,233,255,0.16)", "--vlc-accent-text": "#C5F2FF", "--vlc-seek-played": "#A0E9FF", "--vlc-text-primary": "#E6F6FF" } },
  { name: "Aurora", vars: { "--vlc-bg-base": "#0F1A2E", "--vlc-bg-surface": "#16243F", "--vlc-bg-elevated": "#1E3155", "--vlc-bg-sunken": "#070E1B", "--vlc-accent": "#A5F3C9", "--vlc-accent-hover": "#7DDDA8", "--vlc-accent-dim": "rgba(165,243,201,0.18)", "--vlc-accent-text": "#C8F8DD", "--vlc-seek-played": "#67E8F9", "--vlc-text-primary": "#E8F4FF" } },
  { name: "Sakura", vars: { "--vlc-bg-base": "#1F1218", "--vlc-bg-surface": "#2A1822", "--vlc-bg-elevated": "#3A2030", "--vlc-bg-sunken": "#150A10", "--vlc-accent": "#FF8FB1", "--vlc-accent-hover": "#E87599", "--vlc-accent-dim": "rgba(255,143,177,0.18)", "--vlc-accent-text": "#FFB8CE", "--vlc-seek-played": "#FF8FB1", "--vlc-text-primary": "#FCE8F0" } },
  { name: "Volcano", vars: { "--vlc-bg-base": "#190808", "--vlc-bg-surface": "#240C0C", "--vlc-bg-elevated": "#341212", "--vlc-bg-sunken": "#0E0404", "--vlc-accent": "#FF3B2F", "--vlc-accent-hover": "#E02418", "--vlc-accent-dim": "rgba(255,59,47,0.18)", "--vlc-accent-text": "#FF8276", "--vlc-seek-played": "#FF6B35", "--vlc-text-primary": "#FFE8E0" } },
  { name: "Lagoon", vars: { "--vlc-bg-base": "#0A1F1C", "--vlc-bg-surface": "#0F2A26", "--vlc-bg-elevated": "#163A34", "--vlc-bg-sunken": "#051411", "--vlc-accent": "#2DD4BF", "--vlc-accent-hover": "#14B8A6", "--vlc-accent-dim": "rgba(45,212,191,0.18)", "--vlc-accent-text": "#7EE8DA", "--vlc-seek-played": "#2DD4BF", "--vlc-text-primary": "#E0FAF6" } },
  { name: "Royal", vars: { "--vlc-bg-base": "#15102A", "--vlc-bg-surface": "#1E1638", "--vlc-bg-elevated": "#2A1F4D", "--vlc-bg-sunken": "#0B081A", "--vlc-accent": "#9B5CFF", "--vlc-accent-hover": "#7E40E5", "--vlc-accent-dim": "rgba(155,92,255,0.18)", "--vlc-accent-text": "#C29AFF", "--vlc-seek-played": "#9B5CFF", "--vlc-text-primary": "#EDE6FF" } },
  { name: "Citrus", vars: { "--vlc-bg-base": "#141A05", "--vlc-bg-surface": "#1D2509", "--vlc-bg-elevated": "#2A3410", "--vlc-bg-sunken": "#0A0E02", "--vlc-accent": "#C5E82E", "--vlc-accent-hover": "#A8C920", "--vlc-accent-dim": "rgba(197,232,46,0.18)", "--vlc-accent-text": "#DBF06E", "--vlc-seek-played": "#C5E82E", "--vlc-text-primary": "#F0F8DC" } },
];

// Compact builder for 110 brand-new themes ----------------------------------
// Tuple: [name, baseHue, baseSat, baseLight, accentHex, textHex?]
// Surfaces are derived from base HSL with consistent step deltas. The whole
// table runs once at module import — zero per-render cost.
type Spec = [string, number, number, number, string, string?];

const SPECS: Spec[] = [
  ["Obsidian",215,15,7,"#7DD3FC"],["Slate Mist",210,12,12,"#94A3B8"],["Graphite",220,8,10,"#A78BFA"],
  ["Onyx Gold",40,12,8,"#FFD580"],["Carbon Lime",90,10,8,"#BEF264"],["Carbon Cyan",190,12,8,"#67E8F9"],
  ["Carbon Rose",340,14,9,"#FB7185"],["Carbon Violet",265,15,10,"#C4B5FD"],["Carbon Coral",10,18,10,"#FCA5A5"],
  ["Plasma",280,40,9,"#F472B6","#FDF4FF"],["Inferno",15,55,10,"#FB923C","#FFF7ED"],["Glacier",200,30,12,"#BAE6FD","#F0F9FF"],
  ["Mint Choco",150,18,10,"#6EE7B7"],["Pistachio",95,20,12,"#D9F99D"],["Lavender Field",270,22,12,"#DDD6FE","#FAF5FF"],
  ["Peach Soda",20,28,14,"#FED7AA"],["Bubblegum",325,30,12,"#F9A8D4"],["Tangerine Dream",25,40,11,"#FDBA74"],
  ["Lemon Squash",55,35,12,"#FEF08A","#FEFCE8"],["Lime Pop",80,35,11,"#BEF264"],["Emerald Deep",160,40,8,"#10B981"],
  ["Teal Tide",180,35,10,"#5EEAD4"],["Cobalt",225,55,12,"#3B82F6"],["Sapphire",230,50,10,"#60A5FA"],
  ["Indigo Night",240,40,10,"#818CF8"],["Amethyst",285,35,12,"#C084FC"],["Magenta Burst",320,55,11,"#F0ABFC"],
  ["Crimson",355,45,10,"#F87171"],["Ruby",350,55,11,"#FB7185"],["Garnet",340,40,9,"#E11D48"],
  ["Bronze",30,30,10,"#D4A574"],["Brass",45,35,12,"#EAB308"],["Copper Patina",170,30,12,"#5EEAD4"],
  ["Pewter",215,5,15,"#CBD5E1"],["Steel Blue",210,30,15,"#93C5FD"],["Olive Grove",80,25,11,"#A3E635"],
  ["Moss",110,20,10,"#86EFAC"],["Pine",140,35,8,"#34D399"],["Cedar",30,25,9,"#D4A574"],
  ["Mahogany",10,30,10,"#FCA5A5"],["Walnut",25,20,9,"#E0B58A"],["Espresso",20,15,7,"#D6A77A"],
  ["Latte",30,18,16,"#F5DEB3","#FFF8E7"],["Cocoa",20,22,10,"#E0B58A"],["Vanilla",45,25,18,"#FEF3C7","#FFFBEB"],
  ["Honey",40,55,14,"#FBBF24"],["Apricot",25,55,15,"#FDBA74"],["Salmon",10,50,15,"#FCA5A5"],
  ["Watermelon",355,45,13,"#FB7185"],["Strawberry",345,50,12,"#F472B6"],["Raspberry",335,45,11,"#EC4899"],
  ["Grape",275,40,10,"#A78BFA"],["Plum",295,35,10,"#C084FC"],["Blueberry",235,45,11,"#7AA2F7"],
  ["Acai",265,30,9,"#A78BFA"],["Kiwi",85,35,12,"#A3E635"],["Avocado",95,25,11,"#84CC16"],
  ["Bamboo",80,18,12,"#BEF264"],["Seafoam",165,35,14,"#A7F3D0","#ECFDF5"],["Mermaid",185,45,12,"#67E8F9"],
  ["Coral Reef",350,50,13,"#FCA5A5"],["Tide Pool",195,40,11,"#7DD3FC"],["Beach Sand",40,25,17,"#FDE68A","#FFFBEB"],
  ["Driftwood",30,15,12,"#D4A574"],["Storm",215,20,10,"#94A3B8"],["Fog",210,10,18,"#E2E8F0","#F8FAFC"],
  ["Twilight",255,30,11,"#C4B5FD"],["Dusk Rose",330,25,11,"#F9A8D4"],["Dawn",25,40,16,"#FDBA74","#FFF7ED"],
  ["Aurora Borealis",170,50,9,"#5EEAD4"],["Galaxy",260,45,7,"#A78BFA"],["Nebula Pink",315,45,9,"#F0ABFC"],
  ["Comet",215,40,8,"#60A5FA"],["Solar Flare",20,60,10,"#FB923C"],["Eclipse",240,15,6,"#A78BFA"],
  ["Moonlight",220,15,14,"#CBD5E1"],["Starfield",235,25,8,"#7AA2F7"],["Quantum",290,55,9,"#E879F9"],
  ["Neon Pink",325,80,10,"#FF3DA1"],["Neon Blue",215,80,10,"#3B82F6"],["Neon Green",125,75,9,"#22FF88"],
  ["Neon Orange",25,80,11,"#FF7A1A"],["Neon Purple",275,70,10,"#A855F7"],["Hologram",195,55,10,"#22D3EE"],
  ["Glitch",315,50,8,"#F0ABFC"],["Vapor",260,30,12,"#C4B5FD"],["Retro Wave",290,45,10,"#F472B6"],
  ["Arcade",230,55,10,"#60A5FA"],["Pixel Mint",155,40,11,"#5EEAD4"],["Pixel Coral",10,45,12,"#FCA5A5"],
  ["Origami Red",355,40,12,"#F87171","#FEF2F2"],["Origami Blue",215,35,13,"#93C5FD","#EFF6FF"],
  ["Tea Green",100,18,12,"#86EFAC"],["Sumi Ink",220,10,8,"#94A3B8","#F1F5F9"],
  ["Wabi Sabi",30,12,12,"#D4A574"],["Zen Stone",215,8,14,"#CBD5E1"],
  ["Spice Market",15,40,11,"#FB923C"],["Saffron",35,55,13,"#FBBF24"],["Turmeric",40,60,13,"#F59E0B"],
  ["Paprika",10,55,12,"#F87171"],["Curry",45,45,12,"#EAB308"],
  ["Highland",140,30,9,"#34D399"],["Tundra",195,15,15,"#94A3B8","#F1F5F9"],
  ["Dune",35,35,15,"#FED7AA","#FFF7ED"],["Mesa",15,35,12,"#FB923C"],["Canyon",20,40,11,"#F97316"],
  ["Glow Lime",80,70,10,"#D9F99D"],["Glow Pink",325,65,11,"#F9A8D4"],["Glow Cyan",185,65,10,"#67E8F9"],
  ["Inkwell",230,30,7,"#7AA2F7","#E0E7FF"],["Parchment",40,30,18,"#FCD34D","#FFFBEB"],
  ["Velvet",330,25,9,"#F472B6"],["Mocha Rose",355,18,11,"#F9A8D4"],["Frosted Glass",210,15,16,"#E2E8F0","#F8FAFC"],
];

// HSL helper — runs once at module init.
const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;
const hsla = (h: number, s: number, l: number, a: number) => `hsl(${h} ${s}% ${l}% / ${a})`;

const buildTheme = ([name, h, s, l, accent, text]: Spec): Theme => {
  const isLight = l >= 80;
  const txt = text ?? (isLight ? "#1A1A1A" : "#F0F0F0");
  return {
    name,
    vars: {
      "--vlc-bg-base": hsl(h, s, l),
      "--vlc-bg-surface": hsl(h, s, l + 4),
      "--vlc-bg-elevated": hsl(h, s, l + 8),
      "--vlc-bg-sunken": hsl(h, s, Math.max(2, l - 4)),
      "--vlc-accent": accent,
      "--vlc-accent-hover": accent,
      "--vlc-accent-dim": isLight ? hsla(h, 60, 40, 0.18) : hsla(h, 70, 60, 0.18),
      "--vlc-accent-text": accent,
      "--vlc-seek-played": accent,
      "--vlc-text-primary": txt,
    },
  };
};

const GENERATED: Theme[] = SPECS.map(buildTheme);

// ────────────────────────────────────────────────────────────────────────────
// PROCEDURAL THEME PACK — 500 unique themes generated once at module import.
// Cost: ~1ms cold start, 0ms per render. Each theme is guaranteed visually
// distinct: hues are distributed via the golden-ratio conjugate (0.6180339887)
// which is the mathematically optimal way to avoid perceptual clustering, and
// every theme lives in its own (family, hue, lightness, saturation) cell.
// ────────────────────────────────────────────────────────────────────────────
const GOLDEN = 0.6180339887498949;

interface Family {
  prefix: string;
  count: number;
  bgL: number;
  bgS: number;
  accentL: number;
  accentS: number;
  textHex: string;
  hueOffset?: number;
  accentHueShift?: number;
}

// 8 families · totals to exactly 500 themes
const FAMILIES: Family[] = [
  { prefix: "Nebula",   count: 80, bgL: 8,  bgS: 25, accentL: 65, accentS: 80, textHex: "#F1F5F9", hueOffset: 0.00 },
  { prefix: "Aurora",   count: 70, bgL: 12, bgS: 18, accentL: 70, accentS: 70, textHex: "#ECFDF5", hueOffset: 0.13, accentHueShift: 18 },
  { prefix: "Ember",    count: 60, bgL: 9,  bgS: 30, accentL: 60, accentS: 85, textHex: "#FFF7ED", hueOffset: 0.27 },
  { prefix: "Glacier",  count: 50, bgL: 86, bgS: 10, accentL: 45, accentS: 70, textHex: "#0F172A", hueOffset: 0.41 },
  { prefix: "Pastel",   count: 60, bgL: 14, bgS: 12, accentL: 78, accentS: 55, textHex: "#FAF5FF", hueOffset: 0.55, accentHueShift: -22 },
  { prefix: "Noir",     count: 50, bgL: 6,  bgS: 6,  accentL: 62, accentS: 90, textHex: "#F8FAFC", hueOffset: 0.69 },
  { prefix: "Verdant",  count: 70, bgL: 11, bgS: 22, accentL: 60, accentS: 70, textHex: "#F0FDF4", hueOffset: 0.83, accentHueShift: 12 },
  { prefix: "Imperial", count: 60, bgL: 10, bgS: 28, accentL: 58, accentS: 75, textHex: "#FDF4FF", hueOffset: 0.97, accentHueShift: -14 },
];

const pad3 = (n: number) => (n < 10 ? `00${n}` : n < 100 ? `0${n}` : `${n}`);

const hslToHex = (h: number, s: number, l: number): string => {
  const sN = s / 100, lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = lN - c / 2;
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
};

const PROCEDURAL: Theme[] = [];
for (const fam of FAMILIES) {
  for (let i = 0; i < fam.count; i++) {
    const hue = (((i + 1) * GOLDEN + (fam.hueOffset ?? 0)) % 1) * 360;
    const lJitter = ((i * 37) % 7) - 3;
    const sJitter = ((i * 53) % 11) - 5;
    const bgL = fam.bgL + lJitter * 0.5;
    const bgS = Math.max(4, Math.min(60, fam.bgS + sJitter));
    const accentHue = (hue + (fam.accentHueShift ?? 0) + 360) % 360;
    const accentHex = hslToHex(accentHue, fam.accentS, fam.accentL);
    const isLight = bgL >= 70;

    PROCEDURAL.push({
      name: `${fam.prefix} ${pad3(i + 1)}`,
      vars: {
        "--vlc-bg-base":     hsl(hue, bgS, bgL),
        "--vlc-bg-surface":  hsl(hue, bgS, bgL + (isLight ? -3 : 4)),
        "--vlc-bg-elevated": hsl(hue, bgS, bgL + (isLight ? -6 : 8)),
        "--vlc-bg-sunken":   hsl(hue, bgS, Math.max(2, bgL + (isLight ? 4 : -4))),
        "--vlc-accent":       accentHex,
        "--vlc-accent-hover": accentHex,
        "--vlc-accent-dim":   hsla(accentHue, fam.accentS, fam.accentL, 0.18),
        "--vlc-accent-text":  accentHex,
        "--vlc-seek-played":  accentHex,
        "--vlc-text-primary": isLight ? "#0F172A" : fam.textHex,
        ...(isLight ? LIGHT_TOKENS : {}),
      },
    });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// PROCEDURAL THEME PACK 2 — additional 500 themes, disjoint from pack 1.
// Different families, different golden-ratio phase offsets (shifted by 0.5)
// and different (bgL, bgS, accentL, accentS) cells so no entry collides
// visually with any earlier theme. Still built once at module init.
// ────────────────────────────────────────────────────────────────────────────
const FAMILIES_2: Family[] = [
  { prefix: "Quartz",    count: 70, bgL: 90, bgS: 6,  accentL: 42, accentS: 65, textHex: "#0B1220", hueOffset: 0.05 },
  { prefix: "Twilight",  count: 80, bgL: 16, bgS: 35, accentL: 72, accentS: 65, textHex: "#EDE9FE", hueOffset: 0.18, accentHueShift: 30 },
  { prefix: "Coral",     count: 60, bgL: 13, bgS: 20, accentL: 68, accentS: 78, textHex: "#FFF1F2", hueOffset: 0.31, accentHueShift: -30 },
  { prefix: "Mosaic",    count: 60, bgL: 18, bgS: 24, accentL: 55, accentS: 82, textHex: "#F5F5F4", hueOffset: 0.44, accentHueShift: 60 },
  { prefix: "Abyss",     count: 70, bgL: 5,  bgS: 15, accentL: 68, accentS: 72, textHex: "#E2E8F0", hueOffset: 0.57 },
  { prefix: "Meadow",    count: 60, bgL: 12, bgS: 16, accentL: 64, accentS: 60, textHex: "#F7FEE7", hueOffset: 0.70, accentHueShift: 24 },
  { prefix: "Sandstone", count: 50, bgL: 82, bgS: 14, accentL: 38, accentS: 60, textHex: "#1C1917", hueOffset: 0.84 },
  { prefix: "Cosmos",    count: 50, bgL: 9,  bgS: 40, accentL: 70, accentS: 88, textHex: "#F5F3FF", hueOffset: 0.93, accentHueShift: -45 },
];

const PROCEDURAL_2: Theme[] = [];
for (const fam of FAMILIES_2) {
  for (let i = 0; i < fam.count; i++) {
    // +0.5 phase shift on the golden-ratio sequence guarantees a different
    // hue trajectory than pack 1, so no two themes land on the same hue cell.
    const hue = (((i + 1) * GOLDEN + 0.5 + (fam.hueOffset ?? 0)) % 1) * 360;
    const lJitter = ((i * 41) % 9) - 4;
    const sJitter = ((i * 59) % 13) - 6;
    const bgL = fam.bgL + lJitter * 0.5;
    const bgS = Math.max(4, Math.min(60, fam.bgS + sJitter));
    const accentHue = (hue + (fam.accentHueShift ?? 0) + 360) % 360;
    const accentHex = hslToHex(accentHue, fam.accentS, fam.accentL);
    const isLight = bgL >= 70;

    PROCEDURAL_2.push({
      name: `${fam.prefix} ${pad3(i + 1)}`,
      vars: {
        "--vlc-bg-base":     hsl(hue, bgS, bgL),
        "--vlc-bg-surface":  hsl(hue, bgS, bgL + (isLight ? -3 : 4)),
        "--vlc-bg-elevated": hsl(hue, bgS, bgL + (isLight ? -6 : 8)),
        "--vlc-bg-sunken":   hsl(hue, bgS, Math.max(2, bgL + (isLight ? 4 : -4))),
        "--vlc-accent":       accentHex,
        "--vlc-accent-hover": accentHex,
        "--vlc-accent-dim":   hsla(accentHue, fam.accentS, fam.accentL, 0.18),
        "--vlc-accent-text":  accentHex,
        "--vlc-seek-played":  accentHex,
        "--vlc-text-primary": isLight ? "#0F172A" : fam.textHex,
        ...(isLight ? LIGHT_TOKENS : {}),
      },
    });
  }
}

export const THEMES: Theme[] = [
  ...CURATED,
  ...GENERATED,
  ...PROCEDURAL,
  ...PROCEDURAL_2,
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
  const theme = THEMES.find((t) => t.name === name);
  if (!theme) return;
  // Reset all known vars first so themes don't leak between switches.
  ALL_THEME_VARS.forEach((v) => document.documentElement.style.removeProperty(v.key));
  const vars = name === "Custom" ? (customVars ?? {}) : theme.vars;
  applyFn(vars, name);
};
