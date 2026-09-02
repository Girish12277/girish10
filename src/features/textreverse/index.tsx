import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

export default function TextReverse() {
  const [t, setT] = useState("Reverse me");
  const reverseChars = (s: string) => [...s].reverse().join("");
  const reverseWords = (s: string) => s.split(/\s+/).reverse().join(" ");
  const reverseLines = (s: string) => s.split("\n").reverse().join("\n");
  return (
    <Panel>
      <textarea value={t} onChange={(e) => setT(e.target.value)} rows={5} style={{ width: "100%", padding: 6, background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 6, fontFamily: "inherit" }} />
      <Row style={{ marginTop: 8 }}>
        <Btn onClick={() => setT(reverseChars(t))}>Reverse chars</Btn>
        <Btn onClick={() => setT(reverseWords(t))}>Reverse words</Btn>
        <Btn onClick={() => setT(reverseLines(t))}>Reverse lines</Btn>
      </Row>
    </Panel>
  );
}
