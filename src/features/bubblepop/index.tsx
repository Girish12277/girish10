import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";
const W=380,H=300;
type B = { x: number; y: number; r: number; vy: number; c: string };
const FALLBACK = ["#ef4444","#22c55e","#3b82f6","#facc15","#a855f7","#ec4899"];
const mkB = (colors: string[]): B => ({ x: 20+Math.random()*(W-40), y: H+20, r: 14+Math.random()*16, vy: -1-Math.random()*1.5, c: colors[Math.floor(Math.random()*colors.length)] });
export default function BubblePop() {
  const palRef = usePaletteRef();
  const ref = useRef<HTMLCanvasElement|null>(null);
  const s = useRef({ b: [] as B[], spawn: 0, score: 0, miss: 0, dead: false });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadHigh("bub-best"));
  useEffect(()=>{
    const c = ref.current; if (!c) return;
    const click = (e: MouseEvent) => {
      const st = s.current;
      if (st.dead) { reset(); return; }
      const r = c.getBoundingClientRect(); const mx = ((e.clientX-r.left)/r.width)*W, my = ((e.clientY-r.top)/r.height)*H;
      for (let i=st.b.length-1;i>=0;i--) { const b = st.b[i]; if (Math.hypot(b.x-mx,b.y-my)<b.r) { st.b.splice(i,1); st.score++; setScore(st.score); if(st.score>best){setBest(st.score);saveHigh("bub-best",st.score);} break; } }
    };
    c.addEventListener("click", click); return ()=>c.removeEventListener("click", click);
  }, [best]);
  const reset = () => { s.current = { b: [], spawn: 0, score: 0, miss: 0, dead: false }; setScore(0); };
  useRAFLoop((dt)=>{
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const st = s.current;
    if (!st.dead) {
      const pal = palRef.current; const cols = [pal.bad, pal.good, pal.info, pal.warn, "#a855f7", "#ec4899"];
      st.spawn += dt; if (st.spawn>500) { st.spawn = 0; st.b.push(mkB(cols)); }
      st.b.forEach(b=>b.y+=b.vy);
      const before = st.b.length;
      st.b = st.b.filter(b=>b.y+b.r>0);
      st.miss += before - st.b.length;
      if (st.miss>=8) st.dead = true;
    }
    ctx.fillStyle="#0a1428"; ctx.fillRect(0,0,W,H);
    st.b.forEach(b=>{ ctx.fillStyle=b.c; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); ctx.strokeStyle="rgba(255,255,255,0.4)"; ctx.lineWidth=2; ctx.stroke(); });
    if (st.dead) { ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.fillRect(0,0,W,H); ctx.fillStyle=palRef.current.fg; ctx.font="bold 16px monospace"; ctx.textAlign="center"; ctx.fillText("Click to restart", W/2, H/2); }
  }, []);
  return (<div><canvas ref={ref} width={W} height={H} style={{display:"block",width:"100%",cursor:"crosshair"}}/><GameStatusBar left={`Popped: ${score}`} right={`Best: ${best} · Miss: ${s.current.miss}/8`}/></div>);
}
