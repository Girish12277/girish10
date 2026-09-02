/**
 * Central registry for blob: URLs so the app can revoke them when their
 * owning playlist item / subtitle track is removed. Prevents memory growth
 * over long sessions where many files are loaded and unloaded.
 */
const active = new Set<string>();

export function trackBlob(url: string): string {
  if (url.startsWith("blob:")) active.add(url);
  return url;
}

export function revokeBlob(url: string | undefined | null): void {
  if (!url || !url.startsWith("blob:")) return;
  if (active.has(url)) active.delete(url);
  try { URL.revokeObjectURL(url); } catch { /* noop */ }
}

export function revokeAll(): void {
  active.forEach((u) => { try { URL.revokeObjectURL(u); } catch { /* noop */ } });
  active.clear();
}
