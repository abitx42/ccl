/**
 * AmbientAudio.ts
 * Procedural coastal ocean surf & sea breeze generator using the Web Audio API.
 * Requires 0 KB external audio downloads, zero network latency, works offline,
 * and complies strictly with browser autoplay policies and WCAG accessibility.
 */

export class AmbientAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private targetVolume: number = 0.18;
  private noiseSource: AudioBufferSourceNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;

  constructor() {
    // AudioContext is initialized lazily upon explicit user gesture
  }

  private initAudioChain(): void {
    if (this.ctx) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) {
      console.warn('[AmbientAudio] Web Audio API is not supported in this browser.');
      return;
    }

    this.ctx = new AudioCtx();

    // 1. Generate 6 seconds of looping pink noise buffer
    const bufferSize = this.ctx.sampleRate * 6;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    // 2. Loop the noise source
    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    // 3. Dynamic resonant low-pass filter simulating rolling surf
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    // 4. LFO (Low-Frequency Oscillator) simulating rhythmic wave swell (~12-second cycle)
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // ~12.5 sec wave period

    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(450, this.ctx.currentTime); // filter frequency modulation range

    // Connect LFO -> Filter frequency
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filter.frequency);

    // 5. Master Gain Node with smooth ramp
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    // Connect Audio Chain: Noise -> Filter -> MasterGain -> Output
    this.noiseSource.connect(this.filter);
    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Start oscillators
    this.noiseSource.start(0);
    this.lfo.start(0);
  }

  public async start(): Promise<void> {
    this.initAudioChain();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.exponentialRampToValueAtTime(this.targetVolume, now + 1.2);
    this.isRunning = true;
  }

  public stop(): void {
    if (!this.ctx || !this.masterGain || !this.isRunning) return;

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    setTimeout(() => {
      if (!this.isRunning && this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend();
      }
    }, 850);

    this.isRunning = false;
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public get active(): boolean {
    return this.isRunning;
  }

  public destroy(): void {
    this.stop();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (_) {}
      this.ctx = null;
    }
  }
}
