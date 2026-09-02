import { useEffect, useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

interface Counter { id: string; label: string; n: number; step: number }

export default function Tally() {
  const [items, setItems] = useState<Counter[]>(() => { try { return JSON.parse(localStorage.getItem("vlc-tally") || "[]"); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem("vlc-tally", JSON.stringify(items)); } catch { /* noop */ } }, [items]);
  const add = () => setItems([...items, { id: crypto.randomUUID(), label: "Counter", n: 0, step: 1 }]);
  const upd = (id: string, p: Partial<Counter>) => setItems(items.map((c) => c.id === id ? { ...c, ...p } : c));
  const del = (id: string) => setItems(items.filter((c) => c.id !== id));
  return (
    <Panel>
      <Row><Btn onClick={add}>+ Add counter</Btn></Row>
      {items.length === 0 && <div style={{ textAlign: "center", padding: 24, opacity: 0.5, fontSize: 12 }}>No counters yet</div>}
      {items.map((c) => (
        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, marginBottom: 6, background: "var(--vlc-bg-sunken)", borderRadius: 8 }}>
          <input value={c.label} onChange={(e) => upd(c.id, { label: e.target.value })} style={{ flex: 1, background: "transparent", color: "var(--vlc-text-primary)", border: "none", outline: "none" }} />
          <Btn onClick={() => upd(c.id, { n: c.n - c.step })}>−</Btn>
          <strong style={{ minWidth: 48, textAlign: "center", fontFamily: "var(--vlc-font-mono, monospace)", color: "var(--vlc-accent-text)" }}>{c.n}</strong>
          <Btn onClick={() => upd(c.id, { n: c.n + c.step })}>+</Btn>
          <input type="number" value={c.step} onChange={(e) => upd(c.id, { step: +e.target.value || 1 })} style={{ width: 50, padding: 4, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }} />
          <Btn onClick={() => del(c.id)}>✕</Btn>
        </div>
      ))}
    </Panel>
  );
}
