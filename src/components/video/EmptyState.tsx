import { useEffect, useMemo, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import type { PlaylistItem } from "@/types/player.types";
import { isVisible } from "@/utils/uiCustomization";

const RECENT_KEY = "vlc-player-recent";

interface RecentEntry { title: string; src: string; ts: number }

export function loadRecents(): RecentEntry[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as RecentEntry[]; }
  catch { return []; }
}
export function pushRecent(entry: { title: string; src: string }) {
  if (!entry.src || entry.src.startsWith("blob:")) return;
  const cur = loadRecents().filter((r) => r.src !== entry.src);
  const next = [{ ...entry, ts: Date.now() }, ...cur].slice(0, 8);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {/*noop*/}
}

const SHORTCUTS: Array<[string, string]> = [
  ["Space", "Play / Pause"],
  ["F", "Fullscreen"],
  ["M", "Mute"],
  ["← / →", "Seek ±10s"],
  ["↑ / ↓", "Volume ±5%"],
  ["Ctrl + O", "Open file"],
  ["Ctrl + N", "Network stream"],
  ["Ctrl + K", "Command palette"],
];

const QUICK_ACTIONS: Array<{ label: string; icon: string; desc: string; action: string }> = [
  { label: "Open File", icon: "📂", desc: "Drop or browse media files", action: "file" },
  { label: "Network Stream", icon: "🌐", desc: "Play from URL or HLS", action: "network" },
  { label: "Mini Apps", icon: "🎮", desc: "150+ built-in tools & games", action: "apps" },
  { label: "Customize", icon: "🎨", desc: "200+ skins & God Mode", action: "customize" },
];

export function EmptyState() {
  const set = usePlayerStore((s) => s.set);
  const [recents, setRecents] = useState<RecentEntry[]>([]);
  const [drag, setDrag] = useState(false);
  const [mounted, setMounted] = useState(false);
  const vis = usePlayerStore((s) => s.uiVisibility);
  const v = (id: string) => isVisible(vis, id);

  useEffect(() => { setRecents(loadRecents()); setMounted(true); }, []);

  const openRecent = useMemo(() => (r: RecentEntry) => {
    const item: PlaylistItem = { id: `${Date.now()}-${r.title}`, title: r.title, src: r.src };
    const cur = usePlayerStore.getState().playlist;
    usePlayerStore.getState().set({ playlist: [...cur, item], currentIndex: cur.length });
    usePlayerStore.getState().pushOSD(`Reopened ${r.title}`);
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "file": document.getElementById("vlc-file-input")?.click(); break;
      case "network": set({ networkOpen: true }); break;
      case "apps": set({ commandPaletteOpen: true }); break;
      case "customize": set({ preferencesOpen: true }); break;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-vlc-empty-drop
      onClick={(e) => { e.stopPropagation(); document.getElementById("vlc-file-input")?.click(); }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        document.getElementById("vlc-file-input")?.click();
      }}
      onDoubleClick={(e) => e.stopPropagation()}
      onDragEnter={() => setDrag(true)}
      onDragLeave={() => setDrag(false)}
      onDrop={() => setDrag(false)}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "var(--vlc-bg-base)",
        cursor: "pointer",
      }}
    >
      {/* Animated background gradient orbs */}
      <div
        aria-hidden
        className="vlc-empty-orb vlc-empty-orb-1"
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in oklab, var(--vlc-accent) 20%, transparent), transparent 70%)",
          filter: "blur(80px)",
          top: "-10%",
          right: "-5%",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        className="vlc-empty-orb vlc-empty-orb-2"
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in oklab, var(--vlc-accent) 12%, transparent), transparent 70%)",
          filter: "blur(60px)",
          bottom: "-8%",
          left: "-3%",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{
          maxWidth: 780,
          padding: "0 24px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 500ms cubic-bezier(0.05, 0.7, 0.1, 1), transform 500ms cubic-bezier(0.05, 0.7, 0.1, 1)",
        }}
      >
        {/* Hero section */}
        {v("empty.hero") && (
          <div className="flex flex-col items-center" style={{ marginBottom: 36 }}>
            {/* Logo with glow */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-50% -40%",
                  background: "radial-gradient(closest-side, color-mix(in oklab, var(--vlc-accent) 50%, transparent), transparent 70%)",
                  filter: "blur(40px)",
                  opacity: drag ? 1 : 0.65,
                  transition: "opacity var(--vlc-dur-slow)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "relative",
                  fontFamily: "var(--vlc-font-display)",
                  fontWeight: 800,
                  fontSize: 72,
                  color: "var(--vlc-accent)",
                  letterSpacing: -3,
                  lineHeight: 1,
                  textShadow: "0 4px 32px color-mix(in oklab, var(--vlc-accent) 40%, transparent)",
                }}
              >
                VLC
              </div>
            </div>

            {/* Tagline */}
            <div style={{ marginTop: 16, fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
              Drop a video here, or click to browse
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "var(--vlc-text-secondary)", letterSpacing: 0.3 }}>
              MP4 · WebM · MKV · MOV · AVI · OGG · plus SRT / VTT subtitles
            </div>

            {/* Drop zone indicator */}
            <div
              style={{
                marginTop: 20,
                padding: "10px 24px",
                borderRadius: "var(--vlc-radius-full)",
                background: drag
                  ? "var(--vlc-accent-dim)"
                  : "color-mix(in oklab, var(--vlc-text-primary) 6%, transparent)",
                border: `1.5px dashed ${drag ? "var(--vlc-accent)" : "var(--vlc-border-strong)"}`,
                fontSize: 12,
                color: drag ? "var(--vlc-accent-text)" : "var(--vlc-text-secondary)",
                fontWeight: 500,
                transition: "all var(--vlc-dur-base) var(--vlc-ease-standard)",
                transform: drag ? "scale(1.04)" : "scale(1)",
              }}
            >
              {drag ? "✦ Release to load" : "↕ Drag \u0026 drop files here"}
            </div>
          </div>
        )}

        {/* Quick Action Cards */}
        {v("empty.quickActions") && (
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              marginBottom: 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {QUICK_ACTIONS.map((qa, i) => (
              <button
                key={qa.action}
                type="button"
                onClick={() => handleQuickAction(qa.action)}
                className="vlc-empty-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "16px 10px",
                  borderRadius: "var(--vlc-radius-lg)",
                  background: "color-mix(in oklab, var(--vlc-bg-elevated) 85%, transparent)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid var(--vlc-border-subtle)",
                  color: "var(--vlc-text-primary)",
                  cursor: "pointer",
                  transition: "all var(--vlc-dur-base) var(--vlc-ease-standard)",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <span style={{ fontSize: 24 }}>{qa.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{qa.label}</span>
                <span style={{ fontSize: 10, color: "var(--vlc-text-ghost)", textAlign: "center", lineHeight: 1.3 }}>{qa.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Bottom grid: Recents + Shortcuts */}
        {(v("empty.recents") || v("empty.shortcuts")) && <div
          className="grid gap-4 w-full"
          style={{ gridTemplateColumns: recents.length && v("empty.recents") && v("empty.shortcuts") ? "1fr 1fr" : "1fr" }}
          onClick={(e) => e.stopPropagation()}
        >
          {v("empty.recents") && recents.length > 0 && (
            <Section title="Recent files" icon="🕐">
              <ul className="flex flex-col" style={{ gap: 2 }}>
                {recents.slice(0, 6).map((r) => (
                  <li key={r.src}>
                    <button
                      type="button"
                      onClick={() => openRecent(r)}
                      className="w-full text-left px-3 py-2 rounded-md truncate"
                      style={{
                        fontSize: 12,
                        color: "var(--vlc-text-primary)",
                        background: "transparent",
                        transition: "background var(--vlc-dur-fast)",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--vlc-control-hover)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      title={r.src}
                    >
                      <span style={{ marginRight: 8, opacity: 0.5 }}>▶</span>
                      {r.title}
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {v("empty.shortcuts") && <Section title="Keyboard shortcuts" icon="⌨">
            <ul className="grid grid-cols-2" style={{ gap: "6px 16px" }}>
              {SHORTCUTS.map(([key, label]) => (
                <li key={key} className="flex items-center justify-between" style={{ fontSize: 12 }}>
                  <span style={{ color: "var(--vlc-text-secondary)" }}>{label}</span>
                  <kbd
                    className="vlc-num"
                    style={{
                      fontSize: 10,
                      padding: "2px 7px",
                      borderRadius: "var(--vlc-radius-sm)",
                      background: "color-mix(in oklab, var(--vlc-text-primary) 8%, var(--vlc-bg-surface))",
                      border: "1px solid var(--vlc-border-normal)",
                      color: "var(--vlc-text-primary)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    }}
                  >
                    {key}
                  </kbd>
                </li>
              ))}
            </ul>
          </Section>}
        </div>}
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div
      className="glass-panel vlc-empty-section"
      style={{
        padding: 16,
        borderRadius: "var(--vlc-radius-lg)",
        border: "1px solid var(--vlc-border-subtle)",
        boxShadow: "var(--vlc-shadow-1), inset 0 1px 0 0 rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--vlc-text-ghost)",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 12 }}>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}
