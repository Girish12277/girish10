import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, NoMedia } from "../_shared/media";
import { usePlayerStore } from "@/store/playerStore";

const ROT = [0, 90, 180, 270];

/** Routed through the shared filter state so renders can't revert it. */
export default function VideoRotate() {
  const m = useMedia() as HTMLVideoElement | null;
  const filters = usePlayerStore((s) => s.filters);
  const set = usePlayerStore((s) => s.set);
  const r = ((filters.rotate % 360) + 360) % 360;
  const flip = filters.flipH;
  if (!m) return <NoMedia />;
  const apply = (deg: number, fl: boolean) => set({ filters: { ...filters, enabled: true, rotate: deg, flipH: fl } });
  return (
    <Panel>
      <Row><strong>Rotate / Mirror</strong></Row>
      <Row>{ROT.map((d) => <Btn key={d} active={r === d} onClick={() => apply(d, flip)}>{d}°</Btn>)}</Row>
      <Row><Btn active={flip} onClick={() => apply(r, !flip)}>Mirror flip</Btn></Row>
    </Panel>
  );
}
