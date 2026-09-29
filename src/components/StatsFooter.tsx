"use client";

import { useEffect, useState } from "react";
import { fetchStats } from "@/lib/client/api";
import type { StatsResponse } from "@/lib/types";
import { CountUp } from "./CountUp";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <li className="flex flex-col items-center">
      <CountUp value={value} className="font-display text-2xl text-parchemin tabular-nums" />
      <span className="text-xs text-brume">{label}</span>
    </li>
  );
}

export function StatsFooter({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchStats(controller.signal)
      .then((data) => setStats(data))
      .catch(() => {
        // Les compteurs sont un bonus : en cas d'échec, on ne dit rien.
      });
    return () => controller.abort();
  }, [refreshKey]);

  return (
    <footer className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6 text-center sm:px-6">
      {stats ? (
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4" aria-label="Statistiques du Chouffinder">
          <Stat value={stats.words} label={stats.words > 1 ? "mots jugés" : "mot jugé"} />
          <Stat value={stats.chouffinWords} label={stats.chouffinWords > 1 ? "chouffins recensés" : "chouffin recensé"} />
          <Stat value={stats.votes} label={stats.votes > 1 ? "votes de la taverne" : "vote de la taverne"} />
        </ul>
      ) : (
        <div className="h-[3.25rem]" aria-hidden="true" />
      )}
      {stats && !stats.persistent ? (
        <p className="mt-3 text-xs text-brume">Mode démo : les votes s&apos;envolent au redémarrage du serveur.</p>
      ) : null}
      <p className="mx-auto mt-6 max-w-md text-sm text-brume">
        Chouffinder, c&apos;est de l&apos;humour affectueux. Aucun chouffin n&apos;a été maltraité pendant la fabrication de ce site
        (quelques-uns ont été gentiment vannés).
      </p>
    </footer>
  );
}
