// Dev-only Web Vitals overlay. Activates with `?vitals=1` in the URL.
// Zero third-party endpoints — measurements stay in the user's browser.
// Lazy-imports `web-vitals` so production bundles pay nothing unless enabled.

type Metric = { name: string; value: number; rating?: string };

function mountOverlay() {
  if (typeof document === "undefined") return null;
  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.setAttribute("aria-label", "Web Vitals overlay");
  el.style.cssText = [
    "position:fixed", "right:8px", "bottom:8px", "z-index:2147483647",
    "padding:8px 10px", "font:11px/1.4 ui-monospace,monospace",
    "color:#fff", "background:rgba(20,20,24,0.9)",
    "border:1px solid rgba(255,255,255,0.12)", "border-radius:8px",
    "backdrop-filter:blur(6px)", "pointer-events:none",
    "box-shadow:0 8px 24px rgba(0,0,0,0.4)",
  ].join(";");
  el.textContent = "vitals…";
  document.body.appendChild(el);
  return el;
}

const rows = new Map<string, Metric>();
function render(el: HTMLElement) {
  const lines = Array.from(rows.values()).map((m) => {
    const v = m.name === "CLS" ? m.value.toFixed(3) : Math.round(m.value).toString();
    const tag = m.rating ? ` ${m.rating}` : "";
    return `${m.name}: ${v}${tag}`;
  });
  el.textContent = lines.join("  ·  ") || "vitals…";
}

export function startVitals() {
  if (typeof window === "undefined") return;
  let enabled = false;
  try {
    enabled = new URL(window.location.href).searchParams.get("vitals") === "1";
  } catch { /* noop */ }
  if (!enabled) return;
  const el = mountOverlay();
  if (!el) return;
  import("web-vitals").then((wv) => {
    const push = (m: Metric) => { rows.set(m.name, m); render(el); };
    wv.onLCP?.(push); wv.onINP?.(push); wv.onCLS?.(push);
    wv.onFCP?.(push); wv.onTTFB?.(push);
  }).catch(() => { el.textContent = "vitals: web-vitals unavailable"; });
}
