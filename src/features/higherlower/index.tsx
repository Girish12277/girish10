import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
import { loadNum, saveNum } from "../_shared/ui";
const rand = () => 1 + Math.floor(Math.random()*13);
export default function HigherLower() {
  const [c, setC] = useState(rand());
  const [n, setN] = useState(rand());
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadNum("hl-best"));
  const [dead, setDead] = useState(false);
  const pick = (g: "h"|"l") => {
    setShow(true);
    setTimeout(() => {
      const ok = g==="h" ? n>=c : n<=c;
      if (ok) { const s = score+1; setScore(s); if (s>best){setBest(s);saveNum("hl-best",s);} setC(n); setN(rand()); setShow(false); }
      else setDead(true);
    }, 500);
  };
  const reset = () => { setC(rand()); setN(rand()); setScore(0); setShow(false); setDead(false); };
  return (
    <Panel>
      <Row>Score {score} · Best {best}</Row>
      <div style={{ display: "flex", justifyContent: "space-around", margin: "16px 0", fontSize: 56 }}>
        <div style={{textAlign:"center"}}><div>{c}</div><div style={{fontSize:11,marginTop:4}}>Current</div></div>
        <div style={{textAlign:"center"}}><div>{show?n:"?"}</div><div style={{fontSize:11,marginTop:4}}>Next</div></div>
      </div>
      {dead ? <Row style={{justifyContent:"center"}}><Btn onClick={reset}>Play Again</Btn></Row> :
        <Row style={{justifyContent:"center"}}><Btn onClick={()=>pick("l")} disabled={show}>Lower ↓</Btn><Btn onClick={()=>pick("h")} disabled={show}>Higher ↑</Btn></Row>}
    </Panel>
  );
}
