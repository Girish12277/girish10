import { useEffect, useRef, useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

const fmt = (ms: number) => {
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), c = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(c).padStart(2,"0")}`;
};

export default function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [run, setRun] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const start = useRef(0);
  const acc = useRef(0);

  useEffect(() => {
    if (!run) return;
    start.current = performance.now();
    let raf = 0;
    const tick = () => { setMs(acc.current + performance.now() - start.current); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { acc.current += performance.now() - start.current; cancelAnimationFrame(raf); };
  }, [run]);

  return (
    <Panel>
      <div style={{ fontSize: 36, fontFamily: "monospace", textAlign: "center", margin: "12px 0" }}>{fmt(ms)}</div>
      <Row>
        <Btn onClick={() => setRun(r => !r)}>{run ? "Pause" : "Start"}</Btn>
        <Btn onClick={() => setLaps(l => [ms, ...l])} disabled={!run}>Lap</Btn>
        <Btn onClick={() => { setRun(false); setMs(0); acc.current = 0; setLaps([]); }}>Reset</Btn>
      </Row>
      <div style={{ maxHeight: 140, overflow: "auto", marginTop: 8, fontFamily: "monospace", fontSize: 12 }}>
        {laps.map((l, i) => <div key={i}>{laps.length - i}. {fmt(l)}</div>)}
      </div>
    </Panel>
  );
}
