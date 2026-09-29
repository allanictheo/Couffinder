"use client";

import { m } from "motion/react";
import type { Rarity } from "@/lib/client/copy";
import { CountUp } from "./CountUp";

const SEGMENTS = 20;
const THRESHOLD = 51;

/** Jauge segmentée façon barre d'XP, couleur de la rareté du butin. */
export function ChouffinGauge({ score, rarity }: { score: number; rarity: Rarity }) {
  const filled = Math.round((score / 100) * SEGMENTS);

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <span className="text-sm font-medium text-brume">Indice de chouffinitude</span>
        <span className="font-display text-3xl leading-none tabular-nums" style={{ color: rarity.color }}>
          <CountUp value={score} duration={0.9} delay={0.2} />
          <span className="text-lg text-brume">/100</span>
        </span>
      </div>
      <div
        role="meter"
        aria-label="Indice de chouffinitude"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={`${score} sur 100, rareté ${rarity.label.toLowerCase()}`}
        className="relative mt-2.5 flex h-4 gap-[3px]"
      >
        {Array.from({ length: SEGMENTS }, (_, index) =>
          index < filled ? (
            <m.span
              key={index}
              className="h-full flex-1 rounded-[2px]"
              style={{ background: rarity.color, boxShadow: `0 0 10px -2px ${rarity.color}` }}
              initial={{ opacity: 0, scaleY: 0.2 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.2 + index * 0.03, duration: 0.18 }}
            />
          ) : (
            <span key={index} className="h-full flex-1 rounded-[2px] bg-white/10" />
          ),
        )}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -top-1 w-[3px] -translate-x-1/2 rounded-full bg-parchemin shadow-[0_0_0_1px_#000]"
          style={{ left: `${THRESHOLD}%` }}
        />
      </div>
      <div className="relative mt-1.5 h-4 text-xs text-brume" aria-hidden="true">
        <span className="absolute left-0">0</span>
        <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${THRESHOLD}%` }}>
          seuil chouffin
        </span>
        <span className="absolute right-0">100</span>
      </div>
    </div>
  );
}
