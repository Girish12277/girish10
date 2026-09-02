import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";
const W=420,H=300;
type A = { x: number; y: number; vx: number; vy: number; r: number };
type B = { x: number; y: number; vx: number; vy: number; t: number };
const keys = new Set<string>();
export default function Asteroids() {
  const palRef = usePaletteRef();
  const ref = useRef<HTMLCanvasElement|null>(null);
  const s = useRef({ x: W/2, y: H/2, a: 0, vx: 0, vy: 0, bul: [] as B[], ast: [] as A[], score: 0, dead: false, spawn: 0 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadHigh("ast-best"));
  useEffect(()=>{
    const kd = (e: KeyboardEvent) => { keys.add(e.code); if (e.code==="Space") { e.preventDefault(); const st=s.current; if (st.dead) reset(); else st.bul.push({ x: st.x, y: st.y, vx: Math.cos(st.a)*6+st.vx, vy: Math.sin(st.a)*6+st.vy, t: 0 }); } if (["ArrowUp","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault(); };
    const ku = (e: KeyboardEvent) => keys.delete(e.code);
    window.addEventListener("keydown",kd); window.addEventListener("keyup",ku);
    return ()=>{window.removeEventListener("keydown",kd);window.removeEventListener("keyup",ku);};
  }, []);
  const reset = () => { s.current = { x: W/2, y: H/2, a: 0, vx: 0, vy: 0, bul: [], ast: [], score: 0, dead: false, spawn: 0 }; setScore(0); };
  useRAFLoop((dt)=>{
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const st = s.current;
    if (!st.dead) {
      if (keys.has("ArrowLeft")) st.a -= 0.08;
      if (keys.has("ArrowRight")) st.a += 0.08;
      if (keys.has("ArrowUp")) { st.vx += Math.cos(st.a)*0.15; st.vy += Math.sin(st.a)*0.15; }
      st.vx*=0.99; st.vy*=0.99; st.x = (st.x+st.vx+W)%W; st.y = (st.y+st.vy+H)%H;
      st.bul.forEach(b=>{ b.x=(b.x+b.vx+W)%W; b.y=(b.y+b.vy+H)%H; b.t+=dt; });
      st.bul = st.bul.filter(b=>b.t<1000);
      st.spawn += dt; if (st.spawn>2000 && st.ast.length<6) { st.spawn=0; const side=Math.floor(Math.random()*4); st.ast.push({ x: side<2?0:W, y: side%2===0?0:H, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, r: 18+Math.random()*12 }); }
      st.ast.forEach(a=>{ a.x=(a.x+a.vx+W)%W; a.y=(a.y+a.vy+H)%H; });
      for (let i=st.ast.length-1;i>=0;i--) {
        const a = st.ast[i];
        for (let j=st.bul.length-1;j>=0;j--) { const b = st.bul[j]; if (Math.hypot(a.x-b.x,a.y-b.y)<a.r) { st.ast.splice(i,1); st.bul.splice(j,1); st.score+=10; setScore(st.score); if(st.score>best){setBest(st.score);saveHigh("ast-best",st.score);} break; } }
        if (st.ast[i] && Math.hypot(a.x-st.x,a.y-st.y)<a.r+8) st.dead = true;
      }
    }
    ctx.fillStyle=palRef.current.sunken; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=palRef.current.good; ctx.lineWidth=2; ctx.beginPath();
    ctx.moveTo(st.x+Math.cos(st.a)*12, st.y+Math.sin(st.a)*12);
    ctx.lineTo(st.x+Math.cos(st.a+2.5)*10, st.y+Math.sin(st.a+2.5)*10);
    ctx.lineTo(st.x+Math.cos(st.a-2.5)*10, st.y+Math.sin(st.a-2.5)*10);
    ctx.closePath(); ctx.stroke();
    ctx.fillStyle=palRef.current.fg; st.bul.forEach(b=>{ ctx.fillRect(b.x-1,b.y-1,2,2); });
    ctx.strokeStyle="#aaa"; st.ast.forEach(a=>{ ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2); ctx.stroke(); });
    if (st.dead) { ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.fillRect(0,0,W,H); ctx.fillStyle=palRef.current.fg; ctx.font="bold 16px monospace"; ctx.textAlign="center"; ctx.fillText("Destroyed — Space to restart", W/2, H/2); }
  },[]);
  return (<div><canvas ref={ref} width={W} height={H} style={{display:"block",width:"100%"}}/><GameStatusBar left={`Score: ${score}`} right={`Best: ${best} · ←→ rotate, ↑ thrust, Space fire`}/></div>);
}
