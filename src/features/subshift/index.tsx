import { Panel, Row, Btn } from "../_shared/ui";
import { usePlayerStore } from "@/store/playerStore";

/** Shifts real TextTrack cue times through the shared sync state. */
export default function SubShift() {
  const sync = usePlayerStore((s) => s.sync);
  const set = usePlayerStore((s) => s.set);
  const ms = sync.subtitleDelay;
  const apply = (v: number) => set({ sync: { ...sync, subtitleDelay: Math.max(-5000, Math.min(5000, v)) } });
  return (
    <Panel>
      <Row><strong>Subtitle Shift</strong></Row>
      <Row>
        <Btn onClick={() => apply(ms - 500)}>−500</Btn>
        <Btn onClick={() => apply(ms - 100)}>−100</Btn>
        <Btn onClick={() => apply(0)}>0</Btn>
        <Btn onClick={() => apply(ms + 100)}>+100</Btn>
        <Btn onClick={() => apply(ms + 500)}>+500</Btn>
      </Row>
      <Row><span style={{ fontSize: 13 }}>Offset: <strong>{ms} ms</strong></span></Row>
      <Row><span style={{ fontSize: 11, opacity: 0.7 }}>Positive = subtitles appear later. Applies to every loaded subtitle track.</span></Row>
    </Panel>
  );
}
