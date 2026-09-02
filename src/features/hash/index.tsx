import { useEffect, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
const algos: ("SHA-1" | "SHA-256" | "SHA-384" | "SHA-512")[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
export default function Hash() {
  const [t, setT] = useState("hello world");
  const [algo, setAlgo] = useState<"SHA-1" | "SHA-256" | "SHA-384" | "SHA-512">("SHA-256");
  const [out, setOut] = useState("");
  useEffect(() => {
    (async () => {
      const buf = new TextEncoder().encode(t);
      const h = await crypto.subtle.digest(algo, buf);
      setOut(Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, "0")).join(""));
    })();
  }, [t, algo]);
  return (<Panel><Row><b>Hash</b>{algos.map((a) => <Btn key={a} active={algo === a} onClick={() => setAlgo(a)}>{a}</Btn>)}</Row>
    <textarea value={t} onChange={(e) => setT(e.target.value)} style={{ width: "100%", minHeight: 80, padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }} />
    <div style={{ marginTop: 10, padding: 10, background: "var(--vlc-bg-base)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6, fontFamily: "var(--vlc-font-mono)", fontSize: 11, wordBreak: "break-all", color: "var(--vlc-accent)" }}>{out}</div>
    <Row><Btn onClick={() => navigator.clipboard?.writeText(out)}>Copy</Btn></Row>
  </Panel>);
}
