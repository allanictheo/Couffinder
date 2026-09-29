"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { CATEGORY_LABELS, rarityFor, shareUrl } from "@/lib/client/copy";
import type { KnownResult } from "@/lib/types";
import { CheckIcon, CommunityIcon, FlipIcon, ShareIcon } from "./art";
import { ChouffinGauge } from "./ChouffinGauge";
import { VotePanel, type VotedHandler } from "./VotePanel";

function Badge({ icon, children, tone }: { icon: ReactNode; children: ReactNode; tone: "flip" | "community" }) {
  const toneClass =
    tone === "flip"
      ? "border-neon-pink/50 bg-neon-pink/10 text-[#ff8cc8]"
      : "border-hydromel/50 bg-hydromel/10 text-hydromel";
  return (
    <m.span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${toneClass}`}
      initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 16, delay: 0.35 }}
    >
      <span className="size-4 shrink-0">{icon}</span>
      {children}
    </m.span>
  );
}

function ShareButton({ word, chouffin }: { word: string; chouffin: boolean }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = shareUrl(word);
    const text = `« ${word} » est ${chouffin ? "CHOUFFIN" : "pas chouffin"} selon le Chouffinder. Et pour toi ?`;
    if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: "Chouffinder", text, url });
        return;
      } catch {
        // Partage annulé : on retombe sur la copie du lien.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copie ce lien :", url);
    }
  }

  return (
    <button type="button" onClick={() => void share()} className="btn-ghost inline-flex min-h-11 items-center gap-2 px-4 text-sm font-semibold">
      {copied ? <CheckIcon className="size-4 text-dew" /> : <ShareIcon className="size-4" />}
      <span aria-live="polite">{copied ? "Lien copié !" : "Partager ce verdict"}</span>
    </button>
  );
}

export function VerdictCard({
  result,
  onVoted,
  onAnotherWord,
}: {
  result: KnownResult;
  onVoted: VotedHandler;
  onAnotherWord: () => void;
}) {
  const headingId = useId();
  const rarity = rarityFor(result.score, result.legendary);
  const details = [rarity.label, result.category ? CATEGORY_LABELS[result.category] : null].filter(Boolean).join(" · ");

  return (
    <article
      aria-labelledby={headingId}
      className={`@container relative overflow-hidden p-5 sm:p-8 ${result.chouffin ? "card-chouffin" : "card-pas"}`}
      data-legendary={result.chouffin && result.legendary}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brume">Verdict du Chouffinder</p>
      <h2 id={headingId} className="mt-1 break-words text-3xl font-extrabold leading-tight @md:text-4xl">
        « {result.word} »
      </h2>

      <div className="my-6 flex min-h-[1.4em] flex-col items-center text-[clamp(3rem,16cqi,7rem)] [perspective:900px]">
        {result.chouffin && result.legendary ? (
          <p className="pixel-text mb-3 text-sm tracking-widest text-rarity-legendary @md:text-base">★ Objet légendaire ★</p>
        ) : null}
        <AnimatePresence mode="wait" initial>
          {result.chouffin ? (
            <m.p
              key="chouffin"
              className="stamp-chouffin"
              data-legendary={result.legendary}
              initial={{ scale: 2.4, rotate: -16, opacity: 0 }}
              animate={{ scale: 1, rotate: -4, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 520, damping: 19, mass: 0.9 }}
            >
              <span className="sr-only">Verdict : </span>Chouffin
            </m.p>
          ) : (
            <m.p
              key="pas"
              className="tile-pas text-[0.78em]"
              style={{ transformPerspective: 900, originX: 0 }}
              initial={{ rotateY: -80, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 80, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: [0.1, 0.9, 0.2, 1] }}
            >
              <span className="sr-only">Verdict : </span>pas chouffin.
            </m.p>
          )}
        </AnimatePresence>
      </div>

      {result.flipped || result.source === "communaute" ? (
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {result.flipped ? (
            <Badge tone="flip" icon={<FlipIcon className="size-4" />}>
              Verdict renversé par la communauté
            </Badge>
          ) : null}
          {result.source === "communaute" ? (
            <Badge tone="community" icon={<CommunityIcon className="size-4" />}>
              Mot adopté par la communauté
            </Badge>
          ) : null}
        </div>
      ) : null}

      <div className="item-tooltip p-4 @md:p-5">
        <p className="text-sm font-bold uppercase tracking-wider" style={{ color: rarity.color }}>
          {details}
        </p>
        {result.flipped && result.agentVerdict !== null ? (
          <p className="mt-1 text-sm text-brume">
            Le juge avait dit « {result.agentVerdict ? "chouffin" : "pas chouffin"} ». La taverne en a décidé autrement.
          </p>
        ) : null}
        <div className="mt-4">
          <ChouffinGauge score={result.score} rarity={rarity} />
        </div>
        <blockquote className="mt-5 text-lg leading-relaxed text-hydromel">« {result.reason} »</blockquote>
      </div>

      <VotePanel subject={result} onVoted={onVoted} />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ShareButton word={result.word} chouffin={result.chouffin} />
        <button type="button" onClick={onAnotherWord} className="btn-ghost inline-flex min-h-11 items-center px-4 text-sm font-semibold">
          Juger un autre mot
        </button>
      </div>
    </article>
  );
}
