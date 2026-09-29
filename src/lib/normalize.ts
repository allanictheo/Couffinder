/**
 * Normalisation des saisies : "  Le Seigneur des Anneaux ! " et "seigneur des anneaux"
 * doivent tomber sur la même entrée de la base.
 */

export const MAX_INPUT_LENGTH = 48;

const ARTICLE = /^(?:le|la|les|l|un|une|des|du|d|de la|de l|the) /;

/** Minuscules, sans accents ni ponctuation, espaces simples. Idempotente. */
export function normalizeKey(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/ß/g, "ss")
    .replace(/&/g, " et ")
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Retire un article en tête : "le seigneur des anneaux" devient "seigneur des anneaux". */
export function stripArticle(key: string): string {
  const stripped = key.replace(ARTICLE, "");
  return stripped.length > 0 ? stripped : key;
}

/** Singulier naïf, mot par mot : "chevaliers noirs" devient "chevalier noir". */
export function singularize(key: string): string {
  return key
    .split(" ")
    .map((token) => (token.length > 3 && /[sx]$/.test(token) ? token.slice(0, -1) : token))
    .join(" ");
}

/** Toutes les formes sous lesquelles on cherche une saisie dans la base, de la plus précise à la plus tolérante. */
export function lookupCandidates(key: string): string[] {
  const noArticle = stripArticle(key);
  const forms = [key, noArticle, singularize(key), singularize(noArticle)];
  const compact = forms.map((form) => form.replace(/ /g, ""));
  return [...new Set([...forms, ...compact])];
}

export type InputCheck = { ok: true; label: string; key: string } | { ok: false; message: string };

/** Valide une saisie brute avant toute recherche. */
export function checkInput(raw: unknown): InputCheck {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return { ok: false, message: "Il faut taper un mot. Même Perceval y arrive (parfois)." };
  }
  const label = raw.replace(/\s+/g, " ").trim();
  if (label.length > MAX_INPUT_LENGTH) {
    return {
      ok: false,
      message: `C'est un mot qu'on te demande, pas un parchemin. ${MAX_INPUT_LENGTH} caractères maximum.`,
    };
  }
  if (/https?:|www\.|:\/\/|\.(?:com|fr|net|org|io|gg|xyz)\b/i.test(label)) {
    return { ok: false, message: "Pas de liens ici, on n'est pas sur un forum de spam. Juste un mot." };
  }
  if (!/^[\p{L}\p{M}\p{N} '’.,&!?:+#-]+$/u.test(label)) {
    return {
      ok: false,
      message: "Ce mot contient des runes interdites. Lettres, chiffres, espaces et tirets uniquement.",
    };
  }
  const key = normalizeKey(label);
  if (key.length === 0) {
    return { ok: false, message: "Ça, c'est de la ponctuation, pas un mot. C'est pas faux, mais c'est pas un mot." };
  }
  return { ok: true, label, key };
}
