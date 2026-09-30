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

export default function VieNormaleEgg(props: VieProps) {
  switch (props.variant) {
    case "soleil":
      return <VieSoleil {...props} />;
    case "chargement":
      return <VieChargement {...props} />;
    case "herbe":
    default:
      return <VieHerbe {...props} />;
  }
}
