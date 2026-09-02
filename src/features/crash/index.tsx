import { useEffect, useRef, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { loadNum, saveNum } from "../_shared/ui";
export default function Crash() {
  const [mult, setMult] = useState(1);
  const [running, setRunning] = useState(false);
  const [bank, setBank] = useState(() => loadNum("crash-bank", 1000));
  const [bet, setBet] = useState(100);
  const [cashed, setCashed] = useState<number | null>(null);
  const crashAt = useRef(0);
  useEffect(() => { saveNum("crash-bank", bank); }, [bank]);
  useEffect(() => {
    if (!running) return;
    let raf = 0, start = performance.now();
    const tick = (t: number) => {
      const dt = (t - start) / 1000; const m = 1 + Math.pow(dt, 1.5) * 0.6;
      if (m >= crashAt.current) { setRunning(false); setMult(crashAt.current); return; }
      setMult(m); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [running]);
  const start = () => { if (bet > bank) return; setBank(bank - bet); crashAt.current = 1 + Math.pow(Math.random(), 2.5) * 9; setMult(1); setCashed(null); setRunning(true); };
  const cash = () => { if (!running) return; setRunning(false); const won = Math.floor(bet * mult); setBank((b) => b + won); setCashed(mult); };
  return (<Panel><Row><b>Crash</b><span style={{ marginLeft: "auto" }}>Bank ${bank}</span></Row>
    <div style={{ fontSize: 56, fontWeight: 800, textAlign: "center", padding: 24, color: running ? "var(--vlc-accent)" : cashed ? "var(--vlc-accent-text)" : "var(--vlc-text-secondary)" }}>{mult.toFixed(2)}×</div>
    <Row><span>Bet</span><input type="number" value={bet} onChange={(e) => setBet(Math.max(1, +e.target.value || 0))} style={{ width: 100, padding: 4, background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", borderRadius: 4 }} />
      {!running ? <Btn onClick={start} disabled={bet > bank}>Bet</Btn> : <Btn onClick={cash} active>Cash @ {mult.toFixed(2)}×</Btn>}</Row>
    {cashed && <div style={{ color: "var(--vlc-accent)" }}>Cashed at {cashed.toFixed(2)}× — won ${Math.floor(bet * cashed)}</div>}
    {!running && !cashed && mult > 1 && <div style={{ color: "var(--vlc-text-secondary)" }}>Crashed at {mult.toFixed(2)}×</div>}
  </Panel>);
}
