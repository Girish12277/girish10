import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play, Pause, SkipForward, SkipBack, Repeat, Repeat1, Shuffle,
  Volume2, VolumeX, Music, Trash2, Plus, ListMusic,
} from "lucide-react";
import { FloatingPanel } from "@/components/panels/FloatingPanel";
import { usePlayerStore, type AmbientTrack } from "@/store/playerStore";

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/**
 * The one <audio> node for background music. Module-level so the panel can
 * read position without pushing 4Hz updates through the store.
 */
let ambientAudio: HTMLAudioElement | null = null;
export const getAmbientAudio = () => ambientAudio;

/**
 * Headless background-music engine.
 *
 * Mounted once in AppLayout and NEVER unmounted, so closing the popup only
 * hides the UI — playback, playlist and object URLs survive. Mixes alongside
 * the main video because it owns its own element.
 */
export function AmbientAudioEngine() {
  const ambient = usePlayerStore((s) => s.ambient);
  const setAmbient = usePlayerStore((s) => s.setAmbient);
  const ref = useRef<HTMLAudioElement>(null);
  const { tracks, index, playing, volume, repeat, shuffle } = ambient;
  const current = tracks[index];

  useEffect(() => { ambientAudio = ref.current; return () => { ambientAudio = null; }; }, []);

  useEffect(() => { if (ref.current) ref.current.volume = volume; }, [volume, current?.src]);

  // Load a new source, then honour the desired play state.
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (!current) { a.removeAttribute("src"); a.load(); return; }
    if (a.src !== current.src) { a.src = current.src; a.load(); }
    if (playing) void a.play().catch(() => setAmbient({ playing: false }));
    else a.pause();
  }, [current?.src, playing, setAmbient, current]);

  const advance = useCallback((delta: number) => {
    if (!tracks.length) return;
    if (shuffle && tracks.length > 1) {
      let n = index;
      while (n === index) n = Math.floor(Math.random() * tracks.length);
      setAmbient({ index: n });
      return;
    }
    setAmbient({ index: (index + delta + tracks.length) % tracks.length });
  }, [tracks.length, index, shuffle, setAmbient]);

  return (
    <audio
      ref={ref}
      data-vlc-ambient="1"
      preload="metadata"
      onEnded={() => {
        const a = ref.current;
        if (repeat === "one" && a) { a.currentTime = 0; void a.play().catch(() => undefined); return; }
        if (tracks.length > 1 && repeat !== "off") { advance(1); return; }
        if (tracks.length > 1 && index < tracks.length - 1) { advance(1); return; }
        setAmbient({ playing: false });
      }}
      onPlay={() => setAmbient({ playing: true })}
      onPause={() => setAmbient({ playing: false })}
    />
  );
}

/** Background / study music popup — pure UI over the engine's state. */
export function AmbientMusic() {
  const open = usePlayerStore((s) => s.ambientOpen);
  const set = usePlayerStore((s) => s.set);
  const ambient = usePlayerStore((s) => s.ambient);
  const setAmbient = usePlayerStore((s) => s.setAmbient);
  const { tracks, index, playing, volume, repeat, shuffle } = ambient;

  const [pos, setPos] = useState({ cur: 0, dur: 0 });
  const [url, setUrl] = useState("");
  const [muted, setMuted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const current = tracks[index];

  useEffect(() => {
    if (!open) return;
    const tick = () => {
      const a = getAmbientAudio();
      setPos({ cur: a?.currentTime || 0, dur: a?.duration || 0 });
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [open]);

  if (!open) return null;

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next: AmbientTrack[] = Array.from(files).map((f, i) => ({
      id: `${Date.now()}-${i}-${f.name}`,
      title: f.name.replace(/\.[^.]+$/, ""),
      src: URL.createObjectURL(f),
      local: true,
    }));
    setAmbient({ tracks: [...tracks, ...next] });
  };

  const addUrl = () => {
    const clean = url.trim();
    if (!clean) return;
    setAmbient({
      tracks: [...tracks, { id: `${Date.now()}-url`, title: clean.split("/").pop() || clean, src: clean, local: false }],
    });
    setUrl("");
  };

  const toggle = () => {
    if (!current) return;
    setAmbient({ playing: !playing });
  };

  const step = (d: number) => {
    if (!tracks.length) return;
    setAmbient({ index: (index + d + tracks.length) % tracks.length });
  };

  const remove = (id: string) => {
    const target = tracks.find((x) => x.id === id);
    const at = tracks.findIndex((x) => x.id === id);
    if (target?.local) URL.revokeObjectURL(target.src);
    const rest = tracks.filter((x) => x.id !== id);
    const nextIndex = at < index ? index - 1 : Math.min(index, Math.max(rest.length - 1, 0));
    setAmbient({ tracks: rest, index: nextIndex, playing: rest.length ? playing : false });
  };

  const toggleMute = () => {
    const a = getAmbientAudio();
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (a) a.muted = nextMuted;
  };

  const border = "1px solid var(--vlc-border-subtle)";
  const pct = pos.dur ? Math.min(100, (pos.cur / pos.dur) * 100) : 0;

  return (
    <FloatingPanel title="Background Music" width={380} onClose={() => set({ ambientOpen: false })}>
      <div className="flex flex-col gap-3.5 p-3.5">
        {/* Now playing */}
        <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: "var(--vlc-bg-sunken)", border }}>
          <div
            className="grid place-items-center rounded-md shrink-0"
            style={{
              width: 44, height: 44,
              background: "color-mix(in srgb, var(--vlc-accent) 16%, transparent)",
              color: "var(--vlc-accent)",
            }}
          >
            <Music size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-medium" style={{ color: "var(--vlc-text-primary)" }}>
              {current?.title ?? "Nothing queued"}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>
              {playing ? <EqBars /> : null}
              <span>
                {current
                  ? `${playing ? "Playing" : "Paused"} · track ${index + 1} of ${tracks.length}`
                  : "Add audio to start"}
              </span>
            </div>
          </div>
          <span className="vlc-num shrink-0 text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>
            {fmt(pos.cur)} / {fmt(pos.dur)}
          </span>
        </div>

        {/* Scrubber */}
        <div className="flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={Math.max(pos.dur, 1)}
            step={0.1}
            value={Math.min(pos.cur, pos.dur || 1)}
            onChange={(e) => { const a = getAmbientAudio(); if (a) a.currentTime = parseFloat(e.target.value); }}
            className="vlc-slider w-full"
            style={{ accentColor: "var(--vlc-accent)" }}
            aria-label="Music position"
            disabled={!current}
          />
          <div className="h-[2px] w-full overflow-hidden rounded-full" style={{ background: "var(--vlc-border-subtle)" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "var(--vlc-accent)" }} />
          </div>
        </div>

        {/* Transport */}
        <div className="flex items-center gap-2">
          <IconBtn onClick={() => setAmbient({ shuffle: !shuffle })} title="Shuffle" active={shuffle}><Shuffle size={14} /></IconBtn>
          <IconBtn onClick={() => step(-1)} title="Previous track"><SkipBack size={15} /></IconBtn>
          <IconBtn onClick={toggle} title={playing ? "Pause" : "Play"} primary size={40}>
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </IconBtn>
          <IconBtn onClick={() => step(1)} title="Next track"><SkipForward size={15} /></IconBtn>
          <IconBtn
            onClick={() => setAmbient({ repeat: repeat === "off" ? "all" : repeat === "all" ? "one" : "off" })}
            title={`Repeat: ${repeat}`}
            active={repeat !== "off"}
          >
            {repeat === "one" ? <Repeat1 size={14} /> : <Repeat size={14} />}
          </IconBtn>
          <div className="ml-1 flex flex-1 items-center gap-1.5">
            <button type="button" onClick={toggleMute} title={muted ? "Unmute" : "Mute"} aria-label={muted ? "Unmute" : "Mute"} style={{ color: "var(--vlc-text-secondary)" }}>
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={(e) => setAmbient({ volume: parseFloat(e.target.value) })}
              className="vlc-slider flex-1" style={{ accentColor: "var(--vlc-accent)" }}
              aria-label="Music volume"
            />
          </div>
        </div>

        {/* Add sources */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="shrink-0 rounded-md px-2.5 py-1.5 text-[11px] font-medium press"
            style={{ background: "var(--vlc-bg-surface)", border, color: "var(--vlc-text-primary)" }}
          >
            Add files
          </button>
          <input
            ref={fileRef} type="file" accept="audio/*,video/*" multiple hidden
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addUrl(); }}
            placeholder="Paste an audio URL…"
            className="min-w-0 flex-1 rounded-md px-2.5 py-1.5 text-[11px]"
            style={{ background: "var(--vlc-bg-sunken)", border, color: "var(--vlc-text-primary)" }}
          />
          <button
            type="button" onClick={addUrl} aria-label="Add URL" title="Add URL"
            className="shrink-0 rounded-md px-2 press"
            style={{ background: "var(--vlc-bg-surface)", border, color: "var(--vlc-text-primary)" }}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Queue */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--vlc-text-ghost)" }}>
          <ListMusic size={12} /> Queue {tracks.length ? `(${tracks.length})` : ""}
        </div>
        <div className="flex max-h-44 flex-col gap-1 overflow-y-auto">
          {tracks.map((t, i) => {
            const active = i === index;
            return (
              <div
                key={t.id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5"
                style={{
                  background: active ? "color-mix(in srgb, var(--vlc-accent) 14%, transparent)" : "transparent",
                  borderLeft: `2px solid ${active ? "var(--vlc-accent)" : "transparent"}`,
                }}
              >
                <span className="vlc-num w-4 shrink-0 text-[10px]" style={{ color: "var(--vlc-text-ghost)" }}>{i + 1}</span>
                <button
                  type="button"
                  onClick={() => setAmbient({ index: i, playing: true })}
                  className="flex-1 truncate text-left text-[11.5px]"
                  style={{ color: active ? "var(--vlc-accent)" : "var(--vlc-text-secondary)" }}
                >
                  {t.title}
                </button>
                {!t.local && <span className="text-[9px] uppercase" style={{ color: "var(--vlc-text-ghost)" }}>url</span>}
                <button type="button" onClick={() => remove(t.id)} aria-label={`Remove ${t.title}`} title="Remove" style={{ color: "var(--vlc-text-ghost)" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
          {tracks.length === 0 && (
            <span className="px-1 text-[11px] leading-relaxed" style={{ color: "var(--vlc-text-ghost)" }}>
              Add local audio or video files, or paste a stream URL. Music keeps playing while you study — even after you close this window.
            </span>
          )}
        </div>
      </div>
    </FloatingPanel>
  );
}

function EqBars() {
  return (
    <span className="inline-flex items-end gap-[2px]" aria-hidden style={{ height: 8 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 2, height: 8, background: "var(--vlc-accent)", borderRadius: 1,
            transformOrigin: "bottom",
            animation: `vlc-eqbar 900ms ${i * 140}ms ease-in-out infinite alternate`,
          }}
        />
      ))}
    </span>
  );
}

function IconBtn({ children, onClick, title, active, primary, size = 32 }: {
  children: React.ReactNode; onClick: () => void; title: string; active?: boolean; primary?: boolean; size?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active || undefined}
      className="inline-flex items-center justify-center press"
      style={{
        width: size, height: size,
        borderRadius: "var(--vlc-control-radius)",
        background: primary ? "var(--vlc-accent)" : active ? "color-mix(in srgb, var(--vlc-accent) 18%, transparent)" : "var(--vlc-bg-surface)",
        color: primary ? "var(--vlc-text-inverse)" : active ? "var(--vlc-accent)" : "var(--vlc-text-primary)",
        border: "1px solid var(--vlc-border-subtle)",
      }}
    >
      {children}
    </button>
  );
}
