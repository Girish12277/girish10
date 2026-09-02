import { Panel, Row, Btn } from "../_shared/ui";
import { useMedia, NoMedia } from "../_shared/media";
import { usePlayerStore } from "@/store/playerStore";
import type { AspectRatio } from "@/types/player.types";

const RATIOS: Record<string, AspectRatio> = {
  "Native": "default", "16:9": "16:9", "16:10": "16:10", "4:3": "4:3", "1:1": "1:1", "2.35:1": "2.35:1",
};

/** Routed through the shared aspectRatio state used by VideoCanvas. */
export default function AspectCrop() {
  const m = useMedia() as HTMLVideoElement | null;
  const aspectRatio = usePlayerStore((s) => s.aspectRatio);
  const set = usePlayerStore((s) => s.set);
  const a = Object.keys(RATIOS).find((k) => RATIOS[k] === aspectRatio) ?? "Native";
  if (!m) return <NoMedia />;
  const apply = (name: string) => set({ aspectRatio: RATIOS[name] });
  return (
    <Panel>
      <Row><strong>Aspect Ratio</strong></Row>
      <Row>{Object.keys(RATIOS).map((k) => <Btn key={k} active={a === k} onClick={() => apply(k)}>{k}</Btn>)}</Row>
    </Panel>
  );
}
