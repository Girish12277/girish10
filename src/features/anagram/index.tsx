import { useState } from "react";
import { Btn, Panel, Row, loadNum, saveNum } from "../_shared/ui";
const W = ["PLAYER","MUSIC","CANVAS","WINDOW","BUTTON","STREAM","REMOTE","PIXEL","BUFFER","CODEC","FRAME","AUDIO","VIDEO","TRACK","SCREEN"];
const scramble = (w: string): string => { const a = w.split(""); for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a.join("")===w?scramble(w):a.join(""); };
const pick = () => { const w = W[Math.floor(Math.random()*W.length)]; return { w, s: scramble(w) }; };
export default function Anagram() {
  const [q, setQ] = useState(pick());
  const [v, setV] = useState("");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadNum("ana-best"));
  const [msg, setMsg] = useState("");
  const submit = () => {
    if (v.toUpperCase()===q.w) { const s = score+1; setScore(s); if(s>best){setBest(s);saveNum("ana-best",s);} setMsg("✓ Correct!"); setQ(pick()); setV(""); }
    else setMsg(`✗ Was ${q.w}`);
  };
  return (
    <Panel>
      <Row>Score {score} · Best {best}</Row>
      <div style={{ fontSize: 32, textAlign: "center", margin: "20px 0", letterSpacing: 4, fontWeight: 800 }}>{q.s}</div>
      <Row style={{ justifyContent: "center" }}>
        <input value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{ padding: 8, width: 160, fontSize: 16, textAlign: "center", textTransform: "uppercase", background:"var(--vlc-bg-elevated)",color:"var(--vlc-text-primary)",border:"1px solid var(--vlc-border-normal)",borderRadius:6 }}/>
        <Btn onClick={submit}>↵</Btn>
        <Btn onClick={()=>{setQ(pick());setV("");setMsg("Skipped");}}>Skip</Btn>
      </Row>
      <div style={{ textAlign:"center", marginTop: 8, fontSize: 12, color: "var(--vlc-text-secondary)" }}>{msg}</div>
    </Panel>
  );
}
