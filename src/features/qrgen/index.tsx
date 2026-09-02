import { useState } from "react";
import { Panel } from "../_shared/ui";

export default function QRGen() {
  const [text, setText] = useState("https://lovable.dev");
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(text)}`;
  return (
    <Panel>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={3}
        style={{ width: "100%", padding: 8, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, marginBottom: 10 }} />
      <div style={{ display: "grid", placeItems: "center", background: "#fff", padding: 12, borderRadius: 6 }}>
        {text ? <img src={src} alt="QR" width={240} height={240} /> : <div style={{ color: "#666" }}>Enter text…</div>}
      </div>
      <div style={{ fontSize: 11, color: "var(--vlc-text-ghost)", marginTop: 6 }}>QR rendering needs network. Offline: paste a saved QR image.</div>
    </Panel>
  );
}
