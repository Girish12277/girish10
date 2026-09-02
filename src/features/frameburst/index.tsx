import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { getMedia, NoMedia } from "../_shared/media";

export default function FrameBurst() {
  const [shots, setShots] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const m = getMedia();
  if (!m) return <NoMedia />;
  const run = async (count = 8, gap = 250) => {
    const v = m as HTMLVideoElement;
    if (!v.videoWidth) return;
    setBusy(true); setShots([]);
    const out: string[] = [];
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    for (let i = 0; i < count; i++) {
      ctx.drawImage(v, 0, 0);
      out.push(c.toDataURL("image/jpeg", 0.7));
      await new Promise((r) => setTimeout(r, gap));
    }
    setShots(out); setBusy(false);
  };
  return (
    <Panel>
      <Row><strong>Frame Burst</strong></Row>
      <Row>
        <Btn onClick={() => run(8, 250)} disabled={busy}>8 × 250 ms</Btn>
        <Btn onClick={() => run(16, 500)} disabled={busy}>16 × 500 ms</Btn>
      </Row>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
        {shots.map((s, i) => <a key={i} href={s} download={`burst-${i}.jpg`}><img src={s} alt="" style={{ width: "100%", borderRadius: 3 }} /></a>)}
      </div>
    </Panel>
  );
}
