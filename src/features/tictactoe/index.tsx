import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

type C = "X" | "O" | "";
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winner(b: C[]): C | null { for (const [a,c,d] of LINES) if (b[a] && b[a]===b[c] && b[a]===b[d]) return b[a]; return b.every(x=>x)?"":null; }
function cpu(b: C[]): number { const empty = b.map((v,i)=>v?-1:i).filter(i=>i>=0); for (const i of empty){const t=[...b];t[i]="O";if(winner(t)==="O")return i;} for(const i of empty){const t=[...b];t[i]="X";if(winner(t)==="X")return i;} return empty[Math.floor(Math.random()*empty.length)]; }

export default function TicTacToe() {
  const [b, setB] = useState<C[]>(Array(9).fill(""));
  const [turn, setTurn] = useState<C>("X");
  const w = winner(b);
  const play = (i: number) => {
    if (b[i] || w) return;
    const nb = [...b]; nb[i] = turn; setB(nb);
    if (winner(nb)) return;
    setTimeout(() => { const j = cpu(nb); if (j>=0) { const nb2 = [...nb]; nb2[j] = "O"; setB(nb2); } }, 250);
  };
  return (
    <Panel>
      <Row>You: X · CPU: O · {w==="X"?"You win!":w==="O"?"CPU wins":w===""?"Draw":"Your move"}</Row>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, maxWidth: 240, margin: "0 auto" }}>
        {b.map((c,i)=>(<button key={i} onClick={()=>play(i)} style={{ aspectRatio: "1", fontSize: 32, fontWeight: 800, background:"var(--vlc-bg-elevated)", color: c==="X"?"#5cdb95":"#ff6b9d", border:"1px solid var(--vlc-border-normal)", borderRadius:8, cursor:"pointer" }}>{c}</button>))}
      </div>
      <Row style={{ marginTop: 12, justifyContent: "center" }}><Btn onClick={()=>{setB(Array(9).fill(""));setTurn("X");}}>New Game</Btn></Row>
    </Panel>
  );
}
