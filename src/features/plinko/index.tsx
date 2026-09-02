import { useEffect, useRef, useState } from "react";
import { Panel, Btn } from "../_shared/ui";

export default function Plinko() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const balls = useRef<{x:number;y:number;vx:number;vy:number}[]>([]);

  useEffect(() => {
    const c = cv.current!; const ctx = c.getContext("2d")!;
    let raf = 0;
    const W = c.width, H = c.height;
    const pegs: [number,number][] = [];
    for (let r = 0; r < 8; r++) for (let i = 0; i <= r; i++) pegs.push([W/2 + (i - r/2)*30, 40 + r*32]);
    const slots = [10,5,2,1,2,5,10];

    const loop = () => {
      ctx.fillStyle = "#111"; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = "#888"; pegs.forEach(([x,y]) => { ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); });
      ctx.fillStyle = "#444"; ctx.font = "12px monospace";
      for (let i = 0; i < slots.length; i++) ctx.fillText(`x${slots[i]}`, (W/slots.length)*i + 8, H - 6);
      balls.current.forEach(b => {
        b.vy += 0.25; b.x += b.vx; b.y += b.vy;
        pegs.forEach(([x,y]) => {
          const dx = b.x - x, dy = b.y - y, d = Math.hypot(dx,dy);
          if (d < 7) { b.vx = dx/d * 2 + (Math.random()-0.5); b.vy = -Math.abs(b.vy)*0.5; }
        });
        ctx.fillStyle = "#ffb300"; ctx.beginPath(); ctx.arc(b.x,b.y,5,0,Math.PI*2); ctx.fill();
      });
      balls.current = balls.current.filter(b => {
        if (b.y > H - 20) { const slot = Math.min(slots.length-1, Math.floor(b.x / (W/slots.length))); setScore(s => s + slots[slot]); return false; }
        return true;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Panel>
      <canvas ref={cv} width={300} height={360} style={{ background: "#111", borderRadius: 6, display: "block", margin: "0 auto" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Btn onClick={() => balls.current.push({ x: 150 + (Math.random()-0.5)*20, y: 10, vx: 0, vy: 0 })}>Drop</Btn>
        <span>Score: {score}</span>
      </div>
    </Panel>
  );
}
