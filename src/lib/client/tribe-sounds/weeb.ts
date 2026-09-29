/**
 * Sons de la tribu weeb : goutte de sueur, table retournée, scintillements
 * kawaii, stinger dramatique, charge de ki et petite progression J-pop
 * (originale).
 */

import type { EggLevel } from "@/components/easter-eggs/catalog";
import { envelope, noiseBurst, tone, type Recipe } from "@/lib/sound";
import { bell, brass, hz, noiseSweep, pad, sparkle, thump } from "../synth";

function bloop(ctx: AudioContext, out: AudioNode, t: number, peak = 0.14) {
  tone(ctx, out, t, "sine", 720, 300, 0.12, peak, 0.004, 0.02, 0.1);
}

/** Grondement « ゴゴゴ » : scie grave en trémolo. */
function menace(ctx: AudioContext, out: AudioNode, t: number, duration: number) {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = hz(31);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 380;
  const tremolo = ctx.createGain();
  tremolo.gain.value = 0.5;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 7;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.5;
  lfo.connect(lfoDepth).connect(tremolo.gain);
  const gain = envelope(ctx, t, 0.22, 0.2, duration - 0.5, 0.3);
  osc.connect(filter).connect(tremolo).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + duration + 0.1);
  lfo.start(t);
  lfo.stop(t + duration + 0.1);
}

export const goutte: Recipe = (ctx, out, t) => {
  bloop(ctx, out, t + 0.4);
  tone(ctx, out, t + 0.55, "sine", 1300, 420, 0.8, 0.08, 0.02, 0.6, 0.2);
  for (const [at, midi] of [
    [1.0, 72],
    [1.15, 72],
    [1.3, 72],
  ] as const)
    tone(ctx, out, t + at, "triangle", hz(midi), hz(midi), 0, 0.05, 0.003, 0.03, 0.06);
  tone(ctx, out, t + 1.5, "triangle", hz(67), hz(62), 0.3, 0.07, 0.01, 0.2, 0.3);
};

export const table: Recipe = (ctx, out, t) => {
  noiseSweep(ctx, out, t + 0.2, { type: "bandpass", from: 300, to: 2500, q: 1.2, peak: 0.16, duration: 0.35 });
  thump(ctx, out, t + 0.75, { from: 140, to: 40, peak: 0.8, duration: 0.4 });
  noiseBurst(ctx, out, t + 0.75, "bandpass", 1800, 0.7, 0.4, 0.25);
  for (let i = 0; i < 5; i++) bell(ctx, out, t + 0.8 + i * 0.06, 900 + i * 230, { peak: 0.04, decay: 0.2, partials: [1, 2.3] });
  bell(ctx, out, t + 1.9, hz(79), { peak: 0.07, decay: 0.8 });
  bell(ctx, out, t + 2.02, hz(84), { peak: 0.06, decay: 0.9 });
};

export const kawaii: Recipe = (ctx, out, t) => {
  tone(ctx, out, t + 0.05, "sine", 600, 1400, 0.12, 0.08, 0.004, 0.04, 0.08);
  sparkle(ctx, out, t + 0.15, { base: 88, count: 7, step: 0.045, peak: 0.05 });
  bell(ctx, out, t + 0.6, hz(91), { peak: 0.05, decay: 0.6 });
};

export const nani: Recipe = (ctx, out, t) => {
  for (let i = 0; i < 14; i++) tone(ctx, out, t + 0.06 + i * 0.05, "square", 1800, 1800, 0, 0.018, 0.001, 0.008, 0.01);
  brass(ctx, out, t + 0.9, 38, 0.9, { peak: 0.2, bright: 1600 });
  brass(ctx, out, t + 0.9, 44, 0.9, { peak: 0.14, bright: 1600 });
  thump(ctx, out, t + 0.9, { from: 120, to: 30, peak: 0.9, duration: 0.8 });
  noiseSweep(ctx, out, t + 0.5, { type: "highpass", from: 400, to: 4000, peak: 0.12, duration: 0.42 });
  menace(ctx, out, t + 1.1, 1.6);
};

export const henshin: Recipe = (ctx, out, t) => {
  sparkle(ctx, out, t + 0.1, { base: 79, count: 14, step: 0.07, peak: 0.045 });
  pad(ctx, out, t + 0.1, [60, 64, 67, 72], 1.3, { peak: 0.09 });
  pad(ctx, out, t + 1.35, [65, 69, 72, 77], 1.4, { peak: 0.1 });
  bell(ctx, out, t + 1.4, hz(96), { peak: 0.07, decay: 1 });
  sparkle(ctx, out, t + 1.4, { base: 91, count: 6, step: 0.04, peak: 0.05 });
};

export const neufmille: Recipe = (ctx, out, t) => {
  tone(ctx, out, t + 0.1, "sawtooth", 60, 520, 1.5, 0.06, 0.4, 1.0, 0.1);
  noiseSweep(ctx, out, t + 0.1, { type: "bandpass", from: 200, to: 3500, q: 2, peak: 0.16, attack: 1.2, duration: 1.55 });
  thump(ctx, out, t + 1.7, { from: 100, to: 24, peak: 1, duration: 1.2 });
  noiseSweep(ctx, out, t + 1.7, { type: "lowpass", from: 6000, to: 200, peak: 0.3, attack: 0.01, duration: 1.1 });
  brass(ctx, out, t + 2, 50, 1.2, { peak: 0.12 });
  brass(ctx, out, t + 2, 57, 1.2, { peak: 0.1 });
  brass(ctx, out, t + 2, 62, 1.2, { peak: 0.1 });
};

export const senpai: Recipe = (ctx, out, t) => {
  // IV - V - iii - vi, arpégé à la clochette (progression pop classique, mélodie originale).
  const chords = [
    [65, 69, 72],
    [67, 71, 74],
    [64, 67, 71],
    [69, 72, 76],
  ];
  chords.forEach((chord, index) => {
    const at = t + 0.2 + index * 0.72;
    pad(ctx, out, at, chord.map((note) => note - 12), 0.75, { peak: 0.08 });
    chord.forEach((note, k) => bell(ctx, out, at + k * 0.09, hz(note + 12), { peak: 0.05, decay: 0.5 }));
  });
  for (const at of [0.5, 0.78, 1.6, 1.88]) thump(ctx, out, t + at, { from: 90, to: 50, peak: 0.35, duration: 0.14 });
  sparkle(ctx, out, t + 1.35, { base: 88, count: 8, step: 0.05, peak: 0.04 });
};

export const STINGS: Record<EggLevel, Recipe> = {
  fail: (ctx, out, t) => bloop(ctx, out, t),
  small: (ctx, out, t) => sparkle(ctx, out, t, { base: 88, count: 6, step: 0.045, peak: 0.05 }),
  combo: (ctx, out, t) => {
    brass(ctx, out, t, 38, 0.6, { peak: 0.18, bright: 1600 });
    thump(ctx, out, t, { from: 120, to: 30, peak: 0.7, duration: 0.5 });
  },
  legendary: (ctx, out, t) => {
    sparkle(ctx, out, t, { base: 84, count: 6, step: 0.05, peak: 0.05 });
    pad(ctx, out, t + 0.2, [65, 69, 72, 76], 1, { peak: 0.09 });
  },
};
