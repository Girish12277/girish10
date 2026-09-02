import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

const JUMP: Record<number, number> = { 4: 14, 9: 31, 17: 7, 20: 38, 28: 84, 40: 59, 51: 67, 54: 34, 62: 19, 64: 60, 71: 91, 87: 24, 93: 73, 95: 75, 99: 78 };

export default function SnakesLadders() {
  const [p1, setP1] = useState(1);
  const [p2, setP2] = useState(1);
  const [turn, setTurn] = useState<1|2>(1);
  const [die, setDie] = useState(0);
  const [msg, setMsg] = useState("");

  const roll = () => {
    if (msg) return;
    const d = 1 + Math.floor(Math.random()*6);
    setDie(d);
    const cur = turn === 1 ? p1 : p2;
    let next = cur + d;
    if (next > 100) next = cur;
    if (JUMP[next] != null) next = JUMP[next];
    (turn === 1 ? setP1 : setP2)(next);
    if (next === 100) setMsg(`Player ${turn} wins!`);
    else setTurn(turn === 1 ? 2 : 1);
  };

  return (
    <Panel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 30px)", gap: 1, marginBottom: 8 }}>
        {Array.from({length:100},(_,i)=>{
          const row = Math.floor(i/10);
          const n = row*10 + (row%2 === 0 ? 10 - i%10 : i%10 + 1);
          const here = (n === p1 || n === p2);
          return <div key={i} style={{ width: 30, height: 30, fontSize: 10, display: "grid", placeItems: "center", background: JUMP[n]!=null ? (JUMP[n]>n?"#43a047":"#c62828") : "var(--vlc-bg-elevated)", color: "#fff", border: "1px solid #222" }}>
            {here ? (n===p1 && n===p2 ? "①②" : n===p1 ? "①" : "②") : n}
          </div>;
        }).reverse()}
      </div>
      <Row><Btn onClick={roll} disabled={!!msg}>Roll (P{turn})</Btn><span>Die: {die || "—"}</span><span>{msg}</span></Row>
      {msg && <Btn onClick={() => { setP1(1); setP2(1); setTurn(1); setDie(0); setMsg(""); }}>New</Btn>}
    </Panel>
  );
}
