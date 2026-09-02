import { useState } from "react";
import { FloatingPanel } from "./FloatingPanel";
import { usePlayerStore, EQ_PRESETS } from "@/store/playerStore";
import { audioGraph, EQ_FREQS } from "@/audio/AudioGraph";
import { useEffect } from "react";

export function EffectsPanel() {
  const open = usePlayerStore((s) => s.effectsOpen);
  const set = usePlayerStore((s) => s.set);
  const [tab, setTab] = useState("video");
  if (!open) return null;
  return (
    <FloatingPanel title="Adjustments and Effects" onClose={() => set({ effectsOpen: false })} width={360}>
      <div className="flex" style={{ borderBottom: "1px solid var(--vlc-border-subtle)" }}>
        {[["video","Video Effects"],["audio","Audio Effects"],["sync","Synchronization"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} className="flex-1 text-[12px] py-2" style={{ color: tab === k ? "var(--vlc-text-primary)" : "var(--vlc-text-secondary)", borderBottom: tab === k ? "2px solid var(--vlc-accent)" : "2px solid transparent" }}>{l}</button>
        ))}
      </div>
      <div className="p-4">
        {tab === "video" && <VideoTab />}
        {tab === "audio" && <AudioTab />}
        {tab === "sync" && <SyncTab />}
      </div>
    </FloatingPanel>
  );
}

function Slider({ label, value, min, max, step, onChange, suffix }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px]" style={{ color: "var(--vlc-text-secondary)" }}>{label}</span>
        <span className="text-[11px]" style={{ fontFamily: "var(--vlc-font-mono)", color: "var(--vlc-text-primary)" }}>{value.toFixed(2)}{suffix ?? ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="vlc-slider w-full" style={{ accentColor: "var(--vlc-accent)" }} />
    </div>
  );
}

function VideoTab() {
  const filters = usePlayerStore((s) => s.filters);
  const set = usePlayerStore((s) => s.set);
  const update = (p: Partial<typeof filters>) => set({ filters: { ...filters, ...p } });
  return (
    <div>
      <label className="flex items-center gap-2 mb-3 text-[12px]" style={{ color: "var(--vlc-text-primary)" }}>
        <input type="checkbox" checked={filters.enabled} onChange={(e) => update({ enabled: e.target.checked })} />
        Enable image adjustments
      </label>
      <Slider label="Hue" value={filters.hue} min={-180} max={180} step={1} onChange={(v) => update({ hue: v })} suffix="°" />
      <Slider label="Saturation" value={filters.saturation} min={0} max={3} step={0.01} onChange={(v) => update({ saturation: v })} />
      <Slider label="Contrast" value={filters.contrast} min={0} max={2} step={0.01} onChange={(v) => update({ contrast: v })} />
      <Slider label="Brightness" value={filters.brightness} min={0} max={2} step={0.01} onChange={(v) => update({ brightness: v })} />
      <Slider label="Gamma" value={filters.gamma} min={0.01} max={10} step={0.01} onChange={(v) => update({ gamma: v })} />
      <div style={{ height: 1, background: "var(--vlc-border-subtle)", margin: "12px 0" }} />
      <Slider label="Rotate" value={filters.rotate} min={-180} max={180} step={1} onChange={(v) => update({ rotate: v })} suffix="°" />
      <Slider label="Zoom" value={filters.zoom} min={10} max={500} step={1} onChange={(v) => update({ zoom: v })} suffix="%" />
      <div className="flex gap-3 mt-2">
        <label className="flex items-center gap-1 text-[12px]" style={{ color: "var(--vlc-text-secondary)" }}><input type="checkbox" checked={filters.flipH} onChange={(e) => update({ flipH: e.target.checked })} /> Flip H</label>
        <label className="flex items-center gap-1 text-[12px]" style={{ color: "var(--vlc-text-secondary)" }}><input type="checkbox" checked={filters.flipV} onChange={(e) => update({ flipV: e.target.checked })} /> Flip V</label>
      </div>
      <button onClick={() => set({ filters: { enabled: false, hue: 0, saturation: 1, contrast: 1, brightness: 1, gamma: 1, rotate: 0, zoom: 100, flipH: false, flipV: false } })} className="mt-3 text-[12px]" style={{ color: "var(--vlc-accent)" }}>Reset all</button>
    </div>
  );
}

function AudioTab() {
  const eq = usePlayerStore((s) => s.eq);
  const comp = usePlayerStore((s) => s.comp);
  const set = usePlayerStore((s) => s.set);
  const setEQBand = usePlayerStore((s) => s.setEQBand);
  const setEQPreset = usePlayerStore((s) => s.setEQPreset);

  // Apply EQ + compressor to graph
  useEffect(() => { audioGraph.connect({ eq: eq.enabled, comp: comp.enabled }); }, [eq.enabled, comp.enabled]);
  useEffect(() => { audioGraph.setBands(eq.bands); }, [eq.bands]);
  useEffect(() => { audioGraph.setPreamp(eq.preamp); }, [eq.preamp]);
  useEffect(() => { audioGraph.setCompressor(comp); }, [comp]);

  return (
    <div>
      <label className="flex items-center gap-2 mb-3 text-[12px]" style={{ color: "var(--vlc-text-primary)" }}>
        <input type="checkbox" checked={eq.enabled} onChange={(e) => set({ eq: { ...eq, enabled: e.target.checked } })} /> Enable Equalizer
      </label>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px]" style={{ color: "var(--vlc-text-secondary)" }}>Preset:</span>
        <select value={eq.preset} onChange={(e) => setEQPreset(e.target.value)} className="text-[12px] px-2 py-1 rounded" style={{ background: "var(--vlc-bg-sunken)", color: "var(--vlc-text-primary)", border: "1px solid var(--vlc-border-normal)" }}>
          {Object.keys(EQ_PRESETS).map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <Slider label="Preamp" value={eq.preamp} min={-20} max={20} step={0.5} onChange={(v) => set({ eq: { ...eq, preamp: v } })} suffix=" dB" />
      <div className="flex justify-between gap-1 mt-2 mb-2">
        {EQ_FREQS.map((f, i) => (
          <div key={f} className="flex flex-col items-center" style={{ width: 26 }}>
            <span style={{ fontFamily: "var(--vlc-font-mono)", fontSize: 9, color: "var(--vlc-text-primary)" }}>{eq.bands[i]?.toFixed(0)}</span>
            <input type="range" min={-20} max={20} step={0.5} value={eq.bands[i] ?? 0}
              onChange={(e) => setEQBand(i, parseFloat(e.target.value))}
              className="vlc-eq" style={{ accentColor: "var(--vlc-accent)" }} />
            <span style={{ fontFamily: "var(--vlc-font-mono)", fontSize: 9, color: "var(--vlc-text-ghost)", marginTop: 2 }}>{f >= 1000 ? `${f/1000}k` : f}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "var(--vlc-border-subtle)", margin: "12px 0" }} />
      <label className="flex items-center gap-2 mb-3 text-[12px]" style={{ color: "var(--vlc-text-primary)" }}>
        <input type="checkbox" checked={comp.enabled} onChange={(e) => set({ comp: { ...comp, enabled: e.target.checked } })} /> Enable Compressor
      </label>
      <Slider label="Threshold" value={comp.threshold} min={-60} max={0} step={1} onChange={(v) => set({ comp: { ...comp, threshold: v } })} suffix=" dB" />
      <Slider label="Ratio" value={comp.ratio} min={1} max={20} step={0.5} onChange={(v) => set({ comp: { ...comp, ratio: v } })} />
      <Slider label="Attack" value={comp.attack} min={0.001} max={1} step={0.001} onChange={(v) => set({ comp: { ...comp, attack: v } })} suffix="s" />
      <Slider label="Release" value={comp.release} min={0.001} max={1} step={0.001} onChange={(v) => set({ comp: { ...comp, release: v } })} suffix="s" />
    </div>
  );
}

function SyncTab() {
  const sync = usePlayerStore((s) => s.sync);
  const karaoke = usePlayerStore((s) => s.karaoke);
  const set = usePlayerStore((s) => s.set);
  return (
    <div>
      <Slider label="Audio delay (audio behind video)" value={sync.audioDelay} min={0} max={5000} step={50} onChange={(v) => set({ sync: { ...sync, audioDelay: v } })} suffix=" ms" />
      <Slider label="Subtitle delay" value={sync.subtitleDelay} min={-5000} max={5000} step={50} onChange={(v) => set({ sync: { ...sync, subtitleDelay: v } })} suffix=" ms" />
      <label className="flex items-center gap-2 mt-3 text-[12px]" style={{ color: "var(--vlc-text-primary)" }}>
        <input type="checkbox" checked={karaoke} onChange={(e) => set({ karaoke: e.target.checked })} /> Karaoke — cancel centre vocals
      </label>
      <div className="text-[11px] mt-3" style={{ color: "var(--vlc-text-ghost)" }}>
        Audio can only be delayed, never advanced — the browser plays a live element. Subtitle delay shifts real cue times both ways.
      </div>
    </div>
  );
}
