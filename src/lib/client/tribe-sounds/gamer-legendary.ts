/**
 * Sons des apothéoses légendaires gamer (chargés avec leur animation) :
 * montage MLG, code triche, butin, record du monde, boss final, évolution,
 * rage quit. Tout est synthétisé ; mélodies originales (aucune reprise de
 * thème de jeu, aucun jingle existant).
 */

import { airhorn, distortionCurve, envelope, hitmarker, noiseBurst, tone, wobble, type Recipe } from "@/lib/sound";
import { bell, coin, crowd, fanfare, hz, melody, noiseSweep, pad, punch, sparkle, thump } from "../synth";

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

/** Butin légendaire : coffre qui tombe et tremble, grincement, gong grave et scintillement, pièces, fanfare. */
export const loot: Recipe = (ctx, out, t) => {
  thump(ctx, out, t + 0.42, { from: 150, to: 45, peak: 0.6, duration: 0.3 });
  noiseBurst(ctx, out, t + 0.42, "lowpass", 900, 0.7, 0.25, 0.12);
  for (const offset of [0.62, 0.86]) {
    noiseBurst(ctx, out, t + offset, "bandpass", 1500, 3, 0.16, 0.06);
    thump(ctx, out, t + offset, { from: 240, to: 130, peak: 0.2, duration: 0.08 });
  }
  noiseSweep(ctx, out, t + 1.0, { type: "bandpass", from: 480, to: 1300, q: 12, peak: 0.1, duration: 0.2 });
  bell(ctx, out, t + 1.12, 98, { peak: 0.28, decay: 2.2, partials: [1, 2.02, 2.76, 4.1, 5.4] });
  thump(ctx, out, t + 1.12, { from: 90, to: 32, peak: 0.6, duration: 0.8 });
  sparkle(ctx, out, t + 1.2, { base: 79, count: 10, step: 0.06, peak: 0.05 });
  pad(ctx, out, t + 1.15, [55, 62, 67, 71], 2.3, { peak: 0.08 });
  for (let i = 0; i < 7; i++) coin(ctx, out, t + 1.75 + i * 0.1, 0.03);
  fanfare(ctx, out, t + 2.6, [[[67, 71, 74], 1], [[72, 76, 79], 3]], { bpm: 280, peak: 0.11 });
};

/** Les instants des splits du record (partagés avec l'animation). */
export const SPEEDRUN_SPLITS = [0.62, 0.98, 1.34, 1.7, 2.1] as const;

/** Record du monde : tic du chrono, un carillon par split (scintillement pour les dorés), fanfare chiptune, public. */
export const speedrun: Recipe = (ctx, out, t) => {
  for (let i = 0; i < 19; i++) tone(ctx, out, t + 0.2 + i * 0.1, "square", 2400, 2400, 0, 0.012, 0.001, 0.004, 0.01);
  SPEEDRUN_SPLITS.forEach((at, index) => {
    const midi = 76 + index * 2;
    tone(ctx, out, t + at, "square", hz(midi), hz(midi), 0, 0.06, 0.003, 0.05, 0.08);
    if (index === 2 || index === 4) sparkle(ctx, out, t + at + 0.04, { base: 88, count: 4, step: 0.035, peak: 0.04 });
  });
  thump(ctx, out, t + 2.2, { from: 180, to: 45, peak: 0.6, duration: 0.4 });
  melody(ctx, out, t + 2.2, [[72, 1], [76, 1], [79, 1], [84, 3], [83, 1], [84, 5]], { bpm: 560, wave: "square", peak: 0.08 });
  melody(ctx, out, t + 2.2, [[48, 3], [55, 3], [60, 6]], { bpm: 560, wave: "triangle", peak: 0.12 });
  crowd(ctx, out, t + 2.25, 1.4, 0.1);
};

/** Les instants des coups portés au boss (partagés avec l'animation). */
export const BOSS_HITS = [0.35, 0.55, 0.72, 0.9, 1.05, 1.22, 1.4] as const;

/** Boss final : grondement, rafale de coups, cri saturé du boss, fanfare de victoire, level up en cascade. */
export const boss: Recipe = (ctx, out, t) => {
  thump(ctx, out, t + 0.02, { from: 70, to: 28, peak: 0.55, duration: 0.9 });
  BOSS_HITS.forEach((at, index) => {
    punch(ctx, out, t + at, index === BOSS_HITS.length - 1 ? 0.55 : 0.36);
    if (index === 3 || index === 6) hitmarker(ctx, out, t + at + 0.02);
  });
  const roar = ctx.createOscillator();
  roar.type = "sawtooth";
  roar.frequency.setValueAtTime(380, t + 1.58);
  roar.frequency.exponentialRampToValueAtTime(60, t + 2.3);
  const shaper = ctx.createWaveShaper();
  shaper.curve = distortionCurve(20);
  const roarGain = envelope(ctx, t + 1.58, 0.12, 0.03, 0.4, 0.3);
  roar.connect(shaper).connect(roarGain).connect(out);
  roar.start(t + 1.58);
  roar.stop(t + 2.4);
  noiseSweep(ctx, out, t + 1.58, { type: "lowpass", from: 4000, to: 150, peak: 0.28, duration: 0.8 });
  thump(ctx, out, t + 1.6, { from: 110, to: 28, peak: 0.9, duration: 0.9 });
  fanfare(ctx, out, t + 1.8, [[[60, 64, 67], 1], [[60, 64, 67], 1], [[65, 69, 72], 1], [[67, 71, 74], 3]], { bpm: 420, peak: 0.12 });
  for (let i = 0; i < 8; i++) {
    const at = t + 2.35 + i * 0.1;
    const root = 72 + i;
    melody(ctx, out, at, [[root, 1], [root + 4, 1], [root + 7, 1]], { bpm: 1800, wave: "square", peak: 0.045 });
  }
  sparkle(ctx, out, t + 3.15, { base: 84, count: 8, step: 0.04, peak: 0.05 });
};

/** Évolution : texte qui s'écrit, trille qui accélère et monte, souffle, éclosion et fanfare originale. */
export const evolution: Recipe = (ctx, out, t) => {
  for (let i = 0; i < 12; i++) tone(ctx, out, t + 0.05 + i * 0.045, "square", 1200, 1200, 0, 0.02, 0.001, 0.01, 0.01);
  let cursor = t + 0.45;
  let gap = 0.17;
  let step = 0;
  while (cursor < t + 2.25) {
    const midi = 62 + Math.floor((cursor - t) * 5) + (step % 2 ? 5 : 0);
    tone(ctx, out, cursor, "square", hz(midi), hz(midi), 0, 0.045, 0.003, gap * 0.5, 0.02);
    cursor += gap;
    gap = Math.max(0.05, gap * 0.9);
    step += 1;
  }
  pad(ctx, out, t + 0.45, [50, 57, 62], 1.9, { peak: 0.05 });
  noiseSweep(ctx, out, t + 0.6, { type: "bandpass", from: 300, to: 5200, q: 3, peak: 0.07, duration: 1.7 });
  thump(ctx, out, t + 2.3, { from: 160, to: 40, peak: 0.6, duration: 0.5 });
  sparkle(ctx, out, t + 2.32, { base: 84, count: 9, step: 0.04, peak: 0.06 });
  melody(ctx, out, t + 2.5, [[67, 1], [72, 1], [76, 1], [79, 2], [77, 1], [79, 5]], { bpm: 520, wave: "square", peak: 0.07 });
  melody(ctx, out, t + 2.5, [[48, 3], [53, 3], [55, 6]], { bpm: 520, wave: "triangle", peak: 0.11 });
};

/** Les instants où les adversaires quittent la partie (partagés avec l'animation). */
export const RAGEQUIT_TIMES = [0.55, 0.82, 1.06, 1.28, 1.48] as const;

/** Rage quit inversé : un « bloup » de déconnexion par adversaire, manette lancée, frappe de « gg ez », correction, victoire. */
export const ragequit: Recipe = (ctx, out, t) => {
  RAGEQUIT_TIMES.forEach((at, index) => {
    tone(ctx, out, t + at, "sine", 880 - index * 30, 880 - index * 30, 0, 0.1, 0.003, 0.04, 0.05);
    tone(ctx, out, t + at + 0.08, "sine", 587 - index * 20, 587 - index * 20, 0, 0.1, 0.003, 0.04, 0.12);
    noiseSweep(ctx, out, t + at - 0.05, { type: "bandpass", from: 1800, to: 500, q: 2, peak: 0.06, duration: 0.2 });
  });
  for (let i = 0; i < 5; i++) noiseBurst(ctx, out, t + 1.95 + i * 0.075, "bandpass", 3200, 2, 0.12, 0.02);
  noiseSweep(ctx, out, t + 2.45, { type: "highpass", from: 2000, to: 7000, q: 1, peak: 0.06, duration: 0.25 });
  sparkle(ctx, out, t + 2.5, { base: 84, count: 5, step: 0.04, peak: 0.05 });
  melody(ctx, out, t + 2.7, [[72, 1], [74, 1], [76, 1], [79, 4]], { bpm: 600, wave: "square", peak: 0.07 });
  melody(ctx, out, t + 2.7, [[48, 3], [55, 4]], { bpm: 600, wave: "triangle", peak: 0.11 });
};
