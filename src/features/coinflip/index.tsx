import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
export default function CoinFlip() {
  const [side, setSide] = useState<"H"|"T"|"">("");
  const [s, setS] = useState({ h: 0, t: 0 });
  const [spin, setSpin] = useState(false);
  const flip = () => {
    setSpin(true);
    setTimeout(() => {
      const r = Math.random()<0.5?"H":"T"; setSide(r); setSpin(false);
      setS(s=>r==="H"?{...s,h:s.h+1}:{...s,t:s.t+1});
    }, 600);
  };
  return (
    <Panel>
      <Row>Heads {s.h} · Tails {s.t}</Row>
      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <div style={{ fontSize: 96, transform: spin?"rotateY(720deg)":"rotateY(0)", transition: "transform 600ms" }}>{side==="T"?"🪙":side==="H"?"🟡":"🟡"}</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>{side==="H"?"HEADS":side==="T"?"TAILS":"—"}</div>
      </div>
      <Row style={{ justifyContent: "center" }}><Btn onClick={flip} disabled={spin}>Flip</Btn><Btn onClick={()=>setS({h:0,t:0})}>Reset</Btn></Row>
    </Panel>
  );
}
