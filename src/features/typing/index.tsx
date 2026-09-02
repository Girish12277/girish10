import { useEffect, useRef, useState } from "react";
import { Btn, Panel, Row, loadNum, saveNum } from "../_shared/ui";
const TEXTS = [
  "the quick brown fox jumps over the lazy dog every single morning before breakfast",
  "video playback at sixty frames per second feels smooth when buffering does not stall",
  "keyboard shortcuts make multimedia players feel powerful and responsive to users",
];
export default function Typing() {
  const [text, setText] = useState(TEXTS[0]);
  const [v, setV] = useState("");
  const [start, setStart] = useState(0);
  const [done, setDone] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [best, setBest] = useState(loadNum("type-best"));
  const ref = useRef<HTMLInputElement|null>(null);
  const reset = () => { setText(TEXTS[Math.floor(Math.random()*TEXTS.length)]); setV(""); setStart(0); setDone(false); setWpm(0); setTimeout(()=>ref.current?.focus(),0); };
  useEffect(reset, []);
  const onChange = (s: string) => {
    if (!start) setStart(performance.now());
    setV(s);
    if (s===text) {
      const min = (performance.now()-start)/60000;
      const w = Math.round(text.split(" ").length / min);
      setWpm(w); setDone(true);
      if (w>best){setBest(w);saveNum("type-best",w);}
    }
  };
  return (
    <Panel>
      <Row>WPM {wpm} · Best {best}</Row>
      <div style={{ padding: 10, background:"var(--vlc-bg-elevated)", borderRadius: 6, fontFamily:"monospace", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
        {[...text].map((c,i)=>{
          const t = v[i]; const color = t==null?"var(--vlc-text-secondary)":t===c?"#5cdb95":"#ff6b6b";
          return <span key={i} style={{ color, background: i===v.length?"var(--vlc-accent-dim)":"transparent" }}>{c}</span>;
        })}
      </div>
      <Row>
        <input ref={ref} value={v} onChange={e=>onChange(e.target.value)} disabled={done} style={{ flex:1,padding:8,background:"var(--vlc-bg-elevated)",color:"var(--vlc-text-primary)",border:"1px solid var(--vlc-border-normal)",borderRadius:6,fontFamily:"monospace" }}/>
        <Btn onClick={reset}>New</Btn>
      </Row>
    </Panel>
  );
}
