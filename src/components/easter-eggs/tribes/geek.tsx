"use client";

/**
 * Tribu geek : sorciers, sabres laser, super-héros, science-fiction.
 * - échec : claquement de doigts (le mot part en poussière) ou le choixpeau qui crie « Moldu ! » ;
 * - petite réaction : le choixpeau répartit le mot dans une maison inventée ;
 * - gros combo : sabres laser croisés, pluie de code et pilule chouffin, patronus sanglier ;
 * - légendaire : saut en hyperespace et générique qui défile, gantelet aux six gemmes.
 */

import { m } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import * as sounds from "@/lib/client/tribe-sounds/geek";
import { Burst, EASE_OUT, Flash, Pop, Rise, Scramble, Shake, Slam, Stage, between, letters, roman, shortWord, usePlan, wordSize } from "../kit";
import type { EggProps } from "../types";

const DEEP_SPACE = "starfield";

/* ------------------------------------------------------------------ */
/* Le choixpeau (chapeau pointu rapiécé qui parle)                     */
/* ------------------------------------------------------------------ */

function SortingHat({ className, speaking = [] }: { className?: string; speaking?: readonly number[] }) {
  // La bouche s'ouvre à chaque instant de `speaking`.
  const mouth = speaking.length
    ? {
        animate: { scaleY: speaking.flatMap(() => [0.3, 1.4, 0.5, 1.2, 0.3]) },
        transition: { delay: speaking[0], duration: speaking.length * 0.5, ease: "easeInOut" as const },
      }
    : {};
  return (
    <svg viewBox="0 0 200 190" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="hat-leather" x1="0" x2="1">
          <stop offset="0" stopColor="#5a3a1c" />
          <stop offset="0.45" stopColor="#8a5c30" />
          <stop offset="1" stopColor="#4a2e14" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="160" rx="92" ry="22" fill="#4a2e14" stroke="#1d1108" strokeWidth={4} />
      <path
        d="M36 158 C44 120 58 92 74 70 C84 52 96 30 112 18 C122 10 138 8 146 20 C140 22 132 28 128 38 C124 52 130 80 140 108 C148 130 158 148 164 158 Z"
        fill="url(#hat-leather)"
        stroke="#1d1108"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M86 70 L110 64 L112 84 L90 88 Z" fill="#6e4722" stroke="#1d1108" strokeWidth={2} />
      <path d="M92 72 L106 70 M94 80 L108 78" stroke="#1d1108" strokeWidth={1.5} />
      <path d="M70 104 C78 98 90 98 96 104" fill="none" stroke="#1d1108" strokeWidth={4} strokeLinecap="round" />
      <path d="M110 102 C116 96 128 96 134 102" fill="none" stroke="#1d1108" strokeWidth={4} strokeLinecap="round" />
      <m.g style={{ originX: "100px", originY: "130px" }} initial={{ scaleY: 0.3 }} {...mouth}>
        <path d="M74 128 C90 118 116 118 132 128 C118 142 90 142 74 128 Z" fill="#1d1108" />
      </m.g>
      <path d="M60 148 C80 140 120 140 146 148" fill="none" stroke="#2a1a0c" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

function Bubble({ children, delay, className = "", tone = "light" }: { children: ReactNode; delay: number; className?: string; tone?: "light" | "alert" }) {
  return (
    <Pop
      delay={delay}
      className={`relative rounded-2xl border-[3px] border-black px-4 py-2 text-center font-bold shadow-[0_5px_0_#000] ${
        tone === "alert" ? "bg-[#ffe3e3] text-[#8a0f1a]" : "bg-white text-[#1b1330]"
      } ${className}`}
    >
      {children}
      <span className="absolute -bottom-[14px] left-1/2 size-0 -translate-x-1/2 border-x-[12px] border-t-[14px] border-x-transparent border-t-black" />
    </Pop>
  );
}

const HOUSES = ["Chouffondor", "Serpentaverne", "Serdaigrog", "Poufsoufflé"] as const;

/* ------------------------------------------------------------------ */
/* Échecs                                                              */
/* ------------------------------------------------------------------ */

function FailSnap({ word, seed, durationMs, onDone }: EggProps) {
  const display = shortWord(word, 26);
  const chars = letters(display);
  const dust = usePlan(seed, (random) =>
    chars.map(({ index }) =>
      Array.from({ length: 7 }, (_, k) => ({
        k,
        x: between(random, 10, 90),
        y: between(random, 10, 90),
        dx: between(random, 30, 140),
        dy: between(random, -120, -20),
        size: between(random, 2, 6),
        color: ["#e9e2d4", "#b9ad98", "#8c7f6a", "#f7f1e5"][Math.floor(random() * 4)],
        lag: random() * 0.3 + index * 0.07,
      })),
    ),
  );
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.snapDust} className="bg-[radial-gradient(circle_at_50%_45%,#2a1e40_0%,#0b0714_75%)]">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <m.p
          className="doge-text mb-4 text-[clamp(1.2rem,3vw,1.8rem)] text-hydromel"
          style={{ rotate: -8 }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.15, 1, 1] }}
          transition={{ delay: 0.3, duration: 1, times: [0, 0.15, 0.7, 1] }}
        >
          *snap*
        </m.p>
        <p className="meme-text flex max-w-[94vw] flex-wrap justify-center" style={{ fontSize: wordSize(display, { max: 14, cap: 8.5 }) }}>
          {chars.map(({ char, index }) => (
            <span key={index} className="relative inline-block whitespace-pre">
              <m.span
                className="inline-block"
                initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{ opacity: [1, 1, 0], x: [0, 0, 26], y: [0, 0, -14] }}
                transition={{ delay: 0.6 + index * 0.07, duration: 0.8, times: [0, 0.2, 1] }}
              >
                {char}
              </m.span>
              {char.trim()
                ? dust[index].map((grain) => (
                    <m.span
                      key={grain.k}
                      className="absolute block"
                      style={{ left: `${grain.x}%`, top: `${grain.y}%`, width: grain.size, height: grain.size, background: grain.color }}
                      initial={{ opacity: 0, x: 0, y: 0 }}
                      animate={{ opacity: [0, 1, 0], x: grain.dx, y: grain.dy }}
                      transition={{ delay: 0.65 + grain.lag, duration: 1.3, ease: "easeOut" }}
                    />
                  ))
                : null}
            </span>
          ))}
        </p>
        <Rise delay={1.3} className="mt-6 max-w-xl text-[clamp(1.05rem,2.6vw,1.5rem)] italic text-parchemin">
          « Je ne me sens pas très chouffin... »
        </Rise>
        <Rise delay={1.9} className="mt-2 text-sm font-semibold text-brume">
          Pas chouffin. Réduit en poussière, comme la moitié de l&apos;univers.
        </Rise>
      </div>
    </Stage>
  );
}

function FailMoldu({ word, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.moldu} className="bg-[radial-gradient(circle_at_50%_40%,#2b2040_0%,#0d0916_78%)]">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="grid">
          <m.div className="col-start-1 row-start-1 self-center" initial={{ opacity: 1 }} animate={{ opacity: 0, scale: 0.6 }} transition={{ delay: 1.02, duration: 0.12 }}>
            <Bubble delay={0.15} className="text-[clamp(1rem,2.6vw,1.4rem)]">
              Hmm... difficile. Très difficile...
            </Bubble>
          </m.div>
          <m.p
            className="meme-text relative z-10 col-start-1 row-start-1 self-center text-center text-[clamp(2.6rem,10vw,6rem)] text-[#ff8a95]"
            initial={{ opacity: 0, scale: 2.4, rotate: -6 }}
            animate={{ opacity: 1, scale: [2.4, 0.95, 1], rotate: [-6, -2, -4] }}
            transition={{ delay: 1.1, duration: 0.35 }}
          >
            Moldu !
          </m.p>
        </div>
        <m.div
          className="mt-6 w-[clamp(170px,26vw,280px)]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, -6, 6, -4, 0, 0, 0], scaleY: [1, 1, 1, 1, 1, 0.82, 0.86] }}
          transition={{
            y: { type: "spring", stiffness: 260, damping: 18 },
            opacity: { duration: 0.2 },
            rotate: { duration: 1.6, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1] },
            scaleY: { delay: 0.2, duration: 1.6, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1] },
          }}
          style={{ originY: 1 }}
        >
          <SortingHat className="w-full drop-shadow-[0_10px_0_rgb(0_0_0/0.35)]" speaking={[0.2, 1.1]} />
        </m.div>
        <Rise delay={1.6} className="mt-5 max-w-lg text-[clamp(1rem,2.4vw,1.3rem)] text-parchemin">
          « {shortWord(word, 30)} » n&apos;a jamais reçu sa lettre. Pas chouffin.
        </Rise>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Petite réaction                                                     */
/* ------------------------------------------------------------------ */

function SmallChoixpeau({ seed, durationMs, onDone }: EggProps) {
  const house = usePlan(seed, (random) => HOUSES[Math.floor(random() * HOUSES.length)]);
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.choixpeau} mode="light">
      <m.div
        className="absolute left-1/2 top-[36%] flex w-[min(24rem,86vw)] flex-col items-center"
        style={{ x: "-50%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.85, times: [0, 0.08, 0.88, 1] }}
      >
        <div className="grid">
          <m.div className="col-start-1 row-start-1 self-center justify-self-center" initial={{ opacity: 1 }} animate={{ opacity: 0, scale: 0.6 }} transition={{ delay: 0.82, duration: 0.12 }}>
            <Bubble delay={0.2} className="text-base">
              Hmm... voyons voir...
            </Bubble>
          </m.div>
          <m.p
            className="meme-text relative z-10 col-start-1 row-start-1 self-center whitespace-nowrap text-center text-[clamp(1.8rem,7vw,3.2rem)] text-hydromel"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: [2, 0.95, 1] }}
            transition={{ delay: 0.9, duration: 0.3 }}
          >
            {house} !
          </m.p>
        </div>
        <m.div
          className="mt-3 w-[clamp(110px,18vw,170px)]"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, -7, 7, -5, 0] }}
          transition={{ y: { type: "spring", stiffness: 320, damping: 16 }, opacity: { duration: 0.15 }, rotate: { delay: 0.2, duration: 0.7 } }}
        >
          <SortingHat className="w-full drop-shadow-[0_8px_0_rgb(0_0_0/0.35)]" speaking={[0.2, 0.9]} />
        </m.div>
        <Burst
          seed={seed}
          count={10}
          x={50}
          y={20}
          delay={0.9}
          duration={0.8}
          distance={[14, 26]}
          size={[12, 20]}
          render={() => <Sparkle color="#ffe27a" />}
        />
      </m.div>
    </Stage>
  );
}

function Sparkle({ color = "#fff" }: { color?: string }) {
  return (
    <svg viewBox="-10 -10 20 20" aria-hidden="true" className="w-full">
      <path d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10 Z" fill={color} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Gros combos                                                         */
/* ------------------------------------------------------------------ */

function Saber({ color, angle, delay, side }: { color: string; angle: number; delay: number; side: "left" | "right" }) {
  return (
    <div
      className="absolute bottom-[12%] h-0 w-0"
      style={{ [side]: "14%", rotate: `${angle}deg` } as CSSProperties}
    >
      <m.div
        className="absolute left-0 top-0 origin-left"
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 0, -3, 2, 0] }}
        transition={{ delay: delay + 0.3, duration: 1.8, times: [0, 0.2, 0.5, 0.8, 1] }}
      >
        <div className="absolute left-[-3.2rem] top-[-0.6rem] h-[1.2rem] w-[3.4rem] rounded-sm border-2 border-black bg-[linear-gradient(180deg,#e6e6e6,#8a8a8a_55%,#3a3a3a)]">
          <div className="ml-3 mt-[0.2rem] h-[0.5rem] w-[0.6rem] rounded-[2px] bg-[#c1121f]" />
        </div>
        <m.div
          className="absolute left-0 top-[-0.42rem] h-[0.84rem] w-[min(62vmin,34rem)] origin-left rounded-full"
          style={{
            background: `linear-gradient(180deg, ${color} 0%, #ffffff 30%, #ffffff 70%, ${color} 100%)`,
            boxShadow: `0 0 10px 2px ${color}, 0 0 34px 8px ${color}`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay, duration: 0.28, ease: EASE_OUT }}
        />
      </m.div>
    </div>
  );
}

function ComboSabre({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.sabre} className={DEEP_SPACE}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,transparent_20%,rgb(0_0_0/0.6)_100%)]" />
      <Shake at={[1.2]} intensity={8}>
        <Saber color="#57ff4a" angle={-38} delay={0.2} side="left" />
        <Saber color="#3d9bff" angle={-142} delay={0.7} side="right" />
        <Burst seed={seed} count={14} x={50} y={36} delay={1.2} duration={0.7} distance={[6, 18]} gravity={6} size={[6, 12]} render={() => <div className="aspect-square w-full rounded-full bg-[#fff6c2] shadow-[0_0_8px_#ffd84a]" />} />
        <div className="absolute inset-x-0 top-[52%] flex flex-col items-center px-4 text-center">
          <Slam delay={1.3} from={2.4} rotate={-4} settle={0} className="max-w-[94vw] break-words [text-shadow:0_0_24px_rgb(87_255_74/0.6),0_0.05em_0_#000]" style={{ fontSize: wordSize(word, { max: 12, cap: 7.5 }) }}>
            {word}
          </Slam>
          <Rise delay={1.7} className="mt-4 font-display text-[clamp(1.2rem,3.6vw,2.2rem)] uppercase tracking-[0.12em] text-[#ffe81f] [text-shadow:0_2px_0_#000]">
            Que la Chouffe soit avec toi
          </Rise>
        </div>
      </Shake>
      <Flash at={1.2} color="#e8fff0" peak={0.3} />
    </Stage>
  );
}

const CODE_GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789";

function ComboMatrix({ word, seed, durationMs, onDone }: EggProps) {
  const columns = usePlan(seed, (random) =>
    Array.from({ length: 30 }, (_, index) => {
      const length = Math.floor(between(random, 12, 26));
      let text = "";
      for (let i = 0; i < length; i++) text += CODE_GLYPHS[Math.floor(random() * CODE_GLYPHS.length)] + (i < length - 1 ? "\n" : "");
      return { index, text, left: (index / 30) * 100 + between(random, -0.8, 0.8), delay: between(random, 0, 1.2), duration: between(random, 1.3, 2.4), size: between(random, 0.85, 1.25) };
    }),
  );
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.matrix} className="bg-black">
      {columns.map((column) => (
        <m.pre
          key={column.index}
          className="absolute top-0 whitespace-pre text-center font-mono leading-[1.05] text-[#3dff6a] [mask-image:linear-gradient(180deg,transparent,#000_75%)] [text-shadow:0_0_8px_rgb(61_255_106/0.6)]"
          style={{ left: `${column.left}%`, fontSize: `${column.size}rem` }}
          initial={{ y: "-100%" }}
          animate={{ y: "110vh" }}
          transition={{ delay: column.delay, duration: column.duration, ease: "linear" }}
        >
          {column.text}
        </m.pre>
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <m.div
          className="rounded-lg bg-black/90 px-[clamp(1rem,4vw,3rem)] py-[clamp(1rem,3vh,2rem)] ring-1 ring-[#3dff6a]/40"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          <p className="font-mono font-bold text-[#b9ffc8] [text-shadow:0_0_14px_rgb(61_255_106/0.8)]" style={{ fontSize: wordSize(word, { max: 9, cap: 6, min: 1.6, factor: 110 }) }}>
            <Scramble text={shortWord(word, 24)} delay={0.45} duration={0.9} glyphs={CODE_GLYPHS} />
          </p>
          <Rise delay={1.5} className="mt-3 font-mono text-[clamp(0.95rem,2.4vw,1.3rem)] text-[#3dff6a]">
            Tu as pris la pilule chouffin.
          </Rise>
          <div className="mt-4 flex items-center justify-center gap-8">
            <m.div className="flex flex-col items-center gap-1" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.25] }} transition={{ delay: 1.6, duration: 0.9, times: [0, 0.3, 1] }}>
              <Pill color="#3d7bff" />
              <span className="font-mono text-xs text-[#9db8ff]">brunch</span>
            </m.div>
            <m.div className="flex flex-col items-center gap-1" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: [0.6, 1.25, 1, 1.12, 1] }} transition={{ delay: 1.75, duration: 1 }}>
              <Pill color="#57ff4a" />
              <span className="font-mono text-xs text-[#b9ffc8]">chouffin</span>
            </m.div>
          </div>
        </m.div>
      </div>
    </Stage>
  );
}

function Pill({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 28" aria-hidden="true" className="w-14 drop-shadow-[0_0_10px_currentColor]" style={{ color }}>
      <rect x="2" y="2" width="56" height="24" rx="12" fill={color} stroke="#000" strokeWidth={2.5} />
      <rect x="10" y="6" width="22" height="6" rx="3" fill="#fff" opacity={0.55} />
    </svg>
  );
}

function PatronusBoar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="patronus-glow" cx="0.55" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="0.55" stopColor="#bfe3ff" stopOpacity={0.75} />
          <stop offset="1" stopColor="#6fb6ff" stopOpacity={0.35} />
        </radialGradient>
      </defs>
      <g fill="url(#patronus-glow)" stroke="#e9f6ff" strokeWidth={2.2} strokeLinejoin="round">
        <path d="M146 92 L146 112 L138 112 L134 94 Z M78 94 L76 112 L68 112 L66 92 Z" opacity={0.6} />
        <path d="M30 55 C30 42 44 32 60 28 L64 20 L70 28 L76 18 L82 26 L88 14 L94 24 L100 12 L106 23 L112 12 L118 24 L124 14 L129 27 L136 18 L140 30 C148 30 154 33 158 38 L166 28 L170 42 C178 48 190 60 198 68 L199 79 C190 83 180 82 172 80 C166 86 160 90 152 92 L154 112 L144 112 L140 95 C120 97 100 97 86 95 L84 112 L74 112 L70 93 C50 90 34 80 30 66 Z" />
      </g>
      <path d="M182 80 C192 72 192 58 182 52" fill="none" stroke="#ffffff" strokeWidth={4.5} strokeLinecap="round" />
      <circle cx="196" cy="72" r="1.6" fill="#0b2a55" />
      <circle cx="172" cy="52" r="2.8" fill="#0b2a55" />
      <path d="M30 58 C20 52 22 42 30 46 C34 48 28 54 24 50" fill="none" stroke="#e9f6ff" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

function ComboPatronus({ word, seed, durationMs, onDone }: EggProps) {
  const trail = usePlan(seed, (random) =>
    Array.from({ length: 16 }, (_, index) => ({
      index,
      x: -38 + index * 2.6 + between(random, -1, 1),
      y: between(random, -6, 6),
      size: between(random, 10, 22),
      delay: 0.15 + index * 0.07,
    })),
  );
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.patronus} className="bg-[radial-gradient(circle_at_50%_45%,#123a6b_0%,#07162e_60%,#040a16_100%)]">
      <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-[radial-gradient(70%_60%_at_50%_100%,rgb(170_210_255/0.18),transparent_70%)]" />
      <Rise delay={0.05} className="absolute inset-x-0 top-[9vh] px-4 text-center font-display text-[clamp(1.6rem,6vw,4rem)] uppercase italic tracking-[0.06em] text-[#dff1ff] [text-shadow:0_0_22px_rgb(150_205_255/0.9),0_3px_0_#0b2a55]">
        Expecto chouffinum !
      </Rise>
      <div className="absolute left-1/2 top-[44%] h-0 w-0">
        {trail.map((spark) => (
          <m.div
            key={spark.index}
            className="absolute"
            style={{ left: `${spark.x}vw`, top: `${spark.y}vh`, width: spark.size }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0.4], y: [0, -20] }}
            transition={{ delay: spark.delay, duration: 1.1 }}
          >
            <Sparkle color="#dff1ff" />
          </m.div>
        ))}
      </div>
      <m.div
        className="absolute left-1/2 top-[30%] w-[clamp(220px,40vw,480px)]"
        style={{ x: "-50%" }}
        initial={{ x: "-120vw", opacity: 0 }}
        animate={{ x: "-50%", opacity: 1 }}
        transition={{ duration: 1.25, ease: EASE_OUT, opacity: { duration: 0.4 } }}
      >
        <div className="absolute inset-[-25%] rounded-full bg-[radial-gradient(closest-side,rgb(190_225_255/0.5),transparent)]" />
        <m.div animate={{ y: [0, -14, 0, -14, 0, -10, 0, -4, 0] }} transition={{ duration: 1.3, ease: "easeInOut" }}>
          <PatronusBoar className="relative w-full drop-shadow-[0_0_18px_rgb(190_225_255/0.9)]" />
        </m.div>
      </m.div>
      <div className="absolute inset-x-0 top-[66%] flex flex-col items-center px-4 text-center">
        <Slam delay={1.35} from={2} rotate={0} settle={0} className="max-w-[94vw] break-words text-[#eef8ff] [text-shadow:0_0_22px_rgb(150_205_255/0.8),0_0.05em_0_#000]" style={{ fontSize: wordSize(word, { max: 10, cap: 6 }) }}>
          {word}
        </Slam>
        <Rise delay={1.75} className="mt-2 text-[clamp(1rem,2.6vw,1.4rem)] font-semibold text-[#bfe3ff]">
          Ton patronus est un sanglier. Évidemment.
        </Rise>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Légendaires                                                         */
/* ------------------------------------------------------------------ */

function LegendaryHyperespace({ word, score, seed, durationMs, onDone }: EggProps) {
  const streaks = usePlan(seed, (random) =>
    Array.from({ length: 72 }, (_, index) => ({
      index,
      angle: between(random, 0, 360),
      start: between(random, 2, 22),
      length: between(random, 14, 42),
      delay: between(random, 0, 0.3),
      tint: random() < 0.25 ? "#aad4ff" : "#ffffff",
    })),
  );
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.hyperespace} className="bg-black">
      <m.div className="absolute inset-0" initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={{ duration: 1.25, times: [0, 0.8, 1] }}>
        {streaks.map((streak) => (
          <div key={streak.index} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ rotate: `${streak.angle}deg` }}>
            <m.div
              className="absolute top-[-1px] h-[2px] origin-left rounded-full"
              style={{ width: `${streak.length}vmax`, background: `linear-gradient(90deg, transparent, ${streak.tint})` }}
              initial={{ x: `${streak.start}vmin`, scaleX: 0.03, opacity: 0 }}
              animate={{ x: [`${streak.start}vmin`, `${streak.start + 4}vmin`, `${streak.start + 70}vmin`], scaleX: [0.03, 0.08, 1], opacity: [0, 1, 1] }}
              transition={{ delay: streak.delay, duration: 1, times: [0, 0.45, 1], ease: "easeIn" }}
            />
          </div>
        ))}
      </m.div>
      <Flash at={1} color="#dcecff" peak={0.45} duration={0.5} />

      <m.div className="starfield absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.3 }} />

      <m.p
        className="absolute inset-x-0 top-[40%] px-6 text-center text-[clamp(1.05rem,2.6vw,1.6rem)] leading-snug text-[#4fc3f7]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ delay: 1.15, duration: 0.9, times: [0, 0.2, 0.8, 1] }}
      >
        Il y a bien longtemps, dans une taverne lointaine, très lointaine...
      </m.p>

      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        <m.p
          className="max-w-[92vw] break-words text-center font-display uppercase leading-none text-transparent [-webkit-text-stroke:0.035em_#ffe81f]"
          style={{ fontSize: wordSize(word, { max: 16, cap: 11 }) }}
          initial={{ opacity: 0, scale: 2.4 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [2.4, 1.2, 0.6, 0.3] }}
          transition={{ delay: 2, duration: 1.4, times: [0, 0.1, 0.7, 1], ease: "easeOut" }}
        >
          {word}
        </m.p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[62vh] overflow-hidden [perspective:360px] [mask-image:linear-gradient(0deg,#000_40%,transparent)]">
        <m.div
          className="mx-auto w-[min(34rem,86vw)] origin-bottom text-center font-bold text-[#ffe81f]"
          style={{ rotateX: 28 }}
          initial={{ y: "70vh" }}
          animate={{ y: "-6vh" }}
          transition={{ delay: 2.15, duration: 1.5, ease: "linear" }}
        >
          <p className="text-[clamp(1rem,2.6vw,1.5rem)] uppercase tracking-[0.14em]">Épisode {roman(score)}</p>
          <p className="mt-2 font-display text-[clamp(1.6rem,5vw,3rem)] uppercase">Le réveil du chouffin</p>
          <p className="mt-3 text-justify text-[clamp(0.95rem,2.2vw,1.3rem)] leading-snug">
            C&apos;est une époque de chouffinitude intense. Depuis leur taverne secrète, les chouffins ont remporté leur première
            victoire contre l&apos;Empire du Brunch. « {shortWord(word, 30)} » vient d&apos;être déclaré légendaire...
          </p>
        </m.div>
      </div>
    </Stage>
  );
}

const GEMS = ["#3b82ff", "#ff3b3b", "#a855f7", "#ffd400", "#22c55e", "#ff8a1a"];
const GEM_SLOTS = [
  { cx: 44, cy: 58, r: 6 },
  { cx: 66, cy: 52, r: 6 },
  { cx: 88, cy: 52, r: 6 },
  { cx: 110, cy: 58, r: 6 },
  { cx: 26, cy: 118, r: 6 },
  { cx: 77, cy: 110, r: 11 },
];

function Gauntlet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 190" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="gauntlet-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#8a5a00" />
          <stop offset="0.35" stopColor="#ffd86a" />
          <stop offset="0.6" stopColor="#e0a520" />
          <stop offset="1" stopColor="#7a4d00" />
        </linearGradient>
      </defs>
      <g fill="url(#gauntlet-gold)" stroke="#2e1d00" strokeWidth={3} strokeLinejoin="round">
        <rect x="34" y="14" width="20" height="56" rx="10" />
        <rect x="56" y="4" width="20" height="62" rx="10" />
        <rect x="78" y="6" width="20" height="60" rx="10" />
        <rect x="100" y="18" width="19" height="52" rx="9.5" />
        <path d="M14 96 C8 84 12 72 22 74 C30 76 34 90 38 100 Z" />
        <path d="M30 54 H122 V124 C122 140 108 150 92 150 H56 C40 150 26 138 26 122 Z" />
        <path d="M40 146 H108 L112 186 H36 Z" />
      </g>
      <path d="M40 160 H108 M38 172 H110" stroke="#2e1d00" strokeWidth={2} />
      {GEM_SLOTS.map((slot, index) => (
        <circle key={index} cx={slot.cx} cy={slot.cy} r={slot.r} fill="#2a1a00" stroke="#2e1d00" strokeWidth={2} />
      ))}
    </svg>
  );
}

function LegendaryGantelet({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage
      durationMs={durationMs}
      onDone={onDone}
      sound={sounds.gantelet}
      style={{
        background:
          "radial-gradient(60% 50% at 30% 30%, rgb(120 50 180 / 0.45), transparent), radial-gradient(60% 50% at 75% 70%, rgb(40 80 200 / 0.4), transparent), #07040f",
      }}
    >
      <m.div
        className="pointer-events-none absolute left-1/2 top-[34%] aspect-square w-[10vmin] rounded-full"
        style={{ x: "-50%", y: "-50%", background: "radial-gradient(circle, rgb(255 214 120 / 0.22) 0%, rgb(182 255 46 / 0.08) 55%, transparent 70%)" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 30], opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.85, duration: 1.2, ease: EASE_OUT }}
      />
      <m.div
        className="pointer-events-none absolute left-1/2 top-[34%] aspect-square w-[20vmin] rounded-full border-[6px] border-[#ffe9a8]"
        style={{ x: "-50%", y: "-50%" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0.2, 9], opacity: [0.9, 0] }}
        transition={{ delay: 1.8, duration: 0.9, ease: "easeOut" }}
      />
      <Shake at={[1.8]} intensity={12}>
        <m.div
          className="absolute left-1/2 top-[7%] w-[clamp(130px,21vw,240px)]"
          style={{ x: "-50%" }}
          initial={{ y: "70vh", opacity: 0 }}
          animate={{ y: ["70vh", "0vh", "0vh", "0vh", "-4vh"], opacity: 1, rotate: [0, 0, 0, -9, 3], scale: [1, 1, 1, 1.06, 0.8] }}
          transition={{ duration: 2.2, times: [0, 0.18, 0.8, 0.84, 1], ease: EASE_OUT, opacity: { duration: 0.2 } }}
        >
          <div className="relative">
            <Gauntlet className="w-full drop-shadow-[0_0_24px_rgb(255_200_80/0.45)]" />
            <svg viewBox="0 0 140 190" aria-hidden="true" className="absolute inset-0 w-full">
              {GEM_SLOTS.map((slot, index) => (
                <m.circle
                  key={index}
                  cx={slot.cx}
                  cy={slot.cy}
                  r={slot.r}
                  fill={GEMS[index]}
                  stroke="#fff"
                  strokeWidth={1.5}
                  style={{ originX: `${slot.cx}px`, originY: `${slot.cy}px`, filter: `drop-shadow(0 0 6px ${GEMS[index]})` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [0, 1.6, 1] }}
                  transition={{ delay: 0.5 + index * 0.18, duration: 0.3 }}
                />
              ))}
            </svg>
          </div>
        </m.div>
        <m.p
          className="doge-text absolute left-[58%] top-[10%] text-[clamp(1.4rem,3.6vw,2.4rem)] text-hydromel"
          style={{ rotate: 10 }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 1, 1] }}
          transition={{ delay: 1.78, duration: 0.9, times: [0, 0.15, 0.7, 1] }}
        >
          *SNAP*
        </m.p>
        <div className="absolute inset-x-0 top-[56%] flex flex-col items-center px-4 text-center">
          <Slam delay={2.05} from={3} className="max-w-[94vw] break-words" style={{ color: "var(--color-rarity-legendary)", fontSize: wordSize(word, { max: 13, cap: 8 }) }}>
            {word}
          </Slam>
          <Rise delay={2.45} className="mt-3 max-w-2xl text-[clamp(1rem,2.6vw,1.45rem)] font-semibold text-parchemin">
            Parfaitement chouffin, comme toute chose devrait l&apos;être.
          </Rise>
        </div>
      </Shake>
      <Burst seed={seed} count={18} x={50} y={30} delay={1.85} duration={1.2} distance={[20, 50]} gravity={14} size={[6, 12]} render={(index) => <div className="aspect-square w-full rounded-full" style={{ background: GEMS[index % GEMS.length], boxShadow: `0 0 8px ${GEMS[index % GEMS.length]}` }} />} />
      <Flash at={1.82} color="#fff4d6" peak={0.35} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */

export default function GeekEgg(props: EggProps) {
  switch (props.variant) {
    case "snap":
      return <FailSnap {...props} />;
    case "moldu":
      return <FailMoldu {...props} />;
    case "choixpeau":
      return <SmallChoixpeau {...props} />;
    case "sabre":
      return <ComboSabre {...props} />;
    case "matrix":
      return <ComboMatrix {...props} />;
    case "patronus":
      return <ComboPatronus {...props} />;
    case "hyperespace":
      return <LegendaryHyperespace {...props} />;
    case "gantelet":
      return <LegendaryGantelet {...props} />;
    default:
      return props.level === "fail" ? <FailSnap {...props} /> : props.level === "small" ? <SmallChoixpeau {...props} /> : <ComboSabre {...props} />;
  }
}
