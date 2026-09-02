import { useState } from "react";
import { Panel, Row } from "../_shared/ui";

export default function CssUnits() {
  const [px, setPx] = useState(16); const [base, setBase] = useState(16);
  const F = (l: string, v: string) => <Row><span style={{ width: 56, opacity: 0.7 }}>{l}</span><input value={v} readOnly style={{ flex: 1, padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>;
  return (
    <Panel>
      <Row><span style={{ width: 56, opacity: 0.7 }}>Pixels</span><input type="number" value={px} onChange={(e) => setPx(+e.target.value)} style={{ flex: 1, padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      <Row><span style={{ width: 56, opacity: 0.7 }}>Base</span><input type="number" value={base} onChange={(e) => setBase(+e.target.value || 16)} style={{ flex: 1, padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      {F("rem", `${(px / base).toFixed(4)} rem`)}
      {F("em", `${(px / base).toFixed(4)} em`)}
      {F("pt", `${(px * 0.75).toFixed(2)} pt`)}
      {F("%", `${((px / base) * 100).toFixed(2)} %`)}
      {F("vw@1080", `${((px / 1920) * 100).toFixed(3)} vw`)}
    </Panel>
  );
}
