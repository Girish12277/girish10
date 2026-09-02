import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
const W = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");
const sent = () => { const n = 8 + Math.floor(Math.random() * 12); const a = Array.from({ length: n }, () => W[Math.floor(Math.random() * W.length)]); a[0] = a[0][0].toUpperCase() + a[0].slice(1); return a.join(" ") + "."; };
const para = () => Array.from({ length: 4 + Math.floor(Math.random() * 4) }, sent).join(" ");
export default function Lorem() {
  const [n, setN] = useState(3); const [text, setText] = useState(() => Array.from({ length: 3 }, para).join("\n\n"));
  return (<Panel><Row><b>Lorem Ipsum</b><span style={{ marginLeft: "auto" }}>Paragraphs</span>
    <input type="number" min={1} max={20} value={n} onChange={(e) => setN(+e.target.value || 1)} style={{ width: 60, padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }} />
    <Btn onClick={() => setText(Array.from({ length: n }, para).join("\n\n"))}>Generate</Btn>
    <Btn onClick={() => navigator.clipboard?.writeText(text)}>Copy</Btn></Row>
    <textarea value={text} readOnly style={{ width: "100%", minHeight: 220, padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6, marginTop: 8 }} />
  </Panel>);
}
