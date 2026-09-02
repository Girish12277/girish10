import { useEffect, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
type E = { id: string; project: string; minutes: number; date: string };
export default function Timesheet() {
  const [entries, setEntries] = useState<E[]>(() => { try { return JSON.parse(localStorage.getItem("vlc-feat-timesheet") || "[]"); } catch { return []; } });
  const [proj, setProj] = useState(""); const [min, setMin] = useState(30);
  useEffect(() => { localStorage.setItem("vlc-feat-timesheet", JSON.stringify(entries)); }, [entries]);
  const add = () => { if (!proj.trim()) return; setEntries([{ id: crypto.randomUUID?.() || String(Date.now()), project: proj.trim(), minutes: min, date: new Date().toISOString().slice(0, 10) }, ...entries]); setProj(""); };
  const total = entries.reduce((a, e) => a + e.minutes, 0);
  const byProj = entries.reduce((a, e) => { a[e.project] = (a[e.project] || 0) + e.minutes; return a; }, {} as Record<string, number>);
  return (<Panel><Row><b>Timesheet</b><span style={{ marginLeft: "auto" }}>{(total / 60).toFixed(1)} h total</span></Row>
    <Row><input value={proj} onChange={(e) => setProj(e.target.value)} placeholder="Project" style={{ flex: 1, padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }} />
      <input type="number" value={min} onChange={(e) => setMin(+e.target.value || 0)} style={{ width: 80, padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }} /><span>min</span><Btn onClick={add}>Log</Btn></Row>
    <div style={{ marginTop: 8, maxHeight: 160, overflowY: "auto" }}>{entries.map((e) => (<div key={e.id} style={{ padding: 6, display: "flex", borderBottom: "1px solid var(--vlc-border-subtle)", fontSize: 12 }}>
      <span style={{ flex: 1, color: "var(--vlc-text-primary)" }}>{e.project}</span><span style={{ color: "var(--vlc-text-secondary)", marginRight: 8 }}>{e.date}</span><span style={{ color: "var(--vlc-accent)", fontWeight: 700 }}>{e.minutes}m</span>
      <button onClick={() => setEntries(entries.filter((x) => x.id !== e.id))} style={{ marginLeft: 8, background: "transparent", color: "var(--vlc-text-ghost)", border: "none", cursor: "pointer" }}>×</button>
    </div>))}</div>
    <div style={{ marginTop: 10, padding: 8, background: "var(--vlc-bg-elevated)", borderRadius: 6, fontSize: 11 }}>{Object.entries(byProj).map(([k, v]) => (<div key={k} style={{ display: "flex" }}><span style={{ flex: 1 }}>{k}</span><span style={{ color: "var(--vlc-accent)" }}>{(v / 60).toFixed(1)}h</span></div>))}</div>
  </Panel>);
}
