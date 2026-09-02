import { useState } from "react";
import { Btn, Panel, Row } from "../_shared/ui";

const FIRST = "Alex,Sam,Jordan,Riley,Casey,Quinn,Avery,Morgan,Skyler,Reese,Charlie,Drew,Hayden,Phoenix,Sage,Rowan,Emerson,Finley,Kai,Luca,Mira,Noor,Aria,Iris,Nova,Maya,Zara,Theo,Otis,Ezra".split(",");
const LAST = "Stone,Hart,Rivers,Vale,Knox,Frost,Wells,Voss,Cole,Pierce,Sloane,Mercer,Quill,Reign,Vesper,Crane,Locke,Marsh,Ash,Dune,Brook,Cliff,Wren,Lane,Reed,Beck,Falk,Holt,Rune,Pax".split(",");
const ADJ = "Brave,Silent,Wild,Quick,Bright,Calm,Lucky,Bold,Sharp,Mellow,Cosmic,Iron,Velvet,Neon,Crimson,Frosty,Solar,Lunar,Plasma,Quantum".split(",");
const NOUN = "Falcon,Tiger,Comet,Phoenix,Otter,Lynx,Drake,Heron,Atlas,Ember,Nebula,Cipher,Echo,Pulse,Vortex,Ranger,Wanderer,Glimmer,Saber,Arrow".split(",");
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export default function RandomName() {
  const [list, setList] = useState<string[]>([]);
  const [mode, setMode] = useState<"real" | "fantasy">("real");
  const gen = () => setList(Array.from({ length: 10 }, () => mode === "real" ? `${pick(FIRST)} ${pick(LAST)}` : `${pick(ADJ)} ${pick(NOUN)}`));
  return (
    <Panel>
      <Row>
        <Btn active={mode === "real"} onClick={() => setMode("real")}>Real</Btn>
        <Btn active={mode === "fantasy"} onClick={() => setMode("fantasy")}>Fantasy</Btn>
        <Btn onClick={gen}>Generate 10</Btn>
      </Row>
      <ul style={{ marginTop: 8, padding: 0, listStyle: "none", fontFamily: "var(--vlc-font-mono, monospace)" }}>
        {list.map((n, i) => <li key={i} style={{ padding: "4px 8px", borderBottom: "1px solid var(--vlc-border-subtle)" }}>{n}</li>)}
      </ul>
    </Panel>
  );
}
