import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";

const COLS = 22, ROWS = 22, CELL = 18;
type P = { x: number; y: number };

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const palRef = usePaletteRef();
  const sRef = useRef({
    snake: [{ x: 10, y: 10 }] as P[],
    dir: { x: 1, y: 0 } as P, nextDir: { x: 1, y: 0 } as P,
    food: { x: 15, y: 10 } as P, acc: 0, step: 120, dead: false, started: false,
  });
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(() => loadHigh("snake-high"));
  const [dead, setDead] = useState(false);

  const reset = () => {
    sRef.current = { snake: [{ x: 10, y: 10 }], dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: { x: 15, y: 10 }, acc: 0, step: 120, dead: false, started: true };
    setScore(0); setDead(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = sRef.current;
      if (s.dead && (e.code === "Space" || e.code === "Enter")) { reset(); return; }
      if (!s.started) s.started = true;
      const d = s.dir;
      const set = (x: number, y: number) => { if (d.x !== -x || d.y !== -y) s.nextDir = { x, y }; };
      if (e.code === "ArrowUp" || e.code === "KeyW") { e.preventDefault(); set(0, -1); }
      else if (e.code === "ArrowDown" || e.code === "KeyS") { e.preventDefault(); set(0, 1); }
      else if (e.code === "ArrowLeft" || e.code === "KeyA") { e.preventDefault(); set(-1, 0); }
      else if (e.code === "ArrowRight" || e.code === "KeyD") { e.preventDefault(); set(1, 0); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useRAFLoop((dt) => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const s = sRef.current;

    if (s.started && !s.dead) {
      s.acc += dt;
      while (s.acc >= s.step) {
        s.acc -= s.step;
        s.dir = s.nextDir;
        const head = s.snake[0];
        const nh = { x: head.x + s.dir.x, y: head.y + s.dir.y };
        if (nh.x < 0 || nh.y < 0 || nh.x >= COLS || nh.y >= ROWS || s.snake.some((p) => p.x === nh.x && p.y === nh.y)) {
          s.dead = true; setDead(true);
          if (s.snake.length - 1 > high) { setHigh(s.snake.length - 1); saveHigh("snake-high", s.snake.length - 1); }
          break;
        }
        s.snake.unshift(nh);
        if (nh.x === s.food.x && nh.y === s.food.y) {
          setScore(s.snake.length - 1);
          s.step = Math.max(50, s.step - 3);
          do { s.food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
          while (s.snake.some((p) => p.x === s.food.x && p.y === s.food.y));
        } else s.snake.pop();
      }
    }

    const p = palRef.current;
    ctx.fillStyle = p.sunken; ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.fillStyle = p.bad; ctx.fillRect(s.food.x * CELL + 2, s.food.y * CELL + 2, CELL - 4, CELL - 4);
    s.snake.forEach((sp, i) => {
      ctx.fillStyle = i === 0 ? p.accent : p.good;
      ctx.fillRect(sp.x * CELL + 1, sp.y * CELL + 1, CELL - 2, CELL - 2);
    });
    if (!s.started) {
      ctx.fillStyle = p.fg; ctx.font = "14px monospace"; ctx.textAlign = "center";
      ctx.fillText("Arrow keys / WASD to start", (COLS * CELL) / 2, (ROWS * CELL) / 2);
    }
    if (s.dead) {
      ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx.fillStyle = p.fg; ctx.font = "bold 18px monospace"; ctx.textAlign = "center";
      ctx.fillText("Game Over — Space to restart", (COLS * CELL) / 2, (ROWS * CELL) / 2);
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} style={{ display: "block", width: "100%" }} />
      <GameStatusBar left={`Score: ${score}`} right={`Best: ${high}`} />
    </div>
  );
}
