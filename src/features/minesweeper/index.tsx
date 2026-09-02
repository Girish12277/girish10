import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
const N = 9, MINES = 10;
type Cell = { m: boolean; o: boolean; f: boolean; n: number };
const mk = (): Cell[] => {
  const g: Cell[] = Array.from({length:N*N},()=>({m:false,o:false,f:false,n:0}));
  let placed = 0; while (placed<MINES) { const i = Math.floor(Math.random()*N*N); if (!g[i].m) { g[i].m=true; placed++; } }
  for (let i=0;i<N*N;i++){ if (g[i].m) continue; let n=0; const r=Math.floor(i/N),c=i%N; for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++){ const nr=r+dr,nc=c+dc; if(nr>=0&&nr<N&&nc>=0&&nc<N&&g[nr*N+nc].m) n++; } g[i].n=n; }
  return g;
};
export default function Mine() {
  const [g, setG] = useState(mk());
  const [dead, setDead] = useState(false);
  const won = !dead && g.every(c=>c.m||c.o);
  const open = (i: number) => {
    if (dead||won||g[i].o||g[i].f) return;
    const ng = g.map(c=>({...c}));
    const flood = (j: number) => { if (ng[j].o||ng[j].f) return; ng[j].o=true; if (ng[j].n!==0||ng[j].m) return; const r=Math.floor(j/N),c=j%N; for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++){ const nr=r+dr,nc=c+dc; if(nr>=0&&nr<N&&nc>=0&&nc<N) flood(nr*N+nc); } };
    flood(i);
    if (ng[i].m) { setDead(true); ng.forEach(c=>{ if (c.m) c.o=true; }); }
    setG(ng);
  };
  const flag = (e: React.MouseEvent, i: number) => { e.preventDefault(); if (g[i].o) return; const ng=[...g]; ng[i] = {...ng[i], f: !ng[i].f}; setG(ng); };
  return (
    <Panel>
      <Row>{dead?"💥 Boom":won?"🎉 Cleared!":`Mines: ${MINES - g.filter(c=>c.f).length}`}</Row>
      <div style={{ display:"grid", gridTemplateColumns: `repeat(${N},1fr)`, gap: 2, maxWidth: 320, margin: "12px auto" }}>
        {g.map((c,i)=>(
          <button key={i} onClick={()=>open(i)} onContextMenu={e=>flag(e,i)}
            style={{ aspectRatio:"1", background: c.o?(c.m?"#dc2626":"var(--vlc-bg-elevated)"):"var(--vlc-accent-dim)", color: ["transparent","#3b82f6","#16a34a","#dc2626","#7c3aed","#ea580c","#0891b2","#000","#fff"][c.n], border:"1px solid var(--vlc-border-subtle)", borderRadius: 3, fontSize: 12, fontWeight: 800, cursor:"pointer" }}>
            {c.f&&!c.o?"🚩":c.o?(c.m?"💣":c.n||""):""}
          </button>
        ))}
      </div>
      <Row style={{ justifyContent: "center" }}><Btn onClick={()=>{setG(mk());setDead(false);}}>New</Btn></Row>
    </Panel>
  );
}
