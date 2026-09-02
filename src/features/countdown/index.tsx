import { useEffect, useState } from "react";
import { Panel, Row } from "../_shared/ui";

export default function Countdown() {
  const [target, setTarget] = useState(() => { try { return localStorage.getItem("vlc-cd-tgt") || ""; } catch { return ""; } });
  const [label, setLabel] = useState(() => { try { return localStorage.getItem("vlc-cd-lbl") || "Event"; } catch { return "Event"; } });
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  useEffect(() => { try { localStorage.setItem("vlc-cd-tgt", target); localStorage.setItem("vlc-cd-lbl", label); } catch { /* noop */ } }, [target, label]);
  const ms = target ? new Date(target).getTime() - now : 0;
  const d = Math.max(0, Math.floor(ms / 86400000)); const h = Math.max(0, Math.floor((ms % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((ms % 3600000) / 60000)); const s = Math.max(0, Math.floor((ms % 60000) / 1000));
  return (
    <Panel>
      <Row><input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" style={{ flex: 1, padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      <Row><input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} style={{ flex: 1, padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} /></Row>
      <div style={{ marginTop: 12, textAlign: "center", fontFamily: "var(--vlc-font-mono, monospace)" }}>
        <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "var(--vlc-accent-text)" }}>{d}d {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</div>
        {ms <= 0 && target && <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>Event has passed</div>}
      </div>
    </Panel>
  );
}
