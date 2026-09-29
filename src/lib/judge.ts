/**
 * Le tribunal : combine le verdict de l'agent et les votes de la communauté.
 *
 * - Mot de la base : l'avis de l'agent compte pour AGENT_WEIGHT votes. Le verdict
 *   bascule dès que la communauté le contredit en majorité.
 * - Mot inconnu : « C'est pas faux », jusqu'à ADOPTION_THRESHOLD votes et une majorité
 *   claire. Il entre alors dans la base avec le verdict de la communauté.
 */

import { looksLikePersonName, moderate, PERSON_NAME_MESSAGE } from "./moderation";
import { checkInput } from "./normalize";
import { getStore } from "./store";
import type { JudgeResult, KnownResult, VoteChoice, VoteCounts, VoteResponse } from "./types";
import { findWord, type IndexedWord } from "./words";

export const AGENT_WEIGHT = 5;
export const ADOPTION_THRESHOLD = 3;
const LEGENDARY_SCORE = 95;

function fromSeed(entry: IndexedWord, votes: VoteCounts): KnownResult {
  const forChouffin = (entry.chouffin ? AGENT_WEIGHT : 0) + votes.chouffin;
  const against = (entry.chouffin ? 0 : AGENT_WEIGHT) + votes.pasChouffin;
  const chouffin = forChouffin === against ? entry.chouffin : forChouffin > against;
  return {
    status: "known",
    key: entry.key,
    word: entry.word,
    chouffin,
    score: entry.score,
    reason: entry.reason,
    category: entry.category,
    agentVerdict: entry.chouffin,
    votes,
    flipped: chouffin !== entry.chouffin,
    legendary: chouffin && entry.score >= LEGENDARY_SCORE,
    source: "agent",
  };
}

const ADOPTED_REASONS = [
  "Adopté par la communauté : {c} voix contre {p}. La Table Ronde a tranché.",
  "L'Oracle ne le connaissait pas, mais les chouffins ont parlé : {c} voix pour, {p} contre.",
  "Voté chouffin en taverne, {c} voix contre {p}. Santé !",
];

const REJECTED_REASONS = [
  "Recalé par la communauté : {p} voix contre {c}. Même Perceval a compris.",
  "La taverne a voté : pas chouffin, {p} voix contre {c}. Circulez, manants.",
  "Jugé indigne de la Table Ronde par {p} voix contre {c}.",
];

/** Choix stable d'une variante de texte pour un mot donné. */
function variant(key: string, texts: string[]): string {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return texts[hash % texts.length];
}

function fromCommunity(key: string, word: string, votes: VoteCounts): JudgeResult {
  if (looksLikePersonName(key)) {
    return { status: "unknown", key, word, votes, votesNeeded: 0, votingDisabledReason: PERSON_NAME_MESSAGE };
  }

  const total = votes.chouffin + votes.pasChouffin;
  if (total < ADOPTION_THRESHOLD || votes.chouffin === votes.pasChouffin) {
    return { status: "unknown", key, word, votes, votesNeeded: Math.max(ADOPTION_THRESHOLD - total, 1) };
  }

  const chouffin = votes.chouffin > votes.pasChouffin;
  const reason = variant(key, chouffin ? ADOPTED_REASONS : REJECTED_REASONS)
    .replace("{c}", String(votes.chouffin))
    .replace("{p}", String(votes.pasChouffin));
  const score = Math.round((votes.chouffin / total) * 100);
  return {
    status: "known",
    key,
    word,
    chouffin,
    score,
    reason,
    category: null,
    agentVerdict: null,
    votes,
    flipped: false,
    legendary: chouffin && votes.chouffin >= 20 && score >= LEGENDARY_SCORE,
    source: "communaute",
  };
}

type Checked =
  | { ok: false; result: Extract<JudgeResult, { status: "invalid" | "blocked" }> }
  | { ok: true; key: string; label: string; entry: IndexedWord | null };

function check(raw: unknown): Checked {
  const input = checkInput(raw);
  if (!input.ok) return { ok: false, result: { status: "invalid", message: input.message } };
  const moderation = moderate(input.label);
  if (moderation.blocked) return { ok: false, result: { status: "blocked", message: moderation.message } };
  return { ok: true, key: input.key, label: input.label, entry: findWord(input.key) };
}

export async function judge(raw: unknown): Promise<JudgeResult> {
  const checked = check(raw);
  if (!checked.ok) return checked.result;

  const store = getStore();
  if (checked.entry) return fromSeed(checked.entry, await store.getVotes(checked.entry.key));

  const [votes, label] = await Promise.all([store.getVotes(checked.key), store.getLabel(checked.key)]);
  return fromCommunity(checked.key, label ?? checked.label, votes);
}

export async function vote(raw: unknown, choice: unknown, voterId: string): Promise<VoteResponse> {
  if (choice !== "chouffin" && choice !== "pas-chouffin") {
    return { ok: false, error: "Il faut choisir : chouffin ou pas chouffin. Pas de « ni oui ni non », on n'est pas en Normandie." };
  }
  const checked = check(raw);
  if (!checked.ok) return { ok: false, error: checked.result.message };

  const store = getStore();
  const { entry } = checked;
  if (entry) {
    const outcome = await store.addVote(entry.key, choice as VoteChoice, voterId, entry.word);
    return { ok: true, alreadyVoted: outcome.alreadyVoted, result: fromSeed(entry, outcome.votes) };
  }

  if (looksLikePersonName(checked.key)) return { ok: false, error: PERSON_NAME_MESSAGE };

  const outcome = await store.addVote(checked.key, choice as VoteChoice, voterId, checked.label);
  const label = (await store.getLabel(checked.key)) ?? checked.label;
  const result = fromCommunity(checked.key, label, outcome.votes);
  if (!outcome.alreadyVoted) await store.setAdopted(checked.key, result.status === "known");
  return { ok: true, alreadyVoted: outcome.alreadyVoted, result };
}
