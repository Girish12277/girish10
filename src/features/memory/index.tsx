import { useEffect, useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
const EMOJI = ["🎬","🎵","🎮","🎯","🎨","🎭","🎪","🎲"];
const mk = () => { const a = [...EMOJI, ...EMOJI]; for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
export default function Memory() {
  const [g, setG] = useState(mk());
  const [flip, setFlip] = useState<Set<number>>(new Set());
  const [done, setDone] = useState<Set<number>>(new Set());
  const [pick, setPick] = useState<number[]>([]);
  const [m, setM] = useState(0);
  useEffect(()=>{
    if (pick.length===2) {
      setM(m+1);
      const [a,b] = pick;
      if (g[a]===g[b]) { setDone(new Set([...done,a,b])); setFlip(new Set()); setPick([]); }
      else setTimeout(()=>{ setFlip(new Set()); setPick([]); }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pick]);
  const tap = (i: number) => { if (flip.has(i)||done.has(i)||pick.length>=2) return; setFlip(new Set([...flip,i])); setPick([...pick,i]); };
  const won = done.size===g.length;
  return (
    <Panel>
      <Row>Moves {m} {won&&"· Cleared! 🎉"}</Row>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, maxWidth: 280, margin: "12px auto" }}>
        {g.map((e,i)=>{
          const shown = flip.has(i)||done.has(i);
          return <button key={i} onClick={()=>tap(i)} style={{ aspectRatio:"1", fontSize: 28, background: shown?"var(--vlc-bg-elevated)":"var(--vlc-accent-dim)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6, cursor:"pointer", opacity: done.has(i)?0.4:1 }}>{shown?e:""}</button>;
        })}
      </div>
      <Row style={{justifyContent:"center"}}><Btn onClick={()=>{setG(mk());setFlip(new Set());setDone(new Set());setPick([]);setM(0);}}>Restart</Btn></Row>
    </Panel>
  );
}
