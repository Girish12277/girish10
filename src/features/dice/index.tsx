import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";
const F = ["⚀","⚁","⚂","⚃","⚄","⚅"];
export default function Dice() {
  const [n, setN] = useState(2);
  const [r, setR] = useState<number[]>([1,1]);
  const [spin, setSpin] = useState(false);
  const roll = () => { setSpin(true); setTimeout(()=>{ setR(Array.from({length:n},()=>1+Math.floor(Math.random()*6))); setSpin(false); }, 400); };
  return (
    <Panel>
      <Row>Dice: {[1,2,3,4,5,6].map(i=><Btn key={i} active={n===i} onClick={()=>{setN(i);setR(Array(i).fill(1));}}>{i}</Btn>)}</Row>
      <div style={{ fontSize: 64, textAlign: "center", margin: "16px 0", letterSpacing: 8, transform: spin?"rotate(20deg)":"rotate(0)", transition:"transform 400ms" }}>{r.map((v,i)=><span key={i}>{F[v-1]}</span>)}</div>
      <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 8 }}>Sum: {r.reduce((a,b)=>a+b,0)}</div>
      <Row style={{ justifyContent: "center" }}><Btn onClick={roll} disabled={spin}>Roll</Btn></Row>
    </Panel>
  );
}
