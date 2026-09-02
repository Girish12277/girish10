# Speed & Bundle Diet — Fix the Root Cause

## What the app does today (verified)

- One route (`/`) renders `AppLayout`, which already lazy-loads every panel, dialog, feature host, study hub and music UI. That part is healthy.
- The eager (first-paint) path still pulls in: the whole skin catalog (`src/skins/*`, 279 KB of source across 6 hero files, expanded at module load into 100+ variants), `framer-motion`, `lucide-react` icons across 31 files, the store, the audio graph, plus always-mounted `StudyEngine` and `AmbientAudioEngine`.
- `src/routes/__root.tsx` links **one Google Fonts stylesheet requesting ~70 font families**, most with multiple weights. This is the single biggest launch-speed culprit: a render-blocking third-party stylesheet plus dozens of potential font downloads, none of which the default skin needs.
- `src/pwa/warmCache.ts` fires **50 lazy feature chunks** right after load — 50 extra requests competing with the UI on every visit.
- `src/features/registry.ts` holds 180 entries with inline `import()`. The chunks are separate, but the registry metadata and 180 import stubs ship in the main graph.
- 37 of the 47 `src/components/ui/*` files are never imported, so they are already tree-shaken (dead source, not bundle weight).

Unverified: exact current bundle bytes. No production build has been measured, so Step 0 is measurement before any cut.

## Honest read on the 200 KB / 30 ms target

React 19 + TanStack Start/Router alone is roughly 130–150 KB gzipped before app code. A 200 KB **gzipped initial JS** budget is realistic; 200 KB total build output is not. 30 ms cold launch is not achievable over a network; sub-1s first paint and near-instant warm (service-worker) launch is.

## Approach comparison

- **A. Micro-optimise imports only** — safe, but leaves the font and prefetch costs that dominate. Rejected as the main plan.
- **B. Kill the eager third-party and prefetch costs, then split the skin catalog** (recommended) — targets the dominant costs with small isolated changes, no restructuring.
- **C. Rewrite skins into on-demand JSON** — biggest theoretical win, large blast radius across `SkinProvider`, `SkinGallery`, and the contrast audit script. Deferred to a separate PR.

## Plan (incremental, approval between steps)

**Step 0 — Measure.** Production build, record per-chunk gzipped sizes as baseline. No code change.

**Step 1 — Fonts on demand (biggest win).** `__root.tsx`: keep only the 2–3 families the default skin uses in the blocking `<link>`. Load a skin's extra family at switch time via a small helper in `SkinProvider.tsx` that injects a per-family stylesheet once. Risk: brief fallback font on first activation of a skin, mitigated by `display=swap`.

**Step 2 — Stop the 50-chunk prefetch storm.** `warmCache.ts`: warm nothing on first load; warm a much smaller set only after the user opens the feature host, or on an explicit "make offline ready" action. Risk: first open of a mini-app costs one small fetch. App-shell offline support is unaffected.

**Step 3 — Split the skin catalog out of first paint.** Keep the default skin's tokens inline; move `HEROES` and variant expansion behind a dynamic import triggered on hydration idle or when the gallery opens. Persisted skin ids still resolve. Risk: gallery opens one tick later.

**Step 4 — Trim eager UI libs.** Drop `framer-motion` from the always-mounted path (`OSDDisplay`, `DockRail`) in favour of the CSS transition pattern already used in `AppLayout`; keep it in lazy panels. Swap first-paint chrome icons for inline SVG only if measurement shows lucide is material.

**Step 5 — Defer always-mounted engines.** Mount `StudyEngine` and `AmbientAudioEngine` after first interaction or when their state says they are active.

**Step 6 — Delete dead source.** Remove the 37 unused `src/components/ui/*` files and the deps they alone pull (recharts, embla, day-picker, input-otp, vaul, react-hook-form, cmdk). No runtime effect; cuts install and build time.

**Step 7 — Re-measure and report.** Before/after chunk table plus a preview performance check.

## Files touched (minimal, per step)

- Step 1: `src/routes/__root.tsx`, `src/skins/SkinProvider.tsx`
- Step 2: `src/pwa/warmCache.ts` and its call site in `__root.tsx`
- Step 3: `src/skins/registry.ts`, `src/skins/SkinProvider.tsx`
- Step 4: `src/components/video/OSDDisplay.tsx`, `src/components/layout/DockRail.tsx`
- Step 5: `src/components/layout/AppLayout.tsx`
- Step 6: `src/components/ui/*` deletions, `package.json`

## Risks and edge cases

- Font swap flash on skin change (Steps 1 and 3).
- Offline users lose pre-warmed mini-app chunks (Step 2); mitigated by an opt-in warm action.
- Motion removal must not regress OSD/dock feel (Step 4) — visual check required.
- `scripts/audit-contrast.mjs` imports the skin registry; Step 3 must keep a Node-importable entry point.

## Manual testing after each step

Load `/`, confirm the default skin renders, switch to a premium and a Wave-7 skin, open the feature host and launch a mini-app, toggle ambient music, then reload offline to confirm the PWA shell still boots.