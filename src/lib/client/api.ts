/**
 * Client HTTP de l'interface. Toutes les erreurs sont converties en ApiError
 * pour que l'UI n'ait qu'un seul type à gérer.
 */

import type { JudgeResponse, StatsResponse, VoteRequest, VoteResponse } from "@/lib/types";

export type ApiErrorKind = "network" | "rate-limit" | "http" | "aborted";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  /** Message lisible renvoyé par l'API (champ `message` ou `error`), s'il y en a un. */
  readonly serverMessage: string | null;

  constructor(kind: ApiErrorKind, status: number | null = null, serverMessage: string | null = null) {
    super(serverMessage ?? kind);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.serverMessage = serverMessage;
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function pickMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  if (typeof record.error === "string") return record.error;
  if (typeof record.message === "string") return record.message;
  return null;
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      ...init,
      headers: { Accept: "application/json", ...init.headers },
    });
  } catch (error) {
    if (isAbortError(error)) throw new ApiError("aborted");
    throw new ApiError("network");
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch (error) {
    if (isAbortError(error)) throw new ApiError("aborted");
    payload = null;
  }

  if (response.status === 429) throw new ApiError("rate-limit", 429, pickMessage(payload));
  if (!response.ok) throw new ApiError("http", response.status, pickMessage(payload));
  if (payload === null) throw new ApiError("http", response.status);
  return payload as T;
}

export function fetchJudge(q: string, signal?: AbortSignal): Promise<JudgeResponse> {
  return request<JudgeResponse>(`/api/judge?q=${encodeURIComponent(q)}`, { signal });
}

export function postVote(body: VoteRequest, signal?: AbortSignal): Promise<VoteResponse> {
  return request<VoteResponse>("/api/vote", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    signal,
  });
}

export function fetchStats(signal?: AbortSignal): Promise<StatsResponse> {
  return request<StatsResponse>("/api/stats", { signal });
}

export function toApiError(error: unknown): ApiError {
  return error instanceof ApiError ? error : new ApiError("network");
}
