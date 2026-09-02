import { useMemo, useState } from "react";
import { Panel, Btn } from "../_shared/ui";

const WORDS = ["apple","brave","crane","drink","eagle","flame","grape","hover","input","joker","knack","lemon","mango","north","ocean","plant","quick","robot","stone","tiger","under","vivid","whale","xenon","yacht","zebra"];
const pick = () => WORDS[Math.floor(Math.random()*WORDS.length)];

export default function Wordle() {
  const [target, setTarget] = useState(pick);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [cur, setCur] = useState("");
  const done = useMemo(() => guesses.includes(target) || guesses.length >= 6, [guesses, target]);

  const submit = () => {
    if (cur.length !== 5 || done) return;
    setGuesses((g) => [...g, cur.toLowerCase()]);
    setCur("");
  };

  const color = (g: string, i: number) => {
    const ch = g[i];
    if (target[i] === ch) return "#2e7d32";
    if (target.includes(ch)) return "#b58900";
    return "#444";
  };

  return (
    <Panel>
      <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
        {Array.from({ length: 6 }).map((_, r) => {
          const g = guesses[r] ?? (r === guesses.length ? cur.padEnd(5) : "     ");
          return (
            <div key={r} style={{ display: "flex", gap: 6 }}>
              {Array.from({ length: 5 }).map((_, c) => (
                <div key={c} style={{
                  width: 44, height: 44, display: "grid", placeItems: "center",
                  background: guesses[r] ? color(guesses[r], c) : "var(--vlc-bg-elevated)",
                  border: "1px solid var(--vlc-border-subtle)", borderRadius: 4,
                  fontWeight: 700, fontSize: 18, textTransform: "uppercase",
                }}>{g[c]?.trim() ?? ""}</div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={cur} onChange={(e) => setCur(e.target.value.replace(/[^a-z]/gi, "").slice(0,5))}
          onKeyDown={(e) => e.key === "Enter" && submit()} disabled={done}
          style={{ flex: 1, padding: 8, background: "var(--vlc-bg-base)", border: "1px solid var(--vlc-border-subtle)", color: "var(--vlc-text-primary)", borderRadius: 4 }} />
        <Btn onClick={submit} disabled={done}>Enter</Btn>
        <Btn onClick={() => { setTarget(pick()); setGuesses([]); setCur(""); }}>New</Btn>
      </div>
      {done && <div style={{ marginTop: 10 }}>{guesses.includes(target) ? "🎉 You got it!" : `Word was: ${target}`}</div>}
    </Panel>
  );
}
