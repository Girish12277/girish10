import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

const SYM = ["🍒","🍋","🍇","🔔","⭐","7️⃣"];

export default function Slot() {
  const [reels, setReels] = useState(["?","?","?"]);
  const [bal, setBal] = useState(100);
  const [msg, setMsg] = useState("");

  const spin = () => {
    if (bal < 5) return;
    const r = [0,0,0].map(() => SYM[Math.floor(Math.random()*SYM.length)]);
    setReels(r);
    const win = r[0] === r[1] && r[1] === r[2] ? 50 : r[0] === r[1] || r[1] === r[2] ? 10 : 0;
    setBal(b => b - 5 + win);
    setMsg(win ? `+$${win}!` : "—");
  };

  return (
    <Panel>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, fontSize: 56, margin: "12px 0" }}>
        {reels.map((s, i) => <div key={i} style={{ width: 80, height: 80, display: "grid", placeItems: "center", background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 8 }}>{s}</div>)}
      </div>
      <Row><span>Balance: ${bal}</span><span style={{ marginLeft: "auto" }}>{msg}</span></Row>
      <Btn onClick={spin} disabled={bal < 5}>Spin ($5)</Btn>
    </Panel>
  );
}
