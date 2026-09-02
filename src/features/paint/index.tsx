import { useEffect, useRef, useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

const COLORS = ["#000","#fff","#e53935","#fb8c00","#fdd835","#43a047","#1e88e5","#8e24aa"];

export default function Paint() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#000");
  const [size, setSize] = useState(4);
  const draw = useRef(false);

  useEffect(() => {
    const c = cv.current!; const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff"; ctx.fillRect(0,0,c.width,c.height);
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = cv.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (cv.current!.width / r.width), y: (e.clientY - r.top) * (cv.current!.height / r.height) };
  };
  const start = (e: React.PointerEvent) => {
    draw.current = true;
    const ctx = cv.current!.getContext("2d")!;
    const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineCap = "round"; ctx.strokeStyle = color; ctx.lineWidth = size;
  };
  const move = (e: React.PointerEvent) => {
    if (!draw.current) return;
    const ctx = cv.current!.getContext("2d")!;
    const p = pos(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle = color; ctx.lineWidth = size; ctx.stroke();
  };
  const end = () => { draw.current = false; };
  const clear = () => { const ctx = cv.current!.getContext("2d")!; ctx.fillStyle = "#fff"; ctx.fillRect(0,0,cv.current!.width, cv.current!.height); };
  const save = () => { const a = document.createElement("a"); a.href = cv.current!.toDataURL("image/png"); a.download = "paint.png"; a.click(); };

  return (
    <Panel>
      <canvas ref={cv} width={400} height={300} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end}
        style={{ background: "#fff", borderRadius: 6, touchAction: "none", display: "block", cursor: "crosshair" }} />
      <Row style={{ marginTop: 8 }}>
        {COLORS.map(c => <button key={c} onClick={() => setColor(c)} style={{ width: 24, height: 24, background: c, border: color === c ? "2px solid var(--vlc-accent)" : "1px solid #666", borderRadius: 4 }} />)}
        <input type="range" min={1} max={20} value={size} onChange={e => setSize(+e.target.value)} />
        <Btn onClick={clear}>Clear</Btn>
        <Btn onClick={save}>Save</Btn>
      </Row>
    </Panel>
  );
}
