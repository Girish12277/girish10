import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";

export interface MenuItemDef {
  type?: "item" | "separator" | "submenu";
  label?: string;
  shortcut?: string;
  checked?: boolean;
  onSelect?: () => void;
  submenu?: MenuItemDef[];
  disabled?: boolean;
}

export function MenuDropdown({ label, items, isOpen, onOpen, onClose }: { label: string; items: MenuItemDef[]; isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Outside-click closer. Skipped while closed (no listener attached).
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    };
    // pointerdown fires before click and works for mouse + touch + pen.
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative" style={{ height: 28 }}>
      <button
        type="button"
        // Use pointerdown for zero-latency open and to win the race against
        // any global mousedown handlers (selection, focus, etc).
        onPointerDown={(e) => {
          e.preventDefault(); // prevent button focus stealing + text selection
          if (isOpen) onClose();
          else onOpen();
        }}
        onMouseEnter={() => {
          // Hover-switch: if any menu is already open, switching menus follows the cursor.
          if (!isOpen && document.querySelector('[data-vlc-menu-open="true"]')) onOpen();
        }}
        data-vlc-menu-open={isOpen}
        className="px-3 h-full text-[12px]"
        style={{ background: isOpen ? "var(--vlc-bg-elevated)" : "transparent", color: isOpen ? "var(--vlc-text-primary)" : "var(--vlc-text-secondary)", border: "none", cursor: "pointer" }}
      >
        {label}
      </button>
      {isOpen && (
        <div
          className={`absolute left-0 top-full py-1 ${hasSubmenus(items) ? "" : "vlc-menu-scroll"}`}
          style={{
            minWidth: 240,
            zIndex: 1000,
            // Only scroll panels made of plain items. A scrolling container
            // clips absolutely-positioned flyout submenus, making them
            // unopenable — so panels containing submenus stay overflow-visible.
            ...(hasSubmenus(items)
              ? {}
              : { maxHeight: "min(70vh, 520px)", overflowY: "auto" as const, overflowX: "hidden" as const }),
            background: "var(--vlc-bg-elevated)",
            border: "1px solid var(--vlc-border-normal)",
            borderRadius: "var(--vlc-radius-sm)",
            boxShadow: "var(--vlc-shadow-popup)",
          }}
        >
          {items.map((it, i) => <RenderItem key={i} it={it} onClose={onClose} />)}
        </div>
      )}
    </div>
  );
}

// True when the panel contains flyout submenus — such panels must NOT scroll,
// otherwise the flyouts (positioned outside the panel) get clipped.
function hasSubmenus(items: MenuItemDef[]): boolean {
  return items.some((it) => it.type === "submenu" && !!it.submenu);
}

function RenderItem({ it, onClose }: { it: MenuItemDef; onClose: () => void }) {
  const [subOpen, setSubOpen] = useState(false);
  if (it.type === "separator") return <div style={{ height: 1, background: "var(--vlc-border-subtle)", margin: "4px 0" }} />;
  if (it.type === "submenu" && it.submenu) {
    return (
      <div className="relative" onMouseEnter={() => setSubOpen(true)} onMouseLeave={() => setSubOpen(false)}>
        <Row label={it.label!} right={<ChevronRight size={12} color="var(--vlc-text-ghost)" />} checked={it.checked} />
        {subOpen && (
          <div
            className={`absolute left-full top-0 py-1 ${hasSubmenus(it.submenu) ? "" : "vlc-menu-scroll"}`}
            style={{
              minWidth: 220,
              zIndex: 1001,
              ...(hasSubmenus(it.submenu)
                ? {}
                : { maxHeight: "min(60vh, 480px)", overflowY: "auto" as const, overflowX: "hidden" as const }),
              background: "var(--vlc-bg-elevated)",
              border: "1px solid var(--vlc-border-normal)",
              borderRadius: "var(--vlc-radius-sm)",
              boxShadow: "var(--vlc-shadow-popup)",
            }}
          >
            {it.submenu.map((s, i) => <RenderItem key={i} it={s} onClose={onClose} />)}
          </div>
        )}
      </div>
    );
  }
  return (
    <Row
      label={it.label!}
      shortcut={it.shortcut}
      checked={it.checked}
      disabled={it.disabled}
      onClick={() => { if (it.disabled) return; it.onSelect?.(); onClose(); }}
    />
  );
}

function Row({ label, shortcut, checked, right, onClick, disabled }: { label: string; shortcut?: string; checked?: boolean; right?: ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center text-[12px] text-left"
      style={{ height: 26, padding: "0 12px 0 24px", color: disabled ? "var(--vlc-text-disabled)" : "var(--vlc-text-secondary)", position: "relative" }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = "rgba(255,136,0,0.12)"; e.currentTarget.style.color = "var(--vlc-text-primary)"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = disabled ? "var(--vlc-text-disabled)" : "var(--vlc-text-secondary)"; }}
    >
      {checked && <Check size={12} color="var(--vlc-accent)" style={{ position: "absolute", left: 8 }} />}
      <span className="flex-1 truncate">{label}</span>
      {shortcut && <span className="text-[11px]" style={{ color: "var(--vlc-text-ghost)", marginLeft: 16 }}>{shortcut}</span>}
      {right}
    </button>
  );
}
