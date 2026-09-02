// Guarded SW registration. NEVER registers in dev/preview/iframe; supports ?sw=off kill switch.
export function registerAppServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const refuse = (() => {
    if (!import.meta.env.PROD) return true;
    let inIframe = false;
    try { inIframe = window.self !== window.top; } catch { inIframe = true; }
    if (inIframe) return true;
    const host = window.location.hostname;
    if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
    if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
    if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
    if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("sw") === "off") return true;
    } catch { /* noop */ }
    return false;
  })();

  if (refuse) {
    navigator.serviceWorker.getRegistrations()
      .then((rs) => Promise.all(rs.filter((r) => (r.active?.scriptURL || "").endsWith("/sw.js")).map((r) => r.unregister())))
      .catch(() => undefined);
    return;
  }

  navigator.serviceWorker.register("/sw.js").then((registration) => {
    const notifyUpdate = () => window.dispatchEvent(new CustomEvent("vlc-update-ready"));
    if (registration.waiting) notifyUpdate();
    registration.update().catch(() => undefined);
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) notifyUpdate();
      });
    });
    let refreshed = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshed) return;
      refreshed = true;
      window.location.reload();
    });
    window.addEventListener("vlc-apply-update", () => registration.waiting?.postMessage("SKIP_WAITING"));
    window.setInterval(() => registration.update().catch(() => undefined), 60 * 60 * 1000);
  }).catch((e) => console.warn("SW registration failed", e));
}
