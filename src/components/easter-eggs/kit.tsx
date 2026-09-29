"use client";

/**
 * Boîte à outils partagée par les animations des tribus : la scène (minuteur,
 * zapping au clic et à Échap, son), les textes qui claquent, les particules,
 * les tremblements et les flashs (toujours comptés : jamais plus de 3 par seconde).
 *
 * Ce module est chargé à la demande avec la première tribu qui en a besoin.
 */

import { animate, m, useMotionValue, useTransform, type MotionStyle } from "motion/react";
import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import { seededRandom } from "@/lib/client/copy";
import { sfxRecipe } from "@/lib/client/preferences";
import type { Recipe } from "@/lib/sound";

export type Random = () => number;

export function between(random: Random, min: number, max: number): number {
  return min + random() * (max - min);
}

/** Plan pseudo-aléatoire mémorisé à partir de la graine (rendu pur, compatible React 19). */
export function usePlan<T>(seed: number, make: (random: Random) => T): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => make(seededRandom(seed)), [seed]);
}

/** Taille de police qui s'adapte à la longueur du mot (les mots longs existent : « Monty Python : Sacré Graal ! »). */
export function wordSize(word: string, { max = 16, min = 2.2, cap = 10, factor = 150 } = {}): string {
  const length = Math.max(4, word.length);
  const vw = Math.min(max, factor / length);
  return `clamp(${min}rem, ${vw.toFixed(2)}vw, ${cap}rem)`;
}

/** Mot raccourci pour les petits textes (killfeed, bulles). */
export function shortWord(word: string, max = 22): string {
  return word.length > max ? `${word.slice(0, max - 1).trimEnd()}...` : word;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export { EASE_OUT };

export interface StageProps {
  durationMs: number;
  onDone: () => void;
  sound?: Recipe | null;
  /** « full » : plein écran qui bloque les clics (zappable) ; « light » : réaction légère qui laisse cliquer à travers. */
  mode?: "full" | "light";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * La scène commune : fondu d'entrée et de sortie, minuteur, Échap et clic pour
 * passer, son (seulement s'il est activé) coupé net quand on zappe.
 */
export function Stage({ durationMs, onDone, sound, mode = "full", className = "", style, children }: StageProps) {
  useEffect(() => {
    const handle = sound ? sfxRecipe(sound) : null;
    const timer = window.setTimeout(onDone, durationMs);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDone();
    };
    // Réaction légère : le moindre clic la range, sans bloquer ce clic.
    const onPointer = () => onDone();
    window.addEventListener("keydown", onKey);
    if (mode === "light") window.addEventListener("pointerdown", onPointer, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer, true);
      handle?.stop();
    };
  }, [durationMs, onDone, sound, mode]);

  const light = mode === "light";
  return (
    <m.div
      aria-hidden="true"
      className={`fixed inset-0 z-50 overflow-hidden select-none ${light ? "pointer-events-none" : "cursor-pointer"} ${className}`}
      style={style}
      onClick={light ? undefined : onDone}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.12 }}
    >
      {children}
      {light ? null : (
        <p className="absolute inset-x-0 top-3 z-10 flex justify-center">
          <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white/90">Clic ou Échap pour passer</span>
        </p>
      )}
    </m.div>
  );
}

/** Texte « meme » qui s'écrase depuis très grand, avec un léger rebond. */
export function Slam({
  children,
  delay = 0,
  className = "",
  style,
  from = 3,
  rotate = -10,
  settle = -3,
  duration = 0.42,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: MotionStyle;
  from?: number;
  rotate?: number;
  settle?: number;
  duration?: number;
}) {
  return (
    <m.p
      className={`meme-text text-center ${className}`}
      style={style}
      initial={{ scale: from, opacity: 0, rotate }}
      animate={{ scale: [from, 0.92, 1], opacity: [0, 1, 1], rotate: [rotate, settle + 3, settle] }}
      transition={{ delay, duration, times: [0, 0.6, 1], ease: "easeOut" }}
    >
      {children}
    </m.p>
  );
}

/** Apparition sur ressort (badges, bulles, objets). */
export function Pop({
  children,
  delay = 0,
  className = "",
  style,
  rotate = 0,
  from = 0,
  stiffness = 460,
  damping = 15,
}: {
  children?: ReactNode;
  delay?: number;
  className?: string;
  style?: MotionStyle;
  rotate?: number;
  from?: number;
  stiffness?: number;
  damping?: number;
}) {
  return (
    <m.div
      className={className}
      style={style}
      initial={{ scale: from, opacity: 0, rotate: rotate - 12 }}
      animate={{ scale: 1, opacity: 1, rotate }}
      transition={{
        delay,
        scale: { type: "spring", stiffness, damping, delay },
        rotate: { type: "spring", stiffness, damping, delay },
        opacity: { duration: 0.12, delay },
      }}
    >
      {children}
    </m.div>
  );
}

/** Fondu montant (sous-titres, légendes). */
export function Rise({
  children,
  delay = 0,
  className = "",
  style,
  distance = 18,
  as = "p",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: MotionStyle;
  distance?: number;
  as?: "p" | "div";
}) {
  const Tag = as === "p" ? m.p : m.div;
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}

/**
 * Tremblement ponctuel du contenu de la scène (pas de la page). Chaque instant
 * de `at` déclenche une secousse amortie de 0,4 s.
 */
export function Shake({
  at,
  intensity = 10,
  className = "absolute inset-0",
  children,
}: {
  at: readonly number[];
  intensity?: number;
  className?: string;
  children: ReactNode;
}) {
  return at.reduceRight<ReactNode>((child, time, index) => {
    const i = intensity;
    return (
      <m.div
        key={`${time}-${index}`}
        className={className}
        initial={{ x: 0, y: 0 }}
        animate={{ x: [0, -i, i * 0.85, -i * 0.6, i * 0.35, -i * 0.15, 0], y: [0, i * 0.45, -i * 0.5, i * 0.3, -i * 0.2, 0, 0] }}
        transition={{ delay: time, duration: 0.42, ease: "linear" }}
      >
        {child}
      </m.div>
    );
  }, children);
}

/**
 * Flash lumineux compté. Règle maison : au plus deux flashs par animation,
 * espacés d'au moins 0,5 s, opacité plafonnée (et jamais de rouge saturé).
 */
export function Flash({ at, color = "#ffffff", peak = 0.45, duration = 0.4 }: { at: number; color?: string; peak?: number; duration?: number }) {
  return (
    <m.div
      className="pointer-events-none absolute inset-0"
      style={{ background: color }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, Math.min(peak, 0.6), 0] }}
      transition={{ delay: at, duration, times: [0, 0.18, 1], ease: "easeOut" }}
    />
  );
}

/** Rayons tournants (fond des moments légendaires). */
export function Rays({
  color = "rgb(255 200 74 / 0.22)",
  delay = 0,
  className = "",
  spin = 40,
  duration = 3.5,
}: {
  color?: string;
  delay?: number;
  className?: string;
  spin?: number;
  duration?: number;
}) {
  return (
    <m.div
      className={`god-rays ${className}`}
      style={{ "--ray-color": color } as MotionStyle}
      initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: spin }}
      transition={{ delay, opacity: { delay, duration: 0.4 }, scale: { delay, duration: 0.6, ease: EASE_OUT }, rotate: { delay, duration, ease: "linear" } }}
    />
  );
}

export interface BurstProps {
  seed: number;
  count: number;
  /** Origine en % de la scène. */
  x?: number;
  y?: number;
  delay?: number;
  duration?: number;
  /** Distance parcourue, en vmin. */
  distance?: readonly [number, number];
  /** Chute en fin de course (vmin), façon gravité. */
  gravity?: number;
  size?: readonly [number, number];
  spin?: number;
  /** Secteur angulaire en degrés (0 = droite, 90 = bas), tout le cercle par défaut. */
  angle?: readonly [number, number];
  render: (index: number, random: Random) => ReactNode;
}

/** Gerbe de particules qui part d'un point (confettis, éclats, étincelles, chips). */
export function Burst({
  seed,
  count,
  x = 50,
  y = 50,
  delay = 0,
  duration = 1.1,
  distance = [18, 46],
  gravity = 0,
  size = [18, 34],
  spin = 360,
  angle = [0, 360],
  render,
}: BurstProps) {
  const items = usePlan(seed, (random) =>
    Array.from({ length: count }, (_, index) => {
      const theta = (between(random, angle[0], angle[1]) * Math.PI) / 180;
      const dist = between(random, distance[0], distance[1]);
      return {
        index,
        dx: Math.cos(theta) * dist,
        dy: Math.sin(theta) * dist,
        size: between(random, size[0], size[1]),
        rotate: between(random, -spin, spin),
        lag: random() * 0.12,
        content: render(index, random),
      };
    }),
  );
  return (
    <>
      {items.map((item) => (
        <m.div
          key={item.index}
          className="absolute"
          style={{ left: `${x}%`, top: `${y}%`, width: item.size, marginLeft: -item.size / 2, marginTop: -item.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{
            x: [`0vmin`, `${item.dx}vmin`],
            y: [`0vmin`, `${item.dy}vmin`, `${item.dy + gravity}vmin`],
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 1],
            rotate: item.rotate,
          }}
          transition={{
            delay: delay + item.lag,
            duration,
            x: { delay: delay + item.lag, duration, ease: EASE_OUT },
            y: { delay: delay + item.lag, duration, times: [0, 0.55, 1], ease: ["easeOut", "easeIn"] },
            opacity: { delay: delay + item.lag, duration, times: [0, 0.08, 0.7, 1] },
          }}
        >
          {item.content}
        </m.div>
      ))}
    </>
  );
}

export interface RainProps {
  seed: number;
  count: number;
  delay?: readonly [number, number];
  duration?: readonly [number, number];
  size?: readonly [number, number];
  /** Balancement horizontal, en vw. */
  sway?: number;
  spin?: number;
  /** Direction : chute (par défaut) ou montée. */
  direction?: "down" | "up";
  /** Dérive horizontale globale, en vw (vent). */
  drift?: number;
  render: (index: number, random: Random) => ReactNode;
}

/** Pluie (ou montée) de particules sur toute la largeur : pétales, pièces, chopes, bulles. */
export function Rain({
  seed,
  count,
  delay = [0, 1],
  duration = [1.6, 2.4],
  size = [18, 34],
  sway = 4,
  spin = 240,
  direction = "down",
  drift = 0,
  render,
}: RainProps) {
  const items = usePlan(seed, (random) =>
    Array.from({ length: count }, (_, index) => ({
      index,
      left: between(random, -4, 100),
      size: between(random, size[0], size[1]),
      delay: between(random, delay[0], delay[1]),
      duration: between(random, duration[0], duration[1]),
      sway: between(random, -sway, sway),
      rotate: between(random, -spin, spin),
      content: render(index, random),
    })),
  );
  const [start, end] = direction === "down" ? ["-12vh", "112vh"] : ["108vh", "-16vh"];
  return (
    <>
      {items.map((item) => (
        <m.div
          key={item.index}
          className="absolute top-0"
          style={{ left: `${item.left}%`, width: item.size }}
          initial={{ y: start, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: [start, end],
            x: ["0vw", `${item.sway}vw`, `${drift - item.sway * 0.5}vw`, `${drift}vw`],
            rotate: item.rotate,
            opacity: [0, 1, 1, 0.9],
          }}
          transition={{
            delay: item.delay,
            duration: item.duration,
            ease: "linear",
            x: { delay: item.delay, duration: item.duration, ease: "easeInOut" },
            opacity: { delay: item.delay, duration: item.duration, times: [0, 0.08, 0.85, 1] },
          }}
        >
          {item.content}
        </m.div>
      ))}
    </>
  );
}

/**
 * Texte qui se déchiffre (caractères aléatoires qui se figent un à un), sans
 * re-rendu React : tout passe par une MotionValue.
 */
export function Scramble({
  text,
  delay = 0,
  duration = 1,
  glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789#$%&",
  className = "",
  style,
}: {
  text: string;
  delay?: number;
  duration?: number;
  glyphs?: string;
  className?: string;
  style?: MotionStyle;
}) {
  const progress = useMotionValue(0);
  const output = useTransform(progress, (value) => {
    const settled = Math.floor(value * text.length);
    const frame = Math.floor(value * 40);
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (i < settled || char === " ") result += char;
      else result += glyphs[(i * 7 + frame * 13 + i * frame) % glyphs.length];
    }
    return result;
  });
  useEffect(() => {
    const controls = animate(progress, 1, { delay, duration, ease: "linear" });
    return () => controls.stop();
  }, [progress, delay, duration]);
  return (
    <m.span className={className} style={style}>
      {output}
    </m.span>
  );
}

/** Compteur qui défile (score, points de vie, niveau de puissance), sans re-rendu React. */
export function Counter({
  from = 0,
  to,
  delay = 0,
  duration = 1,
  format = (value: number) => String(Math.round(value)),
  ease = EASE_OUT,
  className = "",
  style,
}: {
  from?: number;
  to: number;
  delay?: number;
  duration?: number;
  format?: (value: number) => string;
  ease?: [number, number, number, number] | "linear" | "easeIn" | "easeOut";
  className?: string;
  style?: MotionStyle;
}) {
  const value = useMotionValue(from);
  const text = useTransform(value, format);
  useEffect(() => {
    const controls = animate(value, to, { delay, duration, ease });
    return () => controls.stop();
  }, [value, to, delay, duration, ease]);
  return (
    <m.span className={className} style={style}>
      {text}
    </m.span>
  );
}

/** Découpe un texte en lettres animables (chute, poussière, headbang). */
export function letters(text: string): Array<{ char: string; index: number }> {
  return Array.from(text).map((char, index) => ({ char, index }));
}

/** Nombre en chiffres romains (pour les épisodes et les rois). */
export function roman(value: number): string {
  const table: Array<[number, string]> = [
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let rest = Math.max(1, Math.round(value));
  let result = "";
  for (const [amount, symbol] of table) {
    while (rest >= amount) {
      result += symbol;
      rest -= amount;
    }
  }
  return result;
}

/** Lens flare anamorphique (compte comme un flash dans le budget photosensible). */
export function LensFlare({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <m.div
      className="flare"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.1, 1.3] }}
      transition={{ delay, duration: 0.8, times: [0, 0.3, 1], ease: "easeOut" }}
    >
      <div className="flare-core" />
      <div className="flare-streak" />
      <div className="flare-ring" />
    </m.div>
  );
}

/** Étoile d'impact de bande dessinée (coups, explosions, « POW »). */
export function ImpactStar({
  spikes = 11,
  fill = "#ffe14a",
  stroke = "#d7263d",
  inner = 0.55,
  className,
  children,
}: {
  spikes?: number;
  fill?: string;
  stroke?: string;
  inner?: number;
  className?: string;
  children?: ReactNode;
}) {
  const points: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? 48 : 48 * inner * (0.9 + ((i * 37) % 7) / 30);
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    points.push(`${(50 + Math.cos(angle) * radius).toFixed(1)},${(50 + Math.sin(angle) * radius).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <polygon points={points.join(" ")} fill={fill} stroke={stroke} strokeWidth={4} strokeLinejoin="round" />
      {children}
    </svg>
  );
}

/** Flamme de pyrotechnie (quatre couches, du rouge au blanc). */
export function Flame({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 140" aria-hidden="true" className={className} preserveAspectRatio="none">
      <path d="M30 138 C8 132 0 110 6 88 C10 72 20 64 18 44 C28 56 30 64 30 64 C34 44 28 22 40 2 C44 26 58 44 58 80 C58 114 48 132 30 138 Z" fill="#ff4a14" />
      <path d="M30 136 C14 130 8 112 13 96 C17 84 24 78 24 64 C31 74 33 82 33 82 C38 70 36 56 43 44 C48 64 53 78 53 98 C53 120 44 132 30 136 Z" fill="#ff9d1c" />
      <path d="M30 136 C18 130 14 116 18 104 C21 95 27 90 27 80 C33 88 35 94 35 94 C39 86 38 76 43 68 C46 82 49 92 49 104 C49 122 42 132 30 136 Z" fill="#ffe066" />
      <path d="M30 135 C23 131 21 123 23 116 C26 109 30 106 30 99 C34 106 38 111 38 118 C38 128 34 132 30 135 Z" fill="#fff6cf" />
    </svg>
  );
}
