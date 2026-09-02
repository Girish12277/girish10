import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

const xforms: Record<string, (s: string) => string> = {
  UPPER: (s) => s.toUpperCase(),
  lower: (s) => s.toLowerCase(),
  Title: (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  Sentence: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase()),
  camelCase: (s) => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  PascalCase: (s) => (" " + s.toLowerCase()).replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  snake_case: (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
  "kebab-case": (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  CONSTANT: (s) => s.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, ""),
  iNVERSE: (s) => [...s].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join(""),
};

export default function TextCase() {
  const [t, setT] = useState("Hello world from the converter");
  return (
    <Panel>
      <textarea value={t} onChange={(e) => setT(e.target.value)} rows={3} style={{ width: "100%", padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6, fontFamily: "inherit" }} />
      <Row style={{ marginTop: 8 }}>{Object.keys(xforms).map((k) => <Btn key={k} onClick={() => setT(xforms[k](t))}>{k}</Btn>)}</Row>
    </Panel>
  );
}
