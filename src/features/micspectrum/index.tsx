import { useEffect, useRef, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";

// Real-time spectrum from mic — pairs with player Audio Visualizer for the media element itself.
export default function MicSpectrum() {
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
        const an = ctx.createAnalyser(); an.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(an);
        const buf = new Uint8Array(an.frequencyBinCount);
        const c = ref.current!; const g = c.getContext("2d")!;
        const draw = () => {
          an.getByteFrequencyData(buf);
          g.fillStyle = "rgba(0,0,0,0.9)"; g.fillRect(0, 0, c.width, c.height);
          const bw = c.width / buf.length;
          for (let i = 0; i < buf.length; i++) {
            const h = (buf[i] / 255) * c.height;
            g.fillStyle = `hsl(${200 + (i / buf.length) * 120}, 80%, 55%)`;
            g.fillRect(i * bw, c.height - h, bw - 1, h);
          }
          raf = requestAnimationFrame(draw);
        };
        draw();
      } catch (e) { setErr(String(e)); setOn(false); }
    })();
    return () => { cancelAnimationFrame(raf); ctx?.close().catch(() => {}); stream?.getTracks().forEach((t) => t.stop()); };
  }, [on]);
  return (
    <Panel>
      <Row><strong>Mic Spectrum</strong></Row>
      <Row><Btn active={on} onClick={() => setOn((v) => !v)}>{on ? "Stop" : "Start"}</Btn></Row>
      <canvas ref={ref} width={480} height={140} style={{ width: "100%", borderRadius: 4, background: "#000" }} />
      {err && <Row><span style={{ color: "#ef4444", fontSize: 11 }}>{err}</span></Row>}
    </Panel>
  );
}
