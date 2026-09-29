"use client";

/**
 * Tribu weeb : mangas, animés, Japon, kawaii.
 * - échec : goutte de sueur géante et lignes de déprime, ou table retournée (╯°□°)╯︵ ┻━┻ ;
 * - petite réaction : scintillements kawaii, cœurs et kaomoji ;
 * - gros combo : « Omae wa mou... » puis case de manga « NANI ?! » (lignes de vitesse, ゴゴゴ), transformation de magical girl ;
 * - légendaire : jauge de ki et détecteur qui explose à plus de 9000, « Senpai a remarqué » sous une tempête de sakura.
 */

import { m } from "motion/react";
import type { CSSProperties } from "react";
import * as sounds from "@/lib/client/tribe-sounds/weeb";
import { Burst, Counter, EASE_OUT, Flash, Pop, Rain, Rise, Shake, Slam, Stage, between, letters, shortWord, usePlan, wordSize } from "../kit";
import type { EggProps } from "../types";

const KAOMOJI_FONT: CSSProperties = { fontFamily: 'system-ui, "Segoe UI Symbol", "Noto Sans", "Noto Sans JP", sans-serif' };

/* ------------------------------------------------------------------ */
/* Dessins                                                             */
/* ------------------------------------------------------------------ */

function SweatDrop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 90" aria-hidden="true" className={className}>
      <path d="M30 4 C38 26 56 44 56 62 C56 78 44 88 30 88 C16 88 4 78 4 62 C4 44 22 26 30 4 Z" fill="#9fd8ff" stroke="#123a5c" strokeWidth={4} strokeLinejoin="round" />
      <path d="M16 60 C16 52 20 46 24 42" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

function Heart({ color = "#ff6fae", className }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 22" aria-hidden="true" className={className ?? "w-full"}>
      <path d="M12 21 C12 21 1.5 14 1.5 7.6 C1.5 4.2 4.1 1.5 7.4 1.5 C9.4 1.5 11 2.6 12 4.2 C13 2.6 14.6 1.5 16.6 1.5 C19.9 1.5 22.5 4.2 22.5 7.6 C22.5 14 12 21 12 21 Z" fill={color} stroke="#5a0f33" strokeWidth={1.4} strokeLinejoin="round" />
      <ellipse cx="7.5" cy="6.5" rx="2.2" ry="1.4" fill="#fff" opacity={0.7} transform="rotate(-30 7.5 6.5)" />
    </svg>
  );
}

function Sparkle({ color = "#fff" }: { color?: string }) {
  return (
    <svg viewBox="-10 -10 20 20" aria-hidden="true" className="w-full">
      <path d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10 Z" fill={color} />
    </svg>
  );
}

function Petal() {
  return (
    <svg viewBox="-10 -12 20 24" aria-hidden="true" className="w-full">
      <path d="M0 11 C-8 3 -7 -8 -2.5 -11 L0 -7.5 L2.5 -11 C7 -8 8 3 0 11 Z" fill="#ffc0db" stroke="#e0609a" strokeWidth={1} />
    </svg>
  );
}

/** Case de manga : fond crème, trame et lignes de vitesse (une seule transition claire, pas de clignotement). */
function MangaPanel({ at }: { at: number }) {
  return (
    <m.div className="absolute inset-0 overflow-hidden bg-[#f4efe6]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: at, duration: 0.14 }}>
      <div className="halftone absolute inset-0 opacity-70" />
      <m.div
        className="speed-lines"
        style={{ "--line-color": "#111" } as CSSProperties}
        initial={{ scale: 1.3, rotate: 0 }}
        animate={{ scale: [1.3, 1, 1.04, 1], rotate: [0, 2, -1, 1] }}
        transition={{ delay: at, duration: 1.6, ease: "easeOut" }}
      />
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
/* Échecs                                                              */
/* ------------------------------------------------------------------ */

function FailGoutte({ word, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.goutte} className="bg-[radial-gradient(circle_at_50%_45%,#241b3d_0%,#0c0916_78%)]">
      <m.div
        className="absolute inset-x-0 top-0 h-[60vh] bg-[repeating-linear-gradient(90deg,rgb(90_80_200/0.35)_0_3px,transparent_3px_22px)] [mask-image:linear-gradient(180deg,#000,transparent)]"
        initial={{ opacity: 0, y: "-20vh" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: EASE_OUT }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="relative">
          <p className="meme-text max-w-[88vw] break-words" style={{ fontSize: wordSize(word, { max: 13, cap: 8 }) }}>
            {word}
          </p>
          <m.div
            className="absolute -right-[0.4em] -top-[0.35em] w-[clamp(44px,7vw,90px)]"
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1], scale: [0, 1.25, 1], y: [0, 0, 26], scaleY: [1, 1, 1.12] }}
            transition={{ delay: 0.35, duration: 1.6, times: [0, 0.12, 1], ease: "easeInOut" }}
          >
            <SweatDrop className="w-full" />
          </m.div>
        </div>
        <div className="mt-6 flex gap-2">
          {[0, 1, 2].map((index) => (
            <Pop key={index} delay={0.95 + index * 0.15} className="size-[clamp(12px,2vw,20px)] rounded-full bg-parchemin" />
          ))}
        </div>
        <Rise delay={1.35} className="mt-5 text-[clamp(1.6rem,4.4vw,2.6rem)] text-parchemin" style={KAOMOJI_FONT}>
          (´・ω・`)
        </Rise>
        <Rise delay={1.6} className="mt-2 max-w-xl text-[clamp(1rem,2.4vw,1.35rem)] font-semibold text-brume">
          Sérieusement ? Pas chouffin. Même pas un peu, baka.
        </Rise>
      </div>
    </Stage>
  );
}

function FailTable({ word, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.table} className="bg-[radial-gradient(circle_at_50%_45%,#2a1633_0%,#0c0712_78%)]">
      <Shake at={[0.75]} intensity={12}>
        <div className="absolute inset-x-0 top-[26%] flex items-center justify-center gap-2 px-2" style={KAOMOJI_FONT}>
          <m.p className="whitespace-nowrap text-[clamp(2.6rem,9vw,6.5rem)] font-bold text-parchemin" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            (╯°□°)╯
          </m.p>
          <m.p
            className="whitespace-nowrap text-[clamp(2.6rem,9vw,6.5rem)] font-bold text-hydromel"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: ["0vw", "0vw", "18vw", "48vw"], y: ["0vh", "0vh", "-22vh", "40vh"], rotate: [0, 0, 300, 560], opacity: [1, 1, 1, 0] }}
            transition={{ duration: 1.3, times: [0, 0.2, 0.5, 1], ease: "easeIn" }}
          >
            ︵ ┻━┻
          </m.p>
        </div>
        <div className="absolute inset-x-0 top-[48%] flex flex-col items-center px-4 text-center">
          <Slam delay={0.45} from={2.6} className="manga-text text-[clamp(2.6rem,10vw,6.5rem)] [-webkit-text-stroke:0.07em_#fff]" style={{ color: "#111" }}>
            Pas chouffin !!
          </Slam>
        </div>
      </Shake>
      <div className="absolute inset-x-0 bottom-[12vh] flex flex-col items-center px-4 text-center">
        <Rise delay={1.8} className="whitespace-nowrap text-[clamp(1.6rem,4.6vw,2.8rem)] text-parchemin" style={KAOMOJI_FONT}>
          ┬─┬ノ( º _ ºノ)
        </Rise>
        <Rise delay={2} className="mt-2 max-w-xl text-[clamp(1rem,2.4vw,1.3rem)] font-semibold text-brume">
          Bon, on range la table. « {shortWord(word, 30)} », c&apos;est non.
        </Rise>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Petite réaction                                                     */
/* ------------------------------------------------------------------ */

function SmallKawaii({ seed, durationMs, onDone }: EggProps) {
  const hearts = usePlan(seed, (random) => Array.from({ length: 5 }, (_, index) => ({ index, x: between(random, 30, 70), size: between(random, 20, 36), delay: between(random, 0.1, 0.6) })));
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.kawaii} mode="light">
      <m.div className="absolute inset-x-0 top-[30%] h-[36vh]" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.55, times: [0, 0.08, 0.85, 1] }}>
        <Burst seed={seed} count={12} x={50} y={45} delay={0.1} duration={1} distance={[12, 28]} size={[14, 26]} spin={90} render={(index) => <Sparkle color={["#fff", "#ffe27a", "#ffb3d6"][index % 3]} />} />
        {hearts.map((heart) => (
          <m.div
            key={heart.index}
            className="absolute top-[70%]"
            style={{ left: `${heart.x}%`, width: heart.size }}
            initial={{ opacity: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], y: "-22vh", scale: [0.4, 1, 1], x: [0, 10, -10, 0] }}
            transition={{ delay: heart.delay, duration: 1.1, ease: "easeOut" }}
          >
            <Heart />
          </m.div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Pop delay={0.12} className="text-[clamp(2rem,6vw,3.4rem)] font-bold text-white [text-shadow:0_3px_0_#b0336f,0_0_14px_rgb(255_111_174/0.8)]">
            <span style={KAOMOJI_FONT}>(◕‿◕✿)</span>
          </Pop>
          <Pop delay={0.35} rotate={-6} className="doge-text mt-1 text-[clamp(1.6rem,5vw,2.6rem)] text-[#ffb3d6]">
            kawaii~ ♡
          </Pop>
        </div>
      </m.div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Gros combos                                                         */
/* ------------------------------------------------------------------ */

function ComboNani({ word, seed, durationMs, onDone }: EggProps) {
  const subtitle = "« Omae wa mou... chouffin. »";
  const gogo = usePlan(seed, (random) =>
    Array.from({ length: 8 }, (_, index) => {
      const left = index % 2 === 0;
      return { index, x: left ? between(random, 3, 22) : between(random, 72, 90), y: between(random, 18, 82), size: between(random, 2, 3.6), rotate: between(random, -16, 16), delay: 1.1 + index * 0.1 };
    }),
  );
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.nani} className="bg-[#0d0a14]">
      <m.p
        className="absolute inset-x-0 bottom-[16vh] px-4 text-center text-[clamp(1.3rem,3.6vw,2.2rem)] font-bold text-[#ffe14a] [text-shadow:0_2px_0_#000,0_-2px_0_#000,2px_0_0_#000,-2px_0_0_#000]"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: 0.95, times: [0, 0.9, 1] }}
      >
        {letters(subtitle).map(({ char, index }) => (
          <m.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 + index * 0.028, duration: 0.01 }}>
            {char}
          </m.span>
        ))}
      </m.p>
      <MangaPanel at={0.9} />
      <Shake at={[0.95, 1.4]} intensity={12}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <Slam delay={0.92} from={3.4} rotate={-12} settle={-5} className="manga-text text-[clamp(4.2rem,19vw,13rem)]" style={{ color: "#111" }}>
            Nani ?!
          </Slam>
          <Rise delay={1.3} className="manga-text mt-2 max-w-[92vw] break-words" style={{ color: "#111", fontSize: wordSize(word, { max: 9, cap: 5.5, min: 1.8 }) }}>
            {word}
          </Rise>
        </div>
        {gogo.map((glyph) => (
          <m.p
            key={glyph.index}
            className="absolute font-black leading-none text-[#6b2fa3] [-webkit-text-stroke:0.06em_#fff] [paint-order:stroke_fill]"
            style={{ ...KAOMOJI_FONT, left: `${glyph.x}%`, top: `${glyph.y}%`, fontSize: `${glyph.size}rem`, rotate: glyph.rotate }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, 0, -6, 0, -6, 0], x: [0, 0, -3, 3, -3, 0] }}
            transition={{ delay: glyph.delay, duration: 1.4 }}
          >
            ゴ
          </m.p>
        ))}
      </Shake>
    </Stage>
  );
}

function Ribbon({ d, color, delay }: { d: string; color: string; delay: number }) {
  return (
    <m.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={14}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0.8] }}
      transition={{ delay, duration: 1.2, ease: "easeInOut" }}
    />
  );
}

function ComboHenshin({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage
      durationMs={durationMs}
      onDone={onDone}
      sound={sounds.henshin}
      style={{ background: "radial-gradient(circle at 50% 50%, #ff7ec4 0%, #b03ab8 45%, #3a1260 100%)" }}
    >
      <m.svg viewBox="-200 -200 400 400" aria-hidden="true" className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin]" style={{ x: "-50%", y: "-50%" }} initial={{ rotate: 0 }} animate={{ rotate: 200 }} transition={{ duration: 2.9, ease: "easeOut" }}>
        <Ribbon d="M-180 60 C-120 -160 120 -160 160 -20 C190 90 40 170 -40 120" color="#fff0f8" delay={0.1} />
        <Ribbon d="M170 -80 C100 150 -120 160 -160 30 C-190 -90 -30 -170 50 -110" color="#ffe27a" delay={0.3} />
        <Ribbon d="M-60 -180 C120 -150 180 40 70 140 C-20 210 -150 120 -140 20" color="#9ff0ff" delay={0.5} />
      </m.svg>
      <Burst seed={seed} count={18} x={50} y={50} delay={1.35} duration={1.1} distance={[20, 48]} size={[14, 28]} spin={120} render={(index) => <Sparkle color={["#fff", "#ffe27a", "#9ff0ff"][index % 3]} />} />
      <div className="absolute inset-x-0 top-[9%] px-4 text-center">
        <Rise delay={0.15} className="doge-text text-[clamp(1.3rem,3.6vw,2.2rem)] text-white [text-shadow:0_3px_0_#7a1a6a]">
          Par le pouvoir de la chouffinitude !
        </Rise>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="relative grid place-items-center">
          <m.div className="col-start-1 row-start-1 w-[clamp(160px,30vw,340px)]" initial={{ scale: 0, rotate: -30, opacity: 0 }} animate={{ scale: [0, 1.2, 1], rotate: 0, opacity: 1 }} transition={{ delay: 1.3, duration: 0.5 }}>
            <Heart color="#ffd1e6" />
          </m.div>
          <m.p
            className="relative z-10 col-start-1 row-start-1 meme-text max-w-[88vw] break-words text-white [text-shadow:0_0_20px_rgb(255_255_255/0.8),0_0.05em_0_#000]"
            style={{ fontSize: wordSize(word, { max: 10, cap: 6, min: 1.8 }) }}
            initial={{ scaleX: 0.2, opacity: 0 }}
            animate={{ scaleX: [0.2, 1, -1, 1, -1, 1, 1], opacity: [0, 1, 1, 1, 1, 1, 1], scale: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 1] }}
            transition={{ delay: 0.3, duration: 1.2, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1] }}
          >
            {shortWord(word, 20)}-chan ✦
          </m.p>
        </div>
        <Pop delay={1.5} rotate={-4} className="manga-text mt-4 text-[clamp(1.8rem,6vw,3.6rem)]" style={{ color: "#fff" }}>
          <span className="[-webkit-text-stroke:0.07em_#7a1a6a] [paint-order:stroke_fill]">Transformation !</span>
        </Pop>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Légendaires                                                         */
/* ------------------------------------------------------------------ */

function LegendaryNeufMille({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.neufmille} className="bg-[radial-gradient(circle_at_50%_60%,#1b2446_0%,#070a16_80%)]">
      <Rain seed={seed} count={26} direction="up" delay={[0.1, 2.6]} duration={[0.9, 1.5]} size={[4, 9]} sway={1} spin={0} render={() => <div className="aspect-[1/3] w-full rounded-full bg-[#ffe27a] shadow-[0_0_8px_#ffd23a]" />} />
      {[0, 0.2, 0.4].map((lag) => (
        <m.div
          key={lag}
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[18vmin] rounded-full border-[6px] border-[#ffe27a]"
          style={{ x: "-50%", y: "-50%" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0.3, 9], opacity: [0.9, 0] }}
          transition={{ delay: 1.7 + lag, duration: 0.9, ease: "easeOut" }}
        />
      ))}
      <Shake at={[1.7, 2.1]} intensity={16}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="relative grid place-items-center">
            <m.div
              className="col-start-1 row-start-1 h-[42vmin] w-[70vmin] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_236_140/0.85),rgb(255_190_40/0.45)_55%,transparent)]"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 0.8, 0.75, 0.9, 0.85, 1, 1.5, 1.3], opacity: [0, 0.8, 0.8, 0.9, 0.9, 1, 1, 0.8] }}
              transition={{ duration: 2.4, times: [0, 0.2, 0.3, 0.45, 0.55, 0.7, 0.75, 1] }}
            />
            <m.p className="meme-text relative z-10 col-start-1 row-start-1 max-w-[88vw] break-words" style={{ fontSize: wordSize(word, { max: 12, cap: 7.5 }) }} animate={{ x: [0, -2, 2, -3, 3, -2, 2, 0] }} transition={{ delay: 0.6, duration: 1.1 }}>
              {word}
            </m.p>
          </div>
          <Slam delay={1.7} from={3.2} className="mt-4 text-[clamp(1.8rem,7vw,5rem)]" style={{ color: "var(--color-rarity-legendary)" }}>
            C&apos;est plus de 9000 !!!
          </Slam>
        </div>
        <m.div
          className="absolute right-[4vw] top-[8vh] w-[min(18rem,44vw)] rounded-md border-2 border-[#3dff6a] bg-[rgb(61_255_106/0.14)] p-3 font-mono text-[#8dffa8] shadow-[0_0_24px_rgb(61_255_106/0.3)]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0, rotate: [0, 0, 0, -6], y: [0, 0, 0, 30] }}
          transition={{ opacity: { delay: 0.3, duration: 0.2 }, x: { delay: 0.3, duration: 0.3 }, rotate: { delay: 0.3, duration: 1.8, times: [0, 0.7, 0.78, 1] }, y: { delay: 0.3, duration: 1.8, times: [0, 0.7, 0.78, 1] } }}
        >
          <p className="text-[clamp(0.6rem,1.4vw,0.8rem)] uppercase tracking-widest">Niveau de chouffinitude</p>
          <p className="text-[clamp(1.4rem,4vw,2.6rem)] font-bold tabular-nums leading-tight">
            <Counter from={0} to={9001} delay={0.5} duration={1.15} ease="easeIn" format={(value) => (value >= 9001 ? "9001" : String(Math.round(value)).padStart(4, "0"))} />
          </p>
          <m.svg viewBox="0 0 100 60" aria-hidden="true" className="absolute inset-0 h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.68, duration: 0.05 }}>
            <path d="M58 0 L50 22 L62 30 L44 60 M50 22 L30 18 M62 30 L90 40" fill="none" stroke="#e8fff0" strokeWidth={1.4} />
          </m.svg>
        </m.div>
        <div className="absolute inset-x-[10vw] bottom-[9vh]">
          <p className="mb-1 font-display text-[clamp(0.9rem,2vw,1.2rem)] uppercase tracking-[0.2em] text-hydromel">Jauge de ki</p>
          <div className="h-[clamp(14px,2.4vh,22px)] overflow-hidden rounded-full border-2 border-black bg-black/60 shadow-[0_0_0_2px_#ffe27a]">
            <m.div className="h-full origin-left bg-[linear-gradient(90deg,#ff8a1a,#ffe27a,#fff6cf)]" initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 1] }} transition={{ delay: 0.2, duration: 1.5, times: [0, 0.95, 1], ease: "easeIn" }} />
          </div>
        </div>
      </Shake>
      <Flash at={1.7} color="#fff6d6" peak={0.4} />
    </Stage>
  );
}

function LegendarySenpai({ word, seed, durationMs, onDone }: EggProps) {
  const beat = { scale: [1, 1, 1.14, 1, 1.12, 1, 1, 1.16, 1, 1.12, 1] };
  const beatTimes = [0, 0.13, 0.16, 0.2, 0.24, 0.28, 0.46, 0.5, 0.54, 0.58, 0.62];
  return (
    <Stage
      durationMs={durationMs}
      onDone={onDone}
      sound={sounds.senpai}
      style={{ background: "radial-gradient(circle at 50% 45%, #7a2a6a 0%, #3a0f3a 60%, #1a0718 100%)" }}
    >
      <Rain seed={seed} count={38} delay={[0, 2.4]} duration={[1.6, 2.6]} size={[14, 26]} sway={6} drift={-24} spin={420} render={() => <Petal />} />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="relative grid place-items-center">
          <m.div className="col-start-1 row-start-1 w-[clamp(240px,50vw,560px)]" initial={{ scale: 0, opacity: 0 }} animate={{ opacity: 0.95, ...beat }} transition={{ opacity: { duration: 0.3 }, scale: { duration: 3.4, times: beatTimes } }}>
            <Heart color="#ff5fa2" />
          </m.div>
          <div className="relative z-10 col-start-1 row-start-1 flex flex-col items-center">
            <Slam delay={0.45} from={2.4} rotate={-6} className="text-[clamp(1.6rem,5.6vw,3.6rem)]">
              Senpai a remarqué
            </Slam>
            <Slam delay={0.8} from={3} rotate={-4} className="mt-1 max-w-[88vw] break-words" style={{ color: "var(--color-rarity-legendary)", fontSize: wordSize(word, { max: 12, cap: 7.5 }) }}>
              {word}
            </Slam>
            <Pop delay={1.1} className="meme-text text-[clamp(2rem,6vw,4rem)]">
              !!!
            </Pop>
          </div>
        </div>
        <Rise delay={1.45} className="mt-4 text-[clamp(1.4rem,4vw,2.4rem)] font-bold text-[#ffd1e6]" style={KAOMOJI_FONT}>
          (⁄ ⁄&gt;⁄ ▽ ⁄&lt;⁄ ⁄)
        </Rise>
        <Rise delay={1.7} className="doge-text mt-1 text-[clamp(1.1rem,3vw,1.7rem)] text-white">
          doki doki, légendaire
        </Rise>
      </div>
      <Burst seed={seed + 1} count={14} x={50} y={46} delay={0.8} duration={1.2} distance={[24, 46]} size={[14, 24]} spin={90} render={(index) => <Sparkle color={["#fff", "#ffe27a", "#ffb3d6"][index % 3]} />} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */

export default function WeebEgg(props: EggProps) {
  switch (props.variant) {
    case "goutte":
      return <FailGoutte {...props} />;
    case "table":
      return <FailTable {...props} />;
    case "kawaii":
      return <SmallKawaii {...props} />;
    case "nani":
      return <ComboNani {...props} />;
    case "henshin":
      return <ComboHenshin {...props} />;
    case "neufmille":
      return <LegendaryNeufMille {...props} />;
    case "senpai":
      return <LegendarySenpai {...props} />;
    default:
      return props.level === "fail" ? <FailGoutte {...props} /> : props.level === "small" ? <SmallKawaii {...props} /> : <ComboNani {...props} />;
  }
}
