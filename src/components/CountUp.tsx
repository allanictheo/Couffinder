"use client";

import { animate, m, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect } from "react";
import { formatNumber } from "@/lib/client/copy";

/** Compteur qui défile jusqu'à sa valeur, sans re-rendu React (MotionValue). */
export function CountUp({
  value,
  duration = 0.9,
  delay = 0,
  className,
}: {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (latest) => formatNumber(Math.round(latest)));

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(count, value, { duration, delay, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [value, duration, delay, reduceMotion, count]);

  // Mouvement réduit : la valeur finale, tout de suite, en texte simple (la MotionValue
  // mise à jour sans animation ne se répercutait pas et laissait « 0 » affiché).
  if (reduceMotion) return <span className={className}>{formatNumber(value)}</span>;

  return <m.span className={className}>{text}</m.span>;
}
