export type CursorStyleId =
  | "auto"
  | "arrow"
  | "hand"
  | "crosshair"
  | "text"
  | "grab"
  | "move"
  | "cell"
  | "zoom"
  | "help";

export const CURSOR_STYLES: Array<{ id: CursorStyleId; label: string; hint: string; css: string }> = [
  { id: "auto", label: "Auto", hint: "Browser default", css: "auto" },
  { id: "arrow", label: "Arrow", hint: "Precise desktop pointer", css: "default" },
  { id: "hand", label: "Hand", hint: "Always interactive", css: "pointer" },
  { id: "crosshair", label: "Crosshair", hint: "Frame-accurate aiming", css: "crosshair" },
  { id: "text", label: "Text beam", hint: "Note-taking feel", css: "text" },
  { id: "grab", label: "Grab", hint: "Media handling", css: "grab" },
  { id: "move", label: "Move", hint: "Editing workspace", css: "move" },
  { id: "cell", label: "Grid", hint: "Study planner mode", css: "cell" },
  { id: "zoom", label: "Zoom", hint: "Inspection mode", css: "zoom-in" },
  { id: "help", label: "Help", hint: "Discovery mode", css: "help" },
];

export function cursorCssFor(id: CursorStyleId | string | undefined): string {
  return CURSOR_STYLES.find((style) => style.id === id)?.css ?? "auto";
}