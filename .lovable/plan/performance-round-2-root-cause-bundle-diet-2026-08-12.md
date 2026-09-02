# Performance Round 2 — Root-Cause Bundle Diet

## Where we are (measured last round)

- Entry app chunk: 505 KB raw / 134 KB gz  →  232 KB raw / 67.5 KB gz
- Total initial JS: ~245 KB gz  →  ~178 KB gz
- Remaining split: react-dom ~111 KB gz (framework floor) + ~67 KB gz app code

Fonts (62 families → 2), the 50-chunk prefetch storm, the eager skin catalog,
framer-motion in core chrome, and 46 dead shadcn files are already fixed.

## Honest read on the target

React 19 + TanStack Router is ~110-130 KB gz before a single line of app code.
A 200 KB *total build* is not reachable without leaving React. What is reachable:
**~110-120 KB gz initial JS** and a first paint well under 500 ms (near-instant on
warm service-worker loads). 30 ms cold launch is not physically possible over a
network; 30 ms *warm* paint is.

If you want a genuinely sub-200 KB total build, that is a rewrite off React
(Preact-compat swap is the only cheap variant) — called out as a separate option
below, not folded into this plan.

## Culprits still in the first-paint graph

1. **Unused dependencies still installed** — recharts, embla, react-day-picker,
   input-otp, vaul, react-hook-form, @hookform/resolvers, cmdk, date-fns,
   ~25 Radix packages, workbox-window. Most are already tree-shaken out of the
   bundle, but they inflate install/build time and risk accidental re-import.
2. **lucide-react across the eager chrome** — each icon is its own module, but
   TitleBar/ControlBar/MenuBar/DockRail together pull dozens into first paint.
3. **The store** (`playerStore.ts`) is one large module imported by everything,
   including persisted-settings and custom-CSS logic that only matters post-hydration.
4. **`src/features/registry.ts`** — 180 metadata entries + 180 `import()` stubs
   ship as one module the moment anything touches the dock or palette.
5. **Skin catalog** — split out of first paint, but the default-skin token path
   still parses more than the one skin it needs.
6. **No compression/caching headroom check** — `public/_headers` immutability and
   Brotli behaviour on the deployed asset paths has never been verified.

## Plan — incremental, approval between steps

**Step A — Prune dependencies (zero runtime risk).**
Remove the packages nothing imports. Verify with `rg` per package before removing.
Files: `package.json`. Testable: build succeeds, app renders.

**Step B — Icon diet in eager chrome.**
Replace lucide icons in TitleBar, ControlBar, DockRail, MenuBar with a tiny local
`src/components/icons.tsx` of inline SVG paths (same names, same props shape).
Lazy panels keep lucide. Files: 4 chrome components + 1 new icon module.

**Step C — Split the store's cold path.**
Move `hydratePersisted`, custom-CSS injection, and settings-backup helpers into a
lazily-imported module; the store keeps a thin call site. Files: `playerStore.ts`
plus one new `playerStore.persist.ts`.

**Step D — Split the feature registry metadata.**
Keep an id/title-only index for the dock and palette; load the loader map on first
launch. Files: `src/features/registry.ts`, its two consumers.

**Step E — Default-skin fast path.**
Inline the default skin's tokens as a literal so first paint never touches the
catalog; the catalog stays lazy for the gallery. Files: `src/skins/registry.ts`,
`SkinProvider.tsx`.

**Step F — Delivery headers.**
Verify `public/_headers` sets `immutable` on hashed assets and that HTML stays
revalidating. Preload the two fonts. Files: `public/_headers`, `__root.tsx`.

**Step G — Re-measure and report** a before/after chunk table.

## Optional, separate decision

**Preact-compat alias** would cut ~100 KB gz in one line of Vite config and is the
only path to a ~200 KB total build. Risk: React 19 features and some Radix
internals can misbehave. I would ship it behind its own PR with a full manual
pass, not inside this plan.

## Risks

- Step B changes icon glyphs slightly — visual check on the chrome.
- Step C could reintroduce a hydration flash if the persisted load lands late.
- Step D touches the dock and command palette — both need a launch test.
- Step A can break a build if an `rg` sweep misses a dynamic import.

## Manual testing after each step

Load `/`, confirm default skin and chrome render, open a panel, launch a mini-app
from the dock and the palette, switch to a premium skin, toggle ambient music,
reload offline.
