/**
 * Effets sonores 100 % synthétisés en WebAudio : aucun fichier audio, aucun sample
 * sous droits. Tout est généré à la volée (oscillateurs, bruit blanc, filtres).
 *
 * Le contexte audio n'est créé qu'au premier appel (qui doit suivre un geste de
 * l'utilisateur, sinon le navigateur le laisse suspendu).
 */

export type SfxName =
  | "airhorn"
  | "hitmarker"
  | "mlgCombo"
  | "stamp"
  | "flat"
  | "sadTrombone"
  | "achievement"
  | "vote"
  | "flip"
  | "toggle";

/** Une recette sonore : planifie ses nœuds sur `out` à partir de l'instant `t`. */
export type Recipe = (ctx: AudioContext, out: AudioNode, t: number) => void;

export interface SfxHandle {
  /** Coupe le son en douceur (utile quand on zappe une animation). */
  stop: () => void;
}

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let context: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
    master = context.createGain();
    master.gain.value = 0.6;
    // Le compresseur évite que l'airhorn ne sature les petits haut-parleurs.
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.ratio.value = 6;
    master.connect(compressor);
    compressor.connect(context.destination);
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

/** À appeler dans un gestionnaire de clic pour « déverrouiller » l'audio (iOS). */
export function unlockAudio() {
  getContext();
}

export function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noise;
}

export function distortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const samples = 1024;
  const curve = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((1 + amount) * x) / (1 + amount * Math.abs(x));
  }
  return curve;
}

/** Enveloppe d'amplitude : attaque, maintien, relâchement (exponentiels). */
export function envelope(ctx: AudioContext, t: number, peak: number, attack: number, hold: number, release: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.setValueAtTime(peak, t + attack + hold);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
  return gain;
}

export function tone(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  type: OscillatorType,
  from: number,
  to: number,
  glide: number,
  peak: number,
  attack: number,
  hold: number,
  release: number,
) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + glide);
  const gain = envelope(ctx, t, peak, attack, hold, release);
  osc.connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + attack + hold + release + 0.05);
}

export function noiseBurst(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  filterType: BiquadFilterType,
  frequency: number,
  q: number,
  peak: number,
  duration: number,
) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const gain = envelope(ctx, t, peak, 0.002, 0, duration);
  source.connect(filter).connect(gain).connect(out);
  source.start(t);
  source.stop(t + duration + 0.05);
}

/** Une note de corne de brume : accord de dents de scie désaccordées, saturé. */
export function airhornBlast(ctx: AudioContext, out: AudioNode, t: number, duration: number) {
  const shaper = ctx.createWaveShaper();
  shaper.curve = distortionCurve(14);
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 2800;
  lowpass.Q.value = 0.7;
  const gain = envelope(ctx, t, 0.22, 0.012, Math.max(0, duration - 0.07), 0.06);
  gain.connect(shaper).connect(lowpass).connect(out);

  for (const frequency of [349.23, 440, 523.25]) {
    for (const detune of [-8, 8]) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.detune.value = detune;
      osc.frequency.setValueAtTime(frequency * 0.92, t);
      osc.frequency.exponentialRampToValueAtTime(frequency, t + 0.05);
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + duration + 0.05);
    }
  }
}

export function airhorn(ctx: AudioContext, out: AudioNode, t: number) {
  airhornBlast(ctx, out, t, 0.17);
  airhornBlast(ctx, out, t + 0.23, 0.13);
  airhornBlast(ctx, out, t + 0.42, 0.62);
}

export function hitmarker(ctx: AudioContext, out: AudioNode, t: number) {
  noiseBurst(ctx, out, t, "bandpass", 3400, 1.4, 0.55, 0.045);
  tone(ctx, out, t, "square", 1700, 1500, 0.03, 0.08, 0.001, 0, 0.035);
}

/** Basse « wub wub » façon drop dubstep 2012 : scie grave + filtre modulé. */
export function wobble(ctx: AudioContext, out: AudioNode, t: number, duration: number) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 9;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 5.5;
  const depth = ctx.createGain();
  depth.gain.value = 360;
  lfo.connect(depth).connect(filter.frequency);
  const gain = envelope(ctx, t, 0.3, 0.04, duration - 0.3, 0.26);
  filter.connect(gain).connect(out);
  for (const frequency of [55, 55.4]) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = frequency;
    osc.connect(filter);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }
  lfo.start(t);
  lfo.stop(t + duration + 0.05);
}

function mlgCombo(ctx: AudioContext, out: AudioNode, t: number) {
  airhorn(ctx, out, t);
  for (const offset of [0.06, 0.26, 0.44, 0.72, 0.94]) hitmarker(ctx, out, t + offset);
  wobble(ctx, out, t + 1.05, 1.3);
}

export function stamp(ctx: AudioContext, out: AudioNode, t: number) {
  tone(ctx, out, t, "sine", 160, 42, 0.14, 0.7, 0.004, 0.02, 0.22);
  noiseBurst(ctx, out, t, "lowpass", 1400, 0.5, 0.35, 0.06);
}

/** Verdict « pas chouffin » : un petit clic plat et poli, très 2013. */
function flat(ctx: AudioContext, out: AudioNode, t: number) {
  tone(ctx, out, t, "sine", 660, 660, 0, 0.14, 0.004, 0.02, 0.12);
  tone(ctx, out, t + 0.09, "sine", 495, 495, 0, 0.12, 0.004, 0.02, 0.18);
}

export function sadTrombone(ctx: AudioContext, out: AudioNode, t: number) {
  const notes: Array<[number, number]> = [
    [293.66, 0.3],
    [277.18, 0.3],
    [261.63, 0.3],
    [246.94, 1.0],
  ];
  let cursor = t;
  notes.forEach(([frequency, duration], index) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, cursor);
    if (index === notes.length - 1) {
      const vibrato = ctx.createOscillator();
      vibrato.frequency.value = 5.5;
      const vibratoDepth = ctx.createGain();
      vibratoDepth.gain.setValueAtTime(0, cursor);
      vibratoDepth.gain.linearRampToValueAtTime(7, cursor + 0.25);
      vibrato.connect(vibratoDepth).connect(osc.frequency);
      vibrato.start(cursor);
      vibrato.stop(cursor + duration + 0.05);
    }
    const wah = ctx.createBiquadFilter();
    wah.type = "lowpass";
    wah.Q.value = 4;
    wah.frequency.setValueAtTime(350, cursor);
    wah.frequency.exponentialRampToValueAtTime(1300, cursor + 0.08);
    wah.frequency.exponentialRampToValueAtTime(600, cursor + duration);
    const gain = envelope(ctx, cursor, 0.2, 0.03, duration - 0.1, 0.07);
    osc.connect(wah).connect(gain).connect(out);
    osc.start(cursor);
    osc.stop(cursor + duration + 0.05);
    cursor += duration + 0.04;
  });
}

/** Carillon de succès générique (deux notes cristallines + souffle). */
export function achievement(ctx: AudioContext, out: AudioNode, t: number) {
  noiseBurst(ctx, out, t, "bandpass", 2400, 0.8, 0.06, 0.35);
  tone(ctx, out, t, "triangle", 784, 784, 0, 0.2, 0.005, 0.03, 0.4);
  tone(ctx, out, t, "sine", 392, 392, 0, 0.12, 0.005, 0.03, 0.4);
  tone(ctx, out, t + 0.13, "triangle", 1174.66, 1174.66, 0, 0.2, 0.005, 0.05, 0.7);
  tone(ctx, out, t + 0.13, "sine", 2349.32, 2349.32, 0, 0.04, 0.005, 0.05, 0.6);
}

function vote(ctx: AudioContext, out: AudioNode, t: number) {
  tone(ctx, out, t, "sine", 520, 900, 0.07, 0.22, 0.004, 0.02, 0.14);
}

function flip(ctx: AudioContext, out: AudioNode, t: number) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 2;
  filter.frequency.setValueAtTime(300, t);
  filter.frequency.exponentialRampToValueAtTime(4200, t + 0.32);
  const gain = envelope(ctx, t, 0.3, 0.05, 0.15, 0.15);
  source.connect(filter).connect(gain).connect(out);
  source.start(t);
  source.stop(t + 0.45);
  tone(ctx, out, t + 0.3, "triangle", 1318.51, 1318.51, 0, 0.22, 0.004, 0.04, 0.6);
}

const RECIPES: Record<SfxName, Recipe> = {
  airhorn,
  hitmarker,
  mlgCombo,
  stamp,
  flat,
  sadTrombone,
  achievement,
  vote,
  flip,
  toggle: hitmarker,
};

export function playSfx(name: SfxName): SfxHandle | null {
  return playRecipe(RECIPES[name]);
}

/**
 * Joue une recette sur son propre bus : `stop()` coupe tout ce qu'elle a planifié.
 * Les recettes des tribus vivent dans des modules chargés à la demande.
 */
export function playRecipe(recipe: Recipe): SfxHandle | null {
  const ctx = getContext();
  if (!ctx || !master) return null;
  const bus = ctx.createGain();
  bus.connect(master);
  try {
    recipe(ctx, bus, ctx.currentTime + 0.01);
  } catch (error) {
    // Un son raté ne doit jamais casser une animation, mais on veut le savoir en dev.
    if (process.env.NODE_ENV !== "production") console.warn("[sound] recette en échec", error);
    bus.disconnect();
    return null;
  }
  let stopped = false;
  return {
    stop() {
      if (stopped) return;
      stopped = true;
      const now = ctx.currentTime;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(bus.gain.value, now);
      bus.gain.linearRampToValueAtTime(0, now + 0.08);
      window.setTimeout(() => bus.disconnect(), 150);
    },
  };
}
