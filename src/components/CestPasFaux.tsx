"use client";

import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CEST_PAS_FAUX_CHAPTERS, CEST_PAS_FAUX_INTRO } from "@/content/cest-pas-faux";
import type { UnknownResult } from "@/lib/types";
import { VotePanel, type VotedHandler } from "./VotePanel";

const WORDS_PER_MINUTE = 230;

const TOTAL_WORDS = [CEST_PAS_FAUX_INTRO, ...CEST_PAS_FAUX_CHAPTERS.flatMap((chapter) => [chapter.title, ...chapter.paragraphs])]
  .join(" ")
  .split(/\s+/)
  .filter(Boolean).length;

const REAL_MINUTES = Math.max(1, Math.round(TOTAL_WORDS / WORDS_PER_MINUTE));

/** L'estimation du temps de lecture grimpe à chaque chapitre dévoilé. */
const ESTIMATES: Array<(minutes: number) => string> = [
  (minutes) => `${minutes} min`,
  (minutes) => `${minutes * 3} min`,
  () => "1 h 20 (pause pipi incluse)",
  () => "3 h 12, soit un film de fantasy en version longue",
  () => "une nuit blanche de raid",
  () => "l'intégrale des six Livres, deux fois",
  () => "une campagne de JDR complète",
  () => "une ère géologique",
  () => "∞ (c'est pas faux)",
];

const REVEAL_LABELS = [
  "Attends, c'est pas fini...",
  "Non mais attends, y a une suite",
  "Encore un petit chapitre",
  "Presque fini (c'est faux)",
  "Bon, j'en ai encore un peu",
  "On arrive au meilleur passage",
  "Ça va, tu tiens le coup ?",
  "Promis, c'est bientôt fini",
];

const PROGRESS_REMARKS = [
  "",
  "Oui, la barre a reculé. C'est normal.",
  "Elle recule encore. Toujours normal.",
  "On ne va pas se mentir : ça recule.",
  "La barre a abandonné. Nous, non.",
];

function estimateFor(revealed: number, done: boolean): string {
  if (done) return "0 min. C'est fini. Enfin.";
  const format = ESTIMATES[Math.min(revealed - 1, ESTIMATES.length - 1)];
  return format(REAL_MINUTES);
}

function revealLabel(revealed: number, total: number): string {
  if (revealed === total - 1) return "Le dernier. Pour de vrai.";
  return REVEAL_LABELS[Math.min(revealed - 1, REVEAL_LABELS.length - 1)];
}

export default function CestPasFaux({ result, onVoted }: { result: UnknownResult; onVoted: VotedHandler }) {
  const total = CEST_PAS_FAUX_CHAPTERS.length;
  const [revealed, setRevealed] = useState(Math.min(1, total));
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const focusIndex = useRef<number | null>(null);

  const done = revealed >= total;
  console.log("DEBUG render CestPasFaux", revealed);
  // Le total « apparent » gonfle plus vite que la lecture : la barre recule.
  const apparentTotal = done ? total : revealed * revealed + 1;
  const progress = done ? 1 : revealed / apparentTotal;
  const remark = done
    ? "Barre de progression réparée par un clerc de niveau 12."
    : PROGRESS_REMARKS[Math.min(revealed - 1, PROGRESS_REMARKS.length - 1)];

  useEffect(() => {
    const index = focusIndex.current;
    if (index === null) return;
    focusIndex.current = null;
    chapterRefs.current[index]?.focus();
  }, [revealed]);

  function revealNext() {
    console.log("DEBUG revealNext", revealed);
    focusIndex.current = revealed;
    setRevealed((current) => Math.min(total, current + 1));
  }

  function revealAll() {
    focusIndex.current = revealed;
    setRevealed(total);
  }

  function skipToVote() {
    const panel = document.getElementById(`vote-${result.key}`);
    panel?.scrollIntoView({ block: "start" });
    panel?.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true });
  }

  return (
    <article className="card-neutral @container p-5 sm:p-8" aria-labelledby="cest-pas-faux-title">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brume">Mot inconnu au bataillon</p>
      <m.h2
        id="cest-pas-faux-title"
        className="meme-text mt-3 text-center text-[clamp(3rem,15cqi,8rem)]"
        initial={{ scale: 0.55, rotate: -5, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 13 }}
      >
        C&apos;est pas faux
      </m.h2>
      <p className="mx-auto mt-4 max-w-prose text-center text-lg text-brume">
        Le Chouffinder ne connaît pas <strong className="break-words text-parchemin">« {result.word} »</strong>.
        Alors il fait comme Perceval.
      </p>

      {/* HUD de lecture, collé en haut pendant le défilement. */}
      <div className="sticky top-2 z-10 mt-8 rounded-2xl border border-ligne bg-nuit-2/90 p-3 backdrop-blur-md @md:p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
          <p>
            <span className="text-brume">Temps de lecture estimé : </span>
            <m.strong
              key={`${revealed}-${done}`}
              className="inline-block text-hydromel"
              initial={{ scale: 1.25, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              {estimateFor(revealed, done)}
            </m.strong>
          </p>
          <button type="button" onClick={skipToVote} className="font-semibold text-dew underline decoration-2 underline-offset-4">
            Trop long ? Aller au vote
          </button>
        </div>
        <div
          className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Progression de lecture"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full w-full origin-left rounded-full bg-[linear-gradient(90deg,var(--color-hydromel),var(--color-chips))] transition-transform duration-700 ease-out-expo"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <p className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-xs text-brume">
          <span>
            Chapitre {revealed} sur {apparentTotal}
            {done ? ". Ah si, c'est bien fini." : "... environ."}
          </span>
          {remark ? <span className="italic">{remark}</span> : null}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-prose text-[1.05rem] leading-relaxed">
        <p className="lettrine">{CEST_PAS_FAUX_INTRO}</p>

        {CEST_PAS_FAUX_CHAPTERS.slice(0, revealed).map((chapter, index) => (
          <m.section
            key={chapter.title}
            ref={(node) => {
              chapterRefs.current[index] = node;
            }}
            tabIndex={-1}
            aria-label={chapter.title}
            className="mt-8 scroll-mt-40 outline-none"
            initial={index === 0 ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-display text-2xl uppercase tracking-wide text-hydromel">{chapter.title}</h3>
            {chapter.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className="mt-3 text-parchemin/90">
                {paragraph}
              </p>
            ))}
          </m.section>
        ))}

        {!done ? (
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={revealNext}
              className="btn-glossy min-h-14 px-6 text-lg"
            >
              {revealLabel(revealed, total)}
            </button>
            <button type="button" onClick={revealAll} className="text-sm text-brume underline underline-offset-4">
              Tout dérouler d&apos;un coup (courage)
            </button>
          </div>
        ) : (
          <m.p
            className="mt-8 text-center font-display text-2xl uppercase text-dew"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Voilà. C&apos;est fini. Pour de vrai, cette fois.
          </m.p>
        )}
      </div>

      <VotePanel subject={result} onVoted={onVoted} />
    </article>
  );
}
