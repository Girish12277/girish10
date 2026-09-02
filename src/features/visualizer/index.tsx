import { useEffect, useRef, useState } from "react";
import { audioGraph } from "@/audio/AudioGraph";
import { useRAFLoop } from "../_shared/GameShell";

const W = 500, H = 220;
type Mode = "bars" | "wave" | "circle";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const [mode, setMode] = useState<Mode>("bars");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const g = audioGraph;
    if (!g.ctx || !g.source) { setReady(false); return; }
    const a = g.ctx.createAnalyser();
    a.fftSize = 512;
    try { g.source.connect(a); } catch { /* may already be connected */ }
    analyserRef.current = a;
    dataRef.current = new Uint8Array(new ArrayBuffer(a.frequencyBinCount));
    setReady(true);
    return () => { try { g.source?.disconnect(a); } catch { /* noop */ } analyserRef.current = null; };
  }, []);

  useRAFLoop(() => {
    const c = canvasRef.current; const a = analyserRef.current; const d = dataRef.current;
    if (!c || !a || !d) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    if (mode === "wave") a.getByteTimeDomainData(d); else a.getByteFrequencyData(d);
    ctx.fillStyle = "#0b1020"; ctx.fillRect(0, 0, W, H);
    if (mode === "bars") {
      const bw = W / d.length;
      for (let i = 0; i < d.length; i++) {
        const v = d[i] / 255; const h = v * H;
        const hue = 240 + v * 80;
        ctx.fillStyle = `hsl(${hue},80%,${30 + v * 40}%)`;
        ctx.fillRect(i * bw, H - h, bw - 0.5, h);
      }
    } else if (mode === "wave") {
      ctx.strokeStyle = "#8b9bff"; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i < d.length; i++) {
        const x = (i / d.length) * W; const y = (d[i] / 255) * H;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else {
      const cx = W / 2, cy = H / 2, R = 60;
      for (let i = 0; i < d.length; i++) {
        const v = d[i] / 255; const ang = (i / d.length) * Math.PI * 2;
        const r1 = R, r2 = R + v * 70;
        ctx.strokeStyle = `hsl(${(i * 1.4) % 360},80%,60%)`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
        ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2); ctx.stroke();
      }
    }
  }, [mode]);

  return (
    <div>
      <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", width: "100%", background: "#0b1020" }} />
      <div className="flex gap-2 px-3 py-2" style={{ borderTop: "1px solid var(--vlc-border-subtle)" }}>
        {(["bars", "wave", "circle"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className="px-2 py-1 text-[11px] rounded"
            style={{ background: mode === m ? "var(--vlc-accent)" : "transparent", color: mode === m ? "var(--vlc-bg-base)" : "var(--vlc-text-secondary)", border: "1px solid var(--vlc-border-subtle)" }}>{m}</button>
        ))}
        {!ready && <span className="ml-auto text-[11px]" style={{ color: "var(--vlc-text-ghost)" }}>Load a media file to begin</span>}
      </div>
    </div>
  );
}
