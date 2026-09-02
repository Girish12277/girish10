import { useMemo, useState } from "react";
import { Clock, Play, Edit3, Trash2 } from "lucide-react";
import { useStudyStore } from "@/store/studyStore";
import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { formatTime } from "@/utils/formatTime";
import { srcKey } from "@/utils/srcKey";
import { cardStyle, TextInput, PrimaryBtn, GhostBtn, EmptyHint } from "../ui";

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

  const insertTimestamp = () => {
    const curTime = videoRef.current?.currentTime ?? 0;
    const timeStr = `[${formatTime(curTime)}] `;
    setBody((prev) => prev + (prev.length && !prev.endsWith("\n") ? "\n" : "") + timeStr);
  };

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

  const jumpToTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    void videoRef.current.play().catch(() => undefined);
  };

  /** Parse timestamp brackets like [01:45] into clickable interactive badges */
  const renderInteractiveBody = (text: string) => {
    const parts = text.split(/(\[\d{1,2}:\d{2}\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[(\d{1,2}):(\d{2})\]$/);
      if (match) {
        const mins = parseInt(match[1], 10);
        const secs = parseInt(match[2], 10);
        const totalSeconds = mins * 60 + secs;
        return (
          <button
            key={i}
            onClick={() => jumpToTime(totalSeconds)}
            className="group inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded text-[11px] font-bold vlc-num transition-all hover:scale-105 press"
            style={{ background: "color-mix(in oklab, var(--vlc-accent) 20%, transparent)", color: "var(--vlc-accent)", border: "1px solid var(--vlc-border-subtle)" }}
          >
            <Play className="w-2.5 h-2.5 fill-current group-hover:translate-x-0.5 transition-transform" /> {match[1]}:{match[2]}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
      <div className="flex flex-col gap-3" style={cardStyle}>
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--vlc-text-disabled)" }}>
            {editingId ? "Edit Note" : "New Video-Linked Note"}
          </div>
          <button
            onClick={insertTimestamp}
            className="group flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all press"
            style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-normal)", color: "var(--vlc-accent)" }}
          >
            <Clock className="w-3.5 h-3.5 group-hover:scale-120 transition-transform" />
            Insert Time Bookmark
          </button>
        </div>
        <TextInput placeholder="Note Title…" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          placeholder="Type notes here… Click 'Insert Time Bookmark' to tag key video timestamps like [02:30]!"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={11}
          className="w-full px-3 py-2.5 text-[12px] rounded-md outline-none font-mono"
          style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)", resize: "vertical" }}
        />
        <div className="flex justify-end gap-2">
          {editingId && <GhostBtn onClick={() => { setEditingId(null); setTitle(""); setBody(""); }}>Cancel</GhostBtn>}
          <PrimaryBtn onClick={save}>{editingId ? "Save Note" : "Add Note"}</PrimaryBtn>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <TextInput placeholder="Search notes…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
          {filtered.length === 0 && <EmptyHint>No notes yet. Create your first note!</EmptyHint>}
          {filtered.map((n) => (
            <div key={n.id} style={cardStyle} className="flex flex-col gap-2">
              <div className="flex items-center justify-between hairline-bottom pb-2" style={{ borderBottom: "1px solid var(--vlc-border-subtle)" }}>
                <div className="text-[13px] font-bold truncate">{n.title}</div>
                <div className="flex items-center gap-1.5">
                  {n.videoTime != null && (
                    <button
                      onClick={() => jumpToTime(n.videoTime!)}
                      className="group flex items-center gap-1 text-[10.5px] vlc-num px-2 py-0.5 rounded font-bold"
                      style={{ background: "color-mix(in oklab, var(--vlc-accent) 22%, transparent)", color: "var(--vlc-accent)" }}
                    >
                      <Play className="w-2.5 h-2.5 fill-current group-hover:translate-x-0.5 transition-transform" /> {formatTime(n.videoTime)}
                    </button>
                  )}
                  <button onClick={() => { setEditingId(n.id); setTitle(n.title); setBody(n.body); }} aria-label="Edit" className="p-1 opacity-60 hover:opacity-100 hover:scale-115 transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteNote(n.id)} aria-label="Delete" className="p-1 opacity-40 hover:opacity-100 hover:scale-115 transition-all">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap break-words text-[12px] font-sans leading-relaxed" style={{ color: "var(--vlc-text-secondary)" }}>
                {renderInteractiveBody(n.body)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
