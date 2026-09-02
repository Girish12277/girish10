import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, usePaletteRef } from "../_shared/GameShell";
const W=420, H=280;
export default function Pong() {
  const palRef = usePaletteRef();
  const ref = useRef<HTMLCanvasElement|null>(null);
  const s = useRef({ py: H/2, ay: H/2, bx: W/2, by: H/2, vx: 4, vy: 3, score: 0, ai: 0 });
  const [score, setScore] = useState(0);
  const [ai, setAi] = useState(0);
  useEffect(()=>{
    const c = ref.current; if (!c) return;
    const move = (e: MouseEvent) => { const r = c.getBoundingClientRect(); s.current.py = ((e.clientY-r.top)/r.height)*H; };
    c.addEventListener("mousemove", move);
    return () => c.removeEventListener("mousemove", move);
  }, []);
  useRAFLoop(()=>{
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const st = s.current;
    st.bx += st.vx; st.by += st.vy;
    if (st.by<5||st.by>H-5) st.vy*=-1;
    if (st.bx<20 && Math.abs(st.by-st.py)<35) { st.vx = Math.abs(st.vx)*1.04; st.vy += (st.by-st.py)*0.04; }
    if (st.bx>W-20 && Math.abs(st.by-st.ay)<35) { st.vx = -Math.abs(st.vx)*1.04; }
    if (st.bx<0) { st.ai++; setAi(st.ai); st.bx=W/2;st.by=H/2;st.vx=4;st.vy=3; }
    if (st.bx>W) { st.score++; setScore(st.score); st.bx=W/2;st.by=H/2;st.vx=-4;st.vy=3; }
    st.ay += Math.sign(st.by-st.ay) * Math.min(3.5, Math.abs(st.by-st.ay));
    ctx.fillStyle="#0a0a14"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=palRef.current.elevated; ctx.setLineDash([6,8]); ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=palRef.current.good; ctx.fillRect(8, st.py-35, 8, 70);
    ctx.fillStyle="#ff6b9d"; ctx.fillRect(W-16, st.ay-35, 8, 70);
    ctx.fillStyle=palRef.current.fg; ctx.beginPath(); ctx.arc(st.bx, st.by, 5, 0, Math.PI*2); ctx.fill();
  }, []);
  return (<div><canvas ref={ref} width={W} height={H} style={{ display:"block", width:"100%", background:"#0a0a14", cursor:"none" }}/><GameStatusBar left={`You: ${score}`} right={`CPU: ${ai}`}/></div>);
}
