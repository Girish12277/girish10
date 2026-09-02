/**
 * Shared subtitle plumbing.
 *
 * Both the drag-and-drop path (AppLayout) and the "Subtitle → Add Subtitle
 * File..." menu entry go through `attachSubtitleFile`, so there is exactly one
 * implementation of SRT→VTT conversion and <track> injection.
 */

/** Original, un-shifted cue times, so subtitle delay stays idempotent. */
const baseTimes = new WeakMap<TextTrackCue, { start: number; end: number }>();

export function srtToVtt(text: string): string {
  return (
    "WEBVTT\n\n" +
    text.replace(/\r+/g, "").replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")
  );
}

export async function attachSubtitleFile(video: HTMLVideoElement, file: File): Promise<string> {
  const name = file.name;
  const isSrt = /\.srt$/i.test(name);
  const url = isSrt
    ? URL.createObjectURL(new Blob([srtToVtt(await file.text())], { type: "text/vtt" }))
    : URL.createObjectURL(file);

  const label = name.replace(/\.(srt|vtt)$/i, "");
  const track = document.createElement("track");
  track.kind = "subtitles";
  track.label = label;
  track.srclang = "en";
  track.src = url;
  track.default = true;
  track.setAttribute("data-vlc-sub", "1");
  video.appendChild(track);

  track.addEventListener(
    "load",
    () => {
      for (let i = 0; i < video.textTracks.length; i++) {
        const t = video.textTracks[i];
        t.mode = t.label === label ? "showing" : "disabled";
      }
    },
    { once: true },
  );
  return label;
}

/**
 * Shift every cue of every text track by `ms` relative to its original time.
 * Positive = subtitles appear later. Re-applying with a new value is exact
 * because the untouched base times are cached per cue.
 */
export function applySubtitleDelay(video: HTMLVideoElement | null, ms: number) {
  if (!video) return;
  const offset = ms / 1000;
  for (let i = 0; i < video.textTracks.length; i++) {
    const track = video.textTracks[i];
    // Cues are only populated once the track has been loaded at least once.
    const wasHidden = track.mode === "disabled";
    if (wasHidden) track.mode = "hidden";
    const cues = track.cues;
    if (!cues) { if (wasHidden) track.mode = "disabled"; continue; }
    for (let c = 0; c < cues.length; c++) {
      const cue = cues[c];
      let base = baseTimes.get(cue);
      if (!base) { base = { start: cue.startTime, end: cue.endTime }; baseTimes.set(cue, base); }
      const start = Math.max(0, base.start + offset);
      const end = Math.max(start + 0.01, base.end + offset);
      cue.startTime = start;
      cue.endTime = end;
    }
    if (wasHidden) track.mode = "disabled";
  }
}