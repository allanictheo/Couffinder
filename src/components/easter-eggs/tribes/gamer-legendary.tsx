"use client";

/**
 * Tribu gamer, apothéoses légendaires (score >= 95), dans leur propre module :
 * - illuminati confirmé (montage MLG complet) ;
 * - code triche (↑↑↓↓←→←→BA) ;
 * - butin légendaire (coffre, faisceau orange, fiche d'objet de MMORPG) ;
 * - record du monde (chrono, splits dorés, chat de stream qui s'emballe) ;
 * - boss final vaincu (le Lundi fond sous les coups, victoire, level up jusqu'au 99) ;
 * - évolution (le mot brille, pulse et devient « MOT ULTIME ») ;
 * - rage quit inversé (les normies quittent la partie un par un, « gg ez » adouci).
 *
 * Dessins, textes et mélodies originaux : on cite les codes, jamais un jeu précis.
 */

import { m } from "motion/react";
import * as sounds from "@/lib/client/tribe-sounds/gamer-legendary";
import { PixelArt, PixelGlasses } from "../../art";
import { PixelPad } from "../icons";
import {
  Burst,
  Counter,
  EASE_OUT,
  Flash,
  LensFlare,
  Pop,
  Rays,
  Rise,
  Scramble,
  Shake,
  Slam,
  Stage,
  between,
  letters,
  shortWord,
  usePlan,
  wordSize,
} from "../kit";
import type { EggProps } from "../types";
import { HitmarkerAt, Projectile, VIGNETTE, hitPlan, shuffle } from "./gamer-shared";

/** Texte qui s'écrit lettre à lettre (boîte de dialogue, chat). */
function Typed({ text, delay, step = 0.03, className = "" }: { text: string; delay: number; step?: number; className?: string }) {
  return (
    <span className={className}>
      {letters(text).map(({ char, index }) => (
        <m.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + index * step, duration: 0.01 }}>
          {char}
        </m.span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Légendaires                                                         */
/* ------------------------------------------------------------------ */

function IlluminatiTriangle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 108" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="illu-gold" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff2a8" />
          <stop offset="0.5" stopColor="#ffc93a" />
          <stop offset="1" stopColor="#c47f00" />
        </linearGradient>
      </defs>
      <path d="M60 4 L116 102 H4 Z" fill="url(#illu-gold)" stroke="#3d2600" strokeWidth={4} strokeLinejoin="round" />
      <g stroke="#8a5a00" strokeWidth={1.6} opacity={0.6}>
        <path d="M33 54 H87 M22 72 H98 M12 90 H108" />
        <path d="M60 72 V90 M45 54 V72 M75 54 V72 M38 90 V102 M82 90 V102" />
      </g>
      <path d="M36 60 Q60 36 84 60 Q60 80 36 60 Z" fill="#fff" stroke="#3d2600" strokeWidth={3} />
      <circle cx="60" cy="60" r="10" fill="#b6ff2e" stroke="#3d2600" strokeWidth={2.5} />
      <circle cx="60" cy="60" r="4.5" fill="#111" />
      <circle cx="63" cy="57" r="2" fill="#fff" />
    </svg>
  );
}

const GAMER_DOGE = ["wow", "such légende", "very {word}", "much MLG", "so noscope", "many hitmarker"];
const DOGE_COLORS = ["#ff3ea5", "#3ef0ff", "#fff23e", "#b6ff2e", "#ff8a1a", "#c4b0ff"];
const DOGE_SLOTS = [
  { x: 5, y: 12 },
  { x: 62, y: 10 },
  { x: 4, y: 78 },
  { x: 60, y: 84 },
  { x: 70, y: 44 },
];

function LegendaryIlluminati({ word, seed, durationMs, onDone }: EggProps) {
  const plan = usePlan(seed, (random) => ({
    hits: hitPlan(random, [0.06, 0.26, 0.44, 0.72, 0.94, 1.12, 1.3]),
    doges: DOGE_SLOTS.map((slot, id) => ({
      id,
      text: shuffle(GAMER_DOGE, random)[0].replace("{word}", shortWord(word.toLocaleLowerCase("fr-FR"), 16)),
      color: DOGE_COLORS[id % DOGE_COLORS.length],
      x: slot.x + between(random, -2, 3),
      y: slot.y + between(random, -3, 3),
      rotate: between(random, -14, 14),
      delay: 0.5 + id * 0.18,
      size: between(random, 1.1, 1.8),
    })),
  }));
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.illuminati} className={VIGNETTE}>
      <Rays color="rgb(182 255 46 / 0.14)" delay={1.2} spin={60} duration={2.2} />
      <LensFlare delay={0.1} x="24%" y="26%" />
      <Burst seed={seed + 3} count={12} delay={0.12} distance={[36, 72]} gravity={30} size={[44, 84]} spin={620} render={(index) => <Projectile index={index} />} />
      <Shake at={[0, 1.25]} intensity={9}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <m.div
            className="w-[clamp(110px,20vw,230px)] drop-shadow-[0_0_30px_rgb(255_201_58/0.55)]"
            initial={{ scale: 0, rotate: -720, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.9, ease: EASE_OUT }}
          >
            <IlluminatiTriangle className="w-full" />
          </m.div>
          <div className="relative mt-2">
            <Slam from={3} rotate={-12} className="text-[clamp(3rem,15vw,11rem)]" style={{ color: "var(--color-rarity-legendary)" }}>
              Légendaire !
            </Slam>
            <m.div
              className="absolute left-1/2 top-[4%] w-[44%] min-w-28"
              style={{ x: "-50%" }}
              initial={{ y: "-80vh", rotate: -10 }}
              animate={{ y: ["-80vh", "0vh", "-2.5vh", "0vh"], rotate: [-10, 0, 3, 0] }}
              transition={{ delay: 0.3, duration: 0.85, times: [0, 0.72, 0.86, 1], ease: "easeIn" }}
            >
              <PixelGlasses className="w-full drop-shadow-[0_6px_0_rgb(0_0_0/0.35)]" />
            </m.div>
          </div>
          <Pop delay={1.9} className="hud-text mt-3 text-center text-[clamp(1rem,3.2vw,1.9rem)] text-dew">
            Illuminati confirmé
          </Pop>
          <Rise delay={2.15} className="meme-text mt-2 max-w-[92vw] break-words text-center text-[clamp(1.2rem,4vw,2.4rem)]">
            « {word} »
          </Rise>
        </div>
      </Shake>
      <m.p
        className="meme-text absolute left-[5%] top-[30%] text-[clamp(1.6rem,6vw,4rem)] text-rarity-legendary"
        initial={{ opacity: 0, scale: 0, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 500, damping: 14 }}
      >
        Wombo combo
      </m.p>
      <m.p
        className="meme-text absolute bottom-[20%] right-[5%] text-[clamp(1.5rem,5.5vw,3.6rem)]"
        initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ delay: 2.3, duration: 0.6, ease: "easeOut" }}
      >
        360 no scope
      </m.p>
      {plan.doges.map((doge) => (
        <m.p
          key={doge.id}
          className="doge-text absolute whitespace-nowrap"
          style={{ left: `${doge.x}%`, top: `${doge.y}%`, color: doge.color, fontSize: `${doge.size}rem`, rotate: doge.rotate }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.2, 1] }}
          transition={{ delay: doge.delay, duration: 0.4, ease: "easeOut" }}
        >
          {doge.text}
        </m.p>
      ))}
      {plan.hits.map((hit) => (
        <HitmarkerAt key={hit.id} {...hit} />
      ))}
      <Flash at={1.2} color="#fff3c4" peak={0.3} />
      <LensFlare delay={2.4} x="74%" y="68%" />
    </Stage>
  );
}

const ARROW_ROWS = ["...k...", "..kkk..", ".kkkkk.", "kkkkkkk", "..kkk..", "..kkk..", "..kkk.."] as const;
const KONAMI = ["up", "up", "down", "down", "left", "right", "left", "right", "B", "A"] as const;
const ARROW_ROTATION: Record<string, number> = { up: 0, right: 90, down: 180, left: 270 };
const FIREWORK_COLORS = ["#b6ff2e", "#3ef0ff", "#ff3ea5", "#fff23e", "#ff8a1a", "#ffffff"];

function LegendaryKonami({ word, seed, durationMs, onDone }: EggProps) {
  const display = shortWord(word, 16).toUpperCase();
  const fireworks = [
    { at: 2.05, x: 18, y: 24 },
    { at: 2.45, x: 82, y: 28 },
    { at: 2.85, x: 50, y: 14 },
  ];
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.konami} className="bg-[radial-gradient(circle_at_center,#12280b_0%,#040806_75%)]">
      <div className="scanlines" />
      {fireworks.map((firework, index) => (
        <Burst
          key={index}
          seed={seed + index}
          count={22}
          x={firework.x}
          y={firework.y}
          delay={firework.at}
          duration={1}
          distance={[12, 28]}
          gravity={10}
          size={[10, 18]}
          spin={0}
          render={(k) => <div className="aspect-square w-full" style={{ background: FIREWORK_COLORS[(k + index) % FIREWORK_COLORS.length] }} />}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[clamp(0.8rem,3vh,1.8rem)] px-3 text-center">
        <div className="flex max-w-[94vw] flex-wrap justify-center gap-[clamp(4px,1vw,12px)]">
          {KONAMI.map((key, index) => (
            <m.div
              key={index}
              className="grid size-[clamp(30px,6vw,62px)] place-items-center rounded-[4px] border-[3px] border-black bg-[#e8e8e8] shadow-[0_4px_0_#000]"
              initial={{ opacity: 0, y: -20, scale: 1.4 }}
              animate={{ opacity: 1, y: [-20, 0, 3, 0], scale: [1.4, 1, 0.9, 1] }}
              transition={{ delay: 0.1 + index * 0.12, duration: 0.25 }}
            >
              {key === "A" || key === "B" ? (
                <span className="pixel-text text-[clamp(0.9rem,2.6vw,1.8rem)] font-bold text-[#c1121f]">{key}</span>
              ) : (
                <PixelArt rows={ARROW_ROWS} palette={{ k: "#111" }} className="w-[58%]" style={{ rotate: `${ARROW_ROTATION[key]}deg` }} />
              )}
            </m.div>
          ))}
        </div>

        <m.p
          className="hud-text text-[clamp(1.4rem,5.4vw,3.6rem)] text-dew"
          initial={{ opacity: 0, scale: 2.2 }}
          animate={{ opacity: 1, scale: [2.2, 0.95, 1] }}
          transition={{ delay: 1.4, duration: 0.35 }}
        >
          Code triche activé !
        </m.p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-2">
          <Pop delay={1.75} className="hud-text text-[clamp(1rem,3vw,1.7rem)] text-hydromel">
            +30 vies
          </Pop>
          <Pop delay={1.9} className="hud-text text-[clamp(1rem,3vw,1.7rem)] text-neon-cyan">
            Chouffinitude infinie
          </Pop>
        </div>

        <p className="hud-text flex flex-wrap justify-center text-dew" style={{ fontSize: wordSize(display, { max: 9, cap: 6, min: 1.8, factor: 90 }) }}>
          {letters(display).map(({ char, index }) => (
            <m.span
              key={index}
              className="inline-block whitespace-pre"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 + index * 0.06, duration: 0.01 }}
            >
              {char}
            </m.span>
          ))}
          <m.span
            className="ml-[0.15em] inline-block h-[0.75em] w-[0.5em] self-center bg-dew"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
            transition={{ delay: 2 + display.length * 0.06, duration: 1.2, ease: (t: number) => Math.round(t * 5) / 5 }}
          >
            &nbsp;
          </m.span>
        </p>

        <Rise delay={2.3} className="hud-text text-[clamp(0.9rem,2.6vw,1.4rem)] text-white">
          Nouveau record :{" "}
          <Counter from={0} to={999999} delay={2.3} duration={0.9} format={(value) => String(Math.round(value)).padStart(6, "0")} />
        </Rise>
      </div>
      <Flash at={1.4} color="#b6ff2e" peak={0.22} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Butin légendaire                                                     */
/* ------------------------------------------------------------------ */

const LOOT_TITLES = ["Relique du Chouffin éternel", "Fléau des lundis", "Héritage de la taverne oubliée", "Lame bénie du Grand Tavernier"] as const;
const LOOT_FLAVORS = [
  "« Tombé d'un boss que personne n'avait jamais vu. »",
  "« Ne se répare qu'à la taverne. »",
  "« Taux de drop : 0,01 %. Respect. »",
] as const;
const LOOT_STATS = ["+50 Chouffinitude", "+12 Endurance de LAN", "+30 Résistance au brunch", "+7 Charisme de taverne", "+15 % de coups critiques au d20"] as const;

const WOOD = "#7a4521";
const WOOD_DARK = "#4d2a10";
const GOLD = "#ffc84a";
const GOLD_DARK = "#6b4a00";

function ChestLid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 46" aria-hidden="true" className={className}>
      <path d="M6 44 V24 C6 9 30 2 60 2 C90 2 114 9 114 24 V44 Z" fill={WOOD} stroke="#1f0e04" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M14 40 V26 C14 15 34 9 60 9 C86 9 106 15 106 26 V40" fill="none" stroke={WOOD_DARK} strokeWidth={2} opacity={0.7} />
      <path d="M18 44 V12 L28 8 V44 Z M92 44 V8 L102 12 V44 Z" fill={GOLD} stroke={GOLD_DARK} strokeWidth={2} strokeLinejoin="round" />
      <rect x="6" y="37" width="108" height="7" fill={GOLD} stroke={GOLD_DARK} strokeWidth={2} />
      <rect x="53" y="30" width="14" height="14" rx="2" fill="#ffe08a" stroke={GOLD_DARK} strokeWidth={2} />
    </svg>
  );
}

function ChestBase({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" aria-hidden="true" className={className}>
      <rect x="6" y="3" width="108" height="64" rx="4" fill={WOOD} stroke="#1f0e04" strokeWidth={3.5} />
      <path d="M6 24 H114 M6 45 H114" stroke={WOOD_DARK} strokeWidth={2} opacity={0.7} />
      <rect x="18" y="3" width="10" height="64" fill={GOLD} stroke={GOLD_DARK} strokeWidth={2} />
      <rect x="92" y="3" width="10" height="64" fill={GOLD} stroke={GOLD_DARK} strokeWidth={2} />
      <rect x="6" y="3" width="108" height="7" fill={GOLD} stroke={GOLD_DARK} strokeWidth={2} />
      <rect x="49" y="8" width="22" height="24" rx="3" fill="#ffe08a" stroke={GOLD_DARK} strokeWidth={2.5} />
      <circle cx="60" cy="18" r="3.4" fill="#2a1406" />
      <path d="M58.6 19 H61.4 L62.4 27 H57.6 Z" fill="#2a1406" />
    </svg>
  );
}

function LegendaryLoot({ word, score, seed, durationMs, onDone }: EggProps) {
  const OPEN = 1.1;
  const plan = usePlan(seed, (random) => ({
    title: LOOT_TITLES[Math.floor(random() * LOOT_TITLES.length)],
    flavor: LOOT_FLAVORS[Math.floor(random() * LOOT_FLAVORS.length)],
    motes: Array.from({ length: 12 }, (_, id) => ({ id, x: between(random, 15, 85), delay: OPEN + 0.1 + random() * 1.6, size: between(random, 5, 10) })),
  }));
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.loot} className="bg-[radial-gradient(ellipse_at_50%_72%,#3d1f0d_0%,#170b14_55%,#07040a_100%)]">
      <div className="absolute inset-x-0 bottom-0 h-[28vh] bg-[linear-gradient(180deg,rgb(7_4_10/0.9),transparent_40%),repeating-linear-gradient(90deg,#2b1d24_0_86px,#1d1219_86px_89px)]" />
      <Rays color="rgb(255 138 26 / 0.15)" delay={OPEN} spin={28} duration={2.6} />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[clamp(1.2rem,4vh,2.5rem)] px-4 pt-[12vh] md:flex-row md:gap-[6vw] md:pt-[6vh]">
        <div className="relative w-[clamp(140px,21vw,240px)] shrink-0">
          {/* Le faisceau orange des objets légendaires, qui monte du coffre. */}
          <m.div
            className="pointer-events-none absolute bottom-[40%] left-1/2 h-[82vh] w-[52%] bg-[linear-gradient(0deg,rgb(255_150_40/0.95),rgb(255_190_80/0.55)_35%,rgb(255_190_80/0)_100%)] [mask-image:linear-gradient(90deg,transparent,#000_28%,#000_72%,transparent)]"
            style={{ x: "-50%", originY: 1 }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0.8] }}
            transition={{ delay: OPEN, duration: 1.6, times: [0, 0.22, 1], ease: EASE_OUT }}
          />
          <m.div
            className="pointer-events-none absolute bottom-[40%] left-1/2 h-[82vh] w-[14%] bg-[linear-gradient(0deg,#fff6d8,rgb(255_246_216/0)_80%)] [mask-image:linear-gradient(90deg,transparent,#000_35%,#000_65%,transparent)]"
            style={{ x: "-50%", originY: 1 }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1], opacity: [0, 0.9] }}
            transition={{ delay: OPEN + 0.05, duration: 0.4, ease: EASE_OUT }}
          />
          {plan.motes.map((mote) => (
            <m.div
              key={mote.id}
              className="absolute bottom-[45%] rotate-45 bg-[#ffd98a]"
              style={{ left: `${mote.x}%`, width: mote.size, height: mote.size }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: ["0vh", "-46vh"], opacity: [0, 1, 0] }}
              transition={{ delay: mote.delay, duration: 1.3, ease: "easeOut" }}
            />
          ))}

          <m.div
            initial={{ y: "-75vh" }}
            animate={{ y: ["-75vh", "0vh", "-3vh", "0vh"] }}
            transition={{ duration: 0.5, times: [0, 0.78, 0.9, 1], ease: "easeIn" }}
          >
            <m.div
              className="relative"
              style={{ originY: 1 }}
              animate={{ rotate: [0, 0, -7, 7, -4, 0, -7, 7, -4, 0] }}
              transition={{ delay: 0.5, duration: 0.5, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.72, 0.86, 1] }}
            >
              <m.div
                className="absolute inset-x-[8%] top-[34%] h-[16%] rounded-[50%] bg-[radial-gradient(closest-side,#fff3c4,#ff9a2a_60%,transparent)]"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{ delay: OPEN, duration: 0.3 }}
              />
              <m.div
                style={{ originX: 0.12, originY: 1 }}
                initial={{ y: "0%", rotate: 0 }}
                animate={{ y: "-48%", rotate: -16 }}
                transition={{ delay: OPEN, type: "spring", stiffness: 260, damping: 13 }}
              >
                <ChestLid className="-mb-[1%] block w-full" />
              </m.div>
              <ChestBase className="relative block w-full drop-shadow-[0_10px_0_rgb(0_0_0/0.45)]" />
            </m.div>
          </m.div>
          <Burst
            seed={seed + 5}
            count={14}
            x={50}
            y={40}
            delay={OPEN}
            duration={1.2}
            distance={[16, 34]}
            angle={[205, 335]}
            gravity={34}
            size={[16, 26]}
            spin={0}
            render={() => <div className="aspect-square w-full rounded-full border-[3px] border-[#6b4a00] bg-[radial-gradient(circle_at_35%_30%,#fff3b0,#ffc84a_55%,#d08a00)]" />}
          />
        </div>

        <Pop delay={OPEN + 0.35} stiffness={380} damping={20} className="item-tooltip w-[min(23rem,90vw)] p-4 text-left shadow-[0_0_40px_rgb(255_138_26/0.35)]">
          <p className="break-words text-[clamp(1.25rem,2.6vw,1.7rem)] font-bold leading-tight text-rarity-legendary">{word}</p>
          <p className="text-sm font-semibold text-rarity-legendary">{plan.title}</p>
          <p className="mt-1.5 text-sm text-white">Lié quand ramassé</p>
          <p className="flex justify-between gap-4 text-sm text-white">
            <span>Deux mains</span>
            <span>Chope</span>
          </p>
          <p className="flex justify-between gap-4 text-sm text-white">
            <span>999 - 1 337 dégâts</span>
            <span>Vitesse 0,42</span>
          </p>
          <p className="text-sm text-white">(9 001 dégâts par seconde)</p>
          <div className="mt-1.5">
            {LOOT_STATS.map((stat, index) => (
              <Rise key={stat} delay={OPEN + 0.6 + index * 0.1} distance={6} className="text-sm font-semibold text-rarity-uncommon">
                {stat}
              </Rise>
            ))}
          </div>
          <p className="mt-1.5 text-sm text-white">Durabilité 100 / 100</p>
          <p className="text-sm text-white">Indice de chouffinitude : {score}</p>
          <Rise delay={OPEN + 1.2} distance={6} className="mt-2 text-sm italic text-hydromel">
            {plan.flavor}
          </Rise>
        </Pop>
      </div>

      <div className="absolute inset-x-0 top-[6vh] flex justify-center px-4">
        <Slam delay={2.55} from={2.6} className="text-[clamp(2rem,7.5vw,5.4rem)] text-rarity-legendary">
          Butin légendaire !
        </Slam>
      </div>
      <Flash at={OPEN} color="#ffb04a" peak={0.3} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Record du monde (speedrun)                                          */
/* ------------------------------------------------------------------ */

const TIMER_START = 0.2;
const TIMER_END = 2.1;
/** 13,37 s : le temps du record, en langage de hacker de 2010. */
const FINAL_TIME = 13.37;
const SPLIT_NAMES = ["Taper le mot", "Esquiver le brunch", "Skip du lundi", "Lecture en diagonale", "Tampon CHOUFFIN"] as const;
const SPLIT_DELTAS = ["-0,42", "-1,08", "-3,50", "-0,77", "-6,66"] as const;
/** Les meilleurs segments de l'histoire s'affichent en or. */
const GOLD_SPLITS: ReadonlySet<number> = new Set([2, 4]);

function runTime(at: number): number {
  return ((at - TIMER_START) / (TIMER_END - TIMER_START)) * FINAL_TIME;
}

function formatRun(seconds: number): string {
  const total = Math.round(Math.max(0, seconds) * 100);
  return `0:${String(Math.floor(total / 100)).padStart(2, "0")},${String(total % 100).padStart(2, "0")}`;
}

const CHAT_USERS = [
  { name: "xX_Chouffin_Xx", color: "#ff7ab8" },
  { name: "Perceval_78", color: "#7fd6ff" },
  { name: "BarbeDeNain", color: "#ffb35c" },
  { name: "HydroMel42", color: "#b6ff2e" },
  { name: "NoScopeMamie", color: "#c9a8ff" },
  { name: "LeGrasCestLaVie", color: "#ff9a8a" },
  { name: "Sanic_2011", color: "#7affd6" },
  { name: "TrollFace1337", color: "#fff06a" },
] as const;
const CHAT_EARLY = [
  "tentative 1337, on y croit",
  "PB pace ??",
  "il a pris le skip du lundi",
  "GOLD",
  "mods, vérifiez le chrono",
  "c'est légit ça ?",
  "ses mains tremblent",
  "GOLD GOLD GOLD",
  "dernier split...",
  "respire frère",
] as const;
const CHAT_HYPE = ["WR !!!", "GG", "POG", "clip it !!!", "WR WR WR", "GG WP", "HISTORIQUE", "POG POG POG", "il l'a fait", "GG", "je pleure", "WR"] as const;
const CHAT_LINE = 1.55;
const CHAT_VISIBLE = 9;

function LegendarySpeedrun({ word, seed, durationMs, onDone }: EggProps) {
  const total = durationMs / 1000;
  const chat = usePlan(seed, (random) => {
    const early = CHAT_EARLY.map((text, index) => ({ text, at: 0.3 + index * 0.19 }));
    const hype = CHAT_HYPE.map((text, index) => ({ text, at: 2.25 + index * 0.1 }));
    return [...early, ...hype].map((message, id) => ({ ...message, id, user: CHAT_USERS[Math.floor(random() * CHAT_USERS.length)] }));
  });
  // Défilement du chat : un cran par message une fois la fenêtre pleine (transform seulement).
  const scrollTimes = [0];
  const scrollValues = ["0rem"];
  chat.forEach((message, index) => {
    const offset = Math.max(0, index - CHAT_VISIBLE + 1);
    if (offset === 0) return;
    scrollTimes.push(message.at / total, (message.at + 0.08) / total);
    scrollValues.push(`${-(offset - 1) * CHAT_LINE}rem`, `${-offset * CHAT_LINE}rem`);
  });
  scrollTimes.push(1);
  scrollValues.push(scrollValues[scrollValues.length - 1]);
  const rowTimes = sounds.SPEEDRUN_SPLITS;
  // Le surlignage du segment en cours saute d'une ligne à chaque split.
  const highlight = (() => {
    const duration = TIMER_END - TIMER_START + 0.1;
    const times: number[] = [];
    const values: string[] = [];
    rowTimes.forEach((at, index) => {
      const from = index === 0 ? TIMER_START : rowTimes[index - 1] + 0.04;
      times.push((from - TIMER_START) / duration, (at - TIMER_START) / duration);
      values.push(`${index * 2.4}rem`, `${index * 2.4}rem`);
    });
    times.push(1);
    values.push(`${rowTimes.length * 2.4}rem`);
    return { duration, times, values };
  })();

  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.speedrun} className="bg-[linear-gradient(180deg,#0b1024,#04060d)]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-3 pt-10 md:flex-row md:items-center md:gap-6">
        {/* Les splits, façon logiciel de chrono de speedrunner. */}
        <section className="w-[min(30rem,94vw)] overflow-hidden rounded-md border border-white/15 bg-[#0d1122] shadow-[0_20px_60px_rgb(0_0_0/0.6)]">
          <div className="border-b border-white/10 px-4 py-2 text-center">
            <p className="font-bold text-white">Chouffin% · sans glitch</p>
            <p className="text-xs text-brume">Tentative n° 1337</p>
          </div>
          <div className="relative">
            <m.div
              className="absolute inset-x-0 top-0 h-[2.4rem] bg-[#2b5cff]/30"
              initial={{ y: "0rem" }}
              animate={{ y: highlight.values, opacity: [1, 1, 0] }}
              transition={{ y: { delay: TIMER_START, duration: highlight.duration, times: highlight.times, ease: "linear" }, opacity: { delay: TIMER_END, duration: 0.2 } }}
            />
            {SPLIT_NAMES.map((name, index) => {
              const at = rowTimes[index];
              const gold = GOLD_SPLITS.has(index);
              return (
                <div key={name} className="relative grid h-[2.4rem] grid-cols-[1fr_auto_4.6rem] items-center gap-3 px-4 text-[0.95rem]">
                  <span className="truncate text-white">{name}</span>
                  <m.span
                    className="font-bold tabular-nums"
                    style={{ color: gold ? "#ffd24a" : "#4dff7c" }}
                    initial={{ opacity: 0, scale: 1.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: at, duration: 0.2 }}
                  >
                    {SPLIT_DELTAS[index]}
                  </m.span>
                  <span className="relative text-right tabular-nums text-white">
                    <m.span className="absolute inset-0 text-brume" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: at, duration: 0.05 }}>
                      -
                    </m.span>
                    <m.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: at, duration: 0.05 }}>
                      {formatRun(runTime(at))}
                    </m.span>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="relative border-t border-white/10 px-4 py-2 text-right">
            <m.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: TIMER_END, duration: 0.05 }}>
              <Counter
                from={0}
                to={FINAL_TIME}
                delay={TIMER_START}
                duration={TIMER_END - TIMER_START}
                ease="linear"
                format={formatRun}
                className="font-display text-[clamp(2.6rem,7vw,4.4rem)] leading-none tabular-nums text-[#4dff7c]"
              />
            </m.div>
            <m.p
              className="absolute inset-0 px-4 py-2 text-right font-display text-[clamp(2.6rem,7vw,4.4rem)] leading-none tabular-nums text-[#ffd24a] [text-shadow:0_0_24px_rgb(255_210_74/0.6)]"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: [1.25, 1] }}
              transition={{ delay: TIMER_END, duration: 0.3 }}
            >
              {formatRun(FINAL_TIME)}
            </m.p>
          </div>
        </section>

        {/* Le chat du stream, qui s'emballe au record. */}
        <section className="w-[min(30rem,94vw)] overflow-hidden rounded-md border border-white/15 bg-[#17171c] md:w-[min(21rem,30vw)]">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-brume">
            <span>Chat du stream</span>
            <span className="flex items-center gap-1.5 text-[#ff8a8a]">
              <span className="size-2 rounded-full bg-[#ff4d4d]" />
              <Counter from={1337} to={42000} delay={2.2} duration={1.2} format={(value) => `${Math.round(value).toLocaleString("fr-FR")} en direct`} />
            </span>
          </div>
          <div className="relative overflow-hidden px-3" style={{ height: `${CHAT_VISIBLE * CHAT_LINE}rem` }}>
            <m.div initial={{ y: "0rem" }} animate={{ y: scrollValues }} transition={{ duration: total, times: scrollTimes, ease: "linear" }}>
              {chat.map((message) => (
                <m.p
                  key={message.id}
                  className="truncate text-sm leading-[1.55rem] text-white"
                  style={{ height: `${CHAT_LINE}rem` }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: message.at, duration: 0.12 }}
                >
                  <span className="font-bold" style={{ color: message.user.color }}>
                    {message.user.name}
                  </span>
                  : {message.text}
                </m.p>
              ))}
            </m.div>
          </div>
        </section>
      </div>

      <m.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(4_6_13/0.94)_0%,rgb(4_6_13/0.8)_45%,rgb(4_6_13/0.45)_80%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.18, duration: 0.2 }}
      />
      <Burst
        seed={seed + 7}
        count={24}
        x={50}
        y={42}
        delay={2.2}
        duration={1.2}
        distance={[22, 52]}
        gravity={22}
        size={[9, 16]}
        spin={0}
        render={(index) => <div className="aspect-square w-full" style={{ background: ["#ffd24a", "#4dff7c", "#ffffff", "#7fd6ff"][index % 4] }} />}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <Slam delay={2.2} from={3} rotate={-12} className="text-[clamp(5rem,24vw,13rem)]" style={{ color: "#ffd24a" }}>
          WR !
        </Slam>
        <Pop delay={2.45} className="hud-text mt-1 text-[clamp(1rem,3.2vw,1.9rem)] text-white">
          Nouveau record du monde
        </Pop>
        <Rise delay={2.65} className="meme-text mt-2 max-w-[92vw] break-words text-[clamp(1.2rem,4vw,2.4rem)]">
          « {shortWord(word, 28)} » en {formatRun(FINAL_TIME)}
        </Rise>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Boss final vaincu                                                    */
/* ------------------------------------------------------------------ */

/** Le boss de fin de toute vie normale : le Lundi, page de calendrier aux sourcils froncés. */
function MondayBoss({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 160" aria-hidden="true" className={className}>
      <rect x="10" y="22" width="120" height="132" rx="12" fill="#f4f1ea" stroke="#141414" strokeWidth={5} />
      <path d="M10 34 Q10 22 22 22 H118 Q130 22 130 34 V60 H10 Z" fill="#d7263d" stroke="#141414" strokeWidth={5} strokeLinejoin="round" />
      {[34, 58, 82, 106].map((x) => (
        <rect key={x} x={x - 4} y="9" width="8" height="24" rx="4" fill="#a3a9b3" stroke="#141414" strokeWidth={3} />
      ))}
      <text x="70" y="51" textAnchor="middle" fontFamily="Impact, 'Arial Narrow', sans-serif" fontSize="22" letterSpacing="2" fill="#fff">
        LUNDI
      </text>
      <path d="M32 78 L60 90 M108 78 L80 90" stroke="#141414" strokeWidth={7} strokeLinecap="round" />
      <circle cx="50" cy="100" r="9" fill="#141414" />
      <circle cx="90" cy="100" r="9" fill="#141414" />
      <circle cx="53" cy="97" r="3" fill="#ff3b3b" />
      <circle cx="93" cy="97" r="3" fill="#ff3b3b" />
      <path d="M38 128 Q70 110 102 128 L102 136 Q70 122 38 136 Z" fill="#141414" />
      <path d="M46 124 L50 131 L54 121 Z M62 118 L66 126 L70 117 Z M78 119 L82 127 L86 121 Z" fill="#fff" />
      <text x="70" y="150" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#6b6b6b">
        07:00
      </text>
    </svg>
  );
}

const DAMAGE = ["-1 337", "-2 048", "-4 096", "-9 001", "-6 666", "-8 192", "CRITIQUE ! -99 999"] as const;
const BOSS_DEATH = 1.58;

function LegendaryBoss({ word, seed, durationMs, onDone }: EggProps) {
  const hits = sounds.BOSS_HITS;
  const plan = usePlan(seed, (random) => ({
    damage: hits.map((at, index) => ({ at, index, x: between(random, 30, 70), y: between(random, 18, 50), text: DAMAGE[index] })),
    levelUps: Array.from({ length: 8 }, (_, index) => ({
      index,
      at: 2.35 + index * 0.1,
      x: (index % 2 ? 1 : -1) * between(random, 18, 40),
      y: between(random, -7, -1),
    })),
  }));
  const hpKeys = [1, ...hits.map((_, index) => Math.max(0, 1 - (index + 1) / hits.length))];
  const hpTimes = [0, ...hits.map((at) => (at - hits[0] + 0.02) / (hits[hits.length - 1] - hits[0] + 0.02))];

  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.boss} className="bg-[radial-gradient(ellipse_at_50%_40%,#3a0d1a_0%,#170611_55%,#060208_100%)]">
      <div className="absolute inset-x-0 bottom-0 h-[24vh] bg-[linear-gradient(180deg,transparent,#1a0a06_40%,#0b0503)]" />

      {/* Barre de vie du boss, qui fond coup après coup (avec la traînée jaune des dégâts). */}
      <div className="absolute inset-x-0 top-[9vh] flex flex-col items-center px-4">
        <p className="text-center text-[clamp(1rem,2.4vw,1.5rem)] tracking-[0.08em] text-[#f1e3c2]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Le Lundi, Seigneur de la Routine
        </p>
        <div className="relative mt-1.5 h-[clamp(0.8rem,2vh,1.1rem)] w-[min(44rem,90vw)] border-2 border-black bg-[#2a0b0f] shadow-[0_0_0_1px_#8a6d3b]">
          <m.div
            className="absolute inset-0 origin-left bg-[#ffcf5a]"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: hpKeys }}
            transition={{ delay: hits[0] + 0.18, duration: hits[hits.length - 1] - hits[0] + 0.02, times: hpTimes, ease: "easeOut" }}
          />
          <m.div
            className="absolute inset-0 origin-left bg-[linear-gradient(180deg,#ff5a5a,#b3121f)]"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: hpKeys }}
            transition={{ delay: hits[0], duration: hits[hits.length - 1] - hits[0] + 0.02, times: hpTimes, ease: "linear" }}
          />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pb-[6vh]">
        <Shake at={hits} intensity={6} className="relative">
          <m.div
            className="relative w-[clamp(150px,22vw,250px)]"
            animate={{ scale: [1, 1, 1.08, 0.2], opacity: [1, 1, 1, 0], rotate: [0, 0, -4, 14] }}
            transition={{ delay: BOSS_DEATH, duration: 0.45, times: [0, 0.05, 0.3, 1], ease: "easeIn" }}
          >
            <m.div animate={{ y: [0, -12, 0, -12, 0] }} transition={{ duration: 3.2, ease: "easeInOut" }}>
              <MondayBoss className="w-full drop-shadow-[0_18px_30px_rgb(0_0_0/0.6)]" />
            </m.div>
          </m.div>
        </Shake>
        <Burst
          seed={seed + 11}
          count={26}
          x={50}
          y={46}
          delay={BOSS_DEATH + 0.1}
          duration={1.1}
          distance={[18, 48]}
          gravity={20}
          size={[10, 20]}
          spin={180}
          render={(index) => <div className="aspect-square w-full" style={{ background: ["#f4f1ea", "#d7263d", "#141414", "#a3a9b3"][index % 4] }} />}
        />
      </div>

      {plan.damage.map((hit) => {
        const crit = hit.index === hits.length - 1;
        return (
          <m.p
            key={hit.index}
            className={`hud-text absolute whitespace-nowrap ${crit ? "text-[clamp(1.4rem,4.4vw,2.6rem)] text-[#ff9a1f]" : "text-[clamp(1rem,3vw,1.7rem)] text-[#ffe14a]"}`}
            style={{ left: `${hit.x}%`, top: `${hit.y + 12}%`, x: "-50%" }}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, -18, -36, -50], scale: [0.6, crit ? 1.25 : 1.05, 1, 1] }}
            transition={{ delay: hit.at, duration: crit ? 0.9 : 0.6, times: [0, 0.2, 0.7, 1] }}
          >
            {hit.text}
          </m.p>
        );
      })}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-[6vh] text-center">
        <Slam delay={BOSS_DEATH + 0.22} from={2.8} className="text-[clamp(3.4rem,15vw,10rem)]" style={{ color: "#ffcf3a" }}>
          Victoire !
        </Slam>
        <Rise delay={BOSS_DEATH + 0.5} className="meme-text mt-2 max-w-[92vw] break-words text-[clamp(1.1rem,3.4vw,2.1rem)]">
          Le Lundi a été vaincu par « {shortWord(word, 26)} »
        </Rise>
      </div>

      {/* Pluie d'XP puis level up en cascade jusqu'au niveau 99. */}
      <Burst
        seed={seed + 13}
        count={18}
        x={50}
        y={46}
        delay={BOSS_DEATH + 0.35}
        duration={1.3}
        distance={[14, 40]}
        angle={[60, 170]}
        gravity={18}
        size={[12, 20]}
        spin={0}
        render={() => <div className="aspect-square w-full rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4ffd6,#b6ff2e_50%,#3f7a00)] shadow-[0_0_12px_#b6ff2e]" />}
      />
      {/* Au-dessus du toast de succès (qui occupe le bas de l'écran). */}
      <div className="absolute bottom-[max(7.5rem,13vh)] left-1/2 flex w-[min(34rem,92vw)] -translate-x-1/2 flex-col items-center">
        {plan.levelUps.map((levelUp) => (
          <m.p
            key={levelUp.index}
            className="hud-text absolute whitespace-nowrap text-[clamp(0.9rem,2.4vw,1.3rem)] text-dew"
            style={{ left: `${50 + levelUp.x}%`, top: `${levelUp.y}vh`, x: "-50%" }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: [8, -10, -28] }}
            transition={{ delay: levelUp.at, duration: 0.6 }}
          >
            Level up !
          </m.p>
        ))}
        <Rise delay={2.2} distance={10} className="hud-text flex items-baseline gap-3 text-[clamp(1.3rem,4vw,2.3rem)] text-white">
          <span className="max-w-[40vw] truncate text-dew">{shortWord(word, 14)}</span>
          <Counter from={1} to={99} delay={2.3} duration={0.85} ease="easeIn" format={(value) => `Niv. ${Math.round(value)}`} />
        </Rise>
        <div className="mt-2 h-4 w-full border-[3px] border-black bg-black/70 shadow-[0_0_0_2px_#fff]">
          <m.div
            className="h-full origin-left bg-[repeating-linear-gradient(90deg,#b6ff2e_0_10px,#8fd600_10px_12px)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0, 1, 0, 1, 0, 1] }}
            transition={{ delay: 2.3, duration: 0.85, times: [0, 0.24, 0.25, 0.49, 0.5, 0.74, 0.75, 1], ease: "linear" }}
          />
        </div>
        <Pop delay={3.18} className="hud-text mt-2 text-[clamp(1rem,3vw,1.6rem)] text-hydromel">
          Niveau max !
        </Pop>
      </div>
      <Flash at={BOSS_DEATH} peak={0.3} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Évolution                                                            */
/* ------------------------------------------------------------------ */

const EVOLVE_START = 0.45;
const EVOLVE_AT = 2.3;

/**
 * Pulsation du mot qui s'apprête à évoluer : des demi-cycles de plus en plus
 * courts, jamais sous 0,17 s (moins de 3 pulsations par seconde). Échelle
 * seulement, aucune alternance de luminosité.
 */
function evolutionPulse() {
  const span = EVOLVE_AT - EVOLVE_START;
  const times = [0];
  const values = [1];
  let time = 0;
  let half = 0.36;
  let grow = true;
  while (time + half < span - 0.05) {
    time += half;
    times.push(time / span);
    values.push(grow ? 1.24 : 0.96);
    grow = !grow;
    half = Math.max(0.17, half * 0.86);
  }
  times.push(1);
  values.push(1.35);
  return { span, times, values };
}

const EVOLUTION_PULSE = evolutionPulse();

function SparkleStar({ color = "#fff6c4" }: { color?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="w-full">
      <path d="M10 0 L12.2 7.8 L20 10 L12.2 12.2 L10 20 L7.8 12.2 L0 10 L7.8 7.8 Z" fill={color} />
    </svg>
  );
}

function LegendaryEvolution({ word, score, seed, durationMs, onDone }: EggProps) {
  const display = shortWord(word, 22);
  const ultimate = `${shortWord(word, 18).toLocaleUpperCase("fr-FR")} ULTIME`;
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.evolution} className="starfield">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgb(120_80_255/0.45)_0%,rgb(40_20_90/0.55)_35%,rgb(5_6_15/0.9)_75%)]" />
      <Rays color="rgb(255 214 120 / 0.2)" delay={EVOLVE_AT} spin={35} duration={1.4} />

      {/* Anneaux d'énergie qui convergent vers le mot. */}
      {Array.from({ length: 6 }, (_, index) => (
        <m.div
          key={index}
          className="absolute left-1/2 top-[40%] size-[62vmin] rounded-full border-2 border-[#d9ccff]"
          style={{ x: "-50%", y: "-50%" }}
          initial={{ scale: 2.4, opacity: 0 }}
          animate={{ scale: [2.4, 0.1], opacity: [0, 0.8, 0] }}
          transition={{ delay: EVOLVE_START + 0.1 + index * 0.27, duration: 0.8, ease: "easeIn" }}
        />
      ))}

      <div className="absolute inset-x-0 top-[40%] grid -translate-y-1/2 place-items-center px-4">
        <m.div
          className="col-start-1 row-start-1 size-[46vmin] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.85),rgb(190_170_255/0.35)_55%,transparent)]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.1, 1.6] }}
          transition={{ delay: EVOLVE_START, duration: EVOLVE_AT - EVOLVE_START + 0.4, times: [0, 0.8, 1] }}
        />
        <m.div
          className="col-start-1 row-start-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: EVOLUTION_PULSE.values }}
          transition={{
            opacity: { duration: EVOLVE_AT + 0.02, times: [0, 0.08, 0.99, 1] },
            scale: { delay: EVOLVE_START, duration: EVOLUTION_PULSE.span, times: EVOLUTION_PULSE.times, ease: "easeInOut" },
          }}
        >
          <p className="meme-text max-w-[92vw] break-words text-center [text-shadow:0_0_24px_#fff,0_0_60px_#b9a8ff]" style={{ fontSize: wordSize(display, { max: 12, cap: 7, min: 2.2 }) }}>
            {display}
          </p>
        </m.div>
        <div className="col-start-1 row-start-1 flex flex-col items-center">
          <Slam delay={EVOLVE_AT} from={0.2} rotate={0} settle={0} duration={0.5} className="max-w-[94vw] break-words text-rarity-legendary" style={{ fontSize: wordSize(ultimate, { max: 11, cap: 6.5, min: 2 }) }}>
            {ultimate}
          </Slam>
          <Pop delay={EVOLVE_AT + 0.55} className="hud-text mt-3 text-center text-[clamp(0.9rem,2.6vw,1.4rem)] text-neon-cyan">
            Chouffinitude +{score} · Nouvelle attaque : Tournée générale
          </Pop>
        </div>
      </div>

      <Burst
        seed={seed + 17}
        count={20}
        x={50}
        y={40}
        delay={EVOLVE_AT}
        duration={1.2}
        distance={[20, 50]}
        size={[14, 30]}
        spin={120}
        render={(index) => <SparkleStar color={index % 3 === 0 ? "#ffd98a" : index % 3 === 1 ? "#ffffff" : "#c9b8ff"} />}
      />

      {/* Boîte de dialogue de RPG rétro. */}
      <div className="absolute inset-x-0 bottom-[max(7.5rem,12vh)] flex justify-center px-3">
        <m.div
          className="relative w-[min(42rem,94vw)] rounded-[6px] border-4 border-[#1b1b1b] bg-[#f8f8f0] p-1 shadow-[0_8px_0_rgb(0_0_0/0.45)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
        >
          <div className="pixel-text grid min-h-[4.8rem] rounded-[3px] border-2 border-[#5a6b8c] px-4 py-3 text-[clamp(0.85rem,2.2vw,1.1rem)] leading-relaxed text-[#1b1b1b]">
            <m.p className="col-start-1 row-start-1" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: EVOLVE_AT + 0.2, duration: 0.05 }}>
              <Typed text={`Quoi ? « ${display} » évolue !`} delay={0.2} />
            </m.p>
            <p className="col-start-1 row-start-1">
              <Typed text={`Félicitations ! « ${display} » a évolué en « ${ultimate} » !`} delay={EVOLVE_AT + 0.3} step={0.014} />
            </p>
          </div>
          <m.span
            className="absolute bottom-2 right-3 text-[0.8rem] text-[#1b1b1b]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.2, 1] }}
            transition={{ delay: 1.2, duration: 1.8 }}
          >
            ▼
          </m.span>
        </m.div>
      </div>
      <Flash at={EVOLVE_AT} peak={0.38} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Rage quit inversé                                                    */
/* ------------------------------------------------------------------ */

const OPPONENTS = ["Brunch_Addict", "PadelPro75", "Lundi_Matin", "KaleWarrior", "Trotti_Lover", "Afterwork_Fan", "Quinoa_Sensei"] as const;
const QUIT_NOTES = ["Alt + F4", "manette lancée", "déconnecté", "Alt + F4", "a débranché la box"] as const;
const GG_TYPED = 1.95;
const GG_SOFTENED = 2.45;

function LegendaryRagequit({ word, seed, durationMs, onDone }: EggProps) {
  const quits = sounds.RAGEQUIT_TIMES;
  const plan = usePlan(seed, (random) => ({
    rows: shuffle(OPPONENTS, random)
      .slice(0, quits.length)
      .map((name, index) => ({ name, at: quits[index], ping: Math.round(between(random, 18, 90)), spin: between(random, 360, 720) * (index % 2 ? -1 : 1) })),
  }));
  const player = shortWord(word, 18);
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.ragequit} className="bg-[radial-gradient(circle_at_center,rgb(14_10_22/0.93)_10%,rgb(14_10_22/0.98)_100%)]">
      <div className="scanlines opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center px-3 pt-8">
        <m.section
          className="w-[min(40rem,94vw)] overflow-hidden rounded-md border border-white/15 bg-[#0f1220]/95 shadow-[0_20px_60px_rgb(0_0_0/0.6)]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-sm">
            <span className="font-bold text-white">Partie classée · 1 contre 5</span>
            <span className="text-brume">Carte : La Taverne</span>
          </div>
          <p className="bg-dew/15 px-4 pt-2 text-xs font-bold uppercase tracking-wider text-dew">Équipe chouffin</p>
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 bg-dew/15 px-4 pb-2 pt-1 text-[0.95rem]">
            <span className="truncate font-bold text-white">{player}</span>
            <span className="tabular-nums text-dew">25 / 0 / 5</span>
          </div>
          <p className="px-4 pt-3 text-xs font-bold uppercase tracking-wider text-[#ff9aa4]">Équipe normie</p>
          <div className="px-2 pb-2">
            {plan.rows.map((row, index) => (
              <m.div
                key={row.name}
                className="relative grid h-[2.3rem] grid-cols-[1fr_auto_6.6rem] items-center gap-3 px-2 text-[0.95rem]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: row.at + 0.1, duration: 0.2 }}
              >
                <span className="relative truncate text-white">
                  {row.name}
                  <m.span
                    className="absolute inset-x-0 top-1/2 h-[2px] origin-left bg-[#ff5a6a]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: row.at, duration: 0.18 }}
                  />
                </span>
                <span className="tabular-nums text-brume">{row.ping} ms</span>
                <span className="relative text-right text-sm font-bold">
                  <m.span className="absolute inset-0 text-dew" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: row.at, duration: 0.05 }}>
                    En jeu
                  </m.span>
                  <m.span className="text-[#ff7a85]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: row.at, duration: 0.05 }}>
                    Rage quit
                  </m.span>
                </span>
                <m.div
                  className="pointer-events-none absolute right-8 top-0 w-9"
                  initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], x: ["0vw", "8vw", "22vw"], y: ["0vh", "-14vh", "-4vh"], rotate: row.spin }}
                  transition={{ delay: row.at, duration: 0.7, ease: "easeOut" }}
                >
                  <PixelPad className="w-full drop-shadow-[0_3px_0_rgb(0_0_0/0.6)]" />
                </m.div>
                <m.span
                  className="hud-text pointer-events-none absolute left-[38%] top-0 whitespace-nowrap text-[0.8rem] text-hydromel"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], y: [4, -12, -22] }}
                  transition={{ delay: row.at, duration: 0.6 }}
                >
                  {QUIT_NOTES[index % QUIT_NOTES.length]}
                </m.span>
              </m.div>
            ))}
          </div>
          {/* Le chat de la partie : « gg ez » est adouci d'office. */}
          <div className="border-t border-white/10 px-4 py-2.5 text-[0.95rem]">
            <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: GG_TYPED - 0.1, duration: 0.1 }} className="grid">
              <span className="col-start-1 row-start-1">
                <span className="text-brume">[Tous] </span>
                <span className="font-bold text-dew">{player}</span>
                <span className="text-white"> : </span>
                <m.span className="text-white" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: GG_SOFTENED, duration: 0.05 }}>
                  <Typed text="gg ez" delay={GG_TYPED} step={0.075} />
                </m.span>
              </span>
              <m.span className="col-start-1 row-start-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: GG_SOFTENED, duration: 0.05 }}>
                <span className="text-brume">[Tous] </span>
                <span className="font-bold text-dew">{player}</span>
                <span className="text-white"> : </span>
                <Scramble text="Bien joué à tous, vous étiez presque chouffins." delay={GG_SOFTENED} duration={0.4} glyphs="#@$%&*?!01" className="text-white" />
              </m.span>
            </m.p>
            <Rise delay={GG_SOFTENED + 0.3} distance={4} className="mt-1 text-xs italic text-brume">
              (message adouci par la taverne : ici, on gagne avec classe)
            </Rise>
          </div>
        </m.section>
      </div>

      <m.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(14_10_22/0.94),rgb(14_10_22/0.78)_55%,rgb(14_10_22/0.5))]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.72, duration: 0.2 }}
      />
      <div className="absolute inset-x-0 top-[26%] flex flex-col items-center px-4 text-center">
        <Slam delay={2.75} from={2.8} className="text-[clamp(2.6rem,10vw,7rem)] text-dew">
          Victoire par abandon
        </Slam>
        <Pop delay={3} className="hud-text mt-2 text-[clamp(1.2rem,4vw,2.4rem)] text-white">
          GG WP
        </Pop>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */

export default function GamerLegendaryEgg(props: EggProps) {
  switch (props.variant) {
    case "konami":
      return <LegendaryKonami {...props} />;
    case "loot":
      return <LegendaryLoot {...props} />;
    case "speedrun":
      return <LegendarySpeedrun {...props} />;
    case "boss":
      return <LegendaryBoss {...props} />;
    case "evolution":
      return <LegendaryEvolution {...props} />;
    case "ragequit":
      return <LegendaryRagequit {...props} />;
    case "illuminati":
    default:
      return <LegendaryIlluminati {...props} />;
  }
}
