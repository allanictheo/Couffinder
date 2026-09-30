/**
 * Catalogue des easter eggs par tribu et par niveau de score, plus la famille
 * « Vie normale » (mots pas chouffin sans tribu).
 *
 * Données pures (aucun composant) : ce module est dans le bundle principal, les
 * animations elles-mêmes sont chargées à la demande, un module à la fois.
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

/** Thème visuel d'un toast hors tribu (orbe et icône propres). */
export type ToastTheme = "vie-normale";

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
        { id: "loot", label: "Butin légendaire", durationMs: 3700, toast: win("Butin légendaire ramassé", 100) },
        { id: "speedrun", label: "Record du monde", durationMs: 3700, toast: win("Record du monde (any%)", 100) },
        { id: "boss", label: "Boss final vaincu", durationMs: 3700, toast: win("Boss final vaincu", 100), shake: true },
        { id: "evolution", label: "Évolution", durationMs: 3700, toast: win("Évolution ultime", 100) },
        { id: "ragequit", label: "Rage quit inversé", durationMs: 3400, toast: win("Victoire par abandon", 100) },
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

/* ------------------------------------------------------------------ */
/* Famille « Vie normale »                                             */
/* ------------------------------------------------------------------ */

/**
 * Mots pas chouffin sans tribu (le brunch, le padel, le lundi) : la vraie vie,
 * que le chouffin fuit, célébrée avec une ironie affectueuse. Déclinée en trois
 * tranches de score ; elle rejoint l'écran bleu et NOPE dans le même tirage.
 */
export const VIE_LEVELS = ["normie", "ordinaire", "presque"] as const;
export type VieLevel = (typeof VIE_LEVELS)[number];

export const VIE_LEVEL_LABELS: Record<VieLevel, { name: string; range: string }> = {
  normie: { name: "Normie absolu", range: "0 à 20" },
  ordinaire: { name: "Vie ordinaire", range: "21 à 40" },
  presque: { name: "Presque chouffin", range: "41 à 50" },
};

/** Tranche « Vie normale » d'un score (un verdict renversé par la communauté peut dépasser 50 : c'est « presque »). */
export function vieLevel(score: number): VieLevel {
  if (score <= 20) return "normie";
  if (score <= 40) return "ordinaire";
  return "presque";
}

/** Les deux réactions d'origine, tirées avec la famille « Vie normale ». */
export const SAD_VARIANTS = ["bsod", "nope"] as const;
export type SadVariantId = (typeof SAD_VARIANTS)[number];

export interface FamilyMeta<Level extends string> {
  label: string;
  universe: string;
  /** Vrais mots de la base (sans tribu), par tranche, pour la page de prévisualisation. */
  samples: Record<Level, { word: string; score: number }>;
  variants: Record<Level, readonly EggVariant[]>;
}

const irl = (title: string, points: number): EggToast => ({ kicker: "Succès IRL déverrouillé", title, points, tone: "win" });
const almost = (title: string): EggToast => ({ kicker: "Presque chouffin", title, points: 0, tone: "fail" });

export const VIE_NORMALE: FamilyMeta<VieLevel> = {
  label: "Vie normale",
  universe: "Herbe, soleil, impôts et lundis : la vraie vie, que le chouffin fuit",
  samples: {
    normie: { word: "Padel", score: 3 },
    ordinaire: { word: "Télétravail", score: 38 },
    presque: { word: "Camping", score: 44 },
  },
  variants: {
    normie: [
      { id: "herbe", label: "Touche de l'herbe", durationMs: 3500, toast: irl("Première sortie de l'année", 5) },
      { id: "soleil", label: "La grande lumière jaune", durationMs: 3500, toast: irl("Exposé à la lumière du jour", 5) },
      { id: "chargement", label: "Chargement de la vie normale", durationMs: 3700, toast: irl("Adulte fonctionnel", 5) },
    ],
    ordinaire: [
      { id: "reveil", label: "Réveil du lundi", durationMs: 2900, toast: irl("Levé du premier coup", 5) },
      { id: "reseau", label: "Réseau pro", durationMs: 3000, toast: irl("Profil complété à 100 %", 5) },
      { id: "avocat", label: "Pluie d'avocado toasts", durationMs: 2900, toast: irl("Brunch validé", 5) },
      { id: "adulte", label: "Mode adulte activé", durationMs: 3000, toast: irl("Couché avant minuit", 5) },
    ],
    presque: [
      { id: "poteau", label: "Si près du but", durationMs: 1900, toast: almost("Sur le poteau") },
      { id: "chope", label: "Il manque une Chouffe", durationMs: 1900, toast: almost("Il manque juste une Chouffe") },
    ],
  },
};

export function findVieVariant(level: VieLevel, id: string): EggVariant {
  const variants = VIE_NORMALE.variants[level];
  return variants.find((variant) => variant.id === id) ?? variants[0];
}

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
  | { kind: "sad"; word: string; variant: SadVariantId }
  | { kind: "tribe"; word: string; score: number; tribe: Tribe; level: EggLevel; variant: string }
  | { kind: "vie"; word: string; score: number; level: VieLevel; variant: string };

export interface ToastSpec {
  points: number;
  title: string;
  kicker?: string;
  tribe?: Tribe | null;
  /** Thème hors tribu (famille « Vie normale »). */
  theme?: ToastTheme;
  tone?: "win" | "fail";
}

/** Petite signature sonore thématique (mouvement réduit) : une tribu, ou la famille « Vie normale ». */
export type StingSpec = { family: Tribe; level: EggLevel } | { family: "vie-normale"; level: VieLevel };

export interface SurprisePlan {
  overlay: OverlaySpec | null;
  toast: ToastSpec | null;
  /** Son générique joué par l'hôte (tampon, tuile, succès). */
  sfx: SfxName | null;
  /** Petite signature sonore thématique (mouvement réduit). */
  sting: StingSpec | null;
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

function vieToast(variant: EggVariant): ToastSpec {
  return { ...variant.toast, theme: "vie-normale" };
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
    if (reduced) return { ...NOTHING, toast, sting: { family: tribe, level } };
    return {
      ...NOTHING,
      // La petite réaction se suffit à elle-même ; les gros moments ont leur succès.
      toast: level === "small" ? null : toast,
      overlay: { kind: "tribe", word: result.word, score: result.score, tribe, level, variant: variant.id },
      shake: variant.shake ?? false,
    };
  }

  if (!tribe) {
    if (!(force || random() < FAIL_CHANCE)) return { ...NOTHING, sfx: "flat" };
    const tier = vieLevel(result.score);
    const family = VIE_NORMALE.variants[tier];

    // Mouvement réduit : l'écran bleu et NOPE n'ont pas de version statique, la famille « Vie normale » si (son succès IRL).
    if (reduced) {
      const variant = forcedVariant ? findVieVariant(tier, forcedVariant) : pick(family, random);
      return { ...NOTHING, toast: vieToast(variant), sting: { family: "vie-normale", level: tier } };
    }

    // Une fois sur deux une réaction d'origine (écran bleu ou NOPE), une fois sur deux la « Vie normale ».
    const choice =
      forcedVariant ??
      (random() < 0.5 ? pick(SAD_VARIANTS, random) : pick(family.map((variant) => variant.id), random));
    if (choice === "bsod" || choice === "nope") return { ...NOTHING, overlay: { kind: "sad", word: result.word, variant: choice } };
    const variant = findVieVariant(tier, choice);
    return {
      ...NOTHING,
      // La petite taquinerie « presque chouffin » se suffit à elle-même ; les autres ont leur succès IRL.
      toast: tier === "presque" ? null : vieToast(variant),
      overlay: { kind: "vie", word: result.word, score: result.score, level: tier, variant: variant.id },
    };
  }

  if (!(force || random() < FAIL_CHANCE)) return { ...NOTHING, sfx: "flat" };
  const variant = forcedVariant ? findVariant(tribe, "fail", forcedVariant) : pick(TRIBE_EGGS[tribe].variants.fail, random);
  if (reduced) return { ...NOTHING, toast: toastFor(tribe, variant), sting: { family: tribe, level: "fail" } };
  return {
    ...NOTHING,
    overlay: { kind: "tribe", word: result.word, score: result.score, tribe, level: "fail", variant: variant.id },
    shake: variant.shake ?? false,
  };
}
