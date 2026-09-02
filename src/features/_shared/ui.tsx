import type { ReactNode } from "react";

export function Btn({ children, onClick, active, disabled, style }: { children: ReactNode; onClick?: () => void; active?: boolean; disabled?: boolean; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 12px",
        background: active ? "var(--vlc-accent)" : "var(--vlc-control-bg, rgba(255,255,255,0.06))",
        color: active ? "var(--vlc-bg-base)" : "var(--vlc-text-primary)",
        border: "1px solid var(--vlc-border-subtle)",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Panel({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div style={{ padding: 12, color: "var(--vlc-text-primary)", fontFamily: "var(--vlc-font-mono, ui-monospace, monospace)", fontSize: 13, ...style }}>{children}</div>;
}

export function Row({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap", ...style }}>{children}</div>;
}

export function loadNum(k: string, d = 0) { try { return parseInt(localStorage.getItem(`vlc-feat-${k}`) ?? "") || d; } catch { return d; } }
export function saveNum(k: string, v: number) { try { localStorage.setItem(`vlc-feat-${k}`, String(v)); } catch { /* noop */ } }
