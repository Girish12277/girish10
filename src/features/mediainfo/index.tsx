import { Fragment } from "react";
import { Panel, Row } from "../_shared/ui";
import { useMedia, NoMedia, fmtTime } from "../_shared/media";

export default function MediaInfo() {
  const m = useMedia();
  if (!m) return <NoMedia />;
  const v = m as HTMLVideoElement;
  const rows: [string, string][] = [
    ["Type", m.tagName.toLowerCase()],
    ["Source", m.currentSrc || m.src || "—"],
    ["Duration", fmtTime(m.duration || 0)],
    ["Resolution", v.videoWidth ? `${v.videoWidth} × ${v.videoHeight}` : "—"],
    ["Ready state", String(m.readyState)],
    ["Network state", String(m.networkState)],
    ["Volume", m.volume.toFixed(2)],
    ["Muted", String(m.muted)],
    ["Playback rate", m.playbackRate.toFixed(2)],
    ["Audio tracks", String((m as unknown as { audioTracks?: { length: number } }).audioTracks?.length ?? "—")],
    ["Text tracks", String(m.textTracks?.length ?? 0)],
    ["Buffered ranges", String(m.buffered.length)],
  ];
  return (
    <Panel>
      <Row><strong>Media Info</strong></Row>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 4, fontSize: 12 }}>
        {rows.map(([k, val]) => (<Fragment key={k}><span style={{ opacity: 0.6 }}>{k}</span><span style={{ wordBreak: "break-all" }}>{val}</span></Fragment>))}
      </div>
    </Panel>
  );
}
