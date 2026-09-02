export type RepeatMode = 0 | 1 | 2; // off, all, one

export interface PlaylistItem {
  id: string;
  title: string;
  src: string;
  duration?: number;
}

export interface ABLoop {
  a: number | null;
  b: number | null;
}

export interface VideoFilters {
  enabled: boolean;
  hue: number;
  saturation: number;
  contrast: number;
  brightness: number;
  gamma: number;
  rotate: number;
  zoom: number;
  flipH: boolean;
  flipV: boolean;
}

export interface EQState {
  enabled: boolean;
  preamp: number;
  bands: number[]; // 10 bands in dB
  preset: string;
}

export interface CompressorState {
  enabled: boolean;
  threshold: number;
  knee: number;
  ratio: number;
  attack: number;
  release: number;
  preGain: number;
  postGain: number;
}

export interface SyncState {
  audioDelay: number; // ms
  subtitleDelay: number; // ms
}

export interface OSDMessage {
  id: number;
  text: string;
  ts: number;
}

export type AspectRatio = "default" | "1:1" | "4:3" | "16:9" | "16:10" | "2.21:1" | "2.35:1" | "2.39:1" | "5:4";
