import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, usePaletteRef } from "../_shared/GameShell";
const W=420,H=320,BW=42,BH=14,ROWS=5,COLS=8;
type B = { x: number; y: number; alive: boolean };
const mk = (): B[] => { const a: B[] = []; for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) a.push({x:10+c*(BW+4),y:30+r*(BH+4),alive:true}); return a; };
export default function Breakout() {
  const palRef = usePaletteRef();
  const ref = useRef<HTMLCanvasElement|null>(null);
  const s = useRef({ px: W/2, bx: W/2, by: H-30, vx: 3, vy: -3, bricks: mk(), score: 0, dead: false });
  const [score, setScore] = useState(0);
  useEffect(()=>{
    const c = ref.current; if (!c) return;
    const m = (e: MouseEvent) => { const r=c.getBoundingClientRect(); s.current.px = ((e.clientX-r.left)/r.width)*W; };
    c.addEventListener("mousemove",m); return ()=>c.removeEventListener("mousemove",m);
  },[]);
  useRAFLoop(()=>{
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const st = s.current;
    if (!st.dead) {
      st.bx+=st.vx; st.by+=st.vy;
      if (st.bx<5||st.bx>W-5) st.vx*=-1;
      if (st.by<5) st.vy*=-1;
      if (st.by>H-20 && Math.abs(st.bx-st.px)<40) { st.vy = -Math.abs(st.vy); st.vx += (st.bx-st.px)*0.05; }
      if (st.by>H) st.dead = true;
      for (const b of st.bricks) if (b.alive && st.bx>b.x && st.bx<b.x+BW && st.by>b.y && st.by<b.y+BH) { b.alive=false; st.vy*=-1; st.score++; setScore(st.score); break; }
      if (st.bricks.every(b=>!b.alive)) { st.bricks = mk(); st.vx*=1.1; st.vy*=1.1; }
    }
    ctx.fillStyle="#0a0a14"; ctx.fillRect(0,0,W,H);
    st.bricks.forEach((b,i)=>{ if(!b.alive) return; ctx.fillStyle = [palRef.current.bad,"#f59e0b","#eab308",palRef.current.good,palRef.current.info][Math.floor(i/COLS)]; ctx.fillRect(b.x,b.y,BW,BH); });
    ctx.fillStyle=palRef.current.fg; ctx.fillRect(st.px-40, H-12, 80, 8);
    ctx.beginPath(); ctx.arc(st.bx,st.by,5,0,Math.PI*2); ctx.fill();
    if (st.dead) { ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.fillRect(0,0,W,H); ctx.fillStyle=palRef.current.fg; ctx.font="bold 18px monospace"; ctx.textAlign="center"; ctx.fillText("Game Over — click to restart", W/2, H/2); }
  },[]);
  const reset = () => { s.current = { px:W/2,bx:W/2,by:H-30,vx:3,vy:-3,bricks:mk(),score:0,dead:false }; setScore(0); };
  return (<div onClick={()=>s.current.dead&&reset()}><canvas ref={ref} width={W} height={H} style={{display:"block",width:"100%",cursor:"none"}}/><GameStatusBar left={`Score: ${score}`}/></div>);
}
