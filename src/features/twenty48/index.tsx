import { useCallback, useEffect, useState } from "react";
import { loadHigh, saveHigh, GameStatusBar, usePaletteRef } from "../_shared/GameShell";

type Grid = number[][];
const N = 4;

const empty = (): Grid => Array.from({ length: N }, () => Array(N).fill(0));
const clone = (g: Grid): Grid => g.map((r) => [...r]);
const addRandom = (g: Grid) => {
  const empties: [number, number][] = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (g[r][c] === 0) empties.push([r, c]);
  if (!empties.length) return;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
};
const compress = (row: number[]): [number[], number] => {
  const a = row.filter((v) => v);
  let gained = 0;
  for (let i = 0; i < a.length - 1; i++) if (a[i] === a[i + 1]) { a[i] *= 2; gained += a[i]; a[i + 1] = 0; }
  const b = a.filter((v) => v);
  while (b.length < N) b.push(0);
  return [b, gained];
};
const rotate = (g: Grid): Grid => g[0].map((_, i) => g.map((r) => r[N - 1 - i]));
const move = (g: Grid, dir: "L" | "R" | "U" | "D"): { g: Grid; gained: number; moved: boolean } => {
  let h = clone(g);
  const rots = dir === "L" ? 0 : dir === "U" ? 1 : dir === "R" ? 2 : 3;
  for (let i = 0; i < rots; i++) h = rotate(h);
  let gained = 0;
  const out = h.map((r) => { const [nr, g2] = compress(r); gained += g2; return nr; });
  let res = out;
  for (let i = 0; i < (4 - rots) % 4; i++) res = rotate(res);
  const moved = JSON.stringify(res) !== JSON.stringify(g);
  return { g: res, gained, moved };
};
const canMove = (g: Grid): boolean => (["L", "R", "U", "D"] as const).some((d) => move(g, d).moved);

export default function T2048() {
  const palRef = usePaletteRef();
  const init = (): Grid => { const g = empty(); addRandom(g); addRandom(g); return g; };
  const [grid, setGrid] = useState<Grid>(init);
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(() => loadHigh("2048-high"));
  const [hist, setHist] = useState<{ g: Grid; s: number }[]>([]);

  const reset = useCallback(() => { setGrid(init()); setScore(0); setHist([]); }, []);

  const tryMove = useCallback((dir: "L" | "R" | "U" | "D") => {
    setGrid((g) => {
      const r = move(g, dir);
      if (!r.moved) return g;
      setHist((h) => [...h.slice(-9), { g: clone(g), s: score }]);
      setScore((s) => {
        const ns = s + r.gained;
        if (ns > high) { setHigh(ns); saveHigh("2048-high", ns); }
        return ns;
      });
      addRandom(r.g);
      return r.g;
    });
  }, [score, high]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") { e.preventDefault(); tryMove("L"); }
      else if (e.code === "ArrowRight") { e.preventDefault(); tryMove("R"); }
      else if (e.code === "ArrowUp") { e.preventDefault(); tryMove("U"); }
      else if (e.code === "ArrowDown") { e.preventDefault(); tryMove("D"); }
      else if (e.code === "KeyZ" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setHist((h) => { if (!h.length) return h; const last = h[h.length - 1]; setGrid(last.g); setScore(last.s); return h.slice(0, -1); });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tryMove]);

  const dead = !canMove(grid);
  const tileColor = (v: number) => {
    if (!v) return { bg: "rgba(255,255,255,0.04)", fg: "transparent" };
    const palette = [palRef.current.accent, palRef.current.good, palRef.current.warn, "#ef476f", "#ff9f1c", "#a05195", "#06d6a0", "#ffd60a"];
    const idx = Math.min(palette.length - 1, Math.log2(v) - 1);
    return { bg: palette[idx], fg: "#0b1020" };
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${N}, 1fr)`, gap: 8, padding: 16, background: "#0b1020" }}>
        {grid.flatMap((row, r) => row.map((v, c) => {
          const col = tileColor(v);
          return <div key={`${r}-${c}`} style={{ height: 78, background: col.bg, color: col.fg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--vlc-font-mono)", fontWeight: 700, fontSize: v >= 1024 ? 20 : 26, transition: "background 120ms" }}>{v || ""}</div>;
        }))}
      </div>
      {dead && <div className="text-center py-2 text-[12px]" style={{ color: "var(--vlc-accent)" }}>Game over — <button className="underline" onClick={reset}>New game</button></div>}
      <GameStatusBar
        left={<><span>Score: {score}</span>  <button className="ml-3 underline" onClick={reset}>New</button></>}
        right={`Best: ${high}`}
      />
    </div>
  );
}
