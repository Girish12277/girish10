import { useMemo, useState } from "react";
import { Panel, Row } from "../_shared/ui";
function diffLines(a: string, b: string) {
  const al = a.split("\n"), bl = b.split("\n");
  const out: { t: "=" | "-" | "+"; s: string }[] = [];
  const n = Math.max(al.length, bl.length);
  for (let i = 0; i < n; i++) { if (al[i] === bl[i]) out.push({ t: "=", s: al[i] ?? "" }); else { if (i < al.length) out.push({ t: "-", s: al[i] }); if (i < bl.length) out.push({ t: "+", s: bl[i] }); } }
  return out;
}
export default function Diff() {
  const [a, setA] = useState("alpha\nbeta\ngamma\ndelta");
  const [b, setB] = useState("alpha\nbeta\nGAMMA\ndelta\nepsilon");
  const d = useMemo(() => diffLines(a, b), [a, b]);
  const ta: React.CSSProperties = { width: "100%", minHeight: 140, padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6, fontFamily: "var(--vlc-font-mono)", fontSize: 12 };
  return (<Panel><Row><b>Text Diff</b></Row>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <textarea value={a} onChange={(e) => setA(e.target.value)} style={ta} />
      <textarea value={b} onChange={(e) => setB(e.target.value)} style={ta} />
    </div>
    <div style={{ marginTop: 10, padding: 8, background: "var(--vlc-bg-base)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6, fontFamily: "var(--vlc-font-mono)", fontSize: 12, maxHeight: 240, overflowY: "auto" }}>
      {d.map((l, i) => (<div key={i} style={{ padding: "1px 6px", background: l.t === "+" ? "color-mix(in srgb, var(--vlc-good, #5cdb95) 18%, transparent)" : l.t === "-" ? "color-mix(in srgb, var(--vlc-bad, #ff4d6d) 18%, transparent)" : "transparent", color: l.t === "+" ? "var(--vlc-good, #5cdb95)" : l.t === "-" ? "var(--vlc-bad, #ff4d6d)" : "var(--vlc-text-primary)" }}>{l.t} {l.s}</div>))}
    </div></Panel>);
}
