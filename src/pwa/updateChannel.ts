// Minimal client↔SW message bridge. The SW broadcasts via
// `postMessage({ type: "VERSION", version, changelog })`; the client can
// subscribe to render a changelog inside the existing UpdateToast.
//
// Also exposes a 24h dismissal helper so "Later" hides the toast for a day
// without losing the next genuine update.

export type SWMessage = { type: "VERSION"; version: string; changelog?: string };

const KEY = "vlc-update-dismiss-until";
const DAY = 24 * 60 * 60 * 1000;

export function isUpdateDismissed(): boolean {
  if (typeof localStorage === "undefined") return false;
  const raw = localStorage.getItem(KEY);
  if (!raw) return false;
  const until = parseInt(raw, 10);
  return Number.isFinite(until) && Date.now() < until;
}

export function dismissUpdateForADay() {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, String(Date.now() + DAY));
}

export function clearUpdateDismissal() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(KEY);
}

export function subscribeToSWMessages(cb: (msg: SWMessage) => void): () => void {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return () => undefined;
  const handler = (e: MessageEvent) => {
    const data = e.data as SWMessage | undefined;
    if (data && data.type === "VERSION") cb(data);
  };
  navigator.serviceWorker.addEventListener("message", handler);
  return () => navigator.serviceWorker.removeEventListener("message", handler);
}
