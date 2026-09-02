import { useMemo, useState } from "react";
import { Panel } from "../_shared/ui";

function b64url(s: string) { try { return JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "="))); } catch { return null; } }

export default function JwtDecode() {
  const [t, setT] = useState("");
  const parts = useMemo(() => {
    const [h, p] = t.split("."); return { header: h ? b64url(h) : null, payload: p ? b64url(p) : null };
  }, [t]);
  return (
    <Panel>
      <textarea value={t} onChange={(e) => setT(e.target.value)} rows={3} placeholder="Paste a JWT (header.payload.signature)" style={{ width: "100%", padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} />
      <div style={{ marginTop: 8, fontFamily: "var(--vlc-font-mono, monospace)", fontSize: 11 }}>
        <div style={{ opacity: 0.7, marginBottom: 4 }}>Header</div>
        <pre style={{ background: "var(--vlc-bg-sunken)", padding: 8, borderRadius: 6, overflowX: "auto" }}>{parts.header ? JSON.stringify(parts.header, null, 2) : "—"}</pre>
        <div style={{ opacity: 0.7, margin: "8px 0 4px" }}>Payload</div>
        <pre style={{ background: "var(--vlc-bg-sunken)", padding: 8, borderRadius: 6, overflowX: "auto" }}>{parts.payload ? JSON.stringify(parts.payload, null, 2) : "—"}</pre>
      </div>
    </Panel>
  );
}
