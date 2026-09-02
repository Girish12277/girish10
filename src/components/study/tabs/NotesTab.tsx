import { useMemo, useState } from "react";
import { useStudyStore } from "@/store/studyStore";
import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { formatTime } from "@/utils/formatTime";
import { srcKey } from "@/utils/srcKey";
import { cardStyle, SectionTitle, TextInput, PrimaryBtn, GhostBtn, EmptyHint } from "../ui";

export function NotesTab() {
  const notes = useStudyStore((s) => s.notes);
  const addNote = useStudyStore((s) => s.addNote);
  const updateNote = useStudyStore((s) => s.updateNote);
  const deleteNote = useStudyStore((s) => s.deleteNote);
  const playlist = usePlayerStore((s) => s.playlist);
  const idx = usePlayerStore((s) => s.currentIndex);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const currentSrc = playlist[idx]?.src;
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return notes.slice().reverse();
    return notes.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)).reverse();
  }, [notes, query]);

  const save = () => {
    if (!title.trim() && !body.trim()) return;
    if (editingId) {
      updateNote(editingId, { title: title.trim() || "Untitled", body });
      setEditingId(null);
    } else {
      addNote({
        title: title.trim() || "Untitled", body,
        videoSrcKey: currentSrc ? srcKey(currentSrc) : undefined,
        videoTime: videoRef.current?.currentTime,
      });
    }
    setTitle(""); setBody("");
  };

  const jumpTo = (n: { videoTime?: number }) => {
    if (n.videoTime == null || !videoRef.current) return;
    videoRef.current.currentTime = n.videoTime;
    void videoRef.current.play().catch(() => undefined);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
      <div className="flex flex-col gap-2" style={cardStyle}>
        <div className="text-[11px] uppercase tracking-widest" style={{ color: "var(--vlc-text-disabled)" }}>
          {editingId ? "Edit note" : "New note"}{currentSrc ? ` · @ ${formatTime(videoRef.current?.currentTime ?? 0)}` : ""}
        </div>
        <TextInput placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Write something useful… (Markdown OK)" value={body} onChange={(e) => setBody(e.target.value)}
          rows={10} className="w-full px-2.5 py-2 text-[12px] rounded-md outline-none font-mono"
          style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", resize: "vertical" }} />
        <div className="flex justify-end gap-2">
          {editingId && <GhostBtn onClick={() => { setEditingId(null); setTitle(""); setBody(""); }}>Cancel</GhostBtn>}
          <PrimaryBtn onClick={save}>{editingId ? "Save" : "Add note"}</PrimaryBtn>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <TextInput placeholder="Search notes…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
          {filtered.length === 0 && <EmptyHint>No notes yet.</EmptyHint>}
          {filtered.map((n) => (
            <div key={n.id} style={cardStyle}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-[13px] font-semibold truncate">{n.title}</div>
                <div className="flex gap-1">
                  {n.videoTime != null && (
                    <button onClick={() => jumpTo(n)} className="text-[10.5px] vlc-num px-1.5 py-0.5 rounded"
                      style={{ background: "color-mix(in oklab, var(--vlc-accent) 22%, transparent)", color: "var(--vlc-accent)", fontWeight: 700 }}>
                      ▶ {formatTime(n.videoTime)}
                    </button>
                  )}
                  <button onClick={() => { setEditingId(n.id); setTitle(n.title); setBody(n.body); }} aria-label="Edit" className="text-[11px] opacity-60 hover:opacity-100">✎</button>
                  <button onClick={() => deleteNote(n.id)} aria-label="Delete" className="text-[11px] opacity-40 hover:opacity-100">✕</button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap break-words text-[12px] font-sans" style={{ color: "var(--vlc-text-secondary)" }}>{n.body}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
