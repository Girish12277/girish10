import type { ReactNode } from "react";
import { Panel } from "./Panel";

/**
 * Back-compat wrapper around the unified Panel shell so existing call sites
 * (EffectsPanel, CodecInfoPanel) automatically inherit motion, glass surface,
 * snap-to-edge dragging, and consistent header chrome.
 */
export function FloatingPanel({
  title, onClose, width = 340, children, initialPos,
}: {
  title: string;
  onClose: () => void;
  width?: number;
  children: ReactNode;
  initialPos?: { x: number; y: number };
}) {
  return (
    <Panel title={title} onClose={onClose} width={width} initialPos={initialPos} variant="floating">
      {children}
    </Panel>
  );
}
