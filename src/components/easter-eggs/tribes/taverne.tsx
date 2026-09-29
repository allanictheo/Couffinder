"use client";

/**
 * Tribu taverne : bière, hydromel, banquet, le gras.
 * - échec : panneau « Fermé » qui se balance, chope vide et dernière goutte ;
 * - petite réaction : deux chopes qui trinquent, « Santé ! » ;
 * - gros combo : tournée générale sur le comptoir, jambon à la broche (« le gras, c'est la vie »), mousse qui déborde ;
 * - légendaire : banquet des dieux (skål !), tournée du patron (cloche, pluie de pièces et de chopes).
 */

import { m } from "motion/react";
import { useId, type CSSProperties } from "react";
import * as sounds from "@/lib/client/tribe-sounds/taverne";
import { Burst, EASE_OUT, Flame, Pop, Rain, Rays, Rise, Shake, Slam, Stage, between, shortWord, usePlan, wordSize } from "../kit";
import type { EggProps } from "../types";

const TAVERN_BG: CSSProperties = {
  background: "radial-gradient(60% 45% at 50% 0%, rgb(255 180 80 / 0.35), transparent 70%), radial-gradient(circle at 50% 45%, #2a170b 0%, #0f0805 78%)",
};

/* ------------------------------------------------------------------ */
/* Dessins                                                             */
/* ------------------------------------------------------------------ */

/**
 * Chope en verre avec anse. Sans `fillAt`, elle est pleine ; avec, la bière
 * monte à cet instant. `foamAt` fait gonfler la mousse, `empty` la laisse vide.
 */
function Tankard({
  className,
  style,
  fillAt,
  fillDuration = 0.6,
  foamAt,
  empty = false,
}: {
  className?: string;
  style?: CSSProperties;
  fillAt?: number;
  fillDuration?: number;
  foamAt?: number;
  empty?: boolean;
}) {
  const id = useId();
  const clip = `${id}-glass`;
  const beer = `${id}-beer`;
  return (
    <svg viewBox="0 0 112 132" aria-hidden="true" className={className} style={style}>
      <defs>
        <clipPath id={clip}>
          <rect x="12" y="30" width="60" height="94" rx="6" />
        </clipPath>
        <linearGradient id={beer} x1="0" x2="1">
          <stop offset="0" stopColor="#e08a00" />
          <stop offset="0.45" stopColor="#ffc23a" />
          <stop offset="1" stopColor="#d27a00" />
        </linearGradient>
      </defs>
      <path d="M74 42 C102 40 106 52 106 72 C106 94 98 104 74 102" fill="none" stroke="#3a2410" strokeWidth={11} strokeLinecap="round" />
      <path d="M74 42 C102 40 106 52 106 72 C106 94 98 104 74 102" fill="none" stroke="#f3e6c8" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
      <rect x="8" y="26" width="68" height="102" rx="9" fill="rgb(255 255 255 / 0.14)" stroke="#3a2410" strokeWidth={4.5} />
      {empty ? null : (
        <g clipPath={`url(#${clip})`}>
          <m.rect
            x="12"
            y="30"
            width="60"
            height="94"
            fill={`url(#${beer})`}
            style={{ originX: 0.5, originY: 1 }}
            initial={{ scaleY: fillAt === undefined ? 1 : 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: fillAt ?? 0, duration: fillAt === undefined ? 0 : fillDuration, ease: "easeOut" }}
          />
          {[22, 36, 52, 62].map((cx, index) => (
            <circle key={cx} cx={cx} cy={60 + ((index * 17) % 50)} r={1.8 + (index % 2)} fill="#fff4cf" opacity={0.7} />
          ))}
        </g>
      )}
      <path d="M22 36 V116 M40 36 V116 M58 36 V116" stroke="#fff" strokeWidth={3} opacity={0.18} />
      {empty ? null : (
        <m.path
          d="M4 36 C0 22 14 12 24 18 C28 4 48 4 52 16 C60 4 80 8 78 22 C90 24 88 40 76 38 L8 40 Z"
          fill="#fff8e6"
          stroke="#3a2410"
          strokeWidth={3.5}
          strokeLinejoin="round"
          style={{ originX: 0.5, originY: 1 }}
          initial={{ scale: foamAt === undefined ? 1 : 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: foamAt ?? 0, type: "spring", stiffness: 380, damping: 12 }}
        />
      )}
    </svg>
  );
}

function Ham({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 172 112" aria-hidden="true" className={className}>
      <path d="M52 34 C70 8 122 4 152 22 C172 36 172 78 150 94 C122 114 70 106 52 82 C45 70 45 46 52 34 Z" fill="#b8472f" stroke="#3a1408" strokeWidth={4} />
      <path d="M72 26 C98 12 132 14 150 32" fill="none" stroke="#f0a070" strokeWidth={7} strokeLinecap="round" opacity={0.75} />
      <path d="M82 40 L98 84 M104 34 L120 88 M126 34 L140 82" stroke="#6e2412" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
      <rect x="10" y="49" width="48" height="14" rx="6" fill="#f6ecd6" stroke="#3a1408" strokeWidth={3} />
      <circle cx="12" cy="47" r="9" fill="#f6ecd6" stroke="#3a1408" strokeWidth={3} />
      <circle cx="12" cy="65" r="9" fill="#f6ecd6" stroke="#3a1408" strokeWidth={3} />
    </svg>
  );
}

function Coin() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="w-full">
      <circle cx="20" cy="20" r="18" fill="#ffcf3a" stroke="#8a5a00" strokeWidth={3} />
      <circle cx="20" cy="20" r="12" fill="none" stroke="#b37a00" strokeWidth={2} />
      <path d="M13 24 L15 14 L20 19 L25 14 L27 24 Z" fill="#b37a00" />
    </svg>
  );
}

function SpinningCoin() {
  return (
    <m.div animate={{ scaleX: [1, 0.15, 1, 0.15, 1] }} transition={{ duration: 1.2, ease: "linear" }}>
      <Coin />
    </m.div>
  );
}

function BarBell({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" aria-hidden="true" className={className}>
      <path d="M50 4 V18" stroke="#3a2410" strokeWidth={6} strokeLinecap="round" />
      <circle cx="50" cy="20" r="6" fill="#c9922a" stroke="#3a2410" strokeWidth={3} />
      <path d="M20 84 C20 46 28 26 50 24 C72 26 80 46 80 84 L90 94 H10 Z" fill="#e0a83a" stroke="#3a2410" strokeWidth={4} strokeLinejoin="round" />
      <path d="M34 40 C30 54 30 70 32 84" stroke="#ffe6a0" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      <circle cx="50" cy="100" r="7" fill="#8a5a1a" stroke="#3a2410" strokeWidth={3} />
    </svg>
  );
}

/** Traits de « ding » autour d'un objet qui sonne. */
function DingLines({ delay }: { delay: number }) {
  return (
    <m.svg
      viewBox="0 0 120 60"
      aria-hidden="true"
      className="absolute left-1/2 top-[30%] w-[160%]"
      style={{ x: "-50%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
      transition={{ delay, duration: 0.9 }}
    >
      <path d="M8 10 L22 18 M4 30 H20 M8 50 L22 42 M112 10 L98 18 M116 30 H100 M112 50 L98 42" stroke="#ffe6a0" strokeWidth={4} strokeLinecap="round" />
    </m.svg>
  );
}

/* ------------------------------------------------------------------ */
/* Échec                                                               */
/* ------------------------------------------------------------------ */

function FailDerniere({ word, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.derniere} style={TAVERN_BG}>
      <div className="absolute inset-x-0 bottom-0 h-[22vh] wood" />
      <m.div
        className="absolute left-1/2 top-0 w-[clamp(230px,36vw,400px)]"
        style={{ x: "-50%", originY: 0 }}
        initial={{ y: "-60vh" }}
        animate={{ y: ["-60vh", "0vh"], rotate: [0, 14, -10, 7, -4, 2, 0] }}
        transition={{ y: { duration: 0.45, ease: EASE_OUT }, rotate: { delay: 0.35, duration: 2, ease: "easeInOut" } }}
      >
        <div className="mx-[16%] flex h-[12vh] justify-between">
          <div className="w-1.5 bg-[repeating-linear-gradient(180deg,#9a9a9a_0_6px,#4a4a4a_6px_9px)]" />
          <div className="w-1.5 bg-[repeating-linear-gradient(180deg,#9a9a9a_0_6px,#4a4a4a_6px_9px)]" />
        </div>
        <div className="wood rounded-lg border-[5px] border-[#2a1508] px-4 py-4 text-center shadow-[0_14px_30px_rgb(0_0_0/0.6)]">
          <p className="font-display text-[clamp(2.6rem,8vw,4.6rem)] uppercase leading-none text-[#f3e2b8] [text-shadow:0_3px_0_#2a1508]">Fermé</p>
          <p className="mt-1 text-[clamp(0.85rem,1.8vw,1rem)] font-bold uppercase tracking-[0.18em] text-[#f3e2b8]/90">Dernière tournée servie</p>
        </div>
      </m.div>

      <div className="absolute bottom-[22vh] left-1/2 w-[clamp(70px,10vw,120px)]" style={{ transform: "translateX(-50%)" }}>
        <m.div initial={{ rotate: 0 }} animate={{ rotate: [0, 0, -24, -24] }} transition={{ duration: 1.3, times: [0, 0.5, 0.8, 1] }} style={{ originX: 0.1, originY: 1 }}>
          <Tankard empty className="w-full" />
        </m.div>
        <m.div
          className="absolute left-[4%] top-[14%] h-3 w-2 rounded-b-full rounded-t-[40%] bg-[#ffc23a]"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, 0, 70, 70], scaleX: [1, 1, 1, 2.2] }}
          transition={{ delay: 1.1, duration: 0.5, times: [0, 0.1, 0.85, 1], ease: "easeIn" }}
        />
      </div>

      <div className="absolute inset-x-0 top-[40%] flex flex-col items-center px-4 text-center">
        <Rise delay={1.4} className="max-w-xl font-display text-[clamp(1.4rem,4vw,2.4rem)] uppercase leading-tight text-hydromel [text-shadow:0_3px_0_#000]">
          Dernière tournée...
        </Rise>
        <Rise delay={1.7} className="mt-2 max-w-xl text-[clamp(1rem,2.4vw,1.35rem)] font-semibold text-parchemin">
          ... et « {shortWord(word, 30)} » n&apos;est pas sur la liste. Pas chouffin.
        </Rise>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Petite réaction                                                     */
/* ------------------------------------------------------------------ */

function SmallSante({ seed, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.sante} mode="light">
      <m.div
        className="absolute inset-x-0 top-[34%] h-[30vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.45, times: [0, 0.08, 0.85, 1] }}
      >
        <m.div
          className="absolute left-1/2 top-[18%] w-[clamp(80px,12vw,130px)]"
          initial={{ x: "-40vw", rotate: 0 }}
          animate={{ x: ["-40vw", "-96%", "-110%"], rotate: [0, 22, 14] }}
          transition={{ duration: 0.9, times: [0, 0.5, 1], ease: EASE_OUT }}
        >
          <Tankard className="w-full drop-shadow-[0_8px_0_rgb(0_0_0/0.35)]" />
        </m.div>
        <m.div
          className="absolute left-1/2 top-[18%] w-[clamp(80px,12vw,130px)]"
          initial={{ x: "40vw", rotate: 0 }}
          animate={{ x: ["40vw", "-4%", "10%"], rotate: [0, -22, -14] }}
          transition={{ duration: 0.9, times: [0, 0.5, 1], ease: EASE_OUT }}
        >
          <Tankard className="w-full -scale-x-100 drop-shadow-[0_8px_0_rgb(0_0_0/0.35)]" />
        </m.div>
        <Burst seed={seed} count={12} x={50} y={24} delay={0.45} duration={0.7} distance={[8, 18]} angle={[190, 350]} gravity={10} size={[8, 16]} render={() => <div className="aspect-square w-full rounded-full bg-[#fff8e6] ring-2 ring-[#3a2410]/60" />} />
        <Pop delay={0.5} className="absolute inset-x-0 top-[-14%] text-center">
          <span className="meme-text text-[clamp(2.2rem,8vw,4.2rem)] text-hydromel">Santé !</span>
        </Pop>
      </m.div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Gros combos                                                         */
/* ------------------------------------------------------------------ */

function ComboTournee({ word, seed, durationMs, onDone }: EggProps) {
  const slots = [0, 1, 2, 3, 4, 5];
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.tournee} style={TAVERN_BG}>
      <div className="absolute inset-x-0 bottom-0 h-[26vh] wood shadow-[0_-6px_0_#3a1f0c]" />
      <div className="absolute inset-x-0 top-[12%] flex flex-col items-center px-4 text-center">
        <Slam delay={1.15} from={2.6} className="text-[clamp(2.4rem,9vw,6.4rem)] text-hydromel">
          Tournée générale !
        </Slam>
        <Rise delay={1.55} className="mt-3 max-w-2xl text-[clamp(1.1rem,3vw,1.7rem)] font-semibold text-parchemin">
          C&apos;est « {shortWord(word, 28)} » qui régale.
        </Rise>
      </div>
      <div className="absolute inset-x-0 bottom-[25vh] flex items-end justify-center gap-[clamp(0.3rem,2vw,2rem)] px-2">
        {slots.map((index) => (
          <m.div
            key={index}
            className="w-[clamp(46px,11vw,120px)]"
            style={{ originY: 1 }}
            initial={{ x: "90vw", opacity: 0 }}
            animate={{ x: ["90vw", "-2vw", "0vw", "0vw", "0vw"], opacity: 1, rotate: [0, 0, 0, index % 2 ? 10 : -10, 0], y: [0, 0, 0, -18, 0] }}
            transition={{
              x: { delay: 0.2 + index * 0.13, duration: 0.45, times: [0, 0.75, 1, 1, 1], ease: EASE_OUT },
              opacity: { delay: 0.2 + index * 0.13, duration: 0.05 },
              rotate: { delay: 1.8, duration: 0.5 },
              y: { delay: 1.8, duration: 0.5 },
            }}
          >
            <Tankard className="w-full drop-shadow-[0_6px_0_rgb(0_0_0/0.35)]" fillAt={1 + index * 0.08} foamAt={1.5 + index * 0.08} />
          </m.div>
        ))}
      </div>
      <Burst seed={seed} count={18} x={50} y={60} delay={1.9} duration={0.9} distance={[14, 36]} angle={[200, 340]} gravity={16} size={[8, 16]} render={() => <div className="aspect-square w-full rounded-full bg-[#fff8e6] ring-2 ring-[#3a2410]/50" />} />
    </Stage>
  );
}

function ComboGras({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage
      durationMs={durationMs}
      onDone={onDone}
      sound={sounds.gras}
      style={{ background: "radial-gradient(70% 50% at 50% 100%, rgb(255 110 20 / 0.45), transparent 70%), radial-gradient(circle at 50% 40%, #2a140a 0%, #0d0604 78%)" }}
    >
      <div className="absolute inset-x-0 top-[9%] flex flex-col items-center px-4 text-center">
        <Slam delay={0.8} from={2.6} className="text-[clamp(2.2rem,8.5vw,6rem)] text-hydromel">
          Le gras, c&apos;est la vie.
        </Slam>
      </div>

      <div className="absolute inset-x-0 top-[40%] flex justify-center">
        <div className="relative h-[clamp(120px,24vh,220px)] w-[min(86vw,44rem)]">
          <div className="absolute left-[4%] top-1/2 h-[46vh] w-3 origin-top rotate-[14deg] rounded-full bg-[#5a3418]" />
          <div className="absolute right-[4%] top-1/2 h-[46vh] w-3 origin-top -rotate-[14deg] rounded-full bg-[#5a3418]" />
          <div className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,#d9d9d9,#6a6a6a)] shadow-[0_2px_0_#000]" />
          <div className="absolute inset-0 flex items-center justify-center [perspective:600px]">
            <m.div className="w-[min(58vw,26rem)]" initial={{ rotateX: 0 }} animate={{ rotateX: 720 }} transition={{ duration: 2.8, ease: "linear" }}>
              <Ham className="w-full drop-shadow-[0_0_18px_rgb(255_140_60/0.45)]" />
            </m.div>
          </div>
          <Burst seed={seed} count={8} x={50} y={75} delay={0.9} duration={1} distance={[4, 10]} angle={[70, 110]} gravity={22} size={[6, 10]} render={() => <div className="aspect-[2/3] w-full rounded-b-full rounded-t-[40%] bg-[#ffc23a]" />} />
          <Burst seed={seed + 5} count={6} x={50} y={40} delay={1.2} duration={0.8} distance={[10, 22]} size={[14, 22]} render={() => <svg viewBox="-10 -10 20 20" className="w-full" aria-hidden="true"><path d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10 Z" fill="#fff6cf" /></svg>} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-[20vh] items-end justify-center gap-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <m.div
            key={index}
            className="h-[70%] w-[clamp(34px,6vw,70px)] origin-bottom"
            animate={{ scaleY: [0.8, 1.05, 0.9, 1.1, 0.85, 1, 0.9], scaleX: [1, 0.92, 1.05, 0.95, 1] }}
            transition={{ duration: 2.8, ease: "easeInOut", delay: index * 0.05 }}
          >
            <Flame className="h-full w-full" />
          </m.div>
        ))}
      </div>

      <div className="absolute inset-x-0 top-[70%] flex flex-col items-center px-4 text-center">
        <Rise delay={1.4} className="max-w-2xl text-[clamp(1.05rem,2.8vw,1.6rem)] font-semibold text-parchemin [text-shadow:0_2px_0_#000]">
          « {shortWord(word, 30)} » : validé par le cuisinier.
        </Rise>
      </div>
    </Stage>
  );
}

const CHEERS = ["Santé !", "Prost !", "Skål !", "Sláinte !", "Salud !", "Kanpai !", "Na zdrowie !", "Cheers !", "Salute !", "Gānbēi !"];

function ComboMousse({ word, seed, durationMs, onDone }: EggProps) {
  const cheers = usePlan(seed, (random) =>
    CHEERS.map((text, index) => {
      const side = index % 2 === 0 ? between(random, 3, 26) : between(random, 70, 92);
      return { text, index, x: side, y: between(random, 18, 80), rotate: between(random, -14, 14), delay: 1.25 + index * 0.1 };
    }),
  );
  const bubbles = usePlan(seed + 1, (random) => Array.from({ length: 14 }, (_, index) => ({ index, x: between(random, 18, 78), size: between(random, 4, 10), delay: between(random, 0.4, 1.8) })));
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.mousse} style={TAVERN_BG}>
      <div className="absolute inset-x-0 top-[5%] flex justify-center px-4">
        <Slam delay={0.15} from={2.2} rotate={-6} className="max-w-[92vw] break-words text-hydromel" style={{ fontSize: wordSize(word, { max: 10, cap: 6 }) }}>
          {word}
        </Slam>
      </div>
      <div className="absolute left-1/2 top-[26%] h-[min(60vh,92vw)] -translate-x-1/2">
        <div className="relative h-full" style={{ aspectRatio: "112 / 132" }}>
          <Tankard className="h-full w-full drop-shadow-[0_12px_0_rgb(0_0_0/0.35)]" fillAt={0.1} fillDuration={1.1} foamAt={1.1} />
          {bubbles.map((bubble) => (
            <m.div
              key={bubble.index}
              className="absolute bottom-[8%] rounded-full bg-[#fff4cf]/80"
              style={{ left: `${bubble.x * 0.6}%`, width: bubble.size, height: bubble.size }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: "-40vh", opacity: [0, 1, 0] }}
              transition={{ delay: bubble.delay, duration: 1, ease: "easeIn" }}
            />
          ))}
          {[
            { left: 6, height: 34 },
            { left: 30, height: 18 },
            { left: 52, height: 26 },
          ].map(({ left, height }, index) => (
            <m.div
              key={left}
              className="absolute top-[24%] w-[8%] origin-top rounded-b-full rounded-t-sm bg-[#fff8e6] shadow-[inset_-3px_0_0_rgb(58_36_16/0.15)] ring-[3px] ring-[#3a2410]"
              style={{ left: `${left}%`, height: `${height}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1] }}
              transition={{ delay: 1.45 + index * 0.12, duration: 0.8, ease: "easeIn" }}
            />
          ))}
        </div>
      </div>
      {cheers.map((cheer) => (
        <m.p
          key={cheer.index}
          className="meme-text absolute whitespace-nowrap text-[clamp(1.1rem,3vw,2rem)] text-[#fff1c9]"
          style={{ left: `${cheer.x}%`, top: `${cheer.y}%`, rotate: cheer.rotate, x: "-50%" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.25, 1] }}
          transition={{ delay: cheer.delay, duration: 0.35 }}
        >
          {cheer.text}
        </m.p>
      ))}
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Légendaires                                                         */
/* ------------------------------------------------------------------ */

function Chandelier({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 110" aria-hidden="true" className={className}>
      <path d="M100 0 V40 M40 62 L100 40 L160 62" stroke="#6a6a6a" strokeWidth={3} fill="none" />
      <ellipse cx="100" cy="68" rx="80" ry="14" fill="#5a3418" stroke="#2a1508" strokeWidth={4} />
      {[36, 68, 100, 132, 164].map((x) => (
        <g key={x}>
          <rect x={x - 5} y={40} width="10" height="24" fill="#f6ecd6" stroke="#2a1508" strokeWidth={2} />
          <path d={`M${x} 22 C${x - 6} 30 ${x - 4} 38 ${x} 40 C${x + 4} 38 ${x + 6} 30 ${x} 22 Z`} fill="#ffc23a" />
          <path d={`M${x} 30 C${x - 2} 34 ${x - 2} 38 ${x} 39 C${x + 2} 38 ${x + 2} 34 ${x} 30 Z`} fill="#fff6cf" />
        </g>
      ))}
    </svg>
  );
}

function LegendaryBanquet({ word, seed, durationMs, onDone }: EggProps) {
  const raise = { y: [0, 0, -34, -34, 0, 0, -40, -40, 0], rotate: [0, 0, -14, -8, 0, 0, -16, -8, 0] };
  const raiseTimes = [0, 0.3, 0.36, 0.5, 0.58, 0.62, 0.68, 0.84, 0.92];
  return (
    <Stage
      durationMs={durationMs}
      onDone={onDone}
      sound={sounds.banquet}
      style={{ background: "radial-gradient(70% 60% at 50% 0%, rgb(255 200 90 / 0.45), transparent 70%), radial-gradient(circle at 50% 50%, #3a2210 0%, #120904 80%)" }}
    >
      <Rays color="rgb(255 210 110 / 0.18)" delay={0.1} spin={30} duration={3.4} />
      <m.div
        className="absolute left-1/2 top-0 w-[clamp(200px,34vw,380px)]"
        style={{ x: "-50%", originY: 0 }}
        initial={{ y: "-30vh" }}
        animate={{ y: "0vh", rotate: [0, 6, -5, 4, -3, 2, 0] }}
        transition={{ y: { duration: 0.5, ease: EASE_OUT }, rotate: { delay: 0.3, duration: 3, ease: "easeInOut" } }}
      >
        <Chandelier className="w-full drop-shadow-[0_0_24px_rgb(255_190_80/0.6)]" />
      </m.div>

      <div className="absolute inset-x-0 top-[22%] flex flex-col items-center px-4 text-center">
        <Slam delay={0.5} from={3} className="max-w-[94vw] break-words" style={{ color: "var(--color-rarity-legendary)", fontSize: wordSize(word, { max: 12, cap: 7.5 }) }}>
          {word}
        </Slam>
        <Rise delay={0.85} className="mt-2 font-display text-[clamp(1.1rem,3.2vw,2rem)] uppercase tracking-[0.08em] text-parchemin [text-shadow:0_2px_0_#000]">
          est convié au banquet des dieux
        </Rise>
        <div className="grid">
          <m.p className="meme-text col-start-1 row-start-1 mt-6 text-[clamp(2.4rem,9vw,5.6rem)] text-hydromel" initial={{ opacity: 0, scale: 2.4 }} animate={{ opacity: [0, 1, 1, 0], scale: [2.4, 1, 1, 1] }} transition={{ delay: 1.15, duration: 0.9, times: [0, 0.15, 0.85, 1] }}>
            Skål !
          </m.p>
          <m.p className="meme-text col-start-1 row-start-1 mt-6 text-[clamp(2.8rem,11vw,6.6rem)] text-hydromel" initial={{ opacity: 0, scale: 2.6 }} animate={{ opacity: 1, scale: [2.6, 1] }} transition={{ delay: 2.15, duration: 0.35 }}>
            Skål !!
          </m.p>
        </div>
      </div>

      <m.div className="absolute inset-x-0 bottom-0 h-[30vh]" initial={{ y: "35vh" }} animate={{ y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: EASE_OUT }}>
        <div className="absolute inset-x-[4%] bottom-0 h-[52%] rounded-t-md wood shadow-[0_-4px_0_#2a1508]" />
        <div className="absolute inset-x-[4%] bottom-[48%] h-[8%] bg-[#f3e2b8] shadow-[0_3px_0_#b89a5e]" />
        <div className="absolute inset-x-[6%] bottom-[54%] flex items-end justify-between">
          {[0, 1, 2, 3, 4, 5, 6].map((index) =>
            index === 3 ? (
              <div key={index} className="w-[clamp(90px,16vw,190px)]">
                <Ham className="w-full" />
              </div>
            ) : (
              <m.div
                key={index}
                className="w-[clamp(38px,7vw,82px)]"
                style={{ originY: 1 }}
                animate={{ y: raise.y, rotate: raise.rotate.map((value) => (index < 3 ? -value : value)) }}
                transition={{ duration: 3.4, times: raiseTimes, ease: "easeInOut" }}
              >
                <Tankard className={`w-full ${index < 3 ? "" : "-scale-x-100"}`} />
              </m.div>
            ),
          )}
        </div>
      </m.div>
      <Burst seed={seed} count={16} x={50} y={70} delay={1.2} duration={0.9} distance={[14, 34]} angle={[200, 340]} gravity={14} size={[8, 14]} render={() => <div className="aspect-square w-full rounded-full bg-[#fff8e6]" />} />
      <Burst seed={seed + 1} count={16} x={50} y={70} delay={2.2} duration={0.9} distance={[14, 38]} angle={[200, 340]} gravity={14} size={[8, 14]} render={() => <div className="aspect-square w-full rounded-full bg-[#fff8e6]" />} />
      <Rain seed={seed + 2} count={16} delay={[1.2, 2.6]} duration={[1.4, 2]} size={[18, 30]} spin={0} render={() => <SpinningCoin />} />
    </Stage>
  );
}

function LegendaryPatron({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.patron} style={TAVERN_BG}>
      <Rays color="rgb(255 200 90 / 0.16)" delay={0.5} spin={40} duration={2.9} />
      <Rain seed={seed} count={22} delay={[0.8, 2.6]} duration={[1.3, 2]} size={[20, 36]} spin={0} render={() => <SpinningCoin />} />
      <Rain seed={seed + 1} count={9} delay={[1, 2.4]} duration={[1.5, 2.1]} size={[44, 70]} spin={200} render={() => <Tankard className="w-full" />} />
      <Shake at={[0.5]} intensity={8}>
        <m.div
          className="absolute left-1/2 top-[3%] w-[clamp(70px,10vw,110px)]"
          style={{ x: "-50%", originY: 0 }}
          animate={{ rotate: [0, 28, -24, 22, -18, 12, -6, 0] }}
          transition={{ delay: 0.05, duration: 0.9, ease: "easeInOut" }}
        >
          <BarBell className="w-full drop-shadow-[0_0_18px_rgb(255_200_90/0.5)]" />
          <DingLines delay={0.1} />
        </m.div>
        <div className="absolute inset-x-0 top-[26%] flex flex-col items-center px-4 text-center">
          <Slam delay={0.5} from={2.6} className="text-[clamp(2.2rem,8vw,5.6rem)] text-hydromel">
            Tournée du patron !
          </Slam>
          <Rise delay={1.2} className="mt-4 font-display text-[clamp(1.1rem,3vw,1.9rem)] uppercase tracking-[0.08em] text-parchemin [text-shadow:0_2px_0_#000]">
            Hydromel à volonté pour
          </Rise>
          <Slam delay={1.45} from={2.4} rotate={-4} className="mt-2 max-w-[94vw] break-words" style={{ color: "var(--color-rarity-legendary)", fontSize: wordSize(word, { max: 12, cap: 7.5 }) }}>
            {word}
          </Slam>
          <Pop delay={2} className="mt-3 rounded-full border-2 border-[#3a2410] bg-[#f3e2b8] px-4 py-1 font-display text-[clamp(1rem,2.6vw,1.5rem)] uppercase text-[#3a2410] shadow-[0_4px_0_#3a2410]">
            Légendaire · offert par la maison
          </Pop>
        </div>
      </Shake>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */

export default function TaverneEgg(props: EggProps) {
  switch (props.variant) {
    case "derniere":
      return <FailDerniere {...props} />;
    case "sante":
      return <SmallSante {...props} />;
    case "tournee":
      return <ComboTournee {...props} />;
    case "gras":
      return <ComboGras {...props} />;
    case "mousse":
      return <ComboMousse {...props} />;
    case "banquet":
      return <LegendaryBanquet {...props} />;
    case "patron":
      return <LegendaryPatron {...props} />;
    default:
      return props.level === "fail" ? <FailDerniere {...props} /> : props.level === "small" ? <SmallSante {...props} /> : <ComboTournee {...props} />;
  }
}
