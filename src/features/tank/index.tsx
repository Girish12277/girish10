import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";
const W = 420, H = 360;
type E = { x: number; y: number; vx: number; vy: number };
type Bul = { x: number; y: number; vx: number; vy: number; life: number };
export default function Tank() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const palRef = usePaletteRef();
  const st = useRef({ x: W / 2, y: H / 2, ang: 0, bullets: [] as Bul[], enemies: [] as E[], spawn: 0, score: 0, dead: false, keys: {} as Record<string, boolean> });
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [best, setBest] = useState(loadHigh("tank-best"));
  useEffect(() => {
    const dn = (e: KeyboardEvent) => { st.current.keys[e.code] = true; if (e.code === "Space") { const s = st.current; s.bullets.push({ x: s.x, y: s.y, vx: Math.cos(s.ang) * 0.5, vy: Math.sin(s.ang) * 0.5, life: 1400 }); } if (st.current.dead && e.code === "Enter") reset(); };
    const up = (e: KeyboardEvent) => { st.current.keys[e.code] = false; };
    window.addEventListener("keydown", dn); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);
  const reset = () => { st.current = { x: W / 2, y: H / 2, ang: 0, bullets: [], enemies: [], spawn: 0, score: 0, dead: false, keys: {} }; setScore(0); setDead(false); };
  useRAFLoop((dt) => {
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d")!; const p = palRef.current; const s = st.current;
    if (!s.dead) {
      if (s.keys["ArrowLeft"] || s.keys["KeyA"]) s.ang -= 0.005 * dt;
      if (s.keys["ArrowRight"] || s.keys["KeyD"]) s.ang += 0.005 * dt;
      if (s.keys["ArrowUp"] || s.keys["KeyW"]) { s.x += Math.cos(s.ang) * 0.18 * dt; s.y += Math.sin(s.ang) * 0.18 * dt; }
      if (s.keys["ArrowDown"] || s.keys["KeyS"]) { s.x -= Math.cos(s.ang) * 0.12 * dt; s.y -= Math.sin(s.ang) * 0.12 * dt; }
      s.x = Math.max(12, Math.min(W - 12, s.x)); s.y = Math.max(12, Math.min(H - 12, s.y));
      s.spawn -= dt; if (s.spawn <= 0) { s.spawn = 1400; const side = Math.floor(Math.random() * 4); const px = side === 0 ? 0 : side === 1 ? W : Math.random() * W; const py = side === 2 ? 0 : side === 3 ? H : Math.random() * H; const ang = Math.atan2(s.y - py, s.x - px); s.enemies.push({ x: px, y: py, vx: Math.cos(ang) * 0.08, vy: Math.sin(ang) * 0.08 }); }
      s.bullets = s.bullets.filter((b) => { b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; return b.life > 0 && b.x > 0 && b.x < W && b.y > 0 && b.y < H; });
      s.enemies = s.enemies.filter((e) => { e.x += e.vx * dt; e.y += e.vy * dt; const dx = e.x - s.x, dy = e.y - s.y; if (dx * dx + dy * dy < 200) { s.dead = true; setDead(true); if (s.score > best) { setBest(s.score); saveHigh("tank-best", s.score); } } for (let i = s.bullets.length - 1; i >= 0; i--) { const b = s.bullets[i]; if ((b.x - e.x) ** 2 + (b.y - e.y) ** 2 < 120) { s.bullets.splice(i, 1); s.score++; setScore(s.score); return false; } } return true; });
    }
    ctx.fillStyle = p.sunken; ctx.fillRect(0, 0, W, H);
    s.enemies.forEach((e) => { ctx.fillStyle = p.bad; ctx.fillRect(e.x - 8, e.y - 8, 16, 16); });
    s.bullets.forEach((b) => { ctx.fillStyle = p.warn; ctx.fillRect(b.x - 2, b.y - 2, 4, 4); });
    ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.ang); ctx.fillStyle = p.accent; ctx.fillRect(-10, -10, 20, 20); ctx.fillStyle = p.fg; ctx.fillRect(8, -2, 12, 4); ctx.restore();
    if (s.dead) { ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = p.fg; ctx.font = "bold 16px monospace"; ctx.textAlign = "center"; ctx.fillText("KO — Enter to retry", W / 2, H / 2); }
  }, []);
  return (<div><canvas ref={ref} width={W} height={H} style={{ display: "block", width: "100%" }} /><GameStatusBar left={`Kills: ${score}${dead ? " · dead" : ""}`} right={`Best: ${best} · arrows + space`} /></div>);
}
