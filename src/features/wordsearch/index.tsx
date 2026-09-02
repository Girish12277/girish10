import { useMemo, useState } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
const WORDS = ["REACT", "MUSIC", "AUDIO", "PIANO", "DRUM", "SOUND", "LOOP", "SYNC"];
const SIZE = 10;
function build() {
  const g: string[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  const placed: { word: string; cells: [number, number][] }[] = [];
  for (const w of WORDS) {
    for (let tries = 0; tries < 80; tries++) {
      const horiz = Math.random() < 0.5; const r = Math.floor(Math.random() * (SIZE - (horiz ? 0 : w.length))); const c = Math.floor(Math.random() * (SIZE - (horiz ? w.length : 0)));
      const cells: [number, number][] = []; let ok = true;
      for (let i = 0; i < w.length; i++) { const cr = horiz ? r : r + i, cc = horiz ? c + i : c; if (g[cr][cc] && g[cr][cc] !== w[i]) { ok = false; break; } cells.push([cr, cc]); }
      if (ok) { cells.forEach(([cr, cc], i) => g[cr][cc] = w[i]); placed.push({ word: w, cells }); break; }
    }
  }
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (!g[r][c]) g[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return { g, placed };
}
export default function WordSearch() {
  const [seed, setSeed] = useState(0);
  const { g, placed } = useMemo(() => build(), [seed]);
  const [found, setFound] = useState<string[]>([]);
  const [sel, setSel] = useState<[number, number][]>([]);
  const toggle = (r: number, c: number) => {
    const next = [...sel, [r, c] as [number, number]];
    const word = next.map(([rr, cc]) => g[rr][cc]).join("");
    const match = placed.find((p) => p.word === word && !found.includes(p.word));
    if (match) { setFound([...found, match.word]); setSel([]); return; }
    if (next.length > 8) setSel([[r, c]]); else setSel(next);
  };
  const isIn = (r: number, c: number) => placed.some((p) => found.includes(p.word) && p.cells.some(([rr, cc]) => rr === r && cc === c));
  return (<Panel><Row><b>Word Search</b><span style={{ marginLeft: "auto" }}>{found.length}/{WORDS.length}</span><Btn onClick={() => { setSeed((s) => s + 1); setFound([]); setSel([]); }}>New</Btn></Row>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE},1fr)`, gap: 2, fontFamily: "monospace", maxWidth: 320, margin: "0 auto" }}>
      {g.flatMap((row, r) => row.map((ch, c) => {
        const found2 = isIn(r, c); const selected = sel.some(([rr, cc]) => rr === r && cc === c);
        return <div key={`${r}-${c}`} onClick={() => toggle(r, c)} style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", background: found2 ? "var(--vlc-accent)" : selected ? "var(--vlc-accent-dim)" : "var(--vlc-bg-elevated)", color: found2 ? "var(--vlc-bg-base)" : "var(--vlc-text-primary)", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>{ch}</div>;
      }))}
    </div>
    <div style={{ marginTop: 10, fontSize: 12, color: "var(--vlc-text-secondary)" }}>{WORDS.map((w) => <span key={w} style={{ marginRight: 8, textDecoration: found.includes(w) ? "line-through" : "none", color: found.includes(w) ? "var(--vlc-accent)" : "inherit" }}>{w}</span>)}</div>
  </Panel>);
}
