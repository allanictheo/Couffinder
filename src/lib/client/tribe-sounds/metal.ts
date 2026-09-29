/**
 * Sons de la tribu métal : accords saturés, riff en palm mute, solo, larsen,
 * corde qui casse et foule. Riffs originaux, joués par des scies saturées.
 */

import type { EggLevel } from "@/components/easter-eggs/catalog";
import { distortionCurve, envelope, tone, type Recipe } from "@/lib/sound";
import { crowd, feedback, hz, noiseSweep, powerChord, thump } from "../synth";

/** Note de guitare solo saturée, avec un peu de vibrato. */
function lead(ctx: AudioContext, out: AudioNode, t: number, midi: number, duration: number, bend = 0) {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(hz(midi), t);
  if (bend) osc.frequency.exponentialRampToValueAtTime(hz(midi + bend), t + duration * 0.6);
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 6.5;
  const depth = ctx.createGain();
  depth.gain.value = duration > 0.3 ? 12 : 0;
  vibrato.connect(depth).connect(osc.detune);
  const shaper = ctx.createWaveShaper();
  shaper.curve = distortionCurve(60);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3800;
  const gain = envelope(ctx, t, 0.09, 0.005, Math.max(0.01, duration - 0.06), 0.05);
  osc.connect(shaper).connect(filter).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + duration + 0.1);
  vibrato.start(t);
  vibrato.stop(t + duration + 0.1);
}

/** Corde grattée à vide : petit « pling » métallique. */
function pluck(ctx: AudioContext, out: AudioNode, t: number, midi: number, peak = 0.07) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(4000, t);
  filter.frequency.exponentialRampToValueAtTime(600, t + 0.4);
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = hz(midi);
  const gain = envelope(ctx, t, peak, 0.002, 0.02, 0.5);
  osc.connect(filter).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + 0.6);
}

/** Corde qui casse : « twang » qui plonge et petit claquement. */
function stringSnap(ctx: AudioContext, out: AudioNode, t: number) {
  tone(ctx, out, t, "sawtooth", 1320, 180, 0.35, 0.12, 0.001, 0.02, 0.4);
  tone(ctx, out, t, "square", 2600, 2600, 0, 0.06, 0.001, 0, 0.03);
}

export const larsen: Recipe = (ctx, out, t) => {
  [40, 45, 50, 55, 59, 64].forEach((midi, index) => pluck(ctx, out, t + 0.1 + index * 0.05, midi));
  [40, 45, 50, 55, 59, 64].forEach((midi, index) => pluck(ctx, out, t + 0.55 + index * 0.03, midi, 0.05));
  stringSnap(ctx, out, t + 0.9);
  feedback(ctx, out, t + 1.05, 1.4, 0.06);
  tone(ctx, out, t + 1.4, "sawtooth", hz(40), hz(28), 1, 0.08, 0.05, 0.3, 0.6);
};

export const cornes: Recipe = (ctx, out, t) => {
  powerChord(ctx, out, t + 0.05, 40, 1.2, { peak: 0.2, vibrato: 25 });
  crowd(ctx, out, t + 0.1, 1.3, 0.06);
};

export const pyro: Recipe = (ctx, out, t) => {
  const hits: Array<[number, number]> = [
    [0.12, 40],
    [0.62, 43],
    [1.12, 45],
  ];
  for (const [offset, root] of hits) {
    powerChord(ctx, out, t + offset, root, 0.4, { peak: 0.18 });
    noiseSweep(ctx, out, t + offset, { type: "lowpass", from: 300, to: 3000, q: 0.7, peak: 0.16, duration: 0.5 });
    for (let i = 1; i <= 3; i++) powerChord(ctx, out, t + offset + 0.1 * i + 0.1, 40, 0.08, { peak: 0.12, mute: true });
  }
  powerChord(ctx, out, t + 1.6, 40, 1.15, { peak: 0.22, vibrato: 30 });
  noiseSweep(ctx, out, t + 1.6, { type: "lowpass", from: 200, to: 4000, peak: 0.2, duration: 0.8 });
  thump(ctx, out, t + 1.6, { from: 120, to: 35, peak: 0.6, duration: 0.5 });
};

export const pogo: Recipe = (ctx, out, t) => {
  const eighth = 60 / 190 / 2;
  for (let i = 0; i < 16; i++) {
    const at = t + 0.05 + i * eighth;
    if (i % 4 === 0) powerChord(ctx, out, at, i % 8 === 0 ? 40 : 43, eighth * 1.6, { peak: 0.17 });
    else powerChord(ctx, out, at, 40, eighth * 0.7, { peak: 0.13, mute: true });
    if (i % 2 === 0) thump(ctx, out, at, { from: 110, to: 45, peak: 0.4, duration: 0.12 });
  }
  crowd(ctx, out, t + 0.2, 2.7, 0.1);
  thump(ctx, out, t + 1.85, { from: 90, to: 28, peak: 0.9, duration: 0.8 });
  powerChord(ctx, out, t + 1.85, 38, 1, { peak: 0.22, vibrato: 25 });
};

export const solo: Recipe = (ctx, out, t) => {
  powerChord(ctx, out, t + 0.05, 40, 0.7, { peak: 0.2 });
  thump(ctx, out, t + 0.05, { from: 110, to: 35, peak: 0.5, duration: 0.4 });
  const run = [64, 67, 69, 71, 74, 76, 79, 81, 83, 86, 88, 91, 88, 86, 88, 91];
  run.forEach((midi, index) => lead(ctx, out, t + 0.85 + index * 0.075, midi, 0.07));
  lead(ctx, out, t + 2.05, 88, 0.55, 2);
  powerChord(ctx, out, t + 2.35, 40, 1, { peak: 0.22, vibrato: 30 });
  feedback(ctx, out, t + 2.5, 0.8, 0.04);
};

export const onze: Recipe = (ctx, out, t) => {
  // Ronflement d'ampli qui s'allume, puis crans du potard.
  tone(ctx, out, t + 0.05, "sawtooth", 50, 50, 0, 0.05, 0.3, 1, 0.1);
  for (let i = 0; i < 11; i++) tone(ctx, out, t + 0.3 + i * 0.1, "square", 2200, 2200, 0, 0.04, 0.001, 0.004, 0.01);
  powerChord(ctx, out, t + 1.5, 28, 1.8, { peak: 0.26, vibrato: 35, drive: 80 });
  powerChord(ctx, out, t + 1.5, 40, 1.8, { peak: 0.14, drive: 60 });
  thump(ctx, out, t + 1.5, { from: 80, to: 22, peak: 1, duration: 1 });
  noiseSweep(ctx, out, t + 1.5, { type: "lowpass", from: 5000, to: 200, peak: 0.25, duration: 0.9 });
  feedback(ctx, out, t + 2.3, 1, 0.05);
  crowd(ctx, out, t + 1.6, 1.8, 0.1);
};

export const STINGS: Record<EggLevel, Recipe> = {
  fail: (ctx, out, t) => {
    stringSnap(ctx, out, t);
    feedback(ctx, out, t + 0.1, 0.6, 0.04);
  },
  small: (ctx, out, t) => powerChord(ctx, out, t, 40, 0.6, { peak: 0.18 }),
  combo: (ctx, out, t) => {
    powerChord(ctx, out, t, 40, 0.3, { peak: 0.18 });
    powerChord(ctx, out, t + 0.35, 45, 0.6, { peak: 0.18, vibrato: 25 });
  },
  legendary: (ctx, out, t) => {
    powerChord(ctx, out, t, 40, 0.25, { peak: 0.18 });
    powerChord(ctx, out, t + 0.3, 43, 0.25, { peak: 0.18 });
    powerChord(ctx, out, t + 0.6, 28, 1, { peak: 0.22, vibrato: 30 });
  },
};
