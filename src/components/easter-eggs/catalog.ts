/**
 * Catalogue des easter eggs par tribu et par niveau de score.
 *
 * Données pures (aucun composant) : ce module est dans le bundle principal, les
 * animations elles-mêmes sont chargées à la demande, une tribu à la fois.
 *
 * Fréquences (inchangées par rapport au combo MLG d'origine) :
 * - verdict chouffin : 1 fois sur 3 au hasard, toujours si légendaire ;
 * - verdict pas chouffin : 1 fois sur 4.
 */

import { ACHIEVEMENTS, pick } from "@/lib/client/copy";
import type { SfxName } from "@/lib/sound";
import type { KnownResult, Tribe } from "@/lib/types";

export const COMBO_CHANCE = 1 / 3;
export const FAIL_CHANCE = 1 / 4;

export const EGG_LEVELS = ["fail", "small", "combo", "legendary"] as const;
export type EggLevel = (typeof EGG_LEVELS)[number];

export const LEVEL_LABELS: Record<EggLevel, { name: string; range: string }> = {
  fail: { name: "Échec thématique", range: "0 à 50" },
  small: { name: "Petite réaction", range: "51 à 69" },
  combo: { name: "Gros combo", range: "70 à 94" },
  legendary: { name: "Apothéose légendaire", range: "95 à 100" },
};

export interface EggToast {
  /** Petite ligne au-dessus du titre (« Succès déverrouillé » par défaut). */
  kicker?: string;
  title: string;
  points: number;
  tone: "win" | "fail";
}

export interface EggVariant {
  id: string;
  label: string;
  durationMs: number;
  /** Succès affiché en parallèle (gros combo et légendaire) ou seul en mouvement réduit. */
  toast: EggToast;
  /** Fait trembler la page derrière l'animation. */
  shake?: boolean;
}

export interface TribeMeta {
  label: string;
  universe: string;
  /** Vrais mots de la base, par niveau, pour la page de prévisualisation. */
  samples: Record<EggLevel, string>;
  variants: Record<EggLevel, readonly EggVariant[]>;
}

const win = (title: string, points: number): EggToast => ({ title, points, tone: "win" });
const fail = (kicker: string, title: string): EggToast => ({ kicker, title, points: 0, tone: "fail" });

export const TRIBE_EGGS: Record<Tribe, TribeMeta> = {
  gamer: {
    label: "Gamers",
    universe: "Montage MLG, arcade, FPS, jeux de baston",
    samples: { fail: "Candy Crush", small: "Rage quit", combo: "Minecraft", legendary: "Skyrim" },
    variants: {
      fail: [
        { id: "souls", label: "Vous êtes mort", durationMs: 2800, toast: fail("Game over", "Vous êtes mort") },
        { id: "arcade", label: "Game over arcade", durationMs: 2800, toast: fail("Game over", "Insère une pièce") },
      ],
      small: [{ id: "xp", label: "Level up", durationMs: 1600, toast: win("Level up", 10) }],
      combo: [
        { id: "killstreak", label: "Série d'éliminations", durationMs: 2800, toast: win("Pentakill de chouffinitude", 50), shake: true },
        { id: "baston", label: "Combo de baston", durationMs: 2900, toast: win("K.O. parfait", 50) },
        { id: "nyan", label: "Nyan-chope", durationMs: 2800, toast: win("Arc-en-ciel pixelisé", 30) },
      ],
      legendary: [
        { id: "illuminati", label: "Illuminati confirmé", durationMs: 3400, toast: win("Illuminati confirmé", 100), shake: true },
        { id: "konami", label: "Code triche", durationMs: 3500, toast: win("Code triche activé", 100) },
      ],
    },
  },
  geek: {
    label: "Geeks",
    universe: "Sorciers, sabres laser, super-héros, science-fiction",
    samples: { fail: "Twilight", small: "Chauve-souris", combo: "Combat au sabre laser", legendary: "Star Wars" },
    variants: {
      fail: [
        { id: "snap", label: "Claquement de doigts", durationMs: 2900, toast: fail("Snap", "Réduit en poussière") },
        { id: "moldu", label: "Moldu !", durationMs: 2600, toast: fail("Choixpeau", "Moldu confirmé") },
      ],
      small: [{ id: "choixpeau", label: "Choixpeau", durationMs: 1900, toast: win("Réparti chez les chouffins", 10) }],
      combo: [
        { id: "sabre", label: "Sabre laser", durationMs: 2800, toast: win("Que la Chouffe soit avec toi", 50) },
        { id: "matrix", label: "Pluie de code", durationMs: 2900, toast: win("Pilule chouffin avalée", 50) },
        { id: "patronus", label: "Patronus", durationMs: 2900, toast: win("Expecto chouffinum", 50) },
      ],
      legendary: [
        { id: "hyperespace", label: "Saut en hyperespace", durationMs: 3700, toast: win("Élu de la prophétie", 100) },
        { id: "gantelet", label: "Gantelet", durationMs: 3500, toast: win("Parfaitement équilibré", 100), shake: true },
      ],
    },
  },
  metal: {
    label: "Métalleux",
    universe: "Métal, festival, pogo, pyrotechnie",
    samples: { fail: "Imagine Dragons", small: "Guitare", combo: "Rammstein", legendary: "Hellfest" },
    variants: {
      fail: [{ id: "larsen", label: "Corde cassée", durationMs: 2800, toast: fail("Larsen", "Corde cassée") }],
      small: [{ id: "cornes", label: "Cornes du diable", durationMs: 1600, toast: win("Cornes levées", 10) }],
      combo: [
        { id: "pyro", label: "Pyrotechnie", durationMs: 2800, toast: win("Pyrotechnie approuvée", 50), shake: true },
        { id: "pogo", label: "Pogo", durationMs: 3000, toast: win("Survivant du pogo", 50), shake: true },
      ],
      legendary: [
        { id: "solo", label: "Solo légendaire", durationMs: 3400, toast: win("Dieu du riff", 100), shake: true },
        { id: "onze", label: "Ampli à 11", durationMs: 3500, toast: win("Monté jusqu'à 11", 100), shake: true },
      ],
    },
  },
  taverne: {
    label: "Taverne",
    universe: "Bière, hydromel, banquet, le gras",
    samples: { fail: "Spritz", small: "Tartiflette", combo: "Cuisse de dinde", legendary: "Hydromel" },
    variants: {
      fail: [{ id: "derniere", label: "Dernière tournée", durationMs: 2800, toast: fail("Dernière tournée", "Le tavernier a dit non") }],
      small: [{ id: "sante", label: "Santé !", durationMs: 1500, toast: win("Santé !", 10) }],
      combo: [
        { id: "tournee", label: "Tournée générale", durationMs: 2900, toast: win("Tournée générale", 50) },
        { id: "gras", label: "Le gras, c'est la vie", durationMs: 2900, toast: win("Le gras, c'est la vie", 50) },
        { id: "mousse", label: "La mousse déborde", durationMs: 2800, toast: win("Mousse parfaite", 50) },
      ],
      legendary: [
        { id: "banquet", label: "Banquet des dieux", durationMs: 3500, toast: win("Convié au banquet des dieux", 100) },
        { id: "patron", label: "Tournée du patron", durationMs: 3400, toast: win("Tournée du patron", 100) },
      ],
    },
  },
  weeb: {
    label: "Weebs",
    universe: "Mangas, animés, Japon, kawaii",
    samples: { fail: "K-pop", small: "Japon", combo: "Naruto", legendary: "Dragon Ball" },
    variants: {
      fail: [
        { id: "goutte", label: "Goutte de sueur", durationMs: 2600, toast: fail("Goutte de sueur", "Baka...") },
        { id: "table", label: "Table retournée", durationMs: 2600, toast: fail("(╯°□°)╯︵ ┻━┻", "Table retournée") },
      ],
      small: [{ id: "kawaii", label: "Kawaii", durationMs: 1600, toast: win("Kawaii certifié", 10) }],
      combo: [
        { id: "nani", label: "NANI ?!", durationMs: 2800, toast: win("Nani ?!", 50), shake: true },
        { id: "henshin", label: "Transformation", durationMs: 2900, toast: win("Transformation réussie", 50) },
      ],
      legendary: [
        { id: "neufmille", label: "Plus de 9000", durationMs: 3500, toast: win("Plus de 9000 !", 100), shake: true },
        { id: "senpai", label: "Senpai a remarqué", durationMs: 3400, toast: win("Senpai t'a remarqué", 100) },
      ],
    },
  },
  roliste: {
    label: "Rôlistes",
    universe: "JdR, d20, médiéval, Table Ronde",
    samples: { fail: "Monopoly", small: "Fort Boyard", combo: "Jeu de rôle papier", legendary: "Kaamelott" },
    variants: {
      fail: [{ id: "echec", label: "Échec critique", durationMs: 2900, toast: fail("Échec critique", "1 naturel") }],
      small: [{ id: "parchemin", label: "Parchemin", durationMs: 1900, toast: win("Approuvé par le MJ", 10) }],
      combo: [
        { id: "jet", label: "Jet de d20", durationMs: 2900, toast: win("Jet réussi", 50) },
        { id: "adoubement", label: "Adoubement", durationMs: 3000, toast: win("Chevalier de la Chouffe", 50) },
      ],
      legendary: [
        { id: "vingt", label: "20 naturel", durationMs: 3600, toast: win("Coup critique !", 100), shake: true },
        { id: "blason", label: "Blason", durationMs: 3500, toast: win("Suzerain de la taverne", 100) },
      ],
    },
  },
};

/** Score représentatif de chaque niveau (page de prévisualisation). */
export const LEVEL_SAMPLE_SCORES: Record<EggLevel, number> = { fail: 18, small: 63, combo: 82, legendary: 97 };

export function findVariant(tribe: Tribe, level: EggLevel, id: string): EggVariant {
  const variants = TRIBE_EGGS[tribe].variants[level];
  return variants.find((variant) => variant.id === id) ?? variants[0];
}

/** Le niveau d'animation d'un verdict : le drapeau chouffin d'abord (un vote peut l'avoir renversé), puis le score. */
export function eggLevel(result: Pick<KnownResult, "chouffin" | "score" | "legendary">): EggLevel {
  if (!result.chouffin) return "fail";
  if (result.legendary || result.score >= 95) return "legendary";
  if (result.score >= 70) return "combo";
  return "small";
}

export type OverlaySpec =
  | { kind: "mlg"; word: string; legendary: boolean }
  | { kind: "sad"; word: string; variant: "bsod" | "nope" }
  | { kind: "tribe"; word: string; score: number; tribe: Tribe; level: EggLevel; variant: string };

export interface ToastSpec {
  points: number;
  title: string;
  kicker?: string;
  tribe?: Tribe | null;
  tone?: "win" | "fail";
}

export interface SurprisePlan {
  overlay: OverlaySpec | null;
  toast: ToastSpec | null;
  /** Son générique joué par l'hôte (tampon, tuile, succès). */
  sfx: SfxName | null;
  /** Petite signature sonore thématique (mouvement réduit). */
  sting: { tribe: Tribe; level: EggLevel } | null;
  shake: boolean;
}

const NOTHING: SurprisePlan = { overlay: null, toast: null, sfx: null, sting: null, shake: false };

export interface PlanOptions {
  random?: () => number;
  /** L'utilisateur préfère les animations réduites : toast statique au lieu de l'animation. */
  reduced?: boolean;
  /** Ignore le hasard (page de prévisualisation). */
  force?: boolean;
  /** Impose une variante (page de prévisualisation). */
  variant?: string;
}

function toastFor(tribe: Tribe, variant: EggVariant): ToastSpec {
  return { ...variant.toast, tribe };
}

/**
 * Décide, au hasard, de la surprise qui accompagne un verdict. Pure et testable :
 * l'hôte (l'application ou la page de prévisualisation) applique le plan.
 */
export function planSurprise(
  result: Pick<KnownResult, "word" | "chouffin" | "score" | "legendary" | "tribe">,
  { random = Math.random, reduced = false, force = false, variant: forcedVariant }: PlanOptions = {},
): SurprisePlan {
  // Une tribu inconnue du catalogue (donnée future ou corrompue) retombe sur les réactions génériques.
  const tribe = result.tribe && Object.hasOwn(TRIBE_EGGS, result.tribe) ? result.tribe : null;
  const level = eggLevel(result);

  if (result.chouffin) {
    const play = force || result.legendary || random() < COMBO_CHANCE;
    if (!play) return { ...NOTHING, sfx: "stamp" };

    if (!tribe) {
      // Mot sans tribu : le combo MLG générique d'origine.
      const toast: ToastSpec = {
        points: result.legendary ? 100 : pick([10, 20, 30, 50], random),
        title: result.legendary ? "Légende vivante" : pick(ACHIEVEMENTS, random),
      };
      if (reduced) return { ...NOTHING, toast, sfx: "achievement" };
      return { ...NOTHING, toast, overlay: { kind: "mlg", word: result.word, legendary: result.legendary }, shake: true };
    }

    const variant = forcedVariant ? findVariant(tribe, level, forcedVariant) : pick(TRIBE_EGGS[tribe].variants[level], random);
    const toast = toastFor(tribe, variant);
    if (reduced) return { ...NOTHING, toast, sting: { tribe, level } };
    return {
      ...NOTHING,
      // La petite réaction se suffit à elle-même ; les gros moments ont leur succès.
      toast: level === "small" ? null : toast,
      overlay: { kind: "tribe", word: result.word, score: result.score, tribe, level, variant: variant.id },
      shake: variant.shake ?? false,
    };
  }

  if (!tribe) {
    if (reduced || !(force || random() < FAIL_CHANCE)) return { ...NOTHING, sfx: "flat" };
    return { ...NOTHING, overlay: { kind: "sad", word: result.word, variant: random() < 0.5 ? "bsod" : "nope" } };
  }

  if (!(force || random() < FAIL_CHANCE)) return { ...NOTHING, sfx: "flat" };
  const variant = forcedVariant ? findVariant(tribe, "fail", forcedVariant) : pick(TRIBE_EGGS[tribe].variants.fail, random);
  if (reduced) return { ...NOTHING, toast: toastFor(tribe, variant), sting: { tribe, level: "fail" } };
  return {
    ...NOTHING,
    overlay: { kind: "tribe", word: result.word, score: result.score, tribe, level: "fail", variant: variant.id },
    shake: variant.shake ?? false,
  };
}
