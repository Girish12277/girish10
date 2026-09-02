import { useMemo, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
const DICT = ["CAT","DOG","SUN","MOON","STAR","TREE","LOVE","CODE","PLAY","SONG","BEAT","LOOP","JAZZ","ROCK","BASS","DRUM"];
const scramble = (w: string) => { const a = w.split(""); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a.join(""); };
export default function SpellDecode() {
  const [round, setRound] = useState(0);
  const word = useMemo(() => DICT[Math.floor(Math.random() * DICT.length)], [round]);
  const scrambled = useMemo(() => scramble(word), [word]);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const submit = () => { if (guess.toUpperCase() === word) { setScore(score + 1); setRound(round + 1); setGuess(""); } };
  return (<Panel><Row><b>Unscramble</b><span style={{ marginLeft: "auto" }}>Score: {score}</span><Btn onClick={() => { setRound(round + 1); setGuess(""); }}>Skip</Btn></Row>
    <div style={{ fontSize: 28, letterSpacing: 6, textAlign: "center", padding: 16, fontFamily: "monospace", color: "var(--vlc-accent)" }}>{scrambled}</div>
    <Row><input value={guess} onChange={(e) => setGuess(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Type the word…"
      style={{ flex: 1, padding: 8, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 6 }} /><Btn onClick={submit}>Submit</Btn></Row>
  </Panel>);
}
