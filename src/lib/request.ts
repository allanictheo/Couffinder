import { createHash } from "node:crypto";

/** Adresse du visiteur (Vercel renseigne x-forwarded-for). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}

/** Identifiant de votant anonyme : on ne stocke jamais l'IP en clair. */
export function voterId(request: Request): string {
  const salt = process.env.VOTE_SALT ?? "chouffinder-le-gras-c-est-la-vie";
  return createHash("sha256").update(`${salt}:${clientIp(request)}`).digest("hex").slice(0, 32);
}

export const NO_STORE = { "Cache-Control": "no-store" };
