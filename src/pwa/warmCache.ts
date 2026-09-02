// Opt-in offline warming: prefetch feature chunks so the SW precache + browser
// cache hold the lazy bundles. This is NOT run on first load — 50 parallel
// chunk fetches competed with the UI and the video on every visit. It is
// triggered once the user actually opens the feature host (or from an explicit
// "make offline ready" action).

type IdleCb = (cb: () => void, opts?: { timeout: number }) => number;

let warmed = false;

export async function warmFeatureCache(limit = 12) {
  if (typeof window === "undefined") return;
  if (warmed) return;
  // Skip on Save-Data or offline (no point re-fetching when network is the bottleneck).
  const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return;
  if (!navigator.onLine) return;
  warmed = true;

  // Registry is itself a lazy chunk — importing it eagerly would defeat the point.
  const { FEATURES } = await import("@/features/registry");

  const ric: IdleCb = (window as unknown as { requestIdleCallback?: IdleCb }).requestIdleCallback
    ?? ((cb) => window.setTimeout(cb, 200) as unknown as number);

  const queue = FEATURES.slice(0, limit);
  let i = 0;
  const tick = () => {
    if (i >= queue.length) return;
    const def = queue[i++];
    def.loader().catch(() => undefined).finally(() => ric(tick, { timeout: 2000 }));
  };
  // One serial idle chain — never competes with the app for bandwidth.
  ric(tick, { timeout: 3000 });
}
