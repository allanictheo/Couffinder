"use client";

import { useCallback, useSyncExternalStore } from "react";
import { soundStore, votesStore } from "@/lib/client/preferences";
import { playSfx, unlockAudio } from "@/lib/sound";
import type { VoteChoice } from "@/lib/types";

/** Préférence son (coupé par défaut, mémorisée en localStorage). */
export function useSoundPreference() {
  const enabled = useSyncExternalStore(
    soundStore.subscribe,
    soundStore.getSnapshot,
    soundStore.getServerSnapshot,
  );

  const setEnabled = useCallback((next: boolean) => {
    soundStore.set(next);
    if (next) {
      // On est dans un clic : c'est le moment de déverrouiller l'audio.
      unlockAudio();
      playSfx("toggle");
    }
  }, []);

  return { enabled, setEnabled };
}

/** Le vote mémorisé localement pour une clé normalisée, ou null. */
export function useMyVote(key: string): VoteChoice | null {
  const votes = useSyncExternalStore(
    votesStore.subscribe,
    votesStore.getSnapshot,
    votesStore.getServerSnapshot,
  );
  return votes[key] ?? null;
}
