import { useEffect, useRef, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";

export default function Oscilloscope() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (!on) return;
    let ctx: AudioContext | null = null;
    let stream: MediaStream | null = null;
    let raf = 0;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const an = ctx.createAnalyser(); an.fftSize = 2048;
        src.connect(an);
        const buf = new Uint8Array(an.fftSize);
        const c = ref.current!; const g = c.getContext("2d")!;
        const draw = () => {
          an.getByteTimeDomainData(buf);
          g.fillStyle = "rgba(0,0,0,0.9)"; g.fillRect(0, 0, c.width, c.height);
          g.strokeStyle = "var(--vlc-accent, #22c55e)"; g.lineWidth = 1.5; g.beginPath();
          for (let i = 0; i < buf.length; i++) {
            const x = (i / buf.length) * c.width;
            const y = (buf[i] / 255) * c.height;
            if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
          }
          g.stroke();
          raf = requestAnimationFrame(draw);
        };
        draw();
      } catch (e) { setErr(String(e)); setOn(false); }
    })();
    return () => { cancelAnimationFrame(raf); ctx?.close().catch(() => {}); stream?.getTracks().forEach((t) => t.stop()); };
  }, [on]);
  return (
    <Panel>
      <Row><strong>Oscilloscope (mic)</strong></Row>
      <Row><Btn active={on} onClick={() => setOn((v) => !v)}>{on ? "Stop" : "Start"}</Btn></Row>
      <canvas ref={ref} width={480} height={140} style={{ width: "100%", borderRadius: 4, background: "#000" }} />
      {err && <Row><span style={{ color: "#ef4444", fontSize: 11 }}>{err}</span></Row>}
    </Panel>
  );
}
