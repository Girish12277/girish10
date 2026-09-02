import { useState } from "react";
import { Panel, Row } from "../_shared/ui";
const RATES: Record<string, number> = { USD: 1, EUR: 0.93, GBP: 0.79, JPY: 156, INR: 83.5, CNY: 7.25, AUD: 1.52, CAD: 1.36, CHF: 0.89, BTC: 0.000015 };
export default function Currency() {
  const [amt, setAmt] = useState(100); const [from, setFrom] = useState("USD"); const [to, setTo] = useState("EUR");
  const out = (amt / RATES[from]) * RATES[to];
  const sel: React.CSSProperties = { padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 };
  return (<Panel><Row><b>Currency Converter</b><span style={{ marginLeft: "auto", fontSize: 10, color: "var(--vlc-text-ghost)" }}>indicative rates</span></Row>
    <Row><input type="number" value={amt} onChange={(e) => setAmt(+e.target.value || 0)} style={{ ...sel, width: 130 }} />
      <select value={from} onChange={(e) => setFrom(e.target.value)} style={sel}>{Object.keys(RATES).map((c) => <option key={c}>{c}</option>)}</select>
      <span>→</span>
      <select value={to} onChange={(e) => setTo(e.target.value)} style={sel}>{Object.keys(RATES).map((c) => <option key={c}>{c}</option>)}</select></Row>
    <div style={{ marginTop: 12, padding: 14, background: "var(--vlc-bg-elevated)", borderRadius: 8, textAlign: "center", fontSize: 26, fontWeight: 700, color: "var(--vlc-accent)" }}>{out.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}</div>
  </Panel>);
}
