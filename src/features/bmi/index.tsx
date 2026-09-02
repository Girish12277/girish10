import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
export default function BMI() {
  const [metric, setMetric] = useState(true);
  const [h, setH] = useState(170); // cm or inches
  const [w, setW] = useState(70); // kg or lbs
  const kg = metric ? w : w * 0.4536; const m = metric ? h / 100 : h * 0.0254;
  const bmi = kg / (m * m);
  const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const color = bmi < 18.5 ? "var(--vlc-info, #56a3ff)" : bmi < 25 ? "var(--vlc-good, #5cdb95)" : bmi < 30 ? "var(--vlc-warn, #ffd166)" : "var(--vlc-bad, #ff4d6d)";
  const inp: React.CSSProperties = { width: 100, padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 };
  return (<Panel><Row><b>BMI Calculator</b><span style={{ marginLeft: "auto" }}><Btn onClick={() => setMetric(!metric)}>{metric ? "Metric" : "Imperial"}</Btn></span></Row>
    <Row><span style={{ width: 80 }}>Height ({metric ? "cm" : "in"})</span><input type="number" value={h} onChange={(e) => setH(+e.target.value || 0)} style={inp} /></Row>
    <Row><span style={{ width: 80 }}>Weight ({metric ? "kg" : "lbs"})</span><input type="number" value={w} onChange={(e) => setW(+e.target.value || 0)} style={inp} /></Row>
    <div style={{ marginTop: 12, padding: 16, background: "var(--vlc-bg-elevated)", borderRadius: 8, textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color }}>{isFinite(bmi) ? bmi.toFixed(1) : "—"}</div>
      <div style={{ color, marginTop: 4 }}>{cat}</div>
    </div></Panel>);
}
