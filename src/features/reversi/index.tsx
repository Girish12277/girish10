import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
type C = 0 | 1 | 2; const N = 8;
const DIR = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
function initial(): C[][] { const g: C[][] = Array.from({length:N},()=>Array(N).fill(0)); g[3][3]=g[4][4]=1; g[3][4]=g[4][3]=2; return g; }
function flips(g: C[][], r: number, c: number, p: C) {
  if (g[r][c] !== 0) return [];
  const o = p === 1 ? 2 : 1; const all: [number, number][] = [];
  for (const [dr, dc] of DIR) { const line: [number, number][] = []; let rr = r + dr, cc = c + dc; while (rr >= 0 && rr < N && cc >= 0 && cc < N && g[rr][cc] === o) { line.push([rr, cc]); rr += dr; cc += dc; } if (line.length && rr >= 0 && rr < N && cc >= 0 && cc < N && g[rr][cc] === p) all.push(...line); }
  return all;
}
const validMoves = (g: C[][], p: C) => { const m: [number, number][] = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (flips(g, r, c, p).length) m.push([r, c]); return m; };
export default function Reversi() {
  const [g, setG] = useState<C[][]>(initial);
  const [turn, setTurn] = useState<C>(1);
  const reset = () => { setG(initial()); setTurn(1); };
  const play = (r: number, c: number) => {
    if (turn !== 1) return; const fl = flips(g, r, c, 1); if (!fl.length) return;
    const nb = g.map((row) => [...row]) as C[][]; nb[r][c] = 1; fl.forEach(([rr, cc]) => nb[rr][cc] = 1); setG(nb); setTurn(2);
    setTimeout(() => { setG((cur) => { const mv = validMoves(cur, 2); if (!mv.length) { setTurn(1); return cur; } let best = mv[0], bs = -1; for (const m of mv) { const sc = flips(cur, m[0], m[1], 2).length; if (sc > bs) { bs = sc; best = m; } } const nb2 = cur.map((row) => [...row]) as C[][]; nb2[best[0]][best[1]] = 2; flips(cur, best[0], best[1], 2).forEach(([rr, cc]) => nb2[rr][cc] = 2); setTurn(1); return nb2; }); }, 350);
  };
  const counts = g.flat().reduce((a, v) => { if (v === 1) a[0]++; if (v === 2) a[1]++; return a; }, [0, 0]);
  return (<Panel><Row><b>Reversi</b><span style={{ marginLeft: "auto" }}>You {counts[0]} · CPU {counts[1]}</span><Btn onClick={reset}>Reset</Btn></Row>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${N},1fr)`, width: 320, margin: "0 auto", background: "var(--vlc-accent-dim)", padding: 2, gap: 2 }}>
      {g.flatMap((row, r) => row.map((v, c) => <div key={`${r}-${c}`} onClick={() => play(r, c)} style={{ aspectRatio: "1", background: "var(--vlc-bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{v !== 0 && <div style={{ width: "78%", height: "78%", borderRadius: "50%", background: v === 1 ? "var(--vlc-accent)" : "var(--vlc-text-primary)" }} />}</div>))}
    </div></Panel>);
}
