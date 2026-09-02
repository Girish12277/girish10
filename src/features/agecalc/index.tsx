import { useState } from "react";
import { Panel, Row } from "../_shared/ui";
export default function AgeCalc() {
  const [dob, setDob] = useState("2000-01-01");
  const d = new Date(dob); const now = new Date();
  const ms = now.getTime() - d.getTime(); const days = Math.floor(ms / 86400000);
  let years = now.getFullYear() - d.getFullYear(); let months = now.getMonth() - d.getMonth();
  if (now.getDate() < d.getDate()) months--; if (months < 0) { years--; months += 12; }
  return (<Panel><Row><b>Age Calculator</b></Row>
    <Row><span>Birthday</span><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={{ padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }} /></Row>
    <div style={{ marginTop: 12, padding: 12, background: "var(--vlc-bg-elevated)", borderRadius: 8 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: "var(--vlc-accent)" }}>{years} years, {months} months</div>
      <div style={{ marginTop: 8, fontSize: 12, color: "var(--vlc-text-secondary)" }}>
        {days.toLocaleString()} days · {(days * 24).toLocaleString()} hours · {(days * 1440).toLocaleString()} minutes
      </div>
    </div></Panel>);
}
