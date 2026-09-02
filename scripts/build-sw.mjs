#!/usr/bin/env node
// God-level offline: after vite build finishes, scan dist/client for every
// hashed asset and emit a precaching service worker via workbox-build.
// This is more reliable than vite-plugin-pwa under TanStack Start v1 + Vite 7
// because it runs as a plain postbuild step against the final client output.
import { generateSW } from "workbox-build";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve("dist/client");
if (!existsSync(outDir)) {
  console.warn(`[build-sw] dist/client not found at ${outDir} — skipping SW generation.`);
  process.exit(0);
}

const { count, size, warnings } = await generateSW({
  globDirectory: outDir,
  swDest: resolve(outDir, "sw.js"),
  globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json,webmanifest,txt}"],
  globIgnores: ["sw.js", "workbox-*.js", "**/_worker.js/**"],
  maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
  // Precache "/" so first-launch-offline still boots the app shell. SSR builds
  // don't emit a static index.html, so without this the SW has nothing to
  // serve for the navigation request and Chrome shows its default PWA
  // offline page (icon + "You're offline"). Revision is bumped per build.
  additionalManifestEntries: [{ url: "/", revision: `${Date.now()}` }],
  navigateFallback: "/",
  navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//, /^\/_/],
  navigationPreload: true,
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: false,
  sourcemap: false,
  mode: "production",
  runtimeCaching: [

    // App shell HTML — always try network first so updates land fast,
    // but fall back to cache for offline navigations.
    {
      urlPattern: ({ request, sameOrigin }) => sameOrigin && request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "app-shell-v1",
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
    {
      urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
      handler: "StaleWhileRevalidate",
      options: { cacheName: "fonts-css-v1" },
    },
    {
      urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com",
      handler: "CacheFirst",
      options: {
        cacheName: "fonts-files-v1",
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: ({ request, url, sameOrigin }) =>
        sameOrigin && (request.destination === "image" || /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(url.pathname)),
      handler: "CacheFirst",
      options: {
        cacheName: "img-v1",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    // Lazy feature/panel chunks — SWR so the next visit gets the new build
    // while the user runs the old cached one without waiting on the network.
    {
      urlPattern: ({ request, sameOrigin }) =>
        sameOrigin && (request.destination === "script" || request.destination === "style"),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-v1",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === "video" || request.destination === "audio",
      handler: "NetworkOnly",
    },
  ],
});

if (warnings.length) for (const w of warnings) console.warn(`[build-sw] ${w}`);
console.log(`[build-sw] precached ${count} files, ${(size / 1024 / 1024).toFixed(2)} MiB → dist/client/sw.js`);
