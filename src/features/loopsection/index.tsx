import { useEffect, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, useMediaTime, NoMedia, fmtTime } from "../_shared/media";

export default function LoopSection() {
  const m = useMedia();
  const t = useMediaTime(m);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!m || !on || b <= a) return;
    const id = window.setInterval(() => { if (m.currentTime >= b) m.currentTime = a; }, 100);
    return () => window.clearInterval(id);
  }, [m, a, b, on]);
  if (!m) return <NoMedia />;
  return (
    <Panel>
      <Row><strong>Loop Section</strong></Row>
      <Row><input type="range" min={0} max={Math.max(t.dur, 1)} step={0.1} value={a} onChange={(e) => setA(+e.target.value)} style={{ flex: 1 }} /><span>A {fmtTime(a)}</span></Row>
      <Row><input type="range" min={0} max={Math.max(t.dur, 1)} step={0.1} value={b} onChange={(e) => setB(+e.target.value)} style={{ flex: 1 }} /><span>B {fmtTime(b)}</span></Row>
      <Row>
        <Btn active={on} onClick={() => setOn((v) => !v)}>{on ? "Looping" : "Loop off"}</Btn>
        <Btn onClick={() => { setA(t.cur); }}>A=now</Btn>
        <Btn onClick={() => { setB(t.cur); }}>B=now</Btn>
        <Btn onClick={() => { m.currentTime = a; }}>Jump A</Btn>
      </Row>
    </Panel>
  );
}
