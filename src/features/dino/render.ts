import type { DinoTheme, Obstacle, Particle, PowerUp, FloatingText } from "./types";

export interface ThemeColors {
  bg: string;
  ground: string;
  groundAccent: string;
  skyline: string;
  dino: string;
  dinoEye: string;
  cactus: string;
  bird: string;
  accent: string;
  text: string;
}

export const THEME_PALETTES: Record<DinoTheme, ThemeColors> = {
  classic: {
    bg: "#0B1020",
    ground: "#1E293B",
    groundAccent: "#334155",
    skyline: "#161E33",
    dino: "#22D3EE",
    dinoEye: "#0F172A",
    cactus: "#10B981",
    bird: "#F43F5E",
    accent: "#38BDF8",
    text: "#F8FAFC",
  },
  cyberpunk: {
    bg: "#0A0014",
    ground: "#1E0638",
    groundAccent: "#3B0764",
    skyline: "#19042B",
    dino: "#00FFC8",
    dinoEye: "#0A0014",
    cactus: "#FF007F",
    bird: "#FFE600",
    accent: "#FF007F",
    text: "#F8FAFC",
  },
  sunset: {
    bg: "#1F0E1B",
    ground: "#3B1429",
    groundAccent: "#581C38",
    skyline: "#2A1024",
    dino: "#FFB800",
    dinoEye: "#1F0E1B",
    cactus: "#FF4D4D",
    bird: "#FF007F",
    accent: "#FF8A00",
    text: "#FFF5F0",
  },
  neon: {
    bg: "#050B14",
    ground: "#0C1F38",
    groundAccent: "#1A3860",
    skyline: "#081526",
    dino: "#38BDF8",
    dinoEye: "#050B14",
    cactus: "#4ADE80",
    bird: "#F472B6",
    accent: "#818CF8",
    text: "#F1F5F9",
  },
  volcano: {
    bg: "#180808",
    ground: "#341212",
    groundAccent: "#521A1A",
    skyline: "#240C0C",
    dino: "#FF5500",
    dinoEye: "#180808",
    cactus: "#E11D48",
    bird: "#F59E0B",
    accent: "#FF2200",
    text: "#FFF1F2",
  },
};

/** Render distant parallax mountain skyline */
export function drawParallaxSkyline(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dist: number,
  colors: ThemeColors
) {
  ctx.save();
  ctx.fillStyle = colors.skyline;
  ctx.beginPath();
  const offset = (dist * 0.1) % 200;
  ctx.moveTo(-offset, h - 30);
  for (let x = -offset; x < w + 200; x += 100) {
    ctx.lineTo(x + 30, h - 65);
    ctx.lineTo(x + 60, h - 45);
    ctx.lineTo(x + 100, h - 30);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Render scrolling ground with textured lines and cracks */
export function drawGround(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  groundY: number,
  dist: number,
  colors: ThemeColors
) {
  ctx.save();
  // Ground main bar
  ctx.fillStyle = colors.ground;
  ctx.fillRect(0, groundY, w, h - groundY);

  // Ground accent line
  ctx.strokeStyle = colors.groundAccent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();

  // Scrolling ground speed dots / cracks
  ctx.fillStyle = colors.groundAccent;
  const speedOffset = (dist * 1.5) % 60;
  for (let x = -speedOffset; x < w + 60; x += 40) {
    ctx.fillRect(x, groundY + 8, 12, 2);
    ctx.fillRect(x + 20, groundY + 16, 6, 2);
    ctx.fillRect(x + 10, groundY + 24, 18, 2);
  }
  ctx.restore();
}

/** Render stylized vector T-Rex character */
export function drawDino(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ducking: boolean,
  jumping: boolean,
  dead: boolean,
  frame: number,
  colors: ThemeColors,
  hasShield?: boolean
) {
  ctx.save();
  ctx.fillStyle = colors.dino;

  if (hasShield) {
    // Shield glow aura
    ctx.shadowColor = colors.accent;
    ctx.shadowBlur = 12;
  }

  if (ducking) {
    // Low-profile aerodynamic stance
    const w = 42, h = 20;
    const topY = y - h;

    // Body
    ctx.beginPath();
    ctx.roundRect(x, topY, w, h, 6);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.roundRect(x + 24, topY - 2, 20, 14, 4);
    ctx.fill();

    // Eye
    ctx.fillStyle = colors.dinoEye;
    ctx.fillRect(x + 36, topY + 2, 3, 3);

    // Legs (fast movement stride)
    ctx.fillStyle = colors.dino;
    const legOffset = Math.floor(frame / 6) % 2 === 0 ? 0 : 4;
    ctx.fillRect(x + 10 + legOffset, y, 4, 6);
    ctx.fillRect(x + 26 - legOffset, y, 4, 6);
  } else {
    // Upright stance
    const w = 30, h = 36;
    const topY = y - h;

    // Body & Tail
    ctx.beginPath();
    ctx.roundRect(x + 4, topY + 10, 22, 22, 6);
    ctx.fill();

    // Tail extension
    ctx.beginPath();
    ctx.moveTo(x + 4, topY + 18);
    ctx.lineTo(x - 6, topY + 14);
    ctx.lineTo(x + 4, topY + 24);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.roundRect(x + 10, topY, 22, 16, 4);
    ctx.fill();

    // Eye
    ctx.fillStyle = colors.dinoEye;
    if (dead) {
      // X Eye on crash
      ctx.strokeStyle = colors.dinoEye;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 24, topY + 4); ctx.lineTo(x + 28, topY + 8);
      ctx.moveTo(x + 28, topY + 4); ctx.lineTo(x + 24, topY + 8);
      ctx.stroke();
    } else {
      ctx.fillRect(x + 24, topY + 4, 4, 4);
    }

    // Arm
    ctx.fillStyle = colors.dino;
    ctx.fillRect(x + 24, topY + 16, 6, 3);

    // Legs (running / jumping animation)
    if (jumping) {
      // Tucked legs
      ctx.fillRect(x + 8, y - 4, 5, 6);
      ctx.fillRect(x + 18, y - 4, 5, 6);
    } else {
      const step = Math.floor(frame / 6) % 2 === 0;
      ctx.fillRect(x + 8, step ? y - 2 : y, 5, step ? 6 : 4);
      ctx.fillRect(x + 18, step ? y : y - 2, 5, step ? 4 : 6);
    }
  }

  ctx.restore();
}

/** Render Obstacle (Cactus cluster or Pterodactyl) */
export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  frame: number,
  colors: ThemeColors
) {
  ctx.save();
  const oy = obs.y - obs.h;

  if (obs.type === "bird" || obs.type === "pterodactyl") {
    // Pterodactyl vector sprite
    ctx.fillStyle = colors.bird;
    const flap = Math.floor((frame + obs.x) / 10) % 2 === 0;

    // Body
    ctx.beginPath();
    ctx.ellipse(obs.x + obs.w / 2, oy + obs.h / 2, obs.w / 2, obs.h / 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.beginPath();
    ctx.moveTo(obs.x + 8, oy + obs.h / 2);
    ctx.lineTo(obs.x + obs.w / 2, flap ? oy - 6 : oy + obs.h + 6);
    ctx.lineTo(obs.x + obs.w - 8, oy + obs.h / 2);
    ctx.fill();

    // Beak
    ctx.fillRect(obs.x - 4, oy + obs.h / 2 - 2, 6, 4);
  } else {
    // Stylized Cactus
    ctx.fillStyle = colors.cactus;
    // Main stem
    ctx.beginPath();
    ctx.roundRect(obs.x + obs.w * 0.3, oy, obs.w * 0.4, obs.h, 4);
    ctx.fill();

    // Side arms
    if (obs.w > 18) {
      ctx.beginPath();
      ctx.roundRect(obs.x, oy + obs.h * 0.3, obs.w * 0.35, obs.h * 0.25, 3);
      ctx.roundRect(obs.x + obs.w * 0.65, oy + obs.h * 0.45, obs.w * 0.35, obs.h * 0.25, 3);
      ctx.fill();
    }
  }

  ctx.restore();
}

/** Render Particles */
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  ctx.save();
  for (const p of particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.restore();
}

/** Render Power-ups */
export function drawPowerUp(ctx: CanvasRenderingContext2D, p: PowerUp, frame: number) {
  ctx.save();
  const floatY = p.y + Math.sin(frame * 0.1) * 3;
  ctx.translate(p.x, floatY);

  // Outer glow container
  ctx.fillStyle = p.type === "shield" ? "#38BDF8" : p.type === "jetpack" ? "#F59E0B" : "#A855F7";
  ctx.beginPath();
  ctx.arc(10, 10, 12, 0, Math.PI * 2);
  ctx.fill();

  // Icon symbol
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const icon = p.type === "shield" ? "🛡" : p.type === "jetpack" ? "🚀" : "⏳";
  ctx.fillText(icon, 10, 10);

  ctx.restore();
}

/** Render Floating Popups (+100, Near Miss) */
export function drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[]) {
  ctx.save();
  for (const t of texts) {
    ctx.fillStyle = t.color;
    ctx.globalAlpha = Math.max(0, t.alpha);
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(t.text, t.x, t.y);
  }
  ctx.restore();
}
