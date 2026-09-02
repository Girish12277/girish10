import { useEffect, useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

export default function Pomodoro() {
  const [mode, setMode] = useState<"work"|"break">("work");
  const [left, setLeft] = useState(25*60);
  const [run, setRun] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setLeft(l => {
      if (l <= 1) {
        const next = mode === "work" ? "break" : "work";
        setMode(next);
        if (mode === "work") setCycles(c => c+1);
        return next === "work" ? 25*60 : 5*60;
      }
      return l - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [run, mode]);

  const m = Math.floor(left/60), s = left % 60;
  return (
    <Panel>
      <div style={{ textAlign: "center", textTransform: "uppercase", color: mode==="work"?"#e53935":"#43a047", letterSpacing: 2, marginTop: 4 }}>{mode}</div>
      <div style={{ fontSize: 56, fontFamily: "monospace", textAlign: "center", margin: "8px 0" }}>{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</div>
      <Row>
        <Btn onClick={() => setRun(r => !r)}>{run ? "Pause" : "Start"}</Btn>
        <Btn onClick={() => { setRun(false); setMode("work"); setLeft(25*60); }}>Reset</Btn>
        <span>🍅 {cycles}</span>
      </Row>
    </Panel>
  );
}
