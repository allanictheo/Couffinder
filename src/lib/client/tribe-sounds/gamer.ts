/**
 * Sons de la tribu gamer : chiptune, hitmarkers, airhorn, coups de baston.
 * Mélodies originales (aucune reprise de thème de jeu).
 */

import type { EggLevel } from "@/components/easter-eggs/catalog";
import { airhorn, airhornBlast, envelope, hitmarker, tone, wobble, type Recipe } from "@/lib/sound";
import { coin, hz, melody, noiseSweep, punch, thump } from "../synth";

/** Grondement sombre façon « vous êtes mort » : coup grave puis nappe dissonante filtrée. */
export const souls: Recipe = (ctx, out, t) => {
  thump(ctx, out, t + 0.3, { from: 80, to: 28, peak: 0.9, duration: 1.4 });
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  const gain = envelope(ctx, t + 0.3, 0.14, 0.5, 1.2, 0.8);
  filter.connect(gain).connect(out);
  for (const midi of [33, 39, 40]) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = hz(midi);
    osc.connect(filter);
    osc.start(t + 0.3);
    osc.stop(t + 3);
  }
};

/** Game over d'arcade : descente chromatique, puis décompte de « continuer ». */
export const arcade: Recipe = (ctx, out, t) => {
  melody(ctx, out, t + 0.1, [[67, 1], [66, 1], [65, 1], [64, 3]], { bpm: 300, wave: "square", peak: 0.09 });
  for (let i = 0; i < 8; i++) tone(ctx, out, t + 1.05 + i * 0.17, "square", 988, 988, 0, 0.05, 0.002, 0.03, 0.02);
  tone(ctx, out, t + 2.45, "square", 330, 110, 0.25, 0.08, 0.004, 0.05, 0.2);
};

/** Level up : trois hitmarkers puis arpège montant. */
export const xp: Recipe = (ctx, out, t) => {
  for (const offset of [0, 0.12, 0.24]) hitmarker(ctx, out, t + offset);
  melody(ctx, out, t + 0.62, [[72, 1], [76, 1], [79, 1], [84, 3]], { bpm: 560, wave: "square", peak: 0.08 });
};

/** Série d'éliminations : un hitmarker par victime, airhorn et basse au pentakill. */
export const killstreak: Recipe = (ctx, out, t) => {
  for (const offset of [0.15, 0.45, 0.8, 1.15, 1.5]) {
    hitmarker(ctx, out, t + offset);
    hitmarker(ctx, out, t + offset + 0.07);
    thump(ctx, out, t + offset, { from: 120, to: 50, peak: 0.35, duration: 0.18 });
  }
  airhorn(ctx, out, t + 1.5);
  wobble(ctx, out, t + 2.05, 0.7);
};

/** Combo de baston : rafale de coups, K.O. et petite victoire en chiptune. */
export const baston: Recipe = (ctx, out, t) => {
  thump(ctx, out, t + 0.05, { from: 200, to: 60, peak: 0.4, duration: 0.2 });
  thump(ctx, out, t + 0.55, { from: 240, to: 70, peak: 0.45, duration: 0.2 });
  for (let i = 0; i < 12; i++) punch(ctx, out, t + 0.9 + i * 0.085, 0.32 + (i % 3) * 0.05);
  thump(ctx, out, t + 1.95, { from: 110, to: 30, peak: 0.9, duration: 0.8 });
  noiseSweep(ctx, out, t + 1.95, { type: "lowpass", from: 3000, to: 200, peak: 0.3, duration: 0.6 });
  melody(ctx, out, t + 2.3, [[72, 1], [72, 1], [79, 2]], { bpm: 480, wave: "square", peak: 0.07 });
};

/** Nyan-chope : petite mélodie chiptune originale, basse en triangle. */
export const nyan: Recipe = (ctx, out, t) => {
  const lead: Array<[number | null, number]> = [
    [76, 1], [79, 1], [84, 2], [83, 1], [79, 1], [76, 2],
    [74, 1], [76, 1], [79, 1], [81, 1], [79, 2], [76, 2],
    [77, 1], [81, 1], [84, 2], [86, 1], [84, 1], [81, 2],
    [79, 1], [76, 1], [74, 1], [72, 1], [74, 2], [79, 2],
  ];
  melody(ctx, out, t + 0.05, lead, { bpm: 520, wave: "square", peak: 0.06, gate: 0.7 });
  const bass: Array<[number | null, number]> = [
    [48, 2], [55, 2], [48, 2], [55, 2], [45, 2], [52, 2], [45, 2], [52, 2],
    [41, 2], [48, 2], [41, 2], [48, 2], [43, 2], [50, 2], [43, 2], [50, 2],
  ];
  melody(ctx, out, t + 0.05, bass, { bpm: 520, wave: "triangle", peak: 0.12, gate: 0.6 });
};

/** Illuminati : montage MLG complet, puis thérémine inquiétant. */
export const illuminati: Recipe = (ctx, out, t) => {
  airhorn(ctx, out, t);
  for (const offset of [0.06, 0.26, 0.44, 0.72, 0.94, 1.12, 1.3]) hitmarker(ctx, out, t + offset);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  const start = t + 1.25;
  const path = [69, 72, 71, 67, 68, 64];
  path.forEach((midi, index) => {
    const at = start + index * 0.28;
    if (index === 0) osc.frequency.setValueAtTime(hz(midi), at);
    else osc.frequency.exponentialRampToValueAtTime(hz(midi), at);
  });
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 6.5;
  const depth = ctx.createGain();
  depth.gain.value = 9;
  vibrato.connect(depth).connect(osc.frequency);
  const gain = envelope(ctx, start, 0.12, 0.15, 1.5, 0.4);
  osc.connect(gain).connect(out);
  osc.start(start);
  osc.stop(start + 2.2);
  vibrato.start(start);
  vibrato.stop(start + 2.2);
  wobble(ctx, out, t + 1.9, 1.2);
};

/** Code triche : un bip par touche, montée de puissance, fanfare chiptune et feux d'artifice. */
export const konami: Recipe = (ctx, out, t) => {
  const pitches = [84, 84, 72, 72, 76, 79, 76, 79, 88, 91];
  pitches.forEach((midi, index) => tone(ctx, out, t + 0.1 + index * 0.12, "square", hz(midi), hz(midi), 0, 0.06, 0.002, 0.04, 0.03));
  tone(ctx, out, t + 1.35, "square", hz(60), hz(96), 0.35, 0.06, 0.005, 0.3, 0.05);
  melody(ctx, out, t + 1.75, [[72, 1], [76, 1], [79, 1], [84, 2], [79, 1], [84, 4]], { bpm: 600, wave: "square", peak: 0.08 });
  melody(ctx, out, t + 1.75, [[48, 2], [55, 2], [60, 6]], { bpm: 600, wave: "triangle", peak: 0.12 });
  for (const offset of [2.05, 2.45, 2.85]) {
    noiseSweep(ctx, out, t + offset - 0.25, { type: "bandpass", from: 400, to: 2400, q: 2, peak: 0.08, duration: 0.25 });
    thump(ctx, out, t + offset, { from: 300, to: 60, peak: 0.35, duration: 0.25 });
  }
};

export const STINGS: Record<EggLevel, Recipe> = {
  fail: (ctx, out, t) => melody(ctx, out, t, [[67, 1], [66, 1], [65, 1], [64, 3]], { bpm: 360, wave: "square", peak: 0.08 }),
  small: (ctx, out, t) => coin(ctx, out, t),
  combo: (ctx, out, t) => {
    hitmarker(ctx, out, t);
    hitmarker(ctx, out, t + 0.1);
    coin(ctx, out, t + 0.22);
  },
  legendary: (ctx, out, t) => {
    airhornBlast(ctx, out, t, 0.14);
    airhornBlast(ctx, out, t + 0.2, 0.4);
  },
};
