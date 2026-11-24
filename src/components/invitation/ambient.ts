"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MusicId } from "@/lib/invitation/types";

type Mood = Exclude<MusicId, "none" | "custom">;

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

/**
 * Small generative soundscape built with the Web Audio API.
 * No audio files and no licensing: every note is synthesised in the browser.
 */
class AmbientEngine {
  private ctx: AudioContext;
  private master: GainNode;
  private wet: GainNode;
  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  private stopped = false;

  constructor(private mood: Mood) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);

    const delay = this.ctx.createDelay(1.5);
    delay.delayTime.value = mood === "joyful" ? 0.29 : 0.46;
    const feedback = this.ctx.createGain();
    feedback.gain.value = mood === "joyful" ? 0.22 : 0.38;
    const damp = this.ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 2200;
    this.wet = this.ctx.createGain();
    this.wet.gain.value = 0.5;
    this.wet.connect(delay);
    delay.connect(damp);
    damp.connect(feedback);
    feedback.connect(delay);
    damp.connect(this.master);
  }

  start() {
    void this.ctx.resume();
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0.5, t + 2.5);
    this.nextTime = t + 0.15;
    if (this.timer === null) {
      this.timer = window.setInterval(() => this.schedule(), 180);
    }
  }

  stop() {
    if (this.stopped) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 0.8);
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  dispose() {
    this.stop();
    this.stopped = true;
    window.setTimeout(() => void this.ctx.close().catch(() => {}), 1000);
  }

  private voice(freq: number, when: number, dur: number, gain: number, type: OscillatorType, attack = 0.02) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(g);
    g.connect(this.master);
    g.connect(this.wet);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }

  private bell(note: number, when: number, gain = 0.11, dur = 3.6) {
    const f = midi(note);
    this.voice(f, when, dur, gain, "sine");
    this.voice(f * 2, when, dur * 0.5, gain * 0.22, "sine");
    this.voice(f * 3.01, when, dur * 0.25, gain * 0.06, "sine");
  }

  private pad(notes: number[], when: number, dur: number, gain = 0.035) {
    for (const n of notes) {
      this.voice(midi(n), when, dur, gain, "triangle", dur * 0.35);
      this.voice(midi(n) * 1.004, when, dur, gain * 0.6, "sine", dur * 0.4);
    }
  }

  private schedule() {
    const horizon = this.ctx.currentTime + 0.6;
    while (this.nextTime < horizon) {
      this.playStep(this.nextTime);
    }
  }

  private playStep(t: number) {
    const s = this.step++;
    if (this.mood === "serene") {
      // D major pentatonic bells over a slow drone
      const scale = [62, 64, 66, 69, 71, 74, 76, 78, 81];
      if (s % 8 === 0) this.pad([50, 57], t, 14, 0.03);
      const pick = scale[Math.floor(Math.random() * scale.length)];
      this.bell(pick, t);
      if (Math.random() < 0.3) this.bell(pick + (Math.random() < 0.5 ? 7 : 12), t + 0.35, 0.05);
      this.nextTime = t + 1.5 + Math.random() * 1.6;
    } else if (this.mood === "warm") {
      // Slow four chord cycle with sparse high notes
      const chords = [
        [50, 57, 61, 66],
        [47, 54, 57, 62],
        [43, 50, 54, 59],
        [45, 52, 56, 61],
      ];
      const chord = chords[s % chords.length];
      this.pad(chord, t, 7.5, 0.04);
      const top = chord[2 + (s % 2)] + 12;
      this.bell(top, t + 1.2, 0.06, 4);
      this.bell(top + (s % 3 === 0 ? 5 : 2), t + 3.6, 0.045, 4);
      this.nextTime = t + 5.6;
    } else {
      // Kalimba style pattern in G major pentatonic
      const pattern = [67, 71, 74, 76, 79, 76, 74, 71, 69, 74, 76, 81, 79, 76, 74, 69];
      const beat = 0.3;
      const n = pattern[s % pattern.length];
      if (s % 16 === 0) this.pad([43, 55], t, 5, 0.03);
      if (Math.random() > 0.12) {
        this.voice(midi(n), t, 0.9, 0.1, "sine", 0.008);
        this.voice(midi(n) * 2, t, 0.3, 0.03, "triangle", 0.005);
      }
      this.nextTime = t + beat * (s % 4 === 3 ? 1.08 : 1);
    }
  }
}

export interface AmbientControls {
  available: boolean;
  playing: boolean;
  start: () => void;
  toggle: () => void;
}

export function useAmbient(music: MusicId, url?: string): AmbientControls {
  const engine = useRef<AmbientEngine | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  // Remember which soundtrack is playing, so switching soundtrack reads as stopped.
  const track = `${music}|${url ?? ""}`;
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const playing = playingTrack === track;
  const available = music !== "none" && (music !== "custom" || Boolean(url));

  useEffect(() => {
    // The soundtrack changed or the view unmounted: drop whatever was playing.
    return () => {
      engine.current?.dispose();
      engine.current = null;
      if (audio.current) {
        audio.current.pause();
        audio.current = null;
      }
    };
  }, [track]);

  const start = useCallback(() => {
    if (!available) return;
    try {
      if (music === "custom" && url) {
        if (!audio.current) {
          audio.current = new Audio(url);
          audio.current.loop = true;
          audio.current.volume = 0.6;
        }
        void audio.current.play().then(() => setPlayingTrack(track)).catch(() => setPlayingTrack(null));
        return;
      }
      if (!engine.current) engine.current = new AmbientEngine(music as Mood);
      engine.current.start();
      setPlayingTrack(track);
    } catch {
      setPlayingTrack(null);
    }
  }, [available, music, url, track]);

  const stop = useCallback(() => {
    engine.current?.stop();
    audio.current?.pause();
    setPlayingTrack(null);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        engine.current?.stop();
        audio.current?.pause();
      } else if (playing) {
        if (music === "custom") void audio.current?.play().catch(() => {});
        else engine.current?.start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing, music]);

  const toggle = useCallback(() => (playing ? stop() : start()), [playing, start, stop]);

  return { available, playing, start, toggle };
}
