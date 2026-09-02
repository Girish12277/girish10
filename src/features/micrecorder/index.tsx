import { useEffect, useRef, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";

export default function MicRecorder() {
  const [on, setOn] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [err, setErr] = useState("");

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        setUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start(); recRef.current = rec; setOn(true);
    } catch (e) { setErr(String(e)); }
  };
  const stop = () => { recRef.current?.stop(); setOn(false); };
  useEffect(() => () => { if (recRef.current?.state === "recording") recRef.current.stop(); }, []);

  return (
    <Panel>
      <Row><strong>Mic Recorder</strong></Row>
      <Row><Btn onClick={on ? stop : start} active={on}>{on ? "Stop" : "Record"}</Btn></Row>
      {url && <audio src={url} controls style={{ width: "100%" }} />}
      {url && <Row><a href={url} download={`recording-${Date.now()}.webm`} style={{ color: "var(--vlc-accent)", fontSize: 12 }}>Download</a></Row>}
      {err && <Row><span style={{ color: "#ef4444", fontSize: 11 }}>{err}</span></Row>}
    </Panel>
  );
}
