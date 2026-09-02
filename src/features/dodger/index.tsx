import { useEffect, useRef, useState } from "react";
import { Panel } from "../_shared/ui";
import { usePaletteRef } from "../_shared/GameShell";

export default function Dodger() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const palRef = usePaletteRef();

  useEffect(() => {
    const c = cv.current!; const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    let px = W/2, py = H - 40, raf = 0, t = 0, alive = true, s = 0;
    let obs: {x:number;y:number;v:number}[] = [];
    const keys: Record<string, boolean> = {};
    const kd = (e: KeyboardEvent) => { keys[e.key] = true; };
    const ku = (e: KeyboardEvent) => { keys[e.key] = false; };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const loop = () => {
      if (!alive) return;
      ctx.fillStyle = "#111"; ctx.fillRect(0,0,W,H);
      if (keys.ArrowLeft || keys.a) px -= 4;
      if (keys.ArrowRight || keys.d) px += 4;
      px = Math.max(10, Math.min(W-10, px));
      if (++t % 20 === 0) obs.push({ x: Math.random()*W, y: -10, v: 2 + Math.random()*3 + s*0.01 });
      obs.forEach(o => o.y += o.v);
      ctx.fillStyle = "#e53935"; obs.forEach(o => { ctx.fillRect(o.x-8, o.y-8, 16, 16); });
      ctx.fillStyle = "#42a5f5"; ctx.beginPath(); ctx.arc(px,py,10,0,Math.PI*2); ctx.fill();
      for (const o of obs) if (Math.abs(o.x-px) < 18 && Math.abs(o.y-py) < 18) { alive = false; ctx.fillStyle = palRef.current.fg; ctx.font = "24px sans-serif"; ctx.fillText("Game Over", W/2-60, H/2); return; }
      obs = obs.filter(o => o.y < H + 20);
      s++; setScore(Math.floor(s/10));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, []);

  return (
    <Panel>
      <canvas ref={cv} width={360} height={420} style={{ background: "#111", borderRadius: 6, display: "block" }} />
      <div style={{ marginTop: 8 }}>← → / A D · Score: {score}</div>
    </Panel>
  );
}
