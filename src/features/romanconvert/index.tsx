import { useState } from "react";
import { Panel, Row } from "../_shared/ui";

const MAP: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
function toRoman(n: number) { if (n < 1 || n > 3999) return ""; let r = ""; for (const [v, s] of MAP) while (n >= v) { r += s; n -= v; } return r; }
function fromRoman(s: string) { s = s.toUpperCase(); let i = 0, n = 0; for (const [v, sym] of MAP) while (s.startsWith(sym, i)) { n += v; i += sym.length; } return i === s.length ? n : NaN; }

export default function RomanConvert() {
  const [num, setNum] = useState("2025");
  const [rom, setRom] = useState("MMXXV");
  return (
    <Panel>
      <Row><span style={{ width: 56, opacity: 0.7 }}>Number</span><input value={num} onChange={(e) => { setNum(e.target.value); const v = parseInt(e.target.value); setRom(isNaN(v) ? "" : toRoman(v)); }} style={{ flex: 1, padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      <Row><span style={{ width: 56, opacity: 0.7 }}>Roman</span><input value={rom} onChange={(e) => { setRom(e.target.value); const v = fromRoman(e.target.value); setNum(isNaN(v) ? "" : String(v)); }} style={{ flex: 1, padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      <div style={{ fontSize: 11, opacity: 0.6 }}>Range: 1 – 3999</div>
    </Panel>
  );
}
