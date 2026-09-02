import { useEffect, useRef, useState } from "react";
import { useRAFLoop, GameStatusBar, loadHigh, saveHigh } from "../_shared/GameShell";
import type { DinoTheme, Obstacle, Particle, PowerUp, FloatingText } from "./types";
import { dinoAudio } from "./audio";
import {
  THEME_PALETTES,
  drawParallaxSkyline,
  drawGround,
  drawDino,
  drawObstacle,
  drawParticles,
  drawPowerUp,
  drawFloatingTexts,
} from "./render";

const W = 640;
const H = 200;
const GROUND = 160;

export default function Dino() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<DinoTheme>("classic");
  const [muted, setMuted] = useState(false);
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(() => loadHigh("dino-high-v2"));
  const [dead, setDead] = useState(false);
  const [activePowerup, setActivePowerup] = useState<string | null>(null);

  const stateRef = useRef({
    dinoY: GROUND,
    vy: 0,
    ducking: false,
    jumping: false,
    jumpsLeft: 2,
    speed: 6.5,
    dist: 0,
    obs: [] as Obstacle[],
    particles: [] as Particle[],
    powerups: [] as PowerUp[],
    floatingTexts: [] as FloatingText[],
    spawnIn: 60,
    powerupSpawnIn: 300,
    dead: false,
    started: false,
    frame: 0,
    shake: 0,
    shieldActive: false,
    jetpackActive: false,
    slowmoActive: false,
    powerupTimer: 0,
    coyoteTime: 0,
  });

  const colors = THEME_PALETTES[theme];

  const reset = () => {
    stateRef.current = {
      dinoY: GROUND,
      vy: 0,
      ducking: false,
      jumping: false,
      jumpsLeft: 2,
      speed: 6.5,
      dist: 0,
      obs: [],
      particles: [],
      powerups: [],
      floatingTexts: [],
      spawnIn: 50,
      powerupSpawnIn: 350,
      dead: false,
      started: true,
      frame: 0,
      shake: 0,
      shieldActive: false,
      jetpackActive: false,
      slowmoActive: false,
      powerupTimer: 0,
      coyoteTime: 0,
    };
    setDead(false);
    setScore(0);
    setActivePowerup(null);
  };

  const jump = () => {
    const s = stateRef.current;
    if (s.dead) {
      reset();
      return;
    }
    if (!s.started) {
      s.started = true;
      return;
    }

    const canJump = s.dinoY >= GROUND || s.coyoteTime > 0 || (s.jetpackActive && s.jumpsLeft > 0);
    if (canJump) {
      s.vy = s.jetpackActive && s.dinoY < GROUND ? -10 : -11.5;
      s.jumping = true;
      s.coyoteTime = 0;
      if (s.jetpackActive && s.dinoY < GROUND) s.jumpsLeft--;
      dinoAudio.playJump();

      // Foot dust particles
      for (let i = 0; i < 6; i++) {
        s.particles.push({
          x: 45 + Math.random() * 10,
          y: GROUND,
          vx: -1 - Math.random() * 2,
          vy: -Math.random() * 1.5,
          size: 3 + Math.random() * 3,
          color: colors.groundAccent,
          alpha: 0.8,
          life: 0,
          maxLife: 20,
        });
      }
    }
  };

  const duck = (isDucking: boolean) => {
    const s = stateRef.current;
    s.ducking = isDucking;
    if (isDucking && s.dinoY < GROUND) {
      // Fast drop in mid-air
      s.vy += 3.5;
      dinoAudio.playDuck();
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        duck(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") duck(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useRAFLoop((dt) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    s.frame++;
    const timeFactor = dt / 16.67; // Normalized 60fps

    if (s.started && !s.dead) {
      // Game Speed Scaling
      const curSpeed = (s.slowmoActive ? s.speed * 0.55 : s.speed) * timeFactor;

      // Gravity & Vertical Movement
      s.vy += 0.65 * timeFactor;
      s.dinoY += s.vy * timeFactor;
      if (s.dinoY >= GROUND) {
        if (s.jumping) {
          // Landing dust burst
          for (let i = 0; i < 4; i++) {
            s.particles.push({
              x: 45 + Math.random() * 15,
              y: GROUND,
              vx: (Math.random() - 0.5) * 3,
              vy: -Math.random() * 1.5,
              size: 2 + Math.random() * 2,
              color: colors.groundAccent,
              alpha: 0.7,
              life: 0,
              maxLife: 15,
            });
          }
        }
        s.dinoY = GROUND;
        s.vy = 0;
        s.jumping = false;
        s.jumpsLeft = 2;
        s.coyoteTime = 4;
      } else {
        if (s.coyoteTime > 0) s.coyoteTime -= timeFactor;
      }

      s.dist += curSpeed;
      s.speed = Math.min(15, 6.5 + s.dist / 750);

      // Score Tracking & Milestone Sound
      const curScore = Math.floor(s.dist / 10);
      if (curScore > 0 && curScore % 100 === 0 && curScore !== score) {
        dinoAudio.playMilestone();
        s.floatingTexts.push({
          id: String(Date.now()),
          x: W / 2,
          y: H / 3,
          text: `🎯 ${curScore} PTS!`,
          color: colors.accent,
          alpha: 1,
          vy: -0.8,
        });
      }
      if (curScore !== score) setScore(curScore);

      // Power-up Timer Countdown
      if (s.powerupTimer > 0) {
        s.powerupTimer -= timeFactor;
        if (s.powerupTimer <= 0) {
          s.shieldActive = false;
          s.jetpackActive = false;
          s.slowmoActive = false;
          setActivePowerup(null);
        }
      }

      // Spawning Obstacles
      s.spawnIn -= timeFactor;
      if (s.spawnIn <= 0) {
        s.spawnIn = Math.max(35, 55 + Math.random() * 50 - s.speed * 1.5);
        const isBird = Math.random() < 0.3 && s.dist > 300;
        s.obs.push(
          isBird
            ? {
                id: String(Math.random()),
                x: W,
                w: 28,
                h: 18,
                y: GROUND - 20 - Math.random() * 30,
                type: "pterodactyl",
              }
            : {
                id: String(Math.random()),
                x: W,
                w: 14 + Math.random() * 16,
                h: 24 + Math.random() * 14,
                y: GROUND,
                type: Math.random() < 0.5 ? "cactus_small" : "cactus_large",
              }
        );
      }

      // Spawning Power-ups
      s.powerupSpawnIn -= timeFactor;
      if (s.powerupSpawnIn <= 0) {
        s.powerupSpawnIn = 400 + Math.random() * 300;
        const types: Array<PowerUp["type"]> = ["shield", "jetpack", "slowmo"];
        const pType = types[Math.floor(Math.random() * types.length)];
        s.powerups.push({
          id: String(Math.random()),
          x: W,
          y: GROUND - 45 - Math.random() * 20,
          type: pType,
        });
      }

      // Move Obstacles
      s.obs.forEach((o) => {
        o.x -= curSpeed;
      });
      s.obs = s.obs.filter((o) => o.x + o.w > 0);

      // Move Power-ups
      s.powerups.forEach((p) => {
        p.x -= curSpeed;
      });
      s.powerups = s.powerups.filter((p) => p.x + 20 > 0 && !p.collected);

      // Running Foot Particles
      if (!s.jumping && s.frame % 4 === 0) {
        s.particles.push({
          x: 45,
          y: GROUND,
          vx: -curSpeed * 0.4,
          vy: -Math.random() * 0.8,
          size: 2 + Math.random() * 2,
          color: colors.groundAccent,
          alpha: 0.6,
          life: 0,
          maxLife: 15,
        });
      }

      // Power-up Collision Check
      const dinoW = s.ducking ? 42 : 30;
      const dinoH = s.ducking ? 20 : 36;
      const dinoX = 40;
      const dinoYTop = s.dinoY - dinoH;

      for (const p of s.powerups) {
        if (!p.collected && dinoX < p.x + 20 && dinoX + dinoW > p.x && dinoYTop < p.y + 20 && dinoYTop + dinoH > p.y) {
          p.collected = true;
          dinoAudio.playPowerup();
          s.powerupTimer = 300; // ~5 seconds duration
          setActivePowerup(p.type);
          if (p.type === "shield") s.shieldActive = true;
          if (p.type === "jetpack") s.jetpackActive = true;
          if (p.type === "slowmo") s.slowmoActive = true;

          s.floatingTexts.push({
            id: String(Math.random()),
            x: dinoX + 20,
            y: dinoYTop - 10,
            text: p.type.toUpperCase() + " ACTIVE!",
            color: colors.accent,
            alpha: 1,
            vy: -0.6,
          });
        }
      }

      // Obstacle Collision Check
      for (let i = s.obs.length - 1; i >= 0; i--) {
        const o = s.obs[i];
        const oy = o.y - o.h;
        if (dinoX < o.x + o.w && dinoX + dinoW > o.x && dinoYTop < o.y && dinoYTop + dinoH > oy) {
          if (s.shieldActive) {
            // Shield crush obstacle
            s.shieldActive = false;
            setActivePowerup(null);
            s.obs.splice(i, 1);
            s.shake = 8;
            dinoAudio.playCrash();

            // Collision spark burst
            for (let k = 0; k < 12; k++) {
              s.particles.push({
                x: o.x + o.w / 2,
                y: o.y - o.h / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: 3 + Math.random() * 3,
                color: colors.accent,
                alpha: 1,
                life: 0,
                maxLife: 25,
              });
            }

            s.floatingTexts.push({
              id: String(Math.random()),
              x: o.x,
              y: oy - 10,
              text: "💥 SHIELD CRUSH!",
              color: colors.accent,
              alpha: 1,
              vy: -0.8,
            });
          } else {
            // Game Over Collision
            s.dead = true;
            setDead(true);
            s.shake = 12;
            dinoAudio.playCrash();

            // Death Spark Burst
            for (let k = 0; k < 20; k++) {
              s.particles.push({
                x: dinoX + dinoW / 2,
                y: dinoYTop + dinoH / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: 3 + Math.random() * 4,
                color: colors.bird,
                alpha: 1,
                life: 0,
                maxLife: 30,
              });
            }

            const fi = Math.floor(s.dist / 10);
            setScore(fi);
            if (fi > high) {
              setHigh(fi);
              saveHigh("dino-high-v2", fi);
            }
          }
        }
      }
    }

    // Update Particles
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.life += timeFactor;
      p.x += p.vx * timeFactor;
      p.y += p.vy * timeFactor;
      p.alpha = 1 - p.life / p.maxLife;
      if (p.life >= p.maxLife) s.particles.splice(i, 1);
    }

    // Update Floating Texts
    for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
      const t = s.floatingTexts[i];
      t.y += t.vy * timeFactor;
      t.alpha -= 0.02 * timeFactor;
      if (t.alpha <= 0) s.floatingTexts.splice(i, 1);
    }

    // Camera Screen Shake Offset
    ctx.save();
    if (s.shake > 0) {
      const sx = (Math.random() - 0.5) * s.shake;
      const sy = (Math.random() - 0.5) * s.shake;
      ctx.translate(sx, sy);
      s.shake *= 0.85;
      if (s.shake < 0.5) s.shake = 0;
    }

    // --- RENDER GAME ---
    // Background Fill
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, W, H);

    // Parallax Skyline
    drawParallaxSkyline(ctx, W, H, s.dist, colors);

    // Ground
    drawGround(ctx, W, H, GROUND, s.dist, colors);

    // Particles
    drawParticles(ctx, s.particles);

    // Power-ups
    s.powerups.forEach((p) => drawPowerUp(ctx, p, s.frame));

    // Obstacles
    s.obs.forEach((o) => drawObstacle(ctx, o, s.frame, colors));

    // Dino Character
    drawDino(ctx, 40, s.dinoY, s.ducking, s.jumping, s.dead, s.frame, colors, s.shieldActive);

    // Floating Texts
    drawFloatingTexts(ctx, s.floatingTexts);

    // Overlays (Start / Game Over)
    if (!s.started) {
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = colors.text;
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("🦖 DINO RUNNER 100X — LEVEL 100", W / 2, H / 2 - 12);
      ctx.font = "12px monospace";
      ctx.fillStyle = colors.accent;
      ctx.fillText("Press Space / Arrow Up / Tap to Jump", W / 2, H / 2 + 12);
    }

    if (s.dead) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = colors.bird;
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 16);
      ctx.font = "12px monospace";
      ctx.fillStyle = colors.text;
      ctx.fillText(`Score: ${score}  |  Best: ${high}`, W / 2, H / 2 + 10);
      ctx.fillStyle = colors.accent;
      ctx.fillText("Press Space or Tap to Restart", W / 2, H / 2 + 30);
    }

    ctx.restore();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Header controls bar */}
      <div className="flex items-center justify-between px-3 py-1.5 hairline-bottom text-[11px]" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-secondary)" }}>
        <div className="flex items-center gap-2">
          <span>Theme:</span>
          {(["classic", "cyberpunk", "sunset", "neon", "volcano"] as DinoTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className="px-2 py-0.5 rounded capitalize transition-all"
              style={{
                background: theme === t ? "var(--vlc-accent)" : "transparent",
                color: theme === t ? "var(--vlc-bg-base)" : "var(--vlc-text-secondary)",
                fontWeight: theme === t ? 600 : 400,
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            const next = !muted;
            setMuted(next);
            dinoAudio.setMuted(next);
          }}
          className="px-2 py-0.5 rounded"
          style={{ background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }}
        >
          {muted ? "🔇 Muted" : "🔊 Sound ON"}
        </button>
      </div>

      {/* HiDPI Game Canvas */}
      <div className="relative w-full cursor-pointer overflow-hidden">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={jump}
          style={{ display: "block", width: "100%", height: "auto", background: colors.bg }}
        />

        {/* Active Power-up Indicator Pill */}
        {activePowerup && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider animate-pulse"
            style={{ background: "var(--vlc-accent)", color: "var(--vlc-bg-base)", boxShadow: "0 0 12px var(--vlc-accent)" }}
          >
            ⚡ {activePowerup} ACTIVE
          </div>
        )}
      </div>

      {/* HUD status footer */}
      <GameStatusBar
        left={`Score: ${String(score).padStart(5, "0")}`}
        right={`High: ${String(high).padStart(5, "0")}`}
      />

      {/* Touch / Keyboard Controls Legend */}
      <div className="flex items-center justify-between px-3 py-1.5 text-[11px]" style={{ color: "var(--vlc-text-ghost)" }}>
        <span>Controls: Space / ↑ Jump · ↓ Duck & Fast Drop</span>
        <div className="flex gap-2">
          <button
            onPointerDown={jump}
            className="px-3 py-1 rounded text-[11px] font-semibold press"
            style={{ background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-normal)", color: "var(--vlc-text-primary)" }}
          >
            ⬆ JUMP
          </button>
          <button
            onPointerDown={() => duck(true)}
            onPointerUp={() => duck(false)}
            className="px-3 py-1 rounded text-[11px] font-semibold press"
            style={{ background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-normal)", color: "var(--vlc-text-primary)" }}
          >
            ⬇ DUCK
          </button>
        </div>
      </div>
    </div>
  );
}
