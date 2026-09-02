import { useMemo, useRef, useState } from "react";
import { usePlayerStore, type LayoutPreset, type A11yState } from "@/store/playerStore";
import { useShallow } from "zustand/react/shallow";
import { UI_REGISTRY, isVisible } from "@/utils/uiCustomization";
import { exportSettings, downloadSettings, importSettings } from "@/utils/settingsBackup";
import { CURSOR_STYLES, cursorCssFor, type CursorStyleId } from "@/utils/cursorStyles";
import { DEFAULT_APP_FEEL, type AppFeelState } from "@/store/playerStore";

// ─── Shared atoms ─────────────────────────────────────────────────────────
function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex-1 min-w-0">
        <div className="text-[12px] truncate" style={{ color: "var(--vlc-text-primary)" }}>{label}</div>
        {hint && <div className="text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

const inputCls = "text-[12px] px-2 py-1 rounded";
const inputStyle: React.CSSProperties = {
  background: "var(--vlc-bg-sunken)",
  color: "var(--vlc-text-primary)",
  border: "1px solid var(--vlc-border-normal)",
};

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-[11px] rounded press"
      style={{ background: "var(--vlc-accent)", color: "var(--vlc-bg-base)", fontWeight: 600 }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 text-[11px] rounded press" style={inputStyle}>
      {children}
    </button>
  );
}

// ─── Theme Studio ─────────────────────────────────────────────────────────
const STUDIO_TOKENS: { key: string; label: string; type: "color" | "text" }[] = [
  { key: "--vlc-accent", label: "Accent", type: "color" },
  { key: "--vlc-accent-hover", label: "Accent hover", type: "color" },
  { key: "--vlc-bg-base", label: "Background", type: "color" },
  { key: "--vlc-bg-surface", label: "Surface", type: "color" },
  { key: "--vlc-bg-elevated", label: "Elevated surface", type: "color" },
  { key: "--vlc-text-primary", label: "Text primary", type: "color" },
  { key: "--vlc-text-secondary", label: "Text secondary", type: "color" },
];

function pickColor(value: string | undefined, key: string): string {
  const raw = value ?? (typeof window !== "undefined" ? getComputedStyle(document.documentElement).getPropertyValue(key).trim() : "");
  if (raw.startsWith("#") && (raw.length === 7 || raw.length === 4)) return raw;
  return "#000000";
}

export function ThemeStudio() {
  const customVars = usePlayerStore((s) => s.customVars);
  const applyTheme = usePlayerStore((s) => s.applyTheme);
  const update = (k: string, v: string) => applyTheme({ ...customVars, [k]: v }, "Custom");

  return (
    <div>
      <p className="text-[11.5px] mb-3" style={{ color: "var(--vlc-text-secondary)" }}>
        Live token editor — every change applies instantly to the whole chrome.
      </p>

      <div className="mb-4">
        <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Colors</div>
        {STUDIO_TOKENS.map((t) => (
          <Row key={t.key} label={t.label} hint={t.key}>
            <input type="color" value={pickColor(customVars[t.key], t.key)} onChange={(e) => update(t.key, e.target.value)} />
          </Row>
        ))}
      </div>

      <div className="mb-4">
        <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Shape & motion</div>
        <Row label="Corner radius" hint="--vlc-radius-lg">
          <input type="text" placeholder="12px" defaultValue={customVars["--vlc-radius-lg"] ?? ""} onBlur={(e) => update("--vlc-radius-lg", e.target.value)} className={`${inputCls} w-20`} style={inputStyle} />
        </Row>
        <Row label="Elevation strength" hint="--vlc-shadow-popup">
          <input type="text" placeholder="0 12px 32px rgba(0,0,0,.5)" defaultValue={customVars["--vlc-shadow-popup"] ?? ""} onBlur={(e) => update("--vlc-shadow-popup", e.target.value)} className={`${inputCls} w-44`} style={inputStyle} />
        </Row>
        <Row label="Blur strength" hint="--vlc-blur-panel">
          <input type="text" placeholder="14px" defaultValue={customVars["--vlc-blur-panel"] ?? ""} onBlur={(e) => update("--vlc-blur-panel", e.target.value)} className={`${inputCls} w-20`} style={inputStyle} />
        </Row>
        <Row label="Base motion duration" hint="--dur-base">
          <input type="text" placeholder="180ms" defaultValue={customVars["--dur-base"] ?? ""} onBlur={(e) => update("--dur-base", e.target.value)} className={`${inputCls} w-20`} style={inputStyle} />
        </Row>
        <Row label="Font size scale" hint="--text-sm root">
          <input type="text" placeholder="13px" defaultValue={customVars["--text-sm"] ?? ""} onBlur={(e) => update("--text-sm", e.target.value)} className={`${inputCls} w-20`} style={inputStyle} />
        </Row>
      </div>

      <div className="mt-4 p-3 rounded" style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)" }}>
        <div className="text-[11px] mb-2" style={{ color: "var(--vlc-text-ghost)" }}>Live preview</div>
        <div className="flex items-center gap-2 mb-2">
          <PrimaryButton onClick={() => undefined}>Primary action</PrimaryButton>
          <GhostButton onClick={() => undefined}>Ghost</GhostButton>
        </div>
        <div style={{ height: 6, background: "var(--vlc-seek-track)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: "60%", height: "100%", background: "var(--vlc-accent)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Chrome Composer ──────────────────────────────────────────────────────
export function ChromeComposer() {
  const vis = usePlayerStore((s) => s.uiVisibility);
  const set = usePlayerStore((s) => s.set);
  const chromePosition = usePlayerStore((s) => s.chromePosition);
  const density = usePlayerStore((s) => s.density);
  const controlOrder = usePlayerStore((s) => s.controlOrder);
  const dragId = useRef<string | null>(null);

  const ctrlRegistry = useMemo(() => UI_REGISTRY.filter((e) => e.group === "Control bar"), []);
  const labelFor = (id: string) => ctrlRegistry.find((e) => e.id === id)?.label ?? id;

  const reorder = (target: string) => {
    if (!dragId.current || dragId.current === target) return;
    const from = controlOrder.indexOf(dragId.current);
    const to = controlOrder.indexOf(target);
    if (from < 0 || to < 0) return;
    const next = [...controlOrder];
    next.splice(from, 1);
    next.splice(to, 0, dragId.current);
    set({ controlOrder: next });
  };

  const chromeRegions = UI_REGISTRY.filter((e) => e.group === "Window chrome");

  return (
    <div>
      <p className="text-[11.5px] mb-3" style={{ color: "var(--vlc-text-secondary)" }}>
        Drag to reorder transport buttons, toggle chrome regions, and pick where the control bar lives.
      </p>

      <div className="mb-4">
        <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Layout</div>
        <Row label="Chrome position">
          <select
            value={chromePosition}
            onChange={(e) => set({ chromePosition: e.target.value as "top" | "bottom" | "floating" })}
            className={inputCls}
            style={inputStyle}
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="floating">Floating</option>
          </select>
        </Row>
        <Row label="Density">
          <select
            value={density}
            onChange={(e) => set({ density: e.target.value as "compact" | "cozy" | "comfortable" })}
            className={inputCls}
            style={inputStyle}
          >
            <option value="compact">Compact</option>
            <option value="cozy">Cozy</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </Row>
      </div>

      <div className="mb-4">
        <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Chrome regions</div>
        {chromeRegions.map((e) => (
          <label key={e.id} className="flex items-center gap-2 mb-1.5 cursor-pointer">
            <input type="checkbox" checked={isVisible(vis, e.id)} onChange={(ev) => set({ uiVisibility: { ...vis, [e.id]: ev.target.checked } })} />
            <span className="text-[12px] flex-1" style={{ color: "var(--vlc-text-primary)" }}>{e.label}</span>
          </label>
        ))}
      </div>

      <div>
        <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>
          Control bar order — drag to rearrange
        </div>
        <div className="flex flex-col gap-1">
          {controlOrder.map((id) => (
            <div
              key={id}
              draggable
              onDragStart={() => { dragId.current = id; }}
              onDragOver={(e) => { e.preventDefault(); reorder(id); }}
              onDragEnd={() => { dragId.current = null; }}
              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-move"
              style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)" }}
            >
              <span className="text-[10px]" style={{ color: "var(--vlc-text-ghost)" }}>⋮⋮</span>
              <input
                type="checkbox"
                checked={isVisible(vis, id)}
                onChange={(ev) => set({ uiVisibility: { ...vis, [id]: ev.target.checked } })}
              />
              <span className="text-[12px] flex-1" style={{ color: "var(--vlc-text-primary)" }}>{labelFor(id)}</span>
              <span className="text-[10px]" style={{ fontFamily: "var(--vlc-font-mono)", color: "var(--vlc-text-ghost)" }}>{id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Layout Presets ───────────────────────────────────────────────────────
const BUILTIN_PRESETS: Record<string, Omit<LayoutPreset, "name">> = {
  Cinema: {
    density: "comfortable", chromePosition: "floating",
    uiVisibility: { "chrome.titleBar": false, "chrome.menuBar": false, "chrome.dockRail": false },
    controlOrder: [],
  },
  Classic: {
    density: "cozy", chromePosition: "bottom",
    uiVisibility: {},
    controlOrder: [],
  },
  Minimal: {
    density: "compact", chromePosition: "bottom",
    uiVisibility: { "chrome.menuBar": false, "ctrl.teletext": false, "ctrl.frameStep": false, "ctrl.effects": false },
    controlOrder: [],
  },
  Kiosk: {
    density: "comfortable", chromePosition: "bottom",
    uiVisibility: { "chrome.titleBar": false, "chrome.menuBar": false, "ctrl.stop": false, "ctrl.frameStep": false },
    controlOrder: [],
  },
  DJ: {
    density: "compact", chromePosition: "top",
    uiVisibility: {},
    controlOrder: [],
  },
};

export function LayoutPresets() {
  const presets = usePlayerStore((s) => s.layoutPresets);
  const set = usePlayerStore((s) => s.set);
  const all = usePlayerStore.getState;

  const applyPreset = (p: Omit<LayoutPreset, "name">) => {
    const s = all();
    set({
      density: p.density,
      chromePosition: p.chromePosition,
      uiVisibility: { ...s.uiVisibility, ...p.uiVisibility },
      controlOrder: p.controlOrder.length ? p.controlOrder : s.controlOrder,
    });
  };

  const saveCurrent = () => {
    const name = prompt("Preset name?");
    if (!name) return;
    const s = all();
    set({
      layoutPresets: {
        ...presets,
        [name]: { name, density: s.density, chromePosition: s.chromePosition, uiVisibility: s.uiVisibility, controlOrder: s.controlOrder },
      },
    });
  };

  return (
    <div>
      <p className="text-[11.5px] mb-3" style={{ color: "var(--vlc-text-secondary)" }}>
        One-click bundles of density + chrome position + visibility.
      </p>
      <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Built-in</div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(BUILTIN_PRESETS).map(([name, p]) => (
          <button
            key={name}
            onClick={() => applyPreset(p)}
            className="p-3 text-left rounded press"
            style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-normal)" }}
          >
            <div className="text-[12.5px] font-medium" style={{ color: "var(--vlc-text-primary)" }}>{name}</div>
            <div className="text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>
              {p.density} · {p.chromePosition}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Yours</span>
        <PrimaryButton onClick={saveCurrent}>Save current</PrimaryButton>
      </div>
      {Object.keys(presets).length === 0 ? (
        <p className="text-[11px]" style={{ color: "var(--vlc-text-ghost)" }}>No saved presets yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {Object.values(presets).map((p) => (
            <div key={p.name} className="p-3 rounded" style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-normal)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12.5px] font-medium" style={{ color: "var(--vlc-text-primary)" }}>{p.name}</span>
                <button
                  onClick={() => {
                    const { [p.name]: _, ...rest } = presets;
                    void _;
                    set({ layoutPresets: rest });
                  }}
                  className="text-[10px]"
                  style={{ color: "var(--vlc-text-ghost)" }}
                >
                  Remove
                </button>
              </div>
              <div className="text-[10.5px] mb-2" style={{ color: "var(--vlc-text-ghost)" }}>{p.density} · {p.chromePosition}</div>
              <GhostButton onClick={() => applyPreset(p)}>Apply</GhostButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Keybinding Editor ────────────────────────────────────────────────────
function keyLabel(e: KeyboardEvent) {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
  if (e.altKey) parts.push("Alt");
  if (e.shiftKey) parts.push("Shift");
  if (e.code && !["ControlLeft", "ControlRight", "AltLeft", "AltRight", "ShiftLeft", "ShiftRight", "MetaLeft", "MetaRight"].includes(e.code)) {
    parts.push(e.code);
  }
  return parts.join("+");
}

export function KeybindingEditor() {
  const hotkeys = usePlayerStore((s) => s.hotkeys);
  const set = usePlayerStore((s) => s.set);
  const [editing, setEditing] = useState<string | null>(null);

  const conflicts = useMemo(() => {
    const map: Record<string, string[]> = {};
    Object.entries(hotkeys).forEach(([action, key]) => {
      (map[key] ||= []).push(action);
    });
    return new Set(Object.values(map).filter((v) => v.length > 1).flat());
  }, [hotkeys]);

  const startCapture = (action: string) => {
    setEditing(action);
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Escape") { setEditing(null); window.removeEventListener("keydown", handler, true); return; }
      const label = keyLabel(e);
      if (!label) return;
      set({ hotkeys: { ...hotkeys, [action]: label } });
      setEditing(null);
      window.removeEventListener("keydown", handler, true);
    };
    window.addEventListener("keydown", handler, true);
  };

  return (
    <div>
      <p className="text-[11.5px] mb-3" style={{ color: "var(--vlc-text-secondary)" }}>
        Click a binding to rebind. Press Escape to cancel. Duplicate bindings are highlighted.
      </p>
      <table className="w-full text-[12px]">
        <thead><tr style={{ color: "var(--vlc-text-ghost)", textAlign: "left" }}><th className="py-1">Action</th><th>Key binding</th></tr></thead>
        <tbody>
          {Object.entries(hotkeys).map(([action, key]) => {
            const isEditing = editing === action;
            const isConflict = conflicts.has(action);
            return (
              <tr key={action} style={{ borderBottom: "1px solid var(--vlc-border-subtle)" }}>
                <td className="py-1.5" style={{ color: "var(--vlc-text-primary)" }}>{action}</td>
                <td className="py-1.5">
                  <button
                    onClick={() => startCapture(action)}
                    className="px-2 py-0.5 rounded text-[11px]"
                    style={{
                      fontFamily: "var(--vlc-font-mono)",
                      color: isEditing ? "var(--vlc-bg-base)" : isConflict ? "var(--vlc-state-danger, #ef4444)" : "var(--vlc-accent)",
                      background: isEditing ? "var(--vlc-accent)" : "var(--vlc-bg-sunken)",
                      border: "1px solid var(--vlc-border-subtle)",
                    }}
                  >
                    {isEditing ? "Press key…" : key}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Accessibility ────────────────────────────────────────────────────────
export function AccessibilityPanel() {
  const a11y = usePlayerStore((s) => s.a11y);
  const set = usePlayerStore((s) => s.set);
  const patch = (p: Partial<A11yState>) => set({ a11y: { ...a11y, ...p } });

  return (
    <div>
      <p className="text-[11.5px] mb-3" style={{ color: "var(--vlc-text-secondary)" }}>
        These overrides also respect <code>prefers-contrast</code> and <code>prefers-reduced-motion</code>.
      </p>
      <Row label="High contrast" hint="Forces strong borders and AAA text contrast">
        <input type="checkbox" checked={a11y.highContrast} onChange={(e) => patch({ highContrast: e.target.checked })} />
      </Row>
      <Row label="Dyslexia-friendly font" hint="Swap UI sans for OpenDyslexic-style stack">
        <input type="checkbox" checked={a11y.dyslexiaFont} onChange={(e) => patch({ dyslexiaFont: e.target.checked })} />
      </Row>
      <Row label="Focus ring intensity" hint="0 = subtle · 3 = vivid">
        <input type="range" min={0} max={3} step={1} value={a11y.focusRingIntensity} onChange={(e) => patch({ focusRingIntensity: Number(e.target.value) })} />
      </Row>
      <div className="text-[11px] mt-4 mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Subtitles</div>
      <Row label="Default size">
        <input type="range" min={12} max={48} step={1} value={a11y.subtitleSize} onChange={(e) => patch({ subtitleSize: Number(e.target.value) })} />
        <span className="text-[11px] w-8 text-right" style={{ color: "var(--vlc-text-secondary)", fontFamily: "var(--vlc-font-mono)" }}>{a11y.subtitleSize}px</span>
      </Row>
      <Row label="Background opacity">
        <input type="range" min={0} max={1} step={0.05} value={a11y.subtitleBackground} onChange={(e) => patch({ subtitleBackground: Number(e.target.value) })} />
      </Row>
      <Row label="Outline">
        <input type="checkbox" checked={a11y.subtitleOutline} onChange={(e) => patch({ subtitleOutline: e.target.checked })} />
      </Row>
    </div>
  );
}

// ─── Motion & Theme presets ───────────────────────────────────────────────
const MOTION_PRESETS: { id: string; label: string; value: number; hint: string }[] = [
  { id: "none",     label: "None",     value: 0,    hint: "Disable all transitions" },
  { id: "calm",     label: "Calm",     value: 1.4,  hint: "40% slower — easier on the eyes" },
  { id: "standard", label: "Standard", value: 1,    hint: "Default tuning" },
  { id: "snappy",   label: "Snappy",   value: 0.5,  hint: "Twice as fast" },
];

const THEME_MODES: { id: "dark" | "light" | "system"; label: string; hint: string }[] = [
  { id: "dark",   label: "Dark",   hint: "Default night chrome" },
  { id: "light",  label: "Light",  hint: "Paper-bright surfaces" },
  { id: "system", label: "System", hint: "Follow OS preference" },
];

export function MotionAndTheme() {
  const motionScale = usePlayerStore((s) => s.motionScale);
  const themeMode = usePlayerStore((s) => s.themeMode);
  const cursorStyle = usePlayerStore((s) => s.cursorStyle);
  const set = usePlayerStore((s) => s.set);
  const pushOSD = usePlayerStore((s) => s.pushOSD);

  return (
    <div>
      <p className="text-[11.5px] mb-3" style={{ color: "var(--vlc-text-secondary)" }}>
        Tune global motion speed and the base color scheme. Honors{" "}
        <code>prefers-reduced-motion</code> automatically.
      </p>

      <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Motion preset</div>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {MOTION_PRESETS.map((p) => {
          const active = Math.abs(motionScale - p.value) < 0.001;
          return (
            <button
              key={p.id}
              onClick={() => { set({ motionScale: p.value }); pushOSD(`Motion: ${p.label}`); }}
              className="text-left p-3 rounded press"
              style={{
                background: active ? "var(--vlc-accent-dim)" : "var(--vlc-bg-sunken)",
                border: `1px solid ${active ? "var(--vlc-accent)" : "var(--vlc-border-normal)"}`,
                color: "var(--vlc-text-primary)",
              }}
            >
              <div className="text-[12px] font-medium">{p.label}</div>
              <div className="text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>{p.hint}</div>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Theme mode</div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {THEME_MODES.map((m) => {
          const active = themeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => { set({ themeMode: m.id }); pushOSD(`Theme: ${m.label}`); }}
              className="text-left p-3 rounded press"
              style={{
                background: active ? "var(--vlc-accent-dim)" : "var(--vlc-bg-sunken)",
                border: `1px solid ${active ? "var(--vlc-accent)" : "var(--vlc-border-normal)"}`,
                color: "var(--vlc-text-primary)",
              }}
            >
              <div className="text-[12px] font-medium">{m.label}</div>
              <div className="text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>{m.hint}</div>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>Cursor style</div>
      <div className="grid grid-cols-2 gap-2">
        {CURSOR_STYLES.map((style) => {
          const active = cursorStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => { set({ cursorStyle: style.id as CursorStyleId }); pushOSD(`Cursor: ${style.label}`); }}
              className="text-left p-3 rounded press"
              style={{
                cursor: cursorCssFor(style.id),
                background: active ? "var(--vlc-accent-dim)" : "var(--vlc-bg-sunken)",
                border: `1px solid ${active ? "var(--vlc-accent)" : "var(--vlc-border-normal)"}`,
                color: "var(--vlc-text-primary)",
              }}
            >
              <div className="flex items-center gap-2 text-[12px] font-medium">
                <span aria-hidden style={{ fontSize: 15 }}>⌖</span>
                {style.label}
              </div>
              <div className="text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>{style.hint}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


// ─── Import / Export ──────────────────────────────────────────────────────
export function ImportExportPanel() {
  const { set, pushOSD, themeName, customVars, uiVisibility, activeSkinId, godPicks, godCustom, hotkeys, density, chromePosition, cursorStyle, controlOrder, layoutPresets, a11y } = usePlayerStore(useShallow((s) => ({
    set: s.set,
    pushOSD: s.pushOSD,
    themeName: s.themeName,
    customVars: s.customVars,
    uiVisibility: s.uiVisibility,
    activeSkinId: s.activeSkinId,
    godPicks: s.godPicks,
    godCustom: s.godCustom,
    hotkeys: s.hotkeys,
    density: s.density,
    chromePosition: s.chromePosition,
    cursorStyle: s.cursorStyle,
    controlOrder: s.controlOrder,
    layoutPresets: s.layoutPresets,
    a11y: s.a11y,
  })));
  
  const [pasted, setPasted] = useState("");
  const [mode, setMode] = useState<"full" | "customization">("full");

  const bundle = useMemo(() => JSON.stringify({
    themeName, customVars, uiVisibility, activeSkinId, godPicks, godCustom, hotkeys, density, chromePosition, cursorStyle, controlOrder, layoutPresets, a11y
  }, null, 2), [themeName, customVars, uiVisibility, activeSkinId, godPicks, godCustom, hotkeys, density, chromePosition, cursorStyle, controlOrder, layoutPresets, a11y]);

  const download = () => {
    if (mode === "full") {
      downloadSettings();
      pushOSD("Full backup downloaded");
    } else {
      const blob = new Blob([bundle], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "vlc-customization.json";
      a.click();
    }
  };

  const apply = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      // Full versioned backup envelope → restore everything, then reload
      // so every Zustand store re-hydrates from the fresh localStorage.
      if (parsed && typeof parsed === "object" && parsed.app === "vlc-web-player") {
        const n = importSettings(parsed);
        pushOSD(`Restored ${n} settings — reloading…`);
        setTimeout(() => window.location.reload(), 600);
        return;
      }
      
      // Legacy or raw Customization bundle (Phase 1/2 shape)
      if (typeof parsed.themeName === "string" || parsed.activeSkinId) {
        set({ ...parsed });
        pushOSD("Customization applied");
      }
    } catch (e) {
      pushOSD("Failed to apply (invalid format)");
    }
  };

  return (
    <div>
      <p className="text-[11.5px] mb-3" style={{ color: "var(--vlc-text-secondary)" }}>
        Back up everything (skins, layout, hotkeys, bookmarks, study hub) or just the customization slice.
      </p>
      <div className="flex gap-1 mb-3 p-1 rounded" style={{ background: "var(--vlc-bg-sunken)", width: "fit-content" }}>
        {(["full", "customization"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="px-2.5 py-1 text-[11px] rounded"
            style={{
              background: mode === m ? "var(--vlc-accent)" : "transparent",
              color: mode === m ? "var(--vlc-bg-base)" : "var(--vlc-text-secondary)",
              fontWeight: mode === m ? 700 : 500,
            }}
          >
            {m === "full" ? "Full backup" : "Customization only"}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <PrimaryButton onClick={download}>Download JSON</PrimaryButton>
        <GhostButton onClick={() => {
          const text = mode === "full" ? JSON.stringify(exportSettings(), null, 2) : bundle;
          navigator.clipboard?.writeText(text); pushOSD("Copied to clipboard");
        }}>Copy</GhostButton>
        <label className="px-3 py-1.5 text-[11px] rounded press cursor-pointer" style={inputStyle}>
          Import file…
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              f.text().then(apply);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      <textarea
        value={pasted}
        onChange={(e) => setPasted(e.target.value)}
        placeholder="Paste a customization JSON here…"
        rows={6}
        className="w-full text-[11px] p-2 rounded font-mono"
        style={{ ...inputStyle, fontFamily: "var(--vlc-font-mono)" }}
      />
      <div className="mt-2 flex justify-end">
        <GhostButton onClick={() => apply(pasted)}>Apply pasted</GhostButton>
      </div>
    </div>
  );
}

// ─── App Feel ─────────────────────────────────────────────────────────────
type FeelKey = keyof AppFeelState;
const FEEL_ROWS: { key: FeelKey; label: string; hint: string }[] = [
  { key: "disableTextSelect",    label: "Disable text selection",       hint: "Text won't highlight when you drag — inputs & fields still work." },
  { key: "disableContextMenu",   label: "Disable right-click menu",     hint: "Blocks the browser context menu everywhere except form fields." },
  { key: "disableImageDrag",     label: "Prevent image / link drag",    hint: "Stops the ghost preview when dragging thumbnails or anchors." },
  { key: "disableOverscroll",    label: "Disable overscroll bounce",    hint: "No rubber-band or pull-to-refresh at the edges." },
  { key: "disableDoubleTapZoom", label: "Disable double-tap zoom",      hint: "Touchscreen taps register immediately (no 300ms delay)." },
  { key: "disableBrowserZoom",   label: "Block Ctrl + scroll / +/- zoom", hint: "Locks the layout at 100% so the app never scales unexpectedly." },
  { key: "disablePrintHotkey",   label: "Block Ctrl+P (print)",         hint: "Prevents the print dialog from stealing focus." },
  { key: "disableSaveHotkey",    label: "Block Ctrl+S / Ctrl+U",        hint: "Stops save-page-as and view-source shortcuts." },
  { key: "disableFindHotkey",    label: "Block Ctrl+F / F3 (find)",     hint: "Off by default — turn on to force the in-app search palette." },
  { key: "disableSpellcheck",    label: "Disable spellcheck underlines", hint: "Red squiggles removed from every text field." },
  { key: "disableCallout",       label: "Disable long-press callout",   hint: "iOS-style share/copy popover suppressed on touch devices." },
  { key: "blockPageDragDrop",    label: "Swallow stray file drops",     hint: "Dropping a file outside a dropzone won't navigate the tab away." },
  { key: "confirmOnClose",       label: "Confirm before closing",       hint: "Prompts \"leave site?\" while a video is playing." },
];

export function AppFeelPanel() {
  const feel = usePlayerStore((s) => s.appFeel);
  const set = usePlayerStore((s) => s.set);
  const pushOSD = usePlayerStore((s) => s.pushOSD);
  const patch = (k: FeelKey, v: boolean) => set({ appFeel: { ...feel, [k]: v } });
  const enabledCount = FEEL_ROWS.filter((r) => feel[r.key]).length;

  return (
    <div>
      <p className="text-[11.5px] mb-3" style={{ color: "var(--vlc-text-secondary)" }}>
        Strip away browser-y behaviors so this feels like a real desktop / PWA app.
        Each toggle is precise — form fields, dropzones, and the in-app context
        menu still work as expected.
      </p>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[11px]" style={{ color: "var(--vlc-text-ghost)" }}>
          {enabledCount}/{FEEL_ROWS.length} rules active
        </span>
        <button
          onClick={() => { set({ appFeel: { ...DEFAULT_APP_FEEL } }); pushOSD("App feel: defaults restored"); }}
          className="ml-auto text-[11px] px-2 py-0.5 rounded"
          style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}
        >Reset defaults</button>
        <button
          onClick={() => {
            const next = { ...feel } as AppFeelState;
            FEEL_ROWS.forEach((r) => { (next as Record<FeelKey, boolean>)[r.key] = true; });
            set({ appFeel: next });
            pushOSD("App feel: full lockdown");
          }}
          className="text-[11px] px-2 py-0.5 rounded"
          style={{ background: "var(--vlc-accent-dim)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-accent)" }}
        >Enable all</button>
        <button
          onClick={() => {
            const next = { ...feel } as AppFeelState;
            FEEL_ROWS.forEach((r) => { (next as Record<FeelKey, boolean>)[r.key] = false; });
            set({ appFeel: next });
            pushOSD("App feel: browser mode");
          }}
          className="text-[11px] px-2 py-0.5 rounded"
          style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}
        >Disable all</button>
      </div>
      <div className="rounded overflow-hidden" style={{ border: "1px solid var(--vlc-border-subtle)" }}>
        {FEEL_ROWS.map((row, i) => {
          const on = feel[row.key];
          return (
            <label
              key={row.key}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer"
              style={{
                background: i % 2 === 0 ? "var(--vlc-bg-sunken)" : "transparent",
                borderTop: i === 0 ? "none" : "1px solid var(--vlc-border-subtle)",
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[12px]" style={{ color: "var(--vlc-text-primary)" }}>{row.label}</div>
                <div className="text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>{row.hint}</div>
              </div>
              <input
                type="checkbox"
                checked={on}
                onChange={(e) => patch(row.key, e.target.checked)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
