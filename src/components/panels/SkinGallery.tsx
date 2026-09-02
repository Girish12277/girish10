// Searchable skin gallery grouped by hero family. The "Original" (the hero
// itself) is rendered first inside each group, followed by its accent
// variants. content-visibility keeps off-screen tiles cheap.

import { useMemo, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { getSkinCatalog } from "@/skins/registry";
import { useQuery } from "@tanstack/react-query";
import type { ResolvedSkin } from "@/skins/types";
import { ChevronDown, ChevronRight } from "lucide-react";

const PREVIEW_STYLE_ID = "vlc-skin-preview";

const applyPreview = async (skin: ResolvedSkin | null): Promise<void> => {
  let tag = document.getElementById(PREVIEW_STYLE_ID) as HTMLStyleElement | null;
  if (!skin) {
    if (tag) tag.textContent = "";
    return;
  }
  if (!tag) {
    tag = document.createElement("style");
    tag.id = PREVIEW_STYLE_ID;
    document.head.appendChild(tag);
  }
  const vars = Object.entries(skin.tokens).map(([k, v]) => `  ${k}: ${v};`).join("\n");
  let css = "";
  try {
    const cssModule = await import(`../../skins/css/${skin.heroId}.css?inline`);
    css = cssModule.default;
  } catch (e) {}
  tag.textContent = `:root[data-vlc-skinned] {\n${vars}\n}\n${css}`;
};

interface Group {
  heroId: string;
  heroName: string;
  tagline: string;
  original: ResolvedSkin;
  variants: ResolvedSkin[];
}

export function SkinGallery() {
  const activeSkinId = usePlayerStore((s) => s.activeSkinId);
  const set = usePlayerStore((s) => s.set);
  const pushOSD = usePlayerStore((s) => s.pushOSD);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | "Dark" | "Light" | "Minimal" | "Premium" | "Colorful">("All");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const { data: SKIN_CATALOG = [] } = useQuery({
    queryKey: ["skinCatalog"],
    queryFn: getSkinCatalog,
    staleTime: Infinity,
  });

  const groups = useMemo<Group[]>(() => {
    if (!SKIN_CATALOG.length) return [];
    const q = query.trim().toLowerCase();
    const matchCat = (s: ResolvedSkin) => {
      if (category === "All") return true;
      if (category === "Premium") return s.tier === "premium";
      if (category === "Minimal") return s.tags.includes("minimal");
      if (category === "Colorful") return s.tags.includes("colorful");
      const bg = s.tokens["--vlc-bg-base"] || "#1a1a1a";
      const rgb = parseRgb(bg);
      if (!rgb) return true;
      const lum = luminance(rgb);
      if (category === "Dark") return lum < 0.25;
      if (category === "Light") return lum >= 0.25;
      return true;
    };

    const match = (s: ResolvedSkin) =>
      (!q ||
        s.name.toLowerCase().includes(q) ||
        s.id.includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))) &&
      matchCat(s);
    const byHero = new Map<string, ResolvedSkin[]>();
    for (const s of SKIN_CATALOG) {
      if (!byHero.has(s.heroId)) byHero.set(s.heroId, []);
      byHero.get(s.heroId)!.push(s);
    }
    const out: Group[] = [];
    const HEROES = SKIN_CATALOG.filter(s => s.tags.includes("hero"));
    for (const hero of HEROES) {
      const all = byHero.get(hero.id) ?? [];
      const original = all.find((s) => s.id === hero.id);
      if (!original) continue;
      const variants = all.filter((s) => s.id !== hero.id);
      const heroMatches = match(original) || (hero as any).name.toLowerCase().includes(q);
      const filteredVariants = q ? variants.filter(match) : variants;
      if (!q || heroMatches || filteredVariants.length > 0) {
        out.push({
          heroId: hero.id,
          heroName: hero.name,
          tagline: (hero as any).name,
          original,
          variants: filteredVariants,
        });
      }
    }
    return out;
  }, [query, category, SKIN_CATALOG]);

  const total = SKIN_CATALOG.length;
  const visible = groups.reduce((n, g) => n + 1 + g.variants.length, 0);

  const commit = (skin: ResolvedSkin) => {
    applyPreview(null);
    if (!document.startViewTransition) {
      set({ activeSkinId: skin.id });
      pushOSD(`Skin: ${skin.name}`);
      return;
    }
    document.startViewTransition(() => {
      set({ activeSkinId: skin.id });
      pushOSD(`Skin: ${skin.name}`);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-3">
        <h3 className="text-[12px]" style={{ color: "var(--vlc-text-secondary)" }}>
          {groups.length} hero families{" "}
          <span style={{ color: "var(--vlc-text-ghost)" }}>
            · {visible} of {total} styles
          </span>
        </h3>
        <input
          type="text"
          placeholder="Search styles, tags…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-[12px] px-2 py-1 rounded w-48"
          style={{
            background: "var(--vlc-bg-sunken)",
            color: "var(--vlc-text-primary)",
            border: "1px solid var(--vlc-border-normal)",
          }}
        />
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 vlc-scrollbar-hidden">
        {(["All", "Dark", "Light", "Minimal", "Premium", "Colorful"] as const).map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-3 py-1 rounded-full text-[11px] tracking-wide uppercase transition-colors shrink-0"
            style={{
              fontWeight: category === c ? 700 : 500,
              background: category === c ? "var(--vlc-accent)" : "var(--vlc-bg-sunken)",
              color: category === c ? "var(--vlc-bg-base)" : "var(--vlc-text-secondary)",
              border: `1px solid ${category === c ? "transparent" : "var(--vlc-border-normal)"}`
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        className="overflow-y-auto pr-1"
        style={{ maxHeight: 450 }}
        onMouseLeave={() => applyPreview(null)}
      >
        {groups.map((g) => {
          const isOpen = !collapsed[g.heroId];
          return (
            <div key={g.heroId} className="mb-4">
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [g.heroId]: isOpen }))}
                className="flex items-center w-full gap-2 mb-2 px-1 py-1 text-left"
                style={{ color: "var(--vlc-text-primary)" }}
              >
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="text-[12px] font-semibold uppercase tracking-wide">
                  {g.heroName}
                </span>
                <span className="text-[11px]" style={{ color: "var(--vlc-text-ghost)" }}>
                  · {g.variants.length} variants
                </span>
                <span className="ml-auto text-[11px] italic" style={{ color: "var(--vlc-text-ghost)" }}>
                  {g.tagline}
                </span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-3 gap-3">
                  <Card skin={g.original} active={g.original.id === activeSkinId} onCommit={commit} onPreview={applyPreview} badge="Original" />
                  {g.variants.map((v) => (
                    <Card key={v.id} skin={v} active={v.id === activeSkinId} onCommit={commit} onPreview={applyPreview} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Parse a color (hex/rgb/rgba) into [r,g,b] 0–255. Returns null for gradients.
function parseRgb(input: string): [number, number, number] | null {
  if (!input) return null;
  const s = input.trim();
  if (s.startsWith("#")) {
    const hex = s.slice(1);
    const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex.slice(0, 6);
    if (full.length !== 6) return null;
    const n = parseInt(full, 16);
    if (Number.isNaN(n)) return null;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = s.match(/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i);
  if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  return null;
}

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Pick a readable foreground (black or white) for the given background. For
// gradients we extract the first color token we can parse.
function readableOn(bg: string): string {
  let rgb = parseRgb(bg);
  if (!rgb) {
    const inner = bg.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/);
    if (inner) rgb = parseRgb(inner[0]);
  }
  if (!rgb) return "#ffffff";
  return luminance(rgb) > 0.55 ? "#0a0a0a" : "#ffffff";
}

function Card({
  skin,
  active,
  onCommit,
  onPreview,
  badge,
  premium,
}: {
  skin: ResolvedSkin;
  active: boolean;
  onCommit: (s: ResolvedSkin) => void;
  onPreview: (s: ResolvedSkin | null) => void;
  badge?: string;
  premium?: boolean;
}) {
  const t = skin.tokens;
  const bg = t["--vlc-bg-base"] ?? "#1a1a1a";
  const surface = t["--vlc-bg-surface"] ?? bg;
  const sunken = t["--vlc-bg-sunken"] ?? bg;
  const accent = t["--vlc-accent"] ?? "#ff5722";
  // Critical: derive text color from THIS skin's bg, not the active root, so
  // dark skins render readable previews even when the page is on a light skin
  // (and vice versa). This was the root cause of the invisible-text bug.
  const text = t["--vlc-text-primary"] ?? readableOn(bg);
  const radius = t["--vlc-radius-sm"] ?? "4px";
  
  const isPremium = skin.tier === "premium" || premium;
  const isNew = skin.id === "pw-glass-aurora" || skin.id === "pw-skeuo-chrome";
  // PRO / NEW badges are more important than the generic "ORIGINAL" badge for heroes
  const finalBadge = isNew ? "NEW" : isPremium ? "PRO" : badge;
  const badgeBg = isNew ? "#10b981" : isPremium ? "#FACC15" : accent;
  const badgeFg = isNew ? readableOn("#10b981") : isPremium ? "#1A1306" : readableOn(accent);
  return (
    <button
      onClick={() => onCommit(skin)}
      onMouseEnter={() => onPreview(skin)}
      onFocus={() => onPreview(skin)}
      className="text-left p-2 relative"
      title={`${skin.name} — ${skin.tags.join(", ")}`}
      style={{
        height: 96,
        background: bg,
        border: active
          ? "2px solid var(--vlc-accent)"
          : isPremium
            ? "1px solid #FACC15"
            : "1px solid rgba(127,127,127,0.35)",
        borderRadius: 6,
        contentVisibility: "auto",
        containIntrinsicSize: "96px 220px",
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: active
          ? "0 0 20px -2px var(--vlc-accent), 0 0 0 2px var(--vlc-accent)"
          : isPremium
            ? "0 0 0 1px rgba(250,204,21,0.18), 0 8px 20px -8px rgba(250,204,21,0.30)"
            : undefined,
        transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms ease",
      } as React.CSSProperties}
    >
      {finalBadge && (
        <span
          className="absolute top-1 right-1 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wide"
          style={{ background: badgeBg, color: badgeFg, fontWeight: 700, letterSpacing: "0.08em" }}
        >
          {finalBadge}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <div style={{ height: 7, background: sunken, borderRadius: radius }} />
        <div style={{ height: 30, background: surface, borderRadius: radius, position: "relative" }}>
          <div style={{ position: "absolute", left: 4, bottom: 4, height: 3, width: "55%", background: accent, borderRadius: 2 }} />
          <div style={{ position: "absolute", right: 4, top: 4, width: 10, height: 10, borderRadius: "50%", background: accent }} />
        </div>
        <div
          className="text-[11px] truncate"
          style={{
            color: text,
            fontWeight: active ? 600 : 400,
            textShadow: text === "#ffffff" ? "0 1px 2px rgba(0,0,0,0.6)" : "none",
          }}
        >
          {skin.name}
        </div>
      </div>
    </button>
  );
}
