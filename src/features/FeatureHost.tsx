import { Suspense, useEffect, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { FloatingPanel } from "@/components/panels/FloatingPanel";
import type { FeatureDef } from "./registry";

/** Lightweight skeleton block — avoids importing Skeleton.tsx (which pulls framer-motion). */
function SkeletonBlock({ width, height }: { width: number | string; height: number | string }) {
  return (
    <div
      className="vlc-skeleton-pulse rounded"
      style={{ width, height, background: "var(--vlc-bg-surface)" }}
    />
  );
}

export function FeatureHost() {
  const openId = usePlayerStore((s) => s.openFeatureId);
  const set = usePlayerStore((s) => s.set);

  // Dynamic import: features/registry is NOT statically imported so Vite can
  // code-split it (and all 150+ feature loaders) out of the initial bundle.
  const [reg, setReg] = useState<{ FEATURES: FeatureDef[]; getFeatureComponent: (id: string) => React.ComponentType | null } | null>(null);
  useEffect(() => {
    if (!openId) return;
    let cancelled = false;
    import("./registry").then((m) => {
      if (!cancelled) setReg({ FEATURES: m.FEATURES, getFeatureComponent: m.getFeatureComponent });
    }).catch(() => undefined);
    // Warm cache for future feature launches
    import("@/pwa/warmCache").then((m) => m.warmFeatureCache()).catch(() => undefined);
    return () => { cancelled = true; };
  }, [openId]);

  if (!openId) return null;
  if (!reg) return null;
  const def = reg.FEATURES.find((f) => f.id === openId);
  if (!def) return null;
  const Comp = reg.getFeatureComponent(openId);
  if (!Comp) return null;
  return (
    <FloatingPanel title={def.title} width={def.width ?? 380} onClose={() => set({ openFeatureId: null })}>
      <Suspense fallback={
        <div className="p-4 flex flex-col gap-4">
          <SkeletonBlock width="70%" height={20} />
          <SkeletonBlock width="100%" height={12} />
          <SkeletonBlock width="95%" height={12} />
          <SkeletonBlock width="80%" height={12} />
        </div>
      }>
        <Comp />
      </Suspense>
    </FloatingPanel>
  );
}
