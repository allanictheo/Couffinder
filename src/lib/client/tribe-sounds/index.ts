/**
 * Chargeurs des sons de tribus (et de la famille « Vie normale ») : chaque module
 * est chargé à la demande, avec son animation, ou seul pour la petite signature
 * du mode réduit.
 */

import type { Recipe } from "@/lib/sound";
import type { Tribe } from "@/lib/types";
import type { EggLevel, StingSpec, VieLevel } from "@/components/easter-eggs/catalog";
import { sfxRecipe, soundEnabled } from "../preferences";

export interface TribeSounds {
  /** Signature courte par niveau, jouée avec le toast en mouvement réduit. */
  STINGS: Record<EggLevel, Recipe>;
}

export interface VieSounds {
  /** Signature courte par tranche de score. */
  STINGS: Record<VieLevel, Recipe>;
}

const LOADERS: Record<Tribe, () => Promise<TribeSounds>> = {
  gamer: () => import("./gamer"),
  geek: () => import("./geek"),
  metal: () => import("./metal"),
  taverne: () => import("./taverne"),
  weeb: () => import("./weeb"),
  roliste: () => import("./roliste"),
};

const loadVie = (): Promise<VieSounds> => import("./vie-normale");

/** Joue la signature sonore d'une tribu ou de la famille « Vie normale » (rien du tout si le son est coupé). */
export function playSting(sting: StingSpec) {
  if (!soundEnabled()) return;
  const recipe =
    sting.family === "vie-normale"
      ? loadVie().then((sounds) => sounds.STINGS[sting.level])
      : LOADERS[sting.family]().then((sounds) => sounds.STINGS[sting.level]);
  void recipe.then((play) => sfxRecipe(play)).catch(() => undefined);
}
