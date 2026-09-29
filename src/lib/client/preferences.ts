/**
 * Préférences et mémoire locale du visiteur (jamais envoyées au serveur).
 */

import type { VoteChoice } from "@/lib/types";
import { playSfx, type SfxHandle, type SfxName } from "@/lib/sound";
import { createLocalStore } from "./local-store";

/** Son coupé par défaut : on ne klaxonne pas sans prévenir. */
export const soundStore = createLocalStore<boolean>(
  "chouffinder:sound",
  (raw) => raw === "on",
  (value) => (value ? "on" : "off"),
);

export type VoteMap = Readonly<Record<string, VoteChoice>>;

function parseVotes(raw: string | null): VoteMap {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const votes: Record<string, VoteChoice> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "chouffin" || value === "pas-chouffin") votes[key] = value;
    }
    return votes;
  } catch {
    return {};
  }
}

/** Clé normalisée (renvoyée par l'API) vers choix du visiteur. */
export const votesStore = createLocalStore<VoteMap>("chouffinder:votes", parseVotes, (value) =>
  JSON.stringify(value),
);

export function rememberVote(key: string, choice: VoteChoice) {
  votesStore.set({ ...votesStore.getSnapshot(), [key]: choice });
}

/** Joue un effet sonore seulement si le visiteur a activé le son. */
export function sfx(name: SfxName): SfxHandle | null {
  if (!soundStore.getSnapshot()) return null;
  return playSfx(name);
}
