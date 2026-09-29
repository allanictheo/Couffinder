"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useState } from "react";
import { postVote, toApiError } from "@/lib/client/api";
import { formatNumber } from "@/lib/client/copy";
import { rememberVote, sfx } from "@/lib/client/preferences";
import type { JudgeResult, KnownResult, UnknownResult, VoteChoice, VoteCounts } from "@/lib/types";
import { useMyVote } from "@/hooks/usePreferences";
import { CheckIcon } from "./art";

export type VotedHandler = (next: JudgeResult, alreadyVoted: boolean) => void;

const CHOICE_LABEL: Record<VoteChoice, string> = {
  chouffin: "chouffin",
  "pas-chouffin": "pas chouffin",
};

/** Barre de bras de fer entre les deux camps. */
export function VoteBar({ votes }: { votes: VoteCounts }) {
  const total = votes.chouffin + votes.pasChouffin;
  const ratio = total === 0 ? 0.5 : votes.chouffin / total;

  return (
    <div>
      <div className={`relative h-3 overflow-hidden rounded-full ${total === 0 ? "bg-white/10" : "bg-metro"}`} aria-hidden="true">
        {total > 0 ? (
          <div
            className="absolute inset-y-0 left-0 w-full origin-left bg-dew transition-transform duration-700 ease-out-expo"
            style={{ transform: `scaleX(${ratio})` }}
          />
        ) : null}
      </div>
      <p className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
        {total === 0 ? (
          <span className="text-brume">Personne n&apos;a encore voté. Sois le premier (« first ! », comme en 2012).</span>
        ) : (
          <>
            <span className="font-semibold text-dew">{formatNumber(votes.chouffin)} voix chouffin</span>
            <span className="font-semibold text-metro-light">{formatNumber(votes.pasChouffin)} voix pas chouffin</span>
          </>
        )}
      </p>
    </div>
  );
}

/** Pastilles « encore N votes avant d'entrer dans la base ». */
function AdoptionPips({ votes, needed }: { votes: VoteCounts; needed: number }) {
  const cast = votes.chouffin + votes.pasChouffin;
  const total = Math.min(cast + needed, 12);
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`size-3 rotate-45 rounded-[2px] ${index < cast ? "bg-hydromel shadow-[0_0_8px_rgb(255_200_74/0.7)]" : "border border-white/25 bg-white/5"}`}
        />
      ))}
    </div>
  );
}

export function VotePanel({ subject, onVoted }: { subject: KnownResult | UnknownResult; onVoted: VotedHandler }) {
  const myVote = useMyVote(subject.key);
  const [pending, setPending] = useState<VoteChoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [burst, setBurst] = useState<{ id: number; choice: VoteChoice } | null>(null);
  const headingId = useId();

  const adopting = subject.status === "unknown";
  const disabledReason = subject.status === "unknown" ? subject.votingDisabledReason : undefined;
  const locked = myVote !== null || pending !== null;

  async function vote(choice: VoteChoice) {
    if (locked) return;
    setPending(choice);
    setError(null);
    setNotice(null);
    try {
      const response = await postVote({ q: subject.key, vote: choice });
      if (!response.ok) {
        setError(response.error);
        return;
      }
      rememberVote(subject.key, choice);
      if (response.alreadyVoted) {
        setNotice("Ton vote était déjà compté. Bien essayé, petit malin.");
      } else {
        setBurst({ id: Date.now(), choice });
        sfx("vote");
      }
      onVoted(response.result, response.alreadyVoted);
    } catch (caught) {
      const apiError = toApiError(caught);
      setError(
        apiError.serverMessage ??
          (apiError.kind === "network"
            ? "Ton vote s'est perdu dans les couloirs du château. Réessaie."
            : "Le vote n'est pas passé. Réessaie dans un instant."),
      );
    } finally {
      setPending(null);
    }
  }

  const title = adopting ? "Alors, c'est chouffin ou pas ?" : "Et toi, t'en dis quoi ?";
  const lead = adopting
    ? subject.votesNeeded > 0
      ? `Ce mot n'est pas encore dans la base. Encore ${subject.votesNeeded} vote${subject.votesNeeded > 1 ? "s" : ""} et il y entre, avec le verdict de la majorité.`
      : "Ce mot attend son verdict."
    : "Si assez de monde n'est pas d'accord, le verdict se renverse. C'est ça, la démocratie de taverne.";

  return (
    <section aria-labelledby={headingId} className="mt-6 border-t border-ligne pt-6" id={`vote-${subject.key}`}>
      <h3 id={headingId} tabIndex={-1} className="text-xl font-extrabold outline-none">
        {title}
      </h3>
      {!disabledReason ? <p className="mt-1 text-brume">{lead}</p> : null}

      {adopting && !disabledReason && subject.votesNeeded > 0 ? (
        <div className="mt-3">
          <AdoptionPips votes={subject.votes} needed={subject.votesNeeded} />
        </div>
      ) : null}

      <div className="mt-4">
        <VoteBar votes={subject.votes} />
      </div>

      {disabledReason ? (
        <p className="mt-5 rounded-xl border border-hydromel/40 bg-hydromel/10 p-4 font-medium text-hydromel">
          {disabledReason}
        </p>
      ) : (
        <div className="relative mt-5 grid gap-4 @lg:grid-cols-2">
          {(["chouffin", "pas-chouffin"] as const).map((choice) => {
            const chosen = myVote === choice;
            return (
              <div key={choice} className="relative">
                <button
                  type="button"
                  onClick={() => void vote(choice)}
                  disabled={locked}
                  aria-pressed={chosen}
                  data-tone={choice === "pas-chouffin" ? "pas" : undefined}
                  className={`btn-glossy flex min-h-14 w-full items-center justify-center gap-2 px-4 text-base transition-opacity ${
                    myVote !== null && !chosen ? "opacity-40" : ""
                  }`}
                >
                  {pending === choice ? <span className="spinner" aria-hidden="true" /> : null}
                  {chosen ? <CheckIcon className="size-5" /> : null}
                  <span>
                    {chosen
                      ? `Tu as voté ${CHOICE_LABEL[choice]}`
                      : `Pour moi c'est ${CHOICE_LABEL[choice]}`}
                  </span>
                </button>
                <AnimatePresence>
                  {burst?.choice === choice ? (
                    <m.span
                      key={burst.id}
                      aria-hidden="true"
                      className="pixel-text pointer-events-none absolute -top-2 right-5 text-3xl text-hydromel [text-shadow:0_2px_0_#000]"
                      initial={{ opacity: 0, y: 8, scale: 0.6 }}
                      animate={{ opacity: [0, 1, 1, 0], y: -44, scale: 1.1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      onAnimationComplete={() => setBurst(null)}
                    >
                      +1
                    </m.span>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {myVote && !notice ? (
        <p className="mt-3 text-sm text-brume">
          Vote enregistré : <strong className="text-parchemin">{CHOICE_LABEL[myVote]}</strong>. Merci, noble citoyen de la taverne.
        </p>
      ) : null}
      {notice ? <p className="mt-3 text-sm font-medium text-hydromel">{notice}</p> : null}
      {error ? <p className="mt-3 text-sm font-medium text-alerte">{error}</p> : null}
    </section>
  );
}
