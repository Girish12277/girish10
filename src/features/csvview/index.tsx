import { useMemo, useState } from "react";
import { Panel, Row } from "../_shared/ui";
const parse = (s: string) => s.trim().split(/\r?\n/).map((row) => { const out: string[] = []; let cur = "", inQ = false; for (const c of row) { if (c === '"') inQ = !inQ; else if (c === "," && !inQ) { out.push(cur); cur = ""; } else cur += c; } out.push(cur); return out; });
export default function CSVView() {
  const [t, setT] = useState("name,role,years\nAlice,Engineer,5\nBob,Designer,3\nCarol,PM,7");
  const rows = useMemo(() => parse(t), [t]);
  const [head, ...body] = rows;
  return (<Panel><Row><b>CSV Viewer</b></Row>
    <textarea value={t} onChange={(e) => setT(e.target.value)} style={{ width: "100%", minHeight: 100, padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6, fontFamily: "var(--vlc-font-mono)" }} />
    <div style={{ marginTop: 10, overflowX: "auto", maxHeight: 240 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead><tr>{head?.map((h, i) => <th key={i} style={{ padding: 6, textAlign: "left", background: "var(--vlc-bg-elevated)", color: "var(--vlc-accent)", borderBottom: "1px solid var(--vlc-border-normal)" }}>{h}</th>)}</tr></thead>
        <tbody>{body.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{ padding: 6, borderBottom: "1px solid var(--vlc-border-subtle)" }}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <div style={{ marginTop: 6, fontSize: 11, color: "var(--vlc-text-secondary)" }}>{body.length} row(s) · {head?.length || 0} column(s)</div>
  </Panel>);
}
