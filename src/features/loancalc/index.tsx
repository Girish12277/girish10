import { useState } from "react";
import { Panel, Row } from "../_shared/ui";
export default function LoanCalc() {
  const [p, setP] = useState(100000); const [r, setR] = useState(7); const [n, setN] = useState(15);
  const monthly = r === 0 ? p / (n * 12) : (p * (r / 1200)) / (1 - Math.pow(1 + r / 1200, -n * 12));
  const total = monthly * n * 12; const interest = total - p;
  const inp: React.CSSProperties = { width: 120, padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 };
  return (<Panel><Row><b>Loan / EMI</b></Row>
    <Row><span style={{ width: 90 }}>Principal</span><input type="number" value={p} onChange={(e) => setP(+e.target.value || 0)} style={inp} /></Row>
    <Row><span style={{ width: 90 }}>Rate % / yr</span><input type="number" step="0.1" value={r} onChange={(e) => setR(+e.target.value || 0)} style={inp} /></Row>
    <Row><span style={{ width: 90 }}>Years</span><input type="number" value={n} onChange={(e) => setN(+e.target.value || 0)} style={inp} /></Row>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
      {[["Monthly", monthly], ["Interest", interest], ["Total", total]].map(([k, v]) => (
        <div key={k as string} style={{ padding: 10, background: "var(--vlc-bg-elevated)", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "var(--vlc-text-secondary)" }}>{k}</div>
          <div style={{ fontWeight: 700, color: k === "Monthly" ? "var(--vlc-accent)" : "var(--vlc-text-primary)" }}>${(v as number).toFixed(0)}</div>
        </div>
      ))}
    </div></Panel>);
}
