# Mock-Feature Audit — verified findings and fix plan

I audited the audio graph, menus, panels and the mini-app registry against the actual code. Below is only what I confirmed by reading the source.

## Confirmed dead / fake (evidence)

**1. Menu track selectors are hardcoded strings — no handlers at all.**
`MenuBar.tsx:92-93` ships `Audio Track → [{label:"Track 1 - English", checked:true}]` and `Audio Device → [{label:"Default", checked:true}]`. Same at `:111` (`Video Track → "Track 1"`) and `:125` (`Subtitle Track → "Disabled"`). None have an `onSelect`. They are decoration.

**2. "Add Subtitle File..." is `disabled: true` (`MenuBar.tsx:126`) — even though real subtitle loading already exists.**
`AppLayout.tsx:60-85` fully implements SRT→VTT conversion, `<track>` injection and `mode="showing"`. The working code is only reachable by drag-and-drop; the menu entry that should call it is greyed out.

**3. Audio delay and subtitle delay do nothing.**
`sync.audioDelay` / `sync.subtitleDelay` are written by keyboard shortcuts (`useKeyboardShortcuts.ts:107-110`), the menu (`MenuBar.tsx:99-100,128-129`) and the Effects panel (`EffectsPanel.tsx:120-121`), and are read by **nothing**. Grep across `src/` finds zero consumers outside those writers. The OSD reports a change that never reaches the media pipeline.

**4. Four mini-apps dispatch CustomEvents that have no listener anywhere.**
Dispatched but never handled: `vlc-eq-bands` (`features/eq`), `vlc-audio-delay` (`features/audiodelay`), `vlc-sub-shift` (`features/subshift`), `vlc-karaoke` (`features/karaoke`). Each app's own comment admits it ("Emits `vlc-audio-delay` for the audio pipeline"). Every slider in those four panels is a no-op.

**5. Codec Information panel fabricates data.**
`CodecInfoPanel.tsx` hardcodes `Sample rate: 48000 Hz`, `Channels: 2 (stereo)`, and derives Codec as `"H.264 / AAC (likely)"` from the file extension. Nothing is read from the actual media element or AudioContext.

**6. The Gamma slider is a no-op.**
`filters.gamma` is stored and exposed in the Effects panel, but `VideoCanvas.tsx:94-95` builds `filterStyle` from hue/saturation/contrast/brightness only. Gamma is never applied.

**7. Direct-DOM mini-apps fight the store and get silently reverted.**
`features/colorgrade`, `features/videorotate`, `features/aspectcrop` write `m.style.filter` / `m.style.transform` / `m.style.objectFit` directly on the `<video>`. `VideoCanvas.tsx:122` sets `filter` and `transform` inline from store state on every render, so any store update wipes those apps' effect. They appear to work, then randomly stop.

**8. Menu items permanently disabled with no path forward:** Open Disc, Save/Convert, Always on Top (`MenuBar.tsx:59,64,121`).                                                                                                                            9. I LIKE TO PLAY MUSIC WHILE STUDYING SO CAN YOU MAKE A SYSTEM WHERE I CAN USE VEDIO OR MP3 FOR BACKROUND MUSIC COME AS POPUP ADD THAT TO TOP MENU BAR + THAT SHOULD BE CUSTMAZIABLE IN GOD MODE SETTING LIKE IF I WNATED TO HIDE OR SHOW THAT ICON I CAN AND FIX ALL ROOT CAUSE OF THE PROBLEM 

## Confirmed genuinely working (not mock)

EQ + compressor via `AudioGraph` and the Effects panel (`EffectsPanel.tsx:75-77` wires bands, preamp, compressor to real BiquadFilter/DynamicsCompressor nodes); screenshot/frameburst canvas capture; A-B repeat, loop section, bookmarks, speed ramp, subloader parsing; visualizer/vumeter/oscilloscope analysers off the shared graph.                             

---

## Fix plan

### Phase 1 — Make the track menus real

- New `src/hooks/useMediaTracks.ts`: subscribe to `video.textTracks` `addtrack`/`removetrack`/`change`, plus `video.audioTracks`/`videoTracks` where the browser exposes them.
- `MenuBar.tsx`: build Subtitle Track from live `textTracks` (Disabled + one entry per track, `checked` from `mode === "showing"`, `onSelect` sets modes). Audio/Video Track render real entries when the browser exposes the track lists, and otherwise show a single disabled "Not exposed by this browser" row instead of a fake "Track 1 - English".
- Enable "Add Subtitle File..."; wire it to a hidden `.srt,.vtt` input that calls the existing `attachSubtitle` path (lift it out of `AppLayout` into `src/utils/subtitles.ts` so both callers share it).
- Audio Device: use `navigator.mediaDevices.enumerateDevices()` + `setSinkId` when supported; disabled row with reason when not.

### Phase 2 — Make the delays real

- Subtitle delay: apply `sync.subtitleDelay` by shifting cue `startTime`/`endTime` on the active TextTrack (store original offsets so it stays idempotent). This is exact and cheap.
- Audio delay: implement via a `DelayNode` inserted in `AudioGraph` between source and destination (positive delay only, up to 5s); negative delay is not physically possible on a live element, so clamp the UI to 0…+5000ms and say so in the label rather than pretending.
- Update the Effects panel slider range and the K/J shortcuts to match the real capability.

### Phase 3 — Kill or connect the four dead mini-apps

- `features/eq` → delete its private state and drive `usePlayerStore` EQ bands, so it controls the same real graph the Effects panel does.
- `features/audiodelay` → drive `sync.audioDelay` (now real after Phase 2).
- `features/subshift` → drive `sync.subtitleDelay`.
- `features/karaoke` → implement as a real vocal-cut: mid/side cancellation via `ChannelSplitter` + inverted merge in `AudioGraph`, exposed as `karaokeMode` in the store. If the source is mono, disable the control with an explanation.
- Remove the four orphan `CustomEvent` dispatches entirely.

### Phase 4 — Honest Codec Info

- Read real values: `videoWidth/Height`, `duration`, `currentSrc`, `readyState`, `buffered`, `audioGraph.ctx.sampleRate`, `videoTracks`/`audioTracks` when present, and `VideoPlaybackQuality` from `getVideoPlaybackQuality()` (dropped/total frames).
- Estimate bitrate from `Blob.size / duration` for local files; show "—" instead of guessing a codec name. No more "(likely)".

### Phase 5 — Remove the store/DOM conflict and the gamma lie

- Add gamma to `VideoCanvas` `filterStyle` via an SVG `feComponentTransfer` filter (CSS has no gamma primitive) — or, if that proves heavy, remove the slider rather than ship a dead control.
- Route `colorgrade`, `videorotate`, `aspectcrop` through `usePlayerStore().filters` / `aspectRatio` instead of inline styles, so they compose with the Effects panel instead of being overwritten.
- Delete the permanently-disabled Open Disc / Save-Convert / Always on Top entries; a browser cannot do them.

### Verification

- Playwright: load a local clip + SRT, assert Subtitle Track menu lists the real track and toggling it flips `textTrack.mode`.
- Assert `sync.subtitleDelay = 1000` moves the rendered cue by exactly 1s.
- Assert the EQ mini-app and the Effects panel report the same band values after either is changed.
- Assert Codec Info sample rate equals `audioGraph.ctx.sampleRate` rather than the constant 48000.
- `bun run build` + typecheck clean.