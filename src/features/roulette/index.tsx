import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

const REDS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

export default function Roulette() {
  const [bet, setBet] = useState<"red"|"black"|"odd"|"even"|null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [bal, setBal] = useState(100);

  const spin = () => {
    if (!bet || bal < 10) return;
    const n = Math.floor(Math.random()*37);
    setResult(n);
    let win = false;
    if (bet === "red") win = REDS.has(n);
    if (bet === "black") win = n !== 0 && !REDS.has(n);
    if (bet === "odd") win = n !== 0 && n % 2 === 1;
    if (bet === "even") win = n !== 0 && n % 2 === 0;
    setBal(b => b + (win ? 10 : -10));
  };

  const color = result == null ? "#666" : result === 0 ? "#2e7d32" : REDS.has(result) ? "#c62828" : "#222";
  return (
    <Panel>
      <div style={{ display: "grid", placeItems: "center", width: 120, height: 120, margin: "8px auto", borderRadius: "50%", background: color, fontSize: 36, fontWeight: 700 }}>{result ?? "—"}</div>
      <Row><span>Balance: ${bal}</span></Row>
      <Row>
        {(["red","black","odd","even"] as const).map(b => (
          <Btn key={b} active={bet === b} onClick={() => setBet(b)}>{b}</Btn>
        ))}
      </Row>
      <Btn onClick={spin} disabled={!bet || bal < 10}>Spin ($10)</Btn>
    </Panel>
  );
}
