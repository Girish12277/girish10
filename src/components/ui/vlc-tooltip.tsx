import * as RT from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

/**
 * Tooltip — single source of truth for hint chips across chrome.
 *
 * - Uses Radix for keyboard/focus/escape correctness.
 * - 250 ms open delay; 0 ms group skip-delay (rapid sibling tooltips re-open
 *   instantly, matching native menubar/toolbar feel).
 * - Glass-panel chip honoring `--vlc-*` tokens, so light theme parity is free.
 * - `kbd` prop right-aligns a tabular-mono key hint inside the chip.
 */
export interface TooltipProps {
  label: string;
  kbd?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  children: ReactNode;
}

let providerMounted = false;

export function TooltipProviderOnce({ children }: { children: ReactNode }) {
  if (providerMounted) return <>{children}</>;
  providerMounted = true;
  return (
    <RT.Provider delayDuration={250} skipDelayDuration={0}>
      {children}
    </RT.Provider>
  );
}

export function Tooltip({ label, kbd, side = "top", align = "center", delayDuration, children }: TooltipProps) {
  return (
    <RT.Root delayDuration={delayDuration ?? 250}>
      <RT.Trigger asChild>{children}</RT.Trigger>
      <RT.Portal>
        <RT.Content
          side={side}
          align={align}
          sideOffset={8}
          collisionPadding={8}
          className="vlc-rise glass-panel"
          style={{
            zIndex: 80,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 9px",
            borderRadius: "var(--vlc-radius-sm)",
            border: "1px solid var(--vlc-border-normal)",
            boxShadow: "var(--vlc-shadow-3)",
            color: "var(--vlc-text-primary)",
            fontSize: 11,
            fontWeight: 500,
            lineHeight: 1.2,
            maxWidth: 280,
            pointerEvents: "none",
          }}
        >
          <span>{label}</span>
          {kbd && (
            <kbd
              className="vlc-num"
              style={{
                fontSize: 10,
                padding: "1px 5px",
                borderRadius: "var(--vlc-radius-xs)",
                background: "var(--vlc-bg-raised)",
                border: "1px solid var(--vlc-border-subtle)",
                color: "var(--vlc-text-secondary)",
              }}
            >
              {kbd}
            </kbd>
          )}
        </RT.Content>
      </RT.Portal>
    </RT.Root>
  );
}
