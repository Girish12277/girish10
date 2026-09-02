import { motion } from "framer-motion";

export function PanelSkeleton({ width = 360 }: { width?: number }) {
  return (
    <motion.div
      className="fixed z-[60] glass-panel flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ type: "spring", damping: 26, stiffness: 340, mass: 0.8 }}
      style={{
        left: typeof window !== "undefined" ? Math.max(16, window.innerWidth - width - 32) : 16,
        top: 80,
        width,
        height: 400,
        borderRadius: "var(--vlc-radius-lg, 12px)",
        boxShadow: "var(--vlc-shadow-popup)",
        border: "1px solid var(--vlc-border-normal)",
      }}
    >
      <div className="flex items-center px-4 hairline-bottom" style={{ height: 38, flexShrink: 0 }}>
        <SkeletonBlock width={120} height={16} />
      </div>
      <div className="p-4 flex flex-col gap-4">
        <SkeletonBlock width="80%" height={20} />
        <SkeletonBlock width="100%" height={12} />
        <SkeletonBlock width="90%" height={12} />
        <SkeletonBlock width="95%" height={12} />
      </div>
    </motion.div>
  );
}

export function DialogSkeleton({ width = 480 }: { width?: number }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: "color-mix(in oklab, black 55%, transparent)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        className="glass-panel flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 26, stiffness: 340, mass: 0.8 }}
        style={{
          width, maxWidth: "92vw", height: 280,
          borderRadius: "var(--vlc-radius-lg, 14px)",
          boxShadow: "var(--vlc-shadow-popup)",
          border: "1px solid var(--vlc-border-normal)",
          background: "var(--vlc-bg-elevated)",
        }}
      >
        <div className="flex items-center px-4 hairline-bottom" style={{ height: 42, flexShrink: 0 }}>
          <SkeletonBlock width={150} height={16} />
        </div>
        <div className="p-4 flex flex-col gap-4">
          <SkeletonBlock width="80%" height={14} />
          <SkeletonBlock width="100%" height={12} />
          <SkeletonBlock width="90%" height={12} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SkeletonBlock({ width, height, className = "" }: { width: number | string; height: number | string; className?: string }) {
  return (
    <div
      className={`vlc-skeleton-pulse rounded ${className}`}
      style={{ width, height, background: "var(--vlc-bg-surface)" }}
    />
  );
}
