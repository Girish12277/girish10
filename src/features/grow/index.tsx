import { useEffect, useState } from "react";
import { Panel, Row, Btn, loadNum, saveNum } from "../_shared/ui";
export default function Grow() {
  const [coins, setCoins] = useState(() => loadNum("grow-coins", 0));
  const [plants, setPlants] = useState(() => loadNum("grow-plants", 1));
  const [lvl, setLvl] = useState(() => loadNum("grow-lvl", 1));
  useEffect(() => { const i = setInterval(() => setCoins((c) => c + plants * lvl), 1000); return () => clearInterval(i); }, [plants, lvl]);
  useEffect(() => { saveNum("grow-coins", coins); }, [coins]);
  useEffect(() => { saveNum("grow-plants", plants); saveNum("grow-lvl", lvl); }, [plants, lvl]);
  const plantCost = plants * 50; const lvlCost = lvl * 200;
  return (<Panel><Row><b>Grow Garden</b><span style={{ marginLeft: "auto" }}>🌱 +{plants * lvl}/s</span></Row>
    <div style={{ fontSize: 36, fontWeight: 800, textAlign: "center", padding: 12, color: "var(--vlc-accent)" }}>{coins} 🪙</div>
    <div style={{ fontSize: 28, textAlign: "center", padding: 8 }}>{"🌿".repeat(Math.min(20, plants))}</div>
    <Row><Btn onClick={() => { if (coins >= plantCost) { setCoins(coins - plantCost); setPlants(plants + 1); } }} disabled={coins < plantCost}>Buy plant ({plantCost})</Btn>
      <Btn onClick={() => { if (coins >= lvlCost) { setCoins(coins - lvlCost); setLvl(lvl + 1); } }} disabled={coins < lvlCost}>Upgrade (Lv {lvl}, {lvlCost})</Btn></Row>
    <Row><Btn onClick={() => { setCoins(0); setPlants(1); setLvl(1); }}>Reset</Btn></Row>
  </Panel>);
}
