import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

export default function UrlEncode() {
  const [t, setT] = useState("hello world & friends");
  const safe = (fn: (s: string) => string) => { try { setT(fn(t)); } catch { /* noop */ } };
  return (
    <Panel>
      <textarea value={t} onChange={(e) => setT(e.target.value)} rows={5} style={{ width: "100%", padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} />
      <Row style={{ marginTop: 8 }}>
        <Btn onClick={() => safe(encodeURIComponent)}>encodeURIComponent</Btn>
        <Btn onClick={() => safe(decodeURIComponent)}>decodeURIComponent</Btn>
        <Btn onClick={() => safe(encodeURI)}>encodeURI</Btn>
        <Btn onClick={() => safe(decodeURI)}>decodeURI</Btn>
      </Row>
    </Panel>
  );
}
