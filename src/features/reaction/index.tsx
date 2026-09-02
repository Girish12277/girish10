import { useRef, useState } from "react";
import { Btn, Panel, Row, loadNum, saveNum } from "../_shared/ui";
export default function Reaction() {
  const [state, setState] = useState<"idle"|"wait"|"go"|"early"|"done">("idle");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState(loadNum("react-best") || 9999);
  const t = useRef<number|undefined>(undefined);
  const start = useRef(0);
  const begin = () => {
    setState("wait");
    t.current = window.setTimeout(()=>{ start.current = performance.now(); setState("go"); }, 1000+Math.random()*3000);
  };
  const click = () => {
    if (state==="wait") { clearTimeout(t.current); setState("early"); }
    else if (state==="go") { const d = Math.round(performance.now()-start.current); setMs(d); setState("done"); if (d<best){setBest(d);saveNum("react-best",d);} }
    else begin();
  };
  const bg = state==="wait"?"#dc2626":state==="go"?"#16a34a":state==="early"?"#f59e0b":"var(--vlc-bg-elevated)";
  const msg = state==="idle"?"Click to start":state==="wait"?"Wait for GREEN…":state==="go"?"CLICK NOW!":state==="early"?"Too early! Click to retry":`${ms} ms · Best ${best}ms — Click to retry`;
  return (
    <Panel>
      <Row>Best: {best===9999?"—":`${best}ms`}</Row>
      <div onClick={click} style={{ background: bg, height: 220, borderRadius: 12, display:"flex", alignItems:"center", justifyContent:"center", fontSize: 18, fontWeight: 700, cursor: "pointer", color:"var(--vlc-text-primary)", textAlign:"center", padding: 16 }}>{msg}</div>
      <Row style={{marginTop:8,justifyContent:"center"}}><Btn onClick={()=>{setBest(9999);saveNum("react-best",9999);}}>Reset best</Btn></Row>
    </Panel>
  );
}
