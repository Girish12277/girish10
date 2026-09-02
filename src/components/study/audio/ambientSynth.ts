/**
 * Web Audio API Procedural Ambient Sound Generator for Study Hub Pro.
 * Zero external MP3 files — generates Rain, Waves, Coffee Shop noise, and 40Hz Binaural Beats in real time.
 */

export type AmbientSoundType = "rain" | "waves" | "binaural" | "coffee";

interface SoundTrack {
  type: AmbientSoundType;
  volume: number;
  active: boolean;
  nodes?: {
    sources: (AudioBufferSourceNode | OscillatorNode)[];
    gain: GainNode;
  };
}

class AmbientSynthEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private tracks: Map<AmbientSoundType, SoundTrack> = new Map([
    ["rain", { type: "rain", volume: 0.5, active: false }],
    ["waves", { type: "waves", volume: 0.4, active: false }],
    ["binaural", { type: "binaural", volume: 0.3, active: false }],
    ["coffee", { type: "coffee", volume: 0.4, active: false }],
  ]);

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.8;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => undefined);
    }
  }

  /** Toggle track on/off */
  public toggleTrack(type: AmbientSoundType, active: boolean) {
    const track = this.tracks.get(type);
    if (!track) return;
    track.active = active;

    if (active) {
      this.startTrack(type);
    } else {
      this.stopTrack(type);
    }
  }

  /** Set track volume (0..1) */
  public setVolume(type: AmbientSoundType, volume: number) {
    const track = this.tracks.get(type);
    if (!track) return;
    track.volume = Math.max(0, Math.min(1, volume));
    if (track.nodes?.gain && this.ctx) {
      track.nodes.gain.gain.setValueAtTime(track.volume, this.ctx.currentTime);
    }
  }

  public getTrackState(type: AmbientSoundType) {
    return this.tracks.get(type);
  }

  private startTrack(type: AmbientSoundType) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.stopTrack(type); // Ensure clean state
    const track = this.tracks.get(type);
    if (!track) return;

    const trackGain = this.ctx.createGain();
    trackGain.gain.setValueAtTime(track.volume, this.ctx.currentTime);
    trackGain.connect(this.masterGain);

    if (type === "rain") {
      // Pink/White noise generator filtered for rain effect
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;

      whiteNoise.connect(filter);
      filter.connect(trackGain);
      whiteNoise.start();

      track.nodes = { sources: [whiteNoise], gain: trackGain };
    } else if (type === "binaural") {
      // 40Hz Beta/Gamma binaural beat generator (left 200Hz, right 240Hz)
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      oscL.frequency.value = 200;
      oscR.frequency.value = 240;

      const merger = this.ctx.createChannelMerger(2);
      oscL.connect(merger, 0, 0); // left channel
      oscR.connect(merger, 0, 1); // right channel
      merger.connect(trackGain);

      oscL.start();
      oscR.start();

      track.nodes = { sources: [oscL, oscR], gain: trackGain };
    } else if (type === "waves") {
      // Low frequency wave sweep
      const bufferSize = this.ctx.sampleRate * 3;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 350;

      noise.connect(filter);
      filter.connect(trackGain);
      noise.start();

      track.nodes = { sources: [noise], gain: trackGain };
    } else if (type === "coffee") {
      // Warm mid-frequency room noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      filter.Q.value = 1.2;

      noise.connect(filter);
      filter.connect(trackGain);
      noise.start();

      track.nodes = { sources: [noise], gain: trackGain };
    }
  }

  private stopTrack(type: AmbientSoundType) {
    const track = this.tracks.get(type);
    if (!track || !track.nodes) return;

    try {
      track.nodes.sources.forEach((src) => {
        try {
          src.stop();
          src.disconnect();
        } catch { /* already stopped */ }
      });
      track.nodes.gain.disconnect();
    } catch { /* noop */ }
    track.nodes = undefined;
  }

  public stopAll() {
    this.tracks.forEach((_, key) => {
      this.toggleTrack(key, false);
    });
  }
}

export const ambientSynth = new AmbientSynthEngine();
