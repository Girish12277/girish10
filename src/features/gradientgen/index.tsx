import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

export default function GradientGen() {
  const [a, setA] = useState("#0a84ff");
  const [b, setB] = useState("#a78bfa");
  const [deg, setDeg] = useState(135);
  const css = `linear-gradient(${deg}deg, ${a}, ${b})`;
  return (
    <Panel>
      <Row><input type="color" value={a} onChange={(e) => setA(e.target.value)} /><input type="color" value={b} onChange={(e) => setB(e.target.value)} />
        <input type="range" min={0} max={360} value={deg} onChange={(e) => setDeg(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--vlc-font-mono, monospace)" }}>{deg}°</span></Row>
      <div style={{ height: 140, background: css, border: "1px solid var(--vlc-border-subtle)", borderRadius: 8, margin: "8px 0" }} />
      <div style={{ fontFamily: "var(--vlc-font-mono, monospace)", fontSize: 12, padding: 8, background: "var(--vlc-bg-sunken)", borderRadius: 6, wordBreak: "break-all" }}>background: {css};</div>
      <Row><Btn onClick={() => navigator.clipboard?.writeText(`background: ${css};`).catch(() => {})}>Copy CSS</Btn></Row>
    </Panel>
  );
}
