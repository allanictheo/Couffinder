/**
 * Sons de la famille « Vie normale » (mots pas chouffin sans tribu) : oiseaux,
 * vent, flûte champêtre, réveil mécanique, notifications, interrupteurs, poteau
 * qui résonne. Tout est synthétisé, mélodies originales ; volume doux : la vraie
 * vie ne klaxonne pas.
 */

import type { VieLevel } from "@/components/easter-eggs/catalog";
import { envelope, noiseBurst, tone, type Recipe } from "@/lib/sound";
import { bell, crowd, hz, melody, noiseSweep, pad, sparkle, thump } from "../synth";

/** Gazouillis : trois petites glissades aiguës. */
function chirp(ctx: AudioContext, out: AudioNode, t: number, base = 2600, peak = 0.045) {
  for (let i = 0; i < 3; i++) {
    const at = t + i * 0.075;
    tone(ctx, out, at, "sine", base + i * 120, base * 1.6 + i * 160, 0.05, peak, 0.004, 0.02, 0.03);
  }
}

/** Flûte douce : triangle avec vibrato et souffle. */
function flute(ctx: AudioContext, out: AudioNode, t: number, midi: number, duration: number, peak = 0.07) {
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = hz(midi);
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 5.2;
  const depth = ctx.createGain();
  depth.gain.value = hz(midi) * 0.008;
  vibrato.connect(depth).connect(osc.frequency);
  const gain = envelope(ctx, t, peak, 0.04, Math.max(0.01, duration - 0.12), 0.08);
  osc.connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + duration + 0.1);
  vibrato.start(t);
  vibrato.stop(t + duration + 0.1);
  noiseBurst(ctx, out, t, "bandpass", 2400, 1.5, peak * 0.35, 0.08);
}

/** Petite mélodie de flûte : [note, temps]. */
function fluteLine(ctx: AudioContext, out: AudioNode, t: number, notes: ReadonlyArray<readonly [number, number]>, bpm: number, peak = 0.07) {
  const beat = 60 / bpm;
  let cursor = t;
  for (const [midi, beats] of notes) {
    flute(ctx, out, cursor, midi, beats * beat * 0.92, peak);
    cursor += beats * beat;
  }
}

/** Tintement de notification (deux notes rondes). */
function ding(ctx: AudioContext, out: AudioNode, t: number, peak = 0.08) {
  tone(ctx, out, t, "sine", hz(88), hz(88), 0, peak, 0.003, 0.03, 0.25);
  tone(ctx, out, t + 0.09, "sine", hz(93), hz(93), 0, peak, 0.003, 0.05, 0.4);
}

/** Vibreur de téléphone : bourdonnement grave haché. */
function buzz(ctx: AudioContext, out: AudioNode, t: number, duration = 0.18, peak = 0.06) {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = 150;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;
  const gain = envelope(ctx, t, peak, 0.01, duration - 0.04, 0.03);
  osc.connect(filter).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** Interrupteur à glissière : petit clic sec et note brève (plus grave pour « non »). */
function toggle(ctx: AudioContext, out: AudioNode, t: number, on: boolean) {
  noiseBurst(ctx, out, t, "highpass", 4000, 0.8, 0.12, 0.015);
  tone(ctx, out, t, "sine", on ? 1300 : 700, on ? 1300 : 700, 0, 0.05, 0.002, 0.01, 0.05);
}

/** Sonnerie de réveil mécanique : le marteau bat les deux cloches très vite. */
function alarmRing(ctx: AudioContext, out: AudioNode, t: number, duration: number, peak = 0.05) {
  for (let at = 0; at < duration; at += 0.05) {
    const frequency = at % 0.1 < 0.05 ? 2093 : 2349;
    bell(ctx, out, t + at, frequency, { peak, decay: 0.12, partials: [1, 2.4] });
  }
}

/** Pichenette de ukulélé (triangle très court). */
function pluck(ctx: AudioContext, out: AudioNode, t: number, midi: number, peak = 0.07) {
  tone(ctx, out, t, "triangle", hz(midi), hz(midi), 0, peak, 0.002, 0.01, 0.35);
  tone(ctx, out, t, "sine", hz(midi + 12), hz(midi + 12), 0, peak * 0.3, 0.002, 0, 0.15);
}

/** Petit « ploc » (une tartine qui atterrit). */
function plop(ctx: AudioContext, out: AudioNode, t: number, peak = 0.08) {
  tone(ctx, out, t, "sine", 700, 180, 0.08, peak, 0.002, 0.01, 0.08);
}

/* ------------------------------------------------------------------ */
/* Normie absolu (0 à 20)                                               */
/* ------------------------------------------------------------------ */

/** Touche de l'herbe : porte qui s'ouvre sur le dehors, vent, oiseaux, herbe qui pousse, le doigt qui touche, flûte de zone découverte. */
export const herbe: Recipe = (ctx, out, t) => {
  noiseSweep(ctx, out, t + 0.1, { type: "highpass", from: 600, to: 3000, q: 0.7, peak: 0.08, duration: 0.5 });
  noiseSweep(ctx, out, t + 0.3, { type: "lowpass", from: 500, to: 900, q: 0.5, peak: 0.04, duration: 3 });
  noiseSweep(ctx, out, t + 0.35, { type: "bandpass", from: 2200, to: 4200, q: 1.2, peak: 0.05, duration: 0.8 });
  for (const at of [0.5, 0.95, 1.35, 2.5]) chirp(ctx, out, t + at, 2500 + at * 200);
  tone(ctx, out, t + 1.55, "sine", 330, 660, 0.12, 0.12, 0.004, 0.05, 0.2);
  sparkle(ctx, out, t + 1.58, { base: 88, count: 5, step: 0.04, peak: 0.05 });
  tone(ctx, out, t + 1.68, "square", hz(84), hz(84), 0, 0.04, 0.002, 0.05, 0.05);
  tone(ctx, out, t + 1.75, "square", hz(91), hz(91), 0, 0.04, 0.002, 0.12, 0.1);
  pad(ctx, out, t + 1.95, [60, 67, 72, 76], 1.5, { peak: 0.05 });
  fluteLine(ctx, out, t + 2.0, [[72, 1], [76, 1], [79, 1], [84, 2], [81, 1], [84, 3]], 300);
};

/** La grande lumière jaune : grillons de la nuit, aube en nappe qui monte, grésillement, « aïe », dégât, flûte. */
export const soleil: Recipe = (ctx, out, t) => {
  for (let i = 0; i < 6; i++) tone(ctx, out, t + 0.05 + i * 0.16, "sine", 4200, 4400, 0.02, 0.02, 0.002, 0.03, 0.02);
  pad(ctx, out, t + 0.3, [55, 62, 67, 71], 2.6, { peak: 0.07 });
  noiseSweep(ctx, out, t + 0.3, { type: "bandpass", from: 300, to: 2400, q: 1, peak: 0.04, duration: 1.4 });
  chirp(ctx, out, t + 1.1, 2800);
  noiseSweep(ctx, out, t + 1.35, { type: "highpass", from: 3000, to: 8000, q: 0.7, peak: 0.07, duration: 0.5 });
  tone(ctx, out, t + 1.5, "sine", 700, 1300, 0.1, 0.1, 0.005, 0.05, 0.02);
  tone(ctx, out, t + 1.66, "sine", 1300, 500, 0.18, 0.1, 0.005, 0.04, 0.08);
  tone(ctx, out, t + 2.0, "square", hz(64), hz(52), 0.2, 0.05, 0.003, 0.15, 0.05);
  chirp(ctx, out, t + 2.3, 3000);
  fluteLine(ctx, out, t + 2.55, [[79, 1], [76, 1], [72, 2]], 360, 0.06);
};

/** Instants où les tâches de la vie normale se cochent (partagés avec l'animation). */
export const CHORES_AT = [0.5, 0.88, 1.26, 1.64, 2.0, 2.32] as const;
/** Instant où la barre finit (après son blocage à 99 %). */
export const LOADED_AT = 3.0;

/** Chargement de la vie normale : musique d'ascenseur originale, un tic par tâche cochée, blocage à 99 %, carillon poli. */
export const chargement: Recipe = (ctx, out, t) => {
  const chords: ReadonlyArray<readonly number[]> = [
    [60, 64, 67, 71],
    [57, 60, 64, 67],
    [62, 65, 69, 72],
    [55, 59, 62, 65],
  ];
  chords.forEach((chord, index) => pad(ctx, out, t + 0.1 + index * 0.72, chord, 0.8, { peak: 0.045, wave: "sine" }));
  melody(ctx, out, t + 0.1, [[76, 1], [null, 1], [74, 1], [72, 1], [71, 2], [null, 2], [72, 1], [74, 1], [76, 2]], { bpm: 200, wave: "sine", peak: 0.04 });
  for (const at of CHORES_AT) {
    tone(ctx, out, t + at, "sine", 1175, 1175, 0, 0.06, 0.002, 0.02, 0.1);
    tone(ctx, out, t + at + 0.05, "sine", 1568, 1568, 0, 0.05, 0.002, 0.02, 0.15);
  }
  tone(ctx, out, t + 2.5, "sine", 400, 330, 0.3, 0.05, 0.01, 0.2, 0.1);
  for (const [offset, midi] of [[0, 76], [0.12, 79], [0.24, 84]] as const) tone(ctx, out, t + LOADED_AT + offset, "sine", hz(midi), hz(midi), 0, 0.08, 0.004, 0.05, 0.5);
};

/* ------------------------------------------------------------------ */
/* Vie ordinaire (21 à 40)                                              */
/* ------------------------------------------------------------------ */

/** Réveil du lundi : sonnerie mécanique, tape sur « rappel », deuxième sonnerie, soupir. */
export const reveil: Recipe = (ctx, out, t) => {
  alarmRing(ctx, out, t + 0.12, 0.85);
  thump(ctx, out, t + 1.1, { from: 200, to: 70, peak: 0.4, duration: 0.12 });
  noiseBurst(ctx, out, t + 1.1, "bandpass", 1800, 1.5, 0.15, 0.04);
  alarmRing(ctx, out, t + 1.62, 0.55);
  tone(ctx, out, t + 2.3, "sawtooth", 220, 110, 0.5, 0.05, 0.02, 0.2, 0.3);
};

/** Instants d'arrivée des notifications (partagés avec l'animation). */
export const NOTIFICATIONS_AT = [0.3, 0.72, 1.14, 1.56, 1.98] as const;

/** Réseau pro : un vibreur et un tintement par notification, puis petit carillon d'open space. */
export const reseau: Recipe = (ctx, out, t) => {
  for (const at of NOTIFICATIONS_AT) {
    buzz(ctx, out, t + at - 0.02);
    ding(ctx, out, t + at + 0.04, 0.06);
  }
  melody(ctx, out, t + 2.4, [[72, 1], [77, 1], [81, 2]], { bpm: 420, wave: "sine", peak: 0.06 });
};

/** Pluie d'avocado toasts : machine à café, ukulélé original, « plocs ». */
export const avocat: Recipe = (ctx, out, t) => {
  noiseSweep(ctx, out, t + 0.05, { type: "bandpass", from: 1800, to: 900, q: 1, peak: 0.05, duration: 0.6 });
  const tune: ReadonlyArray<readonly [number, number]> = [
    [67, 0], [71, 0.2], [74, 0.4], [79, 0.6], [69, 0.9], [72, 1.1], [76, 1.3], [81, 1.5], [67, 1.8], [71, 2.0], [74, 2.2], [79, 2.4],
  ];
  for (const [midi, at] of tune) pluck(ctx, out, t + 0.3 + at, midi, 0.06);
  for (const at of [0.5, 0.8, 1.05, 1.4, 1.65, 1.95, 2.2]) plop(ctx, out, t + at, 0.05);
};

/** Instants où les interrupteurs basculent, et leur nouvel état (partagés avec l'animation). */
export const TOGGLES = [
  { at: 0.45, on: true },
  { at: 0.8, on: true },
  { at: 1.05, on: true },
  { at: 1.3, on: true },
  { at: 1.55, on: false },
  { at: 1.8, on: false },
  { at: 2.05, on: true },
] as const;

/** Mode adulte : un clic par interrupteur, puis carillon sage. */
export const adulte: Recipe = (ctx, out, t) => {
  for (const { at, on } of TOGGLES) toggle(ctx, out, t + at, on);
  for (const [offset, midi] of [[0, 72], [0.1, 76], [0.2, 79], [0.3, 84]] as const) tone(ctx, out, t + 2.3 + offset, "sine", hz(midi), hz(midi), 0, 0.06, 0.004, 0.04, 0.4);
};

/* ------------------------------------------------------------------ */
/* Presque chouffin (41 à 50)                                           */
/* ------------------------------------------------------------------ */

/** Si près du but : frappe, poteau qui résonne, « ooooh » du public. */
export const poteau: Recipe = (ctx, out, t) => {
  thump(ctx, out, t + 0.05, { from: 180, to: 60, peak: 0.45, duration: 0.12 });
  noiseSweep(ctx, out, t + 0.1, { type: "bandpass", from: 800, to: 2400, q: 1.5, peak: 0.04, duration: 0.45 });
  bell(ctx, out, t + 0.58, 523, { peak: 0.14, decay: 1.1, partials: [1, 2.63, 4.2, 6.8] });
  crowd(ctx, out, t + 0.66, 1.1, 0.07);
  tone(ctx, out, t + 0.7, "sawtooth", 330, 220, 0.9, 0.025, 0.1, 0.4, 0.4);
};

/** Il manque une Chouffe : ça coule, ça s'arrête, deux notes gênées. */
export const chope: Recipe = (ctx, out, t) => {
  noiseSweep(ctx, out, t + 0.15, { type: "bandpass", from: 500, to: 1400, q: 3, peak: 0.07, duration: 0.8 });
  for (let i = 0; i < 6; i++) tone(ctx, out, t + 0.2 + i * 0.12, "sine", 500 + i * 60, 900 + i * 60, 0.04, 0.02, 0.003, 0.01, 0.03);
  tone(ctx, out, t + 1.05, "sine", hz(71), hz(71), 0, 0.07, 0.004, 0.08, 0.1);
  tone(ctx, out, t + 1.25, "sine", hz(67), hz(67), 0, 0.07, 0.004, 0.15, 0.25);
};

/** Signatures courtes du mode réduit, par tranche. */
export const STINGS: Record<VieLevel, Recipe> = {
  normie: (ctx, out, t) => {
    chirp(ctx, out, t, 2700);
    ding(ctx, out, t + 0.25, 0.05);
  },
  ordinaire: (ctx, out, t) => alarmRing(ctx, out, t, 0.4, 0.04),
  presque: (ctx, out, t) => {
    tone(ctx, out, t, "sine", hz(71), hz(71), 0, 0.07, 0.004, 0.08, 0.1);
    tone(ctx, out, t + 0.2, "sine", hz(67), hz(67), 0, 0.07, 0.004, 0.15, 0.25);
  },
};
