import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";

interface Obstacle { x: number; w: number; h: number; type: "cactus" | "bird"; y: number; }

const W = 600, H = 160, GROUND = 130;

export default function Dino() {
  const palRef = usePaletteRef();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    dinoY: GROUND, vy: 0, ducking: false, speed: 6, dist: 0,
    obs: [] as Obstacle[], spawnIn: 60, dead: false, started: false,
  });
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(() => loadHigh("dino-high"));
  const [dead, setDead] = useState(false);

  const reset = () => {
    stateRef.current = { dinoY: GROUND, vy: 0, ducking: false, speed: 6, dist: 0, obs: [], spawnIn: 60, dead: false, started: true };
    setDead(false); setScore(0);
  };

  useEffect(() => {
    const jump = () => {
      const s = stateRef.current;
      if (s.dead) { reset(); return; }
      if (!s.started) { s.started = true; return; }
      if (s.dinoY >= GROUND) s.vy = -11;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
      else if (e.code === "ArrowDown") { stateRef.current.ducking = true; }
    };
    const onUp = (e: KeyboardEvent) => { if (e.code === "ArrowDown") stateRef.current.ducking = false; };
    const c = canvasRef.current;
    c?.addEventListener("pointerdown", jump);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      c?.removeEventListener("pointerdown", jump);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  useRAFLoop((dt) => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const s = stateRef.current;
    const f = dt / 16.67; // normalized to 60fps

    if (s.started && !s.dead) {
      s.vy += 0.6 * f;
      s.dinoY += s.vy * f;
      if (s.dinoY > GROUND) { s.dinoY = GROUND; s.vy = 0; }
      s.dist += s.speed * f;
      s.speed = Math.min(14, 6 + s.dist / 600);
      s.spawnIn -= f;
      if (s.spawnIn <= 0) {
        s.spawnIn = 50 + Math.random() * 60;
        const bird = Math.random() < 0.25 && s.dist > 400;
        s.obs.push(bird
          ? { x: W, w: 24, h: 14, y: GROUND - 30 - Math.random() * 25, type: "bird" }
          : { x: W, w: 12 + Math.random() * 14, h: 22 + Math.random() * 14, y: GROUND, type: "cactus" });
      }
      s.obs.forEach((o) => { o.x -= s.speed * f; });
      s.obs = s.obs.filter((o) => o.x + o.w > 0);

      const dinoH = s.ducking ? 18 : 32;
      const dinoW = s.ducking ? 38 : 28;
      const dx = 40, dyTop = s.dinoY - dinoH;
      for (const o of s.obs) {
        const oy = o.y - o.h;
        if (dx < o.x + o.w && dx + dinoW > o.x && dyTop < o.y && dyTop + dinoH > oy) {
          s.dead = true; setDead(true);
          const fi = Math.floor(s.dist / 10);
          setScore(fi);
          if (fi > high) { setHigh(fi); saveHigh("dino-high", fi); }
        }
      }
      const cur = Math.floor(s.dist / 10);
      if (cur !== score) setScore(cur);
    }

    // render
    ctx.fillStyle = "#0b1020";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#3b4a78"; ctx.beginPath();
    ctx.moveTo(0, GROUND + 2); ctx.lineTo(W, GROUND + 2); ctx.stroke();
    // dino
    ctx.fillStyle = palRef.current.accent;
    const dh = s.ducking ? 18 : 32;
    const dw = s.ducking ? 38 : 28;
    ctx.fillRect(40, s.dinoY - dh, dw, dh);
    // obstacles
    for (const o of s.obs) {
      ctx.fillStyle = o.type === "bird" ? "#ff6b9d" : palRef.current.good;
      ctx.fillRect(o.x, o.y - o.h, o.w, o.h);
    }
    if (!s.started) {
      ctx.fillStyle = palRef.current.fg; ctx.font = "14px monospace"; ctx.textAlign = "center";
      ctx.fillText("Press Space or tap to start", W / 2, H / 2);
    }
    if (s.dead) {
      ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = palRef.current.fg; ctx.font = "bold 20px monospace"; ctx.textAlign = "center";
      ctx.fillText("GAME OVER — Space to restart", W / 2, H / 2);
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", width: "100%", background: "#0b1020", cursor: "pointer" }} />
      <GameStatusBar
        left={`Score: ${String(score).padStart(5, "0")}`}
        right={`Best: ${String(high).padStart(5, "0")}`}
      />
      {dead && <div className="px-3 pb-3 text-[11px]" style={{ color: "var(--vlc-text-ghost)" }}>Space / tap to restart · ↓ to duck</div>}
    </div>
  );
}
