import { useEffect, useMemo, useState } from "react";
import { Panel, Btn } from "../_shared/ui";

const EMOJI = ["🍎","🍊","🍌","🍇","🍓","🍑","🥝","🍒","🍉","🥭","🍍","🥥"];

export default function EmojiHunt() {
  const [round, setRound] = useState(0);
  const [time, setTime] = useState(20);
  const [score, setScore] = useState(0);
  const data = useMemo(() => {
    const target = EMOJI[Math.floor(Math.random()*EMOJI.length)];
    const grid = Array.from({ length: 64 }, () => EMOJI[Math.floor(Math.random()*EMOJI.length)]);
    if (!grid.includes(target)) grid[Math.floor(Math.random()*64)] = target;
    return { target, grid };
  }, [round]);

  useEffect(() => {
    if (time <= 0) return;
    const id = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [time]);

  return (
    <Panel>
      <div style={{ marginBottom: 8 }}>Find: <span style={{ fontSize: 28 }}>{data.target}</span> · Score {score} · Time {time}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8,38px)", gap: 2 }}>
        {data.grid.map((e, i) => (
          <button key={i} onClick={() => { if (time>0 && e === data.target) { setScore(s=>s+1); setRound(r=>r+1); } }}
            style={{ width: 38, height: 38, fontSize: 22, background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4 }}>{e}</button>
        ))}
      </div>
      {time <= 0 && <div style={{ marginTop: 8 }}>Time's up! <Btn onClick={() => { setTime(20); setScore(0); setRound(r=>r+1); }}>Again</Btn></div>}
    </Panel>
  );
}
