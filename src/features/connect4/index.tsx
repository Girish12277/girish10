import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
const W = 7, H = 6;
type C = 0|1|2; // 0 empty, 1 you, 2 cpu
const empty = (): C[][] => Array.from({length:H},()=>Array(W).fill(0));
function drop(b: C[][], col: number, p: C): C[][]|null { for (let r=H-1;r>=0;r--) if (!b[r][col]) { const nb=b.map(x=>[...x]); nb[r][col]=p; return nb; } return null; }
function check(b: C[][]): C { for (let r=0;r<H;r++) for (let c=0;c<W;c++) { const p=b[r][c]; if (!p) continue; for (const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]){ let k=1; while(k<4){const nr=r+dr*k,nc=c+dc*k; if(nr<0||nr>=H||nc<0||nc>=W||b[nr][nc]!==p)break; k++;} if(k===4) return p; } } return 0; }
function cpuMove(b: C[][]): number { for (let c=0;c<W;c++){ const t=drop(b,c,2); if(t&&check(t)===2) return c; } for (let c=0;c<W;c++){ const t=drop(b,c,1); if(t&&check(t)===1) return c; } const opts = [3,2,4,1,5,0,6].filter(c=>!b[0][c]); return opts[0] ?? -1; }

export default function Connect4() {
  const [b, setB] = useState<C[][]>(empty());
  const [w, setW] = useState<C>(0);
  const play = (c: number) => {
    if (w) return; const nb = drop(b,c,1); if (!nb) return; setB(nb);
    const ww = check(nb); if (ww){setW(ww);return;}
    setTimeout(()=>{ const cc = cpuMove(nb); if (cc<0) return; const nb2 = drop(nb,cc,2); if (!nb2) return; setB(nb2); const ww2 = check(nb2); if (ww2) setW(ww2); }, 300);
  };
  return (
    <Panel>
      <Row>You 🔴 · CPU 🟡 {w===1?"· You win!":w===2?"· CPU wins":""}</Row>
      <div style={{ background: "#1e3a8a", padding: 6, borderRadius: 8, maxWidth: 360, margin: "0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${W},1fr)`, gap: 4 }}>
          {Array.from({length:W}).map((_,c)=>(<button key={c} onClick={()=>play(c)} style={{ aspectRatio: "1", background:"#1e40af",border:"none",borderRadius:4,color:"#fff",cursor:"pointer",fontSize:10 }}>▼</button>))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${W},1fr)`, gap: 4, marginTop: 4 }}>
          {b.flat().map((v,i)=>(<div key={i} style={{ aspectRatio:"1", background: v===1?"#ef4444":v===2?"#eab308":"#1e3a8a", border: "2px solid #1e40af", borderRadius: "50%" }}/>))}
        </div>
      </div>
      <Row style={{ justifyContent: "center", marginTop: 8 }}><Btn onClick={()=>{setB(empty());setW(0);}}>New Game</Btn></Row>
    </Panel>
  );
}
