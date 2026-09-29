/**
 * Fusionne les lots produits par l'agent juge-chouffin (scripts/seed/lot-N/part-NN.json)
 * en une seule base validée : src/data/words.json.
 *
 * Usage : npm run words
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { normalizeKey, stripArticle } from "../src/lib/normalize.ts";

const CATEGORIES = new Set([
  "series-films", "jeux-video", "fantasy-jdr", "histoire-mythes", "musique", "youtube-internet", "boissons",
  "nourriture", "mode-style", "sport", "loisirs", "tech", "lieux-events", "personnalites", "quotidien",
]);

interface Entry {
  word: string;
  chouffin: boolean;
  score: number;
  reason: string;
  category: string;
  aliases?: string[];
}

const SEED_DIR = "scripts/seed";
const OUTPUT = "src/data/words.json";

const files = readdirSync(SEED_DIR, { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".json"))
  .sort();

const errors: string[] = [];
const warnings: string[] = [];
const byKey = new Map<string, Entry>();
const taken = new Map<string, string>();

const forms = (text: string) => {
  const key = normalizeKey(text);
  return [...new Set([key, stripArticle(key), key.replace(/ /g, "")])];
};

for (const file of files) {
  const entries = JSON.parse(readFileSync(join(SEED_DIR, file), "utf8")) as Entry[];
  for (const raw of entries) {
    const where = `${file} "${raw.word}"`;
    const entry: Entry = {
      word: String(raw.word ?? "").trim(),
      chouffin: raw.chouffin,
      score: raw.score,
      reason: String(raw.reason ?? "").trim(),
      category: raw.category,
    };

    if (!entry.word) errors.push(`${where} : mot vide`);
    if (!Number.isInteger(entry.score) || entry.score < 0 || entry.score > 100) errors.push(`${where} : score invalide`);
    if (entry.chouffin !== entry.score >= 51) errors.push(`${where} : chouffin incohérent avec le score`);
    if (!entry.reason || entry.reason.length > 140) errors.push(`${where} : justification vide ou > 140 caractères`);
    if (!CATEGORIES.has(entry.category)) errors.push(`${where} : catégorie inconnue "${entry.category}"`);
    if (/—/.test(entry.word + entry.reason + (raw.aliases ?? []).join(""))) errors.push(`${where} : tiret cadratin interdit`);

    const key = normalizeKey(entry.word);
    if (taken.has(key) || byKey.has(key)) {
      warnings.push(`${where} : doublon de "${taken.get(key) ?? byKey.get(key)?.word}", ignoré`);
      continue;
    }

    const aliases: string[] = [];
    for (const alias of raw.aliases ?? []) {
      const aliasKey = normalizeKey(alias);
      if (!aliasKey || aliasKey === key || aliases.some((kept) => normalizeKey(kept) === aliasKey)) continue;
      if (taken.has(aliasKey) || byKey.has(aliasKey)) {
        warnings.push(`${where} : alias "${alias}" déjà pris, ignoré`);
        continue;
      }
      aliases.push(alias);
    }
    if (aliases.length > 0) entry.aliases = aliases;

    byKey.set(key, entry);
    for (const form of forms(entry.word)) if (!taken.has(form)) taken.set(form, entry.word);
    for (const alias of aliases) for (const form of forms(alias)) if (!taken.has(form)) taken.set(form, entry.word);
  }
}

// Un alias ne doit pas masquer un vrai mot déclaré plus loin.
for (const entry of byKey.values()) {
  entry.aliases = entry.aliases?.filter((alias) => {
    const clash = byKey.get(normalizeKey(alias));
    if (clash && clash !== entry) warnings.push(`"${entry.word}" : alias "${alias}" est aussi un mot, retiré`);
    return !clash || clash === entry;
  });
  if (entry.aliases?.length === 0) delete entry.aliases;
}

for (const warning of warnings) console.warn(`attention : ${warning}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`erreur : ${error}`);
  process.exit(1);
}

const words = [...byKey.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, entry]) => entry);
writeFileSync(OUTPUT, `[\n${words.map((entry) => `  ${JSON.stringify(entry)}`).join(",\n")}\n]\n`);

const chouffin = words.filter((entry) => entry.chouffin).length;
console.log(`${words.length} mots (${chouffin} chouffin, ${Math.round((chouffin / words.length) * 100)} %) écrits dans ${OUTPUT}`);
