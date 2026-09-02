# Fix: Background Music stops on close + PWA lost on Cloudflare Pages

Two unrelated root causes. Both fixed with small, contained changes.

## 1. How the current code works

**Background music.** `src/components/music/AmbientMusic.tsx` owns everything: the `<audio>` element, the track list, index, volume, play state. It is lazy-mounted inside the panel stack in `AppLayout.tsx` and starts with `if (!open) return null;`. `open` comes from `playerStore.ambientOpen`, toggled by the TitleBar chip and two MenuBar entries.

**Root cause:** closing the panel sets `ambientOpen: false`, the component returns `null`, React unmounts it, and the `<audio>` node is destroyed along with the playlist and object URLs. There is no way for audio to survive a close because the player *is* the panel. This is a lifetime bug, not a playback bug.

**PWA.** `public/manifest.webmanifest` + head tags in `__root.tsx` + `src/pwa/registerSW.ts` (registers `/sw.js` in PROD, refuses in preview/iframe) + `scripts/build-sw.mjs` (Workbox `generateSW`, runs as a postbuild step, writes `dist/client/sw.js`). The build script is `vite build && node scripts/build-sw.mjs`. The Vite config uses the Lovable TanStack preset, which builds SSR through Nitro with preset `cloudflare-module`: worker output in `dist/server`, static assets in `dist/client`.

**Root cause:** that output shape is a Cloudflare **Workers** deployment. A Cloudflare **Pages** project built from GitHub does not know about it. With Pages' defaults the build output directory ends up as `dist` (or the run command skips the postbuild step), so `/sw.js`, `/manifest.webmanifest` and `/icons/*` are not at the site root. Registration then fails silently and every PWA capability — install, offline, file handlers, shortcuts — disappears. Nothing is wrong with the manifest or the SW itself; only where they are served from.

## 2. Files to change

**Music (step 1)**
- `src/store/playerStore.ts` — add a small `ambient` slice: `tracks`, `index`, `playing`, `volume`, `loop`. State only, no DOM. Reuses the existing store instead of adding a new one. Not persisted (object URLs are per-session).
- `src/components/music/AmbientMusic.tsx` — split into two exports in the same file: `AmbientAudioEngine` (headless, always mounted, owns the single `<audio data-vlc-ambient>` and reacts to store state) and `AmbientMusic` (panel UI, still returns `null` when closed).
- `src/components/layout/AppLayout.tsx` — mount `AmbientAudioEngine` once outside the panel `Suspense`, next to `StudyEngine` (same pattern already used for Study).

Result: closing the popup hides UI only; audio keeps playing. `getMedia()` in `features/_shared/media.tsx` already excludes `[data-vlc-ambient]`, so mini-apps are unaffected.

**Music UI (step 2)**
- `src/components/music/AmbientMusic.tsx` only — rework the panel: proper now-playing header, larger transport row, shuffle + repeat-one/all, per-track duration, clear active row, better empty state, keyboard-accessible controls, and a small "playing" indicator on the TitleBar chip. No new dependencies; existing tokens and `FloatingPanel` reused.

**PWA on Cloudflare Pages (step 3)**
- `vite.config.ts` — set the Nitro preset explicitly to `cloudflare-pages` so the build emits `dist/client/_worker.js` alongside the static assets. That single directory is then a complete, self-contained Pages deployment with `sw.js`, `manifest.webmanifest` and `icons/` at the root.
- `wrangler.jsonc` — add `pages_build_output_dir: "dist/client"` so Pages picks the directory up from the repo instead of dashboard settings.
- `public/_routes.json` (new) — exclude `/sw.js`, `/manifest.webmanifest`, `/icons/*`, `/screenshots/*`, `/vendor/*` and hashed assets from the worker so they are served as plain static files.
- `public/_headers` (new) — `Service-Worker-Allowed: /` plus `Cache-Control: no-cache` for `/sw.js` and the manifest, so updates land instead of sticking.
- Short `docs/deploy-cloudflare.md` — build command `npm run build`, output directory `dist/client`, `nodejs_compat` flag on.

Risk: changing the Nitro preset also affects the Lovable-hosted build. Mitigation is to verify the preview and published Lovable URL still serve 200 and still register the SW before moving on. If it regresses there, fall back to keeping `cloudflare-module` and documenting the Pages dashboard settings instead — strictly worse for reproducibility, which is why the preset change is the recommendation.

## 3. Assumptions, risks, edge cases

- Assumes the GitHub repo is deployed as a Cloudflare **Pages** project (as stated), not Workers. If it is actually Workers, step 3 becomes a `wrangler deploy` config instead — I will confirm before touching the preset.
- Object URLs: the engine owns them and revokes only on real removal, so surviving a panel close cannot leak or break them.
- Autoplay policy: audio still only starts from a user gesture.
- Existing installed service workers on the Lovable domain keep working; `cleanupOutdatedCaches` handles rollover.
- `/vendor/scicalc` offline behaviour is unchanged — it stays inside the Workbox precache glob.

## 4. Approach comparison (music)

| Option | Verdict |
| --- | --- |
| Keep `<audio>` in the panel, hide with CSS instead of unmounting | Smallest diff, but the panel lives inside a lazy Suspense tree and state still dies on any remount; fragile |
| Module-level singleton audio object outside React | Survives, but bypasses the store and is hard to keep the UI in sync with |
| **Headless engine + store slice (recommended)** | Matches the existing `StudyEngine` / `playerStore` pattern already in this codebase, testable, no new deps |

## 5. Steps (each stops for approval)

1. Store slice + headless engine + AppLayout mount — fixes "music stops when dismissed".
2. Panel UI rework — fixes the "third class" UI.
3. Cloudflare Pages PWA output fix, then verify the Lovable build still registers the SW.