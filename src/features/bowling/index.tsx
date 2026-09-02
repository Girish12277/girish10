import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

export default function Bowling() {
  const [rolls, setRolls] = useState<number[]>([]);
  const roll = () => {
    if (rolls.length >= 20) return;
    setRolls(r => [...r, Math.floor(Math.random()*11)]);
  };
  const score = (() => {
    let s = 0, i = 0;
    for (let f = 0; f < 10 && i < rolls.length; f++) {
      if (rolls[i] === 10) { s += 10 + (rolls[i+1]||0) + (rolls[i+2]||0); i++; }
      else if ((rolls[i]||0) + (rolls[i+1]||0) === 10) { s += 10 + (rolls[i+2]||0); i += 2; }
      else { s += (rolls[i]||0) + (rolls[i+1]||0); i += 2; }
    }
    return s;
  })();
  return (
    <Panel>
      <div style={{ marginBottom: 8, fontFamily: "monospace" }}>Rolls: {rolls.join(" ") || "—"}</div>
      <div style={{ marginBottom: 8, fontSize: 24, fontWeight: 700 }}>Score: {score}</div>
      <Row>
        <Btn onClick={roll}>Roll</Btn>
        <Btn onClick={() => setRolls([])}>Reset</Btn>
      </Row>
    </Panel>
  );
}
