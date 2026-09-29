/**
 * Sons de la tribu geek : sabres laser, claquement de doigts, sortilèges,
 * hyperespace et fanfare spatiale. Tout est original (aucun thème de film).
 */

import type { EggLevel } from "@/components/easter-eggs/catalog";
import { envelope, noiseBurst, tone, type Recipe } from "@/lib/sound";
import { bell, brass, fanfare, hz, noiseSweep, pad, snap, sparkle, thump } from "../synth";

/** « Hmm... » du chapeau qui réfléchit : scie grave filtrée comme une voix fermée. */
function hum(ctx: AudioContext, out: AudioNode, t: number, duration: number) {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(hz(45), t);
  osc.frequency.linearRampToValueAtTime(hz(43), t + duration);
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 5;
  const depth = ctx.createGain();
  depth.gain.value = 3;
  vibrato.connect(depth).connect(osc.frequency);
  const formant = ctx.createBiquadFilter();
  formant.type = "bandpass";
  formant.frequency.value = 480;
  formant.Q.value = 3;
  const gain = envelope(ctx, t, 0.3, 0.08, duration - 0.2, 0.12);
  osc.connect(formant).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + duration + 0.05);
  vibrato.start(t);
  vibrato.stop(t + duration + 0.05);
}

/** Allumage de sabre laser : souffle, puis bourdonnement qui monte et reste. */
function saberOn(ctx: AudioContext, out: AudioNode, t: number, until: number, base = 92) {
  noiseSweep(ctx, out, t, { type: "bandpass", from: 300, to: 3000, q: 1.5, peak: 0.18, duration: 0.3 });
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1100;
  filter.Q.value = 2;
  const gain = envelope(ctx, t, 0.12, 0.15, Math.max(0.1, until - t - 0.35), 0.2);
  filter.connect(gain).connect(out);
  for (const [frequency, type] of [
    [base, "sawtooth"],
    [base * 1.01, "sawtooth"],
    [base * 2, "sine"],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency * 0.6, t);
    osc.frequency.exponentialRampToValueAtTime(frequency, t + 0.25);
    osc.connect(filter);
    osc.start(t);
    osc.stop(until + 0.1);
  }
}

export const snapDust: Recipe = (ctx, out, t) => {
  snap(ctx, out, t + 0.35, 0.7);
  noiseSweep(ctx, out, t + 0.6, { type: "highpass", from: 2400, to: 500, q: 0.5, peak: 0.1, attack: 0.3, duration: 1.8 });
  tone(ctx, out, t + 1.2, "sine", hz(57), hz(52), 1.2, 0.08, 0.2, 0.6, 0.6);
};

export const moldu: Recipe = (ctx, out, t) => {
  hum(ctx, out, t + 0.15, 0.85);
  brass(ctx, out, t + 1.15, 55, 0.3, { peak: 0.14 });
  brass(ctx, out, t + 1.5, 50, 0.8, { peak: 0.14, bright: 1400 });
};

export const choixpeau: Recipe = (ctx, out, t) => {
  hum(ctx, out, t + 0.2, 0.6);
  for (const midi of [67, 71, 74]) brass(ctx, out, t + 0.9, midi, 0.45, { peak: 0.07 });
  sparkle(ctx, out, t + 0.95, { base: 86, count: 5, step: 0.04, peak: 0.05 });
};

export const sabre: Recipe = (ctx, out, t) => {
  saberOn(ctx, out, t + 0.2, t + 2.6, 92);
  saberOn(ctx, out, t + 0.7, t + 2.6, 80);
  noiseBurst(ctx, out, t + 1.2, "bandpass", 2600, 1.2, 0.5, 0.2);
  bell(ctx, out, t + 1.2, 1320, { peak: 0.1, decay: 0.5, partials: [1, 2.4, 3.7] });
  pad(ctx, out, t + 1.35, [55, 62, 67], 1.3, { peak: 0.12, wave: "sawtooth" });
};

export const matrix: Recipe = (ctx, out, t) => {
  for (let i = 0; i < 22; i++) {
    const midi = 84 + ((i * 7) % 12);
    tone(ctx, out, t + 0.08 + i * 0.055, "square", hz(midi), hz(midi), 0, 0.025, 0.002, 0.015, 0.02);
  }
  const drone = ctx.createOscillator();
  drone.type = "sawtooth";
  drone.frequency.value = hz(33);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(200, t);
  filter.frequency.exponentialRampToValueAtTime(900, t + 1.4);
  filter.frequency.exponentialRampToValueAtTime(250, t + 2.6);
  const gain = envelope(ctx, t, 0.16, 0.3, 1.9, 0.5);
  drone.connect(filter).connect(gain).connect(out);
  drone.start(t);
  drone.stop(t + 2.8);
  thump(ctx, out, t + 1.45, { from: 90, to: 32, peak: 0.7, duration: 0.7 });
  sparkle(ctx, out, t + 1.6, { base: 76, count: 3, step: 0.1, peak: 0.05, intervals: [0, 7, 12] });
};

export const patronus: Recipe = (ctx, out, t) => {
  noiseSweep(ctx, out, t, { type: "bandpass", from: 500, to: 5000, q: 1, peak: 0.08, duration: 0.9 });
  sparkle(ctx, out, t + 0.15, { base: 79, count: 12, step: 0.07, peak: 0.045, intervals: [0, 4, 7, 11, 14, 16, 19] });
  pad(ctx, out, t + 0.3, [60, 64, 67, 71], 2.4, { peak: 0.1 });
  bell(ctx, out, t + 1.35, hz(84), { peak: 0.08, decay: 1.4 });
};

export const hyperespace: Recipe = (ctx, out, t) => {
  tone(ctx, out, t + 0.05, "sine", 70, 900, 0.95, 0.1, 0.3, 0.6, 0.1);
  noiseSweep(ctx, out, t + 0.1, { type: "bandpass", from: 200, to: 6000, q: 0.8, peak: 0.2, attack: 0.5, duration: 0.95 });
  thump(ctx, out, t + 1.0, { from: 120, to: 28, peak: 0.9, duration: 1.2 });
  fanfare(
    ctx,
    out,
    t + 1.25,
    [
      [[55, 62, 67], 1],
      [[55, 62, 67], 0.5],
      [[60, 64, 67], 2.5],
      [[62, 66, 69], 1],
      [[59, 62, 67], 1],
      [[60, 64, 72], 3],
    ],
    { bpm: 150, peak: 0.16 },
  );
};

export const gantelet: Recipe = (ctx, out, t) => {
  const gems = [76, 79, 83, 86, 88, 91];
  gems.forEach((midi, index) => bell(ctx, out, t + 0.5 + index * 0.18, hz(midi), { peak: 0.08, decay: 0.9 }));
  snap(ctx, out, t + 1.8, 0.8);
  thump(ctx, out, t + 1.85, { from: 100, to: 26, peak: 0.9, duration: 1.1 });
  noiseSweep(ctx, out, t + 1.85, { type: "lowpass", from: 4000, to: 300, peak: 0.18, duration: 1 });
  pad(ctx, out, t + 2.05, [57, 64, 69, 73], 1.4, { peak: 0.1 });
};

export const STINGS: Record<EggLevel, Recipe> = {
  fail: (ctx, out, t) => {
    snap(ctx, out, t, 0.6);
    noiseSweep(ctx, out, t + 0.1, { type: "highpass", from: 2000, to: 600, peak: 0.08, duration: 0.8 });
  },
  small: (ctx, out, t) => sparkle(ctx, out, t, { base: 84, count: 5, step: 0.05, peak: 0.05 }),
  combo: (ctx, out, t) => saberOn(ctx, out, t, t + 0.9, 92),
  legendary: (ctx, out, t) => fanfare(ctx, out, t, [[[55, 62, 67], 0.5], [[60, 64, 67], 2]], { bpm: 150, peak: 0.14 }),
};
