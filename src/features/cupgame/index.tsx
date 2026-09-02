import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

export default function CupGame() {
  const [ball, setBall] = useState(() => Math.floor(Math.random()*3));
  const [phase, setPhase] = useState<"hidden"|"shuffling"|"pick"|"done">("hidden");
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ w: 0, l: 0 });

  const start = () => {
    setPhase("shuffling"); setPicked(null);
    setTimeout(() => { setBall(Math.floor(Math.random()*3)); setPhase("pick"); }, 1200);
  };
  const pick = (i: number) => {
    if (phase !== "pick") return;
    setPicked(i); setPhase("done");
    setScore(s => i === ball ? { ...s, w: s.w+1 } : { ...s, l: s.l+1 });
  };

  return (
    <Panel>
      <Row><span>Wins: {score.w}</span><span>Losses: {score.l}</span></Row>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "20px 0" }}>
        {[0,1,2].map(i => (
          <div key={i} onClick={() => pick(i)} style={{ width: 70, height: 80, background: "#5d4037", borderRadius: "40px 40px 6px 6px", cursor: phase==="pick"?"pointer":"default", display: "grid", placeItems: "end center", color: "#fff", paddingBottom: 6, fontSize: 22 }}>
            {phase === "done" && i === ball ? "🎾" : phase === "hidden" && i === ball ? "🎾" : ""}
          </div>
        ))}
      </div>
      <Row>
        <Btn onClick={start}>{phase === "hidden" ? "Start" : "Shuffle"}</Btn>
        {phase === "done" && <span>{picked === ball ? "🎉 You won!" : "😅 Try again"}</span>}
      </Row>
    </Panel>
  );
}
