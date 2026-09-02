import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
const N = 5;
const mk = () => { const g = Array(N*N).fill(false); for (let k=0;k<8;k++){ const i = Math.floor(Math.random()*N*N); g[i] = !g[i]; } return g; };
export default function LightsOut() {
  const [g, setG] = useState<boolean[]>(mk());
  const [m, setM] = useState(0);
  const toggle = (i: number) => {
    const ng = [...g]; const r = Math.floor(i/N), c = i%N;
    [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{ const nr=r+dr,nc=c+dc; if(nr>=0&&nr<N&&nc>=0&&nc<N) ng[nr*N+nc]=!ng[nr*N+nc]; });
    setG(ng); setM(m+1);
  };
  const won = g.every(x=>!x);
  return (
    <Panel>
      <Row>Moves {m} {won&&"· Solved! 🎉"}</Row>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${N},1fr)`, gap: 4, maxWidth: 280, margin: "12px auto" }}>
        {g.map((on,i)=>(<button key={i} onClick={()=>toggle(i)} style={{ aspectRatio:"1", background: on?"var(--vlc-accent)":"var(--vlc-bg-elevated)", border:"1px solid var(--vlc-border-subtle)", borderRadius: 4, cursor:"pointer" }}/>))}
      </div>
      <Row style={{ justifyContent: "center" }}><Btn onClick={()=>{setG(mk());setM(0);}}>New Puzzle</Btn></Row>
    </Panel>
  );
}
