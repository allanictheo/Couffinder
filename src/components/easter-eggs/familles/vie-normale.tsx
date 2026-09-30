"use client";

/**
 * Famille « Vie normale » : les mots pas chouffin sans tribu (le padel, le brunch,
 * le lundi). La vraie vie, que le chouffin fuit, célébrée avec une ironie
 * affectueuse. Elle parle le flat design de 2013 (aplats pastel, interrupteurs à
 * glissière, notifications en verre dépoli), l'époque du « pas chouffin ».
 *
 * - normie absolu (0 à 20) : touche de l'herbe, la grande lumière jaune, chargement de la vie normale ;
 * - vie ordinaire (21 à 40) : réveil du lundi, réseau pro, pluie d'avocado toasts, mode adulte activé ;
 * - presque chouffin (41 à 50) : si près du but (poteau), il manque juste une Chouffe.
 *
 * Ton taquin, jamais méprisant : on se moque de la situation, pas des gens.
 */

import { animate, m, useMotionValue, useTransform } from "motion/react";
import { useEffect, type ReactNode } from "react";
import * as sounds from "@/lib/client/tribe-sounds/vie-normale";
import { PixelArt } from "../../art";
import { AvocadoToast } from "../avocado";
import { Burst, EASE_OUT, Pop, Rain, Rise, Slam, Stage, between, shortWord, usePlan } from "../kit";
import type { VieProps } from "../types";

/** Encre marine lisible sur les ciels pastel (contraste supérieur à 7:1). */
const INK = "#0f2a44";
const OUTLINE = { WebkitTextStroke: `0.07em ${INK}`, paintOrder: "stroke fill" } as const;

/** Pastille plate (flat 2013) pour les phrases qui citent le mot. */
function Caption({ children, delay, className = "" }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <Rise delay={delay} className={`max-w-[92vw] rounded-full bg-white/92 px-4 py-1.5 text-center text-[clamp(0.95rem,2.2vw,1.2rem)] font-semibold text-[#0f2a44] shadow-[0_6px_20px_rgb(15_42_68/0.25)] ${className}`}>
      {children}
    </Rise>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 50" aria-hidden="true" className={className}>
      <path d="M18 46 C4 46 2 30 14 27 C12 14 28 8 38 16 C44 2 70 0 76 16 C86 8 104 12 102 26 C116 26 118 46 102 46 Z" fill="#ffffff" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Normie absolu : touche de l'herbe                                   */
/* ------------------------------------------------------------------ */

/** Le bras du chouffin : manche de sweat à capuche, main qui pointe l'index vers le bas. */
const HAND_ROWS = [
  "..kkkkkkkk..",
  "..khhhhhhk..",
  "..khhhhhhk..",
  "..khhhhhhk..",
  "..khhhhhhk..",
  ".kkkkkkkkkk.",
  ".kccccccccck",
  ".kkkkkkkkkk.",
  ".kssssssssk.",
  ".kssssssssk.",
  ".ksdsdsdssk.",
  ".kssssssssk.",
  "..kssssssk..",
  "...kkssskk..",
  ".....ksk....",
  ".....ksk....",
  ".....ksk....",
  ".....ksk....",
  ".....kkk....",
] as const;
const HAND_PALETTE = { k: "#1b1420", h: "#3a3350", c: "#2a2438", s: "#f2c19b", d: "#d99a70" };
const GRASS = ["#3f9a26", "#57b83a", "#6fcf4a", "#2f7d1c"] as const;
const HAND_X = 78;
const TOUCH = 1.55;

function Blade({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 100" preserveAspectRatio="none" aria-hidden="true" className="block size-full">
      <path d="M10 0 C13 30 18 62 20 100 H0 C2 62 7 30 10 0 Z" fill={color} />
    </svg>
  );
}

function VieHerbe({ word, seed, durationMs, onDone }: VieProps) {
  const blades = usePlan(seed, (random) =>
    Array.from({ length: 36 }, (_, index) => {
      const x = -2 + (index / 35) * 104 + between(random, -1.2, 1.2);
      const near = Math.abs(x - HAND_X) < 5;
      return {
        index,
        x,
        near,
        push: x < HAND_X ? -16 : 16,
        height: near ? 12 : between(random, 9, 19),
        width: between(random, 2.2, 3.6),
        lean: between(random, -9, 9),
        color: GRASS[index % GRASS.length],
        delay: 0.3 + random() * 0.55,
      };
    }),
  );
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.herbe} className="bg-nuit">
      {/* La porte s'ouvre sur le dehors : le ciel se lève en fondu (un seul changement de luminosité, doux). */}
      <m.div
        className="absolute inset-0 bg-[linear-gradient(180deg,#6fc0f5_0%,#a9dcff_58%,#d8f1ff_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
      />
      <m.div className="absolute left-[6%] top-[17%] w-[clamp(90px,13vw,170px)] opacity-90" initial={{ x: "0vw" }} animate={{ x: "5vw" }} transition={{ duration: 3.5, ease: "linear" }}>
        <Cloud className="w-full" />
      </m.div>
      <m.div className="absolute right-[4%] top-[9%] w-[clamp(70px,9vw,120px)] opacity-80" initial={{ x: "0vw" }} animate={{ x: "-4vw" }} transition={{ duration: 3.5, ease: "linear" }}>
        <Cloud className="w-full" />
      </m.div>

      {/* Le sol et l'herbe qui pousse. */}
      <div className="absolute inset-x-0 bottom-0 h-[14vh] bg-[linear-gradient(180deg,#4fae33,#2f7d1c)]" />
      {blades.map((blade) => (
        <m.div
          key={blade.index}
          className="absolute bottom-[13vh]"
          style={{ left: `${blade.x}%`, width: `max(12px, ${blade.width}vw)`, height: `${blade.height}vh`, originY: 1, x: "-50%" }}
          initial={{ scaleY: 0, rotate: blade.lean }}
          animate={{ scaleY: 1, rotate: blade.near ? [blade.lean, blade.lean, blade.lean + blade.push, blade.lean] : [blade.lean, blade.lean + 3, blade.lean] }}
          transition={{
            scaleY: { delay: blade.delay, type: "spring", stiffness: 180, damping: 14 },
            rotate: blade.near ? { delay: 0, duration: 2.4, times: [0, TOUCH / 2.4, (TOUCH + 0.12) / 2.4, 1] } : { delay: 1.2, duration: 2.2, ease: "easeInOut" },
          }}
        >
          <Blade color={blade.color} />
        </m.div>
      ))}

      {/* Le bras descend du ciel, l'index touche l'herbe. */}
      <m.div
        className="absolute bottom-[24.5vh] w-[clamp(52px,6.5vw,84px)]"
        style={{ left: `${HAND_X}%`, x: "-50%" }}
        initial={{ y: "-95vh" }}
        animate={{ y: ["-95vh", "0vh", "1.2vh", "0vh"] }}
        transition={{ delay: 0.8, duration: TOUCH - 0.8 + 0.15, times: [0, 0.78, 0.9, 1], ease: "easeOut" }}
      >
        <div className="absolute bottom-[95%] left-[16.7%] h-[100vh] w-[66.6%] border-x-[3px] border-[#1b1420] bg-[#3a3350]" />
        <PixelArt rows={HAND_ROWS} palette={HAND_PALETTE} className="relative block w-full" />
      </m.div>
      <m.div
        className="absolute bottom-[24vh] size-[18vmin] rounded-full border-[3px] border-white"
        style={{ left: `${HAND_X}%`, x: "-50%", y: "50%" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.8], opacity: [0.9, 0] }}
        transition={{ delay: TOUCH, duration: 0.7, ease: "easeOut" }}
      />
      <Burst
        seed={seed + 3}
        count={12}
        x={HAND_X}
        y={75}
        delay={TOUCH}
        duration={0.9}
        distance={[8, 20]}
        angle={[190, 350]}
        gravity={6}
        size={[8, 14]}
        spin={90}
        render={(index) => <div className="aspect-square w-full" style={{ background: index % 2 ? "#fff6a8" : "#ffffff" }} />}
      />
      <m.p
        className="hud-text absolute whitespace-nowrap text-[clamp(1rem,2.6vw,1.5rem)] text-[#fff27a]"
        style={{ left: `${HAND_X - 8}%`, top: "60%", x: "-50%" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, -24, -40] }}
        transition={{ delay: TOUCH + 0.08, duration: 1.4, times: [0, 0.12, 0.75, 1] }}
      >
        +1 vitamine D
      </m.p>

      <div className="absolute inset-x-0 top-[8vh] flex flex-col items-center gap-[clamp(0.8rem,3vh,1.6rem)] px-4 text-center">
        <Slam delay={0.3} from={2.6} className="text-[clamp(2.3rem,9vw,6.4rem)]">
          Touche de l&apos;herbe
        </Slam>
        {/* Bannière de découverte de zone, façon jeu en monde ouvert. */}
        <m.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5, ease: EASE_OUT }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: INK }}>
            Zone découverte
          </p>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-[10vw] max-w-28" style={{ background: INK }} />
            <p className="text-[clamp(2rem,6vw,3.8rem)] leading-tight text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif', ...OUTLINE }}>
              Dehors
            </p>
            <span className="h-0.5 w-[10vw] max-w-28" style={{ background: INK }} />
          </div>
          <p className="text-sm italic" style={{ color: INK }}>
            Niveau recommandé : 1
          </p>
        </m.div>
        <Caption delay={2.45}>« {shortWord(word, 30)} » : pas chouffin. Mais t&apos;as pris l&apos;air, c&apos;est déjà ça.</Caption>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */

export default function VieNormaleEgg(props: VieProps) {
  switch (props.variant) {
    case "herbe":
    default:
      return <VieHerbe {...props} />;
  }
}
