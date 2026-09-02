import { useEffect, useState } from "react";
import { Panel, Btn } from "../_shared/ui";

type H = { id: number; name: string; days: Record<string, boolean> };
const KEY = "vlc-feat-habit";
const today = () => new Date().toISOString().slice(0,10);
const lastN = (n: number) => Array.from({length:n}, (_,i) => { const d = new Date(); d.setDate(d.getDate()-(n-1-i)); return d.toISOString().slice(0,10); });

export default function Habit() {
  const [habits, setHabits] = useState<H[]>(() => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } });
  const [name, setName] = useState("");
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(habits)); } catch {} }, [habits]);
  const days = lastN(14);

  return (
    <Panel>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="New habit…"
          style={{ flex: 1, padding: 8, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }} />
        <Btn onClick={() => { if (!name.trim()) return; setHabits(h => [...h, { id: Date.now(), name, days: {} }]); setName(""); }}>Add</Btn>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {habits.map(h => (
          <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: 6, background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }}>
            <span style={{ flex: 1, fontSize: 12 }}>{h.name}</span>
            {days.map(d => (
              <button key={d} title={d} onClick={() => setHabits(arr => arr.map(x => x.id===h.id ? {...x, days: {...x.days, [d]: !x.days[d]}} : x))}
                style={{ width: 16, height: 16, background: h.days[d] ? "#43a047" : "#333", border: d===today()?"1px solid var(--vlc-accent)":"none", borderRadius: 2, cursor: "pointer" }} />
            ))}
            <button onClick={() => setHabits(arr => arr.filter(x => x.id!==h.id))} style={{ background: "none", border: "none", color: "var(--vlc-text-ghost)", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
