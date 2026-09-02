import { useState } from "react";
import { Panel, Row } from "../_shared/ui";

function hexToRgb(h: string) { const m = h.replace("#", "").match(/^([0-9a-f]{6})$/i); if (!m) return null; const n = parseInt(m[1], 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }; }
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConvert() {
  const [hex, setHex] = useState("#0a84ff");
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  return (
    <Panel>
      <Row><input type="color" value={hex} onChange={(e) => setHex(e.target.value)} style={{ width: 44, height: 32, border: "1px solid var(--vlc-border-subtle)", borderRadius: 6, background: "transparent" }} />
        <input value={hex} onChange={(e) => setHex(e.target.value)} style={{ flex: 1, padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      {rgb && hsl && <div style={{ fontFamily: "var(--vlc-font-mono, monospace)", fontSize: 12, marginTop: 8, lineHeight: 1.8 }}>
        <div>RGB: rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
        <div>HSL: hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
        <div>OKLCH-ish: l={(hsl.l / 100).toFixed(2)}</div>
        <div style={{ height: 48, marginTop: 8, background: hex, borderRadius: 6, border: "1px solid var(--vlc-border-subtle)" }} />
      </div>}
    </Panel>
  );
}
