/**
 * Sons de la tribu taverne : chopes qui trinquent, bière qui coule, friture,
 * cloche de comptoir, pièces et gigue de taverne (mélodie originale).
 */

import type { EggLevel } from "@/components/easter-eggs/catalog";
import { envelope, noiseBuffer, tone, type Recipe } from "@/lib/sound";
import { bell, brass, clink, crowd, hz, melody, noiseSweep } from "../synth";

/** Liquide qui coule : bruit filtré dont le « glouglou » monte avec le niveau. */
function pour(ctx: AudioContext, out: AudioNode, t: number, duration: number, peak = 0.12) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 3;
  filter.frequency.setValueAtTime(380, t);
  filter.frequency.exponentialRampToValueAtTime(1300, t + duration);
  const gurgle = ctx.createOscillator();
  gurgle.frequency.value = 9;
  const gurgleDepth = ctx.createGain();
  gurgleDepth.gain.value = 140;
  gurgle.connect(gurgleDepth).connect(filter.frequency);
  const gain = envelope(ctx, t, peak, 0.08, duration - 0.2, 0.12);
  source.connect(filter).connect(gain).connect(out);
  source.start(t);
  source.stop(t + duration + 0.1);
  gurgle.start(t);
  gurgle.stop(t + duration + 0.1);
}

/** Pétillement de mousse : petites bulles aiguës aléatoires (graine fixe). */
function fizz(ctx: AudioContext, out: AudioNode, t: number, duration: number, count = 26) {
  for (let i = 0; i < count; i++) {
    const at = t + ((i * 0.618) % 1) * duration;
    const frequency = 1800 + ((i * 733) % 2200);
    tone(ctx, out, at, "sine", frequency, frequency * 1.3, 0.02, 0.025, 0.001, 0, 0.03);
  }
}

/** Friture sur la broche : crépitements. */
function sizzle(ctx: AudioContext, out: AudioNode, t: number, duration: number) {
  noiseSweep(ctx, out, t, { type: "highpass", from: 3500, to: 3000, q: 0.5, peak: 0.05, attack: 0.3, duration });
  for (let i = 0; i < 30; i++) {
    const at = t + ((i * 0.382) % 1) * duration;
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 2500;
    const gain = envelope(ctx, at, 0.06 + (i % 4) * 0.02, 0.001, 0, 0.015);
    source.connect(filter).connect(gain).connect(out);
    source.start(at);
    source.stop(at + 0.05);
  }
}

/** Gigue de taverne (mode dorien, originale) avec bourdon de cornemuse. */
function jig(ctx: AudioContext, out: AudioNode, t: number, bars = 2, bpm = 220) {
  const phrase: Array<[number, number]> = [
    [74, 1], [76, 1], [77, 1], [79, 2], [77, 1], [76, 1], [74, 1], [72, 1],
    [74, 2], [69, 1], [72, 1], [74, 1], [76, 1], [77, 2], [76, 1], [74, 3],
  ];
  const notes = Array.from({ length: bars }, () => phrase).flat();
  const end = melody(ctx, out, t, notes, { bpm: bpm * 2, wave: "triangle", peak: 0.11, gate: 0.75 });
  melody(ctx, out, t, notes.map(([note, beats]) => [note + 12, beats] as [number, number]), { bpm: bpm * 2, wave: "square", peak: 0.02, gate: 0.6 });
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 700;
  const gain = envelope(ctx, t, 0.05, 0.1, end - t - 0.2, 0.1);
  filter.connect(gain).connect(out);
  for (const midi of [50, 57]) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = hz(midi);
    osc.connect(filter);
    osc.start(t);
    osc.stop(end + 0.1);
  }
}

/** Cloche de comptoir (« dernière tournée » ou « tournée du patron »). */
function barBell(ctx: AudioContext, out: AudioNode, t: number, peak = 0.14) {
  bell(ctx, out, t, 1046, { peak, decay: 1.4, partials: [1, 2.4, 3.9, 5.6] });
}

function coins(ctx: AudioContext, out: AudioNode, t: number, duration: number, count = 22) {
  for (let i = 0; i < count; i++) {
    const at = t + ((i * 0.618) % 1) * duration;
    bell(ctx, out, at, 2600 + ((i * 331) % 1400), { peak: 0.04, decay: 0.25, partials: [1, 2.7] });
  }
}

export const derniere: Recipe = (ctx, out, t) => {
  barBell(ctx, out, t + 0.1, 0.12);
  for (const at of [0.35, 0.95, 1.5]) noiseSweep(ctx, out, t + at, { type: "bandpass", from: 500, to: 300, q: 8, peak: 0.08, duration: 0.35 });
  tone(ctx, out, t + 1.45, "sine", 900, 1800, 0.05, 0.12, 0.002, 0.01, 0.12);
  brass(ctx, out, t + 1.8, 50, 0.35, { peak: 0.1, bright: 1200 });
  brass(ctx, out, t + 2.15, 45, 0.6, { peak: 0.1, bright: 900 });
};

export const sante: Recipe = (ctx, out, t) => {
  clink(ctx, out, t + 0.45, 0.2);
  crowd(ctx, out, t + 0.5, 0.9, 0.08);
};

export const tournee: Recipe = (ctx, out, t) => {
  for (let i = 0; i < 6; i++) noiseSweep(ctx, out, t + 0.2 + i * 0.15, { type: "bandpass", from: 1600, to: 500, q: 2, peak: 0.07, duration: 0.2 });
  pour(ctx, out, t + 1, 0.9);
  fizz(ctx, out, t + 1.3, 0.9);
  for (const at of [1.9, 2.02, 2.12]) clink(ctx, out, t + at, 0.14);
  crowd(ctx, out, t + 1.9, 1, 0.12);
};

export const gras: Recipe = (ctx, out, t) => {
  sizzle(ctx, out, t, 2.8);
  jig(ctx, out, t + 0.2, 1, 200);
  bell(ctx, out, t + 0.9, hz(84), { peak: 0.08, decay: 0.8 });
};

export const mousse: Recipe = (ctx, out, t) => {
  pour(ctx, out, t + 0.1, 1.3, 0.14);
  fizz(ctx, out, t + 1, 1.5, 34);
  clink(ctx, out, t + 1.8, 0.16);
  crowd(ctx, out, t + 1.8, 1, 0.08);
};

export const banquet: Recipe = (ctx, out, t) => {
  jig(ctx, out, t + 0.1, 2, 230);
  for (const at of [1.2, 2.2]) {
    clink(ctx, out, t + at, 0.18);
    clink(ctx, out, t + at + 0.06, 0.12);
    crowd(ctx, out, t + at, 0.9, 0.12);
  }
};

export const patron: Recipe = (ctx, out, t) => {
  for (const at of [0.1, 0.35, 0.6]) barBell(ctx, out, t + at, 0.13);
  coins(ctx, out, t + 0.8, 1.8);
  crowd(ctx, out, t + 0.9, 2.2, 0.13);
  jig(ctx, out, t + 1.4, 1, 240);
};

export const STINGS: Record<EggLevel, Recipe> = {
  fail: (ctx, out, t) => barBell(ctx, out, t, 0.1),
  small: (ctx, out, t) => clink(ctx, out, t, 0.18),
  combo: (ctx, out, t) => {
    clink(ctx, out, t, 0.16);
    crowd(ctx, out, t, 0.7, 0.08);
  },
  legendary: (ctx, out, t) => {
    barBell(ctx, out, t, 0.12);
    clink(ctx, out, t + 0.3, 0.18);
    clink(ctx, out, t + 0.38, 0.12);
  },
};
