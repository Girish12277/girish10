import { useMemo, useState } from "react";
import { Panel, Btn } from "../_shared/ui";

const Q = [
  { q: "Capital of France?", a: ["Paris","London","Berlin","Rome"], c: 0 },
  { q: "Largest planet?", a: ["Earth","Jupiter","Saturn","Mars"], c: 1 },
  { q: "2 + 2 × 2?", a: ["8","6","4","10"], c: 1 },
  { q: "H2O is?", a: ["Salt","Sugar","Water","Acid"], c: 2 },
  { q: "Mona Lisa painter?", a: ["Picasso","Van Gogh","Da Vinci","Monet"], c: 2 },
  { q: "Fastest land animal?", a: ["Lion","Cheetah","Horse","Tiger"], c: 1 },
  { q: "Tallest mountain?", a: ["K2","Everest","Kilimanjaro","Alps"], c: 1 },
  { q: "Author of 1984?", a: ["Orwell","Huxley","Tolkien","Hemingway"], c: 0 },
  { q: "Chemical symbol for Gold?", a: ["Gd","Go","Au","Ag"], c: 2 },
  { q: "Year WW2 ended?", a: ["1942","1945","1948","1939"], c: 1 },
];

export default function Trivia() {
  const order = useMemo(() => [...Q].sort(() => Math.random()-0.5), []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  if (i >= order.length) return <Panel>Done! Score {score}/{order.length} <Btn onClick={() => { setI(0); setScore(0); setPicked(null); }}>Replay</Btn></Panel>;
  const cur = order[i];
  return (
    <Panel>
      <div style={{ marginBottom: 8 }}>Q{i+1}/{order.length} — Score: {score}</div>
      <div style={{ marginBottom: 12, fontWeight: 600 }}>{cur.q}</div>
      <div style={{ display: "grid", gap: 6 }}>
        {cur.a.map((a, j) => (
          <Btn key={j} onClick={() => { if (picked !== null) return; setPicked(j); if (j === cur.c) setScore(s => s+1); }}
            style={{ background: picked === null ? undefined : j === cur.c ? "#2e7d32" : picked === j ? "#c62828" : undefined, color: picked == null ? undefined : "#fff" }}>
            {a}
          </Btn>
        ))}
      </div>
      {picked !== null && <Btn onClick={() => { setPicked(null); setI(i+1); }} style={{ marginTop: 10 }}>Next →</Btn>}
    </Panel>
  );
}
