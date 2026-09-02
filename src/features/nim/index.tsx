import { useState, useEffect } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
const init = () => [3,5,7];
export default function Nim() {
  const [p, setP] = useState(init());
  const [turn, setTurn] = useState<"you"|"cpu">("you");
  const [msg, setMsg] = useState("Take 1+ from one row. Whoever takes last loses.");
  useEffect(()=>{
    if (turn==="cpu" && p.some(x=>x>0)) {
      const id = setTimeout(()=>{
        const xor = p.reduce((a,b)=>a^b,0); let row=-1, take=1;
        if (xor!==0) { for (let i=0;i<p.length;i++){ const t = p[i]^xor; if (t<p[i]) { row=i; take=p[i]-t; break; } } }
        else { row = p.findIndex(x=>x>0); take = 1; }
        const np = [...p]; np[row]-=take; setP(np);
        if (np.every(x=>x===0)) { setMsg("CPU took the last — you win! 🎉"); setTurn("you"); return; }
        setTurn("you");
      }, 600);
      return () => clearTimeout(id);
    }
  }, [turn, p]);
  const take = (i: number, n: number) => { if (turn!=="you"||n<=0) return; const np = [...p]; np[i]-=n; setP(np); if (np.every(x=>x===0)) { setMsg("You took the last — you lose."); return; } setTurn("cpu"); };
  return (
    <Panel>
      <Row>{msg} · Turn: {turn==="you"?"You":"CPU…"}</Row>
      {p.map((n,i)=>(
        <div key={i} style={{ display: "flex", gap: 4, marginBottom: 8, alignItems:"center" }}>
          <span style={{ width: 40 }}>Row {i+1}:</span>
          {Array.from({length:n}).map((_,k)=>(<button key={k} onClick={()=>take(i,k+1)} disabled={turn!=="you"} style={{ width: 18, height: 28, background:"var(--vlc-accent)", border:"none", borderRadius: 3, cursor:"pointer" }}/>))}
        </div>
      ))}
      <Row style={{ justifyContent: "center" }}><Btn onClick={()=>{setP(init());setTurn("you");setMsg("Take 1+ from one row.");}}>Reset</Btn></Row>
    </Panel>
  );
}
