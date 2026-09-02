import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";
const W=400,H=320,GAP=90;
type Pipe = { x: number; y: number; passed: boolean };
export default function Flappy() {
  const palRef = usePaletteRef();
  const ref = useRef<HTMLCanvasElement|null>(null);
  const s = useRef({ y: H/2, v: 0, pipes: [] as Pipe[], spawn: 0, score: 0, dead: false, started: false });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadHigh("flappy-best"));
  const flap = () => { if (s.current.dead) reset(); else { s.current.started = true; s.current.v = -6; } };
  const reset = () => { s.current = { y: H/2, v: 0, pipes: [], spawn: 0, score: 0, dead: false, started: false }; setScore(0); };
  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => { if (e.code==="Space") { e.preventDefault(); flap(); } };
    window.addEventListener("keydown", onKey); return ()=>window.removeEventListener("keydown", onKey);
  }, []);
  useRAFLoop((dt)=>{
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const st = s.current;
    if (st.started && !st.dead) {
      st.v += 0.35; st.y += st.v;
      st.spawn += dt; if (st.spawn>1500) { st.spawn = 0; st.pipes.push({ x: W, y: 40+Math.random()*(H-GAP-80), passed: false }); }
      st.pipes.forEach(p=>p.x-=2);
      st.pipes = st.pipes.filter(p=>p.x>-50);
      for (const p of st.pipes) {
        if (!p.passed && p.x+30<60) { p.passed=true; st.score++; setScore(st.score); if (st.score>best){setBest(st.score);saveHigh("flappy-best",st.score);} }
        if (p.x<80 && p.x>20 && (st.y<p.y || st.y>p.y+GAP)) st.dead=true;
      }
      if (st.y<0||st.y>H) st.dead=true;
    }
    ctx.fillStyle="#4dc1f0"; ctx.fillRect(0,0,W,H);
    ctx.fillStyle=palRef.current.good;
    st.pipes.forEach(p=>{ ctx.fillRect(p.x,0,30,p.y); ctx.fillRect(p.x,p.y+GAP,30,H-p.y-GAP); });
    ctx.fillStyle=palRef.current.warn; ctx.beginPath(); ctx.arc(60, st.y, 12, 0, Math.PI*2); ctx.fill();
    if (!st.started) { ctx.fillStyle=palRef.current.fg; ctx.font="bold 16px monospace"; ctx.textAlign="center"; ctx.fillText("Space / Click to flap", W/2, H/2); }
    if (st.dead) { ctx.fillStyle="rgba(0,0,0,0.55)"; ctx.fillRect(0,0,W,H); ctx.fillStyle=palRef.current.fg; ctx.font="bold 18px monospace"; ctx.textAlign="center"; ctx.fillText("Game Over — Space/Click", W/2, H/2); }
  },[]);
  return (<div onClick={flap}><canvas ref={ref} width={W} height={H} style={{display:"block",width:"100%",cursor:"pointer"}}/><GameStatusBar left={`Score: ${score}`} right={`Best: ${best}`}/></div>);
}
