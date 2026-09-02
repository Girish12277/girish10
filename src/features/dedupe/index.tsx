import { useMemo, useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

export default function Dedupe() {
  const [t, setT] = useState("apple\napple\nbanana\nApple\nbanana");
  const [ci, setCi] = useState(true); const [trim, setTrim] = useState(true);
  const out = useMemo(() => {
    const seen = new Set<string>(); const out: string[] = [];
    for (const raw of t.split("\n")) { const k = (trim ? raw.trim() : raw); const key = ci ? k.toLowerCase() : k; if (!seen.has(key)) { seen.add(key); out.push(k); } }
    return out;
  }, [t, ci, trim]);
  return (
    <Panel>
      <textarea value={t} onChange={(e) => setT(e.target.value)} rows={6} style={{ width: "100%", padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} />
      <Row style={{ marginTop: 8 }}>
        <Btn active={ci} onClick={() => setCi(!ci)}>Case-insensitive</Btn>
        <Btn active={trim} onClick={() => setTrim(!trim)}>Trim</Btn>
        <Btn onClick={() => setT(out.join("\n"))}>Apply</Btn>
        <span style={{ fontSize: 11, opacity: 0.7 }}>{t.split("\n").length} → {out.length} lines</span>
      </Row>
      <pre style={{ marginTop: 8, padding: 8, fontFamily: "var(--vlc-font-mono, monospace)", fontSize: 11, background: "var(--vlc-bg-sunken)", borderRadius: 6, maxHeight: 220, overflow: "auto" }}>{out.join("\n")}</pre>
    </Panel>
  );
}
