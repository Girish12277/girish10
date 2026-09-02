// Skin engine types. A "hero" is a complete visual identity (chrome, panels,
// OSD, menus, controls, icons, layout, typography, colors, radii). A "variant"
// applies a palette/accent/radius overlay on top of a hero to multiply the
// catalog without duplicating CSS.

export type SkinTokens = Record<string, string>;

export interface SkinHero {
  id: string;
  name: string;
  /** Short tagline shown under the name in the gallery. */
  tagline: string;
  /** CSS variable overrides applied as :root inline style. */
  tokens: SkinTokens;
  /** Optional supplementary CSS, scoped to `[data-skin="<id>"]`. */
  extraCss?: string;
  /** Tags used by the gallery search/filter. */
  tags: string[];
  /** Pricing tier. `premium` skins pin to the top of the gallery with a
   *  PRO badge and are excluded from accent-variant fan-out. Default `free`. */
  tier?: "free" | "premium";
}

export interface SkinVariant {
  id: string;
  /** Display name for the variant entry (e.g. "Apple · Graphite"). */
  name: string;
  heroId: string;
  /** Token overlay merged on top of the hero's tokens. */
  overlay: SkinTokens;
  tags: string[];
}

export interface ResolvedSkin {
  id: string;
  name: string;
  heroId: string;
  tokens: SkinTokens;
  extraCss: string;
  tags: string[];
  tier?: "free" | "premium";
}
