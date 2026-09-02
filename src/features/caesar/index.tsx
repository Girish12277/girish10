import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
const PHRASES = ["MEET ME AT MIDNIGHT", "THE EAGLE HAS LANDED", "VLC IS COOL", "MUSIC SOOTHES THE SOUL", "DECODE THIS MESSAGE"];
const shift = (s: string, k: number) => s.replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k + 26) % 26) + 65));
export default function Caesar() {
  const [round, setRound] = useState(0);
  const phrase = PHRASES[round % PHRASES.length];
  const key = useState(() => 1 + Math.floor(Math.random() * 24))[0];
  const [k2, setK2] = useState(key);
  const [guess, setGuess] = useState(1);
  const cipher = shift(phrase, k2);
  const decoded = shift(cipher, -guess);
  const ok = decoded === phrase;
  return (<Panel><Row><b>Caesar Decode</b><span style={{ marginLeft: "auto" }}>Round {round + 1}</span><Btn onClick={() => { setRound((r) => r + 1); setK2(1 + Math.floor(Math.random() * 24)); setGuess(1); }}>New</Btn></Row>
    <div style={{ padding: 12, background: "var(--vlc-bg-elevated)", borderRadius: 8, fontFamily: "monospace", fontSize: 16, marginBottom: 10 }}>{cipher}</div>
    <Row><span>Shift</span><input type="range" min={1} max={25} value={guess} onChange={(e) => setGuess(+e.target.value)} style={{ flex: 1 }} /><b>{guess}</b></Row>
    <div style={{ padding: 12, background: "var(--vlc-bg-base)", border: "1px solid " + (ok ? "var(--vlc-accent)" : "var(--vlc-border-normal)"), borderRadius: 8, fontFamily: "monospace", fontSize: 16, color: ok ? "var(--vlc-accent)" : "var(--vlc-text-primary)" }}>{decoded}{ok && " ✓"}</div>
  </Panel>);
}
