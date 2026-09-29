"use client";

import { m } from "motion/react";
import { useEffect } from "react";
import { sfx } from "@/lib/client/preferences";
import { Tumbleweed } from "./art";
import { CountUp } from "./CountUp";

/**
 * Réaction « pas chouffin », plus sobre que le combo MLG, et seulement de temps
 * en temps : un écran bleu à smiley triste (2012) ou un gros « NOPE » avec
 * virevoltant et trombone triste. Zappable (clic, Échap).
 */

export const SAD_DURATION_MS = 2600;

export type SadVariant = "bsod" | "nope";

export default function SadReaction({ word, variant, onDone }: { word: string; variant: SadVariant; onDone: () => void }) {
  useEffect(() => {
    const sound = sfx("sadTrombone");
    const timer = window.setTimeout(onDone, SAD_DURATION_MS);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      sound?.stop();
    };
  }, [onDone]);

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden p-4 select-none"
      onClick={onDone}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="absolute inset-0 bg-nuit/70" />

      {variant === "bsod" ? (
        <m.div
          className="relative w-full max-w-lg bg-[#1d5fc4] p-7 font-light text-white shadow-2xl sm:p-10"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.1, 0.9, 0.2, 1] }}
        >
          <p className="text-7xl leading-none sm:text-8xl">:(</p>
          <p className="mt-6 text-xl leading-snug sm:text-2xl">
            « <span className="break-words">{word}</span> » a rencontré un problème de chouffinitude et doit redémarrer.
          </p>
          <p className="mt-3 text-base opacity-90">On collecte deux ou trois infos, puis on te laisse tranquille.</p>
          <p className="mt-6 text-2xl tabular-nums">
            <CountUp value={100} duration={2} delay={0.2} /> % effectué
          </p>
          <p className="mt-6 text-sm opacity-80">Code d&apos;arrêt : PAS_CHOUFFIN_EXCEPTION</p>
        </m.div>
      ) : (
        <>
          <m.p
            className="meme-text relative text-[clamp(5rem,26vw,14rem)]"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: [0, 0, -26, 26, -16, 16, -6, 0] }}
            transition={{
              scale: { type: "spring", stiffness: 420, damping: 16 },
              opacity: { duration: 0.15 },
              x: { duration: 0.9, delay: 0.35, times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1] },
            }}
          >
            Nope.
          </m.p>
          <m.p
            className="relative mt-2 text-center text-lg font-semibold text-brume"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Pas chouffin. Même pas un peu.
          </m.p>
          <m.div
            className="absolute bottom-[10vh] left-0 w-20"
            initial={{ x: "-25vw", rotate: 0 }}
            animate={{ x: "110vw", rotate: 900, y: [0, -24, 0, -12, 0, -6, 0] }}
            transition={{ duration: 2.4, ease: "linear" }}
          >
            <Tumbleweed className="w-full" />
          </m.div>
        </>
      )}
    </m.div>
  );
}
