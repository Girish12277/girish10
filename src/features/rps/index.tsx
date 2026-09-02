import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

const C = ["✊","✋","✌️"] as const;
const N = ["Rock","Paper","Scissors"];

export default function RPS() {
  const [you, setYou] = useState(-1);
  const [cpu, setCpu] = useState(-1);
  const [w, setW] = useState({ y: 0, c: 0, d: 0 });
  const play = (i: number) => {
    const j = Math.floor(Math.random()*3); setYou(i); setCpu(j);
    if (i===j) setW(w=>({ ...w, d: w.d+1 }));
    else if ((i+1)%3===j) setW(w=>({ ...w, c: w.c+1 }));
    else setW(w=>({ ...w, y: w.y+1 }));
  };
  const r = you<0?"":you===cpu?"Draw":(you+1)%3===cpu?"CPU wins":"You win!";
  return (
    <Panel>
      <Row>You {w.y} · CPU {w.c} · Draws {w.d}</Row>
      <div style={{ display: "flex", justifyContent: "space-around", fontSize: 56, margin: "16px 0" }}>
        <div>{you<0?"❓":C[you]}<div style={{fontSize:11,marginTop:4}}>You</div></div>
        <div>{cpu<0?"❓":C[cpu]}<div style={{fontSize:11,marginTop:4}}>CPU</div></div>
      </div>
      <div style={{textAlign:"center",height:20,marginBottom:8,fontWeight:700}}>{r}</div>
      <Row style={{ justifyContent: "center" }}>{C.map((c,i)=><Btn key={i} onClick={()=>play(i)}>{c} {N[i]}</Btn>)}</Row>
    </Panel>
  );
}
