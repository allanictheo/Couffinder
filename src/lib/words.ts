/**
 * La base de mots jugés par l'agent juge-chouffin (src/data/words.json),
 * indexée par forme normalisée et par alias.
 */

import seed from "@/data/words.json";
import { lookupCandidates, normalizeKey, stripArticle } from "./normalize";
import type { SeedWord } from "./types";

export interface IndexedWord extends SeedWord {
  /** Clé canonique : c'est sous cette clé que les votes sont comptés. */
  key: string;
}

const WORDS = (seed as SeedWord[]).map((entry) => ({ ...entry, key: normalizeKey(entry.word) }));

const INDEX = new Map<string, IndexedWord>();

function register(form: string, entry: IndexedWord) {
  const key = normalizeKey(form);
  for (const variant of [key, stripArticle(key), key.replace(/ /g, "")]) {
    if (variant && !INDEX.has(variant)) INDEX.set(variant, entry);
  }
}

// Les noms officiels d'abord, les alias ensuite : un alias ne masque jamais un vrai mot.
for (const entry of WORDS) register(entry.word, entry);
for (const entry of WORDS) for (const alias of entry.aliases ?? []) register(alias, entry);

export function findWord(key: string): IndexedWord | null {
  for (const candidate of lookupCandidates(key)) {
    const hit = INDEX.get(candidate);
    if (hit) return hit;
  }
  return null;
}

export const WORD_COUNT = WORDS.length;
export const CHOUFFIN_COUNT = WORDS.filter((entry) => entry.chouffin).length;
