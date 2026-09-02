import { useState } from "react";
import { Panel } from "../_shared/ui";

const CATS = {
  Length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  Weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495, t: 1000 },
  Temp: {} as Record<string, number>, // special
  Volume: { l: 1, ml: 0.001, gal: 3.78541, qt: 0.946353, cup: 0.236588 },
} as const;

export default function UnitConvert() {
  const [cat, setCat] = useState<keyof typeof CATS>("Length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [val, setVal] = useState("1");

  const tempUnits = ["C","F","K"];
  const units = cat === "Temp" ? tempUnits : Object.keys(CATS[cat]);
  const f = units.includes(from) ? from : units[0];
  const t = units.includes(to) ? to : units[1] ?? units[0];

  const convert = () => {
    const n = parseFloat(val); if (isNaN(n)) return "—";
    if (cat === "Temp") {
      let k = f === "C" ? n + 273.15 : f === "F" ? (n - 32)*5/9 + 273.15 : n;
      return (t === "C" ? k - 273.15 : t === "F" ? (k - 273.15)*9/5 + 32 : k).toFixed(2);
    }
    const map = CATS[cat] as Record<string, number>;
    return ((n * map[f]) / map[t]).toFixed(6);
  };

  return (
    <Panel>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {Object.keys(CATS).map(c => <button key={c} onClick={() => setCat(c as keyof typeof CATS)} style={{ padding: "4px 10px", background: cat===c?"var(--vlc-accent)":"var(--vlc-bg-elevated)", color: cat===c?"#000":"var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>{c}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "end" }}>
        <div>
          <input value={val} onChange={e=>setVal(e.target.value)} style={{ width: "100%", padding: 8, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }} />
          <select value={f} onChange={e=>setFrom(e.target.value)} style={{ width: "100%", marginTop: 4, padding: 6, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }}>{units.map(u => <option key={u}>{u}</option>)}</select>
        </div>
        <span>→</span>
        <div>
          <input value={convert()} readOnly style={{ width: "100%", padding: 8, background: "var(--vlc-bg-base)", color: "var(--vlc-accent)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }} />
          <select value={t} onChange={e=>setTo(e.target.value)} style={{ width: "100%", marginTop: 4, padding: 6, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }}>{units.map(u => <option key={u}>{u}</option>)}</select>
        </div>
      </div>
    </Panel>
  );
}
