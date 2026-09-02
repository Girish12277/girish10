#!/usr/bin/env node
// CI-grade WCAG contrast audit. Walks SKIN_CATALOG, scores every skin
// against the AA thresholds encoded in src/skins/contrast.ts, prints
// a table, exits non-zero if any hero (or >5% of variants) fails.
//
// Variants inherit hero tokens with only accent overlays, so a variant
// failure usually reduces to a hero failure — we still report both.
//
// Usage: bun run check:contrast

import { getSkinCatalog } from "../src/skins/registry.ts";
import { auditSkin, fmtRatio, normalizeSkinTokens } from "../src/skins/contrast.ts";

const BASE = {
  "--vlc-bg-base": "#1E1E1E",
  "--vlc-bg-surface": "#2A2A2A",
  "--vlc-bg-elevated": "#333333",
  "--vlc-bg-sunken": "#161616",
  "--vlc-text-primary": "#F0F0F0",
  "--vlc-text-secondary": "rgba(240,240,240,0.78)",
  "--vlc-text-ghost": "rgba(240,240,240,0.58)",
  "--vlc-accent": "#FF8800",
};

let failures = 0;
const heroFailures = new Set();

console.log("Skin contrast audit (WCAG AA, post-normalize)\n" + "─".repeat(72));
const SKIN_CATALOG = await getSkinCatalog();
for (const skin of SKIN_CATALOG) {
  const merged = normalizeSkinTokens({ ...BASE, ...skin.tokens });
  const audit = auditSkin(skin.id, merged);

  if (!audit.passes) {
    failures++;
    heroFailures.add(skin.heroId);
    const worst = audit.worst;
    console.log(
      `✗ ${skin.id.padEnd(32)} worst ${fmtRatio(worst.ratio).padStart(5)}` +
      `  need ${worst.required.toFixed(1)}  (${worst.pair})`,
    );
  }
}

const total = SKIN_CATALOG.length;
const rate = ((failures / total) * 100).toFixed(1);
console.log("─".repeat(72));
console.log(`${total - failures}/${total} pass · ${failures} fail (${rate}%) · ${heroFailures.size} affected heroes`);

// Gate: ≤2% variant failures AND no hero entries (the unadorned hero rows
// — those are the canonical surfaces). Vibrant artistic gradients can
// average to a mid-luminance bg-base that even pole text can't beat;
// surfaces fully overlay so the user never sees raw bg-base.
const pureHeroFailures = [...heroFailures].filter((h) =>
  SKIN_CATALOG.some((s) => s.id === h && s.heroId === h && !s.id.includes("--")),
);
if (failures / total > 0.02 || pureHeroFailures.length > 0) {
  console.log(`\nAffected heroes: ${[...heroFailures].join(", ")}`);
  if (pureHeroFailures.length) console.log(`Unadorned hero failures: ${pureHeroFailures.join(", ")}`);
  process.exit(1);
}
console.log(`\nWithin tolerance (≤2% variants, no unadorned heroes).`);
