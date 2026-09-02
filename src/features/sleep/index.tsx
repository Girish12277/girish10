import { useEffect, useState } from "react";
import { videoRef } from "@/hooks/useVideoPlayer";
import { usePlayerStore } from "@/store/playerStore";

type Action = "pause" | "fade";

export default function SleepTimer() {
  const [mins, setMins] = useState(15);
  const [action, setAction] = useState<Action>("fade");
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (!endsAt) return;
    const id = window.setInterval(() => {
      const ms = endsAt - Date.now();
      setLeft(Math.max(0, ms));
      if (ms <= 0) {
        const v = videoRef.current;
        if (v) {
          if (action === "fade") {
            const start = v.volume; const t0 = Date.now();
            const fade = () => {
              const k = Math.min(1, (Date.now() - t0) / 4000);
              v.volume = start * (1 - k);
              if (k < 1) requestAnimationFrame(fade);
              else { v.pause(); v.volume = start; }
            };
            fade();
          } else v.pause();
        }
        usePlayerStore.getState().pushOSD("Sleep timer fired");
        setEndsAt(null);
        window.clearInterval(id);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [endsAt, action]);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <div className="p-4 space-y-3 text-[13px]" style={{ color: "var(--vlc-text-primary)" }}>
      <div>
        <label className="block text-[11px] mb-1" style={{ color: "var(--vlc-text-secondary)" }}>Minutes</label>
        <input type="range" min={1} max={120} value={mins} onChange={(e) => setMins(+e.target.value)} disabled={!!endsAt} style={{ width: "100%" }} />
        <div className="text-center mt-1 font-mono">{mins} min</div>
      </div>
      <div>
        <label className="block text-[11px] mb-1" style={{ color: "var(--vlc-text-secondary)" }}>Action</label>
        <div className="flex gap-2">
          {(["fade", "pause"] as const).map((a) => (
            <button key={a} disabled={!!endsAt} onClick={() => setAction(a)} className="flex-1 py-2 rounded text-[12px]"
              style={{ background: action === a ? "var(--vlc-accent)" : "transparent", color: action === a ? "var(--vlc-bg-base)" : "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-subtle)" }}>
              {a === "fade" ? "Fade out 4s" : "Hard pause"}
            </button>
          ))}
        </div>
      </div>
      {endsAt ? (
        <button onClick={() => setEndsAt(null)} className="w-full py-2 rounded font-mono"
          style={{ background: "var(--vlc-bg-elevated)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}>
          Cancel — {fmt(left)} remaining
        </button>
      ) : (
        <button onClick={() => setEndsAt(Date.now() + mins * 60000)} className="w-full py-2 rounded font-semibold"
          style={{ background: "var(--vlc-accent)", color: "var(--vlc-bg-base)" }}>
          Start sleep timer
        </button>
      )}
    </div>
  );
}
