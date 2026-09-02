import { useEffect, useState } from "react";
import { Panel, Btn } from "../_shared/ui";

type E = { id: number; label: string; amount: number };
const KEY = "vlc-feat-exp";

export default function Expenses() {
  const [items, setItems] = useState<E[]>(() => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } });
  const [label, setLabel] = useState("");
  const [amt, setAmt] = useState("");
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items]);

  const total = items.reduce((s, x) => s + x.amount, 0);
  return (
    <Panel>
      <div style={{ fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>${total.toFixed(2)}</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label" style={{ flex: 2, padding: 6, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }} />
        <input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0.00" type="number" style={{ flex: 1, padding: 6, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }} />
        <Btn onClick={() => { const a = parseFloat(amt); if (!label.trim() || isNaN(a)) return; setItems(i => [{ id: Date.now(), label, amount: a }, ...i]); setLabel(""); setAmt(""); }}>+</Btn>
      </div>
      <div style={{ maxHeight: 240, overflow: "auto" }}>
        {items.map(e => (
          <div key={e.id} style={{ display: "flex", padding: 6, borderBottom: "1px solid var(--vlc-border-subtle)", fontSize: 12 }}>
            <span style={{ flex: 1 }}>{e.label}</span>
            <span style={{ color: e.amount < 0 ? "#43a047" : "#e57373" }}>${e.amount.toFixed(2)}</span>
            <button onClick={() => setItems(arr => arr.filter(x => x.id!==e.id))} style={{ marginLeft: 8, background: "none", border: "none", color: "var(--vlc-text-ghost)", cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
