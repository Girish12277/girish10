#!/usr/bin/env node
// Workbox Service Worker Generator for 100% Offline PWA Reliability.
// Emits a hardened sw.js precaching all static assets, JS chunks, CSS, HTML, and vendor files.
import { generateSW } from "workbox-build";
import { existsSync, cpSync } from "node:fs";
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
    // 1. Vendored Offline Tools (TCS iON Calculator, etc.) — CacheFirst
    {
      urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/vendor/"),
      handler: "CacheFirst",
      options: {
        cacheName: "vendor-tools-v1",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // 2. Static App Bundle Assets (JS, CSS) — StaleWhileRevalidate
    {
      urlPattern: ({ request, sameOrigin }) =>
        sameOrigin && (request.destination === "script" || request.destination === "style"),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-assets-v2",
        expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 60 },
      },
    },

    // 3. Google Fonts CSS — StaleWhileRevalidate
    {
      urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
      handler: "StaleWhileRevalidate",
      options: { cacheName: "fonts-css-v2" },
    },

    // 4. Google Fonts Files — CacheFirst
    {
      urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com",
      handler: "CacheFirst",
      options: {
        cacheName: "fonts-files-v2",
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // 5. Static Images & Icons — CacheFirst
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

// ── Cloudflare Pages Advanced Mode Bundle Preparation ──
// Nitro outputs the SSR worker to `dist/_worker.js`. Copy it into `dist/client/_worker.js`
// so Cloudflare Pages handles SSR navigations to `/` without 404ing.
const workerSrc = resolve("dist/_worker.js");
const workerDest = resolve(outDir, "_worker.js");
if (existsSync(workerSrc)) {
  try {
    cpSync(workerSrc, workerDest, { recursive: true });
    console.log(`[build-sw] copied dist/_worker.js → dist/client/_worker.js for Cloudflare Pages SSR`);
  } catch (err) {
    console.warn(`[build-sw] failed to copy _worker.js`, err);
  }
}
