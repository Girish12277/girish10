import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { isVisible } from "@/utils/uiCustomization";

/**
 * Unified Panel shell — header (icon + title + actions + close), scrollable body
 * with sticky section header support, optional footer. Supports two surfaces:
 *
 *   variant="floating" → draggable, snap-to-edge, elevation-4, used for ad-hoc
 *                        tool panels (Effects, Codec Info).
 *   variant="docked"   → fills its parent, no chrome shadow, used inside the
 *                        Preferences shell + future inspector rail.
 */
export interface PanelProps {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  width?: number;
  initialPos?: { x: number; y: number };
  variant?: "floating" | "docked";
  children: ReactNode;
}

export function Panel({
  title, icon, actions, footer, onClose,
  width = 360, initialPos, variant = "floating", children,
}: PanelProps) {
  const initial = initialPos ?? { x: Math.max(16, window.innerWidth - width - 32), y: 80 };
  const [pos, setPos] = useState(initial);
  const drag = useRef<{ ox: number; oy: number; on: boolean }>({ ox: 0, oy: 0, on: false });
  const headerRef = useRef<HTMLDivElement | null>(null);
  const vis = usePlayerStore((s) => s.uiVisibility);
  const showTitlebar = isVisible(vis, "panel.titlebar");
  const showClose = isVisible(vis, "panel.closeButton");
  const canDrag = isVisible(vis, "panel.dragHandle");

  useEffect(() => {
    if (variant !== "floating") return;
    const mv = (e: MouseEvent) => {
      if (!drag.current.on) return;
      const nx = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - drag.current.ox));
      const ny = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - drag.current.oy));
      setPos({ x: nx, y: ny });
    };
    const up = () => {
      if (!drag.current.on) return;
      drag.current.on = false;
      // Snap to nearest horizontal edge if within 24px
      setPos((p) => {
        const right = window.innerWidth - (p.x + width);
        if (p.x < 24) return { x: 8, y: p.y };
        if (right < 24) return { x: window.innerWidth - width - 8, y: p.y };
        return p;
      });
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [variant, width]);

  const headerNode = !showTitlebar ? null : (
    <div
      ref={headerRef}
      className={`flex items-center gap-2 px-3 select-none hairline-bottom ${variant === "floating" && canDrag ? "cursor-move" : ""}`}
      style={{ height: 38, flexShrink: 0 }}
      onMouseDown={(e) => {
        if (variant !== "floating" || !canDrag) return;
        if ((e.target as HTMLElement).closest("button")) return;
        drag.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y, on: true };
      }}
    >
      {icon && <span className="flex items-center justify-center" style={{ color: "var(--vlc-accent)", width: 16, height: 16 }}>{icon}</span>}
      <span className="flex-1 text-[13px] font-medium tracking-tight" style={{ color: "var(--vlc-text-primary)" }}>{title}</span>
      {actions}
      {onClose && showClose && (
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="press grid place-items-center rounded-md"
          style={{ width: 22, height: 22, color: "var(--vlc-text-secondary)" }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );

  const body = (
    <>
      {headerNode}
      <div className="flex-1 overflow-auto">{children}</div>
      {footer && <div className="hairline-top px-3 py-2" style={{ flexShrink: 0 }}>{footer}</div>}
    </>
  );

  if (variant === "docked") {
    return (
      <div
        data-vlc-region="panel"
        className="flex flex-col h-full"
        style={{ background: "var(--vlc-bg-elevated)" }}
      >
        {body}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="floating-panel"
        data-vlc-region="panel"
        className="fixed z-50 glass-panel flex flex-col"
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ type: "spring", damping: 26, stiffness: 340, mass: 0.8 }}
        style={{
          left: pos.x, top: pos.y, width,
          maxHeight: "85vh",
          borderRadius: "var(--vlc-radius-lg, 12px)",
          boxShadow: "0 24px 64px -12px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
          border: "1px solid var(--vlc-border-normal)",
        }}
      >
        {body}
      </motion.div>
    </AnimatePresence>
  );
}

/** Sticky section header for use inside a Panel body. */
export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <header
        className="sticky top-0 z-[1] px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.08em]"
        style={{
          background: "color-mix(in oklab, var(--vlc-bg-elevated) 92%, transparent)",
          backdropFilter: "blur(6px)",
          color: "var(--vlc-text-ghost)",
          borderBottom: "1px solid var(--vlc-border-subtle)",
        }}
      >
        {title}
      </header>
      <div className="px-4 py-3">{children}</div>
    </section>
  );
}
