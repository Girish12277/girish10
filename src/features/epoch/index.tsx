import { useEffect, useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

export default function Epoch() {
  const [ts, setTs] = useState(Math.floor(Date.now() / 1000));
  const [iso, setIso] = useState(new Date().toISOString().slice(0, 19));
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  return (
    <Panel>
      <div style={{ fontFamily: "var(--vlc-font-mono, monospace)", fontSize: 13, padding: 8, background: "var(--vlc-bg-sunken)", borderRadius: 6, marginBottom: 8 }}>
        Now: <strong style={{ color: "var(--vlc-accent-text)" }}>{Math.floor(now / 1000)}</strong> ({new Date(now).toISOString()})
      </div>
      <Row><span style={{ width: 56, opacity: 0.7 }}>Epoch</span><input type="number" value={ts} onChange={(e) => { const v = +e.target.value; setTs(v); setIso(new Date(v * 1000).toISOString().slice(0, 19)); }} style={{ flex: 1, padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      <Row><span style={{ width: 56, opacity: 0.7 }}>ISO</span><input value={iso} onChange={(e) => { setIso(e.target.value); const d = new Date(e.target.value); if (!isNaN(d.getTime())) setTs(Math.floor(d.getTime() / 1000)); }} style={{ flex: 1, padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      <Row><Btn onClick={() => { const n = Math.floor(Date.now() / 1000); setTs(n); setIso(new Date(n * 1000).toISOString().slice(0, 19)); }}>Use now</Btn></Row>
    </Panel>
  );
}
