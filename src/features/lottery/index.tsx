import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

export default function Lottery() {
  const [picks, setPicks] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [msg, setMsg] = useState("");

  const toggle = (n: number) => {
    setPicks(p => p.includes(n) ? p.filter(x => x!==n) : p.length < 6 ? [...p, n] : p);
  };
  const draw = () => {
    const d: number[] = [];
    while (d.length < 6) { const n = 1 + Math.floor(Math.random()*49); if (!d.includes(n)) d.push(n); }
    setDrawn(d);
    const m = picks.filter(p => d.includes(p)).length;
    setMsg(`${m} match${m===1?"":"es"} ${m>=4?"🎉":""}`);
  };

  return (
    <Panel>
      <div style={{ marginBottom: 8 }}>Pick 6 numbers (1–49)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 28px)", gap: 4, marginBottom: 8 }}>
        {Array.from({length:49}, (_,i) => i+1).map(n => {
          const picked = picks.includes(n); const hit = drawn.includes(n);
          return <button key={n} onClick={() => toggle(n)} style={{ width: 28, height: 28, fontSize: 11, background: hit?"#43a047":picked?"#42a5f5":"var(--vlc-bg-elevated)", color: "#fff", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }}>{n}</button>;
        })}
      </div>
      <Row><Btn onClick={draw} disabled={picks.length!==6}>Draw</Btn><Btn onClick={() => { setPicks([]); setDrawn([]); setMsg(""); }}>Clear</Btn><span>{msg}</span></Row>
    </Panel>
  );
}
