import { useEffect, useRef, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";

// VU meter via getUserMedia (mic) — avoids conflict with player's MediaElementSource.
export default function VUMeter() {
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
        const an = ctx.createAnalyser(); an.fftSize = 1024;
        src.connect(an);
        const buf = new Uint8Array(an.fftSize);
        const c = ref.current!; const g = c.getContext("2d")!;
        let peak = 0;
        const draw = () => {
          an.getByteTimeDomainData(buf);
          let max = 0;
          for (let i = 0; i < buf.length; i++) { const v = Math.abs(buf[i] - 128) / 128; if (v > max) max = v; }
          peak = Math.max(peak * 0.95, max);
          g.fillStyle = "rgba(0,0,0,0.85)"; g.fillRect(0, 0, c.width, c.height);
          const w = c.width * max;
          const grad = g.createLinearGradient(0, 0, c.width, 0);
          grad.addColorStop(0, "#22c55e"); grad.addColorStop(0.7, "#eab308"); grad.addColorStop(1, "#ef4444");
          g.fillStyle = grad; g.fillRect(0, 0, w, c.height);
          g.fillStyle = "#fff"; g.fillRect(c.width * peak - 2, 0, 2, c.height);
          raf = requestAnimationFrame(draw);
        };
        draw();
      } catch (e) { setErr(String(e)); setOn(false); }
    })();
    return () => { cancelAnimationFrame(raf); ctx?.close().catch(() => {}); stream?.getTracks().forEach((t) => t.stop()); };
  }, [on]);

  return (
    <Panel>
      <Row><strong>VU Meter (mic)</strong></Row>
      <Row><Btn active={on} onClick={() => setOn((v) => !v)}>{on ? "Stop" : "Start"}</Btn></Row>
      <canvas ref={ref} width={320} height={40} style={{ width: "100%", borderRadius: 4, background: "#000" }} />
      {err && <Row><span style={{ color: "#ef4444", fontSize: 11 }}>{err}</span></Row>}
    </Panel>
  );
}
