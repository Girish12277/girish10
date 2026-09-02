import { Suspense, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { FloatingPanel } from "@/components/panels/FloatingPanel";
import { FEATURES, getFeatureComponent } from "./registry";
import { SkeletonBlock } from "@/components/ui/Skeleton";

export function FeatureHost() {
  const openId = usePlayerStore((s) => s.openFeatureId);
  const set = usePlayerStore((s) => s.set);
  // The user has shown intent to use mini-apps — warm a small set of chunks
  // in the background so the next launches are instant offline.
  useEffect(() => {
    if (!openId) return;
    import("@/pwa/warmCache").then((m) => m.warmFeatureCache()).catch(() => undefined);
  }, [openId]);
  if (!openId) return null;
  const def = FEATURES.find((f) => f.id === openId);
  if (!def) return null;
  const Comp = getFeatureComponent(openId);
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
