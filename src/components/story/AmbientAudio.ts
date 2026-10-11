/**
 * AmbientAudio.ts
 * Ambient soundtrack player for CCL using the provided ambient audio track.
 * Seamlessly loops on repeat, supports smooth volume fade in/out,
 * and complies strictly with browser autoplay policies and WCAG accessibility.
 */

export class AmbientAudio {
  private audio: HTMLAudioElement | null = null;
  private isRunning: boolean = false;
  private targetVolume: number = 0.65;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Initialized lazily upon explicit user gesture
  }

  private initAudio(): void {
    if (this.audio) return;
    this.audio = new Audio('/audio/ambient.m4a');
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.audio.volume = 0;
    this.audio.addEventListener('ended', () => {
      if (this.isRunning && this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
      }
    });
  }

  private fadeTo(target: number, durationMs: number, onComplete?: () => void): void {
    if (!this.audio) return;
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    const startVol = this.audio.volume;
    const startTime = performance.now();
    const stepMs = 25;

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        return;
      }
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      this.audio.volume = Math.max(0, Math.min(1, startVol + (target - startVol) * ease));

      if (progress >= 1) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (onComplete) onComplete();
      }
    }, stepMs);
  }

  public async start(): Promise<void> {
    this.initAudio();
    if (!this.audio) return;

    this.isRunning = true;
    this.audio.loop = true;
    try {
      await this.audio.play();
      this.fadeTo(this.targetVolume, 1200);
    } catch (err) {
      console.warn('[AmbientAudio] Playback deferred:', err);
    }
  }

  public stop(): void {
    if (!this.audio || !this.isRunning) return;
    this.isRunning = false;
    this.fadeTo(0, 800, () => {
      if (this.audio && !this.isRunning) {
        this.audio.pause();
      }
    });
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
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }
}
