import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";
type B = { x: number; y: number; r: number; life: number; max: number };
const W = 380, H = 360;
export default function CirclePop() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const palRef = usePaletteRef();
  const s = useRef({ balls: [] as B[], spawn: 0, score: 0, miss: 0 });
  const [score, setScore] = useState(0);
  const [miss, setMiss] = useState(0);
  const [best, setBest] = useState(loadHigh("circlepop-best"));
  useRAFLoop((dt) => {
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d")!; const p = palRef.current;
    const st = s.current; st.spawn -= dt;
    if (st.spawn <= 0) { st.spawn = Math.max(280, 900 - st.score * 8); const r = 14 + Math.random() * 22; st.balls.push({ x: r + Math.random() * (W - r * 2), y: r + Math.random() * (H - r * 2), r, life: 1600, max: 1600 }); }
    ctx.fillStyle = p.sunken; ctx.fillRect(0, 0, W, H);
    st.balls = st.balls.filter((b) => { b.life -= dt; if (b.life <= 0) { st.miss++; setMiss(st.miss); return false; } return true; });
    st.balls.forEach((b) => { const a = Math.max(0.15, b.life / b.max); ctx.globalAlpha = a; ctx.fillStyle = p.accent; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; });
  }, []);
  useEffect(() => { if (score > best) { setBest(score); saveHigh("circlepop-best", score); } }, [score, best]);
  const click = (e: React.MouseEvent) => {
    const c = ref.current!; const r = c.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (W / r.width), my = (e.clientY - r.top) * (H / r.height);
    const st = s.current; for (let i = st.balls.length - 1; i >= 0; i--) { const b = st.balls[i]; const dx = mx - b.x, dy = my - b.y; if (dx * dx + dy * dy <= b.r * b.r) { st.balls.splice(i, 1); st.score++; setScore(st.score); return; } }
  };
  return (<div><canvas ref={ref} width={W} height={H} onClick={click} style={{ display: "block", width: "100%", cursor: "crosshair" }} /><GameStatusBar left={`Score: ${score}`} right={`Miss: ${miss} · Best: ${best}`} /></div>);
}
