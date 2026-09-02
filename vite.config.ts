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
            // ── Vendor splits ──
            // Keep heavy libraries out of the initial bundle. They load
            // only when a panel/feature that uses them is first opened.
            if (id.includes("node_modules/framer-motion")) return "vendor-motion";
            if (id.includes("node_modules/lucide-react"))  return "vendor-icons";
            if (id.includes("node_modules/@radix-ui"))     return "vendor-radix";

            // ── App-internal splits ──
            if (id.includes("src/skins/") && (id.endsWith("Heroes.ts") || id.endsWith("registry.ts"))) {
              return "skin-catalog";
            }
            if (id.includes("src/skins/godMode.ts"))     return "god-mode";
            if (id.includes("src/features/registry.ts")) return "feature-registry";
            if (id.includes("src/store/studyStore.ts"))   return "study-store";
          },
        },
      },
    },
  },
});
