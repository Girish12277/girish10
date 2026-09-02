import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, useMediaTime, NoMedia, fmtTime } from "../_shared/media";

export default function FrameStep() {
  const m = useMedia();
  const t = useMediaTime(m);
  if (!m) return <NoMedia />;
  const step = (d: number) => { m.pause(); m.currentTime = Math.max(0, m.currentTime + d); };
  return (
    <Panel>
      <Row><strong>Frame Stepper</strong></Row>
      <Row><span>{fmtTime(t.cur)} / {fmtTime(t.dur)}</span></Row>
      <Row>
        <Btn onClick={() => step(-1)}>−1s</Btn>
        <Btn onClick={() => step(-1/30)}>−1f</Btn>
        <Btn onClick={() => m.paused ? m.play() : m.pause()}>{m.paused ? "▶" : "⏸"}</Btn>
        <Btn onClick={() => step(1/30)}>+1f</Btn>
        <Btn onClick={() => step(1)}>+1s</Btn>
      </Row>
      <Row><span style={{ fontSize: 11, opacity: 0.7 }}>Assumes ~30 fps. Use ±1s for safe scrubs.</span></Row>
    </Panel>
  );
}
