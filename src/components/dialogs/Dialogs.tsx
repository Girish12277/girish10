import { useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { DialogShell } from "./DialogShell";

const isYouTube = (url: string) => /(?:youtube\.com|youtu\.be)/i.test(url);

async function attachStream(url: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const v = videoRef.current;
  if (!v) return { ok: false, reason: "Player not ready" };

  v.crossOrigin = "anonymous";
  v.src = url;
  v.load();
  const playPromise = new Promise<void>((resolve, reject) => {
    const onCanPlay = () => { cleanup(); v.play().then(() => resolve()).catch(() => resolve()); };
    const onError = () => { cleanup(); reject(new Error(v.error?.message || "Stream failed to load (CORS / unsupported codec / unreachable)")); };
    const cleanup = () => { v.removeEventListener("canplay", onCanPlay); v.removeEventListener("error", onError); };
    v.addEventListener("canplay", onCanPlay, { once: true });
    v.addEventListener("error", onError, { once: true });
    setTimeout(() => { cleanup(); resolve(); }, 8000); // don't hang forever
  });
  try { await playPromise; return { ok: true }; }
  catch (e) { return { ok: false, reason: (e as Error).message }; }
}

export function NetworkDialog() {
  const open = usePlayerStore((s) => s.networkOpen);
  const set = usePlayerStore((s) => s.set);
  const playlist = usePlayerStore((s) => s.playlist);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (!open) return null;

  const play = async () => {
    setErr(null);
    const trimmed = url.trim();
    if (!trimmed) { setErr("Enter a URL"); return; }
    if (isYouTube(trimmed)) { setErr("YouTube URLs can't be streamed directly — browsers and YouTube ToS block it. Paste a direct .mp4 / .webm URL instead."); return; }
    if (!/^https?:\/\//i.test(trimmed) && !/^blob:/i.test(trimmed)) { setErr("Only http(s) streams are supported (rtsp/mms need a proxy)."); return; }

    setBusy(true);
    const item = { id: String(Date.now()), title: trimmed.split("/").pop()?.split("?")[0] || trimmed, src: trimmed };
    set({ playlist: [...playlist, item], currentIndex: playlist.length });
    // Wait a tick so the video element is mounted with the new item context.
    await new Promise((r) => setTimeout(r, 50));
    const res = await attachStream(trimmed);
    setBusy(false);
    if (!res.ok) { setErr(res.reason); return; }
    usePlayerStore.getState().pushOSD(`Streaming ${item.title}`);
    try { const { pushRecent } = await import("@/components/video/EmptyState"); pushRecent({ title: item.title, src: item.src }); } catch {/*noop*/}
    set({ networkOpen: false });
    setUrl("");
  };

  return (
    <Modal title="Open Media — Network Stream" onClose={() => set({ networkOpen: false })} width={520}>
      <div className="text-[13px] mb-3" style={{ color: "var(--vlc-text-secondary)" }}>
        Direct stream URL — supports <strong>HTTP(S) progressive</strong> (mp4, webm, ogg). RTSP/MMS and YouTube are not supported in browsers.
      </div>
      <input
        value={url}
        onChange={(e) => { setUrl(e.target.value); setErr(null); }}
        onKeyDown={(e) => { if (e.key === "Enter") play(); }}
        placeholder="https://example.com/video.mp4"
        className="vlc-input w-full px-3 py-2 rounded-md"
        style={{ fontFamily: "var(--vlc-font-mono)", fontSize: 13, height: 44 }}
        autoFocus
        aria-invalid={!!err}
      />
      {err && <div className="mt-2 text-[12px] font-medium" style={{ color: "var(--vlc-warning)" }}>{err}</div>}
      <div className="mt-3 text-[12px]" style={{ color: "var(--vlc-text-ghost)" }}>
        Tip: try <span className="vlc-num px-1 py-0.5 rounded" style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)", color: "var(--vlc-text-secondary)" }}>https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4</span>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <button onClick={() => set({ networkOpen: false })} className="vlc-btn-dialog px-4 py-2 text-[13px] font-medium rounded-md" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}>Cancel</button>
        <button onClick={play} disabled={busy} className="vlc-btn-dialog px-4 py-2 text-[13px] rounded-md font-semibold" style={{ background: busy ? "var(--vlc-accent-dim)" : "var(--vlc-accent)", color: "var(--vlc-text-inverse)", opacity: busy ? 0.6 : 1 }}>{busy ? "Connecting…" : "Play"}</button>
      </div>
    </Modal>
  );
}

export function JumpToTimeDialog() {
  const open = usePlayerStore((s) => s.jumpOpen);
  const set = usePlayerStore((s) => s.set);
  const [t, setT] = useState("00:00:00");
  if (!open) return null;
  const go = () => {
    const parts = t.split(":").map((x) => parseInt(x, 10) || 0);
    let secs = 0;
    if (parts.length === 3) secs = parts[0]*3600 + parts[1]*60 + parts[2];
    else if (parts.length === 2) secs = parts[0]*60 + parts[1];
    else secs = parts[0] || 0;
    if (videoRef.current) videoRef.current.currentTime = secs;
    set({ jumpOpen: false });
  };
  return (
    <Modal title="Jump to Time" onClose={() => set({ jumpOpen: false })} width={280}>
      <input value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") go(); }} placeholder="HH:MM:SS" className="vlc-input w-full px-3 py-2 rounded-md text-center font-bold tracking-widest" style={{ fontFamily: "var(--vlc-font-mono)", fontSize: 20, height: 48 }} autoFocus />
      <div className="flex gap-2 mt-4 justify-end">
        <button onClick={() => set({ jumpOpen: false })} className="vlc-btn-dialog px-3 py-1.5 text-[12px] font-medium rounded-md" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}>Cancel</button>
        <button onClick={go} className="vlc-btn-dialog px-4 py-1.5 text-[12px] rounded-md font-semibold" style={{ background: "var(--vlc-accent)", color: "var(--vlc-text-inverse)" }}>Go</button>
      </div>
    </Modal>
  );
}

export function HelpOverlay() {
  const open = usePlayerStore((s) => s.helpOpen);
  const set = usePlayerStore((s) => s.set);
  if (!open) return null;
  const items: [string, string][] = [
    ["Space","Play/Pause"],["S","Stop"],["N","Next"],["P","Previous"],
    ["F","Fullscreen"],["M","Mute"],["E","Frame advance"],["R","Random"],
    ["L","A-B Loop cycle"],["A","Cycle aspect"],["T","Toggle time display"],
    ["←/→","Seek ±10s"],["Ctrl+←/→","Seek ±60s"],["Alt+←/→","Seek ±300s"],
    ["↑/↓","Volume ±5%"],["[ / ]","Speed ±0.25"],["= ","Speed reset"],
    ["0-9","Seek 0-90%"],["H/G","Subtitle delay ±50ms"],["J/K","Audio delay ±50ms"],
    ["Ctrl+O","Open file"],["Ctrl+N","Network stream"],["Ctrl+L","Playlist"],
    ["Ctrl+E","Effects"],["Ctrl+P","Preferences"],["Ctrl+J","Codec info"],
    ["Ctrl+T","Jump to time"],["Ctrl+Alt+S","Screenshot"],["?","This help"],
  ];
  return (
    <Modal title="Keyboard Shortcuts" onClose={() => set({ helpOpen: false })} width={520}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 max-h-[60vh] overflow-auto">
        {items.map(([k, label]) => (
          <div key={k} className="flex justify-between text-[12px] py-1" style={{ borderBottom: "1px solid var(--vlc-border-subtle)" }}>
            <span style={{ color: "var(--vlc-text-secondary)" }}>{label}</span>
            <span style={{ fontFamily: "var(--vlc-font-mono)", color: "var(--vlc-accent)" }}>{k}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, width, children }: { title: string; onClose: () => void; width: number; children: React.ReactNode }) {
  return (
    <DialogShell open title={title} onClose={onClose} width={width}>
      {children}
    </DialogShell>
  );
}

// Aggregate barrel for lazy-loading the dialog cluster as a single chunk.
export function AllDialogs() {
  return (
    <>
      <NetworkDialog />
      <JumpToTimeDialog />
      <HelpOverlay />
    </>
  );
}


