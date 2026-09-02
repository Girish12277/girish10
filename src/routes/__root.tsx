import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

import { OfflineStatusIndicator } from "@/components/layout/OfflineStatusIndicator";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VLC Web Player" },
      { name: "description", content: "A web-based video player inspired by VLC, offering extensive customization and native playback." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "VLC Web Player" },
      { property: "og:description", content: "A web-based video player inspired by VLC, offering extensive customization and native playback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "VLC Web Player" },
      { name: "twitter:description", content: "A web-based video player inspired by VLC, offering extensive customization and native playback." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/96d46707-d0b5-40af-ab7e-45c172a7a413" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/96d46707-d0b5-40af-ab7e-45c172a7a413" },
      { name: "theme-color", content: "#1E1E1E" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "VLC Web" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/icons/icon-32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icons/icon-192.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/icon-180.png" },
      // Preconnect for the skin font catalog. Loading is deferred via the
      // `display=swap` directive so fonts never block first paint or video.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Preload the two most critical font files (Inter Tight 400 + 600)
      // so the primary UI text renders without a flash of invisible text.
      {
        rel: "preload",
        href: "https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0xCHi5XgqoUPvi5.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?" +
          [
            "family=Inter+Tight:wght@400;500;600;700",
            "family=Inter:wght@400;500;600;700",
            "family=JetBrains+Mono:wght@400;500;700",
            "display=swap",
          ].join("&"),
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  let queryClient: QueryClient;
  try {
    const ctx = Route.useRouteContext();
    queryClient = ctx?.queryClient ?? new QueryClient();
  } catch {
    queryClient = new QueryClient();
  }

  useEffect(() => {
    let cancelled = false;
    // Pin the storage schema version so future migrations can transform
    // payloads cleanly instead of silently wiping unknown shapes.
    import("@/utils/settingsBackup").then((m) => { if (!cancelled) m.ensureSchemaPinned(); }).catch(() => undefined);
    import("@/pwa/registerSW").then((reg) => {
      if (cancelled) return;
      reg.registerAppServiceWorker();
    }).catch(() => undefined);
    import("@/pwa/warmCache").then((m) => { if (!cancelled) m.warmFeatureCache(); }).catch(() => undefined);
    import("@/utils/vitals").then((v) => { if (!cancelled) v.startVitals(); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <OfflineStatusIndicator />
    </QueryClientProvider>
  );
}
