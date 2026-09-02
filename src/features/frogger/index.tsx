import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";
const W=400,H=300,LANE=30,LANES=8;
type Car = { x: number; lane: number; v: number; w: number };
const mkCars = (): Car[] => Array.from({length:14},(_,i)=>{ const lane = 1+(i%(LANES-2)); const dir = lane%2===0?1:-1; return { x: Math.random()*W, lane, v: dir*(0.6+Math.random()*1.4), w: 30+Math.random()*30 }; });
export default function Frogger() {
  const palRef = usePaletteRef();
  const ref = useRef<HTMLCanvasElement|null>(null);
  const s = useRef({ x: W/2, lane: LANES-1, cars: mkCars(), score: 0, dead: false });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadHigh("frog-best"));
  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      const st = s.current;
      if (st.dead) { if (e.code==="Space") reset(); return; }
      if (e.code==="ArrowUp") { e.preventDefault(); st.lane = Math.max(0, st.lane-1); if (st.lane===0) { st.score++; setScore(st.score); if(st.score>best){setBest(st.score);saveHigh("frog-best",st.score);} st.lane = LANES-1; } }
      else if (e.code==="ArrowDown") { e.preventDefault(); st.lane = Math.min(LANES-1, st.lane+1); }
      else if (e.code==="ArrowLeft") { e.preventDefault(); st.x = Math.max(15, st.x-20); }
      else if (e.code==="ArrowRight") { e.preventDefault(); st.x = Math.min(W-15, st.x+20); }
    };
    window.addEventListener("keydown", onKey); return ()=>window.removeEventListener("keydown", onKey);
  }, [best]);
  const reset = () => { s.current = { x: W/2, lane: LANES-1, cars: mkCars(), score: 0, dead: false }; setScore(0); };
  useRAFLoop(()=>{
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const st = s.current;
    if (!st.dead) {
      st.cars.forEach(c=>{ c.x += c.v; if (c.x>W+30) c.x=-30; if (c.x<-30) c.x=W+30; });
      const fy = st.lane*LANE+LANE/2;
      for (const c of st.cars) if (c.lane===st.lane && Math.abs(c.x-st.x)<c.w/2+10) st.dead = true;
      void fy;
    }
    ctx.fillStyle="#1a3a1a"; ctx.fillRect(0,0,W,H);
    for (let i=1;i<LANES-1;i++) { ctx.fillStyle=palRef.current.surface; ctx.fillRect(0,i*LANE,W,LANE); }
    ctx.fillStyle=palRef.current.warn; ctx.fillRect(0,0,W,LANE);
    st.cars.forEach(c=>{ ctx.fillStyle = c.v>0?palRef.current.bad:palRef.current.info; ctx.fillRect(c.x-c.w/2, c.lane*LANE+4, c.w, LANE-8); });
    ctx.fillStyle=palRef.current.good; ctx.beginPath(); ctx.arc(st.x, st.lane*LANE+LANE/2, 10, 0, Math.PI*2); ctx.fill();
    if (st.dead) { ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.fillRect(0,0,W,H); ctx.fillStyle=palRef.current.fg; ctx.font="bold 16px monospace"; ctx.textAlign="center"; ctx.fillText("Squashed — Space", W/2, H/2); }
  }, []);
  return (<div><canvas ref={ref} width={W} height={H} style={{display:"block",width:"100%"}}/><GameStatusBar left={`Crossings: ${score}`} right={`Best: ${best}`}/></div>);
}
