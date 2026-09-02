import { useState } from "react";
import { Panel, Row } from "../_shared/ui";
export default function DateAdd() {
  const [base, setBase] = useState(new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState(30);
  const d = new Date(base); d.setDate(d.getDate() + days);
  const inp: React.CSSProperties = { padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 };
  return (<Panel><Row><b>Date Arithmetic</b></Row>
    <Row><span>From</span><input type="date" value={base} onChange={(e) => setBase(e.target.value)} style={inp} /></Row>
    <Row><span>+ days</span><input type="number" value={days} onChange={(e) => setDays(+e.target.value || 0)} style={{ ...inp, width: 100 }} /></Row>
    <div style={{ marginTop: 12, padding: 14, background: "var(--vlc-bg-elevated)", borderRadius: 8, textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--vlc-accent)" }}>{d.toDateString()}</div>
      <div style={{ marginTop: 4, fontSize: 12, color: "var(--vlc-text-secondary)" }}>{d.toISOString().slice(0, 10)}</div>
    </div></Panel>);
}
