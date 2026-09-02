import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
export default function Hanoi() {
  const [pegs, setPegs] = useState<number[][]>([[5,4,3,2,1],[],[]]);
  const [sel, setSel] = useState<number|null>(null);
  const [m, setM] = useState(0);
  const click = (i: number) => {
    if (sel===null) { if (pegs[i].length) setSel(i); }
    else {
      if (i===sel) { setSel(null); return; }
      const top = pegs[sel][pegs[sel].length-1];
      const dst = pegs[i][pegs[i].length-1];
      if (!dst || top<dst) {
        const np = pegs.map(p=>[...p]); np[i].push(np[sel].pop()!); setPegs(np); setM(m+1);
      }
      setSel(null);
    }
  };
  const won = pegs[2].length===5;
  return (
    <Panel>
      <Row>Moves {m} {won&&"· Solved! 🎉"} {sel!==null&&`· Selected peg ${sel+1}`}</Row>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: 180, margin: "12px 0" }}>
        {pegs.map((p,i)=>(
          <div key={i} onClick={()=>click(i)} style={{ width: 100, height: "100%", display:"flex", flexDirection:"column-reverse", alignItems:"center", cursor:"pointer", borderBottom:"2px solid var(--vlc-border-normal)", background: sel===i?"var(--vlc-accent-dim)":"transparent" }}>
            {p.map((d,j)=>(<div key={j} style={{ width: 20+d*16, height: 22, background: ["#ef4444","#f59e0b","#eab308","#22c55e","#3b82f6"][d-1], borderRadius: 4, marginBottom: 2 }}/>))}
          </div>
        ))}
      </div>
      <Row style={{ justifyContent: "center" }}><Btn onClick={()=>{setPegs([[5,4,3,2,1],[],[]]);setM(0);setSel(null);}}>Reset</Btn></Row>
    </Panel>
  );
}
