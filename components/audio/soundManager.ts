'use client';

import { Howl } from 'howler';
import { CONFIG } from '@/lib/config';

type SfxName = keyof typeof CONFIG.assets.sfx;

class SoundManager {
  private sfx: Map<SfxName, Howl> = new Map();
  private ambient: Howl | null = null;
  private volume: number = 0.5;
  private audioCtx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private getHowl(name: SfxName): Howl {
    if (!this.sfx.has(name)) {
      const h = new Howl({
        src: [CONFIG.assets.sfx[name]],
        volume: this.volume,
        html5: true,
      });
      this.sfx.set(name, h);
    }
    return this.sfx.get(name)!;
  }

  playSFX(name: SfxName) {
    try {
      const howl = this.getHowl(name);
      howl.play();
    } catch (e) {
      // Silent fallback
    }

    // Additional synthesized fallback for firework if audio file is stub
    if (name === 'firework') {
      this.playFireworkExplosion();
    }
  }

  // Synthesized Firework Explosion Sound (Deep boom + sparkling noise)
  playFireworkExplosion() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // 1. Deep Boom Sine Oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);

      // 2. Sparkling White Noise Burst
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.3);
    } catch (e) {
      // Silent fallback
    }
  }

  // Synthesized mechanical typewriter key click
  playTypingClick() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Ignore
    }
  }

  // Continuous background ambient music loop
  startAmbient() {
    if (this.ambient) return;

    try {
      this.ambient = new Howl({
        src: [CONFIG.assets.sfx.ambient],
        loop: true,
        volume: 0,
        html5: true,
        onloaderror: () => {
          this.startSynthesizedAmbient();
        },
      });
      this.ambient.play();
      this.ambient.fade(0, this.volume * 0.4, 2000);
    } catch (e) {
      this.startSynthesizedAmbient();
    }
  }

  // Web Audio synthesized warm ambient synth pad loop
  private startSynthesizedAmbient() {
    try {
      if (this.ambientOsc) return;
      const ctx = this.getAudioContext();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(164.81, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientOsc = osc1;
    } catch (e) {
      // Silent fallback
    }
  }

  stopAmbient() {
    if (this.ambient) {
      this.ambient.fade(this.ambient.volume(), 0, 1000);
      this.ambient.once('fade', () => {
        this.ambient?.stop();
        this.ambient = null;
      });
    }
  }

  setVolume(val: number) {
    this.volume = val;
    this.sfx.forEach((howl) => howl.volume(val));
    if (this.ambient) {
      this.ambient.volume(val * 0.4);
    }
  }
}

export const soundManager = new SoundManager();
