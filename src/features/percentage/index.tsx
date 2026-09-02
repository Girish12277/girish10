import { useState } from "react";
import { Panel, Row } from "../_shared/ui";
export default function Percentage() {
  const [a, setA] = useState(20); const [b, setB] = useState(150);
  const inp: React.CSSProperties = { width: 100, padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 };
  const card = (label: string, val: string) => (<div style={{ padding: 10, background: "var(--vlc-bg-elevated)", borderRadius: 6 }}><div style={{ fontSize: 11, color: "var(--vlc-text-secondary)" }}>{label}</div><div style={{ fontWeight: 700, color: "var(--vlc-accent)" }}>{val}</div></div>);
  return (<Panel><Row><b>Percentage</b></Row>
    <Row><span>A</span><input type="number" value={a} onChange={(e) => setA(+e.target.value || 0)} style={inp} /><span>B</span><input type="number" value={b} onChange={(e) => setB(+e.target.value || 0)} style={inp} /></Row>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
      {card(`${a}% of ${b}`, (a * b / 100).toFixed(2))}
      {card(`${a} is what % of ${b}`, b ? ((a / b) * 100).toFixed(2) + "%" : "—")}
      {card(`% change ${a} → ${b}`, a ? (((b - a) / a) * 100).toFixed(2) + "%" : "—")}
      {card(`${a} + ${b}%`, (a * (1 + b / 100)).toFixed(2))}
    </div></Panel>);
}
