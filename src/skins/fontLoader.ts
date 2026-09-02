// On-demand web font loading.
//
// Root previously shipped one render-blocking Google Fonts stylesheet asking
// for ~62 families. Only the two families of the default skin are needed at
// first paint; every other family is fetched the first time a skin that uses
// it becomes active.

/** family name (as written in skin tokens) -> css2 query fragment */
const FONT_QUERIES: Record<string, string> = {
  "Inter": "family=Inter:wght@400;500;600;700",
  "JetBrains Mono": "family=JetBrains+Mono:wght@400;500;700",
  "Roboto": "family=Roboto:wght@400;500;700",
  "Poppins": "family=Poppins:wght@400;500;600;700",
  "Space Grotesk": "family=Space+Grotesk:wght@400;500;600;700",
  "Playfair Display": "family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700",
  "Bebas Neue": "family=Bebas+Neue",
  "Orbitron": "family=Orbitron:wght@400;500;700;900",
  "Rajdhani": "family=Rajdhani:wght@400;500;600;700",
  "IBM Plex Mono": "family=IBM+Plex+Mono:wght@400;500;600;700",
  "Libre Caslon Text": "family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400",
  "Press Start 2P": "family=Press+Start+2P",
  "Cinzel": "family=Cinzel:wght@400;500;600;700",
  "Shippori Mincho": "family=Shippori+Mincho:wght@400;500;600;700",
  "VT323": "family=VT323",
  "Manrope": "family=Manrope:wght@400;500;600;700",
  "Major Mono Display": "family=Major+Mono+Display",
  "Quicksand": "family=Quicksand:wght@400;500;600;700",
  "Special Elite": "family=Special+Elite",
  "Audiowide": "family=Audiowide",
  "Bangers": "family=Bangers",
  "Caveat": "family=Caveat:wght@400;500;600;700",
  "Fraunces": "family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600",
  "Syne": "family=Syne:wght@400;500;600;700;800",
  "Anton": "family=Anton",
  "DM Serif Display": "family=DM+Serif+Display:ital@0;1",
  "Space Mono": "family=Space+Mono:wght@400;700",
  "Karla": "family=Karla:wght@400;500;600;700",
  "Rubik": "family=Rubik:wght@400;500;600;700;800",
  "Righteous": "family=Righteous",
  "Alfa Slab One": "family=Alfa+Slab+One",
  "PT Serif": "family=PT+Serif:ital,wght@0,400;0,700;1,400",
  "Cormorant Garamond": "family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400",
  "Teko": "family=Teko:wght@400;500;600;700",
  "Chakra Petch": "family=Chakra+Petch:wght@400;500;600;700",
  "Viga": "family=Viga",
  "Pacifico": "family=Pacifico",
  "Sacramento": "family=Sacramento",
  "Kalam": "family=Kalam:wght@400;700",
  "Permanent Marker": "family=Permanent+Marker",
  "Monoton": "family=Monoton",
  "Stalinist One": "family=Stalinist+One",
  "Faster One": "family=Faster+One",
  "UnifrakturCook": "family=UnifrakturCook:wght@700",
  "Zilla Slab": "family=Zilla+Slab:wght@400;500;600;700",
  "Abril Fatface": "family=Abril+Fatface",
  "Exo 2": "family=Exo+2:wght@400;500;600;700",
  "Courier Prime": "family=Courier+Prime:wght@400;700",
  "Share Tech Mono": "family=Share+Tech+Mono",
  "Pirata One": "family=Pirata+One",
  "Gruppo": "family=Gruppo",
  "Nixie One": "family=Nixie+One",
  "Comfortaa": "family=Comfortaa:wght@400;500;600;700",
  "ABeeZee": "family=ABeeZee:ital@0;1",
  "Silkscreen": "family=Silkscreen:wght@400;700",
  "Archivo Black": "family=Archivo+Black",
  "Instrument Serif": "family=Instrument+Serif:ital@0;1",
  "Urbanist": "family=Urbanist:wght@400;500;600;700;800",
  "Libre Baskerville": "family=Libre+Baskerville:wght@400;700",
  "M PLUS Rounded 1c": "family=M+PLUS+Rounded+1c:wght@400;500;700;800",
  "Lora": "family=Lora:ital,wght@0,400;0,600;0,700;1,400",
  "Inter Tight": "family=Inter+Tight:wght@400;500;600;700",
};

/** Families already delivered by the root stylesheet — never re-request. */
const PRELOADED = new Set(["Inter", "JetBrains Mono"]);

const loaded = new Set<string>(PRELOADED);

/**
 * Scan CSS token values for quoted font family names and lazily append a
 * Google Fonts stylesheet for each known family that isn't loaded yet.
 * Non-Google families (system-ui, "SF Pro Display", …) are ignored.
 */
export function ensureSkinFonts(tokens: Record<string, string>, extraCss = "") {
  if (typeof document === "undefined") return;
  const sources = [
    ...Object.entries(tokens)
      .filter(([k]) => k.startsWith("--vlc-font-"))
      .map(([, v]) => v),
    extraCss,
  ].join(" ");

  const wanted: string[] = [];
  for (const match of sources.matchAll(/"([^"]+)"/g)) {
    const family = match[1];
    if (loaded.has(family)) continue;
    const query = FONT_QUERIES[family];
    if (!query) continue;
    loaded.add(family);
    wanted.push(query);
  }
  if (!wanted.length) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${wanted.join("&")}&display=swap`;
  document.head.appendChild(link);
}