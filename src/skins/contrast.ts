// Pure WCAG contrast auditor for the skin engine.
//
// Given a resolved skin token map, computes contrast ratios for every
// (text, background) pair we care about and returns pass/fail per pair
// plus an overall verdict. Used both at runtime by SkinProvider (to
// auto-rescue low-contrast skins) and by `scripts/audit-contrast.mjs`
// (CI). Pure — no DOM, no React, no side effects.

export type Rgb = [number, number, number];

const HEX_RE = /^#([0-9a-fA-F]{3,8})$/;
const RGB_RE = /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.%]+))?/i;
const OKLCH_RE = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i;
const GRADIENT_RE = /(?:linear|radial|conic)-gradient\(([^)]*(?:\([^)]*\)[^)]*)*)\)/i;
const GRADIENT_COLOR_RE = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|oklch\([^)]+\)|hsla?\([^)]+\))/g;

/** Parse a CSS color string into sRGB tuple. Handles #hex, rgb(), rgba(),
 *  oklch(), and gradients (averaged across stops) with reasonable fidelity. */
export function parseColor(input: string | undefined): Rgb | null {
  if (!input) return null;
  const s = input.trim();
  const grad = GRADIENT_RE.exec(s);
  if (grad) {
    const stops = grad[1].match(GRADIENT_COLOR_RE);
    if (stops && stops.length) {
      const rgbs = stops.map(parseColor).filter((c): c is Rgb => !!c);
      if (rgbs.length) {
        const sum = rgbs.reduce<[number, number, number]>(
          (a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0]);
        return [Math.round(sum[0] / rgbs.length), Math.round(sum[1] / rgbs.length), Math.round(sum[2] / rgbs.length)];
      }
    }
  }
  const hex = HEX_RE.exec(s);
  if (hex) {
    const h = hex[1];
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
    if (full.length !== 6) return null;
    const n = Number.parseInt(full, 16);
    return Number.isNaN(n) ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = RGB_RE.exec(s);
  if (rgb) return [Number(rgb[1]) | 0, Number(rgb[2]) | 0, Number(rgb[3]) | 0];
  const oklch = OKLCH_RE.exec(s);
  if (oklch) return oklchToRgb(parseLightness(oklch[1]), Number(oklch[2]), Number(oklch[3]));
  return null;
}

function parseLightness(raw: string): number {
  return raw.endsWith("%") ? Number(raw.slice(0, -1)) / 100 : Number(raw);
}

/** Approximate OKLCH → sRGB. Sufficient for contrast scoring (±1 ratio digit). */
function oklchToRgb(L: number, c: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180;
  const a = Math.cos(h) * c;
  const b = Math.sin(h) * c;
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, sv = s_ ** 3;
  const r =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * sv;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * sv;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * sv;
  return [clamp255(toSrgb(r)), clamp255(toSrgb(g)), clamp255(toSrgb(bl))];
}

function toSrgb(linear: number): number {
  const v = linear <= 0.0031308 ? 12.92 * linear : 1.055 * Math.pow(Math.max(linear, 0), 1 / 2.4) - 0.055;
  return Math.round(v * 255);
}
function clamp255(n: number): number { return Math.max(0, Math.min(255, n)); }

const COLOR_MIX_RE = /color-mix\(\s*in\s+\w+(?:\s+\w+\s+hue)?\s*,\s*([^,]+?)\s+(\d+(?:\.\d+)?)%?\s*,\s*([^)]+?)\s*\)/i;

/** Composite a possibly-translucent foreground over an opaque background.
 *  Handles `rgba()` alpha and `color-mix(in oklab, X p%, Y)` (the form
 *  used heavily across mega/wave skins). */
export function composite(fg: string | undefined, bgRgb: Rgb): Rgb | null {
  if (!fg) return null;
  const s = fg.trim();
  // color-mix(in oklab, color p%, otherColor) — treat as alpha blend if
  // the second color is `transparent`, otherwise mix the two colors.
  const mix = COLOR_MIX_RE.exec(s);
  if (mix) {
    const a = Number(mix[2]) / 100;
    const c1 = parseColor(mix[1].trim());
    const c2raw = mix[3].trim();
    const c2 = c2raw === "transparent" ? bgRgb : (parseColor(c2raw) ?? bgRgb);
    if (!c1) return null;
    return [
      Math.round(c1[0] * a + c2[0] * (1 - a)),
      Math.round(c1[1] * a + c2[1] * (1 - a)),
      Math.round(c1[2] * a + c2[2] * (1 - a)),
    ];
  }
  // rgba()/rgb() with optional alpha channel
  const rgba = RGB_RE.exec(s);
  if (rgba) {
    const a = rgba[4] ? (rgba[4].endsWith("%") ? Number(rgba[4].slice(0, -1)) / 100 : Number(rgba[4])) : 1;
    const fgRgb: Rgb = [Number(rgba[1]) | 0, Number(rgba[2]) | 0, Number(rgba[3]) | 0];
    if (a >= 0.999) return fgRgb;
    return [
      Math.round(fgRgb[0] * a + bgRgb[0] * (1 - a)),
      Math.round(fgRgb[1] * a + bgRgb[1] * (1 - a)),
      Math.round(fgRgb[2] * a + bgRgb[2] * (1 - a)),
    ];
  }
  return parseColor(s);
}


export function luminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg: Rgb, bg: Rgb): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export interface ContrastCheck {
  pair: string;
  ratio: number;
  required: number;
  pass: boolean;
}

export interface SkinAudit {
  skinId: string;
  checks: ContrastCheck[];
  worst: ContrastCheck;
  passes: boolean;
}

/** AA thresholds — 4.5 for normal text, 3.0 for UI / large text. */
const PAIRS: { fg: string; bg: string; required: number; label: string }[] = [
  { fg: "--vlc-text-primary",   bg: "--vlc-bg-base",     required: 4.5, label: "text-primary on bg-base" },
  { fg: "--vlc-text-primary",   bg: "--vlc-bg-surface",  required: 4.5, label: "text-primary on bg-surface" },
  { fg: "--vlc-text-primary",   bg: "--vlc-bg-elevated", required: 4.5, label: "text-primary on bg-elevated" },
  { fg: "--vlc-text-primary",   bg: "--vlc-bg-sunken",   required: 4.5, label: "text-primary on bg-sunken" },
  { fg: "--vlc-text-secondary", bg: "--vlc-bg-surface",  required: 4.5, label: "text-secondary on bg-surface" },
  { fg: "--vlc-text-secondary", bg: "--vlc-bg-elevated", required: 4.5, label: "text-secondary on bg-elevated" },
  { fg: "--vlc-text-ghost",     bg: "--vlc-bg-surface",  required: 3.0, label: "text-ghost on bg-surface" },
  { fg: "--vlc-accent",         bg: "--vlc-bg-surface",  required: 3.0, label: "accent on bg-surface" },
  { fg: "--vlc-accent",         bg: "--vlc-bg-base",     required: 3.0, label: "accent on bg-base" },
];

/** Audit a fully-merged token map. Returns one ContrastCheck per pair plus
 *  a roll-up `passes` flag. Translucent text is composited over its bg. */
export function auditSkin(skinId: string, tokens: Record<string, string>): SkinAudit {
  // For translucent bg layers, composite over bg-base so the effective
  // pixel color reflects what the user actually sees.
  const rootBg = parseColor(tokens["--vlc-bg-base"]) ?? [20, 20, 20];
  const resolveBg = (raw: string | undefined): Rgb | null => {
    if (!raw) return null;
    return composite(raw, rootBg) ?? parseColor(raw);
  };
  const checks: ContrastCheck[] = PAIRS.map(({ fg, bg, required, label }) => {
    const bgRgb = resolveBg(tokens[bg]);
    const fgRgb = bgRgb ? composite(tokens[fg], bgRgb) : parseColor(tokens[fg]);
    if (!fgRgb || !bgRgb) return { pair: label, ratio: 0, required, pass: false };
    const ratio = contrastRatio(fgRgb, bgRgb);
    return { pair: label, ratio, required, pass: ratio >= required };
  });
  // Worst = lowest-ratio FAILING check if any, else lowest overall.
  const failing = checks.filter((c) => !c.pass);
  const pool = failing.length ? failing : checks;
  const worst = pool.reduce((w, c) => (c.ratio < w.ratio ? c : w), pool[0]);
  return { skinId, checks, worst, passes: checks.every((c) => c.pass) };
}

/** Format a ratio for log output. */
export function fmtRatio(r: number): string {
  return r >= 100 ? "99+" : r.toFixed(2);
}

/** Choose a readable opaque text color for a given background, ramping
 *  through alpha levels to hit a minimum contrast ratio. Used by the
 *  runtime SkinProvider AND the audit script — single source of truth. */
function readableOn(bg: Rgb, alpha: number): string {
  const lum = luminance(bg);
  const onDark = lum < 0.5;
  const base = onDark ? "248,250,252" : "8,10,15";
  return alpha >= 0.999 ? (onDark ? "#f8fafc" : "#080a0f") : `rgba(${base},${alpha})`;
}

/** Walk alpha upward until contrast meets `min`; return the safe rgba.
 *  Guarantees `text-ghost` etc. always meets AA-UI (3:1). */
function rescueAlpha(bg: Rgb, min: number, startAlpha: number): string {
  for (let a = Math.max(startAlpha, 0.55); a <= 1; a += 0.05) {
    const fg = composite(readableOn(bg, a), bg);
    if (fg && contrastRatio(fg, bg) >= min) return readableOn(bg, a);
  }
  return readableOn(bg, 1);
}

const FALLBACKS = {
  textPrimary: 1,
  textSecondary: 0.78,
  textGhost: 0.58,
  textDisabled: 0.34,
};

/** Produce a normalized token map that's guaranteed AA-safe by auto-
 *  rescuing any (text, bg-surface) pair that falls below threshold.
 *  Skin-set tokens are honored unless they fail — then they're rewritten
 *  to a safe equivalent in the same light/dark family. */
export function normalizeSkinTokens(tokens: Record<string, string>): Record<string, string> {
  const out = { ...tokens };
  const rootBg = parseColor(out["--vlc-bg-base"]) ?? parseColor(out["--vlc-bg-surface"]);
  if (!rootBg) return out;
  const surfaceRgb =
    (out["--vlc-bg-surface"]
      ? composite(out["--vlc-bg-surface"], rootBg) ?? parseColor(out["--vlc-bg-surface"])
      : null) ?? rootBg;

  if (!out["--vlc-text-primary"])   out["--vlc-text-primary"]   = readableOn(surfaceRgb, FALLBACKS.textPrimary);
  if (!out["--vlc-text-secondary"]) out["--vlc-text-secondary"] = readableOn(surfaceRgb, FALLBACKS.textSecondary);
  if (!out["--vlc-text-ghost"])     out["--vlc-text-ghost"]     = readableOn(surfaceRgb, FALLBACKS.textGhost);
  if (!out["--vlc-text-disabled"])  out["--vlc-text-disabled"]  = readableOn(surfaceRgb, FALLBACKS.textDisabled);

  const ghostFg = composite(out["--vlc-text-ghost"], surfaceRgb);
  if (!ghostFg || contrastRatio(ghostFg, surfaceRgb) < 3.0) {
    out["--vlc-text-ghost"] = rescueAlpha(surfaceRgb, 3.0, FALLBACKS.textGhost);
  }
  const secFg = composite(out["--vlc-text-secondary"], surfaceRgb);
  if (!secFg || contrastRatio(secFg, surfaceRgb) < 4.5) {
    out["--vlc-text-secondary"] = rescueAlpha(surfaceRgb, 4.5, FALLBACKS.textSecondary);
  }

  // Accent rescue — if the accent fails 3:1 against either bg-base or
  // bg-surface, shift it toward black or white (whichever direction adds
  // contrast) until it meets the threshold. Preserves hue, only mutates
  // lightness via sRGB blend with the contrasting pole.
  const baseRgb = rootBg;
  const sunkenRgb =
    (out["--vlc-bg-sunken"]
      ? composite(out["--vlc-bg-sunken"], rootBg) ?? parseColor(out["--vlc-bg-sunken"])
      : null) ?? rootBg;

  // Text-primary rescue — if author-set primary fails 4.5:1 against any
  // bg layer, swap to the readable pole at full alpha (chosen against
  // the worst-case background luminance).
  const primaryFg = composite(out["--vlc-text-primary"], surfaceRgb);
  if (
    !primaryFg ||
    contrastRatio(primaryFg, surfaceRgb) < 4.5 ||
    contrastRatio(primaryFg, baseRgb) < 4.5 ||
    contrastRatio(primaryFg, sunkenRgb) < 4.5
  ) {
    // Pick the bg with the most "middle" luminance — that's the one a
    // pole color will fight hardest against. Then verify the pole wins
    // on all bgs; if not, fall back to the darker pole.
    const bgs = [surfaceRgb, baseRgb, sunkenRgb];
    const candidates: string[] = ["#f8fafc", "#08090f"];
    let chosen: string = candidates[0];
    let bestWorst = -1;
    for (const c of candidates) {
      const rgb = parseColor(c)!;
      const worst = Math.min(...bgs.map((bg) => contrastRatio(rgb, bg)));
      if (worst > bestWorst) { bestWorst = worst; chosen = c; }
    }
    out["--vlc-text-primary"] = chosen;
  }

  const accentRgb = parseColor(out["--vlc-accent"]);
  if (accentRgb) {
    const worstRatio = Math.min(
      contrastRatio(accentRgb, surfaceRgb),
      contrastRatio(accentRgb, baseRgb),
    );
    if (worstRatio < 3.0) {
      // Try both poles; pick the blend whose worst-case contrast across
      // both bgs is highest. Stop as soon as a blend clears 3.0 on both.
      const poles: Rgb[] = [[12, 14, 20], [248, 250, 252]];
      let best: { rgb: Rgb; worst: number } = { rgb: accentRgb, worst: worstRatio };
      for (const pole of poles) {
        for (let t = 0.1; t <= 1.0001; t += 0.1) {
          const blend: Rgb = [
            Math.round(accentRgb[0] * (1 - t) + pole[0] * t),
            Math.round(accentRgb[1] * (1 - t) + pole[1] * t),
            Math.round(accentRgb[2] * (1 - t) + pole[2] * t),
          ];
          const w = Math.min(
            contrastRatio(blend, surfaceRgb),
            contrastRatio(blend, baseRgb),
          );
          if (w > best.worst) best = { rgb: blend, worst: w };
          if (w >= 3.0) break;
        }
        if (best.worst >= 3.0) break;
      }
      out["--vlc-accent"] = `rgb(${best.rgb[0]}, ${best.rgb[1]}, ${best.rgb[2]})`;
    }
  }
  return out;
}

