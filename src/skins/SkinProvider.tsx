// SkinProvider applies the active skin AND the God Mode overrides.
// Both go through managed <style> tags — one DOM write per change,
// zero React re-render of the video element.

import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { ensureSkinFonts } from "./fontLoader";

// The skin catalog (100+ variants across 6 hero files) is the single largest
// module in the app graph. It is only needed once the client is interactive,
// so it loads as its own chunk instead of blocking first paint.
const DEFAULT_SKIN_ID = "graphite-ios";

const STYLE_TAG_ID = "vlc-skin-vars";
const GOD_TAG_ID = "vlc-godmode";

const BASE_TOKENS: Record<string, string> = {
  "--vlc-bg-base": "#1E1E1E",
  "--vlc-bg-surface": "#2A2A2A",
  "--vlc-bg-elevated": "#333333",
  "--vlc-bg-sunken": "#161616",
  "--vlc-border-subtle": "rgba(255,255,255,0.06)",
  "--vlc-border-normal": "rgba(255,255,255,0.12)",
  "--vlc-border-strong": "rgba(255,255,255,0.22)",
  "--vlc-accent": "#FF8800",
  "--vlc-accent-hover": "#E67A00",
  "--vlc-accent-dim": "rgba(255,136,0,0.15)",
  "--vlc-accent-text": "#FFA033",
  "--vlc-seek-played": "var(--vlc-accent)",
  "--vlc-seek-buffered": "rgba(255,255,255,0.28)",
  "--vlc-seek-track": "rgba(255,255,255,0.12)",
  "--vlc-seek-thumb": "#FFFFFF",
  "--vlc-text-primary": "#F0F0F0",
  // Bumped from rgba 0.65/0.35/0.20 to 0.78/0.58/0.34 — guarantees ≥3.0
  // contrast against bg-surface across every dark hero, and ≥4.5 for
  // secondary against bg-elevated. Audited via scripts/audit-contrast.mjs.
  "--vlc-text-secondary": "rgba(240,240,240,0.78)",
  "--vlc-text-ghost": "rgba(240,240,240,0.58)",
  "--vlc-text-disabled": "rgba(240,240,240,0.34)",

  "--vlc-control-bg": "transparent",
  "--vlc-control-hover": "rgba(255,255,255,0.08)",
  "--vlc-control-active": "rgba(255,255,255,0.14)",
  "--vlc-control-radius": "6px",
  "--vlc-font-ui": '"Inter", system-ui, -apple-system, sans-serif',
  "--vlc-font-mono": '"JetBrains Mono", ui-monospace, monospace',
  "--vlc-radius-sm": "4px",
  "--vlc-radius-md": "8px",
  "--vlc-radius-lg": "12px",
};

const parseRgb = (input: string | undefined): [number, number, number] | null => {
  if (!input) return null;
  const s = input.trim();
  const token = s.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/)?.[0] ?? s;
  if (token.startsWith("#")) {
    const hex = token.slice(1);
    const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex.slice(0, 6);
    if (full.length !== 6) return null;
    const n = Number.parseInt(full, 16);
    return Number.isNaN(n) ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = token.match(/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i);
  return m ? [Number.parseInt(m[1]), Number.parseInt(m[2]), Number.parseInt(m[3])] : null;
};

const luminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const readableOn = (bg: string | undefined, alpha = 1): string => {
  const rgb = parseRgb(bg);
  if (!rgb) return alpha === 1 ? "#ffffff" : `rgba(255,255,255,${alpha})`;
  const light = luminance(rgb) > 0.5;
  return alpha === 1
    ? light ? "#080a0f" : "#f8fafc"
    : light ? `rgba(8,10,15,${alpha})` : `rgba(248,250,252,${alpha})`;
};

import { normalizeSkinTokens } from "./contrast";

const normalizeTokens = (tokens: Record<string, string>): Record<string, string> => {
  // Merge BASE → skin tokens, then auto-rescue any (text, bg-surface) pair
  // that fails WCAG AA. Single source of truth — same function audits in CI.
  return normalizeSkinTokens({ ...BASE_TOKENS, ...tokens });
};

const buildCss = (tokens: Record<string, string>, extra: string): string => {
  const vars = Object.entries(normalizeTokens(tokens))
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root[data-vlc-skinned] {\n${vars}\n}\n${extra}`;
};


const ensureTag = (id: string): HTMLStyleElement => {
  let tag = document.getElementById(id) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement("style");
    tag.id = id;
    document.head.appendChild(tag);
  }
  return tag;
};

export function SkinProvider({ children }: { children: React.ReactNode }) {
  const activeSkinId = usePlayerStore((s) => s.activeSkinId);
  const godPicks = usePlayerStore((s) => s.godPicks);
  const godCustom = usePlayerStore((s) => s.godCustom);

  useEffect(() => {
    let cancelled = false;
    const id = activeSkinId || DEFAULT_SKIN_ID;
    // Fast path: paint the base token set synchronously so the very first
    // frame is themed, then refine once the (lazy) catalog chunk lands.
    const root0 = document.documentElement;
    if (!root0.hasAttribute("data-vlc-skinned")) {
      root0.setAttribute("data-vlc-skinned", "");
      ensureTag(STYLE_TAG_ID).textContent = buildCss({}, "");
    }
    import("./registry").then(async ({ resolveSkin }) => {
      if (cancelled) return;
      const skin = await resolveSkin(id);
      if (cancelled) return;
      let css = "";
      try {
        const cssModule = await import(`./css/${skin.heroId}.css?inline`);
        css = cssModule.default;
      } catch (e) {
        // Fallback or ignore if CSS file doesn't exist
      }
      if (cancelled) return;
      const root = document.documentElement;
      root.setAttribute("data-vlc-skinned", "");
      root.setAttribute("data-skin", skin.heroId);
      root.setAttribute("data-skin-id", skin.id);
      ensureSkinFonts(skin.tokens, css);
      ensureTag(STYLE_TAG_ID).textContent = buildCss(skin.tokens, css);
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [activeSkinId]);

  useEffect(() => {
    const root = document.documentElement;
    const hasPicks = Object.values(godPicks ?? {}).some((v) => v && v !== "default");
    const hasCustom = Object.keys(godCustom ?? {}).length > 0;
    if (!hasPicks && !hasCustom) {
      // Nothing customised — never pull the 460-line God Mode module into the
      // first-paint graph. Just clear whatever a previous pick left behind.
      const tag = document.getElementById(GOD_TAG_ID);
      if (tag) tag.textContent = "";
      return;
    }
    let cancelled = false;
    import("./godMode").then(({ GOD_CATEGORIES, buildGodModeCss }) => {
      if (cancelled) return;
      for (const cat of GOD_CATEGORIES) {
        const v = godPicks[cat.id] ?? "default";
        if (v && v !== "default") root.setAttribute(`data-god-${cat.id}`, v);
        else root.removeAttribute(`data-god-${cat.id}`);
      }
      ensureTag(GOD_TAG_ID).textContent = buildGodModeCss(godPicks, godCustom);
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [godPicks, godCustom]);

  return <>{children}</>;
}
