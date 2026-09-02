import { useState } from "react";
import { Panel, Row } from "../_shared/ui";
export default function TipCalc() {
  const [bill, setBill] = useState(50);
  const [pct, setPct] = useState(15);
  const [split, setSplit] = useState(1);
  const tip = bill * pct / 100; const total = bill + tip; const each = total / Math.max(1, split);
  const inp: React.CSSProperties = { width: 100, padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 };
  return (<Panel><Row><b>Tip Calculator</b></Row>
    <Row><span style={{ width: 70 }}>Bill</span><input type="number" value={bill} onChange={(e) => setBill(+e.target.value || 0)} style={inp} /></Row>
    <Row><span style={{ width: 70 }}>Tip %</span><input type="range" min={0} max={30} value={pct} onChange={(e) => setPct(+e.target.value)} style={{ flex: 1 }} /><b>{pct}%</b></Row>
    <Row><span style={{ width: 70 }}>People</span><input type="number" min={1} value={split} onChange={(e) => setSplit(+e.target.value || 1)} style={inp} /></Row>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
      <div style={{ padding: 8, background: "var(--vlc-bg-elevated)", borderRadius: 6, textAlign: "center" }}><div style={{ color: "var(--vlc-text-secondary)", fontSize: 11 }}>Tip</div><div style={{ fontWeight: 700 }}>${tip.toFixed(2)}</div></div>
      <div style={{ padding: 8, background: "var(--vlc-bg-elevated)", borderRadius: 6, textAlign: "center" }}><div style={{ color: "var(--vlc-text-secondary)", fontSize: 11 }}>Total</div><div style={{ fontWeight: 700, color: "var(--vlc-accent)" }}>${total.toFixed(2)}</div></div>
      <div style={{ padding: 8, background: "var(--vlc-bg-elevated)", borderRadius: 6, textAlign: "center" }}><div style={{ color: "var(--vlc-text-secondary)", fontSize: 11 }}>Each</div><div style={{ fontWeight: 700 }}>${each.toFixed(2)}</div></div>
    </div></Panel>);
}
