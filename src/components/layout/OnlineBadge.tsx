import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useState } from "react";

/**
 * Compact connectivity pill rendered inside the TitleBar metadata slot.
 * Stays mounted at all times; only the visual state changes so its width
 * doesn't reflow on transition. Shows briefly on reconnect, then auto-fades.
 */
export function OnlineBadge() {
  const online = useOnlineStatus();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    if (!online) { setShow(true); return; }
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 1800);
    return () => window.clearTimeout(t);
  }, [online, mounted]);

  if (!mounted || (!show && online)) return null;

  return (
    <span
      role="status"
      aria-live="polite"
      className="hidden md:inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider px-2 py-[2px] rounded-full"
      style={{
        color: online ? "var(--vlc-success)" : "var(--vlc-warning)",
        background: "var(--vlc-bg-surface)",
        border: `1px solid ${online ? "color-mix(in oklab, var(--vlc-success) 35%, transparent)" : "color-mix(in oklab, var(--vlc-warning) 45%, transparent)"}`,
        transition: "color var(--vlc-dur-base), border-color var(--vlc-dur-base)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6, height: 6, borderRadius: "50%",
          background: online ? "var(--vlc-success)" : "var(--vlc-warning)",
          boxShadow: online
            ? "0 0 6px color-mix(in oklab, var(--vlc-success) 80%, transparent)"
            : "0 0 6px color-mix(in oklab, var(--vlc-warning) 80%, transparent)",
        }}
      />
      {online ? "Online" : "Offline"}
    </span>
  );
}
