"use client";

/**
 * Tribu métal : festival, pogo, pyrotechnie, solos.
 * - échec : la corde de mi aigu casse, larsen, les cornes se retournent ;
 * - petite réaction : deux mains qui font les cornes et headbanguent ;
 * - gros combo : colonnes de flammes et logo de groupe « illisible », pogo et mur de la mort ;
 * - légendaire : solo sur guitare en V avec éclairs, ampli qui monte jusqu'à 11.
 */

import { m } from "motion/react";
import type { CSSProperties } from "react";
import * as sounds from "@/lib/client/tribe-sounds/metal";
import { TankardLogo } from "../../art";
import { Burst, EASE_OUT, Flame, Flash, Pop, Rays, Rise, Shake, Stage, between, letters, shortWord, usePlan, wordSize, type Random } from "../kit";
import type { EggProps } from "../types";

const STAGE_BG: CSSProperties = {
  background: "radial-gradient(70% 55% at 50% 100%, rgb(160 30 20 / 0.45), transparent 70%), radial-gradient(circle at 50% 40%, #1a0c0c 0%, #070404 75%)",
};

/* ------------------------------------------------------------------ */
/* Dessins                                                             */
/* ------------------------------------------------------------------ */

/** Main qui fait les cornes, avec manchette cloutée. */
function Horns({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 150" aria-hidden="true" className={className} style={style}>
      <g stroke="#2a1608" strokeWidth={3} strokeLinejoin="round">
        <rect x="20" y="6" width="17" height="70" rx="8.5" fill="#f2c9a0" />
        <rect x="66" y="14" width="15" height="62" rx="7.5" fill="#f2c9a0" />
        <path d="M14 64 H88 V100 C88 114 78 122 64 122 H36 C22 122 12 112 12 98 Z" fill="#f2c9a0" />
        <rect x="37" y="54" width="15" height="24" rx="7.5" fill="#e8b98c" />
        <rect x="51" y="56" width="15" height="22" rx="7.5" fill="#e8b98c" />
        <path d="M8 84 C6 74 14 70 22 74 L52 86 C58 89 56 98 49 97 L18 94 C12 93 9 89 8 84 Z" fill="#f2c9a0" />
      </g>
      <rect x="16" y="120" width="70" height="30" rx="4" fill="#151515" stroke="#000" strokeWidth={3} />
      {[26, 41, 56, 71].map((cx) => (
        <circle key={cx} cx={cx} cy="135" r="4" fill="#d9d9d9" stroke="#555" strokeWidth={1} />
      ))}
    </svg>
  );
}

function thorns(random: Random, count: number, height: number): string {
  let path = `M0 ${height}`;
  const step = 100 / count;
  for (let i = 0; i < count; i++) {
    const x = i * step;
    const tip = height - between(random, height * 0.35, height);
    path += ` L${(x + step * 0.3).toFixed(1)} ${height} L${(x + step * 0.5).toFixed(1)} ${tip.toFixed(1)} L${(x + step * 0.7).toFixed(1)} ${height}`;
  }
  return `${path} L100 ${height} Z`;
}

/**
 * Logo de groupe de métal : lettres chromées étirées, épines au-dessus, lame et
 * gouttes en dessous. Lisible quand même (on n'est pas des monstres).
 */
function MetalLogo({ word, seed, size, className = "" }: { word: string; seed: number; size: string; className?: string }) {
  const display = shortWord(word, 22).toUpperCase();
  const ornaments = usePlan(seed, (random) => ({ top: thorns(random, 18, 12), drips: Array.from({ length: 7 }, () => between(random, 8, 92)) }));
  return (
    <div className={`relative inline-flex max-w-[94vw] flex-col items-center ${className}`} style={{ fontSize: size }}>
      <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true" className="h-[0.28em] w-[92%]">
        <path d={ornaments.top} fill="#cfcfcf" stroke="#000" strokeWidth={0.6} />
      </svg>
      <p className="flex flex-wrap justify-center">
        {letters(display).map(({ char, index }) => (
          <span
            key={index}
            className="metal-logo inline-block whitespace-pre"
            style={{
              transform: `scaleY(${index === 0 || index === display.length - 1 ? 1.28 : index % 3 === 1 ? 1.1 : 1}) skewX(${index % 2 ? -7 : 7}deg)`,
              fontSize: index === 0 || index === display.length - 1 ? "1.12em" : "1em",
            }}
          >
            {char}
          </span>
        ))}
      </p>
      <svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true" className="-mt-[0.06em] h-[0.34em] w-[112%]">
        <path d="M0 4 L50 1.5 L100 4 L50 7.5 Z" fill="#cfcfcf" stroke="#000" strokeWidth={0.6} />
        {ornaments.drips.map((x) => (
          <path key={x} d={`M${x - 1.4} 5 L${x} ${11 + (x % 5)} L${x + 1.4} 5 Z`} fill="#b01020" stroke="#000" strokeWidth={0.4} />
        ))}
      </svg>
    </div>
  );
}

function FlyingV({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 230 124" aria-hidden="true" className={className}>
      <path d="M112 52 L22 4 L6 18 L62 62 L6 106 L22 120 L112 72 Z" fill="#d01c2c" stroke="#1a0000" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M100 56 L40 26 M100 68 L40 98" stroke="#ff8a8a" strokeWidth={2} opacity={0.6} />
      <rect x="70" y="52" width="12" height="20" rx="2" fill="#222" stroke="#000" strokeWidth={1.5} />
      <rect x="88" y="54" width="10" height="16" rx="2" fill="#222" stroke="#000" strokeWidth={1.5} />
      <rect x="108" y="56" width="98" height="12" rx="2" fill="#6b3b1a" stroke="#1a0000" strokeWidth={2.5} />
      {[120, 134, 148, 162, 176, 190].map((x) => (
        <path key={x} d={`M${x} 56 V68`} stroke="#d9c7a0" strokeWidth={1.2} />
      ))}
      <path d="M204 52 L226 46 L228 78 L204 72 Z" fill="#111" stroke="#000" strokeWidth={2.5} strokeLinejoin="round" />
      {[57, 61, 65, 69].map((y) => (
        <path key={y} d={`M64 ${y - 2} L220 ${y - 2}`} stroke="#e8e8e8" strokeWidth={0.8} opacity={0.8} />
      ))}
    </svg>
  );
}

function Bolt({ delay, className, flip = false }: { delay: number; className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 200" aria-hidden="true" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <m.path
        d="M34 0 L14 84 L36 84 L10 200 L52 70 L28 70 L46 0"
        fill="none"
        stroke="#fff7c2"
        strokeWidth={5}
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 8px #ffd23a) drop-shadow(0 0 18px #ff8a1a)" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ delay, duration: 0.9, times: [0, 0.25, 1] }}
      />
    </svg>
  );
}

/** Rangée de flammes au pied de la scène (éruptions en décalé). */
function FlameRow({ bursts, className = "bottom-0 h-[46vh]" }: { bursts: ReadonlyArray<{ at: number; columns: readonly number[] }>; className?: string }) {
  const positions = [8, 29, 50, 71, 92];
  return (
    <div className={`pointer-events-none absolute inset-x-0 ${className}`}>
      {bursts.flatMap((burst, burstIndex) =>
        burst.columns.map((column) => (
          <m.div
            key={`${burstIndex}-${column}`}
            className="absolute bottom-0 h-full w-[clamp(60px,12vw,150px)] origin-bottom"
            style={{ left: `${positions[column]}%`, x: "-50%" }}
            initial={{ scaleY: 0, scaleX: 0.7, opacity: 0 }}
            animate={{ scaleY: [0, 1.08, 0.9, 1, 0.94, 0], scaleX: [0.7, 1, 0.9, 1.05, 0.95, 0.6], opacity: [0, 1, 1, 1, 1, 0] }}
            transition={{ delay: burst.at, duration: 0.85, times: [0, 0.18, 0.4, 0.6, 0.8, 1], ease: "easeOut" }}
          >
            <Flame className="h-full w-full drop-shadow-[0_0_24px_rgb(255_110_20/0.7)]" />
          </m.div>
        )),
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Échec                                                               */
/* ------------------------------------------------------------------ */

function FailLarsen({ word, durationMs, onDone }: EggProps) {
  const strings = [0, 1, 2, 3, 4, 5];
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.larsen} style={STAGE_BG}>
      <div className="absolute inset-x-0 top-[28%] h-[26vh]">
        {strings.map((index) => {
          const top = `${index * 20}%`;
          const thickness = 1.5 + index * 0.7;
          const snapped = index === 0;
          const shimmer = { y: [0, -2, 2, -1.5, 1.5, 0, -1, 1, 0] };
          if (!snapped) {
            return (
              <m.div
                key={index}
                className="absolute inset-x-0 bg-[linear-gradient(180deg,#fafafa,#8a8a8a)]"
                style={{ top, height: thickness }}
                animate={shimmer}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.7 }}
              />
            );
          }
          return (
            <div key={index} className="absolute inset-x-0" style={{ top, height: thickness }}>
              <m.div
                className="absolute left-0 top-0 h-full w-1/2 origin-left bg-[linear-gradient(180deg,#fafafa,#8a8a8a)]"
                animate={{ y: [0, -2, 2, 0, 0, 0], rotate: [0, 0, 0, 0, 16, 11], scaleX: [1, 1, 1, 1, 0.8, 0.82] }}
                transition={{ delay: 0.1, duration: 1.4, times: [0, 0.2, 0.4, 0.57, 0.75, 1] }}
              />
              <m.div
                className="absolute right-0 top-0 h-full w-1/2 origin-right bg-[linear-gradient(180deg,#fafafa,#8a8a8a)]"
                animate={{ y: [0, 2, -2, 0, 0, 0], rotate: [0, 0, 0, 0, -22, -15], scaleX: [1, 1, 1, 1, 0.7, 0.72] }}
                transition={{ delay: 0.1, duration: 1.4, times: [0, 0.2, 0.4, 0.57, 0.75, 1] }}
              />
            </div>
          );
        })}
      </div>
      <m.div
        className="absolute left-1/2 top-[34%] w-6"
        style={{ x: "-50%" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.6, 2] }}
        transition={{ delay: 0.9, duration: 0.35 }}
      >
        <div className="aspect-square w-full rounded-full bg-[#fff6c2] shadow-[0_0_20px_8px_#ffd23a]" />
      </m.div>
      <div className="absolute inset-x-0 top-[58%] flex flex-col items-center px-4 text-center">
        <m.p
          className="font-display text-[clamp(3rem,13vw,8rem)] uppercase leading-none text-[#ff5a4a] [-webkit-text-stroke:0.04em_#000] [paint-order:stroke_fill] [text-shadow:0_0_24px_rgb(255_80_60/0.5)]"
          initial={{ opacity: 0, scale: 1.6 }}
          animate={{ opacity: 1, scale: 1, x: [0, -4, 4, -3, 3, -4, 4, -2, 2, 0] }}
          transition={{ opacity: { delay: 1.05, duration: 0.1 }, scale: { delay: 1.05, duration: 0.25 }, x: { delay: 1.1, duration: 1.1, ease: "linear" } }}
        >
          Larsen
        </m.p>
        <Rise delay={1.5} className="mt-3 max-w-xl text-[clamp(1.05rem,2.6vw,1.45rem)] font-semibold text-parchemin">
          « {shortWord(word, 30)} » ? Même l&apos;ampli a démissionné.
        </Rise>
      </div>
      <m.div
        className="absolute bottom-[4vh] right-[8vw] w-[clamp(56px,9vw,100px)]"
        initial={{ y: "30vh", rotate: 0 }}
        animate={{ y: ["30vh", "0vh", "0vh"], rotate: [0, 0, 180] }}
        transition={{ delay: 0.2, duration: 1.9, times: [0, 0.3, 1], ease: "easeInOut" }}
      >
        <Horns className="w-full" />
      </m.div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Petite réaction                                                     */
/* ------------------------------------------------------------------ */

function SmallCornes({ durationMs, onDone }: EggProps) {
  const bang = { rotate: [-4, -16, 6, -16, 6, -8] };
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.cornes} mode="light">
      <m.div
        className="absolute inset-x-0 top-[30%] flex items-end justify-center gap-[clamp(1rem,6vw,5rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.55, times: [0, 0.08, 0.85, 1] }}
      >
        <m.div className="w-[clamp(70px,11vw,120px)] origin-bottom" initial={{ y: 80 }} animate={{ y: 0, ...bang }} transition={{ y: { type: "spring", stiffness: 380, damping: 16 }, rotate: { delay: 0.2, duration: 1.1 } }}>
          <Horns className="w-full drop-shadow-[0_6px_0_rgb(0_0_0/0.4)]" style={{ transform: "scaleX(-1)" }} />
        </m.div>
        <Pop delay={0.25} className="mb-[4vh] font-display text-[clamp(1.8rem,6vw,3.4rem)] uppercase text-white [-webkit-text-stroke:0.06em_#000] [paint-order:stroke_fill] [text-shadow:0_0_18px_rgb(255_80_40/0.7)]">
          \m/ Métal \m/
        </Pop>
        <m.div className="w-[clamp(70px,11vw,120px)] origin-bottom" initial={{ y: 80 }} animate={{ y: 0, rotate: bang.rotate.map((value) => -value) }} transition={{ y: { type: "spring", stiffness: 380, damping: 16 }, rotate: { delay: 0.2, duration: 1.1 } }}>
          <Horns className="w-full drop-shadow-[0_6px_0_rgb(0_0_0/0.4)]" />
        </m.div>
      </m.div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Gros combos                                                         */
/* ------------------------------------------------------------------ */

function ComboPyro({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.pyro} style={STAGE_BG}>
      <FlameRow
        bursts={[
          { at: 0.12, columns: [0, 4] },
          { at: 0.62, columns: [1, 3] },
          { at: 1.12, columns: [2] },
          { at: 1.6, columns: [0, 1, 2, 3, 4] },
        ]}
      />
      <Shake at={[0.12, 0.62, 1.12, 1.6]} intensity={6}>
        <div className="absolute inset-x-0 top-[16%] flex flex-col items-center px-3 text-center">
          <Rise delay={0.2} className="font-display text-[clamp(1rem,2.6vw,1.5rem)] uppercase tracking-[0.3em] text-[#ffb36b]">
            Ce soir, en tête d&apos;affiche
          </Rise>
          <m.div className="mt-3" initial={{ opacity: 0, scale: 1.8 }} animate={{ opacity: 1, scale: [1.8, 0.95, 1] }} transition={{ delay: 0.62, duration: 0.4 }}>
            <MetalLogo word={word} seed={seed} size={wordSize(word, { max: 13, cap: 8.5, min: 2.4 })} />
          </m.div>
          <Rise delay={1.2} className="mt-4 font-display text-[clamp(1.1rem,3vw,1.8rem)] uppercase tracking-[0.1em] text-parchemin">
            Tournée mondiale de la chouffinitude
          </Rise>
          <Pop delay={1.65} className="mt-3 font-display text-[clamp(1.6rem,5vw,3rem)] text-hydromel [-webkit-text-stroke:0.05em_#000] [paint-order:stroke_fill]">
            \m/ \m/
          </Pop>
        </div>
      </Shake>
      <Burst seed={seed + 1} count={16} x={50} y={80} delay={1.6} duration={1.1} distance={[20, 45]} angle={[200, 340]} gravity={20} size={[5, 10]} render={() => <div className="aspect-square w-full rounded-full bg-[#ffd23a] shadow-[0_0_8px_#ff8a1a]" />} />
    </Stage>
  );
}

function Headbanger({ index, raised }: { index: number; raised: boolean }) {
  return (
    <svg viewBox="0 0 40 90" aria-hidden="true" className="w-full">
      <g fill="#0b0b0f" stroke="rgb(255 90 60 / 0.55)" strokeWidth={1.2}>
        <path d="M2 90 C2 60 38 60 38 90 Z" />
        <circle cx="20" cy="50" r="9" />
        <path d={index % 2 ? "M11 46 C8 60 6 70 4 78 L10 70 Z" : "M29 46 C32 60 34 70 36 78 L30 70 Z"} />
        {raised ? <path d="M30 66 L36 24 L33 14 L35 12 L38 22 L41 13 L43 15 L40 26 L36 66 Z" /> : null}
      </g>
    </svg>
  );
}

function ComboPogo({ word, seed, durationMs, onDone }: EggProps) {
  const crowd = usePlan(seed, (random) =>
    Array.from({ length: 16 }, (_, index) => ({
      index,
      left: (index / 15) * 100 + between(random, -2, 2),
      size: between(random, 9, 13),
      phase: random() * 0.3,
      raised: random() < 0.6,
    })),
  );
  const jumps = [0, -28, 0, -34, 0, -24, 0, -30, 0];
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.pogo} style={STAGE_BG}>
      {[
        { color: "rgb(255 60 60 / 0.22)", left: "18%", from: -25, to: 20 },
        { color: "rgb(160 90 255 / 0.2)", left: "50%", from: 15, to: -15 },
        { color: "rgb(255 170 60 / 0.2)", left: "82%", from: 25, to: -20 },
      ].map((beam) => (
        <m.div
          key={beam.left}
          className="absolute top-[-10%] h-[90vh] w-[22vw] origin-top"
          style={{ left: beam.left, x: "-50%", background: `linear-gradient(180deg, ${beam.color}, transparent 85%)`, clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)" }}
          initial={{ rotate: beam.from }}
          animate={{ rotate: [beam.from, beam.to, beam.from] }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      ))}
      <Shake at={[1.85]} intensity={14}>
        <div className="absolute inset-x-0 top-[12%] flex flex-col items-center px-3 text-center">
          <div className="grid">
            <m.p
              className="col-start-1 row-start-1 font-display text-[clamp(3rem,13vw,8rem)] uppercase leading-none text-white [-webkit-text-stroke:0.05em_#000] [paint-order:stroke_fill] [text-shadow:0_0_24px_rgb(255_80_40/0.6)]"
              initial={{ opacity: 0, scale: 2.4 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [2.4, 1, 1, 0.9] }}
              transition={{ delay: 0.1, duration: 1.2, times: [0, 0.15, 0.85, 1] }}
            >
              Pogo !
            </m.p>
            <m.p
              className="col-start-1 row-start-1 font-display text-[clamp(2.2rem,9vw,6rem)] uppercase leading-none text-[#ff5a4a] [-webkit-text-stroke:0.05em_#000] [paint-order:stroke_fill]"
              initial={{ opacity: 0, scale: 2.4 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [2.4, 1, 1, 1.1] }}
              transition={{ delay: 1.3, duration: 0.7, times: [0, 0.15, 0.85, 1] }}
            >
              Mur de la mort !
            </m.p>
          </div>
          <m.div className="mt-2" initial={{ opacity: 0, scale: 1.8 }} animate={{ opacity: 1, scale: [1.8, 0.95, 1] }} transition={{ delay: 1.95, duration: 0.35 }}>
            <MetalLogo word={word} seed={seed} size={wordSize(word, { max: 11, cap: 7, min: 2.2 })} />
          </m.div>
          <Rise delay={2.2} className="mt-2 font-display text-[clamp(1rem,2.6vw,1.5rem)] uppercase tracking-[0.2em] text-[#ffb36b]">
            Dans la fosse
          </Rise>
        </div>

        <m.div
          className="absolute bottom-[21vh] left-0 w-[clamp(56px,8vw,90px)]"
          initial={{ x: "-12vw", rotate: -90 }}
          animate={{ x: ["-12vw", "110vw"], y: [0, -12, 0, -12, 0, -12, 0], rotate: [-90, -80, -100, -85, -95, -90] }}
          transition={{ duration: 2.6, ease: "linear" }}
        >
          <TankardLogo className="w-full" />
        </m.div>

        <div className="absolute inset-x-0 bottom-0 h-[26vh]">
          {crowd.map((person) => {
            const leftHalf = person.left < 50;
            return (
              <m.div
                key={person.index}
                className="absolute bottom-[-2vh]"
                style={{ left: `${person.left}%`, width: `${person.size}vw`, minWidth: 44, x: "-50%" }}
                animate={{
                  y: jumps,
                  x: ["-50%", "-50%", leftHalf ? "-140%" : "40%", leftHalf ? "-140%" : "40%", "-50%", "-50%"],
                }}
                transition={{
                  y: { delay: person.phase, duration: 1.3, ease: "easeInOut" },
                  x: { duration: 2, times: [0, 0.62, 0.78, 0.9, 0.95, 1], ease: "easeInOut" },
                }}
              >
                <Headbanger index={person.index} raised={person.raised} />
              </m.div>
            );
          })}
        </div>
      </Shake>
      <Burst seed={seed + 2} count={14} x={50} y={84} delay={1.88} duration={0.8} distance={[10, 26]} angle={[190, 350]} gravity={10} size={[10, 20]} render={() => <div className="aspect-square w-full rounded-full bg-[rgb(200_180_150/0.5)]" />} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Légendaires                                                         */
/* ------------------------------------------------------------------ */

function Note({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 30" aria-hidden="true" className="w-full">
      <path d="M8 24 V4 L22 1 V20" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx="5" cy="24" rx="5" ry="4" fill={color} />
      <ellipse cx="19" cy="20" rx="5" ry="4" fill={color} />
    </svg>
  );
}

function LegendarySolo({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.solo} style={STAGE_BG}>
      <Rays color="rgb(255 90 30 / 0.16)" delay={0.8} spin={40} duration={2.6} />
      <Bolt delay={1.0} className="absolute left-[4vw] top-[6vh] h-[62vh]" />
      <Bolt delay={1.3} flip className="absolute right-[4vw] top-[8vh] h-[58vh]" />
      <FlameRow bursts={[{ at: 1.6, columns: [0, 4] }, { at: 2.0, columns: [1, 3] }, { at: 2.4, columns: [0, 2, 4] }]} className="bottom-0 h-[34vh]" />
      <Shake at={[1.2, 1.6, 2.4]} intensity={8}>
        <m.div
          className="absolute left-1/2 top-[8%] w-[clamp(220px,38vw,440px)]"
          style={{ x: "-50%" }}
          initial={{ x: "-120vw", rotate: -220 }}
          animate={{ x: "-50%", rotate: [-220, -14, -8, -14, -8, -12] }}
          transition={{ x: { duration: 0.75, ease: EASE_OUT }, rotate: { duration: 2.4, times: [0, 0.3, 0.45, 0.6, 0.8, 1] } }}
        >
          <FlyingV className="w-full drop-shadow-[0_0_26px_rgb(255_60_40/0.6)]" />
        </m.div>
        <Burst
          seed={seed}
          count={12}
          x={52}
          y={20}
          delay={0.85}
          duration={1.4}
          distance={[18, 42]}
          angle={[180, 360]}
          gravity={-6}
          size={[18, 30]}
          spin={60}
          render={(index) => <Note color={["#ffd23a", "#ff8a1a", "#fff6cf"][index % 3]} />}
        />
        <div className="absolute inset-x-0 top-[42%] flex flex-col items-center px-3 text-center">
          <Rise delay={0.9} className="font-display text-[clamp(1.2rem,3.4vw,2.2rem)] uppercase tracking-[0.3em] text-[#ffb36b]">
            Solo de
          </Rise>
          <m.div
            className="mt-2"
            initial={{ opacity: 0, scale: 2.2 }}
            animate={{ opacity: 1, scale: [2.2, 0.95, 1], y: [0, 0, 0, 14, 0, 14, 0, 14, 0] }}
            transition={{ opacity: { delay: 1.2, duration: 0.1 }, scale: { delay: 1.2, duration: 0.35 }, y: { delay: 1.2, duration: 2, ease: "easeInOut" } }}
          >
            <MetalLogo word={word} seed={seed} size={wordSize(word, { max: 14, cap: 9, min: 2.4 })} />
          </m.div>
          <Pop delay={1.9} className="mt-4 font-display text-[clamp(1.5rem,4.6vw,2.8rem)] uppercase text-rarity-legendary [-webkit-text-stroke:0.05em_#000] [paint-order:stroke_fill] [text-shadow:0_0_20px_rgb(255_138_26/0.6)]">
            \m/ Légendaire \m/
          </Pop>
        </div>
      </Shake>
      <Flash at={1.0} color="#fff3d0" peak={0.28} />
    </Stage>
  );
}

function AmpStack({ className, pumpAt }: { className?: string; pumpAt: number }) {
  const cone = (cx: number, cy: number) => (
    <m.g key={`${cx}-${cy}`} style={{ originX: `${cx}px`, originY: `${cy}px` }} animate={{ scale: [1, 1, 1.12, 0.96, 1.1, 0.98, 1.06, 1] }} transition={{ delay: pumpAt, duration: 1.2 }}>
      <circle cx={cx} cy={cy} r="17" fill="#1b1b1b" stroke="#000" strokeWidth={2} />
      <circle cx={cx} cy={cy} r="7" fill="#333" />
    </m.g>
  );
  return (
    <svg viewBox="0 0 120 200" aria-hidden="true" className={className}>
      <rect x="4" y="4" width="112" height="34" rx="4" fill="#161616" stroke="#000" strokeWidth={3} />
      <rect x="10" y="10" width="100" height="10" rx="2" fill="#c9a24a" />
      {[20, 38, 56, 74, 92].map((cx) => (
        <circle key={cx} cx={cx} cy="29" r="4" fill="#e8e8e8" stroke="#000" strokeWidth={1} />
      ))}
      {[42, 120].map((y) => (
        <g key={y}>
          <rect x="4" y={y} width="112" height="76" rx="4" fill="#1f1f1f" stroke="#000" strokeWidth={3} />
          <rect x="10" y={y + 6} width="100" height="64" rx="2" fill="#2b2b2b" />
          {cone(35, y + 22)}
          {cone(85, y + 22)}
          {cone(35, y + 52)}
          {cone(85, y + 52)}
        </g>
      ))}
    </svg>
  );
}

function VolumeDial({ className }: { className?: string }) {
  // 1 à 11 sur 300 degrés : 11 est « un cran plus fort que le maximum ».
  const marks = Array.from({ length: 11 }, (_, i) => i + 1);
  const angleOf = (value: number) => -150 + ((value - 1) / 10) * 300;
  return (
    <div className={`relative aspect-square ${className ?? ""}`}>
      <svg viewBox="-60 -60 120 120" aria-hidden="true" className="absolute inset-0 w-full">
        <circle r="56" fill="#141414" stroke="#c9a24a" strokeWidth={3} />
        {marks.map((value) => {
          const angle = (angleOf(value) * Math.PI) / 180;
          const x = Math.sin(angle) * 44;
          const y = -Math.cos(angle) * 44;
          return (
            <text key={value} x={x} y={y + 4} textAnchor="middle" fontSize={value === 11 ? 14 : 10} fontWeight={800} fontFamily="system-ui, sans-serif" fill={value === 11 ? "#ff5a4a" : "#e8e8e8"}>
              {value}
            </text>
          );
        })}
        <circle r="30" fill="url(#dial-knob)" stroke="#000" strokeWidth={2} />
        <defs>
          <radialGradient id="dial-knob" cx="0.35" cy="0.3">
            <stop offset="0" stopColor="#6a6a6a" />
            <stop offset="1" stopColor="#101010" />
          </radialGradient>
        </defs>
      </svg>
      <m.div
        className="absolute inset-0"
        initial={{ rotate: angleOf(1) }}
        animate={{ rotate: [angleOf(1), angleOf(10), angleOf(10), angleOf(11)] }}
        transition={{ delay: 0.3, duration: 1.15, times: [0, 0.7, 0.85, 1], ease: "easeInOut" }}
      >
        <div className="absolute left-1/2 top-[25%] h-[25%] w-[6%] -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_#fff]" />
      </m.div>
    </div>
  );
}

function LegendaryOnze({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.onze} style={STAGE_BG}>
      {[0, 0.18, 0.36].map((lag) => (
        <m.div
          key={lag}
          className="pointer-events-none absolute left-1/2 top-[30%] aspect-square w-[16vmin] rounded-full border-4 border-[rgb(255_200_150/0.6)]"
          style={{ x: "-50%", y: "-50%" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0.3, 10], opacity: [0.8, 0] }}
          transition={{ delay: 1.5 + lag, duration: 1, ease: "easeOut" }}
        />
      ))}
      <Shake at={[1.5, 1.9]} intensity={16}>
        <div className="absolute inset-x-0 top-[6%] flex items-center justify-center gap-[clamp(1rem,6vw,5rem)] px-4">
          <m.div className="w-[clamp(90px,15vw,170px)]" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
            <AmpStack className="w-full drop-shadow-[0_0_24px_rgb(255_80_40/0.35)]" pumpAt={1.5} />
          </m.div>
          <div className="flex flex-col items-center">
            <p className="font-display text-[clamp(0.9rem,2vw,1.2rem)] uppercase tracking-[0.3em] text-[#ffb36b]">Volume</p>
            <VolumeDial className="mt-2 w-[clamp(120px,18vw,210px)]" />
          </div>
        </div>
        <div className="absolute inset-x-0 top-[50%] flex flex-col items-center px-3 text-center">
          <Pop delay={1.45} className="font-display text-[clamp(1.2rem,3.6vw,2.2rem)] uppercase tracking-[0.1em] text-parchemin">
            Ce mot monte jusqu&apos;à <span className="text-[#ff5a4a]">11</span>
          </Pop>
          <m.div className="mt-3" initial={{ opacity: 0, scale: 2.4 }} animate={{ opacity: 1, scale: [2.4, 0.95, 1] }} transition={{ delay: 1.55, duration: 0.35 }}>
            <MetalLogo word={word} seed={seed} size={wordSize(word, { max: 14, cap: 9, min: 2.4 })} />
          </m.div>
          <Pop delay={2.1} className="mt-3 font-display text-[clamp(1.3rem,4vw,2.4rem)] uppercase text-rarity-legendary [-webkit-text-stroke:0.05em_#000] [paint-order:stroke_fill]">
            Légendaire
          </Pop>
        </div>
      </Shake>
      <Burst seed={seed} count={20} x={50} y={30} delay={1.5} duration={1.2} distance={[25, 60]} gravity={16} size={[6, 14]} render={() => <div className="aspect-square w-full rounded-full bg-[rgb(220_200_170/0.7)]" />} />
      <Flash at={1.5} color="#fff0dc" peak={0.3} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */

export default function MetalEgg(props: EggProps) {
  switch (props.variant) {
    case "larsen":
      return <FailLarsen {...props} />;
    case "cornes":
      return <SmallCornes {...props} />;
    case "pyro":
      return <ComboPyro {...props} />;
    case "pogo":
      return <ComboPogo {...props} />;
    case "solo":
      return <LegendarySolo {...props} />;
    case "onze":
      return <LegendaryOnze {...props} />;
    default:
      return props.level === "fail" ? <FailLarsen {...props} /> : props.level === "small" ? <SmallCornes {...props} /> : <ComboPyro {...props} />;
  }
}
