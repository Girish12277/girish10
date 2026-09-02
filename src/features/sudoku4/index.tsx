import { useMemo, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
const PUZZLES = [
  [[1,0,0,4],[0,0,1,0],[0,3,0,0],[4,0,0,2]],
  [[0,2,0,4],[3,0,0,0],[0,0,0,1],[2,0,3,0]],
  [[0,0,3,0],[0,4,0,2],[2,0,1,0],[0,3,0,0]],
];
const SOL = (p: number[][]) => {
  const g = p.map((r) => [...r]);
  const ok = (r: number, c: number, v: number) => { for (let i = 0; i < 4; i++) if (g[r][i] === v || g[i][c] === v) return false; const br = Math.floor(r / 2) * 2, bc = Math.floor(c / 2) * 2; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (g[br + i][bc + j] === v) return false; return true; };
  const solve = (): boolean => { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!g[r][c]) { for (let v = 1; v <= 4; v++) if (ok(r, c, v)) { g[r][c] = v; if (solve()) return true; g[r][c] = 0; } return false; } return true; };
  solve(); return g;
};
export default function Sudoku4() {
  const [pid, setPid] = useState(0);
  const init = useMemo(() => PUZZLES[pid].map((r) => [...r]), [pid]);
  const sol = useMemo(() => SOL(PUZZLES[pid]), [pid]);
  const [g, setG] = useState<number[][]>(init);
  const solved = g.every((r, ri) => r.every((v, ci) => v === sol[ri][ci]));
  return (<Panel><Row><b>Mini Sudoku 4×4</b><span style={{ marginLeft: "auto" }}>{solved ? "✓ Solved" : "Fill 1–4"}</span><Btn onClick={() => { const n = (pid + 1) % PUZZLES.length; setPid(n); setG(PUZZLES[n].map((r) => [...r])); }}>Next</Btn></Row>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", width: 220, margin: "0 auto", gap: 0, border: "2px solid var(--vlc-accent)" }}>
      {g.flatMap((row, r) => row.map((v, c) => {
        const fixed = init[r][c] !== 0;
        const ok = v === 0 || v === sol[r][c];
        return <input key={`${r}-${c}`} disabled={fixed} value={v || ""} onChange={(e) => { const n = parseInt(e.target.value) || 0; if (n >= 0 && n <= 4) { const ng = g.map((rr) => [...rr]); ng[r][c] = n; setG(ng); } }}
          style={{ aspectRatio: "1", textAlign: "center", fontSize: 22, fontWeight: 700, border: "1px solid var(--vlc-border-normal)", borderRight: c % 2 === 1 ? "2px solid var(--vlc-accent)" : undefined, borderBottom: r % 2 === 1 ? "2px solid var(--vlc-accent)" : undefined, background: fixed ? "var(--vlc-bg-elevated)" : "var(--vlc-bg-base)", color: ok ? "var(--vlc-text-primary)" : "var(--vlc-bad, #ff4d6d)" }} />;
      }))}
    </div></Panel>);
}
