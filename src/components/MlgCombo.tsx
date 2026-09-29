"use client";

import { m } from "motion/react";
import { useEffect, useMemo } from "react";
import { DOGE_TEMPLATES, seededRandom } from "@/lib/client/copy";
import { sfx } from "@/lib/client/preferences";
import { Chip, Hitmarker, PixelGlasses, SodaCan } from "./art";

/**
 * Le combo MLG plein écran : hitmarkers, airhorn, lens flares, lunettes pixel,
 * chips et canette, doge-speak, +100. Court (2,7 s) et zappable (clic, Échap).
 *
 * Sécurité photosensible : seulement deux « flashs » (lens flares) espacés de
 * plus d'une seconde, aucun clignotement plein écran. Jamais monté quand
 * l'utilisateur préfère les animations réduites (le parent s'en charge).
 */

export const MLG_DURATION_MS = 2700;

const DOGE_COLORS = ["#ff3ea5", "#3ef0ff", "#fff23e", "#b6ff2e", "#ff8a1a", "#c4b0ff"];

/** Emplacements en périphérie, pour ne jamais masquer le texte central. */
const DOGE_SLOTS = [
  { x: 6, y: 12 },
  { x: 58, y: 9 },
  { x: 4, y: 74 },
  { x: 60, y: 80 },
  { x: 30, y: 90 },
  { x: 66, y: 44 },
];

interface ComboPlan {
  hitmarkers: Array<{ id: number; delay: number; x: number; y: number; size: number }>;
  doges: Array<{ id: number; text: string; color: string; x: number; y: number; rotate: number; delay: number; size: number }>;
  projectiles: Array<{
    id: number;
    kind: "chip" | "can";
    delay: number;
    x: [number, number];
    y: [number, number, number];
    rotate: number;
    size: number;
  }>;
}

function makePlan(seed: number, word: string, legendary: boolean): ComboPlan {
  const random = seededRandom(seed);
  const between = (min: number, max: number) => min + random() * (max - min);

  const hitTimes = legendary ? [0.06, 0.26, 0.44, 0.72, 0.94, 1.12, 1.3] : [0.06, 0.26, 0.44, 0.72, 0.94];
  const hitmarkers = hitTimes.map((delay, id) => ({
    id,
    delay,
    x: between(12, 88),
    y: between(18, 82),
    size: between(44, 76),
  }));

  const templates = [...DOGE_TEMPLATES];
  for (let i = templates.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [templates[i], templates[j]] = [templates[j], templates[i]];
  }
  const dogeWord = word.toLocaleLowerCase("fr-FR").slice(0, 22);
  const doges = DOGE_SLOTS.slice(0, 5).map((slot, id) => ({
    id,
    text: templates[id].replace("{word}", dogeWord),
    color: DOGE_COLORS[id % DOGE_COLORS.length],
    x: slot.x + between(-2, 4),
    y: slot.y + between(-3, 3),
    rotate: between(-14, 14),
    delay: 0.5 + id * 0.2,
    size: between(1.15, 1.9),
  }));

  const projectiles = Array.from({ length: legendary ? 8 : 6 }, (_, id) => {
    const fromLeft = id % 2 === 0;
    const startY = between(55, 95);
    return {
      id,
      kind: id % 3 === 2 ? ("can" as const) : ("chip" as const),
      delay: 0.12 + id * 0.16,
      x: (fromLeft ? [-18, between(45, 115)] : [110, between(-15, 45)]) as [number, number],
      y: [startY, between(5, 35), 115] as [number, number, number],
      rotate: between(-620, 620),
      size: between(52, 88),
    };
  });

  return { hitmarkers, doges, projectiles };
}

function LensFlare({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <m.div
      className="flare"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 0.95, 0], scale: [0.4, 1.1, 1.3] }}
      transition={{ delay, duration: 0.8, times: [0, 0.3, 1], ease: "easeOut" }}
    >
      <div className="flare-core" />
      <div className="flare-streak" />
      <div className="flare-ring" />
    </m.div>
  );
}

export default function MlgCombo({
  seed,
  word,
  legendary,
  onDone,
}: {
  seed: number;
  word: string;
  legendary: boolean;
  onDone: () => void;
}) {
  const plan = useMemo(() => makePlan(seed, word, legendary), [seed, word, legendary]);

  useEffect(() => {
    const sound = sfx("mlgCombo");
    const timer = window.setTimeout(onDone, MLG_DURATION_MS);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      sound?.stop();
    };
  }, [onDone]);

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-0 z-50 cursor-pointer overflow-hidden select-none"
      onClick={onDone}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.12 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(14_10_22/0.25)_15%,rgb(14_10_22/0.82)_100%)]" />

      <LensFlare delay={0.1} x="24%" y="26%" />
      <LensFlare delay={1.35} x="74%" y="68%" />

      {plan.projectiles.map((item) => (
        <m.div
          key={`p-${item.id}`}
          className="absolute left-0 top-0"
          style={{ width: item.size }}
          initial={{ x: `${item.x[0]}vw`, y: `${item.y[0]}vh`, rotate: 0, opacity: 0 }}
          animate={{
            x: `${item.x[1]}vw`,
            y: item.y.map((value) => `${value}vh`),
            rotate: item.rotate,
            opacity: 1,
          }}
          transition={{
            delay: item.delay,
            duration: 1.5,
            x: { ease: "linear", delay: item.delay, duration: 1.5 },
            y: { ease: ["easeOut", "easeIn"], times: [0, 0.42, 1], delay: item.delay, duration: 1.5 },
            rotate: { ease: "linear", delay: item.delay, duration: 1.5 },
            opacity: { delay: item.delay, duration: 0.1 },
          }}
        >
          {item.kind === "chip" ? <Chip className="w-full drop-shadow-[0_4px_0_rgb(0_0_0/0.5)]" /> : <SodaCan className="w-[70%] drop-shadow-[0_4px_0_rgb(0_0_0/0.5)]" />}
        </m.div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="relative">
          <m.p
            className="meme-text text-center text-[clamp(3.6rem,17vw,12rem)]"
            style={legendary ? { color: "var(--color-rarity-legendary)" } : undefined}
            initial={{ scale: 3, opacity: 0, rotate: -12 }}
            animate={{
              scale: [3, 0.92, 1, 1, 1.14, 1],
              rotate: [-12, 2, -3, -3, -3, -3],
              opacity: [0, 1, 1, 1, 1, 1],
            }}
            transition={{ duration: 1.3, times: [0, 0.12, 0.2, 0.62, 0.68, 0.78], ease: "easeOut" }}
          >
            {legendary ? "Légendaire !" : "Chouffin !"}
          </m.p>
          <m.div
            className="absolute left-1/2 top-[6%] w-[46%] min-w-32"
            style={{ x: "-50%" }}
            initial={{ y: "-80vh", rotate: -10 }}
            animate={{ y: ["-80vh", "0vh", "-2.5vh", "0vh"], rotate: [-10, 0, 3, 0] }}
            transition={{ delay: 0.3, duration: 0.85, times: [0, 0.72, 0.86, 1], ease: "easeIn" }}
          >
            <PixelGlasses className="w-full drop-shadow-[0_6px_0_rgb(0_0_0/0.35)]" />
          </m.div>
        </div>

        <m.p
          className="pixel-text mt-4 text-center text-[clamp(1rem,3.4vw,1.8rem)] text-white [text-shadow:0_3px_0_#000]"
          initial={{ opacity: 0, scale: 1.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.15, duration: 0.2 }}
        >
          DEAL WITH IT
        </m.p>

        <m.p
          className="pixel-text mt-2 text-center text-[clamp(1.1rem,4.2vw,2.4rem)] text-dew [text-shadow:0_3px_0_#000,0_0_18px_rgb(182_255_46/0.6)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: [0, 1, 1, 0], y: [30, 0, -20, -50] }}
          transition={{ delay: 0.75, duration: 1.7, times: [0, 0.15, 0.8, 1] }}
        >
          +100 CHOUFFINITUDE
        </m.p>
      </div>

      {legendary ? (
        <>
          <m.p
            className="meme-text absolute left-[6%] top-[30%] text-[clamp(1.8rem,7vw,4.5rem)] text-rarity-legendary"
            initial={{ opacity: 0, scale: 0, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 500, damping: 14 }}
          >
            Combo x3
          </m.p>
          <m.p
            className="meme-text absolute bottom-[26%] right-[6%] text-[clamp(1.6rem,6vw,3.8rem)]"
            initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
          >
            360 no scope
          </m.p>
        </>
      ) : null}

      {plan.doges.map((doge) => (
        <m.p
          key={`d-${doge.id}`}
          className="doge-text absolute whitespace-nowrap"
          style={{ left: `${doge.x}%`, top: `${doge.y}%`, color: doge.color, fontSize: `${doge.size}rem`, rotate: doge.rotate }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.2, 1] }}
          transition={{ delay: doge.delay, duration: 0.4, ease: "easeOut" }}
        >
          {doge.text}
        </m.p>
      ))}

      {plan.hitmarkers.map((hit) => (
        <m.div
          key={`h-${hit.id}`}
          className="absolute"
          style={{ left: `${hit.x}%`, top: `${hit.y}%`, width: hit.size, x: "-50%", y: "-50%" }}
          initial={{ opacity: 0, scale: 1.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [1.8, 1, 1, 0.9] }}
          transition={{ delay: hit.delay, duration: 0.34, times: [0, 0.12, 0.6, 1] }}
        >
          <Hitmarker className="w-full" />
        </m.div>
      ))}

      <p className="absolute inset-x-0 top-3 text-center text-xs font-semibold text-white/75">
        Clic ou Échap pour passer
      </p>
    </m.div>
  );
}
