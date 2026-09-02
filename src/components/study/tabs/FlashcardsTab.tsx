import { useEffect, useMemo, useState } from "react";
import { Sparkles, Plus, Trash2 } from "lucide-react";
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
  const [flipped, setFlipped] = useState(false);

  const dueCards = useMemo(() => cards.filter((c) => c.deckId === deckId && c.due <= Date.now()), [cards, deckId]);
  const current = dueCards[0];

  const onReview = (q: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!current) return;
    review(current.id, q);
    setFlipped(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle action={
        <button onClick={() => {
          const name = prompt("Deck name?")?.trim();
          if (name) { const id = addDeck(name); setDeckId(id); }
        }} className="flex items-center gap-1 text-[11px] font-bold group" style={{ color: "var(--vlc-accent)" }}>
          <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" /> New Deck
        </button>
      }>Flashcards Pro · SM-2 Spaced Repetition</SectionTitle>

      {decks.length === 0 ? <EmptyHint>Create a deck to start reviewing.</EmptyHint> : (
        <>
          <div className="flex gap-3 items-center justify-between">
            <select value={deckId} onChange={(e) => setDeckId(e.target.value)}
              className="px-3 py-1.5 text-[12px] font-medium rounded-md"
              style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }}>
              {decks.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <span className="text-[11px] font-semibold" style={{ color: "var(--vlc-text-secondary)" }}>
              {cards.filter((c) => c.deckId === deckId).length} Cards · <span style={{ color: "var(--vlc-accent)" }}>{dueCards.length} Due for Review</span>
            </span>
          </div>

          {current ? (
            <div className="flex flex-col items-center gap-4">
              {/* 3D Flip Card Container */}
              <div
                className="w-full relative cursor-pointer select-none perspective-1000"
                style={{ height: 230, perspective: 1000 }}
                onClick={() => setFlipped(!flipped)}
              >
                <div
                  className="w-full h-full relative transition-all duration-500 rounded-2xl flex items-center justify-center p-8 text-center"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    background: "var(--vlc-bg-elevated)",
                    border: "1px solid var(--vlc-border-normal)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Front Side */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--vlc-text-disabled)" }}>
                      Question · Click card to flip
                    </div>
                    <div className="text-[20px] font-semibold leading-relaxed" style={{ color: "var(--vlc-text-primary)" }}>
                      {current.front}
                    </div>
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--vlc-accent)" }}>
                      Answer
                    </div>
                    <div className="text-[20px] font-semibold leading-relaxed" style={{ color: "var(--vlc-text-primary)" }}>
                      {current.back}
                    </div>
                  </div>
                </div>
              </div>

              {/* SM-2 Recall Rating Buttons */}
              {flipped ? (
                <div className="flex gap-3 justify-center w-full animate-fade-in">
                  {[
                    [0, "Again", "#ef4444"],
                    [3, "Hard", "#f59e0b"],
                    [4, "Good", "var(--vlc-accent)"],
                    [5, "Easy", "#10b981"],
                  ].map(([q, label, color]) => (
                    <button
                      key={q}
                      onClick={(e) => { e.stopPropagation(); onReview(q as 0 | 1 | 2 | 3 | 4 | 5); }}
                      className="px-4 py-2 text-[12px] font-bold rounded-lg transition-all press"
                      style={{ background: `color-mix(in oklab, ${color} 20%, transparent)`, color: color as string, border: `1px solid ${color}` }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-[11px]" style={{ color: "var(--vlc-text-disabled)" }}>
                  Click card above to reveal answer
                </div>
              )}
            </div>
          ) : (
            <div style={cardStyle} className="flex flex-col items-center justify-center text-center py-10 gap-2">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              <div className="text-[14px] font-semibold" style={{ color: "var(--vlc-text-primary)" }}>All cards reviewed for today!</div>
              <div className="text-[11.5px]" style={{ color: "var(--vlc-text-secondary)" }}>Add new flashcards below to expand your deck.</div>
            </div>
          )}

          <div style={cardStyle}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--vlc-text-disabled)" }}>Add Flashcard</div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput placeholder="Front (Question)" value={front} onChange={(e) => setFront(e.target.value)} />
              <TextInput placeholder="Back (Answer)" value={back} onChange={(e) => setBack(e.target.value)} />
            </div>
            <div className="flex justify-end mt-3">
              <PrimaryBtn onClick={() => { if (front.trim() && back.trim()) { addCard(deckId, front.trim(), back.trim()); setFront(""); setBack(""); } }}>
                <Plus className="w-3.5 h-3.5 inline mr-1" /> Add Card
              </PrimaryBtn>
            </div>
          </div>

          {cards.filter((c) => c.deckId === deckId).length > 0 && (
            <details className="mt-2">
              <summary className="text-[11px] font-semibold cursor-pointer" style={{ color: "var(--vlc-text-secondary)" }}>
                View All Deck Cards ({cards.filter((c) => c.deckId === deckId).length})
              </summary>
              <ul className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {cards.filter((c) => c.deckId === deckId).map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-[12px] py-1.5 px-3 rounded-md"
                    style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)" }}>
                    <span className="truncate">{c.front} <span style={{ color: "var(--vlc-text-disabled)" }}>→ {c.back}</span></span>
                    <button onClick={() => deleteCard(c.id)} className="opacity-40 hover:opacity-100 p-1">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
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
