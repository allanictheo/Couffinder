import { vote } from "@/lib/judge";
import { clientIp, NO_STORE, voterId } from "@/lib/request";
import { getStore } from "@/lib/store";
import type { VoteResponse } from "@/lib/types";

export async function POST(request: Request) {
  if (!(await getStore().allow("vote", clientIp(request), 20, 60))) {
    const body: VoteResponse = { ok: false, error: "Tu votes plus vite que ton ombre. Pause chope, puis reviens dans une minute." };
    return Response.json(body, { status: 429, headers: NO_STORE });
  }

  const payload: unknown = await request.json().catch(() => null);
  const { q, vote: choice } = (payload ?? {}) as { q?: unknown; vote?: unknown };
  const body = await vote(q, choice, voterId(request));
  return Response.json(body, { status: body.ok ? 200 : 400, headers: NO_STORE });
}
