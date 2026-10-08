class SafeAudioEngine {
  private ctx: AudioContext | null = null;
  private sirenOscillator: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenInterval: any = null;
  private ringtoneInterval: any = null;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * High-intensity Emergency Siren synthesizer using frequency modulation
   */
  public startSiren(): void {
    try {
      this.stopSiren();
      const ctx = this.getAudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.8, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      let high = false;
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.start();

      this.sirenOscillator = osc;
      this.sirenGain = gain;

      this.sirenInterval = setInterval(() => {
        if (!this.ctx || !this.sirenOscillator) return;
        const now = this.ctx.currentTime;
        if (high) {
          this.sirenOscillator.frequency.exponentialRampToValueAtTime(650, now + 0.3);
        } else {
          this.sirenOscillator.frequency.exponentialRampToValueAtTime(1150, now + 0.3);
        }
        high = !high;
      }, 350);
    } catch (e) {
      console.error('Failed to start siren audio', e);
    }
  }

  public stopSiren(): void {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.sirenOscillator) {
      try {
        this.sirenOscillator.stop();
        this.sirenOscillator.disconnect();
      } catch (e) {}
      this.sirenOscillator = null;
    }
    if (this.sirenGain) {
      try {
        this.sirenGain.disconnect();
      } catch (e) {}
      this.sirenGain = null;
    }
  }

  /**
   * Realistic smartphone ringtone synthesizer
   */
  public startRingtone(): void {
    try {
      this.stopRingtone();
      const ctx = this.getAudioContext();

      const playChime = () => {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.4, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
        });
      };

      playChime();
      this.ringtoneInterval = setInterval(playChime, 2200);
    } catch (e) {
      console.error('Failed to start ringtone', e);
    }
  }

  public stopRingtone(): void {
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  /**
   * Audio countdown beep
   */
  public playBeep(frequency: number = 880, durationMs: number = 150): void {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {}
  }
}

export const safeAudio = new SafeAudioEngine();
