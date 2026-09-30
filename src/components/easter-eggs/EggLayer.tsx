"use client";

import { AnimatePresence } from "motion/react";
import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { Tribe } from "@/lib/types";
import { findVariant, findVieVariant, type EggLevel, type OverlaySpec } from "./catalog";
import type { EggProps, VieProps } from "./types";

/*
 * Tout est chargé à la demande : le combo MLG générique, la réaction triste, la
 * famille « Vie normale », et surtout une tribu à la fois (chaque tribu est un
 * module séparé ; les apothéoses gamer, nombreuses, ont leur propre module).
 */
const loadMlgCombo = () => import("../MlgCombo");
const loadSadReaction = () => import("../SadReaction");
const loadVieNormale = () => import("./familles/vie-normale");
const MlgCombo = lazy(loadMlgCombo);
const SadReaction = lazy(loadSadReaction);
const VieNormale = lazy(loadVieNormale);

type EggModule = { default: ComponentType<EggProps> };

/** Un module d'animations : une tribu, ou une tranche d'une tribu quand elle devient lourde. */
type EggModuleKey = Tribe | "gamer-legendary";

const MODULE_LOADERS: Record<EggModuleKey, () => Promise<EggModule>> = {
  gamer: () => import("./tribes/gamer"),
  "gamer-legendary": () => import("./tribes/gamer-legendary"),
  geek: () => import("./tribes/geek"),
  metal: () => import("./tribes/metal"),
  taverne: () => import("./tribes/taverne"),
  weeb: () => import("./tribes/weeb"),
  roliste: () => import("./tribes/roliste"),
};

const MODULE_COMPONENTS = Object.fromEntries(
  Object.entries(MODULE_LOADERS).map(([key, loader]) => [key, lazy(loader)]),
) as Record<EggModuleKey, LazyExoticComponent<ComponentType<EggProps>>>;

/** Le module qui contient l'animation d'une tribu à un niveau donné. */
function moduleFor(tribe: Tribe, level: EggLevel): EggModuleKey {
  return tribe === "gamer" && level === "legendary" ? "gamer-legendary" : tribe;
}

export type EggOverlay = OverlaySpec & { id: number; seed: number };

/**
 * Précharge les réactions génériques (au focus du champ). Les tribus et la famille
 * « Vie normale » attendent d'être désignées par un tirage (9 à 18 Ko gzip chacune, mesuré en production).
 */
export function warmupEggs() {
  void loadMlgCombo();
  void loadSadReaction();
}

/** Lance le téléchargement du module d'une réaction dès que le tirage la désigne. */
export function preloadOverlay(overlay: OverlaySpec) {
  if (overlay.kind === "tribe") void MODULE_LOADERS[moduleFor(overlay.tribe, overlay.level)]().catch(() => undefined);
  else if (overlay.kind === "vie") void loadVieNormale().catch(() => undefined);
}

function OverlayContent({ overlay, onDone }: { overlay: EggOverlay; onDone: () => void }) {
  switch (overlay.kind) {
    case "mlg":
      return <MlgCombo seed={overlay.seed} word={overlay.word} legendary={overlay.legendary} onDone={onDone} />;
    case "sad":
      return <SadReaction word={overlay.word} variant={overlay.variant} onDone={onDone} />;
    case "vie": {
      const variant = findVieVariant(overlay.level, overlay.variant);
      const props: VieProps = {
        word: overlay.word,
        score: overlay.score,
        seed: overlay.seed,
        level: overlay.level,
        variant: variant.id,
        durationMs: variant.durationMs,
        onDone,
      };
      return <VieNormale {...props} />;
    }
    case "tribe": {
      const Egg = MODULE_COMPONENTS[moduleFor(overlay.tribe, overlay.level)];
      const variant = findVariant(overlay.tribe, overlay.level, overlay.variant);
      return (
        <Egg
          word={overlay.word}
          score={overlay.score}
          seed={overlay.seed}
          level={overlay.level}
          variant={variant.id}
          durationMs={variant.durationMs}
          onDone={onDone}
        />
      );
    }
  }
}

/** Couche des réactions plein écran : une seule à la fois, fondu de sortie. */
export function EggLayer({ overlay, onDone }: { overlay: EggOverlay | null; onDone: () => void }) {
  return (
    <AnimatePresence>
      {overlay ? (
        // Suspense au plus près du composant paresseux : jamais au-dessus d'AnimatePresence.
        <Suspense key={overlay.id} fallback={null}>
          <OverlayContent overlay={overlay} onDone={onDone} />
        </Suspense>
      ) : null}
    </AnimatePresence>
  );
}
