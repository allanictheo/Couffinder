"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { useSoundPreference } from "@/hooks/usePreferences";
import { TRIBES, type Tribe } from "@/lib/types";
import { AchievementToast } from "../AchievementToast";
import { SpeakerIcon } from "../art";
import {
  EGG_LEVELS,
  LEVEL_LABELS,
  LEVEL_SAMPLE_SCORES,
  TRIBE_EGGS,
  VIE_LEVELS,
  VIE_LEVEL_LABELS,
  VIE_NORMALE,
  planSurprise,
  type EggLevel,
  type SurprisePlan,
  type VieLevel,
} from "../easter-eggs/catalog";
import { EggLayer, warmupEggs } from "../easter-eggs/EggLayer";
import { GrassSun, TribeIcon } from "../easter-eggs/icons";
import { useSurprises } from "../easter-eggs/useSurprises";

/**
 * Labo des easter eggs (page de développement) : chaque animation de chaque
 * tribu et de chaque niveau, la famille « Vie normale » tranche par tranche, à
 * la demande, plus un simulateur de verdict et un mesureur qui appliquent les
 * vraies fréquences.
 */

const EMPTY_PLAN: SurprisePlan = { overlay: null, toast: null, sfx: null, sting: null, shake: false };

function SoundSwitch() {
  const { enabled, setEnabled } = useSoundPreference();
  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      aria-pressed={enabled}
      className="btn-ghost inline-flex min-h-11 items-center gap-2 pl-3 pr-2 text-sm font-semibold"
    >
      <SpeakerIcon muted={!enabled} className="size-5" />
      <span>Son</span>
      <span aria-hidden="true" className={`pixel-text rounded-full px-2 py-0.5 text-[0.7rem] ${enabled ? "bg-dew text-nuit" : "bg-white/10 text-brume"}`}>
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function scoreFor(level: EggLevel): { score: number; chouffin: boolean; legendary: boolean } {
  const score = LEVEL_SAMPLE_SCORES[level];
  return { score, chouffin: level !== "fail", legendary: level === "legendary" };
}

interface FrequencyRow {
  label: string;
  measured: number;
  expected: number;
}

interface Frequencies {
  draws: number;
  rows: FrequencyRow[];
  /** Répartition des apothéoses gamer (toujours jouées) entre leurs variantes. */
  gamerLegendary: Array<{ id: string; share: number }>;
}

type Draw = Parameters<typeof planSurprise>[0];

function share(draws: number, draw: Draw, accept: (plan: SurprisePlan) => boolean): number {
  let hits = 0;
  for (let i = 0; i < draws; i++) if (accept(planSurprise(draw))) hits += 1;
  return hits / draws;
}

/** Mesure les fréquences réelles de `planSurprise` (aucun hasard truqué). */
function measureFrequencies(draws: number): Frequencies {
  const any = (plan: SurprisePlan) => plan.overlay !== null;
  const vie = (plan: SurprisePlan) => plan.overlay?.kind === "vie";
  const rows: FrequencyRow[] = [
    { label: "Chouffin gamer (score 80) : animation", measured: share(draws, { word: "x", tribe: "gamer", score: 80, chouffin: true, legendary: false }, any), expected: 1 / 3 },
    { label: "Chouffin sans tribu (score 80) : combo MLG", measured: share(draws, { word: "x", tribe: null, score: 80, chouffin: true, legendary: false }, any), expected: 1 / 3 },
    { label: "Légendaire gamer (score 97) : apothéose", measured: share(draws, { word: "x", tribe: "gamer", score: 97, chouffin: true, legendary: true }, any), expected: 1 },
    { label: "Pas chouffin gamer (score 20) : échec thématique", measured: share(draws, { word: "x", tribe: "gamer", score: 20, chouffin: false, legendary: false }, any), expected: 1 / 4 },
  ];
  for (const level of VIE_LEVELS) {
    const score = VIE_NORMALE.samples[level].score;
    const draw: Draw = { word: "x", tribe: null, score, chouffin: false, legendary: false };
    rows.push({ label: `Pas chouffin sans tribu (score ${score}) : réaction`, measured: share(draws, draw, any), expected: 1 / 4 });
    rows.push({
      label: `  dont « Vie normale, ${VIE_LEVEL_LABELS[level].name.toLocaleLowerCase("fr-FR")} »`,
      measured: share(draws, draw, vie),
      expected: 1 / 8,
    });
  }
  const tally = new Map<string, number>();
  for (let i = 0; i < draws; i++) {
    const plan = planSurprise({ word: "x", tribe: "gamer", score: 97, chouffin: true, legendary: true });
    if (plan.overlay?.kind === "tribe") tally.set(plan.overlay.variant, (tally.get(plan.overlay.variant) ?? 0) + 1);
  }
  const gamerLegendary = TRIBE_EGGS.gamer.variants.legendary.map((variant) => ({ id: variant.label, share: (tally.get(variant.id) ?? 0) / draws }));
  return { draws, rows, gamerLegendary };
}

const percent = (value: number) => `${(Math.round(value * 1000) / 10).toLocaleString("fr-FR")} %`;

export function EasterEggLab({ autoplay, word: initialWord, reduced: initialReduced = false }: { autoplay?: string; word?: string; reduced?: boolean }) {
  const [wordOverride, setWordOverride] = useState(initialWord ?? "");
  const [reduced, setReduced] = useState(initialReduced);
  const [simTribe, setSimTribe] = useState<Tribe | "none">("gamer");
  const [simScore, setSimScore] = useState(82);
  const [log, setLog] = useState<string[]>([]);
  const [frequencies, setFrequencies] = useState<Frequencies | null>(null);
  const { overlay, toast, play, clearOverlay, dismissToast } = useSurprises();
  const wordId = useId();
  const scoreId = useId();
  const tribeId = useId();

  const wordFor = useCallback((tribe: Tribe | null, level: EggLevel) => {
    const typed = wordOverride.trim();
    if (typed) return typed;
    return tribe ? TRIBE_EGGS[tribe].samples[level] : level === "fail" ? "Brunch" : "Kaamelott";
  }, [wordOverride]);

  const wordForVie = useCallback((level: VieLevel) => wordOverride.trim() || VIE_NORMALE.samples[level].word, [wordOverride]);

  /** Famille « Vie normale » : sans variante, c'est le vrai tirage (écran bleu et NOPE compris). */
  const launchVie = useCallback(
    (level: VieLevel, variant?: string) => {
      const score = VIE_NORMALE.samples[level].score;
      play(planSurprise({ word: wordForVie(level), tribe: null, chouffin: false, score, legendary: false }, { force: true, reduced, variant }));
    },
    [play, reduced, wordForVie],
  );

  const launch = useCallback(
    (tribe: Tribe, level: EggLevel, variant?: string) => {
      const plan = planSurprise(
        { word: wordFor(tribe, level), tribe, ...scoreFor(level) },
        { force: true, reduced, variant },
      );
      play(plan);
    },
    [play, reduced, wordFor],
  );

  const launchGeneric = useCallback(
    (kind: "mlg" | "mlg-legendary" | "bsod" | "nope") => {
      if (kind === "bsod" || kind === "nope") {
        if (reduced) return;
        play({ ...EMPTY_PLAN, overlay: { kind: "sad", word: wordFor(null, "fail"), variant: kind } });
        return;
      }
      const legendary = kind === "mlg-legendary";
      play(planSurprise({ word: wordFor(null, "combo"), tribe: null, chouffin: true, score: legendary ? 97 : 82, legendary }, { force: true, reduced }));
    },
    [play, reduced, wordFor],
  );

  const simulate = useCallback(() => {
    const tribe = simTribe === "none" ? null : simTribe;
    const chouffin = simScore >= 51;
    const result = { word: wordFor(tribe, chouffin ? "combo" : "fail"), tribe, score: simScore, chouffin, legendary: chouffin && simScore >= 95 };
    const plan = planSurprise(result, { reduced });
    play(plan);
    const outcome = plan.overlay
      ? plan.overlay.kind === "tribe"
        ? `${plan.overlay.tribe} · ${plan.overlay.level} · ${plan.overlay.variant}`
        : plan.overlay.kind === "vie"
          ? `vie normale · ${plan.overlay.level} · ${plan.overlay.variant}`
          : plan.overlay.kind === "mlg"
            ? "combo MLG générique"
            : `réaction triste (${plan.overlay.variant})`
      : plan.toast
        ? `toast seul (mouvement réduit) : ${plan.toast.title}`
        : `rien de spécial (son « ${plan.sfx ?? "aucun"} »)`;
    setLog((previous) => [`Score ${simScore}, ${tribe ?? "sans tribu"} : ${outcome}`, ...previous].slice(0, 6));
  }, [play, reduced, simScore, simTribe, wordFor]);

  const measure = useCallback(() => setFrequencies(measureFrequencies(10000)), []);

  // Lecture automatique (captures d'écran) : ?play=tribu.niveau.variante, ?play=vie.tranche.variante, ?play=none.fail.bsod
  useEffect(() => {
    warmupEggs();
    if (!autoplay) return;
    const [family, level, variant] = autoplay.split(".");
    let start: (() => void) | null = null;
    if ((TRIBES as readonly string[]).includes(family) && (EGG_LEVELS as readonly string[]).includes(level)) {
      start = () => launch(family as Tribe, level as EggLevel, variant);
    } else if (family === "vie" && (VIE_LEVELS as readonly string[]).includes(level)) {
      start = () => launchVie(level as VieLevel, variant);
    } else if (family === "none" && ["mlg", "mlg-legendary", "bsod", "nope"].includes(variant)) {
      start = () => launchGeneric(variant as "mlg" | "mlg-legendary" | "bsod" | "nope");
    }
    if (!start) return;
    const timer = window.setTimeout(start, 400);
    return () => window.clearTimeout(timer);
    // Une seule fois, au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={reduced ? "always" : "user"}>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="pixel-text text-xs text-hydromel">Page de développement (404 en production)</p>
              <h1 className="meme-text mt-2 text-[clamp(2rem,6vw,3.6rem)]">Labo des easter eggs</h1>
              <p className="mt-2 max-w-2xl text-brume">
                Chaque tribu, chaque niveau de score, chaque variante, et la famille « Vie normale » des mots pas chouffin sans
                tribu. En vrai, le combo sort 1 fois sur 3 (toujours si légendaire) et l&apos;échec 1 fois sur 4 ; ici, tout part à
                la demande. Clic ou Échap pour passer.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SoundSwitch />
              <Link href="/" className="btn-ghost inline-flex min-h-11 items-center px-4 text-sm font-semibold">
                Retour au site
              </Link>
            </div>
          </header>

          <div className="card-neutral mt-6 flex flex-wrap items-end gap-4 p-4">
            <label className="flex min-w-60 flex-1 flex-col gap-1 text-sm font-semibold" htmlFor={wordId}>
              Mot affiché (vide : un vrai mot de la base par niveau)
              <input
                id={wordId}
                value={wordOverride}
                onChange={(event) => setWordOverride(event.target.value)}
                placeholder="ex. Kaamelott"
                className="min-h-11 rounded-xl border border-ligne bg-nuit-2 px-3 text-base font-normal"
              />
            </label>
            <label className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={reduced} onChange={(event) => setReduced(event.target.checked)} className="size-5 accent-[#b6ff2e]" />
              Simuler le mouvement réduit (toast thématique à la place)
            </label>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {TRIBES.map((tribe) => {
              const meta = TRIBE_EGGS[tribe];
              return (
                <section key={tribe} className="card-neutral p-5" aria-labelledby={`lab-${tribe}`}>
                  <div className="flex items-center gap-3">
                    <span className="achievement-orb grid size-12 shrink-0 place-items-center" data-tribe={tribe}>
                      <TribeIcon tribe={tribe} className="size-7" />
                    </span>
                    <div>
                      <h2 id={`lab-${tribe}`} className="font-display text-2xl uppercase tracking-wide">
                        {meta.label} <span className="pixel-text text-xs text-brume">({tribe})</span>
                      </h2>
                      <p className="text-sm text-brume">{meta.universe}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-4">
                    {EGG_LEVELS.map((level) => (
                      <div key={level} className="border-t border-ligne pt-3">
                        <p className="text-sm font-bold">
                          {LEVEL_LABELS[level].name} <span className="font-normal text-brume">({LEVEL_LABELS[level].range}) · « {wordFor(tribe, level)} »</span>
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {meta.variants[level].map((variant) => (
                            <button
                              key={variant.id}
                              type="button"
                              data-egg={`${tribe}.${level}.${variant.id}`}
                              onClick={() => launch(tribe, level, variant.id)}
                              className="btn-glossy inline-flex min-h-11 items-center px-3 text-sm"
                              data-tone={level === "fail" ? "pas" : undefined}
                            >
                              {variant.label}
                              <span className="ml-2 text-xs font-medium opacity-75">{(variant.durationMs / 1000).toLocaleString("fr-FR")} s</span>
                            </button>
                          ))}
                          {meta.variants[level].length > 1 ? (
                            <button type="button" onClick={() => launch(tribe, level)} className="btn-ghost inline-flex min-h-11 items-center px-3 text-sm font-semibold">
                              Au hasard
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            <section className="card-neutral p-5" aria-labelledby="lab-vie">
              <div className="flex items-center gap-3">
                <span className="achievement-orb grid size-12 shrink-0 place-items-center" data-theme="vie-normale">
                  <GrassSun className="size-7" />
                </span>
                <div>
                  <h2 id="lab-vie" className="font-display text-2xl uppercase tracking-wide">
                    {VIE_NORMALE.label} <span className="pixel-text text-xs text-brume">(sans tribu, pas chouffin)</span>
                  </h2>
                  <p className="text-sm text-brume">{VIE_NORMALE.universe}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-brume">
                Réaction 1 fois sur 4 : une fois sur deux l&apos;écran bleu ou NOPE, une fois sur deux la Vie normale. « Au hasard » applique ce vrai tirage.
              </p>
              <div className="mt-2 flex flex-col gap-4">
                {VIE_LEVELS.map((level) => (
                  <div key={level} className="border-t border-ligne pt-3">
                    <p className="text-sm font-bold">
                      {VIE_LEVEL_LABELS[level].name}{" "}
                      <span className="font-normal text-brume">
                        ({VIE_LEVEL_LABELS[level].range}) · « {wordForVie(level)} » ({VIE_NORMALE.samples[level].score})
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {VIE_NORMALE.variants[level].map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          data-egg={`vie.${level}.${variant.id}`}
                          onClick={() => launchVie(level, variant.id)}
                          className="btn-glossy inline-flex min-h-11 items-center px-3 text-sm"
                          data-tone="pas"
                        >
                          {variant.label}
                          <span className="ml-2 text-xs font-medium opacity-75">{(variant.durationMs / 1000).toLocaleString("fr-FR")} s</span>
                        </button>
                      ))}
                      <button type="button" onClick={() => launchVie(level)} className="btn-ghost inline-flex min-h-11 items-center px-3 text-sm font-semibold">
                        Au hasard
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-neutral p-5" aria-labelledby="lab-generic">
              <h2 id="lab-generic" className="font-display text-2xl uppercase tracking-wide">
                Sans tribu
              </h2>
              <p className="text-sm text-brume">Mots neutres et mots adoptés par la communauté : les réactions d&apos;origine.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" data-egg="none.combo.mlg" onClick={() => launchGeneric("mlg")} className="btn-glossy inline-flex min-h-11 items-center px-3 text-sm">
                  Combo MLG
                </button>
                <button type="button" data-egg="none.legendary.mlg" onClick={() => launchGeneric("mlg-legendary")} className="btn-glossy inline-flex min-h-11 items-center px-3 text-sm">
                  MLG légendaire
                </button>
                <button type="button" data-egg="none.fail.bsod" onClick={() => launchGeneric("bsod")} className="btn-glossy inline-flex min-h-11 items-center px-3 text-sm" data-tone="pas">
                  Écran bleu
                </button>
                <button type="button" data-egg="none.fail.nope" onClick={() => launchGeneric("nope")} className="btn-glossy inline-flex min-h-11 items-center px-3 text-sm" data-tone="pas">
                  NOPE
                </button>
              </div>
            </section>

            <section className="card-neutral p-5" aria-labelledby="lab-sim">
              <h2 id="lab-sim" className="font-display text-2xl uppercase tracking-wide">
                Simulateur de verdict
              </h2>
              <p className="text-sm text-brume">Les vraies fréquences : il ne se passe souvent rien, c&apos;est voulu.</p>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor={tribeId}>
                  Tribu
                  <select
                    id={tribeId}
                    value={simTribe}
                    onChange={(event) => setSimTribe(event.target.value as Tribe | "none")}
                    className="min-h-11 rounded-xl border border-ligne bg-nuit-2 px-3 text-base font-normal"
                  >
                    <option value="none">Sans tribu</option>
                    {TRIBES.map((tribe) => (
                      <option key={tribe} value={tribe}>
                        {TRIBE_EGGS[tribe].label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex min-w-48 flex-1 flex-col gap-1 text-sm font-semibold" htmlFor={scoreId}>
                  Score : {simScore} ({simScore >= 51 ? "chouffin" : "pas chouffin"})
                  <input
                    id={scoreId}
                    type="range"
                    min={0}
                    max={100}
                    value={simScore}
                    onChange={(event) => setSimScore(Number(event.target.value))}
                    className="min-h-11 accent-[#b6ff2e]"
                  />
                </label>
                <button type="button" onClick={simulate} className="btn-glossy inline-flex min-h-11 items-center px-4 text-sm">
                  Juger
                </button>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-brume" aria-live="polite">
                {log.map((line, index) => (
                  <li key={`${index}-${line}`}>{line}</li>
                ))}
              </ul>
              <div className="mt-4 border-t border-ligne pt-3">
                <button type="button" onClick={measure} className="btn-ghost inline-flex min-h-11 items-center px-4 text-sm font-semibold">
                  Vérifier les fréquences (10 000 tirages)
                </button>
                <div aria-live="polite">
                  {frequencies ? (
                    <>
                      <table className="mt-3 w-full text-left text-sm" data-testid="frequencies">
                        <caption className="sr-only">Fréquences mesurées sur {frequencies.draws.toLocaleString("fr-FR")} tirages</caption>
                        <thead className="text-brume">
                          <tr>
                            <th scope="col" className="py-1 pr-2 font-semibold">Tirage</th>
                            <th scope="col" className="py-1 pr-2 text-right font-semibold">Mesuré</th>
                            <th scope="col" className="py-1 text-right font-semibold">Attendu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {frequencies.rows.map((row) => (
                            <tr key={row.label} className="border-t border-ligne">
                              <td className={`py-1 pr-2 ${row.label.startsWith("  ") ? "pl-4 text-brume" : ""}`}>{row.label.trim()}</td>
                              <td className="py-1 pr-2 text-right tabular-nums">{percent(row.measured)}</td>
                              <td className="py-1 text-right tabular-nums text-brume">{percent(row.expected)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="mt-3 text-sm text-brume">
                        Apothéoses gamer (attendu {percent(1 / frequencies.gamerLegendary.length)} chacune) :{" "}
                        {frequencies.gamerLegendary.map((entry) => `${entry.id} ${percent(entry.share)}`).join(" · ")}
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        </div>

        <EggLayer overlay={overlay} onDone={clearOverlay} />
        <AchievementToast toast={toast} onDismiss={dismissToast} />
      </MotionConfig>
    </LazyMotion>
  );
}
