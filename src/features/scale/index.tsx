import { useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCALES: Record<string, number[]> = { Major: [0, 2, 4, 5, 7, 9, 11], "Nat. Minor": [0, 2, 3, 5, 7, 8, 10], "Harm. Minor": [0, 2, 3, 5, 7, 8, 11], Dorian: [0, 2, 3, 5, 7, 9, 10], Mixolydian: [0, 2, 4, 5, 7, 9, 10], "Pent. Major": [0, 2, 4, 7, 9], "Pent. Minor": [0, 3, 5, 7, 10], Blues: [0, 3, 5, 6, 7, 10] };
const FREQ = (n: number) => 440 * Math.pow(2, (n - 9) / 12);
export default function Scale() {
  const [root, setRoot] = useState("C");
  const [scale, setScale] = useState("Major");
  const idx = NOTES.indexOf(root); const notes = SCALES[scale].map((s) => NOTES[(idx + s) % 12]);
  const play = (semi: number) => { const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.frequency.value = FREQ(idx + semi); g.gain.value = 0.15; o.connect(g); g.connect(ctx.destination); o.start(); setTimeout(() => { o.stop(); ctx.close(); }, 500); };
  return (<Panel><Row><b>Music Scale</b></Row>
    <Row><span>Root</span><select value={root} onChange={(e) => setRoot(e.target.value)} style={{ padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }}>{NOTES.map((n) => <option key={n}>{n}</option>)}</select>
      <span>Type</span><select value={scale} onChange={(e) => setScale(e.target.value)} style={{ padding: 6, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }}>{Object.keys(SCALES).map((s) => <option key={s}>{s}</option>)}</select></Row>
    <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>{notes.map((n, i) => (<Btn key={i} onClick={() => play(SCALES[scale][i])}>{n}</Btn>))}</div>
    <Row><Btn onClick={() => { let t = 0; SCALES[scale].forEach((s) => { setTimeout(() => play(s), t); t += 350; }); }}>Play scale</Btn></Row>
  </Panel>);
}
