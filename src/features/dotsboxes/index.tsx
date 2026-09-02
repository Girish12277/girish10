import { useState } from "react";
import { Panel, Btn } from "../_shared/ui";

const N = 4; // dots
type Lines = { h: boolean[][]; v: boolean[][] };
type Owner = (0|1|2)[][];

const empty = (): Lines => ({ h: Array.from({length:N},()=>Array(N-1).fill(false)), v: Array.from({length:N-1},()=>Array(N).fill(false)) });

export default function DotsBoxes() {
  const [lines, setLines] = useState<Lines>(empty);
  const [owner, setOwner] = useState<Owner>(() => Array.from({length:N-1},()=>Array(N-1).fill(0)) as Owner);
  const [turn, setTurn] = useState<1|2>(1);

  const closes = (l: Lines, oy: number, ox: number) =>
    l.h[oy][ox] && l.h[oy+1][ox] && l.v[oy][ox] && l.v[oy][ox+1];

  const place = (type: "h"|"v", y: number, x: number) => {
    if ((type === "h" ? lines.h[y][x] : lines.v[y][x])) return;
    const nl: Lines = { h: lines.h.map(r=>[...r]), v: lines.v.map(r=>[...r]) };
    if (type === "h") nl.h[y][x] = true; else nl.v[y][x] = true;
    let gained = false;
    const no = owner.map(r=>[...r]) as Owner;
    for (let oy = 0; oy < N-1; oy++) for (let ox = 0; ox < N-1; ox++)
      if (!owner[oy][ox] && closes(nl, oy, ox)) { no[oy][ox] = turn; gained = true; }
    setLines(nl); setOwner(no);
    if (!gained) setTurn(turn === 1 ? 2 : 1);
  };

  const s1 = owner.flat().filter(o => o === 1).length;
  const s2 = owner.flat().filter(o => o === 2).length;

  const cell = 60;
  return (
    <Panel>
      <div style={{ position: "relative", width: cell*(N-1)+20, height: cell*(N-1)+20 }}>
        {Array.from({length:N}).map((_,y) => Array.from({length:N}).map((__,x) => (
          <div key={`d-${y}-${x}`} style={{ position: "absolute", left: x*cell+6, top: y*cell+6, width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
        )))}
        {lines.h.map((row,y) => row.map((on,x) => (
          <div key={`h-${y}-${x}`} onClick={() => place("h", y, x)} style={{ position: "absolute", left: x*cell+14, top: y*cell+8, width: cell-12, height: 4, background: on ? "#42a5f5" : "transparent", cursor: "pointer", borderRadius: 2 }} />
        )))}
        {lines.v.map((row,y) => row.map((on,x) => (
          <div key={`v-${y}-${x}`} onClick={() => place("v", y, x)} style={{ position: "absolute", left: x*cell+8, top: y*cell+14, width: 4, height: cell-12, background: on ? "#42a5f5" : "transparent", cursor: "pointer", borderRadius: 2 }} />
        )))}
        {owner.map((row,y) => row.map((o,x) => o ? (
          <div key={`o-${y}-${x}`} style={{ position: "absolute", left: x*cell+18, top: y*cell+18, width: cell-20, height: cell-20, display: "grid", placeItems: "center", color: o===1?"#e53935":"#43a047", fontWeight: 700, fontSize: 20 }}>{o===1?"A":"B"}</div>
        ) : null))}
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <span style={{ color: turn===1?"#fff":"#888" }}>A: {s1}</span>
        <span style={{ color: turn===2?"#fff":"#888" }}>B: {s2}</span>
        <Btn onClick={() => { setLines(empty()); setOwner(Array.from({length:N-1},()=>Array(N-1).fill(0)) as Owner); setTurn(1); }}>New</Btn>
      </div>
    </Panel>
  );
}
