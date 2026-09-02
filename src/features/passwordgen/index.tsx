import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

export default function PasswordGen() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(true);
  const [pw, setPw] = useState("");

  const gen = () => {
    let pool = "abcdefghijklmnopqrstuvwxyz";
    if (upper) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (num) pool += "0123456789";
    if (sym) pool += "!@#$%^&*()-_=+[]{}";
    const arr = new Uint32Array(len); crypto.getRandomValues(arr);
    setPw(Array.from(arr, n => pool[n % pool.length]).join(""));
  };

  return (
    <Panel>
      <div style={{ padding: 12, background: "var(--vlc-bg-base)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6, fontFamily: "monospace", fontSize: 14, wordBreak: "break-all", minHeight: 50, marginBottom: 10 }}>{pw || "—"}</div>
      <Row><label>Length: {len}</label><input type="range" min={6} max={40} value={len} onChange={e=>setLen(+e.target.value)} style={{ flex: 1 }} /></Row>
      <Row>
        <label><input type="checkbox" checked={upper} onChange={e=>setUpper(e.target.checked)} /> A-Z</label>
        <label><input type="checkbox" checked={num} onChange={e=>setNum(e.target.checked)} /> 0-9</label>
        <label><input type="checkbox" checked={sym} onChange={e=>setSym(e.target.checked)} /> !@#</label>
      </Row>
      <Row>
        <Btn onClick={gen}>Generate</Btn>
        <Btn onClick={() => pw && navigator.clipboard?.writeText(pw).catch(()=>{})}>Copy</Btn>
      </Row>
    </Panel>
  );
}
