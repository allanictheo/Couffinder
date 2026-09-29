/**
 * Stockage des votes : Upstash Redis en production, mémoire locale en développement.
 *
 * Variables d'environnement reconnues (créées automatiquement par l'intégration
 * Upstash de Vercel) : KV_REST_API_URL + KV_REST_API_TOKEN, ou
 * UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 */

import { Redis } from "@upstash/redis";
import type { VoteChoice, VoteCounts } from "./types";

const VOTER_TTL_SECONDS = 60 * 60 * 24 * 365;

export interface VoteOutcome {
  alreadyVoted: boolean;
  votes: VoteCounts;
}

export interface Store {
  persistent: boolean;
  getVotes(key: string): Promise<VoteCounts>;
  getLabel(key: string): Promise<string | null>;
  /** Enregistre un vote, sauf si ce votant a déjà voté pour ce mot. */
  addVote(key: string, choice: VoteChoice, voterId: string, label: string): Promise<VoteOutcome>;
  /** Tient à jour l'ensemble des mots adoptés par la communauté. */
  setAdopted(key: string, adopted: boolean): Promise<void>;
  stats(): Promise<{ votes: number; adopted: number }>;
  /** Fenêtre fixe : renvoie false quand la limite est dépassée. */
  allow(bucket: string, id: string, limit: number, windowSeconds: number): Promise<boolean>;
}

const toCounts = (raw: Record<string, unknown> | null): VoteCounts => ({
  chouffin: Number(raw?.c ?? 0),
  pasChouffin: Number(raw?.p ?? 0),
});

class RedisStore implements Store {
  persistent = true;

  constructor(private redis: Redis) {}

  async getVotes(key: string) {
    return toCounts(await this.redis.hgetall(`cf:v:${key}`));
  }

  async getLabel(key: string) {
    // Upstash désérialise automatiquement : un label "1337" reviendrait en nombre.
    const label = await this.redis.get<string | number>(`cf:label:${key}`);
    return label === null ? null : String(label);
  }

  async addVote(key: string, choice: VoteChoice, voterId: string, label: string) {
    const fresh = await this.redis.set(`cf:voter:${voterId}:${key}`, choice, { nx: true, ex: VOTER_TTL_SECONDS });
    if (fresh !== "OK") return { alreadyVoted: true, votes: await this.getVotes(key) };

    const field = choice === "chouffin" ? "c" : "p";
    const [, , , raw] = await this.redis
      .multi()
      .hincrby(`cf:v:${key}`, field, 1)
      .hincrby("cf:stats", "votes", 1)
      .set(`cf:label:${key}`, label, { nx: true })
      .hgetall(`cf:v:${key}`)
      .exec<[number, number, string | null, Record<string, unknown> | null]>();
    return { alreadyVoted: false, votes: toCounts(raw) };
  }

  async setAdopted(key: string, adopted: boolean) {
    if (adopted) await this.redis.sadd("cf:adopted", key);
    else await this.redis.srem("cf:adopted", key);
  }

  async stats() {
    const [votes, adopted] = await Promise.all([this.redis.hget<number>("cf:stats", "votes"), this.redis.scard("cf:adopted")]);
    return { votes: Number(votes ?? 0), adopted };
  }

  async allow(bucket: string, id: string, limit: number, windowSeconds: number) {
    const window = Math.floor(Date.now() / 1000 / windowSeconds);
    const rateKey = `cf:rl:${bucket}:${id}:${window}`;
    const [count] = await this.redis.multi().incr(rateKey).expire(rateKey, windowSeconds).exec<[number, number]>();
    return count <= limit;
  }
}

/** Non persistant : sert en local, ou tant que Redis n'est pas branché sur Vercel. */
class MemoryStore implements Store {
  persistent = false;
  private votes = new Map<string, VoteCounts>();
  private labels = new Map<string, string>();
  private voters = new Set<string>();
  private adopted = new Set<string>();
  private rates = new Map<string, number>();
  private total = 0;

  async getVotes(key: string) {
    return { ...(this.votes.get(key) ?? { chouffin: 0, pasChouffin: 0 }) };
  }

  async getLabel(key: string) {
    return this.labels.get(key) ?? null;
  }

  async addVote(key: string, choice: VoteChoice, voterId: string, label: string) {
    const voterKey = `${voterId}:${key}`;
    if (this.voters.has(voterKey)) return { alreadyVoted: true, votes: await this.getVotes(key) };
    this.voters.add(voterKey);
    const counts = await this.getVotes(key);
    if (choice === "chouffin") counts.chouffin += 1;
    else counts.pasChouffin += 1;
    this.votes.set(key, counts);
    if (!this.labels.has(key)) this.labels.set(key, label);
    this.total += 1;
    return { alreadyVoted: false, votes: { ...counts } };
  }

  async setAdopted(key: string, adopted: boolean) {
    if (adopted) this.adopted.add(key);
    else this.adopted.delete(key);
  }

  async stats() {
    return { votes: this.total, adopted: this.adopted.size };
  }

  async allow(bucket: string, id: string, limit: number, windowSeconds: number) {
    const window = Math.floor(Date.now() / 1000 / windowSeconds);
    const rateKey = `${bucket}:${id}:${window}`;
    const count = (this.rates.get(rateKey) ?? 0) + 1;
    this.rates.set(rateKey, count);
    if (this.rates.size > 10_000) this.rates.clear();
    return count <= limit;
  }
}

function createStore(): Store {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return new RedisStore(new Redis({ url, token }));
  if (process.env.VERCEL_ENV === "production") {
    console.warn("[chouffinder] Aucune base Redis configurée : les votes ne seront pas conservés.");
  }
  return new MemoryStore();
}

const globalStore = globalThis as unknown as { chouffinderStore?: Store };

export function getStore(): Store {
  globalStore.chouffinderStore ??= createStore();
  return globalStore.chouffinderStore;
}
