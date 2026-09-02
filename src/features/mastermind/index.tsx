import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

const COLORS = ["#e53935","#fb8c00","#fdd835","#43a047","#1e88e5","#8e24aa"];
const rand = () => Array.from({ length: 4 }, () => Math.floor(Math.random()*6));

export default function Mastermind() {
  const [code, setCode] = useState<number[]>(rand);
  const [cur, setCur] = useState<number[]>([0,0,0,0]);
  const [guesses, setGuesses] = useState<{g:number[];b:number;w:number}[]>([]);
  const done = guesses.some(x => x.b === 4) || guesses.length >= 8;

  const submit = () => {
    if (done) return;
    let b = 0, w = 0;
    const cc = [...code], gg = [...cur];
    for (let i = 0; i < 4; i++) if (gg[i] === cc[i]) { b++; cc[i] = -1; gg[i] = -2; }
    for (let i = 0; i < 4; i++) if (gg[i] >= 0) { const j = cc.indexOf(gg[i]); if (j >= 0) { w++; cc[j] = -1; } }
    setGuesses(g => [...g, { g: [...cur], b, w }]);
  };

  const Peg = ({ c, onClick }: { c: number; onClick?: () => void }) => (
    <div onClick={onClick} style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS[c], cursor: onClick ? "pointer" : "default", border: "2px solid #222" }} />
  );

  return (
    <Panel>
      <div style={{ display: "grid", gap: 4, marginBottom: 8 }}>
        {guesses.map((x, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {x.g.map((c, j) => <Peg key={j} c={c} />)}
            <span style={{ marginLeft: 8, fontSize: 12 }}>● {x.b} ○ {x.w}</span>
          </div>
        ))}
      </div>
      <Row>{cur.map((c, i) => <Peg key={i} c={c} onClick={() => setCur(p => p.map((v,j) => j === i ? (v+1)%6 : v))} />)}</Row>
      <Row>
        <Btn onClick={submit} disabled={done}>Guess</Btn>
        <Btn onClick={() => { setCode(rand()); setGuesses([]); setCur([0,0,0,0]); }}>New</Btn>
      </Row>
      {done && <div>{guesses.some(x=>x.b===4) ? "🎉 Cracked!" : `Code was: ${code.map(c => COLORS[c]).join(" ")}`}</div>}
    </Panel>
  );
}
