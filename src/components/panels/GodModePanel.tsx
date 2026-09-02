// God Mode customization panel. For each of the 10 customizable elements,
// the user picks one of 10 preset options OR sets free-form CSS variable
// overrides. All applied via a single managed <style> tag in SkinProvider.

import { useState, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { GOD_CATEGORIES, GOD_CUSTOM_TOKENS } from "@/skins/godMode";
import { RotateCcw, Zap } from "lucide-react";

export function GodModePanel() {
  const godPicks = usePlayerStore((s) => s.godPicks);
  const godCustom = usePlayerStore((s) => s.godCustom);
  const pushOSD = usePlayerStore((s) => s.pushOSD);
  const set = usePlayerStore((s) => s.set);
  const [tab, setTab] = useState<"presets" | "custom">("presets");

  const setPick = (cat: string, opt: string) => {
    set({ godPicks: { ...godPicks, [cat]: opt } });
  };
  const setCustom = (key: string, val: string) => {
    const next = { ...godCustom };
    if (val) next[key] = val;
    else delete next[key];
    set({ godCustom: next });
  };
  const resetAll = () => {
    set({ godPicks: {}, godCustom: {} });
    pushOSD("God Mode: reset");
  };
  const randomize = () => {
    const picks: Record<string, string> = {};
    for (const c of GOD_CATEGORIES) {
      const opts = c.options;
      picks[c.id] = opts[Math.floor(Math.random() * opts.length)].id;
    }
    set({ godPicks: picks });
    pushOSD("God Mode: chaos engaged");
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} style={{ color: "var(--vlc-accent)" }} />
        <span className="text-[12px]" style={{ color: "var(--vlc-text-secondary)" }}>
          God Mode — every element, 10 ways, plus free overrides.
        </span>
        <div className="ml-auto flex gap-1">
          <button onClick={randomize} className="text-[11px] px-2 py-1 rounded" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}>
            Random
          </button>
          <button onClick={resetAll} className="text-[11px] px-2 py-1 rounded inline-flex items-center gap-1" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}>
            <RotateCcw size={10} /> Reset
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-3" style={{ borderBottom: "1px solid var(--vlc-border-subtle)" }}>
        <TabBtn active={tab === "presets"} onClick={() => setTab("presets")}>Presets</TabBtn>
        <TabBtn active={tab === "custom"} onClick={() => setTab("custom")}>Free Custom</TabBtn>
      </div>

      {tab === "presets" && (
        <div>
          {GOD_CATEGORIES.map((cat) => {
            const active = godPicks[cat.id] ?? "default";
            return (
              <div key={cat.id} className="mb-4">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[12px] font-semibold" style={{ color: "var(--vlc-text-primary)" }}>
                    {cat.label}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--vlc-text-ghost)" }}>
                    {cat.hint}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {cat.options.map((opt) => {
                    const isActive = opt.id === active;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setPick(cat.id, opt.id)}
                        className="text-[11px] px-2 py-1.5 rounded truncate"
                        title={opt.name}
                        style={{
                          background: isActive ? "var(--vlc-accent-dim)" : "var(--vlc-bg-sunken)",
                          color: isActive ? "var(--vlc-accent)" : "var(--vlc-text-primary)",
                          border: isActive ? "1px solid var(--vlc-accent)" : "1px solid var(--vlc-border-normal)",
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {opt.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "custom" && (
        <div>
          <p className="text-[11px] mb-3" style={{ color: "var(--vlc-text-ghost)" }}>
            Override any design token directly. Leave blank to fall back to the active skin.
          </p>
          {GOD_CUSTOM_TOKENS.map((v) => (
            <div key={v.key} className="flex items-center gap-2 mb-2">
              <span className="flex-1 text-[12px]" style={{ color: "var(--vlc-text-primary)" }}>
                {v.label}{" "}
                <span style={{ fontFamily: "var(--vlc-font-mono)", fontSize: 10, color: "var(--vlc-text-ghost)" }}>{v.key}</span>
              </span>
              {v.type === "color" ? (
                <DebouncedColorInput token={v.key} godCustom={godCustom} setCustom={setCustom} />
              ) : (
                <TextSwatchInput token={v.key} godCustom={godCustom} setCustom={setCustom} placeholder={v.placeholder} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-[12px] px-3 py-1.5"
      style={{
        color: active ? "var(--vlc-accent)" : "var(--vlc-text-secondary)",
        borderBottom: active ? "2px solid var(--vlc-accent)" : "2px solid transparent",
        marginBottom: -1,
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

function DebouncedColorInput({ token, godCustom, setCustom }: { token: string; godCustom: Record<string, string>; setCustom: (k: string, v: string) => void }) {
  const [local, setLocal] = useState<string>("#000000");

  useEffect(() => {
    if (godCustom[token]) {
      setLocal(godCustom[token]);
    } else {
      // Async resolve to prevent main thread blocking
      requestAnimationFrame(() => {
        const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
        if (raw.startsWith("#") && (raw.length === 7 || raw.length === 4)) {
          setLocal(raw);
        }
      });
    }
  }, [token, godCustom[token]]);

  return (
    <input
      type="color"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={(e) => setCustom(token, e.target.value)}
      className="cursor-pointer"
      style={{
        width: 28, height: 28, padding: 0, border: "none", borderRadius: 4, background: "none"
      }}
    />
  );
}

function TextSwatchInput({ token, godCustom, setCustom, placeholder }: { token: string; godCustom: Record<string, string>; setCustom: (k: string, v: string) => void; placeholder?: string }) {
  const [local, setLocal] = useState(godCustom[token] ?? "");
  const [resolved, setResolved] = useState<string>("");

  useEffect(() => {
    setLocal(godCustom[token] ?? "");
  }, [godCustom[token]]);

  // Background resolver for the swatch preview
  useEffect(() => {
    if (local) {
      setResolved(local);
    } else {
      requestAnimationFrame(() => {
        setResolved(getComputedStyle(document.documentElement).getPropertyValue(token).trim());
      });
    }
  }, [local, token]);

  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: 16, height: 16, borderRadius: "50%", background: resolved,
          boxShadow: "inset 0 0 0 1px rgba(127,127,127,0.3)"
        }}
        title="Live preview"
      />
      <input
        type="text"
        placeholder={placeholder ?? ""}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={(e) => setCustom(token, e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") setCustom(token, local); }}
        className="text-[12px] px-2 py-1 rounded w-44"
        style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", fontFamily: "var(--vlc-font-mono)" }}
      />
    </div>
  );
}
