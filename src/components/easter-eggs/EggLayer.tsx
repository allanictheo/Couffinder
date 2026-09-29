"use client";

import { AnimatePresence } from "motion/react";
import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { Tribe } from "@/lib/types";
import { findVariant, type OverlaySpec } from "./catalog";
import type { EggProps } from "./types";

/*
 * Tout est chargé à la demande : le combo MLG générique, la réaction triste, et
 * surtout une tribu à la fois (chaque tribu est un module séparé).
 */
const loadMlgCombo = () => import("../MlgCombo");
const loadSadReaction = () => import("../SadReaction");
const MlgCombo = lazy(loadMlgCombo);
const SadReaction = lazy(loadSadReaction);

type EggModule = { default: ComponentType<EggProps> };

const TRIBE_LOADERS: Record<Tribe, () => Promise<EggModule>> = {
  gamer: () => import("./tribes/gamer"),
  geek: () => import("./tribes/geek"),
  metal: () => import("./tribes/metal"),
  taverne: () => import("./tribes/taverne"),
  weeb: () => import("./tribes/weeb"),
  roliste: () => import("./tribes/roliste"),
};

const TRIBE_COMPONENTS: Record<Tribe, LazyExoticComponent<ComponentType<EggProps>>> = {
  gamer: lazy(TRIBE_LOADERS.gamer),
  geek: lazy(TRIBE_LOADERS.geek),
  metal: lazy(TRIBE_LOADERS.metal),
  taverne: lazy(TRIBE_LOADERS.taverne),
  weeb: lazy(TRIBE_LOADERS.weeb),
  roliste: lazy(TRIBE_LOADERS.roliste),
};

export type EggOverlay = OverlaySpec & { id: number; seed: number };

/**
 * Précharge les réactions génériques (au focus du champ). Les tribus attendent
 * d'être désignées par un verdict : chacune embarque sa copie du kit (9 à 13 Ko gzip).
 */
export function warmupEggs() {
  void loadMlgCombo();
  void loadSadReaction();
}

/** Lance le téléchargement d'une tribu dès que le verdict la désigne. */
export function preloadTribe(tribe: Tribe) {
  void TRIBE_LOADERS[tribe]().catch(() => undefined);
}

function OverlayContent({ overlay, onDone }: { overlay: EggOverlay; onDone: () => void }) {
  switch (overlay.kind) {
    case "mlg":
      return <MlgCombo seed={overlay.seed} word={overlay.word} legendary={overlay.legendary} onDone={onDone} />;
    case "sad":
      return <SadReaction word={overlay.word} variant={overlay.variant} onDone={onDone} />;
    case "tribe": {
      const Egg = TRIBE_COMPONENTS[overlay.tribe];
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
