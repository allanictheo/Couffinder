"use client";

/**
 * Tribu gamer : montage MLG, arcade, FPS et jeux de baston.
 * - échec : « Vous êtes mort » (bandeau noir, lettres rouges à empattements) ou « Game over » d'arcade ;
 * - petite réaction : hitmarkers, « +XP » et barre d'expérience qui passe un niveau ;
 * - gros combo : série d'éliminations, combo de baston contre un toast à l'avocat, Nyan-chope.
 *
 * Les apothéoses légendaires ont leur propre module (`gamer-legendary.tsx`) :
 * ce module-ci reste léger pour les verdicts courants.
 */

import { m } from "motion/react";
import * as sounds from "@/lib/client/tribe-sounds/gamer";
import { Chip, Hitmarker, PixelArt, TankardLogo } from "../../art";
import { AvocadoToast } from "../avocado";
import { Burst, Counter, EASE_OUT, Flash, ImpactStar, Pop, Rise, Shake, Slam, Stage, between, letters, shortWord, usePlan, wordSize } from "../kit";
import type { EggProps } from "../types";
import { HitmarkerAt, Projectile, SERIF, VIGNETTE, hitPlan, shuffle } from "./gamer-shared";

/* ------------------------------------------------------------------ */
/* Échecs                                                              */
/* ------------------------------------------------------------------ */

function FailSouls({ word, score, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.souls} className="bg-black/85">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <m.div
          className="flex w-full flex-col items-center justify-center bg-[linear-gradient(180deg,transparent,rgb(0_0_0/0.92)_24%,rgb(0_0_0/0.92)_76%,transparent)] px-4 py-[clamp(2.5rem,8vh,5rem)] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <m.p
            className="uppercase leading-none tracking-[0.14em] text-[#e2434f] [text-shadow:0_0_28px_rgb(226_67_79/0.35)]"
            style={{ ...SERIF, fontSize: "clamp(2.1rem, 8.5vw, 6.5rem)" }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: [0, 1, 1], scale: [0.94, 1, 1.07] }}
            transition={{ delay: 0.35, duration: 2.4, times: [0, 0.35, 1], ease: "easeOut" }}
          >
            Vous êtes mort
          </m.p>
          <Rise delay={1.2} className="mt-5 italic text-[#d6cec2]" style={{ ...SERIF, fontSize: "clamp(1rem, 2.4vw, 1.45rem)" }}>
            « {shortWord(word, 40)} » n&apos;était pas chouffin.
          </Rise>
        </m.div>
      </div>
      <Rise delay={1.6} className="absolute bottom-[8vh] right-[5vw] text-[#d6cec2]" style={{ ...SERIF, fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}>
        Chouffinitude perdue : <span className="tabular-nums text-white">{100 - score}</span>
      </Rise>
    </Stage>
  );
}

function FailArcade({ word, score, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.arcade} className="bg-black/92">
      <div className="scanlines" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[clamp(1rem,4vh,2rem)] px-4 text-center">
        <p className="hud-text flex text-[clamp(2.3rem,11vw,7.5rem)] leading-none text-[#ff5663]">
          {letters("GAME OVER").map(({ char, index }) => (
            <m.span
              key={index}
              className="inline-block whitespace-pre"
              initial={{ y: "-60vh", opacity: 0 }}
              animate={{ y: ["-60vh", "0vh", "-3vh", "0vh"], opacity: [0, 1, 1, 1] }}
              transition={{ delay: 0.07 * index, duration: 0.55, times: [0, 0.62, 0.8, 1], ease: "easeIn" }}
            >
              {char}
            </m.span>
          ))}
        </p>
        <Rise delay={1} className="hud-text text-[clamp(1.1rem,3.6vw,2rem)] text-hydromel">
          Continuer ? <Counter from={9} to={0} delay={1.05} duration={1.36} ease="linear" format={(value) => String(Math.ceil(value))} />
        </Rise>
        <m.p
          className="hud-text text-[clamp(0.95rem,2.6vw,1.3rem)] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.2, 1, 0.2, 1] }}
          transition={{ delay: 1.2, duration: 1.5 }}
        >
          Insère une pièce
        </m.p>
        <Rise delay={1.5} className="max-w-md text-sm font-semibold text-brume">
          « {shortWord(word, 32)} » : pas chouffin. Score final : {score}.
        </Rise>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Petite réaction                                                     */
/* ------------------------------------------------------------------ */

function SmallXp({ score, seed, durationMs, onDone }: EggProps) {
  const hits = usePlan(seed, (random) =>
    [0, 0.12, 0.24].map((delay, id) => ({ id, delay, x: 50 + between(random, -26, 26), y: 44 + between(random, -14, 10), size: between(random, 40, 58) })),
  );
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.xp} mode="light">
      {hits.map((hit) => (
        <HitmarkerAt key={hit.id} {...hit} />
      ))}
      <m.p
        className="hud-text absolute left-1/2 top-[42%] whitespace-nowrap text-[clamp(1.6rem,5vw,2.8rem)] text-dew"
        style={{ x: "-50%" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 1, 1, 0], y: [20, 0, -26, -56] }}
        transition={{ delay: 0.2, duration: 1.35, times: [0, 0.15, 0.75, 1] }}
      >
        +{score} XP
      </m.p>
      <m.div
        className="absolute left-1/2 top-[56%] w-[min(18rem,72vw)]"
        style={{ x: "-50%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.55, times: [0, 0.1, 0.85, 1] }}
      >
        <Pop delay={0.85} className="hud-text mb-2 text-center text-[clamp(1.1rem,3.4vw,1.6rem)] text-hydromel">
          Level up !
        </Pop>
        <div className="h-5 border-[3px] border-black bg-black/70 shadow-[0_0_0_2px_#fff]">
          <m.div
            className="h-full origin-left bg-[repeating-linear-gradient(90deg,#b6ff2e_0_10px,#8fd600_10px_12px)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.6, ease: "easeIn" }}
          />
        </div>
      </m.div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Gros combos                                                         */
/* ------------------------------------------------------------------ */

const VICTIMS = ["le brunch", "le padel", "les Crocs", "le quinoa", "le spritz", "Candy Crush", "le lundi", "la trottinette", "le kale"];
const STREAK = [
  { at: 0.15, text: "First blood" },
  { at: 0.45, text: "Double kill" },
  { at: 0.8, text: "Triple kill" },
  { at: 1.15, text: "Ultra kill" },
  { at: 1.5, text: "Pentakill !" },
] as const;

function KillIcon({ index }: { index: number }) {
  if (index % 3 === 0) return <Hitmarker className="size-5" />;
  if (index % 3 === 1) return <Chip className="size-5" />;
  return <TankardLogo className="size-5" />;
}

function ComboKillstreak({ word, seed, durationMs, onDone }: EggProps) {
  const plan = usePlan(seed, (random) => ({
    victims: shuffle(VICTIMS, random).slice(0, STREAK.length),
    hits: hitPlan(
      random,
      STREAK.flatMap((step) => [step.at, step.at + 0.07]),
    ),
  }));
  const killer = shortWord(word, 16);
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.killstreak} className={VIGNETTE}>
      <div className="scanlines opacity-40" />
      <Shake at={[0.45, 0.8, 1.15, 1.5]} intensity={7}>
        <div className="absolute right-[3vw] top-[8vh] flex w-[min(24rem,88vw)] flex-col items-end gap-1.5">
          {STREAK.map((step, index) => (
            <m.div
              key={step.text}
              className="flex max-w-full items-center gap-2 rounded-sm bg-black/75 px-2.5 py-1 text-[clamp(0.78rem,1.6vw,0.95rem)] font-bold ring-1 ring-white/15"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: step.at, duration: 0.2, ease: EASE_OUT }}
            >
              <span className="truncate text-dew">{killer}</span>
              <KillIcon index={index} />
              <span className="whitespace-nowrap text-[#ff9aa4]">{plan.victims[index]}</span>
            </m.div>
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="grid place-items-center">
            {STREAK.map((step, index) => {
              const last = index === STREAK.length - 1;
              return (
                <m.p
                  key={step.text}
                  className="meme-text col-start-1 row-start-1 whitespace-nowrap text-center text-[clamp(2.6rem,11vw,8rem)]"
                  style={last ? { color: "var(--color-dew)" } : undefined}
                  initial={{ opacity: 0, scale: 2.6, rotate: -8 }}
                  animate={
                    last
                      ? { opacity: [0, 1, 1], scale: [2.6, 0.95, 1], rotate: [-8, -2, -4] }
                      : { opacity: [0, 1, 1, 0], scale: [2.6, 1, 1, 0.8], rotate: -6 }
                  }
                  transition={last ? { delay: step.at, duration: 0.4 } : { delay: step.at, duration: STREAK[index + 1].at - step.at, times: [0, 0.3, 0.8, 1] }}
                >
                  {step.text}
                </m.p>
              );
            })}
          </div>
          <Rise delay={1.75} className="meme-text mt-3 max-w-[92vw] break-words text-center" style={{ fontSize: wordSize(word, { max: 9, cap: 5, min: 1.8 }) }}>
            {word}
          </Rise>
          <Rise delay={1.95} className="hud-text mt-3 text-center text-[clamp(0.85rem,2.4vw,1.3rem)] text-hydromel">
            5 éliminations · 0 mort · 100 % chouffin
          </Rise>
        </div>
      </Shake>
      <Burst
        seed={seed + 1}
        count={10}
        delay={1.5}
        distance={[30, 62]}
        gravity={26}
        size={[44, 76]}
        spin={540}
        render={(index) => <Projectile index={index} />}
      />
      {plan.hits.map((hit) => (
        <HitmarkerAt key={hit.id} {...hit} />
      ))}
      <Flash at={1.5} color="#f4ffd6" peak={0.28} />
    </Stage>
  );
}

function HealthBar({ name, side, drain }: { name: string; side: "left" | "right"; drain?: { delay: number; duration: number; hits: number } }) {
  const keyframes = drain ? Array.from({ length: drain.hits + 1 }, (_, i) => 1 - i / drain.hits) : undefined;
  return (
    <div className="min-w-0 flex-1">
      <p className={`hud-text truncate text-[clamp(0.72rem,1.8vw,1.05rem)] ${side === "right" ? "text-right" : ""}`}>{name}</p>
      <div className="mt-1 h-[clamp(0.9rem,2.4vh,1.4rem)] skew-x-[-12deg] border-2 border-black bg-[#5a0d12] shadow-[0_0_0_2px_#ffd34a]">
        <m.div
          className={`h-full bg-[linear-gradient(180deg,#fff27a,#ffcf3a_45%,#e89a00)] ${side === "right" ? "origin-right" : "origin-left"}`}
          initial={{ scaleX: 1 }}
          animate={keyframes ? { scaleX: keyframes } : { scaleX: 1 }}
          transition={drain ? { delay: drain.delay, duration: drain.duration, ease: "linear" } : undefined}
        />
      </div>
    </div>
  );
}

const ONOMATOPOEIA = ["PAF", "BIM", "BAM", "POW", "PIF", "BOUM"];

function ComboBaston({ word, seed, durationMs, onDone }: EggProps) {
  const HITS = 12;
  const START = 0.9;
  const STEP = 0.085;
  const plan = usePlan(seed, (random) =>
    Array.from({ length: HITS }, (_, index) => ({
      index,
      delay: START + index * STEP,
      x: between(random, 58, 84),
      y: between(random, 34, 64),
      size: between(random, 64, 118),
      rotate: between(random, -30, 30),
      text: ONOMATOPOEIA[Math.floor(random() * ONOMATOPOEIA.length)],
    })),
  );
  const lunge = Array.from({ length: HITS * 2 + 1 }, (_, k) => (k % 2 ? 22 : 0));
  const recoil = Array.from({ length: HITS * 2 + 1 }, (_, k) => (k % 2 ? 18 : 0));
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.baston} className="bg-[linear-gradient(180deg,#1b0f2e_0%,#3a1530_58%,#12081c_100%)]">
      <div className="absolute inset-x-0 bottom-0 h-[28vh] bg-[linear-gradient(180deg,transparent,#2a1a10_35%,#120a06)]" />
      <Shake at={[1.95]} intensity={14}>
        <div className="absolute inset-x-[4vw] top-[8vh] flex items-end gap-3">
          <HealthBar name={shortWord(word, 14)} side="left" />
          <p className="hud-text shrink-0 text-[clamp(1.4rem,4vw,2.6rem)] text-hydromel">99</p>
          <HealthBar name="Toast avocat" side="right" drain={{ delay: START, duration: HITS * STEP, hits: HITS }} />
        </div>

        <m.div
          className="hud-text absolute left-[4vw] top-[22vh] text-[clamp(1.2rem,3.6vw,2.2rem)] text-hydromel"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: [0, 1, 1, 0], x: [-30, 0, 0, 0] }}
          transition={{ delay: START, duration: 1.3, times: [0, 0.08, 0.85, 1] }}
        >
          <Counter from={1} to={HITS} delay={START} duration={HITS * STEP} ease="linear" format={(value) => `${Math.round(value)} HITS`} />
          <span className="block text-[0.6em] text-white">Combo !</span>
        </m.div>

        <m.div
          className="absolute left-[6vw] top-[40%] max-w-[46vw]"
          animate={{ x: lunge }}
          transition={{ delay: START, duration: HITS * STEP, ease: "linear" }}
        >
          <p className="meme-text break-words text-dew" style={{ fontSize: wordSize(word, { max: 10, cap: 6, factor: 70 }) }}>
            {word}
          </p>
        </m.div>

        <m.div
          className="absolute right-[7vw] top-[36%] w-[clamp(120px,22vw,250px)]"
          animate={{ x: ["0vw", "0vw", "60vw"], y: ["0vh", "0vh", "-40vh"], rotate: [0, 0, 540], opacity: [1, 1, 0] }}
          transition={{ delay: 1.95, duration: 0.7, times: [0, 0.05, 1], ease: "easeOut" }}
        >
          <m.div animate={{ x: recoil }} transition={{ delay: START, duration: HITS * STEP, ease: "linear" }}>
            <AvocadoToast className="w-full drop-shadow-[0_8px_0_rgb(0_0_0/0.4)]" />
          </m.div>
        </m.div>

        {plan.map((hit) => (
          <m.div
            key={hit.index}
            className="absolute"
            style={{ left: `${hit.x}%`, top: `${hit.y}%`, width: hit.size, x: "-50%", y: "-50%", rotate: hit.rotate }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.1, 1, 0.9] }}
            transition={{ delay: hit.delay, duration: 0.26, times: [0, 0.2, 0.7, 1] }}
          >
            <ImpactStar className="w-full">
              <text x="50" y="58" textAnchor="middle" fontFamily="Impact, 'Arial Narrow', sans-serif" fontSize="22" fill="#111">
                {hit.text}
              </text>
            </ImpactStar>
          </m.div>
        ))}

        <div className="absolute inset-0 grid place-items-center">
          <m.p
            className="meme-text col-start-1 row-start-1 text-[clamp(2.6rem,11vw,7rem)]"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [2, 1, 1, 1.1] }}
            transition={{ delay: 0.05, duration: 0.45, times: [0, 0.25, 0.8, 1] }}
          >
            Round 1
          </m.p>
          <m.p
            className="meme-text col-start-1 row-start-1 text-[clamp(3rem,13vw,8rem)] text-hydromel"
            initial={{ opacity: 0, scale: 2.4 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [2.4, 1, 1, 1.2] }}
            transition={{ delay: 0.5, duration: 0.38, times: [0, 0.25, 0.8, 1] }}
          >
            Fight !
          </m.p>
        </div>
      </Shake>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Slam delay={1.95} from={3.2} className="text-[clamp(5rem,26vw,16rem)]" style={{ color: "#ffcf3a" }}>
          K.O.
        </Slam>
        <Pop delay={2.3} className="hud-text mt-1 text-[clamp(1.2rem,4vw,2.4rem)] text-white">
          Perfect
        </Pop>
      </div>
      <Flash at={1.95} peak={0.32} />
    </Stage>
  );
}

const RAINBOW = ["#ff3b3b", "#ff9a1f", "#ffe93b", "#4cff3b", "#3bb8ff", "#9b6bff"];
/** Teintes éclaircies pour le texte (contraste sur le bleu nuit). */
const RAINBOW_TEXT = ["#ff7a7a", "#ffb35c", "#fff06a", "#8dff7a", "#7fd6ff", "#c9a8ff"];
const RAINBOW_BG = `linear-gradient(180deg, ${RAINBOW.map((color, i) => `${color} ${(i * 100) / 6}% ${((i + 1) * 100) / 6}%`).join(", ")})`;

const STAR_ROWS = ["..w..", "..w..", "wwyww", "..w..", "..w.."] as const;

function ComboNyan({ word, seed, durationMs, onDone }: EggProps) {
  const stars = usePlan(seed, (random) =>
    Array.from({ length: 22 }, (_, index) => ({
      index,
      x: between(random, 0, 110),
      y: between(random, 2, 96),
      size: between(random, 10, 22),
      speed: between(random, 0.6, 1.6),
      phase: random() * 0.6,
    })),
  );
  const display = shortWord(word, 18).toUpperCase();
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.nyan} className="bg-[radial-gradient(circle_at_50%_40%,#123080,#081647_75%)]">
      {stars.map((star) => (
        <m.div
          key={star.index}
          className="absolute"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size }}
          initial={{ x: 0, opacity: 0, scale: 0.6 }}
          animate={{ x: `${-38 * star.speed}vw`, opacity: [0, 1, 1], scale: [0.6, 1.15, 0.6, 1.15, 0.6] }}
          transition={{ duration: 2.8, ease: "linear", opacity: { duration: 0.3, delay: star.phase }, scale: { duration: 2.8, delay: star.phase, ease: "linear" } }}
        >
          <PixelArt rows={STAR_ROWS} palette={{ w: "#ffffff", y: "#fff27a" }} className="w-full" />
        </m.div>
      ))}

      <m.div className="absolute left-0 top-[30%]" initial={{ x: "-30vw" }} animate={{ x: "112vw" }} transition={{ duration: 2.7, ease: "linear" }}>
        <m.div
          animate={{ y: [0, -10, 0, -10, 0, -10, 0, -10, 0] }}
          transition={{ duration: 2.7, ease: (t: number) => Math.round(t * 16) / 16 }}
          className="relative"
        >
          <div className="absolute right-[72%] top-[22%] flex h-[58%]" aria-hidden="true">
            {Array.from({ length: 34 }, (_, k) => (
              <div key={k} className="h-full w-[3.4vw] min-w-5" style={{ background: RAINBOW_BG, transform: `translateY(${k % 2 ? 7 : 0}px)` }} />
            ))}
          </div>
          <TankardLogo className="relative w-[clamp(84px,12vw,150px)] drop-shadow-[0_0_14px_rgb(255_255_255/0.35)]" />
        </m.div>
      </m.div>

      <div className="absolute inset-x-0 top-[58%] flex flex-col items-center px-4 text-center">
        <p className="hud-text flex flex-wrap justify-center" style={{ fontSize: wordSize(display, { max: 9, cap: 5.5, min: 1.8, factor: 90 }) }}>
          {letters(display).map(({ char, index }) => (
            <m.span
              key={index}
              className="inline-block whitespace-pre"
              style={{ color: RAINBOW_TEXT[index % RAINBOW_TEXT.length] }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: [0, 1, 1, 1, 1, 1], y: [30, 0, -8, 0, -8, 0] }}
              transition={{ delay: 0.8 + index * 0.05, duration: 1.6, times: [0, 0.2, 0.45, 0.6, 0.8, 1] }}
            >
              {char}
            </m.span>
          ))}
        </p>
        <Rise delay={1.3} className="doge-text mt-4 text-[clamp(1.1rem,3vw,1.7rem)] text-[#ff9dcb]">
          nyan nyan nyan, very {shortWord(word.toLocaleLowerCase("fr-FR"), 16)}
        </Rise>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */

export default function GamerEgg(props: EggProps) {
  switch (props.variant) {
    case "arcade":
      return <FailArcade {...props} />;
    case "souls":
      return <FailSouls {...props} />;
    case "xp":
      return <SmallXp {...props} />;
    case "baston":
      return <ComboBaston {...props} />;
    case "nyan":
      return <ComboNyan {...props} />;
    case "killstreak":
      return <ComboKillstreak {...props} />;
    default:
      return props.level === "fail" ? <FailSouls {...props} /> : props.level === "small" ? <SmallXp {...props} /> : <ComboKillstreak {...props} />;
  }
}
