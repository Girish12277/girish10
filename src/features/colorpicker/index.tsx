import { useState } from "react";
import { Panel, Btn } from "../_shared/ui";

export default function ColorPicker() {
  const [c, setC] = useState("#42a5f5");
  const r = parseInt(c.slice(1,3),16), g = parseInt(c.slice(3,5),16), b = parseInt(c.slice(5,7),16);
  const copy = (t: string) => navigator.clipboard?.writeText(t).catch(()=>{});
  return (
    <Panel>
      <div style={{ height: 120, background: c, borderRadius: 8, marginBottom: 12, border: "1px solid var(--vlc-border-subtle)" }} />
      <input type="color" value={c} onChange={e=>setC(e.target.value)} style={{ width: "100%", height: 40, background: "transparent", border: "none", cursor: "pointer" }} />
      <div style={{ display: "grid", gap: 6, marginTop: 10, fontFamily: "monospace", fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>HEX: {c.toUpperCase()} <Btn onClick={() => copy(c)}>Copy</Btn></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>RGB: {r},{g},{b} <Btn onClick={() => copy(`rgb(${r},${g},${b})`)}>Copy</Btn></div>
      </div>
    </Panel>
  );
}
