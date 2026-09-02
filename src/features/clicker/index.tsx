import { useEffect, useState } from "react";
import { Btn, Panel, Row, loadNum, saveNum } from "../_shared/ui";
export default function Clicker() {
  const [c, setC] = useState(() => loadNum("clk-count"));
  const [per, setPer] = useState(() => loadNum("clk-per") || 1);
  const [cost, setCost] = useState(() => loadNum("clk-cost") || 10);
  useEffect(()=>{ saveNum("clk-count",c); saveNum("clk-per",per); saveNum("clk-cost",cost); }, [c,per,cost]);
  const up = () => { if (c>=cost){ setC(c-cost); setPer(per+1); setCost(Math.floor(cost*1.5)); } };
  return (
    <Panel>
      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <div style={{ fontSize: 36, fontWeight: 800 }}>{c}</div>
        <div style={{ fontSize: 11, color:"var(--vlc-text-secondary)" }}>clicks · +{per} per tap</div>
      </div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <button onClick={()=>setC(c+per)} style={{ fontSize: 64, width: 120, height: 120, borderRadius: "50%", background: "var(--vlc-accent)", color: "var(--vlc-bg-base)", border: "none", cursor: "pointer", fontWeight: 800 }}>+{per}</button>
      </div>
      <Row style={{ justifyContent: "center" }}>
        <Btn onClick={up} disabled={c<cost}>Upgrade +1/tap ({cost})</Btn>
        <Btn onClick={()=>{setC(0);setPer(1);setCost(10);}}>Reset</Btn>
      </Row>
    </Panel>
  );
}
