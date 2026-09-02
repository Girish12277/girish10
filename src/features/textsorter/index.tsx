import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

export default function TextSorter() {
  const [t, setT] = useState("banana\napple\ncherry");
  const sortLines = (fn: (a: string, b: string) => number) => setT(t.split("\n").sort(fn).join("\n"));
  return (
    <Panel>
      <textarea value={t} onChange={(e) => setT(e.target.value)} rows={10} style={{ width: "100%", padding: 6, fontFamily: "var(--vlc-font-mono, monospace)", background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6 }} />
      <Row style={{ marginTop: 8 }}>
        <Btn onClick={() => sortLines((a, b) => a.localeCompare(b))}>A → Z</Btn>
        <Btn onClick={() => sortLines((a, b) => b.localeCompare(a))}>Z → A</Btn>
        <Btn onClick={() => sortLines(() => Math.random() - 0.5)}>Shuffle</Btn>
        <Btn onClick={() => setT(t.split("\n").reverse().join("\n"))}>Reverse</Btn>
        <Btn onClick={() => sortLines((a, b) => a.length - b.length)}>By length</Btn>
      </Row>
    </Panel>
  );
}
