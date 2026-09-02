import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";
const W=400,H=300;
type E = { x: number; y: number; alive: boolean };
const mk = (): E[] => { const a: E[] = []; for (let r=0;r<4;r++) for (let c=0;c<8;c++) a.push({ x: 20+c*44, y: 20+r*28, alive: true }); return a; };
const keys = new Set<string>();
export default function Invaders() {
  const palRef = usePaletteRef();
  const ref = useRef<HTMLCanvasElement|null>(null);
  const s = useRef({ px: W/2, bul: [] as {x:number;y:number}[], eb: [] as {x:number;y:number}[], en: mk(), dir: 1, drop: 0, score: 0, dead: false, ft: 0 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadHigh("inv-best"));
  useEffect(()=>{
    const kd = (e: KeyboardEvent) => { keys.add(e.code); if (e.code==="Space") { e.preventDefault(); const st=s.current; if (st.dead) reset(); else if (st.ft<=0) { st.bul.push({ x: st.px, y: H-30 }); st.ft=300; } } if (e.code.startsWith("Arrow")) e.preventDefault(); };
    const ku = (e: KeyboardEvent) => keys.delete(e.code);
    window.addEventListener("keydown",kd); window.addEventListener("keyup",ku);
    return ()=>{window.removeEventListener("keydown",kd);window.removeEventListener("keyup",ku);};
  }, []);
  const reset = () => { s.current = { px:W/2,bul:[],eb:[],en:mk(),dir:1,drop:0,score:0,dead:false,ft:0 }; setScore(0); };
  useRAFLoop((dt)=>{
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const st = s.current;
    if (!st.dead) {
      st.ft -= dt;
      if (keys.has("ArrowLeft")) st.px = Math.max(15, st.px-4);
      if (keys.has("ArrowRight")) st.px = Math.min(W-15, st.px+4);
      st.bul.forEach(b=>b.y-=6); st.bul = st.bul.filter(b=>b.y>0);
      let edge = false; st.en.forEach(e=>{ if (!e.alive) return; e.x += st.dir*0.4; if (e.x<10||e.x>W-10) edge=true; });
      if (edge) { st.dir*=-1; st.en.forEach(e=>e.y+=8); }
      st.eb.forEach(b=>b.y+=3); st.eb = st.eb.filter(b=>b.y<H);
      if (Math.random()<0.02) { const alive = st.en.filter(e=>e.alive); if (alive.length) { const e = alive[Math.floor(Math.random()*alive.length)]; st.eb.push({ x: e.x, y: e.y }); } }
      for (const b of st.bul) for (const e of st.en) if (e.alive && Math.abs(b.x-e.x)<14 && Math.abs(b.y-e.y)<10) { e.alive=false; b.y=-99; st.score+=10; setScore(st.score); if(st.score>best){setBest(st.score);saveHigh("inv-best",st.score);} }
      for (const b of st.eb) { if (Math.abs(b.x-st.px)<14 && Math.abs(b.y-(H-20))<10) st.dead = true; }
      if (st.en.every(e=>!e.alive)) st.en = mk();
    }
    ctx.fillStyle=palRef.current.sunken; ctx.fillRect(0,0,W,H);
    ctx.fillStyle=palRef.current.good; st.en.forEach(e=>{ if (e.alive) ctx.fillRect(e.x-12,e.y-8,24,16); });
    ctx.fillStyle=palRef.current.fg; ctx.fillRect(st.px-14,H-22,28,8); ctx.fillRect(st.px-3,H-30,6,10);
    ctx.fillStyle="#ff6b9d"; st.bul.forEach(b=>ctx.fillRect(b.x-1,b.y,2,8));
    ctx.fillStyle=palRef.current.warn; st.eb.forEach(b=>ctx.fillRect(b.x-1,b.y,2,8));
    if (st.dead) { ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.fillRect(0,0,W,H); ctx.fillStyle=palRef.current.fg; ctx.font="bold 16px monospace"; ctx.textAlign="center"; ctx.fillText("Game Over — Space", W/2, H/2); }
  }, []);
  return (<div><canvas ref={ref} width={W} height={H} style={{display:"block",width:"100%"}}/><GameStatusBar left={`Score: ${score}`} right={`Best: ${best}`}/></div>);
}
