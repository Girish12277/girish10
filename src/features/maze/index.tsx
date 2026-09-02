import { useEffect, useMemo, useState } from "react";
import { Panel, Btn } from "../_shared/ui";

const N = 11;
type Cell = { walls: [boolean,boolean,boolean,boolean] }; // N E S W

function gen(): boolean[][] {
  const grid: Cell[][] = Array.from({ length: N }, () => Array.from({ length: N }, () => ({ walls: [true,true,true,true] })));
  const vis = Array.from({ length: N }, () => Array(N).fill(false));
  const stack: [number,number][] = [[0,0]]; vis[0][0] = true;
  const D: [number,number,number,number][] = [[0,-1,0,2],[1,0,1,3],[0,1,2,0],[-1,0,3,1]];
  while (stack.length) {
    const [x,y] = stack[stack.length-1];
    const nb = D.map(([dx,dy,a,b]) => ({dx,dy,a,b})).filter(({dx,dy}) => {
      const nx=x+dx, ny=y+dy; return nx>=0&&ny>=0&&nx<N&&ny<N&&!vis[ny][nx];
    });
    if (!nb.length) { stack.pop(); continue; }
    const { dx,dy,a,b } = nb[Math.floor(Math.random()*nb.length)];
    grid[y][x].walls[a] = false; grid[y+dy][x+dx].walls[b] = false;
    vis[y+dy][x+dx] = true; stack.push([x+dx, y+dy]);
  }
  // render as wall map (2N+1 x 2N+1)
  const M = 2*N+1;
  const w: boolean[][] = Array.from({ length: M }, () => Array(M).fill(true));
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    w[2*y+1][2*x+1] = false;
    if (!grid[y][x].walls[0]) w[2*y][2*x+1] = false;
    if (!grid[y][x].walls[1]) w[2*y+1][2*x+2] = false;
    if (!grid[y][x].walls[2]) w[2*y+2][2*x+1] = false;
    if (!grid[y][x].walls[3]) w[2*y+1][2*x] = false;
  }
  return w;
}

export default function Maze() {
  const [seed, setSeed] = useState(0);
  const walls = useMemo(gen, [seed]);
  const M = walls.length;
  const [p, setP] = useState<[number,number]>([1,1]);
  const goal: [number,number] = [M-2, M-2];

  useEffect(() => { setP([1,1]); }, [seed]);
  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      setP(([y,x]) => {
        let ny = y, nx = x;
        if (e.key === "ArrowUp") ny--; else if (e.key === "ArrowDown") ny++;
        else if (e.key === "ArrowLeft") nx--; else if (e.key === "ArrowRight") nx++; else return [y,x];
        if (walls[ny]?.[nx] === false) return [ny,nx];
        return [y,x];
      });
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, [walls]);

  const won = p[0] === goal[0] && p[1] === goal[1];
  const sz = 16;
  return (
    <Panel>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${M},${sz}px)`, gap: 0 }}>
        {walls.flatMap((row, y) => row.map((w, x) => {
          const here = p[0]===y && p[1]===x;
          const isGoal = goal[0]===y && goal[1]===x;
          return <div key={`${y}-${x}`} style={{ width: sz, height: sz, background: here ? "var(--vlc-accent)" : isGoal ? "var(--vlc-good, #43a047)" : w ? "var(--vlc-bg-surface)" : "var(--vlc-text-primary)" }} />;
        }))}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <Btn onClick={() => setSeed(s => s+1)}>New Maze</Btn>
        {won && <span>🏆 Solved!</span>}
      </div>
    </Panel>
  );
}
