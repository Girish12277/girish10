import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

export default function ShadowGen() {
  const [x, setX] = useState(0); const [y, setY] = useState(10); const [blur, setBlur] = useState(30); const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState("#000000"); const [alpha, setAlpha] = useState(40);
  const c = `rgba(${parseInt(color.slice(1, 3), 16)},${parseInt(color.slice(3, 5), 16)},${parseInt(color.slice(5, 7), 16)},${alpha / 100})`;
  const css = `${x}px ${y}px ${blur}px ${spread}px ${c}`;
  const S = ({ l, v, on, min, max }: { l: string; v: number; on: (n: number) => void; min: number; max: number }) => (
    <Row><span style={{ width: 56, opacity: 0.7 }}>{l}</span><input type="range" min={min} max={max} value={v} onChange={(e) => on(+e.target.value)} style={{ flex: 1 }} /><span style={{ fontFamily: "var(--vlc-font-mono, monospace)", width: 40, textAlign: "right" }}>{v}</span></Row>
  );
  return (
    <Panel>
      <S l="X" v={x} on={setX} min={-50} max={50} />
      <S l="Y" v={y} on={setY} min={-50} max={50} />
      <S l="Blur" v={blur} on={setBlur} min={0} max={100} />
      <S l="Spread" v={spread} on={setSpread} min={-30} max={30} />
      <Row><span style={{ width: 56, opacity: 0.7 }}>Color</span><input type="color" value={color} onChange={(e) => setColor(e.target.value)} /><input type="range" min={0} max={100} value={alpha} onChange={(e) => setAlpha(+e.target.value)} style={{ flex: 1 }} /><span style={{ width: 40, textAlign: "right" }}>{alpha}%</span></Row>
      <div style={{ height: 120, background: "var(--vlc-bg-sunken)", display: "grid", placeItems: "center", borderRadius: 8, margin: "12px 0" }}>
        <div style={{ width: 90, height: 60, background: "var(--vlc-bg-elevated)", boxShadow: css, borderRadius: 8 }} />
      </div>
      <div style={{ fontFamily: "var(--vlc-font-mono, monospace)", fontSize: 12, padding: 8, background: "var(--vlc-bg-sunken)", borderRadius: 6, wordBreak: "break-all" }}>box-shadow: {css};</div>
      <Row><Btn onClick={() => navigator.clipboard?.writeText(`box-shadow: ${css};`).catch(() => {})}>Copy CSS</Btn></Row>
    </Panel>
  );
}
