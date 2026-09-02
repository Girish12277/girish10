// 100% Offline Pre-warming: prefetch all mini-app feature chunks on browser idle
// so browser cache and Service Worker precache hold 100% of lazy feature bundles.

type IdleCb = (cb: () => void, opts?: { timeout: number }) => number;

let warmed = false;

export async function warmFeatureCache() {
  if (typeof window === "undefined") return;
  if (warmed) return;

  const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return;
  if (!navigator.onLine) return;
  warmed = true;

  try {
    const { FEATURES } = await import("@/features/registry");

    const ric: IdleCb = (window as unknown as { requestIdleCallback?: IdleCb }).requestIdleCallback
      ?? ((cb) => window.setTimeout(cb, 200) as unknown as number);

    const queue = [...FEATURES];
    let i = 0;
    const tick = () => {
      if (i >= queue.length) return;
      const def = queue[i++];
      def.loader().catch(() => undefined).finally(() => ric(tick, { timeout: 1500 }));
    };

    ric(tick, { timeout: 2000 });
  } catch {}
}
