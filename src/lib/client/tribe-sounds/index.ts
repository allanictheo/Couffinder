/**
 * Chargeurs des sons de tribus : chaque tribu a son module, chargé à la demande
 * (avec son animation, ou seul pour la petite signature du mode réduit).
 */

import type { Recipe } from "@/lib/sound";
import type { Tribe } from "@/lib/types";
import type { EggLevel } from "@/components/easter-eggs/catalog";
import { sfxRecipe, soundEnabled } from "../preferences";

export interface TribeSounds {
  /** Signature courte par niveau, jouée avec le toast en mouvement réduit. */
  STINGS: Record<EggLevel, Recipe>;
}

const LOADERS: Record<Tribe, () => Promise<TribeSounds>> = {
  gamer: () => import("./gamer"),
  geek: () => import("./geek"),
  metal: () => import("./metal"),
  taverne: () => import("./taverne"),
  weeb: () => import("./weeb"),
  roliste: () => import("./roliste"),
};

/** Joue la signature sonore d'une tribu (rien du tout si le son est coupé). */
export function playSting(tribe: Tribe, level: EggLevel) {
  if (!soundEnabled()) return;
  void LOADERS[tribe]()
    .then((sounds) => sfxRecipe(sounds.STINGS[level]))
    .catch(() => undefined);
}
