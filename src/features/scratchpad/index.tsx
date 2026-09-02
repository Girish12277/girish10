import { useEffect, useState } from "react";

const KEY = "vlc-feat-scratchpad";

export default function Scratchpad() {
  const [text, setText] = useState(() => { try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; } });
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try { localStorage.setItem(KEY, text); setSavedAt(Date.now()); } catch { /* noop */ }
    }, 350);
    return () => window.clearTimeout(id);
  }, [text]);

  return (
    <div className="flex flex-col" style={{ height: 360 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Quick notes — autosaved locally…"
        spellCheck
        style={{
          flex: 1, padding: 14, background: "transparent", outline: "none", resize: "none",
          color: "var(--vlc-text-primary)", fontFamily: "var(--vlc-font-ui)", fontSize: 13, lineHeight: 1.55,
        }}
      />
      <div className="flex items-center justify-between px-3 py-2 text-[11px]"
        style={{ borderTop: "1px solid var(--vlc-border-subtle)", color: "var(--vlc-text-ghost)" }}>
        <span>{text.length} chars · {text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
        <span>{savedAt ? `Saved · ${new Date(savedAt).toLocaleTimeString()}` : "Not yet saved"}</span>
      </div>
    </div>
  );
}
