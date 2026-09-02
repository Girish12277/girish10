import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
const gen = () => crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); });
export default function UUID() {
  const [n, setN] = useState(5);
  const [list, setList] = useState<string[]>(() => Array.from({ length: 5 }, gen));
  return (<Panel><Row><b>UUID v4</b><span style={{ marginLeft: "auto" }}>Count</span>
    <input type="number" min={1} max={50} value={n} onChange={(e) => setN(+e.target.value || 1)} style={{ width: 70, padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }} />
    <Btn onClick={() => setList(Array.from({ length: n }, gen))}>Generate</Btn></Row>
    <div style={{ marginTop: 10, background: "var(--vlc-bg-elevated)", padding: 10, borderRadius: 6, fontFamily: "var(--vlc-font-mono)", fontSize: 12, maxHeight: 280, overflowY: "auto" }}>
      {list.map((u, i) => (<div key={i} onClick={() => navigator.clipboard?.writeText(u)} title="Click to copy" style={{ padding: 4, cursor: "pointer", borderBottom: "1px solid var(--vlc-border-subtle)" }}>{u}</div>))}
    </div></Panel>);
}
