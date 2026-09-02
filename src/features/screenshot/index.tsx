import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { getMedia, NoMedia } from "../_shared/media";

export default function Screenshot() {
  const [url, setUrl] = useState<string | null>(null);
  const m = getMedia();
  if (!m) return <NoMedia />;
  const capture = () => {
    const v = m as HTMLVideoElement;
    if (!v.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    setUrl(c.toDataURL("image/png"));
  };
  return (
    <Panel>
      <Row><strong>Screenshot</strong></Row>
      <Row>
        <Btn onClick={capture}>Capture frame</Btn>
        {url && <a href={url} download={`frame-${Date.now()}.png`} style={{ color: "var(--vlc-accent)", fontSize: 12 }}>Download PNG</a>}
      </Row>
      {url && <img src={url} alt="frame" style={{ maxWidth: "100%", marginTop: 8, borderRadius: 4 }} />}
    </Panel>
  );
}
