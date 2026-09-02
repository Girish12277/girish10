import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, NoMedia } from "../_shared/media";

const PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4];

export default function SpeedRamp() {
  const m = useMedia();
  const [v, setV] = useState(1);
  if (!m) return <NoMedia />;
  const apply = (x: number) => { m.playbackRate = x; setV(x); };
  return (
    <Panel>
      <Row><strong>Playback Speed</strong></Row>
      <Row>
        <input type="range" min={0.1} max={4} step={0.05} value={v}
               onChange={(e) => apply(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ minWidth: 50, textAlign: "right" }}>{v.toFixed(2)}×</span>
      </Row>
      <Row>{PRESETS.map((p) => <Btn key={p} active={v === p} onClick={() => apply(p)}>{p}×</Btn>)}</Row>
    </Panel>
  );
}
