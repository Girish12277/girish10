import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, NoMedia } from "../_shared/media";

type PitchEl = HTMLMediaElement & { preservesPitch?: boolean; mozPreservesPitch?: boolean; webkitPreservesPitch?: boolean };

export default function PitchShift() {
  const m = useMedia() as PitchEl | null;
  const [preserve, setPreserve] = useState(true);
  const [rate, setRate] = useState(1);
  if (!m) return <NoMedia />;
  const set = (p: boolean) => {
    setPreserve(p);
    m.preservesPitch = p; m.mozPreservesPitch = p; m.webkitPreservesPitch = p;
  };
  return (
    <Panel>
      <Row><strong>Pitch / Speed</strong></Row>
      <Row>
        <Btn active={preserve} onClick={() => set(true)}>Preserve pitch</Btn>
        <Btn active={!preserve} onClick={() => set(false)}>Allow shift</Btn>
      </Row>
      <Row>
        <input type="range" min={0.5} max={2} step={0.01} value={rate}
               onChange={(e) => { const r = parseFloat(e.target.value); setRate(r); m.playbackRate = r; }} style={{ flex: 1 }} />
        <span>{rate.toFixed(2)}×</span>
      </Row>
      <Row><span style={{ fontSize: 11, opacity: 0.7 }}>With pitch-preserve off, slower = lower pitch, faster = higher.</span></Row>
    </Panel>
  );
}
