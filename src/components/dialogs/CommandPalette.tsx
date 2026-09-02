import { useEffect, useMemo, useRef, useState, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/store/playerStore";
import { videoRef } from "@/hooks/useVideoPlayer";
import { srcKey } from "@/utils/srcKey";
import { FEATURES } from "@/features/registry";
import { Search, Loader2, Sparkles, Clock, History, Keyboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSkinCatalog, resolveSkin } from "@/skins/registry";

type Section = "Playback" | "Files" | "View" | "Skins" | "Customize" | "Mini-Apps";
type Cmd = { id: string; label: string; hint?: string; section: Section; run: () => void; icon?: React.ReactNode };

const RECENTS_KEY = "vlc-cmd-recents";
const loadRecents = (): string[] => {
  if (typeof localStorage === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]"); } catch { return []; }
};
const saveRecents = (ids: string[]) => { try { localStorage.setItem(RECENTS_KEY, JSON.stringify(ids.slice(0, 6))); } catch { /*noop*/ } };

/**
 * Subsequence fuzzy score: rewards consecutive matches and matches at word
 * boundaries. Returns -1 when the needle doesn't fit at all.
 */
function fuzzyScore(haystack: string, needle: string): number {
  if (!needle) return 1;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  
  let bonus = 0;
  if (h.includes(n)) {
    bonus = 50;
    if (h.startsWith(n)) bonus += 20;
  }

  let hi = 0, ni = 0, score = 0, streak = 0;
  while (hi < h.length && ni < n.length) {
    if (h[hi] === n[ni]) {
      const boundary = hi === 0 || /[\s\-/·:]/.test(h[hi - 1]);
      score += 2 + streak * 2 + (boundary ? 5 : 0);
      streak++;
      ni++;
    } else {
      streak = 0;
    }
    hi++;
  }
  if (ni < n.length) return -1;
  return score + bonus - h.length * 0.02;
}

export function CommandPalette() {
  const open = usePlayerStore((s) => s.commandPaletteOpen);
  const set = usePlayerStore((s) => s.set);
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const isPending = q !== deferredQ;
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState<string[]>(loadRecents);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: skins = [] } = useQuery({
    queryKey: ["skin-catalog"],
    queryFn: getSkinCatalog,
    staleTime: Infinity,
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      setQ(""); setActive(0); setRecents(loadRecents());
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); set({ commandPaletteOpen: false }); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, set]);

  const cmds = useMemo<Cmd[]>(() => {
    const s = usePlayerStore.getState();
    const v = () => videoRef.current;
    const close = () => set({ commandPaletteOpen: false });
    const wrap = (id: string, fn: () => void) => () => {
      fn(); close();
      const next = [id, ...recents.filter((x) => x !== id)].slice(0, 6);
      saveRecents(next); setRecents(next);
    };
    const list: Cmd[] = [
      { id: "open", label: "Open File…", hint: "Ctrl+O", section: "Files", run: wrap("open", () => document.getElementById("vlc-file-input")?.click()) },
      { id: "net", label: "Open Network Stream…", hint: "Ctrl+N", section: "Files", run: wrap("net", () => s.set({ networkOpen: true })) },
      { id: "clear", label: "Clear Playlist", section: "Files", run: wrap("clear", () => s.set({ playlist: [], currentIndex: 0 })) },

      { id: "playlist", label: "Toggle Playlist", hint: "Ctrl+L", section: "View", run: wrap("playlist", () => s.set({ playlistOpen: !s.playlistOpen })) },
      { id: "effects", label: "Toggle Effects", hint: "Ctrl+E", section: "View", run: wrap("effects", () => s.set({ effectsOpen: !s.effectsOpen })) },
      { id: "codec", label: "Codec Info", hint: "Ctrl+J", section: "View", run: wrap("codec", () => s.set({ codecOpen: !s.codecOpen })) },
      { id: "fs", label: "Toggle Fullscreen", hint: "F", section: "View", run: wrap("fs", () => window.dispatchEvent(new CustomEvent("vlc-toggle-fullscreen"))) },
      { id: "pip", label: "Picture-in-Picture", hint: "I", section: "View", run: wrap("pip", () => {
        const vv = v(); if (!vv) return;
        if (document.pictureInPictureElement) document.exitPictureInPicture?.().catch(() => undefined);
        else vv.requestPictureInPicture?.().catch(() => undefined);
      }) },

      { id: "snap", label: "Take Snapshot", hint: "Ctrl+Alt+S", section: "Playback", run: wrap("snap", () => window.dispatchEvent(new CustomEvent("vlc-screenshot"))) },
      { id: "snapburst", label: "Snapshot Burst ×5 (1s apart)", section: "Playback", run: wrap("snapburst", () => {
        let n = 0;
        const id = window.setInterval(() => { window.dispatchEvent(new CustomEvent("vlc-screenshot")); if (++n >= 5) window.clearInterval(id); }, 1000);
      }) },
      { id: "ab", label: "A-B Loop Mark / Clear", hint: "L", section: "Playback", run: wrap("ab", () => { const vv = v(); if (vv) s.cycleAB(vv.currentTime); }) },
      { id: "bm", label: "Add Bookmark at Current Time", hint: "Ctrl+B", section: "Playback", run: wrap("bm", () => {
        const vv = v(); const cur = s.playlist[s.currentIndex];
        if (vv && cur) s.addBookmark(srcKey(cur.src), vv.currentTime);
      }) },
      { id: "jump", label: "Jump to Time…", hint: "Ctrl+T", section: "Playback", run: wrap("jump", () => s.set({ jumpOpen: true })) },
      { id: "rep", label: "Cycle Repeat Mode", section: "Playback", run: wrap("rep", () => s.cycleRepeat()) },
      { id: "ran", label: "Toggle Random", hint: "R", section: "Playback", run: wrap("ran", () => s.set({ random: !s.random })) },
      { id: "rst", label: "Restart Current Track", hint: "Backspace", section: "Playback", run: wrap("rst", () => { const vv = v(); if (vv) { vv.currentTime = 0; vv.play().catch(() => undefined); } }) },
      { id: "next", label: "Next Track", hint: "N", section: "Playback", run: wrap("next", () => s.next()) },
      { id: "prev", label: "Previous Track", hint: "P", section: "Playback", run: wrap("prev", () => s.prev()) },

      { id: "prefs", label: "Open Preferences", hint: "Ctrl+P", section: "Customize", run: wrap("prefs", () => s.set({ preferencesOpen: true })) },
      { id: "skins", label: "Browse Skins", section: "Skins", run: wrap("skins", () => s.set({ preferencesOpen: true })) },
      { id: "help", label: "Keyboard Shortcuts", hint: "?", section: "Customize", run: wrap("help", () => s.set({ helpOpen: true })) },
    ];

    FEATURES.forEach((f) => list.push({
      id: `feat-${f.id}`,
      label: `${f.title}`,
      hint: f.category,
      section: "Mini-Apps",
      run: wrap(`feat-${f.id}`, () => s.set({ openFeatureId: f.id })),
    }));
    
    skins.forEach((skin) => list.push({
      id: `skin-${skin.id}`,
      label: `${skin.name}`,
      hint: skin.heroId,
      section: "Skins",
      run: wrap(`skin-${skin.id}`, () => s.set({ activeSkinId: skin.id, preferencesOpen: false })),
    }));

    return list;
  }, [set, recents, skins]);

  /** Rank with fuzzy score, group by section, preserve recent ordering when query empty. */
  const grouped = useMemo(() => {
    const needle = deferredQ.trim();
    let ranked: { cmd: Cmd; score: number }[];
    if (!needle) {
      const recentMap = new Map(recents.map((id, i) => [id, recents.length - i]));
      ranked = cmds.map((c) => ({ cmd: c, score: recentMap.get(c.id) ?? 0 }));
    } else {
      ranked = cmds
        .map((c) => ({ cmd: c, score: Math.max(fuzzyScore(c.label, needle), fuzzyScore(c.hint ?? "", needle) - 0.5) }))
        .filter((r) => r.score >= 0);
    }
    ranked.sort((a, b) => b.score - a.score);

    if (!needle) {
      // Empty query → show recents block + remaining by section
      const out: { section: string; cmds: Cmd[] }[] = [];
      if (recents.length) {
        const recentCmds = recents.map((id) => cmds.find((c) => c.id === id)).filter(Boolean) as Cmd[];
        if (recentCmds.length) out.push({ section: "Recent", cmds: recentCmds });
      }
      const order: Section[] = ["Playback", "Files", "View", "Customize", "Skins", "Mini-Apps"];
      const bySection = new Map<string, Cmd[]>();
      cmds.forEach((c) => { if (!recents.includes(c.id)) bySection.set(c.section, [...(bySection.get(c.section) ?? []), c]); });
      order.forEach((s) => { const items = bySection.get(s); if (items?.length) out.push({ section: s, cmds: items }); });
      return out;
    }

    return [{ section: "Results", cmds: ranked.map((r) => r.cmd).slice(0, 80) }];
  }, [deferredQ, cmds, recents]);

  const flat = useMemo(() => grouped.flatMap((g) => g.cmds), [grouped]);
  
  const currentCmd = flat[active];

  useEffect(() => {
    if (!open) return;
    let tag = document.getElementById("vlc-skin-preview") as HTMLStyleElement | null;
    
    if (!currentCmd || !currentCmd.id.startsWith("skin-")) {
      if (tag) tag.textContent = "";
      return;
    }

    const skinId = currentCmd.id.replace("skin-", "");
    let cancelled = false;
    
    (async () => {
      try {
        const resolved = await resolveSkin(skinId);
        if (cancelled) return;
        
        if (!tag) {
          tag = document.createElement("style");
          tag.id = "vlc-skin-preview";
          document.head.appendChild(tag);
        }
        const vars = Object.entries(resolved.tokens).map(([k, v]) => `  ${k}: ${v};`).join("\n");
        let css = "";
        try {
          const cssModule = await import(`../../skins/css/${resolved.heroId}.css?inline`);
          css = cssModule.default;
        } catch (e) {}
        if (cancelled) return;
        tag.textContent = `:root[data-vlc-skinned] {\n${vars}\n}\n${css}`;
      } catch (e) {
        // failed to load preview
      }
    })();
    
    return () => { cancelled = true; };
  }, [open, currentCmd]);

  if (!open && (typeof document === "undefined" || !document.querySelector("[data-cmd-palette]"))) return (
    <AnimatePresence />
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-cmd-palette
          className="fixed inset-0 z-[95] flex items-start justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          style={{ background: "color-mix(in oklab, black 50%, transparent)", backdropFilter: "blur(3px)", paddingTop: "12vh" }}
          onMouseDown={() => set({ commandPaletteOpen: false })}
        >
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            data-vlc-region="panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0.2, 1] }}
            className="glass-panel"
            style={{
              width: 560, maxWidth: "92vw",
              border: "1px solid var(--vlc-border-normal)",
              borderRadius: "var(--vlc-radius-lg, 14px)",
              boxShadow: "var(--vlc-shadow-popup)",
              color: "var(--vlc-text-primary)",
              overflow: "hidden",
            }}
          >
            <div
              data-vlc-focus="none"
              data-app-allow-select="1"
              className="relative flex items-center gap-2 px-3 hairline-bottom"
              style={{ height: 44 }}
            >
              {isPending ? (
                <Loader2 size={14} className="vlc-spin" style={{ color: "var(--vlc-text-secondary)", flexShrink: 0 }} />
              ) : (
                <Search size={14} style={{ color: "var(--vlc-text-ghost)", flexShrink: 0 }} />
              )}
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActive(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
                  else if (e.key === "Enter") { e.preventDefault(); flat[active]?.run(); }
                }}
                placeholder="Search commands — open, snapshot, fullscreen, bookmark…"
                className="flex-1 bg-transparent text-[13.5px] tracking-tight"
                style={{
                  color: "var(--vlc-text-primary)",
                  outline: "none",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                  margin: 0,
                  height: "100%",
                  lineHeight: 1,
                  fontFeatureSettings: "'tnum' 1",
                }}
              />
              <kbd
                className="text-[10px] px-1.5 py-0.5 rounded shrink-0"
                style={{
                  fontFamily: "var(--vlc-font-mono)",
                  color: "var(--vlc-text-ghost)",
                  background: "var(--vlc-bg-sunken)",
                  border: "1px solid var(--vlc-border-subtle)",
                }}
              >
                esc
              </kbd>
            </div>
            <div style={{ maxHeight: 420, overflowY: "auto" }}>
              {flat.length === 0 && (
                <div className="px-4 py-6 text-center text-[12px]" style={{ color: "var(--vlc-text-ghost)" }}>No matching command</div>
              )}
              {grouped.map((g) => {
                const startIdx = flat.indexOf(g.cmds[0]);
                return (
                  <div key={g.section}>
                    <div
                      className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] sticky top-0"
                      style={{
                        color: "var(--vlc-text-ghost)",
                        background: "color-mix(in oklab, var(--vlc-bg-elevated) 92%, transparent)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {g.section}
                    </div>
                    {g.cmds.map((c, i) => {
                      const idx = startIdx + i;
                      const isActive = idx === active;
                      return (
                        <button
                          key={c.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={c.run}
                          className="flex items-center w-full px-3 py-2 text-left text-[13px] press gap-2"
                          style={{
                            background: isActive ? "var(--vlc-accent-dim)" : "transparent",
                            color: isActive ? "var(--vlc-accent)" : "var(--vlc-text-primary)",
                            borderLeft: isActive ? "2px solid var(--vlc-accent)" : "2px solid transparent",
                          }}
                        >
                          {g.section === "Recent" && <History size={12} style={{ color: isActive ? "var(--vlc-accent)" : "var(--vlc-text-ghost)" }} />}
                          {g.section === "Skins" && <Sparkles size={12} style={{ color: isActive ? "var(--vlc-accent)" : "var(--vlc-text-ghost)" }} />}
                          <span className="flex-1 truncate">{c.label}</span>
                          {c.hint && (
                            <span className="text-[10.5px] px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1" style={{ 
                              fontFamily: "var(--vlc-font-mono)", 
                              color: isActive ? "var(--vlc-accent)" : "var(--vlc-text-ghost)",
                              background: isActive ? "color-mix(in oklab, var(--vlc-accent) 20%, transparent)" : "var(--vlc-bg-sunken)",
                              border: isActive ? "none" : "1px solid var(--vlc-border-subtle)"
                            }}>
                              {c.section !== "Skins" && c.section !== "Mini-Apps" && <Keyboard size={10} />}
                              {c.hint}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="hairline-top px-3 py-1.5 flex items-center gap-3 text-[10.5px]" style={{ color: "var(--vlc-text-ghost)", fontFamily: "var(--vlc-font-mono)" }}>
              <span>↑↓ navigate</span><span>↵ run</span><span>esc close</span>
              <span className="ml-auto">{flat.length} commands</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
