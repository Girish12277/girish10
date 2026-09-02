import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh, usePaletteRef } from "../_shared/GameShell";
import { snakeAudio } from "./audio";
import { ParticleSystem } from "./particles";
import {
  type Position, type Vector, type GameMode, type SnakeSkinId, type PowerUpType, type FoodItem,
  type Portal, type Achievement, SKINS, INITIAL_ACHIEVEMENTS,
} from "./types";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Zap, Magnet, Clock, Sparkles, Trophy } from "lucide-react";

const COLS = 24, ROWS = 24, CELL = 18;
const BOARD_W = COLS * CELL;
const BOARD_H = ROWS * CELL;

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const palRef = usePaletteRef();
  const psRef = useRef<ParticleSystem>(new ParticleSystem());

  // Game configuration state
  const [mode, setMode] = useState<GameMode>("classic");
  const [skinId, setSkinId] = useState<SnakeSkinId>("neon");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => loadHigh("snake-high-v100"));
  const [multiplier, setMultiplier] = useState(1);
  const [gameState, setGameState] = useState<"idle" | "playing" | "paused" | "dead">("idle");
  const [timeRemaining, setTimeRemaining] = useState(120);

  // Active powerup timers
  const [activePowerup, setActivePowerup] = useState<{ type: PowerUpType; duration: number } | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Game internal mutable state ref
  const sRef = useRef({
    snake: [{ x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 }] as Position[],
    prevSnake: [{ x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 }] as Position[],
    aiSnake: [{ x: 5, y: 5 }, { x: 5, y: 6 }] as Position[],
    aiDir: { x: 0, y: -1 } as Vector,
    dir: { x: 1, y: 0 } as Vector,
    nextDir: { x: 1, y: 0 } as Vector,
    foods: [] as FoodItem[],
    portals: [
      { entry: { x: 4, y: 4 }, exit: { x: 19, y: 19 }, color: "#3b82f6" },
      { entry: { x: 19, y: 4 }, exit: { x: 4, y: 19 }, color: "#ec4899" },
    ] as Portal[],
    acc: 0,
    step: 110,
    nitro: false,
    shakeX: 0,
    shakeY: 0,
    blinkTimer: 0,
    goldenEaten: 0,
    phaseShieldTimer: 0,
    magnetTimer: 0,
    timeFreezeTimer: 0,
  });

  // Unlock achievement helper
  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx !== -1 && !prev[idx].unlocked) {
        const next = [...prev];
        next[idx] = { ...next[idx], unlocked: true };
        snakeAudio.playAchievement();
        setActiveToast(`Unlocked: ${next[idx].title} ${next[idx].icon}`);
        setTimeout(() => setActiveToast(null), 3000);
        return next;
      }
      return prev;
    });
  };

  // Spawn food helper
  const spawnFood = (typeOverride?: FoodItem["type"]) => {
    const s = sRef.current;
    let rx = 0, ry = 0, valid = false;
    while (!valid) {
      rx = Math.floor(Math.random() * COLS);
      ry = Math.floor(Math.random() * ROWS);
      valid = !s.snake.some((p) => p.x === rx && p.y === ry);
    }
    const rand = Math.random();
    const type: FoodItem["type"] = typeOverride ?? (
      rand > 0.88 ? "golden" :
      rand > 0.80 ? "shield" :
      rand > 0.72 ? "magnet" :
      rand > 0.64 ? "timefreeze" :
      rand > 0.58 ? "nitro" : "standard"
    );
    s.foods.push({
      id: Math.random().toString(36).slice(2),
      x: rx, y: ry, type,
      expiresAt: type !== "standard" ? Date.now() + 10000 : undefined,
    });
  };

  // Reset Game
  const resetGame = (newMode = mode) => {
    const s = sRef.current;
    s.snake = [{ x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 }];
    s.prevSnake = JSON.parse(JSON.stringify(s.snake));
    s.aiSnake = [{ x: 5, y: 5 }, { x: 5, y: 6 }];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.acc = 0;
    s.step = 110;
    s.nitro = false;
    s.phaseShieldTimer = 0;
    s.magnetTimer = 0;
    s.timeFreezeTimer = 0;
    s.foods = [];
    psRef.current.clear();
    setScore(0);
    setMultiplier(1);
    setTimeRemaining(120);
    setActivePowerup(null);
    setGameState("playing");
    spawnFood("standard");
    spawnFood("golden");
  };

  // Sync audio toggle with synth instance
  useEffect(() => {
    snakeAudio.enabled = audioEnabled;
  }, [audioEnabled]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = sRef.current;
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "idle" || gameState === "dead") { resetGame(); return; }
        if (e.type === "keydown") s.nitro = true;
        return;
      }
      if (gameState !== "playing") return;

      const setDir = (x: number, y: number) => {
        if (s.dir.x !== -x || s.dir.y !== -y) s.nextDir = { x, y };
      };
      if (e.code === "ArrowUp" || e.code === "KeyW") { e.preventDefault(); setDir(0, -1); }
      else if (e.code === "ArrowDown" || e.code === "KeyS") { e.preventDefault(); setDir(0, 1); }
      else if (e.code === "ArrowLeft" || e.code === "KeyA") { e.preventDefault(); setDir(-1, 0); }
      else if (e.code === "ArrowRight" || e.code === "KeyD") { e.preventDefault(); setDir(1, 0); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") sRef.current.nitro = false;
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gameState]);

  // Main 60 FPS Render Loop
  useRAFLoop((dt) => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const s = sRef.current;
    const ps = psRef.current;
    const skin = SKINS[skinId];
    const pal = palRef.current;

    // Decay screen shake
    s.shakeX *= 0.85;
    s.shakeY *= 0.85;

    if (gameState === "playing") {
      const effectiveStep = s.nitro ? Math.max(35, s.step * 0.5) : s.step;
      s.acc += dt;

      if (s.phaseShieldTimer > 0) s.phaseShieldTimer -= dt;
      if (s.magnetTimer > 0) s.magnetTimer -= dt;
      if (s.timeFreezeTimer > 0) s.timeFreezeTimer -= dt;

      // Update powerup state for UI
      if (s.phaseShieldTimer <= 0 && s.magnetTimer <= 0 && s.timeFreezeTimer <= 0 && !s.nitro) {
        if (activePowerup) setActivePowerup(null);
      }

      // Magnetic pull logic
      if (s.magnetTimer > 0) {
        const head = s.snake[0];
        s.foods.forEach((food) => {
          const dx = head.x - food.x;
          const dy = head.y - food.y;
          if (Math.abs(dx) <= 6 && Math.abs(dy) <= 6) {
            if (dx > 0) food.x += 0.05; else if (dx < 0) food.x -= 0.05;
            if (dy > 0) food.y += 0.05; else if (dy < 0) food.y -= 0.05;
          }
        });
      }

      // Step execution loop
      while (s.acc >= effectiveStep) {
        s.acc -= effectiveStep;
        s.prevSnake = JSON.parse(JSON.stringify(s.snake));
        s.dir = s.nextDir;
        const head = s.snake[0];
        let nh = { x: head.x + s.dir.x, y: head.y + s.dir.y };

        // Portal Teleportation Check
        if (mode === "campaign") {
          for (const portal of s.portals) {
            if (nh.x === portal.entry.x && nh.y === portal.entry.y) {
              nh = { ...portal.exit };
              snakeAudio.playPortal();
              ps.emitFoodExplosion(portal.exit.x * CELL + CELL / 2, portal.exit.y * CELL + CELL / 2, portal.color, 15);
              unlockAchievement("portal-master");
            }
          }
        }

        // Collision Check (Walls & Self)
        const wallHit = nh.x < 0 || nh.y < 0 || nh.x >= COLS || nh.y >= ROWS;
        const selfHit = s.snake.some((p) => p.x === nh.x && p.y === nh.y);

        if ((wallHit || selfHit) && s.phaseShieldTimer <= 0) {
          s.shakeX = (Math.random() - 0.5) * 16;
          s.shakeY = (Math.random() - 0.5) * 16;
          snakeAudio.playCrash();
          setGameState("dead");
          if (score > highScore) {
            setHighScore(score);
            saveHigh("snake-high-v100", score);
          }
          break;
        }

        // Phase Shield Pass-Through
        if (selfHit && s.phaseShieldTimer > 0) {
          unlockAchievement("ghost-rider");
        }

        // Wrap around walls if phase shield active
        if (wallHit && s.phaseShieldTimer > 0) {
          if (nh.x < 0) nh.x = COLS - 1;
          if (nh.x >= COLS) nh.x = 0;
          if (nh.y < 0) nh.y = ROWS - 1;
          if (nh.y >= ROWS) nh.y = 0;
        }

        s.snake.unshift(nh);

        // Food Eating Collision Check
        let ateFood = false;
        for (let i = s.foods.length - 1; i >= 0; i--) {
          const f = s.foods[i];
          if (Math.round(f.x) === nh.x && Math.round(f.y) === nh.y) {
            ateFood = true;
            s.foods.splice(i, 1);
            unlockAchievement("first-eat");

            let pts = 10 * multiplier;
            if (f.type === "golden") {
              pts = 50 * multiplier;
              s.goldenEaten++;
              snakeAudio.playGoldenEat();
              ps.emitFoodExplosion(nh.x * CELL + CELL / 2, nh.y * CELL + CELL / 2, "#f59e0b", 30);
              ps.addFloatingText("+50 GOLDEN!", nh.x * CELL + CELL / 2, nh.y * CELL, "#f59e0b");
              if (s.goldenEaten >= 3) unlockAchievement("golden-god");
            } else if (f.type === "shield") {
              s.phaseShieldTimer = 6000;
              setActivePowerup({ type: "shield", duration: 6 });
              snakeAudio.playShield();
              ps.addFloatingText("PHASE SHIELD!", nh.x * CELL + CELL / 2, nh.y * CELL, "#ec4899");
            } else if (f.type === "magnet") {
              s.magnetTimer = 8000;
              setActivePowerup({ type: "magnet", duration: 8 });
              snakeAudio.playMagnet();
              ps.addFloatingText("MAGNETIC PULL!", nh.x * CELL + CELL / 2, nh.y * CELL, "#3b82f6");
            } else if (f.type === "timefreeze") {
              s.timeFreezeTimer = 5000;
              setActivePowerup({ type: "timefreeze", duration: 5 });
              snakeAudio.playTimeFreeze();
              ps.addFloatingText("TIME FREEZE!", nh.x * CELL + CELL / 2, nh.y * CELL, "#06b6d4");
            } else {
              snakeAudio.playEat();
              ps.emitFoodExplosion(nh.x * CELL + CELL / 2, nh.y * CELL + CELL / 2, skin.headColor, 18);
              ps.addFloatingText(`+${pts}`, nh.x * CELL + CELL / 2, nh.y * CELL, skin.headColor);
            }

            const nextScore = score + pts;
            setScore(nextScore);
            if (nextScore >= 50) unlockAchievement("score-50");
            if (nextScore >= 100) unlockAchievement("score-100");

            s.step = Math.max(45, s.step - 1.5);
            spawnFood();
            break;
          }
        }

        if (!ateFood) s.snake.pop();

        // Emit tail plasma particle
        const tail = s.snake[s.snake.length - 1];
        ps.emitTailPlasma(tail.x * CELL + CELL / 2, tail.y * CELL + CELL / 2, skin.tailColor);
      }
    }

    // UPDATE PHYSICS
    ps.update();

    // RENDER CANVAS
    ctx.save();
    ctx.translate(s.shakeX, s.shakeY);

    // Canvas Background
    ctx.fillStyle = pal.sunken ?? "#090d16";
    ctx.fillRect(0, 0, BOARD_W, BOARD_H);

    // Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, BOARD_H); ctx.stroke();
    }
    for (let y = 0; y <= BOARD_H; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(BOARD_W, y); ctx.stroke();
    }

    // Render Portals in Campaign Mode
    if (mode === "campaign") {
      for (const p of s.portals) {
        ctx.save();
        ctx.shadowBlur = 12; ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.entry.x * CELL + CELL / 2, p.entry.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.exit.x * CELL + CELL / 2, p.exit.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Render Foods
    s.foods.forEach((food) => {
      ctx.save();
      const fx = food.x * CELL + CELL / 2;
      const fy = food.y * CELL + CELL / 2;
      ctx.shadowBlur = 12;
      if (food.type === "golden") {
        ctx.shadowColor = "#f59e0b"; ctx.fillStyle = "#f59e0b";
      } else if (food.type === "shield") {
        ctx.shadowColor = "#ec4899"; ctx.fillStyle = "#ec4899";
      } else if (food.type === "magnet") {
        ctx.shadowColor = "#3b82f6"; ctx.fillStyle = "#3b82f6";
      } else if (food.type === "timefreeze") {
        ctx.shadowColor = "#06b6d4"; ctx.fillStyle = "#06b6d4";
      } else {
        ctx.shadowColor = pal.bad ?? "#ef4444"; ctx.fillStyle = pal.bad ?? "#ef4444";
      }

      ctx.beginPath();
      ctx.arc(fx, fy, CELL / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Render Snake Bezier Body & Sub-tick Motion Interpolation
    const progress = Math.min(1, s.acc / (s.nitro ? s.step * 0.5 : s.step));
    ctx.save();
    ctx.shadowBlur = s.phaseShieldTimer > 0 ? 18 : 10;
    ctx.shadowColor = s.phaseShieldTimer > 0 ? "#ec4899" : skin.glowColor;

    s.snake.forEach((curr, idx) => {
      const prev = s.prevSnake[idx] ?? curr;
      const interpX = prev.x + (curr.x - prev.x) * progress;
      const interpY = prev.y + (curr.y - prev.y) * progress;

      const px = interpX * CELL + CELL / 2;
      const py = interpY * CELL + CELL / 2;
      const radius = idx === 0 ? CELL / 2 - 1 : Math.max(3, (CELL / 2 - 2) * (1 - idx / (s.snake.length + 4)));

      ctx.fillStyle = idx === 0 ? skin.headColor : idx === s.snake.length - 1 ? skin.tailColor : skin.bodyColor;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();

      // Render Directional Eyes on Head
      if (idx === 0) {
        ctx.fillStyle = skin.eyeColor;
        const eyeOffset = 4;
        const eyeRadius = 2.5;
        const ex1 = px + s.dir.y * eyeOffset + s.dir.x * 3;
        const ey1 = py + s.dir.x * eyeOffset + s.dir.y * 3;
        const ex2 = px - s.dir.y * eyeOffset + s.dir.x * 3;
        const ey2 = py - s.dir.x * eyeOffset + s.dir.y * 3;

        ctx.beginPath(); ctx.arc(ex1, ey1, eyeRadius, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex2, ey2, eyeRadius, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.restore();

    // Render Particle Systems & Floating Text
    ps.render(ctx);

    // Overlay Game States
    if (gameState === "idle") {
      ctx.fillStyle = "rgba(9, 13, 22, 0.75)"; ctx.fillRect(0, 0, BOARD_W, BOARD_H);
      ctx.fillStyle = pal.fg ?? "#ffffff"; ctx.font = "bold 16px system-ui, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("🐍 PRESS SPACE OR START TO SLITHER", BOARD_W / 2, BOARD_H / 2 - 10);
      ctx.font = "12px system-ui, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText("Arrow keys / WASD to move • Hold Space for Nitro", BOARD_W / 2, BOARD_H / 2 + 16);
    } else if (gameState === "dead") {
      ctx.fillStyle = "rgba(9, 13, 22, 0.85)"; ctx.fillRect(0, 0, BOARD_W, BOARD_H);
      ctx.fillStyle = pal.bad ?? "#ef4444"; ctx.font = "bold 22px system-ui, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("GAME OVER", BOARD_W / 2, BOARD_H / 2 - 20);
      ctx.fillStyle = pal.fg ?? "#ffffff"; ctx.font = "14px system-ui, sans-serif";
      ctx.fillText(`Score: ${score}  |  Best: ${highScore}`, BOARD_W / 2, BOARD_H / 2 + 10);
      ctx.font = "12px system-ui, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText("Press Space to Play Again", BOARD_W / 2, BOARD_H / 2 + 36);
    }

    ctx.restore();
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 p-3 text-white max-w-full overflow-hidden">
      {/* Toast Alert */}
      {activeToast && (
        <div className="bg-amber-500/90 text-black text-[12px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-amber-300 animate-bounce">
          {activeToast}
        </div>
      )}

      {/* Control Bar & Mode / Skin Selector */}
      <div className="flex items-center justify-between w-full text-xs gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {(["neon", "dragon", "plasma", "phantom", "pixel"] as SnakeSkinId[]).map((sk) => (
            <button
              key={sk}
              onClick={() => setSkinId(sk)}
              className={`px-2 py-1 rounded-md capitalize transition ${skinId === sk ? "bg-cyan-500 text-black font-bold" : "bg-white/10 hover:bg-white/20"}`}
            >
              {sk}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition"
            title="Toggle Audio"
          >
            {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            onClick={() => resetGame()}
            className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-md transition"
          >
            <RotateCcw size={14} /> Restart
          </button>
        </div>
      </div>

      {/* Main Canvas Shell */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
        <canvas ref={canvasRef} width={BOARD_W} height={BOARD_H} className="block w-full max-w-[432px] h-auto cursor-pointer" />
      </div>

      {/* Touch D-Pad for Mobile Responsiveness */}
      <div className="grid grid-cols-3 gap-1.5 w-36 md:hidden my-1">
        <div />
        <button
          onClick={() => { if (sRef.current.dir.y !== 1) sRef.current.nextDir = { x: 0, y: -1 }; }}
          className="p-3 bg-white/10 active:bg-white/30 rounded-lg text-center font-bold"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => { if (sRef.current.dir.x !== 1) sRef.current.nextDir = { x: -1, y: 0 }; }}
          className="p-3 bg-white/10 active:bg-white/30 rounded-lg text-center font-bold"
        >
          ◀
        </button>
        <button
          onClick={() => { sRef.current.nitro = true; setTimeout(() => sRef.current.nitro = false, 400); }}
          className="p-3 bg-amber-500/30 text-amber-300 rounded-lg text-center font-bold text-xs"
        >
          ⚡
        </button>
        <button
          onClick={() => { if (sRef.current.dir.x !== -1) sRef.current.nextDir = { x: 1, y: 0 }; }}
          className="p-3 bg-white/10 active:bg-white/30 rounded-lg text-center font-bold"
        >
          ▶
        </button>
        <div />
        <button
          onClick={() => { if (sRef.current.dir.y !== -1) sRef.current.nextDir = { x: 0, y: 1 }; }}
          className="p-3 bg-white/10 active:bg-white/30 rounded-lg text-center font-bold"
        >
          ▼
        </button>
        <div />
      </div>

      {/* Status Bar */}
      <GameStatusBar left={`Score: ${score}`} right={`High: ${highScore}`} />
    </div>
  );
}
