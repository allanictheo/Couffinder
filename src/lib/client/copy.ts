/**
 * Textes d'interface et petites tables de correspondance.
 * Tout est original : on cite les codes de 2010-2015, on ne recopie rien.
 */

import type { Category } from "@/lib/types";

/** Exemples qui défilent dans le champ vide (chouffins et pas chouffins mélangés). */
export const PLACEHOLDER_EXAMPLES = [
  "Kaamelott",
  "La Chouffe",
  "le brunch",
  "un dragon",
  "Sabaton",
  "l'hydromel",
  "le padel",
  "Dark Souls",
  "Warhammer",
  "les Crocs",
  "Donjons et Dragons",
  "le quinoa",
  "un kilt",
  "Joueur du Grenier",
] as const;

export const QUICK_PICKS = ["Kaamelott", "Dragon", "Brunch", "Hydromel"] as const;

export const LOADING_TIPS = [
  "Astuce : un vrai chouffin ne dit pas « bière », il dit « breuvage ».",
  "Consultation de la Table Ronde en cours...",
  "Astuce : Échap zappe les animations. Mais pourquoi ferais-tu une chose pareille ?",
  "Chargement des sous-titres en elfique...",
  "Astuce : le Chouffinder a raison 100 % du temps, sauf quand il a tort.",
  "Lancer de dé de chouffinitude (d20)...",
  "Si tu lis ceci, le serveur boit un coup. Ça arrive.",
] as const;

export const EMPTY_HINTS = [
  "Il faut écrire un mot. Même Perceval y arrive (parfois).",
  "Un champ vide, c'est pas chouffin. C'est juste vide.",
  "Tape quelque chose, n'importe quoi. Enfin, pas n'importe quoi.",
] as const;

export const CATEGORY_LABELS: Record<Category, string> = {
  "series-films": "Séries et films",
  "jeux-video": "Jeux vidéo",
  "fantasy-jdr": "Fantasy et JDR",
  "histoire-mythes": "Histoire et mythes",
  musique: "Musique",
  "youtube-internet": "YouTube et internet",
  boissons: "Boissons",
  nourriture: "Nourriture",
  "mode-style": "Mode et style",
  sport: "Sport",
  loisirs: "Loisirs",
  tech: "Tech",
  "lieux-events": "Lieux et événements",
  personnalites: "Personnalités",
  quotidien: "Vie quotidienne",
};

/**
 * Rareté façon butin de MMORPG : la couleur du nom de l'objet dépend de sa
 * chouffinitude. Teintes éclaircies pour tenir le contraste AA sur fond nuit.
 */
export interface Rarity {
  id: "poor" | "common" | "uncommon" | "rare" | "epic" | "legendary";
  label: string;
  color: string;
}

export function rarityFor(score: number, legendary: boolean): Rarity {
  if (legendary || score >= 95) return { id: "legendary", label: "Légendaire", color: "var(--color-rarity-legendary)" };
  if (score >= 86) return { id: "epic", label: "Épique", color: "var(--color-rarity-epic)" };
  if (score >= 71) return { id: "rare", label: "Rare", color: "var(--color-rarity-rare)" };
  if (score >= 51) return { id: "uncommon", label: "Inhabituel", color: "var(--color-rarity-uncommon)" };
  if (score >= 21) return { id: "common", label: "Classique", color: "var(--color-rarity-common)" };
  return { id: "poor", label: "Médiocre", color: "var(--color-rarity-poor)" };
}

export const ACHIEVEMENTS = [
  "Chouffin certifié",
  "Tavernier d'honneur",
  "Maître du donjon",
  "Hydromel à volonté",
  "Roi de la LAN",
  "Arrête, c'est très chouffin",
] as const;

export const DOGE_TEMPLATES = [
  "wow",
  "such chouffin",
  "very {word}",
  "much hydromel",
  "so médiéval",
  "many taverne",
  "such Kaamelott",
  "very légendaire",
] as const;

const numberFormat = new Intl.NumberFormat("fr-FR");

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export function plural(count: number, singular: string, pluralForm: string): string {
  return `${formatNumber(count)} ${count > 1 ? pluralForm : singular}`;
}

export function pick<T>(items: readonly T[], random: () => number = Math.random): T {
  return items[Math.floor(random() * items.length)];
}

/** PRNG déterministe (mulberry32) : même graine, même chaos. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shareUrl(word: string): string {
  const params = new URLSearchParams({ q: word });
  return `${window.location.origin}/?${params.toString()}`;
}
