import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, NoMedia } from "../_shared/media";
import { usePlayerStore } from "@/store/playerStore";

/** Routed through the shared filter state so the Effects panel can't overwrite it. */
export default function ColorGrade() {
  const m = useMedia() as HTMLVideoElement | null;
  const filters = usePlayerStore((st) => st.filters);
  const setStore = usePlayerStore((st) => st.set);
  const patch = (p: Partial<typeof filters>) => setStore({ filters: { ...filters, enabled: true, ...p } });
  const b = Math.round(filters.brightness * 100);
  const c = Math.round(filters.contrast * 100);
  const s = Math.round(filters.saturation * 100);
  const h = filters.hue;
  const setB = (v: number) => patch({ brightness: v / 100 });
  const setC = (v: number) => patch({ contrast: v / 100 });
  const setS = (v: number) => patch({ saturation: v / 100 });
  const setH = (v: number) => patch({ hue: v });
  if (!m) return <NoMedia />;
  const reset = () => patch({ brightness: 1, contrast: 1, saturation: 1, hue: 0 });
  const row = (label: string, val: number, set: (v: number) => void, min: number, max: number, unit: string) => (
    <Row><span style={{ width: 80 }}>{label}</span>
      <input type="range" min={min} max={max} value={val} onChange={(e) => set(+e.target.value)} style={{ flex: 1 }} />
      <span style={{ width: 50, textAlign: "right" }}>{val}{unit}</span></Row>
  );
  return (
    <Panel>
      <Row><strong>Color Grade</strong></Row>
      {row("Brightness", b, setB, 0, 200, "%")}
      {row("Contrast", c, setC, 0, 200, "%")}
      {row("Saturation", s, setS, 0, 300, "%")}
      {row("Hue", h, setH, 0, 360, "°")}
      <Row><Btn onClick={reset}>Reset</Btn></Row>
    </Panel>
  );
}
