import { useEffect, useRef, useState } from "react";
import { Panel, Btn } from "../_shared/ui";
import { usePaletteRef } from "../_shared/GameShell";

export default function Golf() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState(0);
  const [msg, setMsg] = useState("");
  const palRef = usePaletteRef();
  const ball = useRef({ x: 40, y: 200, vx: 0, vy: 0 });
  const hole = { x: 360, y: 200, r: 12 };
  const aim = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const c = cv.current!; const ctx = c.getContext("2d")!;
    let raf = 0;
    const loop = () => {
      ctx.fillStyle = "#2e7d32"; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle = "#1b5e20"; ctx.beginPath(); ctx.arc(hole.x,hole.y,hole.r,0,Math.PI*2); ctx.fill();
      const b = ball.current;
      b.x += b.vx; b.y += b.vy; b.vx *= 0.97; b.vy *= 0.97;
      if (b.x < 8 || b.x > c.width-8) b.vx *= -1;
      if (b.y < 8 || b.y > c.height-8) b.vy *= -1;
      if (Math.abs(b.vx) < 0.05) b.vx = 0; if (Math.abs(b.vy) < 0.05) b.vy = 0;
      if (Math.hypot(b.x-hole.x,b.y-hole.y) < hole.r && Math.abs(b.vx)+Math.abs(b.vy) < 1) setMsg(`🏌 In! ${strokes} strokes`);
      ctx.fillStyle = palRef.current.fg; ctx.beginPath(); ctx.arc(b.x,b.y,6,0,Math.PI*2); ctx.fill();
      if (aim.current) { ctx.strokeStyle = palRef.current.fg; ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(aim.current.x, aim.current.y); ctx.stroke(); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const dn = (e: PointerEvent) => { const r = c.getBoundingClientRect(); aim.current = { x: (e.clientX-r.left)*(c.width/r.width), y: (e.clientY-r.top)*(c.height/r.height) }; };
    const mv = (e: PointerEvent) => { if (aim.current) { const r = c.getBoundingClientRect(); aim.current = { x: (e.clientX-r.left)*(c.width/r.width), y: (e.clientY-r.top)*(c.height/r.height) }; } };
    const up = () => {
      if (!aim.current) return;
      const b = ball.current;
      b.vx = (b.x - aim.current.x) * 0.15; b.vy = (b.y - aim.current.y) * 0.15;
      setStrokes(s => s+1); aim.current = null;
    };
    c.addEventListener("pointerdown", dn); c.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    return () => { cancelAnimationFrame(raf); c.removeEventListener("pointerdown", dn); c.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
  }, [strokes]);

  return (
    <Panel>
      <canvas ref={cv} width={400} height={300} style={{ borderRadius: 6, display: "block", touchAction: "none" }} />
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <Btn onClick={() => { ball.current = { x: 40, y: 200, vx: 0, vy: 0 }; setStrokes(0); setMsg(""); }}>Reset</Btn>
        <span>Strokes: {strokes} {msg}</span>
      </div>
    </Panel>
  );
}
