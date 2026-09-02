import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, usePaletteRef, loadHigh, saveHigh } from "../_shared/GameShell";
const W = 400, H = 400;
export default function Orbit() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const palRef = usePaletteRef();
  const st = useRef({ a1: 0, a2: Math.PI, inner: true, danger: [] as number[], spawn: 0, score: 0, dead: false });
  const [score, setScore] = useState(0); const [dead, setDead] = useState(false);
  const [best, setBest] = useState(loadHigh("orbit-best"));
  const reset = () => { st.current = { a1: 0, a2: Math.PI, inner: true, danger: [], spawn: 0, score: 0, dead: false }; setScore(0); setDead(false); };
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.code === "Space") { if (st.current.dead) { reset(); return; } st.current.inner = !st.current.inner; } }; const c = (e: MouseEvent) => { if (st.current.dead) reset(); else st.current.inner = !st.current.inner; }; window.addEventListener("keydown", k); ref.current?.addEventListener("click", c); return () => { window.removeEventListener("keydown", k); ref.current?.removeEventListener("click", c); }; }, []);
  useRAFLoop((dt) => {
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d")!; const p = palRef.current; const s = st.current;
    if (!s.dead) {
      s.a1 += 0.002 * dt; s.a2 -= 0.0015 * dt;
      s.spawn -= dt; if (s.spawn <= 0) { s.spawn = 900; s.danger.push(Math.random() * Math.PI * 2); }
      s.danger.forEach((d, i) => { const r = s.inner ? 70 : 120; const cx = W / 2 + Math.cos(d) * r; const cy = H / 2 + Math.sin(d) * r; const px = W / 2 + Math.cos(s.a1) * r; const py = H / 2 + Math.sin(s.a1) * r; if ((cx - px) ** 2 + (cy - py) ** 2 < 200) { s.dead = true; setDead(true); if (s.score > best) { setBest(s.score); saveHigh("orbit-best", s.score); } } });
      s.score += dt * 0.01; setScore(Math.floor(s.score));
    }
    ctx.fillStyle = p.sunken; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = p.border; ctx.beginPath(); ctx.arc(W / 2, H / 2, 70, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(W / 2, H / 2, 120, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = p.warn; ctx.beginPath(); ctx.arc(W / 2, H / 2, 20, 0, Math.PI * 2); ctx.fill();
    s.danger.forEach((d) => { const r = s.inner ? 120 : 70; const dx = W / 2 + Math.cos(d) * r; const dy = H / 2 + Math.sin(d) * r; ctx.fillStyle = p.bad; ctx.beginPath(); ctx.arc(dx, dy, 8, 0, Math.PI * 2); ctx.fill(); });
    s.danger.slice(0, 100).forEach((d) => { const r = s.inner ? 70 : 120; const dx = W / 2 + Math.cos(d) * r; const dy = H / 2 + Math.sin(d) * r; ctx.fillStyle = p.bad; ctx.beginPath(); ctx.arc(dx, dy, 8, 0, Math.PI * 2); ctx.fill(); });
    const r = s.inner ? 70 : 120; const px = W / 2 + Math.cos(s.a1) * r; const py = H / 2 + Math.sin(s.a1) * r;
    ctx.fillStyle = p.accent; ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill();
    if (s.dead) { ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = p.fg; ctx.font = "bold 16px monospace"; ctx.textAlign = "center"; ctx.fillText("Crashed — click to retry", W / 2, H / 2); }
  }, []);
  return (<div><canvas ref={ref} width={W} height={H} style={{ display: "block", width: "100%", cursor: "pointer" }} /><GameStatusBar left={`Score: ${score}`} right={`Best: ${best} · Space/click to swap`} /></div>);
}
