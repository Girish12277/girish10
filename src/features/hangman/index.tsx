import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
const WORDS = ["JAVASCRIPT","CANVAS","VIDEO","PLAYER","KEYBOARD","SHORTCUT","FULLSCREEN","SUBTITLE","PLAYLIST","VOLUME","MOMENTUM","PIXEL","REACT","BUTTON","STREAM"];
const pick = () => WORDS[Math.floor(Math.random()*WORDS.length)];
export default function Hangman() {
  const [w, setW] = useState(pick());
  const [g, setG] = useState<Set<string>>(new Set());
  const wrong = [...g].filter(c=>!w.includes(c)).length;
  const won = [...w].every(c=>g.has(c));
  const dead = wrong>=6;
  const guess = (c: string) => { if (g.has(c)||won||dead) return; setG(new Set([...g,c])); };
  return (
    <Panel>
      <Row>Misses: {wrong}/6 {won&&"· You won! 🎉"} {dead&&`· Lost — word was ${w}`}</Row>
      <div style={{ fontSize: 28, textAlign: "center", letterSpacing: 8, margin: "16px 0", fontFamily: "monospace" }}>
        {[...w].map((c,i)=><span key={i}>{g.has(c)||dead?c:"_"}</span>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 3 }}>
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(c=>(
          <button key={c} onClick={()=>guess(c)} disabled={g.has(c)||won||dead}
            style={{ padding:6, background: g.has(c)?(w.includes(c)?"#5cdb95":"#ff6b6b"):"var(--vlc-bg-elevated)", color:"var(--vlc-text-primary)",border:"1px solid var(--vlc-border-subtle)",borderRadius:4,fontSize:11,fontWeight:700,cursor:"pointer"}}>{c}</button>
        ))}
      </div>
      <Row style={{ marginTop: 12, justifyContent: "center" }}><Btn onClick={()=>{setW(pick());setG(new Set());}}>New Word</Btn></Row>
    </Panel>
  );
}
