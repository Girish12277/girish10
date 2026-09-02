import { lazy, type LazyExoticComponent, type ComponentType } from "react";

export type FeatureCategory = "Games" | "Tools";

export interface FeatureDef {
  id: string;
  title: string;
  category: FeatureCategory;
  description: string;
  width?: number;
  height?: number;
  loader: () => Promise<{ default: ComponentType }>;
}

export const FEATURES: FeatureDef[] = [
  { id: "scicalc", title: "Scientific Calculator", category: "Tools", description: "TCS iON Scientific Calculator", width: 520, loader: () => import("./scicalc") },
  { id: "dino", title: "Dino Runner", category: "Games", description: "Chrome offline dino — Space to jump", width: 640, loader: () => import("./dino") },
  { id: "snake", title: "Snake Classic", category: "Games", description: "Arrow keys / WASD", width: 460, loader: () => import("./snake") },
  { id: "tictactoe", title: "Tic-Tac-Toe", category: "Games", description: "Beat the CPU", width: 440, loader: () => import("./tictactoe") },
  { id: "dice", title: "Dice Roller", category: "Games", description: "1–6 dice, animated", width: 360, loader: () => import("./dice") },
];

const componentCache: Record<string, LazyExoticComponent<ComponentType>> = {};

export function getFeatureComponent(id: string): LazyExoticComponent<ComponentType> | null {
  const def = FEATURES.find((f) => f.id === id);
  if (!def) return null;
  if (!componentCache[id]) {
    componentCache[id] = lazy(def.loader);
  }
  return componentCache[id];
}
