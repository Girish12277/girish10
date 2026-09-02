// Web Audio graph:
//   source -> [10x peaking biquads -> preamp] -> [karaoke mid-cancel] -> [compressor] -> [delay] -> destination
// Every stage is optional; connect() rebuilds the chain from the requested options.

const EQ_FREQS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export interface GraphOptions {
  eq: boolean;
  comp: boolean;
  karaoke: boolean;
  /** Positive audio delay in seconds (0..5). Negative delay is physically impossible on a live element. */
  delay: number;
}

export class AudioGraph {
  ctx: AudioContext | null = null;
  source: MediaElementAudioSourceNode | null = null;
  filters: BiquadFilterNode[] = [];
  preamp: GainNode | null = null;
  compressor: DynamicsCompressorNode | null = null;
  bypass: GainNode | null = null;
  delayNode: DelayNode | null = null;
  splitter: ChannelSplitterNode | null = null;
  merger: ChannelMergerNode | null = null;
  invert: GainNode | null = null;
  karaokeIn: GainNode | null = null;
  attached = false;
  videoEl: HTMLVideoElement | null = null;
  private opts: GraphOptions = { eq: false, comp: false, karaoke: false, delay: 0 };

  attach(video: HTMLVideoElement) {
    if (this.attached && this.videoEl === video) return;
    this.detach();
    try {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.source = this.ctx.createMediaElementSource(video);
      this.preamp = this.ctx.createGain();
      this.preamp.gain.value = 1;
      this.compressor = this.ctx.createDynamicsCompressor();
      this.bypass = this.ctx.createGain();
      this.delayNode = this.ctx.createDelay(5);
      this.delayNode.delayTime.value = 0;
      // Karaoke (centre-channel cancel): L-R on both outputs.
      this.karaokeIn = this.ctx.createGain();
      this.splitter = this.ctx.createChannelSplitter(2);
      this.merger = this.ctx.createChannelMerger(2);
      this.invert = this.ctx.createGain();
      this.invert.gain.value = -1;
      this.filters = EQ_FREQS.map((f) => {
        const bq = this.ctx!.createBiquadFilter();
        bq.type = "peaking";
        bq.frequency.value = f;
        bq.Q.value = 1.0;
        bq.gain.value = 0;
        return bq;
      });
      this.videoEl = video;
      this.attached = true;
      this.connect(this.opts);
    } catch (e) {
      console.warn("AudioGraph attach failed", e);
    }
  }

  connect(options: Partial<GraphOptions>) {
    this.opts = { ...this.opts, ...options };
    const { eq: eqEnabled, comp: compEnabled, karaoke, delay } = this.opts;
    if (!this.ctx || !this.source) return;
    try { this.source.disconnect(); } catch {/*noop*/}
    this.filters.forEach((f) => { try { f.disconnect(); } catch {/*noop*/} });
    try { this.preamp?.disconnect(); } catch {/*noop*/}
    try { this.compressor?.disconnect(); } catch {/*noop*/}
    try { this.delayNode?.disconnect(); } catch {/*noop*/}
    try { this.karaokeIn?.disconnect(); } catch {/*noop*/}
    try { this.splitter?.disconnect(); } catch {/*noop*/}
    try { this.invert?.disconnect(); } catch {/*noop*/}
    try { this.merger?.disconnect(); } catch {/*noop*/}

    let node: AudioNode = this.source;
    if (eqEnabled) {
      this.filters.forEach((f) => { node.connect(f); node = f; });
      if (this.preamp) { node.connect(this.preamp); node = this.preamp; }
    }
    if (karaoke && this.karaokeIn && this.splitter && this.merger && this.invert) {
      node.connect(this.karaokeIn);
      this.karaokeIn.connect(this.splitter);
      this.splitter.connect(this.merger, 0, 0);
      this.splitter.connect(this.invert, 1);
      this.invert.connect(this.merger, 0, 0);
      this.splitter.connect(this.merger, 0, 1);
      this.invert.connect(this.merger, 0, 1);
      node = this.merger;
    }
    if (compEnabled && this.compressor) { node.connect(this.compressor); node = this.compressor; }
    if (this.delayNode) {
      this.delayNode.delayTime.value = Math.max(0, Math.min(5, delay));
      node.connect(this.delayNode); node = this.delayNode;
    }
    node.connect(this.ctx.destination);
  }

  /** Positive audio delay in milliseconds (0..5000). */
  setDelayMs(ms: number) {
    const secs = Math.max(0, Math.min(5, ms / 1000));
    this.opts.delay = secs;
    if (this.delayNode) this.delayNode.delayTime.value = secs;
  }

  setKaraoke(on: boolean) {
    if (this.opts.karaoke === on) return;
    this.connect({ karaoke: on });
  }

  /** True when the currently attached element decodes more than one channel. */
  isStereo(): boolean {
    return (this.source?.channelCount ?? 2) > 1;
  }

  setBands(bands: number[]) {
    this.filters.forEach((f, i) => { if (bands[i] !== undefined) f.gain.value = bands[i]; });
  }
  setPreamp(db: number) {
    if (this.preamp) this.preamp.gain.value = Math.pow(10, db / 20);
  }
  setCompressor(c: { threshold: number; knee: number; ratio: number; attack: number; release: number }) {
    if (!this.compressor) return;
    this.compressor.threshold.value = c.threshold;
    this.compressor.knee.value = c.knee;
    this.compressor.ratio.value = c.ratio;
    this.compressor.attack.value = c.attack;
    this.compressor.release.value = c.release;
  }
  resume() { this.ctx?.resume().catch(() => undefined); }

  detach() {
    try { this.source?.disconnect(); } catch {/*noop*/}
    this.filters.forEach((f) => { try { f.disconnect(); } catch {/*noop*/} });
    try { this.preamp?.disconnect(); } catch {/*noop*/}
    try { this.compressor?.disconnect(); } catch {/*noop*/}
    try { this.delayNode?.disconnect(); } catch {/*noop*/}
    try { this.karaokeIn?.disconnect(); } catch {/*noop*/}
    try { this.ctx?.close(); } catch {/*noop*/}
    this.ctx = null; this.source = null; this.filters = []; this.preamp = null; this.compressor = null;
    this.delayNode = null; this.karaokeIn = null; this.splitter = null; this.merger = null; this.invert = null;
    this.attached = false; this.videoEl = null;
  }
}

export const audioGraph = new AudioGraph();
export { EQ_FREQS };
