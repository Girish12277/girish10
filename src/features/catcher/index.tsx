import { useEffect, useRef, useState } from "react";
import { Panel } from "../_shared/ui";

export default function Catcher() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const c = cv.current!; const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    let px = W/2, raf = 0;
    let drops: {x:number;y:number;v:number}[] = [];
    let spawn = 0, s = 0;
    const onMove = (e: PointerEvent) => { const r = c.getBoundingClientRect(); px = (e.clientX - r.left) * (W / r.width); };
    c.addEventListener("pointermove", onMove);
    const loop = () => {
      ctx.fillStyle = "#111"; ctx.fillRect(0,0,W,H);
      if (++spawn > 30) { spawn = 0; drops.push({ x: Math.random()*W, y: 0, v: 2 + Math.random()*3 }); }
      drops.forEach(d => { d.y += d.v; });
      ctx.fillStyle = "#ffb300"; drops.forEach(d => { ctx.beginPath(); ctx.arc(d.x,d.y,8,0,Math.PI*2); ctx.fill(); });
      ctx.fillStyle = "#42a5f5"; ctx.fillRect(px - 40, H - 16, 80, 10);
      drops = drops.filter(d => {
        if (d.y > H - 16 && Math.abs(d.x - px) < 44) { s++; setScore(s); return false; }
        return d.y < H;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); c.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <Panel>
      <canvas ref={cv} width={360} height={360} style={{ background: "#111", borderRadius: 6, display: "block" }} />
      <div style={{ marginTop: 8 }}>Score: {score}</div>
    </Panel>
  );
}
