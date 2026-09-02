// Builds the catalog of 100 selectable skins by combining each hero with a
// set of accent/radius overlays. The total is intentionally ~100 — varying
// the accent and radius scale per hero is cheap, distinct enough to feel
// like a different skin, and keeps the runtime cost flat (one tokens object
// merged at switch time, no extra CSS).

import type { ResolvedSkin, SkinHero, SkinTokens, SkinVariant } from "./types";

interface AccentDef {
  /** Suffix shown after the hero name. */
  label: string;
  /** Primary accent color. */
  accent: string;
  /** Hover variant. */
  hover: string;
  /** Translucent tint. */
  dim: string;
  /** Lighter text-on-bg variant. */
  text: string;
  /** Optional override for seek played track (defaults to accent). */
  seek?: string;
  tags?: string[];
}

// 8 distinct accent palettes used across heroes. Combined with the 12 heroes
// and the original "default" entry, this lands the catalog at 12 * 9 = 108,
// trimmed to exactly 100 in registry construction below.
const ACCENTS: AccentDef[] = [
  { label: "Ember",     accent: "#ff5722", hover: "#cc4519", dim: "rgba(255,87,34,0.18)",  text: "#ff8a5c", tags: ["warm"] },
  { label: "Sapphire",  accent: "#1e88e5", hover: "#1565c0", dim: "rgba(30,136,229,0.18)", text: "#64b5f6", tags: ["cool", "blue"] },
  { label: "Emerald",   accent: "#00c853", hover: "#009933", dim: "rgba(0,200,83,0.18)",   text: "#5ee599", tags: ["green"] },
  { label: "Violet",    accent: "#8b5cf6", hover: "#6d3fde", dim: "rgba(139,92,246,0.18)", text: "#b794f6", tags: ["purple"] },
  { label: "Magenta",   accent: "#ec4899", hover: "#be2f78", dim: "rgba(236,72,153,0.18)", text: "#f472b6", tags: ["pink"] },
  { label: "Gold",      accent: "#facc15", hover: "#ca9c00", dim: "rgba(250,204,21,0.18)", text: "#fde047", tags: ["warm", "luxury"] },
  { label: "Crimson",   accent: "#dc2626", hover: "#a71d1d", dim: "rgba(220,38,38,0.18)",  text: "#f87171", tags: ["red"] },
  { label: "Mono",      accent: "#e0e0e0", hover: "#bdbdbd", dim: "rgba(224,224,224,0.14)",text: "#ffffff", tags: ["mono"] },
];

const accentOverlay = (a: AccentDef): SkinTokens => ({
  "--vlc-accent": a.accent,
  "--vlc-accent-hover": a.hover,
  "--vlc-accent-dim": a.dim,
  "--vlc-accent-text": a.text,
  "--vlc-seek-played": a.seek ?? a.accent,
});

let _catalog: ResolvedSkin[] | null = null;
let _byId: Record<string, ResolvedSkin> | null = null;

export const DEFAULT_SKIN_ID = "graphite-ios";

export const getSkinCatalog = async (): Promise<ResolvedSkin[]> => {
  if (_catalog) return _catalog;
  const { HEROES, HEROES_BY_ID } = await import("./heroes");

  const buildVariants = (): SkinVariant[] => {
    const out: SkinVariant[] = [];
    for (const hero of HEROES) {
      if (hero.tier === "premium") continue;
      for (const accent of ACCENTS) {
        out.push({
          id: `${hero.id}--${accent.label.toLowerCase()}`,
          name: `${hero.name} · ${accent.label}`,
          heroId: hero.id,
          overlay: accentOverlay(accent),
          tags: [...hero.tags, ...(accent.tags ?? []), "variant"],
        });
      }
    }
    return out;
  };

  const ALL_VARIANTS = buildVariants();

  const catalog: ResolvedSkin[] = HEROES.map((h) => ({
    id: h.id,
    name: h.name,
    heroId: h.id,
    tokens: h.tokens,
    extraCss: h.extraCss ?? "",
    tags: [...h.tags, "hero"],
    tier: h.tier ?? "free",
  }));

  catalog.push(
    ...ALL_VARIANTS.map((v) => {
      const hero = HEROES_BY_ID[v.heroId] as SkinHero;
      return {
        id: v.id,
        name: v.name,
        heroId: v.heroId,
        tokens: { ...hero.tokens, ...v.overlay },
        extraCss: hero.extraCss ?? "",
        tags: v.tags,
        tier: hero.tier ?? "free",
      };
    }),
  );

  _catalog = catalog;
  _byId = Object.fromEntries(catalog.map((s) => [s.id, s]));
  return _catalog;
};

export const resolveSkin = async (id: string): Promise<ResolvedSkin> => {
  if (!_byId) await getSkinCatalog();
  return _byId![id] ?? _byId![DEFAULT_SKIN_ID];
};

