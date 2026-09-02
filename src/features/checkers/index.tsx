import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
type C = 0 | 1 | 2; // 0 empty, 1 player (red), 2 cpu (black)
const N = 8;
function initial(): C[][] {
  const g: C[][] = Array.from({ length: N }, () => Array(N).fill(0));
  for (let r = 0; r < 3; r++) for (let c = 0; c < N; c++) if ((r + c) % 2 === 1) g[r][c] = 2;
  for (let r = 5; r < 8; r++) for (let c = 0; c < N; c++) if ((r + c) % 2 === 1) g[r][c] = 1;
  return g;
}
const inB = (r: number, c: number) => r >= 0 && r < N && c >= 0 && c < N;
export default function Checkers() {
  const [g, setG] = useState<C[][]>(initial);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<C>(1);
  const reset = () => { setG(initial()); setSel(null); setTurn(1); };
  const tryMove = (fr: number, fc: number, tr: number, tc: number, board: C[][]): C[][] | null => {
    if (!inB(tr, tc) || board[tr][tc] !== 0) return null;
    const piece = board[fr][fc]; const dir = piece === 1 ? -1 : 1;
    if (tr - fr === dir && Math.abs(tc - fc) === 1) { const nb = board.map((r) => [...r]); nb[tr][tc] = piece; nb[fr][fc] = 0; return nb; }
    if (tr - fr === 2 * dir && Math.abs(tc - fc) === 2) { const mr = (fr + tr) / 2, mc = (fc + tc) / 2; if (board[mr][mc] && board[mr][mc] !== piece) { const nb = board.map((r) => [...r]); nb[tr][tc] = piece; nb[fr][fc] = 0; nb[mr][mc] = 0; return nb; } }
    return null;
  };
  const cpu = (board: C[][]) => {
    const moves: { from: [number, number]; to: [number, number]; nb: C[][] }[] = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (board[r][c] === 2)
      for (const [dr, dc] of [[1, -1], [1, 1], [2, -2], [2, 2]]) { const nb = tryMove(r, c, r + dr, c + dc, board); if (nb) moves.push({ from: [r, c], to: [r + dr, c + dc], nb }); }
    if (!moves.length) return board;
    const caps = moves.filter((m) => Math.abs(m.to[0] - m.from[0]) === 2);
    const pick = (caps.length ? caps : moves)[Math.floor(Math.random() * (caps.length ? caps.length : moves.length))];
    return pick.nb;
  };
  const click = (r: number, c: number) => {
    if (turn !== 1) return;
    if (sel) { const nb = tryMove(sel[0], sel[1], r, c, g); if (nb) { setG(nb); setSel(null); setTurn(2); setTimeout(() => { setG((cur) => cpu(cur)); setTurn(1); }, 350); return; } setSel(null); }
    if (g[r][c] === 1) setSel([r, c]);
  };
  return (
    <Panel>
      <Row><b>Checkers</b><span style={{ marginLeft: "auto" }}>{turn === 1 ? "Your move" : "CPU…"}</span><Btn onClick={reset}>Reset</Btn></Row>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${N}, 1fr)`, gap: 0, width: 320, margin: "0 auto" }}>
        {g.flatMap((row, r) => row.map((v, c) => {
          const dark = (r + c) % 2 === 1; const isSel = sel && sel[0] === r && sel[1] === c;
          return <div key={`${r}-${c}`} onClick={() => click(r, c)} style={{ aspectRatio: "1", background: dark ? "var(--vlc-bg-elevated)" : "var(--vlc-bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", outline: isSel ? "2px solid var(--vlc-accent)" : "none" }}>
            {v !== 0 && <div style={{ width: "70%", height: "70%", borderRadius: "50%", background: v === 1 ? "var(--vlc-accent)" : "var(--vlc-text-primary)" }} />}
          </div>;
        }))}
      </div>
    </Panel>
  );
}
