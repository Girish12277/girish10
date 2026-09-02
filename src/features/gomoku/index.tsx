import { useState } from "react";
import { Panel, Btn } from "../_shared/ui";

const N = 9;
type Cell = 0 | 1 | 2;
const empty = (): Cell[][] => Array.from({ length: N }, () => Array(N).fill(0));

function check(b: Cell[][], p: Cell) {
  const D = [[1,0],[0,1],[1,1],[1,-1]];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (b[y][x] === p)
    for (const [dx,dy] of D) {
      let k = 1;
      while (k < 5 && b[y+dy*k]?.[x+dx*k] === p) k++;
      if (k >= 5) return true;
    }
  return false;
}

export default function Gomoku() {
  const [b, setB] = useState<Cell[][]>(empty);
  const [turn, setTurn] = useState<Cell>(1);
  const [msg, setMsg] = useState("");

  const cpu = (nb: Cell[][]) => {
    const empties: [number,number][] = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!nb[y][x]) empties.push([y,x]);
    if (!empties.length) return;
    const [y,x] = empties[Math.floor(Math.random()*empties.length)];
    nb[y][x] = 2;
    setB([...nb]);
    if (check(nb, 2)) setMsg("CPU wins");
    else setTurn(1);
  };

  const play = (y: number, x: number) => {
    if (b[y][x] || msg || turn !== 1) return;
    const nb = b.map(r => [...r]) as Cell[][];
    nb[y][x] = 1;
    setB(nb);
    if (check(nb, 1)) { setMsg("You win!"); return; }
    setTurn(2);
    setTimeout(() => cpu(nb.map(r => [...r]) as Cell[][]), 200);
  };

  return (
    <Panel>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${N},28px)`, gap: 2, marginBottom: 8 }}>
        {b.flatMap((row, y) => row.map((c, x) => (
          <button key={`${y}-${x}`} onClick={() => play(y,x)} style={{ width: 28, height: 28, background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 2, fontSize: 18 }}>
            {c === 1 ? "●" : c === 2 ? "○" : ""}
          </button>
        )))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn onClick={() => { setB(empty()); setTurn(1); setMsg(""); }}>New</Btn>
        <span>{msg || (turn === 1 ? "Your turn" : "CPU…")}</span>
      </div>
    </Panel>
  );
}
