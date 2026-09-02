import { useEffect, useRef, useState } from "react";
import { Btn, Panel, Row, loadNum, saveNum } from "../_shared/ui";
const COLORS = ["var(--vlc-bad, #ef4444)", "var(--vlc-good, #22c55e)", "var(--vlc-info, #3b82f6)", "var(--vlc-warn, #eab308)"];
export default function Simon() {
  const [seq, setSeq] = useState<number[]>([]);
  const [pi, setPi] = useState(0);
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [show, setShow] = useState(false);
  const [best, setBest] = useState(loadNum("simon-best"));
  const t = useRef<number[]>([]);
  const playSeq = (s: number[]) => {
    setShow(true); t.current.forEach(clearTimeout); t.current = [];
    s.forEach((n,i)=>{
      t.current.push(window.setTimeout(()=>setActive(n), i*600+100));
      t.current.push(window.setTimeout(()=>setActive(-1), i*600+450));
    });
    t.current.push(window.setTimeout(()=>{ setShow(false); setPi(0); }, s.length*600+200));
  };
  const start = () => { const s = [Math.floor(Math.random()*4)]; setSeq(s); setPlaying(true); setPi(0); playSeq(s); };
  const press = (n: number) => {
    if (!playing||show) return;
    setActive(n); setTimeout(()=>setActive(-1), 200);
    if (seq[pi]!==n) { setPlaying(false); if(seq.length-1>best){setBest(seq.length-1);saveNum("simon-best",seq.length-1);} return; }
    if (pi+1>=seq.length) { const ns = [...seq, Math.floor(Math.random()*4)]; setSeq(ns); setTimeout(()=>playSeq(ns), 600); }
    else setPi(p=>p+1);
  };
  useEffect(()=>()=>{ t.current.forEach(clearTimeout); }, []);
  return (
    <Panel>
      <Row>Level {seq.length} · Best {best} {!playing&&seq.length>0&&"· Game Over"}</Row>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 280, margin: "12px auto" }}>
        {COLORS.map((c,i)=>(<button key={i} onClick={()=>press(i)} style={{ aspectRatio:"1", background: c, opacity: active===i?1:0.45, border:"none", borderRadius:8, cursor:"pointer", transition:"opacity 100ms" }}/>))}
      </div>
      <Row style={{ justifyContent: "center" }}><Btn onClick={start}>{playing?"Restart":"Start"}</Btn></Row>
    </Panel>
  );
}
