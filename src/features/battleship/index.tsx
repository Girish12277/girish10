import { useMemo, useState } from "react";
import { Panel, Btn } from "../_shared/ui";

const N = 8;
function placeShips(): Set<string> {
  const s = new Set<string>();
  for (const len of [4,3,3,2,2]) {
    for (let tries = 0; tries < 100; tries++) {
      const horiz = Math.random() < 0.5;
      const y = Math.floor(Math.random()*N), x = Math.floor(Math.random()*N);
      const cells = Array.from({length:len},(_,i) => horiz ? `${y},${x+i}` : `${y+i},${x}`);
      if (cells.every(c => { const [a,b] = c.split(",").map(Number); return a<N&&b<N&&!s.has(c); })) {
        cells.forEach(c => s.add(c)); break;
      }
    }
  }
  return s;
}

export default function Battleship() {
  const [seed, setSeed] = useState(0);
  const ships = useMemo(placeShips, [seed]);
  const [shots, setShots] = useState<Map<string, boolean>>(new Map());
  const fire = (y: number, x: number) => {
    const k = `${y},${x}`;
    if (shots.has(k)) return;
    setShots(m => new Map(m).set(k, ships.has(k)));
  };
  const hits = [...shots.values()].filter(Boolean).length;
  const won = hits === ships.size;
  return (
    <Panel>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${N},32px)`, gap: 2, marginBottom: 8 }}>
        {Array.from({length:N*N}).map((_,i) => {
          const y = Math.floor(i/N), x = i%N, k = `${y},${x}`;
          const v = shots.get(k);
          return <button key={i} onClick={() => fire(y,x)} style={{
            width: 32, height: 32, background: v === true ? "#c62828" : v === false ? "#1565c0" : "var(--vlc-bg-elevated)",
            border: "1px solid var(--vlc-border-subtle)", borderRadius: 3,
          }}>{v === true ? "✕" : v === false ? "·" : ""}</button>;
        })}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn onClick={() => { setSeed(s=>s+1); setShots(new Map()); }}>New</Btn>
        <span>Hits: {hits}/{ships.size} {won && "— Victory!"}</span>
      </div>
    </Panel>
  );
}
