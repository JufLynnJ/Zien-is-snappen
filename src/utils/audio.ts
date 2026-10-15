// Web Audio API sound generator for snappy, offline-ready educational sounds

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playPop() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Cheerful ascending arpeggio: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.09;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {
      // ignore
    }
  }

  playTryAgain() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Gentle, friendly low "try again" tone
      const notes = [392.0, 329.63];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        const startTime = now + idx * 0.15;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    } catch {
      // ignore
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chords = [
        { freqs: [523.25, 659.25, 783.99], time: 0.0, dur: 0.18 },
        { freqs: [523.25, 659.25, 783.99], time: 0.2, dur: 0.18 },
        { freqs: [523.25, 659.25, 783.99], time: 0.4, dur: 0.18 },
        { freqs: [659.25, 783.99, 1046.5], time: 0.65, dur: 0.55 },
      ];

      chords.forEach(({ freqs, time, dur }) => {
        freqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;

          const start = now + time;
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.2, start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + dur + 0.05);
        });
      });
    } catch {
      // ignore
    }
  }
}

export const soundEffects = new SoundEffects();

/**
 * Text-to-speech in Dutch with preferred Flemish / Dutch voices
 */
export function speakDutch(
  text: string,
  rate: number = 0.9,
  onStart?: () => void,
  onEnd?: () => void,
  onBoundary?: (charIndex: number) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'nl-NL';
    utterance.rate = rate;
    utterance.pitch = 1.05; // Slightly friendlier pitch for children

    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural Dutch or Flemish voices if available
    const dutchVoice =
      voices.find((v) => v.lang.startsWith('nl-BE') && (v.name.includes('Ellen') || v.name.includes('Natural'))) ||
      voices.find((v) => v.lang.startsWith('nl-BE')) ||
      voices.find((v) => v.lang.startsWith('nl-NL') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Claire'))) ||
      voices.find((v) => v.lang.startsWith('nl'));

    if (dutchVoice) {
      utterance.voice = dutchVoice;
      utterance.lang = dutchVoice.lang;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onBoundary) {
      utterance.onboundary = (event) => {
        if (event.name === 'word' || typeof event.charIndex === 'number') {
          onBoundary(event.charIndex);
        }
      };
    }
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
