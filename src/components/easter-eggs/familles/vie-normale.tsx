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
import { Burst, EASE_OUT, Pop, Rain, Rays, Rise, Slam, Stage, between, shortWord, usePlan } from "../kit";
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

/**
 * La main du chouffin : le curseur « main » des liens hypertextes, en pixels,
 * géant. Dessiné index vers le haut, retourné à l'affichage : le chouffin ne sait
 * toucher l'herbe qu'en cliquant dessus.
 */
const CURSOR_ROWS = [
  "......kk.........",
  ".....kwwk........",
  ".....kwwk........",
  ".....kwwk........",
  ".....kwwk........",
  ".....kwwkkk......",
  ".....kwwkwwkkk...",
  ".....kwwkwwkwwkk.",
  "..kk.kwwkwwkwwkwk",
  ".kwwkkwwwwwwwwkwk",
  ".kwwwkwwwwwwwwwwk",
  "..kwwwwwwwwwwwwwk",
  "..kwwwwwwwwwwwwdk",
  "...kwwwwwwwwwwdk.",
  "...kwwwwwwwwwwdk.",
  "....kwwwwwwwwdk..",
  "....kwwwwwwwwdk..",
  ".....kwwwwwwwk...",
  ".....kkkkkkkkk...",
] as const;
const CURSOR_PALETTE = { k: "#141018", w: "#ffffff", d: "#c9d3e0" };
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

      {/* Le curseur descend du ciel et clique sur l'herbe (pointe de l'index = point de clic). */}
      <m.div
        className="absolute bottom-[24.5vh] w-[clamp(78px,9.5vw,136px)]"
        style={{ left: `${HAND_X}%`, x: "-38%" }}
        initial={{ y: "-95vh" }}
        animate={{ y: ["-95vh", "0vh", "1.4vh", "0vh"] }}
        transition={{ delay: 0.8, duration: TOUCH - 0.8 + 0.15, times: [0, 0.78, 0.9, 1], ease: "easeOut" }}
      >
        <PixelArt rows={CURSOR_ROWS} palette={CURSOR_PALETTE} className="block w-full -scale-y-100 drop-shadow-[4px_6px_0_rgb(15_42_68/0.35)]" />
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
        style={{ left: `${HAND_X - 15}%`, top: "62%", x: "-50%" }}
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
/* Normie absolu : le soleil, cette grande lumière jaune                */
/* ------------------------------------------------------------------ */

/** Le chouffin en sweat à capuche, yeux grands ouverts (habitués à l'écran), puis plissés. */
const DUDE_TOP = ["....kkkkkk....", "...khhhhhhk...", "..khhhhhhhhk..", "..khsssssshk.."] as const;
const DUDE_BOTTOM = [
  "..khsssssshk..",
  "...khhhhhhk...",
  "..khhhhhhhhk..",
  ".khhhhhhhhhhk.",
  ".khhhhwwhhhhk.",
  ".khhhhhhhhhhk.",
  ".kshhhhhhhhsk.",
  "..kjjjjjjjjk..",
  "..kjjjkkjjjk..",
  "..kjjjk.kjjk..",
  "..kkkkk.kkkk..",
] as const;
const DUDE_OPEN = [...DUDE_TOP, "..khsesseshk..", ...DUDE_BOTTOM.slice(0, 1), "..khssmmsshk..", ...DUDE_BOTTOM.slice(1)];
const DUDE_SQUINT = [...DUDE_TOP, "..khkksskkhk..", ...DUDE_BOTTOM.slice(0, 1), "..khsmmmmshk..", ...DUDE_BOTTOM.slice(1)];
const DUDE_PALETTE = { k: "#141018", h: "#3a3350", s: "#f2c19b", e: "#141018", m: "#8a2330", w: "#cfc8e8", j: "#2f4a78" };
const SQUINT = 1.35;

const DOC_CAPTIONS = [
  { at: 0.35, text: "Documentaire animalier, épisode 1 : dehors." },
  { at: 1.45, text: "Le chouffin découvre le soleil, cette grande lumière jaune." },
] as const;

function VieSoleil({ word, seed, durationMs, onDone }: VieProps) {
  const stars = usePlan(seed, (random) =>
    Array.from({ length: 16 }, (_, id) => ({ id, x: between(random, 2, 98), y: between(random, 3, 55), size: between(random, 2, 4) })),
  );
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.soleil} className="bg-[linear-gradient(180deg,#070c24,#16204a)]">
      {stars.map((star) => (
        <m.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
        />
      ))}
      {/* L'aube : le ciel s'éclaircit en 1,3 s (changement progressif, pas un flash). */}
      <m.div
        className="absolute inset-0 bg-[linear-gradient(180deg,#5fb0ec_0%,#a8dcff_55%,#ffe0a3_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 1.3, ease: "easeInOut" }}
      />

      {/* Le soleil se lève derrière la colline. */}
      <m.div
        className="absolute right-[14%] top-[16%] size-[clamp(110px,17vw,230px)]"
        initial={{ y: "62vh" }}
        animate={{ y: "0vh" }}
        transition={{ delay: 0.25, duration: 1.3, ease: EASE_OUT }}
      >
        <Rays color="rgb(255 226 110 / 0.4)" delay={0.9} spin={25} duration={2.6} />
        <div className="relative size-full rounded-full bg-[radial-gradient(circle_at_40%_38%,#fffbe0_0%,#ffe45c_45%,#ffb81f_100%)] shadow-[0_0_80px_30px_rgb(255_214_80/0.45)]" />
      </m.div>

      <svg viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[30vh] w-full">
        <path d="M0 18 Q 22 4 46 14 T 90 12 T 120 16 V40 H0 Z" fill="#5fbf3a" />
        <path d="M0 26 Q 30 14 64 24 T 120 22 V40 H0 Z" fill="#3f9a26" />
      </svg>

      {/* Le chouffin plisse les yeux quand le soleil l'atteint. */}
      <div className="absolute bottom-[17vh] left-[12%] w-[clamp(84px,10vw,136px)]">
        <m.div className="grid" animate={{ y: [0, 0, -6, 0] }} transition={{ delay: SQUINT, duration: 0.3, times: [0, 0.1, 0.5, 1] }}>
          <m.div className="col-start-1 row-start-1" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: SQUINT, duration: 0.01 }}>
            <PixelArt rows={DUDE_OPEN} palette={DUDE_PALETTE} className="block w-full" />
          </m.div>
          <m.div className="col-start-1 row-start-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: SQUINT, duration: 0.01 }}>
            <PixelArt rows={DUDE_SQUINT} palette={DUDE_PALETTE} className="block w-full" />
          </m.div>
        </m.div>
        {[0, 1].map((drop) => (
          <m.div
            key={drop}
            className="absolute top-[8%] h-[12%] w-[9%] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#7fd0ff] ring-2 ring-[#0f2a44]"
            style={{ left: drop ? "88%" : "2%" }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, 6, 22, 30] }}
            transition={{ delay: SQUINT + 0.25 + drop * 0.2, duration: 0.8 }}
          />
        ))}
        <Pop delay={SQUINT + 0.12} className="absolute bottom-[96%] left-[55%] origin-bottom-left">
          <div className="relative whitespace-nowrap rounded-2xl border-[3px] border-[#141018] bg-white px-3 py-1.5">
            <span className="doge-text text-[clamp(1rem,2.4vw,1.4rem)] text-[#141018] [text-shadow:none]">AAAH ! ÇA BRÛLE !</span>
            <span className="absolute -bottom-[11px] left-4 size-4 rotate-45 border-b-[3px] border-r-[3px] border-[#141018] bg-white" />
          </div>
        </Pop>
        <m.p
          className="hud-text absolute left-[108%] top-[42%] whitespace-nowrap text-[clamp(0.9rem,2.2vw,1.2rem)] text-[#ff6b7a]"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, -20, -40, -52] }}
          transition={{ delay: 2, duration: 1.2, times: [0, 0.15, 0.75, 1] }}
        >
          -1 PV (coup de soleil)
        </m.p>
      </div>

      <div className="absolute inset-x-0 top-[7vh] flex flex-col items-center px-4 text-center">
        <Slam delay={1} from={2.4} className="text-[clamp(2.6rem,10vw,7rem)]">
          Le soleil
        </Slam>
        <Rise delay={1.3} className="meme-text mt-1 text-[clamp(1.2rem,3.6vw,2.4rem)] text-[#ffe45c]">
          Cette grande lumière jaune
        </Rise>
      </div>

      {/* Sous-titres de documentaire animalier, au-dessus du toast. */}
      <div className="absolute inset-x-0 bottom-[max(7.5rem,12vh)] grid justify-items-center px-4 text-center">
        {DOC_CAPTIONS.map((caption, index) => (
          <m.p
            key={caption.text}
            className="col-start-1 row-start-1 max-w-[92vw] bg-black/65 px-3 py-1 text-[clamp(0.95rem,2.2vw,1.2rem)] italic text-white"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ delay: caption.at, duration: index === 0 ? 1.05 : 1.15, times: [0, 0.1, 0.9, 1] }}
          >
            {caption.text}
          </m.p>
        ))}
        <m.p
          className="col-start-1 row-start-1 max-w-[92vw] bg-black/65 px-3 py-1 text-[clamp(0.95rem,2.2vw,1.2rem)] italic text-white"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.62, duration: 0.15 }}
        >
          « {shortWord(word, 30)} » : pas chouffin. Pense à la crème solaire.
        </m.p>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Normie absolu : chargement de la vie normale                        */
/* ------------------------------------------------------------------ */

const CHORES = [
  "Déclarer ses impôts",
  "Boire de l'eau (1,5 L)",
  "Rappeler sa mère",
  "Prendre rendez-vous chez le dentiste",
  "Plier le linge",
  "Répondre aux mails",
] as const;
const LOAD_TIPS = [
  { at: 0.2, text: "Astuce : la vraie vie n'a pas de bouton pause." },
  { at: 1.7, text: "Astuce : aucune sauvegarde possible après un lundi raté." },
] as const;

/** Barre et pourcentage pilotés par la même valeur animée (aucun re-rendu React). */
function useLoadProgress() {
  const progress = useMotionValue(0);
  useEffect(() => {
    const steps = [0, 17, 34, 50, 67, 84, 99, 99, 100];
    const at = [0, ...sounds.CHORES_AT, sounds.LOADED_AT - 0.12, sounds.LOADED_AT];
    const controls = animate(progress, steps, { duration: sounds.LOADED_AT, times: at.map((time) => time / sounds.LOADED_AT), ease: "easeOut" });
    return () => controls.stop();
  }, [progress]);
  return progress;
}

function VieChargement({ word, durationMs, onDone }: VieProps) {
  const progress = useLoadProgress();
  const scaleX = useTransform(progress, (value) => value / 100);
  const label = useTransform(progress, (value) => `${Math.floor(value)} %`);
  const loaded = sounds.LOADED_AT;
  const stall = sounds.CHORES_AT[sounds.CHORES_AT.length - 1];
  return (
    <Stage
      durationMs={durationMs}
      onDone={onDone}
      sound={sounds.chargement}
      className="bg-[repeating-linear-gradient(135deg,#2b3848_0_22px,#2f3d4e_22px_44px)]"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 pb-[max(6rem,10vh)] pt-10">
        <m.div
          className="w-[min(34rem,94vw)] rounded-[2px] bg-[#f4f6f8] p-[clamp(1rem,3vw,1.6rem)] text-[#1b2a3a] shadow-[0_24px_60px_rgb(0_0_0/0.45)]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-[clamp(1.5rem,4.4vw,2.3rem)] uppercase leading-none">
                Chargement de la vie normale
                <m.span initial={{ opacity: 0.2 }} animate={{ opacity: [0.2, 1, 0.2, 1, 0.2, 1] }} transition={{ duration: 3, ease: "linear" }}>
                  ...
                </m.span>
              </p>
              <p className="mt-1 truncate text-sm text-[#4a5a6c]">Lancée par « {shortWord(word, 28)} »</p>
            </div>
            <div className="relative size-9 shrink-0">
              <m.div
                className="absolute inset-0"
                initial={{ rotate: 0, opacity: 1 }}
                animate={{ rotate: 720, opacity: [1, 1, 0] }}
                transition={{
                  rotate: { duration: loaded, ease: (t: number) => Math.floor(t * 24) / 24 },
                  opacity: { duration: loaded + 0.05, times: [0, 0.97, 1] },
                }}
              >
                {Array.from({ length: 8 }, (_, index) => (
                  <span
                    key={index}
                    className="absolute left-1/2 top-0 h-full w-[18%] -translate-x-1/2"
                    style={{ transform: `translateX(-50%) rotate(${index * 45}deg)` }}
                  >
                    <span className="block aspect-square w-full bg-[#1f6fe5]" style={{ opacity: 0.2 + (index / 8) * 0.8 }} />
                  </span>
                ))}
              </m.div>
              <Pop delay={loaded} className="absolute inset-0 grid place-items-center rounded-full bg-[#2e9e44] text-lg font-bold text-white">
                ✓
              </Pop>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-3.5 flex-1 overflow-hidden rounded-[2px] bg-[#d5dde6]">
              <m.div className="h-full origin-left bg-[#1f6fe5]" style={{ scaleX }} />
            </div>
            <m.span className="w-14 text-right font-bold tabular-nums">{label}</m.span>
          </div>
          <div className="relative mt-1.5 h-5 text-sm text-[#4a5a6c]">
            <m.p className="absolute inset-0 truncate" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: stall + 0.1, duration: 0.15 }}>
              Installation des responsabilités...
            </m.p>
            <m.p className="absolute inset-0 truncate" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ delay: stall + 0.1, duration: loaded - stall - 0.05, times: [0, 0.1, 0.85, 1] }}>
              Plus que 1 %. Temps restant estimé : 40 ans.
            </m.p>
            <m.p className="absolute inset-0 truncate font-semibold text-[#2e7d32]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: loaded, duration: 0.15 }}>
              Vie normale chargée. Aucun easter egg détecté.
            </m.p>
          </div>

          <ul className="mt-4 space-y-1.5">
            {CHORES.map((chore, index) => {
              const at = sounds.CHORES_AT[index];
              return (
                <li key={chore} className="flex items-center gap-2.5 text-[clamp(0.92rem,2.2vw,1.02rem)]">
                  <span className="relative grid size-5 shrink-0 place-items-center rounded-full border-2 border-[#9aa7b5]">
                    <Pop delay={at} className="absolute -inset-[2px] grid place-items-center rounded-full bg-[#2e9e44] text-[0.7rem] font-bold text-white">
                      ✓
                    </Pop>
                  </span>
                  <span className="relative">
                    {chore}
                    <m.span
                      className="absolute inset-x-0 top-1/2 h-[2px] origin-left bg-[#1b2a3a]/55"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: at + 0.05, duration: 0.2 }}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </m.div>

        <div className="grid w-[min(34rem,94vw)] text-center">
          {LOAD_TIPS.map((tip, index) => (
            <m.p
              key={tip.text}
              className="col-start-1 row-start-1 text-[clamp(0.9rem,2vw,1.05rem)] text-[#dbe4ee]"
              initial={{ opacity: 0 }}
              animate={index === 0 ? { opacity: [0, 1, 1, 0] } : { opacity: 1 }}
              transition={index === 0 ? { delay: tip.at, duration: LOAD_TIPS[1].at - tip.at, times: [0, 0.12, 0.88, 1] } : { delay: tip.at, duration: 0.2 }}
            >
              {tip.text}
            </m.p>
          ))}
        </div>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Vie ordinaire : réveil du lundi                                     */
/* ------------------------------------------------------------------ */

function AlarmClock({ className }: { className?: string }) {
  const ticks = Array.from({ length: 12 }, (_, index) => index * 30);
  return (
    <svg viewBox="0 0 120 130" aria-hidden="true" className={className}>
      <path d="M22 118 L14 128 M98 118 L106 128" stroke="#141414" strokeWidth={6} strokeLinecap="round" />
      <path d="M8 38 A22 22 0 0 1 44 14 Z" fill="#ffc84a" stroke="#141414" strokeWidth={4} strokeLinejoin="round" />
      <path d="M112 38 A22 22 0 0 0 76 14 Z" fill="#ffc84a" stroke="#141414" strokeWidth={4} strokeLinejoin="round" />
      <rect x="56" y="10" width="8" height="16" rx="2" fill="#141414" />
      <circle cx="60" cy="72" r="50" fill="#d7263d" stroke="#141414" strokeWidth={5} />
      <circle cx="60" cy="72" r="39" fill="#fffaf0" stroke="#141414" strokeWidth={3} />
      {ticks.map((angle) => (
        <line key={angle} x1="60" y1="37" x2="60" y2={angle % 90 === 0 ? 44 : 41} stroke="#141414" strokeWidth={angle % 90 === 0 ? 3 : 2} transform={`rotate(${angle} 60 72)`} />
      ))}
    </svg>
  );
}

const RING_TIMES = [0.12, 1.62] as const;
const RING_LENGTHS = [0.85, 0.55] as const;
const SNOOZE = 1.1;

function ringWobble(length: number) {
  const steps = Math.round(length / 0.05);
  return Array.from({ length: steps + 1 }, (_, index) => (index === steps ? 0 : index % 2 ? 6 : -6));
}

function VieReveil({ word, durationMs, onDone }: VieProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.reveil} className="bg-[linear-gradient(180deg,#121934,#0a0e20)]">
      {/* Fenêtre : le jour se lève à peine. */}
      <div className="absolute right-[8%] top-[12%] grid h-[30vh] w-[min(16rem,30vw)] grid-cols-2 gap-1.5 border-[6px] border-[#2a3358] bg-[#2a3358]">
        <div className="bg-[linear-gradient(180deg,#27407a,#6a5f9e)]" />
        <div className="bg-[linear-gradient(180deg,#27407a,#6a5f9e)]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[24vh] bg-[linear-gradient(180deg,#5b3a22,#3d2616)] shadow-[0_-6px_0_#2a190d]" />

      <div className="absolute inset-x-0 top-[8vh] flex flex-col items-center text-center">
        <p className="font-display text-[clamp(1rem,2.4vw,1.4rem)] uppercase tracking-[0.3em] text-[#aab4d6]">Lundi</p>
        <div className="grid font-display text-[clamp(3.4rem,11vw,7rem)] leading-none tabular-nums text-white">
          <m.span className="col-start-1 row-start-1" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1.55, duration: 0.05 }}>
            07:00
          </m.span>
          <m.span className="col-start-1 row-start-1 text-[#ff8a8a]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55, duration: 0.05 }}>
            07:09
          </m.span>
        </div>
      </div>

      <div className="absolute bottom-[23vh] left-1/2 w-[clamp(150px,22vw,260px)] -translate-x-1/2">
        {RING_TIMES.map((at, index) => (
          <m.div
            key={at}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ delay: at, duration: RING_LENGTHS[index], times: [0, 0.05, 0.9, 1] }}
          >
            <svg viewBox="0 0 120 130" aria-hidden="true" className="absolute -inset-[18%] size-[136%] overflow-visible">
              <path d="M2 20 L-10 10 M-2 36 L-16 34 M118 20 L130 10 M122 36 L136 34" stroke="#ffe14a" strokeWidth={4} strokeLinecap="round" />
            </svg>
          </m.div>
        ))}
        <m.div
          style={{ originY: 1 }}
          animate={{ rotate: [0, ...ringWobble(RING_LENGTHS[0]), 0, ...ringWobble(RING_LENGTHS[1])] }}
          transition={{
            duration: RING_TIMES[1] + RING_LENGTHS[1],
            times: [
              0,
              ...ringWobble(RING_LENGTHS[0]).map((_, index, list) => (RING_TIMES[0] + (index / (list.length - 1)) * RING_LENGTHS[0]) / (RING_TIMES[1] + RING_LENGTHS[1])),
              RING_TIMES[1] / (RING_TIMES[1] + RING_LENGTHS[1]),
              ...ringWobble(RING_LENGTHS[1]).map((_, index, list) => (RING_TIMES[1] + (index / (list.length - 1)) * RING_LENGTHS[1]) / (RING_TIMES[1] + RING_LENGTHS[1])),
            ],
            ease: "linear",
          }}
          className="relative"
        >
          <AlarmClock className="block w-full drop-shadow-[0_10px_0_rgb(0_0_0/0.35)]" />
          {/* Aiguilles : 7 h pile, puis 7 h 09 (le rappel a duré une demi-seconde). */}
          <m.div
            className="absolute bottom-[44.6%] left-1/2 h-[18%] w-[4%] rounded-full bg-[#141414]"
            style={{ x: "-50%", originY: 1 }}
            initial={{ rotate: 210 }}
            animate={{ rotate: 214.5 }}
            transition={{ delay: 1.2, duration: 0.35 }}
          />
          <m.div
            className="absolute bottom-[44.6%] left-1/2 h-[26%] w-[2.6%] rounded-full bg-[#141414]"
            style={{ x: "-50%", originY: 1 }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 54 }}
            transition={{ delay: 1.2, duration: 0.35 }}
          />
          <div className="absolute left-1/2 top-[55.4%] size-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#141414]" />
        </m.div>

        {/* Le curseur géant clique sur « rappel ». */}
        <m.div
          className="absolute bottom-[88%] left-[52%] w-[34%]"
          style={{ x: "-38%" }}
          initial={{ y: "-80vh", opacity: 1 }}
          animate={{ y: ["-80vh", "0vh", "1vh", "0vh", "-80vh"] }}
          transition={{ delay: 0.75, duration: 0.8, times: [0, 0.42, 0.5, 0.58, 1], ease: "easeInOut" }}
        >
          <PixelArt rows={CURSOR_ROWS} palette={CURSOR_PALETTE} className="block w-full -scale-y-100" />
        </m.div>
        <m.div
          className="absolute -top-[4%] left-[82%] whitespace-nowrap"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.08, 1, 1] }}
          transition={{ delay: SNOOZE + 0.02, duration: 0.55, times: [0, 0.2, 0.85, 1] }}
        >
          <span className="block rounded-full bg-white px-3 py-1 text-sm font-bold text-[#0f2a44] shadow-[0_6px_16px_rgb(0_0_0/0.35)]">Rappel dans 9 min</span>
        </m.div>
      </div>

      <m.p
        className="absolute left-1/2 top-[42%] -translate-x-1/2 whitespace-nowrap bg-black/70 px-3 py-1 text-[clamp(0.95rem,2.2vw,1.2rem)] italic text-white"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ delay: 1.2, duration: 0.5, times: [0, 0.2, 0.8, 1] }}
      >
        9 minutes plus tard...
      </m.p>

      {RING_TIMES.map((at, index) => (
        <m.div
          key={at}
          className={`absolute top-[36%] ${index ? "right-[6%]" : "left-[6%]"}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: at + RING_LENGTHS[index] + 0.05, duration: 0.2 }}
        >
          <Slam delay={at + 0.05} from={2.2} rotate={index ? 12 : -12} settle={index ? 8 : -8} className="text-[clamp(2rem,7vw,5rem)] text-[#ffe14a]">
            Driiing !
          </Slam>
        </m.div>
      ))}

      <div className="absolute inset-x-0 bottom-[max(7.5rem,12vh)] flex justify-center px-4">
        <Caption delay={2.25}>« {shortWord(word, 30)} » : pas chouffin. L&apos;énergie d&apos;un lundi 7 h.</Caption>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Vie ordinaire : réseau pro                                          */
/* ------------------------------------------------------------------ */

function Briefcase({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="1" y="1" width="22" height="22" rx="5" fill="#2f6fd6" />
      <rect x="5" y="9" width="14" height="9" rx="1.5" fill="#fff" />
      <path d="M9.5 9 V7.2 A1.2 1.2 0 0 1 10.7 6 H13.3 A1.2 1.2 0 0 1 14.5 7.2 V9" fill="none" stroke="#fff" strokeWidth={1.6} />
      <rect x="5" y="12.2" width="14" height="1.2" fill="#2f6fd6" />
    </svg>
  );
}

const NOTIF_SLOT = 5.1;
const NETWORK_DOGE = [
  { text: "wow", color: "#ff3ea5", x: 6, y: 14, rotate: -10 },
  { text: "such réseau", color: "#3ef0ff", x: 70, y: 10, rotate: 8 },
  { text: "very synergie", color: "#fff23e", x: 4, y: 74, rotate: 6 },
  { text: "much afterwork", color: "#b6ff2e", x: 64, y: 80, rotate: -7 },
] as const;

function VieReseau({ word, durationMs, onDone }: VieProps) {
  const arrivals = sounds.NOTIFICATIONS_AT;
  const total = durationMs / 1000;
  const notifications = [
    "Vous apparaissez dans 3 recherches cette semaine.",
    "Jean-Michel (chef de projet transverse) a aimé votre post.",
    "Félicitez Sandrine pour ses 5 ans chez Tableurs & Cie !",
    `Nouvelle compétence validée : « ${shortWord(word, 24)} ».`,
    "Afterwork jeudi 18 h. Dress code : polo.",
  ];
  /** Chaque notification entre en haut, puis descend d'un cran à chaque nouvelle (transform seulement). */
  const slide = (index: number) => {
    const times = [0, arrivals[index] / total];
    const values = ["-1.5rem", "0rem"];
    for (let next = index + 1; next < arrivals.length; next++) {
      times.push(arrivals[next] / total, (arrivals[next] + 0.18) / total);
      values.push(`${(next - index - 1) * NOTIF_SLOT}rem`, `${(next - index) * NOTIF_SLOT}rem`);
    }
    times.push(1);
    values.push(values[values.length - 1]);
    return { times, values };
  };
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.reseau} className="bg-[radial-gradient(circle_at_50%_40%,#23304d,#0c1122_75%)]">
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-6">
        <m.div
          className="relative h-[min(38rem,72vh)] w-[min(22rem,84vw)] overflow-hidden rounded-[2.4rem] border-[10px] border-[#101014] bg-[linear-gradient(160deg,#7fb4ff,#b9a7ff_55%,#ffc3d9)] shadow-[0_30px_70px_rgb(0_0_0/0.55)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, x: arrivals.flatMap(() => [0, -3, 3, -2, 0]).concat(0) }}
          transition={{
            opacity: { duration: 0.25 },
            y: { duration: 0.35, ease: EASE_OUT },
            x: { duration: total, times: arrivals.flatMap((at) => [at, at + 0.04, at + 0.08, at + 0.12, at + 0.16].map((time) => time / total)).concat(1) },
          }}
        >
          <div className="pt-8 text-center text-white [text-shadow:0_1px_8px_rgb(15_42_68/0.35)]">
            <p className="text-[clamp(3rem,9vw,4.4rem)] font-light leading-none tabular-nums">08:47</p>
            <p className="mt-1 text-sm font-medium">lundi 3 mars</p>
          </div>
          <div className="relative mt-5 px-3">
            {notifications.map((text, index) => {
              const { times, values } = slide(index);
              return (
                <m.div
                  key={text}
                  className="absolute inset-x-3 top-0 h-[4.6rem] rounded-2xl bg-white/88 px-3 py-2 text-[#10141c] shadow-[0_4px_14px_rgb(15_42_68/0.18)]"
                  initial={{ opacity: 0, y: "-1.5rem" }}
                  animate={{ opacity: 1, y: values }}
                  transition={{ opacity: { delay: arrivals[index], duration: 0.18 }, y: { duration: total, times, ease: "easeOut" } }}
                >
                  <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-[#51607a]">
                    <Briefcase className="size-4" />
                    Réseau pro
                    <span className="ml-auto font-normal normal-case tracking-normal">maintenant</span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-[0.88rem] leading-snug">{text}</p>
                </m.div>
              );
            })}
          </div>
        </m.div>
      </div>
      {NETWORK_DOGE.map((doge, index) => (
        <m.p
          key={doge.text}
          className="doge-text absolute whitespace-nowrap text-[clamp(1.4rem,3.6vw,2.6rem)]"
          style={{ left: `${doge.x}%`, top: `${doge.y}%`, color: doge.color, rotate: doge.rotate }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.2, 1] }}
          transition={{ delay: 2.3 + index * 0.12, duration: 0.35 }}
        >
          {doge.text}
        </m.p>
      ))}
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Vie ordinaire : pluie d'avocado toasts                              */
/* ------------------------------------------------------------------ */

function Latte({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true" className={className}>
      <ellipse cx="50" cy="70" rx="44" ry="8" fill="#f4efe6" stroke="#3b2a1a" strokeWidth={3} />
      <path d="M16 20 H84 L76 64 Q50 74 24 64 Z" fill="#ffffff" stroke="#3b2a1a" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M84 28 Q98 30 94 44 Q90 54 80 52" fill="none" stroke="#3b2a1a" strokeWidth={3.5} />
      <ellipse cx="50" cy="20" rx="34" ry="7" fill="#c98a4a" stroke="#3b2a1a" strokeWidth={3} />
      <path d="M50 25 C44 19 40 16 44 14 C47 13 49 15 50 17 C51 15 53 13 56 14 C60 16 56 19 50 25 Z" fill="#fff4e0" />
    </svg>
  );
}

function VieAvocat({ word, seed, durationMs, onDone }: VieProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.avocat} className="bg-[linear-gradient(180deg,#bfe9d8,#ffe2cf)]">
      <Rain
        seed={seed}
        count={18}
        delay={[0.15, 1.6]}
        duration={[1.5, 2.2]}
        size={[54, 96]}
        spin={220}
        sway={5}
        render={(index) =>
          index % 5 === 4 ? (
            <Latte className="w-full drop-shadow-[0_6px_0_rgb(59_42_26/0.25)]" />
          ) : (
            <AvocadoToast className="w-full drop-shadow-[0_6px_0_rgb(59_42_26/0.25)]" />
          )
        }
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[clamp(1rem,3vh,1.8rem)] px-4 pb-[max(6rem,10vh)] pt-10 text-center">
        <Slam delay={0.25} from={2.4} className="max-w-[94vw] text-[clamp(2.2rem,8vw,5.6rem)]">
          Il pleut des avocado toasts
        </Slam>
        {/* Bulletin météo façon widget plat de 2013. */}
        <Pop delay={0.6} stiffness={380} damping={22} className="w-[min(24rem,92vw)] rounded-[2px] bg-white p-4 text-left text-[#1b2a3a] shadow-[0_18px_40px_rgb(59_42_26/0.25)]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5b6b7c]">Météo du dimanche</p>
          <div className="mt-2 flex items-center gap-4">
            <AvocadoToast className="w-16 shrink-0" />
            <div>
              <p className="text-4xl font-light leading-none tabular-nums">11 h 30</p>
              <p className="mt-1 font-semibold">Averses d&apos;avocado toasts</p>
            </div>
          </div>
          <ul className="mt-3 space-y-0.5 text-sm text-[#3d4b5a]">
            <li>File d&apos;attente : 45 min</li>
            <li>Rafales de granola : 40 km/h</li>
            <li>Addition moyenne : 34 €</li>
          </ul>
        </Pop>
        <Caption delay={1.9}>« {shortWord(word, 30)} » : pas chouffin, mais très brunch.</Caption>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Vie ordinaire : mode adulte activé                                  */
/* ------------------------------------------------------------------ */

const ADULT_SETTINGS = [
  "Mode adulte",
  "Coucher à 22 h 30",
  "Cinq fruits et légumes par jour",
  "Lire les conditions générales",
  "Soirée jeux jusqu'à 4 h",
  "Chouffe en semaine",
  "Notifications de la banque",
] as const;

/** Interrupteur à glissière d'iOS 7 : le blanc se rétracte pour révéler le vert (transform seulement). */
function Switch({ at, on }: { at: number; on: boolean }) {
  const transition = { delay: at, type: "spring", stiffness: 520, damping: 30 } as const;
  return (
    <span className="relative inline-block h-[31px] w-[51px] shrink-0 overflow-hidden rounded-full bg-[#e5e5ea]">
      <m.span className="absolute inset-0 rounded-full bg-[#4cd964]" initial={{ opacity: on ? 0 : 1 }} animate={{ opacity: on ? 1 : 0 }} transition={{ delay: at, duration: 0.15 }} />
      <m.span className="absolute inset-[1.5px] rounded-full bg-white" initial={{ scale: on ? 1 : 0 }} animate={{ scale: on ? 0 : 1 }} transition={transition} />
      <m.span
        className="absolute left-[2px] top-[2px] size-[27px] rounded-full bg-white shadow-[0_2px_4px_rgb(0_0_0/0.3),0_0_0_0.5px_rgb(0_0_0/0.1)]"
        initial={{ x: on ? 0 : 20 }}
        animate={{ x: on ? 20 : 0 }}
        transition={transition}
      />
    </span>
  );
}

function VieAdulte({ word, durationMs, onDone }: VieProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.adulte} className="bg-nuit/95">
      <div className="absolute inset-0 flex items-center justify-center px-4 pb-[max(5rem,8vh)] pt-10">
        <m.div
          className="w-[min(26rem,94vw)] overflow-hidden rounded-[10px] bg-[#efeff4] text-[#000] shadow-[0_30px_70px_rgb(0_0_0/0.55)]"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-[#c8c7cc] bg-[#f7f7f8] px-3 py-2.5">
            <span className="text-[1.05rem] text-[#007aff]">‹ Vie</span>
            <span className="text-[1.05rem] font-semibold">Réglages</span>
            <span />
          </div>
          <p className="px-4 pb-1.5 pt-5 text-[0.8rem] uppercase text-[#6d6d72]">Général</p>
          <ul className="border-y border-[#c8c7cc] bg-white">
            {ADULT_SETTINGS.map((label, index) => {
              const toggle = sounds.TOGGLES[index];
              return (
                <li key={label} className="flex min-h-11 items-center justify-between gap-3 pl-4 pr-3">
                  <span className={`py-2 text-[1rem] ${index === 0 ? "font-semibold" : ""}`}>{label}</span>
                  <Switch at={toggle.at} on={toggle.on} />
                </li>
              );
            })}
          </ul>
          <p className="px-4 pb-5 pt-2 text-[0.8rem] leading-snug text-[#6d6d72]">
            Le mode adulte désactive automatiquement les soirées qui finissent après minuit. Activé par « {shortWord(word, 24)} ».
          </p>
        </m.div>
      </div>
      <div className="absolute inset-x-0 top-[5vh] flex justify-center px-4">
        <Slam delay={2.3} from={2.6} className="text-[clamp(2.4rem,9vw,6rem)] text-[#4cd964]">
          Mode adulte activé
        </Slam>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Presque chouffin : réactions légères, sans voile, qui laissent cliquer */
/* ------------------------------------------------------------------ */

/** Halo sombre local derrière une réaction légère : lisible sur la carte de verdict, sans voiler l'écran. */
function Spot() {
  return <div className="absolute -inset-x-[18%] -inset-y-[45%] rounded-full bg-[radial-gradient(closest-side,rgb(14_10_22/0.78),rgb(14_10_22/0.45)_60%,transparent)]" />;
}

/** Ce qu'il manquait pour être chouffin (un verdict renversé par les votes peut dépasser 50). */
function missing(score: number): string {
  if (score >= 51) return "Il manquait juste quelques votes.";
  const points = 51 - score;
  return `Il manquait ${points} point${points > 1 ? "s" : ""}.`;
}

function Goal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true" className={className}>
      <g stroke="#ffffff" strokeOpacity={0.55} strokeWidth={1.2}>
        {[20, 32, 44, 56, 68, 80].map((x) => (
          <line key={`v${x}`} x1={x} y1="8" x2={x} y2="80" />
        ))}
        {[20, 32, 44, 56, 68].map((y) => (
          <line key={`h${y}`} x1="8" y1={y} x2="92" y2={y} />
        ))}
      </g>
      <path d="M8 80 V8 H92 V80" fill="none" stroke="#141414" strokeWidth={9} strokeLinejoin="round" />
      <path d="M8 80 V8 H92 V80" fill="none" stroke="#ffffff" strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
}

function Ball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <circle cx="20" cy="20" r="18" fill="#ffffff" stroke="#141414" strokeWidth={2.5} />
      <path d="M20 12 L27 17 L24.5 25 H15.5 L13 17 Z" fill="#141414" />
      <path d="M20 12 V3 M27 17 L36 14 M24.5 25 L30 33 M15.5 25 L10 33 M13 17 L4 14" stroke="#141414" strokeWidth={2} />
    </svg>
  );
}

const POST_HIT = 0.58;

function ViePoteau({ score, durationMs, onDone }: VieProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.poteau} mode="light">
      <m.div
        className="absolute left-1/2 top-[30%] h-[clamp(150px,26vh,230px)] w-[min(30rem,90vw)]"
        style={{ x: "-50%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.85, times: [0, 0.06, 0.86, 1] }}
      >
        <Spot />
        <m.div
          className="absolute bottom-0 right-0 w-[46%]"
          animate={{ x: [0, 0, 4, -3, 2, 0] }}
          transition={{ duration: POST_HIT + 0.3, times: [0, POST_HIT / (POST_HIT + 0.3), 0.8, 0.87, 0.94, 1] }}
        >
          <Goal className="w-full drop-shadow-[0_6px_0_rgb(0_0_0/0.35)]" />
        </m.div>
        {/* Le ballon part, frappe le poteau gauche, et ressort. */}
        <m.div
          className="absolute bottom-0 left-0 w-[clamp(34px,5vw,48px)]"
          initial={{ x: "0%", y: "0%", rotate: 0 }}
          animate={{ left: ["0%", "50%", "30%"], y: ["0%", "-360%", "-40%"], rotate: [0, 540, 900] }}
          transition={{ duration: POST_HIT + 0.55, times: [0, POST_HIT / (POST_HIT + 0.55), 1], ease: ["easeOut", "easeIn"] }}
        >
          <Ball className="w-full" />
        </m.div>
        <m.p
          className="hud-text absolute left-[50%] top-[4%] text-[clamp(1rem,2.6vw,1.4rem)] text-[#ffe14a]"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 1] }}
          transition={{ delay: POST_HIT, duration: 0.5 }}
        >
          Doiiing
        </m.p>
        <div className="absolute inset-x-0 -top-[42%] flex flex-col items-center gap-2 text-center">
          <Pop delay={POST_HIT + 0.15} className="meme-text whitespace-nowrap text-[clamp(1.8rem,6vw,3.4rem)]">
            Si près du but...
          </Pop>
          <Rise delay={POST_HIT + 0.35} distance={8} className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#0f2a44] shadow-[0_6px_16px_rgb(0_0_0/0.35)]">
            {missing(score)}
          </Rise>
        </div>
      </m.div>
    </Stage>
  );
}

function VieChope({ score, seed, durationMs, onDone }: VieProps) {
  const THRESHOLD = 0.82;
  const level = THRESHOLD * Math.min(0.97, Math.max(0.35, score / 51));
  const bubbles = usePlan(seed, (random) => Array.from({ length: 7 }, (_, id) => ({ id, x: between(random, 22, 78), delay: 0.3 + random() * 0.8 })));
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.chope} mode="light">
      <m.div
        className="absolute left-1/2 top-[28%] flex items-end gap-4"
        style={{ x: "-50%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.85, times: [0, 0.06, 0.86, 1] }}
      >
        <Spot />
        <div className="relative w-[clamp(84px,12vw,130px)]">
          {/* Le verre (trapèze) et la bière qui monte... jusqu'à juste sous la ligne. */}
          <div className="relative aspect-[3/4] overflow-hidden bg-white/12 [clip-path:polygon(0_0,100%_0,88%_100%,12%_100%)]">
            <m.div
              className="absolute inset-0 origin-bottom border-t-[6px] border-[#fff8e6] bg-[linear-gradient(180deg,#ffd46a,#f0a020)]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: level }}
              transition={{ delay: 0.15, duration: 0.85, ease: EASE_OUT }}
            />
            {bubbles.map((bubble) => (
              <m.span
                key={bubble.id}
                className="absolute bottom-[4%] size-1.5 rounded-full bg-white/80"
                style={{ left: `${bubble.x}%` }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: ["0%", `-${level * 900}%`] }}
                transition={{ delay: bubble.delay, duration: 0.7, ease: "easeOut" }}
              />
            ))}
          </div>
          <svg viewBox="0 0 30 40" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
            <path d="M0.8 0.5 H29.2 L26.2 39.5 H3.8 Z" fill="none" stroke="#ffffff" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
          </svg>
          {/* La ligne du seuil chouffin. */}
          <div className="absolute -left-[12%] -right-[12%] border-t-[3px] border-dashed border-dew" style={{ bottom: `${THRESHOLD * 100}%` }} />
          <m.div
            className="absolute -right-[18%] top-[6%] h-[16%] w-[14%] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#7fd0ff] ring-2 ring-[#0f2a44]"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, 4, 18, 26] }}
            transition={{ delay: 1.05, duration: 0.7 }}
          />
        </div>
        <div className="flex max-w-[52vw] flex-col items-start gap-2 pb-[10%]">
          <p className="pixel-text text-xs text-dew">Seuil chouffin : 51</p>
          <Pop delay={1.0} className="meme-text text-[clamp(1.8rem,6vw,3.2rem)]">
            Presque !
          </Pop>
          <Rise delay={1.15} distance={8} className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#0f2a44] shadow-[0_6px_16px_rgb(0_0_0/0.35)]">
            Il manque juste une Chouffe.
          </Rise>
        </div>
      </m.div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */

export default function VieNormaleEgg(props: VieProps) {
  switch (props.variant) {
    case "soleil":
      return <VieSoleil {...props} />;
    case "chargement":
      return <VieChargement {...props} />;
    case "reveil":
      return <VieReveil {...props} />;
    case "reseau":
      return <VieReseau {...props} />;
    case "avocat":
      return <VieAvocat {...props} />;
    case "adulte":
      return <VieAdulte {...props} />;
    case "poteau":
      return <ViePoteau {...props} />;
    case "chope":
      return <VieChope {...props} />;
    case "herbe":
    default:
      return <VieHerbe {...props} />;
  }
}
