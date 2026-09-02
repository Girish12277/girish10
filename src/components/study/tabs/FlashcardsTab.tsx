import { useEffect, useMemo, useState } from "react";
import { useStudyStore } from "@/store/studyStore";
import { cardStyle, SectionTitle, TextInput, PrimaryBtn, EmptyHint } from "../ui";

export function FlashcardsTab() {
  const decks = useStudyStore((s) => s.decks);
  const cards = useStudyStore((s) => s.cards);
  const addDeck = useStudyStore((s) => s.addDeck);
  const addCard = useStudyStore((s) => s.addCard);
  const review = useStudyStore((s) => s.reviewCard);
  const deleteCard = useStudyStore((s) => s.deleteCard);

  const [deckId, setDeckId] = useState<string>(decks[0]?.id ?? "");
  useEffect(() => { if (!deckId && decks[0]) setDeckId(decks[0].id); }, [decks, deckId]);

  const [front, setFront] = useState(""); const [back, setBack] = useState("");
  const [show, setShow] = useState(false);

  const dueCards = useMemo(() => cards.filter((c) => c.deckId === deckId && c.due <= Date.now()), [cards, deckId]);
  const current = dueCards[0];

  const onReview = (q: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!current) return;
    review(current.id, q);
    setShow(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle action={
        <button onClick={() => {
          const name = prompt("Deck name?")?.trim();
          if (name) { const id = addDeck(name); setDeckId(id); }
        }} className="text-[11px]" style={{ color: "var(--vlc-accent)" }}>+ New deck</button>
      }>Flashcards · Spaced Repetition</SectionTitle>

      {decks.length === 0 ? <EmptyHint>Create a deck to start.</EmptyHint> : (
        <>
          <div className="flex gap-2 items-center">
            <select value={deckId} onChange={(e) => setDeckId(e.target.value)}
              className="px-2 py-1.5 text-[12px] rounded-md"
              style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }}>
              {decks.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <span className="text-[11px]" style={{ color: "var(--vlc-text-secondary)" }}>
              {cards.filter((c) => c.deckId === deckId).length} cards · {dueCards.length} due
            </span>
          </div>

          {current ? (
            <div style={{ ...cardStyle, padding: 24, minHeight: 220 }} className="flex flex-col items-center justify-center text-center cursor-pointer"
              onClick={() => setShow((v) => !v)}>
              <div className="text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--vlc-text-disabled)" }}>
                {show ? "Answer" : "Question · click to flip"}
              </div>
              <div className="text-[18px] font-medium whitespace-pre-wrap">{show ? current.back : current.front}</div>
              {show && (
                <div className="flex gap-2 mt-6">
                  {([
                    [0, "Again", "#ff6b6b"],
                    [3, "Hard", "#f59e0b"],
                    [4, "Good", "var(--vlc-accent)"],
                    [5, "Easy", "#4ade80"],
                  ] as const).map(([q, label, color]) => (
                    <button key={q} onClick={(e) => { e.stopPropagation(); onReview(q); }}
                      className="px-3 py-1.5 text-[12px] font-semibold rounded-md"
                      style={{ background: `color-mix(in oklab, ${color} 22%, transparent)`, color, border: `1px solid ${color}` }}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={cardStyle} className="text-center py-8" >
              <div className="text-[13px]" style={{ color: "var(--vlc-text-secondary)" }}>All caught up. ✨ Add cards below to build the deck.</div>
            </div>
          )}

          <div style={cardStyle}>
            <div className="text-[11px] uppercase tracking-widest mb-2" style={{ color: "var(--vlc-text-disabled)" }}>Add card</div>
            <div className="grid grid-cols-2 gap-2">
              <TextInput placeholder="Front" value={front} onChange={(e) => setFront(e.target.value)} />
              <TextInput placeholder="Back" value={back} onChange={(e) => setBack(e.target.value)} />
            </div>
            <div className="flex justify-end mt-2">
              <PrimaryBtn onClick={() => { if (front.trim() && back.trim()) { addCard(deckId, front.trim(), back.trim()); setFront(""); setBack(""); } }}>Add</PrimaryBtn>
            </div>
          </div>

          {cards.filter((c) => c.deckId === deckId).length > 0 && (
            <details>
              <summary className="text-[11px] cursor-pointer" style={{ color: "var(--vlc-text-secondary)" }}>All cards</summary>
              <ul className="mt-2 space-y-1">
                {cards.filter((c) => c.deckId === deckId).map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-[12px] py-1 px-2 rounded"
                    style={{ background: "var(--vlc-bg-sunken)" }}>
                    <span className="truncate">{c.front} <span style={{ color: "var(--vlc-text-disabled)" }}>→ {c.back}</span></span>
                    <button onClick={() => deleteCard(c.id)} className="opacity-40 hover:opacity-100">✕</button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </div>
  );
}
