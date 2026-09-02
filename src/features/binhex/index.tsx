import { useState } from "react";
import { Panel, Row } from "../_shared/ui";

export default function BinHex() {
  const [val, setVal] = useState("255");
  const [base, setBase] = useState<2 | 8 | 10 | 16>(10);
  const n = parseInt(val, base);
  const ok = !isNaN(n);
  const F = (props: { label: string; b: 2 | 8 | 10 | 16 }) => (
    <Row>
      <span style={{ width: 56, opacity: 0.7 }}>{props.label}</span>
      <input value={ok ? n.toString(props.b) : ""} onChange={(e) => { setVal(e.target.value); setBase(props.b); }} style={{ flex: 1, padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: `1px solid ${base === props.b ? "var(--vlc-accent)" : "var(--vlc-border-subtle)"}`, borderRadius: 6 }} />
    </Row>
  );
  return (
    <Panel>
      <F label="Binary" b={2} />
      <F label="Octal" b={8} />
      <F label="Decimal" b={10} />
      <F label="Hex" b={16} />
      {!ok && <div style={{ color: "#f87171", fontSize: 11 }}>Invalid number for base {base}</div>}
    </Panel>
  );
}
