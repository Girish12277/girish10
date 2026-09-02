import { useState, type CSSProperties } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { useShallow } from "zustand/react/shallow";
import { THEMES, ALL_THEME_VARS, applyThemeByName } from "@/utils/themeManager";
import { UI_REGISTRY, isVisible } from "@/utils/uiCustomization";
import { SkinGallery } from "@/components/panels/SkinGallery";
import { GodModePanel } from "@/components/panels/GodModePanel";
import {
  ThemeStudio,
  ChromeComposer,
  LayoutPresets,
  KeybindingEditor,
  AccessibilityPanel,
  ImportExportPanel,
  MotionAndTheme,
  AppFeelPanel,
} from "@/components/panels/sections/CustomizationSections";
import { X } from "lucide-react";

function pickColor(value: string | undefined, key: string): string {
  const raw = value ?? (typeof window !== "undefined" ? getComputedStyle(document.documentElement).getPropertyValue(key).trim() : "");
  if (raw.startsWith("#") && (raw.length === 7 || raw.length === 4)) return raw;
  return "#000000";
}

const CATEGORIES = [
  "Theme Studio",
  "Motion & Theme",
  "App Feel",
  "Chrome Composer",
  "Layout Presets",
  "Keybindings",
  "Accessibility",
  "Import / Export",
  "Interface",
  "Audio",
  "Video",
  "Subtitles / OSD",
  "Hotkeys",
  "Skins",
  "God Mode",
  "Appearance",
  "Customization",
] as const;


export function PreferencesPanel() {
  const open = usePlayerStore((s) => s.preferencesOpen);
  const set = usePlayerStore((s) => s.set);
  const [cat, setCat] = useState<typeof CATEGORIES[number]>("Theme Studio");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => set({ preferencesOpen: false })}>
      <div data-vlc-region="panel" onClick={(e) => e.stopPropagation()} style={{ width: "min(820px, 96vw)", height: "min(620px, 92vh)", background: "var(--vlc-bg-elevated)", border: "1px solid var(--vlc-border-normal)", borderRadius: "var(--vlc-radius-lg)", boxShadow: "var(--vlc-shadow-popup)", display: "flex", overflow: "hidden" }}>
        <div style={{ width: 200, background: "var(--vlc-bg-sunken)", borderRight: "1px solid var(--vlc-border-subtle)", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div className="px-4 py-3 text-[13px] font-medium shrink-0" style={{ color: "var(--vlc-text-primary)", borderBottom: "1px solid var(--vlc-border-subtle)" }}>Preferences</div>
          <div className="flex-1 overflow-y-auto py-1">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className="w-full text-left px-4 text-[13px]"
                style={{ height: 34, color: cat === c ? "var(--vlc-text-primary)" : "var(--vlc-text-secondary)", background: cat === c ? "var(--vlc-accent-dim)" : "transparent", borderLeft: cat === c ? "2px solid var(--vlc-accent)" : "2px solid transparent" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-5" style={{ height: 44, borderBottom: "1px solid var(--vlc-border-subtle)" }}>
            <span className="text-[13px] font-medium" style={{ color: "var(--vlc-text-primary)" }}>{cat}</span>
            <button onClick={() => set({ preferencesOpen: false })} style={{ color: "var(--vlc-text-secondary)" }}><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-auto p-5">
            {cat === "Theme Studio" && <ThemeStudio />}
            {cat === "Motion & Theme" && <MotionAndTheme />}
            {cat === "App Feel" && <AppFeelPanel />}
            {cat === "Chrome Composer" && <ChromeComposer />}
            {cat === "Layout Presets" && <LayoutPresets />}
            {cat === "Keybindings" && <KeybindingEditor />}
            {cat === "Accessibility" && <AccessibilityPanel />}
            {cat === "Import / Export" && <ImportExportPanel />}
            {cat === "Skins" && <SkinGallery />}
            {cat === "God Mode" && <GodModePanel />}
            {cat === "Appearance" && <AppearancePrefs />}
            {cat === "Interface" && <InterfacePrefs />}
            {cat === "Audio" && <AudioPrefs />}
            {cat === "Video" && <VideoPrefs />}
            {cat === "Subtitles / OSD" && <SubsPrefs />}
            {cat === "Hotkeys" && <HotkeysPrefs />}
            {cat === "Customization" && <CustomizationPrefs />}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearancePrefs() {
  const themeName = usePlayerStore((s) => s.themeName);
  const customVars = usePlayerStore((s) => s.customVars);
  const applyTheme = usePlayerStore((s) => s.applyTheme);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visibleThemes = q ? THEMES.filter((t) => t.name.toLowerCase().includes(q)) : THEMES;
  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-3">
        <h3 className="text-[12px]" style={{ color: "var(--vlc-text-secondary)" }}>
          Theme presets <span style={{ color: "var(--vlc-text-ghost)" }}>· {visibleThemes.length} of {THEMES.length}</span>
        </h3>
        <input
          type="text"
          placeholder="Search themes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-[12px] px-2 py-1 rounded w-44"
          style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}
        />
      </div>
      <div
        className="grid grid-cols-3 gap-3 mb-5 overflow-y-auto pr-1"
        style={{ maxHeight: 420 }}
      >
        {visibleThemes.map((t) => (
          <button key={t.name} onClick={() => applyThemeByName(t.name, applyTheme, customVars)}
            className="rounded p-2 text-left"
            style={{
              height: 84,
              background: t.vars["--vlc-bg-base"] ?? "var(--vlc-bg-base)",
              border: themeName === t.name ? "2px solid var(--vlc-accent)" : "1px solid var(--vlc-border-normal)",
              // Skip layout/paint for off-screen tiles — keeps scrolling at 60fps
              // regardless of total theme count.
              contentVisibility: "auto",
              containIntrinsicSize: "84px 100px",
            } as CSSProperties}>
            <div className="flex flex-col gap-1">
              <div style={{ height: 8, background: t.vars["--vlc-bg-sunken"] ?? "var(--vlc-bg-sunken)", borderRadius: 2 }} />
              <div style={{ height: 28, background: t.vars["--vlc-bg-surface"] ?? "var(--vlc-bg-surface)", borderRadius: 2, position: "relative" }}>
                <div style={{ position: "absolute", left: 4, bottom: 4, height: 3, width: "60%", background: t.vars["--vlc-accent"] ?? "var(--vlc-accent)", borderRadius: 2 }} />
              </div>
              <div className="text-[11px] truncate" style={{ color: t.vars["--vlc-text-primary"] ?? "var(--vlc-text-primary)" }}>{t.name}</div>
            </div>
          </button>
        ))}
      </div>
      {themeName === "Custom" && (
        <div>
          <h3 className="text-[12px] mb-2" style={{ color: "var(--vlc-text-secondary)" }}>Custom variables — full access</h3>
          {Array.from(new Set(ALL_THEME_VARS.map((v) => v.group))).map((group) => (
            <div key={group} className="mb-3">
              <div className="text-[11px] mb-1.5 uppercase tracking-wide" style={{ color: "var(--vlc-text-ghost)" }}>{group}</div>
              {ALL_THEME_VARS.filter((v) => v.group === group).map((v) => (
                <div key={v.key} className="flex items-center gap-2 mb-1.5">
                  <span className="flex-1 text-[12px]" style={{ color: "var(--vlc-text-primary)" }}>{v.label} <span style={{ fontFamily: "var(--vlc-font-mono)", fontSize: 10, color: "var(--vlc-text-ghost)" }}>{v.key}</span></span>
                  {v.type === "color" ? (
                    <input type="color" value={pickColor(customVars[v.key], v.key)} onChange={(e) => { const next = { ...customVars, [v.key]: e.target.value }; applyTheme(next, "Custom"); }} />
                  ) : (
                    <input type="text" placeholder="e.g. 14px" value={customVars[v.key] ?? ""} onChange={(e) => { const next = { ...customVars, [v.key]: e.target.value }; applyTheme(next, "Custom"); }}
                      className="text-[12px] px-2 py-1 rounded w-24"
                      style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center gap-3 mb-3"><span className="text-[12px] flex-1" style={{ color: "var(--vlc-text-secondary)" }}>{label}</span>{children}</div>;
}

function InterfacePrefs() {
  return (
    <div>
      <Row label="Language"><select className="text-[12px] px-2 py-1 rounded" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}><option>English</option><option>Hindi</option></select></Row>
      <Row label="Continue last playlist on start"><input type="checkbox" defaultChecked /></Row>
      <Row label="Show album art"><input type="checkbox" defaultChecked /></Row>
    </div>
  );
}
function AudioPrefs() {
  const { volume, set } = usePlayerStore(useShallow((s) => ({ volume: s.volume, set: s.set })));
  return (
    <div>
      <Row label="Default volume"><input type="range" min={0} max={2} step={0.05} value={volume} onChange={(e) => set({ volume: parseFloat(e.target.value) })} className="vlc-slider" /></Row>
      <Row label="Audio output module"><select className="text-[12px] px-2 py-1 rounded" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}><option>WebAudio (default)</option></select></Row>
    </div>
  );
}
function VideoPrefs() {
  return (
    <div>
      <Row label="Hardware acceleration"><input type="checkbox" defaultChecked /></Row>
      <Row label="Snapshot format"><select className="text-[12px] px-2 py-1 rounded" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}><option>PNG</option><option>JPG</option><option>WebP</option></select></Row>
      <Row label="Snapshot prefix"><input className="text-[12px] px-2 py-1 rounded" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }} defaultValue="vlc-snap" /></Row>
    </div>
  );
}
function SubsPrefs() {
  return (
    <div>
      <Row label="Enable subtitles by default"><input type="checkbox" defaultChecked /></Row>
      <Row label="Font size"><input type="range" min={12} max={72} defaultValue={18} className="vlc-slider" /></Row>
      <Row label="Font color"><input type="color" defaultValue="#ffffff" /></Row>
    </div>
  );
}
function HotkeysPrefs() {
  const hotkeys = usePlayerStore((s) => s.hotkeys);
  return (
    <table className="w-full text-[12px]">
      <thead><tr style={{ color: "var(--vlc-text-ghost)", textAlign: "left" }}><th className="py-1">Action</th><th>Key binding</th></tr></thead>
      <tbody>
        {Object.entries(hotkeys).map(([action, key]) => (
          <tr key={action} style={{ borderBottom: "1px solid var(--vlc-border-subtle)" }}>
            <td className="py-1.5" style={{ color: "var(--vlc-text-primary)" }}>{action}</td>
            <td className="py-1.5" style={{ fontFamily: "var(--vlc-font-mono)", color: "var(--vlc-accent)" }}>{key}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CustomizationPrefs() {
  const vis = usePlayerStore((s) => s.uiVisibility);
  const density = usePlayerStore((s) => s.density);
  const chromePosition = usePlayerStore((s) => s.chromePosition);
  const customCSS = usePlayerStore((s) => s.customCSS);
  const set = usePlayerStore((s) => s.set);
  const pushOSD = usePlayerStore((s) => s.pushOSD);

  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showCss, setShowCss] = useState(false);

  const groups = Array.from(new Set(UI_REGISTRY.map((e) => e.group)));
  const q = query.trim().toLowerCase();
  const entriesByGroup = groups.map((g) => {
    const all = UI_REGISTRY.filter((e) => e.group === g);
    const filtered = q
      ? all.filter((e) => e.label.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
      : all;
    return { group: g, all, filtered };
  }).filter((g) => g.filtered.length > 0);

  const hiddenCount = UI_REGISTRY.filter((e) => vis[e.id] === false).length;

  const toggle = (id: string, on: boolean) =>
    set({ uiVisibility: { ...vis, [id]: on } });

  const setGroup = (group: string, on: boolean) => {
    const patch = { ...vis };
    UI_REGISTRY.filter((e) => e.group === group).forEach((e) => { patch[e.id] = on; });
    set({ uiVisibility: patch });
    pushOSD(`${group}: ${on ? "shown" : "hidden"}`);
  };

  const setAll = (on: boolean) => {
    const patch: Record<string, boolean> = {};
    UI_REGISTRY.forEach((e) => { patch[e.id] = on; });
    set({ uiVisibility: patch });
    pushOSD(on ? "All UI shown" : "All UI hidden");
  };

  const reset = () => { set({ uiVisibility: {} }); pushOSD("Visibility reset"); };

  const pill: CSSProperties = {
    background: "var(--vlc-bg-sunken)",
    color: "var(--vlc-text-primary)",
    border: "1px solid var(--vlc-border-normal)",
  };

  return (
    <div>
      {/* Quick controls — density, chrome position, totals */}
      <div className="mb-3 p-3 rounded" style={{ background: "var(--vlc-bg-sunken)", border: "1px solid var(--vlc-border-subtle)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px]" style={{ color: "var(--vlc-text-secondary)" }}>
            {UI_REGISTRY.length} elements
            <span style={{ color: "var(--vlc-text-ghost)" }}> · {hiddenCount} hidden</span>
          </span>
          <div className="flex gap-1.5">
            <button onClick={() => setAll(true)} className="text-[11px] px-2 py-0.5 rounded" style={pill}>Show all</button>
            <button onClick={() => setAll(false)} className="text-[11px] px-2 py-0.5 rounded" style={pill}>Hide all</button>
            <button onClick={reset} className="text-[11px] px-2 py-0.5 rounded" style={pill}>Reset</button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-[11.5px]" style={{ color: "var(--vlc-text-secondary)" }}>
            Density
            <select value={density} onChange={(e) => set({ density: e.target.value as "compact" | "cozy" | "comfortable" })} className="text-[11px] px-1.5 py-0.5 rounded" style={pill}>
              <option value="compact">Compact</option>
              <option value="cozy">Cozy</option>
              <option value="comfortable">Comfortable</option>
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[11.5px]" style={{ color: "var(--vlc-text-secondary)" }}>
            Chrome
            <select value={chromePosition} onChange={(e) => set({ chromePosition: e.target.value as "top" | "bottom" | "floating" })} className="text-[11px] px-1.5 py-0.5 rounded" style={pill}>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="floating">Floating</option>
            </select>
          </label>
          <input
            type="text"
            placeholder="Search elements…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-auto text-[11.5px] px-2 py-0.5 rounded w-44"
            style={pill}
          />
        </div>
      </div>

      {/* Element groups */}
      {entriesByGroup.length === 0 && (
        <p className="text-[11.5px] italic" style={{ color: "var(--vlc-text-ghost)" }}>No matches.</p>
      )}
      {entriesByGroup.map(({ group, all, filtered }) => {
        const isOpen = !collapsed[group];
        const groupHidden = all.filter((e) => vis[e.id] === false).length;
        const allOn = all.every((e) => vis[e.id] !== false);
        const allOff = all.every((e) => vis[e.id] === false);
        return (
          <div key={group} className="mb-3 rounded overflow-hidden" style={{ border: "1px solid var(--vlc-border-subtle)" }}>
            <div className="flex items-center gap-2 px-2 py-1.5" style={{ background: "var(--vlc-bg-sunken)" }}>
              <button onClick={() => setCollapsed((c) => ({ ...c, [group]: isOpen }))} className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: "var(--vlc-text-primary)" }}>
                {isOpen ? "▾" : "▸"} {group}
              </button>
              <span className="text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>
                {filtered.length}/{all.length}{groupHidden > 0 ? ` · ${groupHidden} hidden` : ""}
              </span>
              <div className="ml-auto flex gap-1">
                <button
                  onClick={() => setGroup(group, true)}
                  disabled={allOn}
                  className="text-[10.5px] px-1.5 py-0.5 rounded disabled:opacity-40"
                  style={pill}
                >Show</button>
                <button
                  onClick={() => setGroup(group, false)}
                  disabled={allOff}
                  className="text-[10.5px] px-1.5 py-0.5 rounded disabled:opacity-40"
                  style={pill}
                >Hide</button>
              </div>
            </div>
            {isOpen && (
              <div className="p-2">
                {filtered.map((e) => {
                  const on = isVisible(vis, e.id);
                  return (
                    <label key={e.id} className="flex items-center gap-2 py-1 cursor-pointer rounded px-1">
                      <input type="checkbox" checked={on} onChange={(ev) => toggle(e.id, ev.target.checked)} />
                      <span className="text-[12px] flex-1" style={{ color: on ? "var(--vlc-text-primary)" : "var(--vlc-text-ghost)", textDecoration: on ? "none" : "line-through" }}>{e.label}</span>
                      <button
                        onClick={(ev) => { ev.preventDefault(); navigator.clipboard?.writeText(e.id); pushOSD(`Copied ${e.id}`); }}
                        title="Copy element ID"
                        style={{ fontFamily: "var(--vlc-font-mono)", fontSize: 10, color: "var(--vlc-text-ghost)" }}
                      >{e.id}</button>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Custom CSS escape hatch */}
      <div className="mt-4 rounded overflow-hidden" style={{ border: "1px solid var(--vlc-border-subtle)" }}>
        <button
          onClick={() => setShowCss((v) => !v)}
          className="w-full flex items-center px-2 py-1.5 text-[11px] uppercase tracking-wide font-semibold"
          style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)" }}
        >
          {showCss ? "▾" : "▸"} Custom CSS
          <span className="ml-2 text-[10.5px] normal-case font-normal" style={{ color: "var(--vlc-text-ghost)" }}>
            Injected last · highest precedence
          </span>
          {customCSS.trim().length > 0 && (
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--vlc-accent-dim)", color: "var(--vlc-accent-text)" }}>active</span>
          )}
        </button>
        {showCss && (
          <div className="p-2">
            <textarea
              value={customCSS}
              onChange={(e) => set({ customCSS: e.target.value })}
              placeholder={"/* override anything */\n:root { --vlc-radius-lg: 18px; }\n[data-vlc-region=\"control-bar\"] { backdrop-filter: blur(20px); }"}
              rows={6}
              className="w-full text-[11px] p-2 rounded"
              style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)", fontFamily: "var(--vlc-font-mono)" }}
              spellCheck={false}
            />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10.5px]" style={{ color: "var(--vlc-text-ghost)" }}>
                {customCSS.length} chars · applies live
              </span>
              <button
                onClick={() => { set({ customCSS: "" }); pushOSD("Custom CSS cleared"); }}
                className="text-[10.5px] px-2 py-0.5 rounded"
                style={pill}
              >Clear</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
