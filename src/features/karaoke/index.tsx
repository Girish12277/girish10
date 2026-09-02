import { Panel, Row, Btn } from "../_shared/ui";
import { usePlayerStore } from "@/store/playerStore";
import { audioGraph } from "@/audio/AudioGraph";
import { useMedia, NoMedia } from "../_shared/media";

/**
 * Real centre-channel cancellation (L−R on both outputs) in the shared audio
 * graph. Cancellation is binary by nature — there is no partial "amount"
 * that stays honest — so the control is a switch, not a fake slider.
 */
export default function Karaoke() {
  const m = useMedia();
  const on = usePlayerStore((s) => s.karaoke);
  const set = usePlayerStore((s) => s.set);
  if (!m) return <NoMedia />;
  const attached = audioGraph.attached;
  return (
    <Panel>
      <Row><strong>Karaoke (Vocal Reduction)</strong></Row>
      <Row>
        <Btn active={on} disabled={!attached} onClick={() => set({ karaoke: !on })}>{on ? "On" : "Off"}</Btn>
      </Row>
      <Row>
        <span style={{ fontSize: 11, opacity: 0.7 }}>
          {attached
            ? "Cancels anything panned dead-centre (usually lead vocals). Mono sources cancel to silence, so this only helps on stereo mixes."
            : "Start playback once so the audio graph attaches, then reopen this tool."}
        </span>
      </Row>
    </Panel>
  );
}
