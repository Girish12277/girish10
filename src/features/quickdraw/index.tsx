import { useEffect, useState } from "react";
import { Panel, Row, Btn, loadNum, saveNum } from "../_shared/ui";
export default function QuickDraw() {
  const [state, setState] = useState<"idle" | "wait" | "go" | "result">("idle");
  const [start, setStart] = useState(0);
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(() => loadNum("quickdraw-best", 9999));
  useEffect(() => { if (state !== "wait") return; const t = setTimeout(() => { setStart(performance.now()); setState("go"); }, 800 + Math.random() * 2200); return () => clearTimeout(t); }, [state]);
  const click = () => {
    if (state === "idle") setState("wait");
    else if (state === "wait") { setState("result"); setTime(-1); }
    else if (state === "go") { const t = performance.now() - start; setTime(t); setState("result"); if (t < best) { setBest(t); saveNum("quickdraw-best", Math.round(t)); } }
    else setState("idle");
  };
  const color = state === "wait" ? "var(--vlc-bad, #ff4d6d)" : state === "go" ? "var(--vlc-accent)" : "var(--vlc-bg-elevated)";
  return (<Panel><Row><b>Quick Draw</b><span style={{ marginLeft: "auto" }}>Best: {best < 9999 ? `${best.toFixed(0)}ms` : "—"}</span></Row>
    <div onClick={click} style={{ background: color, height: 200, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--vlc-fg, var(--vlc-text-primary))", fontWeight: 700, fontSize: 20, userSelect: "none" }}>
      {state === "idle" && "Tap to start"}{state === "wait" && "Wait for green…"}{state === "go" && "DRAW!"}{state === "result" && (time < 0 ? "Too early!" : `${time.toFixed(0)}ms — tap to retry`)}
    </div>
  </Panel>);
}
