import { Panel, Row, Btn } from "../_shared/ui";
import { usePlayerStore } from "@/store/playerStore";

/**
 * Drives the real DelayNode in the shared audio graph (see useAVSync).
 * Only positive delay exists: audio cannot be pulled ahead of a live element.
 */
export default function AudioDelay() {
  const sync = usePlayerStore((s) => s.sync);
  const set = usePlayerStore((s) => s.set);
  const ms = sync.audioDelay;
  const apply = (v: number) => set({ sync: { ...sync, audioDelay: Math.max(0, Math.min(5000, Math.round(v))) } });
  return (
    <Panel>
      <Row><strong>Audio Delay</strong></Row>
      <Row>
        <input type="range" min={0} max={5000} step={10} value={ms} onChange={(e) => apply(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ minWidth: 70, textAlign: "right" }}>{ms} ms</span>
      </Row>
      <Row>
        <Btn onClick={() => apply(0)}>Reset</Btn>
        <Btn onClick={() => apply(ms - 40)}>−40</Btn>
        <Btn onClick={() => apply(ms + 40)}>+40</Btn>
      </Row>
      <Row><span style={{ fontSize: 11, opacity: 0.7 }}>Delays audio behind video. Shared with Effects → Synchronization.</span></Row>
    </Panel>
  );
}
