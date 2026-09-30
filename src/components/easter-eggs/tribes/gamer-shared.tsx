"use client";

/**
 * Briques communes aux deux modules gamer (niveaux courants et apothéoses) :
 * hitmarkers, projectiles de montage MLG, vignette, mélange à graine.
 */

import { m } from "motion/react";
import { Chip, Hitmarker, SodaCan } from "../../art";
import { between, type Random } from "../kit";

export const VIGNETTE = "bg-[radial-gradient(circle_at_center,rgb(14_10_22/0.8)_10%,rgb(14_10_22/0.96)_100%)]";
export const SERIF = { fontFamily: 'Georgia, "Times New Roman", serif' };

export function shuffle<T>(items: readonly T[], random: Random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function HitmarkerAt({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <m.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, width: size, x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 1.8 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [1.8, 1, 1, 0.9] }}
      transition={{ delay, duration: 0.36, times: [0, 0.12, 0.6, 1] }}
    >
      <Hitmarker className="w-full" />
    </m.div>
  );
}

export function hitPlan(random: Random, times: readonly number[]) {
  return times.map((delay, id) => ({ id, delay, x: between(random, 12, 88), y: between(random, 16, 84), size: between(random, 44, 74) }));
}

export function Projectile({ index }: { index: number }) {
  return index % 3 === 2 ? (
    <SodaCan className="w-[70%] drop-shadow-[0_4px_0_rgb(0_0_0/0.5)]" />
  ) : (
    <Chip className="w-full drop-shadow-[0_4px_0_rgb(0_0_0/0.5)]" />
  );
}
