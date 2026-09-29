"use client";

/**
 * Tribu rôliste : JdR, d20, médiéval, Table Ronde.
 * - échec : le d20 (en vraie 3D) roule et tombe sur 1, échec critique ;
 * - petite réaction : un parchemin se déroule, le sceau du MJ s'écrase dessus ;
 * - gros combo : jet de d20 réussi (15 à 19), adoubement sous les bannières et les trompettes ;
 * - légendaire : 20 naturel et coup critique, blason qui se compose avec couronne et devise.
 */

import { m, type MotionStyle } from "motion/react";
import type { CSSProperties } from "react";
import * as sounds from "@/lib/client/tribe-sounds/roliste";
import { TankardLogo } from "../../art";
import { D20 } from "../D20";
import { FlatD20 } from "../icons";
import { Burst, EASE_OUT, Flash, Pop, Rays, Rise, Shake, Slam, Stage, shortWord, usePlan, wordSize } from "../kit";
import type { EggProps } from "../types";

/** Table de jeu : feutrine sombre et quadrillage de carte de combat. */
const TABLE_BG: CSSProperties = {
  background:
    "repeating-linear-gradient(0deg, rgb(255 255 255 / 0.035) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.035) 0 1px, transparent 1px 48px), radial-gradient(circle at 50% 45%, #1f3a2c 0%, #0b1610 80%)",
};

const HALL_BG: CSSProperties = {
  background:
    "radial-gradient(60% 45% at 50% 0%, rgb(255 190 90 / 0.3), transparent 70%), repeating-linear-gradient(0deg, rgb(0 0 0 / 0.25) 0 2px, transparent 2px 38px), repeating-linear-gradient(90deg, rgb(0 0 0 / 0.18) 0 2px, transparent 2px 76px), radial-gradient(circle at 50% 50%, #3a3040 0%, #151018 80%)",
};

const DIE_SIZE = "clamp(150px, 26vmin, 250px)";

/** Taille du dé en px, calculée une fois selon l'écran (le d20 a besoin d'un nombre). */
function useDieSize(): number {
  return usePlan(0, () => {
    if (typeof window === "undefined") return 200;
    const vmin = Math.min(window.innerWidth, window.innerHeight);
    return Math.round(Math.min(250, Math.max(150, vmin * 0.26)));
  });
}

/** Le d20 qui tombe du haut, roule et rebondit avant de s'immobiliser. */
function RollingDie({ value, seed, color, ink, glow, delay = 0.2, duration = 1.5 }: { value: number; seed: number; color: string; ink?: string; glow?: string; delay?: number; duration?: number }) {
  const size = useDieSize();
  return (
    <m.div
      className="relative"
      style={{ width: DIE_SIZE }}
      initial={{ x: "-38vw", y: "-70vh" }}
      animate={{ x: ["-38vw", "-8vw", "4vw", "0vw"], y: ["-70vh", "0vh", "-9vh", "0vh", "-2vh", "0vh"] }}
      transition={{
        x: { delay, duration, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        y: { delay, duration, times: [0, 0.38, 0.55, 0.72, 0.85, 1], ease: "easeIn" },
      }}
    >
      {glow ? (
        <m.div
          className="absolute inset-[-40%] rounded-full"
          style={{ background: `radial-gradient(closest-side, ${glow}, transparent)` }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0.8], scale: [0.4, 1.2, 1] }}
          transition={{ delay: delay + duration, duration: 0.6 }}
        />
      ) : null}
      <div className="relative grid place-items-center">
        <D20 value={value} seed={seed} size={size} color={color} resultInk={ink} delay={delay} duration={duration} />
      </div>
    </m.div>
  );
}

const FAIL_LINES = [
  (word: string) => `Tu glisses sur « ${word} » et tu perds ton tour.`,
  (word: string) => `« ${word} » : ton personnage trébuche dans la taverne.`,
  (word: string) => `Le MJ soupire. « ${word} », vraiment ?`,
];

/* ------------------------------------------------------------------ */
/* Échec                                                               */
/* ------------------------------------------------------------------ */

function FailEchec({ word, seed, durationMs, onDone }: EggProps) {
  const line = usePlan(seed, (random) => FAIL_LINES[Math.floor(random() * FAIL_LINES.length)](shortWord(word, 30)));
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.echec} style={TABLE_BG}>
      <Shake at={[1.45]} intensity={6}>
        <div className="absolute inset-x-0 top-[12%] flex justify-center">
          <RollingDie value={1} seed={seed} color="#5a5f6b" ink="#ff8a7a" delay={0.2} duration={1.3} />
        </div>
        <div className="absolute inset-x-0 top-[56%] flex flex-col items-center px-4 text-center">
          <Slam delay={1.55} from={2.6} className="text-[clamp(2.6rem,10vw,6.6rem)]" style={{ color: "#ff6b5a" }}>
            Échec critique
          </Slam>
          <Pop delay={1.8} className="mt-2 rounded-md border-2 border-[#ff6b5a] px-3 py-1 font-display text-[clamp(1rem,2.6vw,1.5rem)] uppercase tracking-[0.2em] text-[#ffb3a8]">
            1 naturel
          </Pop>
          <Rise delay={2} className="mt-3 max-w-xl text-[clamp(1rem,2.4vw,1.35rem)] font-semibold text-parchemin">
            {line}
          </Rise>
        </div>
      </Shake>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Petite réaction                                                     */
/* ------------------------------------------------------------------ */

function WaxSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path d="M50 4 C62 6 66 2 74 10 C82 16 90 20 92 32 C96 44 98 50 94 62 C92 74 86 84 74 90 C64 96 56 98 44 96 C32 94 22 90 14 80 C6 70 2 60 4 46 C6 32 10 22 22 12 C32 6 40 2 50 4 Z" fill="#9e1b1b" stroke="#5a0a0a" strokeWidth={3} />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#c7433a" strokeWidth={3} />
      <path d="M36 38 H60 V68 C60 72 57 74 54 74 H42 C39 74 36 72 36 68 Z M60 44 C70 44 70 60 60 60" fill="none" stroke="#e8756a" strokeWidth={4} strokeLinejoin="round" />
      <path d="M36 38 C36 30 44 28 48 32 C52 26 62 28 60 38" fill="#e8756a" />
    </svg>
  );
}

function SmallParchemin({ score, durationMs, onDone }: EggProps) {
  // Largeur fixée au montage : les rouleaux glissent en `transform`, pas en `left`.
  const width = usePlan(1, () => (typeof window === "undefined" ? 420 : Math.round(Math.min(480, window.innerWidth * 0.88))));
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.parchemin} mode="light">
      <m.div
        className="absolute left-1/2 top-[36%]"
        style={{ x: "-50%", width }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.85, times: [0, 0.06, 0.88, 1] }}
      >
        <div className="relative">
          <m.div
            className="parchment relative rounded-sm px-6 py-4 text-center shadow-[0_12px_30px_rgb(0_0_0/0.5)]"
            initial={{ clipPath: "inset(0 50% 0 50%)" }}
            animate={{ clipPath: "inset(0 0% 0 0%)" }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <p className="font-display text-[clamp(1.2rem,3.6vw,1.8rem)] uppercase tracking-[0.06em]">Le Maître du Jeu approuve</p>
            <p className="mt-1 text-[clamp(1rem,2.6vw,1.25rem)] font-bold">+{score} points d&apos;expérience</p>
          </m.div>
          {[-1, 1].map((direction) => (
            <m.div
              key={direction}
              className="absolute left-1/2 top-[-8%] -ml-[10px] h-[116%] w-[20px] rounded-full bg-[linear-gradient(90deg,#b8894a,#f3e2b8_45%,#8a5f2a)] shadow-[0_4px_10px_rgb(0_0_0/0.4)]"
              initial={{ x: 0 }}
              animate={{ x: direction * (width / 2) }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            />
          ))}
          <m.div
            className="absolute -bottom-[26%] right-[6%] w-[clamp(56px,11vw,86px)]"
            initial={{ scale: 2.6, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: -12 }}
            transition={{ delay: 0.85, type: "spring", stiffness: 520, damping: 18 }}
          >
            <WaxSeal className="w-full drop-shadow-[0_4px_0_rgb(0_0_0/0.35)]" />
          </m.div>
        </div>
      </m.div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Gros combos                                                         */
/* ------------------------------------------------------------------ */

function ComboJet({ word, score, seed, durationMs, onDone }: EggProps) {
  const roll = usePlan(seed, (random) => 15 + Math.floor(random() * 5));
  const modifier = Math.max(1, Math.floor((score - 50) / 10));
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.jet} style={TABLE_BG}>
      <Shake at={[1.45]} intensity={5}>
        <div className="absolute inset-x-0 top-[10%] flex justify-center">
          <RollingDie value={roll} seed={seed} color="#2f6fd6" glow="rgb(120 180 255 / 0.45)" delay={0.2} duration={1.3} />
        </div>
        <div className="absolute inset-x-0 top-[55%] flex flex-col items-center px-4 text-center">
          <Slam delay={1.6} from={2.4} className="text-[clamp(2.6rem,10vw,6.4rem)] text-hydromel">
            Réussite !
          </Slam>
          <Rise delay={1.85} className="mt-2 font-display text-[clamp(1.1rem,3vw,1.8rem)] uppercase tracking-[0.08em] text-parchemin">
            Jet de chouffinitude : {roll} + {modifier} = {roll + modifier}
          </Rise>
          <Rise delay={2.05} className="mt-1 max-w-xl text-[clamp(1rem,2.4vw,1.3rem)] font-semibold text-brume">
            « {shortWord(word, 30)} » passe la difficulté 15 haut la main.
          </Rise>
          <Pop delay={2.3} className="mt-3 rounded-full border-2 border-[#3a2410] bg-[#f3e2b8] px-4 py-1 font-display text-[clamp(0.95rem,2.4vw,1.3rem)] uppercase text-[#3a2410] shadow-[0_4px_0_#3a2410]">
            +{score} XP · Niveau supérieur
          </Pop>
        </div>
      </Shake>
    </Stage>
  );
}

function Banner({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 80 200" aria-hidden="true" className="w-full">
        <rect x="0" y="0" width="80" height="8" rx="3" fill="#6a4a1a" />
        <path d="M6 8 H74 V190 L40 168 L6 190 Z" fill="#9e1b1b" stroke="#3a0808" strokeWidth={3} />
        <path d="M14 8 V172 M66 8 V172" stroke="#ffcf3a" strokeWidth={3} />
      </svg>
      <div className="absolute left-1/2 top-[36%] w-[46%] -translate-x-1/2">
        <TankardLogo className="w-full" />
      </div>
    </div>
  );
}

function Trumpet({ flip = false, className }: { flip?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 220 80" aria-hidden="true" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M4 26 H150 L200 6 V74 L150 54 H4 Z" fill="#e0a83a" stroke="#3a2410" strokeWidth={3} strokeLinejoin="round" />
      <path d="M4 32 H148 M4 48 H148" stroke="#fff0b8" strokeWidth={2} opacity={0.7} />
      <path d="M40 56 H120 V78 H40 Z" fill="#1f4fa8" stroke="#0a1f4a" strokeWidth={2} />
      <path d="M40 56 H60 V67 H40 Z M80 56 H100 V67 H80 Z M60 67 H80 V78 H60 Z M100 67 H120 V78 H100 Z" fill="#ffcf3a" />
    </svg>
  );
}

function Sword({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 220" aria-hidden="true" className={className}>
      <path d="M20 4 L27 20 V160 H13 V20 Z" fill="#e8e8f0" stroke="#3a3a48" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M20 12 V156" stroke="#b8b8c8" strokeWidth={2} />
      <rect x="2" y="158" width="36" height="9" rx="3" fill="#c9922a" stroke="#3a2410" strokeWidth={2} />
      <rect x="15" y="167" width="10" height="34" rx="2" fill="#5a3418" stroke="#2a1508" strokeWidth={2} />
      <circle cx="20" cy="207" r="8" fill="#c9922a" stroke="#3a2410" strokeWidth={2} />
    </svg>
  );
}

function Note({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 30" aria-hidden="true" className="w-full">
      <path d="M8 24 V4 L22 1 V20" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx="5" cy="24" rx="5" ry="4" fill={color} />
      <ellipse cx="19" cy="20" rx="5" ry="4" fill={color} />
    </svg>
  );
}

function ComboAdoubement({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.adoubement} style={HALL_BG}>
      {(["left", "right"] as const).map((side, index) => (
        <m.div
          key={side}
          className="absolute top-0"
          style={{ [side]: "6vw", width: "clamp(56px, 9vw, 110px)" } as CSSProperties}
          initial={{ y: "-60vh" }}
          animate={{ y: 0, rotate: [0, index ? -4 : 4, index ? 3 : -3, 0] }}
          transition={{ y: { delay: 0.05 + index * 0.1, type: "spring", stiffness: 200, damping: 16 }, rotate: { delay: 0.4, duration: 1.6 } }}
        >
          <Banner className="relative w-full drop-shadow-[0_10px_18px_rgb(0_0_0/0.5)]" />
        </m.div>
      ))}
      {(["left", "right"] as const).map((side, index) => (
        <m.div
          key={`t-${side}`}
          className="absolute top-[58%] w-[clamp(140px,26vw,300px)]"
          style={{ [side]: "-2vw", rotate: index ? 18 : -18 } as MotionStyle}
          initial={{ x: index ? "40vw" : "-40vw" }}
          animate={{ x: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: EASE_OUT }}
        >
          <Trumpet flip={index === 1} className="w-full drop-shadow-[0_6px_0_rgb(0_0_0/0.35)]" />
        </m.div>
      ))}
      <Burst seed={seed} count={8} x={18} y={52} delay={0.55} duration={1.4} distance={[14, 30]} angle={[240, 320]} gravity={-8} size={[16, 26]} spin={40} render={() => <Note color="#ffcf3a" />} />
      <Burst seed={seed + 1} count={8} x={82} y={52} delay={0.7} duration={1.4} distance={[14, 30]} angle={[220, 300]} gravity={-8} size={[16, 26]} spin={40} render={() => <Note color="#ffcf3a" />} />

      <div className="absolute inset-x-0 top-[24%] flex flex-col items-center px-4 text-center">
        <Rise delay={0.9} className="font-display text-[clamp(1.1rem,3vw,1.9rem)] uppercase tracking-[0.2em] text-hydromel">
          Relève-toi, Sire
        </Rise>
        <div className="relative mt-2">
          <Slam delay={1.05} from={2.2} rotate={-3} settle={0} className="max-w-[80vw] break-words" style={{ fontSize: wordSize(word, { max: 11, cap: 7 }) }}>
            {word}
          </Slam>
          <m.div
            className="absolute right-[-12%] top-[-120%] w-[clamp(34px,5vw,56px)]"
            style={{ originX: 0.5, originY: 0.9 }}
            initial={{ y: "-60vh", rotate: 40 }}
            animate={{ y: ["-60vh", "0vh", "0vh", "0vh", "0vh", "-60vh"], rotate: [40, 40, 62, 40, 62, 40] }}
            transition={{ delay: 0.9, duration: 1.9, times: [0, 0.2, 0.25, 0.42, 0.47, 1], ease: "easeInOut" }}
          >
            <Sword className="w-full rotate-180 drop-shadow-[0_6px_0_rgb(0_0_0/0.35)]" />
          </m.div>
        </div>
        <Rise delay={1.9} className="mt-4 max-w-2xl font-display text-[clamp(1.1rem,3vw,1.8rem)] uppercase tracking-[0.06em] text-parchemin [text-shadow:0_2px_0_#000]">
          Chevalier de l&apos;Ordre de la Chouffe
        </Rise>
        <Rise delay={2.2} className="mt-1 text-[clamp(0.95rem,2.2vw,1.2rem)] italic text-brume">
          « C&apos;est pas faux. »
        </Rise>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Légendaires                                                         */
/* ------------------------------------------------------------------ */

function LegendaryVingt({ word, seed, durationMs, onDone }: EggProps) {
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.vingt} style={TABLE_BG}>
      <Rays color="rgb(255 207 58 / 0.2)" delay={1.7} spin={40} duration={1.9} />
      <Shake at={[1.7]} intensity={10}>
        <div className="absolute inset-x-0 top-[9%] flex justify-center">
          <RollingDie value={20} seed={seed} color="#d4a017" ink="#fffbe8" glow="rgb(255 215 90 / 0.7)" delay={0.2} duration={1.5} />
        </div>
        <div className="absolute inset-x-0 top-[55%] flex flex-col items-center px-4 text-center">
          <Slam delay={1.8} from={3} className="text-[clamp(2.8rem,11vw,7.4rem)]" style={{ color: "var(--color-rarity-legendary)" }}>
            Coup critique !
          </Slam>
          <Pop delay={2.1} className="mt-2 rounded-md border-2 border-hydromel bg-black/40 px-3 py-1 font-display text-[clamp(1.1rem,3vw,1.8rem)] uppercase tracking-[0.2em] text-hydromel">
            20 naturel · « {shortWord(word, 24)} »
          </Pop>
          <Rise delay={2.4} className="mt-3 max-w-xl text-[clamp(1rem,2.4vw,1.35rem)] font-semibold text-parchemin">
            Le MJ en lâche ses dés. Légendaire.
          </Rise>
        </div>
      </Shake>
      <Burst seed={seed + 3} count={20} x={50} y={30} delay={1.75} duration={1.2} distance={[20, 50]} gravity={14} size={[18, 30]} render={() => <FlatD20 className="w-full" />} />
      <Flash at={1.72} color="#fff4c8" peak={0.3} />
    </Stage>
  );
}

function Crown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" aria-hidden="true" className={className}>
      <path d="M8 62 L4 16 L32 38 L60 6 L88 38 L116 16 L112 62 Z" fill="#ffcf3a" stroke="#6a4400" strokeWidth={4} strokeLinejoin="round" />
      <rect x="8" y="56" width="104" height="12" rx="3" fill="#e0a520" stroke="#6a4400" strokeWidth={3} />
      <circle cx="60" cy="40" r="6" fill="#c1121f" stroke="#6a4400" strokeWidth={2} />
      <circle cx="30" cy="48" r="4" fill="#2f6fd6" />
      <circle cx="90" cy="48" r="4" fill="#2f6fd6" />
    </svg>
  );
}

function HopCone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 52" aria-hidden="true" className={className}>
      <path d="M20 2 V8" stroke="#2a4a12" strokeWidth={3} strokeLinecap="round" />
      {[10, 20, 30, 40].map((y, row) => (
        <g key={y}>
          <path d={`M${8 + row} ${y} Q20 ${y + 12} ${32 - row} ${y}`} fill="#9ccc48" stroke="#2a4a12" strokeWidth={2} />
        </g>
      ))}
    </svg>
  );
}

const QUARTERS = [
  { fill: "#9e1b1b", x: 0, y: 0 },
  { fill: "#d4a017", x: 1, y: 0 },
  { fill: "#1f4fa8", x: 0, y: 1 },
  { fill: "#2f7a3a", x: 1, y: 1 },
];

function LegendaryBlason({ word, seed, durationMs, onDone }: EggProps) {
  const shieldPath = "M10 6 H190 V110 C190 170 140 206 100 222 C60 206 10 170 10 110 Z";
  return (
    <Stage durationMs={durationMs} onDone={onDone} sound={sounds.blason} style={{ background: "radial-gradient(60% 50% at 50% 30%, rgb(60 90 200 / 0.4), transparent 70%), radial-gradient(circle at 50% 45%, #1a1a3a 0%, #08081a 80%)" }}>
      <Rays color="rgb(255 207 58 / 0.16)" delay={0.2} spin={36} duration={3.3} />
      <Rise delay={0.05} className="absolute inset-x-0 top-[3.5vh] text-center font-display text-[clamp(1.2rem,3.4vw,2.2rem)] uppercase tracking-[0.3em] text-hydromel [text-shadow:0_2px_0_#000]">
        Oyez, oyez !
      </Rise>
      <div className="absolute inset-x-0 top-[19%] flex flex-col items-center">
        <div className="relative w-[clamp(140px,22vw,230px)]">
          <m.div className="absolute -top-[26%] left-1/2 w-[62%]" style={{ x: "-50%" }} initial={{ y: "-50vh", rotate: -20 }} animate={{ y: 0, rotate: 0 }} transition={{ delay: 1.15, type: "spring", stiffness: 260, damping: 14 }}>
            <Crown className="w-full drop-shadow-[0_0_14px_rgb(255_207_58/0.6)]" />
          </m.div>
          <m.div initial={{ y: "-70vh" }} animate={{ y: 0 }} transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 16 }}>
            <svg viewBox="0 0 200 228" aria-hidden="true" className="w-full drop-shadow-[0_12px_24px_rgb(0_0_0/0.6)]">
              <defs>
                <clipPath id={`shield-${seed}`}>
                  <path d={shieldPath} />
                </clipPath>
              </defs>
              <path d={shieldPath} fill="#2a2a3a" />
              <g clipPath={`url(#shield-${seed})`}>
                {QUARTERS.map((quarter, index) => (
                  <m.rect
                    key={index}
                    x={quarter.x * 100}
                    y={quarter.y * 114}
                    width="100"
                    height="114"
                    fill={quarter.fill}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 + index * 0.18, duration: 0.15 }}
                  />
                ))}
              </g>
              <path d={shieldPath} fill="none" stroke="#ffcf3a" strokeWidth={7} />
              <path d="M100 6 V222 M10 114 H190" stroke="#ffcf3a" strokeWidth={4} />
            </svg>
            {[
              { left: "14%", top: "12%", node: <TankardLogo className="w-full" /> },
              { left: "60%", top: "14%", node: <Crown className="w-full" /> },
              { left: "16%", top: "54%", node: <FlatD20 className="w-full" /> },
              { left: "62%", top: "52%", node: <HopCone className="w-full" /> },
            ].map((charge, index) => (
              <m.div
                key={index}
                className="absolute w-[24%]"
                style={{ left: charge.left, top: charge.top }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                transition={{ delay: 0.55 + index * 0.18, duration: 0.3 }}
              >
                {charge.node}
              </m.div>
            ))}
          </m.div>
        </div>
        <m.div
          className="parchment relative -mt-3 rounded-sm px-5 py-1.5 text-center shadow-[0_8px_18px_rgb(0_0_0/0.5)]"
          initial={{ clipPath: "inset(0 50% 0 50%)" }}
          animate={{ clipPath: "inset(0 0% 0 0%)" }}
          transition={{ delay: 1.45, duration: 0.4, ease: EASE_OUT }}
        >
          <p className="font-display text-[clamp(0.95rem,2.6vw,1.4rem)] uppercase tracking-[0.18em]">Chouffinus maximus</p>
        </m.div>
      </div>
      <div className="absolute inset-x-0 top-[68%] flex flex-col items-center px-4 text-center">
        <Slam delay={1.85} from={3} className="max-w-[94vw] break-words" style={{ color: "var(--color-rarity-legendary)", fontSize: wordSize(word, { max: 11, cap: 7 }) }}>
          {word}
        </Slam>
        <Rise delay={2.2} className="mt-1 font-display text-[clamp(1rem,2.8vw,1.6rem)] uppercase tracking-[0.12em] text-parchemin [text-shadow:0_2px_0_#000]">
          Suzerain de la taverne · On en a gros !
        </Rise>
      </div>
      <Burst seed={seed} count={16} x={50} y={34} delay={1.2} duration={1.2} distance={[18, 42]} gravity={12} size={[6, 12]} render={() => <div className="aspect-square w-full rotate-45 bg-[#ffcf3a]" />} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */

export default function RolisteEgg(props: EggProps) {
  switch (props.variant) {
    case "echec":
      return <FailEchec {...props} />;
    case "parchemin":
      return <SmallParchemin {...props} />;
    case "jet":
      return <ComboJet {...props} />;
    case "adoubement":
      return <ComboAdoubement {...props} />;
    case "vingt":
      return <LegendaryVingt {...props} />;
    case "blason":
      return <LegendaryBlason {...props} />;
    default:
      return props.level === "fail" ? <FailEchec {...props} /> : props.level === "small" ? <SmallParchemin {...props} /> : <ComboJet {...props} />;
  }
}

