import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
const N = 4;
const shuffle = (): number[] => {
  const a = [...Array(N*N).keys()]; let e = N*N-1;
  for (let k=0;k<200;k++){ const ns = [-1,1,-N,N].map(d=>e+d).filter(x=>x>=0&&x<N*N&&!(d=>d===1?e%N===N-1:d===-1?e%N===0:false)(x-e)); const t = ns[Math.floor(Math.random()*ns.length)]; [a[e],a[t]] = [a[t],a[e]]; e = t; }
  return a;
};
export default function Fifteen() {
  const [g, setG] = useState(shuffle());
  const [m, setM] = useState(0);
  const move = (i: number) => {
    const e = g.indexOf(N*N-1); const dr = Math.floor(i/N)-Math.floor(e/N), dc = i%N-e%N;
    if (Math.abs(dr)+Math.abs(dc)!==1) return;
    const ng = [...g]; [ng[e],ng[i]] = [ng[i],ng[e]]; setG(ng); setM(m+1);
  };
  const won = g.every((v,i)=>v===i);
  return (
    <Panel>
      <Row>Moves {m} {won&&"· Solved! 🎉"}</Row>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${N},1fr)`, gap: 4, maxWidth: 280, margin: "12px auto" }}>
        {g.map((v,i)=>(<button key={i} onClick={()=>move(i)} style={{ aspectRatio:"1", background: v===N*N-1?"transparent":"var(--vlc-bg-elevated)", border: v===N*N-1?"1px dashed var(--vlc-border-subtle)":"1px solid var(--vlc-border-normal)", borderRadius: 6, fontSize: 20, fontWeight: 700, color: "var(--vlc-accent)", cursor:"pointer" }}>{v===N*N-1?"":v+1}</button>))}
      </div>
      <Row style={{ justifyContent: "center" }}><Btn onClick={()=>{setG(shuffle());setM(0);}}>Shuffle</Btn></Row>
    </Panel>
  );
}
