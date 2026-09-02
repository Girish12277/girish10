#!/usr/bin/env node
// Workbox Service Worker & Static App Shell Generator for 100% Offline PWA Reliability.
import { generateSW } from "workbox-build";
import { existsSync, cpSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const outDir = resolve("dist/client");
if (!existsSync(outDir)) {
  console.warn(`[build-sw] dist/client not found at ${outDir} — skipping SW generation.`);
  process.exit(0);
}

// ── 1. Generate Physical `dist/client/index.html` Offline App Shell ──
const assetsDir = join(outDir, "assets");
let cssLinks = "";
let jsScripts = "";

if (existsSync(assetsDir)) {
  const assetFiles = readdirSync(assetsDir);
  const cssFile = assetFiles.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
  if (cssFile) {
    cssLinks += `<link rel="stylesheet" href="/assets/${cssFile}">`;
  }
  const mainJsFiles = assetFiles.filter((f) => f.startsWith("index-") && f.endsWith(".js"));
  const vendorJsFiles = assetFiles.filter((f) => f.startsWith("vendor-") && f.endsWith(".js"));
  const featureRegFile = assetFiles.find((f) => f.startsWith("feature-registry-") && f.endsWith(".js"));

  for (const js of [...vendorJsFiles, ...mainJsFiles]) {
    jsScripts += `<script type="module" src="/assets/${js}"></script>`;
  }
  if (featureRegFile) {
    jsScripts += `<script type="module" src="/assets/${featureRegFile}"></script>`;
  }
}

const htmlShellContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VLC Web Player</title>
  <meta name="description" content="VLC-inspired browser video player with EQ, themes, and full keyboard control.">
  <meta name="theme-color" content="#1E1E1E">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="VLC Web">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
  ${cssLinks}
</head>
<body style="margin:0;background:#000;color:#fff;">
  <div id="root"></div>
  ${jsScripts}
</body>
</html>`;

const indexHtmlPath = resolve(outDir, "index.html");
writeFileSync(indexHtmlPath, htmlShellContent, "utf-8");
console.log(`[build-sw] generated physical offline app shell → dist/client/index.html`);

// ── 2. Workbox Service Worker Generation ──
const { count, size, warnings } = await generateSW({
  globDirectory: outDir,
  swDest: resolve(outDir, "sw.js"),
  globPatterns: [
    "**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json,webmanifest,txt}",
    "vendor/**/*.{html,css,js,png,jpg,svg}",
  ],
  globIgnores: ["sw.js", "workbox-*.js", "**/_worker.js/**"],
  maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
  navigateFallback: "/index.html",
  navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//, /^\/_/],
  ignoreURLParametersMatching: [/^source$/, /^open$/, /^shortcut$/, /^stream$/, /^shared$/, /^utm_/, /^fbclid$/],
  navigationPreload: false,
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
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

// ── 3. Cloudflare Pages Advanced Mode Bundle Preparation ──
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
