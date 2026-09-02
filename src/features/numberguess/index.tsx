import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
export default function NumberGuess() {
  const [n] = useState(() => 1 + Math.floor(Math.random()*100));
  const [g, setG] = useState("");
  const [h, setH] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [secret, setSecret] = useState(n);
  const guess = () => {
    const v = parseInt(g); if (isNaN(v)) return;
    if (v===secret) { setH(p=>[`${v} ✓ correct in ${h.length+1}`, ...p]); setWon(true); }
    else setH(p=>[`${v} ${v<secret?"too low ↑":"too high ↓"}`, ...p]);
    setG("");
  };
  const reset = () => { setSecret(1+Math.floor(Math.random()*100)); setH([]); setWon(false); };
  return (
    <Panel>
      <div style={{marginBottom:8}}>Guess a number 1–100</div>
      <Row>
        <input value={g} onChange={e=>setG(e.target.value)} onKeyDown={e=>e.key==="Enter"&&guess()} disabled={won} style={{ padding: 6, width: 100, background:"var(--vlc-bg-elevated)",color:"var(--vlc-text-primary)",border:"1px solid var(--vlc-border-normal)",borderRadius:6 }} />
        <Btn onClick={guess} disabled={won}>Guess</Btn>
        {won && <Btn onClick={reset}>Play Again</Btn>}
      </Row>
      <div style={{ maxHeight: 180, overflow: "auto", marginTop: 8, fontSize: 12 }}>{h.map((x,i)=><div key={i} style={{padding:"3px 0"}}>{x}</div>)}</div>
    </Panel>
  );
}
