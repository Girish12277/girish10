# Deploying to Cloudflare Pages (with full PWA support)

The app is an SSR TanStack Start build. Nitro is pinned to the
`cloudflare-pages` preset so the whole deployment — SSR worker *and* static
assets — lands in a single directory: `dist/client`.

That directory is what makes the PWA work: `sw.js`, `manifest.webmanifest`,
`icons/` and `screenshots/` must all be served from the **site root**. If the
Pages output directory points anywhere else (e.g. `dist`), those files resolve
to 404, service-worker registration fails silently, and install / offline /
file handlers all disappear.

## Cloudflare Pages project settings

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist/client` |
| Compatibility flags | `nodejs_compat` |
| Compatibility date | `2025-09-24` or later |

`npm run build` is `vite build && node scripts/build-sw.mjs`. The second half
generates the Workbox service worker into `dist/client/sw.js` — do **not**
shorten the build command to `vite build`, or there will be no service worker.

`wrangler.jsonc` declares `pages_build_output_dir`, so a Pages project created
from this repo picks the directory up automatically.

## Verifying a deploy

1. `https://<site>/manifest.webmanifest` → 200, JSON.
2. `https://<site>/sw.js` → 200, JavaScript.
3. DevTools → Application → Service Workers → shows an activated worker.
4. DevTools → Application → Manifest → no icon/start_url errors, install prompt available.

`public/_routes.json` keeps those paths off the SSR worker, and
`public/_headers` stops `sw.js` and the manifest from being cached so updates
land immediately.

## Note on the two build environments

`vite.config.ts` sets `nitro: { preset: "cloudflare-pages", output: { publicDir: "dist/client" } }`.
That preset applies when the repo is built outside Lovable (GitHub → Cloudflare
Pages) and writes the SSR worker to `dist/client/_worker.js`.

Lovable's own hosted build overrides the preset with `cloudflare-module`
(`dist/server` + `dist/client`) — that path is untouched, so preview and the
`.lovable.app` deployment keep working exactly as before.
