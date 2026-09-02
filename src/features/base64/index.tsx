import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

export default function Base64() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const enc = () => { try { setB(btoa(unescape(encodeURIComponent(a)))); } catch { setB("Error"); } };
  const dec = () => { try { setB(decodeURIComponent(escape(atob(a)))); } catch { setB("Error"); } };
  return (
    <Panel>
      <textarea value={a} onChange={e=>setA(e.target.value)} placeholder="Input"
        style={{ width: "100%", height: 100, padding: 8, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }} />
      <Row><Btn onClick={enc}>Encode →</Btn><Btn onClick={dec}>Decode →</Btn><Btn onClick={() => navigator.clipboard?.writeText(b).catch(()=>{})}>Copy</Btn></Row>
      <textarea value={b} readOnly placeholder="Output"
        style={{ width: "100%", height: 100, padding: 8, background: "var(--vlc-bg-base)", color: "var(--vlc-accent)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }} />
    </Panel>
  );
}
