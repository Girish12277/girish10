import type { CSSProperties, ReactNode } from "react";
import type { Priority } from "@/store/studyStore";

/**
 * Shared visual atoms for the Study Hub tabs. Extracted verbatim from the
 * original single-file hub so each tab can ship as its own lazy chunk.
 */

export const cardStyle: CSSProperties = {
  background: "color-mix(in oklab, var(--vlc-bg-elevated) 80%, transparent)",
  border: "1px solid var(--vlc-border-subtle)",
  borderRadius: 12,
  padding: 12,
};

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <h3 className="text-[14px] font-bold tracking-tight">{children}</h3>
      {action}
    </div>
  );
}

export function PrimaryBtn({ children, onClick, type = "button", disabled }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className="px-3 py-1.5 text-[12px] font-semibold rounded-md transition-opacity disabled:opacity-50"
      style={{ background: "var(--vlc-accent)", color: "var(--vlc-bg-base)" }}>
      {children}
    </button>
  );
}

export function GhostBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors"
      style={{ background: "transparent", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}>
      {children}
    </button>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className={"w-full px-2.5 py-1.5 text-[12px] rounded-md outline-none " + (props.className ?? "")}
      style={{
        background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)",
        border: "1px solid var(--vlc-border-subtle)", ...(props.style ?? {}),
      }}
    />
  );
}

export function NumInput({ value, onChange, min = 1, max = 999 }: { value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <input type="number" value={value} min={min} max={max}
      onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
      className="w-16 px-2 py-1 text-[12px] rounded-md tabular-nums"
      style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }}
    />
  );
}

/** Shared select styling — matches TextInput so forms line up. */
export const selectStyle: CSSProperties = {
  background: "var(--vlc-bg-sunken)",
  color: "var(--vlc-text-primary)",
  border: "1px solid var(--vlc-border-subtle)",
};

export function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <div className="text-center text-[12px] py-10" style={{ color: "var(--vlc-text-disabled)" }}>{children}</div>
  );
}

export function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-1 text-[12px] cursor-pointer">
      <span>{label}</span>
      <button onClick={() => onChange(!value)} role="switch" aria-checked={value}
        className="relative inline-block transition-colors"
        style={{
          width: 32, height: 18, borderRadius: 999,
          background: value ? "var(--vlc-accent)" : "color-mix(in oklab, var(--vlc-text-primary) 18%, transparent)",
        }}>
        <span style={{
          position: "absolute", top: 2, left: value ? 16 : 2,
          width: 14, height: 14, borderRadius: 999,
          background: "var(--vlc-bg-base)", transition: "left 160ms ease",
        }} />
      </button>
    </label>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={cardStyle} className="text-center">
      <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--vlc-text-disabled)" }}>{label}</div>
      <div className="text-[22px] font-bold mt-1 tabular-nums">{value}</div>
    </div>
  );
}

export function PriorityBadge({ p }: { p: Priority }) {
  const map = { high: ["#ff6b6b", "High"], med: ["var(--vlc-accent)", "Med"], low: ["#888", "Low"] } as const;
  const [color, label] = map[p];
  return <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase"
    style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}>{label}</span>;
}

export function fmtMs(ms: number) {
  const total = Math.ceil(ms / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
