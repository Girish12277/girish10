import { useState } from "react";
import { Panel, Btn, Row } from "../_shared/ui";

type Card = { r: string; s: string };
const SUITS = ["♠","♥","♦","♣"];
const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const newDeck = (): Card[] => SUITS.flatMap(s => RANKS.map(r => ({ r, s }))).sort(() => Math.random() - 0.5);
const val = (h: Card[]) => {
  let t = 0, a = 0;
  h.forEach(c => { if (c.r === "A") { t += 11; a++; } else if ("JQK".includes(c.r)) t += 10; else t += +c.r; });
  while (t > 21 && a > 0) { t -= 10; a--; }
  return t;
};

export default function Blackjack() {
  const [deck, setDeck] = useState<Card[]>(newDeck);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [stand, setStand] = useState(false);
  const [msg, setMsg] = useState("Press Deal");

  const deal = () => {
    const d = newDeck();
    setDeck(d.slice(4)); setPlayer([d[0], d[2]]); setDealer([d[1], d[3]]);
    setStand(false); setMsg("");
  };
  const hit = () => {
    const c = deck[0]; const nd = deck.slice(1); const np = [...player, c];
    setDeck(nd); setPlayer(np);
    if (val(np) > 21) { setStand(true); setMsg("Bust!"); }
  };
  const finish = () => {
    let d = [...dealer], dk = [...deck];
    while (val(d) < 17) { d.push(dk[0]); dk = dk.slice(1); }
    setDealer(d); setDeck(dk); setStand(true);
    const p = val(player), dv = val(d);
    setMsg(dv > 21 || p > dv ? "You win!" : p === dv ? "Push" : "Dealer wins");
  };

  const show = (h: Card[]) => h.map((c, i) => <span key={i} style={{ padding: "4px 8px", margin: 2, background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-subtle)", borderRadius: 4, color: "♥♦".includes(c.s) ? "#e57373" : "var(--vlc-text-primary)" }}>{c.r}{c.s}</span>);

  return (
    <Panel>
      <div style={{ marginBottom: 8 }}>Dealer ({stand ? val(dealer) : "?"}): {show(stand ? dealer : dealer.slice(0,1))}</div>
      <div style={{ marginBottom: 8 }}>You ({val(player)}): {show(player)}</div>
      <Row>
        <Btn onClick={deal}>Deal</Btn>
        <Btn onClick={hit} disabled={!player.length || stand}>Hit</Btn>
        <Btn onClick={finish} disabled={!player.length || stand}>Stand</Btn>
      </Row>
      <div>{msg}</div>
    </Panel>
  );
}
