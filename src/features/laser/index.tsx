import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, usePaletteRef, loadHigh, saveHigh } from "../_shared/GameShell";
const W = 440, H = 280;
export default function Laser() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const palRef = usePaletteRef();
  const st = useRef({ angle: 0, charge: 0, dead: false, score: 0, obstacles: [] as { x: number; y: number; w: number; h: number }[], spawn: 0 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadHigh("laser-best"));
  const [dead, setDead] = useState(false);
  const reset = () => { st.current = { angle: 0, charge: 0, dead: false, score: 0, obstacles: [], spawn: 0 }; setScore(0); setDead(false); };
  useEffect(() => { const k = (e: KeyboardEvent) => { if (st.current.dead && e.code === "Enter") reset(); if (e.code === "Space") st.current.charge = 1; }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  useRAFLoop((dt) => {
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d")!; const p = palRef.current; const s = st.current;
    if (!s.dead) {
      s.angle += 0.0015 * dt;
      s.spawn -= dt; if (s.spawn <= 0) { s.spawn = 700; s.obstacles.push({ x: W, y: 30 + Math.random() * (H - 60), w: 20 + Math.random() * 30, h: 20 + Math.random() * 30 }); }
      s.obstacles = s.obstacles.filter((o) => { o.x -= 0.12 * dt; if (o.x + o.w < 0) { s.score++; setScore(s.score); return false; } return true; });
      const cx = 30, cy = H / 2;
      if (s.charge > 0) {
        const dx = Math.cos(s.angle), dy = Math.sin(s.angle);
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const o = s.obstacles[i]; let tx = cx, ty = cy;
          for (let step = 0; step < 600; step++) { tx += dx; ty += dy; if (tx > o.x && tx < o.x + o.w && ty > o.y && ty < o.y + o.h) { s.obstacles.splice(i, 1); s.score += 2; setScore(s.score); break; } if (tx < 0 || tx > W || ty < 0 || ty > H) break; }
        }
        s.charge = Math.max(0, s.charge - dt / 400);
      }
      for (const o of s.obstacles) if (cx > o.x && cx < o.x + o.w && cy > o.y && cy < o.y + o.h) { s.dead = true; setDead(true); if (s.score > best) { setBest(s.score); saveHigh("laser-best", s.score); } }
    }
    ctx.fillStyle = p.sunken; ctx.fillRect(0, 0, W, H);
    s.obstacles.forEach((o) => { ctx.fillStyle = p.bad; ctx.fillRect(o.x, o.y, o.w, o.h); });
    const cx = 30, cy = H / 2;
    ctx.fillStyle = p.accent; ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = s.charge > 0 ? p.accent : p.border; ctx.lineWidth = s.charge > 0 ? 3 : 1; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(s.angle) * 600, cy + Math.sin(s.angle) * 600); ctx.stroke(); ctx.lineWidth = 1;
    if (s.dead) { ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = p.fg; ctx.font = "bold 16px monospace"; ctx.textAlign = "center"; ctx.fillText("Hit — Enter to retry", W / 2, H / 2); }
  }, []);
  return (<div><canvas ref={ref} width={W} height={H} style={{ display: "block", width: "100%" }} /><GameStatusBar left={`Score: ${score}${dead ? " · dead" : ""}`} right={`Best: ${best} · hold Space to fire`} /></div>);
}
