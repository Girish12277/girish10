import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
export default function RNGPicker() {
  const [items, setItems] = useState("alice\nbob\ncarol\ndave\neve");
  const [pick, setPick] = useState<string | null>(null);
  const list = items.split("\n").map((s) => s.trim()).filter(Boolean);
  return (<Panel><Row><b>Random Picker</b><span style={{ marginLeft: "auto" }}>{list.length} items</span></Row>
    <textarea value={items} onChange={(e) => setItems(e.target.value)} style={{ width: "100%", minHeight: 160, padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }} />
    <Row><Btn onClick={() => list.length && setPick(list[Math.floor(Math.random() * list.length)])} disabled={!list.length}>Pick one</Btn>
      <Btn onClick={() => { const sh = [...list]; for (let i = sh.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[sh[i], sh[j]] = [sh[j], sh[i]]; } setItems(sh.join("\n")); }}>Shuffle</Btn></Row>
    {pick && <div style={{ marginTop: 12, padding: 16, background: "var(--vlc-accent-dim)", border: "1px solid var(--vlc-accent)", borderRadius: 8, textAlign: "center", fontSize: 22, fontWeight: 700, color: "var(--vlc-accent)" }}>{pick}</div>}
  </Panel>);
}
