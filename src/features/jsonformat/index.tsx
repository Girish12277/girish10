import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

export default function JsonFormat() {
  const [t, setT] = useState('{"hello":"world","n":42}');
  const [msg, setMsg] = useState("");
  const fmt = (n: number) => { try { setT(JSON.stringify(JSON.parse(t), null, n)); setMsg("OK"); } catch (e) { setMsg(String((e as Error).message)); } };
  const min = () => { try { setT(JSON.stringify(JSON.parse(t))); setMsg("OK"); } catch (e) { setMsg(String((e as Error).message)); } };
  return (
    <Panel>
      <textarea value={t} onChange={e=>setT(e.target.value)} spellCheck={false}
        style={{ width: "100%", height: 240, padding: 10, background: "var(--vlc-bg-base)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, fontFamily: "monospace", fontSize: 12 }} />
      <Row><Btn onClick={() => fmt(2)}>Format 2</Btn><Btn onClick={() => fmt(4)}>Format 4</Btn><Btn onClick={min}>Minify</Btn><span style={{ color: msg==="OK"?"#43a047":"#c62828", fontSize: 12 }}>{msg}</span></Row>
    </Panel>
  );
}
