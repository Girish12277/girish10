import { useEffect } from "react";
import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, NoMedia } from "../_shared/media";
import { usePlayerStore, EQ_PRESETS } from "@/store/playerStore";
import { audioGraph, EQ_FREQS as BANDS } from "@/audio/AudioGraph";

/** Drives the same BiquadFilter chain as Effects → Audio Effects. */
export default function EQ() {
  const m = useMedia();
  const eq = usePlayerStore((s) => s.eq);
  const comp = usePlayerStore((s) => s.comp);
  const set = usePlayerStore((s) => s.set);
  const setEQBand = usePlayerStore((s) => s.setEQBand);
  const setEQPreset = usePlayerStore((s) => s.setEQPreset);
  const bands = eq.bands;

  useEffect(() => { audioGraph.connect({ eq: eq.enabled, comp: comp.enabled }); }, [eq.enabled, comp.enabled]);
  useEffect(() => { audioGraph.setBands(eq.bands); }, [eq.bands]);

  if (!m) return <NoMedia />;
  return (
    <Panel>
      <Row><strong>10-Band EQ</strong></Row>
      <Row>
        <Btn active={eq.enabled} onClick={() => set({ eq: { ...eq, enabled: !eq.enabled } })}>{eq.enabled ? "Enabled" : "Bypassed"}</Btn>
      </Row>
      <Row>{Object.keys(EQ_PRESETS).map((k) => <Btn key={k} active={eq.preset === k} onClick={() => setEQPreset(k)}>{k}</Btn>)}</Row>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${BANDS.length}, 1fr)`, gap: 4, marginTop: 8 }}>
        {BANDS.map((f, i) => (
          <div key={f} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <input type="range" min={-20} max={20} step={0.5} value={bands[i] ?? 0}
                   onChange={(e) => setEQBand(i, +e.target.value)}
                   style={{ writingMode: "vertical-lr" as const, height: 100, direction: "rtl" }} />
            <span style={{ fontSize: 10 }}>{f < 1000 ? f : `${f/1000}k`}</span>
            <span style={{ fontSize: 10, opacity: 0.6 }}>{(bands[i] ?? 0).toFixed(1)}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
