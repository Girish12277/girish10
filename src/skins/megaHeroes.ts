import type { SkinHero } from "./types";
interface MegaSpec { id: string; name: string; tagline: string; font: string; base: string; surface: string; elevated: string; sunken: string; accent: string; text: string; secondary: string; radius: "sharp" | "soft" | "round" | "pill" | "square"; tags: string[]; pattern: string; }
const SPECS: MegaSpec[] = [
  { id: "obsidian-studio", name: "Obsidian Studio", tagline: "Editorial black glass. White-room contrast.", font: '"DM Serif Display", Georgia, serif', base: "#050506", surface: "#121217", elevated: "#1d1d26", sunken: "#000000", accent: "#ffffff", text: "#d6d8df", secondary: "rgba(214,216,223,0.72)", radius: "sharp", tags: ['dark', 'editorial', 'premium'], pattern: "glass" },
  { id: "polar-pro", name: "Polar Pro", tagline: "Snowfield chrome. Arctic cyan controls.", font: '"Manrope", system-ui, sans-serif', base: "#eef6fb", surface: "#ffffff", elevated: "#f7fbff", sunken: "#dceaf2", accent: "#0077b6", text: "#071923", secondary: "rgba(7,25,35,0.68)", radius: "soft", tags: ['light', 'pro', 'cool'], pattern: "frost" },
  { id: "cobalt-command", name: "Cobalt Command", tagline: "Dense broadcast console with electric blue telemetry.", font: '"Chakra Petch", sans-serif', base: "#06101f", surface: "#0b1930", elevated: "#122744", sunken: "#03070d", accent: "#21a7ff", text: "#ecf8ff", secondary: "rgba(236,248,255,0.72)", radius: "sharp", tags: ['dark', 'blue', 'hud'], pattern: "grid" },
  { id: "ruby-theater", name: "Ruby Theater", tagline: "Velvet cinema curtains and jewel-red trim.", font: '"Playfair Display", Georgia, serif', base: "#120006", surface: "#24000c", elevated: "#3a0615", sunken: "#070003", accent: "#e11d48", text: "#ffe4ec", secondary: "rgba(255,228,236,0.72)", radius: "soft", tags: ['dark', 'cinema', 'red'], pattern: "curtain" },
  { id: "mint-lab", name: "Mint Lab", tagline: "Clinical white surfaces with sterile green action states.", font: '"Karla", system-ui, sans-serif', base: "#f2fffb", surface: "#ffffff", elevated: "#ffffff", sunken: "#d9f4ea", accent: "#00a676", text: "#09221a", secondary: "rgba(9,34,26,0.68)", radius: "soft", tags: ['light', 'green', 'clean'], pattern: "dots" },
  { id: "amber-terminal", name: "Amber Terminal", tagline: "Old amber CRT terminal. Serious, readable, fast.", font: '"Share Tech Mono", monospace', base: "#080604", surface: "#150f08", elevated: "#241708", sunken: "#030201", accent: "#ffb02e", text: "#ffd99a", secondary: "rgba(255,217,154,0.74)", radius: "square", tags: ['dark', 'terminal', 'retro'], pattern: "scan" },
  { id: "paper-cut", name: "Paper Cut", tagline: "Cut-paper monochrome with red editorial marks.", font: '"Zilla Slab", Georgia, serif', base: "#f7f3ea", surface: "#fffdf8", elevated: "#ffffff", sunken: "#ece4d8", accent: "#d72638", text: "#19130f", secondary: "rgba(25,19,15,0.68)", radius: "sharp", tags: ['light', 'editorial', 'print'], pattern: "paper" },
  { id: "cyber-lime", name: "Cyber Lime", tagline: "Black hardware with lime vector overlays.", font: '"Orbitron", monospace', base: "#020805", surface: "#07120c", elevated: "#0d2115", sunken: "#000301", accent: "#7cff00", text: "#edffe0", secondary: "rgba(237,255,224,0.72)", radius: "sharp", tags: ['dark', 'neon', 'cyber'], pattern: "grid" },
  { id: "coral-wave", name: "Coral Wave", tagline: "Warm coastal player with soft coral controls.", font: '"Quicksand", sans-serif', base: "#fff4ef", surface: "#ffffff", elevated: "#fffaf7", sunken: "#ffe2d6", accent: "#ff5a5f", text: "#30201d", secondary: "rgba(48,32,29,0.68)", radius: "round", tags: ['light', 'warm', 'soft'], pattern: "waves" },
  { id: "steel-editor", name: "Steel Editor", tagline: "NLE-style gray steel workspace for pros.", font: '"IBM Plex Mono", monospace', base: "#15181d", surface: "#22262d", elevated: "#2f3540", sunken: "#0d0f13", accent: "#8ab4f8", text: "#f1f5f9", secondary: "rgba(241,245,249,0.68)", radius: "sharp", tags: ['dark', 'pro', 'dense'], pattern: "rulers" },
  { id: "lavender-bloom", name: "Lavender Bloom", tagline: "Soft floral lavender without losing control contrast.", font: '"Cormorant Garamond", Georgia, serif', base: "#fbf5ff", surface: "#ffffff", elevated: "#fffaff", sunken: "#eee0f8", accent: "#9d4edd", text: "#281335", secondary: "rgba(40,19,53,0.68)", radius: "round", tags: ['light', 'soft', 'luxury'], pattern: "petal" },
  { id: "solar-console", name: "Solar Console", tagline: "Warm solarized control room with amber data marks.", font: '"Space Mono", monospace', base: "#002b36", surface: "#073642", elevated: "#0b4653", sunken: "#001f27", accent: "#b58900", text: "#eee8d5", secondary: "rgba(238,232,213,0.74)", radius: "sharp", tags: ['dark', 'solarized', 'terminal'], pattern: "rulers" },
  { id: "alpine-night", name: "Alpine Night", tagline: "Deep mountain night, glacier-blue controls.", font: '"Exo 2", sans-serif', base: "#07111f", surface: "#0e1b2c", elevated: "#172944", sunken: "#030812", accent: "#67e8f9", text: "#eefbff", secondary: "rgba(238,251,255,0.72)", radius: "soft", tags: ['dark', 'cool', 'cinema'], pattern: "mountain" },
  { id: "banana-split", name: "Banana Split", tagline: "Playful yellow diner UI with chocolate ink.", font: '"Bangers", Impact, sans-serif', base: "#fff7b8", surface: "#fffce0", elevated: "#ffffff", sunken: "#f4df75", accent: "#f97316", text: "#2f1b05", secondary: "rgba(47,27,5,0.7)", radius: "round", tags: ['light', 'playful', 'retro'], pattern: "stripes" },
  { id: "graphite-ios", name: "Graphite iOS", tagline: "Minimal graphite mobile-player polish.", font: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif', base: "#111113", surface: "#1c1c1f", elevated: "#2c2c32", sunken: "#09090a", accent: "#0a84ff", text: "#f5f5f7", secondary: "rgba(245,245,247,0.7)", radius: "soft", tags: ['dark', 'minimal', 'apple'], pattern: "glass" },
  { id: "ultraviolet-club", name: "Ultraviolet Club", tagline: "Nightclub UV glow with high-readability labels.", font: '"Syne", sans-serif', base: "#0b0614", surface: "#160b2b", elevated: "#241047", sunken: "#050208", accent: "#c084fc", text: "#f4e8ff", secondary: "rgba(244,232,255,0.72)", radius: "soft", tags: ['dark', 'purple', 'music'], pattern: "glow" },
  { id: "newsroom-redline", name: "Newsroom Redline", tagline: "Breaking-news lower-third energy.", font: '"Archivo Black", Impact, sans-serif', base: "#f5f5f2", surface: "#ffffff", elevated: "#ffffff", sunken: "#e5e5df", accent: "#c1121f", text: "#111111", secondary: "rgba(17,17,17,0.7)", radius: "sharp", tags: ['light', 'news', 'bold'], pattern: "rulers" },
  { id: "forest-cabin", name: "Forest Cabin", tagline: "Evergreen matte panels, maple accent controls.", font: '"Lora", Georgia, serif', base: "#07140d", surface: "#102418", elevated: "#1b3425", sunken: "#020704", accent: "#d69f45", text: "#f3ead7", secondary: "rgba(243,234,215,0.72)", radius: "soft", tags: ['dark', 'forest', 'warm'], pattern: "wood" },
  { id: "porcelain-blue", name: "Porcelain Blue", tagline: "Fine china blue lines on porcelain white.", font: '"Libre Caslon Text", Georgia, serif', base: "#f8fbff", surface: "#ffffff", elevated: "#ffffff", sunken: "#e7eff8", accent: "#2454a6", text: "#0f2347", secondary: "rgba(15,35,71,0.68)", radius: "soft", tags: ['light', 'blue', 'classic'], pattern: "porcelain" },
  { id: "inkwash", name: "Ink Wash", tagline: "Japanese sumi ink surfaces with calm red stamp.", font: '"Shippori Mincho", serif', base: "#f2efe8", surface: "#fbfaf6", elevated: "#ffffff", sunken: "#ded8cb", accent: "#b91c1c", text: "#17120c", secondary: "rgba(23,18,12,0.7)", radius: "sharp", tags: ['light', 'japanese', 'minimal'], pattern: "paper" },
  { id: "hologram-blue", name: "Hologram Blue", tagline: "Transparent sci-fi glass with cyan hologram rails.", font: '"Gruppo", sans-serif', base: "#041018", surface: "#071b28", elevated: "#0c2d42", sunken: "#01070b", accent: "#22d3ee", text: "#e0fbff", secondary: "rgba(224,251,255,0.72)", radius: "pill", tags: ['dark', 'glass', 'future'], pattern: "holo" },
  { id: "rose-gold-pro", name: "Rose Gold Pro", tagline: "Luxury rose-gold studio desk.", font: '"Cinzel", Georgia, serif', base: "#160c10", surface: "#26151c", elevated: "#3a2029", sunken: "#090507", accent: "#f4a7b9", text: "#fff1f5", secondary: "rgba(255,241,245,0.72)", radius: "soft", tags: ['dark', 'luxury', 'rose'], pattern: "metal" },
  { id: "oxide-industrial", name: "Oxide Industrial", tagline: "Rusty machine room with hazard-orange controls.", font: '"Teko", sans-serif', base: "#17110d", surface: "#261a12", elevated: "#3a2819", sunken: "#080503", accent: "#f97316", text: "#fff3e7", secondary: "rgba(255,243,231,0.72)", radius: "sharp", tags: ['dark', 'industrial', 'orange'], pattern: "hazard" },
  { id: "clinic-dark", name: "Clinic Dark", tagline: "Medical dashboard clarity on charcoal.", font: '"Rubik", sans-serif', base: "#071113", surface: "#0d1d20", elevated: "#173034", sunken: "#030708", accent: "#2dd4bf", text: "#edfffc", secondary: "rgba(237,255,252,0.72)", radius: "soft", tags: ['dark', 'medical', 'clean'], pattern: "grid" },
  { id: "sunset-miami", name: "Sunset Miami", tagline: "Hot Miami dusk with rounded neon controls.", font: '"Righteous", cursive', base: "#20102a", surface: "#321747", elevated: "#4b1f65", sunken: "#100514", accent: "#ff8fab", text: "#fff0f6", secondary: "rgba(255,240,246,0.72)", radius: "round", tags: ['dark', 'retro', 'pink'], pattern: "sunset" },
  { id: "blueprint", name: "Blueprint", tagline: "Architect blueprint grid, precise mono labeling.", font: '"Space Mono", monospace', base: "#071b3a", surface: "#0d2855", elevated: "#143a78", sunken: "#031026", accent: "#7dd3fc", text: "#eef9ff", secondary: "rgba(238,249,255,0.72)", radius: "sharp", tags: ['dark', 'blueprint', 'technical'], pattern: "blueprint" },
  { id: "ivory-gallery", name: "Ivory Gallery", tagline: "Museum-white gallery with quiet bronze controls.", font: '"Instrument Serif", Georgia, serif', base: "#fbfaf6", surface: "#ffffff", elevated: "#ffffff", sunken: "#ebe7dc", accent: "#a16207", text: "#201a11", secondary: "rgba(32,26,17,0.68)", radius: "soft", tags: ['light', 'gallery', 'luxury'], pattern: "paper" },
  { id: "acid-poster", name: "Acid Poster", tagline: "High-contrast gig poster with acid green action.", font: '"Permanent Marker", Impact, sans-serif', base: "#fff200", surface: "#ffffff", elevated: "#fff86b", sunken: "#e6d800", accent: "#111111", text: "#111111", secondary: "rgba(17,17,17,0.72)", radius: "sharp", tags: ['light', 'poster', 'bold'], pattern: "halftone" },
  { id: "midnight-copper", name: "Midnight Copper", tagline: "Copper-on-midnight precision instrument.", font: '"Rajdhani", sans-serif', base: "#070b12", surface: "#101722", elevated: "#1b2736", sunken: "#030509", accent: "#c47f3f", text: "#fff0df", secondary: "rgba(255,240,223,0.72)", radius: "sharp", tags: ['dark', 'copper', 'pro'], pattern: "metal" },
  { id: "glass-rain", name: "Glass Rain", tagline: "Rainy glass panels and electric droplet accents.", font: '"Poppins", sans-serif', base: "#081018", surface: "#101c26", elevated: "#1a2b39", sunken: "#03070b", accent: "#38bdf8", text: "#edf8ff", secondary: "rgba(237,248,255,0.72)", radius: "round", tags: ['dark', 'glass', 'blue'], pattern: "rain" },
  { id: "retro-tv", name: "Retro TV", tagline: "Cream plastic television with green phosphor readouts.", font: '"VT323", monospace', base: "#e8ddc7", surface: "#f8efd9", elevated: "#fff7e6", sunken: "#c9b997", accent: "#15a34a", text: "#16210c", secondary: "rgba(22,33,12,0.7)", radius: "round", tags: ['light', 'retro', 'tv'], pattern: "scan" },
  { id: "manga-night", name: "Manga Night", tagline: "Black manga panels, white ink, red impact marks.", font: '"Kalam", cursive', base: "#060606", surface: "#111111", elevated: "#1d1d1d", sunken: "#000000", accent: "#ef233c", text: "#ffffff", secondary: "rgba(255,255,255,0.72)", radius: "sharp", tags: ['dark', 'manga', 'ink'], pattern: "manga" },
  { id: "deep-sea", name: "Deep Sea", tagline: "Abyssal navy with bioluminescent teal controls.", font: '"Manrope", sans-serif', base: "#02131a", surface: "#06232d", elevated: "#0b3645", sunken: "#00080c", accent: "#14b8a6", text: "#e6fffb", secondary: "rgba(230,255,251,0.72)", radius: "soft", tags: ['dark', 'ocean', 'teal'], pattern: "waves" },
  { id: "whiteboard", name: "Whiteboard", tagline: "Marker-board utility with cobalt active ink.", font: '"Comic Sans MS", "Comic Neue", cursive', base: "#ffffff", surface: "#fbfbfb", elevated: "#ffffff", sunken: "#eeeeee", accent: "#2563eb", text: "#111827", secondary: "rgba(17,24,39,0.68)", radius: "sharp", tags: ['light', 'utility', 'casual'], pattern: "paper" },
  { id: "plasma-orange", name: "Plasma Orange", tagline: "Molten orange sci-fi burner UI.", font: '"Audiowide", monospace', base: "#100403", surface: "#1f0905", elevated: "#3a1008", sunken: "#050100", accent: "#ff6b00", text: "#fff1e6", secondary: "rgba(255,241,230,0.72)", radius: "soft", tags: ['dark', 'orange', 'sci-fi'], pattern: "glow" },
  { id: "sage-editor", name: "Sage Editor", tagline: "Calm sage productivity chrome.", font: '"ABeeZee", sans-serif', base: "#eef4ea", surface: "#ffffff", elevated: "#fbfffa", sunken: "#dbe8d5", accent: "#4d7c0f", text: "#17220f", secondary: "rgba(23,34,15,0.68)", radius: "soft", tags: ['light', 'green', 'minimal'], pattern: "dots" },
  { id: "carbon-fiber", name: "Carbon Fiber", tagline: "Motorsport carbon shell with redline controls.", font: '"Bebas Neue", Impact, sans-serif', base: "#050505", surface: "#111111", elevated: "#1e1e1e", sunken: "#000000", accent: "#dc2626", text: "#f7f7f7", secondary: "rgba(247,247,247,0.72)", radius: "sharp", tags: ['dark', 'racing', 'carbon'], pattern: "carbon" },
  { id: "pearl-luxe", name: "Pearl Luxe", tagline: "Pearlescent luxury skin with champagne action.", font: '"Cormorant Garamond", Georgia, serif', base: "#fbf8ef", surface: "#ffffff", elevated: "#fffdf8", sunken: "#eee6d6", accent: "#c9a84c", text: "#211a0b", secondary: "rgba(33,26,11,0.68)", radius: "round", tags: ['light', 'luxury', 'pearl'], pattern: "pearl" },
  { id: "quantum-violet", name: "Quantum Violet", tagline: "Scientific violet field with particle rails.", font: '"Major Mono Display", monospace', base: "#090415", surface: "#160a2b", elevated: "#25114a", sunken: "#030106", accent: "#a78bfa", text: "#f5f0ff", secondary: "rgba(245,240,255,0.72)", radius: "sharp", tags: ['dark', 'science', 'violet'], pattern: "particles" },
  { id: "desert-night", name: "Desert Night", tagline: "Nocturnal desert with sand-gold controls.", font: '"Fraunces", Georgia, serif', base: "#120d08", surface: "#21170f", elevated: "#342317", sunken: "#070402", accent: "#e8b86d", text: "#fff0d8", secondary: "rgba(255,240,216,0.72)", radius: "soft", tags: ['dark', 'desert', 'warm'], pattern: "sand" },
  { id: "skyline-light", name: "Skyline Light", tagline: "Airy city-glass light UI with blue signal.", font: '"Urbanist", system-ui, sans-serif', base: "#f2f7ff", surface: "#ffffff", elevated: "#ffffff", sunken: "#e1ecfb", accent: "#0ea5e9", text: "#0b1d34", secondary: "rgba(11,29,52,0.68)", radius: "pill", tags: ['light', 'city', 'glass'], pattern: "rulers" },
  { id: "radar-green", name: "Radar Green", tagline: "Radar scope panels and phosphor sweep.", font: '"Orbitron", monospace', base: "#020806", surface: "#06150d", elevated: "#0c2417", sunken: "#000302", accent: "#39ff88", text: "#eafff2", secondary: "rgba(234,255,242,0.72)", radius: "round", tags: ['dark', 'radar', 'green'], pattern: "radar" },
  { id: "typewriter-sepia", name: "Typewriter Sepia", tagline: "Sepia manuscript with black ribbon controls.", font: '"Special Elite", monospace', base: "#f3e7cf", surface: "#fff7e8", elevated: "#fffaf0", sunken: "#dcc8a4", accent: "#1f2937", text: "#21170b", secondary: "rgba(33,23,11,0.7)", radius: "sharp", tags: ['light', 'vintage', 'typewriter'], pattern: "paper" },
  { id: "laser-red", name: "Laser Red", tagline: "Black laser grid, aggressive red scanning UI.", font: '"Anton", Impact, sans-serif', base: "#080204", surface: "#170509", elevated: "#2a0810", sunken: "#020000", accent: "#ff1744", text: "#fff0f3", secondary: "rgba(255,240,243,0.72)", radius: "sharp", tags: ['dark', 'red', 'cyber'], pattern: "grid" },
  { id: "candy-terminal", name: "Candy Terminal", tagline: "Pastel terminal with bubblegum command accents.", font: '"Silkscreen", monospace', base: "#fff1fb", surface: "#ffffff", elevated: "#fffafd", sunken: "#f1dbeb", accent: "#ec4899", text: "#331527", secondary: "rgba(51,21,39,0.68)", radius: "round", tags: ['light', 'pixel', 'pink'], pattern: "dots" },
  { id: "navy-legal", name: "Navy Legal", tagline: "Executive navy and crisp document-white labels.", font: '"Libre Baskerville", Georgia, serif', base: "#07132a", surface: "#0e2140", elevated: "#18345e", sunken: "#030815", accent: "#60a5fa", text: "#f8fbff", secondary: "rgba(248,251,255,0.72)", radius: "sharp", tags: ['dark', 'navy', 'formal'], pattern: "rulers" },
  { id: "neon-noodle", name: "Neon Noodle", tagline: "Tokyo noodle-shop neon over lacquer black.", font: '"M PLUS Rounded 1c", sans-serif', base: "#090506", surface: "#180b0d", elevated: "#2a1215", sunken: "#030101", accent: "#ff3864", text: "#fff1f4", secondary: "rgba(255,241,244,0.72)", radius: "round", tags: ['dark', 'tokyo', 'neon'], pattern: "lantern" },
  { id: "metro-modern", name: "Metro Modern", tagline: "Transit-map blocks, flat panels, direct action.", font: '"Segoe UI", Tahoma, sans-serif', base: "#f4f6f8", surface: "#ffffff", elevated: "#ffffff", sunken: "#dde3ea", accent: "#0078d4", text: "#111827", secondary: "rgba(17,24,39,0.68)", radius: "sharp", tags: ['light', 'metro', 'flat'], pattern: "metro" },
  { id: "shadow-purple", name: "Shadow Purple", tagline: "Royal purple shadows with silver chrome controls.", font: '"Cinzel", Georgia, serif', base: "#0b0713", surface: "#171024", elevated: "#251739", sunken: "#050309", accent: "#c4b5fd", text: "#f6f2ff", secondary: "rgba(246,242,255,0.72)", radius: "soft", tags: ['dark', 'purple', 'luxury'], pattern: "metal" },
  { id: "terminal-white", name: "Terminal White", tagline: "Inverted terminal, white console with black command ink.", font: '"JetBrains Mono", monospace', base: "#f8f8f8", surface: "#ffffff", elevated: "#ffffff", sunken: "#e4e4e4", accent: "#111111", text: "#090909", secondary: "rgba(9,9,9,0.7)", radius: "sharp", tags: ['light', 'mono', 'terminal'], pattern: "grid" },
];

const RADIUS: Record<MegaSpec["radius"], readonly [string, string, string, string]> = { sharp: ["2px", "4px", "6px", "4px"], soft: ["8px", "12px", "18px", "10px"], round: ["14px", "22px", "30px", "999px"], pill: ["999px", "999px", "999px", "999px"], square: ["0", "0", "0", "0"] };
const patternCss = (pattern: string): string => {
  switch (pattern) {
    case "glass": return `backdrop-filter: blur(22px) saturate(160%); -webkit-backdrop-filter: blur(22px) saturate(160%);`;
    case "frost": return `backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);`;
    case "grid": return `background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px); background-size: 18px 18px;`;
    case "curtain": return `background-image: repeating-linear-gradient(90deg, rgba(0,0,0,.22) 0 18px, transparent 18px 36px);`;
    case "dots": return `background-image: radial-gradient(color-mix(in oklab, var(--vlc-accent) 18%, transparent) 1px, transparent 1.5px); background-size: 14px 14px;`;
    case "scan": return `background-image: repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 4px);`;
    case "paper": return `background-image: linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px); background-size: 100% 22px;`;
    case "waves": return `background-image: radial-gradient(ellipse at 20% 120%, color-mix(in oklab, var(--vlc-accent) 20%, transparent), transparent 45%);`;
    case "rulers": return `background-image: repeating-linear-gradient(90deg, color-mix(in oklab, var(--vlc-border-normal) 70%, transparent) 0 1px, transparent 1px 48px);`;
    case "petal": return `background-image: radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--vlc-accent) 16%, transparent), transparent 28%);`;
    case "mountain": return `clip-path: none;`;
    case "stripes": return `background-image: repeating-linear-gradient(-45deg, color-mix(in oklab, var(--vlc-accent) 14%, transparent) 0 12px, transparent 12px 24px);`;
    case "glow": return `box-shadow: inset 0 0 42px color-mix(in oklab, var(--vlc-accent) 18%, transparent);`;
    case "wood": return `background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0 2px, transparent 2px 9px);`;
    case "porcelain": return `background-image: linear-gradient(90deg, color-mix(in oklab, var(--vlc-accent) 16%, transparent) 1px, transparent 1px); background-size: 34px 100%;`;
    case "holo": return `background-image: linear-gradient(120deg, transparent, color-mix(in oklab, var(--vlc-accent) 12%, transparent), transparent);`;
    case "metal": return `background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.045) 0 1px, rgba(0,0,0,.045) 1px 2px);`;
    case "hazard": return `background-image: repeating-linear-gradient(45deg, color-mix(in oklab, var(--vlc-accent) 16%, transparent) 0 10px, transparent 10px 20px);`;
    case "sunset": return `background-image: linear-gradient(180deg, color-mix(in oklab, var(--vlc-accent) 16%, transparent), transparent 58%);`;
    case "halftone": return `background-image: radial-gradient(rgba(0,0,0,.22) 1px, transparent 1.5px); background-size: 8px 8px;`;
    case "rain": return `background-image: repeating-linear-gradient(105deg, rgba(255,255,255,.07) 0 1px, transparent 1px 12px);`;
    case "manga": return `background-image: radial-gradient(ellipse at center, transparent 55%, rgba(255,255,255,.06) 56%, transparent 58%); background-size: 18px 12px;`;
    case "carbon": return `background-image: repeating-linear-gradient(45deg, rgba(255,255,255,.04) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,.35) 0 2px, transparent 2px 6px);`;
    case "pearl": return `background-image: linear-gradient(120deg, rgba(255,255,255,.6), transparent 45%, rgba(255,255,255,.28));`;
    case "particles": return `background-image: radial-gradient(color-mix(in oklab, var(--vlc-accent) 28%, transparent) 1px, transparent 1.5px); background-size: 22px 17px;`;
    case "sand": return `background-image: radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px); background-size: 5px 5px;`;
    case "radar": return `background-image: radial-gradient(circle, transparent 38%, color-mix(in oklab, var(--vlc-accent) 18%, transparent) 39% 40%, transparent 41%); background-size: 120px 120px;`;
    case "lantern": return `box-shadow: inset 0 -16px 48px color-mix(in oklab, var(--vlc-accent) 18%, transparent);`;
    case "metro": return `background-image: linear-gradient(90deg, color-mix(in oklab, var(--vlc-accent) 22%, transparent) 0 6px, transparent 6px);`;
    case "ash": return `background-image: radial-gradient(rgba(255,255,255,.035) 1px, transparent 1px); background-size: 7px 7px;`;
    case "blueprint": return `background-image: linear-gradient(rgba(125,211,252,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.12) 1px, transparent 1px); background-size: 20px 20px;`;
    default: return "";
  }
};

export const MEGA_HEROES: SkinHero[] = SPECS.map((s) => {
  const [sm, md, lg, control] = RADIUS[s.radius];
  return {
    id: s.id,
    name: s.name,
    tagline: s.tagline,
    tags: [...s.tags, "wave-5"],
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
      "--vlc-text-ghost": `color-mix(in oklab, ${s.text} 62%, transparent)`,
      "--vlc-control-hover": `color-mix(in oklab, ${s.text} 9%, transparent)`,
      "--vlc-control-active": `color-mix(in oklab, ${s.accent} 22%, transparent)`,
      "--vlc-font-ui": s.font,
      "--vlc-font-mono": "\"JetBrains Mono\", \"Space Mono\", ui-monospace, monospace",
      "--vlc-radius-sm": sm,
      "--vlc-radius-md": md,
      "--vlc-radius-lg": lg,
      "--vlc-control-radius": control,
    },
    extraCss: "",
  };
});
