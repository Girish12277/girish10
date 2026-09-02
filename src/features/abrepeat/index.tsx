import { useEffect, useRef, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, useMediaTime, NoMedia, fmtTime } from "../_shared/media";

export default function ABRepeat() {
  const m = useMedia();
  const t = useMediaTime(m);
  const [a, setA] = useState<number | null>(null);
  const [b, setB] = useState<number | null>(null);
  const onRef = useRef(false);

  useEffect(() => {
    if (!m || a == null || b == null || a >= b) return;
    const id = window.setInterval(() => {
      if (m.currentTime >= b) { m.currentTime = a; onRef.current = true; }
    }, 100);
    return () => window.clearInterval(id);
  }, [m, a, b]);

  if (!m) return <NoMedia />;
  return (
    <Panel>
      <Row><strong>A↔B Repeat</strong></Row>
      <Row><span>Now: {fmtTime(t.cur)} / {fmtTime(t.dur)}</span></Row>
      <Row>
        <Btn onClick={() => setA(m.currentTime)}>Set A {a != null ? `(${fmtTime(a)})` : ""}</Btn>
        <Btn onClick={() => setB(m.currentTime)}>Set B {b != null ? `(${fmtTime(b)})` : ""}</Btn>
        <Btn onClick={() => { setA(null); setB(null); }}>Clear</Btn>
      </Row>
      <Row><span style={{ fontSize: 11, opacity: 0.7 }}>Loops automatically while A and B are set.</span></Row>
    </Panel>
  );
}
