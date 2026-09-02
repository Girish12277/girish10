#!/usr/bin/env node
// Workbox Service Worker Generator for 100% Offline PWA Reliability.
// Emits a hardened sw.js precaching all static assets, JS chunks, CSS, HTML, and vendor files.
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
  globPatterns: [
    "**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json,webmanifest,txt}",
    "vendor/**/*.{html,css,js,png,jpg,svg}",
  ],
  globIgnores: ["sw.js", "workbox-*.js", "**/_worker.js/**"],
  maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
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
    // 1. App Shell HTML — NetworkFirst with 3s timeout, cached fallback offline
    {
      urlPattern: ({ request, sameOrigin }) => sameOrigin && request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "app-shell-v2",
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },

    // 2. Vendored Offline Tools (TCS iON Calculator, etc.) — CacheFirst
    {
      urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/vendor/"),
      handler: "CacheFirst",
      options: {
        cacheName: "vendor-tools-v1",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // 3. Static App Bundle Assets (JS, CSS) — CacheFirst with long maxAge
    {
      urlPattern: ({ request, sameOrigin }) =>
        sameOrigin && (request.destination === "script" || request.destination === "style"),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-assets-v2",
        expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 60 },
      },
    },

    // 4. Google Fonts CSS — StaleWhileRevalidate
    {
      urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
      handler: "StaleWhileRevalidate",
      options: { cacheName: "fonts-css-v2" },
    },

    // 5. Google Fonts Files — CacheFirst
    {
      urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com",
      handler: "CacheFirst",
      options: {
        cacheName: "fonts-files-v2",
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // 6. Static Images & Icons — CacheFirst
    {
      urlPattern: ({ request, url, sameOrigin }) =>
        sameOrigin && (request.destination === "image" || /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(url.pathname)),
      handler: "CacheFirst",
      options: {
        cacheName: "img-assets-v2",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 90 },
      },
    },
  ],
});

if (warnings.length) for (const w of warnings) console.warn(`[build-sw] ${w}`);
console.log(`[build-sw] precached ${count} files, ${(size / 1024 / 1024).toFixed(2)} MiB → dist/client/sw.js`);
