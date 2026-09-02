import { useEffect, useRef, useState } from "react";
import { Btn, Panel, Row, loadNum, saveNum } from "../_shared/ui";
export default function WhackMole() {
  const [pos, setPos] = useState(-1);
  const [score, setScore] = useState(0);
  const [t, setT] = useState(30);
  const [run, setRun] = useState(false);
  const [best, setBest] = useState(loadNum("whack-best"));
  const ref = useRef<number|undefined>(undefined);
  useEffect(()=>{
    if (!run) return;
    const move = () => setPos(Math.floor(Math.random()*9));
    ref.current = window.setInterval(move, 750);
    const tk = window.setInterval(()=>setT(x=>{if(x<=1){setRun(false);return 0;}return x-1;}), 1000);
    return () => { window.clearInterval(ref.current); window.clearInterval(tk); };
  }, [run]);
  useEffect(()=>{ if(!run&&score>best){setBest(score);saveNum("whack-best",score);} }, [run,score,best]);
  const hit = (i: number) => { if (i===pos&&run) { setScore(s=>s+1); setPos(-1); } };
  const start = () => { setScore(0); setT(30); setRun(true); };
  return (
    <Panel>
      <Row>Score {score} · Time {t}s · Best {best}</Row>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: 6, maxWidth: 280, margin: "12px auto" }}>
        {Array.from({length:9}).map((_,i)=>(
          <button key={i} onClick={()=>hit(i)} style={{ aspectRatio:"1", fontSize: 36, background:"#3d2817", border:"2px solid #5a3a20", borderRadius:"50%", cursor:"pointer" }}>{pos===i?"🐹":""}</button>
        ))}
      </div>
      <Row style={{ justifyContent: "center" }}><Btn onClick={start}>{run?"Restart":"Start"}</Btn></Row>
    </Panel>
  );
}
