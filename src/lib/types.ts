/**
 * Contrats partagés entre l'API et l'interface de Chouffinder.
 */

export const CATEGORIES = [
  "series-films",
  "jeux-video",
  "fantasy-jdr",
  "histoire-mythes",
  "musique",
  "youtube-internet",
  "boissons",
  "nourriture",
  "mode-style",
  "sport",
  "loisirs",
  "tech",
  "lieux-events",
  "personnalites",
  "quotidien",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Les tribus de chouffin : chaque tribu a ses propres animations easter egg. */
export const TRIBES = ["gamer", "geek", "metal", "taverne", "weeb", "roliste"] as const;

export type Tribe = (typeof TRIBES)[number];

/** Une entrée de la base, telle que produite par l'agent juge-chouffin. */
export interface SeedWord {
  word: string;
  chouffin: boolean;
  /** Indice de chouffinitude de 0 à 100 (chouffin si >= 51). */
  score: number;
  reason: string;
  category: Category;
  /** Tribu de chouffin. Obligatoire pour un mot chouffin, présente pour un mot pas chouffin seulement s'il touche clairement l'univers d'une tribu. */
  tribe?: Tribe;
  aliases?: string[];
}

export type VoteChoice = "chouffin" | "pas-chouffin";

export interface VoteCounts {
  chouffin: number;
  pasChouffin: number;
}

/** Le mot est dans la base (jugé par l'agent ou adopté par la communauté). */
export interface KnownResult {
  status: "known";
  /** Clé normalisée, à renvoyer telle quelle à /api/vote. */
  key: string;
  /** Forme d'affichage. */
  word: string;
  /** Verdict final, après prise en compte des votes. */
  chouffin: boolean;
  /** Indice de chouffinitude (0-100) : celui de l'agent, ou le % de votes chouffin pour un mot adopté par la communauté. */
  score: number;
  reason: string;
  category: Category | null;
  /** Tribu du mot (thème des animations), null pour un mot neutre ou adopté par la communauté. */
  tribe: Tribe | null;
  /** Verdict initial de l'agent, null si le mot a été ajouté par la communauté. */
  agentVerdict: boolean | null;
  votes: VoteCounts;
  /** true si la communauté a renversé le verdict de l'agent. */
  flipped: boolean;
  /** Mot légendaire (score >= 95) : l'animation MLG est systématique. */
  legendary: boolean;
  source: "agent" | "communaute";
}

/** Mot inconnu : écran « C'est pas faux », la communauté peut voter pour l'ajouter. */
export interface UnknownResult {
  status: "unknown";
  key: string;
  word: string;
  votes: VoteCounts;
  /** Nombre de votes encore nécessaires avant que le mot entre dans la base. */
  votesNeeded: number;
  /** Présent quand le vote est désactivé pour ce mot (ex. : nom d'une personne réelle). À afficher à la place des boutons de vote. */
  votingDisabledReason?: string;
}

/** Mot injurieux ou haineux : on invite l'utilisateur à mieux choisir ses mots. */
export interface BlockedResult {
  status: "blocked";
  message: string;
}

/** Saisie vide, trop longue ou avec des caractères interdits. */
export interface InvalidResult {
  status: "invalid";
  message: string;
}

export type JudgeResult = KnownResult | UnknownResult | BlockedResult | InvalidResult;

/** GET /api/judge?q=<mot> renvoie un JudgeResult (HTTP 200, sauf 429 en cas d'abus). */
export type JudgeResponse = JudgeResult;

/** POST /api/vote, corps JSON. */
export interface VoteRequest {
  /** Le mot tel que saisi (ou la clé renvoyée par /api/judge). */
  q: string;
  vote: VoteChoice;
}

/** Réponse de POST /api/vote. */
export type VoteResponse =
  | {
      ok: true;
      /** true si ce visiteur avait déjà voté pour ce mot : le vote n'est pas recompté. */
      alreadyVoted: boolean;
      /** Le résultat mis à jour après le vote (peut passer de unknown à known, ou être renversé). */
      result: JudgeResult;
    }
  | { ok: false; error: string };

/** GET /api/stats */
export interface StatsResponse {
  words: number;
  chouffinWords: number;
  votes: number;
  persistent: boolean;
}
