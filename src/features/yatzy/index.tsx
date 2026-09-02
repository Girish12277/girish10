import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
const rand = () => 1 + Math.floor(Math.random() * 6);
export default function Yatzy() {
  const [dice, setDice] = useState<number[]>([1, 2, 3, 4, 5]);
  const [hold, setHold] = useState<boolean[]>([false, false, false, false, false]);
  const [rolls, setRolls] = useState(3);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const roll = () => { if (rolls <= 0) return; setDice(dice.map((d, i) => hold[i] ? d : rand())); setRolls(rolls - 1); };
  const scoreOf = () => {
    const counts: Record<number, number> = {}; dice.forEach((d) => counts[d] = (counts[d] || 0) + 1);
    const vals = Object.values(counts); const sum = dice.reduce((a, b) => a + b, 0);
    if (vals.includes(5)) return 50; if (vals.includes(4)) return sum + 20; if (vals.includes(3) && vals.includes(2)) return sum + 15; if (vals.includes(3)) return sum + 5; return sum;
  };
  const finish = () => { setScore(score + scoreOf()); setHold([false, false, false, false, false]); setRolls(3); setRound(round + 1); setDice([1, 2, 3, 4, 5]); };
  return (
    <Panel>
      <Row><b>Round {round}/5</b><span style={{ marginLeft: "auto" }}>Score: {score}</span></Row>
      <Row>{dice.map((d, i) => (
        <button key={i} onClick={() => setHold(hold.map((h, j) => j === i ? !h : h))}
          style={{ width: 48, height: 48, fontSize: 22, fontWeight: 700, borderRadius: 8, border: "2px solid " + (hold[i] ? "var(--vlc-accent)" : "var(--vlc-border-normal)"), background: hold[i] ? "var(--vlc-accent-dim)" : "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", cursor: "pointer" }}>{d}</button>
      ))}</Row>
      <Row><Btn onClick={roll} disabled={rolls === 0 || round > 5}>Roll ({rolls})</Btn><Btn onClick={finish} disabled={round > 5}>End Round (+{scoreOf()})</Btn></Row>
      {round > 5 && <div style={{ marginTop: 8, color: "var(--vlc-accent)" }}>Final: {score} · <Btn onClick={() => { setScore(0); setRound(1); }}>New game</Btn></div>}
    </Panel>
  );
}
