export type DinoTheme = "classic" | "cyberpunk" | "sunset" | "neon" | "volcano";

export type ObstacleType = "cactus_small" | "cactus_large" | "pterodactyl" | "meteor";

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: ObstacleType;
  passed?: boolean;
  flyFrame?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: "circle" | "square" | "spark";
}

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: "shield" | "jetpack" | "slowmo" | "double_points";
  collected?: boolean;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export interface HighScoreEntry {
  score: number;
  date: string;
  maxSpeed: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}
