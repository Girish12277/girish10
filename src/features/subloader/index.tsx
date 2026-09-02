import { useRef, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, NoMedia } from "../_shared/media";

function parseSRT(s: string) {
  return s.replace(/\r/g, "").split(/\n\n+/).map((block) => {
    const lines = block.split("\n").filter(Boolean);
    if (lines.length < 2) return null;
    const time = lines.find((l) => l.includes("-->")); if (!time) return null;
    const [a, b] = time.split("-->").map((t) => t.trim().replace(",", "."));
    const toSec = (t: string) => { const [hh, mm, ss] = t.split(":"); return (+hh) * 3600 + (+mm) * 60 + parseFloat(ss); };
    const text = lines.slice(lines.indexOf(time) + 1).join("\n");
    return { start: toSec(a), end: toSec(b), text };
  }).filter(Boolean) as { start: number; end: number; text: string }[];
}

export default function SubLoader() {
  const m = useMedia();
  const fileRef = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState("");
  if (!m) return <NoMedia />;
  const handle = async (f: File) => {
    const cues = parseSRT(await f.text());
    setCount(cues.length);
    const id = window.setInterval(() => {
      const c = m.currentTime;
      const hit = cues.find((x) => c >= x.start && c <= x.end);
      setActive(hit?.text ?? "");
    }, 200);
    (window as unknown as { __subTimer?: number }).__subTimer && window.clearInterval((window as unknown as { __subTimer: number }).__subTimer);
    (window as unknown as { __subTimer?: number }).__subTimer = id;
  };
  return (
    <Panel>
      <Row><strong>Subtitle Loader (SRT)</strong></Row>
      <Row>
        <input ref={fileRef} type="file" accept=".srt,.vtt,text/plain" onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])} />
        {count > 0 && <span>{count} cues</span>}
      </Row>
      <div style={{ minHeight: 60, padding: 8, background: "rgba(0,0,0,0.4)", borderRadius: 4, fontSize: 14, textAlign: "center" }}>
        {active || <span style={{ opacity: 0.4 }}>— no active cue —</span>}
      </div>
    </Panel>
  );
}
