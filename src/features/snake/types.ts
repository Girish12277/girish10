/**
 * Types & Schemas for Level 100 Snake Classic Engine
 */

export type Position = { x: number; y: number };
export type Vector = { x: number; y: number };

export type GameMode = "classic" | "campaign" | "timeattack" | "airival";

export type SnakeSkinId = "neon" | "dragon" | "plasma" | "phantom" | "pixel";

export type PowerUpType = "nitro" | "shield" | "magnet" | "timefreeze" | "bomb";

export type FoodType = "standard" | "golden" | "multiplier" | "timebonus" | PowerUpType;

export interface FoodItem {
  id: string;
  x: number;
  y: number;
  type: FoodType;
  expiresAt?: number;
}

export interface Portal {
  entry: Position;
  exit: Position;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export interface SnakeSkin {
  id: SnakeSkinId;
  name: string;
  headColor: string;
  bodyColor: string;
  tailColor: string;
  glowColor: string;
  eyeColor: string;
}

export const SKINS: Record<SnakeSkinId, SnakeSkin> = {
  neon: {
    id: "neon",
    name: "Neon Cyber",
    headColor: "#06b6d4",
    bodyColor: "#3b82f6",
    tailColor: "#8b5cf6",
    glowColor: "rgba(6, 182, 212, 0.75)",
    eyeColor: "#ffffff",
  },
  dragon: {
    id: "dragon",
    name: "Golden Dragon",
    headColor: "#f59e0b",
    bodyColor: "#eab308",
    tailColor: "#ef4444",
    glowColor: "rgba(245, 158, 11, 0.8)",
    eyeColor: "#ffffff",
  },
  plasma: {
    id: "plasma",
    name: "Plasma Viper",
    headColor: "#10b981",
    bodyColor: "#06b6d4",
    tailColor: "#6366f1",
    glowColor: "rgba(16, 185, 129, 0.8)",
    eyeColor: "#a7f3d0",
  },
  phantom: {
    id: "phantom",
    name: "Void Phantom",
    headColor: "#ec4899",
    bodyColor: "#a855f7",
    tailColor: "#6366f1",
    glowColor: "rgba(236, 72, 153, 0.8)",
    eyeColor: "#fbcfe8",
  },
  pixel: {
    id: "pixel",
    name: "3310 Retro",
    headColor: "#4ade80",
    bodyColor: "#22c55e",
    tailColor: "#15803d",
    glowColor: "rgba(74, 222, 128, 0.6)",
    eyeColor: "#052e16",
  },
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "first-eat", title: "First Blood", desc: "Eat your first apple", icon: "🍎", unlocked: false },
  { id: "score-50", title: "Rising Star", desc: "Reach 50 points", icon: "⭐", unlocked: false },
  { id: "score-100", title: "Century Club", desc: "Reach 100 points", icon: "👑", unlocked: false },
  { id: "golden-god", title: "Golden God", desc: "Eat 3 Golden Apples", icon: "🟡", unlocked: false },
  { id: "ghost-rider", title: "Ghost Rider", desc: "Pass through your tail with Phase Shield", icon: "👻", unlocked: false },
  { id: "speed-demon", title: "Speed Demon", desc: "Survive 10 seconds in Nitro Boost", icon: "🚀", unlocked: false },
  { id: "portal-master", title: "Portal Master", desc: "Teleport through a warp portal", icon: "🌀", unlocked: false },
  { id: "magneto", title: "Magneto", desc: "Attract 5 apples using Magnetic Pull", icon: "🧲", unlocked: false },
];
