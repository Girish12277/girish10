import { useEffect, useRef, useState } from "react";
import { Panel } from "../_shared/ui";

export default function BalloonPop() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const c = cv.current!; const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    type B = { x:number;y:number;r:number;v:number;col:string };
    let balls: B[] = []; let spawn = 0; let raf = 0; let s = 0;
    const colors = ["#e53935","#fb8c00","#fdd835","#43a047","#1e88e5","#8e24aa"];
    const click = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) * (W / r.width), y = (e.clientY - r.top) * (H / r.height);
      balls = balls.filter(b => { if (Math.hypot(b.x-x,b.y-y) < b.r) { s++; setScore(s); return false; } return true; });
    };
    c.addEventListener("pointerdown", click);
    const loop = () => {
      ctx.fillStyle = "#0a1929"; ctx.fillRect(0,0,W,H);
      if (++spawn > 25) { spawn = 0; balls.push({ x: Math.random()*W, y: H+20, r: 14+Math.random()*16, v: 1+Math.random()*1.5, col: colors[Math.floor(Math.random()*colors.length)] }); }
      balls.forEach(b => b.y -= b.v);
      balls = balls.filter(b => b.y > -30);
      balls.forEach(b => { ctx.fillStyle = b.col; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); c.removeEventListener("pointerdown", click); };
  }, []);

  return (
    <Panel>
      <canvas ref={cv} width={380} height={420} style={{ background: "#0a1929", borderRadius: 6, display: "block", touchAction: "none" }} />
      <div style={{ marginTop: 8 }}>Pop them! Score: {score}</div>
    </Panel>
  );
}
