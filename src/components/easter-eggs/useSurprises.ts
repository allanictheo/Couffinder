"use client";

import { useCallback, useState } from "react";
import { sfx } from "@/lib/client/preferences";
import { playSting } from "@/lib/client/tribe-sounds";
import type { ToastData } from "../AchievementToast";
import type { SurprisePlan, ToastSpec } from "./catalog";
import { preloadOverlay, type EggOverlay } from "./EggLayer";

let sequence = 0;
/** Identifiant unique pour les toasts et overlays (sans horloge : rendu pur). */
export function nextId(): number {
  sequence += 1;
  return sequence;
}

/**
 * Applique un plan de surprise (voir `planSurprise`) : overlay, succès, son,
 * tremblement. Partagé par l'application et la page de prévisualisation.
 */
export function useSurprises(onShake?: () => void) {
  const [overlay, setOverlay] = useState<EggOverlay | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((spec: ToastSpec) => setToast({ id: nextId(), ...spec }), []);

  const play = useCallback(
    (plan: SurprisePlan) => {
      if (plan.overlay) preloadOverlay(plan.overlay);
      if (plan.toast) showToast(plan.toast);
      if (plan.overlay) setOverlay({ ...plan.overlay, id: nextId(), seed: Math.floor(Math.random() * 2 ** 31) });
      if (plan.shake) onShake?.();
      if (plan.sfx) sfx(plan.sfx);
      if (plan.sting) playSting(plan.sting);
    },
    [onShake, showToast],
  );

  const clearOverlay = useCallback(() => setOverlay(null), []);
  const dismissToast = useCallback(() => setToast(null), []);

  return { overlay, toast, play, showToast, clearOverlay, dismissToast };
}
