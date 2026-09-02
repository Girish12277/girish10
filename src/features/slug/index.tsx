import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
export default function Slug() {
  const [t, setT] = useState("Hello World — My Awesome Post!");
  const s = slugify(t);
  return (<Panel><Row><b>Slug Generator</b><Btn onClick={() => navigator.clipboard?.writeText(s)}>Copy</Btn></Row>
    <input value={t} onChange={(e) => setT(e.target.value)} style={{ width: "100%", padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }} />
    <div style={{ marginTop: 10, padding: 12, background: "var(--vlc-bg-base)", border: "1px solid var(--vlc-accent)", borderRadius: 6, fontFamily: "var(--vlc-font-mono)", color: "var(--vlc-accent)" }}>{s || "—"}</div>
  </Panel>);
}
