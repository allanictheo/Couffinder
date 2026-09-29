/**
 * Protection du site public : insultes, injures, propos haineux, et noms de personnes.
 *
 * Les listes ci-dessous contiennent volontairement des termes offensants : c'est le
 * principe d'un filtre. Elles sont comparées à une forme normalisée de la saisie
 * (sans accents, leet speak décodé, lettres étirées compactées).
 */

import { normalizeKey } from "./normalize";

type Kind = "hate" | "insult";

export type ModerationResult = { blocked: false } | { blocked: true; kind: Kind; message: string };

/** Termes haineux cherchés n'importe où dans la saisie compactée (racines longues, sans faux positifs connus). */
const HATE_ROOTS = [
  "negre",
  "nigger",
  "nigga",
  "bougnoul",
  "crouille",
  "chinetoque",
  "chintok",
  "chinetok",
  "youpin",
  "youtre",
  "tarlouze",
  "tafiole",
  "fiotte",
  "gouine",
  "faggot",
  "hitler",
  "siegheil",
  "nazi",
  "kukluxklan",
  "whitepower",
  "whitesupremac",
  "ratonnade",
  "sousrace",
  "bamboula",
];

/** Termes haineux courts ou ambigus : seulement s'ils forment un mot entier. */
const HATE_TOKENS = [
  "pd",
  "pede",
  "negro",
  "bicot",
  "arbi",
  "fag",
  "dyke",
  "tranny",
  "travelo",
  "kike",
  "chink",
  "spic",
  "gook",
  "paki",
  "coon",
  "triso",
  "golmon",
  "kkk",
];

const HATE_PHRASES = [
  /\bsale (?:noire?|arabe|juif|juive|blanc|blanche|chinois|chinoise|asiat|asiatique|musulmane?|pedale|tapette|mongol|negre|race|renoi|rebeu|feuj|gitane?|rom|roumaine?|pd|homo|lesbienne|trans|handicape|autiste|singe|macaque|gros|grosse|immigre|etranger|migrant)s?\b/,
  /\b(?:mort aux|a mort les|gazer les|heil|white power|ku klux|retourne dans ton pays)\b/,
];

const INSULT_ROOTS = [
  "connard",
  "connasse",
  "encul",
  "enfoire",
  "fuck",
  "bitch",
  "asshole",
  "trouduc",
  "filsdepute",
  "niquetamere",
  "niquetarace",
  "pouffiasse",
  "petasse",
  "grognasse",
  "raclure",
  "sousmerde",
  "salopard",
  "branleur",
  "branlette",
  "pedophil",
  "zoophil",
  "porno",
  "sodomi",
  "masturb",
  "ejacul",
  "partouze",
];

const INSULT_TOKENS = [
  "con",
  "conne",
  "salope",
  "salop",
  "pute",
  "fdp",
  "ntm",
  "tg",
  "nique",
  "niquer",
  "nik",
  "niker",
  "bite",
  "couille",
  "abruti",
  "abrutie",
  "debile",
  "batard",
  "merdeux",
  "salaud",
  "cassos",
  "cunt",
  "whore",
  "slut",
  "bastard",
  "dickhead",
  "shithead",
  "wanker",
  "twat",
  "fck",
  "fuk",
];

const INSULT_PHRASES = [
  /\b(?:ta gueule|ferme ta gueule|ta mere|ta race|nique ta|nique sa|va te faire|trou du cul|sac a merde|tete de noeud|attarde mental|gros porc|grosse truie|gros lard|grosse vache)\b/,
  /\bfils de (?:pute|p|chien|chienne|catin)\b/,
];

const HATE_NUMBERS = /\b(?:14\s*[/.-]?\s*88|1488)\b/;

const HATE_MESSAGES = [
  "Les propos racistes, homophobes ou haineux n'ont pas leur place ici. Ni à Kaamelott, ni ailleurs. Choisis mieux tes mots.",
  "Non. Ce genre de mot, on ne le juge pas, on le laisse dehors. La Table Ronde accueille tout le monde, sauf la haine.",
  "Même le plus obscur des seigneurs des ténèbres a plus de classe que ça. Essaie avec un mot qui respecte les gens.",
];

const INSULT_MESSAGES = [
  "Holà, manant ! Ici on juge des mots, on ne s'insulte pas. Choisis mieux tes mots, la Table Ronde t'écoute.",
  "Même Léodagan, qui insulte la moitié du royaume, t'aurait demandé de te calmer. Essaie un mot plus noble.",
  "Les insultes, c'est pas chouffin, c'est juste nul. Retente avec un vrai mot, jeune padawan.",
  "Ce mot a été banni du royaume. Un gobelin de niveau 1 trouverait mieux. Allez, un effort.",
  "Tu vaux mieux que ça. Un vrai chouffin argumente avec des répliques cultes, pas avec des gros mots.",
];

const LEET: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  $: "s",
  "€": "e",
};

const collapse = (s: string) => s.replace(/(.)\1+/g, "$1");
const isStretched = (s: string) => /(.)\1\1/.test(s);

function tokenIn(token: string, list: Set<string>, collapsedList: Set<string>): boolean {
  const singular = token.length > 3 && /[sx]$/.test(token) ? token.slice(0, -1) : token;
  if (list.has(token) || list.has(singular)) return true;
  return isStretched(token) && (collapsedList.has(collapse(token)) || collapsedList.has(collapse(singular)));
}

function rootIn(compact: string, roots: string[]): boolean {
  if (roots.some((root) => compact.includes(root))) return true;
  if (!isStretched(compact)) return false;
  const collapsed = collapse(compact);
  return roots.some((root) => collapsed.includes(collapse(root)));
}

function buildMatcher(roots: string[], tokens: string[], phrases: RegExp[]) {
  const tokenSet = new Set(tokens);
  const collapsedTokens = new Set(tokens.map(collapse));
  return (spaced: string, words: string[], compact: string) => {
    if (words.some((word) => tokenIn(word, tokenSet, collapsedTokens))) return true;
    // Lettres espacées ("p d", "f.d.p") : on teste la saisie recollée.
    if (words.length > 1 && words.every((word) => word.length <= 2) && tokenIn(compact, tokenSet, collapsedTokens)) {
      return true;
    }
    if (rootIn(compact, roots)) return true;
    return phrases.some((phrase) => phrase.test(spaced));
  };
}

const isHate = buildMatcher(HATE_ROOTS, HATE_TOKENS, HATE_PHRASES);
const isInsult = buildMatcher(INSULT_ROOTS, INSULT_TOKENS, INSULT_PHRASES);

function pick(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function moderate(input: string): ModerationResult {
  const lower = input.toLowerCase();
  if (HATE_NUMBERS.test(lower)) return { blocked: true, kind: "hate", message: pick(HATE_MESSAGES) };

  const decoded = lower
    .replace(/[013457@$€]/g, (char) => LEET[char] ?? char)
    .replace(/(?<=\p{L})[!|](?=\p{L})/gu, "i");
  const spaced = normalizeKey(decoded);
  const words = spaced.split(" ").filter(Boolean);
  const compact = words.join("");

  if (isHate(spaced, words, compact)) return { blocked: true, kind: "hate", message: pick(HATE_MESSAGES) };
  if (isInsult(spaced, words, compact)) return { blocked: true, kind: "insult", message: pick(INSULT_MESSAGES) };
  return { blocked: false };
}

/**
 * Prénoms courants (sans ceux qui sont aussi des mots usuels, comme Pierre, Rose ou Claire).
 * Sert à repérer les saisies du type "Prénom Nom" : on ne laisse pas la communauté
 * voter pour classer une personne réelle comme chouffin.
 */
const FIRST_NAMES = new Set(
  (
    "jean paul jacques michel philippe alain nicolas christophe patrick daniel bernard eric frederic laurent " +
    "stephane david olivier julien sebastien thomas alexandre antoine maxime kevin anthony jeremy romain guillaume " +
    "mathieu matthieu vincent francois benjamin florian jonathan jordan dylan lucas hugo theo louis gabriel arthur " +
    "jules leo raphael adam nathan enzo mathis noah tom ethan clement quentin adrien baptiste bastien cedric damien " +
    "fabien franck gregory jerome ludovic mickael michael pascal sylvain thierry yannick yann loic marc cyril remi " +
    "samuel simon victor axel valentin alexis kylian marie nathalie isabelle sylvie catherine christine sandrine " +
    "sophie celine stephanie valerie veronique julie aurelie emilie laura sarah camille manon lea chloe emma louise " +
    "alice lina mila anna ines juliette lola clara pauline marine marion amandine melanie elodie audrey caroline " +
    "charlotte lucie oceane morgane justine mathilde anais laetitia severine virginie delphine karine helene agnes " +
    "beatrice brigitte chantal monique nicole francoise jacqueline martine dominique patricia florence cecile elise " +
    "eva zoe jeanne margaux maelys mohamed mohammed karim mehdi sofiane yassine rayan bilal nadia yasmine fatima " +
    "amine samir nabil rachid farid hakim aicha leila myriam ibrahim moussa mamadou fatou awa aminata"
  ).split(" "),
);

/** "kevin" tout seul passe (c'est un mème), "kevin dupont" ressemble à une vraie personne. */
export function looksLikePersonName(key: string): boolean {
  const words = key.split(" ");
  return words.length >= 2 && words.length <= 4 && words.some((word) => FIRST_NAMES.has(word));
}

export const PERSON_NAME_MESSAGE =
  "Ça ressemble au nom d'une vraie personne. Ici on juge des trucs, pas des gens : pas de vote sur les noms de personnes.";
