/**
 * Sons de la tribu rôliste : d20 qui roule, parchemin, sceau de cire, épée qui
 * adoube, fanfares de cour (mélodies originales) et « womp womp » de l'échec critique.
 */

import type { EggLevel } from "@/components/easter-eggs/catalog";
import { stamp, type Recipe } from "@/lib/sound";
import { bell, brass, diceRattle, fanfare, hz, noiseSweep, pad, sparkle, thump } from "../synth";

function rustle(ctx: AudioContext, out: AudioNode, t: number, count = 3) {
  for (let i = 0; i < count; i++) noiseSweep(ctx, out, t + i * 0.11, { type: "bandpass", from: 2500 + i * 400, to: 1200, q: 1.5, peak: 0.08, attack: 0.01, duration: 0.14 });
}

/** Fanfare de cour : appel de trompettes (original). */
function herald(ctx: AudioContext, out: AudioNode, t: number, peak = 0.13) {
  return fanfare(
    ctx,
    out,
    t,
    [
      [67, 0.5],
      [72, 0.5],
      [76, 0.5],
      [79, 1],
      [76, 0.5],
      [79, 2],
    ],
    { bpm: 200, peak },
  );
}

export const echec: Recipe = (ctx, out, t) => {
  diceRattle(ctx, out, t + 0.3, 1.1, 0.3);
  brass(ctx, out, t + 1.6, 50, 0.35, { peak: 0.13, bright: 1100 });
  brass(ctx, out, t + 1.98, 46, 0.9, { peak: 0.13, bright: 800 });
};

export const parchemin: Recipe = (ctx, out, t) => {
  rustle(ctx, out, t + 0.05, 4);
  stamp(ctx, out, t + 0.9);
  bell(ctx, out, t + 1, hz(84), { peak: 0.05, decay: 0.6 });
};

export const jet: Recipe = (ctx, out, t) => {
  diceRattle(ctx, out, t + 0.3, 1.1, 0.3);
  [72, 76, 79, 84].forEach((midi, index) => bell(ctx, out, t + 1.65 + index * 0.08, hz(midi), { peak: 0.07, decay: 0.8 }));
  brass(ctx, out, t + 1.95, 60, 0.6, { peak: 0.08 });
  brass(ctx, out, t + 1.95, 64, 0.6, { peak: 0.08 });
  brass(ctx, out, t + 1.95, 67, 0.6, { peak: 0.08 });
};

export const adoubement: Recipe = (ctx, out, t) => {
  const end = herald(ctx, out, t + 0.3);
  for (const at of [1.3, 1.7]) {
    bell(ctx, out, t + at, 2200, { peak: 0.1, decay: 0.5, partials: [1, 2.7, 5.1] });
    thump(ctx, out, t + at, { from: 300, to: 120, peak: 0.2, duration: 0.08 });
  }
  pad(ctx, out, end, [60, 64, 67, 72], 1, { peak: 0.1, wave: "sawtooth" });
};

export const vingt: Recipe = (ctx, out, t) => {
  diceRattle(ctx, out, t + 0.25, 1.4, 0.32);
  thump(ctx, out, t + 1.7, { from: 140, to: 40, peak: 0.7, duration: 0.5 });
  const end = fanfare(
    ctx,
    out,
    t + 1.8,
    [
      [[60, 64, 67], 0.5],
      [[60, 64, 67], 0.5],
      [[60, 64, 67], 0.5],
      [[65, 69, 72], 1.5],
      [[67, 71, 74], 1.5],
      [[72, 76, 79], 3],
    ],
    { bpm: 240, peak: 0.18 },
  );
  pad(ctx, out, t + 2.2, [72, 76, 79, 84], end - t - 2.2 + 0.4, { peak: 0.06, wave: "sine" });
  sparkle(ctx, out, t + 2.3, { base: 88, count: 8, step: 0.05, peak: 0.04 });
};

export const blason: Recipe = (ctx, out, t) => {
  herald(ctx, out, t + 0.05, 0.12);
  for (let i = 0; i < 4; i++) thump(ctx, out, t + 0.45 + i * 0.18, { from: 200, to: 80, peak: 0.3, duration: 0.1 });
  bell(ctx, out, t + 1.2, hz(88), { peak: 0.09, decay: 1 });
  rustle(ctx, out, t + 1.45, 3);
  fanfare(ctx, out, t + 1.85, [[[60, 64, 67, 72], 3]], { bpm: 120, peak: 0.16 });
};

export const STINGS: Record<EggLevel, Recipe> = {
  fail: (ctx, out, t) => {
    diceRattle(ctx, out, t, 0.4, 0.28);
    brass(ctx, out, t + 0.6, 46, 0.6, { peak: 0.12, bright: 800 });
  },
  small: (ctx, out, t) => {
    rustle(ctx, out, t, 2);
    stamp(ctx, out, t + 0.25);
  },
  combo: (ctx, out, t) => {
    diceRattle(ctx, out, t, 0.5, 0.28);
    bell(ctx, out, t + 0.75, hz(79), { peak: 0.08, decay: 0.8 });
  },
  legendary: (ctx, out, t) => herald(ctx, out, t, 0.14),
};
