import { useEffect, useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

export default function Timer() {
  const [min, setMin] = useState(5);
  const [sec, setSec] = useState(0);
  const [left, setLeft] = useState(0);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setLeft(l => {
      if (l <= 1) { setRun(false); try { new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=").play().catch(()=>{}); } catch {} return 0; }
      return l - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [run]);

  const display = (() => { const s = left || min*60+sec; return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; })();

  return (
    <Panel>
      <div style={{ fontSize: 40, fontFamily: "monospace", textAlign: "center", margin: "12px 0" }}>{display}</div>
      {!run && (
        <Row>
          <label>Min <input type="number" value={min} onChange={e=>setMin(+e.target.value||0)} style={{ width: 50, padding: 4, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }} /></label>
          <label>Sec <input type="number" value={sec} onChange={e=>setSec(+e.target.value||0)} style={{ width: 50, padding: 4, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }} /></label>
        </Row>
      )}
      <Row>
        <Btn onClick={() => { if (!run) setLeft(min*60+sec); setRun(r => !r); }}>{run ? "Pause" : "Start"}</Btn>
        <Btn onClick={() => { setRun(false); setLeft(0); }}>Reset</Btn>
      </Row>
    </Panel>
  );
}
