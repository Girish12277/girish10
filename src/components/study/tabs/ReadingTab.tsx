import { useState } from "react";
import { useStudyStore } from "@/store/studyStore";
import { cardStyle, SectionTitle, TextInput, NumInput, PrimaryBtn, EmptyHint } from "../ui";

export function ReadingTab() {
  const items = useStudyStore((s) => s.reading);
  const add = useStudyStore((s) => s.addReading);
  const upd = useStudyStore((s) => s.updateReading);
  const del = useStudyStore((s) => s.deleteReading);

  const [title, setTitle] = useState(""); const [author, setAuthor] = useState(""); const [total, setTotal] = useState(200);

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Reading List</SectionTitle>
      <div style={cardStyle} className="flex gap-2 flex-wrap">
        <TextInput placeholder="Book title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextInput placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <NumInput value={total} min={1} max={10000} onChange={setTotal} />
        <PrimaryBtn onClick={() => { if (title.trim()) { add({ title: title.trim(), author, totalPages: total }); setTitle(""); setAuthor(""); } }}>Add</PrimaryBtn>
      </div>
      {items.length === 0 ? <EmptyHint>Add a book to track progress.</EmptyHint> : (
        <ul className="flex flex-col gap-2">
          {items.map((r) => {
            const pct = r.totalPages > 0 ? Math.round((r.currentPage / r.totalPages) * 100) : 0;
            return (
              <li key={r.id} style={cardStyle}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold truncate">{r.title}</div>
                    {r.author && <div className="text-[11px]" style={{ color: "var(--vlc-text-secondary)" }}>{r.author}</div>}
                  </div>
                  <span className="text-[11px] vlc-num tabular-nums">{r.currentPage}/{r.totalPages} · {pct}%</span>
                </div>
                <input type="range" min={0} max={r.totalPages} value={r.currentPage}
                  onChange={(e) => upd(r.id, { currentPage: Number(e.target.value), finishedAt: Number(e.target.value) >= r.totalPages ? Date.now() : null })}
                  className="w-full mt-2" style={{ accentColor: "var(--vlc-accent)" }} />
                <div className="text-right"><button onClick={() => del(r.id)} className="text-[11px] opacity-40 hover:opacity-100">Delete</button></div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
