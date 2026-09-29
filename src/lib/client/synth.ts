/**
 * Briques de synthèse pour les sons des tribus (fanfares, accords saturés, verres
 * qui trinquent, dés qui roulent...). Tout est généré en WebAudio : aucun sample.
 *
 * Ce module n'est importé que par les modules de sons des tribus, eux-mêmes
 * chargés avec les animations : il ne pèse rien dans le bundle principal.
 */

import { distortionCurve, envelope, noiseBuffer, tone } from "@/lib/sound";

/** Numéro de note MIDI vers fréquence (69 = la 440). */
export function hz(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

/** Souffle filtré dont la fréquence glisse : whoosh, vent, balayage, flammes. */
export function noiseSweep(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  {
    type = "bandpass",
    from,
    to,
    q = 1,
    peak = 0.3,
    attack = 0.03,
    duration,
  }: { type?: BiquadFilterType; from: number; to: number; q?: number; peak?: number; attack?: number; duration: number },
) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + duration);
  const gain = envelope(ctx, t, peak, attack, Math.max(0, duration - attack - 0.12), 0.12);
  source.connect(filter).connect(gain).connect(out);
  source.start(t);
  source.stop(t + duration + 0.1);
}

/**
 * Mélodie : suite de [note MIDI ou null pour un silence, durée en temps].
 * Renvoie l'instant de fin, pour enchaîner.
 */
export function melody(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  notes: ReadonlyArray<readonly [number | null, number]>,
  { bpm, wave = "square", peak = 0.09, gate = 0.82 }: { bpm: number; wave?: OscillatorType; peak?: number; gate?: number },
): number {
  const beat = 60 / bpm;
  let cursor = t;
  for (const [note, beats] of notes) {
    const length = beats * beat;
    if (note !== null) {
      const frequency = hz(note);
      tone(ctx, out, cursor, wave, frequency, frequency, 0, peak, 0.004, Math.max(0.01, length * gate - 0.03), 0.03);
    }
    cursor += length;
  }
  return cursor;
}

/** Accord de puissance saturé (fondamentale, quinte, octave), façon guitare électrique. */
export function powerChord(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  root: number,
  duration: number,
  { peak = 0.2, mute = false, drive = 40, vibrato = 0 }: { peak?: number; mute?: boolean; drive?: number; vibrato?: number } = {},
) {
  const input = ctx.createGain();
  input.gain.value = 0.5;
  const shaper = ctx.createWaveShaper();
  shaper.curve = distortionCurve(drive);
  shaper.oversample = "2x";
  const cabinet = ctx.createBiquadFilter();
  cabinet.type = "lowpass";
  cabinet.frequency.value = mute ? 900 : 3400;
  cabinet.Q.value = 0.9;
  const body = ctx.createBiquadFilter();
  body.type = "highpass";
  body.frequency.value = 70;
  const release = mute ? 0.05 : 0.35;
  const gain = envelope(ctx, t, peak, 0.004, Math.max(0.01, duration - release), release);
  input.connect(shaper).connect(cabinet).connect(body).connect(gain).connect(out);

  let lfo: OscillatorNode | null = null;
  let lfoDepth: GainNode | null = null;
  if (vibrato > 0) {
    lfo = ctx.createOscillator();
    lfo.frequency.value = 6;
    lfoDepth = ctx.createGain();
    lfoDepth.gain.setValueAtTime(0, t);
    lfoDepth.gain.linearRampToValueAtTime(vibrato, t + Math.min(0.6, duration));
    lfo.connect(lfoDepth);
    lfo.start(t);
    lfo.stop(t + duration + 0.1);
  }

  for (const interval of [0, 7, 12]) {
    for (const detune of [-7, 7]) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = hz(root + interval);
      osc.detune.value = detune;
      if (lfoDepth) lfoDepth.connect(osc.detune);
      osc.connect(input);
      osc.start(t);
      osc.stop(t + duration + 0.1);
    }
  }
}

/** Cloche, verre, triangle : partiels inharmoniques qui s'éteignent. */
export function bell(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  frequency: number,
  { peak = 0.16, decay = 1.1, partials = [1, 2.76, 5.4, 8.93] }: { peak?: number; decay?: number; partials?: readonly number[] } = {},
) {
  partials.forEach((ratio, index) => {
    const level = peak / (index + 1);
    tone(ctx, out, t, "sine", frequency * ratio, frequency * ratio, 0, level, 0.002, 0, decay / (1 + index * 0.6));
  });
}

/** Deux chopes qui trinquent : tintement double et petit choc. */
export function clink(ctx: AudioContext, out: AudioNode, t: number, peak = 0.16) {
  bell(ctx, out, t, 1870, { peak, decay: 0.5, partials: [1, 2.3, 3.9] });
  bell(ctx, out, t + 0.018, 2310, { peak: peak * 0.7, decay: 0.4, partials: [1, 2.1] });
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000;
  const gain = envelope(ctx, t, peak * 1.2, 0.001, 0, 0.03);
  source.connect(filter).connect(gain).connect(out);
  source.start(t);
  source.stop(t + 0.08);
}

/** Cuivre de fanfare : scies filtrées dont le filtre s'ouvre à l'attaque. */
export function brass(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  midi: number,
  duration: number,
  { peak = 0.12, bright = 2600 }: { peak?: number; bright?: number } = {},
) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(400, t);
  filter.frequency.exponentialRampToValueAtTime(bright, t + 0.06);
  filter.frequency.exponentialRampToValueAtTime(bright * 0.55, t + Math.max(0.08, duration));
  const gain = envelope(ctx, t, peak, 0.03, Math.max(0.01, duration - 0.1), 0.08);
  filter.connect(gain).connect(out);
  for (const detune of [-6, 6]) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = hz(midi);
    osc.detune.value = detune;
    osc.connect(filter);
    osc.start(t);
    osc.stop(t + duration + 0.1);
  }
}

/** Fanfare : une ligne de cuivres [note, temps] sur un tempo donné. */
export function fanfare(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  notes: ReadonlyArray<readonly [number | readonly number[] | null, number]>,
  { bpm, peak = 0.1 }: { bpm: number; peak?: number },
): number {
  const beat = 60 / bpm;
  let cursor = t;
  for (const [note, beats] of notes) {
    const length = beats * beat;
    if (note !== null) {
      const chord = typeof note === "number" ? [note] : note;
      for (const midi of chord) brass(ctx, out, cursor, midi, length * 0.9, { peak: peak / Math.sqrt(chord.length) });
    }
    cursor += length;
  }
  return cursor;
}

/** Coup sourd : grosse caisse, impact, chute. */
export function thump(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  { from = 150, to = 40, peak = 0.7, duration = 0.3 }: { from?: number; to?: number; peak?: number; duration?: number } = {},
) {
  tone(ctx, out, t, "sine", from, to, duration * 0.6, peak, 0.003, 0.01, duration);
}

/** Coup de poing de jeu de baston : bruit grave filtré et claque. */
export function punch(ctx: AudioContext, out: AudioNode, t: number, peak = 0.5) {
  thump(ctx, out, t, { from: 180, to: 50, peak, duration: 0.14 });
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1200;
  filter.Q.value = 0.8;
  const gain = envelope(ctx, t, peak * 0.8, 0.001, 0.01, 0.07);
  source.connect(filter).connect(gain).connect(out);
  source.start(t);
  source.stop(t + 0.12);
}

/** Scintillement : arpège aigu de sinus cristallins. */
export function sparkle(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  { base = 84, count = 6, step = 0.05, peak = 0.06, intervals = [0, 4, 7, 12, 16, 19, 24] }: {
    base?: number;
    count?: number;
    step?: number;
    peak?: number;
    intervals?: readonly number[];
  } = {},
) {
  for (let i = 0; i < count; i++) {
    const frequency = hz(base + intervals[i % intervals.length] + 12 * Math.floor(i / intervals.length));
    tone(ctx, out, t + i * step, "sine", frequency, frequency, 0, peak, 0.003, 0.01, 0.35);
    tone(ctx, out, t + i * step, "triangle", frequency * 2, frequency * 2, 0, peak * 0.25, 0.003, 0, 0.2);
  }
}

/** Dé qui roule sur la table : clics secs de plus en plus espacés, puis arrêt. */
export function diceRattle(ctx: AudioContext, out: AudioNode, t: number, duration: number, peak = 0.35) {
  let cursor = t;
  let gap = 0.035;
  let index = 0;
  while (cursor < t + duration) {
    const frequency = 2400 + ((index * 997) % 1800);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = 6;
    const level = peak * (0.55 + ((index * 37) % 10) / 22);
    const gain = envelope(ctx, cursor, level, 0.001, 0, 0.025);
    source.connect(filter).connect(gain).connect(out);
    source.start(cursor);
    source.stop(cursor + 0.06);
    cursor += gap;
    gap *= 1.12;
    index += 1;
  }
  thump(ctx, out, cursor, { from: 220, to: 90, peak: peak * 1.3, duration: 0.12 });
}

/** Foule qui acclame : bruit filtré qui gonfle puis retombe. */
export function crowd(ctx: AudioContext, out: AudioNode, t: number, duration: number, peak = 0.12) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.6;
  const wobbleRate = ctx.createOscillator();
  wobbleRate.frequency.value = 3.2;
  const wobbleDepth = ctx.createGain();
  wobbleDepth.gain.value = 260;
  wobbleRate.connect(wobbleDepth).connect(filter.frequency);
  const gain = envelope(ctx, t, peak, duration * 0.3, duration * 0.3, duration * 0.4);
  source.connect(filter).connect(gain).connect(out);
  source.start(t);
  source.stop(t + duration + 0.1);
  wobbleRate.start(t);
  wobbleRate.stop(t + duration + 0.1);
}

/** Nappe douce (accord tenu) pour les moments « magiques ». */
export function pad(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  notes: readonly number[],
  duration: number,
  { peak = 0.05, wave = "triangle" }: { peak?: number; wave?: OscillatorType } = {},
) {
  for (const midi of notes) {
    for (const detune of [-5, 5]) {
      const osc = ctx.createOscillator();
      osc.type = wave;
      osc.frequency.value = hz(midi);
      osc.detune.value = detune;
      const gain = envelope(ctx, t, peak / notes.length, Math.min(0.4, duration * 0.3), duration * 0.4, duration * 0.3);
      osc.connect(gain).connect(out);
      osc.start(t);
      osc.stop(t + duration + 0.1);
    }
  }
}

/** Larsen : sifflement aigu saturé qui monte. */
export function feedback(ctx: AudioContext, out: AudioNode, t: number, duration: number, peak = 0.07) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1650, t);
  osc.frequency.exponentialRampToValueAtTime(2900, t + duration);
  const shaper = ctx.createWaveShaper();
  shaper.curve = distortionCurve(8);
  const gain = envelope(ctx, t, peak, duration * 0.5, duration * 0.3, duration * 0.2);
  osc.connect(shaper).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** Pièce ramassée (jeu de plateforme 8 bits) : deux notes carrées. */
export function coin(ctx: AudioContext, out: AudioNode, t: number, peak = 0.08) {
  tone(ctx, out, t, "square", hz(83), hz(83), 0, peak, 0.002, 0.05, 0.02);
  tone(ctx, out, t + 0.07, "square", hz(88), hz(88), 0, peak, 0.002, 0.18, 0.12);
}

/** Claquement de doigts : craquement sec très court. */
export function snap(ctx: AudioContext, out: AudioNode, t: number, peak = 0.6) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2600;
  filter.Q.value = 1.5;
  const gain = envelope(ctx, t, peak, 0.001, 0.004, 0.05);
  source.connect(filter).connect(gain).connect(out);
  source.start(t);
  source.stop(t + 0.1);
  tone(ctx, out, t, "sine", 1400, 700, 0.02, peak * 0.15, 0.001, 0, 0.04);
}
