import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { formatTime } from "@/utils/formatTime";
import { X, Trash2, Shuffle, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function PlaylistPanel() {
  const open = usePlayerStore((s) => s.playlistOpen);
  const playlist = usePlayerStore((s) => s.playlist);
  const idx = usePlayerStore((s) => s.currentIndex);
  const set = usePlayerStore((s) => s.set);
  const loadIndex = usePlayerStore((s) => s.loadIndex);
  const [height, setHeight] = useState(220);
  const draggingRef = useRef(false);

  useEffect(() => {
    const mv = (e: MouseEvent) => { if (!draggingRef.current) return; const newH = Math.min(window.innerHeight * 0.5, Math.max(120, window.innerHeight - e.clientY - 60)); setHeight(newH); };
    const up = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, []);

  const playItem = (i: number) => { loadIndex(i); setTimeout(() => videoRef.current?.play().catch(() => undefined), 100); };
  const remove = (i: number) => { const np = playlist.filter((_, j) => j !== i); set({ playlist: np, currentIndex: i <= idx ? Math.max(0, idx - 1) : idx }); };
  const clear = () => set({ playlist: [], currentIndex: 0 });
  const randomize = () => { const np = [...playlist].sort(() => Math.random() - 0.5); set({ playlist: np }); };

  return (
    <div data-vlc-region="playlist" style={{ height: open ? height : 0, transition: "height 0.25s ease", overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <div onMouseDown={() => { draggingRef.current = true; }} style={{ height: 4, cursor: "ns-resize", background: "var(--vlc-border-subtle)", flexShrink: 0 }} />
      <div className="flex items-center px-3" style={{ height: 36, background: "var(--vlc-bg-elevated)", borderTop: "1px solid var(--vlc-border-subtle)", flexShrink: 0 }}>
        <div className="flex-1 text-[12px]" style={{ color: "var(--vlc-text-secondary)" }}>Playlist <span style={{ color: "var(--vlc-text-ghost)" }}>· {playlist.length} items</span></div>
        <button onClick={randomize} title="Randomize" className="p-1 rounded" style={{ color: "var(--vlc-text-secondary)" }}><Shuffle size={14} /></button>
        <button title="Save playlist" className="p-1 rounded ml-1" style={{ color: "var(--vlc-text-secondary)" }}><Save size={14} /></button>
        <button onClick={clear} title="Clear all" className="p-1 rounded ml-1" style={{ color: "var(--vlc-text-secondary)" }}><Trash2 size={14} /></button>
        <button onClick={() => set({ playlistOpen: false })} className="p-1 rounded ml-1" style={{ color: "var(--vlc-text-secondary)" }}><X size={14} /></button>
      </div>
      <div className="flex items-center px-3" style={{ height: 28, background: "var(--vlc-bg-surface)", borderBottom: "1px solid var(--vlc-border-subtle)", fontSize: 11, color: "var(--vlc-text-ghost)", flexShrink: 0 }}>
        <div style={{ width: 32 }}>#</div>
        <div className="flex-1">Title</div>
        <div style={{ width: 64, textAlign: "right" }}>Duration</div>
      </div>
      <div className="flex-1 overflow-auto" style={{ background: "var(--vlc-bg-surface)" }}>
        {playlist.map((p, i) => {
          const active = i === idx;
          return (
            <div
              key={p.id}
              onClick={() => playItem(i)}
              className="flex items-center gap-2 px-3"
              style={{ height: 30, cursor: "pointer", background: active ? "var(--vlc-accent-dim)" : "transparent", borderLeft: active ? "2px solid var(--vlc-accent)" : "2px solid transparent" }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ width: 24, textAlign: "right", fontFamily: "var(--vlc-font-mono)", fontSize: 11, color: "var(--vlc-text-ghost)" }}>{i + 1}</span>
              {active && <EQBars />}
              <span className="flex-1 truncate" style={{ fontSize: 12, color: active ? "var(--vlc-text-primary)" : "var(--vlc-text-secondary)", fontWeight: active ? 500 : 400 }}>{p.title}</span>
              <span style={{ width: 64, textAlign: "right", fontFamily: "var(--vlc-font-mono)", fontSize: 11, color: "var(--vlc-text-ghost)" }}>{p.duration ? formatTime(p.duration) : "—"}</span>
              <button onClick={(e) => { e.stopPropagation(); remove(i); }} className="p-1" style={{ color: "var(--vlc-text-ghost)" }}><X size={12} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EQBars() {
  return (
    <div className="flex items-end gap-[2px]" style={{ width: 12, height: 14 }}>
      {[0, 0.15, 0.3].map((d, i) => (
        <div key={i} className="vlc-eq-bar" style={{ width: 3, height: "100%", background: "var(--vlc-accent)", animationDelay: `${d}s` }} />
      ))}
    </div>
  );
}
