import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Cloudflare Pages (GitHub deploys): emit the SSR worker as
  // `dist/client/_worker.js` next to every static asset, so /sw.js,
  // /manifest.webmanifest and /icons all live at the site root. Without this
  // the build lands in `.output` and the whole PWA 404s.
  // Note: Lovable's own hosted build ignores this and keeps its
  // `cloudflare-module` output (dist/server + dist/client) — unchanged.
  nitro: {
    preset: "cloudflare-pages",
    output: { dir: "dist", publicDir: "dist/client" },
    cloudflare: { nodeCompat: true },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("src/skins/") && id.endsWith("Heroes.ts")) {
              return "skin-catalog";
            }
          },
        },
      },
    },
  },
});
