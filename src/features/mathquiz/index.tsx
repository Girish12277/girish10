import { useEffect, useRef, useState } from "react";
import { Btn, Panel, Row, loadNum, saveNum } from "../_shared/ui";
type Q = { a: number; b: number; op: string; ans: number };
const mk = (): Q => { const op = ["+","−","×"][Math.floor(Math.random()*3)]; const a = 1+Math.floor(Math.random()*(op==="×"?12:50)); const b = 1+Math.floor(Math.random()*(op==="×"?12:50)); const ans = op==="+"?a+b:op==="−"?a-b:a*b; return { a, b, op, ans }; };
export default function MathQuiz() {
  const [q, setQ] = useState(mk());
  const [v, setV] = useState("");
  const [score, setScore] = useState(0);
  const [t, setT] = useState(60);
  const [run, setRun] = useState(false);
  const [best, setBest] = useState(loadNum("math-best"));
  const ref = useRef<HTMLInputElement|null>(null);
  useEffect(() => {
    if (!run) return;
    const id = setInterval(()=>setT(t=>{ if(t<=1){ setRun(false); if(score>best){setBest(score);saveNum("math-best",score);} return 0; } return t-1; }), 1000);
    return () => clearInterval(id);
  }, [run, score, best]);
  const submit = () => {
    if (!run) return;
    if (parseInt(v)===q.ans) setScore(s=>s+1);
    setQ(mk()); setV(""); ref.current?.focus();
  };
  const start = () => { setScore(0); setT(60); setRun(true); setQ(mk()); setV(""); setTimeout(()=>ref.current?.focus(),0); };
  return (
    <Panel>
      <Row>Score {score} · Time {t}s · Best {best}</Row>
      <div style={{ fontSize: 32, textAlign: "center", margin: "20px 0", fontWeight: 700 }}>{q.a} {q.op} {q.b} = ?</div>
      <Row style={{ justifyContent: "center" }}>
        <input ref={ref} value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} disabled={!run}
          style={{ padding:8, width:120, fontSize:18, textAlign:"center", background:"var(--vlc-bg-elevated)",color:"var(--vlc-text-primary)",border:"1px solid var(--vlc-border-normal)",borderRadius:6 }}/>
        {run ? <Btn onClick={submit}>↵</Btn> : <Btn onClick={start}>Start 60s</Btn>}
      </Row>
    </Panel>
  );
}
