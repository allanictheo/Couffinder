"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { ApiError } from "@/lib/client/api";
import { RedCard } from "./art";

/** Mot injurieux ou haineux : ferme, sans animation rigolote. */
export function BlockedNotice({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <article className="card-neutral flex flex-col gap-5 border-alerte/50 p-6 sm:flex-row sm:p-8" aria-labelledby="blocked-title">
      <RedCard className="h-16 w-12 shrink-0 -rotate-6" />
      <div>
        <h2 id="blocked-title" className="text-2xl font-extrabold">
          Holà, on se calme.
        </h2>
        <p className="mt-2 text-lg leading-relaxed">{message}</p>
        <p className="mt-3 text-brume">
          Ici, on juge des mots, pas des gens. Choisis-en un autre, noble voyageur, et tout ira bien.
        </p>
        <button type="button" onClick={onReset} className="btn-ghost mt-5 inline-flex min-h-11 items-center px-5 font-semibold">
          Choisir un autre mot
        </button>
      </div>
    </article>
  );
}

/** Saisie refusée par l'API (vide, trop longue, runes interdites...). */
export function InvalidNotice({ message }: { message: string }) {
  return (
    <article className="card-neutral p-6 sm:p-8" aria-labelledby="invalid-title">
      <p className="pixel-text text-sm text-hydromel" aria-hidden="true">
        ERREUR 418 : JE SUIS UNE CHOPE
      </p>
      <h2 id="invalid-title" className="mt-2 text-2xl font-extrabold">
        Le parchemin est illisible.
      </h2>
      <p className="mt-2 text-lg leading-relaxed text-brume">{message}</p>
    </article>
  );
}

const RATE_LIMIT_COOLDOWN_S = 12;

/** Réseau coupé, HTTP 429 ou 5xx : court, drôle, avec un bouton pour relancer. */
export function ErrorNotice({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
  const rateLimited = error.kind === "rate-limit";
  const [coolingDown, setCoolingDown] = useState(rateLimited);

  useEffect(() => {
    if (!coolingDown) return;
    const id = window.setTimeout(() => setCoolingDown(false), RATE_LIMIT_COOLDOWN_S * 1000);
    return () => window.clearTimeout(id);
  }, [coolingDown]);

  const title =
    error.kind === "network"
      ? "Ta connexion a pris une flèche dans le genou."
      : rateLimited
        ? "Holà, pas si vite !"
        : "Échec critique !";

  const body =
    error.kind === "network"
      ? "Impossible de joindre la taverne. Vérifie ton réseau, puis relance."
      : rateLimited
        ? (error.serverMessage ?? "Trop de mots d'un coup. Reprends ton souffle et réessaie dans un instant.")
        : `Le serveur a fait 1 au d20${error.status ? ` (erreur ${error.status})` : ""}. Relance, avec un peu de chance ce sera un 20.`;

  return (
    <article className="card-neutral p-6 sm:p-8" aria-labelledby="error-title">
      <h2 id="error-title" className="text-2xl font-extrabold">
        {title}
      </h2>
      <p className="mt-2 text-lg leading-relaxed text-brume">{body}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={coolingDown}
        className={`btn-ghost mt-5 inline-flex min-h-11 items-center px-5 font-semibold disabled:cursor-wait disabled:opacity-70 ${coolingDown ? "cooldown" : ""}`}
        style={coolingDown ? ({ "--cooldown-duration": `${RATE_LIMIT_COOLDOWN_S}s` } as CSSProperties) : undefined}
      >
        {coolingDown ? "Recharge en cours..." : "Relancer le dé"}
      </button>
      {coolingDown ? (
        <p className="mt-2 text-sm text-brume">
          Temps de recharge : {RATE_LIMIT_COOLDOWN_S} secondes, comme un vrai sort.
        </p>
      ) : null}
    </article>
  );
}
