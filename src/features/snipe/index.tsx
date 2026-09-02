import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, usePaletteRef, loadHigh, saveHigh } from "../_shared/GameShell";
const W = 420, H = 340;
type T = { x: number; y: number; r: number; vx: number; vy: number };
export default function Snipe() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const palRef = usePaletteRef();
  const st = useRef({ targets: [] as T[], spawn: 0, score: 0, miss: 0, ammo: 10 });
  const [score, setScore] = useState(0);
  const [ammo, setAmmo] = useState(10);
  const [best, setBest] = useState(loadHigh("snipe-best"));
  useRAFLoop((dt) => {
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d")!; const p = palRef.current; const s = st.current;
    s.spawn -= dt; if (s.spawn <= 0 && s.targets.length < 5) { s.spawn = 700; s.targets.push({ x: Math.random() * W, y: 30 + Math.random() * (H - 60), r: 10 + Math.random() * 8, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.1 }); }
    s.targets.forEach((t) => { t.x += t.vx * dt; t.y += t.vy * dt; if (t.x < t.r || t.x > W - t.r) t.vx *= -1; if (t.y < t.r || t.y > H - t.r) t.vy *= -1; });
    ctx.fillStyle = p.sunken; ctx.fillRect(0, 0, W, H);
    s.targets.forEach((t) => { ctx.fillStyle = p.bad; ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = p.fg; ctx.beginPath(); ctx.arc(t.x, t.y, t.r * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = p.bad; ctx.beginPath(); ctx.arc(t.x, t.y, t.r * 0.25, 0, Math.PI * 2); ctx.fill(); });
  }, []);
  useEffect(() => { if (score > best) { setBest(score); saveHigh("snipe-best", score); } }, [score, best]);
  const fire = (e: React.MouseEvent) => {
    if (ammo <= 0) return; const c = ref.current!; const r = c.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (W / r.width), my = (e.clientY - r.top) * (H / r.height);
    const s = st.current; let hit = false;
    for (let i = s.targets.length - 1; i >= 0; i--) { const t = s.targets[i]; if ((mx - t.x) ** 2 + (my - t.y) ** 2 <= t.r * t.r) { s.targets.splice(i, 1); s.score += 10 - Math.floor(((mx - t.x) ** 2 + (my - t.y) ** 2) / (t.r * t.r) * 5); setScore(s.score); hit = true; break; } }
    s.ammo--; setAmmo(s.ammo); if (!hit) s.miss++;
  };
  const reload = () => { st.current.ammo = 10; setAmmo(10); };
  return (<div><canvas ref={ref} width={W} height={H} onClick={fire} style={{ display: "block", width: "100%", cursor: "crosshair" }} /><GameStatusBar left={`Score: ${score} · Ammo: ${ammo}`} right={<button onClick={reload} style={{ background: "transparent", color: "var(--vlc-accent)", border: "none", cursor: "pointer" }}>Reload</button>} /></div>);
}
