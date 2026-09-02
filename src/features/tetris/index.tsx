import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";
const COLS=10,ROWS=20,CELL=18;
const W=COLS*CELL, H=ROWS*CELL;
const SHAPES: number[][][] = [
  [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]], [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]]
];
const COLORS = ["#22d3ee","#facc15","#a78bfa","#3b82f6","#fb923c","#22c55e","#ef4444"];
type Piece = { x: number; y: number; m: number[][]; c: number };
const newPiece = (): Piece => { const i = Math.floor(Math.random()*SHAPES.length); return { x: 3, y: 0, m: SHAPES[i].map(r=>[...r]), c: i }; };
const rotate = (m: number[][]) => m[0].map((_,i)=>m.map(r=>r[i]).reverse());
function collide(g: number[][], p: Piece) { for (let r=0;r<p.m.length;r++) for (let c=0;c<p.m[r].length;c++) if (p.m[r][c]) { const x=p.x+c, y=p.y+r; if (x<0||x>=COLS||y>=ROWS) return true; if (y>=0&&g[y][x]) return true; } return false; }
function merge(g: number[][], p: Piece) { p.m.forEach((row,r)=>row.forEach((v,c)=>{ if(v){const y=p.y+r;if(y>=0)g[y][p.x+c]=p.c+1;} })); }
export default function Tetris() {
  const ref = useRef<HTMLCanvasElement|null>(null);
  const palRef = usePaletteRef();
  const s = useRef({ g: Array.from({length:ROWS},()=>Array(COLS).fill(0)), p: newPiece(), acc: 0, step: 500, score: 0, dead: false });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadHigh("tetris-best"));
  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      const st = s.current; if (st.dead) { if (e.code==="Space") { st.g = Array.from({length:ROWS},()=>Array(COLS).fill(0)); st.p = newPiece(); st.score=0; st.dead=false; setScore(0); } return; }
      const p = st.p;
      if (e.code==="ArrowLeft") { e.preventDefault(); const np = {...p,x:p.x-1}; if (!collide(st.g,np)) st.p=np; }
      else if (e.code==="ArrowRight") { e.preventDefault(); const np = {...p,x:p.x+1}; if (!collide(st.g,np)) st.p=np; }
      else if (e.code==="ArrowDown") { e.preventDefault(); const np = {...p,y:p.y+1}; if (!collide(st.g,np)) st.p=np; }
      else if (e.code==="ArrowUp") { e.preventDefault(); const np = {...p,m:rotate(p.m)}; if (!collide(st.g,np)) st.p=np; }
      else if (e.code==="Space") { e.preventDefault(); while (!collide(st.g,{...p,y:p.y+1})) p.y++; }
    };
    window.addEventListener("keydown", onKey); return ()=>window.removeEventListener("keydown", onKey);
  }, []);
  useRAFLoop((dt)=>{
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const st = s.current;
    if (!st.dead) {
      st.acc += dt;
      if (st.acc>=st.step) {
        st.acc = 0;
        const np = {...st.p, y: st.p.y+1};
        if (collide(st.g, np)) {
          merge(st.g, st.p);
          let cleared = 0;
          for (let r=ROWS-1;r>=0;r--) if (st.g[r].every(v=>v)) { st.g.splice(r,1); st.g.unshift(Array(COLS).fill(0)); cleared++; r++; }
          if (cleared) { st.score += [0,40,100,300,1200][cleared]; setScore(st.score); if(st.score>best){setBest(st.score);saveHigh("tetris-best",st.score);} st.step = Math.max(80, 500-Math.floor(st.score/500)*40); }
          st.p = newPiece();
          if (collide(st.g, st.p)) st.dead = true;
        } else st.p = np;
      }
    }
    const pal = palRef.current;
    ctx.fillStyle=pal.sunken; ctx.fillRect(0,0,W,H);
    for (let r=0;r<ROWS;r++) for (let cc=0;cc<COLS;cc++) if (st.g[r][cc]) { ctx.fillStyle=COLORS[st.g[r][cc]-1]; ctx.fillRect(cc*CELL+1,r*CELL+1,CELL-2,CELL-2); }
    st.p.m.forEach((row,r)=>row.forEach((v,cc)=>{ if(v){ ctx.fillStyle=COLORS[st.p.c]; ctx.fillRect((st.p.x+cc)*CELL+1,(st.p.y+r)*CELL+1,CELL-2,CELL-2); }}));
    if (st.dead) { ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.fillRect(0,0,W,H); ctx.fillStyle=pal.fg; ctx.font="bold 16px monospace"; ctx.textAlign="center"; ctx.fillText("Game Over — Space", W/2, H/2); }
  },[]);
  return (<div><canvas ref={ref} width={W} height={H} style={{display:"block",margin:"0 auto"}} tabIndex={0}/><GameStatusBar left={`Score: ${score}`} right={`Best: ${best}`}/></div>);
}
