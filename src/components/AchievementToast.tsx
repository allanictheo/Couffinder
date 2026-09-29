"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect } from "react";
import type { Tribe } from "@/lib/types";
import { Trophy } from "./art";
import { TribeIcon } from "./easter-eggs/icons";

export interface ToastData {
  id: number;
  points: number;
  title: string;
  /** Petite ligne au-dessus du titre (« Succès déverrouillé » par défaut). */
  kicker?: string;
  /** Tribu du mot : l'orbe prend ses couleurs et son icône. */
  tribe?: Tribe | null;
  /** « fail » pour les échecs thématiques (mouvement réduit). */
  tone?: "win" | "fail";
}

export const TOAST_DURATION_MS = 4200;

/**
 * « Succès déverrouillé » façon console de salon 2010 : l'orbe apparaît,
 * puis la pilule se déroule. Décoratif (le verdict est annoncé ailleurs).
 * Aux couleurs de la tribu du mot quand il en a une.
 */
export function AchievementToast({ toast, onDismiss }: { toast: ToastData | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  const failed = toast?.tone === "fail";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4" aria-hidden="true">
      <AnimatePresence>
        {toast ? (
          <m.div
            key={toast.id}
            className="achievement flex max-w-full items-center gap-3 py-2 pl-2 pr-6"
            data-tone={toast.tone ?? "win"}
            initial={{ opacity: 0, scale: 0.6, clipPath: "inset(0% 80% 0% 0% round 999px)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 999px)" }}
            exit={{ opacity: 0, y: 24, transition: { duration: 0.25 } }}
            transition={{
              opacity: { duration: 0.15 },
              scale: { type: "spring", stiffness: 500, damping: 22 },
              clipPath: { delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <span className="achievement-orb grid size-12 shrink-0 place-items-center" data-tribe={toast.tribe ?? undefined}>
              {toast.tribe ? <TribeIcon tribe={toast.tribe} className="size-7" /> : <Trophy className="size-6" />}
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className={`text-xs ${failed ? "text-[#ffb3ba]" : "text-white/75"}`}>
                {toast.kicker ?? "Succès déverrouillé"}
              </span>
              <span className="truncate font-bold">
                {failed ? null : (
                  <>
                    <span className="text-hydromel">{toast.points} G</span> ·{" "}
                  </>
                )}
                {toast.title}
              </span>
            </span>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
